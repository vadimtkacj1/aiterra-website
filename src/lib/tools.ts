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

export const toolCategories: { id: ToolCategory; label: string; title: string }[] = [
  { id: 'marketing', label: 'שיווק ועיצוב', title: 'כלים לשיווק, לעיצוב ולאתר' },
  { id: 'money', label: 'כספים וחישובים', title: 'מחשבונים ומסמכים לעסק' },
  { id: 'legal', label: 'משפטי ואתר', title: 'המסמכים המשפטיים של האתר' },
  { id: 'dates', label: 'תאריכים וזמנים', title: 'תאריכים, ימים ושעות' },
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
    path: '/tools/whatsapp-link-generator',
    title: 'יצירת קישור לוואטסאפ',
    description: 'קישור ישיר לוואטסאפ עם הודעה מוכנה, קוד QR וכפתור לאתר.',
    category: 'marketing',
    icon: 'message',
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
    path: '/tools/vat-calculator',
    title: 'מחשבון מע״מ',
    description: 'מוסיפים או מחלצים מע״מ של 18% מכל סכום, כולל 0% לאילת וכמה סכומים יחד.',
    category: 'money',
    icon: 'receipt',
  },
  {
    path: '/tools/price-quote-generator',
    title: 'מחולל הצעת מחיר',
    description: 'הצעת מחיר מסודרת עם הנחות, מע״מ או עוסק פטור, מוכנה להדפסה או לשמירה כ-PDF בגודל A4.',
    category: 'money',
    icon: 'file',
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
