'use client'

import { useId, useState } from 'react'
import {
  DEFAULT_CYCLE_MINUTES,
  DEFAULT_FALL_ASLEEP_MINUTES,
  MAX_CYCLE_MINUTES,
  MAX_FALL_ASLEEP_MINUTES,
  MIN_CYCLE_MINUTES,
  bedtimesForWake,
  clamp,
  durationLabel,
  formatTime,
  parseTime,
  verdictLabels,
  wakeTimesForBed,
  type SleepMode,
} from '@/lib/sleep-cycles'
import { Field, TileGroup } from './FunTiles'
import ui from './toolUi.module.css'
import fun from './FunTool.module.css'
import styles from './SleepCycleCalculator.module.css'

const MODES: { id: SleepMode; label: string; hint: string }[] = [
  { id: 'wake', label: 'מתי ללכת לישון', hint: 'יודעים באיזו שעה קמים' },
  { id: 'bed', label: 'מתי לקום', hint: 'יודעים באיזו שעה נכנסים למיטה' },
]

const parseMinutes = (text: string, fallback: number, min: number, max: number) => {
  const parsed = Number.parseInt(text, 10)
  return Number.isNaN(parsed) ? fallback : clamp(parsed, min, max)
}

export default function SleepCycleCalculator() {
  const modeName = useId()
  const timeId = useId()
  const timeHintId = useId()
  const cycleId = useId()
  const cycleHintId = useId()
  const latencyId = useId()
  const latencyHintId = useId()

  const [mode, setMode] = useState<SleepMode>('wake')
  const [wakeAt, setWakeAt] = useState('07:00')
  const [bedAt, setBedAt] = useState('23:00')
  const [cycleText, setCycleText] = useState(String(DEFAULT_CYCLE_MINUTES))
  const [latencyText, setLatencyText] = useState(String(DEFAULT_FALL_ASLEEP_MINUTES))

  const cycleMinutes = parseMinutes(cycleText, DEFAULT_CYCLE_MINUTES, MIN_CYCLE_MINUTES, MAX_CYCLE_MINUTES)
  const fallAsleepMinutes = parseMinutes(latencyText, DEFAULT_FALL_ASLEEP_MINUTES, 0, MAX_FALL_ASLEEP_MINUTES)

  const timeValue = mode === 'wake' ? wakeAt : bedAt
  const clock = parseTime(timeValue)
  const inputs = clock === null ? null : { clock, cycleMinutes, fallAsleepMinutes }
  const options = inputs ? (mode === 'wake' ? bedtimesForWake(inputs) : wakeTimesForBed(inputs)) : []

  const setTime = (value: string) => (mode === 'wake' ? setWakeAt(value) : setBedAt(value))

  const useNow = () => {
    const now = new Date()
    setBedAt(formatTime(now.getHours() * 60 + now.getMinutes()))
  }

  return (
    <section className={ui.tool} aria-label="מחשבון מחזורי שינה">
      <div className={ui.inner}>
        <form className={ui.form} onSubmit={(event) => event.preventDefault()}>
          <TileGroup legend="מה מחשבים" name={modeName} options={MODES} value={mode} onChange={setMode} columns="two" />

          <fieldset className={ui.group}>
            <legend className={ui.legend}>השעה</legend>
            <Field
              id={timeId}
              label={mode === 'wake' ? 'באיזו שעה צריך לקום' : 'באיזו שעה נכנסים למיטה'}
              hintId={timeHintId}
              hint={mode === 'wake' ? 'השעה שבה השעון המעורר מצלצל.' : 'השעה שבה כיבוי האור והראש על הכרית.'}
            >
              <input
                id={timeId}
                type="time"
                className={`${ui.input} ${ui.ltr} ${styles.time}`}
                aria-describedby={timeHintId}
                value={timeValue}
                onChange={(event) => setTime(event.target.value)}
              />
            </Field>
            {mode === 'bed' ? (
              <div className={ui.actions}>
                <button type="button" className={ui.secondary} onClick={useNow}>
                  השעה עכשיו
                </button>
              </div>
            ) : null}
          </fieldset>

          <fieldset className={ui.group}>
            <legend className={ui.legend}>הנחות החישוב</legend>
            <div className={styles.pair}>
              <Field
                id={cycleId}
                label="אורך מחזור (דקות)"
                hintId={cycleHintId}
                hint={`בין ${MIN_CYCLE_MINUTES} ל-${MAX_CYCLE_MINUTES}. ברירת המחדל היא ממוצע.`}
              >
                <input
                  id={cycleId}
                  type="number"
                  inputMode="numeric"
                  min={MIN_CYCLE_MINUTES}
                  max={MAX_CYCLE_MINUTES}
                  className={`${ui.input} ${ui.ltr}`}
                  aria-describedby={cycleHintId}
                  value={cycleText}
                  onChange={(event) => setCycleText(event.target.value)}
                />
              </Field>
              <Field
                id={latencyId}
                label="זמן עד ההירדמות (דקות)"
                hintId={latencyHintId}
                hint={`בין 0 ל-${MAX_FALL_ASLEEP_MINUTES}. כתבו כמה זמן לוקח לכם בפועל.`}
              >
                <input
                  id={latencyId}
                  type="number"
                  inputMode="numeric"
                  min={0}
                  max={MAX_FALL_ASLEEP_MINUTES}
                  className={`${ui.input} ${ui.ltr}`}
                  aria-describedby={latencyHintId}
                  value={latencyText}
                  onChange={(event) => setLatencyText(event.target.value)}
                />
              </Field>
            </div>
          </fieldset>
        </form>

        <div className={ui.output}>
          <h2 className={ui.outputTitle}>{mode === 'wake' ? 'שעות שכדאי ללכת בהן לישון' : 'שעות שכדאי לקום בהן'}</h2>
          {clock === null ? (
            <p className={fun.panel}>בחרו שעה כדי לראות תוצאות.</p>
          ) : (
            <>
              <p className={fun.panel}>
                {mode === 'wake'
                  ? `כדי לקום ב-${timeValue}, עם ${fallAsleepMinutes} דקות הירדמות ומחזורים של ${cycleMinutes} דקות:`
                  : `אם נכנסים למיטה ב-${timeValue}, עם ${fallAsleepMinutes} דקות הירדמות ומחזורים של ${cycleMinutes} דקות:`}
              </p>
              <ol className={fun.list}>
                {options.map((option) => (
                  <li key={option.cycles} className={fun.card}>
                    <p className={styles.time24}>
                      <span className={styles.clock} dir="ltr">
                        {option.time}
                      </span>
                      <span className={styles.action}>{mode === 'wake' ? 'להיכנס למיטה' : 'להתעורר'}</span>
                    </p>
                    <p className={styles.detail}>
                      {option.cycles} מחזורים: {durationLabel(option.sleepMinutes)} שינה
                    </p>
                    <p className={`${styles.verdict} ${styles[option.verdict]}`}>{verdictLabels[option.verdict]}</p>
                  </li>
                ))}
              </ol>
            </>
          )}
          <p className={`${ui.note} ${fun.flush} ${styles.disclaimer}`}>
            הכלי הוא הערכה כללית ולא ייעוץ רפואי. אורך מחזור משתנה בין אנשים ובין לילות. אם אתם ישנים מספיק אבל
            עייפים כל היום, פנו לרופא.
          </p>
        </div>
      </div>
    </section>
  )
}
