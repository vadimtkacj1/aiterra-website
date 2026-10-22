'use client'

import { useEffect, useId, useState, type ChangeEvent, type ComponentProps, type ReactNode } from 'react'
import {
  ASSET_PATH,
  ASSET_URL,
  PHOTO_SIZE,
  defaultSignatureInput,
  fitLogo,
  isImageUrl,
  isReadableOnWhite,
  isSignatureEmpty,
  logoSizes,
  normalizeHex,
  sampleSignature,
  signatureTemplates,
  signatureToHtml,
  signatureToText,
  socialNames,
  type SignatureImages,
  type SignatureInput,
} from '@/lib/email-signature'
import ui from './toolUi.module.css'
import styles from './EmailSignatureGenerator.module.css'

type TextKey = {
  [K in keyof SignatureInput]: SignatureInput[K] extends string ? K : never
}[keyof SignatureInput]

type CopyFormat = 'rich' | 'html' | 'text'

type Probe =
  | { state: 'empty' | 'invalid' | 'loading' | 'error' }
  | { state: 'ok'; width: number; height: number }

type LoadedImage = { url: string; ok: boolean; width: number; height: number }

type FieldOptions = { ltr?: boolean; hint?: string; attrs?: ComponentProps<'input'> }

type Status = { text: string; problem: boolean }

const NO_STATUS: Status = { text: '', problem: false }

const EMPTY_MESSAGE = 'עוד אין מה להעתיק. מלאו קודם את הפרטים שלכם.'
const FAILED_MESSAGE = 'ההעתקה נכשלה. סמנו את החתימה בתצוגה המקדימה והעתיקו ידנית.'

const copiedMessages: Record<CopyFormat, string> = {
  rich: 'החתימה הועתקה. עכשיו מדביקים אותה בהגדרות החתימה של תוכנת המייל.',
  html: 'קוד ה-HTML הועתק.',
  text: 'גרסת הטקסט הועתקה.',
}

function useImageProbe(rawUrl: string): Probe {
  const url = rawUrl.trim()
  const valid = isImageUrl(url)
  const [loaded, setLoaded] = useState<LoadedImage | null>(null)

  useEffect(() => {
    if (!valid) return
    let active = true
    const timer = window.setTimeout(() => {
      const image = new Image()
      image.onload = () => {
        if (active) setLoaded({ url, ok: true, width: image.naturalWidth, height: image.naturalHeight })
      }
      image.onerror = () => {
        if (active) setLoaded({ url, ok: false, width: 0, height: 0 })
      }
      image.src = url
    }, 400)
    return () => {
      active = false
      window.clearTimeout(timer)
    }
  }, [url, valid])

  if (!url) return { state: 'empty' }
  if (!valid) return { state: 'invalid' }
  if (!loaded || loaded.url !== url) return { state: 'loading' }
  return loaded.ok ? { state: 'ok', width: loaded.width, height: loaded.height } : { state: 'error' }
}

function imageProblem(probe: Probe, square: boolean) {
  if (probe.state === 'invalid') return 'הקישור צריך להתחיל ב-https:// ולהוביל לקובץ התמונה עצמו.'
  if (probe.state === 'error') {
    return 'לא הצלחנו לטעון תמונה מהקישור הזה. בדקו שהוא ציבורי ושהוא מוביל לקובץ התמונה ולא לעמוד.'
  }
  if (square && probe.state === 'ok' && probe.height && Math.abs(probe.width / probe.height - 1) > 0.05) {
    return 'התמונה לא ריבועית, ולכן היא תיראה מעוותת. חתכו אותה לריבוע והעלו שוב.'
  }
  return ''
}

async function writeRichClipboard(html: string, text: string) {
  if (typeof ClipboardItem === 'undefined' || !navigator.clipboard?.write) return false
  try {
    await navigator.clipboard.write([
      new ClipboardItem({
        'text/html': new Blob([html], { type: 'text/html' }),
        'text/plain': new Blob([text], { type: 'text/plain' }),
      }),
    ])
    return true
  } catch {
    return false
  }
}

function copyThroughSelection(html: string) {
  const holder = document.createElement('div')
  holder.innerHTML = html
  holder.setAttribute('aria-hidden', 'true')
  Object.assign(holder.style, { position: 'fixed', top: '0', insetInlineStart: '-10000px', opacity: '0' })
  document.body.appendChild(holder)
  const selection = window.getSelection()
  const range = document.createRange()
  range.selectNodeContents(holder)
  selection?.removeAllRanges()
  selection?.addRange(range)
  let copied = false
  try {
    copied = document.execCommand('copy')
  } catch {
    copied = false
  }
  selection?.removeAllRanges()
  holder.remove()
  return copied
}

async function writePlainClipboard(value: string) {
  try {
    await navigator.clipboard.writeText(value)
    return true
  } catch {
    return false
  }
}

function Field({
  label,
  hint,
  problem,
  children,
}: {
  label: string
  hint?: string
  problem?: string
  children: (id: string, describedBy?: string) => ReactNode
}) {
  const id = useId()
  const hintId = hint ? `${id}-hint` : undefined
  const problemId = problem === undefined ? undefined : `${id}-problem`
  const describedBy = [hintId, problemId].filter(Boolean).join(' ') || undefined
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
      {problemId ? (
        <p id={problemId} className={styles.problem} role="status" aria-live="polite">
          {problem}
        </p>
      ) : null}
    </div>
  )
}

export default function EmailSignatureGenerator() {
  const [input, setInput] = useState<SignatureInput>(defaultSignatureInput)
  const [status, setStatus] = useState<Status>(NO_STATUS)
  const photo = useImageProbe(input.photoUrl)
  const logo = useImageProbe(input.logoUrl)
  const empty = isSignatureEmpty(input)
  const accent = normalizeHex(input.accent)
  const lowContrast = !isReadableOnWhite(accent)

  const images: SignatureImages = {
    photo: photo.state === 'ok' ? { src: input.photoUrl.trim(), width: PHOTO_SIZE, height: PHOTO_SIZE } : undefined,
    logo: logo.state === 'ok' ? { src: input.logoUrl.trim(), ...fitLogo(logo, input.logoSize) } : undefined,
  }
  const preview = empty ? sampleSignature(input) : { input, images }
  const previewHtml = signatureToHtml(preview.input, preview.images, { assetBase: ASSET_PATH, preview: true })

  const update = (change: (current: SignatureInput) => SignatureInput) => {
    setInput(change)
    setStatus(NO_STATUS)
  }

  const setText = (key: TextKey) => (event: ChangeEvent<HTMLInputElement>) =>
    update((current) => ({ ...current, [key]: event.target.value }))

  const setOption = <K extends 'template' | 'direction' | 'logoSize'>(key: K, value: SignatureInput[K]) => () =>
    update((current) => ({ ...current, [key]: value }))

  const copy = async (format: CopyFormat) => {
    if (empty) {
      setStatus({ text: EMPTY_MESSAGE, problem: true })
      return
    }
    const html = signatureToHtml(input, images, { assetBase: ASSET_URL, preview: false })
    const text = signatureToText(input)
    const copied =
      format === 'rich'
        ? (await writeRichClipboard(html, text)) || copyThroughSelection(html)
        : await writePlainClipboard(format === 'html' ? html : text)
    if (!copied) {
      setStatus({ text: FAILED_MESSAGE, problem: true })
      return
    }
    setStatus({ text: copiedMessages[format], problem: false })
    window.gtag?.('event', 'email_signature_copy', { format, template: input.template })
  }

  const textField = (key: TextKey, label: string, { ltr = false, hint, attrs = {} }: FieldOptions = {}) => (
    <Field label={label} hint={hint}>
      {(id, describedBy) => (
        <input
          id={id}
          aria-describedby={describedBy}
          className={ltr ? `${ui.input} ${ui.ltr}` : ui.input}
          spellCheck={ltr ? false : undefined}
          autoCapitalize={ltr ? 'none' : undefined}
          value={input[key]}
          onChange={setText(key)}
          {...attrs}
        />
      )}
    </Field>
  )

  return (
    <section className={ui.tool} aria-label="מחולל חתימה למייל">
      <div className={ui.inner}>
        <form className={ui.form} onSubmit={(event) => event.preventDefault()}>
          <fieldset className={ui.group}>
            <legend className={ui.legend}>עיצוב החתימה</legend>
            <fieldset className={ui.group}>
              <legend className={ui.legend}>תבנית</legend>
              <div className={styles.templates}>
                {signatureTemplates.map((template) => (
                  <label key={template.id} className={styles.templateOption}>
                    <input
                      type="radio"
                      name="signature-template"
                      className={ui.checkbox}
                      checked={input.template === template.id}
                      onChange={setOption('template', template.id)}
                    />
                    <span className={styles.templateText}>
                      <span className={styles.templateName}>{template.label}</span>
                      <span className={styles.templateHint}>{template.description}</span>
                    </span>
                  </label>
                ))}
              </div>
            </fieldset>
            <fieldset className={ui.group}>
              <legend className={ui.legend}>שפת החתימה</legend>
              <div className={styles.inline}>
                <label className={ui.option}>
                  <input
                    type="radio"
                    name="signature-direction"
                    className={ui.checkbox}
                    checked={input.direction === 'rtl'}
                    onChange={setOption('direction', 'rtl')}
                  />
                  <span>עברית, מימין לשמאל</span>
                </label>
                <label className={ui.option}>
                  <input
                    type="radio"
                    name="signature-direction"
                    className={ui.checkbox}
                    checked={input.direction === 'ltr'}
                    onChange={setOption('direction', 'ltr')}
                  />
                  <span>
                    <span lang="en">English</span>, משמאל לימין
                  </span>
                </label>
              </div>
            </fieldset>
            <Field
              label="צבע הדגשה"
              problem={lowContrast ? 'הצבע בהיר מדי לטקסט על רקע לבן, לכן הוא ישמש רק לקו והטקסט יישאר כהה.' : ''}
            >
              {(id, describedBy) => (
                <div className={styles.colorRow}>
                  <input
                    id={id}
                    type="color"
                    aria-describedby={describedBy}
                    className={styles.color}
                    value={accent}
                    onChange={setText('accent')}
                  />
                  <span className={styles.hex}>{accent.toUpperCase()}</span>
                </div>
              )}
            </Field>
          </fieldset>

          <fieldset className={ui.group}>
            <legend className={ui.legend}>הפרטים שלכם</legend>
            <div className={ui.row}>
              {textField('fullName', 'שם מלא', { attrs: { autoComplete: 'name' } })}
              {textField('role', 'תפקיד', { attrs: { autoComplete: 'organization-title' } })}
              {textField('company', 'שם העסק', { attrs: { autoComplete: 'organization' } })}
            </div>
          </fieldset>

          <fieldset className={ui.group}>
            <legend className={ui.legend}>פרטי קשר</legend>
            <div className={styles.pair}>
              {textField('phone', 'טלפון', { ltr: true, attrs: { type: 'tel', autoComplete: 'tel' } })}
              {textField('mobile', 'נייד', { ltr: true, attrs: { type: 'tel' } })}
              {textField('email', 'מייל', { ltr: true, attrs: { type: 'email', autoComplete: 'email' } })}
              {textField('website', 'אתר', {
                ltr: true,
                attrs: { inputMode: 'url', placeholder: 'www.example.co.il' },
              })}
            </div>
            {textField('address', 'כתובת', { attrs: { autoComplete: 'street-address' } })}
          </fieldset>

          <fieldset className={ui.group}>
            <legend className={ui.legend}>תמונה ולוגו</legend>
            <p className={ui.hint}>
              תוכנות מייל טוענות את התמונות מכתובת באינטרנט, ולכן צריך קישור ציבורי לקובץ, למשל מהאתר שלכם. קובץ
              שנמצא רק במחשב שלכם לא יוצג אצל מי שמקבל את המייל.
            </p>
            <Field
              label="קישור לתמונת פרופיל"
              hint="תמונה ריבועית. היא תוצג בגודל 80 על 80 פיקסלים."
              problem={imageProblem(photo, true)}
            >
              {(id, describedBy) => (
                <input
                  id={id}
                  type="url"
                  aria-describedby={describedBy}
                  className={`${ui.input} ${ui.ltr}`}
                  placeholder="https://"
                  spellCheck={false}
                  value={input.photoUrl}
                  onChange={setText('photoUrl')}
                />
              )}
            </Field>
            <Field label="קישור ללוגו" problem={imageProblem(logo, false)}>
              {(id, describedBy) => (
                <input
                  id={id}
                  type="url"
                  aria-describedby={describedBy}
                  className={`${ui.input} ${ui.ltr}`}
                  placeholder="https://"
                  spellCheck={false}
                  value={input.logoUrl}
                  onChange={setText('logoUrl')}
                />
              )}
            </Field>
            {input.logoUrl.trim() ? (
              <fieldset className={ui.group}>
                <legend className={ui.legend}>רוחב הלוגו</legend>
                <div className={styles.inline}>
                  {logoSizes.map((size) => (
                    <label key={size.id} className={ui.option}>
                      <input
                        type="radio"
                        name="signature-logo-size"
                        className={ui.checkbox}
                        checked={input.logoSize === size.id}
                        onChange={setOption('logoSize', size.id)}
                      />
                      <span>
                        {size.label}, {size.width} פיקסלים
                      </span>
                    </label>
                  ))}
                </div>
              </fieldset>
            ) : null}
          </fieldset>

          <fieldset className={ui.group}>
            <legend className={ui.legend}>רשתות חברתיות</legend>
            <p className={ui.hint}>מדביקים קישור לעמוד. באינסטגרם ובטיקטוק אפשר לכתוב גם @ ושם המשתמש.</p>
            <div className={styles.pair}>
              {textField('facebook', socialNames.facebook, { ltr: true, attrs: { inputMode: 'url' } })}
              {textField('instagram', socialNames.instagram, { ltr: true })}
              {textField('linkedin', socialNames.linkedin, { ltr: true, attrs: { inputMode: 'url' } })}
              {textField('tiktok', socialNames.tiktok, { ltr: true })}
              {textField('whatsapp', 'מספר וואטסאפ', {
                ltr: true,
                hint: 'מספר ישראלי יהפוך לקישור wa.me בפורמט בינלאומי.',
                attrs: { type: 'tel', placeholder: '050-0000000' },
              })}
            </div>
          </fieldset>

          <label className={`${ui.option} ${styles.check}`}>
            <input
              type="checkbox"
              className={ui.checkbox}
              checked={input.credit}
              onChange={() => update((current) => ({ ...current, credit: !current.credit }))}
            />
            <span>להוסיף בסוף שורת קרדיט קטנה עם קישור למחולל</span>
          </label>
        </form>

        <div className={ui.output}>
          <div className={ui.sticky}>
            <h2 className={ui.outputTitle}>החתימה שלכם</h2>
            <div
              className={`${ui.paper} ${styles.paper}`}
              role="region"
              aria-label="תצוגה מקדימה של החתימה"
              tabIndex={0}
            >
              {empty ? <p className={styles.sample}>זו דוגמה. מלאו את הפרטים והחתימה תתעדכן כאן.</p> : null}
              <div className={styles.canvas} dir={input.direction} dangerouslySetInnerHTML={{ __html: previewHtml }} />
            </div>
            <div className={ui.actions}>
              <button type="button" className={ui.primary} onClick={() => copy('rich')}>
                העתקת החתימה
              </button>
              <button type="button" className={ui.secondary} onClick={() => copy('html')}>
                העתקת קוד HTML
              </button>
              <button type="button" className={ui.secondary} onClick={() => copy('text')}>
                העתקת טקסט בלבד
              </button>
            </div>
            <p
              className={status.problem ? `${ui.status} ${styles.statusProblem}` : ui.status}
              role="status"
              aria-live="polite"
            >
              {status.text}
            </p>
            <p className={ui.note}>
              הפרטים נשארים בדפדפן שלכם ולא נשלחים אלינו. התמונות נטענות ישירות מהקישורים שהזנתם. באפליקציית
              Mail של האייפון אפשר להגדיר חתימה בטקסט בלבד, ולכן שם משתמשים ב«העתקת טקסט בלבד».
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
