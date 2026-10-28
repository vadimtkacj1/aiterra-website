'use client'

import { useMemo, useState } from 'react'
import {
  EBAY,
  GROW,
  PAYPAL,
  calculateFees,
  currencySymbol,
  formatMoney,
  formatPercent,
  grossForNet,
  parseAmount,
  parsePercent,
  platformCurrencies,
  type Currency,
  type FeeBreakdown,
  type FeeInput,
  type PaypalRegion,
  type PlatformId,
} from '@/lib/payment-fees'
import { BizChoice, BizNumberField, BizResults } from './BizCalcField'
import ui from './toolUi.module.css'
import styles from './BizCalc.module.css'

type Direction = 'charge' | 'receive'

const platformOptions: { value: PlatformId; label: string; hint: string }[] = [
  {
    value: 'paypal',
    label: 'PayPal',
    hint: `${PAYPAL.domesticPercent}% + עמלה קבועה, ועוד מע״מ`,
  },
  { value: 'grow', label: 'Grow (משולם)', hint: `${GROW.percent}% לעסקה, אשראי וביט, ועוד מע״מ` },
  { value: 'grow-light', label: 'Grow Light', hint: `${GROW.lightPercent}% לעסקה, עד ${GROW.lightIncludedTransactions} עסקאות בחודש` },
  { value: 'ebay', label: 'eBay', hint: `${EBAY.finalValuePercent}% + עמלה להזמנה + ${EBAY.internationalPercent}% בינלאומי` },
  { value: 'custom', label: 'חברת סליקה אחרת', hint: 'טרנזילה, קארדקום, PayPlus, ביט ועוד: לפי ההצעה שלכם' },
]

const directionOptions: { value: Direction; label: string; hint: string }[] = [
  { value: 'charge', label: 'גובה סכום', hint: 'כמה יישאר לי' },
  { value: 'receive', label: 'רוצה לקבל סכום', hint: 'כמה לגבות מהלקוח' },
]

const regionOptions: { value: PaypalRegion; label: string; hint: string }[] = [
  { value: 'domestic', label: 'מישראל', hint: 'עסקה מקומית' },
  { value: 'near', label: 'ארה״ב, קנדה או אירופה', hint: `תוספת ${PAYPAL.regionExtraPercent.near}%` },
  { value: 'other', label: 'שאר העולם', hint: `תוספת ${PAYPAL.regionExtraPercent.other}%` },
]

const currencyLabels: Record<Currency, string> = { ILS: 'שקלים', USD: 'דולר', EUR: 'אירו' }

const amountError = (value: string) => (value.trim() && parseAmount(value) === null ? 'הקלידו סכום חיובי.' : '')
const percentError = (value: string) =>
  value.trim() && parsePercent(value) === null ? 'הקלידו אחוז בין 0 ל-99.' : ''

export default function PaymentFeesCalculator() {
  const [platform, setPlatform] = useState<PlatformId>('paypal')
  const [direction, setDirection] = useState<Direction>('charge')
  const [amount, setAmount] = useState('500')
  const [currency, setCurrency] = useState<Currency>('ILS')
  const [region, setRegion] = useState<PaypalRegion>('domestic')
  const [convert, setConvert] = useState(true)
  const [customPercent, setCustomPercent] = useState('')
  const [customFixed, setCustomFixed] = useState('')
  const [customVat, setCustomVat] = useState(true)

  const currencies = platformCurrencies[platform]
  const activeCurrency = currencies.includes(currency) ? currency : currencies[0]
  const parsedAmount = parseAmount(amount)
  const parsedPercent = parsePercent(customPercent)
  const parsedFixed = customFixed.trim() ? parseAmount(customFixed) : 0
  const customReady = platform !== 'custom' || (parsedPercent !== null && parsedFixed !== null)

  const result = useMemo<FeeBreakdown | null>(() => {
    if (parsedAmount === null || !customReady) return null
    const input: FeeInput = {
      platform,
      currency: activeCurrency,
      paypalRegion: region,
      paypalConvert: convert,
      customPercent: parsedPercent ?? 0,
      customFixed: parsedFixed ?? 0,
      customVat,
    }
    return direction === 'charge' ? calculateFees(input, parsedAmount) : grossForNet(input, parsedAmount)
  }, [parsedAmount, customReady, platform, activeCurrency, region, convert, parsedPercent, parsedFixed, customVat, direction])

  const money = (value: number) => formatMoney(value, activeCurrency)

  return (
    <section className={ui.tool} aria-label="מחשבון עמלות סליקה ופייפאל">
      <div className={ui.inner}>
        <form className={ui.form} onSubmit={(event) => event.preventDefault()}>
          <BizChoice legend="דרך מה גובים" name="fee-platform" options={platformOptions} value={platform} onChange={setPlatform} />
          <BizChoice legend="מה מחשבים" name="fee-direction" options={directionOptions} value={direction} onChange={setDirection} />
          <fieldset className={ui.group}>
            <legend className={ui.legend}>הסכום</legend>
            <div className={styles.grid}>
              <BizNumberField
                label={direction === 'charge' ? 'הלקוח משלם' : 'אני רוצה לקבל נטו'}
                suffix={currencySymbol[activeCurrency]}
                value={amount}
                error={amountError(amount)}
                onChange={setAmount}
              />
              {platform === 'custom' ? (
                <>
                  <BizNumberField
                    label="עמלה באחוזים"
                    suffix="%"
                    hint="מתוך הצעת המחיר שקיבלתם"
                    value={customPercent}
                    error={percentError(customPercent)}
                    onChange={setCustomPercent}
                  />
                  <BizNumberField
                    label="עמלה קבועה לעסקה (לא חובה)"
                    suffix="₪"
                    value={customFixed}
                    error={amountError(customFixed)}
                    onChange={setCustomFixed}
                  />
                </>
              ) : null}
            </div>
            {currencies.length > 1 ? (
              <div className={ui.actions}>
                {currencies.map((option) => (
                  <button
                    key={option}
                    type="button"
                    className={activeCurrency === option ? ui.primary : ui.secondary}
                    aria-pressed={activeCurrency === option}
                    onClick={() => setCurrency(option)}
                  >
                    {currencyLabels[option]}
                  </button>
                ))}
              </div>
            ) : null}
            {platform === 'custom' ? (
              <label className={ui.option}>
                <input
                  type="checkbox"
                  className={ui.checkbox}
                  checked={customVat}
                  onChange={(event) => setCustomVat(event.target.checked)}
                />
                להוסיף 18% מע״מ על העמלה
              </label>
            ) : null}
          </fieldset>
          {platform === 'paypal' ? (
            <>
              <BizChoice legend="מאיפה הלקוח משלם" name="fee-region" options={regionOptions} value={region} onChange={setRegion} />
              {activeCurrency !== 'ILS' ? (
                <label className={ui.option}>
                  <input
                    type="checkbox"
                    className={ui.checkbox}
                    checked={convert}
                    onChange={(event) => setConvert(event.target.checked)}
                  />
                  להמיר לשקלים ב-PayPal (מרווח של {PAYPAL.conversionPercent}% על השער)
                </label>
              ) : null}
            </>
          ) : null}
        </form>

        <div className={ui.output}>
          <div className={ui.sticky}>
            <h2 className={ui.outputTitle}>{direction === 'charge' ? 'כמה נשאר לכם' : 'כמה לגבות'}</h2>
            {result ? (
              <BizResults
                rows={[
                  direction === 'charge'
                    ? { term: 'נשאר לכם נטו', value: money(result.net), main: true, ltr: true }
                    : { term: 'לגבות מהלקוח', value: money(result.gross), main: true, ltr: true },
                  direction === 'charge'
                    ? { term: 'הלקוח משלם', value: money(result.gross), ltr: true }
                    : { term: 'נשאר לכם נטו', value: money(result.net), ltr: true },
                  { term: 'עמלה', value: money(result.fee), ltr: true },
                  ...(result.vat > 0 ? [{ term: 'מע״מ על העמלה', value: money(result.vat), ltr: true }] : []),
                  ...(result.conversion > 0 ? [{ term: 'המרת מטבע (הערכה)', value: money(result.conversion), ltr: true }] : []),
                  { term: 'סה״כ עלות', value: `${money(result.totalCost)} (${formatPercent(result.effectivePercent)})`, ltr: true },
                ]}
              />
            ) : (
              <p className={styles.message}>
                {platform === 'custom' && parsedAmount !== null
                  ? 'הקלידו את אחוז העמלה מההצעה של חברת הסליקה.'
                  : 'הקלידו סכום כדי לראות את העמלה.'}
              </p>
            )}
            <p className={ui.note}>
              {platform === 'grow' || platform === 'grow-light'
                ? `בלי דמי המנוי החודשיים (${platform === 'grow' ? GROW.monthlyIls : GROW.lightMonthlyIls} ₪ + מע״מ בתשלום שנתי).`
                : platform === 'ebay'
                  ? 'עמלות eBay בדולרים, לרוב הקטגוריות, בלי מע״מ ובלי עמלת PayPal או משיכה.'
                  : platform === 'paypal'
                    ? `משיכה לבנק מתחת ל-${PAYPAL.withdrawalFreeFromIls} ₪ עולה ${PAYPAL.withdrawalFeeIls} ₪ + מע״מ.`
                    : 'בלי דמי מסוף חודשיים, אם יש.'}{' '}
              החישוב נעשה בדפדפן ושום דבר לא נשמר.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
