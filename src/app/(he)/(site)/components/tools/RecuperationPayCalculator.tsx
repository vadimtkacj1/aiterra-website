'use client'

import { useEffect, useId, useMemo, useRef, useState } from 'react'
import { Copy } from 'lucide-react'
import {
  DAY_RATE_TEXT,
  RECUPERATION_YEAR,
  amountExpression,
  calculateRecuperation,
  daysExpression,
  daysLabel,
  emptyRecuperationInput,
  formatShekels,
  recuperationErrors,
  resultToText,
  sectorOptions,
  yearLabel,
  yearOptions,
  type RecuperationInput,
  type RecuperationOutcome,
} from '@/lib/recuperation-pay'
import ui from './toolUi.module.css'
import styles from './RecuperationPayCalculator.module.css'

const ANNOUNCE_DELAY_MS = 900

const rateHint = `${DAY_RATE_TEXT} ₪ לשנת ההבראה ${RECUPERATION_YEAR}, לפי צו ההרחבה. משנים רק אם בחוזה נקבע סכום גבוה יותר.`

const announcementFor = (outcome: RecuperationOutcome) => {
  if (outcome.kind === 'result') return `דמי הבראה: ${formatShekels(outcome.amount)}, ${daysLabel(outcome.days)}.`
  if (outcome.kind === 'not-eligible' || outcome.kind === 'other-sector') return outcome.message
  return ''
}

function NumberField({
  id,
  label,
  hint,
  error,
  value,
  onChange,
}: {
  id: string
  label: string
  hint?: string
  error?: string
  value: string
  onChange: (value: string) => void
}) {
  const hintId = `${id}-hint`
  const errorId = `${id}-error`
  const described = [hint ? hintId : '', error ? errorId : ''].filter(Boolean).join(' ')
  return (
    <div className={ui.field}>
      <label htmlFor={id} className={ui.label}>
        {label}
      </label>
      <input
        id={id}
        className={`${ui.input} ${ui.ltr} ${styles.number}`}
        inputMode="decimal"
        autoComplete="off"
        spellCheck={false}
        enterKeyHint="done"
        value={value}
        aria-invalid={error ? true : undefined}
        aria-describedby={described || undefined}
        onChange={(event) => onChange(event.target.value.replace(/\s/g, ''))}
      />
      {hint ? (
        <p id={hintId} className={ui.hint}>
          {hint}
        </p>
      ) : null}
      {error ? (
        <p id={errorId} className={styles.error}>
          {error}
        </p>
      ) : null}
    </div>
  )
}

function ResultCard({ outcome }: { outcome: RecuperationOutcome }) {
  if (outcome.kind !== 'result') {
    return (
      <div className={styles.card}>
        <p className={styles.message}>{outcome.message}</p>
      </div>
    )
  }
  return (
    <div className={styles.card}>
      <p className={styles.kicker}>דמי הבראה בעד {yearLabel(outcome.year)}</p>
      <p className={styles.answer}>{formatShekels(outcome.amount)}</p>
      <dl className={styles.lines}>
        <div className={styles.line}>
          <dt>ימי הבראה</dt>
          <dd dir="ltr">{daysExpression(outcome)}</dd>
        </div>
        <div className={styles.line}>
          <dt>סכום</dt>
          <dd dir="ltr">{amountExpression(outcome)}</dd>
        </div>
      </dl>
      {outcome.year === 1 ? (
        <p className={styles.insight}>הזכאות על השנה הראשונה נוצרת רק כשהיא מסתיימת.</p>
      ) : null}
      {outcome.topUp !== null ? (
        <p className={styles.insight}>
          הצו חל רטרואקטיבית. אם דמי ההבראה בעד שנת {RECUPERATION_YEAR} כבר שולמו לפי 418 ₪ ליום, ההשלמה היא{' '}
          <strong>{formatShekels(outcome.topUp)}</strong>.
        </p>
      ) : null}
      <p className={styles.insight}>
        משלמים באחד מחודשי הקיץ, מיוני עד ספטמבר, אלא אם הוסכם או נהוג מועד אחר. אפשר גם לשלם בחלקים עם השכר החודשי, אם
        כך נקבע בהסכם העבודה.
      </p>
    </div>
  )
}

export default function RecuperationPayCalculator() {
  const [input, setInput] = useState<RecuperationInput>(emptyRecuperationInput)
  const [status, setStatus] = useState('')
  const [announcement, setAnnouncement] = useState('')
  const id = useId()
  const errors = recuperationErrors(input)
  const outcome = useMemo(() => calculateRecuperation(input), [input])
  const spoken = announcementFor(outcome)
  const lastSpoken = useRef(spoken)
  const yearId = `${id}-year`
  const yearHintId = `${id}-year-hint`

  useEffect(() => {
    if (spoken === lastSpoken.current) return
    const timer = window.setTimeout(() => {
      lastSpoken.current = spoken
      setAnnouncement(spoken)
    }, ANNOUNCE_DELAY_MS)
    return () => window.clearTimeout(timer)
  }, [spoken])

  const update = (patch: Partial<RecuperationInput>) => {
    setInput((current) => ({ ...current, ...patch }))
    setStatus('')
  }

  const copy = async () => {
    if (outcome.kind !== 'result') {
      setStatus('מלאו את הפרטים כדי לקבל תוצאה להעתקה.')
      return
    }
    try {
      await navigator.clipboard.writeText(resultToText(outcome))
      setStatus('הסיכום הועתק')
      window.gtag?.('event', 'recuperation_pay_calc', {
        seniority_year: outcome.year,
        part_time: outcome.percent < 10_000,
        partial_year: outcome.months < 12,
        default_rate: outcome.topUp !== null,
      })
    } catch {
      setStatus('ההעתקה נכשלה. סמנו את התוצאה והעתיקו ידנית.')
    }
  }

  return (
    <section className={`${ui.tool} ${styles.calc}`} aria-label="מחשבון דמי הבראה">
      <div className={`${ui.inner} ${styles.layout}`}>
        <form className={ui.form} onSubmit={(event) => event.preventDefault()}>
          <fieldset className={ui.group}>
            <legend className={ui.legend}>איפה עובדים</legend>
            <div className={styles.choices}>
              {sectorOptions.map((option) => (
                <label key={option.value} className={styles.choice}>
                  <input
                    type="radio"
                    name={`${id}-sector`}
                    value={option.value}
                    checked={input.sector === option.value}
                    onChange={() => update({ sector: option.value })}
                  />
                  <span>
                    {option.label}
                    <span className={styles.choiceHint}>{option.hint}</span>
                  </span>
                </label>
              ))}
            </div>
          </fieldset>

          {input.sector === 'private' ? (
            <>
              <fieldset className={ui.group}>
                <legend className={ui.legend}>ותק והיקף משרה</legend>
                <div className={ui.field}>
                  <label htmlFor={yearId} className={ui.label}>
                    שנת העבודה שבעדה מחשבים
                  </label>
                  <select
                    id={yearId}
                    className={`${ui.input} ${styles.select}`}
                    value={input.year}
                    aria-describedby={yearHintId}
                    onChange={(event) => update({ year: event.target.value })}
                  >
                    <option value="">בחרו</option>
                    {yearOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <p id={yearHintId} className={ui.hint}>
                    הוותק אצל אותו מעסיק. חופשת לידה נספרת, חופשה ללא תשלום לא.
                  </p>
                </div>
                <div className={styles.pair}>
                  <NumberField
                    id={`${id}-months`}
                    label="חודשי עבודה באותה שנה"
                    hint="פחות מ-12 אם הייתה חופשה ללא תשלום או שהעבודה הסתיימה."
                    value={input.months}
                    error={errors.months}
                    onChange={(months) => update({ months })}
                  />
                  <NumberField
                    id={`${id}-percent`}
                    label="היקף משרה (%)"
                    value={input.percent}
                    error={errors.percent}
                    onChange={(percent) => update({ percent })}
                  />
                </div>
              </fieldset>
              <fieldset className={ui.group}>
                <legend className={ui.legend}>מחיר יום הבראה</legend>
                <NumberField
                  id={`${id}-rate`}
                  label="סכום ליום (₪)"
                  hint={rateHint}
                  value={input.rate}
                  error={errors.rate}
                  onChange={(rate) => update({ rate })}
                />
              </fieldset>
            </>
          ) : null}
        </form>

        <div className={ui.output}>
          <div className={ui.sticky}>
            <h2 className={ui.outputTitle}>התוצאה</h2>
            <ResultCard outcome={outcome} />
            <div className={ui.actions}>
              <button type="button" className={`${ui.primary} ${styles.copyMain}`} onClick={copy}>
                <Copy aria-hidden="true" />
                העתקת הסיכום
              </button>
            </div>
            <p className={ui.status} role="status" aria-live="polite">
              {status}
            </p>
            <p className={styles.srOnly} role="status" aria-live="polite">
              {announcement}
            </p>
            <p className={ui.note}>
              לפי צו ההרחבה הכללי, שחל על רוב העובדים במגזר הפרטי. הסכם קיבוצי, צו הרחבה ענפי או חוזה אישי יכולים לתת
              יותר. החישוב נעשה בדפדפן, והפרטים לא נשלחים לשום מקום.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
