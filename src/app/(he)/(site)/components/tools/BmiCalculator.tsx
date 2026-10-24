'use client'

import { useId, useState } from 'react'
import {
  BMI_CATEGORIES,
  MAX_HEIGHT_CM,
  MAX_WEIGHT_KG,
  MIN_HEIGHT_CM,
  MIN_WEIGHT_KG,
  calculate,
  formatBmi,
  formatKg,
  parseNumber,
  type AgeGroup,
} from '@/lib/bmi'
import { Field, TileGroup } from './FunTiles'
import ui from './toolUi.module.css'
import fun from './FunTool.module.css'
import styles from './BmiCalculator.module.css'

const AGE_GROUPS: { id: AgeGroup; label: string; hint: string }[] = [
  { id: 'adult', label: 'בן 18 ומעלה', hint: 'סיווג מבוגרים של ארגון הבריאות העולמי' },
  { id: 'minor', label: 'מתחת לגיל 18', hint: 'ילדים ונוער נבדקים אחרת' },
]

export default function BmiCalculator() {
  const ageName = useId()
  const heightId = useId()
  const heightHintId = useId()
  const weightId = useId()
  const weightHintId = useId()

  const [ageGroup, setAgeGroup] = useState<AgeGroup>('adult')
  const [heightText, setHeightText] = useState('')
  const [weightText, setWeightText] = useState('')

  const heightCm = parseNumber(heightText)
  const weightKg = parseNumber(weightText)
  const heightOk = heightCm !== null && heightCm >= MIN_HEIGHT_CM && heightCm <= MAX_HEIGHT_CM
  const weightOk = weightKg !== null && weightKg >= MIN_WEIGHT_KG && weightKg <= MAX_WEIGHT_KG
  const result = heightOk && weightOk ? calculate({ heightCm, weightKg }) : null

  return (
    <section className={ui.tool} aria-label="מחשבון BMI">
      <div className={ui.inner}>
        <form className={ui.form} onSubmit={(event) => event.preventDefault()}>
          <TileGroup
            legend="גיל"
            name={ageName}
            options={AGE_GROUPS}
            value={ageGroup}
            onChange={setAgeGroup}
            columns="two"
          />

          <fieldset className={ui.group}>
            <legend className={ui.legend}>המידות</legend>
            <div className={styles.pair}>
              <Field
                id={heightId}
                label="גובה (ס״מ)"
                hintId={heightHintId}
                hint={`בין ${MIN_HEIGHT_CM} ל-${MAX_HEIGHT_CM}.`}
              >
                <input
                  id={heightId}
                  type="text"
                  inputMode="decimal"
                  className={`${ui.input} ${ui.ltr}`}
                  aria-describedby={heightHintId}
                  value={heightText}
                  onChange={(event) => setHeightText(event.target.value)}
                />
              </Field>
              <Field
                id={weightId}
                label="משקל (ק״ג)"
                hintId={weightHintId}
                hint={`בין ${MIN_WEIGHT_KG} ל-${MAX_WEIGHT_KG}.`}
              >
                <input
                  id={weightId}
                  type="text"
                  inputMode="decimal"
                  className={`${ui.input} ${ui.ltr}`}
                  aria-describedby={weightHintId}
                  value={weightText}
                  onChange={(event) => setWeightText(event.target.value)}
                />
              </Field>
            </div>
          </fieldset>
        </form>

        <div className={ui.output}>
          <h2 className={ui.outputTitle}>התוצאה</h2>
          {result === null ? (
            <p className={fun.panel}>הקלידו גובה ומשקל כדי לחשב.</p>
          ) : ageGroup === 'minor' ? (
            <div className={fun.card}>
              <p className={styles.label}>BMI</p>
              <p className={styles.value}>
                <span className={styles.number}>{formatBmi(result.bmi)}</span>
              </p>
              <p className={styles.meta}>
                אצל ילדים ובני נוער אי אפשר לקרוא את המספר לפי הטבלה של מבוגרים. מעריכים אותו לפי אחוזונים לגיל
                ולמין, ולכן כדאי להתייעץ עם רופא הילדים או אחות טיפת חלב.
              </p>
            </div>
          ) : (
            <>
              <div className={fun.card}>
                <p className={styles.label}>BMI</p>
                <p className={styles.value}>
                  <span className={styles.number} dir="ltr">
                    {formatBmi(result.bmi)}
                  </span>
                  <span className={`${styles.category} ${styles[result.category.id]}`}>{result.category.label}</span>
                </p>
                <p className={styles.meta}>
                  טווח המשקל התקין לגובה {heightCm} ס״מ: {formatKg(result.healthyMinKg)} עד{' '}
                  {formatKg(result.healthyMaxKg)} ק״ג.
                  {result.kgToHealthy > 0
                    ? ` חסרים ${formatKg(result.kgToHealthy)} ק״ג כדי להגיע לתחתית הטווח.`
                    : result.kgToHealthy < 0
                      ? ` ${formatKg(-result.kgToHealthy)} ק״ג מעל לתקרת הטווח.`
                      : ' המשקל נמצא בתוך הטווח.'}
                </p>
              </div>
              <ul className={styles.scale} aria-label="טבלת סיווג BMI למבוגרים">
                {BMI_CATEGORIES.map((category) => (
                  <li
                    key={category.id}
                    className={styles.scaleRow}
                    aria-current={category.id === result.category.id ? 'true' : undefined}
                  >
                    <span>{category.label}</span>
                    <span className={styles.range}>{category.rangeLabel}</span>
                  </li>
                ))}
              </ul>
            </>
          )}
          <p className={`${ui.note} ${fun.flush} ${styles.disclaimer}`}>
            BMI הוא כלי סקירה כללי ולא אבחנה. הוא לא מבחין בין שריר לשומן, ולא מתאים לספורטאים, לקשישים, להריון ולילדים.
            לשיחה על משקל ובריאות פנו לרופא המשפחה.
          </p>
        </div>
      </div>
    </section>
  )
}
