import { parseHundredths } from './vat-calculator'

export type SplitMode = 'equal' | 'items'
export type RoundingMode = 'exact' | 'shekel' | 'five'

export type SplitInput = {
  mode: SplitMode
  total: string
  tip: string
  people: string
  rounding: RoundingMode
  orders: string[]
  shared: string
}

export type PersonShare = { index: number; food: number; tip: number; pay: number }

export type SplitResult = {
  kind: 'result'
  bill: number
  tip: number
  tipBasisPoints: number
  grand: number
  collected: number
  roundingExtra: number
  shares: PersonShare[]
}

export type SplitOutcome = SplitResult | { kind: 'incomplete' } | { kind: 'impossible'; message: string }

export const MAX_PEOPLE = 12
export const MAX_AMOUNT_AGOROT = 100_000_000
export const MAX_TIP_BASIS_POINTS = 10_000
export const TIP_PRESETS = ['0', '10', '12', '15']
const FULL = 10_000

export const defaultSplitInput: SplitInput = {
  mode: 'equal',
  total: '480',
  tip: '12',
  people: '4',
  rounding: 'shekel',
  orders: ['', '', '', ''],
  shared: '',
}

const roundingStep: Record<RoundingMode, number> = { exact: 1, shekel: 100, five: 500 }

export type ParsedAgorot = { ok: true; value: number } | { ok: false; empty: boolean }

export function parseMoney(input: string): ParsedAgorot {
  const parsed = parseHundredths(input)
  if (!parsed.ok) return { ok: false, empty: parsed.reason === 'empty' }
  if (parsed.hundredths > MAX_AMOUNT_AGOROT) return { ok: false, empty: false }
  return { ok: true, value: parsed.hundredths }
}

export function parseTip(input: string): ParsedAgorot {
  const parsed = parseHundredths(input)
  if (!parsed.ok) return { ok: false, empty: parsed.reason === 'empty' }
  if (parsed.hundredths > MAX_TIP_BASIS_POINTS) return { ok: false, empty: false }
  return { ok: true, value: parsed.hundredths }
}

export function parsePeople(input: string): number | null {
  const trimmed = input.trim()
  if (!/^\d{1,3}$/.test(trimmed)) return null
  const count = Number(trimmed)
  return count >= 1 && count <= MAX_PEOPLE ? count : null
}

export function ceilToStep(numerator: number, denominator: number, step: number) {
  return Math.ceil(numerator / (denominator * step)) * step
}

export function resizeOrders(orders: string[], people: number) {
  return Array.from({ length: people }, (_, index) => orders[index] ?? '')
}

function finish(bill: number, tipBasisPoints: number, shares: PersonShare[]): SplitResult {
  const grand = Math.round((bill * (FULL + tipBasisPoints)) / FULL)
  const collected = shares.reduce((sum, share) => sum + share.pay, 0)
  return {
    kind: 'result',
    bill,
    tip: grand - bill,
    tipBasisPoints,
    grand,
    collected,
    roundingExtra: Math.max(collected - grand, 0),
    shares,
  }
}

function equalSplit(bill: number, tipBasisPoints: number, people: number, rounding: RoundingMode) {
  const pay = ceilToStep(bill * (FULL + tipBasisPoints), people * FULL, roundingStep[rounding])
  const food = Math.round(bill / people)
  const shares = Array.from({ length: people }, (_, index) => ({ index, food, tip: pay - food, pay }))
  return finish(bill, tipBasisPoints, shares)
}

function itemsSplit(orders: number[], shared: number, tipBasisPoints: number, rounding: RoundingMode) {
  const people = orders.length
  const bill = orders.reduce((sum, amount) => sum + amount, 0) + shared
  const shares = orders.map((amount, index) => {
    const scaled = amount * people + shared
    const food = Math.round(scaled / people)
    const pay = ceilToStep(scaled * (FULL + tipBasisPoints), people * FULL, roundingStep[rounding])
    return { index, food, tip: pay - food, pay }
  })
  return finish(bill, tipBasisPoints, shares)
}

export function calculateSplit(input: SplitInput): SplitOutcome {
  const tipParsed = parseTip(input.tip)
  const people = parsePeople(input.people)
  if (!tipParsed.ok || people === null) return { kind: 'incomplete' }
  if (input.mode === 'equal') {
    const total = parseMoney(input.total)
    if (!total.ok) return { kind: 'incomplete' }
    if (total.value <= 0) return { kind: 'impossible', message: 'סכום החשבון צריך להיות גדול מאפס.' }
    return equalSplit(total.value, tipParsed.value, people, input.rounding)
  }
  const orders = resizeOrders(input.orders, people).map((value) => (value.trim() ? parseMoney(value) : null))
  const sharedParsed = input.shared.trim() ? parseMoney(input.shared) : null
  if (orders.some((order) => order && !order.ok) || (sharedParsed && !sharedParsed.ok)) return { kind: 'incomplete' }
  const amounts = orders.map((order) => (order && order.ok ? order.value : 0))
  const shared = sharedParsed && sharedParsed.ok ? sharedParsed.value : 0
  if (amounts.reduce((sum, amount) => sum + amount, 0) + shared <= 0) {
    return { kind: 'impossible', message: 'הקלידו מה כל סועד הזמין כדי לחלק את החשבון.' }
  }
  return itemsSplit(amounts, shared, tipParsed.value, input.rounding)
}

const shekelFormat = new Intl.NumberFormat('he-IL', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
const percentFormat = new Intl.NumberFormat('he-IL', { maximumFractionDigits: 2 })

export const formatShekels = (agorot: number) => `${shekelFormat.format(agorot / 100)} ₪`
export const formatTipPercent = (basisPoints: number) => `${percentFormat.format(basisPoints / 100)}%`

export function splitToText(result: SplitResult) {
  const lines = [
    `חשבון: ${formatShekels(result.bill)}`,
    `טיפ ${formatTipPercent(result.tipBasisPoints)}: ${formatShekels(result.tip)}`,
    `סה״כ: ${formatShekels(result.grand)}`,
    ...result.shares.map((share) => `סועד ${share.index + 1}: ${formatShekels(share.pay)}`),
  ]
  if (result.roundingExtra > 0) lines.push(`עודף עיגול שהולך לטיפ: ${formatShekels(result.roundingExtra)}`)
  return lines.join('\n')
}
