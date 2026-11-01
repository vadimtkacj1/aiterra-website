'use client'

import { useId, useMemo, useState } from 'react'
import {
  DAY_RATE_TEXT,
  RECUPERATION_YEAR,
  amountExpression,
  calculateRecuperation,
  daysExpression,
  emptyRecuperationInput,
  formatDays,
  recuperationErrors,
  yearOptions,
  type RecuperationInput,
  type RecuperationOutcome,
  type RecuperationResult,
  type Sector,
} from '@/lib/recuperation-pay'
import ui from '../../../../(he)/(site)/components/tools/toolUi.module.css'
import styles from '../../../../(he)/(site)/components/tools/RecuperationPayCalculator.module.css'
import { EnField, EnOutput, useAnnouncement, useCopyResult } from './EnCalcParts'
import { INVALID_MESSAGE, ilsFromAgorot } from './en-format'

const sectorOptions: { value: Sector; label: string; hint: string }[] = [
  { value: 'private', label: 'Private sector', hint: 'General extension order' },
  { value: 'public', label: 'Public service', hint: 'Public sector agreements' },
  { value: 'branch', label: 'Sector with its own terms', hint: 'Security, cleaning, event halls and others' },
]

const ordinal = (year: number) => {
  const tens = year % 100
  if (tens >= 11 && tens <= 13) return `${year}th`
  return `${year}${['th', 'st', 'nd', 'rd'][year % 10] ?? 'th'}`
}

const yearName = (year: number) => (year >= 20 ? '20th year and later' : `${ordinal(year)} year`)

const messageFor = (outcome: Exclude<RecuperationOutcome, RecuperationResult>) => {
  if (outcome.kind === 'invalid') return INVALID_MESSAGE
  if (outcome.kind === 'incomplete') return 'Choose the year of work and fill in the remaining fields.'
  if (outcome.kind === 'not-eligible') {
    return 'Dmei havraa start only after a full first year with the employer. When that year ends, 5 days are paid for it. Someone who leaves before completing a year is not entitled under the general extension order.'
  }
  return outcome.sector === 'public'
    ? 'The general extension order does not cover employees paid under public service collective agreements or linked to them. Their days and rate come from those agreements, so this calculator does not compute them.'
    : 'Sectors with a collective agreement or a sector extension order, such as security, cleaning and event halls, have different days and rates. Check the current agreement for your sector.'
}

const announcementFor = (outcome: RecuperationOutcome) =>
  outcome.kind === 'result'
    ? `Recuperation pay: ${ilsFromAgorot(outcome.amount)}, ${formatDays(outcome.days)} days.`
    : ''

const resultText = (result: RecuperationResult) =>
  [
    `Israel recuperation pay (dmei havraa) ${RECUPERATION_YEAR}`,
    `Year of work: ${yearName(result.year)} (${result.tableDays} days by seniority)`,
    `Days: ${daysExpression(result)}`,
    `Rate per day: ${ilsFromAgorot(result.rate)}`,
    `Recuperation pay: ${ilsFromAgorot(result.amount)}`,
    ...(result.topUp !== null ? [`Top-up if paid at ₪418 a day: ${ilsFromAgorot(result.topUp)}`] : []),
    'Private sector, under the extension order published 18 August 2026.',
    'https://www.aiterra.co.il/en/tools/recuperation-pay-calculator',
  ].join('\n')

function ResultCard({ outcome }: { outcome: RecuperationOutcome }) {
  if (outcome.kind !== 'result') {
    return (
      <div className={styles.card}>
        <p className={styles.message}>{messageFor(outcome)}</p>
      </div>
    )
  }
  return (
    <div className={styles.card}>
      <p className={styles.kicker}>Recuperation pay for the {yearName(outcome.year)}</p>
      <p className={styles.answer}>{ilsFromAgorot(outcome.amount)}</p>
      <dl className={styles.lines}>
        <div className={styles.line}>
          <dt>Recuperation days</dt>
          <dd>{daysExpression(outcome)}</dd>
        </div>
        <div className={styles.line}>
          <dt>Amount</dt>
          <dd>{amountExpression(outcome)}</dd>
        </div>
      </dl>
      {outcome.topUp !== null ? (
        <p className={styles.insight}>
          The order applies retroactively. If {RECUPERATION_YEAR} pay was already made at ₪418 a day, the top-up is{' '}
          <strong>{ilsFromAgorot(outcome.topUp)}</strong>.
        </p>
      ) : null}
      <p className={styles.insight}>
        Paid in one of the summer months, June to September, unless another date is agreed or customary. It can also be
        paid in parts with the monthly salary if the employment agreement says so.
      </p>
    </div>
  )
}

export default function RecuperationPayCalculatorEn() {
  const [input, setInput] = useState<RecuperationInput>(emptyRecuperationInput)
  const id = useId()
  const { status, setStatus, copy } = useCopyResult('recuperation_pay_calc')
  const errors = recuperationErrors(input)
  const outcome = useMemo(() => calculateRecuperation(input), [input])
  const announcement = useAnnouncement(announcementFor(outcome))

  const update = (patch: Partial<RecuperationInput>) => {
    setInput((current) => ({ ...current, ...patch }))
    setStatus('')
  }

  return (
    <section className={`${ui.tool} ${styles.calc}`} aria-label="Israel recuperation pay calculator">
      <div className={`${ui.inner} ${styles.layout}`}>
        <form className={ui.form} onSubmit={(event) => event.preventDefault()}>
          <fieldset className={ui.group}>
            <legend className={ui.legend}>Where you work</legend>
            <div className={styles.choices}>
              {sectorOptions.map((option) => (
                <label key={option.value} className={styles.choice}>
                  <input
                    type="radio"
                    name={`${id}-sector`}
                    value={option.value}
                    checked={input.sector === option.value}
                    onChange={() => update({ sector: option.value })}
                  />
                  <span>
                    {option.label}
                    <span className={styles.choiceHint}>{option.hint}</span>
                  </span>
                </label>
              ))}
            </div>
          </fieldset>
          {input.sector === 'private' ? (
            <>
              <fieldset className={ui.group}>
                <legend className={ui.legend}>Seniority and job size</legend>
                <div className={ui.field}>
                  <label htmlFor={`${id}-year`} className={ui.label}>
                    Year of work to calculate
                  </label>
                  <select
                    id={`${id}-year`}
                    className={`${ui.input} ${styles.select}`}
                    value={input.year}
                    aria-describedby={`${id}-year-hint`}
                    onChange={(event) => update({ year: event.target.value })}
                  >
                    <option value="">Choose</option>
                    {yearOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {yearName(Number(option.value))}
                      </option>
                    ))}
                  </select>
                  <p id={`${id}-year-hint`} className={ui.hint}>
                    Seniority with the same employer. Maternity leave counts; unpaid leave does not.
                  </p>
                </div>
                <div className={styles.pair}>
                  <EnField
                    id={`${id}-months`}
                    label="Months worked that year"
                    hint="Under 12 after unpaid leave or if the job ended."
                    styles={styles}
                    value={input.months}
                    error={errors.months ? 'Enter a whole number from 1 to 12.' : undefined}
                    onChange={(months) => update({ months: months.replace(/\s/g, '') })}
                  />
                  <EnField
                    id={`${id}-percent`}
                    label="Job percentage (%)"
                    styles={styles}
                    value={input.percent}
                    error={errors.percent ? 'Enter a percentage from 1 to 100.' : undefined}
                    onChange={(percent) => update({ percent: percent.replace(/\s/g, '') })}
                  />
                </div>
              </fieldset>
              <fieldset className={ui.group}>
                <legend className={ui.legend}>Rate per recuperation day</legend>
                <EnField
                  id={`${id}-rate`}
                  label="Amount per day (₪)"
                  hint={`₪${DAY_RATE_TEXT} for recuperation year ${RECUPERATION_YEAR}, under the extension order. Change it only if your contract sets more.`}
                  styles={styles}
                  value={input.rate}
                  error={errors.rate ? 'Enter an amount, for example 451.50.' : undefined}
                  onChange={(rate) => update({ rate: rate.replace(/\s/g, '') })}
                />
              </fieldset>
            </>
          ) : null}
        </form>
        <EnOutput
          styles={styles}
          status={status}
          announcement={announcement}
          note="Under the general extension order, which covers most private sector employees. A collective agreement, sector order or personal contract can give more. Calculated in your browser; nothing is sent anywhere."
          onCopy={() => copy(outcome.kind === 'result' ? resultText(outcome) : null)}
        >
          <ResultCard outcome={outcome} />
        </EnOutput>
      </div>
    </section>
  )
}
