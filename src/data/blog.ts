import type { BlogPost } from '@/types'

export const blogPosts: BlogPost[] = [
  {
    slug: 'website-performance-2026',
    title: 'למה האתר שלכם איטי? המדריך המלא לשנת 2026 על פיתוח אתרים מתקדם',
    excerpt: 'אתר איטי שורף לכם תקציבים ומרחיק לקוחות. המדריך המלא לפיתוח אתרים מתקדם — קוד נקי, Next.js, Core Web Vitals, ומתי כדאי לשדרג ומתי לבנות מחדש.',
    datePublished: '2026-04-26',
    author: 'צוות Aiterra',
    tags: ['ביצועים', 'SEO', 'פיתוח', 'Core Web Vitals'],
    image: '/images/services/service1.png',
  },
  {
    slug: 'local-seo-small-business',
    title: 'שולטים בעיר שלכם: המדריך המלא על קידום עסקים קטנים וגיוס לידים חמים',
    excerpt: 'מתווך בחולון או רופא שיניים בקריות צריכים לקוחות מהאזור שלהם. כך בונים מכונה שמייצרת לידים לעסקים על בסיס יומי עם Local SEO.',
    datePublished: '2026-04-26',
    author: 'צוות Aiterra',
    tags: ['SEO', 'קידום אורגני', 'דיגיטל'],
    image: '/images/services/service4.png',
  },
  {
    slug: 'seo-services',
    title: 'שירותי קידום אתרים: להגיע למקום הראשון עם קידום אורגני שמביא תוצאות',
    excerpt: 'אם הלקוחות שלכם לא מוצאים אתכם בגוגל, אתם משאירים כסף על הרצפה. ב-Aiterra הופכים את האתר שלכם למכונת לידים שעובדת 24/7.',
    datePublished: '2026-04-26',
    author: 'צוות Aiterra',
    tags: ['SEO', 'קידום אורגני', 'פיתוח'],
    image: '/images/services/service3.png',
  },
  {
    slug: 'google-ads-campaigns',
    title: 'פרסום בגוגל וניהול קמפיינים: שיווק דיגיטלי שמביא לידים חמים',
    excerpt: 'כל שקל שיוצא על פרסום חייב לחזור אליכם עם רווח. ב-Aiterra בונים אסטרטגיית שיווק דיגיטלי שעוצרת את הדימום התקציבי וממירה קליקים ללידים חמים.',
    datePublished: '2026-04-26',
    author: 'צוות Aiterra',
    tags: ['SEO', 'דיגיטל', 'פיתוח'],
    image: '/images/services/service2.png',
  },
  {
    slug: 'website-building-services',
    title: 'בניית אתרים: שירותי בניית אתרים לעסק ופיתוח טכנולוגי מתקדם',
    excerpt: 'האתר שלכם הוא איש המכירות היחיד שעובד 24/7. ב-Aiterra אנחנו בונים תשתיות לצמיחה – עם טכנולוגיות מתקדמות, UX מנצח והכנה מושלמת לקידום אורגני.',
    datePublished: '2026-04-26',
    author: 'צוות Aiterra',
    tags: ['פיתוח', 'עיצוב', 'SEO', 'WordPress'],
    image: '/images/services/service1.png',
  },
]

export function getPostBySlug(slug: string): BlogPost | undefined {
  return blogPosts.find((p) => p.slug === slug)
}
