import { STANDARD_VAT_RATE, breakdown, formatShekels, parseAmount, type ParsedNumber } from './vat-calculator'

export type AmountBasis = 'net' | 'gross'
export type BuyerChoice = 'claims' | 'none'
export type SupplyChoice = 'taxable' | 'zero'

export type ThresholdPeriod = {
  id: string
  from: string
  to: string | null
  thresholdShekels: number
  grace: boolean
  basis: string
  note: string
}

export type CheckInput = {
  date: string
  amount: string
  basis: AmountBasis
  buyer: BuyerChoice
  supply: SupplyChoice
}

export type Verdict = {
  required: boolean
  headline: string
  reason: string
}

export type CheckResult = {
  dateValid: boolean
  beforeStart: boolean
  period: ThresholdPeriod | null
  vatBasisPoints: number
  parsedAmount: ParsedNumber
  netAgorot: number | null
  verdict: Verdict | null
  prompt: string
}

export const REQUIREMENT_START = '2024-01-01'
export const ALLOCATION_DIGITS = 9

const PREVIOUS_VAT_BASIS_POINTS = 1700
const STANDARD_VAT_BASIS_POINTS = STANDARD_VAT_RATE * 100
const STANDARD_RATE_START = '2025-01-01'

export const thresholdPeriods: ThresholdPeriod[] = [
  {
    id: '2024-grace',
    from: '2024-01-01',
    to: '2024-05-04',
    thresholdShekels: 25_000,
    grace: true,
    basis: 'סעיף 38(א1) לחוק מס ערך מוסף, בנוסח לשנת 2024, והארכה של רשות המסים',
    note: 'בחוק הסף היה 25,000 ₪, אבל רשות המסים נתנה ארכה, ועד 5 במאי 2024 אפשר היה לנכות מע״מ גם בלי מספר',
  },
  {
    id: '2024',
    from: '2024-05-05',
    to: '2024-12-31',
    thresholdShekels: 25_000,
    grace: false,
    basis: 'סעיף 38(א1) לחוק מס ערך מוסף, בנוסח לשנת 2024',
    note: 'מכאן החובה חלה בפועל',
  },
  {
    id: '2025',
    from: '2025-01-01',
    to: '2025-12-31',
    thresholdShekels: 20_000,
    grace: false,
    basis: 'סעיף 38(א1) לחוק מס ערך מוסף, בנוסח הוראת השעה לשנת 2025',
    note: 'מ-2025 רשות המסים יכולה גם לסרב לתת מספר',
  },
  {
    id: '2026-a',
    from: '2026-01-01',
    to: '2026-05-31',
    thresholdShekels: 10_000,
    grace: false,
    basis: 'סעיף 38(א1) לחוק מס ערך מוסף, בנוסח הוראת השעה לינואר עד מאי 2026',
    note: 'המדרגה הוקדמה בתיקון של מרץ 2025',
  },
  {
    id: '2026-b',
    from: '2026-06-01',
    to: null,
    thresholdShekels: 5_000,
    grace: false,
    basis: 'סעיף 38(א1) לחוק מס ערך מוסף',
    note: 'הסף הקבוע בחוק, בלי תאריך סיום. לא נקבעה מדרגה נוספת',
  },
]

export const currentPeriod = thresholdPeriods[thresholdPeriods.length - 1]

const monthNames = [
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

const isoPattern = /^(\d{4})-(\d{2})-(\d{2})$/

export function isValidIsoDate(value: string): boolean {
  const match = isoPattern.exec(value)
  if (!match) return false
  const [year, month, day] = match.slice(1).map(Number)
  if (year < 1900 || year > 2200) return false
  const date = new Date(Date.UTC(year, month - 1, day))
  return date.getUTCFullYear() === year && date.getUTCMonth() === month - 1 && date.getUTCDate() === day
}

export function formatIsoDate(value: string): string {
  const match = isoPattern.exec(value)
  if (!match) return value
  const [year, month, day] = match.slice(1).map(Number)
  return `${day} ב${monthNames[month - 1]} ${year}`
}

const wholeShekelFormat = new Intl.NumberFormat('he-IL', { maximumFractionDigits: 0 })

export const formatThreshold = (shekels: number) => `${wholeShekelFormat.format(shekels)} ₪`

export function periodLabel(period: ThresholdPeriod): string {
  if (!period.to) return `מ-${formatIsoDate(period.from)}`
  return `${formatIsoDate(period.from)} עד ${formatIsoDate(period.to)}`
}

export const beforeStartLabel = () => `עד ${formatIsoDate('2023-12-31')}`

export function periodOn(date: string): ThresholdPeriod | null {
  return thresholdPeriods.find((period) => date >= period.from && (!period.to || date <= period.to)) ?? null
}

export const vatBasisPointsOn = (date: string) =>
  date < STANDARD_RATE_START ? PREVIOUS_VAT_BASIS_POINTS : STANDARD_VAT_BASIS_POINTS

export const formatVatRate = (basisPoints: number) => `${basisPoints / 100}%`

export function amountError(parsed: ParsedNumber): string {
  if (parsed.ok || parsed.reason === 'empty') return ''
  if (parsed.reason === 'too-large') return 'הסכום גדול מדי לבדיקה.'
  return 'אפשר להקליד רק ספרות, ונקודה או פסיק לאגורות.'
}

const amountPrompt = (parsed: ParsedNumber) =>
  amountError(parsed) ? 'תקנו את הסכום כדי לקבל תשובה.' : 'הקלידו את סכום החשבונית כדי לקבל תשובה.'

function verdictFor(period: ThresholdPeriod, netAgorot: number): Verdict {
  const threshold = formatThreshold(period.thresholdShekels)
  const net = formatShekels(netAgorot)
  const thresholdAgorot = period.thresholdShekels * 100

  if (netAgorot <= thresholdAgorot) {
    const exact =
      netAgorot === thresholdAgorot
        ? ` החוק מחייב מספר רק כשהסכום עולה על הסף, ולכן ${threshold} בדיוק לא מחייבים מספר.`
        : ''
    return {
      required: false,
      headline: 'לא צריך מספר הקצאה',
      reason: `הסכום לפני מע״מ, ${net}, לא עולה על הסף של ${threshold} שחל בתאריך הזה.${exact}`,
    }
  }

  if (period.grace) {
    return {
      required: false,
      headline: 'לא היה צריך בפועל',
      reason: `הסכום לפני מע״מ, ${net}, עולה על הסף של ${threshold}, אבל רשות המסים נתנה ארכה עד 5 במאי 2024, ועד אז אפשר היה לנכות מע״מ גם מחשבונית בלי מספר הקצאה.`,
    }
  }

  return {
    required: true,
    headline: 'צריך מספר הקצאה',
    reason: `הסכום לפני מע״מ, ${net}, עולה על הסף של ${threshold} שחל בתאריך הזה. כדי שהלקוח יוכל לנכות את המע״מ מהחשבונית, היא צריכה לכלול מספר הקצאה מרשות המסים.`,
  }
}

export function checkAllocation(input: CheckInput): CheckResult {
  const dateValid = isValidIsoDate(input.date)
  const vatBasisPoints = vatBasisPointsOn(dateValid ? input.date : STANDARD_RATE_START)
  const parsedAmount = parseAmount(input.amount)
  const base = {
    dateValid,
    beforeStart: false,
    period: null,
    vatBasisPoints,
    parsedAmount,
    netAgorot: null,
    verdict: null,
    prompt: '',
  }

  if (!dateValid) return { ...base, prompt: 'בחרו את תאריך החשבונית כדי לקבל תשובה.' }

  const period = periodOn(input.date)
  const supplyRate = input.supply === 'zero' ? 0 : vatBasisPoints
  const netAgorot = parsedAmount.ok
    ? input.basis === 'net'
      ? parsedAmount.hundredths
      : breakdown(parsedAmount.hundredths, 'extract', supplyRate).net
    : null
  const withAmount = { ...base, period, netAgorot }

  if (!period) {
    return {
      ...withAmount,
      beforeStart: true,
      verdict: {
        required: false,
        headline: 'לא צריך מספר הקצאה',
        reason: `החובה לבקש מספר הקצאה התחילה ב-${formatIsoDate(REQUIREMENT_START)}. לחשבונית מתאריך מוקדם יותר לא היה צריך מספר.`,
      },
    }
  }

  if (input.supply === 'zero') {
    return {
      ...withAmount,
      verdict: {
        required: false,
        headline: 'לא צריך מספר הקצאה',
        reason:
          'חשבונית מס בשיעור אפס, או חשבונית שיש בה רק עסקאות פטורות, לא צריכה מספר הקצאה, ורשות המסים גם לא נותנת לה מספר.',
      },
    }
  }

  if (input.buyer === 'none') {
    return {
      ...withAmount,
      verdict: {
        required: false,
        headline: 'לא צריך מספר הקצאה',
        reason:
          'הלקוח לא מנכה מע״מ, ולכן מספר הקצאה לא משנה לו. החובה חלה כשהלקוח הוא עוסק מורשה שדורש את המספר כדי לנכות את מס התשומות.',
      },
    }
  }

  if (netAgorot === null) return { ...withAmount, prompt: amountPrompt(parsedAmount) }

  return { ...withAmount, verdict: verdictFor(period, netAgorot) }
}

export function resultToText(input: CheckInput, result: CheckResult): string {
  if (!result.verdict) return ''
  const lines = [
    'בדיקת מספר הקצאה לחשבונית',
    `תאריך החשבונית: ${formatIsoDate(input.date)}`,
  ]
  if (result.netAgorot !== null) lines.push(`סכום לפני מע״מ: ${formatShekels(result.netAgorot)}`)
  if (result.period) {
    lines.push(`הסף בתאריך הזה: מעל ${formatThreshold(result.period.thresholdShekels)} לפני מע״מ`)
  }
  lines.push(`התשובה: ${result.verdict.headline}`, result.verdict.reason)
  if (result.period) lines.push(`לפי: ${result.period.basis}`)
  lines.push('מידע כללי ולא ייעוץ מס.')
  return lines.join('\n')
}
