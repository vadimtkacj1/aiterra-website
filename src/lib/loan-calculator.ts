import { formatShekels, parseAmount, parseHundredths, parseRate } from './vat-calculator'

export type RepaymentMethod = 'spitzer' | 'equal-principal' | 'balloon' | 'grace'
export type TermUnit = 'years' | 'months'
export type LoanField = 'amount' | 'rate' | 'term' | 'graceMonths' | 'oneTimeFee' | 'monthlyFee'

export type LoanInput = {
  amount: string
  rate: string
  term: string
  termUnit: TermUnit
  method: RepaymentMethod
  graceMonths: string
  oneTimeFee: string
  monthlyFee: string
}

export type ScheduleRow = {
  month: number
  payment: number
  interest: number
  principal: number
  balance: number
}

export type LoanResult = {
  principal: number
  rateBasisPoints: number
  months: number
  method: RepaymentMethod
  graceMonths: number
  rows: ScheduleRow[]
  firstPayment: number
  regularPayment: number
  lastPayment: number
  totalInterest: number
  totalPayments: number
  oneTimeFee: number
  monthlyFee: number
  totalFees: number
  totalCost: number
  totalPaid: number
  effectiveAnnualRate: number | null
}

export type LoanEvaluation = {
  errors: Partial<Record<LoanField, string>>
  missing: boolean
  result: LoanResult | null
}

export type PaymentFigure = { label: string; value: number }

export type Comparison = {
  cheaper: 'a' | 'b' | null
  basis: 'cost' | 'rate'
  difference: number
  lowerPaymentIsPricier: boolean
}

export const MAX_MONTHS = 360
export const MAX_RATE_PERCENT = 30
export const MIN_AMOUNT_SHEKELS = 1_000
export const MIN_PRINCIPAL_PER_MONTH_SHEKELS = 10

const MONTHS_PER_YEAR = 12
const MONTHLY_RATE_DIVISOR = 120_000
const IRR_ITERATIONS = 200

export const methodOptions: { value: RepaymentMethod; label: string; hint: string }[] = [
  { value: 'spitzer', label: 'שפיצר', hint: 'תשלום חודשי קבוע' },
  { value: 'equal-principal', label: 'קרן שווה', hint: 'התשלום יורד מחודש לחודש' },
  { value: 'balloon', label: 'בלון', hint: 'ריבית בלבד, הקרן בסוף' },
  { value: 'grace', label: 'גרייס', hint: 'ריבית בלבד בהתחלה, אחר כך שפיצר' },
]

export const methodLabel = (method: RepaymentMethod) =>
  methodOptions.find((option) => option.value === method)?.label ?? ''

export const defaultLoanInput: LoanInput = {
  amount: '100,000',
  rate: '6',
  term: '5',
  termUnit: 'years',
  method: 'spitzer',
  graceMonths: '6',
  oneTimeFee: '',
  monthlyFee: '',
}

const shekelsText = (shekels: number) => shekels.toLocaleString('he-IL')

type TermParse = { ok: true; months: number } | { ok: false; error: string; missing?: boolean }

function parseTerm(raw: string, unit: TermUnit): TermParse {
  const parsed = parseHundredths(raw)
  if (!parsed.ok) {
    if (parsed.reason === 'empty') return { ok: false, error: '', missing: true }
    return { ok: false, error: 'אפשר להקליד רק ספרות.' }
  }
  if (unit === 'months') {
    if (parsed.hundredths % 100 !== 0) return { ok: false, error: 'הקלידו מספר שלם של חודשים.' }
    const months = parsed.hundredths / 100
    return inRange(months)
  }
  if ((parsed.hundredths * MONTHS_PER_YEAR) % 100 !== 0) {
    return { ok: false, error: 'מספר השנים צריך להתחלק לחודשים שלמים, למשל 2.5. אפשר גם לעבור לחודשים.' }
  }
  return inRange((parsed.hundredths * MONTHS_PER_YEAR) / 100)
}

function inRange(months: number): TermParse {
  if (months < 1 || months > MAX_MONTHS) {
    return { ok: false, error: `התקופה צריכה להיות בין חודש אחד ל-30 שנה (${MAX_MONTHS} חודשים).` }
  }
  return { ok: true, months }
}

export function convertTerm(raw: string, from: TermUnit, to: TermUnit): string {
  if (from === to) return raw
  const parsed = parseHundredths(raw)
  if (!parsed.ok) return raw
  if (to === 'months') {
    const months = (parsed.hundredths * MONTHS_PER_YEAR) / 100
    return Number.isInteger(months) ? String(months) : raw
  }
  if (parsed.hundredths % MONTHS_PER_YEAR !== 0) return raw
  return String(parsed.hundredths / MONTHS_PER_YEAR / 100)
}

function parseFee(raw: string): { ok: true; agorot: number } | { ok: false; error: string } {
  const parsed = parseAmount(raw)
  if (parsed.ok) return { ok: true, agorot: parsed.hundredths }
  if (parsed.reason === 'empty') return { ok: true, agorot: 0 }
  if (parsed.reason === 'too-large') return { ok: false, error: 'העמלה גדולה מדי.' }
  return { ok: false, error: 'אפשר להקליד רק ספרות, ונקודה או פסיק לאגורות.' }
}

export const monthlyInterest = (balance: number, rateBasisPoints: number) =>
  Math.round((balance * rateBasisPoints) / MONTHLY_RATE_DIVISOR)

export function annuityPayment(principal: number, rateBasisPoints: number, months: number): number {
  if (rateBasisPoints === 0) return Math.floor(principal / months)
  const rate = rateBasisPoints / MONTHLY_RATE_DIVISOR
  return Math.round((principal * rate) / (1 - Math.pow(1 + rate, -months)))
}

function amortize(principal: number, rateBasisPoints: number, months: number, startMonth: number): ScheduleRow[] {
  const payment = annuityPayment(principal, rateBasisPoints, months)
  const rows: ScheduleRow[] = []
  let balance = principal
  for (let index = 0; index < months; index += 1) {
    const interest = monthlyInterest(balance, rateBasisPoints)
    const isLast = index === months - 1
    const principalPart = isLast ? balance : Math.min(Math.max(payment - interest, 0), balance)
    balance -= principalPart
    rows.push({ month: startMonth + index, payment: interest + principalPart, interest, principal: principalPart, balance })
  }
  return rows
}

function equalPrincipal(principal: number, rateBasisPoints: number, months: number): ScheduleRow[] {
  const share = Math.floor(principal / months)
  const rows: ScheduleRow[] = []
  let balance = principal
  for (let index = 0; index < months; index += 1) {
    const interest = monthlyInterest(balance, rateBasisPoints)
    const principalPart = index === months - 1 ? balance : share
    balance -= principalPart
    rows.push({ month: index + 1, payment: interest + principalPart, interest, principal: principalPart, balance })
  }
  return rows
}

function interestOnly(principal: number, rateBasisPoints: number, months: number): ScheduleRow[] {
  const interest = monthlyInterest(principal, rateBasisPoints)
  return Array.from({ length: months }, (_, index) => ({
    month: index + 1,
    payment: interest,
    interest,
    principal: 0,
    balance: principal,
  }))
}

export function buildSchedule(
  principal: number,
  rateBasisPoints: number,
  months: number,
  method: RepaymentMethod,
  graceMonths = 0,
): ScheduleRow[] {
  if (method === 'spitzer') return amortize(principal, rateBasisPoints, months, 1)
  if (method === 'equal-principal') return equalPrincipal(principal, rateBasisPoints, months)
  if (method === 'balloon') {
    const rows = interestOnly(principal, rateBasisPoints, months)
    const last = rows[months - 1]
    rows[months - 1] = { ...last, payment: last.interest + principal, principal, balance: 0 }
    return rows
  }
  return [
    ...interestOnly(principal, rateBasisPoints, graceMonths),
    ...amortize(principal, rateBasisPoints, months - graceMonths, graceMonths + 1),
  ]
}

export function monthlyIrr(netReceived: number, outflows: number[]): number | null {
  if (netReceived <= 0) return null
  const presentValue = (rate: number) => {
    let total = 0
    let discount = 1
    for (const outflow of outflows) {
      discount /= 1 + rate
      total += outflow * discount
    }
    return total - netReceived
  }
  if (presentValue(0) <= 0) return 0
  let low = 0
  let high = 1
  if (presentValue(high) > 0) return null
  for (let step = 0; step < IRR_ITERATIONS; step += 1) {
    const middle = (low + high) / 2
    if (presentValue(middle) > 0) low = middle
    else high = middle
  }
  return (low + high) / 2
}

export const annualFromMonthly = (monthlyRate: number) => Math.pow(1 + monthlyRate, MONTHS_PER_YEAR) - 1

export function summarize(
  principal: number,
  rateBasisPoints: number,
  months: number,
  method: RepaymentMethod,
  graceMonths: number,
  oneTimeFee: number,
  monthlyFee: number,
): LoanResult {
  const rows = buildSchedule(principal, rateBasisPoints, months, method, graceMonths)
  const totalInterest = rows.reduce((sum, row) => sum + row.interest, 0)
  const totalPayments = rows.reduce((sum, row) => sum + row.payment, 0)
  const totalFees = oneTimeFee + monthlyFee * months
  const irr = monthlyIrr(
    principal - oneTimeFee,
    rows.map((row) => row.payment + monthlyFee),
  )
  const regularIndex = method === 'grace' ? graceMonths : 0
  return {
    principal,
    rateBasisPoints,
    months,
    method,
    graceMonths: method === 'grace' ? graceMonths : 0,
    rows,
    firstPayment: rows[0].payment,
    regularPayment: rows[regularIndex].payment,
    lastPayment: rows[rows.length - 1].payment,
    totalInterest,
    totalPayments,
    oneTimeFee,
    monthlyFee,
    totalFees,
    totalCost: totalInterest + totalFees,
    totalPaid: totalPayments + totalFees,
    effectiveAnnualRate: irr === null ? null : annualFromMonthly(irr),
  }
}

export function evaluateLoan(input: LoanInput): LoanEvaluation {
  const errors: LoanEvaluation['errors'] = {}
  let missing = false

  const amount = parseAmount(input.amount)
  if (!amount.ok) {
    if (amount.reason === 'empty') missing = true
    else if (amount.reason === 'too-large') errors.amount = 'הסכום גדול מדי. אפשר להקליד עד 100,000,000 ₪.'
    else errors.amount = 'אפשר להקליד רק ספרות, ונקודה או פסיק לאגורות.'
  }

  const rate = parseRate(input.rate)
  if (!rate.ok) {
    if (rate.reason === 'empty') missing = true
    else if (rate.reason === 'too-large') errors.rate = `המחשבון מחשב ריבית שנתית של עד ${MAX_RATE_PERCENT}%.`
    else errors.rate = 'אפשר להקליד רק ספרות ונקודה, למשל 6.5.'
  } else if (rate.hundredths > MAX_RATE_PERCENT * 100) {
    errors.rate = `המחשבון מחשב ריבית שנתית של עד ${MAX_RATE_PERCENT}%.`
  }

  const term = parseTerm(input.term, input.termUnit)
  if (!term.ok) {
    if (term.missing) missing = true
    else errors.term = term.error
  }

  let graceMonths = 0
  if (input.method === 'grace') {
    const grace = parseHundredths(input.graceMonths)
    if (!grace.ok) {
      if (grace.reason === 'empty') missing = true
      else errors.graceMonths = 'הקלידו מספר שלם של חודשים.'
    } else if (grace.hundredths % 100 !== 0 || grace.hundredths === 0) {
      errors.graceMonths = 'הקלידו מספר שלם של חודשים, 1 או יותר.'
    } else {
      graceMonths = grace.hundredths / 100
      if (term.ok && graceMonths >= term.months) {
        errors.graceMonths = `תקופת הגרייס צריכה להיות קצרה מתקופת ההלוואה (${term.months} חודשים).`
      }
    }
  }

  const oneTimeFee = parseFee(input.oneTimeFee)
  if (!oneTimeFee.ok) errors.oneTimeFee = oneTimeFee.error
  const monthlyFee = parseFee(input.monthlyFee)
  if (!monthlyFee.ok) errors.monthlyFee = monthlyFee.error

  if (amount.ok && term.ok && !errors.amount) {
    const minimum = Math.max(MIN_AMOUNT_SHEKELS, term.months * MIN_PRINCIPAL_PER_MONTH_SHEKELS) * 100
    if (amount.hundredths < minimum) {
      errors.amount =
        minimum === MIN_AMOUNT_SHEKELS * 100
          ? `הקלידו סכום של ${shekelsText(MIN_AMOUNT_SHEKELS)} ₪ לפחות.`
          : `לתקופה של ${term.months} חודשים הקלידו סכום של ${shekelsText(minimum / 100)} ₪ לפחות, או קצרו את התקופה.`
    }
  }

  if (amount.ok && oneTimeFee.ok && !errors.amount && oneTimeFee.agorot >= amount.hundredths) {
    errors.oneTimeFee = 'העמלה החד-פעמית צריכה להיות קטנה מסכום ההלוואה.'
  }

  const valid = !missing && Object.keys(errors).length === 0
  if (!valid || !amount.ok || !rate.ok || !term.ok || !oneTimeFee.ok || !monthlyFee.ok) {
    return { errors, missing, result: null }
  }

  return {
    errors,
    missing,
    result: summarize(
      amount.hundredths,
      rate.hundredths,
      term.months,
      input.method,
      graceMonths,
      oneTimeFee.agorot,
      monthlyFee.agorot,
    ),
  }
}

const rateFormat = new Intl.NumberFormat('he-IL', { maximumFractionDigits: 2 })
const percentFormat = new Intl.NumberFormat('he-IL', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

export const formatAnnualRate = (basisPoints: number) => `${rateFormat.format(basisPoints / 100)}%`

export const formatEffectiveRate = (rate: number | null) =>
  rate === null ? 'גבוהה מאוד' : `${percentFormat.format(rate * 100)}%`

export const formatTerm = (months: number) => {
  if (months % MONTHS_PER_YEAR !== 0) return months === 1 ? 'חודש אחד' : `${months} חודשים`
  const years = months / MONTHS_PER_YEAR
  if (years === 1) return 'שנה (12 חודשים)'
  if (years === 2) return 'שנתיים (24 חודשים)'
  return `${years} שנים (${months} חודשים)`
}

export const formatTermShort = (months: number) => {
  if (months % MONTHS_PER_YEAR !== 0) return months === 1 ? 'חודש אחד' : `${months} חודשים`
  const years = months / MONTHS_PER_YEAR
  if (years === 1) return 'שנה'
  if (years === 2) return 'שנתיים'
  return `${years} שנים`
}

export function paymentFigures(result: LoanResult): PaymentFigure[] {
  if (result.method === 'spitzer') return [{ label: 'תשלום חודשי', value: result.firstPayment }]
  if (result.method === 'grace') {
    return [
      { label: `בחודשי הגרייס (1 עד ${result.graceMonths})`, value: result.firstPayment },
      { label: `מחודש ${result.graceMonths + 1}`, value: result.regularPayment },
    ]
  }
  if (result.method === 'balloon') {
    return [
      { label: 'תשלום חודשי (ריבית בלבד)', value: result.firstPayment },
      { label: 'תשלום אחרון, כולל הקרן', value: result.lastPayment },
    ]
  }
  return [
    { label: 'תשלום ראשון', value: result.firstPayment },
    { label: 'תשלום אחרון', value: result.lastPayment },
  ]
}

export const roundingNote = (result: LoanResult) => {
  if (result.method === 'balloon') return ''
  if (result.method === 'equal-principal') {
    return 'הקרן החודשית מעוגלת כלפי מטה לאגורה, והאגורות שנשארות נוספות לתשלום האחרון.'
  }
  if (result.lastPayment === result.regularPayment) return ''
  return `התשלום האחרון הוא ${formatShekels(result.lastPayment)}, בגלל עיגול הריבית לאגורות.`
}

export function compareLoans(a: LoanResult, b: LoanResult): Comparison {
  if (a.principal !== b.principal) {
    const rateA = a.effectiveAnnualRate ?? Number.POSITIVE_INFINITY
    const rateB = b.effectiveAnnualRate ?? Number.POSITIVE_INFINITY
    const cheaper = Math.abs(rateA - rateB) < 0.00005 ? null : rateA < rateB ? 'a' : 'b'
    return { cheaper, basis: 'rate', difference: 0, lowerPaymentIsPricier: false }
  }
  const difference = Math.abs(a.totalCost - b.totalCost)
  const cheaper = difference === 0 ? null : a.totalCost < b.totalCost ? 'a' : 'b'
  const pricier = cheaper === 'a' ? b : a
  const other = cheaper === 'a' ? a : b
  return {
    cheaper,
    basis: 'cost',
    difference,
    lowerPaymentIsPricier: cheaper !== null && pricier.firstPayment < other.firstPayment,
  }
}

const describeLoan = (result: LoanResult) =>
  `${formatShekels(result.principal)}, ריבית שנתית ${formatAnnualRate(result.rateBasisPoints)}, ${formatTerm(result.months)}, ${methodLabel(result.method)}${result.method === 'grace' ? ` עם ${result.graceMonths} חודשי גרייס` : ''}`

export function resultLines(result: LoanResult): string[] {
  const lines = [`הלוואה: ${describeLoan(result)}`]
  for (const figure of paymentFigures(result)) lines.push(`${figure.label}: ${formatShekels(figure.value)}`)
  lines.push(`סך הריבית: ${formatShekels(result.totalInterest)}`)
  if (result.totalFees > 0) lines.push(`עמלות: ${formatShekels(result.totalFees)}`)
  lines.push(`סך כל התשלומים: ${formatShekels(result.totalPaid)}`)
  lines.push(`עלות שנתית אפקטיבית (הערכה): ${formatEffectiveRate(result.effectiveAnnualRate)}`)
  return lines
}

export const DISCLAIMER = 'חישוב לעזר בלבד. זו לא הצעת אשראי ולא ייעוץ פיננסי.'

export function summaryText(a: LoanResult, b: LoanResult | null): string {
  if (!b) return [...resultLines(a), '', DISCLAIMER].join('\n')
  return ['הצעה א', ...resultLines(a), '', 'הצעה ב', ...resultLines(b), '', DISCLAIMER].join('\n')
}

const plain = (agorot: number) => (agorot / 100).toFixed(2)

export const SCHEDULE_HEADERS = ['חודש', 'תשלום', 'ריבית', 'קרן', 'יתרה']

const csvCell = (value: string) => (/[",\n\r]/.test(value) ? `"${value.replace(/"/g, '""')}"` : value)

export function scheduleCsv(result: LoanResult): string {
  const body = result.rows.map((row) =>
    [String(row.month), plain(row.payment), plain(row.interest), plain(row.principal), plain(row.balance)].join(','),
  )
  const total = ['סך הכול', plain(result.totalPayments), plain(result.totalInterest), plain(result.principal), '']
  return `﻿${[SCHEDULE_HEADERS.map(csvCell).join(','), ...body, total.map(csvCell).join(',')].join('\r\n')}\r\n`
}

const escapeHtml = (value: string) =>
  value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

const amountFormat = new Intl.NumberFormat('he-IL', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

export const formatAmount = (agorot: number) => amountFormat.format(agorot / 100)

export function scheduleDocument(result: LoanResult, heading: string): string {
  const summary = resultLines(result)
    .map((line) => `<li>${escapeHtml(line)}</li>`)
    .join('')
  const head = SCHEDULE_HEADERS.map((title) => `<th scope="col">${escapeHtml(title)}</th>`).join('')
  const body = result.rows
    .map(
      (row) =>
        `<tr><th scope="row">${row.month}</th><td>${formatAmount(row.payment)}</td><td>${formatAmount(row.interest)}</td><td>${formatAmount(row.principal)}</td><td>${formatAmount(row.balance)}</td></tr>`,
    )
    .join('')
  const foot = `<tr><th scope="row">סך הכול</th><td>${formatAmount(result.totalPayments)}</td><td>${formatAmount(result.totalInterest)}</td><td>${formatAmount(result.principal)}</td><td></td></tr>`
  return `<!doctype html><html lang="he" dir="rtl"><head><meta charset="utf-8"><title>${escapeHtml(heading)}</title><style>
body{margin:24px;font-family:Arial,Helvetica,sans-serif;color:#111;font-size:12px}
h1{margin:0 0 8px;font-size:20px}ul{margin:0 0 16px;padding-inline-start:18px;line-height:1.6}
table{width:100%;border-collapse:collapse;font-variant-numeric:tabular-nums}
caption{text-align:start;font-weight:700;padding:0 0 6px}
th,td{padding:4px 8px;border-bottom:1px solid #ccc;text-align:start}
thead th{border-bottom:2px solid #333}tfoot th,tfoot td{border-top:2px solid #333;font-weight:700}
thead{display:table-header-group}tr{break-inside:avoid}p{margin:16px 0 0;color:#444}
</style></head><body><h1>${escapeHtml(heading)}</h1><ul>${summary}</ul><table><caption>הסכומים בשקלים</caption><thead><tr>${head}</tr></thead><tbody>${body}</tbody><tfoot>${foot}</tfoot></table><p>${escapeHtml(DISCLAIMER)} הסכומים מעוגלים לאגורה. aiterra.co.il/tools/loan-calculator</p></body></html>`
}
