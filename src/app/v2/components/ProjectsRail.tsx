'use client'

import { useRef } from 'react'
import { useRouter } from 'next/navigation'
import Rail from './Rail'
import Marquee, { type MarqueeHandle } from './Marquee'
import { heroProjects, heroRails } from '../content'
import styles from './ProjectsRail.module.css'

const CARD_STRIDE = 128

export default function ProjectsRail() {
  const router = useRouter()
  const marqueeRef = useRef<MarqueeHandle>(null)

  return (
    <Rail
      title={heroRails.projectsTitle}
      advanceLabel={heroRails.projectsAdvance}
      onAdvance={() => marqueeRef.current?.nudge(CARD_STRIDE)}
    >
      <Marquee
        ref={marqueeRef}
        direction="left"
        speed={18}
        highlightCenter
        className={styles.track}
      >
        {heroProjects.map((project) => (
          <button
            key={project.id}
            type="button"
            className={styles.card}
            aria-label={project.label}
            onClick={() => router.push(project.href)}
          >
            <span className={styles.surface} style={{ background: project.surface }} />
          </button>
        ))}
      </Marquee>
    </Rail>
  )
}
