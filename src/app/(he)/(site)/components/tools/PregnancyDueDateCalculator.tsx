'use client'

import { useEffect, useId, useState } from 'react'
import {
  DEFAULT_CYCLE_DAYS,
  MAX_CYCLE_DAYS,
  MIN_CYCLE_DAYS,
  calculate,
  clamp,
  dayToIso,
  formatLong,
  formatShort,
  parseDay,
  todayDay,
  trimesterLabels,
  weeksLabel,
  type PregnancyMode,
} from '@/lib/pregnancy-due-date'
import { Field, TileGroup } from './FunTiles'
import ui from './toolUi.module.css'
import fun from './FunTool.module.css'
import styles from './PregnancyDueDateCalculator.module.css'

const MODES: { id: PregnancyMode; label: string; hint: string }[] = [
  { id: 'lmp', label: 'לפי הווסת האחרונה', hint: 'היום הראשון של הווסת האחרונה' },
  { id: 'conception', label: 'לפי תאריך התעברות', hint: 'ידוע, למשל בהפריה חוץ גופית' },
]

const statusLabels = { upcoming: 'בהמשך', now: 'עכשיו', passed: 'עבר' }

export default function PregnancyDueDateCalculator() {
  const modeName = useId()
  const dateId = useId()
  const dateHintId = useId()
  const cycleId = useId()
  const cycleHintId = useId()

  const [mode, setMode] = useState<PregnancyMode>('lmp')
  const [dateText, setDateText] = useState('')
  const [cycleText, setCycleText] = useState(String(DEFAULT_CYCLE_DAYS))
  const [today, setToday] = useState<number | null>(null)

  useEffect(() => {
    setToday(todayDay())
  }, [])

  const parsedCycle = Number.parseInt(cycleText, 10)
  const cycleDays = Number.isNaN(parsedCycle) ? DEFAULT_CYCLE_DAYS : clamp(parsedCycle, MIN_CYCLE_DAYS, MAX_CYCLE_DAYS)
  const day = parseDay(dateText)
  const result = day === null ? null : calculate({ mode, day, cycleDays }, today)

  const fillToday = () => {
    if (today !== null) setDateText(dayToIso(today))
  }

  return (
    <section className={ui.tool} aria-label="מחשבון תאריך לידה משוער">
      <div className={ui.inner}>
        <form className={ui.form} onSubmit={(event) => event.preventDefault()}>
          <TileGroup legend="איך מחשבים" name={modeName} options={MODES} value={mode} onChange={setMode} columns="two" />

          <fieldset className={ui.group}>
            <legend className={ui.legend}>התאריך</legend>
            <Field
              id={dateId}
              label={mode === 'lmp' ? 'היום הראשון של הווסת האחרונה' : 'תאריך ההתעברות'}
              hintId={dateHintId}
              hint={
                mode === 'lmp'
                  ? 'היום שבו התחיל הדימום, לא היום שבו הסתיים.'
                  : 'תאריך ההתעברות או ההחזרה, כפי שנמסר במרפאה.'
              }
            >
              <input
                id={dateId}
                type="date"
                className={`${ui.input} ${ui.ltr} ${ui.date}`}
                aria-describedby={dateHintId}
                value={dateText}
                onChange={(event) => setDateText(event.target.value)}
              />
            </Field>
            {mode === 'lmp' ? (
              <Field
                id={cycleId}
                label="אורך מחזור (ימים)"
                hintId={cycleHintId}
                hint={`בין ${MIN_CYCLE_DAYS} ל-${MAX_CYCLE_DAYS}. ברירת המחדל היא ${DEFAULT_CYCLE_DAYS}.`}
              >
                <input
                  id={cycleId}
                  type="number"
                  inputMode="numeric"
                  min={MIN_CYCLE_DAYS}
                  max={MAX_CYCLE_DAYS}
                  className={`${ui.input} ${ui.ltr}`}
                  aria-describedby={cycleHintId}
                  value={cycleText}
                  onChange={(event) => setCycleText(event.target.value)}
                />
              </Field>
            ) : null}
            <div className={ui.actions}>
              <button type="button" className={ui.secondary} onClick={fillToday} disabled={today === null}>
                התאריך של היום
              </button>
            </div>
          </fieldset>
        </form>

        <div className={ui.output}>
          <h2 className={ui.outputTitle}>התוצאה</h2>
          {result === null ? (
            <p className={fun.panel}>בחרו תאריך כדי לראות תאריך לידה משוער.</p>
          ) : (
            <>
              <div className={fun.card}>
                <p className={styles.dueLabel}>תאריך לידה משוער</p>
                <p className={styles.due}>{formatLong(result.dueDay)}</p>
                <p className={styles.meta}>
                  טווח לידה בשלב מלא: {formatShort(result.fullTermFrom)} עד {formatShort(result.fullTermTo)}
                </p>
                {result.phase === 'future' ? (
                  <p className={styles.meta}>התאריך שהוזן עדיין לא הגיע, ולכן אין שבוע הריון נוכחי.</p>
                ) : null}
                {result.weeks !== null && result.extraDays !== null && result.trimester !== null ? (
                  <>
                    <dl className={styles.facts}>
                      <div className={styles.fact}>
                        <dt>היום בהריון</dt>
                        <dd>{weeksLabel(result.weeks, result.extraDays)}</dd>
                      </div>
                      <div className={styles.fact}>
                        <dt>שליש</dt>
                        <dd>{trimesterLabels[result.trimester]}</dd>
                      </div>
                      <div className={styles.fact}>
                        <dt>עד התאריך המשוער</dt>
                        <dd>
                          {result.daysLeft !== null && result.daysLeft >= 0
                            ? `${result.daysLeft} ימים`
                            : `עברו ${Math.abs(result.daysLeft ?? 0)} ימים`}
                        </dd>
                      </div>
                    </dl>
                    {result.progress !== null ? (
                      <div
                        className={styles.bar}
                        role="progressbar"
                        aria-label="התקדמות ההריון"
                        aria-valuemin={0}
                        aria-valuemax={100}
                        aria-valuenow={Math.round(result.progress * 100)}
                      >
                        <div className={styles.barFill} style={{ width: `${result.progress * 100}%` }} />
                      </div>
                    ) : null}
                  </>
                ) : null}
                {result.phase === 'beyond' ? (
                  <p className={styles.meta}>עברו יותר מ-42 שבועות. כדאי לוודא את התאריך מול הרופא.</p>
                ) : null}
              </div>

              <h3 className={styles.subtitle}>בדיקות מקובלות לפי שבוע הריון</h3>
              <ul className={styles.milestones}>
                {result.milestones.map((milestone) => (
                  <li key={milestone.id} className={styles.milestone}>
                    <p className={styles.milestoneTitle}>
                      <span>{milestone.title}</span>
                      {today !== null && result.phase !== 'future' ? (
                        <span className={`${styles.badge} ${milestone.status === 'now' ? styles.now : ''}`}>
                          {statusLabels[milestone.status]}
                        </span>
                      ) : null}
                    </p>
                    <p className={styles.meta}>
                      שבועות {milestone.fromWeek} עד {milestone.toWeek}, בערך {formatShort(milestone.startDay)} עד{' '}
                      {formatShort(milestone.endDay)}. {milestone.note}
                    </p>
                  </li>
                ))}
              </ul>
            </>
          )}
          <p className={`${ui.note} ${fun.flush} ${styles.disclaimer}`}>
            החישוב הוא הערכה ואינו תחליף לרופא. תאריך הלידה הרשמי נקבע במעקב ההריון, לרוב לפי אולטרסאונד. רק מיעוט
            מהתינוקות נולדים בתאריך המשוער עצמו.
          </p>
        </div>
      </div>
    </section>
  )
}
