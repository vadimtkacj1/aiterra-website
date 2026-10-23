'use client'

import { useId, useState } from 'react'
import {
  calculate,
  formatFraction,
  formatMixed,
  operations,
  parseOperand,
  toDecimal,
  type Fraction,
  type OperandInput,
  type Operation,
} from '@/lib/fractions-calculator'
import ui from './toolUi.module.css'
import styles from './FractionsCalculator.module.css'

const initialFirst: OperandInput = { whole: '1', numerator: '1', denominator: '2' }
const initialSecond: OperandInput = { whole: '', numerator: '3', denominator: '4' }

function Stacked({ fraction }: { fraction: Fraction }) {
  if (fraction.d === 1) return <span className={styles.whole}>{fraction.n}</span>
  return (
    <span className={styles.stack} aria-hidden="true">
      <span>{fraction.n}</span>
      <span>{fraction.d}</span>
    </span>
  )
}

export default function FractionsCalculator() {
  const [operation, setOperation] = useState<Operation>('add')
  const [first, setFirst] = useState<OperandInput>(initialFirst)
  const [second, setSecond] = useState<OperandInput>(initialSecond)
  const baseId = useId()

  const parsedFirst = parseOperand(first)
  const parsedSecond = parseOperand(second)
  const needsSecond = operation !== 'simplify'
  const inputsReady = parsedFirst.kind === 'ok' && (!needsSecond || parsedSecond.kind === 'ok')
  const outcome = inputsReady ? calculate(operation, parsedFirst, parsedSecond) : null

  const operandFields = (
    key: string,
    legend: string,
    value: OperandInput,
    setValue: (next: OperandInput) => void,
    parsed: ReturnType<typeof parseOperand>,
  ) => {
    const fields: { id: keyof OperandInput; label: string; maxLength: number }[] = [
      { id: 'whole', label: 'שלם (אם יש)', maxLength: 5 },
      { id: 'numerator', label: 'מונה', maxLength: 5 },
      { id: 'denominator', label: 'מכנה', maxLength: 4 },
    ]
    return (
      <fieldset className={ui.group}>
        <legend className={ui.legend}>{legend}</legend>
        <div className={styles.triple}>
          {fields.map((field) => (
            <div key={field.id} className={ui.field}>
              <label htmlFor={`${baseId}-${key}-${field.id}`} className={ui.label}>
                {field.label}
              </label>
              <input
                id={`${baseId}-${key}-${field.id}`}
                className={`${ui.input} ${ui.ltr}`}
                inputMode="numeric"
                autoComplete="off"
                maxLength={field.maxLength}
                value={value[field.id]}
                aria-invalid={parsed.kind === 'error' ? true : undefined}
                aria-describedby={parsed.kind === 'error' ? `${baseId}-${key}-error` : undefined}
                onChange={(event) => setValue({ ...value, [field.id]: event.target.value })}
              />
            </div>
          ))}
        </div>
        {parsed.kind === 'error' ? (
          <p id={`${baseId}-${key}-error`} className={styles.error}>
            {parsed.message}
          </p>
        ) : null}
      </fieldset>
    )
  }

  const symbol = operations.find((item) => item.value === operation)?.symbol ?? ''
  const resultMixed = outcome?.kind === 'ok' ? formatMixed(outcome.result) : null
  const resultDecimal = outcome?.kind === 'ok' ? toDecimal(outcome.result) : null

  return (
    <section className={ui.tool} aria-labelledby={`${baseId}-title`}>
      <div className={`${ui.inner} ${styles.inner}`}>
        <div className={ui.form}>
          <fieldset className={ui.group}>
            <legend id={`${baseId}-title`} className={ui.legend}>
              פעולה
            </legend>
            <div className={styles.choices}>
              {operations.map((item) => (
                <label key={item.value} className={styles.choice}>
                  <input
                    type="radio"
                    name={`${baseId}-operation`}
                    value={item.value}
                    checked={operation === item.value}
                    onChange={() => setOperation(item.value)}
                  />
                  <span>{item.label}</span>
                </label>
              ))}
            </div>
          </fieldset>

          {operandFields('first', needsSecond ? 'שבר ראשון' : 'השבר', first, setFirst, parsedFirst)}
          {needsSecond ? operandFields('second', 'שבר שני', second, setSecond, parsedSecond) : null}

          <div className={ui.group}>
            <h2 className={ui.legend}>התוצאה והפתרון</h2>
            <div aria-live="polite" aria-atomic="true">
              {outcome?.kind === 'ok' && resultDecimal ? (
                <div className={styles.card}>
                  <Stacked fraction={outcome.result} />
                  <p className={styles.facts}>
                    <span className={styles.srOnly}>
                      התוצאה:{' '}
                      {outcome.result.d === 1
                        ? outcome.result.n
                        : `${outcome.result.n} חלקי ${outcome.result.d}`}
                    </span>
                    <span>
                      התוצאה בכתיבה רגילה: <strong dir="ltr">{formatFraction(outcome.result)}</strong>
                    </span>
                    {resultMixed ? (
                      <span>
                        כמספר מעורב: <strong dir="ltr">{resultMixed}</strong>
                      </span>
                    ) : null}
                    <span>
                      כמספר עשרוני: {resultDecimal.exact ? '' : 'בערך '}
                      <strong dir="ltr">{resultDecimal.text}</strong>
                    </span>
                  </p>
                </div>
              ) : null}
              {outcome?.kind === 'error' ? <p className={styles.error}>{outcome.message}</p> : null}
              {!inputsReady && !outcome ? (
                <p className={ui.note}>הקלידו מונה ומכנה כדי לראות את התוצאה ואת שלבי הפתרון.</p>
              ) : null}
            </div>
            {outcome?.kind === 'ok' ? (
              <>
                <h3 className={ui.docHeading}>שלבי הפתרון {symbol ? `(${symbol})` : ''}</h3>
                <ol className={styles.steps}>
                  {outcome.steps.map((step) => (
                    <li key={`${step.text}-${step.math ?? ''}`}>
                      <p>{step.text}</p>
                      {step.math ? (
                        <span className={styles.math} dir="ltr">
                          {step.math}
                        </span>
                      ) : null}
                    </li>
                  ))}
                </ol>
              </>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  )
}
