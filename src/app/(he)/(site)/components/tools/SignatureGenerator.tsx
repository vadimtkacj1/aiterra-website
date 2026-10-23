'use client'

/* eslint-disable @next/next/no-img-element */

import { useCallback, useEffect, useId, useRef, useState, type PointerEvent as ReactPointerEvent } from 'react'
import { preconnect } from 'react-dom'
import { ClipboardCopy, Download, PenLine, Trash2, Type, Undo2 } from 'lucide-react'
import {
  EXPORT_PADDING,
  MAX_EXPORT_SIDE,
  MAX_NAME_LENGTH,
  SAMPLE_NAME,
  TYPE_FONT_SIZE,
  alphaBounds,
  cropRect,
  cssFont,
  exportFrame,
  exportScales,
  farEnough,
  findStyle,
  fontFor,
  hasHebrew,
  inks,
  paintStrokes,
  pixelsPerInch,
  previewWidth,
  signatureFontsUrl,
  signatureStyles,
  signatureSvg,
  slantTransform,
  smoothWidth,
  startWidth,
  strokesBounds,
  targetWidth,
  thicknesses,
  typedCanvasLayout,
  withPixelDensity,
  type ExportScale,
  type InkId,
  type SignatureMode,
  type SignatureStyle,
  type Stroke,
  type ThicknessId,
} from '@/lib/signature'
import ui from './toolUi.module.css'
import styles from './SignatureGenerator.module.css'

type Rendered = { canvas: HTMLCanvasElement; factor: number }
type Preview = { url: string; width: number; height: number; display: number }
type Sample = { x: number; y: number; t: number; w: number }

const PREVIEW_DELAY_MS = 160
const FONT_TIMEOUT_MS = 6000
const TILE_FONT_TIMEOUT_MS = 3000

const modes: { value: SignatureMode; label: string; Icon: typeof PenLine }[] = [
  { value: 'draw', label: 'ציור ביד', Icon: PenLine },
  { value: 'type', label: 'הקלדת שם', Icon: Type },
]

const stylesheets = new Map<string, Promise<void>>()

function loadStylesheet(href: string) {
  const existing = stylesheets.get(href)
  if (existing) return existing
  const loaded = new Promise<void>((resolve) => {
    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href = href
    link.onload = () => resolve()
    link.onerror = () => resolve()
    document.head.appendChild(link)
  })
  stylesheets.set(href, loaded)
  return loaded
}

async function loadSignatureFont(style: SignatureStyle, text: string) {
  await loadStylesheet(signatureFontsUrl())
  const font = fontFor(style, text)
  const timeout = new Promise((resolve) => window.setTimeout(resolve, FONT_TIMEOUT_MS))
  await Promise.race([document.fonts.load(cssFont(font, TYPE_FONT_SIZE), text).catch(() => []), timeout])
}

function renderDrawn(strokes: Stroke[], base: number, color: string, scale: number): Rendered | null {
  const box = strokesBounds(strokes, base)
  if (!box) return null
  const frame = exportFrame(box, scale)
  const canvas = document.createElement('canvas')
  canvas.width = frame.width
  canvas.height = frame.height
  const context = canvas.getContext('2d')
  if (!context) return null
  context.setTransform(frame.factor, 0, 0, frame.factor, -frame.originX * frame.factor, -frame.originY * frame.factor)
  paintStrokes(context, strokes, base, color)
  return { canvas, factor: frame.factor }
}

async function renderTyped(text: string, style: SignatureStyle, color: string, scale: number) {
  const name = text.trim()
  if (!name) return null
  await loadSignatureFont(style, name)
  const font = fontFor(style, name)
  const rtl = hasHebrew(name)
  const probe = document.createElement('canvas').getContext('2d')
  if (!probe) return null
  probe.font = cssFont(font, TYPE_FONT_SIZE)
  const plain = typedCanvasLayout(probe.measureText(name).width, TYPE_FONT_SIZE, font.slant)
  const factor = Math.min(scale, MAX_EXPORT_SIDE / plain.width, MAX_EXPORT_SIDE / plain.height)
  const size = TYPE_FONT_SIZE * factor
  const layout = typedCanvasLayout(probe.measureText(name).width * factor, size, font.slant)
  const draft = document.createElement('canvas')
  draft.width = layout.width
  draft.height = layout.height
  const context = draft.getContext('2d', { willReadFrequently: true })
  if (!context) return null
  context.font = cssFont(font, size)
  context.direction = rtl ? 'rtl' : 'ltr'
  context.textAlign = 'center'
  context.textBaseline = 'alphabetic'
  context.fillStyle = color
  context.setTransform(1, 0, font.slant, 1, -font.slant * layout.baseline, 0)
  context.fillText(name, layout.centerX, layout.baseline)
  const pixels = context.getImageData(0, 0, layout.width, layout.height).data
  const box = alphaBounds(pixels, layout.width, layout.height)
  if (!box) return null
  const crop = cropRect(box, Math.round(EXPORT_PADDING * factor), layout.width, layout.height)
  const canvas = document.createElement('canvas')
  canvas.width = crop.width
  canvas.height = crop.height
  canvas.getContext('2d')?.drawImage(draft, crop.x, crop.y, crop.width, crop.height, 0, 0, crop.width, crop.height)
  draft.width = 0
  draft.height = 0
  return { canvas, factor }
}

async function pngBlob({ canvas, factor }: Rendered) {
  const blob = await new Promise<Blob>((resolve, reject) =>
    canvas.toBlob((result) => (result ? resolve(result) : reject(new Error('empty'))), 'image/png'),
  )
  const bytes = new Uint8Array(await blob.arrayBuffer())
  return new Blob([withPixelDensity(bytes, pixelsPerInch(factor))], { type: 'image/png' })
}

function saveBlob(blob: Blob, name: string) {
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = name
  document.body.appendChild(anchor)
  anchor.click()
  anchor.remove()
  window.setTimeout(() => URL.revokeObjectURL(url), 1000)
}

const strokesLabel = (count: number) =>
  count === 0 ? 'משטח החתימה, ריק' : `משטח החתימה, ${count === 1 ? 'קו אחד' : `${count} קווים`}`

function Choices<T extends string | number>({
  legend,
  name,
  options,
  value,
  onChange,
  swatches,
}: {
  legend: string
  name: string
  options: { value: T; label: string }[]
  value: T
  onChange: (value: T) => void
  swatches?: Partial<Record<string, string>>
}) {
  return (
    <fieldset className={ui.group}>
      <legend className={ui.legend}>{legend}</legend>
      <div className={styles.choices} data-count={options.length}>
        {options.map((option) => (
          <label key={String(option.value)} className={styles.choice}>
            <input
              type="radio"
              name={name}
              className={ui.checkbox}
              checked={value === option.value}
              onChange={() => onChange(option.value)}
            />
            {swatches?.[String(option.value)] ? (
              <span
                className={styles.swatch}
                style={{ background: swatches[String(option.value)] }}
                aria-hidden="true"
              />
            ) : null}
            <span>{option.label}</span>
          </label>
        ))}
      </div>
    </fieldset>
  )
}

export default function SignatureGenerator() {
  const [mode, setMode] = useState<SignatureMode>('draw')
  const [strokes, setStrokes] = useState<Stroke[]>([])
  const [ink, setInk] = useState<InkId>('black')
  const [thickness, setThickness] = useState<ThicknessId>('medium')
  const [name, setName] = useState('')
  const [styleId, setStyleId] = useState(signatureStyles[0].id)
  const [scale, setScale] = useState<ExportScale>(3)
  const [preview, setPreview] = useState<Preview | null>(null)
  const [status, setStatus] = useState('')
  const [canCopy, setCanCopy] = useState(false)
  const [fontsKey, setFontsKey] = useState('')
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const padRef = useRef<HTMLDivElement>(null)
  const strokesRef = useRef<Stroke[]>([])
  const currentRef = useRef<Stroke | null>(null)
  const lastRef = useRef<Sample | null>(null)
  const pointerRef = useRef<number | null>(null)
  const rectRef = useRef<DOMRect | null>(null)
  const frameRef = useRef(0)
  const sizeRef = useRef({ width: 0, height: 0, ratio: 1 })
  const settingsRef = useRef({ base: 0, color: '' })
  const baseId = useId()
  const modeName = `${baseId}-mode`
  const inkName = `${baseId}-ink`
  const thicknessName = `${baseId}-thickness`
  const scaleName = `${baseId}-scale`
  const styleName = `${baseId}-style`
  const padHintId = `${baseId}-pad-hint`
  const nameId = `${baseId}-name`
  const nameHintId = `${baseId}-name-hint`

  if (mode === 'type') {
    preconnect('https://fonts.googleapis.com')
    preconnect('https://fonts.gstatic.com', { crossOrigin: 'anonymous' })
  }

  const color = inks.find((item) => item.id === ink)?.color ?? inks[0].color
  const base = thicknesses.find((item) => item.id === thickness)?.width ?? thicknesses[1].width
  const style = findStyle(styleId)
  const trimmedName = name.trim()
  const sampleText = trimmedName || SAMPLE_NAME
  const sampleKey = hasHebrew(sampleText) ? 'he' : 'en'
  const hasSignature = mode === 'draw' ? strokes.length > 0 : trimmedName.length > 0

  const paint = useCallback(() => {
    frameRef.current = 0
    const canvas = canvasRef.current
    const context = canvas?.getContext('2d')
    if (!canvas || !context) return
    const { width, height, ratio } = sizeRef.current
    context.setTransform(1, 0, 0, 1, 0, 0)
    context.clearRect(0, 0, canvas.width, canvas.height)
    context.setTransform(ratio, 0, 0, ratio, 0, 0)
    const current = currentRef.current
    const all = current ? [...strokesRef.current, current] : strokesRef.current
    if (width && height) paintStrokes(context, all, settingsRef.current.base, settingsRef.current.color)
  }, [])

  const schedulePaint = useCallback(() => {
    if (!frameRef.current) frameRef.current = window.requestAnimationFrame(paint)
  }, [paint])

  useEffect(() => {
    setCanCopy(typeof ClipboardItem !== 'undefined' && typeof navigator.clipboard?.write === 'function')
    return () => {
      if (frameRef.current) window.cancelAnimationFrame(frameRef.current)
    }
  }, [])

  useEffect(() => {
    strokesRef.current = strokes
    settingsRef.current = { base, color }
    schedulePaint()
  }, [strokes, base, color, schedulePaint])

  useEffect(() => {
    if (mode !== 'draw') return
    const pad = padRef.current
    const canvas = canvasRef.current
    if (!pad || !canvas) return
    const resize = () => {
      const ratio = Math.min(window.devicePixelRatio || 1, 3)
      const width = pad.clientWidth
      const height = pad.clientHeight
      sizeRef.current = { width, height, ratio }
      canvas.width = Math.round(width * ratio)
      canvas.height = Math.round(height * ratio)
      paint()
    }
    resize()
    if (typeof ResizeObserver === 'undefined') return
    const observer = new ResizeObserver(resize)
    observer.observe(pad)
    return () => observer.disconnect()
  }, [mode, paint])

  useEffect(() => {
    if (mode !== 'type') return
    let cancelled = false
    const text = sampleKey === 'he' ? SAMPLE_NAME : 'Dana Cohen'
    loadStylesheet(signatureFontsUrl())
      .then(() =>
        Promise.race([
          Promise.all(
            signatureStyles.map((item) =>
              document.fonts.load(cssFont(sampleKey === 'he' ? item.hebrew : item.latin, 32), text).catch(() => []),
            ),
          ),
          new Promise((resolve) => window.setTimeout(resolve, TILE_FONT_TIMEOUT_MS)),
        ]),
      )
      .then(() => {
        if (!cancelled) setFontsKey(sampleKey)
      })
    return () => {
      cancelled = true
    }
  }, [mode, sampleKey])

  useEffect(() => {
    let cancelled = false
    const timer = window.setTimeout(
      () => {
        const job =
          mode === 'draw'
            ? Promise.resolve(renderDrawn(strokes, base, color, scale))
            : renderTyped(name, style, color, scale)
        job
          .then((rendered) => {
            if (cancelled) return
            if (!rendered) {
              setPreview(null)
              return
            }
            const { canvas, factor } = rendered
            setPreview({
              url: canvas.toDataURL('image/png'),
              width: canvas.width,
              height: canvas.height,
              display: previewWidth(canvas.width, factor),
            })
          })
          .catch(() => {
            if (!cancelled) setPreview(null)
          })
      },
      mode === 'type' ? PREVIEW_DELAY_MS : 0,
    )
    return () => {
      cancelled = true
      window.clearTimeout(timer)
    }
  }, [mode, strokes, base, color, name, style, scale])

  const pointFrom = (event: { clientX: number; clientY: number }) => {
    const rect = rectRef.current
    return rect ? { x: event.clientX - rect.left, y: event.clientY - rect.top } : null
  }

  const onPointerDown = (event: ReactPointerEvent<HTMLCanvasElement>) => {
    if (pointerRef.current !== null) return
    if (event.pointerType === 'mouse' && event.button !== 0) return
    event.preventDefault()
    event.currentTarget.setPointerCapture(event.pointerId)
    rectRef.current = event.currentTarget.getBoundingClientRect()
    const point = pointFrom(event)
    if (!point) return
    pointerRef.current = event.pointerId
    const w = startWidth({ pointerType: event.pointerType, pressure: event.pressure })
    currentRef.current = [{ ...point, w }]
    lastRef.current = { ...point, t: event.timeStamp, w }
    schedulePaint()
  }

  const addSample = (sample: PointerEvent) => {
    const point = pointFrom(sample)
    const last = lastRef.current
    const stroke = currentRef.current
    if (!point || !last || !stroke || !farEnough(last, point)) return
    const elapsed = Math.max(1, sample.timeStamp - last.t)
    const speed = Math.hypot(point.x - last.x, point.y - last.y) / elapsed
    const w = smoothWidth(last.w, targetWidth({ pointerType: sample.pointerType, pressure: sample.pressure, speed }))
    stroke.push({ ...point, w })
    lastRef.current = { ...point, t: sample.timeStamp, w }
  }

  const onPointerMove = (event: ReactPointerEvent<HTMLCanvasElement>) => {
    if (event.pointerId !== pointerRef.current) return
    event.preventDefault()
    const native = event.nativeEvent
    const coalesced = typeof native.getCoalescedEvents === 'function' ? native.getCoalescedEvents() : []
    for (const sample of coalesced.length ? coalesced : [native]) addSample(sample)
    schedulePaint()
  }

  const endStroke = (event: ReactPointerEvent<HTMLCanvasElement>) => {
    if (event.pointerId !== pointerRef.current) return
    pointerRef.current = null
    const stroke = currentRef.current
    currentRef.current = null
    lastRef.current = null
    if (stroke?.length) {
      const next = [...strokesRef.current, stroke]
      strokesRef.current = next
      setStrokes(next)
    }
  }

  const undo = () => {
    if (!strokes.length) {
      setStatus('אין קו לבטל')
      return
    }
    setStrokes(strokes.slice(0, -1))
    setStatus(strokes.length === 1 ? 'הקו בוטל, המשטח ריק' : 'הקו האחרון בוטל')
  }

  const clear = () => {
    if (!strokes.length) {
      setStatus('המשטח כבר ריק')
      return
    }
    setStrokes([])
    setStatus('המשטח נוקה')
  }

  const chooseMode = (next: SignatureMode) => {
    setMode(next)
    setPreview(null)
    setStatus('')
  }

  const render = (factor: number) =>
    mode === 'draw' ? Promise.resolve(renderDrawn(strokes, base, color, factor)) : renderTyped(name, style, color, factor)

  const emptyMessage = mode === 'draw' ? 'קודם ציירו חתימה על המשטח.' : 'קודם הקלידו את השם.'

  const downloadPng = async () => {
    try {
      const rendered = await render(scale)
      if (!rendered) {
        setStatus(emptyMessage)
        return
      }
      saveBlob(await pngBlob(rendered), 'signature.png')
      setStatus(`קובץ PNG שקוף ירד, ${rendered.canvas.width}×${rendered.canvas.height} פיקסלים.`)
      window.gtag?.('event', 'signature_download', { mode, format: 'png' })
    } catch {
      setStatus('לא הצלחנו ליצור את הקובץ. נסו שוב.')
    }
  }

  const downloadSvg = () => {
    const svg = signatureSvg(strokes, base, color)
    if (!svg) {
      setStatus(emptyMessage)
      return
    }
    saveBlob(new Blob([svg], { type: 'image/svg+xml;charset=utf-8' }), 'signature.svg')
    setStatus('קובץ SVG ירד.')
    window.gtag?.('event', 'signature_download', { mode, format: 'svg' })
  }

  const copyImage = async () => {
    try {
      const blob = render(scale).then((rendered) => {
        if (!rendered) throw new Error('empty')
        return pngBlob(rendered)
      })
      await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })])
      setStatus('התמונה הועתקה. אפשר להדביק אותה ב-Word, ב-Google Docs או במייל.')
      window.gtag?.('event', 'signature_copy', { mode })
    } catch {
      setStatus('ההעתקה לא עבדה בדפדפן הזה. הורידו את קובץ ה-PNG במקום.')
    }
  }

  const previewAlt =
    mode === 'draw'
      ? 'החתימה שציירתם, על שורת החתימה במסמך לדוגמה'
      : `החתימה ${trimmedName} בסגנון ${style.label}, על שורת החתימה במסמך לדוגמה`

  return (
    <section className={ui.tool} aria-label="יצירת חתימה">
      <div className={ui.inner}>
        <form className={ui.form} onSubmit={(event) => event.preventDefault()}>
          <fieldset className={ui.group}>
            <legend className={ui.legend}>איך ליצור את החתימה</legend>
            <div className={styles.modes}>
              {modes.map(({ value, label, Icon }) => (
                <label key={value} className={styles.mode}>
                  <input
                    type="radio"
                    name={modeName}
                    className={styles.modeInput}
                    checked={mode === value}
                    onChange={() => chooseMode(value)}
                  />
                  <Icon className={styles.modeIcon} aria-hidden="true" />
                  <span>{label}</span>
                </label>
              ))}
            </div>
          </fieldset>

          {mode === 'draw' ? (
            <div className={ui.group}>
              <p id={padHintId} className={ui.hint}>
                חתמו במסגרת עם העכבר, באצבע או בעט. מי שמעדיף מקלדת יכול לבחור ״הקלדת שם״ למעלה.
              </p>
              <div ref={padRef} className={styles.pad}>
                <canvas
                  ref={canvasRef}
                  className={styles.canvas}
                  role="img"
                  aria-label={strokesLabel(strokes.length)}
                  aria-describedby={padHintId}
                  onPointerDown={onPointerDown}
                  onPointerMove={onPointerMove}
                  onPointerUp={endStroke}
                  onPointerCancel={endStroke}
                  onLostPointerCapture={endStroke}
                />
                <span className={styles.signLine} aria-hidden="true" />
                <span className={styles.signMark} aria-hidden="true">
                  ✕
                </span>
                {strokes.length === 0 ? (
                  <span className={styles.padPrompt} aria-hidden="true">
                    חתמו כאן
                  </span>
                ) : null}
              </div>
              <div className={styles.padActions}>
                <button
                  type="button"
                  className={ui.secondary}
                  aria-disabled={strokes.length === 0}
                  onClick={undo}
                >
                  <Undo2 className={styles.flip} aria-hidden="true" />
                  ביטול הקו האחרון
                </button>
                <button
                  type="button"
                  className={ui.secondary}
                  aria-disabled={strokes.length === 0}
                  onClick={clear}
                >
                  <Trash2 aria-hidden="true" />
                  ניקוי
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className={ui.group}>
                <div className={ui.field}>
                  <label htmlFor={nameId} className={ui.legend}>
                    השם שלכם
                  </label>
                  <p id={nameHintId} className={ui.hint}>
                    בעברית או באנגלית. השם נשאר במכשיר שלכם.
                  </p>
                  <input
                    id={nameId}
                    className={ui.input}
                    dir={name ? 'auto' : 'rtl'}
                    autoComplete="name"
                    maxLength={MAX_NAME_LENGTH}
                    placeholder={SAMPLE_NAME}
                    aria-describedby={nameHintId}
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                  />
                </div>
              </div>
              <fieldset className={ui.group}>
                <legend className={ui.legend}>סגנון כתב היד</legend>
                <div className={styles.styleGrid}>
                  {signatureStyles.map((item) => {
                    const font = fontFor(item, sampleText)
                    return (
                      <label key={item.id} className={styles.styleTile}>
                        <input
                          type="radio"
                          name={styleName}
                          className={styles.modeInput}
                          checked={styleId === item.id}
                          onChange={() => setStyleId(item.id)}
                        />
                        <span
                          className={styles.styleSample}
                          dir="auto"
                          aria-hidden="true"
                          data-ready={fontsKey === sampleKey}
                          data-empty={!trimmedName}
                        >
                          <span
                            className={styles.styleText}
                            style={{
                              fontFamily: `"${font.family}", cursive`,
                              fontWeight: font.weight,
                              transform: slantTransform(font.slant),
                            }}
                          >
                            {sampleText}
                          </span>
                        </span>
                        <span className={styles.styleLabel}>{item.label}</span>
                      </label>
                    )
                  })}
                </div>
              </fieldset>
            </>
          )}

          <Choices
            legend="צבע הדיו"
            name={inkName}
            options={inks.map((item) => ({ value: item.id, label: item.label }))}
            value={ink}
            onChange={setInk}
            swatches={Object.fromEntries(inks.map((item) => [item.id, item.color]))}
          />

          {mode === 'draw' ? (
            <Choices
              legend="עובי הקו"
              name={thicknessName}
              options={thicknesses.map((item) => ({ value: item.id, label: item.label }))}
              value={thickness}
              onChange={setThickness}
            />
          ) : null}
        </form>

        <div className={ui.output}>
          <div className={ui.sticky}>
            <h2 className={ui.outputTitle}>החתימה שלכם</h2>
            <div className={styles.paper}>
              <p className={styles.docText}>
                הריני לאשר כי קראתי את המסמך, הבנתי את תוכנו ואני מסכים לאמור בו.
              </p>
              <div className={styles.signRow}>
                <span className={styles.docLabel}>חתימה:</span>
                <span className={styles.slot}>
                  {preview ? (
                    <img
                      src={preview.url}
                      alt={previewAlt}
                      className={styles.signImage}
                      style={{ width: preview.display }}
                      draggable={false}
                    />
                  ) : (
                    <span className={styles.slotEmpty}>
                      {mode === 'draw' ? 'החתימה שתציירו תופיע כאן' : 'השם שתקלידו יופיע כאן'}
                    </span>
                  )}
                </span>
              </div>
            </div>
            {preview ? (
              <p className={styles.caption}>
                קובץ PNG עם רקע שקוף,{' '}
                <span dir="ltr">
                  {preview.width}×{preview.height}
                </span>{' '}
                פיקסלים
              </p>
            ) : null}

            <Choices
              legend="רזולוציה"
              name={scaleName}
              options={exportScales}
              value={scale}
              onChange={setScale}
            />

            {hasSignature && preview ? (
              <div className={ui.actions}>
                <button type="button" className={`${ui.primary} ${styles.wide}`} onClick={downloadPng}>
                  <Download aria-hidden="true" />
                  הורדת PNG
                </button>
                {mode === 'draw' ? (
                  <button type="button" className={ui.secondary} onClick={downloadSvg}>
                    <Download aria-hidden="true" />
                    הורדת SVG
                  </button>
                ) : null}
                {canCopy ? (
                  <button type="button" className={ui.secondary} onClick={copyImage}>
                    <ClipboardCopy aria-hidden="true" />
                    העתקת התמונה
                  </button>
                ) : null}
              </div>
            ) : null}
            <p className={ui.status} role="status" aria-live="polite">
              {status}
            </p>
            {mode === 'type' ? (
              <p className={ui.note}>
                בהקלדת שם יורד קובץ PNG בלבד. קובץ SVG של טקסט צריך את הפונט עצמו, ובמחשב שאין בו את הפונט החתימה
                הייתה מוצגת בכתב אחר.
              </p>
            ) : null}
            <p className={ui.note}>
              החתימה נוצרת בדפדפן שלכם ולא נשלחת לשום שרת. אנחנו לא שומרים אותה, וכשסוגרים את הדף היא נמחקת.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
