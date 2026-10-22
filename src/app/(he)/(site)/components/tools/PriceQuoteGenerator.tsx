'use client'

import { useEffect, useId, useMemo, useRef, useState, type ChangeEvent, type ReactNode } from 'react'
import { ArrowDown, ArrowUp, Copy, Download, Plus, Printer, Trash2 } from 'lucide-react'
import {
  GENERATOR_URL,
  MAX_ITEMS,
  NOT_AN_INVOICE,
  buildQuote,
  businessLine,
  clientIdLine,
  computeLine,
  defaultQuoteInput,
  emptyItem,
  entityTypes,
  formatDate,
  formatPercent,
  formatQuantity,
  formatShekels,
  formatSigned,
  priceBasis,
  quoteDocument,
  quoteFileTitle,
  quoteToText,
  readPercent,
  readPrice,
  readQuantity,
  readValidDays,
  readVatRate,
  safeLogo,
  totalRows,
  type DiscountType,
  type EntityType,
  type QuoteInput,
  type QuoteItem,
  type QuoteModel,
  type VatMode,
} from '@/lib/price-quote'
import ui from './toolUi.module.css'
import styles from './PriceQuoteGenerator.module.css'

type TextKey = {
  [K in keyof QuoteInput]: QuoteInput[K] extends string ? K : never
}[keyof QuoteInput]

type ItemKey = 'description' | 'quantity' | 'unitPrice' | 'discount'
type FocusTarget = 'description' | 'up' | 'down'
type OutputFormat = 'pdf' | 'html' | 'text'

const STORAGE_KEY = 'aiterra-price-quote-v1'
const LOGO_TYPES = ['image/png', 'image/jpeg', 'image/webp', 'image/svg+xml']
const MAX_LOGO_BYTES = 5 * 1024 * 1024
const LOGO_BOX = { width: 600, height: 300 }

const localToday = () => {
  const now = new Date()
  const pad = (value: number) => String(value).padStart(2, '0')
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`
}

const isText = (value: unknown): value is string => typeof value === 'string'

function restoreItems(value: unknown): QuoteItem[] {
  if (!Array.isArray(value)) return []
  return value
    .filter((item): item is Record<string, unknown> => typeof item === 'object' && item !== null)
    .slice(0, MAX_ITEMS)
    .map((item, index) => ({
      id: index + 1,
      description: isText(item.description) ? item.description : '',
      quantity: isText(item.quantity) ? item.quantity : '1',
      unitPrice: isText(item.unitPrice) ? item.unitPrice : '',
      discount: isText(item.discount) ? item.discount : '',
    }))
}

function readDraft(today: string): QuoteInput | null {
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY)
    if (!saved) return null
    const data = JSON.parse(saved) as Record<string, unknown>
    const base = defaultQuoteInput(today)
    const draft: Record<string, unknown> = { ...base }
    for (const key of Object.keys(base) as (keyof QuoteInput)[]) {
      if (key !== 'items' && typeof data[key] === typeof base[key]) draft[key] = data[key]
    }
    const input = draft as QuoteInput
    const items = restoreItems(data.items)
    return {
      ...input,
      items: items.length ? items : base.items,
      entityType: entityTypes.some((type) => type.id === input.entityType) ? input.entityType : base.entityType,
      vatMode: input.vatMode === 'included' ? 'included' : 'before',
      discountType: input.discountType === 'amount' ? 'amount' : 'percent',
      logo: safeLogo(input.logo),
    }
  } catch {
    return null
  }
}

function writeDraft(input: QuoteInput) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(input))
    return true
  } catch {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...input, logo: '' }))
      return true
    } catch {
      return false
    }
  }
}

function readFile(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader()
    reader.onerror = () => reject(new Error('read'))
    reader.onload = () => (isText(reader.result) ? resolve(reader.result) : reject(new Error('read')))
    reader.readAsDataURL(file)
  })
}

function loadImage(src: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image()
    image.onload = () => resolve(image)
    image.onerror = () => reject(new Error('decode'))
    image.src = src
  })
}

async function prepareLogo(file: File) {
  const source = await readFile(file)
  const image = await loadImage(source)
  const { naturalWidth: width, naturalHeight: height } = image
  if (!width || !height) return safeLogo(source)
  const scale = Math.min(1, LOGO_BOX.width / width, LOGO_BOX.height / height)
  const canvas = document.createElement('canvas')
  canvas.width = Math.max(1, Math.round(width * scale))
  canvas.height = Math.max(1, Math.round(height * scale))
  const context = canvas.getContext('2d')
  if (!context) return safeLogo(source)
  context.drawImage(image, 0, 0, canvas.width, canvas.height)
  return canvas.toDataURL('image/png')
}

const fileName = (input: QuoteInput) => `${quoteFileTitle(input).replace(/[\\/:*?"<>|]+/g, '-')}.html`

function Field({
  label,
  hint,
  error,
  children,
}: {
  label: string
  hint?: string
  error?: string
  children: (id: string, describedBy?: string) => ReactNode
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

function NumberField({
  label,
  value,
  error,
  onChange,
  numeric = false,
  className,
}: {
  label: string
  value: string
  error: string
  onChange: (event: ChangeEvent<HTMLInputElement>) => void
  numeric?: boolean
  className?: string
}) {
  return (
    <Field label={label} error={error}>
      {(id, describedBy) => (
        <input
          id={id}
          className={`${ui.input} ${ui.ltr} ${className ?? ''}`}
          inputMode={numeric ? 'numeric' : 'decimal'}
          autoComplete="off"
          spellCheck={false}
          value={value}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          onChange={onChange}
        />
      )}
    </Field>
  )
}

function ItemRow({
  item,
  index,
  count,
  onChange,
  onMove,
  onRemove,
}: {
  item: QuoteItem
  index: number
  count: number
  onChange: (key: ItemKey) => (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
  onMove: (delta: -1 | 1) => void
  onRemove: () => void
}) {
  const descriptionId = useId()
  const number = index + 1
  const line = computeLine(item)
  return (
    <fieldset className={styles.item} data-item={item.id}>
      <legend className={styles.itemLegend}>פריט {number}</legend>
      {count > 1 ? (
        <div className={styles.itemActions}>
          <button
            type="button"
            className={styles.iconButton}
            data-focus="up"
            disabled={index === 0}
            aria-label={`העברת פריט ${number} למעלה`}
            onClick={() => onMove(-1)}
          >
            <ArrowUp aria-hidden="true" />
          </button>
          <button
            type="button"
            className={styles.iconButton}
            data-focus="down"
            disabled={index === count - 1}
            aria-label={`העברת פריט ${number} למטה`}
            onClick={() => onMove(1)}
          >
            <ArrowDown aria-hidden="true" />
          </button>
          <button
            type="button"
            className={`${styles.iconButton} ${styles.danger}`}
            aria-label={`הסרת פריט ${number}`}
            onClick={onRemove}
          >
            <Trash2 aria-hidden="true" />
          </button>
        </div>
      ) : null}
      <div className={styles.itemFields}>
        <div className={ui.field}>
          <label htmlFor={descriptionId} className={ui.label}>
            תיאור
          </label>
          <textarea
            id={descriptionId}
            data-focus="description"
            rows={2}
            className={`${ui.input} ${ui.textarea} ${styles.description}`}
            value={item.description}
            onChange={onChange('description')}
          />
        </div>
        <div className={styles.numbers}>
          <NumberField
            label="כמות"
            value={item.quantity}
            error={readQuantity(item.quantity).error}
            onChange={onChange('quantity')}
          />
          <NumberField
            label="מחיר ליחידה (₪)"
            value={item.unitPrice}
            error={readPrice(item.unitPrice).error}
            onChange={onChange('unitPrice')}
          />
          <NumberField
            label="הנחה (%)"
            value={item.discount}
            error={readPercent(item.discount).error}
            onChange={onChange('discount')}
          />
          <p className={styles.lineTotal}>
            <span className={ui.label}>סה״כ לשורה</span>
            <span className={styles.lineValue}>{formatShekels(line.total)}</span>
          </p>
        </div>
      </div>
    </fieldset>
  )
}

export function QuotePreview({ model, headingLevel = 3 }: { model: QuoteModel; headingLevel?: 3 | 4 }) {
  const { input } = model
  const Title = headingLevel === 3 ? 'h3' : 'h4'
  const Label = headingLevel === 3 ? 'h4' : 'h5'
  const logo = safeLogo(input.logo)
  const join = (parts: string[]) => parts.map((part) => part.trim()).filter(Boolean).join(' · ')
  const contact = join([input.phone, input.email, input.address])
  const client = join([input.clientPhone, input.clientEmail, input.clientAddress])
  const meta = [
    ['מספר', input.quoteNumber.trim()],
    ['תאריך', input.date ? formatDate(input.date) : ''],
    ['בתוקף עד', model.validUntil ? formatDate(model.validUntil) : ''],
  ].filter(([, value]) => value)
  const missing = (text: string) => <span className={styles.missing}>{text}</span>

  return (
    <div className={styles.paperWrap} dir="rtl" lang="he">
      <article className={styles.sheet}>
        <header className={styles.docHead}>
          <div className={styles.from}>
            {logo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img className={styles.logo} src={logo} alt="" />
            ) : null}
            <p className={styles.biz}>{input.businessName.trim() || missing('[שם העסק]')}</p>
            <p className={styles.muted}>{businessLine(input)}</p>
            {contact ? <p className={styles.muted}>{contact}</p> : null}
          </div>
          <div className={styles.docMeta}>
            <Title className={styles.docTitle}>הצעת מחיר</Title>
            {meta.length ? (
              <dl className={styles.meta}>
                {meta.map(([term, value]) => (
                  <div key={term} className={styles.metaRow}>
                    <dt>{term}</dt>
                    <dd>{value}</dd>
                  </div>
                ))}
              </dl>
            ) : null}
          </div>
        </header>

        <section className={styles.to}>
          <Label className={styles.blockTitle}>לכבוד</Label>
          <p className={styles.client}>{input.clientName.trim() || missing('[שם הלקוח]')}</p>
          {clientIdLine(input) ? <p className={styles.muted}>{clientIdLine(input)}</p> : null}
          {client ? <p className={styles.muted}>{client}</p> : null}
        </section>

        {input.subject.trim() ? (
          <p className={styles.subject}>
            <strong>נושא:</strong> {input.subject.trim()}
          </p>
        ) : null}

        <table className={styles.table}>
          <caption className={styles.caption}>{priceBasis(model)}</caption>
          <thead>
            <tr>
              <th scope="col" className={styles.num}>
                <span aria-hidden="true">#</span>
                <span className={styles.visuallyHidden}>מספר שורה</span>
              </th>
              <th scope="col">תיאור</th>
              <th scope="col" className={`${styles.num} ${styles.wideOnly}`}>
                כמות
              </th>
              <th scope="col" className={`${styles.num} ${styles.wideOnly}`}>
                מחיר ליחידה
              </th>
              {model.hasLineDiscount ? (
                <th scope="col" className={`${styles.num} ${styles.wideOnly}`}>
                  הנחה
                </th>
              ) : null}
              <th scope="col" className={styles.num}>
                סה״כ
              </th>
            </tr>
          </thead>
          <tbody>
            {model.lines.length ? (
              model.lines.map((line, index) => (
                <tr key={line.id}>
                  <td className={styles.num}>{index + 1}</td>
                  <td>
                    <span className={styles.pre}>{line.description || missing('[תיאור]')}</span>
                    <span className={styles.lineMeta}>
                      {formatQuantity(line.quantity)} × {formatShekels(line.unitPrice)}
                      {line.discountRate ? ` · הנחה ${formatPercent(line.discountRate)}` : ''}
                    </span>
                  </td>
                  <td className={`${styles.num} ${styles.wideOnly}`}>{formatQuantity(line.quantity)}</td>
                  <td className={`${styles.num} ${styles.wideOnly}`}>{formatShekels(line.unitPrice)}</td>
                  {model.hasLineDiscount ? (
                    <td className={`${styles.num} ${styles.wideOnly}`}>
                      {line.discountRate ? formatPercent(line.discountRate) : ''}
                    </td>
                  ) : null}
                  <td className={styles.num}>{formatShekels(line.total)}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td className={styles.num}>1</td>
                <td>{missing('[הפריטים בהצעה]')}</td>
                <td className={styles.wideOnly} />
                <td className={styles.wideOnly} />
                <td className={styles.num}>{formatShekels(0)}</td>
              </tr>
            )}
          </tbody>
        </table>

        <dl className={styles.totals}>
          {totalRows(model).map((row) => (
            <div key={row.key} className={row.grand ? styles.grand : undefined}>
              <dt>{row.label}</dt>
              <dd>{formatSigned(row.value)}</dd>
            </div>
          ))}
        </dl>

        {input.paymentTerms.trim() ? (
          <section className={styles.block}>
            <Label className={styles.blockTitle}>תנאי תשלום</Label>
            <p className={styles.pre}>{input.paymentTerms.trim()}</p>
          </section>
        ) : null}
        {input.notes.trim() ? (
          <section className={styles.block}>
            <Label className={styles.blockTitle}>הערות</Label>
            <p className={styles.pre}>{input.notes.trim()}</p>
          </section>
        ) : null}

        <div className={styles.sign}>
          <p>חתימת העסק{input.signer.trim() ? `: ${input.signer.trim()}` : ''}</p>
          <p>אישור הלקוח: שם, חתימה ותאריך</p>
        </div>

        <footer className={styles.docFoot}>
          <p>{NOT_AN_INVOICE}</p>
          {input.credit ? (
            <p>
              נוצר במחולל הצעות המחיר של <a href={GENERATOR_URL}>AITERRA</a>
            </p>
          ) : null}
        </footer>
      </article>
    </div>
  )
}

export default function PriceQuoteGenerator() {
  const [input, setInput] = useState<QuoteInput>(() => defaultQuoteInput(''))
  const [restored, setRestored] = useState(false)
  const [status, setStatus] = useState('')
  const [itemStatus, setItemStatus] = useState('')
  const [logoError, setLogoError] = useState('')
  const nextId = useRef(2)
  const pendingFocus = useRef<{ id: number; target: FocusTarget } | null>(null)
  const itemsRef = useRef<HTMLDivElement>(null)
  const previewRef = useRef<HTMLDivElement>(null)
  const logoId = useId()
  const vatModeName = useId()
  const discountName = useId()
  const vatHintId = useId()
  const model = useMemo(() => buildQuote(input), [input])
  const exempt = model.exempt
  const vatRate = readVatRate(input.vatRate)
  const discountCheck = input.discountType === 'percent' ? readPercent(input.discount) : readPrice(input.discount)

  useEffect(() => {
    const today = localToday()
    const next = readDraft(today) ?? defaultQuoteInput(today)
    nextId.current = Math.max(...next.items.map((item) => item.id)) + 1
    setInput(next)
    setRestored(true)
  }, [])

  useEffect(() => {
    if (restored) writeDraft(input)
  }, [input, restored])

  useEffect(() => {
    const request = pendingFocus.current
    if (!request) return
    pendingFocus.current = null
    const row = itemsRef.current?.querySelector(`[data-item="${request.id}"]`)
    const find = (name: FocusTarget) => row?.querySelector<HTMLElement>(`[data-focus="${name}"]:not(:disabled)`)
    const target = find(request.target) ?? find(request.target === 'up' ? 'down' : 'up') ?? find('description')
    target?.focus()
  }, [input.items])

  const setText = (key: TextKey) => (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { value } = event.target
    setInput((current) => ({ ...current, [key]: value }))
  }

  const setChoice = <K extends keyof QuoteInput>(key: K, value: QuoteInput[K]) => () =>
    setInput((current) => ({ ...current, [key]: value }))

  const updateItems = (update: (items: QuoteItem[]) => QuoteItem[]) =>
    setInput((current) => ({ ...current, items: update(current.items) }))

  const setItem = (id: number) => (key: ItemKey) => (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { value } = event.target
    updateItems((items) => items.map((item) => (item.id === id ? { ...item, [key]: value } : item)))
  }

  const addItem = () => {
    if (input.items.length >= MAX_ITEMS) return
    const id = nextId.current
    nextId.current += 1
    pendingFocus.current = { id, target: 'description' }
    updateItems((items) => [...items, emptyItem(id)])
    setItemStatus(`נוסף פריט ${input.items.length + 1}`)
  }

  const moveItem = (id: number) => (delta: -1 | 1) => {
    const from = input.items.findIndex((item) => item.id === id)
    const to = from + delta
    if (from < 0 || to < 0 || to >= input.items.length) return
    pendingFocus.current = { id, target: delta < 0 ? 'up' : 'down' }
    updateItems((items) => {
      const next = [...items]
      const [moved] = next.splice(from, 1)
      next.splice(to, 0, moved)
      return next
    })
    setItemStatus(`הפריט עבר ממקום ${from + 1} למקום ${to + 1}`)
  }

  const removeItem = (id: number) => () => {
    const index = input.items.findIndex((item) => item.id === id)
    const neighbour = input.items[index + 1] ?? input.items[index - 1]
    if (neighbour) pendingFocus.current = { id: neighbour.id, target: 'description' }
    updateItems((items) => items.filter((item) => item.id !== id))
    setItemStatus(`פריט ${index + 1} הוסר`)
  }

  const onLogo = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) return
    if (!LOGO_TYPES.includes(file.type)) {
      setLogoError('אפשר להעלות קובץ PNG, JPG, WebP או SVG.')
      return
    }
    if (file.size > MAX_LOGO_BYTES) {
      setLogoError('הקובץ גדול מדי. אפשר עד 5MB.')
      return
    }
    try {
      const logo = await prepareLogo(file)
      if (!logo) throw new Error('empty')
      setInput((current) => ({ ...current, logo }))
      setLogoError('')
    } catch {
      setLogoError('לא הצלחנו לקרוא את התמונה. נסו קובץ אחר.')
    }
  }

  const removeLogo = () => {
    setInput((current) => ({ ...current, logo: '' }))
    setLogoError('')
    document.getElementById(logoId)?.focus()
  }

  const track = (event: string, format: OutputFormat) =>
    window.gtag?.('event', event, {
      format,
      entity_type: input.entityType,
      vat_mode: exempt ? 'exempt' : input.vatMode,
      items: model.lines.length,
    })

  const print = () => {
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
    frame.srcdoc = quoteDocument(model)
    document.body.appendChild(frame)
    setStatus('נפתח חלון ההדפסה. כדי לקבל קובץ PDF, בחרו ביעד שמירה כ-PDF.')
    track('price_quote_download', 'pdf')
  }

  const download = () => {
    const url = URL.createObjectURL(new Blob([quoteDocument(model)], { type: 'text/html;charset=utf-8' }))
    const link = document.createElement('a')
    link.href = url
    link.download = fileName(input)
    link.click()
    window.setTimeout(() => URL.revokeObjectURL(url), 1000)
    setStatus('קובץ ה-HTML ירד. אפשר לפתוח אותו בכל דפדפן ולהדפיס משם.')
    track('price_quote_download', 'html')
  }

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(quoteToText(model))
      setStatus('ההצעה הועתקה כטקסט')
      track('price_quote_copy', 'text')
    } catch {
      setStatus('ההעתקה נכשלה. סמנו את הטקסט בתצוגה המקדימה והעתיקו ידנית.')
    }
  }

  const reset = () => {
    if (!window.confirm('למחוק את כל הפרטים בטופס ולהתחיל הצעה חדשה?')) return
    nextId.current = 2
    setInput(defaultQuoteInput(localToday()))
    setLogoError('')
    setStatus('הטופס נוקה')
  }

  const showPreview = () => {
    previewRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    previewRef.current?.focus({ preventScroll: true })
  }

  return (
    <section className={ui.tool} aria-label="מחולל הצעת מחיר">
      <div className={ui.inner}>
        <form className={ui.form} onSubmit={(event) => event.preventDefault()}>
          <div className={styles.toolbar}>
            <button type="button" className={styles.jump} onClick={showPreview}>
              לתצוגה המקדימה
            </button>
          </div>

          <fieldset className={ui.group}>
            <legend className={ui.legend}>העסק שלכם</legend>
            <Field label="שם העסק">
              {(id) => (
                <input
                  id={id}
                  className={ui.input}
                  autoComplete="organization"
                  value={input.businessName}
                  onChange={setText('businessName')}
                />
              )}
            </Field>
            <div className={styles.pair}>
              <Field label="סוג העסק">
                {(id) => (
                  <select
                    id={id}
                    className={`${ui.input} ${styles.select}`}
                    value={input.entityType}
                    onChange={(event) =>
                      setInput((current) => ({ ...current, entityType: event.target.value as EntityType }))
                    }
                  >
                    {entityTypes.map((type) => (
                      <option key={type.id} value={type.id}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                )}
              </Field>
              <Field label={input.entityType === 'company' ? 'מספר ח.פ.' : 'מספר עוסק'}>
                {(id) => (
                  <input
                    id={id}
                    inputMode="numeric"
                    autoComplete="off"
                    className={`${ui.input} ${ui.ltr}`}
                    value={input.businessId}
                    onChange={setText('businessId')}
                  />
                )}
              </Field>
            </div>
            <div className={styles.pair}>
              <Field label="טלפון">
                {(id) => (
                  <input
                    id={id}
                    type="tel"
                    autoComplete="tel"
                    className={`${ui.input} ${ui.ltr}`}
                    value={input.phone}
                    onChange={setText('phone')}
                  />
                )}
              </Field>
              <Field label="דוא״ל">
                {(id) => (
                  <input
                    id={id}
                    type="email"
                    autoComplete="email"
                    className={`${ui.input} ${ui.ltr}`}
                    value={input.email}
                    onChange={setText('email')}
                  />
                )}
              </Field>
            </div>
            <Field label="כתובת העסק">
              {(id) => (
                <input
                  id={id}
                  autoComplete="street-address"
                  className={ui.input}
                  value={input.address}
                  onChange={setText('address')}
                />
              )}
            </Field>
            <div className={ui.field}>
              <span className={ui.label}>לוגו</span>
              <p id={`${logoId}-hint`} className={ui.hint}>
                PNG, JPG, WebP או SVG. התמונה נשארת בדפדפן שלכם ולא עולה לשום מקום.
              </p>
              <div className={styles.logoRow}>
                {input.logo ? (
                  <span className={styles.logoThumb} style={{ backgroundImage: `url("${input.logo}")` }} />
                ) : null}
                <input
                  id={logoId}
                  type="file"
                  accept={LOGO_TYPES.join(',')}
                  className={styles.fileInput}
                  aria-describedby={`${logoId}-hint ${logoId}-error`}
                  onChange={onLogo}
                />
                <label htmlFor={logoId} className={`${ui.secondary} ${styles.fileButton}`}>
                  {input.logo ? 'החלפת הלוגו' : 'בחירת קובץ לוגו'}
                </label>
                {input.logo ? (
                  <button type="button" className={styles.textButton} onClick={removeLogo}>
                    הסרת הלוגו
                  </button>
                ) : null}
              </div>
              <p id={`${logoId}-error`} className={styles.error} aria-live="polite">
                {logoError}
              </p>
            </div>
          </fieldset>

          <fieldset className={ui.group}>
            <legend className={ui.legend}>הלקוח</legend>
            <div className={styles.pair}>
              <Field label="שם הלקוח או החברה">
                {(id) => (
                  <input id={id} className={ui.input} value={input.clientName} onChange={setText('clientName')} />
                )}
              </Field>
              <Field label="ח.פ. או מספר עוסק של הלקוח">
                {(id) => (
                  <input
                    id={id}
                    inputMode="numeric"
                    autoComplete="off"
                    className={`${ui.input} ${ui.ltr}`}
                    value={input.clientId}
                    onChange={setText('clientId')}
                  />
                )}
              </Field>
            </div>
            <div className={styles.pair}>
              <Field label="טלפון הלקוח">
                {(id) => (
                  <input
                    id={id}
                    type="tel"
                    autoComplete="off"
                    className={`${ui.input} ${ui.ltr}`}
                    value={input.clientPhone}
                    onChange={setText('clientPhone')}
                  />
                )}
              </Field>
              <Field label="דוא״ל הלקוח">
                {(id) => (
                  <input
                    id={id}
                    type="email"
                    autoComplete="off"
                    className={`${ui.input} ${ui.ltr}`}
                    value={input.clientEmail}
                    onChange={setText('clientEmail')}
                  />
                )}
              </Field>
            </div>
            <Field label="כתובת הלקוח">
              {(id) => (
                <input
                  id={id}
                  autoComplete="off"
                  className={ui.input}
                  value={input.clientAddress}
                  onChange={setText('clientAddress')}
                />
              )}
            </Field>
          </fieldset>

          <fieldset className={ui.group}>
            <legend className={ui.legend}>פרטי ההצעה</legend>
            <div className={ui.row}>
              <Field label="מספר הצעה">
                {(id) => (
                  <input
                    id={id}
                    autoComplete="off"
                    className={`${ui.input} ${ui.ltr}`}
                    value={input.quoteNumber}
                    onChange={setText('quoteNumber')}
                  />
                )}
              </Field>
              <Field label="תאריך">
                {(id) => (
                  <input
                    id={id}
                    type="date"
                    className={`${ui.input} ${styles.date}`}
                    value={input.date}
                    onChange={setText('date')}
                  />
                )}
              </Field>
              <NumberField
                label="תוקף בימים"
                value={input.validDays}
                error={readValidDays(input.validDays).error}
                numeric
                onChange={setText('validDays')}
              />
            </div>
            <Field label="נושא ההצעה" hint="למשל: צילום מוצרים לחנות האינטרנטית">
              {(id, describedBy) => (
                <input
                  id={id}
                  aria-describedby={describedBy}
                  className={ui.input}
                  value={input.subject}
                  onChange={setText('subject')}
                />
              )}
            </Field>
          </fieldset>

          <fieldset className={ui.group}>
            <legend className={ui.legend}>פריטים ושירותים</legend>
            <div ref={itemsRef} className={styles.items}>
              {input.items.map((item, index) => (
                <ItemRow
                  key={item.id}
                  item={item}
                  index={index}
                  count={input.items.length}
                  onChange={setItem(item.id)}
                  onMove={moveItem(item.id)}
                  onRemove={removeItem(item.id)}
                />
              ))}
            </div>
            {input.items.length < MAX_ITEMS ? (
              <button type="button" className={`${ui.secondary} ${styles.add}`} onClick={addItem}>
                <Plus aria-hidden="true" />
                הוספת פריט
              </button>
            ) : (
              <p className={ui.hint}>אפשר עד {MAX_ITEMS} פריטים בהצעה אחת.</p>
            )}
            <p className={styles.visuallyHidden} role="status" aria-live="polite">
              {itemStatus}
            </p>
          </fieldset>

          <fieldset className={ui.group}>
            <legend className={ui.legend}>מע״מ והנחה</legend>
            {exempt ? (
              <p className={styles.notice}>עוסק פטור לא מוסיף מע״מ למחיר, ולכן בהצעה לא תופיע שורת מע״מ.</p>
            ) : (
              <>
                <fieldset className={ui.group} aria-describedby={vatHintId}>
                  <legend className={ui.legend}>המחירים שהקלדתם</legend>
                  <div className={ui.options}>
                    {(
                      [
                        ['before', 'לפני מע״מ'],
                        ['included', 'כולל מע״מ'],
                      ] as [VatMode, string][]
                    ).map(([value, label]) => (
                      <label key={value} className={ui.option}>
                        <input
                          type="radio"
                          name={vatModeName}
                          className={ui.checkbox}
                          checked={input.vatMode === value}
                          onChange={setChoice('vatMode', value)}
                        />
                        <span>{label}</span>
                      </label>
                    ))}
                  </div>
                  <p id={vatHintId} className={ui.hint}>
                    ללקוח פרטי נוקבים במחיר שכולל מע״מ. ללקוח עסקי מקובל לתת מחיר לפני מע״מ.
                  </p>
                </fieldset>
                <NumberField
                  label="שיעור המע״מ (%)"
                  value={input.vatRate}
                  error={vatRate.error}
                  className={styles.short}
                  onChange={setText('vatRate')}
                />
              </>
            )}
            <div className={styles.discountRow}>
              <NumberField
                label="הנחה על כל ההצעה"
                value={input.discount}
                error={discountCheck.error}
                className={styles.short}
                onChange={setText('discount')}
              />
              <fieldset className={styles.segment}>
                <legend className={styles.visuallyHidden}>סוג ההנחה</legend>
                {(
                  [
                    ['percent', '%', 'באחוזים'],
                    ['amount', '₪', 'בשקלים'],
                  ] as [DiscountType, string, string][]
                ).map(([value, symbol, name]) => (
                  <label key={value} className={styles.segmentOption}>
                    <input
                      type="radio"
                      name={discountName}
                      checked={input.discountType === value}
                      onChange={setChoice('discountType', value)}
                    />
                    <span>
                      <span aria-hidden="true">{symbol}</span>
                      <span className={styles.visuallyHidden}>{name}</span>
                    </span>
                  </label>
                ))}
              </fieldset>
            </div>
          </fieldset>

          <fieldset className={ui.group}>
            <legend className={ui.legend}>תנאים וחתימה</legend>
            <Field
              label="תנאי תשלום"
              hint="למשל: 50% מקדמה באישור ההצעה והיתרה במסירה, בהעברה בנקאית או בביט."
            >
              {(id, describedBy) => (
                <textarea
                  id={id}
                  aria-describedby={describedBy}
                  className={`${ui.input} ${ui.textarea}`}
                  value={input.paymentTerms}
                  onChange={setText('paymentTerms')}
                />
              )}
            </Field>
            <Field label="הערות" hint="למשל: מה כלול במחיר ומה לא, לוח זמנים, אחריות.">
              {(id, describedBy) => (
                <textarea
                  id={id}
                  aria-describedby={describedBy}
                  className={`${ui.input} ${ui.textarea}`}
                  value={input.notes}
                  onChange={setText('notes')}
                />
              )}
            </Field>
            <Field label="שם החותם בשם העסק">
              {(id) => <input id={id} className={ui.input} value={input.signer} onChange={setText('signer')} />}
            </Field>
          </fieldset>

          <div className={styles.footerRow}>
            <label className={ui.option}>
              <input
                type="checkbox"
                className={ui.checkbox}
                checked={input.credit}
                onChange={() => setInput((current) => ({ ...current, credit: !current.credit }))}
              />
              <span>להוסיף בתחתית שורת קרדיט עם קישור למחולל</span>
            </label>
            <button type="button" className={styles.textButton} onClick={reset}>
              ניקוי הטופס
            </button>
          </div>
        </form>

        <div className={ui.output}>
          <div className={ui.sticky}>
            <h2 className={ui.outputTitle}>ההצעה שלכם</h2>
            <p className={styles.disclaimer}>{NOT_AN_INVOICE} על העסקה עצמה מוציאים חשבונית בנפרד.</p>
            <div
              ref={previewRef}
              className={styles.desk}
              role="region"
              aria-label="תצוגה מקדימה של הצעת המחיר"
              tabIndex={0}
            >
              <QuotePreview model={model} />
            </div>
            <div className={ui.actions}>
              <button type="button" className={`${ui.primary} ${styles.wide}`} onClick={print}>
                <Printer aria-hidden="true" />
                הדפסה או שמירה כ-PDF
              </button>
              <button type="button" className={ui.secondary} onClick={download}>
                <Download aria-hidden="true" />
                קובץ HTML
              </button>
              <button type="button" className={ui.secondary} onClick={copy}>
                <Copy aria-hidden="true" />
                העתקת הטקסט
              </button>
            </div>
            <p className={ui.status} role="status" aria-live="polite">
              {status}
            </p>
            <p className={ui.note}>הפרטים והלוגו נשמרים רק בדפדפן שלכם ולא נשלחים לשום מקום.</p>
          </div>
        </div>
      </div>
    </section>
  )
}
