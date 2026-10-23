'use client'

import { useEffect, useId, useMemo, useState } from 'react'
import { ISRAEL_TIME_ZONE, differenceFromIsrael, hoursText, meetingOverlap } from '@/lib/time-difference'
import { enCities, enDescribeDifference, enFormatDifference } from './time-difference-en'
import ui from '../../../../(he)/(site)/components/tools/toolUi.module.css'
import styles from '../../../../(he)/(site)/components/tools/TimeDifference.module.css'

const SIX_MONTHS_MS = 182 * 86400000
const startOptions = Array.from({ length: 24 }, (_, hour) => hour)
const endOptions = Array.from({ length: 24 }, (_, index) => index + 1)

const clockFormat = (zone: string) =>
  new Intl.DateTimeFormat('en-GB', {
    timeZone: zone,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hourCycle: 'h23',
  })

const dayFormat = (zone: string) =>
  new Intl.DateTimeFormat('en-GB', { timeZone: zone, weekday: 'long', day: 'numeric', month: 'long' })

function Clock({ title, zone, now }: { title: string; zone: string; now: Date | null }) {
  return (
    <div className={styles.clock}>
      <p className={styles.clockTitle}>{title}</p>
      <p className={styles.time}>{now ? clockFormat(zone).format(now) : '--:--:--'}</p>
      <p className={styles.day}>{now ? dayFormat(zone).format(now) : ' '}</p>
    </div>
  )
}

function HourSelect({
  label,
  value,
  options,
  onChange,
}: {
  label: string
  value: number
  options: number[]
  onChange: (value: number) => void
}) {
  const id = useId()
  return (
    <div className={ui.field}>
      <label htmlFor={id} className={ui.label}>
        {label}
      </label>
      <select id={id} className={ui.input} value={value} onChange={(event) => onChange(Number(event.target.value))}>
        {options.map((hour) => (
          <option key={hour} value={hour}>
            {hoursText(hour)}
          </option>
        ))}
      </select>
    </div>
  )
}

export default function TimeDifferenceEn() {
  const searchId = useId()
  const cityId = useId()
  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState('new-york')
  const [now, setNow] = useState<Date | null>(null)
  const [israelStart, setIsraelStart] = useState(9)
  const [israelEnd, setIsraelEnd] = useState(18)
  const [destinationStart, setDestinationStart] = useState(9)
  const [destinationEnd, setDestinationEnd] = useState(18)

  useEffect(() => {
    setNow(new Date())
    const timer = window.setInterval(() => setNow(new Date()), 1000)
    return () => window.clearInterval(timer)
  }, [])

  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase()
    if (!needle) return enCities
    return enCities.filter((city) => `${city.name} ${city.country}`.toLowerCase().includes(needle))
  }, [query])

  const city = enCities.find((item) => item.id === selected) ?? enCities[0]
  const options = visible.some((item) => item.id === city.id) ? visible : [city, ...visible]

  const current = now ? differenceFromIsrael(city.zone, now) : null
  const later = now ? differenceFromIsrael(city.zone, new Date(now.getTime() + SIX_MONTHS_MS)) : null
  const validWindows = israelEnd > israelStart && destinationEnd > destinationStart
  const overlap =
    current !== null && validWindows
      ? meetingOverlap(
          current,
          { start: israelStart, end: israelEnd },
          { start: destinationStart, end: destinationEnd },
        )
      : null

  const barLabel = overlap
    ? overlap.ranges.length
      ? `Overlapping hours, Israel time: ${overlap.ranges
          .map((range) => `${hoursText(range.israelStart)} to ${hoursText(range.israelEnd)}`)
          .join(', ')}`
      : 'No overlapping hours'
    : 'No data'

  return (
    <section className={ui.tool} aria-label="Time difference between Israel and a destination" dir="ltr">
      <div className={ui.inner}>
        <form className={ui.form} onSubmit={(event) => event.preventDefault()}>
          <fieldset className={ui.group}>
            <legend className={ui.legend}>Choose a destination</legend>
            <div className={ui.field}>
              <label htmlFor={searchId} className={ui.label}>
                Search a city or country
              </label>
              <input
                id={searchId}
                type="search"
                className={ui.input}
                value={query}
                autoComplete="off"
                placeholder="e.g. New York, Thailand"
                onChange={(event) => setQuery(event.target.value)}
              />
              <p className={ui.hint} aria-live="polite">
                {visible.length ? `${visible.length} cities in the list` : 'No city found, try another name'}
              </p>
            </div>
            <div className={ui.field}>
              <label htmlFor={cityId} className={ui.label}>
                City
              </label>
              <select
                id={cityId}
                className={ui.input}
                value={selected}
                onChange={(event) => setSelected(event.target.value)}
              >
                {options.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name}, {item.country}
                  </option>
                ))}
              </select>
            </div>
          </fieldset>

          <fieldset className={ui.group}>
            <legend className={ui.legend}>When can you talk</legend>
            <fieldset className={ui.group}>
              <legend className={ui.legend}>Working hours in Israel</legend>
              <div className={styles.pair}>
                <HourSelect label="From" value={israelStart} options={startOptions} onChange={setIsraelStart} />
                <HourSelect label="To" value={israelEnd} options={endOptions} onChange={setIsraelEnd} />
              </div>
            </fieldset>
            <fieldset className={ui.group}>
              <legend className={ui.legend}>Working hours in {city.name}</legend>
              <div className={styles.pair}>
                <HourSelect label="From" value={destinationStart} options={startOptions} onChange={setDestinationStart} />
                <HourSelect label="To" value={destinationEnd} options={endOptions} onChange={setDestinationEnd} />
              </div>
            </fieldset>
            {validWindows ? null : <p className={styles.error}>The end time must be after the start time.</p>}
          </fieldset>
        </form>

        <div className={ui.output}>
          <div className={ui.sticky}>
            <h2 className={ui.outputTitle}>The time now</h2>
            <div className={styles.clocks}>
              <Clock title="Israel" zone={ISRAEL_TIME_ZONE} now={now} />
              <Clock title={city.name} zone={city.zone} now={now} />
            </div>
            <p className={styles.difference} aria-live="polite">
              {current === null ? 'Loading the time…' : enDescribeDifference(current)}
              {current !== null && current !== 0 ? (
                <span className={styles.differenceValue}>{enFormatDifference(current)}</span>
              ) : null}
            </p>
            {later !== null && current !== null ? (
              <p className={ui.note}>
                In about six months the difference will be{' '}
                <strong className={styles.inline}>{enFormatDifference(later)}</strong>
                {later === current ? ', unchanged.' : ', because of a daylight saving time change.'}
              </p>
            ) : null}

            <h3 className={styles.planTitle}>Meeting overlap</h3>
            <div className={styles.bar} role="img" aria-label={barLabel}>
              {(overlap?.slots ?? Array.from({ length: 48 }, () => false)).map((on, slot) => (
                <span key={slot} className={on ? styles.cellOn : styles.cell} />
              ))}
            </div>
            <div className={styles.barScale} aria-hidden="true">
              <span>00:00</span>
              <span>12:00</span>
              <span>24:00</span>
            </div>
            <p className={styles.overlap} aria-live="polite">
              {overlap === null
                ? 'Choose valid working hours.'
                : overlap.ranges.length === 0
                  ? 'No overlap in the working hours you chose. Try moving one side by an hour or two.'
                  : `${overlap.totalHours} overlapping hours. Israel time: ${overlap.ranges
                      .map((range) => `${hoursText(range.israelStart)}–${hoursText(range.israelEnd)}`)
                      .join(', ')}.`}
            </p>
            <p className={ui.note}>The bar shows one day in Israel time, using the difference as it is right now.</p>
          </div>
        </div>
      </div>
    </section>
  )
}
