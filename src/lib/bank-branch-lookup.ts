import {
  DATA_API,
  cleanText,
  fetchRecords,
  formatDataDate,
  type CompanyRecord,
  type LookupFailure,
} from '@/lib/company-lookup'

export { REQUEST_TIMEOUT_MS, SLOW_AFTER_MS, TIMEOUT_REASON } from '@/lib/company-lookup'

export type LookupMode = 'number' | 'place'

export type Tone = 'active' | 'caution' | 'ended' | 'unknown'

export type Branch = {
  key: string
  bankCode: number
  bankName: string
  bankShort: string
  code: number
  name: string
  address: string
  city: string
  zip: string
  poBox: string
  phone: string
  accessible: boolean | null
  closedDay: string
  type: string
  openedOn: string
  closedOn: string
  mergedBank: number | null
  mergedBranch: number | null
  latitude: number | null
  longitude: number | null
}

export type Bank = {
  code: number
  name: string
  short: string
  website: string
  swift: string
  branchCount: number
}

export type BranchQuery = { mode: LookupMode; bankCode: number | null; number: string; text: string }

export type QueryCheck =
  | { kind: 'empty'; message: string }
  | { kind: 'invalid'; message: string }
  | { kind: 'valid' }

export type LoadFailure = Exclude<LookupFailure, 'aborted'>

export type BranchData =
  | { ok: true; branches: Branch[]; banks: Bank[]; dataDate: string }
  | { ok: false; failure: LookupFailure }

export const BRANCHES_RESOURCE_ID = '2202bada-4baf-45f5-aa61-8c5bad9646d3'
export const BANKS_RESOURCE_ID = 'ebb61778-e34c-4e67-8fcf-0e643d9cf8c2'
export const BRANCHES_DATASET_URL = 'https://data.gov.il/he/dataset/branches'
export const BANKS_DATASET_URL = 'https://data.gov.il/he/dataset/375'
export const BANK_OF_ISRAEL_URL = 'https://www.boi.org.il'
export const RESULTS_LIMIT = 30
export const PLACE_MIN_LETTERS = 2
export const BRANCH_MAX_DIGITS = 4

const FETCH_LIMIT = 5000

const staticBank = (code: number, name: string): Bank => ({
  code,
  name,
  short: name,
  website: '',
  swift: '',
  branchCount: 0,
})

export const STATIC_BANKS: Bank[] = [
  staticBank(12, 'בנק הפועלים'),
  staticBank(10, 'בנק לאומי לישראל'),
  staticBank(11, 'בנק דיסקונט לישראל'),
  staticBank(20, 'בנק מזרחי טפחות'),
  staticBank(31, 'הבנק הבינלאומי הראשון לישראל'),
  staticBank(17, 'בנק מרכנתיל דיסקונט'),
  staticBank(4, 'בנק יהב לעובדי המדינה'),
  staticBank(14, 'בנק אוצר החייל'),
  staticBank(54, 'בנק ירושלים'),
  staticBank(52, 'בנק פועלי אגודת ישראל'),
  staticBank(46, 'בנק מסד'),
  staticBank(26, 'יו-בנק'),
  staticBank(18, 'וואן זירו הבנק הדיגיטלי'),
]

export const failureText: Record<LoadFailure, string> = {
  network: 'לא הצלחנו להתחבר למאגר של data.gov.il. בדקו את החיבור לאינטרנט ונסו שוב.',
  timeout: 'המאגר הממשלתי לא ענה בתוך 15 שניות. זה קורה כשהוא עמוס. נסו שוב בעוד רגע.',
  blocked: 'המאגר של data.gov.il חסם זמנית את החיפוש, כנראה בגלל הרבה חיפושים ברצף. חכו דקה ונסו שוב.',
  server: 'המאגר של data.gov.il לא זמין כרגע. נסו שוב בעוד כמה דקות.',
  format: 'המאגר החזיר תשובה שלא הצלחנו לקרוא. נסו שוב בעוד כמה דקות.',
}

const dayLabels: Record<string, string> = {
  'יום א': 'יום א׳',
  'יום ב': 'יום ב׳',
  'יום ג': 'יום ג׳',
  'יום ד': 'יום ד׳',
  'יום ה': 'יום ה׳',
  'יום ו': 'יום ו׳',
  'יום ש': 'שבת',
}

const numberOf = (value: unknown) => {
  const parsed = Number(value)
  return value !== null && value !== '' && Number.isFinite(parsed) ? parsed : null
}

const shortBankName = (name: string) =>
  name
    .replace(/\s*בע"מ\s*$/, '')
    .replace(/^בנק\s+/, 'בנק ')
    .trim()

const formatBranchDate = (value: string) => {
  const match = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/.exec(value)
  return match ? `${Number(match[1])}.${Number(match[2])}.${match[3]}` : value
}

const cityOf = (value: unknown) => cleanText(value).replace(/\*/g, '').trim()

export function toBranch(record: CompanyRecord): Branch {
  const bankCode = Number(record.Bank_Code)
  const code = Number(record.Branch_Code)
  const bankName = cleanText(record.Bank_Name)
  const handicap = cleanText(record.Handicap_Access)
  const zip = numberOf(record.Zip_Code)
  const poBox = numberOf(record.POB)
  return {
    key: `${bankCode}-${code}-${cleanText(record.Open_Date)}`,
    bankCode,
    bankName,
    bankShort: shortBankName(bankName),
    code,
    name: cleanText(record.Branch_Name),
    address: cleanText(record.Branch_Address),
    city: cityOf(record.City),
    zip: zip ? String(zip) : '',
    poBox: poBox ? String(poBox) : '',
    phone: cleanText(record.Telephone),
    accessible: handicap === 'כן' ? true : handicap === 'לא' ? false : null,
    closedDay: dayLabels[cleanText(record.day_closed)] ?? '',
    type: cleanText(record.Branch_Type),
    openedOn: formatBranchDate(cleanText(record.Open_Date)),
    closedOn: formatBranchDate(cleanText(record.Close_Date)),
    mergedBank: numberOf(record.Merge_Bank),
    mergedBranch: numberOf(record.Merge_Branch),
    latitude: numberOf(record.X_Coordinate),
    longitude: numberOf(record.Y_Coordinate),
  }
}

export function toBank(record: CompanyRecord, branchCount: number): Bank {
  const name = cleanText(record.Bank_Name)
  return {
    code: Number(record.Bank_Code),
    name,
    short: shortBankName(name),
    website: websiteOf(cleanText(record.Internet_Address)),
    swift: cleanText(record.Swift_Code),
    branchCount,
  }
}

const websiteOf = (value: string) => {
  if (!value) return ''
  const url = /^https?:\/\//i.test(value) ? value : `https://${value}`
  try {
    const parsed = new URL(url)
    return /\.[a-z]{2,}$/i.test(parsed.hostname) ? parsed.href : ''
  } catch {
    return ''
  }
}

export const isClosed = (branch: Branch) => branch.closedOn !== ''

export const isDigital = (branch: Branch) => branch.type === 'סניף דיגיטלי'

export const toneOf = (branch: Branch): Tone => {
  if (isClosed(branch)) return 'ended'
  return isDigital(branch) ? 'unknown' : 'active'
}

export const statusLabel = (branch: Branch) => {
  if (isClosed(branch)) return `נסגר ב-${branch.closedOn}`
  if (isDigital(branch)) return 'סניף דיגיטלי'
  return 'סניף פעיל'
}

const hebrewLettersOnly = (value: string) =>
  value
    .normalize('NFC')
    .replace(/\p{M}/gu, '')
    .toLowerCase()
    .replace(/[׳״'"`״׳]/g, '')
    .replace(/[^\p{L}\p{N}]+/gu, ' ')
    .replace(/יי/g, 'י')
    .replace(/וו/g, 'ו')
    .trim()

const tokensOf = (value: string) => hebrewLettersOnly(value).split(' ').filter(Boolean)

export function checkQuery(query: BranchQuery): QueryCheck {
  if (query.mode === 'number') {
    const digits = query.number.replace(/[\s\-‎‏]/g, '')
    if (!digits) return { kind: 'empty', message: 'הקלידו את מספר הסניף, עד 4 ספרות.' }
    if (!/^\d+$/.test(digits)) return { kind: 'invalid', message: 'מספר סניף בנוי מספרות בלבד.' }
    if (digits.length > BRANCH_MAX_DIGITS) {
      return { kind: 'invalid', message: `מספר סניף הוא עד ${BRANCH_MAX_DIGITS} ספרות, והקלדתם ${digits.length}.` }
    }
    return { kind: 'valid' }
  }
  const letters = hebrewLettersOnly(query.text).replace(/\s/g, '')
  if (letters.length < PLACE_MIN_LETTERS) {
    return { kind: 'empty', message: 'הקלידו לפחות 2 אותיות משם העיר, הסניף או הרחוב.' }
  }
  return { kind: 'valid' }
}

const rankOf = (branch: Branch, bankOrder: Map<number, number>) => [
  isClosed(branch) ? 1 : 0,
  bankOrder.get(branch.bankCode) ?? 99,
  branch.city,
  branch.name,
  branch.code,
]

export function searchBranches(branches: Branch[], query: BranchQuery, banks: Bank[]) {
  const bankOrder = new Map(banks.map((bank, index) => [bank.code, index]))
  const inBank = (branch: Branch) => query.bankCode === null || branch.bankCode === query.bankCode
  let found: Branch[]
  if (query.mode === 'number') {
    const code = Number(query.number.replace(/[\s\-‎‏]/g, ''))
    found = branches.filter((branch) => inBank(branch) && branch.code === code)
  } else {
    const tokens = tokensOf(query.text)
    found = branches.filter((branch) => {
      if (!inBank(branch)) return false
      const haystack = hebrewLettersOnly(`${branch.city} ${branch.name} ${branch.address}`)
      return tokens.every((token) => haystack.includes(token))
    })
  }
  return found.sort((a, b) => {
    const left = rankOf(a, bankOrder)
    const right = rankOf(b, bankOrder)
    for (let index = 0; index < left.length; index += 1) {
      if (left[index] === right[index]) continue
      return typeof left[index] === 'number'
        ? (left[index] as number) - (right[index] as number)
        : String(left[index]).localeCompare(String(right[index]), 'he')
    }
    return 0
  })
}

export function banksFrom(branches: Branch[], details: CompanyRecord[]) {
  const counts = new Map<number, { name: string; count: number }>()
  branches
    .filter((branch) => !isClosed(branch))
    .forEach((branch) => {
      const entry = counts.get(branch.bankCode)
      counts.set(branch.bankCode, { name: branch.bankName, count: (entry?.count ?? 0) + 1 })
    })
  const info = new Map(details.map((record) => [Number(record.Bank_Code), record]))
  return [...counts.entries()]
    .map(([code, entry]) => toBank({ ...(info.get(code) ?? {}), Bank_Code: code, Bank_Name: entry.name }, entry.count))
    .sort((a, b) => b.branchCount - a.branchCount || a.code - b.code)
}

export const bankLabel = (bank: Pick<Bank, 'short' | 'code'>) => `${bank.short} (${bank.code})`

const listUrl = (resourceId: string) =>
  `${DATA_API}/datastore_search?${new URLSearchParams({
    resource_id: resourceId,
    include_total: 'false',
    limit: String(FETCH_LIMIT),
  })}`

async function fetchDataDate(signal: AbortSignal) {
  try {
    const response = await fetch(`${DATA_API}/resource_show?id=${BRANCHES_RESOURCE_ID}`, {
      signal,
      headers: { Accept: 'application/json' },
    })
    if (!response.ok) return ''
    const { result } = (await response.json()) as { result?: { last_modified?: unknown } }
    return formatDataDate(result?.last_modified)
  } catch {
    return ''
  }
}

export async function loadBranches(signal: AbortSignal): Promise<BranchData> {
  const [branchResult, bankResult, dataDate] = await Promise.all([
    fetchRecords(listUrl(BRANCHES_RESOURCE_ID), signal),
    fetchRecords(listUrl(BANKS_RESOURCE_ID), signal),
    fetchDataDate(signal),
  ])
  if (!branchResult.ok) return { ok: false, failure: branchResult.failure }
  const branches = branchResult.records.map(toBranch).filter((branch) => Number.isFinite(branch.bankCode))
  if (!branches.length) return { ok: false, failure: 'format' }
  const banks = banksFrom(branches, bankResult.ok ? bankResult.records : [])
  return { ok: true, branches, banks, dataDate }
}

export function mapUrl(branch: Branch) {
  if (branch.latitude === null || branch.longitude === null) return ''
  return `https://www.google.com/maps?q=${branch.latitude},${branch.longitude}`
}

export const phoneHref = (phone: string) => {
  const digits = phone.replace(/[^\d+]/g, '')
  return digits ? `tel:${digits}` : ''
}

export function transferDetails(branch: Branch) {
  return `בנק ${branch.bankCode}, סניף ${branch.code}`
}

export function branchToText(branch: Branch, bank: Bank | undefined, dataDate: string) {
  const lines = [
    `${branch.bankShort}, סניף ${branch.name}`,
    `קוד בנק: ${branch.bankCode}`,
    `מספר סניף: ${branch.code}`,
    branch.address ? `כתובת: ${[branch.address, branch.city].filter(Boolean).join(', ')}` : '',
    branch.phone ? `טלפון: ${branch.phone}` : '',
    isClosed(branch) ? `הסניף נסגר ב-${branch.closedOn}` : '',
    bank?.swift ? `SWIFT: ${bank.swift}` : '',
    `מקור: מאגר סניפי הבנקים הפיזיים של בנק ישראל ב-data.gov.il${dataDate ? `, נתונים מעודכנים ל-${dataDate}` : ''}`,
  ]
  return lines.filter(Boolean).join('\n')
}

export const announcementFor = (count: number, more: boolean) => {
  if (!count) return 'לא נמצאו סניפים'
  if (count === 1) return 'נמצא סניף אחד'
  return more ? `נמצאו יותר מ-${RESULTS_LIMIT} סניפים` : `נמצאו ${count} סניפים`
}
