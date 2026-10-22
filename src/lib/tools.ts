export type ToolIconName =
  | 'accessibility'
  | 'calculator'
  | 'calendar'
  | 'calendarRange'
  | 'clock'
  | 'file'
  | 'hourglass'
  | 'image'
  | 'landmark'
  | 'lock'
  | 'mail'
  | 'message'
  | 'percent'
  | 'qr'
  | 'receipt'
  | 'scroll'
  | 'search'
  | 'shield'
  | 'type'
  | 'wrench'

export type ToolCategory = 'marketing' | 'money' | 'legal' | 'dates'

export type ToolEntry = {
  path: string
  title: string
  description: string
  category: ToolCategory
  icon: ToolIconName
}

export const TOOLS_HUB_PATH = '/tools'

export const TOOLS_REVIEWED = '2026-10-22'

export type ToolCategoryInfo = {
  id: ToolCategory
  label: string
  title: string
  description: string
  service: { label: string; text: string; href: string }
}

export const toolCategories: ToolCategoryInfo[] = [
  {
    id: 'marketing',
    label: 'שיווק ועיצוב',
    title: 'שיווק ועיצוב',
    description: 'קודי QR, קישורים לוואטסאפ, חתימות, תמונות ופונטים לעסק ולאתר.',
    service: {
      label: 'שיווק ופרסום ממומן',
      text: 'קמפיינים בגוגל ובמטא, קריאייטיב ודפי נחיתה שנמדדים בעלות לליד.',
      href: '/services/marketing',
    },
  },
  {
    id: 'money',
    label: 'כספים וחישובים',
    title: 'כספים וחישובים',
    description: 'מע״מ, אחוזים והצעות מחיר: החישובים שעסק עושה כל יום.',
    service: {
      label: 'אוטומציה לעסקים',
      text: 'הצעות מחיר, חשבוניות ותזכורות תשלום שיוצאים לבד מה-CRM.',
      href: '/services/automation',
    },
  },
  {
    id: 'legal',
    label: 'משפטי ואתר',
    title: 'משפטי ואתר',
    description: 'מדיניות פרטיות, הצהרת נגישות ותקנון: הסט המשפטי של כל אתר עסקי.',
    service: {
      label: 'תחזוקת אתרים',
      text: 'עדכוני אבטחה, בדיקות נגישות ועמידה בתיקון 13 באתר קיים.',
      href: '/services/maintenance',
    },
  },
  {
    id: 'dates',
    label: 'תאריכים וזמנים',
    title: 'תאריכים וזמנים',
    description: 'תאריך עברי, ימי עבודה ושעות: חישובי זמן בלוח העברי והלועזי.',
    service: {
      label: 'פיתוח תוכנה לעסקים',
      text: 'מערכות תורים, נוכחות ולוחות זמנים שמחשבים תאריכים בדיוק.',
      href: '/services/development',
    },
  },
]

export const tools: ToolEntry[] = [
  {
    path: '/tools/qr-code-generator',
    title: 'יצירת קוד QR',
    description: 'קוד QR לקישור, לוואטסאפ, לביקורת בגוגל, ל-Wi-Fi או לכרטיס ביקור, עם לוגו, ב-PNG או SVG.',
    category: 'marketing',
    icon: 'qr',
  },
  {
    path: '/tools/holiday-greetings',
    title: 'ברכות לחג ללקוחות ולעובדים',
    description: 'ברכות מוכנות לחנוכה, לראש השנה, לפסח ולכל חג, ללקוחות, לעובדים ולספקים, עם שם העסק ושליחה ישירה בוואטסאפ.',
    category: 'marketing',
    icon: 'message',
  },
  {
    path: '/tools/whatsapp-link-generator',
    title: 'יצירת קישור לוואטסאפ',
    description: 'קישור ישיר לוואטסאפ עם הודעה מוכנה, קוד QR וכפתור לאתר.',
    category: 'marketing',
    icon: 'message',
  },
  {
    path: '/tools/website-spec-template',
    title: 'מסמך אפיון אתר לדוגמה',
    description: 'שאלון אפיון מודרך שיוצר מסמך אפיון מסודר: מטרות, טבלת עמודים, תוכן, פונקציות, נגישות ותקציב, מוכן לשליחה לחברות בניית אתרים.',
    category: 'marketing',
    icon: 'file',
  },
  {
    path: '/tools/email-signature-generator',
    title: 'מחולל חתימה למייל',
    description: 'חתימה מעוצבת למייל בעברית או באנגלית, מוכנה להדבקה ב-Gmail, ב-Outlook וב-Apple Mail.',
    category: 'marketing',
    icon: 'mail',
  },
  {
    path: '/tools/image-compressor',
    title: 'הקטנת תמונות והמרה ל-WebP',
    description: 'דוחסים תמונות, ממירים ל-WebP, JPEG או PNG ומגבילים רוחב, עם השוואה של לפני ואחרי. התמונות לא עולות לשרת.',
    category: 'marketing',
    icon: 'image',
  },
  {
    path: '/tools/hebrew-fonts',
    title: 'פונטים בעברית',
    description: '62 פונטים חינמיים עם עברית מ-Google Fonts: תצוגה עם הטקסט שלכם, סינון לפי סגנון וקוד מוכן לאתר.',
    category: 'marketing',
    icon: 'type',
  },
  {
    path: '/tools/google-snippet-preview',
    title: 'בדיקת כותרת ותיאור לגוגל',
    description: 'תצוגה של התוצאה בגוגל במחשב ובטלפון, עם ספירת תווים ומילים ומדידה בפיקסלים של הכותרת והתיאור.',
    category: 'marketing',
    icon: 'search',
  },
  {
    path: '/tools/percentage-calculator',
    title: 'מחשבון אחוזים',
    description: 'אחוז ממספר, שינוי באחוזים, מחיר אחרי ולפני הנחה, ומרווח רווח מול תוספת.',
    category: 'money',
    icon: 'percent',
  },
  {
    path: '/tools/allocation-number',
    title: 'בדיקת מספר הקצאה לחשבונית',
    description: 'האם חשבונית מס צריכה מספר הקצאה: הסף לפי תאריך החשבונית, מ-25,000 ₪ ב-2024 ועד 5,000 ₪ מיוני 2026.',
    category: 'money',
    icon: 'receipt',
  },
  {
    path: '/tools/vat-calculator',
    title: 'מחשבון מע״מ',
    description: 'מוסיפים או מחלצים מע״מ של 18% מכל סכום, כולל 0% לאילת וכמה סכומים יחד.',
    category: 'money',
    icon: 'receipt',
  },
  {
    path: '/tools/self-employed-tax-calculator',
    title: 'מחשבון מס הכנסה לעצמאי 2026',
    description: 'מס הכנסה, ביטוח לאומי ודמי בריאות לעצמאי לפי מדרגות 2026, עם נטו לחודש ולשנה ומקדמה משוערת.',
    category: 'money',
    icon: 'landmark',
  },
  {
    path: '/tools/loan-calculator',
    title: 'מחשבון הלוואה',
    description: 'החזר חודשי, סך הריבית ולוח סילוקין מלא בשפיצר, קרן שווה, בלון או גרייס, עם עמלות והשוואה בין שתי הצעות.',
    category: 'money',
    icon: 'calculator',
  },
  {
    path: '/tools/price-quote-generator',
    title: 'מחולל הצעת מחיר',
    description: 'הצעת מחיר מסודרת עם הנחות, מע״מ או עוסק פטור, מוכנה להדפסה או לשמירה כ-PDF בגודל A4.',
    category: 'money',
    icon: 'file',
  },
  {
    path: '/tools/nda-generator',
    title: 'מחולל הסכם סודיות (NDA)',
    description: 'הסכם סודיות הדדי או חד-צדדי בין חברות, מול פרילנסר או עובד, עם חריגים, משך סודיות ופיצוי מוסכם, מוכן להעתקה ולהדפסה.',
    category: 'legal',
    icon: 'lock',
  },
  {
    path: '/tools/privacy-policy-generator',
    title: 'מחולל מדיניות פרטיות',
    description: 'מדיניות פרטיות לאתר לפי חוק הגנת הפרטיות ותיקון 13: טפסים, עוגיות, דיוור וספקי שירות, מוכנה להעתקה.',
    category: 'legal',
    icon: 'shield',
  },
  {
    path: '/tools/accessibility-statement-generator',
    title: 'מחולל הצהרת נגישות',
    description: 'הצהרת נגישות לאתר לפי תקנות הנגישות, בעברית או באנגלית, מוכנה להעתקה.',
    category: 'legal',
    icon: 'accessibility',
  },
  {
    path: '/tools/website-terms-generator',
    title: 'מחולל תקנון לאתר',
    description: 'תקנון לאתר תדמית, לחנות אינטרנטית או לאתר שירותים, עם סעיפי ביטול עסקה לפי חוק הגנת הצרכן.',
    category: 'legal',
    icon: 'scroll',
  },
  {
    path: '/tools/hebrew-date-converter',
    title: 'המרת תאריך עברי ללועזי',
    description: 'ממירים תאריך עברי ללועזי ולהפך, כולל אחרי השקיעה ואדר א׳ וב׳, עם גיל עברי ותאריך בר ובת מצווה.',
    category: 'dates',
    icon: 'calendarRange',
  },
  {
    path: '/tools/retirement-age-calculator',
    title: 'מחשבון גיל פרישה',
    description: 'גיל הפרישה לנשים ולגברים לפי החוק והתיקון של 2022, התאריך המדויק וכמה זמן נשאר.',
    category: 'dates',
    icon: 'hourglass',
  },
  {
    path: '/tools/work-days-calculator',
    title: 'מחשבון ימי עבודה',
    description: 'ימי עבודה בין תאריכים לפי החגים בישראל, מועד יעד בימי עסקים ותאריך תשלום בשוטף + 30 עד 90.',
    category: 'dates',
    icon: 'calendar',
  },
  {
    path: '/tools/work-hours-calculator',
    title: 'מחשבון שעות עבודה',
    description: 'כמה שעות עבדתם, גם במשמרת לילה, בשעות ודקות ובשבר עשרוני, ודוח חודשי עם שעות נוספות ושכר.',
    category: 'dates',
    icon: 'clock',
  },
]

export const otherTools = (path: string) => {
  const current = tools.find((tool) => tool.path === path)
  const rest = tools.filter((tool) => tool.path !== path)
  if (!current) return rest
  return [
    ...rest.filter((tool) => tool.category === current.category),
    ...rest.filter((tool) => tool.category !== current.category),
  ]
}

export const toolsIn = (category: ToolCategory) => tools.filter((tool) => tool.category === category)
