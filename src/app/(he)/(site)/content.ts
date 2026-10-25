export type HeaderNavItem = {
  id: string
  label: string
  href: string
  submenu?: 'services' | 'portfolio'
  flag?: 'il' | 'us'
  overviewLabel?: string
}

export const header = {
  brand: 'AITERRA',
  navLabel: 'ניווט ראשי',
  mobileNavLabel: 'ניווט נייד',
  menuOpen: 'תפריט',
  menuClose: 'סגירת תפריט',
  expand: 'פתיחה',
  collapse: 'סגירה',
  cta: { label: 'לקבלת הצעת מחיר', href: '/contact' },
  nav: [
    {
      id: 'services',
      label: 'שירותים',
      href: '/services',
      submenu: 'services',
      overviewLabel: 'כל השירותים',
    },
    { id: 'blog', label: 'בלוג', href: '/blog' },
    {
      id: 'portfolio',
      label: 'תיק עבודות',
      href: '/projects',
      submenu: 'portfolio',
      overviewLabel: 'כל הפרויקטים',
    },
    { id: 'about', label: 'אודות הסוכנות', href: '/about' },
    { id: 'lang', label: 'English', href: '/en', flag: 'us' },
  ] as HeaderNavItem[],
}

export const hero = {
  headline: ['סוכנות בניית אתרים', 'ושיווק דיגיטלי'],
  tags: ['שיווק', 'פרסום', 'קריאייטיב', 'קידום'],
  lede: [
    'ב-AITERRA בונים אתרי מכירות, אתרי תדמית ודפי נחיתה, מפתחים פתרונות מותאמים לעסקים',
    'ומנהלים את מערך השיווק הדיגיטלי - מקמפיינים במטא ובגוגל ועד קידום אורגני במנועי החיפוש.',
  ],
  primaryAction: { label: 'בואו נדבר', href: '/contact' },
  secondaryAction: { label: 'לכל הפרויקטים', href: '/#v2-portfolio' },
}

export type HeroProject = {
  id: string
  label: string
  href: string
  surface: string
  shot: string
}

export const heroProjects: HeroProject[] = [
  {
    id: 'olie',
    label: 'אולי 6',
    href: '/#v2-portfolio',
    surface: '#e6ecf8',
    shot: '/images/portfolio/tiles/olie-6.webp',
  },
  {
    id: 'neot-sade',
    label: 'נאות שדה',
    href: '/#v2-portfolio',
    surface: '#f4e8d2',
    shot: '/images/portfolio/tiles/neot-sade.webp',
  },
  {
    id: 'hofit',
    label: 'חופית קוסמטיקס',
    href: '/#v2-portfolio',
    surface: '#e2ece0',
    shot: '/images/portfolio/tiles/hofit-cosmetics.webp',
  },
  {
    id: 'karin-cohen',
    label: 'קרין כהן',
    href: '/#v2-portfolio',
    surface: '#ece2f3',
    shot: '/images/portfolio/tiles/karin-cohen.webp',
  },
  {
    id: 'brand-identity',
    label: 'מיתוג ותדמית',
    href: '/#v2-portfolio',
    surface: '#f7ded6',
    shot: '/images/portfolio/tiles/brand-identity.webp',
  },
]

export const heroRails = {
  projectsTitle: 'לצפייה בפרויקטים שלנו',
  projectsAdvance: 'לפרויקט הבא',
  topicsTitle: 'טכנולוגיות ותחומים שאנחנו מומחים בהם',
  topicsAdvance: 'לתחומים הבאים',
}

export const heroTopics = [
  'מותאם אישית',
  'קידום אורגני',
  'שיווק',
  'אוטומציה עסקית',
  'קריאייטיב',
  'חיבור מערכות',
  'פרסום',
  'בניית אתרים',
  'חנויות אונליין',
  'אפליקציות',
  'עיצוב UI/UX',
  'מיתוג',
]

export const about = {
  eyebrow: 'על Aiterra',
  heading: ['אתר, שיווק, קריאייטיב ופיתוח', 'בלי לנהל חמישה ספקים שונים.'],
  lede: 'כדי לבנות נוכחות דיגיטלית שבאמת עובדת, בדרך כלל צריך לחבר בין לא מעט אנשים: מי שמאפיין את הפרויקט, מי שמעצב אותו, מי שמפתח, מי שמנהל את הקמפיינים, מי שיוצר את התוכן ומי שאחראי על הקידום.',
  outro: 'הצוות שלנו מוכן להתחיל להרים את התדמית הדיגיטלית שלכם ברשתות. ואתם?',
  action: { label: 'בואו נשבר את הפרויקט', href: '/contact' },
}

export type AboutRole = {
  id: string
  title: string
  art: string
  text: string
}

export const aboutRoles: AboutRole[] = [
  {
    id: 'project-manager',
    title: 'מנהל פרויקט',
    art: '/images/about-card4.webp',
    text: 'מנהל אחד שמרכז את כל התהליך, מתאם בין כל בעלי המקצוע ודואג שהפרויקט יצא לדרך בזמן ובתקציב.',
  },
  {
    id: 'marketing',
    title: 'אנשי שיווק',
    art: '/images/about-card3.webp',
    text: 'אנחנו מחברים בין אסטרטגיה וקהל יעד כדי ליצור מערכת שיווקית שעובדת יחד עם האתר ומביאה את האנשים הנכונים לעסק.',
  },
  {
    id: 'build',
    title: 'מתכנתים ומעצבים',
    art: '/images/about-card2.webp',
    text: 'עיצוב חוויית משתמש ופיתוח מותאם אישית, שנבנים יחד כדי שהאתר ייראה מצוין ויעבוד מהר.',
  },
  {
    id: 'seo',
    title: 'מקדמי אתרים',
    art: '/images/about-card1.webp',
    text: 'קידום אורגני ומבנה טכני נכון, כדי שהאתר יגיע לעמוד הראשון ויביא תנועה איכותית לאורך זמן.',
  },
]

export const stats = {
  heading: ['הטכנולוגיה מאחורי העבודה.', 'התוצאה בחזית.'],
  lede: 'אנחנו עובדים עם סטאק מודרני - Next.js, React ו-TypeScript - ובודקים כל פרויקט מול נתונים ולא מול תחושות: מהירות טעינה, יציבות לאורך זמן ואחוז ההמרה בפועל. הטכנולוגיה היא האמצעי, התוצאה העסקית היא מה שנמדד בסוף. אותו צוות בונה גם את מה שמאחורי האתר: אוטומציה לעסקים, סוכני AI שעונים ללקוחות בעברית, ומערכות ניהול ופורטלים בהתאמה אישית.',
}

export type StatItem = {
  id: string
  value: string
  label: string
  text: string
}

export const statItems: StatItem[] = [
  {
    id: 'campaigns',
    value: '50+',
    label: 'קמפיינים פעילים',
    text: 'קמפיינים שמנוהלים ונמדדים באופן שוטף כחלק מפעילות השיווק של לקוחות הסוכנות.',
  },
  {
    id: 'clients',
    value: '75+',
    label: 'בעלי עסקים מרוצים',
    text: 'לקוחות שלקחו צעד קדימה והגדילו את ה-traffic של העסק שלהם בזכותנו.',
  },
  {
    id: 'uptime',
    value: '100%',
    label: 'שירותים יציבים',
    text: 'תשתיות שנבנות כדי להישאר פעילות, מהירות ויציבות גם כשהעסק ממשיך לגדול.',
  },
  {
    id: 'performance',
    value: '95+',
    label: 'ציון Performance',
    text: 'דגש על ביצועים ומהירות טעינה כחלק מתהליך הפיתוח ולא כתיקון שמגיע בסוף.',
  },
]

export const services = {
  lead: {
    text: 'בואו נהפוך את המספרים לתוצאות בעסק שלך',
    action: { label: 'בואו נשבר את הפרויקט', href: '/contact' },
  },
  eyebrow: 'השירותים שלנו',
  heading: ['כל המעטפת לעסק שלך.'],
  lede: 'אפיון, עיצוב, פיתוח, קמפיינים וקידום אורגני - כל שלב בבניית הנוכחות הדיגיטלית שלכם נמצא אצלנו תחת קורת גג אחת, עם מנהל פרויקט אחד שמלווה אתכם מהשיחה הראשונה, דרך ההשקה ואחריה.',
}

export type ServiceTab = {
  id: string
  label: string
  tags: string[]
  question: string
  paragraphs: string[]
  action: { label: string; href: string }
}

export const serviceTabs: ServiceTab[] = [
  {
    id: 'marketing',
    label: 'שיווק',
    tags: [
      'בניית אסטרטגיה וקהל יעד',
      'שיחות אפיון',
      'הקמה וניהול קמפיינים במטא',
      'צילום ועריכת סרטונים',
      'קמפיינים בגוגל',
      'בניית תסריטים',
    ],
    question: 'מה מיוחד בשיווק שלנו?',
    paragraphs: [
      'אנחנו לא רק מעלים מודעות ומחכים לתוצאות. אנחנו בונים את כל המהלך: מהבנת העסק והקהל, דרך האסטרטגיה והמסרים ועד לקריאייטיב שמניע בפיד.',
      'כך האתר, המודעות, התוכן והקמפיין לא מרגישים כמו חלקים נפרדים, אלא כמו מערכת אחת שנבנתה כדי להפוך תשומת לב לתנועה.',
    ],
    action: { label: 'לכל שרותי השיווק שעשינו', href: '/#v2-portfolio-sales' },
  },
  {
    id: 'development',
    label: 'פיתוח',
    tags: [
      'אפיון מערכות',
      'פיתוח Full Stack',
      'אינטגרציות ו-API',
      'אוטומציה עסקית',
      'ממשקי ניהול',
      'תחזוקה שוטפת',
    ],
    question: 'מה מיוחד בפיתוח שלנו?',
    paragraphs: [
      'אנחנו בונים מערכות מותאמות אישית במקום להילחם במגבלות של תבניות מוכנות, כך שכל תהליך בעסק מקבל בדיוק את הכלי שהוא צריך.',
      'הקוד נכתב כדי להחזיק לאורך זמן: מהיר, מאובטח וקל להרחבה כשהעסק גדל.',
    ],
    action: { label: 'לכל פרויקטי הפיתוח שעשינו', href: '/#v2-portfolio-systems' },
  },
  {
    id: 'branding',
    label: 'מיתוג',
    tags: [
      'אסטרטגיית מותג',
      'עיצוב לוגו',
      'שפה גרפית',
      'ספר מותג',
      'טון דיבור',
      'חומרי מכירה',
    ],
    question: 'מה מיוחד במיתוג שלנו?',
    paragraphs: [
      'מיתוג אצלנו מתחיל בשאלה מי הלקוח ומה הוא צריך לזכור, ורק אחר כך מגיע לצבעים ולפונטים.',
      'התוצאה היא שפה אחת שעובדת נכון באתר, בקמפיין ובכל נקודת מגע עם הלקוח.',
    ],
    action: { label: 'לכל פרויקטי המיתוג שעשינו', href: '/#v2-portfolio-brand' },
  },
  {
    id: 'brochure',
    label: 'אתרי תדמית',
    tags: [
      'אפיון וחוויית משתמש',
      'עיצוב UI',
      'כתיבת תוכן',
      'התאמה למובייל',
      'מהירות טעינה',
      'הטמעת אנליטיקס',
    ],
    question: 'מה מיוחד באתרי התדמית שלנו?',
    paragraphs: [
      'אתר תדמית הוא לא ברושור דיגיטלי. הוא הרושם הראשון של העסק, ולכן הוא נבנה סביב המסר ולא סביב תבנית.',
      'כל עמוד מוביל את הגולש לפעולה הבאה, עם עיצוב שמרגיש מדויק וטעינה שלא גורמת לאף אחד לחכות.',
    ],
    action: { label: 'לכל אתרי התדמית שעשינו', href: '/#v2-portfolio-brand' },
  },
  {
    id: 'ecommerce',
    label: 'אתרי מסחר',
    tags: [
      'חנות מותאמת אישית',
      'סליקה ותשלומים',
      'ניהול מלאי',
      'אינטגרציה לדיוור',
      'אופטימיזציית המרה',
      'ליווי שוטף',
    ],
    question: 'מה מיוחד באתרי המסחר שלנו?',
    paragraphs: [
      'אנחנו בונים חנויות שמוכרות: מסלול קנייה קצר, עמודי מוצר ברורים וצ׳ק אאוט שלא מאבד לקוחות בדרך.',
      'הכל מחובר למערכות שאתם כבר עובדים איתן, כך שההזמנות, המלאי והדיוור מדברים אותה שפה.',
    ],
    action: { label: 'לכל חנויות האונליין שעשינו', href: '/#v2-portfolio-sales' },
  },
  {
    id: 'web-development',
    label: 'בניית אתרים',
    tags: [
      'אפיון וחוויית משתמש',
      'עיצוב UI',
      'פיתוח בקוד מלא',
      'מהירות טעינה',
      'נגישות תקן 5568',
      'הקוד נשאר שלכם',
    ],
    question: 'מה מיוחד בבניית האתרים שלנו?',
    paragraphs: [
      'אנחנו בונים בקוד ולא נלחמים במגבלות של תבנית ותוספים, כך שמבנה האתר, האינטגרציות ומסלול הלקוח נגזרים מהעסק ולא מהנחות של מי שכתב את התבנית.',
      'המהירות נמדדת תוך כדי הפיתוח ולא מתוקנת בסוף. באפיון נסגר גם מה שלא נכנס לגרסה הראשונה, כדי שהתקציב לא ייעלם בדרך.',
    ],
    action: { label: 'לשירות בניית אתרים', href: '/services/web-development' },
  },
  {
    id: 'seo',
    label: 'קידום אתרים',
    tags: [
      'מחקר מילות מפתח',
      'קידום טכני',
      'כתיבת תוכן',
      'בניית סמכות',
      'קידום מקומי',
      'נראות בתשובות AI',
    ],
    question: 'מה מיוחד בקידום האורגני שלנו?',
    paragraphs: [
      'אותו צוות שמקדם גם מפתח. חסם טכני שעוצר קידום - מהירות, סכמה או מבנה כתובות - נפתר אצלנו ברמת הקוד באותו ספרינט, ולא ממתין חודשים בתור אצל ספק אחר.',
      'הדוח החודשי מדבר על פניות ולא רק על מיקומים, ומכסה גם נראות בתשובות של גוגל ו-ChatGPT - שם נגמר היום חלק גדל מהחיפושים.',
    ],
    action: { label: 'לשירות קידום אתרים', href: '/services/seo' },
  },
  {
    id: 'maintenance',
    label: 'תחזוקת אתרים',
    tags: [
      'עדכוני אבטחה',
      'גיבויים יומיים',
      'ניטור זמינות',
      'שינויי תוכן',
      'תחזוקת אינטגרציות',
      'דוח חודשי',
    ],
    question: 'מה כולל שירות התחזוקה שלנו?',
    paragraphs: [
      'חבילות חודשיות עם מחירון גלוי וזמני תגובה שכתובים בהסכם ולא נשארים כהבטחה - כולל אתרים שלא נבנו אצלנו.',
      'החיבורים לחשבונית ולסליקה נבדקים באופן שוטף, כי כשהם נופלים שום דבר באתר לא נראה שבור: ההזמנות ממשיכות להיכנס והחשבוניות פשוט מפסיקות להיווצר.',
    ],
    action: { label: 'לשירות תחזוקת אתרים', href: '/services/maintenance' },
  },
  {
    id: 'ai-agents',
    label: 'סוכני AI',
    tags: [
      'מענה מסביב לשעון',
      'סינון לידים',
      'קביעת פגישות',
      'חיבור ל-CRM',
      'וואטסאפ',
      'העברה לנציג',
    ],
    question: 'מה מיוחד בסוכני ה-AI שלנו?',
    paragraphs: [
      'הסוכן עונה מתוך התוכן שלכם בלבד ולא מתוך ידע כללי של המודל, ועל שאלה שאין לה מקור הוא אומר שאינו יודע - כי מחיר שהומצא ללקוח הוא התחייבות בשמכם.',
      'הוא גם מבצע פעולות ולא רק משיב: פותח ליד, קובע פגישה ומעדכן סטטוס במערכות הקיימות, כך שלא נשארת עבודת העתקה ידנית בסוף היום.',
    ],
    action: { label: 'לשירות סוכני AI', href: '/services/ai-agents' },
  },
  {
    id: 'ai-search',
    label: 'קידום ב-AI',
    tags: [
      'AI Overviews',
      'ChatGPT ו-Gemini',
      'הגדרת ישות',
      'סכמה',
      'תוכן בר-ציטוט',
      'דוח נראות',
    ],
    question: 'מה מיוחד בקידום ב-AI שלנו?',
    paragraphs: [
      'בתשובה של מנוע AI אין מקום ראשון - יש מקור שצוטט ומקור שלא. לכן העבודה מתחילה בהגדרת הישות ובסכמה, ורק אחר כך בתוכן: מנוע לא מצטט עסק שאינו בטוח בקיומו.',
      'המדידה שונה גם היא. על מאגר שאלות קבוע נבדק מדי חודש אם אתם מוזכרים, באיזה הקשר ולצד מי, במקום לעקוב אחרי מיקומים שלא קיימים שם.',
    ],
    action: { label: 'לשירות קידום ב-AI', href: '/services/ai-search' },
  },
  {
    id: 'machine-learning',
    label: 'למידת מכונה',
    tags: [
      'חיזוי ביקוש ומכירות',
      'דירוג לידים',
      'סיכון נטישה',
      'המלצות לחנות',
      'סיווג טקסט בעברית',
      'דשבורדים ו-BI',
    ],
    question: 'מה מיוחד בעבודת ה-Data Science שלנו?',
    paragraphs: [
      'מתחילים בבדיקת הנתונים שכבר יש לכם ובקו בסיס: כמה טוב עובדת השיטה הקיימת. מודל שלא מנצח אותה על נתונים שלא ראה לא עולה לאוויר.',
      'התחזית מגיעה למקום שבו מחליטים — CRM, מלאי או דשבורד — ונמצאת תחת ניטור, כי שווקים ולקוחות משתנים והמודל צריך להשתנות איתם.',
    ],
    action: { label: 'לשירות למידת מכונה', href: '/services/machine-learning' },
  },
  {
    id: 'computer-vision',
    label: 'ראייה ממוחשבת',
    tags: [
      'OCR בעברית',
      'זיהוי אובייקטים',
      'בקרת איכות',
      'ספירת אנשים ורכבים',
      'טשטוש פנים',
      'תיוג תמונות מוצר',
    ],
    question: 'מה מיוחד בפתרונות הראייה הממוחשבת שלנו?',
    paragraphs: [
      'הזיהוי נבדק על התמונות, הסריקות והמצלמות שלכם, כולל המקרים הקשים, ולא על מאגר דוגמאות. כך רואים מראש איפה הוא יתקשה.',
      'התוצאה נכנסת ישר למערכת: חשבונית להנהלת החשבונות, התראה על פגם למנהל המשמרת, תגיות לקטלוג — ופנים מטושטשות לפני כל שמירה.',
    ],
    action: { label: 'לשירות ראייה ממוחשבת', href: '/services/computer-vision' },
  },
  {
    id: 'llm-integration',
    label: 'חיבור LLM ו-RAG',
    tags: [
      'צ׳אט על מסמכי החברה',
      'עוזר ידע פנימי',
      'RAG בעברית',
      'חילוץ וסיכום מסמכים',
      'GPT, Claude ו-Gemini',
      'פריסה פרטית',
    ],
    question: 'מה מיוחד בחיבור מודלי שפה שאנחנו בונים?',
    paragraphs: [
      'המודל עונה רק מתוך המסמכים והנתונים שלכם, עם הפניה למקור בכל תשובה. כשאין מקור, הוא אומר שאינו יודע במקום לנחש.',
      'הגישה למידע מוגבלת לפי הרשאות המשתמש, והמערכת נבדקת על שאלות אמיתיות של הצוות לפני שהיא עולה לכולם.',
    ],
    action: { label: 'לשירות חיבור LLM ו-RAG', href: '/services/llm-integration' },
  },
  {
    id: 'data-analytics',
    label: 'ניתוח נתונים ו-BI',
    tags: [
      'דשבורדים ב-Looker Studio',
      'Power BI',
      'חיבור CRM וחנות',
      'נתוני פרסום',
      'הנהלת חשבונות',
      'דוחות אוטומטיים',
    ],
    question: 'מה מיוחד בדשבורדים שאנחנו בונים?',
    paragraphs: [
      'מתחילים מהשאלות שאתם שואלים כל שבוע ומהמדדים שבאמת מזיזים החלטה, ורק אז מחברים מקורות. כך הדשבורד לא הופך לקיר של גרפים.',
      'הנתונים מתעדכנים לבד מה-CRM, מהחנות, מקמפיינים ומהנהלת החשבונות, ודוח קצר מגיע בוואטסאפ או במייל בלי שמישהו יעתיק מספרים.',
    ],
    action: { label: 'לשירות ניתוח נתונים ו-BI', href: '/services/data-analytics' },
  },
  {
    id: 'ai-consulting',
    label: 'ייעוץ והטמעת AI',
    tags: [
      'בדיקת מוכנות ל-AI',
      'בחירת כלים ומודלים',
      'מדיניות שימוש ב-AI',
      'הדרכות צוות בעברית',
      'פיילוט והטמעה',
      'מדידת תועלת',
    ],
    question: 'איך נראה ייעוץ AI אצלנו?',
    paragraphs: [
      'לא מתחילים מכלי אלא מהתהליכים שלכם: איפה הזמן הולך, איפה טעויות עולות כסף, ואיפה AI באמת יחסוך — ואיפה לא כדאי לגעת.',
      'אחרי בחירת הכלים מגיעים מדיניות שימוש, הדרכה לצוות ופיילוט קצר עם מדידה, כדי שההחלטה להרחיב תתבסס על מספרים.',
    ],
    action: { label: 'לשירות ייעוץ והטמעת AI', href: '/services/ai-consulting' },
  },
  {
    id: 'voice-agents',
    label: 'סוכני קול',
    tags: [
      'מענה לשיחות נכנסות',
      'קו אחרי שעות',
      'קביעת תורים בטלפון',
      'שיחות תזכורת',
      'סיכומים ל-CRM',
      'העברה לנציג',
    ],
    question: 'מה מיוחד בסוכני הקול שלנו?',
    paragraphs: [
      'בודקים את הסוכן על שיחות אמיתיות ועל איכות העברית בקו שלכם לפני ההשקה, כי זיהוי דיבור עדיין טועה בשמות, במספרים וברעש.',
      'הסוכן עובד מעל הטלפוניה הקיימת, מסכם כל שיחה ל-CRM ומעביר לנציג אנושי ברגע שהשיחה דורשת זאת.',
    ],
    action: { label: 'לשירות סוכני קול', href: '/services/voice-agents' },
  },
  {
    id: 'generative-ai',
    label: 'בינה מלאכותית יוצרת לתוכן שיווקי',
    tags: [
      'תמונות מוצר',
      'סרטונים וריילס',
      'וריאציות למודעות',
      'כתיבה בעברית',
      'אווטאר והקראה',
      'צינור תוכן',
    ],
    question: 'איך יוצרים הרבה תוכן שיווקי עם בינה מלאכותית ועדיין שומרים על הסגנון של המותג?',
    paragraphs: [
      'בינה מלאכותית יוצרת מאפשרת להפיק תמונות מוצר, סרטונים קצרים, וריאציות למודעות וטקסטים בעברית במהירות ובהיקף שקשה להגיע אליו בעבודה ידנית. כדי שהתוצאה תתאים למותג, כותבים מדריך סגנון שהמודל יכול לעקוב אחריו, ומתחילים מצילום אמיתי של המוצר.',
      'כל פריט עובר בדיקה של עורך אנושי לפני פרסום, ובכל פרויקט מתועדים הכלים, תנאי הרישיון המסחרי וסימון התוכן שנוצר ב-AI. אפשר לחבר את התהליך לקטלוג כך שמוצר חדש מקבל תמונות ותיאור אוטומטית ומחכה לאישור.',
    ],
    action: { label: 'לשירות בינה מלאכותית יוצרת לתוכן שיווקי', href: '/services/generative-ai' },
  },
  {
    id: 'ai-product-development',
    label: 'פיתוח מוצרי AI ו-SaaS',
    tags: [
      'מוצר AI',
      'MVP',
      'SaaS',
      'אפליקציית ווב',
      'חיוב ומכסות',
      'בעלות על הקוד',
    ],
    question: 'רוצים להפוך רעיון למוצר AI שאפשר להשיק?',
    paragraphs: [
      'אנחנו בונים מוצרי AI ו-SaaS לסטארטאפים ולעסקים: אפליקציית ווב או מובייל, בחירת מודלים ו-API, בדיקות איכות ושליטה בעלות לכל בקשה.',
      'המוצר יוצא עם חיוב, מגבלות שימוש ואבטחה מפני ניצול לרעה, והקוד והקניין הרוחני נשארים אצלכם.',
    ],
    action: { label: 'לשירות פיתוח מוצרי AI ו-SaaS', href: '/services/ai-product-development' },
  },
  {
    id: 'mobile-app-development',
    label: 'פיתוח אפליקציות',
    tags: [
      'iOS ואנדרואיד',
      'נייטיב או חוצה פלטפורמות',
      'MVP ועד קנה מידה',
      'התראות פוש ותשלומים',
      'ממשק RTL בעברית',
      'פרסום בחנויות',
    ],
    question: 'מה מיוחד בפיתוח האפליקציות שלנו?',
    paragraphs: [
      'הטכנולוגיה נבחרת לפי הפרויקט: Swift ו-Kotlin, React Native או Flutter. מתחילים ב-MVP עם פעולה מרכזית אחת ובונים ארכיטקטורה שמתרחבת בלי כתיבה מחדש.',
      'העברית והנגישות נבנות מהשלב הראשון, הפרסום ב-App Store וב-Google Play מוכן מראש, והקוד וחשבונות המפתחים נשארים בבעלותכם גם אחרי ההשקה.',
    ],
    action: { label: 'לשירות פיתוח אפליקציות', href: '/services/mobile-app-development' },
  },
  {
    id: 'desktop-app-development',
    label: 'פיתוח תוכנה לדסקטופ',
    tags: [
      'אפליקציות Windows ו-macOS',
      'כלים פנימיים',
      'עבודה בלי אינטרנט',
      'חיבור לחומרה וציוד',
      'העברת תוכנה ישנה',
      'התקנה ועדכון אוטומטי',
    ],
    question: 'מה מיוחד בפיתוח הדסקטופ שלנו?',
    paragraphs: [
      'הטכנולוגיה נבחרת לפי הפרויקט — Electron, Tauri, .NET, Qt או Python — והבחירה מנומקת בכתב. הבדיקות נעשות על הציוד האמיתי: מדפסות, סורקים, משקלים וקופות.',
      'התוכנה עובדת גם בלי אינטרנט, מתעדכנת אוטומטית, חתומה על שמכם, והקוד והרישיון נשארים בבעלותכם — גם כשמעבירים תוכנה ישנה מ-VB6 או Access.',
    ],
    action: { label: 'לשירות פיתוח תוכנה לדסקטופ', href: '/services/desktop-app-development' },
  },
  {
    id: 'devops-cloud',
    label: 'DevOps וענן',
    tags: [
      'CI/CD',
      'Docker ו-Kubernetes',
      'AWS, GCP, Azure ו-Hetzner',
      'תשתית כקוד עם Terraform',
      'ניטור והתראות',
      'גיבויים והתאוששות מאסון',
    ],
    question: 'מה מייחד את עבודת ה-DevOps שלנו?',
    paragraphs: [
      'מתחילים בסקירה של מה שרץ היום: שרתים, גיבויים, הרשאות ועלויות. מקבלים רשימה לפי סיכון ותוכנית עבודה, ולא הצעה להחליף הכול.',
      'התשתית נכתבת בקוד ושייכת לכם, הפריסות אוטומטיות, והניטור מתריע לפני הלקוחות. אפשר להשאיר אצלנו את התפעול לפי רמת שירות בכתב או להעביר אותו לצוות שלכם.',
    ],
    action: { label: 'לשירות DevOps וענן', href: '/services/devops-cloud' },
  },
  {
    id: 'ai-website-integration',
    label: 'שילוב AI באתר',
    tags: [
      'צ׳אט באתר מתוך התוכן שלכם',
      'חיפוש חכם',
      'המלצות והתאמה אישית',
      'תוכן ותמונות במערכת הניהול',
      'תרגום ולוקליזציה',
      'דירוג לידים',
    ],
    question: 'מה מייחד את שילוב ה-AI שלנו באתר?',
    paragraphs: [
      'מתחילים ביכולת אחת שמחוברת לאתר החי ומקבלת תשובות רק מהתוכן שאישרתם, עם מגבלות כתובות, תקרת עלות ועברית אמיתית.',
      'היכולת עובדת על כל פלטפורמה, מוורדפרס ושופיפיי ועד אתר בקוד מותאם ואפליקציה, נמדדת אחרי ההשקה, ורק אז מרחיבים.',
    ],
    action: { label: 'לשירות שילוב AI באתר', href: '/services/ai-website-integration' },
  },
  {
    id: 'ai-built-app-completion',
    label: 'השלמת פרויקט שנבנה ב-AI',
    tags: [
      'ביקורת קוד ואבטחה',
      'בסיס נתונים והרשאות',
      'סליקה ואינטגרציות',
      'העלאה לפרודקשן',
      'עברית, נגישות ו-SEO',
      'מסירה ותחזוקה',
    ],
    question: 'מה מייחד את השלמת הפרויקט שלנו?',
    paragraphs: [
      'מתחילים בביקורת על הקוד שנוצר בכלי ה-AI, ומקבלים רשימת ממצאים לפי חומרה לפני שמתחייבים להמשך.',
      'ממשיכים על הסטאק הקיים, סוגרים אבטחה, נתונים וסליקה, מעלים לפרודקשן בשלבים, והקוד והחשבונות נשארים שלכם.',
    ],
    action: { label: 'לשירות השלמת פרויקט AI', href: '/services/ai-built-app-completion' },
  },
  {
    id: 'privacy-compliance',
    label: 'התאמת אתר לתיקון 13',
    tags: [
      'סקירת טפסים ומידע',
      'באנר עוגיות וחסימת מעקב',
      'מדיניות פרטיות',
      'מדיניות עוגיות',
      'אבטחה והרשאות',
      'בקשות עיון ומחיקה',
    ],
    question: 'מה מייחד את ההתאמה הטכנית שלנו?',
    paragraphs: [
      'אנחנו מתחילים בסקירה של מה שהאתר אוסף בפועל: הטפסים, כלי המדידה והספקים. בבאנר העוגיות בודקים בדפדפן שכלי המעקב אכן לא נטענים לפני אישור, ולא מסתפקים בכך שהבאנר מופיע.',
      'זו עבודה טכנית שמתבצעת לצד עורך הדין שלכם ולא במקומו: אנחנו מיישמים את החלטותיו ומוסרים תיעוד מסודר של הטפסים, הספקים והאבטחה.',
    ],
    action: { label: 'לשירות התאמת אתר לתיקון 13', href: '/services/privacy-compliance' },
  },
]

export const portfolio = {
  eyebrow: 'עבודות נבחרות',
  heading: ['קבלו הצצה לחלק', 'מהפרויקטים שעבדנו עליהם'],
  lede: 'אתרי מכירות, חנויות אונליין, מערכות ניהול ומיתוג - בחרנו כמה פרויקטים שממחישים איך נראית עבודה שמשלבת עיצוב, קוד נקי וקידום. לכל אחד מהם יש מטרה עסקית מוגדרת, לא רק צילום מסך יפה.',
  cardAction: 'צפו בפרויקט',
  prev: 'לפרויקט הקודם',
  next: 'לפרויקט הבא',
  outro: 'התרשמתם? בואו להציץ בשאר הפרויקטים שעבדנו עליהם',
  action: { label: 'לכל הפרויקטים שלנו', href: '/projects' },
}

export const projectsPage = {
  title: ['תיק עבודות', 'פרויקטים נבחרים'],
  crumb: 'תיק עבודות',
  lede: '17 פרויקטים חיים: ארבע חנויות אינטרנטיות, אתרי תדמית ולידים בקוסמטיקה, בטיפוח ובמותג אישי, פרויקטים בנדל"ן ובייעוץ משכנתאות, ושלוש פלטפורמות AI ותפעול ללקוחות בקנדה. כולם נבנו בקוד על ידי הצוות שלנו, וכולם באוויר היום.',
  action: { label: 'התחילו פרויקט חדש', href: '/contact' },
  faqHeading: ['לפני שמתחילים', 'כמה דברים שכדאי לדעת.'],
  metaTitle: 'תיק עבודות - 17 אתרים, חנויות ומערכות שבנינו',
  metaDescription:
    '17 פרויקטים חיים של Aiterra: חנויות אינטרנטיות, אתרי תדמית ולידים, מערכות ניהול ופלטפורמות AI, כולם בנויים בקוד. לכל פרויקט: מה הייתה המטרה, מה חובר ומה נבנה.',
}

export const projectPage = {
  crumbHome: 'בית',
  crumb: 'תיק עבודות',
  readMore: 'קראו עוד',
  visit: 'צפו באתר',
  aboutEyebrow: 'רקע',
  aboutHeading: 'על הפרויקט',
  factDate: 'תאריך',
  factField: 'תחום',
  factType: 'סוג פרויקט',
  factTech: 'טכנולוגיה',
  challengeEyebrow: 'האתגר',
  challengeHeading: 'מה היה האתגר?',
  solutionEyebrow: 'הפתרון',
  solutionHeading: 'הפתרון שלנו',
  moreEyebrow: 'עוד פרויקטים',
  moreHeading: 'פרויקטים נוספים',
  shotAlt: 'צילום מסך של האתר',
}

export const projectBanner = {
  heading: 'בואו נשגר את הפרויקט שלך',
  action: { label: 'דברו איתנו ונתחיל לאפיין', href: '/contact' },
}

export const portfolioFilters = [
  { id: 'all', label: 'הכל' },
  { id: 'sales', label: 'אתרי מכירות' },
  { id: 'brand', label: 'תדמיות ולידים' },
  { id: 'systems', label: 'מערכות' },
]

export type PortfolioItem = {
  id: string
  title: string
  tags: string[]
  shot: string
  href: string
  category: string
}

export const portfolioItems: PortfolioItem[] = [
  {
    id: 'eli-ben-yitzhak',
    title: 'אלי בן יצחק – עיצוב שיער',
    tags: ['אתר תדמית', 'מיתוג', 'קידום אורגני'],
    shot: '/images/portfolio/cards/eli-ben-yitzhak.webp',
    href: '/projects/eli-ben-yitzhak',
    category: 'brand',
  },
  {
    id: 'neot-sade',
    title: 'נאות שדה',
    tags: ['חנות אונליין', 'סליקה', 'מועדון לקוחות'],
    shot: '/images/portfolio/cards/neot-sade.webp',
    href: '/projects/neot-sade',
    category: 'sales',
  },
  {
    id: 'bradley',
    title: 'Bradley — אופנת סטריטוור',
    tags: ['Shopify', 'חנות אונליין', 'אופנה'],
    shot: '/images/portfolio/cards/bradley.webp',
    href: '/projects/bradley',
    category: 'sales',
  },
  {
    id: 'sous-chef',
    title: 'Sous Chef',
    tags: ['מערכת', 'פיתוח', 'UI/UX'],
    shot: '/images/portfolio/cards/sous-chef.webp',
    href: '/projects/sous-chef',
    category: 'systems',
  },
  {
    id: 'hofit-cosmetics',
    title: 'חופית קוסמטיקס',
    tags: ['אתר מכירות', 'קידום', 'עיצוב'],
    shot: '/images/portfolio/cards/hofit-cosmetics.webp',
    href: '/projects/hofit-cosmetics',
    category: 'sales',
  },
  {
    id: 'zentax',
    title: 'Zentax — הנהלת חשבונות עם AI',
    tags: ['מערכת', 'AI', 'אפליקציה'],
    shot: '/images/portfolio/cards/zentax.webp',
    href: '/projects/zentax',
    category: 'systems',
  },
  {
    id: 'natan-borochov',
    title: 'נתן בורוכוב — ברברשופ',
    tags: ['אתר תדמית', 'WhatsApp', 'UI/UX'],
    shot: '/images/portfolio/cards/natan-borochov.webp',
    href: '/projects/natan-borochov',
    category: 'brand',
  },
  {
    id: 'maayan-cosmetics',
    title: 'מעיין ועקנין — קוסמטיקה קלינית',
    tags: ['דף נחיתה', 'נגישות', 'לידים'],
    shot: '/images/portfolio/cards/maayan-cosmetics.webp',
    href: '/projects/maayan-cosmetics',
    category: 'brand',
  },
  {
    id: 'olie-6',
    title: 'Olie 6',
    tags: ['Shopify', 'חנות אונליין', 'UI/UX'],
    shot: '/images/portfolio/cards/olie-6.webp',
    href: '/projects/olie-6',
    category: 'sales',
  },
  {
    id: 'alova',
    title: 'ALOVA — טיפוח שיער',
    tags: ['Shopify', 'חנות אונליין', 'UI/UX'],
    shot: '/images/portfolio/cards/alova.webp',
    href: '/projects/alova',
    category: 'sales',
  },
  {
    id: 'apprify',
    title: 'Apprify — משכנתאות עם AI',
    tags: ['מערכת', 'AI', 'FinTech'],
    shot: '/images/portfolio/cards/apprify.webp',
    href: '/projects/apprify',
    category: 'systems',
  },
  {
    id: 'ecommerce-store',
    title: 'חנות דיגיטלית',
    tags: ['חנות אונליין', 'פיתוח', 'סליקה'],
    shot: '/images/portfolio/shots/ecommerce-store.webp',
    href: '/projects/ecommerce-store',
    category: 'sales',
  },
  {
    id: 'brand-identity',
    title: 'רם וחיים — שיווק נדל"ן',
    tags: ['קידום אורגני', 'ניהול מוניטין', 'נכסים דיגיטליים'],
    shot: '/images/portfolio/cards/brand-identity.webp',
    href: '/projects/brand-identity',
    category: 'brand',
  },
  {
    id: 'marketing-platform',
    title: 'אבי ייעוץ משכנתאות',
    tags: ['מיתוג', 'דפי נחיתה', 'קמפיינים'],
    shot: '/images/portfolio/cards/marketing-platform.webp',
    href: '/projects/marketing-platform',
    category: 'brand',
  },
  {
    id: 'tech-embassy',
    title: 'Tech Embassy — ניהול אירועים',
    tags: ['מערכת', 'אפליקציה', 'אוטומציה'],
    shot: '/images/portfolio/cards/tech-embassy.webp',
    href: '/projects/tech-embassy',
    category: 'systems',
  },
  {
    id: 'alexandra-patsina',
    title: 'Alexandra Patsina',
    tags: ['אתר תדמית', 'מיתוג', 'UI/UX'],
    shot: '/images/portfolio/shots/alexandra-patsina.webp',
    href: '/projects/alexandra-patsina',
    category: 'brand',
  },
  {
    id: 'karin-cohen',
    title: 'קארין כהן — אקדמיה לריסים',
    tags: ['דף נחיתה', 'לידים', 'קמפיינים'],
    shot: '/images/portfolio/cards/karin-cohen.webp',
    href: '/projects/karin-cohen',
    category: 'brand',
  },
]

export const allIn = {
  eyebrow: 'הכול במקום אחד',
  heading: ['הפיתוח, האתר והשיווק', 'צריכים לעבוד ביחד'],
}

export type AllInNode = {
  id: string
  label: string
  side: 'left' | 'right'
  x: string
  y: string
  edge: string
  mobile: { x: string; y: string; place: 'top' | 'bottom'; len: string }
}

export const allInNodes: AllInNode[] = [
  {
    id: 'discovery',
    label: 'איפיון',
    side: 'left',
    x: '21.4%',
    y: '54.2%',
    edge: '9%',
    mobile: { x: '73.4%', y: '67.3%', place: 'bottom', len: '96px' },
  },
  {
    id: 'marketing',
    label: 'שיווק',
    side: 'right',
    x: '70.5%',
    y: '54.2%',
    edge: '89.2%',
    mobile: { x: '72.5%', y: '37.5%', place: 'top', len: '96px' },
  },
  {
    id: 'creative',
    label: 'קריאייטיב',
    side: 'left',
    x: '24.4%',
    y: '69.7%',
    edge: '8.7%',
    mobile: { x: '50%', y: '73.4%', place: 'bottom', len: '52px' },
  },
  {
    id: 'design',
    label: 'עיצוב',
    side: 'right',
    x: '82.5%',
    y: '69.7%',
    edge: '92.8%',
    mobile: { x: '50%', y: '29.7%', place: 'top', len: '56px' },
  },
  {
    id: 'seo',
    label: 'קידום אתרים',
    side: 'left',
    x: '22.2%',
    y: '85.5%',
    edge: '8.7%',
    mobile: { x: '26.6%', y: '67.3%', place: 'bottom', len: '96px' },
  },
  {
    id: 'development',
    label: 'פיתוח',
    side: 'right',
    x: '84%',
    y: '80.9%',
    edge: '93.8%',
    mobile: { x: '27.5%', y: '37.5%', place: 'top', len: '96px' },
  },
]

export type PartnerLogo = {
  name: string
  src: string
  scale?: number
  hideName?: boolean
}

export const partners: { caption: string; logos: PartnerLogo[] } = {
  caption: 'פלטפורמות וטכנולוגיות שאנחנו מתמחים בהם',
  logos: [
    { name: 'Next.js', src: '/icons/tech/nextjs.svg', scale: 0.9 },
    { name: 'React', src: '/icons/tech/react.svg', scale: 0.95 },
    { name: 'React Native', src: '/icons/tech/react-native.svg', scale: 0.9 },
    { name: 'TypeScript', src: '/icons/tech/typescript.svg', scale: 0.9 },
    { name: 'Tailwind CSS', src: '/icons/tech/tailwindcss.svg', scale: 0.95 },
    { name: 'Vite', src: '/icons/tech/vite.svg', scale: 0.9 },
    { name: 'Three.js', src: '/icons/tech/threejs.svg', scale: 0.85 },
    { name: 'Node.js', src: '/icons/tech/nodejs.svg', scale: 0.95 },
    { name: 'FastAPI', src: '/icons/tech/fastapi.svg', scale: 0.9 },
    { name: 'Python', src: '/icons/tech/python.svg', scale: 0.95 },
    { name: 'Prisma', src: '/icons/tech/prisma.svg', scale: 0.9 },
    { name: 'PostgreSQL', src: '/icons/tech/postgresql.svg', scale: 0.95 },
    { name: 'MongoDB', src: '/icons/tech/mongodb.svg', scale: 0.95 },
    { name: 'Docker', src: '/icons/tech/docker.svg', scale: 0.95 },
    { name: 'GitHub Actions', src: '/icons/tech/githubactions.svg', scale: 0.85 },
    { name: 'AWS', src: '/icons/tech/aws.svg', scale: 0.9 },
    { name: 'Cloudflare', src: '/icons/tech/cloudflare.svg', scale: 0.95 },
    { name: 'Figma', src: '/icons/tech/figma.svg', scale: 0.85 },
    { name: 'Google Analytics', src: '/icons/tech/googleanalytics.svg', scale: 0.8 },
    { name: 'Google Tag Manager', src: '/icons/tech/googletagmanager.svg', scale: 0.8 },
    { name: 'Google Ads', src: '/images/partner2.png', hideName: true },
    { name: 'Meta', src: '/images/partner3.png', scale: 0.7, hideName: true },
  ],
}

export const reels = {
  eyebrow: 'קריאייטיב ורילסים',
  heading: ['הקריאייטיב שהקהל שלכם באמת פוגש'],
  lede: [
    'אסטרטגיה טובה צריכה בסוף להפוך למשהו שאנשים עוצרים לראות.',
    'אנחנו מלווים את הקריאייטיב מהרעיון והתסריט ועד הצילום, העריכה והמודעה שעולה בפועל לקמפיין.',
  ],
  prev: 'לסרטון הקודם',
  next: 'לסרטון הבא',
}

export type ReelItem = {
  id: string
  label: string
  surface: string
}

export const reelItems: ReelItem[] = [
  { id: 'reel-1', label: 'ריל שיווקי', surface: '#dfe4ef' },
  { id: 'reel-2', label: 'ריל UGC', surface: '#efdfe6' },
  { id: 'reel-3', label: 'ריל מוצר', surface: '#e6e2d8' },
  { id: 'reel-4', label: 'ריל מותג', surface: '#1d2740' },
  { id: 'reel-5', label: 'ריל תדמית', surface: '#dde6e2' },
  { id: 'reel-6', label: 'ריל סניף', surface: '#e4e0ea' },
  { id: 'reel-7', label: 'ריל לקוחות', surface: '#e9e3da' },
]

export const clientStories = {
  eyebrow: 'סיפורי לקוחות',
  heading: ['ומה הלקוחות משתפים?'],
  lede: [] as string[],
  prev: 'לסיפור הקודם',
  next: 'לסיפור הבא',
}

export const clientStoryItems: ReelItem[] = [
  { id: 'story-1', label: 'סיפור לקוח – חנות אונליין', surface: '#e2e7f1' },
  { id: 'story-2', label: 'סיפור לקוח – עסק מקומי', surface: '#efe3e8' },
  { id: 'story-3', label: 'סיפור לקוח – מותג אופנה', surface: '#e7e3d9' },
  { id: 'story-4', label: 'סיפור לקוח – קליניקה', surface: '#222c46' },
  { id: 'story-5', label: 'סיפור לקוח – חברת שירות', surface: '#dee7e3' },
  { id: 'story-6', label: 'סיפור לקוח – סטארטאפ', surface: '#e5e1eb' },
  { id: 'story-7', label: 'סיפור לקוח – רשת סניפים', surface: '#eae4db' },
]

export const faq = {
  heading: ['לפני שמתחילים', 'כמה דברים שכדאי לדעת.'],
}

export type FaqEntry = {
  id: string
  question: string
  answer: string
}

export const faqEntries: FaqEntry[] = [
  {
    id: 'timeline',
    question: 'כמה זמן לוקח התהליך של בניית אתר לעסק?',
    answer:
      'זמן הפיתוח תלוי במורכבות הפרויקט ובמטרות שלו. דף נחיתה או אתר תדמית נמסרים בדרך כלל תוך שבועיים עד חודש וחצי מרגע אישור האפיון. חנות אינטרנטית עם קטלוג, סליקה ישראלית וחיבור לחשבוניות לוקחת בין חודש לשלושה, ומערכת מותאמת אישית עם הרשאות ולוגיקה עסקית - יותר מכך. הכל נבנה בקוד ב-React ו-Next.js ולא מורכב מתבנית ותוספים. בפועל, מה שמאריך לוחות זמנים הוא כמעט תמיד תוכן, תמונות ואישורים מצד הלקוח ולא זמן הפיתוח, ולכן אנחנו נועלים אותם כבר בשלב האפיון. בתום האפיון תקבלו לוח זמנים לפי שלבים עם תאריך מסירה לכל אחד.',
  },
  {
    id: 'local-business',
    question: 'אנחנו עסק שנותן שירות מקומי (כמו עורכי דין/קליניקה), האם זה מתאים לנו?',
    answer:
      'בהחלט, וזה חלק גדול מהעבודה שלנו. לעסקים מקומיים הנוכחות הדיגיטלית קריטית במיוחד, כי רוב הלקוחות מתחילים את החיפוש בגוגל ורבים מהם סוגרים את התהליך בשיחת טלפון ישירות מתוצאות החיפוש, בלי להיכנס לאתר בכלל. אנחנו בונים אתר שממוקד באזור השירות שלכם, כותבים עמודי שירות לפי אזור, מקדמים במילות מפתח מקומיות ומטפלים בפרופיל העסק בגוגל: קטגוריות, שעות פעילות, תמונות, איסוף ביקורות ומענה להן. אנחנו גם מוודאים שהשם, הכתובת והטלפון מופיעים באופן זהה בכל המקומות ברשת - אות דירוג מקומי פשוט שכמעט תמיד מוזנח.',
  },
  {
    id: 'one-agency',
    question: 'למה לבחור בסוכנות אחת גם לבנייה וגם לשיווק?',
    answer:
      'כשהאתר והשיווק נבנים על ידי אותו צוות, הם מתוכננים מההתחלה לעבוד יחד: דפי הנחיתה מותאמים למסרים שבקמפיין, מערכת המדידה מחוברת נכון מהיום הראשון, והתשתית הטכנית שהקידום האורגני דורש קיימת בקוד ולא מתווספת בדיעבד. כך חוסכים את התיאום בין ספקים ומקצרים זמנים - שינוי בדף נחיתה נעשה באותו שבוע ולא נכנס לתור אצל צד שלישי. חשוב מכך, זה מבטל את המצב הנפוץ שבו הסוכנות מאשימה את המפתח באתר איטי והמפתח מאשים את הסוכנות בתנועה לא רלוונטית, ואף אחד לא לוקח אחריות על התוצאה עצמה.',
  },
  {
    id: 'seo-scope',
    question: 'מה בדיוק כולל שירות קידום אתרים (SEO) שלכם?',
    answer:
      'השירות כולל מחקר מילות מפתח לפי כוונת החיפוש בעברית, קידום טכני של האתר - מהירות טעינה ומדדי ליבה, מבנה עמודים וכתובות, נתונים מובנים ומצב אינדוקס - כתיבת תוכן חדש ואופטימיזציה של עמודים קיימים, קידום מקומי, בניית קישורים ודוח ביצועים חודשי. נכללת בו גם עבודת GEO: התאמת התוכן והנתונים המובנים כך שהאתר יצוטט בתשובות של ChatGPT, Perplexity וסקירות ה-AI של גוגל. המטרה היא דירוג בביטויים שמייצרים פניות בפועל ולא בביטויים שנוח להראות בדוח, ואנחנו לא מבטיחים מקום ראשון - אף אחד לא באמת יכול.',
  },
  {
    id: 'landing-only',
    question: 'האם ניתן להזמין מכם רק עיצוב דף נחיתה ממוקד?',
    answer:
      'כן. אפשר להזמין דף נחיתה בודד לקמפיין, למבצע או להשקת שירות חדש, בלי להתחייב לאתר מלא. גם בפרויקט קטן אנחנו עוברים על המסר, קהל היעד, ההתנגדויות שחוזרות בשיחות המכירה והפעולה האחת שרוצים שהגולש יבצע - כי דף נחיתה שמנסה להשיג שלושה דברים בדרך כלל לא משיג אף אחד מהם. הדף נבנה עם מעקב המרות מחובר, כדי שאפשר יהיה לדעת מה שיעור ההמרה שלו ולא רק כמה תנועה הגיעה. הוא נבנה גם כרכיב בתוך שפה עיצובית, כך שאם בהמשך תרצו להרחיב לאתר מלא אפשר לצמוח ממנו במקום להתחיל מחדש.',
  },
  {
    id: 'small-budget-ads',
    question: 'האם כדאי לעשות קידום ממומן בגוגל גם עם תקציב קטן?',
    answer:
      'כן, בתנאי שהקמפיין ממוקד. עם תקציב קטן אנחנו מתמקדים במילות מפתח בעלות כוונת רכישה גבוהה, מגבילים את האזור הגיאוגרפי ואת שעות ההצגה, ומוודאים שדף הנחיתה מדבר בדיוק במסר של המודעה. מה שלא כדאי לעשות עם תקציב קטן הוא לפצל אותו בין גוגל, פייסבוק, אינסטגרם וטיקטוק: כל ערוץ צריך מספיק המרות כדי לצאת משלב הלמידה של האלגוריתם, ותקציב מחולק לארבעה לרוב לא מגיע לסף הזה באף אחד מהם. מתחילים בערוץ אחד, מודדים עלות לליד, ומגדילים בהדרגה לפי תוצאות. אם התקציב קטן מכדי להצדיק דמי ניהול, נאמר זאת מראש.',
  },
  {
    id: 'after-launch',
    question: 'מה קורה אחרי השקת האתר או הקמפיין?',
    answer:
      'ההשקה היא רק ההתחלה, וזה נכון גם לאתר וגם לקמפיין. אחרי העלייה לאוויר אנחנו עוקבים אחרי הנתונים ב-GA4 וב-Google Search Console, מבצעים אופטימיזציה שוטפת לקמפיינים ולעמודים, ומטפלים בעדכוני אבטחה, גיבויים יומיים וניטור זמינות. בשבועות הראשונים כמעט תמיד עולים חידודים מהשימוש בפועל - טופס שצריך לקצר, מסר שלא עובד, שדה חסר - והם נכנסים במסגרת הליווי. אתם מקבלים דוח חודשי ברור ואיש קשר אחד שמכיר את הפרויקט. התחזוקה זמינה כחבילה חודשית עם מחירון גלוי וזמן תגובה כתוב בהסכם, כך שברור מראש מה קורה כשמשהו נשבר.',
  },
  {
    id: 'pricing',
    question: 'כמה עולה לבנות אתר או דף נחיתה?',
    answer:
      'המחיר נקבע לפי סוג הפרויקט וההיקף שלו, ולא לפי מספר העמודים לבדו. דף נחיתה ממוקד מתחיל בכמה אלפי שקלים; אתר תדמית לעסק נמצא בטווח רחב יותר לפי מספר התבניות והמסכים הייחודיים; חנות איקומרס או מערכת מותאמת אישית מתומחרות בנפרד לפי המורכבות. מה שמזיז את המחיר בפועל הוא בדרך כלל האינטגרציות - סליקה, חשבונית ירוקה או iCount, CRM, ניהול מלאי - ולא כמות הטקסט. תקבלו הצעת מחיר כתובה שמפרטת מה כלול, מה לא כלול ומה ייחשב לתוספת, בלי עלויות שמתגלות באמצע. השוואה בין הצעות אפשרית רק כשהפירוט הזה קיים בשתיהן.',
  },
  {
    id: 'integrations',
    question: 'האם אתם מתחברים למערכות ולתוכנות שכבר יש לנו בעסק?',
    answer:
      'כן, וברוב הפרויקטים זה בדיוק מה שקורה. אנחנו מחברים את האתר ואת מערך השיווק למערכות שאתם כבר עובדים איתן: CRM כמו Fireberry, Powerlink ו-Priority; הנהלת חשבונות והפקת חשבוניות כמו חשבשבת, Morning (חשבונית ירוקה), iCount, Greeninvoice ו-Rivhit (ריווחית); וכן סליקת אשראי ישראלית, דיוור, WhatsApp Business API ומערכות אוטומציה. כך לידים, הזמנות ותשלומים זורמים אוטומטית למקום הנכון בלי הזנה ידנית כפולה. באפיון נסגור אילו שדות עוברים, לאיזה כיוון ומה קורה בשגיאה - כי ספקים משנים ממשקי API מדי פעם והחיבורים נשברים בשקט, וזה מתגלה בדרך כלל אצל רואה החשבון.',
  },
  {
    id: 'accessibility',
    question: 'האם האתר יהיה נגיש ויעמוד בתקן הנגישות הישראלי?',
    answer:
      'בהחלט. אנחנו בונים אתרים נגישים לפי תקן ישראלי ת"י 5568, המבוסס על הנחיות WCAG 2.0 ברמה AA, ומיישמים גם את דרישות WCAG 2.1 ברמה AA: ניווט מלא במקלדת, ניגודיות צבעים תקינה, טקסט חלופי לתמונות, היררכיית כותרות שקורא מסך יכול לעבור, טפסים עם תוויות תקינות והצהרת נגישות באתר. עמידה בתקן מצמצמת חשיפה לתביעות לפי חוק שוויון זכויות לאנשים עם מוגבלות, והאחריות היא של בעל האתר ולא של מי שבנה אותו. חשוב לדעת שתוסף נגישות לבדו לרוב אינו מספיק: הוא מוסיף שכבת בקרה מעל האתר אבל אינו מתקן מבנה שגוי מתחתיה.',
  },
]

export type FooterLink = {
  label: string
  href: string
}

export type FooterColumn = {
  id: string
  title: string
  links: FooterLink[]
}

export const footer = {
  brand: 'AITERRA',
  columns: [
    {
      id: 'services',
      title: 'שירותים',
      links: [
        { label: 'בניית אתרים', href: '/services/web-development' },
        { label: 'קידום אתרים אורגני', href: '/services/seo' },
        { label: 'חנות אינטרנטית', href: '/services/ecommerce' },
        { label: 'פיתוח תוכנה בהתאמה אישית', href: '/services/development' },
        { label: 'אוטומציה לעסקים', href: '/services/automation' },
        { label: 'אתר תדמית', href: '/services/brochure' },
        { label: 'שיווק ופרסום ממומן', href: '/services/marketing' },
        { label: 'מיתוג ועיצוב', href: '/services/branding' },
        { label: 'תחזוקת אתרים', href: '/services/maintenance' },
        { label: 'סוכני AI', href: '/services/ai-agents' },
        { label: 'קידום ב-AI', href: '/services/ai-search' },
        { label: 'למידת מכונה ו-Data Science', href: '/services/machine-learning' },
        { label: 'ראייה ממוחשבת', href: '/services/computer-vision' },
        { label: 'חיבור LLM ו-RAG', href: '/services/llm-integration' },
        { label: 'ניתוח נתונים ודשבורדים', href: '/services/data-analytics' },
        { label: 'ייעוץ והטמעת AI', href: '/services/ai-consulting' },
        { label: 'סוכני קול וצ׳אטבוט טלפוני', href: '/services/voice-agents' },
        { label: 'בינה מלאכותית יוצרת', href: '/services/generative-ai' },
        { label: 'פיתוח מוצרי AI', href: '/services/ai-product-development' },
        { label: 'פיתוח אפליקציות', href: '/services/mobile-app-development' },
        { label: 'פיתוח תוכנה לדסקטופ', href: '/services/desktop-app-development' },
        { label: 'DevOps וענן', href: '/services/devops-cloud' },
        { label: 'שילוב AI באתר', href: '/services/ai-website-integration' },
        { label: 'השלמת פרויקט שנבנה ב-AI', href: '/services/ai-built-app-completion' },
        { label: 'התאמת אתר לתיקון 13', href: '/services/privacy-compliance' },
        { label: 'כל השירותים', href: '/services' },
      ],
    },
    {
      id: 'general',
      title: 'כללי',
      links: [
        { label: 'תיק עבודות', href: '/projects' },
        { label: 'אודותינו', href: '/about' },
        { label: 'בלוג', href: '/blog' },
        { label: 'כלים חינמיים', href: '/tools' },
        { label: 'יצירת קשר', href: '/contact' },
        { label: 'English site', href: '/en' },
      ],
    },
  ] satisfies FooterColumn[],
  contactTitle: 'יצירת קשר',
  socialLabels: { instagram: 'אינסטגרם', tiktok: 'טיקטוק', facebook: 'פייסבוק' },
  legal: [
    { label: 'הצהרת נגישות', href: '/accessibility-statement' },
    { label: 'תקנון ותנאי שימוש', href: '/terms-of-use' },
    { label: 'מדיניות פרטיות', href: '/privacy-policy' },
  ] satisfies FooterLink[],
  copyright: '© אייטרה AITERRA. כל הזכויות שמורות',
}

export const reviews = {
  eyebrow: 'ביקורות בגוגל',
  heading: ['את הצד שלנו כבר שמעתם.', 'עכשיו הלקוחות.'],
  lede: [
    'אסטרטגיה טובה צריכה בסוף להפוך למשהו שאנשים עוצרים לראות.',
    'אנחנו מלווים את הקריאייטיב מהרעיון והתסריט ועד הצילום, העריכה והמודעה שעולה בפועל לקמפיין.',
  ],
  rail: 'ביקורות לקוחות מגוגל',
  rating: 'דירוג {value} מתוך 5 כוכבים',
  prev: 'לביקורת הקודמת',
  next: 'לביקורת הבאה',
}

export type ReviewSegment = {
  text: string
  accent?: boolean
}

export type ReviewItem = {
  id: string
  author: string
  when: string
  rating: number
  tint: string
  avatar?: string
  body: ReviewSegment[]
}

export const reviewItems: ReviewItem[] = [
  {
    id: 'erez-shmueli',
    author: 'ארז שמואלי',
    when: 'לפני שבוע',
    rating: 5,
    tint: '#3678e9',
    body: [
      { text: 'בנו לנו אתר חדש לעסק ו' },
      { text: 'מאז הטלפון לא מפסיק לצלצל', accent: true },
      { text: '. לא ציפיתי לתוצאות כל כך מהר.' },
    ],
  },
  {
    id: 'nardit-m',
    author: 'Nardit M',
    when: 'לפני חודש',
    rating: 5,
    tint: '#c25b7c',
    body: [
      { text: 'לא חשבתי שאפשר להגיע למיקומים כאלה כל כך מהר, אבל ' },
      { text: 'הקידום שלהם עשה קסמים', accent: true },
      { text: '. כל לקוח שמגיע דרך האתר מחמיא על העיצוב ועל המהירות.' },
    ],
  },
  {
    id: 'lidor-nisan-ben-shitrit',
    author: 'לידור ניסן בן שיטרית',
    when: 'לפני חודש',
    rating: 5,
    tint: '#7b61c4',
    body: [
      { text: 'הגענו בשביל שיווק דיגיטלי ונשארנו בגלל התוצאות. ' },
      { text: 'הגענו לעמוד הראשון בגוגל בזמן קצר', accent: true },
      { text: ', עם לידים איכותיים שנכנסים כל יום ופרסום ברשתות שמביא חשיפה מטורפת.' },
    ],
  },
  {
    id: 'michel-tern',
    author: 'מישל טרן',
    when: 'לפני חודשיים',
    rating: 5,
    tint: '#2f8f7a',
    body: [
      { text: 'שירות ברמה בינלאומית. היינו צריכים לפתח מערכת מורכבת ו' },
      { text: 'הם ידעו בדיוק איך לפתור את האתגרים הטכניים שלנו', accent: true },
      { text: '. לא נתקלתי קודם בצוות כל כך אדיב ומקצועי.' },
    ],
  },
  {
    id: 'hanan-elul',
    author: 'חנן אלול',
    when: 'לפני חודשיים',
    rating: 5,
    tint: '#c98a3a',
    body: [
      { text: 'חיפשנו חברת קידום אתרים שתדע להביא אותנו למקומות הנכונים. ' },
      { text: 'כבר עכשיו אנחנו בעמוד הראשון בביטויים הכי חשובים לנו', accent: true },
      { text: '. ממליץ בחום.' },
    ],
  },
  {
    id: 'gal-kaufman',
    author: 'Gal Kaufman',
    when: 'לפני 3 חודשים',
    rating: 5,
    tint: '#3678e9',
    body: [
      { text: 'ממליץ עליהם. עשו לי ' },
      { text: 'קידום אורגני שעובד כמו שעון', accent: true },
      { text: ', בנו לי אתר איכותי ומקצועי שמשדר אמינות, ושירות לקוחות שאין כמותו בתחום.' },
    ],
  },
  {
    id: 'dvir-cohen',
    author: 'Dvir Cohen',
    when: 'לפני 4 חודשים',
    rating: 5,
    tint: '#7b61c4',
    body: [
      { text: 'הם פשוט אלופים בפרסום ברשתות החברתיות. ' },
      { text: 'המון לידים איכותיים ותנועה אורגנית מטורפת', accent: true },
      { text: '. תודה על הכל.' },
    ],
  },
  {
    id: 'mor',
    author: 'Mor',
    when: 'לפני 4 חודשים',
    rating: 5,
    tint: '#c25b7c',
    body: [
      { text: 'היה לנו אתר ישן שלא עבד. הם בנו מחדש את האתר העסקי, הקימו ניהול קמפיינים בגוגל, ומאז העסק פשוט צומח. ' },
      { text: 'ההחזר הכי טוב על השקעה שעשיתי השנה', accent: true },
      { text: '.' },
    ],
  },
  {
    id: 'tzion-weinberg',
    author: 'ציון ויינברג',
    when: 'לפני חודשיים',
    rating: 5,
    tint: '#7b61c4',
    body: [
      { text: 'העבודה עם Aiterra שינתה לנו את העסק. הם לקחו על עצמם ' },
      { text: 'את כל השיווק הדיגיטלי', accent: true },
      { text: ', מהאפיון הראשוני ועד לאסטרטגיית תוכן. היום אנחנו נמצאים במקום אחר לגמרי.' },
    ],
  },
  {
    id: 'eliya-ben-hamo',
    author: 'אליה בן חמו',
    when: 'לפני 3 חודשים',
    rating: 5,
    tint: '#3678e9',
    body: [
      { text: 'הייתי סקפטי לגבי כל עולם השיווק דיגיטלי, אבל החברה הזו הוכיחה לי אחרת. ' },
      { text: 'הם בנו לי אתר איכותי ומהיר, ומנהלים לי את הקמפיינים ביד רמה.', accent: true },
    ],
  },
  {
    id: 'shira-malka',
    author: 'שירה מלכה',
    when: 'לפני חודשיים',
    rating: 5,
    tint: '#c25b7c',
    body: [
      { text: 'שנתיים ניסינו להתקדם בקידום האורגני מול ספקים שונים. חצי שנה של עבודה איתם ו' },
      { text: 'הגענו לעמוד הראשון בגוגל במילות המפתח הכי תחרותיות.', accent: true },
    ],
  },
  {
    id: 'omer-dayan',
    author: 'עומר דיין',
    when: 'לפני 5 חודשים',
    rating: 5,
    tint: '#2f9e6f',
    body: [
      { text: 'האתר החדש עלה בזמן ונראה בדיוק כמו שדמיינו, ' },
      { text: 'והכי חשוב - הוא מביא לנו פניות איכותיות כל שבוע.', accent: true },
      { text: ' סוף סוף יש לנו נכס דיגיטלי שעובד.' },
    ],
  },
  {
    id: 'noa-berkovich',
    author: 'נועה ברקוביץ',
    when: 'לפני 8 חודשים',
    rating: 5,
    tint: '#d9793f',
    body: [
      { text: 'יחס אישי, זמינות מטורפת ושקיפות מלאה על כל שקל בתקציב. ' },
      { text: 'סוף סוף יש לנו שליטה על מה שקורה בשיווק של העסק.', accent: true },
    ],
  },
  {
    id: 'yaniv-shitrit',
    author: 'יניב שטרית',
    when: 'לפני 10 חודשים',
    rating: 5,
    tint: '#4a5b8c',
    body: [
      { text: 'חיפשנו ספק אחד שיודע לעשות הכל, מהעיצוב ועד הקמפיינים. ' },
      { text: 'קיבלנו צוות שלם שמלווה אותנו כל יום ומדבר איתנו בגובה העיניים.', accent: true },
    ],
  },
]

export const contact = {
  heading: ['בואו נבנה את', 'הפרויקט הבא שלכם.'],
  art: {
    src: '/images/form.webp',
    caption: ["Let's kick off", 'your project'],
  },
  title: 'בואו נכיר',
  fields: {
    name: 'שם מלא',
    phone: 'טלפון',
    email: 'מייל',
    service: 'סוג שירות',
    servicePlaceholder: 'בחר סוג שירות',
    message: 'מה אתם רוצים לבנות, לשפר, לפתור?',
  },
  serviceOther: 'אחר',
  consent: {
    before: 'קראתי ואני מסכים/ה ',
    terms: { label: 'לתנאי השימוש', href: '/terms-of-use' },
    joiner: ' ',
    privacy: { label: 'ולמדיניות הפרטיות', href: '/privacy-policy' },
    after: '.',
  },
  submit: 'התייעצות ללא עלות',
  sending: 'שולחים…',
  success: {
    title: 'תודה, הפנייה התקבלה.',
    text: 'נחזור אליכם בהקדם כדי לקבוע שיחת היכרות.',
  },
  error: 'משהו השתבש בשליחה. נסו שוב או כתבו לנו ל-info@aiterra.co.il',
}

export const blog = {
  title: 'בלוג',
  metaTitle: 'בלוג דיגיטל - מדריכים לבניית אתרים וקידום',
  metaDescription:
    'מדריכים מעשיים ותובנות על בניית אתרים, קידום אורגני בגוגל, קמפיינים ממומנים ואוטומציה עסקית - מהצוות המקצועי של Aiterra.',
  lede: 'תובנות מקצועיות, מדריכים מעשיים וחדשות מעולם הדיגיטל. הידע שלנו - בשבילכם.',
  crumbHome: 'בית',
  crumbsLabel: 'פירורי לחם',
  filters: [
    { id: 'all', label: 'הכל', tag: 'BLOG', match: [] as string[] },
    { id: 'seo', label: 'SEO', tag: 'SEO', match: ['SEO', 'קידום', 'גוגל'] },
    {
      id: 'sites',
      label: 'אתרים',
      tag: 'WEBSITES',
      match: ['אתר', 'וורדפרס', 'WordPress', 'Next.js', 'React', 'דף נחיתה'],
    },
    { id: 'tips', label: 'טיפים', tag: 'TIPS', match: ['טיפ', 'מדריך', 'אוטומציה', 'CRM', 'שיווק', 'עסק'] },
  ],
  readTime: 'דקות קריאה',
  readMore: 'לקריאת המאמר',
  loadMore: 'הצג עוד מאמרים',
  defaultTag: 'BLOG',
  empty: 'אין מאמרים בקטגוריה הזו עדיין.',
  defaultAuthor: 'צוות Aiterra',
}

export const article = {
  tocTitle: 'תוכן עניינים',
  authorLabel: 'כותב המאמר',
  share: 'שיתוף',
  copied: 'הקישור הועתק',
  publishedPrefix: 'פורסם ב-',
  promoLabel: 'בואו נעבוד יחד',
  relatedTitle: 'מאמרים נוספים שאולי יעניינו אותך',
  prev: 'למאמרים הקודמים',
  next: 'למאמרים הבאים',
}

export const aboutPage = {
  title: 'אודותינו',
  metaTitle: 'אודות אייטרה AITERRA – צוות, ניסיון וגישה לעבודה',
  metaDescription:
    'אייטרה (AITERRA) היא סוכנות תוכנה ודיגיטל מבת ים: אתרים וחנויות אונליין, אפליקציות, אוטומציה, סוכני AI, SEO ו-GEO ופרסום ממומן. הכירו את הצוות, שיטת העבודה והניסיון שמאחורי מאות פרויקטים לעסקים בישראל.',
  lede: 'הדיגיטל מתקדם – אנחנו דואגים שתהיו צעד אחד לפניו.',
  eyebrow: 'על Aiterra',
  heading: ['טכנולוגיה שבונה אתרים.', 'אסטרטגיה שבונה עסקים.'],
  paragraphs: [
    'מערכת 360° לצמיחה עסקית בדיגיטל. אנו ב-Aiterra מגשרים על הפער בין טכנולוגיה מורכבת לתוצאות עסקיות בשטח.',
    'משלב האסטרטגיה וה-UX ועד פיתוח מערכות סקילביליות, קידום אורגני (SEO) וניהול קמפיינים ממומנים – אנחנו הופכים את הנכס הדיגיטלי שלך למנוע צמיחה עוצמתי.',
  ],
  blocks: [
    {
      id: 'about',
      eyebrow: 'על Aiterra',
      heading: ['מקדמים בעלי עסקים', '2 צעדים קדימה'],
      text: 'Aiterra (אייטרה) היא סוכנות תוכנה ודיגיטל מבת ים, ישראל. אנחנו בונים אתרים וחנויות אונליין, אפליקציות למובייל ולדסקטופ בכל סטאק, אוטומציות לעסקים, סוכני AI ולמידת מכונה, שילוב AI באתרים ו-DevOps, ומקדמים עסקים ב-SEO ו-GEO ובפרסום ממומן. טלפון: 052-678-0739, אימייל: info@aiterra.co.il. ב-Aiterra אין צורך לרדוף אחרי ספקים שונים לכל שלב בדרך. אנחנו מרכזים את כל המומחיות – אפיון, עיצוב, פיתוח, קידום אורגני, קמפיינים ממומנים ויצירת תוכן – בצוות אחד שמגבש לעסק שלכם תהליך שלם. התוצאה? תהליך חלק יותר, תקשורת ישירה, ופתרון דיגיטלי שלם שבאמת מניע תוצאות.',
      image: '/images/about-page1.webp',
    },
    {
      id: 'strategy',
      eyebrow: 'האסטרטגיה שלנו',
      heading: ['מאסטרטגיה ועד לתוצאות'],
      text: 'אנחנו ב-Aiterra לא רק בונים אתרים – אנחנו מלווים עסקים בכל שלב של הנוכחות הדיגיטלית. מעיצוב חוויית משתמש ופיתוח טכנולוגי, דרך קידום אורגני וקמפיינים ממומנים, ועד ליצירת תוכן שיווקי שמדבר לקהל שלכם. המעטפת הכוללת שלנו חוסכת לכם זמן, כסף ותיאומים מיותרים – ומאפשרת לכם להתמקד בלהצמיח את העסק.',
      image: '/images/about-page2.webp',
    },
  ],
  teamEyebrow: 'הצוות שלנו',
  teamHeading: ['המוחות מאחורי הטכנולוגיה', 'וההצלחה שלכם'],
  teamLede: 'ב-Aiterra, אנחנו מאמינים שהטכנולוגיה הכי טובה בעולם לא שווה הרבה בלי האנשים הנכונים שמפעילים אותה. לכן, הרכבנו "סיירת דיגיטלית" ממוקדת-מטרה, המשלבת יכולות פיתוח עמוקות יחד עם אסטרטגיות שיווק ולידים אגרסיביות.',
  teamMore: 'עוד על',
  teamClose: 'סגירה',
  faqHeading: ['שאלות נפוצות עלינו', 'למה דווקא Aiterra?'],
}

export const aboutValues = {
  eyebrow: 'הערכים שלנו',
  heading: ['הערכים והחזון שלנו'],
  lede: 'הערכים שמובילים אותנו עם כל לקוח וכל פרויקט שאנחנו לוקחים על עצמנו.',
  roles: [
    {
      id: 'people',
      title: 'אנשים לפני הכל',
      art: '/images/about-icon1.webp',
      text: 'מאחורי כל פרויקט עומדים אנשים – הלקוחות, הגולשים והצוות. אנחנו מקשיבים, מדייקים ובונים פתרונות שמשרתים אותם באמת.',
    },
    {
      id: 'strategy',
      title: 'אסטרטגיה',
      art: '/images/about-icon2.webp',
      text: 'לפני כל שורת קוד ולפני כל קמפיין יש תוכנית: מטרות ברורות, קהל מוגדר ודרך למדוד. כך כל צעד מקדם את העסק.',
    },
    {
      id: 'excellence',
      title: 'מצוינות',
      art: '/images/about-icon3.webp',
      text: 'אנחנו לא מתפשרים על איכות – בקוד, בעיצוב ובתוצאות. כל פרויקט עובר בקרה קפדנית לפני שהוא יוצא לאוויר.',
    },
    {
      id: 'progress',
      title: 'קדמה',
      art: '/images/about-icon4.webp',
      text: 'הדיגיטל לא עומד במקום, וגם אנחנו לא. אנחנו מאמצים טכנולוגיות חדשות ומיישמים אותן כשהן באמת משפרות את התוצאה.',
    },
  ] satisfies AboutRole[],
}

export type ServiceStackItem = {
  id: string
  title: string
  image: string
  tags: string[]
  text: string
  action: { label: string; href: string }
}

export const servicesStack = {
  eyebrow: 'השירותים שלנו',
  heading: ['כל הפתרונות תחת', 'קורת גג אחת'],
  lede: 'ב-Aiterra, אנחנו מבינים שעוצמות דיגיטליות צריכה לייצר אימפקט מוחשי. כחברה לבניית אתרים וסוכנות דיגיטל, אנחנו לא מפרידים בין הטכנולוגיה לשיווק – אנחנו מחברים ביניהם.',
  items: [
    {
      id: 'web-development',
      title: 'בניית אתרים',
      image: '/images/service3.webp',
      tags: ['אפיון', 'עיצוב UX/UI', 'פיתוח בקוד', 'Next.js ו-React', 'מהירות טעינה', 'נגישות'],
      text: 'אתר שנבנה בקוד מלא סביב המטרות של העסק - מהיר, נגיש ומותאם לקידום אורגני מהיום הראשון, עם בעלות מלאה שלכם על הקוד.',
      action: { label: 'לפרטים נוספים', href: '/services/web-development' },
    },
    {
      id: 'seo',
      title: 'קידום אתרים',
      image: '/images/service-page2.webp',
      tags: ['מחקר מילות מפתח', 'קידום טכני', 'תוכן', 'בניית קישורים', 'קידום מקומי', 'נראות בחיפוש AI'],
      text: 'קידום אורגני שנמדד בפניות ולא רק במיקומים. אותו צוות שמקדם גם מפתח, ולכן חסמים טכניים נפתרים אצלנו ברמת הקוד.',
      action: { label: 'לפרטים נוספים', href: '/services/seo' },
    },
    {
      id: 'ecommerce',
      title: 'אתרי E-Commerce',
      image: '/images/service1.webp',
      tags: ['קטלוג מוצרים', 'מערכת Aiterra', 'הקמת חנות', 'סליקה', 'ניהול הזמנות', 'משלוחים'],
      text: 'חנות אונליין שמותאמת למכירה, לניהול ולצמיחה. עם תהליך רכישה ברור וחוויה שעובדת נכון בכל מכשיר.',
      action: { label: 'לפרטים נוספים', href: '/services/ecommerce' },
    },
    {
      id: 'development',
      title: 'פיתוח תוכנה',
      image: '/images/service2.webp',
      tags: ['מערכת מותאמת אישית', 'אוטומציה', 'פורטלים', 'מערכות ניהול', 'API', 'אינטגרציות'],
      text: 'פיתוח מערכות ופתרונות דיגיטליים לפי צורך עסקי ספציפי. בלי להתפשר על פתרונות מדף שלא באמת מתאימים.',
      action: { label: 'לפרטים נוספים', href: '/services/development' },
    },
    {
      id: 'automation',
      title: 'אוטומציה לעסקים',
      image: '/images/service-platform.webp',
      tags: ['זרימת לידים ל-CRM', 'בוט וואטסאפ', 'חשבונית ירוקה ו-iCount', 'Make ו-n8n', 'אוטומציות AI', 'ניטור ותחזוקה'],
      text: 'מחברים את האתר, הוואטסאפ, ה-CRM ומערכת החשבוניות לתהליך אחד שרץ לבד, עם בינה מלאכותית איפה שכלל קבוע לא מספיק, ועם התראה כשמשהו נתקע.',
      action: { label: 'לפרטים נוספים', href: '/services/automation' },
    },
    {
      id: 'marketing',
      title: 'שיווק ופרסום',
      image: '/images/service4.webp',
      tags: ['אסטרטגיה וקהל יעד', 'קמפיינים במטא', 'קמפיינים בגוגל', 'קריאייטיב', 'צילום ועריכה', 'קידום אורגני'],
      text: 'אנחנו בונים את כל המהלך: מהבנת העסק והקהל, דרך האסטרטגיה והמסרים ועד לקריאייטיב שמניע בפיד.',
      action: { label: 'לפרטים נוספים', href: '/services/marketing' },
    },
    {
      id: 'branding',
      title: 'מיתוג ועיצוב',
      image: '/images/service-branding.webp',
      tags: ['מיתוג עסקי', 'שפה ויזואלית', 'עיצוב אתרים', 'UX/UI', 'דפי נחיתה', 'עיצוב אפליקציות'],
      text: 'מיתוג עסקי, עיצוב אתרים וחוויית משתמש — מקונספט ראשוני ועד ממשק מוכן לפיתוח. עיצוב שלא רק נראה טוב, אלא גם עובד.',
      action: { label: 'לפרטים נוספים', href: '/services/branding' },
    },
    {
      id: 'brochure',
      title: 'אתר תדמית',
      image: '/images/service-dev.webp',
      tags: ['מיצוב ומסרים', 'מבנה עמודים', 'כתיבת תוכן', 'עיצוב', 'טפסים ולידים', 'מדידה'],
      text: 'אתר תדמית שתפקידו לייצר פניות: מיצוב, מבנה, תוכן ועיצוב שמובילים את הגולש לפעולה אחת ברורה.',
      action: { label: 'לפרטים נוספים', href: '/services/brochure' },
    },
    {
      id: 'maintenance',
      title: 'תחזוקת אתרים',
      image: '/images/services-view-bg.webp',
      tags: ['מחירון גלוי', 'זמני תגובה בהסכם', 'עדכוני אבטחה', 'גיבויים וניטור', 'ת"י 5568', 'אינטגרציות ישראליות'],
      text: 'חבילות תחזוקה חודשיות עם מחירון גלוי וזמני תגובה כתובים בהסכם — כולל אתרים שלא נבנו אצלנו.',
      action: { label: 'לפרטים נוספים', href: '/services/maintenance' },
    },
    {
      id: 'ai-agents',
      title: 'סוכני AI',
      image: '/images/service-agents-hero.webp',
      tags: [
        'מענה מסביב לשעון',
        'סינון לידים',
        'קביעת פגישות',
        'חיבור ל-CRM',
        'וואטסאפ',
        'העברה לנציג',
      ],
      text: 'סוכני AI שעונים בעברית מתוך התוכן שלכם ומבצעים פעולות במערכות הקיימות, עם גבולות כתובים והעברה לנציג אנושי ברגע הנכון.',
      action: { label: 'לפרטים נוספים', href: '/services/ai-agents' },
    },
    {
      id: 'ai-search',
      title: 'קידום ב-AI',
      image: '/images/service-ai-search-hero.webp',
      tags: [
        'AI Overviews',
        'ChatGPT ו-Gemini',
        'הגדרת ישות',
        'סכמה',
        'תוכן בר-ציטוט',
        'דוח נראות',
      ],
      text: 'נראות בתשובות שמנועי AI מנסחים: הגדרת ישות וסכמה, תוכן שאפשר לצטט ודוח חודשי שמראה על אילו שאלות אתם מוזכרים ועל אילו לא.',
      action: { label: 'לפרטים נוספים', href: '/services/ai-search' },
    },
    {
      id: 'machine-learning',
      title: 'למידת מכונה ו-Data Science',
      image: '/images/services-view.webp',
      tags: [
        'חיזוי ביקוש ומכירות',
        'דירוג לידים ונטישה',
        'המלצות לחנות',
        'סיווג מסמכים בעברית',
        'זיהוי חריגות',
        'דשבורדים ו-BI',
      ],
      text: 'מודלים שנבנים על הנתונים של העסק: חיזוי, דירוג, המלצות וזיהוי חריגות, שנבדקים מול השיטה הקיימת ומחוברים למערכות שבהן מחליטים.',
      action: { label: 'לפרטים נוספים', href: '/services/machine-learning' },
    },
    {
      id: 'computer-vision',
      title: 'ראייה ממוחשבת',
      image: '/images/service-platform.webp',
      tags: [
        'OCR לחשבוניות בעברית',
        'זיהוי אובייקטים',
        'בקרת איכות',
        'ספירת אנשים ורכבים',
        'טשטוש פנים',
        'תיוג תמונות מוצר',
      ],
      text: 'זיהוי בתמונות, בסריקות ובווידאו — ממסמכים וחשבוניות בעברית ועד פגמים בקו ייצור — שנבדק על התמונות שלכם ומזרים את התוצאה למערכת.',
      action: { label: 'לפרטים נוספים', href: '/services/computer-vision' },
    },
    {
      id: 'llm-integration',
      title: 'חיבור LLM ו-RAG',
      image: '/images/services-view.webp',
      tags: [
        'צ׳אט על מסמכי החברה',
        'עוזר ידע פנימי',
        'RAG בעברית',
        'חילוץ וסיכום מסמכים',
        'GPT, Claude ו-Gemini',
        'פריסה פרטית',
      ],
      text: 'GPT, Claude או Gemini שמחוברים למסמכים ולמערכות של העסק: עוזר ידע פנימי, צ׳אט על מסמכים בעברית וחילוץ מידע ממסמכים — עם מקור לכל תשובה והרשאות לפי משתמש.',
      action: { label: 'לפרטים נוספים', href: '/services/llm-integration' },
    },
    {
      id: 'data-analytics',
      title: 'ניתוח נתונים ודשבורדים',
      image: '/images/services-view.webp',
      tags: [
        'דשבורדים ב-Looker Studio',
        'Power BI',
        'חיבור CRM וחנות',
        'נתוני פרסום',
        'הנהלת חשבונות',
        'דוחות אוטומטיים',
      ],
      text: 'כל המספרים של העסק במקום אחד: חיבור CRM, חנות, קמפיינים והנהלת חשבונות לדשבורד ב-Looker Studio או Power BI, עם דוחות שמגיעים לבד.',
      action: { label: 'לפרטים נוספים', href: '/services/data-analytics' },
    },
    {
      id: 'ai-consulting',
      title: 'ייעוץ והטמעת AI',
      image: '/images/services-view.webp',
      tags: [
        'בדיקת מוכנות ל-AI',
        'בחירת כלים ומודלים',
        'מדיניות שימוש ב-AI',
        'הדרכות צוות בעברית',
        'פיילוט והטמעה',
        'מדידת תועלת',
      ],
      text: 'מיפוי התהליכים שבהם AI משתלם, בחירת כלים ומודלים, מדיניות שימוש, הדרכת צוות בעברית ופיילוט עם מדידה לפני הרחבה.',
      action: { label: 'לפרטים נוספים', href: '/services/ai-consulting' },
    },
    {
      id: 'voice-agents',
      title: 'סוכני קול וצ׳אטבוט טלפוני',
      image: '/images/services-view.webp',
      tags: [
        'מענה לשיחות נכנסות',
        'קו אחרי שעות',
        'קביעת תורים בטלפון',
        'שיחות תזכורת',
        'סיכומים ל-CRM',
        'העברה לנציג',
      ],
      text: 'סוכנים קוליים בעברית שעונים לשיחות, קובעים תורים ומתקשרים עם תזכורות, מעל הטלפוניה הקיימת ומחוברים ליומן ול-CRM, עם העברה לנציג וסיכום לכל שיחה.',
      action: { label: 'לפרטים נוספים', href: '/services/voice-agents' },
    },
    {
      id: 'generative-ai',
      title: 'בינה מלאכותית יוצרת',
      image: '/images/services-view.webp',
      tags: [
        'תמונות מוצר',
        'סרטונים וריילס',
        'וריאציות למודעות',
        'כתיבה בעברית',
        'אווטאר והקראה',
        'צינור תוכן',
      ],
      text: 'מודלים ליצירת תמונות ווידאו, מודלי שפה לכתיבה בעברית, כלי אווטאר והקראה ברישיון מסחרי, חיבור לקטלוג ולחנות ותור אישורים לעורך.',
      action: { label: 'לפרטים נוספים', href: '/services/generative-ai' },
    },
    {
      id: 'ai-product-development',
      title: 'פיתוח מוצרי AI',
      image: '/images/services-view.webp',
      tags: [
        'מוצר AI',
        'MVP',
        'SaaS',
        'אפליקציית ווב',
        'חיוב ומכסות',
        'בעלות על הקוד',
      ],
      text: 'מודלים מכמה ספקים, שכבת הפשטה להחלפת ספק, בדיקות איכות אוטומטיות, חיוב ומכסות, תשתית ענן בחשבון שלכם.',
      action: { label: 'לפרטים נוספים', href: '/services/ai-product-development' },
    },
    {
      id: 'mobile-app-development',
      title: 'פיתוח אפליקציות',
      image: '/images/services-view.webp',
      tags: [
        'iOS ואנדרואיד',
        'נייטיב או חוצה פלטפורמות',
        'MVP ועד קנה מידה',
        'התראות פוש ותשלומים',
        'ממשק RTL בעברית',
        'פרסום בחנויות',
      ],
      text: 'Swift, Kotlin, React Native, Flutter, Node.js ו-API מתועד, תשלומים, התראות פוש ואנליטיקה. אנחנו עובדים בכל שפה וסביבה שהפרויקט דורש.',
      action: { label: 'לפרטים נוספים', href: '/services/mobile-app-development' },
    },
    {
      id: 'desktop-app-development',
      title: 'פיתוח תוכנה לדסקטופ',
      image: '/images/services-view.webp',
      tags: [
        'אפליקציות Windows ו-macOS',
        'כלים פנימיים',
        'עבודה בלי אינטרנט',
        'חיבור לחומרה וציוד',
        'העברת תוכנה ישנה',
        'התקנה ועדכון אוטומטי',
      ],
      text: 'Electron, Tauri, .NET, WPF, C++, Qt, Python',
      action: { label: 'לפרטים נוספים', href: '/services/desktop-app-development' },
    },
    {
      id: 'devops-cloud',
      title: 'DevOps וענן',
      image: '/images/services-view.webp',
      tags: [
        'CI/CD',
        'Docker ו-Kubernetes',
        'AWS, GCP, Azure ו-Hetzner',
        'תשתית כקוד עם Terraform',
        'ניטור והתראות',
        'גיבויים והתאוששות מאסון',
      ],
      text: 'AWS, GCP, Azure, Hetzner, Docker, Kubernetes, Terraform, GitHub Actions, GitLab CI, Prometheus, Grafana',
      action: { label: 'לפרטים נוספים', href: '/services/devops-cloud' },
    },
    {
      id: 'ai-website-integration',
      title: 'שילוב AI באתר',
      image: '/images/services-view.webp',
      tags: [
        'צ׳אט באתר מתוך התוכן שלכם',
        'חיפוש חכם',
        'המלצות והתאמה אישית',
        'תוכן ותמונות במערכת הניהול',
        'תרגום ולוקליזציה',
        'דירוג לידים',
      ],
      text: 'OpenAI, Claude, Gemini, וורדפרס, שופיפיי, ווקומרס, ויקס, Next.js, אפליקציות מובייל',
      action: { label: 'לפרטים נוספים', href: '/services/ai-website-integration' },
    },
    {
      id: 'ai-built-app-completion',
      title: 'השלמת פרויקט שנבנה ב-AI',
      image: '/images/services-view.webp',
      tags: [
        'ביקורת קוד ואבטחה',
        'בסיס נתונים והרשאות',
        'סליקה ואינטגרציות',
        'העלאה לפרודקשן',
        'עברית, נגישות ו-SEO',
        'מסירה ותחזוקה',
      ],
      text: 'Lovable, Bolt, v0, Replit, Cursor, Base44, React, Next.js, Supabase, Firebase',
      action: { label: 'לפרטים נוספים', href: '/services/ai-built-app-completion' },
    },
    {
      id: 'privacy-compliance',
      title: 'התאמת אתר לתיקון 13',
      image: '/images/services-view.webp',
      tags: [
        'סקירת טפסים ומידע',
        'באנר עוגיות וחסימת מעקב',
        'מדיניות פרטיות',
        'מדיניות עוגיות',
        'אבטחה והרשאות',
        'בקשות עיון ומחיקה',
      ],
      text: 'עוגיות, טפסים, מדיניות ואבטחה',
      action: { label: 'לפרטים נוספים', href: '/services/privacy-compliance' },
    },
  ] satisfies ServiceStackItem[],
}

export type ServiceSystemFeature = {
  id: string
  icon: 'orders' | 'club' | 'sales' | 'catalog' | 'analytics'
  title: string
  text: string
}

export type ServiceStep = {
  id: string
  title: string
  text: string
  art: string
}

export type ServicePlanIcon =
  | 'storefront'
  | 'products'
  | 'inventory'
  | 'dashboard'
  | 'automation'
  | 'report'
  | 'shipping'
  | 'alerts'
  | 'support'
  | 'stores'
  | 'tailor'
  | 'api'
  | 'manager'
  | 'training'

export type ServicePlan = {
  id: string
  name: string
  audience: string
  price: string
  priceNote?: string
  term: string
  action: { label: string; href: string }
  badge?: string
  featured?: boolean
  featuresTitle: string
  features: { icon: ServicePlanIcon; label: string }[]
}

export type ServiceCase = {
  id: string
  title: string
  tags: string[]
  shot: string
  href: string
  subtitle?: string
  metrics?: { label: string; value: string }[]
}

export type ServicePage = {
  id: string
  crumb: string
  eyebrow: string
  heading: string[]
  subhead: string
  lede: string
  image: string
  action: { label: string; href: string }
  metaTitle: string
  metaDescription: string
  advantages: {
    eyebrow: string
    heading: string[]
    lede: string
    roles: AboutRole[]
    outro?: string
    action?: { label: string; href: string }
  }
  system?: {
    eyebrow: string
    heading: string[]
    art: string
    features: ServiceSystemFeature[]
    action: { label: string; href: string }
  }
  howItWorks?: {
    eyebrow: string
    heading: string[]
    lede: string
    steps: ServiceStep[]
  }
  pricing?: {
    eyebrow: string
    heading: string[]
    lede: string
    plans: ServicePlan[]
    footnote: { text: string; link: { label: string; href: string } }
  }
  banner?: {
    heading: string
    action: { label: string; href: string }
  }
  cases?: {
    eyebrow: string
    heading: string[]
    items: ServiceCase[]
    cardAction: string
    prev: string
    next: string
  }
  faqHeading: string[]
  faqEntries?: { question: string; answer: string }[]
}

export const servicePages: Record<string, ServicePage> = {
  'web-development': {
    id: 'web-development',
    crumb: 'בניית אתרים',
    eyebrow: 'בניית אתרים',
    heading: ['בניית אתרים בקוד', 'שמביאה לקוחות'],
    subhead: 'המומחיות שלנו בבניית אתרים',
    lede: 'אפיון, עיצוב ופיתוח בקוד מלא - אתר מהיר, נגיש ומותאם למובייל, שנבנה נכון לקידום אורגני כבר מהיום הראשון. הקוד נשאר שלכם.',
    image: '/images/service-dev.webp',
    action: { label: 'לשיחת ייעוץ ואפיון', href: '/contact' },
    metaTitle: 'בניית אתרים לעסקים - פיתוח אתרים בקוד מלא',
    metaDescription:
      'חברה לבניית אתרים בקוד מלא: אפיון, עיצוב UX/UI ופיתוח ב-Next.js ו-React. אתר מהיר, נגיש לפי תקן ישראלי ובנוי לקידום אורגני - עם בעלות מלאה שלכם על הקוד.',
    advantages: {
      eyebrow: 'היתרונות שלנו',
      heading: ['היתרונות הייחודיים שלנו'],
      lede: 'מה מיוחד בבניית אתרים אצלנו, ולמה זה משנה לעסק שלכם?',
      roles: [
        {
          id: 'spec',
          title: 'אפיון לפני שורת קוד',
          art: '/images/service-page-discovery.webp',
          text: 'מתחילים בהבנה של העסק, קהל היעד והמתחרים, ורק אחר כך מגדירים מבנה עמודים ומסרים. כל עמוד נבנה סביב פעולה אחת שאנחנו רוצים שהגולש יבצע.',
        },
        {
          id: 'code',
          title: 'פיתוח בקוד, לא בתבנית',
          art: '/images/service-page1.webp',
          text: 'בונים ב-Next.js, React ו-TypeScript במקום להילחם במגבלות של ערכות נושא ותוספים. התוצאה: אתר שקל להרחיב כשהעסק גדל, בלי לשלם פעמיים על אותו דבר.',
        },
        {
          id: 'speed',
          title: 'מהירות כחלק מהתהליך',
          art: '/images/service-page3.webp',
          text: 'מדדי הליבה של גוגל (Core Web Vitals) נבדקים תוך כדי הפיתוח ולא כתיקון בסוף. אתר איטי שורף תקציבי פרסום ומאבד גולשים לפני שהם בכלל ראו את ההצעה.',
        },
        {
          id: 'ownership',
          title: 'הקוד שלכם, בלי נעילת ספק',
          art: '/images/service-page4.webp',
          text: 'בסיום הפרויקט אתם מקבלים את הקוד ואת הגישה לכל השירותים. אם תרצו להמשיך עם ספק אחר, לא תישארו תקועים - וזה בדיוק מה שמאפשר לנו לעבוד בלי לכבול אתכם.',
        },
      ] satisfies AboutRole[],
    },
    system: {
      eyebrow: 'מערכת ניהול',
      heading: ['מערכת הניהול של Aiterra'],
      art: '/images/service-cms.webp',
      features: [
        {
          id: 'pages',
          icon: 'catalog',
          title: 'ניהול עמודים ותוכן',
          text: 'עריכת טקסטים, תמונות ובאנרים והוספת עמודים חדשים מממשק אחד בעברית, בלי ידע טכני ובלי לחזור אלינו על כל שינוי.',
        },
        {
          id: 'leads',
          icon: 'orders',
          title: 'ניהול פניות מהאתר',
          text: 'כל טופס נשמר במערכת עם התראה במייל או בוואטסאפ וסטטוס טיפול, כדי שאף פנייה לא תלך לאיבוד בין המיילים.',
        },
        {
          id: 'seo',
          icon: 'analytics',
          title: 'שליטה מלאה בקידום',
          text: 'ניהול כותרות ותיאורים, כתובות ידידותיות, נתוני סכמה ומפת אתר - בלי תוסף חיצוני ובלי להסתמך על ספק נוסף.',
        },
        {
          id: 'landing',
          icon: 'sales',
          title: 'עמודי נחיתה לקמפיינים',
          text: 'הקמה מהירה של עמוד נחיתה ייעודי לכל קמפיין, עם טפסים ומעקב המרות, כך שהפרסום והאתר עובדים כמערכת אחת.',
        },
        {
          id: 'integrations',
          icon: 'club',
          title: 'חיבור למערכות שלכם',
          text: 'אינטגרציה למערכת ה-CRM, לתוכנת החשבוניות, לסליקה ולדיוור שאתם כבר עובדים איתם, דרך API - בלי הזנה ידנית כפולה.',
        },
      ] satisfies ServiceSystemFeature[],
      action: { label: 'בואו נתאים את האתר שלכם', href: '/contact' },
    },
    howItWorks: {
      eyebrow: 'איך זה עובד',
      heading: ['איך זה עובד? פשוט מאוד.'],
      lede: 'שלושה שלבים ברורים מהשיחה הראשונה ועד העלייה לאוויר, עם מנהל פרויקט אחד שמלווה אתכם לאורך כל הדרך.',
      steps: [
        {
          id: 'discovery',
          title: 'אפיון והגדרת מטרות',
          text: 'נכיר את העסק, קהל היעד והמתחרים, נגדיר מה נחשב הצלחה במספרים, ונבנה מפת עמודים ומסרים לפני שנוגעים בעיצוב.',
          art: '/images/howitwork1.webp',
        },
        {
          id: 'build',
          title: 'עיצוב ופיתוח',
          text: 'נעצב מסכים בהתאמה למותג ונפתח בקוד מלא: התאמה למובייל, נגישות לפי התקן הישראלי ומהירות טעינה שנמדדת תוך כדי עבודה.',
          art: '/images/howitwork2.webp',
        },
        {
          id: 'launch',
          title: 'השקה, מדידה וליווי',
          text: 'נחבר דומיין, אנליטיקס ומערכת ניהול, נדריך את הצוות שלכם על עדכון עצמאי, ונמשיך לעקוב אחרי הביצועים והפניות גם אחרי ההשקה.',
          art: '/images/howitwork3.webp',
        },
      ] satisfies ServiceStep[],
    },
    banner: {
      heading: 'רוצים לדעת מה נכון לעסק שלכם - שדרוג או אתר חדש?',
      action: { label: 'דברו איתנו ונתחיל לאפיין', href: '/contact' },
    },
    faqHeading: ['לפני שמתחילים', 'כמה דברים שכדאי לדעת.'],
    faqEntries: [
      {
        question: 'כמה עולה לבנות אתר לעסק?',
        answer:
          'המחיר נגזר מסוג הפרויקט ומההיקף שלו, ולא ממספר העמודים לבדו: דף נחיתה ממוקד, אתר תדמית לפי מספר התבניות והמסכים הייחודיים, או חנות ומערכת מותאמת אישית שמתומחרות לפי המורכבות והאינטגרציות. מה שמזיז את המחיר בפועל הוא בדרך כלל החיבורים - סליקה ישראלית, חשבונית ירוקה או iCount, CRM, ניהול מלאי - ולא כמות הטקסט. אחרי שיחת אפיון קצרה תקבלו הצעת מחיר שקופה עם פירוט מה כלול, מה לא כלול ומה ייחשב לתוספת, בלי עלויות שמתגלות באמצע הדרך. ההשוואה בין הצעות מספקים שונים אפשרית רק כשהפירוט הזה קיים בשתיהן.',
      },
      {
        question: 'כמה זמן לוקח לבנות אתר?',
        answer:
          'דף נחיתה עולה לאוויר תוך שבועות בודדים, אתר תדמית מלא לוקח בדרך כלל בין חודש לחודשיים, וחנות אינטרנטית או מערכת מותאמת אישית עם הרשאות משתמשים ולוגיקה עסקית - יותר מכך. הגורם שהכי מאריך לוח זמנים אינו הפיתוח אלא התוכן, התמונות והאישורים מצד הלקוח, ולכן אנחנו מגדירים אותם כבר בשלב האפיון: מי כותב, מי מאשר ועד מתי. בפרויקטים שבהם התוכן מוכן מראש, לוח הזמנים כמעט תמיד נשמר. אנחנו מוסרים בשלבים שאפשר ללחוץ עליהם ולראות במהלך הדרך, כך שהערות נכנסות מוקדם ולא בשבוע האחרון לפני העלייה לאוויר.',
      },
      {
        question: 'וורדפרס או אתר בקוד - מה עדיף לעסק שלנו?',
        answer:
          'תלוי במה שהאתר צריך לעשות, וזו לא שאלה אידאולוגית. לאתר תוכן פשוט שמתעדכן הרבה על ידי אנשים לא טכניים, וורדפרס יכול להספיק ונאמר לכם את זה. כשצריך ביצועים גבוהים ועמידה במדדי הליבה של גוגל, לוגיקה עסקית ייחודית, או אינטגרציות עמוקות למערכות קיימות - פיתוח בקוד יוצא זול יותר לאורך זמן, כי לא משלמים שוב ושוב על עקיפת מגבלות של תוספים. חשוב גם לזכור שכל תוסף הוא תלות אבטחה ותלות עדכונים: ככל שהערימה גדלה, כך גדל הסיכוי שעדכון אחד ישבור משהו אחר. באפיון נגיד בכנות מה מתאים, גם אם התשובה היא שלא צריך פיתוח מותאם.',
      },
      {
        question: 'האם הקוד של האתר שייך לנו?',
        answer:
          'כן. בסיום הפרויקט אתם מקבלים בעלות מלאה על הקוד: מאגר הקוד עצמו, צינור הפריסה לשרת, והגישה לדומיין, לאחסון ולכל השירותים המחוברים - סליקה, חשבוניות ואנליטיקס. גם קובצי המקור של העיצוב נמסרים אליכם. אנחנו לא מחזיקים לקוחות דרך נעילה טכנית: אם תרצו להמשיך עם ספק אחר, המעבר אפשרי ומסודר ולא דורש לבנות את האתר מחדש. זה ההבדל המעשי מול פלטפורמות סגורות, שבהן התוכן והעיצוב שלכם אבל המערכת שמריצה אותם אינה שלכם. כדאי לוודא שהתנאי הזה מופיע בכתב בכל הצעה שאתם שוקלים, אצלנו ואצל כל ספק אחר.',
      },
      {
        question: 'האם האתר יהיה נגיש לפי התקן הישראלי?',
        answer:
          'כן. אנחנו בונים לפי תקן ישראלי ת"י 5568, המבוסס על WCAG 2.0 ברמה AA, ומיישמים גם את דרישות WCAG 2.1 ברמה AA: ניווט מלא במקלדת, ניגודיות צבעים תקינה, טקסט חלופי לתמונות, היררכיית כותרות שקורא מסך יכול לעבור, טפסים עם תוויות תקינות והצהרת נגישות באתר. נגישות היא חובה חוקית בישראל והאחריות היא של בעל האתר, לא של מי שבנה אותו. חשוב להבין שתוסף נגישות לבדו לרוב אינו מספיק כדי לעמוד בתקן - הוא מוסיף שכבת בקרה מעל האתר אבל אינו מתקן מבנה שגוי, ניגודיות נמוכה או ניווט שבור מתחתיה.',
      },
      {
        question: 'יש לנו אתר קיים - לשדרג אותו או לבנות מחדש?',
        answer:
          'באפיון נבדוק מה שווה לשמר: תוכן שמדרג, כתובות קיימות, קישורים נכנסים ודירוגים אורגניים - ולצידם נסרוק את האתר ונבדוק מהירות, מצב אינדוקס ב-Google Search Console ומיקומים נוכחיים. אם שדרוג פותר את הבעיה, נגיד את זה, כי הוא זול יותר ושומר על ההיסטוריה שצברתם. אם בונים מחדש, אנחנו מתכננים מראש מפת הפניות 301 מכל כתובת ישנה לחדשה, שומרים על מבנה הכותרות והמטא-דאטה ומנטרים כיסוי ודירוגים אחרי ההשקה. מעבר לא מתוכנן מאתר ותיק הוא אחת הדרכים המהירות ביותר למחוק שנים של עבודה אורגנית, וכמעט תמיד הסיבה היא כתובות שהשתנו בלי הפניה.',
      },
    ],
  },
  ecommerce: {
    id: 'ecommerce',
    crumb: 'אתרי E-Commerce',
    eyebrow: 'אתרי E-Commerce',
    heading: ['חנות אינטרנטית שנבנית', 'בדיוק למידות של העסק שלך'],
    subhead: 'המומחיות שלנו ב-E-Commerce',
    lede: 'פיתוח בקוד מלא מבוסס מערכת Aiterra - מהיר, מותאם אישית, עם ליווי ועדכונים שוטפים גם לאחר ההשקה.',
    image: '/images/service1.webp',
    action: { label: 'לשיחת ייעוץ ואפיון', href: '/contact' },
    metaTitle: 'בניית אתר חנות אינטרנטית לעסקים, בקוד מלא',
    metaDescription:
      'בניית חנות אונליין בקוד מלא על מערכת Aiterra: קטלוג מוצרים, סליקה, ניהול הזמנות ומשלוחים, עם ליווי ועדכונים שוטפים גם אחרי ההשקה.',
    advantages: {
      eyebrow: 'היתרונות שלנו',
      heading: ['היתרונות הייחודיים שלנו'],
      lede: 'מה מיוחד בשירות שלנו באתרי מסחר וחנויות דיגיטליות?',
      roles: [
        {
          id: 'spec',
          title: 'איפיון מדויק ומותאם אישית',
          art: '/images/service-page-discovery.webp',
          text: 'מתחילים באפיון של המוצרים, קהל היעד ומסלול הקנייה, כך שכל מסך בחנות נבנה סביב החלטה אמיתית של הלקוח.',
        },
        {
          id: 'code',
          title: 'פיתוח בקוד ייעודי',
          art: '/images/service-page1.webp',
          text: 'פיתוח מותאם אישית, ללא תבניות חונקות, ביצועים מהירים במיוחד, גמישות עיצובית ו-SEO מעולה.',
        },
        {
          id: 'scale',
          title: 'מערכת שגדלה עם העסק',
          art: '/images/service-page3.webp',
          text: 'הוספת מוצרים, קטגוריות ואינטגרציות בלי לבנות הכל מחדש. החנות מתרחבת יחד עם הקצב שלכם.',
        },
        {
          id: 'support',
          title: 'שירות ותמיכה 24/7',
          art: '/images/service-page4.webp',
          text: 'ליווי שוטף גם אחרי ההשקה: עדכונים, מעקב אחרי ביצועים ומענה מהיר כשצריך לשנות משהו בחנות.',
        },
      ] satisfies AboutRole[],
    },
    system: {
      eyebrow: 'מערכת ניהול',
      heading: ['מערכת הניהול של Aiterra'],
      art: '/images/management-console.webp',
      features: [
        {
          id: 'orders',
          icon: 'orders',
          title: 'ניהול הזמנות חכם',
          text: 'שינוי סטטוסים, חלוקה לקבוצות, ניהול אזורי ועלויות משלוח, התראות מיידיות ב-SMS / Whatsapp על הזמנה חדשה ויצירת הזמנות ידניות.',
        },
        {
          id: 'club',
          icon: 'club',
          title: 'מועדון לקוחות וצבירת נקודות',
          text: 'ניהול חברי מועדון, צבירת נקודות ומימושן בקופה, הטבות ייעודיות לקהלים שונים ומעקב אחרי הרכישות החוזרות של כל לקוח.',
        },
        {
          id: 'sales',
          icon: 'sales',
          title: 'אופטימיזציות מכירות ודיוור מובנה',
          text: 'קופונים ומבצעים, הצעות משלימות בעגלה, שחזור עגלות נטושות ודיוור אוטומטי ללקוחות – הכל מתוך המערכת ובלי כלים חיצוניים.',
        },
        {
          id: 'catalog',
          icon: 'catalog',
          title: 'קטלוג ותוכן בשליטה מלאה',
          text: 'הוספת מוצרים, קטגוריות, מלאי ותוכן שיווקי בממשק אחד, כולל עדכון מחירים והעלאת תמונות בלי להיעזר במפתח.',
        },
        {
          id: 'analytics',
          icon: 'analytics',
          title: 'אנליטיקה ו-SEO מתקדם',
          text: 'דוחות מכירות והתנהגות גולשים, חיבור ל-Google Analytics ולפיקסלים, ניהול מטא-דאטה, כתובות ידידותיות ומהירות טעינה גבוהה.',
        },
      ] satisfies ServiceSystemFeature[],
      action: { label: 'בואו נתאים את החנות שלכם', href: '/contact' },
    },
    howItWorks: {
      eyebrow: 'איך זה עובד',
      heading: ['איך זה עובד? פשוט מאוד.'],
      lede: 'Aiterra מרכזת את כל הפעילות של החנות הדיגיטלית במקום אחד, כדי שתוכלו לנהל בקלות, לקבל תמונת מצב ברורה ולצמוח בלי לעבור בין אינספור מערכות.',
      steps: [
        {
          id: 'discovery',
          title: 'נבין את הצרכים שלך בשיחת איפיון',
          text: 'נכיר את העסק, תהליכי העבודה, האתגרים והמטרות שלך. יחד נמפה את הצרכים ונגדיר כיצד המערכת יכולה לייעל את הניהול ולתמוך בצמיחה של החנות.',
          art: '/images/howitwork1.webp',
        },
        {
          id: 'fit',
          title: 'נתאים את המערכת לצורך העסקי',
          text: 'נגדיר את הכלים, ההרשאות, האוטומציות והחיבורים הרלוונטיים לעסק שלך. כך תקבל מערכת שמתאימה לתהליכי העבודה הקיימים ולא מערכת שצריך להתאים את העסק אליה.',
          art: '/images/howitwork2.webp',
        },
        {
          id: 'launch',
          title: 'נטמיע את המערכת בחנות שלך',
          text: 'נחבר את המערכת לחנות, נגדיר את סביבת העבודה ונבדוק שכל התהליכים פועלים בצורה תקינה. נלווה אותך עד שהמערכת תהיה מוכנה לעבודה שוטפת, חלקה ויעילה.',
          art: '/images/howitwork3.webp',
        },
      ] satisfies ServiceStep[],
    },
    pricing: {
      eyebrow: 'מחירים',
      heading: ['חבילות ומסלולים'],
      lede: 'בחרו את המסלול המתאים ביותר עבור החנות שלכם',
      plans: [
        {
          id: 'basic',
          name: 'Basic',
          audience: 'לבעלי עסקים קטנים',
          price: '500',
          priceNote: '₪ לחודש',
          term: 'בהתחייבות ל-12 חודשים',
          action: { label: 'הקימו את החנות שלכם', href: '/contact' },
          featuresTitle: 'מה תקבלו?',
          features: [
            { icon: 'storefront', label: 'חיבור לחנות דיגיטלית אחת' },
            { icon: 'products', label: 'ניהול מוצרים, הזמנות ולקוחות' },
            { icon: 'inventory', label: 'ניהול מלאי ועדכון כמויות' },
            { icon: 'dashboard', label: 'דשבורד עם נתוני החנות בזמן אמת' },
          ],
        },
        {
          id: 'pro',
          name: 'Pro',
          audience: 'לבעלי חנויות גדולות',
          price: '800',
          priceNote: '₪ לחודש',
          term: 'בהתחייבות ל-12 חודשים',
          action: { label: 'הקימו את החנות שלכם', href: '/contact' },
          badge: 'הכי משתלם',
          featured: true,
          featuresTitle: 'כל מה שקיים ב-Basic וגם:',
          features: [
            { icon: 'automation', label: 'אוטומציות לתהליכי עבודה' },
            { icon: 'report', label: 'דוחות מתקדמים ותובנות עסקיות' },
            { icon: 'shipping', label: 'חיבור למערכות משלוחים ותשלומים' },
            { icon: 'alerts', label: 'התראות חכמות ועדכונים בזמן אמת' },
            { icon: 'support', label: 'תמיכה בעדיפות גבוהה' },
          ],
        },
        {
          id: 'enterprise',
          name: 'Enterprise',
          audience: 'לארגונים ועסקים שצריכים פתרון מותאם',
          price: 'בהתאמה אישית',
          term: 'בהתחייבות ל-12 חודשים',
          action: { label: 'דברו איתנו ונתחיל לאפיין', href: '/contact' },
          featuresTitle: 'כל מה שקיים ב-Pro וגם:',
          features: [
            { icon: 'stores', label: 'ניהול מספר חנויות ממערכת אחת' },
            { icon: 'tailor', label: 'התאמת המערכת לתהליכי העסק' },
            { icon: 'api', label: 'חיבור באמצעות API' },
            { icon: 'manager', label: 'מנהל לקוח וליווי מקצועי צמוד' },
            { icon: 'training', label: 'הטמעה, הדרכה ותמיכה מורחבת' },
          ],
        },
      ] satisfies ServicePlan[],
      footnote: {
        text: 'יש לכם שאלות?',
        link: { label: 'פנו אלינו ונדבר', href: '/contact' },
      },
    },
    banner: {
      heading: 'רוצים לראות איך החנות שלכם תיראה?',
      action: { label: 'דברו איתנו ונתחיל לאפיין', href: '/contact' },
    },
    faqHeading: ['לפני שמתחילים', 'כמה דברים שכדאי לדעת.'],
    faqEntries: [
      {
        question: 'מהי מערכת Aiterra?',
        answer:
          'Aiterra היא מערכת לניהול חנות דיגיטלית שמרכזת את הפעילות העסקית במקום אחד. באמצעותה מנהלים מוצרים ווריאציות, הזמנות וסטטוסים, מלאי, לקוחות ומשלוחים, ורואים את נתוני החנות בזמן אמת בלוח בקרה אחד. ההבדל המעשי מול חנות שמורכבת מתוספים הוא שאין חמש מערכות שצריך לסנכרן ביניהן ידנית: הזמנה מייצרת תשלום, חשבונית ועדכון מלאי באותו רגע, בלי שמישהו יקליד את אותם נתונים פעם שנייה בסוף היום. החנות עצמה נבנית בקוד (React ו-Next.js) ולא מתבנית, והמערכת היא שכבת הניהול שרצה מעליה.',
      },
      {
        question: 'למי המערכת מתאימה?',
        answer:
          'לעסקים שמוכרים אונליין ורוצים שליטה מלאה בחנות ולא רק בתוכן שלה: מעסקים קטנים שמקימים חנות ראשונה ורוצים להתחיל נכון, דרך חנויות עם קטלוג רחב שבהן מהירות טעינה ופילטרים מתחילים להיות בעיה אמיתית, ועד ארגונים שמנהלים כמה חנויות, כמה שווקים או תהליכי עבודה מורכבים מול מחסן ומערכת ERP. זה מתאים במיוחד כשיש כללי תמחור לא סטנדרטיים, מבנה קטלוג שתבנית מוכנה לא יודעת לייצג, או צורך בחיבור עמוק למערכות פנימיות. אם הקטלוג פשוט והדרישות סטנדרטיות, פלטפורמה מוכנה עשויה להיות התשובה הזולה יותר - ונאמר לכם את זה.',
      },
      {
        question: 'אילו תהליכים אפשר לנהל באמצעות המערכת?',
        answer:
          'ניהול קטלוג, וריאציות ומלאי; הזמנות וסטטוסי טיפול; משלוחים ותשלומים; מועדון לקוחות וצבירת נקודות; קופונים ומבצעים; שחזור עגלות נטושות ודיוור אוטומטי - ולצידם דוחות ולוח בקרה עם נתוני החנות בזמן אמת. לצד אלה יושבות האינטגרציות שחשובות דווקא בישראל: סליקה מקומית והפקת חשבונית אוטומטית מול חשבונית ירוקה (מורנינג), Greeninvoice, iCount או ריווחית, כך שכל הזמנה מייצרת מסמך חוקי בלי הזנה כפולה. היקף היכולות משתנה בין המסלולים ובטבלת החבילות מפורט מה כלול בכל אחד, כדי שלא תשלמו חודש-חודש על יכולות שהעסק שלכם לא משתמש בהן.',
      },
      {
        question: 'האם Aiterra מחליפה את החנות הקיימת שלי?',
        answer:
          'ברוב המקרים אנחנו בונים את החנות מחדש בקוד מלא על גבי המערכת, כך שהעיצוב, הקטלוג, ההזמנות והתוכן עוברים אליה. אם כבר יש לכם חנות פעילה, נבחן יחד באפיון מה נכון להעביר ומה לבנות מחדש, ונתכנן מעבר מסודר בלי להשבית את המכירות: העברת מוצרים ולקוחות, בדיקות סליקה מקצה לקצה בסביבת בדיקות, ומעבר בשעה שבה התנועה נמוכה. הנקודה הקריטית במעבר היא מפת הפניות 301 מכל כתובת ישנה לחדשה - רוב אובדן הדירוגים במעברי חנויות נובע מכתובות שהשתנו בשקט, וזה בדיוק מה שמפת ההפניות מונעת.',
      },
      {
        question: 'איך מתחילים לעבוד עם Aiterra?',
        answer:
          'מתחילים בשיחת אפיון שבה ממפים את המוצרים והווריאציות, כללי התמחור והמשלוחים, קהל היעד ותהליכי העבודה הקיימים - כולל מי מטפל בהזמנה אחרי שהיא נכנסת ואיך מופקת החשבונית היום. מאשרים אילו ספקי סליקה וחשבוניות מחוברים, כי החלטות אלה משפיעות על הבנייה ולא ניתן לדחות אותן לסוף. אחר כך בונים את החנות בשלבים שאפשר ללחוץ עליהם ולראות, מטמיעים את המערכת, מגדירים את סביבת העבודה ומריצים עסקאות בדיקה מקצה לקצה. אחרי העלייה לאוויר יש ליווי, כי הזמנות אמיתיות תמיד חושפות מקרי קצה שלא עולים בבדיקות.',
      },
      {
        question: 'האם אפשר להתאים את המערכת לצרכים של העסק שלי?',
        answer:
          'כן. הפיתוח נעשה בקוד ייעודי ולא בתבנית, כך שאפשר להתאים את החנות לאופן שבו העסק שלכם באמת עובד - כללי תמחור לפי סוג לקוח, מבנה קטלוג לא שגרתי, תהליך הזמנה מותאם או מסך ניהול שמדבר בשפה של הצוות שלכם. אפשר גם להוסיף יכולות בהמשך ככל שהחנות גדלה, בלי לבנות מחדש. התאמה מלאה של המערכת לתהליכי העסק, כולל פיצ׳רים ייעודיים ותהליכי עבודה משלכם, היא חלק ממסלול Enterprise. היתרון המעשי הוא שאתם לא מעצבים מחדש את העסק כדי שיתאים למגבלות של תוסף, וזה בדיוק המחיר הסמוי של חנויות תבנית.',
      },
      {
        question: 'האם ניתן לחבר את Aiterra למערכות חיצוניות?',
        answer:
          'כן, וזה בדרך כלל ההבדל בין חנות שמוכרת לחנות שמייצרת עבודה ידנית. חיבור לחברות משלוחים, לספקי סליקה ולדיוור אוטומטי נכלל ממסלול Pro ומעלה; חיבור למערכות פנימיות דרך API - ERP, מחסן, CRM כמו Fireberry או Powerlink - נכלל במסלול Enterprise. בכל המסלולים אנחנו מחברים הפקת חשבונית אוטומטית מול הספק הישראלי שאתם כבר עובדים איתו, כך שהזמנה מייצרת מסמך חוקי בלי הזנה כפולה. חשוב לדעת שספקים משנים ממשקי API מדי פעם והחיבורים נשברים בשקט - תחזוקת האינטגרציות כלולה בחבילות התחזוקה החודשיות שלנו.',
      },
    ],
  },
  development: {
    id: 'development',
    crumb: 'פיתוח תוכנה',
    eyebrow: 'פיתוח תוכנה',
    heading: ['בניית מערכת לעסק בהתאמה אישית', 'מערכת במקום אקסל'],
    subhead: 'חברת פיתוח תוכנה: מערכות ניהול, CRM, פורטלים ואפליקציות',
    lede: 'בניית מערכת לעסק היא פיתוח מערכת ניהול, CRM או פורטל סביב התהליכים שלכם, כך שאקסל, טפסים והודעות מפוזרות מוחלפים במקום אחד עם הרשאות, סטטוסים ודוחות. מאפיון מדויק, דרך חלוקה לאבני\u00a0דרך נוחות ועד לביצוע בקוד נקי ומאובטח.',
    image: '/images/service-dev-hero.webp',
    action: { label: 'לקביעת שיחת אפיון', href: '/contact' },
    metaTitle: 'בניית מערכת לעסק — מערכת בהתאמה אישית במקום אקסל',
    metaDescription:
      'בניית מערכת לעסק בישראל: מערכת ניהול, CRM או פורטל בהתאמה אישית שמחליפה אקסל וטפסים מפוזרים. אפיון כתוב, מחיר קבוע לכל אבן דרך וקוד בבעלותכם.',
    advantages: {
      eyebrow: 'פתרונות',
      heading: ['מה זה בניית מערכת לעסק בהתאמה אישית?'],
      lede: 'בניית מערכת לעסק בהתאמה אישית היא פיתוח מערכת סביב התהליכים של העסק שלכם, במקום התאמת העסק למגבלות של תוכנת מדף. בוחרים בה כשהתהליך המרכזי לא נכנס לאף תבנית, כשהעסק רץ על אקסל שמייצר טעויות וכפילויות, כשמשלמים על כמה מערכות שלא מדברות זו עם זו, או כשהצוות גדל ותשלום לפי משתמש נהיה יקר מפיתוח. זה מה שאנחנו מפתחים:',
      roles: [
        {
          id: 'crm',
          title: 'מערכות CRM ו-ERP מותאמות אישית',
          art: '/images/service-dev-icon4.webp',
          text: 'מרכזים לידים, לקוחות, מכירות ותהליכים פנימיים לפי מבנה הארגון שלכם. השדות, הסטטוסים וההרשאות נקבעים באפיון, והדוחות נחתכים לפי נציג, מקור ליד או שלב בעסקה.',
        },
        {
          id: 'automation',
          title: 'אוטומציות עסקיות',
          art: '/images/service-dev-icon2.webp',
          text: 'חיבור בין המערכות הקיימות דרך API, סנכרון נתונים אוטומטי וטריגרים שמריצים את המשימות החוזרות במקום עבודה ידנית כל בוקר, עם התראה כשתהליך נתקע.',
        },
        {
          id: 'bots',
          title: 'בוטים חכמים',
          art: '/images/service-dev-icon3.webp',
          text: 'בוט בוואטסאפ, בטלגרם או באתר שעונה על השאלות החוזרות, אוסף פרטים וקובע פגישות - וכשהשיחה חורגת מהתסריט היא עוברת לנציג.',
        },
        {
          id: 'apps',
          title: 'אפליקציות Mobile & Web',
          art: '/images/service-dev-icon1.webp',
          text: 'אפליקציה אחת שרצה על iOS, על אנדרואיד ובדפדפן, עם התחברות משתמשים, התראות Push וסנכרון מול השרת - כך שכולם עובדים על אותם נתונים.',
        },
      ] satisfies AboutRole[],
      outro: 'הצוות שלנו מוכן לאפיין, לפתח ולהטמיע את הפתרון המדויק עבורכם. מתחילים?',
      action: { label: 'בואו נדבר על הפרויקט שלכם', href: '/contact' },
    },
    system: {
      eyebrow: 'הטכנולוגיות שלנו',
      heading: ['נבחרת המומחים', 'שעומדת לרשותך'],
      art: '/images/service-dev.webp',
      features: [
        {
          id: 'frontend',
          icon: 'catalog',
          title: 'Frontend Developers',
          text: 'כל מה שהמשתמש נוגע בו נבנה כאן - טפסים, טבלאות, פילטרים ומצבי טעינה, שגיאה וריק. הרכיבים תומכי RTL ונטענים מהר, כך שהצוות שלכם עובד גם מהטלפון.',
        },
        {
          id: 'backend',
          icon: 'analytics',
          title: 'Backend Developers',
          text: 'מאחורי המסכים נבנים בסיס הנתונים, ה-API והלוגיקה העסקית - הרשאות, טריגרים ותהליכי רקע ששומרים על נתונים נכונים גם כשכמה משתמשים עובדים על אותה רשומה.',
        },
        {
          id: 'mobile',
          icon: 'orders',
          title: 'Mobile App Developers',
          text: 'האפליקציה לאנדרואיד ול-iOS נבנית מעל אותו API של המערכת - דיווח מהשטח, התראות פוש ועבודה גם בלי רשת. מטפלים גם בהגשה לחנויות ובעדכוני הגרסה שאחרי ההשקה.',
        },
        {
          id: 'design',
          icon: 'club',
          title: 'UI/UX Designers & גרפיקאים',
          text: 'עוד לפני שורת הקוד הראשונה אתם רואים איך המערכת תיראה ומאשרים - מיפוי מסכים, אבטיפוס, עיצוב בשפה של המותג והעברה לפיתוח עם רכיבים, מרווחים ומידות.',
        },
        {
          id: 'integration',
          icon: 'sales',
          title: 'מומחי אינטגרציה וחומרה',
          text: 'מחברים את המערכת שלכם להנהלת חשבונות, סליקה ומשלוחים, וגם לחומרה בשטח - סורקי ברקוד ומדפסות מדבקות. מגדירים מיפוי שדות, וובהוקים וטיפול בכשלי סנכרון, כך שנתון נרשם פעם אחת.',
        },
      ] satisfies ServiceSystemFeature[],
      action: { label: 'בואו נדבר על הפרויקט שלכם', href: '/contact' },
    },
    howItWorks: {
      eyebrow: 'שיטת העבודה',
      heading: ['המתודולוגיה שלנו'],
      lede: 'תהליך עבודה שקוף ומסודר — מאפיון מלא לחלוקה לפי שלבים, עד לפיתוח ובדיקות. בלי הפתעות.',
      steps: [
        {
          id: 'spec',
          title: 'אפיון טכנולוגי ומוצרי מקיף',
          text: 'הגדרה ברורה של כל מסכי המערכת, תרשימי הזרימה, ה-\u2060Database והארכיטקטורה לפני כתיבת שורת קוד אחת.',
          art: '/images/howitwork1.webp',
        },
        {
          id: 'planning',
          title: 'חישוב זמנים ותכנון תקציב מדויק',
          text: 'לוחות זמנים ריאליים ומוגדרים מראש ללא הפתעות.',
          art: '/images/howitwork2.webp',
        },
        {
          id: 'milestones',
          title: 'חלוקה לפרקים (Milestones\u00a0/\u00a0Sprints)',
          text: 'עבודה לפי שלבים מוגדרים שמאפשרים ללקוח לבדוק, לאשר ולהתקדם בקצב שנוח לו.',
          art: '/images/howitwork3.webp',
        },
      ] satisfies ServiceStep[],
    },
    banner: {
      heading: 'רוצים לראות איך המערכת שלכם תיראה?',
      action: { label: 'דברו איתנו ונתחיל לאפיין', href: '/contact' },
    },
    faqHeading: ['לפני שמתחילים', 'כמה דברים שכדאי לדעת.'],
    faqEntries: [
      {
        question: 'מהי בניית מערכת לעסק בהתאמה אישית?',
        answer:
          'בניית מערכת לעסק היא פיתוח מערכת ניהול, CRM, פורטל או אפליקציה בהתאמה מלאה לתהליכי העסק, במקום להתאים את העסק לתוכנת מדף. מודל הנתונים, המסכים, ההרשאות והאוטומציות נגזרים מאיך שאתם עובדים היום ולא מרשימת הפיצ׳רים של מוצר קיים. הפיתוח נעשה ב-React, Next.js, TypeScript ו-Node.js, והקוד נמסר לבעלותכם בסיום. ההצדקה הכלכלית מופיעה כשהפער בין מה שהתוכנה המוכנה עושה לבין מה שאתם צריכים מתחיל לעלות כסף, בעבודה ידנית, ברישיונות מיותרים או בתוספים שעוקפים מגבלה.',
      },
      {
        question: 'איך עוברים מאקסל למערכת בלי לשבש את העבודה?',
        answer:
          'מתחילים במיפוי הגיליונות: אילו עמודות באמת בשימוש, מי מזין אותן, אילו נוסחאות מחזיקות את התהליך ואילו טעויות חוזרות. אחר כך בונים מערכת עם אותם שדות ואותם דוחות, כדי שהצוות יכיר את מה שהוא רואה, ומוסיפים הרשאות, סטטוסים והתראות שאקסל לא נותן. הנתונים הקיימים מיובאים לסביבת בדיקות ונבדקים מול הגיליון המקורי, והעבודה עוברת למערכת בהדרגה, כשהאקסל נשאר זמין עד שמוודאים שהכול תואם. כך אין יום אחד שבו הכול נעצר.',
      },
      {
        question: 'אילו סוגי פרויקטים אפשר לפתח?',
        answer:
          'מערכות ניהול פנימיות, פורטלים ללקוחות ולספקים, אזורים אישיים, אפליקציות ווב, בוטים לווטסאפ ואוטומציות שרצות ברקע. בכל אחד מהם נבנים מסכי ניהול, הרשאות לפי תפקיד, יומן פעולות, דוחות ואינטגרציות דרך API למערכות שכבר עובדות אצלכם - הנהלת חשבונות, CRM, מחסן או סליקה. גם מודול נקודתי שנוסף לצד מערכת קיימת הוא פרויקט לכל דבר, ולעיתים קרובות זו ההתחלה הנכונה: פותרים את הצוואר הכי כואב, רואים שהוא עובד, ומרחיבים משם. אנחנו מעדיפים את המסלול הזה על פני פרויקט ענק שנמסר בבת אחת אחרי שנה, כי כך משנים כיוון מוקדם ובזול.',
      },
      {
        question: 'כמה עולה פיתוח תוכנה בהתאמה אישית?',
        answer:
          'המחיר נגזר ממספר המסכים והתפקידים, ממספר המערכות החיצוניות שמחברים ומעומק הלוגיקה העסקית, לא מגודל העסק. כלי פנימי שמטפל בתהליך אחד הוא הפרויקט הקטן ביותר, פורטל לקוחות או אזור אישי באמצע, ומערכת ניהול או CRM מלאה בהתאמה אישית הפרויקט הגדול. אחרי שיחת אפיון אתם מקבלים מסמך עם מחיר קבוע לכל אבן דרך, כך שאתם רואים תוצאה עובדת בכל שלב ומשלמים על מה שאושר. לצד ההקמה כדאי לתכנן מראש תחזוקה שנתית ושרת, ואת מבנה העלות לפי סוג מערכת פירטנו במדריך העלויות בבלוג.',
      },
      {
        question: 'כמה זמן לוקח לפתח מערכת?',
        answer:
          'תלוי בהיקף. מערכת ממוקדת סביב תהליך עסקי אחד עולה לאוויר בדרך כלל תוך מספר שבועות, ופלטפורמה עם כמה מודולים, הרשאות ואינטגרציות נמדדת בחודשים. את הטווח קובעים שלושה גורמים: כמות המסכים והמצבים, מספר המערכות החיצוניות שצריך לחבר - כל אינטגרציה היא פרויקט קטן בפני עצמה, עם טיפול בשגיאות ובמקרי קצה - והמהירות שבה מגיעים מכם נתונים, החלטות ואישורים. בתום האפיון תקבלו לוח זמנים לפי אבני דרך עם תאריך מסירה לכל שלב, ולא הערכה כוללת אחת. אנחנו מוסרים גרסאות עובדות במהלך הדרך, כך שאפשר לתקן כיוון באמצע ולא רק בסוף.',
      },
      {
        question: 'איך מתחילים פרויקט פיתוח מערכת?',
        answer:
          'מתחילים בשיחת אפיון שבה ממפים את תהליכי העבודה כפי שהם באמת מתנהלים היום, את המשתמשים ואת הנתונים - כולל את המקרים החריגים, שהם בדרך כלל מה שמפיל מערכות. משם עוברים לאפיון טכנולוגי ומוצרי שמגדיר מסכים, מודל נתונים, הרשאות ואינטגרציות, והפרויקט מחולק לאבני דרך עם תכולה ברורה ומחיר לכל אחת. הפיתוח והבדיקות רצים לפי אותן אבני דרך ואתם מקבלים גרסאות לבדיקה תוך כדי, לא רק בסוף. אחרי ההשקה יש ליווי שוטף. השלב שהכי משתלם לא לקצר הוא האפיון: שינוי במודל הנתונים אחרי שהמערכת בייצור הוא השינוי היקר ביותר שיש.',
      },
      {
        question: 'האם אפשר לשלב מערכות קיימות?',
        answer:
          'כן, וברוב הפרויקטים זה בדיוק מה שקורה. מתחברים דרך API להנהלת חשבונות ולחשבוניות - חשבונית ירוקה (מורנינג), Greeninvoice, iCount, ריווחית, חשבשבת ו-Priority - וכן ל-CRM כמו Fireberry או Powerlink, למערכות שילוח, לסליקה, לדיוור ול-WhatsApp Business API. כשאין ממשק פתוח עובדים מול ייצוא וייבוא קבצים מתוזמן. באפיון נסגור אילו שדות עוברים, לאיזה כיוון, באיזו תדירות ומה קורה בשגיאה - כי השאלה החשובה באינטגרציה אינה מה קורה כשהכל עובד, אלא מה קורה כשספק לא זמין או מחזיר תשובה לא צפויה. כך נמנעת הזנה כפולה ושתי גרסאות סותרות של אותו נתון.',
      },
      {
        question: 'מה קורה אחרי ההשקה?',
        answer:
          'אחרי ההשקה הצוות מקבל הדרכה ותיעוד, ואנחנו נכנסים לליווי שוטף: ניטור, גיבויים אוטומטיים, עדכוני אבטחה, תחזוקת האינטגרציות ומענה מהיר כשמשהו נתקע. בשבועות הראשונים כמעט תמיד עולים חידודים מהשימוש בפועל - שדה שחסר במסך, סטטוס נוסף, הרשאה שצריך לפצל או התראה שצריך לכוון - והם נכנסים במסגרת הליווי ולא כפרויקט חדש. מודול חדש או תהליך שלם עובר אפיון קצר ותמחור לפני שנכנס לפיתוח, כדי שיהיה ברור מה נכנס במסגרת הליווי ומה מעבר לו. הגבול הזה כתוב בהסכם, וזו בדיוק הנקודה שבה התקשרויות תחזוקה נוטות להיתקע.',
      },
    ],
  },
 seo: {
    id: 'seo',
    crumb: 'קידום אתרים',
    eyebrow: 'קידום אורגני',
    heading: ['קידום אתרים בגוגל', 'שמייצר פניות'],
    subhead: 'המומחיות שלנו בקידום אורגני',
    lede: 'מחקר מילות מפתח, אופטימיזציה טכנית, תוכן ובניית סמכות - קידום אורגני שנמדד בפניות ולא במיקומים בלבד, כולל התאמה לחיפוש בבינה מלאכותית.',
    image: '/images/service-marketing.webp',
    action: { label: 'לבדיקת פוטנציאל הקידום', href: '/contact' },
    metaTitle: 'קידום אתרים בגוגל (SEO) - קידום אורגני לעסקים',
    metaDescription:
      'שירות קידום אתרים אורגני: מחקר מילות מפתח, קידום טכני, תוכן, בניית קישורים ודוח חודשי שקוף. כולל התאמה לתשובות AI בגוגל וב-ChatGPT.',
    advantages: {
      eyebrow: 'היתרונות שלנו',
      heading: ['היתרונות הייחודיים שלנו'],
      lede: 'מה מיוחד בשירות הקידום האורגני שלנו?',
      roles: [
        {
          id: 'intent',
          title: 'מילות מפתח לפי כוונת רכישה',
          art: '/images/service-page-discovery.webp',
          text: 'לא רודפים אחרי ביטויים עם הרבה חיפושים אלא אחרי ביטויים שמביאים לקוחות. מפרידים בין מי שמחפש מידע לבין מי שמחפש ספק, ומשקיעים את התקציב בשני.',
        },
        {
          id: 'technical',
          title: 'קידום טכני שנפתר בקוד',
          art: '/images/service-page1.webp',
          text: 'היתרון הגדול שלנו: אותו צוות שמקדם גם מפתח. בעיה טכנית שחוסמת קידום - מהירות, סכמה, מבנה כתובות - נפתרת אצלנו ברמת הקוד ולא נתקעת חודשים אצל ספק אחר.',
        },
        {
          id: 'content',
          title: 'תוכן שעונה על שאלות אמיתיות',
          art: '/images/service-page3.webp',
          text: 'כותבים על סמך מה שהלקוחות שלכם באמת מקלידים ושואלים - מחירים, השוואות והתלבטויות - ולא על סמך ניחוש. זה גם מה שמנועי חיפוש מבוססי AI בוחרים לצטט.',
        },
        {
          id: 'reporting',
          title: 'דוח חודשי בלי ערפול',
          art: '/images/service-page4.webp',
          text: 'מדי חודש תדעו בדיוק מה נעשה, אילו ביטויים עלו, כמה תנועה אורגנית נכנסה וכמה פניות היא ייצרה. בלי גרפים יפים שלא אומרים כלום על העסק.',
        },
      ] satisfies AboutRole[],
    },
    system: {
      eyebrow: 'דיווח ומעקב',
      heading: ['לוח הבקרה והדוחות שלכם'],
      art: '/images/service-seo.webp',
      features: [
        {
          id: 'rankings',
          icon: 'analytics',
          title: 'מעקב מיקומים שוטף',
          text: 'מעקב אחרי הביטויים שהוגדרו בתחילת העבודה, כולל מגמה לאורך זמן והשוואה למתחרים הישירים שלכם בתחום.',
        },
        {
          id: 'leads',
          icon: 'orders',
          title: 'חיבור בין תנועה לפניות',
          text: 'מדידת המרות מחוברת ל-GA4 ולמערכת ה-CRM, כדי לדעת אילו עמודים ואילו ביטויים באמת מייצרים לידים ולא רק כניסות.',
        },
        {
          id: 'technical',
          icon: 'catalog',
          title: 'ניטור בריאות טכנית',
          text: 'בדיקה שוטפת של אינדוקס, שגיאות סריקה, מהירות טעינה ומדדי הליבה - עם תיקון ברמת הקוד כשצריך.',
        },
        {
          id: 'local',
          icon: 'club',
          title: 'קידום מקומי וכרטיס עסק',
          text: 'ניהול ואופטימיזציה של הפרופיל העסקי בגוגל, ביקורות וציטוטים מקומיים, לעסקים שהלקוחות שלהם מגיעים מהאזור.',
        },
        {
          id: 'ai',
          icon: 'sales',
          title: 'נראות בחיפוש AI',
          text: 'מעקב אחרי הופעות בסקירות ה-AI של גוגל וב-ChatGPT, והתאמת התוכן והנתונים המובנים כדי שיצטטו דווקא אתכם.',
        },
      ] satisfies ServiceSystemFeature[],
      action: { label: 'בואו נבדוק איפה אתם היום', href: '/contact' },
    },
    howItWorks: {
      eyebrow: 'איך זה עובד',
      heading: ['איך זה עובד? פשוט מאוד.'],
      lede: 'קידום אורגני הוא תהליך מצטבר. כך הוא נראה אצלנו מהבדיקה הראשונה ועד הצמיחה השוטפת.',
      steps: [
        {
          id: 'audit',
          title: 'בדיקה ומחקר',
          text: 'סורקים את האתר, מזהים חסמים טכניים, בונים מפת מילות מפתח לפי כוונת חיפוש ומנתחים מה עושים המתחרים שמופיעים מעליכם.',
          art: '/images/howitwork1.webp',
        },
        {
          id: 'fix',
          title: 'תיקון ואופטימיזציה',
          text: 'מתקנים את החסמים הטכניים בקוד, מסדרים מבנה עמודים וכותרות, מוסיפים נתונים מובנים וכותבים או משכתבים את התוכן של העמודים החשובים.',
          art: '/images/howitwork2.webp',
        },
        {
          id: 'grow',
          title: 'צמיחה ומדידה',
          text: 'מרחיבים תוכן, בונים סמכות וקישורים איכותיים, ומדווחים מדי חודש על מיקומים, תנועה ופניות - ומעדכנים את התוכנית לפי מה שעובד בפועל.',
          art: '/images/howitwork3.webp',
        },
      ] satisfies ServiceStep[],
    },
    banner: {
      heading: 'רוצים לדעת כמה תנועה אורגנית האתר שלכם מפספס?',
      action: { label: 'בקשו בדיקת קידום', href: '/contact' },
    },
    faqHeading: ['לפני שמתחילים', 'כמה דברים שכדאי לדעת.'],
    faqEntries: [
      {
        question: 'כמה זמן לוקח עד שרואים תוצאות בקידום אורגני?',
        answer:
          'סימנים ראשונים - שיפור באינדוקס, עלייה בהופעות ומיקומים בביטויים פחות תחרותיים - מופיעים בדרך כלל אחרי שניים עד ארבעה חודשים. תוצאות משמעותיות בביטויים תחרותיים לוקחות לרוב שישה חודשים ומעלה, ובתחומים רוויים במיוחד יותר מכך. אתר חדש לגמרי מתחיל לאט יותר מאתר ותיק עם היסטוריה בגוגל, וגם זה משתנה לפי מצבו הטכני: אתר שאינו נסרק כראוי לא ידרג ולו תוכן מצוין. אנחנו מודדים את ההתקדמות ב-Google Search Console וב-GA4 שבבעלותכם, ובחודשים הראשונים מדווחים על הופעות ואינדוקס - המדדים שזזים ראשונים - ולא רק על פניות.',
      },
      {
        question: 'כמה עולה קידום אתרים בחודש?',
        answer:
          'המחיר תלוי בשלושה דברים: רמת התחרות בתחום, המצב הטכני של האתר הקיים והיקף התוכן שצריך לייצר בפועל. אתר שדורש חודשיים של תיקונים טכניים לפני שאפשר בכלל להתחיל לקדם אותו יתומחר אחרת מאתר תקין. אחרי בדיקה ראשונית נציג טווח מחיר ברור עם פירוט מה נכלל בכל חודש - מחקר מילות מפתח, עבודה טכנית, כתיבת תוכן, קידום מקומי ובניית קישורים - וכמה שעות מוקצות לכל רכיב, כדי שתדעו על מה אתם משלמים. שימו לב להצעות שמנקבות מחיר לפני שראו את האתר: בלי בדיקה טכנית אי אפשר לדעת אם המחיר מכסה קידום או תיקון.',
      },
      {
        question: 'מה ההבדל בין קידום אורגני לקידום ממומן?',
        answer:
          'קמפיין ממומן מביא תנועה מהיום הראשון ונעצר ברגע שנגמר התקציב - הוא קונה חשיפה, לא בונה נכס. קידום אורגני לוקח חודשים אבל ממשיך לייצר פניות גם אחרי שמפסיקים להשקיע, ומגיע לאנשים בשלב המחקר ולא רק בשלב הקנייה. ההבדל המעשי בעלות: בממומן העלות לליד נשארת פחות או יותר קבועה לאורך זמן, בעוד שבאורגני היא יורדת ככל שהתוכן צובר סמכות. ברוב העסקים השילוב עובד הכי טוב - ממומן לטווח הקצר ולאיסוף נתוני שוק, אורגני כנכס שנבנה במקביל. מה שלא כדאי לעשות הוא לשפוט אף אחד מהערוצים בלי מעקב המרות מוגדר.',
      },
      {
        question: 'אתם מבטיחים מקום ראשון בגוגל?',
        answer:
          'לא, ואף אחד לא באמת יכול. גוגל אינה מוכרת מיקומים אורגניים, מעדכנת את האלגוריתם שלה עשרות פעמים בשנה, והתוצאות משתנות לפי מיקום המחפש, מכשירו והיסטוריית החיפוש שלו - כך שגם "מקום ראשון" אינו אותו דבר לשני אנשים. מה שכן אפשר להתחייב אליו: תוכנית עבודה כתובה, שקיפות מלאה על מה נעשה בכל חודש, גישה לחשבונות המדידה שלכם, ודיווח על פניות בפועל ולא רק על מיקומים. הבטחה למקום ראשון היא דגל אדום, ובדרך כלל היא מתייחסת לביטוי כה ספציפי שאיש אינו מחפש אותו - שם באמת קל להגיע למקום ראשון.',
      },
      {
        question: 'איך גורמים לאתר שלנו להופיע בתשובות של ChatGPT ובסקירות AI של גוגל?',
        answer:
          'זה תחום שנקרא GEO - אופטימיזציה למנועי חיפוש גנרטיביים. בפועל הוא דורש ארבעה דברים: תוכן שעונה תשובות ישירות, עצמאיות ועשירות בעובדות, כך שאפשר לצטט פסקה שלמה בלי הקשר נוסף; נתונים מובנים תקינים ב-JSON-LD, כולל מחירים כשהם מפורסמים, שאלות נפוצות ופרטי הארגון; סמכות ואזכורים של שם המותג במקורות חיצוניים, שכן מודלים מסתמכים על מה שכתוב עליכם ולא רק על מה שכתבתם; וגישה פתוחה לסורקי ה-AI בקובץ robots ובקובץ llms.txt. אנחנו מטפלים בזה כחלק מהשירות, כי חלק גדל מהחיפושים מסתיים בתשובה ולא בקליק לאתר.',
      },
      {
        question: 'אנחנו עסק מקומי. אתם עושים גם קידום מקומי?',
        answer:
          'כן. לעסק שנותן שירות באזור מסוים - קליניקה, עורך דין, בעל מקצוע - הפרופיל העסקי בגוגל והתוצאות המקומיות חשובים לא פחות מהאתר עצמו, ולעיתים יותר: חלק ניכר מהחיפושים המקומיים נגמר בשיחת טלפון ישירות מכרטיס העסק, בלי כניסה לאתר בכלל. אנחנו מטפלים בכרטיס העסק ובקטגוריות שלו, באיסוף ובמענה לביקורות, בעמודי שירות ייעודיים לפי אזור, ובאזכורים ובאיזכורי כתובת עקביים במדריכים מקומיים. עקביות הכתובת והטלפון בכל המקומות שבהם העסק מופיע היא אחד האותות הפשוטים ביותר לשיפור, וגם אחד המוזנחים ביותר.',
      },
      {
        question: 'האתר שלנו נבנה אצל ספק אחר. אפשר לקדם אותו?',
        answer:
          'כן, ואנחנו עושים את זה הרבה. מתחילים בבדיקה טכנית שמראה מה חוסם את הקידום במצב הקיים: סריקה מלאה של האתר, מהירות ומדדי ליבה, מבנה כתובות, כפילויות תוכן, מצב אינדוקס ב-Google Search Console והדירוגים הנוכחיים. חלק גדול מהתיקונים אפשר לבצע גם באתר שלא בנינו, כולל בוורדפרס ובפלטפורמות מוכנות. אם נגלה חסם מבני שלא ניתן לעקוף - מבנה כתובות שלא ניתן לשנות, פלטפורמה שלא מאפשרת שליטה בתגיות, או ביצועים שלא ישתפרו בלי בנייה מחדש - נגיד לכם את זה מראש ובכתב, במקום לגבות חודשים על עבודה שנתקלת בתקרה טכנית שהייתה ידועה מראש.',
      },
    ],
  },
  brochure: {
    id: 'brochure',
    crumb: 'אתרי תדמית',
    eyebrow: 'אתרי תדמית',
    heading: ['אתר תדמית שמייצר', 'רושם ראשוני ופניות'],
    subhead: 'המומחיות שלנו באתרי תדמית',
    lede: 'אפיון, עיצוב ופיתוח בקוד מלא - אתר מהיר, מותאם למובייל ובנוי לקידום אורגני, עם ליווי ועדכונים גם אחרי ההשקה.',
    image: '/images/service3.webp',
    action: { label: 'לשיחת ייעוץ ואפיון', href: '/contact' },
    metaTitle: 'בניית אתר תדמית לעסק - עיצוב ופיתוח בקוד',
    metaDescription:
      'בניית אתר תדמית בקוד מלא: אפיון וחוויית משתמש, עיצוב UI, כתיבת תוכן, התאמה למובייל, מהירות טעינה וניהול הפניות מהאתר במקום אחד.',
    advantages: {
      eyebrow: 'היתרונות שלנו',
      heading: ['היתרונות הייחודיים שלנו'],
      lede: 'מה מיוחד בשירות שלנו באתרי תדמית ונוכחות דיגיטלית?',
      roles: [
        {
          id: 'spec',
          title: 'אפיון סביב המסר',
          art: '/images/service-page-discovery.webp',
          text: 'לפני שמעצבים, מגדירים מה העסק רוצה להגיד ולמי. כל עמוד נבנה כדי להוביל את הגולש לפעולה הבאה ולא רק להיראות טוב.',
        },
        {
          id: 'code',
          title: 'עיצוב ופיתוח בקוד ייעודי',
          art: '/images/service-page1.webp',
          text: 'בלי תבניות כבדות: עיצוב מותאם למותג, טעינה מהירה, נגישות ותשתית ידידותית לקידום אורגני.',
        },
        {
          id: 'scale',
          title: 'אתר שקל לעדכן לבד',
          art: '/images/service-page3.webp',
          text: 'מערכת ניהול תוכן פשוטה שמאפשרת לעדכן טקסטים, תמונות ועמודים בלי לחזור אלינו על כל שינוי קטן.',
        },
        {
          id: 'support',
          title: 'שירות ותמיכה 24/7',
          art: '/images/service-page4.webp',
          text: 'ליווי שוטף אחרי ההשקה: עדכונים, מעקב אחרי ביצועים ומענה מהיר כשצריך לשנות משהו באתר.',
        },
      ] satisfies AboutRole[],
    },
    system: {
      eyebrow: 'מערכת ניהול',
      heading: ['מערכת ניהול התוכן של Aiterra'],
      art: '/images/service-brochure.webp',
      features: [
        {
          id: 'pages',
          icon: 'catalog',
          title: 'ניהול עמודים ותוכן',
          text: 'עריכת טקסטים, תמונות ובאנרים, הוספת עמודים חדשים ושינוי סדר הבלוקים - הכל מממשק אחד ובלי ידע טכני.',
        },
        {
          id: 'leads',
          icon: 'orders',
          title: 'ניהול הפניות מהאתר',
          text: 'כל טופס באתר נשמר במערכת עם התראה במייל או בוואטסאפ, כולל סטטוס טיפול, כדי שאף פנייה לא תלך לאיבוד.',
        },
        {
          id: 'audience',
          icon: 'club',
          title: 'מאגר לקוחות ודיוור',
          text: 'ריכוז הפונים והנרשמים לרשימת התפוצה, פילוח לפי מקור הפנייה ושליחת עדכונים ומבצעים מתוך המערכת.',
        },
        {
          id: 'landing',
          icon: 'sales',
          title: 'עמודי נחיתה לקמפיינים',
          text: 'הקמה מהירה של עמודי נחיתה ייעודיים לקמפיין, עם טפסים, מעקב המרות והצגת גרסאות שונות לבדיקה.',
        },
        {
          id: 'analytics',
          icon: 'analytics',
          title: 'אנליטיקה ו-SEO מתקדם',
          text: 'חיבור ל-Google Analytics ולפיקסלים, ניהול מטא-דאטה וכתובות ידידותיות, מפת אתר ומעקב אחרי מהירות הטעינה.',
        },
      ] satisfies ServiceSystemFeature[],
      action: { label: 'בואו נתאים את האתר שלכם', href: '/contact' },
    },
    howItWorks: {
      eyebrow: 'איך זה עובד',
      heading: ['איך זה עובד? פשוט מאוד.'],
      lede: 'אתר תדמית טוב מתחיל בהבנה של העסק ולא בבחירת תבנית. שלושה שלבים ברורים מהשיחה הראשונה ועד העלייה לאוויר.',
      steps: [
        {
          id: 'discovery',
          title: 'נבין את הצרכים שלך בשיחת איפיון',
          text: 'נכיר את העסק, קהל היעד והמתחרים, נגדיר את המסרים ואת מבנה העמודים ונחליט מה הפעולה שאנחנו רוצים שהגולש יעשה.',
          art: '/images/howitwork1.webp',
        },
        {
          id: 'design',
          title: 'נעצב ונפתח את האתר',
          text: 'נעצב את המסכים בהתאמה למותג, נכתוב תוכן שיווקי ונפתח בקוד מלא עם התאמה למובייל, נגישות ומהירות טעינה גבוהה.',
          art: '/images/howitwork2.webp',
        },
        {
          id: 'launch',
          title: 'נעלה לאוויר ונלווה אתכם',
          text: 'נחבר דומיין, אנליטיקס ומערכת ניהול התוכן, נדריך אתכם על העדכון העצמאי ונמשיך לעקוב אחרי הביצועים גם אחרי ההשקה.',
          art: '/images/howitwork3.webp',
        },
      ] satisfies ServiceStep[],
    },
    banner: {
      heading: 'רוצים לראות איך האתר שלכם ייראה?',
      action: { label: 'דברו איתנו ונתחיל לאפיין', href: '/contact' },
    },
    faqHeading: ['לפני שמתחילים', 'כמה דברים שכדאי לדעת.'],
    faqEntries: [
      {
        question: 'כמה זמן לוקח להקים אתר תדמית?',
        answer:
          'עמוד נחיתה ממוקד עולה לאוויר תוך שבועות בודדים, ואתר תדמית מלא לוקח בדרך כלל בין שבועיים לחודש וחצי מרגע אישור האפיון. מה שמאריך פרויקטים הוא כמעט תמיד תוכן, תמונות ואישורים מצד הלקוח ולא זמן הפיתוח - ולכן אנחנו נועלים את אלה כבר בשלב האפיון ולא רודפים אחריהם באמצע הבנייה. בתום האפיון תקבלו לוח זמנים מסודר עם שלבים ותאריכי מסירה, כולל מה נדרש מכם ומתי. פרויקט שכולל גם מיתוג מלא, צילומי מוצר או תרגום לשפה שנייה ייקח יותר, ואת זה נגדיר מראש ולא נגלה תוך כדי.',
      },
      {
        question: 'האם אתם כותבים את התוכן או שאנחנו צריכים לספק אותו?',
        answer:
          'אנחנו יכולים לכתוב את התוכן השיווקי על בסיס שיחת אפיון, החומרים שתעבירו ומחקר מילות מפתח - כך שהטקסטים לא רק מסבירים מה העסק עושה אלא גם מכילים את הביטויים שאנשים באמת מחפשים בגוגל בעברית. אפשר גם לעבוד עם תוכן שכבר יש לכם, ואז אנחנו מתאימים אותו למבנה העמודים ולכותרות. בשני המקרים נעבור עליו יחד לפני העלייה לאוויר, כי אתם מכירים את הלקוחות שלכם ואת ההתנגדויות שחוזרות בשיחות מכירה טוב מכל כותב חיצוני. תוכן הוא גם הסיבה הנפוצה ביותר לעיכוב בפרויקט, ולכן כדאי להחליט מי אחראי עליו כבר בהתחלה.',
      },
      {
        question: 'האם אפשר לעדכן את האתר לבד אחרי ההשקה?',
        answer:
          'כן. במסלול Business ומעלה האתר מגיע עם מערכת ניהול תוכן שמאפשרת לעדכן טקסטים, תמונות, מחירים ועמודים שלמים בלי ידע טכני ובלי לגעת בקוד. בסיום הפרויקט אנחנו מעבירים הדרכה לצוות שלכם ומשאירים תיעוד, כך שעדכון באנר או הוספת שירות לא מחייבים לפתוח קריאה לספק. מה שדורש מפתח הוא שינוי מבני - עמוד מסוג חדש, אינטגרציה נוספת או שינוי בלוגיקה - וזה נכון בכל מערכת, גם בוורדפרס. אם אתם מעדיפים שלא לגעת באתר בכלל, שינויי תוכן שוטפים כלולים בחבילות התחזוקה החודשיות שלנו לפי מכסת שעות.',
      },
      {
        question: 'האם האתר יהיה מותאם למובייל ולנגישות?',
        answer:
          'כן, ושניהם נבדקים לפני העלייה לאוויר ולא אחריה. כל אתר נבנה מותאם למובייל מהיסוד - רוב הגלישה בישראל היא מהטלפון, וגוגל מדרג לפי הגרסה הניידת. הנגישות נבנית לפי תקן ישראלי ת"י 5568 ולפי WCAG 2.1 AA: ניגודיות צבעים תקינה, ניווט מלא במקלדת, טקסט חלופי לתמונות והיררכיית כותרות שקורא מסך יכול לעבור. זו לא רק שאלה של נראות - עסקים בישראל מחויבים בכך על פי חוק, והאחריות היא של בעל האתר. בנוסף אנחנו מודדים את מדדי הליבה של גוגל (Core Web Vitals) לפני ההשקה, כי מהירות טעינה משפיעה ישירות גם על הדירוג וגם על אחוז הנטישה.',
      },
      {
        question: 'האם האתר מקודם בגוגל?',
        answer:
          'האתר נבנה עם תשתית SEO מלאה מהיום הראשון: HTML סמנטי, היררכיית כותרות תקינה, כותרות ותיאורי מטא לכל עמוד, כתובות ידידותיות, תגי canonical, נתונים מובנים ב-JSON-LD, מפת אתר XML, קובץ robots מוגדר ומהירות טעינה נמדדת. התשתית הזו לא מייצרת דירוגים בפני עצמה - תוכן וסמכות עושים את זה לאורך חודשים - אבל בלעדיה כל תוכנית קידום שתזמינו בהמשך מתחילה בתשלום על תיקון האתר במקום על שיפורו. קידום אורגני שוטף, בניית קישורים וקמפיינים ממומנים הם שירות נפרד, ואנחנו מתמחרים אותם בנפרד כדי שלא תשלמו על מה שלא צורכים.',
      },
      {
        question: 'יש לנו כבר אתר. אפשר לשדרג אותו במקום לבנות מחדש?',
        answer:
          'תלוי במצב הקיים, וזו שאלה טכנית ולא עניין של טעם. אם המבנה, הכתובות ומהירות הטעינה תקינים והבעיה היא תוכן, עיצוב או המרות - שדרוג זול יותר ושומר על ההיסטוריה שכבר צברתם בגוגל. אם האתר בנוי על תבנית עם תוספים כבדים, לא עובר את מדדי הליבה, או שמבנה הכתובות שלו חוסם כל תוכנית קידום סבירה - בנייה מחדש לרוב זולה יותר על פני שנתיים מאשר טלאים חוזרים. באפיון אנחנו סורקים את האתר הקיים, בודקים מהירות, מצב אינדוקס ב-Search Console ודירוגים נוכחיים. כל בנייה מחדש כוללת מפת הפניות 301 מסודרת, כך שהדירוגים עוברים ולא הולכים לאיבוד.',
      },
    ],
  },
  marketing: {
    id: 'marketing',
    crumb: 'שיווק דיגיטלי',
    eyebrow: 'שיווק דיגיטלי',
    heading: ['ניהול קמפיינים בגוגל ובפייסבוק', 'לפי נתונים, לא לפי ניחושים.'],
    subhead: 'שיווק דיגיטלי / Meta & Google',
    lede: 'ניהול קמפיינים ממומנים ב-Meta וב-Google בהתאמה מדויקת לנישה, לרווחיות ולשלב שבו העסק שלך נמצא.',
    image: '/images/marketing-hero.webp',
    action: { label: 'לשיחת אפיון שיווקי', href: '/contact' },
    metaTitle: 'ניהול קמפיינים בגוגל ובפייסבוק לעסקים',
    metaDescription:
      'ניהול קמפיינים ממומנים בגוגל ובפייסבוק: מחקר שוק, אסטרטגיה לפי שלב העסק, קריאייטיב, דפי נחיתה ואופטימיזציה שוטפת עם דוח על עלות לליד.',
    advantages: {
      eyebrow: 'אסטרטגיה',
      heading: ['מה כולל ניהול קמפיינים ממומנים?'],
      lede: 'ניהול קמפיינים ממומנים הוא תכנון, הקמה ואופטימיזציה שוטפת של מודעות בתשלום בגוגל ובמטא (פייסבוק ואינסטגרם), כך שכל שקל מדיה נמדד מול לידים ומכירות. אצלנו זה כולל מחקר קהלים ומילות מפתח, הקמת מבנה הקמפיינים, מעקב המרות מלא, אופטימיזציה שוטפת ודוח חודשי על עלות לליד.',
      roles: [
        {
          id: 'new',
          title: 'לקוחות חדשים / עסקים שטרם הצליחו בשיווק',
          art: '/images/service-marketing-icon4.webp',
          text: 'מחקר שוק מעמיק, בדיקת רווחיות, ניתוח מתחרים ואפיון הפלטפורמה המדויקת ביותר — בלי לבזבז תקציב על פלטפורמות לא רלוונטיות.',
        },
        {
          id: 'scale',
          title: 'לעסקים שכבר משווקים ורוצים לצמוח (Scale)',
          art: '/images/service-marketing-icon3.webp',
          text: 'ביצוע אופטימיזציה עמוקה, שיפור יחסי המרה, הוספת ערוצים חדשים ושדרוג הקריאייטיב הקיים להורדת עלות הליד/רכישה.',
        },
        {
          id: 'research',
          title: 'מחקר שוק מעמיק ואפיון פלטפורמות',
          art: '/images/service-marketing-icon2.webp',
          text: 'לפני שמעלים קמפיין בודקים איפה הקהל שלכם באמת נמצא, מה המתחרים עושים ואיזה ערוץ יחזיר את ההשקעה מהר יותר.',
        },
        {
          id: 'creative',
          title: 'אופטימיזציה ושדרוג קריאייטיב',
          art: '/images/service-marketing-icon1.webp',
          text: 'בדיקת גרסאות של מודעות, סרטונים ומסרים לאורך זמן, ושינוי תקציבים וקהלים לפי הנתונים כדי להוריד את העלות לליד.',
        },
      ] satisfies AboutRole[],
      outro:
        'אנחנו מתאימים אסטרטגיה שיווקית מדויקת לכל סוג עסק — בין אם אתם בתחילת הדרך או רוצים לצמוח.',
      action: { label: 'בואו נבדוק מה מתאים לעסק שלכם', href: '/contact' },
    },
    system: {
      eyebrow: 'תהליך העבודה',
      heading: ['תרשים הזרימה שלנו'],
      art: '/images/service-marketing.webp',
      features: [
        {
          id: 'research',
          icon: 'catalog',
          title: 'אפיון מעמיק ומחקר שוק',
          text: 'ממפים את קהל היעד, את המתחרים ואת המסרים, ובודקים באילו ערוצים כדאי להשקיע עוד לפני שמעלים קמפיין ראשון לאוויר.',
        },
        {
          id: 'angles',
          icon: 'club',
          title: 'בניית תסריטים וזוויות שיווק',
          text: 'מגדירים את המסרים, את זוויות ההסתכלות ואת התסריטים שידברו לכל פלח קהל, לפני שמעלים מודעה אחת לאוויר.',
        },
        {
          id: 'campaigns',
          icon: 'sales',
          title: 'הקמת קמפיינים והפקת קריאייטיב',
          text: 'בונים מבנה קמפיינים וקהלים בגוגל ובמטא, מפיקים מודעות וסרטונים ומחברים מעקב המרות מהיום הראשון.',
        },
        {
          id: 'launch',
          icon: 'orders',
          title: 'עלייה לאוויר ואופטימיזציה',
          text: 'עולים לאוויר בהדרגה, בודקים גרסאות ומעדכנים תקציבים, קהלים ומסרים לפי הנתונים ולא לפי תחושות בטן.',
        },
        {
          id: 'reports',
          icon: 'analytics',
          title: 'דוחות מעקב ושיפור מתמיד',
          text: 'דוח תקופתי עם מספר הלידים, העלות לליד והמסקנות להמשך, כדי שתמיד תדעו לאן הולך התקציב ומה הוא מחזיר.',
        },
      ] satisfies ServiceSystemFeature[],
      action: { label: 'בואו נבדוק מה מתאים לעסק שלכם', href: '/contact' },
    },
    howItWorks: {
      eyebrow: 'יתרונות מרכזיים',
      heading: ['למה לבחור ב-Aiterra?'],
      lede: 'ניהול קמפיינים ממוקד, שקוף ומבוסס נתונים — עם צוות שמלווה אתכם לכל אורך הדרך.',
      steps: [
        {
          id: 'manager',
          title: 'מנהל קמפיינים צמוד',
          text: 'תקשורת ישירה ומעקב שוטף ללא מתווכים.',
          art: '/images/howitwork1.webp',
        },
        {
          id: 'variants',
          title: '10+ מודעות וקריאייטיבים שונים',
          text: 'בודקים כל זווית שיווקית ומסר אפשרי עד שמגיעים לנוסחה המנצחת.',
          art: '/images/howitwork2.webp',
        },
        {
          id: 'production',
          title: 'הפקת קריאייטיב מלאה',
          text: 'בניית תסריטים, ימי צילום ועריכה באותה רמת גימור גבוהה — לעסקים קטנים וגדולים כאחד.',
          art: '/images/howitwork3.webp',
        },
      ] satisfies ServiceStep[],
    },
    banner: {
      heading: 'מוכנים להעלות את הקמפיינים שלכם לרמה הבאה?',
      action: { label: 'שליחה ובדיקת התאמה', href: '/contact' },
    },
    cases: {
      eyebrow: 'תיקי לקוחות',
      heading: ['קבלו הצצה מתוצאות', 'אמיתיות בשטח'],
      items: [
        {
          id: 'meta-1',
          title: 'נאות שדה',
          subtitle: 'שיווק ממומן ב-Meta',
          metrics: [
            { label: 'ROAS', value: 'תוצאה עסקית' },
            { label: 'Leads', value: '+202%' },
            { label: 'Sales', value: '+142%' },
          ],
          tags: ['שיווק ממומן ב-Meta', 'Sales +142%', 'Leads +202%'],
          shot: '/images/service-marketing-portfolio1.webp',
          href: '/projects',
        },
        {
          id: 'meta-2',
          title: 'נאות שדה',
          subtitle: 'שיווק ממומן ב-Meta',
          metrics: [
            { label: 'ROAS', value: 'תוצאה עסקית' },
            { label: 'Leads', value: '+202%' },
            { label: 'Sales', value: '+142%' },
          ],
          tags: ['שיווק ממומן ב-Meta', 'Sales +142%', 'Leads +202%'],
          shot: '/images/service-marketing-portfolio2.webp',
          href: '/projects',
        },
        {
          id: 'meta-3',
          title: 'נאות שדה',
          subtitle: 'שיווק ממומן ב-Meta',
          metrics: [
            { label: 'ROAS', value: 'תוצאה עסקית' },
            { label: 'Leads', value: '+202%' },
            { label: 'Sales', value: '+142%' },
          ],
          tags: ['שיווק ממומן ב-Meta', 'Sales +142%', 'Leads +202%'],
          shot: '/images/service-marketing-portfolio3.webp',
          href: '/projects',
        },
      ] satisfies ServiceCase[],
      cardAction: 'לצפייה בפרויקט',
      prev: 'הקודם',
      next: 'הבא',
    },
    faqHeading: ['לפני שמתחילים', 'כמה דברים שכדאי לדעת.'],
    faqEntries: [
      {
        question: 'מה כולל דמי הניהול ומה נפרד מהם?',
        answer:
          'דמי הניהול כוללים את בניית האסטרטגיה, מחקר הקהלים ומילות המפתח, הקמת הקמפיינים והמבנה שלהם, האופטימיזציה השוטפת, הגדרת מעקב ההמרות והדיווח החודשי. תקציב המדיה עצמו משולם ישירות לגוגל ולמטא בכרטיס האשראי של העסק והוא נפרד לחלוטין מדמי הניהול - כך שאתם רואים בדיוק כמה הלך למדיה וכמה לניהול, ואף אחד לא לוקח אחוזים מהתקציב בלי שתדעו. נפרדים גם: הפקת קריאייטיב מעבר למה שכלול במסלול, בניית דפי נחיתה חדשים וקידום אורגני. הפירוט הזה נכתב בהצעה מראש, כי חלק ניכר מהוויכוחים מול סוכנויות פרסום נובע בדיוק מהגבול הזה.',
      },
      {
        question: 'תוך כמה זמן רואים תוצאות?',
        answer:
          'לידים ראשונים מגיעים בדרך כלל בשבועות הראשונים - זה היתרון המרכזי של פרסום ממומן על פני קידום אורגני, שלוקח שלושה עד שישה חודשים להראות תנועה אמיתית. אבל תמונה יציבה של עלות לליד מתקבלת רק אחרי חודש עד שלושה, כשהקמפיינים צברו מספיק המרות כדי שהאלגוריתם יוכל לבצע אופטימיזציה על נתונים ולא על ניחוש. בחודש הראשון אנחנו בודקים השערות: אילו קהלים, אילו מסרים ואילו מילות מפתח מייצרים פניות. סוכנות שמבטיחה עלות לליד יציבה כבר בשבוע הראשון מבטיחה משהו שהמערכות עצמן לא מסוגלות לספק בשלב הזה.',
      },
      {
        question: 'האם אתם עובדים גם עם עסקים קטנים?',
        answer:
          'כן, וזה רוב הלקוחות שלנו - עסקים קטנים ובינוניים בישראל. במסלול Basic מתמקדים בערוץ אחד עם תקציב מדיד, וכשהוא מוכיח את עצמו מרחיבים לערוצים נוספים. אין טעם לפזר תקציב קטן על גוגל, פייסבוק, אינסטגרם וטיקטוק במקביל: כל ערוץ צריך מספיק המרות כדי לצאת משלב הלמידה, ותקציב מפוצל לארבעה חלקים לרוב לא מגיע לסף הזה באף אחד מהם. אם התקציב החודשי קטן מכדי להצדיק ניהול ממומן, נגיד את זה בשיחה הראשונה ונציע להתחיל בקידום אורגני מקומי או בפרופיל עסקי בגוגל, במקום לגבות דמי ניהול על תקציב שלא יזוז.',
      },
      {
        question: 'מי הבעלים של חשבונות הפרסום?',
        answer:
          'החשבונות נפתחים על שם העסק שלכם ונשארים שלכם: Google Ads, מנהל המודעות של מטא, GA4 ו-Google Search Console - כולל היסטוריית הנתונים, הקהלים וההמרות שנצברו בהם. אנחנו מקבלים הרשאת ניהול בלבד, לא בעלות. זה נשמע טכני אבל זו אחת הנקודות הכואבות בשוק: כשקמפיינים רצים מתוך חשבון של הסוכנות, מעבר לספק אחר מוחק את כל היסטוריית הלמידה של האלגוריתם ומאלץ להתחיל מאפס. אצלנו סיום ההתקשרות הוא הסרת ההרשאה שלנו בלבד, ולא העברה של נכס. כדאי לשאול את השאלה הזו כל סוכנות שאתם שוקלים, לפני החתימה ולא אחריה.',
      },
      {
        question: 'האם אתם מפיקים את הקריאייטיב או שצריך לספק חומרים?',
        answer:
          'במסלול Pro ומעלה אנחנו מפיקים את הקריאייטיב, כולל צילום, עריכת וידאו קצר וכתיבת המסרים, ובודקים כמה גרסאות מול אותו קהל כדי לראות מה באמת עוצר את הגלילה. אפשר כמובן לעבוד גם עם חומרים קיימים שלכם, ואם יש לכם צילומי מוצר או סרטונים טובים זה חוסך זמן וכסף. מה שחשוב להבין: בפיד של מטא הקריאייטיב הוא המשתנה שמשפיע הכי הרבה על העלות לליד, יותר מהגדרות הקהל. לכן אנחנו מחליפים גרסאות באופן שוטף ולא מריצים את אותה מודעה חודשים, גם כשהיא עבדה טוב בהתחלה.',
      },
      {
        question: 'איך מודדים הצלחה?',
        answer:
          'לפי לידים איכותיים ועלות לליד, ולא לפי חשיפות, קליקים או לייקים. אנחנו מחברים מעקב המרות מלא - GA4, פיקסל של מטא ו-Google Ads - מהקליק ועד הטופס או השיחה, וכשיש CRM גם עד העסקה שנסגרה. כך אפשר לראות איזה ערוץ, איזה קמפיין ואיזו מודעה באמת מייצרים לקוחות משלמים, ולא רק פניות. הדוח החודשי מציג מה עלה, מה ירד ומה משתנה בחודש הבא. כשמספר יורד, הוא מופיע בדוח כפי שהוא: תנודתיות היא חלק מהעבודה, ודוח שיווקי שאין בו אף ירידה הוא דוח שנערך ולא נמדד.',
      },
    ],
  },
  branding: {
    id: 'branding',
    crumb: 'מיתוג ועיצוב',
    eyebrow: 'מיתוג ועיצוב אתרים',
    heading: ['עיצוב שמדבר', 'בשפה של העסק שלך'],
    subhead: 'Branding & Web Design / UX/UI',
    lede: 'מיתוג עסקי, עיצוב אתרים וחוויית משתמש — מקונספט ראשוני ועד ממשק מוכן לפיתוח. עיצוב שלא רק נראה טוב, אלא גם עובד.',
    image: '/images/service-branding-hero.webp',
    action: { label: 'לשיחת ייעוץ עיצובי', href: '/contact' },
    metaTitle: 'מיתוג עסקי ועיצוב חוויית משתמש UX/UI',
    metaDescription:
      'מיתוג עסקי ושפה ויזואלית, עיצוב אתרים וחוויית משתמש, עיצוב אפליקציות מובייל ודפי נחיתה - מקונספט ראשוני ועד ממשק מוכן לפיתוח.',
    advantages: {
      eyebrow: 'שירותים',
      heading: ['מה אנחנו מעצבים?'],
      lede: 'שירותי עיצוב ומיתוג מקצה לקצה — מזהות ויזואלית ועד ממשקי משתמש מורכבים',
      roles: [
        {
          id: 'brand',
          title: 'מיתוג עסקי ושפה ויזואלית',
          art: '/images/service-branding-icon4.webp',
          text: 'לוגו, פלטת צבעים, טיפוגרפיה, מדריך מותג ושפה עיצובית אחידה שמבדילה את העסק שלך מהמתחרים.',
        },
        {
          id: 'web',
          title: 'עיצוב אתרים (UX/UI)',
          art: '/images/service-branding-icon3.webp',
          text: 'אפיון חוויית משתמש, מפת מסכים ועיצוב ממשק מוכן לפיתוח - כך שכל מסך מוביל את הגולש לפעולה הבאה.',
        },
        {
          id: 'mobile',
          title: 'עיצוב אפליקציות מובייל',
          art: '/images/service-branding-icon2.webp',
          text: 'עיצוב מסכי אפליקציה לאנדרואיד ול-iOS, כולל מצבי מערכת, אנימציות ורכיבים לשימוש חוזר בקוד.',
        },
        {
          id: 'landing',
          title: 'דפי נחיתה ועמודי שיווק',
          art: '/images/service-branding-icon1.webp',
          text: 'עמודים ממוקדי המרה לקמפיינים: מסר ברור, היררכיה ויזואלית נכונה וקריאה לפעולה שאי אפשר לפספס.',
        },
      ] satisfies AboutRole[],
      outro: 'הצוות שלנו מוכן ליצור את החוויה הדיגיטלית המושלמת עבורכם. מתחילים?',
      action: { label: 'בואו נדבר על העיצוב שלכם', href: '/contact' },
    },
    system: {
      eyebrow: 'תהליך העבודה',
      heading: ['תרשים הזרימה שלנו'],
      art: '/images/service-branding.webp',
      features: [
        {
          id: 'discovery',
          icon: 'catalog',
          title: 'אפיון מותג וחקר מתחרים',
          text: 'מבינים מי אתם, למי אתם פונים ואיך נראית הזירה שבה אתם מתחרים, לפני שמתחילים לעצב.',
        },
        {
          id: 'concept',
          icon: 'club',
          title: 'קונספט ושפה ויזואלית',
          text: 'בונים כיוון עיצובי, פלטת צבעים וטיפוגרפיה, ומציגים אותם על מסכים אמיתיים ולא רק על לוח השראה.',
        },
        {
          id: 'screens',
          icon: 'sales',
          title: 'עיצוב מסכים ומצבי מערכת',
          text: 'מעצבים את כל המסכים כולל מצבי טעינה, שגיאה וריק, בגרסאות דסקטופ ומובייל.',
        },
        {
          id: 'handoff',
          icon: 'orders',
          title: 'העברה מסודרת לפיתוח',
          text: 'מוסרים קבצים מסודרים עם רכיבים, מרווחים ומידות, כך שהמפתחים בונים בדיוק את מה שעוצב.',
        },
        {
          id: 'iterate',
          icon: 'analytics',
          title: 'ליווי אחרי ההשקה',
          text: 'עוקבים אחרי ההתנהגות באתר ומעדכנים מסכים ומסרים לפי מה שקורה בפועל אצל המשתמשים.',
        },
      ] satisfies ServiceSystemFeature[],
      action: { label: 'בואו נדבר על העיצוב שלכם', href: '/contact' },
    },
    howItWorks: {
      eyebrow: 'תהליך העיצוב שלנו',
      heading: ['תהליך העיצוב שלנו'],
      lede: 'תהליך עבודה מסודר ושקוף — ממחקר והבנת הלקוח, דרך קונספט ואבטיפוס, ועד עיצוב סופי מוכן לפיתוח.',
      steps: [
        {
          id: 'research',
          title: 'מחקר, אפיון וארכיטקטורת מידע',
          text: 'הכרת העסק, קהל היעד, המתחרים והמסרות, מיפוי מסכים, תרשימי זרימה והגדרת מבנה התוכן.',
          art: '/images/howitwork1.webp',
        },
        {
          id: 'concept',
          title: 'קונספט עיצובי ו-Wireframes',
          text: 'יצירת שפה ויזואלית, בחירת צבעים וטיפוגרפיה, ובניית שלדים ראשוניים לאישור.',
          art: '/images/howitwork2.webp',
        },
        {
          id: 'handoff',
          title: 'עיצוב סופי ומסירה לפיתוח',
          text: 'עיצוב כל המסכים בפיקסל פרפקט, מדריך סגנון, אינטראקציות ואנימציות — הכל מוכן להעברה חלקה לצוות הפיתוח.',
          art: '/images/howitwork3.webp',
        },
      ] satisfies ServiceStep[],
    },
    banner: {
      heading: 'מוכנים לראות איך המותג שלכם יכול להיראות?',
      action: { label: 'שליחה ובדיקת התאמה', href: '/contact' },
    },
    faqHeading: ['לפני שמתחילים', 'כמה דברים שכדאי לדעת.'],
    faqEntries: [
      {
        question: 'מהו עיצוב UI/UX?',
        answer:
          'UX (חוויית משתמש) מתמקד באיך המוצר עובד ומרגיש: המבנה, מסלול הגולש, סדר השלבים והנקודות שבהן אנשים מתבלבלים או נוטשים. UI (ממשק משתמש) מתמקד באיך הוא נראה: צבעים, טיפוגרפיה, מרווחים, מצבי כפתורים ורכיבים חוזרים. ההבדל המעשי הוא שאפשר לעצב ממשק יפה שאיש לא מצליח להשלים בו רכישה, ואפשר לבנות מסלול נכון שנראה מיושן ולא משדר אמינות - שניהם מפילים המרות. לכן אנחנו עובדים על שניהם יחד: קודם מפת מסכים ומסלול משתמש, ורק אחר כך שפה ויזואלית. התוצאה נמדדת באחוז ההשלמה של הפעולה שבשבילה האתר נבנה, ולא ברושם הראשוני.',
      },
      {
        question: 'למי שירות העיצוב מתאים?',
        answer:
          'לעסקים שמקימים נכס דיגיטלי חדש ורוצים להתחיל ממבנה נכון ולא מתבנית; לעסקים עם אתר קיים שמקבל תנועה אבל לא מייצר פניות - מצב שכמעט תמיד הוא בעיית מסלול ומסרים ולא בעיית עיצוב; ולסטארטאפים שצריכים ממשק מוכן למסירה לצוות פיתוח, כולל מצבי טעינה, שגיאה ומסכים ריקים. זה מתאים גם כשיש מוצר טוב שפשוט לא נראה אמין מספיק כדי שמישהו ישאיר בו פרטים או פרטי אשראי. פחות מתאים כשהבעיה האמיתית היא היעדר תנועה לאתר - במקרה כזה עיצוב מחדש לא יפתור כלום, וכדאי להתחיל בקידום או בקמפיין.',
      },
      {
        question: 'מה כולל תהליך המיתוג?',
        answer:
          'התהליך מתחיל בהכרת העסק, קהל היעד וההתנגדויות שחוזרות בשיחות מכירה, ובחקר מתחרים שמראה מה כולם בקטגוריה עושים אותו דבר - שם בדרך כלל נמצאת ההזדמנות להיראות אחרת. אחר כך נבנית השפה הוויזואלית: לוגו על כל גרסאותיו, פלטת צבעים עם ניגודיות שעומדת בדרישות נגישות, טיפוגרפיה, מערכת מרווחים וטון דיבור. בסוף מקבלים מדריך מותג שמסביר איך להשתמש בכל נכס - באתר, ברשתות, בקמפיינים ובחומרים מודפסים - ואת קובצי המקור עצמם. המדריך הוא מה שמונע מהמותג להתפרק אחרי חצי שנה, כשכל ספק חדש מפרש את הצבעים בדרכו.',
      },
      {
        question: 'כמה זמן לוקח לעצב אתר?',
        answer:
          'עיצוב אתר תדמית ממוצע לוקח בין שבועיים לארבעה שבועות מרגע קבלת התכנים, והמשתנה המרכזי הוא מספר המסכים הייחודיים ולא מספר העמודים: עשרים עמודים שרצים על שלוש תבניות הם עבודה קטנה בהרבה מחמישה עמודים שכל אחד מהם נראה אחרת. פרויקט שכולל גם מיתוג מלא, מערכת מורכבת עם הרשאות משתמשים או ממשק אפליקציה ייקח יותר. את לוח הזמנים המדויק נגדיר יחד בשלב האפיון, אחרי שנדע כמה מסכים ומצבים צריך. גם כאן, מה שמאריך פרויקטים בפועל הוא בדרך כלל המתנה לתכנים ולצילומים ולא זמן העיצוב עצמו.',
      },
      {
        question: 'האם אתם גם מפתחים את האתר?',
        answer:
          'כן, ואפשר גם לא. אפשר לעצור בעיצוב ולקבל קבצים מוכנים למסירה לכל צוות פיתוח, כולל ספריית רכיבים, מידות, מרווחים ומצבים - ואז אתם חופשיים לבחור מפתח כרצונכם. ואפשר להמשיך איתנו לפיתוח בקוד מלא ב-React ו-Next.js, וזו בדרך כלל האפשרות שבה פחות הולך לאיבוד: כשאותו צוות מעצב ומפתח, אין שלב שבו מישהו מפרש מחדש את הכוונה של מסך, ואין ויכוח על מה בדיוק היה אמור לקרות בגרסה הניידת. מניסיוננו, רוב הפער בין העיצוב המאושר לאתר החי נוצר בדיוק בנקודת המסירה הזו.',
      },
      {
        question: 'מה אני מקבל בסוף התהליך?',
        answer:
          'קובצי מקור מלאים, כל המסכים בגרסת דסקטופ ובגרסת מובייל, ולצידם המצבים שרוב תיקי העיצוב מדלגים עליהם: מצב טעינה, מצב שגיאה, מסך ריק לפני שיש נתונים, ומצבי כפתור ושדה. בנוסף ספריית רכיבים עם מרווחים ומידות מדויקים, ומדריך סגנון שמסביר איך להרכיב מסך חדש בלי לשבור את השפה. הכל נמסר אליכם ונשאר שלכם - גם אם תמשיכו לעבוד מול ספק אחר, וגם אם תפסיקו לעבוד איתנו מחר. אין רכיב שנשאר בבעלותנו ואין רישיון שמפסיק לפעול, כי אתם שילמתם על העבודה הזו.',
      },
      {
        question: 'האם אפשר לעדכן את העיצוב בהמשך?',
        answer:
          'כן, וזו בדיוק הסיבה שאנחנו בונים את העיצוב כספריית רכיבים ולא כאוסף מסכים נפרדים. הוספת עמוד, שינוי מסך או השקת קמפיין עם דף נחיתה חדש נעשים מתוך אותם רכיבים קיימים, בלי להתחיל מחדש ובלי שהאתר יתחיל להיראות כמו שני אתרים שונים. אפשר גם להמשיך בליווי שוטף: אנחנו בודקים איך גולשים מתנהגים בפועל - היכן הם עוצרים, מה הם מדלגים עליו ואיפה הם נוטשים טופס - ומעדכנים מסכים ומסרים לפי הנתונים. עיצוב הוא לא מוצר שמסתיים בהשקה, במיוחד באתר שאמור לייצר פניות לאורך זמן.',
      },
    ],
  },
  maintenance: {
    id: 'maintenance',
    crumb: 'אחזקת אתר',
    eyebrow: 'אחזקת אתר',
    heading: ['אחזקת אתר ותחזוקת אתרים', 'עם מחירון וזמני תגובה בכתב'],
    subhead: 'שירות התחזוקה שלנו',
    lede: 'שירות אחזקת אתר בחבילות חודשיות עם מחירון גלוי: זמני תגובה ותיקון מוגדרים בהסכם, עדכוני אבטחה, גיבויים וניטור — גם לאתרים שלא נבנו אצלנו.',
    image: '/images/service2.webp',
    action: { label: 'בקשת הצעה לחוזה תחזוקה', href: '/contact' },
    metaTitle: 'אחזקת אתר ותחזוקת אתרים — חבילות חודשיות ומחירון גלוי',
    metaDescription:
      'שירות אחזקת אתר אינטרנט בחבילות חודשיות: מחירון גלוי, זמני תגובה ותיקון בהסכם (SLA), עדכוני אבטחה, גיבויים וניטור. גם לאתרים שלא נבנו אצלנו.',
    advantages: {
      eyebrow: 'למה אנחנו',
      heading: ['מה מייחד את התחזוקה שלנו'],
      lede: 'רוב ספקי התחזוקה לא מפרסמים מה בדיוק כלול ותוך כמה זמן מטפלים. אנחנו כן.',
      outro: 'הצוות שלנו מוכן לקחת אחריות על האתר שלכם. אתם?',
      action: { label: 'בקשת הצעה לחוזה תחזוקה', href: '/contact' },
      roles: [
        {
          id: 'sla',
          title: 'זמני תגובה בכתב, לא הבטחות',
          art: '/images/service-page-discovery.webp',
          text: 'כל חבילה מגדירה זמן תגובה וזמן תיקון בהסכם. אתם יודעים מראש מה קורה כשהאתר נופל ביום שישי, ולא מגלים את זה בדיוק אז.',
        },
        {
          id: 'security',
          title: 'אבטחה שוטפת, לא אחרי הפריצה',
          art: '/images/service-page1.webp',
          text: 'עדכוני ליבה ותוספים, ניטור זמינות וגיבויים יומיים שנשמרים מחוץ לשרת. רוב הפריצות מנצלות חורים ידועים שעדכון שוטף סוגר.',
        },
        {
          id: 'accessibility',
          title: 'נגישות כפריט תחזוקה שוטף',
          art: '/images/service-page3.webp',
          text: 'תקן ת"י 5568 הוא לא בדיקה חד-פעמית. כל שינוי תוכן יכול לשבור נגישות, ולכן היא נבדקת בכל מחזור תחזוקה ולא רק באודיט השנתי.',
        },
        {
          id: 'orphan',
          title: 'גם אתרים שלא בנינו',
          art: '/images/service-page4.webp',
          text: 'מקבלים אתר יתום שהמפתח שלו נעלם? אנחנו מבצעים מיפוי, משיגים גישות, מתעדים את המצב הקיים ולוקחים אחריות מהנקודה הזו.',
        },
      ],
    },
    system: {
      eyebrow: 'מה כלול',
      heading: ['מה נכלל בתחזוקת אתר — ומה לא'],
      art: '/images/service-maintenance.webp',
      features: [
        {
          id: 'updates',
          icon: 'orders',
          title: 'עדכוני מערכת ותוספים',
          text: 'עדכון ליבה, תוספים ותלויות קוד, כולל בדיקה שהעדכון לא שבר שום דבר באתר החי.',
        },
        {
          id: 'backup',
          icon: 'catalog',
          title: 'גיבויים וניטור זמינות',
          text: 'גיבוי יומי אוטומטי שנשמר מחוץ לשרת, וניטור שמתריע כשהאתר נופל — לפני שהלקוח מתקשר.',
        },
        {
          id: 'content',
          icon: 'club',
          title: 'שינויי תוכן שוטפים',
          text: 'עדכוני טקסט, תמונות, מחירים ובאנרים לפי מכסת השעות בחבילה, בלי לפתוח פרויקט חדש בכל פעם.',
        },
        {
          id: 'integrations',
          icon: 'sales',
          title: 'אינטגרציות ישראליות',
          text: 'חשבונית ירוקה (מורנינג), iCount, ריווחית וסליקה — הספקים משנים API, והחיבורים נשברים בשקט. אנחנו מתקנים.',
        },
        {
          id: 'report',
          icon: 'analytics',
          title: 'דוח חודשי',
          text: 'מה נעשה החודש, מה נמצא בניטור ומה מומלץ לתקן — בעברית, לא בלוג טכני.',
        },
      ],
      action: { label: 'בקשת הצעה לחוזה תחזוקה', href: '/contact' },
    },
    howItWorks: {
      eyebrow: 'איך זה עובד',
      heading: ['איך מתחילים. בפשטות.'],
      lede: 'תחזוקה מתחילה במיפוי, לא בחתימה. קודם יודעים מה יש, ורק אז מתחייבים.',
      steps: [
        {
          id: 'audit',
          title: 'מיפוי ובדיקת מצב',
          text: 'בודקים על מה האתר בנוי, אילו תוספים וגרסאות רצים, מה מצב הגיבויים והאבטחה ומה שבור כבר עכשיו.',
          art: '/images/howitwork1.webp',
        },
        {
          id: 'handover',
          title: 'העברת גישות ותיעוד',
          text: 'משיגים גישה לאחסון, לדומיין ולמערכות, מתעדים את המצב הקיים ומסדירים בעלות — במיוחד כשהמפתח הקודם נעלם.',
          art: '/images/howitwork2.webp',
        },
        {
          id: 'ongoing',
          title: 'תחזוקה שוטפת ודוח',
          text: 'נכנסים למחזור קבוע של עדכונים, גיבויים וניטור, עם דוח חודשי ואיש קשר בעל שם שמכיר את האתר שלכם.',
          art: '/images/howitwork3.webp',
        },
      ],
    },
    pricing: {
      eyebrow: 'מחירון',
      heading: ['מחירון תחזוקת אתרים — חבילות חודשיות'],
      lede: 'מחירים חודשיים גלויים, בהתחייבות שנתית. כל חבילה כוללת זמן תגובה וזמן תיקון מוגדרים.',
      plans: [
        {
          id: 'basic',
          name: 'בסיס',
          audience: 'לאתרי תדמית ודפי נחיתה',
          price: '290',
          priceNote: '₪ לחודש',
          term: 'בהתחייבות ל-12 חודשים',
          action: { label: 'קבלת הצעה', href: '/contact' },
          featuresTitle: 'מה כלול?',
          features: [
            { icon: 'automation', label: 'עדכוני ליבה, תוספים ותלויות' },
            { icon: 'inventory', label: 'גיבוי יומי מחוץ לשרת' },
            { icon: 'alerts', label: 'ניטור זמינות והתראות' },
            { icon: 'support', label: 'זמן תגובה עד 24 שעות עסקים' },
          ],
        },
        {
          id: 'pro',
          name: 'עסקי',
          audience: 'לאתרים שמייצרים לידים באופן שוטף',
          price: '590',
          priceNote: '₪ לחודש',
          term: 'בהתחייבות ל-12 חודשים',
          badge: 'הכי נבחר',
          featured: true,
          action: { label: 'קבלת הצעה', href: '/contact' },
          featuresTitle: 'כל מה שבבסיס, ובנוסף',
          features: [
            { icon: 'products', label: 'עד שעתיים שינויי תוכן בחודש' },
            { icon: 'api', label: 'תחזוקת אינטגרציות (חשבונית ירוקה, CRM)' },
            { icon: 'dashboard', label: 'בדיקת נגישות ת"י 5568 רבעונית' },
            { icon: 'report', label: 'דוח חודשי מסודר' },
            { icon: 'support', label: 'זמן תגובה עד 4 שעות עסקים' },
          ],
        },
        {
          id: 'ecommerce',
          name: 'חנויות ומערכות',
          audience: 'לחנויות אונליין ומערכות ניהול',
          price: 'בהתאמה אישית',
          term: 'לפי היקף המערכת',
          action: { label: 'דברו איתנו', href: '/contact' },
          featuresTitle: 'כל מה שבעסקי, ובנוסף',
          features: [
            { icon: 'storefront', label: 'תחזוקת קטלוג, סליקה ומשלוחים' },
            { icon: 'tailor', label: 'פיתוח שוטף ופיצ׳רים חדשים' },
            { icon: 'manager', label: 'איש קשר בעל שם שמכיר את המערכת' },
            { icon: 'alerts', label: 'ניטור עסקאות והתראות כשל' },
            { icon: 'training', label: 'הדרכת צוות ותיעוד' },
          ],
        },
      ],
      footnote: {
        text: 'לא בטוחים איזו חבילה מתאימה?',
        link: { label: 'דברו איתנו ונבדוק את האתר', href: '/contact' },
      },
    },
    banner: {
      heading: 'רוצים לדעת באיזה מצב האתר שלכם נמצא?',
      action: { label: 'בקשת בדיקת מצב לאתר', href: '/contact' },
    },
    faqHeading: ['שאלות נפוצות', 'על תחזוקת אתרים'],
    faqEntries: [
      {
        question: 'כמה עולה אחזקת אתר בחודש?',
        answer:
          'נוח יותר להשוות בחישוב שנתי. לפי המדריך שלנו על עלות תחזוקת אתר, אתר תדמית קטן עולה כ-300 עד 900 ₪ בשנה כשמדובר בעיקר בדומיין ובאחסון, אתר עסקי עם תחזוקה מנוהלת כ-2,000 עד 6,000 ₪ בשנה, וחנות אונליין לרוב 6,000 ₪ ומעלה. אצלנו חבילת הבסיס היא 290 ₪ לחודש והחבילה העסקית 590 ₪ לחודש, שתיהן בהתחייבות שנתית; חנויות ומערכות מתומחרות לפי היקף. הסכומים האלה קונים מחזור מוגדר של עדכונים, גיבוי יומי מחוץ לשרת, ניטור זמינות וזמן תגובה כתוב בהסכם - ולא הבטחה כללית לזמינות. כדאי לזכור שתחזוקה היא רק חלק מעלות ההחזקה השנתית: לצידה יש אחסון, דומיין, תעודת SSL ולעיתים רישיונות. פירוט מלא של כל אלה לאורך שנה נמצא במדריך שלנו על עלות תחזוקת אתר.',
      },
      {
        question: 'מה כולל שירות אחזקת אתר ומה לא?',
        answer:
          'כלול: עדכוני ליבה, תוספים ותלויות קוד; גיבוי יומי שנשמר מחוץ לשרת; ניטור זמינות והתראות; תיקון תקלות; ושינויי תוכן שוטפים לפי מכסת השעות בחבילה. בחבילה העסקית ומעלה כלולות גם תחזוקת האינטגרציות הישראליות ובדיקת נגישות רבעונית. לא כלול: פיתוח פיצ׳רים חדשים, עיצוב מחדש של עמודים, כתיבת תוכן שיווקי, קידום אורגני וניהול קמפיינים. את אלה אנחנו מתמחרים בנפרד ובמכוון, כי חבילה שכוללת הכל גובה מכם מדי חודש על עבודה שאתם צורכים פעם בשנה. הגבול הזה כתוב בהסכם ולא נתון לפרשנות, וזה מה שמאפשר להשוות אותנו לספק אחר באותם מונחים.',
      },
      {
        question: 'אתם מתחזקים אתרים שלא בניתם?',
        answer:
          'כן, וזה חלק גדול מהעבודה שלנו. מתחילים במיפוי: על מה האתר בנוי, אילו גרסאות ותוספים רצים, מה מצב הגיבויים והאבטחה ומה כבר שבור עכשיו. אחר כך משיגים גישות לאחסון, לדומיין, ל-DNS ולמערכות המחוברות, מתעדים את המצב הקיים ומסדירים בעלות באופן פורמלי - במיוחד במקרה השכיח שבו המפתח הקודם נעלם, אין גישה לקוד, והדומיין רשום על שם מישהו שכבר לא עונה למיילים. אחרי שזה מוסדר האתר נכנס למחזור התחזוקה הרגיל. אם אתר במצב שבו תחזוקה שלו אינה כלכלית ובנייה מחדש תעלה פחות, נגיד לכם את זה בכנות ולא ניקח את העבודה.',
      },
      {
        question: 'מה ההבדל בין תחזוקת אתרים לתמיכת אתרים?',
        answer:
          'תחזוקה היא יזומה ומתוזמנת: עדכונים, גיבויים וניטור שקורים לפי מחזור קבוע בין אם משהו קרה ובין אם לא. תמיכה היא תגובתית - אתם פונים כשמשהו נשבר, והתשלום לרוב לפי שעה או לפי קריאה. עסק שקונה רק תמיכה משלם פחות בחודש רגיל ויותר בחודש שבו משהו קורה, ובעיקר איש לא מנע את התקלה מלכתחילה. בחבילות שלנו השוטף כלול במחיר החודשי, ולצידו יש מכסת שעות לשינויים; עבודה שחורגת ממנה מתומחרת בנפרד ומראש, ולא מופיעה בהפתעה בחשבון. זו גם הסיבה שאנחנו מפרסמים מה כלול ומה לא - כדי שתוכלו להשוות אותנו לספק אחר באותם מונחים.',
      },
      {
        question: 'מה זמני התגובה בפועל?',
        answer:
          'בחבילת הבסיס: עד 24 שעות עסקים. בחבילה העסקית: עד 4 שעות עסקים. תקלה שמפילה את האתר לגמרי מטופלת בעדיפות עליונה בכל החבילות, ללא קשר לרמת החבילה. זמני התגובה וזמני התיקון כתובים בהסכם ולא נשארים כהבטחה בעל פה, כך שיש לכם על מה להצביע כשזה חשוב. זו נקודה שכדאי לבדוק בכל הצעת תחזוקה שאתם מקבלים: חוזים רבים מפרטים מחיר חודשי ורשימת משימות, אבל אינם אומרים כלל תוך כמה זמן מישהו מחויב לענות כשהאתר מפסיק לעבוד. בלי זמן תגובה כתוב, המחיר החודשי אינו אומר הרבה.',
      },
      {
        question: 'האם תחזוקה כוללת נגישות לפי ת"י 5568?',
        answer:
          'בחבילה העסקית ומעלה - כן, בדיקה רבעונית לפי ת"י 5568. זה חשוב כי נגישות אינה מצב קבוע שמגיעים אליו פעם אחת ונשארים בו: הוספת תמונה בלי טקסט חלופי, שינוי צבע בכפתור שמוריד את הניגודיות מתחת לנדרש, או הטמעת ווידג׳ט חיצוני שלוכד את מיקוד המקלדת - כל אחד מהם יכול לשבור התאמה שכבר הושגה. אודיט חד-פעמי מתאר את האתר ביום שבו בוצע ותו לא. עסקים בישראל מחויבים בתקן על פי חוק והחשיפה היא של בעל האתר ולא של מי שבנה אותו, ולכן נכון יותר לטפל בנגישות כפריט תחזוקה חוזר ולא כמשימה של יום ההשקה.',
      },
      {
        question: 'מה קורה לאינטגרציות כשספק משנה API?',
        answer:
          'זו אחת התקלות השקטות והיקרות ביותר שיכולות לקרות לאתר: החיבור לחשבונית ירוקה, ל-iCount או לספק הסליקה מפסיק לעבוד, ההזמנות ממשיכות להיכנס כרגיל, ולא נוצרת עבורן חשבונית. שום דבר באתר לא נראה שבור, ולכן זה מתגלה לרוב שבועות אחר כך על ידי רואה החשבון ולא באותו יום על ידי לקוח. בחבילה העסקית תחזוקת האינטגרציות כלולה, כולל תיקון כשספק משנה ממשק, וכן ניטור שמתריע על העברה שנכשלה במקום להמתין שמישהו ישים לב לפער ברצף החשבוניות. ככל שהתגלית מאוחרת יותר, כך התיקון החשבונאי למפרע יקר יותר.',
      },
      {
        question: 'אפשר לעצור את החוזה?',
        answer:
          'החבילות הן בהתחייבות שנתית, כי תחזוקה נמדדת לאורך זמן ולא בחודש בודד - הערך של מחזור עדכונים ושל משטר גיבויים מתגלה רק כשמשהו בסוף משתבש. בסיום התקופה אפשר פשוט לא לחדש, ואתם מקבלים את כל הגישות, את כל הגיבויים ואת התיעוד המלא. האתר הוא שלכם בין אם נמשיך לעבוד יחד ובין אם לא, ואין שום רכיב בהתקשרות שנועד להקשות על עזיבה או להשאיר אתכם תלויים בנו לצורך גישה לתשתית שלכם. אנחנו מעדיפים שתישארו כי השירות טוב, ולא כי היציאה יקרה.',
      },
    ],
  },
  automation: {
    id: 'automation',
    crumb: 'אוטומציה לעסקים',
    eyebrow: 'אוטומציה לעסקים',
    heading: ['אוטומציה לעסקים', 'שמחברת את המערכות ומורידה עבודה ידנית'],
    subhead: 'שירותי אוטומציה עסקית עם בינה מלאכותית',
    lede: 'אוטומציה לעסקים מחברת את האתר, הוואטסאפ, ה-CRM ומערכת החשבוניות שלכם לתהליך אחד: ליד נכנס, נענה, נרשם ומתוזמן בלי שמישהו מעתיק פרטים ידנית, ובינה מלאכותית (AI) נכנסת רק איפה שכלל קבוע לא מספיק.',
    image: '/images/service-platform.webp',
    action: { label: 'לקביעת שיחת מיפוי תהליכים', href: '/contact' },
    metaTitle: 'אוטומציה לעסקים: חיבור CRM, וואטסאפ, חשבוניות ו-AI',
    metaDescription:
      'אוטומציה לעסקים בישראל: לידים ישר ל-CRM, בוט וואטסאפ, חיבור לחשבונית ירוקה ו-iCount, סנכרון הזמנות ודוחות אוטומטיים, עם AI רק איפה שהוא עוזר.',
    advantages: {
      eyebrow: 'למה אנחנו',
      heading: ['מה כוללים שירותי אוטומציה לעסקים?'],
      lede: 'שירותי אוטומציה לעסקים הם מיפוי של התהליכים החוזרים בעסק, חיבור המערכות שמשתתפות בהם דרך API, הגדרת הכללים ושלבי ה-AI, והרצה עם ניטור ותחזוקה. אצלנו זה כולל גם את מה שרוב הספקים משאירים לכם: יומן ריצות, התראות על כשל ותיקון החיבורים כשמערכת משנה API.',
      outro: 'רוצים לדעת אילו תהליכים אצלכם שווה לאטמט קודם?',
      action: { label: 'לקביעת שיחת מיפוי תהליכים', href: '/contact' },
      roles: [
        {
          id: 'process',
          title: 'מתחילים מהתהליך, לא מהכלי',
          art: '/images/service-page1.webp',
          text: 'לפני שבוחרים Make, n8n או קוד, ממפים איך הליד, ההזמנה והחשבונית באמת עוברים היום בין האנשים והמערכות, כולל המקרים החריגים. אוטומציה שנבנתה סביב כלי ולא סביב התהליך נשברת בחריג הראשון ומחזירה את העבודה הידנית.',
        },
        {
          id: 'israeli',
          title: 'מחוברים למערכות הישראליות',
          art: '/images/service-page2.webp',
          text: 'חשבונית ירוקה (מורנינג), iCount, ריווחית, חשבשבת ו-Priority בצד החשבונאי; Fireberry, Powerlink, Monday ו-HubSpot בצד ה-CRM; WhatsApp Business API, סליקה ושילוח. כולל מספר הקצאה, מע"מ ושדות בעברית, הדברים שאינטגרציה בינלאומית לא מכירה.',
        },
        {
          id: 'ai',
          title: 'AI איפה שהוא באמת עוזר',
          art: '/images/service-page3.webp',
          text: 'כשהכלל ברור, טופס נשלח ולכן נפתח ליד, אוטומציה רגילה זולה ואמינה יותר. AI נכנס כשצריך להבין טקסט חופשי: לסווג פנייה, לסכם שיחה, לנסח תשובה ראשונה או לשלוף נתון ממסמך. כל פלט של AI עובר כלל בדיקה לפני שהוא נוגע במערכת.',
        },
        {
          id: 'monitoring',
          title: 'רואים כשמשהו נתקע',
          art: '/images/service-page4.webp',
          text: 'כל ריצה נרשמת ביומן, כשל מייצר התראה ולא נעלם בשקט, ונתון שלא סונכרן נשלח שוב במקום ללכת לאיבוד. אחרי ההשקה אנחנו ממשיכים לנטר ולתחזק את החיבורים, כי API של מערכת חשבוניות משתנה בלי לשאול אתכם.',
        },
      ],
    },
    system: {
      eyebrow: 'מה מאטמטים',
      heading: ['התהליכים שעסקים', 'מאטמטים איתנו'],
      art: '/images/service-cms.webp',
      features: [
        {
          id: 'leads',
          icon: 'orders',
          title: 'לידים מהאתר ומוואטסאפ ישר ל-CRM',
          text: 'טופס באתר, הודעת וואטסאפ או ליד מקמפיין נפתחים כרשומה ב-CRM עם המקור, הקמפיין והשאלות הראשונות, ומקבלים תשובה ראשונה תוך דקה, לא למחרת בבוקר.',
        },
        {
          id: 'whatsapp',
          icon: 'club',
          title: 'בוט וואטסאפ ומענה ראשוני',
          text: 'שאלות על מחיר, זמינות ושעות נענות אוטומטית, הפנייה מסוננת לפי השאלות שהגדרתם, ושיחה שחורגת מהתסריט עוברת לנציג עם כל ההיסטוריה.',
        },
        {
          id: 'billing',
          icon: 'sales',
          title: 'הצעות מחיר, חשבוניות וגבייה',
          text: 'עסקה שנסגרה ב-CRM מפיקה הצעת מחיר, חשבונית בחשבונית ירוקה או ב-iCount ותזכורת תשלום, באותם פרטים, בלי הקלדה כפולה ובלי חשבונית ששכחו להוציא.',
        },
        {
          id: 'orders',
          icon: 'catalog',
          title: 'הזמנות, מלאי ומשלוחים',
          text: 'הזמנה מהחנות מעדכנת מלאי, יוצרת משלוח אצל חברת השילוח ושולחת ללקוח מספר מעקב. כשמוצר נגמר, האתר יודע לפני שהלקוח מזמין אותו.',
        },
        {
          id: 'reports',
          icon: 'analytics',
          title: 'דוחות והתראות אוטומטיים',
          text: 'דוח בוקר עם הלידים, המכירות והגבייה של אתמול, והתראה בוואטסאפ כשליד לא נענה שעתיים או כשתהליך נכשל, במקום לגלות את זה בסוף החודש.',
        },
      ],
      action: { label: 'לקביעת שיחת מיפוי תהליכים', href: '/contact' },
    },
    howItWorks: {
      eyebrow: 'איך זה עובד',
      heading: ['מהמיפוי להרצה. בשלבים.'],
      lede: 'שלושה שלבים, ובכל אחד מהם אתם רואים תוצאה לפני שממשיכים.',
      steps: [
        {
          id: 'map',
          title: 'מיפוי תהליכים',
          text: 'יושבים עם מי שעושה את העבודה היום ומציירים את התהליך כפי שהוא באמת: איפה הנתון נכנס, מי מעתיק אותו, איפה הוא הולך לאיבוד. מסמנים מה מאטמטים קודם לפי שעות שנחסכות.',
          art: '/images/howitwork1.webp',
        },
        {
          id: 'build',
          title: 'בנייה וחיבור',
          text: 'מחברים את המערכות דרך ה-API שלהן, ממפים שדות, מגדירים כללים ומה קורה בכשל. כל אוטומציה נבדקת על נתונים אמיתיים לפני שהיא נוגעת ב-CRM או מוציאה חשבונית.',
          art: '/images/howitwork2.webp',
        },
        {
          id: 'run',
          title: 'הרצה, ניטור ושיפור',
          text: 'מעלים לאוויר בהדרגה, עוקבים ביומן הריצות ומתקנים את מה שהמציאות מגלה. אחרי ההתייצבות עוברים לתחזוקה שוטפת של החיבורים ולאוטומציה הבאה ברשימה.',
          art: '/images/howitwork3.webp',
        },
      ],
    },
    banner: {
      heading: 'רוצים לראות כמה שעות בחודש האוטומציה תחסוך אצלכם?',
      action: { label: 'לקביעת שיחת מיפוי תהליכים', href: '/contact' },
    },
    faqHeading: ['שאלות נפוצות', 'על אוטומציה לעסקים'],
    faqEntries: [
      {
        question: 'מה זה אוטומציה לעסקים ואילו תהליכים אפשר להפוך לאוטומטיים?',
        answer:
          'אוטומציה לעסקים היא חיבור בין המערכות שכבר עובדות אצלכם, כך שפעולה שקורית במערכת אחת מפעילה את הצעד הבא בעצמה: ליד שנכנס מהאתר נפתח ב-CRM ומקבל מענה ראשון, עסקה שנסגרה מפיקה חשבונית, הזמנה בחנות יוצרת משלוח. התהליכים שמשתלם לאטמט קודם הם אלה שחוזרים כל יום ומערבים העתקה ידנית: קליטת לידים, מענה ראשוני בוואטסאפ, הצעות מחיר וחשבוניות, תזכורות תשלום, סנכרון מלאי ודוחות. במיפוי אנחנו מודדים כמה שעות בחודש כל תהליך גוזל, ומתחילים מהתהליך עם החיסכון הגדול ביותר.',
      },
      {
        question: 'מה כוללים שירותי אוטומציה לעסקים קטנים ומה קובע את העלות?',
        answer:
          'שירותי אוטומציה לעסקים קטנים כוללים מיפוי של התהליכים החוזרים, חיבור המערכות, הגדרת כללי בדיקה ותחזוקה אחרי ההשקה. עלות ההקמה נקבעת לפי מספר המערכות שמחברים ומספר התרחישים, לא לפי גודל העסק: בוט וואטסאפ עם חיבור ל-CRM הוא פרויקט קטן בהרבה מאוטומציה שמחברת גם הנהלת חשבונות, מלאי ושילוח. את מבנה העלות פירטנו במדריך העלויות בבלוג, ואת ההצעה לעסק שלכם נותנים אחרי מיפוי התהליכים. לצד ההקמה יש עלות חודשית של הכלים עצמם, כמו CRM וספק הודעות וואטסאפ, שתלויה בנפח השימוש.',
      },
      {
        question: 'מה ההבדל בין אוטומציה רגילה לאוטומציה עם AI?',
        answer:
          'אוטומציה רגילה פועלת לפי כלל קבוע: אם טופס נשלח, פתח ליד; אם עסקה נסגרה, הפק חשבונית. היא זולה, מהירה וצפויה, ולכן היא הבסיס לרוב התהליכים. AI נכנס כשהקלט הוא טקסט חופשי שכלל לא יכול לפרש: לסווג פנייה בוואטסאפ, לסכם שיחה לרשומת CRM, לשלוף סכום ותאריך מחשבונית סרוקה או לנסח תשובה ראשונה בעברית. אצלנו כל פלט של AI עובר כלל בדיקה לפני שהוא משנה נתון במערכת, וכשהביטחון נמוך הפנייה עוברת לאדם. כך מקבלים את הגמישות בלי לתת למודל להמציא.',
      },
      {
        question: 'אילו פתרונות אוטומציה לעסקים אתם מחברים למערכות הישראליות?',
        answer:
          'פתרונות אוטומציה לעסקים מתחברים למערכות שכבר עובדות אצלכם, ובעיקר לאלה שאינטגרציה בינלאומית לא מכירה: חשבונית ירוקה (מורנינג), iCount, ריווחית, חשבשבת ו-Priority בצד החשבונאי, כולל מספר הקצאה ומע"מ; Fireberry, Powerlink, Monday, HubSpot ו-Zoho בצד ה-CRM; WhatsApp Business API, סליקה ישראלית, חברות שילוח, Shopify ו-WooCommerce, Google Sheets ויומנים. כשלמערכת אין API פתוח עובדים דרך ייצוא וייבוא קבצים מתוזמן. בכל חיבור מוגדר מיפוי שדות וטיפול בכשל, כדי שנתון יירשם פעם אחת ובמקום הנכון. במיפוי הראשוני בודקים אילו מהמערכות שלכם חשופות ל-API ואילו דורשות פתרון עוקף.',
      },
      {
        question: 'באילו כלים אתם עובדים: Make, n8n, Zapier או קוד?',
        answer:
          'בכלי שיחזיק לאורך זמן עבור התהליך הספציפי. ל-Make ול-n8n יש יתרון כשהתרחיש פשוט ואתם רוצים לראות ולערוך אותו בעצמכם; n8n גם רץ על שרת משלכם, מה שחשוב כשהנתונים רגישים. Zapier נוח למערכות אמריקאיות, אבל המערכות הישראליות חסרות בו. כשהתהליך מורכב, כשהנפח גבוה או כשצריך לוגיקה עסקית אמיתית, אנחנו כותבים את החיבור בקוד מעל ה-API של המערכות, עם בדיקות ויומן. לא פעם הפתרון משלב את שניהם, והבחירה מוסברת לכם במסמך האפיון.',
      },
      {
        question: 'כמה זמן לוקח להקים אוטומציה?',
        answer:
          'אוטומציה אחת ממוקדת, כמו זרימת לידים מהאתר ל-CRM עם מענה ראשון בוואטסאפ, עולה לאוויר בדרך כלל תוך שבוע עד שלושה שבועות ממיפוי ועד הרצה. מעטפת שמחברת כמה מערכות, CRM, חשבוניות, מלאי ושילוח, נמדדת בחודש עד חודשיים, כי כל חיבור הוא פרויקט קטן עם בדיקות משלו. אנחנו משיקים בהדרגה: קודם תהליך אחד שרץ במקביל לעבודה הידנית, משווים תוצאות, ורק אז מכבים את העבודה הידנית ועוברים לתהליך הבא.',
      },
      {
        question: 'מה קורה כשאוטומציה נופלת?',
        answer:
          'היא לא נופלת בשקט. כל ריצה נרשמת ביומן עם הקלט, הפלט והתוצאה; כשל שולח התראה בוואטסאפ או במייל למי שהגדרתם, והנתון שלא עבר נכנס לתור ונשלח שוב במקום להיעלם. API של מערכת חשבוניות או CRM משתנה מדי פעם בלי הודעה, ולכן אחרי ההשקה אנחנו נשארים בתחזוקה שוטפת: ניטור, עדכון החיבורים ומענה כשמשהו נתקע. אתם מקבלים גישה ליומן הריצות, כך שגם בלי לפנות אלינו רואים מה רץ, מה נכשל ולמה.',
      },
      {
        question: 'האם זה מתאים לעסק קטן בלי איש IT?',
        answer:
          'כן, ורוב הלקוחות שלנו באוטומציה הם עסקים של שניים עד עשרים עובדים בלי מחלקת IT. אתם לא צריכים לדעת מה זה API: במיפוי אנחנו מדברים על לידים, חשבוניות ושעות עבודה, ואת החלק הטכני לוקחים עלינו. אחרי ההשקה הצוות מקבל הדרכה קצרה ומסמך שמסביר מה רץ ומתי, ואת מה שאפשר לערוך בעצמכם, כמו תסריט בוט או תבנית הודעה, אנחנו משאירים פתוח לעריכה. התחזוקה השוטפת מכסה את השאר.',
      },
    ],
  },
  'ai-agents': {
    id: 'ai-agents',
    crumb: 'סוכני AI',
    eyebrow: 'סוכני AI',
    heading: ['פיתוח סוכני AI לעסקים', 'שעונים ללקוח ופועלים במערכות'],
    subhead: 'שירות סוכני ה-AI שלנו',
    lede: 'סוכן AI (בינה מלאכותית) שעונה בעברית מתוך התוכן שלכם בלבד, מבצע פעולות במערכות הקיימות — פתיחת ליד, קביעת פגישה, בדיקת סטטוס — ויודע מתי להעביר את השיחה לאדם.',
    image: '/images/service-agents-hero.webp',
    action: { label: 'בקשת אפיון לסוכן AI', href: '/contact' },
    metaTitle: 'סוכני AI לעסקים — פיתוח סוכן בינה מלאכותית לעסק, בעברית ומחובר למערכות',
    metaDescription:
      'פיתוח סוכני AI (בינה מלאכותית) לעסקים בישראל: מענה בעברית מסביב לשעון, סינון לידים, קביעת פגישות וחיבור ל-CRM ולוואטסאפ, עם גבולות כתובים והעברה לנציג.',
    advantages: {
      eyebrow: 'למה אנחנו',
      heading: ['מה מייחד את סוכני ה-AI שלנו'],
      lede: 'אתם מקבלים סוכן שאפשר להשאיר מול לקוחות: אפיון כתוב, פיילוט על תנועה אמיתית, ודוח שמראה מה הוא ענה, מה ביצע ומה העביר לאדם.',
      outro: 'רוצים לבדוק אילו פניות אצלכם סוכן באמת יכול לקחת?',
      action: { label: 'בקשת אפיון לסוכן AI', href: '/contact' },
      roles: [
        {
          id: 'hebrew',
          title: 'עברית כדרישה, לא כתוספת',
          art: '/images/service-page1.webp',
          text: 'לפני העלייה לאוויר הסוכן עובר על מאות פניות אמיתיות מהעסק שלכם, לא על שאלות לדוגמה. מה שנשבר בעברית, בכתיב, בראשי תיבות או בשמות מוצרים בלועזית, מתוקן באפיון ולא אצל הלקוח הראשון.',
        },
        {
          id: 'actions',
          title: 'מבצע פעולות, לא רק משיב',
          art: '/images/service-page2.webp',
          text: 'באפיון נסגר בכתב אילו פעולות מותרות לסוכן: פתיחת ליד, קביעת פגישה ביומן, בדיקת סטטוס הזמנה. לכל פעולה הרשאה משלה, רישום ביומן ואפשרות ביטול, ואתם רואים את כולן בדוח השבועי.',
        },
        {
          id: 'guardrails',
          title: 'גבולות כתובים נגד הזיות',
          art: '/images/service-page3.webp',
          text: 'מקור הידע היחיד הוא המחירון, התנאים והקטלוג שלכם. לפני ההשקה אנחנו מריצים סדרת שאלות מכשילות ומוסרים לכם את רשימת המקרים שבהם הסוכן עונה שאינו יודע ומעביר לאדם, לאישור שלכם.',
        },
        {
          id: 'handoff',
          title: 'העברה לאדם ברגע הנכון',
          art: '/images/service-page4.webp',
          text: 'כללי העצירה נכתבים באפיון ומאושרים על ידכם: החזר, תלונה, כעס בניסוח או שלוש תשובות בלי פתרון. הנציג מקבל את התמליל המלא, ואחרי שעות הפעילות הסוכן אוסף פרטים ופותח משימה לבוקר.',
        },
      ],
    },
    system: {
      eyebrow: 'מה הוא עושה',
      heading: ['מה סוכן AI עושה בעסק שלכם'],
      art: '/images/service-agents.webp',
      features: [
        {
          id: 'answer',
          icon: 'orders',
          title: 'מענה ראשוני מסביב לשעון',
          text: 'שאלות על מחיר, זמינות, שעות פעילות וסטטוס הזמנה נענות ברגע שהפנייה נוצרת — גם בעשר בלילה וגם בשבת, ולא למחרת בבוקר.',
        },
        {
          id: 'qualify',
          icon: 'club',
          title: 'סינון וכשירות לידים',
          text: 'הסוכן שואל את שאלות הסינון שהגדרתם — סוג העסק, היקף, לוח זמנים — ומגיע אליכם ליד עם תשובות ולא רק שם וטלפון.',
        },
        {
          id: 'book',
          icon: 'sales',
          title: 'קביעת פגישות ועדכון CRM',
          text: 'בדיקת זמינות ביומן, קביעה, שליחת תזכורת ופתיחת כרטיס לקוח — בלי שמישהו יעתיק פרטים ידנית בסוף היום.',
        },
        {
          id: 'knowledge',
          icon: 'catalog',
          title: 'תשובות מהתוכן שלכם',
          text: 'אתם מעדכנים מחירון או תנאים במסמך אחד, והסוכן עונה לפי הגרסה החדשה באותו יום. אין תסריטים לתחזק ואין תשובות ישנות שנשארות מאחור.',
        },
        {
          id: 'log',
          icon: 'analytics',
          title: 'תיעוד ומדידה',
          text: 'כל שיחה נשמרת: מה נשאל, מה נענה, מה הועבר לאדם ואיפה הסוכן נתקע. זה מה שמאפשר לשפר אותו לפי נתונים במקום לנחש.',
        },
      ],
      action: { label: 'בקשת אפיון לסוכן AI', href: '/contact' },
    },
    howItWorks: {
      eyebrow: 'איך זה עובד',
      heading: ['איך מקימים סוכן. בפשטות.'],
      lede: 'לא מתחילים מהמודל אלא מהשיחות שכבר קורות אצלכם היום.',
      steps: [
        {
          id: 'scenarios',
          title: 'אפיון תרחישים',
          text: 'עוברים על הפניות האמיתיות של החודשים האחרונים, מסמנים מה חוזר על עצמו, מה הסוכן ייקח ומה נשאר לאדם. הגבול הזה נסגר בכתב לפני שכותבים שורת קוד.',
          art: '/images/howitwork1.webp',
        },
        {
          id: 'build',
          title: 'בנייה וחיבור למערכות',
          text: 'טוענים את מקורות הידע, מגדירים אילו פעולות מותרות ומחברים ליומן, ל-CRM, לוואטסאפ ולמערכת החשבוניות — עם הרשאה מצומצמת לכל פעולה בנפרד.',
          art: '/images/howitwork2.webp',
        },
        {
          id: 'pilot',
          title: 'פיילוט ושיפור',
          text: 'מריצים על חלק מהתנועה, קוראים תמלולים אמיתיים ומתקנים. רק כשהתשובות עומדות בסטנדרט שהוגדר הסוכן עובר לכל הפניות.',
          art: '/images/howitwork3.webp',
        },
      ],
    },
    banner: {
      heading: 'רוצים לדעת אילו פניות אצלכם סוכן AI יכול לקחת?',
      action: { label: 'בקשת אפיון לסוכן AI', href: '/contact' },
    },
    faqHeading: ['שאלות נפוצות', 'על סוכני AI'],
    faqEntries: [
      {
        question: 'מה אתם בונים בפועל: סוכן AI או צ׳אטבוט?',
        answer:
          'סוכן, ולא בוט עם תפריט. ההבדל למי שמזמין את הפרויקט הוא במה שמאופיין ומתומחר: בוט מנתב שאלות לתשובות מוכנות, וסוכן מבין שאלה חופשית בעברית, עונה מתוך התוכן שלכם ומבצע פעולות במערכות, ולכן כל פעולה כזו מקבלת הרשאה, יומן ואפשרות ביטול משלה. את ההסבר המלא עם טבלת השוואה בין בוט לסוכן פרסמנו במדריך על סוכני AI בבלוג; בשיחת האפיון אנחנו עוברים על הפניות שלכם ואומרים לאיזה חלק מהן מספיק בוט פשוט ולאיזה צריך סוכן.',
      },
      {
        question: 'מה אתם מוסרים כדי שהסוכן לא ימציא תשובות?',
        answer:
          'שלושה דברים כתובים. הראשון: רשימת מקורות הידע שמהם הסוכן רשאי לענות, מחירון, תנאי שירות, קטלוג ונהלים, ושום דבר מעבר להם. השני: סדרת שאלות מכשילות שהרצנו לפני ההשקה, עם התשובה שהסוכן נתן לכל אחת, כדי שתראו איפה הוא עוצר ואומר שאינו יודע. השלישי: כלל ברור למקרה שאין מקור, העברה לאדם עם התמליל. אחרי ההשקה הדוח השבועי מסמן כל תשובה שלא נשענה על מקור, ואנחנו מתקנים את מקור הידע או את הכלל, לא את הלקוח.',
      },
      {
        question: 'איך אתם בודקים שהסוכן עובד בעברית אצלנו?',
        answer:
          'על הפניות שלכם, לא על שלנו. באפיון אתם מייצאים לנו את ההודעות והשיחות של החודשים האחרונים מוואטסאפ ומהאתר, ואנחנו בונים מהן סט בדיקה: כתיב מלא וחסר, ראשי תיבות, שמות מוצרים בלועזית, שאלות של שלושה נושאים בהודעה אחת. הסוכן עובר לפיילוט רק כשהוא עומד באחוז הצלחה שסיכמנו מראש על הסט הזה, ובפיילוט אנחנו קוראים תמלולים אמיתיים ומתקנים. בשלב הזה מתגלה לא פעם שהמחירון או התנאים שלכם מנוסחים כך שאי אפשר לענות לפיהם, וזה תיקון שעושים לפני שהסוכן פוגש לקוח.',
      },
      {
        question: 'למה אפשר לחבר את הסוכן?',
        answer:
          'למערכות שכבר יש לכם. בצד הפנייה זה בדרך כלל וואטסאפ ביזנס והצ׳אט באתר, ומולם CRM, יומן, מערכת חשבוניות ישראלית כמו חשבונית ירוקה, iCount או ריווחית, ומאגר המוצרים או ההזמנות. לכל חיבור מוגדרות הרשאות מצומצמות: הסוכן יכול לקרוא סטטוס הזמנה אך לא לשנות מחיר, לפתוח ליד אך לא למחוק לקוח. כל פעולה נרשמת ביומן עם זמן, שיחה ותוצאה, וכך אפשר לבדוק בדיוק מה קרה במקום להסתמך על זיכרון של מודל.',
      },
      {
        question: 'איך מגדירים מתי הסוכן מעביר לאדם?',
        answer:
          'במסמך האפיון יש פרק של כללי עצירה שאתם מאשרים לפני הבנייה. ברירת המחדל שלנו: בקשה מפורשת לדבר עם אדם, החזר כספי, תלונה, עניין משפטי, ניסוח שמעיד על כעס או מצוקה, ושלוש תשובות ברצף בלי פתרון. כל כלל אפשר להחמיר או להרפות לפי העסק, למשל להעביר כל פנייה מלקוח קיים ישירות למנהל התיק. בהעברה הנציג מקבל את התמליל ואת מה שהסוכן כבר בדק במערכת, ומחוץ לשעות הפעילות נפתחת משימה עם שעת חזרה שנאמרה ללקוח. בדוח השבועי רואים כמה פניות הועברו ולפי איזה כלל, וזה הבסיס לכוונון.',
      },
      {
        question: 'כמה זמן לוקח להקים סוכן AI?',
        answer:
          'הזמן נגזר בעיקר ממספר הפעולות שהסוכן מבצע, לא ממספר השאלות שהוא עונה. סוכן שעונה מתוך מחירון ומסמכי שירות ומעביר לנציג הוא פרויקט קצר יחסית. סוכן שקובע פגישות, פותח כרטיסים ב-CRM ומעדכן סטטוס הזמנות דורש אפיון הרשאות, טיפול בכשלים ובדיקות, ולכן ארוך יותר. בכל מקרה אנחנו מתחילים בפיילוט על חלק מהתנועה: קוראים תמלולים אמיתיים, מתקנים, ורק אז מרחיבים. השלב הזה נראה כמו עיכוב, אבל הוא מה שמונע מהסוכן לפגוש את כל הלקוחות עם אותה טעות.',
      },
      {
        question: 'כמה עולה פיתוח סוכן AI?',
        answer:
          'המחיר נקבע לפי היקף האפיון ומספר החיבורים למערכות, ולכן איננו מפרסמים מחירון אחיד לשירות הזה — מספר אחד לא היה מחזיק מול שני פרויקטים שונים. מה שנכון לדעת מראש הוא מבנה העלות: הקמה חד-פעמית, ולצידה עלות הפעלה חודשית שכוללת את השימוש במודל ואת התחזוקה. עלות המודל גדלה עם נפח השיחות, ולכן אנחנו מציגים אותה כטווח לפי נפח משוער ולא כסכום קבוע. בשיחת האפיון נאמר לכם גם את הדבר הפחות נוח: אם נפח הפניות שלכם קטן מכדי להצדיק סוכן.',
      },
    ],
  },
  'machine-learning': {
    id: 'machine-learning',
    crumb: 'למידת מכונה ו-Data Science',
    eyebrow: 'למידת מכונה ו-Data Science',
    heading: ['למידת מכונה ו-Data Science לעסקים', 'מודלים שעובדים על הנתונים שלכם'],
    subhead: 'שירות ה-Data Science שלנו',
    lede: 'חיזוי ביקוש ומכירות, דירוג לידים וזיהוי לקוחות בסיכון נטישה, המלצות מוצרים לחנות, סיווג מסמכים וטקסט בעברית וזיהוי חריגות — מודל שנבנה על הנתונים של העסק, נבדק מול המציאות ומחובר למערכות שכבר עובדות אצלכם.',
    image: '/images/services-view.webp',
    action: { label: 'בקשת בדיקת נתונים', href: '/contact' },
    metaTitle: 'למידת מכונה ו-Data Science לעסקים — חיזוי, דירוג לידים ו-BI',
    metaDescription:
      'פיתוח מודלים של למידת מכונה לעסקים בישראל: חיזוי ביקוש ומכירות, דירוג לידים ונטישה, המלצות לחנות, סיווג מסמכים בעברית, זיהוי חריגות ודשבורדים. מתחילים בבדיקת נתונים.',
    advantages: {
      eyebrow: 'למה אנחנו',
      heading: ['מה מייחד את עבודת ה-Data Science שלנו'],
      lede: 'אתם מקבלים מודל שאפשר לבדוק: מדד הצלחה שסוכם מראש, השוואה מול השיטה שעובדת אצלכם היום, וחיבור למערכת שבה ההחלטה באמת מתקבלת.',
      outro: 'רוצים לדעת אם הנתונים שלכם מספיקים למודל?',
      action: { label: 'בקשת בדיקת נתונים', href: '/contact' },
      roles: [
        {
          id: 'baseline',
          title: 'קודם קו בסיס, אחר כך מודל',
          art: '/images/service-page1.webp',
          text: 'לפני שבונים מודל מודדים כמה טוב עובדת השיטה הקיימת — ממוצע של השנה שעברה, חוק אצבע של מנהל המכירות, גיליון אקסל. מודל שלא מנצח את קו הבסיס הזה לא עולה לאוויר, ואתם רואים את ההשוואה בכתב.',
        },
        {
          id: 'data-first',
          title: 'בדיקת נתונים לפני התחייבות',
          art: '/images/service-page2.webp',
          text: 'השלב הראשון הוא סקירה של הנתונים שכבר יש לכם: כמה היסטוריה, כמה חוסרים, איפה השדות לא עקביים. לפעמים התשובה היא שעוד אין מספיק נתונים, ואז אנחנו אומרים את זה ומציעים מה לאסוף מהיום.',
        },
        {
          id: 'hebrew',
          title: 'טקסט ומסמכים בעברית',
          art: '/images/service-page3.webp',
          text: 'סיווג פניות, חילוץ שדות ממסמכים וזיהוי נושאים נבדקים על טקסט עברי אמיתי מהעסק — כתיב חסר, ראשי תיבות, מונחים בלועזית — ולא על דוגמאות באנגלית שמתורגמות בסוף.',
        },
        {
          id: 'production',
          title: 'מודל בתוך המערכת, לא במחברת',
          art: '/images/service-page4.webp',
          text: 'התחזית מגיעה למקום שבו מחליטים: ציון ליד ב-CRM, המלצת הזמנה במערכת המלאי, התראה בוואטסאפ. אחרי ההשקה המודל מנוטר, וכשהדיוק שלו יורד מקבלים התראה ותוכנית אימון מחדש.',
        },
      ],
    },
    system: {
      eyebrow: 'מה אפשר לבנות',
      heading: ['מה למידת מכונה עושה בעסק שלכם'],
      art: '/images/service-cms.webp',
      features: [
        {
          id: 'forecast',
          icon: 'sales',
          title: 'חיזוי ביקוש ומכירות',
          text: 'תחזית לפי מוצר, סניף ושבוע שמביאה בחשבון עונתיות, חגים ומבצעים, כדי להזמין מלאי ולשבץ משמרות לפי ביקוש צפוי ולא לפי תחושה.',
        },
        {
          id: 'scoring',
          icon: 'club',
          title: 'דירוג לידים וסיכון נטישה',
          text: 'ציון לכל ליד לפי הסיכוי שיסגור, וציון לכל לקוח קיים לפי הסיכון שיעזוב — כך שהצוות מתקשר קודם למי שזה באמת משנה אצלו משהו.',
        },
        {
          id: 'recommend',
          icon: 'catalog',
          title: 'המלצות לחנות אונליין',
          text: 'מוצרים משלימים בעגלה, ״לקוחות שקנו גם״ ומיון קטלוג לפי היסטוריית רכישה, מחוברים לחנות הקיימת ונמדדים בניסוי מול גרסה בלי המלצות.',
        },
        {
          id: 'documents',
          icon: 'orders',
          title: 'מסמכים, טקסט וחריגות',
          text: 'סיווג פניות ומיילים בעברית, חילוץ נתונים מחשבוניות וטפסים, וזיהוי חריגות בתנועות, בהזמנות או בנתוני חיישנים לפני שהן הופכות לנזק.',
        },
        {
          id: 'bi',
          icon: 'analytics',
          title: 'צינורות נתונים ודשבורדים',
          text: 'איסוף הנתונים מה-CRM, מהחנות, מהנהלת החשבונות ומהקמפיינים למאגר אחד, ודשבורד BI שמראה את אותם מספרים לכל מי שמחליט.',
        },
      ],
      action: { label: 'בקשת בדיקת נתונים', href: '/contact' },
    },
    howItWorks: {
      eyebrow: 'איך זה עובד',
      heading: ['איך מתנהל פרויקט. בפשטות.'],
      lede: 'כל שלב נגמר בהחלטה שלכם אם להמשיך, כך שלא משקיעים בבנייה לפני שיודעים שיש על מה לבנות.',
      steps: [
        {
          id: 'audit',
          title: 'בדיקת נתונים והגדרת יעד',
          text: 'ממפים אילו נתונים קיימים, באיזו איכות ולאיזו תקופה, ומגדירים שאלה עסקית אחת ומדד הצלחה אחד. בסוף השלב מקבלים דוח: אפשר, אפשר בתנאי, או עוד לא.',
          art: '/images/howitwork1.webp',
        },
        {
          id: 'poc',
          title: 'הוכחת היתכנות',
          text: 'בונים מודל ראשון על נתוני עבר ובודקים אותו על תקופה שהמודל לא ראה, מול קו הבסיס שלכם. אם הוא לא מנצח אותו בפער שמצדיק את העבודה, עוצרים כאן.',
          art: '/images/howitwork2.webp',
        },
        {
          id: 'production',
          title: 'הטמעה וניטור',
          text: 'מחברים את המודל למערכת שבה ההחלטה מתקבלת, מגדירים אימון מחדש ומנטרים דיוק לאורך זמן, כי התנהגות לקוחות ושווקים משתנה והמודל צריך להשתנות איתם.',
          art: '/images/howitwork3.webp',
        },
      ],
    },
    banner: {
      heading: 'רוצים לדעת מה אפשר לחזות מהנתונים שכבר יש לכם?',
      action: { label: 'בקשת בדיקת נתונים', href: '/contact' },
    },
    faqHeading: ['שאלות נפוצות', 'על למידת מכונה ו-Data Science'],
    faqEntries: [
      {
        question: 'מה ההבדל בין למידת מכונה לסוכן AI או לצ׳אט GPT?',
        answer:
          'מודל שפה כמו ChatGPT מנסח טקסט ועונה על שאלות, וסוכן AI בנוי עליו כדי לנהל שיחה ולבצע פעולות. למידת מכונה במובן של השירות הזה עוסקת בשאלה אחרת: לחזות מספר או לסווג רשומה על בסיס הנתונים ההיסטוריים של העסק — כמה יחידות יימכרו בשבוע הבא, איזה ליד יסגור, איזו תנועה חריגה. מודלים כאלה בדרך כלל קטנים יותר, זולים יותר להפעלה וקלים יותר לבדיקה, כי אפשר להשוות כל תחזית למה שקרה בפועל. בפרויקטים רבים משלבים את שני הסוגים.',
      },
      {
        question: 'אילו נתונים צריך כדי להתחיל?',
        answer:
          'תלוי בשאלה. לחיזוי מכירות צריך היסטוריה של הזמנות או מכירות לפי תאריך ומוצר, רצוי שנתיים ומעלה כדי לראות עונתיות וחגים. לדירוג לידים צריך לידים מהעבר עם תוצאה ידועה — נסגר או לא. לסיווג מסמכים צריך דוגמאות שכבר סווגו ידנית. הנתונים לא חייבים להיות מסודרים: ייצוא מה-CRM, מהחנות או מגיליון אקסל מספיק לבדיקה הראשונה. מה שבאמת חוסם הוא נתון שלא נשמר בכלל, למשל סיבת ביטול שאף אחד לא מתעד. במקרה כזה בדיקת הנתונים מסתיימת בהמלצה מה להתחיל לאסוף.',
      },
      {
        question: 'האם עסק קטן או בינוני בכלל צריך למידת מכונה?',
        answer:
          'לא תמיד, ואנחנו אומרים את זה בבדיקת הנתונים. אם יש לכם מאה לקוחות ומוצר אחד, דשבורד טוב וכמה חוקים פשוטים ייתנו כמעט את כל הערך. למידת מכונה מתחילה להשתלם כשיש הרבה החלטות חוזרות על הרבה פריטים — מאות מוצרים במלאי, אלפי לידים בשנה, זרם קבוע של מסמכים — ואדם לא מספיק לבחון כל אחד מהם. גם אז מתחילים בשאלה אחת עם מדד ברור, ולא בפלטפורמה. לעיתים קרובות השלב הראשון והמשתלם ביותר הוא דווקא צינור נתונים ודשבורד, והמודל מגיע אחריו.',
      },
      {
        question: 'איך יודעים שהמודל באמת עובד?',
        answer:
          'בודקים אותו על נתונים שהוא לא ראה. בהוכחת ההיתכנות שומרים בצד תקופה אחרונה, למשל שלושת החודשים האחרונים, מאמנים על מה שלפניה ומשווים את התחזיות למה שקרה בפועל. אותה השוואה נעשית גם לשיטה שעובדת אצלכם היום, כך שרואים פער אמיתי ולא אחוז דיוק מנותק מהקשר. אחרי ההשקה הבדיקה ממשיכה: כל תחזית נרשמת ומושווית לתוצאה, ודוח תקופתי מראה אם הדיוק נשמר. כשהוא יורד, למשל אחרי שינוי מחירים או קהל חדש, מאמנים מחדש על הנתונים העדכניים.',
      },
      {
        question: 'מה לגבי פרטיות ותיקון 13 לחוק הגנת הפרטיות?',
        answer:
          'תיקון 13 לחוק הגנת הפרטיות הרחיב את החובות של עסקים שמחזיקים מידע אישי, ולכן פרטיות היא חלק מהאפיון ולא נספח. בפועל אנחנו עובדים לפי עקרון של מינימום מידע: מודל לחיזוי מכירות לא צריך שמות וטלפונים, ומזהים מוחלפים בקודים לפני שהנתונים יוצאים מהמערכת שלכם. הנתונים נשמרים בסביבה שאתם שולטים בה, הגישה מתועדת, ובסוף הפרויקט מוחקים עותקי עבודה. איננו נותנים ייעוץ משפטי; אם המאגר שלכם מחייב בדיקה של יועץ פרטיות, נכין עבורו תיאור מדויק של מה נאסף, איפה נשמר ולמה.',
      },
      {
        question: 'מה אנחנו מקבלים בסוף הפרויקט?',
        answer:
          'מודל שרץ בתוך המערכות שלכם, ולא קובץ שנשאר אצלנו. בדרך כלל זה כולל את צינור הנתונים שמזין אותו, את הקוד של המודל ושל האימון מחדש, חיבור למקום שבו התחזית משמשת — CRM, מערכת מלאי, חנות או דשבורד — ומסמך שמסביר אילו נתונים נכנסים, מה יוצא ואיך קוראים את התוצאה. מקבלים גם דוח של הוכחת ההיתכנות עם ההשוואה לקו הבסיס. הקוד והמודל שייכים לכם. אחרי ההשקה אפשר להשאיר אצלנו את הניטור והאימון מחדש, או לקבל הדרכה ולהפעיל לבד.',
      },
    ],
  },
  'computer-vision': {
    id: 'computer-vision',
    crumb: 'ראייה ממוחשבת',
    eyebrow: 'ראייה ממוחשבת',
    heading: ['ראייה ממוחשבת לעסקים', 'זיהוי בתמונה ובווידאו שמחובר לתהליך'],
    subhead: 'שירות הראייה הממוחשבת שלנו',
    lede: 'זיהוי אובייקטים בתמונות ובווידאו, OCR למסמכים ולחשבוניות בעברית, בקרת איכות בקו ייצור, ספירת אנשים ורכבים, טשטוש פנים לשמירה על פרטיות ותיוג אוטומטי של תמונות מוצר לחנות — נבדק על התמונות שלכם ומחובר למערכות הקיימות.',
    image: '/images/service-platform.webp',
    action: { label: 'בקשת בדיקת היתכנות', href: '/contact' },
    metaTitle: 'ראייה ממוחשבת לעסקים — זיהוי תמונה, OCR בעברית ובקרת איכות',
    metaDescription:
      'פיתוח פתרונות ראייה ממוחשבת לעסקים בישראל: זיהוי אובייקטים, OCR לחשבוניות ומסמכים בעברית, בקרת איכות, ספירת אנשים ורכבים, טשטוש פנים ותיוג תמונות מוצר.',
    advantages: {
      eyebrow: 'למה אנחנו',
      heading: ['מה מייחד את פתרונות הראייה הממוחשבת שלנו'],
      lede: 'מודל ראייה נמדד בתנאים שלכם: התאורה, הזווית, המצלמה והמסמכים שבאמת מגיעים — לא במאגר תמונות לדוגמה.',
      outro: 'רוצים לבדוק אם המצלמות או הסריקות שלכם מספיקות?',
      action: { label: 'בקשת בדיקת היתכנות', href: '/contact' },
      roles: [
        {
          id: 'real-images',
          title: 'בדיקה על התמונות שלכם',
          art: '/images/service-page1.webp',
          text: 'לפני בנייה אוספים מדגם של תמונות, סריקות או קטעי וידאו מהשטח, כולל המקרים הקשים: לילה, סנוור, מסמך מקומט, מוצר בזווית. כך רואים מראש איפה הזיהוי יתקשה, ולא אחרי ההתקנה.',
        },
        {
          id: 'hebrew-ocr',
          title: 'OCR שמבין עברית',
          art: '/images/service-page2.webp',
          text: 'חשבוניות, תעודות משלוח וטפסים בעברית כוללים טקסט מימין לשמאל, מספרים משמאל לימין וטבלאות מעורבות. החילוץ נבדק על המסמכים של הספקים שלכם, ושדה שהמערכת לא בטוחה בו מסומן לבדיקה של אדם.',
        },
        {
          id: 'privacy',
          title: 'פרטיות בתכנון',
          art: '/images/service-page3.webp',
          text: 'כשאפשר, העיבוד נעשה על המצלמה או בשרת מקומי ורק הספירה או ההתראה יוצאות. פנים ולוחיות רישוי מטושטשות לפני שמירה, ותקופת השמירה נקבעת באפיון ולא נשארת ברירת מחדל.',
        },
        {
          id: 'integration',
          title: 'תוצאה שנכנסת למערכת',
          art: '/images/service-page4.webp',
          text: 'זיהוי שאף אחד לא רואה לא שווה כלום. החשבונית נכנסת להנהלת החשבונות, הפגם פותח התראה למנהל המשמרת, והתגיות נכתבות ישירות לקטלוג החנות.',
        },
      ],
    },
    system: {
      eyebrow: 'מה אפשר לבנות',
      heading: ['מה ראייה ממוחשבת עושה בעסק שלכם'],
      art: '/images/service-dev-hero.webp',
      features: [
        {
          id: 'ocr',
          icon: 'orders',
          title: 'OCR למסמכים וחשבוניות',
          text: 'חילוץ ספק, תאריך, סכומים ושורות פריטים מחשבוניות, תעודות משלוח וטפסים בעברית, ישר למערכת הנהלת החשבונות או ל-ERP.',
        },
        {
          id: 'quality',
          icon: 'analytics',
          title: 'בקרת איכות וזיהוי פגמים',
          text: 'מצלמה מעל קו הייצור או האריזה שמזהה פגם, חוסר או תווית שגויה ומתריעה בזמן אמת, עם תיעוד תמונה לכל מקרה.',
        },
        {
          id: 'counting',
          icon: 'club',
          title: 'ספירת אנשים ורכבים',
          text: 'ספירת מבקרים בחנות, תפוסה בחניון או תנועה בכניסה, כנתון מצטבר בלי לשמור זהויות, להשוואה בין שעות, ימים וסניפים.',
        },
        {
          id: 'detection',
          icon: 'catalog',
          title: 'זיהוי אובייקטים ומלאי',
          text: 'זיהוי מוצרים על מדף, משטחים במחסן או ציוד באתר, ובדיקה שמה שנראה בתמונה תואם את מה שרשום במערכת.',
        },
        {
          id: 'tagging',
          icon: 'sales',
          title: 'תיוג תמונות מוצר וטשטוש פנים',
          text: 'תיוג צבע, סוג וקטגוריה לתמונות מוצר בחנות, ולצידו טשטוש אוטומטי של פנים ולוחיות רישוי בתמונות ובסרטונים לפני פרסום או שמירה.',
        },
      ],
      action: { label: 'בקשת בדיקת היתכנות', href: '/contact' },
    },
    howItWorks: {
      eyebrow: 'איך זה עובד',
      heading: ['איך מתנהל פרויקט. בפשטות.'],
      lede: 'מתחילים מהתמונות שכבר יש לכם, כי הן אלה שיקבעו כמה טוב הזיהוי יעבוד.',
      steps: [
        {
          id: 'sample',
          title: 'מדגם והגדרת יעד',
          text: 'אוספים תמונות, סריקות או וידאו מהשטח, מגדירים מה בדיוק צריך לזהות ומה נחשב טעות יקרה יותר — פספוס או התראת שווא.',
          art: '/images/howitwork1.webp',
        },
        {
          id: 'poc',
          title: 'הוכחת היתכנות',
          text: 'מתחילים ממודל קיים ומתאימים אותו לתמונות שלכם, ובודקים על מדגם שהמודל לא ראה. התוצאה היא דוח עם דוגמאות של הצלחות וכישלונות, לא רק מספר.',
          art: '/images/howitwork2.webp',
        },
        {
          id: 'deploy',
          title: 'התקנה וניטור',
          text: 'מחברים למצלמות, לסורק או לתיבת המייל, מזרימים את התוצאה למערכת ומנטרים. מקרים שהמודל לא היה בטוח בהם נאספים ומשמשים לשיפור הבא.',
          art: '/images/howitwork3.webp',
        },
      ],
    },
    banner: {
      heading: 'רוצים לבדוק מה אפשר לזהות בתמונות שכבר יש לכם?',
      action: { label: 'בקשת בדיקת היתכנות', href: '/contact' },
    },
    faqHeading: ['שאלות נפוצות', 'על ראייה ממוחשבת'],
    faqEntries: [
      {
        question: 'מה זה ראייה ממוחשבת ובמה היא שונה מ-OCR רגיל?',
        answer:
          'ראייה ממוחשבת היא התחום שבו מחשב מבין מה מופיע בתמונה או בווידאו: אילו אובייקטים יש, איפה הם, כמה מהם ובאיזה מצב. OCR הוא מקרה פרטי שלה — זיהוי טקסט. OCR רגיל מחזיר את כל הטקסט בעמוד כרצף אחד, ואילו פתרון לחשבוניות צריך להבין גם את המבנה: איזה מספר הוא הסכום לתשלום, איזה הוא המע״מ ואיזה הוא מספר הספק. לכן אנחנו משלבים זיהוי טקסט עם הבנת פריסת המסמך, ובודקים את התוצאה מול כללים פשוטים, למשל שסכום השורות שווה לסה״כ.',
      },
      {
        question: 'האם OCR עובד טוב על חשבוניות ומסמכים בעברית?',
        answer:
          'על מסמכים מודפסים וסריקות סבירות — כן, אבל עברית מציבה אתגרים שכדאי לבדוק מראש: טקסט מימין לשמאל לצד מספרים ותאריכים משמאל לימין, טבלאות עם עמודות הפוכות, חותמות, וכתב יד על גבי טופס. לכן הוכחת ההיתכנות נעשית על מסמכים אמיתיים של הספקים שלכם. לכל שדה שחולץ המערכת נותנת רמת ביטחון, ושדה שנמצא מתחת לסף עובר לבדיקה של אדם במקום להיכנס להנהלת החשבונות. כך אנשים בודקים רק את המקרים הספורים, ולא מקלידים הכול מחדש.',
      },
      {
        question: 'צריך לקנות מצלמות או חומרה חדשה?',
        answer:
          'לא בהכרח. מצלמות אבטחה קיימות מספיקות לעיתים קרובות לספירת אנשים או רכבים, ולסריקת מסמכים מספיקים סורק משרדי או טלפון. בקרת איכות על קו ייצור היא המקרה שבו לרוב צריך מצלמה ייעודית ותאורה קבועה, כי פגם קטן נעלם בתמונה מטושטשת או בצל משתנה. בשלב המדגם בודקים את התמונות מהציוד הקיים, ואם הן לא מספיקות אומרים בדיוק מה חסר: רזולוציה, זווית, תאורה או קצב פריימים. העיבוד יכול לרוץ בענן, בשרת מקומי או על מכשיר קטן ליד המצלמה.',
      },
      {
        question: 'איך שומרים על פרטיות כשמצלמים אנשים?',
        answer:
          'העיקרון הוא לא לשמור מה שלא צריך. לספירת מבקרים לא צריך לדעת מי נכנס, ולכן העיבוד יכול לרוץ קרוב למצלמה כך שרק המספר יוצא ממנה. כשבכל זאת שומרים תמונות או וידאו, פנים ולוחיות רישוי מטושטשות אוטומטית לפני השמירה, ותקופת השמירה נקבעת מראש. תיקון 13 לחוק הגנת הפרטיות הרחיב את החובות של מי שמחזיק מידע אישי, וצילום אנשים עשוי להיות כזה. איננו נותנים ייעוץ משפטי, אבל נמסור ליועץ הפרטיות שלכם תיאור מלא של מה מצולם, מה נשמר, איפה ולמה.',
      },
      {
        question: 'כמה תמונות צריך כדי לאמן מודל?',
        answer:
          'פחות ממה שנהוג לחשוב, כי לרוב לא מאמנים מאפס. מתחילים ממודל שכבר מכיר אלפי סוגי אובייקטים ומתאימים אותו לשלכם, ולכן לבדיקה ראשונה מספיקות לעיתים מאות תמונות מתויגות ולא עשרות אלפים. מה שחשוב יותר מהכמות הוא הגיוון: תמונות מכל משמרת, תאורה, זווית וסוג מוצר, וגם מספיק דוגמאות של המקרה הנדיר שאתם רוצים לתפוס, כמו פגם. כשהפגם באמת נדיר, אוספים אותו לאורך זמן או משלבים זיהוי חריגות. את התיוג עושים יחד איתכם, כי רק אתם יודעים מה נחשב פגם.',
      },
      {
        question: 'מה קורה כשהמודל טועה?',
        answer:
          'הוא יטעה, ולכן התכנון מתחיל בשאלה איזו טעות יקרה יותר. בבקרת איכות פספוס של פגם יקר יותר מהתראת שווא, ולכן מכוונים את הסף בהתאם; בתיוג מוצרים להפך. לכל זיהוי יש רמת ביטחון, ומקרים גבוליים עוברים לאדם במקום לפעול לבד. כל טעות שמתגלה נשמרת עם התמונה ונכנסת לסבב האימון הבא, כך שהמודל משתפר דווקא על המקרים שבאמת קורים אצלכם. דוח תקופתי מראה כמה זיהויים היו, כמה תוקנו ידנית ואיפה המודל מתקשה, וזה הבסיס להחלטה מה לשפר.',
      },
    ],
  },
  'llm-integration': {
    id: 'llm-integration',
    crumb: 'חיבור LLM ו-RAG',
    eyebrow: 'חיבור LLM ו-RAG',
    heading: ['חיבור מודלי שפה ו-RAG לעסק', 'GPT, Claude ו-Gemini שעונים מתוך המסמכים שלכם'],
    subhead: 'שירות חיבור מודלי השפה שלנו',
    lede: 'חיבור מודל שפה כמו GPT, Claude או Gemini למידע הפנימי של העסק: צ׳אט מעל מסמכים, עוזר ידע לצוות, חיפוש חכם במסמכים בעברית, חילוץ וסיכום של חוזים וחשבוניות ועוזר מותאם שעונה רק מתוך המקורות שלכם. מתאים לעסקים שיש להם הרבה ידע כתוב ופחות מדי זמן לחפש בו.',
    image: '/images/services-view.webp',
    action: { label: 'בקשת בדיקת היתכנות', href: '/contact' },
    metaTitle: 'חיבור LLM ו-RAG לעסק — צ׳אט על מסמכים, עוזר ידע ופרטיות',
    metaDescription:
      'חיבור GPT, Claude ו-Gemini לנתונים של העסק: צ׳אט מעל מסמכים, עוזר ידע פנימי, RAG על מסמכים בעברית, חילוץ וסיכום, והטמעה פרטית עם שמירה על פרטיות. מתחילים בבדיקת היתכנות.',
    advantages: {
      eyebrow: 'למה אנחנו',
      heading: ['מה מייחד את חיבור מודלי השפה שלנו'],
      lede: 'מודל שפה לבדו ממציא תשובות בביטחון מלא. אנחנו בונים סביבו מערכת שמביאה לו את המקור הנכון, מציגה לכם מאיפה התשובה הגיעה ויודעת לומר ״לא מצאתי״.',
      outro: 'רוצים לבדוק אם אפשר לשאול את המסמכים שלכם שאלות?',
      action: { label: 'בקשת בדיקת היתכנות', href: '/contact' },
      roles: [
        {
          id: 'sources',
          title: 'תשובה עם מקור',
          art: '/images/service-page1.webp',
          text: 'כל תשובה מגיעה עם הקטעים שממנה נלקחה, כך שאפשר ללחוץ ולבדוק במסמך המקורי. כשהמידע לא קיים, העוזר אומר שלא מצא, ולא משלים מהדמיון.',
        },
        {
          id: 'hebrew',
          title: 'עברית אמיתית של עסק',
          art: '/images/service-page2.webp',
          text: 'החיפוש נבדק על מסמכים בעברית כפי שהם: סריקות, טבלאות, ראשי תיבות, מונחי מקצוע ותערובת של עברית ואנגלית. לא רק על קובץ נקי שנבחר להדגמה.',
        },
        {
          id: 'model-choice',
          title: 'בחירת מודל לפי המשימה',
          art: '/images/service-page3.webp',
          text: 'אנחנו לא קשורים לספק אחד. בודקים את אותן שאלות על כמה מודלים ובוחרים לפי איכות, מהירות ועלות הפעלה, ואפשר להחליף מודל בהמשך בלי לבנות מחדש.',
        },
        {
          id: 'privacy',
          title: 'פרטיות בתוך האפיון',
          art: '/images/service-page4.webp',
          text: 'כבר בהתחלה מחליטים איזה מידע בכלל נשלח למודל, מי רשאי לראות איזה מסמך, ואם נכון להפעיל מודל בסביבה פרטית. זו החלטה מוקדמת ולא תוספת ברגע האחרון.',
        },
      ],
    },
    system: {
      eyebrow: 'מה אפשר לבנות',
      heading: ['מה מודל שפה עושה עם הנתונים שלכם'],
      art: '/images/service-cms.webp',
      features: [
        {
          id: 'chat',
          icon: 'orders',
          title: 'צ׳אט מעל מסמכי החברה',
          text: 'שואלים בשפה חופשית על נהלים, הצעות מחיר, חוזים או מדריכי מוצר, ומקבלים תשובה קצרה עם קישור לקטע המקורי.',
        },
        {
          id: 'assistant',
          icon: 'club',
          title: 'עוזר ידע פנימי לצוות',
          text: 'מוקד שירות, מכירות או הדרכה שעונים ללקוחות ולעובדים חדשים מתוך מאגר ידע אחד, במקום לחפש בתיקיות ולשאול את מי שכבר יודע.',
        },
        {
          id: 'rag',
          icon: 'catalog',
          title: 'RAG על מסמכים בעברית',
          text: 'הכנת המסמכים, חלוקתם לקטעים, אינדקס חיפוש סמנטי ובדיקה על שאלות אמיתיות, כדי שהמודל יקבל את הקטע הנכון לפני שהוא עונה.',
        },
        {
          id: 'extraction',
          icon: 'analytics',
          title: 'חילוץ וסיכום מסמכים',
          text: 'שליפת שדות מחשבוניות, חוזים וטפסים לטבלה, וסיכום של מסמכים ארוכים ושרשורי מיילים, עם סימון של מה שדורש בדיקה אנושית.',
        },
        {
          id: 'private',
          icon: 'sales',
          title: 'עוזר מותאם ופריסה פרטית',
          text: 'עוזר בסגנון GPT מותאם לתחום ולטון של העסק, בענן שלכם או בהרצה עצמית של מודל פתוח כשהמידע לא יכול לצאת מהארגון.',
        },
      ],
      action: { label: 'בקשת בדיקת היתכנות', href: '/contact' },
    },
    howItWorks: {
      eyebrow: 'איך זה עובד',
      heading: ['איך מתנהל פרויקט. בפשטות.'],
      lede: 'מתחילים בקטן, על מאגר מסמכים אחד ושאלות אמיתיות, ומרחיבים רק אחרי שרואים שהתשובות נכונות.',
      steps: [
        {
          id: 'scope',
          title: 'מיפוי מקורות ושאלות',
          text: 'אוספים יחד איתכם את המסמכים והשאלות שהצוות שואל בפועל, בודקים מה רגיש, ומגדירים מה נחשב תשובה טובה. מכאן נבנה סט בדיקה קבוע.',
          art: '/images/howitwork1.webp',
        },
        {
          id: 'prototype',
          title: 'אב-טיפוס ובדיקת איכות',
          text: 'בונים עוזר על חלק מהמאגר ומריצים עליו את סט הבדיקה. מודדים כמה תשובות נכונות, כמה חסרות מקור וכמה המציא, ומשפרים עד שהתוצאה מקובלת עליכם.',
          art: '/images/howitwork2.webp',
        },
        {
          id: 'launch',
          title: 'הטמעה, הרשאות ותחזוקה',
          text: 'מחברים לערוץ שבו עובדים, למשל אתר, וואטסאפ, Slack או מערכת פנימית, מגדירים הרשאות ועדכון אוטומטי של מסמכים, ובודקים שאלות שנכשלו כדי לשפר.',
          art: '/images/howitwork3.webp',
        },
      ],
    },
    banner: {
      heading: 'רוצים שהצוות שלכם יקבל תשובות מתוך המסמכים של העסק?',
      action: { label: 'בקשת בדיקת היתכנות', href: '/contact' },
    },
    faqHeading: ['שאלות נפוצות', 'על חיבור LLM ו-RAG'],
    faqEntries: [
      {
        question: 'מה זה RAG ולמה לא מספיק פשוט להשתמש ב-ChatGPT?',
        answer:
          'RAG הוא שילוב של חיפוש ושל מודל שפה: לפני שהמודל עונה, המערכת מוצאת במסמכים שלכם את הקטעים הרלוונטיים ומעבירה אותם אליו יחד עם השאלה. ChatGPT רגיל לא מכיר את הנהלים, המחירונים והחוזים שלכם, ולכן הוא ינחש או יענה בכלליות. עם RAG התשובה מבוססת על המקור, אפשר לראות ממה היא נלקחה, ומעדכנים את הידע בהחלפת מסמך ולא באימון מחדש של מודל. זו הדרך הנפוצה ביותר לחבר מודל שפה למידע ארגוני. ההקמה הראשונה קלה יחסית, והשיפור המתמשך הוא מה שמבדיל בין הדגמה לכלי עבודה.',
      },
      {
        question: 'האם זה עובד על מסמכים בעברית?',
        answer:
          'כן, אבל עברית דורשת בדיקה ולא הנחה. מודלי השפה הגדולים מבינים עברית היטב, אך החיפוש שמביא להם את הקטע הנכון רגיש לכתיב, לראשי תיבות, לסריקות לא ברורות ולטבלאות. לכן אנחנו בוחרים את שיטת החיפוש ואת המודל אחרי שמריצים שאלות אמיתיות על המסמכים שלכם, ובודקים גם שאלות בניסוח שונה. אם חלק מהמסמכים הם תמונות סרוקות, מוסיפים שלב של זיהוי טקסט, ומסמנים מראש מסמכים שאי אפשר לקרוא באיכות מספקת. בבדיקת ההיתכנות נראה לכם בפועל איך המערכת מתמודדת עם הקבצים הכי בעייתיים שלכם.',
      },
      {
        question: 'איך מונעים מהמודל להמציא תשובות?',
        answer:
          'אי אפשר להבטיח אפס טעויות, אבל אפשר להקטין אותן מאוד ולהפוך אותן לנראות. העוזר מקבל הוראה לענות רק מתוך הקטעים שנמצאו, מציג את המקור בכל תשובה, ואומר שלא מצא כשאין מידע. לפני ההשקה מריצים סט שאלות קבוע ובודקים ידנית את התוצאות, כולל שאלות שהתשובה עליהן לא קיימת במסמכים. אחרי ההשקה שומרים שאלות שנכשלו, ומשתמשים בהן לשיפור. בנושאים רגישים אפשר להוסיף אישור אנושי לפני שהתשובה יוצאת ללקוח. המטרה היא עוזר שאפשר לסמוך עליו, ושיודע להודות בגבולות הידע שלו.',
      },
      {
        question: 'האם המידע שלנו נשלח לחברות כמו OpenAI או Google?',
        answer:
          'זה נקבע באפיון. אפשר להשתמש בממשק עסקי של ספק גדול, שבו תנאי השימוש קובעים אם המידע משמש לאימון, ואפשר לשלוח למודל רק את הקטעים הדרושים לשאלה ולא את המאגר כולו. כשהמידע לא יכול לצאת מהארגון, מפעילים מודל פתוח על שרת שבשליטתכם. כל אפשרות כזו נבחרת לפי רגישות המידע, ובמקרים של מידע אישי נדרשת בדיקה של תנאי הספק. אנחנו מכינים לכם תיאור כתוב של זרימת המידע, שאפשר להעביר ליועץ הפרטיות. כך אפשר להחליט על בסיס מסמך ברור ולא על בסיס הבטחות כלליות של ספק.',
      },
      {
        question: 'מה לגבי פרטיות ותיקון 13 לחוק הגנת הפרטיות?',
        answer:
          'תיקון 13 לחוק הגנת הפרטיות הרחיב את החובות של גופים שמחזיקים מידע אישי, ולכן הפרטיות נכנסת לאפיון כבר בהתחלה. בפועל אנחנו עובדים לפי מינימום מידע: לא מכניסים למאגר של העוזר מסמכים שאין בהם צורך, מגבילים גישה לפי תפקיד, מתעדים שימוש ומאפשרים מחיקה של מסמך מהאינדקס. איננו נותנים ייעוץ משפטי. אם יש לכם מאגר רגיש, נתאר במדויק מה נאסף, איפה נשמר ולמי יש גישה, כדי שהיועץ שלכם יוכל לקבוע אם נדרשים צעדים נוספים. הנושא נבחן יחד איתכם בתחילת הפרויקט, ולא נדחה לשלב ההשקה.',
      },
      {
        question: 'כמה זמן לוקח להעמיד עוזר ראשון, ומה מקבלים בסוף?',
        answer:
          'אב-טיפוס על מאגר מסמכים אחד ושאלות אמיתיות אפשר להציג לרוב בתוך מספר שבועות, תלוי באיכות המסמכים ובמספר המערכות שמתחברות. בסוף מקבלים עוזר שעובד בערוץ שבו הצוות כבר נמצא, את קוד החיבור והאינדקס, סט בדיקה שמראה את רמת הדיוק, ומסמך שמסביר איך מוסיפים ומעדכנים מסמכים. הקוד שייך לכם. אחרי ההשקה אפשר להשאיר אצלנו ניטור ושיפור שוטף, או לקבל הדרכה ולהפעיל לבד. בשיחה הראשונה נבדוק יחד מה הסיכוי שהמסמכים שלכם מתאימים לזה, ואם לא, נגיד את זה בגלוי ולא נמשיך.',
      },
    ],
  },
  'data-analytics': {
    id: 'data-analytics',
    crumb: 'ניתוח נתונים ודשבורדים',
    eyebrow: 'ניתוח נתונים ודשבורדים',
    heading: ['ניתוח נתונים ודשבורדי BI לעסקים', 'כל המספרים במקום אחד, מעודכנים לבד'],
    subhead: 'שירות ניתוח הנתונים שלנו',
    lede: 'חיבור ה-CRM, החנות, קמפיינים בגוגל ובמטא, GA4 ומערכת הנהלת החשבונות למאגר אחד, הגדרת מדדים שכולם מסכימים עליהם, דשבורדים ב-Looker Studio או ב-Power BI ודוחות אוטומטיים לוואטסאפ ולמייל — כדי שבעלי העסק והמנהלים יראו מה קורה בלי לחכות לאקסל של סוף החודש.',
    image: '/images/services-view.webp',
    action: { label: 'בקשת מיפוי מקורות נתונים', href: '/contact' },
    metaTitle: 'ניתוח נתונים ודשבורדי BI לעסקים — Looker Studio, Power BI ודוחות אוטומטיים',
    metaDescription:
      'בניית דשבורדים ומערכות דיווח לעסקים בישראל: חיבור CRM, Shopify ו-WooCommerce, גוגל ומטא, GA4 ותוכנות הנהלת חשבונות כמו Priority ו-iCount, מחסן נתונים, ניקוי נתונים ודוחות אוטומטיים לוואטסאפ.',
    advantages: {
      eyebrow: 'למה אנחנו',
      heading: ['מה מייחד את עבודת ניתוח הנתונים שלנו'],
      lede: 'דשבורד טוב נמדד בשאלה אחת: האם מישהו פותח אותו ומקבל החלטה. לכן אנחנו מתחילים מהשאלות של העסק, ורק אחר כך מהכלים.',
      outro: 'רוצים לראות איפה המספרים של העסק מתפזרים היום?',
      action: { label: 'בקשת מיפוי מקורות נתונים', href: '/contact' },
      roles: [
        {
          id: 'kpi-first',
          title: 'קודם מדדים, אחר כך גרפים',
          art: '/images/service-page1.webp',
          text: 'לפני שמחברים משהו יושבים איתכם ומגדירים מה נחשב ליד, מה נחשב מכירה ואיך מחשבים רווחיות. ההגדרות נכתבות במסמך אחד, כדי שהשיווק, המכירות וההנהלה יפסיקו להתווכח על מי המספר הנכון.',
        },
        {
          id: 'israeli-stack',
          title: 'מערכות שעובדות בישראל',
          art: '/images/service-page2.webp',
          text: 'אנחנו מכירים את מה שעסקים כאן באמת משתמשים בו: Priority, iCount, חשבונית ירוקה, רייבית, וגם מערכות CRM מקומיות ופלטפורמות חנות. כשאין חיבור מוכן, בונים אחד דרך API או ייצוא מתוזמן.',
        },
        {
          id: 'clean-data',
          title: 'ניקוי נתונים בלי להסתיר חורים',
          art: '/images/service-page3.webp',
          text: 'כפילויות, שדות ריקים, מקורות ליד שנרשמו בשלוש כתיבות שונות — מתקנים מה שאפשר ומסמנים מה שאי אפשר. נתון חסר מוצג כחסר, ולא נעלם בממוצע.',
        },
        {
          id: 'ownership',
          title: 'הדשבורד והנתונים שלכם',
          art: '/images/service-page4.webp',
          text: 'החשבונות, המאגר והדשבורדים נפתחים על שם העסק, והגישה מנוהלת על ידכם. אם תרצו להמשיך לבד או עם גורם אחר, לא תצטרכו לבנות הכול מחדש.',
        },
      ],
    },
    system: {
      eyebrow: 'מה אפשר לבנות',
      heading: ['מה ניתוח נתונים נותן לעסק שלכם'],
      art: '/images/service-cms.webp',
      features: [
        {
          id: 'connect',
          icon: 'analytics',
          title: 'חיבור מקורות נתונים',
          text: 'CRM, Shopify ו-WooCommerce, Google Ads, Meta Ads, GA4, מערכת הנהלת חשבונות וגיליונות אקסל — נמשכים אוטומטית ומתעדכנים בתדירות שמתאימה לעסק.',
        },
        {
          id: 'warehouse',
          icon: 'catalog',
          title: 'מחסן נתונים ו-ETL',
          text: 'כשהנתונים גדלים או מגיעים ממערכות רבות, מקימים מאגר מרכזי עם תהליכי איסוף והמרה, כך שהדשבורד לא נשען על ייצוא ידני שנשבר בכל שינוי עמודה.',
        },
        {
          id: 'dashboards',
          icon: 'sales',
          title: 'דשבורדים ב-Looker Studio וב-Power BI',
          text: 'מסך מנהלים, מסך שיווק ומסך מכירות, עם סינון לפי תקופה, מקור וצוות. הבחירה בין הכלים נעשית לפי התקציב, הצוות והמערכות שכבר בשימוש.',
        },
        {
          id: 'reports',
          icon: 'orders',
          title: 'דוחות אוטומטיים לוואטסאפ ולמייל',
          text: 'סיכום יומי או שבועי שמגיע לבעלים ולמנהלים לפי לוח זמנים, והתראה מיידית כשמדד חורג — למשל עלות ליד שקפצה או חנות שירדה במכירות.',
        },
        {
          id: 'attribution',
          icon: 'club',
          title: 'מדידת שיווק ורווחיות',
          text: 'חיבור ההוצאה בקמפיינים להכנסה האמיתית שנסגרה, כדי לראות איזה ערוץ מביא לקוחות משלמים ולא רק לחיצות, ולחשב עלות רכישה ורווחיות לפי לקוח או מוצר.',
        },
      ],
      action: { label: 'בקשת מיפוי מקורות נתונים', href: '/contact' },
    },
    howItWorks: {
      eyebrow: 'איך זה עובד',
      heading: ['איך מתנהל פרויקט. בפשטות.'],
      lede: 'מתחילים במסך אחד שעונה על שאלה אחת, ומרחיבים רק אחרי שרואים שהמספרים נכונים ושמשתמשים בהם.',
      steps: [
        {
          id: 'mapping',
          title: 'מיפוי מקורות ומדדים',
          text: 'עוברים על כל מערכת שמחזיקה נתונים, מגדירים את המדדים החשובים ומחליטים מי צריך לראות מה. בסוף השלב מקבלים רשימת חיבורים, הגדרות מדדים וסדר עבודה.',
          art: '/images/howitwork1.webp',
        },
        {
          id: 'pipeline',
          title: 'חיבור וניקוי',
          text: 'מחברים את המקורות, מנקים כפילויות ושדות לא עקביים ומשווים את הסכומים בדשבורד לדוחות המקוריים. מספר שלא מתיישב עם מערכת הנהלת החשבונות לא עובר הלאה.',
          art: '/images/howitwork2.webp',
        },
        {
          id: 'dashboard',
          title: 'דשבורד, דוחות והדרכה',
          text: 'בונים את המסכים, מגדירים דוחות והתראות אוטומטיים, ומדריכים את הצוות לקרוא אותם ולשנות אותם. אחרי ההשקה אפשר להוסיף מקורות ומסכים לפי הצורך.',
          art: '/images/howitwork3.webp',
        },
      ],
    },
    banner: {
      heading: 'רוצים לראות את כל מספרי העסק על מסך אחד?',
      action: { label: 'בקשת מיפוי מקורות נתונים', href: '/contact' },
    },
    faqHeading: ['שאלות נפוצות', 'על ניתוח נתונים ודשבורדים'],
    faqEntries: [
      {
        question: 'מה ההבדל בין דשבורד BI ללמידת מכונה?',
        answer:
          'דשבורד מראה מה קרה ומה קורה עכשיו: מכירות לפי חודש, עלות ליד לפי ערוץ, חובות פתוחים. למידת מכונה מנסה לחזות מה יקרה או לסווג רשומות, ומתאימה כשיש הרבה החלטות חוזרות. ברוב העסקים הצעד הראשון והמשתלם הוא דווקא הדשבורד, כי הוא מגלה אילו נתונים קיימים ובאיזו איכות. אם בהמשך יש שאלה שמצדיקה מודל חיזוי, הצינור שנבנה כבר מזין אותו, ואין צורך להתחיל מחדש. את החלק הזה אנחנו מבצעים במסגרת שירות הלמידה המכונה. ההחלטה מה לבנות קודם נקבעת לפי השאלה העסקית הדחופה ביותר שלכם.',
      },
      {
        question: 'לאילו מערכות אפשר לחבר דשבורד?',
        answer:
          'כמעט לכל מערכת שמאפשרת גישה לנתונים: API, ייצוא מתוזמן או גישה למסד הנתונים. בפועל אנחנו מחברים CRM, חנויות Shopify ו-WooCommerce, Google Ads, Meta Ads, GA4, גיליונות Google Sheets ותוכנות הנהלת חשבונות כמו Priority, iCount, חשבונית ירוקה ורייבית. אם למערכת ותיקה אין ממשק, בודקים ייצוא אוטומטי למייל או לתיקייה. בשלב המיפוי מקבלים רשימה ברורה של מה מתחבר ישירות, מה דורש פתרון עוקף ומה כדאי להחליף. אם מערכת מסוימת חשובה לכם במיוחד, מציינים אותה כבר בפנייה הראשונה, ובודקים אותה לפני שמתחייבים לתוכנית עבודה.',
      },
      {
        question: 'מה עדיף, Looker Studio או Power BI?',
        answer:
          'Looker Studio חינמי, נטען בדפדפן ומתחבר בקלות לכלי גוגל, ולכן מתאים לרוב העסקים הקטנים והבינוניים ולצוותי שיווק. Power BI חזק יותר במודלים מורכבים, בחישובים מתקדמים ובשילוב עם סביבת מיקרוסופט, והוא הגיוני בארגונים שכבר עובדים עם Office 365 או עם נפחי נתונים גדולים. אנחנו לא קשורים לכלי אחד, ובמיפוי ממליצים לפי הצוות, התקציב ושאלת הגישה למשתמשים. אפשר גם להתחיל בכלי אחד ולעבור לשני כשהצרכים משתנים, אם הנתונים במאגר נפרד. ההמלצה ניתנת בכתב, עם הנימוקים, ואתם מחליטים אם ללכת איתה או לבחור אחרת.',
      },
      {
        question: 'האם אפשר לקבל דוחות בוואטסאפ?',
        answer:
          'כן. אפשר לשלוח לבעלים או למנהלים סיכום קבוע בשעה שנקבעה, למשל מכירות אתמול, לידים חדשים ועלות ליד, ולהוסיף התראה מיידית כשמדד חורג מהטווח שהוגדר. השליחה נעשית דרך ממשק רשמי של וואטסאפ לעסקים, בהתאם למדיניות התבניות שלו, ובמקביל או במקום זאת אפשר לשלוח מייל עם קובץ PDF או קישור לדשבורד. מה שנשלח, למי ובאיזו תדירות מוגדר איתכם, כדי שההודעות יישארו שימושיות ולא יהפכו לרעש שמתעלמים ממנו. בכל מקרה ההודעות נשלחות רק לנמענים שאישרתם, וניתן להפסיק או לשנות אותן בכל רגע.',
      },
      {
        question: 'מה אם הנתונים שלנו מבולגנים?',
        answer:
          'כמעט תמיד הם כאלה, וזה לא מונע להתחיל. בשלב החיבור בודקים כפילויות, שדות ריקים, שמות מקורות שונים לאותו ערוץ ופערים בין מערכות, ומתקנים כללים שאפשר לאכוף אוטומטית. מה שלא ניתן לתיקון מסומן בדשבורד במקום להיעלם. אנחנו גם ממליצים על שינוי קטן בהזנה, למשל שדה חובה בטופס, כדי שהבעיה לא תחזור. לפני ההשקה משווים סכומים לדוחות המקוריים, כך שאתם יודעים על אילו מספרים אפשר לסמוך. תיקונים כאלה מסתכמים בדרך כלל בשינויי הגדרה קטנים, ולא בהחלפת מערכות או בעבודה ידנית חוזרת בכל חודש.',
      },
      {
        question: 'מה אנחנו מקבלים בסוף הפרויקט?',
        answer:
          'דשבורדים שעובדים ומתעדכנים לבד, חיבורי הנתונים והמאגר אם הוקם, דוחות והתראות מתוזמנים, ומסמך שמגדיר כל מדד: מאיפה הוא מגיע, איך הוא מחושב ומה לא נכלל בו. החשבונות והגישות רשומים על שם העסק. מקבלים גם הדרכה לצוות ושעת שאלות אחרי ההשקה. אחרי ההשקה אפשר להמשיך איתנו לתחזוקה והוספת מסכים, או להפעיל לבד, והחיבורים ייתנו לכם בדיוק אותה יכולת בשני המקרים. ההדרכה כוללת תיעוד קצר בעברית, כדי שגם עובד חדש יוכל להבין איך הדשבורד בנוי ולהמשיך לעבוד איתו בביטחון.',
      },
    ],
  },
  'ai-consulting': {
    id: 'ai-consulting',
    crumb: 'ייעוץ והטמעת AI',
    eyebrow: 'ייעוץ והטמעת AI',
    heading: ['ייעוץ והטמעת AI לעסקים', 'מבדיקת מוכנות ועד שימוש יומיומי בצוות'],
    subhead: 'שירות ייעוץ ה-AI שלנו',
    lede: 'ייעוץ והטמעת AI הוא תהליך שבו ממפים באילו תהליכים בעסק בינה מלאכותית באמת חוסכת זמן, בוחרים כלי ומודל מתאימים (ChatGPT, Claude, Gemini או Copilot), קובעים מדיניות שימוש וכללי אבטחה, מדריכים את הצוות בעברית ומריצים פיילוט שנמדד לפני שמרחיבים אותו לכל החברה.',
    image: '/images/services-view.webp',
    action: { label: 'בקשת בדיקת מוכנות ל-AI', href: '/contact' },
    metaTitle: 'ייעוץ והטמעת AI לעסקים — בדיקת מוכנות, מדיניות והדרכת צוות',
    metaDescription:
      'ייעוץ AI לעסקים בישראל: בדיקת מוכנות, מיפוי תהליכים שבהם AI משתלם, בחירת כלי (ChatGPT, Claude, Gemini, Copilot), מדיניות שימוש ואבטחת מידע, הדרכת צוות בעברית ופיילוט עם מדידת החזר.',
    advantages: {
      eyebrow: 'למה אנחנו',
      heading: ['מה מייחד את ייעוץ ה-AI שלנו'],
      lede: 'אתם מקבלים המלצות שאפשר לפעול לפיהן: רשימת תהליכים מדורגת לפי תועלת, כלי שנבחר אחרי ניסוי על העבודה שלכם, וצוות שיודע להשתמש בו.',
      outro: 'רוצים לדעת איפה AI יחסוך לכם הכי הרבה זמן?',
      action: { label: 'בקשת בדיקת מוכנות ל-AI', href: '/contact' },
      roles: [
        {
          id: 'process-first',
          title: 'קודם התהליך, אחר כך הכלי',
          art: '/images/service-page1.webp',
          text: 'אנחנו לא מתחילים ממודל אופנתי אלא ממה שהצוות עושה בפועל במהלך שבוע: מי מקליד אותו נתון פעמיים, מי עונה על אותן שאלות, איפה מחכים לאישור. רק אחרי המיפוי בוחרים איפה AI נכנס.',
        },
        {
          id: 'no-vendor',
          title: 'המלצה בלי נאמנות לספק',
          art: '/images/service-page2.webp',
          text: 'אנחנו לא מייצגים ספק אחד. ChatGPT, Claude, Gemini ו-Copilot נבדקים על משימות אמיתיות מהעסק, כולל עברית, וההמלצה מגיעה עם נימוק, ולפעמים עם המלצה לא לקנות רישיונות בכלל.',
        },
        {
          id: 'hebrew-training',
          title: 'הדרכה בעברית על העבודה שלכם',
          art: '/images/service-page3.webp',
          text: 'סדנאות שבהן העובדים כותבים הנחיות על המסמכים, המיילים והנתונים של התפקיד שלהם, ולא על דוגמאות כלליות. כל משתתף יוצא עם תבניות עבודה שאפשר להשתמש בהן כבר למחרת.',
        },
        {
          id: 'safe-by-default',
          title: 'אבטחה ופרטיות מההתחלה',
          art: '/images/service-page4.webp',
          text: 'מגדירים מה מותר להעלות לכלי ומה לא, באילו חבילות ארגוניות נשמר מידע ובאילו לא, ומי מאשר שימוש חדש. כך השימוש בצוות לא הופך לחשיפה של מידע על לקוחות.',
        },
      ],
    },
    system: {
      eyebrow: 'מה כולל הייעוץ',
      heading: ['מה מקבלים בליווי AI לעסק'],
      art: '/images/service-cms.webp',
      features: [
        {
          id: 'readiness',
          icon: 'analytics',
          title: 'בדיקת מוכנות ומיפוי תהליכים',
          text: 'סקירת התהליכים, הכלים והנתונים בעסק, ורשימה מדורגת של מקומות שבהם AI משתלם: שירות לקוחות, הצעות מחיר, סיכום פגישות, דוחות, כתיבת תוכן ובקרת מסמכים.',
        },
        {
          id: 'tools',
          icon: 'catalog',
          title: 'בחירת כלים ומודלים',
          text: 'השוואה של ChatGPT Team או Enterprise, Claude, Gemini ו-Copilot מול המשימות שלכם, לפי איכות בעברית, אינטגרציה עם Google Workspace או Microsoft 365, ניהול משתמשים ותנאי פרטיות.',
        },
        {
          id: 'policy',
          icon: 'orders',
          title: 'מדיניות שימוש ב-AI בארגון',
          text: 'מסמך קצר וברור לעובדים: אילו נתונים אסור להזין, מתי נדרשת בדיקה אנושית, איך מציינים תוכן שנוצר ב-AI ומי אחראי על כלי חדש. אפשר להתחיל מהטיוטה בכלי /tools/ai-policy-generator.',
        },
        {
          id: 'training',
          icon: 'club',
          title: 'הדרכות וסדנאות לצוות',
          text: 'סדנאות בעברית לפי תפקיד — מכירות, שירות, כספים, שיווק, הנהלה — עם תרגול על חומרים אמיתיים, מדריך פנימי קצר ומפגש מעקב אחרי כמה שבועות.',
        },
        {
          id: 'pilot',
          icon: 'sales',
          title: 'פיילוט, הטמעה ומדידת החזר',
          text: 'פיילוט עם קבוצה קטנה ומדד אחד לפני ההרחבה: שעות עבודה שנחסכו, זמן תגובה, שיעור טעויות. ההחלטה להרחיב או לעצור מתקבלת על סמך מספרים מהעסק שלכם.',
        },
      ],
      action: { label: 'בקשת בדיקת מוכנות ל-AI', href: '/contact' },
    },
    howItWorks: {
      eyebrow: 'איך זה עובד',
      heading: ['איך מתנהל הליווי. בפשטות.'],
      lede: 'כל שלב נגמר בהחלטה שלכם אם להמשיך, כך שלא משלמים על הטמעה לפני שיודעים שיש לה היגיון עסקי.',
      steps: [
        {
          id: 'audit',
          title: 'בדיקת מוכנות ומיפוי',
          text: 'שיחות עם בעלי תפקידים, סקירת הכלים והנתונים הקיימים, ודוח קצר: באילו שלושה עד חמישה תהליכים כדאי להתחיל, מה הסיכון בכל אחד ומה צריך להסדיר לפני כן.',
          art: '/images/howitwork1.webp',
        },
        {
          id: 'pilot',
          title: 'פיילוט ומדיניות',
          text: 'בוחרים כלי, מגדירים מדיניות שימוש ומריצים פיילוט עם קבוצה קטנה על תהליך אחד, מול מדד שסוכם מראש. אם התוצאה לא מצדיקה את ההמשך, עוצרים כאן.',
          art: '/images/howitwork2.webp',
        },
        {
          id: 'rollout',
          title: 'הטמעה בצוות ומדידה',
          text: 'מרחיבים לשאר הצוות עם הדרכה ותבניות עבודה וממשיכים למדוד. כשכלי מדף לא מספיק, אפשר להמשיך לאוטומציה או לסוכן AI מותאם, בשירותים נפרדים שלנו.',
          art: '/images/howitwork3.webp',
        },
      ],
    },
    banner: {
      heading: 'רוצים להתחיל להשתמש ב-AI בעסק בלי להסתכן ובלי לנחש?',
      action: { label: 'בקשת בדיקת מוכנות ל-AI', href: '/contact' },
    },
    faqHeading: ['שאלות נפוצות', 'על ייעוץ והטמעת AI'],
    faqEntries: [
      {
        question: 'מה ההבדל בין ייעוץ AI לבין בניית סוכן או מערכת AI?',
        answer:
          'ייעוץ עונה על השאלה מה כדאי לעשות: באילו תהליכים AI משתלם, איזה כלי מתאים, אילו כללים נדרשים ואיך מכשירים את הצוות. בנייה של סוכן, מודל חיזוי או אוטומציה היא שלב הביצוע, והיא נעשית בשירותים נפרדים שלנו. ההפרדה חשובה, כי חלק גדול מהערך מגיע מכלי מדף שכבר קיימים, ולפעמים התשובה היא שאין צורך לפתח שום דבר. אם בסוף המיפוי יוצא שכדאי לבנות פתרון מותאם, תקבלו אפיון ראשוני שאפשר לקחת גם לספק אחר. בפועל זה אומר שאתם לא נקשרים אלינו להמשך אם אין בכך צורך.',
      },
      {
        question: 'איך יודעים אם העסק שלנו מוכן להטמעת AI?',
        answer:
          'מוכנות נבחנת בארבעה דברים: האם התהליכים חוזרים ומתועדים, האם הנתונים נגישים ולא פזורים בהודעות וואטסאפ, האם יש אדם אחד שאחראי על הנושא, והאם ההנהלה מוכנה לנסות בקטן. אין צורך במחלקת IT או במאגר נתונים ענק. בבדיקת המוכנות אנחנו מדרגים כל תחום ומציינים מה חסר, ולפעמים ההמלצה הראשונה היא סידור מסמכים או מינוי אחראי לתהליך, ורק אחר כך כלי. תמונה ראשונית אפשר לקבל בלי עלות בכלי /tools/ai-readiness-checker באתר. התוצאה היא תמונה כנה, גם כשהיא אומרת שכדאי לחכות עוד קצת עם ההטמעה.',
      },
      {
        question: 'איזה כלי לבחור: ChatGPT, Claude, Gemini או Copilot?',
        answer:
          'אין כלי אחד שמנצח בכל משימה, והבחירה תלויה בסביבת העבודה ובסוג העבודה. ארגון שחי ב-Microsoft 365 יפיק ערך מ-Copilot, ארגון על Google Workspace מ-Gemini, וצוותים שכותבים ומנתחים הרבה טקסט בעברית כדאי שיבדקו לעומק את ChatGPT ואת Claude. לכן איננו ממליצים לפי דירוגים ברשת, אלא מריצים את אותן חמש עד עשר משימות אמיתיות שלכם על כל כלי ומשווים איכות, מהירות, ניהול משתמשים ותנאי פרטיות. התוצאה היא המלצה מנומקת, ולא פעם שילוב של שני כלים. כך ההחלטה נשענת על ניסוי בעבודה שלכם ולא על הבטחות של ספקים.',
      },
      {
        question: 'האם מדיניות שימוש ב-AI באמת נחוצה?',
        answer:
          'כן, גם בעסק קטן, כי בלעדיה כל עובד מחליט לבד מה להעלות לכלי חיצוני: חוזה, רשימת לקוחות, נתוני שכר. מדיניות טובה קצרה ומעשית, בדרך כלל עמוד או שניים: אילו כלים מאושרים, אילו סוגי מידע אסור להזין, מתי חובה בדיקה אנושית לפני שליחה ללקוח ולמי פונים בספק. היא גם עוזרת כשלקוח עסקי או גוף ציבורי שואל איך אתם משתמשים ב-AI. אנחנו מנסחים אותה יחד איתכם ומתאימים לכלים שנבחרו; חוות דעת משפטית מחייבת תקבלו מעורך דין. בלי מדיניות כתובה, גם עובד זהיר מגיע בקלות למצב שבו מידע של לקוח יוצא מהארגון.',
      },
      {
        question: 'איך מודדים החזר על ההשקעה בהטמעת AI?',
        answer:
          'לפני הפיילוט קובעים מדד אחד ומודדים אותו כפי שהוא היום: כמה זמן לוקחת הצעת מחיר, כמה פניות נענות ביום, כמה טעויות נתפסות בבדיקה. אחרי כמה שבועות משווים לאותו מדד. איננו מסתמכים על תחושות כמו ״זה נוח״, כי הן לא מצדיקות רישיונות. החישוב כולל גם עלויות שקל לשכוח: זמן הבדיקה האנושית, הרישיונות וההדרכה, כדי שלא תקבלו חיסכון שקיים רק על הנייר. אם הפער קטן מדי, נגיד לכם לעצור או לנסות תהליך אחר. המטרה היא שההחלטה על המשך תתקבל לפי מספרים ברורים ולא לפי התלהבות של הרגע.',
      },
      {
        question: 'האם בטוח להזין מידע עסקי ומידע על לקוחות לכלי AI?',
        answer:
          'תלוי בכלי ובחבילה. בחבילות ארגוניות כמו ChatGPT Team או Enterprise, Claude for Work או Gemini בתוך Workspace, הספקים בדרך כלל מתחייבים שלא לאמן את המודלים על המידע שלכם, אבל זה לא המצב בחשבונות חינמיים אישיים. לכן המדיניות מגדירה שימוש בחשבונות ארגוניים בלבד, הסרה או החלפה בקודים של מידע רגיש, ורשימת סוגי מידע שאסור להזין בכלל. בכל הנוגע לתיקון 13 לחוק הגנת הפרטיות אנחנו מתעדים מה מוזן ולאן, ובמקרים רגישים מפנים ליועץ פרטיות. מי שמגיע מהתחום המשפטי או הפיננסי מקבל כללים מחמירים יותר מצוות שיווק.',
      },
    ],
  },
  'voice-agents': {
    id: 'voice-agents',
    crumb: 'סוכני קול וצ׳אטבוט טלפוני',
    eyebrow: 'סוכני קול וצ׳אטבוט טלפוני',
    heading: ['סוכן קולי AI בעברית לעסקים', 'מענה טלפוני חכם שמחובר למערכות שלכם'],
    subhead: 'שירות סוכני הקול שלנו',
    lede: 'סוכן קולי AI בעברית הוא סוכן AI לעסק שעונה לשיחות הטלפון במקום נציג: מענה לשיחות נכנסות, קו אחרי שעות העבודה, קביעת תורים בטלפון, שיחות תזכורת יוצאות וסיכום כל שיחה ישירות ל-CRM. הוא עובד מעל מרכזיית הטלפון הקיימת ומעביר לנציג אנושי ברגע שצריך.',
    image: '/images/services-view.webp',
    action: { label: 'בקשת אפיון לסוכן קולי', href: '/contact' },
    metaTitle: 'סוכן קולי AI בעברית — מענה טלפוני אוטומטי לעסק',
    metaDescription:
      'סוכן קולי AI בעברית לעסק: עונה לשיחות נכנסות, קובע תורים, מזכיר בטלפון ומסכם כל שיחה ל-CRM, עם העברה לנציג. מתחילים באפיון ובבדיקת קול.',
    advantages: {
      eyebrow: 'למה אנחנו',
      heading: ['מה מייחד את סוכני הקול שלנו'],
      lede: 'שיחה טלפונית פחות סלחנית מצ׳אט: אין אפשרות לגלול אחורה, אין זמן לחשוב והמתקשר מצפה לתשובה מיד. לכן אנחנו בודקים את הסוכן על שיחות אמיתיות לפני שמחברים אותו לקו.',
      outro: 'רוצים לשמוע איך סוכן קולי היה עונה ללקוחות שלכם?',
      action: { label: 'בקשת אפיון לסוכן קולי', href: '/contact' },
      roles: [
        {
          id: 'hebrew-quality',
          title: 'בדיקת איכות בעברית לפני השקה',
          art: '/images/service-page1.webp',
          text: 'זיהוי דיבור והקראה בעברית טובים היום, אבל לא מושלמים: שמות, כתובות, מספרים, מבטאים ורעש ברקע מטעים אותם. לפני ההשקה בודקים כמה זיהוי נכשל בשיחות מהסוג שלכם ובוחרים את המנוע המתאים, במקום להבטיח דיוק שאי אפשר לעמוד בו.',
        },
        {
          id: 'handoff',
          title: 'העברה לנציג בלי לאבד את השיחה',
          art: '/images/service-page2.webp',
          text: 'הסוכן יודע מה הוא לא יודע. כשהמתקשר כועס, מבקש אדם או שואל משהו מחוץ לתחום שהוגדר, השיחה עוברת לנציג יחד עם סיכום קצר, כך שאף אחד לא צריך לספר הכול מההתחלה.',
        },
        {
          id: 'telephony',
          title: 'עובד מעל הטלפוניה שכבר יש לכם',
          art: '/images/service-page3.webp',
          text: 'אין צורך להחליף מספר או מרכזייה. הסוכן מתחבר דרך ספק הטלפוניה או המרכזייה הקיימת, למשל Voicenter, 019, מרכזיית PBX או Twilio, ומקבל שיחות מהמספר שהלקוחות כבר מכירים.',
        },
        {
          id: 'records',
          title: 'כל שיחה מתועדת ומסוכמת',
          art: '/images/service-page4.webp',
          text: 'לכל שיחה נשמר סיכום, פרטי המתקשר והפעולה שבוצעה, והם נכנסים אוטומטית לכרטיס הלקוח ב-CRM. אפשר לעבור על שיחות ולתקן את התסריט לפי מה שקרה בפועל.',
        },
      ],
    },
    system: {
      eyebrow: 'מה אפשר לבנות',
      heading: ['מה סוכן קולי עושה בעסק שלכם'],
      art: '/images/service-cms.webp',
      features: [
        {
          id: 'inbound',
          icon: 'orders',
          title: 'מענה לשיחות נכנסות',
          text: 'הסוכן עונה בשנייה הראשונה, מברר מה הלקוח צריך, עונה על שאלות נפוצות מתוך התוכן של העסק ומעביר את מי שצריך לנציג או לצוות המתאים.',
        },
        {
          id: 'after-hours',
          icon: 'club',
          title: 'קו אחרי שעות העבודה',
          text: 'בערב, בשבת ובחגים שיחות לא נשארות בלי מענה: הסוכן אוסף פרטים, מסווג דחיפות ושולח לצוות סיכום מסודר לפתיחת היום.',
        },
        {
          id: 'booking',
          icon: 'catalog',
          title: 'קביעת תורים בטלפון',
          text: 'בדיקת זמינות ביומן, קביעה, שינוי וביטול של תור בשיחה אחת, עם אישור בהודעה ללקוח. מתאים למרפאות, מכוני טיפול, מוסכים וכל עסק שחי מיומן.',
        },
        {
          id: 'outbound',
          icon: 'sales',
          title: 'שיחות תזכורת יוצאות',
          text: 'תזכורת לתור, בקשה לאישור הגעה, מעקב אחרי חשבונית פתוחה או שיחת המשך לליד. השיחה נגמרת בתוצאה ברורה שנרשמת במערכת.',
        },
        {
          id: 'crm',
          icon: 'analytics',
          title: 'סיכומי שיחות ישירות ל-CRM',
          text: 'תמלול, סיכום קצר, כוונת המתקשר והמשימה הבאה נרשמים ברשומה הנכונה, כך שהצוות רואה בדיוק מה סוכם בלי להאזין להקלטות.',
        },
      ],
      action: { label: 'בקשת אפיון לסוכן קולי', href: '/contact' },
    },
    howItWorks: {
      eyebrow: 'איך זה עובד',
      heading: ['איך מתנהל פרויקט. בפשטות.'],
      lede: 'כל שלב נגמר בהחלטה שלכם אם להמשיך, ואף שיחה אמיתית לא מגיעה לסוכן לפני שבדקנו אותו.',
      steps: [
        {
          id: 'scoping',
          title: 'אפיון שיחות ותסריט',
          text: 'עוברים על שיחות אמיתיות, ממפים את הסיבות שבגללן מתקשרים ומגדירים מה הסוכן עושה, מה הוא מעביר לנציג ומה הוא לא עושה בכלל. בסוף השלב מקבלים תסריט כתוב ורשימת חיבורים.',
          art: '/images/howitwork1.webp',
        },
        {
          id: 'pilot',
          title: 'פיילוט ובדיקת איכות',
          text: 'מחברים את הסוכן לקו בדיקה, מריצים עליו שיחות מדומות ושיחות אמיתיות בהיקף מצומצם, ובודקים זיהוי דיבור, זמני תגובה ואחוז ההעברות לנציג. אם האיכות לא מספיקה, מתקנים או עוצרים.',
          art: '/images/howitwork2.webp',
        },
        {
          id: 'launch',
          title: 'השקה וניטור',
          text: 'מעבירים את הקו, או רק את השיחות אחרי שעות העבודה, לסוכן. מנטרים שיחות ומתקנים את התסריט לפי מה שקורה בפועל, וכל שינוי נבדק לפני שהוא עולה לאוויר.',
          art: '/images/howitwork3.webp',
        },
      ],
    },
    banner: {
      heading: 'רוצים שכל שיחה תקבל מענה, גם כשאף אחד לא במשרד?',
      action: { label: 'בקשת אפיון לסוכן קולי', href: '/contact' },
    },
    faqHeading: ['שאלות נפוצות', 'על סוכני קול ובוטים טלפוניים'],
    faqEntries: [
      {
        question: 'מה ההבדל בין סוכן קולי AI בעברית לסוכן AI לעסק בוואטסאפ או בצ׳אט?',
        answer:
          'סוכן AI לעסק יכול לפעול בכמה ערוצים, אבל הערוץ משנה הכול. בצ׳אט הלקוח קורא ומקליד בקצב שלו; בטלפון הוא מצפה לתשובה תוך שבריר שנייה, קוטע באמצע משפט ומדבר מתוך רעש. לכן סוכן קולי AI בעברית צריך זיהוי דיבור, הקראה וניהול תור דיבור, ותסריט קצר יותר מבצ׳אט. סוכני הצ׳אט והוואטסאפ שלנו מתוארים בעמוד סוכני AI, ובפרויקטים רבים שני הערוצים חולקים את אותו מאגר ידע ואותו חיבור ל-CRM. זמן תגובה קצר חשוב כאן יותר מניסוח מפורט, וזה מה שקובע את הארכיטקטורה.',
      },
      {
        question: 'עד כמה סוכן קולי AI בעברית מדויק בשיחה אמיתית?',
        answer:
          'זיהוי הדיבור וההקראה בעברית השתפרו מאוד, אבל הם עדיין פחות מדויקים מאנגלית. הקשיים הנפוצים הם שמות פרטיים ושמות רחובות, מספרי טלפון וזהות, מבטאים שונים, שיחה מהרכב או מהרחוב ומעבר בין עברית למונחים באנגלית. לכן בודקים את המנוע על הקלטות מהעסק, מבקשים אישור חוזר על פרטים קריטיים ומעבירים לנציג כשהזיהוי לא בטוח. לא מבטיחים אחוז דיוק לפני שמודדים: מנוע שלא עומד ברף שסוכם מראש מוחלף, או שתחום הטיפול של הסוכן מצטמצם. כך מתחילים בתחום שבו הסוכן באמת אמין, ומרחיבים רק אחרי שרואים תוצאות.',
      },
      {
        question: 'האם מותר להקליט שיחות עם סוכן קולי?',
        answer:
          'הקלטה ועיבוד של שיחות כוללים מידע אישי, ולכן הנושא כפוף לדיני הגנת הפרטיות והאזנת סתר בישראל. באופן כללי נהוג להודיע למתקשר בתחילת השיחה שהיא מוקלטת ומטופלת בידי מערכת אוטומטית, ולשמור רק מה שנחוץ למטרה שהוגדרה. זה לא ייעוץ משפטי: את נוסח ההודעה, תקופת השמירה והבסיס החוקי כדאי לאשר מול היועץ המשפטי שלכם, ואנחנו מגדירים את המערכת לפי החלטתו. כך הלקוח יודע מה קורה עם השיחה שלו, והעסק מגדיר את ההסכמות והנהלים לפני שהסוכן עונה לשיחה הראשונה. כך הלקוח יודע מה קורה עם השיחה שלו.',
      },
      {
        question: 'האם צריך להחליף מרכזייה או מספר טלפון?',
        answer:
          'בדרך כלל לא. הסוכן מתחבר לטלפוניה הקיימת: אצל ספקים כמו Voicenter ו-019, במרכזיית PBX או בשירות כמו Twilio, אפשר להפנות שיחות אל הסוכן לפי כללים, למשל רק אחרי שעות, רק בעומס או רק למספר מסוים. המספר נשאר אותו מספר, ושיחה שצריכה אדם חוזרת אל התור או אל הנציג הרגיל. בבדיקת ההיתכנות בודקים איזה חיבור הספק שלכם תומך בו לפני שמתחייבים. אם אצלכם יש מרכזייה ישנה, מתכננים חיבור דרך שער SIP או הפניית שיחות, ולא מחליפים את התשתית.',
      },
      {
        question: 'מה קורה כשהסוכן לא מבין או שהלקוח רוצה אדם?',
        answer:
          'זה חלק מהתכנון ולא מקרה קצה. אם הסוכן לא הבין פעמיים ברציפות, אם המתקשר ביקש נציג, או אם השיחה נוגעת לנושא שהוגדר כרגיש, השיחה מועברת לנציג או נרשמת כבקשה לחזרה טלפונית עם סיכום מלא. בשעות שאין נציג זמין הסוכן אומר זאת בכנות ומתחייב רק למה שהעסק באמת יכול לעמוד בו. מנתחים את מקרי ההעברה כדי לשפר את התסריט. כך הלקוח לא נתקע בלולאה, והצוות מקבל את השיחות שבאמת צריכות אדם, כשכבר ידוע מה הלקוח ביקש. כך אף לקוח לא נשאר בלי מענה אנושי כשהוא צריך אחד.',
      },
      {
        question: 'מה אנחנו מקבלים בסוף הפרויקט?',
        answer:
          'סוכן קולי שרץ על הקו שלכם, מחובר ליומן ול-CRM, עם תסריט כתוב שאפשר לעדכן ויומן שיחות שמראה מה נאמר ומה בוצע. בנוסף מקבלים תיעוד של החיבורים לטלפוניה, כללי ההעברה לנציג והגדרות ההקלטה והשמירה. אחרי ההשקה אפשר להמשיך בתחזוקה חודשית, או להעביר את הפעלת המערכת לצוות הפנימי שלכם. התיעוד נכתב בשפה שגם מי שלא טכני יכול לקרוא, כך שאתם לא תלויים בנו כדי להבין מה המערכת עושה. אפשר גם לבקש הדרכה קצרה לצוות על קריאת הסיכומים ועדכון התסריט בעצמו.',
      },
    ],
  },
  'generative-ai': {
    id: 'generative-ai',
    crumb: 'בינה מלאכותית יוצרת',
    eyebrow: 'בינה מלאכותית יוצרת',
    heading: ['בינה מלאכותית יוצרת לתוכן שיווקי', 'תמונות, סרטונים וטקסטים בסגנון של המותג'],
    subhead: 'שירות ה-Generative AI שלנו',
    lede: 'תמונות מוצר ותמונות אווירה, סרטונים קצרים וריילס, וריאציות לקריאייטיב של מודעות, כתיבה בעברית בהיקף גדול, סרטוני אווטאר והקראה וצינור תוכן אוטומטי מהקטלוג — הכול לפי מדריך סגנון של המותג ועם עורך אנושי שמאשר לפני הפרסום.',
    image: '/images/services-view.webp',
    action: { label: 'בקשת הצעה לתוכן AI', href: '/contact' },
    metaTitle: 'יצירת תמונות וסרטונים ב-AI לאתר ולקידום — תוכן שיווקי בעברית',
    metaDescription:
      'שימוש ב-Generative AI ליצירת תוכן שיווקי לעסקים בישראל: תמונות מוצר, סרטונים וריילס, וריאציות למודעות, כתיבה בעברית עם עריכה אנושית, אווטארים והקראה וצינור תוכן אוטומטי מהקטלוג.',
    advantages: {
      eyebrow: 'למה אנחנו',
      heading: ['מה מייחד את עבודת ה-Generative AI שלנו'],
      lede: 'אתם מקבלים הרבה תוכן במהירות, בלי לוותר על הסגנון של המותג ועל האחריות: כללים כתובים מראש, בדיקה אנושית לכל פריט ותיעוד של הכלים והרישיונות שבהם השתמשנו.',
      outro: 'רוצים לראות איך המוצרים שלכם ייראו בתוכן שנוצר ב-AI?',
      action: { label: 'בקשת הצעה לתוכן AI', href: '/contact' },
      roles: [
        {
          id: 'style-guide',
          title: 'מדריך סגנון למכונה',
          art: '/images/service-page1.webp',
          text: 'לפני שמייצרים תוכן כותבים מדריך שהמודל יכול לקרוא: צבעים, תאורה, קומפוזיציה, טון דיבור, מילים שמותר להשתמש בהן ומילים שלא. כך שני עובדים בשני שבועות שונים מקבלים תוצאה שנראית כאילו יצאה מאותה יד.',
        },
        {
          id: 'human-review',
          title: 'עורך אנושי לפני כל פרסום',
          art: '/images/service-page2.webp',
          text: 'בינה מלאכותית טועה: אצבע מיותרת ביד, מוצר שמשנה צורה, משפט עברי שנשמע מתורגם. כל תמונה וכל טקסט עוברים בדיקה של אדם מול רשימת בדיקה קבועה, ורק מה שאושר יוצא לאוויר.',
        },
        {
          id: 'hebrew',
          title: 'עברית טבעית, לא תרגום',
          art: '/images/service-page3.webp',
          text: 'טקסטים בעברית נכתבים ונערכים כך שיישמעו כמו מותג ישראלי: ניסוח בלשון הנכונה, כתיב אחיד, מספרים ופיסוק בכיוון הנכון. מי שמכיר את השוק קורא את הכול לפני שזה מגיע ללקוחות.',
        },
        {
          id: 'rights',
          title: 'זכויות, גילוי ושקיפות',
          art: '/images/service-page4.webp',
          text: 'לכל פרויקט מתועד באילו כלים השתמשנו ומה תנאי השימוש המסחרי שלהם. מסמנים תוכן שנוצר ב-AI כשהדין, הפלטפורמה או הטעם הטוב דורשים, ולא יוצרים דמויות או קולות של אנשים אמיתיים בלי הסכמה כתובה.',
        },
      ],
    },
    system: {
      eyebrow: 'מה אפשר לבנות',
      heading: ['מה Generative AI עושה בשיווק שלכם'],
      art: '/images/service-cms.webp',
      features: [
        {
          id: 'product-images',
          icon: 'catalog',
          title: 'תמונות מוצר ותמונות אווירה',
          text: 'רקע חדש לתמונת סטודיו, מוצר בתוך סצנה, גרסאות לעונות וחגים ותמונות לאתר ולרשתות — על בסיס צילום אמיתי של המוצר, כדי שהצורה, הצבע והלוגו יישארו נאמנים למציאות.',
        },
        {
          id: 'video',
          icon: 'sales',
          title: 'סרטונים קצרים וריילס',
          text: 'הנפשת תמונות מוצר, קליפים של ארבע עד חמש עשרה שניות לריילס, לסטוריז ולמודעות, עם כתוביות בעברית וגרסאות בפורמטים של כל פלטפורמה.',
        },
        {
          id: 'ad-variants',
          icon: 'sales',
          title: 'וריאציות לקריאייטיב של מודעות',
          text: 'כותרות, ניסוחים, תמונות וקטעי וידאו בכמה זוויות מסר, מוכנים לבדיקת A/B בקמפיינים, כדי למצוא מה עובד על הקהל שלכם במקום לנחש.',
        },
        {
          id: 'avatar',
          icon: 'club',
          title: 'אווטאר והקראה',
          text: 'סרטוני הסבר עם מגיש דיגיטלי והקראה בעברית לסרטוני הדרכה, מוצרים ושאלות נפוצות, בלי לשכור אולפן בכל פעם שהטקסט משתנה. עם קול או דמות מורשים בלבד.',
        },
        {
          id: 'pipeline',
          icon: 'orders',
          title: 'צינור תוכן אוטומטי מהקטלוג',
          text: 'מוצר חדש נכנס לקטלוג, ובמערכת נוצרים תמונות, תיאור, כותרת ותגיות. הכול מחכה בתור לאישור של עורך ורק אז מתפרסם בחנות. ככה אלפי פריטים לא הופכים לעבודה ידנית אינסופית.',
        },
      ],
      action: { label: 'בקשת הצעה לתוכן AI', href: '/contact' },
    },
    howItWorks: {
      eyebrow: 'איך זה עובד',
      heading: ['איך מתנהל פרויקט. בפשטות.'],
      lede: 'מתחילים בדוגמה קטנה על המוצרים שלכם, וממשיכים רק אם התוצאה מתאימה למותג.',
      steps: [
        {
          id: 'style',
          title: 'מדריך סגנון ופיילוט',
          text: 'אוספים את חומרי המותג, מגדירים כללים ויוצרים כמה דוגמאות על מוצרים אמיתיים שלכם. בסוף השלב רואים בעיניים איך זה נראה ומחליטים אם הסגנון נכון, בלי התחייבות להמשך.',
          art: '/images/howitwork1.webp',
        },
        {
          id: 'production',
          title: 'הפקה בהיקף',
          text: 'מייצרים את התוכן במנות, עם בדיקה אנושית לכל פריט. מה שנדחה חוזר לתיקון, ומה שאושר נשמר בספריית נכסים מסודרת עם תיעוד הכלים והרישיונות.',
          art: '/images/howitwork2.webp',
        },
        {
          id: 'pipeline',
          title: 'חיבור ושיפור מתמשך',
          text: 'מחברים את התהליך לקטלוג, לחנות ולמערכת הפרסום, ובודקים אילו קריאייטיבים הניבו תוצאות. על סמך זה מעדכנים את מדריך הסגנון ואת ההנחיות למודלים.',
          art: '/images/howitwork3.webp',
        },
      ],
    },
    banner: {
      heading: 'רוצים תוכן שיווקי בהיקף גדול, בלי לאבד את הסגנון של המותג?',
      action: { label: 'בקשת הצעה לתוכן AI', href: '/contact' },
    },
    faqHeading: ['שאלות נפוצות', 'על בינה מלאכותית יוצרת לשיווק'],
    faqEntries: [
      {
        question: 'האם אפשר להשתמש בתמונות שנוצרו ב-AI באופן מסחרי?',
        answer:
          'בדרך כלל כן, אבל זה תלוי בכלי ובתנאי השימוש שלו. חלק מהכלים מתירים שימוש מסחרי רק בחבילה בתשלום, וחלקם מגבילים אותו. בנוסף, ביצירה שנוצרה כולה על ידי מכונה לא תמיד יש זכויות יוצרים מלאות, ולכן קשה להגן עליה מפני העתקה. אנחנו בוחרים כלים עם תנאים מסחריים ברורים, שומרים תיעוד לכל פרויקט ולא משתמשים בדמות או בקול של אדם אמיתי בלי הסכמה. זה לא ייעוץ משפטי, ובמקרים רגישים כדאי לבדוק עם עורך דין. לפני הפרסום אנחנו גם בודקים שהתמונה לא דומה מדי ליצירה מוכרת של אחרים.',
      },
      {
        question: 'האם חייבים לסמן שהתוכן נוצר בבינה מלאכותית?',
        answer:
          'אין כלל אחד שחל על כל מקרה. חלק מהפלטפורמות, כמו רשתות חברתיות ורשתות פרסום, דורשות לסמן תוכן ריאליסטי שנוצר או שונה בבינה מלאכותית, ובאיחוד האירופי נכנסות חובות שקיפות שעשויות לחול גם על עסקים ישראליים שמוכרים שם. מעבר לחובה, יש עניין של אמון: לקוחות מעריכים כנות. אנחנו ממליצים לסמן תמונות של אנשים, סרטוני אווטאר וקולות מסונתזים, ולהגדיר מראש בכל פרויקט מה מסומן ואיפה, לפי הפלטפורמה והקהל שלכם. בכל מקרה מומלץ לשמור את הנחיות היצירה והגרסאות המקוריות, כי הן מוכיחות מי יצר את התוכן ואיך.',
      },
      {
        question: 'איך מונעים מהתוכן להיראות כמו כל תוכן AI אחר?',
        answer:
          'עם חומרי מקור אמיתיים ועם כללים. מתחילים מצילום אמיתי של המוצר ולא מתיאור כתוב, מגדירים מדריך סגנון עם תאורה, צבעים, מרחב וטון, ושומרים דוגמאות מאושרות שמשמשות נקודת התייחסות לכל פריט חדש. בטקסט מוסיפים לשון מותג, עובדות אמיתיות על המוצר ופרטים שרק אתם מכירים. ועורך אנושי פוסל כל מה שנראה גנרי, שטוח או מוזר. התוצאה אינה אוטומטית לגמרי, ולכן היא לא נראית כמו שאר האינטרנט. כך התוצאה נשארת אחידה לאורך חודשים, גם כשעובדים אחרים או כלים חדשים נכנסים לתהליך.',
      },
      {
        question: 'האם הטקסטים בעברית נשמעים טבעיים?',
        answer:
          'כשמשאירים את זה למודל לבד, לא תמיד. לפעמים מתקבל ניסוח שנשמע כמו תרגום, מגדר לא נכון, פיסוק הפוך בטקסט מעורב או מילה שאף ישראלי לא אומר. לכן טקסט בעברית אצלנו נכתב לפי מדריך טון, נבדק ונערך על ידי דובר עברית שמכיר את התחום, ורק אז מועבר לפרסום. בהיקף גדול, כמו אלפי תיאורי מוצר, העורך בודק מדגם גדול מול כללים קבועים, ומתקן את ההנחיות במקום לתקן כל משפט בנפרד. כך שומרים על מהירות וגם על איכות. כשיש ספק לגבי ניסוח, הוא מוכרע לפי מדריך הטון ולא לפי טעם אישי של מי שבודק באותו יום.',
      },
      {
        question: 'מה אנחנו מקבלים בסוף הפרויקט?',
        answer:
          'את התוכן עצמו בפורמטים המתאימים לאתר, לחנות ולרשתות, ספריית נכסים מסודרת ומדריך סגנון כתוב שאפשר להמשיך להשתמש בו. אם נבנה צינור אוטומטי, מקבלים אותו מחובר לקטלוג ולמערכת הפרסום, עם תור אישורים ותיעוד של הכלים ושל תנאי הרישיון. אפשר להשאיר אצלנו את ההפקה השוטפת, או לקבל הדרכה לצוות שלכם ולעבוד לבד. המדריך, ההנחיות והנכסים שייכים לכם, והתהליך לא תלוי בספק אחד. ההדרכה כוללת הסבר על הכלים, על כללי הבדיקה ועל הסימון, כדי שהצוות לא יצטרך אותנו בכל שינוי קטן.',
      },
    ],
  },
  'ai-product-development': {
    id: 'ai-product-development',
    crumb: 'פיתוח מוצרי AI ו-SaaS',
    eyebrow: 'פיתוח מוצרי AI ו-SaaS',
    heading: ['פיתוח מוצרי AI ו-SaaS', 'מרעיון ל-MVP ועד השקה'],
    subhead: 'שירות פיתוח מוצרי ה-AI שלנו',
    lede: 'אפליקציית ווב או מובייל שה-AI הוא ליבת המוצר שלה: בחירת מודלים ו-API, תשתית פרומפטים ובדיקות איכות, שליטה בעלות לכל בקשה, מגבלות שימוש וחיוב, אבטחה ומניעת ניצול לרעה — מהאפיון הראשון ועד השקה, עם קוד ובעלות מלאה שלכם.',
    image: '/images/services-view.webp',
    action: { label: 'בקשת אפיון למוצר', href: '/contact' },
    metaTitle: 'פיתוח מוצרי AI ו-SaaS לסטארטאפים ועסקים — מרעיון ל-MVP',
    metaDescription:
      'פיתוח מוצר מבוסס AI לסטארטאפים ולעסקים בישראל: MVP כאפליקציית ווב או מובייל, בחירת מודלים, בדיקות איכות, שליטה בעלויות, חיוב ומגבלות שימוש, אבטחה והעברת קוד ובעלות מלאה.',
    advantages: {
      eyebrow: 'למה אנחנו',
      heading: ['מה מייחד את פיתוח מוצרי ה-AI שלנו'],
      lede: 'מוצר AI נשבר במקומות שאין בהם דמו: עלות שמטפסת עם כל משתמש, תשובות שמשתנות בין ריצה לריצה ומשתמשים שמנצלים את המערכת. אנחנו בונים את זה מהיום הראשון.',
      outro: 'יש לכם רעיון למוצר ורוצים לדעת מה נדרש כדי להוציא אותו?',
      action: { label: 'בקשת אפיון למוצר', href: '/contact' },
      roles: [
        {
          id: 'mvp',
          title: 'MVP שאפשר להשיק, לא דמו',
          art: '/images/service-page1.webp',
          text: 'קודם מגדירים את הדבר האחד שהמוצר חייב לעשות היטב, ובונים רק אותו: מסך, זרימה ומודל. כך יוצאים לשוק אחרי שבועות ספורים של עבודה ולומדים ממשתמשים אמיתיים לפני שמרחיבים.',
        },
        {
          id: 'evals',
          title: 'בדיקות איכות לפני כל שינוי',
          art: '/images/service-page2.webp',
          text: 'לכל יכולת של ה-AI בונים סט דוגמאות עם תשובה רצויה, כולל מקרי קצה בעברית. כל שינוי בפרומפט או החלפת מודל נבדק מולו, ולכן אפשר לשדרג בלי לגלות את הנזק מהמשתמשים.',
        },
        {
          id: 'unit-cost',
          title: 'עלות לבקשה שנמדדת מההתחלה',
          art: '/images/service-page3.webp',
          text: 'כל קריאה למודל נרשמת עם מספר הטוקנים והעלות שלה, לפי משתמש ולפי יכולת. כך רואים כמה עולה לקוח פעיל, ומחליטים על מודל זול יותר, מטמון או הגבלות לפני שהחשבון מפתיע.',
        },
        {
          id: 'ownership',
          title: 'קוד ו-IP שלכם, בלי נעילה',
          art: '/images/service-page4.webp',
          text: 'הריפו, התשתית והחשבונות רשומים על שמכם מהיום הראשון, והמפתחות אצלכם. בסוף הפרויקט מקבלים תיעוד והדרכה, ואפשר להמשיך עם צוות פנימי, עם ספק אחר או איתנו.',
        },
      ],
    },
    system: {
      eyebrow: 'מה אפשר לבנות',
      heading: ['מה נכלל במוצר AI מוכן לשוק'],
      art: '/images/service-cms.webp',
      features: [
        {
          id: 'product',
          icon: 'catalog',
          title: 'אפליקציית ווב או מובייל',
          text: 'ממשק ושרת שנבנים סביב החוויה שהמשתמש צריך, כולל כניסה, חשבונות וניהול. בוחרים אם להתחיל באתר או באפליקציה לפי המקום שבו הלקוחות שלכם נמצאים.',
        },
        {
          id: 'models',
          icon: 'orders',
          title: 'בחירת מודלים ו-API',
          text: 'משווים כמה ספקי מודלים על הדוגמאות שלכם, מגדירים מודל חלופי למקרה של תקלה או שינוי מחיר, ומפרידים את הקוד מהספק כדי שאפשר יהיה להחליף.',
        },
        {
          id: 'prompts',
          icon: 'analytics',
          title: 'פרומפטים ובדיקות איכות',
          text: 'פרומפטים מנוהלים בגרסאות, עם בדיקות אוטומטיות שרצות על כל שינוי ומדד איכות שמראה אם התשובות השתפרו או הורעו.',
        },
        {
          id: 'billing',
          icon: 'sales',
          title: 'חיוב, חבילות ומגבלות שימוש',
          text: 'תשלום חודשי או לפי שימוש, מכסות לכל משתמש וחבילה, ומעקב צריכה שמונע ממשתמש אחד לצרוך את התקציב של כולם.',
        },
        {
          id: 'security',
          icon: 'club',
          title: 'אבטחה ומניעת ניצול לרעה',
          text: 'הגנה מפני הזרקת פרומפטים, הגבלת קצב, בידוד נתוני לקוחות זה מזה וסינון תוכן, כדי שהמוצר יישאר יציב וחוקי גם כשמשתמשים מנסים לשבור אותו.',
        },
      ],
      action: { label: 'בקשת אפיון למוצר', href: '/contact' },
    },
    howItWorks: {
      eyebrow: 'איך זה עובד',
      heading: ['איך מתנהל פרויקט. בפשטות.'],
      lede: 'כל שלב נגמר בהחלטה שלכם אם להמשיך, כך שלא משקיעים בבנייה לפני שיודעים שהרעיון עומד בבדיקה.',
      steps: [
        {
          id: 'scope',
          title: 'אפיון והוכחת היתכנות',
          text: 'מגדירים משתמש, בעיה ויכולת AI מרכזית, ובונים אב טיפוס שבודק על דוגמאות אמיתיות אם המודל מגיע לאיכות הנדרשת. אם לא, עוצרים לפני שהושקעה בנייה.',
          art: '/images/howitwork1.webp',
        },
        {
          id: 'mvp',
          title: 'בניית MVP והשקה סגורה',
          text: 'בונים את המוצר עם חשבונות, חיוב ומדידת עלויות, ומשיקים לקבוצת משתמשים מצומצמת. עוקבים אחרי שימוש, איכות ועלות לבקשה ומתקנים לפני הפתיחה לכולם.',
          art: '/images/howitwork2.webp',
        },
        {
          id: 'scale',
          title: 'הרחבה והעברת בעלות',
          text: 'פותחים לציבור, מוסיפים מטמון, תורים ומגבלות לפי העומס, ומעבירים קוד, חשבונות ותיעוד. אחר כך אפשר להמשיך לפתח עצמאית או להשאיר אצלנו תחזוקה.',
          art: '/images/howitwork3.webp',
        },
      ],
    },
    banner: {
      heading: 'יש לכם רעיון למוצר AI ורוצים לבדוק אם אפשר להשיק אותו?',
      action: { label: 'בקשת אפיון למוצר', href: '/contact' },
    },
    faqHeading: ['שאלות נפוצות', 'על פיתוח מוצרי AI ו-SaaS'],
    faqEntries: [
      {
        question: 'מה ההבדל בין פיתוח מוצר AI לפיתוח תוכנה רגיל?',
        answer:
          'בתוכנה רגילה אותה פעולה נותנת אותה תוצאה, ובמוצר AI התשובה משתנה, והעלות של כל בקשה משתנה איתה. לכן נוספות שלוש שכבות: בדיקות איכות שמודדות את התשובות, מדידת עלות לכל קריאה ושכבת הגנה מניצול לרעה. את שאר המוצר, כמו חשבונות, ממשק ותשלום, בונים כמו כל מערכת טובה. אם אתם צריכים רק מערכת עסקית בלי מודל בליבה, שירות הפיתוח המותאם שלנו מתאים יותר, ואם צריך סוכן שמבצע משימות, יש לנו שירות נפרד לכך. בפרויקט כזה גם הצוות נבדל: צריך מי שמבין גם במודלים וגם בהפעלת מוצר לאורך זמן.',
      },
      {
        question: 'כמה זמן לוקח להגיע ל-MVP?',
        answer:
          'תלוי בהיקף, אבל MVP ממוקד, עם יכולת AI אחת מרכזית, מסך עיקרי, חשבונות וחיוב בסיסי, בדרך כלל נבנה בשבועות ספורים ולא בחצי שנה. ההבדל נקבע בעיקר לפי מספר היכולות. לכן מתחילים באפיון שמצמצם את המוצר לדבר החשוב ביותר, ומשאירים את שאר הרעיונות לגרסאות הבאות. בסוף האפיון מקבלים לוח זמנים מפורט לכל שלב, ונקודת החלטה אחרי הוכחת ההיתכנות. בפועל זה אומר שכל יכולת חדשה עוברת אפיון קצר של מה נחשב תשובה טובה, וכך מונעים הפתעות אחרי ההשקה.',
      },
      {
        question: 'איך מונעים מעלויות המודל לאכול את הרווח?',
        answer:
          'מודדים כל קריאה לפי משתמש ויכולת, ומחשבים כמה עולה לקוח פעיל לפני שקובעים תמחור. אחר כך מורידים את העלות בכמה דרכים: מודל קטן למשימות פשוטות, מטמון לשאלות חוזרות, קיצור הקשר ומכסות לכל חבילה. מוגדרת גם התראה כשהצריכה חריגה, כדי שלא תגלו על בעיה בחשבונית. כך התמחור נשען על נתונים אמיתיים ולא על הערכה, ואפשר לראות איך כל שינוי משפיע על העלות של לקוח ממוצע. ההחלטות האלה נרשמות במסמך קצר, כך שגם מי שמצטרף לצוות אחר כך מבין למה המוצר בנוי כפי שהוא בנוי.',
      },
      {
        question: 'איך מתמודדים עם אבטחה וניצול לרעה?',
        answer:
          'מצמצמים את מה שהמודל רואה ומורשה לעשות: הוא מקבל רק את הנתונים של המשתמש הנוכחי, ופעולות רגישות עוברות אישור. מוסיפים הגבלת קצב, חסימת קלט זדוני וסינון פלט. נתוני הלקוחות מבודדים זה מזה, והמפתחות נשמרים בצד השרת בלבד, ושימוש חשוד נרשם ביומן. בהתאם לתיקון 13 לחוק הגנת הפרטיות מגדירים מראש אילו נתונים נשמרים ולכמה זמן. זה אינו ייעוץ משפטי, ואם צריך, יועץ פרטיות יכול לבדוק את התוצאה. אנחנו גם בודקים את המוצר מול ניסיונות עקיפה נפוצים לפני השקה, ושבים על הבדיקה בכל שינוי משמעותי.',
      },
      {
        question: 'למי שייכים הקוד והקניין הרוחני?',
        answer:
          'לכם. הקוד, העיצוב, הפרומפטים ובדיקות האיכות שייכים לחברה שלכם, והריפו והחשבונות בענן ובספקי המודלים נפתחים על שמכם מההתחלה. אין נעילה אצלנו: בסוף הפרויקט מקבלים תיעוד והדרכה, ואפשר להעביר את הפיתוח לצוות פנימי. ההסכם קובע זאת בכתב. רכיבי קוד פתוח שומרים על הרישיונות שלהם, ואנחנו מפרטים אותם ברשימה כדי שיהיה ברור במה בדיוק המוצר משתמש, ובכל שאלה על בעלות אפשר לחזור למסמך הזה. אם יש שותפים או משקיעים שמבקשים ראיות לבעלות, אפשר להכין עבורם מסמך מסודר של הרכיבים והרישיונות.',
      },
      {
        question: 'אפשר לבנות את המוצר בלי לקשור אותו לספק מודלים אחד?',
        answer:
          'כן, ואנחנו ממליצים על כך. שכבת ביניים מבודדת את הקוד מהספק, כך שהחלפת מודל היא שינוי הגדרה ולא כתיבה מחדש. סט הבדיקות מראה מיד אם מודל חדש טוב יותר, זול יותר או גרוע יותר על המקרים שלכם. זה מגן מפני העלאת מחירים, הפסקת שירות או מודל חדש שמשתלם יותר, ומאפשר להשתמש בכמה ספקים במקביל לפי סוג המשימה, למשל מודל חזק לניתוח ומודל זול לסיווג פשוט. כך המוצר לא תלוי בהחלטה העסקית של חברה אחת, וגם הניהול של החוזים והעלויות נשאר בידיים שלכם.',
      },
    ],
  },
  'mobile-app-development': {
    id: 'mobile-app-development',
    crumb: 'פיתוח אפליקציות',
    eyebrow: 'פיתוח אפליקציות',
    heading: ['פיתוח אפליקציות לאייפון ולאנדרואיד', 'מ-MVP ועד מוצר שמשרת אלפי משתמשים'],
    subhead: 'שירות פיתוח האפליקציות שלנו',
    lede: 'אפליקציות ל-iOS ולאנדרואיד, נייטיב ב-Swift וב-Kotlin או חוצה פלטפורמות ב-React Native וב-Flutter — אנחנו בוחרים את הטכנולוגיה שהפרויקט צריך. כולל שרת ו-API, התראות פוש, תשלומים, ממשק בעברית מימין לשמאל, פרסום ב-App Store וב-Google Play ותחזוקה אחרי ההשקה.',
    image: '/images/services-view.webp',
    action: { label: 'בקשת אפיון אפליקציה', href: '/contact' },
    metaTitle: 'פיתוח אפליקציות לאייפון ולאנדרואיד — iOS, Android ו-MVP',
    metaDescription:
      'פיתוח אפליקציות לעסקים בישראל: iOS ואנדרואיד, נייטיב או React Native ו-Flutter, שרת ו-API, התראות פוש, תשלומים, ממשק RTL בעברית, פרסום בחנויות ותחזוקה. הקוד שלכם.',
    advantages: {
      eyebrow: 'למה אנחנו',
      heading: ['מה מייחד את פיתוח האפליקציות שלנו'],
      lede: 'אתם מקבלים אפליקציה שעוברת את בדיקת החנויות, עובדת בעברית כמו שצריך, והקוד שלה בבעלותכם — עם טכנולוגיה שנבחרה לפי הצורך ולא לפי מה שנוח לנו.',
      outro: 'רוצים לדעת איזו גישה מתאימה לאפליקציה שלכם?',
      action: { label: 'בקשת אפיון אפליקציה', href: '/contact' },
      roles: [
        {
          id: 'any-stack',
          title: 'הטכנולוגיה נבחרת לפי הפרויקט',
          art: '/images/service-page1.webp',
          text: 'Swift ו-Kotlin כשצריך גישה עמוקה למצלמה, לחיישנים או לביצועים, ו-React Native או Flutter כשרוצים בסיס קוד אחד לשתי הפלטפורמות. אנחנו עובדים בכל שפה וסביבה שהפרויקט דורש, ומסבירים את הפשרות לפני שמתחייבים.',
        },
        {
          id: 'mvp-first',
          title: 'מ-MVP לגרסה שמתרחבת',
          art: '/images/service-page2.webp',
          text: 'מתחילים בגרסה ראשונה סביב פעולה מרכזית אחת, מוציאים אותה למשתמשים אמיתיים ולומדים מהם מה להוסיף. הארכיטקטורה נבנית כך שהמעבר מ-MVP למוצר עם אלפי משתמשים לא מחייב כתיבה מחדש.',
        },
        {
          id: 'hebrew-ui',
          title: 'עברית, RTL ונגישות כבסיס',
          art: '/images/service-page3.webp',
          text: 'ממשק שנבנה מימין לשמאל מההתחלה, עם אייקונים מתהפכים, מקלדת ושדות מותאמים וטקסט מעורב בעברית ובאנגלית. תמיכה בקוראי מסך, בגודל גופן גדול ובניגודיות מספקת נבדקת על מכשירים אמיתיים.',
        },
        {
          id: 'ownership',
          title: 'הקוד שלכם, והחנויות על שמכם',
          art: '/images/service-page4.webp',
          text: 'חשבונות המפתחים ב-Apple וב-Google נפתחים על שם העסק, והקוד נמסר במאגר שבשליטתכם. אין תלות בנו כדי לעדכן, להחליף ספק או להמשיך בעצמכם, ואם תרצו אפשר להשאיר אצלנו את התחזוקה.',
        },
      ],
    },
    system: {
      eyebrow: 'מה אפשר לבנות',
      heading: ['מה נכלל באפליקציה שאנחנו בונים'],
      art: '/images/service-cms.webp',
      features: [
        {
          id: 'commerce',
          icon: 'sales',
          title: 'תשלומים ורכישות באפליקציה',
          text: 'תשלום בכרטיס אשראי דרך סולקים ומעבדי תשלום נפוצים בישראל, ארנקים דיגיטליים ורכישות בתוך האפליקציה לפי כללי Apple ו-Google, עם אישור הזמנה וחשבונית אוטומטית.',
        },
        {
          id: 'orders',
          icon: 'orders',
          title: 'שרת, API ולוח ניהול',
          text: 'צד שרת שמנהל משתמשים, הזמנות ותוכן, ממשק API מתועד ולוח ניהול לצוות שלכם, כדי שאפשר יהיה לעדכן מוצרים, הודעות ומחירים בלי לשחרר גרסה חדשה לחנות.',
        },
        {
          id: 'club',
          icon: 'club',
          title: 'משתמשים, מועדון והתראות פוש',
          text: 'הרשמה והתחברות בטלפון, במייל או דרך חשבון Apple ו-Google, פרופיל ומועדון לקוחות, והתראות פוש לפי פעולות והעדפות — עם בקשת הרשאה שמוצגת ברגע הנכון ולא בפתיחה הראשונה.',
        },
        {
          id: 'catalog',
          icon: 'catalog',
          title: 'עבודה במצב לא מקוון',
          text: 'קטלוג, טפסים ורשימות שנשמרים על המכשיר ומסתנכרנים כשחוזר חיבור, לאפליקציות שפועלות בשטח, במחסן או במקומות עם קליטה חלשה, כולל טיפול בקונפליקטים בין עדכונים.',
        },
        {
          id: 'analytics',
          icon: 'analytics',
          title: 'אנליטיקה ודיווח קריסות',
          text: 'מדידת התקנות, מסכים ופעולות מפתח, דיווח קריסות בזמן אמת ובדיקות A/B, כדי שההחלטות על הגרסה הבאה יתבססו על מה שהמשתמשים עושים בפועל ולא על ניחוש.',
        },
      ],
      action: { label: 'בקשת אפיון אפליקציה', href: '/contact' },
    },
    howItWorks: {
      eyebrow: 'איך זה עובד',
      heading: ['איך מתנהל פרויקט. בפשטות.'],
      lede: 'כל שלב נגמר במשהו שאפשר לראות ולהחזיק ביד, כך שאתם מחליטים אם להמשיך לפי מה שנבנה ולא לפי הבטחות.',
      steps: [
        {
          id: 'scope',
          title: 'אפיון ואב טיפוס',
          text: 'מגדירים את הפעולה המרכזית, את המשתמשים ואת המכשירים הנתמכים, בוחרים טכנולוגיה ומקבלים אב טיפוס לחיץ בטלפון עם מסכים בעברית. בסוף השלב ברור מה נכנס לגרסה הראשונה ומה מחכה.',
          art: '/images/howitwork1.webp',
        },
        {
          id: 'build',
          title: 'פיתוח וגרסאות בדיקה',
          text: 'עובדים במחזורים קצרים ומעבירים גרסה להתקנה בטלפון שלכם דרך TestFlight ובדיקות פנימיות ב-Google Play. כל מחזור כולל בדיקה על מכשירים אמיתיים, באייפון ובאנדרואיד, ובגדלי מסך שונים.',
          art: '/images/howitwork2.webp',
        },
        {
          id: 'launch',
          title: 'פרסום בחנויות ותחזוקה',
          text: 'מכינים את דף האפליקציה, מדיניות הפרטיות והצהרות הנתונים, מגישים לבדיקה ב-App Store וב-Google Play ומטפלים בהערות הסוקרים. אחרי ההשקה מעדכנים לגרסאות מערכת חדשות ומתקנים תקלות.',
          art: '/images/howitwork3.webp',
        },
      ],
    },
    banner: {
      heading: 'יש לכם רעיון לאפליקציה ורוצים לדעת מה נדרש כדי להוציא אותה?',
      action: { label: 'בקשת אפיון אפליקציה', href: '/contact' },
    },
    faqHeading: ['שאלות נפוצות', 'על פיתוח אפליקציות'],
    faqEntries: [
      {
        question: 'נייטיב או חוצה פלטפורמות: מה לבחור?',
        answer:
          'ברוב האפליקציות העסקיות — הזמנות, מועדון לקוחות, טפסים, מעקב — React Native או Flutter נותנים בסיס קוד אחד לאייפון ולאנדרואיד, ולכן פיתוח ותחזוקה מהירים יותר. פיתוח נייטיב ב-Swift וב-Kotlin מתאים כשהאפליקציה נשענת על מצלמה, Bluetooth, חיישנים, גרפיקה כבדה או התנהגות עמוקה של המערכת. אין טכנולוגיה אחת שנכונה תמיד, ואנחנו לא כבולים לאחת: ממפים את הדרישות, מציגים את הפשרות בכתב ובוחרים יחד, לפני שנכתבת שורת קוד. בפרויקטים רבים מתחילים חוצי פלטפורמות ועוברים לרכיבים נייטיב רק במקום שבו באמת צריך.',
      },
      {
        question: 'מה צריך כדי לפרסם ב-App Store וב-Google Play?',
        answer:
          'חשבון מפתחים של Apple ושל Google על שם העסק, דף אפליקציה עם תיאור וצילומי מסך, מדיניות פרטיות והצהרה על איסוף נתונים. אם יש הרשמה, Apple דורשת גם אפשרות למחוק חשבון מתוך האפליקציה, ורכישות דיגיטליות חייבות לעבור דרך מערכת התשלום של החנות. הסקירה של Apple לוקחת בדרך כלל יום עד כמה ימים, והיא נדחית לא פעם בפעם הראשונה. אנחנו מכינים הכול מראש ומטפלים בהערות הסוקרים, כך שהדחייה הראשונה לא עוצרת את ההשקה. את הדחייה הנפוצה ביותר, למשל חשבון בדיקה שחסר לסוקרים, אפשר לתקן ולהגיש מחדש במהירות.',
      },
      {
        question: 'האם האפליקציה תעבוד היטב בעברית?',
        answer:
          'כן, ועברית נבנית בשלב הראשון ולא מוסיפים אותה בסוף. הממשק מתהפך מימין לשמאל, כולל ניווט, חיצים ואנימציות, שדות קלט ומקלדת מתנהגים נכון, ושורות שמערבות עברית עם מספרים, כתובות מייל או שמות באנגלית לא מתבלגנות. נבדקים גם תאריכים, מטבע שקל, גדלי גופן גדולים וקוראי מסך כמו TalkBack ו-VoiceOver. אם צריך שפה נוספת, כמו אנגלית או רוסית, המבנה מאפשר להוסיף אותה בלי לשנות את הקוד. בנוסף נבדקת התאמה לגדלי מסך שונים ולמקלדת בעברית, כדי שהחוויה תהיה אחידה בכל מכשיר ובכל גרסת מערכת נתמכת.',
      },
      {
        question: 'איך מחברים תשלומים והתראות פוש?',
        answer:
          'לתשלום בכרטיס אשראי מחברים סולק או מעבד תשלומים שכבר עובד אתכם, והחיוב עובר דרך השרת ולא נשמר על המכשיר, כך שפרטי הכרטיס לא נשמרים באפליקציה. מכירת תוכן דיגיטלי בתוך האפליקציה כפופה לכללי החנויות. התראות פוש נשלחות דרך שירותי Apple ו-Google ומופעלות לפי אירועים או קמפיינים. חשוב לבקש הרשאה ברגע שמובן למה היא נחוצה, ולתת למשתמש שליטה על סוגי ההודעות, כי משתמש שמבטל התראות כמעט לא חוזר להפעיל אותן. אנחנו מגדירים יחד איזה מידע נשמר בשרת, לכמה זמן ומי רשאי לגשת אליו, וזה נכתב במדיניות הפרטיות של האפליקציה.',
      },
      {
        question: 'מה קורה אחרי ההשקה?',
        answer:
          'אפליקציה היא לא פרויקט שנגמר: כל שנה יוצאות גרסאות חדשות של iOS ואנדרואיד, החנויות משנות דרישות, ושירותי צד שלישי מתעדכנים. אחרי ההשקה אנחנו עוקבים אחרי קריסות ודירוגים, מתקנים תקלות, מעדכנים לגרסאות מערכת ומשחררים שיפורים לפי מה שהאנליטיקה מראה. אפשר לקבל את התחזוקה כמנוי חודשי עם זמני תגובה כתובים, או להעביר אותה לצוות פנימי. בלי תחזוקה אפליקציה בדרך כלל מפסיקה לעמוד בדרישות החנויות תוך שנה או שנתיים. כדאי להחליט מראש מה היקף התחזוקה הצפוי, כדי שלא תופתעו מתקלה ביום שבו יוצאת גרסת מערכת חדשה.',
      },
      {
        question: 'למי שייך הקוד, ומה אנחנו מקבלים בסוף?',
        answer:
          'הקוד, העיצוב וחשבונות המפתחים שייכים לכם. בסוף הפרויקט אתם מקבלים את קוד האפליקציה ואת השרת במאגר בשליטתכם, מסמך שמסביר את המבנה ואיך בונים ומפרסמים גרסה, את קובצי העיצוב ואת הגישה לחשבונות Apple, Google, האנליטיקה והשרת. כך אפשר להחליף ספק, להעסיק מפתח פנימי או להמשיך אצלנו, בלי תלות. כל ספרייה חיצונית שנכנסת לפרויקט מתועדת יחד עם הרישיון שלה, כדי שלא יהיו הפתעות בבדיקת נאותות או במכירה של העסק. אם תרצו, נעביר גם הדרכה קצרה לצוות שלכם על בנייה, פרסום וניהול גרסאות, כך שההמשך יהיה פשוט.',
      },
    ],
  },
  'desktop-app-development': {
    id: 'desktop-app-development',
    crumb: 'פיתוח תוכנה לדסקטופ',
    eyebrow: 'פיתוח תוכנה לדסקטופ',
    heading: ['פיתוח תוכנה לדסקטופ לעסקים', 'ל-Windows, macOS ו-Linux'],
    subhead: 'שירות פיתוח אפליקציות דסקטופ שלנו',
    lede: 'כלים פנימיים לצוות, תוכנה שעובדת גם בלי אינטרנט, חיבור למדפסות, סורקים, משקלים וקופות, התקנה ועדכון אוטומטי, והעברת תוכנות ישנות מ-VB6, Access או .NET ישן לטכנולוגיה מודרנית — בשפה ובמסגרת שהפרויקט צריך, עם קוד שנשאר בבעלותכם.',
    image: '/images/services-view.webp',
    action: { label: 'לקביעת שיחת אפיון', href: '/contact' },
    metaTitle: 'פיתוח תוכנה לדסקטופ — אפליקציות Windows, macOS ו-Linux לעסקים',
    metaDescription:
      'פיתוח תוכנת דסקטופ לעסקים בישראל: כלים פנימיים, עבודה בלי אינטרנט, חיבור למדפסות, סורקים, משקלים וקופות, התקנה ועדכון אוטומטי, חתימת קוד והעברת תוכנות ישנות מ-VB6 ו-Access.',
    advantages: {
      eyebrow: 'למה אנחנו',
      heading: ['מה מייחד את פיתוח הדסקטופ שלנו'],
      lede: 'תוכנת דסקטופ נבחרת כשהעבודה קורית ליד חומרה, בלי רשת יציבה או על מחשב שהצוות פותח כל בוקר. אנחנו בוחרים את הטכנולוגיה לפי הצורך, לא לפי מה שנוח לנו לכתוב.',
      outro: 'יש לכם תוכנה ישנה או רעיון לכלי פנימי?',
      action: { label: 'לקביעת שיחת אפיון', href: '/contact' },
      roles: [
        {
          id: 'stack',
          title: 'הטכנולוגיה נבחרת לפי הפרויקט',
          art: '/images/service-page1.webp',
          text: 'Electron או Tauri כשיש צוות שמכיר ווב, .NET ו-WPF לסביבת Windows ארגונית, C++ ו-Qt כשצריך ביצועים או ממשק לחומרה, Python לכלי עבודה ולנתונים. את הבחירה מנמקים בכתב לפני שמתחילים לבנות.',
        },
        {
          id: 'hardware',
          title: 'חיבור לציוד שכבר עומד אצלכם',
          art: '/images/service-page2.webp',
          text: 'מדפסות תוויות וקבלות, סורקי ברקוד ומסמכים, משקלים, קופות וחיישנים נבדקים על הדגמים האמיתיים שבשטח. אם צריך, ממתינים לציוד ומריצים בדיקות מול המכשיר עצמו ולא מול סימולציה.',
        },
        {
          id: 'offline',
          title: 'עובד גם כשהאינטרנט נופל',
          art: '/images/service-page3.webp',
          text: 'התוכנה שומרת נתונים מקומית וממשיכה לעבוד בלי חיבור, ומסנכרנת לשרת כשהרשת חוזרת. כללי טיפול בהתנגשויות בין עמדות מוגדרים באפיון, כך שאף הזמנה או רשומה לא נעלמות בשקט.',
        },
        {
          id: 'ownership',
          title: 'הקוד והרישיון בבעלותכם',
          art: '/images/service-page4.webp',
          text: 'מקבלים את הקוד, תעודת החתימה על שמכם ותיעוד התקנה ובנייה. אפשר להמשיך איתנו בתחזוקה, לעבור לצוות פנימי או לספק אחר, בלי להיות תלויים בנו כדי להוציא גרסה.',
        },
      ],
    },
    system: {
      eyebrow: 'מה אפשר לבנות',
      heading: ['מה אפשר לבנות לדסקטופ'],
      art: '/images/service-cms.webp',
      features: [
        {
          id: 'internal-tools',
          icon: 'orders',
          title: 'כלים פנימיים לצוות',
          text: 'מערכת להזנת הזמנות, ניהול מלאי, הפקת מסמכים או עבודה מול מסד נתונים, בממשק מהיר שבנוי סביב מה שהעובד עושה כל היום, כולל קיצורי מקלדת ועבודה על כמה מסכים.',
        },
        {
          id: 'devices',
          icon: 'catalog',
          title: 'חיבור למדפסות, סורקים, משקלים וקופות',
          text: 'הדפסת תוויות וקבלות, קריאת ברקוד, קבלת משקל מהמאזניים וחיבור לעמדות קופה, דרך USB, חיבור טורי או רשת, עם טיפול בשגיאות כשהמכשיר מנותק.',
        },
        {
          id: 'offline-sync',
          icon: 'sales',
          title: 'עבודה בלי אינטרנט וסנכרון',
          text: 'מסד נתונים מקומי, תור פעולות שממתין לרשת וסנכרון מול השרת או מערכת הניהול הקיימת, לעסקים עם סניפים, מחסנים, משאיות או אתרי עבודה בלי קליטה יציבה.',
        },
        {
          id: 'migration',
          icon: 'analytics',
          title: 'העברת תוכנה ישנה לטכנולוגיה מודרנית',
          text: 'תוכנות VB6, Access ו-.NET ישן עוברות לגרסה מודרנית או לווב, בהעברת הנתונים ובהרצה מקבילה של שתי המערכות, כך שהעבודה השוטפת לא נעצרת ביום המעבר.',
        },
        {
          id: 'distribution',
          icon: 'club',
          title: 'התקנה, עדכונים ורישוי',
          text: 'חבילת התקנה, עדכון אוטומטי בלי להפריע למשתמש, חתימת קוד שמונעת אזהרות של Windows ושל macOS, ורישוי לפי עמדה או לקוח כשהתוכנה נמכרת הלאה.',
        },
      ],
      action: { label: 'לקביעת שיחת אפיון', href: '/contact' },
    },
    howItWorks: {
      eyebrow: 'איך זה עובד',
      heading: ['איך מתנהל פרויקט. בפשטות.'],
      lede: 'כל שלב נגמר במשהו שאפשר להפעיל ולבדוק על מחשב אמיתי, כך שרואים התקדמות לפני שממשיכים.',
      steps: [
        {
          id: 'scoping',
          title: 'אפיון ובחירת טכנולוגיה',
          text: 'מתעדים מי משתמש בתוכנה, על איזה מחשבים וציוד, מה חייב לעבוד בלי רשת ואילו נתונים קיימים כבר. בסוף השלב מקבלים אפיון כתוב, בחירת טכנולוגיה מנומקת ותוכנית אבני דרך.',
          art: '/images/howitwork1.webp',
        },
        {
          id: 'build',
          title: 'פיתוח וגרסאות לבדיקה',
          text: 'מקבלים גרסה ניתנת להתקנה בכל אבן דרך ובודקים אותה בעמדה אמיתית, עם הציוד האמיתי. התיקונים נכנסים לגרסה הבאה, והתוכנה נבדקת על גרסאות מערכת ההפעלה שבשימוש אצלכם.',
          art: '/images/howitwork2.webp',
        },
        {
          id: 'rollout',
          title: 'הטמעה, עדכונים ותחזוקה',
          text: 'מתקינים בעמדות, מעבירים נתונים מהמערכת הישנה, מגדירים עדכון אוטומטי וחתימת קוד ומדריכים את המשתמשים. אחרי ההשקה אפשר להמשיך בתחזוקה חודשית או לקבל הדרכה ולהפעיל לבד.',
          art: '/images/howitwork3.webp',
        },
      ],
    },
    banner: {
      heading: 'רוצים תוכנת דסקטופ שעובדת עם הציוד והתהליך שלכם?',
      action: { label: 'לקביעת שיחת אפיון', href: '/contact' },
    },
    faqHeading: ['שאלות נפוצות', 'על פיתוח תוכנה לדסקטופ'],
    faqEntries: [
      {
        question: 'מתי עדיף תוכנת דסקטופ ולא אתר או אפליקציית ווב?',
        answer:
          'דסקטופ מתאים כשהתוכנה צריכה לדבר עם חומרה כמו מדפסת, סורק או משקל, כשצריך לעבוד בלי אינטרנט יציב, כשמעבדים קבצים גדולים מקומית או כשהצוות עובד כל היום באותו כלי ורוצה מהירות וקיצורי מקלדת. אם כל המשתמשים מחוברים לרשת ואין חומרה מיוחדת, ווב בדרך כלל פשוט וזול יותר לתחזוקה, כי אין מה להתקין בכל עמדה. בשיחת האפיון אנחנו אומרים בכנות איזה מהשניים מתאים לכם, ולפעמים הפתרון הנכון הוא שילוב של שניהם. ההחלטה מתקבלת על סמך הצרכים שלכם ולא על סמך מה שנוח לנו לבנות.',
      },
      {
        question: 'באיזו טכנולוגיה תפתחו את התוכנה?',
        answer:
          'לפי הפרויקט. Electron או Tauri מתאימים כשרוצים ממשק מודרני וקוד אחד לכמה מערכות הפעלה. .NET ו-WPF מתאימים לארגון שעובד על Windows ומשתמש ב-Active Directory ובכלי מיקרוסופט. C++ ו-Qt נבחרים כשצריך ביצועים גבוהים או חיבור עמוק לחומרה, ו-Python מתאים לכלי עבודה, עיבוד נתונים ואוטומציה. אם יש לכם צוות שיתחזק את הקוד אחרי הפרויקט, ניקח בחשבון גם את מה שהוא מכיר. את ההמלצה נותנים בכתב, עם הנימוק. כך לא נתקעים עם כלי שהיום נראה מודרני ובעוד שנתיים אף אחד לא יודע לתחזק.',
      },
      {
        question: 'האם אפשר להעביר תוכנה ישנה של VB6, Access או .NET ישן?',
        answer:
          'כן, וזה אחד הפרויקטים הנפוצים אצל עסקים שהתוכנה שלהם עובדת שנים ואף אחד כבר לא מעז לגעת בה. מתחילים בסקירה של מה שהתוכנה עושה בפועל, כולל כללים שלא תועדו אף פעם, ואז בוחרים בין שכתוב מלא, העברה הדרגתית לפי מודולים או מעבר לווב. הנתונים עוברים למסד מודרני, והמערכת החדשה רצה במקביל לישנה תקופה מוגדרת, כדי שאפשר יהיה להשוות תוצאות ולחזור אחורה אם צריך. כך ההפסקה בעבודה השוטפת קטנה ככל האפשר. בכל מקרה לא מוחקים את המערכת הישנה לפני שהחדשה הוכיחה את עצמה בעבודה אמיתית.',
      },
      {
        question: 'איך מחברים מדפסות, סורקים, משקלים וקופות?',
        answer:
          'תלוי במכשיר. חלקם נחשפים כמדפסת רגילה של מערכת ההפעלה, חלקם מדברים בפרוטוקול טורי, USB או רשת, ולחלקם יש ספריית יצרן. בשלב האפיון מבקשים את הדגמים המדויקים ואת תיעוד היצרן, ובודקים על מכשיר אמיתי ולא על סימולציה. התוכנה מטפלת במקרים של מכשיר מנותק, נייר שנגמר או קריאה שגויה, ומציגה למשתמש הודעה ברורה במקום להיתקע. אם הדגם שלכם נדיר, נברר מראש אם יש דרך מהימנה לחבר אותו. ככה יודעים כבר בהתחלה מה אפשרי ומה לא, לפני שמשקיעים בפיתוח.',
      },
      {
        question: 'איך מפיצים את התוכנה ואיך היא מתעדכנת?',
        answer:
          'התוכנה נארזת בקובץ התקנה לכל מערכת הפעלה, בחתימת קוד על שמכם כדי ש-Windows ו-macOS לא יציגו אזהרה מפחידה בהפעלה. מנגנון עדכון אוטומטי בודק גרסה חדשה, מוריד אותה ברקע ומתקין בזמן שנוח למשתמש, עם אפשרות לחזור לגרסה קודמת אם משהו לא עובד. בארגון עם הרבה עמדות אפשר לפרוס גרסאות בשלבים, קודם לקבוצת בדיקה ורק אחר כך לכולם. אם התוכנה נמכרת ללקוחות, אפשר להוסיף גם רישוי. מי שרוצה גם יכול לקבל את קוד ההתקנה והעדכון כדי להפעיל אותם בעצמו.',
      },
      {
        question: 'מי הבעלים של הקוד ומה קורה אחרי ההשקה?',
        answer:
          'הקוד, הרישיון ותעודת החתימה שייכים לכם. בסוף הפרויקט מקבלים את המאגר המלא, הוראות בנייה והתקנה ותיעוד של חיבורי החומרה, כדי שכל מפתח מוסמך יוכל להמשיך. אחרי ההשקה יש שלוש אפשרויות: תחזוקה חודשית אצלנו עם תיקונים ועדכוני מערכת הפעלה, שעות פיתוח לפי צורך לפיצ׳רים חדשים, או העברה מלאה לצוות שלכם עם הדרכה. אין התחייבות להישאר איתנו, ואפשר לעבור בין האפשרויות לאורך הזמן. המסמכים האלה נמסרים בסוף כל אבן דרך ולא רק בסוף הפרויקט, כך שתמיד יש לכם בידיים את כל מה שצריך כדי להמשיך.',
      },
    ],
  },
  'devops-cloud': {
    id: 'devops-cloud',
    crumb: 'DevOps וענן',
    eyebrow: 'DevOps וענן',
    heading: ['DevOps וענן לעסקים וסטארטאפים', 'תשתית יציבה, פריסות בלי דרמה'],
    subhead: 'שירות ה-DevOps והענן שלנו',
    lede: 'צינורות CI/CD, Docker ו-Kubernetes, תשתית כקוד עם Terraform, ניטור והתראות, גיבויים ותוכנית התאוששות מאסון, הקשחת אבטחה, הוזלת חשבון הענן והגירה מאחסון משותף או VPS ל-AWS, GCP, Azure או Hetzner — לכל שפה וכל סטאק.',
    image: '/images/services-view.webp',
    action: { label: 'בקשת סקירת תשתית', href: '/contact' },
    metaTitle: 'שירותי DevOps וענן לעסקים — CI/CD, Kubernetes, גיבויים וניטור',
    metaDescription:
      'שירותי DevOps וענן לעסקים וסטארטאפים בישראל: צינורות CI/CD, Docker ו-Kubernetes, Terraform, ניטור והתראות, גיבויים והתאוששות מאסון, הקשחת אבטחה, הוזלת עלויות והגירה לענן. מתחילים בסקירת תשתית.',
    advantages: {
      eyebrow: 'למה אנחנו',
      heading: ['מה מייחד את עבודת ה-DevOps שלנו'],
      lede: 'תשתית טובה היא כזו שלא מרגישים בה: פריסה היא כפתור אחד, תקלה מגיעה אליכם כהתראה ולא כשיחת טלפון מלקוח, וכל מה שהוקם מתועד ושייך לכם.',
      outro: 'רוצים לדעת מה יקרה לשירות שלכם ביום שהשרת נופל?',
      action: { label: 'בקשת סקירת תשתית', href: '/contact' },
      roles: [
        {
          id: 'review',
          title: 'קודם סקירה, אחר כך שינוי',
          art: '/images/service-page1.webp',
          text: 'לפני שנוגעים בשרת ממפים מה רץ ואיפה, מי יכול להיכנס, מה מגובה ומתי נבדקה השחזור האחרון. מקבלים רשימה מסודרת לפי סיכון, וביחד מחליטים מה דחוף ומה יכול לחכות.',
        },
        {
          id: 'as-code',
          title: 'הכול ככתוב, שום דבר ביד',
          art: '/images/service-page2.webp',
          text: 'שרתים, רשתות והרשאות מוגדרים בקוד ושמורים במאגר שלכם, כך שאפשר לשחזר סביבה שלמה מאפס, לבדוק שינוי לפני שמפעילים אותו ולדעת מי שינה מה ומתי.',
        },
        {
          id: 'any-stack',
          title: 'כל שפה, כל סטאק',
          art: '/images/service-page3.webp',
          text: 'Node, Python, PHP, Java, .NET או Go, מסד נתונים אחד או כמה — אנחנו מתאימים את התשתית לאפליקציה שיש לכם, ולא מכריחים אתכם לכתוב אותה מחדש כדי להיכנס לתבנית.',
        },
        {
          id: 'handover',
          title: 'שקיפות ובעלות מלאה',
          art: '/images/service-page4.webp',
          text: 'החשבונות בענן רשומים על שמכם, הסיסמאות אצלכם, והתיעוד כולל הוראות הפעלה ושחזור. אפשר להמשיך איתנו, להעביר לצוות הפנימי או לעבוד במודל משולב — בלי נעילה.',
        },
      ],
    },
    system: {
      eyebrow: 'מה אפשר לבנות',
      heading: ['מה כולל שירות DevOps וענן'],
      art: '/images/service-cms.webp',
      features: [
        {
          id: 'pipelines',
          icon: 'orders',
          title: 'CI/CD וקונטיינרים',
          text: 'בדיקות אוטומטיות, בנייה ופריסה בכל דחיפת קוד, עם Docker, GitHub Actions או GitLab CI, סביבת בדיקות נפרדת וחזרה לגרסה קודמת בלחיצה כשמשהו משתבש.',
        },
        {
          id: 'cloud',
          icon: 'catalog',
          title: 'ענן, Kubernetes ותשתית כקוד',
          text: 'הקמה והגירה ל-AWS, GCP, Azure או Hetzner, עם Terraform ו-Kubernetes כשהם באמת נחוצים — ועם שרת אחד מסודר כשזה מספיק.',
        },
        {
          id: 'monitoring',
          icon: 'analytics',
          title: 'ניטור, לוגים והתראות',
          text: 'מדדי שרת ואפליקציה, בדיקות זמינות, לוגים מרוכזים והתראות לוואטסאפ, סלאק או מייל לפי חומרה, כדי לגלות תקלה לפני הלקוחות ולדעת איפה לחפש אותה.',
        },
        {
          id: 'backup',
          icon: 'club',
          title: 'גיבויים, התאוששות והקשחת אבטחה',
          text: 'גיבויים אוטומטיים מחוץ לשרת עם שחזור שנבדק בפועל, תוכנית התאוששות מאסון עם יעדי זמן מוגדרים, וחיזוק גישות, חומות אש, סודות ועדכוני אבטחה.',
        },
        {
          id: 'cost',
          icon: 'sales',
          title: 'הוזלת חשבון הענן',
          text: 'איתור משאבים שנשכחו, שרתים גדולים מדי וכפל שירותים, התאמת סוג התשתית לעומס האמיתי ותצוגת עלויות לפי סביבה, כדי שהחשבון החודשי יהיה מספר שמבינים ולא הפתעה.',
        },
      ],
      action: { label: 'בקשת סקירת תשתית', href: '/contact' },
    },
    howItWorks: {
      eyebrow: 'איך זה עובד',
      heading: ['איך מתנהל פרויקט. בפשטות.'],
      lede: 'כל שלב נגמר במסמך ובהחלטה שלכם, וההגירות מתבצעות כך שהאתר או האפליקציה ממשיכים לעבוד לאורך כל הדרך.',
      steps: [
        {
          id: 'audit',
          title: 'סקירת תשתית ותוכנית',
          text: 'מקבלים גישת קריאה, ממפים שרתים, מסדי נתונים, דומיינים, גיבויים והרשאות, ומגישים דוח: מה תקין, מה מסוכן ומה יקר מדי, יחד עם תוכנית עבודה לפי סדר עדיפויות.',
          art: '/images/howitwork1.webp',
        },
        {
          id: 'build',
          title: 'הקמה והגירה',
          text: 'מקימים את הסביבה החדשה בקוד, מריצים אותה במקביל לישנה, בודקים ביצועים ושחזור, ורק אז מעבירים את התנועה בחלון זמן מתואם, כשהדרך חזרה פתוחה.',
          art: '/images/howitwork2.webp',
        },
        {
          id: 'operate',
          title: 'ניטור ותמיכה שוטפת',
          text: 'אחרי המעבר אפשר להשאיר אצלנו את הניטור, העדכונים והתגובה לתקלות לפי רמת שירות מוסכמת בכתב, או לקבל הדרכה וליטול את התפעול לצוות שלכם.',
          art: '/images/howitwork3.webp',
        },
      ],
    },
    banner: {
      heading: 'רוצים תשתית שאפשר לסמוך עליה גם כשאף אחד לא מסתכל?',
      action: { label: 'בקשת סקירת תשתית', href: '/contact' },
    },
    faqHeading: ['שאלות נפוצות', 'על DevOps וענן'],
    faqEntries: [
      {
        question: 'האם עסק קטן או סטארטאפ צעיר באמת צריך DevOps?',
        answer:
          'לרוב לא צריך צוות שלם, אבל כן צריך את היסודות: פריסה אוטומטית, גיבוי שנבדק וניטור שמתריע. בלעדיהם כל עדכון הוא סיכון, וכל תקלה מתגלה מהלקוחות. לכן אנחנו מתחילים בסקירה קצרה ומציעים את המינימום ההגיוני לשלב שבו אתם נמצאים. ברוב המקרים זה שרת אחד מסודר או שירות מנוהל בענן, ולא קלאסטר. כשהעומס והצוות גדלים, אפשר להרחיב את אותה תשתית בלי להתחיל מחדש. אין צורך להתחייב מראש לחבילה גדולה: מתחילים בצעד קטן שמראה ערך, ובוחנים אחריו אם להמשיך.',
      },
      {
        question: 'צריך Kubernetes, או שמספיק Docker על שרת אחד?',
        answer:
          'לשירות בודד או לכמה שירותים קטנים, Docker Compose על שרת אחד או שירות קונטיינרים מנוהל מספיקים לרוב, והם פשוטים יותר לתפעול וזולים יותר. Kubernetes מתחיל להצדיק את עצמו כשיש הרבה שירותים, צורך בהרחבה אוטומטית לפי עומס, כמה צוותים שפורסים במקביל או דרישת זמינות גבוהה. אנחנו ממליצים על הכלי הפשוט ביותר שעונה על הצורך, אומרים במפורש מתי לא כדאי להעמיד קלאסטר, ובונים כך שאפשר לעבור אליו מאוחר יותר. בסקירה אנחנו מראים בכתב אילו חלקים בתשתית באמת מצדיקים את המורכבות ואילו עדיף להשאיר פשוטים, כדי שלא תשלמו על כלים שהצוות שלכם לא צריך ולא יתחזק.',
      },
      {
        question: 'איך מעבירים אתר או מערכת מאחסון משותף או VPS לענן בלי השבתה?',
        answer:
          'בונים את הסביבה החדשה במקביל, מעתיקים נתונים וקבצים, ומריצים אותה בכתובת בדיקה עד שהכול נבדק. לפני המעבר מורידים את זמן התפוגה של רשומות ה-DNS, ובחלון זמן שקט מסנכרנים את השינויים האחרונים ומפנים את התנועה. השרת הישן נשאר פעיל כמה ימים כגיבוי, כך שאפשר לחזור אחורה בדקות. מסדי נתונים גדולים מועברים בשכפול מתמשך, והדומיין, הדוא״ל והאישורים נבדקים מראש כדי שלא יישברו בדרך. לפני המעבר כותבים תוכנית חזרה מסודרת, כדי שכל אחד מהשלבים יהיה הפיך ושהצוות יידע בדיוק מה עושים אם משהו לא עובד כמצופה.',
      },
      {
        question: 'איך מצמצמים את חשבון הענן?',
        answer:
          'מתחילים במדידה: מפרקים את החשבון לפי שירות וסביבה ומוצאים מה משלמים עליו בלי להשתמש. בדרך כלל מגלים שרתים שנשארו מפרויקט ישן, דיסקים ללא שרת, שרתים גדולים מהעומס שלהם, סביבות בדיקה שרצות בלילות וסופי שבוע, והעברת נתונים יקרה בין אזורים. אחרי הניקוי בוחנים התחייבות לטווח ארוך, מעבר לספק זול יותר כמו Hetzner כשזה מתאים, והתראות על חריגה בתקציב. כך החשבון נשאר צפוי גם כשהשימוש גדל. בסוף הניקוי מקבלים דוח קצר שמסביר כל שינוי, את ההשפעה שלו על הביצועים ואת מה שנשאר פתוח, כדי שתוכלו לשמור על החיסכון לאורך זמן.',
      },
      {
        question: 'מה קורה אם משהו נופל באמצע הלילה?',
        answer:
          'זה תלוי ברמת השירות שתבחרו. במודל הבסיסי הניטור שולח התראה לצוות שלכם ואנחנו מטפלים בתקלה בשעות העבודה לפי זמני תגובה שנקבעו בכתב. במודל מורחב אפשר להגדיר כוננות מחוץ לשעות, עם התראה בעדיפות גבוהה ותגובה מהירה יותר. בשני המקרים יש מדריך תקלות כתוב וגיבוי שנבדק, כך שגם מי שאינו מומחה יודע מה לעשות. את זמני התגובה ותנאי הכוננות מגדירים מראש ובכתב, לפי מה שהעסק שלכם באמת צריך. אם העסק שלכם תלוי בשירות פעיל כל הזמן, אפשר גם להוסיף זמינות כפולה, כך שתקלה בשרת אחד לא תפיל את השירות כולו.',
      },
      {
        question: 'מה מקבלים בסוף, ושל מי החשבונות והקוד?',
        answer:
          'הכול שלכם. חשבונות הענן והדומיינים נרשמים על שמכם, ואנחנו עובדים דרך הרשאות שאפשר לבטל בכל רגע. מקבלים את קוד התשתית במאגר שלכם, את הגדרות הצינורות והניטור, ומסמך הפעלה שמסביר איך פורסים, איך משחזרים גיבוי ואיך מגיבים להתראה. אין נעילה: אם תחליטו לעבוד עם גורם אחר או להעביר את התפעול לצוות פנימי, תוכלו לעשות זאת עם מה שכבר בידיכם, ואנחנו נעביר את הידע בפגישת מסירה. אם יש לכם כבר צוות פיתוח, אנחנו משתלבים בתהליך העבודה שלו ולא מחליפים אותו, ומשאירים אחרינו הכול מתועד וקריא.',
      },
    ],
  },
  'ai-website-integration': {
    id: 'ai-website-integration',
    crumb: 'שילוב AI באתר',
    eyebrow: 'שילוב AI באתר',
    heading: ['צ׳אט בוט AI לאתר ושילוב בינה מלאכותית', 'יכולות AI שעובדות בתוך האתר שכבר יש לכם'],
    subhead: 'שירות שילוב ה-AI שלנו',
    lede: 'צ׳אט בוט AI לאתר שעונה מתוך תוכן האתר שלכם, ולצדו חיפוש חכם, המלצות והתאמה אישית, כתיבת תיאורי מוצרים ועריכת תמונות מתוך מערכת הניהול, תרגום ולוקליזציה ודירוג לידים. מוסיפים לאתר או לאפליקציה קיימים או חדשים, על כל פלטפורמה, עם עברית מלאה ושליטה בעלויות.',
    image: '/images/services-view.webp',
    action: { label: 'בקשת בדיקת התאמה', href: '/contact' },
    metaTitle: 'צ׳אט בוט AI לאתר — עוזר חכם שעונה מתוך תוכן האתר',
    metaDescription:
      'צ׳אט בוט AI לאתר: עונה ללקוחות בעברית מתוך תוכן האתר שלכם, מסנן לידים ומעביר לנציג. מחובר ל-OpenAI, Claude ו-Gemini, על כל פלטפורמה.',
    advantages: {
      eyebrow: 'למה אנחנו',
      heading: ['מה מייחד את שילוב ה-AI שלנו'],
      lede: 'לא מדביקים באתר ווידג׳ט גנרי. כל יכולת נבנית סביב מטרה עסקית אחת, מחוברת לתוכן ולנתונים של האתר, ומגיעה עם מגבלות כתובות ותקרת עלות.',
      outro: 'רוצים לדעת איזו יכולת AI תתאים לאתר שלכם?',
      action: { label: 'בקשת בדיקת התאמה', href: '/contact' },
      roles: [
        {
          id: 'any-platform',
          title: 'עובד על כל פלטפורמה',
          art: '/images/service-page1.webp',
          text: 'וורדפרס, שופיפיי, ווקומרס, ויקס דרך הטמעה, אתר בקוד מותאם או אפליקציה — היכולת מתחברת דרך תוסף, API או סקריפט הטמעה, ואין צורך לבנות את האתר מחדש.',
        },
        {
          id: 'own-content',
          title: 'תשובות מתוך התוכן שלכם',
          art: '/images/service-page2.webp',
          text: 'העוזר עונה רק על סמך עמודי האתר, הקטלוג ומסמכים שאישרתם. כשאין לו תשובה הוא אומר זאת ומעביר את הפונה לאדם, במקום להמציא מחיר או תנאי.',
        },
        {
          id: 'hebrew',
          title: 'עברית אמיתית ו-RTL',
          art: '/images/service-page3.webp',
          text: 'נבדק בעברית כתובה כפי שלקוחות כותבים אותה — שגיאות כתיב, סלנג, מעבר לאנגלית באמצע משפט — והממשק נבנה מימין לשמאל מההתחלה, כולל חלון הצ׳אט וההצעות.',
        },
        {
          id: 'cost-control',
          title: 'עלות צפויה ופרטיות',
          art: '/images/service-page4.webp',
          text: 'מגבלת שימוש לכל מבקר, מטמון לשאלות חוזרות ובחירת המודל הזול שמספיק למשימה. מידע אישי לא נשלח אם אין בו צורך, בהתאם לעקרונות תיקון 13 לחוק הגנת הפרטיות.',
        },
      ],
    },
    system: {
      eyebrow: 'מה אפשר לבנות',
      heading: ['מה אפשר להוסיף לאתר עם AI'],
      art: '/images/service-cms.webp',
      features: [
        {
          id: 'assistant',
          icon: 'sales',
          title: 'עוזר צ׳אט ודירוג לידים',
          text: 'צ׳אט באתר שעונה מתוך התוכן שלכם, שואל שאלות הבהרה, מסנן פניות לפי כוונת רכישה ומעביר לצוות ליד מסודר עם כל פרטי השיחה.',
        },
        {
          id: 'search',
          icon: 'catalog',
          title: 'חיפוש חכם באתר',
          text: 'חיפוש שמבין משמעות ולא רק מילים, מוצא מוצר גם כשכתבו אותו אחרת, מתמודד עם שגיאות כתיב בעברית ומחזיר תוצאות מדורגות לפי הרלוונטיות.',
        },
        {
          id: 'personalization',
          icon: 'club',
          title: 'המלצות והתאמה אישית',
          text: 'מוצרים משלימים, תוכן לפי מה שהמבקר כבר ראה והודעות שמותאמות לשלב שבו הוא נמצא, נמדדים בניסוי מול גרסה בלי התאמה.',
        },
        {
          id: 'content',
          icon: 'orders',
          title: 'תוכן, תמונות ותרגום במערכת הניהול',
          text: 'כפתור במערכת הניהול שמנסח תיאור מוצר, מתרגם דף, יוצר וריאציות של תמונה או מסיר רקע לקטלוג — והעורך מאשר לפני שהתוכן עולה לאתר.',
        },
        {
          id: 'insights',
          icon: 'analytics',
          title: 'שאלות מבקרים, קול ומדידה',
          text: 'דוח על מה מבקרים שואלים ולא מוצאים, תמלול ושאלות בקול באפליקציה, ומדידה של מה שהשתפר אחרי שילוב ה-AI.',
        },
      ],
      action: { label: 'בקשת בדיקת התאמה', href: '/contact' },
    },
    howItWorks: {
      eyebrow: 'איך זה עובד',
      heading: ['איך מתנהל פרויקט. בפשטות.'],
      lede: 'מתחילים ביכולת אחת שמחוברת לאתר החי, מודדים, ורק אז מרחיבים.',
      steps: [
        {
          id: 'scope',
          title: 'בחירת היכולת והמקורות',
          text: 'בוחרים יכולת אחת עם ערך ברור, מגדירים מה העוזר רשאי לענות ומה אסור לו, ומאפיינים אילו תכנים ונתונים מתחברים אליו ואילו נשארים מחוץ לתחום.',
          art: '/images/howitwork1.webp',
        },
        {
          id: 'build',
          title: 'בנייה וחיבור לאתר',
          text: 'מחברים את מודל השפה לאתר או לאפליקציה דרך API, בונים את הממשק בעברית, ובודקים על שאלות אמיתיות מהעסק לפני שמישהו מהמבקרים רואה אותו.',
          art: '/images/howitwork2.webp',
        },
        {
          id: 'launch',
          title: 'השקה, מדידה וכוונון',
          text: 'משיקים לחלק מהמבקרים, עוקבים אחרי שאלות, עלות ושביעות רצון, ומתקנים את המקורות והכללים לפי מה שקורה בפועל. רק אחרי זה מרחיבים לכל האתר.',
          art: '/images/howitwork3.webp',
        },
      ],
    },
    banner: {
      heading: 'רוצים להוסיף לאתר שלכם יכולת AI שאפשר למדוד?',
      action: { label: 'בקשת בדיקת התאמה', href: '/contact' },
    },
    faqHeading: ['שאלות נפוצות', 'על שילוב AI באתר'],
    faqEntries: [
      {
        question: 'האם אפשר להוסיף צ׳אטבוט לאתר קיים בלי לבנות אותו מחדש?',
        answer:
          'ברוב המקרים כן. צ׳אטבוט לאתר מתחבר לאתר הקיים דרך תוסף, סקריפט הטמעה או קריאת API לשרת שלנו, ולכן אין צורך להחליף פלטפורמה. באתר וורדפרס או ווקומרס זה בדרך כלל תוסף ושכבת שרת, בשופיפיי אפליקציה או הטמעה בתבנית, ובוויקס הטמעה של רכיב חיצוני. באתר בקוד מותאם או באפליקציה מחברים ישירות. יש פלטפורמות עם מגבלות על קוד מותאם, ואת זה בודקים בשיחה הראשונה לפני שמתחייבים. הדרך הנכונה תלויה בגרסת האתר, בתוספים שכבר מותקנים בו וביכולת שרוצים להוסיף.',
      },
      {
        question: 'איך מונעים מצ׳אט בוט AI לאתר להמציא תשובות על המחירים והתנאים?',
        answer:
          'צ׳אט בוט AI לאתר מקבל גישה רק לתוכן שאישרתם: עמודי האתר, הקטלוג, מסמכי התנאים ושאלות נפוצות. כל תשובה נשענת על קטע שנמצא בהם, ואם לא נמצא קטע מתאים הוא עונה שאין לו מידע ומציע להשאיר פרטים או לדבר עם נציג. מוסיפים כללים כתובים לנושאים רגישים, כמו הנחות והתחייבויות, ובודקים אותו מראש על עשרות שאלות מהעסק. אחרי ההשקה קוראים שיחות לדוגמה ומתקנים את המקורות כשמתגלה פער. את הכללים והמקורות אפשר לעדכן בכל שלב בלי לגעת בקוד, והצוות רואה אילו שאלות נשאלו ואילו נשארו ללא מענה.',
      },
      {
        question: 'עם אילו מודלים עובדים, והאם הנתונים שלנו משמשים לאימון?',
        answer:
          'מחברים את OpenAI, Claude ו-Gemini דרך ה-API שלהם, ובוחרים לפי המשימה: מודל מהיר וזול לסיווג וחיפוש, מודל חזק יותר לשיחות מורכבות. בשימוש דרך API רשומים התנאים של כל ספק בנוגע לשמירת מידע ואימון, ואנחנו בודקים אותם ומציגים לכם לפני שמתחילים. אפשר גם להגדיר שמידע מזהה לא יישלח בכלל. מפתחות ה-API שייכים לחשבון שלכם, כך שהעלויות והנתונים נשארים בשליטתכם. בנוסף, מגדירים לכל יכולת אילו שדות מותר לשלוח לספק ואילו נשארים אצלכם, ומתעדים זאת בכתב כדי שיהיה ברור ללקוחות ולצוות.',
      },
      {
        question: 'כמה זה יעלה בהפעלה שוטפת, ואיך מונעים חריגה?',
        answer:
          'העלות השוטפת נקבעת לפי נפח השימוש, כי הספקים גובים לפי כמות טקסט שמעובדת. כדי שלא תהיה הפתעה מגדירים תקרת שימוש חודשית והתראה כשמתקרבים אליה, מגבלת הודעות לכל מבקר, מטמון לשאלות שחוזרות ובחירת המודל הקטן ביותר שמספיק לכל משימה. בדשבורד רואים כמה עלתה כל יכולת וכמה שיחות היא טיפלה, כך שאפשר להחליט אם להרחיב או לעצור. מחירי הספקים משתנים, ולכן את הנתון העדכני מקבלים בהצעה. עלויות הספקים נבדקות גם מול תנועת האתר בפועל, כדי שתדעו מראש מה יקרה בעונת שיא או אחרי קמפיין ממומן גדול.',
      },
      {
        question: 'מה לגבי פרטיות ותיקון 13 לחוק הגנת הפרטיות?',
        answer:
          'תיקון 13 הרחיב את החובות של עסקים שמחזיקים מידע אישי, ולכן פרטיות היא חלק מהאפיון. בפועל פועלים לפי מינימום מידע: מה שלא נחוץ לתשובה לא נשלח למודל, פרטים מזהים בשיחה מוסרים או מוחלפים כשאפשר, והמבקר רואה הודעה שהוא מדבר עם מערכת אוטומטית. השיחות נשמרות בסביבה שבשליטתכם לתקופה שתקבעו, והגישה אליהן מתועדת. איננו נותנים ייעוץ משפטי; אם צריך בדיקה של יועץ פרטיות, נכין תיאור מדויק של זרימת המידע. כשהאתר פונה לקהל רחב, מוסיפים גם הפניה למדיניות הפרטיות ואפשרות להתנתק מהשיחה ולבקש מחיקה של מה שנשמר.',
      },
      {
        question: 'במה זה שונה מחיבור מודל שפה למסמכים או מסוכן AI?',
        answer:
          'שילוב AI באתר הוא ההטמעה בצד הלקוח: מה המבקר רואה, איפה הוא פוגש את היכולת ואיך היא משתלבת בחוויית הגלישה, בקטלוג ובמערכת הניהול. חיבור מודלי שפה ו-RAG עוסק בשכבת הידע והמסמכים שמאחורי התשובות, וסוכן AI מבצע פעולות במערכות העסק. בפרויקט אחד אנחנו לרוב משלבים כמה מהם. אם צריך רק צ׳אט מעל מסמכים פנימיים לצוות, או סוכן וואטסאפ בלי אתר, מפנים אתכם לשירות המתאים ולא מוכרים יותר ממה שנחוץ. הבחירה תלויה במטרה העסקית: מה הכי חשוב לכם שיקרה באתר, ומי מהמערכות הקיימות צריכה לקבל את התוצאה.',
      },
    ],
  },
  'privacy-compliance': {
    id: 'privacy-compliance',
    crumb: 'התאמת אתר לתיקון 13',
    eyebrow: 'התאמת אתר לתיקון 13',
    heading: ['התאמת אתר לתיקון 13', 'פרטיות שמיושמת בקוד ובטפסים'],
    subhead: 'שירות ההתאמה הטכנית שלנו',
    lede: 'סקירת הטפסים והמידע שהאתר אוסף, באנר עוגיות שחוסם כלי מעקב עד לאישור, עמודי מדיניות פרטיות ומדיניות עוגיות, מינימום שדות בטפסים, אחסון מאובטח, חיבור מסודר ל-CRM ולמערכות דיוור ונוהל לבקשות עיון ומחיקה. זו עבודה טכנית באתר, לצד עורך הדין שלכם ולא במקומו. כדי להתחיל בלי עלות אפשר להשתמש בבודק תיקון 13 החינמי ובמחולל מדיניות העוגיות שלנו.',
    image: '/images/services-view.webp',
    action: { label: 'בקשת סקירת פרטיות לאתר', href: '/contact' },
    metaTitle: 'התאמת אתר לתיקון 13 — באנר עוגיות, טפסים ומדיניות פרטיות',
    metaDescription:
      'התאמה טכנית של אתר לתיקון 13 לחוק הגנת הפרטיות: סקירת טפסים, באנר עוגיות שחוסם מעקב עד אישור, מדיניות פרטיות ועוגיות, אבטחה, חיבור ל-CRM ונוהל בקשות עיון. לא ייעוץ משפטי.',
    advantages: {
      eyebrow: 'למה אנחנו',
      heading: ['מה מייחד את ההתאמה הטכנית שלנו'],
      lede: 'אנחנו מיישמים באתר את מה שנקבע עם הייעוץ המשפטי שלכם, ובודקים בדפדפן שזה אכן קורה, ולא רק שהטקסט מופיע בעמוד.',
      outro: 'רוצים לדעת מה האתר שלכם אוסף ומי מקבל את המידע?',
      action: { label: 'בקשת סקירת פרטיות לאתר', href: '/contact' },
      roles: [
        {
          id: 'not-legal',
          title: 'יישום טכני, לא ייעוץ משפטי',
          art: '/images/service-page1.webp',
          text: 'אנחנו לא קובעים מה החוק מחייב אצלכם. מה שנדרש מעסק מסוים נקבע עם עורך דין או יועץ פרטיות, ואנחנו מתרגמים את ההחלטות לטפסים, לקוד ולהגדרות, ומכינים לו תיאור מדויק של מה שהאתר עושה.',
        },
        {
          id: 'verified',
          title: 'בדיקה בדפדפן ולא בהנחה',
          art: '/images/service-page2.webp',
          text: 'באנר שמציג בחירה אבל נותן לכלי המדידה להיטען מיד לא עושה את העבודה. אחרי כל שינוי פותחים את כלי המפתחים, בודקים בלשונית Network מה נטען לפני האישור ומה אחריו, ושומרים את התוצאה.',
        },
        {
          id: 'minimal',
          title: 'פחות מידע, פחות סיכון',
          art: '/images/service-page3.webp',
          text: 'מידע שלא נאסף לא יכול לדלוף. עוברים על כל שדה בכל טופס ושואלים מה קורה בלעדיו, ומפרידים בין פנייה שירותית להרשמה לדיוור, כדי שהמידע ישמש רק למטרה שנאמרה לאדם.',
        },
        {
          id: 'documented',
          title: 'תיעוד שאפשר למסור',
          art: '/images/service-page4.webp',
          text: 'בסוף מקבלים מסמך שמפרט אילו טפסים וכלים יש באתר, לאן זורם המידע, מי הספקים ומה הוגדר. זה מה ששואלים עליו עורך דין, ביטוח או לקוח עסקי גדול.',
        },
      ],
    },
    system: {
      eyebrow: 'מה אפשר לבנות',
      heading: ['מה כולל תהליך ההתאמה באתר'],
      art: '/images/service-cms.webp',
      features: [
        {
          id: 'audit',
          icon: 'analytics',
          title: 'סקירת טפסים ומידע',
          text: 'מיפוי כל הטפסים, שדות ההזמנה, כלי המדידה והתיבות שמקבלות פניות: איזה מידע נאסף, לאיזו מטרה, לאן הוא נשלח ואצל מי הוא נשמר.',
        },
        {
          id: 'consent',
          icon: 'club',
          title: 'באנר עוגיות שחוסם מעקב',
          text: 'Google Tag Manager עם Consent Mode, כך שכלי מדידה ופרסום לא נטענים לפני אישור. כפתור סירוב בולט כמו האישור, וקישור בתחתית האתר לשינוי הבחירה.',
        },
        {
          id: 'policies',
          icon: 'catalog',
          title: 'מדיניות פרטיות ומדיניות עוגיות',
          text: 'עמודים שמתארים את מה שהאתר עושה בפועל, עם תאריך עדכון, הודעה קצרה ליד כל טופס וקישור מתחתית כל עמוד. את הנוסח המשפטי מאשר עורך הדין שלכם.',
        },
        {
          id: 'storage',
          icon: 'orders',
          title: 'אחסון, הרשאות ויומן פעולות',
          text: 'HTTPS בכל האתר, חשבון אישי לכל משתמש באזור הניהול, אימות דו-שלבי, הרשאות לפי תפקיד, גיבוי שנבדק ורישום של מי ניגש למידע.',
        },
        {
          id: 'requests',
          icon: 'sales',
          title: 'ספקים ובקשות של אנשים',
          text: 'חיבור מסודר ל-CRM ולמערכות דיוור, רשימת ספקים שמעבדים מידע, וזרימת טיפול בבקשות עיון, תיקון ומחיקה, עם אימות זהות ותיעוד המועד.',
        },
      ],
      action: { label: 'בקשת סקירת פרטיות לאתר', href: '/contact' },
    },
    howItWorks: {
      eyebrow: 'איך זה עובד',
      heading: ['איך מתנהל פרויקט. בפשטות.'],
      lede: 'כל שלב נגמר במסמך או בבדיקה שאפשר להראות, כך שאתם והיועץ המשפטי רואים בדיוק מה השתנה באתר.',
      steps: [
        {
          id: 'audit',
          title: 'סקירה ומיפוי',
          text: 'עוברים על האתר ועל הכלים המחוברים אליו, ומכינים דוח: אילו נתונים נאספים, מי מקבל אותם, מה נטען לפני אישור ואילו פערים נמצאו. את הדוח אפשר להעביר ישירות לעורך הדין.',
          art: '/images/howitwork1.webp',
        },
        {
          id: 'implement',
          title: 'יישום באתר',
          text: 'מתקנים את הטפסים, מתקינים את הבאנר ואת חסימת המעקב, מעלים את עמודי המדיניות בנוסח שאושר, מחזקים את האבטחה ומחברים נכון את ה-CRM ומערכות הדיוור.',
          art: '/images/howitwork2.webp',
        },
        {
          id: 'verify',
          title: 'בדיקה ותיעוד',
          text: 'בודקים בדפדפן שהכול פועל כמתוכנן, מריצים בקשת עיון לדוגמה מתחילתה ועד סופה, ומוסרים מסמך תיעוד שמתעדכן כשמוסיפים טופס או כלי חדשים.',
          art: '/images/howitwork3.webp',
        },
      ],
    },
    banner: {
      heading: 'רוצים לדעת מה האתר שלכם אוסף ומה נטען בו לפני שהגולש אישר?',
      action: { label: 'בקשת סקירת פרטיות לאתר', href: '/contact' },
    },
    faqHeading: ['שאלות נפוצות', 'על התאמת אתר לתיקון 13'],
    faqEntries: [
      {
        question: 'האם זה ייעוץ משפטי?',
        answer:
          'לא. אנחנו עושים את העבודה הטכנית באתר: טפסים, באנר עוגיות, חסימת כלי מעקב, אבטחה וחיבור למערכות. מה החוק מחייב בעסק שלכם, איזה נוסח משפטי נכון למדיניות הפרטיות והאם יש חובת רישום או מינוי ממונה נקבע עם עורך דין או יועץ פרטיות. אנחנו עובדים לצידו: מכינים לו תיאור מדויק של מה שהאתר אוסף ושל הספקים, ומיישמים את ההחלטות שלו. לבדיקה ראשונית של האתר אפשר להשתמש בבודק החינמי שלנו בכתובת /tools/amendment-13-website-checklist. אם עורך הדין מבקש שינוי, הוא נכנס לאתר בלי לבנות הכול מחדש.',
      },
      {
        question: 'מה השתנה בתיקון 13 ולמה זה נוגע לאתר?',
        answer:
          'תיקון 13 לחוק הגנת הפרטיות אושר ב-5 באוגוסט 2024 ונכנס לתוקף ב-14 באוגוסט 2025. מאז מזהה מקוון נכלל בהגדרת מידע אישי, ולכן גם כלי מדידה ופרסום באתר נוגעים בנושא, לא רק טפסים. בנוסף, הסכמה לפי החוק היא הסכמה מדעת, והודעה ליד טופס צריכה לומר למה מבקשים את הפרטים ולמי הם יימסרו. האתר הוא בדרך כלל המקום הראשון שבו נאסף מידע, ולכן שם מתחילים. לשאלה מה חל עליכם, שאלו עורך דין. התאריך שבו נכנס התיקון לתוקף הוא הסיבה שמדיניות שנכתבה לפני כן ראויה לבדיקה מחדש מול מה שהאתר עושה היום.',
      },
      {
        question: 'האם באנר עוגיות באמת חוסם מעקב?',
        answer:
          'רק אם הוא מחובר נכון. הרבה אתרים מציגים באנר, אבל Google Analytics ופיקסלים אחרים נטענים כבר בכניסה. אצלנו הכלים מוגדרים ב-Google Tag Manager עם Consent Mode, כך שלא נטען דבר לפני אישור, ובכפתור הסירוב אותה בולטות כמו באישור. לא מסתפקים בהגדרה: פותחים את הדפדפן, בודקים בלשונית Network מה נשלח לפני הלחיצה ומה אחריה, ושומרים צילום מסך. הבדיקה חוזרת בכל פעם שמוסיפים כלי חדש לאתר. אם אתם עובדים עם סוכנות פרסום שמוסיפה פיקסלים, חשוב שתדעו על כך, כי כל פיקסל כזה נכנס לרשימה.',
      },
      {
        question: 'אפשר להכין מדיניות פרטיות ועוגיות בלי עורך דין?',
        answer:
          'אפשר להכין טיוטה טובה, אבל לא לוותר על בדיקה משפטית אם יש לכם מאגר משמעותי. במחולל מדיניות העוגיות החינמי שלנו, בכתובת /tools/cookie-policy-generator, מכניסים את הכלים שבאתר ומקבלים נוסח מפורט. בשירות עצמו אנחנו מתאימים את הנוסח למה שהאתר עושה בפועל, כולל הטפסים והספקים, ומעלים אותו בעמודים ובקישורים הנכונים. הנוסח הסופי ראוי שיעבור את עורך הדין, במיוחד אם אתם מחזיקים מידע רגיש. המחולל אינו מחליף ייעוץ, אבל הוא חוסך זמן יקר בתיאור הכלים ומשאיר לעורך הדין רק את הליטוש.',
      },
      {
        question: 'איך מטפלים בבקשות עיון ומחיקה של גולשים?',
        answer:
          'מגדירים כתובת דוא״ל או טופס ייעודיים, ומי שמטפל בבקשות. כל בקשה נרשמת עם התאריך, הזהות של הפונה מאומתת, ואנחנו מראים איפה במערכות שלכם נשמר מידע על אותו אדם: האתר, ה-CRM, מערכת הדיוור והדוא״ל. לפי התקנות, עיון צריך להתאפשר בתוך 30 ימים, ולכן כדאי שהתהליך יהיה מוכן מראש. אנחנו בונים את המסלול הטכני ובודקים אותו על בקשה לדוגמה. האם למחוק או לשמור מידע מסוים, למשל בגלל חובות שמירה לפי דין, נקבע עם היועץ. אם הפונה מבקש לתקן פרט שגוי, מתקנים אותו בכל המקומות שבהם הוא נשמר, ולא רק במקום אחד.',
      },
      {
        question: 'מה עושים עם ספקים כמו CRM ומערכת דיוור?',
        answer:
          'מתחילים ברשימה: איזה ספק מקבל איזה מידע, לאיזו מטרה ובאיזה מקום בעולם הוא נשמר. אחר כך מחברים רק את השדות הנחוצים, מגבילים הרשאות לפי תפקיד ומבטלים גישה כשהקשר עם ספק או עובד נגמר. הסכם עם ספק שמעבד מידע בשמכם הוא עניין שמסדירים עם היועץ המשפטי, ואנחנו מכינים לו את הנתונים הטכניים. אם יש ספקים מחוץ לישראל, מציינים זאת במדיניות הפרטיות ובודקים אותם מול הדרישות. רשימת הספקים מתעדכנת עם כל כלי חדש. כך כל גורם חדש שמתחבר לאתר נבחן לפני החיבור ולא אחריו, והמידע לא מתפזר בלי שמישהו שם לב.',
      },
    ],
  },
  'ai-built-app-completion': {
    id: 'ai-built-app-completion',
    crumb: 'השלמת פרויקט שנבנה בכלי AI',
    eyebrow: 'השלמת פרויקט שנבנה בכלי AI',
    heading: ['השלמת פרויקט שנבנה בכלי AI', 'מאב-טיפוס מ-Lovable או Bolt לאפליקציה שעולה לאוויר'],
    subhead: 'שירות ההשלמה וההעלאה לפרודקשן שלנו',
    lede: 'התחלתם אתר או אפליקציה ב-Lovable, Bolt, v0, Replit, Cursor או Base44 ואתם צריכים מפתח שיסיים את העבודה: ביקורת קוד, אבטחה, בסיס נתונים, סליקה, העלאה לפרודקשן, ביצועים, עברית מימין לשמאל, נגישות, SEO ותחזוקה — על כל סטאק, בלי להתחיל מאפס.',
    image: '/images/services-view.webp',
    action: { label: 'בקשת בדיקת הפרויקט', href: '/contact' },
    metaTitle: 'השלמת פרויקט שנבנה ב-AI — Lovable, Bolt, Cursor ועד עלייה לפרודקשן',
    metaDescription:
      'מפתח שמשלים פרויקט שנבנה ב-Lovable, Bolt, v0, Replit, Cursor או Base44: ביקורת קוד ואבטחה, בסיס נתונים, סליקה, העלאה לפרודקשן, עברית, נגישות ו-SEO. על כל סטאק.',
    advantages: {
      eyebrow: 'למה אנחנו',
      heading: ['מה מייחד את ההשלמה שלנו'],
      lede: 'כלי AI מביאים אתכם מהר לאב-טיפוס שנראה כמו מוצר, אבל בין אב-טיפוס לבין מערכת שעוברת לקוחות אמיתיים יש פער של אבטחה, נתונים ותפעול. את הפער הזה סוגרים, בלי לזרוק את מה שכבר בנוי.',
      outro: 'רוצים לדעת מה חסר בפרויקט שלכם כדי לעלות לאוויר?',
      action: { label: 'בקשת בדיקת הפרויקט', href: '/contact' },
      roles: [
        {
          id: 'review-first',
          title: 'ביקורת לפני כל התחייבות',
          art: '/images/service-page1.webp',
          text: 'קוראים את הקוד, מריצים אותו ורואים מה עובד, מה שביר ומה צריך להיכתב מחדש. מקבלים רשימת ממצאים לפי חומרה ותוכנית עבודה, ורק אז מחליטים אם ממשיכים.',
        },
        {
          id: 'any-stack',
          title: 'כל כלי וכל סטאק',
          art: '/images/service-page2.webp',
          text: 'פרויקט שנוצר ב-Lovable, Bolt, v0, Replit, Cursor או Base44, על React, Next.js, Supabase, Firebase או שרת משלכם. ממשיכים בטכנולוגיה שכבר קיימת ומחליפים רכיב רק כשיש לכך סיבה כתובה.',
        },
        {
          id: 'production-grade',
          title: 'סטנדרט של פרודקשן',
          art: '/images/service-page3.webp',
          text: 'מפתחות סודיים מחוץ לקוד, הרשאות וכללי גישה לנתונים, גיבויים, ניטור ופריסה שאפשר לחזור ממנה לגרסה קודמת. הדברים שכלי ה-AI לא עוצר לשאול עליהם.',
        },
        {
          id: 'hebrew-ready',
          title: 'עברית, נגישות ו-SEO',
          art: '/images/service-page4.webp',
          text: 'כיוון ימין לשמאל בכל מסך, פונט עברי, תאריכים ומטבע בפורמט ישראלי, נגישות לפי ת"י 5568 ותשתית שגוגל יכול לסרוק, כך שהמוצר מוכן לשוק הישראלי.',
        },
      ],
    },
    system: {
      eyebrow: 'מה כלול',
      heading: ['מה מסיימים לפני שעולים לאוויר'],
      art: '/images/service-cms.webp',
      features: [
        {
          id: 'code-security',
          icon: 'analytics',
          title: 'ביקורת קוד ואבטחה',
          text: 'בדיקת מפתחות API וסודות, התחברות והרשאות, אימות קלט, העלאת קבצים ותלויות פגיעות, עם רשימת ממצאים לפי חומרה ותיקון של כל אחד מהם.',
        },
        {
          id: 'database',
          icon: 'catalog',
          title: 'בסיס נתונים וכללי גישה',
          text: 'מבנה טבלאות נכון, כללי גישה ברמת השורה (RLS), גיבויים והעברת נתונים בין סביבות, כדי שמשתמש יראה רק את המידע שלו ולא יאבד אותו.',
        },
        {
          id: 'payments',
          icon: 'sales',
          title: 'סליקה, חשבוניות ואינטגרציות',
          text: 'חיבור לסליקה ישראלית או בינלאומית עם וובהוקים ואימות תשלום בצד השרת, הפקת חשבוניות וחיבור ל-CRM, דיוור ולשירותים שהעסק כבר עובד איתם.',
        },
        {
          id: 'deploy',
          icon: 'orders',
          title: 'העלאה לפרודקשן וביצועים',
          text: 'דומיין, SSL, סביבת בדיקות וסביבה חיה, משתנים סודיים, פריסה אוטומטית וחזרה לגרסה קודמת, וטיפול בזמני טעינה ובשאילתות איטיות.',
        },
        {
          id: 'handover',
          icon: 'club',
          title: 'מסירה ותחזוקה',
          text: 'תיעוד קצר, קוד ודומיין על שמכם, ניטור ועדכוני אבטחה, ואפשרות להמשיך לפתח את המוצר עם אותו צוות או לבד עם כלי ה-AI.',
        },
      ],
      action: { label: 'בקשת בדיקת הפרויקט', href: '/contact' },
    },
    howItWorks: {
      eyebrow: 'איך זה עובד',
      heading: ['איך מתנהל פרויקט. בפשטות.'],
      lede: 'מתחילים בהבנה של מה שנבנה, מסדרים את מה שקריטי, ומעלים בשלבים.',
      steps: [
        {
          id: 'audit',
          title: 'ביקורת וסדר עדיפויות',
          text: 'מקבלים גישה למאגר ולחשבונות, קוראים ומריצים את הקוד, ומחזירים לכם רשימת ממצאים עם תוכנית עבודה לפי חשיבות: מה חוסם עלייה לאוויר, מה כדאי לתקן ומה יכול לחכות.',
          art: '/images/howitwork1.webp',
        },
        {
          id: 'harden',
          title: 'תיקון והשלמה',
          text: 'סוגרים אבטחה, בסיס נתונים, סליקה ואינטגרציות, מוסיפים עברית ונגישות, ומציגים גרסאות עובדות לאורך הדרך כדי שאפשר יהיה לתקן כיוון בזמן.',
          art: '/images/howitwork2.webp',
        },
        {
          id: 'launch',
          title: 'העלאה ומסירה',
          text: 'פורסים קודם לסביבת בדיקות ואחר כך לאתר החי, מוודאים שהכול נמדד ומנוטר, ומוסרים תיעוד וגישות. אחרי ההשקה אפשר להמשיך באחזקה או לעצור.',
          art: '/images/howitwork3.webp',
        },
      ],
    },
    banner: {
      heading: 'הפרויקט כמעט מוכן וצריך מפתח שיסיים אותו?',
      action: { label: 'בקשת בדיקת הפרויקט', href: '/contact' },
    },
    faqHeading: ['שאלות נפוצות', 'על השלמת פרויקט שנבנה בכלי AI'],
    faqEntries: [
      {
        question: 'אפשר להשלים פרויקט שנבנה ב-Lovable, Bolt או Cursor בלי לבנות הכול מחדש?',
        answer:
          'ברוב המקרים כן. מתחילים בביקורת קוד שבודקת מה כבר עובד, מה שביר ומה צריך להיכתב מחדש, ומציגים לכם את התמונה לפני שמתחייבים. קוד שנוצר בכלי AI הוא בדרך כלל בסיס שימושי: המסכים והזרימה קיימים, אבל חסרים בו אימות משתמשים תקין, טיפול בשגיאות, בדיקות ומבנה שאפשר להמשיך לפתח. אם הבסיס יציב משלימים עליו, ואם לא מחליפים רק את החלקים הבעייתיים. בנייה מחדש מלאה מוצעת רק כשהיא זולה יותר מתיקון, כך שמשלמים על מה שחסר ולא על מה שכבר עובד.',
      },
      {
        question: 'מה בודקים בביקורת קוד ואבטחה של אפליקציה שנבנתה ב-AI?',
        answer:
          'הביקורת מכסה את מה שמסכן עסק אמיתי: מפתחות API וסודות שנשארו בקוד או בצד הלקוח, התחברות והרשאות, כללי גישה ברמת השורה (RLS) בבסיס הנתונים, אימות קלט, העלאת קבצים, חשיפת מידע אישי ותלויות עם פגיעויות ידועות. מקבלים רשימת ממצאים לפי חומרה ומה תוקן בכל אחד. קוד שנוצר ב-AI משאיר לא פעם בסיס נתונים פתוח לקריאה לכל מי שיודע לשאול, ולכן זה השלב הראשון. כשהאפליקציה מחזיקה מידע אישי, מתחשבים גם בעקרונות תיקון 13. התיקונים נבדקים מחדש אחרי ביצועם כדי לוודא שהפרצה נסגרה.',
      },
      {
        question: 'כמה זמן לוקח להעלות את הפרויקט לפרודקשן?',
        answer:
          'הזמן תלוי בגודל הקוד ובמצבו ולא במספר המסכים. אחרי הביקורת מקבלים רשימת עבודה לפי סדר חשיבות ולוח זמנים לכל שלב: אבטחה ובסיס נתונים, סליקה והתחברות, פריסה, ביצועים, עברית ונגישות. מה שמאריך פרויקט הוא חשבונות צד שלישי שעדיין לא נפתחו, החלטות עסקיות שלא התקבלו ומספר האינטגרציות. מעלים בשלבים, קודם סביבת בדיקות ואחר כך האתר החי, כדי שאפשר יהיה לחזור לגרסה קודמת. הצעה עם תאריכים מגיעה אחרי הביקורת ולא לפניה, כך שתדעו מראש מה חוסם את ההשקה ומה אפשר לדחות לגרסה הבאה.',
      },
      {
        question: 'באילו כלים וסטאקים אתם עובדים?',
        answer:
          'עובדים על כל סטאק, ולא מחייבים אתכם לעבור לטכנולוגיה שלנו. פרויקטים שמגיעים מ-Lovable, Bolt, v0, Replit, Cursor או Base44 בנויים לרוב על React או Next.js עם Supabase או Firebase כשרת, ואנחנו ממשיכים בהם כפי שהם. אם יש סיבה טובה להחליף רכיב, למשל בסיס נתונים שלא מתאים לצמיחה, מציגים אותה בכתב יחד עם החלופות ומחכים להחלטה שלכם. הקוד נשאר במאגר שלכם ובחשבונות שלכם, כך שאפשר להמשיך עם כל מפתח אחר. בסוף השיחה הראשונה תדעו אם המבנה הקיים מתאים להמשך.',
      },
      {
        question: 'מה לגבי עברית, RTL, נגישות ו-SEO באפליקציה שנוצרה ב-AI?',
        answer:
          'כלי AI בונים לרוב ממשק שמכוון לשמאל, עם פונטים ותאריכים באנגלית. בודקים כל מסך מימין לשמאל, מתקנים כיוון טפסים, אייקונים וטבלאות, מוסיפים פונט עברי ומתאימים פורמט של תאריכים, מטבע ומספרים. בנוסף בודקים נגישות לפי ת"י 5568 ו-SEO: כותרות, תיאורים, מפת אתר, מהירות טעינה ותצוגה מקדימה בשיתוף. אפליקציה שנבנתה כדף יחיד בצד הלקוח לא תמיד נסרקת היטב בגוגל, ולכן בודקים גם רינדור בשרת. הפערים האלה נפוצים בכל הכלים, ולכן הם נבדקים בכל פרויקט, גם כשהמסך נראה תקין בדפדפן.',
      },
      {
        question: 'של מי הקוד, ומה קורה אחרי ההשקה?',
        answer:
          'הקוד, מאגר ה-Git, בסיס הנתונים והדומיין נשארים בבעלותכם. בסוף מקבלים תיעוד קצר, הסבר על הפריסה והמשתנים הסודיים, ואפשרות להמשיך איתנו באחזקה: ניטור, עדכוני אבטחה, גיבויים ותיקוני תקלות. אפשר גם לעצור אחרי המסירה ולהמשיך לבד או עם כלי ה-AI, והקוד יהיה מסודר מספיק כדי לעשות זאת בבטחה. פיתוח פיצ׳רים חדשים מתומחר בנפרד, אחרי אפיון קצר. הקוד נמסר עם היסטוריית שינויים מסודרת, כך שמפתח אחר יכול להבין מה השתנה ומתי. אם הבעלות על החשבונות עדיין אצל הכלי, מעבירים אותם לשמכם כחלק מהמסירה.',
      },
    ],
  },
  'ai-search': {
    id: 'ai-search',
    crumb: 'קידום ב-AI',
    eyebrow: 'קידום ב-AI',
    heading: ['קידום ב-ChatGPT ובבינה מלאכותית', 'נראות בתשובות של ChatGPT, Gemini וגוגל'],
    subhead: 'שירות ה-GEO שלנו',
    lede: 'קידום ב-ChatGPT וקידום GEO שונים מקידום אורגני: יותר חיפושים נגמרים בתשובה מנוסחת ולא ברשימת קישורים, והשאלה היא לא באיזה מקום אתם ברשימה אלא האם המנוע בכלל מזכיר אתכם בתשובה. קידום בבינה מלאכותית הוא העבודה שהופכת אתכם למקור שקל לצטט.',
    image: '/images/service-ai-search-hero.webp',
    action: { label: 'בקשת בדיקת נראות ב-AI', href: '/contact' },
    metaTitle: 'קידום ב-ChatGPT ו-GEO — קידום בבינה מלאכותית לעסקים',
    metaDescription:
      'קידום ב-ChatGPT ובגוגל AI (קידום GEO): הופכים את העסק לישות ש-AI מצטט, עם סכמה, תוכן בר-ציטוט ודוח נראות ב-ChatGPT וב-Gemini.',
    advantages: {
      eyebrow: 'למה אנחנו',
      heading: ['מה מייחד את הקידום ב-AI שלנו'],
      lede: 'מנוע שמנסח תשובה לא בוחר קישור אלא בוחר מקור. העבודה היא להפוך אתכם למקור שנוח לצטט.',
      outro: 'רוצים לדעת מה ChatGPT עונה היום כששואלים על התחום שלכם?',
      action: { label: 'בקשת בדיקת נראות ב-AI', href: '/contact' },
      roles: [
        {
          id: 'entity',
          title: 'קודם הישות, אחר כך התוכן',
          art: '/images/service-page1.webp',
          text: 'מנוע לא מצטט עסק שאינו בטוח בקיומו. שם אחיד, כתובת וטלפון זהים בכל מקום, פרופיל עסקי מאומת וקישור בין כל הנכסים — זה הבסיס שבלעדיו שאר העבודה לא נתפסת.',
        },
        {
          id: 'quotable',
          title: 'תוכן שאפשר לצטט, לא רק לקרוא',
          art: '/images/service-page2.webp',
          text: 'תשובה ישירה בפסקה הראשונה, מספרים עם מקור, טבלאות השוואה ושאלות שנוסחו כפי שלקוח שואל. פסקה שיווקית כללית אינה ניתנת לציטוט, ולכן פשוט אינה נבחרת.',
        },
        {
          id: 'schema',
          title: 'סכמה שנכתבה למכונה',
          art: '/images/service-page3.webp',
          text: 'Organization, LocalBusiness, Service, FAQPage ו-Breadcrumb מחוברים לגרף אחד עם מזהים יציבים. זה מה שמאפשר למנוע להבין מי אומר את הדבר ועל מה בדיוק, ולא רק לקרוא טקסט.',
        },
        {
          id: 'measure',
          title: 'מדידה בלי מיקומים',
          art: '/images/service-page4.webp',
          text: 'בתשובת AI אין מקום ראשון. לכן אנחנו מודדים אחרת: על מאגר שאלות קבוע נבדק אם אתם מוזכרים, באיזה הקשר, ולצד מי — ומשווים את זה מחודש לחודש.',
        },
      ],
    },
    system: {
      eyebrow: 'מה כלול',
      heading: ['ממה מורכב קידום ב-AI'],
      art: '/images/service-ai-search.webp',
      features: [
        {
          id: 'prompts',
          icon: 'orders',
          title: 'מיפוי שאלות אמיתיות',
          text: 'בונים מאגר של השאלות שלקוח באמת מקליד למנוע — לא מילות מפתח קצרות אלא שאלות מלאות — ובודקים מה מתקבל היום כתשובה.',
        },
        {
          id: 'facts',
          icon: 'catalog',
          title: 'בסיס עובדות בר-ציטוט',
          text: 'מחירים, טווחי זמן, תקנים ותנאים מנוסחים כעובדות בדידות עם מקור, במקום להיות מפוזרים בתוך פסקאות שיווקיות.',
        },
        {
          id: 'graph',
          icon: 'club',
          title: 'ישות וסכמה מחוברות',
          text: 'הגדרת הארגון, המומחיות והשירותים כגרף אחד, כולל קישור לפרופילים החיצוניים שמאשרים שהעסק אמיתי.',
        },
        {
          id: 'sources',
          icon: 'sales',
          title: 'נוכחות במקורות שה-AI קורא',
          text: 'מנוע מסתמך על מקורות חיצוניים לא פחות מעל האתר עצמו: קטלוגים מקומיים, פרופילים מקצועיים ואזכורים באתרים אחרים.',
        },
        {
          id: 'report',
          icon: 'analytics',
          title: 'דוח נראות חודשי',
          text: 'על אילו שאלות אתם מוזכרים, איפה נעלמתם, מי מוזכר במקומכם ומה השתנה מהחודש הקודם — בעברית ולא בלוג טכני.',
        },
      ],
      action: { label: 'בקשת בדיקת נראות ב-AI', href: '/contact' },
    },
    howItWorks: {
      eyebrow: 'איך זה עובד',
      heading: ['איך מתחילים. בפשטות.'],
      lede: 'מתחילים במה שהמנועים אומרים עליכם היום, כי לרוב זה מפתיע.',
      steps: [
        {
          id: 'baseline',
          title: 'בדיקת מצב',
          text: 'מריצים את מאגר השאלות מול ChatGPT, Gemini ותוצאות ה-AI של גוגל ומתעדים מה נאמר עליכם, מה נאמר במקומכם, ואיפה המנוע פשוט טועה לגביכם.',
          art: '/images/howitwork1.webp',
        },
        {
          id: 'foundation',
          title: 'תיקון הבסיס',
          text: 'מסדרים ישות וסכמה, מאחדים פרטי עסק בין הנכסים ומנסחים מחדש את הדפים המסחריים כך שיכילו תשובות שאפשר לצטט.',
          art: '/images/howitwork2.webp',
        },
        {
          id: 'track',
          title: 'מעקב ושיפור',
          text: 'בודקים את אותו מאגר שאלות מדי חודש, מזהים איפה נכנסתם ואיפה נדחקתם, ומרחיבים לנושאים שבהם יש סיכוי אמיתי להיות מצוטטים.',
          art: '/images/howitwork3.webp',
        },
      ],
    },
    banner: {
      heading: 'רוצים לראות מה AI עונה היום כששואלים עליכם?',
      action: { label: 'בקשת בדיקת נראות ב-AI', href: '/contact' },
    },
    faqHeading: ['שאלות נפוצות', 'על קידום ב-AI'],
    faqEntries: [
      {
        question: 'מה זה קידום GEO ובמה הוא שונה מקידום אתרים רגיל?',
        answer:
          'קידום אורגני נלחם על מקום ברשימת התוצאות. קידום GEO, ובשמו האחר AEO, עוסק במה שקורה כשאין רשימה אלא תשובה מנוסחת אחת: ב-AI Overviews של גוגל, ב-ChatGPT או ב-Gemini. שם אין מקום ראשון ואין מקום שני, יש מקור שצוטט ומקור שלא. חלק גדול מהעבודה הטכנית משותף לשני העולמות: אתר מהיר, מבנה ברור וסכמה תקינה עוזרים לשניהם. ההבדל הוא בדגש. מנוע שמנסח תשובה מחפש עובדה בדידה עם מקור, ולא עמוד שמותאם היטב למילת מפתח, ולכן קידום בבינה מלאכותית בונה ישות ברורה ותוכן שקל לצטט.',
      },
      {
        question: 'איך עושים קידום ב-ChatGPT, ואפשר בכלל להשפיע על מה שהוא אומר?',
        answer:
          'קידום ב-ChatGPT אינו שליטה בתשובה, ומי שמבטיח אחרת אינו מדייק. אפשר להשפיע על מה שהמנוע מוצא עליכם, וזה כן בשליטתכם: כמה ברור מי אתם, האם פרטי העסק זהים בכל מקום, האם יש לכם עמוד שעונה על השאלה ישירות, והאם קיימים מקורות חיצוניים שמאשרים את מה שאתם טוענים. מנוע שמנסח תשובה נמנע ממקור שאינו בטוח בו, ולכן קידום בבינה מלאכותית פועל על הביטחון של המנוע בכם ולא על הניסוח שלו. בדיוק שם עובר הקו בין להיות מוזכר לבין להיעלם.',
      },
      {
        question: 'איך מודדים הצלחה כשאין מיקומים?',
        answer:
          'בונים מאגר קבוע של שאלות אמיתיות מהתחום שלכם ומריצים אותו מדי חודש מול אותם מנועים. עבור כל שאלה נרשם אם הוזכרתם, באיזה הקשר, אילו מתחרים הוזכרו לצדכם, והאם קישרו אליכם. זו מדידה השוואתית ולא מספר מוחלט, כי אותה שאלה יכולה להניב ניסוחים שונים בהרצות שונות — ולכן חשוב שהמאגר יהיה קבוע ושההרצה תהיה חוזרת. במקביל אנחנו עוקבים אחרי הנתונים שכן מדידים בוודאות: תנועה, פניות ומה שגוגל מדווח בפועל ב-Search Console.',
      },
      {
        question: 'זה מחליף קידום אורגני?',
        answer:
          'לא, וכדאי להיזהר ממי שמוכר את זה כתחליף. רוב החיפושים עדיין נגמרים בקליק על תוצאה, וגם מנועי ה-AI עצמם נשענים על אותם אותות בסיסיים: אתר מהיר, מבנה תקין, תוכן שמישהו מוכן לצטט וסמכות אמיתית. GEO אינו ערוץ נפרד אלא שכבה נוספת מעל עבודה אורגנית תקינה. אצל עסק שהבסיס אצלו רעוע — אתר איטי, תוכן דק, פרטי עסק סותרים — הדבר הנכון הוא לתקן את הבסיס, ולא לרכוש שירות נוסף שמניח שהבסיס קיים.',
      },
      {
        question: 'תוך כמה זמן רואים שינוי?',
        answer:
          'החלק הטכני משפיע מהר יחסית: תיקון ישות, סכמה ואיחוד פרטי עסק נקלטים תוך שבועות, ולעיתים די בכך כדי שהמנוע יפסיק לבלבל אתכם עם חברה אחרת בעלת שם דומה. החלק התוכני איטי יותר, כי מנוע מצטט מקור שהוא כבר סומך עליו, וסמכות אינה נבנית בחודש. אנחנו מודדים מהחודש הראשון כדי שיהיה בסיס להשוואה, אבל מסתכלים על מגמה על פני מספר חודשים ולא על הרצה בודדת — הרצה בודדת יכולה להשתנות גם בלי ששינינו דבר.',
      },
      {
        question: 'מה קורה אם ה-AI אומר עלינו משהו לא נכון?',
        answer:
          'זה קורה, ולעיתים קרובות יותר ממה שנדמה — במיוחד לעסקים ששמם דומה לשם של חברה אחרת, או שפרטיהם מופיעים בגרסאות שונות במקומות שונים. מנוע ממלא פערים מתוך מה שנראה לו סביר, ולכן פרט לא עקבי הופך בקלות לטעות מנוסחת בביטחון. הטיפול אינו בקשה לתיקון אלא הסרת העמימות: איחוד השם והפרטים בכל הנכסים, קישור מפורש בין הפרופילים, ועמוד ברור באתר שקובע את העובדות. ככל שהמקורות עקביים יותר, כך פוחת המרחב שבו המנוע ממציא.',
      },
      {
        question: 'איך בודקים ספק קידום ב-AI לפני שחותמים?',
        answer:
          'בארבע שאלות, ואנחנו עונים עליהן על עצמנו כאן. אילו מנועים נמדדים: אצלנו ChatGPT, Gemini, Perplexity ו-AI Overviews של גוגל, בעברית ובאנגלית. אילו שאלות נמדדות: רשימת הפרומפטים שנבנית מהפניות שלכם ומוצגת לכם, לא רשימה גנרית. באיזו תדירות חוזרים על הבדיקה: תשובות AI משתנות בין הרצות, ולכן בדיקה אחת לא מוכיחה כלום; אנחנו מודדים כל חודש באותו יום ומראים מגמה של שלושה חודשים ומעלה. ואיזה גישה יש לכם לנתונים: התשובות המלאות והמקורות שצוטטו נשמרים ונמסרים לכם, לא רק אחוז. סימני אזהרה אצל כל ספק: הבטחה לתוצאה בזמן קבוע, היעדר תוכנית כבר בשיחת האפיון, ומקרי לקוח בלי מספרים של נראות ב-AI לפני ואחרי.',
      },
      {
        question: 'כמה זה עולה?',
        answer:
          'העבודה מתחלקת לשני חלקים ולכן גם התמחור. יש שלב התחלתי חד-פעמי — בדיקת מצב, תיקון ישות וסכמה ועריכה מחדש של העמודים המסחריים — ויש עבודה חודשית שוטפת של מדידה, תוכן והרחבה. ההיקף נגזר ממספר העמודים המסחריים וממצב הבסיס, ולכן איננו מפרסמים מחיר אחיד לשירות הזה. בבדיקת המצב תדעו מה מצבכם היום לפני שתחליטו על התקשרות שוטפת, ואם הבסיס האורגני שלכם עדיין חסר נאמר לכם להתחיל משם ולא מכאן.',
      },
    ],
  },
}

export const servicesPage = {
  title: ['פתרונות דיגיטל', 'מקצה לקצה'],
  crumb: 'שירותים',
  metaTitle: 'שירותי בניית אתרים, קידום ושיווק דיגיטלי',
  metaDescription:
    'מעטפת דיגיטלית מלאה מספק אחד: בניית אתרים וחנויות, קידום אורגני בגוגל, קמפיינים ממומנים ואוטומציה עסקית. קבלו ייעוץ ראשוני ללא עלות.',
  lede: 'מביסוס תשתיות טכנולוגיות ועד להבאת לקוחות משלמים: בניית אתרים וחנויות, קידום בגוגל וב-AI, אוטומציה לעסקים, סוכני AI ופיתוח תוכנה בהתאמה אישית. מעטפת שירותים מלאה שתפורה למידות של העסק שלכם, כדי להפוך כל נכס דיגיטלי למנוע של צמיחה.',
  action: { label: 'התחילו פרויקט חדש', href: '/contact' },
  faqHeading: ['שאלות נפוצות', 'על השירותים שלנו'],
}

export const contactPage = {
  title: 'נשמח להכיר',
  crumb: 'יצירת קשר',
  lede: 'מביסוס תשתיות טכנולוגיות ועד להבאת לקוחות משלמים – נשמח להכיר את העסק שלכם. השאירו פרטים ונחזור אליכם עם תוכנית פעולה מותאמת.',
  metaTitle: 'צרו קשר עם אייטרה AITERRA – ייעוץ ראשוני חינם לעסק שלכם',
  metaDescription:
    'רוצים אתר חדש, קידום או אוטומציה? השאירו פרטים לאייטרה (AITERRA) ונחזור אליכם עם תוכנית פעולה מותאמת ותמחור שקוף. משרדנו בבת ים, עובדים עם עסקים בכל הארץ.',
  faqHeading: ['שאלות נפוצות', 'לפני שמשאירים פרטים'],
  details: {
    heading: 'פרטי התקשרות',
    mapTitle: 'מיקום המשרד של Aiterra',
    emailLabel: 'שלחו לנו מייל',
    phoneLabel: 'דברו איתנו',
    addressLabel: 'הכתובת שלנו',
    maps: 'פתיחת הכתובת ב-Google Maps',
    waze: 'ניווט לכתובת עם Waze',
  },
}

export const legal = {
  updatedPrefix: 'עודכן לאחרונה:',
}

export const v2ContentDefaults = {
  header,
  hero,
  heroProjects,
  heroRails,
  heroTopics,
  about,
  aboutRoles,
  stats,
  statItems,
  services,
  serviceTabs,
  portfolio,
  projectPage,
  projectBanner,
  portfolioFilters,
  portfolioItems,
  allIn,
  allInNodes,
  partners,
  reels,
  reelItems,
  clientStories,
  clientStoryItems,
  faq,
  faqEntries,
  footer,
  reviews,
  reviewItems,
  contact,
  blog,
  article,
  aboutPage,
  aboutValues,
  servicesStack,
  servicePages,
  servicesPage,
  contactPage,
  legal,
}

export type V2Content = typeof v2ContentDefaults
export type V2ContentKey = keyof V2Content
