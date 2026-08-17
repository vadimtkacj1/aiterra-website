import type { Metadata } from 'next'
import { metadataForRoute } from '@/lib/site-seo-server'
import RouteJsonLd from '@/components/seo/RouteJsonLd'
import BreadcrumbSchema from '@/components/seo/BreadcrumbSchema'
import HeaderAlt from '@/components/layout/HeaderAlt'
import Footer from '@/components/layout/Footer'
import StickyPageFooter from '@/components/layout/StickyPageFooter'
import { PortfolioHeroSection, CtaSection, PartnersSection } from '@/components/sections'
import FaqSection from '@/components/sections/common/FaqSection'
import PortfolioSection from '@/components/sections/portfolio/PortfolioSection'
import Breadcrumb from '@/components/ui/Breadcrumb'
import { getFaqData } from '@/lib/faq-server'

export async function generateMetadata(): Promise<Metadata> {
  return metadataForRoute('/portfolio')
}

export default function PortfolioPage() {
  const faqData = getFaqData('/portfolio')
  return (
    <div className="relative flex flex-col min-h-screen bg-white">
      <RouteJsonLd path="/portfolio" />
      <BreadcrumbSchema items={[{ label: 'תיק עבודות', href: '/portfolio' }]} />
      <HeaderAlt transparent />
      <div className="relative z-15 -mt-28 md:-mt-48" style={{ background: '#060B22' }}>
        <PortfolioHeroSection />
      </div>
      <div className="flex min-h-0 w-full flex-1 flex-col">
        <main id="main-content" className="relative z-20 flex-1 bg-white shadow-[0_20px_50px_rgba(0,0,0,0.1)]">
          <div id="portfolio-grid" className="max-w-7xl mx-auto px-6 pt-6 pb-2">
            <Breadcrumb items={[{ label: 'תיק עבודות', href: '/portfolio' }]} />
          </div>
          <PortfolioSection showButton={false} />
          <PartnersSection />
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
