'use client'

import { useEffect, useRef } from 'react'
import type { CSSProperties } from 'react'
import ActionButton from './ActionButton'
import Eyebrow from './Eyebrow'
import GridRule from './GridRule'
import SectionHeading from './SectionHeading'
import { servicesStack as servicesStackDefaults } from '../content'
import { useV2 } from '../V2ContentProvider'
import styles from './ServicesStack.module.css'

export default function ServicesStack() {
  const servicesStack = useV2('servicesStack', servicesStackDefaults)
  const stackRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const stack = stackRef.current
    const stage = stack?.firstElementChild as HTMLElement | null
    if (!stack || !stage) return

    const items = Array.from(stack.querySelectorAll<HTMLElement>('ol > li'))
    if (!items.length) return

    const last = items.length - 1
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)')

    let peek = 0
    let shrink = 0
    let runway = 1
    let anchor = 0
    let cardHeight = 0
    let stackTop = 0
    let sticky = false

    let target = 0
    let current = 0
    let raf = 0
    let active = false

    const measure = () => {
      const stackStyle = getComputedStyle(stack)
      const stageStyle = getComputedStyle(stage)
      peek = parseFloat(stackStyle.getPropertyValue('--peek')) || 0
      shrink = parseFloat(stackStyle.getPropertyValue('--shrink')) || 0
      runway = parseFloat(stackStyle.getPropertyValue('--runway')) || 1
      anchor = parseFloat(stageStyle.top) || 0
      sticky = stageStyle.position === 'sticky'
      cardHeight = items[0].getBoundingClientRect().height
      stackTop = stack.getBoundingClientRect().top + window.scrollY
      if (!sticky) {
        for (const item of items) item.style.transform = ''
      }
    }

    const paint = () => {
      for (let i = 0; i <= last; i += 1) {
        const depth = Math.min(Math.max(i - current, 0), last)
        const leaving = Math.min(Math.max(current - i, 0), 1)
        const eased = leaving * leaving * (3 - 2 * leaving)
        const y = -depth * peek - eased * cardHeight * 1.32
        items[i].style.transform =
          `translate3d(0,${y.toFixed(1)}px,0) scale(${(1 - depth * shrink).toFixed(4)})`
      }
    }

    const readTarget = () => {
      target = Math.min(Math.max((window.scrollY + anchor - stackTop) / runway, 0), last)
    }

    const tick = () => {
      readTarget()
      const delta = target - current
      if (Math.abs(delta) < 0.0015) {
        if (current !== target) {
          current = target
          paint()
        }
      } else {
        current += reduced.matches ? delta : delta * 0.22
        paint()
      }
      raf = active ? requestAnimationFrame(tick) : 0
    }

    const onResize = () => {
      measure()
      readTarget()
      current = target
      if (sticky) paint()
    }

    const observer = new IntersectionObserver(
      (entries) => {
        active = entries[0].isIntersecting && sticky
        for (const item of items) item.style.willChange = active ? 'transform' : ''
        if (!active) {
          if (raf) cancelAnimationFrame(raf)
          raf = 0
          return
        }
        readTarget()
        current = target
        paint()
        if (!raf) raf = requestAnimationFrame(tick)
      },
      { rootMargin: '300px 0px' },
    )

    measure()
    observer.observe(stack)
    window.addEventListener('resize', onResize)
    return () => {
      if (raf) cancelAnimationFrame(raf)
      observer.disconnect()
      window.removeEventListener('resize', onResize)
    }
  }, [])

  return (
    <section id="v2-services" className={styles.section} aria-labelledby="v2-services-stack-heading">
      <div className={styles.topRule}>
        <GridRule columns={[1, 2, 1]} />
      </div>

      <div className={styles.rails} aria-hidden="true">
        <span />
        <span />
        <span />
      </div>

      <div className={styles.inner}>
        <div className={styles.head}>
          <Eyebrow label={servicesStack.eyebrow} />
          <SectionHeading
            id="v2-services-stack-heading"
            lines={servicesStack.heading}
            className={styles.heading}
          />
          <p className={styles.lede}>{servicesStack.lede}</p>
        </div>
      </div>

      <div className={styles.midRule}>
        <GridRule columns={[1, 2, 1]} />
      </div>

      <div className={styles.inner}>
        <div
          ref={stackRef}
          className={styles.stack}
          style={{ '--count': servicesStack.items.length } as CSSProperties}
        >
          <div className={styles.stage}>
            <ol className={styles.list}>
          {servicesStack.items.map((item, index) => (
            <li
              key={item.id}
              id={`v2-service-${item.id}`}
              className={styles.item}
              style={{ '--index': index } as CSSProperties}
            >
              <article className={styles.card}>
                <div className={styles.body}>
                  <h3 className={styles.title}>{item.title}</h3>

                  <ul className={styles.tags}>
                    {item.tags.map((tag) => (
                      <li key={tag} className={styles.tag}>
                        {tag}
                      </li>
                    ))}
                  </ul>

                  <p className={styles.text}>{item.text}</p>

                  <ActionButton
                    href={item.action.href}
                    label={item.action.label}
                    className={styles.action}
                  />
                </div>

                <figure className={styles.art}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={item.image} alt="" className={styles.artImage} loading="lazy" />
                </figure>
              </article>
            </li>
              ))}
            </ol>
          </div>
        </div>
      </div>

      <div className={styles.bottomRule}>
        <GridRule columns={[1, 2, 1]} />
      </div>
    </section>
  )
}
