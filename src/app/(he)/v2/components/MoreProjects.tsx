'use client'

import Eyebrow from './Eyebrow'
import ProjectsCarousel from './ProjectsCarousel'
import { portfolio as portfolioDefaults, portfolioItems as portfolioItemsDefaults } from '../content'
import { useV2 } from '../V2ContentProvider'
import styles from './ProjectCase.module.css'

export default function MoreProjects({
  currentId,
  eyebrow,
  heading,
}: {
  currentId: string
  eyebrow: string
  heading: string
}) {
  const portfolio = useV2('portfolio', portfolioDefaults)
  const portfolioItems = useV2('portfolioItems', portfolioItemsDefaults)

  const items = portfolioItems.filter((item) => item.id !== currentId)
  if (!items.length) return null

  return (
    <section className={styles.more} aria-labelledby="v2-more-projects">
      <div className={styles.moreHead} data-reveal-item>
        <Eyebrow label={eyebrow} dot="rtl" />
        <h2 id="v2-more-projects" className={styles.heading}>
          {heading}
        </h2>
      </div>

      <ProjectsCarousel
        items={items}
        action={portfolio.cardAction}
        prevLabel={portfolio.prev}
        nextLabel={portfolio.next}
        className={styles.moreCarousel}
      />
    </section>
  )
}
