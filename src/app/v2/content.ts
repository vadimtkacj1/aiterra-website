export type HeaderNavItem = {
  id: string
  label: string
  href: string
  submenu?: 'services' | 'portfolio'
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
  ] satisfies HeaderNavItem[],
}

export const hero = {
  headline: ['סוכנות פיתוח', 'ושיווק דיגיטלי'],
  tags: ['שיווק', 'פרסום', 'קריאייטיב', 'קידום'],
  lede: [
    'אנחנו בונים אתרי מכירות, אתרי תדמית ודפי נחיתה, מפתחים פתרונות מותאמים לעסקים',
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
  eyebrow: 'ABOUT AITERRA',
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
    action: { label: 'בואו נשבר את הפרויקט', href: '/contact' },
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
]

export const portfolio = {
  eyebrow: 'SELECTED WORK',
  heading: ['קבלו הצצה לחלק', 'מהפרויקטים שעבדנו עליהם'],
  lede: 'כדי לבנות נוכחות דיגיטלית שבאמת עובדת, בדרך כלל צריך לחבר בין לא מעט אנשים: מי שמאפיין את הפרויקט, מי שמעצב אותו, מי שמפתח, מי שמנהל את הקמפיינים, מי שיוצר את התוכן ומי שאחראי על הקידום.',
  cardAction: 'צפו בפרויקט',
  prev: 'לפרויקט הקודם',
  next: 'לפרויקט הבא',
  outro: 'התרשמתם? בואו להציץ בשאר הפרויקטים שעבדנו עליהם',
  action: { label: 'לכל הפרויקטים שלנו', href: '/projects' },
}

export const projectsPage = {
  title: ['תיק עבודות', 'פרויקטים נבחרים'],
  crumb: 'תיק עבודות',
  lede: 'מביסוס תשתיות טכנולוגיות ועד להבאת לקוחות משלמים. אנו מספקים מעטפת שירותים מלאה שתפורה לצרכים של העסק שלכם, כדי להפוך כל נכס דיגיטלי למנוע של צמיחה.',
  action: { label: 'התחילו פרויקט חדש', href: '/contact' },
  faqHeading: ['לפני שמתחילים', 'כמה דברים שכדאי לדעת.'],
  metaTitle: 'תיק עבודות - אתרים, חנויות ומערכות שבנינו',
  metaDescription:
    'הפרויקטים שבנינו ב-AITERRA: אתרי מכירות, אתרי תדמית ומערכות ניהול – עם הכלים, הקידום והליווי שהביאו אותם לתוצאות.',
}

export const projectPage = {
  crumbHome: 'בית',
  crumb: 'תיק עבודות',
  readMore: 'קראו עוד',
  visit: 'צפו באתר',
  aboutEyebrow: 'BACKGROUND',
  aboutHeading: 'על הפרויקט',
  factDate: 'תאריך',
  factField: 'תחום',
  factType: 'סוג פרויקט',
  factTech: 'טכנולוגיה',
  challengeEyebrow: 'THE CHALLENGE',
  challengeHeading: 'מה היה האתגר?',
  solutionEyebrow: 'OUR SOLUTION',
  solutionHeading: 'הפתרון שלנו',
  moreEyebrow: 'MORE PROJECTS',
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

export const clientStories = {
  eyebrow: 'CLIENT STORIES',
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
  {
    id: 'pricing',
    question: 'כמה עולה לבנות אתר או דף נחיתה?',
    answer:
      'המחיר נקבע לפי סוג הפרויקט וההיקף שלו. דף נחיתה ממוקד מתחיל בכמה אלפי שקלים, אתר תדמית לעסק נמצא בטווח רחב יותר לפי מספר העמודים והתכנים, ובניית חנות איקומרס או מערכת מותאמת אישית מתומחרת בנפרד לפי המורכבות. אנחנו בונים הצעת מחיר שקופה לפי הצרכים המדויקים שלכם, בלי עלויות נסתרות — השאירו פרטים ונחזור אליכם עם הערכה מסודרת.',
  },
  {
    id: 'integrations',
    question: 'האם אתם מתחברים למערכות ולתוכנות שכבר יש לנו בעסק?',
    answer:
      'כן. אנחנו מחברים את האתר ואת מערך השיווק למערכות שאתם כבר עובדים איתן: מערכות CRM כמו Fireberry, Powerlink ו-Priority, תוכנות הנהלת חשבונות והפקת חשבוניות כמו חשבשבת, Morning (חשבונית ירוקה), iCount, Greeninvoice ו-Rivhit, וכן סליקת אשראי, דיוור, בוטים לוואטסאפ ומערכות אוטומציה. כך הלידים, ההזמנות והתשלומים זורמים אוטומטית למקום הנכון, בלי הזנה ידנית כפולה.',
  },
  {
    id: 'accessibility',
    question: 'האם האתר יהיה נגיש ויעמוד בתקן הנגישות הישראלי?',
    answer:
      'בהחלט. אנחנו בונים אתרים נגישים בהתאם לתקן הישראלי ת"י 5568 (התואם את הנחיות WCAG 2.0 ברמה AA): ניווט מלא במקלדת, ניגודיות צבעים תקינה, תמיכה בקוראי מסך והצהרת נגישות באתר. עמידה בתקן חוסכת מכם חשיפה לתביעות לפי חוק שוויון זכויות לאנשים עם מוגבלות, וגם מרחיבה את קהל הלקוחות שיכול להשתמש באתר בנוחות.',
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
        { label: 'אתרים', href: '/services#v2-service-brochure' },
        { label: 'שיווק', href: '/services#v2-service-marketing' },
        { label: 'קמפיין בגוגל', href: '/services#v2-service-marketing' },
        { label: 'פיתוח', href: '/services#v2-service-development' },
      ],
    },
    {
      id: 'general',
      title: 'כללי',
      links: [
        { label: 'תיק עבודות', href: '/projects' },
        { label: 'אודותינו', href: '/about' },
        { label: 'בלוג', href: '/blog' },
        { label: 'יצירת קשר', href: '/contact' },
      ],
    },
  ] satisfies FooterColumn[],
  contactTitle: 'יצירת קשר',
  socialLabels: { instagram: 'אינסטגרם', facebook: 'פייסבוק' },
  legal: [
    { label: 'הצהרת נגישות', href: '/accessibility-statement' },
    { label: 'תקנון ותנאי שימוש', href: '/terms-of-use' },
    { label: 'מדיניות פרטיות', href: '/privacy-policy' },
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
    'מדריכים מעשיים ותובנות על בניית אתרים, קידום אורגני בגוגל, קמפיינים ממומנים ואוטומציה עסקית - מהצוות המקצועי של AITERRA.',
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
  metaTitle: 'הסוכנות שלנו - צוות, ניסיון וגישה לעבודה',
  metaDescription:
    'AITERRA היא סוכנות פיתוח ושיווק דיגיטלי מגוש דן. הכירו את הצוות, שיטת העבודה והניסיון שמאחורי מאות פרויקטים לעסקים בישראל.',
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
      action: { label: 'לפרטים נוספים', href: '/services/ecommerce' },
    },
    {
      id: 'development',
      title: 'פיתוח',
      image: '/images/service2.webp',
      tags: ['מערכת מותאמת אישית', 'אוטומציה', 'פורטלים', 'מערכות ניהול', 'API', 'אינטגרציות'],
      text: 'פיתוח מערכות ופתרונות דיגיטליים לפי צורך עסקי ספציפי. בלי להתפשר על פתרונות מדף שלא באמת מתאימים.',
      action: { label: 'לפרטים נוספים', href: '/services/development' },
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
  ecommerce: {
    id: 'ecommerce',
    crumb: 'אתרי E-Commerce',
    eyebrow: 'אתרי E-Commerce',
    heading: ['חנות אינטרנטית שנבנית', 'בדיוק למידות של העסק שלך'],
    subhead: 'המומחיות שלנו ב-E-Commerce',
    lede: 'פיתוח בקוד מלא מבוסס מערכת Aiterra - מהיר, מותאם אישית, עם ליווי ועדכונים שוטפים גם לאחר ההשקה.',
    image: '/images/service1.webp',
    action: { label: 'לשיחת ייעוץ ואפיון', href: '/contact' },
    metaTitle: 'בניית חנות אינטרנטית לעסקים - פיתוח בקוד מלא',
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
      eyebrow: 'MANAGEMENT SYSTEM',
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
  development: {
    id: 'development',
    crumb: 'פיתוח',
    eyebrow: 'פיתוח',
    heading: ['הופכים רעיון מורכב', 'למערכת שעובדת'],
    subhead: 'פיתוח / תוכנה ומערכות בהתאמה אישית',
    lede: 'פיתוח תוכנה, אפליקציות ומערכות מותאמות אישית — מאפיון מדויק, דרך חלוקה לאבני\u00a0דרך נוחות ועד לביצוע בקוד נקי ומאובטח.',
    image: '/images/service-dev-hero.webp',
    action: { label: 'לקביעת שיחת אפיון', href: '/contact' },
    metaTitle: 'פיתוח מערכות ואוטומציה בהתאמה אישית',
    metaDescription:
      'פיתוח מערכות ופתרונות דיגיטליים בהתאמה אישית: אפיון תהליכים, מסכי ניהול, אוטומציות, פורטלים ואינטגרציות דרך API, עם ליווי ותמיכה שוטפת.',
    advantages: {
      eyebrow: 'SOLUTIONS',
      heading: ['מה אנחנו מפתחים?'],
      lede: 'פתרונות תוכנה ומערכות בהתאמה אישית לכל צורך עסקי',
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
      eyebrow: 'OUR TECH ECOSYSTEM',
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
      eyebrow: 'METHODOLOGY',
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
        question: 'מהו פיתוח אישי (Custom Development)?',
        answer:
          'פיתוח אישי הוא בניית מערכות תוכנה, אפליקציות ומוצרים דיגיטליים בהתאמה מלאה לצרכי העסק — ללא מגבלות של תבניות מוכנות.',
      },
      {
        question: 'למי השירות מתאים?',
        answer:
          'לעסקים ולארגונים שהתהליך המרכזי שלהם רץ היום על אקסלים, טפסים ומיילים, ולמי שמשלם על מערכת מדף שמנצל ממנה חלק קטן. גם סטארטאפים שצריכים מוצר ראשון עם משתמשים והרשאות נכנסים לכאן. בפועל אנחנו מחליפים את ההעברות הידניות בין הכלים במסכי עבודה, סטטוסים וטריגרים.',
      },
      {
        question: 'אילו סוגי פרויקטים אפשר לפתח?',
        answer:
          'מערכות ניהול פנימיות, פורטלים ללקוחות ולספקים, אזורים אישיים, אפליקציות ווב ואוטומציות שרצות ברקע. בכל אחד מהם נבנים מסכי ניהול, הרשאות לפי תפקיד, דוחות ואינטגרציות דרך API למערכות שכבר עובדות אצלכם. גם מודול נקודתי שנוסף לצד מערכת קיימת הוא פרויקט לכל דבר.',
      },
      {
        question: 'כמה זמן לוקח לפתח מערכת?',
        answer:
          'תלוי בהיקף - מערכת ממוקדת סביב תהליך עסקי אחד עולה לאוויר בדרך כלל תוך מספר שבועות, ופלטפורמה עם כמה מודולים, הרשאות ואינטגרציות נמדדת בחודשים. את הטווח קובעים כמות המסכים, מספר המערכות החיצוניות שצריך לחבר והמהירות שבה מגיעים מכם נתונים ואישורים. בתום האפיון תקבלו לוח זמנים לפי אבני דרך, עם תאריך מסירה לכל שלב.',
      },
      {
        question: 'איך מתחילים לעבוד עם Aiterra?',
        answer:
          'מתחילים בשיחת אפיון שבה ממפים את תהליכי העבודה, המשתמשים והנתונים. משם עוברים לאפיון טכנולוגי ומוצרי שמגדיר מסכים, מודל נתונים ואינטגרציות, והפרויקט מחולק לאבני דרך עם תכולה ברורה לכל אחת. הפיתוח והבדיקות רצים לפי אותן אבני דרך, ואתם מקבלים גרסאות לבדיקה תוך כדי - עד ההשקה והליווי השוטף אחריה.',
      },
      {
        question: 'האם אפשר לשלב מערכות קיימות?',
        answer:
          'כן, וברוב הפרויקטים זה בדיוק מה שקורה. מתחברים דרך API להנהלת חשבונות, CRM, מערכות שילוח, סליקה ודיוור, וכשאין ממשק פתוח עובדים מול ייצוא וייבוא קבצים מתוזמן. באפיון נסגור אילו שדות עוברים, לאיזה כיוון ומה קורה בשגיאה - כדי שלא תהיה הזנה כפולה ולא שתי גרסאות של אותו נתון.',
      },
      {
        question: 'מה קורה אחרי ההשקה?',
        answer:
          'אחרי ההשקה הצוות מקבל הדרכה ואנחנו נכנסים לליווי שוטף: ניטור, גיבויים אוטומטיים, עדכוני אבטחה ומענה מהיר כשמשהו נתקע. בשבועות הראשונים בדרך כלל עולים חידודים מהשימוש בפועל - שדה שחסר במסך, סטטוס נוסף או התראה שצריך לכוון - והם נכנסים במסגרת הליווי. מודול חדש או תהליך שלם עובר אפיון קצר ותמחור לפני שנכנס לפיתוח.',
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
      eyebrow: 'OUR ADVANTAGES',
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
      eyebrow: 'MANAGEMENT SYSTEM',
      heading: ['מערכת ניהול התוכן של Aiterra'],
      art: '/images/management-console.webp',
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
      eyebrow: 'HOW IT WORKS',
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
          'עמוד נחיתה עולה לאוויר תוך שבועות בודדים, ואתר תדמית מלא לוקח יותר - בעיקר בגלל שלב התוכן והתמונות. בתום האפיון תקבלו לוח זמנים מסודר עם שלבים ותאריכי מסירה.',
      },
      {
        question: 'האם אתם כותבים את התוכן או שאנחנו צריכים לספק אותו?',
        answer:
          'אנחנו יכולים לכתוב את התוכן השיווקי על בסיס שיחת אפיון וחומרים שתעבירו, ואפשר גם לעבוד עם תוכן שכבר יש לכם. בשני המקרים נעבור עליו יחד לפני העלייה לאוויר.',
      },
      {
        question: 'האם אפשר לעדכן את האתר לבד אחרי ההשקה?',
        answer:
          'כן. במסלול Business ומעלה האתר מגיע עם מערכת ניהול תוכן שמאפשרת לעדכן טקסטים, תמונות ועמודים בלי ידע טכני, ואנחנו מדריכים את הצוות שלכם בסיום הפרויקט.',
      },
      {
        question: 'האם האתר יהיה מותאם למובייל ולנגישות?',
        answer:
          'כן. כל אתר נבנה מותאם למובייל מהיסוד, עם תקן נגישות ישראלי, טעינה מהירה וניקוד תקין במדדי הליבה של גוגל.',
      },
      {
        question: 'האם האתר מקודם בגוגל?',
        answer:
          'האתר נבנה עם תשתית SEO נכונה: מבנה כותרות, מטא-דאטה, כתובות ידידותיות, מפת אתר ומהירות טעינה. קידום שוטף וקמפיינים הם שירות נפרד בתחום השיווק והפרסום.',
      },
      {
        question: 'יש לנו כבר אתר. אפשר לשדרג אותו במקום לבנות מחדש?',
        answer:
          'תלוי במצב הקיים. באפיון נבחן מה שווה לשמר - תוכן, כתובות, דירוגים אורגניים - ומה עדיף לבנות מחדש, ונתכנן מעבר מסודר בלי לפגוע בנוכחות הקיימת שלכם בגוגל.',
      },
    ],
  },
  marketing: {
    id: 'marketing',
    crumb: 'שיווק דיגיטלי',
    eyebrow: 'שיווק דיגיטלי',
    heading: ['שיווק מבוסס נתונים שמייצר', 'תוצאות - לא ניחושים.'],
    subhead: 'שיווק דיגיטלי / Meta & Google',
    lede: 'ניהול קמפיינים ממומנים ב-Meta וב-Google בהתאמה מדויקת לנישה, לרווחיות ולשלב שבו העסק שלך נמצא.',
    image: '/images/marketing-hero.webp',
    action: { label: 'לשיחת אפיון שיווקי', href: '/contact' },
    metaTitle: 'קידום אתרים אורגני וקמפיינים ממומנים',
    metaDescription:
      'ניהול קמפיינים ממומנים ב-Meta וב-Google: מחקר שוק ואפיון פלטפורמות, אסטרטגיה לפי שלב העסק, קריאייטיב ואופטימיזציה שוטפת עם דוחות על עלות לליד.',
    advantages: {
      eyebrow: 'STRATEGY',
      heading: ['הגישה שלנו'],
      lede: 'חלוקה ויזואלית לשני מצבים נפוצים של לקוחות',
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
      eyebrow: 'WORKFLOW',
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
      eyebrow: 'KEY ADVANTAGES',
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
      eyebrow: 'CASE STUDIES',
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
          'דמי הניהול כוללים את בניית האסטרטגיה, הקמת הקמפיינים, האופטימיזציה השוטפת והדיווח. תקציב המדיה עצמו משולם ישירות לגוגל ולמטא והוא נפרד מדמי הניהול.',
      },
      {
        question: 'תוך כמה זמן רואים תוצאות?',
        answer:
          'לידים ראשונים מגיעים בדרך כלל בשבועות הראשונים, אבל תמונה יציבה של עלות לליד מתקבלת אחרי חודש עד שלושה, אחרי שהקמפיינים נצברו מספיק נתונים לאופטימיזציה.',
      },
      {
        question: 'האם אתם עובדים גם עם עסקים קטנים?',
        answer:
          'כן. במסלול Basic מתמקדים בערוץ אחד עם תקציב מדיד, וכשהוא מוכיח את עצמו מרחיבים לערוצים נוספים. אין טעם לפזר תקציב קטן על הרבה מדי חזיתות.',
      },
      {
        question: 'מי הבעלים של חשבונות הפרסום?',
        answer:
          'החשבונות נפתחים על שם העסק שלכם ונשארים שלכם, כולל הנתונים והקהלים שנצברו בהם. אנחנו מקבלים הרשאת ניהול ולא בעלות.',
      },
      {
        question: 'האם אתם מפיקים את הקריאייטיב או שצריך לספק חומרים?',
        answer:
          'במסלול Pro ומעלה אנחנו מפיקים קריאייטיב, כולל צילום ועריכה, ובודקים כמה גרסאות מול הקהל. אפשר כמובן לעבוד גם עם חומרים קיימים שלכם.',
      },
      {
        question: 'איך מודדים הצלחה?',
        answer:
          'לפי לידים איכותיים ועלות לליד, ולא לפי חשיפות או לייקים. אנחנו מחברים מעקב המרות מהקליק ועד הפנייה, כדי שיהיה ברור איזה ערוץ באמת מייצר לקוחות.',
      },
    ],
  },
  branding: {
    id: 'branding',
    crumb: 'מיתוג ועיצוב',
    eyebrow: 'Branding & Web Design',
    heading: ['עיצוב שמדבר', 'בשפה של העסק שלך'],
    subhead: 'Branding & Web Design / UX/UI',
    lede: 'מיתוג עסקי, עיצוב אתרים וחוויית משתמש — מקונספט ראשוני ועד ממשק מוכן לפיתוח. עיצוב שלא רק נראה טוב, אלא גם עובד.',
    image: '/images/service-branding-hero.webp',
    action: { label: 'לשיחת ייעוץ עיצובי', href: '/contact' },
    metaTitle: 'מיתוג עסקי ועיצוב חוויית משתמש UX/UI',
    metaDescription:
      'מיתוג עסקי ושפה ויזואלית, עיצוב אתרים וחוויית משתמש, עיצוב אפליקציות מובייל ודפי נחיתה - מקונספט ראשוני ועד ממשק מוכן לפיתוח.',
    advantages: {
      eyebrow: 'SERVICES',
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
      eyebrow: 'WORKFLOW',
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
      eyebrow: 'OUR DESIGN PROCESS',
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
          'UX (חוויית משתמש) מתמקד באיך המוצר עובד ומרגיש - המבנה, מסלול הגולש והנוחות בכל שלב. UI (ממשק משתמש) מתמקד באיך הוא נראה - צבעים, טיפוגרפיה, מרווחים ורכיבים. יחד הם יוצרים חוויה דיגיטלית שלמה: אינטואיטיבית, נעימה ואפקטיבית.',
      },
      {
        question: 'למי שירות העיצוב מתאים?',
        answer:
          'לעסקים שמקימים נכס דיגיטלי חדש, לעסקים עם אתר קיים שלא מייצר פניות, ולסטארטאפים שצריכים ממשק מוכן לפיתוח. אם יש לכם מוצר או שירות שצריך להיראות אמין ולהוביל את הגולש לפעולה - זה מתאים.',
      },
      {
        question: 'מה כולל תהליך המיתוג?',
        answer:
          'הכרת העסק וקהל היעד, חקר מתחרים, ובניית שפה ויזואלית: לוגו, פלטת צבעים, טיפוגרפיה וטון דיבור. בסוף מקבלים מדריך מותג שמסביר איך להשתמש בכל נכס - באתר, ברשתות ובחומרים מודפסים.',
      },
      {
        question: 'כמה זמן לוקח לעצב אתר?',
        answer:
          'אתר תדמית ממוצע לוקח בין שבועיים לארבעה שבועות מרגע קבלת התכנים. פרויקט שכולל מיתוג מלא או מערכת מורכבת ייקח יותר. את לוח הזמנים המדויק נגדיר יחד בשלב האפיון, אחרי שנדע כמה מסכים צריך.',
      },
      {
        question: 'האם אתם גם מפתחים את האתר?',
        answer:
          'כן. אפשר לעצור בעיצוב ולקבל קבצים מוכנים לפיתוח עבור כל צוות, ואפשר להמשיך איתנו לפיתוח בקוד מלא - כך שאף פרט מהעיצוב לא הולך לאיבוד במעבר בין השלבים.',
      },
      {
        question: 'מה אני מקבל בסוף התהליך?',
        answer:
          'קובצי מקור מלאים, כל המסכים בגרסת דסקטופ ומובייל כולל מצבי טעינה, שגיאה ומסכים ריקים, ספריית רכיבים עם מרווחים ומידות, ומדריך סגנון. הכל שלכם - גם אם תמשיכו לעבוד מול ספק אחר.',
      },
      {
        question: 'האם אפשר לעדכן את העיצוב בהמשך?',
        answer:
          'כן. אנחנו בונים את העיצוב כספריית רכיבים, כך שהוספת עמוד או שינוי מסך לא מחייבת להתחיל מחדש. אפשר גם להמשיך בליווי שוטף ולעדכן מסכים ומסרים לפי ההתנהגות של הגולשים באתר.',
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
  lede: 'מביסוס תשתיות טכנולוגיות ועד להבאת לקוחות משלמים. אנו מספקים מעטפת שירותים מלאה שתפורה למידות של העסק שלכם, כדי להפוך כל נכס דיגיטלי למנוע של צמיחה.',
  action: { label: 'התחילו פרויקט חדש', href: '/contact' },
  faqHeading: ['שאלות נפוצות', 'על השירותים שלנו'],
}

export const contactPage = {
  title: 'נשמח להכיר',
  crumb: 'יצירת קשר',
  lede: 'מביסוס תשתיות טכנולוגיות ועד להבאת לקוחות משלמים – נשמח להכיר את העסק שלכם. השאירו פרטים ונחזור אליכם עם תוכנית פעולה מותאמת.',
  metaTitle: 'צרו קשר - ייעוץ ראשוני חינם לעסק שלכם',
  metaDescription:
    'רוצים אתר חדש, קידום או אוטומציה? השאירו פרטים ונחזור אליכם עם תוכנית פעולה מותאמת ותמחור שקוף. משרדנו בבת ים, עובדים עם עסקים בכל הארץ.',
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
