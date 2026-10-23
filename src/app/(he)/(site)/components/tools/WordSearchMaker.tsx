'use client'

import { useEffect, useMemo, useRef, useState, type CSSProperties } from 'react'
import { Link2, Printer, Shuffle } from 'lucide-react'
import {
  MAX_SIZE,
  MAX_WORDS,
  MIN_SIZE,
  answerCells,
  buildPuzzle,
  cellKey,
  defaultSettings,
  difficultyOptions,
  difficultyPreset,
  directionName,
  directionOptions,
  printDocument,
  readQuery,
  writeQuery,
  type Difficulty,
  type DirectionId,
  type Settings,
} from '@/lib/word-search'
import ui from './toolUi.module.css'
import styles from './WordSearchMaker.module.css'

const reasonText = {
  long: 'ארוכה מהרשת',
  short: 'קצרה מדי',
  duplicate: 'מופיעה פעמיים',
  'no-room': 'לא נכנסה, הגדילו את הרשת',
}

function openPrint(html: string) {
  const frame = document.createElement('iframe')
  frame.setAttribute('aria-hidden', 'true')
  frame.tabIndex = -1
  Object.assign(frame.style, { position: 'fixed', bottom: '0', width: '0', height: '0', border: '0' })
  frame.onload = () => {
    const view = frame.contentWindow
    if (!view) return
    view.focus()
    view.print()
    window.setTimeout(() => frame.remove(), 1000)
  }
  frame.srcdoc = html
  document.body.appendChild(frame)
}

const newSeed = () => String(Math.floor(Math.random() * 900000) + 100000)

export default function WordSearchMaker() {
  const [settings, setSettings] = useState<Settings>(defaultSettings)
  const [showKey, setShowKey] = useState(false)
  const [status, setStatus] = useState('')
  const touched = useRef(false)
  const puzzle = useMemo(() => buildPuzzle(settings), [settings])
  const hits = useMemo(() => answerCells(puzzle.placements), [puzzle])

  useEffect(() => {
    const initial = readQuery(window.location.search)
    if (initial) setSettings(initial)
  }, [])

  useEffect(() => {
    if (!touched.current) return
    window.history.replaceState(null, '', `${window.location.pathname}${writeQuery(settings)}`)
  }, [settings])

  const update = (patch: Partial<Settings>) => {
    touched.current = true
    setStatus('')
    setSettings((current) => ({ ...current, ...patch }))
  }

  const toggleDirection = (id: DirectionId, checked: boolean) => {
    const next = checked ? [...settings.directions, id] : settings.directions.filter((item) => item !== id)
    if (next.length) update({ directions: next })
  }

  const chooseDifficulty = (difficulty: Difficulty) => update({ difficulty, ...difficultyPreset[difficulty] })

  const print = (withKey: boolean) => {
    openPrint(printDocument(puzzle, settings.title, withKey))
    setStatus(withKey ? 'נפתח חלון הדפסה: התפזורת ודף הפתרון.' : 'נפתח חלון הדפסה: התפזורת בלבד.')
  }

  const copyLink = async () => {
    const url = `${window.location.origin}${window.location.pathname}${writeQuery(settings)}`
    try {
      await navigator.clipboard.writeText(url)
      setStatus('הקישור הועתק. מי שיפתח אותו יקבל בדיוק את אותה תפזורת.')
    } catch {
      setStatus('לא הצלחנו להעתיק. העתיקו את הכתובת משורת הכתובת.')
    }
  }

  const wordCount = settings.words.split(/[\n,،;]+/).filter((line) => line.trim()).length
  const gridStyle = { '--size': puzzle.size } as CSSProperties

  return (
    <section className={ui.tool} aria-labelledby="word-search-title">
      <div className={ui.inner}>
        <div className={ui.form}>
          <div className={ui.group}>
            <h2 id="word-search-title" className={ui.legend}>
              המילים
            </h2>
            <div className={ui.field}>
              <label htmlFor="ws-title" className={ui.label}>
                כותרת
              </label>
              <input
                id="ws-title"
                className={ui.input}
                value={settings.title}
                maxLength={80}
                onChange={(event) => update({ title: event.target.value })}
              />
            </div>
            <div className={ui.field}>
              <label htmlFor="ws-words" className={ui.label}>
                רשימת מילים, מילה בכל שורה
              </label>
              <textarea
                id="ws-words"
                className={`${ui.input} ${ui.textarea} ${styles.words}`}
                value={settings.words}
                rows={8}
                maxLength={1200}
                spellCheck={false}
                aria-describedby="ws-words-hint"
                onChange={(event) => update({ words: event.target.value })}
              />
              <p id="ws-words-hint" className={ui.hint}>
                עד {MAX_WORDS} מילים ({wordCount} עכשיו). ניקוד, רווחים וסימנים לא נכנסים לרשת, אז ״יום הולדת״ ייכנס
                כ״יומהולדת״.
              </p>
            </div>
          </div>

          <fieldset className={ui.group}>
            <legend className={ui.legend}>רמת קושי</legend>
            <div className={styles.difficulty}>
              {difficultyOptions.map((option) => (
                <label key={option.id} className={ui.option}>
                  <input
                    type="radio"
                    name="ws-difficulty"
                    className={ui.checkbox}
                    checked={settings.difficulty === option.id}
                    onChange={() => chooseDifficulty(option.id)}
                  />
                  <span>
                    <strong>{option.label}</strong>
                    <span className={styles.optionHint}>{option.hint}</span>
                  </span>
                </label>
              ))}
            </div>
          </fieldset>

          <fieldset className={ui.group}>
            <legend className={ui.legend}>רשת וכיוונים</legend>
            <div className={ui.field}>
              <label htmlFor="ws-size" className={ui.label}>
                גודל הרשת: {settings.size} על {settings.size}
              </label>
              <input
                id="ws-size"
                type="range"
                className={styles.range}
                min={MIN_SIZE}
                max={MAX_SIZE}
                value={settings.size}
                onChange={(event) => update({ size: Number(event.target.value) })}
              />
            </div>
            <fieldset className={ui.group}>
              <legend className={ui.legend}>כיווני המילים</legend>
              <div className={ui.options}>
                {directionOptions.map((option) => (
                  <label key={option.id} className={ui.option}>
                    <input
                      type="checkbox"
                      className={ui.checkbox}
                      checked={settings.directions.includes(option.id)}
                      onChange={(event) => toggleDirection(option.id, event.target.checked)}
                    />
                    {option.label}
                  </label>
                ))}
              </div>
            </fieldset>
            <label className={ui.option}>
              <input
                type="checkbox"
                className={ui.checkbox}
                checked={settings.reverse}
                onChange={(event) => update({ reverse: event.target.checked })}
              />
              גם מילים הפוכות (מלמטה למעלה ואלכסון כלפי מעלה)
            </label>
            <label className={ui.option}>
              <input
                type="checkbox"
                className={ui.checkbox}
                checked={settings.finals}
                onChange={(event) => update({ finals: event.target.checked })}
              />
              להשאיר אותיות סופיות (ם, ן, ץ, ף, ך) כמו שהן
            </label>
            <div className={styles.seedRow}>
              <div className={ui.field}>
                <label htmlFor="ws-seed" className={ui.label}>
                  מספר תפזורת
                </label>
                <input
                  id="ws-seed"
                  className={`${ui.input} ${ui.ltr}`}
                  value={settings.seed}
                  maxLength={24}
                  inputMode="numeric"
                  aria-describedby="ws-seed-hint"
                  onChange={(event) => update({ seed: event.target.value })}
                />
              </div>
              <button type="button" className={ui.secondary} onClick={() => update({ seed: newSeed() })}>
                <Shuffle aria-hidden="true" />
                סידור חדש
              </button>
            </div>
            <p id="ws-seed-hint" className={ui.hint}>
              אותו מספר ואותן מילים נותנים תמיד את אותה תפזורת.
            </p>
          </fieldset>
        </div>

        <div className={ui.output}>
          <div className={ui.sticky}>
            <h2 className={ui.outputTitle}>{settings.title.trim() || 'תפזורת'}</h2>
            {puzzle.placements.length ? (
              <table className={styles.grid} style={gridStyle}>
                <caption className={styles.srOnly}>
                  רשת התפזורת, {puzzle.size} שורות ו-{puzzle.size} עמודות
                </caption>
                <tbody>
                  {puzzle.grid.map((row, r) => (
                    <tr key={r}>
                      {row.map((letter, c) => (
                        <td
                          key={c}
                          className={showKey && hits.has(cellKey(r, c)) ? `${styles.cell} ${styles.hit}` : styles.cell}
                        >
                          {letter}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className={ui.note}>הוסיפו לפחות מילה אחת בעברית באורך של שתי אותיות או יותר.</p>
            )}

            {puzzle.placements.length ? (
              <>
                <h3 className={styles.listTitle}>מצאו {puzzle.placements.length} מילים</h3>
                <ul className={styles.list}>
                  {puzzle.placements.map((placement) => (
                    <li key={placement.word}>
                      {placement.display}
                      {showKey ? (
                        <span className={styles.where}>
                          {' '}
                          (שורה {placement.row + 1}, עמודה {placement.col + 1}, {directionName(placement)})
                        </span>
                      ) : null}
                    </li>
                  ))}
                </ul>
              </>
            ) : null}

            {puzzle.skipped.length ? (
              <div className={styles.skipped} role="alert">
                <p>מילים שלא נכנסו:</p>
                <ul>
                  {puzzle.skipped.map((item) => (
                    <li key={`${item.word}-${item.reason}`}>
                      {item.word}: {reasonText[item.reason]}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}

            <label className={`${ui.option} ${styles.keyToggle}`}>
              <input
                type="checkbox"
                className={ui.checkbox}
                checked={showKey}
                onChange={(event) => setShowKey(event.target.checked)}
              />
              הצגת הפתרון
            </label>

            <div className={ui.actions}>
              <button
                type="button"
                className={ui.primary}
                onClick={() => print(true)}
                disabled={!puzzle.placements.length}
              >
                <Printer aria-hidden="true" />
                הדפסה עם דף פתרון
              </button>
              <button
                type="button"
                className={ui.secondary}
                onClick={() => print(false)}
                disabled={!puzzle.placements.length}
              >
                <Printer aria-hidden="true" />
                הדפסה בלי פתרון
              </button>
              <button type="button" className={ui.secondary} onClick={copyLink}>
                <Link2 aria-hidden="true" />
                העתקת קישור
              </button>
            </div>
            <p className={ui.status} role="status">
              {status}
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
