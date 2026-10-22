'use client'

import Link from 'next/link'
import { Fragment, useEffect, useId, useMemo, useRef, useState, type ChangeEvent, type ReactNode } from 'react'
import { Copy, Printer, Send } from 'lucide-react'
import {
  MAX_TONE,
  brandStatusOptions,
  briefChecks,
  briefDocument,
  briefToHtml,
  briefToText,
  briefTypes,
  budgetOptions,
  buildBrief,
  channelOptions,
  defaultBriefInput,
  hasMediaBudget,
  kpiWarning,
  languageOptions,
  mediaBudgetOptions,
  messageWarning,
  restoreBriefInput,
  toneOptions,
  typeInfo,
  type BriefBlock,
  type BriefChoice,
  type BriefInput,
  type BriefOption,
  type CriticalField,
} from '@/lib/creative-brief'
import ui from './toolUi.module.css'
import styles from './CreativeBriefGenerator.module.css'

type TextKey = {
  [K in keyof BriefInput]: BriefInput[K] extends string ? K : never
}[keyof BriefInput]

type ListKey = 'tone' | 'channels' | 'deliverables' | 'languages'

const STORAGE_KEY = 'aiterra-creative-brief-v1'
const PLACEHOLDER = /(\[[^\]]+\])/
const FIELD_IDS: Record<CriticalField, string> = {
  goal: 'brief-goal',
  kpi: 'brief-kpi',
  audience: 'brief-audience',
  message: 'brief-message',
  deadline: 'brief-deadline',
}

const todayIso = () => {
  const now = new Date()
  const pad = (value: number) => String(value).padStart(2, '0')
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`
}

const countPlaceholders = (text: string) => text.match(/\[[^\]]+\]/g)?.length ?? 0

function readDraft(): unknown {
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY)
    return saved ? JSON.parse(saved) : null
  } catch {
    return null
  }
}

function writeDraft(input: BriefInput) {
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
  warning,
  id: fixedId,
  children,
}: {
  label: ReactNode
  hint?: ReactNode
  warning?: string
  id?: string
  children: (id: string, describedBy?: string) => ReactNode
}) {
  const autoId = useId()
  const id = fixedId ?? autoId
  const hintId = hint ? `${id}-hint` : undefined
  const warningId = warning ? `${id}-warning` : undefined
  const describedBy = [hintId, warningId].filter(Boolean).join(' ') || undefined
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
      {warning ? (
        <p id={warningId} className={styles.warning}>
          {warning}
        </p>
      ) : null}
    </div>
  )
}

function Section({ title, first, children }: { title: string; first?: boolean; children: ReactNode }) {
  return (
    <fieldset className={first ? `${ui.group} ${styles.first}` : ui.group}>
      <legend className={ui.legend}>{title}</legend>
      {children}
    </fieldset>
  )
}

function Choice<T extends string>({
  legend,
  options,
  value,
  onChange,
}: {
  legend: string
  options: BriefChoice<T>[]
  value: T | ''
  onChange: (value: T) => void
}) {
  const name = useId()
  return (
    <fieldset className={ui.group}>
      <legend className={ui.legend}>{legend}</legend>
      <div className={ui.options}>
        {options.map((option) => (
          <label key={option.id} className={ui.option}>
            <input
              type="radio"
              name={name}
              className={ui.checkbox}
              checked={value === option.id}
              onChange={() => onChange(option.id)}
            />
            <span>{option.label}</span>
          </label>
        ))}
      </div>
    </fieldset>
  )
}

function CheckGroup({
  legend,
  hint,
  options,
  selected,
  onToggle,
  max,
  compact = false,
}: {
  legend: string
  hint?: ReactNode
  options: BriefOption[]
  selected: string[]
  onToggle: (id: string) => void
  max?: number
  compact?: boolean
}) {
  const hintId = useId()
  const full = max !== undefined && options.filter((option) => selected.includes(option.id)).length >= max
  return (
    <fieldset className={ui.group} aria-describedby={hint ? hintId : undefined}>
      <legend className={ui.legend}>{legend}</legend>
      {hint ? (
        <p id={hintId} className={ui.hint}>
          {hint}
        </p>
      ) : null}
      <div className={compact ? `${ui.options} ${styles.compact}` : ui.options}>
        {options.map((option) => {
          const checked = selected.includes(option.id)
          return (
            <label key={option.id} className={`${ui.option} ${styles.check}`}>
              <input
                type="checkbox"
                className={ui.checkbox}
                checked={checked}
                disabled={full && !checked}
                onChange={() => onToggle(option.id)}
              />
              <span>{option.label}</span>
            </label>
          )
        })}
      </div>
    </fieldset>
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

function Preview({ blocks }: { blocks: BriefBlock[] }) {
  return (
    <div className={`${ui.document} ${styles.document}`} dir="rtl" lang="he">
      {blocks.map((block, index) => {
        if (block.kind === 'title') {
          return (
            <h3 key={index} className={ui.docTitle}>
              <Marked text={block.text} />
            </h3>
          )
        }
        if (block.kind === 'meta') {
          return (
            <p key={index} className={styles.meta}>
              {block.items.map((entry, entryIndex) => (
                <Fragment key={entry}>
                  {entryIndex ? ' · ' : ''}
                  <span className={styles.metaItem}>
                    <Marked text={entry} />
                  </span>
                </Fragment>
              ))}
            </p>
          )
        }
        if (block.kind === 'intro') {
          return (
            <p key={index} className={styles.intro}>
              {block.text}
            </p>
          )
        }
        if (block.kind === 'heading') {
          return (
            <h4 key={index} className={`${ui.docHeading} ${styles.docHeading}`}>
              {block.text}
            </h4>
          )
        }
        if (block.kind === 'field') {
          return (
            <p key={index}>
              <strong className={styles.fieldLabel}>{block.label}:</strong> <Marked text={block.text} />
            </p>
          )
        }
        if (block.kind === 'list') {
          return (
            <Fragment key={index}>
              <p className={styles.listLabel}>
                <strong className={styles.fieldLabel}>{block.label}:</strong>
              </p>
              <ul>
                {block.items.map((entry, entryIndex) => (
                  <li key={entryIndex}>{entry}</li>
                ))}
              </ul>
            </Fragment>
          )
        }
        if (block.kind === 'text') {
          return (
            <p key={index}>
              <Marked text={block.text} />
            </p>
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

export default function CreativeBriefGenerator() {
  const [input, setInput] = useState<BriefInput>(() => defaultBriefInput(''))
  const [status, setStatus] = useState('')
  const [restored, setRestored] = useState(false)
  const previewRef = useRef<HTMLDivElement>(null)
  const outputRef = useRef<HTMLDivElement>(null)
  const typeName = useId()
  const blocks = useMemo(() => buildBrief(input), [input])
  const checks = useMemo(() => briefChecks(input), [input])
  const missing = checks.filter((check) => !check.done)
  const done = checks.length - missing.length
  const info = typeInfo(input.type)

  useEffect(() => {
    const saved = readDraft()
    setInput(saved ? restoreBriefInput(saved, todayIso()) : defaultBriefInput(todayIso()))
    setRestored(true)
  }, [])

  useEffect(() => {
    if (restored) writeDraft(input)
  }, [input, restored])

  const set = <K extends keyof BriefInput>(key: K, value: BriefInput[K]) =>
    setInput((current) => ({ ...current, [key]: value }))

  const setText = (key: TextKey) => (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setInput((current) => ({ ...current, [key]: event.target.value }))

  const toggleOption = (key: ListKey) => (id: string) =>
    setInput((current) => ({
      ...current,
      [key]: current[key].includes(id) ? current[key].filter((entry) => entry !== id) : [...current[key], id],
    }))

  const focusField = (field: CriticalField) => {
    const element = document.getElementById(FIELD_IDS[field])
    if (!element) return
    element.scrollIntoView({ behavior: 'smooth', block: 'center' })
    element.focus({ preventScroll: true })
  }

  const briefText = () => briefToText(blocks)

  const track = (event: 'brief_copy' | 'brief_print' | 'brief_send_click') =>
    window.gtag?.('event', event, { brief_type: input.type, completed: done })

  const withPlaceholderNote = (message: string) => {
    const left = countPlaceholders(briefText())
    if (!left) return message
    return `${message}. שימו לב: ${left === 1 ? 'נשאר פרט אחד' : `נשארו ${left} פרטים`} בסוגריים מרובעים להשלמה.`
  }

  const copy = async () => {
    const text = briefText()
    try {
      if (typeof ClipboardItem !== 'undefined' && navigator.clipboard.write) {
        try {
          await navigator.clipboard.write([
            new ClipboardItem({
              'text/plain': new Blob([text], { type: 'text/plain' }),
              'text/html': new Blob([briefToHtml(blocks)], { type: 'text/html' }),
            }),
          ])
        } catch {
          await navigator.clipboard.writeText(text)
        }
      } else {
        await navigator.clipboard.writeText(text)
      }
      setStatus(withPlaceholderNote('הבריף הועתק, ואפשר להדביק אותו ב-Word, ב-Google Docs, במייל או בוואטסאפ'))
      track('brief_copy')
    } catch {
      setStatus('ההעתקה נכשלה. סמנו את הטקסט בתצוגה המקדימה והעתיקו ידנית.')
    }
  }

  const documentTitle = `בריף: ${input.businessName.trim() || 'טיוטה'}`

  const print = () => {
    const frame = document.createElement('iframe')
    frame.setAttribute('aria-hidden', 'true')
    frame.setAttribute('tabindex', '-1')
    frame.style.position = 'fixed'
    frame.style.width = '0'
    frame.style.height = '0'
    frame.style.border = '0'
    document.body.appendChild(frame)
    const doc = frame.contentWindow?.document
    if (!doc || !frame.contentWindow) return
    doc.open()
    doc.write(briefDocument(blocks, documentTitle))
    doc.close()
    frame.contentWindow.focus()
    frame.contentWindow.print()
    window.setTimeout(() => frame.remove(), 1000)
    setStatus(withPlaceholderNote('חלון ההדפסה נפתח. לשמירה כ-PDF בחרו "שמירה כ-PDF" במדפסת'))
    track('brief_print')
  }

  const sendToUs = () => {
    navigator.clipboard?.writeText(briefText()).catch(() => undefined)
    track('brief_send_click')
  }

  const reset = () => {
    setInput(defaultBriefInput(todayIso()))
    setStatus('הטופס אופס')
  }

  const showPreview = () => {
    outputRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    previewRef.current?.focus({ preventScroll: true })
  }

  const messageNote = messageWarning(input.message)
  const kpiNote = kpiWarning(input.kpi)

  return (
    <section className={ui.tool} aria-label="שאלון לכתיבת בריף">
      <div className={ui.inner}>
        <form className={ui.form} onSubmit={(event) => event.preventDefault()}>
          <div className={styles.toolbar}>
            <button type="button" className={styles.jump} onClick={showPreview}>
              לתצוגה המקדימה של הבריף
            </button>
          </div>

          <Section title="סוג הבריף" first>
            <div className={styles.types}>
              {briefTypes.map((type) => (
                <label key={type.id} className={styles.typeCard}>
                  <input
                    type="radio"
                    name={typeName}
                    className={ui.checkbox}
                    checked={input.type === type.id}
                    onChange={() => set('type', type.id)}
                  />
                  <span className={styles.typeText}>
                    <span className={styles.typeName}>{type.label}</span>
                    <span className={styles.typeHint}>{type.hint}</span>
                  </span>
                </label>
              ))}
            </div>
          </Section>

          <Section title="על העסק">
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
              <Field label="אתר או עמוד באינסטגרם">
                {(id) => (
                  <input
                    id={id}
                    className={`${ui.input} ${ui.ltr}`}
                    inputMode="url"
                    placeholder="www.example.co.il"
                    value={input.link}
                    onChange={setText('link')}
                  />
                )}
              </Field>
            </div>
            <Field
              label="מה העסק עושה"
              hint="למשל: מרפאת שיניים משפחתית בפתח תקווה, פתוחה מ-2012, שלושה רופאים ושיננית"
            >
              {(id, describedBy) => (
                <textarea
                  id={id}
                  aria-describedby={describedBy}
                  className={`${ui.input} ${ui.textarea}`}
                  value={input.about}
                  onChange={setText('about')}
                />
              )}
            </Field>
          </Section>

          <Section title="הבעיה או ההזדמנות">
            <Field
              label="למה צריך את העבודה הזו עכשיו"
              hint="למשל: נפתח סניף שני ואף אחד בשכונה עוד לא יודע עליו, או: הלקוחות רואים בנו מקום זול ואנחנו רוצים להעלות מחירים"
            >
              {(id, describedBy) => (
                <textarea
                  id={id}
                  aria-describedby={describedBy}
                  className={`${ui.input} ${ui.textarea}`}
                  value={input.problem}
                  onChange={setText('problem')}
                />
              )}
            </Field>
          </Section>

          <Section title="מטרה ומדד הצלחה">
            <Field id={FIELD_IDS.goal} label="מה צריך לקרות בעסק בזכות העבודה" hint={info.goalHint}>
              {(id, describedBy) => (
                <input
                  id={id}
                  aria-describedby={describedBy}
                  className={ui.input}
                  value={input.goal}
                  onChange={setText('goal')}
                />
              )}
            </Field>
            <Field id={FIELD_IDS.kpi} label="מדד הצלחה אחד" hint={info.kpiHint} warning={kpiNote}>
              {(id, describedBy) => (
                <input
                  id={id}
                  aria-describedby={describedBy}
                  className={ui.input}
                  value={input.kpi}
                  onChange={setText('kpi')}
                />
              )}
            </Field>
          </Section>

          <Section title="קהל יעד">
            <Field
              id={FIELD_IDS.audience}
              label="מי הם"
              hint="למשל: הורים לילדים עד גיל 10 בגבעתיים וברמת גן, שמזמינים אוכל הביתה פעמיים בשבוע"
            >
              {(id, describedBy) => (
                <textarea
                  id={id}
                  aria-describedby={describedBy}
                  className={`${ui.input} ${ui.textarea}`}
                  value={input.audienceWho}
                  onChange={setText('audienceWho')}
                />
              )}
            </Field>
            <Field label="מה מציק להם" hint="למשל: אין זמן לבשל, ומשלוחים רגילים מגיעים קרים">
              {(id, describedBy) => (
                <input
                  id={id}
                  aria-describedby={describedBy}
                  className={ui.input}
                  value={input.audiencePain}
                  onChange={setText('audiencePain')}
                />
              )}
            </Field>
            <Field
              label="מה הם חושבים היום, עלינו או על התחום"
              hint="במילים שלהם. למשל: אוכל בריא במשלוח זה יקר ולא משביע"
            >
              {(id, describedBy) => (
                <input
                  id={id}
                  aria-describedby={describedBy}
                  className={ui.input}
                  value={input.audienceBelief}
                  onChange={setText('audienceBelief')}
                />
              )}
            </Field>
          </Section>

          <Section title="מסר מרכזי והוכחות">
            <Field
              id={FIELD_IDS.message}
              label="המסר המרכזי, במשפט אחד"
              hint="מה הקהל צריך לזכור גם אם ראה את המודעה שנייה אחת. למשל: ארוחת ערב ביתית מגיעה חמה תוך 40 דקות"
              warning={messageNote}
            >
              {(id, describedBy) => (
                <input
                  id={id}
                  aria-describedby={describedBy}
                  className={ui.input}
                  value={input.message}
                  onChange={setText('message')}
                />
              )}
            </Field>
            <Field
              label="הוכחות למסר"
              hint="שורה לכל הוכחה: עובדה, מספר, המלצה או תעודה. למשל: מטבח בכשרות הרבנות, 12 שנים בשכונה"
            >
              {(id, describedBy) => (
                <textarea
                  id={id}
                  aria-describedby={describedBy}
                  className={`${ui.input} ${ui.textarea}`}
                  value={input.proofs}
                  onChange={setText('proofs')}
                />
              )}
            </Field>
          </Section>

          <Section title="טון ושפה">
            <CheckGroup
              legend="איך אתם נשמעים"
              hint={`בחרו 2 או 3 מילים. נבחרו ${input.tone.length} מתוך ${MAX_TONE}.`}
              options={toneOptions}
              selected={input.tone}
              onToggle={toggleOption('tone')}
              max={MAX_TONE}
              compact
            />
            <Field label="מה אתם לא" hint='למשל: לא מתיילדים, לא סלנג, לא "מבצע מטורף"'>
              {(id, describedBy) => (
                <input
                  id={id}
                  aria-describedby={describedBy}
                  className={ui.input}
                  value={input.notUs}
                  onChange={setText('notUs')}
                />
              )}
            </Field>
          </Section>

          <Section title="מתחרים ודוגמאות">
            <Field label="מתחרים" hint="שמות או קישורים, ובמה אתם שונים מהם">
              {(id, describedBy) => (
                <textarea
                  id={id}
                  aria-describedby={describedBy}
                  className={`${ui.input} ${ui.textarea}`}
                  value={input.competitors}
                  onChange={setText('competitors')}
                />
              )}
            </Field>
            <Field
              label="דוגמאות שאתם אוהבים, ולמה"
              hint="קמפיין, לוגו או אתר, גם מתחום אחר. כתבו מה בדיוק אהבתם: הצבעים, הצילום או הניסוח"
            >
              {(id, describedBy) => (
                <textarea
                  id={id}
                  aria-describedby={describedBy}
                  className={`${ui.input} ${ui.textarea}`}
                  value={input.likes}
                  onChange={setText('likes')}
                />
              )}
            </Field>
            <Field label="דוגמאות שאתם לא אוהבים, ולמה" hint="משפט אחד כאן חוסך סבב תיקונים שלם">
              {(id, describedBy) => (
                <textarea
                  id={id}
                  aria-describedby={describedBy}
                  className={`${ui.input} ${ui.textarea}`}
                  value={input.dislikes}
                  onChange={setText('dislikes')}
                />
              )}
            </Field>
          </Section>

          <Section title="ערוצים ותוצרים">
            <CheckGroup
              legend="איפה זה יופיע"
              options={channelOptions}
              selected={input.channels}
              onToggle={toggleOption('channels')}
              compact
            />
            <CheckGroup
              legend={`מה צריך לקבל: ${info.label}`}
              options={info.deliverables}
              selected={input.deliverables}
              onToggle={toggleOption('deliverables')}
            />
            <Field label="כמויות, גדלים והערות" hint={info.amountHint}>
              {(id, describedBy) => (
                <input
                  id={id}
                  aria-describedby={describedBy}
                  className={ui.input}
                  value={input.deliverablesNote}
                  onChange={setText('deliverablesNote')}
                />
              )}
            </Field>
            {input.type === 'web' ? (
              <p className={styles.crossLink}>
                בונים אתר שלם? את העמודים, הפונקציות, האחסון והתחזוקה כדאי לפרט ב
                <Link href="/tools/website-spec-template">שאלון אפיון האתר</Link>, ולצרף אותו לבריף.
              </p>
            ) : null}
          </Section>

          <Section title="מגבלות">
            <CheckGroup
              legend="שפות"
              options={languageOptions}
              selected={input.languages}
              onToggle={toggleOption('languages')}
              compact
            />
            <Choice
              legend="מיתוג קיים"
              options={brandStatusOptions}
              value={input.brandStatus}
              onChange={(value) => set('brandStatus', value)}
            />
            <label className={ui.option}>
              <input
                type="checkbox"
                className={ui.checkbox}
                checked={input.accessibility}
                onChange={() => set('accessibility', !input.accessibility)}
              />
              <span>התוצרים צריכים להיות נגישים: ניגודיות, טקסט קריא, כתוביות וטקסט חלופי</span>
            </label>
            <Field label="חומרים שכבר יש" hint="למשל: צילומים מקצועיים מהשנה האחרונה, סרטון מאירוע, קבצי הלוגו">
              {(id, describedBy) => (
                <input
                  id={id}
                  aria-describedby={describedBy}
                  className={ui.input}
                  value={input.materials}
                  onChange={setText('materials')}
                />
              )}
            </Field>
            <Field
              label="מה חובה לכלול ומה אסור"
              hint="למשל: סמל הכשרות, הבהרה משפטית, בלי תמונות של מטופלים"
            >
              {(id, describedBy) => (
                <input
                  id={id}
                  aria-describedby={describedBy}
                  className={ui.input}
                  value={input.mustInclude}
                  onChange={setText('mustInclude')}
                />
              )}
            </Field>
          </Section>

          <Section title="תקציב וטווח">
            <p className={ui.hint}>לא חובה, אבל טווח תקציב עוזר לקבל הצעות שאפשר להשוות ביניהן.</p>
            <Choice
              legend="תקציב לעבודה"
              options={budgetOptions}
              value={input.budget}
              onChange={(value) => set('budget', value)}
            />
            {hasMediaBudget(input.type) ? (
              <Choice
                legend="תקציב מדיה, בנפרד מהעבודה"
                options={mediaBudgetOptions}
                value={input.mediaBudget}
                onChange={(value) => set('mediaBudget', value)}
              />
            ) : null}
            <Field label="הערות לתקציב" hint="למשל: אפשר לחלק את העבודה לשני שלבים">
              {(id, describedBy) => (
                <input
                  id={id}
                  aria-describedby={describedBy}
                  className={ui.input}
                  value={input.budgetNote}
                  onChange={setText('budgetNote')}
                />
              )}
            </Field>
          </Section>

          <Section title="לוח זמנים ואנשי קשר">
            <div className={styles.pair}>
              <Field id={FIELD_IDS.deadline} label="מועד אחרון">
                {(id) => (
                  <input
                    id={id}
                    type="date"
                    className={`${ui.input} ${ui.date}`}
                    value={input.deadline}
                    onChange={setText('deadline')}
                  />
                )}
              </Field>
              <Field label="למה דווקא אז" hint="למשל: ההרשמה לשנה הבאה נפתחת ב-1 ביוני">
                {(id, describedBy) => (
                  <input
                    id={id}
                    aria-describedby={describedBy}
                    className={ui.input}
                    value={input.deadlineNote}
                    onChange={setText('deadlineNote')}
                  />
                )}
              </Field>
            </div>
            <Field label="מי מאשר את העבודה" hint="שם ותפקיד. כשיש מאשר אחד, יש פחות סבבי תיקונים">
              {(id, describedBy) => (
                <input
                  id={id}
                  aria-describedby={describedBy}
                  className={ui.input}
                  value={input.approver}
                  onChange={setText('approver')}
                />
              )}
            </Field>
            <div className={styles.pair}>
              <Field label="איש קשר">
                {(id) => (
                  <input
                    id={id}
                    className={ui.input}
                    autoComplete="name"
                    value={input.contactName}
                    onChange={setText('contactName')}
                  />
                )}
              </Field>
              <Field label="טלפון">
                {(id) => (
                  <input
                    id={id}
                    type="tel"
                    autoComplete="tel"
                    className={`${ui.input} ${ui.ltr}`}
                    value={input.contactPhone}
                    onChange={setText('contactPhone')}
                  />
                )}
              </Field>
              <Field label="דוא״ל">
                {(id) => (
                  <input
                    id={id}
                    type="email"
                    autoComplete="email"
                    className={`${ui.input} ${ui.ltr}`}
                    value={input.contactEmail}
                    onChange={setText('contactEmail')}
                  />
                )}
              </Field>
              <Field label="תאריך הבריף">
                {(id) => (
                  <input
                    id={id}
                    type="date"
                    className={`${ui.input} ${ui.date}`}
                    value={input.date}
                    onChange={setText('date')}
                  />
                )}
              </Field>
            </div>
          </Section>

          <div className={styles.footerRow}>
            <label className={ui.option}>
              <input
                type="checkbox"
                className={ui.checkbox}
                checked={input.credit}
                onChange={() => set('credit', !input.credit)}
              />
              <span>להוסיף בסוף שורת קרדיט עם קישור לתבנית</span>
            </label>
            <button type="button" className={styles.reset} onClick={reset}>
              איפוס הטופס
            </button>
          </div>
        </form>

        <div ref={outputRef} className={`${ui.output} ${styles.output}`}>
          <div className={ui.sticky}>
            <h2 className={ui.outputTitle}>הבריף שלכם</h2>
            <div className={styles.score}>
              <div className={styles.scoreHead}>
                <p className={styles.scoreTitle} data-missing={missing.length > 0}>
                  {missing.length
                    ? `חסרים ${missing.length === 1 ? 'פרט קריטי אחד' : `${missing.length} פרטים קריטיים`}`
                    : 'כל הפרטים הקריטיים מולאו'}
                </p>
                <span className={styles.scoreCount}>
                  {done} מתוך {checks.length}
                </span>
              </div>
              <span className={styles.meter} aria-hidden="true">
                <span className={styles.meterFill} style={{ inlineSize: `${(done / checks.length) * 100}%` }} />
              </span>
              {missing.length ? (
                <ul className={styles.missing} aria-label="פרטים קריטיים שחסרים">
                  {missing.map((check) => (
                    <li key={check.id}>
                      <button type="button" className={styles.missingItem} onClick={() => focusField(check.id)}>
                        {check.label}
                      </button>
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>
            <div
              ref={previewRef}
              className={`${ui.paper} ${styles.paper}`}
              role="region"
              aria-label="תצוגה מקדימה של הבריף"
              tabIndex={0}
            >
              <Preview blocks={blocks} />
            </div>
            <div className={ui.actions}>
              <button type="button" className={`${ui.primary} ${styles.grow}`} onClick={copy}>
                <Copy aria-hidden="true" />
                העתקת הבריף
              </button>
              <button type="button" className={`${ui.secondary} ${styles.grow}`} onClick={print}>
                <Printer aria-hidden="true" />
                הדפסה או PDF
              </button>
              <Link href="/contact" className={`${ui.secondary} ${styles.send}`} onClick={sendToUs}>
                <Send aria-hidden="true" className={styles.sendIcon} />
                לשלוח את הבריף ל-Aiterra
              </Link>
            </div>
            <p className={ui.status} role="status" aria-live="polite">
              {status}
            </p>
            <p className={ui.note}>
              הטיוטה נשמרת רק בדפדפן שלכם ולא נשלחת לשום מקום. הכפתור «לשלוח את הבריף ל-Aiterra» מעתיק את הבריף
              ופותח את טופס יצירת הקשר, ושם מדביקים אותו. מה שמסומן בצהוב עוד צריך להשלים.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
