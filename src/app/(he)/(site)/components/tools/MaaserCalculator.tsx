'use client'

import { useEffect, useId, useMemo, useState } from 'react'
import {
  LEDGER_STORAGE_KEY,
  annualize,
  calculateMaaser,
  formatShekels,
  isDonation,
  parseShekels,
  taxCreditEstimate,
  totalGiven,
  type Donation,
  type Period,
  type Rate,
  type SalaryBasis,
} from '@/lib/maaser'
import ui from './toolUi.module.css'
import styles from './MaaserCalculator.module.css'

type AmountKey = 'salary' | 'taxes' | 'business' | 'gifts' | 'allowances' | 'workExpenses'

const rateOptions: { value: Rate; label: string; hint: string }[] = [
  { value: 'maaser', label: 'מעשר, 10%', hint: 'השיעור הבסיסי' },
  { value: 'chomesh', label: 'חומש, 20%', hint: 'מידה של עין טובה' },
]

const basisOptions: { value: SalaryBasis; label: string; hint: string }[] = [
  { value: 'net', label: 'נטו', hint: 'מה שנכנס לחשבון' },
  { value: 'gross', label: 'ברוטו', hint: 'לפני ניכויים בתלוש' },
]

const periodOptions: { value: Period; label: string; hint: string }[] = [
  { value: 'month', label: 'חודש', hint: 'מחשבים כל חודש בנפרד' },
  { value: 'year', label: 'שנה', hint: 'לעצמאי לפי שנת המאזן' },
]

const today = () => new Date().toISOString().slice(0, 10)

const newId = () => `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`

function readLedger(): Donation[] {
  try {
    const raw = window.localStorage.getItem(LEDGER_STORAGE_KEY)
    if (!raw) return []
    const parsed: unknown = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed.filter(isDonation) : []
  } catch {
    return []
  }
}

function writeLedger(ledger: Donation[]) {
  try {
    window.localStorage.setItem(LEDGER_STORAGE_KEY, JSON.stringify(ledger))
    return true
  } catch {
    return false
  }
}

function Choice<T extends string>({
  legend,
  name,
  options,
  value,
  onChange,
}: {
  legend: string
  name: string
  options: { value: T; label: string; hint: string }[]
  value: T
  onChange: (value: T) => void
}) {
  return (
    <fieldset className={`${ui.group} ${styles.choiceGroup}`}>
      <legend className={ui.legend}>{legend}</legend>
      <div className={ui.options}>
        {options.map((option) => (
          <label key={option.value} className={ui.option}>
            <input
              type="radio"
              name={name}
              value={option.value}
              className={ui.checkbox}
              checked={value === option.value}
              onChange={() => onChange(option.value)}
            />
            <span>
              <span className={styles.optionLabel}>{option.label}</span>
              <span className={styles.optionHint}>{option.hint}</span>
            </span>
          </label>
        ))}
      </div>
    </fieldset>
  )
}

function AmountField({
  label,
  hint,
  value,
  onChange,
}: {
  label: string
  hint?: string
  value: string
  onChange: (value: string) => void
}) {
  const id = useId()
  const invalid = Number.isNaN(parseShekels(value))
  return (
    <div className={ui.field}>
      <label htmlFor={id} className={ui.label}>
        {label}
      </label>
      {hint ? (
        <p id={`${id}-hint`} className={ui.hint}>
          {hint}
        </p>
      ) : null}
      <input
        id={id}
        className={`${ui.input} ${ui.ltr}`}
        inputMode="decimal"
        autoComplete="off"
        placeholder="0"
        value={value}
        aria-invalid={invalid || undefined}
        aria-describedby={hint ? `${id}-hint` : undefined}
        onChange={(event) => onChange(event.target.value)}
      />
      {invalid ? <p className={styles.error}>אפשר להקליד רק ספרות.</p> : null}
    </div>
  )
}

export default function MaaserCalculator() {
  const [rate, setRate] = useState<Rate>('maaser')
  const [period, setPeriod] = useState<Period>('month')
  const [basis, setBasis] = useState<SalaryBasis>('net')
  const [deductTaxes, setDeductTaxes] = useState(true)
  const [deductWorkExpenses, setDeductWorkExpenses] = useState(true)
  const [amounts, setAmounts] = useState<Record<AmountKey, string>>({
    salary: '',
    taxes: '',
    business: '',
    gifts: '',
    allowances: '',
    workExpenses: '',
  })
  const [ledger, setLedger] = useState<Donation[]>([])
  const [loaded, setLoaded] = useState(false)
  const [storageOk, setStorageOk] = useState(true)
  const [donationAmount, setDonationAmount] = useState('')
  const [donationDate, setDonationDate] = useState(today)
  const [donationNote, setDonationNote] = useState('')
  const donationAmountId = useId()
  const donationDateId = useId()
  const donationNoteId = useId()

  useEffect(() => {
    setLedger(readLedger())
    setLoaded(true)
  }, [])

  useEffect(() => {
    if (loaded) setStorageOk(writeLedger(ledger))
  }, [ledger, loaded])

  const setAmount = (key: AmountKey) => (value: string) => setAmounts((prev) => ({ ...prev, [key]: value }))
  const num = (key: AmountKey) => {
    const value = parseShekels(amounts[key])
    return Number.isNaN(value) ? 0 : value
  }

  const result = useMemo(
    () =>
      calculateMaaser(
        {
          salary: num('salary'),
          salaryBasis: basis,
          taxes: num('taxes'),
          business: num('business'),
          gifts: num('gifts'),
          allowances: num('allowances'),
          workExpenses: num('workExpenses'),
          deductTaxes,
          deductWorkExpenses,
        },
        rate,
      ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [amounts, basis, deductTaxes, deductWorkExpenses, rate],
  )

  const given = totalGiven(ledger)
  const thisYear = String(new Date().getFullYear())
  const givenThisYear = totalGiven(ledger.filter((item) => item.date.startsWith(thisYear)))
  const balance = result.owed - given
  const annualOwed = annualize(result.owed, period)
  const credit = taxCreditEstimate(givenThisYear)

  const addDonation = () => {
    const amount = parseShekels(donationAmount)
    if (!amount || Number.isNaN(amount)) return
    setLedger((prev) =>
      [{ id: newId(), date: donationDate || today(), amount, note: donationNote.trim().slice(0, 80) }, ...prev].sort(
        (a, b) => b.date.localeCompare(a.date),
      ),
    )
    setDonationAmount('')
    setDonationNote('')
  }

  const removeDonation = (id: string) => setLedger((prev) => prev.filter((item) => item.id !== id))

  const periodWord = period === 'month' ? 'לחודש' : 'לשנה'

  return (
    <section className={ui.tool} aria-label="מחשבון מעשר כספים">
      <div className={ui.inner}>
        <form className={ui.form} onSubmit={(event) => event.preventDefault()}>
          <Choice legend="שיעור" name="maaser-rate" options={rateOptions} value={rate} onChange={setRate} />
          <Choice legend="תקופה" name="maaser-period" options={periodOptions} value={period} onChange={setPeriod} />

          <fieldset className={ui.group}>
            <legend className={ui.legend}>הכנסות {periodWord}</legend>
            <Choice legend="המשכורת שהקלדתם היא" name="maaser-basis" options={basisOptions} value={basis} onChange={setBasis} />
            <AmountField label="משכורת" value={amounts.salary} onChange={setAmount('salary')} />
            {basis === 'gross' ? (
              <>
                <label className={ui.option}>
                  <input
                    type="checkbox"
                    className={ui.checkbox}
                    checked={deductTaxes}
                    onChange={(event) => setDeductTaxes(event.target.checked)}
                  />
                  <span>לנכות מס הכנסה, ביטוח לאומי ובריאות</span>
                </label>
                {deductTaxes ? (
                  <AmountField
                    label="מס הכנסה, ביטוח לאומי ובריאות"
                    hint="הסכומים מהתלוש. פנסיה וקרן השתלמות לא נכללות כאן."
                    value={amounts.taxes}
                    onChange={setAmount('taxes')}
                  />
                ) : null}
              </>
            ) : null}
            <AmountField
              label="רווח מעסק"
              hint="הכנסות פחות הוצאות העסק, אחרי מס."
              value={amounts.business}
              onChange={setAmount('business')}
            />
            <AmountField label="מתנות כסף" value={amounts.gifts} onChange={setAmount('gifts')} />
            <AmountField
              label="קצבאות והכנסות אחרות"
              hint="קצבאות, שכר דירה שמתקבל, רווח ריאלי מחיסכון."
              value={amounts.allowances}
              onChange={setAmount('allowances')}
            />
          </fieldset>

          <fieldset className={ui.group}>
            <legend className={ui.legend}>הוצאות לצורך העבודה</legend>
            <label className={ui.option}>
              <input
                type="checkbox"
                className={ui.checkbox}
                checked={deductWorkExpenses}
                onChange={(event) => setDeductWorkExpenses(event.target.checked)}
              />
              <span>לנכות הוצאות שנחוצות כדי להרוויח</span>
            </label>
            {deductWorkExpenses ? (
              <AmountField
                label="נסיעות לעבודה, ציוד וספרות מקצועית"
                hint="לא אוכל בעבודה, משכנתא או ארנונה של הבית."
                value={amounts.workExpenses}
                onChange={setAmount('workExpenses')}
              />
            ) : null}
          </fieldset>

          <fieldset className={ui.group}>
            <legend className={ui.legend}>יומן צדקה</legend>
            <div className={styles.ledgerRow}>
              <div className={ui.field}>
                <label htmlFor={donationAmountId} className={ui.label}>
                  סכום
                </label>
                <input
                  id={donationAmountId}
                  className={`${ui.input} ${ui.ltr}`}
                  inputMode="decimal"
                  autoComplete="off"
                  value={donationAmount}
                  onChange={(event) => setDonationAmount(event.target.value)}
                />
              </div>
              <div className={ui.field}>
                <label htmlFor={donationDateId} className={ui.label}>
                  תאריך
                </label>
                <input
                  id={donationDateId}
                  type="date"
                  className={`${ui.input} ${ui.ltr}`}
                  value={donationDate}
                  onChange={(event) => setDonationDate(event.target.value)}
                />
              </div>
            </div>
            <div className={ui.field}>
              <label htmlFor={donationNoteId} className={ui.label}>
                למי (לא חובה)
              </label>
              <input
                id={donationNoteId}
                className={ui.input}
                maxLength={80}
                value={donationNote}
                onChange={(event) => setDonationNote(event.target.value)}
              />
            </div>
            <div className={ui.actions}>
              <button type="button" className={ui.primary} onClick={addDonation}>
                הוספה ליומן
              </button>
            </div>
            <p className={ui.note}>
              {storageOk
                ? 'היומן נשמר רק בדפדפן הזה, במכשיר שלכם. שום סכום לא נשלח אלינו.'
                : 'הדפדפן חוסם שמירה, ולכן היומן יימחק כשתסגרו את הדף.'}
            </p>
          </fieldset>
        </form>

        <div className={ui.output}>
          <div className={ui.sticky}>
            <h2 className={ui.outputTitle}>החשבון</h2>
            <dl className={styles.summary} aria-live="polite">
              <div className={styles.main}>
                <dt>{result.percent === 10 ? 'מעשר' : 'חומש'} {periodWord}</dt>
                <dd>{formatShekels(result.owed)}</dd>
              </div>
              <div>
                <dt>סך ההכנסות</dt>
                <dd>{formatShekels(result.totalIncome)}</dd>
              </div>
              <div>
                <dt>הוצאות שנוכו</dt>
                <dd>{formatShekels(result.deductions)}</dd>
              </div>
              <div>
                <dt>הסכום שממנו מפרישים</dt>
                <dd>{formatShekels(result.base)}</dd>
              </div>
              {period === 'month' ? (
                <div>
                  <dt>בקצב הזה לשנה</dt>
                  <dd>{formatShekels(annualOwed)}</dd>
                </div>
              ) : null}
              <div>
                <dt>נתתם לפי היומן</dt>
                <dd>{formatShekels(given)}</dd>
              </div>
              <div className={balance > 0 ? styles.owed : styles.clear}>
                <dt>{balance > 0 ? 'נותר לתת' : 'נתתם מעבר לחשבון'}</dt>
                <dd>{formatShekels(Math.abs(balance))}</dd>
              </div>
            </dl>
            {credit > 0 ? (
              <p className={ui.note}>
                אם התרומות השנה, {formatShekels(givenThisYear)}, ניתנו למוסדות עם אישור לפי סעיף 46, הזיכוי ממס יכול
                להגיע לכ-{formatShekels(credit)}, בכפוף לתקרה של 30% מההכנסה החייבת.
              </p>
            ) : null}

            {ledger.length ? (
              <ul className={styles.ledger} aria-label="תרומות ביומן">
                {ledger.map((item) => (
                  <li key={item.id}>
                    <span className={styles.ledgerDate}>{item.date.split('-').reverse().join('.')}</span>
                    <span className={styles.ledgerNote}>{item.note || 'צדקה'}</span>
                    <span className={styles.ledgerAmount}>{formatShekels(item.amount)}</span>
                    <button
                      type="button"
                      className={styles.remove}
                      onClick={() => removeDonation(item.id)}
                      aria-label={`מחיקת ${formatShekels(item.amount)} מ-${item.date}`}
                    >
                      מחיקה
                    </button>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  )
}
