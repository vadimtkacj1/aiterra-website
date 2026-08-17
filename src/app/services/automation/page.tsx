import type { Metadata } from 'next'
import { metadataForRoute } from '@/lib/site-seo-server'
import RouteJsonLd from '@/components/seo/RouteJsonLd'
import HeaderAlt from '@/components/layout/HeaderAlt'
import Footer from '@/components/layout/Footer'
import StickyPageFooter from '@/components/layout/StickyPageFooter'
import { ServicePageHeroSection, AutomationProcessSection, CtaSection } from '@/components/sections'
import FaqSection from '@/components/sections/common/FaqSection'
import { getServiceBySlug } from '@/data/services'
import { notFound } from 'next/navigation'
import Breadcrumb from '@/components/ui/Breadcrumb'
import ServiceSchema from '@/components/seo/ServiceSchema'
import BreadcrumbSchema from '@/components/seo/BreadcrumbSchema'
import { getFaqData } from '@/lib/faq-server'

export async function generateMetadata(): Promise<Metadata> {
  return metadataForRoute('/services/automation')
}

export default function AutomationPage() {
  const service = getServiceBySlug('automation')
  if (!service) notFound()
  const faqData = getFaqData('/services/automation')

  return (
    <div className="relative flex flex-col min-h-screen bg-white">
      <RouteJsonLd path="/services/automation" />
      <BreadcrumbSchema items={[{ label: 'שירותים', href: '/services' }, { label: service.title, href: '/services/automation' }]} />
      <ServiceSchema
        name="אוטומציה עסקית וחיבור מערכות"
        description="בניית מערכות אוטומציה, CRM ואינטגרציות שחוסכות זמן ומייעלות את תהליכי העסק שלכם 24/7."
        urlPath="/services/automation"
      />
      <HeaderAlt transparent />
      <div className="relative z-[15] -mt-28 md:-mt-48" style={{ background: '#060B22' }}>
        <ServicePageHeroSection service={service} />
      </div>
      <div className="flex min-h-0 w-full flex-1 flex-col">
        <main id="main-content" className="relative z-20 flex-1 bg-white shadow-[0_20px_50px_rgba(0,0,0,0.1)]">
          <div className="max-w-7xl mx-auto px-6 pt-6 pb-2">
            <Breadcrumb items={[{ label: 'שירותים', href: '/services' }, { label: service.title }]} />
          </div>
          <AutomationProcessSection />
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
