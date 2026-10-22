export type SiteType = 'brochure' | 'store' | 'booking' | 'catalog' | 'landing' | 'system'
export type Goal = 'leads' | 'sales' | 'bookings' | 'info'
export type Platform = 'none' | 'wordpress' | 'wix' | 'shopify' | 'code'
export type Editor = 'self' | 'agency'
export type CopyBy = 'owner' | 'agency' | 'mixed'
export type Photos = 'own' | 'shoot' | 'stock' | 'mixed'
export type Brand = 'guide' | 'logo' | 'none'
export type DomainStatus = 'have' | 'need'
export type Hosting = 'agency' | 'own' | 'platform' | 'unsure'
export type Maintenance = 'monthly' | 'ondemand' | 'self'

export type SpecPage = { name: string; purpose: string }
export type SpecReference = { url: string; note: string }

export type SpecInput = {
  businessName: string
  about: string
  currentSite: string
  contactName: string
  contactPhone: string
  contactEmail: string
  date: string
  goal: Goal | ''
  successMetric: string
  audience: string
  siteType: SiteType
  platform: Platform | ''
  editor: Editor | ''
  pages: SpecPage[]
  pagesEdited: boolean
  languages: string[]
  copyBy: CopyBy | ''
  photos: Photos | ''
  brand: Brand | ''
  contentNotes: string
  features: string[]
  paymentProvider: string
  invoiceSystem: string
  crmName: string
  featureNotes: string
  legalReady: string[]
  tracking: string[]
  keywords: string
  domain: DomainStatus | ''
  domainName: string
  hosting: Hosting | ''
  maintenance: Maintenance | ''
  budget: string
  deadline: string
  references: SpecReference[]
  credit: boolean
}

export type SpecChoice<T extends string> = { id: T; label: string; hint?: string; text: string }

export type SpecInline = string | { text: string; href: string }

export type SpecBlock =
  | { kind: 'title'; text: string }
  | { kind: 'meta'; items: string[] }
  | { kind: 'intro'; text: string }
  | { kind: 'heading'; text: string }
  | { kind: 'clause'; number: string; parts: SpecInline[] }
  | { kind: 'list'; items: SpecInline[][] }
  | { kind: 'table'; head: string[]; rows: string[][] }
  | { kind: 'credit'; text: string; linkText: string; href: string }

export type SpecCheck = { id: string; label: string; note: string; done: boolean }

export const GENERATOR_URL = 'https://www.aiterra.co.il/tools/website-spec-template'

export const MAX_PAGES = 30
export const MAX_REFERENCES = 6

export const siteTypes: SpecChoice<SiteType>[] = [
  {
    id: 'brochure',
    label: 'אתר תדמית',
    hint: 'מציג את העסק והשירותים ומביא פניות',
    text: 'אתר שמציג את העסק ואת השירותים שלו ומוביל את הגולש לפנות.',
  },
  {
    id: 'store',
    label: 'חנות אינטרנטית',
    hint: 'מוצרים, סל קניות, תשלום ומשלוח',
    text: 'חנות שבה לקוחות בוחרים מוצרים, משלמים באתר ומקבלים משלוח או איסוף.',
  },
  {
    id: 'booking',
    label: 'אתר עם הזמנת תורים',
    hint: 'קובעים תור, שיעור או טיפול ומשלמים באתר',
    text: 'אתר שבו לקוחות קובעים בעצמם תור, שיעור או טיפול, ובמידת הצורך משלמים מראש.',
  },
  {
    id: 'catalog',
    label: 'קטלוג מוצרים',
    hint: 'מציגים מוצרים בלי קנייה, עם בקשה להצעת מחיר',
    text: 'קטלוג שמציג מוצרים ומפרטים בלי רכישה באתר, ומוביל לבקשת הצעת מחיר.',
  },
  {
    id: 'landing',
    label: 'דף נחיתה',
    hint: 'עמוד אחד לקמפיין, שירות או מוצר',
    text: 'עמוד אחד שמוקדש להצעה אחת, לרוב לקמפיין ממומן, עם טופס או כפתור לפנייה.',
  },
  {
    id: 'system',
    label: 'מערכת או אזור אישי',
    hint: 'פורטל לקוחות, ממשק ניהול או מערכת בהתאמה',
    text: 'מערכת ווב עם משתמשים, הרשאות ונתונים, כמו פורטל לקוחות או ממשק ניהול פנימי.',
  },
]

const page = (name: string, purpose: string): SpecPage => ({ name, purpose })

const pagesByType: Record<SiteType, SpecPage[]> = {
  brochure: [
    page('עמוד הבית', 'מי אתם, מה אתם מציעים ולמה לבחור בכם, עם קריאה ברורה לפעולה'),
    page('אודות', 'הסיפור של העסק, הצוות והניסיון'),
    page('שירותים', 'עמוד לכל שירות מרכזי: למי הוא מתאים, מה הוא כולל ואיך מתחילים'),
    page('עבודות והמלצות', 'דוגמאות לעבודות, תמונות והמלצות של לקוחות'),
    page('שאלות נפוצות', 'תשובות לשאלות שלקוחות שואלים לפני שהם פונים'),
    page('צור קשר', 'טופס, טלפון, וואטסאפ, כתובת ומפה'),
  ],
  store: [
    page('עמוד הבית', 'קטגוריות ראשיות, מוצרים מובילים ומבצעים'),
    page('עמודי קטגוריה', 'רשימת מוצרים עם סינון ומיון'),
    page('עמוד מוצר', 'תמונות, תיאור, מחיר, מלאי, אפשרויות כמו מידה וצבע, והוספה לסל'),
    page('סל קניות ותשלום', 'סיכום ההזמנה, משלוח, קופון ותשלום מאובטח'),
    page('החשבון שלי', 'הזמנות קודמות, כתובות ופרטים אישיים'),
    page('משלוחים והחזרות', 'זמני אספקה, עלויות משלוח וביטול עסקה'),
    page('אודות', 'מי עומד מאחורי החנות ולמה לקנות דווקא בה'),
    page('צור קשר', 'טופס, טלפון, וואטסאפ ושעות פעילות'),
  ],
  booking: [
    page('עמוד הבית', 'מה העסק מציע, למי, ואיך קובעים תור'),
    page('שירותים', 'כל שירות עם משך, מחיר ולמי הוא מתאים'),
    page('לוח זמנים והזמנה', 'יומן עם מועדים פנויים, בחירת מועד ותשלום או מקדמה'),
    page('מחירים ומנויים', 'מחירון, כרטיסיות, מנויים וחבילות'),
    page('הצוות', 'מי מטפל או מדריך, עם תמונה והכשרה'),
    page('שאלות נפוצות', 'ביטול ושינוי מועד, מה להביא ואיך מגיעים'),
    page('צור קשר', 'כתובת, מפה, חניה, טלפון ווואטסאפ'),
  ],
  catalog: [
    page('עמוד הבית', 'קטגוריות ראשיות ומוצרים בולטים'),
    page('קטגוריות', 'רשימת מוצרים לפי סוג, עם סינון'),
    page('עמוד מוצר', 'תמונות, מפרט טכני וקבצים להורדה, עם כפתור לבקשת הצעת מחיר'),
    page('בקשת הצעת מחיר', 'טופס עם המוצרים שנבחרו, כמויות ופרטי קשר'),
    page('אודות', 'העסק, הניסיון והלקוחות'),
    page('צור קשר', 'טופס, טלפון, כתובת ושעות פעילות'),
  ],
  landing: [
    page('דף הנחיתה', 'כותרת עם ההצעה, יתרונות, המלצות, שאלות נפוצות וטופס'),
    page('עמוד תודה', 'אישור שהפנייה התקבלה ומה קורה עכשיו. כאן נמדדת ההמרה'),
  ],
  system: [
    page('כניסה והרשמה', 'כניסה עם סיסמה או קוד חד-פעמי, ושחזור סיסמה'),
    page('לוח בקרה', 'מה שהמשתמש צריך לראות מיד אחרי הכניסה'),
    page('מסכי עבודה', 'רשימות, טפסים וחיפוש לכל סוג נתונים במערכת'),
    page('משתמשים והרשאות', 'סוגי משתמשים, מי רואה מה ומי רשאי לשנות'),
    page('דוחות', 'סיכומים, סינון וייצוא לאקסל או ל-PDF'),
    page('הגדרות', 'פרטי העסק, תבניות הודעות וחיבורים למערכות אחרות'),
  ],
}

export const suggestedPages = (type: SiteType): SpecPage[] => pagesByType[type].map((item) => ({ ...item }))

export const goalOptions: SpecChoice<Goal>[] = [
  { id: 'leads', label: 'פניות מלקוחות', text: 'להביא פניות מלקוחות חדשים, בטופס, בטלפון או בוואטסאפ' },
  { id: 'sales', label: 'מכירות באתר', text: 'למכור מוצרים או שירותים ישירות באתר' },
  { id: 'bookings', label: 'הזמנת תורים', text: 'לאפשר ללקוחות לקבוע תור או להזמין שירות בעצמם' },
  {
    id: 'info',
    label: 'מידע ותדמית',
    text: 'להציג את העסק ולתת ללקוחות את המידע שהם צריכים לפני שהם בוחרים בו',
  },
]

export const platformOptions: SpecChoice<Platform>[] = [
  {
    id: 'none',
    label: 'אין העדפה',
    text: 'אין לנו העדפה לפלטפורמה. נשמח שהספק ימליץ על אחת ויסביר למה היא מתאימה לנו.',
  },
  { id: 'wordpress', label: 'WordPress', text: 'פלטפורמה מועדפת: WordPress.' },
  { id: 'wix', label: 'Wix', text: 'פלטפורמה מועדפת: Wix.' },
  { id: 'shopify', label: 'Shopify', text: 'פלטפורמה מועדפת: Shopify.' },
  {
    id: 'code',
    label: 'אתר בקוד (React או Next.js)',
    text: 'פלטפורמה מועדפת: אתר בקוד, למשל React או Next.js.',
  },
]

export const editorOptions: SpecChoice<Editor>[] = [
  {
    id: 'self',
    label: 'נעדכן בעצמנו',
    text: 'אחרי ההשקה נרצה לעדכן בעצמנו טקסטים, תמונות ופריטים, בלי לפנות לספק. נדרש ממשק ניהול פשוט והדרכה.',
  },
  {
    id: 'agency',
    label: 'הספק יעדכן',
    text: 'אחרי ההשקה הספק יעדכן תכנים לפי הצורך או במסגרת חבילת תחזוקה.',
  },
]

export const languageOptions: SpecChoice<string>[] = [
  { id: 'he', label: 'עברית', text: 'עברית' },
  { id: 'en', label: 'אנגלית', text: 'אנגלית' },
  { id: 'ru', label: 'רוסית', text: 'רוסית' },
  { id: 'ar', label: 'ערבית', text: 'ערבית' },
]

export const copyOptions: SpecChoice<CopyBy>[] = [
  {
    id: 'owner',
    label: 'אנחנו כותבים',
    text: 'את הטקסטים נכתוב אנחנו ונעביר לספק עד תחילת שלב העיצוב.',
  },
  {
    id: 'agency',
    label: 'הספק כותב',
    text: 'כתיבת הטקסטים באחריות הספק, על בסיס שיחת היכרות וחומרים שנעביר. יש לפרט בהצעה כמה עמודים כלולים וכמה סבבי תיקונים.',
  },
  {
    id: 'mixed',
    label: 'יש טקסטים, צריך עריכה',
    text: 'יש לנו טקסטים קיימים, והם צריכים עריכה והתאמה לאתר ולחיפוש בגוגל.',
  },
]

export const photoOptions: SpecChoice<Photos>[] = [
  {
    id: 'own',
    label: 'יש תמונות מקצועיות',
    text: 'יש לנו תמונות מקצועיות של העסק, הצוות והעבודות, ונעביר אותן בקבצים מקוריים.',
  },
  {
    id: 'shoot',
    label: 'צריך צילום',
    text: 'צריך צילום מקצועי. יש לציין בהצעה אם הצילום כלול או שהוא נעשה מול צלם חיצוני.',
  },
  {
    id: 'stock',
    label: 'תמונות ממאגר',
    text: 'נשתמש בתמונות ממאגר עם רישיון לשימוש מסחרי. יש לציין בהצעה מי רוכש אותן.',
  },
  {
    id: 'mixed',
    label: 'חלק יש, חלק חסר',
    text: 'יש לנו חלק מהתמונות, וצריך להשלים בצילום או ממאגר.',
  },
]

export const brandOptions: SpecChoice<Brand>[] = [
  {
    id: 'guide',
    label: 'לוגו ומדריך מותג',
    text: 'יש לוגו בקבצים וקטוריים ומדריך מותג עם צבעים וגופנים, והעיצוב יתבסס עליהם.',
  },
  {
    id: 'logo',
    label: 'יש לוגו בלבד',
    text: 'יש לוגו, אבל אין מדריך מותג. צבעים וגופנים ייקבעו בשלב העיצוב.',
  },
  {
    id: 'none',
    label: 'צריך לוגו ומיתוג',
    text: 'אין לוגו. צריך לעצב לוגו ושפה גרפית בסיסית לפני עיצוב האתר, כחלק מההצעה או בנפרד.',
  },
]

export const featureOptions: { id: string; label: string }[] = [
  { id: 'forms', label: 'טפסי יצירת קשר' },
  { id: 'whatsapp', label: 'כפתור וואטסאפ' },
  { id: 'payment', label: 'תשלום באתר' },
  { id: 'invoices', label: 'חשבוניות אוטומטיות' },
  { id: 'booking', label: 'יומן הזמנת תורים' },
  { id: 'blog', label: 'בלוג ומאמרים' },
  { id: 'members', label: 'אזור אישי ללקוחות' },
  { id: 'crm', label: 'חיבור ל-CRM' },
  { id: 'newsletter', label: 'הרשמה לדיוור' },
  { id: 'search', label: 'חיפוש באתר' },
]

export const legalOptions: { id: string; label: string; ready: string; href: string; tool: string }[] = [
  {
    id: 'privacy',
    label: 'מדיניות פרטיות',
    ready: 'קיימת אצלנו ותועבר לספק לפרסום',
    href: '/tools/privacy-policy-generator',
    tool: 'מחולל מדיניות פרטיות',
  },
  {
    id: 'terms',
    label: 'תקנון האתר',
    ready: 'קיים אצלנו ויועבר לספק לפרסום',
    href: '/tools/website-terms-generator',
    tool: 'מחולל תקנון',
  },
  {
    id: 'accessibility',
    label: 'הצהרת נגישות',
    ready: 'קיימת אצלנו ותועבר לספק לפרסום',
    href: '/tools/accessibility-statement-generator',
    tool: 'מחולל הצהרת נגישות',
  },
]

export const trackingOptions: { id: string; label: string }[] = [
  { id: 'seo', label: 'קידום אורגני בסיסי' },
  { id: 'ga4', label: 'Google Analytics 4' },
  { id: 'gsc', label: 'Google Search Console' },
  { id: 'pixel', label: 'Meta Pixel' },
  { id: 'gbp', label: 'פרופיל עסק בגוגל' },
  { id: 'redirects', label: 'הפניות מהאתר הישן' },
]

export const domainOptions: SpecChoice<DomainStatus>[] = [
  { id: 'have', label: 'יש לנו דומיין', text: '' },
  { id: 'need', label: 'צריך לרשום דומיין', text: '' },
]

export const hostingOptions: SpecChoice<Hosting>[] = [
  {
    id: 'agency',
    label: 'הספק יספק אחסון',
    text: 'האחסון באחריות הספק. יש לפרט בהצעה עלות שנתית, גיבויים, תעודת SSL ומיקום השרתים.',
  },
  {
    id: 'own',
    label: 'יש לנו אחסון',
    text: 'יש לנו חשבון אחסון, והאתר יעלה אליו. הספק יבדוק שהאחסון מתאים לפלטפורמה שנבחרה.',
  },
  {
    id: 'platform',
    label: 'אחסון של הפלטפורמה',
    text: 'האתר יאוחסן בפלטפורמה עצמה, כמו Wix או Shopify, והמנוי יירשם על שם העסק.',
  },
  {
    id: 'unsure',
    label: 'צריכים המלצה',
    text: 'אין לנו העדפה לאחסון. נשמח להמלצה עם העלות השנתית.',
  },
]

export const maintenanceOptions: SpecChoice<Maintenance>[] = [
  {
    id: 'monthly',
    label: 'חבילה חודשית',
    text: 'אנחנו מעוניינים בחבילת תחזוקה חודשית: עדכוני אבטחה, גיבויים, ניטור ותיקון תקלות. יש לפרט מה כלול, זמני תגובה ומה נחשב עבודה נוספת.',
  },
  {
    id: 'ondemand',
    label: 'לפי הצורך',
    text: 'תחזוקה לפי הצורך, בתעריף שעתי שיפורט בהצעה.',
  },
  {
    id: 'self',
    label: 'נתחזק בעצמנו',
    text: 'את התחזוקה השוטפת נעשה בעצמנו. נדרשים הדרכה ותיעוד קצר של האתר.',
  },
]

export const defaultSpecInput = (today: string): SpecInput => ({
  businessName: '',
  about: '',
  currentSite: '',
  contactName: '',
  contactPhone: '',
  contactEmail: '',
  date: today,
  goal: '',
  successMetric: '',
  audience: '',
  siteType: 'brochure',
  platform: '',
  editor: '',
  pages: suggestedPages('brochure'),
  pagesEdited: false,
  languages: ['he'],
  copyBy: '',
  photos: '',
  brand: '',
  contentNotes: '',
  features: ['forms', 'whatsapp'],
  paymentProvider: '',
  invoiceSystem: '',
  crmName: '',
  featureNotes: '',
  legalReady: [],
  tracking: ['seo', 'ga4', 'gsc'],
  keywords: '',
  domain: '',
  domainName: '',
  hosting: '',
  maintenance: '',
  budget: '',
  deadline: '',
  references: [
    { url: '', note: '' },
    { url: '', note: '' },
  ],
  credit: true,
})

export const sampleSpecInput = (date: string): SpecInput => ({
  ...defaultSpecInput(date),
  businessName: 'סטודיו פילאטיס לדוגמה',
  about:
    'סטודיו לפילאטיס מכשירים ומזרן בכפר סבא, עם שתי מדריכות, שיעורים קבוצתיים בקבוצות קטנות ושיעורים פרטיים. היום הרישום לשיעורים נעשה בוואטסאפ, והתשלום בהעברה או במזומן.',
  currentSite: 'www.example.co.il',
  contactName: 'דנה לוי',
  contactPhone: '050-0000000',
  contactEmail: 'studio@example.co.il',
  goal: 'bookings',
  successMetric: 'שלושה חודשים אחרי ההשקה, רוב ההרשמות לשיעורים נעשות באתר ולא בוואטסאפ',
  audience:
    'נשים וגברים בגילי 30 עד 65 מכפר סבא והסביבה, חלקם אחרי פציעה או בהיריון, שמחפשים אימון בקבוצה קטנה עם תשומת לב אישית. רובם נכנסים לאתר מהטלפון.',
  siteType: 'booking',
  platform: 'none',
  editor: 'self',
  pages: suggestedPages('booking'),
  languages: ['he', 'en'],
  copyBy: 'mixed',
  photos: 'shoot',
  brand: 'logo',
  contentNotes: 'יש לנו סרטונים קצרים מהשיעורים באינסטגרם, ונרצה לשלב חלק מהם באתר.',
  features: ['forms', 'whatsapp', 'payment', 'invoices', 'booking', 'members', 'newsletter'],
  paymentProvider: 'עוד לא בחרנו, נשמח להמלצה',
  invoiceSystem: 'Morning (חשבונית ירוקה), שבה אנחנו כבר עובדים',
  featureNotes:
    'כרטיסיות של 10 ו-20 שיעורים ומנוי חודשי. ביטול שיעור עד 12 שעות לפני תחילתו מחזיר את הניקוב לכרטיסייה.',
  legalReady: ['privacy'],
  tracking: ['seo', 'ga4', 'gsc', 'pixel', 'gbp', 'redirects'],
  keywords: 'פילאטיס בכפר סבא, פילאטיס מכשירים, פילאטיס בהיריון',
  domain: 'have',
  domainName: 'example.co.il',
  hosting: 'unsure',
  maintenance: 'monthly',
  budget: 'עוד לא נקבע. נשמח להצעה שמפרידה בין שלב ראשון הכרחי לבין תוספות',
  deadline: 'לפני ספטמבר, כשמגיעים רוב הנרשמים החדשים',
  references: [
    { url: 'studio-a.example.com', note: 'מערכת השעות ברורה, ואפשר להירשם לשיעור בשתי לחיצות מהטלפון' },
    { url: 'studio-b.example.com', note: 'התמונות של המדריכות ושל הסטודיו אמיתיות ולא ממאגר' },
  ],
  credit: false,
})

const isText = (value: unknown): value is string => typeof value === 'string'

const pickId = <T extends string>(value: unknown, options: SpecChoice<T>[]): T | '' =>
  options.find((option) => option.id === value)?.id ?? ''

const pickIds = (value: unknown, options: { id: string }[], fallback: string[]) =>
  Array.isArray(value) ? value.filter((item) => options.some((option) => option.id === item)) : fallback

export function restoreSpecInput(saved: unknown, today: string): SpecInput {
  const base = defaultSpecInput(today)
  if (!saved || typeof saved !== 'object') return base
  const draft = saved as Record<string, unknown>
  const text = (key: keyof SpecInput) => {
    const value = draft[key]
    return isText(value) ? value : (base[key] as string)
  }
  const siteType = pickId(draft.siteType, siteTypes) || base.siteType
  const pages = Array.isArray(draft.pages)
    ? draft.pages
        .filter((item): item is SpecPage => !!item && isText(item.name) && isText(item.purpose))
        .slice(0, MAX_PAGES)
    : suggestedPages(siteType)
  const references = Array.isArray(draft.references)
    ? draft.references
        .filter((item): item is SpecReference => !!item && isText(item.url) && isText(item.note))
        .slice(0, MAX_REFERENCES)
    : base.references
  return {
    businessName: text('businessName'),
    about: text('about'),
    currentSite: text('currentSite'),
    contactName: text('contactName'),
    contactPhone: text('contactPhone'),
    contactEmail: text('contactEmail'),
    date: text('date'),
    goal: pickId(draft.goal, goalOptions),
    successMetric: text('successMetric'),
    audience: text('audience'),
    siteType,
    platform: pickId(draft.platform, platformOptions),
    editor: pickId(draft.editor, editorOptions),
    pages,
    pagesEdited: draft.pagesEdited === true,
    languages: pickIds(draft.languages, languageOptions, base.languages),
    copyBy: pickId(draft.copyBy, copyOptions),
    photos: pickId(draft.photos, photoOptions),
    brand: pickId(draft.brand, brandOptions),
    contentNotes: text('contentNotes'),
    features: pickIds(draft.features, featureOptions, base.features),
    paymentProvider: text('paymentProvider'),
    invoiceSystem: text('invoiceSystem'),
    crmName: text('crmName'),
    featureNotes: text('featureNotes'),
    legalReady: pickIds(draft.legalReady, legalOptions, base.legalReady),
    tracking: pickIds(draft.tracking, trackingOptions, base.tracking),
    keywords: text('keywords'),
    domain: pickId(draft.domain, domainOptions),
    domainName: text('domainName'),
    hosting: pickId(draft.hosting, hostingOptions),
    maintenance: pickId(draft.maintenance, maintenanceOptions),
    budget: text('budget'),
    deadline: text('deadline'),
    references,
    credit: typeof draft.credit === 'boolean' ? draft.credit : base.credit,
  }
}

const clean = (value: string) => value.trim().replace(/[.\s]+$/, '')

const or = (value: string, fallback: string) => clean(value) || fallback

const sentence = (value: string, fallback: string) => {
  const text = or(value, fallback)
  return /[!?]$/.test(text) ? text : `${text}.`
}

export const formatDate = (iso: string) => {
  const [year, month, day] = iso.split('-')
  return year && month && day ? `${day}.${month}.${year}` : iso
}

export const toHref = (value: string) => {
  const trimmed = value.trim()
  if (/^https?:\/\//i.test(trimmed)) return trimmed
  return `https://${trimmed.replace(/^\/+/, '')}`
}

const bareUrl = (value: string) => value.trim().replace(/^https?:\/\//i, '').replace(/\/$/, '')

const joinHe = (items: string[]) =>
  items.length < 2 ? (items[0] ?? '') : `${items.slice(0, -1).join(', ')} ו${items[items.length - 1]}`

const choiceText = <T extends string>(options: SpecChoice<T>[], id: T | '', fallback: string) =>
  options.find((option) => option.id === id)?.text ?? fallback

type Clause = { parts: SpecInline[]; list?: SpecInline[][]; table?: { head: string[]; rows: string[][] } }
type Section = { title: string; clauses: Clause[] }

const clause = (...parts: SpecInline[]): Clause => ({ parts })
const listClause = (parts: SpecInline[], items: SpecInline[][]): Clause => ({ parts, list: items })

const has = (input: SpecInput, key: 'features' | 'tracking' | 'legalReady' | 'languages', id: string) =>
  input[key].includes(id)

function businessSection(input: SpecInput, org: string): Section {
  const site = bareUrl(input.currentSite)
  return {
    title: 'רקע על העסק',
    clauses: [
      clause(`שם העסק: ${org}.`),
      clause(sentence(input.about, '[מה העסק עושה, למי ובאיזה אזור]')),
      clause(site ? `לעסק יש היום אתר בכתובת ${site}, והאתר החדש יחליף אותו.` : 'לעסק אין היום אתר.'),
    ],
  }
}

function goalsSection(input: SpecInput): Section {
  const goal = goalOptions.find((option) => option.id === input.goal)
  return {
    title: 'מטרות האתר',
    clauses: [
      clause(`המטרה העיקרית של האתר: ${goal ? goal.text : '[המטרה העיקרית של האתר]'}.`),
      clause(`מדד הצלחה: ${sentence(input.successMetric, '[איך נדע שהאתר הצליח, במספרים]')}`),
    ],
  }
}

function audienceSection(input: SpecInput): Section {
  return {
    title: 'קהל היעד',
    clauses: [
      clause(sentence(input.audience, '[מי הלקוחות, מה הם מחפשים ומאיפה הם מגיעים לאתר]')),
      clause('האתר צריך לעבוד היטב בטלפון, בטאבלט ובמחשב, ולהיטען מהר גם בגלישה סלולרית.'),
    ],
  }
}

function typeSection(input: SpecInput): Section {
  const type = siteTypes.find((option) => option.id === input.siteType) ?? siteTypes[0]
  const clauses = [
    clause(`סוג האתר: ${type.label}. ${type.text}`),
    clause(choiceText(platformOptions, input.platform, '[פלטפורמה מועדפת, או "אין העדפה"]')),
    clause(choiceText(editorOptions, input.editor, '[מי יעדכן את התכנים אחרי ההשקה]')),
  ]
  if (input.siteType === 'system') {
    clauses.push(
      clause(
        'במערכת נדרש מפרט טכני מפורט: סוגי המשתמשים וההרשאות שלהם, הנתונים שהמערכת שומרת, המסכים והחיבורים למערכות אחרות. נבקש מהספק להכין אותו על בסיס המסמך הזה, לפני תחילת הפיתוח.',
      ),
    )
  }
  return { title: 'סוג האתר ופלטפורמה', clauses }
}

function structureSection(input: SpecInput): Section {
  const languages = languageOptions.filter((option) => input.languages.includes(option.id)).map((option) => option.text)
  const clauses: Clause[] = []
  if (!languages.length) {
    clauses.push(clause('שפות האתר: [שפות האתר].'))
  } else if (languages.length === 1) {
    clauses.push(clause(`שפת האתר: ${languages[0]}.`))
  } else {
    const rtl = input.languages.includes('ar') ? ' ערבית, כמו עברית, מוצגת מימין לשמאל.' : ''
    clauses.push(
      clause(
        `שפות האתר: ${joinHe(languages)}. לכל שפה כתובות משלה, תרגום מלא של התפריט, הטפסים והודעות המערכת, ותגיות hreflang לגוגל.${rtl} יש לציין בהצעה אם התרגום כלול.`,
      ),
    )
  }
  const pages = input.pages.filter((item) => item.name.trim() || item.purpose.trim())
  if (pages.length) {
    clauses.push({
      parts: [`העמודים באתר (${pages.length === 1 ? 'עמוד אחד' : `${pages.length} עמודים`}):`],
      table: {
        head: ['#', 'עמוד', 'מה יש בעמוד'],
        rows: pages.map((item, index) => [
          String(index + 1),
          or(item.name, '[שם העמוד]'),
          or(item.purpose, '[מה יש בעמוד]'),
        ]),
      },
    })
  } else {
    clauses.push(clause('העמודים באתר: [רשימת העמודים ומה יש בכל אחד].'))
  }
  clauses.push(clause('הרשימה היא נקודת פתיחה. הספק מוזמן להציע שינויים במבנה ולנמק אותם.'))
  return { title: 'מבנה האתר ועמודים', clauses }
}

function contentSection(input: SpecInput): Section {
  const clauses = [
    clause(choiceText(copyOptions, input.copyBy, '[מי כותב את הטקסטים]')),
    clause(choiceText(photoOptions, input.photos, '[מאיפה יגיעו התמונות]')),
    clause(choiceText(brandOptions, input.brand, '[מצב הלוגו והמיתוג]')),
  ]
  if (input.contentNotes.trim()) clauses.push(clause(sentence(input.contentNotes, '')))
  return { title: 'תוכן וחומרים', clauses }
}

function featureItems(input: SpecInput): SpecInline[][] {
  const items: SpecInline[][] = []
  const add = (id: string, text: string) => {
    if (has(input, 'features', id)) items.push([text])
  }
  add('forms', 'טפסי יצירת קשר: הפנייה מגיעה לדוא״ל של העסק, הגולש רואה הודעת תודה, וכל שליחה נמדדת כהמרה.')
  add('whatsapp', 'כפתור וואטסאפ קבוע בכל עמוד, עם הודעה פותחת מוכנה.')
  add(
    'payment',
    `תשלום באתר בכרטיס אשראי דרך חברת סליקה ישראלית, ואם הסולק תומך גם ביט, Apple Pay ו-Google Pay. חברת הסליקה: ${or(input.paymentProvider, '[שם החברה, או שהספק ימליץ]')}.`,
  )
  add(
    'invoices',
    `חשבונית או קבלה נשלחת ללקוח אוטומטית אחרי כל תשלום, דרך ${or(input.invoiceSystem, '[מערכת החשבוניות]')}.`,
  )
  add(
    'booking',
    'יומן תורים: הלקוח רואה מועדים פנויים, קובע תור ומקבל אישור ותזכורת. בעל העסק מנהל זמינות, חופשות וביטולים.',
  )
  add('blog', 'בלוג עם קטגוריות, שנוכל לפרסם בו מאמרים בעצמנו.')
  add('members', 'אזור אישי עם הרשמה וכניסה, שבו הלקוח רואה את ההזמנות, המנויים או המסמכים שלו.')
  add('crm', `כל פנייה והזמנה נכנסות אוטומטית ל-${or(input.crmName, '[מערכת ה-CRM]')}.`)
  add(
    'newsletter',
    'הרשמה לדיוור עם תיבת הסכמה נפרדת שאינה מסומנת מראש, כפי שסעיף 30א לחוק התקשורת דורש, וחיבור למערכת הדיוור.',
  )
  add('search', 'חיפוש באתר שמוצא עמודים, מאמרים ומוצרים.')
  return items
}

function featuresSection(input: SpecInput): Section {
  const items = featureItems(input)
  const clauses: Clause[] = [
    items.length
      ? listClause(['האתר יכלול:'], items)
      : clause('[מה האתר צריך לעשות מעבר להצגת מידע, למשל טפסים, תשלום או הזמנת תורים]'),
  ]
  if (input.featureNotes.trim()) clauses.push(clause(`פרטים נוספים: ${sentence(input.featureNotes, '')}`))
  return { title: 'פונקציות', clauses }
}

function legalSection(input: SpecInput): Section {
  const sells =
    input.siteType === 'store' || input.siteType === 'booking' || has(input, 'features', 'payment')
  const clauses: Clause[] = [
    clause(
      'האתר ייבנה לפי התקן הישראלי ת״י 5568 ברמת AA, כפי שתקנה 35א לתקנות שוויון זכויות לאנשים עם מוגבלות (התאמות נגישות לשירות) דורשת: ניווט במקלדת, טקסט חלופי לתמונות, ניגודיות מספקת וטפסים עם תוויות. תפריט נגישות לבדו לא מספיק. יש לציין בהצעה מי בודק את הנגישות לפני ההשקה.',
    ),
    listClause(
      ['מסמכים משפטיים באתר:'],
      legalOptions.map((option) => [
        has(input, 'legalReady', option.id)
          ? `${option.label}: ${option.ready}.`
          : `${option.label}: צריך להכין לפני ההשקה. יש לציין בהצעה אם הספק מכין את הנוסח או רק מפרסם אותו.`,
      ]),
    ),
  ]
  if (has(input, 'features', 'forms') || has(input, 'features', 'newsletter') || has(input, 'features', 'members')) {
    clauses.push(clause('ליד כל טופס יופיע נוסח קצר עם קישור למדיניות הפרטיות.'))
  }
  if (sells) {
    clauses.push(
      clause(
        'בעמוד התשלום יופיע קישור לתקנון, ובעמוד הבית קישור בולט לביטול עסקה, כפי שחוק הגנת הצרכן דורש באתר שאפשר להזמין בו.',
      ),
    )
  }
  if (has(input, 'tracking', 'ga4') || has(input, 'tracking', 'pixel')) {
    clauses.push(clause('באנר עוגיות שמאפשר לגולש לאשר או לסרב לכלי המדידה והפרסום.'))
  }
  return { title: 'משפטי ונגישות', clauses }
}

function trackingSection(input: SpecInput): Section {
  const items: SpecInline[][] = []
  const add = (id: string, text: string) => {
    if (has(input, 'tracking', id)) items.push([text])
  }
  const conversions = ['לחיצה על הטלפון']
  if (has(input, 'features', 'forms')) conversions.unshift('שליחת טופס')
  if (has(input, 'features', 'whatsapp')) conversions.push('לחיצה על וואטסאפ')
  if (input.siteType === 'store' || has(input, 'features', 'payment')) conversions.push('רכישה')
  if (input.siteType === 'booking' || has(input, 'features', 'booking')) conversions.push('קביעת תור')
  add(
    'seo',
    'קידום אורגני בסיסי: כותרת ותיאור לכל עמוד, כתובות קריאות, מפת אתר, נתונים מובנים (Schema) וטעינה מהירה בטלפון.',
  )
  add('ga4', `Google Analytics 4 עם מדידת המרות: ${joinHe(conversions)}.`)
  add('gsc', 'חיבור ל-Google Search Console והגשת מפת האתר.')
  add('pixel', 'Meta Pixel למדידת קמפיינים בפייסבוק ובאינסטגרם.')
  add('gbp', 'קישור מהפרופיל של העסק בגוגל (Google Business Profile) לאתר החדש.')
  add(
    'redirects',
    `העברת הכתובות מהאתר הקיים (${or(bareUrl(input.currentSite), '[כתובת האתר הקיים]')}) בהפניות 301, כדי לא לאבד מיקומים בגוגל. לפני ההשקה מכינים רשימה של כל הכתובות הישנות ושל היעד של כל אחת.`,
  )
  const clauses: Clause[] = [
    items.length ? listClause(['נדרשים:'], items) : clause('[אילו כלי קידום ומדידה נדרשים]'),
  ]
  if (input.keywords.trim()) clauses.push(clause(`ביטויי חיפוש חשובים לעסק: ${sentence(input.keywords, '')}`))
  return { title: 'קידום ומדידה', clauses }
}

function hostingSection(input: SpecInput): Section {
  const name = bareUrl(input.domainName)
  let domain = '[דומיין: יש לנו, או שצריך לרשום]'
  if (input.domain === 'have') {
    domain = `הדומיין ${name || '[שם הדומיין]'} כבר רשום על שם העסק.`
  } else if (input.domain === 'need') {
    domain = `צריך לרשום דומיין${name ? `, רצוי ${name}` : ''}. הדומיין יירשם על שם העסק ולא על שם הספק.`
  }
  return {
    title: 'דומיין, אחסון ותחזוקה',
    clauses: [
      clause(domain),
      clause(choiceText(hostingOptions, input.hosting, '[מי מספק את האחסון]')),
      clause(choiceText(maintenanceOptions, input.maintenance, '[איך תיעשה התחזוקה אחרי ההשקה]')),
    ],
  }
}

function budgetSection(input: SpecInput): Section {
  return {
    title: 'תקציב ולוח זמנים',
    clauses: [
      clause(`תקציב: ${sentence(input.budget, '[טווח תקציב]')}`),
      clause('אם התקציב לא מספיק לכל מה שבמסמך, נשמח להמלצה מה לדחות לשלב שני.'),
      clause(`מועד השקה רצוי: ${sentence(input.deadline, '[מועד השקה]')}`),
      clause(
        'נבקש לוח זמנים עם אבני דרך: עיצוב, פיתוח, הכנסת תוכן, בדיקות והשקה, ומה נדרש מאיתנו בכל שלב.',
      ),
    ],
  }
}

function referencesSection(input: SpecInput): Section {
  const items = input.references
    .filter((item) => item.url.trim())
    .map((item): SpecInline[] => [
      { text: bareUrl(item.url), href: toHref(item.url) },
      `: ${or(item.note, '[מה אהבתם באתר הזה]')}`,
    ])
  return {
    title: 'אתרים לדוגמה',
    clauses: [
      items.length
        ? listClause(['אתרים שאנחנו אוהבים, ומה אהבנו בהם:'], items)
        : clause('[שניים או שלושה אתרים שאתם אוהבים, ומה אהבתם בכל אחד]'),
    ],
  }
}

function quoteSection(): Section {
  return {
    title: 'מה לכלול בהצעת המחיר',
    clauses: [
      listClause(
        ['נבקש שההצעה תכלול:'],
        [
          ['מחיר מפורט לפי רכיבים: עיצוב, פיתוח, תוכן, קידום ומדידה'],
          ['לוח זמנים עם אבני דרך, ותשלומים לפי שלבים'],
          ['הפלטפורמה המוצעת ולמה היא מתאימה לאתר הזה'],
          ['כמה סבבי תיקונים כלולים בעיצוב ובפיתוח'],
          ['עלויות שנתיות: אחסון, דומיין, רישיונות ותוספים'],
          ['מה כלול בתחזוקה, ותקופת אחריות לתקלות אחרי ההשקה'],
          ['שהדומיין, התכנים והקוד שייכים לעסק, וכל הגישות מועברות אלינו בסיום'],
        ],
      ),
      clause('נשמח לתשובה לפי מספרי הסעיפים במסמך, כדי שיהיה קל להשוות בין הצעות.'),
    ],
  }
}

export function buildSpec(input: SpecInput): SpecBlock[] {
  const org = or(input.businessName, '[שם העסק]')
  const phone = input.contactPhone.trim()
  const email = input.contactEmail.trim()
  const meta = [
    `תאריך: ${input.date ? formatDate(input.date) : '[תאריך]'}`,
    `איש קשר: ${or(input.contactName, '[שם איש הקשר]')}`,
  ]
  if (phone) meta.push(`טלפון: ${phone}`)
  if (email) meta.push(`דוא״ל: ${email}`)
  if (!phone && !email) meta.push('[טלפון או דוא״ל]')

  const sections: Section[] = [
    businessSection(input, org),
    goalsSection(input),
    audienceSection(input),
    typeSection(input),
    structureSection(input),
    contentSection(input),
    featuresSection(input),
    legalSection(input),
    trackingSection(input),
    hostingSection(input),
    budgetSection(input),
    referencesSection(input),
    quoteSection(),
  ]

  const blocks: SpecBlock[] = [
    { kind: 'title', text: `מסמך אפיון אתר: ${org}` },
    { kind: 'meta', items: meta },
    {
      kind: 'intro',
      text: 'המסמך מתאר את האתר שאנחנו רוצים לבנות: מטרות, קהל, עמודים, תוכן ופונקציות. הוא נועד לקבל הצעות מחיר שאפשר להשוות ביניהן, ולשמש בסיס לעבודה עם הספק שייבחר.',
    },
  ]
  sections.forEach((section, sectionIndex) => {
    const sectionNumber = sectionIndex + 1
    blocks.push({ kind: 'heading', text: `${sectionNumber}. ${section.title}` })
    section.clauses.forEach((item, clauseIndex) => {
      blocks.push({ kind: 'clause', number: `${sectionNumber}.${clauseIndex + 1}`, parts: item.parts })
      if (item.list?.length) blocks.push({ kind: 'list', items: item.list })
      if (item.table) blocks.push({ kind: 'table', ...item.table })
    })
  })

  if (input.credit) {
    blocks.push({
      kind: 'credit',
      text: 'המסמך נוצר באמצעות',
      linkText: 'מחולל מסמך האפיון של AITERRA',
      href: GENERATOR_URL,
    })
  }
  return blocks
}

export function specChecks(input: SpecInput): SpecCheck[] {
  const filled = (...values: string[]) => values.every((value) => value.trim())
  return [
    {
      id: 'business',
      label: 'העסק ומה הוא עושה',
      note: 'כדי שהספק יבין את העסק בלי שיחה נוספת',
      done: filled(input.businessName, input.about),
    },
    {
      id: 'goal',
      label: 'מטרה ומדד הצלחה',
      note: 'לפיהם בודקים בסוף אם האתר עובד',
      done: !!input.goal && filled(input.successMetric),
    },
    {
      id: 'audience',
      label: 'קהל היעד',
      note: 'משפיע על העיצוב, על השפה ועל התוכן',
      done: filled(input.audience),
    },
    {
      id: 'pages',
      label: 'רשימת עמודים',
      note: 'הבסיס להערכת היקף העבודה',
      done: input.pages.some((item) => item.name.trim()),
    },
    {
      id: 'content',
      label: 'טקסטים, תמונות ולוגו',
      note: 'תוכן שלא מוכן בזמן מעכב את ההשקה',
      done: !!input.copyBy && !!input.photos && !!input.brand,
    },
    {
      id: 'features',
      label: 'פונקציות',
      note: 'כל פונקציה משפיעה על המחיר',
      done: input.features.length > 0,
    },
    {
      id: 'hosting',
      label: 'דומיין, אחסון ותחזוקה',
      note: 'עלויות שנתיות ובעלות על הדומיין',
      done:
        !!input.domain &&
        !!input.hosting &&
        !!input.maintenance &&
        (input.domain !== 'have' || filled(input.domainName)),
    },
    {
      id: 'budget',
      label: 'תקציב ומועד השקה',
      note: 'כדי לקבל הצעות שמתאימות למסגרת',
      done: filled(input.budget, input.deadline),
    },
    {
      id: 'references',
      label: 'אתרים לדוגמה',
      note: 'דוגמה אחת מסבירה יותר מפסקה',
      done: input.references.some((item) => item.url.trim()),
    },
    {
      id: 'contact',
      label: 'איש קשר',
      note: 'למי הספק חוזר עם ההצעה',
      done: filled(input.contactName) && (filled(input.contactPhone) || filled(input.contactEmail)),
    },
  ]
}

const escapeHtml = (value: string) =>
  value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

const inlineToHtml = (parts: SpecInline[]) =>
  parts
    .map((part) =>
      typeof part === 'string' ? escapeHtml(part) : `<a href="${escapeHtml(part.href)}">${escapeHtml(part.text)}</a>`,
    )
    .join('')

const inlineToText = (parts: SpecInline[]) => parts.map((part) => (typeof part === 'string' ? part : part.text)).join('')

export function specToHtml(blocks: SpecBlock[]): string {
  const body = blocks
    .map((block) => {
      if (block.kind === 'title') return `<h1>${escapeHtml(block.text)}</h1>`
      if (block.kind === 'meta') return `<p>${escapeHtml(block.items.join(' · '))}</p>`
      if (block.kind === 'intro') return `<p>${escapeHtml(block.text)}</p>`
      if (block.kind === 'heading') return `<h2>${escapeHtml(block.text)}</h2>`
      if (block.kind === 'clause') return `<p>${escapeHtml(block.number)} ${inlineToHtml(block.parts)}</p>`
      if (block.kind === 'list') {
        return `<ul>\n${block.items.map((item) => `  <li>${inlineToHtml(item)}</li>`).join('\n')}\n</ul>`
      }
      if (block.kind === 'table') {
        const head = block.head.map((cell) => `<th>${escapeHtml(cell)}</th>`).join('')
        const rows = block.rows
          .map((row) => `  <tr>${row.map((cell) => `<td>${escapeHtml(cell)}</td>`).join('')}</tr>`)
          .join('\n')
        return `<table border="1" cellpadding="6">\n  <tr>${head}</tr>\n${rows}\n</table>`
      }
      return `<p>${escapeHtml(block.text)} <a href="${block.href}">${escapeHtml(block.linkText)}</a></p>`
    })
    .join('\n')
  return `<section dir="rtl" lang="he">\n${body}\n</section>`
}

export function specToText(blocks: SpecBlock[]): string {
  return blocks
    .map((block) => {
      if (block.kind === 'meta') return block.items.join(' · ')
      if (block.kind === 'title' || block.kind === 'intro') return block.text
      if (block.kind === 'heading') return `\n${block.text}`
      if (block.kind === 'clause') return `${block.number} ${inlineToText(block.parts)}`
      if (block.kind === 'list') return block.items.map((item) => `• ${inlineToText(item)}`).join('\n')
      if (block.kind === 'table') return block.rows.map(([no, name, purpose]) => `${no}. ${name}: ${purpose}`).join('\n')
      return `\n${block.text} ${block.linkText}: ${block.href}`
    })
    .join('\n')
    .trim()
}

export function specDocument(blocks: SpecBlock[], title: string): string {
  return `<!doctype html>
<html lang="he" dir="rtl">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${escapeHtml(title)}</title>
<style>body{max-width:780px;margin:40px auto;padding:0 20px;font:16px/1.7 Arial,Helvetica,sans-serif;color:#1a1f33}h1{font-size:28px;line-height:1.25}h2{font-size:19px;margin-top:28px}table{width:100%;border-collapse:collapse;margin:8px 0 16px}th,td{border:1px solid #d9d3ca;padding:6px 10px;text-align:right;vertical-align:top}th{background:#f4f0ea}a{color:#2447d6}@media print{body{margin:0}h2{break-after:avoid}tr{break-inside:avoid}}</style>
</head>
<body>
${specToHtml(blocks).replace(/ border="1" cellpadding="6"/g, '')}
</body>
</html>
`
}
