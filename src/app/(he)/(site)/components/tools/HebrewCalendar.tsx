'use client'

import { useMemo, useState } from 'react'
import { CalendarPlus, ChevronLeft, ChevronRight, Printer } from 'lucide-react'
import {
  WEEKDAY_FULL,
  WEEKDAY_SHORT,
  calendarYear,
  hebrewDateText,
  icsCalendar,
  icsFileName,
  isYearChoice,
  kindLabels,
  legendKinds,
  printDocument,
  yearChoices,
  type CalendarCell,
  type EventKind,
  type PrintLayout,
  type YearChoiceId,
} from '@/lib/hebrew-calendar'
import ui from './toolUi.module.css'
import styles from './HebrewCalendar.module.css'

const kindClass: Record<EventKind, string> = {
  rest: styles.rest,
  eve: styles.eve,
  cholHamoed: styles.cholHamoed,
  fast: styles.fast,
  memorial: styles.memorial,
  minor: styles.minor,
  roshChodesh: styles.roshChodesh,
}

const kindRank: EventKind[] = ['rest', 'memorial', 'fast', 'eve', 'cholHamoed', 'minor', 'roshChodesh']

const mainKind = (cell: CalendarCell) =>
  kindRank.find((kind) => cell.events.some((event) => event.kind === kind)) ?? null

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

function download(text: string, name: string) {
  const url = URL.createObjectURL(new Blob([text], { type: 'text/calendar;charset=utf-8' }))
  const link = document.createElement('a')
  link.href = url
  link.download = name
  document.body.appendChild(link)
  link.click()
  link.remove()
  window.setTimeout(() => URL.revokeObjectURL(url), 1000)
}

export default function HebrewCalendar({ initialMonth }: { initialMonth: number }) {
  const [yearId, setYearId] = useState<YearChoiceId>('5787')
  const [monthIndex, setMonthIndex] = useState(initialMonth)
  const [status, setStatus] = useState('')
  const calendar = useMemo(() => calendarYear(yearId), [yearId])

  if (!calendar) {
    return (
      <section className={ui.tool} aria-label="לוח שנה עברי-לועזי">
        <div className={ui.inner}>
          <p className={styles.unsupported} role="alert">
            הדפדפן הזה לא תומך בלוח העברי. פתחו את הדף בכרום, אדג׳, ספארי או פיירפוקס עדכניים.
          </p>
        </div>
      </section>
    )
  }

  const index = Math.min(monthIndex, calendar.months.length - 1)
  const grid = calendar.months[index]
  const monthEvents = grid.cells.flatMap((cell) => cell.events)
  const blanks = Array.from({ length: grid.leading }, (_, position) => ({ blank: position }))
  const slots: (CalendarCell | { blank: number })[] = [...blanks, ...grid.cells]
  while (slots.length % 7) slots.push({ blank: slots.length })
  const weeks: (CalendarCell | { blank: number })[][] = []
  for (let start = 0; start < slots.length; start += 7) weeks.push(slots.slice(start, start + 7))

  const changeYear = (value: string) => {
    if (!isYearChoice(value)) return
    setYearId(value)
    setMonthIndex(0)
    setStatus('')
  }

  const print = (layout: PrintLayout) => {
    openPrint(printDocument(calendar, layout))
    setStatus(layout === 'month' ? 'נפתח חלון הדפסה: חודש בכל עמוד A4.' : 'נפתח חלון הדפסה: כל השנה בעמוד A4 אחד.')
  }

  const downloadIcs = () => {
    download(icsCalendar(calendar.events, `חגים ומועדים, ${calendar.choice.title}`, new Date()), icsFileName(yearId))
    setStatus(`הקובץ ${icsFileName(yearId)} ירד. פותחים אותו כדי להוסיף את ${calendar.events.length} המועדים ליומן.`)
  }

  return (
    <section className={ui.tool} aria-labelledby="calendar-tool-title">
      <div className={`${ui.inner} ${styles.inner}`}>
        <div className={styles.panel}>
          <h2 id="calendar-tool-title" className={styles.srOnly}>
            לוח השנה
          </h2>
          <div className={styles.controls}>
            <div className={ui.field}>
              <label htmlFor="calendar-year" className={ui.label}>
                שנה
              </label>
              <select
                id="calendar-year"
                className={ui.input}
                value={yearId}
                onChange={(event) => changeYear(event.target.value)}
              >
                {yearChoices.map((choice) => (
                  <option key={choice.id} value={choice.id}>
                    {choice.label}
                  </option>
                ))}
              </select>
            </div>
            <div className={ui.field}>
              <label htmlFor="calendar-month" className={ui.label}>
                חודש
              </label>
              <select
                id="calendar-month"
                className={ui.input}
                value={index}
                onChange={(event) => setMonthIndex(Number(event.target.value))}
              >
                {calendar.months.map((month, position) => (
                  <option key={month.key} value={position}>
                    {month.title}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className={styles.monthHead}>
            <button
              type="button"
              className={styles.nav}
              onClick={() => setMonthIndex(index - 1)}
              disabled={index === 0}
              aria-label="החודש הקודם"
            >
              <ChevronRight aria-hidden="true" />
            </button>
            <div className={styles.monthTitle} aria-live="polite">
              <span className={styles.gregorianTitle}>{grid.title}</span>
              <span className={styles.hebrewTitle}>{grid.hebrewSpan}</span>
            </div>
            <button
              type="button"
              className={styles.nav}
              onClick={() => setMonthIndex(index + 1)}
              disabled={index === calendar.months.length - 1}
              aria-label="החודש הבא"
            >
              <ChevronLeft aria-hidden="true" />
            </button>
          </div>

          <table className={styles.grid}>
            <caption className={styles.srOnly}>
              {grid.title}, {grid.hebrewSpan}
            </caption>
            <thead>
              <tr>
                {WEEKDAY_SHORT.map((name, position) => (
                  <th key={name} scope="col">
                    <abbr title={WEEKDAY_FULL[position]}>{name}</abbr>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {weeks.map((week, row) => (
                <tr key={row}>
                  {week.map((slot) => {
                    if ('blank' in slot) return <td key={`blank-${slot.blank}`} className={styles.blank} />
                    const kind = mainKind(slot)
                    const shabbat = slot.weekday === 6 ? styles.shabbat : ''
                    return (
                      <td key={slot.day} className={`${styles.cell} ${kind ? kindClass[kind] : ''} ${shabbat}`}>
                        <span className={styles.gregorian}>{slot.date}</span>
                        <span className={styles.hebrew}>
                          {slot.hebrewDay}
                          {slot.hebrewMonth ? <span className={styles.hebrewMonth}> {slot.hebrewMonth}</span> : null}
                        </span>
                        {slot.events.map((event) => (
                          <span key={event.name} className={styles.eventName}>
                            {event.name}
                          </span>
                        ))}
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>

          <ul className={styles.legend} aria-label="מקרא צבעים">
            {legendKinds.map((kind) => (
              <li key={kind}>
                <span className={`${styles.swatch} ${kindClass[kind]}`} aria-hidden="true" />
                {kindLabels[kind]}
              </li>
            ))}
          </ul>
        </div>

        <div className={ui.output}>
          <div className={ui.sticky}>
            <h3 className={ui.outputTitle}>מועדים ב{grid.title}</h3>
            {monthEvents.length ? (
              <ul className={styles.events}>
                {monthEvents.map((event) => (
                  <li key={`${event.day}-${event.name}`} className={styles.event}>
                    <span className={`${styles.dot} ${kindClass[event.kind]}`} aria-hidden="true" />
                    <span className={styles.eventBody}>
                      <span className={styles.eventTitle}>{event.name}</span>
                      <span className={styles.eventDate}>
                        {grid.cells.find((cell) => cell.day === event.day)?.date}.{grid.key.split('-')[1]} ·{' '}
                        {hebrewDateText(event.day)} · {kindLabels[event.kind]}
                      </span>
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className={ui.note}>אין חגים, צומות או ראשי חודשים בחודש הזה.</p>
            )}
            <div className={ui.actions}>
              <button type="button" className={ui.primary} onClick={() => print('month')}>
                <Printer aria-hidden="true" />
                הדפסה: חודש בעמוד
              </button>
              <button type="button" className={ui.secondary} onClick={() => print('year')}>
                <Printer aria-hidden="true" />
                הדפסה: שנה בעמוד אחד
              </button>
              <button type="button" className={ui.secondary} onClick={downloadIcs}>
                <CalendarPlus aria-hidden="true" />
                הורדת החגים ליומן (ics)
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
