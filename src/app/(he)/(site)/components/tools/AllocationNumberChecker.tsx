'use client'

import { useId, useState, useSyncExternalStore, type ReactNode } from 'react'
import {
  ALLOCATION_DIGITS,
  amountError,
  checkAllocation,
  formatIsoDate,
  formatThreshold,
  formatVatRate,
  resultToText,
  type AmountBasis,
  type BuyerChoice,
  type CheckInput,
  type SupplyChoice,
} from '@/lib/allocation-number'
import { formatShekels } from '@/lib/vat-calculator'
import ui from './toolUi.module.css'
import styles from './AllocationNumberChecker.module.css'

type Option<T extends string> = { value: T; label: string; hint: string }

const basisOptions: Option<AmountBasis>[] = [
  { value: 'net', label: 'לפני מע״מ', hint: 'הסכום בלי המע״מ' },
  { value: 'gross', label: 'כולל מע״מ', hint: 'הסכום לתשלום' },
]

const buyerOptions: Option<BuyerChoice>[] = [
  { value: 'claims', label: 'עוסק מורשה או חברה', hint: 'ינכה את המע״מ מהחשבונית' },
  { value: 'none', label: 'לא מנכה מע״מ', hint: 'לקוח פרטי, עוסק פטור או מלכ״ר' },
]

const supplyOptions: Option<SupplyChoice>[] = [
  { value: 'taxable', label: 'חשבונית מס עם מע״מ', hint: 'עסקה רגילה' },
  { value: 'zero', label: 'שיעור אפס או פטור', hint: 'למשל יצוא שירותים' },
]

const subscribeNever = () => () => {}

const localToday = () => {
  const now = new Date()
  const pad = (value: number) => String(value).padStart(2, '0')
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`
}

function ChoiceGroup<T extends string>({
  legend,
  name,
  options,
  value,
  onChange,
  children,
}: {
  legend: string
  name: string
  options: Option<T>[]
  value: T
  onChange: (value: T) => void
  children?: ReactNode
}) {
  return (
    <fieldset className={ui.group}>
      <legend className={ui.legend}>{legend}</legend>
      <div className={styles.choices}>
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
              <span className={styles.choiceHint}>{option.hint}</span>
            </span>
          </label>
        ))}
      </div>
      {children}
    </fieldset>
  )
}

export default function AllocationNumberChecker() {
  const today = useSyncExternalStore(subscribeNever, localToday, () => '')
  const [date, setDate] = useState<string | null>(null)
  const [amount, setAmount] = useState('')
  const [basis, setBasis] = useState<AmountBasis>('net')
  const [buyer, setBuyer] = useState<BuyerChoice>('claims')
  const [supply, setSupply] = useState<SupplyChoice>('taxable')
  const [status, setStatus] = useState('')
  const dateId = useId()
  const dateHintId = `${dateId}-hint`
  const amountId = useId()
  const amountHintId = `${amountId}-hint`
  const amountErrorId = `${amountId}-error`

  const input: CheckInput = { date: date ?? today, amount, basis, buyer, supply }
  const result = checkAllocation(input)
  const error = amountError(result.parsedAmount)
  const rate = formatVatRate(supply === 'zero' ? 0 : result.vatBasisPoints)
  const amountHint =
    basis === 'gross' ? `נחשב את הסכום לפני מע״מ לפי ${rate}, השיעור בתאריך החשבונית.` : 'הסכום בלי המע״מ.'
  const verdict = result.verdict

  const copy = async () => {
    if (!verdict) {
      setStatus('מלאו את הפרטים כדי להעתיק את התשובה.')
      return
    }
    try {
      await navigator.clipboard.writeText(resultToText(input, result))
      setStatus('התשובה הועתקה')
      window.gtag?.('event', 'allocation_check_copy', {
        required: verdict.required,
        threshold: result.period?.thresholdShekels ?? 0,
        basis,
        buyer,
        supply,
      })
    } catch {
      setStatus('ההעתקה נכשלה. סמנו את הטקסט והעתיקו ידנית.')
    }
  }

  return (
    <section className={ui.tool} aria-label="בדיקת מספר הקצאה">
      <div className={ui.inner}>
        <form className={ui.form} onSubmit={(event) => event.preventDefault()}>
          <div className={ui.group}>
            <label htmlFor={dateId} className={ui.legend}>
              תאריך החשבונית
            </label>
            <p id={dateHintId} className={ui.hint}>
              הסף נקבע לפי התאריך שבו מוציאים את החשבונית.
            </p>
            <input
              id={dateId}
              type="date"
              className={`${ui.input} ${ui.date} ${styles.date}`}
              value={date ?? today}
              aria-describedby={dateHintId}
              onChange={(event) => setDate(event.target.value)}
            />
          </div>

          <ChoiceGroup legend="סכום החשבונית" name="allocation-basis" options={basisOptions} value={basis} onChange={setBasis}>
            <div className={ui.field}>
              <label htmlFor={amountId} className={ui.label}>
                סכום בשקלים
              </label>
              <p id={amountHintId} className={ui.hint}>
                {amountHint}
              </p>
              <input
                id={amountId}
                className={`${ui.input} ${ui.ltr} ${styles.amount}`}
                inputMode="decimal"
                autoComplete="off"
                spellCheck={false}
                value={amount}
                aria-invalid={error ? true : undefined}
                aria-describedby={error ? `${amountHintId} ${amountErrorId}` : amountHintId}
                onChange={(event) => setAmount(event.target.value)}
              />
              {error ? (
                <p id={amountErrorId} className={styles.error}>
                  {error}
                </p>
              ) : null}
            </div>
          </ChoiceGroup>

          <ChoiceGroup legend="הלקוח" name="allocation-buyer" options={buyerOptions} value={buyer} onChange={setBuyer} />

          <ChoiceGroup legend="סוג העסקה" name="allocation-supply" options={supplyOptions} value={supply} onChange={setSupply} />
        </form>

        <div className={ui.output}>
          <div className={ui.sticky}>
            <h2 className={ui.outputTitle}>התשובה</h2>
            {verdict ? (
              <div className={`${styles.verdict} ${verdict.required ? styles.required : styles.notRequired}`}>
                <p className={styles.headline}>{verdict.headline}</p>
                <p className={styles.reason}>{verdict.reason}</p>
              </div>
            ) : (
              <p className={styles.empty}>{result.prompt}</p>
            )}

            {result.dateValid ? (
              <dl className={styles.facts}>
                <div className={styles.fact}>
                  <dt>תאריך החשבונית</dt>
                  <dd>{formatIsoDate(input.date)}</dd>
                </div>
                <div className={styles.fact}>
                  <dt>הסף בתאריך הזה</dt>
                  <dd>
                    {result.period
                      ? `מעל ${formatThreshold(result.period.thresholdShekels)} לפני מע״מ`
                      : 'עוד לא הייתה חובה'}
                  </dd>
                </div>
                {result.netAgorot !== null && !result.beforeStart ? (
                  <div className={styles.fact}>
                    <dt>הסכום לפני מע״מ</dt>
                    <dd className={styles.number}>{formatShekels(result.netAgorot)}</dd>
                  </div>
                ) : null}
                {result.period ? (
                  <div className={styles.fact}>
                    <dt>לפי</dt>
                    <dd>{result.period.basis}</dd>
                  </div>
                ) : null}
              </dl>
            ) : null}

            {verdict?.required ? (
              <div className={styles.next}>
                <h3 className={styles.nextTitle}>מה עושים עכשיו</h3>
                <ul className={styles.nextList}>
                  <li>
                    בתוכנת חשבוניות שמחוברת לרשות המסים המספר מתבקש לבד. ודאו שמספר העוסק או ח.פ של הלקוח רשום
                    בחשבונית.
                  </li>
                  <li>
                    בחשבונית ידנית מבקשים את המספר ביישום של רשות המסים ורושמים על החשבונית את {ALLOCATION_DIGITS}{' '}
                    הספרות, גם בכתב יד.
                  </li>
                </ul>
                <a href="#how" className={styles.more}>
                  איך מבקשים מספר, ומה עושים כשהבקשה נדחית
                </a>
              </div>
            ) : null}

            <div className={ui.actions}>
              <button type="button" className={ui.primary} onClick={copy}>
                העתקת התשובה
              </button>
            </div>
            <p className={ui.status} role="status" aria-live="polite">
              {status}
            </p>
            <p className={ui.note}>
              הבדיקה נעשית בדפדפן שלכם, והסכומים לא נשלחים לשום מקום. זה מידע כללי ולא ייעוץ מס.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
