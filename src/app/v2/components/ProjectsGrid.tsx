'use client'

import { useMemo, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import ActionButton from './ActionButton'
import TabList from './TabList'
import TagList from './TagList'
import { portfolio, portfolioFilters, portfolioItems } from '../content'
import styles from './ProjectsGrid.module.css'

export default function ProjectsGrid() {
  const searchParams = useSearchParams()
  const requested = searchParams.get('filter')
  const initial = portfolioFilters.some((filter) => filter.id === requested)
    ? (requested as string)
    : portfolioFilters[0].id
  const [activeFilter, setActiveFilter] = useState(initial)

  const items = useMemo(
    () =>
      activeFilter === 'all'
        ? portfolioItems
        : portfolioItems.filter((item) => item.category === activeFilter),
    [activeFilter],
  )

  return (
    <section className={styles.projects}>
      <div className={styles.inner}>
        <TabList
          tabs={portfolioFilters}
          activeId={activeFilter}
          onSelect={setActiveFilter}
          variant="solid"
          align="center"
          className={styles.filters}
        />

        <div className={styles.grid} data-reveal-stagger>
          {items.map((item) => (
            <article key={item.id} className={styles.card} data-reveal-item>
              <div className={styles.shot}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={item.shot} alt="" className={styles.shotImage} loading="lazy" />
              </div>

              <div className={styles.meta}>
                <div className={styles.metaText}>
                  <h2 className={styles.title}>{item.title}</h2>
                  <TagList tags={item.tags} className={styles.tags} />
                </div>

                <ActionButton href={item.href} label={portfolio.cardAction} />
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
