import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import HeaderAlt from '@/components/layout/HeaderAlt'
import Footer from '@/components/layout/Footer'
import StickyPageFooter from '@/components/layout/StickyPageFooter'
import { CtaSection } from '@/components/sections'
import FaqSection from '@/components/sections/common/FaqSection'
import Breadcrumb from '@/components/ui/Breadcrumb'
import BreadcrumbSchema from '@/components/seo/BreadcrumbSchema'
import { getFaqData } from '@/lib/faq-server'
import { services } from '@/data/services'
import { SITE_URL } from '@/lib/seo'

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'חבילות שירות – שיווק דיגיטלי ובניית אתרים',
    description:
      'חבילות שיווק דיגיטלי מותאמות לעסקים בישראל: בניית אתרים, קידום SEO, פרסום ממומן ואוטומציה עסקית. כל חבילה מותאמת אישית – בקשו הצעת מחיר.',
    alternates: { canonical: `${SITE_URL}/packages` },
    openGraph: {
      title: 'חבילות שירות – שיווק דיגיטלי ובניית אתרים | AITERRA',
      description:
        'חבילות שיווק דיגיטלי מותאמות לעסקים בישראל: בניית אתרים, קידום SEO, פרסום ממומן ואוטומציה עסקית. כל חבילה מותאמת אישית – בקשו הצעת מחיר.',
      url: `${SITE_URL}/packages`,
      locale: 'he_IL',
    },
  }
}

export default function PackagesPage() {
  const faqData = getFaqData('/services')

  return (
    <div className="relative flex flex-col min-h-screen bg-white">
      <BreadcrumbSchema items={[{ label: 'חבילות שירות', href: '/packages' }]} />
      <HeaderAlt />
      <div className="flex min-h-0 w-full flex-1 flex-col">
        <main id="main-content" className="relative z-20 flex-1 bg-white">
          {/* Hero */}
          <section
            className="pt-32 pb-16 px-6 text-center"
            style={{ background: '#080112' }}
            dir="rtl"
          >
            <p className="text-[13px] font-semibold uppercase tracking-widest text-[#a78bfa] mb-4">
              מה שמתאים לכם
            </p>
            <h1
              className="text-white font-bold mb-5 leading-tight"
              style={{ fontSize: 'clamp(28px, 5vw, 60px)' }}
            >
              חבילות שירות
            </h1>
            <p className="text-white/70 max-w-2xl mx-auto text-[16px] md:text-[18px] leading-relaxed">
              כל עסק הוא עולם בפני עצמו. אנחנו מתאימים את הפתרון בדיוק לצרכים ולתקציב שלכם –
              ללא חבילות מוגדרות מראש.
            </p>
          </section>

          <div className="max-w-7xl mx-auto px-6 pt-6 pb-2" dir="rtl">
            <Breadcrumb items={[{ label: 'חבילות שירות', href: '/packages' }]} />
          </div>

          {/* Services grid */}
          <section className="max-w-6xl mx-auto px-6 py-12 md:py-16" dir="rtl">
            <h2
              className="text-[22px] md:text-[36px] font-bold text-[#111827] text-center mb-10"
            >
              תחומי השירות שלנו
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8">
              {services.map((service) => (
                <Link
                  key={service.slug}
                  href={`/services/${service.slug}`}
                  className="group flex flex-col gap-4 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm hover:shadow-md hover:border-[#1B1BB3]/30 transition-all duration-200"
                >
                  <div className="flex items-center gap-3">
                    <Image
                      src={service.icon}
                      alt={service.title}
                      width={36}
                      height={36}
                      unoptimized
                    />
                    <h3 className="text-[18px] font-bold text-[#111827] group-hover:text-[#1B1BB3] transition-colors">
                      {service.title}
                    </h3>
                  </div>
                  <p className="text-[14px] text-[#6b7280] leading-relaxed flex-1">
                    {service.description}
                  </p>
                  <span className="text-[13px] font-semibold text-[#1B1BB3]">
                    למידע נוסף ←
                  </span>
                </Link>
              ))}
            </div>
          </section>

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
