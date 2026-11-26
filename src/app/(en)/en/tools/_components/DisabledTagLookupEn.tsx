'use client'

import { useEffect, useId, useRef, useState, type FormEvent, type ReactNode } from 'react'
import { ExternalLink, RotateCcw, Search } from 'lucide-react'
import {
  REQUEST_TIMEOUT_MS,
  SLOW_AFTER_MS,
  TIMEOUT_REASON,
  checkPlate,
  formatPlate,
  type Vehicle,
  type VehicleFailure,
} from '@/lib/vehicle-lookup'
import { TAG_DATASET_URL, searchTag, type DisabledTag } from '@/lib/disabled-parking-tag'
import { colourEn, dottedDateEn, failureTextEn, plateErrorEn, vehicleTitleEn, type Localised } from '@/lib/vehicle-lookup-en'
import { ValueEn } from './VehicleExtrasEn'
import ui from '../../../../(he)/(site)/components/tools/toolUi.module.css'
import styles from '../../../../(he)/(site)/components/tools/CompanyLookup.module.css'
import extra from '../../../../(he)/(site)/components/tools/VehicleLookup.module.css'

type Phase =
  | { kind: 'idle' }
  | { kind: 'loading'; slow: boolean }
  | { kind: 'failed'; failure: VehicleFailure }
  | { kind: 'done'; searched: string; tag: DisabledTag | null; vehicle: Vehicle | null; dataDate: string }

const SEARCHING = 'Searching the disabled parking permit database'
const FOUND = 'The vehicle is in the disabled parking permit database'
const MISSING = 'The vehicle was not found in the disabled parking permit database'

function vehicleParts(vehicle: Vehicle | null): Localised[] {
  if (!vehicle) return []
  const year = vehicle.year ? [{ text: String(vehicle.year), hebrew: false }] : []
  return [vehicleTitleEn(vehicle), ...year, colourEn(vehicle.color)].filter((part) => part.text)
}

function Result({ phase }: { phase: Extract<Phase, { kind: 'done' }> }) {
  const parts = vehicleParts(phase.vehicle)
  const found = phase.tag !== null
  return (
    <article className={`${styles.card} ${found ? styles.toneActive : styles.toneUnknown}`}>
      <p className={`${styles.badge} ${found ? styles.toneActive : styles.toneUnknown}`}>{found ? FOUND : MISSING}</p>
      <p className={extra.plate}>{formatPlate(phase.searched)}</p>
      {parts.length ? (
        <p className={styles.statusText}>
          {parts.map((part, index) => (
            <span key={`${part.text}-${index}`}>
              {index ? ', ' : ''}
              <ValueEn value={part} />
            </span>
          ))}
        </p>
      ) : null}
      {found ? (
        <dl className={styles.facts}>
          {phase.tag?.issuedOn ? (
            <div className={styles.fact}>
              <dt>Permit issued on</dt>
              <dd>{dottedDateEn(phase.tag.issuedOn)}</dd>
            </div>
          ) : null}
          {phase.tag?.tagType ? (
            <div className={styles.fact}>
              <dt>Permit type code</dt>
              <dd>
                {phase.tag.tagType}
                <span className={styles.factNote}>The Ministry of Transport does not publish a key for this code.</span>
              </dd>
            </div>
          ) : null}
        </dl>
      ) : (
        <ul className={styles.tips}>
          <li>Check the digits again against the number plate.</li>
          <li>A permit issued in the last few days is not in the file yet. The file is updated once a day.</li>
          <li>A permit from a local authority, or a temporary permit, is not always in the Ministry of Transport database.</li>
        </ul>
      )}
      <p className={styles.source}>
        Source: Ministry of Transport database of vehicles with a disabled parking permit on data.gov.il
        {phase.dataDate ? `, data updated ${phase.dataDate}` : ''}.
      </p>
    </article>
  )
}

export default function DisabledTagLookupEn() {
  const [value, setValue] = useState('')
  const [fieldError, setFieldError] = useState('')
  const [phase, setPhase] = useState<Phase>({ kind: 'idle' })
  const [announcement, setAnnouncement] = useState('')
  const controllerRef = useRef<AbortController | null>(null)
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
      timersRef.current.forEach((timer) => window.clearTimeout(timer))
    },
    [],
  )

  const run = (plate: string) => {
    controllerRef.current?.abort('superseded')
    clearTimers()
    const controller = new AbortController()
    controllerRef.current = controller
    lastPlateRef.current = plate
    setPhase({ kind: 'loading', slow: false })
    setAnnouncement(SEARCHING)
    timersRef.current = [
      window.setTimeout(() => {
        setPhase((current) => (current.kind === 'loading' ? { ...current, slow: true } : current))
      }, SLOW_AFTER_MS),
      window.setTimeout(() => controller.abort(TIMEOUT_REASON), REQUEST_TIMEOUT_MS),
    ]

    searchTag(plate, controller.signal).then((result) => {
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
      setPhase({ kind: 'done', searched: plate, tag: result.tag, vehicle: result.vehicle, dataDate: result.dataDate })
      setAnnouncement(result.tag ? FOUND : MISSING)
      window.gtag?.('event', 'disabled_tag_search', { lang: 'en', found: result.tag !== null })
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

  let body: ReactNode
  if (phase.kind === 'idle') {
    body = (
      <p className={styles.prompt}>
        Enter a vehicle number and press Check. You will see whether the vehicle has a disabled parking permit in the
        Ministry of Transport database.
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
        <button type="button" className={ui.secondary} onClick={() => lastPlateRef.current && run(lastPlateRef.current)}>
          <RotateCcw aria-hidden="true" />
          Try again
        </button>
      </div>
    )
  } else {
    body = (
      <>
        <Result phase={phase} />
        <div className={ui.actions}>
          <a className={`${ui.secondary} ${styles.linkButton}`} href={TAG_DATASET_URL} target="_blank" rel="noopener">
            <ExternalLink aria-hidden="true" />
            The database on data.gov.il
          </a>
        </div>
      </>
    )
  }

  return (
    <section className={`${ui.tool} ${styles.lookup}`} aria-label="Israeli disabled parking permit check by vehicle number">
      <div className={`${ui.inner} ${styles.layout}`}>
        <form className={ui.form} onSubmit={onSubmit} noValidate>
          <fieldset className={ui.group}>
            <legend className={ui.legend}>The vehicle</legend>
            <div className={ui.field}>
              <label htmlFor={fieldId} className={ui.label}>
                Vehicle number
              </label>
              <p id={hintId} className={ui.hint}>
                7 or 8 digits, with or without dashes.
              </p>
              <div className={styles.searchRow}>
                <input
                  ref={inputRef}
                  id={fieldId}
                  className={`${ui.input} ${ui.ltr} ${styles.digitsInput}`}
                  type="text"
                  inputMode="numeric"
                  autoComplete="off"
                  spellCheck={false}
                  enterKeyHint="search"
                  maxLength={16}
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
                  Check
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
              The search goes straight from your browser to data.gov.il. We do not store the vehicle number, and the
              database does not include the permit holder&apos;s name.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
