import type { Metadata } from 'next'
import Nav from '@/components/ecomerce/layout/Nav'
import Footer from '@/components/ecomerce/layout/Footer'
import ScrollProgress from '@/components/ecomerce/ui/ScrollProgress'
import HeroSection from '@/components/ecomerce/sections/HeroSection'
import StatementSection from '@/components/ecomerce/sections/StatementSection'
import TeamSection from '@/components/ecomerce/sections/TeamSection'
import AdvantagesSection from '@/components/ecomerce/sections/AdvantagesSection'
import PortfolioSection from '@/components/ecomerce/sections/PortfolioSection'
import TestimonialsSection from '@/components/ecomerce/sections/TestimonialsSection'
import CtaBannerSection from '@/components/ecomerce/sections/CtaBannerSection'
import LeadFormSection from '@/components/ecomerce/sections/LeadFormSection'

export const metadata: Metadata = {
  title: 'חנות אינטרנטית שמייצרת מכירות — פיתוח איקומרס פרימיום',
  description:
    'מערכת איקומרס עצמאית ומתקדמת, ללא מגבלות וורדפרס או שופיפיי. עיצוב מותאם אישית, אינטגרציה מלאה, מהירות טעינה גבוהה וליווי צמוד לשנה שלמה. השאירו פרטים לשיחת אפיון.',
  alternates: { canonical: '/landings/ecomerce' },
  openGraph: {
    type: 'website',
    locale: 'he_IL',
    url: '/landings/ecomerce',
    title: 'Aiterra | חנות אינטרנטית שמייצרת מכירות — פיתוח איקומרס פרימיום',
    description:
      'מערכת איקומרס עצמאית ומתקדמת, ללא מגבלות וורדפרס או שופיפיי. עיצוב מותאם אישית, אינטגרציה מלאה וליווי צמוד לשנה שלמה.',
  },
}

/**
 * The standalone e-commerce landing, served inside the main site at
 * /landings/ecomerce. Everything renders inside `.ecom`: the landing's own
 * design system (src/styles/ecomerce.css) scopes its base type, selection and
 * focus rules to this wrapper so the rest of the site is untouched. The landing
 * ships its own Nav/Footer, so it does not use the site's global chrome.
 */
export default function EcommerceLandingPage() {
  return (
    <div className="ecom">
      <ScrollProgress />
      <Nav />
      <main id="main-content">
        <HeroSection />
        <StatementSection />
        <TeamSection />
        <AdvantagesSection />
        <PortfolioSection />
        <TestimonialsSection />
        <CtaBannerSection />
        <LeadFormSection />
      </main>
      <Footer />
    </div>
  )
}
