export const CLOTHING_PATH = '/tools/clothing-size-chart'
export const CLOTHING_CHECKED = '2026-10-24'
export const CLOTHING_CHECKED_LABEL = '24.10.2026'

export type ClothingGroupId = 'women' | 'men' | 'kids'
export type SystemId = 'eu' | 'it' | 'fr' | 'uk' | 'us' | 'intl' | 'age'

export type SizeRow = {
  labels: Partial<Record<SystemId, string>>
  chest: number
  waist: number
  hips: number
}

export const systemLabels: Record<SystemId, string> = {
  eu: 'ישראל ואירופה (EU)',
  it: 'איטליה (IT)',
  fr: 'צרפת (FR)',
  uk: 'בריטניה (UK)',
  us: 'ארה״ב (US)',
  intl: 'אותיות (XS-XXL)',
  age: 'גיל משוער',
}

export const clothingGroups: { id: ClothingGroupId; label: string; systems: SystemId[] }[] = [
  { id: 'women', label: 'נשים', systems: ['eu', 'it', 'fr', 'uk', 'us', 'intl'] },
  { id: 'men', label: 'גברים', systems: ['eu', 'uk', 'intl'] },
  { id: 'kids', label: 'ילדים', systems: ['eu', 'age'] },
]

const womenBase: { eu: number; intl: string; chest: number; waist: number; hips: number }[] = [
  { eu: 32, intl: 'XXS', chest: 76, waist: 58, hips: 84 },
  { eu: 34, intl: 'XS', chest: 80, waist: 62, hips: 88 },
  { eu: 36, intl: 'S', chest: 84, waist: 66, hips: 92 },
  { eu: 38, intl: 'M', chest: 88, waist: 70, hips: 96 },
  { eu: 40, intl: 'M-L', chest: 92, waist: 74, hips: 100 },
  { eu: 42, intl: 'L', chest: 96, waist: 78, hips: 104 },
  { eu: 44, intl: 'XL', chest: 100, waist: 82, hips: 108 },
  { eu: 46, intl: 'XXL', chest: 104, waist: 86, hips: 112 },
  { eu: 48, intl: '3XL', chest: 110, waist: 92, hips: 118 },
  { eu: 50, intl: '4XL', chest: 116, waist: 98, hips: 124 },
]

const womenRows: SizeRow[] = womenBase.map((row) => ({
  labels: {
    eu: String(row.eu),
    it: String(row.eu + 4),
    fr: String(row.eu + 2),
    uk: String(row.eu - 28),
    us: String(row.eu - 32),
    intl: row.intl,
  },
  chest: row.chest,
  waist: row.waist,
  hips: row.hips,
}))

const menBase: { eu: number; inch: number; intl: string; waist: number; hips: number }[] = [
  { eu: 44, inch: 34, intl: 'XS', waist: 71, hips: 90 },
  { eu: 46, inch: 36, intl: 'S', waist: 76, hips: 95 },
  { eu: 48, inch: 38, intl: 'S-M', waist: 81, hips: 100 },
  { eu: 50, inch: 40, intl: 'M', waist: 86, hips: 105 },
  { eu: 52, inch: 42, intl: 'L', waist: 91, hips: 110 },
  { eu: 54, inch: 44, intl: 'XL', waist: 97, hips: 115 },
  { eu: 56, inch: 46, intl: 'XXL', waist: 102, hips: 120 },
  { eu: 58, inch: 48, intl: '3XL', waist: 107, hips: 125 },
]

const menRows: SizeRow[] = menBase.map((row) => ({
  labels: { eu: String(row.eu), uk: String(row.inch), intl: row.intl },
  chest: Math.round(row.inch * 2.54),
  waist: row.waist,
  hips: row.hips,
}))

const kidsBase: [number, string, number, number, number][] = [
  [74, '9 חודשים', 46, 47, 48],
  [80, '12 חודשים', 48, 48, 50],
  [86, '18 חודשים', 50, 49, 52],
  [92, '2', 52, 51, 54],
  [98, '3', 54, 52, 57],
  [104, '4', 56, 53, 60],
  [110, '5', 58, 54, 63],
  [116, '6', 60, 55, 66],
  [122, '7', 63, 57, 69],
  [128, '8', 66, 59, 72],
  [134, '9', 69, 61, 76],
  [140, '10', 72, 63, 80],
  [146, '11', 76, 65, 84],
  [152, '12', 80, 67, 88],
  [158, '13', 84, 69, 92],
  [164, '14', 88, 71, 95],
]

const kidsRows: SizeRow[] = kidsBase.map(([height, age, chest, waist, hips]) => ({
  labels: { eu: String(height), age },
  chest,
  waist,
  hips,
}))

export const clothingTables: Record<ClothingGroupId, SizeRow[]> = {
  women: womenRows,
  men: menRows,
  kids: kidsRows,
}

export const columnTitle = (group: ClothingGroupId, system: SystemId) => {
  if (system === 'eu' && group === 'kids') return 'גובה בס״מ (מידה אירופאית)'
  if (system === 'uk' && group === 'men') return 'בריטניה וארה״ב (חזה באינצ׳ים)'
  return systemLabels[system]
}

export const findBySize = (group: ClothingGroupId, system: SystemId, value: string) =>
  clothingTables[group].find((row) => row.labels[system] === value)

export type MeasurementInput = { chest: number | null; waist: number | null; hips: number | null }

export type MeasurementResult =
  | { status: 'found'; row: SizeRow }
  | { status: 'above'; row: SizeRow }
  | { status: 'empty' }

export function findByMeasurements(group: ClothingGroupId, input: MeasurementInput): MeasurementResult {
  const rows = clothingTables[group]
  const filled = (['chest', 'waist', 'hips'] as const).filter((key) => input[key] !== null)
  if (!filled.length) return { status: 'empty' }
  const match = rows.find((row) => filled.every((key) => (input[key] as number) <= row[key]))
  if (match) return { status: 'found', row: match }
  return { status: 'above', row: rows[rows.length - 1] }
}

export const parseCentimeters = (value: string): number | null | 'invalid' => {
  const cleaned = value.trim().replace(',', '.')
  if (!cleaned) return null
  if (!/^\d{1,3}(\.\d)?$/.test(cleaned)) return 'invalid'
  const number = Number(cleaned)
  return number >= 30 && number <= 200 ? number : 'invalid'
}

export const jeansRows: { inch: number; cm: number; women: string; men: string }[] = [
  { inch: 24, cm: 61, women: '34', men: '-' },
  { inch: 26, cm: 66, women: '36', men: '-' },
  { inch: 28, cm: 71, women: '38', men: '44' },
  { inch: 29, cm: 74, women: '40', men: '-' },
  { inch: 30, cm: 76, women: '40-42', men: '46' },
  { inch: 31, cm: 79, women: '42', men: '-' },
  { inch: 32, cm: 81, women: '44', men: '48' },
  { inch: 33, cm: 84, women: '44-46', men: '-' },
  { inch: 34, cm: 86, women: '46', men: '50' },
  { inch: 36, cm: 91, women: '48', men: '52' },
  { inch: 38, cm: 97, women: '50', men: '54' },
  { inch: 40, cm: 102, women: '-', men: '56' },
]

export const braBands: { eu: number; us: number; fr: number; underbust: [number, number] }[] = [
  { eu: 65, us: 30, fr: 80, underbust: [63, 67] },
  { eu: 70, us: 32, fr: 85, underbust: [68, 72] },
  { eu: 75, us: 34, fr: 90, underbust: [73, 77] },
  { eu: 80, us: 36, fr: 95, underbust: [78, 82] },
  { eu: 85, us: 38, fr: 100, underbust: [83, 87] },
  { eu: 90, us: 40, fr: 105, underbust: [88, 92] },
  { eu: 95, us: 42, fr: 110, underbust: [93, 97] },
  { eu: 100, us: 44, fr: 115, underbust: [98, 102] },
]

export const braCups: { eu: string; uk: string; us: string; diff: number }[] = [
  { eu: 'AA', uk: 'AA', us: 'AA', diff: 10 },
  { eu: 'A', uk: 'A', us: 'A', diff: 12 },
  { eu: 'B', uk: 'B', us: 'B', diff: 14 },
  { eu: 'C', uk: 'C', us: 'C', diff: 16 },
  { eu: 'D', uk: 'D', us: 'D', diff: 18 },
  { eu: 'E', uk: 'DD', us: 'DD או E', diff: 20 },
  { eu: 'F', uk: 'E', us: 'DDD או F', diff: 22 },
  { eu: 'G', uk: 'F', us: 'DDDD או G', diff: 24 },
  { eu: 'H', uk: 'FF', us: 'H', diff: 26 },
]

export type BraResult =
  | { status: 'found'; band: (typeof braBands)[number]; cup: (typeof braCups)[number] }
  | { status: 'out' }

export function braFromMeasurements(underbust: number, bust: number): BraResult {
  const band = braBands.find((item) => underbust <= item.underbust[1] + 0.99)
  const diff = bust - underbust
  if (!band || diff < 9 || diff > 27) return { status: 'out' }
  const index = Math.min(braCups.length - 1, Math.max(0, Math.round((diff - 10) / 2)))
  return { status: 'found', band, cup: braCups[index] }
}

export type ClothingSourceId = 'wikiClothing' | 'wikiBra' | 'wikiEn13402'

export const clothingSources: Record<ClothingSourceId, { label: string; href: string; official: boolean }> = {
  wikiClothing: {
    label: 'Wikipedia: Clothing sizes (הבדלים בין מערכות המידות באירופה, בריטניה וארה״ב)',
    href: 'https://en.wikipedia.org/wiki/Clothing_sizes',
    official: false,
  },
  wikiBra: {
    label: 'Wikipedia: Bra size (שיטות הגודל בחזיות ומדידת היקף החזה והיקף הגוף)',
    href: 'https://en.wikipedia.org/wiki/Bra_size',
    official: false,
  },
  wikiEn13402: {
    label: 'Wikipedia: EN 13402 (תקן אירופי למידות בגדים לפי מידות גוף בסנטימטרים)',
    href: 'https://en.wikipedia.org/wiki/EN_13402',
    official: false,
  },
}

export const clothingSourceOrder: ClothingSourceId[] = ['wikiClothing', 'wikiBra', 'wikiEn13402']
