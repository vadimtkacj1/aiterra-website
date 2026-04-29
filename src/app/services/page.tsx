import type { Metadata } from 'next'
import { SITE_URL } from '@/lib/seo'

export const metadata: Metadata = {
  title: 'שירותים',
  description: 'מעטפת שירותים דיגיטלית מלאה: בניית אתרים, קידום SEO, פרסום ממומן ואוטומציה עסקית לעסקים בישראל.',
  alternates: { canonical: `${SITE_URL}/services` },
  openGraph: {
    title: 'שירותים | AITERRA',
    description: 'מעטפת שירותים דיגיטלית מלאה: בניית אתרים, קידום SEO, פרסום ממומן ואוטומציה עסקית לעסקים בישראל.',
    url: `${SITE_URL}/services`,
    locale: 'he_IL',
  },
}

import HeaderAlt from '@/components/layout/HeaderAlt'
import Footer from '@/components/layout/Footer'
import StickyPageFooter from '@/components/layout/StickyPageFooter'
import {
  ServicesHeroSection,
  ServicesIntroSection,
  CtaSection,
  FaqSection,
  ServicesSection,
} from '@/components/sections'
import Breadcrumb from '@/components/ui/Breadcrumb'

export default function ServicesPage() {
  return (
    <div className="relative flex flex-col min-h-screen bg-white">
      <HeaderAlt transparent />
      <div className="relative z-15 -mt-28 md:-mt-48" style={{ background: '#080112' }}>
        <ServicesHeroSection />
      </div>
      <div className="flex min-h-0 w-full flex-1 flex-col">
        <main className="relative z-20 flex-1 bg-white shadow-[0_20px_50px_rgba(0,0,0,0.1)]">
          <div className="max-w-7xl mx-auto px-6 pt-6 pb-2">
            <Breadcrumb items={[{ label: 'שירותים', href: '/services' }]} />
          </div>
          <ServicesIntroSection />
          <ServicesSection />
          <CtaSection />
          <FaqSection />
        </main>
        <StickyPageFooter className="z-10">
          <Footer />
        </StickyPageFooter>
      </div>
    </div>
  )
}
