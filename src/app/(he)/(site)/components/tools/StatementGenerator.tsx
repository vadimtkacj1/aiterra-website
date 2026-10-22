'use client'

import { useEffect, useId, useMemo, useRef, useState, type ChangeEvent, type ReactNode } from 'react'
import { Code, Copy, Download, Printer } from 'lucide-react'
import {
  assistiveOptions,
  browserOptions,
  buildStatement,
  defaultStatementInput,
  premisesMeasures,
  siteMeasures,
  statementChecks,
  statementDocument,
  statementToHtml,
  statementToText,
  type StatementBlock,
  type StatementInput,
  type StatementLanguage,
  type StatementOption,
} from '@/lib/accessibility-statement'
import ui from './toolUi.module.css'
import styles from './StatementGenerator.module.css'

type TextKey = {
  [K in keyof StatementInput]: StatementInput[K] extends string ? K : never
}[keyof StatementInput]

type ListKey = 'measures' | 'premisesMeasures' | 'browsers' | 'assistive'
type ToggleKey = 'hasPremises' | 'hasCoordinator' | 'hasExemption' | 'thirdParty' | 'credit'
type OutputAction = 'text' | 'html' | 'file' | 'print'

const STORAGE_KEY = 'aiterra-a11y-statement-v2'
const todayIso = () => new Date().toISOString().slice(0, 10)

function readDraft(): Partial<StatementInput> | null {
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY)
    return saved ? (JSON.parse(saved) as Partial<StatementInput>) : null
  } catch {
    return null
  }
}

function writeDraft(input: StatementInput) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(input))
    return true
  } catch {
    return false
  }
}

function Field({
  label,
  hint,
  children,
}: {
  label: string
  hint?: string
  children: (id: string, hintId?: string) => ReactNode
}) {
  const id = useId()
  const hintId = hint ? `${id}-hint` : undefined
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
      {children(id, hintId)}
    </div>
  )
}

function Section({ title, optional, children }: { title: string; optional?: boolean; children: ReactNode }) {
  if (optional) {
    return (
      <details className={`${ui.group} ${styles.optional}`}>
        <summary className={`${ui.legend} ${styles.optionalSummary}`}>
          <span>{title}</span>
          <span className={styles.optionalTag}>לא חובה</span>
        </summary>
        <fieldset className={styles.optionalBody} aria-label={title}>
          {children}
        </fieldset>
      </details>
    )
  }
  return (
    <fieldset className={ui.group}>
      <legend className={ui.legend}>{title}</legend>
      {children}
    </fieldset>
  )
}

function OptionGroup({
  legend,
  options,
  selected,
  onToggle,
}: {
  legend: string
  options: StatementOption[]
  selected: string[]
  onToggle: (id: string) => void
}) {
  return (
    <fieldset className={ui.group}>
      <legend className={ui.legend}>{legend}</legend>
      <div className={ui.options}>
        {options.map((option) => (
          <label key={option.id} className={ui.option}>
            <input
              type="checkbox"
              className={ui.checkbox}
              checked={selected.includes(option.id)}
              onChange={() => onToggle(option.id)}
            />
            <span>{option.label}</span>
          </label>
        ))}
      </div>
    </fieldset>
  )
}

function Toggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: () => void }) {
  return (
    <label className={ui.option}>
      <input type="checkbox" className={ui.checkbox} checked={checked} onChange={onChange} />
      <span>{label}</span>
    </label>
  )
}

function Preview({ blocks, language }: { blocks: StatementBlock[]; language: StatementLanguage }) {
  return (
    <div className={ui.document} dir={language === 'he' ? 'rtl' : 'ltr'} lang={language}>
      {blocks.map((block, index) => {
        if (block.kind === 'heading') {
          return index === 0 ? (
            <h3 key={index} className={ui.docTitle}>
              {block.text}
            </h3>
          ) : (
            <h4 key={index} className={ui.docHeading}>
              {block.text}
            </h4>
          )
        }
        if (block.kind === 'paragraph') return <p key={index}>{block.text}</p>
        if (block.kind === 'list') {
          return (
            <ul key={index}>
              {block.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          )
        }
        return (
          <p key={index} className={ui.docCredit}>
            {block.text} <a href={block.href}>{block.linkText}</a>
          </p>
        )
      })}
    </div>
  )
}

const stateLabel = { ok: 'קיים', missing: 'חסר', optional: 'לא נדרש' }

export default function StatementGenerator() {
  const [input, setInput] = useState<StatementInput>(() => defaultStatementInput(todayIso()))
  const [status, setStatus] = useState('')
  const [restored, setRestored] = useState(false)
  const previewRef = useRef<HTMLDivElement>(null)
  const blocks = useMemo(() => buildStatement(input), [input])
  const checks = useMemo(() => statementChecks(input), [input])
  const missing = checks.filter((check) => check.state === 'missing').length
  const required = checks.filter((check) => check.state !== 'optional')
  const done = required.filter((check) => check.state === 'ok').length
  const domain = input.siteUrl.trim().replace(/^https?:\/\//, '').replace(/\/.*$/, '') || 'your-site.co.il'

  useEffect(() => {
    const saved = readDraft()
    if (saved) setInput({ ...defaultStatementInput(todayIso()), ...saved })
    setRestored(true)
  }, [])

  useEffect(() => {
    if (restored) writeDraft(input)
  }, [input, restored])

  const setText = (key: TextKey) => (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setInput((current) => ({ ...current, [key]: event.target.value }))

  const setChoice = <K extends keyof StatementInput>(key: K, value: StatementInput[K]) => () =>
    setInput((current) => ({ ...current, [key]: value }))

  const toggle = (key: ToggleKey) => () => setInput((current) => ({ ...current, [key]: !current[key] }))

  const toggleOption = (key: ListKey) => (id: string) =>
    setInput((current) => ({
      ...current,
      [key]: current[key].includes(id) ? current[key].filter((item) => item !== id) : [...current[key], id],
    }))

  const track = (action: OutputAction) =>
    window.gtag?.('event', 'a11y_statement_copy', { format: action, language: input.language })

  const copy = async (format: 'text' | 'html') => {
    const value = format === 'html' ? statementToHtml(blocks, input.language) : statementToText(blocks)
    try {
      await navigator.clipboard.writeText(value)
      setStatus(format === 'html' ? 'קוד ה-HTML הועתק' : 'הטקסט הועתק')
      track(format)
    } catch {
      setStatus('ההעתקה נכשלה. סמנו את הטקסט בתצוגה המקדימה והעתיקו ידנית.')
    }
  }

  const download = () => {
    const url = URL.createObjectURL(
      new Blob([statementDocument(blocks, input.language)], { type: 'text/html;charset=utf-8' }),
    )
    const link = document.createElement('a')
    link.href = url
    link.download = 'accessibility-statement.html'
    link.click()
    URL.revokeObjectURL(url)
    setStatus('הקובץ ירד')
    track('file')
  }

  const print = () => {
    const frame = document.createElement('iframe')
    frame.setAttribute('aria-hidden', 'true')
    frame.style.position = 'fixed'
    frame.style.width = '0'
    frame.style.height = '0'
    frame.style.border = '0'
    document.body.appendChild(frame)
    const doc = frame.contentWindow?.document
    if (!doc || !frame.contentWindow) return
    doc.open()
    doc.write(statementDocument(blocks, input.language))
    doc.close()
    frame.contentWindow.focus()
    frame.contentWindow.print()
    window.setTimeout(() => frame.remove(), 1000)
    track('print')
  }

  const reset = () => {
    setInput(defaultStatementInput(todayIso()))
    setStatus('הטופס אופס')
  }

  const showPreview = () => {
    previewRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    previewRef.current?.focus({ preventScroll: true })
  }

  return (
    <section className={ui.tool} aria-label="מחולל הצהרת נגישות">
      <div className={ui.inner}>
        <form className={ui.form} onSubmit={(event) => event.preventDefault()}>
          <div className={styles.toolbar}>
            <fieldset className={styles.segment}>
              <legend className={styles.segmentLegend}>שפת ההצהרה</legend>
              <label className={styles.segmentOption}>
                <input
                  type="radio"
                  name="statement-language"
                  checked={input.language === 'he'}
                  onChange={setChoice('language', 'he')}
                />
                <span>עברית</span>
              </label>
              <label className={styles.segmentOption}>
                <input
                  type="radio"
                  name="statement-language"
                  checked={input.language === 'en'}
                  onChange={setChoice('language', 'en')}
                />
                <span>English</span>
              </label>
            </fieldset>
            <button type="button" className={styles.jump} onClick={showPreview}>
              לתצוגה המקדימה
            </button>
          </div>

          <Section title="העסק והאתר">
            <div className={styles.pair}>
              <Field label="שם העסק">
                {(id) => <input id={id} className={ui.input} value={input.orgName} onChange={setText('orgName')} />}
              </Field>
              <Field label="כתובת האתר">
                {(id) => (
                  <input
                    id={id}
                    className={`${ui.input} ${ui.ltr}`}
                    inputMode="url"
                    placeholder="www.example.co.il"
                    value={input.siteUrl}
                    onChange={setText('siteUrl')}
                  />
                )}
              </Field>
            </div>
          </Section>

          <Section title="רמת הנגישות">
            <div className={ui.options}>
              <label className={ui.option}>
                <input
                  type="radio"
                  name="statement-level"
                  className={ui.checkbox}
                  checked={input.level === 'full'}
                  onChange={setChoice('level', 'full')}
                />
                <span>האתר עומד בת״י 5568 ברמת AA</span>
              </label>
              <label className={ui.option}>
                <input
                  type="radio"
                  name="statement-level"
                  className={ui.checkbox}
                  checked={input.level === 'partial'}
                  onChange={setChoice('level', 'partial')}
                />
                <span>ההנגשה חלקית ועדיין בתהליך</span>
              </label>
            </div>
            <OptionGroup
              legend="מה בוצע באתר"
              options={siteMeasures}
              selected={input.measures}
              onToggle={toggleOption('measures')}
            />
          </Section>

          <Section title="בדיקה ותאימות" optional>
            <fieldset className={ui.group}>
              <legend className={ui.legend}>מי בדק את הנגישות</legend>
              <div className={ui.options}>
                {(
                  [
                    ['none', 'לא לציין'],
                    ['self', 'בדיקה שלנו'],
                    ['external', 'מומחה או חברה חיצונית'],
                  ] as const
                ).map(([value, label]) => (
                  <label key={value} className={ui.option}>
                    <input
                      type="radio"
                      name="statement-assessment"
                      className={ui.checkbox}
                      checked={input.assessment === value}
                      onChange={setChoice('assessment', value)}
                    />
                    <span>{label}</span>
                  </label>
                ))}
              </div>
            </fieldset>
            {input.assessment !== 'none' ? (
              <div className={styles.pair}>
                {input.assessment === 'external' ? (
                  <Field label="שם הבודק או החברה">
                    {(id) => (
                      <input id={id} className={ui.input} value={input.assessedBy} onChange={setText('assessedBy')} />
                    )}
                  </Field>
                ) : null}
                <Field label="תאריך הבדיקה">
                  {(id) => (
                    <input
                      id={id}
                      type="date"
                      className={`${ui.input} ${ui.date}`}
                      value={input.assessedOn}
                      onChange={setText('assessedOn')}
                    />
                  )}
                </Field>
              </div>
            ) : null}
            <OptionGroup
              legend="דפדפנים שבהם האתר נבדק"
              options={browserOptions}
              selected={input.browsers}
              onToggle={toggleOption('browsers')}
            />
            <OptionGroup
              legend="טכנולוגיות מסייעות שאיתן האתר נבדק"
              options={assistiveOptions}
              selected={input.assistive}
              onToggle={toggleOption('assistive')}
            />
          </Section>

          <Section title="חריגות ופטור" optional>
            <Field label="מה עדיין לא נגיש" hint="לא חובה. למשל: מסמכי PDF ישנים, סרטונים בלי כתוביות.">
              {(id, hintId) => (
                <textarea
                  id={id}
                  aria-describedby={hintId}
                  className={`${ui.input} ${ui.textarea}`}
                  value={input.gaps}
                  onChange={setText('gaps')}
                />
              )}
            </Field>
            <Field label="איך מקבלים את המידע בדרך אחרת" hint="לא חובה. אם תשאירו ריק, יופיע נוסח כללי.">
              {(id, hintId) => (
                <textarea
                  id={id}
                  aria-describedby={hintId}
                  className={`${ui.input} ${ui.textarea}`}
                  value={input.alternative}
                  onChange={setText('alternative')}
                />
              )}
            </Field>
            <Toggle
              label="להוסיף הסתייגות לגבי תכנים מצדדים שלישיים (סרטונים, מפות, טפסים חיצוניים)"
              checked={input.thirdParty}
              onChange={toggle('thirdParty')}
            />
            <Toggle
              label="קיבלנו פטור מהתאמה מסוימת (תקנה 35ו)"
              checked={input.hasExemption}
              onChange={toggle('hasExemption')}
            />
            {input.hasExemption ? (
              <>
                <Field label="ממה קיבלתם פטור">
                  {(id) => (
                    <textarea
                      id={id}
                      className={`${ui.input} ${ui.textarea}`}
                      value={input.exemption}
                      onChange={setText('exemption')}
                    />
                  )}
                </Field>
                <Field label="מה ההתאמה החלופית שאתם נותנים">
                  {(id) => (
                    <textarea
                      id={id}
                      className={`${ui.input} ${ui.textarea}`}
                      value={input.exemptionAlternative}
                      onChange={setText('exemptionAlternative')}
                    />
                  )}
                </Field>
              </>
            ) : null}
          </Section>

          <Section title="מקום קבלת קהל" optional>
            <Toggle
              label="לעסק יש מקום שלקוחות מגיעים אליו"
              checked={input.hasPremises}
              onChange={toggle('hasPremises')}
            />
            {input.hasPremises ? (
              <>
                <Field label="כתובת">
                  {(id) => (
                    <input
                      id={id}
                      className={ui.input}
                      value={input.premisesAddress}
                      onChange={setText('premisesAddress')}
                    />
                  )}
                </Field>
                <OptionGroup
                  legend="מה יש במקום"
                  options={premisesMeasures}
                  selected={input.premisesMeasures}
                  onToggle={toggleOption('premisesMeasures')}
                />
                <Field label="שירותי עזר לפי בקשה" hint="לא חובה. למשל: ליווי, הקראת מסמכים, טפסים בדפוס מוגדל.">
                  {(id, hintId) => (
                    <input
                      id={id}
                      aria-describedby={hintId}
                      className={ui.input}
                      value={input.premisesServices}
                      onChange={setText('premisesServices')}
                    />
                  )}
                </Field>
                <Field label="הערות נוספות" hint="לא חובה. למשל: הכניסה הנגישה מהחניון האחורי.">
                  {(id, hintId) => (
                    <textarea
                      id={id}
                      aria-describedby={hintId}
                      className={`${ui.input} ${ui.textarea}`}
                      value={input.premisesNotes}
                      onChange={setText('premisesNotes')}
                    />
                  )}
                </Field>
              </>
            ) : null}
          </Section>

          <Section title="רכז נגישות ופניות">
            <Toggle
              label="יש לנו רכז נגישות (חובה מ-25 עובדים)"
              checked={input.hasCoordinator}
              onChange={toggle('hasCoordinator')}
            />
            {input.hasCoordinator ? (
              <div className={ui.row}>
                <Field label="שם הרכז">
                  {(id) => (
                    <input
                      id={id}
                      className={ui.input}
                      value={input.coordinatorName}
                      onChange={setText('coordinatorName')}
                    />
                  )}
                </Field>
                <Field label="טלפון הרכז">
                  {(id) => (
                    <input
                      id={id}
                      type="tel"
                      className={`${ui.input} ${ui.ltr}`}
                      value={input.coordinatorPhone}
                      onChange={setText('coordinatorPhone')}
                    />
                  )}
                </Field>
                <Field label="דוא״ל הרכז">
                  {(id) => (
                    <input
                      id={id}
                      type="email"
                      className={`${ui.input} ${ui.ltr}`}
                      value={input.coordinatorEmail}
                      onChange={setText('coordinatorEmail')}
                    />
                  )}
                </Field>
              </div>
            ) : null}
            <div className={ui.row}>
              <Field label="איש קשר לפניות">
                {(id) => (
                  <input id={id} className={ui.input} value={input.contactName} onChange={setText('contactName')} />
                )}
              </Field>
              <Field label="טלפון לפניות">
                {(id) => (
                  <input
                    id={id}
                    type="tel"
                    className={`${ui.input} ${ui.ltr}`}
                    value={input.contactPhone}
                    onChange={setText('contactPhone')}
                  />
                )}
              </Field>
              <Field label="דוא״ל לפניות">
                {(id) => (
                  <input
                    id={id}
                    type="email"
                    className={`${ui.input} ${ui.ltr}`}
                    value={input.contactEmail}
                    onChange={setText('contactEmail')}
                  />
                )}
              </Field>
            </div>
            <div className={styles.pair}>
              <Field label="זמן מענה בימי עבודה" hint="לא חובה">
                {(id, hintId) => (
                  <input
                    id={id}
                    aria-describedby={hintId}
                    inputMode="numeric"
                    maxLength={2}
                    className={`${ui.input} ${styles.short}`}
                    value={input.responseDays}
                    onChange={setText('responseDays')}
                  />
                )}
              </Field>
              <Field label="תאריך עדכון ההצהרה">
                {(id) => (
                  <input
                    id={id}
                    type="date"
                    className={`${ui.input} ${ui.date}`}
                    value={input.updated}
                    onChange={setText('updated')}
                  />
                )}
              </Field>
            </div>
          </Section>

          <div className={styles.footerRow}>
            <Toggle
              label="להוסיף בסוף שורת קרדיט עם קישור למחולל"
              checked={input.credit}
              onChange={toggle('credit')}
            />
            <button type="button" className={styles.reset} onClick={reset}>
              איפוס הטופס
            </button>
          </div>
        </form>

        <div className={ui.output}>
          <div className={ui.sticky}>
            <h2 className={ui.outputTitle}>ההצהרה שלכם</h2>
            <details className={styles.checks}>
              <summary className={styles.checksSummary}>
                <span className={styles.checksTitle} data-missing={missing > 0}>
                  {missing
                    ? `חסרים ${missing === 1 ? 'פרט אחד' : `${missing} פרטים`} שהתקנות דורשות`
                    : 'כל מה שהתקנות דורשות נמצא בהצהרה'}
                </span>
                <span className={styles.meter} aria-hidden="true">
                  <span className={styles.meterFill} style={{ inlineSize: `${(done / required.length) * 100}%` }} />
                </span>
                <span className={styles.meterText}>
                  {done} מתוך {required.length}
                </span>
              </summary>
              <ul className={styles.checkList}>
                {checks.map((check) => (
                  <li key={check.id} className={styles.checkItem} data-state={check.state}>
                    <span className={styles.checkMark} aria-hidden="true">
                      {check.state === 'ok' ? '✓' : check.state === 'missing' ? '!' : '–'}
                    </span>
                    <span>
                      <span className={styles.checkLabel}>{check.label}</span>
                      <span className={styles.visuallyHidden}>: {stateLabel[check.state]}. </span>
                      <span className={styles.checkNote}>{check.note}</span>
                    </span>
                  </li>
                ))}
              </ul>
            </details>
            <div className={styles.frame}>
              <div className={styles.frameBar} aria-hidden="true">
                <span className={styles.frameDots}>
                  <span />
                  <span />
                  <span />
                </span>
                <span className={styles.frameUrl} dir="ltr">
                  {domain}/accessibility-statement
                </span>
              </div>
              <div
                ref={previewRef}
                className={`${ui.paper} ${styles.framePaper}`}
                role="region"
                aria-label="תצוגה מקדימה של ההצהרה"
                tabIndex={0}
              >
                <Preview blocks={blocks} language={input.language} />
              </div>
            </div>
            <div className={ui.actions}>
              <button type="button" className={`${ui.primary} ${styles.wide}`} onClick={() => copy('text')}>
                <Copy aria-hidden="true" />
                העתקת ההצהרה
              </button>
              <button type="button" className={ui.secondary} onClick={() => copy('html')}>
                <Code aria-hidden="true" />
                קוד HTML
              </button>
              <button type="button" className={ui.secondary} onClick={download}>
                <Download aria-hidden="true" />
                קובץ
              </button>
              <button type="button" className={ui.secondary} onClick={print}>
                <Printer aria-hidden="true" />
                הדפסה או PDF
              </button>
            </div>
            <p className={ui.status} role="status" aria-live="polite">
              {status}
            </p>
            <p className={ui.note}>
              הפרטים נשמרים רק בדפדפן שלכם ולא נשלחים לשום מקום. זה נוסח כללי ולא ייעוץ משפטי: בדקו שהוא מתאר את
              האתר שלכם נכון.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
