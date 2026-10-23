'use client'

import { useEffect, useId, useMemo, useRef, useState } from 'react'
import { Copy } from 'lucide-react'
import {
  CURRENT_PERIOD,
  MAX_DAYS,
  MAX_HOURS,
  NEXT_UPDATE_TEXT,
  ageGroups,
  basesFor,
  calculateMinimumWage,
  defaultInput,
  fieldErrors,
  formatCount,
  formatMoney,
  formatPercent,
  isYouth,
  resultToText,
  wagePeriods,
  type AgeGroup,
  type MinimumWageInput,
  type MinimumWageOutcome,
  type MinimumWageResult,
  type PayBasis,
  type WagePeriodId,
  type WorkWeek,
} from '@/lib/minimum-wage'
import ui from './toolUi.module.css'
import styles from './MinimumWageCalculator.module.css'

const ANNOUNCE_DELAY_MS = 900

type Option<T extends string> = { value: T; label: string; hint?: string }

const periodOptions: Option<WagePeriodId>[] = wagePeriods.map((period) => ({
  value: period.id,
  label: period.id === CURRENT_PERIOD ? 'מ-1 באפריל 2026' : 'עד 31 במרץ 2026',
  hint: period.id === CURRENT_PERIOD ? 'השכר שבתוקף היום' : 'לבדיקת שכר שכבר שולם',
}))

const ageOptions: Option<AgeGroup>[] = ageGroups.map((group) => ({
  value: group.id,
  label: group.label,
  hint: group.percent === 100 ? 'שכר מינימום מלא' : `${group.percent}% משכר המינימום`,
}))

const weekOptions: Option<WorkWeek>[] = [
  { value: '5', label: '5 ימים בשבוע' },
  { value: '6', label: '6 ימים בשבוע' },
]

const paidLabel = (basis: PayBasis) => {
  if (basis === 'hourly') return 'השכר ששולם לשעה'
  if (basis === 'daily') return 'השכר ששולם ליום'
  return 'השכר החודשי ששולם'
}

const paidHint = (basis: PayBasis, age: AgeGroup) => {
  if (basis !== 'monthly') return 'ברוטו, לשעה או ליום רגיל, בלי תוספות. לא חובה.'
  const counted = isYouth(age) ? 'שכר יסוד' : 'שכר יסוד ותוספת קבועה'
  return `ברוטו: ${counted}, בלי שעות נוספות, תוספות ותק, משפחה ומשמרות, פרמיות, משכורת 13 והחזרי הוצאות. לא חובה.`
}

function ChoiceGroup<T extends string>({
  legend,
  name,
  options,
  value,
  onChange,
  wide = false,
}: {
  legend: string
  name: string
  options: Option<T>[]
  value: T
  onChange: (value: T) => void
  wide?: boolean
}) {
  return (
    <fieldset className={ui.group}>
      <legend className={ui.legend}>{legend}</legend>
      <div className={wide ? `${styles.choices} ${styles.choicesWide}` : styles.choices}>
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
  suffix,
  onChange,
}: {
  label: string
  hint?: string
  value: string
  error?: string
  suffix?: string
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
      <div className={styles.affix}>
        <input
          id={id}
          className={`${ui.input} ${ui.ltr} ${styles.number}${suffix ? ` ${styles.withSuffix}` : ''}`}
          inputMode="decimal"
          autoComplete="off"
          spellCheck={false}
          enterKeyHint="done"
          maxLength={16}
          value={value}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy || undefined}
          onChange={(event) => onChange(event.target.value)}
        />
        {suffix ? (
          <span className={styles.suffix} aria-hidden="true">
            {suffix}
          </span>
        ) : null}
      </div>
      {error ? (
        <p id={errorId} className={styles.error}>
          {error}
        </p>
      ) : null}
    </div>
  )
}

const announcementFor = (outcome: MinimumWageOutcome) => {
  if (outcome.kind !== 'result') return ''
  const base = `שכר המינימום ${outcome.unit}: ${formatMoney(outcome.minimum)}.`
  if (!outcome.check) return base
  return outcome.check.meets
    ? `${base} השכר ששולם לא נמוך משכר המינימום.`
    : `${base} השכר ששולם נמוך ב-${formatMoney(outcome.check.gap)} ${outcome.unit}.`
}

function CheckBlock({ result }: { result: MinimumWageResult }) {
  const { check } = result
  if (!check) return null
  if (check.meets) {
    return (
      <p className={`${styles.verdict} ${styles.verdictOk}`}>
        <strong>השכר עומד בשכר המינימום.</strong> {formatMoney(check.paid)} {result.unit} לא נמוך מ-
        {formatMoney(result.minimum)}.
      </p>
    )
  }
  return (
    <div className={`${styles.verdict} ${styles.verdictLow}`}>
      <p>
        <strong>השכר נמוך משכר המינימום</strong> ב-{formatMoney(check.gap)} {result.unit}.
      </p>
      {check.totalGap !== null && result.quantity ? (
        <p>
          על {formatCount(result.quantity.count)} {result.quantity.label} ההפרש הוא {formatMoney(check.totalGap)}.
        </p>
      ) : null}
    </div>
  )
}

function ResultCard({ outcome }: { outcome: MinimumWageOutcome }) {
  if (outcome.kind !== 'result') {
    return (
      <div className={styles.card}>
        <p className={styles.message}>{outcome.message}</p>
      </div>
    )
  }
  const partScope = outcome.scopeHundredths !== null && outcome.scopeHundredths !== 10000
  const facts = [
    partScope || outcome.basis !== 'monthly'
      ? { term: 'לחודש, משרה מלאה', value: formatMoney(outcome.fullMonthly) }
      : null,
    outcome.lawHourly !== null ? { term: 'לפי 186 שעות שבחוק', value: formatMoney(outcome.lawHourly) } : null,
    outcome.quantity
      ? {
          term: `לפחות על ${formatCount(outcome.quantity.count)} ${outcome.quantity.label}`,
          value: formatMoney(outcome.quantity.total),
        }
      : null,
  ].filter((fact): fact is { term: string; value: string } => fact !== null)

  return (
    <div className={styles.card}>
      <p className={styles.kicker}>
        שכר מינימום {outcome.unit}
        {partScope && outcome.scopeHundredths !== null ? `, ${formatPercent(outcome.scopeHundredths)} משרה` : ''}
      </p>
      <p className={styles.answer}>{formatMoney(outcome.minimum)}</p>
      <p className={styles.basis}>
        {outcome.age.label}, {outcome.period.label}
      </p>
      {facts.length ? (
        <dl className={styles.facts}>
          {facts.map((fact) => (
            <div key={fact.term} className={styles.fact}>
              <dt>{fact.term}</dt>
              <dd>{fact.value}</dd>
            </div>
          ))}
        </dl>
      ) : null}
      <CheckBlock result={outcome} />
      {outcome.lawHourly !== null ? (
        <p className={styles.insight}>
          החוק מחלק ב-186 שעות, אבל צו ההרחבה לקיצור שבוע העבודה קובע חישוב לפי 182 שעות בחודש, ולכן שכר
          המינימום לשעה הוא {formatMoney(outcome.minimum)}.
        </p>
      ) : null}
      {isYouth(outcome.age.id) && outcome.basis === 'hourly' ? (
        <p className={styles.insight}>לבני נוער ולחניכים שכר השעה הוא החלק ה-173 של השכר החודשי שלהם.</p>
      ) : null}
      {outcome.period.id === CURRENT_PERIOD ? (
        <p className={styles.insight}>הסכומים מתעדכנים כל שנה ב-1 באפריל. העדכון הבא צפוי ב-{NEXT_UPDATE_TEXT}.</p>
      ) : (
        <p className={styles.insight}>אלה הסכומים שהיו בתוקף מ-1 באפריל 2025 עד 31 במרץ 2026.</p>
      )}
    </div>
  )
}

export default function MinimumWageCalculator() {
  const [input, setInput] = useState<MinimumWageInput>(defaultInput)
  const [status, setStatus] = useState('')
  const [announcement, setAnnouncement] = useState('')
  const errors = fieldErrors(input)
  const outcome = useMemo(() => calculateMinimumWage(input), [input])
  const spoken = announcementFor(outcome)
  const lastSpoken = useRef(spoken)
  const bases = basesFor(input.age).map((basis) => ({ value: basis.id, label: basis.label }))
  const basis: PayBasis = input.basis === 'daily' && isYouth(input.age) ? 'monthly' : input.basis

  useEffect(() => {
    if (spoken === lastSpoken.current) return
    const timer = window.setTimeout(() => {
      lastSpoken.current = spoken
      setAnnouncement(spoken)
    }, ANNOUNCE_DELAY_MS)
    return () => window.clearTimeout(timer)
  }, [spoken])

  const update = (patch: Partial<MinimumWageInput>) => {
    setInput((current) => {
      const next = { ...current, ...patch }
      if (next.basis === 'daily' && isYouth(next.age)) next.basis = 'monthly'
      return next
    })
    setStatus('')
  }

  const copy = async () => {
    if (outcome.kind !== 'result') {
      setStatus('תקנו את השדות כדי להעתיק את התוצאה.')
      return
    }
    try {
      await navigator.clipboard.writeText(resultToText(outcome))
      setStatus('התוצאה הועתקה')
      window.gtag?.('event', 'minimum_wage_copy', { basis: outcome.basis, age_group: outcome.age.id })
    } catch {
      setStatus('ההעתקה נכשלה. סמנו את התוצאה והעתיקו ידנית.')
    }
  }

  return (
    <section className={`${ui.tool} ${styles.calc}`} aria-label="מחשבון שכר מינימום">
      <div className={`${ui.inner} ${styles.layout}`}>
        <form className={ui.form} onSubmit={(event) => event.preventDefault()}>
          <ChoiceGroup
            legend="תקופה"
            name="mw-period"
            options={periodOptions}
            value={input.period}
            onChange={(period) => update({ period })}
          />
          <ChoiceGroup
            legend="גיל העובד"
            name="mw-age"
            options={ageOptions}
            value={input.age}
            onChange={(age) => update({ age })}
            wide
          />
          <ChoiceGroup
            legend="איך משולם השכר"
            name="mw-basis"
            options={bases}
            value={basis}
            onChange={(next) => update({ basis: next })}
          />

          <fieldset className={ui.group}>
            <legend className={ui.legend}>פרטי העבודה</legend>
            {basis === 'monthly' ? (
              <NumberField
                label="היקף משרה"
                hint="משרה מלאה היא 100. בחצי משרה שכר המינימום הוא חצי."
                value={input.scope}
                error={errors.scope}
                suffix="%"
                onChange={(scope) => update({ scope })}
              />
            ) : null}
            {basis === 'hourly' ? (
              <NumberField
                label="שעות עבודה בחודש"
                hint={`לא חובה. עד ${MAX_HOURS} שעות. כך תראו את השכר המינימלי לחודש כולו.`}
                value={input.hours}
                error={errors.hours}
                onChange={(hours) => update({ hours })}
              />
            ) : null}
            {basis === 'daily' ? (
              <>
                <ChoiceGroup
                  legend="שבוע העבודה במקום העבודה"
                  name="mw-week"
                  options={weekOptions}
                  value={input.week}
                  onChange={(week) => update({ week })}
                />
                <NumberField
                  label="ימי עבודה בחודש"
                  hint={`לא חובה. עד ${MAX_DAYS} ימים.`}
                  value={input.days}
                  error={errors.days}
                  onChange={(days) => update({ days })}
                />
              </>
            ) : null}
            <NumberField
              label={paidLabel(basis)}
              hint={paidHint(basis, input.age)}
              value={input.paid}
              error={errors.paid}
              suffix="₪"
              onChange={(paid) => update({ paid })}
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
              חישוב עזר לפי חוק שכר מינימום, התשמ״ז-1987, ופרסומי הביטוח הלאומי ומשרד העבודה. הסכם קיבוצי או צו
              הרחבה בענף יכולים לקבוע שכר גבוה יותר. החישוב נעשה בדפדפן, והסכומים לא נשלחים לשום מקום.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
