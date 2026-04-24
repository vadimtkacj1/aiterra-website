'use client'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import {
  HeroSection,
  TechSliderSection,
  StatsSection,
  FaqSection,
  CtaSection,
  ServicesSection,
  PortfolioSection,
  PartnersSection,
} from '@/components/sections'

export default function HomePage() {
  return (
    <div className="relative flex flex-col min-h-screen bg-white">
      <Header />

      <div className="flex min-h-0 flex-1 flex-col">
        <main className="relative -mt-28 z-70 flex-1 bg-white shadow-[0_20px_50px_rgba(0,0,0,0.1)]">
          <HeroSection />
          <TechSliderSection />
          <StatsSection />
          <ServicesSection />
          <PortfolioSection />
          <PartnersSection />
          <CtaSection />
          <FaqSection />
        </main>
        <div className="sticky bottom-0 z-60 mt-auto w-full mt-[50px]">
          <Footer />
        </div>
      </div>
    </div>
  )
}