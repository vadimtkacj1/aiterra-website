'use client'

import { useId, useMemo, useState } from 'react'
import {
  MAX_AREA,
  MAX_PEOPLE,
  calculateAc,
  formatBtu,
  formatHorsepower,
  formatNumber,
  parseDecimal,
  type Floor,
  type Region,
  type Sun,
} from '@/lib/ac-size'
import ui from './toolUi.module.css'
import styles from './SelfEmployedTaxCalculator.module.css'

type AreaMode = 'area' | 'sides'

const areaModes: { value: AreaMode; label: string; hint: string }[] = [
  { value: 'area', label: 'יודעים את השטח', hint: 'במטרים רבועים' },
  { value: 'sides', label: 'אורך × רוחב', hint: 'המחשבון יכפיל' },
]

const sunOptions: { value: Sun; label: string; hint: string }[] = [
  { value: 'shaded', label: 'מוצל', hint: 'חלון לצפון או תריס סגור' },
  { value: 'normal', label: 'רגיל', hint: 'שמש חלקית' },
  { value: 'strong', label: 'שמש חזקה', hint: 'חלונות גדולים לדרום או למערב' },
]

const floorOptions: { value: Floor; label: string; hint: string }[] = [
  { value: 'middle', label: 'קומת ביניים', hint: 'יש דירה מעל' },
  { value: 'top', label: 'קומה עליונה או גג', hint: 'הגג מתחמם בשמש' },
]

const regionOptions: { value: Region; label: string; hint: string }[] = [
  { value: 'coastal', label: 'מישור החוף', hint: 'לח, למשל תל אביב וחיפה' },
  { value: 'inland', label: 'פנים הארץ', hint: 'שפלה, באר שבע' },
  { value: 'mountain', label: 'אזור הררי', hint: 'ירושלים, גליל, גולן' },
  { value: 'hot', label: 'בקעה, ערבה ואילת', hint: 'עמק הירדן, ים המלח' },
]

function ChoiceGroup<T extends string>({
  legend,
  name,
  options,
  value,
  onChange,
}: {
  legend: string
  name: string
  options: { value: T; label: string; hint: string }[]
  value: T
  onChange: (value: T) => void
}) {
  return (
    <fieldset className={ui.group}>
      <legend className={ui.legend}>{legend}</legend>
      <div className={styles.choices}>
        {options.map((option) => (
          <label key={option.value} className={styles.choice}>
            <input
              type="radio"
              name={name}
              value={option.value}
              className={ui.checkbox}
              checked={value === option.value}
              onChange={() => onChange(option.value)}
            />
            <span className={styles.choiceText}>
              <span className={styles.choiceLabel}>{option.label}</span>
              <span className={styles.choiceHint}>{option.hint}</span>
            </span>
          </label>
        ))}
      </div>
    </fieldset>
  )
}

function NumberField({
  label,
  value,
  error,
  suffix,
  onChange,
}: {
  label: string
  value: string
  error: string
  suffix: string
  onChange: (value: string) => void
}) {
  const id = useId()
  const errorId = `${id}-error`
  return (
    <div className={ui.field}>
      <label htmlFor={id} className={ui.label}>
        {label}
      </label>
      <div className={styles.affix}>
        <input
          id={id}
          className={`${ui.input} ${ui.ltr} ${styles.number} ${styles.withSuffix}`}
          inputMode="decimal"
          autoComplete="off"
          spellCheck={false}
          enterKeyHint="done"
          maxLength={8}
          value={value}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : undefined}
          onChange={(event) => onChange(event.target.value)}
        />
        <span className={styles.suffix} aria-hidden="true">
          {suffix}
        </span>
      </div>
      {error ? (
        <p id={errorId} className={styles.error}>
          {error}
        </p>
      ) : null}
    </div>
  )
}

const rangeError = (input: string, value: number | null, min: number, max: number) => {
  if (!input.trim()) return ''
  if (value === null) return 'אפשר להקליד רק מספר, למשל 3.5.'
  if (value < min || value > max) return `הקלידו מספר בין ${formatNumber(min, 1)} ל-${formatNumber(max)}.`
  return ''
}

const valid = (value: number | null, min: number, max: number) => value !== null && value >= min && value <= max

export default function AcSizeCalculator() {
  const [areaMode, setAreaMode] = useState<AreaMode>('area')
  const [area, setArea] = useState('')
  const [length, setLength] = useState('')
  const [width, setWidth] = useState('')
  const [ceiling, setCeiling] = useState('2.6')
  const [people, setPeople] = useState('2')
  const [sun, setSun] = useState<Sun>('normal')
  const [floor, setFloor] = useState<Floor>('middle')
  const [kitchen, setKitchen] = useState(false)
  const [region, setRegion] = useState<Region>('coastal')

  const areaValue = parseDecimal(area)
  const lengthValue = parseDecimal(length)
  const widthValue = parseDecimal(width)
  const ceilingValue = parseDecimal(ceiling)
  const peopleValue = parseDecimal(people)

  const sidesArea = lengthValue !== null && widthValue !== null ? lengthValue * widthValue : null
  const roomArea = areaMode === 'area' ? areaValue : sidesArea
  const areaOk = valid(roomArea, 1, MAX_AREA)
  const ceilingOk = valid(ceilingValue, 2, 6)
  const peopleOk = valid(peopleValue, 0, MAX_PEOPLE)

  const result = useMemo(() => {
    if (!areaOk || !ceilingOk || !peopleOk) return null
    return calculateAc({
      areaSquareMeters: roomArea as number,
      ceilingMeters: ceilingValue as number,
      people: peopleValue as number,
      sun,
      floor,
      kitchen,
      region,
    })
  }, [areaOk, ceilingOk, peopleOk, roomArea, ceilingValue, peopleValue, sun, floor, kitchen, region])

  const sidesError =
    areaMode === 'sides' && sidesArea !== null && !areaOk ? `השטח צריך להיות בין 1 ל-${MAX_AREA} מ"ר.` : ''

  return (
    <section className={ui.tool} aria-label="מחשבון מזגן לפי גודל חדר">
      <div className={ui.inner}>
        <form className={ui.form} onSubmit={(event) => event.preventDefault()}>
          <ChoiceGroup legend="גודל החדר" name="ac-area-mode" options={areaModes} value={areaMode} onChange={setAreaMode} />
          <fieldset className={ui.group}>
            <legend className={ui.legend}>מידות</legend>
            {areaMode === 'area' ? (
              <NumberField
                label="שטח החדר"
                value={area}
                error={rangeError(area, areaValue, 1, MAX_AREA)}
                suffix='מ"ר'
                onChange={setArea}
              />
            ) : (
              <>
                <NumberField
                  label="אורך"
                  value={length}
                  error={rangeError(length, lengthValue, 0.5, 50) || sidesError}
                  suffix="מ'"
                  onChange={setLength}
                />
                <NumberField
                  label="רוחב"
                  value={width}
                  error={rangeError(width, widthValue, 0.5, 50)}
                  suffix="מ'"
                  onChange={setWidth}
                />
              </>
            )}
            <NumberField
              label="גובה התקרה"
              value={ceiling}
              error={rangeError(ceiling, ceilingValue, 2, 6)}
              suffix="מ'"
              onChange={setCeiling}
            />
            <NumberField
              label="כמה אנשים בחדר בדרך כלל"
              value={people}
              error={rangeError(people, peopleValue, 0, MAX_PEOPLE)}
              suffix="אנשים"
              onChange={setPeople}
            />
          </fieldset>

          <ChoiceGroup legend="חשיפה לשמש" name="ac-sun" options={sunOptions} value={sun} onChange={setSun} />
          <ChoiceGroup legend="קומה" name="ac-floor" options={floorOptions} value={floor} onChange={setFloor} />
          <ChoiceGroup legend="אזור בארץ" name="ac-region" options={regionOptions} value={region} onChange={setRegion} />

          <fieldset className={ui.group}>
            <legend className={ui.legend}>עוד בחלל</legend>
            <label className={styles.choice}>
              <input
                type="checkbox"
                className={ui.checkbox}
                checked={kitchen}
                onChange={(event) => setKitchen(event.target.checked)}
              />
              <span className={styles.choiceText}>
                <span className={styles.choiceLabel}>מטבח פתוח</span>
                <span className={styles.choiceHint}>כיריים ותנור באותו חלל</span>
              </span>
            </label>
          </fieldset>
        </form>

        <div className={ui.output}>
          <div className={ui.sticky}>
            <h2 className={ui.outputTitle}>התוצאה</h2>
            {result && result.requiredBtu > 0 ? (
              <dl className={styles.results} aria-live="polite">
                <div className={`${styles.row} ${styles.main}`}>
                  <dt className={styles.term}>מזגן מתאים</dt>
                  <dd className={styles.value}>
                    {result.rating ? formatHorsepower(result.rating.horsepower) : 'יותר מ-5 כ"ס'}
                  </dd>
                </div>
                <div className={styles.row}>
                  <dt className={styles.term}>תפוקת קירור נדרשת</dt>
                  <dd className={styles.value}>{formatBtu(result.requiredBtu)}</dd>
                </div>
                {result.rating ? (
                  <div className={styles.row}>
                    <dt className={styles.term}>תפוקה מקובלת לדירוג</dt>
                    <dd className={styles.value}>{formatBtu(result.rating.btu)}</dd>
                  </div>
                ) : null}
              </dl>
            ) : (
              <p className={styles.empty}>הקלידו את שטח החדר כדי לראות כמה BTU וכמה כוח סוס צריך.</p>
            )}
            {result && !result.rating && result.requiredBtu > 0 ? (
              <p className={styles.notice}>
                חלל כזה בדרך כלל מקבל מזגן מיני מרכזי או שני מזגנים. כדאי לבקש מטכנאי חישוב עומס חום.
              </p>
            ) : null}
            <p className={ui.note}>
              הערכה ראשונית לפי כללי אצבע של יצרנים, לא חישוב עומס חום. לפני קנייה בדקו את תפוקת הקירור ב-BTU/h
              במפרט הדגם והתייעצו עם מתקין. החישוב נעשה בדפדפן, ושום נתון לא נשלח.
            </p>
          </div>
        </div>
      </div>

      {result && result.requiredBtu > 0 ? (
        <div className={styles.details}>
          <h2 className={styles.detailsTitle}>פירוט החישוב</h2>
          <div className={styles.tableWrap} role="region" aria-label="פירוט החישוב" tabIndex={0}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th scope="col">רכיב</th>
                  <th scope="col">BTU/h</th>
                </tr>
              </thead>
              <tbody>
                {result.lines.map((line) => (
                  <tr key={line.key} className={line.btu === 0 ? styles.unused : undefined}>
                    <th scope="row">{line.label}</th>
                    <td>
                      {line.btu < 0 ? '−' : ''}
                      {formatBtu(Math.abs(line.btu))}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className={styles.totalRow}>
                  <th scope="row">סך הכול, מעוגל</th>
                  <td>{formatBtu(result.requiredBtu)}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      ) : null}
    </section>
  )
}
