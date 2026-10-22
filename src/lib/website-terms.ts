export type SiteType = 'brochure' | 'store' | 'services'

export type EntityType = 'licensed' | 'exempt' | 'company'

export type TermsInput = {
  siteType: SiteType
  businessName: string
  entityType: EntityType
  businessId: string
  address: string
  phone: string
  email: string
  siteUrl: string
  shippingAreas: string
  deliveryTime: string
  shippingCost: string
  pickup: boolean
  payments: string[]
  exceptions: string[]
  serviceKinds: string[]
  cancellationFee: boolean
  cancelUrl: string
  privacyUrl: string
  accessibilityUrl: string
  city: string
  updated: string
  credit: boolean
}

export type TermsOption = { id: string; label: string; text: string }

export type TermsInline = string | { text: string; href: string }

export type TermsBlock =
  | { kind: 'title'; text: string }
  | { kind: 'meta'; text: string }
  | { kind: 'heading'; text: string }
  | { kind: 'clause'; number: string; parts: TermsInline[] }
  | { kind: 'list'; items: TermsInline[][] }
  | { kind: 'credit'; text: string; linkText: string; href: string }

export const GENERATOR_URL = 'https://www.aiterra.co.il/tools/website-terms-generator'

export const siteTypes: { id: SiteType; label: string; hint: string }[] = [
  { id: 'store', label: 'חנות אינטרנטית', hint: 'מוכרים מוצרים באתר, עם תשלום ומשלוח' },
  { id: 'services', label: 'אתר שירותים או הזמנות', hint: 'מזמינים באתר שירות, תור, טיפול או מנוי' },
  { id: 'brochure', label: 'אתר תדמית', hint: 'מציג את העסק, בלי מכירה דרך האתר' },
]

export const entityTypes: { id: EntityType; label: string; prefix: string }[] = [
  { id: 'licensed', label: 'עוסק מורשה', prefix: 'עוסק מורשה מס׳' },
  { id: 'exempt', label: 'עוסק פטור', prefix: 'עוסק פטור מס׳' },
  { id: 'company', label: 'חברה בע״מ (ח.פ.)', prefix: 'ח.פ.' },
]

export const paymentOptions: TermsOption[] = [
  { id: 'card', label: 'כרטיס אשראי', text: 'כרטיס אשראי' },
  { id: 'bit', label: 'ביט', text: 'ביט' },
  { id: 'paybox', label: 'פייבוקס', text: 'פייבוקס' },
  { id: 'paypal', label: 'PayPal', text: 'PayPal' },
  { id: 'applepay', label: 'Apple Pay', text: 'Apple Pay' },
  { id: 'googlepay', label: 'Google Pay', text: 'Google Pay' },
  { id: 'transfer', label: 'העברה בנקאית', text: 'העברה בנקאית' },
]

export const exceptionOptions: TermsOption[] = [
  { id: 'perishable', label: 'מוצרים פסידים, כמו מזון טרי', text: 'טובין פסידים' },
  {
    id: 'custom',
    label: 'מוצרים שמיוצרים במיוחד לפי הזמנת הלקוח',
    text: 'טובין שיוצרו במיוחד בעבורכם בעקבות העסקה',
  },
  {
    id: 'information',
    label: 'מידע בקבצים דיגיטליים, כמו מדריך PDF להורדה',
    text: 'מידע כהגדרתו בחוק המחשבים, התשנ״ה-1995',
  },
  {
    id: 'media',
    label: 'מוצרים שאפשר להקליט או לשכפל, כמו דיסקים או תוכנה באריזה',
    text: 'טובין הניתנים להקלטה, לשעתוק או לשכפול, שפתחתם את אריזתם המקורית',
  },
]

export const serviceKindOptions: { id: string; label: string }[] = [
  { id: 'oneoff', label: 'שירות חד-פעמי, כמו תור, טיפול או אירוע' },
  { id: 'continuing', label: 'מנוי או שירות מתמשך' },
  { id: 'tourism', label: 'שירותי אירוח, נסיעה, נופש או בילוי' },
]

export const defaultTermsInput = (today: string): TermsInput => ({
  siteType: 'store',
  businessName: '',
  entityType: 'licensed',
  businessId: '',
  address: '',
  phone: '',
  email: '',
  siteUrl: '',
  shippingAreas: '',
  deliveryTime: '',
  shippingCost: '',
  pickup: false,
  payments: ['card'],
  exceptions: [],
  serviceKinds: ['oneoff'],
  cancellationFee: true,
  cancelUrl: '',
  privacyUrl: '',
  accessibilityUrl: '',
  city: '',
  updated: today,
  credit: true,
})

type Clause = { parts: TermsInline[]; list?: TermsInline[][] }
type Section = { title: string; clauses: Clause[] }

const clause = (...parts: TermsInline[]): Clause => ({ parts })
const listClause = (parts: TermsInline[], items: TermsInline[][]): Clause => ({ parts, list: items })

const or = (value: string, fallback: string) => value.trim() || fallback

const pick = (options: TermsOption[], ids: string[]) =>
  options.filter((option) => ids.includes(option.id)).map((option) => option.text)

const formatDate = (iso: string) => {
  const [year, month, day] = iso.split('-')
  return year && month && day ? `${day}.${month}.${year}` : iso
}

export const toHref = (value: string) => {
  const trimmed = value.trim()
  if (/^https?:\/\//i.test(trimmed) || trimmed.startsWith('/')) return trimmed
  return `https://${trimmed}`
}

const linkOr = (text: string, url: string): TermsInline =>
  url.trim() ? { text, href: toHref(url) } : `${text} [כתובת העמוד]`

type Context = {
  input: TermsInput
  org: string
  site: string
  idLine: string
  address: string
  phone: string
  email: string
  city: string
  store: boolean
  services: boolean
  sells: boolean
}

function generalSection({ site, org, idLine, address, store, sells }: Context): Section {
  return {
    title: 'כללי',
    clauses: [
      clause(`האתר ${site} מופעל על ידי ${org}, ${idLine}. כתובת העסק: ${address}.`),
      clause(
        sells
          ? `התקנון מסדיר את השימוש באתר ואת ${store ? 'רכישת המוצרים' : 'הזמנת השירותים'} בו. השימוש באתר וביצוע הזמנה בו כפופים לתקנון זה ולהוראות כל דין.`
          : 'התקנון מסדיר את השימוש באתר. השימוש באתר כפוף לתקנון זה ולהוראות כל דין.',
      ),
      clause('התקנון חל על כל דרך שבה נכנסים לאתר, כולל מחשב, טלפון נייד וטאבלט.'),
    ],
  }
}

function definitionsSection({ site, org, store, services, sells }: Context): Section {
  const items: string[] = [
    `"האתר": האתר בכתובת ${site}, על כל עמודיו.`,
    `"העסק" או "אנחנו": ${org}.`,
    '"גולש" או "אתם": כל מי שנכנס לאתר או משתמש בו.',
  ]
  if (store) items.push('"לקוח": מי שמבצע הזמנה באתר.', '"מוצר": מוצר המוצע למכירה באתר.')
  if (services) items.push('"לקוח": מי שמזמין שירות באתר.', '"שירות": שירות המוצע באתר.')
  if (sells) items.push('"חוק הגנת הצרכן": חוק הגנת הצרכן, התשמ״א-1981.')
  return { title: 'הגדרות', clauses: [listClause(['בתקנון זה:'], items.map((item) => [item]))] }
}

function siteUseSection({ sells }: Context): Section {
  const clauses: Clause[] = [
    clause('מותר להשתמש באתר לכל מטרה חוקית, בהתאם לתקנון.'),
    listClause(
      ['בשימוש באתר אסור:'],
      [
        ['למסור פרטים כוזבים או פרטים של אדם אחר בלי הסכמתו'],
        ['לפגוע בפעילות האתר, להעלות אליו קוד זדוני או לנסות לגשת לחלקים שאינם פתוחים לציבור'],
        ['להפעיל כלים אוטומטיים לאיסוף תוכן מהאתר בלי אישור מאיתנו'],
        ['להשתמש באתר באופן שפוגע בזכויות של אחרים או מפר את החוק'],
      ],
    ),
    clause('אנחנו רשאים להגביל או לחסום את הגישה לאתר למי שמפר את התנאים האלה.'),
  ]
  if (sells) clauses.push(clause('ביצוע הזמנה באתר מיועד למי שמלאו לו 18 שנים, או בהסכמת הורה או אפוטרופוס.'))
  clauses.push(clause('האתר עשוי לכלול קישורים לאתרים של אחרים. אין לנו שליטה על האתרים האלה ועל התוכן שלהם.'))
  return { title: 'השימוש באתר', clauses }
}

function intellectualPropertySection(): Section {
  return {
    title: 'קניין רוחני',
    clauses: [
      clause(
        'הזכויות בתכנים שבאתר, ובהם טקסטים, תמונות, סרטונים, עיצוב, סימני מסחר וקוד, שייכות לנו או לבעלי זכויות שהתירו לנו להשתמש בהם.',
      ),
      clause('אין להעתיק, להפיץ, לפרסם או לעשות שימוש מסחרי בתכנים בלי אישור מראש ובכתב מאיתנו.'),
    ],
  }
}

function brochureInfoSection(): Section {
  return {
    title: 'המידע באתר ופניות',
    clauses: [
      clause(
        'המידע באתר נועד להציג את העסק ואת השירותים שלו. פרטים מדויקים על שירות, מחיר או זמינות אפשר לקבל בפנייה אלינו.',
      ),
      clause(
        'פרטים שתשאירו בטופס יצירת קשר באתר ישמשו אותנו כדי לחזור אליכם ולטפל בפנייה, כמפורט במדיניות הפרטיות.',
      ),
    ],
  }
}

function ordersSection({ input, store }: Context): Section {
  const item = store ? 'מוצר' : 'שירות'
  const vat = input.entityType === 'exempt' ? '' : ' וכוללים מע״מ'
  const clauses: Clause[] = [
    clause(
      `המחירים באתר נקובים בשקלים חדשים${vat}. לפני השלמת ההזמנה יוצג לכם המחיר הכולל לתשלום, כולל ${store ? 'דמי משלוח וכל תוספת אחרת' : 'כל תוספת'}.`,
    ),
    clause(
      `התכונות העיקריות של כל ${item}, המחיר ותנאי התשלום מפורטים בעמוד ה${item}. מחירים ומבצעים בתוקף כל עוד הם מוצגים באתר, אלא אם צוין מועד אחר.`,
    ),
  ]
  const payments = pick(paymentOptions, input.payments)
  if (payments.length) {
    clauses.push(listClause(['אפשר לשלם באמצעים האלה:'], payments.map((payment) => [payment])))
  }
  clauses.push(
    clause(
      store
        ? 'ההזמנה נקלטת לאחר אישור התשלום. לאחר ההזמנה, ולכל המאוחר במועד אספקת המוצר, נשלח אליכם בכתב מסמך עם פרטי העסק, תכונות המוצר, המחיר ותנאי התשלום, שם היצרן וארץ הייצור, מידע על האחריות ואופן ביטול העסקה.'
        : 'לאחר ההזמנה, ולכל המאוחר במועד מתן השירות, נשלח אליכם בכתב מסמך עם פרטי העסק, תכונות השירות, המחיר ותנאי התשלום, מידע על האחריות לשירות ואופן ביטול העסקה.',
    ),
  )
  if (store) {
    clauses.push(
      clause(
        'אם מוצר שהזמנתם אינו במלאי, נודיע לכם בהקדם. תוכלו לבחור אם להמתין לו או לבטל את ההזמנה ולקבל את כל הסכום ששילמתם.',
      ),
      clause('פרטים על האחריות לכל מוצר מופיעים בעמוד המוצר.'),
    )
  }
  return { title: 'הזמנות ותשלום', clauses }
}

function shippingSection({ input, address }: Context): Section {
  const clauses: Clause[] = [
    clause(`אזורי משלוח: ${or(input.shippingAreas, '[אזורי משלוח]')}.`),
    clause(`זמן אספקה: ${or(input.deliveryTime, '[זמן אספקה]')}.`),
    clause(`דמי משלוח: ${or(input.shippingCost, '[דמי משלוח]')}.`),
  ]
  if (input.pickup) {
    clauses.push(clause(`איסוף עצמי: אפשר לאסוף את ההזמנה מכתובת העסק, ${address}, בתיאום מראש.`))
  }
  clauses.push(
    clause(
      'אם יהיה עיכוב באספקה, נעדכן אתכם. אם המוצר לא סופק במועד שנקבע, תוכלו לבטל את העסקה בלי דמי ביטול, כאמור בסעיף 14ה(א) לחוק הגנת הצרכן.',
    ),
  )
  return { title: 'משלוחים ואספקה', clauses }
}

function serviceDeliverySection(): Section {
  return {
    title: 'מתן השירות',
    clauses: [
      clause('מועד מתן השירות ומקומו נקבעים בתיאום איתכם ומופיעים באישור ההזמנה.'),
      clause(
        'אם לא נוכל לתת את השירות במועד שנקבע, נודיע לכם בהקדם ונציע מועד אחר. אם השירות לא ניתן במועד שנקבע, תוכלו לבטל את העסקה בלי דמי ביטול, כאמור בסעיף 14ה(א) לחוק הגנת הצרכן.',
      ),
    ],
  }
}

function serviceWindowItems(kinds: string[]): TermsInline[][] {
  const none = !kinds.length
  const items: TermsInline[][] = []
  if (none || kinds.includes('oneoff') || kinds.includes('tourism')) {
    items.push([
      'בשירות חד-פעמי: בתנאי שהביטול נעשה לפחות שני ימים, שאינם ימי מנוחה, לפני המועד שבו השירות אמור להינתן.',
    ])
  }
  if (none || kinds.includes('continuing')) {
    items.push([
      'בשירות מתמשך, כמו מנוי: גם אם כבר התחלנו לתת את השירות. במקרה כזה תשלמו את החלק היחסי בעד השירות שניתן לכם עד הביטול (סעיף 14ה(ב1) לחוק).',
    ])
  }
  return items
}

function cancellationSection({ input, phone, email, address, store }: Context): Section {
  const item = store ? 'המוצר' : 'השירות'
  const clauses: Clause[] = [clause('ביטול עסקה באתר נעשה לפי חוק הגנת הצרכן והתקנות שהותקנו לפיו.')]

  if (store) {
    clauses.push(
      clause(
        'אפשר לבטל עסקה לרכישת מוצר מיום ביצוע ההזמנה ועד 14 ימים מיום קבלת המוצר או מיום קבלת המסמך עם פרטי העסקה, לפי המאוחר מביניהם (סעיף 14ג(ג)(1) לחוק הגנת הצרכן).',
      ),
    )
  } else {
    clauses.push(
      listClause(
        [
          'אפשר לבטל עסקה לרכישת שירות בתוך 14 ימים מיום ביצוע העסקה או מיום קבלת המסמך עם פרטי העסקה, לפי המאוחר מביניהם (סעיף 14ג(ג)(2) לחוק הגנת הצרכן):',
        ],
        serviceWindowItems(input.serviceKinds),
      ),
    )
  }

  const extendedFrom = store
    ? 'מיום ביצוע העסקה, מיום קבלת המוצר או מיום קבלת המסמך עם פרטי העסקה'
    : 'מיום ביצוע העסקה או מיום קבלת המסמך עם פרטי העסקה'
  clauses.push(
    clause(
      `לקוח שהוא אדם עם מוגבלות, אזרח ותיק (מי שמלאו לו 65 שנים) או עולה חדש (מי שטרם חלפו חמש שנים מהיום שקיבל תעודת עולה או תעודת זכאות כעולה) רשאי לבטל את העסקה בתוך ארבעה חודשים ${extendedFrom}, לפי המאוחר, ובלבד שההתקשרות בעסקה כללה שיחה בינינו לבין הלקוח, לרבות שיחה באמצעות תקשורת אלקטרונית (סעיף 14ג1 לחוק). במקרה כזה נוכל לבקש לראות תעודה המעידה על כך, ולא נבקש הוכחה נוספת.`,
    ),
    listClause(
      ['אפשר למסור לנו הודעת ביטול בכל אחת מהדרכים האלה:'],
      [
        [`בטלפון: ${phone}`],
        [`בדוא״ל: ${email}`],
        [`בדואר רשום לכתובת: ${address}`],
        ['באתר, דרך ', linkOr('טופס ביטול עסקה', input.cancelUrl)],
      ],
    ),
    clause('בהודעת הביטול יש לציין שם מלא ומספר תעודת זהות (סעיף 14ט(ג) לחוק).'),
  )

  const breachCause = store
    ? 'מפגם במוצר, מאי התאמה בינו לבין הפרטים שמסרנו, מאי אספקה במועד או מהפרה אחרת שלנו'
    : 'מאי התאמה בין השירות לבין הפרטים שמסרנו, מאי מתן השירות במועד או מהפרה אחרת שלנו'
  const makeAvailable = store
    ? ' במקרה כזה די שתעמידו את המוצר לרשותנו במקום שבו נמסר לכם ותודיעו לנו על כך.'
    : ''

  if (input.cancellationFee) {
    clauses.push(
      clause(
        `אם תבטלו את העסקה שלא בגלל פגם, אי התאמה או הפרה מצדנו, נגבה דמי ביטול בשיעור 5% ממחיר ${item} או 100 ש״ח, לפי הנמוך מביניהם. דמי הביטול כוללים כל הוצאה שלנו בשל העסקה או ביטולה, כמו משלוח ואריזה, ולא נגבה סכום נוסף (סעיף 14ה(ב) ו-(ד) לחוק).`,
      ),
      clause(`אם הביטול נובע ${breachCause}, לא נגבה דמי ביטול כלל (סעיף 14ה(א) לחוק).${makeAvailable}`),
    )
  } else {
    clauses.push(clause('לא נגבה דמי ביטול.'))
    if (store) {
      clauses.push(
        clause(`אם הביטול נובע ${breachCause}, די שתעמידו את המוצר לרשותנו במקום שבו נמסר לכם ותודיעו לנו על כך (סעיף 14ה(א) לחוק).`),
      )
    }
  }

  clauses.push(
    clause(
      'בתוך 14 ימים מיום קבלת הודעת הביטול נחזיר לכם את הסכום ששילמתם, נבטל את החיוב ונשלח לכם עותק מהודעת ביטול החיוב (סעיף 14ה לחוק).',
    ),
  )

  if (store) {
    clauses.push(
      clause(
        `אם ביטלתם שלא בגלל פגם או הפרה מצדנו, יש להחזיר את המוצר לכתובת העסק: ${address} (סעיף 14ה(ב)(2) לחוק).`,
      ),
      clause(
        'אין באמור כדי לגרוע מזכותנו לתבוע פיצוי אם ערך המוצר פחת בגלל הרעה משמעותית במצבו (סעיף 14ה(ג) לחוק).',
      ),
    )
    const exceptions = pick(exceptionOptions, input.exceptions)
    if (exceptions.length) {
      clauses.push(
        listClause(['לפי סעיף 14ג(ד) לחוק, זכות הביטול אינה חלה על:'], exceptions.map((text) => [text])),
      )
    }
  } else if (input.serviceKinds.includes('tourism')) {
    clauses.push(
      clause(
        'לפי סעיף 14ג(ד)(2) לחוק, אין זכות ביטול בשירותי הארחה, נסיעה, חופש או בילוי אם מועד הביטול חל בתוך שבעה ימים, שאינם ימי מנוחה, לפני המועד שבו השירות אמור להינתן.',
      ),
    )
  }

  return { title: 'ביטול עסקה והחזרות', clauses }
}

function liabilitySection({ sells }: Context): Section {
  return {
    title: 'אחריות',
    clauses: [
      clause(
        'אנחנו פועלים כדי שהאתר יפעל כראוי ושהמידע בו יהיה מדויק ועדכני. ייתכנו תקלות או הפסקות בפעילות האתר, למשל בזמן תחזוקה, ואנחנו פועלים לתקן אותן בהקדם.',
      ),
      clause(
        sells
          ? 'אין בתקנון כדי לגרוע מאחריות שחלה עלינו לפי כל דין, ובכלל זה לפי חוק הגנת הצרכן.'
          : 'אין בתקנון כדי לגרוע מאחריות שחלה עלינו לפי כל דין.',
      ),
    ],
  }
}

function privacySection({ input }: Context): Section {
  return {
    title: 'פרטיות',
    clauses: [
      clause(
        'מידע אישי שתמסרו לנו דרך האתר נשמר ומשמש בהתאם לחוק הגנת הפרטיות, התשמ״א-1981, וכמפורט ב',
        linkOr('מדיניות הפרטיות', input.privacyUrl),
        ', שמסבירה איזה מידע נאסף, למה הוא משמש ואילו זכויות יש לכם לגביו.',
      ),
    ],
  }
}

function accessibilitySection({ input }: Context): Section {
  return {
    title: 'נגישות',
    clauses: [
      clause(
        'אנחנו פועלים כדי שהאתר יהיה נגיש לאנשים עם מוגבלות. פרטים על התאמות הנגישות באתר ועל דרכי הפנייה בנושא נמצאים ב',
        linkOr('הצהרת הנגישות', input.accessibilityUrl),
        '.',
      ),
    ],
  }
}

function changesSection({ sells }: Context): Section {
  const clauses = [clause('אנחנו רשאים לעדכן את התקנון מעת לעת. הנוסח המעודכן יפורסם בעמוד זה, עם תאריך העדכון.')]
  if (sells) {
    clauses.push(
      clause('על כל הזמנה יחול נוסח התקנון שהיה בתוקף במועד ביצועה. שינוי בתקנון לא יחול על הזמנות שכבר בוצעו.'),
    )
  }
  return { title: 'שינויים בתקנון', clauses }
}

function jurisdictionSection({ city }: Context): Section {
  return {
    title: 'דין וסמכות שיפוט',
    clauses: [
      clause('על התקנון ועל השימוש באתר יחולו דיני מדינת ישראל.'),
      clause(
        `סמכות השיפוט בכל עניין הנוגע לתקנון או לשימוש באתר נתונה לבתי המשפט המוסמכים ב${city}, בלי לגרוע מזכותכם להגיש תביעה בכל בית משפט המוסמך לדון בה לפי דין.`,
      ),
    ],
  }
}

function contactSection({ org, idLine, address, phone, email }: Context): Section {
  return {
    title: 'יצירת קשר',
    clauses: [
      listClause(
        ['לשאלות, בקשות ותלונות אפשר לפנות אלינו:'],
        [[`${org}, ${idLine}`], [`כתובת: ${address}`], [`טלפון: ${phone}`], [`דוא״ל: ${email}`]],
      ),
    ],
  }
}

export function buildTerms(input: TermsInput): TermsBlock[] {
  const entity = entityTypes.find((type) => type.id === input.entityType) ?? entityTypes[0]
  const store = input.siteType === 'store'
  const services = input.siteType === 'services'
  const context: Context = {
    input,
    org: or(input.businessName, '[שם העסק]'),
    site: or(input.siteUrl.trim().replace(/^https?:\/\//i, '').replace(/\/$/, ''), '[כתובת האתר]'),
    idLine: `${entity.prefix} ${or(input.businessId, '[מספר]')}`,
    address: or(input.address, '[כתובת העסק]'),
    phone: or(input.phone, '[טלפון]'),
    email: or(input.email, '[דוא״ל]'),
    city: or(input.city, '[עיר]'),
    store,
    services,
    sells: store || services,
  }

  const sections: Section[] = [
    generalSection(context),
    definitionsSection(context),
    siteUseSection(context),
    intellectualPropertySection(),
  ]
  if (store) sections.push(ordersSection(context), shippingSection(context), cancellationSection(context))
  if (services) sections.push(ordersSection(context), serviceDeliverySection(), cancellationSection(context))
  if (!context.sells) sections.push(brochureInfoSection())
  sections.push(
    liabilitySection(context),
    privacySection(context),
    accessibilitySection(context),
    changesSection(context),
    jurisdictionSection(context),
    contactSection(context),
  )

  const blocks: TermsBlock[] = [
    { kind: 'title', text: 'תקנון האתר' },
    { kind: 'meta', text: `עודכן לאחרונה: ${formatDate(input.updated)}` },
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
      text: 'התקנון נוצר באמצעות',
      linkText: 'מחולל התקנון של AITERRA',
      href: GENERATOR_URL,
    })
  }

  return blocks
}

const escapeHtml = (value: string) =>
  value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

const inlineToHtml = (parts: TermsInline[]) =>
  parts
    .map((part) =>
      typeof part === 'string' ? escapeHtml(part) : `<a href="${escapeHtml(part.href)}">${escapeHtml(part.text)}</a>`,
    )
    .join('')

const inlineToText = (parts: TermsInline[]) =>
  parts.map((part) => (typeof part === 'string' ? part : `${part.text} (${part.href})`)).join('')

export function termsToHtml(blocks: TermsBlock[]): string {
  const body = blocks
    .map((block) => {
      if (block.kind === 'title') return `<h2>${escapeHtml(block.text)}</h2>`
      if (block.kind === 'meta') return `<p>${escapeHtml(block.text)}</p>`
      if (block.kind === 'heading') return `<h3>${escapeHtml(block.text)}</h3>`
      if (block.kind === 'clause') return `<p>${escapeHtml(block.number)} ${inlineToHtml(block.parts)}</p>`
      if (block.kind === 'list') {
        return `<ul>\n${block.items.map((item) => `  <li>${inlineToHtml(item)}</li>`).join('\n')}\n</ul>`
      }
      return `<p>${escapeHtml(block.text)} <a href="${block.href}">${escapeHtml(block.linkText)}</a></p>`
    })
    .join('\n')
  return `<section dir="rtl" lang="he">\n${body}\n</section>`
}

export function termsToText(blocks: TermsBlock[]): string {
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
