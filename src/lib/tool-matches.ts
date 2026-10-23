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
  '/tools/minimum-wage-2026': ['שכר', 'עובדים', 'משרה', 'תלוש'],
  '/tools/vacation-days-calculator': ['ימי חופשה', 'עובדים', 'משאבי אנוש'],
  '/tools/maternity-leave-calculator': ['חופשת לידה', 'עובדות', 'משאבי אנוש'],
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
  '/tools/sick-days-calculator': ['ימי מחלה', 'דמי מחלה', 'עובדים', 'משאבי אנוש'],
  '/tools/notice-period-calculator': ['הודעה מוקדמת', 'פיטורים', 'התפטרות', 'עובדים'],
  '/tools/recuperation-pay-calculator': ['דמי הבראה', 'עובדים', 'תלוש', 'משאבי אנוש'],
  '/tools/exchange-rate-invoice': ['שער יציג', 'מטבע חוץ', 'דולר', 'חשבונית', 'ייבוא'],
  '/tools/days-between-dates': ['כמה זמן', 'לוח זמנים', 'תאריך', 'דדליין'],
  '/tools/cpi-indexation-calculator': ['מדד', 'הצמדה', 'שכר דירה', 'מחירון'],
  '/tools/cancel-transaction-checker': ['ביטול עסקה', 'החזרות', 'חנות', 'איקומרס', 'תקנון'],
  '/tools/whatsapp-api-cost-calculator': ['וואטסאפ', 'whatsapp', 'בוט', 'הודעות'],
  '/tools/ai-readiness-checker': ['geo', 'chatgpt', 'ai overviews', 'בינה מלאכותית', 'נראות'],
  '/tools/social-image-resizer': ['אינסטגרם', 'פייסבוק', 'סטורי', 'רשתות', 'וידאו קצר'],
  '/tools/word-counter': ['תוכן', 'בלוג', 'קופירייטינג', 'מילות מפתח'],
  '/tools/prompt-generator': ['בינה מלאכותית', 'chatgpt', 'סוכן', 'סוכני ai', 'אוטומציות ai'],
  '/tools/ai-glossary': ['בינה מלאכותית', 'סוכני ai', 'geo', 'chatgpt', 'ai overviews'],
  '/tools/ai-subscription-prices': ['chatgpt', 'בינה מלאכותית', 'כמה עולה', 'סוכני ai'],
  '/tools/ai-token-calculator': ['סוכן', 'בוט', 'api', 'סוכני ai'],
  '/tools/payment-demand-letter': ['חשבונית', 'גבייה', 'תשלום', 'לקוחות', 'הנהלת חשבונות'],
  '/tools/ai-policy-generator': ['בינה מלאכותית', 'סוכני ai', 'פרטיות', 'chatgpt', 'עובדים'],
  '/tools/freelancer-hourly-rate': ['פרילנסר', 'עצמאי', 'תמחור', 'הצעת מחיר'],
  '/tools/profit-margin-calculator': ['תמחור', 'רווח', 'חנות', 'מוצרים', 'איקומרס'],
  '/tools/iban-calculator': ['iban', 'העברה בנקאית', 'סליקה', 'תשלומים'],
  '/tools/child-allowance-calculator-2026': ['ילדים', 'ביטוח לאומי', 'קצבה'],
  '/tools/exempt-dealer-threshold': ['עוסק פטור', 'עצמאי', 'פרילנסר', 'מע״מ'],
  '/tools/rental-income-tax-calculator': ['שכר דירה', 'נדל״ן', 'מס הכנסה'],
  '/tools/hebrew-calendar-2027': ['לוח שנה', 'חגים', 'תאריך עברי'],
  '/tools/gematria-calculator': ['גימטריה', 'שם העסק', 'מיתוג'],
  '/tools/word-search-maker': ['תפזורת', 'חינוך', 'הדפסה'],
  '/tools/photo-consent-form': ['צילום', 'תמונות', 'אינסטגרם', 'רשתות', 'פרטיות'],
  '/tools/ai-tools-hebrew': ['בינה מלאכותית', 'כלי ai', 'chatgpt', 'אוטומציות ai'],
  '/tools/chatgpt-whatsapp': ['וואטסאפ', 'whatsapp', 'chatgpt', 'בוט'],
  '/tools/fridge-storage-times': ['מסעדה', 'מזון', 'קייטרינג'],
  '/tools/shoe-size-chart': ['חנות', 'אופנה', 'איקומרס'],
  '/tools/death-notice-generator': ['הודעה', 'נוסח'],
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
