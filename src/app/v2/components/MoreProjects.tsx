'use client'

import Link from 'next/link'
import { useRef } from 'react'
import ActionButton from './ActionButton'
import CircleButton from './CircleButton'
import Eyebrow from './Eyebrow'
import TagList from './TagList'
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
  const railRef = useRef<HTMLDivElement>(null)

  const items = portfolioItems.filter((item) => item.id !== currentId)
  if (!items.length) return null

  const nudge = (direction: 1 | -1) => {
    const rail = railRef.current
    if (!rail) return
    const card = rail.querySelector<HTMLElement>(`.${styles.card}`)
    const stride = (card?.offsetWidth ?? 320) + 20
    rail.scrollBy({ left: stride * direction, behavior: 'smooth' })
  }

  return (
    <section className={styles.more} aria-labelledby="v2-more-projects">
      <div className={styles.moreHead} data-reveal-item>
        <Eyebrow label={eyebrow} dot="rtl" />
        <h2 id="v2-more-projects" className={styles.heading}>
          {heading}
        </h2>
      </div>

      <div ref={railRef} className={styles.rail}>
        {items.map((item) => (
          <article key={item.id} className={styles.card}>
            <Link href={`/v2/projects/${item.id}`} className={styles.cardShot} aria-label={item.title}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={item.shot} alt="" loading="lazy" />
            </Link>

            <div className={styles.cardMeta}>
              <div className={styles.cardText}>
                <h3 className={styles.cardTitle}>{item.title}</h3>
                <TagList tags={item.tags} />
              </div>
              <ActionButton href={`/v2/projects/${item.id}`} label={portfolio.cardAction} />
            </div>
          </article>
        ))}
      </div>

      <div className={styles.nav}>
        <CircleButton label={portfolio.prev} tone="onPaper" glyph="prev" onClick={() => nudge(1)} />
        <CircleButton label={portfolio.next} tone="onPaper" glyph="next" onClick={() => nudge(-1)} />
      </div>
    </section>
  )
}
