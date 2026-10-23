'use client'

import { useEffect, useId, useMemo, useRef, useState } from 'react'
import { Copy } from 'lucide-react'
import {
  SAVINGS_DEPOSIT,
  calculateChildAllowance,
  childrenError,
  emptyChildAllowanceInput,
  formatShekels,
  positionLabel,
  resultToText,
  type ChildAllowanceInput,
  type ChildAllowanceOutcome,
} from '@/lib/child-allowance'
import ui from './toolUi.module.css'
import styles from './RecuperationPayCalculator.module.css'

const ANNOUNCE_DELAY_MS = 900

const announcementFor = (outcome: ChildAllowanceOutcome) =>
  outcome.kind === 'result' ? `קצבת ילדים בחודש: ${formatShekels(outcome.paid)}.` : ''

function ResultCard({ outcome }: { outcome: ChildAllowanceOutcome }) {
  if (outcome.kind !== 'result') {
    return (
      <div className={styles.card}>
        <p className={styles.message}>{outcome.message}</p>
      </div>
    )
  }
  return (
    <div className={styles.card}>
      <p className={styles.kicker}>משולם לחשבון הבנק בכל חודש</p>
      <p className={styles.answer}>{formatShekels(outcome.paid)}</p>
      <dl className={styles.lines}>
        {outcome.lines.map((line) => (
          <div key={line.position} className={styles.line}>
            <dt>{positionLabel(line.position)}</dt>
            <dd>
              {formatShekels(line.allowance)}
              {line.supplement ? ` + ${formatShekels(line.supplement)} תוספת` : ''}
            </dd>
          </div>
        ))}
        {outcome.doubling ? (
          <div className={styles.line}>
            <dt>הכפלת החיסכון, יורד מהקצבה</dt>
            <dd>−{formatShekels(outcome.doubling)}</dd>
          </div>
        ) : null}
        <div className={styles.line}>
          <dt>בשנה</dt>
          <dd>{formatShekels(outcome.paid * 12)}</dd>
        </div>
      </dl>
      <p className={styles.insight}>
        בנוסף, הביטוח הלאומי מפקיד {SAVINGS_DEPOSIT} ₪ בחודש לחיסכון של כל ילד. סך ההפקדה לחיסכון של כל הילדים:{' '}
        <strong>{formatShekels(outcome.savings)}</strong> בחודש. הסכום הזה לא מגיע לחשבון הבנק.
      </p>
    </div>
  )
}

export default function ChildAllowanceCalculator() {
  const [input, setInput] = useState<ChildAllowanceInput>(emptyChildAllowanceInput)
  const [status, setStatus] = useState('')
  const [announcement, setAnnouncement] = useState('')
  const id = useId()
  const error = childrenError(input.children)
  const outcome = useMemo(() => calculateChildAllowance(input), [input])
  const spoken = announcementFor(outcome)
  const lastSpoken = useRef(spoken)
  const childrenId = `${id}-children`

  useEffect(() => {
    if (spoken === lastSpoken.current) return
    const timer = window.setTimeout(() => {
      lastSpoken.current = spoken
      setAnnouncement(spoken)
    }, ANNOUNCE_DELAY_MS)
    return () => window.clearTimeout(timer)
  }, [spoken])

  const update = (patch: Partial<ChildAllowanceInput>) => {
    setInput((current) => ({ ...current, ...patch }))
    setStatus('')
  }

  const copy = async () => {
    if (outcome.kind !== 'result') {
      setStatus('מלאו את מספר הילדים כדי לקבל תוצאה להעתקה.')
      return
    }
    try {
      await navigator.clipboard.writeText(resultToText(outcome))
      setStatus('הסיכום הועתק')
      window.gtag?.('event', 'child_allowance_calc', {
        children: outcome.children,
        supplement: input.supplement,
        double_savings: input.doubleSavings,
      })
    } catch {
      setStatus('ההעתקה נכשלה. סמנו את התוצאה והעתיקו ידנית.')
    }
  }

  return (
    <section className={`${ui.tool} ${styles.calc}`} aria-label="מחשבון קצבת ילדים">
      <div className={`${ui.inner} ${styles.layout}`}>
        <form className={ui.form} onSubmit={(event) => event.preventDefault()}>
          <fieldset className={ui.group}>
            <legend className={ui.legend}>הילדים במשפחה</legend>
            <div className={ui.field}>
              <label htmlFor={childrenId} className={ui.label}>
                כמה ילדים מתחת לגיל 18
              </label>
              <input
                id={childrenId}
                className={`${ui.input} ${ui.ltr} ${styles.number}`}
                inputMode="numeric"
                autoComplete="off"
                enterKeyHint="done"
                value={input.children}
                aria-invalid={error ? true : undefined}
                aria-describedby={error ? `${childrenId}-hint ${childrenId}-error` : `${childrenId}-hint`}
                onChange={(event) => update({ children: event.target.value.replace(/\s/g, '') })}
              />
              <p id={`${childrenId}-hint`} className={ui.hint}>
                סופרים רק ילדים שעוד לא מלאו להם 18. הסדר נקבע לפי הגיל: הבכור הוא הילד הראשון.
              </p>
              {error ? (
                <p id={`${childrenId}-error`} className={styles.error}>
                  {error}
                </p>
              ) : null}
            </div>
          </fieldset>
          <fieldset className={ui.group}>
            <legend className={ui.legend}>מצבים מיוחדים</legend>
            <label className={ui.option}>
              <input
                type="checkbox"
                className={ui.checkbox}
                checked={input.supplement}
                onChange={(event) => update({ supplement: event.target.checked })}
              />
              <span>
                אחד ההורים מקבל הבטחת הכנסה, מזונות מהביטוח הלאומי, או קצבת אזרח ותיק או שאירים עם השלמת הכנסה
              </span>
            </label>
            <label className={ui.option}>
              <input
                type="checkbox"
                className={ui.checkbox}
                checked={input.doubleSavings}
                onChange={(event) => update({ doubleSavings: event.target.checked })}
              />
              <span>בחרנו להכפיל את החיסכון לכל ילד ({SAVINGS_DEPOSIT} ₪ נוספים יורדים מהקצבה לכל ילד)</span>
            </label>
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
              לפי סכומי הביטוח הלאומי מ-1 בינואר 2026. הביטוח הלאומי רשאי לקזז מהקצבה חוב של אחד ההורים. החישוב נעשה
              בדפדפן, והפרטים לא נשלחים לשום מקום.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
