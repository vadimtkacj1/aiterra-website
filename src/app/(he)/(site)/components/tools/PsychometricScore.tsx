'use client'

import { useId, useRef, useState } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import {
  MAX_SUBJECTS,
  bagrutAverage,
  bagrutError,
  combine,
  formatScore,
  neededPsychometric,
  parseNumber,
  psychometricError,
  subjectError,
  weightError,
  type Subject,
} from '@/lib/psychometric-score'
import ui from './toolUi.module.css'
import styles from './PsychometricScore.module.css'

type Preset = '50' | '70' | '30' | 'custom'

const presets: { value: Preset; label: string }[] = [
  { value: '50', label: '50% פסיכומטרי, 50% בגרות' },
  { value: '70', label: '70% פסיכומטרי, 30% בגרות' },
  { value: '30', label: '30% פסיכומטרי, 70% בגרות' },
  { value: 'custom', label: 'משקל אחר' },
]

const emptySubject = (id: number): Subject => ({ id, units: '', grade: '', bonus: '' })

export default function PsychometricScore() {
  const [psychometric, setPsychometric] = useState('')
  const [bagrut, setBagrut] = useState('')
  const [preset, setPreset] = useState<Preset>('50')
  const [custom, setCustom] = useState('60')
  const [target, setTarget] = useState('')
  const [subjects, setSubjects] = useState<Subject[]>([emptySubject(1), emptySubject(2), emptySubject(3)])
  const [announce, setAnnounce] = useState('')
  const nextId = useRef(4)
  const baseId = useId()

  const weightText = preset === 'custom' ? custom : preset
  const weightIssue = preset === 'custom' ? weightError(custom) : ''
  const weight = weightIssue ? null : parseNumber(weightText)
  const psyValue = psychometricError(psychometric) ? null : parseNumber(psychometric)
  const bagrutValue = bagrutError(bagrut) ? null : parseNumber(bagrut)
  const targetValue = parseNumber(target)
  const fromSubjects = bagrutAverage(subjects)

  const combined =
    psyValue !== null && bagrutValue !== null && weight !== null ? combine(psyValue, bagrutValue, weight) : null
  const needed =
    bagrutValue !== null && weight !== null && targetValue !== null
      ? neededPsychometric(targetValue, bagrutValue, weight)
      : ({ kind: 'incomplete' } as const)

  const update = (id: number, patch: Partial<Subject>) =>
    setSubjects((list) => list.map((subject) => (subject.id === id ? { ...subject, ...patch } : subject)))

  const addSubject = () => {
    if (subjects.length >= MAX_SUBJECTS) return
    setSubjects((list) => [...list, emptySubject(nextId.current++)])
    setAnnounce(`נוסף מקצוע ${subjects.length + 1}.`)
  }

  const removeSubject = (id: number, index: number) => {
    setSubjects((list) => (list.length > 1 ? list.filter((item) => item.id !== id) : [emptySubject(nextId.current++)]))
    setAnnounce(`מקצוע ${index + 1} הוסר.`)
  }

  const useAverage = () => {
    if (!fromSubjects) return
    setBagrut(String(Math.round(fromSubjects.average * 100) / 100))
    setAnnounce('הממוצע הועבר לשדה ממוצע הבגרות.')
  }

  const psyIssue = psychometricError(psychometric)
  const bagrutIssue = bagrutError(bagrut)

  return (
    <section className={ui.tool} aria-labelledby={`${baseId}-title`}>
      <div className={ui.inner}>
        <div className={ui.form}>
          <div className={ui.group}>
            <h2 id={`${baseId}-title`} className={ui.legend}>
              הציונים שלכם
            </h2>
            <div className={styles.pair}>
              <div className={ui.field}>
                <label htmlFor={`${baseId}-psy`} className={ui.label}>
                  ציון פסיכומטרי (200 עד 800)
                </label>
                <input
                  id={`${baseId}-psy`}
                  className={`${ui.input} ${ui.ltr}`}
                  inputMode="numeric"
                  autoComplete="off"
                  maxLength={4}
                  value={psychometric}
                  aria-invalid={psyIssue ? true : undefined}
                  aria-describedby={psyIssue ? `${baseId}-psy-error` : undefined}
                  onChange={(event) => setPsychometric(event.target.value)}
                />
                {psyIssue ? (
                  <p id={`${baseId}-psy-error`} className={styles.error}>
                    {psyIssue}
                  </p>
                ) : null}
              </div>
              <div className={ui.field}>
                <label htmlFor={`${baseId}-bagrut`} className={ui.label}>
                  ממוצע בגרות
                </label>
                <input
                  id={`${baseId}-bagrut`}
                  className={`${ui.input} ${ui.ltr}`}
                  inputMode="decimal"
                  autoComplete="off"
                  maxLength={6}
                  value={bagrut}
                  aria-invalid={bagrutIssue ? true : undefined}
                  aria-describedby={`${baseId}-bagrut-hint${bagrutIssue ? ` ${baseId}-bagrut-error` : ''}`}
                  onChange={(event) => setBagrut(event.target.value)}
                />
                <p id={`${baseId}-bagrut-hint`} className={ui.hint}>
                  כולל תוספות בונוס, אם יש לכם.
                </p>
                {bagrutIssue ? (
                  <p id={`${baseId}-bagrut-error`} className={styles.error}>
                    {bagrutIssue}
                  </p>
                ) : null}
              </div>
            </div>
          </div>

          <fieldset className={ui.group}>
            <legend className={ui.legend}>משקל הפסיכומטרי והבגרות</legend>
            <div className={styles.choices}>
              {presets.map((item) => (
                <label key={item.value} className={styles.choice}>
                  <input
                    type="radio"
                    name={`${baseId}-preset`}
                    value={item.value}
                    checked={preset === item.value}
                    onChange={() => setPreset(item.value)}
                  />
                  <span>{item.label}</span>
                </label>
              ))}
            </div>
            {preset === 'custom' ? (
              <div className={ui.field}>
                <label htmlFor={`${baseId}-weight`} className={ui.label}>
                  משקל הפסיכומטרי באחוזים (השאר הוא הבגרות)
                </label>
                <input
                  id={`${baseId}-weight`}
                  className={`${ui.input} ${ui.ltr} ${styles.narrow}`}
                  inputMode="decimal"
                  autoComplete="off"
                  maxLength={5}
                  value={custom}
                  aria-invalid={weightIssue ? true : undefined}
                  aria-describedby={weightIssue ? `${baseId}-weight-error` : undefined}
                  onChange={(event) => setCustom(event.target.value)}
                />
                {weightIssue ? (
                  <p id={`${baseId}-weight-error`} className={styles.error}>
                    {weightIssue}
                  </p>
                ) : null}
              </div>
            ) : null}
          </fieldset>

          <details className={ui.group}>
            <summary className={styles.summary}>חישוב ממוצע בגרות ממקצועות ובונוסים</summary>
            <p className={ui.note}>
              הקלידו לכל מקצוע יחידות לימוד וציון. את תוספת הבונוס מקלידים לפי הכללים של המוסד שאליו אתם פונים: הכלי
              לא מניח בונוס בשבילכם.
            </p>
            <ul className={styles.list}>
              {subjects.map((subject, index) => {
                const number = index + 1
                const issue = subjectError(subject)
                const errorId = `${baseId}-subject-${subject.id}-error`
                return (
                  <li key={subject.id} className={styles.row}>
                    <input
                      className={`${ui.input} ${ui.ltr} ${styles.small}`}
                      inputMode="decimal"
                      autoComplete="off"
                      placeholder="יחידות"
                      maxLength={3}
                      value={subject.units}
                      aria-label={`יחידות לימוד במקצוע ${number}`}
                      aria-invalid={issue ? true : undefined}
                      aria-describedby={issue ? errorId : undefined}
                      onChange={(event) => update(subject.id, { units: event.target.value })}
                    />
                    <input
                      className={`${ui.input} ${ui.ltr} ${styles.small}`}
                      inputMode="decimal"
                      autoComplete="off"
                      placeholder="ציון"
                      maxLength={6}
                      value={subject.grade}
                      aria-label={`ציון במקצוע ${number}`}
                      aria-invalid={issue ? true : undefined}
                      aria-describedby={issue ? errorId : undefined}
                      onChange={(event) => update(subject.id, { grade: event.target.value })}
                    />
                    <input
                      className={`${ui.input} ${ui.ltr} ${styles.small}`}
                      inputMode="decimal"
                      autoComplete="off"
                      placeholder="בונוס"
                      maxLength={5}
                      value={subject.bonus}
                      aria-label={`נקודות בונוס במקצוע ${number}`}
                      aria-invalid={issue ? true : undefined}
                      aria-describedby={issue ? errorId : undefined}
                      onChange={(event) => update(subject.id, { bonus: event.target.value })}
                    />
                    <button
                      type="button"
                      className={styles.remove}
                      aria-label={`הסרת מקצוע ${number}`}
                      onClick={() => removeSubject(subject.id, index)}
                    >
                      <Trash2 aria-hidden="true" />
                    </button>
                    {issue ? (
                      <p id={errorId} className={styles.error}>
                        {issue}
                      </p>
                    ) : null}
                  </li>
                )
              })}
            </ul>
            <div className={ui.actions}>
              <button type="button" className={ui.secondary} onClick={addSubject} disabled={subjects.length >= MAX_SUBJECTS}>
                <Plus aria-hidden="true" />
                הוספת מקצוע
              </button>
              <button type="button" className={ui.primary} onClick={useAverage} disabled={!fromSubjects}>
                {fromSubjects ? `שימוש בממוצע ${formatScore(fromSubjects.average, 2)}` : 'שימוש בממוצע'}
              </button>
            </div>
          </details>
        </div>

        <div className={ui.output}>
          <div className={ui.sticky}>
            <h2 className={ui.outputTitle}>הציון המשוקלל</h2>
            <div className={styles.card} aria-live="polite" aria-atomic="true">
              {combined ? (
                <>
                  <p className={styles.big}>{formatScore(combined.score100)}</p>
                  <p className={styles.message}>
                    בסולם של 100. בסולם של 800, כמו הפסיכומטרי, זה <strong>{formatScore(combined.score800, 0)}</strong>.
                  </p>
                </>
              ) : (
                <p className={styles.message}>הקלידו ציון פסיכומטרי וממוצע בגרות כדי לראות את הציון המשוקלל.</p>
              )}
            </div>
            <p className={ui.note}>
              השקלול פשוט: הציון הפסיכומטרי מחולק ב-8 כדי להגיע לסולם של 100, וכל ציון מוכפל במשקל שלו. זו המרה שלנו,
              לא נוסחה של מוסד לימודים.
            </p>

            <h3 className={styles.subTitle}>איזה פסיכומטרי צריך ליעד</h3>
            <div className={ui.field}>
              <label htmlFor={`${baseId}-target`} className={ui.label}>
                ציון משוקלל רצוי בסולם של 100
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
            <div className={styles.card} aria-live="polite" aria-atomic="true">
              {needed.kind === 'incomplete' ? (
                <p className={styles.message}>הקלידו ממוצע בגרות וציון רצוי כדי לראות איזה פסיכומטרי צריך.</p>
              ) : null}
              {needed.kind === 'bagrutOnly' ? (
                <p className={styles.message}>בלי משקל לפסיכומטרי, הציון המשוקלל הוא ממוצע הבגרות בלבד.</p>
              ) : null}
              {needed.kind === 'already' ? (
                <p className={styles.message}>הציון הרצוי מושג כבר עם ציון פסיכומטרי מינימלי של 200.</p>
              ) : null}
              {needed.kind === 'reachable' ? (
                <p className={styles.message}>
                  צריך ציון פסיכומטרי של <strong>{formatScore(needed.needed, 0)}</strong> לפחות.
                </p>
              ) : null}
              {needed.kind === 'impossible' ? (
                <p className={styles.message}>
                  היעד לא בר השגה עם הממוצע והמשקל האלה: היה צריך פסיכומטרי של {formatScore(needed.needed, 0)}, מעל 800.
                </p>
              ) : null}
            </div>
            <p className={styles.srOnly} role="status">
              {announce}
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
