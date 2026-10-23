'use client'

import { useEffect, useId, useMemo, useRef, useState } from 'react'
import { Copy } from 'lucide-react'
import {
  CURRENT_PERIOD,
  MAX_DAYS,
  MAX_HOURS,
  ageGroups,
  calculateMinimumWage,
  defaultInput,
  isYouth,
  type AgeGroup,
  type MinimumWageInput,
  type MinimumWageResult,
  type PayBasis,
  type WagePeriodId,
  type WorkWeek,
} from '@/lib/minimum-wage'
import { parseHundredths } from '@/lib/vat-calculator'
import ui from '../../../../(he)/(site)/components/tools/toolUi.module.css'
import styles from '../../../../(he)/(site)/components/tools/MinimumWageCalculator.module.css'

const ANNOUNCE_DELAY_MS = 900

type Option<T extends string> = { value: T; label: string; hint?: string }

type Errors = { scope?: string; hours?: string; days?: string; paid?: string }

const moneyFormat = new Intl.NumberFormat('en-IL', {
  style: 'currency',
  currency: 'ILS',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})
const countFormat = new Intl.NumberFormat('en-IL', { maximumFractionDigits: 2 })

const money = (agorot: number) => moneyFormat.format(agorot / 100)
const count = (hundredths: number) => countFormat.format(hundredths / 100)
const percent = (hundredths: number) => `${countFormat.format(hundredths / 100)}%`

const ageLabels: Record<AgeGroup, string> = {
  adult: 'Age 18 and over',
  age17: 'Age 17',
  age16: 'Age 16',
  under16: 'Under 16',
  apprentice: 'Apprentice (Apprenticeship Law)',
}

const periodLabels: Record<WagePeriodId, string> = {
  '2026': 'from 1 April 2026',
  '2025': '1 April 2025 to 31 March 2026',
}

const unitLabels: Record<PayBasis, string> = { monthly: 'per month', hourly: 'per hour', daily: 'per day' }

const quantityLabels: Record<PayBasis, string> = { monthly: '', hourly: 'hours', daily: 'days' }

const periodOptions: Option<WagePeriodId>[] = [
  { value: '2026', label: 'From 1 April 2026', hint: 'The rate in force today' },
  { value: '2025', label: 'Until 31 March 2026', hint: 'To check pay already received' },
]

const ageOptions: Option<AgeGroup>[] = ageGroups.map((group) => ({
  value: group.id,
  label: ageLabels[group.id],
  hint: group.percent === 100 ? 'Full minimum wage' : `${group.percent}% of the minimum wage`,
}))

const basisOptions = (age: AgeGroup): Option<PayBasis>[] => [
  { value: 'monthly', label: 'Monthly salary' },
  { value: 'hourly', label: 'Hourly pay' },
  ...(isYouth(age) ? [] : [{ value: 'daily' as const, label: 'Daily pay' }]),
]

const weekOptions: Option<WorkWeek>[] = [
  { value: '5', label: '5-day week' },
  { value: '6', label: '6-day week' },
]

const paidLabel = (basis: PayBasis) => {
  if (basis === 'hourly') return 'Pay you received per hour'
  if (basis === 'daily') return 'Pay you received per day'
  return 'Monthly salary you received'
}

const paidHint = (basis: PayBasis, age: AgeGroup) => {
  if (basis !== 'monthly') return 'Gross, per regular hour or day, without extras. Optional.'
  const counted = isYouth(age) ? 'basic salary' : 'basic salary and fixed supplements'
  return `Gross: ${counted}, without overtime, seniority, family and shift supplements, bonuses, a 13th salary or expense refunds. Optional.`
}

const validate = (input: MinimumWageInput, basis: PayBasis): Errors => {
  const errors: Errors = {}
  if (basis === 'monthly') {
    const scope = parseHundredths(input.scope)
    if (!input.scope.trim()) errors.scope = 'Enter the job scope in percent, for example 100 or 50.'
    else if (!scope.ok || scope.hundredths <= 0 || scope.hundredths > 10000)
      errors.scope = 'Job scope is a number between 1 and 100.'
  }
  const optional = (value: string, max: number, label: string) => {
    if (!value.trim()) return undefined
    const parsed = parseHundredths(value)
    return !parsed.ok || parsed.hundredths <= 0 || parsed.hundredths > max * 100
      ? `${label} must be a number between 1 and ${max}.`
      : undefined
  }
  if (basis === 'hourly') errors.hours = optional(input.hours, MAX_HOURS, 'Hours')
  if (basis === 'daily') errors.days = optional(input.days, MAX_DAYS, 'Days')
  if (input.paid.trim()) {
    const paid = parseHundredths(input.paid)
    if (!paid.ok) errors.paid = 'Enter an amount in digits, for example 6500 or 35.5.'
    else if (paid.hundredths > 100_000_000) errors.paid = 'The amount is too large.'
  }
  return errors
}

const hasErrors = (errors: Errors) => Boolean(errors.scope || errors.hours || errors.days || errors.paid)

const resultText = (result: MinimumWageResult) => {
  const unit = unitLabels[result.basis]
  const lines = [
    `Israeli minimum wage ${periodLabels[result.period.id]}, ${ageLabels[result.age.id]}`,
    `Minimum wage ${unit}: ${money(result.minimum)}`,
  ]
  if (result.scopeHundredths !== null && result.scopeHundredths !== 10000) {
    lines.push(`Job scope: ${percent(result.scopeHundredths)} (full time: ${money(result.fullMonthly)})`)
  }
  if (result.quantity) {
    lines.push(`${count(result.quantity.count)} ${quantityLabels[result.basis]}: at least ${money(result.quantity.total)}`)
  }
  if (result.check) {
    lines.push(
      result.check.meets
        ? `Pay received, ${money(result.check.paid)} ${unit}, is not below the minimum wage`
        : `Pay received, ${money(result.check.paid)} ${unit}, is ${money(result.check.gap)} below the minimum wage`,
    )
    if (result.check.totalGap !== null) lines.push(`Shortfall for the period: ${money(result.check.totalGap)}`)
  }
  lines.push('Estimate based on the Minimum Wage Law and National Insurance and Ministry of Labor figures. Not legal advice.')
  lines.push('https://www.aiterra.co.il/en/tools/minimum-wage-2026')
  return lines.join('\n')
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

const announcementFor = (result: MinimumWageResult | null) => {
  if (!result) return ''
  const unit = unitLabels[result.basis]
  const base = `Minimum wage ${unit}: ${money(result.minimum)}.`
  if (!result.check) return base
  return result.check.meets
    ? `${base} The pay received is not below the minimum wage.`
    : `${base} The pay received is ${money(result.check.gap)} ${unit} below it.`
}

function CheckBlock({ result }: { result: MinimumWageResult }) {
  const { check } = result
  if (!check) return null
  const unit = unitLabels[result.basis]
  if (check.meets) {
    return (
      <p className={`${styles.verdict} ${styles.verdictOk}`}>
        <strong>The pay meets the minimum wage.</strong> {money(check.paid)} {unit} is not below {money(result.minimum)}.
      </p>
    )
  }
  return (
    <div className={`${styles.verdict} ${styles.verdictLow}`}>
      <p>
        <strong>The pay is below the minimum wage</strong> by {money(check.gap)} {unit}.
      </p>
      {check.totalGap !== null && result.quantity ? (
        <p>
          Over {count(result.quantity.count)} {quantityLabels[result.basis]} the shortfall is {money(check.totalGap)}.
        </p>
      ) : null}
    </div>
  )
}

function ResultCard({ result }: { result: MinimumWageResult | null }) {
  if (!result) {
    return (
      <div className={styles.card}>
        <p className={styles.message}>To see the result, fix the field with the error message below it.</p>
      </div>
    )
  }
  const unit = unitLabels[result.basis]
  const partScope = result.scopeHundredths !== null && result.scopeHundredths !== 10000
  const facts = [
    partScope || result.basis !== 'monthly' ? { term: 'Per month, full time', value: money(result.fullMonthly) } : null,
    result.lawHourly !== null ? { term: 'By the 186 hours in the law', value: money(result.lawHourly) } : null,
    result.quantity
      ? {
          term: `At least, for ${count(result.quantity.count)} ${quantityLabels[result.basis]}`,
          value: money(result.quantity.total),
        }
      : null,
  ].filter((fact): fact is { term: string; value: string } => fact !== null)

  return (
    <div className={styles.card}>
      <p className={styles.kicker}>
        Minimum wage {unit}
        {partScope && result.scopeHundredths !== null ? `, ${percent(result.scopeHundredths)} job` : ''}
      </p>
      <p className={styles.answer}>{money(result.minimum)}</p>
      <p className={styles.basis}>
        {ageLabels[result.age.id]}, {periodLabels[result.period.id]}
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
      <CheckBlock result={result} />
      {result.lawHourly !== null ? (
        <p className={styles.insight}>
          The law divides by 186 hours, but the extension order shortening the work week sets 182 hours a month, so the
          hourly minimum wage is {money(result.minimum)}.
        </p>
      ) : null}
      {isYouth(result.age.id) && result.basis === 'hourly' ? (
        <p className={styles.insight}>For youth and apprentices, the hourly rate is 1/173 of their monthly rate.</p>
      ) : null}
      {result.period.id === CURRENT_PERIOD ? (
        <p className={styles.insight}>The amounts are updated every year on 1 April. The next update is expected on 1 April 2027.</p>
      ) : (
        <p className={styles.insight}>These are the amounts in force from 1 April 2025 to 31 March 2026.</p>
      )}
    </div>
  )
}

export default function MinimumWageCalculatorEn() {
  const [input, setInput] = useState<MinimumWageInput>(defaultInput)
  const [status, setStatus] = useState('')
  const [announcement, setAnnouncement] = useState('')
  const basis: PayBasis = input.basis === 'daily' && isYouth(input.age) ? 'monthly' : input.basis
  const errors = validate(input, basis)
  const invalid = hasErrors(errors)
  const result = useMemo(() => {
    if (invalid) return null
    const outcome = calculateMinimumWage(input)
    return outcome.kind === 'result' ? outcome : null
  }, [input, invalid])
  const spoken = announcementFor(result)
  const lastSpoken = useRef(spoken)

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
    if (!result) {
      setStatus('Fix the fields to copy the result.')
      return
    }
    try {
      await navigator.clipboard.writeText(resultText(result))
      setStatus('Result copied')
      window.gtag?.('event', 'minimum_wage_copy', { basis: result.basis, age_group: result.age.id, locale: 'en' })
    } catch {
      setStatus('Copying failed. Select the result and copy it manually.')
    }
  }

  return (
    <section className={`${ui.tool} ${styles.calc}`} aria-label="Israel minimum wage calculator">
      <div className={`${ui.inner} ${styles.layout}`}>
        <form className={ui.form} onSubmit={(event) => event.preventDefault()}>
          <ChoiceGroup
            legend="Period"
            name="mw-period"
            options={periodOptions}
            value={input.period}
            onChange={(period) => update({ period })}
          />
          <ChoiceGroup
            legend="Employee age"
            name="mw-age"
            options={ageOptions}
            value={input.age}
            onChange={(age) => update({ age })}
            wide
          />
          <ChoiceGroup
            legend="How is the pay set?"
            name="mw-basis"
            options={basisOptions(input.age)}
            value={basis}
            onChange={(next) => update({ basis: next })}
          />

          <fieldset className={ui.group}>
            <legend className={ui.legend}>Work details</legend>
            {basis === 'monthly' ? (
              <NumberField
                label="Job scope"
                hint="Full time is 100. In a half-time job the minimum wage is half."
                value={input.scope}
                error={errors.scope}
                suffix="%"
                onChange={(scope) => update({ scope })}
              />
            ) : null}
            {basis === 'hourly' ? (
              <NumberField
                label="Hours worked in the month"
                hint={`Optional. Up to ${MAX_HOURS} hours. Shows the minimum pay for the whole month.`}
                value={input.hours}
                error={errors.hours}
                onChange={(hours) => update({ hours })}
              />
            ) : null}
            {basis === 'daily' ? (
              <>
                <ChoiceGroup
                  legend="Work week at the workplace"
                  name="mw-week"
                  options={weekOptions}
                  value={input.week}
                  onChange={(week) => update({ week })}
                />
                <NumberField
                  label="Days worked in the month"
                  hint={`Optional. Up to ${MAX_DAYS} days.`}
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
            <h2 className={ui.outputTitle}>Result</h2>
            <ResultCard result={result} />
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
              An estimate based on the Minimum Wage Law, 1987, and National Insurance and Ministry of Labor figures. A
              collective agreement or an industry extension order can set higher pay. The calculation runs in your
              browser and nothing is sent anywhere.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
