'use client'

import { useEffect, useId, useMemo, useRef, useState } from 'react'
import { Copy, Hash } from 'lucide-react'
import {
  DEFAULT_MODE,
  basisOptions,
  calculate,
  defaultInputs,
  directionOptions,
  fieldError,
  fieldsFor,
  formatNumber,
  modeFromHash,
  modeSpec,
  modes,
  plainNumber,
  resultToText,
  segmentsToText,
  type CalcOutcome,
  type FieldKey,
  type FieldSpec,
  type ModeInput,
  type PercentMode,
} from '@/lib/percentage-calculator'
import ui from './toolUi.module.css'
import styles from './PercentageCalculator.module.css'

type CopyTarget = 'text' | 'number'

const ANNOUNCE_DELAY_MS = 900

const symbols = { money: '₪', percent: '%', number: '' }

const spokenUnit = (field: FieldSpec) => {
  if (field.kind === 'money') return 'בשקלים'
  if (field.kind === 'percent' && !field.label.includes('אחוז')) return 'באחוזים'
  return ''
}

const announcementFor = (outcome: CalcOutcome) => {
  if (outcome.kind === 'result') return segmentsToText(outcome.sentence)
  if (outcome.kind === 'impossible') return outcome.message
  return ''
}

const emptyMessage = {
  incomplete: 'הקלידו מספר בכל שדה כדי לראות את התוצאה.',
  invalid: 'כדי לראות את התוצאה, תקנו את השדה שמתחתיו הודעת שגיאה.',
}

function NumberField({
  field,
  value,
  onChange,
}: {
  field: FieldSpec
  value: string
  onChange: (value: string) => void
}) {
  const id = useId()
  const hintId = `${id}-hint`
  const errorId = `${id}-error`
  const error = fieldError(field, value)
  const symbol = symbols[field.kind]
  const unit = spokenUnit(field)
  const describedBy = [field.hint ? hintId : '', error ? errorId : ''].filter(Boolean).join(' ')

  return (
    <div className={ui.field}>
      <label htmlFor={id} className={ui.label}>
        {field.label}
        {unit ? <span className={styles.srOnly}> {unit}</span> : null}
      </label>
      {field.hint ? (
        <p id={hintId} className={ui.hint}>
          {field.hint}
        </p>
      ) : null}
      <div className={styles.affix}>
        <input
          id={id}
          className={`${ui.input} ${ui.ltr} ${styles.number}${symbol ? ` ${styles.withSymbol}` : ''}`}
          inputMode="decimal"
          autoComplete="off"
          spellCheck={false}
          enterKeyHint="done"
          maxLength={24}
          value={value}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy || undefined}
          onChange={(event) => onChange(event.target.value)}
        />
        {symbol ? (
          <span className={styles.symbol} aria-hidden="true">
            {symbol}
          </span>
        ) : null}
      </div>
      {error ? (
        <p id={errorId} className={styles.error}>
          {error}
        </p>
      ) : null}
    </div>
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

function ResultCard({ outcome }: { outcome: CalcOutcome }) {
  if (outcome.kind !== 'result') {
    const message = outcome.kind === 'impossible' ? outcome.message : emptyMessage[outcome.kind]
    return (
      <div className={styles.card}>
        <p className={styles.message}>{message}</p>
      </div>
    )
  }

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
      {outcome.compare ? (
        <dl className={styles.compare}>
          <div className={styles.compareItem}>
            <dt className={styles.compareLabel}>מרווח רווח</dt>
            <dd className={styles.compareValue}>{outcome.compare.margin}</dd>
            <dd className={styles.compareText}>הרווח מתוך מחיר המכירה</dd>
          </div>
          <div className={styles.compareItem}>
            <dt className={styles.compareLabel}>תוספת על העלות</dt>
            <dd className={styles.compareValue}>{outcome.compare.markup}</dd>
            <dd className={styles.compareText}>הרווח ביחס לעלות</dd>
          </div>
        </dl>
      ) : null}
      {outcome.details.length ? (
        <dl className={styles.details}>
          {outcome.details.map((detail) => (
            <div key={detail.label} className={styles.detail}>
              <dt>{detail.label}</dt>
              <dd>{detail.value}</dd>
            </div>
          ))}
        </dl>
      ) : null}
      {outcome.note ? <p className={styles.insight}>{outcome.note}</p> : null}
    </div>
  )
}

export default function PercentageCalculator() {
  const [mode, setMode] = useState<PercentMode>(DEFAULT_MODE)
  const [inputs, setInputs] = useState<Record<PercentMode, ModeInput>>(defaultInputs)
  const [status, setStatus] = useState('')
  const sectionRef = useRef<HTMLElement>(null)
  const name = useId()
  const input = inputs[mode]
  const spec = modeSpec(mode)
  const fields = fieldsFor(mode, input)
  const outcome = useMemo(() => calculate(mode, input), [mode, input])
  const spoken = announcementFor(outcome)
  const [announcement, setAnnouncement] = useState('')
  const lastSpoken = useRef(spoken)

  useEffect(() => {
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
    if (spoken === lastSpoken.current) return
    const timer = window.setTimeout(() => {
      lastSpoken.current = spoken
      setAnnouncement(spoken)
    }, ANNOUNCE_DELAY_MS)
    return () => window.clearTimeout(timer)
  }, [spoken])

  const selectMode = (next: PercentMode) => {
    setMode(next)
    setStatus('')
    window.history.replaceState(null, '', `#${next}`)
  }

  const update = (patch: Partial<ModeInput>) =>
    setInputs((current) => ({ ...current, [mode]: { ...current[mode], ...patch } }))

  const setValue = (key: FieldKey) => (value: string) =>
    setInputs((current) => ({
      ...current,
      [mode]: { ...current[mode], values: { ...current[mode].values, [key]: value } },
    }))

  const copy = async (target: CopyTarget) => {
    if (outcome.kind !== 'result') {
      setStatus('הקלידו מספרים כדי לקבל תוצאה להעתקה.')
      return
    }
    const value = target === 'text' ? resultToText(outcome) : plainNumber(outcome.answer)
    try {
      await navigator.clipboard.writeText(value)
      setStatus(target === 'text' ? 'התוצאה הועתקה' : `המספר ${formatNumber(outcome.answer)} הועתק`)
      window.gtag?.('event', 'percent_calc_copy', { mode, target })
    } catch {
      setStatus('ההעתקה נכשלה. סמנו את התוצאה והעתיקו ידנית.')
    }
  }

  return (
    <section ref={sectionRef} className={`${ui.tool} ${styles.calc}`} aria-label="מחשבון אחוזים">
      <div className={`${ui.inner} ${styles.layout}`}>
        <form className={ui.form} onSubmit={(event) => event.preventDefault()}>
          <fieldset className={ui.group}>
            <legend className={ui.legend}>מה רוצים לחשב</legend>
            <div className={styles.modes}>
              {modes.map((item) => (
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
            {mode === 'add-subtract' ? (
              <ChoiceRow
                legend="מה עושים"
                name={`${name}-direction`}
                options={directionOptions}
                value={input.direction}
                onChange={(direction) => update({ direction })}
              />
            ) : null}
            {mode === 'margin-markup' ? (
              <ChoiceRow
                legend="לפי מה מחשבים"
                name={`${name}-basis`}
                options={basisOptions}
                value={input.basis}
                onChange={(basis) => update({ basis })}
              />
            ) : null}
            <div className={styles.fields}>
              {fields.map((field) => (
                <NumberField
                  key={`${mode}-${field.key}-${field.kind}-${field.label}`}
                  field={field}
                  value={input.values[field.key]}
                  onChange={setValue(field.key)}
                />
              ))}
            </div>
          </fieldset>
        </form>

        <div className={ui.output}>
          <div className={ui.sticky}>
            <h2 className={ui.outputTitle}>התוצאה</h2>
            <ResultCard outcome={outcome} />
            {outcome.kind === 'result' ? (
              <ul className={styles.formula}>
                {outcome.formula.map((line) => (
                  <li key={line.label}>
                    {line.label}: <span dir="ltr">{line.expression}</span>
                  </li>
                ))}
              </ul>
            ) : null}
            <div className={ui.actions}>
              <button type="button" className={`${ui.primary} ${styles.copyMain}`} onClick={() => copy('text')}>
                <Copy aria-hidden="true" />
                העתקת התוצאה
              </button>
              <button type="button" className={ui.secondary} onClick={() => copy('number')}>
                <Hash aria-hidden="true" />
                העתקת המספר
              </button>
            </div>
            <p className={ui.status} role="status" aria-live="polite">
              {status}
            </p>
            <p className={styles.srOnly} role="status" aria-live="polite">
              {announcement}
            </p>
            <p className={ui.note}>
              החישוב נעשה בדפדפן שלכם, והמספרים לא נשלחים לשום מקום. התוצאות מעוגלות לשתי ספרות אחרי הנקודה.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
