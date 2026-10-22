'use client'

import { useEffect, useId, useMemo, useRef, useState, useSyncExternalStore } from 'react'
import { Copy } from 'lucide-react'
import {
  calculateRetirement,
  countdown,
  daysInMonth,
  fieldErrors,
  formatAge,
  formatAgeShort,
  formatDate,
  formatWhen,
  genderOptions,
  monthNames,
  resultToText,
  type BirthInput,
  type CalendarDate,
  type RetirementOutcome,
  type RetirementResult,
} from '@/lib/retirement-age'
import ui from './toolUi.module.css'
import styles from './RetirementAgeCalculator.module.css'

const ANNOUNCE_DELAY_MS = 900

const emptyInput: BirthInput = { gender: '', day: '', month: '', year: '' }

const subscribeNever = () => () => {}

const localToday = () => {
  const now = new Date()
  return `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`
}

function useToday(): CalendarDate | null {
  const stamp = useSyncExternalStore(subscribeNever, localToday, () => '')
  return useMemo(() => {
    if (!stamp) return null
    const [year, month, day] = stamp.split('-').map(Number)
    return { year, month, day }
  }, [stamp])
}

const announcementFor = (outcome: RetirementOutcome) => {
  if (outcome.kind === 'result') {
    return `גיל הפרישה: ${formatAge(outcome.age)}. ${
      outcome.dayKnown ? 'התאריך' : 'החודש'
    }: ${formatWhen(outcome.date, outcome.dayKnown)}.`
  }
  if (outcome.kind === 'unsupported') return outcome.message
  return ''
}

function CountdownRow({ result, today }: { result: RetirementResult; today: CalendarDate }) {
  const left = countdown(result.date, result.dayKnown, today)
  if (left.kind === 'today') {
    return (
      <div className={styles.fact}>
        <dt>זמן שנותר</dt>
        <dd>{result.dayKnown ? 'מגיעים לגיל הפרישה היום' : 'מגיעים לגיל הפרישה החודש'}</dd>
      </div>
    )
  }
  if (left.kind === 'past') {
    return (
      <div className={styles.fact}>
        <dt>הגעתם לגיל הפרישה</dt>
        <dd>לפני {left.text}</dd>
      </div>
    )
  }
  return (
    <div className={styles.fact}>
      <dt>{result.dayKnown ? 'זמן שנותר' : `זמן שנותר עד ${formatDate(left.until)}`}</dt>
      <dd>{left.text}</dd>
    </div>
  )
}

function ResultCard({ outcome, today }: { outcome: RetirementOutcome; today: CalendarDate | null }) {
  if (outcome.kind !== 'result') {
    return (
      <div className={styles.card}>
        <p className={styles.message}>{outcome.message}</p>
      </div>
    )
  }

  const pension = outcome.milestones.find((item) => item.id === 'pension')
  const mandatory = outcome.milestones.find((item) => item.id === 'mandatory')
  const monthsOf = ({ years, months }: { years: number; months: number }) => years * 12 + months
  const belowMandatory = mandatory ? monthsOf(outcome.age) < monthsOf(mandatory.age) : false

  return (
    <div className={styles.card}>
      <p className={styles.kicker}>גיל הפרישה</p>
      <p className={styles.answer}>{formatAge(outcome.age)}</p>
      <p className={styles.basis}>לפי {outcome.basis}</p>
      <dl className={styles.facts}>
        <div className={styles.fact}>
          <dt>{outcome.dayKnown ? 'תאריך ההגעה לגיל הפרישה' : 'החודש שבו מגיעים לגיל הפרישה'}</dt>
          <dd>{formatWhen(outcome.date, outcome.dayKnown)}</dd>
        </div>
        {today ? <CountdownRow result={outcome} today={today} /> : null}
      </dl>

      <h3 className={styles.subTitle}>עוד גילים שקובעים בחוק</h3>
      <dl className={styles.milestones}>
        {outcome.milestones.map((item) => (
          <div key={item.id} className={styles.milestone}>
            <dt className={styles.milestoneLabel}>{item.label}</dt>
            <dd className={styles.milestoneValue}>
              גיל {formatAgeShort(item.age)}
              <span className={styles.milestoneDate}>{formatWhen(item.date, outcome.dayKnown)}</span>
            </dd>
            <dd className={styles.milestoneHint}>{item.hint}</dd>
          </div>
        ))}
      </dl>

      {pension ? (
        <p className={styles.insight}>
          מגיל הפרישה ועד גיל {formatAgeShort(pension.age)} קצבת אזרח ותיק מביטוח לאומי תלויה במבחן הכנסות. הכנסה
          מפנסיה לא נחשבת בבדיקה.
        </p>
      ) : null}
      {belowMandatory && mandatory ? (
        <p className={styles.insight}>
          מותר לפרוש בגיל הפרישה, אבל מעסיק לא יכול לחייב לפרוש לפני גיל {formatAgeShort(mandatory.age)}, שהוא גיל
          פרישת החובה.
        </p>
      ) : null}
      {outcome.transitionGrant ? (
        <p className={styles.insight}>
          לנשים שנולדו בין 1960 ל-1966 יש מענק מעבר מביטוח לאומי לארבעת החודשים שאחרי גיל 62, למי שלא עובדת
          ועומדת בתנאים.
        </p>
      ) : null}
    </div>
  )
}

export default function RetirementAgeCalculator() {
  const [input, setInput] = useState<BirthInput>(emptyInput)
  const [status, setStatus] = useState('')
  const [announcement, setAnnouncement] = useState('')
  const today = useToday()
  const id = useId()
  const errors = fieldErrors(input, today)
  const outcome = useMemo(() => calculateRetirement(input, today), [input, today])
  const spoken = announcementFor(outcome)
  const lastSpoken = useRef(spoken)
  const dayLimit =
    input.month && input.year.length === 4 && !errors.year ? daysInMonth(Number(input.year), Number(input.month)) : 31

  useEffect(() => {
    if (spoken === lastSpoken.current) return
    const timer = window.setTimeout(() => {
      lastSpoken.current = spoken
      setAnnouncement(spoken)
    }, ANNOUNCE_DELAY_MS)
    return () => window.clearTimeout(timer)
  }, [spoken])

  const update = (patch: Partial<BirthInput>) => {
    setInput((current) => ({ ...current, ...patch }))
    setStatus('')
  }

  const copy = async () => {
    if (outcome.kind !== 'result') {
      setStatus('מלאו את הפרטים כדי לקבל תוצאה להעתקה.')
      return
    }
    try {
      await navigator.clipboard.writeText(resultToText(outcome, today))
      setStatus('הסיכום הועתק')
      window.gtag?.('event', 'retirement_age_copy', { gender: outcome.gender })
    } catch {
      setStatus('ההעתקה נכשלה. סמנו את התוצאה והעתיקו ידנית.')
    }
  }

  const dayId = `${id}-day`
  const monthId = `${id}-month`
  const yearId = `${id}-year`
  const hintId = `${id}-hint`
  const dayErrorId = `${id}-day-error`
  const yearErrorId = `${id}-year-error`

  return (
    <section className={`${ui.tool} ${styles.calc}`} aria-label="מחשבון גיל פרישה">
      <div className={`${ui.inner} ${styles.layout}`}>
        <form className={ui.form} onSubmit={(event) => event.preventDefault()}>
          <fieldset className={ui.group}>
            <legend className={ui.legend}>מין</legend>
            <div className={styles.choices}>
              {genderOptions.map((option) => (
                <label key={option.value} className={styles.choice}>
                  <input
                    type="radio"
                    name={`${id}-gender`}
                    value={option.value}
                    checked={input.gender === option.value}
                    onChange={() => update({ gender: option.value })}
                  />
                  <span>{option.label}</span>
                </label>
              ))}
            </div>
          </fieldset>

          <fieldset className={ui.group} aria-describedby={hintId}>
            <legend className={ui.legend}>תאריך לידה</legend>
            <p id={hintId} className={ui.hint}>
              מספיקים חודש ושנה. עם היום בחודש מקבלים תאריך מדויק.
            </p>
            <div className={styles.dateFields}>
              <div className={ui.field}>
                <label htmlFor={dayId} className={ui.label}>
                  יום
                </label>
                <select
                  id={dayId}
                  className={`${ui.input} ${styles.select}`}
                  value={input.day}
                  aria-invalid={errors.day ? true : undefined}
                  aria-describedby={errors.day ? dayErrorId : undefined}
                  onChange={(event) => update({ day: event.target.value })}
                >
                  <option value="">לא חובה</option>
                  {Array.from({ length: 31 }, (_, index) => index + 1).map((day) => (
                    <option key={day} value={String(day)} disabled={day > dayLimit}>
                      {day}
                    </option>
                  ))}
                </select>
              </div>
              <div className={ui.field}>
                <label htmlFor={monthId} className={ui.label}>
                  חודש
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
              <div className={ui.field}>
                <label htmlFor={yearId} className={ui.label}>
                  שנה
                </label>
                <input
                  id={yearId}
                  className={`${ui.input} ${ui.ltr} ${styles.year}`}
                  inputMode="numeric"
                  autoComplete="bday-year"
                  enterKeyHint="done"
                  spellCheck={false}
                  maxLength={4}
                  value={input.year}
                  aria-invalid={errors.year ? true : undefined}
                  aria-describedby={errors.year ? yearErrorId : undefined}
                  onChange={(event) => update({ year: event.target.value.replace(/\s/g, '') })}
                />
              </div>
            </div>
            {errors.day ? (
              <p id={dayErrorId} className={styles.error}>
                {errors.day}
              </p>
            ) : null}
            {errors.year ? (
              <p id={yearErrorId} className={styles.error}>
                {errors.year}
              </p>
            ) : null}
          </fieldset>
        </form>

        <div className={ui.output}>
          <div className={ui.sticky}>
            <h2 className={ui.outputTitle}>התוצאה</h2>
            <ResultCard outcome={outcome} today={today} />
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
              חישוב עזר לפי נוסח החוק. את גיל הפרישה והזכאות לקצבה קובע ביטוח לאומי. החישוב נעשה בדפדפן, והפרטים לא
              נשלחים לשום מקום.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
