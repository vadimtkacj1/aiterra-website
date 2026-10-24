'use client'

import { useEffect, useId, useRef, useState, type FormEvent, type ReactNode } from 'react'
import { Copy, ExternalLink, RotateCcw, Search } from 'lucide-react'
import {
  REQUEST_TIMEOUT_MS,
  SLOW_AFTER_MS,
  TIMEOUT_REASON,
  VEHICLES_DATASET_URL,
  announcementFor,
  checkPlate,
  failureText,
  formatIsoDate,
  formatPlate,
  kindLabels,
  searchVehicle,
  testStateOf,
  vehicleToText,
  type Tone,
  type Vehicle,
  type VehicleFailure,
} from '@/lib/vehicle-lookup'
import ui from './toolUi.module.css'
import styles from './CompanyLookup.module.css'
import extra from './VehicleLookup.module.css'

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

export function VehicleDetails({
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
  const state = testStateOf(vehicle, now)
  const Heading = headingLevel === 4 ? 'h4' : 'h3'
  const title = [vehicle.manufacturer, vehicle.commercialName || vehicle.modelCode].filter(Boolean).join(' ')
  const facts: { label: string; value: string; note?: string }[] = [
    { label: 'סוג הרכב', value: vehicle.vehicleType || kindLabels[vehicle.kind] },
    { label: 'יצרן ומדינת ייצור', value: vehicle.manufacturer },
    { label: 'כינוי מסחרי', value: vehicle.commercialName },
    { label: 'קוד דגם', value: vehicle.modelCode },
    { label: 'רמת גימור', value: vehicle.trim },
    { label: 'שנת ייצור', value: vehicle.year ? String(vehicle.year) : '' },
    { label: 'צבע', value: vehicle.color },
    { label: 'סוג דלק', value: vehicle.fuel },
    { label: 'דגם מנוע', value: vehicle.engineModel },
    { label: 'נפח מנוע', value: vehicle.engineCc ? `${vehicle.engineCc.toLocaleString('he-IL')} סמ״ק` : '' },
    { label: 'בעלות', value: vehicle.ownership, note: 'סוג הבעלות הרשום, בלי שם הבעלים.' },
    { label: 'עלייה לכביש', value: vehicle.firstOnRoad ? formatIsoDate(vehicle.firstOnRoad) : '' },
    {
      label: 'טסט אחרון',
      value: vehicle.lastTest ? formatIsoDate(vehicle.lastTest) : '',
    },
    {
      label: vehicle.kind === 'inactive' ? 'תוקף הרישיון שפג' : 'תוקף הרישיון (הטסט)',
      value: vehicle.kind === 'removed' || !vehicle.testUntil ? '' : formatIsoDate(vehicle.testUntil),
    },
    { label: 'ירד מהכביש ב', value: vehicle.removedOn ? formatIsoDate(vehicle.removedOn) : '' },
    {
      label: 'קבוצת זיהום אוויר',
      value: vehicle.pollutionGroup ? String(vehicle.pollutionGroup) : '',
      note: 'מ-1, הנקי ביותר, עד 15, המזהם ביותר.',
    },
    { label: 'צמיג קדמי', value: vehicle.frontTire },
    { label: 'צמיג אחורי', value: vehicle.rearTire },
    { label: 'מספר שלדה', value: vehicle.vin },
  ].filter((fact) => fact.value)

  return (
    <article className={`${styles.card} ${toneClass[state.tone]}`}>
      <p className={`${styles.badge} ${toneClass[state.tone]}`}>{state.label}</p>
      <Heading className={styles.name}>{title || 'רכב'}</Heading>
      <p className={extra.plate} dir="ltr">
        {formatPlate(vehicle.plate)}
      </p>
      <p className={styles.statusText}>{state.detail}</p>
      <dl className={styles.facts}>
        {facts.map((fact) => (
          <div key={fact.label} className={styles.fact}>
            <dt>{fact.label}</dt>
            <dd>
              {fact.label === 'מספר שלדה' ? (
                <span dir="ltr" className={styles.digits}>
                  {fact.value}
                </span>
              ) : (
                fact.value
              )}
              {fact.note ? <span className={styles.factNote}>{fact.note}</span> : null}
            </dd>
          </div>
        ))}
      </dl>
      <p className={styles.source}>
        מקור: {vehicle.sourceLabel} של משרד התחבורה ב-data.gov.il
        {dataDate ? `, נתונים מעודכנים ל-${dataDate}` : ''}.
      </p>
    </article>
  )
}

function NotFound({ searched }: { searched: string }) {
  return (
    <div className={styles.message}>
      <p className={styles.messageTitle}>
        לא נמצא רכב עם המספר{' '}
        <span dir="ltr" className={styles.digits}>
          {formatPlate(searched)}
        </span>
      </p>
      <ul className={styles.tips}>
        <li>בדקו שוב את הספרות מול הרישיון או מול לוחית הרישוי.</li>
        <li>רכב שנרשם בימים האחרונים עדיין לא נכנס לקובץ, שמתעדכן פעם ביום.</li>
        <li>רכב ביטחוני, משטרתי, דיפלומטי או רכב עבודה כבד לא מופיע בקבצים האלה.</li>
        <li>רכב שנגנב או שירד מהכביש לפני שנת 2000 לא מופיע.</li>
      </ul>
    </div>
  )
}

export default function VehicleLookup() {
  const [value, setValue] = useState('')
  const [fieldError, setFieldError] = useState('')
  const [phase, setPhase] = useState<Phase>({ kind: 'idle' })
  const [announcement, setAnnouncement] = useState('')
  const [copyStatus, setCopyStatus] = useState('')
  const [now, setNow] = useState<Date | null>(null)
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
    setCopyStatus('')
    setAnnouncement('מחפש במאגרי משרד התחבורה')
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
        setAnnouncement(failureText[failure])
        return
      }
      const today = new Date()
      setNow(today)
      setPhase({ kind: 'done', searched: plate, vehicle: result.vehicle, dataDate: result.dataDate })
      setAnnouncement(
        announcementFor(result.vehicle, result.vehicle ? testStateOf(result.vehicle, today) : null),
      )
      window.gtag?.('event', 'vehicle_lookup_search', {
        found: result.vehicle !== null,
        kind: result.vehicle?.kind ?? 'none',
      })
    })
  }

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const check = checkPlate(value)
    if (check.kind !== 'valid') {
      setFieldError(check.kind === 'empty' ? 'הקלידו את מספר הרישוי, 7 או 8 ספרות.' : check.message)
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
      await navigator.clipboard.writeText(vehicleToText(vehicle, testStateOf(vehicle, now), dataDate))
      setCopyStatus('הפרטים הועתקו')
    } catch {
      setCopyStatus('ההעתקה נכשלה. סמנו את הפרטים והעתיקו ידנית.')
    }
  }

  let body: ReactNode
  if (phase.kind === 'idle') {
    body = (
      <p className={styles.prompt}>
        הקלידו מספר רישוי ולחצו על חיפוש. נראה את היצרן, הדגם, השנה, הצבע, סוג הדלק ותוקף הטסט של הרכב.
      </p>
    )
  } else if (phase.kind === 'loading') {
    body = (
      <div className={styles.loading}>
        <span className={styles.spinner} aria-hidden="true" />
        <div>
          <p className={styles.loadingTitle}>מחפש במאגרי משרד התחבורה</p>
          {phase.slow ? <p className={styles.loadingNote}>המאגר הממשלתי עונה לאט כרגע. ממתינים עד 15 שניות.</p> : null}
        </div>
      </div>
    )
  } else if (phase.kind === 'failed') {
    body = (
      <div className={`${styles.message} ${styles.problem}`}>
        <p>{failureText[phase.failure]}</p>
        <button type="button" className={ui.secondary} onClick={retry}>
          <RotateCcw aria-hidden="true" />
          ניסיון נוסף
        </button>
      </div>
    )
  } else if (!phase.vehicle || !now) {
    body = <NotFound searched={phase.searched} />
  } else {
    body = (
      <>
        <VehicleDetails vehicle={phase.vehicle} dataDate={phase.dataDate} now={now} />
        <div className={ui.actions}>
          <button type="button" className={`${ui.primary} ${styles.grow}`} onClick={copy}>
            <Copy aria-hidden="true" />
            העתקת הפרטים
          </button>
          <a className={`${ui.secondary} ${styles.linkButton}`} href={VEHICLES_DATASET_URL} target="_blank" rel="noopener">
            <ExternalLink aria-hidden="true" />
            המאגר ב-data.gov.il
          </a>
        </div>
        <p className={ui.status} role="status" aria-live="polite">
          {copyStatus}
        </p>
      </>
    )
  }

  return (
    <section className={`${ui.tool} ${styles.lookup}`} aria-label="בדיקת רכב לפי מספר רישוי">
      <div className={`${ui.inner} ${styles.layout}`}>
        <form className={ui.form} onSubmit={onSubmit} noValidate>
          <fieldset className={ui.group}>
            <legend className={ui.legend}>הרכב</legend>
            <div className={ui.field}>
              <label htmlFor={fieldId} className={ui.label}>
                מספר רישוי
              </label>
              <p id={hintId} className={ui.hint}>
                7 או 8 ספרות, עם מקפים או בלי. מספר הרישוי מופיע בלוחית וברישיון הרכב.
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
                  חיפוש
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
              החיפוש עובר ישירות מהדפדפן שלכם למאגרים הפתוחים של משרד התחבורה ב-data.gov.il. אנחנו לא שומרים את מספר
              הרישוי שחיפשתם, והמאגרים לא כוללים שם בעלים.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
