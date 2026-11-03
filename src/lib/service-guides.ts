export type ServiceGuideLink = { href: string; label: string; kind: 'guide' | 'tool' }

const guide = (slug: string, label: string): ServiceGuideLink => ({ href: `/blog/${slug}`, label, kind: 'guide' })
const tool = (slug: string, label: string): ServiceGuideLink => ({ href: `/tools/${slug}`, label, kind: 'tool' })

const MAINTENANCE = [
  guide('website-maintenance-cost-yearly', 'כמה עולה תחזוקת אתר בשנה'),
  guide('website-security-guide', 'אבטחת אתרים: מדריך לעסק'),
  guide('cheap-website-hidden-costs', 'העלויות הנסתרות של אתר זול'),
  guide('amendment-13-website-adaptation-cost-israel', 'התאמת אתר לתיקון 13: כמה עולה'),
  tool('website-security-check', 'בדיקת אבטחת אתר'),
  tool('website-speed-test', 'בדיקת מהירות אתר'),
  tool('amendment-13-website-checklist', 'בדיקת אתר לתיקון 13'),
]

const AUTOMATION = [
  guide('business-automation-cost-roi', 'כמה עולה אוטומציה לעסק'),
  guide('small-business-automation-15-processes-israeli-tools', 'אוטומציה לעסקים קטנים: 15 תהליכים'),
  guide('business-automation-12-processes', '12 תהליכים להפסיק לעשות ידנית'),
  guide('whatsapp-business-api-crm-integration', 'חיבור וואטסאפ ביזנס API ל-CRM'),
  guide('industrial-automation-where-to-start', 'אוטומציה לתעשייה: מאיפה מתחילים'),
  tool('whatsapp-api-cost-calculator', 'מחשבון עלות WhatsApp API'),
  tool('price-quote-generator', 'מחולל הצעת מחיר'),
  tool('allocation-number', 'מספר הקצאה לחשבונית'),
]

const AI_AGENTS = [
  guide('ai-agents-solutions-comparison-israel', 'סוכן AI לעסק: השוואת 7 פתרונות'),
  guide('ai-agent-voice-agent-cost-israel', 'כמה עולה סוכן AI וסוכן קולי'),
  guide('ai-chatbot-website-cost-israel', 'כמה עולה צ׳אט בוט AI לאתר'),
  guide('ai-agent-for-business-setup-timeline-checklist', 'כמה זמן לוקח להקים סוכן AI'),
  tool('ai-token-calculator', 'מחשבון טוקנים ועלות API'),
  tool('prompt-generator', 'מחולל פרומפטים בעברית'),
  tool('ai-readiness-checker', 'בדיקת נראות האתר ב-AI'),
]

const SEO = [
  guide('seo-cost-monthly-israel', 'כמה עולה קידום אתרים בגוגל'),
  guide('seo-services', 'איך בוחרים חברת קידום אתרים'),
  guide('keyword-research-guide', 'מחקר מילות מפתח בעברית'),
  guide('geo-ai-search-optimization', 'קידום אתרים ב-ChatGPT (GEO)'),
  tool('keyword-ideas', 'מחולל מילות מפתח'),
  tool('google-snippet-preview', 'בדיקת כותרת ותיאור לגוגל'),
  tool('backlink-checker', 'בדיקת קישורים נכנסים'),
]

const ECOMMERCE = [
  guide('business-site-vs-online-store', 'אתר תדמית או חנות אונליין'),
  guide('ecommerce-store-that-sells', 'הקמת חנות אינטרנטית שמוכרת'),
  guide('shopify-vs-woocommerce-israel', 'שופיפיי או ווקומרס לחנות בישראל'),
  tool('profit-margin-calculator', 'מחשבון רווח גולמי ותמחור'),
  tool('website-terms-generator', 'מחולל תקנון לאתר'),
  tool('privacy-policy-generator', 'מחולל מדיניות פרטיות'),
]

const DEVELOPMENT = [
  guide('custom-software-development-cost-israel', 'כמה עולה פיתוח תוכנה בהתאמה אישית'),
  guide('business-management-system-build-or-buy', 'מערכת ניהול: מערכת מדף או פיתוח'),
  guide('custom-crm-vs-fireberry-monday', 'מונדיי, פיירברי או CRM מותאם'),
  guide('crm-implementation-cost-israel', 'כמה עולה הטמעת CRM'),
  tool('website-spec-template', 'מסמך אפיון לדוגמה'),
  tool('price-quote-generator', 'מחולל הצעת מחיר'),
]

const MOBILE_APPS = [
  guide('app-development-cost-israel', 'כמה עולה בניית אפליקציה לעסק'),
  guide('how-to-publish-app-google-play-app-store', 'איך מעלים אפליקציה לגוגל פליי ולאפ סטור'),
  guide('mobile-app-development-companies-israel-how-to-choose', 'איך בוחרים חברת פיתוח אפליקציות'),
  tool('website-spec-template', 'מסמך אפיון לדוגמה'),
]

const PRIVACY = [
  guide('amendment-13-website-adaptation-cost-israel', 'התאמת אתר לתיקון 13: כמה עולה'),
  tool('amendment-13-website-checklist', 'בדיקת אתר לתיקון 13'),
  tool('privacy-policy-generator', 'מחולל מדיניות פרטיות'),
  tool('website-security-check', 'בדיקת אבטחת אתר'),
]

const AI_SEARCH = [
  guide('geo-ai-search-optimization', 'קידום אתרים ב-ChatGPT (GEO)'),
  guide('seo-cost-monthly-israel', 'כמה עולה קידום אתרים בגוגל'),
  tool('ai-readiness-checker', 'בדיקת נראות האתר ב-AI'),
  tool('llms-txt-generator', 'מחולל llms.txt לבוטים של AI'),
]

export const SERVICE_GUIDES: Record<string, ServiceGuideLink[]> = {
  maintenance: MAINTENANCE,
  automation: AUTOMATION,
  'ai-agents': AI_AGENTS,
  'voice-agents': AI_AGENTS,
  'ai-website-integration': AI_AGENTS,
  seo: SEO,
  marketing: SEO,
  ecommerce: ECOMMERCE,
  development: DEVELOPMENT,
  'desktop-app-development': DEVELOPMENT,
  'mobile-app-development': MOBILE_APPS,
  'privacy-compliance': PRIVACY,
  'ai-search': AI_SEARCH,
}
