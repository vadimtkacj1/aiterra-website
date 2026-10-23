'use client'

/* eslint-disable @next/next/no-img-element */

import {
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type CSSProperties,
  type DragEvent as ReactDragEvent,
  type KeyboardEvent as ReactKeyboardEvent,
  type PointerEvent as ReactPointerEvent,
} from 'react'
import { Download, Expand, ImagePlus, Minus, Plus, ScanLine, Shrink, TriangleAlert } from 'lucide-react'
import { ACCEPT, MAX_QUALITY, MIN_QUALITY, QUALITY_STEP, formatBytes, isHeif, isImageFile, sourceTypeOf } from '@/lib/image-compressor'
import {
  DEFAULT_PRESET_ID,
  MAX_ZOOM,
  UPSCALE_WARNING,
  aspectOf,
  clampCrop,
  cropRect,
  defaultCrop,
  dimensions,
  drawPlan,
  exportFileName,
  exportTypes,
  fitCrop,
  fitZoom,
  formatFromType,
  moveCrop,
  percent,
  platformLabel,
  platforms,
  presetById,
  presetName,
  presetsFor,
  previewBox,
  socialPresets,
  splitDimensions,
  zoomCrop,
  type Crop,
  type DrawPlan,
  type ExportFormat,
  type PlatformId,
  type SocialPreset,
} from '@/lib/social-image-sizes'
import ui from './toolUi.module.css'
import styles from './SocialImageResizer.module.css'

type Source = {
  name: string
  type: string
  url: string
  image: CanvasImageSource
  width: number
  height: number
  release: () => void
}

type Background = 'white' | 'black' | 'transparent' | 'custom'
type Estimate = { key: string; bytes: number; type: string }
type Point = { x: number; y: number }

const DEFAULT_QUALITY = 90
const ESTIMATE_DELAY_MS = 350
const DOWNLOAD_GAP_MS = 450
const ZOOM_STEP = 1.1
const MOVE_STEP = 0.02
const MOVE_STEP_LARGE = 0.1
const REVOKE_DELAY_MS = 10000
const ALPHA_TYPES = ['image/png', 'image/webp', 'image/gif', 'image/avif']

const fallbackPreset = socialPresets[0]

const formatOptions: { value: ExportFormat; label: string; hint: string }[] = [
  { value: 'jpeg', label: 'JPEG', hint: 'מתאים לכל הרשתות' },
  { value: 'png', label: 'PNG', hint: 'ללוגו, לטקסט ולשקיפות' },
  { value: 'webp', label: 'WebP', hint: 'לאתרים. רוב הרשתות מבקשות JPG או PNG' },
]

const backgroundOptions: { value: Background; label: string }[] = [
  { value: 'white', label: 'לבן' },
  { value: 'black', label: 'שחור' },
  { value: 'transparent', label: 'שקוף' },
  { value: 'custom', label: 'צבע אחר' },
]

const formatLabels: Record<ExportFormat, string> = { jpeg: 'JPEG', png: 'PNG', webp: 'WebP' }

const wait = (ms: number) => new Promise((resolve) => window.setTimeout(resolve, ms))

const filesCount = (count: number) => (count === 1 ? 'קובץ אחד' : `${count} קבצים`)

function fillColor(background: Background, custom: string, format: ExportFormat) {
  if (background === 'black') return '#000000'
  if (background === 'custom') return custom
  if (background === 'transparent' && format !== 'jpeg') return null
  return '#ffffff'
}

async function decodeBitmap(file: File, url: string): Promise<Source | null> {
  if (typeof createImageBitmap !== 'function') return null
  try {
    const bitmap = await createImageBitmap(file, { imageOrientation: 'from-image' })
    return {
      name: file.name,
      type: sourceTypeOf(file),
      url,
      image: bitmap,
      width: bitmap.width,
      height: bitmap.height,
      release: () => {
        bitmap.close()
        URL.revokeObjectURL(url)
      },
    }
  } catch {
    return null
  }
}

async function decodeElement(file: File, url: string): Promise<Source | null> {
  const image = new Image()
  image.src = url
  try {
    await image.decode()
    return {
      name: file.name,
      type: sourceTypeOf(file),
      url,
      image,
      width: image.naturalWidth,
      height: image.naturalHeight,
      release: () => URL.revokeObjectURL(url),
    }
  } catch {
    return null
  }
}

async function decodeFile(file: File): Promise<Source | null> {
  const url = URL.createObjectURL(file)
  const decoded = (await decodeBitmap(file, url)) ?? (await decodeElement(file, url))
  if (!decoded || !decoded.width || !decoded.height) {
    URL.revokeObjectURL(url)
    return null
  }
  return decoded
}

function reduce(image: CanvasImageSource, plan: DrawPlan) {
  let current = image
  let { sx, sy, sw, sh } = plan
  const canvases: HTMLCanvasElement[] = []
  while (sw / plan.dw > 2 && sh / plan.dh > 2) {
    const width = Math.max(1, Math.round(sw / 2))
    const height = Math.max(1, Math.round(sh / 2))
    const canvas = document.createElement('canvas')
    canvas.width = width
    canvas.height = height
    const context = canvas.getContext('2d')
    if (!context) break
    context.imageSmoothingEnabled = true
    context.imageSmoothingQuality = 'high'
    context.drawImage(current, sx, sy, sw, sh, 0, 0, width, height)
    canvases.push(canvas)
    current = canvas
    sx = 0
    sy = 0
    sw = width
    sh = height
  }
  const release = () =>
    canvases.forEach((canvas) => {
      canvas.width = 0
      canvas.height = 0
    })
  return { image: current, sx, sy, sw, sh, release }
}

function renderBlob(
  source: Source,
  preset: SocialPreset,
  crop: Crop,
  format: ExportFormat,
  quality: number,
  fill: string | null,
): Promise<Blob | null> {
  const canvas = document.createElement('canvas')
  canvas.width = preset.width
  canvas.height = preset.height
  const context = canvas.getContext('2d')
  if (!context) return Promise.resolve(null)
  const plan = drawPlan(crop, source.width, source.height, preset.width, preset.height)
  try {
    if (fill) {
      context.fillStyle = fill
      context.fillRect(0, 0, preset.width, preset.height)
    }
    if (plan.sw > 0 && plan.sh > 0) {
      const reduced = reduce(source.image, plan)
      context.imageSmoothingEnabled = true
      context.imageSmoothingQuality = 'high'
      context.drawImage(reduced.image, reduced.sx, reduced.sy, reduced.sw, reduced.sh, plan.dx, plan.dy, plan.dw, plan.dh)
      reduced.release()
    }
  } catch {
    return Promise.resolve(null)
  }
  return new Promise((resolve) => {
    canvas.toBlob(
      (blob) => {
        canvas.width = 0
        canvas.height = 0
        resolve(blob)
      },
      exportTypes[format],
      quality / 100,
    )
  })
}

function saveBlob(blob: Blob, name: string) {
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = name
  document.body.appendChild(link)
  link.click()
  link.remove()
  window.setTimeout(() => URL.revokeObjectURL(url), REVOKE_DELAY_MS)
}

function BidiText({ text }: { text: string }) {
  return splitDimensions(text).map((part, index) =>
    part.ltr ? (
      <span key={index} dir="ltr">
        {part.text}
      </span>
    ) : (
      part.text
    ),
  )
}

function ShapeIcon({ preset }: { preset: SocialPreset }) {
  const aspect = aspectOf(preset)
  const style = {
    inlineSize: `${aspect >= 1 ? 100 : aspect * 100}%`,
    blockSize: `${aspect >= 1 ? 100 / aspect : 100}%`,
    borderRadius: preset.circle ? '999px' : undefined,
  } as CSSProperties
  return (
    <span className={styles.shape} aria-hidden="true">
      <span className={styles.shapeFill} style={style} />
    </span>
  )
}

function Cropper({
  preset,
  source,
  crop,
  fill,
  safeZone,
  fileInputId,
  instructionsId,
  onCrop,
  onAnnounce,
}: {
  preset: SocialPreset
  source: Source | null
  crop: Crop | null
  fill: string | null
  safeZone: boolean
  fileInputId: string
  instructionsId: string
  onCrop: (update: (current: Crop) => Crop) => void
  onAnnounce: (text: string) => void
}) {
  const frameRef = useRef<HTMLDivElement>(null)
  const pointers = useRef(new Map<number, Point>())
  const pinch = useRef<{ distance: number; zoom: number } | null>(null)
  const aspect = aspectOf(preset)
  const frameStyle = { '--aspect': aspect } as CSSProperties

  useEffect(() => {
    const node = frameRef.current
    if (!node || !source) return
    const onWheel = (event: WheelEvent) => {
      if (!event.ctrlKey) return
      event.preventDefault()
      const factor = Math.exp(-event.deltaY * 0.01)
      onCrop((current) => zoomCrop(current, current.zoom * factor, source.width, source.height, aspect))
    }
    node.addEventListener('wheel', onWheel, { passive: false })
    return () => node.removeEventListener('wheel', onWheel)
  }, [source, aspect, onCrop])

  const overlay = (
    <>
      {safeZone && preset.safeZone ? (
        <span className={styles.safeZone} aria-hidden="true">
          <span className={styles.safeTop} style={{ blockSize: percent(preset.safeZone.top) }} />
          <span className={styles.safeBottom} style={{ blockSize: percent(preset.safeZone.bottom) }} />
          {preset.safeZone.side ? (
            <>
              <span
                className={styles.safeSideStart}
                style={{
                  inlineSize: percent(preset.safeZone.side),
                  insetBlock: `${percent(preset.safeZone.top)} ${percent(preset.safeZone.bottom)}`,
                }}
              />
              <span
                className={styles.safeSideEnd}
                style={{
                  inlineSize: percent(preset.safeZone.side),
                  insetBlock: `${percent(preset.safeZone.top)} ${percent(preset.safeZone.bottom)}`,
                }}
              />
            </>
          ) : null}
          <span
            className={styles.safeBox}
            style={{
              insetBlock: `${percent(preset.safeZone.top)} ${percent(preset.safeZone.bottom)}`,
              insetInline: percent(preset.safeZone.side),
            }}
          />
        </span>
      ) : null}
      {preset.circle ? <span className={styles.circle} aria-hidden="true" /> : null}
    </>
  )

  if (!source || !crop) {
    return (
      <div className={styles.stage}>
        <label htmlFor={fileInputId} className={`${styles.frame} ${styles.frameEmpty}`} style={frameStyle} dir="ltr">
          {overlay}
          <span className={styles.emptyText} dir="rtl">
            <ImagePlus aria-hidden="true" />
            <span>בחרו תמונה</span>
            <span dir="ltr" className={styles.emptyDims}>
              {dimensions(preset)}
            </span>
          </span>
        </label>
      </div>
    )
  }

  const box = previewBox(crop, source.width, source.height, aspect)

  const moveBy = (deltaX: number, deltaY: number) =>
    onCrop((current) => moveCrop(current, deltaX, deltaY, source.width, source.height, aspect))

  const zoomTo = (zoom: number) =>
    onCrop((current) => zoomCrop(current, zoom, source.width, source.height, aspect))

  const onPointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.pointerType === 'mouse' && event.button !== 0) return
    event.currentTarget.setPointerCapture(event.pointerId)
    pointers.current.set(event.pointerId, { x: event.clientX, y: event.clientY })
    if (pointers.current.size === 2) {
      const [first, second] = [...pointers.current.values()]
      pinch.current = { distance: Math.hypot(first.x - second.x, first.y - second.y) || 1, zoom: crop.zoom }
    }
  }

  const onPointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    const previous = pointers.current.get(event.pointerId)
    if (!previous) return
    const next = { x: event.clientX, y: event.clientY }
    pointers.current.set(event.pointerId, next)
    if (pointers.current.size === 1) {
      const frameWidth = event.currentTarget.getBoundingClientRect().width || 1
      const scale = cropRect(crop, source.width, source.height, aspect).width / frameWidth
      moveBy(-(next.x - previous.x) * scale, -(next.y - previous.y) * scale)
    } else if (pointers.current.size === 2 && pinch.current) {
      const [first, second] = [...pointers.current.values()]
      const distance = Math.hypot(first.x - second.x, first.y - second.y)
      zoomTo((pinch.current.zoom * distance) / pinch.current.distance)
    }
  }

  const onPointerEnd = (event: ReactPointerEvent<HTMLDivElement>) => {
    pointers.current.delete(event.pointerId)
    if (pointers.current.size < 2) pinch.current = null
  }

  const onKeyDown = (event: ReactKeyboardEvent<HTMLDivElement>) => {
    const rect = cropRect(crop, source.width, source.height, aspect)
    const step = event.shiftKey ? MOVE_STEP_LARGE : MOVE_STEP
    const zoomAndAnnounce = (zoom: number) => {
      const next = zoomCrop(crop, zoom, source.width, source.height, aspect)
      onCrop(() => next)
      onAnnounce(`זום ${percent(next.zoom)}`)
    }
    switch (event.key) {
      case 'ArrowLeft':
        moveBy(rect.width * step, 0)
        break
      case 'ArrowRight':
        moveBy(-rect.width * step, 0)
        break
      case 'ArrowUp':
        moveBy(0, rect.height * step)
        break
      case 'ArrowDown':
        moveBy(0, -rect.height * step)
        break
      case '+':
      case '=':
        zoomAndAnnounce(crop.zoom * ZOOM_STEP)
        break
      case '-':
      case '_':
        zoomAndAnnounce(crop.zoom / ZOOM_STEP)
        break
      case '0':
        onCrop(() => defaultCrop(source.width, source.height))
        onAnnounce('החיתוך חזר למרכז')
        break
      default:
        return
    }
    event.preventDefault()
  }

  return (
    <div className={styles.stage}>
      <div
        ref={frameRef}
        className={styles.frame}
        style={{ ...frameStyle, backgroundColor: fill ?? undefined }}
        data-transparent={fill ? undefined : 'true'}
        dir="ltr"
        role="application"
        aria-roledescription="אזור חיתוך"
        aria-label={`חיתוך התמונה ל${presetName(preset)}, ${dimensions(preset)}`}
        aria-describedby={instructionsId}
        tabIndex={0}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerEnd}
        onPointerCancel={onPointerEnd}
        onKeyDown={onKeyDown}
      >
        <img
          className={styles.picture}
          src={source.url}
          alt=""
          draggable={false}
          style={{
            insetInlineStart: `${box.left}%`,
            insetBlockStart: `${box.top}%`,
            inlineSize: `${box.width}%`,
            blockSize: `${box.height}%`,
          }}
        />
        {overlay}
      </div>
    </div>
  )
}

export default function SocialImageResizer() {
  const [source, setSource] = useState<Source | null>(null)
  const [loading, setLoading] = useState(false)
  const [platform, setPlatform] = useState<PlatformId>('instagram')
  const [activeId, setActiveId] = useState(DEFAULT_PRESET_ID)
  const [crops, setCrops] = useState<Record<string, Crop>>({})
  const [format, setFormat] = useState<ExportFormat>('jpeg')
  const [quality, setQuality] = useState(DEFAULT_QUALITY)
  const [background, setBackground] = useState<Background>('white')
  const [customColor, setCustomColor] = useState('#2447d6')
  const [safeZone, setSafeZone] = useState(true)
  const [batch, setBatch] = useState<string[]>([])
  const [estimate, setEstimate] = useState<Estimate | null>(null)
  const [busy, setBusy] = useState(false)
  const [dragging, setDragging] = useState(false)
  const [webpSupported, setWebpSupported] = useState(true)
  const [notice, setNotice] = useState('')
  const [announcement, setAnnouncement] = useState('')
  const sourceRef = useRef<Source | null>(null)
  const lastBlob = useRef<{ key: string; blob: Blob } | null>(null)
  const loadJob = useRef(0)
  const baseId = useId()
  const fileInputId = `${baseId}-file`
  const dropHintId = `${baseId}-drop-hint`
  const qualityId = `${baseId}-quality`
  const zoomId = `${baseId}-zoom`
  const instructionsId = `${baseId}-instructions`
  const colorId = `${baseId}-color`

  const preset = presetById(activeId) ?? fallbackPreset
  const aspect = aspectOf(preset)
  const fill = fillColor(background, customColor, format)

  const crop = useMemo(() => {
    if (!source) return null
    const saved = crops[preset.id] ?? defaultCrop(source.width, source.height)
    return clampCrop(saved, source.width, source.height, aspectOf(preset))
  }, [crops, preset, source])

  const plan = source && crop ? drawPlan(crop, source.width, source.height, preset.width, preset.height) : null

  const estimateKey =
    source && crop
      ? [source.url, preset.id, crop.cx.toFixed(2), crop.cy.toFixed(2), crop.zoom.toFixed(4), format, quality, fill ?? '']
          .map(String)
          .join('|')
      : ''

  useEffect(() => {
    const canvas = document.createElement('canvas')
    canvas.width = 1
    canvas.height = 1
    const supported = canvas.toDataURL('image/webp').startsWith('data:image/webp')
    setWebpSupported(supported)
    if (!supported) setFormat((current) => (current === 'webp' ? 'jpeg' : current))

    const guard = (event: DragEvent) => {
      if (event.dataTransfer?.types.includes('Files')) event.preventDefault()
    }
    window.addEventListener('dragover', guard)
    window.addEventListener('drop', guard)
    return () => {
      window.removeEventListener('dragover', guard)
      window.removeEventListener('drop', guard)
      sourceRef.current?.release()
      sourceRef.current = null
    }
  }, [])

  useEffect(() => {
    if (!source || !crop) return
    let cancelled = false
    const timer = window.setTimeout(() => {
      renderBlob(source, preset, crop, format, quality, fill)
        .catch(() => null)
        .then((blob) => {
          if (cancelled || !blob) return
          lastBlob.current = { key: estimateKey, blob }
          setEstimate({ key: estimateKey, bytes: blob.size, type: blob.type })
        })
    }, ESTIMATE_DELAY_MS)
    return () => {
      cancelled = true
      window.clearTimeout(timer)
    }
  }, [estimateKey, source, preset, crop, format, quality, fill])

  const loadFile = async (file: File) => {
    if (!isImageFile(file)) {
      setNotice('הקובץ שבחרתם הוא לא תמונה. בחרו JPEG, PNG או WebP.')
      return
    }
    const job = loadJob.current + 1
    loadJob.current = job
    setLoading(true)
    setNotice('')
    const decoded = await decodeFile(file)
    if (loadJob.current !== job) {
      decoded?.release()
      return
    }
    setLoading(false)
    if (!decoded) {
      setNotice(
        isHeif(file)
          ? 'הדפדפן הזה לא פותח קובצי HEIC. שמרו את התמונה כ-JPEG ונסו שוב.'
          : 'הדפדפן לא הצליח לפתוח את הקובץ. שמרו אותו כ-JPEG או PNG ונסו שוב.',
      )
      return
    }
    sourceRef.current?.release()
    sourceRef.current = decoded
    lastBlob.current = null
    setSource(decoded)
    setCrops({})
    setEstimate(null)
    setNotice(`התמונה נטענה: ${decoded.width} על ${decoded.height} פיקסלים.`)
  }

  const loadFirst = (files: FileList | File[] | null | undefined) => {
    const list = Array.from(files ?? [])
    const image = list.find(isImageFile)
    if (image) {
      void loadFile(image)
      return
    }
    if (list.length) setNotice('הקובץ שבחרתם הוא לא תמונה. בחרו JPEG, PNG או WebP.')
  }

  const loadFirstRef = useRef(loadFirst)
  useEffect(() => {
    loadFirstRef.current = loadFirst
  })

  useEffect(() => {
    const onPaste = (event: ClipboardEvent) => {
      const files = Array.from(event.clipboardData?.files ?? []).filter(isImageFile)
      if (!files.length) return
      event.preventDefault()
      loadFirstRef.current(files)
    }
    window.addEventListener('paste', onPaste)
    return () => window.removeEventListener('paste', onPaste)
  }, [])

  const onPick = (event: ChangeEvent<HTMLInputElement>) => {
    loadFirst(event.target.files)
    event.target.value = ''
  }

  const onDragOver = (event: ReactDragEvent<HTMLElement>) => {
    if (!event.dataTransfer.types.includes('Files')) return
    event.preventDefault()
    event.dataTransfer.dropEffect = 'copy'
    if (!dragging) setDragging(true)
  }

  const onDragLeave = (event: ReactDragEvent<HTMLElement>) => {
    if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setDragging(false)
  }

  const onDrop = (event: ReactDragEvent<HTMLElement>) => {
    event.preventDefault()
    setDragging(false)
    loadFirst(event.dataTransfer.files)
  }

  const updateCrop = useMemo(
    () => (update: (current: Crop) => Crop) => {
      const current = sourceRef.current
      if (!current) return
      setCrops((all) => {
        const saved = all[activeId] ?? defaultCrop(current.width, current.height)
        const target = presetById(activeId) ?? fallbackPreset
        const next = clampCrop(update(saved), current.width, current.height, aspectOf(target))
        return { ...all, [activeId]: next }
      })
    },
    [activeId],
  )

  const choosePlatform = (next: PlatformId) => {
    setPlatform(next)
    const first = presetsFor(next)[0]
    if (first) setActiveId(first.id)
  }

  const chooseFormat = (next: ExportFormat) => {
    setFormat(next)
    if (next === 'jpeg' && background === 'transparent') setBackground('white')
  }

  const toggleBatch = (id: string) =>
    setBatch((current) => (current.includes(id) ? current.filter((item) => item !== id) : [...current, id]))

  const track = (target: SocialPreset, blobType: string) => {
    window.gtag?.('event', 'social_resize_download', {
      preset: target.id,
      format: formatFromType(blobType) ?? format,
    })
  }

  const downloadActive = async () => {
    if (!source || !crop) return
    const cached = lastBlob.current?.key === estimateKey ? lastBlob.current.blob : null
    const blob = cached ?? (await renderBlob(source, preset, crop, format, quality, fill).catch(() => null))
    if (!blob) {
      setNotice('לא הצלחנו ליצור את הקובץ. נסו גודל אחר או פורמט JPEG.')
      return
    }
    const name = exportFileName(source.name, preset, formatFromType(blob.type) ?? format)
    saveBlob(blob, name)
    setNotice(`הקובץ ${name} ירד`)
    track(preset, blob.type)
  }

  const downloadBatch = async () => {
    if (!source || busy) return
    const chosen = socialPresets.filter((item) => batch.includes(item.id))
    if (!chosen.length) return
    setBusy(true)
    setNotice(
      chosen.length > 1
        ? `מוריד ${chosen.length} קבצים, אחד אחרי השני. אם הדפדפן שואל אם לאפשר הורדה של כמה קבצים, אשרו.`
        : 'מוריד קובץ אחד',
    )
    let saved = 0
    for (const [index, item] of chosen.entries()) {
      const itemCrop = clampCrop(
        crops[item.id] ?? defaultCrop(source.width, source.height),
        source.width,
        source.height,
        aspectOf(item),
      )
      const blob = await renderBlob(source, item, itemCrop, format, quality, fill).catch(() => null)
      if (blob) {
        saveBlob(blob, exportFileName(source.name, item, formatFromType(blob.type) ?? format))
        track(item, blob.type)
        saved += 1
      }
      if (index < chosen.length - 1) await wait(DOWNLOAD_GAP_MS)
    }
    setBusy(false)
    setNotice(
      saved === chosen.length
        ? `${filesCount(saved)} ירדו למחשב`
        : `${filesCount(saved)} ירדו. ${filesCount(chosen.length - saved)} לא נוצרו, נסו פורמט JPEG.`,
    )
  }

  const zoomPercent = crop ? Math.round(crop.zoom * 100) : 100
  const minZoomPercent = source ? Math.ceil(fitZoom(source.width, source.height, aspect) * 100) : 100
  const qualityApplies = format !== 'png'
  const estimateReady = estimate && estimate.key === estimateKey ? estimate : null
  const savedFormat = estimateReady ? formatFromType(estimateReady.type) : null
  const showBackground =
    Boolean(source) && (Boolean(plan && !plan.covers) || ALPHA_TYPES.includes(source?.type ?? ''))
  const overLimit = estimateReady && preset.maxBytes && estimateReady.bytes > preset.maxBytes ? preset : null
  const upscale = plan && plan.upscale > UPSCALE_WARNING ? plan.upscale : null

  return (
    <section
      className={ui.tool}
      aria-label="שינוי גודל תמונה לרשתות החברתיות"
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
    >
      <div className={ui.inner}>
        <form className={ui.form} onSubmit={(event) => event.preventDefault()}>
          <div className={`${ui.group} ${styles.dropGroup}`}>
            <label className={styles.drop} data-dragging={dragging} data-compact={Boolean(source)}>
              <input
                id={fileInputId}
                type="file"
                accept={ACCEPT}
                className={styles.fileInput}
                aria-describedby={dropHintId}
                onChange={onPick}
              />
              <span className={styles.dropIcon} aria-hidden="true">
                <ImagePlus />
              </span>
              <span className={styles.dropTitle}>{source ? 'החלפת תמונה' : 'בחירת תמונה'}</span>
              <span id={dropHintId} className={styles.dropText}>
                {source ? (
                  <>
                    <bdi className={styles.sourceName}>{source.name}</bdi>{' '}
                    <span dir="ltr">
                      {source.width}×{source.height}
                    </span>
                  </>
                ) : (
                  <>
                    <span className={styles.dragHint}>אפשר גם לגרור לכאן או להדביק עם Ctrl+V. </span>
                    JPEG, PNG או WebP.
                  </>
                )}
              </span>
            </label>
          </div>

          <fieldset className={ui.group}>
            <legend className={ui.legend}>לאן התמונה</legend>
            <div className={styles.platforms}>
              {platforms.map((item) => (
                <label key={item.id} className={styles.platform}>
                  <input
                    type="radio"
                    name={`${baseId}-platform`}
                    className={styles.hiddenInput}
                    checked={platform === item.id}
                    onChange={() => choosePlatform(item.id)}
                  />
                  <span>{item.label}</span>
                </label>
              ))}
            </div>
          </fieldset>

          <fieldset className={ui.group}>
            <legend className={ui.legend}>גודל ב{platformLabel(platform)}</legend>
            <div className={styles.presets}>
              {presetsFor(platform).map((item) => (
                <label key={item.id} className={styles.preset}>
                  <input
                    type="radio"
                    name={`${baseId}-preset`}
                    className={ui.checkbox}
                    checked={activeId === item.id}
                    onChange={() => setActiveId(item.id)}
                  />
                  <ShapeIcon preset={item} />
                  <span className={styles.presetText}>
                    <span className={styles.presetLabel}>{item.label}</span>
                    <span className={styles.presetMeta}>
                      <span dir="ltr">{dimensions(item)}</span>, {item.ratio}
                    </span>
                  </span>
                </label>
              ))}
            </div>
          </fieldset>

          <fieldset className={ui.group}>
            <legend className={ui.legend}>פורמט הקובץ</legend>
            <div className={styles.formats}>
              {formatOptions.map((option) => {
                const unavailable = option.value === 'webp' && !webpSupported
                return (
                  <label key={option.value} className={styles.formatOption} data-disabled={unavailable}>
                    <input
                      type="radio"
                      name={`${baseId}-format`}
                      className={ui.checkbox}
                      checked={format === option.value}
                      disabled={unavailable}
                      onChange={() => chooseFormat(option.value)}
                    />
                    <span className={styles.presetText}>
                      <span className={styles.presetLabel}>{option.label}</span>
                      <span className={styles.presetMeta}>
                        {unavailable ? 'הדפדפן הזה לא שומר WebP' : option.hint}
                      </span>
                    </span>
                  </label>
                )
              })}
            </div>
            <div className={ui.field}>
              <label htmlFor={qualityId} className={ui.label}>
                איכות
              </label>
              <div className={styles.rangeRow}>
                <input
                  id={qualityId}
                  type="range"
                  min={MIN_QUALITY}
                  max={MAX_QUALITY}
                  step={QUALITY_STEP}
                  value={quality}
                  disabled={!qualityApplies}
                  className={styles.range}
                  onChange={(event) => setQuality(Number(event.target.value))}
                />
                <output htmlFor={qualityId} className={styles.rangeValue} data-disabled={!qualityApplies}>
                  {quality}
                </output>
              </div>
              {qualityApplies ? null : <p className={ui.hint}>PNG שומר את כל הפרטים, ולכן האיכות לא חלה עליו.</p>}
            </div>
            {showBackground ? (
              <fieldset className={ui.group}>
                <legend className={ui.legend}>צבע הרקע מאחורי התמונה</legend>
                <div className={styles.backgrounds}>
                  {backgroundOptions.map((option) => {
                    const unavailable = option.value === 'transparent' && format === 'jpeg'
                    return (
                      <label key={option.value} className={styles.platform} data-disabled={unavailable}>
                        <input
                          type="radio"
                          name={`${baseId}-background`}
                          className={styles.hiddenInput}
                          checked={background === option.value}
                          disabled={unavailable}
                          onChange={() => setBackground(option.value)}
                        />
                        <span>{option.label}</span>
                      </label>
                    )
                  })}
                  {background === 'custom' ? (
                    <span className={styles.colorField}>
                      <label htmlFor={colorId} className={styles.colorLabel}>
                        בחירת צבע
                      </label>
                      <input
                        id={colorId}
                        type="color"
                        className={styles.color}
                        value={customColor}
                        onChange={(event) => setCustomColor(event.target.value)}
                      />
                    </span>
                  ) : null}
                </div>
                {format === 'jpeg' ? <p className={ui.hint}>ב-JPEG אין שקיפות. לרקע שקוף בחרו PNG או WebP.</p> : null}
              </fieldset>
            ) : null}
          </fieldset>
        </form>

        <div className={ui.output}>
          <div className={styles.outputHead}>
            <h2 className={`${ui.outputTitle} ${styles.outputTitle}`}>{presetName(preset)}</h2>
            <p className={styles.outputDims}>
              <span dir="ltr">{dimensions(preset)}</span> פיקסלים, יחס {preset.ratio}
              {preset.basis === 'common' ? <span className={styles.basis}>גודל מקובל, לא רשמי</span> : null}
            </p>
            <p className={ui.hint}>
              <BidiText text={preset.note} />
            </p>
          </div>

          <Cropper
            preset={preset}
            source={loading ? null : source}
            crop={loading ? null : crop}
            fill={fill}
            safeZone={safeZone}
            fileInputId={fileInputId}
            instructionsId={instructionsId}
            onCrop={updateCrop}
            onAnnounce={setAnnouncement}
          />

          {preset.safeZone ? (
            <div className={styles.safeRow}>
              <button
                type="button"
                className={styles.toggle}
                aria-pressed={safeZone}
                onClick={() => setSafeZone((current) => !current)}
              >
                <ScanLine aria-hidden="true" />
                אזור בטוח
              </button>
              <p className={styles.safeText}>
                <BidiText text={preset.safeZone.text} />
              </p>
            </div>
          ) : null}

          {source && crop ? (
            <>
              <div className={styles.zoomRow}>
                <button
                  type="button"
                  className={styles.iconButton}
                  aria-label="הקטנת זום"
                  disabled={zoomPercent <= minZoomPercent}
                  onClick={() => updateCrop((current) => ({ ...current, zoom: current.zoom / ZOOM_STEP }))}
                >
                  <Minus aria-hidden="true" />
                </button>
                <label htmlFor={zoomId} className={styles.srOnly}>
                  זום
                </label>
                <input
                  id={zoomId}
                  type="range"
                  min={minZoomPercent}
                  max={MAX_ZOOM * 100}
                  step={1}
                  value={zoomPercent}
                  aria-valuetext={`${zoomPercent}%`}
                  className={styles.range}
                  onChange={(event) =>
                    updateCrop((current) => ({ ...current, zoom: Number(event.target.value) / 100 }))
                  }
                />
                <button
                  type="button"
                  className={styles.iconButton}
                  aria-label="הגדלת זום"
                  disabled={zoomPercent >= MAX_ZOOM * 100}
                  onClick={() => updateCrop((current) => ({ ...current, zoom: current.zoom * ZOOM_STEP }))}
                >
                  <Plus aria-hidden="true" />
                </button>
              </div>
              <div className={styles.fitRow}>
                <button
                  type="button"
                  className={styles.toggle}
                  onClick={() => updateCrop(() => defaultCrop(source.width, source.height))}
                >
                  <Expand aria-hidden="true" />
                  מילוי המסגרת
                </button>
                <button
                  type="button"
                  className={styles.toggle}
                  onClick={() => updateCrop(() => fitCrop(source.width, source.height, aspect))}
                >
                  <Shrink aria-hidden="true" />
                  כל התמונה
                </button>
              </div>
              <p id={instructionsId} className={ui.hint}>
                גוררים את התמונה כדי להזיז אותה. במקלדת: החיצים מזיזים, פלוס ומינוס משנים את הזום, ו-0 מחזיר למרכז.
              </p>

              <p className={styles.result} role="status" aria-live="polite">
                {estimateReady ? (
                  <>
                    {formatLabels[savedFormat ?? format]}, <span dir="ltr">{dimensions(preset)}</span>,{' '}
                    <span dir="ltr">{formatBytes(estimateReady.bytes)}</span>
                  </>
                ) : (
                  'מחשב את גודל הקובץ'
                )}
              </p>
              {savedFormat && savedFormat !== format ? (
                <p className={styles.warning}>
                  <TriangleAlert aria-hidden="true" />
                  הדפדפן לא שומר {formatLabels[format]}, ולכן הקובץ יישמר כ-{formatLabels[savedFormat]}.
                </p>
              ) : null}
              {upscale ? (
                <p className={styles.warning}>
                  <TriangleAlert aria-hidden="true" />
                  החלק שבחרתם קטן מהגודל הזה ויוגדל פי {upscale.toFixed(1)}, ולכן התמונה עלולה להיראות רכה. כדאי
                  תמונה גדולה יותר או פחות זום.
                </p>
              ) : null}
              {overLimit && estimateReady ? (
                <p className={styles.warning}>
                  <TriangleAlert aria-hidden="true" />
                  הקובץ יוצא <span dir="ltr">{formatBytes(estimateReady.bytes)}</span>, ו{overLimit.maxBytesNote}.
                  הורידו את האיכות או בחרו JPEG.
                </p>
              ) : null}

              <div className={ui.actions}>
                <button type="button" className={ui.primary} onClick={downloadActive}>
                  <Download aria-hidden="true" />
                  הורדה ב-<span dir="ltr">{dimensions(preset)}</span>
                </button>
              </div>

              <details className={styles.batch}>
                <summary className={styles.batchSummary}>הורדה בכמה גדלים יחד</summary>
                <p className={ui.hint}>
                  כל גודל נחתך לפי הכיוון האחרון שעשיתם בו. גודל שלא כיוונתם נחתך מהמרכז. הפורמט והאיכות זהים לכולם.
                </p>
                {platforms.map((item) => (
                  <fieldset key={item.id} className={styles.batchGroup}>
                    <legend className={styles.batchLegend}>{item.label}</legend>
                    <div className={styles.batchList}>
                      {presetsFor(item.id).map((option) => (
                        <label key={option.id} className={ui.option}>
                          <input
                            type="checkbox"
                            className={ui.checkbox}
                            checked={batch.includes(option.id)}
                            onChange={() => toggleBatch(option.id)}
                          />
                          <span>
                            {option.label} <span dir="ltr">{dimensions(option)}</span>
                          </span>
                        </label>
                      ))}
                    </div>
                  </fieldset>
                ))}
                {batch.length ? (
                  <div className={ui.actions}>
                    <button type="button" className={ui.secondary} disabled={busy} onClick={downloadBatch}>
                      <Download aria-hidden="true" />
                      הורדת {filesCount(batch.length)}
                    </button>
                  </div>
                ) : null}
              </details>
            </>
          ) : loading ? (
            <p className={ui.hint}>טוען את התמונה</p>
          ) : null}

          <p className={ui.status} role="status" aria-live="polite">
            {notice}
          </p>
          <p className={styles.srOnly} role="status" aria-live="polite">
            {announcement}
          </p>
          <p className={ui.note}>
            התמונה נחתכת ונשמרת בדפדפן שלכם ולא נשלחת לשום שרת. הקובץ החדש נבנה מהפיקסלים בלבד, ולכן מידע כמו מיקום
            GPS ופרטי המצלמה לא עובר אליו.
          </p>
        </div>
      </div>
    </section>
  )
}
