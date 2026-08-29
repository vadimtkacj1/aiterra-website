'use client'

import { useEffect, useRef } from 'react'
import Eyebrow from './Eyebrow'
import SectionHeading from './SectionHeading'
import type { ServicePage } from '../content'
import styles from './HowItWorks.module.css'

type ServiceHowItWorks = NonNullable<ServicePage['howItWorks']>

const ACTIVATION = 0.58

export default function HowItWorks({
  howItWorks,
  headingId,
}: {
  howItWorks: ServiceHowItWorks
  headingId: string
}) {
  const stepsRef = useRef<HTMLOListElement>(null)

  useEffect(() => {
    const steps = stepsRef.current
    if (!steps) return

    const track = window.matchMedia('(min-width: 1024px)')
    let frame = 0

    const clear = () => {
      steps.style.removeProperty('--progress')
      for (const step of steps.children) step.removeAttribute('data-reached')
    }

    const paint = () => {
      frame = 0
      const badges = Array.from(steps.querySelectorAll<HTMLElement>(`.${styles.badge}`))
      const rail = steps.getBoundingClientRect()
      const line = window.innerHeight * ACTIVATION
      const centres = badges.map((badge) => {
        const box = badge.getBoundingClientRect()
        return box.top + box.height / 2
      })
      const end = centres.length ? centres[centres.length - 1] - rail.top : rail.height

      steps.style.setProperty('--progress', `${Math.min(Math.max(line - rail.top, 0), Math.max(end, 0))}px`)

      badges.forEach((badge, index) => {
        badge.closest('li')?.toggleAttribute('data-reached', centres[index] <= line)
      })
    }

    const onScroll = () => {
      if (frame) return
      frame = requestAnimationFrame(paint)
    }

    const sync = () => {
      if (frame) cancelAnimationFrame(frame)
      frame = 0

      if (!track.matches) {
        window.removeEventListener('scroll', onScroll)
        clear()
        return
      }

      window.addEventListener('scroll', onScroll, { passive: true })
      paint()
    }

    sync()
    window.addEventListener('resize', sync)
    track.addEventListener('change', sync)

    return () => {
      if (frame) cancelAnimationFrame(frame)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', sync)
      track.removeEventListener('change', sync)
    }
  }, [howItWorks.steps.length])

  return (
    <section className={styles.how} aria-labelledby={headingId}>
      <div className={styles.inner}>
        <div className={styles.head} data-reveal-item>
          <Eyebrow label={howItWorks.eyebrow} />

          <SectionHeading id={headingId} lines={howItWorks.heading} className={styles.heading} />

          <p className={styles.lede}>{howItWorks.lede}</p>
        </div>

        <ol ref={stepsRef} className={styles.steps}>
          {howItWorks.steps.map((step, index) => (
            <li key={step.id} className={styles.step} data-reveal-item>
              <div className={styles.stepText}>
                <h3 className={styles.stepTitle}>{step.title}</h3>
                <p className={styles.stepBody}>{step.text}</p>
              </div>

              <span className={styles.badgeCell} aria-hidden="true">
                <span className={styles.badge}>{index + 1}</span>
              </span>

              <figure className={styles.stepArt}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={step.art} alt="" className={styles.stepArtImage} />
              </figure>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
