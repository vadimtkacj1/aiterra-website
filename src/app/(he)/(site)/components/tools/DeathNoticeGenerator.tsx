'use client'

import { useId, useState } from 'react'
import { buildWhatsAppLink } from '@/lib/whatsapp-link'
import {
  buildFacebook,
  buildNewspaper,
  buildPrintHtml,
  buildWhatsApp,
  dateIsValid,
  emptyInput,
  genders,
  hasName,
  printSizes,
  tones,
  type GenderId,
  type NoticeInput,
  type PrintSize,
  type ToneId,
} from '@/lib/death-notice'
import ui from './toolUi.module.css'
import styles from './DeathNoticeGenerator.module.css'

type OutputId = 'newspaper' | 'whatsapp' | 'facebook'
type Status = { target: OutputId; text: string } | null

const COPY_FAILED = 'ההעתקה נכשלה. סמנו את הטקסט והעתיקו ידנית.'
const PRINT_BLOCKED = 'הדפדפן חסם את חלון ההדפסה. אפשרו חלונות קופצים לאתר ונסו שוב.'

const outputs: { id: OutputId; title: string }[] = [
  { id: 'newspaper', title: 'מודעה לעיתון' },
  { id: 'whatsapp', title: 'הודעה לוואטסאפ' },
  { id: 'facebook', title: 'פוסט לפייסבוק' },
]

function RadioTiles<T extends string>({
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
    <fieldset className={ui.group}>
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

function TextField({
  id,
  label,
  value,
  onChange,
  inputMode,
}: {
  id: string
  label: string
  value: string
  onChange: (next: string) => void
  inputMode?: 'numeric'
}) {
  return (
    <div className={ui.field}>
      <label htmlFor={id} className={ui.label}>
        {label}
      </label>
      <input
        id={id}
        className={ui.input}
        autoComplete="off"
        inputMode={inputMode}
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
    </div>
  )
}

export default function DeathNoticeGenerator() {
  const toneName = useId()
  const genderName = useId()
  const sizeName = useId()
  const ids = {
    name: useId(),
    parent: useId(),
    age: useId(),
    death: useId(),
    deathHint: useId(),
    family: useId(),
    familyHint: useId(),
    funeralDate: useId(),
    funeralTime: useId(),
    funeralPlace: useId(),
    shivaAddress: useId(),
    shivaHours: useId(),
    shivaNote: useId(),
    signature: useId(),
  }

  const [input, setInput] = useState<NoticeInput>(emptyInput)
  const [size, setSize] = useState<PrintSize>('A4')
  const [status, setStatus] = useState<Status>(null)
  const [printMessage, setPrintMessage] = useState('')

  const set = <K extends keyof NoticeInput>(key: K, value: NoticeInput[K]) => {
    setInput((current) => ({ ...current, [key]: value }))
    setStatus(null)
    setPrintMessage('')
  }

  const ready = hasName(input)
  const texts: Record<OutputId, string> = {
    newspaper: buildNewspaper(input),
    whatsapp: buildWhatsApp(input),
    facebook: buildFacebook(input),
  }

  const copy = async (target: OutputId) => {
    try {
      await navigator.clipboard.writeText(texts[target])
      setStatus({ target, text: 'הנוסח הועתק' })
      window.gtag?.('event', 'death_notice_copy', { target, tone: input.tone })
    } catch {
      setStatus({ target, text: COPY_FAILED })
    }
  }

  const print = () => {
    const sheet = window.open('', '_blank')
    if (!sheet) {
      setPrintMessage(PRINT_BLOCKED)
      return
    }
    sheet.document.open()
    sheet.document.write(buildPrintHtml(input, size))
    sheet.document.close()
    sheet.focus()
    sheet.print()
    window.gtag?.('event', 'death_notice_print', { size, tone: input.tone })
  }

  return (
    <section className={ui.tool} aria-label="מחולל נוסח מודעת אבל">
      <div className={ui.inner}>
        <form className={ui.form} onSubmit={(event) => event.preventDefault()}>
          <RadioTiles<ToneId>
            legend="סגנון הנוסח"
            name={toneName}
            options={tones}
            value={input.tone}
            onChange={(next) => set('tone', next)}
          />

          <fieldset className={ui.group}>
            <legend className={ui.legend}>על הנפטר</legend>
            <RadioTiles<GenderId>
              legend="לשון"
              name={genderName}
              options={genders}
              value={input.gender}
              onChange={(next) => set('gender', next)}
            />
            <TextField id={ids.name} label="שם מלא" value={input.name} onChange={(next) => set('name', next)} />
            <div className={styles.pair}>
              <TextField
                id={ids.parent}
                label="שם האב (לא חובה)"
                value={input.parentName}
                onChange={(next) => set('parentName', next)}
              />
              <TextField
                id={ids.age}
                label="גיל (לא חובה)"
                inputMode="numeric"
                value={input.age}
                onChange={(next) => set('age', next)}
              />
            </div>
            <div className={ui.field}>
              <label htmlFor={ids.death} className={ui.label}>
                תאריך הפטירה (לא חובה)
              </label>
              <p id={ids.deathHint} className={ui.hint}>
                התאריך העברי מחושב ליום הלוח שבחרתם. אחרי רדת החשכה כבר מתחיל היום העברי הבא, ולכן בדקו אותו לפני
                הפרסום.
              </p>
              <input
                id={ids.death}
                type="date"
                className={`${ui.input} ${ui.date}`}
                aria-describedby={ids.deathHint}
                aria-invalid={!dateIsValid(input.deathDate)}
                value={input.deathDate}
                onChange={(event) => set('deathDate', event.target.value)}
              />
            </div>
          </fieldset>

          <fieldset className={ui.group}>
            <legend className={ui.legend}>בני המשפחה</legend>
            <div className={ui.field}>
              <label htmlFor={ids.family} className={ui.label}>
                שורה לכל קרוב (לא חובה)
              </label>
              <p id={ids.familyHint} className={ui.hint}>
                למשל: אהוב רחל, אביהם של דנה ואורי, סבא של נועה.
              </p>
              <textarea
                id={ids.family}
                className={`${ui.input} ${ui.textarea}`}
                aria-describedby={ids.familyHint}
                value={input.family}
                onChange={(event) => set('family', event.target.value)}
              />
            </div>
          </fieldset>

          <fieldset className={ui.group}>
            <legend className={ui.legend}>ההלוויה</legend>
            <div className={styles.pair}>
              <div className={ui.field}>
                <label htmlFor={ids.funeralDate} className={ui.label}>
                  תאריך
                </label>
                <input
                  id={ids.funeralDate}
                  type="date"
                  className={`${ui.input} ${ui.date}`}
                  aria-invalid={!dateIsValid(input.funeralDate)}
                  value={input.funeralDate}
                  onChange={(event) => set('funeralDate', event.target.value)}
                />
              </div>
              <div className={ui.field}>
                <label htmlFor={ids.funeralTime} className={ui.label}>
                  שעה
                </label>
                <input
                  id={ids.funeralTime}
                  type="time"
                  className={`${ui.input} ${ui.date}`}
                  value={input.funeralTime}
                  onChange={(event) => set('funeralTime', event.target.value)}
                />
              </div>
            </div>
            <TextField
              id={ids.funeralPlace}
              label="מקום"
              value={input.funeralPlace}
              onChange={(next) => set('funeralPlace', next)}
            />
          </fieldset>

          <fieldset className={ui.group}>
            <legend className={ui.legend}>השבעה</legend>
            <TextField
              id={ids.shivaAddress}
              label="כתובת"
              value={input.shivaAddress}
              onChange={(next) => set('shivaAddress', next)}
            />
            <TextField
              id={ids.shivaHours}
              label="שעות ניחום"
              value={input.shivaHours}
              onChange={(next) => set('shivaHours', next)}
            />
            <TextField
              id={ids.shivaNote}
              label="הערה (לא חובה)"
              value={input.shivaNote}
              onChange={(next) => set('shivaNote', next)}
            />
            <TextField
              id={ids.signature}
              label="חתימה"
              value={input.signature}
              onChange={(next) => set('signature', next)}
            />
          </fieldset>
        </form>

        <div className={ui.output}>
          <h2 className={ui.outputTitle}>הנוסח</h2>
          {!ready ? <p className={ui.note}>כתבו את שם הנפטר כדי לקבל נוסח מוכן.</p> : null}
          {ready ? (
            <ul className={styles.cards}>
              {outputs.map((output) => (
                <li key={output.id} className={styles.card}>
                  <h3 className={styles.cardTitle}>{output.title}</h3>
                  <p className={styles.text}>{texts[output.id]}</p>
                  <div className={ui.actions}>
                    <button type="button" className={ui.primary} onClick={() => copy(output.id)}>
                      העתקה<span className={styles.srOnly}> של {output.title}</span>
                    </button>
                    {output.id === 'whatsapp' ? (
                      <a
                        href={buildWhatsAppLink('', texts.whatsapp)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`${ui.secondary} ${styles.linkButton}`}
                      >
                        שליחה בוואטסאפ<span className={styles.srOnly}> (נפתח בחלון חדש)</span>
                      </a>
                    ) : null}
                  </div>
                  <p className={ui.status} role="status" aria-live="polite">
                    {status?.target === output.id ? status.text : ''}
                  </p>
                </li>
              ))}
              <li className={styles.card}>
                <h3 className={styles.cardTitle}>הדפסה</h3>
                <RadioTiles<PrintSize>
                  legend="גודל דף"
                  name={sizeName}
                  options={printSizes}
                  value={size}
                  onChange={setSize}
                />
                <div className={ui.actions}>
                  <button type="button" className={ui.primary} onClick={print}>
                    הדפסה או שמירה כ-PDF
                  </button>
                </div>
                <p className={ui.status} role="status" aria-live="polite">
                  {printMessage}
                </p>
              </li>
            </ul>
          ) : null}
          <p className={ui.note}>הנוסח נוצר בדפדפן שלכם. השמות והפרטים לא נשלחים לשום מקום.</p>
        </div>
      </div>
    </section>
  )
}
