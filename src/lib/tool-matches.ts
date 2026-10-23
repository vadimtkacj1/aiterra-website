import { tools, type ToolEntry } from './tools'

const TOOL_KEYWORDS: Record<string, string[]> = {
  '/tools/qr-code-generator': ['qr', 'כרטיס עסק', 'ביקורות', 'דפוס', 'שילוט'],
  '/tools/barcode-generator': ['ברקוד', 'מלאי', 'קטלוג', 'מוצרים', 'חנות'],
  '/tools/holiday-greetings': ['ברכ', 'אימייל מרקטינג', 'דיוור', 'ניוזלטר', 'שימור לקוחות'],
  '/tools/whatsapp-link-generator': ['וואטסאפ', 'whatsapp', 'לידים'],
  '/tools/whatsapp-auto-reply-messages': ['וואטסאפ', 'whatsapp', 'בוט', 'שירות לקוחות', 'מענה'],
  '/tools/website-spec-template': ['אפיון', 'בניית אתר', 'בניית אתרים', 'בחירת ספק', 'סוכנות דיגיטל', 'פרילנסר', 'רידיזיין'],
  '/tools/email-signature-generator': ['אימייל', 'מייל', 'מיתוג'],
  '/tools/creative-brief-template': ['מיתוג', 'קמפיין', 'קריאייטיב', 'פרסום', 'לוגו', 'וידאו'],
  '/tools/image-compressor': ['ביצועים', 'core web vitals', 'איטי', 'מהירות', 'תמונות', 'webp'],
  '/tools/hebrew-fonts': ['עיצוב', 'מיתוג', 'פונט', 'טיפוגרפ', 'ux', 'ui'],
  '/tools/google-snippet-preview': ['seo', 'קידום', 'מילות מפתח', 'ai overviews', 'geo'],
  '/tools/percentage-calculator': ['roi', 'החזר השקעה', 'המרות', 'תקציב'],
  '/tools/allocation-number': ['חשבונית', 'הנהלת חשבונות', 'icount', 'חשבשבת', 'רואי חשבון'],
  '/tools/vat-calculator': ['מחירים', 'חשבונית', 'הנהלת חשבונות', 'כמה עולה'],
  '/tools/amount-in-words': ['קבלה', 'צ׳ק', "צ'ק", 'הנהלת חשבונות'],
  '/tools/company-lookup': ['ח.פ', 'רשם החברות', 'בחירת ספק', 'ספקים', 'בדיקת חברה'],
  '/tools/id-number-check': ['תעודת זהות', 'טפסים', 'טופס', 'פורטל לקוחות'],
  '/tools/israeli-phone-format': ['טלפון', 'אנשי קשר', 'רשימת לקוחות', 'crm', 'דיוור'],
  '/tools/image-to-text': ['מסמכים', 'סריקה', 'הקלדה ידנית', 'ידני'],
  '/tools/self-employed-tax-calculator': ['עצמאי', 'פרילנסר', 'רואי חשבון', 'יועצי מס'],
  '/tools/self-employed-pension-deposits': ['עצמאי', 'פרילנסר', 'פנסיה', 'קרן השתלמות'],
  '/tools/loan-calculator': ['הלוואה', 'מימון'],
  '/tools/price-quote-generator': ['הצעת מחיר', 'מחירון', 'פרילנסר', 'עלויות'],
  '/tools/employment-confirmation-letter': ['עובד', 'גיוס', 'משאבי אנוש', 'מסמכים'],
  '/tools/signature-generator': ['חתימה', 'חתימה אלקטרונית', 'חתימה דיגיטלית', 'מסמך', 'הצעת מחיר'],
  '/tools/nda-generator': ['פרילנסר', 'בחירת ספק', 'פיתוח תוכנה', 'אפליקצי'],
  '/tools/privacy-policy-generator': ['פרטיות', 'אבטחה', 'ga4', 'פיקסל', 'אנליטיקס', 'מדידת המרות', 'crm'],
  '/tools/accessibility-statement-generator': ['נגישות', '5568', 'wcag', 'הנגשה'],
  '/tools/website-terms-generator': ['תקנון', 'חנות', 'איקומרס', 'woocommerce', 'shopify'],
  '/tools/work-days-calculator': ['ימי עבודה', 'כמה זמן', 'לוח זמנים', 'התהליך'],
  '/tools/shift-schedule-maker': ['משמרות', 'סידור עבודה', 'עובדים', 'שיבוץ', 'מסעדה'],
  '/tools/monthly-timesheet': ['שעות עבודה', 'נוכחות', 'עובדים', 'שעות נוספות'],
  '/tools/work-hours-calculator': ['שעות עבודה', 'חיסכון בזמן', 'יעילות', 'משרה'],
}

const MAX_TOOLS = 3

function seedOffset(seed: string): number {
  let hash = 0
  for (let index = 0; index < seed.length; index += 1) {
    hash = (hash * 31 + seed.charCodeAt(index)) % 100000
  }
  return hash
}

export function relatedTools(haystack: string, seed: string): ToolEntry[] {
  const text = haystack.toLowerCase()
  const offset = seedOffset(seed)
  return tools
    .map((tool, index) => ({
      tool,
      score: (TOOL_KEYWORDS[tool.path] ?? []).filter((keyword) => text.includes(keyword)).length,
      order: (index + offset) % tools.length,
    }))
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score || a.order - b.order)
    .slice(0, MAX_TOOLS)
    .map((entry) => entry.tool)
}
