'use client'

import { useEffect, useId, useState } from 'react'
import Image from 'next/image'
import QRCode from 'qrcode'
import { Copy, Download, ExternalLink, MessageCircle, Smartphone } from 'lucide-react'
import {
  PLACE_ID_FINDER_URL,
  REVIEW_POLICY_URL,
  messageTemplates,
  parseReviewInput,
  smsUrl,
  whatsappShareUrl,
} from '@/lib/google-review-link'
import ui from './toolUi.module.css'
import styles from './GoogleReviewLinkGenerator.module.css'

type Area = 'link' | 'qr' | 'message'
type Status = { area: Area; text: string } | null
type QrImage = { link: string; png: string }

const QR_OPTIONS = { errorCorrectionLevel: 'M', margin: 2 } as const
const QR_FILE_NAME = 'google-review-qr'
const COPY_FAILED = 'ההעתקה נכשלה. סמנו את הטקסט והעתיקו ידנית.'

const track = (format: string) => window.gtag?.('event', 'google_review_link', { format })

function saveFile(href: string, fileName: string) {
  const anchor = document.createElement('a')
  anchor.href = href
  anchor.download = fileName
  anchor.click()
}

function StatusLine({ area, status }: { area: Area; status: Status }) {
  return (
    <p className={ui.status} role="status" aria-live="polite">
      {status?.area === area ? status.text : ''}
    </p>
  )
}

export default function GoogleReviewLinkGenerator() {
  const inputId = useId()
  const inputHintId = useId()
  const feedbackId = useId()
  const businessId = useId()
  const templateName = useId()
  const [raw, setRaw] = useState('')
  const [touched, setTouched] = useState(false)
  const [business, setBusiness] = useState('')
  const [templateId, setTemplateId] = useState(messageTemplates[0].id)
  const [status, setStatus] = useState<Status>(null)
  const [qr, setQr] = useState<QrImage | null>(null)

  const input = parseReviewInput(raw)
  const link = input.status === 'ready' ? input.link : ''
  const template = messageTemplates.find((item) => item.id === templateId) ?? messageTemplates[0]
  const message = link ? template.build(business, link) : ''
  const showError = input.status === 'invalid' && (touched || raw.trim().length > 40)
  const qrPng = qr !== null && qr.link === link ? qr.png : null
  const qrFailed = qrPng === ''

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

  const copy = async (area: Area, value: string, format: string, done: string) => {
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
      setStatus({ area: 'qr', text: 'לא הצלחנו ליצור את הקובץ. נסו שוב.' })
    }
  }

  const describedBy = [inputHintId, showError ? feedbackId : ''].filter(Boolean).join(' ')

  return (
    <section className={ui.tool} aria-label="יצירת קישור לביקורת בגוגל וקוד QR">
      <div className={ui.inner}>
        <form className={ui.form} onSubmit={(event) => event.preventDefault()}>
          <fieldset className={ui.group}>
            <legend className={ui.legend}>העסק</legend>
            <div className={ui.field}>
              <label htmlFor={inputId} className={ui.label}>
                Place ID של העסק
              </label>
              <p id={inputHintId} className={ui.hint}>
                מזהה שמתחיל בדרך כלל ב-ChIJ. אפשר להדביק גם קישור שמכיל אותו בפרמטר placeid.
              </p>
              <input
                id={inputId}
                type="text"
                inputMode="url"
                autoComplete="off"
                spellCheck={false}
                className={`${ui.input} ${ui.ltr} ${showError ? styles.invalid : ''}`}
                aria-invalid={showError}
                aria-describedby={describedBy}
                placeholder="ChIJ..."
                value={raw}
                onChange={(event) => {
                  setRaw(event.target.value)
                  setStatus(null)
                }}
                onBlur={() => setTouched(true)}
              />
              <p id={feedbackId} className={styles.error} aria-live="polite">
                {showError && input.status === 'invalid' ? input.error : ''}
              </p>
              <p className={styles.notice} aria-live="polite">
                {input.status === 'ready' ? input.note : ''}
              </p>
            </div>
            <div className={styles.finder}>
              <p className={styles.finderTitle}>איך מוצאים את ה-Place ID</p>
              <ol className={styles.steps}>
                <li>
                  פותחים את{' '}
                  <a href={PLACE_ID_FINDER_URL} target="_blank" rel="noopener">
                    כלי איתור ה-Place ID של גוגל
                    <ExternalLink aria-hidden="true" />
                  </a>
                  .
                </li>
                <li>מקלידים בשדה החיפוש של הכלי את שם העסק, כפי שהוא מופיע בגוגל מפות.</li>
                <li>בוחרים את העסק מהתוצאות, ומעתיקים את ה-Place ID שהכלי מציג.</li>
                <li>מדביקים אותו בשדה למעלה.</li>
              </ol>
              <p className={ui.hint}>
                קישור מקוצר מסוג maps.app.goo.gl וקישור רגיל של גוגל מפות לא מכילים Place ID שאפשר לקרוא בדפדפן.
              </p>
            </div>
          </fieldset>

          <fieldset className={ui.group}>
            <legend className={ui.legend}>הודעה ללקוחות</legend>
            <div className={ui.field}>
              <label htmlFor={businessId} className={ui.label}>
                שם העסק בהודעה
              </label>
              <input
                id={businessId}
                type="text"
                autoComplete="organization"
                className={ui.input}
                value={business}
                onChange={(event) => {
                  setBusiness(event.target.value)
                  setStatus(null)
                }}
              />
            </div>
            <fieldset className={ui.group}>
              <legend className={ui.legend}>נוסח</legend>
              <div className={ui.options}>
                {messageTemplates.map((item) => (
                  <label key={item.id} className={ui.option}>
                    <input
                      type="radio"
                      name={templateName}
                      className={ui.checkbox}
                      checked={templateId === item.id}
                      onChange={() => {
                        setTemplateId(item.id)
                        setStatus(null)
                      }}
                    />
                    <span>{item.label}</span>
                  </label>
                ))}
              </div>
            </fieldset>
          </fieldset>

          <aside className={styles.policy}>
            <p className={styles.policyTitle}>מה אסור לעשות</p>
            <p>
              מדיניות גוגל אוסרת להציע הטבה תמורת ביקורת, כמו הנחה, מתנה או תשלום, ולבקש לשנות או למחוק ביקורת שלילית
              בתמורה להטבה. אסור גם להרתיע מביקורות שליליות או לבקש ביקורת רק מלקוחות מרוצים. לכן ההודעות כאן פונות לכל
              לקוח באותו נוסח, בלי הבטחה ובלי סינון.{' '}
              <a href={REVIEW_POLICY_URL} target="_blank" rel="noopener">
                מדיניות התוכן של גוגל במפות
              </a>
              .
            </p>
          </aside>
        </form>

        <div className={ui.output}>
          <div className={ui.sticky}>
            <h2 className={ui.outputTitle}>התוצאה</h2>
            {!link ? (
              <p className={styles.empty}>הדביקו Place ID ותראו כאן קישור לביקורת, קוד QR והודעה מוכנה ללקוחות.</p>
            ) : (
              <>
                <h3 className={styles.sectionTitle}>הקישור</h3>
                <p className={styles.linkBox} dir="ltr">
                  {link}
                </p>
                <div className={ui.actions}>
                  <button
                    type="button"
                    className={ui.primary}
                    onClick={() => copy('link', link, 'link_copy', 'הקישור הועתק')}
                  >
                    <Copy aria-hidden="true" />
                    העתקת הקישור
                  </button>
                  <a className={ui.secondary} href={link} target="_blank" rel="noopener">
                    <ExternalLink aria-hidden="true" />
                    בדיקת הקישור
                  </a>
                </div>
                <StatusLine area="link" status={status} />

                <h3 className={styles.sectionTitle}>קוד QR</h3>
                {qrPng ? (
                  <Image
                    className={styles.qr}
                    src={qrPng}
                    width={220}
                    height={220}
                    unoptimized
                    alt="קוד QR שפותח את דף כתיבת הביקורת בגוגל"
                  />
                ) : (
                  <p className={styles.empty}>{qrFailed ? 'לא הצלחנו ליצור את הקוד.' : 'יוצרים את הקוד...'}</p>
                )}
                <div className={ui.actions}>
                  <button type="button" className={`${ui.secondary} ${styles.button}`} onClick={downloadPng} disabled={!qrPng}>
                    <Download aria-hidden="true" />
                    הורדת PNG
                  </button>
                  <button type="button" className={`${ui.secondary} ${styles.button}`} onClick={downloadSvg} disabled={qrFailed}>
                    <Download aria-hidden="true" />
                    הורדת SVG
                  </button>
                </div>
                <StatusLine area="qr" status={status} />

                <h3 className={styles.sectionTitle}>הודעה ללקוח</h3>
                <p className={styles.message}>{message}</p>
                <div className={ui.actions}>
                  <button
                    type="button"
                    className={ui.primary}
                    onClick={() => copy('message', message, 'message_copy', 'ההודעה הועתקה')}
                  >
                    <Copy aria-hidden="true" />
                    העתקת ההודעה
                  </button>
                  <a
                    className={ui.secondary}
                    href={whatsappShareUrl(message)}
                    target="_blank"
                    rel="noopener"
                    onClick={() => track('whatsapp_open')}
                  >
                    <MessageCircle aria-hidden="true" />
                    שליחה בוואטסאפ
                  </a>
                  <a className={ui.secondary} href={smsUrl(message)} onClick={() => track('sms_open')}>
                    <Smartphone aria-hidden="true" />
                    שליחה ב-SMS
                  </a>
                </div>
                <StatusLine area="message" status={status} />
              </>
            )}
            <p className={ui.note}>
              הכלי רץ בדפדפן שלכם, ושום דבר מהמזהה או מההודעה לא נשלח לשרת. הקישור בנוי בפורמט הנפוץ של גוגל
              לדף כתיבת ביקורת. מומלץ לפתוח אותו בבדיקה לפני שמדפיסים את הקוד.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
