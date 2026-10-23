'use client'

import { useEffect, useId, useMemo, useRef, useState } from 'react'
import { Copy } from 'lucide-react'
import {
  MAX_YEAR,
  MIN_START_YEAR,
  basisOptions,
  calculateNotice,
  directionOptions,
  emptyNoticeInput,
  lengthLabel,
  noticeErrors,
  resultToText,
  seniorityLabel,
  type NoticeInput,
  type NoticeOutcome,
} from '@/lib/notice-period'
import { formatLongDate } from '@/lib/work-days'
import ui from './toolUi.module.css'
import styles from './NoticePeriodCalculator.module.css'

const ANNOUNCE_DELAY_MS = 900

const announcementFor = (outcome: NoticeOutcome) => {
  if (outcome.kind !== 'result') return ''
  return `הודעה מוקדמת: ${lengthLabel(outcome.length)}. היום האחרון: ${formatLongDate(outcome.end)}.`
}

function DateField({
  id,
  label,
  value,
  error,
  onChange,
}: {
  id: string
  label: string
  value: string
  error?: string
  onChange: (value: string) => void
}) {
  const errorId = `${id}-error`
  return (
    <div className={ui.field}>
      <label htmlFor={id} className={ui.label}>
        {label}
      </label>
      <input
        id={id}
        type="date"
        className={`${ui.input} ${styles.date}`}
        min={`${MIN_START_YEAR}-01-01`}
        max={`${MAX_YEAR}-12-31`}
        value={value}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : undefined}
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

function ResultCard({ outcome }: { outcome: NoticeOutcome }) {
  if (outcome.kind !== 'result') {
    return (
      <div className={styles.card}>
        <p className={styles.message}>{outcome.message}</p>
      </div>
    )
  }
  const resignation = outcome.direction === 'resignation'
  return (
    <div className={styles.card}>
      <p className={styles.kicker}>{resignation ? 'הודעה מוקדמת להתפטרות' : 'הודעה מוקדמת לפיטורים'}</p>
      <p className={styles.answer}>{lengthLabel(outcome.length)}</p>
      <p className={styles.basis}>
        {outcome.section} לחוק{resignation ? ' וסעיף 5' : ''}. ההודעה ניתנה בחודש ה-{outcome.monthOrdinal} לעבודה,
        ותק {seniorityLabel(outcome.completedMonths)}.
      </p>
      {outcome.formula.expression ? (
        <p className={styles.formula}>
          {outcome.formula.text}:{' '}
          <span dir="ltr" className={styles.expression}>
            {outcome.formula.expression}
          </span>
        </p>
      ) : null}
      <dl className={styles.facts}>
        <div className={styles.fact}>
          <dt>ההודעה ניתנה</dt>
          <dd>{formatLongDate(outcome.notice)}</dd>
        </div>
        <div className={styles.fact}>
          <dt>היום האחרון של תקופת ההודעה</dt>
          <dd>
            {formatLongDate(outcome.end)}
            {outcome.halfDay ? ' (חצי יום)' : ''}
          </dd>
        </div>
      </dl>
      {outcome.length.kind === 'month' ? (
        <p className={styles.insight}>
          חודש נספר מיום ההודעה עד אותו תאריך בחודש הבא, ואם אין בו תאריך כזה, עד היום האחרון של החודש (סעיף 10(ב)
          לחוק הפרשנות).
        </p>
      ) : null}
      {outcome.halfDay ? (
        <p className={styles.insight}>
          החוק נותן כאן חצי יום ולא קובע איך לעגל אותו. כדאי לכתוב בהודעה את תאריך הסיום במפורש.
        </p>
      ) : null}
      {outcome.afterRest !== null ? (
        <p className={styles.insight}>
          {outcome.endRest.length === 1 ? 'היום האחרון בתקופה הוא יום מנוחה' : 'הימים האחרונים בתקופה הם ימי מנוחה'} (
          {outcome.endRest.map((rest) => rest.name).join('; ')}). לפי סעיף 10(ג) לחוק הפרשנות ימי מנוחה שבסוף תקופה לא
          נמנים בה, ולפיו התקופה נמשכת עד {formatLongDate(outcome.afterRest)}.
        </p>
      ) : null}
      {resignation ? (
        <p className={styles.insight}>
          עובד שמפסיק לעבוד בלי לתת את ההודעה משלם למעסיק פיצוי בגובה השכר הרגיל בעד הימים החסרים, והמעסיק רשאי לקזז
          אותו (סעיף 7(ב)).
        </p>
      ) : (
        <p className={styles.insight}>
          מעסיק שלא נותן את ההודעה, או מוותר על עבודת העובד בתקופה הזאת, משלם את השכר הרגיל בעד התקופה (סעיפים 6
          ו-7(א)).
        </p>
      )}
    </div>
  )
}

export default function NoticePeriodCalculator() {
  const [input, setInput] = useState<NoticeInput>(emptyNoticeInput)
  const [status, setStatus] = useState('')
  const [announcement, setAnnouncement] = useState('')
  const id = useId()
  const errors = noticeErrors(input)
  const outcome = useMemo(() => calculateNotice(input), [input])
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

  const update = (patch: Partial<NoticeInput>) => {
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
      window.gtag?.('event', 'notice_period_calc', {
        basis: outcome.basis,
        direction: outcome.direction,
        length: outcome.length.kind,
      })
    } catch {
      setStatus('ההעתקה נכשלה. סמנו את התוצאה והעתיקו ידנית.')
    }
  }

  return (
    <section className={`${ui.tool} ${styles.calc}`} aria-label="מחשבון הודעה מוקדמת">
      <div className={`${ui.inner} ${styles.layout}`}>
        <form className={ui.form} onSubmit={(event) => event.preventDefault()}>
          <fieldset className={ui.group}>
            <legend className={ui.legend}>מי נותן את ההודעה</legend>
            <div className={styles.choices}>
              {directionOptions.map((option) => (
                <label key={option.value} className={styles.choice}>
                  <input
                    type="radio"
                    name={`${id}-direction`}
                    value={option.value}
                    checked={input.direction === option.value}
                    onChange={() => update({ direction: option.value })}
                  />
                  <span>
                    {option.label}
                    <span className={styles.choiceHint}>
                      {option.value === 'dismissal' ? 'המעסיק מודיע לעובד' : 'העובד מודיע למעסיק'}
                    </span>
                  </span>
                </label>
              ))}
            </div>
          </fieldset>

          <fieldset className={ui.group}>
            <legend className={ui.legend}>סוג העובד</legend>
            <div className={styles.choices}>
              {basisOptions.map((option) => (
                <label key={option.value} className={styles.choice}>
                  <input
                    type="radio"
                    name={`${id}-basis`}
                    value={option.value}
                    checked={input.basis === option.value}
                    onChange={() => update({ basis: option.value })}
                  />
                  <span>
                    {option.label}
                    <span className={styles.choiceHint}>{option.hint}</span>
                  </span>
                </label>
              ))}
            </div>
          </fieldset>

          <fieldset className={ui.group}>
            <legend className={ui.legend}>תאריכים</legend>
            <div className={styles.pair}>
              <DateField
                id={`${id}-start`}
                label="תחילת העבודה"
                value={input.start}
                error={errors.start}
                onChange={(start) => update({ start })}
              />
              <DateField
                id={`${id}-notice`}
                label="יום מתן ההודעה"
                value={input.notice}
                error={errors.notice}
                onChange={(notice) => update({ notice })}
              />
            </div>
            <p className={ui.hint}>הוותק נספר עד יום מתן ההודעה. חופשה ללא תשלום בדרך כלל לא נספרת, חופשת לידה כן.</p>
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
              המינימום לפי חוק הודעה מוקדמת. חוזה, הסכם קיבוצי או צו הרחבה יכולים לקבוע תקופה ארוכה יותר. החישוב נעשה
              בדפדפן, והפרטים לא נשלחים לשום מקום.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
