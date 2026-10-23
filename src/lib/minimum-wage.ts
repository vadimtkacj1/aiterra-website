import { parseHundredths } from './vat-calculator'

export type WagePeriodId = '2026' | '2025'

export type AgeGroup = 'adult' | 'age17' | 'age16' | 'under16' | 'apprentice'

export type PayBasis = 'monthly' | 'hourly' | 'daily'

export type WorkWeek = '5' | '6'

type AdultRates = { monthly: number; hourly182: number; hourly186: number; daily5: number; daily6: number }

export type WagePeriod = { id: WagePeriodId; label: string; short: string; adult: AdultRates }

export const wagePeriods: WagePeriod[] = [
  {
    id: '2026',
    label: 'מ-1 באפריל 2026',
    short: 'מ-1.4.2026',
    adult: { monthly: 644385, hourly182: 3540, hourly186: 3464, daily5: 29740, daily6: 25775 },
  },
  {
    id: '2025',
    label: '1 באפריל 2025 עד 31 במרץ 2026',
    short: '1.4.2025–31.3.2026',
    adult: { monthly: 624767, hourly182: 3432, hourly186: 3358, daily5: 28835, daily6: 24990 },
  },
]

export const CURRENT_PERIOD: WagePeriodId = '2026'

export const NEXT_UPDATE_TEXT = '1 באפריל 2027'

export const YOUTH_HOURS_DIVISOR = 173

export type AgeGroupInfo = { id: AgeGroup; label: string; short: string; percent: number }

export const ageGroups: AgeGroupInfo[] = [
  { id: 'adult', label: 'גיל 18 ומעלה', short: '18 ומעלה', percent: 100 },
  { id: 'age17', label: 'גיל 17', short: 'גיל 17', percent: 83 },
  { id: 'age16', label: 'גיל 16', short: 'גיל 16', percent: 75 },
  { id: 'under16', label: 'מתחת לגיל 16', short: 'מתחת ל-16', percent: 70 },
  { id: 'apprentice', label: 'חניך לפי חוק החניכות', short: 'חניך', percent: 60 },
]

export const payBases: { id: PayBasis; label: string }[] = [
  { id: 'monthly', label: 'שכר חודשי' },
  { id: 'hourly', label: 'שכר לשעה' },
  { id: 'daily', label: 'שכר יומי' },
]

export const MAX_HOURS = 400
export const MAX_DAYS = 31

const periodById = (id: WagePeriodId) => wagePeriods.find((period) => period.id === id) ?? wagePeriods[0]

const groupById = (id: AgeGroup) => ageGroups.find((group) => group.id === id) ?? ageGroups[0]

export const isYouth = (age: AgeGroup) => age !== 'adult'

export const fullMonthly = (periodId: WagePeriodId, age: AgeGroup) => {
  const adult = periodById(periodId).adult.monthly
  return Math.floor((adult * groupById(age).percent) / 100)
}

export const hourlyRate = (periodId: WagePeriodId, age: AgeGroup) =>
  isYouth(age) ? Math.floor(fullMonthly(periodId, age) / YOUTH_HOURS_DIVISOR) : periodById(periodId).adult.hourly182

export const lawHourlyRate = (periodId: WagePeriodId) => periodById(periodId).adult.hourly186

export const dailyRate = (periodId: WagePeriodId, week: WorkWeek) => {
  const adult = periodById(periodId).adult
  return week === '5' ? adult.daily5 : adult.daily6
}

export const basesFor = (age: AgeGroup) => payBases.filter((basis) => basis.id !== 'daily' || !isYouth(age))

export type MinimumWageInput = {
  period: WagePeriodId
  age: AgeGroup
  basis: PayBasis
  scope: string
  hours: string
  days: string
  week: WorkWeek
  paid: string
}

export const defaultInput: MinimumWageInput = {
  period: CURRENT_PERIOD,
  age: 'adult',
  basis: 'monthly',
  scope: '100',
  hours: '',
  days: '',
  week: '5',
  paid: '',
}

export type FieldErrors = { scope?: string; hours?: string; days?: string; paid?: string }

type Parsed = { value: number | null; error?: string }

const parseScope = (input: string): Parsed => {
  if (!input.trim()) return { value: null, error: 'הקלידו היקף משרה באחוזים, למשל 100 או 50.' }
  const parsed = parseHundredths(input)
  if (!parsed.ok || parsed.hundredths <= 0 || parsed.hundredths > 10000) {
    return { value: null, error: 'היקף משרה הוא מספר בין 1 ל-100.' }
  }
  return { value: parsed.hundredths }
}

const parseOptionalCount = (input: string, max: number, label: string): Parsed => {
  if (!input.trim()) return { value: null }
  const parsed = parseHundredths(input)
  if (!parsed.ok || parsed.hundredths <= 0 || parsed.hundredths > max * 100) {
    return { value: null, error: `${label} הוא מספר בין 1 ל-${max}.` }
  }
  return { value: parsed.hundredths }
}

const parsePaid = (input: string): Parsed => {
  if (!input.trim()) return { value: null }
  const parsed = parseHundredths(input)
  if (!parsed.ok) return { value: null, error: 'הקלידו סכום בספרות, למשל 6500 או 35.5.' }
  if (parsed.hundredths > 100_000_000) return { value: null, error: 'הסכום גדול מדי.' }
  return { value: parsed.hundredths }
}

export function fieldErrors(input: MinimumWageInput): FieldErrors {
  const errors: FieldErrors = {}
  if (input.basis === 'monthly') errors.scope = parseScope(input.scope).error
  if (input.basis === 'hourly') errors.hours = parseOptionalCount(input.hours, MAX_HOURS, 'מספר השעות').error
  if (input.basis === 'daily') errors.days = parseOptionalCount(input.days, MAX_DAYS, 'מספר הימים').error
  errors.paid = parsePaid(input.paid).error
  return errors
}

export type WageCheck = { paid: number; gap: number; meets: boolean; totalGap: number | null }

export type MinimumWageResult = {
  kind: 'result'
  period: WagePeriod
  age: AgeGroupInfo
  basis: PayBasis
  minimum: number
  unit: string
  fullMonthly: number
  scopeHundredths: number | null
  quantity: { count: number; label: string; total: number } | null
  lawHourly: number | null
  check: WageCheck | null
}

export type MinimumWageOutcome = MinimumWageResult | { kind: 'invalid'; message: string }

const unitFor = (basis: PayBasis) => {
  if (basis === 'hourly') return 'לשעה'
  if (basis === 'daily') return 'ליום'
  return 'לחודש'
}

const multiply = (rate: number, countHundredths: number) => Math.round((rate * countHundredths) / 100)

export function calculateMinimumWage(input: MinimumWageInput): MinimumWageOutcome {
  const errors = fieldErrors(input)
  if (errors.scope || errors.hours || errors.days || errors.paid) {
    return { kind: 'invalid', message: 'כדי לראות את התוצאה, תקנו את השדה שמתחתיו הודעת שגיאה.' }
  }
  const basis: PayBasis = input.basis === 'daily' && isYouth(input.age) ? 'monthly' : input.basis
  const period = periodById(input.period)
  const age = groupById(input.age)
  const monthlyFull = fullMonthly(period.id, age.id)
  let minimum = monthlyFull
  let scopeHundredths: number | null = null
  let quantity: MinimumWageResult['quantity'] = null

  if (basis === 'monthly') {
    scopeHundredths = parseScope(input.scope).value ?? 10000
    minimum = Math.floor((monthlyFull * scopeHundredths) / 10000)
  }
  if (basis === 'hourly') {
    minimum = hourlyRate(period.id, age.id)
    const hours = parseOptionalCount(input.hours, MAX_HOURS, '').value
    if (hours !== null) quantity = { count: hours, label: 'שעות', total: multiply(minimum, hours) }
  }
  if (basis === 'daily') {
    minimum = dailyRate(period.id, input.week)
    const days = parseOptionalCount(input.days, MAX_DAYS, '').value
    if (days !== null) quantity = { count: days, label: 'ימים', total: multiply(minimum, days) }
  }

  const paid = parsePaid(input.paid).value
  let check: WageCheck | null = null
  if (paid !== null) {
    const gap = Math.max(0, minimum - paid)
    check = {
      paid,
      gap,
      meets: gap === 0,
      totalGap: quantity && gap > 0 ? multiply(gap, quantity.count) : null,
    }
  }

  return {
    kind: 'result',
    period,
    age,
    basis,
    minimum,
    unit: unitFor(basis),
    fullMonthly: monthlyFull,
    scopeHundredths,
    quantity,
    lawHourly: basis === 'hourly' && !isYouth(age.id) ? lawHourlyRate(period.id) : null,
    check,
  }
}

const moneyFormat = new Intl.NumberFormat('he-IL', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
const countFormat = new Intl.NumberFormat('he-IL', { maximumFractionDigits: 2 })

export const formatMoney = (agorot: number) => `${moneyFormat.format(agorot / 100)} ₪`

export const formatCount = (hundredths: number) => countFormat.format(hundredths / 100)

export const formatPercent = (hundredths: number) => `${countFormat.format(hundredths / 100)}%`

export type YouthRow = { id: AgeGroup; label: string; percent: number; monthly: number; hourly: number }

export function youthTable(periodId: WagePeriodId): YouthRow[] {
  return ageGroups
    .filter((group) => isYouth(group.id))
    .map((group) => ({
      id: group.id,
      label: group.label,
      percent: group.percent,
      monthly: fullMonthly(periodId, group.id),
      hourly: hourlyRate(periodId, group.id),
    }))
}

export type AdultRow = { label: string; current: number; previous: number }

export function adultTable(): AdultRow[] {
  const [current, previous] = [periodById('2026').adult, periodById('2025').adult]
  return [
    { label: 'לחודש, משרה מלאה', current: current.monthly, previous: previous.monthly },
    { label: 'לשעה, לפי 182 שעות בחודש', current: current.hourly182, previous: previous.hourly182 },
    { label: 'לשעה, לפי 186 שעות בחוק', current: current.hourly186, previous: previous.hourly186 },
    { label: 'ליום, שבוע עבודה של 5 ימים', current: current.daily5, previous: previous.daily5 },
    { label: 'ליום, שבוע עבודה של 6 ימים', current: current.daily6, previous: previous.daily6 },
  ]
}

export type ScopeRow = { scope: number; current: number; previous: number }

export function scopeTable(scopes = [100, 80, 75, 60, 50, 40, 25]): ScopeRow[] {
  const current = fullMonthly('2026', 'adult')
  const previous = fullMonthly('2025', 'adult')
  return scopes.map((scope) => ({
    scope,
    current: Math.floor((current * scope) / 100),
    previous: Math.floor((previous * scope) / 100),
  }))
}

export function resultToText(result: MinimumWageResult) {
  const lines = [
    `שכר מינימום ${result.period.label}, ${result.age.label}`,
    `שכר המינימום ${result.unit}: ${formatMoney(result.minimum)}`,
  ]
  if (result.scopeHundredths !== null && result.scopeHundredths !== 10000) {
    lines.push(`היקף משרה: ${formatPercent(result.scopeHundredths)} (משרה מלאה: ${formatMoney(result.fullMonthly)})`)
  }
  if (result.quantity) {
    lines.push(`${formatCount(result.quantity.count)} ${result.quantity.label}: ${formatMoney(result.quantity.total)} לפחות`)
  }
  if (result.check) {
    lines.push(
      result.check.meets
        ? `השכר ששולם, ${formatMoney(result.check.paid)} ${result.unit}, לא נמוך משכר המינימום`
        : `השכר ששולם, ${formatMoney(result.check.paid)} ${result.unit}, נמוך משכר המינימום ב-${formatMoney(result.check.gap)}`,
    )
    if (result.check.totalGap !== null) lines.push(`ההפרש לתקופה: ${formatMoney(result.check.totalGap)}`)
  }
  lines.push('חישוב עזר לפי חוק שכר מינימום ופרסומי הביטוח הלאומי ומשרד העבודה. אינו ייעוץ משפטי.')
  lines.push('https://www.aiterra.co.il/tools/minimum-wage-2026')
  return lines.join('\n')
}
