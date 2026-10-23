'use client'

import { useEffect, useId, useRef, useState, type ReactNode } from 'react'
import { Copy } from 'lucide-react'
import {
  DEFAULT_CATEGORY,
  DEFAULT_VARIANT,
  addresses,
  buildPrompt,
  emptyInput,
  findCategory,
  imageTexts,
  languages,
  promptCategories,
  tones,
  variants,
  type AddressId,
  type ImageTextId,
  type LanguageId,
  type LengthId,
  type PromptCategoryId,
  type PromptInput,
  type ToneId,
  type VariantId,
} from '@/lib/prompt-generator'
import ui from './toolUi.module.css'
import styles from './PromptGenerator.module.css'

type TextField = 'role' | 'business' | 'audience' | 'detail' | 'constraints' | 'format' | 'example'

const COPY_FAILED = 'ההעתקה נכשלה. סמנו את הטקסט והעתיקו ידנית.'
const COPIED_RESET_MS = 2500
const LENGTH_IDS: LengthId[] = ['short', 'medium', 'long']

const trackCopy = (category: string, variant: string) =>
  window.gtag?.('event', 'prompt_copy', { category, variant })

async function copyText(text: string) {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    return false
  }
}

function useCopiedFlag() {
  const [copied, setCopied] = useState(false)
  const timer = useRef<number | undefined>(undefined)

  useEffect(() => () => window.clearTimeout(timer.current), [])

  const flag = () => {
    setCopied(true)
    window.clearTimeout(timer.current)
    timer.current = window.setTimeout(() => setCopied(false), COPIED_RESET_MS)
  }

  return [copied, flag, () => setCopied(false)] as const
}

function Tiles<T extends string>({
  legend,
  name,
  options,
  value,
  onChange,
}: {
  legend: string
  name: string
  options: { id: T; label: string; hint?: string }[]
  value: T
  onChange: (next: T) => void
}) {
  return (
    <fieldset className={`${ui.group} ${styles.tileGroup}`}>
      <legend className={ui.legend}>{legend}</legend>
      <div className={styles.tiles}>
        {options.map((option) => (
          <label key={option.id} className={styles.tile}>
            <input
              type="radio"
              name={name}
              value={option.id}
              checked={value === option.id}
              onChange={() => onChange(option.id)}
            />
            <span className={styles.tileLabel}>{option.label}</span>
            {option.hint ? <span className={styles.tileHint}>{option.hint}</span> : null}
          </label>
        ))}
      </div>
    </fieldset>
  )
}

function Field({ id, label, children }: { id: string; label: string; children: ReactNode }) {
  return (
    <div className={ui.field}>
      <label htmlFor={id} className={ui.label}>
        {label}
      </label>
      {children}
    </div>
  )
}

function Choice<T extends string>({
  id,
  label,
  options,
  value,
  onChange,
}: {
  id: string
  label: string
  options: { id: T; label: string }[]
  value: T
  onChange: (next: T) => void
}) {
  return (
    <Field id={id} label={label}>
      <select
        id={id}
        className={`${ui.input} ${styles.select}`}
        value={value}
        onChange={(event) => onChange(event.target.value as T)}
      >
        {options.map((option) => (
          <option key={option.id} value={option.id}>
            {option.label}
          </option>
        ))}
      </select>
    </Field>
  )
}

export function PromptCopyButton({ text, category, title }: { text: string; category: string; title: string }) {
  const [copied, flag] = useCopiedFlag()
  const [message, setMessage] = useState('')

  const copy = async () => {
    setMessage('')
    if (await copyText(text)) {
      flag()
      setMessage(`הפרומפט "${title}" הועתק`)
      trackCopy(category, 'library')
    } else {
      setMessage(COPY_FAILED)
    }
  }

  return (
    <div className={styles.libraryActions}>
      <button type="button" className={`${ui.secondary} ${styles.libraryButton}`} onClick={copy}>
        <Copy aria-hidden="true" />
        {copied ? (
          'הועתק'
        ) : (
          <>
            העתקה<span className={styles.srOnly}> של הפרומפט {title}</span>
          </>
        )}
      </button>
      <span className={styles.srOnly} role="status" aria-live="polite">
        {message}
      </span>
      {message === COPY_FAILED ? <span className={styles.libraryError}>{message}</span> : null}
    </div>
  )
}

export default function PromptGenerator() {
  const categoryName = useId()
  const toneName = useId()
  const lengthName = useId()
  const variantName = useId()
  const ids = {
    detail: useId(),
    business: useId(),
    audience: useId(),
    role: useId(),
    format: useId(),
    language: useId(),
    address: useId(),
    imageText: useId(),
    constraints: useId(),
    example: useId(),
  }
  const outputHeadingId = useId()

  const [input, setInput] = useState<PromptInput>(() => emptyInput(DEFAULT_CATEGORY))
  const [variant, setVariant] = useState<VariantId>(DEFAULT_VARIANT)
  const [status, setStatus] = useState('')
  const [copied, flagCopied, clearCopied] = useCopiedFlag()

  const category = findCategory(input.category)
  const prompt = buildPrompt(input, variant)
  const isImage = category.kind === 'image'
  const showAddress = category.readerFacing && input.language === 'he'
  const tone = input.tone ?? category.tone

  const update = <K extends keyof PromptInput>(key: K, value: PromptInput[K]) => {
    setInput((current) => ({ ...current, [key]: value }))
    setStatus('')
    clearCopied()
  }

  const text = (key: TextField) => ({
    id: ids[key],
    value: input[key],
    onChange: (event: { target: { value: string } }) => update(key, event.target.value),
  })

  const copyPrompt = async () => {
    setStatus('')
    if (await copyText(prompt)) {
      flagCopied()
      setStatus('הפרומפט הועתק. הדביקו אותו בצ׳אט.')
      trackCopy(category.id, variant)
    } else {
      setStatus(COPY_FAILED)
    }
  }

  const toneOptions = tones.map((option) => ({
    id: option.id,
    label: isImage ? option.moodLabel : option.label,
  }))

  const lengthOptions = LENGTH_IDS.map((id) => ({
    id,
    label: category.lengths[id].label,
    hint: category.lengths[id].text,
  }))

  return (
    <section className={ui.tool} aria-label="מחולל פרומפטים">
      <div className={ui.inner}>
        <form className={ui.form} onSubmit={(event) => event.preventDefault()}>
          <Tiles
            legend="מה צריך לכתוב"
            name={categoryName}
            options={promptCategories.map((option) => ({ id: option.id, label: option.label }))}
            value={input.category}
            onChange={(next: PromptCategoryId) => update('category', next)}
          />

          <fieldset className={ui.group}>
            <legend className={ui.legend}>הפרטים</legend>
            <Field id={ids.detail} label={category.detailLabel}>
              <textarea
                {...text('detail')}
                rows={category.quoteDetail ? 5 : 3}
                maxLength={6000}
                className={`${ui.input} ${ui.textarea}`}
                placeholder={category.detailPlaceholder}
              />
            </Field>
            <Field id={ids.business} label="על העסק">
              <textarea
                {...text('business')}
                rows={2}
                maxLength={800}
                className={`${ui.input} ${ui.textarea} ${styles.shortArea}`}
                placeholder="למשל: מספרה לילדים בחולון, פתוחה מ-2015, עם פינת משחקים"
              />
            </Field>
            <div className={styles.pair}>
              <Field id={ids.audience} label="למי זה מיועד">
                <input {...text('audience')} maxLength={200} className={ui.input} placeholder={category.audience} />
              </Field>
              <Field id={ids.role} label="התפקיד של המודל">
                <input {...text('role')} maxLength={200} className={ui.input} placeholder={category.role} />
              </Field>
            </div>
          </fieldset>

          <fieldset className={ui.group}>
            <legend className={ui.legend}>סגנון ופורמט</legend>
            <Tiles
              legend={isImage ? 'אווירה' : 'טון'}
              name={toneName}
              options={toneOptions}
              value={tone}
              onChange={(next: ToneId) => update('tone', next)}
            />
            <Tiles
              legend={category.lengthLegend}
              name={lengthName}
              options={lengthOptions}
              value={input.length}
              onChange={(next: LengthId) => update('length', next)}
            />
            <Field id={ids.format} label={isImage ? 'סגנון התמונה' : 'פורמט'}>
              <input {...text('format')} maxLength={300} className={ui.input} placeholder={category.format} />
            </Field>
            <div className={styles.pair}>
              {isImage ? (
                <Choice
                  id={ids.imageText}
                  label="טקסט בתוך התמונה"
                  options={imageTexts}
                  value={input.imageText}
                  onChange={(next: ImageTextId) => update('imageText', next)}
                />
              ) : (
                <Choice
                  id={ids.language}
                  label={category.kind === 'code' ? 'שפת ההסברים' : 'שפת הטקסט'}
                  options={languages}
                  value={input.language}
                  onChange={(next: LanguageId) => update('language', next)}
                />
              )}
              {showAddress ? (
                <Choice
                  id={ids.address}
                  label="פנייה לקורא"
                  options={addresses}
                  value={input.address}
                  onChange={(next: AddressId) => update('address', next)}
                />
              ) : null}
            </div>
          </fieldset>

          <fieldset className={ui.group}>
            <legend className={ui.legend}>דגשים ודוגמה</legend>
            <Field id={ids.constraints} label="מה חשוב לכלול ומה לא">
              <textarea
                {...text('constraints')}
                rows={3}
                maxLength={1500}
                className={`${ui.input} ${ui.textarea}`}
                placeholder={'שורה לכל דגש, למשל:\nלהזכיר שיש חניה חינם\nבלי המילה "מהמם"'}
              />
            </Field>
            <Field id={ids.example} label="דוגמה לסגנון שאתם אוהבים (לא חובה)">
              <textarea
                {...text('example')}
                rows={3}
                maxLength={3000}
                className={`${ui.input} ${ui.textarea}`}
                placeholder="הדביקו טקסט שכתבתם בעבר ואהבתם"
              />
            </Field>
          </fieldset>
        </form>

        <div className={ui.output}>
          <div className={ui.sticky}>
            <h2 id={outputHeadingId} className={ui.outputTitle}>
              הפרומפט שלכם
            </h2>
            <fieldset className={styles.variants}>
              <legend className={styles.srOnly}>גרסה</legend>
              {variants.map((option) => (
                <label key={option.id} className={styles.variant}>
                  <input
                    type="radio"
                    name={variantName}
                    value={option.id}
                    checked={variant === option.id}
                    onChange={() => {
                      setVariant(option.id)
                      setStatus('')
                      clearCopied()
                    }}
                  />
                  <span className={styles.variantLabel}>{option.label}</span>
                  <span className={styles.variantHint}>{option.hint}</span>
                </label>
              ))}
            </fieldset>
            <div
              className={styles.prompt}
              role="region"
              aria-labelledby={outputHeadingId}
              tabIndex={0}
              dir="rtl"
            >
              {prompt}
            </div>
            <div className={ui.actions}>
              <button type="button" className={ui.primary} onClick={copyPrompt}>
                <Copy aria-hidden="true" />
                {copied ? 'הועתק' : 'העתקת הפרומפט'}
              </button>
            </div>
            <p className={`${ui.status} ${styles.status}`} role="status" aria-live="polite">
              {status}
            </p>
            <p className={ui.note}>
              מדביקים ב-ChatGPT, ב-Claude או ב-Gemini. מה שכתבתם נשאר בדפדפן ולא נשלח לשום מקום.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
