'use client'

import { useEffect, useRef, type CSSProperties } from 'react'
import SectionHeading from './SectionHeading'
import Eyebrow from './Eyebrow'
import GridRule from './GridRule'
import { allIn, allInNodes } from '../content'
import styles from './AllIn.module.css'

const RINGS = ['ringOuter', 'ringMid', 'ringInner'] as const

type NodeVars = CSSProperties & {
  '--node-x': string
  '--node-y': string
  '--node-edge': string
  '--node-index': number
  '--m-x': string
  '--m-y': string
  '--m-len': string
}

export default function AllIn() {
  const cardRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const card = cardRef.current
    if (!card) return

    if (!('IntersectionObserver' in window)) {
      card.setAttribute('data-active', '')
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return
        card.setAttribute('data-active', '')
        observer.disconnect()
      },
      { rootMargin: '0px 0px -12% 0px', threshold: 0.2 },
    )

    observer.observe(card)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const card = cardRef.current
    if (!card) return

    if (!('IntersectionObserver' in window)) {
      card.setAttribute('data-inview', '')
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) card.setAttribute('data-inview', '')
          else card.removeAttribute('data-inview')
        }
      },
      { rootMargin: '200px 0px' },
    )

    observer.observe(card)
    return () => observer.disconnect()
  }, [])

  return (
    <section className={styles.allIn} aria-labelledby="v2-allin-heading">
      <div className={styles.topRule}>
        <GridRule />
      </div>

      <div className={styles.head} data-reveal-item>
        <Eyebrow label={allIn.eyebrow} />
        <SectionHeading
          id="v2-allin-heading"
          lines={allIn.heading}
          className={styles.heading}
        />
      </div>

      <div ref={cardRef} className={styles.card}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/images/all-in-bg.webp" alt="" className={styles.bg} />

        <div className={styles.rings} aria-hidden="true">
          {RINGS.map((ring) => (
            <span key={ring} className={[styles.ring, styles[ring]].join(' ')}>
              <span className={styles.orbit} />
            </span>
          ))}
        </div>

        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/hero/hero-aiterra.webp"
          alt=""
          className={styles.wordmark}
          aria-hidden="true"
        />

        <ul className={styles.nodes}>
          {allInNodes.map((node, index) => (
            <li
              key={node.id}
              className={[
                styles.node,
                node.side === 'left' ? styles.nodeLeft : styles.nodeRight,
                node.mobile.place === 'top' ? styles.nodeTop : styles.nodeBottom,
              ].join(' ')}
              style={
                {
                  '--node-x': node.x,
                  '--node-y': node.y,
                  '--node-edge': node.edge,
                  '--node-index': index,
                  '--m-x': node.mobile.x,
                  '--m-y': node.mobile.y,
                  '--m-len': node.mobile.len,
                } as NodeVars
              }
            >
              <span className={styles.label}>{node.label}</span>
              <span className={styles.connector} aria-hidden="true">
                <span className={styles.beam} />
              </span>
              <span className={styles.marker} aria-hidden="true">
                <span className={styles.markerGlow} />
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
