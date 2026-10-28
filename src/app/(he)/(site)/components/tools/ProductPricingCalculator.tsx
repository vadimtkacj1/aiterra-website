'use client'

import { useMemo, useState } from 'react'
import {
  STANDARD_VAT_RATE,
  calculateProductPricing,
  defaultProductPricingInput,
  formatPercent,
  formatRoas,
  formatShekels,
  parseAgorot,
  productPricingToText,
  type ProductPricingInput,
} from '@/lib/product-pricing'
import { BizChoice, BizNumberField, BizResults, copyText } from './BizCalcField'
import ui from './toolUi.module.css'
import styles from './BizCalc.module.css'
import own from './ProductPricingCalculator.module.css'

type TextKey = Exclude<keyof ProductPricingInput, 'withVat'>
type VatChoice = 'vat' | 'exempt'

const vatOptions: { value: VatChoice; label: string; hint: string }[] = [
  { value: 'vat', label: 'עוסק מורשה', hint: `מוסיפים ${STANDARD_VAT_RATE}% מע״מ למחיר` },
  { value: 'exempt', label: 'עוסק פטור', hint: 'בלי מע״מ במחיר' },
]

const costFields: { key: TextKey; label: string; hint?: string }[] = [
  { key: 'unitCost', label: 'עלות המוצר ליחידה', hint: 'מחיר הקנייה מהספק, לפני מע״מ' },
  { key: 'shipping', label: 'משלוח ליחידה', hint: 'מהספק אליכם ומכם ללקוח' },
  { key: 'packaging', label: 'אריזה ליחידה' },
  { key: 'importFees', label: 'מכס ומיסי יבוא ליחידה', hint: 'כולל עמלת עמיל מכס, אם יש' },
  { key: 'cpa', label: 'עלות פרסום למכירה (CPA)', hint: 'תקציב הפרסום חלקי מספר המכירות' },
]

const percentFields: { key: TextKey; label: string; hint?: string }[] = [
  { key: 'paymentFee', label: 'עמלת סליקה', hint: 'מהמחיר שהלקוח משלם' },
  { key: 'platformFee', label: 'עמלת פלטפורמה או מרקטפלייס' },
  { key: 'returns', label: 'אחוז החזרות', hint: 'מתוך כל ההזמנות' },
  { key: 'targetMargin', label: 'מרווח רווח נקי רצוי', hint: 'אחרי כל העלויות, מהמחיר לפני מע״מ' },
]

const errorOf = (value: string) => {
  const parsed = parseAgorot(value)
  return parsed.ok || parsed.empty ? '' : 'הקלידו מספר חיובי, עם נקודה לשברים.'
}

const changeLabel = (change: number) => (change === 0 ? 'המחיר המומלץ' : `${change > 0 ? '+' : '−'}${Math.abs(change)}%`)

export default function ProductPricingCalculator() {
  const [input, setInput] = useState<ProductPricingInput>(defaultProductPricingInput)
  const [status, setStatus] = useState('')
  const outcome = useMemo(() => calculateProductPricing(input), [input])
  const update = (key: TextKey, value: string) => setInput((current) => ({ ...current, [key]: value }))

  const renderField = (field: { key: TextKey; label: string; hint?: string }, suffix: string) => (
    <BizNumberField
      key={field.key}
      label={field.label}
      suffix={suffix}
      hint={field.hint}
      value={input[field.key]}
      error={errorOf(input[field.key])}
      onChange={(value) => update(field.key, value)}
    />
  )

  return (
    <section className={ui.tool} aria-label="תמחור מוצר לחנות אונליין">
      <div className={ui.inner}>
        <form className={ui.form} onSubmit={(event) => event.preventDefault()}>
          <fieldset className={ui.group}>
            <legend className={ui.legend}>עלויות ליחידה</legend>
            <div className={styles.grid}>{costFields.map((field) => renderField(field, '₪'))}</div>
          </fieldset>
          <fieldset className={ui.group}>
            <legend className={ui.legend}>עמלות, החזרות ויעד</legend>
            <div className={styles.grid}>{percentFields.map((field) => renderField(field, '%'))}</div>
          </fieldset>
          <BizChoice
            legend="סוג העוסק"
            name="vat-status"
            options={vatOptions}
            value={input.withVat ? 'vat' : 'exempt'}
            onChange={(value) => setInput((current) => ({ ...current, withVat: value === 'vat' }))}
          />
        </form>

        <div className={ui.output}>
          <div className={ui.sticky}>
            <h2 className={ui.outputTitle}>התוצאה</h2>
            {outcome.kind === 'result' ? (
              <>
                <BizResults
                  rows={[
                    {
                      term: outcome.withVat ? `מחיר מומלץ כולל מע״מ ${STANDARD_VAT_RATE}%` : 'מחיר מומלץ',
                      value: formatShekels(outcome.gross),
                      main: true,
                    },
                    ...(outcome.withVat ? [{ term: 'מחיר לפני מע״מ', value: formatShekels(outcome.net) }] : []),
                    { term: 'עלות נחיתה ליחידה', value: formatShekels(outcome.landed) },
                    { term: 'עמלות סליקה ופלטפורמה', value: formatShekels(outcome.fees) },
                    { term: 'עלות החזרות למכירה', value: formatShekels(outcome.returnsLoss) },
                    { term: 'רווח נקי ליחידה', value: formatShekels(outcome.profit) },
                    { term: 'ROAS לאיזון', value: formatRoas(outcome.breakEvenRoas) },
                  ]}
                />
                <div className={own.tableWrap} role="region" aria-label="רגישות למחיר" tabIndex={0}>
                  <table className={own.table}>
                    <caption>מה קורה אם משנים את המחיר</caption>
                    <thead>
                      <tr>
                        <th scope="col">מחיר</th>
                        <th scope="col">לצרכן</th>
                        <th scope="col">רווח</th>
                        <th scope="col">מרווח</th>
                        <th scope="col">ROAS לאיזון</th>
                      </tr>
                    </thead>
                    <tbody>
                      {outcome.sensitivity.map(({ change, point }) => (
                        <tr key={change} className={change === 0 ? own.current : undefined}>
                          <th scope="row">{changeLabel(change)}</th>
                          <td>{formatShekels(point.gross)}</td>
                          <td>{formatShekels(point.profit)}</td>
                          <td>{formatPercent(point.marginBasisPoints)}</td>
                          <td>{formatRoas(point.breakEvenRoas)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            ) : (
              <p className={styles.message}>
                {outcome.kind === 'impossible' ? outcome.message : 'הקלידו את עלות המוצר כדי לראות מחיר מומלץ.'}
              </p>
            )}
            <div className={ui.actions}>
              <button
                type="button"
                className={ui.primary}
                onClick={() =>
                  outcome.kind === 'result'
                    ? copyText(productPricingToText(outcome), setStatus, 'התוצאה הועתקה')
                    : setStatus('השלימו את השדות כדי להעתיק את התוצאה.')
                }
              >
                העתקת התוצאה
              </button>
            </div>
            <p className={ui.status} role="status" aria-live="polite">
              {status}
            </p>
            <p className={ui.note}>הרווח והמרווח מחושבים על המחיר לפני מע״מ. החישוב נעשה בדפדפן.</p>
          </div>
        </div>
      </div>
    </section>
  )
}
