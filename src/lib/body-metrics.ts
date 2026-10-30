export type Sex = 'female' | 'male'

export const ACTIVITY_LEVELS = [
  { id: 'sedentary', label: 'יושבני', hint: 'כמעט בלי אימונים', factor: 1.2 },
  { id: 'light', label: 'קל', hint: '1 עד 3 אימונים בשבוע', factor: 1.375 },
  { id: 'moderate', label: 'בינוני', hint: '3 עד 5 אימונים בשבוע', factor: 1.55 },
  { id: 'high', label: 'גבוה', hint: '6 עד 7 אימונים בשבוע', factor: 1.725 },
  { id: 'extreme', label: 'גבוה מאוד', hint: 'עבודה פיזית ואימונים', factor: 1.9 },
] as const

export type ActivityId = (typeof ACTIVITY_LEVELS)[number]['id']

export const CALORIE_FLOOR: Record<Sex, number> = { female: 1200, male: 1500 }

export const bmrMifflin = (sex: Sex, weightKg: number, heightCm: number, age: number) =>
  10 * weightKg + 6.25 * heightCm - 5 * age + (sex === 'male' ? 5 : -161)

export const dailyCalories = (bmr: number, activity: ActivityId) => {
  const { factor } = ACTIVITY_LEVELS.find((level) => level.id === activity) ?? ACTIVITY_LEVELS[0]
  return bmr * factor
}

export const PROTEIN_GOALS = [
  { id: 'general', label: 'בריאות כללית', hint: '0.8 גרם לק״ג', min: 0.8, max: 0.8 },
  { id: 'active', label: 'ספורט סדיר', hint: '1.2 עד 1.6 גרם לק״ג', min: 1.2, max: 1.6 },
  { id: 'muscle', label: 'בניית שריר', hint: '1.6 עד 2.0 גרם לק״ג', min: 1.6, max: 2 },
] as const

export type ProteinGoalId = (typeof PROTEIN_GOALS)[number]['id']

export const proteinRange = (weightKg: number, goal: ProteinGoalId) => {
  const { min, max } = PROTEIN_GOALS.find((item) => item.id === goal) ?? PROTEIN_GOALS[0]
  return { min: Math.round(weightKg * min), max: Math.round(weightKg * max) }
}

const ML_PER_KG = 30
const ML_PER_EXERCISE_MINUTE = 12
export const GLASS_ML = 240
export const DRINK_REFERENCE_LITERS: Record<Sex, number> = { female: 2.2, male: 3 }

export const waterLiters = (sex: Sex, weightKg: number, exerciseMinutes: number) => {
  const base = Math.max((weightKg * ML_PER_KG) / 1000, DRINK_REFERENCE_LITERS[sex] * 0.8)
  return base + (exerciseMinutes * ML_PER_EXERCISE_MINUTE) / 1000
}

export const maxHeartRate = (age: number) => 208 - 0.7 * age

export const HEART_ZONES = [
  { label: 'התאוששות', hint: 'הליכה נינוחה', from: 0.5, to: 0.6 },
  { label: 'שריפת שומן', hint: 'קצב שאפשר לדבר בו', from: 0.6, to: 0.7 },
  { label: 'סיבולת', hint: 'ריצה קלה עד בינונית', from: 0.7, to: 0.8 },
  { label: 'סף', hint: 'מאמץ קשה', from: 0.8, to: 0.9 },
  { label: 'מרבי', hint: 'אינטרוולים קצרים', from: 0.9, to: 1 },
]

export type Circumferences = { heightCm: number; neckCm: number; waistCm: number; hipCm: number }

export const bodyFatNavy = (sex: Sex, { heightCm, neckCm, waistCm, hipCm }: Circumferences) => {
  const denominator =
    sex === 'male'
      ? 1.0324 - 0.19077 * Math.log10(waistCm - neckCm) + 0.15456 * Math.log10(heightCm)
      : 1.29579 - 0.35004 * Math.log10(waistCm + hipCm - neckCm) + 0.221 * Math.log10(heightCm)
  return 495 / denominator - 450
}

const FAT_BANDS: Record<Sex, [number, string][]> = {
  female: [[14, 'שומן חיוני'], [21, 'ספורטיבי'], [25, 'כושר טוב'], [32, 'ממוצע'], [Infinity, 'גבוה']],
  male: [[6, 'שומן חיוני'], [14, 'ספורטיבי'], [18, 'כושר טוב'], [25, 'ממוצע'], [Infinity, 'גבוה']],
}

export const bodyFatBand = (sex: Sex, percent: number) =>
  FAT_BANDS[sex].find(([limit]) => percent < limit)?.[1] ?? 'גבוה'
