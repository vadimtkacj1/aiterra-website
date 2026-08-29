'use client'

import { useEffect, useId, useMemo, useRef, useState } from 'react'
import SectionHeading from './SectionHeading'
import Eyebrow from './Eyebrow'
import CircleButton from './CircleButton'
import GridRule from './GridRule'
import { CrossMark, PlayIcon } from './icons'
import { reelItems, reels } from '../content'
import type { ReelItem } from '../content'
import styles from './Reels.module.css'

type ReelsProps = {
  eyebrow?: string
  heading?: string[]
  lede?: string[]
  items?: ReelItem[]
  prevLabel?: string
  nextLabel?: string
}

const SETTLE_DELAY = 140
const GLIDE_DURATION = 450
const SNAP_RELEASE = 120
const GLIDE_EASE = [0.22, 1, 0.36, 1] as const

const glideProgress = (elapsed: number) => {
  const [x1, y1, x2, y2] = GLIDE_EASE
  const time = Math.min(Math.max(elapsed, 0), 1)
  const axis = (u: number, a: number, b: number) =>
    3 * (1 - u) * (1 - u) * u * a + 3 * (1 - u) * u * u * b + u * u * u

  let u = time
  for (let pass = 0; pass < 5; pass += 1) {
    const slope =
      3 * (1 - u) * (1 - u) * x1 + 6 * (1 - u) * u * (x2 - x1) + 3 * u * u * (1 - x2)
    if (Math.abs(slope) < 1e-6) break
    u -= (axis(u, x1, x2) - time) / slope
  }

  return axis(Math.min(Math.max(u, 0), 1), y1, y2)
}

export default function Reels({
  eyebrow = reels.eyebrow,
  heading = reels.heading,
  lede = reels.lede,
  items = reelItems,
  prevLabel = reels.prev,
  nextLabel = reels.next,
}: ReelsProps) {
  const headingId = useId()
  const trackRef = useRef<HTMLDivElement>(null)
  const glideRef = useRef(0)
  const glideTarget = useRef<number | null>(null)
  const normalizeRef = useRef<() => void>(() => {})
  const releaseRef = useRef(0)
  const count = items.length
  const [activeIndex, setActiveIndex] = useState(count + Math.floor(count / 2))
  const activeRef = useRef(activeIndex)
  activeRef.current = activeIndex

  const loop = useMemo(
    () => [0, 1, 2].flatMap((copy) => items.map((item) => ({ item, copy }))),
    [items],
  )
  const activeItem = count > 0 ? ((activeIndex % count) + count) % count : 0

  const offsetOf = (track: HTMLDivElement, index: number) => {
    const card = track.children[index]
    if (!card) return 0
    const cardBox = card.getBoundingClientRect()
    const trackBox = track.getBoundingClientRect()
    return cardBox.left + cardBox.width / 2 - (trackBox.left + trackBox.width / 2)
  }

  const resizeShift = (track: HTMLDivElement, index: number, from: number) => {
    const target = track.children[index]
    const wide = track.children[from]
    if (!target || !wide || target === wide) return 0

    const grow = wide.getBoundingClientRect().width - target.getBoundingClientRect().width
    const towardsEnd = index > from ? 1 : -1
    const rtl = getComputedStyle(track).direction === 'rtl' ? 1 : -1
    return (grow / 2) * towardsEnd * rtl
  }

  const resizeDuration = (track: HTMLDivElement) => {
    const card = track.children[0]
    if (!card) return GLIDE_DURATION
    const seconds = Number.parseFloat(getComputedStyle(card).transitionDuration)
    return Number.isFinite(seconds) ? seconds * 1000 : GLIDE_DURATION
  }

  const glideTo = (index: number, from: number = activeRef.current) => {
    const track = trackRef.current
    if (!track) return
    cancelAnimationFrame(glideRef.current)
    window.clearTimeout(releaseRef.current)

    const distance = offsetOf(track, index) + resizeShift(track, index, from)
    const duration = resizeDuration(track)
    glideTarget.current = index
    track.dataset.animating = ''

    const release = () => {
      releaseRef.current = window.setTimeout(() => {
        track.scrollLeft += offsetOf(track, glideTarget.current ?? index)
        delete track.dataset.animating
        glideRef.current = 0
        glideTarget.current = null
        releaseRef.current = 0
        normalizeRef.current()
      }, SNAP_RELEASE)
    }

    if (!duration || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      track.scrollLeft += distance
      release()
      return
    }

    const start = performance.now()
    let base = track.scrollLeft
    let expected = base

    const step = (now: number) => {
      const drift = track.scrollLeft - expected
      if (Math.abs(drift) > 2) base += drift

      const progress = Math.min((now - start) / duration, 1)
      expected = base + distance * glideProgress(progress)
      track.scrollLeft = expected

      if (progress < 1) {
        glideRef.current = requestAnimationFrame(step)
        return
      }

      glideRef.current = 0
      release()
    }

    glideRef.current = requestAnimationFrame(step)
  }

  const focus = (index: number) => {
    const from = activeRef.current
    setActiveIndex(index)
    glideTo(index, from)
  }

  useEffect(() => {
    const track = trackRef.current
    if (!track) return
    track.scrollLeft += offsetOf(track, count + Math.floor(count / 2))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    const track = trackRef.current
    if (!track || count === 0) return

    const sign = getComputedStyle(track).direction === 'rtl' ? -1 : 1
    // One copy measured from the items themselves, so the track's centring
    // padding never leaks into the wrap distance.
    const copyWidth = () => {
      const first = track.children[0]?.getBoundingClientRect()
      const next = track.children[count]?.getBoundingClientRect()
      return first && next ? Math.abs(next.left - first.left) : 0
    }

    let frame = 0
    let timer: ReturnType<typeof setTimeout>

    const normalize = () => {
      const width = copyWidth()
      if (!width) return
      const offset = Math.abs(track.scrollLeft)
      if (offset < width * 0.5) {
        track.scrollLeft = sign * (offset + width)
        setActiveIndex((current) => current + count)
        if (glideTarget.current !== null) glideTarget.current += count
      } else if (offset > width * 1.5) {
        track.scrollLeft = sign * (offset - width)
        setActiveIndex((current) => current - count)
        if (glideTarget.current !== null) glideTarget.current -= count
      }
    }

    normalizeRef.current = normalize

    const onScroll = () => {
      if (glideRef.current || glideTarget.current !== null) return

      if (!frame) {
        frame = requestAnimationFrame(() => {
          frame = 0
          normalize()
        })
      }

      // Promote only once the gesture settles: resizing a card while it is
      // still moving re-runs snapping underneath the finger.
      clearTimeout(timer)
      timer = setTimeout(() => {
        if (glideRef.current) return
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
        setActiveIndex((current) => {
          if (current === nearest) return current
          requestAnimationFrame(() => glideTo(nearest, current))
          return nearest
        })
      }, SETTLE_DELAY)
    }

    track.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      track.removeEventListener('scroll', onScroll)
      if (frame) cancelAnimationFrame(frame)
      cancelAnimationFrame(glideRef.current)
      clearTimeout(timer)
      window.clearTimeout(releaseRef.current)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [count])

  return (
    <section className={styles.reels} aria-labelledby={headingId}>
      <div className={styles.inner}>
        <div className={styles.topRule}>
          <GridRule />
        </div>

        <div className={styles.head} data-reveal-item>
          <Eyebrow label={eyebrow} />
          <SectionHeading id={headingId} lines={heading} className={styles.heading} />
          <p className={styles.lede}>
            {lede.map((line, index) => (
              <span key={line} className={styles.ledeLine}>
                {index > 0 ? ' ' : null}
                {line}
              </span>
            ))}
          </p>
        </div>

        <div className={styles.grid} data-reveal-item>
          <div className={styles.rails} aria-hidden="true">
            <span />
            <span />
            <span />
          </div>

          <div className={styles.band}>
            <div ref={trackRef} className={styles.track}>
              {loop.map(({ item, copy }, index) => (
                <button
                  key={`${item.id}-${copy}`}
                  type="button"
                  className={[styles.reel, index % count === activeItem ? styles.reelActive : ''].join(' ')}
                  aria-label={item.label}
                  aria-current={index === activeIndex}
                  aria-hidden={copy !== 1}
                  onClick={() => focus(index)}
                >
                  <span className={[styles.edgeH, styles.edgeHTop].join(' ')} aria-hidden="true" />
                  <span className={[styles.edgeH, styles.edgeHBottom].join(' ')} aria-hidden="true" />
                  <CrossMark className={[styles.edgeCross, styles.edgeCrossTop, styles.edgeCrossStart].join(' ')} />
                  <CrossMark className={[styles.edgeCross, styles.edgeCrossTop, styles.edgeCrossEnd].join(' ')} />
                  <CrossMark className={[styles.edgeCross, styles.edgeCrossBottom, styles.edgeCrossStart].join(' ')} />
                  <CrossMark className={[styles.edgeCross, styles.edgeCrossBottom, styles.edgeCrossEnd].join(' ')} />
                  <span className={styles.surface} style={{ background: item.surface }} />
                  <span className={styles.play}>
                    <PlayIcon />
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className={styles.nav}>
            <CircleButton
              label={prevLabel}
              tone="onPaper"
              glyph="next"
              onClick={() => focus(activeIndex - 1)}
            />
            <CircleButton
              label={nextLabel}
              tone="onPaper"
              glyph="prev"
              onClick={() => focus(activeIndex + 1)}
            />
          </div>
        </div>

        <GridRule columns={[1, 2, 1]} />
      </div>
    </section>
  )
}
