'use client'

import { useId, useState } from 'react'
import {
  DEFAULT_DPI,
  DEFAULT_PAPER_ID,
  DPI_PRESETS,
  aPapers,
  bPapers,
  dpiError,
  findPaper,
  formatNumber,
  formatPixels,
  mmToInches,
  orient,
  parseDpi,
  usPapers,
} from '@/lib/a4-size-converter'
import ui from './toolUi.module.css'
import styles from './A4SizeConverter.module.css'

const CUSTOM = 'custom'

const groups = [
  { label: 'סדרה A', items: aPapers },
  { label: 'סדרה B', items: bPapers },
  { label: 'אמריקאי', items: usPapers },
]

export default function A4SizeConverter() {
  const [paperId, setPaperId] = useState(DEFAULT_PAPER_ID)
  const [landscape, setLandscape] = useState(false)
  const [dpiChoice, setDpiChoice] = useState(String(DEFAULT_DPI))
  const [customDpi, setCustomDpi] = useState('')
  const baseId = useId()

  const paper = findPaper(paperId)
  const { widthMm, heightMm } = orient(paper, landscape)
  const isCustom = dpiChoice === CUSTOM
  const issue = isCustom ? dpiError(customDpi) : ''
  const dpi = isCustom ? parseDpi(customDpi) : Number(dpiChoice)

  return (
    <section className={ui.tool} aria-labelledby={`${baseId}-title`}>
      <div className={`${ui.inner} ${styles.inner}`}>
        <div className={ui.form}>
          <fieldset className={ui.group}>
            <legend id={`${baseId}-title`} className={ui.legend}>
              בחירת גודל נייר
            </legend>
            <div className={ui.row}>
              <div className={ui.field}>
                <label htmlFor={`${baseId}-paper`} className={ui.label}>
                  גודל
                </label>
                <select
                  id={`${baseId}-paper`}
                  className={`${ui.input} ${styles.select}`}
                  value={paperId}
                  onChange={(event) => setPaperId(event.target.value)}
                >
                  {groups.map((group) => (
                    <optgroup key={group.label} label={group.label}>
                      {group.items.map((item) => (
                        <option key={item.id} value={item.id}>
                          {item.label}
                        </option>
                      ))}
                    </optgroup>
                  ))}
                </select>
              </div>
              <div className={ui.field}>
                <label htmlFor={`${baseId}-dpi`} className={ui.label}>
                  רזולוציה (DPI)
                </label>
                <select
                  id={`${baseId}-dpi`}
                  className={`${ui.input} ${styles.select}`}
                  value={dpiChoice}
                  onChange={(event) => setDpiChoice(event.target.value)}
                >
                  {DPI_PRESETS.map((value) => (
                    <option key={value} value={value}>
                      {value}
                    </option>
                  ))}
                  <option value={CUSTOM}>ערך אחר</option>
                </select>
              </div>
              {isCustom ? (
                <div className={ui.field}>
                  <label htmlFor={`${baseId}-custom`} className={ui.label}>
                    DPI מותאם
                  </label>
                  <input
                    id={`${baseId}-custom`}
                    className={`${ui.input} ${ui.ltr}`}
                    inputMode="numeric"
                    autoComplete="off"
                    maxLength={4}
                    value={customDpi}
                    aria-invalid={issue ? true : undefined}
                    aria-describedby={issue ? `${baseId}-custom-error` : undefined}
                    onChange={(event) => setCustomDpi(event.target.value)}
                  />
                  {issue ? (
                    <p id={`${baseId}-custom-error`} className={styles.error}>
                      {issue}
                    </p>
                  ) : null}
                </div>
              ) : null}
            </div>
            <label className={ui.option}>
              <input
                type="checkbox"
                className={ui.checkbox}
                checked={landscape}
                onChange={(event) => setLandscape(event.target.checked)}
              />
              <span>לרוחב (landscape)</span>
            </label>
          </fieldset>

          <div className={ui.group}>
            <h2 className={ui.legend}>
              המידות של <span dir="ltr">{paper.label}</span>
              {landscape ? ' לרוחב' : ' לאורך'}
            </h2>
            <div aria-live="polite" aria-atomic="true">
              <dl className={styles.result}>
                <div className={styles.card}>
                  <dt>מילימטרים</dt>
                  <dd dir="ltr">
                    {formatNumber(widthMm, 1)} × {formatNumber(heightMm, 1)} mm
                  </dd>
                </div>
                <div className={styles.card}>
                  <dt>סנטימטרים</dt>
                  <dd dir="ltr">
                    {formatNumber(widthMm / 10, 2)} × {formatNumber(heightMm / 10, 2)} cm
                  </dd>
                </div>
                <div className={styles.card}>
                  <dt>אינצ׳ים</dt>
                  <dd dir="ltr">
                    {formatNumber(mmToInches(widthMm), 2)} × {formatNumber(mmToInches(heightMm), 2)} in
                  </dd>
                </div>
                <div className={styles.card}>
                  <dt>פיקסלים ב-{dpi ?? '...'} DPI</dt>
                  <dd dir="ltr">{dpi ? `${formatPixels(widthMm, heightMm, dpi)} px` : '-'}</dd>
                </div>
              </dl>
            </div>
            <p className={ui.note}>פיקסלים = מילימטרים חלקי 25.4, כפול ה-DPI, מעוגל למספר שלם.</p>
          </div>
        </div>
      </div>
    </section>
  )
}
