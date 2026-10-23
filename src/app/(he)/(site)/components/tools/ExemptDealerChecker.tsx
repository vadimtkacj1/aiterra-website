'use client'

import { useEffect, useId, useMemo, useRef, useState } from 'react'
import { Copy } from 'lucide-react'
import {
  THRESHOLD,
  THRESHOLD_YEAR,
  calculateExemptDealer,
  emptyExemptDealerInput,
  exemptDealerErrors,
  formatShekels,
  monthName,
  monthNames,
  resultToText,
  type ExemptDealerInput,
  type ExemptDealerOutcome,
} from '@/lib/exempt-dealer'
import ui from './toolUi.module.css'
import styles from './RecuperationPayCalculator.module.css'

const ANNOUNCE_DELAY_MS = 900

const announcementFor = (outcome: ExemptDealerOutcome) => {
  if (outcome.kind !== 'result') return ''
  if (outcome.crossed) return `המחזור עבר את התקרה ב-${formatShekels(-outcome.remaining)}.`
  return `נשארו ${formatShekels(outcome.remaining)} עד התקרה.`
}

function AmountField({
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
  const described = [hint ? `${id}-hint` : '', error ? `${id}-error` : ''].filter(Boolean).join(' ')
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
        onChange={(event) => onChange(event.target.value)}
      />
      {hint ? (
        <p id={`${id}-hint`} className={ui.hint}>
          {hint}
        </p>
      ) : null}
      {error ? (
        <p id={`${id}-error`} className={styles.error}>
          {error}
        </p>
      ) : null}
    </div>
  )
}

function ResultCard({ outcome }: { outcome: ExemptDealerOutcome }) {
  if (outcome.kind !== 'result') {
    return (
      <div className={styles.card}>
        <p className={styles.message}>{outcome.message}</p>
      </div>
    )
  }
  return (
    <div className={styles.card}>
      <p className={styles.kicker}>{outcome.crossed ? 'עברתם את התקרה ב-' : 'נשאר עד התקרה'}</p>
      <p className={styles.answer}>{formatShekels(Math.abs(outcome.remaining))}</p>
      <dl className={styles.lines}>
        <div className={styles.line}>
          <dt>תקרת עוסק פטור {THRESHOLD_YEAR}</dt>
          <dd>{formatShekels(THRESHOLD)}</dd>
        </div>
        <div className={styles.line}>
          <dt>מחזור מינואר עד {monthName(outcome.month)}</dt>
          <dd>{formatShekels(outcome.turnover)}</dd>
        </div>
        {outcome.allowedPerMonth !== null ? (
          <div className={styles.line}>
            <dt>אפשר להכניס בממוצע עד סוף השנה</dt>
            <dd>{formatShekels(outcome.allowedPerMonth)} בחודש</dd>
          </div>
        ) : null}
        {!outcome.crossed && outcome.month < 12 ? (
          <div className={styles.line}>
            <dt>תחזית לסוף השנה, {formatShekels(outcome.monthly)} בחודש</dt>
            <dd>{formatShekels(outcome.yearEnd)}</dd>
          </div>
        ) : null}
      </dl>
      {outcome.crossed ? (
        <p className={styles.insight}>
          מחזור מעל {formatShekels(THRESHOLD)} בשנה כבר לא עומד בהגדרה של עוסק פטור בסעיף 1 לחוק מע״מ. פנו למשרד מע״מ או
          לרואה חשבון כדי לעבור לעוסק מורשה ולברר ממתי תחויבו במע״מ.
        </p>
      ) : outcome.crossingMonth ? (
        <p className={styles.insight}>
          בקצב הזה המחזור יעבור את התקרה ב<strong>{monthName(outcome.crossingMonth)}</strong>. כדאי להיערך מראש למעבר
          לעוסק מורשה.
        </p>
      ) : (
        <p className={styles.insight}>בקצב הזה המחזור לא יעבור את התקרה עד סוף {THRESHOLD_YEAR}.</p>
      )}
    </div>
  )
}

export default function ExemptDealerChecker() {
  const [input, setInput] = useState<ExemptDealerInput>(emptyExemptDealerInput)
  const [status, setStatus] = useState('')
  const [announcement, setAnnouncement] = useState('')
  const id = useId()
  const errors = exemptDealerErrors(input)
  const outcome = useMemo(() => calculateExemptDealer(input), [input])
  const spoken = announcementFor(outcome)
  const lastSpoken = useRef(spoken)
  const monthId = `${id}-month`

  useEffect(() => {
    if (spoken === lastSpoken.current) return
    const timer = window.setTimeout(() => {
      lastSpoken.current = spoken
      setAnnouncement(spoken)
    }, ANNOUNCE_DELAY_MS)
    return () => window.clearTimeout(timer)
  }, [spoken])

  const update = (patch: Partial<ExemptDealerInput>) => {
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
      window.gtag?.('event', 'exempt_dealer_check', { month: outcome.month, crossed: outcome.crossed })
    } catch {
      setStatus('ההעתקה נכשלה. סמנו את התוצאה והעתיקו ידנית.')
    }
  }

  return (
    <section className={`${ui.tool} ${styles.calc}`} aria-label="בדיקת תקרת עוסק פטור">
      <div className={`${ui.inner} ${styles.layout}`}>
        <form className={ui.form} onSubmit={(event) => event.preventDefault()}>
          <fieldset className={ui.group}>
            <legend className={ui.legend}>המחזור השנה</legend>
            <AmountField
              id={`${id}-turnover`}
              label="מחזור עסקאות מתחילת השנה (₪)"
              hint="סך כל ההכנסות מכל העסקים שלכם, לפי הקבלות, בלי להוריד הוצאות."
              value={input.turnover}
              error={errors.turnover}
              onChange={(turnover) => update({ turnover })}
            />
            <div className={ui.field}>
              <label htmlFor={monthId} className={ui.label}>
                המחזור הוא מינואר עד סוף חודש
              </label>
              <select
                id={monthId}
                className={`${ui.input} ${styles.select}`}
                value={input.month}
                onChange={(event) => update({ month: event.target.value })}
              >
                <option value="">בחרו</option>
                {monthNames.map((name, index) => (
                  <option key={name} value={String(index + 1)}>
                    {name}
                  </option>
                ))}
              </select>
            </div>
          </fieldset>
          <fieldset className={ui.group}>
            <legend className={ui.legend}>תחזית</legend>
            <AmountField
              id={`${id}-monthly`}
              label="הכנסה צפויה בכל חודש עד סוף השנה (₪)"
              hint="אפשר להשאיר ריק: המחשבון ישתמש בממוצע החודשי עד עכשיו."
              value={input.monthly}
              error={errors.monthly}
              onChange={(monthly) => update({ monthly })}
            />
          </fieldset>
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
              התקרה לשנת {THRESHOLD_YEAR} לפי רשות המסים. התחזית היא הערכה לפי הקצב שהקלדתם. החישוב נעשה בדפדפן, והפרטים
              לא נשלחים לשום מקום.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
