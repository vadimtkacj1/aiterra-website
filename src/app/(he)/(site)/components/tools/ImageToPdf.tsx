'use client'

import { useEffect, useId, useRef, useState, type ChangeEvent, type DragEvent } from 'react'
import { ArrowDown, ArrowUp, FileDown, ImagePlus, Trash2 } from 'lucide-react'
import { PAGE_MODES, buildPdf, type JpegPage, type PageMode } from '@/lib/image-to-pdf'
import ui from './toolUi.module.css'
import drop from './ImageCompressor.module.css'

type Item = { id: string; file: File; preview: string }

const ACCEPT = 'image/jpeg,image/png,image/webp,image/gif,image/bmp'
const JPEG_QUALITY = 0.9
const MAX_SIDE = 3000

async function toJpeg(file: File): Promise<JpegPage> {
  const bitmap = await createImageBitmap(file, { imageOrientation: 'from-image' })
  const scale = Math.min(1, MAX_SIDE / Math.max(bitmap.width, bitmap.height))
  const width = Math.round(bitmap.width * scale)
  const height = Math.round(bitmap.height * scale)
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const context = canvas.getContext('2d')
  if (!context) throw new Error('canvas')
  context.fillStyle = '#ffffff'
  context.fillRect(0, 0, width, height)
  context.drawImage(bitmap, 0, 0, width, height)
  bitmap.close()
  const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/jpeg', JPEG_QUALITY))
  if (!blob) throw new Error('encode')
  return { bytes: new Uint8Array(await blob.arrayBuffer()), width, height }
}

let counter = 0

const sizeText = (bytes: number) =>
  bytes < 1024 * 1024 ? `${Math.max(1, Math.round(bytes / 1024))} KB` : `${(bytes / 1024 / 1024).toFixed(1)} MB`

export default function ImageToPdf() {
  const baseId = useId()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [items, setItems] = useState<Item[]>([])
  const [mode, setMode] = useState<PageMode>('a4')
  const [busy, setBusy] = useState(false)
  const [status, setStatus] = useState('')
  const [dragging, setDragging] = useState(false)
  const [pdfUrl, setPdfUrl] = useState('')

  useEffect(
    () => () => {
      items.forEach((item) => URL.revokeObjectURL(item.preview))
    },
    [items],
  )

  useEffect(
    () => () => {
      if (pdfUrl) URL.revokeObjectURL(pdfUrl)
    },
    [pdfUrl],
  )

  const add = (files: FileList | null) => {
    if (!files) return
    const images = Array.from(files).filter((file) => file.type.startsWith('image/'))
    const skipped = files.length - images.length
    setItems((current) => [
      ...current,
      ...images.map((file) => {
        counter += 1
        return { id: `${counter}-${file.name}`, file, preview: URL.createObjectURL(file) }
      }),
    ])
    setPdfUrl('')
    setStatus(skipped ? `${skipped} קבצים שאינם תמונה לא נוספו.` : '')
  }

  const onPick = (event: ChangeEvent<HTMLInputElement>) => {
    add(event.target.files)
    event.target.value = ''
  }

  const onDrop = (event: DragEvent) => {
    event.preventDefault()
    setDragging(false)
    add(event.dataTransfer.files)
  }

  const move = (index: number, step: number) => {
    setItems((current) => {
      const next = [...current]
      const target = index + step
      if (target < 0 || target >= next.length) return current
      ;[next[index], next[target]] = [next[target], next[index]]
      return next
    })
    setPdfUrl('')
  }

  const remove = (id: string) => {
    setItems((current) => current.filter((item) => item.id !== id))
    setPdfUrl('')
  }

  const create = async () => {
    if (!items.length) return
    setBusy(true)
    setStatus('יוצרים את קובץ ה-PDF...')
    try {
      const pages: JpegPage[] = []
      for (const item of items) pages.push(await toJpeg(item.file))
      const pdf = buildPdf(pages, mode)
      const url = URL.createObjectURL(new Blob([pdf], { type: 'application/pdf' }))
      setPdfUrl(url)
      setStatus(`הקובץ מוכן: ${pages.length} עמודים, ${sizeText(pdf.length)}.`)
      window.gtag?.('event', 'image_pdf_create', { pages: pages.length, mode })
    } catch {
      setStatus('לא הצלחנו לקרוא אחת התמונות. תמונות HEIC מאייפון צריך קודם לשמור כ-JPEG, או לפתוח את הכלי בספארי.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <section
      className={ui.tool}
      aria-labelledby={`${baseId}-title`}
      onDragOver={(event) => {
        event.preventDefault()
        setDragging(true)
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={onDrop}
    >
      <div className={ui.inner}>
        <form className={ui.form} onSubmit={(event) => event.preventDefault()}>
          <div className={`${ui.group} ${drop.dropGroup}`}>
            <label className={drop.drop} data-dragging={dragging} data-compact={items.length > 0}>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept={ACCEPT}
                className={drop.fileInput}
                onChange={onPick}
              />
              <span className={drop.dropIcon} aria-hidden="true">
                <ImagePlus />
              </span>
              <span id={`${baseId}-title`} className={drop.dropTitle}>
                {items.length ? 'הוספת תמונות' : 'בחירת תמונות'}
              </span>
              <span className={drop.dropText}>JPG, PNG או WebP. כל תמונה הופכת לעמוד, לפי הסדר ברשימה.</span>
            </label>
          </div>

          {items.length ? (
            <div className={ui.group}>
              <h2 className={ui.legend}>סדר העמודים</h2>
              <ol>
                {items.map((item, index) => (
                  <li key={item.id}>
                    <span dir="auto">{item.file.name}</span>{' '}
                    <button type="button" className={ui.secondary} onClick={() => move(index, -1)} disabled={index === 0}>
                      <ArrowUp aria-hidden="true" />
                      <span>למעלה</span>
                    </button>{' '}
                    <button
                      type="button"
                      className={ui.secondary}
                      onClick={() => move(index, 1)}
                      disabled={index === items.length - 1}
                    >
                      <ArrowDown aria-hidden="true" />
                      <span>למטה</span>
                    </button>{' '}
                    <button type="button" className={ui.secondary} onClick={() => remove(item.id)}>
                      <Trash2 aria-hidden="true" />
                      <span>הסרה</span>
                    </button>
                  </li>
                ))}
              </ol>
            </div>
          ) : null}

          <fieldset className={ui.group}>
            <legend className={ui.legend}>גודל העמוד</legend>
            {PAGE_MODES.map((option) => (
              <label key={option.value} className={ui.option}>
                <input
                  type="radio"
                  name={`${baseId}-mode`}
                  value={option.value}
                  checked={mode === option.value}
                  onChange={() => {
                    setMode(option.value)
                    setPdfUrl('')
                  }}
                />
                <span>
                  {option.label}. {option.hint}
                </span>
              </label>
            ))}
          </fieldset>

          <div className={ui.actions}>
            <button type="button" className={ui.primary} onClick={create} disabled={!items.length || busy}>
              <FileDown aria-hidden="true" />
              יצירת PDF
            </button>
            {pdfUrl ? (
              <a className={ui.secondary} href={pdfUrl} download="images.pdf">
                <FileDown aria-hidden="true" />
                הורדת הקובץ
              </a>
            ) : null}
          </div>
          <p className={ui.status} role="status" aria-live="polite">
            {status}
          </p>
        </form>
      </div>
    </section>
  )
}
