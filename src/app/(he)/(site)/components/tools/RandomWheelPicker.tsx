'use client'

import ShareResultButton from './ShareResultButton'
import { useCallback, useEffect, useId, useRef, useState, type ChangeEvent, type KeyboardEvent } from 'react'
import { Link2, RotateCw, Trash2 } from 'lucide-react'
import {
  MIN_SPIN_NAMES,
  SPIN_MS,
  easeOut,
  indexAtPointer,
  namesFromQuery,
  parseNames,
  randomBelow,
  removeAt,
  sampleNames,
  shareQuery,
  targetRotation,
  wheelColors,
  yesNoNames,
} from '@/lib/wheel-picker'
import ui from './toolUi.module.css'
import styles from './RandomWheelPicker.module.css'

const SIZE = 520
const LABEL_LIMIT = 14

const clip = (name: string) => (name.length > LABEL_LIMIT ? `${name.slice(0, LABEL_LIMIT - 1)}…` : name)

function drawWheel(canvas: HTMLCanvasElement, names: string[], rotation: number) {
  const ratio = window.devicePixelRatio || 1
  canvas.width = SIZE * ratio
  canvas.height = SIZE * ratio
  const context = canvas.getContext('2d')
  if (!context) return
  context.scale(ratio, ratio)
  const centre = SIZE / 2
  const radius = centre - 6
  const count = Math.max(names.length, 1)
  const angle = (Math.PI * 2) / count
  const start = -Math.PI / 2 + rotation
  for (let index = 0; index < count; index += 1) {
    context.beginPath()
    context.moveTo(centre, centre)
    context.arc(centre, centre, radius, start + index * angle, start + (index + 1) * angle)
    context.closePath()
    context.fillStyle = names.length ? wheelColors[index % wheelColors.length] : '#d6d0c8'
    context.fill()
    context.lineWidth = 2
    context.strokeStyle = '#ffffff'
    context.stroke()
    if (!names.length) continue
    context.save()
    context.translate(centre, centre)
    context.rotate(start + (index + 0.5) * angle)
    context.textAlign = 'right'
    context.textBaseline = 'middle'
    context.fillStyle = '#ffffff'
    context.font = `600 ${count > 24 ? 14 : 20}px Heebo, Arial, sans-serif`
    context.direction = 'rtl'
    context.fillText(clip(names[index]), radius - 18, 0)
    context.restore()
  }
  context.beginPath()
  context.arc(centre, centre, 22, 0, Math.PI * 2)
  context.fillStyle = '#ffffff'
  context.fill()
}

export default function RandomWheelPicker() {
  const [text, setText] = useState(sampleNames.join('\n'))
  const [winner, setWinner] = useState('')
  const [winnerIndex, setWinnerIndex] = useState(-1)
  const [spinning, setSpinning] = useState(false)
  const [status, setStatus] = useState('')
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const rotationRef = useRef(0)
  const frameRef = useRef(0)
  const textId = useId()
  const names = parseNames(text)
  const canSpin = names.length >= MIN_SPIN_NAMES && !spinning

  useEffect(() => {
    const fromUrl = namesFromQuery(window.location.search)
    if (fromUrl.length) setText(fromUrl.join('\n'))
  }, [])

  useEffect(() => {
    if (canvasRef.current && !spinning) drawWheel(canvasRef.current, parseNames(text), rotationRef.current)
  }, [text, spinning])

  useEffect(() => () => cancelAnimationFrame(frameRef.current), [])

  const finish = useCallback((index: number, list: string[]) => {
    setSpinning(false)
    setWinnerIndex(index)
    setWinner(list[index])
  }, [])

  const spin = useCallback(() => {
    if (!canSpin || !canvasRef.current) return
    const list = names
    const index = randomBelow(list.length)
    const jitter = randomBelow(1000) / 1000 - 0.5
    const from = rotationRef.current
    const to = targetRotation(from, index, list.length, jitter)
    setWinner('')
    setWinnerIndex(-1)
    setStatus('')
    const canvas = canvasRef.current
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      rotationRef.current = to
      drawWheel(canvas, list, to)
      finish(index, list)
      return
    }
    setSpinning(true)
    const began = performance.now()
    const step = (now: number) => {
      const progress = Math.min(1, (now - began) / SPIN_MS)
      rotationRef.current = from + (to - from) * easeOut(progress)
      drawWheel(canvas, list, rotationRef.current)
      if (progress < 1) frameRef.current = requestAnimationFrame(step)
      else finish(indexAtPointer(rotationRef.current, list.length), list)
    }
    frameRef.current = requestAnimationFrame(step)
  }, [canSpin, names, finish])

  const onText = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setText(event.target.value)
    setWinner('')
    setWinnerIndex(-1)
  }

  const onKey = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') {
      event.preventDefault()
      spin()
    }
  }

  const removeWinner = () => {
    if (winnerIndex < 0) return
    setText(removeAt(names, winnerIndex).join('\n'))
    setStatus(`${winner} הוסר מהרשימה.`)
    setWinner('')
    setWinnerIndex(-1)
  }

  const copyLink = async () => {
    const url = `${window.location.origin}${window.location.pathname}?${shareQuery(names)}`
    try {
      await navigator.clipboard.writeText(url)
      setStatus('הקישור לרשימה הועתק.')
    } catch {
      setStatus('ההעתקה נכשלה. העתיקו את הקישור משורת הכתובת.')
    }
  }

  return (
    <section className={ui.tool} aria-label="גלגל מזל">
      <div className={ui.inner}>
        <form className={ui.form} onSubmit={(event) => event.preventDefault()}>
          <div className={ui.group}>
            <label htmlFor={textId} className={ui.legend}>
              השמות, שם בכל שורה
            </label>
            <textarea
              id={textId}
              className={`${ui.input} ${ui.textarea} ${styles.names}`}
              dir="auto"
              value={text}
              onChange={onText}
              onKeyDown={onKey}
              aria-describedby={`${textId}-hint`}
            />
            <p id={`${textId}-hint`} className={ui.hint}>
              עד 60 שמות. Ctrl+Enter מסובב את הגלגל. אותו שם פעמיים מגדיל את הסיכוי שלו.
            </p>
            <div className={ui.actions}>
              <button type="button" className={ui.secondary} onClick={() => setText(yesNoNames.join('\n'))}>
                כן או לא
              </button>
              <button type="button" className={ui.secondary} onClick={() => setText(sampleNames.join('\n'))}>
                רשימת דוגמה
              </button>
              <button type="button" className={ui.secondary} onClick={copyLink} disabled={!names.length}>
                <Link2 aria-hidden="true" />
                קישור לרשימה
              </button>
            </div>
            <p className={ui.status} role="status" aria-live="polite">
              {status}
            </p>
            <p className={ui.note}>הרשימה נשארת בדפדפן שלכם. היא נשלחת רק אם אתם מעתיקים את הקישור.</p>
          </div>
        </form>

        <div className={ui.output}>
          <div className={styles.stage}>
            <span className={styles.pointer} aria-hidden="true" />
            <canvas
              ref={canvasRef}
              className={styles.canvas}
              role="img"
              aria-label={names.length ? `גלגל עם ${names.length} שמות` : 'גלגל ריק'}
            />
          </div>
          <div className={`${ui.actions} ${styles.centered}`}>
            <button type="button" className={ui.primary} onClick={spin} disabled={!canSpin}>
              <RotateCw aria-hidden="true" />
              {spinning ? 'מסתובב' : 'סובבו את הגלגל'}
            </button>
            <button type="button" className={ui.secondary} onClick={removeWinner} disabled={winnerIndex < 0}>
              <Trash2 aria-hidden="true" />
              הסרת הזוכה מהרשימה
            </button>
          </div>
          <p className={styles.result} role="status" aria-live="polite">
            {winner ? `הזוכה: ${winner}` : names.length < MIN_SPIN_NAMES ? 'צריך לפחות שני שמות.' : ''}
          </p>
          {winner && !spinning ? (
            <div className={`${ui.actions} ${styles.centered}`}>
              <ShareResultButton className={ui.secondary} tool="wheel" text={`הזוכה בהגרלה: ${winner}`} />
            </div>
          ) : null}
        </div>
      </div>
    </section>
  )
}
