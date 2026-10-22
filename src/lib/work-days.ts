export type WeekPattern = 'sun-thu' | 'sun-fri'

export type WorkSettings = { week: WeekPattern; countEves: boolean; countCholHamoed: boolean }

export type SpecialKind = 'rest' | 'eve' | 'chol-hamoed' | 'chol-hamoed-eve'

export type SpecialDay = { day: number; name: string; kind: SpecialKind }

export type ParsedDate = { ok: true; day: number } | { ok: false; reason: 'empty' | 'invalid' | 'out-of-range' }

export type ParsedCount = { ok: true; value: number } | { ok: false; reason: 'empty' | 'invalid' | 'out-of-range' }

export type RangeCount = {
  workDays: number
  calendarDays: number
  weekendDays: number
  offDays: SpecialDay[]
}

export type DeadlineResult = { due: number; calendarDays: number; weekendDays: number; offDays: SpecialDay[] }

export type PaymentBasis = 'month-end' | 'invoice'

export type PaymentResult = {
  anchor: number
  due: number
  dueIsWorkDay: boolean
  dueSpecial: SpecialDay | null
  nextWorkDay: number
  calendarDays: number
  workDaysUntil: number
}

export type MonthSummary = {
  month: number
  workDays: number
  strictWorkDays: number
  restDays: SpecialDay[]
}

export type YearSummary = { year: number; months: MonthSummary[]; workDays: number; strictWorkDays: number }

export const MIN_YEAR = 2020
export const MAX_YEAR = 2099
export const MIN_DATE = `${MIN_YEAR}-01-01`
export const MAX_DATE = `${MAX_YEAR}-12-31`
export const MAX_WORK_DAYS = 2000
export const MAX_TERM_DAYS = 365

export const DEFAULT_SETTINGS: WorkSettings = { week: 'sun-thu', countEves: true, countCholHamoed: true }

export const STRICT_SETTINGS: WorkSettings = { week: 'sun-thu', countEves: false, countCholHamoed: false }

const DAY_MS = 86_400_000

const electionDays: { iso: string; name: string }[] = [
  { iso: '2020-03-02', name: 'יום הבחירות לכנסת' },
  { iso: '2021-03-23', name: 'יום הבחירות לכנסת' },
  { iso: '2022-11-01', name: 'יום הבחירות לכנסת' },
  { iso: '2024-02-27', name: 'יום הבחירות לרשויות המקומיות' },
  { iso: '2026-10-27', name: 'יום הבחירות לכנסת' },
]

export const MONTH_NAMES = [
  'ינואר',
  'פברואר',
  'מרץ',
  'אפריל',
  'מאי',
  'יוני',
  'יולי',
  'אוגוסט',
  'ספטמבר',
  'אוקטובר',
  'נובמבר',
  'דצמבר',
]

const WEEKDAY_NAMES = ['ראשון', 'שני', 'שלישי', 'רביעי', 'חמישי', 'שישי', 'שבת']

export const dayFromParts = (year: number, month: number, date: number) => Date.UTC(year, month - 1, date) / DAY_MS

const partsOf = (day: number) => {
  const date = new Date(day * DAY_MS)
  return { year: date.getUTCFullYear(), month: date.getUTCMonth() + 1, date: date.getUTCDate() }
}

export const weekdayOf = (day: number) => new Date(day * DAY_MS).getUTCDay()

export const yearOf = (day: number) => partsOf(day).year

export const monthOf = (day: number) => partsOf(day).month

export const dateOf = (day: number) => partsOf(day).date

const pad = (value: number) => String(value).padStart(2, '0')

export const isoFromDay = (day: number) => {
  const { year, month, date } = partsOf(day)
  return `${year}-${pad(month)}-${pad(date)}`
}

export const dayFromIso = (iso: string) => {
  const [year, month, date] = iso.split('-').map(Number)
  return dayFromParts(year, month, date)
}

export const todayIso = () => {
  const now = new Date()
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`
}

export const lastDayOfMonth = (day: number) => {
  const { year, month } = partsOf(day)
  return dayFromParts(year, month + 1, 1) - 1
}

export const firstDayOfMonth = (day: number) => {
  const { year, month } = partsOf(day)
  return dayFromParts(year, month, 1)
}

export const weekdayName = (day: number) => WEEKDAY_NAMES[weekdayOf(day)]

export const formatShortDate = (day: number) => {
  const { year, month, date } = partsOf(day)
  return `${date}.${month}.${year}`
}

export const formatDayMonth = (day: number) => {
  const { month, date } = partsOf(day)
  return `${date}.${month}`
}

export const formatDate = (day: number) => {
  const { year, month, date } = partsOf(day)
  return `${date} ב${MONTH_NAMES[month - 1]} ${year}`
}

export const formatLongDate = (day: number) => `יום ${weekdayName(day)}, ${formatDate(day)}`

export const formatMonthDay = (day: number) => {
  const { month, date } = partsOf(day)
  return `${date} ב${MONTH_NAMES[month - 1]}`
}

export const workDaysText = (count: number) => (count === 1 ? 'יום עבודה אחד' : `${count} ימי עבודה`)

export const daysText = (count: number) => (count === 1 ? 'יום אחד' : `${count} ימים`)

const nonWorkText = (count: number) => (count === 1 ? 'יום אחד שאינו יום עבודה' : `${count} ימים שאינם ימי עבודה`)

export function parseDate(value: string): ParsedDate {
  const trimmed = value.trim()
  if (!trimmed) return { ok: false, reason: 'empty' }
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(trimmed)
  if (!match) return { ok: false, reason: 'invalid' }
  const [year, month, date] = [Number(match[1]), Number(match[2]), Number(match[3])]
  const day = dayFromParts(year, month, date)
  const check = partsOf(day)
  if (check.year !== year || check.month !== month || check.date !== date) return { ok: false, reason: 'invalid' }
  if (year < MIN_YEAR || year > MAX_YEAR) return { ok: false, reason: 'out-of-range' }
  return { ok: true, day }
}

export function parseCount(value: string, min: number, max: number): ParsedCount {
  const trimmed = value.trim()
  if (!trimmed) return { ok: false, reason: 'empty' }
  if (!/^\d+$/.test(trimmed)) return { ok: false, reason: 'invalid' }
  const parsed = Number(trimmed)
  if (parsed < min || parsed > max) return { ok: false, reason: 'out-of-range' }
  return { ok: true, value: parsed }
}

let hebrewYearFormat: Intl.DateTimeFormat | null = null

const hebrewYearOf = (day: number) => {
  hebrewYearFormat ??= new Intl.DateTimeFormat('he-u-ca-hebrew', { timeZone: 'UTC', year: 'numeric' })
  return hebrewYearFormat.formatToParts(new Date(day * DAY_MS)).find((part) => part.type === 'year')?.value ?? ''
}

export function roshHashanah(year: number) {
  const last = dayFromParts(year, 10, 20)
  let previous = hebrewYearOf(dayFromParts(year, 8, 25))
  for (let day = dayFromParts(year, 8, 26); day <= last; day += 1) {
    const current = hebrewYearOf(day)
    if (current !== previous) return day
    previous = current
  }
  return null
}

const independenceDay = (fifthOfIyar: number) => {
  const weekday = weekdayOf(fifthOfIyar)
  if (weekday === 6) return fifthOfIyar - 2
  if (weekday === 5) return fifthOfIyar - 1
  if (weekday === 1) return fifthOfIyar + 1
  return fifthOfIyar
}

const yearCache = new Map<number, SpecialDay[] | null>()

export function specialDaysForYear(year: number): SpecialDay[] | null {
  const cached = yearCache.get(year)
  if (cached !== undefined) return cached
  const newYear = roshHashanah(year)
  if (newYear === null) {
    yearCache.set(year, null)
    return null
  }
  const pesach = newYear - 163
  const independence = independenceDay(pesach + 20)
  const entries: SpecialDay[] = [
    { day: pesach - 1, name: 'ערב פסח', kind: 'eve' },
    { day: pesach, name: 'פסח', kind: 'rest' },
    ...[1, 2, 3, 4].map((offset): SpecialDay => ({ day: pesach + offset, name: 'חול המועד פסח', kind: 'chol-hamoed' })),
    { day: pesach + 5, name: 'ערב שביעי של פסח, חול המועד', kind: 'chol-hamoed-eve' },
    { day: pesach + 6, name: 'שביעי של פסח', kind: 'rest' },
    { day: independence - 1, name: 'יום הזיכרון, ערב יום העצמאות', kind: 'eve' },
    { day: independence, name: 'יום העצמאות', kind: 'rest' },
    { day: pesach + 49, name: 'ערב שבועות', kind: 'eve' },
    { day: pesach + 50, name: 'שבועות', kind: 'rest' },
    { day: newYear - 1, name: 'ערב ראש השנה', kind: 'eve' },
    { day: newYear, name: 'ראש השנה', kind: 'rest' },
    { day: newYear + 1, name: 'ראש השנה, יום שני', kind: 'rest' },
    { day: newYear + 8, name: 'ערב יום כיפור', kind: 'eve' },
    { day: newYear + 9, name: 'יום כיפור', kind: 'rest' },
    { day: newYear + 13, name: 'ערב סוכות', kind: 'eve' },
    { day: newYear + 14, name: 'סוכות', kind: 'rest' },
    ...[15, 16, 17, 18, 19].map(
      (offset): SpecialDay => ({ day: newYear + offset, name: 'חול המועד סוכות', kind: 'chol-hamoed' }),
    ),
    { day: newYear + 20, name: 'הושענא רבה, ערב שמחת תורה', kind: 'chol-hamoed-eve' },
    { day: newYear + 21, name: 'שמיני עצרת ושמחת תורה', kind: 'rest' },
    ...electionDays
      .filter((election) => election.iso.startsWith(`${year}-`))
      .map((election): SpecialDay => ({ day: dayFromIso(election.iso), name: election.name, kind: 'rest' })),
  ]
  const sorted = entries.sort((a, b) => a.day - b.day)
  yearCache.set(year, sorted)
  return sorted
}

export function specialDaysBetween(from: number, to: number) {
  const map = new Map<number, SpecialDay>()
  for (let year = yearOf(from); year <= yearOf(to); year += 1) {
    const days = specialDaysForYear(year)
    if (!days) return null
    for (const special of days) {
      if (special.day >= from && special.day <= to) map.set(special.day, special)
    }
  }
  return map
}

export const calendarAvailable = () => specialDaysForYear(2026) !== null

export const isWeekend = (day: number, week: WeekPattern) => {
  const weekday = weekdayOf(day)
  return weekday === 6 || (weekday === 5 && week === 'sun-thu')
}

export const blocksWork = (special: SpecialDay, settings: WorkSettings) => {
  if (special.kind === 'rest') return true
  const isEve = special.kind === 'eve' || special.kind === 'chol-hamoed-eve'
  const isCholHamoed = special.kind === 'chol-hamoed' || special.kind === 'chol-hamoed-eve'
  return (isEve && !settings.countEves) || (isCholHamoed && !settings.countCholHamoed)
}

type DayStatus = { work: true } | { work: false; weekend: true } | { work: false; weekend: false; special: SpecialDay }

const statusOf = (day: number, settings: WorkSettings, specials: Map<number, SpecialDay>): DayStatus => {
  if (isWeekend(day, settings.week)) return { work: false, weekend: true }
  const special = specials.get(day)
  if (special && blocksWork(special, settings)) return { work: false, weekend: false, special }
  return { work: true }
}

export function countWorkDays(from: number, to: number, settings: WorkSettings): RangeCount | null {
  const result: RangeCount = { workDays: 0, calendarDays: 0, weekendDays: 0, offDays: [] }
  if (to < from) return result
  const specials = specialDaysBetween(from, to)
  if (!specials) return null
  for (let day = from; day <= to; day += 1) {
    result.calendarDays += 1
    const status = statusOf(day, settings, specials)
    if (status.work) result.workDays += 1
    else if (status.weekend) result.weekendDays += 1
    else result.offDays.push(status.special)
  }
  return result
}

export function addWorkDays(start: number, count: number, settings: WorkSettings): DeadlineResult | null {
  const limit = dayFromParts(MAX_YEAR, 12, 31)
  const specials = specialDaysBetween(start, Math.min(limit, start + count * 3 + 60))
  if (!specials) return null
  const result: DeadlineResult = { due: start, calendarDays: 0, weekendDays: 0, offDays: [] }
  let counted = 0
  let day = start
  while (counted < count) {
    day += 1
    if (day > limit) return null
    const status = statusOf(day, settings, specials)
    if (status.work) counted += 1
    else if (status.weekend) result.weekendDays += 1
    else result.offDays.push(status.special)
  }
  result.due = day
  result.calendarDays = day - start
  return result
}

export function nextWorkDay(day: number, settings: WorkSettings) {
  const specials = specialDaysBetween(day, day + 40)
  if (!specials) return null
  let candidate = day
  while (!statusOf(candidate, settings, specials).work) candidate += 1
  return candidate
}

export function paymentDue(
  invoice: number,
  termDays: number,
  basis: PaymentBasis,
  settings: WorkSettings,
): PaymentResult | null {
  const anchor = basis === 'month-end' ? lastDayOfMonth(invoice) : invoice
  const due = anchor + termDays
  if (yearOf(due) > MAX_YEAR) return null
  const specials = specialDaysBetween(due, due)
  const next = nextWorkDay(due, settings)
  const until = countWorkDays(invoice + 1, due, settings)
  if (!specials || next === null || !until) return null
  return {
    anchor,
    due,
    dueIsWorkDay: next === due,
    dueSpecial: specials.get(due) ?? null,
    nextWorkDay: next,
    calendarDays: due - invoice,
    workDaysUntil: until.workDays,
  }
}

export type CalcMode = 'between' | 'deadline' | 'payment'

export type TermChoice = '30' | '45' | '60' | '90' | 'custom'

export type CalcInputs = {
  start: string
  end: string
  includeStart: boolean
  includeEnd: boolean
  from: string
  count: string
  invoice: string
  term: TermChoice
  customTerm: string
  basis: PaymentBasis
}

export type Segment = { text: string; strong?: boolean }

export type Detail = { label: string; value: string }

export type CalcOutcome =
  | { kind: 'incomplete' | 'invalid' | 'unsupported'; message: string }
  | {
      kind: 'result'
      sentence: Segment[]
      details: Detail[]
      steps: string[]
      notice: string
      offDays: SpecialDay[]
      text: string
    }

export const DEFAULT_MODE: CalcMode = 'between'

export const calcModes: { id: CalcMode; label: string; hint: string; hash: string; question: string }[] = [
  {
    id: 'between',
    label: 'ימי עבודה בין תאריכים',
    hint: 'כמה ימי עבודה יש בטווח',
    hash: 'between-dates',
    question: 'בין אילו תאריכים?',
  },
  {
    id: 'deadline',
    label: 'מועד יעד בימי עבודה',
    hint: 'תאריך ועוד מספר ימי עסקים',
    hash: 'deadline',
    question: 'מאיזה תאריך ולכמה ימי עבודה?',
  },
  {
    id: 'payment',
    label: 'מועד תשלום',
    hint: 'שוטף + 30, 45, 60 או 90',
    hash: 'payment-terms',
    question: 'מתי צריך לשלם את החשבונית?',
  },
]

export const modeFromHash = (hash: string) => calcModes.find((mode) => `#${mode.hash}` === hash)?.id ?? null

export const termOptions: { value: TermChoice; label: string }[] = [
  { value: '30', label: '30' },
  { value: '45', label: '45' },
  { value: '60', label: '60' },
  { value: '90', label: '90' },
  { value: 'custom', label: 'אחר' },
]

export const dateError = (value: string) => {
  const parsed = parseDate(value)
  if (parsed.ok || parsed.reason === 'empty') return ''
  if (parsed.reason === 'out-of-range') return `אפשר לבחור תאריך בין 1 בינואר ${MIN_YEAR} ל-31 בדצמבר ${MAX_YEAR}.`
  return 'התאריך לא תקין. בחרו יום, חודש ושנה.'
}

export const countError = (value: string, min: number, max: number) => {
  const parsed = parseCount(value, min, max)
  if (parsed.ok || parsed.reason === 'empty') return ''
  if (parsed.reason === 'out-of-range') {
    return `אפשר להקליד מספר בין ${min} ל-${max.toLocaleString('he-IL')}.`
  }
  return 'הקלידו מספר שלם, בספרות בלבד.'
}

export const endBeforeStart = (inputs: CalcInputs) => {
  const start = parseDate(inputs.start)
  const end = parseDate(inputs.end)
  return start.ok && end.ok && end.day < start.day
}

const weekText = (settings: WorkSettings) => (settings.week === 'sun-thu' ? 'ראשון עד חמישי' : 'ראשון עד שישי')

const weekendLabel = (settings: WorkSettings) => (settings.week === 'sun-thu' ? 'ימי שישי ושבת' : 'ימי שבת')

const offDaysDetails = (offDays: SpecialDay[]): Detail[] => {
  const rest = offDays.filter((special) => special.kind === 'rest').length
  const other = offDays.length - rest
  const details: Detail[] = []
  if (rest) details.push({ label: 'חגים וימי בחירות באמצע השבוע', value: daysText(rest) })
  if (other) details.push({ label: 'ערבי חג וחול המועד שלא נספרו', value: daysText(other) })
  return details
}

const offDaysText = (offDays: SpecialDay[]) =>
  offDays.length
    ? ` ימים שלא נספרו: ${offDays.map((special) => `${formatShortDate(special.day)} ${special.name}`).join('; ')}.`
    : ''

const unsupported: CalcOutcome = {
  kind: 'unsupported',
  message: 'הדפדפן הזה לא מחשב את הלוח העברי, ולכן אי אפשר לחשב את החגים. נסו בדפדפן מעודכן.',
}

function betweenOutcome(inputs: CalcInputs, settings: WorkSettings): CalcOutcome {
  const start = parseDate(inputs.start)
  const end = parseDate(inputs.end)
  if (!start.ok || !end.ok) {
    const empty = (!start.ok && start.reason === 'empty') || (!end.ok && end.reason === 'empty')
    return empty
      ? { kind: 'incomplete', message: 'בחרו תאריך התחלה ותאריך סיום כדי לראות כמה ימי עבודה יש ביניהם.' }
      : { kind: 'invalid', message: 'כדי לראות את התוצאה, תקנו את התאריך שמתחתיו הודעת שגיאה.' }
  }
  if (end.day < start.day) {
    return { kind: 'invalid', message: 'תאריך הסיום מוקדם מתאריך ההתחלה. החליפו ביניהם.' }
  }
  const from = inputs.includeStart ? start.day : start.day + 1
  const to = inputs.includeEnd ? end.day : end.day - 1
  const count = countWorkDays(from, to, settings)
  if (!count) return unsupported
  const removed = count.weekendDays + count.offDays.length
  const range = `בין ${formatShortDate(start.day)} ל-${formatShortDate(end.day)}`
  const inclusion =
    inputs.includeStart && inputs.includeEnd
      ? 'כולל שני התאריכים'
      : inputs.includeStart
        ? 'בלי יום הסיום'
        : inputs.includeEnd
          ? 'בלי יום ההתחלה'
          : 'בלי שני התאריכים'
  return {
    kind: 'result',
    sentence: [
      { text: workDaysText(count.workDays), strong: true },
      { text: ` בין ${formatDate(start.day)} ל-${formatDate(end.day)}` },
    ],
    details: [
      { label: 'ימים בטווח', value: daysText(count.calendarDays) },
      { label: weekendLabel(settings), value: daysText(count.weekendDays) },
      ...offDaysDetails(count.offDays),
    ],
    steps: [
      removed
        ? `${daysText(count.calendarDays)} בטווח, פחות ${nonWorkText(removed)}, הם ${workDaysText(count.workDays)}.`
        : 'כל הימים בטווח הם ימי עבודה.',
    ],
    notice: '',
    offDays: count.offDays,
    text:
      `${range} יש ${workDaysText(count.workDays)} (שבוע של ${weekText(settings)}, ${inclusion}).` +
      offDaysText(count.offDays),
  }
}

function deadlineOutcome(inputs: CalcInputs, settings: WorkSettings): CalcOutcome {
  const start = parseDate(inputs.from)
  const count = parseCount(inputs.count, 1, MAX_WORK_DAYS)
  if (!start.ok || !count.ok) {
    const empty = (!start.ok && start.reason === 'empty') || (!count.ok && count.reason === 'empty')
    return empty
      ? { kind: 'incomplete', message: 'בחרו תאריך התחלה והקלידו מספר ימי עבודה.' }
      : { kind: 'invalid', message: 'כדי לראות את התוצאה, תקנו את השדה שמתחתיו הודעת שגיאה.' }
  }
  const result = addWorkDays(start.day, count.value, settings)
  if (!result) {
    return calendarAvailable()
      ? { kind: 'invalid', message: `המועד יוצא אחרי ${MAX_YEAR}. נסו מספר ימים קטן יותר.` }
      : unsupported
  }
  const ordinal = count.value === 1 ? 'יום העבודה הראשון' : `יום העבודה ה-${count.value}`
  return {
    kind: 'result',
    sentence: [
      { text: `${ordinal} אחרי ${formatDate(start.day)} הוא ` },
      { text: formatLongDate(result.due), strong: true },
    ],
    details: [
      { label: 'ימים קלנדריים עד המועד', value: daysText(result.calendarDays) },
      { label: weekendLabel(settings), value: daysText(result.weekendDays) },
      ...offDaysDetails(result.offDays),
    ],
    steps: [
      result.calendarDays > count.value
        ? `${workDaysText(count.value)} ועוד ${nonWorkText(result.calendarDays - count.value)}` +
          ` הם ${daysText(result.calendarDays)}.`
        : 'אין ימי מנוחה בדרך, כל הימים הם ימי עבודה.',
    ],
    notice: '',
    offDays: result.offDays,
    text:
      `${ordinal} אחרי ${formatShortDate(start.day)} הוא ${formatLongDate(result.due)} (שבוע של ${weekText(settings)}).` +
      offDaysText(result.offDays),
  }
}

const blockingReason = (day: number, special: SpecialDay | null, settings: WorkSettings) => {
  if (special && blocksWork(special, settings) && !isWeekend(day, settings.week)) return special.name
  return weekdayOf(day) === 6 ? 'שבת' : `יום ${weekdayName(day)}`
}

function paymentOutcome(inputs: CalcInputs, settings: WorkSettings): CalcOutcome {
  const invoice = parseDate(inputs.invoice)
  const term =
    inputs.term === 'custom' ? parseCount(inputs.customTerm, 0, MAX_TERM_DAYS) : parseCount(inputs.term, 0, 999)
  if (!invoice.ok || !term.ok) {
    const empty = (!invoice.ok && invoice.reason === 'empty') || (!term.ok && term.reason === 'empty')
    return empty
      ? { kind: 'incomplete', message: 'בחרו את תאריך החשבונית ואת מספר הימים.' }
      : { kind: 'invalid', message: 'כדי לראות את התוצאה, תקנו את השדה שמתחתיו הודעת שגיאה.' }
  }
  const result = paymentDue(invoice.day, term.value, inputs.basis, settings)
  if (!result) {
    return calendarAvailable() ? { kind: 'invalid', message: `מועד התשלום יוצא אחרי ${MAX_YEAR}.` } : unsupported
  }
  const monthEnd = inputs.basis === 'month-end'
  const termName = monthEnd ? `שוטף + ${term.value}` : `${term.value} ימים מתאריך החשבונית`
  const notice = result.dueIsWorkDay
    ? ''
    : `המועד חל ב${blockingReason(result.due, result.dueSpecial, settings)}, שאינו יום עבודה. ` +
      `יום העבודה הבא הוא ${formatLongDate(result.nextWorkDay)}.`
  return {
    kind: 'result',
    sentence: [{ text: 'לתשלום עד ' }, { text: formatLongDate(result.due), strong: true }],
    details: [
      { label: 'ימים מתאריך החשבונית', value: daysText(result.calendarDays) },
      { label: 'ימי עבודה עד המועד', value: workDaysText(result.workDaysUntil) },
    ],
    steps: [
      monthEnd
        ? `סוף החודש של החשבונית: ${formatDate(result.anchor)}`
        : `תאריך החשבונית: ${formatDate(result.anchor)}`,
      `ועוד ${daysText(term.value)}: ${formatDate(result.due)}`,
    ],
    notice,
    offDays: [],
    text: `חשבונית מ-${formatShortDate(invoice.day)}, ${termName}: לתשלום עד ${formatLongDate(result.due)}.${
      notice ? ` ${notice}` : ''
    }`,
  }
}

export function calculate(mode: CalcMode, inputs: CalcInputs, settings: WorkSettings): CalcOutcome {
  if (mode === 'deadline') return deadlineOutcome(inputs, settings)
  if (mode === 'payment') return paymentOutcome(inputs, settings)
  return betweenOutcome(inputs, settings)
}

export function yearSummary(year: number): YearSummary | null {
  const days = specialDaysForYear(year)
  if (!days) return null
  const months: MonthSummary[] = []
  for (let month = 1; month <= 12; month += 1) {
    const from = dayFromParts(year, month, 1)
    const to = dayFromParts(year, month + 1, 1) - 1
    const regular = countWorkDays(from, to, DEFAULT_SETTINGS)
    const strict = countWorkDays(from, to, STRICT_SETTINGS)
    if (!regular || !strict) return null
    months.push({
      month,
      workDays: regular.workDays,
      strictWorkDays: strict.workDays,
      restDays: days.filter((special) => special.kind === 'rest' && special.day >= from && special.day <= to),
    })
  }
  return {
    year,
    months,
    workDays: months.reduce((sum, item) => sum + item.workDays, 0),
    strictWorkDays: months.reduce((sum, item) => sum + item.strictWorkDays, 0),
  }
}
