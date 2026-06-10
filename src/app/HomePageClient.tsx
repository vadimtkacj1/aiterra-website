'use client'

import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import StickyPageFooter from '@/components/layout/StickyPageFooter'
import {
  HeroSection,
  TechSliderSection,
  StatsSection,
  FaqSection,
  CtaSection,
  ServicesSection,
  PortfolioGrid,
  PartnersSection,
} from '@/components/sections'
import type { PortfolioProject } from '@/types'
import type { FaqData } from '@/lib/faq-server'

export default function HomePageClient({ portfolioProjects, faqData }: { portfolioProjects: PortfolioProject[]; faqData: FaqData }) {
  return (
    <div className="relative flex flex-col min-h-screen bg-white">
      <Header />

      <div className="flex min-h-0 flex-1 flex-col">
        <main id="main-content" className="relative -mt-28 z-70 flex-1 bg-white shadow-[0_20px_50px_rgba(0,0,0,0.1)]">
          <HeroSection />
          <TechSliderSection />
          <StatsSection />
          <ServicesSection />
          <PortfolioGrid projects={portfolioProjects} />
          <PartnersSection />
          <CtaSection />
          <FaqSection data={faqData} />
        </main>
        <StickyPageFooter className="z-60 mt-[50px]">
          <Footer />
        </StickyPageFooter>
      </div>
    </div>
  )
}
