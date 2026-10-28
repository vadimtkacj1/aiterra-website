export type DomainState = 'registered' | 'available' | 'unknown'

export type DomainRecord = {
  domain: string
  display: string
  state: DomainState
  registrar: string | null
  created: string | null
  expires: string | null
  nameservers: string[]
  statuses: string[]
  source: 'isoc' | 'rdap'
}

export type DomainLookupResponse = { record: DomainRecord; alternatives: DomainRecord[] }

export const DEFAULT_SUFFIX = 'co.il'
export const ALTERNATIVE_SUFFIXES = ['co.il', 'com', 'il', 'org.il']
export const LOOKUP_TIMEOUT_MS = 8000
export const ISOC_WHOIS_HOST = 'whois.isoc.org.il'
export const ISOC_WHOIS_URL = 'https://www.isoc.org.il/whois'
export const ISOC_RULES_URL = 'https://www.isoc.org.il/domain-name-registry/il-domain-rules'
export const ISOC_RENEWAL_URL = 'https://www.isoc.org.il/domain-name-registry/manage-register-domain/domain-renewal'
export const ISOC_REASSIGN_URL = 'https://www.isoc.org.il/domain-name-registry/manage-register-domain/domain-re-assign'
export const ISOC_REGISTRARS_URL = 'https://www.isoc.org.il/domain-name-registry/domain-name-registrars'
export const RDAP_URL = 'https://rdap.org/domain/'

const SECOND_LEVELS = new Set(['co', 'com', 'org', 'net', 'ac', 'gov', 'edu', 'muni', 'k12', 'idf'])
const LABEL = /^(?!-)[a-z0-9-]{1,63}(?<!-)$/
const TLD = /^(?:[a-z]{2,24}|xn--[a-z0-9-]{1,59})$/
const MAX_INPUT = 300

function hostOf(raw: string): string | null {
  let value = raw.trim().toLowerCase()
  if (!value || value.length > MAX_INPUT || /\s/.test(value)) return null
  value = value.replace(/^[a-z][a-z0-9+.-]*:\/\//, '')
  value = value.split(/[/?#\s]/)[0] ?? ''
  if (value.includes('@')) value = value.slice(value.lastIndexOf('@') + 1)
  value = value.replace(/:\d+$/, '').replace(/\.+$/, '').replace(/^www\./, '')
  if (!value) return null
  if (!value.includes('.')) value = `${value}.${DEFAULT_SUFFIX}`
  try {
    return new URL(`http://${value}`).hostname
  } catch {
    return null
  }
}

export function normalizeDomain(raw: string): string | null {
  const host = hostOf(raw)
  if (!host || host.length > 253) return null
  const labels = host.split('.')
  const tld = labels[labels.length - 1]
  if (!TLD.test(tld) || labels.some((label) => !LABEL.test(label))) return null
  const keep = labels.length >= 3 && SECOND_LEVELS.has(labels[labels.length - 2]) ? 3 : 2
  if (labels.length < keep || (tld === 'il' && keep === 2 && SECOND_LEVELS.has(labels[0]))) return null
  if (tld === 'il' && labels[labels.length - keep].length < 3) return null
  return labels.slice(-keep).join('.')
}

export function isIsraeliDomain(domain: string) {
  return domain === 'il' || domain.endsWith('.il')
}

export function alternativesFor(domain: string) {
  const name = domain.split('.')[0]
  return ALTERNATIVE_SUFFIXES.map((suffix) => `${name}.${suffix}`).filter((candidate) => candidate !== domain)
}

const statusLabels: Record<string, string> = {
  'transfer locked': 'נעול להעברה',
  'transfer allowed': 'פתוח להעברה',
  ok: 'פעיל',
  active: 'פעיל',
  'client transfer prohibited': 'נעול להעברה אצל הרשם',
  'server transfer prohibited': 'נעול להעברה אצל המרשם',
  'client delete prohibited': 'מוגן ממחיקה',
  'server delete prohibited': 'מוגן ממחיקה ברמת המרשם',
  'client update prohibited': 'מוגן משינויים',
  'server update prohibited': 'מוגן משינויים ברמת המרשם',
  'client renew prohibited': 'חידוש נעול אצל הרשם',
  'server renew prohibited': 'חידוש נעול ברמת המרשם',
  'client hold': 'מושעה, לא מופיע ב-DNS',
  'server hold': 'מושעה ברמת המרשם',
  'auto renew period': 'חודש אוטומטית לאחרונה',
  'renew period': 'חודש לאחרונה',
  'add period': 'נרשם בימים האחרונים',
  'transfer period': 'הועבר לאחרונה',
  'redemption period': 'פג תוקף, בתקופת שחזור',
  'pending delete': 'ממתין למחיקה',
  'pending transfer': 'בתהליך העברה',
  'pending renew': 'בתהליך חידוש',
  inactive: 'בלי שרתי שמות',
  'not renewed. being revoked': 'לא חודש, בתהליך פקיעה',
}

export function statusLabel(status: string) {
  const key = status
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .toLowerCase()
    .trim()
  return statusLabels[key] ?? null
}

const DAY_MS = 86_400_000

export function daysUntil(iso: string, now = Date.now()) {
  return Math.ceil((Date.parse(iso) - now) / DAY_MS)
}

export function ageText(iso: string, now = new Date()) {
  const created = new Date(iso)
  let months = (now.getUTCFullYear() - created.getUTCFullYear()) * 12 + now.getUTCMonth() - created.getUTCMonth()
  if (now.getUTCDate() < created.getUTCDate()) months -= 1
  if (months < 1) return 'פחות מחודש'
  const years = Math.floor(months / 12)
  const rest = months % 12
  const yearPart = years === 0 ? '' : years === 1 ? 'שנה אחת' : years === 2 ? 'שנתיים' : `${years} שנים`
  const monthPart = rest === 0 ? '' : rest === 1 ? 'חודש אחד' : rest === 2 ? 'חודשיים' : `${rest} חודשים`
  return [yearPart, monthPart].filter(Boolean).join(' ו')
}

export function formatDate(iso: string) {
  const [year, month, day] = iso.slice(0, 10).split('-')
  return `${day}.${month}.${year}`
}
