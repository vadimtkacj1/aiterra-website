'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import SectionHeading from './SectionHeading'
import Eyebrow from './Eyebrow'
import TabList from './TabList'
import TabAnchors from './TabAnchors'
import TagList from './TagList'
import ActionButton from './ActionButton'
import WideCta from './WideCta'
import GridRule from './GridRule'
import CircleButton from './CircleButton'
import { portfolio, portfolioFilters, portfolioItems } from '../content'
import styles from './Portfolio.module.css'

const cardMetrics = (track: HTMLElement) => {
  const card = track.firstElementChild as HTMLElement | null
  if (!card) return { width: 0, margin: 0 }
  const style = getComputedStyle(card)
  return {
    width: card.getBoundingClientRect().width,
    margin: Number.parseFloat(style.marginInlineStart) || 0,
  }
}

const cardStride = (track: HTMLElement) => {
  const { width, margin } = cardMetrics(track)
  const gap = Number.parseFloat(getComputedStyle(track).columnGap) || 0
  return width + margin * 2 + gap
}

const centerOffset = (track: HTMLElement) => {
  const { width, margin } = cardMetrics(track)
  if (width <= track.clientWidth / 2) return 0
  return (track.clientWidth - width) / 2 - margin
}

export default function Portfolio() {
  const trackRef = useRef<HTMLDivElement>(null)
  const [activeFilter, setActiveFilter] = useState(portfolioFilters[0].id)
  const [activeIndex, setActiveIndex] = useState(0)

  const items = useMemo(
    () =>
      activeFilter === 'all'
        ? portfolioItems
        : portfolioItems.filter((item) => item.category === activeFilter),
    [activeFilter],
  )

  const loop = useMemo(
    () => [0, 1, 2].flatMap((copy) => items.map((item) => ({ item, copy }))),
    [items],
  )

  useEffect(() => {
    const track = trackRef.current
    if (!track || items.length === 0) return

    const sign = getComputedStyle(track).direction === 'rtl' ? -1 : 1
    const copyWidth = () => items.length * cardStride(track)
    const origin = () => copyWidth() - centerOffset(track)

    track.scrollLeft = sign * origin()
    setActiveIndex(0)

    let frame = 0
    const onScroll = () => {
      if (frame) return
      frame = requestAnimationFrame(() => {
        frame = 0
        const width = copyWidth()
        let offset = Math.abs(track.scrollLeft)
        if (offset < width * 0.5) {
          offset += width
          track.scrollLeft = sign * offset
        } else if (offset > width * 1.5) {
          offset -= width
          track.scrollLeft = sign * offset
        }
        const stride = cardStride(track) || 1
        const index = Math.round((offset - origin()) / stride)
        setActiveIndex(((index % items.length) + items.length) % items.length)
      })
    }

    track.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      track.removeEventListener('scroll', onScroll)
      if (frame) cancelAnimationFrame(frame)
    }
  }, [items])

  const step = (direction: 'prev' | 'next') => {
    const track = trackRef.current
    if (!track || !track.firstElementChild) return
    const sign = getComputedStyle(track).direction === 'rtl' ? -1 : 1
    const distance = cardStride(track)
    track.scrollBy({ left: sign * distance * (direction === 'next' ? 1 : -1), behavior: 'smooth' })
  }

  const activeItem = items[activeIndex] ?? items[0]

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

        <div className={styles.rule}>
          <GridRule columns={[1, 2, 1]} />
        </div>

        <div className={styles.stage}>
          <div ref={trackRef} className={styles.track} data-reveal-item>
            {loop.map(({ item, copy }) => (
              <article key={`${item.id}-${copy}`} className={styles.card} aria-hidden={copy !== 1}>
                <div className={styles.shot}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={item.shot} alt="" className={styles.shotImage} />
                </div>

                <div className={styles.meta}>
                  <ActionButton href={item.href} label={portfolio.cardAction} />
                  <div className={styles.metaText}>
                    <h3 className={styles.title}>{item.title}</h3>
                    <TagList tags={item.tags} className={styles.tags} />
                  </div>
                </div>
              </article>
            ))}
          </div>

          <div className={styles.rule}>
            <GridRule columns={[1, 2, 1]} />
          </div>

          {activeItem ? (
            <div className={styles.stageMeta}>
              <p className={styles.stageTitle}>{activeItem.title}</p>
              <TagList tags={activeItem.tags} align="center" className={styles.stageTags} />
              <ActionButton
                href={activeItem.href}
                label={portfolio.cardAction}
                className={styles.stageAction}
              />
            </div>
          ) : null}

          <div className={styles.nav}>
            <div className={styles.rules} aria-hidden="true">
              <span />
              <span />
              <span />
            </div>
            <CircleButton
              label={portfolio.prev}
              tone="onPaper"
              glyph="next"
              onClick={() => step('prev')}
            />
            <CircleButton
              label={portfolio.next}
              tone="onPaper"
              glyph="prev"
              onClick={() => step('next')}
            />
          </div>
        </div>

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
