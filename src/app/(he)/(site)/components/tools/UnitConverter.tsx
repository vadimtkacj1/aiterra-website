'use client'

import { useId, useState } from 'react'
import { ArrowUpDown } from 'lucide-react'
import {
  convert,
  formatAmount,
  quantityLabels,
  unitById,
  unitsOf,
  type Quantity,
} from '@/lib/unit-converter'
import { NumberField, RadioTiles, parseNumber } from './ToolFields'
import ui from './toolUi.module.css'
import styles from './ToolFields.module.css'

const quantityOptions = (Object.keys(quantityLabels) as Quantity[]).map((value) => ({
  id: value,
  label: quantityLabels[value],
}))

const firstPair: Record<Quantity, [string, string]> = {
  length: ['inch', 'cm'],
  area: ['dunam', 'sqm'],
  volume: ['gallon', 'liter'],
  weight: ['ounce', 'gram'],
}

export default function UnitConverter({ from: initialFrom = 'dunam', to: initialTo = 'sqm' }: { from?: string; to?: string }) {
  const quantityName = useId()
  const valueId = useId()
  const fromFieldId = useId()
  const toFieldId = useId()
  const [quantity, setQuantity] = useState<Quantity>(unitById(initialFrom)?.quantity ?? 'area')
  const [fromUnitId, setFrom] = useState(initialFrom)
  const [toUnitId, setTo] = useState(initialTo)
  const [text, setText] = useState('1')

  const from = unitById(fromUnitId)
  const to = unitById(toUnitId)
  const value = parseNumber(text)
  const result = value !== null && from && to ? convert(value, from, to) : null
  const options = unitsOf(quantity)

  const changeQuantity = (next: Quantity) => {
    setQuantity(next)
    setFrom(firstPair[next][0])
    setTo(firstPair[next][1])
  }

  const select = (id: string, label: string, current: string, onChange: (next: string) => void) => (
    <div className={ui.field}>
      <label htmlFor={id} className={ui.label}>
        {label}
      </label>
      <select id={id} className={ui.input} value={current} onChange={(event) => onChange(event.target.value)}>
        {options.map((unit) => (
          <option key={unit.id} value={unit.id}>
            {unit.name} ({unit.symbol})
          </option>
        ))}
      </select>
    </div>
  )

  return (
    <section className={ui.tool} aria-label="ממיר יחידות">
      <div className={ui.inner}>
        <form className={ui.form} onSubmit={(event) => event.preventDefault()}>
          <RadioTiles<Quantity>
            legend="מה ממירים"
            name={quantityName}
            options={quantityOptions}
            value={quantity}
            onChange={changeQuantity}
          />
          <fieldset className={ui.group}>
            <legend className={ui.legend}>ההמרה</legend>
            <NumberField id={valueId} label="כמות" value={text} step="any" onChange={setText} />
            {select(fromFieldId, 'מיחידה', fromUnitId, setFrom)}
            <button
              type="button"
              className={ui.secondary}
              onClick={() => {
                setFrom(toUnitId)
                setTo(fromUnitId)
              }}
            >
              <ArrowUpDown aria-hidden="true" />
              החלפת כיוון
            </button>
            {select(toFieldId, 'ליחידה', toUnitId, setTo)}
          </fieldset>
        </form>

        <div className={ui.output}>
          <h2 className={ui.outputTitle}>התוצאה</h2>
          {result === null || !from || !to ? (
            <p className={ui.note}>הזינו מספר כדי לקבל תוצאה.</p>
          ) : (
            <div aria-live="polite">
              <p className={styles.resultLabel}>
                {formatAmount(value ?? 0)} {from.name} =
              </p>
              <p className={styles.result}>
                {formatAmount(result)} {to.symbol}
              </p>
              <p className={ui.note}>
                1 {from.name} = {formatAmount(convert(1, from, to))} {to.name}
              </p>
            </div>
          )}
          <p className={ui.note}>ההמרה מחושבת לפי ההגדרות הרשמיות של כל יחידה, בדפדפן שלכם.</p>
        </div>
      </div>
    </section>
  )
}
