import type { Metadata } from 'next'
import { metadataForRoute } from '@/lib/site-seo-server'
import RouteJsonLd from '@/components/seo/RouteJsonLd'

export async function generateMetadata(): Promise<Metadata> {
  return metadataForRoute('/contact')
}

import HeaderAlt from '@/components/layout/HeaderAlt'
import Footer from '@/components/layout/Footer'
import StickyPageFooter from '@/components/layout/StickyPageFooter'
import { ContactHeroSection, ContactFormSection, ContactMapSection } from '@/components/sections'
import FaqSection from '@/components/sections/common/FaqSection'
import Breadcrumb from '@/components/ui/Breadcrumb'
import { getFaqData } from '@/lib/faq-server'

// Static-data page (FAQ + SEO copy) — prerender like the other pages and let
// ISR pick up admin edits. (Was needlessly force-dynamic, which disabled cache.)
export const revalidate = 300

export default function ContactPage() {
  const faqData = getFaqData('/contact')

  return (
    <div className="relative flex flex-col min-h-screen bg-white">
      <RouteJsonLd path="/contact" />
      <HeaderAlt transparent />
      <div className="relative z-15 -mt-28 md:-mt-48" style={{ background: '#060B22' }}>
        <ContactHeroSection />
      </div>
      <div className="flex min-h-0 w-full flex-1 flex-col">
        <main id="main-content" className="relative z-20 flex-1 bg-white shadow-[0_20px_50px_rgba(0,0,0,0.1)]">
          <div className="max-w-7xl mx-auto px-6 pt-6 pb-2">
            <Breadcrumb items={[{ label: 'צור קשר', href: '/contact' }]} />
          </div>
          <ContactFormSection />
          <ContactMapSection />
          <FaqSection data={faqData} />
        </main>
        <StickyPageFooter className="z-10">
          <Footer />
        </StickyPageFooter>
      </div>
    </div>
  )
}
