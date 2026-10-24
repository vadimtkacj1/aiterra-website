'use client'

import { useEffect, useId, useMemo, useRef, useState } from 'react'
import { Copy } from 'lucide-react'
import {
  EXEMPTION_CEILING_PER_YEAR,
  EXEMPTION_CEILING_YEAR,
  calculateSeverance,
  defaultInput,
  fieldErrors,
  formatYears,
  resultToText,
  shekel,
  tenureText,
  type Section14,
  type SeveranceInput,
  type SeveranceOutcome,
} from '@/lib/severance-pay'
import { formatDate } from '@/lib/work-days'
import ui from './toolUi.module.css'
import styles from './SeverancePayCalculator.module.css'

const ANNOUNCE_DELAY_MS = 900

const section14Options: { value: Section14; label: string; hint: string }[] = [
  { value: 'none', label: 'אין הסדר סעיף 14', hint: 'המעסיק משלם את הפיצויים בסוף' },
  { value: 'full', label: 'יש סעיף 14 מההתחלה', hint: 'הפקדות לפנסיה במקום פיצויים' },
]

function TextField({
  label,
  hint,
  value,
  error,
  type = 'text',
  onChange,
}: {
  label: string
  hint?: string
  value: string
  error?: string
  type?: 'text' | 'date'
  onChange: (value: string) => void
}) {
  const id = useId()
  const hintId = `${id}-hint`
  const errorId = `${id}-error`
  const describedBy = [hint ? hintId : '', error ? errorId : ''].filter(Boolean).join(' ')

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
      <input
        id={id}
        type={type}
        className={`${ui.input} ${type === 'date' ? `${ui.date} ${styles.date}` : `${ui.ltr} ${styles.number}`}`}
        inputMode={type === 'text' ? 'decimal' : undefined}
        autoComplete="off"
        spellCheck={false}
        enterKeyHint="done"
        maxLength={type === 'text' ? 12 : undefined}
        min={type === 'date' ? '1950-01-01' : undefined}
        max={type === 'date' ? '2099-12-31' : undefined}
        value={value}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy || undefined}
        onChange={(event) => onChange(event.target.value)}
      />
      {error ? (
        <p id={errorId} className={styles.error}>
          {error}
        </p>
      ) : null}
    </div>
  )
}

const announcementFor = (outcome: SeveranceOutcome) => {
  if (outcome.kind !== 'result') return ''
  if (!outcome.eligibleBySeniority) return 'ותק של פחות משנה: אין זכאות לפיצויי פיטורים לפי החוק.'
  return `פיצויי פיטורים: ${shekel(outcome.severance)}, על ותק של ${tenureText(outcome.tenure)}.`
}

function ResultCard({ outcome }: { outcome: SeveranceOutcome }) {
  if (outcome.kind !== 'result') {
    return (
      <div className={styles.card}>
        <p className={styles.message}>{outcome.message}</p>
      </div>
    )
  }

  return (
    <div className={styles.card}>
      <p className={styles.kicker}>
        ותק: {tenureText(outcome.tenure)} ({formatYears(outcome.tenure.years)} שנים)
      </p>
      {outcome.eligibleBySeniority ? (
        <>
          <p className={styles.answer}>{shekel(outcome.severance)}</p>
          <p className={styles.basis}>
            {formatDate(outcome.startDay)} עד {formatDate(outcome.endDay)}, שכר אחרון {shekel(outcome.salary)}
          </p>
          <dl className={styles.facts}>
            <div className={styles.fact}>
              <dt>הנוסחה</dt>
              <dd dir="ltr">
                {shekel(outcome.salary)} × {formatYears(outcome.tenure.years)}
              </dd>
            </div>
            {outcome.exempt !== null && outcome.taxable !== null ? (
              <div className={styles.fact}>
                <dt>פטור ממס עד</dt>
                <dd>{shekel(outcome.exempt)}</dd>
              </div>
            ) : null}
          </dl>
          {outcome.exempt !== null && outcome.taxable !== null ? (
            <p className={styles.insight}>
              תקרת הפטור ב-{EXEMPTION_CEILING_YEAR} היא {shekel(EXEMPTION_CEILING_PER_YEAR)} לכל שנת עבודה.{' '}
              {outcome.taxable > 0
                ? `החלק שמעבר לתקרה, ${shekel(outcome.taxable)}, חייב במס.`
                : 'הפיצויים שחושבו נמצאים כולם מתחת לתקרה.'}
            </p>
          ) : (
            <p className={styles.insight}>
              תקרת הפטור שבדקנו היא של שנת {EXEMPTION_CEILING_YEAR}. לתאריך סיום בשנה אחרת, בדקו את התקרה של אותה שנה
              באתר רשות המסים.
            </p>
          )}
          {outcome.section14 === 'full' ? (
            <p className={styles.insight}>
              בהסדר סעיף 14 מלא, ההפקדות שהמעסיק הפריש במהלך העבודה באות במקום תשלום פיצויים בסוף. הסכום למעלה הוא
              ההשוואה לפיצויים לפי החוק: אם ההפקדות היו על כל השכר ומתחילת העבודה, אין תשלום נוסף על הפיצויים.
            </p>
          ) : null}
        </>
      ) : (
        <p className={styles.message}>
          לפי החוק, פיצויי פיטורים מגיעים בדרך כלל לעובד שעבד לפחות שנה אצל אותו מעסיק. הסכם, חוזה אישי או נוהג במקום
          העבודה יכולים לתת זכאות גם לפני כן.
        </p>
      )}
    </div>
  )
}

export default function SeverancePayCalculator() {
  const [input, setInput] = useState<SeveranceInput>(defaultInput)
  const [status, setStatus] = useState('')
  const [announcement, setAnnouncement] = useState('')
  const errors = fieldErrors(input)
  const outcome = useMemo(() => calculateSeverance(input), [input])
  const spoken = announcementFor(outcome)
  const lastSpoken = useRef(spoken)
  const id = useId()

  useEffect(() => {
    if (spoken === lastSpoken.current) return
    const timer = window.setTimeout(() => {
      lastSpoken.current = spoken
      setAnnouncement(spoken)
    }, ANNOUNCE_DELAY_MS)
    return () => window.clearTimeout(timer)
  }, [spoken])

  const update = (patch: Partial<SeveranceInput>) => {
    setInput((current) => ({ ...current, ...patch }))
    setStatus('')
  }

  const copy = async () => {
    if (outcome.kind !== 'result') {
      setStatus('מלאו את הפרטים כדי להעתיק את התוצאה.')
      return
    }
    try {
      await navigator.clipboard.writeText(resultToText(outcome))
      setStatus('התוצאה הועתקה')
      window.gtag?.('event', 'severance_pay_copy', { eligible: outcome.eligibleBySeniority })
    } catch {
      setStatus('ההעתקה נכשלה. סמנו את התוצאה והעתיקו ידנית.')
    }
  }

  return (
    <section className={`${ui.tool} ${styles.calc}`} aria-label="מחשבון פיצויי פיטורים">
      <div className={`${ui.inner} ${styles.layout}`}>
        <form className={ui.form} onSubmit={(event) => event.preventDefault()}>
          <fieldset className={ui.group}>
            <legend className={ui.legend}>תקופת העבודה</legend>
            <div className={styles.row}>
              <TextField
                label="תאריך תחילת העבודה"
                type="date"
                value={input.start}
                error={errors.start}
                onChange={(start) => update({ start })}
              />
              <TextField
                label="תאריך סיום העבודה"
                type="date"
                value={input.end}
                error={errors.end}
                onChange={(end) => update({ end })}
              />
            </div>
          </fieldset>

          <fieldset className={ui.group}>
            <legend className={ui.legend}>השכר</legend>
            <TextField
              label="שכר חודשי אחרון, ברוטו"
              hint="כולל תוספות קבועות. בשכר משתנה אפשר להקליד ממוצע חודשי."
              value={input.salary}
              error={errors.salary}
              onChange={(salary) => update({ salary })}
            />
          </fieldset>

          <fieldset className={ui.group}>
            <legend className={ui.legend}>הפקדות לפנסיה</legend>
            <div className={styles.choices}>
              {section14Options.map((option) => (
                <label key={option.value} className={styles.choice}>
                  <input
                    type="radio"
                    name={`${id}-section14`}
                    value={option.value}
                    className={ui.checkbox}
                    checked={input.section14 === option.value}
                    onChange={() => update({ section14: option.value })}
                  />
                  <span className={styles.choiceText}>
                    <span className={styles.choiceLabel}>{option.label}</span>
                    <span className={styles.choiceHint}>{option.hint}</span>
                  </span>
                </label>
              ))}
            </div>
          </fieldset>
        </form>

        <div className={ui.output}>
          <div className={ui.sticky}>
            <h2 className={ui.outputTitle}>התוצאה</h2>
            <ResultCard outcome={outcome} />
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
              חישוב עזר לפי חוק פיצויי פיטורים, התשכ״ג-1963: משכורת חודש אחרונה על כל שנת עבודה, וחלק יחסי לשנה
              חלקית. הסכם קיבוצי או חוזה אישי יכולים לתת יותר. החישוב נעשה בדפדפן, והפרטים לא נשלחים לשום מקום.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
