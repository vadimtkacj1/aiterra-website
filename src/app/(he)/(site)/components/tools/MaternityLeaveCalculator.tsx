'use client'

import { useEffect, useId, useMemo, useRef, useState } from 'react'
import { Copy } from 'lucide-react'
import {
  DISMISSAL_PROTECTION_DAYS,
  MAX_WEEKS_BEFORE,
  MONTHS_FOR_LONG_LEAVE,
  babyOptions,
  calculateMaternity,
  defaultInput,
  durationText,
  fieldErrors,
  formatDayLong,
  qualificationOptions,
  resultToText,
  type MaternityInput,
  type MaternityOutcome,
  type MaternityResult,
  type Qualification,
} from '@/lib/maternity-leave'
import { formatDate } from '@/lib/work-days'
import ui from './toolUi.module.css'
import styles from './MaternityLeaveCalculator.module.css'

const ANNOUNCE_DELAY_MS = 900

type Option<T extends string> = { value: T; label: string; hint?: string }

function ChoiceGroup<T extends string>({
  legend,
  hint,
  name,
  options,
  value,
  onChange,
  compact = false,
}: {
  legend: string
  hint?: string
  name: string
  options: Option<T>[]
  value: T
  onChange: (value: T) => void
  compact?: boolean
}) {
  const hintId = useId()
  return (
    <fieldset className={ui.group} aria-describedby={hint ? hintId : undefined}>
      <legend className={ui.legend}>{legend}</legend>
      {hint ? (
        <p id={hintId} className={ui.hint}>
          {hint}
        </p>
      ) : null}
      <div className={compact ? styles.choices : `${styles.choices} ${styles.choicesStack}`}>
        {options.map((option) => (
          <label key={option.value} className={styles.choice}>
            <input
              type="radio"
              name={name}
              value={option.value}
              className={ui.checkbox}
              checked={value === option.value}
              onChange={() => onChange(option.value)}
            />
            <span className={styles.choiceText}>
              <span className={styles.choiceLabel}>{option.label}</span>
              {option.hint ? <span className={styles.choiceHint}>{option.hint}</span> : null}
            </span>
          </label>
        ))}
      </div>
    </fieldset>
  )
}

function Field({
  label,
  hint,
  value,
  error,
  type,
  onChange,
}: {
  label: string
  hint?: string
  value: string
  error?: string
  type: 'date' | 'number'
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
        type={type === 'date' ? 'date' : 'text'}
        className={`${ui.input} ${type === 'date' ? `${ui.date} ${styles.date}` : `${ui.ltr} ${styles.number}`}`}
        inputMode={type === 'number' ? 'numeric' : undefined}
        autoComplete="off"
        spellCheck={false}
        enterKeyHint="done"
        maxLength={type === 'number' ? 3 : undefined}
        min={type === 'date' ? '2000-01-01' : undefined}
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

const weeksLabel = (weeks: number) => durationText(weeks * 7)

const announcementFor = (outcome: MaternityOutcome) => {
  if (outcome.kind !== 'result') return ''
  return `חופשת לידה של ${weeksLabel(outcome.totalWeeks)}. היום האחרון: ${formatDate(outcome.lastDay)}. חזרה לעבודה: ${formatDate(
    outcome.returnDay,
  )}.`
}

function PayBar({ result }: { result: MaternityResult }) {
  if (!result.paid) return null
  const before = Math.max(0, result.paid.from - result.start)
  const paid = Math.min(result.paid.to, result.lastDay) - result.paid.from + 1
  const total = result.totalDays
  return (
    <div className={styles.bar} aria-hidden="true">
      {before ? <span className={styles.barUnpaid} style={{ flexGrow: before }} /> : null}
      <span className={styles.barPaid} style={{ flexGrow: paid }} />
      {total - before - paid > 0 ? <span className={styles.barUnpaid} style={{ flexGrow: total - before - paid }} /> : null}
    </div>
  )
}

function ResultCard({ outcome }: { outcome: MaternityOutcome }) {
  if (outcome.kind !== 'result') {
    return (
      <div className={styles.card}>
        <p className={styles.message}>{outcome.message}</p>
      </div>
    )
  }

  const basis = outcome.longLeave
    ? `${MONTHS_FOR_LONG_LEAVE} חודשים ומעלה אצל המעסיק`
    : `פחות מ-${MONTHS_FOR_LONG_LEAVE} חודשים אצל המעסיק`
  const timeline = [
    {
      term: 'תחילת החופשה',
      value: formatDate(outcome.start),
      note: outcome.daysBeforeBirth > 0 ? `${durationText(outcome.daysBeforeBirth)} לפני הלידה` : 'ביום הלידה',
    },
    { term: outcome.birthIsActual ? 'יום הלידה' : 'יום הלידה המשוער', value: formatDate(outcome.birth), note: '' },
    { term: 'היום האחרון של החופשה', value: formatDate(outcome.lastDay), note: '' },
    { term: 'חזרה לעבודה', value: formatDayLong(outcome.returnDay), note: '' },
  ]

  return (
    <div className={styles.card}>
      <p className={styles.kicker}>חופשת לידה</p>
      <p className={styles.answer}>{weeksLabel(outcome.totalWeeks)}</p>
      <p className={styles.basis}>
        {basis}
        {outcome.extraWeeks ? `, ועוד ${weeksLabel(outcome.extraWeeks)} על לידה של ${outcome.babies} תינוקות` : ''}. לפי
        סעיף 6 לחוק עבודת נשים.
      </p>

      <ol className={styles.timeline}>
        {timeline.map((item) => (
          <li key={item.term} className={styles.step}>
            <span className={styles.stepTerm}>{item.term}</span>
            <span className={styles.stepValue}>{item.value}</span>
            {item.note ? <span className={styles.stepNote}>{item.note}</span> : null}
          </li>
        ))}
      </ol>

      <h3 className={styles.subTitle}>דמי לידה מביטוח לאומי</h3>
      {outcome.paid ? (
        <>
          <PayBar result={outcome} />
          <dl className={styles.facts}>
            <div className={styles.fact}>
              <dt>בתשלום</dt>
              <dd>{weeksLabel(outcome.paid.weeks)}</dd>
              <dd className={styles.factNote}>
                {formatDate(outcome.paid.from)} עד {formatDate(outcome.paid.to)}
              </dd>
            </div>
            <div className={styles.fact}>
              <dt>בלי תשלום</dt>
              <dd>{durationText(outcome.unpaidDays)}</dd>
              <dd className={styles.factNote}>מתוך החופשה</dd>
            </div>
          </dl>
        </>
      ) : (
        <p className={styles.message}>
          לפי מה שהוזן אין זכאות לדמי לידה, וכל {weeksLabel(outcome.totalWeeks)} החופשה בלי תשלום. ביטוח לאומי מחשיב
          גם תקופות מסוימות, כמו חודשים של דמי אבטלה ושני החודשים הראשונים של חופשה ללא תשלום, ולכן כדאי לבדוק מולו.
        </p>
      )}

      <h3 className={styles.subTitle}>הגנה מפיטורים</h3>
      <p className={styles.protect}>
        עד <strong>{formatDate(outcome.protectedUntil)}</strong>. בזמן החופשה אסור לפטר או לתת הודעת פיטורים, וב-
        {DISMISSAL_PROTECTION_DAYS} הימים שאחריה רק בהיתר ממשרד העבודה, שניתן רק אם העסק הפסיק לפעול או בפשיטת רגל
        (סעיף 9(ג)).
      </p>

      {outcome.earliestReturn !== null && outcome.shortestWeeks !== null ? (
        <p className={styles.insight}>
          אפשר לקצר את החופשה עד {weeksLabel(outcome.shortestWeeks)}, כלומר לחזור לעבודה מ-{formatDate(outcome.earliestReturn)}
          . אחרי ההודעה המעסיק לא יכול לדחות את החזרה ביותר משלושה שבועות.
        </p>
      ) : null}
      {outcome.pregnancyProtection && !outcome.birthIsActual ? (
        <p className={styles.insight}>
          עם ותק של 6 חודשים ומעלה, גם בזמן ההיריון ועד היציאה לחופשה מעסיק לא יכול לפטר בלי היתר (סעיף 9(א)).
        </p>
      ) : null}
      {outcome.lateBirth ? (
        <p className={styles.insight}>
          הלידה הייתה אחרי התאריך המשוער. החוק סופר עד {MAX_WEEKS_BEFORE} שבועות לפני התאריך המשוער ואת השאר אחרי יום
          הלידה, ולכן כדאי לוודא את תאריך הסיום מול המעסיק.
        </p>
      ) : null}
      {outcome.paidPastLeave && outcome.paid ? (
        <p className={styles.insight}>
          לפי החישוב דמי הלידה נמשכים עד {formatDate(outcome.paid.to)}, אחרי סוף החופשה. ביטוח לאומי קובע את התקופה
          המשולמת לפי היום שבו הפסקת לעבוד ויום הלידה.
        </p>
      ) : null}
    </div>
  )
}

export default function MaternityLeaveCalculator() {
  const [input, setInput] = useState<MaternityInput>(defaultInput)
  const [status, setStatus] = useState('')
  const [announcement, setAnnouncement] = useState('')
  const errors = fieldErrors(input)
  const outcome = useMemo(() => calculateMaternity(input), [input])
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

  const update = (patch: Partial<MaternityInput>) => {
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
      window.gtag?.('event', 'maternity_leave_copy', { weeks: outcome.totalWeeks, pay: outcome.qualification })
    } catch {
      setStatus('ההעתקה נכשלה. סמנו את התוצאה והעתיקו ידנית.')
    }
  }

  return (
    <section className={`${ui.tool} ${styles.calc}`} aria-label="מחשבון חופשת לידה">
      <div className={`${ui.inner} ${styles.layout}`}>
        <form className={ui.form} onSubmit={(event) => event.preventDefault()}>
          <fieldset className={ui.group}>
            <legend className={ui.legend}>תאריכים</legend>
            <div className={styles.row}>
              <Field
                label="תאריך לידה משוער"
                type="date"
                value={input.expected}
                error={errors.expected}
                onChange={(expected) => update({ expected })}
              />
              <Field
                label="תאריך הלידה בפועל"
                hint="רק אם הלידה כבר הייתה."
                type="date"
                value={input.actual}
                error={errors.actual}
                onChange={(actual) => update({ actual })}
              />
            </div>
            <Field
              label="יום היציאה לחופשה"
              hint={`עד ${MAX_WEEKS_BEFORE} שבועות לפני התאריך המשוער. אם תשאירו ריק, החופשה מתחילה ביום הלידה.`}
              type="date"
              value={input.start}
              error={errors.start}
              onChange={(start) => update({ start })}
            />
          </fieldset>

          <fieldset className={ui.group}>
            <legend className={ui.legend}>ותק אצל המעסיק</legend>
            <Field
              label="חודשי עבודה אצל המעסיק עד היציאה לחופשה"
              hint={`${MONTHS_FOR_LONG_LEAVE} חודשים ומעלה: 26 שבועות. פחות: 15 שבועות.`}
              type="number"
              value={input.months}
              error={errors.months}
              onChange={(months) => update({ months: months.replace(/\D/g, '') })}
            />
          </fieldset>

          <ChoiceGroup<Qualification>
            legend="חודשים ששולמו בהם דמי ביטוח לאומי"
            hint="בחודשים שלפני היום שבו הפסקת לעבוד. כך ביטוח לאומי קובע כמה שבועות ישלם."
            name="mat-qualification"
            options={qualificationOptions}
            value={input.qualification}
            onChange={(qualification) => update({ qualification })}
          />

          <ChoiceGroup
            legend="מספר התינוקות בלידה"
            name="mat-babies"
            options={babyOptions}
            value={input.babies}
            onChange={(babies) => update({ babies })}
            compact
          />
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
              חישוב עזר לפי סעיף 6 לחוק עבודת נשים ופרסומי הביטוח הלאומי. הארכות בשל אשפוז או מוגבלות של הילד לא
              נכללות. את הזכאות לדמי לידה קובע ביטוח לאומי בלבד. החישוב נעשה בדפדפן, והפרטים לא נשלחים לשום מקום.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
