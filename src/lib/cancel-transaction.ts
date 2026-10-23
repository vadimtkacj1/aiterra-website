import { dateOf, dayFromParts, formatDate, formatShortDate, monthOf, parseDate, roshHashanah, weekdayOf, yearOf } from '@/lib/work-days'

export type Channel = 'remote' | 'door' | 'store'

export type Kind = 'goods' | 'service'

export type Status = 'none' | 'senior' | 'disability' | 'immigrant'

export type Reason = 'change' | 'defect'

export type DocState = 'on-time' | 'later' | 'none'

export type CancelInput = {
  channel: Channel
  kind: Kind
  category: string
  dealDate: string
  receivedDate: string
  docState: DocState
  docDate: string
  serviceDate: string
  status: Status
  conversation: boolean
  reason: Reason
  price: string
  vouchers: boolean
}

type RemoteService = 'one-off' | 'continuing' | 'leisure'

type Rule =
  | { type: 'remote-goods' }
  | { type: 'remote-service'; service: RemoteService }
  | { type: 'door-goods' }
  | { type: 'door-service'; service: 'one-off' | 'continuing' }
  | { type: 'store-receipt'; item: number; openingOk: boolean; sealed: boolean }
  | { type: 'store-two-days'; regulation: string; item: number; tag: boolean; maxPrice: number | null }
  | { type: 'store-car' }
  | { type: 'store-before-start'; item: number }
  | { type: 'store-document'; items: string }
  | { type: 'store-none'; kind: Kind }
  | { type: 'excluded'; basis: string; text: string }
  | { type: 'special'; basis: string; text: string }

export type Category = { id: string; channel: Channel; kind: Kind; label: string; excluded?: boolean; rule: Rule }

export type Fact = { label: string; value: string; detail: string }

export type Verdict = 'open' | 'last-day' | 'passed' | 'pending' | 'not-started'

export type CancelResult = {
  kind: 'result'
  verdict: Verdict
  headline: string
  deadline: number | null
  daysLeft: number | null
  basis: string
  facts: Fact[]
  notes: string[]
  template: string
}

export type CancelOutcome =
  | CancelResult
  | { kind: 'incomplete'; message: string }
  | { kind: 'invalid'; message: string }
  | { kind: 'no-right'; headline: string; text: string; basis: string; notes: string[] }

export type CancelFieldErrors = {
  dealDate?: string
  receivedDate?: string
  docDate?: string
  serviceDate?: string
  price?: string
}

export const FEE_PERCENT = 5
export const FEE_CAP = 100
export const STORE_MIN_PRICE = 50
export const JEWELRY_MAX_PRICE = 3000
export const INSTALLATION_CAP = 100
export const REFUND_DAYS_REMOTE = 14
export const REFUND_BUSINESS_DAYS_STORE = 7
export const PERIOD_DAYS = 14
export const PROTECTED_MONTHS = 4

const LAW = 'חוק הגנת הצרכן'
const REGS = 'תקנות הגנת הצרכן (ביטול עסקה)'

export const channelOptions: { value: Channel; label: string; hint: string }[] = [
  { value: 'remote', label: 'באינטרנט או בטלפון', hint: 'גם קטלוג, טלוויזיה או וואטסאפ' },
  { value: 'store', label: 'בחנות', hint: 'בבית העסק של המוכר' },
  { value: 'door', label: 'מוכר שהגיע אליכם', hint: 'הביתה, לעבודה או לרחוב' },
]

export const kindOptions: { value: Kind; label: string }[] = [
  { value: 'goods', label: 'מוצר' },
  { value: 'service', label: 'שירות' },
]

export const statusOptions: { value: Status; label: string }[] = [
  { value: 'none', label: 'אף אחד מאלה' },
  { value: 'senior', label: 'בן או בת 65 ומעלה' },
  { value: 'disability', label: 'אדם עם מוגבלות' },
  { value: 'immigrant', label: 'עולה חדש, עד 5 שנים מתעודת העולה' },
]

const excluded = (basis: string, text: string): Rule => ({ type: 'excluded', basis, text })

export const categories: Category[] = [
  { id: 'remote-regular', channel: 'remote', kind: 'goods', label: 'מוצר רגיל', rule: { type: 'remote-goods' } },
  {
    id: 'remote-perishable',
    channel: 'remote',
    kind: 'goods',
    label: 'טובין פסידים, כמו מזון טרי או פרחים',
    excluded: true,
    rule: excluded(`סעיף 14ג(ד)(1) ל${LAW}`, 'החוק לא נותן זכות לבטל עסקת מכר מרחוק של טובין פסידים.'),
  },
  {
    id: 'remote-custom',
    channel: 'remote',
    kind: 'goods',
    label: 'מוצר שיוצר במיוחד בשבילכם בעקבות ההזמנה',
    excluded: true,
    rule: excluded(
      `סעיף 14ג(ד)(4) ל${LAW}`,
      'החוק לא נותן זכות לבטל עסקה במוצר שיוצר במיוחד בשבילכם בעקבות העסקה.',
    ),
  },
  {
    id: 'remote-media',
    channel: 'remote',
    kind: 'goods',
    label: 'דיסק, משחק, סרט או תוכנה באריזה שפתחתם',
    excluded: true,
    rule: excluded(
      `סעיף 14ג(ד)(5) ל${LAW}`,
      'החוק לא נותן זכות לבטל עסקה בטובין שאפשר להקליט, לשעתק או לשכפל, אחרי שפתחתם את האריזה המקורית שלהם.',
    ),
  },
  {
    id: 'remote-information',
    channel: 'remote',
    kind: 'goods',
    label: 'מידע דיגיטלי, כמו קובץ או ספר להורדה',
    excluded: true,
    rule: excluded(
      `סעיף 14ג(ד)(3) ל${LAW}`,
      'החוק לא נותן זכות לבטל עסקה במידע כהגדרתו בחוק המחשבים: נתונים שמאוחסנים במחשב. תוכנה לא נכללת בהגדרה הזו.',
    ),
  },
  {
    id: 'remote-one-off',
    channel: 'remote',
    kind: 'service',
    label: 'שירות חד-פעמי, כמו תיקון, הובלה או טיפול',
    rule: { type: 'remote-service', service: 'one-off' },
  },
  {
    id: 'remote-continuing',
    channel: 'remote',
    kind: 'service',
    label: 'מנוי או שירות מתמשך, כמו חדר כושר או חבילת תקשורת',
    rule: { type: 'remote-service', service: 'continuing' },
  },
  {
    id: 'remote-leisure',
    channel: 'remote',
    kind: 'service',
    label: 'אירוח, נסיעה, חופשה או בילוי, כמו מלון, צימר או הופעה',
    rule: { type: 'remote-service', service: 'leisure' },
  },
  {
    id: 'remote-abroad',
    channel: 'remote',
    kind: 'service',
    label: 'שירותי תיירות שניתנים כולם בחו״ל, דרך ספק בחו״ל',
    rule: {
      type: 'special',
      basis: `סעיף 14ג2 ל${LAW}`,
      text: 'בשירותי תיירות שניתנים כולם מחוץ לישראל דרך ספק בחו״ל, העוסק רשאי להציע לכם לבחור לפני העסקה בין זכות הביטול הרגילה לבין מדיניות הביטול של הספק בחו״ל. אם בחרתם במדיניות של הספק, היא קובעת אם ועד מתי אפשר לבטל. אם בחרתם בזכות הרגילה, או שלא הוצעה לכם בחירה, חלים 14 הימים הרגילים. העוסק חייב להוכיח שגילה לכם את מדיניות הביטול.',
    },
  },
  { id: 'door-regular', channel: 'door', kind: 'goods', label: 'מוצר', rule: { type: 'door-goods' } },
  {
    id: 'door-perishable',
    channel: 'door',
    kind: 'goods',
    label: 'טובין פסידים, כמו מזון טרי',
    excluded: true,
    rule: excluded(`סעיף 14(ג) ל${LAW}`, 'זכות הביטול בעסקת רוכלות לא חלה על טובין פסידים.'),
  },
  {
    id: 'door-continuing',
    channel: 'door',
    kind: 'service',
    label: 'מנוי או שירות מתמשך',
    rule: { type: 'door-service', service: 'continuing' },
  },
  {
    id: 'door-one-off',
    channel: 'door',
    kind: 'service',
    label: 'שירות חד-פעמי',
    rule: { type: 'door-service', service: 'one-off' },
  },
  {
    id: 'store-furniture',
    channel: 'store',
    kind: 'goods',
    label: 'ריהוט',
    rule: { type: 'store-receipt', item: 1, openingOk: true, sealed: false },
  },
  {
    id: 'store-home',
    channel: 'store',
    kind: 'goods',
    label: 'ציוד לבית ולגן, חוץ מכלי אוכל לא ארוזים',
    rule: { type: 'store-receipt', item: 2, openingOk: true, sealed: false },
  },
  {
    id: 'store-electric',
    channel: 'store',
    kind: 'goods',
    label: 'מכשיר חשמלי או אלקטרוני, כולל טלפון נייד',
    rule: { type: 'store-receipt', item: 3, openingOk: true, sealed: false },
  },
  {
    id: 'store-water',
    channel: 'store',
    kind: 'goods',
    label: 'מטהר מים או מתקן למים מינרליים',
    rule: { type: 'store-receipt', item: 6, openingOk: true, sealed: false },
  },
  {
    id: 'store-watch',
    channel: 'store',
    kind: 'goods',
    label: 'שעון',
    rule: { type: 'store-receipt', item: 23, openingOk: true, sealed: false },
  },
  {
    id: 'store-clothing',
    channel: 'store',
    kind: 'goods',
    label: 'ביגוד או הנעלה',
    rule: { type: 'store-two-days', regulation: '2(2)', item: 7, tag: true, maxPrice: null },
  },
  {
    id: 'store-jewelry',
    channel: 'store',
    kind: 'goods',
    label: 'תכשיט',
    rule: { type: 'store-two-days', regulation: '2(7)', item: 22, tag: false, maxPrice: JEWELRY_MAX_PRICE },
  },
  {
    id: 'store-sealed',
    channel: 'store',
    kind: 'goods',
    label: 'מוצר אחר באריזה מקורית שלא נפתחה',
    rule: { type: 'store-receipt', item: 4, openingOk: false, sealed: true },
  },
  {
    id: 'store-ordered',
    channel: 'store',
    kind: 'goods',
    label: 'מוצר שהזמנתם בחנות ועוד לא סופק',
    rule: { type: 'store-receipt', item: 5, openingOk: false, sealed: false },
  },
  {
    id: 'store-show',
    channel: 'store',
    kind: 'goods',
    label: 'מוצר שקניתם באירוע מכירה שהוזמנתם אליו',
    rule: { type: 'store-receipt', item: 20, openingOk: false, sealed: false },
  },
  { id: 'store-car', channel: 'store', kind: 'goods', label: 'רכב חדש מיבואן', rule: { type: 'store-car' } },
  {
    id: 'store-other',
    channel: 'store',
    kind: 'goods',
    label: 'מוצר אחר שלא מופיע ברשימה',
    rule: { type: 'store-none', kind: 'goods' },
  },
  {
    id: 'store-food',
    channel: 'store',
    kind: 'goods',
    label: 'מזון',
    excluded: true,
    rule: excluded(`תקנה 6(א)(4) ל${REGS}`, 'התקנות לא נותנות זכות לבטל קנייה של מוצרי מזון.'),
  },
  {
    id: 'store-medicine',
    channel: 'store',
    kind: 'goods',
    label: 'תרופות ותוספי תזונה',
    excluded: true,
    rule: excluded(`תקנה 6(א)(5) ל${REGS}`, 'התקנות לא נותנות זכות לבטל קנייה של תרופות ותוספי תזונה.'),
  },
  {
    id: 'store-perishable',
    channel: 'store',
    kind: 'goods',
    label: 'טובין פסידים, כמו פרחים',
    excluded: true,
    rule: excluded(`תקנה 6(א)(6) ל${REGS}`, 'התקנות לא נותנות זכות לבטל קנייה של טובין פסידים.'),
  },
  {
    id: 'store-underwear',
    channel: 'store',
    kind: 'goods',
    label: 'הלבשה תחתונה ובגדי ים',
    excluded: true,
    rule: excluded(`תקנה 6(א)(9) ל${REGS}`, 'התקנות לא נותנות זכות לבטל קנייה של הלבשה תחתונה, כולל בגדי ים.'),
  },
  {
    id: 'store-custom',
    channel: 'store',
    kind: 'goods',
    label: 'מוצר שיוצר לפי המידות או הדרישות שלכם',
    excluded: true,
    rule: excluded(
      `תקנה 6(א)(2) ל${REGS}`,
      'התקנות לא נותנות זכות לבטל קנייה של מוצר שיוצר במיוחד בשבילכם לפי מידות או דרישות מיוחדות.',
    ),
  },
  {
    id: 'store-assembled',
    channel: 'store',
    kind: 'goods',
    label: 'ריהוט שהורכב אצלכם בבית',
    excluded: true,
    rule: excluded(`תקנה 6(א)(1) ל${REGS}`, 'התקנות לא נותנות זכות לבטל קנייה של ריהוט שהורכב בבית שלכם.'),
  },
  {
    id: 'store-media',
    channel: 'store',
    kind: 'goods',
    label: 'דיסק, משחק או תוכנה שפתחתם את האריזה שלהם',
    excluded: true,
    rule: excluded(
      `תקנה 6(א)(8) ל${REGS}`,
      'התקנות לא נותנות זכות לבטל קנייה של טובין שאפשר להקליט, לשעתק או לשכפל, אחרי שפתחתם את האריזה המקורית.',
    ),
  },
  {
    id: 'store-gas',
    channel: 'store',
    kind: 'goods',
    label: 'גז',
    excluded: true,
    rule: excluded(`תקנה 6(א)(10) ל${REGS}`, 'התקנות לא נותנות זכות לבטל קנייה של גז.'),
  },
  {
    id: 'store-leisure',
    channel: 'store',
    kind: 'service',
    label: 'אירוח, נסיעה, חופשה או בילוי בישראל',
    rule: { type: 'store-before-start', item: 8 },
  },
  {
    id: 'store-course',
    channel: 'store',
    kind: 'service',
    label: 'חוג או קורס',
    rule: { type: 'store-before-start', item: 9 },
  },
  {
    id: 'store-gym',
    channel: 'store',
    kind: 'service',
    label: 'מנוי למועדון כושר או לספא',
    rule: { type: 'store-document', items: 'פרט 17' },
  },
  {
    id: 'store-beauty',
    channel: 'store',
    kind: 'service',
    label: 'טיפולי קוסמטיקה ואסתטיקה, כולל הסרת שיער',
    rule: { type: 'store-document', items: 'פרט 10' },
  },
  {
    id: 'store-telecom',
    channel: 'store',
    kind: 'service',
    label: 'טלפון, אינטרנט או טלוויזיה בתשלום',
    rule: { type: 'store-document', items: 'פרטים 13 עד 16' },
  },
  {
    id: 'store-club',
    channel: 'store',
    kind: 'service',
    label: 'מועדון הנחות, נופש ארוך טווח, מועדון היכרויות או הגרלות',
    rule: { type: 'store-document', items: 'פרטים 11, 12, 18 ו-19' },
  },
  {
    id: 'store-abroad',
    channel: 'store',
    kind: 'service',
    label: 'שירותי תיירות שניתנים כולם בחו״ל',
    rule: {
      type: 'special',
      basis: `תקנה 6(א)(12) ל${REGS}`,
      text: 'התקנות לא נותנות זכות לבטל שירותי אירוח, נסיעה, חופש ובילוי שניתנים כולם מחוץ לישראל, בתנאי שהעוסק גילה לכם לפני העסקה את תנאי הביטול של נותן השירות בחו״ל. אם לא גילה, חובת ההוכחה עליו. מה שקובע הוא תנאי הביטול של הספק.',
    },
  },
  {
    id: 'store-service-other',
    channel: 'store',
    kind: 'service',
    label: 'שירות אחר',
    rule: { type: 'store-none', kind: 'service' },
  },
]

export const categoriesFor = (channel: Channel, kind: Kind) =>
  categories.filter((category) => category.channel === channel && category.kind === kind)

export const categoryOf = (input: CancelInput) =>
  categories.find(
    (category) => category.id === input.category && category.channel === input.channel && category.kind === input.kind,
  ) ?? null

type YearCalendar = { holidays: Map<number, string>; independence: number }

const calendarCache = new Map<number, YearCalendar | null>()

const independenceDay = (fifthOfIyar: number) => {
  const weekday = weekdayOf(fifthOfIyar)
  if (weekday === 6) return fifthOfIyar - 2
  if (weekday === 5) return fifthOfIyar - 1
  if (weekday === 1) return fifthOfIyar + 1
  return fifthOfIyar
}

const calendarOf = (year: number): YearCalendar | null => {
  const cached = calendarCache.get(year)
  if (cached !== undefined) return cached
  const newYear = roshHashanah(year)
  if (newYear === null) {
    calendarCache.set(year, null)
    return null
  }
  const pesach = newYear - 163
  const holidays = new Map<number, string>([
    [pesach, 'פסח'],
    [pesach + 6, 'שביעי של פסח'],
    [pesach + 50, 'שבועות'],
    [newYear, 'ראש השנה'],
    [newYear + 1, 'ראש השנה'],
    [newYear + 9, 'יום כיפור'],
    [newYear + 14, 'סוכות'],
    [newYear + 21, 'שמיני עצרת'],
  ])
  const calendar = { holidays, independence: independenceDay(pesach + 20) }
  calendarCache.set(year, calendar)
  return calendar
}

export const calendarAvailable = () => calendarOf(2026) !== null

export const isRestDay = (day: number) => weekdayOf(day) === 6 || Boolean(calendarOf(yearOf(day))?.holidays.has(day))

const isOffDay = (day: number) => isRestDay(day) || calendarOf(yearOf(day))?.independence === day

export const restDayName = (day: number) => {
  const calendar = calendarOf(yearOf(day))
  const holiday = calendar?.holidays.get(day)
  if (holiday) return weekdayOf(day) === 6 ? `שבת, ${holiday}` : holiday
  if (calendar?.independence === day) return 'יום העצמאות'
  return weekdayOf(day) === 6 ? 'שבת' : ''
}

export const addDays = (day: number, count: number) => day + count

export const addMonths = (day: number, count: number) => {
  const total = yearOf(day) * 12 + (monthOf(day) - 1) + count
  const year = Math.floor(total / 12)
  const month = (total % 12) + 1
  const last = new Date(Date.UTC(year, month, 0)).getUTCDate()
  return dayFromParts(year, month, Math.min(dateOf(day), last))
}

export const nthNonRestAfter = (start: number, count: number) => {
  let day = start
  let counted = 0
  while (counted < count) {
    day += 1
    if (!isRestDay(day)) counted += 1
  }
  return day
}

export const nthNonRestBefore = (target: number, count: number) => {
  let day = target
  let counted = 0
  while (counted < count) {
    day -= 1
    if (!isRestDay(day)) counted += 1
  }
  return day
}

const lastNonRestBefore = (day: number) => {
  let candidate = day - 1
  while (isRestDay(candidate)) candidate -= 1
  return candidate
}

export type Extended = { day: number; nominal: number; reason: string }

export const extendPastRest = (nominal: number): Extended => {
  let day = nominal
  while (isOffDay(day)) day += 1
  return { day, nominal, reason: day === nominal ? '' : restDayName(nominal) }
}

const moneyFormat = new Intl.NumberFormat('he-IL', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

export const formatMoney = (value: number) => `${moneyFormat.format(value)} ₪`

export const formatDay = (day: number) => formatDate(day)

const weekdays = ['ראשון', 'שני', 'שלישי', 'רביעי', 'חמישי', 'שישי', 'שבת']

export const formatLongDay = (day: number) => `יום ${weekdays[weekdayOf(day)]}, ${formatDate(day)}`

export const formatShortDay = (day: number) => formatShortDate(day)

export const roundMoney = (value: number) => Math.round((value + Number.EPSILON) * 100) / 100

export const maxFee = (price: number) => Math.min(roundMoney((price * FEE_PERCENT) / 100), FEE_CAP)

export function parsePrice(raw: string) {
  const cleaned = raw.replace(/[\s,₪‎‏]/g, '')
  if (!cleaned) return { kind: 'empty' as const }
  if (!/^\d+(\.\d{0,2})?$/.test(cleaned)) return { kind: 'invalid' as const }
  const value = Number(cleaned)
  if (!(value > 0) || value > 100_000_000) return { kind: 'invalid' as const }
  return { kind: 'ok' as const, value }
}

const dayOf = (raw: string) => {
  const parsed = parseDate(raw)
  return parsed.ok ? parsed.day : null
}

const dateError = (raw: string) => {
  if (!raw) return ''
  const parsed = parseDate(raw)
  if (parsed.ok) return ''
  return parsed.reason === 'out-of-range' ? 'הקלידו תאריך בין 2020 ל-2099.' : 'התאריך לא תקין.'
}

const needsReceived = (category: Category | null) => {
  if (!category || category.kind !== 'goods') return false
  return ['remote-goods', 'door-goods', 'store-receipt'].includes(category.rule.type)
}

const needsDocument = (category: Category | null) => {
  if (!category) return false
  return ['remote-goods', 'remote-service', 'door-goods', 'door-service', 'store-document'].includes(category.rule.type)
}

const needsServiceDate = (category: Category | null) => {
  if (!category) return false
  const { rule } = category
  return (rule.type === 'remote-service' && rule.service !== 'continuing') || rule.type === 'store-before-start'
}

const needsPrice = (category: Category | null) =>
  Boolean(category && category.channel === 'store' && category.kind === 'goods')

export const fieldsFor = (input: CancelInput) => {
  const category = categoryOf(input)
  return {
    received: needsReceived(category),
    document: needsDocument(category),
    serviceDate: needsServiceDate(category),
    status: input.channel !== 'store',
    conversation: input.channel === 'remote' && input.status !== 'none',
    reason: input.channel === 'remote',
    vouchers: input.channel === 'store',
    priceRequired: needsPrice(category),
  }
}

export function fieldErrors(input: CancelInput, today: number | null): CancelFieldErrors {
  const errors: CancelFieldErrors = {}
  const fields = fieldsFor(input)
  const deal = dayOf(input.dealDate)
  const dealError = dateError(input.dealDate)
  if (dealError) errors.dealDate = dealError
  else if (deal !== null && today !== null && deal > today) errors.dealDate = 'תאריך העסקה הוא אחרי היום.'
  if (fields.received) {
    const error = dateError(input.receivedDate)
    const received = dayOf(input.receivedDate)
    if (error) errors.receivedDate = error
    else if (received !== null && deal !== null && received < deal) errors.receivedDate = 'קבלת המוצר לפני יום העסקה.'
    else if (received !== null && today !== null && received > today) errors.receivedDate = 'התאריך הוא אחרי היום.'
  }
  if (fields.document && input.docState === 'later') {
    const error = dateError(input.docDate)
    const doc = dayOf(input.docDate)
    if (error) errors.docDate = error
    else if (doc !== null && deal !== null && doc < deal) errors.docDate = 'המסמך התקבל לפני יום העסקה.'
    else if (doc !== null && today !== null && doc > today) errors.docDate = 'התאריך הוא אחרי היום.'
  }
  if (fields.serviceDate) {
    const error = dateError(input.serviceDate)
    const service = dayOf(input.serviceDate)
    if (error) errors.serviceDate = error
    else if (service !== null && deal !== null && service < deal) errors.serviceDate = 'מועד השירות לפני יום העסקה.'
  }
  if (parsePrice(input.price).kind === 'invalid') errors.price = 'הקלידו מחיר בספרות, למשל 899 או 1,250.50.'
  return errors
}

const joinHebrew = (parts: string[]) =>
  parts.length <= 1 ? parts.join('') : `${parts.slice(0, -1).join(', ')} ו${parts[parts.length - 1]}`

const statusNoun: Record<Exclude<Status, 'none'>, string> = {
  senior: '[אזרח ותיק / אזרחית ותיקה], בן או בת 65 ומעלה',
  disability: 'אדם עם מוגבלות',
  immigrant: '[עולה חדש / עולה חדשה]',
}

const statusDocument: Record<Exclude<Status, 'none'>, string> = {
  senior: 'תעודה מהמדינה שמעידה שאני אזרח ותיק',
  disability: 'תעודה שמעידה על מוגבלות לתקופה של יותר משישה חודשים',
  immigrant: 'תעודת עולה או תעודת זכאות כעולה',
}

type Timing = {
  deadline: number | null
  nominal: Extended | null
  floor: number | null
  basis: string
  period: string
  notes: string[]
  closed: string
}

const docAnchor = (input: CancelInput) => (input.docState === 'later' ? dayOf(input.docDate) : null)

const latest = (days: (number | null)[]) =>
  days.reduce<number | null>((max, day) => (day === null ? max : max === null ? day : Math.max(max, day)), null)

const extensionNote = (extended: Extended) =>
  extended.day === extended.nominal
    ? ''
    : `היום האחרון לפי הספירה, ${formatShortDay(extended.nominal)}, חל ב${extended.reason}. לפי סעיף 10(ג) לחוק הפרשנות, כשהיום האחרון של תקופה הוא יום מנוחה או שבתון, התקופה נמשכת עד היום שאחריו. כדי לא להיכנס לוויכוח, עדיף לשלוח את ההודעה לפני ${formatShortDay(extended.nominal)}.`

const periodEnd = (anchor: number, protectedPeriod: boolean) =>
  extendPastRest(protectedPeriod ? addMonths(anchor, PROTECTED_MONTHS) : addDays(anchor, PERIOD_DAYS))

const noDocumentNote = (anchorLabel: string, documentLabel = 'המסמך בכתב עם פרטי העסקה ודרך הביטול') =>
  `לפי לשון החוק, התקופה נספרת מהמאוחר מבין ${anchorLabel} וקבלת ${documentLabel}. כל עוד לא קיבלתם אותו, התקופה לא מתחילה לרוץ ממנו. בטלו בכל זאת בהקדם, וכתבו בהודעה שלא קיבלתם אותו.`

function remoteTiming(input: CancelInput, rule: Rule, deal: number): Timing | { closed: string; basis: string } {
  const protectedStatus = input.status !== 'none'
  const protectedPeriod = protectedStatus && input.conversation
  const notes: string[] = []
  if (protectedStatus && !input.conversation) {
    notes.push(
      'לאזרח ותיק, לאדם עם מוגבלות ולעולה חדש יש 4 חודשים רק אם בעסקה הייתה שיחה ביניהם לבין העוסק, גם בטלפון או בתקשורת אלקטרונית (סעיף 14ג1(ג)). בלי שיחה חל המועד הרגיל, 14 ימים.',
    )
  }
  if (protectedPeriod) {
    notes.push(
      'העוסק רשאי לבקש לראות תעודה שמוכיחה את הזכאות, ואסור לו לדרוש הוכחה נוספת. אפשר לשלוח לו עותק במייל (סעיף 14ג1(ד)).',
    )
  }
  const doc = docAnchor(input)
  const isGoods = rule.type === 'remote-goods'
  const received = isGoods ? dayOf(input.receivedDate) : null
  const lawBasis = protectedPeriod
    ? `סעיף 14ג1(ג) ל${LAW}`
    : isGoods
      ? `סעיף 14ג(ג)(1) ל${LAW}`
      : `סעיף 14ג(ג)(2) ל${LAW}`
  const length = protectedPeriod ? '4 חודשים' : '14 ימים'
  const period = isGoods
    ? `${length} מהמאוחר מבין ${protectedPeriod ? 'יום העסקה, ' : ''}קבלת המוצר וקבלת המסמך עם פרטי העסקה`
    : `${length} מהמאוחר מבין יום העסקה וקבלת המסמך עם פרטי העסקה`

  if (isGoods && received === null) {
    notes.unshift(`אפשר לבטל כבר עכשיו, עוד לפני שהמוצר הגיע. המועד האחרון הוא ${length} מהיום שתקבלו אותו.`)
    return { deadline: null, nominal: null, floor: null, basis: lawBasis, period, notes, closed: '' }
  }

  const anchorBase = isGoods ? (protectedPeriod ? latest([deal, received]) : received) : deal
  if (input.docState === 'none') {
    const floorEnd = periodEnd(anchorBase as number, protectedPeriod)
    notes.unshift(noDocumentNote(isGoods ? 'קבלת המוצר' : 'יום העסקה'))
    return { deadline: null, nominal: floorEnd, floor: floorEnd.day, basis: lawBasis, period, notes, closed: '' }
  }

  const anchor = latest([anchorBase, doc]) as number
  const end = periodEnd(anchor, protectedPeriod)
  let deadline = end.day
  const extension = extensionNote(end)
  if (extension) notes.push(extension)

  if (rule.type === 'remote-service' && rule.service !== 'continuing') {
    const service = dayOf(input.serviceDate) as number
    if (rule.service === 'leisure') {
      const windowStart = nthNonRestBefore(service, 7)
      const safe = lastNonRestBefore(windowStart)
      if (safe < deal) {
        return {
          closed: `השירות מתחיל בתוך 7 ימים שאינם ימי מנוחה מיום העסקה. בשירותי אירוח, נסיעה, חופשה או בילוי, החוק לא נותן זכות לבטל כשהביטול חל בתוך 7 ימים שאינם ימי מנוחה לפני מועד השירות.`,
          basis: `סעיף 14ג(ד)(2) ל${LAW}`,
        }
      }
      if (safe < deadline) {
        deadline = safe
        notes.push(
          `בשירותי אירוח, נסיעה, חופשה או בילוי אי אפשר לבטל בתוך 7 ימים שאינם ימי מנוחה לפני מועד השירות (סעיף 14ג(ד)(2)). התקופה הזו מתחילה ב-${formatShortDay(windowStart)}, ולכן המועד הבטוח האחרון הוא ${formatShortDay(safe)}.`,
        )
      }
    } else if (!protectedPeriod) {
      const cutoff = nthNonRestBefore(service, 2)
      if (cutoff < deadline) {
        deadline = cutoff
        notes.push(
          `בשירות חד-פעמי צריך לבטל לפחות שני ימים שאינם ימי מנוחה לפני מועד השירות (סעיף 14ג(ג)(2)), ולכן המועד האחרון הוא ${formatShortDay(cutoff)}.`,
        )
      }
    } else {
      notes.push(
        'סעיף 14ג1 לא חוזר על התנאי של שני ימים לפני מועד השירות. אם השירות כבר ניתן, הביטול עלול להיות שנוי במחלוקת, ולכן כדאי לבטל לפני מועד השירות.',
      )
    }
  }
  if (rule.type === 'remote-service' && rule.service === 'continuing') {
    notes.push('בשירות מתמשך אפשר לבטל גם אם השירות כבר התחיל. במקרה כזה משלמים רק את החלק היחסי של השירות שקיבלתם (סעיף 14ה(ב1)).')
  }
  return { deadline, nominal: end, floor: null, basis: lawBasis, period, notes, closed: '' }
}

function doorTiming(input: CancelInput, rule: Rule, deal: number): Timing {
  const protectedPeriod = input.status !== 'none'
  const notes: string[] = []
  const doc = docAnchor(input)
  const isGoods = rule.type === 'door-goods'
  const received = isGoods ? dayOf(input.receivedDate) : null
  const basis = protectedPeriod ? `סעיף 14ג1(ב) ל${LAW}` : isGoods ? `סעיף 14(א)(1) ל${LAW}` : `סעיף 14(א)(2) ל${LAW}`
  const length = protectedPeriod ? '4 חודשים' : '14 ימים'
  const period = isGoods
    ? `${length} מהמאוחר מבין קבלת המוצר וקבלת הפרטים שהרוכל חייב למסור`
    : `${length} מהמאוחר מבין יום העסקה וקבלת הפרטים שהרוכל חייב למסור`
  if (protectedPeriod) {
    notes.push('העוסק רשאי לבקש לראות תעודה שמוכיחה את הזכאות, ואסור לו לדרוש הוכחה נוספת (סעיף 14ג1(ד)).')
  }
  if (rule.type === 'door-service' && rule.service === 'one-off') {
    notes.push('בשירות חד-פעמי שנקנה מרוכל, אפשר לבטל רק אם השירות עוד לא התחיל (סעיף 14(א)(2)).')
  }
  if (rule.type === 'door-service' && rule.service === 'continuing') {
    notes.push('בשירות מתמשך אפשר לבטל גם אם השירות התחיל, ומשלמים את החלק היחסי של השירות שקיבלתם (סעיף 14(ב)(1)).')
  }
  if (isGoods && received === null) {
    notes.unshift(`אפשר לבטל כבר עכשיו. המועד האחרון הוא ${length} מהיום שתקבלו את המוצר.`)
    return { deadline: null, nominal: null, floor: null, basis, period, notes, closed: '' }
  }
  const anchorBase = isGoods ? (protectedPeriod ? latest([deal, received]) : received) : deal
  if (input.docState === 'none') {
    const floorEnd = periodEnd(anchorBase as number, protectedPeriod)
    notes.unshift(noDocumentNote(isGoods ? 'קבלת המוצר' : 'יום העסקה', 'הפרטים שהרוכל חייב למסור'))
    return { deadline: null, nominal: floorEnd, floor: floorEnd.day, basis, period, notes, closed: '' }
  }
  const end = periodEnd(latest([anchorBase, doc]) as number, protectedPeriod)
  const extension = extensionNote(end)
  if (extension) notes.push(extension)
  return { deadline: end.day, nominal: end, floor: null, basis, period, notes, closed: '' }
}

function storeTiming(input: CancelInput, rule: Rule, deal: number): Timing | { closed: string; basis: string } {
  const notes: string[] = []
  if (rule.type === 'store-receipt') {
    const basis = `תקנה 2(1) ופרט ${rule.item} בתוספת ל${REGS}`
    const period = '14 ימים מהיום שקיבלתם את המוצר'
    if (rule.item === 5 && !input.receivedDate) {
      notes.push('אפשר לבטל כבר עכשיו, לפני שהמוצר סופק. המועד האחרון הוא 14 ימים מהיום שתקבלו אותו.')
      return { deadline: null, nominal: null, floor: null, basis, period, notes, closed: '' }
    }
    const received = dayOf(input.receivedDate) ?? deal
    const end = extendPastRest(addDays(received, PERIOD_DAYS))
    const extension = extensionNote(end)
    if (extension) notes.push(extension)
    return {
      deadline: end.day,
      nominal: end,
      floor: null,
      basis,
      period,
      notes,
      closed: '',
    }
  }
  if (rule.type === 'store-two-days') {
    const end = nthNonRestAfter(deal, 2)
    return {
      deadline: end,
      nominal: null,
      floor: null,
      basis: `תקנה ${rule.regulation} ופרט ${rule.item} בתוספת ל${REGS}`,
      period: 'מיום הקנייה ועד סוף היום השני שאחריו שאינו יום מנוחה',
      notes,
      closed: '',
    }
  }
  if (rule.type === 'store-car') {
    const end = extendPastRest(addDays(deal, PERIOD_DAYS))
    const extension = extensionNote(end)
    if (extension) notes.push(extension)
    notes.push('אפשר לבטל רק כל עוד הרכב לא נרשם על שמכם לפי פקודת התעבורה (תקנה 2(6)).')
    return {
      deadline: end.day,
      nominal: end,
      floor: null,
      basis: `תקנה 2(6) ופרט 21 בתוספת ל${REGS}`,
      period: '14 ימים מיום העסקה',
      notes,
      closed: '',
    }
  }
  if (rule.type === 'store-before-start') {
    const service = dayOf(input.serviceDate) as number
    const end = extendPastRest(addDays(deal, PERIOD_DAYS))
    const cutoff = nthNonRestBefore(service, PERIOD_DAYS)
    const basis = `תקנה 2(3) ופרט ${rule.item} בתוספת ל${REGS}`
    if (cutoff < deal) {
      return {
        closed: 'השירות מתחיל בפחות מ-14 ימים שאינם ימי מנוחה מיום העסקה. לפי התקנות, הביטול צריך להיעשה לפחות 14 ימים כאלה לפני תחילת השירות, ולכן אין זכות ביטול לפי התקנות.',
        basis,
      }
    }
    let deadline = end.day
    const extension = extensionNote(end)
    if (cutoff < deadline) {
      deadline = cutoff
      notes.push(
        `הביטול צריך להיעשה לפחות 14 ימים שאינם ימי מנוחה לפני תחילת השירות, ולכן המועד האחרון הוא ${formatShortDay(cutoff)}.`,
      )
    } else if (extension) {
      notes.push(extension)
    }
    if (rule.item === 9) notes.push('הכלל לא חל על קורס הכנה לבחינה הפסיכומטרית, שיש לו חוק נפרד.')
    return { deadline, nominal: end, floor: null, basis, period: '14 ימים מיום העסקה', notes, closed: '' }
  }
  if (rule.type === 'store-document') {
    const basis = `תקנה 2(4) ו${rule.items} בתוספת ל${REGS}`
    const period = '14 ימים מהמאוחר מבין יום העסקה וקבלת החוזה או המסמך בכתב'
    notes.push('אפשר לבטל גם אם השירות כבר התחיל. בעסקה מתמשכת משלמים את החלק היחסי של השירות שקיבלתם (תקנה 3(ד)).')
    if (input.docState === 'none') {
      const floorEnd = extendPastRest(addDays(deal, PERIOD_DAYS))
      notes.unshift(noDocumentNote('יום העסקה', 'החוזה או המסמך בכתב'))
      return { deadline: null, nominal: floorEnd, floor: floorEnd.day, basis, period, notes, closed: '' }
    }
    const end = extendPastRest(addDays(latest([deal, docAnchor(input)]) as number, PERIOD_DAYS))
    const extension = extensionNote(end)
    if (extension) notes.push(extension)
    return { deadline: end.day, nominal: end, floor: null, basis, period, notes, closed: '' }
  }
  return { closed: '', basis: '' }
}

const storeGoodsReturn = (rule: Rule) => {
  if (rule.type === 'store-receipt' && rule.openingOk) {
    return 'פתיחת האריזה המקורית לבדה לא נחשבת שימוש, אבל חיבור לחשמל, לגז או למים כן (תקנה 2(1)).'
  }
  if (rule.type === 'store-receipt' && rule.sealed) return 'האריזה המקורית צריכה להיות סגורה, כפי שקיבלתם אותה.'
  if (rule.type === 'store-two-days' && rule.tag) return 'תווית המחיר צריכה להישאר על המוצר, אם הייתה (תקנה 2(2)).'
  if (rule.type === 'store-car') return 'הרכב עוד לא נרשם על שמכם.'
  return 'החזרה באריזה המקורית מספיקה כראיה שלא השתמשתם במוצר (תקנה 2).'
}

function factsFor(input: CancelInput, category: Category, price: number | null): Fact[] {
  const facts: Fact[] = []
  const { rule } = category
  if (input.channel === 'remote') {
    if (input.reason === 'defect') {
      facts.push({
        label: 'דמי ביטול',
        value: 'אסור לגבות',
        detail: 'כשמבטלים בגלל פגם, אי התאמה לפרטים שנמסרו, אי אספקה במועד או הפרה אחרת של העוסק (סעיף 14ה(א)).',
      })
    } else {
      facts.push({
        label: 'דמי ביטול, לכל היותר',
        value: price !== null ? formatMoney(maxFee(price)) : `${FEE_PERCENT}% או ${FEE_CAP} ₪`,
        detail: `${FEE_PERCENT}% מהמחיר או ${FEE_CAP} ₪, הנמוך מביניהם. הסכום כולל כל הוצאה של העוסק, כמו משלוח ואריזה, ואסור לגבות מעבר לו (סעיף 14ה(ב) ו-(ד)).`,
      })
    }
    facts.push({
      label: 'החזר הכסף',
      value: `תוך ${REFUND_DAYS_REMOTE} ימים מקבלת ההודעה`,
      detail:
        price !== null && input.reason !== 'defect'
          ? `לפחות ${formatMoney(price - maxFee(price))} מתוך ${formatMoney(price)}. העוסק מבטל את החיוב ושולח לכם עותק מהודעת ביטול החיוב (סעיף 14ה).`
          : 'העוסק מחזיר את מה ששילמתם, מבטל את החיוב ושולח לכם עותק מהודעת ביטול החיוב (סעיף 14ה).',
    })
    if (rule.type === 'remote-goods') {
      facts.push(
        input.reason === 'defect'
          ? {
              label: 'המוצר',
              value: 'נשאר לרשות העוסק אצלכם',
              detail: 'מעמידים את המוצר לרשות העוסק במקום שבו נמסר לכם ומודיעים לו על כך (סעיף 14ה(א)(2)).',
            }
          : {
              label: 'המוצר',
              value: 'מחזירים למקום העסק של העוסק',
              detail: 'החוק לא דורש אריזה סגורה, אבל אם מצב המוצר הורע באופן משמעותי, העוסק יכול לתבוע את הנזק (סעיף 14ה(ב)(2) ו-(ג)).',
            },
      )
    }
    return facts
  }
  if (input.channel === 'door') {
    facts.push({
      label: 'דמי ביטול',
      value: 'החוק לא קובע דמי ביטול',
      detail: `העוסק משיב לכם את מה ששילמתם (סעיף 14(ב)(1)). אם התקין אצלכם ציוד לצורך שירות, הוא רשאי לגבות עד ${INSTALLATION_CAP} ₪ על ההתקנה.`,
    })
    facts.push({
      label: 'החזר הכסף',
      value: 'כל הסכום ששילמתם',
      detail: 'סעיף 14 לא קובע מספר ימים להחזר.',
    })
    if (rule.type === 'door-goods') {
      facts.push({
        label: 'המוצר',
        value: 'נשאר לרשות העוסק אצלכם',
        detail: 'מעמידים את המוצר לרשות העוסק במקום שבו נמסר לכם (סעיף 14(ב)(1)). אם מצבו הורע באופן משמעותי, העוסק יכול לתבוע את הנזק.',
      })
    }
    return facts
  }
  facts.push({
    label: 'דמי ביטול, לכל היותר',
    value: price !== null ? formatMoney(maxFee(price)) : `${FEE_PERCENT}% או ${FEE_CAP} ₪`,
    detail: `${FEE_PERCENT}% מהמחיר או ${FEE_CAP} ₪, הנמוך מביניהם. אם שילמתם באשראי והעוסק מוכיח שחברת הסליקה גבתה ממנו עמלה על העסקה, הוא רשאי לגבות גם אותה (תקנה 5).`,
  })
  facts.push({
    label: 'החזר הכסף',
    value: `מיד, ולא יאוחר מ-${REFUND_BUSINESS_DAYS_STORE} ימי עסקים`,
    detail:
      'באותו אמצעי תשלום: מזומן או שיק במזומן, וביטול החיוב באשראי (תקנה 4(א)). צריך להציג חשבונית, קבלה, פתק החלפה או הוכחה אחרת לקנייה (תקנה 3(א)).',
  })
  if (category.kind === 'goods') {
    facts.push({ label: 'המוצר', value: 'מחזירים לחנות, בלי פגם ובלי שימוש', detail: storeGoodsReturn(rule) })
  }
  return facts
}

const dealLine = (input: CancelInput, deal: number, price: number | null) => {
  const what = input.kind === 'goods' ? 'לרכישת [שם המוצר]' : 'לקבלת [שם השירות]'
  return `הריני להודיע על ביטול העסקה מיום ${formatShortDay(deal)}, ${what}, הזמנה או חשבונית מספר [מספר]${
    price !== null ? `, בסך ${formatMoney(price)}` : ''
  }.`
}

function templateFor(input: CancelInput, category: Category, deal: number, price: number | null, basis: string) {
  const { rule } = category
  const lines = ['לכבוד [שם העסק]', 'הנדון: הודעה על ביטול עסקה', '', dealLine(input, deal, price)]
  if (input.channel === 'store') {
    lines.push(`הביטול לפי ${basis}.`)
    lines.push(
      `אבקש לקבל החזר כספי באמצעי התשלום שבו שילמתי, לא יאוחר מ-${REFUND_BUSINESS_DAYS_STORE} ימי עסקים, כקבוע בתקנה 4, בניכוי דמי ביטול שלא יעלו על ${
        price !== null ? formatMoney(maxFee(price)) : `${FEE_PERCENT}% מהמחיר או ${FEE_CAP} ₪, לפי הנמוך`
      } (תקנה 5).`,
    )
    if (category.kind === 'goods') lines.push('המוצר מוחזר בלי פגם ובלי שימוש. מצורפת הקבלה.')
  } else {
    lines.push(`הביטול לפי ${basis}.`)
    if (input.status !== 'none' && (input.channel === 'door' || input.conversation)) {
      lines.push(
        `אני ${statusNoun[input.status]}${input.channel === 'remote' ? ', והעסקה נעשתה בשיחה איתכם' : ''}. מצורף עותק של ${statusDocument[input.status]}.`,
      )
    }
    if (input.channel === 'remote' && input.reason === 'defect') {
      lines.push(
        'הביטול הוא בגלל [פגם במוצר / אי התאמה לפרטים שנמסרו לי / אי אספקה במועד], ולכן לפי סעיף 14ה(א) לחוק אין לגבות דמי ביטול.',
      )
    }
    if (input.channel === 'remote') {
      const fee =
        input.reason === 'defect'
          ? ''
          : `, בניכוי דמי ביטול שלא יעלו על ${price !== null ? formatMoney(maxFee(price)) : `${FEE_PERCENT}% מהמחיר או ${FEE_CAP} ₪, לפי הנמוך`}`
      lines.push(
        `אבקש להחזיר לי את הכסף ולבטל את החיוב בתוך ${REFUND_DAYS_REMOTE} ימים מקבלת הודעה זו${fee}, ולשלוח לי עותק מהודעת ביטול החיוב, כקבוע בסעיף 14ה לחוק.`,
      )
    } else {
      lines.push('אבקש להשיב לי את כל הסכום ששילמתי, לפי סעיף 14(ב) לחוק.')
    }
    if (rule.type === 'remote-goods') {
      lines.push(
        input.reason === 'defect'
          ? 'המוצר עומד לרשותכם במקום שבו נמסר לי.'
          : 'אחזיר את המוצר למקום העסק שלכם. אנא שלחו לי את הכתובת.',
      )
    }
    if (rule.type === 'door-goods') lines.push('המוצר עומד לרשותכם במקום שבו נמסר לי.')
  }
  lines.push('אבקש אישור בכתב על קבלת ההודעה.', '', 'שם מלא: [שם מלא]', 'מספר תעודת זהות: [מספר]', 'טלפון: [טלפון]')
  return lines.join('\n')
}

const noRight = (headline: string, text: string, basis: string, notes: string[] = []): CancelOutcome => ({
  kind: 'no-right',
  headline,
  text,
  basis,
  notes,
})

const storePolicyNote =
  'גם כשאין זכות לפי החוק, החנות יכולה לאפשר החזרה לפי מדיניות ההחזרה שלה. חנות חייבת לתלות מודעה עם המדיניות, ואם לא תלתה, חזקה שמותר להחזיר (סעיף 4ג לחוק). מוצר עם פגם אפשר לתקן או להחליף לפי האחריות.'

const missingFor = (input: CancelInput, category: Category | null) => {
  if (!category) return ['סוג המוצר או השירות']
  const fields = fieldsFor(input)
  const missing: string[] = []
  if (!input.dealDate) missing.push('תאריך העסקה')
  if (fields.document && input.docState === 'later' && !input.docDate) missing.push('תאריך קבלת המסמך')
  if (fields.serviceDate && !input.serviceDate) missing.push('מועד השירות')
  if (fields.priceRequired && parsePrice(input.price).kind === 'empty') missing.push('המחיר')
  return missing
}

export function checkCancellation(input: CancelInput, today: number | null): CancelOutcome {
  if (!calendarAvailable()) {
    return { kind: 'invalid', message: 'הדפדפן לא תומך בלוח העברי, ולכן אי אפשר לחשב ימי מנוחה. נסו דפדפן אחר.' }
  }
  const errors = fieldErrors(input, today)
  if (Object.keys(errors).length) {
    return { kind: 'invalid', message: 'כדי לראות את התוצאה, תקנו את השדה שמתחתיו הודעת שגיאה.' }
  }
  const category = categoryOf(input)
  if (category?.rule.type === 'excluded') return noRight('לפי החוק אין זכות ביטול', category.rule.text, category.rule.basis, input.channel === 'store' ? [storePolicyNote] : [])
  if (category?.rule.type === 'special') return noRight('תנאי הביטול נקבעים אחרת', category.rule.text, category.rule.basis)
  if (category?.rule.type === 'store-none') {
    return noRight(
      'התקנות לא נותנות זכות לבטל את הקנייה הזו',
      category.kind === 'goods'
        ? 'זכות הביטול בחנות חלה רק על סוגי המוצרים שבתוספת לתקנות, ועל כל מוצר באריזה מקורית שלא נפתחה. אם האריזה סגורה, בחרו ״מוצר אחר באריזה מקורית שלא נפתחה״.'
        : 'זכות הביטול בחנות חלה רק על סוגי השירותים שבתוספת לתקנות: אירוח ונופש בישראל, חוגים וקורסים, קוסמטיקה, כושר, תקשורת ומועדונים.',
      `תקנה 2 והתוספת ל${REGS}`,
      [storePolicyNote],
    )
  }
  const missing = missingFor(input, category)
  if (missing.length || !category) {
    return { kind: 'incomplete', message: `כדי לראות את התוצאה, מלאו: ${joinHebrew(missing)}.` }
  }

  const deal = dayOf(input.dealDate) as number
  const parsedPrice = parsePrice(input.price)
  const price = parsedPrice.kind === 'ok' ? parsedPrice.value : null
  const { rule } = category

  if (input.channel === 'store') {
    if (input.vouchers) {
      return noRight(
        'אין זכות ביטול כששילמתם בתווי קנייה',
        'לפי התקנות, עסקה ששולמה בתווי קנייה, בשובר מתנה או בכרטיס מגנטי נטען לא ניתנת לביטול.',
        `תקנה 6(ג) ל${REGS}`,
        [storePolicyNote],
      )
    }
    if (category.kind === 'goods' && price !== null && price <= STORE_MIN_PRICE) {
      return noRight(
        'התקנות חלות רק על מוצרים שמחירם מעל 50 ₪',
        `המחיר ששילמתם, ${formatMoney(price)}, לא עולה על ${STORE_MIN_PRICE} ₪, ולכן אין זכות ביטול לפי התקנות.`,
        `תקנה 1 ל${REGS}, הגדרת ״טובין״`,
        [storePolicyNote],
      )
    }
    if (rule.type === 'store-two-days' && rule.maxPrice !== null && price !== null && price > rule.maxPrice) {
      return noRight(
        'אין זכות ביטול לתכשיט שמחירו מעל 3,000 ₪',
        `התקנות לא נותנות זכות לבטל קנייה של תכשיט ששולם עליו יותר מ-${JEWELRY_MAX_PRICE.toLocaleString('he-IL')} ₪. שעונים לא כלולים בחריג הזה.`,
        `תקנה 6(א)(11) ל${REGS}`,
        [storePolicyNote],
      )
    }
  }

  const timing =
    input.channel === 'remote'
      ? remoteTiming(input, rule, deal)
      : input.channel === 'door'
        ? doorTiming(input, rule, deal)
        : storeTiming(input, rule, deal)

  if (timing.closed) return noRight('לפי החוק אין זכות לבטל את העסקה הזו', timing.closed, timing.basis)
  const full = timing as Timing

  const facts = factsFor(input, category, price)
  const notes = [...full.notes]
  if (input.channel !== 'store') {
    notes.push(
      'אפשר לבטל בטלפון, בדואר רשום, במייל, בפקס אם יש לעוסק, או בקישור הביטול באתר שלו. בהודעה כותבים שם מלא ומספר תעודת זהות (סעיף 14ט).',
    )
  } else {
    notes.push('את ההחזר אפשר לקבל בכל סניף של העוסק, חוץ מזכיין שתלה הודעה על כך במקום בולט (תקנה 3(ה)).')
  }
  const template = templateFor(input, category, deal, price, full.basis)

  let verdict: Verdict
  let headline: string
  let daysLeft: number | null = null
  if (full.deadline === null && full.floor === null) {
    verdict = 'pending'
    headline = 'אפשר לבטל כבר עכשיו'
  } else if (full.deadline === null) {
    verdict = 'not-started'
    headline = `אפשר לבטל, לפחות עד ${formatLongDay(full.floor as number)}`
    if (today !== null) daysLeft = (full.floor as number) - today
  } else {
    daysLeft = today !== null ? full.deadline - today : null
    if (daysLeft !== null && daysLeft < 0) {
      verdict = 'passed'
      headline = `המועד לביטול הסתיים ב${formatLongDay(full.deadline)}`
      notes.unshift(
        'אחרי המועד אין זכות ביטול לפי החוק. אם יש במוצר פגם או שהעסקה לא קוימה, ייתכן שיש לכם זכויות אחרות, למשל לפי תעודת האחריות או לפי דיני החוזים.',
      )
    } else if (daysLeft === 0) {
      verdict = 'last-day'
      headline = `היום, ${formatLongDay(full.deadline)}, הוא היום האחרון לביטול`
    } else {
      verdict = 'open'
      headline = `אפשר לבטל עד ${formatLongDay(full.deadline)}`
    }
  }

  return {
    kind: 'result',
    verdict,
    headline,
    deadline: full.deadline ?? full.floor,
    daysLeft,
    basis: full.basis,
    facts: [{ label: 'התקופה', value: full.period, detail: full.basis }, ...facts],
    notes,
    template,
  }
}

export const daysLeftText = (days: number) => {
  if (days === 1) return 'נשאר יום אחד'
  if (days === 2) return 'נשארו יומיים'
  return `נשארו ${days} ימים`
}

export function resultToText(result: CancelResult) {
  const lines = [result.headline]
  if (result.daysLeft !== null && result.daysLeft > 0) lines.push(daysLeftText(result.daysLeft))
  for (const fact of result.facts) lines.push(`${fact.label}: ${fact.value}. ${fact.detail}`)
  for (const note of result.notes) lines.push(note)
  lines.push('בדיקה לפי חוק הגנת הצרכן ותקנות הגנת הצרכן (ביטול עסקה). זה מידע כללי ולא ייעוץ משפטי.')
  lines.push('https://www.aiterra.co.il/tools/cancel-transaction-checker')
  return lines.join('\n')
}

export const announcementFor = (outcome: CancelOutcome) => {
  if (outcome.kind === 'result') {
    const left = outcome.daysLeft !== null && outcome.daysLeft > 0 ? `, ${daysLeftText(outcome.daysLeft)}` : ''
    return `${outcome.headline}${left}.`
  }
  if (outcome.kind === 'no-right') return `${outcome.headline}.`
  return ''
}

export type RuleRow = { deal: string; basis: string; when: string; fee: string }

export const ruleRows = (): RuleRow[] => [
  {
    deal: 'מוצר שנקנה באינטרנט, בטלפון או בקטלוג',
    basis: 'סעיף 14ג(ג)(1) לחוק',
    when: '14 ימים מהמאוחר מבין קבלת המוצר וקבלת המסמך עם פרטי העסקה',
    fee: `עד ${FEE_PERCENT}% או ${FEE_CAP} ₪, הנמוך. החזר תוך ${REFUND_DAYS_REMOTE} ימים`,
  },
  {
    deal: 'שירות חד-פעמי שנקנה מרחוק',
    basis: 'סעיף 14ג(ג)(2) לחוק',
    when: '14 ימים מהעסקה או מקבלת המסמך, ולפחות 2 ימים שאינם ימי מנוחה לפני השירות',
    fee: `עד ${FEE_PERCENT}% או ${FEE_CAP} ₪, הנמוך. החזר תוך ${REFUND_DAYS_REMOTE} ימים`,
  },
  {
    deal: 'מנוי או שירות מתמשך שנקנה מרחוק',
    basis: 'סעיף 14ג(ג)(2) ו-14ה(ב1) לחוק',
    when: '14 ימים מהעסקה או מקבלת המסמך, גם אם השירות התחיל',
    fee: `עד ${FEE_PERCENT}% או ${FEE_CAP} ₪, ועוד החלק היחסי של השירות שקיבלתם`,
  },
  {
    deal: 'אזרח ותיק, אדם עם מוגבלות או עולה חדש, בעסקה מרחוק שהייתה בה שיחה',
    basis: 'סעיף 14ג1(ג) לחוק',
    when: '4 חודשים מהמאוחר מבין העסקה, קבלת המוצר וקבלת המסמך',
    fee: `עד ${FEE_PERCENT}% או ${FEE_CAP} ₪, הנמוך`,
  },
  {
    deal: 'קנייה ממוכר שהגיע אליכם (רוכלות)',
    basis: 'סעיפים 14 ו-14ג1(ב) לחוק',
    when: '14 ימים מקבלת המוצר או הפרטים, ו-4 חודשים לאזרח ותיק, לאדם עם מוגבלות ולעולה חדש',
    fee: 'החוק לא קובע דמי ביטול. מחזירים את כל מה ששולם',
  },
  {
    deal: 'ריהוט, חשמל ואלקטרוניקה, ציוד לבית, שעון או אריזה סגורה, שנקנו בחנות',
    basis: 'תקנה 2(1) לתקנות',
    when: '14 ימים מקבלת המוצר',
    fee: `עד ${FEE_PERCENT}% או ${FEE_CAP} ₪, הנמוך. החזר תוך ${REFUND_BUSINESS_DAYS_STORE} ימי עסקים`,
  },
  {
    deal: 'ביגוד והנעלה, ותכשיט עד 3,000 ₪, שנקנו בחנות',
    basis: 'תקנה 2(2) ו-2(7) לתקנות',
    when: 'עד סוף היום השני אחרי הקנייה שאינו יום מנוחה. בבגדים, עם תווית המחיר',
    fee: `עד ${FEE_PERCENT}% או ${FEE_CAP} ₪, הנמוך. החזר תוך ${REFUND_BUSINESS_DAYS_STORE} ימי עסקים`,
  },
  {
    deal: 'מנוי לכושר, קוסמטיקה, תקשורת או מועדון, שנחתם בבית העסק',
    basis: 'תקנה 2(4) לתקנות',
    when: '14 ימים מהעסקה או מקבלת המסמך, גם אם השירות התחיל',
    fee: `עד ${FEE_PERCENT}% או ${FEE_CAP} ₪, ועוד החלק היחסי של השירות שקיבלתם`,
  },
  {
    deal: 'אירוח ונופש בישראל, חוג או קורס, שנקנו בבית העסק',
    basis: 'תקנה 2(3) לתקנות',
    when: '14 ימים מהעסקה, ולפחות 14 ימים שאינם ימי מנוחה לפני תחילת השירות',
    fee: `עד ${FEE_PERCENT}% או ${FEE_CAP} ₪, הנמוך`,
  },
]

export const feeRows = (prices: number[]) =>
  prices.map((price) => ({
    price: formatMoney(price),
    fee: formatMoney(maxFee(price)),
    refund: formatMoney(roundMoney(price - maxFee(price))),
    capped: maxFee(price) === FEE_CAP,
  }))

export const exampleCheck = (input: Partial<CancelInput>) => {
  const outcome = checkCancellation(
    {
      channel: 'remote',
      kind: 'goods',
      category: 'remote-regular',
      dealDate: '',
      receivedDate: '',
      docState: 'on-time',
      docDate: '',
      serviceDate: '',
      status: 'none',
      conversation: false,
      reason: 'change',
      price: '',
      vouchers: false,
      ...input,
    },
    null,
  )
  return outcome.kind === 'result' ? outcome : null
}
