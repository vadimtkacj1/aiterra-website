'use client'

import { useEffect, useId, useMemo, useRef, useState, type ChangeEvent, type ReactNode } from 'react'
import { Copy, MessageCircle, Plus, Printer, Trash2 } from 'lucide-react'
import {
  buildDemand,
  defaultDemandInput,
  demandDocument,
  demandErrors,
  demandToText,
  interestOptions,
  newInvoice,
  riskyPhrases,
  toneOptions,
  whatsappText,
  type DemandInput,
  type DemandInvoice,
  type DemandModel,
  type DemandTone,
  type InterestMode,
  type Piece,
} from '@/lib/payment-demand'
import ui from './toolUi.module.css'
import styles from './PaymentDemandGenerator.module.css'

type TextKey = {
  [K in keyof DemandInput]: DemandInput[K] extends string ? K : never
}[keyof DemandInput]

const STORAGE_KEY = 'aiterra-payment-demand-v1'
const SAVED_KEYS: (keyof DemandInput)[] = [
  'creditorName',
  'creditorId',
  'creditorAddress',
  'creditorPhone',
  'creditorEmail',
  'signerName',
  'bankName',
  'bankBranch',
  'bankAccount',
  'accountHolder',
  'appPhone',
]

const localToday = () => {
  const now = new Date()
  const pad = (value: number) => String(value).padStart(2, '0')
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`
}

function readSaved(today: string): DemandInput {
  const base = defaultDemandInput(today)
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY)
    if (!saved) return base
    const data = JSON.parse(saved) as Record<string, unknown>
    const next: Record<string, unknown> = { ...base }
    for (const key of SAVED_KEYS) if (typeof data[key] === 'string') next[key] = data[key]
    return next as DemandInput
  } catch {
    return base
  }
}

function writeSaved(input: DemandInput) {
  try {
    const data: Record<string, string> = {}
    for (const key of SAVED_KEYS) data[key] = String(input[key])
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  } catch {}
}

function clearSaved() {
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

function Text({ part }: { part: Piece }) {
  return part.missing ? <span className={styles.missing}>{part.text}</span> : <>{part.text}</>
}

function Pieces({ parts }: { parts: Piece[] }) {
  return (
    <>
      {parts.map((part, index) => (
        <Text key={index} part={part} />
      ))}
    </>
  )
}

export function DemandPreview({ model, label }: { model: DemandModel; label?: string }) {
  return (
    <div className={styles.paperWrap} dir="rtl" lang="he">
      <article className={styles.sheet} aria-label={label}>
        <header className={styles.letterhead}>
          <p className={styles.biz}>
            <Text part={model.creditor} />
          </p>
          {model.letterhead ? <p className={styles.muted}>{model.letterhead}</p> : null}
        </header>
        <p className={styles.issued}>
          <Text part={model.date} />
        </p>
        <div className={styles.to}>
          <p>לכבוד</p>
          {model.addressee.map((part, index) => (
            <p key={index}>
              <Text part={part} />
            </p>
          ))}
        </div>
        <p className={styles.subject}>{model.subject}</p>
        <div className={styles.body}>
          <p>
            <Pieces parts={model.greeting} />
          </p>
          <p>{model.opening}</p>
        </div>
        <table className={styles.invoices}>
          <thead>
            <tr>
              <th scope="col">חשבונית</th>
              <th scope="col">תאריך</th>
              <th scope="col" className={styles.num}>
                סכום
              </th>
            </tr>
          </thead>
          <tbody>
            {model.rows.map((row) => (
              <tr key={row.key}>
                <td>
                  <Text part={row.number} />
                </td>
                <td>{row.date}</td>
                <td className={styles.num}>{row.amount || <span className={styles.missing}>[סכום]</span>}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            {model.totals.map((row) => (
              <tr key={row.label} className={row.strong ? styles.strong : undefined}>
                <th scope="row" colSpan={2}>
                  {row.label}
                </th>
                <td className={styles.num}>{row.value}</td>
              </tr>
            ))}
          </tfoot>
        </table>
        <div className={styles.body}>
          <p className={styles.request}>
            <Pieces parts={model.request} />
          </p>
          {model.interest ? <p>{model.interest}</p> : null}
        </div>
        {model.payment.length ? (
          <div className={styles.pay}>
            <p className={styles.payTitle}>אפשרויות תשלום</p>
            {model.payment.map((line) => (
              <p key={line}>{line}</p>
            ))}
          </div>
        ) : null}
        <div className={styles.close}>
          {model.closing.map((line) => (
            <p key={line}>{line}</p>
          ))}
          <p className={styles.signer}>
            <Text part={model.signer} />
          </p>
          {model.signerBusiness ? <p>{model.signerBusiness}</p> : null}
          <p className={styles.signLine}>{model.sign}</p>
        </div>
      </article>
    </div>
  )
}

export default function PaymentDemandGenerator() {
  const [input, setInput] = useState<DemandInput>(() => defaultDemandInput(''))
  const [restored, setRestored] = useState(false)
  const [status, setStatus] = useState('')
  const previewRef = useRef<HTMLDivElement>(null)
  const toneName = useId()
  const interestName = useId()
  const model = useMemo(() => buildDemand(input), [input])
  const errors = demandErrors(input)
  const risks = riskyPhrases(input.note)

  useEffect(() => {
    setInput(readSaved(localToday()))
    setRestored(true)
  }, [])

  useEffect(() => {
    if (restored) writeSaved(input)
  }, [input, restored])

  const setText = (key: TextKey) => (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { value } = event.target
    setInput((current) => ({ ...current, [key]: value }))
  }

  const setTone = (tone: DemandTone) =>
    setInput((current) => {
      const previous = toneOptions.find((option) => option.id === current.tone)
      const next = toneOptions.find((option) => option.id === tone)
      const keepDays = previous && current.payDays !== previous.days
      return { ...current, tone, payDays: keepDays ? current.payDays : (next?.days ?? current.payDays) }
    })

  const setInvoice = (id: string, key: keyof Omit<DemandInvoice, 'id'>) => (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target
    setInput((current) => ({
      ...current,
      invoices: current.invoices.map((invoice) => (invoice.id === id ? { ...invoice, [key]: value } : invoice)),
    }))
  }

  const addInvoice = () => {
    setInput((current) => ({ ...current, invoices: [...current.invoices, newInvoice()] }))
    setStatus('נוספה שורת חשבונית')
  }

  const removeInvoice = (id: string, index: number) => {
    setInput((current) => ({ ...current, invoices: current.invoices.filter((invoice) => invoice.id !== id) }))
    setStatus(`שורת חשבונית ${index + 1} נמחקה`)
  }

  const track = (event: string) => window.gtag?.('event', event, { tone: input.tone, invoices: input.invoices.length })

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
    frame.srcdoc = demandDocument(model)
    document.body.appendChild(frame)
    setStatus('נפתח חלון ההדפסה. כדי לקבל קובץ PDF, בחרו ביעד שמירה כ-PDF.')
    track('payment_demand_print')
  }

  const copy = async (value: string, done: string, event: string) => {
    try {
      await navigator.clipboard.writeText(value)
      setStatus(done)
      track(event)
    } catch {
      setStatus('ההעתקה נכשלה. סמנו את הטקסט והעתיקו ידנית.')
    }
  }

  const reset = () => {
    if (!window.confirm('למחוק את כל הפרטים בטופס, כולל פרטי העסק השמורים?')) return
    clearSaved()
    setInput(defaultDemandInput(localToday()))
    setStatus('הטופס נוקה')
  }

  const showPreview = () => {
    previewRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    previewRef.current?.focus({ preventScroll: true })
  }

  const textInput = (key: TextKey, options: { ltr?: boolean; autoComplete?: string; type?: string } = {}) =>
    function TextInput(id: string, describedBy?: string) {
      return (
        <input
          id={id}
          type={options.type ?? 'text'}
          autoComplete={options.autoComplete ?? 'off'}
          className={`${ui.input} ${options.ltr ? ui.ltr : ''}`}
          aria-describedby={describedBy}
          value={String(input[key])}
          onChange={setText(key)}
        />
      )
    }

  const whatsapp = whatsappText(input)

  return (
    <section className={ui.tool} aria-label="מחולל מכתב התראה ודרישת תשלום">
      <div className={ui.inner}>
        <form className={ui.form} onSubmit={(event) => event.preventDefault()}>
          <div className={styles.toolbar}>
            <button type="button" className={styles.jump} onClick={showPreview}>
              לתצוגה המקדימה
            </button>
          </div>

          <fieldset className={ui.group}>
            <legend className={ui.legend}>סוג המכתב</legend>
            <div className={`${ui.options} ${styles.one}`}>
              {toneOptions.map((option) => (
                <label key={option.id} className={ui.option}>
                  <input
                    type="radio"
                    name={toneName}
                    className={ui.checkbox}
                    checked={input.tone === option.id}
                    onChange={() => setTone(option.id)}
                  />
                  <span>
                    <span className={styles.optionLabel}>{option.label}</span>
                    <span className={styles.optionHint}>{option.hint}</span>
                  </span>
                </label>
              ))}
            </div>
          </fieldset>

          <fieldset className={ui.group}>
            <legend className={ui.legend}>העסק שלכם</legend>
            <div className={styles.pair}>
              <Field label="שם העסק">{textInput('creditorName', { autoComplete: 'organization' })}</Field>
              <Field label="ע.מ. או ח.פ.">{textInput('creditorId', { ltr: true })}</Field>
            </div>
            <Field label="כתובת">{textInput('creditorAddress', { autoComplete: 'street-address' })}</Field>
            <div className={styles.pair}>
              <Field label="טלפון">{textInput('creditorPhone', { ltr: true, type: 'tel', autoComplete: 'tel' })}</Field>
              <Field label="אימייל">{textInput('creditorEmail', { ltr: true, type: 'email', autoComplete: 'email' })}</Field>
            </div>
            <Field label="שם החותם" hint="אתם, או מי שמוסמך לחתום בשם העסק">
              {textInput('signerName', { autoComplete: 'name' })}
            </Field>
          </fieldset>

          <fieldset className={ui.group}>
            <legend className={ui.legend}>הלקוח</legend>
            <Field label="שם הלקוח או החברה">{textInput('debtorName')}</Field>
            <Field label="כתובת הלקוח">{textInput('debtorAddress')}</Field>
            <Field label="בגין מה החוב" hint="למשל: עיצוב לוגו לפי הצעת מחיר מיום 3.6.2026">
              {textInput('subject')}
            </Field>
          </fieldset>

          <fieldset className={ui.group}>
            <legend className={ui.legend}>חשבוניות פתוחות</legend>
            {input.invoices.map((invoice, index) => (
              <div key={invoice.id} className={styles.invoiceRow}>
                <p className={styles.invoiceTitle}>חשבונית {index + 1}</p>
                <div className={styles.triple}>
                  <Field label="מספר">
                    {(id) => (
                      <input
                        id={id}
                        autoComplete="off"
                        className={`${ui.input} ${ui.ltr}`}
                        value={invoice.number}
                        onChange={setInvoice(invoice.id, 'number')}
                      />
                    )}
                  </Field>
                  <Field label="תאריך">
                    {(id) => (
                      <input
                        id={id}
                        type="date"
                        className={`${ui.input} ${styles.date}`}
                        value={invoice.date}
                        onChange={setInvoice(invoice.id, 'date')}
                      />
                    )}
                  </Field>
                  <Field label="סכום בש״ח, כולל מע״מ" error={errors.rows?.[invoice.id]}>
                    {(id, describedBy) => (
                      <input
                        id={id}
                        inputMode="decimal"
                        autoComplete="off"
                        className={`${ui.input} ${ui.ltr}`}
                        aria-invalid={errors.rows?.[invoice.id] ? true : undefined}
                        aria-describedby={describedBy}
                        value={invoice.amount}
                        onChange={setInvoice(invoice.id, 'amount')}
                      />
                    )}
                  </Field>
                </div>
                {input.invoices.length > 1 ? (
                  <button
                    type="button"
                    className={styles.textButton}
                    onClick={() => removeInvoice(invoice.id, index)}
                    aria-label={`מחיקת חשבונית ${index + 1}`}
                  >
                    <Trash2 aria-hidden="true" />
                    מחיקה
                  </button>
                ) : null}
              </div>
            ))}
            <button type="button" className={`${ui.secondary} ${styles.add}`} onClick={addInvoice}>
              <Plus aria-hidden="true" />
              הוספת חשבונית
            </button>
            <Field label="שולם עד היום על חשבון החוב, בש״ח" hint="ריק אם לא שולם כלום" error={errors.paid}>
              {(id, describedBy) => (
                <input
                  id={id}
                  inputMode="decimal"
                  autoComplete="off"
                  className={`${ui.input} ${ui.ltr} ${styles.short}`}
                  aria-invalid={errors.paid ? true : undefined}
                  aria-describedby={describedBy}
                  value={input.paid}
                  onChange={setText('paid')}
                />
              )}
            </Field>
          </fieldset>

          <fieldset className={ui.group}>
            <legend className={ui.legend}>מועד ופרטי תשלום</legend>
            <div className={styles.pair}>
              <Field label="תאריך המכתב">
                {(id) => (
                  <input
                    id={id}
                    type="date"
                    className={`${ui.input} ${styles.date}`}
                    value={input.issueDate}
                    onChange={setText('issueDate')}
                  />
                )}
              </Field>
              <Field label="ימים לתשלום מתאריך המכתב" error={errors.payDays}>
                {(id, describedBy) => (
                  <input
                    id={id}
                    inputMode="numeric"
                    autoComplete="off"
                    className={`${ui.input} ${ui.ltr}`}
                    aria-invalid={errors.payDays ? true : undefined}
                    aria-describedby={describedBy}
                    value={input.payDays}
                    onChange={setText('payDays')}
                  />
                )}
              </Field>
            </div>
            <div className={styles.pair}>
              <Field label="בנק">{textInput('bankName')}</Field>
              <Field label="מספר סניף">{textInput('bankBranch', { ltr: true })}</Field>
            </div>
            <div className={styles.pair}>
              <Field label="מספר חשבון">{textInput('bankAccount', { ltr: true })}</Field>
              <Field label="על שם">{textInput('accountHolder')}</Field>
            </div>
            <Field label="טלפון לאפליקציית תשלומים" hint="ביט, פייבוקס וכדומה. ריק אם לא רלוונטי">
              {textInput('appPhone', { ltr: true, type: 'tel' })}
            </Field>
          </fieldset>

          {input.tone !== 'reminder' ? (
            <fieldset className={ui.group}>
              <legend className={ui.legend}>ריבית</legend>
              <div className={`${ui.options} ${styles.one}`}>
                {interestOptions.map((option) => (
                  <label key={option.id} className={ui.option}>
                    <input
                      type="radio"
                      name={interestName}
                      className={ui.checkbox}
                      checked={input.interest === option.id}
                      onChange={() => setInput((current) => ({ ...current, interest: option.id as InterestMode }))}
                    />
                    <span>{option.label}</span>
                  </label>
                ))}
              </div>
              {input.interest === 'agreed' ? (
                <Field label="איפה סוכמה הריבית" hint="למשל: הסכם השירות מיום 1.5.2026, סעיף 6">
                  {textInput('interestSource')}
                </Field>
              ) : null}
              <p className={styles.notice}>
                דורשים ריבית פיגורים רק אם היא סוכמה מראש. בלי הסכמה, ריבית והצמדה נקבעות בפסק הדין, לפי שיקול דעת בית
                המשפט.
              </p>
            </fieldset>
          ) : null}

          <fieldset className={ui.group}>
            <legend className={ui.legend}>בדיקת ניסוח</legend>
            <Field
              label="מה אתם רוצים להוסיף ללקוח"
              hint="הטקסט לא נכנס למכתב. הדביקו כאן משפט שחשבתם לכתוב, ונבדוק שאין בו איום"
            >
              {(id, describedBy) => (
                <textarea
                  id={id}
                  className={`${ui.input} ${ui.textarea}`}
                  aria-describedby={describedBy}
                  value={input.note}
                  onChange={setText('note')}
                />
              )}
            </Field>
            {risks.length ? (
              <p className={styles.warning} role="alert">
                כדאי להוריד: {risks.join(', ')}. איום בפגיעה שלא כדין, למשל בשם הטוב או בפרנסה, כדי שאדם ישלם, עלול
                להיות עבירה של סחיטה באיומים לפי סעיף 428 לחוק העונשין. מותר לכתוב שתפנו לבית המשפט.
              </p>
            ) : null}
          </fieldset>

          <div className={styles.footerRow}>
            <button type="button" className={styles.textButton} onClick={reset}>
              ניקוי הטופס
            </button>
          </div>
        </form>

        <div className={ui.output}>
          <div className={ui.sticky}>
            <h2 className={ui.outputTitle}>המכתב שלכם</h2>
            <div
              ref={previewRef}
              className={styles.desk}
              role="region"
              aria-label="תצוגה מקדימה של המכתב"
              tabIndex={0}
            >
              <DemandPreview model={model} />
            </div>
            <div className={ui.actions}>
              <button type="button" className={`${ui.primary} ${styles.wide}`} onClick={print}>
                <Printer aria-hidden="true" />
                הדפסה או שמירה כ-PDF
              </button>
              <button
                type="button"
                className={ui.secondary}
                onClick={() => copy(demandToText(model), 'המכתב הועתק כטקסט', 'payment_demand_copy')}
              >
                <Copy aria-hidden="true" />
                העתקת המכתב
              </button>
              <button
                type="button"
                className={ui.secondary}
                onClick={() => copy(whatsapp, 'ההודעה לוואטסאפ הועתקה', 'payment_demand_whatsapp')}
              >
                <MessageCircle aria-hidden="true" />
                העתקת הודעה לוואטסאפ
              </button>
            </div>
            <p className={ui.status} role="status" aria-live="polite">
              {status}
            </p>
            <h3 className={styles.waTitle}>הודעה קצרה לוואטסאפ</h3>
            <p className={styles.wa}>{whatsapp}</p>
            <p className={ui.note}>
              פרטי העסק ופרטי החשבון נשמרים רק בדפדפן שלכם. פרטי הלקוח והחשבוניות לא נשמרים.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
