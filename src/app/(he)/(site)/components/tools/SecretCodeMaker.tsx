'use client'

import { useId, useState } from 'react'
import { Copy, Printer } from 'lucide-react'
import {
  ALPHABET,
  cipherDescriptions,
  cipherIds,
  cipherLabels,
  clampShift,
  encodeText,
  indexOfLetter,
  pigpenLines,
  pigpenShape,
  type CipherId,
  type Direction,
} from '@/lib/secret-code-maker'
import ui from './toolUi.module.css'
import styles from './SecretCodeMaker.module.css'

const DEFAULT_TEXT = 'נפגשים אחרי בית הספר'

function Glyph({ index, size = 40 }: { index: number; size?: number }) {
  const shape = pigpenShape(index)
  return (
    <svg className={styles.glyph} width={size} height={size} viewBox="0 0 40 40" aria-hidden="true" focusable="false">
      {pigpenLines(shape).map((line, position) => (
        <line key={position} {...line} stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      ))}
      {shape.kind === 'cell' && shape.dot ? <circle cx="20" cy="20" r="3.2" fill="currentColor" /> : null}
    </svg>
  )
}

function PigpenRow({ text }: { text: string }) {
  const words = text.split(/\s+/).filter(Boolean)
  return (
    <div className={styles.pigpenText}>
      {words.map((word, wordIndex) => (
        <span key={wordIndex} className={styles.pigpenWord}>
          {Array.from(word).map((char, charIndex) => {
            const index = indexOfLetter(char)
            return index === -1 ? (
              <span key={charIndex} className={styles.plainChar}>
                {char}
              </span>
            ) : (
              <Glyph key={charIndex} index={index} size={34} />
            )
          })}
        </span>
      ))}
    </div>
  )
}

function KeyTable({ cipher, shift }: { cipher: CipherId; shift: number }) {
  return (
    <ul className={styles.key} aria-label="טבלת מפתח">
      {ALPHABET.map((letter, index) => {
        const code =
          cipher === 'number'
            ? String(index + 1)
            : cipher === 'pigpen' || cipher === 'mirror'
              ? letter
              : encodeText(letter, cipher, shift, 'encode')
        return (
          <li key={letter} className={styles.keyItem}>
            <span className={styles.keyLetter}>{letter}</span>
            {cipher === 'pigpen' ? <Glyph index={index} size={30} /> : <span className={styles.keyCode}>{code}</span>}
          </li>
        )
      })}
    </ul>
  )
}

export default function SecretCodeMaker() {
  const uid = useId()
  const [cipher, setCipher] = useState<CipherId>('atbash')
  const [direction, setDirection] = useState<Direction>('encode')
  const [shift, setShift] = useState(3)
  const [text, setText] = useState(DEFAULT_TEXT)
  const [decoded, setDecoded] = useState('')
  const [status, setStatus] = useState('')

  const isPigpen = cipher === 'pigpen'
  const pigpenEncoding = isPigpen && direction === 'encode'
  const pigpenDecoding = isPigpen && direction === 'decode'
  const result = isPigpen ? '' : encodeText(text, cipher, shift, direction)
  const message = pigpenDecoding ? decoded : result
  const fieldLabel = direction === 'encode' ? 'כתבו את ההודעה הרגילה' : 'הדביקו את ההודעה המוצפנת'

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(message)
      setStatus('הועתק')
    } catch {
      setStatus('ההעתקה לא הצליחה, אפשר לסמן ולהעתיק ידנית')
    }
  }

  return (
    <section className={ui.tool} aria-label="מחולל קוד סודי">
      <div className={ui.inner}>
        <div className={ui.form}>
          <fieldset className={ui.group}>
            <legend className={ui.legend}>בחרו צופן</legend>
            <div className={ui.options}>
              {cipherIds.map((id) => (
                <label key={id} className={ui.option}>
                  <input
                    type="radio"
                    name={`${uid}-cipher`}
                    className={ui.checkbox}
                    checked={cipher === id}
                    onChange={() => {
                      setCipher(id)
                      setStatus('')
                    }}
                  />
                  {cipherLabels[id]}
                </label>
              ))}
            </div>
            <p className={ui.hint}>{cipherDescriptions[cipher]}</p>
          </fieldset>

          <fieldset className={ui.group}>
            <legend className={ui.legend}>מה עושים</legend>
            <div className={ui.options}>
              <label className={ui.option}>
                <input
                  type="radio"
                  name={`${uid}-direction`}
                  className={ui.checkbox}
                  checked={direction === 'encode'}
                  onChange={() => setDirection('encode')}
                />
                להצפין
              </label>
              <label className={ui.option}>
                <input
                  type="radio"
                  name={`${uid}-direction`}
                  className={ui.checkbox}
                  checked={direction === 'decode'}
                  onChange={() => setDirection('decode')}
                />
                לפענח
              </label>
            </div>
            {cipher === 'caesar' ? (
              <div className={ui.field}>
                <label htmlFor={`${uid}-shift`} className={ui.label}>
                  מספר מקומות להזזה (1 עד 21)
                </label>
                <input
                  id={`${uid}-shift`}
                  type="number"
                  inputMode="numeric"
                  min={1}
                  max={21}
                  className={`${ui.input} ${styles.shiftInput}`}
                  value={shift}
                  onChange={(event) => setShift(Number(event.target.value))}
                  onBlur={() => setShift(clampShift(shift))}
                />
              </div>
            ) : null}
          </fieldset>

          {pigpenDecoding ? (
            <fieldset className={ui.group}>
              <legend className={ui.legend}>בחרו את הסמלים לפי הסדר</legend>
              <div className={styles.palette}>
                {ALPHABET.map((letter, index) => (
                  <button
                    key={letter}
                    type="button"
                    className={styles.paletteButton}
                    aria-label={`הוספת האות ${letter}`}
                    onClick={() => setDecoded((value) => value + letter)}
                  >
                    <Glyph index={index} size={30} />
                  </button>
                ))}
              </div>
              <div className={ui.actions}>
                <button type="button" className={ui.secondary} onClick={() => setDecoded((value) => value + ' ')}>
                  רווח
                </button>
                <button type="button" className={ui.secondary} onClick={() => setDecoded((value) => value.slice(0, -1))}>
                  מחיקת אות
                </button>
                <button type="button" className={ui.secondary} onClick={() => setDecoded('')}>
                  ניקוי
                </button>
              </div>
            </fieldset>
          ) : (
            <div className={ui.group}>
              <div className={ui.field}>
                <label htmlFor={`${uid}-text`} className={ui.label}>
                  {fieldLabel}
                </label>
                <textarea
                  id={`${uid}-text`}
                  className={`${ui.input} ${ui.textarea}`}
                  value={text}
                  maxLength={600}
                  onChange={(event) => setText(event.target.value)}
                />
              </div>
            </div>
          )}
        </div>

        <div className={ui.output}>
          <div className={ui.sticky}>
            <h2 className={ui.outputTitle}>{direction === 'encode' ? 'ההודעה הסודית' : 'ההודעה המפוענחת'}</h2>
            <div className={`${ui.paper} ${styles.result}`} tabIndex={0} role="region" aria-label="התוצאה">
              {pigpenEncoding ? (
                <PigpenRow text={text} />
              ) : (
                <p className={styles.resultText}>{message || 'כאן תופיע התוצאה'}</p>
              )}
            </div>
            <div className={ui.actions}>
              {pigpenEncoding ? null : (
                <button type="button" className={ui.primary} onClick={copy}>
                  <Copy aria-hidden="true" />
                  העתקת הטקסט
                </button>
              )}
              <button type="button" className={pigpenEncoding ? ui.primary : ui.secondary} onClick={() => window.print()}>
                <Printer aria-hidden="true" />
                הדפסת דף עבודה
              </button>
            </div>
            <p className={ui.status} role="status" aria-live="polite">
              {status}
            </p>
            <p className={ui.note}>
              הצפנה פועלת על האותיות העבריות. סימנים אחרים נשארים כמו שהם, ואותיות סופיות הופכות לאות רגילה.
            </p>
          </div>
        </div>
      </div>

      <div className={styles.sheet}>
        <h2 className={styles.sheetTitle}>דף קוד סודי: {cipherLabels[cipher]}</h2>
        <p>{cipherDescriptions[cipher]}</p>
        {cipher === 'caesar' ? <p>ההזזה: {clampShift(shift)} מקומות</p> : null}
        <KeyTable cipher={cipher} shift={shift} />
        <h3 className={styles.sheetHeading}>ההודעה</h3>
        {pigpenEncoding ? <PigpenRow text={text} /> : <p className={styles.sheetMessage}>{message}</p>}
        <h3 className={styles.sheetHeading}>כאן כותבים את הפתרון</h3>
        <div className={styles.lines} aria-hidden="true">
          <span />
          <span />
          <span />
        </div>
      </div>
    </section>
  )
}
