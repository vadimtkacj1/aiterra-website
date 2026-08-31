'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import ActionButton from './ActionButton'
import CircleButton from './CircleButton'
import GridRule from './GridRule'
import TagList from './TagList'
import useAutoplay from './useAutoplay'
import styles from './ProjectsCarousel.module.css'

export type CarouselProject = {
  id: string
  title: string
  tags: string[]
  shot: string
  href: string
}

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

const GLIDE_DURATION = 900

const noop = () => {}

const easeInOutCubic = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2)

const glide = (track: HTMLElement, distance: number) => {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    track.scrollLeft += distance
    return noop
  }

  const snap = track.style.scrollSnapType
  track.style.scrollSnapType = 'none'

  let raf = 0
  let started = 0
  let base = track.scrollLeft
  let expected = base

  const finish = () => {
    if (raf) cancelAnimationFrame(raf)
    raf = 0
    track.style.scrollSnapType = snap
    track.removeEventListener('pointerdown', finish)
    track.removeEventListener('touchstart', finish)
    track.removeEventListener('wheel', finish)
  }

  const frame = (now: number) => {
    if (!started) started = now
    const drift = track.scrollLeft - expected
    if (Math.abs(drift) > 2) base += drift
    const progress = Math.min((now - started) / GLIDE_DURATION, 1)
    expected = base + distance * easeInOutCubic(progress)
    track.scrollLeft = expected
    if (progress < 1) {
      raf = requestAnimationFrame(frame)
      return
    }
    finish()
  }

  track.addEventListener('pointerdown', finish)
  track.addEventListener('touchstart', finish, { passive: true })
  track.addEventListener('wheel', finish, { passive: true })
  raf = requestAnimationFrame(frame)
  return finish
}

const advance = (track: HTMLElement, direction: 'prev' | 'next') => {
  if (!track.firstElementChild) return noop
  const sign = getComputedStyle(track).direction === 'rtl' ? -1 : 1
  return glide(track, sign * cardStride(track) * (direction === 'next' ? 1 : -1))
}

const slideLeft = (track: HTMLElement) => {
  if (!track.firstElementChild) return noop
  return glide(track, cardStride(track))
}

type ProjectsCarouselProps = {
  items: CarouselProject[]
  action: string
  prevLabel: string
  nextLabel: string
  className?: string
}

export default function ProjectsCarousel({
  items,
  action,
  prevLabel,
  nextLabel,
  className,
}: ProjectsCarouselProps) {
  const trackRef = useRef<HTMLDivElement>(null)
  const glideRef = useRef<() => void>(noop)
  const [activeIndex, setActiveIndex] = useState(0)

  const looped = items.length > 1

  const loop = useMemo(
    () => (looped ? [0, 1, 2] : [0]).flatMap((copy) => items.map((item) => ({ item, copy }))),
    [items, looped],
  )

  const restartAutoplay = useAutoplay(
    trackRef,
    () => {
      const track = trackRef.current
      if (!track) return
      glideRef.current()
      glideRef.current = slideLeft(track)
    },
    { enabled: items.length > 1 },
  )

  useEffect(() => {
    const track = trackRef.current
    if (!track || items.length === 0) return

    if (!looped) {
      track.scrollLeft = 0
      setActiveIndex(0)
      return
    }

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
      glideRef.current()
      glideRef.current = noop
      track.removeEventListener('scroll', onScroll)
      if (frame) cancelAnimationFrame(frame)
    }
  }, [items, looped])

  const step = (direction: 'prev' | 'next') => {
    const track = trackRef.current
    if (!track) return
    glideRef.current()
    glideRef.current = advance(track, direction)
    restartAutoplay.current()
  }

  const activeItem = items[activeIndex] ?? items[0]

  return (
    <div className={[styles.carousel, className].filter(Boolean).join(' ')}>
      <div ref={trackRef} className={styles.track} data-single={!looped || undefined} data-reveal-item>
        {loop.map(({ item, copy }) => (
          <article
            key={`${item.id}-${copy}`}
            className={styles.card}
            aria-hidden={looped && copy !== 1}
          >
            <div className={styles.shot}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={item.shot} alt="" className={styles.shotImage} />
            </div>

            <div className={styles.meta}>
              <div className={styles.metaText}>
                <h3 className={styles.title}>{item.title}</h3>
                <TagList tags={item.tags} className={styles.tags} />
              </div>
              <ActionButton href={item.href} label={action} />
            </div>
          </article>
        ))}
      </div>

      <GridRule columns={[1, 2, 1]} />

      {activeItem ? (
        <div className={styles.stageMeta}>
          <p className={styles.stageTitle}>{activeItem.title}</p>
          <TagList tags={activeItem.tags} align="center" className={styles.stageTags} />
          <ActionButton
            href={activeItem.href}
            label={action}
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
        {looped ? (
          <>
            <CircleButton label={prevLabel} tone="onPaper" glyph="next" onClick={() => step('prev')} />
            <CircleButton label={nextLabel} tone="onPaper" glyph="prev" onClick={() => step('next')} />
          </>
        ) : null}
      </div>
    </div>
  )
}
