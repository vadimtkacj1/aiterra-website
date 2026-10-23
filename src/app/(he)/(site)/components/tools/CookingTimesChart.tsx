'use client'

import { Fragment, useEffect, useId, useRef, useState, type FormEvent } from 'react'
import { BellRing, Timer, X } from 'lucide-react'
import {
  categoryLabels,
  categoryOrder,
  filterItems,
  formatClock,
  formatMinutes,
  safeTemps,
  type CookingCategory,
  type CookingItem,
} from '@/lib/cooking-times'
import ui from './toolUi.module.css'
import styles from './CookingTimesChart.module.css'

type Filter = CookingCategory | 'all'
type Running = { id: number; label: string; endsAt: number; done: boolean }

const TICK_MS = 500
const MAX_TIMERS = 8

function beep(context: AudioContext) {
  for (let index = 0; index < 3; index += 1) {
    const oscillator = context.createOscillator()
    const gain = context.createGain()
    const begin = context.currentTime + index * 0.35
    oscillator.frequency.value = 880
    gain.gain.setValueAtTime(0.2, begin)
    gain.gain.exponentialRampToValueAtTime(0.001, begin + 0.25)
    oscillator.connect(gain)
    gain.connect(context.destination)
    oscillator.start(begin)
    oscillator.stop(begin + 0.25)
  }
}

export default function CookingTimesChart() {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState<Filter>('all')
  const [timers, setTimers] = useState<Running[]>([])
  const [now, setNow] = useState(0)
  const [announcement, setAnnouncement] = useState('')
  const [customLabel, setCustomLabel] = useState('')
  const [customMinutes, setCustomMinutes] = useState('10')
  const audioRef = useRef<AudioContext | null>(null)
  const counterRef = useRef(0)
  const searchId = useId()
  const categoryId = useId()
  const labelId = useId()
  const minutesId = useId()
  const rows = filterItems(query, category)

  useEffect(() => {
    if (!timers.length) return
    setNow(Date.now())
    const handle = window.setInterval(() => setNow(Date.now()), TICK_MS)
    return () => window.clearInterval(handle)
  }, [timers.length])

  useEffect(() => {
    const finished = timers.filter((timer) => !timer.done && timer.endsAt <= now)
    if (!finished.length) return
    setTimers((current) =>
      current.map((timer) => (finished.some((entry) => entry.id === timer.id) ? { ...timer, done: true } : timer)),
    )
    setAnnouncement(`הטיימר הסתיים: ${finished.map((timer) => timer.label).join(', ')}`)
    if (audioRef.current) {
      try {
        beep(audioRef.current)
      } catch {
        setAnnouncement(`הטיימר הסתיים: ${finished.map((timer) => timer.label).join(', ')}`)
      }
    }
  }, [now, timers])

  const startTimer = (label: string, minutes: number) => {
    if (!audioRef.current) {
      try {
        audioRef.current = new AudioContext()
      } catch {
        audioRef.current = null
      }
    }
    const current = Date.now()
    counterRef.current += 1
    const id = counterRef.current
    setNow(current)
    setAnnouncement(`טיימר ל${label} התחיל: ${minutes} דקות`)
    setTimers((list) =>
      [...list, { id, label, endsAt: current + minutes * 60000, done: false }].slice(-MAX_TIMERS),
    )
  }

  const removeTimer = (id: number) => setTimers((list) => list.filter((timer) => timer.id !== id))

  const onCustom = (event: FormEvent) => {
    event.preventDefault()
    const minutes = Number(customMinutes)
    if (!Number.isFinite(minutes) || minutes <= 0 || minutes > 600) return
    startTimer(customLabel.trim() || 'טיימר חופשי', minutes)
  }

  const safeNote = (entry: CookingItem) => {
    if (!entry.safe) return null
    const temp = safeTemps[entry.safe]
    return (
      <span className={styles.safe}>
        טמפרטורה פנימית מינימלית: {temp.celsius}°C ({temp.fahrenheit}°F)
      </span>
    )
  }

  return (
    <section className={ui.tool} aria-label="טבלת זמני בישול וטיימר">
      <div className={`${ui.inner} ${styles.panel}`}>
        <div className={styles.layout}>
          <div className={styles.main}>
            <div className={styles.controls}>
              <div className={`${ui.field} ${styles.grow}`}>
                <label htmlFor={searchId} className={ui.label}>
                  חיפוש מאכל או שיטה
                </label>
                <input
                  id={searchId}
                  type="search"
                  className={ui.input}
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                />
              </div>
              <div className={ui.field}>
                <label htmlFor={categoryId} className={ui.label}>
                  קטגוריה
                </label>
                <select
                  id={categoryId}
                  className={ui.input}
                  value={category}
                  onChange={(event) => setCategory(event.target.value as Filter)}
                >
                  <option value="all">הכול</option>
                  {categoryOrder.map((id) => (
                    <option key={id} value={id}>
                      {categoryLabels[id]}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className={styles.tableWrap} role="region" aria-label="טבלת זמני בישול" tabIndex={0}>
              <table className={styles.table}>
                <caption>זמני בישול משוערים</caption>
                <thead>
                  <tr>
                    <th scope="col">מאכל</th>
                    <th scope="col">שיטה</th>
                    <th scope="col">זמן</th>
                    <th scope="col">הערה</th>
                    <th scope="col">טיימר</th>
                  </tr>
                </thead>
                <tbody>
                  {categoryOrder.map((id) => {
                    const inCategory = rows.filter((entry) => entry.category === id)
                    if (!inCategory.length) return null
                    return (
                      <Fragment key={id}>
                        <tr className={styles.groupRow}>
                          <th scope="colgroup" colSpan={5}>
                            {categoryLabels[id]}
                          </th>
                        </tr>
                        {inCategory.map((entry) => (
                          <tr key={entry.id}>
                            <th scope="row">{entry.name}</th>
                            <td>{entry.method}</td>
                            <td className={styles.time}>{formatMinutes(entry.min, entry.max)}</td>
                            <td>
                              {entry.note}
                              {safeNote(entry)}
                            </td>
                            <td>
                              <button
                                type="button"
                                className={styles.timerButton}
                                onClick={() => startTimer(entry.name, entry.min)}
                                aria-label={`הפעלת טיימר ל${entry.name}, ${entry.min} דקות`}
                              >
                                <Timer aria-hidden="true" />
                                {entry.min} דק׳
                              </button>
                            </td>
                          </tr>
                        ))}
                      </Fragment>
                    )
                  })}
                </tbody>
              </table>
            </div>
            <p className={styles.empty}>{rows.length ? '' : 'לא נמצא מאכל כזה.'}</p>
          </div>

          <div className={styles.timers} role="group" aria-label="הטיימרים שלי">
            <h2 className={ui.outputTitle}>הטיימרים שלי</h2>
            <form className={styles.custom} onSubmit={onCustom}>
              <div className={ui.field}>
                <label htmlFor={labelId} className={ui.label}>
                  שם
                </label>
                <input
                  id={labelId}
                  className={ui.input}
                  value={customLabel}
                  onChange={(event) => setCustomLabel(event.target.value)}
                />
              </div>
              <div className={ui.field}>
                <label htmlFor={minutesId} className={ui.label}>
                  דקות
                </label>
                <input
                  id={minutesId}
                  className={`${ui.input} ${ui.ltr}`}
                  type="number"
                  inputMode="decimal"
                  min="0.5"
                  max="600"
                  step="0.5"
                  value={customMinutes}
                  onChange={(event) => setCustomMinutes(event.target.value)}
                />
              </div>
              <button type="submit" className={ui.primary}>
                הפעלה
              </button>
            </form>
            <ul className={styles.timerList}>
              {timers.map((timer) => (
                <li key={timer.id} className={styles.timerItem} data-done={timer.done}>
                  <span className={styles.timerName}>{timer.label}</span>
                  <span className={styles.clock}>
                    {timer.done ? (
                      <>
                        <BellRing aria-hidden="true" /> הסתיים
                      </>
                    ) : (
                      formatClock(timer.endsAt - now)
                    )}
                  </span>
                  <button
                    type="button"
                    className={styles.remove}
                    onClick={() => removeTimer(timer.id)}
                    aria-label={`הסרת הטיימר ${timer.label}`}
                  >
                    <X aria-hidden="true" />
                  </button>
                </li>
              ))}
            </ul>
            <p className={ui.note}>
              {timers.length ? '' : 'לחצו על כפתור הטיימר בטבלה כדי להפעיל. אפשר להפעיל כמה טיימרים יחד.'}
            </p>
            <p className={styles.srOnly} role="status" aria-live="polite">
              {announcement}
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
