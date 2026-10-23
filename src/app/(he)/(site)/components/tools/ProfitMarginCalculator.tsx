'use client'

import { useMemo, useState } from 'react'
import {
  STANDARD_VAT_RATE,
  calculatePricing,
  defaultPricingInput,
  formatPercent,
  formatShekels,
  formatUnits,
  parseAgorot,
  pricingToText,
  type CostBasis,
  type PricingInput,
  type PricingMode,
} from '@/lib/profit-margin'
import { BizChoice, BizNumberField, BizResults, copyText } from './BizCalcField'
import ui from './toolUi.module.css'
import styles from './BizCalc.module.css'

const modeOptions: { value: PricingMode; label: string; hint: string }[] = [
  { value: 'margin', label: 'לפי מרווח רווח', hint: 'אחוז מהמחיר' },
  { value: 'markup', label: 'לפי תוספת על העלות', hint: 'אחוז מהעלות' },
  { value: 'price', label: 'יש לי מחיר', hint: 'מה הרווח שלי' },
]

const basisOptions: { value: CostBasis; label: string; hint: string }[] = [
  { value: 'net', label: 'לפני מע״מ', hint: 'כמו בחשבונית הספק' },
  { value: 'gross', label: 'כולל מע״מ', hint: `נוריד ${STANDARD_VAT_RATE}%` },
]

const valueLabel: Record<PricingMode, { label: string; suffix: string }> = {
  margin: { label: 'מרווח רווח גולמי רצוי', suffix: '%' },
  markup: { label: 'תוספת על העלות', suffix: '%' },
  price: { label: 'מחיר מכירה לפני מע״מ', suffix: '₪' },
}

const errorOf = (value: string) => {
  const parsed = parseAgorot(value)
  return parsed.ok || parsed.empty ? '' : 'הקלידו מספר חיובי, עם נקודה לשברים.'
}

export default function ProfitMarginCalculator() {
  const [input, setInput] = useState<PricingInput>(defaultPricingInput)
  const [status, setStatus] = useState('')
  const outcome = useMemo(() => calculatePricing(input), [input])
  const update = (key: keyof PricingInput, value: string) => setInput((current) => ({ ...current, [key]: value }))

  return (
    <section className={ui.tool} aria-label="חישוב רווח ומחיר">
      <div className={ui.inner}>
        <form className={ui.form} onSubmit={(event) => event.preventDefault()}>
          <BizChoice
            legend="איך מתמחרים"
            name="pricing-mode"
            options={modeOptions}
            value={input.mode}
            onChange={(value) => update('mode', value)}
          />
          <fieldset className={ui.group}>
            <legend className={ui.legend}>עלות ומחיר</legend>
            <div className={styles.grid}>
              <BizNumberField
                label="עלות ליחידה"
                suffix="₪"
                hint="קנייה או ייצור של יחידה אחת"
                value={input.cost}
                error={errorOf(input.cost)}
                onChange={(value) => update('cost', value)}
              />
              <BizNumberField
                label={valueLabel[input.mode].label}
                suffix={valueLabel[input.mode].suffix}
                value={input.value}
                error={errorOf(input.value)}
                onChange={(value) => update('value', value)}
              />
            </div>
          </fieldset>
          <BizChoice
            legend="העלות שהקלדתם"
            name="cost-basis"
            options={basisOptions}
            value={input.costBasis}
            onChange={(value) => update('costBasis', value)}
          />
          <fieldset className={ui.group}>
            <legend className={ui.legend}>נקודת איזון (לא חובה)</legend>
            <BizNumberField
              label="הוצאות קבועות לחודש"
              suffix="₪"
              hint="שכירות, שכר, פרסום ותוכנות"
              value={input.fixedCosts}
              error={errorOf(input.fixedCosts)}
              onChange={(value) => update('fixedCosts', value)}
            />
          </fieldset>
        </form>

        <div className={ui.output}>
          <div className={ui.sticky}>
            <h2 className={ui.outputTitle}>התוצאה</h2>
            {outcome.kind === 'result' ? (
              <>
                <BizResults
                  rows={[
                    { term: 'מחיר מכירה לפני מע״מ', value: formatShekels(outcome.price), main: true },
                    { term: `מחיר לצרכן כולל מע״מ ${STANDARD_VAT_RATE}%`, value: formatShekels(outcome.priceWithVat) },
                    { term: 'רווח גולמי ליחידה', value: formatShekels(outcome.profit) },
                    { term: 'מרווח רווח גולמי', value: formatPercent(outcome.marginBasisPoints) },
                    {
                      term: 'תוספת על העלות',
                      value: outcome.markupBasisPoints === null ? 'אין עלות' : formatPercent(outcome.markupBasisPoints),
                    },
                    ...(outcome.breakEvenUnits !== null
                      ? [{ term: 'נקודת איזון בחודש', value: `${formatUnits(outcome.breakEvenUnits)} יחידות` }]
                      : []),
                  ]}
                />
                {outcome.profit <= 0 ? (
                  <p className={styles.notice}>במחיר הזה אין רווח: המחיר לפני מע״מ לא עולה על העלות.</p>
                ) : null}
                {outcome.fixedCosts > 0 && outcome.profit <= 0 ? (
                  <p className={styles.notice}>בלי רווח ליחידה אי אפשר להגיע לנקודת איזון.</p>
                ) : null}
              </>
            ) : (
              <p className={styles.message}>
                {outcome.kind === 'impossible' ? outcome.message : 'הקלידו עלות ואחוז או מחיר כדי לראות את התוצאה.'}
              </p>
            )}
            <div className={ui.actions}>
              <button
                type="button"
                className={ui.primary}
                onClick={() =>
                  outcome.kind === 'result'
                    ? copyText(pricingToText(outcome), setStatus, 'התוצאה הועתקה')
                    : setStatus('השלימו את השדות כדי להעתיק את התוצאה.')
                }
              >
                העתקת התוצאה
              </button>
            </div>
            <p className={ui.status} role="status" aria-live="polite">
              {status}
            </p>
            <p className={ui.note}>הרווח והאחוזים מחושבים על מחירים לפני מע״מ. החישוב נעשה בדפדפן.</p>
          </div>
        </div>
      </div>
    </section>
  )
}
