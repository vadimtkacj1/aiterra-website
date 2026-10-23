'use client'

import { useId, useState } from 'react'
import {
  BAKING_CHECKED,
  BAKING_CHECKED_LABEL,
  celsiusToFahrenheit,
  cupSystems,
  fahrenheitToCelsius,
  formatFraction,
  gasMarks,
  gramsToVolume,
  ingredients,
  nearestGasMark,
  roundGrams,
  unitMl,
  volumeToGrams,
  volumeUnitLabels,
  type CupSystemId,
  type VolumeUnit,
} from '@/lib/baking-converter'
import ui from './toolUi.module.css'
import styles from './BakingConverter.module.css'

type Mode = 'toGrams' | 'toVolume'

const UNITS: VolumeUnit[] = ['cup', 'tbsp', 'tsp']

function parseNumber(value: string): number {
  return Number(value.replace(',', '.'))
}

function formatVolume(value: number): string {
  if (!Number.isFinite(value) || value <= 0) return '0'
  if (value < 0.125) return value.toFixed(2)
  return formatFraction(value)
}

function formatTemp(value: number): string {
  return String(Math.round(value))
}

export default function BakingConverter() {
  const uid = useId()
  const [mode, setMode] = useState<Mode>('toGrams')
  const [ingredientId, setIngredientId] = useState('flour')
  const [systemId, setSystemId] = useState<CupSystemId>('il240')
  const [unit, setUnit] = useState<VolumeUnit>('cup')
  const [amount, setAmount] = useState('1')
  const [grams, setGrams] = useState('250')
  const [celsius, setCelsius] = useState('180')
  const [fahrenheit, setFahrenheit] = useState('356')

  const ingredient = ingredients.find((item) => item.id === ingredientId) ?? ingredients[0]
  const system = cupSystems.find((item) => item.id === systemId) ?? cupSystems[0]
  const amountValue = parseNumber(amount)
  const gramsValue = parseNumber(grams)
  const validAmount = Number.isFinite(amountValue) && amountValue > 0
  const validGrams = Number.isFinite(gramsValue) && gramsValue > 0

  const resultGrams = validAmount ? volumeToGrams(ingredient, amountValue, unit, system) : 0
  const resultMl = validAmount ? amountValue * unitMl(system, unit) : 0

  const celsiusValue = parseNumber(celsius)
  const validCelsius = Number.isFinite(celsiusValue) && celsius.trim() !== ''
  const gas = validCelsius ? nearestGasMark(celsiusValue) : null

  const onCelsius = (value: string) => {
    setCelsius(value)
    const parsed = parseNumber(value)
    if (value.trim() !== '' && Number.isFinite(parsed)) setFahrenheit(formatTemp(celsiusToFahrenheit(parsed)))
  }

  const onFahrenheit = (value: string) => {
    setFahrenheit(value)
    const parsed = parseNumber(value)
    if (value.trim() !== '' && Number.isFinite(parsed)) setCelsius(formatTemp(fahrenheitToCelsius(parsed)))
  }

  return (
    <section className={ui.tool} aria-label="ממיר מידות אפייה">
      <div className={styles.panel}>
        <div className={styles.controls}>
          <div className={ui.field}>
            <label htmlFor={`${uid}-ingredient`} className={ui.label}>
              חומר גלם
            </label>
            <select
              id={`${uid}-ingredient`}
              className={ui.input}
              value={ingredientId}
              onChange={(event) => setIngredientId(event.target.value)}
            >
              {ingredients.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </select>
          </div>
          <div className={ui.field}>
            <label htmlFor={`${uid}-system`} className={ui.label}>
              גודל הכוס
            </label>
            <select
              id={`${uid}-system`}
              className={ui.input}
              value={systemId}
              onChange={(event) => setSystemId(event.target.value as CupSystemId)}
            >
              {cupSystems.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.label}
                </option>
              ))}
            </select>
          </div>
          <div className={ui.field}>
            <label htmlFor={`${uid}-mode`} className={ui.label}>
              כיוון ההמרה
            </label>
            <select id={`${uid}-mode`} className={ui.input} value={mode} onChange={(event) => setMode(event.target.value as Mode)}>
              <option value="toGrams">מכוסות וכפות לגרמים</option>
              <option value="toVolume">מגרמים לכוסות וכפות</option>
            </select>
          </div>
        </div>

        {mode === 'toGrams' ? (
          <div className={styles.inputs}>
            <div className={ui.field}>
              <label htmlFor={`${uid}-amount`} className={ui.label}>
                כמות
              </label>
              <input
                id={`${uid}-amount`}
                type="text"
                inputMode="decimal"
                className={`${ui.input} ${ui.ltr}`}
                value={amount}
                onChange={(event) => setAmount(event.target.value)}
              />
            </div>
            <div className={ui.field}>
              <label htmlFor={`${uid}-unit`} className={ui.label}>
                יחידה
              </label>
              <select id={`${uid}-unit`} className={ui.input} value={unit} onChange={(event) => setUnit(event.target.value as VolumeUnit)}>
                {UNITS.map((item) => (
                  <option key={item} value={item}>
                    {volumeUnitLabels[item]}
                  </option>
                ))}
              </select>
            </div>
          </div>
        ) : (
          <div className={styles.inputs}>
            <div className={ui.field}>
              <label htmlFor={`${uid}-grams`} className={ui.label}>
                גרמים
              </label>
              <input
                id={`${uid}-grams`}
                type="text"
                inputMode="decimal"
                className={`${ui.input} ${ui.ltr}`}
                value={grams}
                onChange={(event) => setGrams(event.target.value)}
              />
            </div>
          </div>
        )}

        <div className={styles.result} role="status" aria-live="polite">
          {mode === 'toGrams' ? (
            validAmount ? (
              <>
                <p className={styles.big}>
                  {amount} {volumeUnitLabels[unit]} {ingredient.name} הן בערך <strong>{roundGrams(resultGrams)} גרם</strong>
                </p>
                <p className={ui.note}>נפח: {Math.round(resultMl)} מ״ל.{ingredient.note ? ` ${ingredient.note}.` : ''}</p>
              </>
            ) : (
              <p className={ui.note}>מקלידים כמות גדולה מאפס.</p>
            )
          ) : validGrams ? (
            <>
              <p className={styles.big}>
                {grams} גרם {ingredient.name} הם בערך <strong>{formatVolume(gramsToVolume(ingredient, gramsValue, 'cup', system))} כוסות</strong>
              </p>
              <p className={ui.note}>
                או {formatVolume(gramsToVolume(ingredient, gramsValue, 'tbsp', system))} כפות, או{' '}
                {formatVolume(gramsToVolume(ingredient, gramsValue, 'tsp', system))} כפיות.
                {ingredient.note ? ` ${ingredient.note}.` : ''}
              </p>
            </>
          ) : (
            <p className={ui.note}>מקלידים מספר גרמים גדול מאפס.</p>
          )}
        </div>

        <h2 className={styles.heading}>טבלת גרמים ({system.label})</h2>
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <caption>
              נתוני משקל לפי King Arthur Baking. נבדק לאחרונה: <time dateTime={BAKING_CHECKED}>{BAKING_CHECKED_LABEL}</time>
            </caption>
            <thead>
              <tr>
                <th scope="col">חומר גלם</th>
                <th scope="col">כוס</th>
                <th scope="col">½ כוס</th>
                <th scope="col">¼ כוס</th>
                <th scope="col">כף</th>
                <th scope="col">כפית</th>
              </tr>
            </thead>
            <tbody>
              {ingredients.map((item) => (
                <tr key={item.id}>
                  <th scope="row" className={styles.food}>
                    {item.name}
                  </th>
                  <td data-label="כוס">{roundGrams(volumeToGrams(item, 1, 'cup', system))}</td>
                  <td data-label="½ כוס">{roundGrams(volumeToGrams(item, 0.5, 'cup', system))}</td>
                  <td data-label="¼ כוס">{roundGrams(volumeToGrams(item, 0.25, 'cup', system))}</td>
                  <td data-label="כף">{Math.round(volumeToGrams(item, 1, 'tbsp', system) * 10) / 10}</td>
                  <td data-label="כפית">{Math.round(volumeToGrams(item, 1, 'tsp', system) * 10) / 10}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className={ui.note}>הערכים בגרמים. המשקל של כוס קמח משתנה לפי אופן המדידה, ולכן כדאי לשקול כשהמתכון מדויק.</p>

        <h2 className={styles.heading}>טמפרטורת תנור</h2>
        <div className={styles.inputs}>
          <div className={ui.field}>
            <label htmlFor={`${uid}-c`} className={ui.label}>
              צלזיוס (°C)
            </label>
            <input
              id={`${uid}-c`}
              type="text"
              inputMode="decimal"
              className={`${ui.input} ${ui.ltr}`}
              value={celsius}
              onChange={(event) => onCelsius(event.target.value)}
            />
          </div>
          <div className={ui.field}>
            <label htmlFor={`${uid}-f`} className={ui.label}>
              פרנהייט (°F)
            </label>
            <input
              id={`${uid}-f`}
              type="text"
              inputMode="decimal"
              className={`${ui.input} ${ui.ltr}`}
              value={fahrenheit}
              onChange={(event) => onFahrenheit(event.target.value)}
            />
          </div>
        </div>
        <p className={ui.note} role="status" aria-live="polite">
          {gas ? `הכי קרוב בסימון גז: ${gas.mark} (${gas.celsius}°C, ${gas.fahrenheit}°F)` : 'מקלידים טמפרטורה במעלות.'}
        </p>
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <caption>סימוני גז מקובלים (Gas Mark)</caption>
            <thead>
              <tr>
                <th scope="col">סימון גז</th>
                <th scope="col">צלזיוס</th>
                <th scope="col">פרנהייט</th>
                <th scope="col">תיאור</th>
              </tr>
            </thead>
            <tbody>
              {gasMarks.map((item) => (
                <tr key={item.mark}>
                  <th scope="row" className={styles.food}>
                    {item.mark}
                  </th>
                  <td data-label="צלזיוס">{item.celsius}°C</td>
                  <td data-label="פרנהייט">{item.fahrenheit}°F</td>
                  <td data-label="תיאור">{item.label}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}
