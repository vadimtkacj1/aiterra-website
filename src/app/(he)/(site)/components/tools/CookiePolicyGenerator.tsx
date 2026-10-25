'use client'

import { useId, useMemo, useState, type ChangeEvent, type ReactNode } from 'react'
import { Code, Copy, Download } from 'lucide-react'
import {
  buildCookiePolicy,
  categoryLabels,
  categoryOrder,
  cookiePolicyChecks,
  cookiePolicyDocument,
  cookiePolicyToHtml,
  cookiePolicyToText,
  cookieTools,
  defaultCookieInput,
  type ConsentMode,
  type CookiePolicyInput,
} from '@/lib/cookie-policy'
import CookiePolicyDocument from './CookiePolicyDocument'
import ui from './toolUi.module.css'
import styles from './CookiePolicyGenerator.module.css'

type TextKey = 'siteName' | 'contactEmail' | 'contactPhone' | 'privacyUrl' | 'otherTools'

const todayIso = () => new Date().toISOString().slice(0, 10)

function Field({
  label,
  hint,
  children,
}: {
  label: string
  hint?: string
  children: (id: string, hintId?: string) => ReactNode
}) {
  const id = useId()
  const hintId = hint ? `${id}-hint` : undefined
  return (
    <div className={ui.field}>
      <label htmlFor={id} className={ui.label}>
        {label}
      </label>
      {hint ? (
        <p id={hintId} className={ui.hint}>
          {hint}
        </p>
      ) : null}
      {children(id, hintId)}
    </div>
  )
}

export default function CookiePolicyGenerator() {
  const [input, setInput] = useState<CookiePolicyInput>(() => defaultCookieInput(todayIso()))
  const [status, setStatus] = useState('')
  const blocks = useMemo(() => buildCookiePolicy(input), [input])
  const problems = useMemo(() => cookiePolicyChecks(input), [input])
  const hasTools = input.toolIds.length > 0 || input.otherTools.trim().length > 0

  const setText = (key: TextKey) => (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setInput((current) => ({ ...current, [key]: event.target.value }))

  const toggleTool = (id: string) =>
    setInput((current) => ({
      ...current,
      toolIds: current.toolIds.includes(id) ? current.toolIds.filter((item) => item !== id) : [...current.toolIds, id],
    }))

  const setConsent = (consentMode: ConsentMode) => () => setInput((current) => ({ ...current, consentMode }))

  const copy = async (format: 'text' | 'html') => {
    const value = format === 'html' ? cookiePolicyToHtml(blocks) : cookiePolicyToText(blocks)
    try {
      await navigator.clipboard.writeText(value)
      setStatus(format === 'html' ? 'קוד ה-HTML הועתק' : 'הטקסט הועתק')
      window.gtag?.('event', 'cookie_policy_copy', { format })
    } catch {
      setStatus('ההעתקה נכשלה. סמנו את הטקסט בתצוגה המקדימה והעתיקו ידנית.')
    }
  }

  const download = () => {
    const title = `מדיניות עוגיות של ${input.siteName.trim() || 'האתר'}`
    const url = URL.createObjectURL(
      new Blob([cookiePolicyDocument(blocks, title)], { type: 'text/html;charset=utf-8' }),
    )
    const link = document.createElement('a')
    link.href = url
    link.download = 'cookie-policy.html'
    link.click()
    URL.revokeObjectURL(url)
    setStatus('הקובץ ירד')
    window.gtag?.('event', 'cookie_policy_copy', { format: 'file' })
  }

  const reset = () => {
    setInput(defaultCookieInput(todayIso()))
    setStatus('הטופס אופס')
  }

  return (
    <section className={ui.tool} aria-label="מחולל מדיניות עוגיות">
      <div className={ui.inner}>
        <form className={ui.form} onSubmit={(event) => event.preventDefault()}>
          <fieldset className={ui.group}>
            <legend className={ui.legend}>פרטי האתר</legend>
            <Field label="שם האתר או העסק">
              {(id) => <input id={id} className={ui.input} value={input.siteName} onChange={setText('siteName')} />}
            </Field>
            <div className={styles.pair}>
              <Field label="דוא״ל ליצירת קשר">
                {(id) => (
                  <input
                    id={id}
                    type="email"
                    className={`${ui.input} ${ui.ltr}`}
                    value={input.contactEmail}
                    onChange={setText('contactEmail')}
                  />
                )}
              </Field>
              <Field label="טלפון" hint="לא חובה">
                {(id, hintId) => (
                  <input
                    id={id}
                    aria-describedby={hintId}
                    type="tel"
                    className={`${ui.input} ${ui.ltr}`}
                    value={input.contactPhone}
                    onChange={setText('contactPhone')}
                  />
                )}
              </Field>
            </div>
            <Field label="כתובת עמוד מדיניות הפרטיות" hint="לא חובה. אם תמלאו, המדיניות תקשר אליו.">
              {(id, hintId) => (
                <input
                  id={id}
                  aria-describedby={hintId}
                  className={`${ui.input} ${ui.ltr}`}
                  inputMode="url"
                  placeholder="https://example.co.il/privacy-policy"
                  value={input.privacyUrl}
                  onChange={setText('privacyUrl')}
                />
              )}
            </Field>
          </fieldset>

          {categoryOrder.map((category) => (
            <fieldset key={category} className={ui.group}>
              <legend className={ui.legend}>{categoryLabels[category].title}</legend>
              <div className={ui.options}>
                {cookieTools
                  .filter((tool) => tool.category === category)
                  .map((tool) => (
                    <label key={tool.id} className={ui.option}>
                      <input
                        type="checkbox"
                        className={ui.checkbox}
                        checked={input.toolIds.includes(tool.id)}
                        onChange={() => toggleTool(tool.id)}
                      />
                      <span className={styles.optionText}>
                        <span>{tool.name}</span>
                        <span className={styles.toolMeta}>{tool.vendor}</span>
                      </span>
                    </label>
                  ))}
              </div>
            </fieldset>
          ))}

          <fieldset className={ui.group}>
            <legend className={ui.legend}>כלים נוספים</legend>
            <Field label="שורה לכל כלי: שם - מה הוא עושה" hint="למשל: Pipedrive - ניהול פניות מהטפסים">
              {(id, hintId) => (
                <textarea
                  id={id}
                  aria-describedby={hintId}
                  className={`${ui.input} ${ui.textarea}`}
                  value={input.otherTools}
                  onChange={setText('otherTools')}
                />
              )}
            </Field>
          </fieldset>

          <fieldset className={ui.group}>
            <legend className={ui.legend}>איך האתר מקבל הסכמה</legend>
            <div className={ui.options}>
              <label className={ui.option}>
                <input
                  type="radio"
                  name="consent-mode"
                  className={ui.checkbox}
                  checked={input.consentMode === 'banner'}
                  onChange={setConsent('banner')}
                />
                <span>הכלים נטענים רק אחרי אישור בבאנר</span>
              </label>
              <label className={ui.option}>
                <input
                  type="radio"
                  name="consent-mode"
                  className={ui.checkbox}
                  checked={input.consentMode === 'immediate'}
                  onChange={setConsent('immediate')}
                />
                <span>הכלים נטענים מיד עם הכניסה לאתר</span>
              </label>
            </div>
            {input.consentMode === 'immediate' && hasTools ? (
              <p className={styles.warning}>
                כלי מדידה ופרסום שנטענים בלי אישור הגולש קשים להתאמה לחוק אחרי תיקון 13, שבו מזהה מקוון הוא מידע
                אישי, ובאיחוד האירופי הם אסורים בלי הסכמה מראש. מומלץ לעבור לבאנר, וכדאי לבדוק את זה עם עורך דין.
              </p>
            ) : null}
            {input.consentMode === 'banner' ? (
              <label className={ui.option}>
                <input
                  type="checkbox"
                  className={ui.checkbox}
                  checked={input.settingsLink}
                  onChange={() => setInput((current) => ({ ...current, settingsLink: !current.settingsLink }))}
                />
                <span>יש קישור ״הגדרות עוגיות״ בתחתית האתר לשינוי הבחירה</span>
              </label>
            ) : null}
          </fieldset>

          <div className={styles.footerRow}>
            <label className={ui.option}>
              <input
                type="checkbox"
                className={ui.checkbox}
                checked={input.credit}
                onChange={() => setInput((current) => ({ ...current, credit: !current.credit }))}
              />
              <span>להוסיף בסוף שורת קרדיט עם קישור למחולל</span>
            </label>
            <button type="button" className={styles.reset} onClick={reset}>
              איפוס הטופס
            </button>
          </div>
        </form>

        <div className={ui.output}>
          <div className={ui.sticky}>
            <h2 className={ui.outputTitle}>המדיניות שלכם</h2>
            <p className={styles.disclaimer}>
              זו תבנית כללית ולא ייעוץ משפטי. היא מתארת רק את מה שבחרתם, ולכן בדקו שהיא תואמת את מה שקורה באתר בפועל.
              לשאלות לגבי המקרה שלכם פנו לעורך דין.
            </p>
            {problems.length ? (
              <ul className={styles.problems}>
                {problems.map((problem) => (
                  <li key={problem.message}>{problem.message}</li>
                ))}
              </ul>
            ) : null}
            <div className={ui.paper} role="region" aria-label="תצוגה מקדימה של המדיניות" tabIndex={0}>
              <CookiePolicyDocument blocks={blocks} />
            </div>
            <div className={ui.actions}>
              <button type="button" className={`${ui.primary} ${styles.wide}`} onClick={() => copy('text')}>
                <Copy aria-hidden="true" />
                העתקת המדיניות
              </button>
              <button type="button" className={ui.secondary} onClick={() => copy('html')}>
                <Code aria-hidden="true" />
                קוד HTML
              </button>
              <button type="button" className={ui.secondary} onClick={download}>
                <Download aria-hidden="true" />
                קובץ
              </button>
            </div>
            <p className={ui.status} role="status" aria-live="polite">
              {status}
            </p>
            <p className={ui.note}>הפרטים שמילאתם נשארים בדפדפן ולא נשלחים לשום מקום.</p>
          </div>
        </div>
      </div>
    </section>
  )
}
