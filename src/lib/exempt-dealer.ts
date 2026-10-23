export const THRESHOLD_YEAR = 2026
export const THRESHOLD = 122_833
export const PREVIOUS_THRESHOLD = 120_000
export const MONTHS_IN_YEAR = 12

export const monthNames = [
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

export type ExemptDealerInput = { turnover: string; month: string; monthly: string }

export type ExemptDealerErrors = { turnover?: string; monthly?: string }

export type Projection = { month: number; cumulative: number }

export type ExemptDealerResult = {
  kind: 'result'
  turnover: number
  month: number
  monthly: number
  remaining: number
  crossed: boolean
  allowedPerMonth: number | null
  crossingMonth: number | null
  yearEnd: number
  projection: Projection[]
}

export type ExemptDealerOutcome = ExemptDealerResult | { kind: 'incomplete' | 'invalid'; message: string }

export const emptyExemptDealerInput: ExemptDealerInput = { turnover: '', month: '', monthly: '' }

const MAX_AMOUNT = 1_000_000_000

export function parseShekels(value: string): number | null | 'empty' {
  const cleaned = value.replace(/[\s,₪]/g, '')
  if (!cleaned) return 'empty'
  if (!/^\d+(\.\d{0,2})?$/.test(cleaned)) return null
  const amount = Number(cleaned)
  return amount > MAX_AMOUNT ? null : amount
}

export function exemptDealerErrors(input: ExemptDealerInput): ExemptDealerErrors {
  const errors: ExemptDealerErrors = {}
  if (parseShekels(input.turnover) === null) errors.turnover = 'הקלידו סכום בספרות, למשל 85000.'
  if (parseShekels(input.monthly) === null) errors.monthly = 'הקלידו סכום בספרות, או השאירו ריק.'
  return errors
}

export function projectYear(turnover: number, month: number, monthly: number) {
  const projection: Projection[] = []
  let cumulative = turnover
  let crossingMonth: number | null = turnover > THRESHOLD ? month : null
  for (let next = month + 1; next <= MONTHS_IN_YEAR; next += 1) {
    cumulative += monthly
    projection.push({ month: next, cumulative })
    if (crossingMonth === null && cumulative > THRESHOLD) crossingMonth = next
  }
  return { projection, crossingMonth, yearEnd: cumulative }
}

export function computeExemptDealer(turnover: number, month: number, monthlyOverride: number | null): ExemptDealerResult {
  const monthly = monthlyOverride ?? turnover / month
  const remaining = THRESHOLD - turnover
  const monthsLeft = MONTHS_IN_YEAR - month
  const { projection, crossingMonth, yearEnd } = projectYear(turnover, month, monthly)
  return {
    kind: 'result',
    turnover,
    month,
    monthly,
    remaining,
    crossed: turnover > THRESHOLD,
    allowedPerMonth: remaining > 0 && monthsLeft > 0 ? remaining / monthsLeft : null,
    crossingMonth,
    yearEnd,
    projection,
  }
}

export function calculateExemptDealer(input: ExemptDealerInput): ExemptDealerOutcome {
  const errors = exemptDealerErrors(input)
  if (errors.turnover || errors.monthly) {
    return { kind: 'invalid', message: 'כדי לראות את התוצאה, תקנו את השדה שמתחתיו הודעת שגיאה.' }
  }
  const turnover = parseShekels(input.turnover)
  const missing = [turnover === 'empty' ? 'המחזור מתחילת השנה' : '', input.month ? '' : 'עד איזה חודש'].filter(Boolean)
  if (missing.length || typeof turnover !== 'number') {
    return { kind: 'incomplete', message: `כדי לראות את התוצאה, מלאו: ${missing.join(', ')}.` }
  }
  const monthly = parseShekels(input.monthly)
  return computeExemptDealer(turnover, Number(input.month), typeof monthly === 'number' ? monthly : null)
}

const shekelFormat = new Intl.NumberFormat('he-IL', { maximumFractionDigits: 0 })

export const formatShekels = (amount: number) => `${shekelFormat.format(Math.round(amount))} ₪`

export const monthName = (month: number) => monthNames[month - 1]

export type ThresholdRow = { month: number; cumulative: number; average: number }

export const paceTable = (): ThresholdRow[] =>
  [3, 6, 9, 12].map((month) => ({ month, cumulative: (THRESHOLD * month) / MONTHS_IN_YEAR, average: THRESHOLD / MONTHS_IN_YEAR }))

export function resultToText(result: ExemptDealerResult) {
  const lines = [
    `בדיקת תקרת עוסק פטור ${THRESHOLD_YEAR}: ${formatShekels(THRESHOLD)}`,
    `מחזור מינואר עד ${monthName(result.month)}: ${formatShekels(result.turnover)}`,
  ]
  if (result.crossed) lines.push(`המחזור עבר את התקרה ב-${formatShekels(-result.remaining)}`)
  else lines.push(`נשאר עד התקרה: ${formatShekels(result.remaining)}`)
  if (!result.crossed && result.crossingMonth) {
    lines.push(`בקצב של ${formatShekels(result.monthly)} בחודש, התקרה תיחצה ב${monthName(result.crossingMonth)}`)
  }
  if (!result.crossed && !result.crossingMonth) lines.push(`תחזית לסוף השנה: ${formatShekels(result.yearEnd)}`)
  lines.push('לפי סעיף 1 לחוק מס ערך מוסף ודף הסכומים של רשות המסים (עודכן 1.7.2026).')
  lines.push('https://www.aiterra.co.il/tools/exempt-dealer-threshold')
  return lines.join('\n')
}
