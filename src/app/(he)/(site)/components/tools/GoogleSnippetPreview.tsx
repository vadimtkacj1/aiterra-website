'use client'

import { useEffect, useId, useMemo, useRef, useState, type ChangeEvent, type ComponentType, type ReactNode } from 'react'
import {
  CircleCheck,
  Code,
  Copy,
  Info,
  LetterText,
  Monitor,
  Scissors,
  Search,
  Smartphone,
  TriangleAlert,
} from 'lucide-react'
import {
  bandLabel,
  collapseSpaces,
  countCharacters,
  countWords,
  defaultSiteName,
  devices,
  displayUrl,
  emptySnippetInput,
  formatNumber,
  formatReadingTime,
  measureField,
  PREVIEW_FONT_FAMILY,
  READING_WORDS_PER_MINUTE,
  restoreSnippetInput,
  snippetFindings,
  snippetHtml,
  textStats,
  type Band,
  type Device,
  type FieldMeasure,
  type Measure,
  type SnippetInput,
} from '@/lib/google-snippet-preview'
import ui from './toolUi.module.css'
import styles from './GoogleSnippetPreview.module.css'

type Mode = 'snippet' | 'counter'
type Edited = 'title' | 'description' | 'text' | null
type CopyTarget = 'html' | 'title' | 'description'
type Draft = { mode: Mode; input: SnippetInput; text: string }
type Icon = ComponentType<{ className?: string; 'aria-hidden'?: boolean | 'true' }>

const STORAGE_KEY = 'aiterra-snippet-preview-v1'
const ANNOUNCE_DELAY = 1200

const modes: { value: Mode; label: string; icon: Icon }[] = [
  { value: 'snippet', label: 'כותרת ותיאור לגוגל', icon: Search },
  { value: 'counter', label: 'ספירת תווים ומילים', icon: LetterText },
]

const deviceOptions: { value: Device; icon: Icon }[] = [
  { value: 'desktop', icon: Monitor },
  { value: 'mobile', icon: Smartphone },
]

const deviceIn: Record<Device, string> = { desktop: 'במחשב', mobile: 'בטלפון' }

const bandIcons: Record<Band, Icon> = { fits: CircleCheck, close: TriangleAlert, cut: Scissors }

const copied: Record<CopyTarget, string> = {
  html: 'קוד ה-HTML הועתק',
  title: 'הכותרת הועתקה',
  description: 'התיאור הועתק',
}

const nothingToCopy: Record<CopyTarget, string> = {
  html: 'כתבו כותרת או תיאור כדי להעתיק את הקוד.',
  title: 'כתבו כותרת כדי להעתיק אותה.',
  description: 'כתבו תיאור כדי להעתיק אותו.',
}

const widthNote = [
  'גוגל לא מפרסמת מספר תווים קבוע: לפי גוגל, הכותרת והתיאור נחתכים לפי הצורך, בדרך כלל כדי להתאים לרוחב המסך.',
  'לכן אנחנו מודדים את הטקסט בפיקסלים בגופן Arial ומשווים לרוחב משוער שבחרנו:',
  `כ-${devices.desktop.title.budget} פיקסלים לכותרת וכ-${devices.desktop.description.budget} לתיאור במחשב,`,
  `וכ-${devices.mobile.title.budget} וכ-${devices.mobile.description.budget} בטלפון.`,
  'אלה קירובים שלנו ולא כלל של גוגל. הכול נעשה בדפדפן שלכם, והטקסט לא נשלח לשום מקום.',
].join(' ')

const plural = (count: number, one: string, many: string) => (count === 1 ? one : `${formatNumber(count)} ${many}`)

const characterCount = (count: number) => plural(count, 'תו אחד', 'תווים')
const wordCount = (count: number) => plural(count, 'מילה אחת', 'מילים')

function readDraft(): Partial<Draft> | null {
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY)
    return saved ? (JSON.parse(saved) as Partial<Draft>) : null
  } catch {
    return null
  }
}

function writeDraft(draft: Draft) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(draft))
    return true
  } catch {
    return false
  }
}

function createMeasure(): Measure | null {
  const context = document.createElement('canvas').getContext('2d')
  if (!context) return null
  return (text: string, font: string) => {
    context.font = font
    return context.measureText(text).width
  }
}

function Field({
  label,
  hint,
  counter,
  children,
}: {
  label: string
  hint?: string
  counter?: (id: string) => ReactNode
  children: (id: string, describedBy: string | undefined) => ReactNode
}) {
  const id = useId()
  const hintId = `${id}-hint`
  const counterId = `${id}-counter`
  const describedBy = [hint ? hintId : '', counter ? counterId : ''].filter(Boolean).join(' ') || undefined
  return (
    <div className={ui.field}>
      <label htmlFor={id} className={ui.label}>
        {label}
      </label>
      {hint ? (
        <p id={hintId} className={ui.hint}>
          {hint}
        </p>
      ) : null}
      {children(id, describedBy)}
      {counter ? counter(counterId) : null}
    </div>
  )
}

function FieldCounter({
  id,
  text,
  measured,
  device,
}: {
  id: string
  text: string
  measured: FieldMeasure | null
  device: Device
}) {
  const clean = collapseSpaces(text)
  const BandIcon = measured ? bandIcons[measured.band] : null
  const ratio = measured ? Math.min(1, measured.width / measured.budget) : 0
  return (
    <div id={id} className={styles.counter} data-band={measured?.band ?? 'empty'}>
      <div className={styles.counterRow}>
        <p className={styles.counts}>
          {characterCount(countCharacters(clean))}, {wordCount(countWords(clean))}
        </p>
        {measured && BandIcon ? (
          <p className={styles.band}>
            <BandIcon aria-hidden="true" />
            {bandLabel[measured.band]}
          </p>
        ) : null}
      </div>
      <span className={styles.bar} aria-hidden="true">
        <span className={styles.barFill} style={{ inlineSize: `${ratio * 100}%` }} />
      </span>
      {measured ? (
        <p className={styles.counts}>
          רוחב: {formatNumber(measured.width)} מתוך כ-{formatNumber(measured.budget)} פיקסלים {deviceIn[device]}
        </p>
      ) : null}
    </div>
  )
}

function SegmentOption({
  name,
  checked,
  onChange,
  icon: OptionIcon,
  label,
}: {
  name: string
  checked: boolean
  onChange: () => void
  icon: Icon
  label: string
}) {
  return (
    <label className={styles.segmentOption}>
      <input type="radio" name={name} checked={checked} onChange={onChange} />
      <span>
        <OptionIcon aria-hidden="true" />
        {label}
      </span>
    </label>
  )
}

export default function GoogleSnippetPreview() {
  const [mode, setMode] = useState<Mode>('snippet')
  const [device, setDevice] = useState<Device>('desktop')
  const [input, setInput] = useState<SnippetInput>(emptySnippetInput)
  const [text, setText] = useState('')
  const [measure, setMeasure] = useState<Measure | null>(null)
  const [restored, setRestored] = useState(false)
  const [status, setStatus] = useState('')
  const [edited, setEdited] = useState<Edited>(null)
  const [announcement, setAnnouncement] = useState('')
  const [available, setAvailable] = useState(0)
  const stageRef = useRef<HTMLDivElement>(null)
  const modeName = useId()
  const deviceName = useId()

  const spec = devices[device]

  useEffect(() => {
    setMeasure(() => createMeasure())
    if (window.matchMedia('(max-width: 640px)').matches) setDevice('mobile')
    const saved = readDraft()
    if (saved) {
      if (saved.mode === 'snippet' || saved.mode === 'counter') setMode(saved.mode)
      setInput(restoreSnippetInput(saved.input))
      if (typeof saved.text === 'string') setText(saved.text)
    }
    setRestored(true)
  }, [])

  useEffect(() => {
    if (restored) writeDraft({ mode, input, text })
  }, [mode, input, text, restored])

  useEffect(() => {
    const node = stageRef.current
    if (!node || typeof ResizeObserver === 'undefined') return
    const observer = new ResizeObserver((entries) => setAvailable(entries[0].contentRect.width))
    observer.observe(node)
    return () => observer.disconnect()
  }, [mode])

  const titleMeasure = useMemo(
    () => (measure ? measureField(input.title, 'title', device, measure) : null),
    [measure, input.title, device],
  )
  const descriptionMeasure = useMemo(
    () => (measure ? measureField(input.description, 'description', device, measure) : null),
    [measure, input.description, device],
  )
  const findings = useMemo(
    () => snippetFindings(input, titleMeasure, descriptionMeasure),
    [input, titleMeasure, descriptionMeasure],
  )
  const stats = useMemo(() => textStats(text), [text])
  const url = useMemo(() => displayUrl(input.url), [input.url])

  const liveSummary = useMemo(() => {
    if (edited === 'text') {
      return text.trim() ? `${characterCount(stats.characters)}, ${wordCount(stats.words)}` : ''
    }
    if (edited === 'title' && titleMeasure) {
      return `כותרת: ${characterCount(countCharacters(collapseSpaces(input.title)))}, ${bandLabel[titleMeasure.band]}`
    }
    if (edited === 'description' && descriptionMeasure) {
      return `תיאור: ${characterCount(countCharacters(collapseSpaces(input.description)))}, ${bandLabel[descriptionMeasure.band]}`
    }
    return ''
  }, [edited, text, stats, input.title, input.description, titleMeasure, descriptionMeasure])

  useEffect(() => {
    if (!liveSummary) return
    const timer = window.setTimeout(() => setAnnouncement(liveSummary), ANNOUNCE_DELAY)
    return () => window.clearTimeout(timer)
  }, [liveSummary])

  const setField = (key: keyof SnippetInput) => (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const value = event.target.value
    setInput((current) => ({ ...current, [key]: value }))
    if (key === 'title' || key === 'description') setEdited(key)
    setStatus('')
  }

  const onText = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setText(event.target.value)
    setEdited('text')
  }

  const chooseMode = (next: Mode) => {
    setMode(next)
    setEdited(null)
    setStatus('')
  }

  const copy = async (target: CopyTarget) => {
    const value = target === 'html' ? snippetHtml(input) : collapseSpaces(input[target])
    if (!value) {
      setStatus(nothingToCopy[target])
      return
    }
    try {
      await navigator.clipboard.writeText(value)
      setStatus(copied[target])
      window.gtag?.('event', 'serp_preview_copy', {
        target,
        device,
        title_band: titleMeasure?.band ?? 'empty',
        description_band: descriptionMeasure?.band ?? 'empty',
        has_keyword: Boolean(input.keyword.trim()),
      })
    } catch {
      setStatus('ההעתקה נכשלה. סמנו את הטקסט בשדה והעתיקו ידנית.')
    }
  }

  const reset = () => {
    if (mode === 'snippet') setInput(emptySnippetInput)
    else setText('')
    setEdited(null)
    setStatus('')
    setAnnouncement(mode === 'snippet' ? 'השדות נוקו' : 'הטקסט נמחק')
  }

  const siteName = collapseSpaces(input.siteName) || (url ? defaultSiteName(url.host) : '')
  const siteInitial = Array.from(siteName || 'א')[0].toUpperCase()
  const zoom = available ? Math.min(1, available / spec.width) : 1
  const hasSnippet = Boolean(collapseSpaces(input.title) || collapseSpaces(input.description))
  const titleShown = titleMeasure?.display ?? collapseSpaces(input.title)
  const descriptionShown = descriptionMeasure?.display ?? collapseSpaces(input.description)

  const statRows: { term: string; value: string }[] = [
    { term: 'תווים', value: formatNumber(stats.characters) },
    { term: 'תווים בלי רווחים', value: formatNumber(stats.charactersNoSpaces) },
    { term: 'מילים', value: formatNumber(stats.words) },
    { term: 'משפטים', value: formatNumber(stats.sentences) },
    { term: 'פסקאות', value: formatNumber(stats.paragraphs) },
    { term: 'זמן קריאה משוער', value: formatReadingTime(stats.readingMinutes) },
  ]

  return (
    <section className={ui.tool} aria-label="בדיקת כותרת ותיאור לגוגל">
      <div className={`${ui.inner} ${styles.inner}`}>
        <form className={ui.form} onSubmit={(event) => event.preventDefault()}>
          <fieldset className={ui.group}>
            <legend className={ui.legend}>מה בודקים</legend>
            <div className={styles.modes}>
              {modes.map(({ value, label, icon: ModeIcon }) => (
                <label key={value} className={styles.mode}>
                  <input
                    type="radio"
                    name={modeName}
                    className={styles.modeInput}
                    checked={mode === value}
                    onChange={() => chooseMode(value)}
                  />
                  <ModeIcon className={styles.modeIcon} aria-hidden="true" />
                  <span>{label}</span>
                </label>
              ))}
            </div>
          </fieldset>

          {mode === 'snippet' ? (
            <>
              <fieldset className={ui.group}>
                <legend className={ui.legend}>הכותרת והתיאור</legend>
                <Field
                  label="כותרת העמוד (title)"
                  counter={(id) => (
                    <FieldCounter id={id} text={input.title} measured={titleMeasure} device={device} />
                  )}
                >
                  {(id, describedBy) => (
                    <input
                      id={id}
                      className={ui.input}
                      aria-describedby={describedBy}
                      autoComplete="off"
                      value={input.title}
                      onChange={setField('title')}
                    />
                  )}
                </Field>
                <Field
                  label="תיאור (meta description)"
                  counter={(id) => (
                    <FieldCounter id={id} text={input.description} measured={descriptionMeasure} device={device} />
                  )}
                >
                  {(id, describedBy) => (
                    <textarea
                      id={id}
                      className={`${ui.input} ${ui.textarea} ${styles.description}`}
                      aria-describedby={describedBy}
                      value={input.description}
                      onChange={setField('description')}
                    />
                  )}
                </Field>
              </fieldset>

              <fieldset className={ui.group}>
                <legend className={ui.legend}>הכתובת ושם האתר</legend>
                <Field label="כתובת העמוד">
                  {(id, describedBy) => (
                    <input
                      id={id}
                      className={`${ui.input} ${ui.ltr}`}
                      aria-describedby={describedBy}
                      inputMode="url"
                      autoCapitalize="off"
                      autoCorrect="off"
                      spellCheck={false}
                      placeholder="www.example.co.il/services"
                      value={input.url}
                      onChange={setField('url')}
                    />
                  )}
                </Field>
                <Field label="שם האתר" hint="לא חובה. אם תשאירו ריק, יוצג שם הדומיין.">
                  {(id, describedBy) => (
                    <input
                      id={id}
                      className={ui.input}
                      aria-describedby={describedBy}
                      autoComplete="off"
                      value={input.siteName}
                      onChange={setField('siteName')}
                    />
                  )}
                </Field>
              </fieldset>

              <fieldset className={ui.group}>
                <legend className={ui.legend}>מה אנשים מחפשים</legend>
                <Field
                  label="מילת המפתח הראשית"
                  hint="לא חובה. למשל: קידום אתרים בחיפה. נבדוק שהיא מופיעה בכותרת, קרוב להתחלה, וגם בתיאור."
                >
                  {(id, describedBy) => (
                    <input
                      id={id}
                      className={ui.input}
                      aria-describedby={describedBy}
                      autoComplete="off"
                      value={input.keyword}
                      onChange={setField('keyword')}
                    />
                  )}
                </Field>
              </fieldset>
            </>
          ) : (
            <fieldset className={ui.group}>
              <legend className={ui.legend}>הטקסט</legend>
              <Field label="כתבו או הדביקו טקסט">
                {(id, describedBy) => (
                  <textarea
                    id={id}
                    className={`${ui.input} ${ui.textarea} ${styles.longText}`}
                    aria-describedby={describedBy}
                    value={text}
                    onChange={onText}
                  />
                )}
              </Field>
            </fieldset>
          )}

          <div className={styles.footerRow}>
            <button type="button" className={styles.reset} onClick={reset}>
              {mode === 'snippet' ? 'ניקוי השדות' : 'מחיקת הטקסט'}
            </button>
          </div>
        </form>

        <div className={ui.output}>
          <div className={ui.sticky}>
            {mode === 'snippet' ? (
              <>
                <div className={styles.outputHead}>
                  <h2 className={`${ui.outputTitle} ${styles.headTitle}`}>התוצאה בגוגל</h2>
                  <fieldset className={styles.segment}>
                    <legend className={styles.segmentLegend}>תצוגה</legend>
                    {deviceOptions.map((option) => (
                      <SegmentOption
                        key={option.value}
                        name={deviceName}
                        checked={device === option.value}
                        onChange={() => setDevice(option.value)}
                        icon={option.icon}
                        label={devices[option.value].label}
                      />
                    ))}
                  </fieldset>
                </div>

                <div ref={stageRef} className={styles.stage} role="group" aria-label="תצוגה מקדימה של התוצאה">
                  <div
                    className={styles.result}
                    dir="rtl"
                    lang="he"
                    style={{ width: spec.width, zoom, fontFamily: PREVIEW_FONT_FAMILY }}
                  >
                    <div className={styles.source}>
                      <span className={styles.favicon} aria-hidden="true">
                        {siteInitial}
                      </span>
                      <span className={styles.sourceText}>
                        <span className={siteName ? styles.siteName : `${styles.siteName} ${styles.placeholder}`}>
                          {siteName || 'שם האתר'}
                        </span>
                        <span className={styles.url} dir={url?.dir ?? 'ltr'}>
                          {url ? url.line : 'https://www.example.co.il'}
                        </span>
                      </span>
                    </div>
                    <p
                      className={titleShown ? styles.resultTitle : `${styles.resultTitle} ${styles.placeholder}`}
                      data-device={device}
                      style={{ fontSize: spec.title.size, lineHeight: `${spec.title.lineHeight}px` }}
                    >
                      {titleShown || 'כאן תופיע הכותרת'}
                    </p>
                    <p
                      className={
                        descriptionShown ? styles.resultDescription : `${styles.resultDescription} ${styles.placeholder}`
                      }
                      style={{ fontSize: spec.description.size, lineHeight: `${spec.description.lineHeight}px` }}
                    >
                      {descriptionShown || 'כאן יופיע התיאור. בלי תיאור, גוגל תיקח קטע מהטקסט שבעמוד.'}
                    </p>
                  </div>
                </div>

                {hasSnippet ? (
                  <div className={styles.findingsBlock}>
                    <h3 className={styles.findingsTitle}>מה כדאי לבדוק</h3>
                    {findings.length ? (
                      <ul className={styles.findings}>
                        {findings.map((finding) => {
                          const FindingIcon = finding.level === 'warn' ? TriangleAlert : Info
                          return (
                            <li key={finding.id} className={styles.finding} data-level={finding.level}>
                              <FindingIcon className={styles.findingIcon} aria-hidden="true" />
                              <span>
                                <span className={styles.srOnly}>
                                  {finding.level === 'warn' ? 'כדאי לתקן: ' : 'הערה: '}
                                </span>
                                {finding.text}
                              </span>
                            </li>
                          )
                        })}
                      </ul>
                    ) : (
                      <p className={styles.allGood}>
                        <CircleCheck className={styles.findingIcon} aria-hidden="true" />
                        לא מצאנו מה לתקן בכותרת ובתיאור.
                      </p>
                    )}
                  </div>
                ) : null}

                <div className={ui.actions}>
                  <button type="button" className={`${ui.primary} ${styles.wide}`} onClick={() => copy('html')}>
                    <Code aria-hidden="true" />
                    העתקת קוד ה-HTML
                  </button>
                  <button type="button" className={ui.secondary} onClick={() => copy('title')}>
                    <Copy aria-hidden="true" />
                    העתקת הכותרת
                  </button>
                  <button type="button" className={ui.secondary} onClick={() => copy('description')}>
                    <Copy aria-hidden="true" />
                    העתקת התיאור
                  </button>
                </div>
                <p className={ui.status} role="status" aria-live="polite">
                  {status}
                </p>
                <p className={ui.note}>{widthNote}</p>
              </>
            ) : (
              <>
                <h2 className={ui.outputTitle}>הספירה</h2>
                <dl className={styles.stats}>
                  {statRows.map((row) => (
                    <div key={row.term} className={styles.stat}>
                      <dt className={styles.statTerm}>{row.term}</dt>
                      <dd className={styles.statValue}>{row.value}</dd>
                    </div>
                  ))}
                </dl>
                <p className={ui.note}>
                  מילה היא כל רצף שיש בו אות או ספרה, בין רווחים. פסקה היא כל שורה שיש בה טקסט. זמן הקריאה הוא הערכה
                  לפי קצב של {READING_WORDS_PER_MINUTE} מילים בדקה, והקצב בפועל משתנה מאדם לאדם. הטקסט נשאר בדפדפן
                  שלכם ולא נשלח לשום מקום.
                </p>
              </>
            )}
            <p className={styles.srOnly} role="status" aria-live="polite">
              {announcement}
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
