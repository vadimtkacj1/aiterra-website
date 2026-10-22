'use client'

import Link from 'next/link'
import { useEffect, useId, useMemo, useRef, useState, type ChangeEvent, type ReactNode } from 'react'
import { Code, Copy, Download, Printer } from 'lucide-react'
import {
  buildPolicy,
  collectOptions,
  defaultPrivacyInput,
  formSnippets,
  policyChecks,
  policyDocument,
  policyToHtml,
  policyToText,
  processorOptions,
  siteDomain,
  toolOptions,
  type FormSnippet,
  type PrivacyBlock,
  type PrivacyInline,
  type PrivacyInput,
  type PrivacyOption,
} from '@/lib/privacy-policy'
import ui from './toolUi.module.css'
import styles from './PrivacyPolicyGenerator.module.css'

type TextKey = {
  [K in keyof PrivacyInput]: PrivacyInput[K] extends string ? K : never
}[keyof PrivacyInput]

type ListKey = 'collects' | 'tools' | 'processors'
type ToggleKey = 'sensitive' | 'consentBanner' | 'abroad' | 'minors' | 'hasOfficer' | 'credit'
type OutputAction = 'text' | 'html' | 'file' | 'print' | FormSnippet['id']

const STORAGE_KEY = 'aiterra-privacy-policy-v1'
const PLACEHOLDER = /(\[[^\]]+\])/
const todayIso = () => new Date().toISOString().slice(0, 10)
const countPlaceholders = (text: string) => text.match(/\[[^\]]+\]/g)?.length ?? 0

function readDraft(): Partial<PrivacyInput> | null {
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY)
    return saved ? (JSON.parse(saved) as Partial<PrivacyInput>) : null
  } catch {
    return null
  }
}

function writeDraft(input: PrivacyInput) {
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
  hint?: ReactNode
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

function Section({
  title,
  optional,
  first,
  children,
}: {
  title: string
  optional?: boolean
  first?: boolean
  children: ReactNode
}) {
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
    <fieldset className={first ? `${ui.group} ${styles.first}` : ui.group}>
      <legend className={ui.legend}>{title}</legend>
      {children}
    </fieldset>
  )
}

function Options({
  options,
  selected,
  onToggle,
}: {
  options: PrivacyOption[]
  selected: string[]
  onToggle: (id: string) => void
}) {
  return (
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
  )
}

function Toggle({
  label,
  checked,
  onChange,
  describedBy,
}: {
  label: string
  checked: boolean
  onChange: () => void
  describedBy?: string
}) {
  return (
    <label className={ui.option}>
      <input
        type="checkbox"
        className={ui.checkbox}
        checked={checked}
        onChange={onChange}
        aria-describedby={describedBy}
      />
      <span>{label}</span>
    </label>
  )
}

function Marked({ text }: { text: string }) {
  return (
    <>
      {text.split(PLACEHOLDER).map((piece, index) =>
        PLACEHOLDER.test(piece) ? (
          <mark key={index} className={styles.placeholder}>
            {piece}
          </mark>
        ) : (
          piece
        ),
      )}
    </>
  )
}

function Inline({ parts }: { parts: PrivacyInline[] }) {
  return (
    <>
      {parts.map((part, index) =>
        typeof part === 'string' ? (
          <Marked key={index} text={part} />
        ) : (
          <a key={index} href={part.href} target="_blank" rel="noopener noreferrer">
            {part.text}
          </a>
        ),
      )}
    </>
  )
}

function Preview({ blocks }: { blocks: PrivacyBlock[] }) {
  return (
    <div className={ui.document} dir="rtl" lang="he">
      {blocks.map((block, index) => {
        if (block.kind === 'title') {
          return (
            <h3 key={index} className={ui.docTitle}>
              {block.text}
            </h3>
          )
        }
        if (block.kind === 'meta') {
          return (
            <p key={index} className={styles.meta}>
              <Marked text={block.text} />
            </p>
          )
        }
        if (block.kind === 'heading') {
          return (
            <h4 key={index} className={ui.docHeading}>
              {block.text}
            </h4>
          )
        }
        if (block.kind === 'clause') {
          return (
            <p key={index}>
              <span className={styles.clauseNo}>{block.number}</span> <Inline parts={block.parts} />
            </p>
          )
        }
        if (block.kind === 'list') {
          return (
            <ul key={index}>
              {block.items.map((item, itemIndex) => (
                <li key={itemIndex}>
                  <Inline parts={item} />
                </li>
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

export default function PrivacyPolicyGenerator() {
  const [input, setInput] = useState<PrivacyInput>(() => defaultPrivacyInput(todayIso()))
  const [status, setStatus] = useState('')
  const [snippetStatus, setSnippetStatus] = useState('')
  const [restored, setRestored] = useState(false)
  const previewRef = useRef<HTMLDivElement>(null)
  const sensitiveHintId = useId()
  const blocks = useMemo(() => buildPolicy(input), [input])
  const checks = useMemo(() => policyChecks(input), [input])
  const snippets = useMemo(() => formSnippets(input), [input])
  const missing = checks.filter((check) => check.state === 'missing').length
  const required = checks.filter((check) => check.state !== 'optional')
  const done = required.filter((check) => check.state === 'ok').length
  const orders = input.collects.includes('orders')
  const domain = siteDomain(input.siteUrl) || 'your-site.co.il'
  const processorChoices = orders ? processorOptions : processorOptions.filter((option) => option.id !== 'shipping')

  useEffect(() => {
    const saved = readDraft()
    if (saved) setInput({ ...defaultPrivacyInput(todayIso()), ...saved })
    setRestored(true)
  }, [])

  useEffect(() => {
    if (restored) writeDraft(input)
  }, [input, restored])

  const setText = (key: TextKey) => (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setInput((current) => ({ ...current, [key]: event.target.value }))

  const toggle = (key: ToggleKey) => () => setInput((current) => ({ ...current, [key]: !current[key] }))

  const toggleOption = (key: ListKey) => (id: string) =>
    setInput((current) => ({
      ...current,
      [key]: current[key].includes(id) ? current[key].filter((item) => item !== id) : [...current[key], id],
    }))

  const track = (action: OutputAction) =>
    window.gtag?.('event', 'privacy_policy_copy', {
      format: action,
      collects: input.collects.join(','),
      tools: input.tools.join(','),
    })

  const withPlaceholderNote = (message: string, text: string) => {
    const left = countPlaceholders(text)
    if (!left) return message
    return `${message}. שימו לב: ${left === 1 ? 'נשאר פרט אחד' : `נשארו ${left} פרטים`} בסוגריים מרובעים להשלמה.`
  }

  const copy = async (format: 'text' | 'html') => {
    const value = format === 'html' ? policyToHtml(blocks) : policyToText(blocks)
    try {
      await navigator.clipboard.writeText(value)
      setStatus(withPlaceholderNote(format === 'html' ? 'קוד ה-HTML הועתק' : 'הטקסט הועתק', value))
      track(format)
    } catch {
      setStatus('ההעתקה נכשלה. סמנו את הטקסט בתצוגה המקדימה והעתיקו ידנית.')
    }
  }

  const copySnippet = async (snippet: FormSnippet) => {
    try {
      await navigator.clipboard.writeText(snippet.text)
      setSnippetStatus(withPlaceholderNote(`הנוסח "${snippet.label}" הועתק`, snippet.text))
      track(snippet.id)
    } catch {
      setSnippetStatus('ההעתקה נכשלה. סמנו את הנוסח והעתיקו ידנית.')
    }
  }

  const download = () => {
    const url = URL.createObjectURL(new Blob([policyDocument(blocks)], { type: 'text/html;charset=utf-8' }))
    const link = document.createElement('a')
    link.href = url
    link.download = 'privacy-policy.html'
    link.click()
    URL.revokeObjectURL(url)
    setStatus(withPlaceholderNote('הקובץ ירד', policyToText(blocks)))
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
    doc.write(policyDocument(blocks))
    doc.close()
    frame.contentWindow.focus()
    frame.contentWindow.print()
    window.setTimeout(() => frame.remove(), 1000)
    track('print')
  }

  const reset = () => {
    setInput(defaultPrivacyInput(todayIso()))
    setStatus('הטופס אופס')
  }

  const showPreview = () => {
    previewRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    previewRef.current?.focus({ preventScroll: true })
  }

  return (
    <section className={ui.tool} aria-label="מחולל מדיניות פרטיות">
      <div className={ui.inner}>
        <form className={ui.form} onSubmit={(event) => event.preventDefault()}>
          <div className={styles.toolbar}>
            <button type="button" className={styles.jump} onClick={showPreview}>
              לתצוגה המקדימה
            </button>
          </div>

          <Section title="העסק והאתר" first>
            <div className={styles.pair}>
              <Field label="שם העסק">
                {(id) => (
                  <input
                    id={id}
                    className={ui.input}
                    autoComplete="organization"
                    value={input.businessName}
                    onChange={setText('businessName')}
                  />
                )}
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
              <Field label="דוא״ל לפניות בנושא פרטיות">
                {(id) => (
                  <input
                    id={id}
                    type="email"
                    className={`${ui.input} ${ui.ltr}`}
                    value={input.email}
                    onChange={setText('email')}
                  />
                )}
              </Field>
              <Field label="טלפון" hint="לא חובה">
                {(id, hintId) => (
                  <input
                    id={id}
                    type="tel"
                    aria-describedby={hintId}
                    className={`${ui.input} ${ui.ltr}`}
                    value={input.phone}
                    onChange={setText('phone')}
                  />
                )}
              </Field>
              <Field label="כתובת העסק" hint="לא חובה">
                {(id, hintId) => (
                  <input
                    id={id}
                    aria-describedby={hintId}
                    className={ui.input}
                    value={input.address}
                    onChange={setText('address')}
                  />
                )}
              </Field>
              <Field label="תאריך עדכון המדיניות">
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

          <Section title="מה האתר אוסף">
            <Options options={collectOptions} selected={input.collects} onToggle={toggleOption('collects')} />
            <Toggle
              label="האתר אוסף מידע רגיש, כמו מידע רפואי או פיננסי"
              checked={input.sensitive}
              onChange={toggle('sensitive')}
              describedBy={sensitiveHintId}
            />
            <p id={sensitiveHintId} className={ui.hint}>
              מידע בעל רגישות מיוחדת מוגדר בסעיף 3 לחוק. אם האתר אוסף מידע כזה, כדאי שעורך דין יעבור על המדיניות.
            </p>
            {input.sensitive ? (
              <Field label="איזה מידע רגיש" hint="למשל: מצב בריאותי שתמסרו לפני טיפול">
                {(id, hintId) => (
                  <input
                    id={id}
                    aria-describedby={hintId}
                    className={ui.input}
                    value={input.sensitiveInfo}
                    onChange={setText('sensitiveInfo')}
                  />
                )}
              </Field>
            ) : null}
          </Section>

          <Section title="כלי מדידה ופרסום באתר">
            <Options options={toolOptions} selected={input.tools} onToggle={toggleOption('tools')} />
            {input.tools.length ? (
              <Toggle
                label="יש באנר עוגיות, והכלים פועלים רק אחרי שהגולש מאשר"
                checked={input.consentBanner}
                onChange={toggle('consentBanner')}
              />
            ) : null}
          </Section>

          <Section title="ספקי שירות שמקבלים מידע">
            <Options options={processorChoices} selected={input.processors} onToggle={toggleOption('processors')} />
            <Field label="שמות הספקים" hint="לא חובה. למשל: Wix, Monday, Mailchimp">
              {(id, hintId) => (
                <input
                  id={id}
                  aria-describedby={hintId}
                  className={ui.input}
                  value={input.processorNames}
                  onChange={setText('processorNames')}
                />
              )}
            </Field>
            {orders ? (
              <Field label="חברת הסליקה" hint="למשל: Cardcom, Tranzila, PayPal">
                {(id, hintId) => (
                  <input
                    id={id}
                    aria-describedby={hintId}
                    className={ui.input}
                    value={input.paymentProvider}
                    onChange={setText('paymentProvider')}
                  />
                )}
              </Field>
            ) : null}
            <Toggle
              label="חלק מהספקים או מהכלים שומרים מידע מחוץ לישראל"
              checked={input.abroad}
              onChange={toggle('abroad')}
            />
          </Section>

          <Section title="שמירת מידע, קטינים וקישורים" optional>
            <Field label="כמה זמן שומרים פניות שלא הובילו לעסקה" hint="לא חובה. למשל: עד 24 חודשים">
              {(id, hintId) => (
                <input
                  id={id}
                  aria-describedby={hintId}
                  className={ui.input}
                  value={input.retention}
                  onChange={setText('retention')}
                />
              )}
            </Field>
            <Toggle
              label="האתר לא מיועד לקטינים (מתחת לגיל 18)"
              checked={input.minors}
              onChange={toggle('minors')}
            />
            <Field
              label="קישור לתקנון האתר"
              hint={
                <>
                  אין לכם עדיין?{' '}
                  <Link href="/tools/website-terms-generator" className={styles.hintLink}>
                    מחולל תקנון לאתר
                  </Link>
                </>
              }
            >
              {(id, hintId) => (
                <input
                  id={id}
                  aria-describedby={hintId}
                  inputMode="url"
                  className={`${ui.input} ${ui.ltr}`}
                  value={input.termsUrl}
                  onChange={setText('termsUrl')}
                />
              )}
            </Field>
          </Section>

          <Section title="ממונה על הגנת הפרטיות" optional>
            <Toggle
              label="מינינו ממונה על הגנת הפרטיות (חובה רק לגופים מסוימים)"
              checked={input.hasOfficer}
              onChange={toggle('hasOfficer')}
            />
            {input.hasOfficer ? (
              <div className={styles.pair}>
                <Field label="שם הממונה">
                  {(id) => (
                    <input id={id} className={ui.input} value={input.officerName} onChange={setText('officerName')} />
                  )}
                </Field>
                <Field label="דוא״ל הממונה">
                  {(id) => (
                    <input
                      id={id}
                      type="email"
                      className={`${ui.input} ${ui.ltr}`}
                      value={input.officerEmail}
                      onChange={setText('officerEmail')}
                    />
                  )}
                </Field>
              </div>
            ) : null}
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

        <div className={snippets.length ? `${ui.output} ${styles.outputAbove}` : ui.output}>
          <div className={ui.sticky}>
            <h2 className={ui.outputTitle}>מדיניות הפרטיות שלכם</h2>
            <details className={styles.checks}>
              <summary className={styles.checksSummary}>
                <span className={styles.checksTitle} data-missing={missing > 0}>
                  {missing
                    ? `חסרים ${missing === 1 ? 'פרט אחד' : `${missing} פרטים`} למדיניות מלאה`
                    : 'כל הפרטים הנדרשים נמצאים במדיניות'}
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
                  {domain}/privacy-policy
                </span>
              </div>
              <div
                ref={previewRef}
                className={`${ui.paper} ${styles.framePaper}`}
                role="region"
                aria-label="תצוגה מקדימה של מדיניות הפרטיות"
                tabIndex={0}
              >
                <Preview blocks={blocks} />
              </div>
            </div>
            <div className={ui.actions}>
              <button type="button" className={`${ui.primary} ${styles.wide}`} onClick={() => copy('text')}>
                <Copy aria-hidden="true" />
                העתקת המדיניות
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
              הפרטים נשמרים רק בדפדפן שלכם ולא נשלחים לשום מקום. זו תבנית כללית ולא ייעוץ משפטי. עסק עם מאגר מידע
              גדול או עם מידע רגיש צריך ליווי של עורך דין.
            </p>
          </div>
        </div>

        {snippets.length ? (
          <div className={styles.band}>
            <h2 className={styles.bandTitle}>נוסחים קצרים לטפסים</h2>
            <p className={styles.bandLede}>
              סעיף 11 לחוק דורש למסור את ההודעה כשמבקשים את המידע. לכן כדאי להציב ליד כל טופס נוסח קצר עם קישור
              למדיניות.
            </p>
            <div className={styles.snippets}>
              {snippets.map((snippet) => (
                <div key={snippet.id} className={styles.snippet}>
                  <h3 className={styles.snippetLabel}>{snippet.label}</h3>
                  <p className={styles.snippetHint}>{snippet.hint}</p>
                  <p className={styles.snippetText}>
                    <Marked text={snippet.text} />
                  </p>
                  <button
                    type="button"
                    className={`${ui.secondary} ${styles.snippetCopy}`}
                    onClick={() => copySnippet(snippet)}
                  >
                    <Copy aria-hidden="true" />
                    העתקת הנוסח
                  </button>
                </div>
              ))}
            </div>
            <p className={ui.status} role="status" aria-live="polite">
              {snippetStatus}
            </p>
          </div>
        ) : null}
      </div>
    </section>
  )
}
