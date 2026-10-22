'use client'

/* eslint-disable @next/next/no-img-element */

import { useEffect, useId, useRef, useState, type ChangeEvent, type DragEvent as ReactDragEvent } from 'react'
import { Copy, Download, FileText, ImagePlus, RotateCcw, ScanText, X } from 'lucide-react'
import type { LoggerMessage, Worker as OcrWorker } from 'tesseract.js'
import {
  ACCEPT,
  DEFAULT_LANGUAGE,
  cleanText,
  confidenceLevel,
  dominantDirection,
  fileKind,
  isOcrLanguage,
  languageOptions,
  ocrSize,
  overallProgress,
  textFileName,
  textStats,
  wordDocument,
  wordFileName,
  type ConfidenceLevel,
  type OcrLanguage,
  type OcrStage,
  type TextDirection,
} from '@/lib/image-to-text'
import ui from './toolUi.module.css'
import styles from './ImageToText.module.css'

type Picked = { id: number; file: File; url: string }

type Prepared = { id: number; blob: Blob }

type Failure = 'decode' | 'heif' | 'network' | 'engine'

type InputProblem = 'pdf' | 'other'

type Result = {
  language: OcrLanguage
  confidence: number
  level: ConfidenceLevel
  direction: TextDirection
}

type Decoded = { source: CanvasImageSource; width: number; height: number; release: () => void }

type CopyMethod = 'copy' | 'txt' | 'word'

const stageText: Record<OcrStage, string> = {
  prepare: 'מכין את התמונה',
  engine: 'טוען את מנוע הזיהוי',
  model: 'טוען את מודל השפה',
  recognize: 'מזהה את הטקסט',
}

const failureText: Record<Failure, string> = {
  decode: 'הדפדפן לא הצליח לפתוח את התמונה. שמרו אותה כ-JPG או PNG ונסו שוב.',
  heif: 'הדפדפן הזה לא פותח קובצי HEIC מאייפון. שמרו את התמונה כ-JPG, או צלמו מסך שלה, ונסו שוב.',
  network: 'לא הצלחנו להוריד את מנוע הזיהוי. בדקו את החיבור לאינטרנט ונסו שוב.',
  engine: 'הזיהוי נעצר באמצע. נסו שוב, ואם זה חוזר, חתכו את התמונה לאזור הטקסט או נסו דפדפן אחר.',
}

const inputProblemText: Record<InputProblem, string> = {
  pdf: 'קובצי PDF לא נתמכים כאן. פתחו את העמוד, צלמו מסך שלו (במחשב Windows: Win+Shift+S) והדביקו אותו כאן עם Ctrl+V.',
  other: 'הקובץ הזה הוא לא תמונה. בחרו קובץ JPG, PNG או WebP.',
}

const tips = [
  'צלמו ישר מעל הדף, כך שהשורות יהיו מאוזנות ולא באלכסון.',
  'צלמו באור טוב ואחיד, בלי צל של היד או של הטלפון ובלי השתקפות.',
  'חתכו את התמונה כך שיישאר רק הטקסט, עם שוליים קטנים מסביב.',
  'בצילום מסך, הגדילו את התצוגה לפני הצילום כדי שהאותיות יהיו גדולות יותר.',
  'כתב יד מזוהה בצורה חלשה. אפשר לנסות, אבל צפו להקליד חלק מהטקסט בעצמכם.',
]

const MIN_ROWS = 6
const MAX_ROWS = 18

const NETWORK_ERROR =/network|fetch|importscripts|failed to load|load tesseractcore/i

async function decodeBitmap(file: File): Promise<Decoded | null> {
  if (typeof createImageBitmap !== 'function') return null
  try {
    const bitmap = await createImageBitmap(file, { imageOrientation: 'from-image' })
    return { source: bitmap, width: bitmap.width, height: bitmap.height, release: () => bitmap.close() }
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
    return {
      source: image,
      width: image.naturalWidth,
      height: image.naturalHeight,
      release: () => URL.revokeObjectURL(url),
    }
  } catch {
    URL.revokeObjectURL(url)
    return null
  }
}

async function prepareImage(file: File): Promise<Blob | null> {
  const decoded = (await decodeBitmap(file)) ?? (await decodeElement(file))
  if (!decoded) return null
  const size = ocrSize(decoded.width, decoded.height)
  const canvas = document.createElement('canvas')
  canvas.width = size.width
  canvas.height = size.height
  const context = canvas.getContext('2d')
  if (!context) {
    decoded.release()
    return null
  }
  try {
    context.fillStyle = '#ffffff'
    context.fillRect(0, 0, size.width, size.height)
    context.imageSmoothingEnabled = true
    context.imageSmoothingQuality = 'high'
    context.drawImage(decoded.source, 0, 0, size.width, size.height)
  } catch {
    decoded.release()
    return null
  }
  decoded.release()
  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
      canvas.width = 0
      canvas.height = 0
      resolve(blob)
    }, 'image/png')
  })
}

const ocrEngineSplit = {
  loader: () =>
    typeof window === 'undefined' ? Promise.reject(new Error('OCR runs only in the browser')) : import('tesseract.js'),
}

type OcrEngine = Awaited<ReturnType<typeof ocrEngineSplit.loader>>['default']

type LoadedModule = Partial<OcrEngine> & { default?: OcrEngine }

let enginePromise: Promise<OcrEngine> | null = null

const pickEngine = (loaded: LoadedModule) =>
  typeof loaded.createWorker === 'function' ? (loaded as OcrEngine) : (loaded.default as OcrEngine)

function loadEngine() {
  enginePromise ??= ocrEngineSplit
    .loader()
    .then((loaded) => pickEngine(loaded as LoadedModule))
    .catch((error: unknown) => {
      enginePromise = null
      throw error
    })
  return enginePromise
}

function saveBlob(blob: Blob, name: string) {
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = name
  document.body.appendChild(link)
  link.click()
  link.remove()
  window.setTimeout(() => URL.revokeObjectURL(url), 1000)
}

const errorMessage = (error: unknown) =>
  typeof error === 'string' ? error : error instanceof Error ? error.message : String(error ?? '')

export default function ImageToText() {
  const [image, setImage] = useState<Picked | null>(null)
  const [language, setLanguage] = useState<OcrLanguage>(DEFAULT_LANGUAGE)
  const [working, setWorking] = useState(false)
  const [stage, setStage] = useState<OcrStage>('prepare')
  const [percent, setPercent] = useState(0)
  const [result, setResult] = useState<Result | null>(null)
  const [text, setText] = useState('')
  const [failure, setFailure] = useState<Failure | null>(null)
  const [inputProblem, setInputProblem] = useState<InputProblem | null>(null)
  const [notice, setNotice] = useState('')
  const [dragging, setDragging] = useState(false)
  const runRef = useRef(0)
  const nextId = useRef(1)
  const workerRef = useRef<OcrWorker | null>(null)
  const preparedRef = useRef<Prepared | null>(null)
  const imageUrlRef = useRef<string | null>(null)
  const mounted = useRef(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const addFileRef = useRef<(file: File) => void>(() => {})
  const baseId = useId()
  const dropHintId = `${baseId}-drop-hint`
  const inputProblemId = `${baseId}-input-problem`
  const statusId = `${baseId}-status`
  const textId = `${baseId}-text`
  const textHintId = `${baseId}-text-hint`

  const stopWorker = () => {
    const worker = workerRef.current
    workerRef.current = null
    if (worker) worker.terminate().catch(() => {})
  }

  const run = async (picked: Picked, chosen: OcrLanguage) => {
    runRef.current += 1
    const runId = runRef.current
    const isCurrent = () => mounted.current && runRef.current === runId
    stopWorker()
    setWorking(true)
    setStage('prepare')
    setPercent(0)
    setFailure(null)
    setResult(null)
    setText('')
    setNotice('')

    let blob = preparedRef.current?.id === picked.id ? preparedRef.current.blob : null
    if (!blob) {
      blob = await prepareImage(picked.file)
      if (!isCurrent()) return
      if (!blob) {
        setWorking(false)
        setFailure(fileKind(picked.file) === 'heif' ? 'heif' : 'decode')
        return
      }
      preparedRef.current = { id: picked.id, blob }
    }

    let failEngine: (reason: unknown) => void = () => {}
    const engineFailed = new Promise<never>((_, reject) => {
      failEngine = reject
    })
    engineFailed.catch(() => {})
    let shown = -1
    const logger = (message: LoggerMessage) => {
      if (!isCurrent()) return
      const next = overallProgress(message.status, message.progress)
      if (!next || next.percent < shown) return
      setStage(next.stage)
      if (next.percent !== shown) {
        shown = next.percent
        setPercent(next.percent)
      }
    }

    let worker: OcrWorker | null = null
    try {
      const engine = await loadEngine()
      if (!isCurrent()) return
      setStage('engine')
      setPercent(5)
      worker = await Promise.race([
        engine.createWorker(chosen, engine.OEM.LSTM_ONLY, { logger, errorHandler: (error) => failEngine(error) }),
        engineFailed,
      ])
      if (!isCurrent()) {
        worker.terminate().catch(() => {})
        return
      }
      workerRef.current = worker
      const { data } = await Promise.race([worker.recognize(blob, { rotateAuto: true }), engineFailed])
      if (!isCurrent()) return
      const recognized = cleanText(data.text ?? '')
      const confidence = Math.round(data.confidence ?? 0)
      setText(recognized)
      setResult({
        language: chosen,
        confidence,
        level: confidenceLevel(confidence, recognized),
        direction: chosen === 'eng' ? 'ltr' : dominantDirection(recognized),
      })
      setPercent(100)
    } catch (error) {
      if (!isCurrent()) return
      const offline = typeof navigator !== 'undefined' && navigator.onLine === false
      setFailure(offline || NETWORK_ERROR.test(errorMessage(error)) ? 'network' : 'engine')
    } finally {
      if (worker) {
        if (workerRef.current === worker) workerRef.current = null
        worker.terminate().catch(() => {})
      }
      if (isCurrent()) setWorking(false)
    }
  }

  const addFile = (file: File) => {
    const kind = fileKind(file)
    if (kind === 'pdf' || kind === 'other') {
      setInputProblem(kind)
      return
    }
    setInputProblem(null)
    if (imageUrlRef.current) URL.revokeObjectURL(imageUrlRef.current)
    const url = URL.createObjectURL(file)
    imageUrlRef.current = url
    const picked: Picked = { id: nextId.current, file, url }
    nextId.current += 1
    preparedRef.current = null
    setImage(picked)
    run(picked, language)
  }

  addFileRef.current = addFile

  useEffect(() => {
    mounted.current = true
    const guard = (event: DragEvent) => {
      if (event.dataTransfer?.types.includes('Files')) event.preventDefault()
    }
    const onPaste = (event: ClipboardEvent) => {
      const files = Array.from(event.clipboardData?.files ?? [])
      const file = files.find((item) => fileKind(item) === 'image') ?? files[0]
      if (!file) return
      event.preventDefault()
      addFileRef.current(file)
    }
    window.addEventListener('dragover', guard)
    window.addEventListener('drop', guard)
    window.addEventListener('paste', onPaste)
    return () => {
      mounted.current = false
      window.removeEventListener('dragover', guard)
      window.removeEventListener('drop', guard)
      window.removeEventListener('paste', onPaste)
      runRef.current += 1
      const worker = workerRef.current
      workerRef.current = null
      if (worker) worker.terminate().catch(() => {})
      if (imageUrlRef.current) URL.revokeObjectURL(imageUrlRef.current)
      imageUrlRef.current = null
      preparedRef.current = null
    }
  }, [])

  const onPick = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (file) addFile(file)
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
    const files = Array.from(event.dataTransfer.files)
    const file = files.find((item) => fileKind(item) === 'image') ?? files[0]
    if (file) addFile(file)
  }

  const changeLanguage = (value: string) => {
    if (!isOcrLanguage(value)) return
    setLanguage(value)
    if (image) run(image, value)
  }

  const cancel = () => {
    runRef.current += 1
    stopWorker()
    setWorking(false)
    setPercent(0)
    setNotice('הזיהוי בוטל')
    fileInputRef.current?.focus()
  }

  const retry = () => {
    if (image) run(image, language)
  }

  const track = (method: CopyMethod) => {
    const stats = textStats(text)
    window.gtag?.('event', 'ocr_copy', {
      method,
      language: result?.language ?? language,
      characters: stats.characters,
      words: stats.words,
      lines: stats.lines,
    })
  }

  const copyText = async () => {
    let copied = false
    try {
      await navigator.clipboard.writeText(text)
      copied = true
    } catch {
      const area = textareaRef.current
      if (area) {
        area.focus()
        area.select()
        copied = document.execCommand('copy')
      }
    }
    setNotice(
      copied
        ? 'הטקסט הועתק. אפשר להדביק אותו ב-Word, ב-Google Docs, במייל או בוואטסאפ.'
        : 'הדפדפן לא אפשר העתקה אוטומטית. הטקסט מסומן, לחצו Ctrl+C כדי להעתיק.',
    )
    if (copied) track('copy')
  }

  const downloadText = () => {
    if (!image) return
    const name = textFileName(image.file.name)
    saveBlob(new Blob(['\ufeff', text], { type: 'text/plain;charset=utf-8' }), name)
    setNotice(`הקובץ ${name} ירד למחשב`)
    track('txt')
  }

  const downloadWord = () => {
    if (!image) return
    const name = wordFileName(image.file.name)
    const html = wordDocument(text, name.replace(/\.doc$/, ''))
    saveBlob(new Blob(['\ufeff', html], { type: 'application/msword;charset=utf-8' }), name)
    setNotice(`הקובץ ${name} ירד. אם Word פותח אותו בתצוגה מוגנת, אשרו עריכה בפס שבראש המסמך.`)
    track('word')
  }

  const stats = textStats(text)
  const hasText = stats.characters > 0
  const textLang = result?.language === 'eng' ? 'en' : 'he'
  const showTips = result?.level === 'low' || result?.level === 'empty'
  const textareaRows = Math.min(MAX_ROWS, Math.max(MIN_ROWS, text.split('\n').length + 1))

  const status = (() => {
    if (working) return stageText[stage]
    if (failure) return failureText[failure]
    if (!result) return ''
    if (result.level === 'empty') return 'לא נמצא טקסט בתמונה.'
    const words = stats.words === 1 ? 'מילה אחת' : `${stats.words} מילים`
    const lines = stats.lines === 1 ? 'בשורה אחת' : `ב-${stats.lines} שורות`
    return `הטקסט מוכן: ${words} ${lines}.`
  })()

  const confidenceText = (() => {
    if (!result) return ''
    if (result.level === 'high') {
      return `רמת הביטחון של הזיהוי גבוהה (${result.confidence}%). כדאי בכל זאת לעבור על מספרים, שמות וסכומים.`
    }
    if (result.level === 'medium') {
      return `רמת ביטחון בינונית (${result.confidence}%). סביר שיש כמה טעויות, למשל באותיות דומות או בסימנים מיותרים משולי התמונה. עברו על הטקסט לפני שמשתמשים בו.`
    }
    if (result.level === 'low') {
      return `רמת ביטחון נמוכה (${result.confidence}%). כנראה יש לא מעט טעויות. אפשר לתקן אותן בתיבה, או לצלם שוב כך:`
    }
    return 'אם יש בתמונה טקסט, נסו כך:'
  })()

  return (
    <section
      className={ui.tool}
      aria-label="המרת תמונה לטקסט"
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
    >
      <div className={ui.inner}>
        <form className={ui.form} onSubmit={(event) => event.preventDefault()}>
          <div className={`${ui.group} ${styles.dropGroup}`}>
            <label className={styles.drop} data-dragging={dragging} data-compact={image !== null}>
              <input
                ref={fileInputRef}
                type="file"
                accept={ACCEPT}
                className={styles.fileInput}
                aria-describedby={inputProblem ? `${dropHintId} ${inputProblemId}` : dropHintId}
                onChange={onPick}
              />
              <span className={styles.dropIcon} aria-hidden="true">
                <ImagePlus />
              </span>
              <span className={styles.dropTitle}>{image ? 'החלפת תמונה' : 'בחירת תמונה'}</span>
              <span id={dropHintId} className={styles.dropText}>
                <span className={styles.desktopHint}>אפשר גם לגרור לכאן או להדביק צילום מסך עם Ctrl+V. </span>
                תמונות JPG, PNG או WebP. ל-PDF, צלמו מסך של העמוד.
              </span>
            </label>
            <p id={inputProblemId} className={styles.inputProblem} role="status" aria-live="polite">
              {inputProblem ? inputProblemText[inputProblem] : ''}
            </p>
            {image ? (
              <figure className={styles.preview}>
                <div className={styles.previewFrame}>
                  <img src={image.url} alt={`התמונה שנבחרה: ${image.file.name}`} draggable={false} />
                </div>
                <figcaption className={styles.previewName}>
                  <bdi>{image.file.name}</bdi>
                </figcaption>
              </figure>
            ) : null}
          </div>

          <fieldset className={ui.group}>
            <legend className={ui.legend}>שפת הטקסט בתמונה</legend>
            <div className={styles.choices}>
              {languageOptions.map((option) => (
                <label key={option.value} className={styles.choice}>
                  <input
                    type="radio"
                    name={`${baseId}-language`}
                    value={option.value}
                    className={ui.checkbox}
                    checked={language === option.value}
                    onChange={(event) => changeLanguage(event.target.value)}
                  />
                  <span className={styles.choiceText}>
                    <span className={styles.choiceLabel} lang={option.lang}>
                      {option.label}
                    </span>
                    <span className={styles.choiceHint}>{option.hint}</span>
                  </span>
                </label>
              ))}
            </div>
            <p className={ui.hint}>
              {image ? 'כשמחליפים שפה, הזיהוי רץ מחדש על אותה תמונה.' : 'הזיהוי מתחיל מיד כשבוחרים תמונה.'}
            </p>
          </fieldset>
        </form>

        <div className={ui.output} aria-busy={working}>
          <h2 className={ui.outputTitle}>הטקסט מהתמונה</h2>
          <p
            id={statusId}
            className={styles.status}
            data-failed={failure !== null && !working}
            role="status"
            aria-live="polite"
          >
            {status}
          </p>

          {working ? (
            <div className={styles.progressBlock}>
              <div className={styles.progressRow}>
                <progress className={styles.progress} max={100} value={percent} aria-labelledby={statusId} />
                <span className={styles.percent} dir="ltr" aria-hidden="true">
                  {percent}%
                </span>
              </div>
              {stage === 'engine' || stage === 'model' ? (
                <p className={ui.hint}>
                  בפעם הראשונה הדפדפן מוריד את מנוע הזיהוי ואת מודל השפה, וזה לוקח כמה שניות. בפעם הבאה זה מהיר
                  יותר.
                </p>
              ) : null}
              <button type="button" className={ui.secondary} onClick={cancel}>
                <X aria-hidden="true" />
                ביטול
              </button>
            </div>
          ) : null}

          {!image && !working ? (
            <div className={styles.empty}>
              <ScanText className={styles.emptyIcon} aria-hidden="true" />
              <p>כאן יופיע הטקסט מהתמונה. תוכלו לתקן אותו, להעתיק, להוריד כקובץ או לפתוח ב-Word.</p>
            </div>
          ) : null}

          {image && !working && !result ? (
            <div className={ui.actions}>
              <button type="button" className={ui.primary} onClick={retry}>
                <RotateCcw aria-hidden="true" />
                {failure ? 'ניסיון נוסף' : 'זיהוי הטקסט'}
              </button>
            </div>
          ) : null}

          {result && !working ? (
            <>
              {result.level !== 'empty' ? (
                <div className={ui.field}>
                  <label htmlFor={textId} className={ui.label}>
                    הטקסט שזוהה
                  </label>
                  <p id={textHintId} className={ui.hint}>
                    אפשר לתקן כאן טעויות לפני שמעתיקים או מורידים.
                  </p>
                  <textarea
                    ref={textareaRef}
                    id={textId}
                    className={`${ui.input} ${styles.result}`}
                    dir={result.direction}
                    lang={textLang}
                    spellCheck={false}
                    rows={textareaRows}
                    value={text}
                    aria-describedby={textHintId}
                    onChange={(event) => setText(event.target.value)}
                  />
                </div>
              ) : null}

              <div className={styles.confidence} data-level={result.level}>
                <p>{confidenceText}</p>
                {showTips ? (
                  <ul className={styles.tips}>
                    {tips.map((tip) => (
                      <li key={tip}>{tip}</li>
                    ))}
                  </ul>
                ) : null}
              </div>

              {hasText ? (
                <div className={ui.actions}>
                  <button type="button" className={ui.primary} onClick={copyText}>
                    <Copy aria-hidden="true" />
                    העתקת הטקסט
                  </button>
                  <button type="button" className={ui.secondary} onClick={downloadText}>
                    <Download aria-hidden="true" />
                    הורדה כקובץ טקסט
                  </button>
                  <button type="button" className={ui.secondary} onClick={downloadWord}>
                    <FileText aria-hidden="true" />
                    פתיחה ב-Word
                  </button>
                </div>
              ) : null}

            </>
          ) : null}

          <p className={ui.status} role="status" aria-live="polite">
            {notice}
          </p>
          <p className={ui.note}>
            התמונה נשארת בדפדפן שלכם ולא נשלחת לשום שרת. כדי לזהות טקסט, הדפדפן מוריד בפעם הראשונה את מנוע
            הזיהוי Tesseract ואת מודל השפה מ-jsDelivr (עד כ-8 מגה-בייט), ושומר את המודל לפעם הבאה.
          </p>
        </div>
      </div>
    </section>
  )
}
