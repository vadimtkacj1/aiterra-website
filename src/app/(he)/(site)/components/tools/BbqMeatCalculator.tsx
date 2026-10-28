'use client'

import { useId, useMemo, useState } from 'react'
import {
  GRAMS_PER_ADULT,
  MEATS,
  calculateBbq,
  defaultShares,
  formatKg,
  shoppingList,
  type MealType,
  type MeatId,
  type Shares,
} from '@/lib/bbq-meat-calculator'
import ui from './toolUi.module.css'
import styles from './SelfEmployedTaxCalculator.module.css'

const mealOptions: { value: MealType; label: string; hint: string }[] = [
  { value: 'main', label: 'ארוחה עיקרית', hint: `${GRAMS_PER_ADULT.main} גרם למבוגר` },
  { value: 'light', label: 'נשנושים ליד', hint: `${GRAMS_PER_ADULT.light} גרם למבוגר` },
]

const toNumber = (text: string) => {
  const value = Number(text.replace(',', '.'))
  return text.trim() === '' || !Number.isFinite(value) ? 0 : value
}

function CountField({
  label,
  hint,
  value,
  suffix,
  onChange,
}: {
  label: string
  hint?: string
  value: string
  suffix?: string
  onChange: (value: string) => void
}) {
  const id = useId()
  return (
    <div className={ui.field}>
      <label htmlFor={id} className={ui.label}>
        {label}
      </label>
      {hint ? (
        <p id={`${id}-hint`} className={ui.hint}>
          {hint}
        </p>
      ) : null}
      <div className={styles.affix}>
        <input
          id={id}
          className={`${ui.input} ${ui.ltr} ${styles.number}${suffix ? ` ${styles.withSuffix}` : ''}`}
          inputMode="numeric"
          autoComplete="off"
          maxLength={5}
          value={value}
          aria-describedby={hint ? `${id}-hint` : undefined}
          onChange={(event) => onChange(event.target.value.replace(/[^\d]/g, ''))}
        />
        {suffix ? (
          <span className={styles.suffix} aria-hidden="true">
            {suffix}
          </span>
        ) : null}
      </div>
    </div>
  )
}

export default function BbqMeatCalculator() {
  const [adults, setAdults] = useState('10')
  const [kids, setKids] = useState('4')
  const [bigEaters, setBigEaters] = useState('2')
  const [meal, setMeal] = useState<MealType>('main')
  const [grams, setGrams] = useState(String(GRAMS_PER_ADULT.main))
  const [manySides, setManySides] = useState(false)
  const [buffer, setBuffer] = useState(true)
  const [shares, setShares] = useState<Shares>(defaultShares)
  const [status, setStatus] = useState('')

  const result = useMemo(
    () =>
      calculateBbq({
        adults: toNumber(adults),
        kids: toNumber(kids),
        bigEaters: toNumber(bigEaters),
        meal,
        gramsPerAdult: toNumber(grams),
        manySides,
        buffer,
        shares,
      }),
    [adults, kids, bigEaters, meal, grams, manySides, buffer, shares],
  )

  const shareTotal = MEATS.reduce((sum, meat) => sum + (shares[meat.id] || 0), 0)

  const changeMeal = (next: MealType) => {
    setMeal(next)
    setGrams(String(GRAMS_PER_ADULT[next]))
  }

  const changeShare = (id: MeatId, text: string) =>
    setShares((current) => ({ ...current, [id]: Math.min(100, toNumber(text)) }))

  const copy = async () => {
    if (!result) {
      setStatus('הקלידו מספר סועדים כדי להעתיק רשימה.')
      return
    }
    try {
      await navigator.clipboard.writeText(shoppingList(result))
      setStatus('רשימת הקניות הועתקה')
      window.gtag?.('event', 'bbq_meat_copy', { people: result.people })
    } catch {
      setStatus('ההעתקה נכשלה. סמנו את הרשימה והעתיקו ידנית.')
    }
  }

  return (
    <section className={ui.tool} aria-label="מחשבון בשר לעל האש">
      <div className={ui.inner}>
        <form className={ui.form} onSubmit={(event) => event.preventDefault()}>
          <fieldset className={ui.group}>
            <legend className={ui.legend}>מי מגיע</legend>
            <CountField label="מבוגרים" hint="כולל בני נוער מגיל 12." value={adults} onChange={setAdults} />
            <CountField label="ילדים עד גיל 12" hint="ילד נחשב לחצי מנה." value={kids} onChange={setKids} />
            <CountField
              label="מתוכם אכלנים גדולים"
              hint="מבוגרים שאוכלים פי 1.5. לא יותר ממספר המבוגרים."
              value={bigEaters}
              onChange={setBigEaters}
            />
          </fieldset>

          <fieldset className={ui.group}>
            <legend className={ui.legend}>סוג הארוחה</legend>
            <div className={styles.choices}>
              {mealOptions.map((option) => (
                <label key={option.value} className={styles.choice}>
                  <input
                    type="radio"
                    name="bbq-meal"
                    className={ui.checkbox}
                    checked={meal === option.value}
                    onChange={() => changeMeal(option.value)}
                  />
                  <span className={styles.choiceText}>
                    <span className={styles.choiceLabel}>{option.label}</span>
                    <span className={styles.choiceHint}>{option.hint}</span>
                  </span>
                </label>
              ))}
            </div>
            <CountField
              label="גרם בשר למבוגר"
              hint="משקל קנייה של בשר בלי עצם. אפשר לשנות."
              value={grams}
              suffix="גרם"
              onChange={setGrams}
            />
            <label className={styles.choice}>
              <input
                type="checkbox"
                className={ui.checkbox}
                checked={manySides}
                onChange={(event) => setManySides(event.target.checked)}
              />
              <span className={styles.choiceText}>
                <span className={styles.choiceLabel}>הרבה תוספות</span>
                <span className={styles.choiceHint}>סלטים, תפוחי אדמה ולחמים: 10% פחות בשר</span>
              </span>
            </label>
            <label className={styles.choice}>
              <input
                type="checkbox"
                className={ui.checkbox}
                checked={buffer}
                onChange={(event) => setBuffer(event.target.checked)}
              />
              <span className={styles.choiceText}>
                <span className={styles.choiceLabel}>מרווח ביטחון של 10%</span>
                <span className={styles.choiceHint}>למקרה שמגיעים עוד אורחים</span>
              </span>
            </label>
          </fieldset>

          <fieldset className={ui.group}>
            <legend className={ui.legend}>תמהיל הבשר, באחוזים</legend>
            {MEATS.map((meat) => (
              <CountField
                key={meat.id}
                label={meat.label}
                hint={meat.note}
                value={String(shares[meat.id] || '')}
                suffix="%"
                onChange={(text) => changeShare(meat.id, text)}
              />
            ))}
            <p className={ui.hint}>
              סך הכול {shareTotal}%. {shareTotal === 100 ? '' : 'החלוקה מחושבת יחסית, גם אם הסכום לא 100.'}
            </p>
            <div className={ui.actions}>
              <button type="button" className={ui.secondary} onClick={() => setShares(defaultShares())}>
                איפוס התמהיל
              </button>
            </div>
          </fieldset>
        </form>

        <div className={ui.output}>
          <div className={ui.sticky}>
            <h2 className={ui.outputTitle}>מה לקנות</h2>
            {result ? (
              <>
                <dl className={styles.results}>
                  <div className={`${styles.row} ${styles.main}`}>
                    <dt className={styles.term}>סך הכול בשר</dt>
                    <dd className={styles.value}>{formatKg(result.buyKg)}</dd>
                  </div>
                  {result.lines.map((line) => (
                    <div key={line.id} className={styles.row}>
                      <dt className={styles.term}>{line.label}</dt>
                      <dd className={styles.value}>{formatKg(line.buyKg)}</dd>
                    </div>
                  ))}
                </dl>
                <dl className={styles.results}>
                  <div className={styles.row}>
                    <dt className={styles.term}>פחמים</dt>
                    <dd className={styles.value}>{result.charcoalKg} ק״ג</dd>
                  </div>
                  <div className={styles.row}>
                    <dt className={styles.term}>פיתות</dt>
                    <dd className={styles.value}>{result.pitas}</dd>
                  </div>
                  <div className={styles.row}>
                    <dt className={styles.term}>סלטים</dt>
                    <dd className={styles.value}>{formatKg(result.saladKg)}</dd>
                  </div>
                  <div className={styles.row}>
                    <dt className={styles.term}>שתייה</dt>
                    <dd className={styles.value}>{result.drinksLiters} ליטר</dd>
                  </div>
                </dl>
              </>
            ) : (
              <p className={styles.empty}>הקלידו כמה אנשים מגיעים ובחרו לפחות סוג בשר אחד.</p>
            )}

            <div className={ui.actions}>
              <button type="button" className={ui.primary} onClick={copy}>
                העתקת רשימת הקניות
              </button>
            </div>
            <p className={ui.status} role="status" aria-live="polite">
              {status}
            </p>
            <p className={ui.note}>
              המשקלים הם של בשר נא, כפי שקונים בקצביה. לכנפיים ולצלעות נוספו 20% על העצם. החישוב נעשה בדפדפן.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
