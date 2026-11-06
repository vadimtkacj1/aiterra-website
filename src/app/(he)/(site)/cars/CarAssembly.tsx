'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import dynamic from 'next/dynamic'
import type { AssemblyProgress } from './CarScene3D'
import styles from './CarAssembly.module.css'

const CarScene3D = dynamic(() => import('./CarScene3D'), { ssr: false })

function canRender3D() {
  const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection
  if (connection?.saveData) return false
  const memory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory
  if (memory !== undefined && memory < 2) return false
  try {
    const canvas = document.createElement('canvas')
    return Boolean(canvas.getContext('webgl2') || canvas.getContext('webgl'))
  } catch {
    return false
  }
}

export type CarBody = 'sedan' | 'hatchback' | 'wagon' | 'suv'

export type AssemblyFact = { part: CarPart; label: string; value: string }

export type CarPart = 'body' | 'cabin' | 'glass' | 'frontWheel' | 'rearWheel' | 'headlight' | 'taillight'

type Shape = { lift: number; body: string; cabin: string; glass: string[]; doors: string }

const SHAPES: Record<CarBody, Shape> = {
  sedan: {
    lift: 0,
    body: 'M36 178 L36 152 Q38 134 66 130 L204 118 L436 118 L524 124 Q556 128 562 146 L564 178 L500 178 A50 50 0 0 0 400 178 L200 178 A50 50 0 0 0 100 178 Z',
    cabin: 'M206 119 L262 76 Q270 70 284 70 L372 70 Q384 70 394 78 L446 119 Z',
    glass: ['M226 115 L268 82 L312 82 L312 115 Z', 'M322 115 L322 82 L366 82 Q376 82 384 90 L418 115 Z'],
    doors: 'M316 122 L316 172 M206 126 L206 170 M430 124 L424 168',
  },
  hatchback: {
    lift: 0,
    body: 'M48 178 L48 152 Q50 134 78 130 L210 118 L468 118 L526 124 Q548 128 550 146 L550 178 L500 178 A50 50 0 0 0 400 178 L200 178 A50 50 0 0 0 100 178 Z',
    cabin: 'M212 119 L266 74 Q274 68 288 68 L452 70 Q470 72 480 88 L500 119 Z',
    glass: ['M232 115 L272 80 L330 80 L330 115 Z', 'M340 115 L340 80 L446 80 Q460 81 468 92 L482 115 Z'],
    doors: 'M334 122 L334 172 M212 126 L212 170 M470 124 L470 168',
  },
  wagon: {
    lift: 0,
    body: 'M36 178 L36 152 Q38 134 66 130 L204 118 L486 118 L540 124 Q560 128 562 146 L564 178 L500 178 A50 50 0 0 0 400 178 L200 178 A50 50 0 0 0 100 178 Z',
    cabin: 'M206 119 L262 74 Q270 68 284 68 L488 70 Q508 72 516 90 L530 119 Z',
    glass: ['M226 115 L268 80 L318 80 L318 115 Z', 'M328 115 L328 80 L420 80 L420 115 Z', 'M430 115 L430 80 L484 80 Q496 81 502 92 L512 115 Z'],
    doors: 'M322 122 L322 172 M206 126 L206 170 M424 122 L424 170',
  },
  suv: {
    lift: 10,
    body: 'M40 170 L40 140 Q42 122 72 118 L196 106 L488 106 L536 112 Q558 116 560 136 L560 170 L502 170 A52 52 0 0 0 398 170 L202 170 A52 52 0 0 0 98 170 Z',
    cabin: 'M198 107 L246 62 Q254 56 268 56 L470 56 Q490 56 498 74 L516 107 Z',
    glass: ['M218 103 L256 68 L316 68 L316 103 Z', 'M326 103 L326 68 L412 68 L412 103 Z', 'M422 103 L422 68 L470 68 Q482 68 488 80 L500 103 Z'],
    doors: 'M320 110 L320 164 M198 114 L198 160 M416 110 L416 164',
  },
}

const ENTRY: Record<CarPart, { dx: number; dy: number; turn: number; start: number }> = {
  body: { dx: 0, dy: 150, turn: 0, start: 0 },
  cabin: { dx: 0, dy: -170, turn: -6, start: 0.1 },
  glass: { dx: 0, dy: -230, turn: 0, start: 0.22 },
  frontWheel: { dx: -320, dy: 0, turn: -540, start: 0.3 },
  rearWheel: { dx: 320, dy: 0, turn: 540, start: 0.38 },
  headlight: { dx: -160, dy: -90, turn: -40, start: 0.5 },
  taillight: { dx: 160, dy: -90, turn: 40, start: 0.56 },
}

const PART_SPAN = 0.32
const easeOut = (value: number) => 1 - Math.pow(1 - value, 3)
const clamp = (value: number) => Math.min(1, Math.max(0, value))

function Wheel({ cx, cy }: { cx: number; cy: number }) {
  return (
    <>
      <circle cx={cx} cy={cy} r={38} className={styles.tire} />
      <circle cx={cx} cy={cy} r={24} className={styles.rim} />
      {[0, 72, 144, 216, 288].map((angle) => (
        <line
          key={angle}
          x1={cx}
          y1={cy}
          x2={cx + 22 * Math.cos((angle * Math.PI) / 180)}
          y2={cy + 22 * Math.sin((angle * Math.PI) / 180)}
          className={styles.spoke}
        />
      ))}
      <circle cx={cx} cy={cy} r={5} className={styles.hub} />
    </>
  )
}

export default function CarAssembly({
  body,
  title,
  facts,
}: {
  body: CarBody
  title: string
  facts: AssemblyFact[]
}) {
  const root = useRef<HTMLDivElement>(null)
  const progress = useRef<AssemblyProgress>({ current: 1, turn: 0, invalidate: null })
  const [want3D, setWant3D] = useState(false)
  const [ready3D, setReady3D] = useState(false)
  const [picked, setPicked] = useState<CarPart | null>(null)
  const markReady = useCallback(() => setReady3D(true), [])
  const pick = useCallback((part: CarPart) => {
    setPicked(part)
    window.setTimeout(() => setPicked((current) => (current === part ? null : current)), 1600)
  }, [])

  useEffect(() => {
    const element = root.current
    if (!element) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const shared = progress.current
    const parts = [...element.querySelectorAll<SVGGElement | HTMLElement>('[data-part]')]
    let frame = 0
    let visible = false

    const paint = () => {
      frame = 0
      const box = element.getBoundingClientRect()
      const travel = box.height - window.innerHeight
      const progress = travel > 0 ? clamp(-box.top / travel / 0.92) : clamp(1 - box.top / window.innerHeight)
      element.style.setProperty('--assembled', String(progress))
      shared.current = progress
      shared.invalidate?.()
      for (const part of parts) {
        const entry = ENTRY[part.dataset.part as CarPart]
        if (!entry) continue
        part.style.setProperty('--e', String(easeOut(clamp((progress - entry.start) / PART_SPAN))))
      }
    }
    const schedule = () => {
      if (visible && !frame) frame = requestAnimationFrame(paint)
    }
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
      schedule()
    })
    observer.observe(element)
    const nearby = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        nearby.disconnect()
        if (canRender3D()) setWant3D(true)
      },
      { rootMargin: '800px 0px' },
    )
    nearby.observe(element)
    element.classList.add(styles.live)
    paint()
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)
    return () => {
      observer.disconnect()
      nearby.disconnect()
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
      if (frame) cancelAnimationFrame(frame)
    }
  }, [])

  const shape = SHAPES[body]
  const wheelY = 178 - shape.lift
  const partStyle = (part: CarPart) =>
    ({
      '--dx': `${ENTRY[part].dx}px`,
      '--dy': `${ENTRY[part].dy}px`,
      '--turn': `${ENTRY[part].turn}deg`,
    }) as React.CSSProperties

  return (
    <div ref={root} className={styles.track}>
      <div className={styles.stage}>
        <p className={styles.title}>{title}</p>
        <div className={`${styles.visual} ${ready3D ? styles.visual3D : ""}`}>
        <svg viewBox="0 0 600 240" className={styles.car} aria-hidden="true">
          <line x1="10" y1="217" x2="590" y2="217" className={styles.ground} />
          <g data-part="body" className={styles.part} style={partStyle('body')}>
            <path d={shape.body} className={styles.shell} />
            <path d={shape.doors} className={styles.seam} />
          </g>
          <g data-part="cabin" className={styles.part} style={partStyle('cabin')}>
            <path d={shape.cabin} className={styles.shell} />
          </g>
          <g data-part="glass" className={styles.part} style={partStyle('glass')}>
            {shape.glass.map((d) => (
              <path key={d} d={d} className={styles.glass} />
            ))}
          </g>
          <g data-part="frontWheel" className={`${styles.part} ${styles.wheel}`} style={partStyle('frontWheel')}>
            <Wheel cx={150} cy={wheelY} />
          </g>
          <g data-part="rearWheel" className={`${styles.part} ${styles.wheel}`} style={partStyle('rearWheel')}>
            <Wheel cx={450} cy={wheelY} />
          </g>
          <g data-part="headlight" className={styles.part} style={partStyle('headlight')}>
            <path d={`M44 ${142 - shape.lift} Q50 ${134 - shape.lift} 72 ${132 - shape.lift} L76 ${142 - shape.lift} Z`} className={styles.light} />
          </g>
          <g data-part="taillight" className={styles.part} style={partStyle('taillight')}>
            <path d={`M548 ${132 - shape.lift} L560 ${136 - shape.lift} L560 ${148 - shape.lift} L548 ${148 - shape.lift} Z`} className={styles.tail} />
          </g>
        </svg>
          {want3D ? <CarScene3D body={body} progress={progress.current} onReady={markReady} onPick={pick} /> : null}
        </div>
        {ready3D ? <p className={styles.hint}>אפשר לסובב את הרכב ולגעת בגלגלים ובמרכב</p> : null}
        <ul className={styles.facts}>
          {facts.map((fact) => (
            <li key={fact.part} data-part={fact.part} className={`${styles.fact} ${picked === fact.part ? styles.picked : ""}`} style={partStyle(fact.part)}>
              <span className={styles.factValue}>{fact.value}</span>
              <span className={styles.factLabel}>{fact.label}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
