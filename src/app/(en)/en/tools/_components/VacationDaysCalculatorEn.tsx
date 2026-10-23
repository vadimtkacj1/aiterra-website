'use client'

import { useEffect, useId, useMemo, useRef, useState, useSyncExternalStore } from 'react'
import { Copy } from 'lucide-react'
import {
  FULL_YEAR_THRESHOLD,
  MAX_SENIORITY,
  MAX_YEAR,
  MIN_YEAR,
  PARTIAL_YEAR_THRESHOLD,
  SHORT_WORKER_DAYS,
  calculateVacation,
  defaultInput,
  type SeniorityMode,
  type SourceId,
  type VacationInput,
  type VacationResult,
  type WorkWeek,
  type YearCoverage,
} from '@/lib/vacation-days'
import { dayFromParts, isoFromDay, yearOf } from '@/lib/work-days'
import ui from '../../../../(he)/(site)/components/tools/toolUi.module.css'
import styles from '../../../../(he)/(site)/components/tools/VacationDaysCalculator.module.css'

const ANNOUNCE_DELAY_MS = 900
const FALLBACK_YEAR = 2026

type Option<T extends string> = { value: T; label: string; hint?: string }

type Errors = { start?: string; end?: string; calendarYear?: string; daysWorked?: string }

const sourceLabels: Record<SourceId, string> = {
  law: 'Annual Leave Law',
  order: 'Shorter work week extension order',
  agency: 'Staffing agency extension order',
}

const modeOptions: Option<SeniorityMode>[] = [
  { value: 'dates', label: 'From my start date', hint: 'The calculator counts the years' },
  { value: 'year', label: 'I know my year of seniority', hint: 'Pick a number from a list' },
]

const weekOptions: Option<WorkWeek>[] = [
  { value: '5', label: '5-day week', hint: 'Sunday to Thursday' },
  { value: '6', label: '6-day week', hint: 'Sunday to Friday' },
]

const coverageOptions: Option<YearCoverage>[] = [
  { value: 'full', label: 'The whole year', hint: `${FULL_YEAR_THRESHOLD} work-day threshold` },
  { value: 'partial', label: 'Only part of the year', hint: `${PARTIAL_YEAR_THRESHOLD} work-day threshold` },
]

const dateFormat = new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' })
const decimalFormat = new Intl.NumberFormat('en-IL', { maximumFractionDigits: 2 })

const formatDay = (day: number) => dateFormat.format(new Date(`${isoFromDay(day)}T00:00:00Z`))
const daysText = (count: number) => (count === 1 ? '1 day' : `${count} days`)
const perMonthText = (value: number) => (value === 1 ? '1 day' : `${decimalFormat.format(value)} days`)
const weekText = (week: WorkWeek) => (week === '5' ? 'a 5-day work week' : 'a 6-day work week')

const ordinal = (value: number) => {
  const tens = value % 100
  if (tens >= 11 && tens <= 13) return `${value}th`
  const suffix = ['th', 'st', 'nd', 'rd'][value % 10] ?? 'th'
  return `${value}${value % 10 > 3 ? 'th' : suffix}`
}

const seniorityText = (year: number) => `${ordinal(year)} year of seniority`

const parseIso = (value: string): number | null => {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value.trim())
  if (!match) return null
  const [year, month, date] = [Number(match[1]), Number(match[2]), Number(match[3])]
  if (year < MIN_YEAR || year > MAX_YEAR) return null
  const day = dayFromParts(year, month, date)
  return isoFromDay(day) === value.trim() ? day : null
}

const parseWhole = (value: string, min: number, max: number): number | null => {
  const trimmed = value.trim()
  if (!/^\d+$/.test(trimmed)) return null
  const parsed = Number(trimmed)
  return parsed >= min && parsed <= max ? parsed : null
}

const validate = (input: VacationInput): Errors => {
  const errors: Errors = {}
  if (input.mode === 'dates') {
    const start = parseIso(input.start)
    const end = input.end.trim() ? parseIso(input.end) : null
    const year = parseWhole(input.calendarYear, MIN_YEAR, MAX_YEAR)
    if (input.start.trim() && start === null) errors.start = 'Invalid date.'
    if (input.end.trim() && end === null) errors.end = 'Invalid date.'
    if (input.calendarYear.trim() && year === null) errors.calendarYear = `Enter a year between ${MIN_YEAR} and ${MAX_YEAR}.`
    if (start !== null && year !== null) {
      if (end !== null && end < start) errors.end = 'The end date is before the start date.'
      else if (year < yearOf(start))
        errors.calendarYear = `Work started in ${yearOf(start)}, so there is no entitlement for ${year}.`
      else if (end !== null && year > yearOf(end))
        errors.calendarYear = `Work ended in ${yearOf(end)}. Choose a year up to ${yearOf(end)}.`
    }
  }
  if (input.daysWorked.trim() && parseWhole(input.daysWorked, 0, 366) === null) {
    errors.daysWorked = 'Enter a whole number of days between 0 and 366.'
  }
  return errors
}

const sourceText = (result: VacationResult) => {
  const names = result.entitlement.sources.map((id) => sourceLabels[id])
  if (names.length === 1) return `Under the ${names[0]}`
  return `Under the ${names.slice(0, -1).join(', ')} and the ${names[names.length - 1]}, which give the same number`
}

const resultText = (result: VacationResult) => {
  const lines = [
    `Vacation days calculator: ${seniorityText(result.seniorityYear)}${result.calendarYear ? ` (${result.calendarYear})` : ''}, ${weekText(result.week)}`,
    `Vacation days for a full year: ${daysText(result.entitlement.best)} of work (${result.entitlement.sources.map((id) => sourceLabels[id]).join(', ')})`,
  ]
  if (result.prorated && result.daysWorked !== null) {
    lines.push(
      `${result.daysSource === 'estimated' ? 'About ' : ''}${result.daysWorked} days actually worked out of ${result.threshold}: ${daysText(result.days)}`,
    )
  }
  if (result.period) lines.push(`Period: ${formatDay(result.period.from)} to ${formatDay(result.period.to)}`)
  lines.push(`Average per month: ${perMonthText(result.perMonth)}`)
  lines.push('Estimate under the Annual Leave Law and the extension order, as published by the Ministry of Labor. Not legal advice.')
  lines.push('https://www.aiterra.co.il/en/tools/vacation-days-calculator')
  return lines.join('\n')
}

const subscribeNever = () => () => {}

const useCurrentYear = () => useSyncExternalStore(subscribeNever, () => new Date().getFullYear(), () => FALLBACK_YEAR)

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

function TextField({
  label,
  hint,
  value,
  error,
  type = 'text',
  onChange,
}: {
  label: string
  hint?: string
  value: string
  error?: string
  type?: 'text' | 'date'
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
        type={type}
        className={`${ui.input} ${type === 'date' ? `${ui.date} ${styles.date}` : `${ui.ltr} ${styles.number}`}`}
        inputMode={type === 'text' ? 'numeric' : undefined}
        autoComplete="off"
        spellCheck={false}
        enterKeyHint="done"
        maxLength={type === 'text' ? 4 : undefined}
        min={type === 'date' ? '1950-01-01' : undefined}
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

function ResultCard({ result, message }: { result: VacationResult | null; message: string }) {
  if (!result) {
    return (
      <div className={styles.card}>
        <p className={styles.message}>{message}</p>
      </div>
    )
  }
  const { entitlement } = result
  const estimated = result.daysSource === 'estimated'

  return (
    <div className={styles.card}>
      <p className={styles.kicker}>
        {result.calendarYear
          ? `Vacation days in ${result.calendarYear}, ${seniorityText(result.seniorityYear)}`
          : `Vacation days in the ${seniorityText(result.seniorityYear)}`}
      </p>
      <p className={styles.answer}>{daysText(result.days)}</p>
      <p className={styles.basis}>
        Work days, in {weekText(result.week)}. {sourceText(result)}.
      </p>
      <dl className={styles.facts}>
        {result.prorated ? (
          <div className={styles.fact}>
            <dt>For a full year</dt>
            <dd>{daysText(entitlement.best)}</dd>
          </div>
        ) : null}
        {result.daysWorked !== null ? (
          <div className={styles.fact}>
            <dt>{estimated ? 'Days actually worked, estimate' : 'Days actually worked'}</dt>
            <dd>
              {estimated ? 'About ' : ''}
              {result.daysWorked} of {result.threshold}
            </dd>
          </div>
        ) : null}
        <div className={styles.fact}>
          <dt>Average per month</dt>
          <dd>{perMonthText(result.perMonth)}</dd>
        </div>
      </dl>

      <h3 className={styles.subTitle}>Comparison</h3>
      <dl className={styles.compare}>
        <div className={styles.compareRow}>
          <dt>{sourceLabels.law}</dt>
          <dd>
            {daysText(entitlement.law)}
            <span className={styles.compareHint}>{entitlement.lawGross} days including weekly rest</span>
          </dd>
        </div>
        {entitlement.order !== null ? (
          <div className={styles.compareRow}>
            <dt>{sourceLabels.order}</dt>
            <dd>{daysText(entitlement.order)}</dd>
          </div>
        ) : null}
        {entitlement.agency !== null ? (
          <div className={styles.compareRow}>
            <dt>{sourceLabels.agency}</dt>
            <dd>{daysText(entitlement.agency)}</dd>
          </div>
        ) : null}
      </dl>

      {result.period && result.daysSource === 'none' ? (
        <p className={styles.insight}>
          {result.fullYear
            ? `Work lasted all of ${result.calendarYear}. If you actually worked fewer than ${FULL_YEAR_THRESHOLD} days, enter how many and the number will be prorated.`
            : `Work in ${result.calendarYear} lasted from ${formatDay(result.period.from)} to ${formatDay(result.period.to)}, so the entitlement is prorated by days worked out of ${PARTIAL_YEAR_THRESHOLD}.`}
        </p>
      ) : null}
      {estimated ? (
        <p className={styles.insight}>
          The number of days worked is an estimate: work days in the period minus holidays, without sick days, reserve
          duty or other absences. For an exact result, enter the days you actually worked.
        </p>
      ) : null}
      {result.prorated ? (
        <p className={styles.insight}>
          {entitlement.best} × {result.daysWorked} ÷ {result.threshold} = {decimalFormat.format(result.exact)}. Under
          section 3 of the law a fraction of a day is not counted, so the result is {daysText(result.days)}.
        </p>
      ) : null}
      {result.shortWorker ? (
        <p className={styles.insight}>
          An hourly or daily paid worker who worked fewer than {SHORT_WORKER_DAYS} consecutive days gets no vacation
          days but a vacation payment of at least 4% of wages (sections 4 and 15 of the law).
        </p>
      ) : null}
    </div>
  )
}

export default function VacationDaysCalculatorEn() {
  const currentYear = useCurrentYear()
  const [input, setInput] = useState<VacationInput>(() => defaultInput(FALLBACK_YEAR))
  const [yearTouched, setYearTouched] = useState(false)
  const [status, setStatus] = useState('')
  const [announcement, setAnnouncement] = useState('')
  const effectiveInput = useMemo(
    () => (yearTouched ? input : { ...input, calendarYear: String(currentYear) }),
    [input, yearTouched, currentYear],
  )
  const errors = validate(effectiveInput)
  const invalid = Object.values(errors).some(Boolean)
  const result = useMemo(() => {
    if (invalid) return null
    const outcome = calculateVacation(effectiveInput)
    return outcome.kind === 'result' ? outcome : null
  }, [effectiveInput, invalid])
  const message = invalid
    ? 'To see the result, fix the field with the error message below it.'
    : 'To see the result, choose your start date.'
  const spoken = result
    ? `${daysText(result.days)} of vacation in the ${seniorityText(result.seniorityYear)}. ${sourceText(result)}.`
    : ''
  const lastSpoken = useRef(spoken)
  const id = useId()

  useEffect(() => {
    if (spoken === lastSpoken.current) return
    const timer = window.setTimeout(() => {
      lastSpoken.current = spoken
      setAnnouncement(spoken)
    }, ANNOUNCE_DELAY_MS)
    return () => window.clearTimeout(timer)
  }, [spoken])

  const update = (patch: Partial<VacationInput>) => {
    setInput((current) => ({ ...current, ...patch }))
    if (patch.calendarYear !== undefined) setYearTouched(true)
    setStatus('')
  }

  const copy = async () => {
    if (!result) {
      setStatus('Fill in the details to copy the result.')
      return
    }
    try {
      await navigator.clipboard.writeText(resultText(result))
      setStatus('Result copied')
      window.gtag?.('event', 'vacation_days_copy', {
        week: result.week,
        seniority_year: result.seniorityYear,
        locale: 'en',
      })
    } catch {
      setStatus('Copying failed. Select the result and copy it manually.')
    }
  }

  const seniorityId = `${id}-seniority`
  const orderId = `${id}-order`
  const orderHintId = `${id}-order-hint`
  const agencyId = `${id}-agency`
  const threshold = result ? result.threshold : null

  return (
    <section className={`${ui.tool} ${styles.calc}`} aria-label="Israel vacation days calculator">
      <div className={`${ui.inner} ${styles.layout}`}>
        <form className={ui.form} onSubmit={(event) => event.preventDefault()}>
          <ChoiceGroup
            legend="How to work out seniority"
            name="vac-mode"
            options={modeOptions}
            value={effectiveInput.mode}
            onChange={(mode) => update({ mode })}
          />

          <fieldset className={ui.group}>
            <legend className={ui.legend}>{effectiveInput.mode === 'dates' ? 'Employment period' : 'Year of seniority'}</legend>
            {effectiveInput.mode === 'dates' ? (
              <>
                <div className={styles.row}>
                  <TextField
                    label="Start date"
                    type="date"
                    value={effectiveInput.start}
                    error={errors.start}
                    onChange={(start) => update({ start })}
                  />
                  <TextField
                    label="Vacation year"
                    hint="Calendar year, January to December"
                    value={effectiveInput.calendarYear}
                    error={errors.calendarYear}
                    onChange={(calendarYear) => update({ calendarYear: calendarYear.replace(/\D/g, '') })}
                  />
                </div>
                <TextField
                  label="End date"
                  hint="Only if the job ended or will end in this year."
                  type="date"
                  value={effectiveInput.end}
                  error={errors.end}
                  onChange={(end) => update({ end })}
                />
              </>
            ) : (
              <>
                <div className={ui.field}>
                  <label htmlFor={seniorityId} className={ui.label}>
                    Year of seniority with the employer
                  </label>
                  <select
                    id={seniorityId}
                    className={`${ui.input} ${styles.select}`}
                    value={effectiveInput.seniority}
                    onChange={(event) => update({ seniority: event.target.value })}
                  >
                    {Array.from({ length: MAX_SENIORITY }, (_, index) => index + 1).map((year) => (
                      <option key={year} value={String(year)}>
                        {ordinal(year)} year
                      </option>
                    ))}
                  </select>
                </div>
                <ChoiceGroup
                  legend="In this year, the job lasted"
                  name="vac-coverage"
                  options={coverageOptions}
                  value={effectiveInput.coverage}
                  onChange={(coverage) => update({ coverage })}
                />
              </>
            )}
          </fieldset>

          <ChoiceGroup
            legend="Work week"
            name="vac-week"
            options={weekOptions}
            value={effectiveInput.week}
            onChange={(week) => update({ week })}
          />

          <fieldset className={ui.group}>
            <legend className={ui.legend}>Days actually worked</legend>
            <TextField
              label="How many days did you work this year?"
              hint={
                threshold
                  ? `Optional. Below ${threshold} work days the entitlement is prorated.`
                  : `Optional. In a full year the entitlement is prorated below ${FULL_YEAR_THRESHOLD} work days, in part of a year below ${PARTIAL_YEAR_THRESHOLD}.`
              }
              value={effectiveInput.daysWorked}
              error={errors.daysWorked}
              onChange={(daysWorked) => update({ daysWorked: daysWorked.replace(/\D/g, '') })}
            />
          </fieldset>

          <fieldset className={ui.group}>
            <legend className={ui.legend}>What applies at your workplace</legend>
            <label htmlFor={orderId} className={styles.check}>
              <input
                id={orderId}
                type="checkbox"
                className={ui.checkbox}
                checked={effectiveInput.orderApplies}
                aria-describedby={orderHintId}
                onChange={(event) => update({ orderApplies: event.target.checked })}
              />
              <span>Shorter work week extension order</span>
            </label>
            <p id={orderHintId} className={ui.hint}>
              Applies to most employers. It does not apply at a workplace with fewer than 4 employees, at a government
              or municipal company, or where a collective agreement arranged the move to a 5-day week.
            </p>
            <label htmlFor={agencyId} className={styles.check}>
              <input
                id={agencyId}
                type="checkbox"
                className={ui.checkbox}
                checked={effectiveInput.agency}
                onChange={(event) => update({ agency: event.target.checked })}
              />
              <span>Employed through a staffing agency</span>
            </label>
          </fieldset>
        </form>

        <div className={ui.output}>
          <div className={ui.sticky}>
            <h2 className={ui.outputTitle}>Result</h2>
            <ResultCard result={result} message={message} />
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
              An estimate under the Annual Leave Law, 1951, and the extension order, as published by the Ministry of
              Labor. A collective agreement, industry extension order or personal contract can give more days. The
              calculation runs in your browser and nothing is sent anywhere.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
