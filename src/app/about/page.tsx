import HeaderAlt from '@/components/layout/HeaderAlt'
import Footer from '@/components/layout/Footer'
import {
  AboutHeroSection,
  TeamSection,
  TechSliderSection,
  StatsSection,
  CtaSection,
  FaqSection,
} from '@/components/sections'

export default function AboutPage() {
  return (
    <div className="relative flex flex-col min-h-screen bg-white">
      <HeaderAlt />
      <div className="flex min-h-0 w-full flex-1 flex-col">
        <main className="relative z-20 flex-1 bg-white shadow-[0_20px_50px_rgba(0,0,0,0.1)]">
          <AboutHeroSection />
          <TechSliderSection />
          <StatsSection />
          <TeamSection />
          <CtaSection />
          <FaqSection />
        </main>
        <div className="sticky bottom-0 z-10 mt-auto w-full">
          <Footer />
        </div>
      </div>
    </div>
  )
}
