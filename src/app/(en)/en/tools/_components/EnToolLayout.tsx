import type { ReactNode } from 'react'
import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, Check } from 'lucide-react'
import Header from '../../../../(he)/(site)/components/Header'
import Footer from '../../../../(he)/(site)/components/Footer'
import Faq from '../../../../(he)/(site)/components/Faq'
import Eyebrow from '../../../../(he)/(site)/components/Eyebrow'
import { ChevronPrevIcon } from '../../../../(he)/(site)/components/icons'
import ToolIcon from '../../../../(he)/(site)/components/tools/ToolIcon'
import JsonLd from '@/components/seo/JsonLd'
import { pageMetadata } from '@/lib/metadata'
import { ORG_ID, breadcrumbList, faqPage, webPage } from '@/lib/schema'
import { SITE_URL } from '@/lib/seo'
import { tools } from '@/lib/tools'
import {
  EN_TOOLS_HUB_PATH,
  EN_TOOLS_HUB_TITLE,
  enToolBySlug,
  enToolPath,
  enToolReviewed,
  otherEnTools,
  type EnToolEntry,
} from '@/lib/tools-en'
import crumbStyles from '../../../../(he)/(site)/components/PageCrumbs.module.css'
import indexStyles from '../../../../(he)/(site)/components/tools/ToolsIndex.module.css'
import styles from '../../../../(he)/(site)/components/tools/ToolLayout.module.css'

export type EnToolFaqEntry = { id: string; question: string; answer: string }

type EnToolLayoutProps = {
  slug: string
  metaTitle: string
  description: string
  lede: string
  tool: ReactNode
  faq: EnToolFaqEntry[]
  cta: { text: string; label: string; href: string }
  chips?: string[]
  children: ReactNode
}

const reviewedLabel = (date: string) =>
  new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }).format(
    new Date(`${date}T00:00:00Z`),
  )

export function enToolMetadata({
  slug,
  metaTitle,
  description,
}: {
  slug: string
  metaTitle: string
  description: string
}): Metadata {
  const hePath = `/tools/${slug}`
  return pageMetadata({
    title: metaTitle,
    description,
    path: enToolPath(slug),
    locale: 'en',
    ...(tools.some((tool) => tool.path === hePath) ?{ altPath: hePath } : {}),
  })
}

export function EnToolHero({
  eyebrow,
  title,
  lede,
  chips = [],
  large = false,
  reviewed,
}: {
  eyebrow: string
  title: string
  lede: string
  chips?: string[]
  large?: boolean
  reviewed?: string
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
            <Eyebrow label={eyebrow} dot="ltr" className={styles.eyebrow} />
            <h1 id="tool-heading" className={styles.title}>
              {title}
            </h1>
            <p className={styles.lede}>{lede}</p>
            {reviewed ? (
              <p className={styles.reviewed}>
                Checked against the sources: <time dateTime={reviewed}>{reviewedLabel(reviewed)}</time>
              </p>
            ) : null}
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

export function EnToolCrumbs({ trail }: { trail: { label: string; href?: string }[] }) {
  return (
    <div className={crumbStyles.head}>
      <div className={crumbStyles.rules} aria-hidden="true">
        <span />
        <span />
        <span />
      </div>
      <nav className={crumbStyles.crumbs} aria-label="Breadcrumb">
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

export function EnToolList({ items }: { items: EnToolEntry[] }) {
  return (
    <ul className={indexStyles.list}>
      {items.map((item) => (
        <li key={item.slug}>
          <Link href={enToolPath(item.slug)} className={indexStyles.item}>
            <span className={indexStyles.itemIcon}>
              <ToolIcon name={item.icon} className={indexStyles.itemIconSvg} />
            </span>
            <span className={indexStyles.itemBody}>
              <span className={indexStyles.itemTitle}>{item.title}</span>
              <span className={indexStyles.itemText}>{item.description}</span>
            </span>
            <ArrowRight className={indexStyles.itemArrow} aria-hidden="true" />
          </Link>
        </li>
      ))}
    </ul>
  )
}

export default function EnToolLayout({
  slug,
  metaTitle,
  description,
  lede,
  tool,
  faq,
  cta,
  chips = [],
  children,
}: EnToolLayoutProps) {
  const entry = enToolBySlug(slug)
  const title = entry?.title ?? metaTitle
  const path = enToolPath(slug)
  const reviewed = enToolReviewed(slug)
  const faqJsonLd = faqPage({ path, entries: faq.map(({ question, answer }) => ({ question, answer })) })
  const related = otherEnTools(slug).slice(0, 6)

  return (
    <>
      <JsonLd data={webPage({ path, name: metaTitle, description })} />
      <JsonLd
        data={breadcrumbList([
          { name: 'Home', path: '/en' },
          { name: EN_TOOLS_HUB_TITLE, path: EN_TOOLS_HUB_PATH },
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
          inLanguage: 'en',
          applicationCategory: 'BusinessApplication',
          operatingSystem: 'Any',
          isAccessibleForFree: true,
          dateModified: reviewed,
          offers: { '@type': 'Offer', price: 0, priceCurrency: 'ILS' },
          publisher: { '@id': ORG_ID },
        }}
      />
      {faqJsonLd ? <JsonLd data={faqJsonLd} /> : null}
      <Header />
      <main id="main-content" className={styles.page}>
        <EnToolHero eyebrow="Free tool" title={title} lede={lede} chips={chips} reviewed={reviewed} />
        <EnToolCrumbs
          trail={[
            { label: 'Home', href: '/en' },
            { label: 'Free tools', href: EN_TOOLS_HUB_PATH },
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
              <Eyebrow label="More tools" dot="ltr" />
              <h2 id="related-tools-heading" className={styles.sectionTitle}>
                More free tools
              </h2>
            </div>
            <div className={styles.relatedList}>
              <EnToolList items={related} />
            </div>
            <div className={styles.allTools}>
              <Link href={EN_TOOLS_HUB_PATH} className={styles.allToolsLink}>
                All tools
                <ArrowRight className={styles.allToolsArrow} aria-hidden="true" />
              </Link>
            </div>
          </section>
        ) : null}

        <Faq heading={['Frequently asked questions', `about the ${title}`]} entries={faq} />
      </main>
      <Footer locale="en" />
    </>
  )
}
