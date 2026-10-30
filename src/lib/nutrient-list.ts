export type Nutrient = {
  slug: string
  key: string
  name: string
  unit: string
  dailyAdult: string
  role: string
}

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
  { slug: 'calories', key: 'food_energy', name: 'קלוריות', unit: 'קק״ל', dailyAdult: 'כ-2,000 קק״ל לנשים ו-2,500 קק״ל לגברים, ומשתנה לפי גיל, גובה ופעילות', role: 'יחידת המדידה של האנרגיה שמתקבלת מהמזון' },
  { slug: 'carbohydrates', key: 'carbohydrates', name: 'פחמימות', unit: 'גרם', dailyAdult: 'כ-45% עד 65% מהקלוריות היומיות', role: 'מקור האנרגיה העיקרי של הגוף' },
  { slug: 'sugar', key: 'total_sugars', name: 'סוכר', unit: 'גרם', dailyAdult: 'ארגון הבריאות העולמי ממליץ שסוכר חופשי יהיה פחות מ-10% מהקלוריות, כ-50 גרם ביום', role: 'פחמימה פשוטה, טבעית או מוספת, שנספגת מהר' },
  { slug: 'fat', key: 'total_fat', name: 'שומן', unit: 'גרם', dailyAdult: 'כ-20% עד 35% מהקלוריות היומיות', role: 'מקור אנרגיה מרוכז שנחוץ גם לספיגת ויטמינים' },
  { slug: 'sodium', key: 'sodium', name: 'נתרן', unit: 'מ״ג', dailyAdult: 'ארגון הבריאות העולמי ממליץ על פחות מ-2,000 מ״ג ביום', role: 'מרכיב במלח שמשפיע על מאזן הנוזלים ולחץ הדם' },
  { slug: 'cholesterol', key: 'cholesterol', name: 'כולסטרול', unit: 'מ״ג', dailyAdult: 'אין כמות מחייבת, ובדרך כלל ממליצים לשמור על צריכה נמוכה', role: 'חומר שומני שמקורו במזון מן החי' },
  { slug: 'folate', key: 'folate', name: 'חומצה פולית', unit: 'מק״ג', dailyAdult: '400 מק״ג למבוגרים, ויותר בהיריון', role: 'ויטמין B9, נחוץ לחלוקת תאים ובמיוחד בתחילת היריון' },
  { slug: 'vitamin-b6', key: 'vitamin_b6', name: 'ויטמין B6', unit: 'מ״ג', dailyAdult: '1.3 מ״ג למבוגרים עד גיל 50', role: 'משתתף בחילוף החומרים של חלבונים ובתפקוד העצבים' },
]

export const nutrientPath = (slug: string) => `/tools/nutrients/${slug}`
