import type { Service } from '@/types'

export const services: Service[] = [
  {
    slug: 'web-development',
    upperTitle: 'בניית אתר לעסק, חנויות וירטואליות ופיתוח אפליקציות',
    title: 'בניית אתרים ופיתוח מערכות בהתאמה אישית',
    heroTitle: 'פיתוח ובניית אתרים\nלעסקים בהתאמה אישית',
    heroDescription: 'תהליך העבודה: פיתוח, בנייה וקידום אתרים',
    description:
      'האתר הוא כלי המכירות המרכזי שלכם. אנחנו מתמחים בשירותי בניית אתרים איכותיים – החל מהקמת אתר תדמית מרהיב, דרך בניית אתר מכירות (איקומרס), ועד בניית אתר וורדפרס ופיתוח מערכות מורכבות. אנו שמים דגש על ארכיטקטורת קוד נקייה, מהירות טעינה קיצונית (Core Web Vitals) ועיצוב שמניע לפעולה.',
    icon: '/icons/service-icon-website.svg',
    image: '/images/services/service1.png',
  },
  {
    slug: 'seo',
    upperTitle: 'אסטרטגיית תוכן ו-SEO טכני מתקדם',
    title: 'קידום אורגני (SEO) ותנועה איכותית',
    heroTitle: 'קידום אתרים בגוגל (SEO) – תנועה\nאורגנית שמייצרת הכנסה',
    heroDescription: 'תהליך העבודה: קידום אתרים אורגני בגוגל שמוביל לתוצאות',
    description:
      'אסטרטגיית תוכן ו-SEO טכני שמביאים תנועה אורגנית איכותית לאורך זמן. אנחנו בונים נוכחות דיגיטלית חזקה שתניב תוצאות גם עוד שנים קדימה.',
    icon: '/icons/service-icon-seo.svg',
    image: '/images/services/service2.png',
  },
  {
    slug: 'automation',
    upperTitle: 'אוטומציה עסקית, CRM ואינטגרציות מערכות',
    title: 'אוטומציה עסקית וחיבור מערכות',
    heroTitle: 'אוטומציה עסקית – חסכו זמן\nוהכניסו יותר לידים',
    heroDescription: 'תהליך העבודה: בניית מערכות אוטומציה שעובדות בשבילכם 24/7',
    description:
      'מחברים בין כל הכלים הדיגיטליים שלכם – CRM, דוא"ל, ווטסאפ, טפסים ועוד. מייצרים תהליכים אוטומטיים שמנהלים לידים, שולחים מסרים ומדווחים בלי התערבות ידנית.',
    icon: '/icons/service-icon-auto.svg',
    image: '/images/services/service3.png',
  },
  {
    slug: 'adv',
    upperTitle: 'ניהול קמפיינים ממומנים בגוגל, פייסבוק ואינסטגרם',
    title: 'פרסום ממומן וניהול קמפיינים',
    heroTitle: 'פרסום ממומן שמביא לידים\nאיכותיים כאן ועכשיו',
    heroDescription: 'תהליך העבודה: ניהול קמפיינים ממומנים עם ROI מדיד',
    description:
      'מנהלים תקציבי פרסום בגוגל אדס, פייסבוק, אינסטגרם וטיקטוק עם דגש על החזר השקעה. כל קמפיין מחובר ישירות ל-CRM שלכם לעבודה חלקה ולידים איכותיים.',
    icon: '/icons/service-icon-ads.svg',
    image: '/images/services/service4.png',
  },
]

export function getServiceBySlug(slug: string): Service | undefined {
  return services.find((s) => s.slug === slug)
}
