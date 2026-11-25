import {
  DATA_API,
  buildNameQuery,
  cleanText,
  failureText,
  fetchRecords,
  formatDataDate,
  type CompanyRecord,
  type LookupFailure,
} from '@/lib/company-lookup'

export const CONTRACTORS_RESOURCE_ID = '4eb61bd6-18cf-4e7c-9f9c-e166dfa0a2d8'
export const CONTRACTORS_DATASET_URL = 'https://data.gov.il/he/datasets/ministry_of_housing/pinkashakablanim'
export const REGISTRAR_URL = 'https://www.gov.il/apps/moch/rasham/home'
export const CLASSIFICATION_URL = 'https://www.gov.il/he/pages/sivug_kablanim'
export const THRESHOLD_REGULATIONS_URL = 'https://www.nevo.co.il/law_html/law00/74262.htm'
export const CONTRACTORS_REVIEWED_LABEL = '26.11.2026'
export const CONTRACTORS_DATA_LABEL = '23.11.2026'
export const CONTRACTORS_COUNT = 16873
export const LICENSES_COUNT = 23107
export const COMPANIES_COUNT = 8631
export const RECOGNIZED_COUNT = 919
export const MAIN_BRANCH_THRESHOLD = 108500
export const SUB_BRANCH_THRESHOLD = 56750
export const SCOPE_TABLE_FROM_LABEL = '1.10.2026'
export const SCOPE_TABLE_UNTIL_LABEL = '1.4.2027'
export const DATASET_A1_SCOPE = 1948000
export const RESULTS_LIMIT = 20

const NAME_ROWS_LIMIT = 300
const NUMBER_ROWS_LIMIT = 60
const SCOPE_TABLE_UNTIL = Date.UTC(2027, 3, 1)
const NO_BREAK_SPACE = String.fromCharCode(160)
const UNLIMITED_SCOPE = 'ב.מ.'
const NOT_RECOGNIZED = 'לא מוכר'
const BLOCKING_RESTRICTION = /מותלה|מוקפא|הקפאת|אינה רשאית/
const HEBREW_LETTER = /[א-ת]/

const FIELD = {
  entityNumber: 'MISPAR_YESHUT',
  name: 'SHEM_YESHUT',
  number: 'MISPAR_KABLAN',
  city: 'SHEM_YISHUV',
  registered: 'TAARICH_KABLAN',
  branchCode: 'KOD_ANAF',
  branch: 'TEUR_ANAF',
  group: 'KVUTZA',
  grade: 'SIVUG',
  gradeDate: 'TARICH_SUG',
  scope: 'HEKEF',
  recognized: 'KABLAN_MUKAR',
  basis: 'HEARA',
} as const

export type ContractorLicense = {
  code: string
  branch: string
  restriction: string
  blocked: boolean
  group: string
  grade: string
  scope: number | null
  unlimited: boolean
  gradeDate: string
  recognized: string
  basis: string
}

export type Contractor = {
  number: string
  name: string
  entityNumber: string
  city: string
  registered: string
  licenses: ContractorLicense[]
}

export type ContractorQuery =
  | { kind: 'empty' }
  | { kind: 'invalid'; message: string }
  | { kind: 'number'; value: string }
  | { kind: 'entity'; value: string }
  | { kind: 'name'; value: string; tsquery: string }

export type ContractorSearch =
  | { ok: true; contractors: Contractor[]; more: boolean }
  | { ok: false; failure: LookupFailure }

export const branches = [
  { code: '100', name: 'בניה', group: 'ג', count: 8221 },
  { code: '111', name: 'פיתוח חצרות', group: 'א', count: 554 },
  { code: '120', name: 'כלונסאות מיקרופייל וקירות סלארי', group: 'א', count: 111 },
  { code: '130', name: 'בטונים בנית שלדים', group: 'ב', count: 661 },
  { code: '131', name: 'שיפוצים', group: 'א', count: 4556 },
  { code: '132', name: 'עבודות אבן ביבש או ברטוב על קירות מבנים קיימים', group: 'ב', count: 125 },
  { code: '133', name: 'דריכת בטון באתר', group: 'ב', count: 5 },
  { code: '134', name: 'איטום מבנים', group: 'ב', count: 258 },
  { code: '135', name: 'הרחבת מבנים', group: 'א', count: 390 },
  { code: '140', name: 'בניה טרומית', group: 'ג', count: 13 },
  { code: '150', name: 'קונסטרוקציות פלדה לעומס אדם ולגשרי צנרת', group: 'א', count: 313 },
  { code: '160', name: 'חשמלאות ותקשורת במבנים', group: 'א', count: 1333 },
  { code: '170', name: 'מתקני מיזוג אויר וקירור', group: 'ב', count: 416 },
  { code: '171', name: 'מתקני הסקה', group: 'ב', count: 85 },
  { code: '180', name: 'מעליות ומדרגות נעות', group: 'ב', count: 25 },
  { code: '190', name: 'מתקני תברואה אינסטלציה ומערכות כיבוי אש', group: 'א', count: 512 },
  { code: '191', name: 'מתקני אנרגיה סולרית ותאים פוטו וולטאים', group: 'א', count: 87 },
  { code: '193', name: 'בריכות מים', group: 'ג', count: 45 },
  { code: '200', name: 'כבישים תשתית ופיתוח', group: 'ג', count: 1903 },
  { code: '210', name: 'עבודות עפר וחציבה', group: 'ב', count: 456 },
  { code: '220', name: 'עבודות אספלט', group: 'ב', count: 84 },
  { code: '230', name: 'מסועות בטון', group: 'ב', count: 6 },
  { code: '240', name: 'הנחת קוי תקשורת', group: 'א', count: 377 },
  { code: '260', name: 'ביצוע קווי מים ביוב וניקוז', group: 'ב', count: 1749 },
  { code: '270', name: 'קווי חשמל צנרת וכבלים ומערכות תאורת כבישים ורחובות', group: 'א', count: 433 },
  { code: '280', name: 'התקנת רמזורים', group: 'א', count: 28 },
  { code: '300', name: 'גשרים', group: 'ג', count: 109 },
  { code: '310', name: 'בטונים ובטון דרוך לגשרים', group: 'ב', count: 1 },
  { code: '320', name: 'קונסטרוקציות פלדה לגשרים לעומסי תחבורה', group: 'ב', count: 15 },
  { code: '400', name: 'נמלים עבודות ימיות', group: 'ג', count: 32 },
  { code: '500', name: 'מערכות אלקטרו מכנאיות בתחנות שאיבה ללא המבנה', group: 'ב', count: 191 },
  { code: '700', name: 'ממגורות מגדלי מים וארובות', group: 'ג', count: 13 },
]

export const scopeTable = [
  { grade: 'ק', a: 846, b: null, c: null },
  { grade: '1', a: 1994, b: 3267, c: 5458 },
  { grade: '2', a: 3988, b: 6533, c: 9627 },
  { grade: '3', a: 7977, b: 13066, c: 19255 },
  { grade: '4', a: 15954, b: 26131, c: 38508 },
]

const numberFormat = new Intl.NumberFormat('he-IL')

export const formatShekels = (amount: number) => `${numberFormat.format(amount)}${NO_BREAK_SPACE}₪`

export const formatCount = (count: number) => numberFormat.format(count)

export const recordUrl = (number: string) => `https://www.gov.il/apps/moch/rasham/details/${number}`

export const gradeLabel = (license: Pick<ContractorLicense, 'group' | 'grade'>) =>
  /^\d$/.test(license.grade) ? `${license.group}${license.grade}` : `${license.group}-${license.grade}`

const scopeColumns = { א: 'a', ב: 'b', ג: 'c' } as const

export function tableScope(license: Pick<ContractorLicense, 'group' | 'grade'>, now = Date.now()) {
  if (now >= SCOPE_TABLE_UNTIL) return null
  const row = scopeTable.find((entry) => entry.grade === license.grade)
  const column = scopeColumns[license.group as keyof typeof scopeColumns]
  const thousands = row && column ? row[column] : null
  return thousands ? thousands * 1000 : null
}

export const scopeLabel = (license: Pick<ContractorLicense, 'group' | 'grade' | 'scope' | 'unlimited'>) => {
  if (license.unlimited) return 'ללא הגבלת היקף'
  const scope = tableScope(license) ?? license.scope
  return scope ? `עד ${formatShekels(scope)} באתר אחד` : ''
}

export const isBlocked = (contractor: Contractor) => contractor.licenses.some((license) => license.blocked)

const dateParts = (day: string, month: string, year: string) => `${Number(day)}.${Number(month)}.${year}`

const registeredOf = (value: string) => {
  const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(value)
  return match ? dateParts(match[3], match[2], match[1]) : ''
}

const gradeDateOf = (value: string) => {
  const match = /^(\d{2})-(\d{2})-(\d{4})$/.exec(value)
  return match ? dateParts(match[1], match[2], match[3]) : ''
}

const scopeOf = (value: string) => {
  const thousands = Number(value)
  return value && Number.isFinite(thousands) && thousands > 0 ? thousands * 1000 : null
}

function toLicense(record: CompanyRecord): ContractorLicense {
  const [branch = '', ...rest] = cleanText(record[FIELD.branch]).split(' - ')
  const restriction = rest.join(' - ').trim()
  const scope = cleanText(record[FIELD.scope])
  const recognized = cleanText(record[FIELD.recognized])
  return {
    code: cleanText(record[FIELD.branchCode]),
    branch: branch.replace(/\s*-$/, '').trim(),
    restriction,
    blocked: BLOCKING_RESTRICTION.test(restriction),
    group: cleanText(record[FIELD.group]),
    grade: cleanText(record[FIELD.grade]),
    scope: scopeOf(scope),
    unlimited: scope === UNLIMITED_SCOPE,
    gradeDate: gradeDateOf(cleanText(record[FIELD.gradeDate])),
    recognized: recognized === NOT_RECOGNIZED ? '' : recognized,
    basis: cleanText(record[FIELD.basis]),
  }
}

export function toContractors(records: CompanyRecord[]): Contractor[] {
  const byNumber = new Map<string, Contractor>()
  for (const record of records) {
    const number = cleanText(record[FIELD.number])
    if (!number) continue
    const contractor = byNumber.get(number) ?? {
      number,
      name: cleanText(record[FIELD.name]),
      entityNumber: cleanText(record[FIELD.entityNumber]),
      city: cleanText(record[FIELD.city]),
      registered: registeredOf(cleanText(record[FIELD.registered])),
      licenses: [],
    }
    contractor.licenses.push(toLicense(record))
    byNumber.set(number, contractor)
  }
  return [...byNumber.values()].map((contractor) => ({
    ...contractor,
    licenses: [...contractor.licenses].sort((a, b) => Number(a.code) - Number(b.code)),
  }))
}

export function checkContractorQuery(raw: string): ContractorQuery {
  const value = raw.trim()
  if (!value) return { kind: 'empty' }
  const digits = value.replace(/[\s\-./]/g, '')
  if (/^\d+$/.test(digits)) {
    if (digits.length === 9) return { kind: 'entity', value: digits }
    if (digits.length <= 6) return { kind: 'number', value: String(Number(digits)) }
    return {
      kind: 'invalid',
      message: `מספר קבלן הוא עד 5 ספרות, ומספר ח.פ. הוא 9 ספרות. הקלדתם ${digits.length} ספרות.`,
    }
  }
  const query = HEBREW_LETTER.test(value) ? buildNameQuery(value) : null
  if (!query) return { kind: 'invalid', message: 'הקלידו לפחות 2 אותיות בעברית משם הקבלן, או מספר.' }
  return { kind: 'name', value, tsquery: query.tsquery }
}

const searchUrl = (params: Record<string, string>) =>
  `${DATA_API}/datastore_search?${new URLSearchParams({
    resource_id: CONTRACTORS_RESOURCE_ID,
    fields: Object.values(FIELD).join(','),
    include_total: 'false',
    ...params,
  })}`

const queryUrl = (query: Exclude<ContractorQuery, { kind: 'empty' | 'invalid' }>) => {
  if (query.kind === 'name') {
    return searchUrl({
      q: JSON.stringify({ [FIELD.name]: query.tsquery }),
      plain: 'false',
      limit: String(NAME_ROWS_LIMIT),
    })
  }
  const field = query.kind === 'number' ? FIELD.number : FIELD.entityNumber
  return searchUrl({ filters: JSON.stringify({ [field]: query.value }), limit: String(NUMBER_ROWS_LIMIT) })
}

const leadingWord = (text: string) => text.split(/[^\p{L}\p{N}]+/u).find(Boolean) ?? ''

function rankByName(contractors: Contractor[], searched: string) {
  const first = leadingWord(searched)
  const rank = (contractor: Contractor) => {
    const leading = leadingWord(contractor.name)
    if (!first || !leading.startsWith(first)) return 2
    return leading === first ? 0 : 1
  }
  return contractors
    .map((contractor, index) => ({ contractor, index, rank: rank(contractor) }))
    .sort((a, b) => a.rank - b.rank || a.index - b.index)
    .map((entry) => entry.contractor)
}

export async function searchContractors(
  query: Exclude<ContractorQuery, { kind: 'empty' | 'invalid' }>,
  signal: AbortSignal,
): Promise<ContractorSearch> {
  const result = await fetchRecords(queryUrl(query), signal)
  if (!result.ok) return result
  const found = toContractors(result.records)
  const ranked = query.kind === 'name' ? rankByName(found, query.value) : found
  return { ok: true, contractors: ranked.slice(0, RESULTS_LIMIT), more: ranked.length > RESULTS_LIMIT }
}

export async function fetchContractorsDataDate(signal: AbortSignal) {
  try {
    const response = await fetch(`${DATA_API}/resource_show?id=${CONTRACTORS_RESOURCE_ID}`, { signal })
    if (!response.ok) return ''
    const { result } = (await response.json()) as { result?: { last_modified?: unknown } }
    return formatDataDate(result?.last_modified)
  } catch {
    return ''
  }
}

export const contractorFailureText: Record<Exclude<LookupFailure, 'aborted'>, string> = {
  ...failureText,
  format: 'המאגר החזיר תשובה שלא הצלחנו לקרוא. נסו שוב, ואם זה חוזר, חפשו באתר רשם הקבלנים.',
}

export const contractorsAnnouncement = (contractors: Contractor[], more: boolean) => {
  if (!contractors.length) return 'לא נמצא קבלן רשום'
  if (contractors.length === 1) return `נמצא קבלן רשום: ${contractors[0].name}`
  return more ? `נמצאו יותר מ-${RESULTS_LIMIT} קבלנים` : `נמצאו ${contractors.length} קבלנים`
}
