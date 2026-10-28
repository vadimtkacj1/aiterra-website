'use client'

import { useEffect, useState } from 'react'
import { ISRAEL_TIME_ZONE, describeDifference, differenceFromIsrael } from '@/lib/time-difference'
import styles from './TimeDifference.module.css'

const timeFormat = (zone: string) =>
  new Intl.DateTimeFormat('he-IL', { timeZone: zone, hour: '2-digit', minute: '2-digit', second: '2-digit', hourCycle: 'h23' })

const dayFormat = (zone: string) =>
  new Intl.DateTimeFormat('he-IL', { timeZone: zone, weekday: 'long', day: 'numeric', month: 'long' })

export default function CityTime({ place, zone, renderedAt }: { place: string; zone: string; renderedAt: number }) {
  const [now, setNow] = useState(() => new Date(renderedAt))

  useEffect(() => {
    setNow(new Date())
    const timer = window.setInterval(() => setNow(new Date()), 1000)
    return () => window.clearInterval(timer)
  }, [])

  const clocks = [
    { title: place, zone },
    { title: 'ישראל', zone: ISRAEL_TIME_ZONE },
  ]

  return (
    <div>
      <div className={styles.clocks}>
        {clocks.map((clock) => (
          <div key={clock.title} className={styles.clock}>
            <p className={styles.clockTitle}>{clock.title}</p>
            <p className={styles.time} dir="ltr">
              {timeFormat(clock.zone).format(now)}
            </p>
            <p className={styles.day}>{dayFormat(clock.zone).format(now)}</p>
          </div>
        ))}
      </div>
      <p>{describeDifference(differenceFromIsrael(zone, now)).replace('היעד', place)}</p>
    </div>
  )
}
