'use client'

import Link from 'next/link'
import { useId, useMemo, useState, type ChangeEvent, type ReactNode } from 'react'
import {
  buildTerms,
  defaultTermsInput,
  entityTypes,
  exceptionOptions,
  paymentOptions,
  serviceKindOptions,
  siteTypes,
  termsToHtml,
  termsToText,
  type EntityType,
  type SiteType,
  type TermsBlock,
  type TermsInline,
  type TermsInput,
} from '@/lib/website-terms'
import ui from './toolUi.module.css'
import styles from './TermsGenerator.module.css'

type TextKey = {
  [K in keyof TermsInput]: TermsInput[K] extends string ? K : never
}[keyof TermsInput]

type ListKey = 'payments' | 'exceptions' | 'serviceKinds'
type ToggleKey = 'pickup' | 'cancellationFee' | 'credit'
type CopyFormat = 'text' | 'html'

const todayIso = () => new Date().toISOString().slice(0, 10)

const PLACEHOLDER = /(\[[^\]]+\])/

const countPlaceholders = (text: string) => text.match(/\[[^\]]+\]/g)?.length ?? 0

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

function Check({ checked, onChange, children }: { checked: boolean; onChange: () => void; children: ReactNode }) {
  return (
    <label className={ui.option}>
      <input type="checkbox" className={ui.checkbox} checked={checked} onChange={onChange} />
      <span>{children}</span>
    </label>
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
  hint?: string
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
          <Check key={option.id} checked={selected.includes(option.id)} onChange={() => onToggle(option.id)}>
            {option.label}
          </Check>
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

function Inline({ parts }: { parts: TermsInline[] }) {
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

function Preview({ blocks }: { blocks: TermsBlock[] }) {
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
        return (
          <p key={index} className={ui.docCredit}>
            {block.text} <a href={block.href}>{block.linkText}</a>
          </p>
        )
      })}
    </div>
  )
}

export default function TermsGenerator() {
  const [input, setInput] = useState<TermsInput>(() => defaultTermsInput(todayIso()))
  const [status, setStatus] = useState('')
  const typeName = useId()
  const blocks = useMemo(() => buildTerms(input), [input])
  const store = input.siteType === 'store'
  const services = input.siteType === 'services'
  const sells = store || services

  const setText = (key: TextKey) => (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setInput((current) => ({ ...current, [key]: event.target.value }))

  const toggle = (key: ToggleKey) => () => setInput((current) => ({ ...current, [key]: !current[key] }))

  const toggleOption = (key: ListKey) => (id: string) =>
    setInput((current) => ({
      ...current,
      [key]: current[key].includes(id) ? current[key].filter((item) => item !== id) : [...current[key], id],
    }))

  const setSiteType = (siteType: SiteType) => setInput((current) => ({ ...current, siteType }))

  const withPlaceholderNote = (message: string, text: string) => {
    const missing = countPlaceholders(text)
    if (!missing) return message
    return `${message}. שימו לב: ${missing === 1 ? 'נשאר פרט אחד' : `נשארו ${missing} פרטים`} בסוגריים מרובעים להשלמה.`
  }

  const copy = async (format: CopyFormat) => {
    const value = format === 'html' ? termsToHtml(blocks) : termsToText(blocks)
    try {
      await navigator.clipboard.writeText(value)
      setStatus(withPlaceholderNote(format === 'html' ? 'קוד ה-HTML הועתק' : 'הטקסט הועתק', value))
      window.gtag?.('event', 'terms_copy', { format, site_type: input.siteType })
    } catch {
      setStatus('ההעתקה נכשלה. סמנו את הטקסט בתצוגה המקדימה והעתיקו ידנית.')
    }
  }

  const download = () => {
    const html = `<!doctype html>\n<html lang="he" dir="rtl">\n<head>\n<meta charset="utf-8">\n<title>תקנון האתר</title>\n</head>\n<body>\n${termsToHtml(blocks)}\n</body>\n</html>\n`
    const url = URL.createObjectURL(new Blob([html], { type: 'text/html;charset=utf-8' }))
    const link = document.createElement('a')
    link.href = url
    link.download = 'website-terms.html'
    link.click()
    URL.revokeObjectURL(url)
    setStatus(withPlaceholderNote('הקובץ ירד', termsToText(blocks)))
    window.gtag?.('event', 'terms_copy', { format: 'file', site_type: input.siteType })
  }

  return (
    <section className={ui.tool} aria-label="מחולל תקנון לאתר">
      <div className={ui.inner}>
        <form className={ui.form} onSubmit={(event) => event.preventDefault()}>
          <fieldset className={ui.group}>
            <legend className={ui.legend}>סוג האתר</legend>
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
          </fieldset>

          <fieldset className={ui.group}>
            <legend className={ui.legend}>פרטי העסק</legend>
            <Field label="שם העסק">
              {(id) => (
                <input id={id} className={ui.input} value={input.businessName} onChange={setText('businessName')} />
              )}
            </Field>
            <div className={styles.pair}>
              <Field label="סוג העסק">
                {(id) => (
                  <select
                    id={id}
                    className={ui.input}
                    value={input.entityType}
                    onChange={(event) =>
                      setInput((current) => ({ ...current, entityType: event.target.value as EntityType }))
                    }
                  >
                    {entityTypes.map((type) => (
                      <option key={type.id} value={type.id}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                )}
              </Field>
              <Field label="מספר עוסק או ח.פ.">
                {(id) => (
                  <input
                    id={id}
                    inputMode="numeric"
                    className={`${ui.input} ${ui.ltr}`}
                    value={input.businessId}
                    onChange={setText('businessId')}
                  />
                )}
              </Field>
            </div>
            <Field label="כתובת העסק">
              {(id) => <input id={id} className={ui.input} value={input.address} onChange={setText('address')} />}
            </Field>
            <div className={ui.row}>
              <Field label="טלפון">
                {(id) => (
                  <input
                    id={id}
                    type="tel"
                    className={`${ui.input} ${ui.ltr}`}
                    value={input.phone}
                    onChange={setText('phone')}
                  />
                )}
              </Field>
              <Field label="דוא״ל">
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
              <Field label="כתובת האתר">
                {(id) => (
                  <input
                    id={id}
                    inputMode="url"
                    className={`${ui.input} ${ui.ltr}`}
                    value={input.siteUrl}
                    onChange={setText('siteUrl')}
                  />
                )}
              </Field>
            </div>
          </fieldset>

          {store ? (
            <fieldset className={ui.group}>
              <legend className={ui.legend}>משלוחים ואספקה</legend>
              <Field label="אזורי משלוח" hint="למשל: כל הארץ, למעט אילת">
                {(id, hintId) => (
                  <input
                    id={id}
                    aria-describedby={hintId}
                    className={ui.input}
                    value={input.shippingAreas}
                    onChange={setText('shippingAreas')}
                  />
                )}
              </Field>
              <Field label="זמן אספקה" hint="למשל: עד 5 ימי עסקים מיום אישור ההזמנה">
                {(id, hintId) => (
                  <input
                    id={id}
                    aria-describedby={hintId}
                    className={ui.input}
                    value={input.deliveryTime}
                    onChange={setText('deliveryTime')}
                  />
                )}
              </Field>
              <Field label="דמי משלוח" hint="למשל: 30 ש״ח, וחינם בהזמנה מעל 300 ש״ח">
                {(id, hintId) => (
                  <input
                    id={id}
                    aria-describedby={hintId}
                    className={ui.input}
                    value={input.shippingCost}
                    onChange={setText('shippingCost')}
                  />
                )}
              </Field>
              <Check checked={input.pickup} onChange={toggle('pickup')}>
                יש איסוף עצמי מכתובת העסק
              </Check>
            </fieldset>
          ) : null}

          {services ? (
            <CheckGroup
              legend="סוג השירות"
              options={serviceKindOptions}
              selected={input.serviceKinds}
              onToggle={toggleOption('serviceKinds')}
            />
          ) : null}

          {sells ? (
            <CheckGroup
              legend="אמצעי תשלום"
              compact
              options={paymentOptions}
              selected={input.payments}
              onToggle={toggleOption('payments')}
            />
          ) : null}

          {sells ? (
            <fieldset className={ui.group}>
              <legend className={ui.legend}>ביטול עסקה</legend>
              <Check checked={input.cancellationFee} onChange={toggle('cancellationFee')}>
                לגבות דמי ביטול: 5% מהמחיר או 100 ש״ח, לפי הנמוך
              </Check>
              {store ? (
                <CheckGroup
                  legend="מוצרים שאין עליהם זכות ביטול"
                  hint="סמנו רק מה שאתם באמת מוכרים. החריגים לפי סעיף 14ג(ד) לחוק הגנת הצרכן."
                  options={exceptionOptions}
                  selected={input.exceptions}
                  onToggle={toggleOption('exceptions')}
                />
              ) : null}
              <Field
                label="קישור לטופס ביטול עסקה"
                hint="סעיף 14ט(ב) לחוק מחייב קישור כזה, בולט וברור, בעמוד הבית של אתר שאפשר להזמין בו."
              >
                {(id, hintId) => (
                  <input
                    id={id}
                    aria-describedby={hintId}
                    inputMode="url"
                    className={`${ui.input} ${ui.ltr}`}
                    value={input.cancelUrl}
                    onChange={setText('cancelUrl')}
                  />
                )}
              </Field>
            </fieldset>
          ) : null}

          <fieldset className={ui.group}>
            <legend className={ui.legend}>קישורים ותאריך</legend>
            <Field label="קישור למדיניות הפרטיות">
              {(id) => (
                <input
                  id={id}
                  inputMode="url"
                  className={`${ui.input} ${ui.ltr}`}
                  value={input.privacyUrl}
                  onChange={setText('privacyUrl')}
                />
              )}
            </Field>
            <Field
              label="קישור להצהרת הנגישות"
              hint={
                <>
                  אין לכם עדיין?{' '}
                  <Link href="/tools/accessibility-statement-generator" className={styles.hintLink}>
                    מחולל הצהרת נגישות
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
                  value={input.accessibilityUrl}
                  onChange={setText('accessibilityUrl')}
                />
              )}
            </Field>
            <div className={styles.pair}>
              <Field label="עיר לסמכות השיפוט">
                {(id) => <input id={id} className={ui.input} value={input.city} onChange={setText('city')} />}
              </Field>
              <Field label="תאריך עדכון התקנון">
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
          </fieldset>

          <div className={styles.footer}>
            <Check checked={input.credit} onChange={toggle('credit')}>
              להוסיף בסוף שורת קרדיט עם קישור למחולל
            </Check>
          </div>
        </form>

        <div className={ui.output}>
          <div className={ui.sticky}>
            <h2 className={ui.outputTitle}>התקנון שלכם</h2>
            <p className={styles.disclaimer}>
              זו תבנית כללית ולא ייעוץ משפטי. בחנות אינטרנטית ובאתר שמוכר שירותים, כדאי שעורך דין יעבור על
              התקנון לפני הפרסום.
            </p>
            <div className={ui.paper} role="region" aria-label="תצוגה מקדימה של התקנון" tabIndex={0}>
              <Preview blocks={blocks} />
            </div>
            <div className={ui.actions}>
              <button type="button" className={ui.primary} onClick={() => copy('text')}>
                העתקת הטקסט
              </button>
              <button type="button" className={ui.secondary} onClick={() => copy('html')}>
                העתקת קוד HTML
              </button>
              <button type="button" className={ui.secondary} onClick={download}>
                הורדת קובץ
              </button>
            </div>
            <p className={ui.status} role="status" aria-live="polite">
              {status}
            </p>
            <p className={ui.note}>
              הפרטים נשארים בדפדפן שלכם ולא נשלחים לשום מקום. פרטים בסוגריים מרובעים, המסומנים גם בצהוב, עוד
              צריך להשלים.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
