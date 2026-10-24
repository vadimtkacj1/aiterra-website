import { formatShekels } from './profit-margin'

export type UnitKind = 'g' | 'kg' | 'ml' | 'l' | 'unit'
export type DealKind = 'none' | 'free' | 'second' | 'percent' | 'bundle'
export type UnitFamily = 'mass' | 'volume' | 'count'

export type ProductInput = {
  price: string
  quantity: string
  count: string
  unit: UnitKind
  deal: DealKind
  dealA: string
  dealB: string
}

export type ProductRow = {
  index: number
  paid: number
  baseQuantity: number
  perBase: number
  per100: number | null
  perThousand: number | null
  perUnit: number | null
  overBestPercent: number
  best: boolean
}

export type CompareResult = {
  kind: 'result'
  family: UnitFamily
  rows: ProductRow[]
  compared: boolean
  bestIndex: number | null
}

export type CompareOutcome = CompareResult | { kind: 'incomplete' } | { kind: 'impossible'; message: string }

export const MAX_PRODUCTS = 5
export const MAX_AGOROT = 10_000_000

export const unitOptions: { value: UnitKind; label: string }[] = [
  { value: 'g', label: 'גרם' },
  { value: 'kg', label: 'ק״ג' },
  { value: 'ml', label: 'מ״ל' },
  { value: 'l', label: 'ליטר' },
  { value: 'unit', label: 'יחידות' },
]

export const dealOptions: { value: DealKind; label: string }[] = [
  { value: 'none', label: 'בלי מבצע' },
  { value: 'free', label: 'קנה X וקבל Y חינם' },
  { value: 'second', label: 'הפריט השני בהנחה' },
  { value: 'percent', label: 'הנחה באחוזים' },
  { value: 'bundle', label: 'X פריטים ב-Y ₪' },
]

const familyOf: Record<UnitKind, UnitFamily> = { g: 'mass', kg: 'mass', ml: 'volume', l: 'volume', unit: 'count' }
const toBase: Record<UnitKind, number> = { g: 1, kg: 1000, ml: 1, l: 1000, unit: 1 }

export const defaultProducts: ProductInput[] = [
  { price: '12.90', quantity: '750', count: '1', unit: 'g', deal: 'none', dealA: '', dealB: '' },
  { price: '9.90', quantity: '500', count: '1', unit: 'g', deal: 'none', dealA: '', dealB: '' },
]

export const blankProduct = (unit: UnitKind): ProductInput => ({
  price: '',
  quantity: '',
  count: '1',
  unit,
  deal: 'none',
  dealA: '',
  dealB: '',
})

export function parseDecimal(input: string): number | null {
  const normalized = input.trim().replace(',', '.')
  if (!/^\d{1,9}(\.\d{1,6})?$/.test(normalized)) return null
  return Number(normalized)
}

export function parsePriceAgorot(input: string): number | null {
  const value = parseDecimal(input)
  if (value === null) return null
  const agorot = Math.round(value * 100)
  return agorot <= MAX_AGOROT ? agorot : null
}

export function parseCount(input: string): number | null {
  const value = parseDecimal(input)
  return value !== null && Number.isInteger(value) && value >= 1 && value <= 999 ? value : null
}

export function dealFactors(product: ProductInput, price: number): { paid: number; items: number } | null {
  const a = parseDecimal(product.dealA)
  const b = parseDecimal(product.dealB)
  switch (product.deal) {
    case 'none':
      return { paid: price, items: 1 }
    case 'free':
      if (a === null || b === null || a < 1 || !Number.isInteger(a) || !Number.isInteger(b)) return null
      return { paid: price * a, items: a + b }
    case 'second':
      return a === null || a > 100 ? null : { paid: price * (2 - a / 100), items: 2 }
    case 'percent':
      return a === null || a > 100 ? null : { paid: price * (1 - a / 100), items: 1 }
    case 'bundle':
      if (a === null || b === null || a < 1 || !Number.isInteger(a)) return null
      return { paid: Math.round(b * 100), items: a }
  }
}

type Priced = { paid: number; baseQuantity: number }

export function priceProduct(product: ProductInput): Priced | 'empty' | 'invalid' {
  const bundle = product.deal === 'bundle'
  if ((!bundle && !product.price.trim()) || !product.quantity.trim()) return 'empty'
  const price = bundle ? 0 : parsePriceAgorot(product.price)
  const quantity = parseDecimal(product.quantity)
  const count = parseCount(product.count)
  if (price === null || quantity === null || quantity <= 0 || count === null) return 'invalid'
  if (!bundle && price <= 0) return 'invalid'
  const factors = dealFactors(product, price)
  if (!factors || factors.paid <= 0) return 'invalid'
  return { paid: factors.paid, baseQuantity: quantity * count * toBase[product.unit] * factors.items }
}

export function compareProducts(products: ProductInput[]): CompareOutcome {
  const priced = products.map((product, index) => ({ index, unit: product.unit, result: priceProduct(product) }))
  if (priced.some((item) => item.result === 'invalid')) return { kind: 'incomplete' }
  const complete = priced.flatMap((item) =>
    typeof item.result === 'object' ? [{ index: item.index, unit: item.unit, ...item.result }] : [],
  )
  if (!complete.length) return { kind: 'incomplete' }
  const family = familyOf[complete[0].unit]
  if (complete.some((item) => familyOf[item.unit] !== family)) {
    return { kind: 'impossible', message: 'אפשר להשוות רק מוצרים שנמדדים באותו סוג: משקל, נפח או יחידות.' }
  }
  const perBases = complete.map((item) => item.paid / item.baseQuantity)
  const lowest = Math.min(...perBases)
  const rows = complete.map((item, position): ProductRow => {
    const perBase = perBases[position]
    const counted = family === 'count'
    return {
      index: item.index,
      paid: item.paid,
      baseQuantity: item.baseQuantity,
      perBase,
      per100: counted ? null : perBase * 100,
      perThousand: counted ? null : perBase * 1000,
      perUnit: counted ? perBase : null,
      overBestPercent: (perBase / lowest - 1) * 100,
      best: complete.length > 1 && perBase - lowest <= lowest * 1e-9,
    }
  })
  const best = rows.find((row) => row.best)
  return { kind: 'result', family, rows, compared: complete.length > 1, bestIndex: best ? best.index : null }
}

export const productLabel = (index: number) => `מוצר ${'אבגדה'[index]}׳`

const quantityFormat = new Intl.NumberFormat('he-IL', { maximumFractionDigits: 2 })
const percentFormat = new Intl.NumberFormat('he-IL', { maximumFractionDigits: 1 })

export { formatShekels }
export const formatQuantity = (value: number) => quantityFormat.format(value)
export const formatOver = (percent: number) => `${percentFormat.format(percent)}%`

export const per100Label = (family: UnitFamily) => (family === 'mass' ? 'ל-100 גרם' : 'ל-100 מ״ל')
export const perThousandLabel = (family: UnitFamily) => (family === 'mass' ? 'לק״ג' : 'לליטר')

export function compareToText(result: CompareResult) {
  return result.rows
    .map((row) => {
      const parts =
        result.family === 'count'
          ? [`${formatShekels(row.perUnit ?? 0)} ליחידה`]
          : [
              `${formatShekels(row.per100 ?? 0)} ${per100Label(result.family)}`,
              `${formatShekels(row.perThousand ?? 0)} ${perThousandLabel(result.family)}`,
            ]
      return `${productLabel(row.index)}: ${parts.join(', ')}${row.best ? ' (הזול ביותר)' : ''}`
    })
    .join('\n')
}
