export const BAKING_CHECKED = '2026-10-23'
export const BAKING_CHECKED_LABEL = '23.10.2026'

export type CupSystemId = 'il240' | 'il250' | 'us'
export type VolumeUnit = 'cup' | 'tbsp' | 'tsp'

export type CupSystem = { id: CupSystemId; label: string; cupMl: number; tbspMl: number; tspMl: number }

export const cupSystems: CupSystem[] = [
  { id: 'il240', label: 'כוס ישראלית 240 מ״ל', cupMl: 240, tbspMl: 15, tspMl: 5 },
  { id: 'il250', label: 'כוס 250 מ״ל', cupMl: 250, tbspMl: 15, tspMl: 5 },
  { id: 'us', label: 'כוס אמריקאית 236.6 מ״ל', cupMl: 236.588, tbspMl: 14.787, tspMl: 4.929 },
]

export const volumeUnitLabels: Record<VolumeUnit, string> = {
  cup: 'כוס',
  tbsp: 'כף',
  tsp: 'כפית',
}

export const US_CUP_ML = 236.588

export type Ingredient = {
  id: string
  name: string
  gramsPerUsCup: number
  note?: string
}

export const ingredients: Ingredient[] = [
  { id: 'flour', name: 'קמח לבן רגיל', gramsPerUsCup: 120 },
  { id: 'sugar', name: 'סוכר לבן', gramsPerUsCup: 198 },
  { id: 'brown-sugar', name: 'סוכר חום (דחוס)', gramsPerUsCup: 213 },
  { id: 'powdered-sugar', name: 'אבקת סוכר', gramsPerUsCup: 113 },
  { id: 'butter', name: 'חמאה', gramsPerUsCup: 227, note: 'כוס חמאה היא 2 מקלות אמריקאיים' },
  { id: 'oil', name: 'שמן צמחי', gramsPerUsCup: 198 },
  { id: 'honey', name: 'דבש', gramsPerUsCup: 336 },
  { id: 'milk', name: 'חלב', gramsPerUsCup: 227 },
  { id: 'water', name: 'מים', gramsPerUsCup: 227 },
  { id: 'rice', name: 'אורז לבן יבש', gramsPerUsCup: 198 },
  { id: 'oats', name: 'שיבולת שועל (קוואקר)', gramsPerUsCup: 89 },
  { id: 'cocoa', name: 'אבקת קקאו', gramsPerUsCup: 84 },
  { id: 'cornstarch', name: 'קורנפלור', gramsPerUsCup: 112 },
  { id: 'chocolate-chips', name: 'שבבי שוקולד', gramsPerUsCup: 170 },
  { id: 'walnuts', name: 'אגוזי מלך קצוצים', gramsPerUsCup: 113 },
  { id: 'almonds', name: 'שקדים שלמים', gramsPerUsCup: 142 },
  { id: 'salt', name: 'מלח שולחן', gramsPerUsCup: 288 },
  { id: 'baking-powder', name: 'אבקת אפייה', gramsPerUsCup: 192 },
]

export function unitMl(system: CupSystem, unit: VolumeUnit): number {
  if (unit === 'cup') return system.cupMl
  return unit === 'tbsp' ? system.tbspMl : system.tspMl
}

export function gramsPerMl(ingredient: Ingredient): number {
  return ingredient.gramsPerUsCup / US_CUP_ML
}

export function volumeToGrams(ingredient: Ingredient, amount: number, unit: VolumeUnit, system: CupSystem): number {
  return amount * unitMl(system, unit) * gramsPerMl(ingredient)
}

export function gramsToVolume(ingredient: Ingredient, grams: number, unit: VolumeUnit, system: CupSystem): number {
  return grams / gramsPerMl(ingredient) / unitMl(system, unit)
}

export function roundGrams(value: number): number {
  if (value >= 100) return Math.round(value / 5) * 5
  return Math.round(value)
}

const FRACTIONS: [number, string][] = [
  [0, ''],
  [0.125, '⅛'],
  [0.25, '¼'],
  [0.333, '⅓'],
  [0.5, '½'],
  [0.667, '⅔'],
  [0.75, '¾'],
  [0.875, '⅞'],
  [1, ''],
]

export function formatFraction(value: number): string {
  if (!Number.isFinite(value) || value <= 0) return '0'
  const whole = Math.floor(value)
  const rest = value - whole
  let best = FRACTIONS[0]
  for (const candidate of FRACTIONS) {
    if (Math.abs(candidate[0] - rest) < Math.abs(best[0] - rest)) best = candidate
  }
  const carried = best[0] === 1 ? whole + 1 : whole
  const symbol = best[0] === 1 ? '' : best[1]
  if (carried === 0 && symbol === '') return '0'
  return `${carried > 0 ? carried : ''}${carried > 0 && symbol ? ' ' : ''}${symbol}`
}

export function fahrenheitToCelsius(value: number): number {
  return ((value - 32) * 5) / 9
}

export function celsiusToFahrenheit(value: number): number {
  return (value * 9) / 5 + 32
}

export type GasMark = { mark: string; celsius: number; fahrenheit: number; label: string }

export const gasMarks: GasMark[] = [
  { mark: '¼', celsius: 110, fahrenheit: 225, label: 'חם מאוד נמוך' },
  { mark: '½', celsius: 120, fahrenheit: 250, label: 'נמוך מאוד' },
  { mark: '1', celsius: 140, fahrenheit: 275, label: 'נמוך' },
  { mark: '2', celsius: 150, fahrenheit: 300, label: 'נמוך' },
  { mark: '3', celsius: 160, fahrenheit: 325, label: 'בינוני־נמוך' },
  { mark: '4', celsius: 180, fahrenheit: 350, label: 'בינוני' },
  { mark: '5', celsius: 190, fahrenheit: 375, label: 'בינוני־חם' },
  { mark: '6', celsius: 200, fahrenheit: 400, label: 'חם' },
  { mark: '7', celsius: 220, fahrenheit: 425, label: 'חם' },
  { mark: '8', celsius: 230, fahrenheit: 450, label: 'חם מאוד' },
  { mark: '9', celsius: 240, fahrenheit: 475, label: 'חם מאוד' },
]

export function nearestGasMark(celsius: number): GasMark {
  return gasMarks.reduce((best, item) => (Math.abs(item.celsius - celsius) < Math.abs(best.celsius - celsius) ? item : best))
}

export const bakingSources = [
  {
    label: 'King Arthur Baking: Ingredient Weight Chart',
    href: 'https://www.kingarthurbaking.com/learn/ingredient-weight-chart',
  },
  {
    label: 'Wikipedia: Gas mark',
    href: 'https://en.wikipedia.org/wiki/Gas_mark',
  },
]
