export const COOKING_REVIEWED = '2026-10-23'
export const COOKING_REVIEWED_LABEL = '23.10.2026'

export type CookingCategory = 'eggs' | 'grains' | 'pasta' | 'legumes' | 'vegetables' | 'chicken' | 'meat' | 'fish'

export type SafeTemp = 'poultry' | 'ground' | 'whole' | 'fish' | 'egg'

export type CookingItem = {
  id: string
  name: string
  category: CookingCategory
  method: string
  min: number
  max: number
  note: string
  safe?: SafeTemp
}

export const categoryLabels: Record<CookingCategory, string> = {
  eggs: 'ביצים',
  grains: 'אורז ודגנים',
  pasta: 'פסטה ואטריות',
  legumes: 'קטניות',
  vegetables: 'ירקות',
  chicken: 'עוף',
  meat: 'בשר',
  fish: 'דגים',
}

export const categoryOrder: CookingCategory[] = [
  'eggs',
  'grains',
  'pasta',
  'legumes',
  'vegetables',
  'chicken',
  'meat',
  'fish',
]

export const safeTemps: Record<SafeTemp, { celsius: number; fahrenheit: number; label: string }> = {
  poultry: { celsius: 74, fahrenheit: 165, label: 'עוף והודו' },
  ground: { celsius: 71, fahrenheit: 160, label: 'בשר טחון' },
  whole: { celsius: 63, fahrenheit: 145, label: 'סטייק, צלי וצלעות, ואחריהם מנוחה של 3 דקות' },
  fish: { celsius: 63, fahrenheit: 145, label: 'דגים' },
  egg: { celsius: 71, fahrenheit: 160, label: 'מנות ביצים' },
}

const item = (
  id: string,
  name: string,
  category: CookingCategory,
  method: string,
  min: number,
  max: number,
  note: string,
  safe?: SafeTemp,
): CookingItem => ({ id, name, category, method, min, max, note, safe })

export const cookingItems: CookingItem[] = [
  item('egg-soft', 'ביצה רכה', 'eggs', 'במים רותחים', 5, 6, 'חלמון נוזלי. מכניסים ביצה בטמפרטורת המקרר ומקררים במים קרים.'),
  item('egg-medium', 'ביצה חצי רכה', 'eggs', 'במים רותחים', 7, 8, 'חלמון שמנוני, חלבון מוצק.'),
  item('egg-hard', 'ביצה קשה', 'eggs', 'במים רותחים', 10, 12, 'מקררים מיד במים קרים כדי שהקליפה תתקלף בקלות.', 'egg'),
  item('egg-poached', 'ביצה עלומה', 'eggs', 'במים בעירה קלה', 3, 4, 'מוסיפים כפית חומץ למים.'),
  item('egg-fried', 'ביצת עין', 'eggs', 'במחבת', 3, 4, 'על אש בינונית, מכוסה לחלבון מוצק.'),
  item('egg-scrambled', 'ביצים מקושקשות', 'eggs', 'במחבת', 2, 3, 'מערבבים כל הזמן על אש נמוכה.', 'egg'),
  item('rice-white', 'אורז לבן', 'grains', 'מכוסה, יחס מים 1:2', 15, 18, 'אחרי הבישול מנוחה מכוסה של 5 דקות.'),
  item('rice-basmati', 'אורז בסמטי', 'grains', 'מכוסה, יחס מים 1:1.5', 10, 15, 'שוטפים כמה פעמים עד שהמים צלולים.'),
  item('rice-jasmine', 'אורז יסמין', 'grains', 'מכוסה, יחס מים 1:1.5', 12, 15, 'נשאר דביק מעט.'),
  item('rice-brown', 'אורז מלא', 'grains', 'מכוסה, יחס מים 1:2.5', 40, 45, 'מנוחה של 10 דקות.'),
  item('quinoa', 'קינואה', 'grains', 'מכוסה, יחס מים 1:2', 12, 15, 'שוטפים לפני הבישול כדי להסיר מרירות.'),
  item('buckwheat', 'גריסי כוסמת', 'grains', 'מכוסה, יחס מים 1:2', 10, 12, 'אפשר לקלות במחבת יבשה לפני הבישול.'),
  item('bulgur', 'בורגול גס', 'grains', 'מכוסה, יחס מים 1:2', 10, 15, 'בורגול דק רק מושרים.'),
  item('couscous', 'קוסקוס', 'grains', 'השריה במים רותחים', 5, 5, 'יחס 1:1 ומכסים.'),
  item('ptitim', 'פתיתים', 'grains', 'מכוסה, יחס מים 1:1.5', 8, 10, 'אפשר לטגן קודם בשמן.'),
  item('oats', 'שיבולת שועל', 'grains', 'בסיר עם חלב או מים', 5, 10, 'מערבבים מדי פעם.'),
  item('pearl-barley', 'גריסי פנינה', 'grains', 'במים רותחים', 25, 30, 'מנקזים בסוף.'),
  item('millet', 'דוחן', 'grains', 'מכוסה, יחס מים 1:2', 15, 20, 'מנוחה של 5 דקות.'),
  item('spaghetti', 'ספגטי', 'pasta', 'במים רותחים ומומלחים', 9, 11, 'בודקים כמה דקות לפני הזמן שעל האריזה.'),
  item('penne', 'פנה', 'pasta', 'במים רותחים ומומלחים', 10, 12, 'משאירים מעט מי בישול לרוטב.'),
  item('fusilli', 'פוסילי', 'pasta', 'במים רותחים ומומלחים', 10, 12, 'משאירים מעט מי בישול לרוטב.'),
  item('fettuccine', 'פטוצ׳יני', 'pasta', 'במים רותחים ומומלחים', 8, 10, 'פסטה טרייה לוקחת 2 עד 4 דקות.'),
  item('lasagna', 'דפי לזניה', 'pasta', 'במים רותחים לפני ההרכבה', 10, 12, 'דפים שאינם דורשים בישול קודם אינם צריכים שלב זה.'),
  item('egg-noodles', 'אטריות ביצים', 'pasta', 'במים רותחים', 5, 7, 'מנקזים ושוטפים אם משתמשים בסלט.'),
  item('rice-noodles', 'אטריות אורז', 'pasta', 'השריה במים חמים', 3, 5, 'לפי סוג האטריות, חלקן נשרות בלבד.'),
  item('lentils-green', 'עדשים ירוקות', 'legumes', 'במים רותחים, בלי השריה', 25, 30, 'מוסיפים מלח לקראת הסוף.'),
  item('lentils-orange', 'עדשים כתומות', 'legumes', 'במים רותחים, בלי השריה', 10, 15, 'מתפרקות, טובות למרק.'),
  item('lentils-black', 'עדשים שחורות', 'legumes', 'במים רותחים, בלי השריה', 20, 25, 'שומרות על צורה.'),
  item('chickpeas', 'חומוס יבש', 'legumes', 'אחרי השריה של לילה', 60, 90, 'בלי השריה לוקח הרבה יותר זמן. תוספת של קורט סודה לשתייה מרככת.'),
  item('white-beans', 'שעועית לבנה', 'legumes', 'אחרי השריה של לילה', 60, 90, 'מבשלים עד שהשעועית רכה לגמרי.'),
  item('kidney-beans', 'שעועית אדומה', 'legumes', 'אחרי השריה, ברתיחה חזקה', 60, 90, 'מתחילים ברתיחה חזקה של לפחות 10 דקות.'),
  item('split-peas', 'אפונה יבשה מפוצלת', 'legumes', 'במים רותחים', 30, 45, 'מתפרקת לעיסה, מתאימה למרק.'),
  item('edamame', 'אדממה', 'legumes', 'במים רותחים', 5, 6, 'מגישים עם מלח גס.'),
  item('fava', 'פול יבש', 'legumes', 'אחרי השריה של לילה', 60, 90, 'מבשלים עד שרך.'),
  item('potato-whole', 'תפוח אדמה שלם', 'vegetables', 'במים רותחים', 20, 25, 'תלוי בגודל. בודקים בסכין.'),
  item('potato-cubes', 'תפוחי אדמה בקוביות', 'vegetables', 'במים רותחים', 10, 15, 'מתחילים במים קרים כדי שיתבשלו אחיד.'),
  item('sweet-potato', 'בטטה בקוביות', 'vegetables', 'במים רותחים', 15, 20, 'בתנור שלם לוקח שעה בערך.'),
  item('carrot', 'גזר פרוס', 'vegetables', 'במים רותחים', 5, 8, 'בשלמותו הרבה יותר.'),
  item('broccoli', 'ברוקולי', 'vegetables', 'באדים או במים רותחים', 3, 5, 'מקררים במים קרים לשמירה על הצבע.'),
  item('cauliflower', 'כרובית', 'vegetables', 'במים רותחים', 5, 8, 'פרחים בגודל בינוני.'),
  item('corn', 'תירס בקלח', 'vegetables', 'במים רותחים', 8, 10, 'לא מוסיפים מלח למים בתחילה.'),
  item('green-beans', 'שעועית ירוקה', 'vegetables', 'במים רותחים', 4, 6, 'מקררים במים קרים כדי לעצור את הבישול.'),
  item('green-peas', 'אפונה ירוקה', 'vegetables', 'במים רותחים', 2, 3, 'קפואה צריכה דקה פחות.'),
  item('spinach', 'תרד', 'vegetables', 'באדים או במחבת', 1, 2, 'מתכווץ מאוד.'),
  item('beet', 'סלק שלם', 'vegetables', 'במים רותחים', 40, 60, 'לא קולפים לפני הבישול.'),
  item('pumpkin', 'דלעת בקוביות', 'vegetables', 'במים רותחים', 10, 15, 'בתנור 200 מעלות כ-30 דקות.'),
  item('zucchini', 'קישואים פרוסים', 'vegetables', 'במחבת או באדים', 3, 5, 'לא להגזים, הם נעשים רכים מהר.'),
  item('eggplant', 'חצילים בתנור', 'vegetables', 'בתנור ב-220 מעלות', 30, 40, 'שלם עם ניקוב, עד שהעור מתקמט.'),
  item('mushrooms', 'פטריות מוקפצות', 'vegetables', 'במחבת חמה', 5, 7, 'לא להצפיף במחבת.'),
  item('asparagus', 'אספרגוס', 'vegetables', 'באדים או במים רותחים', 3, 5, 'תלוי בעובי הגבעול.'),
  item('artichoke', 'ארטישוק שלם', 'vegetables', 'במים רותחים', 30, 40, 'מוכן כשעלה תחתון מתנתק בקלות.'),
  item('onion-sauteed', 'בצל מטוגן עד זהוב', 'vegetables', 'במחבת על אש בינונית', 10, 15, 'בצל מקורמל לוקח 30 דקות ויותר.'),
  item('chicken-breast-oven', 'חזה עוף בתנור', 'chicken', 'בתנור ב-200 מעלות', 20, 25, 'תלוי בעובי. מודדים עם מדחום.', 'poultry'),
  item('chicken-breast-pan', 'חזה עוף במחבת', 'chicken', 'במחבת על אש בינונית', 12, 15, 'פרוסות דקות לוקחות 6 עד 8 דקות.', 'poultry'),
  item('chicken-drumsticks', 'שוקיים וכרעיים', 'chicken', 'בתנור ב-200 מעלות', 40, 50, 'העור פריך יותר בלי כיסוי.', 'poultry'),
  item('chicken-thighs', 'ירכיים בלי עצם', 'chicken', 'בתנור ב-200 מעלות', 25, 30, 'מודדים בחלק העבה.', 'poultry'),
  item('chicken-wings', 'כנפיים', 'chicken', 'בתנור ב-200 מעלות', 35, 45, 'הופכים באמצע.', 'poultry'),
  item('chicken-whole', 'עוף שלם, קילו וחצי', 'chicken', 'בתנור ב-190 מעלות', 75, 90, 'מודדים בחלק העבה של הירך, בלי לגעת בעצם.', 'poultry'),
  item('schnitzel', 'שניצל עוף מטוגן', 'chicken', 'בשמן חם', 6, 8, 'בשני הצדדים יחד, בעובי של כ-1 ס״מ.', 'poultry'),
  item('steak', 'סטייק בעובי 2.5 ס״מ', 'meat', 'במחבת חמה מאוד', 4, 8, 'תלוי בעשייה. מנוחה של 3 דקות לפני החיתוך.', 'whole'),
  item('lamb-chops', 'צלעות כבש', 'meat', 'במחבת או בגריל', 8, 12, 'מנוחה של 3 דקות.', 'whole'),
  item('beef-roast', 'צלי בקר, קילו וחצי', 'meat', 'בתנור ב-160 מעלות', 90, 120, 'מנוחה של 3 דקות לפחות לפני החיתוך.', 'whole'),
  item('hamburger', 'המבורגר', 'meat', 'במחבת או בגריל', 8, 12, 'מבשלים עד שאין חלק ורוד, ומודדים במרכז.', 'ground'),
  item('meatballs', 'קציצות', 'meat', 'במחבת', 10, 12, 'בשר טחון צריך להיות עשוי עד הסוף.', 'ground'),
  item('kebab', 'קבב ושיפודי בשר טחון', 'meat', 'בגריל', 8, 12, 'מהפכים פעם אחת.', 'ground'),
  item('beef-brisket', 'חזה בקר בבישול ארוך', 'meat', 'בסיר או בתנור מכוסה', 150, 180, 'בישול ארוך מרכך את הבשר, ולכן אפשר לעבור את הטמפרטורה המינימלית.'),
  item('salmon', 'סלמון בתנור', 'fish', 'בתנור ב-200 מעלות', 12, 15, 'פילה בעובי של 3 ס״מ.', 'fish'),
  item('fish-fillet-pan', 'פילה דג במחבת', 'fish', 'במחבת על אש בינונית', 6, 8, 'בשני הצדדים יחד.', 'fish'),
  item('whole-fish', 'דג שלם בתנור', 'fish', 'בתנור ב-200 מעלות', 25, 35, 'תלוי בגודל הדג.', 'fish'),
  item('tuna-steak', 'סטייק טונה', 'fish', 'במחבת חמה מאוד', 3, 4, 'במרכז נשאר ורוד אם מבשלים כך. לעשייה מלאה מבשלים עד טמפרטורה של 63 מעלות.', 'fish'),
]

export function formatMinutes(min: number, max: number): string {
  return min === max ? `${min} דק׳` : `${min} עד ${max} דק׳`
}

export function formatClock(milliseconds: number): string {
  const total = Math.max(0, Math.ceil(milliseconds / 1000))
  const minutes = Math.floor(total / 60)
  const seconds = total % 60
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
}

export function filterItems(query: string, category: CookingCategory | 'all'): CookingItem[] {
  const needle = query.trim()
  return cookingItems.filter((entry) => {
    if (category !== 'all' && entry.category !== category) return false
    return !needle || entry.name.includes(needle) || entry.method.includes(needle)
  })
}

export const SAFE_SOURCES = [
  {
    label: 'USDA FSIS: Safe Minimum Internal Temperature Chart',
    href: 'https://www.fsis.usda.gov/food-safety/safe-food-handling-and-preparation/food-safety-basics/safe-temperature-chart',
  },
  {
    label: 'FoodSafety.gov: Safe Minimum Cooking Temperatures',
    href: 'https://www.foodsafety.gov/food-safety-charts/safe-minimum-cooking-temperature',
  },
]
