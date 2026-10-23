'use client'

import { useEffect, useId, useMemo, useState, type CSSProperties, type ReactNode } from 'react'
import Link from 'next/link'
import { ClipboardCopy, Download, Printer } from 'lucide-react'
import {
  A4,
  BARCODE_FONT,
  MAX_HEIGHT_MM,
  MIN_HEIGHT_MM,
  MIN_RETAIL_X,
  NOMINAL_X,
  barPath,
  barcodeSvg,
  barcodeTitle,
  colorProblem,
  dataLength,
  defaultSettings,
  defaultSheet,
  defaultValues,
  effectiveDpi,
  encode,
  fileName,
  isRetail,
  isSymbology,
  isTruncated,
  labelPosition,
  layoutBarcode,
  magnification,
  minimumHeight,
  nominalHeight,
  parseValue,
  pixelsPerModule,
  pngWithDpi,
  printSize,
  restoreSettings,
  restoreSheet,
  restoreValues,
  roundTo,
  sheetDocument,
  sheetFit,
  sheetGeometry,
  sheetLimits,
  sheetPresets,
  sheetValues,
  symbologies,
  symbologyLabel,
  xOptions,
  type BarcodeLayout,
  type BarcodeSettings,
  type SheetSettings,
  type Symbology,
} from '@/lib/barcode'
import ui from './toolUi.module.css'
import styles from './BarcodeGenerator.module.css'

type Draft = {
  symbology: Symbology
  values: Record<Symbology, string>
  settings: BarcodeSettings
  sheet: SheetSettings
}

type SheetNumberKey = keyof typeof sheetLimits

const STORAGE_KEY = 'aiterra-barcode-v1'
const presetKeys = ['columns', 'rows', 'marginTop', 'marginSide', 'gapX', 'gapY'] as const
const CUSTOM_PRESET = 'custom'

const valueLabel: Record<Symbology, string> = {
  ean13: 'מספר המוצר',
  upca: 'מספר המוצר',
  ean8: 'מספר המוצר',
  code128: 'המק״ט או הטקסט',
}

const valueHint: Record<Symbology, string> = {
  ean13: '12 ספרות, וספרת הביקורת תחושב לבד, או 13 ספרות עם ספרת הביקורת. למספר פנימי בלי GS1, התחילו ב-040 עד 049.',
  upca: '11 ספרות, וספרת הביקורת תחושב לבד, או 12 ספרות עם ספרת הביקורת.',
  ean8: '7 ספרות, וספרת הביקורת תחושב לבד, או 8 ספרות עם ספרת הביקורת.',
  code128: 'אותיות לועזיות, ספרות וסימנים, עד 48 תווים. בלי עברית.',
}

const emptyPrompt: Record<Symbology, string> = {
  ean13: 'הקלידו 12 או 13 ספרות, והברקוד יופיע כאן.',
  upca: 'הקלידו 11 או 12 ספרות, והברקוד יופיע כאן.',
  ean8: 'הקלידו 7 או 8 ספרות, והברקוד יופיע כאן.',
  code128: 'הקלידו מק״ט או טקסט, והברקוד יופיע כאן.',
}

const colorMessages = {
  inverted: 'הפסים בהירים מהרקע. סורקים קוראים רק פסים כהים על רקע בהיר.',
  low: 'אין מספיק הבדל בין צבע הפסים לצבע הרקע, וייתכן שהסורק לא יקרא את הברקוד. בחרו פסים כהים יותר או רקע בהיר יותר.',
  red: 'סורקי לייזר מאירים באור אדום, ולכן פסים אדומים, כתומים או חומים כמעט נעלמים להם. בחרו פסים שחורים, כחולים כהים או ירוקים כהים.',
}

const sheetFields: { key: SheetNumberKey; label: string; unit?: string }[] = [
  { key: 'columns', label: 'עמודות' },
  { key: 'rows', label: 'שורות' },
  { key: 'pages', label: 'דפים' },
  { key: 'marginTop', label: 'שוליים למעלה ולמטה', unit: 'מ״מ' },
  { key: 'marginSide', label: 'שוליים בצדדים', unit: 'מ״מ' },
  { key: 'gapX', label: 'רווח בין עמודות', unit: 'מ״מ' },
  { key: 'gapY', label: 'רווח בין שורות', unit: 'מ״מ' },
]

function readDraft(): Partial<Draft> | null {
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY)
    return saved ? (JSON.parse(saved) as Partial<Draft>) : null
  } catch {
    return null
  }
}

function writeDraft(draft: Draft) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(draft))
    return true
  } catch {
    return false
  }
}

function saveBlob(blob: Blob, name: string) {
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = name
  anchor.click()
  window.setTimeout(() => URL.revokeObjectURL(url), 1000)
}

function drawCanvas(layout: BarcodeLayout, colors: { dark: string; light: string }) {
  const scale = pixelsPerModule(layout.xMm)
  const canvas = document.createElement('canvas')
  canvas.width = Math.round(layout.width * scale)
  canvas.height = Math.round(layout.height * scale)
  const context = canvas.getContext('2d')
  if (!context) throw new Error('canvas')
  context.fillStyle = colors.light
  context.fillRect(0, 0, canvas.width, canvas.height)
  context.fillStyle = colors.dark
  for (const bar of layout.bars) {
    const x = Math.round(bar.x * scale)
    const y = Math.round(bar.y * scale)
    const width = Math.round((bar.x + bar.width) * scale) - x
    const height = Math.round((bar.y + bar.height) * scale) - y
    context.fillRect(x, y, width, height)
  }
  context.direction = 'ltr'
  context.textAlign = 'center'
  context.textBaseline = 'alphabetic'
  for (const label of layout.labels) {
    context.font = `${label.size * scale}px ${BARCODE_FONT}`
    context.fillText(label.text, label.x * scale, label.y * scale)
  }
  return canvas
}

function canvasPng(canvas: HTMLCanvasElement) {
  return new Promise<Blob>((resolve, reject) =>
    canvas.toBlob((blob) => (blob ? resolve(blob) : reject(new Error('empty'))), 'image/png'),
  )
}

function Mm({ children }: { children: ReactNode }) {
  return (
    <bdi dir="ltr" className={styles.mm}>
      {children}
    </bdi>
  )
}

function BarcodeGraphic({
  layout,
  colors,
  label,
  className,
  style,
  decorative = false,
}: {
  layout: BarcodeLayout
  colors: { dark: string; light: string }
  label: string
  className?: string
  style?: CSSProperties
  decorative?: boolean
}) {
  const width = roundTo(layout.width)
  const height = roundTo(layout.height)
  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className={className}
      style={style}
      role={decorative ? undefined : 'img'}
      aria-label={decorative ? undefined : label}
      aria-hidden={decorative || undefined}
      focusable="false"
      direction="ltr"
    >
      <rect width={width} height={height} fill={colors.light} />
      <path d={barPath(layout)} fill={colors.dark} shapeRendering="crispEdges" />
      {layout.labels.length ? (
        <g fill={colors.dark} fontFamily={BARCODE_FONT} textAnchor="middle" direction="ltr">
          {layout.labels.map((item, index) => (
            <text key={index} x={roundTo(item.x)} y={roundTo(item.y)} fontSize={roundTo(item.size)}>
              {item.text}
            </text>
          ))}
        </g>
      ) : null}
    </svg>
  )
}

function Optional({ title, children }: { title: string; children: ReactNode }) {
  return (
    <details className={`${ui.group} ${styles.optional}`}>
      <summary className={`${ui.legend} ${styles.optionalSummary}`}>
        <span>{title}</span>
        <span className={styles.optionalTag}>לא חובה</span>
      </summary>
      <div className={styles.optionalBody}>{children}</div>
    </details>
  )
}

function Choices<T extends string | number>({
  legend,
  hint,
  options,
  value,
  onChange,
  columns,
}: {
  legend: string
  hint?: string
  options: { value: T; label: ReactNode }[]
  value: T
  onChange: (value: T) => void
  columns: 2 | 3
}) {
  const name = useId()
  const hintId = useId()
  return (
    <fieldset className={ui.group} aria-describedby={hint ? hintId : undefined}>
      <legend className={ui.legend}>{legend}</legend>
      {hint ? (
        <p id={hintId} className={ui.hint}>
          {hint}
        </p>
      ) : null}
      <div className={`${ui.options} ${styles.grid}`} data-columns={columns}>
        {options.map((option) => (
          <label key={String(option.value)} className={ui.option}>
            <input
              type="radio"
              name={name}
              className={ui.checkbox}
              checked={value === option.value}
              onChange={() => onChange(option.value)}
            />
            <span>{option.label}</span>
          </label>
        ))}
      </div>
    </fieldset>
  )
}

function Toggle({
  label,
  checked,
  onChange,
}: {
  label: string
  checked: boolean
  onChange: (next: boolean) => void
}) {
  return (
    <label className={ui.option}>
      <input type="checkbox" className={ui.checkbox} checked={checked} onChange={() => onChange(!checked)} />
      <span>{label}</span>
    </label>
  )
}

function NumberField({
  label,
  value,
  min,
  max,
  integer = false,
  unit,
  hint,
  warning,
  onCommit,
}: {
  label: string
  value: number
  min: number
  max: number
  integer?: boolean
  unit?: string
  hint?: string
  warning?: string
  onCommit: (next: number) => void
}) {
  const id = useId()
  const [draft, setDraft] = useState(String(value))
  const [synced, setSynced] = useState(value)
  if (synced !== value) {
    setSynced(value)
    setDraft(String(value))
  }
  const accepts = (text: string) => {
    const number = Number(text.replace(',', '.'))
    const inRange = Number.isFinite(number) && number >= min && number <= max
    return text.trim() !== '' && inRange && (!integer || Number.isInteger(number))
  }
  const invalid = !accepts(draft)
  const message = invalid ? `${integer ? 'מספר שלם' : 'מספר'} בין ${min} ל-${max}.` : warning
  const describedBy =
    [hint ? `${id}-hint` : '', message ? `${id}-message` : ''].filter(Boolean).join(' ') || undefined
  return (
    <div className={ui.field}>
      <label htmlFor={id} className={ui.label}>
        {label}
      </label>
      {hint ? (
        <p id={`${id}-hint`} className={ui.hint}>
          {hint}
        </p>
      ) : null}
      <div className={styles.numberRow}>
        <input
          id={id}
          type="text"
          inputMode="decimal"
          autoComplete="off"
          className={`${ui.input} ${ui.ltr} ${styles.number} ${invalid ? styles.invalid : ''}`}
          value={draft}
          aria-invalid={invalid || undefined}
          aria-describedby={describedBy}
          onChange={(event) => {
            const next = event.target.value
            setDraft(next)
            if (!accepts(next)) return
            const number = Number(next.replace(',', '.'))
            setSynced(number)
            onCommit(number)
          }}
          onBlur={() => setDraft(String(value))}
        />
        {unit ? <span className={styles.unit}>{unit}</span> : null}
      </div>
      {message ? (
        <p id={`${id}-message`} className={invalid ? styles.error : styles.warningText}>
          {message}
        </p>
      ) : null}
    </div>
  )
}

export default function BarcodeGenerator() {
  const [symbology, setSymbology] = useState<Symbology>('ean13')
  const [values, setValues] = useState<Record<Symbology, string>>(defaultValues)
  const [settings, setSettings] = useState<BarcodeSettings>(defaultSettings)
  const [sheet, setSheet] = useState<SheetSettings>(defaultSheet)
  const [touched, setTouched] = useState(false)
  const [status, setStatus] = useState('')
  const [sheetStatus, setSheetStatus] = useState('')
  const [canCopy, setCanCopy] = useState(false)
  const [restored, setRestored] = useState(false)
  const [customLayout, setCustomLayout] = useState(false)
  const typeName = useId()
  const valueId = useId()
  const colorMessageId = useId()

  const raw = values[symbology]
  const parsed = useMemo(() => parseValue(symbology, raw), [symbology, raw])
  const data = parsed.status === 'valid' ? parsed.data : ''
  const { dark, light } = settings
  const colors = useMemo(() => ({ dark, light }), [dark, light])
  const layout = useMemo(
    () => (data ? layoutBarcode(encode(symbology, data), settings) : null),
    [data, symbology, settings],
  )
  const size = layout ? printSize(layout) : null
  const title = data ? barcodeTitle(symbology, data) : ''
  const problem = colorProblem(settings.dark, settings.light)
  const truncated = isTruncated(symbology, settings)
  const retail = isRetail(symbology)
  const geometry = useMemo(() => sheetGeometry(sheet), [sheet])
  const perPage = sheet.columns * sheet.rows
  const matchingPreset = sheetPresets.find((preset) =>
    presetKeys.every((key) => preset[key] === sheet[key]),
  )
  const activePreset = customLayout || !matchingPreset ? CUSTOM_PRESET : matchingPreset.id

  const previewValues = useMemo(
    () => (data ? sheetValues(symbology, data, perPage, sheet.sequence) : null),
    [data, symbology, perPage, sheet.sequence],
  )

  const previewLabels = useMemo(() => {
    if (!previewValues || previewValues.status !== 'ok' || geometry.status !== 'ok') return []
    return previewValues.values.map((value) => {
      const itemLayout = layoutBarcode(encode(symbology, value), settings)
      return { value, layout: itemLayout, fit: sheetFit(itemLayout, geometry.labelWidth, geometry.labelHeight) }
    })
  }, [previewValues, geometry, symbology, settings])

  const smallestScale = previewLabels.reduce((smallest, item) => Math.min(smallest, item.fit.scale), 1)

  useEffect(() => {
    const saved = readDraft()
    if (saved) {
      if (isSymbology(saved.symbology)) setSymbology(saved.symbology)
      setValues(restoreValues(saved.values))
      setSettings(restoreSettings(saved.settings))
      setSheet(restoreSheet(saved.sheet))
    }
    setCanCopy(typeof navigator.clipboard?.writeText === 'function')
    setRestored(true)
  }, [])

  useEffect(() => {
    if (restored) writeDraft({ symbology, values, settings, sheet })
  }, [symbology, values, settings, sheet, restored])

  const track = (format: string) => window.gtag?.('event', 'barcode_download', { format, symbology })

  const chooseSymbology = (next: Symbology) => {
    setSymbology(next)
    setSettings((current) => ({ ...current, heightMm: nominalHeight(next, current.xMm) }))
    setTouched(false)
    setStatus('')
  }

  const setValue = (next: string) => {
    setValues((current) => ({ ...current, [symbology]: next }))
    setStatus('')
  }

  const patchSettings = (patch: Partial<BarcodeSettings>) => {
    setSettings((current) => ({ ...current, ...patch }))
    setStatus('')
  }

  const chooseX = (next: number) =>
    setSettings((current) => {
      const scaled = roundTo((current.heightMm * next) / current.xMm, 2)
      return { ...current, xMm: next, heightMm: Math.min(MAX_HEIGHT_MM, Math.max(MIN_HEIGHT_MM, scaled)) }
    })

  const patchSheet = (patch: Partial<SheetSettings>) => {
    setSheet((current) => ({ ...current, ...patch }))
    setSheetStatus('')
  }

  const choosePreset = (id: string) => {
    const preset = sheetPresets.find((item) => item.id === id)
    setCustomLayout(!preset)
    if (!preset) return
    const { columns, rows, marginTop, marginSide, gapX, gapY } = preset
    patchSheet({ columns, rows, marginTop, marginSide, gapX, gapY })
  }

  const downloadPng = async () => {
    if (!layout) return
    try {
      const canvas = drawCanvas(layout, colors)
      const blob = await canvasPng(canvas)
      const dpi = effectiveDpi(layout.xMm)
      const bytes = pngWithDpi(new Uint8Array(await blob.arrayBuffer()), dpi)
      saveBlob(new Blob([bytes], { type: 'image/png' }), `${fileName(symbology, data)}.png`)
      setStatus(
        `קובץ ה-PNG ירד: ${canvas.width} על ${canvas.height} פיקסלים ב-${Math.round(dpi)} DPI, שמודפסים בגודל ${size?.width} על ${size?.height} מ״מ.`,
      )
      track('png')
    } catch {
      setStatus('לא הצלחנו ליצור את הקובץ. נסו שוב.')
    }
  }

  const svgMarkup = () => (layout ? barcodeSvg(layout, colors, title) : '')

  const downloadSvg = () => {
    if (!layout) return
    const blob = new Blob([svgMarkup()], { type: 'image/svg+xml;charset=utf-8' })
    saveBlob(blob, `${fileName(symbology, data)}.svg`)
    setStatus('קובץ ה-SVG ירד. הוא וקטורי ונשמר בגודל ההדפסה שבחרתם.')
    track('svg')
  }

  const copySvg = async () => {
    if (!layout) return
    try {
      await navigator.clipboard.writeText(svgMarkup())
      setStatus('קוד ה-SVG הועתק. אפשר להדביק אותו בעורך גרפי או בקוד של האתר.')
      track('svg_copy')
    } catch {
      setStatus('ההעתקה לא עבדה בדפדפן הזה. הורידו את קובץ ה-SVG במקום.')
    }
  }

  const printSheet = () => {
    if (!data || geometry.status !== 'ok') return
    const result = sheetValues(symbology, data, perPage * sheet.pages, sheet.sequence)
    if (result.status !== 'ok') {
      setSheetStatus(result.error)
      return
    }
    const labels = result.values.map((value) => {
      const itemLayout = layoutBarcode(encode(symbology, value), settings)
      const fit = sheetFit(itemLayout, geometry.labelWidth, geometry.labelHeight)
      return barcodeSvg(itemLayout, colors, barcodeTitle(symbology, value), fit.scale)
    })
    const frame = document.createElement('iframe')
    frame.setAttribute('aria-hidden', 'true')
    frame.tabIndex = -1
    Object.assign(frame.style, { position: 'fixed', insetBlockEnd: '0', width: '0', height: '0', border: '0' })
    frame.onload = () => {
      const view = frame.contentWindow
      if (!view) return
      view.focus()
      view.print()
      window.setTimeout(() => frame.remove(), 1000)
    }
    frame.srcdoc = sheetDocument(labels, sheet, geometry)
    document.body.appendChild(frame)
    const last = result.values[result.values.length - 1]
    setSheetStatus(
      `נפתח חלון ההדפסה עם ${result.values.length} מדבקות. בחרו גודל נייר A4 והדפסה בגודל בפועל (100%), בלי התאמה לדף.${
        sheet.sequence ? ` המדבקה האחרונה: ${last}.` : ''
      }`,
    )
    track('sheet')
  }

  const reset = () => {
    setSymbology('ean13')
    setValues(defaultValues)
    setSettings(defaultSettings)
    setSheet(defaultSheet)
    setCustomLayout(false)
    setTouched(false)
    setSheetStatus('')
    setStatus('הטופס אופס')
  }

  const typedEnough = isRetail(symbology) && raw.replace(/[\s-]/g, '').length >= dataLength(symbology)
  const showError = parsed.status === 'invalid' && (touched || !retail || typedEnough || /[^\d\s-]/.test(raw))
  const inputError = showError && parsed.status === 'invalid' ? parsed.error : ''
  const notices = parsed.status === 'valid' ? parsed.notices : []
  const describedBy = [`${valueId}-hint`, inputError || notices.length ? `${valueId}-message` : '']
    .filter(Boolean)
    .join(' ')
  const placeholder = parsed.status === 'invalid' ? parsed.error : emptyPrompt[symbology]
  const minimum = minimumHeight(symbology, settings.xMm)

  return (
    <section className={ui.tool} aria-label="יצירת ברקוד">
      <div className={ui.inner}>
        <form className={ui.form} onSubmit={(event) => event.preventDefault()}>
          <fieldset className={ui.group}>
            <legend className={ui.legend}>סוג הברקוד</legend>
            <div className={styles.types}>
              {symbologies.map((item) => (
                <label key={item.id} className={styles.type}>
                  <input
                    type="radio"
                    name={typeName}
                    className={styles.typeInput}
                    checked={symbology === item.id}
                    onChange={() => chooseSymbology(item.id)}
                  />
                  <span className={styles.typeName} dir="ltr">
                    {item.label}
                  </span>
                  <span className={styles.typeUse}>{item.use}</span>
                </label>
              ))}
            </div>
            <p className={ui.hint}>
              לקישור, לתפריט או לוואטסאפ מתאים קוד QR ולא ברקוד:{' '}
              <Link href="/tools/qr-code-generator" className={styles.inlineLink}>
                מחולל קוד QR
              </Link>
              .
            </p>
          </fieldset>

          <fieldset className={ui.group}>
            <legend className={ui.legend}>מה יקודד בברקוד</legend>
            <div className={ui.field}>
              <label htmlFor={valueId} className={ui.label}>
                {valueLabel[symbology]}
              </label>
              <p id={`${valueId}-hint`} className={ui.hint}>
                {valueHint[symbology]}
              </p>
              <input
                id={valueId}
                className={`${ui.input} ${ui.ltr} ${inputError ? styles.invalid : ''}`}
                value={raw}
                inputMode={retail ? 'numeric' : 'text'}
                autoComplete="off"
                autoCapitalize="off"
                autoCorrect="off"
                spellCheck={false}
                placeholder={retail ? undefined : 'SKU-1042'}
                aria-invalid={Boolean(inputError) || undefined}
                aria-describedby={describedBy}
                onChange={(event) => setValue(event.target.value)}
                onBlur={() => setTouched(true)}
              />
              {inputError || notices.length ? (
                <div id={`${valueId}-message`}>
                  {inputError ? (
                    <p className={styles.error}>{inputError}</p>
                  ) : (
                    notices.map((notice) => (
                      <p key={notice} className={styles.notice}>
                        {notice}
                      </p>
                    ))
                  )}
                </div>
              ) : null}
            </div>
          </fieldset>

          <Optional title="גודל, גובה ושוליים">
            <Choices
              legend="רוחב הפס הדק (X)"
              hint={
                retail
                  ? 'לפי GS1, ברקוד למוצר בקופה הוא בין 0.264 ל-0.66 מ״מ, והגודל הרגיל 0.33 מ״מ. כל הברקוד גדל או קטן ביחד.'
                  : 'רוחב הפס הצר ביותר. פס רחב יותר נותן ברקוד גדול וקל יותר לסריקה.'
              }
              options={xOptions.map((x) => ({
                value: x,
                label: (
                  <>
                    <Mm>{x}</Mm> מ״מ
                    {retail ? <span className={styles.optionNote}>{magnification(x)}%</span> : null}
                    {x === NOMINAL_X ? <span className={styles.optionNote}>הגודל הרגיל</span> : null}
                  </>
                ),
              }))}
              value={settings.xMm}
              onChange={chooseX}
              columns={3}
            />
            <NumberField
              label="גובה הפסים"
              unit="מ״מ"
              value={settings.heightMm}
              min={MIN_HEIGHT_MM}
              max={MAX_HEIGHT_MM}
              hint={
                minimum !== null
                  ? `הגובה המלא לפי GS1 ברוחב הזה: ${minimum} מ״מ, בלי הספרות שמתחת.`
                  : 'Code 128 גבוה יותר קל יותר לסריקה בסורק ידני.'
              }
              warning={
                truncated
                  ? 'זה ברקוד מקוצר. GS1 מתירה לקצר את הפסים רק כשאין שום דרך להדפיס בגובה מלא, כי ברקוד נמוך קשה יותר לסרוק בקופה.'
                  : undefined
              }
              onCommit={(next) => patchSettings({ heightMm: next })}
            />
            <div className={styles.toggles}>
              <Toggle
                label="להציג את הספרות מתחת לפסים"
                checked={settings.showText}
                onChange={(next) => patchSettings({ showText: next })}
              />
              <Toggle
                label="שוליים ריקים משני הצדדים, כמו שהתקן דורש"
                checked={settings.quietZone}
                onChange={(next) => patchSettings({ quietZone: next })}
              />
            </div>
            {retail && !settings.showText ? (
              <p className={styles.warning}>
                ב-EAN ו-UPC המפרט של GS1 דורש להדפיס את הספרות מתחת לפסים. בלי ספרות, הקובץ מתאים רק לשימוש פנימי.
              </p>
            ) : null}
            {!settings.quietZone ? (
              <p className={styles.warning}>
                בלי שוליים בקובץ, השאירו בעצמכם שטח ריק משני הצדדים כשאתם מעצבים את המדבקה או האריזה.
                בלי השטח הזה הסורק לא מוצא את תחילת הברקוד.
              </p>
            ) : null}
          </Optional>

          <Optional title="צבעים">
            <div className={styles.pair}>
              {(
                [
                  ['dark', 'צבע הפסים'],
                  ['light', 'צבע הרקע'],
                ] as const
              ).map(([key, label]) => (
                <div key={key} className={ui.field}>
                  <label htmlFor={`${colorMessageId}-${key}`} className={ui.label}>
                    {label}
                  </label>
                  <div className={styles.colorRow}>
                    <input
                      id={`${colorMessageId}-${key}`}
                      type="color"
                      className={styles.color}
                      aria-describedby={problem ? colorMessageId : undefined}
                      value={settings[key]}
                      onChange={(event) => patchSettings({ [key]: event.target.value })}
                    />
                    <span className={styles.hex}>{settings[key].toUpperCase()}</span>
                  </div>
                </div>
              ))}
            </div>
            {problem ? (
              <p id={colorMessageId} className={styles.error}>
                {colorMessages[problem]}
              </p>
            ) : null}
          </Optional>

          <Optional title="דף מדבקות A4 להדפסה">
            <Choices
              legend="סידור המדבקות בדף"
              options={[
                ...sheetPresets.map((preset) => {
                  const presetGeometry = sheetGeometry({ ...sheet, ...preset })
                  return {
                    value: preset.id,
                    label: (
                      <>
                        <Mm>
                          {preset.columns} × {preset.rows}
                        </Mm>
                        {presetGeometry.status === 'ok' ? (
                          <span className={styles.optionNote}>
                            <Mm>
                              {roundTo(presetGeometry.labelWidth, 1)} × {roundTo(presetGeometry.labelHeight, 1)}
                            </Mm>{' '}
                            מ״מ
                          </span>
                        ) : null}
                      </>
                    ),
                  }
                }),
                { value: CUSTOM_PRESET, label: 'מידות אחרות' },
              ]}
              value={activePreset}
              onChange={choosePreset}
              columns={3}
            />
            <div className={styles.sheetFields}>
              {sheetFields.map((field) => (
                <NumberField
                  key={field.key}
                  label={field.label}
                  unit={field.unit}
                  value={sheet[field.key]}
                  min={sheetLimits[field.key].min}
                  max={sheetLimits[field.key].max}
                  integer={sheetLimits[field.key].step === 1}
                  onCommit={(next) => patchSheet({ [field.key]: next })}
                />
              ))}
            </div>
            {geometry.status === 'ok' ? (
              <p className={ui.hint}>
                כל מדבקה: <Mm>{geometry.labelWidth} × {geometry.labelHeight}</Mm> מ״מ. בדף: {perPage} מדבקות.
              </p>
            ) : (
              <p className={styles.error}>{geometry.error}</p>
            )}
            <Choices
              legend="מה יודפס על המדבקות"
              options={[
                { value: 'same', label: 'אותו ברקוד בכל המדבקות' },
                { value: 'sequence', label: 'רצף: כל מדבקה במספר הבא' },
              ]}
              value={sheet.sequence ? 'sequence' : 'same'}
              onChange={(next) => patchSheet({ sequence: next === 'sequence' })}
              columns={2}
            />
            <Toggle
              label="קווי מתאר סביב המדבקות, להדפסת ניסיון על דף רגיל"
              checked={sheet.outline}
              onChange={(next) => patchSheet({ outline: next })}
            />
            {previewValues?.status === 'invalid' ? <p className={styles.error}>{previewValues.error}</p> : null}
            {layout && smallestScale < 1 ? (
              <p className={styles.warning}>
                הברקוד גדול מהמדבקה, ולכן יודפס ב-{Math.floor(smallestScale * 100)}% מהגודל שבחרתם.
                {retail && settings.xMm * smallestScale < MIN_RETAIL_X
                  ? ' זה קטן מהמינימום של GS1 לברקוד בקופה. בחרו מדבקה גדולה יותר או פחות מדבקות בדף.'
                  : ''}
              </p>
            ) : null}
            {geometry.status === 'ok' && previewLabels.length ? (
              <div
                className={styles.sheet}
                dir="ltr"
                role="img"
                aria-label={`תצוגה של דף A4 עם ${perPage} מדבקות, ${sheet.columns} עמודות ו-${sheet.rows} שורות`}
              >
                {previewLabels.map((item, index) => {
                  const { start, top } = labelPosition(index, sheet, geometry)
                  return (
                    <div
                      key={index}
                      className={`${styles.sheetLabel} ${sheet.outline ? styles.sheetOutline : ''}`}
                      style={{
                        insetInlineStart: `${(start / A4.width) * 100}%`,
                        insetBlockStart: `${(top / A4.height) * 100}%`,
                        width: `${(geometry.labelWidth / A4.width) * 100}%`,
                        height: `${(geometry.labelHeight / A4.height) * 100}%`,
                      }}
                    >
                      <BarcodeGraphic
                        layout={item.layout}
                        colors={colors}
                        label={item.value}
                        decorative
                        className={styles.sheetCode}
                        style={{ width: `${(item.fit.width / geometry.labelWidth) * 100}%` }}
                      />
                    </div>
                  )
                })}
              </div>
            ) : null}
            {!data ? <p className={ui.hint}>הקלידו מספר או מק״ט, והדף יופיע כאן.</p> : null}
            <div className={ui.actions}>
              <button
                type="button"
                className={`${ui.primary} ${styles.wide}`}
                onClick={printSheet}
                disabled={!data || geometry.status !== 'ok' || previewValues?.status === 'invalid'}
              >
                <Printer aria-hidden="true" />
                הדפסת דף המדבקות
              </button>
            </div>
            <p className={ui.status} role="status" aria-live="polite">
              {sheetStatus}
            </p>
          </Optional>

          <div className={styles.footerRow}>
            <button type="button" className={styles.reset} onClick={reset}>
              איפוס הטופס
            </button>
          </div>
        </form>

        <div className={ui.output}>
          <div className={ui.sticky}>
            <h2 className={ui.outputTitle}>הברקוד שלכם</h2>
            <div className={styles.stage}>
              {layout ? (
                <BarcodeGraphic layout={layout} colors={colors} label={title} className={styles.preview} />
              ) : (
                <p className={styles.placeholder}>{placeholder}</p>
              )}
            </div>
            {layout && size ? (
              <p className={styles.caption}>
                <bdi dir="ltr" className={styles.captionValue}>
                  {data}
                </bdi>
                <span>
                  {symbologyLabel(symbology)}, בהדפסה <Mm>{size.width} × {size.height}</Mm> מ״מ
                </span>
              </p>
            ) : null}
            {layout && (problem || truncated) ? (
              <p className={styles.warning}>
                {problem ? colorMessages[problem] : 'הפסים נמוכים מהגובה המלא לפי GS1, כך שזה ברקוד מקוצר.'}
              </p>
            ) : null}
            {layout ? (
              <div className={ui.actions}>
                <button type="button" className={`${ui.primary} ${styles.wide}`} onClick={downloadPng}>
                  <Download aria-hidden="true" />
                  הורדת PNG
                </button>
                <button type="button" className={ui.secondary} onClick={downloadSvg}>
                  <Download aria-hidden="true" />
                  הורדת SVG
                </button>
                {canCopy ? (
                  <button type="button" className={ui.secondary} onClick={copySvg}>
                    <ClipboardCopy aria-hidden="true" />
                    העתקת SVG
                  </button>
                ) : null}
              </div>
            ) : null}
            <p className={ui.status} role="status" aria-live="polite">
              {status}
            </p>
            <p className={ui.note}>
              ברקוד עם מספר שהמצאתם מתאים לשימוש בתוך העסק. כדי למכור ברשתות או באמזון צריך מספר רשום
              מ-GS1. הכול נוצר בדפדפן שלכם, ושום פרט לא נשלח לשום מקום.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
