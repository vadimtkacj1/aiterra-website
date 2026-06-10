import type { Metadata } from 'next'
import { metadataForRoute } from '@/lib/site-seo-server'
import RouteJsonLd from '@/components/seo/RouteJsonLd'
import HeaderAlt from '@/components/layout/HeaderAlt'
import Footer from '@/components/layout/Footer'
import StickyPageFooter from '@/components/layout/StickyPageFooter'
import { ServicePageHeroSection, WebDevProcessSection, CtaSection } from '@/components/sections'
import FaqSection from '@/components/sections/common/FaqSection'
import PortfolioSection from '@/components/sections/portfolio/PortfolioSection'
import { getServiceBySlug } from '@/data/services'
import { notFound } from 'next/navigation'
import Breadcrumb from '@/components/ui/Breadcrumb'
import ServiceSchema from '@/components/seo/ServiceSchema'
import BreadcrumbSchema from '@/components/seo/BreadcrumbSchema'
import { getFaqData } from '@/lib/faq-server'

export async function generateMetadata(): Promise<Metadata> {
  return metadataForRoute('/services/web-development')
}

export default function WebDevelopmentPage() {
  const service = getServiceBySlug('web-development')
  if (!service) notFound()
  const faqData = getFaqData('/services/web-development')

  return (
    <div className="relative flex flex-col min-h-screen bg-white">
      <RouteJsonLd path="/services/web-development" />
      <BreadcrumbSchema items={[{ label: 'שירותים', href: '/services' }, { label: service.title, href: '/services/web-development' }]} />
      <ServiceSchema
        name={service.title}
        description={service.description}
        urlPath="/services/web-development"
      />
      <HeaderAlt transparent />
      <div className="relative z-[15] -mt-28 md:-mt-48" style={{ background: '#080112' }}>
        <ServicePageHeroSection service={service} />
      </div>
      <div className="flex min-h-0 w-full flex-1 flex-col">
        <main className="relative z-20 flex-1 bg-white shadow-[0_20px_50px_rgba(0,0,0,0.1)]">
          <div className="max-w-7xl mx-auto px-6 pt-6 pb-2">
            <Breadcrumb items={[{ label: 'שירותים', href: '/services' }, { label: service.title }]} />
          </div>
          <WebDevProcessSection />
          <CtaSection />
          <FaqSection data={faqData} />
          <PortfolioSection />
        </main>
        <StickyPageFooter className="z-10">
          <Footer />
        </StickyPageFooter>
      </div>
    </div>
  )
}
