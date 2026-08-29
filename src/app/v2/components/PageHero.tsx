import Link from 'next/link'
import { ChevronPrevIcon } from './icons'
import ActionButton from './ActionButton'
import SectionHeading from './SectionHeading'
import { getV2Content } from '@/lib/v2-content-server'
import styles from './PageHero.module.css'

type PageHeroProps = {
  title: string | string[]
  lede: string
  headingId: string
  crumb?: string
  action?: { label: string; href: string }
}

export default function PageHero({ title, lede, headingId, crumb, action }: PageHeroProps) {
  const { blog } = getV2Content()
  const lines = Array.isArray(title) ? title : [title]
  return (
    <section className={styles.hero} aria-labelledby={headingId}>
      <div className={styles.media}>
        <video
          className={styles.mediaImage}
          src="/videos/v2-hero.mp4"
          poster="/videos/v2-hero-poster.webp"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          aria-hidden="true"
        />
      </div>
      <div className={styles.scrim} />

      <nav className={styles.crumbs} aria-label={blog.crumbsLabel}>
        <Link href="/v2" className={styles.crumbLink}>
          {blog.crumbHome}
        </Link>
        <ChevronPrevIcon className={styles.crumbChevron} />
        <span className={styles.crumbCurrent} aria-current="page">
          {crumb ?? lines.join(' ')}
        </span>
      </nav>

      <div className={styles.grid}>
        <div className={styles.column} />
        <div className={[styles.column, styles.copy].join(' ')}>
          <SectionHeading as="h1" size="hero" lines={lines} id={headingId} />
          <p className={styles.lede}>{lede}</p>
          {action ? (
            <ActionButton href={action.href} label={action.label} className={styles.action} />
          ) : null}
        </div>
        <div className={styles.column} />
      </div>
    </section>
  )
}
