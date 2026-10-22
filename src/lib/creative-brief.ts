export type BriefType = 'paid' | 'branding' | 'logo' | 'video' | 'web' | 'social'
export type BrandStatus = 'guide' | 'logo' | 'none' | 'rebrand'
export type BudgetRange = 'small' | 'medium' | 'large' | 'xlarge' | 'open'
export type CriticalField = 'goal' | 'kpi' | 'audience' | 'message' | 'deadline'

export type BriefOption = { id: string; label: string }
export type BriefChoice<T extends string> = { id: T; label: string; text: string }
export type BriefDeliverable = BriefOption & { preset: boolean }

export type BriefTypeInfo = {
  id: BriefType
  label: string
  hint: string
  docTitle: string
  goalHint: string
  kpiHint: string
  amountHint: string
  delivery: string
  deliverables: BriefDeliverable[]
}

export type BriefInput = {
  type: BriefType
  businessName: string
  about: string
  link: string
  problem: string
  goal: string
  kpi: string
  audienceWho: string
  audiencePain: string
  audienceBelief: string
  message: string
  proofs: string
  tone: string[]
  notUs: string
  competitors: string
  likes: string
  dislikes: string
  channels: string[]
  deliverables: string[]
  deliverablesNote: string
  languages: string[]
  accessibility: boolean
  brandStatus: BrandStatus | ''
  materials: string
  mustInclude: string
  budget: BudgetRange | ''
  mediaBudget: BudgetRange | ''
  budgetNote: string
  deadline: string
  deadlineNote: string
  contactName: string
  contactPhone: string
  contactEmail: string
  approver: string
  date: string
  credit: boolean
}

export type BriefBlock =
  | { kind: 'title'; text: string }
  | { kind: 'meta'; items: string[] }
  | { kind: 'intro'; text: string }
  | { kind: 'heading'; text: string }
  | { kind: 'field'; label: string; text: string }
  | { kind: 'list'; label: string; items: string[] }
  | { kind: 'text'; text: string }
  | { kind: 'credit'; text: string; linkText: string; href: string }

export type BriefCheck = { id: CriticalField; label: string; done: boolean }

export const GENERATOR_URL = 'https://www.aiterra.co.il/tools/creative-brief-template'
export const MAX_TONE = 3

const item = (id: string, label: string, preset = false): BriefDeliverable => ({ id, label, preset })

export const briefTypes: BriefTypeInfo[] = [
  {
    id: 'paid',
    label: 'קמפיין ממומן',
    hint: 'מודעות בגוגל, בפייסבוק, באינסטגרם או בטיקטוק',
    docTitle: 'לקמפיין ממומן',
    goalHint: 'למשל: למלא את ההרשמה לחוג החדש לפני ספטמבר, או להביא לקוחות לסניף שנפתח',
    kpiHint: 'מספר אחד, עם יעד ותאריך. למשל: 40 פניות מהטופס בחודש הראשון של הקמפיין',
    amountHint: 'למשל: 4 מודעות תמונה לפיד ולסטוריז וסרטון אחד של 15 שניות',
    delivery: 'חשבון המודעות, הפיקסל ודף הנחיתה יוקמו על שם העסק, וכל הגישות יישארו אצלנו.',
    deliverables: [
      item('paid-concept', 'קונספט קריאייטיב ומסר לקמפיין', true),
      item('paid-static', 'מודעות תמונה לפיד ולסטוריז', true),
      item('paid-video', 'סרטון קצר למודעה'),
      item('paid-search', 'נוסחים למודעות חיפוש בגוגל'),
      item('paid-landing', 'דף נחיתה לקמפיין'),
      item('paid-tracking', 'הגדרת מעקב המרות'),
      item('paid-manage', 'הקמה וניהול של הקמפיין'),
    ],
  },
  {
    id: 'branding',
    label: 'מיתוג או מיתוג מחדש',
    hint: 'מיצוב, לוגו, צבעים, גופנים ומדריך מותג',
    docTitle: 'למיתוג',
    goalHint: 'למשל: שהעסק ייראה כמו מרפאה מבוססת ולא כמו קליניקה של מטפלת אחת, לפני מעבר למקום גדול יותר',
    kpiHint: 'מספר אחד, עם יעד ותאריך. למשל: חצי שנה אחרי ההשקה, שליש מהפניות מגיעות מלקוחות עסקיים',
    amountHint: 'למשל: שני כיווני עיצוב בשלב הראשון ושני סבבי תיקונים על הכיוון שנבחר',
    delivery: 'נבקש את כל הקבצים המקוריים וזכות שימוש מסחרי מלאה בכל התוצרים.',
    deliverables: [
      item('brand-strategy', 'אסטרטגיית מותג: מיצוב, ערכים וקהל', true),
      item('brand-name', 'שם או סלוגן'),
      item('brand-logo', 'לוגו וגרסאות שלו', true),
      item('brand-palette', 'פלטת צבעים וגופנים', true),
      item('brand-guide', 'מדריך מותג', true),
      item('brand-stationery', 'כרטיס ביקור ונייר מכתבים'),
      item('brand-social', 'תבניות לרשתות החברתיות'),
      item('brand-signage', 'שילוט, אריזה או ביגוד'),
    ],
  },
  {
    id: 'logo',
    label: 'לוגו',
    hint: 'לוגו לעסק חדש או רענון של לוגו קיים',
    docTitle: 'לעיצוב לוגו',
    goalHint: 'למשל: לוגו לעסק שנפתח בינואר, או לוגו קיים שלא קריא בתמונת הפרופיל',
    kpiHint: 'מה הלוגו חייב לעמוד בו. למשל: קריא גם בתמונת פרופיל קטנה וגם על השלט, בצבע אחד',
    amountHint: 'למשל: שלוש סקיצות בכיוונים שונים ושני סבבי תיקונים על הכיוון שנבחר',
    delivery: 'נבקש את הקבצים המקוריים וזכות שימוש מסחרי מלאה בלוגו, בלי הגבלה.',
    deliverables: [
      item('logo-main', 'לוגו ראשי', true),
      item('logo-versions', 'גרסה אופקית וגרסה אנכית', true),
      item('logo-symbol', 'סמל לבד, לאייקון ולתמונת פרופיל', true),
      item('logo-mono', 'גרסה בצבע אחד ובשלילה', true),
      item('logo-files', 'קבצים וקטוריים (SVG, PDF) וקבצי PNG', true),
      item('logo-sheet', 'דף קצר עם הצבעים והגופנים'),
    ],
  },
  {
    id: 'video',
    label: 'סרטון או רילס',
    hint: 'סרטון תדמית, סרטון למודעה או רילס לרשתות',
    docTitle: 'לסרטון',
    goalHint: 'למשל: להראות איך נראה טיפול ראשון, כדי שפחות אנשים יבטלו את התור',
    kpiHint: 'מספר אחד, עם יעד ותאריך. למשל: 30 הודעות בוואטסאפ מהסרטון בשבועיים הראשונים',
    amountHint: 'למשל: סרטון של 30 שניות ושתי גרסאות קצרות של 10 שניות',
    delivery: 'נבקש את הקבצים הסופיים באיכות מלאה, גם בגרסה בלי כתוביות, וזכות שימוש מסחרי במוזיקה.',
    deliverables: [
      item('video-script', 'תסריט', true),
      item('video-shoot', 'צילום', true),
      item('video-edit', 'עריכה וכתוביות בעברית', true),
      item('video-vertical', 'גרסה אנכית לרילס ולטיקטוק', true),
      item('video-wide', 'גרסה אופקית או מרובעת'),
      item('video-music', 'מוזיקה ברישיון לשימוש מסחרי'),
      item('video-voice', 'קריינות'),
    ],
  },
  {
    id: 'web',
    label: 'אתר או דף נחיתה',
    hint: 'מבנה, תוכן ועיצוב לאתר או לעמוד קמפיין',
    docTitle: 'לאתר או לדף נחיתה',
    goalHint: 'למשל: שמי שמגיע מהמודעה ישאיר פרטים, ולא רק יקרא ויצא',
    kpiHint: 'מספר אחד, עם יעד ותאריך. למשל: 25 פניות בחודש מהטופס, שלושה חודשים אחרי ההשקה',
    amountHint: 'למשל: דף נחיתה אחד ועמוד תודה, בעברית ובאנגלית',
    delivery: 'הדומיין, הקוד, התכנים וכל הגישות יהיו על שם העסק.',
    deliverables: [
      item('web-structure', 'מבנה העמודים', true),
      item('web-copy', 'כתיבת תוכן', true),
      item('web-design', 'עיצוב', true),
      item('web-build', 'פיתוח'),
      item('web-form', 'טופס לידים עם חיבור למייל או ל-CRM'),
      item('web-tracking', 'הגדרת מעקב המרות'),
    ],
  },
  {
    id: 'social',
    label: 'סושיאל חודשי',
    hint: 'פוסטים, רילס וסטוריז באופן שוטף',
    docTitle: 'לניהול סושיאל חודשי',
    goalHint: 'למשל: שאנשים ישאלו בהודעה פרטית על הזמנת מקום, ולא רק יעשו לייק',
    kpiHint: 'מספר אחד, עם יעד ותאריך. למשל: 15 הודעות פרטיות בחודש עם שאלה על מחיר או זמינות',
    amountHint: 'למשל: 12 פוסטים ו-4 רילס בחודש, וסטוריז שלוש פעמים בשבוע',
    delivery: 'החשבונות יישארו על שם העסק, ונבקש את קובצי המקור של כל הפוסטים.',
    deliverables: [
      item('social-plan', 'לוח תוכן חודשי', true),
      item('social-posts', 'פוסטים: תמונה או קרוסלה', true),
      item('social-reels', 'רילס', true),
      item('social-stories', 'סטוריז'),
      item('social-copy', 'כתיבת טקסטים לפוסטים', true),
      item('social-community', 'מענה לתגובות ולהודעות'),
      item('social-report', 'דוח חודשי'),
    ],
  },
]

export const channelOptions: BriefOption[] = [
  { id: 'instagram', label: 'אינסטגרם' },
  { id: 'facebook', label: 'פייסבוק' },
  { id: 'tiktok', label: 'טיקטוק' },
  { id: 'google', label: 'חיפוש בגוגל' },
  { id: 'youtube', label: 'יוטיוב' },
  { id: 'linkedin', label: 'לינקדאין' },
  { id: 'whatsapp', label: 'וואטסאפ' },
  { id: 'site', label: 'אתר' },
  { id: 'print', label: 'דפוס ושילוט' },
  { id: 'packaging', label: 'אריזה' },
]

export const toneOptions: BriefOption[] = [
  { id: 'warm', label: 'חם' },
  { id: 'professional', label: 'מקצועי' },
  { id: 'direct', label: 'ישיר' },
  { id: 'humor', label: 'הומוריסטי' },
  { id: 'premium', label: 'יוקרתי' },
  { id: 'young', label: 'צעיר' },
  { id: 'calm', label: 'רגוע' },
  { id: 'energetic', label: 'אנרגטי' },
  { id: 'reliable', label: 'אמין' },
  { id: 'simple', label: 'פשוט' },
  { id: 'bold', label: 'נועז' },
  { id: 'family', label: 'משפחתי' },
]

export const languageOptions: BriefOption[] = [
  { id: 'he', label: 'עברית' },
  { id: 'en', label: 'אנגלית' },
  { id: 'ru', label: 'רוסית' },
  { id: 'ar', label: 'ערבית' },
]

export const brandStatusOptions: BriefChoice<BrandStatus>[] = [
  {
    id: 'guide',
    label: 'יש לוגו ומדריך מותג',
    text: 'יש לוגו בקבצים מקוריים ומדריך מותג עם צבעים וגופנים, והעבודה צריכה להתאים להם.',
  },
  {
    id: 'logo',
    label: 'יש לוגו בלבד',
    text: 'יש לוגו, אבל אין מדריך מותג. צבעים וגופנים ייקבעו במהלך העבודה.',
  },
  { id: 'none', label: 'אין עדיין מיתוג', text: 'אין לוגו ואין שפה גרפית קבועה.' },
  {
    id: 'rebrand',
    label: 'יש מיתוג ורוצים להחליף',
    text: 'יש מיתוג קיים, והעבודה הזו נועדה להחליף אותו.',
  },
]

export const budgetOptions: BriefChoice<BudgetRange>[] = [
  { id: 'small', label: 'עד 5,000 ₪', text: 'עד 5,000 ₪' },
  { id: 'medium', label: '5,000 עד 15,000 ₪', text: '5,000 עד 15,000 ₪' },
  { id: 'large', label: '15,000 עד 40,000 ₪', text: '15,000 עד 40,000 ₪' },
  { id: 'xlarge', label: 'מעל 40,000 ₪', text: 'מעל 40,000 ₪' },
  { id: 'open', label: 'עוד לא נקבע', text: 'עוד לא נקבע' },
]

export const mediaBudgetOptions: BriefChoice<BudgetRange>[] = [
  { id: 'small', label: 'עד 3,000 ₪ בחודש', text: 'עד 3,000 ₪ בחודש' },
  { id: 'medium', label: '3,000 עד 10,000 ₪ בחודש', text: '3,000 עד 10,000 ₪ בחודש' },
  { id: 'large', label: '10,000 עד 30,000 ₪ בחודש', text: '10,000 עד 30,000 ₪ בחודש' },
  { id: 'xlarge', label: 'מעל 30,000 ₪ בחודש', text: 'מעל 30,000 ₪ בחודש' },
  { id: 'open', label: 'עוד לא נקבע', text: 'עוד לא נקבע' },
]

export const typeInfo = (type: BriefType) => briefTypes.find((entry) => entry.id === type) ?? briefTypes[0]

export const hasMediaBudget = (type: BriefType) => type === 'paid' || type === 'social'

const presetDeliverables = () =>
  briefTypes.flatMap((entry) => entry.deliverables.filter((option) => option.preset).map((option) => option.id))

const allDeliverables = briefTypes.flatMap((entry) => entry.deliverables)

export const defaultBriefInput = (today: string): BriefInput => ({
  type: 'paid',
  businessName: '',
  about: '',
  link: '',
  problem: '',
  goal: '',
  kpi: '',
  audienceWho: '',
  audiencePain: '',
  audienceBelief: '',
  message: '',
  proofs: '',
  tone: [],
  notUs: '',
  competitors: '',
  likes: '',
  dislikes: '',
  channels: [],
  deliverables: presetDeliverables(),
  deliverablesNote: '',
  languages: ['he'],
  accessibility: true,
  brandStatus: '',
  materials: '',
  mustInclude: '',
  budget: '',
  mediaBudget: '',
  budgetNote: '',
  deadline: '',
  deadlineNote: '',
  contactName: '',
  contactPhone: '',
  contactEmail: '',
  approver: '',
  date: today,
  credit: true,
})

export const sampleBriefInput = (date: string): BriefInput => ({
  ...defaultBriefInput(date),
  type: 'paid',
  businessName: 'מאפייה משפחתית לדוגמה',
  about:
    'מאפייה משפחתית בחיפה מ-2009, עם חנות בשכונת אחוזה ומשלוחים בכל אזור הצפון. אופים לחמי מחמצת, עוגות שמרים ועוגיות, בכשרות הרבנות',
  link: 'www.example.co.il',
  problem:
    'בחנוכה שעבר הגיעו מעסקים רק 12 הזמנות של מארזים, כולן מלקוחות קבועים. חברות באזור בוחרות מתנות לעובדים כבר בתחילת נובמבר, ולא יודעות שאנחנו מכינים מארזים עם הלוגו של החברה',
  goal: 'להפוך את מארזי החנוכה לעסקים למוצר עונתי קבוע, עם לקוחות עסקיים מחוץ למעגל הקבוע',
  kpi: '50 הזמנות של מארזים מעסקים חדשים עד 30.11.2026, מהטופס באתר או בוואטסאפ',
  audienceWho:
    'מנהלות משאבי אנוש ומנהלי משרד בחברות של 20 עד 200 עובדים בחיפה ובקריות, שאחראים על מתנות החג לעובדים',
  audiencePain:
    'צריך להזמין עשרות מארזים בבת אחת, לעמוד בתקציב לעובד ולקבל משלוח מסודר לכמה סניפים, בלי לרדוף אחרי הספק',
  audienceBelief: 'מארזים לחג זה עניין של חברות מתנות גדולות, ומאפייה קטנה לא תעמוד בהזמנה של 80 מארזים',
  message: 'מארז חנוכה טרי ממאפייה חיפאית, עם הלוגו שלכם, מגיע לכל העובדים באותו בוקר',
  proofs: [
    'אופים בלילה ושולחים בבוקר, לכל הסניפים של החברה בצפון',
    'בשנה שעברה סיפקנו הזמנה של 150 מארזים בלי עיכוב',
    'כשרות הרבנות',
    'חשבונית מס ומחיר לפי כמות',
  ].join('\n'),
  tone: ['warm', 'reliable', 'simple'],
  notUs: 'לא "מבצע מטורף", לא גרפיקה עמוסה ולא סופגניות מצוירות',
  competitors:
    'חברות מארזים ארציות שמוכרות באתר, ורשתות מאפיות עם מחלקה עסקית. אצלנו המארז נאפה באותו לילה, ואפשר לדבר עם מי שאופה',
  likes: 'מודעות של מאפיות קטנות שמצלמות את הידיים והבצק באור טבעי. רואים שהמוצר אמיתי',
  dislikes: 'צילום מגש מלמעלה על רקע לבן עם מחיר גדול באדום. זה נראה כמו קטלוג של סופרמרקט',
  channels: ['facebook', 'instagram', 'google', 'linkedin'],
  deliverables: ['paid-concept', 'paid-static', 'paid-video', 'paid-search', 'paid-landing', 'paid-tracking'],
  deliverablesNote:
    '4 מודעות תמונה בגדלים לפיד ולסטוריז, סרטון אחד של 15 שניות מהאפייה ו-10 כותרות למודעות חיפוש על "מארזי חנוכה לעובדים"',
  brandStatus: 'logo',
  materials: 'צילומים מקצועיים של המאפייה מהשנה שעברה וקבצי הלוגו',
  mustInclude: 'סמל הכשרות בכל מודעה. בלי מחירים במודעות, רק בדף הנחיתה',
  budget: 'medium',
  mediaBudget: 'medium',
  budgetNote: 'הקמפיין רץ חודש אחד, מ-1 עד 30 בנובמבר',
  deadline: '2026-10-29',
  deadlineNote: 'הקמפיין עולה ב-1 בנובמבר, כשחברות מתחילות לבחור מתנות לחנוכה',
  contactName: 'רונית לוי',
  contactPhone: '050-0000000',
  contactEmail: 'office@example.co.il',
  approver: 'אבי לוי, הבעלים',
  credit: false,
})

const isText = (value: unknown): value is string => typeof value === 'string'

const pickId = <T extends string>(value: unknown, options: { id: T }[]): T | '' =>
  options.find((option) => option.id === value)?.id ?? ''

const pickIds = (value: unknown, options: { id: string }[], fallback: string[]) =>
  Array.isArray(value) ? value.filter((entry) => options.some((option) => option.id === entry)) : fallback

const isoDate = (value: unknown) => (isText(value) && /^\d{4}-\d{2}-\d{2}$/.test(value) ? value : '')

export function restoreBriefInput(saved: unknown, today: string): BriefInput {
  const base = defaultBriefInput(today)
  if (!saved || typeof saved !== 'object') return base
  const draft = saved as Record<string, unknown>
  const text = (key: keyof BriefInput) => {
    const value = draft[key]
    return isText(value) ? value : (base[key] as string)
  }
  return {
    type: pickId(draft.type, briefTypes) || base.type,
    businessName: text('businessName'),
    about: text('about'),
    link: text('link'),
    problem: text('problem'),
    goal: text('goal'),
    kpi: text('kpi'),
    audienceWho: text('audienceWho'),
    audiencePain: text('audiencePain'),
    audienceBelief: text('audienceBelief'),
    message: text('message'),
    proofs: text('proofs'),
    tone: pickIds(draft.tone, toneOptions, base.tone).slice(0, MAX_TONE),
    notUs: text('notUs'),
    competitors: text('competitors'),
    likes: text('likes'),
    dislikes: text('dislikes'),
    channels: pickIds(draft.channels, channelOptions, base.channels),
    deliverables: pickIds(draft.deliverables, allDeliverables, base.deliverables),
    deliverablesNote: text('deliverablesNote'),
    languages: pickIds(draft.languages, languageOptions, base.languages),
    accessibility: typeof draft.accessibility === 'boolean' ? draft.accessibility : base.accessibility,
    brandStatus: pickId(draft.brandStatus, brandStatusOptions),
    materials: text('materials'),
    mustInclude: text('mustInclude'),
    budget: pickId(draft.budget, budgetOptions),
    mediaBudget: pickId(draft.mediaBudget, mediaBudgetOptions),
    budgetNote: text('budgetNote'),
    deadline: isoDate(draft.deadline),
    deadlineNote: text('deadlineNote'),
    contactName: text('contactName'),
    contactPhone: text('contactPhone'),
    contactEmail: text('contactEmail'),
    approver: text('approver'),
    date: isoDate(draft.date) || base.date,
    credit: typeof draft.credit === 'boolean' ? draft.credit : base.credit,
  }
}

const clean = (value: string) =>
  value
    .trim()
    .replace(/\s*\n+\s*/g, ' ')
    .replace(/[.\s]+$/, '')

const or = (value: string, fallback: string) => clean(value) || fallback

const sentence = (value: string, fallback: string) => {
  const text = or(value, fallback)
  return /[!?"״]$|\]$/.test(text) ? text : `${text}.`
}

const quoted = (value: string, fallback: string) => {
  const text = clean(value).replace(/^["״“”]+|["״“”]+$/g, '')
  return text ? `"${text}"` : fallback
}

export const formatDate = (iso: string) => {
  const [year, month, day] = iso.split('-')
  return year && month && day ? `${day}.${month}.${year}` : iso
}

const bareUrl = (value: string) => value.trim().replace(/^https?:\/\//i, '').replace(/\/$/, '')

export const joinHe = (items: string[]) =>
  items.length < 2 ? (items[0] ?? '') : `${items.slice(0, -1).join(', ')} ו${items[items.length - 1]}`

export const splitLines = (value: string) =>
  value
    .split('\n')
    .map((line) => line.trim().replace(/^[-•*·]\s*/, '').replace(/[.\s]+$/, ''))
    .filter(Boolean)

const labelsOf = (options: BriefOption[], ids: string[]) =>
  options.filter((option) => ids.includes(option.id)).map((option) => option.label)

type Entry = Exclude<BriefBlock, { kind: 'title' | 'meta' | 'intro' | 'heading' | 'credit' }>
type Section = { title: string; entries: Entry[] }

const field = (label: string, text: string): Entry => ({ kind: 'field', label, text })

function businessSection(input: BriefInput, org: string): Section {
  const entries = [
    field('שם העסק', org),
    field('מה העסק עושה', sentence(input.about, '[מה העסק מוכר, למי ובאיזה אזור]')),
  ]
  const link = bareUrl(input.link)
  if (link) entries.push(field('אתר או עמוד', link))
  return { title: 'על העסק', entries }
}

function problemSection(input: BriefInput): Section {
  return {
    title: 'הבעיה או ההזדמנות',
    entries: [{ kind: 'text', text: sentence(input.problem, '[מה לא עובד היום, או מה השתנה, ולמה צריך את העבודה עכשיו]') }],
  }
}

function goalSection(input: BriefInput): Section {
  return {
    title: 'מטרה ומדד הצלחה',
    entries: [
      field('המטרה', sentence(input.goal, '[מה צריך לקרות בעסק בזכות העבודה הזו]')),
      field('מדד הצלחה', sentence(input.kpi, '[מספר אחד, עם יעד ותאריך]')),
    ],
  }
}

function audienceSection(input: BriefInput): Section {
  return {
    title: 'קהל יעד',
    entries: [
      field('מי הם', sentence(input.audienceWho, '[מי הקהל: גיל, אזור, מצב ומה הם עושים]')),
      field('מה מציק להם', sentence(input.audiencePain, '[הבעיה או הצורך שלהם]')),
      field('מה הם חושבים היום', quoted(input.audienceBelief, '[מה הם חושבים היום עלינו או על התחום]')),
    ],
  }
}

function messageSection(input: BriefInput): Section {
  const proofs = splitLines(input.proofs)
  return {
    title: 'מסר מרכזי והוכחות',
    entries: [
      field('המסר', sentence(input.message, '[משפט אחד שהקהל צריך לזכור]')),
      proofs.length
        ? { kind: 'list', label: 'הוכחות', items: proofs }
        : field('הוכחות', '[עובדות, מספרים, המלצות או תעודות שמוכיחים את המסר]'),
    ],
  }
}

function toneSection(input: BriefInput): Section {
  const tone = labelsOf(toneOptions, input.tone)
  const entries = [
    field('הטון', tone.length ? `${joinHe(tone)}.` : '[שתיים או שלוש מילים שמתארות איך אנחנו נשמעים]'),
  ]
  if (clean(input.notUs)) entries.push(field('מה אנחנו לא', sentence(input.notUs, '')))
  return { title: 'טון ושפה', entries }
}

function referencesSection(input: BriefInput): Section {
  const entries: Entry[] = []
  if (clean(input.competitors)) entries.push(field('מתחרים', sentence(input.competitors, '')))
  if (clean(input.likes)) entries.push(field('דוגמאות שאנחנו אוהבים', sentence(input.likes, '')))
  if (clean(input.dislikes)) entries.push(field('דוגמאות שאנחנו לא אוהבים', sentence(input.dislikes, '')))
  if (!entries.length) {
    entries.push(field('מתחרים ודוגמאות', '[מי המתחרים, ודוגמאות שאתם אוהבים ושלא, עם הסבר קצר למה]'))
  }
  return { title: 'מתחרים ודוגמאות', entries }
}

function outputsSection(input: BriefInput): Section {
  const info = typeInfo(input.type)
  const channels = labelsOf(channelOptions, input.channels)
  const deliverables = labelsOf(info.deliverables, input.deliverables)
  const entries: Entry[] = [
    field('איפה זה יופיע', channels.length ? `${joinHe(channels)}.` : '[ערוצים ומקומות שבהם התוצרים יופיעו]'),
    deliverables.length
      ? { kind: 'list', label: 'תוצרים', items: deliverables }
      : field('תוצרים', '[מה בדיוק צריך לקבל בסוף העבודה]'),
  ]
  if (clean(input.deliverablesNote)) entries.push(field('כמויות וגדלים', sentence(input.deliverablesNote, '')))
  entries.push({ kind: 'text', text: info.delivery })
  return { title: 'ערוצים ותוצרים', entries }
}

function constraintsSection(input: BriefInput): Section {
  const languages = labelsOf(languageOptions, input.languages)
  const brand = brandStatusOptions.find((option) => option.id === input.brandStatus)
  const entries: Entry[] = [
    field('שפות', languages.length ? `${joinHe(languages)}.` : '[באילו שפות]'),
    field('מיתוג קיים', brand ? brand.text : '[מה כבר יש: לוגו, מדריך מותג, או כלום]'),
  ]
  if (input.accessibility) {
    entries.push(
      field(
        'נגישות',
        input.type === 'web'
          ? 'האתר צריך לעמוד בתקן הישראלי ת״י 5568 ברמת AA: ניגודיות מספקת, טקסט חלופי לתמונות, ניווט במקלדת וטפסים עם תוויות.'
          : 'ניגודיות מספקת בין טקסט לרקע, טקסט בגודל קריא בטלפון, כתוביות בכל סרטון וטקסט חלופי לתמונות באתר.',
      ),
    )
  }
  if (clean(input.materials)) entries.push(field('חומרים שכבר יש', sentence(input.materials, '')))
  if (clean(input.mustInclude)) entries.push(field('חובה ואסור', sentence(input.mustInclude, '')))
  return { title: 'מגבלות', entries }
}

function planSection(input: BriefInput): Section {
  const budget = budgetOptions.find((option) => option.id === input.budget)
  const media = mediaBudgetOptions.find((option) => option.id === input.mediaBudget)
  const entries: Entry[] = [
    field(
      'תקציב לעבודה',
      budget && budget.id !== 'open'
        ? `${budget.text}.`
        : 'עוד לא נקבע. נשמח להצעה שמפרידה בין מה שהכרחי לבין תוספות.',
    ),
  ]
  if (hasMediaBudget(input.type) && media) entries.push(field('תקציב מדיה', `${media.text}.`))
  if (clean(input.budgetNote)) entries.push(field('הערות לתקציב', sentence(input.budgetNote, '')))
  const deadline = input.deadline ? formatDate(input.deadline) : ''
  const reason = clean(input.deadlineNote)
  entries.push(
    field(
      'מועד אחרון',
      deadline ? `${deadline}${reason ? `. ${sentence(reason, '')}` : '.'}` : '[התאריך שבו התוצרים צריכים להיות מוכנים]',
    ),
    field('מאשר סופי', sentence(input.approver, '[מי מאשר את העבודה: שם ותפקיד]')),
    { kind: 'text', text: 'נבקש לוח זמנים עם שלבים, ומספר סבבי התיקונים שכלולים בהצעה.' },
  )
  return { title: 'תקציב, לוח זמנים ואישור', entries }
}

export function buildBrief(input: BriefInput): BriefBlock[] {
  const info = typeInfo(input.type)
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

  const sections = [
    businessSection(input, org),
    problemSection(input),
    goalSection(input),
    audienceSection(input),
    messageSection(input),
    toneSection(input),
    referencesSection(input),
    outputsSection(input),
    constraintsSection(input),
    planSection(input),
  ]

  const blocks: BriefBlock[] = [
    { kind: 'title', text: `בריף ${info.docTitle}: ${org}` },
    { kind: 'meta', items: meta },
    {
      kind: 'intro',
      text: 'הבריף מתאר מה צריך להפיק, למי ולמה, ואיך נדע שהעבודה הצליחה. נשמח לשאלות על כל סעיף לפני שמתחילים.',
    },
  ]
  sections.forEach((section, index) => {
    blocks.push({ kind: 'heading', text: `${index + 1}. ${section.title}` }, ...section.entries)
  })
  if (input.credit) {
    blocks.push({
      kind: 'credit',
      text: 'הבריף נכתב בעזרת',
      linkText: 'תבנית הבריף של AITERRA',
      href: GENERATOR_URL,
    })
  }
  return blocks
}

export function briefChecks(input: BriefInput): BriefCheck[] {
  const filled = (value: string) => value.trim().length > 0
  return [
    { id: 'goal', label: 'מטרה', done: filled(input.goal) },
    { id: 'kpi', label: 'מדד הצלחה', done: filled(input.kpi) },
    { id: 'audience', label: 'קהל יעד', done: filled(input.audienceWho) },
    { id: 'message', label: 'מסר מרכזי', done: filled(input.message) },
    { id: 'deadline', label: 'מועד אחרון', done: filled(input.deadline) },
  ]
}

export function messageWarning(message: string): string {
  const text = message.trim()
  if (!text) return ''
  const sentences = text.split(/[.!?](?:\s+|$)/).filter((part) => part.trim())
  if (sentences.length > 1) return 'יש כאן יותר ממשפט אחד. השאירו את החשוב ביותר והעבירו את השאר להוכחות.'
  if (text.length > 140) return 'המשפט ארוך. נסו לקצר אותו כך שאפשר לקרוא אותו בשנייה.'
  return ''
}

export function kpiWarning(kpi: string): string {
  const text = kpi.trim()
  if (!text || /\d/.test(text)) return ''
  return 'אין כאן מספר. מדד הצלחה צריך מספר שאפשר לבדוק, למשל 30 פניות עד סוף החודש.'
}

const escapeHtml = (value: string) =>
  value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

export function briefToHtml(blocks: BriefBlock[]): string {
  const body = blocks
    .map((block) => {
      if (block.kind === 'title') return `<h1>${escapeHtml(block.text)}</h1>`
      if (block.kind === 'meta') return `<p class="meta">${escapeHtml(block.items.join(' · '))}</p>`
      if (block.kind === 'intro') return `<p class="intro">${escapeHtml(block.text)}</p>`
      if (block.kind === 'heading') return `<h2>${escapeHtml(block.text)}</h2>`
      if (block.kind === 'field') {
        return `<p><strong>${escapeHtml(block.label)}:</strong> ${escapeHtml(block.text)}</p>`
      }
      if (block.kind === 'list') {
        const items = block.items.map((entry) => `  <li>${escapeHtml(entry)}</li>`).join('\n')
        return `<p><strong>${escapeHtml(block.label)}:</strong></p>\n<ul>\n${items}\n</ul>`
      }
      if (block.kind === 'text') return `<p>${escapeHtml(block.text)}</p>`
      return `<p class="credit">${escapeHtml(block.text)} <a href="${escapeHtml(block.href)}">${escapeHtml(block.linkText)}</a></p>`
    })
    .join('\n')
  return `<section dir="rtl" lang="he">\n${body}\n</section>`
}

export function briefToText(blocks: BriefBlock[]): string {
  return blocks
    .map((block) => {
      if (block.kind === 'meta') return block.items.join(' · ')
      if (block.kind === 'title' || block.kind === 'intro' || block.kind === 'text') return block.text
      if (block.kind === 'heading') return `\n${block.text}`
      if (block.kind === 'field') return `${block.label}: ${block.text}`
      if (block.kind === 'list') return `${block.label}:\n${block.items.map((entry) => `• ${entry}`).join('\n')}`
      return `\n${block.text} ${block.linkText}: ${block.href}`
    })
    .join('\n')
    .trim()
}

export function briefDocument(blocks: BriefBlock[], title: string): string {
  return `<!doctype html>
<html lang="he" dir="rtl">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${escapeHtml(title)}</title>
<style>@page{size:A4;margin:18mm 16mm}body{max-width:760px;margin:40px auto;padding:0 20px;font:15px/1.65 Arial,Helvetica,sans-serif;color:#1a1f33}h1{margin:0 0 6px;font-size:26px;line-height:1.25}h2{margin:22px 0 6px;padding-bottom:4px;border-bottom:1px solid #e2ddd6;font-size:17px}p{margin:0 0 6px}ul{margin:0 0 8px;padding-inline-start:22px}li{margin-bottom:2px}.meta{color:#5c6072;font-size:13px}.intro{padding-bottom:10px;border-bottom:1px solid #e2ddd6}.credit{margin-top:22px;color:#5c6072;font-size:12px}a{color:#2447d6}@media print{body{max-width:none;margin:0;padding:0}h2{break-after:avoid}p,li{break-inside:avoid}}</style>
</head>
<body>
${briefToHtml(blocks)}
</body>
</html>
`
}
