'use client'

import { useId, useMemo, useState } from 'react'
import { Eraser, FileText } from 'lucide-react'
import {
  MAX_LINKS,
  SAMPLE_MESSAGE,
  analyzeText,
  officialReport,
  verdictLabels,
  verdictSummaries,
  type LinkReport,
} from '@/lib/suspicious-link'
import ui from './toolUi.module.css'
import styles from './SuspiciousLinkChecker.module.css'

function LinkCard({ report }: { report: LinkReport }) {
  return (
    <li className={`${styles.card} ${styles[report.verdict]}`}>
      <p className={styles.verdict}>{verdictLabels[report.verdict]}</p>
      <p className={styles.host} dir="ltr">
        {report.host}
      </p>
      <p className={styles.url} dir="ltr">
        {report.input}
      </p>
      <p className={styles.summary}>{verdictSummaries[report.verdict]}</p>
      <ul className={styles.reasons}>
        {report.findings.map((finding) => (
          <li key={finding.text} className={finding.weight >= 2 ? styles.strong : undefined}>
            {finding.text}
          </li>
        ))}
      </ul>
    </li>
  )
}

export default function SuspiciousLinkChecker() {
  const [text, setText] = useState('')
  const fieldId = useId()
  const hintId = `${fieldId}-hint`
  const analysis = useMemo(() => analyzeText(text), [text])
  const hasText = text.trim().length > 0
  const risky = analysis.links.some((link) => link.verdict !== 'ok')

  return (
    <section className={`${ui.tool} ${styles.checker}`} aria-label="בדיקת קישור חשוד">
      <div className={`${ui.inner} ${styles.layout}`}>
        <form className={ui.form} onSubmit={(event) => event.preventDefault()}>
          <fieldset className={ui.group}>
            <legend className={ui.legend}>הקישור או ההודעה</legend>
            <div className={ui.field}>
              <label htmlFor={fieldId} className={ui.label}>
                הדביקו קישור, או את כל הודעת ה-SMS, הוואטסאפ או המייל
              </label>
              <p id={hintId} className={ui.hint}>
                אל תלחצו על הקישור כדי להעתיק אותו. לחיצה ארוכה על ההודעה ובחירה ב״העתקה״ מספיקה.
              </p>
              <textarea
                id={fieldId}
                className={`${ui.input} ${ui.textarea} ${styles.text}`}
                rows={6}
                autoComplete="off"
                spellCheck={false}
                data-lpignore="true"
                data-1p-ignore=""
                value={text}
                aria-describedby={hintId}
                onChange={(event) => setText(event.target.value)}
              />
            </div>
            <div className={ui.actions}>
              <button type="button" className={ui.secondary} onClick={() => setText(SAMPLE_MESSAGE)}>
                <FileText aria-hidden="true" />
                דוגמה להודעה חשודה
              </button>
              <button type="button" className={ui.secondary} onClick={() => setText('')} disabled={!hasText}>
                <Eraser aria-hidden="true" />
                ניקוי
              </button>
            </div>
          </fieldset>
        </form>

        <div className={ui.output}>
          <div className={ui.sticky} aria-live="polite">
            <h2 className={ui.outputTitle}>התוצאה</h2>
            {!hasText ? <p className={styles.empty}>הדביקו טקסט, והבדיקה תופיע כאן מיד.</p> : null}
            {hasText && !analysis.links.length ? (
              <p className={styles.empty}>לא מצאנו קישור בטקסט. בדקו שהעתקתם את הכתובת המלאה.</p>
            ) : null}
            {analysis.links.length ? (
              <ul className={styles.cards}>
                {analysis.links.map((report) => (
                  <LinkCard key={report.input} report={report} />
                ))}
              </ul>
            ) : null}
            {analysis.truncated ? <p className={ui.note}>נבדקו {MAX_LINKS} הקישורים הראשונים בלבד.</p> : null}
            {analysis.messageSignals.length ? (
              <div className={styles.signals}>
                <p className={styles.signalsTitle}>גם נוסח ההודעה מזכיר הונאה:</p>
                <ul>
                  {analysis.messageSignals.map((signal) => (
                    <li key={signal}>{signal}</li>
                  ))}
                </ul>
              </div>
            ) : null}
            {risky ? (
              <p className={styles.report}>
                קיבלתם הודעה כזו? דווחו למרכז 119 של מערך הסייבר הלאומי: בטלפון 119, במייל{' '}
                <a href={`mailto:${officialReport.email}`} dir="ltr">
                  {officialReport.email}
                </a>{' '}
                או ב
                <a href={officialReport.href} rel="noopener" target="_blank">
                  טופס הדיווח באתר gov.il
                </a>
                .
              </p>
            ) : null}
            <p className={ui.note}>
              הבדיקה היא הערכה לפי סימנים מוכרים, לא אישור שהקישור בטוח. היא נעשית בדפדפן שלכם: הטקסט לא נשלח לשום
              מקום, והקישור לא נפתח.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
