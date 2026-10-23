'use client'

import { useId, useState } from 'react'
import { Copy } from 'lucide-react'
import {
  BLACK,
  WHITE,
  contrastRatio,
  cssHsl,
  cssRgb,
  formatRatio,
  hslToRgb,
  levelsFor,
  parseChannel,
  parseHex,
  rgbToHsl,
  toHex,
  type Rgb,
} from '@/lib/color-convert'
import ui from './toolUi.module.css'
import styles from './ColorConverter.module.css'

type FieldKey = 'hex' | 'r' | 'g' | 'b' | 'h' | 's' | 'l'

type Draft = { key: FieldKey; value: string }

const START: Rgb = { r: 36, g: 71, b: 214 }

const rgbKeys: { key: 'r' | 'g' | 'b'; label: string }[] = [
  { key: 'r', label: 'אדום (R)' },
  { key: 'g', label: 'ירוק (G)' },
  { key: 'b', label: 'כחול (B)' },
]

const hslKeys: { key: 'h' | 's' | 'l'; label: string; max: number }[] = [
  { key: 'h', label: 'גוון (H, 0 עד 359)', max: 359 },
  { key: 's', label: 'רוויה (S, 0 עד 100)', max: 100 },
  { key: 'l', label: 'בהירות (L, 0 עד 100)', max: 100 },
]

const copyTargets = ['hex', 'rgb', 'hsl', 'all'] as const
type CopyTarget = (typeof copyTargets)[number]

const copyLabels: Record<CopyTarget, string> = {
  hex: 'העתקת HEX',
  rgb: 'העתקת RGB',
  hsl: 'העתקת HSL',
  all: 'העתקת CSS',
}

const levelText = (passed: boolean) => (passed ? 'עובר' : 'נכשל')

function ContrastRow({ label, background, text, ratio }: { label: string; background: Rgb; text: Rgb; ratio: number }) {
  const levels = levelsFor(ratio)
  return (
    <tr>
      <th scope="row">
        <span className={styles.sample} style={{ background: toHex(background), color: toHex(text) }} aria-hidden="true" />
        {label}
      </th>
      <td className={styles.ratio}>{formatRatio(ratio)}</td>
      <td className={levels.normalAA ? styles.pass : styles.fail}>{levelText(levels.normalAA)}</td>
      <td className={levels.largeAA ? styles.pass : styles.fail}>{levelText(levels.largeAA)}</td>
      <td className={levels.normalAAA ? styles.pass : styles.fail}>{levelText(levels.normalAAA)}</td>
    </tr>
  )
}

export default function ColorConverter() {
  const [rgb, setRgb] = useState<Rgb>(START)
  const [draft, setDraft] = useState<Draft | null>(null)
  const [status, setStatus] = useState('')
  const baseId = useId()

  const hex = toHex(rgb)
  const hsl = rgbToHsl(rgb)
  const derived: Record<FieldKey, string> = {
    hex,
    r: String(rgb.r),
    g: String(rgb.g),
    b: String(rgb.b),
    h: String(hsl.h),
    s: String(hsl.s),
    l: String(hsl.l),
  }

  const valueOf = (key: FieldKey) => (draft?.key === key ? draft.value : derived[key])

  const edit = (key: FieldKey, value: string) => {
    setStatus('')
    setDraft({ key, value })
    if (key === 'hex') {
      const parsed = parseHex(value)
      if (parsed) setRgb(parsed)
      return
    }
    if (key === 'r' || key === 'g' || key === 'b') {
      const channel = parseChannel(value, 255)
      if (channel !== null) setRgb({ ...rgb, [key]: channel })
      return
    }
    const max = key === 'h' ? 359 : 100
    const channel = parseChannel(value, max)
    if (channel !== null) setRgb(hslToRgb({ ...hsl, [key]: channel }))
  }

  const isInvalid = (key: FieldKey) => {
    if (draft?.key !== key) return false
    if (key === 'hex') return parseHex(draft.value) === null
    const max = key === 'h' ? 359 : key === 'r' || key === 'g' || key === 'b' ? 255 : 100
    return parseChannel(draft.value, max) === null
  }

  const pick = (value: string) => {
    const parsed = parseHex(value)
    if (!parsed) return
    setDraft(null)
    setStatus('')
    setRgb(parsed)
  }

  const copyText: Record<CopyTarget, string> = {
    hex,
    rgb: cssRgb(rgb),
    hsl: cssHsl(hsl),
    all: `color: ${hex};\ncolor: ${cssRgb(rgb)};\ncolor: ${cssHsl(hsl)};`,
  }

  const copy = async (target: CopyTarget) => {
    try {
      await navigator.clipboard.writeText(copyText[target])
      setStatus(`הועתק: ${target === 'all' ? 'שלוש שורות CSS' : copyText[target]}`)
    } catch {
      setStatus('לא הצלחנו להעתיק. סמנו את הקוד והעתיקו ידנית.')
    }
  }

  const field = (key: FieldKey, label: string, className = '') => {
    const id = `${baseId}-${key}`
    const invalid = isInvalid(key)
    return (
      <div className={ui.field} key={key}>
        <label htmlFor={id} className={ui.label}>
          {label}
        </label>
        <input
          id={id}
          className={`${ui.input} ${ui.ltr} ${className}`}
          inputMode={key === 'hex' ? 'text' : 'numeric'}
          autoComplete="off"
          spellCheck={false}
          maxLength={key === 'hex' ? 7 : 3}
          value={valueOf(key)}
          aria-invalid={invalid ? true : undefined}
          aria-describedby={invalid ? `${id}-error` : undefined}
          onChange={(event) => edit(key, event.target.value)}
          onBlur={() => setDraft((current) => (current?.key === key ? null : current))}
        />
        {invalid ? (
          <p id={`${id}-error`} className={styles.error}>
            {key === 'hex' ? 'הקלידו 3 או 6 תווים: 0 עד 9 ו-A עד F.' : 'הקלידו מספר שלם בטווח.'}
          </p>
        ) : null}
      </div>
    )
  }

  const whiteRatio = contrastRatio(rgb, WHITE)
  const blackRatio = contrastRatio(rgb, BLACK)

  return (
    <section className={ui.tool} aria-labelledby={`${baseId}-title`}>
      <div className={ui.inner}>
        <div className={ui.form}>
          <div className={ui.group}>
            <h2 id={`${baseId}-title`} className={ui.legend}>
              בחירת צבע
            </h2>
            <div className={styles.pickRow}>
              <label htmlFor={`${baseId}-picker`} className={ui.label}>
                בוחר צבעים
              </label>
              <input
                id={`${baseId}-picker`}
                type="color"
                className={styles.picker}
                value={hex.toLowerCase()}
                onChange={(event) => pick(event.target.value)}
              />
            </div>
            {field('hex', 'HEX')}
          </div>

          <fieldset className={ui.group}>
            <legend className={ui.legend}>RGB</legend>
            <div className={styles.triple}>{rgbKeys.map((item) => field(item.key, item.label))}</div>
          </fieldset>

          <fieldset className={ui.group}>
            <legend className={ui.legend}>HSL</legend>
            <div className={styles.triple}>{hslKeys.map((item) => field(item.key, item.label))}</div>
          </fieldset>
        </div>

        <div className={ui.output}>
          <div className={ui.sticky}>
            <h2 className={ui.outputTitle}>הקודים של הצבע</h2>
            <div className={styles.swatch} style={{ background: hex }} role="img" aria-label={`תצוגת הצבע ${hex}`} />
            <dl className={styles.codes}>
              <div>
                <dt>HEX</dt>
                <dd dir="ltr">{hex}</dd>
              </div>
              <div>
                <dt>RGB</dt>
                <dd dir="ltr">{cssRgb(rgb)}</dd>
              </div>
              <div>
                <dt>HSL</dt>
                <dd dir="ltr">{cssHsl(hsl)}</dd>
              </div>
            </dl>
            <div className={ui.actions}>
              {copyTargets.map((target) => (
                <button key={target} type="button" className={ui.secondary} onClick={() => copy(target)}>
                  <Copy aria-hidden="true" />
                  {copyLabels[target]}
                </button>
              ))}
            </div>
            <p className={ui.status} role="status">
              {status}
            </p>

            <h3 className={styles.subTitle}>ניגודיות מול לבן ושחור</h3>
            <div className={styles.tableWrap} tabIndex={0} role="region" aria-label="טבלת ניגודיות">
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th scope="col">טקסט</th>
                    <th scope="col">יחס</th>
                    <th scope="col">AA רגיל</th>
                    <th scope="col">AA גדול</th>
                    <th scope="col">AAA רגיל</th>
                  </tr>
                </thead>
                <tbody>
                  <ContrastRow label="לבן על הצבע" background={rgb} text={WHITE} ratio={whiteRatio} />
                  <ContrastRow label="שחור על הצבע" background={rgb} text={BLACK} ratio={blackRatio} />
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
