import foods from './nutrient-foods.json'

export type NutrientFood = { name: string; amount: number }

export type Nutrient = {
  slug: string
  key: keyof typeof foods
  name: string
  unit: string
  dailyAdult: string
  role: string
}

export const NUTRIENTS_SOURCE = 'https://data.gov.il/dataset/nutrition-database'

export const nutrients: Nutrient[] = [
  { slug: 'iron', key: 'iron', name: 'ברזל', unit: 'מ״ג', dailyAdult: '8 מ״ג לגברים, 18 מ״ג לנשים עד גיל 50', role: 'נחוץ לייצור המוגלובין ולהובלת חמצן בדם' },
  { slug: 'protein', key: 'protein', name: 'חלבון', unit: 'גרם', dailyAdult: 'כ-0.8 גרם לכל ק״ג משקל גוף', role: 'אבן בניין של שרירים, רקמות ואנזימים' },
  { slug: 'potassium', key: 'potassium', name: 'אשלגן', unit: 'מ״ג', dailyAdult: '2,600 מ״ג לנשים, 3,400 מ״ג לגברים', role: 'משפיע על פעילות השרירים, העצבים ולחץ הדם' },
  { slug: 'calcium', key: 'calcium', name: 'סידן', unit: 'מ״ג', dailyAdult: '1,000 מ״ג למבוגרים', role: 'נחוץ לעצמות, לשיניים ולכיווץ שרירים' },
  { slug: 'magnesium', key: 'magnesium', name: 'מגנזיום', unit: 'מ״ג', dailyAdult: '310–320 מ״ג לנשים, 400–420 מ״ג לגברים', role: 'משתתף בתפקוד השרירים והעצבים ובייצור אנרגיה' },
  { slug: 'vitamin-d', key: 'vitamin_d', name: 'ויטמין D', unit: 'מק״ג', dailyAdult: '15 מק״ג למבוגרים עד גיל 70', role: 'מסייע לספיגת סידן ולבריאות העצם' },
  { slug: 'vitamin-c', key: 'vitamin_c', name: 'ויטמין C', unit: 'מ״ג', dailyAdult: '75 מ״ג לנשים, 90 מ״ג לגברים', role: 'נוגד חמצון שמסייע גם לספיגת ברזל מהצומח' },
  { slug: 'fiber', key: 'total_dietary_fiber', name: 'סיבים תזונתיים', unit: 'גרם', dailyAdult: 'כ-25 גרם לנשים, 38 גרם לגברים', role: 'תומכים בפעילות מערכת העיכול ובתחושת שובע' },
  { slug: 'zinc', key: 'zinc', name: 'אבץ', unit: 'מ״ג', dailyAdult: '8 מ״ג לנשים, 11 מ״ג לגברים', role: 'חשוב למערכת החיסון ולריפוי פצעים' },
  { slug: 'vitamin-b12', key: 'vitamin_b12', name: 'ויטמין B12', unit: 'מק״ג', dailyAdult: '2.4 מק״ג למבוגרים', role: 'נחוץ לתאי הדם ולמערכת העצבים' },
]

export const nutrientPath = (slug: string) => `/tools/nutrients/${slug}`
export const nutrientBySlug = (slug: string) => nutrients.find((item) => item.slug === slug)
export const foodsRichIn = (nutrient: Nutrient): NutrientFood[] =>
  (foods[nutrient.key] as [string, number][]).map(([name, amount]) => ({ name, amount }))
