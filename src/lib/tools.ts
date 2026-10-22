export type ToolEntry = {
  path: string
  title: string
  description: string
}

export const TOOLS_HUB_PATH = '/tools'

export const tools: ToolEntry[] = [
  {
    path: '/tools/accessibility-statement-generator',
    title: 'מחולל הצהרת נגישות',
    description: 'הצהרת נגישות לאתר לפי תקנות הנגישות, בעברית או באנגלית, מוכנה להעתקה.',
  },
  {
    path: '/tools/website-terms-generator',
    title: 'מחולל תקנון לאתר',
    description: 'תקנון לאתר תדמית, לחנות אינטרנטית או לאתר שירותים, עם סעיפי ביטול עסקה לפי חוק הגנת הצרכן.',
  },
  {
    path: '/tools/vat-calculator',
    title: 'מחשבון מע״מ',
    description: 'מוסיפים או מחלצים מע״מ של 18% מכל סכום, כולל 0% לאילת וכמה סכומים יחד.',
  },
  {
    path: '/tools/email-signature-generator',
    title: 'מחולל חתימה למייל',
    description: 'חתימה מעוצבת למייל בעברית או באנגלית, מוכנה להדבקה ב-Gmail, ב-Outlook וב-Apple Mail.',
  },
  {
    path: '/tools/whatsapp-link-generator',
    title: 'יצירת קישור לוואטסאפ',
    description: 'קישור ישיר לוואטסאפ עם הודעה מוכנה, קוד QR וכפתור לאתר.',
  },
  {
    path: '/tools/qr-code-generator',
    title: 'יצירת קוד QR',
    description: 'קוד QR לקישור, לוואטסאפ, לביקורת בגוגל, ל-Wi-Fi או לכרטיס ביקור, עם לוגו, ב-PNG או SVG.',
  },
  {
    path: '/tools/price-quote-generator',
    title: 'מחולל הצעת מחיר',
    description: 'הצעת מחיר מסודרת עם הנחות, מע״מ או עוסק פטור, מוכנה להדפסה או לשמירה כ-PDF בגודל A4.',
  },
  {
    path: '/tools/privacy-policy-generator',
    title: 'מחולל מדיניות פרטיות',
    description: 'מדיניות פרטיות לאתר לפי חוק הגנת הפרטיות ותיקון 13: טפסים, עוגיות, דיוור וספקי שירות, מוכנה להעתקה.',
  },
  {
    path: '/tools/image-compressor',
    title: 'הקטנת תמונות והמרה ל-WebP',
    description: 'דוחסים תמונות, ממירים ל-WebP, JPEG או PNG ומגבילים רוחב, עם השוואה של לפני ואחרי. התמונות לא עולות לשרת.',
  },
  {
    path: '/tools/percentage-calculator',
    title: 'מחשבון אחוזים',
    description: 'אחוז ממספר, שינוי באחוזים, מחיר אחרי ולפני הנחה, ומרווח רווח מול תוספת.',
  },
]

export const otherTools = (path: string) => tools.filter((tool) => tool.path !== path)
