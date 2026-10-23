'use client'

import { useEffect, useId, useMemo, useRef, useState } from 'react'
import { Copy } from 'lucide-react'
import {
  MAX_BALANCE_DAYS,
  calculateSick,
  countLabel,
  daysLabel,
  emptySickInput,
  formatShekels,
  monthWorkDays,
  rangeLabel,
  resultToText,
  segmentLabel,
  sickErrors,
  weekOptions,
  workerOptions,
  type SickField,
  type SickInput,
  type SickOutcome,
} from '@/lib/sick-days'
import ui from './toolUi.module.css'
import styles from './SickDaysCalculator.module.css'

const ANNOUNCE_DELAY_MS = 900

const spellHints = {
  salaried: 'סופרים את כל ימי המחלה ברצף, כולל שבת וחג.',
  hourly: 'סופרים את ימי המחלה בלי ימי מנוחה שבועית וחגים.',
  intermittent: '',
}

const announcementFor = (outcome: SickOutcome) => {
  if (outcome.kind !== 'result') return ''
  const balance = `יתרת ימי מחלה: ${daysLabel(outcome.accrual.balance)}.`
  if (!outcome.spell) return balance
  const pay = outcome.spell.amount !== null ? ` דמי מחלה: ${formatShekels(outcome.spell.amount)}.` : ''
  return `${balance} בתקופת המחלה משולם כמו ${daysLabel(outcome.spell.paidDays)} של שכר מלא.${pay}`
}

function Field({
  id,
  label,
  hint,
  error,
  value,
  onChange,
  decimal = false,
}: {
  id: string
  label: string
  hint?: string
  error?: string
  value: string
  onChange: (value: string) => void
  decimal?: boolean
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
        inputMode={decimal ? 'decimal' : 'numeric'}
        autoComplete="off"
        spellCheck={false}
        enterKeyHint="done"
        value={value}
        aria-invalid={error ? true : undefined}
        aria-describedby={described || undefined}
        onChange={(event) => onChange(event.target.value)}
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

function ResultCard({ outcome }: { outcome: SickOutcome }) {
  if (outcome.kind !== 'result') {
    return (
      <div className={styles.card}>
        <p className={styles.message}>{outcome.message}</p>
      </div>
    )
  }
  const { accrual, spell, worker } = outcome
  return (
    <div className={styles.card}>
      <p className={styles.kicker}>יתרת ימי מחלה</p>
      <p className={styles.answer}>{daysLabel(accrual.balance)}</p>
      <p className={styles.basis}>
        {accrual.used
          ? `נצברו ${daysLabel(accrual.earned)}, פחות ${daysLabel(accrual.used)} שכבר שולמו`
          : `יום וחצי על כל חודש עבודה מלא, עד ${MAX_BALANCE_DAYS} ימים`}
      </p>
      {accrual.atCap ? (
        <p className={styles.insight}>הצבירה הגיעה לתקרה של {MAX_BALANCE_DAYS} ימים שבסעיף 4(א) לחוק.</p>
      ) : null}
      {accrual.overCap && accrual.used ? (
        <p className={styles.insight}>
          כשהצבירה כבר הגיעה לתקרה, חישוב לפי מספר החודשים בלבד עלול לא לשקף את היתרה בפועל. בדקו את היתרה שמופיעה
          בתלוש השכר.
        </p>
      ) : null}
      {accrual.overused ? (
        <p className={styles.insight}>מספר הימים שהוקלד גדול מהצבירה לפי החוק, ולכן היתרה היא 0.</p>
      ) : null}

      {spell ? (
        <>
          <h3 className={styles.subTitle}>תקופת מחלה של {countLabel(spell.days)}</h3>
          <dl className={styles.segments}>
            {spell.segments.map((segment) => (
              <div key={segment.from} className={styles.segment}>
                <dt>{rangeLabel(segment)}</dt>
                <dd>{segmentLabel(segment)}</dd>
              </div>
            ))}
          </dl>
          <dl className={styles.facts}>
            <div className={styles.fact}>
              <dt>משולם כמו</dt>
              <dd>{daysLabel(spell.paidDays)} של שכר מלא</dd>
            </div>
            {spell.amount !== null ? (
              <div className={styles.fact}>
                <dt>דמי מחלה לתקופה</dt>
                <dd>{formatShekels(spell.amount)}</dd>
              </div>
            ) : null}
            <div className={styles.fact}>
              <dt>יתרה אחרי התקופה</dt>
              <dd>{daysLabel(spell.balanceAfter)}</dd>
            </div>
          </dl>
          {spell.treatment ? (
            <p className={styles.insight}>
              טיפול או בדיקה בשל מחלה ממארת או דיאליזה משולמים מהיום הראשון, אם נמסר למעסיק אישור רפואי בכתב (סעיף
              2(א1)).
            </p>
          ) : null}
          {spell.shortOfBalance ? (
            <p className={styles.insight}>
              היתרה לא מכסה את כל התקופה. על הימים שמעבר ליתרה החוק לא מחייב לשלם דמי מחלה.
            </p>
          ) : null}
        </>
      ) : null}
      {worker === 'intermittent' ? (
        <p className={styles.insight}>
          לעובד לסירוגין החוק סופר את ימי המחלה לפי היחס בין ימי העבודה שלו לימי העבודה ברבע השנה המלא ביותר (סעיף
          2(ב)(3) ו-(4)). המחשבון לא מחשב תשלום לתקופה כזאת; הצבירה והיתרה נכונות גם לו.
        </p>
      ) : null}
    </div>
  )
}

export default function SickDaysCalculator() {
  const [input, setInput] = useState<SickInput>(emptySickInput)
  const [status, setStatus] = useState('')
  const [announcement, setAnnouncement] = useState('')
  const id = useId()
  const errors = sickErrors(input)
  const outcome = useMemo(() => calculateSick(input), [input])
  const spoken = announcementFor(outcome)
  const lastSpoken = useRef(spoken)
  const showWeek = Number(input.partialDays) > 0

  useEffect(() => {
    if (spoken === lastSpoken.current) return
    const timer = window.setTimeout(() => {
      lastSpoken.current = spoken
      setAnnouncement(spoken)
    }, ANNOUNCE_DELAY_MS)
    return () => window.clearTimeout(timer)
  }, [spoken])

  const update = (patch: Partial<SickInput>) => {
    setInput((current) => ({ ...current, ...patch }))
    setStatus('')
  }

  const setField = (field: SickField) => (value: string) => update({ [field]: value.replace(/\s/g, '') })

  const copy = async () => {
    if (outcome.kind !== 'result') {
      setStatus('מלאו את מספר החודשים כדי לקבל תוצאה להעתקה.')
      return
    }
    try {
      await navigator.clipboard.writeText(resultToText(outcome))
      setStatus('הסיכום הועתק')
      window.gtag?.('event', 'sick_days_calc', { worker: outcome.worker, with_spell: Boolean(outcome.spell) })
    } catch {
      setStatus('ההעתקה נכשלה. סמנו את התוצאה והעתיקו ידנית.')
    }
  }

  return (
    <section className={`${ui.tool} ${styles.calc}`} aria-label="מחשבון ימי מחלה">
      <div className={`${ui.inner} ${styles.layout}`}>
        <form className={ui.form} onSubmit={(event) => event.preventDefault()}>
          <fieldset className={ui.group}>
            <legend className={ui.legend}>ותק אצל המעסיק</legend>
            <div className={styles.pair}>
              <Field
                id={`${id}-months`}
                label="חודשי עבודה מלאים"
                value={input.months}
                error={errors.months}
                onChange={setField('months')}
              />
              <Field
                id={`${id}-used`}
                label="ימים שכבר שולמו כדמי מחלה"
                hint="לא חובה"
                value={input.usedDays}
                error={errors.usedDays}
                decimal
                onChange={setField('usedDays')}
              />
            </div>
            <Field
              id={`${id}-partial`}
              label="ימי עבודה בחודשים חלקיים"
              hint="לא חובה. חודש שבו לא עבדתם את כל ימי העבודה מזכה בחלק יחסי."
              value={input.partialDays}
              error={errors.partialDays}
              onChange={setField('partialDays')}
            />
            {showWeek ? (
              <fieldset className={ui.group}>
                <legend className={ui.legend}>שבוע העבודה במקום העבודה</legend>
                <div className={styles.choices}>
                  {weekOptions.map((option) => (
                    <label key={option.value} className={styles.choice}>
                      <input
                        type="radio"
                        name={`${id}-week`}
                        value={option.value}
                        checked={input.week === option.value}
                        onChange={() => update({ week: option.value })}
                      />
                      <span>
                        {option.label}
                        <span className={styles.choiceHint}>חודש מלא = {monthWorkDays[option.value]} ימי עבודה</span>
                      </span>
                    </label>
                  ))}
                </div>
              </fieldset>
            ) : null}
          </fieldset>

          <fieldset className={ui.group}>
            <legend className={ui.legend}>תקופת מחלה</legend>
            <p className={ui.hint}>לא חובה. ממלאים כדי לראות כמה משולם על תקופה מסוימת.</p>
            <fieldset className={ui.group}>
              <legend className={ui.legend}>סוג העובד</legend>
              <div className={`${styles.choices} ${styles.three}`}>
                {workerOptions.map((option) => (
                  <label key={option.value} className={styles.choice}>
                    <input
                      type="radio"
                      name={`${id}-worker`}
                      value={option.value}
                      checked={input.worker === option.value}
                      onChange={() => update({ worker: option.value })}
                    />
                    <span>
                      {option.label}
                      <span className={styles.choiceHint}>{option.hint}</span>
                    </span>
                  </label>
                ))}
              </div>
            </fieldset>
            {input.worker !== 'intermittent' ? (
              <>
                <div className={styles.pair}>
                  <Field
                    id={`${id}-spell`}
                    label="ימי מחלה ברצף"
                    hint={spellHints[input.worker]}
                    value={input.spellDays}
                    error={errors.spellDays}
                    onChange={setField('spellDays')}
                  />
                  <Field
                    id={`${id}-wage`}
                    label="שכר ליום מחלה (₪)"
                    hint="לא חובה. שכר יסוד ותוספות קבועות, בלי שעות נוספות."
                    value={input.dailyWage}
                    error={errors.dailyWage}
                    decimal
                    onChange={setField('dailyWage')}
                  />
                </div>
                <label className={ui.option}>
                  <input
                    type="checkbox"
                    className={ui.checkbox}
                    checked={input.treatment}
                    onChange={(event) => update({ treatment: event.target.checked })}
                  />
                  <span>ההיעדרות היא לטיפול או לבדיקה בשל מחלה ממארת או דיאליזה</span>
                </label>
              </>
            ) : null}
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
              חישוב לפי חוק דמי מחלה בלבד. הסכם קיבוצי, צו הרחבה או חוזה אישי יכולים לתת יותר. החישוב נעשה בדפדפן,
              והפרטים לא נשלחים לשום מקום.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
