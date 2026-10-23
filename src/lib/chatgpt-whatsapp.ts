export const WHATSAPP_AI_CHECKED = '23 באוקטובר 2026'

export type Verdict = 'yes' | 'limited' | 'no' | 'risk'

export type GoalLink = { href: string; label: string }

export type Goal = {
  id: string
  label: string
  who: 'private' | 'business'
  verdict: Verdict
  headline: string
  how: string[]
  link?: GoalLink
}

export const verdictLabels: Record<Verdict, string> = {
  yes: 'מותר ועובד',
  limited: 'תלוי במדינה',
  no: 'לא אפשרי מישראל',
  risk: 'לא מומלץ',
}

export const whatsappAiSources = {
  openaiTransition: {
    href: 'https://openai.com/index/chatgpt-whatsapp-transition/',
    label: 'OpenAI: Continuing your ChatGPT experience beyond WhatsApp',
  },
  openaiHelp: {
    href: 'https://help.openai.com/en/articles/10193193-1-800-chatgpt-calling-and-messaging-chatgpt-with-your-phone',
    label: 'OpenAI Help Center: 1-800-ChatGPT',
  },
  solutionTerms: {
    href: 'https://www.whatsapp.com/legal/business-solution-terms',
    label: 'WhatsApp Business Solution Terms, סעיף 4.7 ״AI Providers״',
  },
  aiProviders: {
    href: 'https://developers.facebook.com/documentation/business-messaging/whatsapp/pricing/ai-providers',
    label: 'Meta for Developers: מדיניות AI Providers ב-WhatsApp Business Platform',
  },
  metaAi: {
    href: 'https://faq.whatsapp.com/2257017191175152',
    label: 'WhatsApp Help Center: About Meta AI',
  },
  terms: {
    href: 'https://www.whatsapp.com/legal/terms-of-service',
    label: 'WhatsApp Terms of Service, ״Acceptable Use of Our Services״',
  },
}

export const goals: Goal[] = [
  {
    id: 'chatgpt-number',
    label: 'לדבר עם ChatGPT בוואטסאפ כמו פעם',
    who: 'private',
    verdict: 'no',
    headline: 'מאז 15 בינואר 2026 ChatGPT לא זמין בוואטסאפ למספרים ישראליים.',
    how: [
      'OpenAI הודיעה ש-ChatGPT לא יהיה זמין בוואטסאפ אחרי 15 בינואר 2026, בגלל שינוי במדיניות ובתנאים של WhatsApp.',
      'לפי מרכז העזרה של OpenAI, השירות חזר לאזור הכלכלי האירופי (EEA), והזמינות נקבעת לפי הקידומת של מספר הוואטסאפ. ישראל לא באזור הזה.',
      'במקום זה: אפליקציית ChatGPT לאנדרואיד ול-iPhone, או chatgpt.com בדפדפן.',
    ],
  },
  {
    id: 'meta-ai',
    label: 'לשאול שאלות AI בתוך וואטסאפ',
    who: 'private',
    verdict: 'limited',
    headline: 'Meta AI מובנה בוואטסאפ, אבל זמין רק בחלק מהמדינות.',
    how: [
      'לפי WhatsApp, אפשר לכתוב ל-Meta AI בכל שפה, אבל הוא זמין רק במדינות מסוימות, ולא תמיד לכל המשתמשים בהן.',
      'אם הוא פתוח אצלכם, תראו עיגול צבעוני בלשונית הצ׳אטים. אם לא, אין דרך רשמית להפעיל אותו.',
      'Meta משתמשת בפרומפטים ובהודעות שמשתפים איתו כדי לשפר את ה-AI, אז לא כדאי לשתף שם מידע רגיש של לקוחות.',
    ],
  },
  {
    id: 'customer-bot',
    label: 'בוט AI שעונה ללקוחות שלי על העסק',
    who: 'business',
    verdict: 'yes',
    headline: 'מותר: בוט שירות לעסק שלכם הוא לא ״עוזר AI כללי״.',
    how: [
      'התנאים של WhatsApp אוסרים על ספקי AI להפוך את ה-AI עצמו לשירות העיקרי. כשה-AI הוא כלי נלווה לשירות של העסק, למשל מענה על שעות, מחירים ותורים, זה בתחום המותר.',
      'עובדים דרך WhatsApp Business Platform (ה-API הרשמי), דרך ספק מורשה או ישירות מול Meta.',
      'מותר להיעזר בחברת AI כספק טכנולוגי, אבל אסור שהנתונים מהשיחות ישמשו לאימון מודלים של אחרים.',
    ],
    link: { href: '/tools/whatsapp-api-cost-calculator', label: 'מחשבון עלות WhatsApp Business API' },
  },
  {
    id: 'general-assistant',
    label: 'להציע ללקוחות ״ChatGPT בוואטסאפ״ משלי',
    who: 'business',
    verdict: 'no',
    headline: 'אסור מישראל: זה בדיוק מה שהתנאים חסמו מ-15 בינואר 2026.',
    how: [
      'לפי Meta, מ-15 בינואר 2026 ספקי AI רשאים להציע עוזר AI כללי ב-WhatsApp Business Platform רק במקומות שבהם Meta מחויבת לכך בחוק.',
      'ברשימה של Meta מאוקטובר 2026 מופיעות מדינות האזור הכלכלי האירופי, ברזיל וטורקיה. ישראל לא ברשימה.',
      'מה שכן אפשר: בוט שממוקד בעסק שלכם, במוצרים ובשירות שלכם.',
    ],
  },
  {
    id: 'auto-replies',
    label: 'הודעות אוטומטיות פשוטות, בלי AI',
    who: 'business',
    verdict: 'yes',
    headline: 'מותר ועובד באפליקציית WhatsApp Business, בלי API.',
    how: [
      'הודעת פתיחה, הודעת היעדרות ותשובות מהירות מוגדרות בתוך האפליקציה עצמה.',
      'זה לא AI: ההודעות קבועות, אבל הן עונות ללקוח מיד, גם בלילה.',
    ],
    link: { href: '/tools/whatsapp-auto-reply-messages', label: 'נוסחים להודעות אוטומטיות' },
  },
  {
    id: 'personal-number-bot',
    label: 'לחבר בוט למספר הוואטסאפ הרגיל שלי',
    who: 'business',
    verdict: 'risk',
    headline: 'לא מומלץ: תנאי השימוש של WhatsApp אוסרים הודעות אוטומטיות ושימוש לא אישי בלי אישור.',
    how: [
      'כלים לא רשמיים שמפעילים את WhatsApp Web אוטומטית עוקפים את התנאים, שאוסרים בין השאר auto-messaging ושימוש לא אישי בשירות בלי אישור של WhatsApp.',
      'הסיכון הוא חסימה של המספר, ואיתו של כל השיחות עם הלקוחות.',
      'הדרך המותרת היא מספר שמחובר ל-WhatsApp Business Platform.',
    ],
    link: { href: '/blog/whatsapp-bot-for-business', label: 'מדריך: בוט וואטסאפ לעסק' },
  },
]

export const goalById = (id: string) => goals.find((goal) => goal.id === id)

export const decisionRows: { need: string; option: string; status: Verdict }[] = [
  { need: 'שאלה כללית ל-AI', option: 'אפליקציית ChatGPT, ‏Gemini או Claude', status: 'yes' },
  { need: 'AI בתוך וואטסאפ', option: 'Meta AI, אם הוא זמין אצלכם', status: 'limited' },
  { need: 'ChatGPT דרך 1-800-ChatGPT בוואטסאפ', option: 'לא זמין למספרים ישראליים', status: 'no' },
  { need: 'מענה מיידי ללקוחות בלי AI', option: 'הודעות אוטומטיות ב-WhatsApp Business', status: 'yes' },
  { need: 'בוט AI שעונה על העסק שלכם', option: 'WhatsApp Business Platform וספק מורשה', status: 'yes' },
  { need: 'שירות ״צ׳אט AI כללי״ לציבור', option: 'לא מותר לספקי AI מישראל', status: 'no' },
]
