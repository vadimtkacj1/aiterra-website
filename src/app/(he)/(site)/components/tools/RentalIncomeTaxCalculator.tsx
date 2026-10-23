'use client'

import { useEffect, useId, useMemo, useRef, useState } from 'react'
import { Copy } from 'lucide-react'
import {
  CEILING,
  SURTAX_THRESHOLD,
  calculateRental,
  emptyRentalInput,
  formatShekels,
  rentalErrors,
  resultToText,
  trackLabel,
  type RentalInput,
  type RentalOutcome,
} from '@/lib/rental-income-tax'
import ui from './toolUi.module.css'
import styles from './RecuperationPayCalculator.module.css'

const ANNOUNCE_DELAY_MS = 900

const announcementFor = (outcome: RentalOutcome) => {
  if (outcome.kind !== 'result') return ''
  const best = outcome.tracks.find((track) => track.id === outcome.best)
  return `${trackLabel(outcome.best)}: מס ${formatShekels(best?.tax ?? 0)} בשנה.`
}

function AmountField({
  id,
  label,
  hint,
  error,
  value,
  numeric = false,
  onChange,
}: {
  id: string
  label: string
  hint?: string
  error?: string
  value: string
  numeric?: boolean
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
        inputMode={numeric ? 'numeric' : 'decimal'}
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

function ResultCard({ outcome }: { outcome: RentalOutcome }) {
  if (outcome.kind !== 'result') {
    return (
      <div className={styles.card}>
        <p className={styles.message}>{outcome.message}</p>
      </div>
    )
  }
  const best = outcome.tracks.find((track) => track.id === outcome.best)
  return (
    <div className={styles.card}>
      <p className={styles.kicker}>המס הנמוך ביותר: {trackLabel(outcome.best)}</p>
      <p className={styles.answer}>{formatShekels(best?.tax ?? 0)} בשנה</p>
      <dl className={styles.lines}>
        {outcome.tracks.map((track) => (
          <div key={track.id} className={styles.line}>
            <dt>
              {track.label}
              {track.id === outcome.best ? ' (הזול ביותר)' : ''}
            </dt>
            <dd>{formatShekels(track.tax)}</dd>
          </div>
        ))}
        <div className={styles.line}>
          <dt>שכר דירה בשנה</dt>
          <dd>{formatShekels(outcome.gross)}</dd>
        </div>
        <div className={styles.line}>
          <dt>החלק הפטור בחודש, במסלול הפטור</dt>
          <dd>{formatShekels(outcome.exemptMonthly)}</dd>
        </div>
      </dl>
      {outcome.surtax ? (
        <p className={styles.insight}>
          ההכנסה הכוללת עולה על {formatShekels(SURTAX_THRESHOLD)} בשנה. מעל הסכום הזה חל מס יסף, שהמחשבון לא מחשב, ולכן
          המס במסלול הפטור ובמסלול הרגיל גבוה יותר מהמוצג.
        </p>
      ) : null}
      {outcome.rent > CEILING ? (
        <p className={styles.insight}>
          שכר הדירה עולה על התקרה של {formatShekels(CEILING)}, ולכן כל שקל מעליה מוריד שקל מהפטור.
        </p>
      ) : null}
    </div>
  )
}

export default function RentalIncomeTaxCalculator() {
  const [input, setInput] = useState<RentalInput>(emptyRentalInput)
  const [status, setStatus] = useState('')
  const [announcement, setAnnouncement] = useState('')
  const id = useId()
  const errors = rentalErrors(input)
  const outcome = useMemo(() => calculateRental(input), [input])
  const spoken = announcementFor(outcome)
  const lastSpoken = useRef(spoken)

  useEffect(() => {
    if (spoken === lastSpoken.current) return
    const timer = window.setTimeout(() => {
      lastSpoken.current = spoken
      setAnnouncement(spoken)
    }, ANNOUNCE_DELAY_MS)
    return () => window.clearTimeout(timer)
  }, [spoken])

  const update = (patch: Partial<RentalInput>) => {
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
      window.gtag?.('event', 'rental_tax_calc', { best: outcome.best, over_ceiling: outcome.rent > CEILING })
    } catch {
      setStatus('ההעתקה נכשלה. סמנו את התוצאה והעתיקו ידנית.')
    }
  }

  return (
    <section className={`${ui.tool} ${styles.calc}`} aria-label="השוואת מסלולי מס על שכר דירה">
      <div className={`${ui.inner} ${styles.layout}`}>
        <form className={ui.form} onSubmit={(event) => event.preventDefault()}>
          <fieldset className={ui.group}>
            <legend className={ui.legend}>שכר הדירה</legend>
            <div className={styles.pair}>
              <AmountField
                id={`${id}-rent`}
                label="שכר דירה בחודש (₪)"
                hint="מכל דירות המגורים שלכם, של בן או בת הזוג ושל ילדים עד 18 יחד."
                value={input.rent}
                error={errors.rent}
                onChange={(rent) => update({ rent })}
              />
              <AmountField
                id={`${id}-months`}
                label="חודשי השכרה בשנה"
                value={input.months}
                error={errors.months}
                numeric
                onChange={(months) => update({ months })}
              />
            </div>
          </fieldset>
          <fieldset className={ui.group}>
            <legend className={ui.legend}>למסלול הרגיל</legend>
            <AmountField
              id={`${id}-expenses`}
              label="הוצאות ופחת בשנה (₪)"
              hint="למשל ריבית משכנתא, תיקונים ופחת. נלקחות בחשבון רק במסלול הרגיל."
              value={input.expenses}
              error={errors.expenses}
              onChange={(expenses) => update({ expenses })}
            />
            <AmountField
              id={`${id}-other`}
              label="הכנסה חייבת אחרת בשנה (₪)"
              hint="שכר או הכנסה מעסק, לפני מס. קובעת באיזו מדרגת מס נמצא שכר הדירה."
              value={input.otherIncome}
              error={errors.otherIncome}
              onChange={(otherIncome) => update({ otherIncome })}
            />
            <label className={ui.option}>
              <input
                type="checkbox"
                className={ui.checkbox}
                checked={input.senior}
                onChange={(event) => update({ senior: event.target.checked })}
              />
              <span>מלאו לי 60 שנים</span>
            </label>
          </fieldset>
        </form>

        <div className={ui.output}>
          <div className={ui.sticky}>
            <h2 className={ui.outputTitle}>השוואת המסלולים</h2>
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
              מידע כללי ולא ייעוץ מס. לפי מדרגות המס של 2026, בלי נקודות זיכוי ובלי מס יסף. החישוב נעשה בדפדפן, והפרטים לא
              נשלחים לשום מקום.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
