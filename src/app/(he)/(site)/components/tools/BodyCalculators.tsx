'use client'

import { useId, useState, type ReactNode } from 'react'
import { parseNumber } from '@/lib/bmi'
import {
  ACTIVITY_LEVELS,
  CALORIE_FLOOR,
  DRINK_REFERENCE_LITERS,
  GLASS_ML,
  HEART_ZONES,
  PROTEIN_GOALS,
  bmrMifflin,
  bodyFatBand,
  bodyFatNavy,
  dailyCalories,
  maxHeartRate,
  proteinRange,
  waterLiters,
  type ActivityId,
  type ProteinGoalId,
  type Sex,
} from '@/lib/body-metrics'
import { Field, TileGroup } from './FunTiles'
import ui from './toolUi.module.css'
import fun from './FunTool.module.css'
import styles from './BmiCalculator.module.css'

const SEXES: { id: Sex; label: string }[] = [
  { id: 'female', label: 'אישה' },
  { id: 'male', label: 'גבר' },
]

const whole = (value: number) => Math.round(value).toLocaleString('he-IL')

export function useNumber(min: number, max: number) {
  const [text, setText] = useState('')
  const parsed = parseNumber(text)
  const value = parsed !== null && parsed >= min && parsed <= max ? parsed : null
  return { text, setText, value, min, max }
}

export function NumberField({ label, field }: { label: string; field: ReturnType<typeof useNumber> }) {
  const id = useId()
  const hintId = useId()
  return (
    <Field id={id} label={label} hintId={hintId} hint={`בין ${field.min.toLocaleString('he-IL')} ל-${field.max.toLocaleString('he-IL')}.`}>
      <input
        id={id}
        type="text"
        inputMode="decimal"
        className={`${ui.input} ${ui.ltr}`}
        aria-describedby={hintId}
        value={field.text}
        onChange={(event) => field.setText(event.target.value)}
      />
    </Field>
  )
}

export function Shell({
  name,
  inputs,
  prompt,
  note,
  children,
}: {
  name: string
  inputs: ReactNode
  prompt: string
  note: string
  children: ReactNode
}) {
  return (
    <section className={ui.tool} aria-label={name}>
      <div className={ui.inner}>
        <form className={ui.form} onSubmit={(event) => event.preventDefault()}>
          {inputs}
        </form>
        <div className={ui.output}>
          <h2 className={ui.outputTitle}>התוצאה</h2>
          {children ?? <p className={fun.panel}>{prompt}</p>}
          <p className={`${ui.note} ${fun.flush} ${styles.disclaimer}`}>{note}</p>
        </div>
      </div>
    </section>
  )
}

export function Metric({ label, value, unit, meta }: { label: string; value: string; unit: string; meta?: string }) {
  return (
    <div className={fun.card}>
      <p className={styles.label}>{label}</p>
      <p className={styles.value}>
        <span className={styles.number} dir="ltr">
          {value}
        </span>
        <span>{unit}</span>
      </p>
      {meta ? <p className={styles.meta}>{meta}</p> : null}
    </div>
  )
}

export function Rows({ label, rows }: { label: string; rows: [string, string][] }) {
  return (
    <ul className={styles.scale} aria-label={label}>
      {rows.map(([title, value]) => (
        <li key={title} className={styles.scaleRow}>
          <span>{title}</span>
          <span className={styles.range} dir="ltr">
            {value}
          </span>
        </li>
      ))}
    </ul>
  )
}

function SexTiles({ value, onChange }: { value: Sex; onChange: (next: Sex) => void }) {
  const name = useId()
  return <TileGroup legend="מין" name={name} options={SEXES} value={value} onChange={onChange} columns="two" />
}

function CalorieResult({ sex, bmr, activity }: { sex: Sex; bmr: number; activity: ActivityId }) {
  const maintain = dailyCalories(bmr, activity)
  const floor = CALORIE_FLOOR[sex]
  const lose = Math.max(maintain - 500, floor)
  return (
    <>
      <Metric
        label="לשמירה על המשקל"
        value={whole(maintain)}
        unit="קק״ל ביום"
        meta={`קצב חילוף חומרים במנוחה (BMR): ${whole(bmr)} קק״ל.`}
      />
      <Rows
        label="יעדי קלוריות"
        rows={[
          ['ירידה של כחצי ק״ג בשבוע', `${whole(lose)}`],
          ['עלייה מתונה במשקל', `${whole(maintain + 300)}`],
        ]}
      />
      {lose === floor ? (
        <p className={fun.panel}>היעד נעצר ב-{whole(floor)} קק״ל, הרף שלא כדאי לרדת ממנו בלי ליווי מקצועי.</p>
      ) : null}
    </>
  )
}

export function CalorieCalculator() {
  const activityName = useId()
  const [sex, setSex] = useState<Sex>('female')
  const [activity, setActivity] = useState<ActivityId>('light')
  const age = useNumber(18, 90)
  const height = useNumber(120, 230)
  const weight = useNumber(35, 300)
  const bmr =
    age.value !== null && height.value !== null && weight.value !== null
      ? bmrMifflin(sex, weight.value, height.value, age.value)
      : null

  return (
    <Shell
      name="מחשבון קלוריות יומי"
      prompt="מלאו גיל, גובה ומשקל כדי לחשב."
      note="הערכה סטטיסטית למבוגרים, לא ייעוץ רפואי. לא מתאים להיריון, להנקה או להפרעות אכילה."
      inputs={
        <>
          <SexTiles value={sex} onChange={setSex} />
          <fieldset className={ui.group}>
            <legend className={ui.legend}>הנתונים</legend>
            <NumberField label="גיל" field={age} />
            <div className={styles.pair}>
              <NumberField label="גובה (ס״מ)" field={height} />
              <NumberField label="משקל (ק״ג)" field={weight} />
            </div>
          </fieldset>
          <TileGroup
            legend="רמת פעילות"
            name={activityName}
            options={ACTIVITY_LEVELS.map(({ id, label, hint }) => ({ id, label, hint }))}
            value={activity}
            onChange={setActivity}
          />
        </>
      }
    >
      {bmr === null ? null : <CalorieResult sex={sex} bmr={bmr} activity={activity} />}
    </Shell>
  )
}

export function ProteinCalculator() {
  const goalName = useId()
  const [goal, setGoal] = useState<ProteinGoalId>('general')
  const weight = useNumber(35, 300)
  const range = weight.value === null ? null : proteinRange(weight.value, goal)

  return (
    <Shell
      name="מחשבון חלבון יומי"
      prompt="הקלידו משקל כדי לחשב."
      note="הערכה למבוגרים בריאים. במחלת כליות, בהיריון ובגיל מבוגר הכמות שונה ויש להתייעץ עם רופא או דיאטן."
      inputs={
        <>
          <NumberField label="משקל (ק״ג)" field={weight} />
          <TileGroup
            legend="מטרה"
            name={goalName}
            options={PROTEIN_GOALS.map(({ id, label, hint }) => ({ id, label, hint }))}
            value={goal}
            onChange={setGoal}
          />
        </>
      }
    >
      {range === null ? null : (
        <Metric
          label="חלבון ביום"
          value={range.min === range.max ? `${range.min}` : `${range.min}–${range.max}`}
          unit="גרם"
          meta={`בחלוקה ל-4 ארוחות: כ-${Math.round(range.max / 4)} גרם בכל ארוחה.`}
        />
      )}
    </Shell>
  )
}

export function WaterCalculator() {
  const [sex, setSex] = useState<Sex>('female')
  const weight = useNumber(35, 300)
  const exercise = useNumber(0, 300)
  const liters = weight.value === null ? null : waterLiters(sex, weight.value, exercise.value ?? 0)

  return (
    <Shell
      name="מחשבון שתיית מים"
      prompt="הקלידו משקל כדי לחשב."
      note="הערכה כללית. בחום כבד שותים יותר. באי ספיקת לב או כליות הכמות נקבעת עם הרופא."
      inputs={
        <>
          <SexTiles value={sex} onChange={setSex} />
          <NumberField label="משקל (ק״ג)" field={weight} />
          <NumberField label="דקות אימון ביום" field={exercise} />
        </>
      }
    >
      {liters === null ? null : (
        <Metric
          label="שתייה ביום"
          value={liters.toFixed(1)}
          unit="ליטר"
          meta={`כ-${Math.round((liters * 1000) / GLASS_ML)} כוסות של ${GLASS_ML} מ״ל. נקודת ייחוס כללית: ${DRINK_REFERENCE_LITERS[sex]} ליטר שתייה ביום.`}
        />
      )}
    </Shell>
  )
}

export function HeartRateCalculator() {
  const age = useNumber(15, 90)
  const max = age.value === null ? null : maxHeartRate(age.value)

  return (
    <Shell
      name="מחשבון דופק מטרה"
      prompt="הקלידו גיל כדי לחשב."
      note="הדופק המרבי האמיתי שונה מאדם לאדם. תרופות כמו חוסמי בטא משנות אותו. במחלת לב התייעצו עם רופא לפני אימון."
      inputs={<NumberField label="גיל" field={age} />}
    >
      {max === null ? null : (
        <>
          <Metric label="דופק מרבי משוער" value={whole(max)} unit="פעימות בדקה" />
          <Rows
            label="אזורי דופק"
            rows={HEART_ZONES.map(({ label, hint, from, to }) => [
              `${label}: ${hint}`,
              `${whole(max * from)}–${whole(max * to)}`,
            ])}
          />
        </>
      )}
    </Shell>
  )
}

export function BodyFatCalculator() {
  const [sex, setSex] = useState<Sex>('female')
  const height = useNumber(120, 230)
  const neck = useNumber(20, 70)
  const waist = useNumber(40, 200)
  const hip = useNumber(50, 200)
  const measured =
    height.value !== null && neck.value !== null && waist.value !== null && (sex === 'male' || hip.value !== null)
  const percent = measured
    ? bodyFatNavy(sex, {
        heightCm: height.value ?? 0,
        neckCm: neck.value ?? 0,
        waistCm: waist.value ?? 0,
        hipCm: hip.value ?? 0,
      })
    : NaN
  const valid = Number.isFinite(percent) && percent > 0 && percent < 70

  return (
    <Shell
      name="מחשבון אחוזי שומן"
      prompt="מלאו את המידות בסנטימטרים כדי לחשב. היקף המותניים חייב להיות גדול מהיקף הצוואר."
      note="הערכה לפי היקפים, עם סטייה של כמה נקודות אחוז. מדידה מדויקת נעשית בבדיקת DEXA."
      inputs={
        <>
          <SexTiles value={sex} onChange={setSex} />
          <fieldset className={ui.group}>
            <legend className={ui.legend}>מידות בס״מ</legend>
            <NumberField label="גובה" field={height} />
            <div className={styles.pair}>
              <NumberField label="היקף צוואר" field={neck} />
              <NumberField label="היקף מותניים" field={waist} />
            </div>
            {sex === 'female' ? <NumberField label="היקף ירכיים" field={hip} /> : null}
          </fieldset>
        </>
      }
    >
      {valid ? (
        <Metric label="אחוז שומן משוער" value={percent.toFixed(1)} unit="%" meta={`טווח: ${bodyFatBand(sex, percent)}.`} />
      ) : null}
    </Shell>
  )
}
