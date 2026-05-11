import type { Metadata } from 'next'
import { metadataForRoute } from '@/lib/site-seo-server'
import RouteJsonLd from '@/components/seo/RouteJsonLd'
import HeaderAlt from '@/components/layout/HeaderAlt'
import Footer from '@/components/layout/Footer'
import StickyPageFooter from '@/components/layout/StickyPageFooter'
import { ServicePageHeroSection, SeoProcessSection, CtaSection } from '@/components/sections'
import FaqSection from '@/components/sections/common/FaqSection'
import { getFaqData } from '@/lib/faq-server'
import { getServiceBySlug } from '@/data/services'
import { notFound } from 'next/navigation'
import Breadcrumb from '@/components/ui/Breadcrumb'
import ServiceSchema from '@/components/seo/ServiceSchema'

export async function generateMetadata(): Promise<Metadata> {
  return metadataForRoute('/services/seo')
}

export default function SeoPage() {
  const service = getServiceBySlug('seo')
  const faqData = getFaqData('/services/seo')
  if (!service) notFound()

  return (
    <div className="relative flex flex-col min-h-screen bg-white">
      <RouteJsonLd path="/services/seo" />
      <ServiceSchema
        name="קידום אתרים בגוגל (SEO)"
        description="שירות SEO מקיף: אופטימיזציה טכנית, תוכן חכם, בניית קישורים חיצוניים ומעקב חודשי אחר מיקומים."
        urlPath="/services/seo"
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
          <SeoProcessSection />
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
