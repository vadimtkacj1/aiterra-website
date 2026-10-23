export const TAX_YEAR = 2026
export const CEILING = 5_654
export const FLAT_RATE = 0.1
export const SURTAX_THRESHOLD = 721_560
export const PASSIVE_MIN_RATE = 0.31
export const MONTHS_IN_YEAR = 12

export type Bracket = { upTo: number; rate: number }

export const brackets: Bracket[] = [
  { upTo: 84_120, rate: 0.1 },
  { upTo: 120_720, rate: 0.14 },
  { upTo: 228_000, rate: 0.2 },
  { upTo: 301_200, rate: 0.31 },
  { upTo: 560_280, rate: 0.35 },
  { upTo: Infinity, rate: 0.47 },
]

export type RentalInput = { rent: string; months: string; expenses: string; otherIncome: string; senior: boolean }

export type RentalErrors = Partial<Record<'rent' | 'months' | 'expenses' | 'otherIncome', string>>

export type TrackId = 'exemption' | 'flat' | 'regular'

export type Track = { id: TrackId; label: string; taxable: number; tax: number }

export type RentalResult = {
  kind: 'result'
  rent: number
  months: number
  gross: number
  exemptMonthly: number
  tracks: Track[]
  best: TrackId
  surtax: boolean
}

export type RentalOutcome = RentalResult | { kind: 'incomplete' | 'invalid'; message: string }

export const emptyRentalInput: RentalInput = { rent: '', months: '12', expenses: '', otherIncome: '', senior: false }

const MAX_AMOUNT = 100_000_000

export function parseShekels(value: string): number | null | 'empty' {
  const cleaned = value.replace(/[\s,₪]/g, '')
  if (!cleaned) return 'empty'
  if (!/^\d+(\.\d{0,2})?$/.test(cleaned)) return null
  const amount = Number(cleaned)
  return amount > MAX_AMOUNT ? null : amount
}

export const exemptPortion = (monthlyRent: number) =>
  monthlyRent <= CEILING ? monthlyRent : Math.max(0, 2 * CEILING - monthlyRent)

export function incrementalTax(base: number, added: number, senior: boolean) {
  let tax = 0
  let lower = 0
  for (const bracket of brackets) {
    const from = Math.max(lower, base)
    const to = Math.min(bracket.upTo, base + added)
    if (to > from) tax += (to - from) * (senior ? bracket.rate : Math.max(bracket.rate, PASSIVE_MIN_RATE))
    lower = bracket.upTo
  }
  return tax
}

export function computeRental(rent: number, months: number, expenses: number, otherIncome: number, senior: boolean) {
  const gross = rent * months
  const exemptMonthly = exemptPortion(rent)
  const exemptTaxable = (rent - exemptMonthly) * months
  const regularTaxable = Math.max(0, gross - expenses)
  const tracks: Track[] = [
    {
      id: 'exemption',
      label: 'מסלול פטור',
      taxable: exemptTaxable,
      tax: Math.round(incrementalTax(otherIncome, exemptTaxable, senior)),
    },
    { id: 'flat', label: 'מסלול 10%', taxable: gross, tax: Math.round(gross * FLAT_RATE) },
    {
      id: 'regular',
      label: 'מסלול רגיל',
      taxable: regularTaxable,
      tax: Math.round(incrementalTax(otherIncome, regularTaxable, senior)),
    },
  ]
  const best = tracks.reduce((low, track) => (track.tax < low.tax ? track : low), tracks[0]).id
  return {
    kind: 'result' as const,
    rent,
    months,
    gross,
    exemptMonthly,
    tracks,
    best,
    surtax: otherIncome + Math.max(gross, regularTaxable) > SURTAX_THRESHOLD,
  }
}

export function rentalErrors(input: RentalInput): RentalErrors {
  const errors: RentalErrors = {}
  if (parseShekels(input.rent) === null) errors.rent = 'הקלידו סכום בספרות, למשל 6500.'
  const months = input.months.trim()
  if (months && (!/^\d+$/.test(months) || Number(months) < 1 || Number(months) > MONTHS_IN_YEAR)) {
    errors.months = 'הקלידו מספר שלם בין 1 ל-12.'
  }
  if (parseShekels(input.expenses) === null) errors.expenses = 'הקלידו סכום בספרות, או השאירו ריק.'
  if (parseShekels(input.otherIncome) === null) errors.otherIncome = 'הקלידו סכום בספרות, או השאירו ריק.'
  return errors
}

const amountOrZero = (value: string) => {
  const parsed = parseShekels(value)
  return typeof parsed === 'number' ? parsed : 0
}

export function calculateRental(input: RentalInput): RentalOutcome {
  const errors = rentalErrors(input)
  if (Object.keys(errors).length) {
    return { kind: 'invalid', message: 'כדי לראות את התוצאה, תקנו את השדה שמתחתיו הודעת שגיאה.' }
  }
  const rent = parseShekels(input.rent)
  const missing = [typeof rent === 'number' && rent > 0 ? '' : 'שכר הדירה בחודש', input.months.trim() ? '' : 'חודשי השכרה'].filter(
    Boolean,
  )
  if (missing.length || typeof rent !== 'number') {
    return { kind: 'incomplete', message: `כדי לראות את התוצאה, מלאו: ${missing.join(', ')}.` }
  }
  return computeRental(rent, Number(input.months), amountOrZero(input.expenses), amountOrZero(input.otherIncome), input.senior)
}

const shekelFormat = new Intl.NumberFormat('he-IL', { maximumFractionDigits: 0 })

export const formatShekels = (amount: number) => `${shekelFormat.format(Math.round(amount))} ₪`

export const trackLabel = (id: TrackId) =>
  ({ exemption: 'מסלול פטור', flat: 'מסלול 10%', regular: 'מסלול רגיל' })[id]

export type CeilingRow = { rent: number; exempt: number; taxable: number; flat: number }

export const ceilingTable = (): CeilingRow[] =>
  [4_000, 5_654, 6_500, 8_000, 10_000, 11_308, 13_000].map((rent) => ({
    rent,
    exempt: exemptPortion(rent),
    taxable: rent - exemptPortion(rent),
    flat: rent * FLAT_RATE,
  }))

export function resultToText(result: RentalResult) {
  const lines = [
    `מחשבון מס על שכר דירה ${TAX_YEAR}`,
    `שכר דירה: ${formatShekels(result.rent)} בחודש × ${result.months} חודשים = ${formatShekels(result.gross)}`,
    `החלק הפטור בחודש: ${formatShekels(result.exemptMonthly)} (תקרה ${formatShekels(CEILING)})`,
    ...result.tracks.map((track) => `${track.label}: מס ${formatShekels(track.tax)} בשנה`),
    `המסלול הזול ביותר לפי הנתונים: ${trackLabel(result.best)}`,
    'מידע כללי ולא ייעוץ מס. לא כולל נקודות זיכוי ומס יסף.',
    'https://www.aiterra.co.il/tools/rental-income-tax-calculator',
  ]
  return lines.join('\n')
}
