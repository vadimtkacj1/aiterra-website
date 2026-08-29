import type { Metadata } from 'next'
import Header from '../components/Header'
import PageHero from '../components/PageHero'
import PageCrumbs from '../components/PageCrumbs'
import AboutIntro from '../components/AboutIntro'
import AboutTeam, { type TeamCard } from '../components/AboutTeam'
import About from '../components/About'
import Stats from '../components/Stats'
import LeadCta from '../components/LeadCta'
import Partners from '../components/Partners'
import Faq from '../components/Faq'
import ContactForm from '../components/ContactForm'
import Footer from '../components/Footer'
import { getAllAuthors } from '@/lib/authors-server'
import { getFaqData } from '@/lib/faq-server'
import { getV2Content } from '@/lib/v2-content-server'

export function generateMetadata(): Metadata {
  const { aboutPage } = getV2Content()
  return {
    title: aboutPage.title,
    description: aboutPage.lede,
  }
}

export const revalidate = 300

export default function V2AboutPage() {
  const { about, aboutPage, aboutValues } = getV2Content()

  const members: TeamCard[] = getAllAuthors().map((author) => ({
    id: author.id,
    name: author.name,
    role: author.role,
    bio: author.bio ?? '',
    image: `/images/team-${author.id}.webp`,
    href: `/blog/author/${author.id}`,
  }))

  const faq = getFaqData('/about')
  const entries = faq.items.map((item, index) => ({
    id: `about-faq-${index + 1}`,
    question: item.q,
    answer: item.a,
  }))

  return (
    <>
      <Header />
      <main id="main-content">
        <PageHero title={aboutPage.title} lede={aboutPage.lede} headingId="v2-about-page-heading" />
        <PageCrumbs current={aboutPage.title} />
        <AboutIntro />
        <About
          eyebrow={aboutValues.eyebrow}
          heading={aboutValues.heading}
          lede={aboutValues.lede}
          roles={aboutValues.roles}
          outro={about.outro}
          action={about.action}
          headingId="v2-values-heading"
        />
        <Stats rounded />
        <LeadCta />
        <AboutTeam members={members} />
        <Partners />
        <Faq heading={aboutPage.faqHeading} entries={entries} />
      </main>
      <Footer>
        <ContactForm variant="footer" />
      </Footer>
    </>
  )
}
