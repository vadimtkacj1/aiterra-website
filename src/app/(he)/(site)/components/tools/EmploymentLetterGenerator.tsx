'use client'

import { useEffect, useId, useMemo, useRef, useState, type ChangeEvent, type ReactNode } from 'react'
import { Copy, Printer } from 'lucide-react'
import {
  buildLetter,
  defaultLetterInput,
  employerIdTypes,
  employmentTypes,
  hebrewFields,
  letterDocument,
  letterErrors,
  letterToText,
  personIdTypes,
  purposes,
  type EmployerIdType,
  type LetterInput,
  type LetterLanguage,
  type LetterModel,
  type Piece,
  type PersonIdType,
} from '@/lib/employment-letter'
import ui from './toolUi.module.css'
import styles from './EmploymentLetterGenerator.module.css'

type TextKey = {
  [K in keyof LetterInput]: LetterInput[K] extends string ? K : never
}[keyof LetterInput]

type ChoiceKey = 'purpose' | 'language' | 'status' | 'scope' | 'employmentType' | 'salaryBasis'

const STORAGE_KEY = 'aiterra-employment-letter-v1'
const PRIVATE_KEYS: (keyof LetterInput)[] = ['employeeId', 'salary']

const localToday = () => {
  const now = new Date()
  const pad = (value: number) => String(value).padStart(2, '0')
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`
}

const oneOf = <T extends string>(value: unknown, allowed: readonly T[], fallback: T): T =>
  allowed.includes(value as T) ? (value as T) : fallback

function readDraft(today: string): LetterInput | null {
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY)
    if (!saved) return null
    const data = JSON.parse(saved) as Record<string, unknown>
    const base = defaultLetterInput(today)
    const draft: Record<string, unknown> = { ...base }
    for (const key of Object.keys(base) as (keyof LetterInput)[]) {
      if (!PRIVATE_KEYS.includes(key) && typeof data[key] === typeof base[key]) draft[key] = data[key]
    }
    const input = draft as LetterInput
    return {
      ...input,
      purpose: oneOf(input.purpose, purposes.map((item) => item.id), base.purpose),
      language: oneOf(input.language, ['he', 'en'] as const, base.language),
      employerIdType: oneOf(input.employerIdType, employerIdTypes.map((item) => item.id), base.employerIdType),
      employeeIdType: oneOf(input.employeeIdType, personIdTypes.map((item) => item.id), base.employeeIdType),
      status: oneOf(input.status, ['current', 'ended'] as const, base.status),
      scope: oneOf(input.scope, ['full', 'partial'] as const, base.scope),
      employmentType: oneOf(input.employmentType, employmentTypes.map((item) => item.id), base.employmentType),
      salaryBasis: oneOf(input.salaryBasis, ['monthly', 'hourly'] as const, base.salaryBasis),
      issueDate: today,
    }
  } catch {
    return null
  }
}

function writeDraft(input: LetterInput) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...input, employeeId: '', salary: '' }))
    return true
  } catch {
    return false
  }
}

function clearDraft() {
  try {
    window.localStorage.removeItem(STORAGE_KEY)
    return true
  } catch {
    return false
  }
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

function Choices<T extends string>({
  legend,
  name,
  value,
  options,
  onChange,
  columns = 2,
}: {
  legend: string
  name: string
  value: T
  options: { id: T; label: string }[]
  onChange: (value: T) => void
  columns?: 1 | 2 | 3
}) {
  return (
    <fieldset className={`${ui.group} ${styles.choices}`}>
      <legend className={ui.legend}>{legend}</legend>
      <div className={`${ui.options} ${columns === 3 ? styles.three : ''} ${columns === 1 ? styles.one : ''}`}>
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

export function LetterPreview({ model, label }: { model: LetterModel; label?: string }) {
  return (
    <div className={styles.paperWrap} dir={model.dir} lang={model.language}>
      <article className={styles.sheet} aria-label={label}>
        <header className={styles.letterhead}>
          <p className={styles.biz}>
            <Text part={model.employer} />
          </p>
          {model.letterhead ? <p className={styles.muted}>{model.letterhead}</p> : null}
        </header>
        <p className={styles.issued}>
          <Text part={model.date} />
        </p>
        <div className={styles.to}>
          {model.addressee.map((line, index) => (
            <p key={index}>{line}</p>
          ))}
        </div>
        <p className={styles.subject}>{model.subject}</p>
        <p className={styles.intro}>
          <Pieces parts={model.intro} />
        </p>
        <dl className={styles.details}>
          {model.rows.map((row) => (
            <div key={row.key} className={styles.detail}>
              <dt>{row.label}</dt>
              <dd>
                <Text part={row.value} />
              </dd>
            </div>
          ))}
        </dl>
        <div className={styles.body}>
          <p>
            <Pieces parts={model.purpose} />
          </p>
          <p>{model.validity}</p>
          {model.verify ? <p>{model.verify}</p> : null}
        </div>
        <div className={styles.close}>
          <p>{model.closing}</p>
          <p className={styles.signer}>
            <Text part={model.signer} />
          </p>
          {model.signerTitle ? <p>{model.signerTitle}</p> : null}
          <p className={styles.signLine}>{model.signature}</p>
        </div>
      </article>
    </div>
  )
}

export default function EmploymentLetterGenerator() {
  const [input, setInput] = useState<LetterInput>(() => defaultLetterInput(''))
  const [restored, setRestored] = useState(false)
  const [status, setStatus] = useState('')
  const previewRef = useRef<HTMLDivElement>(null)
  const names = {
    purpose: useId(),
    language: useId(),
    status: useId(),
    scope: useId(),
    type: useId(),
    basis: useId(),
  }
  const salaryNoteId = useId()
  const model = useMemo(() => buildLetter(input), [input])
  const errors = letterErrors(input)
  const english = input.language === 'en'
  const hebrewLeft = english ? hebrewFields(input) : []

  useEffect(() => {
    const today = localToday()
    setInput(readDraft(today) ?? defaultLetterInput(today))
    setRestored(true)
  }, [])

  useEffect(() => {
    if (restored) writeDraft(input)
  }, [input, restored])

  const setText = (key: TextKey) => (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { value } = event.target
    setInput((current) => ({ ...current, [key]: value }))
  }

  const setChoice = <K extends ChoiceKey>(key: K) => (value: LetterInput[K]) =>
    setInput((current) => ({ ...current, [key]: value }))

  const setPurpose = (value: LetterInput['purpose']) =>
    setInput((current) => ({ ...current, purpose: value, language: value === 'abroad' ? 'en' : current.language }))

  const track = (event: 'employment_letter_print' | 'employment_letter_copy') =>
    window.gtag?.('event', event, {
      language: input.language,
      purpose: input.purpose,
      status: input.status,
      salary: input.includeSalary,
    })

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
    frame.srcdoc = letterDocument(model)
    document.body.appendChild(frame)
    setStatus('נפתח חלון ההדפסה. כדי לקבל קובץ PDF, בחרו ביעד שמירה כ-PDF.')
    track('employment_letter_print')
  }

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(letterToText(model))
      setStatus('המכתב הועתק כטקסט')
      track('employment_letter_copy')
    } catch {
      setStatus('ההעתקה נכשלה. סמנו את הטקסט בתצוגה המקדימה והעתיקו ידנית.')
    }
  }

  const reset = () => {
    if (!window.confirm('למחוק את כל הפרטים בטופס ולהתחיל מכתב חדש?')) return
    clearDraft()
    setInput(defaultLetterInput(localToday()))
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

  const dateInput = (key: TextKey, error?: string) =>
    function DateInput(id: string, describedBy?: string) {
      return (
        <input
          id={id}
          type="date"
          className={`${ui.input} ${styles.date}`}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          value={String(input[key])}
          onChange={setText(key)}
        />
      )
    }

  return (
    <section className={ui.tool} aria-label="מחולל מכתב אישור העסקה">
      <div className={ui.inner}>
        <form className={ui.form} onSubmit={(event) => event.preventDefault()}>
          <div className={styles.toolbar}>
            <button type="button" className={styles.jump} onClick={showPreview}>
              לתצוגה המקדימה
            </button>
          </div>

          <fieldset className={ui.group}>
            <legend className={ui.legend}>סוג האישור</legend>
            <Choices
              legend="למה צריך את האישור"
              name={names.purpose}
              value={input.purpose}
              options={purposes}
              onChange={setPurpose}
            />
            <Choices
              legend="שפת המכתב"
              name={names.language}
              value={input.language}
              options={[
                { id: 'he' as LetterLanguage, label: 'עברית' },
                { id: 'en' as LetterLanguage, label: 'English' },
              ]}
              onChange={setChoice('language')}
            />
            {english ? (
              <p className={styles.notice}>
                במכתב באנגלית הקלידו את השמות, הכתובת והתפקיד באנגלית, כמו שהם כתובים בדרכון ובמסמכי החברה.
              </p>
            ) : null}
          </fieldset>

          <fieldset className={ui.group}>
            <legend className={ui.legend}>המעסיק</legend>
            <Field label="שם המעסיק או החברה">{textInput('employerName', { autoComplete: 'organization' })}</Field>
            <div className={styles.pair}>
              <Field label="סוג המספר">
                {(id) => (
                  <select
                    id={id}
                    className={`${ui.input} ${styles.select}`}
                    value={input.employerIdType}
                    onChange={(event) =>
                      setInput((current) => ({ ...current, employerIdType: event.target.value as EmployerIdType }))
                    }
                  >
                    {employerIdTypes.map((type) => (
                      <option key={type.id} value={type.id}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                )}
              </Field>
              <Field label={input.employerIdType === 'company' ? 'מספר ח.פ.' : 'מספר עוסק'}>
                {(id) => (
                  <input
                    id={id}
                    inputMode="numeric"
                    autoComplete="off"
                    className={`${ui.input} ${ui.ltr}`}
                    value={input.employerId}
                    onChange={setText('employerId')}
                  />
                )}
              </Field>
            </div>
            <div className={styles.pair}>
              <Field label="כתובת">{textInput('employerAddress', { autoComplete: 'street-address' })}</Field>
              <Field label="טלפון לאימות">{textInput('employerPhone', { ltr: true, type: 'tel', autoComplete: 'tel' })}</Field>
            </div>
            <div className={styles.pair}>
              <Field label="שם החותם">{textInput('signerName', { autoComplete: 'name' })}</Field>
              <Field label="תפקיד החותם" hint="למשל: בעל העסק, מנהלת משאבי אנוש">
                {textInput('signerRole', { autoComplete: 'organization-title' })}
              </Field>
            </div>
          </fieldset>

          <fieldset className={ui.group}>
            <legend className={ui.legend}>העובד</legend>
            <Field label="שם מלא">{textInput('employeeName')}</Field>
            <div className={styles.pair}>
              <Field label="מסמך מזהה">
                {(id) => (
                  <select
                    id={id}
                    className={`${ui.input} ${styles.select}`}
                    value={input.employeeIdType}
                    onChange={(event) =>
                      setInput((current) => ({ ...current, employeeIdType: event.target.value as PersonIdType }))
                    }
                  >
                    {personIdTypes.map((type) => (
                      <option key={type.id} value={type.id}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                )}
              </Field>
              <Field
                label={input.employeeIdType === 'id' ? 'מספר זהות' : 'מספר דרכון'}
                hint={input.employeeIdType === 'id' ? '9 ספרות, כולל ספרת הביקורת' : undefined}
                error={errors.employeeId}
              >
                {(id, describedBy) => (
                  <input
                    id={id}
                    inputMode={input.employeeIdType === 'id' ? 'numeric' : 'text'}
                    autoComplete="off"
                    spellCheck={false}
                    className={`${ui.input} ${ui.ltr}`}
                    aria-invalid={errors.employeeId ? true : undefined}
                    aria-describedby={describedBy}
                    value={input.employeeId}
                    onChange={setText('employeeId')}
                  />
                )}
              </Field>
            </div>
            <Field label="תפקיד">{textInput('role')}</Field>
          </fieldset>

          <fieldset className={ui.group}>
            <legend className={ui.legend}>פרטי ההעסקה</legend>
            <Field label="תאריך תחילת העבודה" error={errors.startDate}>
              {dateInput('startDate', errors.startDate)}
            </Field>
            <Choices
              legend="מצב ההעסקה"
              name={names.status}
              value={input.status}
              options={[
                { id: 'current', label: 'עדיין עובד' },
                { id: 'ended', label: 'סיים לעבוד' },
              ]}
              onChange={setChoice('status')}
            />
            {input.status === 'ended' ? (
              <Field label="תאריך סיום העבודה" error={errors.endDate}>
                {dateInput('endDate', errors.endDate)}
              </Field>
            ) : null}
            <Choices
              legend="היקף משרה"
              name={names.scope}
              value={input.scope}
              options={[
                { id: 'full', label: 'משרה מלאה' },
                { id: 'partial', label: 'משרה חלקית' },
              ]}
              onChange={setChoice('scope')}
            />
            {input.scope === 'partial' ? (
              <Field label="אחוז משרה" error={errors.scopePercent}>
                {(id, describedBy) => (
                  <input
                    id={id}
                    inputMode="decimal"
                    autoComplete="off"
                    className={`${ui.input} ${ui.ltr} ${styles.short}`}
                    aria-invalid={errors.scopePercent ? true : undefined}
                    aria-describedby={describedBy}
                    value={input.scopePercent}
                    onChange={setText('scopePercent')}
                  />
                )}
              </Field>
            ) : null}
            <Choices
              legend="סוג ההעסקה"
              name={names.type}
              value={input.employmentType}
              options={employmentTypes}
              onChange={setChoice('employmentType')}
              columns={3}
            />
          </fieldset>

          <fieldset className={ui.group}>
            <legend className={ui.legend}>שכר</legend>
            <label className={ui.option}>
              <input
                type="checkbox"
                className={ui.checkbox}
                checked={input.includeSalary}
                aria-describedby={input.includeSalary ? salaryNoteId : undefined}
                onChange={() => setInput((current) => ({ ...current, includeSalary: !current.includeSalary }))}
              />
              <span>להוסיף למכתב שורת שכר</span>
            </label>
            {input.includeSalary ? (
              <>
                <p id={salaryNoteId} className={styles.notice}>
                  שכר הוא מידע אישי בעל רגישות מיוחדת לפי חוק הגנת הפרטיות. הוסיפו אותו רק בהסכמת העובד, ורק כשמי
                  שמקבל את המכתב באמת צריך אותו.
                </p>
                <Choices
                  legend="סוג השכר"
                  name={names.basis}
                  value={input.salaryBasis}
                  options={[
                    { id: 'monthly', label: 'חודשי, ברוטו' },
                    { id: 'hourly', label: 'לשעה, ברוטו' },
                  ]}
                  onChange={setChoice('salaryBasis')}
                />
                <Field label="סכום בש״ח" error={errors.salary}>
                  {(id, describedBy) => (
                    <input
                      id={id}
                      inputMode="decimal"
                      autoComplete="off"
                      className={`${ui.input} ${ui.ltr} ${styles.short}`}
                      aria-invalid={errors.salary ? true : undefined}
                      aria-describedby={describedBy}
                      value={input.salary}
                      onChange={setText('salary')}
                    />
                  )}
                </Field>
              </>
            ) : null}
          </fieldset>

          <fieldset className={ui.group}>
            <legend className={ui.legend}>המכתב</legend>
            <div className={styles.pair}>
              <Field label="תאריך המכתב">{dateInput('issueDate')}</Field>
              <Field label="נמען" hint={english ? 'ריק: To Whom It May Concern' : 'ריק: לכל המעוניין'}>
                {textInput('addressee')}
              </Field>
            </div>
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
            {hebrewLeft.length ? (
              <p className={styles.warning}>עדיין כתובים בעברית: {hebrewLeft.join(', ')}. במכתב באנגלית הקלידו אותם באנגלית.</p>
            ) : null}
            <div
              ref={previewRef}
              className={styles.desk}
              role="region"
              aria-label="תצוגה מקדימה של המכתב"
              tabIndex={0}
            >
              <LetterPreview model={model} />
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
            <p className={ui.note}>
              הפרטים נשמרים רק בדפדפן שלכם ולא נשלחים לשום מקום. מספר הזהות והשכר לא נשמרים גם שם.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
