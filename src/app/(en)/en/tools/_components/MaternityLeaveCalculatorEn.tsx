'use client'

import { useEffect, useId, useMemo, useRef, useState } from 'react'
import { Copy } from 'lucide-react'
import {
  DISMISSAL_PROTECTION_DAYS,
  MAX_BABIES,
  MAX_WEEKS_BEFORE,
  MONTHS_FOR_LONG_LEAVE,
  calculateMaternity,
  defaultInput,
  type MaternityInput,
  type MaternityResult,
  type Qualification,
} from '@/lib/maternity-leave'
import { dayFromParts, isoFromDay } from '@/lib/work-days'
import ui from '../../../../(he)/(site)/components/tools/toolUi.module.css'
import styles from '../../../../(he)/(site)/components/tools/MaternityLeaveCalculator.module.css'

const ANNOUNCE_DELAY_MS = 900
const MAX_BIRTH_GAP_DAYS = 140
const DAY_MS = 86_400_000

type Option<T extends string> = { value: T; label: string; hint?: string }
type EnErrors = { expected?: string; actual?: string; start?: string; months?: string }

const dateFormat = new Intl.DateTimeFormat('en-IL', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
  timeZone: 'UTC',
})
const weekdayFormat = new Intl.DateTimeFormat('en-IL', { weekday: 'long', timeZone: 'UTC' })

const formatDateEn = (day: number) => dateFormat.format(new Date(day * DAY_MS))
const formatDayLongEn = (day: number) => `${weekdayFormat.format(new Date(day * DAY_MS))}, ${formatDateEn(day)}`

const plural = (count: number, word: string) => `${count} ${word}${count === 1 ? '' : 's'}`

const durationEn = (days: number) => {
  if (days <= 0) return 'none'
  const weeks = Math.floor(days / 7)
  const rest = days % 7
  if (!weeks) return plural(rest, 'day')
  if (!rest) return plural(weeks, 'week')
  return `${plural(weeks, 'week')} and ${plural(rest, 'day')}`
}

const weeksLabel = (weeks: number) => durationEn(weeks * 7)

const qualificationOptions: Option<Qualification>[] = [
  { value: 'full', label: '10 of the last 14 months, or 15 of 22', hint: 'Full maternity pay: 15 weeks' },
  { value: 'partial', label: '6 to 9 of the last 14 months', hint: 'Partial maternity pay: 8 weeks' },
  { value: 'none', label: 'Fewer than 6 of the last 14 months', hint: 'No maternity pay on contribution record' },
]

const babyOptions: Option<string>[] = [
  { value: '1', label: 'One baby' },
  { value: '2', label: 'Twins' },
  { value: '3', label: 'Triplets' },
  { value: '4', label: 'Quadruplets' },
]

const parseIso = (value: string): number | null => {
  const trimmed = value.trim()
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(trimmed)
  if (!match) return null
  const year = Number(match[1])
  if (year < 2000 || year > 2099) return null
  const day = dayFromParts(year, Number(match[2]), Number(match[3]))
  return isoFromDay(day) === trimmed ? day : null
}

const englishErrors = (input: MaternityInput): EnErrors => {
  const errors: EnErrors = {}
  const expected = parseIso(input.expected)
  const actual = input.actual.trim() ? parseIso(input.actual) : null
  const start = input.start.trim() ? parseIso(input.start) : null
  if (input.expected.trim() && expected === null) errors.expected = 'Invalid date.'
  if (input.actual.trim() && actual === null) errors.actual = 'Invalid date.'
  if (input.start.trim() && start === null) errors.start = 'Invalid date.'
  if (input.months.trim() && !/^\d{1,3}$/.test(input.months.trim())) {
    errors.months = 'Enter a whole number of months, for example 18.'
  } else if (input.months.trim() && Number(input.months) > 600) {
    errors.months = 'Enter a whole number of months, for example 18.'
  }
  if (expected !== null && actual !== null && Math.abs(actual - expected) > MAX_BIRTH_GAP_DAYS) {
    errors.actual = 'The birth date is too far from the due date. Check both dates.'
  }
  if (expected !== null && start !== null && !errors.actual) {
    const birth = actual ?? expected
    if (start > birth) {
      errors.start =
        actual !== null ? 'Leave starts on the birth date at the latest.' : 'Leave starts on the due date at the latest.'
    } else if (start < expected - MAX_WEEKS_BEFORE * 7) {
      errors.start = `Leave can start up to ${MAX_WEEKS_BEFORE} weeks before the due date, that is from ${formatDateEn(
        expected - MAX_WEEKS_BEFORE * 7,
      )}.`
    }
  }
  return errors
}

const missingMessage = (input: MaternityInput) => {
  const missing = [
    parseIso(input.expected) === null ? 'the due date' : '',
    input.months.trim() ? '' : 'your months with the employer',
  ].filter(Boolean)
  return `To see the result, fill in ${missing.join(' and ')}.`
}

const resultToTextEn = (result: MaternityResult) => {
  const lines = [
    `Maternity leave calculator: ${result.birthIsActual ? 'birth date' : 'due date'} ${formatDateEn(result.birth)}`,
    `Length of maternity leave: ${weeksLabel(result.totalWeeks)}`,
    `Leave starts: ${formatDateEn(result.start)}`,
    `Last day of leave: ${formatDateEn(result.lastDay)}`,
    `Back to work: ${formatDateEn(result.returnDay)}`,
  ]
  if (result.paid) {
    lines.push(
      `Maternity pay from Bituach Leumi: ${weeksLabel(result.paid.weeks)}, ${formatDateEn(result.paid.from)} to ${formatDateEn(result.paid.to)}`,
    )
  } else {
    lines.push('Maternity pay: no entitlement on the details entered. Bituach Leumi makes the final decision.')
  }
  lines.push(`Unpaid within the leave: ${durationEn(result.unpaidDays)}`)
  lines.push(`Protection from dismissal: until ${formatDateEn(result.protectedUntil)}, 60 days after the leave ends`)
  lines.push('Estimate under sections 6 and 9 of the Women\'s Employment Law and National Insurance publications. Not legal advice.')
  lines.push('https://www.aiterra.co.il/en/tools/maternity-leave-calculator')
  return lines.join('\n')
}

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

function ResultCard({ outcome }: { outcome: MaternityResult }) {
  const basis = outcome.longLeave
    ? `${MONTHS_FOR_LONG_LEAVE} months or more with the employer`
    : `Less than ${MONTHS_FOR_LONG_LEAVE} months with the employer`
  const babiesWord = babyOptions.find((option) => option.value === String(outcome.babies))?.label.toLowerCase()
  const timeline = [
    {
      term: 'Leave starts',
      value: formatDateEn(outcome.start),
      note: outcome.daysBeforeBirth > 0 ? `${durationEn(outcome.daysBeforeBirth)} before the birth` : 'On the birth date',
    },
    { term: outcome.birthIsActual ? 'Birth date' : 'Due date', value: formatDateEn(outcome.birth), note: '' },
    { term: 'Last day of leave', value: formatDateEn(outcome.lastDay), note: '' },
    { term: 'Back to work', value: formatDayLongEn(outcome.returnDay), note: '' },
  ]

  return (
    <div className={styles.card}>
      <p className={styles.kicker}>Maternity leave</p>
      <p className={styles.answer}>{weeksLabel(outcome.totalWeeks)}</p>
      <p className={styles.basis}>
        {basis}
        {outcome.extraWeeks ? `, plus ${weeksLabel(outcome.extraWeeks)} for ${babiesWord}` : ''}. Under section 6 of
        the Women&apos;s Employment Law.
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

      <h3 className={styles.subTitle}>Maternity pay from Bituach Leumi</h3>
      {outcome.paid ? (
        <>
          <PayBar result={outcome} />
          <dl className={styles.facts}>
            <div className={styles.fact}>
              <dt>Paid</dt>
              <dd>{weeksLabel(outcome.paid.weeks)}</dd>
              <dd className={styles.factNote}>
                {formatDateEn(outcome.paid.from)} to {formatDateEn(outcome.paid.to)}
              </dd>
            </div>
            <div className={styles.fact}>
              <dt>Unpaid</dt>
              <dd>{durationEn(outcome.unpaidDays)}</dd>
              <dd className={styles.factNote}>of the leave</dd>
            </div>
          </dl>
        </>
      ) : (
        <p className={styles.message}>
          On the details entered there is no entitlement to maternity pay, so all {weeksLabel(outcome.totalWeeks)} of
          the leave are unpaid. Bituach Leumi also counts certain periods, such as months on unemployment benefit and
          the first two months of unpaid leave, so check with them.
        </p>
      )}

      <h3 className={styles.subTitle}>Protection from dismissal</h3>
      <p className={styles.protect}>
        Until <strong>{formatDateEn(outcome.protectedUntil)}</strong>. During the leave the employer may not dismiss
        you or give notice, and in the {DISMISSAL_PROTECTION_DAYS} days after it only with a Ministry of Labor permit,
        granted only if the business closed down or went bankrupt (section 9(c)).
      </p>

      {outcome.earliestReturn !== null && outcome.shortestWeeks !== null ? (
        <p className={styles.insight}>
          You can shorten the leave to {weeksLabel(outcome.shortestWeeks)}, that is return to work from{' '}
          {formatDateEn(outcome.earliestReturn)}. After you give notice, the employer cannot delay your return by more
          than three weeks.
        </p>
      ) : null}
      {outcome.pregnancyProtection && !outcome.birthIsActual ? (
        <p className={styles.insight}>
          With 6 months or more with the employer, you also cannot be dismissed without a permit during pregnancy and
          until the leave starts (section 9(a)).
        </p>
      ) : null}
      {outcome.lateBirth ? (
        <p className={styles.insight}>
          The birth was after the due date. The law counts up to {MAX_WEEKS_BEFORE} weeks before the due date and the
          rest after the birth, so confirm the end date with your employer.
        </p>
      ) : null}
      {outcome.paidPastLeave && outcome.paid ? (
        <p className={styles.insight}>
          On this calculation maternity pay runs until {formatDateEn(outcome.paid.to)}, after the leave ends. Bituach
          Leumi sets the paid period by the day you stopped working and the birth date.
        </p>
      ) : null}
    </div>
  )
}

export default function MaternityLeaveCalculatorEn() {
  const [input, setInput] = useState<MaternityInput>(defaultInput)
  const [status, setStatus] = useState('')
  const [announcement, setAnnouncement] = useState('')
  const errors = englishErrors(input)
  const hasErrors = Object.values(errors).some(Boolean)
  const outcome = useMemo(() => calculateMaternity(input), [input])
  const result = !hasErrors && outcome.kind === 'result' ? outcome : null
  const spoken = result
    ? `Maternity leave of ${weeksLabel(result.totalWeeks)}. Last day: ${formatDateEn(result.lastDay)}. Back to work: ${formatDateEn(result.returnDay)}.`
    : ''
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
    if (!result) {
      setStatus('Fill in the details to copy the result.')
      return
    }
    try {
      await navigator.clipboard.writeText(resultToTextEn(result))
      setStatus('Result copied')
      window.gtag?.('event', 'maternity_leave_copy', {
        weeks: result.totalWeeks,
        pay: result.qualification,
        locale: 'en',
      })
    } catch {
      setStatus('Copying failed. Select the result and copy it manually.')
    }
  }

  const message = hasErrors ? 'To see the result, fix the field with the error message below it.' : missingMessage(input)

  return (
    <section className={`${ui.tool} ${styles.calc}`} aria-label="Israel maternity leave calculator">
      <div className={`${ui.inner} ${styles.layout}`}>
        <form className={ui.form} onSubmit={(event) => event.preventDefault()}>
          <fieldset className={ui.group}>
            <legend className={ui.legend}>Dates</legend>
            <div className={styles.row}>
              <Field
                label="Due date"
                type="date"
                value={input.expected}
                error={errors.expected}
                onChange={(expected) => update({ expected })}
              />
              <Field
                label="Actual birth date"
                hint="Only if the baby has already been born."
                type="date"
                value={input.actual}
                error={errors.actual}
                onChange={(actual) => update({ actual })}
              />
            </div>
            <Field
              label="First day of leave"
              hint={`Up to ${MAX_WEEKS_BEFORE} weeks before the due date. Leave it empty and the leave starts on the birth date.`}
              type="date"
              value={input.start}
              error={errors.start}
              onChange={(start) => update({ start })}
            />
          </fieldset>

          <fieldset className={ui.group}>
            <legend className={ui.legend}>Time with the employer</legend>
            <Field
              label="Months worked for the employer before the leave"
              hint={`${MONTHS_FOR_LONG_LEAVE} months or more: 26 weeks. Less: 15 weeks.`}
              type="number"
              value={input.months}
              error={errors.months}
              onChange={(months) => update({ months: months.replace(/\D/g, '') })}
            />
          </fieldset>

          <ChoiceGroup<Qualification>
            legend="Months with National Insurance contributions"
            hint="In the months before the day you stopped working. This decides how many weeks Bituach Leumi pays."
            name="mat-qualification-en"
            options={qualificationOptions}
            value={input.qualification}
            onChange={(qualification) => update({ qualification })}
          />

          <ChoiceGroup
            legend="Number of babies"
            name="mat-babies-en"
            options={babyOptions.slice(0, MAX_BABIES)}
            value={input.babies}
            onChange={(babies) => update({ babies })}
            compact
          />
        </form>

        <div className={ui.output}>
          <div className={ui.sticky}>
            <h2 className={ui.outputTitle}>Result</h2>
            {result ? (
              <ResultCard outcome={result} />
            ) : (
              <div className={styles.card}>
                <p className={styles.message}>{message}</p>
              </div>
            )}
            <div className={ui.actions}>
              <button type="button" className={`${ui.primary} ${styles.copyMain}`} onClick={copy}>
                <Copy aria-hidden="true" />
                Copy the result
              </button>
            </div>
            <p className={ui.status} role="status" aria-live="polite">
              {status}
            </p>
            <p className={styles.srOnly} role="status" aria-live="polite">
              {announcement}
            </p>
            <p className={ui.note}>
              An estimate under section 6 of the Women&apos;s Employment Law and National Insurance publications.
              Extensions for hospitalisation or a child&apos;s disability are not included. Only Bituach Leumi decides
              entitlement to maternity pay. The calculation runs in your browser and nothing is sent anywhere.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
