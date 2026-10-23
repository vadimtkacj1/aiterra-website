'use client'

import { useEffect, useId, useMemo, useState, type FormEvent } from 'react'
import {
  STORAGE_KEY,
  MAX_DAYS,
  MIN_DAYS,
  buildChecklist,
  buildPrintHtml,
  checkedCount,
  clampDays,
  defaultSettings,
  sanitizeSaved,
  totalItems,
  trips,
  weathers,
  type CustomItem,
  type PackingSettings,
  type TripKind,
  type Weather,
} from '@/lib/travel-packing-checklist'
import { Check, NumberField, RadioTiles, parseNumber } from './ToolFields'
import ui from './toolUi.module.css'
import styles from './ToolFields.module.css'

const PRINT_BLOCKED = 'הדפדפן חסם את חלון ההדפסה. אפשרו חלונות קופצים לאתר ונסו שוב.'

export default function TravelPackingChecklist() {
  const names = { trip: useId(), weather: useId() }
  const ids = {
    days: useId(),
    rain: useId(),
    kids: useId(),
    baby: useId(),
    laundry: useId(),
    custom: useId(),
  }

  const [settings, setSettings] = useState<PackingSettings>(defaultSettings)
  const [daysText, setDaysText] = useState(String(defaultSettings.days))
  const [checked, setChecked] = useState<string[]>([])
  const [custom, setCustom] = useState<CustomItem[]>([])
  const [draft, setDraft] = useState('')
  const [loaded, setLoaded] = useState(false)
  const [printMessage, setPrintMessage] = useState('')

  useEffect(() => {
    let saved: ReturnType<typeof sanitizeSaved> = null
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY)
      saved = raw ? sanitizeSaved(JSON.parse(raw)) : null
    } catch {
      saved = null
    }
    if (saved) {
      setSettings(saved.settings)
      setDaysText(String(saved.settings.days))
      setChecked(saved.checked)
      setCustom(saved.custom)
    }
    setLoaded(true)
  }, [])

  useEffect(() => {
    if (!loaded) return
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ settings, checked, custom }))
    } catch {
      return
    }
  }, [loaded, settings, checked, custom])

  const groups = useMemo(() => buildChecklist(settings), [settings])
  const total = totalItems(groups, custom)
  const done = checkedCount(groups, custom, checked)

  const update = <K extends keyof PackingSettings>(key: K, value: PackingSettings[K]) =>
    setSettings((current) => ({ ...current, [key]: value }))

  const changeDays = (text: string) => {
    setDaysText(text)
    const parsed = parseNumber(text)
    if (parsed !== null) update('days', clampDays(parsed))
  }

  const toggle = (id: string, on: boolean) =>
    setChecked((current) => (on ? [...current.filter((value) => value !== id), id] : current.filter((value) => value !== id)))

  const addCustom = (event: FormEvent) => {
    event.preventDefault()
    const label = draft.replace(/\s+/g, ' ').trim()
    if (label === '') return
    setCustom((current) => [...current, { id: `custom-${Date.now()}-${current.length}`, label }])
    setDraft('')
  }

  const removeCustom = (id: string) => {
    setCustom((current) => current.filter((item) => item.id !== id))
    toggle(id, false)
  }

  const reset = () => setChecked([])

  const print = () => {
    const sheet = window.open('', '_blank')
    if (!sheet) {
      setPrintMessage(PRINT_BLOCKED)
      return
    }
    setPrintMessage('')
    sheet.document.open()
    sheet.document.write(buildPrintHtml(groups, custom, checked))
    sheet.document.close()
    sheet.focus()
    sheet.print()
    window.gtag?.('event', 'packing_list_print', { trip: settings.trip })
  }

  return (
    <section className={ui.tool} aria-label="רשימת אריזה לחו״ל">
      <div className={ui.inner}>
        <form className={ui.form} onSubmit={(event) => event.preventDefault()}>
          <RadioTiles<TripKind>
            legend="סוג הנסיעה"
            name={names.trip}
            options={trips}
            value={settings.trip}
            onChange={(next) => update('trip', next)}
          />
          <RadioTiles<Weather>
            legend="מזג האוויר ביעד"
            name={names.weather}
            options={weathers}
            value={settings.weather}
            onChange={(next) => update('weather', next)}
          />
          <fieldset className={ui.group}>
            <legend className={ui.legend}>פרטים נוספים</legend>
            <NumberField
              id={ids.days}
              label="מספר ימים"
              value={daysText}
              min={MIN_DAYS}
              max={MAX_DAYS}
              step={1}
              onChange={changeDays}
            />
            <div className={ui.options}>
              <Check id={ids.rain} label="צפוי גשם" checked={settings.rain} onChange={(next) => update('rain', next)} />
              <Check id={ids.laundry} label="יש כביסה בדרך" checked={settings.laundry} onChange={(next) => update('laundry', next)} />
              <Check id={ids.kids} label="נוסעים עם ילדים" checked={settings.kids} onChange={(next) => update('kids', next)} />
              <Check id={ids.baby} label="נוסעים עם תינוק" checked={settings.baby} onChange={(next) => update('baby', next)} />
            </div>
          </fieldset>
          <p className={ui.note}>הרשימה והסימונים נשמרים בדפדפן הזה בלבד, ולא נשלחים לשום מקום.</p>
        </form>

        <div className={ui.output}>
          <h2 className={ui.outputTitle}>הרשימה שלכם</h2>
          <p className={ui.status} role="status" aria-live="polite">
            {loaded ? `סומנו ${done} מתוך ${total}` : ''}
          </p>
          <div className={ui.actions}>
            <button type="button" className={ui.primary} onClick={print}>
              הדפסה או שמירה כ-PDF
            </button>
            <button type="button" className={ui.secondary} onClick={reset}>
              ניקוי הסימונים
            </button>
          </div>
          <p className={ui.status} role="status" aria-live="polite">
            {printMessage}
          </p>

          {groups.map((group) => (
            <fieldset key={group.id} className={ui.group}>
              <legend className={ui.legend}>{group.title}</legend>
              <div className={styles.single}>
                {group.items.map((item) => (
                  <Check
                    key={item.id}
                    id={`${ids.custom}-${item.id}`}
                    label={item.label}
                    checked={checked.includes(item.id)}
                    onChange={(next) => toggle(item.id, next)}
                  />
                ))}
              </div>
            </fieldset>
          ))}

          <fieldset className={ui.group}>
            <legend className={ui.legend}>פריטים משלכם</legend>
            {custom.length > 0 ? (
              <div className={styles.single}>
                {custom.map((item) => (
                  <div key={item.id} className={styles.customRow}>
                    <Check
                      id={`${ids.custom}-${item.id}`}
                      label={item.label}
                      checked={checked.includes(item.id)}
                      onChange={(next) => toggle(item.id, next)}
                    />
                    <button type="button" className={ui.secondary} onClick={() => removeCustom(item.id)}>
                      הסרה<span className={styles.srOnly}> של {item.label}</span>
                    </button>
                  </div>
                ))}
              </div>
            ) : null}
            <form onSubmit={addCustom} className={ui.field}>
              <label htmlFor={`${ids.custom}-new`} className={ui.label}>
                הוספת פריט
              </label>
              <input
                id={`${ids.custom}-new`}
                className={ui.input}
                autoComplete="off"
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
              />
              <div className={ui.actions}>
                <button type="submit" className={ui.secondary}>
                  הוספה לרשימה
                </button>
              </div>
            </form>
          </fieldset>
        </div>
      </div>
    </section>
  )
}
