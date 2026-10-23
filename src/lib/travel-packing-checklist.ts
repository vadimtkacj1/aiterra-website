export type TripKind = 'beach' | 'city' | 'hiking' | 'ski' | 'business'
export type Weather = 'hot' | 'mild' | 'cold'

export type PackingSettings = {
  trip: TripKind
  weather: Weather
  days: number
  rain: boolean
  kids: boolean
  baby: boolean
  laundry: boolean
}

export type PackingItem = { id: string; label: string }
export type PackingGroup = { id: string; title: string; items: PackingItem[] }
export type CustomItem = { id: string; label: string }

export type SavedState = {
  settings: PackingSettings
  checked: string[]
  custom: CustomItem[]
}

export const STORAGE_KEY = 'aiterra-packing-checklist-v1'
export const MIN_DAYS = 1
export const MAX_DAYS = 60

export const defaultSettings: PackingSettings = {
  trip: 'city',
  weather: 'mild',
  days: 7,
  rain: false,
  kids: false,
  baby: false,
  laundry: false,
}

export const trips: { id: TripKind; label: string; hint: string }[] = [
  { id: 'city', label: 'עיר וטיולים', hint: 'הליכה, מוזיאונים, אוכל' },
  { id: 'beach', label: 'חוף ונופש', hint: 'מלון, ים ובריכה' },
  { id: 'hiking', label: 'טרק וטבע', hint: 'שבילים ולינה בשטח' },
  { id: 'ski', label: 'סקי', hint: 'חורף והרים' },
  { id: 'business', label: 'עסקים', hint: 'פגישות וכנס' },
]

export const weathers: { id: Weather; label: string; hint: string }[] = [
  { id: 'hot', label: 'חם', hint: 'קיץ או אקלים טרופי' },
  { id: 'mild', label: 'נעים', hint: 'אביב, סתיו' },
  { id: 'cold', label: 'קר', hint: 'חורף' },
]

export const clampDays = (value: number) =>
  Number.isFinite(value) ? Math.min(MAX_DAYS, Math.max(MIN_DAYS, Math.floor(value))) : defaultSettings.days

const plural = (count: number, one: string, many: string) => (count === 1 ? one : `${count} ${many}`)

const clothesCount = (days: number, laundry: boolean, cap: number, lowCap: number) =>
  Math.min(days + 1, laundry ? lowCap : cap)

export const buildChecklist = (settings: PackingSettings): PackingGroup[] => {
  const days = clampDays(settings.days)
  const { trip, weather, laundry } = settings
  const underwear = clothesCount(days, laundry, 14, 7)
  const tops = Math.min(days, laundry ? 5 : 10)
  const bottoms = laundry ? 2 : Math.min(Math.ceil(days / 3) + 1, 5)

  const documents: PackingItem[] = [
    { id: 'doc-passport', label: 'דרכון (בדקו את תוקפו ואת דרישות הכניסה ליעד)' },
    { id: 'doc-tickets', label: 'כרטיסי טיסה או כרטיסי עלייה למטוס' },
    { id: 'doc-hotel', label: 'אישורי הזמנת מלון או דירה' },
    { id: 'doc-insurance', label: 'ביטוח נסיעות ופרטי הפוליסה' },
    { id: 'doc-cards', label: 'כרטיסי אשראי' },
    { id: 'doc-cash', label: 'מזומן במטבע של היעד' },
    { id: 'doc-copies', label: 'עותקים דיגיטליים של הדרכון והאישורים' },
  ]
  if (trip === 'business') documents.push({ id: 'doc-business', label: 'כרטיסי ביקור ומסמכי הפגישות' })

  const electronics: PackingItem[] = [
    { id: 'el-phone', label: 'טלפון ומטען' },
    { id: 'el-adapter', label: 'מתאם לשקע החשמל של היעד' },
    { id: 'el-powerbank', label: 'סוללה ניידת' },
    { id: 'el-headphones', label: 'אוזניות' },
  ]
  if (trip === 'business') electronics.push({ id: 'el-laptop', label: 'מחשב נייד ומטען' })
  if (trip === 'city' || trip === 'beach') electronics.push({ id: 'el-camera', label: 'מצלמה או כרטיס זיכרון פנוי בטלפון' })

  const toiletries: PackingItem[] = [
    { id: 'toi-brush', label: 'מברשת ומשחת שיניים' },
    { id: 'toi-deodorant', label: 'דאודורנט' },
    { id: 'toi-shampoo', label: 'שמפו וסבון בבקבוקים קטנים' },
    { id: 'toi-comb', label: 'מסרק או מברשת שיער' },
    { id: 'toi-razor', label: 'סכין גילוח' },
    { id: 'toi-liquids', label: 'נוזלים לתיק היד בבקבוקים קטנים (בדקו את המגבלה של חברת התעופה)' },
  ]

  const health: PackingItem[] = [
    { id: 'health-meds', label: 'תרופות אישיות ועותק מהמרשם' },
    { id: 'health-pain', label: 'משכך כאבים' },
    { id: 'health-plasters', label: 'פלסטרים' },
    { id: 'health-sanitizer', label: 'חומר חיטוי לידיים' },
    { id: 'health-sunscreen', label: 'קרם הגנה' },
  ]
  if (trip === 'hiking') health.push({ id: 'health-blister', label: 'פלסטרים נגד שפשופים ותחבושות' })
  if (trip === 'ski') health.push({ id: 'health-lip', label: 'משחה לשפתיים וקרם לחות' })

  const clothes: PackingItem[] = [
    { id: 'cl-underwear', label: `${plural(underwear, 'תחתון אחד', 'תחתונים')}` },
    { id: 'cl-socks', label: `${plural(underwear, 'זוג גרביים', 'זוגות גרביים')}` },
    { id: 'cl-tops', label: `${plural(tops, 'חולצה אחת', 'חולצות')}` },
    { id: 'cl-bottoms', label: `${plural(bottoms, 'מכנס אחד', 'מכנסיים או חצאיות')}` },
    { id: 'cl-sleepwear', label: 'בגדי שינה' },
    { id: 'cl-shoes', label: 'נעליים נוחות להליכה' },
  ]
  if (weather === 'hot') {
    clothes.push(
      { id: 'cl-shorts', label: 'מכנסיים קצרים' },
      { id: 'cl-sandals', label: 'סנדלים' },
      { id: 'cl-hat', label: 'כובע שמש ומשקפי שמש' },
    )
  }
  if (weather === 'mild') {
    clothes.push(
      { id: 'cl-light-jacket', label: 'ג׳קט או סוודר קל' },
      { id: 'cl-long-pants', label: 'מכנסיים ארוכים' },
    )
  }
  if (weather === 'cold') {
    clothes.push(
      { id: 'cl-coat', label: 'מעיל חם' },
      { id: 'cl-sweaters', label: 'סוודרים או שכבות תרמיות' },
      { id: 'cl-winter-accessories', label: 'כובע, צעיף וכפפות' },
    )
  }
  if (settings.rain) {
    clothes.push({ id: 'cl-rain', label: 'מעיל גשם או מטרייה קטנה' })
  }

  const special: PackingItem[] = []
  if (trip === 'beach') {
    special.push(
      { id: 'sp-swimsuit', label: 'בגדי ים (שניים להחלפה)' },
      { id: 'sp-towel', label: 'מגבת חוף' },
      { id: 'sp-flipflops', label: 'כפכפים' },
      { id: 'sp-aftersun', label: 'קרם לחות אחרי שמש' },
    )
  }
  if (trip === 'city') {
    special.push(
      { id: 'sp-daypack', label: 'תיק גב קטן ליום' },
      { id: 'sp-maps', label: 'מפות לא מקוונות בטלפון' },
      { id: 'sp-bottle', label: 'בקבוק מים לשימוש חוזר' },
    )
  }
  if (trip === 'hiking') {
    special.push(
      { id: 'sp-boots', label: 'נעלי הליכה שכבר הלכתם בהן' },
      { id: 'sp-pack', label: 'תרמיל מתאים' },
      { id: 'sp-bottle', label: 'בקבוק מים או שק שתייה' },
      { id: 'sp-flashlight', label: 'פנס ראש וסוללות' },
      { id: 'sp-snacks', label: 'חטיפי אנרגיה' },
    )
  }
  if (trip === 'ski') {
    special.push(
      { id: 'sp-ski-jacket', label: 'מעיל סקי ומכנסי סקי' },
      { id: 'sp-ski-gloves', label: 'כפפות סקי' },
      { id: 'sp-goggles', label: 'משקפי סקי' },
      { id: 'sp-thermal', label: 'שכבה תרמית תחתונה' },
      { id: 'sp-ski-pass', label: 'אישורי הרכבל וציוד שכור' },
    )
  }
  if (trip === 'business') {
    special.push(
      { id: 'sp-formal', label: 'בגדים רשמיים לפגישות' },
      { id: 'sp-formal-shoes', label: 'נעליים רשמיות' },
      { id: 'sp-iron', label: 'כיסוי לחליפה או לשמלה' },
    )
  }

  const kids: PackingItem[] = []
  if (settings.kids) {
    kids.push(
      { id: 'kid-clothes', label: 'בגדים להחלפה לכל ילד, יותר מהרגיל' },
      { id: 'kid-snacks', label: 'חטיפים לטיסה ולדרך' },
      { id: 'kid-entertainment', label: 'משחקים, ספרים או טאבלט עם הורדות' },
      { id: 'kid-meds', label: 'תרופות לילדים ומדחום' },
      { id: 'kid-docs', label: 'דרכונים לכל הילדים' },
    )
  }
  if (settings.baby) {
    kids.push(
      { id: 'baby-diapers', label: 'חיתולים ומגבונים' },
      { id: 'baby-food', label: 'מזון לתינוק או תמ״ל ובקבוקים' },
      { id: 'baby-carrier', label: 'מנשא או עגלה מתקפלת' },
      { id: 'baby-blanket', label: 'שמיכה ותחתיות להחתלה' },
      { id: 'baby-pacifier', label: 'מוצצים וצעצוע אהוב' },
    )
  }

  const flight: PackingItem[] = [
    { id: 'fl-pillow', label: 'כרית צוואר' },
    { id: 'fl-book', label: 'ספר או הורדות לטלפון' },
    { id: 'fl-pen', label: 'עט לטופסי הגירה' },
    { id: 'fl-clothes', label: 'חולצה להחלפה בתיק היד' },
  ]

  const home: PackingItem[] = [
    { id: 'home-trash', label: 'להוציא אשפה ולסגור מים וגז' },
    { id: 'home-plants', label: 'לבקש שישקו עציצים' },
    { id: 'home-lock', label: 'לנעול ולבדוק שהחלונות סגורים' },
    { id: 'home-contact', label: 'להשאיר לקרוב משפחה את מסלול הנסיעה' },
  ]

  const groups: PackingGroup[] = [
    { id: 'documents', title: 'מסמכים וכסף', items: documents },
    { id: 'clothes', title: 'בגדים', items: clothes },
    { id: 'special', title: 'ציוד לסוג הנסיעה', items: special },
    { id: 'toiletries', title: 'טואלטיקה', items: toiletries },
    { id: 'health', title: 'בריאות', items: health },
    { id: 'electronics', title: 'אלקטרוניקה', items: electronics },
    { id: 'kids', title: 'ילדים ותינוקות', items: kids },
    { id: 'flight', title: 'בתיק היד לטיסה', items: flight },
    { id: 'home', title: 'לפני היציאה מהבית', items: home },
  ]
  return groups.filter((group) => group.items.length > 0)
}

export const totalItems = (groups: PackingGroup[], custom: CustomItem[]) =>
  groups.reduce((sum, group) => sum + group.items.length, 0) + custom.length

export const checkedCount = (groups: PackingGroup[], custom: CustomItem[], checked: string[]) => {
  const ids = new Set(checked)
  const standard = groups.reduce((sum, group) => sum + group.items.filter((item) => ids.has(item.id)).length, 0)
  return standard + custom.filter((item) => ids.has(item.id)).length
}

export const sanitizeSaved = (raw: unknown): SavedState | null => {
  if (typeof raw !== 'object' || raw === null) return null
  const value = raw as Partial<SavedState>
  const settings = { ...defaultSettings, ...(value.settings ?? {}) }
  settings.days = clampDays(Number(settings.days))
  const tripIds: string[] = trips.map((trip) => trip.id)
  const weatherIds: string[] = weathers.map((weather) => weather.id)
  if (!tripIds.includes(settings.trip)) settings.trip = defaultSettings.trip
  if (!weatherIds.includes(settings.weather)) settings.weather = defaultSettings.weather
  const checked = Array.isArray(value.checked) ? value.checked.filter((id): id is string => typeof id === 'string') : []
  const custom = Array.isArray(value.custom)
    ? value.custom.filter(
        (item): item is CustomItem => typeof item?.id === 'string' && typeof item?.label === 'string',
      )
    : []
  return { settings, checked, custom }
}

const escapeHtml = (value: string) =>
  value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

export const buildPrintHtml = (groups: PackingGroup[], custom: CustomItem[], checked: string[]) => {
  const ids = new Set(checked)
  const mark = (id: string) => (ids.has(id) ? '&#9745;' : '&#9744;')
  const sections = groups
    .map(
      (group) =>
        `<section><h2>${escapeHtml(group.title)}</h2><ul>${group.items
          .map((item) => `<li><span class="box">${mark(item.id)}</span>${escapeHtml(item.label)}</li>`)
          .join('')}</ul></section>`,
    )
    .join('')
  const own = custom.length
    ? `<section><h2>שלי</h2><ul>${custom
        .map((item) => `<li><span class="box">${mark(item.id)}</span>${escapeHtml(item.label)}</li>`)
        .join('')}</ul></section>`
    : ''
  const css =
    '@page{size:A4;margin:12mm}html,body{margin:0;padding:0}body{font-family:Arial,Helvetica,sans-serif;color:#111;font-size:11pt}h1{font-size:18pt;margin:0 0 6mm}h2{font-size:12pt;margin:0 0 2mm;border-bottom:1px solid #999}section{break-inside:avoid;margin:0 0 5mm}ul{list-style:none;margin:0;padding:0;columns:2;column-gap:8mm}li{margin:0 0 1.5mm;break-inside:avoid}.box{display:inline-block;width:6mm;font-size:13pt}'
  return `<!doctype html><html lang="he" dir="rtl"><head><meta charset="utf-8"><title>רשימת אריזה</title><style>${css}</style></head><body><h1>רשימת אריזה</h1>${sections}${own}</body></html>`
}
