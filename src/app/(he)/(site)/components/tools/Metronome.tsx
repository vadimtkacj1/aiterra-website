'use client'

import { useCallback, useEffect, useId, useRef, useState, type KeyboardEvent } from 'react'
import {
  DEFAULT_BPM,
  DEFAULT_SIGNATURE,
  DEFAULT_SUBDIVISION,
  MAX_BPM,
  MIN_BPM,
  barDurationSeconds,
  beatLevels,
  bpmFromTaps,
  clampBpm,
  nextTaps,
  presets,
  secondsPerTick,
  signatures,
  subdivisions,
  tempoBand,
  type BeatLevel,
  type SignatureId,
  type SubdivisionId,
} from '@/lib/metronome'
import { Field, TileGroup } from './FunTiles'
import ui from './toolUi.module.css'
import fun from './FunTool.module.css'
import styles from './Metronome.module.css'

const LOOK_AHEAD_SECONDS = 0.12
const TIMER_MS = 25
const START_DELAY_SECONDS = 0.06
const CLICK_SECONDS = 0.05

const CLICK_PITCH: Record<BeatLevel | 'sub', { frequency: number; gain: number }> = {
  strong: { frequency: 1200, gain: 1 },
  medium: { frequency: 960, gain: 0.85 },
  normal: { frequency: 760, gain: 0.7 },
  sub: { frequency: 560, gain: 0.38 },
}

type Settings = {
  bpm: number
  signatureId: SignatureId
  subdivisionId: SubdivisionId
  accent: boolean
  volume: number
}

type QueuedBeat = { time: number; beat: number }

const findSignature = (id: SignatureId) => signatures.find((item) => item.id === id) ?? signatures[2]
const findSubdivision = (id: SubdivisionId) => subdivisions.find((item) => item.id === id) ?? subdivisions[0]

const isTextControl = (target: EventTarget) => {
  if (!(target instanceof HTMLElement)) return false
  return ['INPUT', 'SELECT', 'TEXTAREA'].includes(target.tagName)
}

export default function Metronome() {
  const bpmId = useId()
  const sliderId = useId()
  const volumeId = useId()
  const signatureName = useId()
  const subdivisionName = useId()

  const [bpm, setBpm] = useState(DEFAULT_BPM)
  const [draft, setDraft] = useState<string | null>(null)
  const [signatureId, setSignatureId] = useState<SignatureId>(DEFAULT_SIGNATURE)
  const [subdivisionId, setSubdivisionId] = useState<SubdivisionId>(DEFAULT_SUBDIVISION)
  const [accent, setAccent] = useState(true)
  const [volume, setVolume] = useState(80)
  const [playing, setPlaying] = useState(false)
  const [activeBeat, setActiveBeat] = useState(-1)
  const [tapCount, setTapCount] = useState(0)

  const context = useRef<AudioContext | null>(null)
  const timer = useRef<number | null>(null)
  const frame = useRef<number | null>(null)
  const queue = useRef<QueuedBeat[]>([])
  const position = useRef({ nextTime: 0, beat: 0, sub: 0 })
  const taps = useRef<number[]>([])
  const settings = useRef<Settings>({ bpm, signatureId, subdivisionId, accent, volume })

  useEffect(() => {
    settings.current = { bpm, signatureId, subdivisionId, accent, volume }
  }, [bpm, signatureId, subdivisionId, accent, volume])

  const signature = findSignature(signatureId)
  const levels = beatLevels(signature)
  const band = tempoBand(bpm)

  const click = useCallback((time: number, kind: BeatLevel | 'sub') => {
    const audio = context.current
    if (!audio) return
    const { frequency, gain } = CLICK_PITCH[kind]
    const peak = Math.max(0.0001, gain * (settings.current.volume / 100))
    const oscillator = audio.createOscillator()
    const envelope = audio.createGain()
    oscillator.type = 'triangle'
    oscillator.frequency.value = frequency
    envelope.gain.setValueAtTime(0.0001, time)
    envelope.gain.exponentialRampToValueAtTime(peak, time + 0.003)
    envelope.gain.exponentialRampToValueAtTime(0.0001, time + CLICK_SECONDS)
    oscillator.connect(envelope)
    envelope.connect(audio.destination)
    oscillator.start(time)
    oscillator.stop(time + CLICK_SECONDS + 0.01)
  }, [])

  const schedule = useCallback(() => {
    const audio = context.current
    if (!audio) return
    while (position.current.nextTime < audio.currentTime + LOOK_AHEAD_SECONDS) {
      const current = settings.current
      const currentSignature = findSignature(current.signatureId)
      const currentLevels = beatLevels(currentSignature)
      const perBeat = findSubdivision(current.subdivisionId).perBeat
      const beat = position.current.beat % currentSignature.beats
      const time = position.current.nextTime

      if (position.current.sub === 0) {
        click(time, current.accent ? currentLevels[beat] : 'normal')
        queue.current.push({ time, beat })
      } else {
        click(time, 'sub')
      }

      position.current.sub += 1
      if (position.current.sub >= perBeat) {
        position.current.sub = 0
        position.current.beat = (beat + 1) % currentSignature.beats
      }
      position.current.nextTime += secondsPerTick(current.bpm, perBeat)
    }
  }, [click])

  const draw = useCallback(() => {
    const audio = context.current
    if (audio) {
      while (queue.current.length && queue.current[0].time <= audio.currentTime) {
        const due = queue.current.shift()
        if (due) setActiveBeat(due.beat)
      }
    }
    frame.current = window.requestAnimationFrame(draw)
  }, [])

  const stop = useCallback(() => {
    if (timer.current !== null) window.clearInterval(timer.current)
    if (frame.current !== null) window.cancelAnimationFrame(frame.current)
    timer.current = null
    frame.current = null
    queue.current = []
    setPlaying(false)
    setActiveBeat(-1)
  }, [])

  const start = useCallback(async () => {
    if (!context.current) {
      const Constructor =
        window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
      if (!Constructor) return
      context.current = new Constructor()
    }
    await context.current.resume()
    position.current = { nextTime: context.current.currentTime + START_DELAY_SECONDS, beat: 0, sub: 0 }
    queue.current = []
    schedule()
    timer.current = window.setInterval(schedule, TIMER_MS)
    frame.current = window.requestAnimationFrame(draw)
    setPlaying(true)
    window.gtag?.('event', 'metronome_start', { bpm: settings.current.bpm })
  }, [draw, schedule])

  const toggle = useCallback(() => {
    if (playing) stop()
    else void start()
  }, [playing, start, stop])

  useEffect(
    () => () => {
      if (timer.current !== null) window.clearInterval(timer.current)
      if (frame.current !== null) window.cancelAnimationFrame(frame.current)
      void context.current?.close()
      context.current = null
    },
    [],
  )

  const changeBpm = useCallback((next: number) => {
    setBpm(clampBpm(next))
    setDraft(null)
  }, [])

  const tap = useCallback(() => {
    taps.current = nextTaps(taps.current, performance.now())
    setTapCount(taps.current.length)
    const estimated = bpmFromTaps(taps.current)
    if (estimated !== null) changeBpm(estimated)
  }, [changeBpm])

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.ctrlKey || event.metaKey || event.altKey || isTextControl(event.target)) return
    const onButton = event.target instanceof HTMLButtonElement
    if (event.code === 'Space' && !onButton) {
      event.preventDefault()
      toggle()
    } else if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
      event.preventDefault()
      const step = event.shiftKey ? 10 : 1
      changeBpm(bpm + (event.key === 'ArrowUp' ? step : -step))
    } else if (event.code === 'KeyT') {
      event.preventDefault()
      tap()
    }
  }

  const bpmField = draft ?? String(bpm)

  const stepButton = (delta: number) => (
    <button type="button" className={ui.secondary} onClick={() => changeBpm(bpm + delta)}>
      <span dir="ltr" aria-hidden="true">
        {delta > 0 ? `+${delta}` : `−${Math.abs(delta)}`}
      </span>
      <span className={fun.srOnly}>
        {delta > 0 ? 'הוספת' : 'הפחתת'} {Math.abs(delta)} פעימות לדקה
      </span>
    </button>
  )

  return (
    <section className={ui.tool} aria-label="מטרונום אונליין">
      <div className={ui.inner}>
        <form className={ui.form} onSubmit={(event) => event.preventDefault()}>
          <fieldset className={ui.group}>
            <legend className={ui.legend}>קצב</legend>
            <Field id={bpmId} label={`פעימות בדקה (${MIN_BPM} עד ${MAX_BPM})`}>
              <input
                id={bpmId}
                type="text"
                inputMode="numeric"
                autoComplete="off"
                className={`${ui.input} ${ui.ltr}`}
                value={bpmField}
                onChange={(event) => {
                  const text = event.target.value.replace(/\D/g, '').slice(0, 3)
                  setDraft(text)
                  const parsed = Number.parseInt(text, 10)
                  if (parsed >= MIN_BPM && parsed <= MAX_BPM) setBpm(parsed)
                }}
                onBlur={() => {
                  const parsed = Number.parseInt(draft ?? '', 10)
                  changeBpm(Number.isNaN(parsed) ? bpm : parsed)
                }}
              />
            </Field>
            <div className={styles.slider}>
              <label htmlFor={sliderId} className={fun.srOnly}>
                מחוון קצב
              </label>
              <input
                id={sliderId}
                type="range"
                dir="ltr"
                min={MIN_BPM}
                max={MAX_BPM}
                step={1}
                value={bpm}
                onChange={(event) => changeBpm(Number(event.target.value))}
              />
            </div>
            <div className={styles.steps}>
              {stepButton(-5)}
              {stepButton(-1)}
              {stepButton(1)}
              {stepButton(5)}
            </div>
            <div className={styles.presets} role="group" aria-label="קצבים מוכנים">
              {presets.map((preset) => (
                <button
                  key={preset.id}
                  type="button"
                  className={styles.preset}
                  aria-pressed={bpm === preset.bpm}
                  onClick={() => changeBpm(preset.bpm)}
                >
                  {preset.label} {preset.bpm}
                </button>
              ))}
            </div>
            <div className={ui.actions}>
              <button type="button" className={ui.secondary} onClick={tap}>
                הקשת קצב
              </button>
              <p className={styles.tapNote} aria-live="polite">
                {tapCount >= 2 ? `לפי ${tapCount} הקשות` : 'מקישים כמה פעמים בקצב הרצוי'}
              </p>
            </div>
          </fieldset>

          <fieldset className={ui.group}>
            <legend className={ui.legend}>משקל וחלוקה</legend>
            <TileGroup
              legend="משקל"
              name={signatureName}
              options={signatures.map((item) => ({ id: item.id, label: item.label }))}
              value={signatureId}
              onChange={setSignatureId}
              columns="wide"
            />
            <TileGroup
              legend="חלוקת הפעמה"
              name={subdivisionName}
              options={subdivisions}
              value={subdivisionId}
              onChange={setSubdivisionId}
              columns="two"
            />
            <label className={ui.option}>
              <input
                type="checkbox"
                className={ui.checkbox}
                checked={accent}
                onChange={(event) => setAccent(event.target.checked)}
              />
              <span>הדגשת הפעמה הראשונה בתיבה</span>
            </label>
            <Field id={volumeId} label="עוצמה">
              <input
                id={volumeId}
                type="range"
                dir="ltr"
                min={5}
                max={100}
                step={5}
                value={volume}
                onChange={(event) => setVolume(Number(event.target.value))}
              />
            </Field>
          </fieldset>
        </form>

        <div className={ui.output}>
          <div
            className={styles.stage}
            role="group"
            tabIndex={0}
            aria-label="מסך המטרונום. רווח מתחיל ועוצר, חצים למעלה ולמטה משנים קצב, והמקש T מקיש קצב."
            onKeyDown={handleKeyDown}
          >
            <p className={styles.bpm} dir="ltr">
              <span className={styles.bpmValue}>{bpm}</span>
              <span className={styles.bpmUnit}>BPM</span>
            </p>
            <p className={styles.band}>
              {band.name}: {band.meaning}
            </p>
            <ol className={styles.dots} aria-hidden="true" dir="ltr">
              {levels.map((level, index) => (
                <li
                  key={`${signatureId}-${index}`}
                  className={`${styles.dot} ${level !== 'normal' ? styles.dotStrong : ''} ${
                    activeBeat === index ? styles.dotActive : ''
                  }`}
                />
              ))}
            </ol>
            <button type="button" className={`${ui.primary} ${styles.start}`} onClick={toggle} aria-pressed={playing}>
              {playing ? 'עצירה' : 'התחלה'}
            </button>
            <p className={styles.keys}>
              קיצורי מקלדת כשהמסך בפוקוס: רווח להתחלה ולעצירה, חצים למעלה ולמטה לשינוי קצב (עם Shift בקפיצות של
              10), T להקשת קצב.
            </p>
          </div>
          <p className={`${ui.note} ${fun.flush}`}>
            תיבה אחת נמשכת {barDurationSeconds(bpm, signature.beats).toFixed(1)} שניות. הצליל נוצר בדפדפן ולא נשלח
            לשום מקום.
          </p>
        </div>
      </div>
    </section>
  )
}
