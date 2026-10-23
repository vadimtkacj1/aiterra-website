'use client'

import { useId, useMemo, useState } from 'react'
import {
  CRUISE_KMH,
  FIXED_MINUTES,
  TLV,
  clockDuration,
  destinationById,
  destinations,
  durationText,
  estimateMinutes,
  greatCircleKm,
  offsetText,
  regionLabels,
  regionOrder,
  type Destination,
  type Region,
} from '@/lib/flight-times'
import ui from './toolUi.module.css'
import styles from './FlightTimes.module.css'

const CUSTOM = 'custom'

const routeOptions = [
  { value: '1', label: 'מסלול ישר' },
  { value: '1.1', label: 'עיקוף קל (פלוס 10%)' },
  { value: '1.2', label: 'עיקוף ארוך (פלוס 20%)' },
]

type SortKey = 'name' | 'time' | 'distance'

const sortLabels: Record<SortKey, string> = {
  name: 'לפי שם',
  time: 'לפי משך טיסה',
  distance: 'לפי מרחק',
}

const timeKey = (item: Destination) => item.directMinutes ?? (item.viaMinutes ?? 0) + 100000

const parseCoordinate = (value: string, limit: number) => {
  if (value.trim() === '') return null
  const parsed = Number(value)
  return Number.isFinite(parsed) && Math.abs(parsed) <= limit ? parsed : null
}

function Calculator() {
  const selectId = useId()
  const routeId = useId()
  const latId = useId()
  const lonId = useId()
  const [selected, setSelected] = useState('bangkok')
  const [route, setRoute] = useState('1')
  const [lat, setLat] = useState('')
  const [lon, setLon] = useState('')

  const listed = selected === CUSTOM ? undefined : destinationById(selected)
  const latitude = parseCoordinate(lat, 90)
  const longitude = parseCoordinate(lon, 180)
  const distance = listed
    ? listed.distanceKm
    : latitude !== null && longitude !== null
      ? greatCircleKm(TLV.lat, TLV.lon, latitude, longitude)
      : null
  const factor = Number(route)
  const minutes = distance === null ? null : estimateMinutes(distance, factor)

  return (
    <section className={ui.tool} aria-label="מחשבון זמן טיסה לפי מרחק">
      <div className={ui.inner}>
        <form className={ui.form} onSubmit={(event) => event.preventDefault()}>
          <fieldset className={ui.group}>
            <legend className={ui.legend}>חישוב לפי מרחק</legend>
            <div className={ui.field}>
              <label htmlFor={selectId} className={ui.label}>
                יעד
              </label>
              <select
                id={selectId}
                className={ui.input}
                value={selected}
                onChange={(event) => setSelected(event.target.value)}
              >
                {destinations.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name}, {item.country}
                  </option>
                ))}
                <option value={CUSTOM}>מקום אחר: הזנת קואורדינטות</option>
              </select>
            </div>
            {selected === CUSTOM ? (
              <div className={styles.pair}>
                <div className={ui.field}>
                  <label htmlFor={latId} className={ui.label}>
                    קו רוחב (מינוס לדרום)
                  </label>
                  <input
                    id={latId}
                    className={`${ui.input} ${ui.ltr}`}
                    inputMode="decimal"
                    value={lat}
                    placeholder="48.85"
                    aria-invalid={lat !== '' && latitude === null ? true : undefined}
                    onChange={(event) => setLat(event.target.value)}
                  />
                </div>
                <div className={ui.field}>
                  <label htmlFor={lonId} className={ui.label}>
                    קו אורך (מינוס למערב)
                  </label>
                  <input
                    id={lonId}
                    className={`${ui.input} ${ui.ltr}`}
                    inputMode="decimal"
                    value={lon}
                    placeholder="2.35"
                    aria-invalid={lon !== '' && longitude === null ? true : undefined}
                    onChange={(event) => setLon(event.target.value)}
                  />
                </div>
              </div>
            ) : null}
            {selected === CUSTOM && ((lat !== '' && latitude === null) || (lon !== '' && longitude === null)) ? (
              <p className={styles.error}>קו רוחב בין 90- ל-90, וקו אורך בין 180- ל-180.</p>
            ) : null}
            <div className={ui.field}>
              <label htmlFor={routeId} className={ui.label}>
                מסלול הטיסה
              </label>
              <select id={routeId} className={ui.input} value={route} onChange={(event) => setRoute(event.target.value)}>
                {routeOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <p className={ui.hint}>טיסות שעוקפות מרחב אווירי סגור ארוכות מהקו הישר.</p>
            </div>
          </fieldset>
        </form>
        <div className={ui.output}>
          <div className={ui.sticky} aria-live="polite">
            <h2 className={ui.outputTitle}>הערכת זמן טיסה מנתב״ג</h2>
            {minutes === null || distance === null ? (
              <p className={styles.headline}>הזינו קואורדינטות תקינות כדי לראות הערכה.</p>
            ) : (
              <>
                <p className={styles.headline}>כ-{durationText(minutes)}</p>
                <dl className={styles.facts}>
                  <div>
                    <dt>מרחק בקו ישר</dt>
                    <dd>{distance.toLocaleString('he-IL')} ק״מ</dd>
                  </div>
                  <div>
                    <dt>החישוב</dt>
                    <dd dir="ltr" className={styles.formula}>
                      {FIXED_MINUTES} + {distance.toLocaleString('en-US')} × {factor} ÷ {CRUISE_KMH} × 60 ={' '}
                      {minutes} min
                    </dd>
                  </div>
                  {listed?.directMinutes ? (
                    <div>
                      <dt>לפי טבלת הטיסות הישירות</dt>
                      <dd>כ-{durationText(listed.directMinutes)}</dd>
                    </div>
                  ) : null}
                </dl>
              </>
            )}
            <p className={ui.note}>
              הנוסחה: זמן = {FIXED_MINUTES} דקות להמראה ולנחיתה, ועוד המרחק בקו ישר (נוסחת הברסין, רדיוס כדור הארץ 6,371
              ק״מ) כפול מקדם המסלול, לחלק למהירות ממוצעת של {CRUISE_KMH} קמ״ש. זו הערכה, לא לוח זמנים.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

function Table() {
  const searchId = useId()
  const regionId = useId()
  const sortId = useId()
  const [query, setQuery] = useState('')
  const [region, setRegion] = useState<Region | 'all'>('all')
  const [directOnly, setDirectOnly] = useState(false)
  const [sort, setSort] = useState<SortKey>('name')

  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase()
    const filtered = destinations.filter((item) => {
      if (region !== 'all' && item.region !== region) return false
      if (directOnly && !item.directMinutes) return false
      if (!needle) return true
      return `${item.name} ${item.country} ${item.iata}`.toLowerCase().includes(needle)
    })
    if (sort === 'time') return [...filtered].sort((a, b) => timeKey(a) - timeKey(b))
    if (sort === 'distance') return [...filtered].sort((a, b) => a.distanceKm - b.distanceKm)
    return [...filtered].sort((a, b) => a.name.localeCompare(b.name, 'he'))
  }, [query, region, directOnly, sort])

  return (
    <section className={ui.tool} aria-labelledby="flight-table-heading">
      <div className={styles.tableCard}>
        <h2 id="flight-table-heading" className={styles.tableHeading}>
          טבלת זמני טיסה מישראל
        </h2>
        <form className={styles.filters} onSubmit={(event) => event.preventDefault()}>
          <div className={ui.field}>
            <label htmlFor={searchId} className={ui.label}>
              חיפוש יעד
            </label>
            <input
              id={searchId}
              type="search"
              className={ui.input}
              value={query}
              autoComplete="off"
              placeholder="למשל: תאילנד, רודוס, BKK"
              onChange={(event) => setQuery(event.target.value)}
            />
          </div>
          <div className={ui.field}>
            <label htmlFor={regionId} className={ui.label}>
              אזור
            </label>
            <select
              id={regionId}
              className={ui.input}
              value={region}
              onChange={(event) => setRegion(event.target.value as Region | 'all')}
            >
              <option value="all">כל היעדים</option>
              {regionOrder.map((key) => (
                <option key={key} value={key}>
                  {regionLabels[key]}
                </option>
              ))}
            </select>
          </div>
          <div className={ui.field}>
            <label htmlFor={sortId} className={ui.label}>
              מיון
            </label>
            <select id={sortId} className={ui.input} value={sort} onChange={(event) => setSort(event.target.value as SortKey)}>
              {(Object.keys(sortLabels) as SortKey[]).map((key) => (
                <option key={key} value={key}>
                  {sortLabels[key]}
                </option>
              ))}
            </select>
          </div>
          <label className={styles.direct}>
            <input type="checkbox" checked={directOnly} onChange={(event) => setDirectOnly(event.target.checked)} />
            <span>רק יעדים עם טיסה ישירה</span>
          </label>
        </form>
        <p className={ui.hint} aria-live="polite">
          מוצגים {visible.length} מתוך {destinations.length} יעדים
        </p>
        <div className={styles.scroll} role="region" aria-label="טבלת זמני הטיסה" tabIndex={0}>
          <table className={styles.table}>
            <caption className={styles.caption}>משך טיסה משוער מנתב״ג, בשעות ודקות</caption>
            <thead>
              <tr>
                <th scope="col">יעד</th>
                <th scope="col">טיסה ישירה</th>
                <th scope="col">עם עצירה</th>
                <th scope="col">מרחק</th>
                <th scope="col">הפרש שעות</th>
              </tr>
            </thead>
            <tbody>
              {visible.map((item) => (
                <tr key={item.id} id={item.id} className={styles.row}>
                  <th scope="row">
                    <a href={`#${item.id}`} className={styles.anchorLink}>
                      {item.name}
                    </a>
                    <span className={styles.country}>
                      {item.country}, {item.iata}
                    </span>
                  </th>
                  <td>
                    {item.directMinutes ? (
                      <>
                        <span className={styles.duration}>כ-{clockDuration(item.directMinutes)}</span>
                        <span className={styles.country}>שעות</span>
                      </>
                    ) : (
                      <span className={styles.none}>אין טיסה ישירה</span>
                    )}
                  </td>
                  <td>
                    {item.viaMinutes ? (
                      <span className={styles.duration}>כ-{clockDuration(item.viaMinutes)}</span>
                    ) : (
                      '—'
                    )}
                  </td>
                  <td className={styles.number}>{item.distanceKm.toLocaleString('he-IL')} ק״מ</td>
                  <td className={styles.number} dir="ltr">
                    {offsetText(item)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {visible.length === 0 ? <p className={styles.empty}>לא נמצא יעד. נסו שם אחר או נקו את הסינון.</p> : null}
      </div>
    </section>
  )
}

export default function FlightTimes() {
  return (
    <>
      <Table />
      <Calculator />
    </>
  )
}
