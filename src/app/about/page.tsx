import HeaderAlt from '@/components/layout/HeaderAlt'
import Footer from '@/components/layout/Footer'
import StickyPageFooter from '@/components/layout/StickyPageFooter'
import {
  AboutHeroSection,
  TeamSection,
  TechSliderSection,
  StatsSection,
  CtaSection,
  FaqSection,
} from '@/components/sections'
import Breadcrumb from '@/components/ui/Breadcrumb'

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
