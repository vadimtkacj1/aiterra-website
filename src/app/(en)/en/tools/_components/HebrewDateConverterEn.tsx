'use client'

import { useEffect, useId, useMemo, useRef, useState } from 'react'
import { ClipboardList, Copy } from 'lucide-react'
import {
  DEFAULT_MODE,
  MAX_ISO,
  MIN_ISO,
  isoOf,
  modeFromHash,
  monthForYear,
  monthsOfYear,
  parseHebrewYear,
  supportsHebrewCalendar,
  toHebrew,
  todayDayNumber,
  type BirthKind,
  type ConverterMode,
  type ConverterOutcome,
  type HebrewDateInput,
  type HebrewMonth,
} from '@/lib/hebrew-date'
import {
  enConvertGregorian,
  enConvertHebrew,
  enConverterModes,
  enHebrewAge,
  enMonthNames,
  enYearError,
  enYearHint,
} from './hebrew-date-en'
import ui from '../../../../(he)/(site)/components/tools/toolUi.module.css'
import styles from '../../../../(he)/(site)/components/tools/HebrewDateConverter.module.css'

type CopyTarget = 'main' | 'all'

const ANNOUNCE_DELAY_MS = 900

const days = Array.from({ length: 30 }, (_, index) => index + 1)

const birthKinds: { value: BirthKind; label: string }[] = [
  { value: 'gregorian', label: 'Gregorian' },
  { value: 'hebrew', label: 'Hebrew' },
]

const copyLabels: Record<ConverterMode, string> = {
  'hebrew-to-gregorian': 'Copy the Gregorian date',
  'gregorian-to-hebrew': 'Copy the Hebrew date',
  'hebrew-age': 'Copy the Hebrew birth date',
}

const emptyHebrew: HebrewDateInput = { day: '1', month: 'tishri', year: '' }

const announcementFor = (outcome: ConverterOutcome) => {
  if (outcome.kind === 'result') return outcome.announce
  return outcome.tone === 'error' ? outcome.message : ''
}

function HebrewDateFields({
  value,
  onChange,
}: {
  value: HebrewDateInput
  onChange: (patch: Partial<HebrewDateInput>) => void
}) {
  const id = useId()
  const hintId = `${id}-year-hint`
  const errorId = `${id}-year-error`
  const parsed = parseHebrewYear(value.year)
  const year = parsed.ok ? parsed.year : null
  const error = enYearError(parsed)

  return (
    <div className={styles.hebrewFields}>
      <div className={ui.field}>
        <label htmlFor={`${id}-day`} className={ui.label}>
          Day
        </label>
        <select
          id={`${id}-day`}
          className={`${ui.input} ${styles.select}`}
          value={value.day}
          onChange={(event) => onChange({ day: event.target.value })}
        >
          {days.map((day) => (
            <option key={day} value={String(day)}>
              {day}
            </option>
          ))}
        </select>
      </div>
      <div className={ui.field}>
        <label htmlFor={`${id}-month`} className={ui.label}>
          Month
        </label>
        <select
          id={`${id}-month`}
          className={`${ui.input} ${styles.select}`}
          value={monthForYear(value.month, year)}
          onChange={(event) => onChange({ month: event.target.value as HebrewMonth })}
        >
          {monthsOfYear(year).map((month) => (
            <option key={month} value={month}>
              {enMonthNames[month]}
            </option>
          ))}
        </select>
      </div>
      <div className={`${ui.field} ${styles.yearField}`}>
        <label htmlFor={`${id}-year`} className={ui.label}>
          Year
        </label>
        <input
          id={`${id}-year`}
          className={`${ui.input} ${styles.year}`}
          autoComplete="off"
          spellCheck={false}
          enterKeyHint="done"
          maxLength={12}
          value={value.year}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${hintId} ${errorId}` : hintId}
          onChange={(event) => onChange({ year: event.target.value })}
        />
        <p id={hintId} className={ui.hint}>
          {enYearHint(parsed)}
        </p>
        {error ? (
          <p id={errorId} className={styles.error}>
            {error}
          </p>
        ) : null}
      </div>
    </div>
  )
}

function GregorianFields({
  label,
  sunsetLabel,
  value,
  afterSunset,
  onChange,
  onSunsetChange,
}: {
  label: string
  sunsetLabel: string
  value: string
  afterSunset: boolean
  onChange: (value: string) => void
  onSunsetChange: (value: boolean) => void
}) {
  const id = useId()
  const sunsetHintId = `${id}-sunset-hint`

  return (
    <>
      <div className={ui.field}>
        <label htmlFor={id} className={ui.label}>
          {label}
        </label>
        <input
          id={id}
          type="date"
          className={`${ui.input} ${styles.dateInput}`}
          min={MIN_ISO}
          max={MAX_ISO}
          value={value}
          onChange={(event) => onChange(event.target.value)}
        />
      </div>
      <div className={styles.sunset}>
        <label className={ui.option}>
          <input
            type="checkbox"
            className={ui.checkbox}
            checked={afterSunset}
            aria-describedby={sunsetHintId}
            onChange={(event) => onSunsetChange(event.target.checked)}
          />
          <span>{sunsetLabel}</span>
        </label>
        <p id={sunsetHintId} className={`${ui.hint} ${styles.sunsetHint}`}>
          The Hebrew day starts in the evening, so anything after sunset already belongs to the next Hebrew date.
        </p>
      </div>
    </>
  )
}

function ResultView({ outcome }: { outcome: ConverterOutcome }) {
  if (outcome.kind === 'message') {
    return (
      <div className={styles.card}>
        <p className={outcome.tone === 'error' ? `${styles.message} ${styles.messageError}` : styles.message}>
          {outcome.message}
        </p>
      </div>
    )
  }

  return (
    <>
      <div className={styles.card}>
        <p className={styles.lead}>{outcome.lead}</p>
        <p className={styles.headline}>{outcome.headline}</p>
        {outcome.sub ? <p className={styles.sub}>{outcome.sub}</p> : null}
        <dl className={styles.details}>
          {outcome.details.map((detail) => (
            <div key={detail.label} className={styles.detail}>
              <dt>{detail.label}</dt>
              <dd>
                <bdi>{detail.value}</bdi>
              </dd>
            </div>
          ))}
        </dl>
        {outcome.milestones.length ? (
          <dl className={styles.milestones}>
            {outcome.milestones.map((item) => (
              <div key={item.title} className={styles.milestone}>
                <dt className={styles.milestoneTitle}>{item.title}</dt>
                <dd className={styles.milestoneHebrew}>{item.hebrew}</dd>
                <dd className={styles.milestoneDate}>{item.gregorian}</dd>
              </div>
            ))}
          </dl>
        ) : null}
      </div>
      {outcome.upcoming.length ? (
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <caption>The same Hebrew date in the coming years</caption>
            <thead>
              <tr>
                <th scope="col">Hebrew date</th>
                <th scope="col">Gregorian date</th>
                <th scope="col">Day</th>
              </tr>
            </thead>
            <tbody>
              {outcome.upcoming.map((row) => (
                <tr key={row.gregorian}>
                  <th scope="row">{row.hebrew}</th>
                  <td>{row.gregorian}</td>
                  <td>{row.weekday}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}
      {outcome.notes.map((note) => (
        <p key={note} className={styles.insight}>
          {note}
        </p>
      ))}
    </>
  )
}

export default function HebrewDateConverterEn() {
  const [mode, setMode] = useState<ConverterMode>(DEFAULT_MODE)
  const [supported, setSupported] = useState(true)
  const [today, setToday] = useState<number | null>(null)
  const [gregorian, setGregorian] = useState('')
  const [afterSunset, setAfterSunset] = useState(false)
  const [hebrew, setHebrew] = useState<HebrewDateInput>(emptyHebrew)
  const [birthKind, setBirthKind] = useState<BirthKind>('gregorian')
  const [birthGregorian, setBirthGregorian] = useState('')
  const [birthAfterSunset, setBirthAfterSunset] = useState(false)
  const [birthHebrew, setBirthHebrew] = useState<HebrewDateInput>(emptyHebrew)
  const [status, setStatus] = useState('')
  const [announcement, setAnnouncement] = useState('')
  const sectionRef = useRef<HTMLElement>(null)
  const name = useId()

  const outcome = useMemo<ConverterOutcome>(() => {
    if (mode === 'gregorian-to-hebrew') return enConvertGregorian(gregorian, afterSunset, supported)
    if (mode === 'hebrew-to-gregorian') return enConvertHebrew(hebrew, today, supported)
    return enHebrewAge({
      kind: birthKind,
      iso: birthGregorian,
      afterSunset: birthAfterSunset,
      hebrewInput: birthHebrew,
      today,
      supported,
    })
  }, [mode, gregorian, afterSunset, hebrew, today, supported, birthKind, birthGregorian, birthAfterSunset, birthHebrew])

  const spoken = announcementFor(outcome)
  const lastSpoken = useRef(spoken)

  useEffect(() => {
    const ok = supportsHebrewCalendar()
    const now = todayDayNumber()
    setSupported(ok)
    setToday(now)
    setGregorian(isoOf(now))
    if (ok) {
      const current = toHebrew(now)
      setHebrew({ day: String(current.day), month: current.month, year: String(current.year) })
    }

    const initial = modeFromHash(window.location.hash)
    if (initial) setMode(initial)

    const onHashChange = () => {
      const next = modeFromHash(window.location.hash)
      if (!next) return
      setMode(next)
      setStatus('')
      sectionRef.current?.scrollIntoView({ block: 'start' })
      sectionRef.current?.querySelector<HTMLInputElement>(`input[value="${next}"]`)?.focus({ preventScroll: true })
    }
    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [])

  useEffect(() => {
    if (spoken === lastSpoken.current) return
    const timer = window.setTimeout(() => {
      lastSpoken.current = spoken
      setAnnouncement(spoken)
    }, ANNOUNCE_DELAY_MS)
    return () => window.clearTimeout(timer)
  }, [spoken])

  const selectMode = (next: ConverterMode) => {
    setMode(next)
    setStatus('')
    window.history.replaceState(null, '', `#${next}`)
  }

  const copy = async (target: CopyTarget) => {
    if (outcome.kind !== 'result') {
      setStatus('Choose a date to get a result to copy.')
      return
    }
    try {
      await navigator.clipboard.writeText(target === 'main' ? outcome.copyMain : outcome.copyAll)
      setStatus(target === 'main' ? `Copied: ${outcome.copyMain}` : 'All details copied')
      window.gtag?.('event', 'hebrew_date_copy', { mode, target, locale: 'en' })
    } catch {
      setStatus('Copying failed. Select the date and copy it manually.')
    }
  }

  const legend = {
    'hebrew-to-gregorian': 'Hebrew date',
    'gregorian-to-hebrew': 'Gregorian date',
    'hebrew-age': 'Date of birth',
  }[mode]

  return (
    <section
      ref={sectionRef}
      className={`${ui.tool} ${styles.converter}`}
      aria-label="Hebrew and Gregorian date converter"
      dir="ltr"
    >
      <div className={`${ui.inner} ${styles.layout}`}>
        <form className={ui.form} onSubmit={(event) => event.preventDefault()}>
          <fieldset className={ui.group}>
            <legend className={ui.legend}>What do you want to work out</legend>
            <div className={styles.modes}>
              {enConverterModes.map((item) => (
                <label key={item.id} className={styles.mode}>
                  <input
                    type="radio"
                    name={name}
                    value={item.id}
                    checked={mode === item.id}
                    onChange={() => selectMode(item.id)}
                  />
                  <span className={styles.modeLabel}>{item.label}</span>
                  <span className={styles.modeHint}>{item.hint}</span>
                </label>
              ))}
            </div>
          </fieldset>

          <fieldset className={ui.group}>
            <legend className={ui.legend}>{legend}</legend>
            {mode === 'hebrew-to-gregorian' ? (
              <HebrewDateFields value={hebrew} onChange={(patch) => setHebrew((current) => ({ ...current, ...patch }))} />
            ) : null}
            {mode === 'gregorian-to-hebrew' ? (
              <GregorianFields
                label="Gregorian date"
                sunsetLabel="It happened after sunset"
                value={gregorian}
                afterSunset={afterSunset}
                onChange={setGregorian}
                onSunsetChange={setAfterSunset}
              />
            ) : null}
            {mode === 'hebrew-age' ? (
              <>
                <fieldset className={ui.group}>
                  <legend className={ui.legend}>Calendar</legend>
                  <div className={styles.choices}>
                    {birthKinds.map((option) => (
                      <label key={option.value} className={styles.choice}>
                        <input
                          type="radio"
                          name={`${name}-birth`}
                          value={option.value}
                          checked={birthKind === option.value}
                          onChange={() => setBirthKind(option.value)}
                        />
                        <span>{option.label}</span>
                      </label>
                    ))}
                  </div>
                </fieldset>
                {birthKind === 'gregorian' ? (
                  <GregorianFields
                    label="Gregorian date of birth"
                    sunsetLabel="The birth was after sunset"
                    value={birthGregorian}
                    afterSunset={birthAfterSunset}
                    onChange={setBirthGregorian}
                    onSunsetChange={setBirthAfterSunset}
                  />
                ) : (
                  <HebrewDateFields
                    value={birthHebrew}
                    onChange={(patch) => setBirthHebrew((current) => ({ ...current, ...patch }))}
                  />
                )}
              </>
            ) : null}
          </fieldset>
        </form>

        <div className={ui.output}>
          <div className={ui.sticky}>
            <h2 className={ui.outputTitle}>Result</h2>
            <ResultView outcome={outcome} />
            <div className={ui.actions}>
              <button type="button" className={`${ui.primary} ${styles.copyMain}`} onClick={() => copy('main')}>
                <Copy aria-hidden="true" />
                {copyLabels[mode]}
              </button>
              <button type="button" className={ui.secondary} onClick={() => copy('all')}>
                <ClipboardList aria-hidden="true" />
                Copy all details
              </button>
            </div>
            <p className={ui.status} role="status" aria-live="polite">
              {status}
            </p>
            <p className={styles.srOnly} role="status" aria-live="polite">
              {announcement}
            </p>
            <p className={ui.note}>
              The conversion runs in your browser, using its built-in Hebrew calendar, and no date is sent to a server.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
