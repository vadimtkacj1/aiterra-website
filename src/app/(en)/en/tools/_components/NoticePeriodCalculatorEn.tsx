'use client'

import { useId, useMemo, useState } from 'react'
import {
  calculateNotice,
  emptyNoticeInput,
  noticeErrors,
  type Direction,
  type NoticeInput,
  type NoticeOutcome,
  type NoticeResult,
  type PayBasis,
} from '@/lib/notice-period'
import ui from '../../../../(he)/(site)/components/tools/toolUi.module.css'
import styles from '../../../../(he)/(site)/components/tools/NoticePeriodCalculator.module.css'
import { EnField, EnOutput, useAnnouncement, useCopyResult } from './EnCalcParts'
import { INVALID_MESSAGE, enLongDate, enNoticeLength, enTenure } from './en-format'

const directionOptions: { value: Direction; label: string; hint: string }[] = [
  { value: 'dismissal', label: 'Dismissal', hint: 'The employer notifies the employee' },
  { value: 'resignation', label: 'Resignation', hint: 'The employee notifies the employer' },
]

const basisOptions: { value: PayBasis; label: string; hint: string }[] = [
  { value: 'salaried', label: 'Salaried', hint: 'Paid monthly' },
  { value: 'hourly', label: 'Hourly or daily', hint: 'Paid by the hour or day' },
]

const sectionOf = (result: NoticeResult) => result.section.replace(/^\D+/, 'Section ')

const announcementFor = (outcome: NoticeOutcome) =>
  outcome.kind === 'result'
    ? `Notice period: ${enNoticeLength(outcome.length)}. Last day: ${enLongDate(outcome.end)}.`
    : ''

const resultText = (result: NoticeResult) =>
  [
    `Israel notice period: ${result.direction}, ${result.basis === 'salaried' ? 'salaried' : 'hourly or daily'} employee`,
    `Notice given: ${enLongDate(result.notice)} (month ${result.monthOrdinal} of work)`,
    `Notice period: ${enNoticeLength(result.length)} (${sectionOf(result)} of the law)`,
    `Last day of notice: ${enLongDate(result.end)}${result.halfDay ? ', half a day' : ''}`,
    ...(result.afterRest !== null ? [`Rest days at the end are not counted: ${enLongDate(result.afterRest)}`] : []),
    'Statutory minimum under the Prior Notice Law, 2001. A contract or collective agreement can set more.',
    'https://www.aiterra.co.il/en/tools/notice-period-calculator',
  ].join('\n')

function ResultCard({ outcome }: { outcome: NoticeOutcome }) {
  if (outcome.kind !== 'result') {
    return (
      <div className={styles.card}>
        <p className={styles.message}>
          {outcome.kind === 'invalid' ? INVALID_MESSAGE : 'Choose the employee type and enter both dates.'}
        </p>
      </div>
    )
  }
  const resignation = outcome.direction === 'resignation'
  return (
    <div className={styles.card}>
      <p className={styles.kicker}>{resignation ? 'Notice for resignation' : 'Notice for dismissal'}</p>
      <p className={styles.answer}>{enNoticeLength(outcome.length)}</p>
      <p className={styles.basis}>
        {sectionOf(outcome)} of the law{resignation ? ' and Section 5' : ''}. Notice given in month{' '}
        {outcome.monthOrdinal} of work, seniority {enTenure(outcome.completedMonths)}.
      </p>
      <dl className={styles.facts}>
        <div className={styles.fact}>
          <dt>Notice given</dt>
          <dd>{enLongDate(outcome.notice)}</dd>
        </div>
        <div className={styles.fact}>
          <dt>Last day of the notice period</dt>
          <dd>
            {enLongDate(outcome.end)}
            {outcome.halfDay ? ' (half a day)' : ''}
          </dd>
        </div>
      </dl>
      {outcome.halfDay ? (
        <p className={styles.insight}>
          The law gives half a day here and does not say how to round it. State the end date explicitly in the notice.
        </p>
      ) : null}
      {outcome.afterRest !== null ? (
        <p className={styles.insight}>
          The period ends on a rest day. Under Section 10(c) of the Interpretation Law, rest days at the end of a period
          are not counted, so on that reading it runs until {enLongDate(outcome.afterRest)}.
        </p>
      ) : null}
      <p className={styles.insight}>
        {resignation
          ? 'An employee who stops working without giving notice owes the employer the regular pay for the missing days, and the employer may offset it (Section 7(b)).'
          : 'An employer who does not give notice, or waives work during it, pays the regular wage for the period (Sections 6 and 7(a)).'}
      </p>
    </div>
  )
}

export default function NoticePeriodCalculatorEn() {
  const [input, setInput] = useState<NoticeInput>(emptyNoticeInput)
  const id = useId()
  const { status, setStatus, copy } = useCopyResult('notice_period_calc')
  const errors = noticeErrors(input)
  const outcome = useMemo(() => calculateNotice(input), [input])
  const announcement = useAnnouncement(announcementFor(outcome))

  const update = (patch: Partial<NoticeInput>) => {
    setInput((current) => ({ ...current, ...patch }))
    setStatus('')
  }

  return (
    <section className={`${ui.tool} ${styles.calc}`} aria-label="Israel notice period calculator">
      <div className={`${ui.inner} ${styles.layout}`}>
        <form className={ui.form} onSubmit={(event) => event.preventDefault()}>
          <fieldset className={ui.group}>
            <legend className={ui.legend}>Who gives notice</legend>
            <div className={styles.choices}>
              {directionOptions.map((option) => (
                <label key={option.value} className={styles.choice}>
                  <input
                    type="radio"
                    name={`${id}-direction`}
                    value={option.value}
                    checked={input.direction === option.value}
                    onChange={() => update({ direction: option.value })}
                  />
                  <span>
                    {option.label}
                    <span className={styles.choiceHint}>{option.hint}</span>
                  </span>
                </label>
              ))}
            </div>
          </fieldset>
          <fieldset className={ui.group}>
            <legend className={ui.legend}>Employee type</legend>
            <div className={styles.choices}>
              {basisOptions.map((option) => (
                <label key={option.value} className={styles.choice}>
                  <input
                    type="radio"
                    name={`${id}-basis`}
                    value={option.value}
                    checked={input.basis === option.value}
                    onChange={() => update({ basis: option.value })}
                  />
                  <span>
                    {option.label}
                    <span className={styles.choiceHint}>{option.hint}</span>
                  </span>
                </label>
              ))}
            </div>
          </fieldset>
          <fieldset className={ui.group}>
            <legend className={ui.legend}>Dates</legend>
            <div className={styles.pair}>
              <EnField
                id={`${id}-start`}
                type="date"
                label="Start of work"
                styles={styles}
                value={input.start}
                error={errors.start ? 'Enter a valid date between 1950 and 2099.' : undefined}
                onChange={(start) => update({ start })}
              />
              <EnField
                id={`${id}-notice`}
                type="date"
                label="Day notice is given"
                styles={styles}
                value={input.notice}
                error={errors.notice ? 'Enter a valid date on or after the start of work.' : undefined}
                onChange={(notice) => update({ notice })}
              />
            </div>
            <p className={ui.hint}>
              Seniority counts up to the notice day. Unpaid leave usually does not count; maternity leave does.
            </p>
          </fieldset>
        </form>
        <EnOutput
          styles={styles}
          status={status}
          announcement={announcement}
          note="The minimum under the Prior Notice Law. A contract, collective agreement or extension order can set a longer period. Calculated in your browser; nothing is sent anywhere."
          onCopy={() => copy(outcome.kind === 'result' ? resultText(outcome) : null)}
        >
          <ResultCard outcome={outcome} />
        </EnOutput>
      </div>
    </section>
  )
}
