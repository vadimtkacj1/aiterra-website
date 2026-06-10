import { SITE_NAME, SITE_URL } from '@/lib/seo'

export interface RouteSeoPayload {
  title: string
  description: string
  /** Open Graph title; empty = auto (`title | SITE_NAME` if title has no `|`) */
  ogTitle?: string
  /** Open Graph description; empty = same as meta description */
  ogDescription?: string
  /** Twitter card title; empty = Open Graph title */
  twitterTitle?: string
  /** Twitter description; empty = meta description */
  twitterDescription?: string
  /** Comma-separated keywords → `<meta name="keywords">` */
  keywords?: string
  /**
   * JSON-LD: one object `{ "@context": ... }` or array `[{...},{...}]`.
   * Injected on the page as `<script type="application/ld+json">`.
   */
  jsonLd?: string
}

export type SiteSeoFile = Partial<Record<string, RouteSeoPayload>>

/** Routes editable in admin; keys must match `metadataForRoute` paths. */
export const EDITABLE_SEO_ROUTES: { path: string; label: string }[] = [
  { path: '/', label: 'דף הבית' },
  { path: '/about', label: 'אודות' },
  { path: '/contact', label: 'צור קשר' },
  { path: '/services', label: 'שירותים' },
  { path: '/services/web-development', label: 'שירות — בניית אתרים' },
  { path: '/services/seo', label: 'שירות — SEO' },
  { path: '/services/automation', label: 'שירות — אוטומציה' },
  { path: '/services/adv', label: 'שירות — פרסום ממומן' },
  { path: '/portfolio', label: 'תיק עבודות' },
  { path: '/blog', label: 'בלוג' },
]

export const ROUTE_DEFAULTS: Record<string, RouteSeoPayload> = {
  '/': {
    title: 'AITERRA | שיווק דיגיטלי, בניית אתרים ופיתוח מתקדם',
    description:
      'סוכנות AITERRA מציעה מערכת 360° לצמיחה עסקית: בניית אתרים מתקדמת, קידום אורגני SEO, פרסום ממומן ואוטומציה עסקית. ייעוץ חינם – השאירו פרטים!',
  },
  '/about': {
    title: 'אודותינו',
    description:
      'הכירו את AITERRA – סוכנות שיווק דיגיטלי ופיתוח אתרים. הצוות, הערכים והחזון שמניעים אותנו לתוצאות.',
  },
  '/contact': {
    title: 'צור קשר',
    description:
      'צרו איתנו קשר לשיחת ייעוץ חינם. בניית אתרים, קידום SEO, פרסום ממומן ואוטומציה עסקית. משרד: רחוב הרב ניסנבאום 37, בת ים.',
  },
  '/services': {
    title: 'שירותים',
    description:
      'מעטפת שירותים דיגיטלית מלאה: בניית אתרים, קידום SEO, פרסום ממומן ואוטומציה עסקית לעסקים בישראל.',
  },
  '/services/web-development': {
    title: 'עיצוב ובניית אתרים לעסקים | AITERRA',
    description:
      'בניית אתרי איקומרס, תדמית ומערכות מורכבות בסטנדרט הגבוה ביותר. קוד נקי, מהירות טעינה קיצונית ועיצוב ממוקד המרות. שירות לעסקים בישראל.',
  },
  '/services/seo': {
    title: 'קידום אתרים בגוגל (SEO)',
    description:
      'שירות SEO מקיף: אופטימיזציה טכנית, תוכן חכם, בניית קישורים חיצוניים ומעקב חודשי אחר מיקומים. תנועה אורגנית שמייצרת הכנסה.',
  },
  '/services/automation': {
    title: 'אוטומציה עסקית וחיבור מערכות',
    description:
      'בניית מערכות אוטומציה, CRM ואינטגרציות שחוסכות זמן ומייעלות את תהליכי העסק שלכם 24/7.',
  },
  '/services/adv': {
    title: 'פרסום ממומן (PPC) בגוגל ורשתות חברתיות',
    description:
      'ניהול קמפיינים ממומנים בגוגל, פייסבוק ואינסטגרם עם ROI מדיד. לידים איכותיים כאן ועכשיו עם אסטרטגיית פרסום חכמה.',
  },
  '/portfolio': {
    title: 'תיק עבודות',
    description:
      'פרויקטים נבחרים: בניית אתרים, חנויות דיגיטליות, שיווק ומיתוג. AITERRA — תוצאות בשטח.',
  },
  '/blog': {
    title: 'בלוג',
    description: 'מאמרים מקצועיים על SEO, בניית אתרים, קידום דיגיטלי וצמיחה עסקית.',
  },
}

export function canonicalPath(routePath: string) {
  if (routePath === '/') return SITE_URL
  return `${SITE_URL}${routePath}`
}

export function ogTitleFromPageTitle(pageTitle: string) {
  if (pageTitle.includes('|')) return pageTitle
  return `${pageTitle} | ${SITE_NAME}`
}
