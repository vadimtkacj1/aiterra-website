'use client'

import { useId, useState } from 'react'
import { Copy } from 'lucide-react'
import {
  SEPARATORS,
  convertText,
  fancyStyles,
  frameText,
  frames,
  hasHebrew,
  hasLatin,
  parseWhatsApp,
  whatsAppStyles,
  wrapWhatsApp,
  type WhatsAppStyle,
} from '@/lib/fancy-text'
import ui from './toolUi.module.css'
import styles from './FancyTextGenerator.module.css'

const pieceClass: Record<WhatsAppStyle, string> = {
  bold: styles.waBold,
  italic: styles.waItalic,
  strike: styles.waStrike,
  mono: styles.waMono,
}

export default function FancyTextGenerator() {
  const [text, setText] = useState('Aiterra 2026 מבצע השבוע')
  const [announce, setAnnounce] = useState('')
  const baseId = useId()

  const copy = async (value: string, label: string) => {
    if (!value) return
    try {
      await navigator.clipboard.writeText(value)
      setAnnounce(`הועתק: ${label}`)
      window.gtag?.('event', 'fancy_text_copy', { style: label })
    } catch {
      setAnnounce('ההעתקה לא הצליחה. סמנו את הטקסט והעתיקו ידנית.')
    }
  }

  const latin = hasLatin(text)
  const hebrew = hasHebrew(text)
  const preview = parseWhatsApp(text)

  const resultCard = (key: string, label: string, value: string) => (
    <li key={key} className={styles.card}>
      <span className={styles.cardLabel}>{label}</span>
      <span className={styles.cardValue} dir="auto">
        {value || ' '}
      </span>
      <button
        type="button"
        className={styles.copy}
        onClick={() => copy(value, label)}
        aria-label={`העתקה: ${label}`}
        disabled={!value}
      >
        <Copy aria-hidden="true" size={18} />
      </button>
    </li>
  )

  return (
    <section className={ui.tool} aria-labelledby={`${baseId}-title`}>
      <div className={`${ui.inner} ${styles.inner}`}>
        <div className={ui.form}>
          <div className={ui.group}>
            <h2 id={`${baseId}-title`} className={ui.legend}>
              הטקסט שלכם
            </h2>
            <div className={ui.field}>
              <label htmlFor={`${baseId}-text`} className={ui.label}>
                טקסט לעיצוב
              </label>
              <textarea
                id={`${baseId}-text`}
                className={`${ui.input} ${ui.textarea}`}
                value={text}
                maxLength={500}
                rows={3}
                dir="auto"
                onChange={(event) => setText(event.target.value)}
              />
              {hebrew ? (
                <p className={ui.hint}>
                  לאותיות עבריות אין גרסה מודגשת ביוניקוד, ולכן הסגנונות באנגלית משנים רק אותיות לטיניות ומספרים. לעברית
                  השתמשו בעיצוב של וואטסאפ, בקו תחתון או בקו חוצה, ובמסגרות.
                </p>
              ) : null}
            </div>
          </div>

          <div className={ui.group}>
            <h2 className={ui.legend}>עברית ואנגלית: קו תחתון, קו חוצה ומסגרות</h2>
            <ul className={styles.list}>
              {fancyStyles
                .filter((style) => style.hebrew)
                .map((style) => resultCard(style.id, style.label, convertText(text, style.id)))}
              {frames.map((frame) => resultCard(frame.id, `מסגרת: ${frame.label}`, frameText(text, frame.id)))}
            </ul>
          </div>

          <div className={ui.group}>
            <h2 className={ui.legend}>עיצוב לוואטסאפ, גם בעברית</h2>
            <ul className={styles.list}>
              {whatsAppStyles.map((style) =>
                resultCard(`wa-${style.id}`, `וואטסאפ: ${style.label}`, wrapWhatsApp(text, style.id)),
              )}
            </ul>
            <p className={ui.label}>תצוגה מקדימה כמו בוואטסאפ, אחרי שליחה</p>
            <p className={styles.bubble} dir="auto">
              {preview.map((piece, index) => (
                <span key={index} className={piece.styles.map((style) => pieceClass[style]).join(' ')}>
                  {piece.text}
                </span>
              ))}
            </p>
            <p className={ui.hint}>
              אפשר לשלב: כתבו בתיבה למעלה למשל *מבצע* או ~₪99~ ותראו כאן איך ההודעה תיראה.
            </p>
          </div>

          <div className={ui.group}>
            <h2 className={ui.legend}>אותיות מעוצבות באנגלית ובמספרים</h2>
            {!latin ? <p className={ui.hint}>הקלידו אותיות באנגלית או מספרים כדי לראות את הסגנונות.</p> : null}
            <ul className={styles.list}>
              {fancyStyles
                .filter((style) => !style.hebrew)
                .map((style) => resultCard(style.id, style.label, latin ? convertText(text, style.id) : ''))}
            </ul>
          </div>

          <div className={ui.group}>
            <h2 className={ui.legend}>קווים מפרידים</h2>
            <ul className={styles.list}>
              {SEPARATORS.map((separator, index) => resultCard(`sep-${index}`, `מפריד ${index + 1}`, separator))}
            </ul>
          </div>
        </div>
        <p className={ui.status} role="status" aria-live="polite">
          {announce}
        </p>
      </div>
    </section>
  )
}
