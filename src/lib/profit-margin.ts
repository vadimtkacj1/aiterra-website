import { STANDARD_VAT_RATE, breakdown, parseHundredths } from './vat-calculator'

export type PricingMode = 'margin' | 'markup' | 'price'
export type CostBasis = 'net' | 'gross'

export type PricingInput = {
  cost: string
  costBasis: CostBasis
  mode: PricingMode
  value: string
  fixedCosts: string
}

export type PricingResult = {
  kind: 'result'
  cost: number
  price: number
  vat: number
  priceWithVat: number
  profit: number
  marginBasisPoints: number
  markupBasisPoints: number | null
  breakEvenUnits: number | null
  fixedCosts: number
}

export type PricingOutcome = PricingResult | { kind: 'incomplete' } | { kind: 'impossible'; message: string }

export { STANDARD_VAT_RATE }

const VAT_BASIS_POINTS = STANDARD_VAT_RATE * 100
const FULL = 10_000
const MAX_AGOROT = 10_000_000_000

export const defaultPricingInput: PricingInput = {
  cost: '60',
  costBasis: 'net',
  mode: 'margin',
  value: '40',
  fixedCosts: '',
}

export type Parsed = { ok: true; value: number } | { ok: false; empty: boolean }

export function parseAgorot(input: string): Parsed {
  const parsed = parseHundredths(input)
  if (!parsed.ok) return { ok: false, empty: parsed.reason === 'empty' }
  if (parsed.hundredths > MAX_AGOROT) return { ok: false, empty: false }
  return { ok: true, value: parsed.hundredths }
}

export const toNet = (agorot: number, basis: CostBasis) =>
  basis === 'net' ? agorot : breakdown(agorot, 'extract', VAT_BASIS_POINTS).net

export function priceFromMargin(cost: number, marginBasisPoints: number) {
  return Math.round((cost * FULL) / (FULL - marginBasisPoints))
}

export function priceFromMarkup(cost: number, markupBasisPoints: number) {
  return Math.round((cost * (FULL + markupBasisPoints)) / FULL)
}

export function marginOf(cost: number, price: number) {
  return price > 0 ? Math.round(((price - cost) * FULL) / price) : 0
}

export function markupOf(cost: number, price: number) {
  return cost > 0 ? Math.round(((price - cost) * FULL) / cost) : null
}

export function breakEven(fixedAgorot: number, profitAgorot: number) {
  if (fixedAgorot <= 0 || profitAgorot <= 0) return null
  return Math.ceil(fixedAgorot / profitAgorot)
}

export function calculatePricing(input: PricingInput): PricingOutcome {
  const costParsed = parseAgorot(input.cost)
  const valueParsed = parseAgorot(input.value)
  const fixedParsed = parseAgorot(input.fixedCosts)
  if (!costParsed.ok || !valueParsed.ok) return { kind: 'incomplete' }
  if (!fixedParsed.ok && !fixedParsed.empty) return { kind: 'incomplete' }

  const cost = toNet(costParsed.value, input.costBasis)
  let price: number
  if (input.mode === 'margin') {
    if (valueParsed.value >= FULL) {
      return { kind: 'impossible', message: 'מרווח רווח חייב להיות קטן מ-100%, כי הרווח הוא חלק ממחיר המכירה.' }
    }
    price = priceFromMargin(cost, valueParsed.value)
  } else if (input.mode === 'markup') {
    price = priceFromMarkup(cost, valueParsed.value)
  } else {
    price = valueParsed.value
  }
  if (price <= 0) return { kind: 'impossible', message: 'הקלידו מחיר מכירה גדול מאפס.' }

  const withVat = breakdown(price, 'add', VAT_BASIS_POINTS)
  const profit = price - cost
  const fixedCosts = fixedParsed.ok ? fixedParsed.value : 0

  return {
    kind: 'result',
    cost,
    price,
    vat: withVat.vat,
    priceWithVat: withVat.gross,
    profit,
    marginBasisPoints: marginOf(cost, price),
    markupBasisPoints: markupOf(cost, price),
    breakEvenUnits: breakEven(fixedCosts, profit),
    fixedCosts,
  }
}

export function marginTable(costAgorot: number, margins: number[]) {
  return margins.map((margin) => {
    const price = priceFromMargin(costAgorot, margin * 100)
    return {
      margin,
      markupBasisPoints: markupOf(costAgorot, price) ?? 0,
      price,
      priceWithVat: breakdown(price, 'add', VAT_BASIS_POINTS).gross,
      naivePrice: priceFromMarkup(costAgorot, margin * 100),
      naiveMarginBasisPoints: marginOf(costAgorot, priceFromMarkup(costAgorot, margin * 100)),
    }
  })
}

const shekelFormat = new Intl.NumberFormat('he-IL', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
const percentFormat = new Intl.NumberFormat('he-IL', { maximumFractionDigits: 2 })
const unitFormat = new Intl.NumberFormat('he-IL', { maximumFractionDigits: 0 })

export const formatShekels = (agorot: number) => `${shekelFormat.format(agorot / 100)} ₪`
export const formatPercent = (basisPoints: number) => `${percentFormat.format(basisPoints / 100)}%`
export const formatUnits = (units: number) => unitFormat.format(units)

export function pricingToText(result: PricingResult) {
  const lines = [
    `עלות ליחידה לפני מע״מ: ${formatShekels(result.cost)}`,
    `מחיר מכירה לפני מע״מ: ${formatShekels(result.price)}`,
    `מחיר כולל מע״מ ${STANDARD_VAT_RATE}%: ${formatShekels(result.priceWithVat)}`,
    `רווח גולמי ליחידה: ${formatShekels(result.profit)}`,
    `מרווח רווח גולמי: ${formatPercent(result.marginBasisPoints)}`,
  ]
  if (result.markupBasisPoints !== null) lines.push(`תוספת על העלות: ${formatPercent(result.markupBasisPoints)}`)
  if (result.breakEvenUnits !== null) lines.push(`נקודת איזון: ${formatUnits(result.breakEvenUnits)} יחידות`)
  return lines.join('\n')
}
