'use client'

import { useEffect, useId, useMemo, useRef, useState } from 'react'
import { Copy } from 'lucide-react'
import {
  MONTHLY_HOURS,
  WEEKLY_NORM,
  calculateOvertime,
  defaultInput,
  defaultNorm,
  fieldErrors,
  hoursText,
  money,
  resultToText,
  restDay,
  workDays,
  type DayKey,
  type OvertimeInput,
  type OvertimeOutcome,
  type WageKind,
  type WorkWeek,
} from '@/lib/overtime-pay'
import ui from './toolUi.module.css'
import styles from './OvertimePayCalculator.module.css'

const ANNOUNCE_DELAY_MS = 900

type Option<T extends string> = { value: T; label: string; hint?: string }

const wageOptions: Option<WageKind>[] = [
  { value: 'monthly', label: 'שכר חודשי', hint: `מחלקים ב-${MONTHLY_HOURS} שעות` },
  { value: 'hourly', label: 'שכר לשעה', hint: 'מקלידים ישר את התעריף' },
]

const weekOptions: Option<WorkWeek>[] = [
  { value: '5', label: 'שבוע של 5 ימים', hint: 'תקן יומי של 8.6 שעות' },
  { value: '6', label: 'שבוע של 6 ימים', hint: 'תקן יומי של 8 שעות' },
]

function ChoiceGroup<T extends string>({
  legend,
  name,
  options,
  value,
  onChange,
}: {
  legend: string
  name: string
  options: Option<T>[]
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

function NumberField({
  label,
  hint,
  value,
  error,
  onChange,
}: {
  label: string
  hint?: string
  value: string
  error?: string
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
        type="text"
        className={`${ui.input} ${ui.ltr} ${styles.number}`}
        inputMode="decimal"
        autoComplete="off"
        spellCheck={false}
        enterKeyHint="done"
        maxLength={10}
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

const announcementFor = (outcome: OvertimeOutcome) => {
  if (outcome.kind !== 'result') return ''
  return `תשלום על שעות נוספות: ${money(outcome.total)}.`
}

function ResultCard({ outcome }: { outcome: OvertimeOutcome }) {
  if (outcome.kind !== 'result') {
    return (
      <div className={styles.card}>
        <p className={styles.message}>{outcome.message}</p>
      </div>
    )
  }
  const noOvertime = outcome.hours125 + outcome.hours150 + outcome.restHours === 0

  return (
    <div className={styles.card}>
      <p className={styles.kicker}>שכר שעה רגיל: {money(outcome.hourlyWage)}</p>
      <p className={styles.answer}>{money(outcome.total)}</p>
      <p className={styles.basis}>תשלום על השעות הנוספות והעבודה במנוחה השבועית, ברוטו, מעבר לשכר הרגיל.</p>

      <h3 className={styles.subTitle}>הפירוט</h3>
      <dl className={styles.compare}>
        <div className={styles.compareRow}>
          <dt>שעות ב-125%</dt>
          <dd>
            {money(outcome.pay125)}
            <span className={styles.compareHint}>{hoursText(outcome.hours125)} שעות</span>
          </dd>
        </div>
        <div className={styles.compareRow}>
          <dt>שעות ב-150%</dt>
          <dd>
            {money(outcome.pay150)}
            <span className={styles.compareHint}>{hoursText(outcome.hours150)} שעות</span>
          </dd>
        </div>
        <div className={styles.compareRow}>
          <dt>מנוחה שבועית ב-150%</dt>
          <dd>
            {money(outcome.payRest)}
            <span className={styles.compareHint}>{hoursText(outcome.restHours)} שעות</span>
          </dd>
        </div>
      </dl>

      {noOvertime ? (
        <p className={styles.insight}>
          לא נמצאו שעות נוספות. שעות נוספות הן שעות מעל התקן היומי ומעל {WEEKLY_NORM} שעות בשבוע.
        </p>
      ) : (
        <p className={styles.insight}>
          מעל התקן היומי: {hoursText(outcome.dailyHours125 + outcome.dailyHours150)} שעות. מעל {WEEKLY_NORM} שעות
          בשבוע, אחרי ששעות היום נספרו: {hoursText(outcome.weeklyHours125 + outcome.weeklyHours150)} שעות.
        </p>
      )}
    </div>
  )
}

export default function OvertimePayCalculator() {
  const [input, setInput] = useState<OvertimeInput>(defaultInput)
  const [status, setStatus] = useState('')
  const [announcement, setAnnouncement] = useState('')
  const errors = fieldErrors(input)
  const outcome = useMemo(() => calculateOvertime(input), [input])
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

  const update = (patch: Partial<OvertimeInput>) => {
    setInput((current) => ({ ...current, ...patch }))
    setStatus('')
  }

  const setHours = (key: DayKey, value: string) => {
    setInput((current) => ({ ...current, hours: { ...current.hours, [key]: value } }))
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
      window.gtag?.('event', 'overtime_pay_copy', { wage_kind: input.wageKind })
    } catch {
      setStatus('ההעתקה נכשלה. סמנו את התוצאה והעתיקו ידנית.')
    }
  }

  return (
    <section className={`${ui.tool} ${styles.calc}`} aria-label="מחשבון שעות נוספות">
      <div className={`${ui.inner} ${styles.layout}`}>
        <form className={ui.form} onSubmit={(event) => event.preventDefault()}>
          <ChoiceGroup
            legend="איך מוגדר השכר"
            name="ot-wage-kind"
            options={wageOptions}
            value={input.wageKind}
            onChange={(wageKind) => update({ wageKind })}
          />
          <fieldset className={ui.group}>
            <legend className={ui.legend}>{input.wageKind === 'monthly' ? 'השכר החודשי' : 'השכר לשעה'}</legend>
            <NumberField
              label={input.wageKind === 'monthly' ? 'שכר חודשי ברוטו, ש״ח' : 'שכר לשעה, ש״ח'}
              hint={input.wageKind === 'monthly' ? 'כולל תוספות קבועות. השכר לשעה יחושב אוטומטית.' : undefined}
              value={input.wage}
              error={errors.wage}
              onChange={(wage) => update({ wage })}
            />
          </fieldset>

          <ChoiceGroup
            legend="שבוע העבודה"
            name="ot-week"
            options={weekOptions}
            value={input.week}
            onChange={(week) => update({ week, norm: defaultNorm(week) })}
          />

          <fieldset className={ui.group}>
            <legend className={ui.legend}>שעות עבודה בשבוע</legend>
            <NumberField
              label="תקן יום עבודה, בשעות"
              hint="ברירת המחדל לפי שבוע העבודה. בחוזה או בצו ענפי התקן יכול להיות אחר."
              value={input.norm}
              error={errors.norm}
              onChange={(norm) => update({ norm })}
            />
            <div className={styles.days}>
              {[...workDays, restDay].map((day) => (
                <NumberField
                  key={day.key}
                  label={day.key === 'sat' ? day.label : `יום ${day.label}`}
                  value={input.hours[day.key]}
                  error={errors.hours[day.key]}
                  onChange={(value) => setHours(day.key, value)}
                />
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
              חישוב עזר לפי חוק שעות עבודה ומנוחה, התשי״א-1951: 125% לשעתיים הראשונות מעל התקן ביום, 150% אחרי כן,
              ו-150% על עבודה במנוחה השבועית. הסכם קיבוצי, צו ענפי או חוזה יכולים לתת יותר. החישוב נעשה בדפדפן, והפרטים
              לא נשלחים לשום מקום.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
