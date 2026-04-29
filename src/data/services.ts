import type { Service } from '@/types'

export const services: Service[] = [
  {
    slug: 'web-development',
    upperTitle: 'בניית אתר לעסק, חנויות וירטואליות ופיתוח אפליקציות',
    title: 'בניית אתרים',
    heroTitle: 'עיצוב ובניית אתרים',
    heroDescription: 'תהליך העבודה: פיתוח, בנייה וקידום אתרים',
    description: 'איש המכירות הטוב ביותר שלכם. אנו מתמחים בבניית אתרי איקומרס, תדמית ומערכות מורכבות בסטנדרט הגבוה ביותר. שילוב של קוד נקי, מהירות טעינה קיצונית ועיצוב ממוקד המרות.',
    icon: '/icons/service-icon-website.svg',
    image: '/images/services/service1.png',
    cta: 'למידע נוסף על בניית אתרים',
  },
  {
    slug: 'seo',
    upperTitle: 'אסטרטגיית תוכן ו-SEO טכני מתקדם',
    title: 'אוטומציה ופיתוח מותאם',
    heroTitle: 'קידום אתרים בגוגל (SEO) – תנועה\nאורגנית שמייצרת הכנסה',
    heroDescription: 'תהליך העבודה: קידום אתרים אורגני בגוגל שמוביל לתוצאות',
    description: 'פתרונות טכנולוגיים שחוסכים זמן ומייעלים את העבודה. מבוטי וואטסאפ מתקדמים ועד לכלים ייעודיים שנתפרים בדיוק למידות העסק שלכם , כשמוצר המדף פשוט לא מספיק.',
    icon: '/icons/service-icon-seo.svg',
    image: '/images/services/service2.png',
    cta: 'למידע נוסף על פיתוח מותאם',
  },
  {
    slug: 'automation',
    upperTitle: 'אוטומציה עסקית, CRM ואינטגרציות מערכות',
    title: 'אוטומציה עסקית וחיבור מערכות',
    heroTitle: 'אוטומציה עסקית – חסכו זמן\nוהכניסו יותר לידים',
    heroDescription: 'תהליך העבודה: בניית מערכות אוטומציה שעובדות בשבילכם 24/7',
    description:
      'שירות הקידום האורגני (SEO) שלנו ימקם אתכם בראש החיפוש בגוגל. בעזרת אופטימיזציה טכנית ,תוכן חכם וקישורים חיצוניים נייצר לכם תנועה יציבה והכנסה לטווח ארוך.',
    icon: '/icons/service-icon-auto.svg',
    image: '/images/services/service3.png',
    cta: 'למידע נוסף על SEO',
  },
  {
    slug: 'adv',
    upperTitle: 'ניהול קמפיינים ממומנים בגוגל, פייסבוק ואינסטגרם',
    title: 'פרסום ממומן (PPC)',
    heroTitle: 'פרסום ממומן שמביא לידים\nאיכותיים כאן ועכשיו',
    heroDescription: 'תהליך העבודה: ניהול קמפיינים ממומנים עם ROI מדיד',
    description: 'תוצאות מהירות מתחילות באסטרטגיית פרסום חכמה. אנו מנהלים תקציבים גדולים במקצועיות, כשהמטרה ברורה: ביצועי שיא והחזר השקעה (ROI) חיובי.',
    icon: '/icons/service-icon-ads.svg',
    image: '/images/services/service4.png',
    cta: 'למידע נוסף על ניהול קמפיינים ו-PPC',
  },
]

export function getServiceBySlug(slug: string): Service | undefined {
  return services.find((s) => s.slug === slug)
}
