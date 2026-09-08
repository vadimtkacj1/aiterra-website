import type { Metadata } from 'next'
import Header from '@/components/lp-agency/Header'
import Hero from '@/components/lp-agency/Hero'
import LeadFormSection from '@/components/lp-agency/LeadFormSection'
import Services from '@/components/lp-agency/Services'
import RealResults from '@/components/lp-agency/RealResults'
import WhyUs from '@/components/lp-agency/WhyUs'
import SocialFollow from '@/components/lp-agency/SocialFollow'
import LeadFormCard from '@/components/lp-agency/LeadFormCard'
import Footer from '@/components/lp-agency/Footer'

export const metadata: Metadata = {
  title: 'יותר לידים, פחות בזבוז תקציב — אתר, קידום וקמפיינים מצוות אחד',
  description:
    'אותו צוות בונה את האתר, מקדם אותו ומריץ את הקמפיינים, כך שתקציב הפרסום לא נוחת על עמוד שלא נבנה להמיר. השאירו פרטים לשיחת אסטרטגיה ללא עלות.',
  alternates: { canonical: '/lp/agency' },
  openGraph: {
    type: 'website',
    locale: 'he_IL',
    url: '/lp/agency',
    title: 'יותר לידים, פחות בזבוז תקציב — Aiterra',
    description:
      'אתר ממיר, קידום אורגני וקמפיינים ממומנים מצוות אחד. שיחת אסטרטגיה ללא עלות.',
  },
}

export const revalidate = 300

export default function AgencyLandingPage() {
  return (
    <div className="lpAgency">
      <Header />
      <main id="main-content">
        <Hero />
        <LeadFormSection />
        <Services />
        <RealResults />
        <WhyUs />
        <SocialFollow />
        <LeadFormCard />
      </main>
      <Footer />
    </div>
  )
}
