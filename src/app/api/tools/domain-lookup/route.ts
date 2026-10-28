import { NextResponse, type NextRequest } from 'next/server'
import {
  LOOKUP_TIMEOUT_MS,
  RDAP_URL,
  alternativesFor,
  isIsraeliDomain,
  normalizeDomain,
  type DomainLookupResponse,
  type DomainRecord,
} from '@/lib/domain-lookup'
import { emptyRecord, parseIsoc, queryWhois } from '@/lib/isoc-whois'

export const runtime = 'nodejs'

const CACHE_TTL_MS = 10 * 60_000
const CACHE_LIMIT = 500
const USER_AGENT = 'aiterra-domain-lookup/1.0 (+https://www.aiterra.co.il/tools/domain-lookup)'
const cache = new Map<string, { at: number; record: DomainRecord }>()

type RdapEntity = { roles?: string[]; vcardArray?: [string, [string, unknown, string, unknown][]] }
type RdapDomain = {
  status?: string[]
  entities?: RdapEntity[]
  events?: { eventAction?: string; eventDate?: string }[]
  nameservers?: { ldhName?: string }[]
  title?: string
}

function registrarName(entities: RdapEntity[] = []) {
  const registrar = entities.find((entity) => entity.roles?.includes('registrar'))
  const name = registrar?.vcardArray?.[1]?.find((entry) => entry[0] === 'fn')?.[3]
  return typeof name === 'string' && name.trim() ? name.trim() : null
}

function eventDate(data: RdapDomain, action: string) {
  const date = data.events?.find((event) => event.eventAction === action)?.eventDate
  return date && !Number.isNaN(Date.parse(date)) ? date.slice(0, 10) : null
}

async function queryRdap(domain: string): Promise<DomainRecord> {
  const record = emptyRecord(domain, 'rdap')
  const response = await fetch(`${RDAP_URL}${domain}`, {
    headers: { Accept: 'application/rdap+json, application/json', 'User-Agent': USER_AGENT },
    signal: AbortSignal.timeout(LOOKUP_TIMEOUT_MS),
    cache: 'no-store',
  })
  if (response.status === 404) {
    const data = (await response.json().catch(() => ({}))) as RdapDomain
    return /No RDAP service/i.test(data.title ?? '') ? record : { ...record, state: 'available' }
  }
  if (!response.ok) throw new Error(`rdap ${response.status}`)
  const data = (await response.json()) as RdapDomain
  return {
    ...record,
    state: 'registered',
    registrar: registrarName(data.entities),
    created: eventDate(data, 'registration'),
    expires: eventDate(data, 'expiration'),
    nameservers: (data.nameservers ?? []).flatMap((server) => (server.ldhName ? [server.ldhName.toLowerCase()] : [])),
    statuses: data.status ?? [],
  }
}

async function lookup(domain: string): Promise<DomainRecord> {
  const cached = cache.get(domain)
  if (cached && Date.now() - cached.at < CACHE_TTL_MS) return cached.record
  const record = isIsraeliDomain(domain) ? parseIsoc(domain, await queryWhois(domain)) : await queryRdap(domain)
  cache.delete(domain)
  cache.set(domain, { at: Date.now(), record })
  if (cache.size > CACHE_LIMIT) cache.delete(cache.keys().next().value as string)
  return record
}

function lookupOrUnknown(domain: string) {
  return lookup(domain).catch(() => emptyRecord(domain, isIsraeliDomain(domain) ? 'isoc' : 'rdap'))
}

export async function GET(request: NextRequest) {
  const domain = normalizeDomain(request.nextUrl.searchParams.get('domain') ?? '')
  if (!domain) return NextResponse.json({ error: 'invalid' }, { status: 400 })

  let record: DomainRecord
  try {
    record = await lookup(domain)
  } catch {
    return NextResponse.json({ error: 'upstream' }, { status: 502, headers: { 'Cache-Control': 'no-store' } })
  }
  const alternatives = record.state === 'available' ? await Promise.all(alternativesFor(domain).map(lookupOrUnknown)) : []
  const body: DomainLookupResponse = { record, alternatives }
  return NextResponse.json(body, {
    headers: { 'Cache-Control': 'public, max-age=300, s-maxage=600, stale-while-revalidate=600' },
  })
}
