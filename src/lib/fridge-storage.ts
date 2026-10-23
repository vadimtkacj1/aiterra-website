export const FRIDGE_CHECKED = '2026-10-23'
export const FRIDGE_CHECKED_LABEL = '23.10.2026'

export type SourceKey = 'chart' | 'fk' | 'moh'
export type SourceId = SourceKey | 'fda'

export type FridgeSource = {
  label: string
  href: string
}

export const fridgeSources: Record<SourceId, FridgeSource> = {
  chart: {
    label: 'FoodSafety.gov (משרד הבריאות האמריקאי): Cold Food Storage Chart, נבדק לאחרונה בידי הגוף ב-19.9.2023',
    href: 'https://www.foodsafety.gov/food-safety-charts/cold-food-storage-charts',
  },
  fk: {
    label: 'USDA FSIS: נתוני FoodKeeper, גרסה 128 (מעל 650 מוצרים)',
    href: 'https://www.foodsafety.gov/keep-food-safe/foodkeeper-app',
  },
  moh: {
    label: 'משרד הבריאות: אחסון חלב אם, הפשרת חלב אם והקפאה',
    href: 'https://me.health.gov.il/parenting/raising-children/baby-nutrition/pumping-breast-milk/store-thaw-breast-milk/',
  },
  fda: {
    label: 'FDA: Are You Storing Food Safely? (כלל השעתיים וטמפרטורות המקרר והמקפיא)',
    href: 'https://www.fda.gov/consumers/consumer-updates/are-you-storing-food-safely',
  },
}

export const usedSourceKeys: SourceId[] = ['chart', 'fk', 'moh', 'fda']

export type FridgeGroupId = 'eggs' | 'dairy' | 'meat' | 'fish' | 'leftovers' | 'salads' | 'sauces' | 'baby' | 'grains'

export const fridgeGroups: { id: FridgeGroupId; label: string }[] = [
  { id: 'eggs', label: 'ביצים' },
  { id: 'dairy', label: 'חלב וגבינות' },
  { id: 'meat', label: 'בשר ועוף' },
  { id: 'fish', label: 'דגים ופירות ים' },
  { id: 'leftovers', label: 'אוכל מבושל ושאריות' },
  { id: 'salads', label: 'סלטים ומטבלים' },
  { id: 'sauces', label: 'רטבים, ממרחים ותבלינים' },
  { id: 'baby', label: 'אוכל תינוקות' },
  { id: 'grains', label: 'דגנים, לחם וטופו' },
]

export type FridgeRow = {
  group: FridgeGroupId
  name: string
  fridge: string
  freezer: string
  room: string
  source: SourceKey
  fkId?: number
  note?: string
}

const TWO_HOURS = 'עד שעתיים'
const NO_FREEZE = 'לא מומלץ'
const NO_DATA = 'אין נתון'

const chart = (group: FridgeGroupId, name: string, fridge: string, freezer: string, note?: string): FridgeRow => ({
  group,
  name,
  fridge,
  freezer,
  room: TWO_HOURS,
  source: 'chart',
  note,
})

const fk = (
  group: FridgeGroupId,
  fkId: number,
  name: string,
  fridge: string,
  freezer: string,
  room: string = TWO_HOURS,
  note?: string,
): FridgeRow => ({ group, name, fridge, freezer, room, source: 'fk', fkId, note })

export const fridgeRows: FridgeRow[] = [
  chart('eggs', 'ביצה בקליפה, חיה', '3 עד 5 שבועות', 'לא להקפיא בקליפה. אפשר להקפיא מוקצפת', 'להקפאה מקציפים חלמון וחלבון יחד.'),
  chart('eggs', 'חלמון או חלבון חיים, מחוץ לקליפה', '2 עד 4 ימים', '12 חודשים', 'חלמונים לבדם לא מתקפאים טוב.'),
  chart('eggs', 'ביצה קשה', 'שבוע', NO_FREEZE),
  chart('eggs', 'קיש או פשטידה עם ביצים, אחרי אפייה', '3 עד 5 ימים', '2 עד 3 חודשים'),
  fk('eggs', 24, 'מאכלי ביצים אפויים', '3 עד 4 ימים', '2 עד 3 חודשים'),
  chart('eggs', 'סלט ביצים', '3 עד 4 ימים', NO_FREEZE),

  fk('dairy', 27, 'חלב, רגיל או בטעמים', 'לפי התאריך על האריזה', '3 חודשים'),
  fk('dairy', 543, 'חלב דל לקטוז, אחרי פתיחה', 'שבוע', NO_FREEZE),
  fk('dairy', 3, 'גבינה קשה (צ׳דר, גאודה, פרמזן בגוש)', 'סגורה: עד 6 חודשים. פתוחה: 3 עד 4 שבועות', '6 חודשים'),
  fk('dairy', 5, 'גבינה צהובה מגוררת', 'חודש', '3 עד 4 חודשים'),
  fk('dairy', 6, 'גבינה צהובה בפרוסות', '3 עד 4 שבועות', NO_FREEZE),
  fk('dairy', 7, 'גבינה רכה (ברי, עיזים)', '1 עד 2 שבועות', '6 חודשים'),
  fk('dairy', 9, 'קוטג׳', 'סגור: שבועיים. פתוח: שבוע', NO_FREEZE),
  fk('dairy', 10, 'גבינת שמנת', 'שבועיים', NO_FREEZE),
  fk('dairy', 490, 'ריקוטה', 'סגורה: שבועיים. פתוחה: שבוע', NO_FREEZE),
  fk('dairy', 546, 'קוורק, גבינה טרייה', '7 עד 10 ימים', NO_DATA),
  fk('dairy', 33, 'יוגורט', '1 עד 2 שבועות', '1 עד 2 חודשים'),
  fk('dairy', 25, 'קפיר', 'סגור: שבוע. פתוח: 1 עד 2 ימים', NO_FREEZE),
  fk('dairy', 2, 'באטרמילק', '1 עד 2 שבועות', '3 חודשים'),
  fk('dairy', 14, 'שמנת מתוקה (30% ומעלה)', '10 ימים', '3 עד 4 חודשים'),
  fk('dairy', 11, 'שמנת לקצפת מפוסטרת בחום גבוה', 'סגורה: חודש. פתוחה: שבוע', NO_FREEZE),
  fk('dairy', 29, 'שמנת חמוצה', 'לפי התאריך על האריזה', NO_FREEZE),
  fk('dairy', 1, 'חמאה', '1 עד 2 חודשים', '6 עד 9 חודשים'),
  fk('dairy', 26, 'מרגרינה', '6 חודשים', '12 חודשים'),
  fk('dairy', 28, 'פודינג מוכן, אחרי פתיחה', 'יומיים', NO_FREEZE),
  fk('dairy', 421, 'משקה סויה, שקדים, אורז או קוקוס, אחרי פתיחה', '7 עד 10 ימים', NO_DATA),

  chart('meat', 'עוף או הודו שלמים, חיים', '1 עד 2 ימים', 'שנה'),
  chart('meat', 'חלקי עוף או הודו, חיים (חזה, שוקיים)', '1 עד 2 ימים', '9 חודשים'),
  chart('meat', 'בשר טחון ועוף טחון, חיים', '1 עד 2 ימים', '3 עד 4 חודשים'),
  chart('meat', 'סטייק, צלי או צלעות בקר וכבש, חיים', '3 עד 5 ימים', '4 עד 12 חודשים'),
  fk('meat', 130, 'כבד, לבבות וקורקבנים של עוף, חיים', '1 עד 2 ימים', '3 עד 4 חודשים'),
  chart('meat', 'בשר או עוף מבושלים', '3 עד 4 ימים', '2 עד 6 חודשים'),
  fk('meat', 186, 'בשר או עוף מבושלים ברוטב או במרק', '3 עד 4 ימים', '6 חודשים'),
  fk('meat', 141, 'עוף צלוי מוכן (רוטיסרי)', '3 עד 4 ימים', '4 חודשים'),
  fk('meat', 136, 'עוף מטוגן', '3 עד 4 ימים', '4 חודשים'),
  chart('meat', 'שניצל או נאגטס מבושלים', '3 עד 4 ימים', '1 עד 3 חודשים'),
  chart('meat', 'נקניקיות', 'פתוחה: שבוע. סגורה: שבועיים', '1 עד 2 חודשים'),
  chart('meat', 'נקניק פרוס או פסטרמה, אריזה פתוחה או פרוסה בדלפק', '3 עד 5 ימים', '1 עד 2 חודשים'),
  fk('meat', 192, 'נקניק פרוס באריזה סגורה', 'סגורה: שבועיים. פתוחה: 3 עד 5 ימים', '1 עד 2 חודשים'),
  chart('meat', 'בייקון', 'שבוע', 'חודש'),
  chart('meat', 'נקניקיות חיות (מבשר עוף, הודו, חזיר או בקר)', '1 עד 2 ימים', '1 עד 2 חודשים'),
  chart('meat', 'נקניקיות מבושלות מראש', 'שבוע', '1 עד 2 חודשים'),

  chart('fish', 'דג שמן (בורי, מקרל, סלמון, טונה)', '1 עד 3 ימים', '2 עד 3 חודשים'),
  chart('fish', 'דג רזה (בקלה, הליבוט, סול, פלונדר)', '1 עד 3 ימים', '6 עד 8 חודשים'),
  fk('fish', 148, 'דג מבושל', '3 עד 4 ימים', '1 עד 2 חודשים'),
  chart('fish', 'שרימפס', '3 עד 5 ימים', '6 עד 18 חודשים'),
  chart('fish', 'קלמארי', '1 עד 3 ימים', '6 עד 18 חודשים'),
  chart('fish', 'בשר סרטן טרי', '2 עד 4 ימים', '2 עד 4 חודשים'),
  chart('fish', 'צדפות, מולים ואויסטרס מוסרים מהקונכייה', '3 עד 10 ימים', '3 עד 4 חודשים'),
  fk('fish', 162, 'פירות ים מבושלים', '3 עד 4 ימים', '1 עד 3 חודשים'),
  fk('fish', 166, 'דג מעושן קר (למשל סלמון מעושן), אריזה רגילה', '14 עד 30 ימים מהרכישה', '9 עד 12 חודשים'),
  fk('fish', 619, 'דג משומר (טונה, סרדינים), אחרי פתיחה', '1 עד 2 ימים', NO_DATA),

  fk('leftovers', 178, 'אורז מבושל', '4 עד 6 ימים', '6 חודשים', TWO_HOURS, 'טבלת FoodSafety.gov קובעת לשאריות בכלל 3 עד 4 ימים. כדאי להישאר בקצה הנמוך.'),
  fk('leftovers', 177, 'פסטה מבושלת', '3 עד 5 ימים', '1 עד 2 חודשים'),
  fk('leftovers', 332, 'פסטה טרייה, לא מבושלת', '1 עד 2 ימים', '2 חודשים'),
  fk('leftovers', 426, 'קינואה מבושלת', '6 עד 7 ימים', '6 עד 12 חודשים'),
  fk('leftovers', 174, 'שאריות בלי בשר, דג, עוף או ביצה (ירקות, אורז, תפוחי אדמה)', '3 עד 4 ימים', '1 עד 2 חודשים'),
  fk('leftovers', 173, 'שאריות עם בשר, דג, עוף או ביצה', '3 עד 4 ימים', '2 עד 3 חודשים'),
  chart('leftovers', 'מרק ותבשיל עם ירקות או בשר', '3 עד 4 ימים', '2 עד 3 חודשים'),
  fk('leftovers', 484, 'ציר עוף או בשר ביתי', '3 עד 4 ימים', '2 עד 3 חודשים'),
  fk('leftovers', 486, 'ציר מוכן מקופסה, אחרי פתיחה', '3 עד 4 ימים', '2 עד 3 חודשים'),
  chart('leftovers', 'פיצה', '3 עד 4 ימים', '1 עד 2 חודשים'),
  fk('leftovers', 185, 'ארוחה מוכנה, חמה או קרה', '3 עד 4 ימים', '2 עד 3 חודשים'),
  fk('leftovers', 667, 'קוגל ביתי', '3 עד 4 ימים', 'חודש'),
  fk('leftovers', 179, 'פירות חתוכים', '4 ימים', NO_FREEZE),
  fk('leftovers', 526, 'שמן שטיגנו בו ושומרים לשימוש חוזר', 'חודש', '6 עד 9 חודשים'),

  fk('salads', 191, 'סלט תפוחי אדמה', '3 עד 5 ימים', NO_FREEZE),
  fk('salads', 420, 'סלט פסטה', '3 עד 5 ימים', NO_FREEZE),
  fk('salads', 418, 'סלט עוף', '3 עד 4 ימים', NO_FREEZE),
  fk('salads', 417, 'סלט טונה או סלט פירות ים', '3 עד 4 ימים', NO_FREEZE),
  fk('salads', 603, 'סלט כרוב (קולסלאו) ביתי', '3 עד 5 ימים', NO_DATA),
  fk('salads', 183, 'חומוס ביתי, בלי חומרים משמרים', '7 ימים', NO_FREEZE),
  fk('salads', 181, 'חומוס מסחרי מפוסטר', 'סגור: עד 3 חודשים מהרכישה. פתוח: 7 ימים', NO_FREEZE),
  fk('salads', 180, 'גוואקמולי', '3 עד 4 ימים', '3 עד 4 חודשים'),
  fk('salads', 572, 'סלסה טרייה', '4 עד 7 ימים', NO_DATA),
  fk('salads', 187, 'זיתים מהדוכן', 'שבועיים', NO_FREEZE),

  fk('sauces', 416, 'טחינה גולמית', 'אחרי פתיחה: 3 שבועות', NO_DATA, 'סגורה: עד שנה במזווה'),
  fk('sauces', 354, 'פסטו בצנצנת', 'סגור: 6 חודשים. פתוח: 3 ימים', 'חודש'),
  fk('sauces', 350, 'מיונז מסחרי', 'אחרי פתיחה: חודשיים', NO_DATA, 'סגור: 3 עד 6 חודשים במזווה'),
  fk('sauces', 348, 'קטשופ', 'אחרי פתיחה: 6 חודשים', NO_DATA, 'סגור: שנה במזווה'),
  fk('sauces', 351, 'חרדל', 'אחרי פתיחה: שנה', NO_DATA, 'סגור: 1 עד 2 שנים במזווה'),
  fk('sauces', 359, 'רוטב עגבניות או ספגטי בצנצנת', 'אחרי פתיחה: 4 ימים', NO_DATA, 'סגור: 18 חודשים במזווה'),
  fk('sauces', 360, 'רוטב סויה או טריאקי', 'אחרי פתיחה: חודש', NO_DATA, 'סגור: 3 שנים במזווה'),
  fk('sauces', 356, 'רוטב סלט מבקבוק', 'אחרי פתיחה: 1 עד 3 חודשים', NO_DATA, 'סגור: 10 עד 12 חודשים במזווה'),
  fk('sauces', 347, 'ריבה וממרחי פירות', 'אחרי פתיחה: 6 עד 12 חודשים', NO_DATA, 'סגורה: 6 עד 18 חודשים במזווה'),
  fk('sauces', 353, 'מלפפונים חמוצים', 'אחרי פתיחה: 1 עד 3 חודשים', NO_DATA, 'סגורים: שנה במזווה'),
  fk('sauces', 352, 'זיתים בצנצנת', 'אחרי פתיחה: שבועיים', NO_DATA, 'סגורים: 12 עד 18 חודשים במזווה'),
  fk('sauces', 345, 'דבש', NO_DATA, NO_DATA, 'שנתיים במזווה'),
  fk('sauces', 649, 'גהי (חמאה מזוקקת)', '1 עד 2 שנים', NO_DATA, '6 עד 8 חודשים במזווה'),
  fk('sauces', 357, 'סלסה בצנצנת', 'אחרי פתיחה: חודש', NO_DATA, 'סגורה: שנה במזווה'),

  {
    group: 'baby',
    name: 'חלב אם שאוב',
    fridge: '3 ימים, בחלק האחורי של המקרר',
    freezer: 'מקפיא בתוך המקרר: שבועיים. מקפיא נפרד: 3 עד 4 חודשים. הקפאה עמוקה במינוס 18: 6 עד 12 חודשים',
    room: '3 עד 4 שעות, ועד 6 שעות בטמפרטורה עד 29 מעלות',
    source: 'moh',
    note: 'חלב שהוקפא והופשר במקרר צריך להישתמש בו תוך 24 שעות מההפשרה.',
  },
  fk('baby', 364, 'מחית פירות לתינוקות, אחרי פתיחה', '3 ימים', NO_DATA),
  fk('baby', 365, 'מחית ירקות לתינוקות, אחרי פתיחה', 'יומיים', NO_DATA),
  fk('baby', 366, 'ארוחת תינוקות מוכנה, אחרי פתיחה', 'יומיים', NO_DATA),
  fk('baby', 368, 'תמ״ל אחרי ההכנה', 'יום אחד', NO_DATA, 'שעה אחת'),
  fk('baby', 369, 'תמ״ל נוזלי מוכן לשתייה, אחרי פתיחה', 'יומיים', NO_DATA),
  fk('baby', 367, 'דייסת תינוקות יבשה, אחרי פתיחה', NO_DATA, NO_DATA, 'חודש במזווה'),

  fk('grains', 460, 'לחם מלא', NO_DATA, '3 חודשים', '3 עד 5 ימים'),
  fk('grains', 168, 'טופו סגור', 'שבוע מהרכישה', '5 חודשים'),
  fk('grains', 338, 'אורז לבן יבש', NO_DATA, NO_DATA, 'סגור: שנתיים. פתוח: שנה'),
]

const NIQQUD = /[֑-ׇ]/g
const QUOTES = /[׳״"'`]/g

export const normalizeQuery = (value: string) =>
  value.replace(NIQQUD, '').replace(QUOTES, '').replace(/\s+/g, ' ').trim().toLowerCase()

export const rowMatches = (row: FridgeRow, query: string) => {
  const needle = normalizeQuery(query)
  return needle === '' || normalizeQuery(row.name).includes(needle)
}

export const sourceLink = (row: FridgeRow) =>
  row.source === 'chart'
    ? { text: 'FoodSafety.gov', href: fridgeSources.chart.href }
    : row.source === 'moh'
      ? { text: 'Ministry of Health', href: fridgeSources.moh.href }
      : { text: `FoodKeeper ${row.fkId}`, href: fridgeSources.fk.href }
