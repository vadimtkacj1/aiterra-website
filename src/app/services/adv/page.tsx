import type { Metadata } from 'next'
import { SITE_URL } from '@/lib/seo'
import HeaderAlt from '@/components/layout/HeaderAlt'
import Footer from '@/components/layout/Footer'
import StickyPageFooter from '@/components/layout/StickyPageFooter'
import { ServicePageHeroSection, AdvProcessSection, CtaSection, FaqSection } from '@/components/sections'
import { getServiceBySlug } from '@/data/services'
import { notFound } from 'next/navigation'
import Breadcrumb from '@/components/ui/Breadcrumb'
import ServiceSchema from '@/components/seo/ServiceSchema'

export const metadata: Metadata = {
  title: 'פרסום ממומן (PPC) בגוגל ורשתות חברתיות',
  description: 'ניהול קמפיינים ממומנים בגוגל, פייסבוק ואינסטגרם עם ROI מדיד. לידים איכותיים כאן ועכשיו עם אסטרטגיית פרסום חכמה.',
  alternates: { canonical: `${SITE_URL}/services/adv` },
  openGraph: {
    title: 'פרסום ממומן (PPC) | AITERRA',
    description: 'ניהול קמפיינים ממומנים בגוגל, פייסבוק ואינסטגרם עם ROI מדיד. לידים איכותיים כאן ועכשיו.',
    url: `${SITE_URL}/services/adv`,
    locale: 'he_IL',
  },
}

export default function AdvPage() {
  const service = getServiceBySlug('adv')
  if (!service) notFound()

  return (
    <div className="relative flex flex-col min-h-screen bg-white">
      <ServiceSchema
        name="פרסום ממומן (PPC)"
        description="ניהול קמפיינים ממומנים בגוגל, פייסבוק ואינסטגרם עם ROI מדיד. לידים איכותיים כאן ועכשיו עם אסטרטגיית פרסום חכמה."
        urlPath="/services/adv"
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
          <AdvProcessSection />
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
