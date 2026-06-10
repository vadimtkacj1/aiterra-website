import type { Metadata } from 'next'
import { metadataForRoute } from '@/lib/site-seo-server'
import RouteJsonLd from '@/components/seo/RouteJsonLd'
import BreadcrumbSchema from '@/components/seo/BreadcrumbSchema'

export async function generateMetadata(): Promise<Metadata> {
  return metadataForRoute('/about')
}

import HeaderAlt from '@/components/layout/HeaderAlt'
import Footer from '@/components/layout/Footer'
import StickyPageFooter from '@/components/layout/StickyPageFooter'
import {
  AboutHeroSection,
  TechSliderSection,
  StatsSection,
  CtaSection,
} from '@/components/sections'
import FaqSection from '@/components/sections/common/FaqSection'
import Breadcrumb from '@/components/ui/Breadcrumb'
import TeamSection from '@/components/sections/common/TeamSection'
import { getFaqData } from '@/lib/faq-server'

export default function AboutPage() {
  const faqData = getFaqData('/about')
  return (
    <div className="relative flex flex-col min-h-screen bg-white">
      <RouteJsonLd path="/about" />
      <BreadcrumbSchema items={[{ label: 'אודותינו', href: '/about' }]} />
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
          <FaqSection data={faqData} />
        </main>
        <StickyPageFooter className="z-10">
          <Footer />
        </StickyPageFooter>
      </div>
    </div>
  )
}
