import { dayFromParts, formatDate, isoFromDay, weekdayName } from './work-days'

export type Qualification = 'full' | 'partial' | 'none'

export const LONG_LEAVE_WEEKS = 26
export const SHORT_LEAVE_WEEKS = 15
export const MIN_SHORTENED_WEEKS = 15
export const EXTRA_BABY_WEEKS = 3
export const MAX_WEEKS_BEFORE = 7
export const MONTHS_FOR_LONG_LEAVE = 12
export const PREGNANCY_PROTECTION_MONTHS = 6
export const DISMISSAL_PROTECTION_DAYS = 60
export const MAX_DAILY_PAY_AGOROT = 175233
export const MAX_BABIES = 4
const MAX_BIRTH_GAP_DAYS = 140
const MIN_YEAR = 2000
const MAX_YEAR = 2099

export const payRules: Record<Exclude<Qualification, 'none'>, { weeks: number; extraWeeks: number; daysBefore: number }> = {
  full: { weeks: 15, extraWeeks: 3, daysBefore: 53 },
  partial: { weeks: 8, extraWeeks: 2, daysBefore: 28 },
}

export const qualificationOptions: { value: Qualification; label: string; hint: string }[] = [
  {
    value: 'full',
    label: '10 חודשים מתוך 14, או 15 מתוך 22',
    hint: 'דמי לידה מלאים: 15 שבועות',
  },
  {
    value: 'partial',
    label: '6 עד 9 חודשים מתוך 14',
    hint: 'דמי לידה חלקיים: 8 שבועות',
  },
  {
    value: 'none',
    label: 'פחות מ-6 חודשים מתוך 14',
    hint: 'אין דמי לידה לפי תקופת האכשרה',
  },
]

export const babyOptions = [
  { value: '1', label: 'תינוק אחד' },
  { value: '2', label: 'תאומים' },
  { value: '3', label: 'שלישייה' },
  { value: '4', label: 'רביעייה' },
]

export type MaternityInput = {
  expected: string
  actual: string
  start: string
  months: string
  qualification: Qualification
  babies: string
}

export const defaultInput: MaternityInput = {
  expected: '',
  actual: '',
  start: '',
  months: '',
  qualification: 'full',
  babies: '1',
}

export type FieldErrors = { expected?: string; actual?: string; start?: string; months?: string }

const parseIso = (value: string): number | null => {
  const trimmed = value.trim()
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(trimmed)
  if (!match) return null
  const year = Number(match[1])
  if (year < MIN_YEAR || year > MAX_YEAR) return null
  const day = dayFromParts(year, Number(match[2]), Number(match[3]))
  return isoFromDay(day) === trimmed ? day : null
}

const parseMonths = (value: string): number | null => {
  const trimmed = value.trim()
  if (!/^\d{1,3}$/.test(trimmed)) return null
  const months = Number(trimmed)
  return months <= 600 ? months : null
}

type Parsed = { expected: number | null; actual: number | null; start: number | null; months: number | null }

const parseAll = (input: MaternityInput, errors: FieldErrors): Parsed => {
  const expected = parseIso(input.expected)
  const actual = input.actual.trim() ? parseIso(input.actual) : null
  const start = input.start.trim() ? parseIso(input.start) : null
  const months = input.months.trim() ? parseMonths(input.months) : null
  if (input.expected.trim() && expected === null) errors.expected = 'תאריך לא תקין.'
  if (input.actual.trim() && actual === null) errors.actual = 'תאריך לא תקין.'
  if (input.start.trim() && start === null) errors.start = 'תאריך לא תקין.'
  if (input.months.trim() && months === null) errors.months = 'הקלידו מספר חודשים שלם, למשל 18.'
  if (expected !== null && actual !== null && Math.abs(actual - expected) > MAX_BIRTH_GAP_DAYS) {
    errors.actual = 'תאריך הלידה רחוק מדי מהתאריך המשוער. בדקו את שני התאריכים.'
  }
  if (expected !== null && start !== null && !errors.actual) {
    const birth = actual ?? expected
    if (start > birth) {
      errors.start = actual !== null ? 'החופשה מתחילה לכל המאוחר ביום הלידה.' : 'החופשה מתחילה לכל המאוחר ביום הלידה המשוער.'
    } else if (start < expected - MAX_WEEKS_BEFORE * 7) {
      errors.start = `אפשר לצאת לחופשה עד ${MAX_WEEKS_BEFORE} שבועות לפני התאריך המשוער, כלומר מ-${formatDate(
        expected - MAX_WEEKS_BEFORE * 7,
      )}.`
    }
  }
  return { expected, actual, start, months }
}

export function fieldErrors(input: MaternityInput): FieldErrors {
  const errors: FieldErrors = {}
  parseAll(input, errors)
  return errors
}

export type PaidPeriod = { weeks: number; days: number; from: number; to: number }

export type MaternityResult = {
  kind: 'result'
  expected: number
  birth: number
  birthIsActual: boolean
  start: number
  lastDay: number
  returnDay: number
  daysBeforeBirth: number
  longLeave: boolean
  babies: number
  totalWeeks: number
  totalDays: number
  extraWeeks: number
  qualification: Qualification
  paid: PaidPeriod | null
  unpaidDays: number
  protectedUntil: number
  pregnancyProtection: boolean
  earliestReturn: number | null
  shortestWeeks: number | null
  lateBirth: boolean
  paidPastLeave: boolean
}

export type MaternityOutcome =
  | MaternityResult
  | { kind: 'incomplete'; message: string }
  | { kind: 'invalid'; message: string }

const overlap = (a: { from: number; to: number }, b: { from: number; to: number }) =>
  Math.max(0, Math.min(a.to, b.to) - Math.max(a.from, b.from) + 1)

export function paidPeriodFor(
  qualification: Qualification,
  babies: number,
  start: number,
  birth: number,
): PaidPeriod | null {
  if (qualification === 'none') return null
  const rule = payRules[qualification]
  const weeks = rule.weeks + rule.extraWeeks * (babies - 1)
  const from = Math.max(start, birth - rule.daysBefore)
  return { weeks, days: weeks * 7, from, to: from + weeks * 7 - 1 }
}

export function calculateMaternity(input: MaternityInput): MaternityOutcome {
  const errors: FieldErrors = {}
  const parsed = parseAll(input, errors)
  if (Object.values(errors).some(Boolean)) {
    return { kind: 'invalid', message: 'כדי לראות את התוצאה, תקנו את השדה שמתחתיו הודעת שגיאה.' }
  }
  const missing = [parsed.expected === null ? 'תאריך לידה משוער' : '', parsed.months === null ? 'ותק אצל המעסיק' : ''].filter(
    Boolean,
  )
  if (parsed.expected === null || parsed.months === null) {
    return { kind: 'incomplete', message: `כדי לראות את התוצאה, מלאו: ${missing.join(' ו')}.` }
  }

  const babies = Math.min(MAX_BABIES, Math.max(1, Number(input.babies) || 1))
  const expected = parsed.expected
  const birth = parsed.actual ?? expected
  const start = parsed.start ?? birth
  const longLeave = parsed.months >= MONTHS_FOR_LONG_LEAVE
  const extraWeeks = EXTRA_BABY_WEEKS * (babies - 1)
  const totalWeeks = (longLeave ? LONG_LEAVE_WEEKS : SHORT_LEAVE_WEEKS) + extraWeeks
  const totalDays = totalWeeks * 7
  const lastDay = start + totalDays - 1
  const paid = paidPeriodFor(input.qualification, babies, start, birth)
  const leave = { from: start, to: lastDay }
  const shortestWeeks = longLeave ? MIN_SHORTENED_WEEKS + extraWeeks : null

  return {
    kind: 'result',
    expected,
    birth,
    birthIsActual: parsed.actual !== null,
    start,
    lastDay,
    returnDay: lastDay + 1,
    daysBeforeBirth: birth - start,
    longLeave,
    babies,
    totalWeeks,
    totalDays,
    extraWeeks,
    qualification: input.qualification,
    paid,
    unpaidDays: totalDays - (paid ? overlap(paid, leave) : 0),
    protectedUntil: lastDay + DISMISSAL_PROTECTION_DAYS,
    pregnancyProtection: parsed.months >= PREGNANCY_PROTECTION_MONTHS,
    earliestReturn: shortestWeeks !== null && shortestWeeks < totalWeeks ? start + shortestWeeks * 7 : null,
    shortestWeeks,
    lateBirth: parsed.actual !== null && parsed.actual > expected,
    paidPastLeave: paid !== null && paid.to > lastDay,
  }
}

const weekWord = (weeks: number) => {
  if (weeks === 1) return 'שבוע אחד'
  if (weeks === 2) return 'שבועיים'
  return `${weeks} שבועות`
}

const dayWord = (days: number) => {
  if (days === 1) return 'יום אחד'
  if (days === 2) return 'יומיים'
  return `${days} ימים`
}

export const durationText = (days: number) => {
  if (days <= 0) return 'אין'
  const weeks = Math.floor(days / 7)
  const rest = days % 7
  if (!weeks) return dayWord(rest)
  if (!rest) return weekWord(weeks)
  if (rest === 1) return `${weekWord(weeks)} ויום אחד`
  if (rest === 2) return `${weekWord(weeks)} ויומיים`
  return `${weekWord(weeks)} ו-${rest} ימים`
}

export const formatDayLong = (day: number) => `יום ${weekdayName(day)}, ${formatDate(day)}`

const moneyFormat = new Intl.NumberFormat('he-IL', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

export const formatMoney = (agorot: number) => `${moneyFormat.format(agorot / 100)} ₪`

export type ScenarioRow = { label: string; leaveWeeks: number; paidWeeks: number; unpaidWeeks: number }

export function scenarioTable(): ScenarioRow[] {
  const scenarios: { label: string; months: string; qualification: Qualification; babies: string }[] = [
    { label: 'ותק של 12 חודשים ומעלה, דמי לידה מלאים', months: '12', qualification: 'full', babies: '1' },
    { label: 'ותק של 12 חודשים ומעלה, דמי לידה חלקיים', months: '12', qualification: 'partial', babies: '1' },
    { label: 'ותק של פחות מ-12 חודשים, דמי לידה מלאים', months: '11', qualification: 'full', babies: '1' },
    { label: 'ותק של פחות מ-12 חודשים, דמי לידה חלקיים', months: '11', qualification: 'partial', babies: '1' },
    { label: 'תאומים, ותק של 12 חודשים ומעלה, דמי לידה מלאים', months: '12', qualification: 'full', babies: '2' },
    { label: 'שלישייה, ותק של 12 חודשים ומעלה, דמי לידה מלאים', months: '12', qualification: 'full', babies: '3' },
    { label: 'תאומים, ותק של פחות מ-12 חודשים, דמי לידה חלקיים', months: '11', qualification: 'partial', babies: '2' },
  ]
  return scenarios.map((scenario) => {
    const outcome = calculateMaternity({ ...defaultInput, expected: '2027-01-01', ...scenario })
    if (outcome.kind !== 'result') throw new Error('scenario failed')
    return {
      label: scenario.label,
      leaveWeeks: outcome.totalWeeks,
      paidWeeks: outcome.paid ? outcome.paid.weeks : 0,
      unpaidWeeks: outcome.unpaidDays / 7,
    }
  })
}

export function resultToText(result: MaternityResult) {
  const lines = [
    `מחשבון חופשת לידה: ${result.birthIsActual ? 'תאריך הלידה' : 'תאריך לידה משוער'} ${formatDate(result.birth)}`,
    `אורך חופשת הלידה: ${weekWord(result.totalWeeks)}`,
    `תחילת החופשה: ${formatDate(result.start)}`,
    `היום האחרון של החופשה: ${formatDate(result.lastDay)}`,
    `חזרה לעבודה: ${formatDate(result.returnDay)}`,
  ]
  if (result.paid) {
    lines.push(`דמי לידה מביטוח לאומי: ${weekWord(result.paid.weeks)}, ${formatDate(result.paid.from)} עד ${formatDate(result.paid.to)}`)
  } else {
    lines.push('דמי לידה: לפי הנתונים שהוזנו אין זכאות. ביטוח לאומי קובע סופית.')
  }
  lines.push(`ללא תשלום בתוך החופשה: ${durationText(result.unpaidDays)}`)
  lines.push(`הגנה מפיטורים: עד ${formatDate(result.protectedUntil)}, 60 יום אחרי סוף החופשה`)
  lines.push('חישוב עזר לפי סעיפים 6 ו-9 לחוק עבודת נשים ופרסומי הביטוח הלאומי. אינו ייעוץ משפטי.')
  lines.push('https://www.aiterra.co.il/tools/maternity-leave-calculator')
  return lines.join('\n')
}
