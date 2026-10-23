'use client'

import { useId, useState } from 'react'
import {
  LIMITS,
  calculateAlcohol,
  defaultInput,
  drinks,
  inputError,
  type AlcoholInput,
  type DrinkId,
} from '@/lib/party-alcohol-calculator'
import { NumberField, parseNumber } from './ToolFields'
import ui from './toolUi.module.css'
import styles from './ToolFields.module.css'

type DrinkFields = Record<DrinkId, string>

const asFields = (values: Record<DrinkId, number>): DrinkFields => ({
  beer: String(values.beer),
  wine: String(values.wine),
  spirits: String(values.spirits),
})

const asNumbers = (fields: DrinkFields): Record<DrinkId, number> => ({
  beer: parseNumber(fields.beer) ?? Number.NaN,
  wine: parseNumber(fields.wine) ?? Number.NaN,
  spirits: parseNumber(fields.spirits) ?? Number.NaN,
})

const format = (value: number) => new Intl.NumberFormat('he-IL', { maximumFractionDigits: 1 }).format(value)

export default function PartyAlcoholCalculator() {
  const ids = {
    guests: useId(),
    drinkers: useId(),
    hours: useId(),
    rate: useId(),
    buffer: useId(),
    beer: useId(),
    wine: useId(),
    spirits: useId(),
    beerServing: useId(),
    wineServing: useId(),
    spiritsServing: useId(),
    beerBottle: useId(),
    wineBottle: useId(),
    spiritsBottle: useId(),
  }
  const mixIds: Record<DrinkId, string> = { beer: ids.beer, wine: ids.wine, spirits: ids.spirits }
  const servingIds: Record<DrinkId, string> = {
    beer: ids.beerServing,
    wine: ids.wineServing,
    spirits: ids.spiritsServing,
  }
  const bottleIds: Record<DrinkId, string> = {
    beer: ids.beerBottle,
    wine: ids.wineBottle,
    spirits: ids.spiritsBottle,
  }

  const [guests, setGuests] = useState(String(defaultInput.guests))
  const [drinkers, setDrinkers] = useState(String(defaultInput.drinkerPercent))
  const [hours, setHours] = useState(String(defaultInput.hours))
  const [rate, setRate] = useState(String(defaultInput.drinksPerHour))
  const [buffer, setBuffer] = useState(String(defaultInput.bufferPercent))
  const [mix, setMix] = useState<DrinkFields>(asFields(defaultInput.mix))
  const [serving, setServing] = useState<DrinkFields>(asFields(defaultInput.servingMl))
  const [bottle, setBottle] = useState<DrinkFields>(asFields(defaultInput.bottleMl))

  const num = (value: string) => parseNumber(value) ?? Number.NaN

  const input: AlcoholInput = {
    guests: num(guests),
    drinkerPercent: Math.min(LIMITS.percent.max, Math.max(LIMITS.percent.min, num(drinkers) || 0)),
    hours: num(hours),
    drinksPerHour: num(rate),
    bufferPercent: Math.min(LIMITS.buffer.max, Math.max(LIMITS.buffer.min, num(buffer) || 0)),
    mix: asNumbers(mix),
    servingMl: asNumbers(serving),
    bottleMl: asNumbers(bottle),
  }

  const safeInput: AlcoholInput = {
    ...input,
    mix: { beer: input.mix.beer || 0, wine: input.mix.wine || 0, spirits: input.mix.spirits || 0 },
  }
  const error = inputError(safeInput)
  const result = error ? null : calculateAlcohol(safeInput)

  const updateDrink =
    (setter: (updater: (current: DrinkFields) => DrinkFields) => void, id: DrinkId) => (next: string) =>
      setter((current) => ({ ...current, [id]: next }))

  return (
    <section className={ui.tool} aria-label="מחשבון כמויות אלכוהול">
      <div className={ui.inner}>
        <form className={ui.form} onSubmit={(event) => event.preventDefault()}>
          <fieldset className={ui.group}>
            <legend className={ui.legend}>האירוע</legend>
            <div className={styles.pair}>
              <NumberField id={ids.guests} label="מספר אורחים" value={guests} min={1} step={1} onChange={setGuests} />
              <NumberField
                id={ids.hours}
                label="משך האירוע (שעות)"
                hint="שעות שבהן מוגשים משקאות."
                value={hours}
                min={LIMITS.hours.min}
                max={LIMITS.hours.max}
                onChange={setHours}
              />
            </div>
          </fieldset>

          <fieldset className={ui.group}>
            <legend className={ui.legend}>הנחות על השתייה</legend>
            <p className={ui.hint}>ערכי התחלה לתכנון קניות, לא נתון מחקרי ולא המלצה לשתייה. שנו אותם לפי האורחים שלכם.</p>
            <div className={styles.pair}>
              <NumberField
                id={ids.drinkers}
                label="אחוז האורחים ששותים אלכוהול"
                value={drinkers}
                min={0}
                max={100}
                onChange={setDrinkers}
              />
              <NumberField
                id={ids.rate}
                label="משקאות לשותה בשעה"
                value={rate}
                min={LIMITS.rate.min}
                max={LIMITS.rate.max}
                onChange={setRate}
              />
              <NumberField
                id={ids.buffer}
                label="מרווח ביטחון (%)"
                value={buffer}
                min={0}
                max={100}
                onChange={setBuffer}
              />
            </div>
          </fieldset>

          <fieldset className={ui.group}>
            <legend className={ui.legend}>תמהיל המשקאות (באחוזים)</legend>
            <div className={styles.triple}>
              {drinks.map((drink) => (
                <NumberField
                  key={drink.id}
                  id={mixIds[drink.id]}
                  label={drink.label}
                  value={mix[drink.id]}
                  min={0}
                  max={100}
                  onChange={updateDrink(setMix, drink.id)}
                />
              ))}
            </div>
          </fieldset>

          <details className={styles.details}>
            <summary>גדלי מנות ובקבוקים (אפשר לשנות)</summary>
            <div className={ui.group}>
              <p className={ui.hint}>
                מנה היא כמות המשקה שנחשבת כמשקה אחד, במיליליטרים. ערכי ההתחלה לפי ההגדרה של משרד הבריאות למשקה סטנדרטי.
              </p>
              <div className={styles.triple}>
                {drinks.map((drink) => (
                  <NumberField
                    key={drink.id}
                    id={servingIds[drink.id]}
                    label={`מנת ${drink.label} (מ״ל)`}
                    value={serving[drink.id]}
                    min={1}
                    onChange={updateDrink(setServing, drink.id)}
                  />
                ))}
              </div>
              <div className={styles.triple}>
                {drinks.map((drink) => (
                  <NumberField
                    key={drink.id}
                    id={bottleIds[drink.id]}
                    label={`בקבוק ${drink.label} (מ״ל)`}
                    value={bottle[drink.id]}
                    min={1}
                    onChange={updateDrink(setBottle, drink.id)}
                  />
                ))}
              </div>
            </div>
          </details>
        </form>

        <div className={ui.output}>
          <h2 className={ui.outputTitle}>כמה לקנות</h2>
          {error || !result ? (
            <p className={ui.note} role="alert">
              {error}
            </p>
          ) : (
            <div aria-live="polite">
              <p className={styles.resultLabel}>סך הכול מנות לאירוע</p>
              <p className={styles.result}>{format(result.totalServings)}</p>
              <p className={styles.resultLabel}>
                {format(result.drinkers)} שותים, בממוצע {format(result.perDrinker)} מנות לשותה לאורך האירוע
              </p>
              <div className={styles.tableWrap}>
                <table className={styles.table}>
                  <caption className={styles.srOnly}>כמות לקנייה לפי סוג משקה</caption>
                  <thead>
                    <tr>
                      <th scope="col">משקה</th>
                      <th scope="col">מנות</th>
                      <th scope="col">בקבוקים</th>
                      <th scope="col">ליטרים</th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.lines.map((line) => {
                      const drink = drinks.find((item) => item.id === line.id)
                      return (
                        <tr key={line.id}>
                          <th scope="row">{drink?.label}</th>
                          <td>{format(line.servings)}</td>
                          <td>{format(line.bottles)}</td>
                          <td>{format(line.liters)}</td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
          <p className={ui.note}>
            הכמות מיועדת לתכנון קנייה בלבד. מומלץ להציע גם מים ומשקאות ללא אלכוהול, לדאוג לנהגים מיועדים, ולא להגיש
            אלכוהול לקטינים ולמי שכבר שתה מספיק. החישוב נעשה בדפדפן.
          </p>
        </div>
      </div>
    </section>
  )
}
