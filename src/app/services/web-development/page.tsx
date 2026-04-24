import HeaderAlt from '@/components/layout/HeaderAlt'
import Footer from '@/components/layout/Footer'
import { ServicePageHeroSection, WebDevProcessSection, CtaSection, FaqSection } from '@/components/sections'
import { getServiceBySlug } from '@/data/services'
import { notFound } from 'next/navigation'

export default function WebDevelopmentPage() {
  const service = getServiceBySlug('web-development')
  if (!service) notFound()

  return (
    <div className="relative flex flex-col min-h-screen bg-white">
      <HeaderAlt transparent />
      <div className="relative z-[15] -mt-28 md:-mt-48" style={{ background: '#080112' }}>
        <ServicePageHeroSection service={service} />
      </div>
      <div className="flex min-h-0 w-full flex-1 flex-col">
        <main className="relative z-20 flex-1 bg-white shadow-[0_20px_50px_rgba(0,0,0,0.1)]">
          <WebDevProcessSection />
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
