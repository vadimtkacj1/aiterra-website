'use client'

import { useId, useMemo, useState, type CSSProperties } from 'react'
import { Printer, Shuffle } from 'lucide-react'
import {
  DEFAULT_TABLE_SEED,
  DEFAULT_TABLE_TITLE,
  TABLE_SIZES,
  buildTable,
  rowColor,
  tablePrintDocument,
  type TableFill,
  type TableSize,
} from '@/lib/multiplication-table'
import { freshSeed, openPrint } from '@/lib/print-frame'
import ui from './toolUi.module.css'
import styles from './MultiplicationTable.module.css'

const sizeLabels: Record<TableSize, string> = {
  10: 'עד 10 על 10 (עד 100)',
  12: 'עד 12 על 12 (עד 144)',
  20: 'עד 20 על 20 (עד 400)',
}

const fillOptions: { value: TableFill; label: string }[] = [
  { value: 'full', label: 'לוח מלא' },
  { value: 'empty', label: 'לוח ריק למילוי' },
  { value: 'partial', label: 'חצי ריק לתרגול' },
]

const previewCell: Record<TableSize, { cell: number; font: number; narrowFont: number }> = {
  10: { cell: 38, font: 15, narrowFont: 11 },
  12: { cell: 34, font: 13, narrowFont: 9 },
  20: { cell: 26, font: 8, narrowFont: 8 },
}

export default function MultiplicationTable() {
  const baseId = useId()
  const [size, setSize] = useState<TableSize>(10)
  const [fill, setFill] = useState<TableFill>('full')
  const [color, setColor] = useState(true)
  const [title, setTitle] = useState(DEFAULT_TABLE_TITLE)
  const [seed, setSeed] = useState(DEFAULT_TABLE_SEED)

  const table = useMemo(() => buildTable({ size, fill, seed }), [size, fill, seed])
  const { cell, font, narrowFont } = previewCell[size]
  const tableStyle = {
    '--cell': `${cell}px`,
    '--columns': size + 1,
    '--font': `${font}px`,
    '--narrow-font': `${narrowFont}px`,
  } as CSSProperties

  const print = () => {
    openPrint(tablePrintDocument({ size, fill, color, title, seed }))
    window.gtag?.('event', 'multiplication_table_print', { size, fill })
  }

  return (
    <section className={ui.tool} aria-labelledby={`${baseId}-title`}>
      <div className={ui.inner}>
        <div className={ui.form}>
          <fieldset className={ui.group}>
            <legend className={ui.legend} id={`${baseId}-title`}>
              גודל הלוח
            </legend>
            <div className={`${styles.segmented} ${styles.sizes}`}>
              {TABLE_SIZES.map((option) => (
                <label key={option} className={ui.option}>
                  <input
                    type="radio"
                    className={ui.checkbox}
                    name={`${baseId}-size`}
                    checked={size === option}
                    onChange={() => setSize(option)}
                  />
                  {sizeLabels[option]}
                </label>
              ))}
            </div>
          </fieldset>

          <fieldset className={ui.group}>
            <legend className={ui.legend}>מה מודפס בלוח</legend>
            <div className={styles.segmented}>
              {fillOptions.map((option) => (
                <label key={option.value} className={ui.option}>
                  <input
                    type="radio"
                    className={ui.checkbox}
                    name={`${baseId}-fill`}
                    checked={fill === option.value}
                    onChange={() => setFill(option.value)}
                  />
                  {option.label}
                </label>
              ))}
            </div>
            <label className={ui.option}>
              <input
                type="checkbox"
                className={ui.checkbox}
                checked={color}
                onChange={(event) => setColor(event.target.checked)}
              />
              צבעוני, צבע לכל שורה
            </label>
            <div className={ui.field}>
              <label className={ui.label} htmlFor={`${baseId}-heading`}>
                כותרת בראש הדף
              </label>
              <input
                id={`${baseId}-heading`}
                className={ui.input}
                maxLength={60}
                value={title}
                onChange={(event) => setTitle(event.target.value)}
              />
            </div>
          </fieldset>
        </div>

        <div className={ui.output}>
          <div className={ui.sticky}>
            <h2 className={ui.outputTitle}>הלוח להדפסה</h2>
            <div className={ui.actions}>
              <button type="button" className={ui.primary} onClick={print}>
                <Printer aria-hidden="true" />
                הדפסה או שמירה כ-PDF
              </button>
              {fill === 'partial' ? (
                <button type="button" className={ui.secondary} onClick={() => setSeed(freshSeed())}>
                  <Shuffle aria-hidden="true" />
                  משבצות ריקות אחרות
                </button>
              ) : null}
            </div>
            <div className={`${ui.paper} ${styles.preview}`} tabIndex={0} aria-label="תצוגה מקדימה של לוח הכפל">
              {title.trim() ? <p className={styles.previewTitle}>{title}</p> : null}
              <div className={styles.scroll} dir="ltr">
                <table className={`${styles.table} ${color ? styles.color : ''}`} style={tableStyle}>
                  <thead>
                    <tr>
                      <th scope="col">×</th>
                      {table[0].map((entry) => (
                        <th key={entry.column} scope="col">
                          {entry.column}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {table.map((row) => (
                      <tr key={row[0].row} style={color ? { background: rowColor(row[0].row) } : undefined}>
                        <th scope="row">{row[0].row}</th>
                        {row.map((entry) => (
                          <td key={entry.column}>{entry.shown ? entry.product : ''}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
