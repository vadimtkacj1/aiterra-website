'use client'

import { useEffect, useId, useMemo, useRef, useState } from 'react'
import { Copy, Hash } from 'lucide-react'
import {
  DEFAULT_MODE,
  announcementFor,
  evaluate,
  fullNumber,
  modeFromHash,
  modeSpec,
  modes,
  paddingNote,
  resultToText,
  verdictFor,
  type IdMode,
  type IdOutcome,
  type Step,
} from '@/lib/id-number'
import ui from './toolUi.module.css'
import styles from './IdNumberChecker.module.css'

type CopyTarget = 'text' | 'number'

const ANNOUNCE_DELAY_MS = 900

const emptyInputs: Record<IdMode, string> = { validate: '', 'check-digit': '', company: '' }

const verdictTone = (outcome: IdOutcome) => {
  if (outcome.kind === 'computed') return styles.computed
  if (outcome.kind === 'checked') return outcome.valid ? styles.valid : styles.invalid
  return ''
}

function StepsTable({ steps, withCheckDigit }: { steps: Step[]; withCheckDigit: boolean }) {
  const sum = steps.reduce((total, step) => total + step.added, 0)
  const cellClass = (step: Step) => (withCheckDigit && step.position === steps.length ? styles.checkCell : undefined)
  const rows: { label: string; value: (step: Step) => string }[] = [
    { label: 'ספרה', value: (step) => String(step.digit) },
    { label: 'כפול', value: (step) => `×${step.weight}` },
    { label: 'מכפלה', value: (step) => String(step.product) },
    { label: 'לסכום', value: (step) => String(step.added) },
  ]

  return (
    <div className={styles.steps}>
      <table className={styles.table} dir="ltr">
        <caption className={styles.caption} dir="rtl">
          החישוב, ספרה אחרי ספרה
        </caption>
        <thead>
          <tr>
            <th scope="row" dir="rtl" className={styles.rowHead}>
              מיקום
            </th>
            {steps.map((step) => (
              <th key={step.position} scope="col" className={cellClass(step)}>
                {step.position}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.label}>
              <th scope="row" dir="rtl" className={styles.rowHead}>
                {row.label}
              </th>
              {steps.map((step) => (
                <td key={step.position} className={cellClass(step)}>
                  {row.value(step)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <p className={styles.sum}>
        הסכום: <span dir="ltr">{`${steps.map((step) => step.added).join(' + ')} = ${sum}`}</span>
      </p>
      <p className={styles.rule}>
        מכפלה של 10 ומעלה נספרת כסכום הספרות שלה, למשל 16 נספר כ-7.
        {withCheckDigit ? ' המספר תקין כשהסכום מתחלק ב-10.' : ' ספרת הביקורת משלימה את הסכום לכפולה הבאה של 10.'}
      </p>
    </div>
  )
}

function ResultCard({ outcome }: { outcome: IdOutcome }) {
  const verdict = verdictFor(outcome)
  if (outcome.kind === 'prompt' || outcome.kind === 'error' || !verdict) {
    const message = outcome.kind === 'prompt' ? outcome.message : 'כדי לראות את התוצאה, תקנו את המספר שבשדה.'
    return <p className={styles.empty}>{message}</p>
  }

  const number = fullNumber(outcome)
  const padding = paddingNote(outcome)

  return (
    <div className={`${styles.verdict} ${verdictTone(outcome)}`}>
      <p className={styles.headline}>{verdict.headline}</p>
      <p className={styles.number} dir="ltr">
        {number.slice(0, -1)}
        <span className={styles.checkDigit}>{number.slice(-1)}</span>
      </p>
      <p className={styles.reason}>{verdict.reason}</p>
      {padding ? <p className={styles.insight}>{padding}</p> : null}
      {outcome.kind === 'checked' && outcome.entity ? <p className={styles.insight}>{outcome.entity}</p> : null}
    </div>
  )
}

export default function IdNumberChecker() {
  const [mode, setMode] = useState<IdMode>(DEFAULT_MODE)
  const [inputs, setInputs] = useState<Record<IdMode, string>>(emptyInputs)
  const [status, setStatus] = useState('')
  const [announcement, setAnnouncement] = useState('')
  const sectionRef = useRef<HTMLElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const name = useId()
  const fieldId = useId()
  const hintId = `${fieldId}-hint`
  const errorId = `${fieldId}-error`
  const spec = modeSpec(mode)
  const value = inputs[mode]
  const outcome = useMemo(() => evaluate(mode, value), [mode, value])
  const spoken = announcementFor(outcome)
  const lastSpoken = useRef(spoken)
  const error = outcome.kind === 'error' ? outcome : null

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

  const selectMode = (next: IdMode) => {
    setMode(next)
    setStatus('')
    window.history.replaceState(null, '', `#${next}`)
  }

  const setValue = (next: string) => setInputs((current) => ({ ...current, [mode]: next }))

  const checkFullNumber = () => {
    setInputs((current) => ({ ...current, validate: current['check-digit'] }))
    selectMode('validate')
    inputRef.current?.focus()
  }

  const copy = async (target: CopyTarget) => {
    const text = target === 'text' ? resultToText(outcome) : fullNumber(outcome)
    if (!text) {
      setStatus('הקלידו מספר כדי לקבל תוצאה להעתקה.')
      return
    }
    try {
      await navigator.clipboard.writeText(text)
      setStatus(target === 'text' ? 'התוצאה הועתקה' : 'המספר הועתק, עם האפסים שבהתחלה')
      window.gtag?.('event', 'id_check_copy', { mode })
    } catch {
      setStatus('ההעתקה נכשלה. סמנו את התוצאה והעתיקו ידנית.')
    }
  }

  const steps = outcome.kind === 'checked' || outcome.kind === 'computed' ? outcome.steps : null

  return (
    <section ref={sectionRef} className={`${ui.tool} ${styles.checker}`} aria-label="בדיקת תעודת זהות">
      <div className={`${ui.inner} ${styles.layout}`}>
        <form className={ui.form} onSubmit={(event) => event.preventDefault()}>
          <fieldset className={ui.group}>
            <legend className={ui.legend}>מה בודקים</legend>
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
            <legend className={ui.legend}>המספר</legend>
            <div className={ui.field}>
              <label htmlFor={fieldId} className={ui.label}>
                {spec.field}
              </label>
              <p id={hintId} className={ui.hint}>
                {spec.fieldHint}
              </p>
              <input
                ref={inputRef}
                id={fieldId}
                className={`${ui.input} ${ui.ltr} ${styles.digits}`}
                inputMode="numeric"
                autoComplete="off"
                autoCorrect="off"
                spellCheck={false}
                enterKeyHint="done"
                maxLength={24}
                data-lpignore="true"
                data-1p-ignore=""
                value={value}
                aria-invalid={error ? true : undefined}
                aria-describedby={error ? `${hintId} ${errorId}` : hintId}
                onChange={(event) => setValue(event.target.value)}
              />
              {error ? (
                <div id={errorId} className={styles.error}>
                  <p>{error.message}</p>
                  {error.switchToValidate ? (
                    <button type="button" className={styles.inlineAction} onClick={checkFullNumber}>
                      לבדיקת המספר המלא
                    </button>
                  ) : null}
                </div>
              ) : null}
            </div>
          </fieldset>
        </form>

        <div className={ui.output}>
          <div className={ui.sticky}>
            <h2 className={ui.outputTitle}>התוצאה</h2>
            <ResultCard outcome={outcome} />
            {steps ? <StepsTable steps={steps} withCheckDigit={outcome.kind === 'checked'} /> : null}
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
              הבדיקה נעשית בדפדפן שלכם. המספר לא נשלח לשום מקום, לא נשמר ולא נכנס לכתובת הדף.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

export function CodeSnippet({
  code,
  copyLabel,
  copiedMessage,
  mode,
}: {
  code: string
  copyLabel: string
  copiedMessage: string
  mode: string
}) {
  const [status, setStatus] = useState('')

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code)
      setStatus(copiedMessage)
      window.gtag?.('event', 'id_check_copy', { mode })
    } catch {
      setStatus('ההעתקה נכשלה. סמנו את הטקסט והעתיקו ידנית.')
    }
  }

  return (
    <div className={styles.snippet}>
      <pre className={styles.code} dir="ltr">
        <code className={styles.codeText}>{code}</code>
      </pre>
      <div className={styles.snippetActions}>
        <button type="button" className={ui.secondary} onClick={copy}>
          <Copy aria-hidden="true" />
          {copyLabel}
        </button>
        <p className={styles.snippetStatus} role="status" aria-live="polite">
          {status}
        </p>
      </div>
    </div>
  )
}
