import SectionHeading from './SectionHeading'
import GridRule from './GridRule'
import StatValue from './StatValue'
import { statItems, stats } from '../content'
import styles from './Stats.module.css'

export default function Stats({ rounded = false }: { rounded?: boolean }) {
  return (
    <section className={[styles.stats, rounded ? styles.rounded : ''].filter(Boolean).join(' ')} aria-labelledby="v2-stats-heading">
      <div className={styles.inner} data-reveal-stagger>
        <div className={styles.topRule}>
          <GridRule />
        </div>

        <div className={styles.head} data-reveal-item>
          <SectionHeading id="v2-stats-heading" lines={stats.heading} className={styles.heading} />
        </div>

        <div className={styles.board}>
          <p className={styles.lede}>{stats.lede}</p>
          <div className={styles.media}>
            <video
              className={styles.mediaImage}
              src="/videos/v2-stats.mp4"
              poster="/videos/v2-stats-poster.webp"
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              aria-hidden="true"
            />
          </div>
          <div className={styles.wash} />

          <div className={styles.grid}>
            {statItems.map((item, index) => (
              <article key={item.id} className={styles.stat} data-reveal-item>
                <StatValue value={item.value} delay={index * 120} className={styles.value} />
                <h3 className={styles.label}>{item.label}</h3>
                <p className={styles.text}>{item.text}</p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
