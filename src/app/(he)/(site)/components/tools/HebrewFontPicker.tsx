'use client'

import { useEffect, useId, useMemo, useRef, useState, type ReactNode } from 'react'
import { preconnect } from 'react-dom'
import { Copy, ExternalLink } from 'lucide-react'
import {
  DEFAULT_PAIR,
  DEFAULT_PREVIEW_TEXT,
  EMPTY_PREVIEW_TEXT,
  MAX_TEXT_LENGTH,
  PAIR_BODY_TEXT,
  categoryCounts,
  categoryLabels,
  categoryOrder,
  defaultWeight,
  findFont,
  fontFamilyValue,
  hebrewFonts,
  matchesQuery,
  nearestWeight,
  pairCode,
  singleFontCode,
  specimenUrl,
  stylesheetUrl,
  weightNames,
  type CodeFormat,
  type FontCategory,
  type FontChoice,
  type HebrewFont,
} from '@/lib/hebrew-fonts'
import ui from './toolUi.module.css'
import styles from './HebrewFontPicker.module.css'

type ViewMode = 'grid' | 'pair'
type Backdrop = 'light' | 'dark'
type CategoryFilter = 'all' | FontCategory
type Choice<T extends string> = { value: T; label: string; count?: number }
type CopyEvent = { font_family: string; font_weight: string; mode: 'single' | 'pair' }

const DEFAULT_SIZE = 32
const FONT_LOAD_TIMEOUT_MS = 6000
const COPIED_RESET_MS = 2500
const COUNT_ANNOUNCE_DELAY_MS = 600
const TOTAL = hebrewFonts.length

const viewChoices: Choice<ViewMode>[] = [
  { value: 'grid', label: 'כל הפונטים' },
  { value: 'pair', label: 'כותרת וטקסט יחד' },
]

const backdropChoices: Choice<Backdrop>[] = [
  { value: 'light', label: 'בהיר' },
  { value: 'dark', label: 'כהה' },
]

const formatChoices: Choice<CodeFormat>[] = [
  { value: 'html', label: 'HTML' },
  { value: 'css', label: 'CSS' },
]

const categoryChoices: Choice<CategoryFilter>[] = [
  { value: 'all', label: 'הכול', count: TOTAL },
  ...categoryCounts.map(({ category, count }) => ({ value: category, label: categoryLabels[category], count })),
]

const Term = ({ children }: { children: string }) => <bdi className={styles.term}>{children}</bdi>

const formatHints: Record<CodeFormat, ReactNode> = {
  html: (
    <>
      תגי ה-<Term>link</Term> נכנסים לתוך ה-<Term>head</Term> של הדף, ושורת <Term>font-family</Term> לכלל
      ב-CSS.
    </>
  ),
  css: (
    <>
      שורת ה-<Term>@import</Term> נכנסת לראש קובץ ה-CSS, לפני כל הכללים.
    </>
  ),
}

const COPY_FAILED = 'ההעתקה נכשלה. נסו שוב, או העתיקו את הקוד מהדף של הפונט ב-Google Fonts.'

const describeCount = (count: number) => {
  if (count === TOTAL) return `${TOTAL} פונטים, לפי הפופולריות שלהם ב-Google Fonts`
  if (count === 0) return 'לא נמצאו פונטים'
  return `${count === 1 ? 'פונט אחד' : `${count} פונטים`} מתוך ${TOTAL}`
}

const weightsLabel = (font: HebrewFont) =>
  font.weights.length === 1 ? 'משקל אחד' : `${font.weights.length} משקלים`

const stylesheets = new Map<string, Promise<void>>()

function loadStylesheet(href: string) {
  const existing = stylesheets.get(href)
  if (existing) return existing
  const loaded = new Promise<void>((resolve) => {
    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href = href
    link.onload = () => resolve()
    link.onerror = () => resolve()
    document.head.appendChild(link)
  })
  stylesheets.set(href, loaded)
  return loaded
}

async function loadFont(family: string, weight: number, sample: string) {
  await loadStylesheet(stylesheetUrl([{ family, weight }]))
  await document.fonts.load(`${weight} 32px "${family}"`, sample).catch(() => [])
}

function useInView<T extends Element>() {
  const ref = useRef<T>(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const node = ref.current
    if (!node || inView) return
    if (typeof IntersectionObserver === 'undefined') {
      setInView(true)
      return
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) setInView(true)
      },
      { rootMargin: '240px 0px' },
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [inView])

  return [ref, inView] as const
}

function useFontReady(family: string, weight: number, sample: string, enabled: boolean) {
  const key = `${family}:${weight}`
  const [readyKey, setReadyKey] = useState('')
  const sampleRef = useRef(sample)

  useEffect(() => {
    sampleRef.current = sample
  }, [sample])

  useEffect(() => {
    if (!enabled) return
    let cancelled = false
    const markReady = () => {
      if (!cancelled) setReadyKey(key)
    }
    const timeout = window.setTimeout(markReady, FONT_LOAD_TIMEOUT_MS)
    loadFont(family, weight, sampleRef.current).then(markReady)
    return () => {
      cancelled = true
      window.clearTimeout(timeout)
    }
  }, [enabled, family, weight, key])

  return readyKey === key
}

function ChoiceTiles<T extends string>({
  legend,
  name,
  choices,
  value,
  onChange,
  className = '',
  children,
}: {
  legend: string
  name: string
  choices: Choice<T>[]
  value: T
  onChange: (value: T) => void
  className?: string
  children?: ReactNode
}) {
  return (
    <fieldset className={ui.group}>
      <legend className={ui.legend}>{legend}</legend>
      <div className={`${ui.options} ${styles.tiles} ${className}`}>
        {choices.map((choice) => (
          <label key={choice.value} className={ui.option}>
            <input
              type="radio"
              name={name}
              value={choice.value}
              className={ui.checkbox}
              checked={value === choice.value}
              onChange={() => onChange(choice.value)}
            />
            <span className={styles.tileText}>
              <span>{choice.label}</span>
              {choice.count !== undefined ? <span className={styles.tileCount}>{choice.count}</span> : null}
            </span>
          </label>
        ))}
      </div>
      {children}
    </fieldset>
  )
}

function WeightSelect({
  id,
  font,
  value,
  onChange,
  className = '',
}: {
  id: string
  font: HebrewFont
  value: number
  onChange: (weight: number) => void
  className?: string
}) {
  return (
    <select
      id={id}
      className={`${ui.input} ${styles.select} ${className}`}
      value={value}
      onChange={(event) => onChange(Number(event.target.value))}
    >
      {font.weights.map((weight) => (
        <option key={weight} value={weight}>
          {weight} · {weightNames[weight]}
        </option>
      ))}
    </select>
  )
}

function FontCard({
  font,
  weight,
  text,
  size,
  copied,
  onWeightChange,
  onCopy,
}: {
  font: HebrewFont
  weight: number
  text: string
  size: number
  copied: boolean
  onWeightChange: (weight: number) => void
  onCopy: () => void
}) {
  const weightId = useId()
  const [ref, inView] = useInView<HTMLLIElement>()
  const ready = useFontReady(font.family, weight, text, inView)

  return (
    <li ref={ref} className={styles.card}>
      <div className={styles.cardHead}>
        <h3 className={styles.name} lang="en">
          {font.family}
        </h3>
        <span className={styles.license}>רישיון {font.license}</span>
      </div>
      <p className={styles.meta}>
        {categoryLabels[font.category]} · {weightsLabel(font)}
      </p>
      <div className={styles.preview} style={{ minHeight: Math.round(size * 2.6) + 36 }} aria-hidden="true">
        {inView ? (
          <p
            className={styles.previewText}
            style={{
              fontFamily: fontFamilyValue(font),
              fontWeight: weight,
              fontSize: size,
              opacity: ready ? 1 : 0,
            }}
          >
            {text}
          </p>
        ) : null}
      </div>
      {font.weights.length > 1 ? (
        <div className={styles.weightField}>
          <label htmlFor={weightId} className={styles.weightLabel}>
            משקל<span className={styles.srOnly}> של {font.family}</span>
          </label>
          <WeightSelect id={weightId} font={font} value={weight} onChange={onWeightChange} />
        </div>
      ) : null}
      <div className={styles.cardActions}>
        <button type="button" className={`${ui.secondary} ${styles.cardButton}`} onClick={onCopy}>
          <Copy aria-hidden="true" />
          {copied ? (
            'הקוד הועתק'
          ) : (
            <>
              העתקת קוד<span className={styles.srOnly}> של {font.family}</span>
            </>
          )}
        </button>
        <a
          href={specimenUrl(font.family)}
          target="_blank"
          rel="noopener noreferrer"
          className={`${ui.secondary} ${styles.cardButton}`}
        >
          <span className={styles.srOnly}>הדף של {font.family} ב-</span>
          <span lang="en">Google Fonts</span>
          <span className={styles.srOnly}> (נפתח בחלון חדש)</span>
          <ExternalLink aria-hidden="true" className={styles.external} />
        </a>
      </div>
    </li>
  )
}

function PairFontField({
  legend,
  role,
  choice,
  onChange,
}: {
  legend: string
  role: string
  choice: FontChoice
  onChange: (choice: FontChoice) => void
}) {
  const fontId = useId()
  const weightId = useId()
  const font = findFont(choice.family) ?? hebrewFonts[0]

  const chooseFamily = (family: string) => {
    const next = findFont(family)
    if (next) onChange({ family: next.family, weight: nearestWeight(next.weights, choice.weight) })
  }

  return (
    <fieldset className={`${ui.group} ${styles.pairGroup}`}>
      <legend className={ui.legend}>{legend}</legend>
      <div className={styles.selectRow}>
        <div className={ui.field}>
          <label htmlFor={fontId} className={ui.label}>
            פונט<span className={styles.srOnly}> {role}</span>
          </label>
          <select
            id={fontId}
            className={`${ui.input} ${styles.select}`}
            value={choice.family}
            onChange={(event) => chooseFamily(event.target.value)}
          >
            {categoryOrder.map((category) => (
              <optgroup key={category} label={categoryLabels[category]}>
                {hebrewFonts
                  .filter((item) => item.category === category)
                  .map((item) => (
                    <option key={item.family} value={item.family}>
                      {item.family}
                    </option>
                  ))}
              </optgroup>
            ))}
          </select>
        </div>
        <div className={ui.field}>
          <label htmlFor={weightId} className={ui.label}>
            משקל<span className={styles.srOnly}> {role}</span>
          </label>
          <WeightSelect
            id={weightId}
            font={font}
            value={choice.weight}
            onChange={(weight) => onChange({ ...choice, weight })}
          />
        </div>
      </div>
    </fieldset>
  )
}

function PairPreview({
  pair,
  text,
  size,
  format,
  copied,
  onChange,
  onCopy,
}: {
  pair: { heading: FontChoice; body: FontChoice }
  text: string
  size: number
  format: CodeFormat
  copied: boolean
  onChange: (pair: { heading: FontChoice; body: FontChoice }) => void
  onCopy: (code: string) => void
}) {
  const codeHeadingId = useId()
  const headingFont = findFont(pair.heading.family) ?? hebrewFonts[0]
  const bodyFont = findFont(pair.body.family) ?? hebrewFonts[0]
  const headingReady = useFontReady(pair.heading.family, pair.heading.weight, text, true)
  const bodyReady = useFontReady(pair.body.family, pair.body.weight, PAIR_BODY_TEXT, true)
  const code = pairCode(pair.heading, pair.body, format)

  return (
    <div className={styles.pair}>
      <div className={styles.pairControls}>
        <PairFontField
          legend="כותרת"
          role="לכותרת"
          choice={pair.heading}
          onChange={(heading) => onChange({ ...pair, heading })}
        />
        <PairFontField
          legend="טקסט רץ"
          role="לטקסט רץ"
          choice={pair.body}
          onChange={(body) => onChange({ ...pair, body })}
        />
      </div>

      <div className={styles.pairPreview}>
        <p
          className={styles.pairHeading}
          style={{
            fontFamily: fontFamilyValue(headingFont),
            fontWeight: pair.heading.weight,
            fontSize: size,
            opacity: headingReady ? 1 : 0,
          }}
        >
          {text}
        </p>
        <p
          className={styles.pairBody}
          style={{
            fontFamily: fontFamilyValue(bodyFont),
            fontWeight: pair.body.weight,
            opacity: bodyReady ? 1 : 0,
          }}
        >
          {PAIR_BODY_TEXT}
        </p>
      </div>

      <section className={styles.codeBlock} aria-labelledby={codeHeadingId}>
        <h3 id={codeHeadingId} className={styles.codeTitle}>
          הקוד לאתר
        </h3>
        <pre className={styles.code} dir="ltr">
          <code>{code}</code>
        </pre>
        <div className={ui.actions}>
          <button type="button" className={ui.primary} onClick={() => onCopy(code)}>
            <Copy aria-hidden="true" />
            {copied ? 'הקוד הועתק' : 'העתקת הקוד'}
          </button>
        </div>
      </section>
    </div>
  )
}

export default function HebrewFontPicker() {
  preconnect('https://fonts.googleapis.com')
  preconnect('https://fonts.gstatic.com', { crossOrigin: 'anonymous' })

  const textId = useId()
  const textHintId = useId()
  const sizeId = useId()
  const searchId = useId()
  const viewName = useId()
  const backdropName = useId()
  const formatName = useId()
  const categoryName = useId()
  const resultsHeadingId = useId()

  const [text, setText] = useState(DEFAULT_PREVIEW_TEXT)
  const [size, setSize] = useState(DEFAULT_SIZE)
  const [view, setView] = useState<ViewMode>('grid')
  const [backdrop, setBackdrop] = useState<Backdrop>('light')
  const [format, setFormat] = useState<CodeFormat>('html')
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState<CategoryFilter>('all')
  const [nikudOnly, setNikudOnly] = useState(false)
  const [weights, setWeights] = useState<Record<string, number>>({})
  const [pair, setPair] = useState(DEFAULT_PAIR)
  const [copied, setCopied] = useState<string | null>(null)
  const [announcement, setAnnouncement] = useState('')
  const [countText, setCountText] = useState(() => describeCount(TOTAL))
  const copiedTimer = useRef<number | undefined>(undefined)

  const previewText = text.trim() ? text : EMPTY_PREVIEW_TEXT

  const visibleFonts = useMemo(
    () =>
      hebrewFonts.filter(
        (font) =>
          (category === 'all' || font.category === category) &&
          (!nikudOnly || font.nikud) &&
          matchesQuery(font, query),
      ),
    [category, nikudOnly, query],
  )

  useEffect(() => {
    const timeout = window.setTimeout(() => setCountText(describeCount(visibleFonts.length)), COUNT_ANNOUNCE_DELAY_MS)
    return () => window.clearTimeout(timeout)
  }, [visibleFonts.length])

  useEffect(() => () => window.clearTimeout(copiedTimer.current), [])

  const copyCode = async (key: string, code: string, label: string, event: CopyEvent) => {
    setAnnouncement('')
    try {
      await navigator.clipboard.writeText(code)
      setCopied(key)
      setAnnouncement(`הקוד של ${label} הועתק`)
      window.clearTimeout(copiedTimer.current)
      copiedTimer.current = window.setTimeout(() => setCopied(null), COPIED_RESET_MS)
      window.gtag?.('event', 'hebrew_font_copy', { ...event, format })
    } catch {
      setAnnouncement(COPY_FAILED)
    }
  }

  const weightFor = (font: HebrewFont) => weights[font.family] ?? defaultWeight(font)

  const resetFilters = () => {
    setQuery('')
    setCategory('all')
    setNikudOnly(false)
  }

  return (
    <section className={ui.tool} aria-label="תצוגה מקדימה של פונטים בעברית">
      <div className={styles.inner}>
        <form className={styles.controls} onSubmit={(event) => event.preventDefault()}>
          <fieldset className={`${ui.group} ${styles.topGroup}`}>
            <legend className={ui.legend}>הטקסט לתצוגה</legend>
            <div className={ui.field}>
              <label htmlFor={textId} className={ui.label}>
                טקסט
              </label>
              <p id={textHintId} className={ui.hint}>
                שם העסק, סלוגן או כותרת. בלי טקסט יוצגו האותיות והספרות.
              </p>
              <textarea
                id={textId}
                rows={2}
                maxLength={MAX_TEXT_LENGTH}
                className={`${ui.input} ${ui.textarea} ${styles.textInput}`}
                aria-describedby={textHintId}
                value={text}
                onChange={(event) => setText(event.target.value)}
              />
            </div>
            <div className={ui.field}>
              <div className={styles.sizeHead}>
                <label htmlFor={sizeId} className={ui.label}>
                  גודל
                </label>
                <output htmlFor={sizeId} className={styles.sizeValue}>
                  {size} פיקסלים
                </output>
              </div>
              <input
                id={sizeId}
                type="range"
                min={16}
                max={96}
                step={2}
                value={size}
                aria-valuetext={`${size} פיקסלים`}
                className={styles.range}
                onChange={(event) => setSize(Number(event.target.value))}
              />
            </div>
          </fieldset>

          <fieldset className={`${ui.group} ${styles.topGroup}`}>
            <legend className={ui.legend}>תצוגה וקוד</legend>
            <ChoiceTiles legend="מה מציגים" name={viewName} choices={viewChoices} value={view} onChange={setView} />
            <div className={styles.twoUp}>
              <ChoiceTiles
                legend="רקע"
                name={backdropName}
                choices={backdropChoices}
                value={backdrop}
                onChange={setBackdrop}
              />
              <ChoiceTiles
                legend="קוד להעתקה"
                name={formatName}
                choices={formatChoices}
                value={format}
                onChange={setFormat}
              />
            </div>
            <p className={ui.hint}>{formatHints[format]}</p>
          </fieldset>

          {view === 'grid' ? (
            <fieldset className={`${ui.group} ${styles.filters}`}>
              <legend className={ui.legend}>סינון</legend>
              <div className={styles.filterRow}>
                <div className={ui.field}>
                  <label htmlFor={searchId} className={ui.label}>
                    חיפוש לפי שם
                  </label>
                  <input
                    id={searchId}
                    type="search"
                    autoComplete="off"
                    spellCheck={false}
                    className={ui.input}
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                  />
                </div>
                <label className={`${ui.option} ${styles.nikud}`}>
                  <input
                    type="checkbox"
                    className={ui.checkbox}
                    checked={nikudOnly}
                    onChange={(event) => setNikudOnly(event.target.checked)}
                  />
                  <span>רק פונטים עם ניקוד</span>
                </label>
              </div>
              <ChoiceTiles
                legend="סגנון"
                name={categoryName}
                choices={categoryChoices}
                value={category}
                onChange={setCategory}
                className={styles.categories}
              />
            </fieldset>
          ) : null}
        </form>

        <div className={`${styles.results} ${backdrop === 'dark' ? styles.dark : ''}`}>
          {view === 'grid' ? (
            <>
              <div className={styles.resultsHead}>
                <h2 id={resultsHeadingId} className={styles.resultsTitle}>
                  הפונטים
                </h2>
                <p className={styles.count} role="status" aria-live="polite">
                  {countText}
                </p>
              </div>
              {visibleFonts.length ? (
                <ul className={styles.grid} aria-labelledby={resultsHeadingId}>
                  {visibleFonts.map((font) => {
                    const weight = weightFor(font)
                    return (
                      <FontCard
                        key={font.family}
                        font={font}
                        weight={weight}
                        text={previewText}
                        size={size}
                        copied={copied === font.family}
                        onWeightChange={(next) => setWeights((current) => ({ ...current, [font.family]: next }))}
                        onCopy={() =>
                          copyCode(font.family, singleFontCode(font, weight, format), font.family, {
                            font_family: font.family,
                            font_weight: String(weight),
                            mode: 'single',
                          })
                        }
                      />
                    )
                  })}
                </ul>
              ) : (
                <div className={styles.empty}>
                  <p>לא מצאנו פונט שמתאים לסינון.</p>
                  <button type="button" className={ui.secondary} onClick={resetFilters}>
                    ניקוי הסינון
                  </button>
                </div>
              )}
            </>
          ) : (
            <>
              <div className={styles.resultsHead}>
                <h2 className={styles.resultsTitle}>כותרת וטקסט יחד</h2>
              </div>
              <PairPreview
                pair={pair}
                text={previewText}
                size={size}
                format={format}
                copied={copied === 'pair'}
                onChange={setPair}
                onCopy={(code) =>
                  copyCode('pair', code, `${pair.heading.family} ו-${pair.body.family}`, {
                    font_family: `${pair.heading.family} + ${pair.body.family}`,
                    font_weight: `${pair.heading.weight} + ${pair.body.weight}`,
                    mode: 'pair',
                  })
                }
              />
            </>
          )}
          <p className={styles.srOnly} role="status" aria-live="polite">
            {announcement}
          </p>
          <p className={ui.note}>
            הטקסט שהקלדתם נשאר בדפדפן ולא נשלח לשום מקום. הפונטים עצמם נטענים מ-Google Fonts, רק כשהם מגיעים
            למסך.
          </p>
        </div>
      </div>
    </section>
  )
}
