import ActionButton from './ActionButton'
import TagList from './TagList'
import type { V2Content } from '../content'
import styles from './ProjectsGrid.module.css'

type Props = {
  items: V2Content['portfolioItems']
  cardAction: string
}

export default function ProjectsGridStatic({ items, cardAction }: Props) {
  return (
    <section className={styles.projects}>
      <div className={styles.inner}>
        <div className={styles.grid}>
          {items.map((item) => (
            <article key={item.id} className={styles.card}>
              <div className={styles.shot}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={item.shot} alt={item.title} className={styles.shotImage} loading="lazy" />
              </div>

              <div className={styles.meta}>
                <div className={styles.metaText}>
                  <h2 className={styles.title}>{item.title}</h2>
                  <TagList tags={item.tags} className={styles.tags} />
                </div>

                <ActionButton href={item.href} label={cardAction} />
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
