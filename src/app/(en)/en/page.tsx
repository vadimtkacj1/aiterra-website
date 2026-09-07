import type { Metadata } from 'next'
import Header from '../../(he)/v2/components/Header'
import Hero from '../../(he)/v2/components/Hero'
import About from '../../(he)/v2/components/About'
import Stats from '../../(he)/v2/components/Stats'
import Services from '../../(he)/v2/components/Services'
import Portfolio from '../../(he)/v2/components/Portfolio'
import AllIn from '../../(he)/v2/components/AllIn'
import Partners from '../../(he)/v2/components/Partners'
import Faq from '../../(he)/v2/components/Faq'
import ContactForm from '../../(he)/v2/components/ContactForm'
import Footer from '../../(he)/v2/components/Footer'
import { getV2ContentEn } from '@/lib/v2-content-server'
import { pageMetadata } from '@/lib/metadata'
import JsonLd from '@/components/seo/JsonLd'
import { faqPage, webPage } from '@/lib/schema'

export const metadata: Metadata = pageMetadata({
  title: 'Custom Web Development and SEO Agency',
  description:
    'AiTerra builds custom websites and web platforms in code, then ranks them. Full-stack engineering, SEO and website promotion from one in-house team.',
  path: '/en',
  locale: 'en',
  altPath: '/',
})

export const revalidate = 300

export default function EnHomePage() {
  const { faqEntries } = getV2ContentEn()
  const entries = faqEntries.map((item) => ({ question: item.question, answer: item.answer }))

  return (
    <>
      <JsonLd
        data={webPage({
          path: '/en',
          name: 'Custom Web Development and SEO Agency',
          description:
            'AiTerra builds custom websites and web platforms in code, then ranks them. Full-stack engineering, SEO and website promotion from one in-house team.',
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
        <Faq />
      </main>
      <Footer locale="en">
        <ContactForm variant="footer" source="en-home" />
      </Footer>
    </>
  )
}
