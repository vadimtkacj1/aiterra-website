'use client'

import { useId, useState } from 'react'
import { buildWhatsAppLink } from '@/lib/whatsapp-link'
import {
  VARIANT_COUNT,
  buildPlain,
  buildPrintHtml,
  buildWhatsApp,
  dateIsValid,
  defaultHebrewDate,
  emptyInput,
  events,
  hasNames,
  labelsFor,
  printSizes,
  tones,
  type EventId,
  type InvitationInput,
  type PrintSize,
  type ToneId,
} from '@/lib/wedding-invitation-text'
import { Check, RadioTiles, TextField } from './ToolFields'
import ui from './toolUi.module.css'
import styles from './ToolFields.module.css'

type OutputId = 'plain' | 'whatsapp'
type Status = { target: OutputId; text: string } | null

const COPY_FAILED = 'ההעתקה נכשלה. סמנו את הטקסט והעתיקו ידנית.'
const PRINT_BLOCKED = 'הדפדפן חסם את חלון ההדפסה. אפשרו חלונות קופצים לאתר ונסו שוב.'

const variantOptions = Array.from({ length: VARIANT_COUNT }, (_, index) => ({
  id: String(index),
  label: `ניסוח ${index + 1}`,
}))

export default function WeddingInvitationText() {
  const names = {
    event: useId(),
    tone: useId(),
    variant: useId(),
    size: useId(),
  }
  const ids = {
    groom: useId(),
    bride: useId(),
    groomParents: useId(),
    brideParents: useId(),
    date: useId(),
    hebrew: useId(),
    reception: useId(),
    ceremony: useId(),
    venue: useId(),
    address: useId(),
    rsvp: useId(),
    note: useId(),
    signature: useId(),
  }

  const [input, setInput] = useState<InvitationInput>(emptyInput)
  const [size, setSize] = useState<PrintSize>('A4')
  const [status, setStatus] = useState<Status>(null)
  const [printMessage, setPrintMessage] = useState('')

  const set = <K extends keyof InvitationInput>(key: K, value: InvitationInput[K]) => {
    setInput((current) => ({ ...current, [key]: value }))
    setStatus(null)
    setPrintMessage('')
  }

  const setTone = (tone: ToneId) => {
    setInput((current) => ({ ...current, tone, hebrewDate: defaultHebrewDate(tone) }))
    setStatus(null)
  }

  const labels = labelsFor(input.event)
  const isWedding = input.event === 'wedding'
  const ready = hasNames(input)
  const texts: Record<OutputId, string> = { plain: buildPlain(input), whatsapp: buildWhatsApp(input) }

  const copy = async (target: OutputId) => {
    try {
      await navigator.clipboard.writeText(texts[target])
      setStatus({ target, text: 'הנוסח הועתק' })
      window.gtag?.('event', 'wedding_invitation_copy', { target, tone: input.tone })
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
    window.gtag?.('event', 'wedding_invitation_print', { size, tone: input.tone })
  }

  return (
    <section className={ui.tool} aria-label="מחולל נוסח הזמנה">
      <div className={ui.inner}>
        <form className={ui.form} onSubmit={(event) => event.preventDefault()}>
          <RadioTiles<EventId>
            legend="סוג האירוע"
            name={names.event}
            options={events}
            value={input.event}
            onChange={(next) => set('event', next)}
          />
          <RadioTiles<ToneId>
            legend="סגנון"
            name={names.tone}
            options={tones}
            value={input.tone}
            onChange={setTone}
          />
          <RadioTiles
            legend="ניסוח"
            name={names.variant}
            options={variantOptions}
            value={String(input.variant)}
            onChange={(next) => set('variant', Number(next))}
          />

          <fieldset className={ui.group}>
            <legend className={ui.legend}>מי חוגג</legend>
            <TextField id={ids.groom} label={labels.first} value={input.groom} onChange={(next) => set('groom', next)} />
            {isWedding ? (
              <TextField id={ids.bride} label={labels.second} value={input.bride} onChange={(next) => set('bride', next)} />
            ) : null}
            <TextField
              id={ids.groomParents}
              label={`${labels.firstParents} (לא חובה)`}
              value={input.groomParents}
              onChange={(next) => set('groomParents', next)}
            />
            {isWedding ? (
              <TextField
                id={ids.brideParents}
                label={`${labels.secondParents} (לא חובה)`}
                value={input.brideParents}
                onChange={(next) => set('brideParents', next)}
              />
            ) : null}
          </fieldset>

          <fieldset className={ui.group}>
            <legend className={ui.legend}>מתי ואיפה</legend>
            <TextField
              id={ids.date}
              type="date"
              label="תאריך"
              hint="התאריך העברי הוא של יום הלוח שבחרתם, כמקובל בהזמנות."
              value={input.date}
              onChange={(next) => set('date', next)}
            />
            {!dateIsValid(input.date) ? <p className={ui.hint}>התאריך לא תקין.</p> : null}
            <div className={ui.options}>
              <Check
                id={ids.hebrew}
                label="להוסיף תאריך עברי"
                checked={input.hebrewDate}
                onChange={(next) => set('hebrewDate', next)}
              />
            </div>
            <div className={styles.pair}>
              <TextField
                id={ids.reception}
                type="time"
                label="קבלת פנים"
                value={input.reception}
                onChange={(next) => set('reception', next)}
              />
              <TextField
                id={ids.ceremony}
                type="time"
                label={labels.ceremony}
                value={input.ceremony}
                onChange={(next) => set('ceremony', next)}
              />
            </div>
            <TextField id={ids.venue} label="שם האולם או המקום" value={input.venue} onChange={(next) => set('venue', next)} />
            <TextField id={ids.address} label="כתובת" value={input.address} onChange={(next) => set('address', next)} />
            <TextField
              id={ids.rsvp}
              label="אישורי הגעה (טלפון או קישור)"
              value={input.rsvp}
              onChange={(next) => set('rsvp', next)}
            />
            <TextField id={ids.note} label="הערה (לא חובה)" value={input.note} onChange={(next) => set('note', next)} />
            <TextField
              id={ids.signature}
              label="חתימה (לא חובה)"
              value={input.signature}
              onChange={(next) => set('signature', next)}
            />
          </fieldset>
        </form>

        <div className={ui.output}>
          <h2 className={ui.outputTitle}>הנוסח</h2>
          {!ready ? (
            <p className={ui.note}>{isWedding ? 'כתבו את שם החתן ואת שם הכלה' : `כתבו את ${labels.first}`} כדי לקבל נוסח מוכן.</p>
          ) : (
            <ul className={styles.cards}>
              <li className={styles.card}>
                <h3 className={styles.cardTitle}>נוסח להעתקה</h3>
                <p className={styles.text}>{texts.plain}</p>
                <div className={ui.actions}>
                  <button type="button" className={ui.primary} onClick={() => copy('plain')}>
                    העתקה<span className={styles.srOnly}> של הנוסח</span>
                  </button>
                </div>
                <p className={ui.status} role="status" aria-live="polite">
                  {status?.target === 'plain' ? status.text : ''}
                </p>
              </li>
              <li className={styles.card}>
                <h3 className={styles.cardTitle}>הודעה לוואטסאפ</h3>
                <p className={styles.text}>{texts.whatsapp}</p>
                <div className={ui.actions}>
                  <button type="button" className={ui.primary} onClick={() => copy('whatsapp')}>
                    העתקה<span className={styles.srOnly}> של ההודעה</span>
                  </button>
                  <a
                    href={buildWhatsAppLink('', texts.whatsapp)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`${ui.secondary} ${styles.linkButton}`}
                  >
                    שליחה בוואטסאפ<span className={styles.srOnly}> (נפתח בחלון חדש)</span>
                  </a>
                </div>
                <p className={ui.status} role="status" aria-live="polite">
                  {status?.target === 'whatsapp' ? status.text : ''}
                </p>
              </li>
              <li className={styles.card}>
                <h3 className={styles.cardTitle}>הדפסה</h3>
                <RadioTiles<PrintSize>
                  legend="גודל דף"
                  name={names.size}
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
          )}
          <p className={ui.note}>הנוסח נוצר בדפדפן שלכם. השמות והפרטים לא נשלחים לשום מקום.</p>
        </div>
      </div>
    </section>
  )
}
