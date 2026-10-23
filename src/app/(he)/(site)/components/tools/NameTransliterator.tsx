'use client'

import { useId, useMemo, useState } from 'react'
import { Copy } from 'lucide-react'
import { passportStyle, transliterateName, type WordResult } from '@/lib/name-transliteration'
import ui from './toolUi.module.css'
import styles from './NameTransliterator.module.css'

function WordChoice({
  result,
  selected,
  onSelect,
}: {
  result: WordResult
  selected: string
  onSelect: (value: string) => void
}) {
  const name = useId()
  return (
    <fieldset className={styles.word}>
      <legend className={styles.wordLegend}>
        <span lang="he">{result.word}</span>
        <span className={styles.source}>
          {result.source === 'list' ? 'מהרשימה' : 'הערכה לפי כללים, בדקו ותקנו'}
        </span>
      </legend>
      <div className={styles.variants}>
        {result.variants.map((variant) => (
          <label key={variant} className={styles.variant}>
            <input type="radio" name={name} checked={selected === variant} onChange={() => onSelect(variant)} />
            <span dir="ltr">{variant}</span>
          </label>
        ))}
      </div>
    </fieldset>
  )
}

export default function NameTransliterator() {
  const inputId = useId()
  const [text, setText] = useState('יונתן לוי')
  const [choices, setChoices] = useState<Record<string, string>>({})
  const [passport, setPassport] = useState(false)
  const [status, setStatus] = useState('')

  const results = useMemo(() => transliterateName(text), [text])

  const chosen = results.map((result, index) => {
    const picked = choices[`${index}:${result.word}`]
    return picked && result.variants.includes(picked) ? picked : result.variants[0]
  })
  const joined = chosen.join(' ')
  const output = passport ? passportStyle(joined) : joined

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(output)
      setStatus('הועתק')
    } catch {
      setStatus('ההעתקה נחסמה בדפדפן, סמנו והעתיקו ידנית')
    }
  }

  return (
    <section className={ui.tool} aria-label="ממיר שם עברי לאנגלית">
      <div className={ui.inner}>
        <form className={ui.form} onSubmit={(event) => event.preventDefault()}>
          <fieldset className={ui.group}>
            <legend className={ui.legend}>הקלידו שם בעברית</legend>
            <div className={ui.field}>
              <label htmlFor={inputId} className={ui.label}>
                שם פרטי, שם משפחה או שניהם
              </label>
              <input
                id={inputId}
                className={ui.input}
                value={text}
                lang="he"
                autoComplete="off"
                placeholder="למשל: משה כהן"
                onChange={(event) => {
                  setText(event.target.value)
                  setStatus('')
                }}
              />
              <p className={ui.hint}>בלי ניקוד. אפשר להקליד כמה מילים, וכל מילה נבדקת בנפרד.</p>
            </div>
            <label className={styles.passport}>
              <input type="checkbox" checked={passport} onChange={(event) => setPassport(event.target.checked)} />
              <span>אותיות גדולות בלי סימנים, כמו בדרכון</span>
            </label>
          </fieldset>
          {results.length ? (
            <fieldset className={ui.group}>
              <legend className={ui.legend}>בחרו איות לכל מילה</legend>
              {results.map((result, index) => (
                <WordChoice
                  key={`${index}:${result.word}`}
                  result={result}
                  selected={chosen[index]}
                  onSelect={(value) => setChoices((current) => ({ ...current, [`${index}:${result.word}`]: value }))}
                />
              ))}
            </fieldset>
          ) : null}
        </form>
        <div className={ui.output}>
          <div className={ui.sticky}>
            <h2 className={ui.outputTitle}>השם באנגלית</h2>
            <p className={styles.result} dir="ltr" aria-live="polite">
              {output || '—'}
            </p>
            <div className={ui.actions}>
              <button type="button" className={ui.primary} onClick={copy} disabled={!output}>
                <Copy aria-hidden="true" />
                העתקה
              </button>
            </div>
            <p className={ui.status} role="status">
              {status}
            </p>
            <p className={ui.note}>
              בדרכון, בתעודת הזהות ובחשבון הבנק קובע האיות שכבר רשום שם, גם אם הוא שונה מהמוצע כאן. המילים שלא ברשימה
              מוערכות לפי כללים, ובעברית בלי ניקוד אי אפשר לדעת את התנועות בוודאות.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
