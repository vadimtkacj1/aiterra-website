import type { PortfolioProject } from '@/types'

export const portfolioProjects: PortfolioProject[] = [
  {
    slug: 'olie-6',
    title: 'Olie 6',
    category: 'בניית אתרים',
    heroTitle: 'Olie 6',
    heroDescription: 'פרויקט בניית אתר מלא עם עיצוב מותאם אישית, חוויית משתמש מתקדמת ואינטגרציה מלאה עם מערכות ניהול תוכן.',
    image: '/images/portfolio/portfolio1.png',
    tags: ['Next.js', 'Tailwind CSS', 'TypeScript'],
  },
  {
    slug: 'ecommerce-store',
    title: 'חנות דיגיטלית',
    category: 'חנויות וירטואליות',
    heroTitle: 'חנות דיגיטלית מתקדמת',
    heroDescription: 'פיתוח חנות וירטואלית מלאה עם סל קניות, עיבוד תשלומים מאובטח ומערכת ניהול מוצרים מתקדמת.',
    image: '/images/portfolio/portfolio2.png',
    tags: ['React', 'Node.js', 'Stripe'],
  },
  {
    slug: 'brand-identity',
    title: 'מיתוג ועיצוב',
    category: 'מיתוג',
    heroTitle: 'מיתוג ועיצוב מותג',
    heroDescription: 'בניית זהות מותגית מלאה הכוללת לוגו, פלטת צבעים, טיפוגרפיה ומדריך סגנון לשימוש עקבי בכל הפלטפורמות.',
    image: '/images/portfolio/portfolio3.png',
    tags: ['Figma', 'Adobe Illustrator', 'Branding'],
  },
  {
    slug: 'marketing-platform',
    title: 'פלטפורמת שיווק',
    category: 'קידום דיגיטלי',
    heroTitle: 'פלטפורמת שיווק דיגיטלי',
    heroDescription: 'פיתוח פלטפורמת שיווק אוטומטית עם אינטגרציות CRM, ניהול קמפיינים ודשבורד אנליטיקס בזמן אמת.',
    image: '/images/portfolio/portfolio4.png',
    tags: ['React', 'Python', 'Analytics'],
  },
]

export function getProjectBySlug(slug: string): PortfolioProject | undefined {
  return portfolioProjects.find((p) => p.slug === slug)
}
