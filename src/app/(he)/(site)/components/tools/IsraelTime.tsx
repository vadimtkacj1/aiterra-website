'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { ISRAEL_TIME_ZONE, differenceFromIsrael, formatDifference } from '@/lib/time-difference'
import styles from './TimeDifference.module.css'

export type WorldPlace = { place: string; zone: string; href: string }

const timeFormat = (zone: string, seconds: boolean) =>
  new Intl.DateTimeFormat('he-IL', {
    timeZone: zone,
    hour: '2-digit',
    minute: '2-digit',
    ...(seconds ? { second: '2-digit' } : {}),
    hourCycle: 'h23',
  })

const dayFormat = (zone: string) =>
  new Intl.DateTimeFormat('he-IL', { timeZone: zone, weekday: 'long', day: 'numeric', month: 'long' })

const shortDay = (zone: string) => new Intl.DateTimeFormat('he-IL', { timeZone: zone, weekday: 'short' })

export default function IsraelTime({ places, renderedAt }: { places: WorldPlace[]; renderedAt: number }) {
  const [now, setNow] = useState(() => new Date(renderedAt))

  useEffect(() => {
    setNow(new Date())
    const timer = window.setInterval(() => setNow(new Date()), 1000)
    return () => window.clearInterval(timer)
  }, [])

  const israelDay = shortDay(ISRAEL_TIME_ZONE).format(now)

  return (
    <div>
      <div className={styles.clock}>
        <p className={styles.clockTitle}>ישראל</p>
        <p className={styles.time} dir="ltr">
          {timeFormat(ISRAEL_TIME_ZONE, true).format(now)}
        </p>
        <p className={styles.day}>{dayFormat(ISRAEL_TIME_ZONE).format(now)}</p>
      </div>
      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <caption>השעה עכשיו ב-{places.length} מקומות, מול ישראל</caption>
          <thead>
            <tr>
              <th scope="col">מקום</th>
              <th scope="col">השעה שם</th>
              <th scope="col">מול ישראל</th>
            </tr>
          </thead>
          <tbody>
            {places.map((item) => {
              const day = shortDay(item.zone).format(now)
              return (
                <tr key={item.href}>
                  <th scope="row">
                    <Link href={item.href}>{item.place}</Link>
                  </th>
                  <td dir="ltr" className={styles.value}>
                    {timeFormat(item.zone, false).format(now)}
                    {day === israelDay ? '' : ` (${day})`}
                  </td>
                  <td dir="ltr" className={styles.value}>
                    {formatDifference(differenceFromIsrael(item.zone, now))}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
