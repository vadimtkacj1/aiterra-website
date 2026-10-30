'use client'

/* eslint-disable @next/next/no-img-element */

import { useEffect, useId, useRef, useState, type ChangeEvent, type MouseEvent } from 'react'
import { Download, ImagePlus, LoaderCircle } from 'lucide-react'
import {
  canvasToUrl,
  detectFaces,
  fileToCanvas,
  photoToSketch,
  pixelateFaces,
  removeBackground,
  upscale,
  upscaleLimit,
  type FaceBox,
  type SketchStyle,
} from '@/lib/browser-ml'
import { TileGroup } from './FunTiles'
import ui from './toolUi.module.css'
import fun from './FunTool.module.css'
import styles from './ImageMlTool.module.css'

export type ImageMlMode = 'upscale' | 'background' | 'faces' | 'sketch'

const MAX_SIDE: Record<Exclude<ImageMlMode, 'upscale'>, number> = { background: 2048, faces: 2048, sketch: 2048 }

const COPY: Record<ImageMlMode, { name: string; output: string; working: string; hint: string }> = {
  upscale: {
    name: 'שיפור איכות תמונה',
    output: 'upscaled.png',
    working: 'משפרים את התמונה',
    hint: 'התמונה מוגדלת פי 4. בטלפון זה יכול לקחת כמה דקות.',
  },
  background: {
    name: 'הסרת רקע מתמונה',
    output: 'no-background.png',
    working: 'מסירים את הרקע',
    hint: 'התוצאה נשמרת כ-PNG עם רקע שקוף.',
  },
  faces: {
    name: 'טשטוש פנים בתמונה',
    output: 'blurred-faces.png',
    working: 'מחפשים פנים',
    hint: 'בדקו את התמונה לפני השיתוף. לחיצה על פנים שלא טושטשו מוסיפה טשטוש, ולחיצה על טשטוש מסירה אותו.',
  },
  sketch: {
    name: 'הפיכת תמונה לציור',
    output: 'sketch.png',
    working: 'מציירים',
    hint: 'דף צביעה יוצא הכי טוב מתמונה חדה עם נושא אחד.',
  },
}

const STYLES: { id: SketchStyle; label: string }[] = [
  { id: 'pencil', label: 'ציור עיפרון' },
  { id: 'coloring', label: 'דף צביעה' },
]

const insideBox = (box: FaceBox, x: number, y: number) =>
  x >= box.x && x <= box.x + box.width && y >= box.y && y <= box.y + box.height

export default function ImageMlTool({ mode }: { mode: ImageMlMode }) {
  const copy = COPY[mode]
  const inputId = useId()
  const styleName = useId()
  const source = useRef<HTMLCanvasElement | null>(null)
  const [style, setStyle] = useState<SketchStyle>('pencil')
  const [boxes, setBoxes] = useState<FaceBox[]>([])
  const [status, setStatus] = useState<'idle' | 'working' | 'done' | 'failed'>('idle')
  const [progress, setProgress] = useState(0)
  const [resized, setResized] = useState(false)
  const [resultUrl, setResultUrl] = useState('')

  useEffect(() => () => {
    if (resultUrl) URL.revokeObjectURL(resultUrl)
  }, [resultUrl])

  async function showFaces(canvas: HTMLCanvasElement, next: FaceBox[]) {
    setBoxes(next)
    setResultUrl(await canvasToUrl(pixelateFaces(canvas, next)))
  }

  async function render(canvas: HTMLCanvasElement, sketchStyle: SketchStyle) {
    if (mode === 'upscale') return setResultUrl(await canvasToUrl(await upscale(canvas, setProgress)))
    if (mode === 'background') return setResultUrl(await canvasToUrl(await removeBackground(canvas)))
    if (mode === 'faces') return showFaces(canvas, await detectFaces(canvas))
    return setResultUrl(await canvasToUrl(photoToSketch(canvas, sketchStyle)))
  }

  async function run(work: () => Promise<void>) {
    setStatus('working')
    setProgress(0)
    try {
      await work()
      setStatus('done')
    } catch {
      setStatus('failed')
    }
  }

  function onFile(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) return
    void run(async () => {
      const limit = mode === 'upscale' ? upscaleLimit() : MAX_SIDE[mode]
      const prepared = await fileToCanvas(file, limit)
      source.current = prepared.canvas
      setResized(prepared.resized)
      await render(prepared.canvas, style)
    })
  }

  function onStyle(next: SketchStyle) {
    setStyle(next)
    if (source.current) {
      const canvas = source.current
      void run(() => render(canvas, next))
    }
  }

  function onImageClick(event: MouseEvent<HTMLImageElement>) {
    const canvas = source.current
    if (mode !== 'faces' || !canvas) return
    const rect = event.currentTarget.getBoundingClientRect()
    const x = ((event.clientX - rect.left) / rect.width) * canvas.width
    const y = ((event.clientY - rect.top) / rect.height) * canvas.height
    const hit = boxes.find((box) => insideBox(box, x, y))
    const side = boxes[0]?.width ?? Math.max(canvas.width, canvas.height) * 0.12
    const next = hit
      ? boxes.filter((box) => box !== hit)
      : [...boxes, { x: x - side / 2, y: y - side / 2, width: side, height: side, score: 1 }]
    void showFaces(canvas, next)
  }

  return (
    <section className={ui.tool} aria-label={copy.name}>
      <div className={ui.inner}>
        <form className={ui.form} onSubmit={(event) => event.preventDefault()}>
          <label htmlFor={inputId} className={styles.drop}>
            <ImagePlus aria-hidden="true" />
            <span>בחירת תמונה</span>
            <input id={inputId} type="file" accept="image/*" className={styles.file} onChange={onFile} />
          </label>
          {mode === 'sketch' ? (
            <TileGroup legend="סגנון" name={styleName} options={STYLES} value={style} onChange={onStyle} columns="two" />
          ) : null}
          <p className={ui.note}>התמונה מעובדת במכשיר שלכם ולא נשלחת לשום שרת. {copy.hint}</p>
        </form>
        <div className={ui.output} aria-live="polite">
          <h2 className={ui.outputTitle}>התוצאה</h2>
          {status === 'idle' ? <p className={fun.panel}>בחרו תמונה כדי להתחיל.</p> : null}
          {status === 'working' ? (
            <p className={fun.panel}>
              <LoaderCircle aria-hidden="true" className={styles.spin} /> {copy.working}
              {progress > 0 ? ` ${Math.round(progress * 100)}%` : ''}
            </p>
          ) : null}
          {status === 'failed' ? <p className={fun.panel}>העיבוד נכשל. נסו תמונה אחרת או דפדפן מעודכן.</p> : null}
          {status === 'done' && resultUrl ? (
            <>
              <img
                src={resultUrl}
                alt={`תוצאה: ${copy.name}`}
                className={mode === 'background' ? `${styles.result} ${styles.transparent}` : styles.result}
                onClick={onImageClick}
              />
              {mode === 'faces' ? <p className={fun.panel}>נמצאו {boxes.length} אזורים מטושטשים.</p> : null}
              {resized ? <p className={ui.note}>התמונה הוקטנה לפני העיבוד כדי שהמכשיר יעמוד בזה.</p> : null}
              <a href={resultUrl} download={copy.output} className={ui.primary}>
                <Download aria-hidden="true" /> הורדה
              </a>
            </>
          ) : null}
        </div>
      </div>
    </section>
  )
}
