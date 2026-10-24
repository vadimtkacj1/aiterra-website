export type WageKind = 'monthly' | 'hourly'

export type WorkWeek = '5' | '6'

export type DayKey = 'sun' | 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat'

export const workDays: { key: DayKey; label: string }[] = [
  { key: 'sun', label: 'ראשון' },
  { key: 'mon', label: 'שני' },
  { key: 'tue', label: 'שלישי' },
  { key: 'wed', label: 'רביעי' },
  { key: 'thu', label: 'חמישי' },
  { key: 'fri', label: 'שישי' },
]

export const restDay = { key: 'sat' as DayKey, label: 'שבת (מנוחה שבועית)' }

export const MONTHLY_HOURS = 182
export const WEEKLY_NORM = 42
export const FIRST_TIER_HOURS = 2
export const FIRST_TIER_RATE = 1.25
export const SECOND_TIER_RATE = 1.5
export const REST_DAY_RATE = 1.5
export const MAX_WAGE = 1000000
export const MAX_DAY_HOURS = 24

export const defaultNorm = (week: WorkWeek) => (week === '5' ? '8.6' : '8')

export type OvertimeInput = {
  wageKind: WageKind
  wage: string
  week: WorkWeek
  norm: string
  hours: Record<DayKey, string>
}

export const emptyHours = (): Record<DayKey, string> => ({ sun: '', mon: '', tue: '', wed: '', thu: '', fri: '', sat: '' })

export const defaultInput = (): OvertimeInput => ({
  wageKind: 'monthly',
  wage: '',
  week: '5',
  norm: defaultNorm('5'),
  hours: emptyHours(),
})

export type FieldErrors = { wage?: string; norm?: string; hours: Partial<Record<DayKey, string>> }

const parseDecimal = (value: string): number | null => {
  const cleaned = value.trim().replace(',', '.')
  if (!/^\d+(\.\d+)?$/.test(cleaned)) return null
  return Number(cleaned)
}

const parseHours = (value: string): number | null => {
  if (!value.trim()) return 0
  const parsed = parseDecimal(value)
  return parsed !== null && parsed <= MAX_DAY_HOURS ? parsed : null
}

const parseWage = (value: string): number | null => {
  const parsed = parseDecimal(value.replace(/[₪\s]/g, '').replace(/,(?=\d{3})/g, ''))
  return parsed !== null && parsed > 0 && parsed <= MAX_WAGE ? parsed : null
}

export function fieldErrors(input: OvertimeInput): FieldErrors {
  const errors: FieldErrors = { hours: {} }
  if (input.wage.trim() && parseWage(input.wage) === null) errors.wage = 'הקלידו סכום חיובי.'
  const norm = parseDecimal(input.norm)
  if (norm === null || norm < 1 || norm > 12) errors.norm = 'הקלידו תקן יומי בשעות, בין 1 ל-12.'
  for (const { key } of [...workDays, restDay]) {
    if (parseHours(input.hours[key]) === null) errors.hours[key] = `עד ${MAX_DAY_HOURS} שעות.`
  }
  return errors
}

export const hasErrors = (errors: FieldErrors) =>
  Boolean(errors.wage || errors.norm || Object.values(errors.hours).some(Boolean))

export type DayRow = { key: DayKey; label: string; worked: number; regular: number; at125: number; at150: number }

export type OvertimeResult = {
  kind: 'result'
  hourlyWage: number
  derivedFromMonthly: boolean
  norm: number
  rows: DayRow[]
  dailyHours125: number
  dailyHours150: number
  weeklyHours125: number
  weeklyHours150: number
  hours125: number
  hours150: number
  restHours: number
  pay125: number
  pay150: number
  payRest: number
  total: number
  regularHours: number
}

export type OvertimeOutcome =
  | OvertimeResult
  | { kind: 'incomplete'; message: string }
  | { kind: 'invalid'; message: string }

const round2 = (value: number) => Math.round(value * 100) / 100

const split = (hours: number) => ({
  at125: Math.min(hours, FIRST_TIER_HOURS),
  at150: Math.max(0, hours - FIRST_TIER_HOURS),
})

export const hourlyFromMonthly = (monthly: number) => round2(monthly / MONTHLY_HOURS)

export function calculateOvertime(input: OvertimeInput): OvertimeOutcome {
  if (hasErrors(fieldErrors(input))) {
    return { kind: 'invalid', message: 'כדי לראות את התוצאה, תקנו את השדה שמתחתיו הודעת שגיאה.' }
  }
  const wage = parseWage(input.wage)
  if (wage === null) {
    return {
      kind: 'incomplete',
      message: input.wageKind === 'monthly' ? 'כדי לראות את התוצאה, הקלידו שכר חודשי ברוטו.' : 'כדי לראות את התוצאה, הקלידו שכר לשעה.',
    }
  }
  const norm = parseDecimal(input.norm) ?? 8
  const hourlyWage = input.wageKind === 'monthly' ? hourlyFromMonthly(wage) : wage

  const rows: DayRow[] = workDays.map(({ key, label }) => {
    const worked = parseHours(input.hours[key]) ?? 0
    const regular = Math.min(worked, norm)
    const { at125, at150 } = split(Math.max(0, worked - norm))
    return { key, label, worked, regular, at125, at150 }
  })

  const regularHours = rows.reduce((sum, row) => sum + row.regular, 0)
  const weekly = split(Math.max(0, regularHours - WEEKLY_NORM))
  const dailyHours125 = rows.reduce((sum, row) => sum + row.at125, 0)
  const dailyHours150 = rows.reduce((sum, row) => sum + row.at150, 0)
  const hours125 = dailyHours125 + weekly.at125
  const hours150 = dailyHours150 + weekly.at150
  const restHours = parseHours(input.hours.sat) ?? 0

  const pay125 = round2(hours125 * hourlyWage * FIRST_TIER_RATE)
  const pay150 = round2(hours150 * hourlyWage * SECOND_TIER_RATE)
  const payRest = round2(restHours * hourlyWage * REST_DAY_RATE)

  return {
    kind: 'result',
    hourlyWage,
    derivedFromMonthly: input.wageKind === 'monthly',
    norm,
    rows,
    dailyHours125,
    dailyHours150,
    weeklyHours125: weekly.at125,
    weeklyHours150: weekly.at150,
    hours125,
    hours150,
    restHours,
    pay125,
    pay150,
    payRest,
    total: round2(pay125 + pay150 + payRest),
    regularHours,
  }
}

const moneyFormat = new Intl.NumberFormat('he-IL', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
const hoursFormat = new Intl.NumberFormat('he-IL', { maximumFractionDigits: 2 })

export const money = (value: number) => `${moneyFormat.format(value)} ש״ח`

export const hoursText = (value: number) => hoursFormat.format(value)

export function resultToText(result: OvertimeResult) {
  const lines = [
    `מחשבון שעות נוספות: שכר שעתי ${money(result.hourlyWage)}${result.derivedFromMonthly ? ` (שכר חודשי ÷ ${MONTHLY_HOURS})` : ''}`,
    `שעות ב-125%: ${hoursText(result.hours125)} = ${money(result.pay125)}`,
    `שעות ב-150%: ${hoursText(result.hours150)} = ${money(result.pay150)}`,
  ]
  if (result.restHours > 0) lines.push(`שעות במנוחה השבועית ב-150%: ${hoursText(result.restHours)} = ${money(result.payRest)}`)
  lines.push(`סך התשלום על השעות הנוספות: ${money(result.total)}`)
  lines.push('חישוב עזר לפי חוק שעות עבודה ומנוחה. אינו ייעוץ משפטי.')
  lines.push('https://www.aiterra.co.il/tools/overtime-pay-calculator')
  return lines.join('\n')
}
