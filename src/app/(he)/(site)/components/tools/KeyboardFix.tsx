'use client'

import { useId, useMemo, useState } from 'react'
import { ArrowLeftRight, Copy, Eraser } from 'lucide-react'
import { convertLayout, detectDirection, examples, type FixDirection } from '@/lib/keyboard-fix'
import ui from './toolUi.module.css'
import styles from './KeyboardFix.module.css'

const directionLabel: Record<FixDirection, string> = {
  toHebrew: 'אנגלית ← עברית',
  toEnglish: 'עברית ← אנגלית',
}

export default function KeyboardFix() {
  const [text, setText] = useState('')
  const [mode, setMode] = useState<'auto' | FixDirection>('auto')
  const [status, setStatus] = useState('')
  const inputId = useId()
  const outputId = useId()

  const direction: FixDirection = mode === 'auto' ? detectDirection(text) : mode
  const fixed = useMemo(() => convertLayout(text, direction), [text, direction])

  const copy = async () => {
    if (!fixed) return
    try {
      await navigator.clipboard.writeText(fixed)
      setStatus('הטקסט המתוקן הועתק')
      window.gtag?.('event', 'keyboard_fix_copy', { direction })
    } catch {
      setStatus('ההעתקה נכשלה. סמנו את הטקסט המתוקן והעתיקו ידנית.')
    }
  }

  const swap = () => {
    setText(fixed)
    setMode(direction === 'toHebrew' ? 'toEnglish' : 'toHebrew')
    setStatus('הטקסט המתוקן הועבר לתיבת הקלט')
  }

  return (
    <section className={ui.tool} aria-label="תיקון טקסט שהוקלד בשפה הלא נכונה">
      <div className={`${ui.inner} ${styles.inner}`}>
        <div className={ui.form}>
          <fieldset className={ui.group}>
            <legend className={ui.legend}>מה הקלדתם</legend>
            <div className={ui.field}>
              <label htmlFor={inputId} className={ui.label}>
                הדביקו כאן את הטקסט המשובש
              </label>
              <textarea
                id={inputId}
                className={`${ui.input} ${ui.textarea} ${styles.textarea}`}
                dir="auto"
                placeholder="לדוגמה: akuo, nv eurv?"
                value={text}
                onChange={(event) => setText(event.target.value)}
              />
            </div>
            <div className={ui.options}>
              {(
                [
                  ['auto', 'זיהוי אוטומטי'],
                  ['toHebrew', directionLabel.toHebrew],
                  ['toEnglish', directionLabel.toEnglish],
                ] as const
              ).map(([value, label]) => (
                <label key={value} className={ui.option}>
                  <input
                    type="radio"
                    name="keyboard-direction"
                    className={ui.checkbox}
                    checked={mode === value}
                    onChange={() => setMode(value)}
                  />
                  <span>{label}</span>
                </label>
              ))}
            </div>
          </fieldset>
          <div className={styles.examples}>
            <p className={ui.label}>דוגמאות</p>
            <ul className={styles.exampleList}>
              {examples.map((example) => (
                <li key={example.typed}>
                  <button
                    type="button"
                    className={styles.example}
                    onClick={() => {
                      setText(example.typed)
                      setMode('auto')
                    }}
                  >
                    <span dir="ltr">{example.typed}</span>
                    <span aria-hidden="true">←</span>
                    <span>{example.meant}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className={ui.output}>
          <div className={ui.sticky}>
            <h2 className={ui.outputTitle}>הטקסט המתוקן</h2>
            <p className={styles.direction}>{text ? `כיוון ההמרה: ${directionLabel[direction]}` : 'מחכה לטקסט'}</p>
            <output
              id={outputId}
              htmlFor={inputId}
              className={`${ui.paper} ${styles.result}`}
              dir={direction === 'toHebrew' ? 'rtl' : 'ltr'}
              aria-live="polite"
            >
              {fixed || <span className={styles.placeholder}>כאן יופיע הטקסט בשפה הנכונה</span>}
            </output>
            <div className={ui.actions}>
              <button type="button" className={`${ui.primary} ${styles.wide}`} onClick={copy} disabled={!fixed}>
                <Copy aria-hidden="true" />
                העתקת הטקסט המתוקן
              </button>
              <button type="button" className={ui.secondary} onClick={swap} disabled={!fixed}>
                <ArrowLeftRight aria-hidden="true" />
                להמשיך לערוך
              </button>
              <button
                type="button"
                className={ui.secondary}
                onClick={() => {
                  setText('')
                  setStatus('התיבה נוקתה')
                }}
                disabled={!text}
              >
                <Eraser aria-hidden="true" />
                ניקוי
              </button>
            </div>
            <p className={ui.status} role="status" aria-live="polite">
              {status}
            </p>
            <p className={ui.note}>הטקסט לא נשלח לשום מקום. ההמרה נעשית בדפדפן לפי פריסת המקלדת הישראלית הסטנדרטית.</p>
          </div>
        </div>
      </div>
    </section>
  )
}
