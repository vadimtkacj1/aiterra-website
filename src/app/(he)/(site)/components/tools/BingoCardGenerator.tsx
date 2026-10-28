'use client'

import { useId, useMemo, useState } from 'react'
import { flushSync } from 'react-dom'
import {
  MAX_CARDS,
  MIN_CARDS,
  SAMPLE_WORDS,
  clampCount,
  drawNext,
  generateCards,
  numberLetter,
  parseWords,
  seededRandom,
  wordsNeeded,
  type BingoCard,
  type BingoMode,
  type BingoSize,
} from '@/lib/bingo-cards'
import ui from './toolUi.module.css'
import styles from './BingoCardGenerator.module.css'

type PerPage = 2 | 4
type PrintTarget = 'cards' | 'caller'

const modeOptions: { value: BingoMode; label: string }[] = [
  { value: 'numbers', label: 'מספרים 1-75' },
  { value: 'words', label: 'רשימת מילים' },
]

const sizeOptions: BingoSize[] = [3, 4, 5]
const perPageOptions: PerPage[] = [2, 4]

function CardView({
  card,
  size,
  headers,
  title,
}: {
  card: BingoCard
  size: BingoSize
  headers: string[]
  title: string
}) {
  return (
    <div className={styles.card}>
      {title ? <p className={styles.cardTitle}>{title}</p> : null}
      <div className={styles.grid} style={{ gridTemplateColumns: `repeat(${size}, minmax(0, 1fr))` }} dir="ltr">
        {headers.map((letter) => (
          <span key={letter} className={styles.header}>
            {letter}
          </span>
        ))}
        {card.cells.map((cell, index) => (
          <span key={index} className={cell.free ? `${styles.cell} ${styles.free}` : styles.cell} dir="auto">
            {cell.value}
          </span>
        ))}
      </div>
      <p className={styles.cardNumber}>כרטיס {card.id}</p>
    </div>
  )
}

export default function BingoCardGenerator() {
  const baseId = useId()
  const [mode, setMode] = useState<BingoMode>('numbers')
  const [size, setSize] = useState<BingoSize>(5)
  const [freeCenter, setFreeCenter] = useState(true)
  const [countText, setCountText] = useState('8')
  const [title, setTitle] = useState('בינגו')
  const [wordsText, setWordsText] = useState(SAMPLE_WORDS.join('\n'))
  const [perPage, setPerPage] = useState<PerPage>(4)
  const [shuffleKey, setShuffleKey] = useState(0)
  const [drawn, setDrawn] = useState<string[]>([])
  const [printTarget, setPrintTarget] = useState<PrintTarget>('cards')

  const words = useMemo(() => parseWords(wordsText), [wordsText])
  const count = clampCount(Number(countText))

  const result = useMemo(
    () =>
      generateCards(
        { mode, size, freeCenter, count, words },
        shuffleKey === 0 ? seededRandom(20261028) : seededRandom(shuffleKey),
      ),
    [mode, size, freeCenter, count, words, shuffleKey],
  )

  const pool = result.ok ? result.pool : []
  const poolKey = pool.join('|')
  const [drawnFor, setDrawnFor] = useState(poolKey)
  if (drawnFor !== poolKey) {
    setDrawnFor(poolKey)
    setDrawn([])
  }

  const pages = result.ok
    ? Array.from({ length: Math.ceil(result.cards.length / perPage) }, (_, index) =>
        result.cards.slice(index * perPage, (index + 1) * perPage),
      )
    : []
  const last = drawn.at(-1)
  const showLetters = mode === 'numbers' && size === 5

  const reshuffle = () => {
    const seed = new Uint32Array(1)
    globalThis.crypto.getRandomValues(seed)
    setShuffleKey(seed[0] || 1)
  }

  const draw = () => {
    const next = drawNext(pool, drawn)
    if (next) setDrawn([...drawn, next])
  }

  const print = (target: PrintTarget) => {
    flushSync(() => setPrintTarget(target))
    window.print()
  }

  const callLabel = (value: string) => (showLetters ? `${numberLetter(value)}-${value}` : value)

  return (
    <section className={ui.tool} aria-labelledby={`${baseId}-title`}>
      <div className={ui.inner}>
        <div className={ui.form}>
          <fieldset className={ui.group}>
            <legend className={ui.legend} id={`${baseId}-title`}>
              הגדרות הכרטיסים
            </legend>
            <div className={ui.options} role="radiogroup" aria-label="סוג הבינגו">
              {modeOptions.map((option) => (
                <label key={option.value} className={ui.option}>
                  <input
                    type="radio"
                    className={ui.checkbox}
                    name={`${baseId}-mode`}
                    checked={mode === option.value}
                    onChange={() => setMode(option.value)}
                  />
                  {option.label}
                </label>
              ))}
            </div>

            {mode === 'words' ? (
              <div className={ui.field}>
                <label className={ui.label} htmlFor={`${baseId}-words`}>
                  מילים, אחת בכל שורה או מופרדות בפסיק
                </label>
                <textarea
                  id={`${baseId}-words`}
                  className={`${ui.input} ${ui.textarea}`}
                  rows={8}
                  value={wordsText}
                  onChange={(event) => setWordsText(event.target.value)}
                />
                <p className={ui.hint}>
                  {words.length} מילים שונות, לכרטיס צריך לפחות {wordsNeeded(size, freeCenter)}
                </p>
              </div>
            ) : null}

            <fieldset className={ui.group}>
              <legend className={ui.legend}>גודל הכרטיס</legend>
              <div className={styles.segmented}>
                {sizeOptions.map((option) => (
                  <label key={option} className={ui.option}>
                    <input
                      type="radio"
                      className={ui.checkbox}
                      name={`${baseId}-size`}
                      checked={size === option}
                      onChange={() => setSize(option)}
                    />
                    {option} על {option}
                  </label>
                ))}
              </div>
            </fieldset>

            <label className={ui.option}>
              <input
                type="checkbox"
                className={ui.checkbox}
                checked={freeCenter}
                disabled={size === 4}
                onChange={(event) => setFreeCenter(event.target.checked)}
              />
              משבצת חינם באמצע{size === 4 ? ' (אין אמצע בכרטיס 4 על 4)' : ''}
            </label>

            <div className={ui.row}>
              <div className={ui.field}>
                <label className={ui.label} htmlFor={`${baseId}-count`}>
                  מספר כרטיסים
                </label>
                <input
                  id={`${baseId}-count`}
                  className={ui.input}
                  type="number"
                  inputMode="numeric"
                  min={MIN_CARDS}
                  max={MAX_CARDS}
                  value={countText}
                  onChange={(event) => setCountText(event.target.value)}
                />
              </div>
              <div className={ui.field}>
                <label className={ui.label} htmlFor={`${baseId}-heading`}>
                  כותרת על הכרטיס
                </label>
                <input
                  id={`${baseId}-heading`}
                  className={ui.input}
                  maxLength={60}
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                />
              </div>
              <fieldset className={ui.group}>
                <legend className={ui.legend}>כרטיסים בדף A4</legend>
                <div className={styles.segmented}>
                  {perPageOptions.map((option) => (
                    <label key={option} className={ui.option}>
                      <input
                        type="radio"
                        className={ui.checkbox}
                        name={`${baseId}-per-page`}
                        checked={perPage === option}
                        onChange={() => setPerPage(option)}
                      />
                      {option}
                    </label>
                  ))}
                </div>
              </fieldset>
            </div>
          </fieldset>

          <fieldset className={ui.group}>
            <legend className={ui.legend}>הגרלה</legend>
            <div className={styles.caller} aria-live="polite">
              <span className={styles.ball}>{last ? callLabel(last) : '?'}</span>
              <span className={ui.hint}>
                {drawn.length} מתוך {pool.length} הוגרלו
              </span>
            </div>
            <div className={ui.actions}>
              <button type="button" className={ui.primary} onClick={draw} disabled={!result.ok || drawn.length >= pool.length}>
                הגרל את הבא
              </button>
              <button type="button" className={ui.secondary} onClick={() => setDrawn([])} disabled={!drawn.length}>
                התחל סבב חדש
              </button>
            </div>
            {drawn.length ? (
              <ol className={styles.history} aria-label="היסטוריית ההגרלה">
                {drawn.map((value) => (
                  <li key={value}>{callLabel(value)}</li>
                ))}
              </ol>
            ) : null}
          </fieldset>
        </div>

        <div className={ui.output}>
          <div className={ui.sticky}>
            <h2 className={ui.outputTitle}>{result.ok ? `${result.cards.length} כרטיסים מוכנים` : 'חסרות מילים'}</h2>
            {result.ok ? (
              <>
                <div className={ui.actions}>
                  <button type="button" className={ui.primary} onClick={() => print('cards')}>
                    הדפסת הכרטיסים
                  </button>
                  <button type="button" className={ui.secondary} onClick={() => print('caller')}>
                    הדפסת דף הכרוז
                  </button>
                  <button type="button" className={ui.secondary} onClick={reshuffle}>
                    ערבוב מחדש
                  </button>
                </div>
                {!result.duplicatesAvoided ? (
                  <p className={ui.note}>
                    יש מעט מילים לכמות הכרטיסים, ולכן בחלק מהכרטיסים אותן מילים בסדר אחר. כדאי להוסיף מילים.
                  </p>
                ) : null}
                <div className={`${ui.paper} ${styles.preview}`} tabIndex={0} aria-label="תצוגה מקדימה של הכרטיסים">
                  <div className={styles.previewGrid}>
                    {result.cards.slice(0, 4).map((card) => (
                      <CardView key={card.id} card={card} size={size} headers={result.headers} title={title} />
                    ))}
                  </div>
                  {result.cards.length > 4 ? (
                    <p className={ui.note}>ועוד {result.cards.length - 4} כרטיסים בהדפסה</p>
                  ) : null}
                </div>
              </>
            ) : (
              <p className={ui.note} role="alert">
                {result.error}
              </p>
            )}
          </div>
        </div>
      </div>

      {result.ok ? (
        <div className={styles.printArea} data-target={printTarget} aria-hidden="true">
          {printTarget === 'cards' ? (
            pages.map((page) => (
              <div key={page[0].id} className={perPage === 2 ? styles.pageTwo : styles.pageFour}>
                {page.map((card) => (
                  <CardView key={card.id} card={card} size={size} headers={result.headers} title={title} />
                ))}
              </div>
            ))
          ) : (
            <div className={styles.callerSheet}>
              <p className={styles.cardTitle}>{title} - דף הכרוז</p>
              <ul className={styles.callerList}>
                {pool.map((value) => (
                  <li key={value}>
                    <span className={styles.box} />
                    {callLabel(value)}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      ) : null}
    </section>
  )
}
