export const hero = {
  headline: ['סוכנות פיתוח', 'ושיווק דיגיטלי'],
  tags: ['שיווק', 'פרסום', 'קריאייטיב', 'קידום'],
  lede: [
    'אנחנו בונים אתרי מכירות, אתרי תדמית ודפי נחיתה, מפתחים פתרונות מותאמים לעסקים',
    'ומנהלים את מערך השיווק הדיגיטלי - מקמפיינים במטא ובגוגל ועד קידום אורגני במנועי החיפוש.',
  ],
  primaryAction: { label: 'בואו נדבר', href: '/v2/contact' },
  secondaryAction: { label: 'לכל הפרויקטים', href: '/v2#v2-portfolio' },
}

export type HeroProject = {
  id: string
  label: string
  href: string
  surface: string
}

export const heroProjects: HeroProject[] = [
  { id: 'olie', label: 'אולי 6', href: '/v2#v2-portfolio', surface: '#e6ecf8' },
  { id: 'neot-sade', label: 'נאות שדה', href: '/v2#v2-portfolio', surface: '#f4e8d2' },
  { id: 'hofit', label: 'חופית קוסמטיקס', href: '/v2#v2-portfolio', surface: '#e2ece0' },
  { id: 'karin-cohen', label: 'קרין כהן', href: '/v2#v2-portfolio', surface: '#ece2f3' },
  { id: 'brand-identity', label: 'מיתוג ותדמית', href: '/v2#v2-portfolio', surface: '#f7ded6' },
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
  eyebrow: 'ABOUT AITERRA',
  heading: ['אתר, שיווק, קריאייטיב ופיתוח', 'בלי לנהל חמישה ספקים שונים.'],
  lede: 'כדי לבנות נוכחות דיגיטלית שבאמת עובדת, בדרך כלל צריך לחבר בין לא מעט אנשים: מי שמאפיין את הפרויקט, מי שמעצב אותו, מי שמפתח, מי שמנהל את הקמפיינים, מי שיוצר את התוכן ומי שאחראי על הקידום.',
  outro: 'הצוות שלנו מוכן להתחיל להרים את התדמית הדיגיטלית שלכם ברשתות. ואתם?',
  action: { label: 'בואו נשבר את הפרויקט', href: '/v2/contact' },
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
    art: '/images/about-card4.png',
    text: 'מנהל אחד שמרכז את כל התהליך, מתאם בין כל בעלי המקצוע ודואג שהפרויקט יצא לדרך בזמן ובתקציב.',
  },
  {
    id: 'marketing',
    title: 'אנשי שיווק',
    art: '/images/about-card3.png',
    text: 'אנחנו מחברים בין אסטרטגיה וקהל יעד כדי ליצור מערכת שיווקית שעובדת יחד עם האתר ומביאה את האנשים הנכונים לעסק.',
  },
  {
    id: 'build',
    title: 'מתכנתים ומעצבים',
    art: '/images/about-card2.png',
    text: 'עיצוב חוויית משתמש ופיתוח מותאם אישית, שנבנים יחד כדי שהאתר ייראה מצוין ויעבוד מהר.',
  },
  {
    id: 'seo',
    title: 'מקדמי אתרים',
    art: '/images/about-card1.png',
    text: 'קידום אורגני ומבנה טכני נכון, כדי שהאתר יגיע לעמוד הראשון ויביא תנועה איכותית לאורך זמן.',
  },
]

export const stats = {
  heading: ['הטכנולוגיה מאחורי העבודה.', 'התוצאה בחזית.'],
  lede: 'כדי לבנות נוכחות דיגיטלית שבאמת עובדת, בדרך כלל צריך לחבר בין לא מעט אנשים: מי שמאפיין את הפרויקט, מי שמעצב אותו, מי שמפתח, מי שמנהל את הקמפיינים, מי שיוצר את התוכן ומי שאחראי על הקידום.',
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
    action: { label: 'בואו נשבר את הפרויקט', href: '/v2/contact' },
  },
  eyebrow: 'OUR SERVICES',
  heading: ['כל המעטפת לעסק שלך.'],
  lede: 'כדי לבנות נוכחות דיגיטלית שבאמת עובדת, בדרך כלל צריך לחבר בין לא מעט אנשים: מי שמאפיין את הפרויקט, מי שמעצב אותו, מי שמפתח, מי שמנהל את הקמפיינים, מי שיוצר את התוכן ומי שאחראי על הקידום.',
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
    action: { label: 'לכל שרותי השיווק שעשינו', href: '/v2#v2-portfolio-sales' },
  },
  {
    id: 'custom',
    label: 'פיתוח אישי',
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
    action: { label: 'לכל פרויקטי הפיתוח שעשינו', href: '/v2#v2-portfolio-systems' },
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
    action: { label: 'לכל פרויקטי המיתוג שעשינו', href: '/v2#v2-portfolio-brand' },
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
    action: { label: 'לכל אתרי התדמית שעשינו', href: '/v2#v2-portfolio-brand' },
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
    action: { label: 'לכל חנויות האונליין שעשינו', href: '/v2#v2-portfolio-sales' },
  },
]

export const portfolio = {
  eyebrow: 'SELECTED WORK',
  heading: ['קבלו הצצה לחלק', 'מהפרויקטים שעבדנו עליהם'],
  lede: 'כדי לבנות נוכחות דיגיטלית שבאמת עובדת, בדרך כלל צריך לחבר בין לא מעט אנשים: מי שמאפיין את הפרויקט, מי שמעצב אותו, מי שמפתח, מי שמנהל את הקמפיינים, מי שיוצר את התוכן ומי שאחראי על הקידום.',
  cardAction: 'צפו בפרויקט',
  prev: 'לפרויקט הקודם',
  next: 'לפרויקט הבא',
  outro: 'התרשמתם? בואו להציץ בשאר הפרויקטים שעבדנו עליהם',
  action: { label: 'לכל הפרויקטים שלנו', href: '/v2#v2-portfolio' },
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
    shot: '/images/portfolio/shots/eli-ben-yitzhak.webp',
    href: '/v2#v2-portfolio',
    category: 'brand',
  },
  {
    id: 'neot-sade',
    title: 'נאות שדה',
    tags: ['שיווק', 'פרסום', 'קריאייטיב', 'קידום'],
    shot: '/images/portfolio1.png',
    href: '/v2#v2-portfolio',
    category: 'sales',
  },
  {
    id: 'sous-chef',
    title: 'Sous Chef',
    tags: ['מערכת', 'פיתוח', 'UI/UX'],
    shot: '/images/portfolio/shots/sous-chef.webp',
    href: '/v2#v2-portfolio',
    category: 'systems',
  },
  {
    id: 'hofit-cosmetics',
    title: 'חופית קוסמטיקס',
    tags: ['אתר מכירות', 'קידום', 'עיצוב'],
    shot: '/images/portfolio/shots/hofit-cosmetics.webp',
    href: '/v2#v2-portfolio',
    category: 'sales',
  },
  {
    id: 'marketing-platform',
    title: 'פלטפורמת שיווק',
    tags: ['מערכת', 'אוטומציה', 'אינטגרציות'],
    shot: '/images/portfolio/shots/marketing-platform.webp',
    href: '/v2#v2-portfolio',
    category: 'systems',
  },
  {
    id: 'karin-cohen',
    title: 'קרין כהן',
    tags: ['דף נחיתה', 'לידים', 'קמפיינים'],
    shot: '/images/portfolio/shots/karin-cohen.webp',
    href: '/v2#v2-portfolio',
    category: 'brand',
  },
]

export const allIn = {
  eyebrow: 'ALL-IN-ONE',
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
}

export const partners: { caption: string; logos: PartnerLogo[] } = {
  caption: 'פלטפורמות וטכנולוגיות שאנחנו מתמחים בהם',
  logos: [
    { name: 'WordPress', src: '/images/partner1.png' },
    { name: 'Google Ads', src: '/images/partner2.png' },
    { name: 'Meta', src: '/images/partner3.png', scale: 0.7 },
  ],
}

export const reels = {
  eyebrow: 'CREATIVE & REELS',
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
      'זמן הפיתוח תלוי במורכבות הפרויקט ובמטרות שלו. תהליך של יצירת דף נחיתה או בניית אתר תדמית יכול לארוך בין שבועיים לחודש. לעומת זאת, בניית אתר חנות (איקומרס) או פיתוח מערכת מורכבת מותאמת אישית (עם טכנולוגיות כמו React או Next.js) עשוי לקחת חודשיים ויותר. כחברה לבניית אתרים, אנו לא מתפשרים על איכות הקוד ומהירות הטעינה, ומוודאים שהאתר יעלה לאוויר רק כשהוא מושלם.',
  },
  {
    id: 'local-business',
    question: 'אנחנו עסק שנותן שירות מקומי (כמו עורכי דין/קליניקה), האם זה מתאים לנו?',
    answer:
      'בהחלט. דווקא לעסקים מקומיים הנוכחות הדיגיטלית קריטית, כי רוב הלקוחות מתחילים את החיפוש בגוגל. אנחנו בונים אתר שממוקד באזור השירות שלכם, מקדמים אותו במילות מפתח מקומיות ומחברים אותו לפרופיל העסק בגוגל, כך שמי שמחפש עורך דין או קליניקה באזור שלכם יגיע קודם אליכם.',
  },
  {
    id: 'one-agency',
    question: 'למה לבחור בסוכנות אחת גם לבנייה וגם לשיווק?',
    answer:
      'כשהאתר והשיווק נבנים על ידי אותו צוות, הם מתוכננים מההתחלה לעבוד יחד: דפי הנחיתה מותאמים למסרים בקמפיין, מערכת המדידה מחוברת נכון וכל שינוי מתבצע במקום אחד. כך חוסכים את התיאום בין ספקים, מקצרים זמנים ומקבלים תוצאה אחידה שקל למדוד ולשפר.',
  },
  {
    id: 'seo-scope',
    question: 'מה בדיוק כולל שירות קידום אתרים (SEO) שלכם?',
    answer:
      'השירות כולל מחקר מילות מפתח, קידום טכני של האתר (מהירות טעינה, מבנה עמודים ונתוני סכמה), כתיבת תוכן ואופטימיזציה של עמודים קיימים, בניית קישורים איכותיים ודוח ביצועים חודשי. המטרה היא להביא את האתר לעמוד הראשון במילות המפתח שמייצרות לכם פניות, ולשמור אותו שם לאורך זמן.',
  },
  {
    id: 'landing-only',
    question: 'האם ניתן להזמין מכם רק עיצוב דף נחיתה ממוקד?',
    answer:
      'כן. אפשר להזמין דף נחיתה בודד לקמפיין, למבצע או להשקת שירות חדש. גם בפרויקט קטן אנחנו עוברים על המסר, קהל היעד והפעולה שרוצים שהגולש יבצע, כדי שהדף לא רק ייראה טוב אלא גם ימיר. אם בהמשך תרצו להרחיב לאתר מלא, הדף נבנה כך שניתן לצמוח ממנו.',
  },
  {
    id: 'small-budget-ads',
    question: 'האם כדאי לעשות קידום ממומן בגוגל גם עם תקציב קטן?',
    answer:
      'כן, בתנאי שהקמפיין ממוקד. עם תקציב קטן אנחנו מתמקדים במילות מפתח בעלות כוונת רכישה גבוהה ובאזור גיאוגרפי מוגדר, ומוודאים שדף הנחיתה מותאם למודעה. כך כל שקל עובד קשה יותר, ואפשר להגדיל את התקציב בהדרגה לפי התוצאות בפועל.',
  },
  {
    id: 'after-launch',
    question: 'מה קורה אחרי השקת האתר או הקמפיין?',
    answer:
      'ההשקה היא רק ההתחלה. אחרי העלייה לאוויר אנחנו עוקבים אחרי הנתונים, מבצעים אופטימיזציה שוטפת לקמפיינים ולעמודים, דואגים לעדכוני אבטחה וגיבויים לאתר ונשארים זמינים לכל שינוי או הרחבה. אתם מקבלים דוחות ברורים ואיש קשר אחד שמלווה אתכם לאורך כל הדרך.',
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
        { label: 'אתרים', href: '/v2/services#v2-service-brochure' },
        { label: 'שיווק', href: '/v2/services#v2-service-marketing' },
        { label: 'קמפיין בגוגל', href: '/v2/services#v2-service-marketing' },
        { label: 'פיתוח אישי', href: '/v2/services#v2-service-custom' },
      ],
    },
    {
      id: 'general',
      title: 'כללי',
      links: [
        { label: 'תיק עבודות', href: '/v2#v2-portfolio' },
        { label: 'אודותינו', href: '/v2/about' },
        { label: 'בלוג', href: '/v2/blog' },
        { label: 'יצירת קשר', href: '/v2/contact' },
      ],
    },
  ] satisfies FooterColumn[],
  contactTitle: 'יצירת קשר',
  socialLabels: { instagram: 'אינסטגרם', facebook: 'פייסבוק' },
  legal: [
    { label: 'הצהרת נגישות', href: '/v2/accessibility-statement' },
    { label: 'תקנון ותנאי שימוש', href: '/v2/terms-of-use' },
    { label: 'מדיניות פרטיות', href: '/v2/privacy-policy' },
  ] satisfies FooterLink[],
  copyright: 'Copyright ©Aiterra. All rights reserved',
}

export const reviews = {
  eyebrow: 'GOOGLE REVIEWS',
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
    id: 'tzion-weinberg',
    author: 'ציון ויינברג',
    when: 'לפני חודש',
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
    src: '/images/form.png',
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
    terms: { label: 'לתנאי השימוש', href: '/v2/terms-of-use' },
    joiner: ' ',
    privacy: { label: 'ולמדיניות הפרטיות', href: '/v2/privacy-policy' },
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
  lede: 'הדיגיטל מתקדם – אנחנו דואגים שתהיו צעד אחד לפניו.',
  eyebrow: 'ABOUT AITERRA',
  heading: ['טכנולוגיה שבונה אתרים.', 'אסטרטגיה שבונה עסקים.'],
  paragraphs: [
    'מערכת 360° לצמיחה עסקית בדיגיטל. אנו ב-AITERRA מגשרים על הפער בין טכנולוגיה מורכבת לתוצאות עסקיות בשטח.',
    'משלב האסטרטגיה וה-UX ועד פיתוח מערכות סקילביליות, קידום אורגני (SEO) וניהול קמפיינים ממומנים – אנחנו הופכים את הנכס הדיגיטלי שלך למנוע צמיחה עוצמתי.',
  ],
  blocks: [
    {
      id: 'about',
      eyebrow: 'ABOUT AITERRA',
      heading: ['מקדמים בעלי עסקים', '2 צעדים קדימה'],
      text: 'ב-AITERRA אין צורך לרדוף אחרי ספקים שונים לכל שלב בדרך. אנחנו מרכזים את כל המומחיות – אפיון, עיצוב, פיתוח, קידום אורגני, קמפיינים ממומנים ויצירת תוכן – בצוות אחד שמגבש לעסק שלכם תהליך שלם. התוצאה? תהליך חלק יותר, תקשורת ישירה, ופתרון דיגיטלי שלם שבאמת מניע תוצאות.',
      image: '/images/about-page1.webp',
    },
    {
      id: 'strategy',
      eyebrow: 'OUR STRATEGY',
      heading: ['מאסטרטגיה ועד לתוצאות'],
      text: 'אנחנו ב-AITERRA לא רק בונים אתרים – אנחנו מלווים עסקים בכל שלב של הנוכחות הדיגיטלית. מעיצוב חוויית משתמש ופיתוח טכנולוגי, דרך קידום אורגני וקמפיינים ממומנים, ועד ליצירת תוכן שיווקי שמדבר לקהל שלכם. המעטפת הכוללת שלנו חוסכת לכם זמן, כסף ותיאומים מיותרים – ומאפשרת לכם להתמקד בלהצמיח את העסק.',
      image: '/images/about-page2.webp',
    },
  ],
  teamEyebrow: 'OUR PEOPLE',
  teamHeading: ['המוחות מאחורי הטכנולוגיה', 'וההצלחה שלכם'],
  teamLede: 'ב-AITERRA, אנחנו מאמינים שהטכנולוגיה הכי טובה בעולם לא שווה הרבה בלי האנשים הנכונים שמפעילים אותה. לכן, הרכבנו "סיירת דיגיטלית" ממוקדת-מטרה, המשלבת יכולות פיתוח עמוקות יחד עם אסטרטגיות שיווק ולידים אגרסיביות.',
  teamMore: 'עוד על',
  teamClose: 'סגירה',
  faqHeading: ['שאלות נפוצות עלינו', 'למה דווקא AITERRA?'],
}

export const aboutValues = {
  eyebrow: 'OUR VALUES',
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
  eyebrow: 'OUR SERVICES',
  heading: ['כל הפתרונות תחת', 'קורת גג אחת'],
  lede: 'ב-AITERRA, אנחנו מבינים שעוצמות דיגיטליות צריכה לייצר אימפקט מוחשי. כחברה לבניית אתרים וסוכנות דיגיטל, אנחנו לא מפרידים בין הטכנולוגיה לשיווק – אנחנו מחברים ביניהם.',
  items: [
    {
      id: 'ecommerce',
      title: 'אתרי E-Commerce',
      image: '/images/service1.webp',
      tags: ['קטלוג מוצרים', 'מערכת Aiterra', 'הקמת חנות', 'סליקה', 'ניהול הזמנות', 'משלוחים'],
      text: 'חנות אונליין שמותאמת למכירה, לניהול ולצמיחה. עם תהליך רכישה ברור וחוויה שעובדת נכון בכל מכשיר.',
      action: { label: 'לפרטים נוספים', href: '/v2/services/ecommerce' },
    },
    {
      id: 'custom',
      title: 'פיתוח אישי',
      image: '/images/service2.webp',
      tags: ['מערכת מותאמת אישית', 'אוטומציה', 'פורטלים', 'מערכות ניהול', 'API', 'אינטגרציות'],
      text: 'פיתוח מערכות ופתרונות דיגיטליים לפי צורך עסקי ספציפי. בלי להתפשר על פתרונות מדף שלא באמת מתאימים.',
      action: { label: 'לפרטים נוספים', href: '/v2/contact' },
    },
    {
      id: 'brochure',
      title: 'אתרי תדמית',
      image: '/images/service3.webp',
      tags: ['אפיון וחוויית משתמש', 'עיצוב UI', 'כתיבת תוכן', 'התאמה למובייל', 'מהירות טעינה', 'הטמעת אנליטיקס'],
      text: 'אתר תדמית הוא הרושם הראשון של העסק, ולכן הוא נבנה סביב המסר ולא סביב תבנית. כל עמוד מוביל את הגולש לפעולה הבאה.',
      action: { label: 'לפרטים נוספים', href: '/v2/contact' },
    },
    {
      id: 'marketing',
      title: 'שיווק ופרסום',
      image: '/images/service4.webp',
      tags: ['אסטרטגיה וקהל יעד', 'קמפיינים במטא', 'קמפיינים בגוגל', 'קריאייטיב', 'צילום ועריכה', 'קידום אורגני'],
      text: 'אנחנו בונים את כל המהלך: מהבנת העסק והקהל, דרך האסטרטגיה והמסרים ועד לקריאייטיב שמניע בפיד.',
      action: { label: 'לפרטים נוספים', href: '/v2/contact' },
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
    art: string
    action: { label: string; href: string }
  }
  faqHeading: string[]
  faqEntries?: { question: string; answer: string }[]
}

export const servicePages: Record<string, ServicePage> = {
  ecommerce: {
    id: 'ecommerce',
    crumb: 'אתרי E-Commerce',
    eyebrow: 'אתרי E-Commerce',
    heading: ['חנות אינטרנטית שנבנית', 'בדיוק למידות של העסק שלך'],
    subhead: 'המומחיות שלנו ב-E-Commerce',
    lede: 'פיתוח בקוד מלא מבוסס מערכת Aiterra - מהיר, מותאם אישית, עם ליווי ועדכונים שוטפים גם לאחר ההשקה.',
    image: '/images/service1.webp',
    action: { label: 'לשיחת ייעוץ ואפיון', href: '/v2/contact' },
    metaTitle: 'אתרי E-Commerce',
    metaDescription:
      'בניית חנות אונליין בקוד מלא על מערכת Aiterra: קטלוג מוצרים, סליקה, ניהול הזמנות ומשלוחים, עם ליווי ועדכונים שוטפים גם אחרי ההשקה.',
    advantages: {
      eyebrow: 'OUR ADVANTAGES',
      heading: ['היתרונות הייחודיים שלנו'],
      lede: 'מה מיוחד בשירות שלנו באתרי מסחר וחנויות דיגיטליות?',
      roles: [
        {
          id: 'spec',
          title: 'איפיון מדויק ומותאם אישית',
          art: '/images/service-page2.webp',
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
      eyebrow: 'MANAGEMENT SYSTEM',
      heading: ['מערכת הניהול של Aiterra'],
      art: '/images/about-page1.webp',
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
      action: { label: 'בואו נתאים את החנות שלכם', href: '/v2/contact' },
    },
    howItWorks: {
      eyebrow: 'HOW IT WORKS',
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
      eyebrow: 'PRICING',
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
          action: { label: 'הקימו את החנות שלכם', href: '/v2/contact' },
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
          action: { label: 'הקימו את החנות שלכם', href: '/v2/contact' },
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
          action: { label: 'דברו איתנו ונתחיל לאפיין', href: '/v2/contact' },
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
        link: { label: 'פנו אלינו ונדבר', href: '/v2/contact' },
      },
    },
    banner: {
      heading: 'רוצים לראות איך החנות שלכם תיראה?',
      art: '/images/hero.jpg',
      action: { label: 'דברו איתנו ונתחיל לאפיין', href: '/v2/contact' },
    },
    faqHeading: ['לפני שמתחילים', 'כמה דברים שכדאי לדעת.'],
    faqEntries: [
      {
        question: 'מהי מערכת Aiterra?',
        answer:
          'Aiterra היא מערכת לניהול חנות דיגיטלית, שמרכזת את הפעילות העסקית במקום אחד. באמצעות המערכת אפשר לנהל מוצרים, הזמנות, מלאי ולקוחות, לעקוב אחרי הנתונים בזמן אמת ולצמצם עבודה ידנית ומעבר בין מערכות שונות.',
      },
      {
        question: 'למי המערכת מתאימה?',
        answer:
          'לעסקים שמוכרים אונליין ורוצים שליטה מלאה בחנות – מעסקים קטנים שמקימים חנות ראשונה, דרך חנויות גדולות עם קטלוג רחב, ועד ארגונים שמנהלים כמה חנויות ותהליכי עבודה מורכבים.',
      },
      {
        question: 'אילו תהליכים אפשר לנהל באמצעות המערכת?',
        answer:
          'ניהול קטלוג ומלאי, הזמנות, משלוחים ותשלומים, מועדון לקוחות וצבירת נקודות, קופונים ומבצעים, שחזור עגלות נטושות ודיוור אוטומטי – ולצידם דוחות ודשבורד עם נתוני החנות בזמן אמת. היקף היכולות משתנה בין המסלולים, ובטבלת החבילות מפורט מה כלול בכל אחד.',
      },
      {
        question: 'האם Aiterra מחליפה את החנות הקיימת שלי?',
        answer:
          'ברוב המקרים אנחנו בונים את החנות מחדש בקוד מלא על גבי המערכת, כך שהעיצוב, הקטלוג והתוכן עוברים אליה. אם כבר יש לכם חנות פעילה, נבחן יחד באפיון מה נכון להעביר ומה לבנות מחדש, ונתכנן מעבר מסודר בלי להשבית את הפעילות.',
      },
      {
        question: 'איך מתחילים לעבוד עם Aiterra?',
        answer:
          'מתחילים בשיחת אפיון שבה מבינים את המוצרים, קהל היעד ותהליכי העבודה. אחר כך בונים את החנות, מטמיעים את המערכת, מגדירים את סביבת העבודה ומלווים אתכם עד שהכול עובד בצורה שוטפת.',
      },
      {
        question: 'האם אפשר להתאים את המערכת לצרכים של העסק שלי?',
        answer:
          'כן. הפיתוח נעשה בקוד ייעודי ולא בתבנית, כך שאפשר להתאים את החנות לאופן שבו העסק שלכם עובד – ולהוסיף יכולות בהמשך, ככל שהחנות גדלה. התאמה מלאה של המערכת לתהליכי העסק היא חלק ממסלול Enterprise.',
      },
      {
        question: 'האם ניתן לחבר את Aiterra למערכות חיצוניות?',
        answer:
          'כן. חיבור למערכות משלוחים ותשלומים ודיוור אוטומטי נכללים ממסלול Pro ומעלה, וחיבור למערכות פנימיות דרך API נכלל במסלול Enterprise – כך שהנתונים זורמים בין המערכות בלי הזנה כפולה.',
      },
    ],
  },
}

export const servicesPage = {
  title: ['פתרונות דיגיטל', 'מקצה לקצה'],
  crumb: 'שירותים',
  metaTitle: 'שירותים',
  lede: 'מביסוס תשתיות טכנולוגיות ועד להבאת לקוחות משלמים. אנו מספקים מעטפת שירותים מלאה שתפורה למידות של העסק שלכם, כדי להפוך כל נכס דיגיטלי למנוע של צמיחה.',
  action: { label: 'התחילו פרויקט חדש', href: '/v2/contact' },
  faqHeading: ['שאלות נפוצות', 'על השירותים שלנו'],
}

export const contactPage = {
  title: 'נשמח להכיר',
  crumb: 'יצירת קשר',
  lede: 'מביסוס תשתיות טכנולוגיות ועד להבאת לקוחות משלמים – נשמח להכיר את העסק שלכם. השאירו פרטים ונחזור אליכם עם תוכנית פעולה מותאמת.',
  metaTitle: 'יצירת קשר',
  details: {
    heading: 'פרטי התקשרות',
    mapTitle: 'מיקום המשרד של AITERRA',
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
