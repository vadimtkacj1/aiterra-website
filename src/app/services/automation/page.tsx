import type { Metadata } from 'next'
import { SITE_URL } from '@/lib/seo'
import HeaderAlt from '@/components/layout/HeaderAlt'
import Footer from '@/components/layout/Footer'
import StickyPageFooter from '@/components/layout/StickyPageFooter'
import { ServicePageHeroSection, AutomationProcessSection, CtaSection, FaqSection } from '@/components/sections'
import { getServiceBySlug } from '@/data/services'
import { notFound } from 'next/navigation'
import Breadcrumb from '@/components/ui/Breadcrumb'
import ServiceSchema from '@/components/seo/ServiceSchema'

export const metadata: Metadata = {
  title: 'אוטומציה עסקית וחיבור מערכות',
  description: 'בניית מערכות אוטומציה, CRM ואינטגרציות שחוסכות זמן ומייעלות את תהליכי העסק שלכם 24/7.',
  alternates: { canonical: `${SITE_URL}/services/automation` },
  openGraph: {
    title: 'אוטומציה עסקית וחיבור מערכות | AITERRA',
    description: 'בניית מערכות אוטומציה, CRM ואינטגרציות שחוסכות זמן ומייעלות את תהליכי העסק שלכם 24/7.',
    url: `${SITE_URL}/services/automation`,
    locale: 'he_IL',
  },
}

export default function AutomationPage() {
  const service = getServiceBySlug('automation')
  if (!service) notFound()

  return (
    <div className="relative flex flex-col min-h-screen bg-white">
      <ServiceSchema
        name="אוטומציה עסקית וחיבור מערכות"
        description="בניית מערכות אוטומציה, CRM ואינטגרציות שחוסכות זמן ומייעלות את תהליכי העסק שלכם 24/7."
        urlPath="/services/automation"
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
          <AutomationProcessSection />
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
