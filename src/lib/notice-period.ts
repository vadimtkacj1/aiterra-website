import {
  dateOf,
  dayFromParts,
  formatDate,
  formatLongDate,
  monthOf,
  specialDaysForYear,
  weekdayOf,
  yearOf,
} from './work-days'

export type PayBasis = 'salaried' | 'hourly'

export type Direction = 'dismissal' | 'resignation'

export type NoticeInput = { start: string; notice: string; basis: PayBasis | ''; direction: Direction }

export type NoticeLength = { kind: 'days'; hundredths: number } | { kind: 'month' }

export type RestDay = { day: number; name: string }

export type Formula = { text: string; expression: string }

export type NoticeResult = {
  kind: 'result'
  basis: PayBasis
  direction: Direction
  start: number
  notice: number
  completedMonths: number
  monthOrdinal: number
  length: NoticeLength
  section: string
  formula: Formula
  end: number
  halfDay: boolean
  endRest: RestDay[]
  afterRest: number | null
}

export type NoticeOutcome =
  | NoticeResult
  | { kind: 'incomplete'; message: string }
  | { kind: 'invalid'; message: string }

export type NoticeErrors = { start?: string; notice?: string }

export const MIN_START_YEAR = 1950
export const MAX_YEAR = 2099

const UNIT = 100

export const basisOptions: { value: PayBasis; label: string; hint: string }[] = [
  { value: 'salaried', label: 'עובד במשכורת', hint: 'שכר חודשי' },
  { value: 'hourly', label: 'עובד בשכר', hint: 'שכר שעתי או יומי' },
]

export const directionOptions: { value: Direction; label: string }[] = [
  { value: 'dismissal', label: 'פיטורים' },
  { value: 'resignation', label: 'התפטרות' },
]

export const emptyNoticeInput: NoticeInput = { start: '', notice: '', basis: '', direction: 'dismissal' }

export const parseIsoDay = (value: string): number | null => {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value.trim())
  if (!match) return null
  const [year, month, date] = [Number(match[1]), Number(match[2]), Number(match[3])]
  const day = dayFromParts(year, month, date)
  if (yearOf(day) !== year || monthOf(day) !== month || dateOf(day) !== date) return null
  return day
}

const daysInMonth = (year: number, month: number) => dateOf(dayFromParts(year, month + 1, 1) - 1)

export const addMonths = (day: number, months: number) => {
  const total = yearOf(day) * 12 + (monthOf(day) - 1) + months
  const year = Math.floor(total / 12)
  const month = (total % 12) + 1
  return dayFromParts(year, month, Math.min(dateOf(day), daysInMonth(year, month)))
}

export const completedMonthsBetween = (start: number, end: number) => {
  let months = Math.max(0, (yearOf(end) - yearOf(start)) * 12 + (monthOf(end) - monthOf(start)))
  while (months > 0 && addMonths(start, months) > end) months -= 1
  return months
}

export function noticeLength(basis: PayBasis, monthOrdinal: number): NoticeLength {
  if (basis === 'salaried') {
    if (monthOrdinal <= 6) return { kind: 'days', hundredths: monthOrdinal * UNIT }
    if (monthOrdinal <= 12) return { kind: 'days', hundredths: 6 * UNIT + 250 * (monthOrdinal - 6) }
    return { kind: 'month' }
  }
  if (monthOrdinal <= 12) return { kind: 'days', hundredths: monthOrdinal * UNIT }
  if (monthOrdinal <= 24) return { kind: 'days', hundredths: (14 + Math.floor((monthOrdinal - 13) / 2)) * UNIT }
  if (monthOrdinal <= 36) return { kind: 'days', hundredths: (21 + Math.floor((monthOrdinal - 25) / 2)) * UNIT }
  return { kind: 'month' }
}

const sectionFor = (basis: PayBasis, monthOrdinal: number) => {
  if (basis === 'salaried') {
    if (monthOrdinal <= 6) return 'סעיף 3(1)'
    if (monthOrdinal <= 12) return 'סעיף 3(2)'
    return 'סעיף 3(3)'
  }
  if (monthOrdinal <= 12) return 'סעיף 4(1)'
  if (monthOrdinal <= 24) return 'סעיף 4(2)'
  if (monthOrdinal <= 36) return 'סעיף 4(3)'
  return 'סעיף 4(4)'
}

const dayFormat = new Intl.NumberFormat('he-IL', { maximumFractionDigits: 2 })

export const formatNoticeDays = (hundredths: number) => dayFormat.format(hundredths / UNIT)

export const lengthLabel = (length: NoticeLength) => {
  if (length.kind === 'month') return 'חודש'
  if (length.hundredths === UNIT) return 'יום אחד'
  return `${formatNoticeDays(length.hundredths)} ימים`
}

const formulaFor = (basis: PayBasis, monthOrdinal: number, length: NoticeLength): Formula => {
  if (length.kind === 'month') {
    return { text: basis === 'salaried' ? 'אחרי שנת העבודה הראשונה' : 'אחרי שנת העבודה השלישית', expression: '' }
  }
  const days = formatNoticeDays(length.hundredths)
  if (monthOrdinal <= 6 || (basis === 'hourly' && monthOrdinal <= 12)) {
    return { text: 'יום אחד על כל חודש עבודה', expression: `${monthOrdinal} × 1 = ${days}` }
  }
  if (basis === 'salaried') {
    return {
      text: '6 ימים ועוד 2.5 ימים על כל חודש מהחודש השביעי',
      expression: `6 + 2.5 × ${monthOrdinal - 6} = ${days}`,
    }
  }
  const yearStart = monthOrdinal <= 24 ? 13 : 25
  const base = monthOrdinal <= 24 ? 14 : 21
  const pairs = Math.floor((monthOrdinal - yearStart) / 2)
  const which = monthOrdinal <= 24 ? 'השנייה' : 'השלישית'
  return {
    text: `${base} ימים ועוד יום על כל שני חודשים שהושלמו בשנה ${which}`,
    expression: `${base} + ${pairs} = ${days}`,
  }
}

export function restDayOf(day: number): RestDay | null {
  if (weekdayOf(day) === 6) return { day, name: 'שבת' }
  const special = specialDaysForYear(yearOf(day))?.find((item) => item.day === day && item.kind === 'rest')
  return special ? { day, name: special.name } : null
}

export function noticeEnd(notice: number, length: NoticeLength) {
  const end = length.kind === 'month' ? addMonths(notice, 1) : notice + Math.ceil(length.hundredths / UNIT)
  const endRest: RestDay[] = []
  let cursor = end
  for (let rest = restDayOf(cursor); rest && endRest.length < 7; rest = restDayOf(cursor)) {
    endRest.push(rest)
    cursor += 1
  }
  return {
    end,
    halfDay: length.kind === 'days' && length.hundredths % UNIT !== 0,
    endRest,
    afterRest: endRest.length ? cursor : null,
  }
}

export function noticeErrors(input: NoticeInput): NoticeErrors {
  const errors: NoticeErrors = {}
  const start = input.start ? parseIsoDay(input.start) : null
  const notice = input.notice ? parseIsoDay(input.notice) : null
  if (input.start && start === null) errors.start = 'התאריך לא תקין.'
  else if (start !== null && (yearOf(start) < MIN_START_YEAR || yearOf(start) > MAX_YEAR)) {
    errors.start = `בחרו שנה בין ${MIN_START_YEAR} ל-${MAX_YEAR}.`
  }
  if (input.notice && notice === null) errors.notice = 'התאריך לא תקין.'
  else if (notice !== null && (yearOf(notice) < MIN_START_YEAR || yearOf(notice) > MAX_YEAR)) {
    errors.notice = `בחרו שנה בין ${MIN_START_YEAR} ל-${MAX_YEAR}.`
  } else if (notice !== null && start !== null && !errors.start && notice < start) {
    errors.notice = 'יום מתן ההודעה הוא לפני תחילת העבודה.'
  }
  return errors
}

export function calculateNotice(input: NoticeInput): NoticeOutcome {
  const errors = noticeErrors(input)
  if (errors.start || errors.notice) {
    return { kind: 'invalid', message: 'כדי לראות את התוצאה, תקנו את השדה שמתחתיו הודעת שגיאה.' }
  }
  const missing = [
    input.basis ? '' : 'סוג העובד',
    input.start ? '' : 'תאריך תחילת העבודה',
    input.notice ? '' : 'יום מתן ההודעה',
  ].filter(Boolean)
  if (missing.length || !input.basis) {
    return { kind: 'incomplete', message: `כדי לראות את התוצאה, מלאו: ${joinHebrew(missing)}.` }
  }
  return buildResult(input.basis, input.direction, parseIsoDay(input.start) ?? 0, parseIsoDay(input.notice) ?? 0)
}

export function buildResult(basis: PayBasis, direction: Direction, start: number, notice: number): NoticeResult {
  const completedMonths = completedMonthsBetween(start, notice)
  const monthOrdinal = completedMonths + 1
  const length = noticeLength(basis, monthOrdinal)
  return {
    kind: 'result',
    basis,
    direction,
    start,
    notice,
    completedMonths,
    monthOrdinal,
    length,
    section: sectionFor(basis, monthOrdinal),
    formula: formulaFor(basis, monthOrdinal, length),
    ...noticeEnd(notice, length),
  }
}

export function joinHebrew(parts: string[]) {
  if (parts.length <= 1) return parts.join('')
  const last = parts[parts.length - 1]
  return `${parts.slice(0, -1).join(', ')} ${/^\d/.test(last) ? 'ו-' : 'ו'}${last}`
}

const unit = (value: number, one: string, two: string, many: string) => {
  if (value === 1) return one
  if (value === 2) return two
  return `${value} ${many}`
}

export const seniorityLabel = (completedMonths: number) => {
  const years = Math.floor(completedMonths / 12)
  const months = completedMonths % 12
  const text = [
    years ? unit(years, 'שנה', 'שנתיים', 'שנים') : '',
    months ? unit(months, 'חודש', 'חודשיים', 'חודשים') : '',
  ].filter(Boolean)
  return text.length ? joinHebrew(text) : 'פחות מחודש'
}

export const ordinalLabel = (monthOrdinal: number) => `החודש ה-${monthOrdinal} לעבודה`

export function resultToText(result: NoticeResult) {
  const who = result.direction === 'dismissal' ? 'פיטורים' : 'התפטרות'
  const basis = result.basis === 'salaried' ? 'עובד במשכורת' : 'עובד בשכר (שעתי או יומי)'
  const lines = [
    `מחשבון הודעה מוקדמת: ${who}, ${basis}`,
    `תחילת העבודה: ${formatDate(result.start)}`,
    `ההודעה ניתנה: ${formatDate(result.notice)} (${ordinalLabel(result.monthOrdinal)}, ותק ${seniorityLabel(result.completedMonths)})`,
    `תקופת ההודעה: ${lengthLabel(result.length)} (${result.section} לחוק הודעה מוקדמת${result.direction === 'resignation' ? ' וסעיף 5' : ''})`,
    `היום האחרון של תקופת ההודעה: ${formatLongDate(result.end)}${result.halfDay ? ', חצי יום' : ''}`,
  ]
  if (result.afterRest !== null) {
    lines.push(`לפי סעיף 10(ג) לחוק הפרשנות, ימי מנוחה בסוף התקופה לא נמנים: ${formatLongDate(result.afterRest)}`)
  }
  lines.push('המינימום לפי חוק הודעה מוקדמת לפיטורים ולהתפטרות, התשס״א-2001. חוזה או הסכם קיבוצי יכולים לקבוע יותר.')
  lines.push('https://www.aiterra.co.il/tools/notice-period-calculator')
  return lines.join('\n')
}

export type FirstYearRow = { month: number; salaried: string; hourly: string }

export function firstYearTable(): FirstYearRow[] {
  return Array.from({ length: 12 }, (_, index) => ({
    month: index + 1,
    salaried: lengthLabel(noticeLength('salaried', index + 1)),
    hourly: lengthLabel(noticeLength('hourly', index + 1)),
  }))
}

export type LaterYearsRow = { months: string; hourly: string }

export function laterYearsTable(): LaterYearsRow[] {
  const rows: LaterYearsRow[] = []
  for (let month = 13; month <= 36; month += 2) {
    rows.push({ months: `${month}–${month + 1}`, hourly: lengthLabel(noticeLength('hourly', month)) })
  }
  return rows
}

export type NoticeExample = { label: string; result: NoticeResult }

export function noticeExamples(): NoticeExample[] {
  return [
    {
      label: 'עובד בשכר שהתחיל לעבוד ב-1 במרץ 2025 וקיבל מכתב פיטורים ב-15 באוקטובר 2026',
      result: buildResult('hourly', 'dismissal', dayFromParts(2025, 3, 1), dayFromParts(2026, 10, 15)),
    },
    {
      label: 'עובדת במשכורת שהתחילה לעבוד ב-10 בינואר 2026 ומודיעה על התפטרות ב-20 באוגוסט 2026',
      result: buildResult('salaried', 'resignation', dayFromParts(2026, 1, 10), dayFromParts(2026, 8, 20)),
    },
    {
      label: 'עובד במשכורת עם ותק של שלוש שנים שקיבל מכתב פיטורים ב-31 בינואר 2027',
      result: buildResult('salaried', 'dismissal', dayFromParts(2024, 1, 1), dayFromParts(2027, 1, 31)),
    },
  ]
}
