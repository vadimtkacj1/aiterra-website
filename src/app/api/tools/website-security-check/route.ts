import { lookup, resolveMx, resolveTxt } from 'node:dns/promises'
import http from 'node:http'
import https from 'node:https'
import tls from 'node:tls'
import zlib from 'node:zlib'
import type { LookupAddress } from 'node:dns'
import { NextResponse, type NextRequest } from 'next/server'
import { MAX_REDIRECTS, RATE_LIMIT, RATE_WINDOW_MS, isPublicAddress, validateUrl } from '@/lib/website-trust-check'
import {
  generatorOf,
  parseCookie,
  parseTarget,
  registrableDomain,
  type EmailFacts,
  type HttpRedirect,
  type ProbeFacts,
  type SecurityFacts,
  type SecurityHome,
  type SecurityTls,
  type ServerError,
} from '@/lib/website-security-check'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const USER_AGENT =
  'Mozilla/5.0 (compatible; AiterraSecurityCheck/1.0; +https://www.aiterra.co.il/tools/website-security-check)'
const STEP_TIMEOUT_MS = 8000
const TOTAL_BUDGET_MS = 18000
const HOME_LIMIT = 1024 * 1024
const PROBE_LIMIT = 16 * 1024
const MAX_BODY = 4096
const MAX_CONCURRENT = 8
const MAX_TRACKED_CLIENTS = 5000
const REDIRECT_STATUSES = new Set([301, 302, 303, 307, 308])
const ALLOWED_ORIGINS = new Set(['www.aiterra.co.il', 'aiterra.co.il'])
const LOCAL_ORIGIN = /^(localhost|127\.0\.0\.1)(:\d+)?$/

type Resolution = { ok: true; addresses: LookupAddress[] } | { ok: false; reason: 'dns' | 'unsafe' }

type RawResponse = {
  status: number
  headers: Record<string, string>
  cookies: string[]
  body: string
  location: string | null
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

const stepSignal = (budget: AbortSignal) => AbortSignal.any([budget, AbortSignal.timeout(STEP_TIMEOUT_MS)])

const withTimeout = <T,>(work: Promise<T>) =>
  Promise.race([
    work,
    new Promise<never>((_, reject) => setTimeout(() => reject(new Error('timeout')), STEP_TIMEOUT_MS)),
  ])

async function resolveHost(host: string): Promise<Resolution> {
  try {
    const found = await withTimeout(lookup(host, { all: true }))
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

function requestOnce(url: URL, addresses: LookupAddress[], signal: AbortSignal, limit: number) {
  return new Promise<RawResponse>((resolve, reject) => {
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
        'Accept-Encoding': 'gzip, deflate, br',
      },
    })
    request.on('error', reject)
    request.on('response', (response) => {
      const status = response.statusCode ?? 0
      const headers: Record<string, string> = {}
      for (const [key, value] of Object.entries(response.headers)) {
        if (value !== undefined && key !== 'set-cookie') {
          headers[key] = (Array.isArray(value) ? value.join(', ') : value).slice(0, 4096)
        }
      }
      const cookies = (response.headers['set-cookie'] ?? []).slice(0, 30).map((cookie) => cookie.slice(0, 1024))
      const location = REDIRECT_STATUSES.has(status) ? (headers.location ?? null) : null
      if (location !== null) {
        resolve({ status, headers, cookies, body: '', location })
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
        resolve({ status, headers, cookies, body: Buffer.concat(chunks).toString('utf8'), location: null })
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
        if (chunk.length >= room) {
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

async function fetchHome(start: URL, first: LookupAddress[], budget: AbortSignal) {
  let url = start
  let addresses = first
  const cookies: string[] = []
  for (let hop = 0; hop <= MAX_REDIRECTS; hop += 1) {
    let response: RawResponse
    try {
      response = await requestOnce(url, addresses, stepSignal(budget), HOME_LIMIT)
    } catch {
      return null
    }
    cookies.push(...response.cookies)
    if (response.location === null) return { url, response: { ...response, cookies } }
    let next: URL
    try {
      next = new URL(response.location, url)
    } catch {
      return null
    }
    if (!validateUrl(next).ok) return null
    next.hash = ''
    if (next.hostname !== url.hostname) {
      const resolution = await resolveHost(next.hostname)
      if (!resolution.ok) return null
      addresses = resolution.addresses
    }
    url = next
  }
  return null
}

function homeFacts(result: Awaited<ReturnType<typeof fetchHome>>): SecurityHome {
  const empty: SecurityHome = {
    outcome: 'unreachable',
    status: null,
    finalUrl: null,
    https: false,
    hsts: null,
    csp: null,
    xFrameOptions: null,
    contentTypeOptions: null,
    referrerPolicy: null,
    permissionsPolicy: null,
    server: null,
    poweredBy: null,
    cookies: [],
    generator: null,
  }
  if (!result) return empty
  const { url, response } = result
  const header = (name: string) => response.headers[name]?.slice(0, 600) ?? null
  return {
    outcome: response.status >= 200 && response.status < 300 ? 'ok' : 'http-error',
    status: response.status,
    finalUrl: `${url.origin}${url.pathname}`,
    https: url.protocol === 'https:',
    hsts: header('strict-transport-security'),
    csp: header('content-security-policy'),
    xFrameOptions: header('x-frame-options'),
    contentTypeOptions: header('x-content-type-options'),
    referrerPolicy: header('referrer-policy'),
    permissionsPolicy: header('permissions-policy'),
    server: header('server')?.slice(0, 120) ?? null,
    poweredBy: header('x-powered-by')?.slice(0, 120) ?? null,
    cookies: response.cookies.map(parseCookie),
    generator: generatorOf(response.body),
  }
}

async function checkHttpRedirect(host: string, addresses: LookupAddress[], budget: AbortSignal): Promise<HttpRedirect> {
  try {
    const response = await requestOnce(new URL(`http://${host}/`), addresses, stepSignal(budget), PROBE_LIMIT)
    if (response.location === null) return 'none'
    return new URL(response.location, `http://${host}/`).protocol === 'https:' ? 'https' : 'other'
  } catch {
    return 'unreachable'
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
  return new Promise<SecurityTls>((resolve) => {
    const empty: SecurityTls = {
      outcome: 'error',
      authorized: false,
      error: null,
      issuer: null,
      validTo: null,
      hostMatch: false,
      protocol: null,
    }
    let done = false
    const finish = (facts: SecurityTls) => {
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
      minVersion: 'TLSv1',
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
        protocol: socket.getProtocol(),
      })
    })
    socket.on('error', (error: NodeJS.ErrnoException) => {
      finish({ ...empty, outcome: error.code === 'ECONNREFUSED' ? 'refused' : 'error', error: error.code ?? null })
    })
  })
}

const PROBES = {
  git: { path: '/.git/HEAD', exposed: (body: string) => /^ref:\s*refs\//.test(body.trimStart()) },
  wpUsers: { path: '/wp-json/wp/v2/users', exposed: (body: string) => /^\s*\[\s*\{/.test(body) && /"slug"/.test(body) },
  xmlrpc: { path: '/xmlrpc.php', exposed: (body: string) => /XML-RPC server accepts POST requests only/i.test(body) },
}

async function probe(origin: string, addresses: LookupAddress[], key: keyof typeof PROBES, budget: AbortSignal) {
  const spec = PROBES[key]
  try {
    const response = await requestOnce(new URL(spec.path, origin), addresses, stepSignal(budget), PROBE_LIMIT)
    const exposed = response.status === 200 && spec.exposed(response.body)
    return { status: response.status, exposed } satisfies ProbeFacts
  } catch {
    return { status: null, exposed: false } satisfies ProbeFacts
  }
}

const isNoData = (error: unknown) =>
  error instanceof Error && ['ENODATA', 'ENOTFOUND'].includes((error as NodeJS.ErrnoException).code ?? '')

async function txtRecords(name: string) {
  try {
    return (await withTimeout(resolveTxt(name))).map((parts) => parts.join(''))
  } catch (error) {
    if (isNoData(error)) return []
    throw error
  }
}

async function checkEmail(domain: string): Promise<EmailFacts> {
  try {
    const [root, dmarc, mx] = await Promise.all([
      txtRecords(domain),
      txtRecords(`_dmarc.${domain}`),
      withTimeout(resolveMx(domain)).catch((error) => {
        if (isNoData(error)) return []
        throw error
      }),
    ])
    return {
      domain,
      lookup: 'ok',
      spf: root.find((record) => /^v=spf1(\s|$)/i.test(record))?.slice(0, 500) ?? null,
      dmarc: dmarc.find((record) => /^v=DMARC1/i.test(record))?.slice(0, 500) ?? null,
      mx: mx.length,
    }
  } catch {
    return { domain, lookup: 'error', spf: null, dmarc: null, mx: 0 }
  }
}

async function inspect(host: string, addresses: LookupAddress[], budget: AbortSignal): Promise<SecurityFacts> {
  const [tlsFacts, httpRedirect, email] = await Promise.all([
    checkTls(host, addresses, budget),
    checkHttpRedirect(host, addresses, budget),
    checkEmail(registrableDomain(host)),
  ])
  const origin = `${tlsFacts.outcome === 'ok' ? 'https' : 'http'}://${host}`
  const [homeResult, git, wpUsers, xmlrpc] = await Promise.all([
    fetchHome(new URL(`${origin}/`), addresses, budget),
    probe(origin, addresses, 'git', budget),
    probe(origin, addresses, 'wpUsers', budget),
    probe(origin, addresses, 'xmlrpc', budget),
  ])
  return {
    host,
    checkedAt: new Date().toISOString(),
    tls: tlsFacts,
    httpRedirect,
    home: homeFacts(homeResult),
    probes: { git, wpUsers, xmlrpc },
    email,
  }
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
    const facts = await inspect(target.host, resolution.addresses, AbortSignal.timeout(TOTAL_BUDGET_MS))
    return json({ ok: true, facts })
  } catch (error) {
    console.error('website-security-check failed:', error instanceof Error ? error.name : 'unknown')
    return failure('internal', 500)
  } finally {
    active -= 1
  }
}
