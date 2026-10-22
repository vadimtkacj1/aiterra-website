'use client'

import { useEffect, useId, useMemo, useRef, useState, type ReactNode } from 'react'
import { Copy } from 'lucide-react'
import {
  DEFAULT_MODE,
  DEFAULT_SETTINGS,
  MAX_DATE,
  MAX_TERM_DAYS,
  MAX_WORK_DAYS,
  MIN_DATE,
  calcModes,
  calculate,
  countError,
  dateError,
  dayFromIso,
  endBeforeStart,
  firstDayOfMonth,
  formatShortDate,
  isoFromDay,
  lastDayOfMonth,
  modeFromHash,
  termOptions,
  todayIso,
  type CalcInputs,
  type CalcMode,
  type CalcOutcome,
  type PaymentBasis,
  type TermChoice,
  type WeekPattern,
  type WorkSettings,
} from '@/lib/work-days'
import ui from './toolUi.module.css'
import styles from './WorkDaysCalculator.module.css'

const ANNOUNCE_DELAY_MS = 900
const OFF_DAYS_SHOWN = 12

const emptyInputs: CalcInputs = {
  start: '',
  end: '',
  includeStart: true,
  includeEnd: true,
  from: '',
  count: '10',
  invoice: '',
  term: '30',
  customTerm: '120',
  basis: 'month-end',
}

const weekOptions: { value: WeekPattern; label: string }[] = [
  { value: 'sun-thu', label: 'ראשון עד חמישי' },
  { value: 'sun-fri', label: 'ראשון עד שישי' },
]

const basisOptions: { value: PaymentBasis; label: string }[] = [
  { value: 'month-end', label: 'מסוף החודש (שוטף +)' },
  { value: 'invoice', label: 'מתאריך החשבונית' },
]

const kindLabel = { rest: 'יום מנוחה', eve: 'ערב חג', 'chol-hamoed': 'חול המועד', 'chol-hamoed-eve': 'חול המועד' }

const spokenFor = (outcome: CalcOutcome) => (outcome.kind === 'result' ? outcome.text : outcome.message)

function ChoiceRow<T extends string>({
  legend,
  name,
  options,
  value,
  onChange,
  wide,
}: {
  legend: string
  name: string
  options: { value: T; label: string }[]
  value: T
  onChange: (value: T) => void
  wide?: boolean
}) {
  return (
    <fieldset className={ui.group}>
      <legend className={ui.legend}>{legend}</legend>
      <div className={wide ? `${styles.choices} ${styles.wide}` : styles.choices}>
        {options.map((option) => (
          <label key={option.value} className={styles.choice}>
            <input
              type="radio"
              name={name}
              value={option.value}
              checked={value === option.value}
              onChange={() => onChange(option.value)}
            />
            <span>{option.label}</span>
          </label>
        ))}
      </div>
    </fieldset>
  )
}

function Field({
  label,
  hint,
  error,
  children,
}: {
  label: string
  hint?: string
  error: string
  children: (props: { id: string; describedBy: string | undefined; invalid: true | undefined }) => ReactNode
}) {
  const id = useId()
  const hintId = `${id}-hint`
  const errorId = `${id}-error`
  const describedBy = [hint ? hintId : '', error ? errorId : ''].filter(Boolean).join(' ') || undefined

  return (
    <div className={ui.field}>
      <label htmlFor={id} className={ui.label}>
        {label}
      </label>
      {hint ? (
        <p id={hintId} className={ui.hint}>
          {hint}
        </p>
      ) : null}
      {children({ id, describedBy, invalid: error ? true : undefined })}
      {error ? (
        <p id={errorId} className={styles.error}>
          {error}
        </p>
      ) : null}
    </div>
  )
}

function DateField({
  label,
  hint,
  value,
  error,
  onChange,
}: {
  label: string
  hint?: string
  value: string
  error: string
  onChange: (value: string) => void
}) {
  return (
    <Field label={label} hint={hint} error={error}>
      {({ id, describedBy, invalid }) => (
        <input
          id={id}
          type="date"
          className={`${ui.input} ${styles.dateInput}`}
          min={MIN_DATE}
          max={MAX_DATE}
          value={value}
          aria-invalid={invalid}
          aria-describedby={describedBy}
          onChange={(event) => onChange(event.target.value)}
        />
      )}
    </Field>
  )
}

function CountField({
  label,
  hint,
  value,
  error,
  onChange,
}: {
  label: string
  hint?: string
  value: string
  error: string
  onChange: (value: string) => void
}) {
  return (
    <Field label={label} hint={hint} error={error}>
      {({ id, describedBy, invalid }) => (
        <input
          id={id}
          className={`${ui.input} ${ui.ltr} ${styles.number}`}
          inputMode="numeric"
          autoComplete="off"
          spellCheck={false}
          enterKeyHint="done"
          maxLength={4}
          value={value}
          aria-invalid={invalid}
          aria-describedby={describedBy}
          onChange={(event) => onChange(event.target.value)}
        />
      )}
    </Field>
  )
}

function Toggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: (value: boolean) => void }) {
  return (
    <label className={ui.option}>
      <input
        type="checkbox"
        className={ui.checkbox}
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
      />
      <span>{label}</span>
    </label>
  )
}

function ResultCard({ outcome }: { outcome: CalcOutcome }) {
  if (outcome.kind !== 'result') {
    return (
      <div className={styles.card}>
        <p className={styles.message}>{outcome.message}</p>
      </div>
    )
  }

  const shown = outcome.offDays.slice(0, OFF_DAYS_SHOWN)
  const hidden = outcome.offDays.length - shown.length

  return (
    <div className={styles.card}>
      <p className={styles.sentence}>
        {outcome.sentence.map((segment, index) =>
          segment.strong ? (
            <strong key={index} className={styles.answer}>
              {segment.text}
            </strong>
          ) : (
            <span key={index}>{segment.text}</span>
          ),
        )}
      </p>
      {outcome.notice ? <p className={styles.insight}>{outcome.notice}</p> : null}
      <dl className={styles.details}>
        {outcome.details.map((detail) => (
          <div key={detail.label} className={styles.detail}>
            <dt>{detail.label}</dt>
            <dd>{detail.value}</dd>
          </div>
        ))}
      </dl>
      {shown.length ? (
        <div className={styles.offDays}>
          <h3 className={styles.offTitle}>ימים שלא נספרו</h3>
          <ul className={styles.offList}>
            {shown.map((special) => (
              <li key={special.day} className={styles.offItem}>
                <span className={styles.offDate}>{formatShortDate(special.day)}</span>
                <span>{special.name}</span>
                <span className={styles.offKind}>{kindLabel[special.kind]}</span>
              </li>
            ))}
          </ul>
          {hidden ? <p className={styles.more}>ועוד {hidden} ימים נוספים בטווח.</p> : null}
        </div>
      ) : null}
    </div>
  )
}

export default function WorkDaysCalculator() {
  const [mode, setMode] = useState<CalcMode>(DEFAULT_MODE)
  const [inputs, setInputs] = useState<CalcInputs>(emptyInputs)
  const [settings, setSettings] = useState<WorkSettings>(DEFAULT_SETTINGS)
  const [status, setStatus] = useState('')
  const [announcement, setAnnouncement] = useState('')
  const sectionRef = useRef<HTMLElement>(null)
  const touched = useRef(false)
  const name = useId()
  const outcome = useMemo(() => calculate(mode, inputs, settings), [mode, inputs, settings])
  const spoken = spokenFor(outcome)
  const spec = calcModes.find((item) => item.id === mode) ?? calcModes[0]

  useEffect(() => {
    const today = todayIso()
    const todayDay = dayFromIso(today)
    setInputs((current) => ({
      ...current,
      start: current.start || isoFromDay(firstDayOfMonth(todayDay)),
      end: current.end || isoFromDay(lastDayOfMonth(todayDay)),
      from: current.from || today,
      invoice: current.invoice || today,
    }))

    const initial = modeFromHash(window.location.hash)
    if (initial) setMode(initial)

    const onHashChange = () => {
      const next = modeFromHash(window.location.hash)
      if (!next) return
      setMode(next)
      setStatus('')
      sectionRef.current?.scrollIntoView({ block: 'start' })
      sectionRef.current?.querySelector<HTMLInputElement>(`input[value="${next}"]`)?.focus({ preventScroll: true })
    }
    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [])

  useEffect(() => {
    if (!touched.current) return
    const timer = window.setTimeout(() => setAnnouncement(spoken), ANNOUNCE_DELAY_MS)
    return () => window.clearTimeout(timer)
  }, [spoken])

  const selectMode = (next: CalcMode) => {
    touched.current = true
    setMode(next)
    setStatus('')
    const hash = calcModes.find((item) => item.id === next)?.hash
    if (hash) window.history.replaceState(null, '', `#${hash}`)
  }

  const update = <K extends keyof CalcInputs>(key: K) => (value: CalcInputs[K]) => {
    touched.current = true
    setStatus('')
    setInputs((current) => ({ ...current, [key]: value }))
  }

  const updateSettings = <K extends keyof WorkSettings>(key: K) => (value: WorkSettings[K]) => {
    touched.current = true
    setStatus('')
    setSettings((current) => ({ ...current, [key]: value }))
  }

  const copy = async () => {
    if (outcome.kind !== 'result') {
      setStatus('השלימו את השדות כדי לקבל תוצאה להעתקה.')
      return
    }
    try {
      await navigator.clipboard.writeText(outcome.text)
      setStatus('התוצאה הועתקה')
      window.gtag?.('event', 'work_days_copy', {
        mode,
        week: settings.week,
        eves: settings.countEves,
        chol_hamoed: settings.countCholHamoed,
      })
    } catch {
      setStatus('ההעתקה נכשלה. סמנו את התוצאה והעתיקו ידנית.')
    }
  }

  const endError = dateError(inputs.end) || (endBeforeStart(inputs) ? 'תאריך הסיום מוקדם מתאריך ההתחלה.' : '')

  return (
    <section ref={sectionRef} className={`${ui.tool} ${styles.calc}`} aria-label="מחשבון ימי עבודה">
      <div className={`${ui.inner} ${styles.layout}`}>
        <form className={ui.form} onSubmit={(event) => event.preventDefault()}>
          <fieldset className={ui.group}>
            <legend className={ui.legend}>מה רוצים לחשב</legend>
            <div className={styles.modes}>
              {calcModes.map((item) => (
                <label key={item.id} className={styles.mode}>
                  <input
                    type="radio"
                    name={name}
                    value={item.id}
                    checked={mode === item.id}
                    onChange={() => selectMode(item.id)}
                  />
                  <span className={styles.modeLabel}>{item.label}</span>
                  <span className={styles.modeHint}>{item.hint}</span>
                </label>
              ))}
            </div>
          </fieldset>

          <fieldset className={ui.group}>
            <legend className={ui.legend}>{spec.question}</legend>

            {mode === 'between' ? (
              <>
                <div className={styles.fields}>
                  <DateField
                    label="תאריך התחלה"
                    value={inputs.start}
                    error={dateError(inputs.start)}
                    onChange={update('start')}
                  />
                  <DateField label="תאריך סיום" value={inputs.end} error={endError} onChange={update('end')} />
                </div>
                <fieldset className={ui.group}>
                  <legend className={ui.legend}>מה נספר</legend>
                  <div className={ui.options}>
                    <Toggle label="יום ההתחלה" checked={inputs.includeStart} onChange={update('includeStart')} />
                    <Toggle label="יום הסיום" checked={inputs.includeEnd} onChange={update('includeEnd')} />
                  </div>
                </fieldset>
              </>
            ) : null}

            {mode === 'deadline' ? (
              <div className={styles.fields}>
                <DateField
                  label="תאריך התחלה"
                  hint="היום הזה לא נספר. סופרים מהיום שאחריו."
                  value={inputs.from}
                  error={dateError(inputs.from)}
                  onChange={update('from')}
                />
                <CountField
                  label="מספר ימי עבודה"
                  hint={`מספר שלם, עד ${MAX_WORK_DAYS.toLocaleString('he-IL')}.`}
                  value={inputs.count}
                  error={countError(inputs.count, 1, MAX_WORK_DAYS)}
                  onChange={update('count')}
                />
              </div>
            ) : null}

            {mode === 'payment' ? (
              <>
                <div className={styles.fields}>
                  <DateField
                    label="תאריך החשבונית"
                    value={inputs.invoice}
                    error={dateError(inputs.invoice)}
                    onChange={update('invoice')}
                  />
                </div>
                <ChoiceRow
                  legend="מאיפה סופרים"
                  name={`${name}-basis`}
                  options={basisOptions}
                  value={inputs.basis}
                  onChange={update('basis')}
                  wide
                />
                <ChoiceRow<TermChoice>
                  legend="כמה ימים מוסיפים"
                  name={`${name}-term`}
                  options={termOptions}
                  value={inputs.term}
                  onChange={update('term')}
                />
                {inputs.term === 'custom' ? (
                  <CountField
                    label="מספר ימים"
                    hint={`מ-0 עד ${MAX_TERM_DAYS}.`}
                    value={inputs.customTerm}
                    error={countError(inputs.customTerm, 0, MAX_TERM_DAYS)}
                    onChange={update('customTerm')}
                  />
                ) : null}
              </>
            ) : null}
          </fieldset>

          <fieldset className={ui.group}>
            <legend className={ui.legend}>איך סופרים ימי עבודה</legend>
            <ChoiceRow
              legend="שבוע העבודה"
              name={`${name}-week`}
              options={weekOptions}
              value={settings.week}
              onChange={updateSettings('week')}
              wide
            />
            <fieldset className={ui.group}>
              <legend className={ui.legend}>נספרים כימי עבודה</legend>
              <div className={ui.options}>
                <Toggle label="ערבי חג" checked={settings.countEves} onChange={updateSettings('countEves')} />
                <Toggle
                  label="חול המועד"
                  checked={settings.countCholHamoed}
                  onChange={updateSettings('countCholHamoed')}
                />
              </div>
            </fieldset>
            <p className={ui.hint}>
              שבת, החגים שבחוק, יום העצמאות ויום הבחירות לכנסת לא נספרים אף פעם.{' '}
              <a href="#how-work-days-count" className={styles.inlineLink}>
                איך סופרים
              </a>
            </p>
          </fieldset>
        </form>

        <div className={ui.output}>
          <div className={ui.sticky}>
            <h2 className={ui.outputTitle}>התוצאה</h2>
            <ResultCard outcome={outcome} />
            {outcome.kind === 'result' && outcome.steps.length ? (
              <ul className={styles.steps}>
                {outcome.steps.map((step) => (
                  <li key={step}>{step}</li>
                ))}
              </ul>
            ) : null}
            <div className={ui.actions}>
              <button type="button" className={`${ui.primary} ${styles.copyMain}`} onClick={copy}>
                <Copy aria-hidden="true" />
                העתקת התוצאה
              </button>
            </div>
            <p className={ui.status} role="status" aria-live="polite">
              {status}
            </p>
            <p className={styles.srOnly} role="status" aria-live="polite">
              {announcement}
            </p>
            <p className={ui.note}>
              החישוב נעשה בדפדפן שלכם. החגים מחושבים לפי הלוח העברי, וימי בחירות נכללים רק אם התאריך שלהם כבר
              נקבע.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
