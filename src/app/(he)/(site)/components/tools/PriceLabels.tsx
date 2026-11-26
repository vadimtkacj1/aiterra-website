'use client'

import { useEffect, useId, useMemo, useRef, useState, type ChangeEvent, type ReactNode } from 'react'
import { Plus, Printer, Trash2, Upload } from 'lucide-react'
import { decodeText, parseDelimited } from '@/lib/inventory-count'
import {
  COLUMN_ROLES,
  CUSTOM_SHEET,
  MAX_COPIES,
  MAX_ITEMS,
  MAX_LABELS,
  PART_LABELS,
  ROLE_LABELS,
  SHEET_PRESETS,
  SKIP_LABELS,
  buildSheet,
  defaultCustom,
  defaultSettings,
  emptyItem,
  findHeader,
  guessColumns,
  headerStructure,
  isCompleteHeader,
  mayBeHeader,
  sheetLayout,
  tableToItems,
  type ColumnMap,
  type ColumnRole,
  type CopiesMode,
  type CustomSheet,
  type FileStructure,
  type ImportResult,
  type ItemText,
  type LabelItem,
  type LabelReport,
  type LabelSettings,
  type SkipReason,
} from '@/lib/price-labels'
import ui from './toolUi.module.css'
import styles from './PriceLabels.module.css'

type Draft = { settings: LabelSettings; items: LabelItem[] }
type ImportSource = 'file' | 'paste'
type PendingImport = { rows: string[][]; map: ColumnMap; headerIndex: number | null; source: ImportSource }
type Toggle = 'showName' | 'showVariant' | 'showPrice' | 'showBarcode' | 'showSku'

const STORAGE_KEY = 'aiterra-price-labels-v1'
const SAVE_DELAY_MS = 400
const MAX_FILE_BYTES = 25 * 1024 * 1024
const ITEMS_PER_PAGE = 20
const SAMPLE_ROWS = 50
const SAMPLE_LENGTH = 24
const NO_COLUMN = -1
const EXAMPLE_LENGTH = 40
const A4_PX = { width: 794, height: 1123 }
const SKIP_REASONS: SkipReason[] = ['parent', 'noProduct', 'empty']

const TOGGLES: { key: Toggle; label: string }[] = [
  { key: 'showName', label: 'שם המוצר' },
  { key: 'showVariant', label: 'וריאנט (מידה, צבע)' },
  { key: 'showPrice', label: 'מחיר' },
  { key: 'showBarcode', label: 'ברקוד' },
  { key: 'showSku', label: 'מק״ט בטקסט' },
]

const COPIES_OPTIONS: { value: CopiesMode; label: string }[] = [
  { value: 'one', label: 'מדבקה אחת לכל מוצר' },
  { value: 'fixed', label: 'אותו מספר לכל מוצר' },
  { value: 'stock', label: 'לפי הכמות במלאי' },
]

const CUSTOM_FIELDS: { key: keyof CustomSheet; label: string }[] = [
  { key: 'columns', label: 'עמודות' },
  { key: 'rows', label: 'שורות' },
  { key: 'labelWidth', label: 'רוחב מדבקה (מ״מ)' },
  { key: 'labelHeight', label: 'גובה מדבקה (מ״מ)' },
  { key: 'marginTop', label: 'שוליים למעלה (מ״מ)' },
  { key: 'marginSide', label: 'שוליים בצד (מ״מ)' },
]

const ITEM_FIELDS: { key: Exclude<ItemText, 'name'>; label: string; ltr?: boolean; numeric?: boolean }[] = [
  { key: 'variant', label: 'וריאנט' },
  { key: 'price', label: 'מחיר ₪', ltr: true, numeric: true },
  { key: 'sku', label: 'מק״ט', ltr: true },
  { key: 'barcode', label: 'ברקוד', ltr: true },
  { key: 'stock', label: 'במלאי', ltr: true, numeric: true },
]

const SAMPLE_ITEMS: Omit<LabelItem, 'id'>[] = [
  { name: 'חולצת פשתן', variant: 'M / לבן', price: '149.90', sku: 'LS-M-W', barcode: '', stock: '4' },
  { name: 'ספל קרמיקה בעבודת יד', variant: '', price: '45', sku: 'MUG-01', barcode: '', stock: '12' },
  { name: 'ריבת תות ביתית', variant: '250 גרם', price: '32', sku: 'JAM-250', barcode: '', stock: '8' },
]

const isText = (value: unknown): value is string => typeof value === 'string'
const textOr = (value: unknown, fallback: string, max: number) => (isText(value) ? value.slice(0, max) : fallback)
const flagOr = (value: unknown, fallback: boolean) => (typeof value === 'boolean' ? value : fallback)
const count = (value: number) => value.toLocaleString('he-IL')
const shortExample = (name: string) => (name.length > EXAMPLE_LENGTH ? `${name.slice(0, EXAMPLE_LENGTH)}…` : name)
const isCopiesMode = (value: unknown): value is CopiesMode =>
  COPIES_OPTIONS.some((option) => option.value === value)
const isSheetId = (value: unknown): value is string =>
  isText(value) && (value === CUSTOM_SHEET || SHEET_PRESETS.some((sheet) => sheet.id === value))

function readSettings(stored: Record<string, unknown>): LabelSettings {
  const base = defaultSettings()
  const custom = (stored.custom ?? {}) as Record<string, unknown>
  const baseCustom = defaultCustom()
  return {
    sheetId: isSheetId(stored.sheetId) ? stored.sheetId : base.sheetId,
    custom: {
      columns: textOr(custom.columns, baseCustom.columns, 6),
      rows: textOr(custom.rows, baseCustom.rows, 6),
      labelWidth: textOr(custom.labelWidth, baseCustom.labelWidth, 8),
      labelHeight: textOr(custom.labelHeight, baseCustom.labelHeight, 8),
      marginTop: textOr(custom.marginTop, baseCustom.marginTop, 8),
      marginSide: textOr(custom.marginSide, baseCustom.marginSide, 8),
    },
    skip: textOr(stored.skip, base.skip, 4),
    offsetX: textOr(stored.offsetX, base.offsetX, 6),
    offsetY: textOr(stored.offsetY, base.offsetY, 6),
    headline: textOr(stored.headline, base.headline, 60),
    showName: flagOr(stored.showName, base.showName),
    showVariant: flagOr(stored.showVariant, base.showVariant),
    showPrice: flagOr(stored.showPrice, base.showPrice),
    showSku: flagOr(stored.showSku, base.showSku),
    showBarcode: flagOr(stored.showBarcode, base.showBarcode),
    copiesMode: isCopiesMode(stored.copiesMode) ? stored.copiesMode : base.copiesMode,
    copies: textOr(stored.copies, base.copies, 4),
  }
}

function readItems(value: unknown): LabelItem[] {
  if (!Array.isArray(value)) return []
  return value.slice(0, MAX_ITEMS).flatMap((entry, index) => {
    if (typeof entry !== 'object' || entry === null) return []
    const item = entry as Record<string, unknown>
    return [
      {
        id: index + 1,
        name: textOr(item.name, '', 200),
        variant: textOr(item.variant, '', 120),
        price: textOr(item.price, '', 16),
        sku: textOr(item.sku, '', 60),
        barcode: textOr(item.barcode, '', 60),
        stock: textOr(item.stock, '', 10),
      },
    ]
  })
}

function readDraft(): Draft | null {
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY)
    if (!saved) return null
    const data = JSON.parse(saved) as Record<string, unknown>
    return { settings: readSettings((data.settings ?? {}) as Record<string, unknown>), items: readItems(data.items) }
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

function importMessage(result: ImportResult, added: number) {
  const skipped = SKIP_REASONS.filter((reason) => result.skipped[reason] > 0).map(
    (reason) => `${count(result.skipped[reason])}: ${SKIP_LABELS[reason]}`,
  )
  const parts = [`נקראו ${count(result.read)} שורות, נוספו ${count(added)} מוצרים.`]
  if (result.salePrices) parts.push(`ב-${count(result.salePrices)} מוצרים נלקח מחיר המבצע.`)
  if (skipped.length) parts.push(`לא נכנסו: ${skipped.join('; ')}.`)
  const overflow = result.truncated + (result.items.length - added)
  if (overflow > 0) parts.push(`${count(overflow)} שורות לא נכנסו כי הרשימה מוגבלת ל-${count(MAX_ITEMS)} מוצרים.`)
  return parts.join(' ')
}

function reportWarnings(report: LabelReport, settings: LabelSettings) {
  const warnings: string[] = []
  if (report.dropped.length) {
    const parts = report.dropped.map((part) => PART_LABELS[part]).join(', ')
    warnings.push(`במדבקה בגודל הזה אין מקום ל: ${parts}. בחרו מדבקה גדולה יותר או פחות פרטים.`)
  }
  if (report.cutNames) {
    warnings.push(`${count(report.cutNames)} שמות ארוכים קוצרו, ובסופם מודפס ״…״. למשל: ${report.examples.map(shortExample).join(' | ')}`)
  }
  if (report.cutOther) warnings.push(`ב-${count(report.cutOther)} מדבקות קוצר וריאנט, מק״ט או כותרת, עם ״…״ בסוף.`)
  if (settings.showPrice && report.noPrice) warnings.push(`ל-${count(report.noPrice)} מוצרים אין מחיר תקין, והמדבקה שלהם יוצאת בלי מחיר.`)
  if (report.invalidBarcodes) {
    warnings.push(`${count(report.invalidBarcodes)} ברקודים לא תקינים (אורך או ספרת ביקורת). במקומם הודפס ברקוד של המק״ט, אם יש.`)
  }
  if (report.noBarcode) warnings.push(`${count(report.noBarcode)} מדבקות בלי ברקוד: אין ברקוד ואין מק״ט באותיות לועזיות וספרות, או שאין מקום.`)
  if (report.narrowBarcodes) {
    warnings.push(`ב-${count(report.narrowBarcodes)} מדבקות הברקוד דחוס: הפס הצר קטן מ-0.264 מ״מ. סרקו מדבקה אחת לפני שמדביקים את כולן.`)
  }
  if (report.zeroStock) warnings.push(`${count(report.zeroStock)} מוצרים עם מלאי 0 או פחות לא הודפסו.`)
  if (report.noStock) warnings.push(`ל-${count(report.noStock)} מוצרים אין כמות במלאי, והודפסה להם מדבקה אחת.`)
  if (report.limited) warnings.push(`הודפסו רק ${count(MAX_LABELS)} המדבקות הראשונות. הדפיסו את השאר בפעם נוספת.`)
  return warnings
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

function SummaryRow({ term, value, main = false }: { term: string; value: ReactNode; main?: boolean }) {
  return (
    <div className={main ? `${styles.resultRow} ${styles.main}` : styles.resultRow}>
      <dt className={styles.term}>{term}</dt>
      <dd className={styles.value}>{value}</dd>
    </div>
  )
}

function ItemRow({
  item,
  number,
  showStock,
  onText,
  onRemove,
}: {
  item: LabelItem
  number: number
  showStock: boolean
  onText: (key: ItemText, value: string) => void
  onRemove: () => void
}) {
  return (
    <li className={styles.item}>
      <span className={styles.rowNumber}>{number}</span>
      <input
        className={`${ui.input} ${styles.nameInput}`}
        aria-label={`שם המוצר, שורה ${number}`}
        placeholder="שם המוצר"
        autoComplete="off"
        maxLength={200}
        value={item.name}
        onChange={(event) => onText('name', event.target.value)}
      />
      <button type="button" className={styles.remove} aria-label={`מחיקת שורה ${number}`} onClick={onRemove}>
        <Trash2 aria-hidden="true" />
      </button>
      <div className={styles.minis}>
        {ITEM_FIELDS.filter((field) => field.key !== 'stock' || showStock).map((field) => (
          <label key={field.key} className={styles.mini}>
            <span>{field.label}</span>
            <input
              className={`${ui.input} ${styles.miniInput}${field.ltr ? ` ${ui.ltr}` : ''}`}
              inputMode={field.numeric ? 'decimal' : undefined}
              autoComplete="off"
              spellCheck={false}
              maxLength={field.key === 'variant' ? 120 : 60}
              value={item[field.key]}
              onChange={(event) => onText(field.key, event.target.value)}
            />
          </label>
        ))}
      </div>
    </li>
  )
}

function ColumnMapping({
  pending,
  onColumn,
  onHeader,
}: {
  pending: PendingImport
  onColumn: (role: ColumnRole, index: number) => void
  onHeader: (first: boolean) => void
}) {
  const columns = Math.max(...pending.rows.slice(0, SAMPLE_ROWS).map((row) => row.length))
  const sample = pending.rows[pending.headerIndex ?? 0] ?? []
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
                    {`עמודה ${index + 1}: ${(sample[index] ?? '').slice(0, SAMPLE_LENGTH)}`}
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

function SheetPreview({ html, pages }: { html: string; pages: number }) {
  const boxRef = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(0.4)
  useEffect(() => {
    const box = boxRef.current
    if (!box) return
    const update = () => setScale(box.clientWidth / A4_PX.width)
    update()
    const observer = new ResizeObserver(update)
    observer.observe(box)
    return () => observer.disconnect()
  }, [])
  return (
    <figure className={styles.preview}>
      <div ref={boxRef} className={styles.previewBox} style={{ height: `${A4_PX.height * scale}px` }}>
        <iframe
          title="תצוגה מקדימה של הדף הראשון"
          className={styles.previewFrame}
          sandbox=""
          srcDoc={html}
          tabIndex={-1}
          style={{ width: `${A4_PX.width}px`, height: `${A4_PX.height}px`, transform: `scale(${scale})` }}
        />
      </div>
      <figcaption className={styles.previewCaption}>
        {pages > 1 ? `הדף הראשון מתוך ${count(pages)}. הקווים המקווקווים לא מודפסים.` : 'הקווים המקווקווים לא מודפסים.'}
      </figcaption>
    </figure>
  )
}

export default function PriceLabels() {
  const [draft, setDraft] = useState<Draft>(() => ({ settings: defaultSettings(), items: [] }))
  const [restored, setRestored] = useState(false)
  const [page, setPage] = useState(0)
  const [pasted, setPasted] = useState('')
  const [pending, setPending] = useState<PendingImport | null>(null)
  const [status, setStatus] = useState('')
  const nextId = useRef(1)

  const { settings, items } = draft
  const layout = useMemo(() => sheetLayout(settings), [settings])
  const preview = useMemo(
    () => (items.length ? buildSheet(items, settings, { outline: true, maxPages: 1, preview: true }) : null),
    [items, settings],
  )
  const report = preview && !('error' in preview) ? preview.report : null
  const warnings = report ? reportWarnings(report, settings) : []
  const pageCount = Math.max(1, Math.ceil(items.length / ITEMS_PER_PAGE))
  const current = Math.min(page, pageCount - 1)
  const firstRow = current * ITEMS_PER_PAGE
  const visible = items.slice(firstRow, firstRow + ITEMS_PER_PAGE)
  const perPage = layout.status === 'ok' ? layout.perPage : 0

  useEffect(() => {
    const next = readDraft()
    if (next) {
      nextId.current = next.items.length + 1
      setDraft(next)
    }
    setRestored(true)
  }, [])

  useEffect(() => {
    if (!restored) return
    const timer = window.setTimeout(() => writeDraft(draft), SAVE_DELAY_MS)
    return () => window.clearTimeout(timer)
  }, [draft, restored])

  const setSetting = <K extends keyof LabelSettings>(key: K, value: LabelSettings[K]) =>
    setDraft((state) => ({ ...state, settings: { ...state.settings, [key]: value } }))

  const setCustom = (key: keyof CustomSheet, value: string) =>
    setDraft((state) => ({ ...state, settings: { ...state.settings, custom: { ...state.settings.custom, [key]: value } } }))

  const changeItem = (id: number, key: ItemText, value: string) =>
    setDraft((state) => ({
      ...state,
      items: state.items.map((item) => (item.id === id ? { ...item, [key]: value } : item)),
    }))

  const removeItem = (id: number) =>
    setDraft((state) => ({ ...state, items: state.items.filter((item) => item.id !== id) }))

  const appendItems = (added: Omit<LabelItem, 'id'>[]) => {
    const room = Math.max(0, MAX_ITEMS - items.length)
    const accepted = added.slice(0, room).map((item, index) => ({ ...item, id: nextId.current + index }))
    nextId.current += accepted.length
    setDraft((state) => ({ ...state, items: [...state.items, ...accepted] }))
    return accepted.length
  }

  const addItem = () => {
    if (items.length >= MAX_ITEMS) {
      setStatus(`הרשימה מלאה: עד ${count(MAX_ITEMS)} מוצרים.`)
      return
    }
    appendItems([emptyItem(0)])
    setPage(Math.floor(items.length / ITEMS_PER_PAGE))
  }

  const addSample = () => {
    const added = appendItems(SAMPLE_ITEMS)
    setStatus(`נוספו ${count(added)} מוצרים לדוגמה. אפשר לערוך או למחוק אותם.`)
  }

  const clearItems = () => {
    if (!window.confirm('למחוק את כל המוצרים מהרשימה?')) return
    nextId.current = 1
    setDraft((state) => ({ ...state, items: [] }))
    setPage(0)
    setStatus('הרשימה נמחקה')
  }

  const commitImport = (request: PendingImport, structure: FileStructure, detected: boolean) => {
    const result = tableToItems(request.rows, request.map, request.headerIndex, nextId.current, structure)
    const added = appendItems(result.items)
    setPending(null)
    setPasted('')
    setStatus(importMessage(result, added))
    window.gtag?.('event', 'price_labels_import', { rows: added, source: request.source, detected })
  }

  const receiveRows = (rows: string[][], source: ImportSource) => {
    if (!rows.length) {
      setStatus('לא נמצאו שורות.')
      return
    }
    const header = findHeader(rows)
    if (header && isCompleteHeader(header)) {
      commitImport({ rows, map: header.map, headerIndex: header.index, source }, header.structure, true)
      return
    }
    if (header) {
      setPending({ rows, map: header.map, headerIndex: header.index, source })
      setStatus('לא מצאנו עמודת מחיר בשם מוכר. בחרו איזו עמודה היא המחיר, או ״אין עמודה כזו״, ולחצו ״הוספה לרשימה״.')
      return
    }
    const headerIndex = mayBeHeader(rows[0]) ? 0 : null
    setPending({ rows, map: { name: 0, ...guessColumns(rows[0]) }, headerIndex, source })
    setStatus('לא זיהינו את הכותרות. בחרו איזו עמודה היא שם המוצר, המחיר והמק״ט, ובדקו אם השורה הראשונה היא כותרות.')
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
      setStatus('הקובץ גדול מ-25MB. ייצאו רק את המוצרים שצריך להם מדבקות.')
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

  const confirmPending = (request: PendingImport) => {
    const structure = request.headerIndex === null ? { options: [] } : headerStructure(request.rows[request.headerIndex])
    commitImport(request, structure, false)
  }

  const print = (test: boolean) => {
    const sheet = buildSheet(items, settings, { outline: test })
    if ('error' in sheet) {
      setStatus(sheet.error)
      return
    }
    if (!sheet.report.labels) {
      setStatus('אין מדבקות להדפסה. בדקו את הכמויות במלאי או הוסיפו מוצרים.')
      return
    }
    openPrint(sheet.html)
    setStatus('נפתח חלון ההדפסה. בחרו נייר A4 וגודל בפועל (100%), בלי ״התאמה לדף״.')
    window.gtag?.('event', 'price_labels_print', {
      labels: sheet.report.labels,
      pages: sheet.report.pages,
      sheet: settings.sheetId,
      test,
    })
  }

  return (
    <section className={`${ui.tool} ${styles.root}`} aria-label="מדבקות מחיר להדפסה" data-clarity-mask="true">
      <div className={`${ui.inner} ${styles.layout}`}>
        <form className={ui.form} onSubmit={(event) => event.preventDefault()}>
          <fieldset className={ui.group}>
            <legend className={ui.legend}>דף המדבקות</legend>
            <Field label="סוג הדף" hint="המידות כתובות על אריזת הדף. אם אין כאן את הדף שלכם, מודדים בסרגל ובוחרים ״מידות אחרות״.">
              {(id, describedBy) => (
                <select
                  id={id}
                  className={`${ui.input} ${styles.select}`}
                  aria-describedby={describedBy}
                  value={settings.sheetId}
                  onChange={(event) => setSetting('sheetId', event.target.value)}
                >
                  <optgroup label="דפים בתבנית Avery">
                    {SHEET_PRESETS.filter((sheet) => sheet.group === 'avery').map((sheet) => (
                      <option key={sheet.id} value={sheet.id}>
                        {sheet.label}
                      </option>
                    ))}
                  </optgroup>
                  <optgroup label="דף מחולק עד הקצה">
                    {SHEET_PRESETS.filter((sheet) => sheet.group === 'full').map((sheet) => (
                      <option key={sheet.id} value={sheet.id}>
                        {sheet.label}
                      </option>
                    ))}
                  </optgroup>
                  <option value={CUSTOM_SHEET}>מידות אחרות</option>
                </select>
              )}
            </Field>
            {settings.sheetId === CUSTOM_SHEET ? (
              <div className={styles.trio}>
                {CUSTOM_FIELDS.map((field) => (
                  <Field key={field.key} label={field.label}>
                    {(id) => (
                      <input
                        id={id}
                        className={`${ui.input} ${ui.ltr}`}
                        inputMode="decimal"
                        autoComplete="off"
                        maxLength={8}
                        value={settings.custom[field.key]}
                        onChange={(event) => setCustom(field.key, event.target.value)}
                      />
                    )}
                  </Field>
                ))}
              </div>
            ) : null}
            {layout.status === 'invalid' ? <p className={styles.error}>{layout.error}</p> : null}
            <Field
              label="מדבקות שכבר נתלשו מהדף"
              hint={`ההדפסה מתחילה מהמדבקה הפנויה הבאה, מימין לשמאל ומלמעלה למטה.${perPage ? ` בדף יש ${perPage} מדבקות.` : ''}`}
            >
              {(id, describedBy) => (
                <input
                  id={id}
                  className={`${ui.input} ${ui.ltr} ${styles.short}`}
                  inputMode="numeric"
                  autoComplete="off"
                  maxLength={3}
                  aria-describedby={describedBy}
                  value={settings.skip}
                  onChange={(event) => setSetting('skip', event.target.value)}
                />
              )}
            </Field>
            <details className={styles.details}>
              <summary className={styles.summaryToggle}>ההדפסה זזה מהמדבקות? כיול במילימטרים</summary>
              <div className={styles.pair}>
                <Field label="הזזה ימינה (מינוס: שמאלה)">
                  {(id) => (
                    <input
                      id={id}
                      className={`${ui.input} ${ui.ltr}`}
                      inputMode="decimal"
                      autoComplete="off"
                      maxLength={6}
                      value={settings.offsetX}
                      onChange={(event) => setSetting('offsetX', event.target.value)}
                    />
                  )}
                </Field>
                <Field label="הזזה למטה (מינוס: למעלה)">
                  {(id) => (
                    <input
                      id={id}
                      className={`${ui.input} ${ui.ltr}`}
                      inputMode="decimal"
                      autoComplete="off"
                      maxLength={6}
                      value={settings.offsetY}
                      onChange={(event) => setSetting('offsetY', event.target.value)}
                    />
                  )}
                </Field>
              </div>
            </details>
          </fieldset>

          <fieldset className={ui.group}>
            <legend className={ui.legend}>מה מודפס על המדבקה</legend>
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
            <Field label="שורה קבועה בראש כל מדבקה (לא חובה)" hint="שם החנות, ״תוצרת בית״ או אתר.">
              {(id, describedBy) => (
                <input
                  id={id}
                  className={ui.input}
                  autoComplete="off"
                  maxLength={60}
                  aria-describedby={describedBy}
                  value={settings.headline}
                  onChange={(event) => setSetting('headline', event.target.value)}
                />
              )}
            </Field>
            <div className={styles.pair}>
              <Field label="כמה מדבקות מכל מוצר">
                {(id) => (
                  <select
                    id={id}
                    className={`${ui.input} ${styles.select}`}
                    value={settings.copiesMode}
                    onChange={(event) => setSetting('copiesMode', event.target.value as CopiesMode)}
                  >
                    {COPIES_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                )}
              </Field>
              {settings.copiesMode === 'fixed' ? (
                <Field label={`מדבקות לכל מוצר (עד ${MAX_COPIES})`}>
                  {(id) => (
                    <input
                      id={id}
                      className={`${ui.input} ${ui.ltr}`}
                      inputMode="numeric"
                      autoComplete="off"
                      maxLength={3}
                      value={settings.copies}
                      onChange={(event) => setSetting('copies', event.target.value)}
                    />
                  )}
                </Field>
              ) : null}
            </div>
          </fieldset>

          <fieldset className={ui.group}>
            <legend className={ui.legend}>המוצרים</legend>
            <p className={ui.hint}>
              קובץ ייצוא מוצרים מ-Shopify או מ-WooCommerce, כל קובץ CSV עם עמודת שם או מק״ט, או הקלדה ביד. כל וריאנט
              מקבל מדבקה משלו.
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
                הוספת מוצר
              </button>
              {items.length ? null : (
                <button type="button" className={ui.secondary} onClick={addSample}>
                  דוגמה
                </button>
              )}
            </div>
            <details className={styles.details}>
              <summary className={styles.summaryToggle}>הדבקת שורות מ-Excel או מ-Google Sheets</summary>
              <div className={styles.paste}>
                <Field label="שורות להדבקה" hint="מעתיקים יחד עם שורת הכותרות, למשל: שם המוצר, מחיר, מק״ט.">
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
                    הוספת השורות
                  </button>
                </div>
              </div>
            </details>

            {pending ? (
              <div className={styles.mapping}>
                <ColumnMapping
                  pending={pending}
                  onColumn={setPendingColumn}
                  onHeader={(first) => setPending({ ...pending, headerIndex: first ? (pending.headerIndex ?? 0) : null })}
                />
                <div className={styles.buttonRow}>
                  <button type="button" className={ui.primary} onClick={() => confirmPending(pending)}>
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
                {pageCount > 1 ? (
                  <nav className={styles.pager} aria-label="עמודי רשימת המוצרים">
                    <button
                      type="button"
                      className={styles.pagerButton}
                      disabled={current === 0}
                      onClick={() => setPage(current - 1)}
                    >
                      הקודם
                    </button>
                    <p className={styles.pagerLabel} aria-live="polite">
                      {`${count(firstRow + 1)}–${count(Math.min(items.length, firstRow + ITEMS_PER_PAGE))} מתוך ${count(items.length)}`}
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
                ) : null}
                <ol className={styles.items}>
                  {visible.map((item, index) => (
                    <ItemRow
                      key={item.id}
                      item={item}
                      number={firstRow + index + 1}
                      showStock={settings.copiesMode === 'stock'}
                      onText={(key, value) => changeItem(item.id, key, value)}
                      onRemove={() => removeItem(item.id)}
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
            <h2 className={ui.outputTitle}>הדף להדפסה</h2>
            {preview && 'error' in preview ? (
              <p className={styles.error}>{preview.error}</p>
            ) : report && preview ? (
              <>
                <dl className={styles.results}>
                  <SummaryRow term="מדבקות" value={count(report.labels)} main />
                  <SummaryRow term="דפים" value={count(report.pages)} />
                </dl>
                {report.labels ? <SheetPreview html={preview.html} pages={report.pages} /> : null}
                {warnings.length ? (
                  <ul className={styles.warnings}>
                    {warnings.map((warning) => (
                      <li key={warning}>{warning}</li>
                    ))}
                  </ul>
                ) : null}
              </>
            ) : (
              <p className={styles.empty}>
                מוסיפים מוצרים מקובץ, מהדבקה או ביד, ורואים כאן את הדף הראשון כמו שהוא יודפס.
              </p>
            )}
            <div className={ui.actions}>
              <button
                type="button"
                className={`${ui.primary} ${styles.wide}`}
                disabled={!report?.labels}
                onClick={() => print(false)}
              >
                <Printer aria-hidden="true" />
                הדפסת המדבקות
              </button>
              <button
                type="button"
                className={`${ui.secondary} ${styles.wide}`}
                disabled={!report?.labels}
                onClick={() => print(true)}
              >
                <Printer aria-hidden="true" />
                דף ניסיון עם קווי מתאר
              </button>
            </div>
            <p className={ui.status} role="status" aria-live="polite">
              {status}
            </p>
            <p className={ui.note}>
              הקובץ והרשימה נשארים בדפדפן שלכם ולא נשלחים לשרת. הרשימה נשמרת במכשיר עד שלוחצים ״ניקוי הרשימה״.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
