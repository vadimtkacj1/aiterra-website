'use client'

import { useMemo, useState } from 'react'
import SectionHeading from './SectionHeading'
import Eyebrow from './Eyebrow'
import TabList from './TabList'
import TabAnchors from './TabAnchors'
import WideCta from './WideCta'
import GridRule from './GridRule'
import ProjectsCarousel from './ProjectsCarousel'
import {
  portfolio as portfolioDefaults,
  portfolioFilters as portfolioFiltersDefaults,
  portfolioItems as portfolioItemsDefaults,
} from '../content'
import { useV2 } from '../V2ContentProvider'
import styles from './Portfolio.module.css'

export default function Portfolio() {
  const portfolio = useV2('portfolio', portfolioDefaults)
  const portfolioFilters = useV2('portfolioFilters', portfolioFiltersDefaults)
  const portfolioItems = useV2('portfolioItems', portfolioItemsDefaults)
  const [activeFilter, setActiveFilter] = useState(portfolioFilters[0].id)

  const items = useMemo(
    () =>
      activeFilter === 'all'
        ? portfolioItems
        : portfolioItems.filter((item) => item.category === activeFilter),
    [activeFilter, portfolioItems],
  )

  return (
    <section id="v2-portfolio" className={styles.portfolio} aria-labelledby="v2-portfolio-heading">
      <TabAnchors prefix="v2-portfolio" tabs={portfolioFilters} onSelect={setActiveFilter} />
      <div className={styles.inner}>
        <div className={styles.rules} aria-hidden="true">
          <span />
          <span />
          <span />
        </div>

        <div className={styles.head} data-reveal-item>
          <Eyebrow label={portfolio.eyebrow} />
          <SectionHeading
            id="v2-portfolio-heading"
            lines={portfolio.heading}
            className={styles.heading}
          />
          <p className={styles.lede}>{portfolio.lede}</p>
          <TabList
            tabs={portfolioFilters}
            activeId={activeFilter}
            onSelect={setActiveFilter}
            variant="solid"
            align="center"
            className={styles.tabs}
          />
        </div>

        <GridRule columns={[1, 2, 1]} />

        <ProjectsCarousel
          items={items}
          action={portfolio.cardAction}
          prevLabel={portfolio.prev}
          nextLabel={portfolio.next}
        />

        <div className={styles.below}>
          <div className={styles.rules} aria-hidden="true">
            <span />
            <span />
            <span />
          </div>

          <div className={styles.outro}>
            <p className={styles.outroText}>{portfolio.outro}</p>
            <WideCta
              href={portfolio.action.href}
              label={portfolio.action.label}
              tone="soft"
              className={styles.outroCta}
            />
          </div>
        </div>
      </div>
    </section>
  )
}
