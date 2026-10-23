import { corporatePrefixes, isValidId } from '@/lib/id-number'

export type LookupMode = 'number' | 'name'

export type Tone = 'active' | 'caution' | 'ended' | 'unknown'

export type Violation = 'none' | 'warning' | 'violator'

export type CompanyRecord = Record<string, unknown>

export type Company = {
  number: string
  name: string
  englishName: string
  type: string
  status: string
  subStatuses: string[]
  violation: Violation
  description: string
  purpose: string
  founded: string
  government: boolean
  liability: string
  lastReportYear: number | null
  address: string
  careOf: string
  poBox: string
}

export type StatusEntry = { status: string; tone: Tone; text: string }

export type NumberCheck =
  | { kind: 'empty' }
  | { kind: 'invalid'; message: string; hint: 'vat' | null }
  | { kind: 'valid'; number: string }

export type NameQuery = { field: string; tsquery: string }

export type LookupFailure = 'network' | 'timeout' | 'blocked' | 'server' | 'format' | 'aborted'

export type LookupResult = { ok: true; records: CompanyRecord[] } | { ok: false; failure: LookupFailure }

export const COMPANIES_RESOURCE_ID = 'f004176c-b85f-4542-8901-7b3176f9a054'
export const DATA_API = 'https://data.gov.il/api/3/action'
export const DATASET_URL = 'https://data.gov.il/he/dataset/ica_companies'
export const ICA_SEARCH_URL = 'https://ica.justice.gov.il/GenericCorporarionInfo/SearchCorporation?unit=8'
export const VAT_DEALER_URL = 'https://www.gov.il/he/service/vat-apply-online'
export const EXTRACT_FEE = 12
export const COMPANY_PREFIXES = ['51', '52', '56']
export const NAME_RESULTS_LIMIT = 20
export const NAME_FETCH_LIMIT = 100
export const NAME_MIN_LETTERS = 2
export const NAME_DEBOUNCE_MS = 450
export const REQUEST_TIMEOUT_MS = 15000
export const SLOW_AFTER_MS = 5000
export const TIMEOUT_REASON = 'timeout'

const FIELD = {
  number: 'מספר חברה',
  name: 'שם חברה',
  englishName: 'שם באנגלית',
  type: 'סוג תאגיד',
  status: 'סטטוס חברה',
  subStatus: 'תת סטטוס',
  violation: 'מפרה',
  description: 'תאור חברה',
  purpose: 'מטרת החברה',
  founded: 'תאריך התאגדות',
  government: 'חברה ממשלתית',
  liability: 'מגבלות',
  lastReport: 'שנה אחרונה של דוח שנתי (שהוגש)',
  city: 'שם עיר',
  street: 'שם רחוב',
  house: 'מספר בית',
  zip: 'מיקוד',
  poBox: 'ת.ד.',
  country: 'מדינה',
  careOf: 'אצל',
} as const

const SEPARATORS = /[\s\-\u2010-\u2015\u05be./\u200e\u200f\u202a-\u202e]/g
const HEBREW_LETTER = /[א-ת]/
const LATIN_LETTER = /[a-z]/
const SUFFIX_TOKENS = new Set(['בעמ', 'ltd', 'limited'])
const MAX_TOKENS = 8

export const statusCatalog: StatusEntry[] = [
  {
    status: 'פעילה',
    tone: 'active',
    text: 'החברה רשומה כפעילה: היא לא נמחקה, לא חוסלה ולא נמצאת בפירוק. זה לא אומר שהיא מנהלת עסקים בפועל.',
  },
  {
    status: 'פעילה זמנית',
    tone: 'caution',
    text: 'חברה שנמחקה או חוסלה והוחזרה למרשם בהחייאה, למשל בצו של בית משפט כדי להשלים פעולה מסוימת. הסטטוס מסמן שהיא לא אמורה לנהל עסקים רגילים.',
  },
  {
    status: 'פעילה/בפירוק - הליך פשרה או הסדר/פירוק זמני',
    tone: 'caution',
    text: 'החברה בהליך של פשרה או הסדר עם הנושים או בעלי המניות, או שמונה לה מפרק זמני. כדאי לברר מה מצב ההליך לפני שעובדים איתה.',
  },
  {
    status: 'פעילה/בפירוק - בכינוס נכסים',
    tone: 'caution',
    text: 'מונה לחברה כונס נכסים, שמנהל או מממש נכסים שלה כדי לשלם לנושים.',
  },
  {
    status: 'בפרוק מרצון',
    tone: 'caution',
    text: 'בעלי המניות החליטו לסגור את החברה, והדירקטורים הצהירו שהיא יכולה לשלם את כל החובות שלה. נאמן מוכר את הנכסים, משלם לנושים ומחלק את היתרה, והחברה כבר לא מנהלת עסקים רגילים.',
  },
  {
    status: 'בפרוק ע״י בימ״ש',
    tone: 'caution',
    text: 'בית משפט הורה לפרק את החברה ומינה נאמן שמנהל את הפירוק, למשל כי החברה לא יכולה לשלם את החובות שלה. מי שהחברה חייבת לו כסף מגיש תביעת חוב לנאמן.',
  },
  {
    status: 'מחוקה',
    tone: 'ended',
    text: 'רשם החברות מחק את החברה מהמרשם, למשל אחרי שנים בלי אגרה שנתית ובלי דוח שנתי. חברה מחוקה נחשבת מחוסלת. אפשר לבקש לבטל את המחיקה, מהרשם בתוך שנה או מבית משפט אחר כך.',
  },
  {
    status: 'מחוסלת מרצון',
    tone: 'ended',
    text: 'הפירוק מרצון הסתיים, והרשם רשם את החברה כמחוסלת. החברה כבר לא קיימת.',
  },
  {
    status: 'חיסול ע״י בימ״ש',
    tone: 'ended',
    text: 'הפירוק בבית המשפט הסתיים, ובית המשפט הורה על חיסול החברה. החברה כבר לא קיימת.',
  },
  {
    status: 'מחוסלת עקב מיזוג',
    tone: 'ended',
    text: 'החברה התמזגה לתוך חברה אחרת. הנכסים והחובות שלה עברו לחברה הקולטת, והיא עצמה חוסלה ונמחקה מהמרשם.',
  },
  {
    status: 'נגרעה מהמרשם',
    tone: 'ended',
    text: 'חברת חוץ שהוצאה ממרשם חברות החוץ בישראל. היא כבר לא רשומה כאן כחברה עם מקום עסקים בישראל, אבל ייתכן שהיא ממשיכה להתקיים במדינה שבה התאגדה.',
  },
]

const unknownStatus = (status: string): StatusEntry => ({
  status,
  tone: 'unknown',
  text: 'הסטטוס הזה לא הופיע במאגר כשבנינו את הכלי. כדי להבין מה הוא אומר, הזמינו נסח חברה או פנו לרשם החברות.',
})

export const statusInfo = (status: string) =>
  statusCatalog.find((entry) => entry.status === status) ?? unknownStatus(status)

const subStatusTexts: Record<string, string> = {
  'בהליכי מחיקה':
    'רשם החברות פרסם כוונה למחוק את החברה. מי שעלול להיפגע מהמחיקה יכול להגיש התנגדות בתוך 90 ימים מהפרסום.',
  'מחוסלת עקב מחיקה': 'החברה נמחקה מהמרשם, ולכן היא נחשבת מחוסלת.',
  'בפרוק מרצון בהליך מזורז':
    'פירוק מרצון במסלול מקוצר, שמיועד לחברה בלי נכסים, בלי חובות ובלי הליכים משפטיים.',
  'צו לפתיחת הליכים': 'בית משפט הכריז שהחברה חדלת פירעון ופתח לגביה הליכי חדלות פירעון.',
  'צו לפתיחת הליכים - תאגיד בשיקום': 'נפתחו לגבי החברה הליכי חדלות פירעון, במסלול של שיקום ולא של פירוק.',
  'בקשת נושים בהחייאה': 'נושים של החברה ביקשו להחזיר אותה למרשם.',
  'בקשת חברה בהחייאה': 'הוגשה מטעם החברה בקשה להחזיר אותה למרשם.',
  'הוגשה בקשה להחייאה': 'הוגשה בקשה להחזיר את החברה למרשם.',
  'הוגשה בקשת מיזוג - מיועדת להתמזג': 'הוגשה הצעת מיזוג, ולפיה החברה תתמזג לתוך חברה אחרת ותחוסל.',
  'הוגשה בקשת מיזוג - מיועדת לקלוט': 'הוגשה הצעת מיזוג, ולפיה החברה תקלוט חברה אחרת.',
  'תצהיר כושר פירעון':
    'הדירקטורים הצהירו שהחברה יכולה לשלם את כל החובות שלה. זה הצעד שלפני החלטה על פירוק מרצון.',
}

export const subStatusText = (subStatus: string) => subStatusTexts[subStatus] ?? ''

export const violationText: Record<Exclude<Violation, 'none'>, { title: string; text: string }> = {
  violator: {
    title: 'רשומה כחברה מפרת חוק',
    text: 'רשם החברות רשם שהחברה לא שילמה אגרה שנתית או לא הגישה דוח שנתי, לפי סעיף 362א לחוק החברות. כל עוד הרישום קיים, הרשם רשאי לסרב לרשום לה שעבודים ושינויים כמו שינוי שם, ואחרי שנה ברישום הזה, ובתנאים נוספים, הוא יכול גם למחוק אותה.',
  },
  warning: {
    title: 'התראה לפני רישום כמפרת חוק',
    text: 'רשם החברות רשם התראה שבכוונתו לרשום את החברה כמפרת חוק, בגלל אגרה שנתית או דוח שנתי. אם החברה לא תתקן את ההפרה בתוך 30 ימים מרישום ההתראה, היא תירשם כמפרה.',
  },
}

const typeLabels: Record<string, { label: string; text: string }> = {
  'ישראלית חברה פרטית': {
    label: 'חברה פרטית',
    text: 'המניות שלה לא נסחרות בבורסה ולא הוצעו לציבור.',
  },
  'ישראלית חברה ציבורית': {
    label: 'חברה ציבורית',
    text: 'המניות שלה נסחרות בבורסה או הוצעו לציבור בתשקיף.',
  },
  'ישראלית חברה אגח': {
    label: 'חברת אג״ח',
    text: 'חברה שאיגרות החוב שלה נסחרות בבורסה או הוצעו לציבור.',
  },
  'חוץ חברה פרטית': {
    label: 'חברת חוץ',
    text: 'תאגיד שהתאגד מחוץ לישראל ונרשם כאן כי יש לו מקום עסקים בישראל.',
  },
  'חוץ חברה ציבורית': {
    label: 'חברת חוץ ציבורית',
    text: 'תאגיד שהתאגד מחוץ לישראל ונרשם כאן כי יש לו מקום עסקים בישראל.',
  },
}

export const typeInfo = (type: string) => typeLabels[type] ?? { label: type, text: '' }

const liabilityLabels: Record<string, string> = {
  'מוגבלת': 'מוגבלת',
  'לא מוגבלת': 'לא מוגבלת',
}

export const cleanText = (value: unknown) =>
  String(value ?? '')
    .replace(/([א-ת])~(?=[א-ת])/g, '$1״')
    .replace(/~/g, '"')
    .replace(/\s+/g, ' ')
    .trim()

export const formatRegistryDate = (value: string) => {
  const match = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/.exec(value)
  return match ? `${Number(match[1])}.${Number(match[2])}.${match[3]}` : value
}

export const formatDataDate = (iso: unknown) => {
  const match = /^(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2})/.exec(String(iso ?? ''))
  if (!match) return ''
  const date = new Date(`${match[1]}Z`)
  if (Number.isNaN(date.getTime())) return ''
  return new Intl.DateTimeFormat('he-IL', {
    timeZone: 'Asia/Jerusalem',
    day: 'numeric',
    month: 'numeric',
    year: 'numeric',
  }).format(date)
}

const yearOf = (value: unknown) => {
  const year = Number(value)
  return Number.isInteger(year) && year > 1900 ? year : null
}

const violationOf = (value: string): Violation => {
  if (value === 'מפרה') return 'violator'
  if (value === 'התראה') return 'warning'
  return 'none'
}

const addressOf = (record: CompanyRecord) => {
  const street = [cleanText(record[FIELD.street]), cleanText(record[FIELD.house])].filter(Boolean).join(' ')
  const zip = cleanText(record[FIELD.zip])
  const country = cleanText(record[FIELD.country])
  const parts = [street, cleanText(record[FIELD.city]), zip ? `מיקוד ${zip}` : '']
  if (country && country !== 'ישראל') parts.push(country)
  return parts.filter(Boolean).join(', ')
}

export function toCompany(record: CompanyRecord): Company {
  const subStatuses = cleanText(record[FIELD.subStatus])
    .split(';')
    .map((part) => part.trim())
    .filter(Boolean)
  return {
    number: cleanText(record[FIELD.number]),
    name: cleanText(record[FIELD.name]),
    englishName: cleanText(record[FIELD.englishName]),
    type: cleanText(record[FIELD.type]),
    status: cleanText(record[FIELD.status]),
    subStatuses: [...new Set(subStatuses)],
    violation: violationOf(cleanText(record[FIELD.violation])),
    description: cleanText(record[FIELD.description]),
    purpose: cleanText(record[FIELD.purpose]),
    founded: formatRegistryDate(cleanText(record[FIELD.founded])),
    government: cleanText(record[FIELD.government]) === 'כן',
    liability: liabilityLabels[cleanText(record[FIELD.liability])] ?? '',
    lastReportYear: yearOf(record[FIELD.lastReport]),
    address: addressOf(record),
    careOf: cleanText(record[FIELD.careOf]),
    poBox: cleanText(record[FIELD.poBox]),
  }
}

export const isPublicType = (type: string) => type === 'ישראלית חברה ציבורית' || type === 'ישראלית חברה אגח'

export const toneOf = (company: Company): Tone => {
  const tone = statusInfo(company.status).tone
  return tone === 'active' && company.violation !== 'none' ? 'caution' : tone
}

const invalid = (message: string, hint: 'vat' | null = null): NumberCheck => ({ kind: 'invalid', message, hint })

export function checkCompanyNumber(raw: string): NumberCheck {
  const digits = raw.replace(SEPARATORS, '')
  if (!digits) return { kind: 'empty' }
  if (!/^\d+$/.test(digits)) return invalid('במספר חברה יש רק ספרות. כדי לחפש לפי שם, בחרו ״לפי שם החברה״.')
  if (digits.length !== 9) return invalid(`מספר חברה הוא 9 ספרות, והקלדתם ${digits.length}.`)
  if (!isValidId(digits)) {
    return invalid('ספרת הביקורת, הספרה האחרונה, לא מתאימה למספר, ולכן יש בו כנראה טעות הקלדה. בדקו אותו מול חשבונית או מסמך של החברה.')
  }
  const prefix = digits.slice(0, 2)
  if (COMPANY_PREFIXES.includes(prefix)) return { kind: 'valid', number: digits }
  const known = corporatePrefixes.find((item) => item.prefix === prefix)
  if (known) {
    return invalid(
      `לפי הקידומת ${prefix}, זה מספר של ${known.label}. הכלי מחפש במאגר החברות, שבו המספרים מתחילים ב-51, 52 או 56. שותפויות ועמותות רשומות במאגרים אחרים של רשות התאגידים.`,
    )
  }
  if (digits.startsWith('5')) {
    return invalid('המספר מתחיל ב-5 כמו מספרי תאגידים, אבל במאגר החברות יש רק מספרים שמתחילים ב-51, 52 או 56.')
  }
  return invalid(
    'מספר שלא מתחיל ב-5 הוא לא מספר חברה. עוסק מורשה או עוסק פטור שהוא אדם פרטי רשום לפי מספר תעודת הזהות שלו, ואותו בודקים ברשות המסים.',
    'vat',
  )
}

const tokensOf = (raw: string) =>
  raw
    .normalize('NFC')
    .replace(/\p{M}/gu, '')
    .toLowerCase()
    .split(/[^\p{L}\p{N}]+/u)
    .filter(Boolean)

const withoutSuffixes = (tokens: string[]) =>
  tokens.filter((token, index) => {
    if (SUFFIX_TOKENS.has(token)) return false
    if (token === 'בע' && tokens[index + 1] === 'מ') return false
    if (token === 'מ' && tokens[index - 1] === 'בע') return false
    return true
  })

export function buildNameQuery(raw: string): NameQuery | null {
  const tokens = withoutSuffixes(tokensOf(raw))
  const hebrew = tokens.some((token) => HEBREW_LETTER.test(token))
  const usable = (hebrew ? tokens.filter((token) => !LATIN_LETTER.test(token)) : tokens).slice(0, MAX_TOKENS)
  if (usable.join('').length < NAME_MIN_LETTERS) return null
  const english = !hebrew && usable.some((token) => LATIN_LETTER.test(token))
  const last = usable.length - 1
  const tsquery = usable.map((token, index) => (index === last && token.length > 1 ? `${token}:*` : token)).join(' & ')
  return { field: english ? FIELD.englishName : FIELD.name, tsquery }
}

const searchUrl = (params: Record<string, string>) =>
  `${DATA_API}/datastore_search?${new URLSearchParams({
    resource_id: COMPANIES_RESOURCE_ID,
    fields: Object.values(FIELD).join(','),
    include_total: 'false',
    ...params,
  })}`

export const numberSearchUrl = (number: string) =>
  searchUrl({ filters: JSON.stringify({ [FIELD.number]: Number(number) }), limit: '1' })

const NAME_SORT = `"${FIELD.type}" desc, "קוד סטטוס חברה" asc`

export const nameSearchUrl = (query: NameQuery) =>
  searchUrl({
    q: JSON.stringify({ [query.field]: query.tsquery }),
    plain: 'false',
    sort: NAME_SORT,
    limit: String(NAME_FETCH_LIMIT),
  })

const toneOrder: Record<Tone, number> = { active: 0, caution: 1, unknown: 2, ended: 3 }

export function rankByName(companies: Company[], raw: string) {
  const first = withoutSuffixes(tokensOf(raw))[0] ?? ''
  const english = !HEBREW_LETTER.test(raw) && LATIN_LETTER.test(raw.toLowerCase())
  const leadingMatch = (company: Company) => {
    const leading = tokensOf(english ? company.englishName : company.name)[0] ?? ''
    if (!first || !leading.startsWith(first)) return 2
    return leading === first ? 0 : 1
  }
  return companies
    .map((company, index) => ({
      company,
      index,
      leading: leadingMatch(company),
      tone: toneOrder[toneOf(company)],
      listed: isPublicType(company.type) ? 0 : 1,
    }))
    .sort((a, b) => a.leading - b.leading || a.tone - b.tone || a.listed - b.listed || a.index - b.index)
    .map((entry) => entry.company)
}

export const dataDateUrl = () => `${DATA_API}/resource_show?id=${COMPANIES_RESOURCE_ID}`

const abortedFailure = (signal: AbortSignal): LookupFailure =>
  signal.reason === TIMEOUT_REASON ? 'timeout' : 'aborted'

const readJson = async (url: string, signal: AbortSignal) => {
  const response = await fetch(url, { signal, headers: { Accept: 'application/json' } })
  if (response.status === 403 || response.status === 429) return { status: 'blocked' as const }
  if (!response.ok) return { status: 'server' as const }
  return { status: 'ok' as const, data: (await response.json()) as unknown }
}

const recordsOf = (data: unknown) => {
  if (!data || typeof data !== 'object') return null
  const { success, result } = data as { success?: unknown; result?: { records?: unknown } }
  return success === true && Array.isArray(result?.records) ? (result.records as CompanyRecord[]) : null
}

export async function fetchRecords(url: string, signal: AbortSignal): Promise<LookupResult> {
  try {
    const response = await readJson(url, signal)
    if (response.status !== 'ok') return { ok: false, failure: response.status }
    const records = recordsOf(response.data)
    return records ? { ok: true, records } : { ok: false, failure: 'format' }
  } catch (error) {
    if (signal.aborted) return { ok: false, failure: abortedFailure(signal) }
    return { ok: false, failure: error instanceof SyntaxError ? 'format' : 'network' }
  }
}

export async function fetchDataDate(signal: AbortSignal) {
  try {
    const response = await readJson(dataDateUrl(), signal)
    if (response.status !== 'ok') return ''
    const { result } = response.data as { result?: { last_modified?: unknown } }
    return formatDataDate(result?.last_modified)
  } catch {
    return ''
  }
}

export const failureText: Record<Exclude<LookupFailure, 'aborted'>, string> = {
  network: 'לא הצלחנו להתחבר למאגר של data.gov.il. בדקו את החיבור לאינטרנט ונסו שוב.',
  timeout: 'המאגר הממשלתי לא ענה בתוך 15 שניות. זה קורה כשהוא עמוס. נסו שוב בעוד רגע.',
  blocked: 'המאגר של data.gov.il חסם זמנית את החיפוש, כנראה בגלל הרבה חיפושים ברצף. חכו דקה ונסו שוב.',
  server: 'המאגר של data.gov.il לא זמין כרגע. נסו שוב בעוד כמה דקות.',
  format: 'המאגר החזיר תשובה שלא הצלחנו לקרוא. נסו שוב, ואם זה חוזר, חפשו באתר רשם החברות.',
}

export function companyToText(company: Company, dataDate: string) {
  const type = typeInfo(company.type).label
  const status = company.violation === 'violator' ? `${company.status}, מפרת חוק` : company.status
  const lines = [
    company.name,
    company.englishName,
    `מספר חברה: ${company.number}`,
    `סוג: ${type}`,
    `סטטוס: ${status}`,
    company.founded ? `תאריך התאגדות: ${company.founded}` : '',
    company.address ? `כתובת: ${company.address}` : '',
    company.lastReportYear ? `דוח שנתי אחרון: ${company.lastReportYear}` : '',
    `מקור: מאגר החברות של רשם החברות ב-data.gov.il${dataDate ? `, נתונים מעודכנים ל-${dataDate}` : ''}`,
  ]
  return lines.filter(Boolean).join('\n')
}

export const announcementFor = (by: LookupMode, companies: Company[], more: boolean) => {
  if (!companies.length) return by === 'number' ? 'לא נמצאה חברה עם המספר הזה' : 'לא נמצאו חברות בשם הזה'
  if (by === 'number' || companies.length === 1) {
    const company = companies[0]
    return `נמצאה חברה: ${company.name}, סטטוס ${company.status}${company.violation === 'violator' ? ', מפרת חוק' : ''}`
  }
  return more ? `נמצאו יותר מ-${NAME_RESULTS_LIMIT} חברות` : `נמצאו ${companies.length} חברות`
}
