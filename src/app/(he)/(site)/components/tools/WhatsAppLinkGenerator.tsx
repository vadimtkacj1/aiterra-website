'use client'

import { useEffect, useId, useState } from 'react'
import Image from 'next/image'
import QRCode from 'qrcode'
import {
  ASSUMED_ISRAELI_NOTE,
  DEFAULT_BUTTON_LABEL,
  PHONE_ERRORS,
  buildWhatsAppLink,
  buttonSnippet,
  countCharacters,
  normalizePhone,
  type ButtonPlacement,
} from '@/lib/whatsapp-link'
import ui from './toolUi.module.css'
import styles from './WhatsAppLinkGenerator.module.css'

type StatusArea = 'link' | 'qr' | 'button'
type Status = { area: StatusArea; text: string } | null
type QrImage = { link: string; png: string }

const QR_OPTIONS = { errorCorrectionLevel: 'M', margin: 2 } as const
const QR_FILE_NAME = 'whatsapp-qr'
const COPY_FAILED = 'ההעתקה נכשלה. סמנו את הטקסט והעתיקו ידנית.'
const PRIVACY_NOTE = 'המספר וההודעה נשארים בדפדפן שלכם ולא נשלחים לשום מקום.'

const track = (format: string) => window.gtag?.('event', 'whatsapp_link_copy', { format })

const characterLabel = (count: number) => (count === 1 ? 'תו אחד' : `${count} תווים`)

function saveFile(href: string, fileName: string) {
  const anchor = document.createElement('a')
  anchor.href = href
  anchor.download = fileName
  anchor.click()
}

function StatusLine({ area, status }: { area: StatusArea; status: Status }) {
  return (
    <p className={`${ui.status} ${styles.statusLine}`} role="status" aria-live="polite">
      {status?.area === area ? status.text : ''}
    </p>
  )
}

export default function WhatsAppLinkGenerator() {
  const phoneId = useId()
  const phoneHintId = useId()
  const phoneFeedbackId = useId()
  const messageId = useId()
  const messageHintId = useId()
  const messageCountId = useId()
  const labelId = useId()
  const placementName = useId()
  const qrHeadingId = useId()
  const buttonHeadingId = useId()

  const [phone, setPhone] = useState('')
  const [message, setMessage] = useState('')
  const [phoneTouched, setPhoneTouched] = useState(false)
  const [label, setLabel] = useState(DEFAULT_BUTTON_LABEL)
  const [placement, setPlacement] = useState<ButtonPlacement>('inline')
  const [status, setStatus] = useState<Status>(null)
  const [qr, setQr] = useState<QrImage | null>(null)

  const phoneResult = normalizePhone(phone)
  const link = phoneResult.status === 'valid' ? buildWhatsAppLink(phoneResult.digits, message) : ''
  const showError =
    phoneResult.status === 'invalid' && (phoneTouched || phoneResult.error === PHONE_ERRORS.characters)
  const showNote = phoneResult.status === 'valid' && phoneResult.assumedIsraeli
  const snippet = link ? buttonSnippet({ link, label, placement }) : ''
  const qrPng = qr !== null && qr.link === link ? qr.png : null
  const qrTooLong = qrPng === ''

  useEffect(() => {
    if (!link) return
    let cancelled = false
    QRCode.toDataURL(link, { ...QR_OPTIONS, width: 1024 })
      .then((png) => {
        if (!cancelled) setQr({ link, png })
      })
      .catch(() => {
        if (!cancelled) setQr({ link, png: '' })
      })
    return () => {
      cancelled = true
    }
  }, [link])

  const copy = async (area: StatusArea, value: string, format: string, done: string) => {
    try {
      await navigator.clipboard.writeText(value)
      setStatus({ area, text: done })
      track(format)
    } catch {
      setStatus({ area, text: COPY_FAILED })
    }
  }

  const downloadPng = () => {
    if (!qrPng) return
    saveFile(qrPng, `${QR_FILE_NAME}.png`)
    setStatus({ area: 'qr', text: 'קובץ ה-PNG ירד' })
    track('qr_png')
  }

  const downloadSvg = async () => {
    try {
      const svg = await QRCode.toString(link, { ...QR_OPTIONS, type: 'svg' })
      const url = URL.createObjectURL(new Blob([svg], { type: 'image/svg+xml' }))
      saveFile(url, `${QR_FILE_NAME}.svg`)
      URL.revokeObjectURL(url)
      setStatus({ area: 'qr', text: 'קובץ ה-SVG ירד' })
      track('qr_svg')
    } catch {
      setStatus({ area: 'qr', text: 'לא הצלחנו ליצור את הקובץ. נסו לקצר את ההודעה.' })
    }
  }

  const choosePlacement = (next: ButtonPlacement) => {
    setPlacement(next)
    setStatus(null)
  }

  const describedBy = [phoneHintId, showError || showNote ? phoneFeedbackId : ''].filter(Boolean).join(' ')

  return (
    <section className={ui.tool} aria-label="יצירת קישור לוואטסאפ">
      <div className={ui.inner}>
        <form className={ui.form} onSubmit={(event) => event.preventDefault()}>
          <fieldset className={ui.group}>
            <legend className={ui.legend}>המספר וההודעה</legend>
            <div className={ui.field}>
              <label htmlFor={phoneId} className={ui.label}>
                מספר הטלפון בוואטסאפ
              </label>
              <p id={phoneHintId} className={ui.hint}>
                מספר ישראלי, למשל 050-1234567, או מספר מחו״ל עם + וקידומת המדינה.
              </p>
              <input
                id={phoneId}
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                className={`${ui.input} ${ui.ltr} ${showError ? styles.invalid : ''}`}
                aria-invalid={showError}
                aria-describedby={describedBy}
                value={phone}
                onChange={(event) => {
                  setPhone(event.target.value)
                  setStatus(null)
                }}
                onBlur={() => setPhoneTouched(true)}
              />
              <p id={phoneFeedbackId} className={showError ? styles.error : styles.notice} aria-live="polite">
                {showError && phoneResult.status === 'invalid' ? phoneResult.error : ''}
                {showNote ? ASSUMED_ISRAELI_NOTE : ''}
              </p>
            </div>
            <div className={ui.field}>
              <label htmlFor={messageId} className={ui.label}>
                הודעה מוכנה
              </label>
              <p id={messageHintId} className={ui.hint}>
                לא חובה. ההודעה תופיע בשדה הכתיבה של הצ׳אט, והלקוח יכול לשנות אותה לפני השליחה.
              </p>
              <textarea
                id={messageId}
                className={`${ui.input} ${ui.textarea}`}
                aria-describedby={`${messageHintId} ${messageCountId}`}
                value={message}
                onChange={(event) => {
                  setMessage(event.target.value)
                  setStatus(null)
                }}
              />
              <p id={messageCountId} className={ui.hint}>
                {characterLabel(countCharacters(message.trim()))}
              </p>
            </div>
          </fieldset>

          <fieldset className={ui.group}>
            <legend className={ui.legend}>כפתור לאתר</legend>
            <fieldset className={ui.group}>
              <legend className={ui.legend}>איפה הכפתור יופיע</legend>
              <div className={ui.options}>
                <label className={ui.option}>
                  <input
                    type="radio"
                    name={placementName}
                    className={ui.checkbox}
                    checked={placement === 'inline'}
                    onChange={() => choosePlacement('inline')}
                  />
                  <span>בתוך העמוד</span>
                </label>
                <label className={ui.option}>
                  <input
                    type="radio"
                    name={placementName}
                    className={ui.checkbox}
                    checked={placement === 'floating'}
                    onChange={() => choosePlacement('floating')}
                  />
                  <span>צף בפינת המסך</span>
                </label>
              </div>
            </fieldset>
            <div className={ui.field}>
              <label htmlFor={labelId} className={ui.label}>
                הטקסט על הכפתור
              </label>
              <input
                id={labelId}
                className={ui.input}
                value={label}
                onChange={(event) => {
                  setLabel(event.target.value)
                  setStatus(null)
                }}
              />
            </div>
          </fieldset>
        </form>

        <div className={ui.output}>
          <h2 className={ui.outputTitle}>הקישור שלכם</h2>
          {link ? (
            <div className={styles.stack}>
              <div className={styles.card}>
                <p className={styles.link} dir="ltr" lang="en">
                  {link}
                </p>
                <div className={`${ui.actions} ${styles.flush}`}>
                  <button
                    type="button"
                    className={ui.primary}
                    onClick={() => copy('link', link, 'link', 'הקישור הועתק')}
                  >
                    העתקת הקישור
                  </button>
                  <a
                    href={link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`${ui.secondary} ${styles.linkButton}`}
                    onClick={() => track('open')}
                  >
                    פתיחה לבדיקה<span className={styles.srOnly}> (נפתח בחלון חדש)</span>
                  </a>
                </div>
                <StatusLine area="link" status={status} />
              </div>

              <section className={styles.card} aria-labelledby={qrHeadingId}>
                <h3 id={qrHeadingId} className={styles.cardTitle}>
                  קוד QR
                </h3>
                <p className={ui.hint}>לכרטיס ביקור, לתפריט, לשלט בקופה או לחלון הראווה.</p>
                {qrPng ? (
                  <Image
                    src={qrPng}
                    alt="קוד QR שפותח את הקישור לוואטסאפ"
                    width={200}
                    height={200}
                    unoptimized
                    className={styles.qr}
                  />
                ) : (
                  <div className={styles.qrPlaceholder}>
                    {qrTooLong ? 'ההודעה ארוכה מדי לקוד QR. קצרו אותה כדי לקבל קוד.' : ''}
                  </div>
                )}
                {qrPng ? (
                  <div className={`${ui.actions} ${styles.flush}`}>
                    <button type="button" className={ui.secondary} onClick={downloadPng}>
                      הורדת PNG
                    </button>
                    <button type="button" className={ui.secondary} onClick={downloadSvg}>
                      הורדת SVG
                    </button>
                  </div>
                ) : null}
                <StatusLine area="qr" status={status} />
              </section>

              <section className={styles.card} aria-labelledby={buttonHeadingId}>
                <h3 id={buttonHeadingId} className={styles.cardTitle}>
                  {placement === 'floating' ? 'קוד לכפתור צף' : 'קוד לכפתור בתוך העמוד'}
                </h3>
                <pre className={styles.code} dir="ltr">
                  <code>{snippet}</code>
                </pre>
                <p className={ui.hint}>
                  {placement === 'floating'
                    ? 'מדביקים פעם אחת ברכיב HTML שמופיע בכל העמודים, למשל בתחתית האתר. באתר בעברית הכפתור יופיע בפינה השמאלית התחתונה, ובאתר באנגלית בפינה הימנית.'
                    : 'מדביקים ברכיב HTML בעורך האתר, במקום שבו הכפתור צריך להופיע.'}
                </p>
                <div className={`${ui.actions} ${styles.flush}`}>
                  <button
                    type="button"
                    className={ui.primary}
                    onClick={() => copy('button', snippet, `html_${placement}`, 'קוד הכפתור הועתק')}
                  >
                    העתקת קוד הכפתור
                  </button>
                </div>
                <StatusLine area="button" status={status} />
              </section>
              <p className={`${ui.note} ${styles.flush}`}>{PRIVACY_NOTE}</p>
            </div>
          ) : (
            <div className={`${styles.card} ${styles.empty}`}>
              <p>הקלידו מספר טלפון, והקישור, קוד ה-QR והקוד לכפתור יופיעו כאן.</p>
              <p className={`${ui.note} ${styles.flush}`}>{PRIVACY_NOTE}</p>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
