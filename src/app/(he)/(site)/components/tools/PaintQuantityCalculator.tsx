'use client'

import { useId, useState } from 'react'
import {
  LIMITS,
  calculatePaint,
  coveragePresets,
  defaultInput,
  inputError,
  type PaintInput,
} from '@/lib/paint-quantity-calculator'
import { Check, NumberField, RadioTiles, parseNumber } from './ToolFields'
import ui from './toolUi.module.css'
import styles from './ToolFields.module.css'

type Fields = Record<Exclude<keyof PaintInput, 'ceiling'>, string>

const initialFields = (): Fields => {
  const entries = Object.entries(defaultInput).filter(([key]) => key !== 'ceiling')
  return Object.fromEntries(entries.map(([key, value]) => [key, String(value)])) as Fields
}

const formatLiters = (value: number) => new Intl.NumberFormat('he-IL', { maximumFractionDigits: 1 }).format(value)

export default function PaintQuantityCalculator() {
  const presetName = useId()
  const ids = {
    length: useId(),
    width: useId(),
    height: useId(),
    rooms: useId(),
    ceiling: useId(),
    doors: useId(),
    doorWidth: useId(),
    doorHeight: useId(),
    windows: useId(),
    windowWidth: useId(),
    windowHeight: useId(),
    coats: useId(),
    coverage: useId(),
    waste: useId(),
    pack: useId(),
  }

  const [fields, setFields] = useState<Fields>(initialFields)
  const [ceiling, setCeiling] = useState(false)
  const [preset, setPreset] = useState('emulsin')

  const setField = (key: keyof Fields) => (next: string) => setFields((current) => ({ ...current, [key]: next }))

  const choosePreset = (id: string) => {
    setPreset(id)
    const value = coveragePresets.find((item) => item.id === id)?.value
    if (value) setFields((current) => ({ ...current, coverage: String(value) }))
  }

  const changeCoverage = (next: string) => {
    setPreset('custom')
    setField('coverage')(next)
  }

  const number = (key: keyof Fields) => parseNumber(fields[key]) ?? Number.NaN

  const input: PaintInput = {
    length: number('length'),
    width: number('width'),
    height: number('height'),
    rooms: Math.floor(number('rooms')),
    doors: Math.max(0, Math.floor(parseNumber(fields.doors) ?? 0)),
    doorWidth: Math.max(0, parseNumber(fields.doorWidth) ?? 0),
    doorHeight: Math.max(0, parseNumber(fields.doorHeight) ?? 0),
    windows: Math.max(0, Math.floor(parseNumber(fields.windows) ?? 0)),
    windowWidth: Math.max(0, parseNumber(fields.windowWidth) ?? 0),
    windowHeight: Math.max(0, parseNumber(fields.windowHeight) ?? 0),
    ceiling,
    coats: Math.floor(number('coats')),
    coverage: number('coverage'),
    wastePercent: Math.min(LIMITS.waste.max, Math.max(LIMITS.waste.min, parseNumber(fields.wastePercent) ?? 0)),
    packSize: number('packSize'),
  }

  const error = inputError(input)
  const result = error ? null : calculatePaint(input)

  return (
    <section className={ui.tool} aria-label="מחשבון כמות צבע">
      <div className={ui.inner}>
        <form className={ui.form} onSubmit={(event) => event.preventDefault()}>
          <fieldset className={ui.group}>
            <legend className={ui.legend}>החדר</legend>
            <div className={styles.triple}>
              <NumberField id={ids.length} label="אורך (מ׳)" value={fields.length} min={0.5} onChange={setField('length')} />
              <NumberField id={ids.width} label="רוחב (מ׳)" value={fields.width} min={0.5} onChange={setField('width')} />
              <NumberField id={ids.height} label="גובה (מ׳)" value={fields.height} min={0.5} onChange={setField('height')} />
            </div>
            <NumberField
              id={ids.rooms}
              label="כמה חדרים זהים"
              value={fields.rooms}
              min={1}
              max={LIMITS.count.max}
              step={1}
              onChange={setField('rooms')}
            />
            <div className={ui.options}>
              <Check id={ids.ceiling} label="לצבוע גם את התקרה" checked={ceiling} onChange={setCeiling} />
            </div>
          </fieldset>

          <fieldset className={ui.group}>
            <legend className={ui.legend}>דלתות וחלונות שלא צובעים</legend>
            <p className={ui.hint}>המידות הן ערכי התחלה נפוצים. מדדו את שלכם אם הם שונים.</p>
            <div className={styles.triple}>
              <NumberField id={ids.doors} label="דלתות" value={fields.doors} min={0} step={1} onChange={setField('doors')} />
              <NumberField id={ids.doorWidth} label="רוחב דלת (מ׳)" value={fields.doorWidth} min={0} onChange={setField('doorWidth')} />
              <NumberField id={ids.doorHeight} label="גובה דלת (מ׳)" value={fields.doorHeight} min={0} onChange={setField('doorHeight')} />
            </div>
            <div className={styles.triple}>
              <NumberField id={ids.windows} label="חלונות" value={fields.windows} min={0} step={1} onChange={setField('windows')} />
              <NumberField id={ids.windowWidth} label="רוחב חלון (מ׳)" value={fields.windowWidth} min={0} onChange={setField('windowWidth')} />
              <NumberField id={ids.windowHeight} label="גובה חלון (מ׳)" value={fields.windowHeight} min={0} onChange={setField('windowHeight')} />
            </div>
          </fieldset>

          <fieldset className={ui.group}>
            <legend className={ui.legend}>הצבע</legend>
            <RadioTiles
              legend="כושר כיסוי לפי מפרט"
              name={presetName}
              options={coveragePresets.map(({ id, label, hint }) => ({ id, label, hint }))}
              value={preset}
              onChange={choosePreset}
            />
            <div className={styles.pair}>
              <NumberField
                id={ids.coverage}
                label="כושר כיסוי (מ״ר לליטר לשכבה)"
                value={fields.coverage}
                min={LIMITS.coverage.min}
                max={LIMITS.coverage.max}
                onChange={changeCoverage}
              />
              <NumberField
                id={ids.coats}
                label="מספר שכבות"
                value={fields.coats}
                min={LIMITS.coats.min}
                max={LIMITS.coats.max}
                step={1}
                onChange={setField('coats')}
              />
              <NumberField
                id={ids.waste}
                label="תוספת לפחת (%)"
                value={fields.wastePercent}
                min={LIMITS.waste.min}
                max={LIMITS.waste.max}
                onChange={setField('wastePercent')}
              />
              <NumberField
                id={ids.pack}
                label="גודל אריזה (ליטר)"
                value={fields.packSize}
                min={LIMITS.pack.min}
                onChange={setField('packSize')}
              />
            </div>
          </fieldset>
        </form>

        <div className={ui.output}>
          <h2 className={ui.outputTitle}>כמה צבע צריך</h2>
          {error || !result ? (
            <p className={ui.note} role="alert">
              {error}
            </p>
          ) : (
            <div aria-live="polite">
              <p className={styles.resultLabel}>כמות מומלצת לקנייה</p>
              <p className={styles.result}>{formatLiters(result.roundedLiters)} ליטר</p>
              <p className={styles.resultLabel}>
                {result.packs} {result.packs === 1 ? 'אריזה' : 'אריזות'} של {formatLiters(input.packSize)} ליטר
              </p>
              <ul className={styles.stats}>
                <li className={styles.stat}>
                  <span className={styles.statValue}>{formatLiters(result.paintableWalls)} מ״ר</span>
                  <span className={styles.statLabel}>קירות לצביעה אחרי הפחתת פתחים</span>
                </li>
                <li className={styles.stat}>
                  <span className={styles.statValue}>{formatLiters(result.openingsArea)} מ״ר</span>
                  <span className={styles.statLabel}>דלתות וחלונות שהופחתו</span>
                </li>
                <li className={styles.stat}>
                  <span className={styles.statValue}>{formatLiters(result.wallLiters)} ליטר</span>
                  <span className={styles.statLabel}>לקירות, כולל פחת</span>
                </li>
                <li className={styles.stat}>
                  <span className={styles.statValue}>{formatLiters(result.ceilingLiters)} ליטר</span>
                  <span className={styles.statLabel}>לתקרה, כולל פחת</span>
                </li>
              </ul>
            </div>
          )}
          <p className={ui.note}>
            החישוב: שטח לצביעה כפול מספר השכבות, מחולק בכושר הכיסוי ועם תוספת פחת. כושר כיסוי בפועל תלוי במשטח, בצבע
            הקודם ובשיטת הצביעה. החישוב נעשה בדפדפן.
          </p>
        </div>
      </div>
    </section>
  )
}
