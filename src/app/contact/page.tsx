import type { Metadata } from 'next'
import { SITE_URL } from '@/lib/seo'

export const metadata: Metadata = {
  title: 'צור קשר',
  description: 'צרו איתנו קשר לשיחת ייעוץ חינם. בניית אתרים, קידום SEO, פרסום ממומן ואוטומציה עסקית. משרד: רחוב הרב ניסנבאום 37, בת ים.',
  alternates: { canonical: `${SITE_URL}/contact` },
  openGraph: {
    title: 'צור קשר | AITERRA',
    description: 'צרו איתנו קשר לשיחת ייעוץ חינם. בניית אתרים, קידום SEO, פרסום ממומן ואוטומציה עסקית.',
    url: `${SITE_URL}/contact`,
    locale: 'he_IL',
  },
}

import HeaderAlt from '@/components/layout/HeaderAlt'
import Footer from '@/components/layout/Footer'
import StickyPageFooter from '@/components/layout/StickyPageFooter'
import { ContactHeroSection, ContactFormSection, ContactMapSection, CtaSection, FaqSection } from '@/components/sections'
import Breadcrumb from '@/components/ui/Breadcrumb'
import ContactFaqSection from '@/components/sections/contact/ContactFaqSection'
import { getFaqData } from '@/lib/faq-server'

export const dynamic = 'force-dynamic'

export default function ContactPage() {
  const faqData = getFaqData()

  return (
    <div className="relative flex flex-col min-h-screen bg-white">
      <HeaderAlt transparent />
      <div className="relative z-15 -mt-28 md:-mt-48" style={{ background: '#080112' }}>
        <ContactHeroSection />
      </div>
      <div className="flex min-h-0 w-full flex-1 flex-col">
        <main className="relative z-20 flex-1 bg-white shadow-[0_20px_50px_rgba(0,0,0,0.1)]">
          <div className="max-w-7xl mx-auto px-6 pt-6 pb-2">
            <Breadcrumb items={[{ label: 'צור קשר', href: '/contact' }]} />
          </div>
          <ContactMapSection />
          <ContactFaqSection data={faqData} />
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
