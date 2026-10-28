import net from 'node:net'
import { domainToUnicode } from 'node:url'
import { ISOC_WHOIS_HOST, LOOKUP_TIMEOUT_MS, type DomainRecord } from './domain-lookup'

const MAX_WHOIS_BYTES = 64_000

export function emptyRecord(domain: string, source: DomainRecord['source']): DomainRecord {
  return {
    domain,
    display: domainToUnicode(domain) || domain,
    state: 'unknown',
    registrar: null,
    created: null,
    expires: null,
    nameservers: [],
    statuses: [],
    source,
  }
}

export function queryWhois(domain: string): Promise<string> {
  return new Promise((resolve, reject) => {
    let body = ''
    const socket = net.connect({ host: ISOC_WHOIS_HOST, port: 43 }, () => socket.write(`${domain}\r\n`))
    socket.setEncoding('utf8')
    socket.setTimeout(LOOKUP_TIMEOUT_MS, () => socket.destroy(new Error('timeout')))
    socket.on('data', (chunk: string) => {
      body += chunk
      if (body.length > MAX_WHOIS_BYTES) socket.destroy(new Error('oversize'))
    })
    socket.on('end', () => resolve(body))
    socket.on('error', reject)
  })
}

function isocDate(value: string | undefined) {
  const match = value?.match(/^(\d{2})-(\d{2})-(\d{4})$/)
  return match ? `${match[3]}-${match[2]}-${match[1]}` : null
}

export function parseIsoc(domain: string, text: string): DomainRecord {
  const record = emptyRecord(domain, 'isoc')
  if (/No data was found/i.test(text)) return { ...record, state: 'available' }
  const fields = new Map<string, string[]>()
  for (const line of text.split(/\r?\n/)) {
    const match = line.match(/^([a-zA-Z][a-zA-Z -]*?):\s+(.+?)\s*$/)
    if (!match) continue
    const key = match[1].toLowerCase()
    fields.set(key, [...(fields.get(key) ?? []), match[2]])
  }
  if (fields.get('domain')?.[0]?.toLowerCase() !== domain) return record
  return {
    ...record,
    state: 'registered',
    registrar: fields.get('registrar name')?.[0] ?? null,
    created: isocDate(fields.get('assigned')?.[0]),
    expires: isocDate(fields.get('validity')?.[0]),
    nameservers: (fields.get('nserver') ?? []).map((server) => server.toLowerCase()),
    statuses: fields.get('status') ?? [],
  }
}
