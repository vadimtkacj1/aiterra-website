'use client'

import Link from 'next/link'
import Rail from './Rail'
import Marquee from './Marquee'
import { heroProjects as heroProjectsDefaults, heroRails as heroRailsDefaults } from '../content'
import { useV2 } from '../V2ContentProvider'
import styles from './ProjectsRail.module.css'

export default function ProjectsRail() {
  const heroProjects = useV2('heroProjects', heroProjectsDefaults)
  const heroRails = useV2('heroRails', heroRailsDefaults)

  return (
    <Rail
      title={heroRails.projectsTitle}
      advanceLabel={heroRails.projectsAdvance}
      href="/v2/projects"
    >
      <Marquee direction="left" speed={18} highlightCenter className={styles.track}>
        {heroProjects.map((project) => (
          <Link
            key={project.id}
            href={project.href}
            className={styles.card}
            aria-label={project.label}
          >
            <span className={styles.surface} style={{ background: project.surface }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={project.shot} alt="" className={styles.shot} />
            </span>
          </Link>
        ))}
      </Marquee>
    </Rail>
  )
}
