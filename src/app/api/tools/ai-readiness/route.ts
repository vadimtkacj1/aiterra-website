import { lookup } from 'node:dns/promises'
import http from 'node:http'
import https from 'node:https'
import zlib from 'node:zlib'
import type { LookupAddress } from 'node:dns'
import type { IncomingMessage } from 'node:http'
import { NextResponse, type NextRequest } from 'next/server'
import {
  MAX_REDIRECTS,
  RATE_LIMIT,
  RATE_WINDOW_MS,
  analyzeHtml,
  detectCdn,
  detectWall,
  isPublicAddress,
  parseTarget,
  robotsFacts,
  sitemapKind,
  validateUrl,
  type FetchOutcome,
  type HomeFacts,
  type LlmsFacts,
  type ProbeFacts,
  type RobotsFacts,
  type ServerError,
  type SiteFacts,
  type SitemapFacts,
} from '@/lib/ai-readiness'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const USER_AGENT = 'AiterraReadinessCheck/1.0 (+https://www.aiterra.co.il/tools/ai-readiness-checker)'
const PROBE_USER_AGENT = `Mozilla/5.0 (compatible; GPTBot/1.4; +https://openai.com/gptbot) ${USER_AGENT}`
const REQUEST_TIMEOUT_MS = 6000
const TOTAL_BUDGET_MS = 15000
const HOME_LIMIT = 1024 * 1024
const ROBOTS_LIMIT = 512 * 1024
const SMALL_LIMIT = 64 * 1024
const MAX_BODY = 4096
const MAX_CONCURRENT = 8
const MAX_TRACKED_CLIENTS = 5000
const REDIRECT_STATUSES = new Set([301, 302, 303, 307, 308])
const ALLOWED_ORIGINS = new Set(['www.aiterra.co.il', 'aiterra.co.il'])
const LOCAL_ORIGIN = /^(localhost|127\.0\.0\.1)(:\d+)?$/
const TLS_ERROR = /CERT|SSL|TLS|EPROTO/i

type Resolution = { ok: true; addresses: LookupAddress[] } | { ok: false; outcome: 'dns' | 'unsafe' | 'timeout' }

type RawResponse = {
  status: number
  headers: Record<string, string>
  robotsHeaders: string[]
  body: string
  truncated: boolean
  location: string | null
}

type FetchResult = {
  outcome: FetchOutcome
  url: URL
  status: number | null
  response: RawResponse | null
  redirects: { status: number; url: string }[]
}

type FetchOptions = {
  limit: number
  budget: AbortSignal
  dns: Map<string, Promise<Resolution>>
  userAgent?: string
  follow?: boolean
}

const hits = new Map<string, number[]>()
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

async function readUrl(request: NextRequest) {
  if (Number(request.headers.get('content-length') ?? 0) > MAX_BODY) return null
  try {
    const text = await request.text()
    if (text.length > MAX_BODY) return null
    const data = JSON.parse(text) as { url?: unknown } | null
    return data && typeof data.url === 'string' ? data.url : null
  } catch {
    return null
  }
}

function untilAborted<T>(promise: Promise<T>, signal: AbortSignal) {
  return new Promise<T>((resolve, reject) => {
    if (signal.aborted) {
      reject(signal.reason)
      return
    }
    const onAbort = () => reject(signal.reason)
    signal.addEventListener('abort', onAbort, { once: true })
    promise.then(
      (value) => {
        signal.removeEventListener('abort', onAbort)
        resolve(value)
      },
      (error) => {
        signal.removeEventListener('abort', onAbort)
        reject(error)
      },
    )
  })
}

async function resolveHost(host: string, signal: AbortSignal): Promise<Resolution> {
  try {
    const found = await untilAborted(lookup(host, { all: true }), signal)
    if (!found.length) return { ok: false, outcome: 'dns' }
    if (!found.every((entry) => isPublicAddress(entry.address))) return { ok: false, outcome: 'unsafe' }
    return { ok: true, addresses: [...found].sort((a, b) => a.family - b.family) }
  } catch {
    return { ok: false, outcome: signal.aborted ? 'timeout' : 'dns' }
  }
}

function resolveCached(host: string, options: FetchOptions) {
  let pending = options.dns.get(host)
  if (!pending) {
    pending = resolveHost(host, options.budget)
    options.dns.set(host, pending)
  }
  return pending
}

const pinnedLookup = (addresses: LookupAddress[]) =>
  ((_hostname: string, options: { all?: boolean } | undefined, callback: (...args: unknown[]) => void) => {
    if (options?.all) callback(null, addresses)
    else callback(null, addresses[0].address, addresses[0].family)
  }) as unknown as NonNullable<http.RequestOptions['lookup']>

function flatHeaders(message: IncomingMessage) {
  const result: Record<string, string> = {}
  for (const [key, value] of Object.entries(message.headers)) {
    if (value === undefined) continue
    result[key] = (Array.isArray(value) ? value.join(', ') : value).slice(0, 2048)
  }
  return result
}

function decompressorFor(encoding: string) {
  if (encoding === 'gzip' || encoding === 'x-gzip') return zlib.createGunzip()
  if (encoding === 'br') return zlib.createBrotliDecompress()
  if (encoding === 'deflate') return zlib.createInflate()
  return null
}

function decodeBody(buffer: Buffer, contentType: string) {
  const sniffed = /<meta[^>]{0,200}charset=["']?([\w-]+)/i.exec(buffer.subarray(0, 4096).toString('latin1'))
  const charset = /charset=["']?([\w-]+)/i.exec(contentType)?.[1] ?? sniffed?.[1] ?? 'utf-8'
  try {
    return new TextDecoder(charset.toLowerCase()).decode(buffer)
  } catch {
    return buffer.toString('utf8')
  }
}

function requestOnce(url: URL, addresses: LookupAddress[], limit: number, userAgent: string, signal: AbortSignal) {
  return new Promise<RawResponse>((resolve, reject) => {
    const client = url.protocol === 'https:' ? https : http
    const request = client.request(url, {
      method: 'GET',
      agent: false,
      lookup: pinnedLookup(addresses),
      signal,
      headers: {
        'User-Agent': userAgent,
        Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,text/plain;q=0.8,*/*;q=0.5',
        'Accept-Language': 'he-IL,he;q=0.9,en;q=0.8',
        'Accept-Encoding': 'gzip, deflate, br',
      },
    })
    request.on('error', reject)
    request.on('response', (response) => {
      const status = response.statusCode ?? 0
      const headers = flatHeaders(response)
      const robotsHeaders = (response.headersDistinct['x-robots-tag'] ?? []).slice(0, 10).map((value) => value.slice(0, 512))
      const location = REDIRECT_STATUSES.has(status) ? (headers.location ?? null) : null
      const base = { status, headers, robotsHeaders, location }
      if (location !== null || status === 204 || status === 304) {
        resolve({ ...base, body: '', truncated: false })
        response.resume()
        request.destroy()
        return
      }
      const decompressor = decompressorFor((headers['content-encoding'] ?? '').trim().toLowerCase())
      const stream = decompressor ? response.pipe(decompressor) : response
      const chunks: Buffer[] = []
      let size = 0
      let settled = false
      const finish = (truncated: boolean) => {
        if (settled) return
        settled = true
        resolve({ ...base, body: decodeBody(Buffer.concat(chunks), headers['content-type'] ?? ''), truncated })
        if (truncated) {
          request.destroy()
          decompressor?.destroy()
        }
      }
      const fail = (error: unknown) => {
        if (size > 0) finish(true)
        else if (!settled) {
          settled = true
          reject(error)
        }
      }
      stream.on('data', (chunk: Buffer) => {
        if (settled) return
        const room = limit - size
        if (chunk.length > room) {
          chunks.push(chunk.subarray(0, room))
          size = limit
          finish(true)
          return
        }
        chunks.push(chunk)
        size += chunk.length
      })
      stream.on('end', () => finish(false))
      stream.on('error', fail)
      if (decompressor) response.on('error', fail)
    })
    request.end()
  })
}

const errorOutcome = (error: unknown): FetchOutcome => {
  const code = String((error as { code?: unknown })?.code ?? '')
  return TLS_ERROR.test(code) ? 'tls' : 'network'
}

async function fetchFollow(start: URL, options: FetchOptions): Promise<FetchResult> {
  const redirects: FetchResult['redirects'] = []
  let url = start
  for (let hop = 0; ; hop += 1) {
    const result = (outcome: FetchOutcome, status: number | null = null, response: RawResponse | null = null) => ({
      outcome,
      url,
      status,
      response,
      redirects,
    })
    if (options.budget.aborted) return result('timeout')
    const resolution = await resolveCached(url.hostname, options)
    if (!resolution.ok) {
      if (resolution.outcome === 'unsafe') return result(hop === 0 ? 'unsafe' : 'redirect-blocked')
      return result(resolution.outcome === 'timeout' ? 'timeout' : hop === 0 ? 'dns' : 'network')
    }
    const signal = AbortSignal.any([options.budget, AbortSignal.timeout(REQUEST_TIMEOUT_MS)])
    let response: RawResponse
    try {
      const pending = requestOnce(url, resolution.addresses, options.limit, options.userAgent ?? USER_AGENT, signal)
      response = await untilAborted(pending, signal)
    } catch (error) {
      return result(signal.aborted ? 'timeout' : errorOutcome(error))
    }
    if (response.location === null || options.follow === false) return result('ok', response.status, response)
    if (hop >= MAX_REDIRECTS) return result('too-many-redirects', response.status)
    let next: URL
    try {
      next = new URL(response.location, url)
    } catch {
      return result('redirect-blocked', response.status)
    }
    if (!validateUrl(next).ok) return result('redirect-blocked', response.status)
    next.hash = ''
    redirects.push({ status: response.status, url: `${next.origin}${next.pathname}` })
    url = next
  }
}

const succeeded = (result: FetchResult) =>
  result.outcome === 'ok' && result.status !== null && result.status >= 200 && result.status < 300

const looksLikeHtml = (response: RawResponse) =>
  /html/i.test(response.headers['content-type'] ?? '') || /^\s*</.test(response.body.slice(0, 256))

function homeFacts(home: FetchResult): HomeFacts {
  const response = home.response
  return {
    outcome: home.outcome,
    status: home.status,
    wall: response ? detectWall(response.status, response.headers, response.body) : null,
    cdn: response ? detectCdn(response.headers) : null,
    truncated: response?.truncated ?? false,
    headerRobots: response?.robotsHeaders ?? [],
    html: response && succeeded(home) && looksLikeHtml(response) ? analyzeHtml(response.body) : null,
  }
}

function llmsFacts(result: FetchResult): LlmsFacts {
  const html = Boolean(result.response && succeeded(result) && /^\s*</.test(result.response.body.slice(0, 256)))
  return { outcome: result.outcome, status: result.status, found: succeeded(result) && !html, html }
}

function sitemapResult(result: FetchResult, source: SitemapFacts['source']): SitemapFacts {
  const kind = result.response ? sitemapKind(result.response.headers['content-type'] ?? '', result.response.body) : null
  return {
    outcome: result.outcome,
    status: result.status,
    url: `${result.url.origin}${result.url.pathname}`,
    source,
    found: succeeded(result) && kind !== 'other' && kind !== null,
    kind,
    offsite: null,
  }
}

async function sitemapFacts(
  fallback: FetchResult,
  robots: RobotsFacts,
  hosts: Set<string>,
  options: FetchOptions,
): Promise<SitemapFacts> {
  const facts = sitemapResult(fallback, 'default')
  if (facts.found || !robots.sitemaps.length) return facts
  const candidates = robots.sitemaps.flatMap((value) => {
    try {
      return [new URL(value)]
    } catch {
      return []
    }
  })
  const local = candidates.find((url) => hosts.has(url.host) && validateUrl(url).ok && url.href !== facts.url)
  if (!local) {
    const offsite = candidates.find((url) => !hosts.has(url.host))
    return { ...facts, offsite: offsite ? `${offsite.origin}${offsite.pathname}` : null }
  }
  return sitemapResult(await fetchFollow(local, { ...options, limit: SMALL_LIMIT }), 'robots')
}

async function inspect(target: { url: string; host: string }, resolution: Resolution, budget: AbortSignal) {
  const dns = new Map<string, Promise<Resolution>>([[target.host, Promise.resolve(resolution)]])
  const base = { budget, dns }
  const home = await fetchFollow(new URL(target.url), { ...base, limit: HOME_LIMIT })
  const at = (path: string) => new URL(path, home.url.origin)
  const [robots, llms, fallbackSitemap, probe] = await Promise.all([
    fetchFollow(at('/robots.txt'), { ...base, limit: ROBOTS_LIMIT }),
    fetchFollow(at('/llms.txt'), { ...base, limit: SMALL_LIMIT }),
    fetchFollow(at('/sitemap.xml'), { ...base, limit: SMALL_LIMIT }),
    succeeded(home)
      ? fetchFollow(home.url, { ...base, limit: SMALL_LIMIT, userAgent: PROBE_USER_AGENT, follow: false })
      : Promise.resolve(null),
  ])
  const robotsData = robotsFacts(robots.outcome, robots.status, robots.response?.body ?? '')
  const hosts = new Set([home.url.host, target.host])
  const sitemap = await sitemapFacts(fallbackSitemap, robotsData, hosts, { ...base, limit: SMALL_LIMIT })
  const probeData: ProbeFacts | null = probe
    ? {
        outcome: probe.outcome,
        status: probe.status,
        wall: probe.response ? detectWall(probe.response.status, probe.response.headers, probe.response.body) : null,
      }
    : null
  const facts: SiteFacts = {
    input: target.host,
    host: home.url.host,
    finalUrl: `${home.url.origin}${home.url.pathname}`,
    redirects: home.redirects,
    checkedAt: new Date().toISOString(),
    home: homeFacts(home),
    probe: probeData,
    robots: robotsData,
    llms: llmsFacts(llms),
    sitemap,
  }
  return facts
}

export async function POST(request: NextRequest) {
  if (!originAllowed(request)) return failure('forbidden', 403)
  const input = await readUrl(request)
  if (input === null) return failure('bad-request', 400)
  const target = parseTarget(input)
  if (!target.ok) return json({ ok: false, error: target.error }, 400)
  const slot = takeSlot(clientKey(request), Date.now())
  if (!slot.ok) {
    return failure('rate-limited', 429, { retryAfter: slot.retryAfter }, { 'Retry-After': String(slot.retryAfter) })
  }
  if (active >= MAX_CONCURRENT) return failure('busy', 503, {}, { 'Retry-After': '30' })
  active += 1
  try {
    const budget = AbortSignal.timeout(TOTAL_BUDGET_MS)
    const resolution = await resolveHost(target.host, budget)
    if (!resolution.ok) return failure(resolution.outcome === 'unsafe' ? 'private-address' : 'dns', 422)
    const facts = await inspect(target, resolution, budget)
    return json({ ok: true, facts })
  } catch (error) {
    console.error('ai-readiness check failed:', error instanceof Error ? error.name : 'unknown')
    return failure('internal', 500)
  } finally {
    active -= 1
  }
}
