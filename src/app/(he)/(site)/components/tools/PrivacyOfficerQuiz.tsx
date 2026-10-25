'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { Copy, RotateCcw } from 'lucide-react'
import {
  evaluate,
  resultToText,
  statusLabel,
  visibleQuestions,
  type Answer,
  type Answers,
} from '@/lib/privacy-officer-quiz'
import ui from './toolUi.module.css'
import styles from './PrivacyOfficerQuiz.module.css'

const answerOptions: { value: Answer; label: string }[] = [
  { value: 'yes', label: 'כן' },
  { value: 'no', label: 'לא' },
  { value: 'unsure', label: 'לא יודע' },
]

export default function PrivacyOfficerQuiz() {
  const [answers, setAnswers] = useState<Answers>({})
  const [status, setStatus] = useState('')
  const visible = useMemo(() => visibleQuestions(answers), [answers])
  const result = useMemo(() => evaluate(answers), [answers])

  const answer = (id: string, value: Answer) => {
    setAnswers((current) => ({ ...current, [id]: value }))
    setStatus('')
  }

  const reset = () => {
    setAnswers({})
    setStatus('השאלון אופס')
  }

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(resultToText(result))
      setStatus('התוצאה הועתקה')
      window.gtag?.('event', 'privacy_officer_quiz_copy')
    } catch {
      setStatus('ההעתקה נכשלה. סמנו את הטקסט והעתיקו ידנית.')
    }
  }

  return (
    <section className={ui.tool} aria-label="שאלון רישום מאגר מידע וממונה הגנת פרטיות">
      <div className={ui.inner}>
        <form className={ui.form} onSubmit={(event) => event.preventDefault()}>
          <fieldset className={ui.group}>
            <legend className={ui.legend}>השאלון</legend>
            <p className={ui.hint}>
              כל שאלה מתייחסת לאופן שבו אתם מחזיקים מידע אישי בפועל. שאלות נוספות מופיעות לפי התשובות.
            </p>
            <ol className={styles.questions}>
              {visible.map((question) => (
                <li key={question.id} className={styles.question}>
                  <fieldset className={styles.questionSet}>
                    <legend className={styles.questionText}>{question.question}</legend>
                    <p className={ui.hint}>{question.hint}</p>
                    <p className={styles.basis}>{question.basis}</p>
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
            {result.answeredCount === 0 ? (
              <p className={styles.empty}>
                ענו על השאלות ותראו כאן אם יש חובת רישום, חובת הודעה לרשות וחובת מינוי ממונה, עם הסעיף שמאחורי כל
                תשובה.
              </p>
            ) : (
              <>
                {result.complete ? null : (
                  <p className={styles.progress}>
                    עניתם על {result.answeredCount} מתוך {result.visibleCount} שאלות. התוצאה מתעדכנת תוך כדי, ושאלות
                    שלא נענו נחשבות כלא ידועות.
                  </p>
                )}
                <ul className={styles.duties}>
                  {result.duties.map((duty) => (
                    <li key={duty.id} className={styles.duty} data-status={duty.status}>
                      <p className={styles.dutyHead}>
                        <span className={styles.badge}>{statusLabel[duty.status]}</span>
                        {duty.title}
                      </p>
                      <ul className={styles.reasons}>
                        {duty.reasons.map((reason) => (
                          <li key={reason}>{reason}</li>
                        ))}
                      </ul>
                      <p className={styles.next}>{duty.next}</p>
                      <p className={styles.dutyBasis}>{duty.basis} לחוק הגנת הפרטיות</p>
                    </li>
                  ))}
                </ul>
                <p className={ui.note}>
                  גם מי שפטור מרישום ומממונה חייב בשאר החובות, כמו הודעה ליד טפסים ואבטחת מידע. אפשר לבדוק אותן ב
                  <Link href="/tools/amendment-13-website-checklist">צ׳קליסט תיקון 13 לאתר</Link>.
                </p>
                <div className={ui.actions}>
                  <button type="button" className={`${ui.primary} ${styles.wide}`} onClick={copy}>
                    <Copy aria-hidden="true" />
                    העתקת התוצאה
                  </button>
                </div>
              </>
            )}
            <p className={ui.status} role="status" aria-live="polite">
              {status}
            </p>
            <p className={ui.note}>
              השאלון רץ בדפדפן שלכם והתשובות לא נשלחות לשום מקום. התוצאה היא כלי עזר כללי, לא ייעוץ משפטי ולא קביעה של
              הרשות להגנת הפרטיות. לבדיקת המקרה שלכם פנו לעורך דין או ליועץ פרטיות.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
