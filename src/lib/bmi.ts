export const MIN_HEIGHT_CM = 100
export const MAX_HEIGHT_CM = 250
export const MIN_WEIGHT_KG = 20
export const MAX_WEIGHT_KG = 400
export const HEALTHY_MIN_BMI = 18.5
export const HEALTHY_MAX_BMI = 24.9

export type AgeGroup = 'adult' | 'minor'

export type BmiCategoryId = 'underweight' | 'normal' | 'overweight' | 'obese1' | 'obese2' | 'obese3'

export type BmiCategory = {
  id: BmiCategoryId
  label: string
  rangeLabel: string
  from: number
  to: number
}

export const BMI_CATEGORIES: BmiCategory[] = [
  { id: 'underweight', label: 'תת משקל', rangeLabel: 'מתחת ל-18.5', from: 0, to: 18.5 },
  { id: 'normal', label: 'משקל תקין', rangeLabel: '18.5 עד 24.9', from: 18.5, to: 25 },
  { id: 'overweight', label: 'עודף משקל', rangeLabel: '25 עד 29.9', from: 25, to: 30 },
  { id: 'obese1', label: 'השמנה דרגה 1', rangeLabel: '30 עד 34.9', from: 30, to: 35 },
  { id: 'obese2', label: 'השמנה דרגה 2', rangeLabel: '35 עד 39.9', from: 35, to: 40 },
  { id: 'obese3', label: 'השמנה דרגה 3', rangeLabel: '40 ומעלה', from: 40, to: Infinity },
]

export type BmiInputs = { heightCm: number; weightKg: number }

export type BmiResult = {
  bmi: number
  category: BmiCategory
  healthyMinKg: number
  healthyMaxKg: number
  kgToHealthy: number
}

export const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value))

export function parseNumber(text: string) {
  const parsed = Number.parseFloat(text.replace(',', '.'))
  return Number.isFinite(parsed) ? parsed : null
}

export function bmiOf({ heightCm, weightKg }: BmiInputs) {
  const meters = heightCm / 100
  return weightKg / (meters * meters)
}

export function categoryFor(bmi: number) {
  const rounded = Math.round(bmi * 10) / 10
  return BMI_CATEGORIES.find((category) => rounded >= category.from && rounded < category.to) ?? BMI_CATEGORIES[5]
}

export function healthyWeightRange(heightCm: number) {
  const squared = (heightCm / 100) ** 2
  return { minKg: HEALTHY_MIN_BMI * squared, maxKg: HEALTHY_MAX_BMI * squared }
}

export function calculate(inputs: BmiInputs): BmiResult {
  const bmi = bmiOf(inputs)
  const { minKg, maxKg } = healthyWeightRange(inputs.heightCm)
  let kgToHealthy = 0
  if (inputs.weightKg < minKg) kgToHealthy = minKg - inputs.weightKg
  if (inputs.weightKg > maxKg) kgToHealthy = maxKg - inputs.weightKg
  return { bmi, category: categoryFor(bmi), healthyMinKg: minKg, healthyMaxKg: maxKg, kgToHealthy }
}

export const formatBmi = (bmi: number) => (Math.round(bmi * 10) / 10).toFixed(1)

export const formatKg = (kg: number) => (Math.round(kg * 10) / 10).toFixed(1)
