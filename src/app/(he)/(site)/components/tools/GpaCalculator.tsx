'use client'

import { useId, useMemo, useRef, useState } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import {
  MAX_COURSES,
  creditsError,
  formatAverage,
  gradeError,
  parseDecimal,
  passFailCredits,
  requiredAverage,
  summarize,
  type Course,
} from '@/lib/gpa'
import ui from './toolUi.module.css'
import styles from './GpaCalculator.module.css'

const emptyCourse = (id: number): Course => ({ id, name: '', credits: '', grade: '', pass: false })

const startingCourses: Course[] = [
  { id: 1, name: '', credits: '4', grade: '88', pass: false },
  { id: 2, name: '', credits: '3', grade: '92', pass: false },
  { id: 3, name: '', credits: '2', grade: '75', pass: false },
]

export default function GpaCalculator() {
  const [courses, setCourses] = useState<Course[]>(startingCourses)
  const [target, setTarget] = useState('90')
  const [remaining, setRemaining] = useState('')
  const [announce, setAnnounce] = useState('')
  const nextId = useRef(4)
  const baseId = useId()

  const summary = useMemo(() => summarize(courses), [courses])
  const passCredits = useMemo(() => passFailCredits(courses), [courses])
  const targetValue = parseDecimal(target)
  const remainingValue = parseDecimal(remaining)
  const outcome =
    targetValue !== null && remainingValue !== null
      ? requiredAverage(summary, targetValue, remainingValue)
      : ({ kind: 'incomplete' } as const)

  const update = (id: number, patch: Partial<Course>) =>
    setCourses((list) => list.map((course) => (course.id === id ? { ...course, ...patch } : course)))

  const add = () => {
    if (courses.length >= MAX_COURSES) return
    const id = nextId.current++
    setCourses((list) => [...list, emptyCourse(id)])
    setAnnounce(`נוסף קורס ${courses.length + 1}.`)
  }

  const remove = (id: number, index: number) => {
    setCourses((list) => (list.length > 1 ? list.filter((course) => course.id !== id) : [emptyCourse(nextId.current++)]))
    setAnnounce(`קורס ${index + 1} הוסר.`)
  }

  const clear = () => {
    setCourses([emptyCourse(nextId.current++)])
    setAnnounce('כל הקורסים נמחקו.')
  }

  return (
    <section className={ui.tool} aria-labelledby={`${baseId}-title`}>
      <div className={ui.inner}>
        <div className={ui.form}>
          <div className={ui.group}>
            <h2 id={`${baseId}-title`} className={ui.legend}>
              הקורסים שלכם
            </h2>
            <ul className={styles.list}>
              {courses.map((course, index) => {
                const number = index + 1
                const creditsMessage = creditsError(course.credits)
                const gradeMessage = course.pass ? '' : gradeError(course.grade)
                const errorId = `${baseId}-err-${course.id}`
                const message = creditsMessage || gradeMessage
                return (
                  <li key={course.id} className={styles.row}>
                    <span className={styles.number} aria-hidden="true">
                      {number}
                    </span>
                    <input
                      className={`${ui.input} ${styles.name}`}
                      value={course.name}
                      maxLength={60}
                      placeholder="שם הקורס (לא חובה)"
                      aria-label={`שם קורס ${number}`}
                      onChange={(event) => update(course.id, { name: event.target.value })}
                    />
                    <input
                      className={`${ui.input} ${ui.ltr} ${styles.small}`}
                      inputMode="decimal"
                      autoComplete="off"
                      placeholder="נ״ז"
                      maxLength={5}
                      value={course.credits}
                      aria-label={`נקודות זכות בקורס ${number}`}
                      aria-invalid={creditsMessage ? true : undefined}
                      aria-describedby={message ? errorId : undefined}
                      onChange={(event) => update(course.id, { credits: event.target.value })}
                    />
                    <input
                      className={`${ui.input} ${ui.ltr} ${styles.small}`}
                      inputMode="decimal"
                      autoComplete="off"
                      placeholder="ציון"
                      maxLength={6}
                      disabled={course.pass}
                      value={course.pass ? '' : course.grade}
                      aria-label={`ציון בקורס ${number}`}
                      aria-invalid={gradeMessage ? true : undefined}
                      aria-describedby={message ? errorId : undefined}
                      onChange={(event) => update(course.id, { grade: event.target.value })}
                    />
                    <label className={styles.pass}>
                      <input
                        type="checkbox"
                        className={ui.checkbox}
                        checked={course.pass}
                        onChange={(event) => update(course.id, { pass: event.target.checked })}
                      />
                      <span>עובר/נכשל</span>
                    </label>
                    <button
                      type="button"
                      className={styles.remove}
                      aria-label={`הסרת קורס ${number}`}
                      onClick={() => remove(course.id, index)}
                    >
                      <Trash2 aria-hidden="true" />
                    </button>
                    {message ? (
                      <p id={errorId} className={styles.error}>
                        {message}
                      </p>
                    ) : null}
                  </li>
                )
              })}
            </ul>
            <div className={ui.actions}>
              <button type="button" className={ui.secondary} onClick={add} disabled={courses.length >= MAX_COURSES}>
                <Plus aria-hidden="true" />
                הוספת קורס
              </button>
              <button type="button" className={ui.secondary} onClick={clear}>
                ניקוי הכול
              </button>
            </div>
            <p className={ui.note}>
              קורס שמסומן ״עובר/נכשל״ לא נכנס לממוצע ולא משפיע עליו. הנתונים נשארים בדפדפן שלכם בלבד.
            </p>
          </div>

          <fieldset className={ui.group}>
            <legend className={ui.legend}>איזה ציון צריך כדי להגיע לממוצע יעד</legend>
            <div className={styles.pair}>
              <div className={ui.field}>
                <label htmlFor={`${baseId}-target`} className={ui.label}>
                  ממוצע יעד
                </label>
                <input
                  id={`${baseId}-target`}
                  className={`${ui.input} ${ui.ltr}`}
                  inputMode="decimal"
                  autoComplete="off"
                  maxLength={6}
                  value={target}
                  onChange={(event) => setTarget(event.target.value)}
                />
              </div>
              <div className={ui.field}>
                <label htmlFor={`${baseId}-remaining`} className={ui.label}>
                  נ״ז שנשארו ללמוד
                </label>
                <input
                  id={`${baseId}-remaining`}
                  className={`${ui.input} ${ui.ltr}`}
                  inputMode="decimal"
                  autoComplete="off"
                  maxLength={6}
                  value={remaining}
                  onChange={(event) => setRemaining(event.target.value)}
                />
              </div>
            </div>
          </fieldset>
        </div>

        <div className={ui.output}>
          <div className={ui.sticky}>
            <h2 className={ui.outputTitle}>הממוצע המשוקלל</h2>
            <div className={styles.card} aria-live="polite" aria-atomic="true">
              {summary.average === null ? (
                <p className={styles.message}>הקלידו נקודות זכות וציון לפחות בקורס אחד.</p>
              ) : (
                <>
                  <p className={styles.big}>{formatAverage(summary.average)}</p>
                  <p className={styles.message}>
                    {formatAverage(summary.weightedCredits)} נ״ז נכנסו לממוצע
                    {passCredits > 0 ? `, ועוד ${formatAverage(passCredits)} נ״ז עובר/נכשל מחוץ לממוצע` : ''}.
                  </p>
                </>
              )}
            </div>

            <h3 className={styles.subTitle}>ציון נדרש בקורסים הבאים</h3>
            <div className={styles.card} aria-live="polite" aria-atomic="true">
              {outcome.kind === 'incomplete' ? (
                <p className={styles.message}>הקלידו ממוצע יעד ומספר נ״ז שנשארו כדי לראות איזה ממוצע צריך בהם.</p>
              ) : null}
              {outcome.kind === 'reachable' ? (
                <p className={styles.message}>
                  כדי להגיע לממוצע {formatAverage(targetValue ?? 0)} צריך ממוצע משוקלל של{' '}
                  <strong>{formatAverage(outcome.needed)}</strong> בשאר הקורסים.
                </p>
              ) : null}
              {outcome.kind === 'already' ? (
                <p className={styles.message}>
                  הממוצע הנוכחי כבר מספיק גבוה: גם ציון נמוך בשאר הקורסים לא ירד מתחת ליעד.
                </p>
              ) : null}
              {outcome.kind === 'impossible' ? (
                <p className={styles.message}>
                  היעד לא בר השגה: אפילו 100 בכל שאר הקורסים נותן ממוצע של {formatAverage(outcome.best)}.
                </p>
              ) : null}
            </div>
            <p className={ui.note}>
              האוניברסיטאות שונות בטיפול בקורס חוזר, בקורס עם ציון נכשל ובעיגול. בדקו את התקנון של המוסד שלכם.
            </p>
            <p className={styles.srOnly} role="status">
              {announce}
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
