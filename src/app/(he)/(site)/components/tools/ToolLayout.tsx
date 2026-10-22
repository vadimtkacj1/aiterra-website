import type { ReactNode } from 'react'
import type { Metadata } from 'next'
import Link from 'next/link'
import { Check } from 'lucide-react'
import Header from '../Header'
import Footer from '../Footer'
import Faq from '../Faq'
import { ChevronPrevIcon } from '../icons'
import JsonLd from '@/components/seo/JsonLd'
import { pageMetadata } from '@/lib/metadata'
import { ORG_ID, breadcrumbList, faqPage, webPage } from '@/lib/schema'
import { SITE_URL } from '@/lib/seo'
import { TOOLS_HUB_PATH, otherTools } from '@/lib/tools'
import styles from './ToolLayout.module.css'

export type ToolFaqEntry = { id: string; question: string; answer: string }

type ToolLayoutProps = {
  path: string
  title: string
  metaTitle: string
  description: string
  lede: string
  tool: ReactNode
  faq: ToolFaqEntry[]
  cta: { text: string; label: string; href: string }
  chips?: string[]
  children: ReactNode
}

export const HUB_TITLE = 'כלים חינמיים לעסקים'

export function toolMetadata({
  path,
  metaTitle,
  description,
}: {
  path: string
  metaTitle: string
  description: string
}): Metadata {
  return pageMetadata({ title: metaTitle, description, path })
}

export default function ToolLayout({
  path,
  title,
  metaTitle,
  description,
  lede,
  tool,
  faq,
  cta,
  chips = [],
  children,
}: ToolLayoutProps) {
  const faqJsonLd = faqPage({ path, entries: faq.map(({ question, answer }) => ({ question, answer })) })
  const related = otherTools(path)

  return (
    <>
      <JsonLd data={webPage({ path, name: metaTitle, description })} />
      <JsonLd
        data={breadcrumbList([
          { name: 'בית', path: '/' },
          { name: HUB_TITLE, path: TOOLS_HUB_PATH },
          { name: title, path },
        ])}
      />
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'WebApplication',
          '@id': `${SITE_URL}${path}#app`,
          name: title,
          url: `${SITE_URL}${path}`,
          description,
          inLanguage: 'he',
          applicationCategory: 'BusinessApplication',
          operatingSystem: 'Any',
          isAccessibleForFree: true,
          offers: { '@type': 'Offer', price: 0, priceCurrency: 'ILS' },
          publisher: { '@id': ORG_ID },
        }}
      />
      {faqJsonLd ? <JsonLd data={faqJsonLd} /> : null}
      <Header />
      <main id="main-content" className={styles.page}>
        <div className={styles.hero}>
          <div className={styles.head}>
            <nav className={styles.crumbs} aria-label="פירורי לחם">
              <Link href="/" className={styles.crumbLink}>
                בית
              </Link>
              <ChevronPrevIcon className={styles.crumbChevron} />
              <Link href={TOOLS_HUB_PATH} className={styles.crumbLink}>
                {HUB_TITLE}
              </Link>
              <ChevronPrevIcon className={styles.crumbChevron} />
              <span aria-current="page">{title}</span>
            </nav>
            <p className={styles.eyebrow}>כלי חינמי של AITERRA</p>
            <h1 className={styles.title}>{title}</h1>
            <p className={styles.lede}>{lede}</p>
            {chips.length ? (
              <ul className={styles.chips}>
                {chips.map((chip) => (
                  <li key={chip} className={styles.chip}>
                    <Check className={styles.chipIcon} aria-hidden="true" />
                    {chip}
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        </div>

        {tool}

        <article className={styles.guide}>
          {children}
          <div className={styles.cta}>
            <p>{cta.text}</p>
            <Link href={cta.href} className={styles.ctaLink}>
              {cta.label}
            </Link>
          </div>
        </article>

        {related.length ? (
          <section className={styles.related} aria-labelledby="related-tools-heading">
            <h2 id="related-tools-heading" className={styles.relatedTitle}>
              עוד כלים חינמיים
            </h2>
            <ul className={styles.relatedList}>
              {related.map((item) => (
                <li key={item.path}>
                  <Link href={item.path} className={styles.relatedCard}>
                    <span className={styles.relatedName}>{item.title}</span>
                    <span className={styles.relatedText}>{item.description}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        <Faq heading={['שאלות נפוצות', `על ${title}`]} entries={faq} />
      </main>
      <Footer />
    </>
  )
}
