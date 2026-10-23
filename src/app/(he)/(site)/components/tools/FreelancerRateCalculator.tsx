'use client'

import { useMemo, useState } from 'react'
import {
  EXEMPT_CEILING_2026,
  STANDARD_VAT_RATE,
  calculateRate,
  defaultRateInput,
  fieldLimits,
  formatMoney,
  formatWhole,
  parseField,
  rateToText,
  type DealerType,
  type RateField,
  type RateInput,
} from '@/lib/freelancer-rate'
import { BizChoice, BizNumberField, BizResults, copyText } from './BizCalcField'
import ui from './toolUi.module.css'
import styles from './BizCalc.module.css'

const dealerOptions: { value: DealerType; label: string; hint: string }[] = [
  { value: 'licensed', label: 'עוסק מורשה', hint: `מוסיף ${STANDARD_VAT_RATE}% מע״מ לחשבונית` },
  { value: 'exempt', label: 'עוסק פטור', hint: 'בלי מע״מ, עד תקרת מחזור' },
]

const fields: { key: RateField; label: string; suffix: string; hint?: string; group: 'money' | 'time' }[] = [
  { key: 'targetNet', label: 'נטו שאתם רוצים לחודש', suffix: '₪', group: 'money', hint: 'מה שנשאר לכם אחרי מס' },
  { key: 'expenses', label: 'הוצאות העסק לחודש', suffix: '₪', group: 'money', hint: 'תוכנות, ציוד, רו״ח, רכב' },
  { key: 'creditPoints', label: 'נקודות זיכוי', suffix: '', group: 'money', hint: 'גבר 2.25, אישה 2.75' },
  { key: 'weeklyHours', label: 'שעות עבודה בשבוע', suffix: 'שעות', group: 'time' },
  { key: 'billableShare', label: 'אחוז השעות שמחייבים', suffix: '%', group: 'time', hint: 'השאר: שיווק, מיילים, הנה״ח' },
  { key: 'vacationDays', label: 'ימי חופש בשנה', suffix: 'ימים', group: 'time' },
  { key: 'sickDays', label: 'ימי מחלה בשנה', suffix: 'ימים', group: 'time' },
  { key: 'holidayDays', label: 'ימי חג בשנה', suffix: 'ימים', group: 'time' },
]

const errorFor = (key: RateField, value: string) =>
  parseField(key, value) === 'invalid' ? `הקלידו מספר בין 0 ל-${formatWhole(fieldLimits[key])}.` : ''

export default function FreelancerRateCalculator() {
  const [input, setInput] = useState<RateInput>(defaultRateInput)
  const [status, setStatus] = useState('')
  const outcome = useMemo(() => calculateRate(input), [input])

  const update = (key: keyof RateInput, value: string) => setInput((current) => ({ ...current, [key]: value }))

  const renderField = (field: (typeof fields)[number]) => (
    <BizNumberField
      key={field.key}
      label={field.label}
      suffix={field.suffix || undefined}
      hint={field.hint}
      value={input[field.key]}
      error={errorFor(field.key, input[field.key])}
      onChange={(value) => update(field.key, value)}
    />
  )

  return (
    <section className={ui.tool} aria-label="חישוב התעריף">
      <div className={ui.inner}>
        <form className={ui.form} onSubmit={(event) => event.preventDefault()}>
          <BizChoice
            legend="סוג העוסק"
            name="dealer-type"
            options={dealerOptions}
            value={input.dealer}
            onChange={(value) => update('dealer', value)}
          />
          <fieldset className={ui.group}>
            <legend className={ui.legend}>כסף</legend>
            <div className={styles.grid}>{fields.filter((field) => field.group === 'money').map(renderField)}</div>
          </fieldset>
          <fieldset className={ui.group}>
            <legend className={ui.legend}>זמן</legend>
            <div className={styles.grid}>{fields.filter((field) => field.group === 'time').map(renderField)}</div>
          </fieldset>
        </form>

        <div className={ui.output}>
          <div className={ui.sticky}>
            <h2 className={ui.outputTitle}>התעריף המינימלי</h2>
            {outcome.kind === 'result' ? (
              <>
                <BizResults
                  rows={[
                    {
                      term: input.dealer === 'licensed' ? 'לשעה, לפני מע״מ' : 'לשעה (עוסק פטור, בלי מע״מ)',
                      value: formatMoney(outcome.hourly),
                      main: true,
                    },
                    ...(input.dealer === 'licensed'
                      ? [{ term: `לשעה כולל מע״מ ${STANDARD_VAT_RATE}%`, value: formatMoney(outcome.hourlyWithVat) }]
                      : []),
                    { term: 'ליום עבודה', value: formatMoney(outcome.daily) },
                    { term: 'שעות לחיוב בחודש', value: formatWhole(outcome.billableHoursMonthly) },
                    { term: 'הכנסה נדרשת לחודש', value: formatMoney(outcome.monthlyRevenue) },
                    { term: 'מס הכנסה וביטוח לאומי בשנה', value: formatMoney(outcome.annualTax) },
                  ]}
                />
                <p className={styles.formula}>
                  החישוב: {formatMoney(outcome.annualRevenue)} הכנסה שנתית ÷ {formatWhole(outcome.billableHours)} שעות
                  לחיוב בשנה, מעוגל כלפי מעלה.
                </p>
                {outcome.overExemptCeiling ? (
                  <p className={styles.notice}>
                    ההכנסה השנתית שיצאה, {formatMoney(outcome.annualRevenue)}, עוברת את תקרת העוסק הפטור ל-2026,{' '}
                    {formatMoney(EXEMPT_CEILING_2026)}. מעל התקרה צריך להירשם כעוסק מורשה ולהוסיף מע״מ.
                  </p>
                ) : null}
              </>
            ) : (
              <p className={styles.message}>
                {outcome.kind === 'impossible'
                  ? outcome.message
                  : 'הקלידו נטו רצוי, שעות בשבוע ואחוז שעות לחיוב כדי לראות את התעריף.'}
              </p>
            )}
            <div className={ui.actions}>
              <button
                type="button"
                className={ui.primary}
                onClick={() =>
                  outcome.kind === 'result'
                    ? copyText(rateToText(outcome, input.dealer), setStatus, 'התוצאה הועתקה')
                    : setStatus('השלימו את השדות כדי להעתיק את התוצאה.')
                }
              >
                העתקת התוצאה
              </button>
            </div>
            <p className={ui.status} role="status" aria-live="polite">
              {status}
            </p>
            <p className={ui.note}>
              הערכה לפי מדרגות המס והביטוח הלאומי של 2026, בלי הפקדות לפנסיה ולקרן השתלמות. החישוב נעשה בדפדפן.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
