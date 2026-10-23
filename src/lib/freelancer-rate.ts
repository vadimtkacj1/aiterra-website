import { DEFAULT_CREDIT_POINTS, MONTHS_IN_YEAR, TAX_YEAR, calculateTax } from './self-employed-tax'
import { STANDARD_VAT_RATE, breakdown, parseHundredths } from './vat-calculator'

export type DealerType = 'licensed' | 'exempt'

export type RateInput = {
  targetNet: string
  expenses: string
  weeklyHours: string
  billableShare: string
  vacationDays: string
  sickDays: string
  holidayDays: string
  creditPoints: string
  dealer: DealerType
}

export type RateField = Exclude<keyof RateInput, 'dealer'>

export type RateResult = {
  kind: 'result'
  hourly: number
  hourlyWithVat: number
  vatPerHour: number
  daily: number
  workingDays: number
  billableHours: number
  billableHoursMonthly: number
  annualRevenue: number
  annualExpenses: number
  annualProfit: number
  annualTax: number
  annualNet: number
  monthlyRevenue: number
  overExemptCeiling: boolean
}

export type RateOutcome = RateResult | { kind: 'incomplete' } | { kind: 'impossible'; message: string }

export const EXEMPT_CEILING_2026 = 122_833
export const WORK_DAYS_IN_YEAR = 260
export const DAYS_PER_WEEK = 5
export const DEFAULT_HOLIDAY_DAYS = 9
export const RATE_YEAR = TAX_YEAR
export { STANDARD_VAT_RATE }

const VAT_BASIS_POINTS = STANDARD_VAT_RATE * 100

export const defaultRateInput: RateInput = {
  targetNet: '15000',
  expenses: '2000',
  weeklyHours: '40',
  billableShare: '60',
  vacationDays: '15',
  sickDays: '5',
  holidayDays: String(DEFAULT_HOLIDAY_DAYS),
  creditPoints: String(DEFAULT_CREDIT_POINTS.man / 100),
  dealer: 'licensed',
}

export const fieldLimits: Record<RateField, number> = {
  targetNet: 1_000_000,
  expenses: 1_000_000,
  weeklyHours: 80,
  billableShare: 100,
  vacationDays: 120,
  sickDays: 60,
  holidayDays: 30,
  creditPoints: 20,
}

export function parseField(field: RateField, value: string): number | null | 'invalid' {
  if (!value.trim()) return null
  const parsed = parseHundredths(value)
  if (!parsed.ok) return parsed.reason === 'empty' ? null : 'invalid'
  const number = parsed.hundredths / 100
  if (number > fieldLimits[field]) return 'invalid'
  return number
}

const netFor = (profit: number, expenses: number, creditPoints: number) =>
  calculateTax({
    revenueAgorot: (profit + expenses) * 100,
    expensesAgorot: expenses * 100,
    creditPointsHundredths: Math.round(creditPoints * 100),
    months: MONTHS_IN_YEAR,
  })

export function requiredProfit(annualNet: number, annualExpenses: number, creditPoints: number) {
  if (annualNet <= 0) return 0
  let low = annualNet
  let high = annualNet * 3 + 100_000
  while (high - low > 1) {
    const middle = Math.floor((low + high) / 2)
    if (netFor(middle, annualExpenses, creditPoints).net >= annualNet) high = middle
    else low = middle
  }
  return high
}

export function calculateRate(input: RateInput): RateOutcome {
  const values = {} as Record<RateField, number>
  for (const field of Object.keys(fieldLimits) as RateField[]) {
    const parsed = parseField(field, input[field])
    if (parsed === 'invalid') return { kind: 'incomplete' }
    values[field] = parsed ?? 0
  }
  if (!values.targetNet || !values.weeklyHours || !values.billableShare) return { kind: 'incomplete' }

  const workingDays = WORK_DAYS_IN_YEAR - values.vacationDays - values.sickDays - values.holidayDays
  if (workingDays <= 0) {
    return { kind: 'impossible', message: 'ימי החופש, המחלה והחגים עולים על ימי העבודה בשנה. הקטינו אותם.' }
  }

  const billableHours = Math.round(
    ((workingDays * values.weeklyHours) / DAYS_PER_WEEK) * (values.billableShare / 100),
  )
  if (billableHours < 1) return { kind: 'impossible', message: 'לא נשארו שעות לחיוב. הגדילו את השעות או את אחוז החיוב.' }

  const annualExpenses = Math.round(values.expenses * MONTHS_IN_YEAR)
  const annualNetTarget = Math.round(values.targetNet * MONTHS_IN_YEAR)
  const annualProfit = requiredProfit(annualNetTarget, annualExpenses, values.creditPoints)
  const tax = netFor(annualProfit, annualExpenses, values.creditPoints)
  const annualRevenue = annualProfit + annualExpenses
  const hourly = Math.ceil(annualRevenue / billableHours)
  const vatPart = input.dealer === 'licensed' ? breakdown(hourly * 100, 'add', VAT_BASIS_POINTS) : null

  return {
    kind: 'result',
    hourly,
    hourlyWithVat: vatPart ? vatPart.gross / 100 : hourly,
    vatPerHour: vatPart ? vatPart.vat / 100 : 0,
    daily: Math.round((hourly * billableHours) / workingDays),
    workingDays,
    billableHours,
    billableHoursMonthly: Math.round(billableHours / MONTHS_IN_YEAR),
    annualRevenue,
    annualExpenses,
    annualProfit,
    annualTax: tax.total,
    annualNet: tax.net,
    monthlyRevenue: Math.round(annualRevenue / MONTHS_IN_YEAR),
    overExemptCeiling: input.dealer === 'exempt' && annualRevenue > EXEMPT_CEILING_2026,
  }
}

const wholeFormat = new Intl.NumberFormat('he-IL', { maximumFractionDigits: 0 })
const moneyFormat = new Intl.NumberFormat('he-IL', { minimumFractionDigits: 0, maximumFractionDigits: 2 })

export const formatWhole = (value: number) => wholeFormat.format(value)
export const formatMoney = (value: number) => `${moneyFormat.format(value)} ₪`

export function rateToText(result: RateResult, dealer: DealerType) {
  const lines = [
    `תעריף שעתי מינימלי לפרילנסר (${RATE_YEAR}, הערכה)`,
    `לפני מע״מ: ${formatMoney(result.hourly)} לשעה`,
  ]
  if (dealer === 'licensed') lines.push(`כולל מע״מ ${STANDARD_VAT_RATE}%: ${formatMoney(result.hourlyWithVat)} לשעה`)
  lines.push(
    `תעריף יומי: ${formatMoney(result.daily)}`,
    `שעות לחיוב בשנה: ${formatWhole(result.billableHours)}`,
    `הכנסה שנתית נדרשת: ${formatMoney(result.annualRevenue)}`,
    `מס הכנסה וביטוח לאומי בשנה: ${formatMoney(result.annualTax)}`,
    `נטו לשנה: ${formatMoney(result.annualNet)}`,
  )
  return lines.join('\n')
}
