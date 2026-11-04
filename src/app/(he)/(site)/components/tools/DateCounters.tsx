'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { addMonths, countText, holidayOn, todayDay, type HolidayId } from '@/lib/days-between'
import { dayFromParts, formatDate, isoFromDay, yearOf } from '@/lib/work-days'

const PATH = '/tools/days-between-dates'

type Counter = { heading: string; value: string; href: string }

const OCTOBER_7 = dayFromParts(2023, 10, 7)

function lastOccurrence(id: HolidayId, today: number) {
  const year = yearOf(today)
  const thisYear = holidayOn(id, year)
  if (thisYear !== null && thisYear <= today) return thisYear
  return holidayOn(id, year - 1)
}

function nextOccurrence(id: HolidayId, today: number) {
  const year = yearOf(today)
  const thisYear = holidayOn(id, year)
  if (thisYear !== null && thisYear >= today) return thisYear
  return holidayOn(id, year + 1)
}

const between = (from: number, to: number) => `${PATH}?from=${isoFromDay(from)}&to=${isoFromDay(to)}`
const countdown = (id: HolidayId) => `${PATH}?mode=countdown&holiday=${id}`
const ahead = (today: number, n: number, unit: 'days' | 'months') =>
  `${PATH}?mode=add&date=${isoFromDay(today)}&n=${n}&unit=${unit}`

function buildCounters(today: number): Counter[] {
  const year = yearOf(today)
  const counters: Counter[] = [
    {
      heading: 'כמה ימים עברו מ-7 באוקטובר 2023',
      value: countText(today - OCTOBER_7, 'days'),
      href: between(OCTOBER_7, today),
    },
  ]

  const passed: [HolidayId, string][] = [
    ['rosh-hashanah', 'כמה זמן עבר מראש השנה'],
    ['yom-kippur', 'כמה זמן עבר מיום כיפור'],
  ]
  for (const [id, heading] of passed) {
    const day = lastOccurrence(id, today)
    if (day !== null) counters.push({ heading, value: countText(today - day, 'days'), href: between(day, today) })
  }

  const yearStart = dayFromParts(year, 1, 1)
  const yearEnd = dayFromParts(year, 12, 31)
  const nextYear = dayFromParts(year + 1, 1, 1)
  counters.push(
    {
      heading: 'כמה ימים עברו מתחילת השנה',
      value: countText(today - yearStart, 'days'),
      href: between(yearStart, today),
    },
    {
      heading: 'כמה ימים נשארו עד סוף השנה',
      value: countText(yearEnd - today, 'days'),
      href: between(today, yearEnd),
    },
    {
      heading: `עוד כמה ימים עד ${year + 1}`,
      value: countText(nextYear - today, 'days'),
      href: between(today, nextYear),
    },
  )

  const upcoming: [HolidayId, string][] = [
    ['hanukkah', 'כמה ימים עד חנוכה'],
    ['purim', 'כמה ימים עד פורים'],
    ['pesach', 'כמה ימים עד פסח'],
  ]
  for (const [id, heading] of upcoming) {
    const day = nextOccurrence(id, today)
    if (day !== null) {
      counters.push({ heading, value: `${countText(day - today, 'days')}, עד ${formatDate(day)}`, href: countdown(id) })
    }
  }

  counters.push(
    { heading: 'איזה תאריך יהיה בעוד 30 יום מהיום', value: formatDate(today + 30), href: ahead(today, 30, 'days') },
    { heading: 'איזה תאריך יהיה בעוד 90 יום מהיום', value: formatDate(today + 90), href: ahead(today, 90, 'days') },
    {
      heading: 'איזה תאריך יהיה בעוד חצי שנה מהיום',
      value: formatDate(addMonths(today, 6).day),
      href: ahead(today, 6, 'months'),
    },
  )
  return counters
}

export default function DateCounters({ referenceDay }: { referenceDay: number }) {
  const [today, setToday] = useState(referenceDay)

  useEffect(() => {
    setToday(todayDay())
  }, [])

  return (
    <>
      <p>נכון ל-{formatDate(today)}. כל מונה פותח את המחשבון עם התאריכים כבר בפנים.</p>
      {buildCounters(today).map((counter) => (
        <div key={counter.heading}>
          <h3>{counter.heading}</h3>
          <p>
            <strong>{counter.value}</strong>.{' '}
            <Link href={counter.href}>לחישוב מדויק במחשבון</Link>
          </p>
        </div>
      ))}
    </>
  )
}
