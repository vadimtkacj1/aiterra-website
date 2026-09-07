import type { Metadata } from 'next'
import Header from '../../../(he)/v2/components/Header'
import PageHero from '../../../(he)/v2/components/PageHero'
import PageCrumbs from '../../../(he)/v2/components/PageCrumbs'
import AboutIntro from '../../../(he)/v2/components/AboutIntro'
import About from '../../../(he)/v2/components/About'
import Stats from '../../../(he)/v2/components/Stats'
import LeadCta from '../../../(he)/v2/components/LeadCta'
import ContactForm from '../../../(he)/v2/components/ContactForm'
import Footer from '../../../(he)/v2/components/Footer'
import Faq from '../../../(he)/v2/components/Faq'
import { getV2ContentEn } from '@/lib/v2-content-server'
import { pageMetadata } from '@/lib/metadata'
import JsonLd from '@/components/seo/JsonLd'
import { breadcrumbList, faqPage, webPage } from '@/lib/schema'
import { getEnFaq } from '@/lib/content-en-faq'

export function generateMetadata(): Metadata {
  const { aboutPage } = getV2ContentEn()
  return pageMetadata({
    title: aboutPage.metaTitle,
    description: aboutPage.metaDescription,
    path: '/en/about',
    locale: 'en',
    altPath: '/about',
  })
}

export const revalidate = 300

export default function EnAboutPage() {
  const { about, aboutPage, aboutValues } = getV2ContentEn()
  const enFaq = getEnFaq('/en/about')
  const entries = (enFaq?.items ?? []).map((item, index) => ({
    id: `en-about-faq-${index + 1}`,
    question: item.q,
    answer: item.a,
  }))
  const faqJsonLd = faqPage({
    path: '/en/about',
    entries: entries.map(({ question, answer }) => ({ question, answer })),
    locale: 'en',
  })

  return (
    <>
      <JsonLd
        data={webPage({
          path: '/en/about',
          name: aboutPage.metaTitle,
          description: aboutPage.metaDescription,
          type: 'AboutPage',
          locale: 'en',
        })}
      />
      <JsonLd
        data={breadcrumbList([
          { name: 'Home', path: '/en' },
          { name: aboutPage.title, path: '/en/about' },
        ])}
      />
      {faqJsonLd ? <JsonLd data={faqJsonLd} /> : null}
      <Header />
      <main id="main-content">
        <PageHero
          title={aboutPage.title}
          lede={aboutPage.lede}
          headingId="en-about-page-heading"
          locale="en"
        />
        <PageCrumbs current={aboutPage.title} locale="en" homeHref="/en" />
        <AboutIntro locale="en" />
        <About
          eyebrow={aboutValues.eyebrow}
          heading={aboutValues.heading}
          lede={aboutValues.lede}
          roles={aboutValues.roles}
          outro={about.outro}
          action={about.action}
          roleHref="/en/services"
          headingId="en-values-heading"
          locale="en"
        />
        <Stats rounded locale="en" />
        {entries.length && enFaq ? <Faq heading={enFaq.heading} entries={entries} /> : null}
        <LeadCta locale="en" />
      </main>
      <Footer locale="en">
        <ContactForm variant="footer" source="en-about" />
      </Footer>
    </>
  )
}
