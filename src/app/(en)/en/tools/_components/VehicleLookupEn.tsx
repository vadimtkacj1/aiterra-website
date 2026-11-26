'use client'

import { useEffect, useId, useRef, useState, type FormEvent, type ReactNode } from 'react'
import { Copy, ExternalLink, RotateCcw, Search } from 'lucide-react'
import {
  REQUEST_TIMEOUT_MS,
  SLOW_AFTER_MS,
  TIMEOUT_REASON,
  VEHICLES_DATASET_URL,
  checkPlate,
  formatPlate,
  searchVehicle,
  type Tone,
  type Vehicle,
  type VehicleFailure,
} from '@/lib/vehicle-lookup'
import { fetchVehicleExtras, type VehicleExtras } from '@/lib/vehicle-extras'
import {
  announcementEn,
  colourEn,
  extrasToTextEn,
  failureTextEn,
  formatDateEn,
  fuelEn,
  kindLabelsEn,
  manufacturerEn,
  numberEn,
  ownershipEn,
  plateErrorEn,
  testStateEn,
  vehicleSourceEn,
  vehicleTitleEn,
  vehicleToTextEn,
  vehicleTypeEn,
  type Localised,
} from '@/lib/vehicle-lookup-en'
import VehicleExtrasEn, { FactsEn, ValueEn, type FactEn } from './VehicleExtrasEn'
import ui from '../../../../(he)/(site)/components/tools/toolUi.module.css'
import styles from '../../../../(he)/(site)/components/tools/CompanyLookup.module.css'
import extra from '../../../../(he)/(site)/components/tools/VehicleLookup.module.css'

type Phase =
  | { kind: 'idle' }
  | { kind: 'loading'; slow: boolean }
  | { kind: 'failed'; failure: VehicleFailure }
  | { kind: 'done'; searched: string; vehicle: Vehicle | null; dataDate: string }

const toneClass: Record<Tone, string> = {
  active: styles.toneActive,
  caution: styles.toneCaution,
  ended: styles.toneEnded,
  unknown: styles.toneUnknown,
}

const SEARCHING = 'Searching the Ministry of Transport databases'

const plain = (text: string): Localised => ({ text, hebrew: false })

function factsOf(vehicle: Vehicle): FactEn[] {
  const type = vehicle.vehicleType ? vehicleTypeEn(vehicle.vehicleType) : plain(kindLabelsEn[vehicle.kind])
  return [
    { label: 'Vehicle type', value: type },
    { label: 'Manufacturer and country', value: manufacturerEn(vehicle.manufacturer) },
    { label: 'Commercial name', value: plain(vehicle.commercialName) },
    { label: 'Model code', value: plain(vehicle.modelCode) },
    { label: 'Trim level', value: plain(vehicle.trim) },
    { label: 'Year of manufacture', value: plain(vehicle.year ? String(vehicle.year) : '') },
    { label: 'Colour', value: colourEn(vehicle.color) },
    { label: 'Fuel', value: fuelEn(vehicle.fuel) },
    { label: 'Engine model', value: plain(vehicle.engineModel) },
    { label: 'Engine capacity', value: plain(vehicle.engineCc ? `${numberEn(vehicle.engineCc)} cc` : '') },
    {
      label: 'Ownership',
      value: ownershipEn(vehicle.ownership),
      note: "The registered ownership type, without the owner's name.",
    },
    { label: 'First on the road', value: plain(vehicle.firstOnRoad ? formatDateEn(vehicle.firstOnRoad) : '') },
    { label: 'Last annual test', value: plain(vehicle.lastTest ? formatDateEn(vehicle.lastTest) : '') },
    {
      label: vehicle.kind === 'inactive' ? 'Licence expired on' : 'Licence valid until (the annual test)',
      value: plain(vehicle.kind === 'removed' || !vehicle.testUntil ? '' : formatDateEn(vehicle.testUntil)),
    },
    { label: 'Taken off the road on', value: plain(vehicle.removedOn ? formatDateEn(vehicle.removedOn) : '') },
    {
      label: 'Air pollution group',
      value: plain(vehicle.pollutionGroup ? String(vehicle.pollutionGroup) : ''),
      note: 'From 1, the cleanest, to 15, the most polluting.',
    },
    { label: 'Front tyre', value: plain(vehicle.frontTire) },
    { label: 'Rear tyre', value: plain(vehicle.rearTire) },
    { label: 'Chassis number (VIN)', value: plain(vehicle.vin), digits: true },
  ]
}

export function VehicleDetailsEn({
  vehicle,
  dataDate,
  now,
  headingLevel = 3,
}: {
  vehicle: Vehicle
  dataDate: string
  now: Date
  headingLevel?: 3 | 4
}) {
  const state = testStateEn(vehicle, now)
  const Heading = headingLevel === 4 ? 'h4' : 'h3'
  return (
    <article className={`${styles.card} ${toneClass[state.tone]}`}>
      <p className={`${styles.badge} ${toneClass[state.tone]}`}>{state.label}</p>
      <Heading className={styles.name}>
        <ValueEn value={vehicleTitleEn(vehicle)} />
      </Heading>
      <div>
        <span className={extra.plate}>{formatPlate(vehicle.plate)}</span>
      </div>
      <p className={styles.statusText}>{state.detail}</p>
      <FactsEn facts={factsOf(vehicle)} />
      <p className={styles.source}>{vehicleSourceEn(vehicle, dataDate)}</p>
    </article>
  )
}

function NotFound({ searched }: { searched: string }) {
  return (
    <div className={styles.message}>
      <p className={styles.messageTitle}>
        No vehicle found with the number <span className={styles.digits}>{formatPlate(searched)}</span>
      </p>
      <ul className={styles.tips}>
        <li>Check the digits again against the vehicle licence or the number plate.</li>
        <li>A vehicle registered in the last few days is not in the file yet. The file is updated once a day.</li>
        <li>Security, police and diplomatic vehicles and heavy work vehicles are not in these files.</li>
        <li>A vehicle that was stolen, or taken off the road before 2000, does not appear.</li>
      </ul>
    </div>
  )
}

export default function VehicleLookupEn() {
  const [value, setValue] = useState('')
  const [fieldError, setFieldError] = useState('')
  const [phase, setPhase] = useState<Phase>({ kind: 'idle' })
  const [announcement, setAnnouncement] = useState('')
  const [copyStatus, setCopyStatus] = useState('')
  const [now, setNow] = useState<Date | null>(null)
  const [extras, setExtras] = useState<VehicleExtras | null>(null)
  const [extrasLoading, setExtrasLoading] = useState(false)
  const controllerRef = useRef<AbortController | null>(null)
  const extrasControllerRef = useRef<AbortController | null>(null)
  const timersRef = useRef<number[]>([])
  const lastPlateRef = useRef('')
  const inputRef = useRef<HTMLInputElement>(null)
  const fieldId = useId()
  const hintId = `${fieldId}-hint`
  const errorId = `${fieldId}-error`

  const clearTimers = () => {
    timersRef.current.forEach((timer) => window.clearTimeout(timer))
    timersRef.current = []
  }

  useEffect(
    () => () => {
      controllerRef.current?.abort('unmount')
      extrasControllerRef.current?.abort('unmount')
      timersRef.current.forEach((timer) => window.clearTimeout(timer))
    },
    [],
  )

  const loadExtras = (found: Vehicle) => {
    const controller = new AbortController()
    extrasControllerRef.current = controller
    setExtrasLoading(true)
    const timer = window.setTimeout(() => controller.abort(TIMEOUT_REASON), REQUEST_TIMEOUT_MS)
    fetchVehicleExtras(found, controller.signal).then((result) => {
      window.clearTimeout(timer)
      if (extrasControllerRef.current !== controller) return
      extrasControllerRef.current = null
      setExtras(result)
      setExtrasLoading(false)
      window.gtag?.('event', 'vehicle_lookup_extras', {
        lang: 'en',
        history: result.history !== null,
        ownership_records: result.ownership?.length ?? 0,
        open_recalls: result.recalls?.length ?? -1,
        model: result.model !== null,
      })
    })
  }

  const run = (plate: string) => {
    controllerRef.current?.abort('superseded')
    extrasControllerRef.current?.abort('superseded')
    extrasControllerRef.current = null
    setExtras(null)
    setExtrasLoading(false)
    clearTimers()
    const controller = new AbortController()
    controllerRef.current = controller
    lastPlateRef.current = plate
    setPhase({ kind: 'loading', slow: false })
    setCopyStatus('')
    setAnnouncement(SEARCHING)
    timersRef.current = [
      window.setTimeout(() => {
        setPhase((current) => (current.kind === 'loading' ? { ...current, slow: true } : current))
      }, SLOW_AFTER_MS),
      window.setTimeout(() => controller.abort(TIMEOUT_REASON), REQUEST_TIMEOUT_MS),
    ]

    searchVehicle(plate, controller.signal).then((result) => {
      if (controllerRef.current !== controller) return
      controllerRef.current = null
      clearTimers()
      if (!result.ok) {
        if (result.failure === 'aborted') return
        const failure = result.failure
        setPhase({ kind: 'failed', failure })
        setAnnouncement(failureTextEn[failure])
        return
      }
      const today = new Date()
      setNow(today)
      setPhase({ kind: 'done', searched: plate, vehicle: result.vehicle, dataDate: result.dataDate })
      if (result.vehicle) loadExtras(result.vehicle)
      setAnnouncement(announcementEn(result.vehicle, result.vehicle ? testStateEn(result.vehicle, today) : null))
      window.gtag?.('event', 'vehicle_lookup_search', {
        lang: 'en',
        found: result.vehicle !== null,
        kind: result.vehicle?.kind ?? 'none',
      })
    })
  }

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const check = checkPlate(value)
    if (check.kind !== 'valid') {
      setFieldError(plateErrorEn(value))
      inputRef.current?.focus()
      return
    }
    setFieldError('')
    run(check.plate)
  }

  const retry = () => {
    if (lastPlateRef.current) run(lastPlateRef.current)
  }

  const vehicle = phase.kind === 'done' ? phase.vehicle : null
  const dataDate = phase.kind === 'done' ? phase.dataDate : ''

  const copy = async () => {
    if (!vehicle || !now) return
    try {
      const lines = [vehicleToTextEn(vehicle, testStateEn(vehicle, now), dataDate)]
      if (extras) lines.push(...extrasToTextEn(extras, vehicle.year))
      await navigator.clipboard.writeText(lines.join('\n'))
      setCopyStatus('Details copied')
    } catch {
      setCopyStatus('Copying failed. Select the details and copy them manually.')
    }
  }

  let body: ReactNode
  if (phase.kind === 'idle') {
    body = (
      <p className={styles.prompt}>
        Enter a licence plate number and press Search. You will see the manufacturer, model, year and annual test
        expiry, and also mileage, open recalls, leasing or rental history and the licence fee.
      </p>
    )
  } else if (phase.kind === 'loading') {
    body = (
      <div className={styles.loading}>
        <span className={styles.spinner} aria-hidden="true" />
        <div>
          <p className={styles.loadingTitle}>{SEARCHING}</p>
          {phase.slow ? (
            <p className={styles.loadingNote}>The government database is answering slowly right now. Waiting up to 15 seconds.</p>
          ) : null}
        </div>
      </div>
    )
  } else if (phase.kind === 'failed') {
    body = (
      <div className={`${styles.message} ${styles.problem}`}>
        <p>{failureTextEn[phase.failure]}</p>
        <button type="button" className={ui.secondary} onClick={retry}>
          <RotateCcw aria-hidden="true" />
          Try again
        </button>
      </div>
    )
  } else if (!phase.vehicle || !now) {
    body = <NotFound searched={phase.searched} />
  } else {
    body = (
      <>
        <VehicleDetailsEn vehicle={phase.vehicle} dataDate={phase.dataDate} now={now} />
        <VehicleExtrasEn extras={extras} loading={extrasLoading} year={phase.vehicle.year} />
        <div className={ui.actions}>
          <button type="button" className={`${ui.primary} ${styles.grow}`} onClick={copy}>
            <Copy aria-hidden="true" />
            Copy the details
          </button>
          <a className={`${ui.secondary} ${styles.linkButton}`} href={VEHICLES_DATASET_URL} target="_blank" rel="noopener">
            <ExternalLink aria-hidden="true" />
            The database on data.gov.il
          </a>
        </div>
        <p className={ui.status} role="status" aria-live="polite">
          {copyStatus}
        </p>
      </>
    )
  }

  return (
    <section className={`${ui.tool} ${styles.lookup}`} aria-label="Israeli vehicle check by licence plate number">
      <div className={`${ui.inner} ${styles.layout}`}>
        <form className={ui.form} onSubmit={onSubmit} noValidate>
          <fieldset className={ui.group}>
            <legend className={ui.legend}>The vehicle</legend>
            <div className={ui.field}>
              <label htmlFor={fieldId} className={ui.label}>
                Licence plate number
              </label>
              <p id={hintId} className={ui.hint}>
                7 or 8 digits, with or without dashes. The number is on the plate and on the vehicle licence.
              </p>
              <div className={styles.searchRow}>
                <input
                  ref={inputRef}
                  id={fieldId}
                  className={`${ui.input} ${ui.ltr} ${styles.digitsInput}`}
                  type="text"
                  inputMode="numeric"
                  autoComplete="off"
                  autoCorrect="off"
                  spellCheck={false}
                  enterKeyHint="search"
                  maxLength={16}
                  data-lpignore="true"
                  data-1p-ignore=""
                  placeholder="12-345-67"
                  value={value}
                  aria-invalid={fieldError ? true : undefined}
                  aria-describedby={fieldError ? `${hintId} ${errorId}` : hintId}
                  onChange={(event) => {
                    setValue(event.target.value)
                    setFieldError('')
                  }}
                />
                <button type="submit" className={`${ui.primary} ${styles.submit}`}>
                  <Search aria-hidden="true" />
                  Search
                </button>
              </div>
              {fieldError ? (
                <div id={errorId} className={styles.error}>
                  <p>{fieldError}</p>
                </div>
              ) : null}
            </div>
          </fieldset>
        </form>

        <div className={ui.output}>
          <div className={`${ui.sticky} ${styles.scrollTarget}`}>
            <h2 className={ui.outputTitle}>Result</h2>
            <div aria-busy={phase.kind === 'loading'}>{body}</div>
            <p className={styles.srOnly} role="status" aria-live="polite">
              {announcement}
            </p>
            <p className={ui.note}>
              The search goes straight from your browser to the Ministry of Transport open databases on data.gov.il. We
              do not store the plate number you searched for, and the databases do not include the owner&apos;s name.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
