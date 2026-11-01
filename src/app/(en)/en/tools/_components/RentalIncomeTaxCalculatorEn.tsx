'use client'

import { useId, useMemo, useState } from 'react'
import {
  CEILING,
  SURTAX_THRESHOLD,
  calculateRental,
  emptyRentalInput,
  rentalErrors,
  type RentalInput,
  type RentalOutcome,
  type RentalResult,
} from '@/lib/rental-income-tax'
import ui from '../../../../(he)/(site)/components/tools/toolUi.module.css'
import styles from '../../../../(he)/(site)/components/tools/RecuperationPayCalculator.module.css'
import { EnField, EnOutput, useAnnouncement, useCopyResult } from './EnCalcParts'
import { INVALID_MESSAGE, ils, rentalTrackName } from './en-format'

const bestTax = (result: RentalResult) => result.tracks.find((track) => track.id === result.best)?.tax ?? 0

const announcementFor = (outcome: RentalOutcome) =>
  outcome.kind === 'result' ? `${rentalTrackName[outcome.best]}: tax ${ils(bestTax(outcome))} a year.` : ''

const resultText = (result: RentalResult) =>
  [
    'Israel rental income tax 2026',
    `Rent: ${ils(result.rent)} a month × ${result.months} months = ${ils(result.gross)}`,
    `Exempt part per month: ${ils(result.exemptMonthly)} (ceiling ${ils(CEILING)})`,
    ...result.tracks.map((track) => `${rentalTrackName[track.id]}: tax ${ils(track.tax)} a year`),
    `Cheapest on these figures: ${rentalTrackName[result.best]}`,
    'General information, not tax advice. Excludes credit points and surtax.',
    'https://www.aiterra.co.il/en/tools/rental-income-tax-calculator',
  ].join('\n')

function ResultCard({ outcome }: { outcome: RentalOutcome }) {
  if (outcome.kind !== 'result') {
    return (
      <div className={styles.card}>
        <p className={styles.message}>
          {outcome.kind === 'invalid' ? INVALID_MESSAGE : 'Enter the monthly rent and the months rented.'}
        </p>
      </div>
    )
  }
  return (
    <div className={styles.card}>
      <p className={styles.kicker}>Lowest tax: {rentalTrackName[outcome.best]}</p>
      <p className={styles.answer}>{ils(bestTax(outcome))} a year</p>
      <dl className={styles.lines}>
        {outcome.tracks.map((track) => (
          <div key={track.id} className={styles.line}>
            <dt>
              {rentalTrackName[track.id]}
              {track.id === outcome.best ? ' (cheapest)' : ''}
            </dt>
            <dd>{ils(track.tax)}</dd>
          </div>
        ))}
        <div className={styles.line}>
          <dt>Rent per year</dt>
          <dd>{ils(outcome.gross)}</dd>
        </div>
        <div className={styles.line}>
          <dt>Exempt part per month, exemption track</dt>
          <dd>{ils(outcome.exemptMonthly)}</dd>
        </div>
      </dl>
      {outcome.surtax ? (
        <p className={styles.insight}>
          Total income is above {ils(SURTAX_THRESHOLD)} a year. Surtax applies above that amount and is not calculated
          here, so tax on the exemption and regular tracks is higher than shown.
        </p>
      ) : null}
      {outcome.rent > CEILING ? (
        <p className={styles.insight}>
          The rent is above the {ils(CEILING)} ceiling, so every shekel over it takes a shekel off the exemption.
        </p>
      ) : null}
    </div>
  )
}

export default function RentalIncomeTaxCalculatorEn() {
  const [input, setInput] = useState<RentalInput>(emptyRentalInput)
  const id = useId()
  const { status, setStatus, copy } = useCopyResult('rental_tax_calc')
  const errors = rentalErrors(input)
  const outcome = useMemo(() => calculateRental(input), [input])
  const announcement = useAnnouncement(announcementFor(outcome))

  const update = (patch: Partial<RentalInput>) => {
    setInput((current) => ({ ...current, ...patch }))
    setStatus('')
  }

  return (
    <section className={`${ui.tool} ${styles.calc}`} aria-label="Israel rental income tax comparison">
      <div className={`${ui.inner} ${styles.layout}`}>
        <form className={ui.form} onSubmit={(event) => event.preventDefault()}>
          <fieldset className={ui.group}>
            <legend className={ui.legend}>The rent</legend>
            <div className={styles.pair}>
              <EnField
                id={`${id}-rent`}
                label="Monthly rent (₪)"
                hint="From all residential units of you, your spouse and children under 18 together."
                styles={styles}
                value={input.rent}
                error={errors.rent ? 'Enter an amount in digits, for example 6500.' : undefined}
                onChange={(rent) => update({ rent })}
              />
              <EnField
                id={`${id}-months`}
                label="Months rented per year"
                styles={styles}
                value={input.months}
                error={errors.months ? 'Enter a whole number from 1 to 12.' : undefined}
                onChange={(months) => update({ months })}
              />
            </div>
          </fieldset>
          <fieldset className={ui.group}>
            <legend className={ui.legend}>For the regular track</legend>
            <EnField
              id={`${id}-expenses`}
              label="Expenses and depreciation per year (₪)"
              hint="For example mortgage interest, repairs and depreciation. Counted only on the regular track."
              styles={styles}
              value={input.expenses}
              error={errors.expenses ? 'Enter an amount in digits, or leave empty.' : undefined}
              onChange={(expenses) => update({ expenses })}
            />
            <EnField
              id={`${id}-other`}
              label="Other taxable income per year (₪)"
              hint="Salary or business income before tax. It sets the bracket your rent falls in."
              styles={styles}
              value={input.otherIncome}
              error={errors.otherIncome ? 'Enter an amount in digits, or leave empty.' : undefined}
              onChange={(otherIncome) => update({ otherIncome })}
            />
            <label className={ui.option}>
              <input
                type="checkbox"
                className={ui.checkbox}
                checked={input.senior}
                onChange={(event) => update({ senior: event.target.checked })}
              />
              <span>I am 60 or older</span>
            </label>
          </fieldset>
        </form>
        <EnOutput
          title="Track comparison"
          styles={styles}
          status={status}
          announcement={announcement}
          note="General information, not tax advice. Uses 2026 brackets, without credit points or surtax. Calculated in your browser; nothing is sent anywhere."
          onCopy={() => copy(outcome.kind === 'result' ? resultText(outcome) : null)}
        >
          <ResultCard outcome={outcome} />
        </EnOutput>
      </div>
    </section>
  )
}
