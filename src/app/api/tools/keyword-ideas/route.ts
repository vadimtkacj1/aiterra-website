import { NextResponse, type NextRequest } from 'next/server'
import {
  buildQueries,
  groupKeywords,
  normalizeSeed,
  parseSuggestions,
  type KeywordIdeasResponse,
  type KeywordQuery,
} from '@/lib/keyword-ideas'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const SUGGEST_URL = 'https://suggestqueries.google.com/complete/search'
const USER_AGENT = 'Mozilla/5.0 (compatible; AiterraKeywordIdeas/1.0; +https://www.aiterra.co.il/tools/keyword-ideas)'
const FETCH_TIMEOUT_MS = 5000
const CONCURRENCY = 6
const MAX_BODY = 1024
const RATE_LIMIT = 10
const RATE_WINDOW_MS = 10 * 60_000
const MAX_TRACKED_CLIENTS = 5000
const CACHE_TTL_MS = 60 * 60_000
const CACHE_LIMIT = 500
const ALLOWED_ORIGINS = new Set(['www.aiterra.co.il', 'aiterra.co.il'])
const LOCAL_ORIGIN = /^(localhost|127\.0\.0\.1)(:\d+)?$/

const hits = new Map<string, number[]>()
const cache = new Map<string, { at: number; response: KeywordIdeasResponse }>()

const json = (body: unknown, status = 200, headers: Record<string, string> = {}) =>
  NextResponse.json(body, { status, headers: { 'Cache-Control': 'no-store', ...headers } })

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

async function readSeed(request: NextRequest) {
  if (Number(request.headers.get('content-length') ?? 0) > MAX_BODY) return null
  try {
    const text = await request.text()
    if (text.length > MAX_BODY) return null
    const data = JSON.parse(text) as { seed?: unknown } | null
    return data && typeof data.seed === 'string' ? normalizeSeed(data.seed) : null
  } catch {
    return null
  }
}

async function suggest(query: string) {
  const params = new URLSearchParams({ client: 'firefox', hl: 'iw', gl: 'il', ie: 'utf-8', oe: 'utf-8', q: query })
  try {
    const response = await fetch(`${SUGGEST_URL}?${params}`, {
      headers: { 'User-Agent': USER_AGENT, Accept: 'application/json' },
      signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
      cache: 'no-store',
    })
    if (!response.ok) return null
    return parseSuggestions(await response.json())
  } catch {
    return null
  }
}

async function expand(queries: KeywordQuery[]) {
  const results: { group: KeywordQuery['group']; suggestions: string[] | null }[] = new Array(queries.length)
  let next = 0
  const worker = async () => {
    while (next < queries.length) {
      const index = next++
      results[index] = { group: queries[index].group, suggestions: await suggest(queries[index].query) }
    }
  }
  await Promise.all(Array.from({ length: CONCURRENCY }, worker))
  return results
}

function remember(seed: string, response: KeywordIdeasResponse) {
  cache.delete(seed)
  cache.set(seed, { at: Date.now(), response })
  if (cache.size > CACHE_LIMIT) {
    const oldest = cache.keys().next().value
    if (oldest !== undefined) cache.delete(oldest)
  }
}

export async function POST(request: NextRequest) {
  if (!originAllowed(request)) return json({ ok: false, error: 'forbidden' }, 403)
  const seed = await readSeed(request)
  if (!seed) return json({ ok: false, error: 'invalid' }, 400)

  const cached = cache.get(seed)
  if (cached && Date.now() - cached.at < CACHE_TTL_MS) return json({ ok: true, ...cached.response })

  const slot = takeSlot(clientKey(request), Date.now())
  if (!slot.ok) return json({ ok: false, error: 'rate' }, 429, { 'Retry-After': String(slot.retryAfter) })

  const results = await expand(buildQueries(seed))
  const answered = results.filter((result) => result.suggestions !== null)
  if (!answered.length) return json({ ok: false, error: 'upstream' }, 502)

  const response = groupKeywords(
    seed,
    answered.map((result) => ({ group: result.group, suggestions: result.suggestions ?? [] })),
  )
  if (answered.length === results.length) remember(seed, response)
  return json({ ok: true, ...response })
}
