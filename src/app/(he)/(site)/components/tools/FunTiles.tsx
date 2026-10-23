import type { ReactNode } from 'react'
import ui from './toolUi.module.css'
import styles from './FunTool.module.css'

export type TileOption<T extends string> = { id: T; label: string; hint?: string }

export function TileGroup<T extends string>({
  legend,
  name,
  options,
  value,
  onChange,
  columns = 'three',
}: {
  legend: string
  name: string
  options: TileOption<T>[]
  value: T
  onChange: (next: T) => void
  columns?: 'two' | 'three' | 'wide'
}) {
  const layout =
    columns === 'wide' ? styles.tilesWide : columns === 'two' ? `${styles.tiles} ${styles.tilesTwo}` : styles.tiles
  return (
    <fieldset className={ui.group}>
      <legend className={ui.legend}>{legend}</legend>
      <div className={layout}>
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

export function Field({
  id,
  label,
  hint,
  hintId,
  children,
}: {
  id: string
  label: string
  hint?: ReactNode
  hintId?: string
  children: ReactNode
}) {
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
      {children}
    </div>
  )
}
