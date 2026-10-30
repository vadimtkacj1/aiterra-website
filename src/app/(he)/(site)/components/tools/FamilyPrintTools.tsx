'use client'

import { useId, useState } from 'react'
import { Printer, Shuffle } from 'lucide-react'
import { EVENT_KINDS, buildGames, type EventKind, type Gender } from '@/lib/family-games'
import { QUIZ_TOPICS, pickQuestions, quizSections } from '@/lib/family-quiz'
import { printSheet, type SheetSection } from '@/lib/print-sheet'
import { Field, TileGroup } from './FunTiles'
import ShareResultButton from './ShareResultButton'
import ui from './toolUi.module.css'
import fun from './FunTool.module.css'

const GENDERS: { id: Gender; label: string }[] = [
  { id: 'male', label: 'בן' },
  { id: 'female', label: 'בת' },
]
const YES_NO = [
  { id: 'no', label: 'לא' },
  { id: 'yes', label: 'כן' },
] as const
type YesNo = (typeof YES_NO)[number]['id']

const COUNTS = [
  { id: '10', label: '10 שאלות' },
  { id: '20', label: '20 שאלות' },
  { id: '30', label: '30 שאלות' },
] as const
type CountId = (typeof COUNTS)[number]['id']

function Sections({ sections }: { sections: SheetSection[] }) {
  return sections.map(({ title, note, items }) => (
    <div key={title} className={fun.card}>
      <h3>{title}</h3>
      {note ? <p>{note}</p> : null}
      <ol>
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ol>
    </div>
  ))
}

function Actions({ onShuffle, onPrint, printLabel }: { onShuffle: () => void; onPrint: () => void; printLabel: string }) {
  return (
    <>
      <button type="button" className={ui.primary} onClick={onShuffle}>
        <Shuffle aria-hidden="true" /> החלפת השאלות
      </button>
      <button type="button" className={ui.primary} onClick={onPrint}>
        <Printer aria-hidden="true" /> {printLabel}
      </button>
    </>
  )
}

export function FamilyEventGames() {
  const prefix = useId()
  const [kind, setKind] = useState<EventKind>('shabbat-hatan')
  const [first, setFirst] = useState('')
  const [second, setSecond] = useState('')
  const [gender, setGender] = useState<Gender>('male')
  const [onShabbat, setOnShabbat] = useState<YesNo>('yes')
  const [seed, setSeed] = useState(0)
  const event = EVENT_KINDS.find((item) => item.id === kind) ?? EVENT_KINDS[0]
  const shabbat = onShabbat === 'yes'
  const sections = buildGames({ kind, first, second, gender, shabbat, seed })
  const title = `משחקים ל${event.label}`

  function chooseKind(next: EventKind) {
    setKind(next)
    setOnShabbat(EVENT_KINDS.find((item) => item.id === next)?.shabbat ? 'yes' : 'no')
  }

  return (
    <section className={ui.tool} aria-label="מחולל משחקים לאירועים משפחתיים">
      <div className={ui.inner}>
        <form className={ui.form} onSubmit={(event_) => event_.preventDefault()}>
          <TileGroup
            legend="האירוע"
            name={`${prefix}k`}
            options={EVENT_KINDS.map(({ id, label }) => ({ id, label }))}
            value={kind}
            onChange={chooseKind}
          />
          <Field id={`${prefix}a`} label={event.couple ? 'שם החתן' : 'שם בעל השמחה'}>
            <input id={`${prefix}a`} className={ui.input} value={first} onChange={(change) => setFirst(change.target.value)} />
          </Field>
          {event.couple ? (
            <Field id={`${prefix}b`} label="שם הכלה">
              <input id={`${prefix}b`} className={ui.input} value={second} onChange={(change) => setSecond(change.target.value)} />
            </Field>
          ) : null}
          {kind === 'birthday' ? (
            <TileGroup legend="בן או בת" name={`${prefix}g`} options={GENDERS} value={gender} onChange={setGender} columns="two" />
          ) : null}
          <TileGroup
            legend="האירוע בשבת"
            name={`${prefix}s`}
            options={[...YES_NO]}
            value={onShabbat}
            onChange={setOnShabbat}
            columns="two"
          />
          {shabbat ? <p className={ui.note}>בשבת נשארים משחקים בעל פה בלבד. מדפיסים לפני כניסת השבת.</p> : null}
        </form>
        <div className={ui.output} aria-live="polite">
          <h2 className={ui.outputTitle}>{title}</h2>
          <Sections sections={sections} />
          <Actions onShuffle={() => setSeed(seed + 1)} onPrint={() => printSheet(title, sections)} printLabel="הדפסה" />
          <ShareResultButton text={title} tool="family-event-games" className={ui.primary} />
        </div>
      </div>
    </section>
  )
}

export function FamilyQuiz() {
  const prefix = useId()
  const [topics, setTopics] = useState(QUIZ_TOPICS.map((topic) => topic.id))
  const [count, setCount] = useState<CountId>('20')
  const [seed, setSeed] = useState(0)
  const questions = pickQuestions(topics, Number(count), seed)

  function toggle(id: string) {
    setTopics(topics.includes(id) ? topics.filter((topic) => topic !== id) : [...topics, id])
  }

  return (
    <section className={ui.tool} aria-label="חידון משפחתי להדפסה">
      <div className={ui.inner}>
        <form className={ui.form} onSubmit={(event) => event.preventDefault()}>
          <fieldset className={ui.group}>
            <legend className={ui.legend}>נושאים</legend>
            {QUIZ_TOPICS.map(({ id, label }) => (
              <label key={id} className={fun.tile}>
                <input type="checkbox" checked={topics.includes(id)} onChange={() => toggle(id)} />
                <span className={fun.tileLabel}>{label}</span>
              </label>
            ))}
          </fieldset>
          <TileGroup legend="אורך החידון" name={`${prefix}c`} options={[...COUNTS]} value={count} onChange={setCount} />
        </form>
        <div className={ui.output} aria-live="polite">
          <h2 className={ui.outputTitle}>החידון</h2>
          {questions.length ? (
            <>
              <ol>
                {questions.map(([question, answer]) => (
                  <li key={question}>
                    <details>
                      <summary>{question}</summary>
                      {answer}
                    </details>
                  </li>
                ))}
              </ol>
              <Actions
                onShuffle={() => setSeed(seed + 1)}
                onPrint={() => printSheet('חידון משפחתי', quizSections(questions))}
                printLabel="הדפסה עם דף תשובות"
              />
            </>
          ) : (
            <p className={fun.panel}>בחרו לפחות נושא אחד.</p>
          )}
        </div>
      </div>
    </section>
  )
}
