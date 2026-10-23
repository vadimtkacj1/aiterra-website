'use client'

import { useEffect, useId, useMemo, useRef, useState, type ChangeEvent, type ReactNode } from 'react'
import { Copy, Printer } from 'lucide-react'
import {
  bannedOptions,
  buildPolicy,
  defaultAiPolicyInput,
  disclosureOptions,
  forbiddenOptions,
  policyDocument,
  policyErrors,
  policyTitle,
  policyToText,
  toolOptions,
  useOptions,
  type AiPolicyInput,
  type DisclosureMode,
  type PolicyBlock,
  type PolicyOption,
} from '@/lib/ai-policy'
import ui from './toolUi.module.css'
import styles from './AiPolicyGenerator.module.css'

type TextKey = {
  [K in keyof AiPolicyInput]: AiPolicyInput[K] extends string ? K : never
}[keyof AiPolicyInput]

type ListKey = 'tools' | 'uses' | 'forbidden' | 'banned'

const STORAGE_KEY = 'aiterra-ai-policy-v1'

const localToday = () => {
  const now = new Date()
  const pad = (value: number) => String(value).padStart(2, '0')
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`
}

function readDraft(today: string): AiPolicyInput {
  const base = defaultAiPolicyInput(today)
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY)
    if (!saved) return base
    const data = JSON.parse(saved) as Record<string, unknown>
    const next: Record<string, unknown> = { ...base }
    for (const key of Object.keys(base) as (keyof AiPolicyInput)[]) {
      const value = data[key]
      if (Array.isArray(base[key])) {
        if (Array.isArray(value)) next[key] = value.filter((item) => typeof item === 'string')
      } else if (typeof value === typeof base[key]) next[key] = value
    }
    const input = next as AiPolicyInput
    const disclosure = disclosureOptions.some((option) => option.id === input.disclosure)
      ? input.disclosure
      : base.disclosure
    return { ...input, disclosure }
  } catch {
    return base
  }
}

function writeDraft(input: AiPolicyInput) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(input))
  } catch {}
}

function clearDraft() {
  try {
    window.localStorage.removeItem(STORAGE_KEY)
  } catch {}
}

function Field({
  label,
  hint,
  error,
  children,
}: {
  label: string
  hint?: string
  error?: string
  children: (id: string, describedBy?: string) => ReactNode
}) {
  const id = useId()
  const hintId = hint ? `${id}-hint` : ''
  const errorId = error ? `${id}-error` : ''
  const describedBy = [hintId, errorId].filter(Boolean).join(' ') || undefined
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
      {error ? (
        <p id={errorId} className={styles.error}>
          {error}
        </p>
      ) : null}
    </div>
  )
}

function Checks({
  legend,
  options,
  value,
  onToggle,
  error,
}: {
  legend: string
  options: PolicyOption[]
  value: string[]
  onToggle: (id: string) => void
  error?: string
}) {
  const errorId = useId()
  return (
    <fieldset className={ui.group} aria-describedby={error ? errorId : undefined}>
      <legend className={ui.legend}>{legend}</legend>
      <div className={ui.options}>
        {options.map((option) => (
          <label key={option.id} className={ui.option}>
            <input
              type="checkbox"
              className={ui.checkbox}
              checked={value.includes(option.id)}
              onChange={() => onToggle(option.id)}
            />
            <span>{option.label}</span>
          </label>
        ))}
      </div>
      {error ? (
        <p id={errorId} className={styles.error}>
          {error}
        </p>
      ) : null}
    </fieldset>
  )
}

export function PolicyPreview({ blocks, label }: { blocks: PolicyBlock[]; label?: string }) {
  return (
    <article className={`${ui.document} ${styles.doc}`} dir="rtl" lang="he" aria-label={label}>
      {blocks.map((block, index) => {
        if (block.kind === 'title') {
          return (
            <p key={index} className={`${ui.docTitle} ${styles.title}`}>
              {block.text}
            </p>
          )
        }
        if (block.kind === 'meta') {
          return (
            <p key={index} className={styles.meta}>
              {block.text}
            </p>
          )
        }
        if (block.kind === 'heading') {
          return (
            <p key={index} className={ui.docHeading}>
              {block.text}
            </p>
          )
        }
        if (block.kind === 'clause') {
          return (
            <p key={index}>
              <span className={styles.clauseNo}>{block.number}</span> {block.text}
            </p>
          )
        }
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
          <div key={index} className={styles.sign}>
            {block.lines.map((line) => (
              <p key={line}>{line}</p>
            ))}
          </div>
        )
      })}
    </article>
  )
}

export default function AiPolicyGenerator() {
  const [input, setInput] = useState<AiPolicyInput>(() => defaultAiPolicyInput(''))
  const [restored, setRestored] = useState(false)
  const [status, setStatus] = useState('')
  const previewRef = useRef<HTMLDivElement>(null)
  const disclosureName = useId()
  const blocks = useMemo(() => buildPolicy(input), [input])
  const errors = policyErrors(input)

  useEffect(() => {
    setInput(readDraft(localToday()))
    setRestored(true)
  }, [])

  useEffect(() => {
    if (restored) writeDraft(input)
  }, [input, restored])

  const setText = (key: TextKey) => (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target
    setInput((current) => ({ ...current, [key]: value }))
  }

  const toggle = (key: ListKey) => (id: string) =>
    setInput((current) => ({
      ...current,
      [key]: current[key].includes(id) ? current[key].filter((item) => item !== id) : [...current[key], id],
    }))

  const track = (event: string) => window.gtag?.('event', event, { tools: input.tools.length })

  const print = () => {
    const frame = document.createElement('iframe')
    frame.setAttribute('aria-hidden', 'true')
    frame.tabIndex = -1
    Object.assign(frame.style, { position: 'fixed', bottom: '0', width: '0', height: '0', border: '0' })
    frame.onload = () => {
      const view = frame.contentWindow
      if (!view) return
      view.focus()
      view.print()
      window.setTimeout(() => frame.remove(), 1000)
    }
    frame.srcdoc = policyDocument(blocks, policyTitle(input))
    document.body.appendChild(frame)
    setStatus('נפתח חלון ההדפסה. כדי לקבל קובץ PDF, בחרו ביעד שמירה כ-PDF.')
    track('ai_policy_print')
  }

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(policyToText(blocks))
      setStatus('המדיניות הועתקה כטקסט')
      track('ai_policy_copy')
    } catch {
      setStatus('ההעתקה נכשלה. סמנו את הטקסט בתצוגה המקדימה והעתיקו ידנית.')
    }
  }

  const reset = () => {
    if (!window.confirm('למחוק את כל הבחירות ולהתחיל מחדש?')) return
    clearDraft()
    setInput(defaultAiPolicyInput(localToday()))
    setStatus('הטופס נוקה')
  }

  const showPreview = () => {
    previewRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    previewRef.current?.focus({ preventScroll: true })
  }

  const numberInput = (key: TextKey, error?: string) =>
    function NumberInput(id: string, describedBy?: string) {
      return (
        <input
          id={id}
          inputMode="numeric"
          autoComplete="off"
          className={`${ui.input} ${ui.ltr}`}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          value={String(input[key])}
          onChange={setText(key)}
        />
      )
    }

  return (
    <section className={ui.tool} aria-label="מחולל מדיניות שימוש בבינה מלאכותית">
      <div className={ui.inner}>
        <form className={ui.form} onSubmit={(event) => event.preventDefault()}>
          <div className={styles.toolbar}>
            <button type="button" className={styles.jump} onClick={showPreview}>
              לתצוגה המקדימה
            </button>
          </div>

          <fieldset className={ui.group}>
            <legend className={ui.legend}>החברה</legend>
            <Field label="שם החברה או העסק">
              {(id) => (
                <input
                  id={id}
                  autoComplete="organization"
                  className={ui.input}
                  value={input.company}
                  onChange={setText('company')}
                />
              )}
            </Field>
            <div className={styles.pair}>
              <Field label="האחראי על המדיניות" hint="תפקיד, למשל: מנהלת התפעול">
                {(id, describedBy) => (
                  <input
                    id={id}
                    autoComplete="off"
                    className={ui.input}
                    aria-describedby={describedBy}
                    value={input.owner}
                    onChange={setText('owner')}
                  />
                )}
              </Field>
              <Field label="מייל לפניות" hint="לא חובה">
                {(id, describedBy) => (
                  <input
                    id={id}
                    type="email"
                    autoComplete="email"
                    className={`${ui.input} ${ui.ltr}`}
                    aria-describedby={describedBy}
                    value={input.contact}
                    onChange={setText('contact')}
                  />
                )}
              </Field>
            </div>
            <Field label="בתוקף מיום">
              {(id) => (
                <input
                  id={id}
                  type="date"
                  className={`${ui.input} ${styles.date}`}
                  value={input.effectiveDate}
                  onChange={setText('effectiveDate')}
                />
              )}
            </Field>
          </fieldset>

          <Checks
            legend="כלים מאושרים"
            options={toolOptions}
            value={input.tools}
            onToggle={toggle('tools')}
            error={errors.tools}
          />
          <div className={styles.after}>
            <Field label="כלים נוספים" hint="מופרדים בפסיק">
              {(id, describedBy) => (
                <input
                  id={id}
                  autoComplete="off"
                  className={ui.input}
                  aria-describedby={describedBy}
                  value={input.otherTools}
                  onChange={setText('otherTools')}
                />
              )}
            </Field>
            <label className={ui.option}>
              <input
                type="checkbox"
                className={ui.checkbox}
                checked={input.orgAccountsOnly}
                onChange={() => setInput((current) => ({ ...current, orgAccountsOnly: !current.orgAccountsOnly }))}
              />
              <span>רק בחשבון שהחברה פתחה או אישרה, לא בחשבון פרטי</span>
            </label>
          </div>

          <Checks legend="שימושים מותרים" options={useOptions} value={input.uses} onToggle={toggle('uses')} />
          <Checks
            legend="מידע שאסור להזין"
            options={forbiddenOptions}
            value={input.forbidden}
            onToggle={toggle('forbidden')}
          />
          {input.forbidden.length < forbiddenOptions.length ? (
            <p className={styles.warning}>
              הורדתם סוג מידע מהרשימה. מידע אישי ומידע בעל רגישות מיוחדת מוגנים בחוק הגנת הפרטיות, וכדאי להשאיר אותם.
            </p>
          ) : null}
          <Checks legend="שימושים אסורים" options={bannedOptions} value={input.banned} onToggle={toggle('banned')} />

          <fieldset className={ui.group}>
            <legend className={ui.legend}>גילוי שימוש ב-AI</legend>
            <div className={`${ui.options} ${styles.one}`}>
              {disclosureOptions.map((option) => (
                <label key={option.id} className={ui.option}>
                  <input
                    type="radio"
                    name={disclosureName}
                    className={ui.checkbox}
                    checked={input.disclosure === option.id}
                    onChange={() => setInput((current) => ({ ...current, disclosure: option.id as DisclosureMode }))}
                  />
                  <span>{option.label}</span>
                </label>
              ))}
            </div>
          </fieldset>

          <fieldset className={ui.group}>
            <legend className={ui.legend}>אישורים, דיווח ועדכון</legend>
            <div className={styles.triple}>
              <Field label="ימי עבודה לאישור כלי" error={errors.approvalDays}>
                {numberInput('approvalDays', errors.approvalDays)}
              </Field>
              <Field label="שעות לדיווח על תקלה" error={errors.reportHours}>
                {numberInput('reportHours', errors.reportHours)}
              </Field>
              <Field label="עדכון כל כמה חודשים" error={errors.reviewMonths}>
                {numberInput('reviewMonths', errors.reviewMonths)}
              </Field>
            </div>
            <label className={ui.option}>
              <input
                type="checkbox"
                className={ui.checkbox}
                checked={input.acknowledgment}
                onChange={() => setInput((current) => ({ ...current, acknowledgment: !current.acknowledgment }))}
              />
              <span>להוסיף הצהרת עובד וחתימה בסוף</span>
            </label>
          </fieldset>

          <div className={styles.footerRow}>
            <button type="button" className={styles.textButton} onClick={reset}>
              ניקוי הטופס
            </button>
          </div>
        </form>

        <div className={ui.output}>
          <div className={ui.sticky}>
            <h2 className={ui.outputTitle}>המדיניות שלכם</h2>
            <div
              ref={previewRef}
              className={ui.paper}
              role="region"
              aria-label="תצוגה מקדימה של המדיניות"
              tabIndex={0}
            >
              <PolicyPreview blocks={blocks} />
            </div>
            <div className={ui.actions}>
              <button type="button" className={`${ui.primary} ${styles.wide}`} onClick={print}>
                <Printer aria-hidden="true" />
                הדפסה או שמירה כ-PDF
              </button>
              <button type="button" className={ui.secondary} onClick={copy}>
                <Copy aria-hidden="true" />
                העתקת הטקסט
              </button>
            </div>
            <p className={ui.status} role="status" aria-live="polite">
              {status}
            </p>
            <p className={ui.note}>הבחירות נשמרות רק בדפדפן שלכם ולא נשלחות לשום מקום.</p>
          </div>
        </div>
      </div>
    </section>
  )
}
