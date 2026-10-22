'use client'

import {
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type ComponentType,
  type InputHTMLAttributes,
  type ReactNode,
} from 'react'
import QRCode from 'qrcode'
import { ClipboardCopy, ContactRound, Download, Link, MessageCircle, Star, Trash2, Type, Wifi } from 'lucide-react'
import {
  LOGO_LEVEL,
  LOGO_TYPES,
  MAX_LOGO_BYTES,
  buildPayload,
  colorProblem,
  createSymbol,
  defaultFields,
  defaultSettings,
  fileName,
  isDense,
  isQrType,
  levelOptions,
  logoBox,
  marginOptions,
  qrTypes,
  restoreFields,
  restoreSettings,
  sizeOptions,
  svgWithLogo,
  wifiSecurityOptions,
  type QrFields,
  type QrSettings,
  type QrType,
} from '@/lib/qr-code'
import ui from './toolUi.module.css'
import styles from './QrCodeGenerator.module.css'

type TextKey = {
  [K in keyof QrFields]: QrFields[K] extends string ? K : never
}[keyof QrFields]

type Logo = { src: string; image: HTMLImageElement }
type Draft = { type: QrType; fields: QrFields; settings: QrSettings }

const STORAGE_KEY = 'aiterra-qr-code-v1'
const PREVIEW_SIZE = 640

const typeIcons: Record<QrType, ComponentType<{ className?: string; 'aria-hidden'?: boolean | 'true' }>> = {
  url: Link,
  whatsapp: MessageCircle,
  review: Star,
  wifi: Wifi,
  vcard: ContactRound,
  text: Type,
}

const contentLegend: Record<QrType, string> = {
  url: 'הקישור',
  whatsapp: 'המספר וההודעה',
  review: 'הקישור לביקורת',
  wifi: 'פרטי הרשת',
  vcard: 'הפרטים בכרטיס',
  text: 'הטקסט',
}

const emptyPrompt: Record<QrType, string> = {
  url: 'הקלידו כתובת, והקוד יופיע כאן.',
  whatsapp: 'הקלידו מספר טלפון, והקוד יופיע כאן.',
  review: 'הדביקו את הקישור לביקורת, והקוד יופיע כאן.',
  wifi: 'הקלידו את שם הרשת, והקוד יופיע כאן.',
  vcard: 'מלאו את הפרטים, והקוד יופיע כאן.',
  text: 'כתבו טקסט, והקוד יופיע כאן.',
}

const colorMessages = {
  inverted: 'צבע הקוד בהיר מצבע הרקע. כדי שהקוד ייסרק בקלות, הקוד צריך להיות כהה והרקע בהיר.',
  low: 'אין מספיק הבדל בין צבע הקוד לצבע הרקע, וייתכן שהטלפון לא יזהה את הקוד. בחרו קוד כהה יותר או רקע בהיר יותר.',
}

function readDraft(): Partial<Draft> | null {
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY)
    return saved ? (JSON.parse(saved) as Partial<Draft>) : null
  } catch {
    return null
  }
}

function writeDraft(draft: Draft) {
  try {
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ ...draft, fields: { ...draft.fields, wifiPassword: '' } }),
    )
    return true
  } catch {
    return false
  }
}

function drawLogo(canvas: HTMLCanvasElement, modules: number, settings: QrSettings, logo: HTMLImageElement) {
  const context = canvas.getContext('2d')
  if (!context) return
  const { plate, image } = logoBox(canvas.width, modules, settings.margin)
  context.fillStyle = settings.light
  context.beginPath()
  if (typeof context.roundRect === 'function') {
    context.roundRect(plate.x, plate.y, plate.side, plate.side, plate.radius)
  } else {
    context.rect(plate.x, plate.y, plate.side, plate.side)
  }
  context.fill()
  const ratio = (logo.naturalWidth || 1) / (logo.naturalHeight || 1)
  const width = ratio >= 1 ? image.side : image.side * ratio
  const height = ratio >= 1 ? image.side / ratio : image.side
  context.drawImage(logo, image.x + (image.side - width) / 2, image.y + (image.side - height) / 2, width, height)
}

async function renderCode(
  value: string,
  settings: QrSettings,
  width: number,
  modules: number,
  logo: HTMLImageElement | null,
) {
  const canvas = document.createElement('canvas')
  await QRCode.toCanvas(canvas, value, {
    errorCorrectionLevel: settings.level,
    margin: settings.margin,
    width,
    color: { dark: settings.dark, light: settings.light },
  })
  if (logo) drawLogo(canvas, modules, settings, logo)
  return canvas
}

function canvasBlob(canvas: HTMLCanvasElement) {
  return new Promise<Blob>((resolve, reject) =>
    canvas.toBlob((blob) => (blob ? resolve(blob) : reject(new Error('empty'))), 'image/png'),
  )
}

function saveBlob(blob: Blob, name: string) {
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = name
  anchor.click()
  window.setTimeout(() => URL.revokeObjectURL(url), 1000)
}

function readLogo(file: File) {
  return new Promise<{ src: string; image: HTMLImageElement }>((resolve, reject) => {
    const reader = new FileReader()
    reader.onerror = () => reject(new Error('read'))
    reader.onload = () => {
      const src = typeof reader.result === 'string' ? reader.result : ''
      const image = new Image()
      image.onload = () => resolve({ src, image })
      image.onerror = () => reject(new Error('decode'))
      image.src = src
    }
    reader.readAsDataURL(file)
  })
}

function Field({
  label,
  hint,
  error,
  notice,
  children,
}: {
  label: string
  hint?: string
  error?: string
  notice?: string
  children: (id: string, describedBy: string | undefined, invalid: boolean) => ReactNode
}) {
  const id = useId()
  const hintId = `${id}-hint`
  const messageId = `${id}-message`
  const message = error || notice
  const describedBy = [hint ? hintId : '', message ? messageId : ''].filter(Boolean).join(' ') || undefined
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
      {children(id, describedBy, Boolean(error))}
      {message ? (
        <p id={messageId} className={error ? styles.error : styles.notice}>
          {message}
        </p>
      ) : null}
    </div>
  )
}

function Optional({ title, children }: { title: string; children: ReactNode }) {
  return (
    <details className={`${ui.group} ${styles.optional}`}>
      <summary className={`${ui.legend} ${styles.optionalSummary}`}>
        <span>{title}</span>
        <span className={styles.optionalTag}>לא חובה</span>
      </summary>
      <fieldset className={styles.optionalBody} aria-label={title}>
        {children}
      </fieldset>
    </details>
  )
}

function Choices<T extends string | number>({
  legend,
  hint,
  name,
  options,
  value,
  onChange,
  columns,
}: {
  legend: string
  hint?: string
  name: string
  options: { value: T; label: string }[]
  value: T
  onChange: (value: T) => void
  columns: 3 | 4
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
      <div className={`${ui.options} ${styles.grid}`} data-columns={columns}>
        {options.map((option) => (
          <label key={String(option.value)} className={ui.option}>
            <input
              type="radio"
              name={name}
              className={ui.checkbox}
              checked={value === option.value}
              onChange={() => onChange(option.value)}
            />
            <span>{option.label}</span>
          </label>
        ))}
      </div>
    </fieldset>
  )
}

export default function QrCodeGenerator() {
  const [type, setType] = useState<QrType>('url')
  const [fields, setFields] = useState<QrFields>(defaultFields)
  const [settings, setSettings] = useState<QrSettings>(defaultSettings)
  const [logo, setLogo] = useState<Logo | null>(null)
  const [logoError, setLogoError] = useState('')
  const [touched, setTouched] = useState<Partial<Record<keyof QrFields, boolean>>>({})
  const [status, setStatus] = useState('')
  const [canCopyImage, setCanCopyImage] = useState(false)
  const [restored, setRestored] = useState(false)
  const previewRef = useRef<HTMLCanvasElement>(null)
  const logoInputRef = useRef<HTMLInputElement>(null)
  const typeName = useId()
  const securityName = useId()
  const sizeName = useId()
  const marginName = useId()
  const levelName = useId()
  const colorMessageId = useId()
  const logoMessageId = useId()

  const payload = useMemo(() => buildPayload(type, fields), [type, fields])
  const value = payload.status === 'valid' ? payload.value : ''
  const symbol = useMemo(() => (value ? createSymbol(value, settings.level) : null), [value, settings.level])
  const modules = symbol?.status === 'ok' ? symbol.modules : 0
  const ready = modules > 0
  const problem = colorProblem(settings.dark, settings.light)
  const logoImage = logo?.image ?? null

  useEffect(() => {
    const saved = readDraft()
    if (saved) {
      if (isQrType(saved.type)) setType(saved.type)
      setFields(restoreFields(saved.fields))
      setSettings(restoreSettings(saved.settings))
    }
    setCanCopyImage(typeof ClipboardItem !== 'undefined' && typeof navigator.clipboard?.write === 'function')
    setRestored(true)
  }, [])

  useEffect(() => {
    if (restored) writeDraft({ type, fields, settings })
  }, [type, fields, settings, restored])

  useEffect(() => {
    if (!ready) return
    let cancelled = false
    renderCode(value, settings, PREVIEW_SIZE, modules, logoImage)
      .then((canvas) => {
        const target = previewRef.current
        if (cancelled || !target) return
        target.width = canvas.width
        target.height = canvas.height
        target.getContext('2d')?.drawImage(canvas, 0, 0)
      })
      .catch(() => undefined)
    return () => {
      cancelled = true
    }
  }, [ready, value, settings, modules, logoImage])

  const update = (patch: Partial<QrFields>) => {
    setFields((current) => ({ ...current, ...patch }))
    setStatus('')
  }

  const setText = (key: TextKey) => (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    update({ [key]: event.target.value })

  const touch = (key: keyof QrFields) => () => setTouched((current) => ({ ...current, [key]: true }))

  const setSetting = <K extends keyof QrSettings>(key: K) => (next: QrSettings[K]) => {
    setSettings((current) => ({ ...current, [key]: next }))
    setStatus('')
  }

  const errorFor = (key: keyof QrFields) =>
    payload.status === 'invalid' && payload.field === key && touched[key] ? payload.error : undefined

  const noticeFor = (key: keyof QrFields) =>
    payload.status === 'valid' && payload.notice?.field === key ? payload.notice.text : undefined

  const chooseType = (next: QrType) => {
    setType(next)
    setStatus('')
  }

  const onLogo = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return
    if (file.size > MAX_LOGO_BYTES) {
      setLogoError('הקובץ גדול מדי. בחרו לוגו עד 3MB.')
      return
    }
    try {
      const { src, image } = await readLogo(file)
      setLogo({ src, image })
      setLogoError('')
      setSettings((current) => ({ ...current, level: LOGO_LEVEL }))
      setStatus('')
    } catch {
      setLogoError('לא הצלחנו לקרוא את הקובץ. נסו קובץ PNG או JPG.')
    }
  }

  const removeLogo = () => {
    setLogo(null)
    setLogoError('')
    if (logoInputRef.current) logoInputRef.current.value = ''
    setStatus('הלוגו הוסר')
  }

  const track = (event: 'qr_code_download' | 'qr_code_copy', format: string) =>
    window.gtag?.('event', event, { format, qr_type: type, logo: Boolean(logo) })

  const downloadPng = async () => {
    if (!ready) return
    try {
      const canvas = await renderCode(value, settings, settings.size, modules, logoImage)
      saveBlob(await canvasBlob(canvas), `${fileName(type)}.png`)
      setStatus(`קובץ ה-PNG ירד, ברוחב ${canvas.width} פיקסלים`)
      track('qr_code_download', 'png')
    } catch {
      setStatus('לא הצלחנו ליצור את הקובץ. נסו שוב.')
    }
  }

  const downloadSvg = async () => {
    if (!ready) return
    try {
      const svg = await QRCode.toString(value, {
        type: 'svg',
        errorCorrectionLevel: settings.level,
        margin: settings.margin,
        width: settings.size,
        color: { dark: settings.dark, light: settings.light },
      })
      const output = logo
        ? svgWithLogo(svg, { logo: logo.src, background: settings.light, modules, margin: settings.margin })
        : svg
      saveBlob(new Blob([output], { type: 'image/svg+xml;charset=utf-8' }), `${fileName(type)}.svg`)
      setStatus('קובץ ה-SVG ירד')
      track('qr_code_download', 'svg')
    } catch {
      setStatus('לא הצלחנו ליצור את הקובץ. נסו שוב.')
    }
  }

  const copyImage = async () => {
    if (!ready) return
    try {
      const blob = renderCode(value, settings, settings.size, modules, logoImage).then(canvasBlob)
      await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })])
      setStatus('התמונה הועתקה. אפשר להדביק אותה במסמך, במייל או בהודעה.')
      track('qr_code_copy', 'png')
    } catch {
      setStatus('ההעתקה לא עבדה בדפדפן הזה. הורידו את קובץ ה-PNG במקום.')
    }
  }

  const reset = () => {
    setType('url')
    setFields(defaultFields)
    setSettings(defaultSettings)
    setTouched({})
    removeLogo()
    setStatus('הטופס אופס')
  }

  const textInput = (
    key: TextKey,
    label: string,
    options: {
      hint?: string
      ltr?: boolean
      attrs?: InputHTMLAttributes<HTMLInputElement>
    } = {},
  ) => (
    <Field label={label} hint={options.hint} error={errorFor(key)} notice={noticeFor(key)}>
      {(id, describedBy, invalid) => (
        <input
          id={id}
          className={`${ui.input} ${options.ltr ? ui.ltr : ''} ${invalid ? styles.invalid : ''}`}
          aria-describedby={describedBy}
          aria-invalid={invalid || undefined}
          value={fields[key] as string}
          onChange={setText(key)}
          onBlur={touch(key)}
          {...options.attrs}
        />
      )}
    </Field>
  )

  const textArea = (key: TextKey, label: string, hint?: string) => (
    <Field label={label} hint={hint}>
      {(id, describedBy) => (
        <textarea
          id={id}
          aria-describedby={describedBy}
          className={`${ui.input} ${ui.textarea}`}
          value={fields[key] as string}
          onChange={setText(key)}
        />
      )}
    </Field>
  )

  const plainField = { autoCapitalize: 'off', autoCorrect: 'off', spellCheck: false } as const

  const placeholder =
    symbol?.status === 'too-long'
      ? 'התוכן ארוך מדי לקוד QR. קצרו אותו או בחרו רמת תיקון שגיאות נמוכה יותר.'
      : payload.status === 'invalid'
        ? payload.error
        : emptyPrompt[type]

  const summary = payload.status === 'valid' ? payload.summary : null
  const previewLabel = summary ? `קוד QR. ${summary.text} ${summary.detail ?? ''}`.trim() : ''

  return (
    <section className={ui.tool} aria-label="יצירת קוד QR">
      <div className={ui.inner}>
        <form className={ui.form} onSubmit={(event) => event.preventDefault()}>
          <fieldset className={ui.group}>
            <legend className={ui.legend}>מה הקוד יפתח</legend>
            <div className={styles.types}>
              {qrTypes.map((item) => {
                const Icon = typeIcons[item.id]
                return (
                  <label key={item.id} className={styles.type}>
                    <input
                      type="radio"
                      name={typeName}
                      className={styles.typeInput}
                      checked={type === item.id}
                      onChange={() => chooseType(item.id)}
                    />
                    <Icon className={styles.typeIcon} aria-hidden="true" />
                    <span>{item.label}</span>
                  </label>
                )
              })}
            </div>
          </fieldset>

          <fieldset className={ui.group}>
            <legend className={ui.legend}>{contentLegend[type]}</legend>

            {type === 'url'
              ? textInput('url', 'כתובת האתר או העמוד', {
                  ltr: true,
                  attrs: { inputMode: 'url', placeholder: 'www.example.co.il', ...plainField },
                })
              : null}

            {type === 'whatsapp' ? (
              <>
                {textInput('waPhone', 'מספר הטלפון בוואטסאפ', {
                  hint: 'מספר ישראלי, למשל 050-1234567, או מספר מחו״ל עם + וקידומת המדינה.',
                  ltr: true,
                  attrs: { type: 'tel', inputMode: 'tel', autoComplete: 'tel' },
                })}
                {textArea(
                  'waMessage',
                  'הודעה מוכנה',
                  'לא חובה. ההודעה תופיע בשדה הכתיבה של הצ׳אט, והלקוח יכול לשנות אותה. הודעה ארוכה בעברית הופכת את הקוד לצפוף יותר.',
                )}
              </>
            ) : null}

            {type === 'review'
              ? textInput('review', 'הקישור לטופס הביקורת', {
                  hint: 'במחשב, בפרופיל העסק בגוגל, לוחצים על ״קריאת הביקורות״ ואז על ״רוצה לקבל עוד ביקורות?״. מעתיקים את הקישור ומדביקים אותו כאן.',
                  ltr: true,
                  attrs: { inputMode: 'url', ...plainField },
                })
              : null}

            {type === 'wifi' ? (
              <>
                {textInput('wifiSsid', 'שם הרשת', {
                  hint: 'בדיוק כמו שהוא מופיע בטלפון ברשימת הרשתות, כולל אותיות גדולות וקטנות.',
                  attrs: { ...plainField, autoComplete: 'off', dir: 'auto' },
                })}
                <Choices
                  legend="סוג האבטחה"
                  name={securityName}
                  options={wifiSecurityOptions.map((option) => ({ value: option.id, label: option.label }))}
                  value={fields.wifiSecurity}
                  onChange={(next) => update({ wifiSecurity: next })}
                  columns={3}
                />
                {fields.wifiSecurity !== 'nopass'
                  ? textInput('wifiPassword', 'הסיסמה', {
                      hint: 'הסיסמה נשמרת בתוך הקוד, וכל מי שסורק אותו יכול לראות אותה.',
                      ltr: true,
                      attrs: { ...plainField, autoComplete: 'off' },
                    })
                  : null}
                <label className={ui.option}>
                  <input
                    type="checkbox"
                    className={ui.checkbox}
                    checked={fields.wifiHidden}
                    onChange={() => update({ wifiHidden: !fields.wifiHidden })}
                  />
                  <span>הרשת מוסתרת ולא מופיעה ברשימת הרשתות</span>
                </label>
              </>
            ) : null}

            {type === 'vcard' ? (
              <>
                <div className={styles.pair}>
                  {textInput('firstName', 'שם פרטי', { attrs: { autoComplete: 'given-name' } })}
                  {textInput('lastName', 'שם משפחה', { attrs: { autoComplete: 'family-name' } })}
                  {textInput('phone', 'טלפון', {
                    ltr: true,
                    attrs: { type: 'tel', inputMode: 'tel', autoComplete: 'tel' },
                  })}
                  {textInput('email', 'מייל', {
                    ltr: true,
                    attrs: { type: 'email', autoComplete: 'email', ...plainField },
                  })}
                  {textInput('company', 'שם העסק', { attrs: { autoComplete: 'organization' } })}
                  {textInput('website', 'אתר', {
                    ltr: true,
                    attrs: { inputMode: 'url', placeholder: 'www.example.co.il', autoComplete: 'url', ...plainField },
                  })}
                </div>
                {textInput('address', 'כתובת', { attrs: { autoComplete: 'street-address' } })}
              </>
            ) : null}

            {type === 'text' ? textArea('text', 'הטקסט שיופיע בסריקה') : null}
          </fieldset>

          <Optional title="צבעים ולוגו">
            <div className={styles.pair}>
              {(
                [
                  ['dark', 'צבע הקוד'],
                  ['light', 'צבע הרקע'],
                ] as const
              ).map(([key, label]) => (
                <Field key={key} label={label}>
                  {(id) => (
                    <div className={styles.colorRow}>
                      <input
                        id={id}
                        type="color"
                        className={styles.color}
                        aria-describedby={problem ? colorMessageId : undefined}
                        value={settings[key]}
                        onChange={(event) => setSetting(key)(event.target.value)}
                      />
                      <span className={styles.hex}>{settings[key].toUpperCase()}</span>
                    </div>
                  )}
                </Field>
              ))}
            </div>
            {problem ? (
              <p id={colorMessageId} className={styles.error}>
                {colorMessages[problem]}
              </p>
            ) : null}

            <div className={ui.field}>
              <label htmlFor={`${logoMessageId}-input`} className={ui.label}>
                לוגו במרכז הקוד
              </label>
              <p id={`${logoMessageId}-hint`} className={ui.hint}>
                PNG, JPG, SVG או WebP, עד 3MB. הקובץ נשאר במחשב שלכם ולא עולה לשום מקום.
              </p>
              <input
                ref={logoInputRef}
                id={`${logoMessageId}-input`}
                type="file"
                accept={LOGO_TYPES}
                className={styles.file}
                aria-describedby={`${logoMessageId}-hint ${logoMessageId}`}
                onChange={onLogo}
              />
              <p id={logoMessageId} className={logoError ? styles.error : styles.notice} aria-live="polite">
                {logoError ||
                  (logo
                    ? settings.level === LOGO_LEVEL
                      ? 'רמת תיקון השגיאות עלתה ל-H, כדי שהקוד ייקרא גם כשהלוגו מכסה את המרכז שלו.'
                      : 'עם לוגו כדאי לבחור רמת תיקון שגיאות H. ברמה נמוכה יותר ייתכן שהקוד לא ייסרק.'
                    : '')}
              </p>
              {logo ? (
                <button type="button" className={styles.remove} onClick={removeLogo}>
                  <Trash2 aria-hidden="true" />
                  הסרת הלוגו
                </button>
              ) : null}
            </div>
          </Optional>

          <Optional title="גודל, שוליים ותיקון שגיאות">
            <Choices
              legend="רוחב קובץ ה-PNG"
              hint="לבית דפוס או לשלט גדול עדיף SVG, שנשאר חד בכל גודל."
              name={sizeName}
              options={sizeOptions.map((size) => ({ value: size, label: `${size} פיקסלים` }))}
              value={settings.size}
              onChange={setSetting('size')}
              columns={3}
            />
            <Choices
              legend="שוליים"
              hint="המסגרת הריקה סביב הקוד. לפי התקן של קוד QR היא ברוחב 4 ריבועים לפחות. שוליים צרים רק אם סביב הקוד יישאר שטח ריק בהדפסה."
              name={marginName}
              options={marginOptions}
              value={settings.margin}
              onChange={setSetting('margin')}
              columns={3}
            />
            <Choices
              legend="רמת תיקון שגיאות"
              hint="כמה מהנתונים בקוד אפשר לשחזר כשחלק ממנו מלוכלך, פגום או מכוסה בלוגו. רמה גבוהה יותר יוצרת קוד צפוף יותר."
              name={levelName}
              options={levelOptions.map((option) => ({ value: option.id, label: option.label }))}
              value={settings.level}
              onChange={setSetting('level')}
              columns={4}
            />
          </Optional>

          <div className={styles.footerRow}>
            <button type="button" className={styles.reset} onClick={reset}>
              איפוס הטופס
            </button>
          </div>
        </form>

        <div className={ui.output}>
          <div className={ui.sticky}>
            <h2 className={ui.outputTitle}>הקוד שלכם</h2>
            <div className={styles.stage}>
              {ready ? (
                <canvas
                  ref={previewRef}
                  className={styles.canvas}
                  width={PREVIEW_SIZE}
                  height={PREVIEW_SIZE}
                  role="img"
                  aria-label={previewLabel}
                />
              ) : (
                <p className={styles.placeholder}>{placeholder}</p>
              )}
            </div>
            {ready && summary ? (
              <p className={styles.caption}>
                {summary.text}{' '}
                {summary.detail ? (
                  <bdi dir={summary.detailDir} className={styles.captionDetail}>
                    {summary.detail}
                  </bdi>
                ) : null}
              </p>
            ) : null}
            {ready && isDense(modules) ? (
              <p className={styles.warning}>
                הקוד צפוף, כי יש בו הרבה תווים. כדאי לקצר את התוכן, ואם הוא יודפס, להדפיס אותו גדול יותר.
              </p>
            ) : null}
            {ready ? (
              <div className={ui.actions}>
                <button type="button" className={`${ui.primary} ${styles.wide}`} onClick={downloadPng}>
                  <Download aria-hidden="true" />
                  הורדת PNG
                </button>
                <button type="button" className={ui.secondary} onClick={downloadSvg}>
                  <Download aria-hidden="true" />
                  הורדת SVG
                </button>
                {canCopyImage ? (
                  <button type="button" className={ui.secondary} onClick={copyImage}>
                    <ClipboardCopy aria-hidden="true" />
                    העתקת התמונה
                  </button>
                ) : null}
              </div>
            ) : null}
            <p className={ui.status} role="status" aria-live="polite">
              {status}
            </p>
            <p className={ui.note}>
              זה קוד סטטי: המידע נמצא בתוך הקוד עצמו, בלי הפניה דרך שרת, ולכן הוא לא פג ולא מפסיק לעבוד. כדי לשנות את
              היעד יוצרים קוד חדש. הכול נעשה בדפדפן שלכם, ושום פרט לא נשלח לשום מקום.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
