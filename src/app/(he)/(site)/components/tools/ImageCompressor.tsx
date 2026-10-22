'use client'

/* eslint-disable @next/next/no-img-element */

import {
  useEffect,
  useId,
  useRef,
  useState,
  type ChangeEvent,
  type CSSProperties,
  type DragEvent as ReactDragEvent,
} from 'react'
import { ArrowLeft, Download, ImageIcon, ImagePlus, LoaderCircle, Trash2, X, ZoomIn } from 'lucide-react'
import {
  ACCEPT,
  DEFAULT_QUALITY,
  MAX_DIMENSION,
  MAX_QUALITY,
  MIN_QUALITY,
  QUALITY_STEP,
  fitWithin,
  formatBytes,
  formatNames,
  isEncodableType,
  isHeif,
  isImageFile,
  outputFileName,
  parseDimension,
  saving,
  sourceTypeOf,
  targetType,
  usesQuality,
  type EncodableType,
  type OutputChoice,
} from '@/lib/image-compressor'
import ui from './toolUi.module.css'
import styles from './ImageCompressor.module.css'

type ItemStatus = 'queued' | 'working' | 'done' | 'failed'
type Failure = 'decode' | 'heif' | 'encode'

type Result = {
  url: string
  size: number
  type: EncodableType
  requested: EncodableType
  width: number
  height: number
  sourceWidth: number
  sourceHeight: number
}

type Item = {
  id: number
  file: File
  sourceUrl: string
  job: number
  status: ItemStatus
  failure?: Failure
  result?: Result
}

type Settings = { choice: OutputChoice; quality: number; maxWidth: number | null; maxHeight: number | null }

type EncodeJob = { width: number; height: number; type: EncodableType; quality: number; fill: string | null }

type Decoded =
  | { kind: 'bitmap'; bitmap: ImageBitmap; width: number; height: number }
  | { kind: 'element'; image: HTMLImageElement; url: string; width: number; height: number }

type Outcome = ({ ok: true; blob: Blob } & Omit<Result, 'url' | 'size'>) | { ok: false; failure: Failure }

type WorkerEncoder = { encode: (bitmap: ImageBitmap, job: EncodeJob) => Promise<Blob | null>; dispose: () => void }

const WORKER_SOURCE = `
self.onmessage = async (event) => {
  const { bitmap, width, height, type, quality, fill } = event.data
  try {
    const canvas = new OffscreenCanvas(width, height)
    const context = canvas.getContext('2d')
    if (fill) {
      context.fillStyle = fill
      context.fillRect(0, 0, width, height)
    }
    context.imageSmoothingEnabled = true
    context.imageSmoothingQuality = 'high'
    context.drawImage(bitmap, 0, 0, width, height)
    bitmap.close()
    const blob = await canvas.convertToBlob({ type, quality })
    self.postMessage({ blob })
  } catch (error) {
    bitmap.close()
    self.postMessage({ blob: null })
  }
}
`

const WORKER_TIMEOUT_MS = 60000
const DOWNLOAD_GAP_MS = 450
const SETTINGS_DELAY_MS = 350
const WIDTH_PRESETS = [2560, 1920, 1200, 800]

const defaultSettings: Settings = { choice: 'webp', quality: DEFAULT_QUALITY, maxWidth: null, maxHeight: null }

const settingsKey = (settings: Settings) =>
  `${settings.choice}|${settings.quality}|${settings.maxWidth ?? ''}|${settings.maxHeight ?? ''}`

const formatOptions: { value: OutputChoice; label: string; hint: string }[] = [
  { value: 'webp', label: 'WebP', hint: 'מומלץ לאתר' },
  { value: 'jpeg', label: 'JPEG', hint: 'לצילומים, נפתח בכל מקום' },
  { value: 'png', label: 'PNG', hint: 'בלי איבוד פרטים' },
  { value: 'original', label: 'כמו המקור', hint: 'אותו פורמט, רק קטן יותר' },
]

const imagesCount = (count: number) => (count === 1 ? 'תמונה אחת' : `${count} תמונות`)
const filesCount = (count: number) => (count === 1 ? 'קובץ אחד' : `${count} קבצים`)

const failureText: Record<Failure, string> = {
  heif: 'הדפדפן הזה לא פותח קובצי HEIC. שמרו את התמונה כ-JPEG ונסו שוב.',
  decode: 'הדפדפן לא הצליח לפתוח את הקובץ. שמרו אותו כ-JPEG או PNG ונסו שוב.',
  encode: 'התמונה גדולה מדי לעיבוד בדפדפן. הגבילו רוחב או גובה ונסו שוב.',
}

const wait = (ms: number) => new Promise((resolve) => window.setTimeout(resolve, ms))

function joinChoices(choices: string[]) {
  if (choices.length < 2) return choices.join('')
  return `${choices.slice(0, -1).join(', ')} או ${choices[choices.length - 1]}`
}

function largerTip(result: Result, webpSupported: boolean) {
  const choices: string[] = []
  if (usesQuality(result.type)) choices.push('איכות נמוכה יותר')
  if (result.type !== 'image/webp' && webpSupported) choices.push('WebP')
  else if (result.type === 'image/png') choices.push('JPEG')
  if (result.width === result.sourceWidth) choices.push('רוחב מקסימלי')
  return choices.length ? `כדאי לנסות ${joinChoices(choices)}.` : 'המקור כבר קטן, אפשר להשאיר אותו.'
}

function createWorkerEncoder(): WorkerEncoder | null {
  if (typeof Worker === 'undefined' || typeof OffscreenCanvas === 'undefined') return null
  if (!('convertToBlob' in OffscreenCanvas.prototype)) return null
  const url = URL.createObjectURL(new Blob([WORKER_SOURCE], { type: 'text/javascript' }))
  try {
    const worker = new Worker(url)
    return {
      encode: (bitmap, job) =>
        new Promise((resolve) => {
          const timer = window.setTimeout(() => resolve(null), WORKER_TIMEOUT_MS)
          const finish = (blob: Blob | null) => {
            window.clearTimeout(timer)
            resolve(blob)
          }
          worker.onmessage = (event: MessageEvent<{ blob: Blob | null }>) => finish(event.data.blob)
          worker.onerror = (event) => {
            event.preventDefault()
            finish(null)
          }
          worker.postMessage({ ...job, bitmap }, [bitmap])
        }),
      dispose: () => {
        worker.terminate()
        URL.revokeObjectURL(url)
      },
    }
  } catch {
    URL.revokeObjectURL(url)
    return null
  }
}

async function decodeBitmap(file: File): Promise<Decoded | null> {
  if (typeof createImageBitmap !== 'function') return null
  try {
    const bitmap = await createImageBitmap(file, { imageOrientation: 'from-image' })
    return { kind: 'bitmap', bitmap, width: bitmap.width, height: bitmap.height }
  } catch {
    return null
  }
}

async function decodeElement(file: File): Promise<Decoded | null> {
  const url = URL.createObjectURL(file)
  const image = new Image()
  image.src = url
  try {
    await image.decode()
    return { kind: 'element', image, url, width: image.naturalWidth, height: image.naturalHeight }
  } catch {
    URL.revokeObjectURL(url)
    return null
  }
}

const decode = async (file: File) => (await decodeBitmap(file)) ?? (await decodeElement(file))

function release(decoded: Decoded) {
  if (decoded.kind === 'bitmap') decoded.bitmap.close()
  else URL.revokeObjectURL(decoded.url)
}

function encodeOnPage(decoded: Decoded, job: EncodeJob): Promise<Blob | null> {
  const canvas = document.createElement('canvas')
  canvas.width = job.width
  canvas.height = job.height
  const context = canvas.getContext('2d')
  if (!context) return Promise.resolve(null)
  try {
    if (job.fill) {
      context.fillStyle = job.fill
      context.fillRect(0, 0, job.width, job.height)
    }
    context.imageSmoothingEnabled = true
    context.imageSmoothingQuality = 'high'
    context.drawImage(decoded.kind === 'bitmap' ? decoded.bitmap : decoded.image, 0, 0, job.width, job.height)
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
      job.type,
      job.quality,
    )
  })
}

async function compress(
  file: File,
  settings: Settings,
  encoder: WorkerEncoder | null,
  onWorkerFailure: () => void,
): Promise<Outcome> {
  const decoded = await decode(file)
  if (!decoded) return { ok: false, failure: isHeif(file) ? 'heif' : 'decode' }

  const requested = targetType(settings.choice, sourceTypeOf(file))
  const size = fitWithin(decoded.width, decoded.height, settings.maxWidth, settings.maxHeight)
  const job: EncodeJob = {
    ...size,
    type: requested,
    quality: settings.quality / 100,
    fill: requested === 'image/jpeg' ? '#ffffff' : null,
  }

  let blob: Blob | null = null
  let fallback: Decoded | null = decoded
  if (encoder && decoded.kind === 'bitmap') {
    blob = await encoder.encode(decoded.bitmap, job)
    if (!blob) {
      onWorkerFailure()
      fallback = await decode(file)
    } else {
      fallback = null
    }
  }
  if (!blob && fallback) {
    blob = await encodeOnPage(fallback, job).catch(() => null)
    release(fallback)
  }
  if (!blob) return { ok: false, failure: 'encode' }

  return {
    ok: true,
    blob,
    type: isEncodableType(blob.type) ? blob.type : 'image/png',
    requested,
    width: size.width,
    height: size.height,
    sourceWidth: decoded.width,
    sourceHeight: decoded.height,
  }
}

function saveFile(url: string, name: string) {
  const link = document.createElement('a')
  link.href = url
  link.download = name
  document.body.appendChild(link)
  link.click()
  link.remove()
}

function SavingBadge({ before, after }: { before: number; after: number }) {
  const result = saving(before, after)
  if (result.kind === 'same') return <span className={styles.badge}>אותו גודל</span>
  if (result.kind === 'larger') {
    return <span className={`${styles.badge} ${styles.badgeLarger}`}>גדל ב-{result.percent}%</span>
  }
  return <span className={`${styles.badge} ${styles.badgeSmaller}`}>חיסכון {result.percent}%</span>
}

function DimensionField({
  label,
  value,
  onChange,
}: {
  label: string
  value: string
  onChange: (value: string) => void
}) {
  const id = useId()
  const errorId = `${id}-error`
  const invalid = !parseDimension(value).ok
  return (
    <div className={ui.field}>
      <label htmlFor={id} className={ui.label}>
        {label}
      </label>
      <input
        id={id}
        className={`${ui.input} ${ui.ltr} ${styles.dimension}`}
        inputMode="numeric"
        autoComplete="off"
        placeholder="בלי הגבלה"
        value={value}
        aria-invalid={invalid ? true : undefined}
        aria-describedby={invalid ? errorId : undefined}
        onChange={(event) => onChange(event.target.value)}
      />
      {invalid ? (
        <p id={errorId} className={styles.error}>
          הקלידו מספר שלם בין 1 ל-{MAX_DIMENSION.toLocaleString('en-US')}.
        </p>
      ) : null}
    </div>
  )
}

export default function ImageCompressor() {
  const [items, setItems] = useState<Item[]>([])
  const [choice, setChoice] = useState<OutputChoice>('webp')
  const [quality, setQuality] = useState(DEFAULT_QUALITY)
  const [maxWidth, setMaxWidth] = useState('')
  const [maxHeight, setMaxHeight] = useState('')
  const [applied, setApplied] = useState<Settings>(defaultSettings)
  const [busy, setBusy] = useState(false)
  const [selectedId, setSelectedId] = useState<number | null>(null)
  const [webpSupported, setWebpSupported] = useState(true)
  const [dragging, setDragging] = useState(false)
  const [notice, setNotice] = useState('')
  const [comparePosition, setComparePosition] = useState(50)
  const [actualSize, setActualSize] = useState(false)
  const nextId = useRef(1)
  const encoderRef = useRef<WorkerEncoder | null | undefined>(undefined)
  const liveUrls = useRef(new Set<string>())
  const mounted = useRef(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const compareRef = useRef<HTMLElement>(null)
  const removeButtons = useRef(new Map<number, HTMLButtonElement>())
  const baseId = useId()
  const dropHintId = `${baseId}-drop-hint`
  const qualityId = `${baseId}-quality`
  const qualityHintId = `${baseId}-quality-hint`
  const sliderId = `${baseId}-compare`

  const parsedWidth = parseDimension(maxWidth)
  const parsedHeight = parseDimension(maxHeight)
  const widthLimit = parsedWidth.ok ? parsedWidth.value : undefined
  const heightLimit = parsedHeight.ok ? parsedHeight.value : undefined
  const appliedKey = settingsKey(applied)

  const track = (url: string) => {
    liveUrls.current.add(url)
    return url
  }

  useEffect(() => {
    mounted.current = true
    const urls = liveUrls.current
    const encoder = encoderRef
    const canvas = document.createElement('canvas')
    canvas.width = 1
    canvas.height = 1
    const supported = canvas.toDataURL('image/webp').startsWith('data:image/webp')
    setWebpSupported(supported)
    if (!supported) setChoice((current) => (current === 'webp' ? 'jpeg' : current))

    const guard = (event: DragEvent) => {
      if (event.dataTransfer?.types.includes('Files')) event.preventDefault()
    }
    window.addEventListener('dragover', guard)
    window.addEventListener('drop', guard)

    return () => {
      mounted.current = false
      window.removeEventListener('dragover', guard)
      window.removeEventListener('drop', guard)
      urls.forEach((url) => URL.revokeObjectURL(url))
      urls.clear()
      encoder.current?.dispose()
      encoder.current = undefined
    }
  }, [])

  useEffect(() => {
    const used = new Set<string>()
    items.forEach((item) => {
      used.add(item.sourceUrl)
      if (item.result) used.add(item.result.url)
    })
    liveUrls.current.forEach((url) => {
      if (used.has(url)) return
      URL.revokeObjectURL(url)
      liveUrls.current.delete(url)
    })
  }, [items])

  useEffect(() => {
    if (widthLimit === undefined || heightLimit === undefined) return
    const next: Settings = { choice, quality, maxWidth: widthLimit, maxHeight: heightLimit }
    if (settingsKey(next) === appliedKey) return
    const timer = window.setTimeout(() => {
      setApplied(next)
      setItems((current) =>
        current.map((item) =>
          item.failure === 'decode' || item.failure === 'heif'
            ? item
            : { ...item, status: 'queued', failure: undefined, job: item.job + 1 },
        ),
      )
    }, SETTINGS_DELAY_MS)
    return () => window.clearTimeout(timer)
  }, [choice, quality, widthLimit, heightLimit, appliedKey])

  useEffect(() => {
    if (busy) return
    const next = items.find((item) => item.status === 'queued')
    if (!next) return
    const { id, job, file } = next
    setBusy(true)
    setItems((current) =>
      current.map((item) => (item.id === id && item.job === job ? { ...item, status: 'working' } : item)),
    )
    if (encoderRef.current === undefined) encoderRef.current = createWorkerEncoder()
    const dropWorker = () => {
      encoderRef.current?.dispose()
      encoderRef.current = null
    }

    compress(file, applied, encoderRef.current, dropWorker)
      .catch((): Outcome => ({ ok: false, failure: 'encode' }))
      .then((outcome) => {
        if (!mounted.current) return
        let result: Result | undefined
        if (outcome.ok) {
          const { blob, type, requested, width, height, sourceWidth, sourceHeight } = outcome
          const url = URL.createObjectURL(blob)
          liveUrls.current.add(url)
          result = { url, size: blob.size, type, requested, width, height, sourceWidth, sourceHeight }
        }
        setItems((current) =>
          current.map((item) => {
            if (item.id !== id || item.job !== job) return item
            if (!outcome.ok) return { ...item, status: 'failed', failure: outcome.failure, result: undefined }
            return { ...item, status: 'done', failure: undefined, result }
          }),
        )
      })
      .finally(() => {
        if (mounted.current) setBusy(false)
      })
  }, [items, busy, applied])

  const addFiles = (list: FileList | null) => {
    const files = Array.from(list ?? [])
    if (!files.length) return
    const images = files.filter(isImageFile)
    const skipped = files.length - images.length
    const skippedText = skipped
      ? `${skipped === 1 ? 'קובץ אחד לא נוסף כי הוא לא תמונה' : `${skipped} קבצים לא נוספו כי הם לא תמונות`}.`
      : ''
    if (!images.length) {
      setNotice(skippedText)
      return
    }
    const added: Item[] = images.map((file) => {
      const id = nextId.current
      nextId.current += 1
      return { id, file, sourceUrl: track(URL.createObjectURL(file)), job: 0, status: 'queued' }
    })
    setItems((current) => [...current, ...added])
    setSelectedId((current) => current ?? added[0].id)
    setNotice(`${images.length === 1 ? 'נוספה תמונה אחת' : `נוספו ${images.length} תמונות`}. ${skippedText}`.trim())
  }

  const onPick = (event: ChangeEvent<HTMLInputElement>) => {
    addFiles(event.target.files)
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
    addFiles(event.dataTransfer.files)
  }

  const removeItem = (id: number) => {
    const index = items.findIndex((item) => item.id === id)
    const neighbour = items[index + 1] ?? items[index - 1]
    const target = neighbour ? removeButtons.current.get(neighbour.id) : null
    if (target) target.focus()
    else fileInputRef.current?.focus()
    setItems((current) => current.filter((item) => item.id !== id))
    if (selectedId === id) setSelectedId(neighbour ? neighbour.id : null)
    setNotice(`התמונה ${items[index]?.file.name ?? ''} הוסרה מהרשימה`)
  }

  const clearAll = () => {
    setItems([])
    setSelectedId(null)
    setNotice('הרשימה נוקתה')
    fileInputRef.current?.focus()
  }

  const showInCompare = (id: number) => {
    setSelectedId(id)
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    compareRef.current?.scrollIntoView({ block: 'nearest', behavior: reduce ? 'auto' : 'smooth' })
  }

  const report = (mode: 'single' | 'all', ready: Item[]) => {
    const before = ready.reduce((sum, item) => sum + item.file.size, 0)
    const after = ready.reduce((sum, item) => sum + (item.result?.size ?? 0), 0)
    window.gtag?.('event', 'image_compress_download', {
      mode,
      files: ready.length,
      format: applied.choice,
      saved_percent: before ? Math.round((1 - after / before) * 100) : 0,
    })
  }

  const downloadOne = (item: Item) => {
    if (!item.result) return
    const name = outputFileName(item.file.name, item.result.type)
    saveFile(item.result.url, name)
    setNotice(`הקובץ ${name} ירד`)
    report('single', [item])
  }

  const downloadAll = async () => {
    const ready = items.filter((item) => item.status === 'done' && item.result)
    const files = ready.flatMap((item) =>
      item.result ? [{ url: item.result.url, name: outputFileName(item.file.name, item.result.type) }] : [],
    )
    if (!files.length) return
    setNotice(
      files.length > 1
        ? `מוריד ${files.length} קבצים, אחד אחרי השני. אם הדפדפן שואל אם לאפשר הורדה של כמה קבצים, אשרו.`
        : 'מוריד קובץ אחד',
    )
    report('all', ready)
    for (const [index, file] of files.entries()) {
      saveFile(file.url, file.name)
      if (index < files.length - 1) await wait(DOWNLOAD_GAP_MS)
    }
    if (mounted.current) setNotice(`${filesCount(files.length)} ירדו למחשב`)
  }

  const done = items.filter((item) => item.status === 'done' && item.result)
  const failed = items.filter((item) => item.status === 'failed')
  const pending = items.length - done.length - failed.length
  const totalBefore = done.reduce((sum, item) => sum + item.file.size, 0)
  const totalAfter = done.reduce((sum, item) => sum + (item.result?.size ?? 0), 0)
  const totalSaving = saving(totalBefore, totalAfter)
  const selected = items.find((item) => item.id === selectedId) ?? items[0]
  const qualityApplies = choice !== 'png'

  const qualityHint =
    choice === 'png'
      ? 'PNG שומר את כל הפרטים, ולכן האיכות לא חלה עליו. הקובץ קטן בעיקר כשמקטינים את הממדים.'
      : choice === 'original'
        ? 'האיכות חלה על קובצי JPEG ו-WebP. קובצי PNG נשמרים בלי איבוד פרטים.'
        : 'מתחילים מ-80 ובודקים בהשוואה. מספר נמוך יותר נותן קובץ קטן יותר, עם פחות פרטים.'

  const summary = (() => {
    if (!items.length) return null
    if (pending > 0) {
      return `מעבד תמונה ${Math.min(items.length, done.length + failed.length + 1)} מתוך ${items.length}`
    }
    const failedText = failed.length
      ? `${failed.length === 1 ? 'קובץ אחד לא עובד' : `${failed.length} קבצים לא עובדו`}, הסיבה מופיעה ברשימה.`
      : ''
    if (!done.length) return failedText
    const readyText = done.length === 1 ? 'תמונה אחת מוכנה' : `${imagesCount(done.length)} מוכנות`
    const savingText =
      totalSaving.kind === 'smaller'
        ? `חיסכון של ${totalSaving.percent}%.`
        : totalSaving.kind === 'larger'
          ? `הקבצים החדשים גדולים מהמקור ב-${totalSaving.percent}%.`
          : ''
    return (
      <>
        {readyText}: <span dir="ltr">{formatBytes(totalBefore)}</span> לפני,{' '}
        <span dir="ltr">{formatBytes(totalAfter)}</span> אחרי. <strong>{savingText}</strong> {failedText}
      </>
    )
  })()

  const stageStyle = selected?.result
    ? ({
        '--ratio': `${selected.result.width} / ${selected.result.height}`,
        '--ratio-value': selected.result.width / selected.result.height,
        '--actual-width': `${selected.result.width}px`,
      } as CSSProperties)
    : undefined

  return (
    <section
      className={ui.tool}
      aria-label="הקטנת תמונות והמרה ל-WebP"
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
    >
      <div className={ui.inner}>
        <form className={ui.form} onSubmit={(event) => event.preventDefault()}>
          <div className={`${ui.group} ${styles.dropGroup}`}>
            <label className={styles.drop} data-dragging={dragging} data-compact={items.length > 0}>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept={ACCEPT}
                className={styles.fileInput}
                aria-describedby={dropHintId}
                onChange={onPick}
              />
              <span className={styles.dropIcon} aria-hidden="true">
                <ImagePlus />
              </span>
              <span className={styles.dropTitle}>{items.length ? 'הוספת תמונות' : 'בחירת תמונות'}</span>
              <span id={dropHintId} className={styles.dropText}>
                <span className={styles.dragHint}>אפשר גם לגרור לכאן. </span>
                JPEG, PNG או WebP, כמה תמונות יחד.
              </span>
            </label>
          </div>

          <fieldset className={ui.group}>
            <legend className={ui.legend}>פורמט הקבצים החדשים</legend>
            <div className={styles.choices}>
              {formatOptions.map((option) => {
                const unavailable = option.value === 'webp' && !webpSupported
                return (
                  <label key={option.value} className={styles.choice} data-disabled={unavailable}>
                    <input
                      type="radio"
                      name={`${baseId}-format`}
                      value={option.value}
                      className={ui.checkbox}
                      checked={choice === option.value}
                      disabled={unavailable}
                      onChange={() => setChoice(option.value)}
                    />
                    <span className={styles.choiceText}>
                      <span className={styles.choiceLabel}>{option.label}</span>
                      <span className={styles.choiceHint}>
                        {unavailable ? 'הדפדפן הזה לא שומר WebP' : option.hint}
                      </span>
                    </span>
                  </label>
                )
              })}
            </div>
          </fieldset>

          <div className={ui.group}>
            <label htmlFor={qualityId} className={ui.legend}>
              איכות
            </label>
            <div className={styles.qualityRow}>
              <input
                id={qualityId}
                type="range"
                min={MIN_QUALITY}
                max={MAX_QUALITY}
                step={QUALITY_STEP}
                value={quality}
                disabled={!qualityApplies}
                aria-describedby={qualityHintId}
                className={styles.range}
                onChange={(event) => setQuality(Number(event.target.value))}
              />
              <output htmlFor={qualityId} className={styles.qualityValue} data-disabled={!qualityApplies}>
                {quality}
              </output>
            </div>
            <p id={qualityHintId} className={ui.hint}>
              {qualityHint}
            </p>
          </div>

          <fieldset className={ui.group}>
            <legend className={ui.legend}>
              גודל מקסימלי <span className={styles.optionalTag}>לא חובה</span>
            </legend>
            <p className={ui.hint}>התמונה מוקטנת בלי לשנות את היחס בין הרוחב לגובה, ולא מוגדלת אף פעם.</p>
            <div className={styles.pair}>
              <DimensionField label="רוחב בפיקסלים" value={maxWidth} onChange={setMaxWidth} />
              <DimensionField label="גובה בפיקסלים" value={maxHeight} onChange={setMaxHeight} />
            </div>
            <div className={styles.presets} role="group" aria-labelledby={`${baseId}-presets`}>
              <span id={`${baseId}-presets`} className={styles.presetsLabel}>
                רוחב נפוץ
              </span>
              {WIDTH_PRESETS.map((width) => (
                <button
                  key={width}
                  type="button"
                  className={styles.preset}
                  aria-pressed={maxWidth === String(width)}
                  onClick={() => setMaxWidth(maxWidth === String(width) ? '' : String(width))}
                >
                  {width}
                </button>
              ))}
            </div>
          </fieldset>
        </form>

        <div className={ui.output}>
          <h2 className={ui.outputTitle}>התמונות שלכם</h2>
          <p className={styles.summary} role="status" aria-live="polite">
            {summary}
          </p>

          {items.length === 0 ? (
            <div className={styles.empty}>
              <ImageIcon className={styles.emptyIcon} aria-hidden="true" />
              <p>כאן תראו כל תמונה לפני ואחרי, כמה היא שקלה וכמה היא שוקלת עכשיו, ותוכלו להוריד אותה.</p>
            </div>
          ) : null}

          {selected ? (
            <figure ref={compareRef} className={styles.compare}>
              {selected.result ? (
                <>
                  <div
                    className={styles.viewport}
                    data-actual={actualSize}
                    role={actualSize ? 'region' : undefined}
                    aria-label={actualSize ? 'השוואה בגודל אמיתי, אפשר לגלול' : undefined}
                    tabIndex={actualSize ? 0 : undefined}
                  >
                    <div className={styles.stage} style={stageStyle}>
                      <img
                        className={styles.layer}
                        src={selected.result.url}
                        alt={`${selected.file.name} אחרי הדחיסה`}
                        draggable={false}
                      />
                      <img
                        className={styles.layer}
                        src={selected.sourceUrl}
                        alt={`${selected.file.name} לפני הדחיסה`}
                        draggable={false}
                        style={{ clipPath: `inset(0 0 0 ${100 - comparePosition}%)` }}
                      />
                      <span
                        className={styles.divider}
                        style={{ insetInlineStart: `${comparePosition}%` }}
                        aria-hidden="true"
                      />
                      <span className={`${styles.tag} ${styles.tagBefore}`} aria-hidden="true">
                        לפני
                      </span>
                      <span className={`${styles.tag} ${styles.tagAfter}`} aria-hidden="true">
                        אחרי
                      </span>
                    </div>
                  </div>
                  <div className={styles.compareControls}>
                    <label htmlFor={sliderId} className={styles.sliderLabel}>
                      לפני ואחרי
                    </label>
                    <input
                      id={sliderId}
                      type="range"
                      min={0}
                      max={100}
                      value={comparePosition}
                      aria-valuetext={`${comparePosition}% מהתמונה מוצגים לפני הדחיסה`}
                      className={styles.range}
                      onChange={(event) => setComparePosition(Number(event.target.value))}
                    />
                    <button
                      type="button"
                      className={styles.toggle}
                      aria-pressed={actualSize}
                      onClick={() => setActualSize((current) => !current)}
                    >
                      <ZoomIn aria-hidden="true" />
                      גודל אמיתי
                    </button>
                  </div>
                  <figcaption className={styles.caption}>
                    <bdi className={styles.captionName}>{selected.file.name}</bdi>
                    <span>
                      {formatNames[selected.result.type]},{' '}
                      <span dir="ltr">
                        {selected.result.width}×{selected.result.height}
                      </span>
                    </span>
                    {selected.result.width !== selected.result.sourceWidth ? (
                      <span>
                        הוקטנה מ-
                        <span dir="ltr">
                          {selected.result.sourceWidth}×{selected.result.sourceHeight}
                        </span>
                      </span>
                    ) : null}
                  </figcaption>
                </>
              ) : (
                <div className={styles.comparePending}>
                  {selected.status === 'failed' && selected.failure ? (
                    <p>{failureText[selected.failure]}</p>
                  ) : (
                    <p>
                      <LoaderCircle className={styles.spinner} aria-hidden="true" />
                      מכין את <bdi>{selected.file.name}</bdi>
                    </p>
                  )}
                </div>
              )}
            </figure>
          ) : null}

          {items.length ? (
            <ul className={styles.files} aria-label="רשימת התמונות">
              {items.map((item) => {
                const isSelected = item.id === selected?.id
                return (
                  <li key={item.id} className={styles.file} data-selected={isSelected}>
                    <span className={styles.thumb} aria-hidden="true">
                      {item.result ? (
                        <img src={item.result.url} alt="" loading="lazy" draggable={false} />
                      ) : item.status === 'failed' ? (
                        <ImageIcon />
                      ) : (
                        <LoaderCircle className={styles.spinner} />
                      )}
                    </span>
                    <div className={styles.fileInfo}>
                      <p className={styles.fileName}>
                        <bdi>{item.file.name}</bdi>
                      </p>
                      {item.result && item.status === 'done' ? (
                        <p className={styles.fileMeta}>
                          <span className={styles.sizes}>
                            <span className={styles.srOnly}>לפני </span>
                            <span dir="ltr">{formatBytes(item.file.size)}</span>
                            <ArrowLeft className={styles.arrow} aria-hidden="true" />
                            <span className={styles.srOnly}> אחרי </span>
                            <span dir="ltr" className={styles.after}>
                              {formatBytes(item.result.size)}
                            </span>
                          </span>
                          <SavingBadge before={item.file.size} after={item.result.size} />
                          <span>
                            {formatNames[item.result.type]}, <span dir="ltr">{item.result.width}×{item.result.height}</span>
                          </span>
                        </p>
                      ) : null}
                      {item.result && item.result.type !== item.result.requested ? (
                        <p className={styles.fileNote}>
                          הדפדפן לא שומר {formatNames[item.result.requested]}, ולכן הקובץ נשמר כ-
                          {formatNames[item.result.type]}.
                        </p>
                      ) : null}
                      {item.status === 'done' && item.result && item.result.size > item.file.size ? (
                        <p className={styles.fileNote}>{largerTip(item.result, webpSupported)}</p>
                      ) : null}
                      {item.status === 'queued' ? <p className={styles.fileMeta}>ממתין בתור</p> : null}
                      {item.status === 'working' ? <p className={styles.fileMeta}>מעבד</p> : null}
                      {item.status === 'failed' && item.failure ? (
                        <p className={styles.fileError}>{failureText[item.failure]}</p>
                      ) : null}
                    </div>
                    <div className={styles.fileActions}>
                      {item.result && item.status === 'done' ? (
                        <>
                          <button
                            type="button"
                            className={styles.smallButton}
                            aria-pressed={isSelected}
                            onClick={() => showInCompare(item.id)}
                          >
                            השוואה<span className={styles.srOnly}> של {item.file.name}</span>
                          </button>
                          <button type="button" className={styles.smallButton} onClick={() => downloadOne(item)}>
                            <Download aria-hidden="true" />
                            הורדה<span className={styles.srOnly}> של {item.file.name}</span>
                          </button>
                        </>
                      ) : null}
                      <button
                        ref={(node) => {
                          if (node) removeButtons.current.set(item.id, node)
                          else removeButtons.current.delete(item.id)
                        }}
                        type="button"
                        className={styles.iconButton}
                        aria-label={`הסרת ${item.file.name}`}
                        onClick={() => removeItem(item.id)}
                      >
                        <X aria-hidden="true" />
                      </button>
                    </div>
                  </li>
                )
              })}
            </ul>
          ) : null}

          {items.length ? (
            <div className={ui.actions}>
              {done.length ? (
                <button type="button" className={ui.primary} onClick={downloadAll}>
                  <Download aria-hidden="true" />
                  {done.length === 1 ? 'הורדת התמונה' : `הורדת כל ${done.length} התמונות`}
                </button>
              ) : null}
              <button type="button" className={ui.secondary} onClick={clearAll}>
                <Trash2 aria-hidden="true" />
                ניקוי הרשימה
              </button>
            </div>
          ) : null}
          <p className={ui.status} role="status" aria-live="polite">
            {notice}
          </p>
          <p className={ui.note}>
            התמונות מעובדות בדפדפן שלכם ולא נשלחות לשום שרת. הקובץ החדש נבנה מהפיקסלים בלבד, ולכן מידע שנשמר
            בתמונה, כמו מיקום GPS ופרטי המצלמה, לא עובר אליו.
          </p>
        </div>
      </div>
    </section>
  )
}
