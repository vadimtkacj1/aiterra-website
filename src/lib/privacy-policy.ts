export type PrivacyInput = {
  businessName: string
  siteUrl: string
  email: string
  phone: string
  address: string
  collects: string[]
  sensitive: boolean
  sensitiveInfo: string
  tools: string[]
  consentBanner: boolean
  processors: string[]
  processorNames: string
  paymentProvider: string
  abroad: boolean
  retention: string
  minors: boolean
  hasOfficer: boolean
  officerName: string
  officerEmail: string
  termsUrl: string
  updated: string
  credit: boolean
}

export type PrivacyOption = { id: string; label: string }

export type CollectOption = PrivacyOption & { data: string; purpose: string; without: string }

export type ToolOption = PrivacyOption & { text: string; policy: string; href: string }

export type ProcessorOption = PrivacyOption & { text: string }

export type PrivacyInline = string | { text: string; href: string }

export type PrivacyBlock =
  | { kind: 'title'; text: string }
  | { kind: 'meta'; text: string }
  | { kind: 'heading'; text: string }
  | { kind: 'clause'; number: string; parts: PrivacyInline[] }
  | { kind: 'list'; items: PrivacyInline[][] }
  | { kind: 'credit'; text: string; linkText: string; href: string }

export type CheckState = 'ok' | 'missing' | 'optional'
export type PrivacyCheck = { id: string; label: string; state: CheckState; note: string }

export type FormSnippet = { id: string; label: string; hint: string; text: string }

export const GENERATOR_URL = 'https://www.aiterra.co.il/tools/privacy-policy-generator'

const GOOGLE_PARTNERS_URL = 'https://policies.google.com/technologies/partner-sites'
const GA_OPT_OUT_URL = 'https://tools.google.com/dlpage/gaoptout'

export const collectOptions: CollectOption[] = [
  {
    id: 'contact',
    label: 'טופס יצירת קשר או השארת פרטים',
    data: 'פרטים שתמסרו בטופס יצירת קשר: שם, טלפון, דוא״ל ותוכן הפנייה.',
    purpose: 'לחזור אליכם ולטפל בפנייה',
    without: 'לחזור אליכם',
  },
  {
    id: 'booking',
    label: 'קביעת תורים או פגישות',
    data: 'פרטים לקביעת תור או פגישה: שם, טלפון, דוא״ל, המועד והשירות שבחרתם.',
    purpose: 'לקבוע את התור או הפגישה, לשלוח לכם תזכורת ולטפל בשינויים',
    without: 'לקבוע לכם תור',
  },
  {
    id: 'orders',
    label: 'הזמנות ותשלום באתר',
    data: 'פרטי הזמנה: שם, טלפון, דוא״ל, כתובת למשלוח, מה שהזמנתם והיסטוריית ההזמנות.',
    purpose: 'לטפל בהזמנה, בתשלום, במשלוח, בביטולים ובשירות הלקוחות, ולהפיק חשבוניות',
    without: 'להשלים את ההזמנה',
  },
  {
    id: 'accounts',
    label: 'חשבון משתמש באתר',
    data: 'פרטי חשבון משתמש: שם, דוא״ל ופרטי ההתחברות.',
    purpose: 'לנהל את החשבון שלכם ולאפשר לכם להתחבר אליו',
    without: 'לפתוח לכם חשבון',
  },
  {
    id: 'newsletter',
    label: 'הרשמה לדיוור או לניוזלטר',
    data: 'כתובת דוא״ל, ולפעמים גם שם וטלפון, שתמסרו בהרשמה לדיוור.',
    purpose: 'לשלוח לכם עדכונים ודברי פרסומת, רק אם הסכמתם לכך',
    without: 'לשלוח לכם עדכונים',
  },
  {
    id: 'chat',
    label: 'וואטסאפ או צ׳אט באתר',
    data: 'הודעות שתשלחו לנו בוואטסאפ או בצ׳אט באתר, עם השם ומספר הטלפון שמופיעים בהן.',
    purpose: 'לענות להודעות שלכם',
    without: 'לענות לכם',
  },
  {
    id: 'jobs',
    label: 'קורות חיים ומועמדות לעבודה',
    data: 'קורות חיים ופרטים שתשלחו לנו במסגרת מועמדות לעבודה.',
    purpose: 'לבחון את המועמדות שלכם ולחזור אליכם',
    without: 'לבחון את המועמדות שלכם',
  },
]

export const toolOptions: ToolOption[] = [
  {
    id: 'ga',
    label: 'Google Analytics',
    text: 'Google Analytics של Google, למדידת השימוש באתר: אילו עמודים נצפים, מאיפה מגיעים אליהם וכמה זמן נשארים בהם.',
    policy: 'איך Google משתמשת במידע מאתרים',
    href: GOOGLE_PARTNERS_URL,
  },
  {
    id: 'gads',
    label: 'Google Ads',
    text: 'Google Ads של Google, להצגת מודעות ולמדידת הפעולות שנעשו באתר בעקבות מודעה.',
    policy: 'איך Google משתמשת במידע מאתרים',
    href: GOOGLE_PARTNERS_URL,
  },
  {
    id: 'meta',
    label: 'Meta Pixel (פייסבוק ואינסטגרם)',
    text: 'Meta Pixel של Meta, להצגת מודעות בפייסבוק ובאינסטגרם ולמדידת התוצאות שלהן.',
    policy: 'מדיניות הפרטיות של Meta',
    href: 'https://www.facebook.com/privacy/policy',
  },
  {
    id: 'tiktok',
    label: 'TikTok Pixel',
    text: 'TikTok Pixel של TikTok, להצגת מודעות ב-TikTok ולמדידת התוצאות שלהן.',
    policy: 'מדיניות הפרטיות של TikTok',
    href: 'https://www.tiktok.com/legal/privacy-policy',
  },
  {
    id: 'clarity',
    label: 'Microsoft Clarity',
    text: 'Microsoft Clarity של Microsoft, שמתעד לחיצות, גלילה ותנועת עכבר בעמודים, כדי שנוכל לראות איפה קשה להשתמש באתר ולשפר אותו.',
    policy: 'הצהרת הפרטיות של Microsoft',
    href: 'https://privacy.microsoft.com/privacystatement',
  },
]

export const processorOptions: ProcessorOption[] = [
  { id: 'hosting', label: 'אחסון האתר', text: 'חברת האחסון, שבשרתים שלה האתר והמידע שנאסף בו נשמרים' },
  { id: 'crm', label: 'מערכת CRM לניהול לקוחות', text: 'מערכת לניהול לקוחות ופניות (CRM)' },
  { id: 'email', label: 'שירות דיוור', text: 'שירות לשליחת דוא״ל ודיוור' },
  { id: 'whatsapp', label: 'וואטסאפ עסקי', text: 'WhatsApp, שדרכו אנחנו מתכתבים עם לקוחות' },
  { id: 'scheduling', label: 'מערכת זימון תורים', text: 'מערכת לזימון תורים ופגישות' },
  { id: 'accounting', label: 'הנהלת חשבונות וחשבוניות', text: 'מערכת להפקת חשבוניות ומי שמנהל את החשבונות שלנו' },
  {
    id: 'shipping',
    label: 'חברת שילוח',
    text: 'חברות שילוח ושליחויות, שמקבלות את השם, הטלפון והכתובת למשלוח',
  },
]

const ANALYTICS_TOOLS = ['ga', 'clarity']
const AD_TOOLS = ['gads', 'meta', 'tiktok']
const NOTICE_ORDER = ['contact', 'booking', 'orders', 'jobs', 'accounts']

export const defaultPrivacyInput = (today: string): PrivacyInput => ({
  businessName: '',
  siteUrl: '',
  email: '',
  phone: '',
  address: '',
  collects: ['contact'],
  sensitive: false,
  sensitiveInfo: '',
  tools: ['ga'],
  consentBanner: false,
  processors: ['hosting'],
  processorNames: '',
  paymentProvider: '',
  abroad: true,
  retention: '',
  minors: true,
  hasOfficer: false,
  officerName: '',
  officerEmail: '',
  termsUrl: '',
  updated: today,
  credit: true,
})

export const samplePrivacyInput = (today: string): PrivacyInput => ({
  ...defaultPrivacyInput(today),
  businessName: 'סטודיו לדוגמה',
  siteUrl: 'www.example.co.il',
  email: 'privacy@example.co.il',
  phone: '03-0000000',
  address: 'רחוב הדוגמה 1, תל אביב',
  collects: ['contact', 'newsletter'],
  tools: ['ga', 'meta'],
  consentBanner: true,
  processors: ['hosting', 'crm', 'email'],
  retention: 'עד 24 חודשים',
  termsUrl: 'www.example.co.il/terms',
})

type Clause = { parts: PrivacyInline[]; list?: PrivacyInline[][] }
type Section = { title: string; clauses: Clause[] }

const clause = (...parts: PrivacyInline[]): Clause => ({ parts })
const listClause = (parts: PrivacyInline[], items: PrivacyInline[][]): Clause => ({ parts, list: items })

const or = (value: string, fallback: string) => value.trim() || fallback

const clean = (value: string) => value.trim().replace(/[.\s]+$/, '')

export const formatDate = (iso: string) => {
  const [year, month, day] = iso.split('-')
  return year && month && day ? `${day}.${month}.${year}` : iso
}

export const toHref = (value: string) => {
  const trimmed = value.trim()
  if (/^https?:\/\//i.test(trimmed) || trimmed.startsWith('/')) return trimmed
  return `https://${trimmed}`
}

export const siteDomain = (value: string) =>
  value
    .trim()
    .replace(/^https?:\/\//i, '')
    .replace(/\/.*$/, '')

const joinWords = (items: string[], conjunction: string) => {
  if (items.length < 2) return items.join('')
  return `${items.slice(0, -1).join(', ')} ${conjunction}${items[items.length - 1]}`
}

const pick = <T extends PrivacyOption>(options: T[], ids: string[]) => options.filter((option) => ids.includes(option.id))

type Context = {
  input: PrivacyInput
  org: string
  site: string
  email: string
  phone: string
  address: string
  collected: CollectOption[]
  tools: ToolOption[]
  processors: ProcessorOption[]
  orders: boolean
  newsletter: boolean
}

function generalSection({ input, org, site, email, phone, address }: Context): Section {
  const reach = phone ? `בדוא״ל ${email} או בטלפון ${phone}` : `בדוא״ל ${email}`
  const terms: PrivacyInline = input.termsUrl.trim()
    ? { text: 'תקנון האתר', href: toHref(input.termsUrl) }
    : 'תקנון האתר'
  return {
    title: 'כללי',
    clauses: [
      clause(
        `מדיניות זו מסבירה איזה מידע אישי ${org} אוסף באתר ${site}, למה הוא משמש, למי הוא נמסר ואילו זכויות יש לכם לגביו, בהתאם לחוק הגנת הפרטיות, התשמ״א-1981.`,
      ),
      clause(
        `האחראי למידע שנאסף באתר, ובלשון החוק בעל השליטה במאגר המידע, הוא ${org}${address ? `, ${address}` : ''}. בכל עניין של פרטיות אפשר לפנות אלינו ${reach}.`,
      ),
      clause('המדיניות חלה יחד עם ', terms, '. אפשר לגלוש באתר בלי למסור לנו פרטים כמו שם או טלפון.'),
    ],
  }
}

function dataSection({ input, collected }: Context): Section {
  const clauses: Clause[] = []
  if (collected.length) {
    clauses.push(
      listClause(
        ['אנחנו אוספים את המידע שאתם מוסרים לנו בעצמכם:'],
        collected.map((option) => [option.data]),
      ),
    )
  }
  clauses.push(
    clause(
      'כשאתם גולשים באתר נאסף גם מידע טכני באופן אוטומטי: כתובת IP, סוג הדפדפן והמכשיר, העמודים שבהם ביקרתם ומזהים מקוונים כמו עוגיות. מידע כזה הוא מידע אישי כשאפשר לקשר אותו אליכם.',
    ),
  )
  if (input.sensitive) {
    clauses.push(
      clause(
        `חלק מהמידע הוא מידע בעל רגישות מיוחדת, כהגדרתו בחוק: ${clean(input.sensitiveInfo) || '[איזה מידע רגיש]'}. נאסוף מידע כזה רק כשהוא נחוץ לשירות, והגישה אליו מוגבלת למי שזקוק לו כדי לתת לכם את השירות.`,
      ),
    )
  }
  return { title: 'המידע שאנחנו אוספים', clauses }
}

function purposeSection({ collected, tools, orders }: Context): Section {
  const purposes = collected.map((option) => option.purpose)
  purposes.push('לתפעל את האתר, לאבטח אותו ולטפל בתקלות')
  if (tools.some((tool) => ANALYTICS_TOOLS.includes(tool.id))) purposes.push('למדוד את השימוש באתר ולשפר אותו')
  if (tools.some((tool) => AD_TOOLS.includes(tool.id))) purposes.push('להציג מודעות שלנו ולמדוד את התוצאות שלהן')
  purposes.push(
    orders ? 'לעמוד בחובות שהדין מטיל עלינו, למשל בהנהלת חשבונות' : 'לעמוד בחובות שהדין מטיל עלינו',
  )
  return {
    title: 'למה אנחנו משתמשים במידע',
    clauses: [listClause(['נשתמש במידע רק למטרות האלה:'], purposes.map((purpose) => [purpose]))],
  }
}

function choiceSection({ collected }: Context): Section {
  const clauses: Clause[] = [clause('אין עליכם חובה חוקית למסור לנו מידע אישי. מסירת המידע תלויה ברצונכם ובהסכמתכם.')]
  const withouts = collected.map((option) => option.without)
  if (withouts.length) {
    clauses.push(
      clause(`אם לא תמסרו את הפרטים שמסומנים בטפסים כשדות חובה, לא נוכל ${joinWords(withouts, 'או ')}.`),
    )
  }
  return { title: 'מסירת המידע היא לבחירתכם', clauses }
}

function marketingSection(): Section {
  return {
    title: 'דיוור ודברי פרסומת',
    clauses: [
      clause(
        'נשלח לכם דברי פרסומת בדוא״ל, ב-SMS או בהודעות אחרות רק אם הסכמתם לכך במפורש ומראש, כנדרש בסעיף 30א לחוק התקשורת (בזק ושידורים), התשמ״ב-1982. השארת פרטים בטופס יצירת קשר אינה הסכמה לקבל דברי פרסומת.',
      ),
      clause('כל הודעה כזו תסומן כ״פרסומת״ ותכלול את פרטי העסק ודרך פשוטה להודיע לנו שאינכם רוצים לקבל עוד הודעות.'),
      clause('אפשר להסיר את עצמכם מרשימת התפוצה בכל עת, בקישור שבהודעה או בפנייה אלינו. ההסרה אינה כרוכה בתשלום.'),
    ],
  }
}

function cookiesSection({ input, tools }: Context): Section {
  const clauses: Clause[] = [
    clause(
      'עוגיות (Cookies) הן קבצים קטנים שהאתר שומר בדפדפן שלכם. חלקן הכרחיות לפעולת האתר, וחלקן משמשות למדידה ולפרסום.',
    ),
  ]
  if (tools.length) {
    clauses.push(
      listClause(
        ['באתר פועלים הכלים האלה של צדדים שלישיים, שאוספים מידע באמצעות עוגיות וטכנולוגיות דומות:'],
        tools.map((tool) => [`${tool.text} `, { text: tool.policy, href: tool.href }]),
      ),
    )
    if (tools.some((tool) => tool.id === 'ga')) {
      clauses.push(
        clause(
          'אפשר למנוע מ-Google Analytics לאסוף מידע על הגלישה שלכם באמצעות ',
          { text: 'תוסף הדפדפן של Google', href: GA_OPT_OUT_URL },
          '.',
        ),
      )
    }
  } else {
    clauses.push(clause('באתר לא פועלים כלי מדידה או פרסום של צדדים שלישיים.'))
  }
  if (input.consentBanner && tools.length) {
    clauses.push(
      clause(
        'בכניסה הראשונה לאתר תוכלו לבחור אם לאשר עוגיות שאינן הכרחיות. כלי המדידה והפרסום יופעלו רק אם תאשרו אותם.',
      ),
    )
  }
  clauses.push(
    clause('אפשר גם לחסום או למחוק עוגיות בהגדרות הדפדפן. חסימה של עוגיות הכרחיות עלולה לפגוע בפעולת חלק מהאתר.'),
  )
  return { title: 'עוגיות וכלי מדידה', clauses }
}

function sharingSection({ input, tools, processors, orders }: Context): Section {
  const items: PrivacyInline[][] = processors.map((processor) => [`${processor.text}.`])
  if (orders) {
    items.push([
      `חברת הסליקה ${clean(input.paymentProvider) || '[שם חברת הסליקה]'}, שמעבדת את התשלום. פרטי כרטיס האשראי מוזנים ישירות במערכת שלה ואינם נשמרים אצלנו.`,
    ])
  }
  if (tools.length) items.push(['החברות שמפעילות את כלי המדידה והפרסום שבסעיף על העוגיות, לפי המדיניות שלהן.'])
  items.push(['רשויות או גורמים אחרים, כשהדין, צו שיפוטי או הליך משפטי מחייבים אותנו לכך.'])
  const clauses: Clause[] = [
    listClause(['נמסור מידע אישי רק לגורמים האלה, ורק במידה שנדרשת למטרות שבמדיניות זו:'], items),
  ]
  if (processors.length) {
    const names = clean(input.processorNames)
    clauses.push(
      clause(
        `ספקי השירות${names ? ` שלנו (${names})` : ''} מקבלים רק את המידע שדרוש להם כדי לתת לנו את השירות.`,
      ),
    )
  }
  clauses.push(clause('אנחנו לא מוכרים מידע אישי.'))
  return { title: 'למי אנחנו מוסרים מידע', clauses }
}

function abroadSection(): Section {
  return {
    title: 'העברת מידע אל מחוץ לישראל',
    clauses: [
      clause(
        'חלק מספקי השירות והכלים שאנחנו משתמשים בהם שומרים מידע בשרתים מחוץ לישראל. העברת מידע כזו נעשית בהתאם לתקנות הגנת הפרטיות (העברת מידע אל מאגרי מידע שמחוץ לגבולות המדינה), התשס״א-2001.',
      ),
    ],
  }
}

function retentionSection({ input, orders, collected }: Context): Section {
  const clauses: Clause[] = [
    clause(
      orders
        ? 'נשמור מידע אישי כל עוד הוא נחוץ למטרות שלשמן נאסף, או כל עוד הדין מחייב אותנו לשמור אותו, למשל לצורכי הנהלת חשבונות. מידע שכבר אינו נחוץ נמחק.'
        : 'נשמור מידע אישי כל עוד הוא נחוץ למטרות שלשמן נאסף, או כל עוד הדין מחייב אותנו לשמור אותו. מידע שכבר אינו נחוץ נמחק.',
    ),
  ]
  const retention = clean(input.retention)
  const hasLeads = collected.some((option) => ['contact', 'booking', 'chat'].includes(option.id))
  if (retention && hasLeads) {
    clauses.push(clause(`פניות שלא הובילו להתקשרות איתנו נשמרות ${retention}, ואז נמחקות.`))
  }
  return { title: 'כמה זמן אנחנו שומרים מידע', clauses }
}

function securitySection(): Section {
  return {
    title: 'אבטחת מידע',
    clauses: [
      clause(
        'אנחנו נוקטים אמצעים סבירים לאבטחת המידע, בהתאם לתקנות הגנת הפרטיות (אבטחת מידע), התשע״ז-2017. בין השאר, המידע עובר באתר בחיבור מוצפן (HTTPS), והגישה אליו מוגבלת למי שזקוק לו לעבודתו.',
      ),
      clause(
        'אין אמצעי אבטחה שמונע כל פריצה. אם יתרחש אירוע אבטחה, נפעל לצמצם את הנזק ונדווח עליו כפי שהדין מחייב.',
      ),
    ],
  }
}

function rightsSection({ email, newsletter }: Context): Section {
  const items: PrivacyInline[][] = [
    ['לעיין במידע האישי שלכם שמוחזק אצלנו (סעיף 13 לחוק). נאפשר את העיון בתוך 30 ימים מקבלת הבקשה.'],
    [
      'לבקש לתקן או למחוק מידע אישי שאינו נכון, שלם, ברור או מעודכן (סעיף 14 לחוק). אם נסרב לבקשה, נודיע לכם על כך בתוך 30 ימים.',
    ],
  ]
  if (newsletter) items.push(['לבקש בכל עת שנפסיק לשלוח לכם דברי פרסומת.'])
  return {
    title: 'הזכויות שלכם',
    clauses: [
      listClause(['לפי חוק הגנת הפרטיות יש לכם זכות:'], items),
      clause(
        `את הבקשות אפשר לשלוח בדוא״ל ${email}. כדי להגן על המידע שלכם, נוודא את זהותכם לפני שנמסור מידע או נשנה אותו.`,
      ),
      clause(
        'אם סירבנו לבקשת עיון או תיקון, אפשר לערער לבית משפט השלום (סעיף 15 לחוק). אפשר גם לפנות לרשות להגנת הפרטיות.',
      ),
    ],
  }
}

function minorsSection(): Section {
  return {
    title: 'קטינים',
    clauses: [
      clause(
        'האתר מיועד לבני 18 ומעלה, ואיננו אוספים ביודעין מידע אישי על קטינים. הורה או אפוטרופוס שחושב שקטין מסר לנו מידע יכול לפנות אלינו, ונמחק אותו.',
      ),
    ],
  }
}

function officerSection({ input }: Context): Section {
  const name = clean(input.officerName) || '[שם הממונה]'
  const mail = input.officerEmail.trim() || '[דוא״ל הממונה]'
  return {
    title: 'ממונה על הגנת הפרטיות',
    clauses: [clause(`מינינו ממונה על הגנת הפרטיות: ${name}. אפשר לפנות אליו בדוא״ל ${mail}.`)],
  }
}

function changesSection(): Section {
  return {
    title: 'שינויים במדיניות',
    clauses: [
      clause('אנחנו עשויים לעדכן את המדיניות מעת לעת. הנוסח המעודכן יפורסם בעמוד זה, עם תאריך העדכון.'),
    ],
  }
}

function contactSection({ org, address, email, phone }: Context): Section {
  const lines: PrivacyInline[][] = [[org]]
  if (address) lines.push([`כתובת: ${address}`])
  lines.push([`דוא״ל: ${email}`])
  if (phone) lines.push([`טלפון: ${phone}`])
  return {
    title: 'יצירת קשר',
    clauses: [listClause(['לשאלות ולבקשות בנושא פרטיות:'], lines)],
  }
}

function buildContext(input: PrivacyInput): Context {
  const orders = input.collects.includes('orders')
  const processorIds = orders ? input.processors : input.processors.filter((id) => id !== 'shipping')
  return {
    input,
    org: or(input.businessName, '[שם העסק]'),
    site: or(input.siteUrl.trim().replace(/^https?:\/\//i, '').replace(/\/$/, ''), '[כתובת האתר]'),
    email: or(input.email, '[דוא״ל לפניות]'),
    phone: input.phone.trim(),
    address: clean(input.address),
    collected: pick(collectOptions, input.collects),
    tools: pick(toolOptions, input.tools),
    processors: pick(processorOptions, processorIds),
    orders,
    newsletter: input.collects.includes('newsletter'),
  }
}

export function buildPolicy(input: PrivacyInput): PrivacyBlock[] {
  const context = buildContext(input)
  const sections: Section[] = [
    generalSection(context),
    dataSection(context),
    purposeSection(context),
    choiceSection(context),
  ]
  if (context.newsletter) sections.push(marketingSection())
  sections.push(cookiesSection(context), sharingSection(context))
  if (input.abroad) sections.push(abroadSection())
  sections.push(retentionSection(context), securitySection(), rightsSection(context))
  if (input.minors) sections.push(minorsSection())
  if (input.hasOfficer) sections.push(officerSection(context))
  sections.push(changesSection(), contactSection(context))

  const blocks: PrivacyBlock[] = [
    { kind: 'title', text: 'מדיניות פרטיות' },
    { kind: 'meta', text: `עודכנה לאחרונה: ${formatDate(input.updated) || '[תאריך]'}` },
  ]
  sections.forEach((section, sectionIndex) => {
    const sectionNumber = sectionIndex + 1
    blocks.push({ kind: 'heading', text: `${sectionNumber}. ${section.title}` })
    section.clauses.forEach((item, clauseIndex) => {
      blocks.push({ kind: 'clause', number: `${sectionNumber}.${clauseIndex + 1}`, parts: item.parts })
      if (item.list?.length) blocks.push({ kind: 'list', items: item.list })
    })
  })

  if (input.credit) {
    blocks.push({
      kind: 'credit',
      text: 'המדיניות נוצרה באמצעות',
      linkText: 'מחולל מדיניות הפרטיות של AITERRA',
      href: GENERATOR_URL,
    })
  }

  return blocks
}

export function formSnippets(input: PrivacyInput): FormSnippet[] {
  const context = buildContext(input)
  const snippets: FormSnippet[] = []
  const primary = NOTICE_ORDER.map((id) => collectOptions.find((option) => option.id === id)).find(
    (option): option is CollectOption => Boolean(option && input.collects.includes(option.id)),
  )
  if (primary) {
    const keeper = context.processors.length ? 'אצלנו ואצל ספקי השירות שלנו' : 'אצלנו'
    snippets.push({
      id: 'notice',
      label: 'הודעה קצרה מתחת לטופס',
      hint: 'מציבים מתחת לכפתור השליחה, עם קישור לעמוד המדיניות.',
      text: `נשתמש בפרטים שתמסרו כאן כדי ${primary.purpose}. אין חובה חוקית למסור אותם, אבל בלי הפרטים שמסומנים כחובה לא נוכל ${primary.without}. המידע יישמר ${keeper}, כמפורט במדיניות הפרטיות. האחראי למידע: ${context.org}, ${context.email}. יש לכם זכות לעיין במידע ולבקש לתקן אותו.`,
    })
  }
  if (context.newsletter) {
    snippets.push({
      id: 'consent',
      label: 'תיבת הסכמה לדיוור',
      hint: 'תיבת סימון נפרדת, שאינה מסומנת מראש.',
      text: `אני רוצה לקבל בדוא״ל עדכונים ודברי פרסומת של ${context.org}. אפשר להסיר את ההרשמה בכל עת.`,
    })
  }
  return snippets
}

export function policyChecks(input: PrivacyInput): PrivacyCheck[] {
  const filled = (...values: string[]) => values.every((value) => value.trim())
  const orders = input.collects.includes('orders')
  return [
    {
      id: 'business',
      label: 'שם העסק וכתובת האתר',
      state: filled(input.businessName, input.siteUrl) ? 'ok' : 'missing',
      note: 'מי אחראי למידע, לפי סעיף 11(2א)',
    },
    {
      id: 'email',
      label: 'דוא״ל לפניות בנושא פרטיות',
      state: filled(input.email) ? 'ok' : 'missing',
      note: 'דרך לפנות אליכם, לפי סעיף 11(2א)',
    },
    {
      id: 'collects',
      label: 'מה האתר אוסף ולמה',
      state: input.collects.length ? 'ok' : 'missing',
      note: 'מטרת האיסוף, לפי סעיף 11(2)',
    },
    {
      id: 'recipients',
      label: 'למי המידע נמסר',
      state: input.processors.length || input.tools.length || orders ? 'ok' : 'missing',
      note: 'לפי סעיף 11(3). גם ספק האחסון נחשב',
    },
    {
      id: 'payment',
      label: 'חברת הסליקה',
      state: orders ? (filled(input.paymentProvider) ? 'ok' : 'missing') : 'optional',
      note: orders ? 'מי מעבד את פרטי התשלום' : 'רק באתר שמשלמים בו',
    },
    {
      id: 'sensitive',
      label: 'מידע רגיש',
      state: input.sensitive ? (filled(input.sensitiveInfo) ? 'ok' : 'missing') : 'optional',
      note: input.sensitive ? 'פרטו איזה מידע, והתייעצו עם עורך דין' : 'רק אם אוספים מידע כמו מידע רפואי',
    },
    {
      id: 'officer',
      label: 'ממונה על הגנת הפרטיות',
      state: input.hasOfficer ? (filled(input.officerName, input.officerEmail) ? 'ok' : 'missing') : 'optional',
      note: input.hasOfficer ? 'שם ודרך פנייה, לפי סעיף 17ב2' : 'חובה רק לגופים מסוימים, לפי סעיף 17ב1',
    },
    {
      id: 'updated',
      label: 'תאריך עדכון',
      state: filled(input.updated) ? 'ok' : 'missing',
      note: 'כדי שיהיה ברור מאיזה נוסח המדיניות',
    },
  ]
}

const escapeHtml = (value: string) =>
  value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

const inlineToHtml = (parts: PrivacyInline[]) =>
  parts
    .map((part) =>
      typeof part === 'string' ? escapeHtml(part) : `<a href="${escapeHtml(part.href)}">${escapeHtml(part.text)}</a>`,
    )
    .join('')

const inlineToText = (parts: PrivacyInline[]) =>
  parts.map((part) => (typeof part === 'string' ? part : `${part.text} (${part.href})`)).join('')

export function policyToHtml(blocks: PrivacyBlock[]): string {
  const body = blocks
    .map((block) => {
      if (block.kind === 'title') return `<h1>${escapeHtml(block.text)}</h1>`
      if (block.kind === 'meta') return `<p>${escapeHtml(block.text)}</p>`
      if (block.kind === 'heading') return `<h2>${escapeHtml(block.text)}</h2>`
      if (block.kind === 'clause') return `<p>${escapeHtml(block.number)} ${inlineToHtml(block.parts)}</p>`
      if (block.kind === 'list') {
        return `<ul>\n${block.items.map((item) => `  <li>${inlineToHtml(item)}</li>`).join('\n')}\n</ul>`
      }
      return `<p>${escapeHtml(block.text)} <a href="${block.href}">${escapeHtml(block.linkText)}</a></p>`
    })
    .join('\n')
  return `<section dir="rtl" lang="he">\n${body}\n</section>`
}

export function policyToText(blocks: PrivacyBlock[]): string {
  return blocks
    .map((block) => {
      if (block.kind === 'title' || block.kind === 'meta') return block.text
      if (block.kind === 'heading') return `\n${block.text}`
      if (block.kind === 'clause') return `${block.number} ${inlineToText(block.parts)}`
      if (block.kind === 'list') return block.items.map((item) => `• ${inlineToText(item)}`).join('\n')
      return `\n${block.text} ${block.linkText}: ${block.href}`
    })
    .join('\n')
    .trim()
}

export function policyDocument(blocks: PrivacyBlock[]): string {
  return `<!doctype html>
<html lang="he" dir="rtl">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>מדיניות פרטיות</title>
<style>body{max-width:760px;margin:40px auto;padding:0 20px;font:16px/1.7 Arial,Helvetica,sans-serif;color:#1a1f33}h1{font-size:28px}h2{font-size:19px;margin-top:28px}a{color:#2447d6}</style>
</head>
<body>
${policyToHtml(blocks)}
</body>
</html>
`
}
