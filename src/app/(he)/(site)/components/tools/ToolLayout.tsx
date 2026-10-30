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
import ToolShareBar from './ToolShareBar'
import ToolEmbedBox from './ToolEmbedBox'
import JsonLd from '@/components/seo/JsonLd'
import { pageMetadata } from '@/lib/metadata'
import { ORG_ID, breadcrumbList, faqPage, webPage } from '@/lib/schema'
import { SITE_URL } from '@/lib/seo'
import { TOOLS_HUB_PATH, categoryOfTool, embeddableTool, otherTools, toolReviewed, topicPath } from '@/lib/tools'
import { hasEnTool } from '@/lib/tools-en'
import crumbStyles from '../PageCrumbs.module.css'
import indexStyles from './ToolsIndex.module.css'
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
  return pageMetadata({
    title: metaTitle,
    description,
    path,
    ...(hasEnTool(path) ? { altPath: `/en${path}` } : {}),
  })
}

export function ToolHero({
  eyebrow,
  title,
  lede,
  chips = [],
  large = false,
  compact = false,
  reviewed,
}: {
  eyebrow: string
  title: string
  lede: string
  chips?: string[]
  large?: boolean
  compact?: boolean
  reviewed?: string
}) {
  return (
    <>
      {compact ? null : <link rel="preload" as="image" href="/videos/v2-hero-poster.webp" fetchPriority="high" />}
      <section
        className={`${styles.hero} ${large ? styles.heroLarge : ''} ${compact ? styles.heroCompact : ''}`}
        aria-labelledby="tool-heading"
      >
        {compact ? null : (
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
        )}
        <div className={styles.scrim} />
        <div className={styles.grid}>
          <div className={styles.column} />
          <div className={`${styles.column} ${styles.copy}`}>
            <Eyebrow label={eyebrow} dot="rtl" className={styles.eyebrow} />
            <h1 id="tool-heading" className={styles.title}>
              {title}
            </h1>
            {compact ? null : <p className={styles.lede}>{lede}</p>}
            {reviewed ? (
              <p className={styles.reviewed}>
                עודכן ונבדק מול המקורות: <time dateTime={reviewed}>{reviewed.split('-').reverse().join('.')}</time>
              </p>
            ) : null}
            {chips.length && !compact ? (
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
  const embed = embeddableTool(path)
  const topic = categoryOfTool(path)

  return (
    <>
      <JsonLd data={webPage({ path, name: metaTitle, description })} />
      <JsonLd
        data={breadcrumbList([
          { name: 'בית', path: '/' },
          { name: HUB_TITLE, path: TOOLS_HUB_PATH },
          ...(topic ? [{ name: topic.title, path: topicPath(topic.id) }] : []),
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
          dateModified: toolReviewed(path),
          offers: { '@type': 'Offer', price: 0, priceCurrency: 'ILS' },
          publisher: { '@id': ORG_ID },
        }}
      />
      {faqJsonLd ? <JsonLd data={faqJsonLd} /> : null}
      <Header />
      <main id="main-content" className={styles.page}>
        <ToolHero eyebrow="כלי חינמי" title={title} lede={lede} chips={chips} compact reviewed={toolReviewed(path)} />
        <ToolCrumbs
          trail={[
            { label: 'בית', href: '/' },
            { label: HUB_TITLE, href: TOOLS_HUB_PATH },
            ...(topic ? [{ label: topic.title, href: topicPath(topic.id) }] : []),
            { label: title },
          ]}
        />

        {tool}
        <ToolShareBar path={path} title={title} />
        <p className={styles.trustLine}>
          הכלי נבנה ומתוחזק בידי AITERRA, סוכנות דיגיטל ישראלית.{' '}
          <Link href="/about" prefetch={false}>
            מי אנחנו
          </Link>
          {' · '}
          <Link href="/contact" prefetch={false}>
            יצירת קשר
          </Link>
        </p>
        {embed ? <ToolEmbedBox slug={embed.slug} title={title} height={embed.height} /> : null}

        {related.length ? (
          <section className={styles.related} aria-labelledby="related-tools-heading">
            <div className={styles.sectionHead}>
              <Eyebrow label="עוד כלים" dot="rtl" />
              <h2 id="related-tools-heading" className={styles.sectionTitle}>
                כלים חינמיים נוספים
              </h2>
            </div>
            <ul className={`${indexStyles.list} ${styles.relatedList}`}>
              {related.map((item) => (
                <li key={item.path}>
                  <Link href={item.path} className={indexStyles.item}>
                    <span className={indexStyles.itemIcon}>
                      <ToolIcon name={item.icon} className={indexStyles.itemIconSvg} />
                    </span>
                    <span className={indexStyles.itemBody}>
                      <span className={indexStyles.itemTitle}>{item.title}</span>
                      <span className={indexStyles.itemText}>{item.description}</span>
                    </span>
                    <ArrowLeft className={indexStyles.itemArrow} aria-hidden="true" />
                  </Link>
                </li>
              ))}
            </ul>
            <div className={styles.allTools}>
              <Link href={TOOLS_HUB_PATH} className={styles.allToolsLink}>
                לכל הכלים
                <ArrowLeft className={styles.allToolsArrow} aria-hidden="true" />
              </Link>
            </div>
          </section>
        ) : null}

        <article className={styles.guide}>
          <p className={styles.guideLede}>{lede}</p>
          {children}
          <div className={styles.cta}>
            <p>{cta.text}</p>
            <Link href={cta.href} className={styles.ctaLink}>
              {cta.label}
            </Link>
          </div>
        </article>

        <Faq heading={['שאלות נפוצות', `על ${title}`]} entries={faq} />
      </main>
      <Footer />
    </>
  )
}
