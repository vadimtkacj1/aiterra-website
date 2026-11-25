'use client'

import { useId, useMemo, useState } from 'react'
import { Printer, Shuffle } from 'lucide-react'
import {
  DEFAULT_EXERCISES,
  DEFAULT_WORKSHEET_SEED,
  DEFAULT_WORKSHEET_TITLE,
  MAX_EXERCISES,
  MIN_EXERCISES,
  OPERATIONS,
  RANGES,
  clampExercises,
  exerciseText,
  generateExercises,
  operationLabels,
  presets,
  worksheetPrintDocument,
  type Operation,
  type WorksheetLayout,
  type WorksheetRange,
} from '@/lib/math-worksheet'
import { freshSeed, openPrint } from '@/lib/print-frame'
import ui from './toolUi.module.css'
import styles from './MathWorksheet.module.css'

const PREVIEW_COUNT = 12

const layoutOptions: { value: WorksheetLayout; label: string }[] = [
  { value: 'row', label: 'תרגילים בשורה' },
  { value: 'column', label: 'במאונך' },
  { value: 'missing', label: 'מספר חסר' },
]

const sameOperations = (first: Operation[], second: Operation[]) =>
  first.length === second.length && first.every((operation) => second.includes(operation))

export default function MathWorksheet() {
  const baseId = useId()
  const [operations, setOperations] = useState<Operation[]>(presets[1].operations)
  const [range, setRange] = useState<WorksheetRange>(presets[1].range)
  const [layout, setLayout] = useState<WorksheetLayout>('row')
  const [countText, setCountText] = useState(String(DEFAULT_EXERCISES))
  const [title, setTitle] = useState(DEFAULT_WORKSHEET_TITLE)
  const [seed, setSeed] = useState(DEFAULT_WORKSHEET_SEED)

  const count = clampExercises(Number(countText))
  const exercises = useMemo(
    () => generateExercises({ operations, range, layout, count, seed }),
    [operations, range, layout, count, seed],
  )

  const toggleOperation = (operation: Operation) => {
    setOperations((current) =>
      current.includes(operation)
        ? current.filter((item) => item !== operation)
        : OPERATIONS.filter((item) => item === operation || current.includes(item)),
    )
  }

  const print = (withAnswers: boolean) => {
    openPrint(worksheetPrintDocument({ operations, range, layout, count, title, seed }, withAnswers))
    window.gtag?.('event', 'math_worksheet_print', { range, layout, answers: withAnswers })
  }

  return (
    <section className={ui.tool} aria-labelledby={`${baseId}-title`}>
      <div className={ui.inner}>
        <div className={ui.form}>
          <fieldset className={ui.group}>
            <legend className={ui.legend} id={`${baseId}-title`}>
              דף מוכן
            </legend>
            <div className={styles.presets}>
              {presets.map((preset) => (
                <button
                  key={preset.id}
                  type="button"
                  className={styles.preset}
                  aria-pressed={range === preset.range && sameOperations(operations, preset.operations)}
                  onClick={() => {
                    setOperations(preset.operations)
                    setRange(preset.range)
                  }}
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </fieldset>

          <fieldset className={ui.group}>
            <legend className={ui.legend}>פעולות</legend>
            <div className={styles.segmented}>
              {OPERATIONS.map((operation) => {
                const unavailable = layout === 'column' && operation === 'divide'
                return (
                  <label key={operation} className={ui.option}>
                    <input
                      type="checkbox"
                      className={ui.checkbox}
                      checked={operations.includes(operation) && !unavailable}
                      disabled={unavailable}
                      onChange={() => toggleOperation(operation)}
                    />
                    {operationLabels[operation]}
                  </label>
                )
              })}
            </div>
          </fieldset>

          <fieldset className={ui.group}>
            <legend className={ui.legend}>טווח המספרים</legend>
            <div className={styles.segmented}>
              {RANGES.map((option) => (
                <label key={option} className={ui.option}>
                  <input
                    type="radio"
                    className={ui.checkbox}
                    name={`${baseId}-range`}
                    checked={range === option}
                    onChange={() => setRange(option)}
                  />
                  עד {option}
                </label>
              ))}
            </div>
          </fieldset>

          <fieldset className={ui.group}>
            <legend className={ui.legend}>צורת התרגיל</legend>
            <div className={styles.segmented}>
              {layoutOptions.map((option) => (
                <label key={option.value} className={ui.option}>
                  <input
                    type="radio"
                    className={ui.checkbox}
                    name={`${baseId}-layout`}
                    checked={layout === option.value}
                    onChange={() => setLayout(option.value)}
                  />
                  {option.label}
                </label>
              ))}
            </div>
            <div className={ui.row}>
              <div className={ui.field}>
                <label className={ui.label} htmlFor={`${baseId}-count`}>
                  מספר תרגילים
                </label>
                <input
                  id={`${baseId}-count`}
                  className={ui.input}
                  type="number"
                  inputMode="numeric"
                  min={MIN_EXERCISES}
                  max={MAX_EXERCISES}
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
          </fieldset>
        </div>

        <div className={ui.output}>
          <div className={ui.sticky}>
            <h2 className={ui.outputTitle}>{exercises.length ? `${exercises.length} תרגילים מוכנים` : 'בחרו פעולה'}</h2>
            {exercises.length ? (
              <>
                <div className={ui.actions}>
                  <button type="button" className={ui.primary} onClick={() => print(true)}>
                    <Printer aria-hidden="true" />
                    הדפסה עם דף תשובות
                  </button>
                  <button type="button" className={ui.secondary} onClick={() => print(false)}>
                    <Printer aria-hidden="true" />
                    בלי תשובות
                  </button>
                  <button type="button" className={ui.secondary} onClick={() => setSeed(freshSeed())}>
                    <Shuffle aria-hidden="true" />
                    תרגילים חדשים
                  </button>
                </div>
                <div className={`${ui.paper} ${styles.preview}`} tabIndex={0} aria-label="תצוגה מקדימה של דף העבודה">
                  {title.trim() ? <p className={styles.previewTitle}>{title}</p> : null}
                  <ol className={styles.exercises}>
                    {exercises.slice(0, PREVIEW_COUNT).map((exercise, index) => (
                      <li key={index} className={styles.exercise}>
                        <span className={styles.number}>{index + 1}.</span>
                        <bdi dir="ltr" className={styles.expression}>
                          {exerciseText(exercise)}
                        </bdi>
                      </li>
                    ))}
                  </ol>
                  {exercises.length > PREVIEW_COUNT ? (
                    <p className={styles.more}>ועוד {exercises.length - PREVIEW_COUNT} תרגילים בהדפסה</p>
                  ) : null}
                  {layout === 'column' ? <p className={styles.more}>בדף המודפס התרגילים כתובים במאונך.</p> : null}
                </div>
              </>
            ) : (
              <p className={ui.note} role="alert">
                {layout === 'column' ? 'במאונך אפשר לתרגל חיבור, חיסור או כפל. סמנו אחת מהן.' : 'סמנו לפחות פעולה אחת.'}
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
