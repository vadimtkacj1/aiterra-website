'use client'

import { useRef } from 'react'
import Rail from './Rail'
import Chip from './Chip'
import Marquee, { type MarqueeHandle } from './Marquee'
import { heroRails as heroRailsDefaults, heroTopics as heroTopicsDefaults } from '../content'
import { useV2 } from '../V2ContentProvider'
import styles from './TopicsRail.module.css'

const NUDGE = 120

export default function TopicsRail() {
  const heroRails = useV2('heroRails', heroRailsDefaults)
  const heroTopics = useV2('heroTopics', heroTopicsDefaults)
  const upperTopics = heroTopics.filter((topic, index) => index % 2 === 0)
  const lowerTopics = heroTopics.filter((topic, index) => index % 2 === 1)
  const upperRef = useRef<MarqueeHandle>(null)
  const lowerRef = useRef<MarqueeHandle>(null)

  const advance = () => {
    upperRef.current?.nudge(NUDGE)
    lowerRef.current?.nudge(NUDGE)
  }

  return (
    <Rail title={heroRails.topicsTitle} advanceLabel={heroRails.topicsAdvance} onAdvance={advance}>
      <div className={styles.rows}>
        <Marquee ref={upperRef} direction="left" speed={22}>
          {upperTopics.map((topic) => (
            <Chip key={topic} className={styles.chip}>
              {topic}
            </Chip>
          ))}
        </Marquee>
        <Marquee ref={lowerRef} direction="left" speed={22}>
          {lowerTopics.map((topic) => (
            <Chip key={topic} className={styles.chip}>
              {topic}
            </Chip>
          ))}
        </Marquee>
      </div>
    </Rail>
  )
}
