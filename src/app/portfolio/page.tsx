import HeaderAlt from '@/components/layout/HeaderAlt'
import Footer from '@/components/layout/Footer'
import StickyPageFooter from '@/components/layout/StickyPageFooter'
import { PortfolioHeroSection, PortfolioSection, CtaSection, FaqSection, PartnersSection } from '@/components/sections'

export default function PortfolioPage() {
  return (
    <div className="relative flex flex-col min-h-screen bg-white">
      <HeaderAlt transparent />
      <div className="relative z-[15] -mt-28 md:-mt-48" style={{ background: '#080112' }}>
        <PortfolioHeroSection />
      </div>
      <div className="flex min-h-0 w-full flex-1 flex-col">
        <main id="portfolio-grid" className="relative z-20 flex-1 bg-white shadow-[0_20px_50px_rgba(0,0,0,0.1)]">
          <PortfolioSection showButton={false} />
          <PartnersSection />
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
