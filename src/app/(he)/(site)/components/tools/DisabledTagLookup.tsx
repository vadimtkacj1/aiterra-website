'use client'

import { useEffect, useId, useRef, useState, type FormEvent, type ReactNode } from 'react'
import { ExternalLink, RotateCcw, Search } from 'lucide-react'
import {
  REQUEST_TIMEOUT_MS,
  SLOW_AFTER_MS,
  TIMEOUT_REASON,
  checkPlate,
  failureText,
  formatPlate,
  type Vehicle,
  type VehicleFailure,
} from '@/lib/vehicle-lookup'
import { TAG_DATASET_URL, searchTag, type DisabledTag } from '@/lib/disabled-parking-tag'
import ui from './toolUi.module.css'
import styles from './CompanyLookup.module.css'
import extra from './VehicleLookup.module.css'

type Phase =
  | { kind: 'idle' }
  | { kind: 'loading'; slow: boolean }
  | { kind: 'failed'; failure: VehicleFailure }
  | { kind: 'done'; searched: string; tag: DisabledTag | null; vehicle: Vehicle | null; dataDate: string }

function vehicleName(vehicle: Vehicle | null) {
  if (!vehicle) return ''
  return [vehicle.manufacturer, vehicle.commercialName, vehicle.year, vehicle.color].filter(Boolean).join(', ')
}

function Result({ phase }: { phase: Extract<Phase, { kind: 'done' }> }) {
  const name = vehicleName(phase.vehicle)
  const found = phase.tag !== null
  return (
    <article className={`${styles.card} ${found ? styles.toneActive : styles.toneUnknown}`}>
      <p className={`${styles.badge} ${found ? styles.toneActive : styles.toneUnknown}`}>
        {found ? 'הרכב רשום במאגר תגי הנכה' : 'הרכב לא נמצא במאגר תגי הנכה'}
      </p>
      <p className={extra.plate} dir="ltr">
        {formatPlate(phase.searched)}
      </p>
      {name ? <p className={styles.statusText}>{name}</p> : null}
      {found ? (
        <dl className={styles.facts}>
          {phase.tag?.issuedOn ? (
            <div className={styles.fact}>
              <dt>תאריך הפקת התג</dt>
              <dd>{phase.tag.issuedOn}</dd>
            </div>
          ) : null}
          {phase.tag?.tagType ? (
            <div className={styles.fact}>
              <dt>סוג תו במאגר</dt>
              <dd>
                {phase.tag.tagType}
                <span className={styles.factNote}>משרד התחבורה לא מפרסם מקרא לקוד הזה.</span>
              </dd>
            </div>
          ) : null}
        </dl>
      ) : (
        <ul className={styles.tips}>
          <li>בדקו שוב את הספרות מול לוחית הרישוי.</li>
          <li>תג שהונפק בימים האחרונים עוד לא נכנס לקובץ, שמתעדכן פעם ביום.</li>
          <li>תג נכה של רשות מקומית או תג זמני לא תמיד מופיע במאגר של משרד התחבורה.</li>
        </ul>
      )}
      <p className={styles.source}>
        מקור: מאגר כלי רכב עם תג חניה לנכה של משרד התחבורה ב-data.gov.il
        {phase.dataDate ? `, נתונים מעודכנים ל-${phase.dataDate}` : ''}.
      </p>
    </article>
  )
}

export default function DisabledTagLookup() {
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
    setAnnouncement('מחפש במאגר תגי הנכה')
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
        setAnnouncement(failureText[failure])
        return
      }
      setPhase({ kind: 'done', searched: plate, tag: result.tag, vehicle: result.vehicle, dataDate: result.dataDate })
      setAnnouncement(result.tag ? 'הרכב רשום במאגר תגי הנכה' : 'הרכב לא נמצא במאגר תגי הנכה')
      window.gtag?.('event', 'disabled_tag_search', { found: result.tag !== null })
    })
  }

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const check = checkPlate(value)
    if (check.kind !== 'valid') {
      setFieldError(check.kind === 'empty' ? 'הקלידו את מספר הרכב, 7 או 8 ספרות.' : check.message)
      inputRef.current?.focus()
      return
    }
    setFieldError('')
    run(check.plate)
  }

  let body: ReactNode
  if (phase.kind === 'idle') {
    body = <p className={styles.prompt}>הקלידו מספר רכב ולחצו על בדיקה. נראה אם לרכב יש תג חניה לנכה במאגר משרד התחבורה.</p>
  } else if (phase.kind === 'loading') {
    body = (
      <div className={styles.loading}>
        <span className={styles.spinner} aria-hidden="true" />
        <div>
          <p className={styles.loadingTitle}>מחפש במאגר תגי הנכה</p>
          {phase.slow ? <p className={styles.loadingNote}>המאגר הממשלתי עונה לאט כרגע. ממתינים עד 15 שניות.</p> : null}
        </div>
      </div>
    )
  } else if (phase.kind === 'failed') {
    body = (
      <div className={`${styles.message} ${styles.problem}`}>
        <p>{failureText[phase.failure]}</p>
        <button type="button" className={ui.secondary} onClick={() => lastPlateRef.current && run(lastPlateRef.current)}>
          <RotateCcw aria-hidden="true" />
          ניסיון נוסף
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
            המאגר ב-data.gov.il
          </a>
        </div>
      </>
    )
  }

  return (
    <section className={`${ui.tool} ${styles.lookup}`} aria-label="בדיקת תו נכה לפי מספר רכב">
      <div className={`${ui.inner} ${styles.layout}`}>
        <form className={ui.form} onSubmit={onSubmit} noValidate>
          <fieldset className={ui.group}>
            <legend className={ui.legend}>הרכב</legend>
            <div className={ui.field}>
              <label htmlFor={fieldId} className={ui.label}>
                מספר רכב
              </label>
              <p id={hintId} className={ui.hint}>
                7 או 8 ספרות, עם מקפים או בלי.
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
                  בדיקה
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
            <h2 className={ui.outputTitle}>התוצאה</h2>
            <div aria-busy={phase.kind === 'loading'}>{body}</div>
            <p className={styles.srOnly} role="status" aria-live="polite">
              {announcement}
            </p>
            <p className={ui.note}>
              החיפוש עובר ישירות מהדפדפן שלכם ל-data.gov.il. אנחנו לא שומרים את מספר הרכב, והמאגר לא כולל את שם בעל התג.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
