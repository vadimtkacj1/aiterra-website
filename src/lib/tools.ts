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
  | 'signature'
  | 'type'
  | 'wrench'

export type ToolCategory = 'marketing' | 'money' | 'legal' | 'dates'

export type ToolEntry = {
  path: string
  title: string
  description: string
  category: ToolCategory
  icon: ToolIconName
  reviewed?: string
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
    path: '/tools/barcode-generator',
    title: 'יצירת ברקוד למוצר',
    description: 'ברקוד EAN-13, UPC-A, EAN-8 או Code 128 עם ספרת ביקורת אוטומטית, להורדה ב-SVG או PNG ולהדפסה על דף מדבקות A4.',
    category: 'marketing',
    reviewed: '2026-10-23',
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
    path: '/tools/whatsapp-auto-reply-messages',
    title: 'הודעות אוטומטיות לוואטסאפ עסקי',
    description: 'נוסחים מוכנים להודעת פתיחה, להודעת היעדרות ולתשובות מהירות בוואטסאפ עסקי לפי סוג העסק, וגם מענה אוטומטי למייל.',
    category: 'marketing',
    reviewed: '2026-10-23',
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
    path: '/tools/keyboard-language-fix',
    title: 'כתבתי באנגלית במקום בעברית',
    description: 'הקלדתם בשפה הלא נכונה? מדביקים את הטקסט ומקבלים אותו מתוקן לעברית או לאנגלית לפי המקלדת.',
    category: 'marketing',
    reviewed: '2026-10-23',
    icon: 'type',
  },
  {
    path: '/tools/image-to-text',
    title: 'המרת תמונה לטקסט בעברית',
    description: 'ממירים תמונה או צילום מסך לטקסט בעברית ובאנגלית, מתקנים, מעתיקים או פותחים ב-Word. התמונה לא עולה לשרת.',
    category: 'marketing',
    reviewed: '2026-10-23',
    icon: 'search',
  },
  {
    path: '/tools/israeli-phone-format',
    title: 'קידומת ישראל +972 למספר טלפון',
    description: 'מספר ישראלי בפורמט בינלאומי לוואטסאפ, לחיוג מחו״ל ול-CRM, עם סוג המספר, וניקוי רשימה שלמה לקובץ CSV.',
    category: 'marketing',
    reviewed: '2026-10-23',
    icon: 'message',
  },
  {
    path: '/tools/creative-brief-template',
    title: 'תבנית בריף לקמפיין ולמיתוג',
    description: 'שאלון מודרך שיוצר בריף מסודר לקמפיין, למיתוג, ללוגו, לסרטון, לאתר או לסושיאל, מוכן להדפסה ולשליחה.',
    category: 'marketing',
    reviewed: '2026-10-23',
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
    path: '/tools/amount-in-words',
    title: "סכום במילים לצ'ק",
    description: "סכום בספרות למילים בנוסח של צ'ק, חשבונית או קבלה, עם שקלים חדשים ואגורות, וגם מספרים במילים בזכר ובנקבה.",
    category: 'money',
    reviewed: '2026-10-23',
    icon: 'receipt',
  },
  {
    path: '/tools/company-lookup',
    title: 'בדיקת חברה לפי ח.פ. או שם',
    description: 'בודקים לפי ח.פ. או לפי שם אם חברה פעילה, מחוקה, בפירוק או מפרת חוק, ממאגר רשם החברות שמתעדכן כל יום.',
    category: 'money',
    reviewed: '2026-10-23',
    icon: 'search',
  },
  {
    path: '/tools/id-number-check',
    title: 'בדיקת תעודת זהות וספרת ביקורת',
    description: 'בודקים אם מספר תעודת זהות, ח.פ. או עוסק מורשה תקין לפי ספרת הביקורת, מחשבים ספרת ביקורת ומקבלים נוסחה לאקסל.',
    category: 'money',
    reviewed: '2026-10-23',
    icon: 'shield',
  },
  {
    path: '/tools/minimum-wage-2026',
    title: 'שכר מינימום 2026',
    description: 'שכר המינימום מ-1.4.2026: 6,443.85 ₪ לחודש ו-35.40 ₪ לשעה, לנוער לפי גיל ולמשרה חלקית, ובדיקה אם השכר עומד במינימום.',
    category: 'money',
    reviewed: '2026-10-23',
    icon: 'calculator',
  },
  {
    path: '/tools/self-employed-tax-calculator',
    title: 'מחשבון מס הכנסה לעצמאי 2026',
    description: 'מס הכנסה, ביטוח לאומי ודמי בריאות לעצמאי לפי מדרגות 2026, עם נטו לחודש ולשנה ומקדמה משוערת.',
    category: 'money',
    icon: 'landmark',
  },
  {
    path: '/tools/self-employed-pension-deposits',
    title: 'מחשבון קרן השתלמות ופנסיה לעצמאי',
    description: 'כמה להפקיד עד 31.12 לקרן השתלמות ולפנסיה לפי תקרות 2026, כולל פנסיה חובה, וכמה מס תחסכו.',
    category: 'money',
    reviewed: '2026-10-23',
    icon: 'calculator',
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
    path: '/tools/employment-confirmation-letter',
    title: 'מכתב אישור העסקה לעובד',
    description: 'אישור העסקה לבנק, למשכנתא, לשכירות, לגן או לשגרירות, בעברית או באנגלית, מוכן להדפסה או ל-PDF.',
    category: 'legal',
    reviewed: '2026-10-23',
    icon: 'file',
  },
  {
    path: '/tools/signature-generator',
    title: 'יצירת חתימה אונליין',
    description: 'חתימה בכתב יד כקובץ PNG שקוף: מציירים עם העכבר, האצבע או עט, או מקלידים שם, ומוסיפים למסמך Word או PDF.',
    category: 'legal',
    reviewed: '2026-10-23',
    icon: 'signature',
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
    path: '/tools/vacation-days-calculator',
    title: 'מחשבון ימי חופשה לפי ותק',
    description: 'כמה ימי חופשה מגיעים לפי ותק, לפי החוק וצו ההרחבה, בשבוע של 5 או 6 ימים, כולל חלק יחסי לשנה חלקית.',
    category: 'dates',
    reviewed: '2026-10-23',
    icon: 'calendarRange',
  },
  {
    path: '/tools/maternity-leave-calculator',
    title: 'מחשבון חופשת לידה',
    description: 'תאריך סיום חופשת הלידה ויום החזרה לעבודה, 26 או 15 שבועות, שבועות בתשלום מביטוח לאומי והגנה מפיטורים.',
    category: 'dates',
    reviewed: '2026-10-23',
    icon: 'calendar',
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
    path: '/tools/shift-schedule-maker',
    title: 'סידור עבודה שבועי למשמרות',
    description: 'בונים סידור משמרות לשבוע עם אילוצים ומילוי אוטומטי, מדפיסים, מורידים לאקסל ושולחים לעובדים בוואטסאפ.',
    category: 'dates',
    reviewed: '2026-10-23',
    icon: 'calendarRange',
  },
  {
    path: '/tools/monthly-timesheet',
    title: 'דוח שעות עבודה חודשי להדפסה',
    description: 'טופס נוכחות חודשי עם שבתות וחגים מסומנים, להדפסה ריק או עם שעות, עם שעות נוספות 125% ו-150% וקובץ ל-Excel.',
    category: 'dates',
    reviewed: '2026-10-23',
    icon: 'calendar',
  },
  {
    path: '/tools/work-hours-calculator',
    title: 'מחשבון שעות עבודה',
    description: 'כמה שעות עבדתם, גם במשמרת לילה, בשעות ודקות ובשבר עשרוני, ודוח חודשי עם שעות נוספות ושכר.',
    category: 'dates',
    icon: 'clock',
  },
  {
    path: '/tools/sick-days-calculator',
    title: 'מחשבון ימי מחלה לפי חוק',
    description: 'כמה ימי מחלה צברתם, יום וחצי לחודש ועד 90, וכמה משלמים על תקופת מחלה: יום ראשון לא, שני ושלישי חצי, מהרביעי מלא.',
    category: 'money',
    reviewed: '2026-10-23',
    icon: 'calculator',
  },
  {
    path: '/tools/notice-period-calculator',
    title: 'מחשבון הודעה מוקדמת',
    description: 'כמה ימי הודעה מוקדמת מגיעים בפיטורים ובהתפטרות, לעובד חודשי ולעובד שעתי, ובאיזה תאריך תקופת ההודעה מסתיימת.',
    category: 'dates',
    reviewed: '2026-10-23',
    icon: 'hourglass',
  },
  {
    path: '/tools/recuperation-pay-calculator',
    title: 'מחשבון דמי הבראה 2026',
    description: 'דמי הבראה 2026 במגזר הפרטי לפי 451.50 ₪ ליום: 5 עד 10 ימים לפי ותק, משרה חלקית, חלק משנה והשלמה מ-418 ₪.',
    category: 'money',
    reviewed: '2026-10-23',
    icon: 'receipt',
  },
  {
    path: '/tools/exchange-rate-invoice',
    title: 'שער יציג לחשבונית לפי תאריך',
    description: 'השער היציג של בנק ישראל לכל תאריך, המרה לשקלים ובחזרה עם מע״מ, ושורה מוכנה לחשבונית במטבע חוץ.',
    category: 'money',
    reviewed: '2026-10-23',
    icon: 'landmark',
  },
  {
    path: '/tools/days-between-dates',
    title: 'מחשבון ימים בין תאריכים',
    description: 'כמה ימים, שבועות וחודשים יש בין תאריכים, הוספת ימים לתאריך וספירה לאחור לחגים, עם קישור לשיתוף.',
    category: 'dates',
    reviewed: '2026-10-23',
    icon: 'calendarRange',
  },
  {
    path: '/tools/cpi-indexation-calculator',
    title: 'מחשבון הצמדה למדד',
    description: 'שכר דירה או כל סכום צמוד למדד המחירים לצרכן, לפי מדד ידוע או מדד בגין, עם רצפה והודעה מוכנה למשכיר.',
    category: 'money',
    reviewed: '2026-10-23',
    icon: 'percent',
  },
  {
    path: '/tools/cancel-transaction-checker',
    title: 'ביטול עסקה: עד מתי ובכמה',
    description: 'עד מתי אפשר לבטל עסקה באינטרנט, בטלפון או בחנות, כמה דמי ביטול מותר לגבות, ונוסח מוכן להודעת ביטול.',
    category: 'legal',
    reviewed: '2026-10-23',
    icon: 'shield',
  },
  {
    path: '/tools/whatsapp-api-cost-calculator',
    title: 'מחשבון עלות WhatsApp Business API',
    description: 'כמה עולה וואטסאפ עסקי API בחודש: תעריפי Meta לישראל מ-1.10.2026 לכל סוג הודעה, בדולרים ובשקלים.',
    category: 'marketing',
    reviewed: '2026-10-23',
    icon: 'message',
  },
  {
    path: '/tools/ai-readiness-checker',
    title: 'בדיקת נראות האתר בבינה מלאכותית',
    description: 'בודקים אם ChatGPT, Gemini, Perplexity וגוגל יכולים לקרוא את האתר: robots.txt לכל בוט AI, חסימה ב-Cloudflare, noindex וטקסט בלי JavaScript.',
    category: 'marketing',
    reviewed: '2026-10-23',
    icon: 'search',
  },
  {
    path: '/tools/social-image-resizer',
    title: 'גודל תמונה לאינסטגרם ולרשתות',
    description: '24 גדלים לאינסטגרם, סטורי, פייסבוק, וואטסאפ, טיקטוק, לינקדאין, יוטיוב וגוגל, עם חיתוך והורדה בגודל המדויק.',
    category: 'marketing',
    reviewed: '2026-10-23',
    icon: 'image',
  },
  {
    path: '/tools/word-counter',
    title: 'ספירת מילים ותווים בעברית',
    description: 'סופרים מילים ותווים בעברית, זמן קריאה ומגבלות התווים של X, SMS, אינסטגרם וגוגל, ומסירים ניקוד בלחיצה.',
    category: 'marketing',
    reviewed: '2026-10-23',
    icon: 'type',
  },
  {
    path: '/tools/prompt-generator',
    title: 'מחולל פרומפטים בעברית',
    description: 'בוחרים משימה לעסק וממלאים פרטים, ומקבלים פרומפט מוכן ל-ChatGPT, ל-Claude ול-Gemini, ועוד 37 פרומפטים מוכנים.',
    category: 'marketing',
    reviewed: '2026-10-23',
    icon: 'message',
  },
  {
    path: '/tools/ai-glossary',
    title: 'מילון מונחי בינה מלאכותית',
    description: '90 מונחים בעברית פשוטה: מה זה טוקן, פרומפט, LLM, RAG, MCP, סוכן AI ו-GEO, עם דוגמה מהעסק.',
    category: 'marketing',
    reviewed: '2026-10-23',
    icon: 'search',
  },
  {
    path: '/tools/ai-subscription-prices',
    title: 'כמה עולה ChatGPT בשקלים',
    description: 'מחירי ChatGPT, Claude, Gemini, Copilot ו-Perplexity בשקלים: Plus ב-70 ₪ בישראל, חיוב חודשי או שנתי ועלות לצוות.',
    category: 'marketing',
    reviewed: '2026-10-23',
    icon: 'receipt',
  },
  {
    path: '/tools/ai-token-calculator',
    title: 'מחשבון טוקנים ועלות API',
    description: 'כמה טוקנים יש בטקסט בעברית וכמה זה עולה ב-GPT, Claude ו-Gemini: מחירים למיליון טוקנים ועלות חודשית בשקלים.',
    category: 'marketing',
    reviewed: '2026-10-23',
    icon: 'calculator',
  },
  {
    path: '/tools/payment-demand-letter',
    title: 'מכתב התראה ללקוח שלא משלם',
    description: 'תזכורת תשלום, דרישה רשמית או מכתב התראה לפני תביעה, עם טבלת חשבוניות, מועד תשלום והודעה לוואטסאפ.',
    category: 'legal',
    reviewed: '2026-10-23',
    icon: 'receipt',
  },
  {
    path: '/tools/ai-policy-generator',
    title: 'מדיניות שימוש בבינה מלאכותית',
    description: 'נוהל AI לעובדים בעברית: כלים מאושרים, מידע אסור לפי חוק הגנת הפרטיות ותיקון 13, בדיקת תוצרים והצהרת עובד.',
    category: 'legal',
    reviewed: '2026-10-23',
    icon: 'shield',
  },
  {
    path: '/tools/freelancer-hourly-rate',
    title: 'מחשבון תעריף שעתי לפרילנסר',
    description: 'כמה לגבות לשעה כעצמאי: תעריף לפי נטו רצוי, הוצאות, שעות לחיוב, מס 2026 ומע״מ לעוסק מורשה או פטור.',
    category: 'money',
    reviewed: '2026-10-23',
    icon: 'clock',
  },
  {
    path: '/tools/profit-margin-calculator',
    title: 'מחשבון רווח גולמי ותמחור מוצר',
    description: 'מחיר מכירה לפי מרווח או תוספת על העלות, לפני ואחרי מע״מ, ונקודת איזון לפי הוצאות קבועות.',
    category: 'money',
    reviewed: '2026-10-23',
    icon: 'percent',
  },
  {
    path: '/tools/iban-calculator',
    title: 'מחשבון IBAN ישראלי',
    description: 'IBAN לכל בנק בישראל מקוד בנק, סניף וחשבון, לפי נוסחת בנק ישראל, ובדיקה אם IBAN קיים תקין.',
    category: 'money',
    reviewed: '2026-10-23',
    icon: 'landmark',
  },
  {
    path: '/tools/child-allowance-calculator-2026',
    title: 'מחשבון קצבת ילדים 2026',
    description: 'קצבת ילדים 2026 לפי הביטוח הלאומי: 173 ₪ לילד הראשון, 219 ₪ לשני עד הרביעי, תוספת 113 ₪ ו-58 ₪ לחיסכון לכל ילד.',
    category: 'money',
    reviewed: '2026-10-23',
    icon: 'calculator',
  },
  {
    path: '/tools/exempt-dealer-threshold',
    title: 'תקרת עוסק פטור 2026',
    description: 'תקרת עוסק פטור 2026 היא 122,833 ₪: כמה נשאר עד התקרה, באיזה חודש תעברו אותה ומה קורה כשעוברים לעוסק מורשה.',
    category: 'money',
    reviewed: '2026-10-23',
    icon: 'receipt',
  },
  {
    path: '/tools/rental-income-tax-calculator',
    title: 'מחשבון מס על שכר דירה',
    description: 'מס על שכר דירה 2026: פטור עד 5,654 ₪ בחודש, הפחתה שקל מול שקל, מסלול 10% ומסלול רגיל, השוואה בין שלושת המסלולים.',
    category: 'money',
    reviewed: '2026-10-23',
    icon: 'landmark',
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

export const toolReviewed = (path: string) =>
  tools.find((tool) => tool.path === path)?.reviewed ?? TOOLS_REVIEWED

export const toolsIn = (category: ToolCategory) => tools.filter((tool) => tool.category === category)
