import type { ReactNode } from 'react'
import ui from './toolUi.module.css'
import styles from './ToolFields.module.css'

export function RadioTiles<T extends string>({
  legend,
  name,
  options,
  value,
  onChange,
}: {
  legend: string
  name: string
  options: { id: T; label: string; hint?: string }[]
  value: T
  onChange: (next: T) => void
}) {
  return (
    <fieldset className={ui.group}>
      <legend className={ui.legend}>{legend}</legend>
      <div className={styles.tiles}>
        {options.map((option) => (
          <label key={option.id} className={styles.tile}>
            <input
              type="radio"
              name={name}
              value={option.id}
              checked={value === option.id}
              onChange={() => onChange(option.id)}
            />
            <span className={styles.tileLabel}>{option.label}</span>
            {option.hint ? <span className={styles.tileHint}>{option.hint}</span> : null}
          </label>
        ))}
      </div>
    </fieldset>
  )
}

export function TextField({
  id,
  label,
  value,
  onChange,
  type,
  hint,
  multiline,
}: {
  id: string
  label: string
  value: string
  onChange: (next: string) => void
  type?: 'text' | 'date' | 'time'
  hint?: ReactNode
  multiline?: boolean
}) {
  const hintId = `${id}-hint`
  const common = {
    id,
    value,
    'aria-describedby': hint ? hintId : undefined,
  }
  return (
    <div className={ui.field}>
      <label htmlFor={id} className={ui.label}>
        {label}
      </label>
      {hint ? (
        <p id={hintId} className={ui.hint}>
          {hint}
        </p>
      ) : null}
      {multiline ? (
        <textarea
          {...common}
          className={`${ui.input} ${ui.textarea}`}
          onChange={(event) => onChange(event.target.value)}
        />
      ) : (
        <input
          {...common}
          type={type ?? 'text'}
          autoComplete="off"
          className={type === 'date' || type === 'time' ? `${ui.input} ${ui.date}` : ui.input}
          onChange={(event) => onChange(event.target.value)}
        />
      )}
    </div>
  )
}

export function NumberField({
  id,
  label,
  value,
  onChange,
  min,
  max,
  step,
  hint,
}: {
  id: string
  label: string
  value: string
  onChange: (next: string) => void
  min?: number
  max?: number
  step?: number | 'any'
  hint?: ReactNode
}) {
  const hintId = `${id}-hint`
  return (
    <div className={ui.field}>
      <label htmlFor={id} className={ui.label}>
        {label}
      </label>
      {hint ? (
        <p id={hintId} className={ui.hint}>
          {hint}
        </p>
      ) : null}
      <input
        id={id}
        type="number"
        inputMode="decimal"
        className={`${ui.input} ${ui.ltr}`}
        min={min}
        max={max}
        step={step ?? 'any'}
        value={value}
        aria-describedby={hint ? hintId : undefined}
        onChange={(event) => onChange(event.target.value)}
      />
    </div>
  )
}

export function Check({
  id,
  label,
  checked,
  onChange,
}: {
  id: string
  label: string
  checked: boolean
  onChange: (next: boolean) => void
}) {
  return (
    <label htmlFor={id} className={ui.option}>
      <input
        id={id}
        type="checkbox"
        className={ui.checkbox}
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
      />
      <span>{label}</span>
    </label>
  )
}

export const parseNumber = (value: string) => {
  const parsed = Number(value.trim().replace(',', '.'))
  return value.trim() === '' || !Number.isFinite(parsed) ? null : parsed
}
