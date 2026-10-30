'use client'

import { useId, useMemo, useState } from 'react'
import { businessCalculatorBySlug, type CalcLine } from '@/lib/business-calculators'
import { parseNumber } from '@/lib/bmi'
import { Field } from './FunTiles'
import { Rows } from './BodyCalculators'
import ui from './toolUi.module.css'
import fun from './FunTool.module.css'
import styles from './BmiCalculator.module.css'

const SHEKEL = new Intl.NumberFormat('he-IL', { maximumFractionDigits: 0 })
const DECIMAL = new Intl.NumberFormat('he-IL', { maximumFractionDigits: 1 })

const formatLine = ({ kind, value }: CalcLine) => {
  if (kind === 'money') return `${SHEKEL.format(value)} ₪`
  if (kind === 'percent') return `${DECIMAL.format(value)}%`
  if (kind === 'months') return `${DECIMAL.format(value)} חודשים`
  return DECIMAL.format(value)
}

export default function BusinessScenario({ slug }: { slug: string }) {
  const prefix = useId()
  const calculator = businessCalculatorBySlug(slug)
  const [texts, setTexts] = useState<Record<string, string>>(() =>
    Object.fromEntries((calculator?.fields ?? []).map(({ id, example }) => [id, String(example)])),
  )

  const result = useMemo(() => {
    if (!calculator) return null
    const values: Record<string, number> = {}
    for (const { id } of calculator.fields) {
      const value = parseNumber(texts[id] ?? '')
      if (value === null || value < 0) return null
      values[id] = value
    }
    return calculator.compute(values)
  }, [calculator, texts])

  if (!calculator) return null

  return (
    <section className={ui.tool} aria-label={calculator.title}>
      <div className={ui.inner}>
        <form className={ui.form} onSubmit={(event) => event.preventDefault()}>
          {calculator.fields.map(({ id, label }) => (
            <Field key={id} id={`${prefix}${id}`} label={label}>
              <input
                id={`${prefix}${id}`}
                type="text"
                inputMode="decimal"
                className={`${ui.input} ${ui.ltr}`}
                value={texts[id]}
                onChange={(event) => setTexts({ ...texts, [id]: event.target.value })}
              />
            </Field>
          ))}
        </form>
        <div className={ui.output} aria-live="polite">
          <h2 className={ui.outputTitle}>התוצאה</h2>
          {result ? (
            <>
              <div className={fun.card}>
                <p className={styles.label}>{result.main.label}</p>
                <p className={styles.value}>
                  <span className={styles.number}>{formatLine(result.main)}</span>
                </p>
                <p className={styles.meta}>{result.verdict.text}</p>
              </div>
              {result.lines.length ? (
                <Rows label="פירוט" rows={result.lines.map((line) => [line.label, formatLine(line)])} />
              ) : null}
            </>
          ) : (
            <p className={fun.panel}>מלאו את כל השדות במספרים.</p>
          )}
        </div>
      </div>
    </section>
  )
}
