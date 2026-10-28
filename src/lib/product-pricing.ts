import { STANDARD_VAT_RATE, formatPercent, formatShekels, parseAgorot } from './profit-margin'

export { STANDARD_VAT_RATE, formatPercent, formatShekels, parseAgorot }

const FULL = 10_000
const VAT_BASIS_POINTS = STANDARD_VAT_RATE * 100

export type ProductPricingInput = {
  unitCost: string
  shipping: string
  packaging: string
  importFees: string
  paymentFee: string
  platformFee: string
  cpa: string
  returns: string
  targetMargin: string
  withVat: boolean
}

export const defaultProductPricingInput: ProductPricingInput = {
  unitCost: '35',
  shipping: '18',
  packaging: '3',
  importFees: '6',
  paymentFee: '2.5',
  platformFee: '0',
  cpa: '25',
  returns: '8',
  targetMargin: '20',
  withVat: true,
}

export type PricePoint = {
  net: number
  gross: number
  fees: number
  profit: number
  marginBasisPoints: number
  breakEvenRoas: number | null
}

export type ProductPricingResult = PricePoint & {
  kind: 'result'
  landed: number
  returnsLoss: number
  cpa: number
  vat: number
  withVat: boolean
  sensitivity: { change: number; point: PricePoint }[]
}

export type ProductPricingOutcome =
  | ProductPricingResult
  | { kind: 'incomplete' }
  | { kind: 'impossible'; message: string }

type Costs = {
  landed: number
  returnsLoss: number
  cpa: number
  feeBasisPoints: number
  grossFactor: number
}

const amountKeys = ['unitCost', 'shipping', 'packaging', 'importFees', 'cpa'] as const
const percentKeys = ['paymentFee', 'platformFee', 'returns', 'targetMargin'] as const

function readValues(input: ProductPricingInput) {
  const values: Record<string, number> = {}
  for (const key of [...amountKeys, ...percentKeys]) {
    const parsed = parseAgorot(input[key])
    if (parsed.ok) values[key] = parsed.value
    else if (parsed.empty && key !== 'unitCost') values[key] = 0
    else return null
  }
  return values
}

export function returnsLossPerSale(handling: number, returnsBasisPoints: number) {
  if (returnsBasisPoints >= FULL) return null
  return Math.round((handling * returnsBasisPoints) / (FULL - returnsBasisPoints))
}

export function pricePoint(net: number, costs: Costs): PricePoint {
  const gross = Math.round((net * costs.grossFactor) / FULL)
  const fees = Math.round((gross * costs.feeBasisPoints) / FULL)
  const beforeAds = net - fees - costs.landed - costs.returnsLoss
  const profit = beforeAds - costs.cpa
  return {
    net,
    gross,
    fees,
    profit,
    marginBasisPoints: net > 0 ? Math.round((profit * FULL) / net) : 0,
    breakEvenRoas: beforeAds > 0 ? gross / beforeAds : null,
  }
}

export function calculateProductPricing(input: ProductPricingInput): ProductPricingOutcome {
  const values = readValues(input)
  if (!values || values.unitCost === undefined) return { kind: 'incomplete' }
  if (values.returns >= FULL) return { kind: 'impossible', message: 'אחוז החזרות חייב להיות קטן מ-100%.' }

  const grossFactor = input.withVat ? FULL + VAT_BASIS_POINTS : FULL
  const feeBasisPoints = values.paymentFee + values.platformFee
  const landed = values.unitCost + values.shipping + values.packaging + values.importFees
  const returnsLoss = returnsLossPerSale(values.shipping + values.packaging, values.returns) ?? 0
  const costs: Costs = { landed, returnsLoss, cpa: values.cpa, feeBasisPoints, grossFactor }

  const feeShareOfNet = Math.round((feeBasisPoints * grossFactor) / FULL)
  const denominator = FULL - values.targetMargin - feeShareOfNet
  if (denominator <= 0) {
    return {
      kind: 'impossible',
      message: 'העמלות והמרווח הרצוי יחד מגיעים ל-100% מהמחיר או יותר. הורידו את המרווח הרצוי.',
    }
  }

  const net = Math.round(((landed + returnsLoss + values.cpa) * FULL) / denominator)
  const point = pricePoint(net, costs)
  return {
    kind: 'result',
    ...point,
    landed,
    returnsLoss,
    cpa: values.cpa,
    vat: point.gross - point.net,
    withVat: input.withVat,
    sensitivity: [-10, 0, 10].map((change) => ({
      change,
      point: pricePoint(Math.round((net * (100 + change)) / 100), costs),
    })),
  }
}

const roasFormat = new Intl.NumberFormat('he-IL', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

export const formatRoas = (roas: number | null) => (roas === null ? 'אין רווח לפני פרסום' : roasFormat.format(roas))

export function productPricingToText(result: ProductPricingResult) {
  const priceLabel = result.withVat ? 'מחיר מומלץ כולל מע״מ' : 'מחיר מומלץ'
  return [
    `${priceLabel}: ${formatShekels(result.gross)}`,
    `מחיר לפני מע״מ: ${formatShekels(result.net)}`,
    `עלות נחיתה ליחידה: ${formatShekels(result.landed)}`,
    `עמלות סליקה ופלטפורמה: ${formatShekels(result.fees)}`,
    `עלות החזרות למכירה: ${formatShekels(result.returnsLoss)}`,
    `עלות פרסום למכירה: ${formatShekels(result.cpa)}`,
    `רווח ליחידה: ${formatShekels(result.profit)} (${formatPercent(result.marginBasisPoints)})`,
    `ROAS לאיזון: ${formatRoas(result.breakEvenRoas)}`,
  ].join('\n')
}
