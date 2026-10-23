export type DrinkId = 'beer' | 'wine' | 'spirits'

export type AlcoholInput = {
  guests: number
  drinkerPercent: number
  hours: number
  drinksPerHour: number
  bufferPercent: number
  mix: Record<DrinkId, number>
  servingMl: Record<DrinkId, number>
  bottleMl: Record<DrinkId, number>
}

export type DrinkLine = {
  id: DrinkId
  servings: number
  bottles: number
  liters: number
}

export type AlcoholResult = {
  drinkers: number
  totalServings: number
  perDrinker: number
  lines: DrinkLine[]
}

export const ALCOHOL_CHECKED = '2026-10-23'
export const ALCOHOL_CHECKED_LABEL = '23.10.2026'

export const drinks: { id: DrinkId; label: string; unit: string; bottleLabel: string }[] = [
  { id: 'beer', label: 'בירה', unit: 'בקבוקי בירה', bottleLabel: 'בקבוק' },
  { id: 'wine', label: 'יין', unit: 'בקבוקי יין', bottleLabel: 'בקבוק' },
  { id: 'spirits', label: 'משקאות חריפים וקוקטיילים', unit: 'בקבוקי חריף', bottleLabel: 'בקבוק' },
]

export const alcoholSources = {
  standard: {
    label: 'משרד הבריאות: נזקי שתיית אלכוהול (משקה סטנדרטי בישראל: כ-14 גרם אלכוהול נקי, 330 מ״ל בירה, 100 מ״ל יין, 40 מ״ל חריף)',
    href: 'https://www.gov.il/he/pages/alcohol-addiction',
  },
} as const

export const defaultInput: AlcoholInput = {
  guests: 100,
  drinkerPercent: 70,
  hours: 4,
  drinksPerHour: 1,
  bufferPercent: 10,
  mix: { beer: 40, wine: 35, spirits: 25 },
  servingMl: { beer: 330, wine: 100, spirits: 40 },
  bottleMl: { beer: 330, wine: 750, spirits: 700 },
}

export const LIMITS = {
  guests: { min: 1, max: 5000 },
  percent: { min: 0, max: 100 },
  hours: { min: 0.5, max: 12 },
  rate: { min: 0.1, max: 4 },
  buffer: { min: 0, max: 100 },
}

export const inputError = (input: AlcoholInput) => {
  if (!(input.guests >= LIMITS.guests.min && input.guests <= LIMITS.guests.max)) {
    return 'מספר האורחים צריך להיות בין 1 ל-5,000.'
  }
  if (!(input.hours >= LIMITS.hours.min && input.hours <= LIMITS.hours.max)) {
    return 'משך האירוע צריך להיות בין חצי שעה ל-12 שעות.'
  }
  if (!(input.drinksPerHour >= LIMITS.rate.min && input.drinksPerHour <= LIMITS.rate.max)) {
    return 'מספר המשקאות לשעה צריך להיות בין 0.1 ל-4.'
  }
  const mixTotal = input.mix.beer + input.mix.wine + input.mix.spirits
  if (!(mixTotal > 0)) return 'הזינו אחוז חיובי לפחות לסוג משקה אחד.'
  const sizes = [...Object.values(input.servingMl), ...Object.values(input.bottleMl)]
  if (sizes.some((size) => !(size > 0))) return 'גדלי המנות והבקבוקים צריכים להיות חיוביים.'
  return ''
}

export const calculateAlcohol = (input: AlcoholInput): AlcoholResult => {
  const drinkers = (input.guests * input.drinkerPercent) / 100
  const buffer = 1 + input.bufferPercent / 100
  const totalServings = drinkers * input.hours * input.drinksPerHour * buffer
  const mixTotal = input.mix.beer + input.mix.wine + input.mix.spirits
  const lines = drinks.map(({ id }) => {
    const servings = (totalServings * input.mix[id]) / mixTotal
    const liters = (servings * input.servingMl[id]) / 1000
    const bottles = Math.ceil((servings * input.servingMl[id]) / input.bottleMl[id] - 1e-9)
    return { id, servings: Math.ceil(servings - 1e-9), bottles, liters }
  })
  return {
    drinkers: Math.ceil(drinkers - 1e-9),
    totalServings: Math.ceil(totalServings - 1e-9),
    perDrinker: input.hours * input.drinksPerHour,
    lines,
  }
}
