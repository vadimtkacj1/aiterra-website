export type PaintInput = {
  length: number
  width: number
  height: number
  rooms: number
  doors: number
  doorWidth: number
  doorHeight: number
  windows: number
  windowWidth: number
  windowHeight: number
  ceiling: boolean
  coats: number
  coverage: number
  wastePercent: number
  packSize: number
}

export type PaintResult = {
  wallArea: number
  openingsArea: number
  paintableWalls: number
  ceilingArea: number
  wallLiters: number
  ceilingLiters: number
  totalLiters: number
  roundedLiters: number
  packs: number
}

export type CoveragePreset = {
  id: string
  label: string
  hint: string
  value: number | null
}

export const COVERAGE_CHECKED = '2026-10-23'
export const COVERAGE_CHECKED_LABEL = '23.10.2026'

export const coveragePresets: CoveragePreset[] = [
  { id: 'emulsin', label: 'תמבור אמולסין', hint: '9 עד 10 מ״ר לליטר, נלקח הערך הנמוך', value: 9 },
  { id: 'supercryl', label: 'תמבור סופרקריל מט', hint: '12 עד 16 מ״ר לליטר, נלקח הערך הנמוך', value: 12 },
  { id: 'custom', label: 'ערך אחר', hint: 'מהאריזה של הצבע שלכם', value: null },
]

export const paintSources = {
  emulsin: {
    label: 'Tambour: Emulsin (calculated coverage 9-10 square meters / liter, package size 18 liter)',
    href: 'https://tambourpaints.com/product/emulsin/',
  },
  supercryl: {
    label: 'Tambour: Supercryl Matte (calculated coverage 12-16 square meters / liter)',
    href: 'https://tambourpaints.com/product/supercryl-matte/',
  },
  nirlat: {
    label: 'נירלט: כיצד מחשבים כמה צבע צריך',
    href: 'https://nirlat.com/%D7%9B%D7%99%D7%A6%D7%93-%D7%9E%D7%97%D7%A9%D7%91%D7%99%D7%9D-%D7%9B%D7%9E%D7%94-%D7%A6%D7%91%D7%A2-%D7%A6%D7%A8%D7%99%D7%9A/',
  },
} as const

export const defaultInput: PaintInput = {
  length: 4,
  width: 3.5,
  height: 2.5,
  rooms: 1,
  doors: 1,
  doorWidth: 0.9,
  doorHeight: 2.1,
  windows: 1,
  windowWidth: 1.2,
  windowHeight: 1.2,
  ceiling: false,
  coats: 2,
  coverage: 9,
  wastePercent: 10,
  packSize: 18,
}

export const LIMITS = {
  dimension: { min: 0.5, max: 30 },
  count: { max: 50 },
  coats: { min: 1, max: 4 },
  coverage: { min: 3, max: 30 },
  waste: { min: 0, max: 50 },
  pack: { min: 0.5, max: 50 },
}

export const inputError = (input: PaintInput) => {
  const dimensions = [input.length, input.width, input.height]
  if (dimensions.some((value) => !(value >= LIMITS.dimension.min && value <= LIMITS.dimension.max))) {
    return 'מידות החדר צריכות להיות בין חצי מטר ל-30 מטר.'
  }
  if (!(input.rooms >= 1 && input.rooms <= LIMITS.count.max)) return 'מספר החדרים צריך להיות בין 1 ל-50.'
  if (!(input.coats >= LIMITS.coats.min && input.coats <= LIMITS.coats.max)) return 'מספר השכבות צריך להיות בין 1 ל-4.'
  if (!(input.coverage >= LIMITS.coverage.min && input.coverage <= LIMITS.coverage.max)) {
    return 'כושר הכיסוי צריך להיות בין 3 ל-30 מ״ר לליטר.'
  }
  if (!(input.packSize >= LIMITS.pack.min)) return 'גודל האריזה צריך להיות חיובי.'
  return ''
}

const round1 = (value: number) => Math.round(value * 10) / 10

export const calculatePaint = (input: PaintInput): PaintResult => {
  const wallArea = 2 * (input.length + input.width) * input.height
  const openingsArea =
    input.doors * input.doorWidth * input.doorHeight + input.windows * input.windowWidth * input.windowHeight
  const paintableWalls = Math.max(wallArea - openingsArea, 0)
  const ceilingArea = input.ceiling ? input.length * input.width : 0
  const waste = 1 + input.wastePercent / 100
  const wallLiters = ((paintableWalls * input.rooms * input.coats) / input.coverage) * waste
  const ceilingLiters = ((ceilingArea * input.rooms * input.coats) / input.coverage) * waste
  const totalLiters = wallLiters + ceilingLiters
  const roundedLiters = Math.ceil(totalLiters * 2) / 2
  return {
    wallArea: round1(wallArea),
    openingsArea: round1(openingsArea),
    paintableWalls: round1(paintableWalls),
    ceilingArea: round1(ceilingArea),
    wallLiters: round1(wallLiters),
    ceilingLiters: round1(ceilingLiters),
    totalLiters: round1(totalLiters),
    roundedLiters,
    packs: Math.ceil(roundedLiters / input.packSize),
  }
}
