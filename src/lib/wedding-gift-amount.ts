export type ClosenessId = 'family' | 'close' | 'friend' | 'acquaintance'
export type RoundingStep = 10 | 50 | 100

export type Closeness = { id: ClosenessId; label: string; hint: string; coverage: number }

export type GiftInput = {
  costLow: number
  costHigh: number
  adults: number
  children: number
  childShare: number
  adjustPercent: number
  step: RoundingStep
  coverage: Record<ClosenessId, number>
}

export type GiftRange = { low: number; high: number }

export const closenessOptions: Closeness[] = [
  { id: 'family', label: 'משפחה קרובה', hint: 'אחים, הורים, סבים', coverage: 150 },
  { id: 'close', label: 'חברים קרובים ומשפחה רחוקה', hint: 'קשר קרוב ותדיר', coverage: 120 },
  { id: 'friend', label: 'חברים וקולגות', hint: 'קשר טוב, לא יומיומי', coverage: 100 },
  { id: 'acquaintance', label: 'מכרים', hint: 'קשר רופף או מקצועי', coverage: 80 },
]

export const defaultCoverage = (): Record<ClosenessId, number> => ({
  family: 150,
  close: 120,
  friend: 100,
  acquaintance: 80,
})

export const roundingSteps: { id: string; label: string; value: RoundingStep }[] = [
  { id: '10', label: 'ל-10 ש״ח', value: 10 },
  { id: '50', label: 'ל-50 ש״ח', value: 50 },
  { id: '100', label: 'ל-100 ש״ח', value: 100 },
]

export const DEFAULT_COST_LOW = 300
export const DEFAULT_COST_HIGH = 450
export const DEFAULT_CHILD_SHARE = 50
export const MAX_COST = 5000
export const MAX_PEOPLE = 20

export const roundTo = (value: number, step: number) => Math.round(value / step) * step

export const units = (adults: number, children: number, childShare: number) =>
  adults + children * (childShare / 100)

export const giftRange = (input: GiftInput, closeness: ClosenessId): GiftRange => {
  const low = Math.min(input.costLow, input.costHigh)
  const high = Math.max(input.costLow, input.costHigh)
  const factor =
    (input.coverage[closeness] / 100) *
    units(input.adults, input.children, input.childShare) *
    (1 + input.adjustPercent / 100)
  return { low: roundTo(low * factor, input.step), high: roundTo(high * factor, input.step) }
}

export const perPerson = (input: GiftInput, closeness: ClosenessId): GiftRange => {
  const people = Math.max(units(input.adults, input.children, input.childShare), 1)
  const total = giftRange(input, closeness)
  return { low: roundTo(total.low / people, input.step), high: roundTo(total.high / people, input.step) }
}

export const formatShekel = (value: number) => `${new Intl.NumberFormat('he-IL').format(value)} ש״ח`

export const formatRange = (range: GiftRange) =>
  range.low === range.high ? formatShekel(range.low) : `${formatShekel(range.low)} עד ${formatShekel(range.high)}`

export const inputIsValid = (input: GiftInput) =>
  input.costLow > 0 && input.costHigh > 0 && input.costLow <= MAX_COST && input.costHigh <= MAX_COST && input.adults >= 1
