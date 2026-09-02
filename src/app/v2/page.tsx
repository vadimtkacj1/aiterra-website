import type { Metadata } from 'next'
import Header from './components/Header'
import Hero from './components/Hero'
import About from './components/About'
import Stats from './components/Stats'
import Services from './components/Services'
import Portfolio from './components/Portfolio'
import AllIn from './components/AllIn'
import Partners from './components/Partners'
import Reels from './components/Reels'
import Faq from './components/Faq'
import ContactForm from './components/ContactForm'
import Reviews from './components/Reviews'
import Footer from './components/Footer'
import HomeJsonLd from './components/HomeJsonLd'
import { getV2Content } from '@/lib/v2-content-server'
import { pageMetadata } from '@/lib/metadata'

export const metadata: Metadata = pageMetadata({
  title: 'בניית אתרים ושיווק דיגיטלי לעסקים',
  description:
    'סוכנות AITERRA בונה אתרים מהירים, מקדמת אורגנית (SEO) ומנהלת קמפיינים בגוגל ומטא — ספק אחד לכל הדיגיטל. קבלו ייעוץ ותוכנית צמיחה לעסק.',
  path: '/',
})

const SHOW_REELS = false

export default function V2Page() {
  const { clientStories, clientStoryItems } = getV2Content()

  return (
    <>
      <HomeJsonLd />
      <Header />
      <main id="main-content">
        <Hero />
        <About roleHref="/about" />
        <Stats />
        <Services />
        <Portfolio />
        <AllIn />
        <Partners />
        {SHOW_REELS ? <Reels /> : null}
        <Reviews />
        {SHOW_REELS ? (
          <Reels
            eyebrow={clientStories.eyebrow}
            heading={clientStories.heading}
            lede={clientStories.lede}
            items={clientStoryItems}
            prevLabel={clientStories.prev}
            nextLabel={clientStories.next}
            connected
          />
        ) : null}
        <Faq />
      </main>
      <Footer>
        <ContactForm variant="footer" />
      </Footer>
    </>
  )
}
