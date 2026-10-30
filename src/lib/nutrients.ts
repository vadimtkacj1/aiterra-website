import foods from './nutrient-foods.json'
import { nutrientPath, nutrients, type Nutrient } from './nutrient-list'

export { nutrientPath, nutrients }

export type NutrientFood = { name: string; amount: number }

export const NUTRIENTS_SOURCE = 'https://data.gov.il/dataset/nutrition-database'

export const nutrientBySlug = (slug: string) => nutrients.find((item) => item.slug === slug)
export const foodsRichIn = (nutrient: Nutrient): NutrientFood[] =>
  (foods as unknown as Record<string, [string, number][]>)[nutrient.key].map(([name, amount]) => ({ name, amount }))
