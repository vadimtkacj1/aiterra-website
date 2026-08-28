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
const GLIDE_DURATION = 560

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
  const count = items.length
  const [activeIndex, setActiveIndex] = useState(count + Math.floor(count / 2))

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

  const glideTo = (index: number) => {
    const track = trackRef.current
    if (!track) return
    cancelAnimationFrame(glideRef.current)
    const calm = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    track.dataset.animating = ''
    glideTarget.current = index
    const start = performance.now()
    const step = (now: number) => {
      const target = glideTarget.current ?? index
      track.scrollLeft += offsetOf(track, target)
      if (!calm && now - start < GLIDE_DURATION) {
        glideRef.current = requestAnimationFrame(step)
      } else {
        track.scrollLeft += offsetOf(track, target)
        delete track.dataset.animating
        glideRef.current = 0
        glideTarget.current = null
      }
    }
    glideRef.current = requestAnimationFrame(step)
  }

  const focus = (index: number) => {
    setActiveIndex(index)
    glideTo(index)
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

    const onScroll = () => {
      if (!frame) {
        frame = requestAnimationFrame(() => {
          frame = 0
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
        })
      }

      if (glideRef.current) return

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
          requestAnimationFrame(() => glideTo(nearest))
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
