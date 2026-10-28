'use client'

import { useId, useState } from 'react'
import { ArrowUpDown } from 'lucide-react'
import { formatMoney } from '@/lib/currency-pages'
import { NumberField, parseNumber } from './ToolFields'
import ui from './toolUi.module.css'
import styles from './ToolFields.module.css'

export default function CurrencyConverter({ code, name, shekels }: { code: string; name: string; shekels: number | null }) {
  const amountId = useId()
  const [text, setText] = useState('100')
  const [toShekels, setToShekels] = useState(true)
  const amount = parseNumber(text)
  const result = amount === null || shekels === null ? null : toShekels ? amount * shekels : amount / shekels

  return (
    <section className={ui.tool} aria-label={`המרת ${name} לשקלים`}>
      <div className={ui.inner}>
        <form className={ui.form} onSubmit={(event) => event.preventDefault()}>
          <fieldset className={ui.group}>
            <legend className={ui.legend}>{toShekels ? `${name} לשקלים` : `שקלים ל${name}`}</legend>
            <NumberField
              id={amountId}
              label={toShekels ? `סכום ב${name} (${code})` : 'סכום בשקלים (₪)'}
              value={text}
              step="any"
              onChange={setText}
            />
            <button type="button" className={ui.secondary} onClick={() => setToShekels((current) => !current)}>
              <ArrowUpDown aria-hidden="true" />
              החלפת כיוון
            </button>
          </fieldset>
        </form>
        <div className={ui.output}>
          <h2 className={ui.outputTitle}>התוצאה</h2>
          {shekels === null ? (
            <p className={ui.note}>שער החליפין לא זמין כרגע. נסו לרענן בעוד כמה דקות.</p>
          ) : result === null ? (
            <p className={ui.note}>הזינו סכום כדי לקבל תוצאה.</p>
          ) : (
            <div aria-live="polite">
              <p className={styles.resultLabel}>
                {formatMoney(amount ?? 0)} {toShekels ? code : '₪'} =
              </p>
              <p className={styles.result}>
                {formatMoney(result)} {toShekels ? '₪' : code}
              </p>
            </div>
          )}
          <p className={ui.note}>
            שער אמצע שוק, מתעדכן פעם בשעה. בבנק, בכרטיס אשראי ובצ׳יינג׳ תקבלו שער פחות טוב בגלל מרווח ועמלות.
          </p>
        </div>
      </div>
    </section>
  )
}
