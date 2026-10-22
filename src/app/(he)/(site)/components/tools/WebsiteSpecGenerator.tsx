'use client'

import Link from 'next/link'
import { Fragment, useEffect, useId, useMemo, useRef, useState, type ChangeEvent, type ReactNode } from 'react'
import { Code, Copy, Download, Plus, Printer, Trash2 } from 'lucide-react'
import {
  MAX_PAGES,
  MAX_REFERENCES,
  brandOptions,
  buildSpec,
  copyOptions,
  defaultSpecInput,
  domainOptions,
  editorOptions,
  featureOptions,
  goalOptions,
  hostingOptions,
  languageOptions,
  legalOptions,
  maintenanceOptions,
  photoOptions,
  platformOptions,
  restoreSpecInput,
  siteTypes,
  specChecks,
  specDocument,
  specToHtml,
  specToText,
  suggestedPages,
  trackingOptions,
  type SiteType,
  type SpecBlock,
  type SpecChoice,
  type SpecInline,
  type SpecInput,
  type SpecPage,
  type SpecReference,
} from '@/lib/website-spec'
import ui from './toolUi.module.css'
import styles from './WebsiteSpecGenerator.module.css'

type TextKey = {
  [K in keyof SpecInput]: SpecInput[K] extends string ? K : never
}[keyof SpecInput]

type ListKey = 'languages' | 'features' | 'legalReady' | 'tracking'
type OutputAction = 'text' | 'html' | 'file' | 'print'
type FocusTarget = 'page' | 'reference' | null

const STORAGE_KEY = 'aiterra-website-spec-v1'
const PLACEHOLDER = /(\[[^\]]+\])/
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

function writeDraft(input: SpecInput) {
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
  label: ReactNode
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
  options: SpecChoice<T>[]
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
  compact = false,
}: {
  legend: string
  hint?: ReactNode
  options: { id: string; label: string }[]
  selected: string[]
  onToggle: (id: string) => void
  compact?: boolean
}) {
  const hintId = useId()
  return (
    <fieldset className={ui.group} aria-describedby={hint ? hintId : undefined}>
      <legend className={ui.legend}>{legend}</legend>
      {hint ? (
        <p id={hintId} className={ui.hint}>
          {hint}
        </p>
      ) : null}
      <div className={compact ? `${ui.options} ${styles.compact}` : ui.options}>
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

function Inline({ parts }: { parts: SpecInline[] }) {
  return (
    <>
      {parts.map((part, index) =>
        typeof part === 'string' ? (
          <Marked key={index} text={part} />
        ) : (
          <a key={index} href={part.href} target="_blank" rel="noopener noreferrer nofollow">
            {part.text}
          </a>
        ),
      )}
    </>
  )
}

function Preview({ blocks }: { blocks: SpecBlock[] }) {
  return (
    <div className={ui.document} dir="rtl" lang="he">
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
              {block.items.map((item, itemIndex) => (
                <Fragment key={item}>
                  {itemIndex ? ' · ' : ''}
                  <span className={styles.metaItem}>
                    <Marked text={item} />
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
        if (block.kind === 'table') {
          return (
            <table key={index} className={styles.docTable}>
              <thead>
                <tr>
                  {block.head.map((cell) => (
                    <th key={cell} scope="col">
                      {cell}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {block.rows.map(([no, name, purpose]) => (
                  <tr key={no}>
                    <td>{no}</td>
                    <th scope="row">
                      <Marked text={name} />
                    </th>
                    <td>
                      <Marked text={purpose} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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

export default function WebsiteSpecGenerator() {
  const [input, setInput] = useState<SpecInput>(() => defaultSpecInput(''))
  const [status, setStatus] = useState('')
  const [restored, setRestored] = useState(false)
  const [focusTarget, setFocusTarget] = useState<FocusTarget>(null)
  const previewRef = useRef<HTMLDivElement>(null)
  const pagesRef = useRef<HTMLOListElement>(null)
  const referencesRef = useRef<HTMLOListElement>(null)
  const addPageRef = useRef<HTMLButtonElement>(null)
  const addReferenceRef = useRef<HTMLButtonElement>(null)
  const typeName = useId()
  const blocks = useMemo(() => buildSpec(input), [input])
  const checks = useMemo(() => specChecks(input), [input])
  const done = checks.filter((check) => check.done).length
  const missing = checks.length - done
  const currentType = siteTypes.find((type) => type.id === input.siteType) ?? siteTypes[0]

  useEffect(() => {
    const saved = readDraft()
    setInput(saved ? restoreSpecInput(saved, todayIso()) : defaultSpecInput(todayIso()))
    setRestored(true)
  }, [])

  useEffect(() => {
    if (restored) writeDraft(input)
  }, [input, restored])

  useEffect(() => {
    if (!focusTarget) return
    const list = focusTarget === 'page' ? pagesRef.current : referencesRef.current
    list?.querySelector<HTMLInputElement>('li:last-child input')?.focus()
    setFocusTarget(null)
  }, [focusTarget])

  const set = <K extends keyof SpecInput>(key: K, value: SpecInput[K]) =>
    setInput((current) => ({ ...current, [key]: value }))

  const setText = (key: TextKey) => (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setInput((current) => ({ ...current, [key]: event.target.value }))

  const toggleOption = (key: ListKey) => (id: string) =>
    setInput((current) => ({
      ...current,
      [key]: current[key].includes(id) ? current[key].filter((item) => item !== id) : [...current[key], id],
    }))

  const setSiteType = (siteType: SiteType) =>
    setInput((current) => ({
      ...current,
      siteType,
      pages: current.pagesEdited ? current.pages : suggestedPages(siteType),
    }))

  const updatePage = (index: number, field: keyof SpecPage) => (event: ChangeEvent<HTMLInputElement>) =>
    setInput((current) => ({
      ...current,
      pagesEdited: true,
      pages: current.pages.map((item, itemIndex) =>
        itemIndex === index ? { ...item, [field]: event.target.value } : item,
      ),
    }))

  const addPage = () => {
    setInput((current) => ({
      ...current,
      pagesEdited: true,
      pages: [...current.pages, { name: '', purpose: '' }].slice(0, MAX_PAGES),
    }))
    setFocusTarget('page')
  }

  const removePage = (index: number) => {
    setInput((current) => ({
      ...current,
      pagesEdited: true,
      pages: current.pages.filter((_, itemIndex) => itemIndex !== index),
    }))
    addPageRef.current?.focus()
  }

  const resetPages = () => {
    setInput((current) => ({ ...current, pagesEdited: false, pages: suggestedPages(current.siteType) }))
    setStatus(`רשימת העמודים הוחלפה ברשימה המומלצת ל${currentType.label}`)
  }

  const updateReference = (index: number, field: keyof SpecReference) => (event: ChangeEvent<HTMLInputElement>) =>
    setInput((current) => ({
      ...current,
      references: current.references.map((item, itemIndex) =>
        itemIndex === index ? { ...item, [field]: event.target.value } : item,
      ),
    }))

  const addReference = () => {
    setInput((current) => ({
      ...current,
      references: [...current.references, { url: '', note: '' }].slice(0, MAX_REFERENCES),
    }))
    setFocusTarget('reference')
  }

  const removeReference = (index: number) => {
    setInput((current) => ({
      ...current,
      references: current.references.filter((_, itemIndex) => itemIndex !== index),
    }))
    addReferenceRef.current?.focus()
  }

  const track = (action: OutputAction) =>
    window.gtag?.('event', 'site_spec_copy', { format: action, site_type: input.siteType, completed: done })

  const withPlaceholderNote = (message: string, text: string) => {
    const left = countPlaceholders(text)
    if (!left) return message
    return `${message}. שימו לב: ${left === 1 ? 'נשאר פרט אחד' : `נשארו ${left} פרטים`} בסוגריים מרובעים להשלמה.`
  }

  const copy = async (format: 'text' | 'html') => {
    const text = specToText(blocks)
    const html = specToHtml(blocks)
    try {
      if (format === 'text' && typeof ClipboardItem !== 'undefined' && navigator.clipboard.write) {
        try {
          await navigator.clipboard.write([
            new ClipboardItem({
              'text/plain': new Blob([text], { type: 'text/plain' }),
              'text/html': new Blob([html], { type: 'text/html' }),
            }),
          ])
        } catch {
          await navigator.clipboard.writeText(text)
        }
      } else {
        await navigator.clipboard.writeText(format === 'html' ? html : text)
      }
      setStatus(
        withPlaceholderNote(
          format === 'html' ? 'קוד ה-HTML הועתק' : 'המסמך הועתק, ואפשר להדביק אותו ב-Word, ב-Google Docs או במייל',
          text,
        ),
      )
      track(format)
    } catch {
      setStatus('ההעתקה נכשלה. סמנו את הטקסט בתצוגה המקדימה והעתיקו ידנית.')
    }
  }

  const documentTitle = `מסמך אפיון אתר: ${input.businessName.trim() || 'טיוטה'}`

  const download = () => {
    const url = URL.createObjectURL(
      new Blob([specDocument(blocks, documentTitle)], { type: 'text/html;charset=utf-8' }),
    )
    const link = document.createElement('a')
    link.href = url
    link.download = 'website-spec.html'
    link.click()
    URL.revokeObjectURL(url)
    setStatus(withPlaceholderNote('הקובץ ירד', specToText(blocks)))
    track('file')
  }

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
    doc.write(specDocument(blocks, documentTitle))
    doc.close()
    frame.contentWindow.focus()
    frame.contentWindow.print()
    window.setTimeout(() => frame.remove(), 1000)
    setStatus(withPlaceholderNote('חלון ההדפסה נפתח. לשמירה כ-PDF בחרו "שמירה כ-PDF" במדפסת', specToText(blocks)))
    track('print')
  }

  const reset = () => {
    setInput(defaultSpecInput(todayIso()))
    setStatus('הטופס אופס')
  }

  const showPreview = () => {
    previewRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    previewRef.current?.focus({ preventScroll: true })
  }

  const features = input.features
  const domainHave = input.domain === 'have'

  return (
    <section className={ui.tool} aria-label="שאלון אפיון אתר">
      <div className={ui.inner}>
        <form className={ui.form} onSubmit={(event) => event.preventDefault()}>
          <div className={styles.toolbar}>
            <button type="button" className={styles.jump} onClick={showPreview}>
              לתצוגה המקדימה של המסמך
            </button>
          </div>

          <Section title="העסק ואיש הקשר" first>
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
              <Field label="כתובת האתר הקיים, אם יש">
                {(id) => (
                  <input
                    id={id}
                    className={`${ui.input} ${ui.ltr}`}
                    inputMode="url"
                    placeholder="www.example.co.il"
                    value={input.currentSite}
                    onChange={setText('currentSite')}
                  />
                )}
              </Field>
            </div>
            <Field label="מה העסק עושה" hint="שניים או שלושה משפטים: מה אתם מוכרים, למי ובאיזה אזור">
              {(id, hintId) => (
                <textarea
                  id={id}
                  aria-describedby={hintId}
                  className={`${ui.input} ${ui.textarea}`}
                  value={input.about}
                  onChange={setText('about')}
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
              <Field label="תאריך המסמך">
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

          <Section title="מטרות וקהל יעד">
            <Choice
              legend="המטרה העיקרית של האתר"
              options={goalOptions}
              value={input.goal}
              onChange={(value) => set('goal', value)}
            />
            <Field label="איך תדעו שהאתר הצליח" hint="משהו שאפשר לספור, למשל כמה פניות בחודש מגיעות מהאתר">
              {(id, hintId) => (
                <input
                  id={id}
                  aria-describedby={hintId}
                  className={ui.input}
                  value={input.successMetric}
                  onChange={setText('successMetric')}
                />
              )}
            </Field>
            <Field label="קהל היעד" hint="מי הלקוחות, מה חשוב להם ומאיפה הם מגיעים: גוגל, רשתות חברתיות או המלצה">
              {(id, hintId) => (
                <textarea
                  id={id}
                  aria-describedby={hintId}
                  className={`${ui.input} ${ui.textarea}`}
                  value={input.audience}
                  onChange={setText('audience')}
                />
              )}
            </Field>
          </Section>

          <Section title="סוג האתר">
            <div className={styles.types}>
              {siteTypes.map((type) => (
                <label key={type.id} className={styles.typeCard}>
                  <input
                    type="radio"
                    name={typeName}
                    className={ui.checkbox}
                    checked={input.siteType === type.id}
                    onChange={() => setSiteType(type.id)}
                  />
                  <span className={styles.typeText}>
                    <span className={styles.typeName}>{type.label}</span>
                    <span className={styles.typeHint}>{type.hint}</span>
                  </span>
                </label>
              ))}
            </div>
            <Choice
              legend="פלטפורמה מועדפת"
              options={platformOptions}
              value={input.platform}
              onChange={(value) => set('platform', value)}
            />
            <Choice
              legend="מי יעדכן תכנים אחרי ההשקה"
              options={editorOptions}
              value={input.editor}
              onChange={(value) => set('editor', value)}
            />
          </Section>

          <Section title="עמודים ומבנה">
            <p className={ui.hint}>
              {input.pagesEdited
                ? 'זו הרשימה שלכם. כדי לחזור לרשימה המומלצת לסוג האתר, השתמשו בכפתור שמתחת לרשימה.'
                : `רשימה מומלצת ל${currentType.label}. שנו שמות, הוסיפו עמודים או מחקו את מה שלא צריך.`}
            </p>
            <ol ref={pagesRef} className={styles.rows}>
              {input.pages.map((item, index) => (
                <li key={index} className={styles.row}>
                  <span className={styles.rowNo} aria-hidden="true">
                    {index + 1}
                  </span>
                  <div className={styles.rowFields}>
                    <Field
                      label={
                        <>
                          <span className={styles.visuallyHidden}>עמוד {index + 1}: </span>
                          שם העמוד
                        </>
                      }
                    >
                      {(id) => (
                        <input
                          id={id}
                          className={ui.input}
                          value={item.name}
                          onChange={updatePage(index, 'name')}
                        />
                      )}
                    </Field>
                    <Field
                      label={
                        <>
                          <span className={styles.visuallyHidden}>עמוד {index + 1}: </span>
                          מה יש בעמוד
                        </>
                      }
                    >
                      {(id) => (
                        <input
                          id={id}
                          className={ui.input}
                          value={item.purpose}
                          onChange={updatePage(index, 'purpose')}
                        />
                      )}
                    </Field>
                  </div>
                  <button
                    type="button"
                    className={styles.remove}
                    aria-label={`מחיקת ${item.name.trim() || `עמוד ${index + 1}`}`}
                    onClick={() => removePage(index)}
                  >
                    <Trash2 aria-hidden="true" />
                  </button>
                </li>
              ))}
            </ol>
            <div className={styles.rowActions}>
              <button
                ref={addPageRef}
                type="button"
                className={ui.secondary}
                onClick={addPage}
                disabled={input.pages.length >= MAX_PAGES}
              >
                <Plus aria-hidden="true" />
                הוספת עמוד
              </button>
              {input.pagesEdited ? (
                <button type="button" className={styles.textButton} onClick={resetPages}>
                  לרשימה המומלצת ל{currentType.label}
                </button>
              ) : null}
            </div>
            <CheckGroup
              legend="שפות האתר"
              options={languageOptions}
              selected={input.languages}
              onToggle={toggleOption('languages')}
              compact
            />
          </Section>

          <Section title="תוכן וחומרים">
            <Choice
              legend="מי כותב את הטקסטים"
              options={copyOptions}
              value={input.copyBy}
              onChange={(value) => set('copyBy', value)}
            />
            <Choice
              legend="תמונות"
              options={photoOptions}
              value={input.photos}
              onChange={(value) => set('photos', value)}
            />
            <Choice
              legend="לוגו ומיתוג"
              options={brandOptions}
              value={input.brand}
              onChange={(value) => set('brand', value)}
            />
            <Field label="הערות על התוכן" hint="לא חובה. למשל: סרטונים, קטלוג קיים או מסמכים להורדה">
              {(id, hintId) => (
                <textarea
                  id={id}
                  aria-describedby={hintId}
                  className={`${ui.input} ${ui.textarea}`}
                  value={input.contentNotes}
                  onChange={setText('contentNotes')}
                />
              )}
            </Field>
          </Section>

          <Section title="פונקציות">
            <CheckGroup
              legend="מה האתר צריך לעשות"
              options={featureOptions}
              selected={features}
              onToggle={toggleOption('features')}
            />
            {features.includes('payment') ? (
              <Field
                label="חברת סליקה"
                hint="למשל Cardcom, Tranzila, Grow או PayPlus. אפשר להשאיר ריק ולבקש המלצה."
              >
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
            {features.includes('invoices') ? (
              <Field label="מערכת חשבוניות" hint="למשל Morning (חשבונית ירוקה), iCount או רווחית">
                {(id, hintId) => (
                  <input
                    id={id}
                    aria-describedby={hintId}
                    className={ui.input}
                    value={input.invoiceSystem}
                    onChange={setText('invoiceSystem')}
                  />
                )}
              </Field>
            ) : null}
            {features.includes('crm') ? (
              <Field label="מערכת ה-CRM" hint="למשל monday.com, HubSpot או Zoho">
                {(id, hintId) => (
                  <input
                    id={id}
                    aria-describedby={hintId}
                    className={ui.input}
                    value={input.crmName}
                    onChange={setText('crmName')}
                  />
                )}
              </Field>
            ) : null}
            <Field label="פרטים נוספים" hint="לא חובה. למשל: סוגי מנויים, כללי ביטול או חיבור למערכת קיימת">
              {(id, hintId) => (
                <textarea
                  id={id}
                  aria-describedby={hintId}
                  className={`${ui.input} ${ui.textarea}`}
                  value={input.featureNotes}
                  onChange={setText('featureNotes')}
                />
              )}
            </Field>
          </Section>

          <Section title="משפטי ונגישות">
            <CheckGroup
              legend="מה כבר יש לכם"
              hint={
                <>
                  אין לכם עדיין? אפשר להכין בחינם ב
                  {legalOptions.map((option, index) => (
                    <span key={option.id}>
                      {index === 0 ? '' : index === legalOptions.length - 1 ? ' וב' : ', ב'}
                      <Link href={option.href} className={styles.hintLink}>
                        {option.tool}
                      </Link>
                    </span>
                  ))}
                  .
                </>
              }
              options={legalOptions}
              selected={input.legalReady}
              onToggle={toggleOption('legalReady')}
            />
            <p className={styles.legalNote}>
              המסמך יכלול דרישה שהאתר יעמוד בתקן הישראלי ת״י 5568 ברמת AA, כפי שתקנות הנגישות דורשות מעסק שנותן
              שירות לציבור, וסעיפים על באנר עוגיות ועל ביטול עסקה לפי מה שסימנתם.
            </p>
          </Section>

          <Section title="קידום ומדידה">
            <CheckGroup
              legend="מה צריך להגדיר באתר"
              options={trackingOptions}
              selected={input.tracking}
              onToggle={toggleOption('tracking')}
            />
            <Field label="ביטויי חיפוש חשובים" hint="לא חובה. מה הלקוחות שלכם מקלידים בגוגל">
              {(id, hintId) => (
                <input
                  id={id}
                  aria-describedby={hintId}
                  className={ui.input}
                  value={input.keywords}
                  onChange={setText('keywords')}
                />
              )}
            </Field>
          </Section>

          <Section title="דומיין, אחסון ותחזוקה">
            <Choice
              legend="דומיין"
              options={domainOptions}
              value={input.domain}
              onChange={(value) => set('domain', value)}
            />
            {input.domain ? (
              <Field label={domainHave ? 'שם הדומיין' : 'דומיין רצוי'} hint={domainHave ? undefined : 'לא חובה'}>
                {(id, hintId) => (
                  <input
                    id={id}
                    aria-describedby={hintId}
                    className={`${ui.input} ${ui.ltr}`}
                    inputMode="url"
                    placeholder="example.co.il"
                    value={input.domainName}
                    onChange={setText('domainName')}
                  />
                )}
              </Field>
            ) : null}
            <Choice
              legend="אחסון"
              options={hostingOptions}
              value={input.hosting}
              onChange={(value) => set('hosting', value)}
            />
            <Choice
              legend="תחזוקה אחרי ההשקה"
              options={maintenanceOptions}
              value={input.maintenance}
              onChange={(value) => set('maintenance', value)}
            />
          </Section>

          <Section title="תקציב ולוח זמנים">
            <div className={styles.pair}>
              <Field label="תקציב" hint="טווח שאתם מוכנים להשקיע. אם עוד לא החלטתם, כתבו את זה">
                {(id, hintId) => (
                  <input
                    id={id}
                    aria-describedby={hintId}
                    className={ui.input}
                    value={input.budget}
                    onChange={setText('budget')}
                  />
                )}
              </Field>
              <Field label="מועד השקה רצוי" hint="תאריך, או אירוע כמו פתיחת עונה או השקת מוצר">
                {(id, hintId) => (
                  <input
                    id={id}
                    aria-describedby={hintId}
                    className={ui.input}
                    value={input.deadline}
                    onChange={setText('deadline')}
                  />
                )}
              </Field>
            </div>
          </Section>

          <Section title="אתרים שאהבתם">
            <p className={ui.hint}>
              אתרים של מתחרים או מכל תחום אחר. כתבו מה אהבתם בכל אחד: העיצוב, המבנה או משהו שעובד טוב.
            </p>
            <ol ref={referencesRef} className={styles.rows}>
              {input.references.map((item, index) => (
                <li key={index} className={styles.row}>
                  <span className={styles.rowNo} aria-hidden="true">
                    {index + 1}
                  </span>
                  <div className={styles.rowFields}>
                    <Field
                      label={
                        <>
                          <span className={styles.visuallyHidden}>אתר {index + 1}: </span>
                          כתובת
                        </>
                      }
                    >
                      {(id) => (
                        <input
                          id={id}
                          className={`${ui.input} ${ui.ltr}`}
                          inputMode="url"
                          value={item.url}
                          onChange={updateReference(index, 'url')}
                        />
                      )}
                    </Field>
                    <Field
                      label={
                        <>
                          <span className={styles.visuallyHidden}>אתר {index + 1}: </span>
                          מה אהבתם בו
                        </>
                      }
                    >
                      {(id) => (
                        <input
                          id={id}
                          className={ui.input}
                          value={item.note}
                          onChange={updateReference(index, 'note')}
                        />
                      )}
                    </Field>
                  </div>
                  <button
                    type="button"
                    className={styles.remove}
                    aria-label={`מחיקת אתר ${index + 1}`}
                    onClick={() => removeReference(index)}
                  >
                    <Trash2 aria-hidden="true" />
                  </button>
                </li>
              ))}
            </ol>
            <div className={styles.rowActions}>
              <button
                ref={addReferenceRef}
                type="button"
                className={ui.secondary}
                onClick={addReference}
                disabled={input.references.length >= MAX_REFERENCES}
              >
                <Plus aria-hidden="true" />
                הוספת אתר
              </button>
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
              <span>להוסיף בסוף שורת קרדיט עם קישור למחולל</span>
            </label>
            <button type="button" className={styles.reset} onClick={reset}>
              איפוס הטופס
            </button>
          </div>
        </form>

        <div className={ui.output}>
          <div className={ui.sticky}>
            <h2 className={ui.outputTitle}>מסמך האפיון שלכם</h2>
            <details className={styles.checks}>
              <summary className={styles.checksSummary}>
                <span className={styles.checksTitle} data-missing={missing > 0}>
                  {missing
                    ? `חסרים ${missing === 1 ? 'נושא אחד' : `${missing} נושאים`} למסמך מלא`
                    : 'המסמך מלא ומוכן לשליחה'}
                </span>
                <span className={styles.meter} aria-hidden="true">
                  <span className={styles.meterFill} style={{ inlineSize: `${(done / checks.length) * 100}%` }} />
                </span>
                <span className={styles.meterText}>
                  {done} מתוך {checks.length}
                </span>
              </summary>
              <ul className={styles.checkList}>
                {checks.map((check) => (
                  <li key={check.id} className={styles.checkItem} data-done={check.done}>
                    <span className={styles.checkMark} aria-hidden="true">
                      {check.done ? '✓' : '!'}
                    </span>
                    <span>
                      <span className={styles.checkLabel}>{check.label}</span>
                      <span className={styles.visuallyHidden}>: {check.done ? 'הושלם' : 'חסר'}. </span>
                      <span className={styles.checkNote}>{check.note}</span>
                    </span>
                  </li>
                ))}
              </ul>
            </details>
            <div
              ref={previewRef}
              className={`${ui.paper} ${styles.paper}`}
              role="region"
              aria-label="תצוגה מקדימה של מסמך האפיון"
              tabIndex={0}
            >
              <Preview blocks={blocks} />
            </div>
            <div className={ui.actions}>
              <button type="button" className={`${ui.primary} ${styles.wide}`} onClick={() => copy('text')}>
                <Copy aria-hidden="true" />
                העתקת המסמך
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
              הטיוטה נשמרת רק בדפדפן שלכם ולא נשלחת לשום מקום. פרטים בסוגריים מרובעים, המסומנים גם בצהוב, עוד
              צריך להשלים.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
