import type { BlogPost } from '@/types'

export const blogPosts: BlogPost[] = [
  {
    slug: 'why-website-speed-matters',
    title: 'למה מהירות האתר משפיעה ישירות על ההכנסות שלכם',
    excerpt: 'מחקרים מראים שכל שנייה נוספת בזמן טעינה מורידה את ההמרות ב-7%. גלו איך Core Web Vitals משפיעים על הדירוג בגוגל ועל חוויית המשתמש.',
    datePublished: '2025-03-15',
    author: 'צוות Aiterra',
    tags: ['ביצועים', 'SEO', 'Core Web Vitals'],
    image: '/images/services/service1.png',
  },
  {
    slug: 'seo-guide-2025',
    title: 'המדריך המלא לקידום אורגני ב-2025',
    excerpt: 'כל מה שצריך לדעת על SEO טכני, בניית קישורים ואסטרטגיית תוכן שמביאה תנועה אורגנית איכותית לאורך זמן.',
    datePublished: '2025-02-20',
    author: 'צוות Aiterra',
    tags: ['SEO', 'תוכן', 'קידום אורגני'],
    image: '/images/services/service2.png',
  },
  {
    slug: 'nextjs-vs-wordpress',
    title: 'Next.js מול WordPress – מה מתאים לעסק שלכם?',
    excerpt: 'השוואה מקיפה בין פלטפורמות הפיתוח המובילות: ביצועים, עלויות, גמישות וקלות ניהול. מה הבחירה הנכונה לעסק שלכם?',
    datePublished: '2025-01-10',
    author: 'צוות Aiterra',
    tags: ['Next.js', 'WordPress', 'פיתוח'],
    image: '/images/services/service3.png',
  },
  {
    slug: 'digital-branding-guide',
    title: 'מיתוג דיגיטלי – איך לבנות זהות מותגית חזקה אונליין',
    excerpt: 'מלוגו ופלטת צבעים ועד אסטרטגיית נוכחות דיגיטלית מלאה. המדריך שלנו לבניית מותג שנשאר בזיכרון.',
    datePublished: '2024-12-05',
    author: 'צוות Aiterra',
    tags: ['מיתוג', 'עיצוב', 'דיגיטל'],
    image: '/images/services/service4.png',
  },
]

export function getPostBySlug(slug: string): BlogPost | undefined {
  return blogPosts.find((p) => p.slug === slug)
}
