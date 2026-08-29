'use client'

import { useEffect, useId, useMemo, useRef, useState } from 'react'
import SectionHeading from './SectionHeading'
import Eyebrow from './Eyebrow'
import CircleButton from './CircleButton'
import GridRule from './GridRule'
import ReviewCard from './ReviewCard'
import useAutoplay from './useAutoplay'
import { reviewItems, reviews } from '../content'
import type { ReviewItem } from '../content'
import styles from './Reviews.module.css'

const COPIES = [0, 1, 2]

type ReviewsProps = {
  eyebrow?: string
  heading?: string[]
  items?: ReviewItem[]
  railLabel?: string
  ratingLabel?: string
  prevLabel?: string
  nextLabel?: string
}

function Rules() {
  return (
    <div className={styles.rules} aria-hidden="true">
      <span />
      <span />
      <span />
    </div>
  )
}

export default function Reviews({
  eyebrow = reviews.eyebrow,
  heading = reviews.heading,
  items = reviewItems,
  railLabel = reviews.rail,
  ratingLabel = reviews.rating,
  prevLabel = reviews.prev,
  nextLabel = reviews.next,
}: ReviewsProps) {
  const headingId = useId()
  const trackRef = useRef<HTMLDivElement>(null)
  const count = items.length
  const [activeIndex, setActiveIndex] = useState(count + Math.floor(count / 2))
  const activeRef = useRef(activeIndex)
  activeRef.current = activeIndex

  const loop = useMemo(
    () => COPIES.flatMap((copy) => items.map((item) => ({ item, copy }))),
    [items],
  )

  const centre = (index: number, behavior: ScrollBehavior) => {
    const track = trackRef.current
    const card = track?.children[index]
    if (!track || !card) return

    const trackBox = track.getBoundingClientRect()
    const cardBox = card.getBoundingClientRect()
    track.scrollBy({
      left: cardBox.left + cardBox.width / 2 - (trackBox.left + track.clientWidth / 2),
      behavior,
    })
  }

  const step = (delta: number) => {
    const calm = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    centre(activeIndex + delta, calm ? 'auto' : 'smooth')
  }

  const restartAutoplay = useAutoplay(trackRef, () => step(-1), {
    enabled: count > 1,
    holdOnHover: false,
  })

  const nudge = (delta: number) => {
    step(delta)
    restartAutoplay.current()
  }

  useEffect(() => {
    const track = trackRef.current
    if (!track || count === 0) return

    let frame = 0
    const observer = new ResizeObserver(() => {
      if (frame) cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        frame = 0
        if (track.clientWidth > 0) centre(activeRef.current, 'auto')
      })
    })

    observer.observe(track)
    return () => {
      observer.disconnect()
      if (frame) cancelAnimationFrame(frame)
    }
  }, [count])

  useEffect(() => {
    const track = trackRef.current
    if (!track || count === 0) return

    const sign = getComputedStyle(track).direction === 'rtl' ? -1 : 1
    let frame = 0

    const onScroll = () => {
      if (frame) return
      frame = requestAnimationFrame(() => {
        frame = 0

        const copyWidth = track.scrollWidth / COPIES.length
        const offset = Math.abs(track.scrollLeft)
        if (offset < copyWidth * 0.5) track.scrollLeft = sign * (offset + copyWidth)
        else if (offset > copyWidth * 1.5) track.scrollLeft = sign * (offset - copyWidth)

        const middle = track.getBoundingClientRect().left + track.clientWidth / 2
        let nearest = 0
        let smallest = Infinity
        for (let index = 0; index < track.children.length; index += 1) {
          const box = track.children[index].getBoundingClientRect()
          const distance = Math.abs(box.left + box.width / 2 - middle)
          if (distance < smallest) {
            smallest = distance
            nearest = index
          }
        }
        setActiveIndex(nearest)
      })
    }

    track.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      track.removeEventListener('scroll', onScroll)
      if (frame) cancelAnimationFrame(frame)
    }
  }, [count])

  return (
    <section className={styles.reviews} aria-labelledby={headingId}>
      <div className={styles.inner}>
        <div className={styles.head}>
          <Rules />
          <Eyebrow label={eyebrow} />
          <SectionHeading id={headingId} lines={heading} className={styles.heading} />
          <p className={styles.lede}>
            {reviews.lede.map((line) => (
              <span key={line} className={styles.ledeLine}>
                {line}
              </span>
            ))}
          </p>
        </div>

        <div className={styles.rule}>
          <GridRule columns={[1, 2, 1]} />
        </div>

        <div
          ref={trackRef}
          className={styles.track}
          role="group"
          aria-label={railLabel}
          tabIndex={0}
        >
          {loop.map(({ item, copy }, index) => (
            <ReviewCard
              key={`${item.id}-${copy}`}
              review={item}
              ratingLabel={ratingLabel.replace('{value}', String(item.rating))}
              active={index === activeIndex}
              className={styles.card}
              aria-hidden={copy !== 1}
            />
          ))}
        </div>

        <div className={styles.rule}>
          <GridRule columns={[1, 2, 1]} />
        </div>

        <div className={styles.below}>
          <Rules />
          <div className={styles.nav}>
            <CircleButton label={prevLabel} tone="onPaper" glyph="next" onClick={() => nudge(-1)} />
            <CircleButton label={nextLabel} tone="onPaper" glyph="prev" onClick={() => nudge(1)} />
          </div>
        </div>
      </div>
    </section>
  )
}
