'use client'

import { useEffect, useId, useMemo, useState } from 'react'
import {
  ISRAEL_TIME_ZONE,
  cities,
  cityById,
  describeDifference,
  differenceFromIsrael,
  formatDifference,
  hoursText,
  meetingOverlap,
} from '@/lib/time-difference'
import ui from './toolUi.module.css'
import styles from './TimeDifference.module.css'

const SIX_MONTHS_MS = 182 * 86400000
const startOptions = Array.from({ length: 24 }, (_, hour) => hour)
const endOptions = Array.from({ length: 24 }, (_, index) => index + 1)

const clockFormat = (zone: string) =>
  new Intl.DateTimeFormat('he-IL', {
    timeZone: zone,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hourCycle: 'h23',
  })

const dayFormat = (zone: string) =>
  new Intl.DateTimeFormat('he-IL', { timeZone: zone, weekday: 'long', day: 'numeric', month: 'long' })

function Clock({ title, zone, now }: { title: string; zone: string; now: Date | null }) {
  return (
    <div className={styles.clock}>
      <p className={styles.clockTitle}>{title}</p>
      <p className={styles.time} dir="ltr">
        {now ? clockFormat(zone).format(now) : '--:--:--'}
      </p>
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

export default function TimeDifference() {
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
    if (!needle) return cities
    return cities.filter((city) => `${city.name} ${city.country}`.toLowerCase().includes(needle))
  }, [query])

  const city = cityById(selected) ?? cities[0]
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
      ? `שעות חפיפה בשעון ישראל: ${overlap.ranges
          .map((range) => `${hoursText(range.israelStart)} עד ${hoursText(range.israelEnd)}`)
          .join(', ')}`
      : 'אין שעות חפיפה'
    : 'אין נתונים'

  return (
    <section className={ui.tool} aria-label="הפרש שעות בין ישראל ליעד">
      <div className={ui.inner}>
        <form className={ui.form} onSubmit={(event) => event.preventDefault()}>
          <fieldset className={ui.group}>
            <legend className={ui.legend}>בחרו יעד</legend>
            <div className={ui.field}>
              <label htmlFor={searchId} className={ui.label}>
                חיפוש עיר או מדינה
              </label>
              <input
                id={searchId}
                type="search"
                className={ui.input}
                value={query}
                autoComplete="off"
                placeholder="למשל: ניו יורק, תאילנד"
                onChange={(event) => setQuery(event.target.value)}
              />
              <p className={ui.hint} aria-live="polite">
                {visible.length ? `${visible.length} ערים ברשימה` : 'לא נמצאה עיר, נסו שם אחר'}
              </p>
            </div>
            <div className={ui.field}>
              <label htmlFor={cityId} className={ui.label}>
                עיר
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
            <legend className={ui.legend}>מתי נוח לדבר</legend>
            <fieldset className={ui.group}>
              <legend className={ui.legend}>שעות העבודה בישראל</legend>
              <div className={styles.pair}>
                <HourSelect label="מ-" value={israelStart} options={startOptions} onChange={setIsraelStart} />
                <HourSelect label="עד" value={israelEnd} options={endOptions} onChange={setIsraelEnd} />
              </div>
            </fieldset>
            <fieldset className={ui.group}>
              <legend className={ui.legend}>שעות העבודה ב{city.name}</legend>
              <div className={styles.pair}>
                <HourSelect label="מ-" value={destinationStart} options={startOptions} onChange={setDestinationStart} />
                <HourSelect label="עד" value={destinationEnd} options={endOptions} onChange={setDestinationEnd} />
              </div>
            </fieldset>
            {validWindows ? null : <p className={styles.error}>שעת הסיום חייבת להיות אחרי שעת ההתחלה.</p>}
          </fieldset>
        </form>

        <div className={ui.output}>
          <div className={ui.sticky}>
            <h2 className={ui.outputTitle}>השעה עכשיו</h2>
            <div className={styles.clocks}>
              <Clock title="ישראל" zone={ISRAEL_TIME_ZONE} now={now} />
              <Clock title={city.name} zone={city.zone} now={now} />
            </div>
            <p className={styles.difference} aria-live="polite">
              {current === null ? 'טוען את השעה…' : describeDifference(current)}
              {current !== null && current !== 0 ? (
                <span className={styles.differenceValue} dir="ltr">
                  {formatDifference(current)}
                </span>
              ) : null}
            </p>
            {later !== null && current !== null ? (
              <p className={ui.note}>
                בעוד כחצי שנה ההפרש יהיה{' '}
                <strong dir="ltr" className={styles.inline}>
                  {formatDifference(later)}
                </strong>
                {later === current ? ', ללא שינוי.' : ', בגלל מעבר בין שעון קיץ לשעון חורף.'}
              </p>
            ) : null}

            <h3 className={styles.planTitle}>חפיפה לפגישה</h3>
            <div className={styles.bar} role="img" aria-label={barLabel}>
              {(overlap?.slots ?? Array.from({ length: 48 }, () => false)).map((on, slot) => (
                <span key={slot} className={on ? styles.cellOn : styles.cell} />
              ))}
            </div>
            <div className={styles.barScale} aria-hidden="true" dir="ltr">
              <span>00:00</span>
              <span>12:00</span>
              <span>24:00</span>
            </div>
            <p className={styles.overlap} aria-live="polite">
              {overlap === null
                ? 'בחרו שעות עבודה תקינות.'
                : overlap.ranges.length === 0
                  ? 'אין שעות חפיפה בשעות העבודה שבחרתם. שווה להזיז אחד הצדדים בשעה או שתיים.'
                  : `יש ${overlap.totalHours} שעות חפיפה. בשעון ישראל: ${overlap.ranges
                      .map((range) => `${hoursText(range.israelStart)}–${hoursText(range.israelEnd)}`)
                      .join(', ')}.`}
            </p>
            <p className={ui.note}>הציר מציג יממה בשעון ישראל, והחפיפה מחושבת לפי ההפרש של עכשיו.</p>
          </div>
        </div>
      </div>
    </section>
  )
}
