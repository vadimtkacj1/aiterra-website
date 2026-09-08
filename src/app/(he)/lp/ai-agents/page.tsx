import type { Metadata } from 'next'
import Header from '@/components/lp-agency/Header'
import Hero from '@/components/lp-agency/Hero'
import LeadFormSection from '@/components/lp-agency/LeadFormSection'
import Services from '@/components/lp-agency/Services'
import WhyUs from '@/components/lp-agency/WhyUs'
import LeadFormCard from '@/components/lp-agency/LeadFormCard'
import Footer from '@/components/lp-agency/Footer'
import {
  AI_AGENT_HERO,
  AI_AGENT_PILLARS,
  AI_AGENT_SERVICES,
} from '@/lib/lp-ai-agents-content'

export const metadata: Metadata = {
  title: 'סוכן AI לעסק — עונה בעברית, פותח ליד וקובע פגישה',
  description:
    'סוכן AI שעונה מתוך המחירון שלכם, מסנן לידים וקובע פגישות במערכות הקיימות, עם גבולות כתובים והעברה לנציג. השאירו פרטים לבדיקת התאמה ללא עלות.',
  alternates: { canonical: '/lp/ai-agents' },
  openGraph: {
    type: 'website',
    locale: 'he_IL',
    url: '/lp/ai-agents',
    title: 'סוכן AI לעסק — Aiterra',
    description:
      'עונה בעברית מתוך התוכן שלכם, מסנן לידים וקובע פגישות. בדיקת התאמה ללא עלות.',
  },
}

export const revalidate = 300

export default function AiAgentsLandingPage() {
  return (
    <div className="lpAgency">
      <Header />
      <main id="main-content">
        <Hero
          headline={AI_AGENT_HERO.headline}
          subhead={AI_AGENT_HERO.subhead}
          cta={AI_AGENT_HERO.cta}
        />
        <LeadFormSection />
        <Services heading="מה הסוכן עושה בעסק שלכם" items={AI_AGENT_SERVICES} />
        <WhyUs heading="למה דווקא איתנו" pillars={AI_AGENT_PILLARS} />
        <LeadFormCard />
      </main>
      <Footer />
    </div>
  )
}
