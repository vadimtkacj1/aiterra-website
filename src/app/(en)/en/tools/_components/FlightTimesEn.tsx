'use client'

import { useId, useMemo, useState } from 'react'
import {
  CRUISE_KMH,
  FIXED_MINUTES,
  TLV,
  clockDuration,
  estimateMinutes,
  greatCircleKm,
  regionOrder,
  type Destination,
  type Region,
} from '@/lib/flight-times'
import { enDestinations, enDurationText, enOffsetText, enRegionLabels } from './flight-times-en'
import ui from '../../../../(he)/(site)/components/tools/toolUi.module.css'
import styles from '../../../../(he)/(site)/components/tools/FlightTimes.module.css'

const CUSTOM = 'custom'

const routeOptions = [
  { value: '1', label: 'Straight route' },
  { value: '1.1', label: 'Small detour (plus 10%)' },
  { value: '1.2', label: 'Long detour (plus 20%)' },
]

type SortKey = 'name' | 'time' | 'distance'

const sortLabels: Record<SortKey, string> = {
  name: 'By name',
  time: 'By flight time',
  distance: 'By distance',
}

const timeKey = (item: Destination) => item.directMinutes ?? (item.viaMinutes ?? 0) + 100000

const parseCoordinate = (value: string, limit: number) => {
  if (value.trim() === '') return null
  const parsed = Number(value)
  return Number.isFinite(parsed) && Math.abs(parsed) <= limit ? parsed : null
}

const sortedByName = [...enDestinations].sort((a, b) => a.name.localeCompare(b.name, 'en'))

function Calculator() {
  const selectId = useId()
  const routeId = useId()
  const latId = useId()
  const lonId = useId()
  const [selected, setSelected] = useState('bangkok')
  const [route, setRoute] = useState('1')
  const [lat, setLat] = useState('')
  const [lon, setLon] = useState('')

  const listed = selected === CUSTOM ? undefined : enDestinations.find((item) => item.id === selected)
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
    <section className={ui.tool} aria-label="Flight time calculator by distance" dir="ltr">
      <div className={ui.inner}>
        <form className={ui.form} onSubmit={(event) => event.preventDefault()}>
          <fieldset className={ui.group}>
            <legend className={ui.legend}>Estimate by distance</legend>
            <div className={ui.field}>
              <label htmlFor={selectId} className={ui.label}>
                Destination
              </label>
              <select
                id={selectId}
                className={ui.input}
                value={selected}
                onChange={(event) => setSelected(event.target.value)}
              >
                {sortedByName.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name}, {item.country}
                  </option>
                ))}
                <option value={CUSTOM}>Somewhere else: enter coordinates</option>
              </select>
            </div>
            {selected === CUSTOM ? (
              <div className={styles.pair}>
                <div className={ui.field}>
                  <label htmlFor={latId} className={ui.label}>
                    Latitude (minus for south)
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
                    Longitude (minus for west)
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
              <p className={styles.error}>Latitude must be between −90 and 90, longitude between −180 and 180.</p>
            ) : null}
            <div className={ui.field}>
              <label htmlFor={routeId} className={ui.label}>
                Flight route
              </label>
              <select id={routeId} className={ui.input} value={route} onChange={(event) => setRoute(event.target.value)}>
                {routeOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <p className={ui.hint}>Flights that avoid closed airspace are longer than the straight line.</p>
            </div>
          </fieldset>
        </form>
        <div className={ui.output}>
          <div className={ui.sticky} aria-live="polite">
            <h2 className={ui.outputTitle}>Estimated flight time from Ben Gurion</h2>
            {minutes === null || distance === null ? (
              <p className={styles.headline}>Enter valid coordinates to see an estimate.</p>
            ) : (
              <>
                <p className={styles.headline}>About {enDurationText(minutes)}</p>
                <dl className={styles.facts}>
                  <div>
                    <dt>Straight-line distance</dt>
                    <dd>{distance.toLocaleString('en-US')} km</dd>
                  </div>
                  <div>
                    <dt>Calculation</dt>
                    <dd className={styles.formula}>
                      {FIXED_MINUTES} + {distance.toLocaleString('en-US')} × {factor} ÷ {CRUISE_KMH} × 60 ={' '}
                      {minutes} min
                    </dd>
                  </div>
                  {listed?.directMinutes ? (
                    <div>
                      <dt>From the direct flights table</dt>
                      <dd>About {enDurationText(listed.directMinutes)}</dd>
                    </div>
                  ) : null}
                </dl>
              </>
            )}
            <p className={ui.note}>
              Formula: time = {FIXED_MINUTES} minutes for take-off and landing, plus the straight-line distance
              (haversine formula, Earth radius 6,371 km) times the route factor, divided by an average speed of{' '}
              {CRUISE_KMH} km/h. This is an estimate, not a timetable.
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
    const filtered = sortedByName.filter((item) => {
      if (region !== 'all' && item.region !== region) return false
      if (directOnly && !item.directMinutes) return false
      if (!needle) return true
      return `${item.name} ${item.country} ${item.iata}`.toLowerCase().includes(needle)
    })
    if (sort === 'time') return [...filtered].sort((a, b) => timeKey(a) - timeKey(b))
    if (sort === 'distance') return [...filtered].sort((a, b) => a.distanceKm - b.distanceKm)
    return filtered
  }, [query, region, directOnly, sort])

  return (
    <section className={ui.tool} aria-labelledby="flight-table-heading" dir="ltr">
      <div className={styles.tableCard}>
        <h2 id="flight-table-heading" className={styles.tableHeading}>
          Flight times from Israel
        </h2>
        <form className={styles.filters} onSubmit={(event) => event.preventDefault()}>
          <div className={ui.field}>
            <label htmlFor={searchId} className={ui.label}>
              Search a destination
            </label>
            <input
              id={searchId}
              type="search"
              className={ui.input}
              value={query}
              autoComplete="off"
              placeholder="e.g. Thailand, Rhodes, BKK"
              onChange={(event) => setQuery(event.target.value)}
            />
          </div>
          <div className={ui.field}>
            <label htmlFor={regionId} className={ui.label}>
              Region
            </label>
            <select
              id={regionId}
              className={ui.input}
              value={region}
              onChange={(event) => setRegion(event.target.value as Region | 'all')}
            >
              <option value="all">All destinations</option>
              {regionOrder.map((key) => (
                <option key={key} value={key}>
                  {enRegionLabels[key]}
                </option>
              ))}
            </select>
          </div>
          <div className={ui.field}>
            <label htmlFor={sortId} className={ui.label}>
              Sort
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
            <span>Only destinations with a direct flight</span>
          </label>
        </form>
        <p className={ui.hint} aria-live="polite">
          Showing {visible.length} of {enDestinations.length} destinations
        </p>
        <div className={styles.scroll} role="region" aria-label="Flight times table" tabIndex={0}>
          <table className={styles.table}>
            <caption className={styles.caption}>Estimated flight time from Ben Gurion, in hours and minutes</caption>
            <thead>
              <tr>
                <th scope="col">Destination</th>
                <th scope="col">Direct flight</th>
                <th scope="col">With a stop</th>
                <th scope="col">Distance</th>
                <th scope="col">Time difference</th>
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
                        <span className={styles.duration}>~{clockDuration(item.directMinutes)}</span>
                        <span className={styles.country}>hours</span>
                      </>
                    ) : (
                      <span className={styles.none}>No direct flight</span>
                    )}
                  </td>
                  <td>
                    {item.viaMinutes ? (
                      <span className={styles.duration}>~{clockDuration(item.viaMinutes)}</span>
                    ) : (
                      '—'
                    )}
                  </td>
                  <td className={styles.number}>{item.distanceKm.toLocaleString('en-US')} km</td>
                  <td className={styles.number}>{enOffsetText(item)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {visible.length === 0 ? (
          <p className={styles.empty}>No destination found. Try another name or clear the filters.</p>
        ) : null}
      </div>
    </section>
  )
}

export default function FlightTimesEn() {
  return (
    <>
      <Table />
      <Calculator />
    </>
  )
}
