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

    const rail = window.matchMedia('(max-width: 640px)')
    const timeline = window.matchMedia('(min-width: 1024px)')
    let frame = 0

    const mark = (reached: number) => {
      Array.from(steps.children).forEach((step, index) => {
        step.toggleAttribute('data-reached', index <= reached)
      })
    }

    const paintColumn = () => {
      frame = 0
      const badges = Array.from(steps.querySelectorAll<HTMLElement>(`.${styles.badge}`))
      const box = steps.getBoundingClientRect()
      const line = window.innerHeight * ACTIVATION
      const centres = badges.map((badge) => {
        const badgeBox = badge.getBoundingClientRect()
        return badgeBox.top + badgeBox.height / 2
      })
      const last = centres.length ? centres[centres.length - 1] - box.top : box.height

      if (timeline.matches) {
        steps.style.setProperty(
          '--progress',
          `${Math.min(Math.max(line - box.top, 0), Math.max(last, 0))}px`,
        )
      }

      mark(centres.reduce((count, centre) => (centre <= line ? count + 1 : count), 0) - 1)
    }

    const paintRail = () => {
      frame = 0
      const box = steps.getBoundingClientRect()
      const rtl = getComputedStyle(steps).direction === 'rtl'
      const start = rtl ? box.right : box.left
      let nearest = 0
      let smallest = Infinity

      Array.from(steps.children).forEach((step, index) => {
        const stepBox = step.getBoundingClientRect()
        const distance = Math.abs((rtl ? stepBox.right : stepBox.left) - start)
        if (distance < smallest) {
          smallest = distance
          nearest = index
        }
      })

      steps.style.setProperty('--rail-progress', `${(nearest + 1) / steps.children.length}`)
      mark(nearest)
    }

    const paint = () => (rail.matches ? paintRail() : paintColumn())

    const onScroll = () => {
      if (frame) return
      frame = requestAnimationFrame(paint)
    }

    const sync = () => {
      if (frame) cancelAnimationFrame(frame)
      frame = 0
      steps.style.removeProperty('--progress')
      steps.style.removeProperty('--rail-progress')
      window.removeEventListener('scroll', onScroll)
      steps.removeEventListener('scroll', onScroll)

      if (rail.matches) steps.addEventListener('scroll', onScroll, { passive: true })
      else window.addEventListener('scroll', onScroll, { passive: true })

      paint()
    }

    sync()
    window.addEventListener('resize', sync)
    rail.addEventListener('change', sync)
    timeline.addEventListener('change', sync)

    return () => {
      if (frame) cancelAnimationFrame(frame)
      window.removeEventListener('scroll', onScroll)
      steps.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', sync)
      rail.removeEventListener('change', sync)
      timeline.removeEventListener('change', sync)
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
