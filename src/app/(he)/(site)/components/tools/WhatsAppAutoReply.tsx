'use client'

import { useId, useState, type ReactNode } from 'react'
import {
  DEFAULT_BUSINESS,
  DEFAULT_LANGUAGE,
  DEFAULT_OCCASION,
  DEFAULT_TONE,
  DEFAULT_TYPE,
  WHERE_TO_PASTE,
  businessOptions,
  buildReplies,
  combineQuickReplies,
  countCharacters,
  fieldsFor,
  languages,
  messageTypes,
  occasions,
  replyHeading,
  tones,
  type AutoReply,
  type BusinessId,
  type LanguageId,
  type MessageType,
  type OccasionId,
  type ToneId,
} from '@/lib/whatsapp-auto-reply'
import ui from './toolUi.module.css'
import styles from './WhatsAppAutoReply.module.css'

type CopyTarget = string
type Status = { target: CopyTarget; text: string } | null

const COPY_FAILED = 'ההעתקה נכשלה. סמנו את הטקסט והעתיקו ידנית.'
const PRIVACY_NOTE = 'הפרטים שתמלאו נשארים בדפדפן שלכם ולא נשלחים לשום מקום.'
const ALL = 'all'

function TileGroup<T extends string>({
  legend,
  name,
  options,
  value,
  onChange,
  layout,
}: {
  legend: string
  name: string
  options: { id: T; label: string; hint?: string }[]
  value: T
  onChange: (next: T) => void
  layout: 'types' | 'businesses' | 'three' | 'two'
}) {
  return (
    <fieldset className={ui.group}>
      <legend className={ui.legend}>{legend}</legend>
      <div className={`${styles.tiles} ${styles[layout]}`}>
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

function copyLabel(reply: AutoReply, index: number) {
  return reply.shortcut ? ` של ${reply.shortcut}` : ` של נוסח ${index + 1}`
}

export default function WhatsAppAutoReply() {
  const typeName = useId()
  const businessName = useId()
  const toneName = useId()
  const occasionName = useId()
  const languageName = useId()
  const nameId = useId()
  const hoursId = useId()
  const returnId = useId()
  const linkId = useId()
  const phoneId = useId()
  const detailsHintId = useId()

  const [type, setType] = useState<MessageType>(DEFAULT_TYPE)
  const [business, setBusiness] = useState<BusinessId>(DEFAULT_BUSINESS)
  const [tone, setTone] = useState<ToneId>(DEFAULT_TONE)
  const [occasion, setOccasion] = useState<OccasionId>(DEFAULT_OCCASION)
  const [language, setLanguage] = useState<LanguageId>(DEFAULT_LANGUAGE)
  const [name, setName] = useState('')
  const [hours, setHours] = useState('')
  const [returnDate, setReturnDate] = useState('')
  const [link, setLink] = useState('')
  const [phone, setPhone] = useState('')
  const [emoji, setEmoji] = useState(false)
  const [status, setStatus] = useState<Status>(null)

  const fields = fieldsFor(type)
  const replies = buildReplies({
    type,
    business,
    tone,
    occasion,
    language,
    name,
    hours,
    returnDate,
    link,
    phone,
    emoji,
  })
  const heading = replyHeading({ type, business, occasion })
  const toneLabel = tones.find((option) => option.id === tone)?.label ?? ''
  const summary = `${heading}, בסגנון ${toneLabel}: ${replies.length} ${type === 'quick' ? 'תשובות' : 'נוסחים'}`
  const withOccasion = type === 'holiday' || type === 'email'

  const change =
    <T,>(setter: (value: T) => void) =>
    (value: T) => {
      setter(value)
      setStatus(null)
    }

  const copy = async (target: CopyTarget, text: string, done: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setStatus({ target, text: done })
      window.gtag?.('event', 'whatsapp_autoreply_copy', { type, business, tone })
    } catch {
      setStatus({ target, text: COPY_FAILED })
    }
  }

  const statusFor = (target: CopyTarget) => (status?.target === target ? status.text : '')

  return (
    <section className={ui.tool} aria-label="מחולל הודעות אוטומטיות לוואטסאפ עסקי">
      <div className={ui.inner}>
        <form className={ui.form} onSubmit={(event) => event.preventDefault()}>
          <TileGroup
            legend="סוג ההודעה"
            name={typeName}
            options={messageTypes}
            value={type}
            onChange={change(setType)}
            layout="types"
          />

          <fieldset className={ui.group}>
            <legend className={ui.legend}>העסק והסגנון</legend>
            <TileGroup
              legend="סוג העסק"
              name={businessName}
              options={businessOptions}
              value={business}
              onChange={change(setBusiness)}
              layout="businesses"
            />
            <TileGroup
              legend="סגנון"
              name={toneName}
              options={tones}
              value={tone}
              onChange={change(setTone)}
              layout="three"
            />
            {withOccasion ? (
              <TileGroup
                legend="למה העסק סגור"
                name={occasionName}
                options={occasions}
                value={occasion}
                onChange={change(setOccasion)}
                layout="two"
              />
            ) : null}
            {type === 'email' ? (
              <TileGroup
                legend="שפת המענה"
                name={languageName}
                options={languages}
                value={language}
                onChange={change(setLanguage)}
                layout="three"
              />
            ) : null}
          </fieldset>

          <fieldset className={ui.group} aria-describedby={detailsHintId}>
            <legend className={ui.legend}>פרטים להודעה</legend>
            <p id={detailsHintId} className={ui.hint}>
              כל השדות לא חובה. מה שתמלאו נכנס להודעות.
            </p>
            <div className={styles.pair}>
              <Field id={nameId} label="שם העסק">
                <input
                  id={nameId}
                  className={ui.input}
                  autoComplete="organization"
                  value={name}
                  onChange={(event) => change(setName)(event.target.value)}
                />
              </Field>
              {fields.hours ? (
                <Field id={hoursId} label="שעות פעילות">
                  <input
                    id={hoursId}
                    className={ui.input}
                    placeholder="א׳–ה׳ 9:00–18:00"
                    value={hours}
                    onChange={(event) => change(setHours)(event.target.value)}
                  />
                </Field>
              ) : null}
              {fields.returnDate ? (
                <Field id={returnId} label="חוזרים לעבודה בתאריך">
                  <input
                    id={returnId}
                    type="date"
                    className={ui.input}
                    value={returnDate}
                    onChange={(event) => change(setReturnDate)(event.target.value)}
                  />
                </Field>
              ) : null}
              <Field id={linkId} label="קישור לאתר, לזימון תורים או לקטלוג">
                <input
                  id={linkId}
                  type="url"
                  inputMode="url"
                  autoComplete="url"
                  className={`${ui.input} ${ui.ltr}`}
                  placeholder="https://"
                  value={link}
                  onChange={(event) => change(setLink)(event.target.value)}
                />
              </Field>
              {fields.phone ? (
                <Field id={phoneId} label="טלפון לדברים דחופים">
                  <input
                    id={phoneId}
                    type="tel"
                    inputMode="tel"
                    autoComplete="tel"
                    className={`${ui.input} ${ui.ltr}`}
                    value={phone}
                    onChange={(event) => change(setPhone)(event.target.value)}
                  />
                </Field>
              ) : null}
            </div>
            {fields.emoji ? (
              <label className={ui.option}>
                <input
                  type="checkbox"
                  className={ui.checkbox}
                  checked={emoji}
                  onChange={(event) => change(setEmoji)(event.target.checked)}
                />
                <span>להוסיף אימוג׳י אחד</span>
              </label>
            ) : null}
          </fieldset>
        </form>

        <div className={ui.output}>
          <h2 className={ui.outputTitle}>{heading}</h2>
          <p className={styles.where}>{WHERE_TO_PASTE[type]}</p>
          <p className={styles.srOnly} aria-live="polite">
            {summary}
          </p>

          {type === 'quick' ? (
            <>
              <div className={`${ui.actions} ${styles.flush}`}>
                <button
                  type="button"
                  className={ui.secondary}
                  onClick={() => copy(ALL, combineQuickReplies(replies), 'כל התשובות הועתקו')}
                >
                  העתקת כל התשובות
                </button>
              </div>
              <p className={`${ui.status} ${styles.statusLine}`} role="status" aria-live="polite">
                {statusFor(ALL)}
              </p>
            </>
          ) : null}

          <ol className={styles.list}>
            {replies.map((reply, index) => {
              const subjectTarget = `${reply.id}:subject`
              return (
                <li key={`${type}-${business}-${tone}-${reply.id}`} className={styles.card}>
                  {reply.shortcut ? (
                    <p className={styles.meta}>
                      <span className={styles.metaLabel}>קיצור</span>
                      <span className={styles.shortcut}>{reply.shortcut}</span>
                    </p>
                  ) : null}
                  {reply.subject ? (
                    <p className={styles.meta}>
                      <span className={styles.metaLabel}>נושא</span>
                      <span className={styles.subject}>{reply.subject}</span>
                    </p>
                  ) : null}
                  {reply.blocks.map((block) => (
                    <p
                      key={block.lang}
                      lang={block.lang}
                      dir={block.lang === 'en' ? 'ltr' : 'rtl'}
                      className={`${styles.text} ${block.lang === 'en' ? styles.textEn : ''}`}
                    >
                      {block.text}
                    </p>
                  ))}
                  <div className={styles.footer}>
                    <span className={styles.count}>{countCharacters(reply.text)} תווים</span>
                    <div className={styles.buttons}>
                      {reply.subject ? (
                        <button
                          type="button"
                          className={ui.secondary}
                          onClick={() => copy(subjectTarget, reply.subject ?? '', 'הנושא הועתק')}
                        >
                          העתקת הנושא<span className={styles.srOnly}>{` של נוסח ${index + 1}`}</span>
                        </button>
                      ) : null}
                      <button
                        type="button"
                        className={ui.primary}
                        onClick={() => copy(reply.id, reply.text, 'ההודעה הועתקה')}
                      >
                        {reply.subject ? 'העתקת ההודעה' : 'העתקה'}
                        <span className={styles.srOnly}>{copyLabel(reply, index)}</span>
                      </button>
                    </div>
                  </div>
                  <p className={`${ui.status} ${styles.statusLine}`} role="status" aria-live="polite">
                    {statusFor(reply.id) || statusFor(subjectTarget)}
                  </p>
                </li>
              )
            })}
          </ol>

          <p className={`${ui.note} ${styles.privacy}`}>{PRIVACY_NOTE}</p>
        </div>
      </div>
    </section>
  )
}
