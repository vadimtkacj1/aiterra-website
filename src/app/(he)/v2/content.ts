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
  eyebrow: 'ABOUT Aiterra',
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
  lede: 'אנחנו עובדים עם סטאק מודרני - Next.js, React ו-TypeScript - ובודקים כל פרויקט מול נתונים ולא מול תחושות: מהירות טעינה, יציבות לאורך זמן ואחוז ההמרה בפועל. הטכנולוגיה היא האמצעי, התוצאה העסקית היא מה שנמדד בסוף.',
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
]

export const portfolio = {
  eyebrow: 'SELECTED WORK',
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
  lede: '12 פרויקטים חיים: שלוש חנויות אינטרנטיות, אתרי תדמית ולידים בקוסמטיקה ובמותג אישי, ופרויקטים בנדל"ן ובייעוץ משכנתאות. כולם נבנו בקוד על ידי אותו צוות שגם מקדם אותם, וכולם באוויר היום.',
  action: { label: 'התחילו פרויקט חדש', href: '/contact' },
  faqHeading: ['לפני שמתחילים', 'כמה דברים שכדאי לדעת.'],
  metaTitle: 'תיק עבודות - 12 אתרים, חנויות ומערכות שבנינו',
  metaDescription:
    '12 פרויקטים חיים של Aiterra: חנויות אינטרנטיות, אתרי תדמית ולידים ומערכות ניהול, כולם בנויים בקוד. לכל פרויקט: מה הייתה המטרה, מה חובר ומה נבנה.',
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
        { label: 'פיתוח ואוטומציה', href: '/services/development' },
        { label: 'אתר תדמית', href: '/services/brochure' },
        { label: 'שיווק ופרסום ממומן', href: '/services/marketing' },
        { label: 'מיתוג ועיצוב', href: '/services/branding' },
        { label: 'תחזוקת אתרים', href: '/services/maintenance' },
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
        { label: 'יצירת קשר', href: '/contact' },
        { label: 'English site', href: '/en' },
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
  metaTitle: 'הסוכנות שלנו - צוות, ניסיון וגישה לעבודה',
  metaDescription:
    'Aiterra היא סוכנות פיתוח ושיווק דיגיטלי מגוש דן. הכירו את הצוות, שיטת העבודה והניסיון שמאחורי מאות פרויקטים לעסקים בישראל.',
  lede: 'הדיגיטל מתקדם – אנחנו דואגים שתהיו צעד אחד לפניו.',
  eyebrow: 'ABOUT Aiterra',
  heading: ['טכנולוגיה שבונה אתרים.', 'אסטרטגיה שבונה עסקים.'],
  paragraphs: [
    'מערכת 360° לצמיחה עסקית בדיגיטל. אנו ב-Aiterra מגשרים על הפער בין טכנולוגיה מורכבת לתוצאות עסקיות בשטח.',
    'משלב האסטרטגיה וה-UX ועד פיתוח מערכות סקילביליות, קידום אורגני (SEO) וניהול קמפיינים ממומנים – אנחנו הופכים את הנכס הדיגיטלי שלך למנוע צמיחה עוצמתי.',
  ],
  blocks: [
    {
      id: 'about',
      eyebrow: 'ABOUT Aiterra',
      heading: ['מקדמים בעלי עסקים', '2 צעדים קדימה'],
      text: 'ב-Aiterra אין צורך לרדוף אחרי ספקים שונים לכל שלב בדרך. אנחנו מרכזים את כל המומחיות – אפיון, עיצוב, פיתוח, קידום אורגני, קמפיינים ממומנים ויצירת תוכן – בצוות אחד שמגבש לעסק שלכם תהליך שלם. התוצאה? תהליך חלק יותר, תקשורת ישירה, ופתרון דיגיטלי שלם שבאמת מניע תוצאות.',
      image: '/images/about-page1.webp',
    },
    {
      id: 'strategy',
      eyebrow: 'OUR STRATEGY',
      heading: ['מאסטרטגיה ועד לתוצאות'],
      text: 'אנחנו ב-Aiterra לא רק בונים אתרים – אנחנו מלווים עסקים בכל שלב של הנוכחות הדיגיטלית. מעיצוב חוויית משתמש ופיתוח טכנולוגי, דרך קידום אורגני וקמפיינים ממומנים, ועד ליצירת תוכן שיווקי שמדבר לקהל שלכם. המעטפת הכוללת שלנו חוסכת לכם זמן, כסף ותיאומים מיותרים – ומאפשרת לכם להתמקד בלהצמיח את העסק.',
      image: '/images/about-page2.webp',
    },
  ],
  teamEyebrow: 'OUR PEOPLE',
  teamHeading: ['המוחות מאחורי הטכנולוגיה', 'וההצלחה שלכם'],
  teamLede: 'ב-Aiterra, אנחנו מאמינים שהטכנולוגיה הכי טובה בעולם לא שווה הרבה בלי האנשים הנכונים שמפעילים אותה. לכן, הרכבנו "סיירת דיגיטלית" ממוקדת-מטרה, המשלבת יכולות פיתוח עמוקות יחד עם אסטרטגיות שיווק ולידים אגרסיביות.',
  teamMore: 'עוד על',
  teamClose: 'סגירה',
  faqHeading: ['שאלות נפוצות עלינו', 'למה דווקא Aiterra?'],
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
      eyebrow: 'OUR ADVANTAGES',
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
      eyebrow: 'MANAGEMENT SYSTEM',
      heading: ['מערכת הניהול של Aiterra'],
      art: '/images/services-view.webp',
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
      eyebrow: 'HOW IT WORKS',
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
          'פיתוח אישי הוא בניית מערכות תוכנה, אפליקציות ומוצרים דיגיטליים בהתאמה מלאה לתהליכי העסק, במקום להתאים את העסק למגבלות של תבנית או מערכת מדף. בפועל זה אומר שמודל הנתונים, המסכים, ההרשאות והאוטומציות נגזרים מאיך שאתם עובדים היום ולא מרשימת הפיצ׳רים של מוצר קיים. הפיתוח נעשה ב-React, Next.js, TypeScript ו-Node.js, והקוד נמסר לבעלותכם בסיום. ההצדקה הכלכלית מופיעה כשהפער בין מה שהמערכת המוכנה עושה לבין מה שאתם באמת צריכים מתחיל לעלות כסף - בעבודה ידנית, ברישיונות למשתמשים שלא צריכים אותם, או בתוספים שנועדו לעקוף מגבלה.',
      },
      {
        question: 'למי השירות מתאים?',
        answer:
          'לעסקים ולארגונים שהתהליך המרכזי שלהם רץ היום על אקסלים, טפסים, קבוצות ווטסאפ ומיילים - מצב שעובד עד גודל מסוים ואז מתחיל לייצר טעויות, כפילויות ותלות באדם אחד שיודע איפה הכל נמצא. מתאים גם למי שמשלם על מערכת מדף ומנצל ממנה חלק קטן, ולסטארטאפים שצריכים מוצר ראשון עם משתמשים, הרשאות ותשלומים. בפועל אנחנו מחליפים את ההעברות הידניות בין הכלים במסכי עבודה, סטטוסים, טריגרים והתראות. הסימן הכי ברור שהגיע הזמן הוא כשמישהו בצוות מקליד את אותו נתון פעם שנייה במערכת אחרת, או כשאף אחד לא יודע מה הסטטוס בלי לשאול.',
      },
      {
        question: 'אילו סוגי פרויקטים אפשר לפתח?',
        answer:
          'מערכות ניהול פנימיות, פורטלים ללקוחות ולספקים, אזורים אישיים, אפליקציות ווב, בוטים לווטסאפ ואוטומציות שרצות ברקע. בכל אחד מהם נבנים מסכי ניהול, הרשאות לפי תפקיד, יומן פעולות, דוחות ואינטגרציות דרך API למערכות שכבר עובדות אצלכם - הנהלת חשבונות, CRM, מחסן או סליקה. גם מודול נקודתי שנוסף לצד מערכת קיימת הוא פרויקט לכל דבר, ולעיתים קרובות זו ההתחלה הנכונה: פותרים את הצוואר הכי כואב, רואים שהוא עובד, ומרחיבים משם. אנחנו מעדיפים את המסלול הזה על פני פרויקט ענק שנמסר בבת אחת אחרי שנה, כי כך משנים כיוון מוקדם ובזול.',
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
      eyebrow: 'OUR ADVANTAGES',
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
      eyebrow: 'REPORTING & TRACKING',
      heading: ['לוח הבקרה והדוחות שלכם'],
      art: '/images/chips-v2.webp',
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
      eyebrow: 'HOW IT WORKS',
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
      art: '/images/services-view-bg.webp',
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
    crumb: 'תחזוקת אתרים',
    eyebrow: 'תחזוקת אתרים',
    heading: ['תחזוקת אתרים ואחזקת אתר אינטרנט', 'עם מחירון וזמני תגובה בכתב'],
    subhead: 'שירות התחזוקה שלנו',
    lede: 'חבילות תחזוקה חודשיות עם מחירון גלוי, זמני תגובה ותיקון מוגדרים בהסכם, עדכוני אבטחה, גיבויים וניטור — גם לאתרים שלא נבנו אצלנו.',
    image: '/images/service2.webp',
    action: { label: 'בקשת הצעה לחוזה תחזוקה', href: '/contact' },
    metaTitle: 'תחזוקת אתרים ואחזקת אתר אינטרנט — מחירון חודשי',
    metaDescription:
      'חבילות תחזוקת אתרים חודשיות עם מחירון גלוי, זמני תגובה ותיקון בהסכם (SLA), עדכוני אבטחה, גיבויים וניטור. גם לאתרים שלא נבנו אצלנו.',
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
      art: '/images/management-console.webp',
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
        question: 'כמה עולה תחזוקת אתר בחודש?',
        answer:
          'נוח יותר להשוות בחישוב שנתי. לפי המדריך שלנו על עלות תחזוקת אתר, אתר תדמית קטן עולה כ-300 עד 900 ₪ בשנה כשמדובר בעיקר בדומיין ובאחסון, אתר עסקי עם תחזוקה מנוהלת כ-2,000 עד 6,000 ₪ בשנה, וחנות אונליין לרוב 6,000 ₪ ומעלה. אצלנו חבילת הבסיס היא 290 ₪ לחודש והחבילה העסקית 590 ₪ לחודש, שתיהן בהתחייבות שנתית; חנויות ומערכות מתומחרות לפי היקף. הסכומים האלה קונים מחזור מוגדר של עדכונים, גיבוי יומי מחוץ לשרת, ניטור זמינות וזמן תגובה כתוב בהסכם - ולא הבטחה כללית לזמינות. כדאי לזכור שתחזוקה היא רק חלק מעלות ההחזקה השנתית: לצידה יש אחסון, דומיין, תעודת SSL ולעיתים רישיונות. פירוט מלא של כל אלה לאורך שנה נמצא במדריך שלנו על עלות תחזוקת אתר.',
      },
      {
        question: 'מה כולל שירות תחזוקת אתרים ומה לא?',
        answer:
          'כלול: עדכוני ליבה, תוספים ותלויות קוד; גיבוי יומי שנשמר מחוץ לשרת; ניטור זמינות והתראות; תיקון תקלות; ושינויי תוכן שוטפים לפי מכסת השעות בחבילה. בחבילה העסקית ומעלה כלולות גם תחזוקת האינטגרציות הישראליות ובדיקת נגישות רבעונית. לא כלול: פיתוח פיצ׳רים חדשים, עיצוב מחדש של עמודים, כתיבת תוכן שיווקי, קידום אורגני וניהול קמפיינים. את אלה אנחנו מתמחרים בנפרד ובמכוון, כי חבילה שכוללת הכל גובה מכם מדי חודש על עבודה שאתם צורכים פעם בשנה. הגבול הזה כתוב בהסכם ולא נתון לפרשנות, וזה מה שמאפשר להשוות אותנו לספק אחר באותם מונחים.',
      },
      {
        question: 'אתם מתחזקים אתרים שלא בניתם?',
        answer:
          'כן, וזה חלק גדול מהעבודה שלנו. מתחילים במיפוי: על מה האתר בנוי, אילו גרסאות ותוספים רצים, מה מצב הגיבויים והאבטחה ומה כבר שבור עכשיו. אחר כך משיגים גישות לאחסון, לדומיין, ל-DNS ולמערכות המחוברות, מתעדים את המצב הקיים ומסדירים בעלות באופן פורמלי - במיוחד במקרה השכיח שבו המפתח הקודם נעלם, אין גישה לקוד, והדומיין רשום על שם מישהו שכבר לא עונה למיילים. אחרי שזה מוסדר האתר נכנס למחזור התחזוקה הרגיל. אם אתר במצב שבו תחזוקה שלו אינה כלכלית ובנייה מחדש תעלה פחות, נגיד לכם את זה בכנות ולא ניקח את העבודה.',
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
