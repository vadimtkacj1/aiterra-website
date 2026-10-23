'use client'

import { useEffect, useId, useMemo, useRef, useState, type ReactNode } from 'react'
import Link from 'next/link'
import { Copy, Link2 } from 'lucide-react'
import {
  MAX_COUNT,
  MAX_ISO,
  MIN_ISO,
  WORK_DAYS_PATH,
  calcModes,
  calculate,
  countError,
  dateError,
  nextHolidays,
  operationOptions,
  readQuery,
  todayDay,
  unitOptions,
  writeQuery,
  type CalcInputs,
  type CalcMode,
  type Outcome,
  type TargetChoice,
} from '@/lib/days-between'
import { formatShortDate } from '@/lib/work-days'
import ui from './toolUi.module.css'
import styles from './DaysBetweenCalculator.module.css'

const ANNOUNCE_DELAY_MS = 900

const emptyInputs: CalcInputs = {
  start: '',
  end: '',
  includeEnd: false,
  base: '',
  count: '30',
  unit: 'days',
  operation: 'add',
  target: 'custom',
  targetDate: '',
}

const spokenFor = (outcome: Outcome) =>
  outcome.kind === 'result' ? `${outcome.headline}, ${outcome.sentence}` : outcome.message

function Field({
  label,
  error,
  children,
}: {
  label: string
  error: string
  children: (props: { id: string; describedBy: string | undefined; invalid: true | undefined }) => ReactNode
}) {
  const id = useId()
  const errorId = `${id}-error`
  return (
    <div className={ui.field}>
      <label htmlFor={id} className={ui.label}>
        {label}
      </label>
      {children({ id, describedBy: error ? errorId : undefined, invalid: error ? true : undefined })}
      {error ? (
        <p id={errorId} className={styles.error}>
          {error}
        </p>
      ) : null}
    </div>
  )
}

function DateField({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <Field label={label} error={dateError(value)}>
      {({ id, describedBy, invalid }) => (
        <input
          id={id}
          type="date"
          className={`${ui.input} ${styles.dateInput}`}
          min={MIN_ISO}
          max={MAX_ISO}
          value={value}
          aria-invalid={invalid}
          aria-describedby={describedBy}
          onChange={(event) => onChange(event.target.value)}
        />
      )}
    </Field>
  )
}

function ChoiceRow<T extends string>({
  legend,
  name,
  options,
  value,
  onChange,
}: {
  legend: string
  name: string
  options: { value: T; label: string }[]
  value: T
  onChange: (value: T) => void
}) {
  return (
    <fieldset className={ui.group}>
      <legend className={ui.legend}>{legend}</legend>
      <div className={styles.choices}>
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

function ResultCard({ outcome }: { outcome: Outcome }) {
  if (outcome.kind !== 'result') {
    return (
      <div className={styles.card}>
        <p className={styles.message}>{outcome.message}</p>
      </div>
    )
  }
  return (
    <div className={styles.card}>
      <p className={styles.sentence}>
        <strong className={styles.answer}>{outcome.headline}</strong>
        <span>{outcome.sentence}</span>
      </p>
      {outcome.notes.map((note) => (
        <p key={note} className={styles.insight}>
          {note}
        </p>
      ))}
      {outcome.details.length || outcome.workDays !== null ? (
        <dl className={styles.details}>
          {outcome.details.map((detail) => (
            <div key={detail.label} className={styles.detail}>
              <dt>{detail.label}</dt>
              <dd>{detail.value}</dd>
            </div>
          ))}
          {outcome.workDays !== null ? (
            <div className={styles.detail}>
              <dt>
                מתוכם ימי עבודה{' '}
                <Link href={WORK_DAYS_PATH} className={styles.inlineLink}>
                  לפירוט
                </Link>
              </dt>
              <dd>{outcome.workDays.toLocaleString('he-IL')}</dd>
            </div>
          ) : null}
        </dl>
      ) : null}
    </div>
  )
}

export default function DaysBetweenCalculator() {
  const [mode, setMode] = useState<CalcMode>('between')
  const [inputs, setInputs] = useState<CalcInputs>(emptyInputs)
  const [today, setToday] = useState<number | null>(null)
  const [status, setStatus] = useState('')
  const [announcement, setAnnouncement] = useState('')
  const touched = useRef(false)
  const name = useId()
  const targetId = useId()

  useEffect(() => {
    const now = todayDay()
    const initial = readQuery(window.location.search, now)
    setToday(now)
    setMode(initial.mode)
    setInputs(initial.inputs)
  }, [])

  const upcoming = useMemo(() => (today === null ? [] : nextHolidays(today)), [today])
  const outcome = useMemo<Outcome>(
    () =>
      today === null ? { kind: 'message', message: 'רגע, מחשבים…' } : calculate(mode, inputs, today),
    [mode, inputs, today],
  )
  const spoken = spokenFor(outcome)

  useEffect(() => {
    if (!touched.current) return
    const timer = window.setTimeout(() => setAnnouncement(spoken), ANNOUNCE_DELAY_MS)
    return () => window.clearTimeout(timer)
  }, [spoken])

  useEffect(() => {
    if (!touched.current) return
    const query = writeQuery(mode, inputs)
    window.history.replaceState(null, '', `${window.location.pathname}${query ? `?${query}` : ''}`)
  }, [mode, inputs])

  const touch = () => {
    touched.current = true
    setStatus('')
  }

  const selectMode = (next: CalcMode) => {
    touch()
    setMode(next)
  }

  const update =
    <K extends keyof CalcInputs>(key: K) =>
    (value: CalcInputs[K]) => {
      touch()
      setInputs((current) => ({ ...current, [key]: value }))
    }

  const copy = async (kind: 'result' | 'link') => {
    if (kind === 'result' && outcome.kind !== 'result') {
      setStatus('השלימו את השדות כדי לקבל תוצאה להעתקה.')
      return
    }
    const query = writeQuery(mode, inputs)
    const text =
      kind === 'link'
        ? `${window.location.origin}${window.location.pathname}?${query}`
        : outcome.kind === 'result'
          ? outcome.text
          : ''
    try {
      await navigator.clipboard.writeText(text)
      setStatus(kind === 'link' ? 'הקישור הועתק. מי שיפתח אותו יראה את אותו חישוב.' : 'התוצאה הועתקה')
      window.gtag?.('event', 'days_between_copy', { mode, kind })
    } catch {
      setStatus('ההעתקה נכשלה. סמנו את הטקסט והעתיקו ידנית.')
    }
  }

  const unitLabel = unitOptions.find((option) => option.value === inputs.unit)?.label ?? ''
  const countProblem = countError(inputs.count)

  return (
    <section className={`${ui.tool} ${styles.calc}`} aria-label="חישוב ימים בין תאריכים">
      <div className={`${ui.inner} ${styles.layout}`}>
        <form className={ui.form} onSubmit={(event) => event.preventDefault()} noValidate>
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
            <legend className={ui.legend}>
              {mode === 'between' ? 'בין אילו תאריכים?' : mode === 'add' ? 'מאיזה תאריך ובכמה?' : 'עד מתי?'}
            </legend>

            {mode === 'between' ? (
              <>
                <div className={styles.fields}>
                  <DateField label="תאריך התחלה" value={inputs.start} onChange={update('start')} />
                  <DateField label="תאריך סיום" value={inputs.end} onChange={update('end')} />
                </div>
                <label className={`${ui.option} ${styles.toggle}`}>
                  <input
                    type="checkbox"
                    className={ui.checkbox}
                    checked={inputs.includeEnd}
                    onChange={(event) => update('includeEnd')(event.target.checked)}
                  />
                  <span>
                    לספור גם את יום הסיום
                    <span className={styles.optionNote}>כמו ב״מ-1 עד 31 בחודש, כולל״. מוסיף יום אחד לתוצאה.</span>
                  </span>
                </label>
              </>
            ) : null}

            {mode === 'add' ? (
              <>
                <div className={styles.fields}>
                  <DateField label="תאריך" value={inputs.base} onChange={update('base')} />
                  <Field label={`כמה ${unitLabel}`} error={countProblem}>
                    {({ id, describedBy, invalid }) => (
                      <input
                        id={id}
                        className={`${ui.input} ${ui.ltr} ${styles.number}`}
                        inputMode="numeric"
                        autoComplete="off"
                        spellCheck={false}
                        enterKeyHint="done"
                        maxLength={6}
                        value={inputs.count}
                        aria-invalid={invalid}
                        aria-describedby={describedBy}
                        onChange={(event) => update('count')(event.target.value)}
                      />
                    )}
                  </Field>
                </div>
                <ChoiceRow
                  legend="יחידה"
                  name={`${name}-unit`}
                  options={unitOptions}
                  value={inputs.unit}
                  onChange={update('unit')}
                />
                <ChoiceRow
                  legend="פעולה"
                  name={`${name}-operation`}
                  options={operationOptions}
                  value={inputs.operation}
                  onChange={update('operation')}
                />
                <p className={ui.hint}>
                  עד {MAX_COUNT.toLocaleString('he-IL')}. ״31 בינואר ועוד חודש״ יוצא היום האחרון של פברואר.
                </p>
              </>
            ) : null}

            {mode === 'countdown' ? (
              <>
                <div className={ui.field}>
                  <label htmlFor={targetId} className={ui.label}>
                    יעד
                  </label>
                  <select
                    id={targetId}
                    className={`${ui.input} ${styles.select}`}
                    value={inputs.target}
                    onChange={(event) => update('target')(event.target.value as TargetChoice)}
                  >
                    {upcoming.map((holiday) => (
                      <option key={holiday.id} value={holiday.id}>
                        {holiday.name} · {formatShortDate(holiday.day)}
                      </option>
                    ))}
                    <option value="custom">תאריך אחר</option>
                  </select>
                </div>
                {inputs.target === 'custom' ? (
                  <div className={styles.fields}>
                    <DateField label="תאריך היעד" value={inputs.targetDate} onChange={update('targetDate')} />
                  </div>
                ) : null}
              </>
            ) : null}
          </fieldset>
        </form>

        <div className={ui.output}>
          <div className={ui.sticky}>
            <h2 className={ui.outputTitle}>התוצאה</h2>
            <ResultCard outcome={outcome} />
            <div className={ui.actions}>
              <button type="button" className={`${ui.primary} ${styles.grow}`} onClick={() => copy('result')}>
                <Copy aria-hidden="true" />
                העתקת התוצאה
              </button>
              <button type="button" className={`${ui.secondary} ${styles.grow}`} onClick={() => copy('link')}>
                <Link2 aria-hidden="true" />
                {mode === 'countdown' ? 'קישור לספירה' : 'קישור לחישוב'}
              </button>
            </div>
            <p className={ui.status} role="status" aria-live="polite">
              {status}
            </p>
            <p className={styles.srOnly} role="status" aria-live="polite">
              {announcement}
            </p>
            <p className={ui.note}>
              החישוב נעשה בדפדפן שלכם. בקישור נשמרים רק התאריכים והמספרים שבחרתם, ומי שפותח קישור לספירה לאחור רואה
              כמה ימים נשארו נכון ליום שבו הוא פותח אותו.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
