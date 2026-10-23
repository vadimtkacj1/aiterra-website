'use client'

import { useId, useState } from 'react'
import {
  MAX_CIRCUMFERENCE,
  MIN_CIRCUMFERENCE,
  circumferenceOf,
  convert,
  formatUs,
  inRange,
  modes,
  type RingMode,
} from '@/lib/ring-size-converter'
import { NumberField, RadioTiles, parseNumber } from './ToolFields'
import ui from './toolUi.module.css'
import styles from './ToolFields.module.css'

const oneDecimal = (value: number) => new Intl.NumberFormat('he-IL', { maximumFractionDigits: 1 }).format(value)

export default function RingSizeConverter() {
  const modeName = useId()
  const valueId = useId()
  const [mode, setMode] = useState<RingMode>('circumference')
  const [text, setText] = useState('54')

  const value = parseNumber(text)
  const circumference = value === null ? null : circumferenceOf(value, mode)
  const valid = circumference !== null && inRange(circumference)
  const sizes = valid && value !== null ? convert(value, mode) : null
  const minInput = mode === 'circumference' ? MIN_CIRCUMFERENCE : Math.ceil((MIN_CIRCUMFERENCE / Math.PI) * 10) / 10
  const maxInput = mode === 'circumference' ? MAX_CIRCUMFERENCE : Math.floor((MAX_CIRCUMFERENCE / Math.PI) * 10) / 10

  return (
    <section className={ui.tool} aria-label="ממיר מידת טבעת">
      <div className={ui.inner}>
        <form className={ui.form} onSubmit={(event) => event.preventDefault()}>
          <RadioTiles<RingMode>
            legend="מה מודדים"
            name={modeName}
            options={modes}
            value={mode}
            onChange={setMode}
          />
          <fieldset className={ui.group}>
            <legend className={ui.legend}>המידה</legend>
            <NumberField
              id={valueId}
              label={mode === 'circumference' ? 'היקף האצבע (מ״מ)' : 'קוטר פנימי של הטבעת (מ״מ)'}
              hint={`בין ${oneDecimal(minInput)} ל-${oneDecimal(maxInput)} מ״מ`}
              value={text}
              min={minInput}
              max={maxInput}
              step={0.1}
              onChange={setText}
            />
          </fieldset>
        </form>

        <div className={ui.output}>
          <h2 className={ui.outputTitle}>המידה בכל השיטות</h2>
          {!sizes ? (
            <p className={ui.note}>
              {text.trim() === ''
                ? 'הזינו מידה במילימטרים כדי לקבל תוצאה.'
                : `הערך מחוץ לטווח הטבלה. הזינו מידה בין ${oneDecimal(minInput)} ל-${oneDecimal(maxInput)} מ״מ.`}
            </p>
          ) : (
            <div aria-live="polite">
              <p className={styles.resultLabel}>מידה אירופית לפי תקן ISO 8653 (היקף פנימי במ״מ)</p>
              <p className={styles.result}>
                <span dir="ltr">{sizes.iso}</span>
              </p>
              <ul className={styles.stats}>
                <li className={styles.stat}>
                  <span className={styles.statValue} dir="ltr">
                    {formatUs(sizes.us)}
                  </span>
                  <span className={styles.statLabel}>ארה״ב וקנדה</span>
                </li>
                <li className={styles.stat}>
                  <span className={styles.statValue} dir="ltr">
                    {sizes.uk ?? 'מחוץ לטבלה'}
                  </span>
                  <span className={styles.statLabel}>בריטניה, אירלנד ואוסטרליה</span>
                </li>
                <li className={styles.stat}>
                  <span className={styles.statValue} dir="ltr">
                    {sizes.continental}
                  </span>
                  <span className={styles.statLabel}>איטליה, ספרד ושווייץ</span>
                </li>
                <li className={styles.stat}>
                  <span className={styles.statValue} dir="ltr">
                    {oneDecimal(sizes.diameter)} / {oneDecimal(sizes.circumference)}
                  </span>
                  <span className={styles.statLabel}>קוטר והיקף פנימי (מ״מ)</span>
                </li>
              </ul>
            </div>
          )}
          <p className={ui.note}>
            ההמרות מחושבות בנוסחאות ולא מקריאת טבלת יצרן, ומעוגלות לצעד של כל שיטה. שיטה בחנות מסוימת יכולה להיות
            שונה במעט, ולכן בדקו מול טבלת החנות או הצורף. החישוב נעשה בדפדפן.
          </p>
        </div>
      </div>
    </section>
  )
}
