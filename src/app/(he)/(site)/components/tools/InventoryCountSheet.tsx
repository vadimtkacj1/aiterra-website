'use client'

import { useEffect, useId, useMemo, useRef, useState, type ChangeEvent, type KeyboardEvent, type ReactNode } from 'react'
import { Download, Plus, Printer, Trash2, Upload } from 'lucide-react'
import {
  COLUMN_ROLES,
  MARKS,
  MAX_BLANK_SHEETS,
  MAX_FIRST_SHEET,
  MAX_ITEMS,
  NOTICE_FREE_DAYS,
  ROLE_LABELS,
  ROWS_PER_SHEET,
  balanceDateFor,
  countCsv,
  dateStatus,
  daysFromBalance,
  decodeText,
  defaultSettings,
  detectColumns,
  displayDate,
  emptyItem,
  fileLocations,
  findHeader,
  firstSheetNumber,
  formatMoney,
  formatQuantity,
  looksLikeHeader,
  parseDelimited,
  sheetDocument,
  sheetLabel,
  summarize,
  tableToItems,
  type ColumnMap,
  type ColumnRole,
  type CountItem,
  type CountSettings,
  type MarkId,
  type PrintMode,
} from '@/lib/inventory-count'
import ui from './toolUi.module.css'
import styles from './InventoryCountSheet.module.css'

type Draft = { settings: CountSettings; items: CountItem[] }
type ImportSource = 'file' | 'paste'
type PendingImport = {
  rows: string[][]
  map: ColumnMap
  headerIndex: number | null
  source: ImportSource
  locations: string[]
  location: string
  mapped: boolean
}
type ItemText = 'sku' | 'name' | 'unit' | 'serial' | 'expected' | 'counted' | 'cost'
type Toggle = 'showSku' | 'showSerial' | 'showCost' | 'showExpected'

const STORAGE_KEY = 'aiterra-inventory-count-v1'
const SAVE_DELAY_MS = 400
const MAX_FILE_BYTES = 25 * 1024 * 1024
const SAMPLE_ROWS = 50
const SAMPLE_LENGTH = 24
const TOP_DIFFERENCES = 8
const NO_COLUMN = -1
const BLANK_SHEET_OPTIONS = [1, 2, 3, 5, 10, 20, 30, 50]
const MARK_IDS = new Set<string>(MARKS.map((mark) => mark.id))

const TOGGLES: { key: Toggle; label: string }[] = [
  { key: 'showSku', label: 'מק״ט או ברקוד' },
  { key: 'showExpected', label: 'כמות רשומה במערכת' },
  { key: 'showSerial', label: 'יצרן ומספר סידורי' },
  { key: 'showCost', label: 'עלות ושווי' },
]

const isText = (value: unknown): value is string => typeof value === 'string'

const textOr = (value: unknown, fallback: string, max: number) => (isText(value) ? value.slice(0, max) : fallback)

const flagOr = (value: unknown, fallback: boolean) => (typeof value === 'boolean' ? value : fallback)

const count = (value: number) => value.toLocaleString('he-IL')

const fileSafe = (value: string) => value.trim().replace(/[\\/:*?"<>|]+/g, '-').replace(/\s+/g, '-')

const localIso = () => {
  const now = new Date()
  const pad = (value: number) => String(value).padStart(2, '0')
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`
}

function readItems(value: unknown): CountItem[] {
  if (!Array.isArray(value)) return []
  return value.slice(0, MAX_ITEMS).flatMap((entry, index) => {
    if (typeof entry !== 'object' || entry === null) return []
    const item = entry as Record<string, unknown>
    return [
      {
        id: index + 1,
        sku: textOr(item.sku, '', 80),
        name: textOr(item.name, '', 200),
        unit: textOr(item.unit, '', 20),
        serial: textOr(item.serial, '', 80),
        mark: isText(item.mark) && MARK_IDS.has(item.mark) ? (item.mark as MarkId) : '',
        expected: textOr(item.expected, '', 16),
        counted: textOr(item.counted, '', 16),
        cost: textOr(item.cost, '', 16),
      },
    ]
  })
}

function readDraft(today: string): Draft | null {
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY)
    if (!saved) return null
    const data = JSON.parse(saved) as Record<string, unknown>
    const stored = (data.settings ?? {}) as Record<string, unknown>
    const base = defaultSettings(today)
    const items = readItems(data.items)
    const rows = Number(stored.rowsPerSheet)
    const blank = Number(stored.blankSheets)
    const keepDate = items.length > 0 && isText(stored.date) && displayDate(stored.date) !== ''
    return {
      settings: {
        business: textOr(stored.business, '', 80),
        taxId: textOr(stored.taxId, '', 12),
        date: keepDate ? (stored.date as string) : base.date,
        location: textOr(stored.location, '', 80),
        counters: textOr(stored.counters, '', 160),
        firstSheet: textOr(stored.firstSheet, base.firstSheet, 4),
        rowsPerSheet: ROWS_PER_SHEET.some((option) => option === rows) ? rows : base.rowsPerSheet,
        blankSheets: Number.isInteger(blank) && blank >= 1 && blank <= MAX_BLANK_SHEETS ? blank : base.blankSheets,
        showSku: flagOr(stored.showSku, base.showSku),
        showSerial: flagOr(stored.showSerial, base.showSerial),
        showCost: flagOr(stored.showCost, base.showCost),
        showExpected: flagOr(stored.showExpected, base.showExpected),
      },
      items,
    }
  } catch {
    return null
  }
}

function writeDraft(draft: Draft) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(draft))
  } catch {
    return
  }
}

function dateNotice(date: string) {
  const status = dateStatus(date)
  const days = daysFromBalance(date)
  if (!status || days === null) return ''
  const balance = displayDate(balanceDateFor(date))
  const distance = `${Math.abs(days) === 1 ? 'יום אחד' : `${Math.abs(days)} ימים`} ${days < 0 ? 'לפני' : 'אחרי'}`
  if (status === 'balance') return `הספירה ביום המאזן, ${balance}.`
  if (status === 'near') {
    return `הספירה ${distance} יום המאזן (${balance}). עד ${NOTICE_FREE_DAYS} ימים אין צורך בהודעה, ואחרי הספירה מתאימים את הכמויות ליום המאזן.`
  }
  if (status === 'notice') {
    return `הספירה ${distance} יום המאזן (${balance}). מעל ${NOTICE_FREE_DAYS} ימים צריך להודיע על כך מראש ובכתב לפקיד השומה (סעיף 26(ב)).`
  }
  return `התאריך רחוק יותר מחודש מיום המאזן (${balance}). ספירה במועד כזה מתאימה למי שמנהל ספר תנועת מלאי וסופר כל פריט לפחות פעם בשנה (סעיף 26(ג)).`
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

function downloadCsv(content: string, fileName: string) {
  const url = URL.createObjectURL(new Blob([content], { type: 'text/csv;charset=utf-8' }))
  const link = document.createElement('a')
  link.href = url
  link.download = fileName
  link.click()
  window.setTimeout(() => URL.revokeObjectURL(url), 1000)
}

function Field({
  label,
  hint,
  error,
  children,
}: {
  label: string
  hint?: string
  error?: string
  children: (id: string, describedBy: string | undefined) => ReactNode
}) {
  const id = useId()
  const hintId = hint ? `${id}-hint` : ''
  const errorId = error ? `${id}-error` : ''
  const describedBy = [hintId, errorId].filter(Boolean).join(' ') || undefined
  return (
    <div className={ui.field}>
      <label htmlFor={id} className={ui.label}>
        {label}
      </label>
      {hint ? (
        <p id={hintId} className={ui.hint}>
          {hint}
        </p>
      ) : null}
      {children(id, describedBy)}
      {error ? (
        <p id={errorId} className={styles.error}>
          {error}
        </p>
      ) : null}
    </div>
  )
}

function Mini({ label, emphasis = false, children }: { label: string; emphasis?: boolean; children: ReactNode }) {
  return (
    <label className={emphasis ? `${styles.mini} ${styles.counted}` : styles.mini}>
      <span>{label}</span>
      {children}
    </label>
  )
}

function SummaryRow({ term, value, main = false }: { term: string; value: ReactNode; main?: boolean }) {
  return (
    <div className={main ? `${styles.resultRow} ${styles.main}` : styles.resultRow}>
      <dt className={styles.term}>{term}</dt>
      <dd className={styles.value}>{value}</dd>
    </div>
  )
}

function Signed({ value, money = false }: { value: number; money?: boolean }) {
  const text = money ? formatMoney(Math.abs(value)) : formatQuantity(Math.abs(value))
  return <span dir="ltr">{`${value > 0 ? '+' : value < 0 ? '-' : ''}${text}`}</span>
}

function ItemRow({
  item,
  number,
  row,
  settings,
  onText,
  onMark,
  onRemove,
  onKeyDown,
}: {
  item: CountItem
  number: number
  row: number
  settings: CountSettings
  onText: (key: ItemText, value: string) => void
  onMark: (mark: MarkId | '') => void
  onRemove: () => void
  onKeyDown: (event: KeyboardEvent<HTMLInputElement>) => void
}) {
  const text = (key: ItemText, className: string, numeric = false) => (
    <input
      className={`${ui.input} ${className}`}
      inputMode={numeric ? 'decimal' : undefined}
      autoComplete="off"
      spellCheck={false}
      value={item[key]}
      onChange={(event) => onText(key, event.target.value)}
    />
  )
  return (
    <li className={styles.item}>
      <span className={styles.rowNumber}>{number}</span>
      <input
        className={`${ui.input} ${styles.nameInput}`}
        aria-label={`תיאור הפריט, שורה ${number}`}
        autoComplete="off"
        value={item.name}
        onChange={(event) => onText('name', event.target.value)}
      />
      <button type="button" className={styles.remove} aria-label={`מחיקת שורה ${number}`} onClick={onRemove}>
        <Trash2 aria-hidden="true" />
      </button>
      <div className={styles.minis}>
        {settings.showSku ? <Mini label="מק״ט">{text('sku', `${ui.ltr} ${styles.miniInput}`)}</Mini> : null}
        <Mini label="יחידה">{text('unit', styles.miniInput)}</Mini>
        <Mini label="סימון">
          <select
            className={`${ui.input} ${styles.miniInput} ${styles.select}`}
            value={item.mark}
            onChange={(event) => onMark(event.target.value as MarkId | '')}
          >
            <option value="">ללא</option>
            {MARKS.map((mark) => (
              <option key={mark.id} value={mark.id}>
                {mark.label}
              </option>
            ))}
          </select>
        </Mini>
        {settings.showSerial ? (
          <Mini label="מספר סידורי">{text('serial', `${ui.ltr} ${styles.miniInput}`)}</Mini>
        ) : null}
        {settings.showExpected ? (
          <Mini label="כמות רשומה">{text('expected', `${ui.ltr} ${styles.miniInput}`, true)}</Mini>
        ) : null}
        <Mini label="כמות שנספרה" emphasis>
          <input
            className={`${ui.input} ${ui.ltr} ${styles.miniInput}`}
            inputMode="decimal"
            autoComplete="off"
            spellCheck={false}
            value={item.counted}
            data-row={row}
            onChange={(event) => onText('counted', event.target.value)}
            onKeyDown={onKeyDown}
          />
        </Mini>
        {settings.showCost ? (
          <Mini label="עלות ליחידה">{text('cost', `${ui.ltr} ${styles.miniInput}`, true)}</Mini>
        ) : null}
      </div>
    </li>
  )
}

function ColumnMapping({
  pending,
  columns,
  onColumn,
  onHeader,
}: {
  pending: PendingImport
  columns: number
  onColumn: (role: ColumnRole, index: number) => void
  onHeader: (first: boolean) => void
}) {
  return (
    <>
      <div className={styles.trio}>
        {COLUMN_ROLES.map((role) => (
          <Field key={role} label={ROLE_LABELS[role]}>
            {(id) => (
              <select
                id={id}
                className={`${ui.input} ${styles.select}`}
                value={pending.map[role] ?? NO_COLUMN}
                onChange={(event) => onColumn(role, Number(event.target.value))}
              >
                <option value={NO_COLUMN}>אין עמודה כזו</option>
                {Array.from({ length: columns }, (_, index) => (
                  <option key={index} value={index}>
                    {`עמודה ${index + 1}: ${(pending.rows[0][index] ?? '').slice(0, SAMPLE_LENGTH)}`}
                  </option>
                ))}
              </select>
            )}
          </Field>
        ))}
      </div>
      <label className={ui.option}>
        <input
          type="checkbox"
          className={ui.checkbox}
          checked={pending.headerIndex !== null}
          onChange={(event) => onHeader(event.target.checked)}
        />
        <span>השורה הראשונה היא שורת כותרות</span>
      </label>
    </>
  )
}

export default function InventoryCountSheet({ initialDate }: { initialDate: string }) {
  const [draft, setDraft] = useState<Draft>(() => ({ settings: defaultSettings(initialDate), items: [] }))
  const [restored, setRestored] = useState(false)
  const [page, setPage] = useState(0)
  const [pasted, setPasted] = useState('')
  const [pending, setPending] = useState<PendingImport | null>(null)
  const [status, setStatus] = useState('')
  const nextId = useRef(1)
  const listRef = useRef<HTMLOListElement>(null)

  const { settings, items } = draft
  const summary = useMemo(() => summarize(items), [items])
  const topDifferences = useMemo(
    () => [...summary.differences].sort((a, b) => Math.abs(b.delta) - Math.abs(a.delta)).slice(0, TOP_DIFFERENCES),
    [summary],
  )
  const firstSheet = firstSheetNumber(settings.firstSheet)
  const pageCount = Math.max(1, Math.ceil(items.length / settings.rowsPerSheet))
  const current = Math.min(page, pageCount - 1)
  const firstRow = current * settings.rowsPerSheet
  const visible = items.slice(firstRow, firstRow + settings.rowsPerSheet)
  const compared = summary.matching + summary.differences.length
  const notice = dateNotice(settings.date)
  const pendingColumns = pending
    ? Math.max(...pending.rows.slice(0, SAMPLE_ROWS).map((row) => row.length))
    : 0

  useEffect(() => {
    const today = localIso()
    const next = readDraft(today) ?? { settings: defaultSettings(today), items: [] }
    nextId.current = next.items.length + 1
    setDraft(next)
    setRestored(true)
  }, [])

  useEffect(() => {
    if (!restored) return
    const timer = window.setTimeout(() => writeDraft(draft), SAVE_DELAY_MS)
    return () => window.clearTimeout(timer)
  }, [draft, restored])

  const setSetting = <K extends keyof CountSettings>(key: K, value: CountSettings[K]) =>
    setDraft((state) => ({ ...state, settings: { ...state.settings, [key]: value } }))

  const changeItem = (id: number, patch: Partial<CountItem>) =>
    setDraft((state) => ({
      ...state,
      items: state.items.map((item) => (item.id === id ? { ...item, ...patch } : item)),
    }))

  const removeItem = (id: number) =>
    setDraft((state) => ({ ...state, items: state.items.filter((item) => item.id !== id) }))

  const addItem = () => {
    if (items.length >= MAX_ITEMS) {
      setStatus(`הרשימה מלאה: עד ${count(MAX_ITEMS)} פריטים.`)
      return
    }
    const item = emptyItem(nextId.current)
    nextId.current += 1
    setDraft((state) => ({ ...state, items: [...state.items, item] }))
    setPage(Math.floor(items.length / settings.rowsPerSheet))
  }

  const clearItems = () => {
    if (!window.confirm('למחוק את כל הפריטים והכמויות מהרשימה?')) return
    nextId.current = 1
    setDraft((state) => ({ ...state, items: [] }))
    setPage(0)
    setStatus('הרשימה נמחקה')
  }

  const commitImport = (request: PendingImport, detected: boolean) => {
    const room = Math.max(0, MAX_ITEMS - items.length)
    const place = request.locations.length > 1 ? request.location : ''
    const imported = tableToItems(request.rows, request.map, request.headerIndex, nextId.current, place).slice(0, room)
    if (!imported.length) {
      setStatus(room ? 'לא נמצאו שורות עם תיאור או מק״ט.' : `הרשימה מלאה: עד ${count(MAX_ITEMS)} פריטים.`)
      return
    }
    const withQuantity = imported.filter((item) => item.expected !== '').length
    nextId.current += imported.length
    setDraft((state) => ({
      settings:
        request.location && !state.settings.location.trim()
          ? { ...state.settings, location: request.location }
          : state.settings,
      items: [...state.items, ...imported],
    }))
    setPending(null)
    setPasted('')
    setStatus(
      `נוספו ${count(imported.length)} פריטים` +
        (place ? ` מהמיקום ${place}` : '') +
        (withQuantity ? `, ל-${count(withQuantity)} מהם יש כמות רשומה.` : '.') +
        (items.length + imported.length >= MAX_ITEMS ? ` הרשימה מוגבלת ל-${count(MAX_ITEMS)} פריטים.` : ''),
    )
    window.gtag?.('event', 'inventory_import', { rows: imported.length, source: request.source, detected })
  }

  const receiveRows = (rows: string[][], source: ImportSource) => {
    if (!rows.length) {
      setStatus('לא נמצאו שורות.')
      return
    }
    const header = findHeader(rows)
    if (header) {
      const locations = fileLocations(rows, header.index)
      const request: PendingImport = {
        rows,
        map: header.map,
        headerIndex: header.index,
        source,
        locations,
        location: locations[0] ?? '',
        mapped: true,
      }
      if (locations.length > 1) {
        setPending(request)
        setStatus(`בקובץ יש מלאי של ${count(locations.length)} מיקומים. בחרו את המיקום שסופרים.`)
        return
      }
      commitImport(request, true)
      return
    }
    const unmapped = { rows, source, locations: [], location: '', mapped: false }
    const widest = Math.max(...rows.slice(0, SAMPLE_ROWS).map((row) => row.length))
    if (widest === 1) {
      commitImport({ ...unmapped, map: { name: 0 }, headerIndex: null }, false)
      return
    }
    if (looksLikeHeader(rows[0])) {
      setPending({ ...unmapped, map: detectColumns(rows[0]), headerIndex: 0 })
      setStatus('השורה הראשונה נראית כמו שורת כותרות. בדקו את העמודות ואת הסימון לפני ההוספה.')
      return
    }
    setPending({ ...unmapped, map: { name: 0 }, headerIndex: null })
    setStatus('לא זיהינו שורת כותרות. בחרו איזו עמודה היא התיאור ואיזו הכמות.')
  }

  const readFile = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) return
    if (/\.xlsx?$/i.test(file.name)) {
      setStatus('קובץ Excel לא נקרא כאן. שמרו אותו כ-CSV, או העתיקו את השורות והדביקו למטה.')
      return
    }
    if (file.size > MAX_FILE_BYTES) {
      setStatus('הקובץ גדול מ-25MB. ייצאו קובץ מלאי, בלי תיאורי המוצרים.')
      return
    }
    try {
      receiveRows(parseDelimited(decodeText(await file.arrayBuffer())), 'file')
    } catch {
      setStatus('לא הצלחנו לקרוא את הקובץ.')
    }
  }

  const setPendingColumn = (role: ColumnRole, index: number) =>
    setPending((state) => {
      if (!state) return state
      const map: ColumnMap = { ...state.map }
      if (index === NO_COLUMN) delete map[role]
      else map[role] = index
      return { ...state, map }
    })

  const moveFocus = (event: KeyboardEvent<HTMLInputElement>) => {
    const step = event.key === 'ArrowDown' || event.key === 'Enter' ? 1 : event.key === 'ArrowUp' ? -1 : 0
    if (!step) return
    const target = listRef.current?.querySelector<HTMLInputElement>(
      `[data-row="${Number(event.currentTarget.dataset.row) + step}"]`,
    )
    if (!target) return
    event.preventDefault()
    target.focus()
    target.select()
  }

  const print = (mode: PrintMode) => {
    openPrint(sheetDocument(settings, items, mode))
    setStatus('נפתח חלון ההדפסה. כדי לקבל קובץ PDF, בחרו ביעד ״שמירה כ-PDF״.')
    window.gtag?.('event', 'inventory_print', { mode, rows: mode === 'blank' ? 0 : items.length })
  }

  const exportCsv = () => {
    const name = fileSafe(settings.business)
    downloadCsv(countCsv(settings, items), `ספירת-מלאי-${settings.date || 'טופס'}${name ? `-${name}` : ''}.csv`)
    setStatus(
      items.length
        ? 'קובץ ה-CSV ירד. אפשר לפתוח אותו ב-Excel או ב-Google Sheets.'
        : 'תבנית ה-CSV ירדה. ממלאים אותה ב-Excel או ב-Google Sheets.',
    )
    window.gtag?.('event', 'inventory_csv', { rows: items.length })
  }

  return (
    <section className={`${ui.tool} ${styles.root}`} aria-label="טופס ספירת מלאי" data-clarity-mask="true">
      <div className={`${ui.inner} ${styles.layout}`}>
        <form className={ui.form} onSubmit={(event) => event.preventDefault()}>
          <fieldset className={ui.group}>
            <legend className={ui.legend}>פרטי הספירה</legend>
            <div className={styles.pair}>
              <Field label="שם העסק">
                {(id) => (
                  <input
                    id={id}
                    className={ui.input}
                    autoComplete="organization"
                    maxLength={80}
                    value={settings.business}
                    onChange={(event) => setSetting('business', event.target.value)}
                  />
                )}
              </Field>
              <Field label="מספר עוסק או ח.פ.">
                {(id) => (
                  <input
                    id={id}
                    className={`${ui.input} ${ui.ltr}`}
                    inputMode="numeric"
                    autoComplete="off"
                    maxLength={12}
                    value={settings.taxId}
                    onChange={(event) => setSetting('taxId', event.target.value)}
                  />
                )}
              </Field>
            </div>
            <div className={styles.pair}>
              <Field label="תאריך הספירה">
                {(id) => (
                  <input
                    id={id}
                    type="date"
                    className={`${ui.input} ${ui.date}`}
                    value={settings.date}
                    onChange={(event) => setSetting('date', event.target.value)}
                  />
                )}
              </Field>
              <Field label="מקום האחסון" hint="מחסן, חנות, מדף או כתובת.">
                {(id, describedBy) => (
                  <input
                    id={id}
                    className={ui.input}
                    autoComplete="off"
                    maxLength={80}
                    aria-describedby={describedBy}
                    value={settings.location}
                    onChange={(event) => setSetting('location', event.target.value)}
                  />
                )}
              </Field>
            </div>
            {notice ? <p className={styles.notice}>{notice}</p> : null}
            <Field label="שמות הפוקדים" hint="עד 4 שמות עם פסיק ביניהם. אפשר להשאיר ריק ולכתוב ביד.">
              {(id, describedBy) => (
                <input
                  id={id}
                  className={ui.input}
                  autoComplete="off"
                  maxLength={160}
                  aria-describedby={describedBy}
                  value={settings.counters}
                  onChange={(event) => setSetting('counters', event.target.value)}
                />
              )}
            </Field>
          </fieldset>

          <fieldset className={ui.group}>
            <legend className={ui.legend}>מבנה הגיליון</legend>
            <div className={styles.trio}>
              <Field label="שורות בגיליון">
                {(id) => (
                  <select
                    id={id}
                    className={`${ui.input} ${styles.select}`}
                    value={settings.rowsPerSheet}
                    onChange={(event) => {
                      setSetting('rowsPerSheet', Number(event.target.value))
                      setPage(0)
                    }}
                  >
                    {ROWS_PER_SHEET.map((rows) => (
                      <option key={rows} value={rows}>
                        {rows}
                      </option>
                    ))}
                  </select>
                )}
              </Field>
              <Field label="גיליונות ריקים">
                {(id) => (
                  <select
                    id={id}
                    className={`${ui.input} ${styles.select}`}
                    value={settings.blankSheets}
                    onChange={(event) => setSetting('blankSheets', Number(event.target.value))}
                  >
                    {BLANK_SHEET_OPTIONS.map((sheets) => (
                      <option key={sheets} value={sheets}>
                        {sheets}
                      </option>
                    ))}
                  </select>
                )}
              </Field>
              <Field
                label="מספר הגיליון הראשון"
                error={firstSheet === null ? `הקלידו מספר בין 1 ל-${MAX_FIRST_SHEET}.` : undefined}
              >
                {(id, describedBy) => (
                  <input
                    id={id}
                    className={`${ui.input} ${ui.ltr}`}
                    inputMode="numeric"
                    autoComplete="off"
                    maxLength={4}
                    aria-invalid={firstSheet === null ? true : undefined}
                    aria-describedby={describedBy}
                    value={settings.firstSheet}
                    onChange={(event) => setSetting('firstSheet', event.target.value)}
                  />
                )}
              </Field>
            </div>
            <fieldset className={ui.group}>
              <legend className={ui.legend}>עמודות נוספות</legend>
              <div className={ui.options}>
                {TOGGLES.map((toggle) => (
                  <label key={toggle.key} className={ui.option}>
                    <input
                      type="checkbox"
                      className={ui.checkbox}
                      checked={settings[toggle.key]}
                      onChange={(event) => setSetting(toggle.key, event.target.checked)}
                    />
                    <span>{toggle.label}</span>
                  </label>
                ))}
              </div>
              <p className={ui.hint}>
                בלי ״כמות רשומה במערכת״ הספירה עיוורת: הפוקדים סופרים בלי לראות כמה אמור להיות על המדף.
              </p>
            </fieldset>
            <div className={styles.buttonRow}>
              <button type="button" className={ui.primary} onClick={() => print('blank')}>
                <Printer aria-hidden="true" />
                הדפסת טופס ריק
              </button>
            </div>
          </fieldset>

          <fieldset className={ui.group}>
            <legend className={ui.legend}>רשימת פריטים מהחנות (לא חובה)</legend>
            <p className={ui.hint}>
              קובץ ייצוא מוצרים או מלאי מ-Shopify או מ-WooCommerce, או כל קובץ CSV עם עמודת שם. כל שורה הופכת לשורה
              בגיליון, וכל וריאנט מקבל שורה משלו.
            </p>
            <div className={styles.buttonRow}>
              <label className={`${ui.secondary} ${styles.fileButton}`}>
                <Upload aria-hidden="true" />
                בחירת קובץ CSV
                <input
                  type="file"
                  className={styles.visuallyHidden}
                  accept=".csv,.tsv,.txt,text/csv,text/plain"
                  onChange={(event) => void readFile(event)}
                />
              </label>
              <button type="button" className={ui.secondary} onClick={addItem}>
                <Plus aria-hidden="true" />
                הוספת שורה
              </button>
            </div>
            <details className={styles.details}>
              <summary className={styles.summaryToggle}>הדבקת שורות מ-Excel או מ-Google Sheets</summary>
              <div className={styles.paste}>
                <Field label="שורות להדבקה" hint="מעתיקים את השורות מהגיליון יחד עם שורת הכותרות.">
                  {(id, describedBy) => (
                    <textarea
                      id={id}
                      className={ui.textarea}
                      rows={5}
                      spellCheck={false}
                      aria-describedby={describedBy}
                      value={pasted}
                      onChange={(event) => setPasted(event.target.value)}
                    />
                  )}
                </Field>
                <div className={styles.buttonRow}>
                  <button
                    type="button"
                    className={ui.secondary}
                    disabled={!pasted.trim()}
                    onClick={() => receiveRows(parseDelimited(pasted), 'paste')}
                  >
                    הוספת השורות לרשימה
                  </button>
                </div>
              </div>
            </details>

            {pending ? (
              <div className={styles.mapping}>
                {pending.locations.length > 1 ? (
                  <Field label="המיקום שסופרים">
                    {(id) => (
                      <select
                        id={id}
                        className={`${ui.input} ${styles.select}`}
                        value={pending.location}
                        onChange={(event) => setPending({ ...pending, location: event.target.value })}
                      >
                        {pending.locations.map((location) => (
                          <option key={location} value={location}>
                            {location}
                          </option>
                        ))}
                      </select>
                    )}
                  </Field>
                ) : null}
                {pending.mapped ? null : (
                  <ColumnMapping
                    pending={pending}
                    columns={pendingColumns}
                    onColumn={setPendingColumn}
                    onHeader={(first) => setPending({ ...pending, headerIndex: first ? 0 : null })}
                  />
                )}
                <div className={styles.buttonRow}>
                  <button type="button" className={ui.primary} onClick={() => commitImport(pending, pending.mapped)}>
                    הוספה לרשימה
                  </button>
                  <button type="button" className={ui.secondary} onClick={() => setPending(null)}>
                    ביטול
                  </button>
                </div>
              </div>
            ) : null}

            {items.length ? (
              <>
                <nav className={styles.pager} aria-label="גיליונות הספירה">
                  <button
                    type="button"
                    className={styles.pagerButton}
                    disabled={current === 0}
                    onClick={() => setPage(current - 1)}
                  >
                    הקודם
                  </button>
                  <p className={styles.pagerLabel} aria-live="polite">
                    {sheetLabel({ number: (firstSheet ?? 1) + current, page: current + 1, total: pageCount })}
                  </p>
                  <button
                    type="button"
                    className={styles.pagerButton}
                    disabled={current >= pageCount - 1}
                    onClick={() => setPage(current + 1)}
                  >
                    הבא
                  </button>
                </nav>
                <ol ref={listRef} className={styles.items}>
                  {visible.map((item, index) => (
                    <ItemRow
                      key={item.id}
                      item={item}
                      number={firstRow + index + 1}
                      row={index}
                      settings={settings}
                      onText={(key, value) => changeItem(item.id, { [key]: value })}
                      onMark={(mark) => changeItem(item.id, { mark })}
                      onRemove={() => removeItem(item.id)}
                      onKeyDown={moveFocus}
                    />
                  ))}
                </ol>
                <button type="button" className={styles.textButton} onClick={clearItems}>
                  ניקוי הרשימה
                </button>
              </>
            ) : null}
          </fieldset>
        </form>

        <div className={ui.output}>
          <div className={ui.sticky}>
            <div className={styles.summary}>
              <h2 className={ui.outputTitle}>סיכום הספירה</h2>
              {items.length ? (
                <dl className={styles.results}>
                  <SummaryRow term="פריטים ברשימה" value={count(summary.rows)} main />
                  <SummaryRow term="גיליונות להדפסה" value={count(pageCount)} />
                  {summary.countedRows ? <SummaryRow term="שורות שנספרו" value={count(summary.countedRows)} /> : null}
                  {compared ? (
                    <>
                      <SummaryRow term="שורות עם הפרש" value={count(summary.differences.length)} />
                      <SummaryRow term="חסר, ביחידות" value={formatQuantity(summary.shortUnits)} />
                      <SummaryRow term="עודף, ביחידות" value={formatQuantity(summary.extraUnits)} />
                    </>
                  ) : null}
                  {summary.countedValue !== null ? (
                    <SummaryRow term="שווי המלאי שנספר" value={`${formatMoney(summary.countedValue)} ₪`} />
                  ) : null}
                  {summary.valueDelta !== null && summary.differences.length ? (
                    <SummaryRow
                      term="הפרש בשווי"
                      value={
                        <>
                          <Signed value={summary.valueDelta} money /> ₪
                        </>
                      }
                    />
                  ) : null}
                </dl>
              ) : (
                <p className={styles.empty}>
                  בלי רשימת פריטים מדפיסים טופס ריק וממלאים ביד. כשמעלים רשימה מהחנות, כאן מופיעים מספר הגיליונות
                  וההפרשים בין הספירה למערכת.
                </p>
              )}
            </div>
            {topDifferences.length ? (
              <div className={styles.diffs}>
                <h3 className={styles.diffTitle}>ההפרשים הגדולים</h3>
                <ul className={styles.diffList}>
                  {topDifferences.map((difference) => (
                    <li key={difference.item.id} className={styles.diffRow}>
                      <span className={styles.diffName}>{difference.item.name || difference.item.sku}</span>
                      <span className={styles.diffValue}>
                        <Signed value={difference.delta} />
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
            <div className={ui.actions}>
              {items.length ? (
                <button type="button" className={`${ui.primary} ${styles.wide}`} onClick={() => print('count')}>
                  <Printer aria-hidden="true" />
                  הדפסת גיליונות הספירה
                </button>
              ) : null}
              {summary.countedRows ? (
                <button type="button" className={`${ui.secondary} ${styles.wide}`} onClick={() => print('result')}>
                  <Printer aria-hidden="true" />
                  הדפסה עם הכמויות שנספרו
                </button>
              ) : null}
              <button type="button" className={`${ui.secondary} ${styles.wide}`} onClick={exportCsv}>
                <Download aria-hidden="true" />
                {items.length ? 'הורדה ל-Excel (CSV)' : 'תבנית ל-Excel (CSV)'}
              </button>
            </div>
            <p className={ui.status} role="status" aria-live="polite">
              {status}
            </p>
            <p className={ui.note}>
              הקובץ והרשימה נשארים בדפדפן שלכם ולא נשלחים לשרת. הכלי מניח ששנת המס מסתיימת ב-31 בדצמבר.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
