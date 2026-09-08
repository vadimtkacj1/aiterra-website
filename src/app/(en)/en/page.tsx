import type { Metadata } from 'next'
import Header from '../../(he)/(site)/components/Header'
import Hero from '../../(he)/(site)/components/Hero'
import About from '../../(he)/(site)/components/About'
import Stats from '../../(he)/(site)/components/Stats'
import Services from '../../(he)/(site)/components/Services'
import Portfolio from '../../(he)/(site)/components/Portfolio'
import AllIn from '../../(he)/(site)/components/AllIn'
import Partners from '../../(he)/(site)/components/Partners'
import Reviews from '../../(he)/(site)/components/Reviews'
import Faq from '../../(he)/(site)/components/Faq'
import ContactForm from '../../(he)/(site)/components/ContactForm'
import Footer from '../../(he)/(site)/components/Footer'
import { getV2ContentEn } from '@/lib/v2-content-server'
import { pageMetadata } from '@/lib/metadata'
import JsonLd from '@/components/seo/JsonLd'
import { faqPage, webPage } from '@/lib/schema'

export const metadata: Metadata = pageMetadata({
  title: 'Custom Web Development and SEO Agency',
  description:
    'Aiterra builds custom websites and web platforms in code, then ranks them. Full-stack engineering, SEO and website promotion from one in-house team.',
  path: '/en',
  locale: 'en',
  altPath: '/',
})

export const revalidate = 300

export default function EnHomePage() {
  const { faqEntries, reviews, reviewItems } = getV2ContentEn()
  const entries = faqEntries.map((item) => ({ question: item.question, answer: item.answer }))

  return (
    <>
      <JsonLd
        data={webPage({
          path: '/en',
          name: 'Custom Web Development and SEO Agency',
          description:
            'Aiterra builds custom websites and web platforms in code, then ranks them. Full-stack engineering, SEO and website promotion from one in-house team.',
          locale: 'en',
        })}
      />
      {entries.length ? <JsonLd data={faqPage({ path: '/en', entries, locale: 'en' })!} /> : null}
      <Header />
      <main id="main-content">
        <Hero locale="en" />
        <About roleHref="/en/about" locale="en" />
        <Stats locale="en" />
        <Services />
        <Portfolio />
        <AllIn />
        <Partners locale="en" />
        <Reviews
          eyebrow={reviews.eyebrow}
          heading={reviews.heading}
          items={reviewItems}
          railLabel={reviews.rail}
          ratingLabel={reviews.rating}
          prevLabel={reviews.prev}
          nextLabel={reviews.next}
        />
        <Faq />
      </main>
      <Footer locale="en">
        <ContactForm variant="footer" source="en-home" />
      </Footer>
    </>
  )
}
