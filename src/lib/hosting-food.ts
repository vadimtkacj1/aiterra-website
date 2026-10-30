export type MealKind = 'full' | 'regular' | 'light'

export const MEAL_KINDS: { id: MealKind; label: string; hint: string; factor: number }[] = [
  { id: 'full', label: 'אירוח מלא', hint: 'ארוחת שישי או חג', factor: 1 },
  { id: 'regular', label: 'ארוחה רגילה', hint: 'משפחה וחברים', factor: 0.8 },
  { id: 'light', label: 'ארוחה קלה', hint: 'טיול או פיקניק', factor: 0.6 },
]

export type Dish = { id: string; label: string; amount: number; unit: 'g' | 'ml' | 'unit' }

export const DISHES: Dish[] = [
  { id: 'soup', label: 'מרק', amount: 300, unit: 'ml' },
  { id: 'fish', label: 'דג (לפני בישול)', amount: 150, unit: 'g' },
  { id: 'main', label: 'בשר או עוף (לפני בישול)', amount: 300, unit: 'g' },
  { id: 'side', label: 'תוספת מבושלת', amount: 200, unit: 'g' },
  { id: 'salad', label: 'סלטים', amount: 200, unit: 'g' },
  { id: 'bread', label: 'חלה או לחם', amount: 100, unit: 'g' },
  { id: 'dessert', label: 'קינוח', amount: 1, unit: 'unit' },
  { id: 'drink', label: 'שתייה', amount: 500, unit: 'ml' },
]

export const DEFAULT_DISHES = ['main', 'side', 'salad', 'bread', 'dessert', 'drink']

const CHILD_SHARE = 0.5
const SAFETY_MARGIN = 1.1

export const portionsFor = (adults: number, children: number) => adults + children * CHILD_SHARE

const formatAmount = (value: number, unit: Dish['unit']) => {
  if (unit === 'unit') return `${Math.ceil(value)} מנות`
  const large = (Math.ceil(value / 50) * 50) / 1000
  return `${large.toLocaleString('he-IL')} ${unit === 'g' ? 'ק״ג' : 'ליטר'}`
}

export function shoppingList(adults: number, children: number, meal: MealKind, dishes: string[]) {
  const { factor } = MEAL_KINDS.find((item) => item.id === meal) ?? MEAL_KINDS[0]
  const portions = portionsFor(adults, children)
  return DISHES.filter((dish) => dishes.includes(dish.id)).map((dish) => {
    const scale = dish.unit === 'unit' ? 1 : factor * SAFETY_MARGIN
    return [dish.label, formatAmount(dish.amount * portions * scale, dish.unit)] as [string, string]
  })
}
