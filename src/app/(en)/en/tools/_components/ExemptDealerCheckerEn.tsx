'use client'

import { useId, useMemo, useState } from 'react'
import {
  THRESHOLD,
  THRESHOLD_YEAR,
  calculateExemptDealer,
  emptyExemptDealerInput,
  exemptDealerErrors,
  type ExemptDealerInput,
  type ExemptDealerOutcome,
  type ExemptDealerResult,
} from '@/lib/exempt-dealer'
import ui from '../../../../(he)/(site)/components/tools/toolUi.module.css'
import styles from '../../../../(he)/(site)/components/tools/RecuperationPayCalculator.module.css'
import { EnField, EnOutput, useAnnouncement, useCopyResult } from './EnCalcParts'
import { INVALID_MESSAGE, ils } from './en-format'

const monthNames = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
]

const monthOf = (month: number) => monthNames[month - 1]

const announcementFor = (outcome: ExemptDealerOutcome) => {
  if (outcome.kind !== 'result') return ''
  return outcome.crossed
    ? `Turnover is ${ils(-outcome.remaining)} over the ceiling.`
    : `${ils(outcome.remaining)} left to the ceiling.`
}

const resultText = (result: ExemptDealerResult) =>
  [
    `Osek patur ceiling ${THRESHOLD_YEAR}: ${ils(THRESHOLD)}`,
    `Turnover January to ${monthOf(result.month)}: ${ils(result.turnover)}`,
    result.crossed ? `Over the ceiling by ${ils(-result.remaining)}` : `Left to the ceiling: ${ils(result.remaining)}`,
    ...(!result.crossed && result.crossingMonth
      ? [`At ${ils(result.monthly)} a month, the ceiling is crossed in ${monthOf(result.crossingMonth)}`]
      : []),
    ...(!result.crossed && !result.crossingMonth ? [`Year-end forecast: ${ils(result.yearEnd)}`] : []),
    'https://www.aiterra.co.il/en/tools/exempt-dealer-threshold',
  ].join('\n')

function ResultCard({ outcome }: { outcome: ExemptDealerOutcome }) {
  if (outcome.kind !== 'result') {
    return (
      <div className={styles.card}>
        <p className={styles.message}>
          {outcome.kind === 'invalid' ? INVALID_MESSAGE : 'Enter your turnover this year and choose the month.'}
        </p>
      </div>
    )
  }
  return (
    <div className={styles.card}>
      <p className={styles.kicker}>{outcome.crossed ? 'Over the ceiling by' : 'Left to the ceiling'}</p>
      <p className={styles.answer}>{ils(Math.abs(outcome.remaining))}</p>
      <dl className={styles.lines}>
        <div className={styles.line}>
          <dt>Osek patur ceiling {THRESHOLD_YEAR}</dt>
          <dd>{ils(THRESHOLD)}</dd>
        </div>
        <div className={styles.line}>
          <dt>Turnover January to {monthOf(outcome.month)}</dt>
          <dd>{ils(outcome.turnover)}</dd>
        </div>
        {outcome.allowedPerMonth !== null ? (
          <div className={styles.line}>
            <dt>Average you can still earn to year end</dt>
            <dd>{ils(outcome.allowedPerMonth)} a month</dd>
          </div>
        ) : null}
        {!outcome.crossed && outcome.month < 12 ? (
          <div className={styles.line}>
            <dt>Year-end forecast at {ils(outcome.monthly)} a month</dt>
            <dd>{ils(outcome.yearEnd)}</dd>
          </div>
        ) : null}
      </dl>
      <p className={styles.insight}>
        {outcome.crossed
          ? `Turnover above ${ils(THRESHOLD)} a year no longer meets the osek patur definition in Section 1 of the VAT Law. Contact the VAT office or an accountant to move to osek murshe and find out from when you owe VAT.`
          : outcome.crossingMonth
            ? `At this pace, turnover crosses the ceiling in ${monthOf(outcome.crossingMonth)}. Prepare for the move to osek murshe in advance.`
            : `At this pace, turnover stays under the ceiling through the end of ${THRESHOLD_YEAR}.`}
      </p>
    </div>
  )
}

export default function ExemptDealerCheckerEn() {
  const [input, setInput] = useState<ExemptDealerInput>(emptyExemptDealerInput)
  const id = useId()
  const { status, setStatus, copy } = useCopyResult('exempt_dealer_check')
  const errors = exemptDealerErrors(input)
  const outcome = useMemo(() => calculateExemptDealer(input), [input])
  const announcement = useAnnouncement(announcementFor(outcome))

  const update = (patch: Partial<ExemptDealerInput>) => {
    setInput((current) => ({ ...current, ...patch }))
    setStatus('')
  }

  return (
    <section className={`${ui.tool} ${styles.calc}`} aria-label="Osek patur ceiling check">
      <div className={`${ui.inner} ${styles.layout}`}>
        <form className={ui.form} onSubmit={(event) => event.preventDefault()}>
          <fieldset className={ui.group}>
            <legend className={ui.legend}>This year&apos;s turnover</legend>
            <EnField
              id={`${id}-turnover`}
              label="Turnover since January (₪)"
              hint="All income from all your businesses, by receipts, before expenses."
              styles={styles}
              value={input.turnover}
              error={errors.turnover ? 'Enter an amount in digits, for example 85000.' : undefined}
              onChange={(turnover) => update({ turnover })}
            />
            <div className={ui.field}>
              <label htmlFor={`${id}-month`} className={ui.label}>
                Turnover covers January to the end of
              </label>
              <select
                id={`${id}-month`}
                className={`${ui.input} ${styles.select}`}
                value={input.month}
                onChange={(event) => update({ month: event.target.value })}
              >
                <option value="">Choose</option>
                {monthNames.map((name, index) => (
                  <option key={name} value={String(index + 1)}>
                    {name}
                  </option>
                ))}
              </select>
            </div>
          </fieldset>
          <fieldset className={ui.group}>
            <legend className={ui.legend}>Forecast</legend>
            <EnField
              id={`${id}-monthly`}
              label="Expected income each remaining month (₪)"
              hint="Leave empty to use your monthly average so far."
              styles={styles}
              value={input.monthly}
              error={errors.monthly ? 'Enter an amount in digits, or leave empty.' : undefined}
              onChange={(monthly) => update({ monthly })}
            />
          </fieldset>
        </form>
        <EnOutput
          styles={styles}
          status={status}
          announcement={announcement}
          note={`The ${THRESHOLD_YEAR} ceiling per the Israel Tax Authority. The forecast is an estimate from the pace you entered. Calculated in your browser; nothing is sent anywhere.`}
          onCopy={() => copy(outcome.kind === 'result' ? resultText(outcome) : null)}
        >
          <ResultCard outcome={outcome} />
        </EnOutput>
      </div>
    </section>
  )
}
