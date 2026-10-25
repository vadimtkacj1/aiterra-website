'use client'

import { useMemo, useState } from 'react'
import { Copy, RotateCcw } from 'lucide-react'
import {
  applicableQuestions,
  defaultTraits,
  evaluate,
  resultToText,
  sections,
  traits,
  verdictText,
  weightLabel,
  type Answer,
  type Answers,
  type SiteTrait,
  type TraitState,
} from '@/lib/amendment-13-checklist'
import ui from './toolUi.module.css'
import styles from './Amendment13Checklist.module.css'

const answerOptions: { value: Answer; label: string }[] = [
  { value: 'yes', label: 'כן' },
  { value: 'no', label: 'לא' },
  { value: 'unsure', label: 'לא יודע' },
]

export default function Amendment13Checklist() {
  const [state, setState] = useState<TraitState>(defaultTraits)
  const [answers, setAnswers] = useState<Answers>({})
  const [status, setStatus] = useState('')
  const visible = useMemo(() => applicableQuestions(state), [state])
  const result = useMemo(() => evaluate(state, answers), [state, answers])

  const toggleTrait = (id: SiteTrait) => setState((current) => ({ ...current, [id]: !current[id] }))

  const answer = (id: string, value: Answer) => setAnswers((current) => ({ ...current, [id]: value }))

  const reset = () => {
    setState(defaultTraits())
    setAnswers({})
    setStatus('הבדיקה אופסה')
  }

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(resultToText(result))
      setStatus('הרשימה הועתקה')
      window.gtag?.('event', 'amendment_13_checklist_copy', { percent: result.percent })
    } catch {
      setStatus('ההעתקה נכשלה. סמנו את הרשימה והעתיקו ידנית.')
    }
  }

  const verdict = verdictText[result.verdict]

  return (
    <section className={ui.tool} aria-label="בדיקת האתר מול תיקון 13">
      <div className={ui.inner}>
        <form className={ui.form} onSubmit={(event) => event.preventDefault()}>
          <fieldset className={ui.group}>
            <legend className={ui.legend}>מה יש באתר ובעסק</legend>
            <p className={ui.hint}>הסימון קובע אילו שאלות יוצגו.</p>
            <div className={ui.options}>
              {traits.map((trait) => (
                <label key={trait.id} className={ui.option}>
                  <input
                    type="checkbox"
                    className={ui.checkbox}
                    checked={state[trait.id]}
                    onChange={() => toggleTrait(trait.id)}
                  />
                  <span className={styles.optionText}>
                    <span>{trait.label}</span>
                    <span className={styles.optionHint}>{trait.hint}</span>
                  </span>
                </label>
              ))}
            </div>
          </fieldset>

          {sections.map((section) => {
            const inSection = visible.filter((question) => question.section === section.id)
            if (!inSection.length) return null
            return (
              <fieldset key={section.id} className={ui.group}>
                <legend className={ui.legend}>{section.title}</legend>
                <p className={ui.hint}>{section.intro}</p>
                <ol className={styles.questions}>
                  {inSection.map((question) => (
                    <li key={question.id} className={styles.question}>
                      <fieldset className={styles.questionSet}>
                        <legend className={styles.questionText}>{question.question}</legend>
                        {question.hint ? <p className={ui.hint}>{question.hint}</p> : null}
                        <div className={styles.answers}>
                          {answerOptions.map((option) => (
                            <label key={option.value} className={styles.answer}>
                              <input
                                type="radio"
                                name={question.id}
                                value={option.value}
                                checked={answers[question.id] === option.value}
                                onChange={() => answer(question.id, option.value)}
                              />
                              <span>{option.label}</span>
                            </label>
                          ))}
                        </div>
                      </fieldset>
                    </li>
                  ))}
                </ol>
              </fieldset>
            )
          })}

          <div className={styles.footerRow}>
            <button type="button" className={styles.reset} onClick={reset}>
              <RotateCcw aria-hidden="true" />
              איפוס
            </button>
          </div>
        </form>

        <div className={ui.output}>
          <div className={ui.sticky}>
            <h2 className={ui.outputTitle}>התוצאה</h2>
            {result.answered === 0 ? (
              <p className={styles.empty}>ענו על השאלות ותראו כאן ציון ורשימת תיקונים לפי סדר דחיפות.</p>
            ) : (
              <>
                <div className={styles.score} data-verdict={result.verdict}>
                  <p className={styles.scoreNumber}>
                    {result.percent}
                    <span className={styles.scoreMax}> מתוך 100</span>
                  </p>
                  <div>
                    <p className={styles.verdictTitle}>{verdict.title}</p>
                    <p className={styles.verdictText}>{verdict.text}</p>
                  </div>
                </div>
                <p className={styles.counts}>
                  {result.yes} במקום, {result.no} חסרים, {result.unsure} לא ידועים. עניתם על {result.answered} מתוך{' '}
                  {result.total} שאלות.
                  {result.complete ? '' : ' הציון יתעדכן ככל שתענו.'}
                </p>
                {result.gaps.length ? (
                  <>
                    <h3 className={styles.gapsTitle}>מה לתקן</h3>
                    <ol className={styles.gaps}>
                      {result.gaps.map(({ question, answer: given }) => (
                        <li key={question.id} className={styles.gap} data-weight={question.weight}>
                          <p className={styles.gapHead}>
                            <span className={styles.badge}>{weightLabel[question.weight]}</span>
                            {question.gap}
                            {given === 'unsure' ? <span className={styles.unsure}> (לא ידוע, צריך לבדוק)</span> : null}
                          </p>
                          <p className={styles.gapFix}>{question.fix}</p>
                          <p className={styles.gapBasis}>{question.basis}</p>
                        </li>
                      ))}
                    </ol>
                  </>
                ) : (
                  <p className={styles.empty}>לפי התשובות שלכם לא נמצאו פערים.</p>
                )}
                <div className={ui.actions}>
                  <button type="button" className={`${ui.primary} ${styles.wide}`} onClick={copy}>
                    <Copy aria-hidden="true" />
                    העתקת הרשימה
                  </button>
                </div>
              </>
            )}
            <p className={ui.status} role="status" aria-live="polite">
              {status}
            </p>
            <p className={ui.note}>
              הבדיקה רצה בדפדפן שלכם והתשובות לא נשלחות לשום מקום. הציון הוא כלי עזר כללי, לא ייעוץ משפטי ולא קביעה
              שהאתר עומד בחוק או לא עומד בו. לבדיקת המקרה שלכם פנו לעורך דין.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
