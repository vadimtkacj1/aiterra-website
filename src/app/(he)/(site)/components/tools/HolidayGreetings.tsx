'use client'

import { useId, useState, useSyncExternalStore, type ReactNode } from 'react'
import { PHONE_ERRORS, buildWhatsAppLink, normalizePhone } from '@/lib/whatsapp-link'
import {
  DEFAULT_AUDIENCE,
  DEFAULT_TONE,
  audiences,
  buildGreetings,
  combineGreetings,
  defaultHoliday,
  formatDate,
  holidayChoices,
  holidayHeading,
  israelToday,
  offerApplies,
  timingNote,
  tones,
  type AudienceId,
  type HolidayId,
  type ToneId,
} from '@/lib/holiday-greetings'
import ui from './toolUi.module.css'
import styles from './HolidayGreetings.module.css'

type CopyTarget = number | 'all'
type Status = { target: CopyTarget; text: string } | null
type Action = 'copy' | 'copy_all' | 'whatsapp'

const COPY_FAILED = 'ההעתקה נכשלה. סמנו את הטקסט והעתיקו ידנית.'
const PRIVACY_NOTE = 'השמות, ההטבה והמספר נשארים בדפדפן שלכם ולא נשלחים לשום מקום.'

const subscribeToNothing = () => () => {}

function TileGroup<T extends string>({
  legend,
  name,
  options,
  value,
  onChange,
  wide = false,
}: {
  legend: string
  name: string
  options: { id: T; label: string; hint?: string }[]
  value: T
  onChange: (next: T) => void
  wide?: boolean
}) {
  return (
    <fieldset className={ui.group}>
      <legend className={ui.legend}>{legend}</legend>
      <div className={wide ? styles.tilesWide : styles.tiles}>
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

function Field({
  id,
  label,
  hint,
  hintId,
  children,
}: {
  id: string
  label: string
  hint?: ReactNode
  hintId?: string
  children: ReactNode
}) {
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
      {children}
    </div>
  )
}

export default function HolidayGreetings({ initialToday }: { initialToday: string }) {
  const holidayName = useId()
  const audienceName = useId()
  const toneName = useId()
  const businessId = useId()
  const senderId = useId()
  const offerId = useId()
  const offerHintId = useId()
  const phoneId = useId()
  const phoneHintId = useId()
  const phoneErrorId = useId()

  const today = useSyncExternalStore(subscribeToNothing, israelToday, () => initialToday)

  const [chosenHoliday, setChosenHoliday] = useState<HolidayId | null>(null)
  const [audience, setAudience] = useState<AudienceId>(DEFAULT_AUDIENCE)
  const [tone, setTone] = useState<ToneId>(DEFAULT_TONE)
  const [business, setBusiness] = useState('')
  const [sender, setSender] = useState('')
  const [offer, setOffer] = useState('')
  const [emoji, setEmoji] = useState(false)
  const [phone, setPhone] = useState('')
  const [phoneTouched, setPhoneTouched] = useState(false)
  const [status, setStatus] = useState<Status>(null)

  const choices = holidayChoices(today)
  const holiday = chosenHoliday ?? defaultHoliday(today)
  const occurrence = choices.find((choice) => choice.id === holiday)?.occurrence ?? null
  const greetings = buildGreetings({ holiday, audience, tone, business, sender, offer, emoji, occurrence })
  const marked = offerApplies(audience, offer)

  const phoneResult = normalizePhone(phone)
  const digits = phoneResult.status === 'valid' ? phoneResult.digits : ''
  const phoneError =
    phoneResult.status === 'invalid' && (phoneTouched || phoneResult.error === PHONE_ERRORS.characters)
      ? phoneResult.error
      : ''

  const track = (action: Action) =>
    window.gtag?.('event', 'greeting_copy', { holiday, audience, tone, action })

  const change =
    <T,>(setter: (value: T) => void) =>
    (value: T) => {
      setter(value)
      setStatus(null)
    }

  const copy = async (target: CopyTarget) => {
    const text = target === 'all' ? combineGreetings(greetings) : greetings[target]
    try {
      await navigator.clipboard.writeText(text)
      setStatus({ target, text: target === 'all' ? 'כל הברכות הועתקו' : 'הברכה הועתקה' })
      track(target === 'all' ? 'copy_all' : 'copy')
    } catch {
      setStatus({ target, text: COPY_FAILED })
    }
  }

  const statusFor = (target: CopyTarget) => (status?.target === target ? status.text : '')

  const holidayOptions = choices.map((choice) => ({
    id: choice.id,
    label: choice.label,
    hint: choice.occurrence ? formatDate(choice.occurrence.start) : undefined,
  }))

  return (
    <section className={ui.tool} aria-label="מחולל ברכות לחג">
      <div className={ui.inner}>
        <form className={ui.form} onSubmit={(event) => event.preventDefault()}>
          <TileGroup
            legend="החג"
            name={holidayName}
            options={holidayOptions}
            value={holiday}
            onChange={change(setChosenHoliday)}
            wide
          />

          <fieldset className={ui.group}>
            <legend className={ui.legend}>למי ובאיזה סגנון</legend>
            <TileGroup
              legend="למי שולחים"
              name={audienceName}
              options={audiences}
              value={audience}
              onChange={change(setAudience)}
            />
            <TileGroup legend="סגנון" name={toneName} options={tones} value={tone} onChange={change(setTone)} />
          </fieldset>

          <fieldset className={ui.group}>
            <legend className={ui.legend}>פרטים לברכה</legend>
            <div className={styles.pair}>
              <Field id={businessId} label="שם העסק">
                <input
                  id={businessId}
                  className={ui.input}
                  autoComplete="organization"
                  value={business}
                  onChange={(event) => change(setBusiness)(event.target.value)}
                />
              </Field>
              <Field id={senderId} label="שם השולח">
                <input
                  id={senderId}
                  className={ui.input}
                  autoComplete="name"
                  value={sender}
                  onChange={(event) => change(setSender)(event.target.value)}
                />
              </Field>
            </div>
            {audience === 'clients' ? (
              <Field
                id={offerId}
                label="הטבה לחג (לא חובה)"
                hintId={offerHintId}
                hint="למשל: 15% הנחה על כל ההזמנות עד סוף החג. ברכה עם הטבה היא הודעת פרסומת, ולכן נוסיף בתחילתה את המילה ״פרסומת״ ובסופה דרך להסרה."
              >
                <input
                  id={offerId}
                  className={ui.input}
                  aria-describedby={offerHintId}
                  value={offer}
                  onChange={(event) => change(setOffer)(event.target.value)}
                />
              </Field>
            ) : null}
            <label className={ui.option}>
              <input
                type="checkbox"
                className={ui.checkbox}
                checked={emoji}
                onChange={(event) => change(setEmoji)(event.target.checked)}
              />
              <span>להוסיף אימוג׳י של החג</span>
            </label>
          </fieldset>

          <fieldset className={ui.group}>
            <legend className={ui.legend}>שליחה בוואטסאפ</legend>
            <Field
              id={phoneId}
              label="מספר הנמען (לא חובה)"
              hintId={phoneHintId}
              hint="בלי מספר, וואטסאפ תיפתח ותציע לבחור למי לשלוח."
            >
              <input
                id={phoneId}
                type="tel"
                inputMode="tel"
                className={`${ui.input} ${ui.ltr} ${phoneError ? styles.invalid : ''}`}
                aria-invalid={phoneError !== ''}
                aria-describedby={phoneError ? `${phoneHintId} ${phoneErrorId}` : phoneHintId}
                value={phone}
                onChange={(event) => change(setPhone)(event.target.value)}
                onBlur={() => setPhoneTouched(true)}
              />
              <p id={phoneErrorId} className={styles.error} aria-live="polite">
                {phoneError}
              </p>
            </Field>
          </fieldset>
        </form>

        <div className={ui.output}>
          <h2 className={ui.outputTitle}>{holidayHeading(holiday)}</h2>
          {occurrence ? <p className={styles.timing}>{timingNote(holiday, occurrence, today)}</p> : null}
          <div className={`${ui.actions} ${styles.flush}`}>
            <button type="button" className={ui.secondary} onClick={() => copy('all')}>
              העתקת כל הברכות
            </button>
          </div>
          <p className={`${ui.status} ${styles.statusLine}`} role="status" aria-live="polite">
            {statusFor('all')}
          </p>

          <ol className={styles.list}>
            {greetings.map((text, index) => (
              <li key={`${holiday}-${audience}-${tone}-${index}`} className={styles.card}>
                <p className={styles.text}>{text}</p>
                <div className={ui.actions}>
                  <button type="button" className={ui.primary} onClick={() => copy(index)}>
                    העתקה<span className={styles.srOnly}> של ברכה {index + 1}</span>
                  </button>
                  <a
                    href={buildWhatsAppLink(digits, text)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`${ui.secondary} ${styles.linkButton}`}
                    onClick={() => track('whatsapp')}
                  >
                    שליחה בוואטסאפ
                    <span className={styles.srOnly}> של ברכה {index + 1} (נפתח בחלון חדש)</span>
                  </a>
                </div>
                <p className={`${ui.status} ${styles.statusLine}`} role="status" aria-live="polite">
                  {statusFor(index)}
                </p>
              </li>
            ))}
          </ol>

          <div className={styles.law}>
            <p>
              <strong>שולחים להרבה לקוחות?</strong> לפי סעיף 30א לחוק התקשורת, הודעה מסחרית שמטרתה לעודד רכישה
              היא ״דבר פרסומת״, וככלל מותר לשלוח אותה רק למי שהסכים לכך מראש.
              {marked ? ' לכן הוספנו לברכות את המילה ״פרסומת״ ושורת הסרה.' : ''} גם ברכה בלי הטבה כדאי לשלוח רק
              למי שהסכים לקבל מכם הודעות.
            </p>
          </div>
          <p className={`${ui.note} ${styles.flush}`}>{PRIVACY_NOTE}</p>
        </div>
      </div>
    </section>
  )
}
