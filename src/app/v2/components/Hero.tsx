import ActionButton from './ActionButton'
import SectionHeading from './SectionHeading'
import TagList from './TagList'
import ProjectsRail from './ProjectsRail'
import TopicsRail from './TopicsRail'
import { getV2Content } from '@/lib/v2-content-server'
import styles from './Hero.module.css'

export default function Hero() {
  const { hero } = getV2Content()

  return (
    <>
      <link rel="preload" as="image" href="/videos/v2-hero-poster.webp" fetchPriority="high" />
      <section className={styles.hero}>
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
        <div className={[styles.column, styles.copy, styles.columnDivider].join(' ')}>
          <SectionHeading as="h1" size="hero" lines={hero.headline} />

          <TagList tags={hero.tags} align="center" className={styles.tags} />

          <p className={styles.lede}>
            {hero.lede.map((line, index) => (
              <span key={line} className={styles.ledeLine}>
                {index > 0 ? ' ' : null}
                {line}
              </span>
            ))}
          </p>

          <div className={styles.actions}>
            <ActionButton href={hero.primaryAction.href} label={hero.primaryAction.label} />
            <ActionButton
              href={hero.secondaryAction.href}
              label={hero.secondaryAction.label}
              variant="outline"
            />
          </div>
        </div>

        <div className={[styles.column, styles.side, styles.topics].join(' ')}>
          <TopicsRail />
        </div>

        <div
          className={[styles.column, styles.side, styles.projects, styles.columnDivider].join(' ')}
        >
          <ProjectsRail />
        </div>
      </div>
      </section>
    </>
  )
}
