'use client'

import { useId, useMemo, useState } from 'react'
import {
  EXEMPTION_CEILING_PER_YEAR,
  EXEMPTION_CEILING_YEAR,
  calculateSeverance,
  defaultInput,
  fieldErrors,
  formatYears,
  type Section14,
  type SeveranceInput,
  type SeveranceOutcome,
  type SeveranceResult,
} from '@/lib/severance-pay'
import ui from '../../../../(he)/(site)/components/tools/toolUi.module.css'
import styles from '../../../../(he)/(site)/components/tools/SeverancePayCalculator.module.css'
import { EnField, EnOutput, useAnnouncement, useCopyResult } from './EnCalcParts'
import { INVALID_MESSAGE, enDate, enTenure, ils } from './en-format'

const section14Options: { value: Section14; label: string; hint: string }[] = [
  { value: 'none', label: 'No Section 14 arrangement', hint: 'The employer pays pitzuim at the end' },
  { value: 'full', label: 'Section 14 from day one', hint: 'Pension deposits replace pitzuim' },
]

const tenureOf = (result: SeveranceResult) => enTenure(result.tenure.months, result.tenure.extraDays)

const announcementFor = (outcome: SeveranceOutcome) => {
  if (outcome.kind !== 'result') return ''
  if (!outcome.eligibleBySeniority) return 'Under one year: no statutory severance pay.'
  return `Severance pay: ${ils(outcome.severance)}, for ${tenureOf(outcome)}.`
}

const resultText = (result: SeveranceResult) =>
  [
    `Israel severance pay: ${tenureOf(result)} (${formatYears(result.tenure.years)} years), ${enDate(result.startDay)} to ${enDate(result.endDay)}`,
    `Last monthly salary: ${ils(result.salary)}`,
    result.eligibleBySeniority
      ? `Severance pay under the law: ${ils(result.severance)}${result.section14 === 'full' ? ', covered by Section 14 deposits' : ''}`
      : 'Under one year with this employer: no statutory severance pay unless an agreement or custom gives it.',
    ...(result.exempt !== null && result.taxable !== null
      ? [`Tax-exempt up to ${ils(result.exempt)}, taxable ${ils(result.taxable)}`]
      : []),
    'Estimate under the Severance Pay Law, 1963. Not legal advice.',
    'https://www.aiterra.co.il/en/tools/severance-pay-calculator',
  ].join('\n')

function ResultCard({ outcome }: { outcome: SeveranceOutcome }) {
  if (outcome.kind !== 'result') {
    return (
      <div className={styles.card}>
        <p className={styles.message}>
          {outcome.kind === 'invalid' ? INVALID_MESSAGE : 'Enter the start date, end date and last monthly salary.'}
        </p>
      </div>
    )
  }
  return (
    <div className={styles.card}>
      <p className={styles.kicker}>
        Seniority: {tenureOf(outcome)} ({formatYears(outcome.tenure.years)} years)
      </p>
      {outcome.eligibleBySeniority ? (
        <>
          <p className={styles.answer}>{ils(outcome.severance)}</p>
          <p className={styles.basis}>
            {enDate(outcome.startDay)} to {enDate(outcome.endDay)}, last salary {ils(outcome.salary)}
          </p>
          <dl className={styles.facts}>
            <div className={styles.fact}>
              <dt>Formula</dt>
              <dd>
                {ils(outcome.salary)} × {formatYears(outcome.tenure.years)}
              </dd>
            </div>
            {outcome.exempt !== null ? (
              <div className={styles.fact}>
                <dt>Tax-exempt up to</dt>
                <dd>{ils(outcome.exempt)}</dd>
              </div>
            ) : null}
          </dl>
          {outcome.exempt !== null && outcome.taxable !== null ? (
            <p className={styles.insight}>
              The {EXEMPTION_CEILING_YEAR} exemption ceiling is {ils(EXEMPTION_CEILING_PER_YEAR)} per year of work.{' '}
              {outcome.taxable > 0
                ? `The part above it, ${ils(outcome.taxable)}, is taxable.`
                : 'This whole amount is under the ceiling.'}
            </p>
          ) : (
            <p className={styles.insight}>
              The ceiling we checked is for {EXEMPTION_CEILING_YEAR}. For an end date in another year, check that
              year&apos;s ceiling on the Israel Tax Authority site.
            </p>
          )}
          {outcome.section14 === 'full' ? (
            <p className={styles.insight}>
              Under a full Section 14 arrangement, the deposits made during your employment replace payment at the end.
              The amount above is the comparison to statutory pitzuim: if deposits covered your full salary from the
              start, no further severance is due.
            </p>
          ) : null}
        </>
      ) : (
        <p className={styles.message}>
          By law, severance pay usually requires at least one year with the same employer. An agreement, a personal
          contract or workplace custom can give it earlier.
        </p>
      )}
    </div>
  )
}

export default function SeverancePayCalculatorEn() {
  const [input, setInput] = useState<SeveranceInput>(defaultInput)
  const id = useId()
  const { status, setStatus, copy } = useCopyResult('severance_pay_copy')
  const errors = fieldErrors(input)
  const outcome = useMemo(() => calculateSeverance(input), [input])
  const announcement = useAnnouncement(announcementFor(outcome))

  const update = (patch: Partial<SeveranceInput>) => {
    setInput((current) => ({ ...current, ...patch }))
    setStatus('')
  }

  return (
    <section className={`${ui.tool} ${styles.calc}`} aria-label="Israel severance pay calculator">
      <div className={`${ui.inner} ${styles.layout}`}>
        <form className={ui.form} onSubmit={(event) => event.preventDefault()}>
          <fieldset className={ui.group}>
            <legend className={ui.legend}>Employment period</legend>
            <div className={styles.row}>
              <EnField
                id={`${id}-start`}
                type="date"
                label="Start date"
                styles={styles}
                value={input.start}
                error={errors.start ? 'Enter a valid date.' : undefined}
                onChange={(start) => update({ start })}
              />
              <EnField
                id={`${id}-end`}
                type="date"
                label="End date"
                styles={styles}
                value={input.end}
                error={errors.end ? 'Enter a valid date on or after the start date.' : undefined}
                onChange={(end) => update({ end })}
              />
            </div>
          </fieldset>
          <fieldset className={ui.group}>
            <legend className={ui.legend}>Salary</legend>
            <EnField
              id={`${id}-salary`}
              label="Last monthly gross salary (₪)"
              hint="Include fixed additions. For a variable salary, enter a monthly average."
              styles={styles}
              value={input.salary}
              error={errors.salary ? 'Enter a positive amount up to ₪1,000,000.' : undefined}
              onChange={(salary) => update({ salary })}
            />
          </fieldset>
          <fieldset className={ui.group}>
            <legend className={ui.legend}>Pension deposits</legend>
            <div className={styles.choices}>
              {section14Options.map((option) => (
                <label key={option.value} className={styles.choice}>
                  <input
                    type="radio"
                    name={`${id}-section14`}
                    value={option.value}
                    className={ui.checkbox}
                    checked={input.section14 === option.value}
                    onChange={() => update({ section14: option.value })}
                  />
                  <span className={styles.choiceText}>
                    <span className={styles.choiceLabel}>{option.label}</span>
                    <span className={styles.choiceHint}>{option.hint}</span>
                  </span>
                </label>
              ))}
            </div>
          </fieldset>
        </form>
        <EnOutput
          styles={styles}
          status={status}
          announcement={announcement}
          note="Estimate under the Severance Pay Law, 1963: one last monthly salary per year of work, prorated for a partial year. A collective agreement or personal contract can give more. Calculated in your browser; nothing is sent anywhere."
          onCopy={() => copy(outcome.kind === 'result' ? resultText(outcome) : null)}
        >
          <ResultCard outcome={outcome} />
        </EnOutput>
      </div>
    </section>
  )
}
