'use client'

import { useId, useState } from 'react'
import {
  EXAMPLE_WORDS,
  LENGTH_FILTERS,
  MIN_LETTERS,
  RHYME_STRENGTHS,
  filterByLength,
  findRhymes,
  lastWord,
  normalizeWord,
  type LengthFilter,
  type RhymeStrength,
} from '@/lib/hebrew-rhymes'
import { Field, TileGroup } from './FunTiles'
import ui from './toolUi.module.css'
import fun from './FunTool.module.css'
import styles from './RhymeFinder.module.css'

type StrengthFilter = 'all' | 'strong' | 'perfect'

const STRENGTH_FILTERS: { id: StrengthFilter; label: string; hint: string }[] = [
  { id: 'all', label: 'כל החרוזים', hint: 'מלאים, טובים וקרובים' },
  { id: 'strong', label: 'מלאים וטובים', hint: 'בלי קרובים' },
  { id: 'perfect', label: 'מלאים בלבד', hint: 'הסיום זהה' },
]

const VISIBLE_STEP = 36
const COPY_FAILED = 'ההעתקה נכשלה. סמנו את המילה והעתיקו ידנית.'

const allowedStrengths: Record<StrengthFilter, RhymeStrength[]> = {
  all: ['perfect', 'good', 'near'],
  strong: ['perfect', 'good'],
  perfect: ['perfect'],
}

const initialShown = (): Record<RhymeStrength, number> => ({
  perfect: VISIBLE_STEP,
  good: VISIBLE_STEP,
  near: VISIBLE_STEP,
})

export default function RhymeFinder() {
  const queryId = useId()
  const queryHintId = useId()
  const strengthName = useId()
  const lengthName = useId()
  const headingBase = useId()

  const [query, setQuery] = useState('אהבה')
  const [strengthFilter, setStrengthFilter] = useState<StrengthFilter>('all')
  const [lengthFilter, setLengthFilter] = useState<LengthFilter>('any')
  const [shown, setShown] = useState(initialShown)
  const [status, setStatus] = useState('')

  const word = lastWord(query)
  const enough = normalizeWord(word).length >= MIN_LETTERS
  const result = findRhymes(query)

  const groups = RHYME_STRENGTHS.filter((group) => allowedStrengths[strengthFilter].includes(group.id)).map(
    (group) => ({ ...group, words: filterByLength(result[group.id], lengthFilter) }),
  )
  const total = groups.reduce((sum, group) => sum + group.words.length, 0)

  const changeQuery = (value: string) => {
    setQuery(value)
    setStatus('')
    setShown(initialShown())
  }

  const copy = async (text: string, message: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setStatus(message)
      window.gtag?.('event', 'rhyme_copy', { length: text.length })
    } catch {
      setStatus(COPY_FAILED)
    }
  }

  return (
    <section className={ui.tool} aria-label="מילון חרוזים בעברית">
      <div className={ui.inner}>
        <form className={ui.form} onSubmit={(event) => event.preventDefault()}>
          <fieldset className={ui.group}>
            <legend className={ui.legend}>המילה</legend>
            <Field
              id={queryId}
              label="מילה לחרוז"
              hintId={queryHintId}
              hint="אפשר עם ניקוד או בלי. אם כתבתם כמה מילים, נחפש חרוזים למילה האחרונה."
            >
              <input
                id={queryId}
                className={ui.input}
                lang="he"
                dir="rtl"
                autoComplete="off"
                spellCheck={false}
                aria-describedby={queryHintId}
                value={query}
                onChange={(event) => changeQuery(event.target.value)}
              />
            </Field>
            <div className={styles.examples} role="group" aria-label="דוגמאות">
              {EXAMPLE_WORDS.map((example) => (
                <button key={example} type="button" className={styles.example} onClick={() => changeQuery(example)}>
                  {example}
                </button>
              ))}
            </div>
          </fieldset>

          <fieldset className={ui.group}>
            <legend className={ui.legend}>סינון</legend>
            <TileGroup
              legend="עוצמת החרוז"
              name={strengthName}
              options={STRENGTH_FILTERS}
              value={strengthFilter}
              onChange={(next) => {
                setStrengthFilter(next)
                setShown(initialShown())
              }}
            />
            <TileGroup
              legend="אורך המילה"
              name={lengthName}
              options={LENGTH_FILTERS}
              value={lengthFilter}
              onChange={(next) => {
                setLengthFilter(next)
                setShown(initialShown())
              }}
            />
          </fieldset>
        </form>

        <div className={ui.output}>
          <h2 className={ui.outputTitle}>{enough ? `חרוזים ל״${word}״` : 'חרוזים'}</h2>
          {!enough ? (
            <p className={fun.panel}>כתבו מילה של שתי אותיות לפחות, ונציג חרוזים לפי הסיום שלה.</p>
          ) : total === 0 ? (
            <p className={fun.panel}>
              לא מצאנו במילון חרוזים בסינון הזה. נסו ״כל החרוזים״ ו״כל האורכים״, או מילה עם סיום אחר.
            </p>
          ) : (
            <p className={fun.panel}>{total} חרוזים במילון. לחיצה על מילה מעתיקה אותה.</p>
          )}
          <p className={`${ui.status} ${fun.statusLine}`} role="status" aria-live="polite">
            {status}
          </p>

          {enough
            ? groups.map((group) => {
                if (!group.words.length) return null
                const visible = group.words.slice(0, shown[group.id])
                const headingId = `${headingBase}-${group.id}`
                return (
                  <section key={group.id} className={styles.group} aria-labelledby={headingId}>
                    <div className={styles.groupHead}>
                      <h3 id={headingId} className={styles.groupTitle}>
                        {group.label} <span className={styles.count}>({group.words.length})</span>
                      </h3>
                      <button
                        type="button"
                        className={styles.copyAll}
                        onClick={() => copy(visible.join(', '), `הועתקו ${visible.length} מילים`)}
                      >
                        העתקת הרשימה
                        <span className={fun.srOnly}> של {group.label}</span>
                      </button>
                    </div>
                    <p className={styles.groupNote}>{group.description}</p>
                    <ul className={styles.chips}>
                      {visible.map((item) => (
                        <li key={item}>
                          <button type="button" className={styles.chip} onClick={() => copy(item, `הועתק: ${item}`)}>
                            {item}
                          </button>
                        </li>
                      ))}
                    </ul>
                    {group.words.length > visible.length ? (
                      <button
                        type="button"
                        className={ui.secondary}
                        onClick={() =>
                          setShown((current) => ({ ...current, [group.id]: current[group.id] + VISIBLE_STEP * 2 }))
                        }
                      >
                        הצגת עוד חרוזים
                        <span className={fun.srOnly}> ל{group.label}</span>
                      </button>
                    ) : null}
                  </section>
                )
              })
            : null}

          <p className={`${ui.note} ${fun.flush}`}>
            החיפוש נעשה בדפדפן שלכם, והמילים שהקלדתם לא נשלחות לשום מקום.
          </p>
        </div>
      </div>
    </section>
  )
}
