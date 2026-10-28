export type MealType = 'main' | 'light'

export type MeatId = 'steak' | 'kebab' | 'pargit' | 'wings' | 'sausages' | 'burger' | 'ribs'

export type Meat = {
  id: MeatId
  label: string
  defaultShare: number
  boneFactor: number
  note: string
}

export const MEATS: Meat[] = [
  { id: 'steak', label: 'סטייק', defaultShare: 20, boneFactor: 1, note: 'אנטריקוט, סינטה או שייטל' },
  { id: 'kebab', label: 'קבב', defaultShare: 15, boneFactor: 1, note: 'בשר טחון' },
  { id: 'pargit', label: 'שיפודי פרגית', defaultShare: 20, boneFactor: 1, note: 'פרגית בלי עצם' },
  { id: 'wings', label: 'כנפיים', defaultShare: 10, boneFactor: 1.2, note: 'עם עצם, +20%' },
  { id: 'sausages', label: 'נקניקיות', defaultShare: 10, boneFactor: 1, note: 'נפתחים איתן' },
  { id: 'burger', label: 'המבורגר', defaultShare: 10, boneFactor: 1, note: 'בשר טחון' },
  { id: 'ribs', label: 'צלעות', defaultShare: 15, boneFactor: 1.2, note: 'אסאדו או צלעות טלה, +20%' },
]

export const GRAMS_PER_ADULT: Record<MealType, number> = { main: 400, light: 250 }
export const KID_FACTOR = 0.5
export const BIG_EATER_FACTOR = 1.5
export const MANY_SIDES_DISCOUNT = 0.1
export const BUFFER = 0.1
export const CHARCOAL_PER_MEAT_KG = 1
export const CHARCOAL_MIN_KG = 3
export const PITA_PER_ADULT = 2
export const PITA_PER_KID = 1
export const SALAD_GRAMS_PER_PERSON = 200
export const DRINK_LITERS_PER_PERSON = 1.5

export const REVIEWED_LABEL = '28 באוקטובר 2026'

export const SOURCES = {
  gorme: {
    href: 'https://www.gorme.co.il/blog/a-complete-guide-to-calculating-the-amount-of-meat-for-a-barbecue/',
    label: 'מעדני גורמה: מדריך מלא לחישוב כמות בשר לעל האש',
    note: '450 גרם לגבר, 250-300 לאישה, 150-225 לילד, תוספת של 15-20% לבשר עם עצם, 10-15% פחות כשיש הרבה תוספות, וקנייה של 10% מעל החישוב',
  },
  udiosher: {
    href: 'https://udiosher.com/%D7%9E%D7%94%D7%A4%D7%9A-%D7%91%D7%99%D7%95%D7%9D-%D7%94%D7%A2%D7%A6%D7%9E%D7%90%D7%95%D7%AA-%D7%94%D7%A7%D7%A8%D7%95%D7%91-%D7%A0%D7%A7%D7%A0%D7%94-%D7%9B%D7%9E%D7%95%D7%AA-%D7%9E%D7%93%D7%95%D7%99/',
    label: 'אודי ואושר: מחשבון כמויות למנגל המושלם',
    note: '300-350 גרם לאדם מעל גיל 12, ילד מתחת לגיל 12 נחשב לחצי מבוגר, ונקניקיות, קבבים ופרגיות נכנסים לאותו משקל',
  },
  yoji: {
    href: 'https://yoji-rimon.co.il/blog/blog-9',
    label: 'בשרי יוז׳י: כיצד מחשבים את הכמות הנכונה של בשר לאדם בארוחה',
    note: '350 גרם עד חצי קילו לאדם כשהבשר הוא המנה העיקרית, ו-200 גרם כשהוא רק חלק מהארוחה',
  },
}

export type Shares = Record<MeatId, number>

export const defaultShares = (): Shares =>
  Object.fromEntries(MEATS.map((meat) => [meat.id, meat.defaultShare])) as Shares

export type BbqInput = {
  adults: number
  kids: number
  bigEaters: number
  meal: MealType
  gramsPerAdult: number
  manySides: boolean
  buffer: boolean
  shares: Shares
}

export type MeatLine = { id: MeatId; label: string; edibleKg: number; buyKg: number }

export type BbqResult = {
  portions: number
  people: number
  edibleKg: number
  buyKg: number
  lines: MeatLine[]
  charcoalKg: number
  pitas: number
  saladKg: number
  drinksLiters: number
}

const roundTo = (value: number, step: number) => Math.round(value / step) * step

export const clampCount = (value: number) => (Number.isFinite(value) ? Math.max(0, Math.min(500, Math.floor(value))) : 0)

export function calculateBbq(input: BbqInput): BbqResult | null {
  const adults = clampCount(input.adults)
  const kids = clampCount(input.kids)
  const bigEaters = Math.min(clampCount(input.bigEaters), adults)
  const people = adults + kids
  const totalShare = MEATS.reduce((sum, meat) => sum + Math.max(0, input.shares[meat.id] || 0), 0)
  if (people === 0 || totalShare === 0 || input.gramsPerAdult <= 0) return null

  const portions = adults + bigEaters * (BIG_EATER_FACTOR - 1) + kids * KID_FACTOR
  const sidesFactor = input.manySides ? 1 - MANY_SIDES_DISCOUNT : 1
  const bufferFactor = input.buffer ? 1 + BUFFER : 1
  const edibleKg = (portions * input.gramsPerAdult * sidesFactor * bufferFactor) / 1000

  const lines = MEATS.filter((meat) => (input.shares[meat.id] || 0) > 0).map((meat) => {
    const share = Math.max(0, input.shares[meat.id]) / totalShare
    const lineEdible = edibleKg * share
    return {
      id: meat.id,
      label: meat.label,
      edibleKg: lineEdible,
      buyKg: Math.max(0.1, roundTo(lineEdible * meat.boneFactor, 0.1)),
    }
  })
  const buyKg = lines.reduce((sum, line) => sum + line.buyKg, 0)

  return {
    portions,
    people,
    edibleKg,
    buyKg,
    lines,
    charcoalKg: Math.max(CHARCOAL_MIN_KG, Math.ceil(buyKg * CHARCOAL_PER_MEAT_KG)),
    pitas: Math.ceil(adults * PITA_PER_ADULT + kids * PITA_PER_KID),
    saladKg: roundTo((people * SALAD_GRAMS_PER_PERSON) / 1000, 0.5) || 0.5,
    drinksLiters: Math.ceil(people * DRINK_LITERS_PER_PERSON),
  }
}

export const formatKg = (kg: number) =>
  `${kg.toLocaleString('he-IL', { minimumFractionDigits: 1, maximumFractionDigits: 1 })} ק״ג`

export function shoppingList(result: BbqResult): string {
  return [
    `רשימת קניות למנגל, ${result.people} סועדים`,
    ...result.lines.map((line) => `${line.label}: ${formatKg(line.buyKg)}`),
    `סך הכול בשר: ${formatKg(result.buyKg)}`,
    `פחמים: ${result.charcoalKg} ק״ג`,
    `פיתות: ${result.pitas}`,
    `סלטים: ${formatKg(result.saladKg)}`,
    `שתייה: ${result.drinksLiters} ליטר`,
  ].join('\n')
}
