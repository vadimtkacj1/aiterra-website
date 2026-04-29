import type { Metadata } from 'next'
import { SITE_URL } from '@/lib/seo'
import HeaderAlt from '@/components/layout/HeaderAlt'
import Footer from '@/components/layout/Footer'
import StickyPageFooter from '@/components/layout/StickyPageFooter'
import { ServicePageHeroSection, SeoProcessSection, CtaSection, FaqSection } from '@/components/sections'
import { getServiceBySlug } from '@/data/services'
import { notFound } from 'next/navigation'
import Breadcrumb from '@/components/ui/Breadcrumb'
import ServiceSchema from '@/components/seo/ServiceSchema'

export const metadata: Metadata = {
  title: 'קידום אתרים בגוגל (SEO)',
  description: 'שירות SEO מקיף: אופטימיזציה טכנית, תוכן חכם, בניית קישורים חיצוניים ומעקב חודשי אחר מיקומים. תנועה אורגנית שמייצרת הכנסה.',
  alternates: { canonical: `${SITE_URL}/services/seo` },
  openGraph: {
    title: 'קידום אתרים בגוגל (SEO) | AITERRA',
    description: 'שירות SEO מקיף: אופטימיזציה טכנית, תוכן חכם, בניית קישורים חיצוניים ומעקב חודשי אחר מיקומים.',
    url: `${SITE_URL}/services/seo`,
    locale: 'he_IL',
  },
}

export default function SeoPage() {
  const service = getServiceBySlug('seo')
  if (!service) notFound()

  return (
    <div className="relative flex flex-col min-h-screen bg-white">
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
          <FaqSection />
        </main>
        <StickyPageFooter className="z-10">
          <Footer />
        </StickyPageFooter>
      </div>
    </div>
  )
}
