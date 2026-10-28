import { NextResponse, type NextRequest } from 'next/server'
import {
  RATE_LIMIT,
  RATE_WINDOW_MS,
  SERVER_TIMEOUT_MS,
  buildReport,
  parseTarget,
  type PsiResponse,
  type ServerError,
  type SpeedReport,
  type Strategy,
} from '@/lib/website-speed'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
export const maxDuration = 60

const PSI_ENDPOINT = 'https://www.googleapis.com/pagespeedonline/v5/runPagespeed'
const MAX_BODY = 4096
const MAX_CONCURRENT = 6
const MAX_TRACKED_CLIENTS = 5000
const CACHE_TTL_MS = 10 * 60 * 1000
const MAX_CACHED = 300
const ALLOWED_ORIGINS = new Set(['www.aiterra.co.il', 'aiterra.co.il'])
const LOCAL_ORIGIN = /^(localhost|127\.0\.0\.1)(:\d+)?$/
const UNREACHABLE = /DNS_FAILURE|FAILED_DOCUMENT_REQUEST|ERRORED_DOCUMENT_REQUEST|INVALID_URL|NOT_HTML|INSECURE_DOCUMENT/i
const STRATEGIES = new Set<Strategy>(['mobile', 'desktop'])

const hits = new Map<string, number[]>()
const cache = new Map<string, { at: number; report: SpeedReport }>()
let active = 0

const json = (body: unknown, status = 200, headers: Record<string, string> = {}) =>
  NextResponse.json(body, { status, headers: { 'Cache-Control': 'no-store', ...headers } })

const failure = (error: ServerError, status: number, extra: Record<string, unknown> = {}, headers = {}) =>
  json({ ok: false, error, ...extra }, status, headers)

const firstValue = (request: NextRequest, name: string) => request.headers.get(name)?.split(',')[0]?.trim() ?? ''

const clientKey = (request: NextRequest) =>
  firstValue(request, 'x-real-ip') ||
  firstValue(request, 'cf-connecting-ip') ||
  firstValue(request, 'x-forwarded-for') ||
  'unknown'

function takeSlot(client: string, now: number) {
  const recent = (hits.get(client) ?? []).filter((time) => now - time < RATE_WINDOW_MS)
  hits.delete(client)
  if (recent.length >= RATE_LIMIT) {
    hits.set(client, recent)
    return { ok: false as const, retryAfter: Math.max(1, Math.ceil((recent[0] + RATE_WINDOW_MS - now) / 1000)) }
  }
  recent.push(now)
  hits.set(client, recent)
  if (hits.size > MAX_TRACKED_CLIENTS) {
    const oldest = hits.keys().next().value
    if (oldest !== undefined) hits.delete(oldest)
  }
  return { ok: true as const }
}

function originAllowed(request: NextRequest) {
  const origin = request.headers.get('origin')
  if (!origin) return true
  try {
    const host = new URL(origin).host
    return ALLOWED_ORIGINS.has(host) || LOCAL_ORIGIN.test(host)
  } catch {
    return false
  }
}

async function readInput(request: NextRequest) {
  if (Number(request.headers.get('content-length') ?? 0) > MAX_BODY) return null
  try {
    const body = (await request.json()) as { url?: unknown; strategy?: unknown }
    if (typeof body.url !== 'string') return null
    const strategy = (body.strategy ?? 'mobile') as Strategy
    if (!STRATEGIES.has(strategy)) return null
    return { url: body.url, strategy }
  } catch {
    return null
  }
}

function cached(key: string, now: number) {
  const entry = cache.get(key)
  if (!entry) return null
  if (now - entry.at > CACHE_TTL_MS) {
    cache.delete(key)
    return null
  }
  return entry.report
}

function remember(key: string, report: SpeedReport, now: number) {
  cache.set(key, { at: now, report })
  if (cache.size > MAX_CACHED) {
    const oldest = cache.keys().next().value
    if (oldest !== undefined) cache.delete(oldest)
  }
}

function psiUrl(target: string, strategy: Strategy) {
  const params = new URLSearchParams({ url: target, strategy, category: 'performance', locale: 'he' })
  const key = process.env.PAGESPEED_API_KEY
  if (key) params.set('key', key)
  return `${PSI_ENDPOINT}?${params}`
}

function classify(status: number, message: string): { error: ServerError; status: number } {
  if (status === 429) return { error: 'quota', status: 429 }
  if (UNREACHABLE.test(message)) return { error: 'unreachable', status: 422 }
  if (/Lighthouse returned error|NO_FCP|NO_LCP|PROTOCOL_TIMEOUT|TARGET_CRASHED/i.test(message)) {
    return { error: 'lighthouse', status: 502 }
  }
  return { error: 'internal', status: 502 }
}

export async function POST(request: NextRequest) {
  if (!originAllowed(request)) return failure('forbidden', 403)
  const input = await readInput(request)
  if (input === null) return failure('bad-request', 400)
  const target = parseTarget(input.url)
  if (!target.ok) return json({ ok: false, error: target.error }, 400)
  const cacheKey = `${input.strategy} ${target.url}`
  const now = Date.now()
  const hit = cached(cacheKey, now)
  if (hit) return json({ ok: true, report: hit })
  const slot = takeSlot(clientKey(request), now)
  if (!slot.ok) {
    return failure('rate-limited', 429, { retryAfter: slot.retryAfter }, { 'Retry-After': String(slot.retryAfter) })
  }
  if (active >= MAX_CONCURRENT) return failure('busy', 503, {}, { 'Retry-After': '30' })
  active += 1
  try {
    const response = await fetch(psiUrl(target.url, input.strategy), {
      signal: AbortSignal.timeout(SERVER_TIMEOUT_MS),
      cache: 'no-store',
    })
    const data = (await response.json().catch(() => null)) as (PsiResponse & { error?: { message?: string } }) | null
    if (!response.ok || !data) {
      const message = data?.error?.message ?? ''
      const outcome = classify(response.status, message)
      if (outcome.error === 'internal') console.error('website-speed-test PSI error:', response.status, message.slice(0, 200))
      return failure(outcome.error, outcome.status)
    }
    const runtimeError = data.lighthouseResult?.runtimeError?.code ?? ''
    if (runtimeError && runtimeError !== 'NO_ERROR') {
      const outcome = classify(200, runtimeError)
      return failure(outcome.error === 'internal' ? 'lighthouse' : outcome.error, outcome.status)
    }
    const report = buildReport(data, target.url, input.strategy)
    if (report.score === null) return failure('lighthouse', 502)
    remember(cacheKey, report, Date.now())
    return json({ ok: true, report })
  } catch (error) {
    if (error instanceof Error && (error.name === 'TimeoutError' || error.name === 'AbortError')) {
      return failure('timeout', 504)
    }
    console.error('website-speed-test failed:', error instanceof Error ? error.name : 'unknown')
    return failure('internal', 500)
  } finally {
    active -= 1
  }
}
