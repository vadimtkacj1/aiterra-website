'use client'

import { useMemo, useState } from 'react'
import {
  TIP_PRESETS,
  calculateSplit,
  defaultSplitInput,
  formatShekels,
  formatTipPercent,
  parseMoney,
  parsePeople,
  parseTip,
  resizeOrders,
  splitToText,
  type RoundingMode,
  type SplitInput,
  type SplitMode,
} from '@/lib/bill-split'
import { BizChoice, BizNumberField, BizResults, copyText } from './BizCalcField'
import ui from './toolUi.module.css'
import styles from './BizCalc.module.css'

const modeOptions: { value: SplitMode; label: string; hint: string }[] = [
  { value: 'equal', label: 'שווה בשווה', hint: 'כולם משלמים אותו דבר' },
  { value: 'items', label: 'לפי מה שהזמינו', hint: 'כל סועד עם הסכום שלו' },
]

const roundingOptions: { value: RoundingMode; label: string; hint: string }[] = [
  { value: 'exact', label: 'לאגורה', hint: 'בלי עיגול' },
  { value: 'shekel', label: 'לשקל שלם', hint: 'כלפי מעלה' },
  { value: 'five', label: 'ל-5 ₪', hint: 'כלפי מעלה' },
]

const moneyError = (value: string) => {
  const parsed = parseMoney(value)
  if (parsed.ok || parsed.empty) return ''
  return 'הקלידו סכום חיובי, עם נקודה לאגורות.'
}

export default function BillSplitCalculator() {
  const [input, setInput] = useState<SplitInput>(defaultSplitInput)
  const [status, setStatus] = useState('')
  const outcome = useMemo(() => calculateSplit(input), [input])
  const people = parsePeople(input.people)
  const update = <K extends keyof SplitInput>(key: K, value: SplitInput[K]) =>
    setInput((current) => ({ ...current, [key]: value }))
  const updateOrder = (index: number, value: string) =>
    setInput((current) => {
      const orders = resizeOrders(current.orders, parsePeople(current.people) ?? current.orders.length)
      orders[index] = value
      return { ...current, orders }
    })
  const tipError = parseTip(input.tip)
  const orders = people ? resizeOrders(input.orders, people) : []

  return (
    <section className={ui.tool} aria-label="חישוב טיפ וחלוקת חשבון">
      <div className={ui.inner}>
        <form className={ui.form} onSubmit={(event) => event.preventDefault()}>
          <BizChoice
            legend="איך מחלקים"
            name="split-mode"
            options={modeOptions}
            value={input.mode}
            onChange={(value) => update('mode', value)}
          />
          <fieldset className={ui.group}>
            <legend className={ui.legend}>החשבון והטיפ</legend>
            <div className={styles.grid}>
              {input.mode === 'equal' ? (
                <BizNumberField
                  label="סכום החשבון"
                  suffix="₪"
                  hint="לפני הטיפ"
                  value={input.total}
                  error={moneyError(input.total)}
                  onChange={(value) => update('total', value)}
                />
              ) : (
                <BizNumberField
                  label="מנות משותפות (לא חובה)"
                  suffix="₪"
                  hint="מתחלקות שווה בשווה"
                  value={input.shared}
                  error={moneyError(input.shared)}
                  onChange={(value) => update('shared', value)}
                />
              )}
              <BizNumberField
                label="מספר סועדים"
                hint="עד 12"
                inputMode="numeric"
                maxLength={3}
                value={input.people}
                error={input.people.trim() && people === null ? 'הקלידו מספר שלם בין 1 ל-12.' : ''}
                onChange={(value) => update('people', value)}
              />
              <BizNumberField
                label="אחוז טיפ"
                suffix="%"
                value={input.tip}
                error={!tipError.ok && !tipError.empty ? 'הקלידו אחוז בין 0 ל-100.' : ''}
                onChange={(value) => update('tip', value)}
              />
            </div>
            <div className={ui.actions}>
              {TIP_PRESETS.map((preset) => (
                <button
                  key={preset}
                  type="button"
                  className={input.tip === preset ? ui.primary : ui.secondary}
                  aria-pressed={input.tip === preset}
                  onClick={() => update('tip', preset)}
                >
                  {preset}%
                </button>
              ))}
            </div>
          </fieldset>
          {input.mode === 'items' && people ? (
            <fieldset className={ui.group}>
              <legend className={ui.legend}>מה כל אחד הזמין</legend>
              <div className={styles.grid}>
                {orders.map((value, index) => (
                  <BizNumberField
                    key={index}
                    label={`סועד ${index + 1}`}
                    suffix="₪"
                    value={value}
                    error={moneyError(value)}
                    onChange={(next) => updateOrder(index, next)}
                  />
                ))}
              </div>
            </fieldset>
          ) : null}
          <BizChoice
            legend="עיגול לכל סועד"
            name="split-rounding"
            options={roundingOptions}
            value={input.rounding}
            onChange={(value) => update('rounding', value)}
          />
        </form>

        <div className={ui.output}>
          <div className={ui.sticky}>
            <h2 className={ui.outputTitle}>כמה כל אחד משלם</h2>
            {outcome.kind === 'result' ? (
              <>
                <BizResults
                  rows={[
                    ...(outcome.shares.every((share) => share.pay === outcome.shares[0].pay)
                      ? [{ term: 'כל סועד משלם', value: formatShekels(outcome.shares[0].pay), main: true }]
                      : outcome.shares.map((share) => ({
                          term: `סועד ${share.index + 1}`,
                          value: formatShekels(share.pay),
                          main: false,
                        }))),
                    { term: 'חשבון לפני טיפ', value: formatShekels(outcome.bill) },
                    { term: `טיפ ${formatTipPercent(outcome.tipBasisPoints)}`, value: formatShekels(outcome.tip) },
                    { term: 'סה״כ כולל טיפ', value: formatShekels(outcome.grand) },
                  ]}
                />
                {outcome.roundingExtra > 0 ? (
                  <p className={styles.notice}>
                    בגלל העיגול נאסף {formatShekels(outcome.roundingExtra)} יותר מהסכום. הוא הולך לטיפ.
                  </p>
                ) : null}
              </>
            ) : (
              <p className={styles.message}>
                {outcome.kind === 'impossible' ? outcome.message : 'הקלידו סכום, אחוז טיפ ומספר סועדים כדי לראות את התוצאה.'}
              </p>
            )}
            <div className={ui.actions}>
              <button
                type="button"
                className={ui.primary}
                onClick={() =>
                  outcome.kind === 'result'
                    ? copyText(splitToText(outcome), setStatus, 'התוצאה הועתקה')
                    : setStatus('השלימו את השדות כדי להעתיק את התוצאה.')
                }
              >
                העתקת התוצאה
              </button>
            </div>
            <p className={ui.status} role="status" aria-live="polite">
              {status}
            </p>
            <p className={ui.note}>הטיפ מחושב מהחשבון כולו. החישוב נעשה בדפדפן ושום דבר לא נשמר.</p>
          </div>
        </div>
      </div>
    </section>
  )
}
