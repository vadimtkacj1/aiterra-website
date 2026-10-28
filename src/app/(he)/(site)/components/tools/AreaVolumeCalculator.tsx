'use client'

import { useId, useState } from 'react'
import {
  SHAPES,
  UNITS,
  formatNumber,
  roomArea,
  shapeById,
  solveShape,
  unitById,
  type Dimension,
  type ShapeId,
  type Unit,
} from '@/lib/area-volume'
import { NumberField, RadioTiles, parseNumber } from './ToolFields'
import ShapeDiagram from './ShapeDiagram'
import ui from './toolUi.module.css'
import fieldStyles from './ToolFields.module.css'
import styles from './AreaVolumeCalculator.module.css'

type Mode = Dimension | 'room'

const MODES: { id: Mode; label: string }[] = [
  { id: 'area', label: 'שטח' },
  { id: 'volume', label: 'נפח' },
  { id: 'room', label: 'שטח חדר' },
]

const DEFAULT_VALUES: Record<string, string> = { a: '4', b: '3', c: '2', h: '2', r: '1', d1: '4', d2: '3', l: '5' }

const FIRST_SHAPE: Record<Dimension, ShapeId> = { area: 'rectangle', volume: 'cylinder' }

const Ltr = ({ children }: { children: string }) => (
  <bdi dir="ltr" className={styles.math}>
    {children}
  </bdi>
)

export default function AreaVolumeCalculator() {
  const modeName = useId()
  const shapeName = useId()
  const unitName = useId()
  const fieldId = useId()

  const [mode, setMode] = useState<Mode>('area')
  const [shapeId, setShapeId] = useState<ShapeId>('rectangle')
  const [unit, setUnit] = useState<Unit>('m')
  const [values, setValues] = useState<Record<string, string>>(DEFAULT_VALUES)
  const [room, setRoom] = useState({ length: '4', width: '3.5', height: '2.6', waste: '10' })

  const chooseMode = (next: Mode) => {
    setMode(next)
    if (next !== 'room') setShapeId(FIRST_SHAPE[next])
  }

  const shape = shapeById(shapeId)
  const unitLabel = unitById(unit).label
  const numbers = Object.fromEntries(shape.params.map(({ key }) => [key, parseNumber(values[key] ?? '') ?? Number.NaN]))
  const solution = mode === 'room' ? null : solveShape(shapeId, unit, numbers)
  const roomResult = roomArea(
    parseNumber(room.length) ?? Number.NaN,
    parseNumber(room.width) ?? Number.NaN,
    parseNumber(room.height) ?? 0,
    parseNumber(room.waste) ?? 0,
  )
  const power = shape.dimension === 'area' ? '²' : '³'

  return (
    <section className={ui.tool} aria-label="מחשבון שטח ונפח">
      <div className={ui.inner}>
        <form className={ui.form} onSubmit={(event) => event.preventDefault()}>
          <RadioTiles legend="מה מחשבים" name={modeName} options={MODES} value={mode} onChange={chooseMode} />

          {mode === 'room' ? (
            <fieldset className={ui.group}>
              <legend className={ui.legend}>מידות החדר במטרים</legend>
              <div className={fieldStyles.pair}>
                {(
                  [
                    ['length', 'אורך (מ׳)'],
                    ['width', 'רוחב (מ׳)'],
                    ['height', 'גובה תקרה (מ׳)'],
                    ['waste', 'תוספת פחת לריצוף (%)'],
                  ] as const
                ).map(([key, label]) => (
                  <NumberField
                    key={key}
                    id={`${fieldId}-room-${key}`}
                    label={label}
                    value={room[key]}
                    min={0}
                    onChange={(next) => setRoom((current) => ({ ...current, [key]: next }))}
                  />
                ))}
              </div>
            </fieldset>
          ) : (
            <>
              <RadioTiles
                legend="הצורה"
                name={shapeName}
                options={SHAPES.filter((item) => item.dimension === mode).map(({ id, name }) => ({ id, label: name }))}
                value={shapeId}
                onChange={setShapeId}
              />
              <RadioTiles
                legend="יחידת המידה של הנתונים"
                name={unitName}
                options={UNITS.map(({ id, label }) => ({ id, label }))}
                value={unit}
                onChange={setUnit}
              />
              <fieldset className={ui.group}>
                <legend className={ui.legend}>המידות ({unitLabel})</legend>
                <ShapeDiagram shape={shapeId} name={shape.name} />
                <div className={fieldStyles.pair}>
                  {shape.params.map(({ key, label }) => (
                    <NumberField
                      key={key}
                      id={`${fieldId}-${key}`}
                      label={label}
                      value={values[key] ?? ''}
                      min={0}
                      onChange={(next) => setValues((current) => ({ ...current, [key]: next }))}
                    />
                  ))}
                </div>
              </fieldset>
            </>
          )}
        </form>

        <div className={ui.output}>
          <div className={ui.sticky}>
            {mode === 'room' ? (
              <>
                <h2 className={ui.outputTitle}>שטח החדר</h2>
                {roomResult ? (
                  <div aria-live="polite">
                    <p className={fieldStyles.result}>{formatNumber(roomResult.floor)} מ״ר</p>
                    <p className={fieldStyles.resultLabel}>שטח רצפה</p>
                    <ul className={fieldStyles.stats}>
                      <li className={fieldStyles.stat}>
                        <span className={fieldStyles.statValue}>{formatNumber(roomResult.floorWithWaste)} מ״ר</span>
                        <span className={fieldStyles.statLabel}>ריצוף לקנייה כולל פחת</span>
                      </li>
                      <li className={fieldStyles.stat}>
                        <span className={fieldStyles.statValue}>{formatNumber(roomResult.walls)} מ״ר</span>
                        <span className={fieldStyles.statLabel}>קירות, בלי להפחית פתחים</span>
                      </li>
                      <li className={fieldStyles.stat}>
                        <span className={fieldStyles.statValue}>{formatNumber(roomResult.perimeter)} מ׳</span>
                        <span className={fieldStyles.statLabel}>היקף, לפנלים</span>
                      </li>
                    </ul>
                  </div>
                ) : (
                  <p className={ui.note} role="alert">
                    הקלידו אורך ורוחב גדולים מאפס.
                  </p>
                )}
              </>
            ) : (
              <>
                <h2 className={ui.outputTitle}>
                  {shape.dimension === 'area' ? 'שטח' : 'נפח'} {shape.name}
                </h2>
                {solution ? (
                  <div aria-live="polite">
                    <p className={fieldStyles.result}>
                      <Ltr>{`${formatNumber(solution.value)} ${unit}${power}`}</Ltr>
                    </p>
                    <ol className={styles.steps}>
                      <li>
                        הנוסחה: <Ltr>{solution.formula}</Ltr>
                      </li>
                      <li>
                        מציבים את המידות: <Ltr>{solution.substitution}</Ltr>
                      </li>
                      <li>
                        מחשבים: <Ltr>{`${formatNumber(solution.value)} ${unit}${power}`}</Ltr>
                      </li>
                      {solution.squareMeters !== undefined && unit !== 'm' ? (
                        <li>
                          ממירים למ״ר: מחלקים ב-{unit === 'cm' ? '10,000' : '1,000,000'} ומקבלים{' '}
                          <Ltr>{`${formatNumber(solution.squareMeters)} m²`}</Ltr>
                        </li>
                      ) : null}
                      {solution.cubicMeters !== undefined && unit !== 'm' ? (
                        <li>
                          ממירים למ״ק: מחלקים ב-{unit === 'cm' ? '1,000,000' : '1,000,000,000'} ומקבלים{' '}
                          <Ltr>{`${formatNumber(solution.cubicMeters)} m³`}</Ltr>
                        </li>
                      ) : null}
                      {solution.liters !== undefined ? (
                        <li>
                          לליטרים: מ״ק אחד הוא 1,000 ליטר, כלומר{' '}
                          <Ltr>{`${formatNumber(solution.liters)} L`}</Ltr>
                        </li>
                      ) : null}
                    </ol>
                    <ul className={fieldStyles.stats}>
                      {solution.squareMeters !== undefined ? (
                        <li className={fieldStyles.stat}>
                          <span className={fieldStyles.statValue}>{formatNumber(solution.squareMeters)} מ״ר</span>
                          <span className={fieldStyles.statLabel}>במטרים רבועים</span>
                        </li>
                      ) : null}
                      {solution.cubicMeters !== undefined ? (
                        <li className={fieldStyles.stat}>
                          <span className={fieldStyles.statValue}>{formatNumber(solution.cubicMeters)} מ״ק</span>
                          <span className={fieldStyles.statLabel}>במטרים מעוקבים (קוב)</span>
                        </li>
                      ) : null}
                      {solution.liters !== undefined ? (
                        <li className={fieldStyles.stat}>
                          <span className={fieldStyles.statValue}>{formatNumber(solution.liters)} ליטר</span>
                          <span className={fieldStyles.statLabel}>בליטרים</span>
                        </li>
                      ) : null}
                    </ul>
                  </div>
                ) : (
                  <p className={ui.note} role="alert">
                    הקלידו את כל המידות, כל אחת גדולה מאפס.
                  </p>
                )}
              </>
            )}
            <p className={ui.note}>π מעוגל בדרך הפתרון ל-3.1416, והתוצאה מחושבת בדיוק מלא. החישוב נעשה בדפדפן.</p>
          </div>
        </div>
      </div>
    </section>
  )
}
