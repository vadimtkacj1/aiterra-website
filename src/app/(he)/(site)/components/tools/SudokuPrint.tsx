'use client'

import { useId, useMemo, useState, type CSSProperties } from 'react'
import { Printer, Shuffle } from 'lucide-react'
import {
  DEFAULT_PUZZLES,
  DEFAULT_SUDOKU_SEED,
  DEFAULT_SUDOKU_TITLE,
  MAX_PUZZLES,
  MIN_PUZZLES,
  PER_PAGE_OPTIONS,
  SUDOKU_LEVELS,
  SUDOKU_SIZES,
  cellEdges,
  clampPuzzles,
  cluesIn,
  generatePuzzle,
  levelLabels,
  sudokuPrintDocument,
  type PerPage,
  type SudokuLevel,
  type SudokuSize,
} from '@/lib/sudoku'
import { freshSeed, openPrint } from '@/lib/print-frame'
import ui from './toolUi.module.css'
import styles from './SudokuPrint.module.css'

const sizeLabels: Record<SudokuSize, string> = {
  9: '9 על 9, קלאסי',
  6: '6 על 6, לילדים',
  4: '4 על 4, לקטנים',
}

const previewFont: Record<SudokuSize, number> = { 9: 20, 6: 26, 4: 34 }

export default function SudokuPrint() {
  const baseId = useId()
  const [size, setSize] = useState<SudokuSize>(9)
  const [level, setLevel] = useState<SudokuLevel>('easy')
  const [countText, setCountText] = useState(String(DEFAULT_PUZZLES))
  const [perPage, setPerPage] = useState<PerPage>(4)
  const [title, setTitle] = useState(DEFAULT_SUDOKU_TITLE)
  const [seed, setSeed] = useState(DEFAULT_SUDOKU_SEED)

  const count = clampPuzzles(Number(countText))
  const blank = level === 'blank'
  const pages = Math.ceil(count / perPage)
  const first = useMemo(() => generatePuzzle(size, level, seed, 1), [size, level, seed])
  const rows = Array.from({ length: size }, (_, row) => first.cells.slice(row * size, (row + 1) * size))
  const boardStyle = { '--font': `${previewFont[size]}px`, '--cells': size } as CSSProperties

  const print = (withSolutions: boolean) => {
    openPrint(sudokuPrintDocument({ size, level, count, perPage, title, seed }, withSolutions))
    window.gtag?.('event', 'sudoku_print', { size, level, count, solutions: withSolutions })
  }

  return (
    <section className={ui.tool} aria-labelledby={`${baseId}-title`}>
      <div className={ui.inner}>
        <div className={ui.form}>
          <fieldset className={ui.group}>
            <legend className={ui.legend} id={`${baseId}-title`}>
              גודל הלוח
            </legend>
            <div className={styles.segmented}>
              {SUDOKU_SIZES.map((option) => (
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
            <legend className={ui.legend}>רמת קושי</legend>
            <div className={`${styles.segmented} ${styles.levels}`}>
              {SUDOKU_LEVELS.map((option) => (
                <label key={option} className={ui.option}>
                  <input
                    type="radio"
                    className={ui.checkbox}
                    name={`${baseId}-level`}
                    checked={level === option}
                    onChange={() => setLevel(option)}
                  />
                  {levelLabels[option]}
                </label>
              ))}
            </div>
          </fieldset>

          <fieldset className={ui.group}>
            <legend className={ui.legend}>הדפים</legend>
            <div className={styles.pair}>
              <div className={ui.field}>
                <label className={ui.label} htmlFor={`${baseId}-count`}>
                  מספר לוחות
                </label>
                <input
                  id={`${baseId}-count`}
                  className={ui.input}
                  type="number"
                  inputMode="numeric"
                  min={MIN_PUZZLES}
                  max={MAX_PUZZLES}
                  value={countText}
                  onChange={(event) => setCountText(event.target.value)}
                />
              </div>
              <div className={ui.field}>
                <label className={ui.label} htmlFor={`${baseId}-heading`}>
                  כותרת הדף
                </label>
                <input
                  id={`${baseId}-heading`}
                  className={ui.input}
                  maxLength={60}
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                />
              </div>
            </div>
            <fieldset className={ui.group}>
              <legend className={ui.legend}>לוחות בדף A4</legend>
              <div className={styles.perPage}>
                {PER_PAGE_OPTIONS.map((option) => (
                  <label key={option} className={ui.option}>
                    <input
                      type="radio"
                      className={ui.checkbox}
                      name={`${baseId}-per-page`}
                      checked={perPage === option}
                      onChange={() => setPerPage(option)}
                    />
                    {option}
                  </label>
                ))}
              </div>
            </fieldset>
          </fieldset>
        </div>

        <div className={ui.output}>
          <div className={ui.sticky}>
            <h2 className={ui.outputTitle}>
              {count === 1 ? 'לוח אחד מוכן' : `${count} לוחות מוכנים`}, {pages === 1 ? 'עמוד אחד' : `${pages} עמודים`}
            </h2>
            <div className={ui.actions}>
              {blank ? null : (
                <button type="button" className={ui.primary} onClick={() => print(true)}>
                  <Printer aria-hidden="true" />
                  הדפסה עם פתרונות
                </button>
              )}
              <button type="button" className={blank ? ui.primary : ui.secondary} onClick={() => print(false)}>
                <Printer aria-hidden="true" />
                {blank ? 'הדפסה' : 'בלי פתרונות'}
              </button>
              {blank ? null : (
                <button type="button" className={ui.secondary} onClick={() => setSeed(freshSeed())}>
                  <Shuffle aria-hidden="true" />
                  לוחות חדשים
                </button>
              )}
            </div>
            <div className={`${ui.paper} ${styles.preview}`} tabIndex={0} aria-label="תצוגה מקדימה של הלוח הראשון">
              {title.trim() ? <p className={styles.previewTitle}>{title}</p> : null}
              <div className={styles.boardWrap} dir="ltr">
                <table className={styles.board} style={boardStyle}>
                  <tbody>
                    {rows.map((row, rowIndex) => (
                      <tr key={rowIndex}>
                        {row.map((value, columnIndex) => {
                          const edges = cellEdges(size, rowIndex * size + columnIndex)
                          const className = [edges.boxEnd ? styles.boxEnd : '', edges.boxBottom ? styles.boxBottom : '']
                            .filter(Boolean)
                            .join(' ')
                          return (
                            <td key={columnIndex} className={className || undefined}>
                              {value || ''}
                            </td>
                          )
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {blank ? null : (
                <p className={styles.more}>
                  בלוח הראשון {cluesIn(first)} מספרים נתונים מתוך {size * size}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
