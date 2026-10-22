import type { ReactNode } from 'react'
import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft, Check } from 'lucide-react'
import Header from '../Header'
import Footer from '../Footer'
import Faq from '../Faq'
import Eyebrow from '../Eyebrow'
import { ChevronPrevIcon } from '../icons'
import ToolIcon from './ToolIcon'
import JsonLd from '@/components/seo/JsonLd'
import { pageMetadata } from '@/lib/metadata'
import { ORG_ID, breadcrumbList, faqPage, webPage } from '@/lib/schema'
import { SITE_URL } from '@/lib/seo'
import { TOOLS_HUB_PATH, TOOLS_REVIEWED, otherTools, type ToolEntry } from '@/lib/tools'
import crumbStyles from '../PageCrumbs.module.css'
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

export function ToolHero({
  eyebrow,
  title,
  lede,
  chips = [],
  large = false,
}: {
  eyebrow: string
  title: string
  lede: string
  chips?: string[]
  large?: boolean
}) {
  return (
    <>
      <link rel="preload" as="image" href="/videos/v2-hero-poster.webp" fetchPriority="high" />
      <section className={`${styles.hero} ${large ? styles.heroLarge : ''}`} aria-labelledby="tool-heading">
        <div className={styles.media}>
          <video
            className={styles.mediaImage}
            src="/videos/v2-hero.mp4?v=2"
            poster="/videos/v2-hero-poster.webp"
            data-autoplay=""
            muted
            loop
            playsInline
            preload="none"
            aria-hidden="true"
          />
        </div>
        <div className={styles.scrim} />
        <div className={styles.grid}>
          <div className={styles.column} />
          <div className={`${styles.column} ${styles.copy}`}>
            <Eyebrow label={eyebrow} dot="rtl" className={styles.eyebrow} />
            <h1 id="tool-heading" className={styles.title}>
              {title}
            </h1>
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
          <div className={styles.column} />
        </div>
      </section>
    </>
  )
}

export function ToolCrumbs({ trail }: { trail: { label: string; href?: string }[] }) {
  return (
    <div className={crumbStyles.head}>
      <div className={crumbStyles.rules} aria-hidden="true">
        <span />
        <span />
        <span />
      </div>
      <nav className={crumbStyles.crumbs} aria-label="פירורי לחם">
        {trail.map((item, index) => (
          <span key={item.label} className={styles.crumbItem}>
            {index > 0 ? <ChevronPrevIcon className={crumbStyles.crumbChevron} /> : null}
            {item.href ? (
              <Link href={item.href} className={crumbStyles.crumbLink}>
                {item.label}
              </Link>
            ) : (
              <span className={crumbStyles.crumbCurrent} aria-current="page">
                {item.label}
              </span>
            )}
          </span>
        ))}
      </nav>
    </div>
  )
}

export function ToolCard({ tool, headingLevel = 'h3' }: { tool: ToolEntry; headingLevel?: 'h2' | 'h3' }) {
  const Heading = headingLevel
  return (
    <Link href={tool.path} className={styles.card}>
      <span className={styles.cardIcon}>
        <ToolIcon name={tool.icon} className={styles.cardIconSvg} />
      </span>
      <Heading className={styles.cardTitle}>{tool.title}</Heading>
      <span className={styles.cardText}>{tool.description}</span>
      <span className={styles.cardMore}>
        לכלי
        <ArrowLeft className={styles.cardArrow} aria-hidden="true" />
      </span>
    </Link>
  )
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
  const related = otherTools(path).slice(0, 6)

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
          dateModified: TOOLS_REVIEWED,
          offers: { '@type': 'Offer', price: 0, priceCurrency: 'ILS' },
          publisher: { '@id': ORG_ID },
        }}
      />
      {faqJsonLd ? <JsonLd data={faqJsonLd} /> : null}
      <Header />
      <main id="main-content" className={styles.page}>
        <ToolHero eyebrow="כלי חינמי" title={title} lede={lede} chips={chips} />
        <ToolCrumbs
          trail={[
            { label: 'בית', href: '/' },
            { label: HUB_TITLE, href: TOOLS_HUB_PATH },
            { label: title },
          ]}
        />

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
            <div className={styles.sectionHead}>
              <Eyebrow label="עוד כלים" dot="rtl" />
              <h2 id="related-tools-heading" className={styles.sectionTitle}>
                כלים חינמיים נוספים
              </h2>
            </div>
            <ul className={styles.cardList}>
              {related.map((item) => (
                <li key={item.path}>
                  <ToolCard tool={item} />
                </li>
              ))}
            </ul>
            <div className={styles.allTools}>
              <Link href={TOOLS_HUB_PATH} className={styles.allToolsLink}>
                לכל הכלים
                <ArrowLeft className={styles.cardArrow} aria-hidden="true" />
              </Link>
            </div>
          </section>
        ) : null}

        <Faq heading={['שאלות נפוצות', `על ${title}`]} entries={faq} />
      </main>
      <Footer />
    </>
  )
}
