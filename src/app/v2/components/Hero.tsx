import ActionButton from './ActionButton'
import SectionHeading from './SectionHeading'
import TagList from './TagList'
import ProjectsRail from './ProjectsRail'
import TopicsRail from './TopicsRail'
import { hero } from '../content'
import styles from './Hero.module.css'

export default function Hero() {
  return (
    <section className={styles.hero}>
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
  )
}
