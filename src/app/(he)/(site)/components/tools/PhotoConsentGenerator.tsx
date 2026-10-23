'use client'

import { useEffect, useId, useMemo, useState, type ChangeEvent, type ReactNode } from 'react'
import { Copy, Printer } from 'lucide-react'
import {
  buildConsent,
  channels,
  consentDocument,
  consentToText,
  defaultConsentInput,
  durations,
  nameModes,
  type ChannelId,
  type ConsentInput,
  type ConsentModel,
} from '@/lib/photo-consent'
import ui from './toolUi.module.css'
import styles from './PhotoConsentGenerator.module.css'

type TextKey = {
  [K in keyof ConsentInput]: ConsentInput[K] extends string ? K : never
}[keyof ConsentInput]

const localToday = () => {
  const now = new Date()
  const pad = (value: number) => String(value).padStart(2, '0')
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`
}

function Field({ label, hint, children }: { label: string; hint?: string; children: (id: string, hintId?: string) => ReactNode }) {
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

function Choices<T extends string>({
  legend,
  value,
  options,
  onChange,
}: {
  legend: string
  value: T
  options: { id: T; label: string }[]
  onChange: (value: T) => void
}) {
  const name = useId()
  return (
    <fieldset className={`${ui.group} ${styles.choices}`}>
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

export function ConsentPreview({ model, label }: { model: ConsentModel; label?: string }) {
  return (
    <div className={styles.paperWrap}>
      <article className={styles.sheet} aria-label={label}>
        <header className={styles.head}>
          <p className={styles.biz}>{model.business}</p>
          {model.businessLine ? <p className={styles.muted}>{model.businessLine}</p> : null}
        </header>
        <p className={styles.docTitle}>{model.title}</p>
        <p>{model.intro}</p>
        {model.sections.map((section, index) => (
          <div key={section.heading} className={styles.section}>
            <p className={styles.sectionTitle}>
              {index + 1}. {section.heading}
            </p>
            <ul>
              {section.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        ))}
        <p className={styles.date}>תאריך: {model.signDate}</p>
        <div className={styles.signs}>
          {model.signatures.map((item) => (
            <div key={item.label} className={styles.sign}>
              <p>{item.name}</p>
              <p className={styles.line}>{item.label}</p>
            </div>
          ))}
        </div>
      </article>
    </div>
  )
}

export default function PhotoConsentGenerator() {
  const [input, setInput] = useState<ConsentInput>(() => defaultConsentInput(''))
  const [status, setStatus] = useState('')
  const model = useMemo(() => buildConsent(input), [input])
  const minor = input.subjectType === 'minor'

  useEffect(() => {
    const today = localToday()
    setInput((current) => ({ ...current, shootDate: current.shootDate || today, signDate: current.signDate || today }))
  }, [])

  const setText = (key: TextKey) => (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target
    setInput((current) => ({ ...current, [key]: value }))
  }

  const toggleChannel = (id: ChannelId) =>
    setInput((current) => ({
      ...current,
      channels: current.channels.includes(id)
        ? current.channels.filter((item) => item !== id)
        : [...current.channels, id],
    }))

  const textInput = (key: TextKey, options: { type?: string; ltr?: boolean; autoComplete?: string } = {}) =>
    function TextInput(id: string, hintId?: string) {
      return (
        <input
          id={id}
          type={options.type ?? 'text'}
          autoComplete={options.autoComplete ?? 'off'}
          className={`${ui.input} ${options.ltr ? ui.ltr : ''}`}
          aria-describedby={hintId}
          value={String(input[key])}
          onChange={setText(key)}
        />
      )
    }

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
    frame.srcdoc = consentDocument(model)
    document.body.appendChild(frame)
    setStatus('נפתח חלון ההדפסה. כדי לקבל PDF, בחרו בשמירה כ-PDF.')
    window.gtag?.('event', 'photo_consent_print', { subject: input.subjectType })
  }

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(consentToText(model))
      setStatus('הטופס הועתק כטקסט')
      window.gtag?.('event', 'photo_consent_copy', { subject: input.subjectType })
    } catch {
      setStatus('ההעתקה נכשלה. סמנו את הטקסט בתצוגה המקדימה והעתיקו ידנית.')
    }
  }

  return (
    <section className={ui.tool} aria-label="מחולל טופס הסכמה לצילום">
      <div className={ui.inner}>
        <form className={ui.form} onSubmit={(event) => event.preventDefault()}>
          <fieldset className={ui.group}>
            <legend className={ui.legend}>העסק</legend>
            <Field label="שם העסק">{textInput('businessName', { autoComplete: 'organization' })}</Field>
            <div className={styles.pair}>
              <Field label="ח.פ. או מספר עוסק">{textInput('businessId', { ltr: true })}</Field>
              <Field label="לאן שולחים ביטול" hint="מייל או טלפון">
                {textInput('businessContact', { ltr: true })}
              </Field>
            </div>
          </fieldset>

          <Choices
            legend="מי מצולם"
            value={input.subjectType}
            options={[
              { id: 'adult', label: 'בגיר, 18 ומעלה' },
              { id: 'minor', label: 'קטין, מתחת ל-18' },
            ]}
            onChange={(subjectType) => setInput((current) => ({ ...current, subjectType }))}
          />
          <div className={styles.stack}>
            <Field label={minor ? 'שם הקטין' : 'שם המצולם'}>{textInput('personName')}</Field>
            {minor ? (
              <div className={styles.pair}>
                <Field label="שם ההורה או האפוטרופוס">{textInput('guardianName')}</Field>
                <Field label="קרבה" hint="למשל: הורה, אפוטרופוס">
                  {textInput('guardianRelation')}
                </Field>
              </div>
            ) : null}
          </div>

          <fieldset className={ui.group}>
            <legend className={ui.legend}>הצילום</legend>
            <Field label="מה מצלמים" hint="למשל: צילומי תדמית בסלון, אירוע השקה">
              {textInput('shootDescription')}
            </Field>
            <Field label="תאריך הצילום">{textInput('shootDate', { type: 'date' })}</Field>
            <label className={ui.option}>
              <input
                type="checkbox"
                className={ui.checkbox}
                checked={input.beforeAfter}
                onChange={() => setInput((current) => ({ ...current, beforeAfter: !current.beforeAfter }))}
              />
              <span>צילומי ״לפני ואחרי״ של טיפול</span>
            </label>
            {input.beforeAfter ? (
              <p className={styles.notice}>
                תמונות של טיפול עלולות לחשוף מידע על מצב בריאותו של אדם, שהוא מידע בעל רגישות מיוחדת לפי חוק הגנת
                הפרטיות. הטופס מוסיף הסכמה מפורשת לכך, ואוסר לפרסם לידן פרטים רפואיים.
              </p>
            ) : null}
          </fieldset>

          <fieldset className={ui.group}>
            <legend className={ui.legend}>איפה מפרסמים</legend>
            <div className={ui.options}>
              {channels.map((channel) => (
                <label key={channel.id} className={ui.option}>
                  <input
                    type="checkbox"
                    className={ui.checkbox}
                    checked={input.channels.includes(channel.id)}
                    onChange={() => toggleChannel(channel.id)}
                  />
                  <span>{channel.label}</span>
                </label>
              ))}
            </div>
            <Field label="ערוץ נוסף" hint="למשל: טיקטוק, ניוזלטר">
              {textInput('otherChannel')}
            </Field>
          </fieldset>

          <Choices
            legend="פנים"
            value={input.face}
            options={[
              { id: 'visible', label: 'הפנים גלויות' },
              { id: 'blurred', label: 'טשטוש פנים' },
            ]}
            onChange={(face) => setInput((current) => ({ ...current, face }))}
          />
          <Choices
            legend="שם ליד התמונה"
            value={input.nameMode}
            options={nameModes}
            onChange={(nameMode) => setInput((current) => ({ ...current, nameMode }))}
          />
          <Choices
            legend="תוקף ההסכמה"
            value={input.duration}
            options={durations}
            onChange={(duration) => setInput((current) => ({ ...current, duration }))}
          />

          <fieldset className={ui.group}>
            <legend className={ui.legend}>ביטול וחתימה</legend>
            <div className={styles.pair}>
              <Field label="ימים להסרה אחרי ביטול" hint="בין 1 ל-60">
                {(id, hintId) => (
                  <input
                    id={id}
                    inputMode="numeric"
                    autoComplete="off"
                    className={`${ui.input} ${ui.ltr}`}
                    aria-describedby={hintId}
                    value={input.removalDays}
                    onChange={setText('removalDays')}
                  />
                )}
              </Field>
              <Field label="תאריך החתימה">{textInput('signDate', { type: 'date' })}</Field>
            </div>
          </fieldset>
        </form>

        <div className={ui.output}>
          <div className={ui.sticky}>
            <h2 className={ui.outputTitle}>הטופס שלכם</h2>
            <div className={styles.desk} role="region" aria-label="תצוגה מקדימה של הטופס" tabIndex={0}>
              <ConsentPreview model={model} />
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
            <p className={ui.note}>הפרטים לא נשמרים ולא נשלחים לשום מקום.</p>
          </div>
        </div>
      </div>
    </section>
  )
}
