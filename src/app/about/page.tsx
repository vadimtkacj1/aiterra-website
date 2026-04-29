import type { Metadata } from 'next'
import { SITE_URL } from '@/lib/seo'

export const metadata: Metadata = {
  title: 'אודותינו',
  description: 'הכירו את AITERRA – סוכנות שיווק דיגיטלי ופיתוח אתרים. הצוות, הערכים והחזון שמניעים אותנו לתוצאות.',
  alternates: { canonical: `${SITE_URL}/about` },
  openGraph: {
    title: 'אודותינו | AITERRA',
    description: 'הכירו את AITERRA – סוכנות שיווק דיגיטלי ופיתוח אתרים. הצוות, הערכים והחזון שמניעים אותנו לתוצאות.',
    url: `${SITE_URL}/about`,
    locale: 'he_IL',
  },
}

import HeaderAlt from '@/components/layout/HeaderAlt'
import Footer from '@/components/layout/Footer'
import StickyPageFooter from '@/components/layout/StickyPageFooter'
import {
  AboutHeroSection,
  TechSliderSection,
  StatsSection,
  CtaSection,
  FaqSection,
} from '@/components/sections'
import Breadcrumb from '@/components/ui/Breadcrumb'
import TeamSection from '@/components/sections/common/TeamSection'

export default function AboutPage() {
  return (
    <div className="relative flex flex-col min-h-screen bg-white">
      <HeaderAlt />
      <div className="flex min-h-0 w-full flex-1 flex-col">
        <main className="relative z-20 flex-1 bg-white shadow-[0_20px_50px_rgba(0,0,0,0.1)]">
          <AboutHeroSection />
          <div className="max-w-7xl mx-auto px-6 pt-4 pb-2">
            <Breadcrumb items={[{ label: 'אודותינו', href: '/about' }]} />
          </div>
          <TechSliderSection />
          <StatsSection />
          <TeamSection />
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
