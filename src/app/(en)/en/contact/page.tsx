import type { Metadata } from 'next'
import Header from '../../../(he)/v2/components/Header'
import PageHero from '../../../(he)/v2/components/PageHero'
import PageCrumbs from '../../../(he)/v2/components/PageCrumbs'
import ContactForm from '../../../(he)/v2/components/ContactForm'
import ContactDetails from '../../../(he)/v2/components/ContactDetails'
import Footer from '../../../(he)/v2/components/Footer'
import Faq from '../../../(he)/v2/components/Faq'
import { getV2ContentEn } from '@/lib/v2-content-server'
import { pageMetadata } from '@/lib/metadata'
import JsonLd from '@/components/seo/JsonLd'
import { breadcrumbList, faqPage, webPage } from '@/lib/schema'
import { getEnFaq } from '@/lib/content-en-faq'

export function generateMetadata(): Metadata {
  const { contactPage } = getV2ContentEn()
  return pageMetadata({
    title: contactPage.metaTitle,
    description: contactPage.metaDescription,
    path: '/en/contact',
    locale: 'en',
    altPath: '/contact',
  })
}

export const revalidate = 300

export default function EnContactPage() {
  const { contactPage } = getV2ContentEn()
  const enFaq = getEnFaq('/en/contact')
  const entries = (enFaq?.items ?? []).map((item, index) => ({
    id: `en-contact-faq-${index + 1}`,
    question: item.q,
    answer: item.a,
  }))
  const faqJsonLd = faqPage({
    path: '/en/contact',
    entries: entries.map(({ question, answer }) => ({ question, answer })),
    locale: 'en',
  })

  return (
    <>
      <JsonLd
        data={webPage({
          path: '/en/contact',
          name: contactPage.metaTitle,
          description: contactPage.metaDescription,
          type: 'ContactPage',
          locale: 'en',
        })}
      />
      <JsonLd
        data={breadcrumbList([
          { name: 'Home', path: '/en' },
          { name: contactPage.crumb, path: '/en/contact' },
        ])}
      />
      {faqJsonLd ? <JsonLd data={faqJsonLd} /> : null}
      <Header />
      <main id="main-content">
        <PageHero
          title={contactPage.title}
          crumb={contactPage.crumb}
          lede={contactPage.lede}
          headingId="en-contact-page-heading"
          locale="en"
        />
        <PageCrumbs current={contactPage.crumb} locale="en" homeHref="/en" />
        <ContactForm source="en-contact">
          <ContactDetails locale="en" />
        </ContactForm>
        {entries.length && enFaq ? <Faq heading={enFaq.heading} entries={entries} /> : null}

      </main>
      <Footer locale="en" />
    </>
  )
}
