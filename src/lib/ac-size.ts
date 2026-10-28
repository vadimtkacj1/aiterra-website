export type Sun = 'shaded' | 'normal' | 'strong'
export type Floor = 'middle' | 'top'
export type Region = 'mountain' | 'coastal' | 'inland' | 'hot'

export type AcInput = {
  areaSquareMeters: number
  ceilingMeters: number
  people: number
  sun: Sun
  floor: Floor
  kitchen: boolean
  region: Region
}

export type AcLine = { key: string; label: string; btu: number }

export type AcRating = { horsepower: number; btu: number }

export type AcResult = {
  lines: AcLine[]
  requiredBtu: number
  rating: AcRating | null
}

export const BTU_PER_SQUARE_METER = 650
export const BTU_PER_PERSON = 500
export const BTU_PER_HORSEPOWER = 9_000
export const REFERENCE_CEILING_METERS = 2.7
export const KITCHEN_BTU = 1_500
export const MAX_AREA = 200
export const MAX_PEOPLE = 30

export const HORSEPOWER_RATINGS = [1, 1.25, 1.5, 2, 2.5, 3, 3.5, 4, 5]

export const RATINGS: AcRating[] = HORSEPOWER_RATINGS.map((horsepower) => ({
  horsepower,
  btu: horsepower * BTU_PER_HORSEPOWER,
}))

export const SUN_PERCENT: Record<Sun, number> = { shaded: -10, normal: 0, strong: 10 }
export const FLOOR_PERCENT: Record<Floor, number> = { middle: 0, top: 10 }
export const REGION_PERCENT: Record<Region, number> = { mountain: -10, coastal: 5, inland: 0, hot: 15 }

export const REVIEWED_LABEL = '28.10.2026'

export const SOURCES = {
  tadiranGuide: {
    href: 'https://www.tadiran-group.co.il/horsepower-air-conditioner/',
    label: 'תדיראן: תפוקה של מזגן, המדריך השלם',
    note: 'כלל אצבע של 650 BTU/h למ"ר, 500 BTU/h לכל אדם, חשיבות גובה התקרה, הקומה העליונה, חלונות לדרום ולמערב והאזור בארץ',
  },
  tadiranBtu: {
    href: 'https://www.tadiran-group.co.il/btu-vs-horsepower-air-conditioner/',
    label: 'תדיראן: BTU מול כוח סוס במזגנים',
    note: 'טבלת כוח סוס מול BTU/h, היחס המקובל של 9,000 BTU לכוח סוס, אינוורטר ותקני היעילות SEER ו-SCOP',
  },
  pro: {
    href: 'https://www.pro.co.il/hvac-installation/guide/how-much-horsepower-air-conditioner',
    label: 'המקצוענים: איך יודעים כמה כוח סוס מזגן צריך',
    note: '1 כ"ס שווה כ-9,000 BTU, 650 BTU למ"ר, תוספת של כ-500 BTU לכל אדם ושיקולי לחות במישור החוף',
  },
  tornado: {
    href: 'https://www.tornado-top.co.il/ac_calculator',
    label: 'טורנדו: מחשבון התאמת מזגן',
    note: 'הפרמטרים שהיצרן שואל עליהם: קומת גג, חזית לדרום מערב, קרבה לים ואזור בארץ, כולל עמק הירדן, אילת והערבה',
  },
} as const

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value))

const roundTo = (value: number, step: number) => Math.round(value / step) * step

export function parseDecimal(input: string): number | null {
  const cleaned = input.trim().replace(/[\s\p{Cf}]/gu, '').replace(',', '.')
  if (!/^\d+(\.\d+)?$/.test(cleaned)) return null
  const value = Number(cleaned)
  return Number.isFinite(value) ? value : null
}

export function ratingFor(btu: number): AcRating | null {
  return RATINGS.find((rating) => rating.btu >= btu) ?? null
}

export function calculateAc(input: AcInput): AcResult {
  const area = clamp(input.areaSquareMeters, 0, MAX_AREA)
  const people = clamp(Math.round(input.people), 0, MAX_PEOPLE)
  const base = area * BTU_PER_SQUARE_METER
  const ceilingFactor = Math.max(1, input.ceilingMeters / REFERENCE_CEILING_METERS)
  const ceiling = base * (ceilingFactor - 1)
  const roomLoad = base + ceiling
  const percentLine = (key: string, label: string, percent: number): AcLine => ({
    key,
    label,
    btu: (roomLoad * percent) / 100,
  })

  const lines: AcLine[] = [
    { key: 'area', label: `שטח: ${formatNumber(area, 1)} מ"ר × ${BTU_PER_SQUARE_METER}`, btu: base },
    { key: 'ceiling', label: `תקרה של ${formatNumber(input.ceilingMeters, 2)} מ'`, btu: ceiling },
    percentLine('sun', 'חשיפה לשמש', SUN_PERCENT[input.sun]),
    percentLine('floor', 'קומה עליונה או גג', FLOOR_PERCENT[input.floor]),
    percentLine('region', 'אזור בארץ', REGION_PERCENT[input.region]),
    { key: 'people', label: `${people} אנשים × ${BTU_PER_PERSON}`, btu: people * BTU_PER_PERSON },
    { key: 'kitchen', label: 'מטבח פתוח בחלל', btu: input.kitchen ? KITCHEN_BTU : 0 },
  ]

  const total = lines.reduce((sum, line) => sum + line.btu, 0)
  const requiredBtu = total > 0 ? roundTo(total, 100) : 0
  return { lines, requiredBtu, rating: requiredBtu > 0 ? ratingFor(requiredBtu) : null }
}

export function formatNumber(value: number, maxFractionDigits = 0) {
  return new Intl.NumberFormat('he-IL', { maximumFractionDigits: maxFractionDigits }).format(value)
}

export function formatBtu(value: number) {
  return `${formatNumber(roundTo(value, 10))} BTU`
}

export function formatHorsepower(value: number) {
  return `${formatNumber(value, 2)} כ"ס`
}
