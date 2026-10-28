import { lookup } from 'node:dns/promises'
import http from 'node:http'
import https from 'node:https'
import tls from 'node:tls'
import zlib from 'node:zlib'
import type { LookupAddress } from 'node:dns'
import { NextResponse, type NextRequest } from 'next/server'
import {
  MAX_REDIRECTS,
  RATE_LIMIT,
  RATE_WINDOW_MS,
  analyzeSignals,
  isPublicAddress,
  parseTarget,
  registrableDomain,
  validateUrl,
  type DomainFacts,
  type HomeFacts,
  type HomeOutcome,
  type SafeBrowsingFacts,
  type ServerError,
  type TlsFacts,
  type TrustFacts,
} from '@/lib/website-trust-check'
import { parseIsoc, queryWhois } from '@/lib/isoc-whois'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const USER_AGENT =
  'Mozilla/5.0 (compatible; AiterraTrustCheck/1.0; +https://www.aiterra.co.il/tools/website-trust-check)'
const STEP_TIMEOUT_MS = 8000
const TOTAL_BUDGET_MS = 18000
const HOME_LIMIT = 1024 * 1024
const RDAP_LIMIT = 256 * 1024
const MAX_BODY = 4096
const MAX_CONCURRENT = 8
const MAX_TRACKED_CLIENTS = 5000
const REDIRECT_STATUSES = new Set([301, 302, 303, 307, 308])
const ALLOWED_ORIGINS = new Set(['www.aiterra.co.il', 'aiterra.co.il'])
const LOCAL_ORIGIN = /^(localhost|127\.0\.0\.1)(:\d+)?$/
const SAFE_BROWSING_URL = 'https://safebrowsing.googleapis.com/v4/threatMatches:find'
const THREAT_LABELS: Record<string, string> = {
  MALWARE: 'נוזקה',
  SOCIAL_ENGINEERING: 'פישינג והתחזות',
  UNWANTED_SOFTWARE: 'תוכנה לא רצויה',
  POTENTIALLY_HARMFUL_APPLICATION: 'אפליקציה מזיקה',
}

type Resolution = { ok: true; addresses: LookupAddress[] } | { ok: false; reason: 'dns' | 'unsafe' }

type RawResponse = { status: number; headers: Record<string, string>; body: string; truncated: boolean }

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

const stepSignal = (budget: AbortSignal) => AbortSignal.any([budget, AbortSignal.timeout(STEP_TIMEOUT_MS)])

async function resolveHost(host: string): Promise<Resolution> {
  try {
    const found = await Promise.race([
      lookup(host, { all: true }),
      new Promise<never>((_, reject) => setTimeout(() => reject(new Error('timeout')), STEP_TIMEOUT_MS)),
    ])
    if (!found.length) return { ok: false, reason: 'dns' }
    if (!found.every((entry) => isPublicAddress(entry.address))) return { ok: false, reason: 'unsafe' }
    return { ok: true, addresses: [...found].sort((a, b) => a.family - b.family) }
  } catch {
    return { ok: false, reason: 'dns' }
  }
}

const pinnedLookup = (addresses: LookupAddress[]) =>
  ((_hostname: string, options: { all?: boolean } | undefined, callback: (...args: unknown[]) => void) => {
    if (options?.all) callback(null, addresses)
    else callback(null, addresses[0].address, addresses[0].family)
  }) as unknown as NonNullable<http.RequestOptions['lookup']>

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

function requestOnce(url: URL, addresses: LookupAddress[], signal: AbortSignal) {
  return new Promise<RawResponse & { location: string | null }>((resolve, reject) => {
    const client = url.protocol === 'https:' ? https : http
    const request = client.request(url, {
      method: 'GET',
      agent: false,
      lookup: pinnedLookup(addresses),
      signal,
      rejectUnauthorized: false,
      headers: {
        'User-Agent': USER_AGENT,
        Accept: 'text/html,application/xhtml+xml;q=0.9,*/*;q=0.5',
        'Accept-Language': 'he-IL,he;q=0.9,en;q=0.8',
        'Accept-Encoding': 'gzip, deflate, br',
      },
    })
    request.on('error', reject)
    request.on('response', (response) => {
      const status = response.statusCode ?? 0
      const headers: Record<string, string> = {}
      for (const [key, value] of Object.entries(response.headers)) {
        if (value !== undefined) headers[key] = (Array.isArray(value) ? value.join(', ') : value).slice(0, 4096)
      }
      const location = REDIRECT_STATUSES.has(status) ? (headers.location ?? null) : null
      if (location !== null) {
        resolve({ status, headers, body: '', truncated: false, location })
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
        const body = decodeBody(Buffer.concat(chunks), headers['content-type'] ?? '')
        resolve({ status, headers, body, truncated, location: null })
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
        const room = HOME_LIMIT - size
        if (chunk.length > room) {
          chunks.push(chunk.subarray(0, room))
          size = HOME_LIMIT
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

type FollowResult = { outcome: HomeOutcome; url: URL; response: RawResponse | null }

async function fetchHome(start: URL, first: Resolution & { ok: true }, budget: AbortSignal): Promise<FollowResult> {
  let url = start
  let resolution: Resolution = first
  for (let hop = 0; ; hop += 1) {
    if (!resolution.ok) return { outcome: resolution.reason === 'unsafe' ? 'redirect-blocked' : 'network', url, response: null }
    const signal = stepSignal(budget)
    let response: RawResponse & { location: string | null }
    try {
      response = await requestOnce(url, resolution.addresses, signal)
    } catch {
      return { outcome: signal.aborted ? 'timeout' : 'network', url, response: null }
    }
    if (response.location === null) {
      const ok = response.status >= 200 && response.status < 300
      return { outcome: ok ? 'ok' : 'http-error', url, response }
    }
    if (hop >= MAX_REDIRECTS) return { outcome: 'too-many-redirects', url, response: null }
    let next: URL
    try {
      next = new URL(response.location, url)
    } catch {
      return { outcome: 'redirect-blocked', url, response: null }
    }
    if (!validateUrl(next).ok) return { outcome: 'redirect-blocked', url, response: null }
    next.hash = ''
    resolution = next.hostname === url.hostname ? resolution : await resolveHost(next.hostname)
    url = next
  }
}

function homeFacts(result: FollowResult): HomeFacts {
  const response = result.response
  const headers = response?.headers ?? {}
  const csp = headers['content-security-policy'] ?? ''
  const isHtml = response ? /html/i.test(headers['content-type'] ?? '') || /^\s*</.test(response.body.slice(0, 256)) : false
  return {
    outcome: result.outcome,
    status: response?.status ?? null,
    finalUrl: response ? `${result.url.origin}${result.url.pathname}` : null,
    truncated: response?.truncated ?? false,
    hsts: Boolean(headers['strict-transport-security']) && result.url.protocol === 'https:',
    csp: Boolean(csp),
    frameProtection: Boolean(headers['x-frame-options']) || /frame-ancestors/i.test(csp),
    signals: response && result.outcome === 'ok' && isHtml ? analyzeSignals(response.body) : null,
  }
}

const certName = (value: unknown) => {
  if (!value || typeof value !== 'object') return null
  const entry = value as Record<string, string | string[] | undefined>
  const pick = (key: string) => {
    const field = entry[key]
    return Array.isArray(field) ? field[0] : field
  }
  return pick('O') ?? pick('CN') ?? null
}

function checkTls(host: string, addresses: LookupAddress[], budget: AbortSignal) {
  return new Promise<TlsFacts>((resolve) => {
    const empty: TlsFacts = { outcome: 'error', authorized: false, error: null, issuer: null, validTo: null, hostMatch: false }
    let done = false
    const finish = (facts: TlsFacts) => {
      if (done) return
      done = true
      clearTimeout(timer)
      budget.removeEventListener('abort', onAbort)
      socket.destroy()
      resolve(facts)
    }
    const socket = tls.connect({
      host: addresses[0].address,
      port: 443,
      servername: host,
      rejectUnauthorized: false,
      ALPNProtocols: ['http/1.1'],
    })
    const onAbort = () => finish({ ...empty, outcome: 'timeout' })
    const timer = setTimeout(onAbort, STEP_TIMEOUT_MS)
    budget.addEventListener('abort', onAbort, { once: true })
    socket.on('secureConnect', () => {
      const cert = socket.getPeerCertificate()
      const hostMatch = cert && Object.keys(cert).length ? !tls.checkServerIdentity(host, cert) : false
      const authorizationError = socket.authorizationError
      finish({
        outcome: 'ok',
        authorized: socket.authorized,
        error: authorizationError ? String(authorizationError) : null,
        issuer: certName(cert?.issuer),
        validTo: cert?.valid_to ? new Date(cert.valid_to).toISOString() : null,
        hostMatch,
      })
    })
    socket.on('error', (error: NodeJS.ErrnoException) => {
      finish({ ...empty, outcome: error.code === 'ECONNREFUSED' ? 'refused' : 'error', error: error.code ?? null })
    })
  })
}

type RdapEvent = { eventAction?: unknown; eventDate?: unknown }
type RdapEntity = { roles?: unknown; vcardArray?: unknown }

function registrarOf(entities: unknown) {
  if (!Array.isArray(entities)) return null
  const registrar = (entities as RdapEntity[]).find((entity) => Array.isArray(entity.roles) && entity.roles.includes('registrar'))
  const vcard = Array.isArray(registrar?.vcardArray) ? (registrar.vcardArray[1] as unknown[]) : []
  const fn = Array.isArray(vcard) ? (vcard.find((row) => Array.isArray(row) && row[0] === 'fn') as unknown[] | undefined) : undefined
  return typeof fn?.[3] === 'string' ? fn[3].slice(0, 120) : null
}

async function checkIsraeliDomain(name: string, base: DomainFacts): Promise<DomainFacts> {
  try {
    const record = parseIsoc(name, await queryWhois(name))
    if (record.state !== 'registered') return base
    return {
      name,
      created: record.created ? new Date(record.created).toISOString() : null,
      registrar: record.registrar,
      lookup: record.created ? 'found' : 'no-date',
    }
  } catch {
    return base
  }
}

async function checkDomain(name: string, budget: AbortSignal): Promise<DomainFacts> {
  const base: DomainFacts = { name, created: null, registrar: null, lookup: 'error' }
  if (name.endsWith('.il')) return checkIsraeliDomain(name, base)
  try {
    const response = await fetch(`https://rdap.org/domain/${encodeURIComponent(name)}`, {
      headers: { Accept: 'application/rdap+json, application/json', 'User-Agent': USER_AGENT },
      signal: stepSignal(budget),
      cache: 'no-store',
    })
    if (response.status === 404 || response.status === 400) return { ...base, lookup: 'unsupported' }
    if (!response.ok) return base
    const text = await response.text()
    if (text.length > RDAP_LIMIT) return base
    const data = JSON.parse(text) as { events?: unknown; entities?: unknown }
    const events = Array.isArray(data.events) ? (data.events as RdapEvent[]) : []
    const registration = events.find((event) => event.eventAction === 'registration')
    const created = typeof registration?.eventDate === 'string' ? registration.eventDate : null
    return {
      name,
      created: created && !Number.isNaN(Date.parse(created)) ? new Date(created).toISOString() : null,
      registrar: registrarOf(data.entities),
      lookup: created ? 'found' : 'no-date',
    }
  } catch {
    return base
  }
}

async function checkSafeBrowsing(key: string, host: string, finalUrl: string | null, budget: AbortSignal) {
  const urls = [...new Set([`https://${host}/`, `http://${host}/`, ...(finalUrl ? [finalUrl] : [])])]
  try {
    const response = await fetch(`${SAFE_BROWSING_URL}?key=${encodeURIComponent(key)}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      signal: stepSignal(budget),
      cache: 'no-store',
      body: JSON.stringify({
        client: { clientId: 'aiterra-website-trust-check', clientVersion: '1.0' },
        threatInfo: {
          threatTypes: Object.keys(THREAT_LABELS),
          platformTypes: ['ANY_PLATFORM'],
          threatEntryTypes: ['URL'],
          threatEntries: urls.map((url) => ({ url })),
        },
      }),
    })
    if (!response.ok) return { status: 'error', threats: [] } satisfies SafeBrowsingFacts
    const data = (await response.json()) as { matches?: { threatType?: string }[] }
    const threats = [...new Set((data.matches ?? []).map((match) => THREAT_LABELS[match.threatType ?? ''] ?? 'סכנה'))]
    return { status: threats.length ? 'flagged' : 'clean', threats } satisfies SafeBrowsingFacts
  } catch {
    return { status: 'error', threats: [] } satisfies SafeBrowsingFacts
  }
}

async function inspect(host: string, resolution: Resolution & { ok: true }, budget: AbortSignal): Promise<TrustFacts> {
  const key = process.env.GOOGLE_SAFE_BROWSING_KEY?.trim()
  const [domain, tlsFacts] = await Promise.all([
    checkDomain(registrableDomain(host), budget),
    checkTls(host, resolution.addresses, budget),
  ])
  const scheme = tlsFacts.outcome === 'ok' ? 'https' : 'http'
  const homeResult = await fetchHome(new URL(`${scheme}://${host}/`), resolution, budget)
  const home = homeFacts(homeResult)
  const safeBrowsing = key ? await checkSafeBrowsing(key, host, home.finalUrl, budget) : null
  return { host, checkedAt: new Date().toISOString(), domain, tls: tlsFacts, home, safeBrowsing }
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
    const resolution = await resolveHost(target.host)
    if (!resolution.ok) return failure(resolution.reason === 'unsafe' ? 'private-address' : 'dns', 422)
    const facts = await inspect(target.host, resolution, AbortSignal.timeout(TOTAL_BUDGET_MS))
    return json({ ok: true, facts })
  } catch (error) {
    console.error('website-trust-check failed:', error instanceof Error ? error.name : 'unknown')
    return failure('internal', 500)
  } finally {
    active -= 1
  }
}
