'use client'

import { useEffect, useId, useRef, useState, type FormEvent, type ReactNode } from 'react'
import { CircleCheck, CircleX, Info, RotateCcw, Search, TriangleAlert } from 'lucide-react'
import {
  API_PATH,
  CLIENT_TIMEOUT_MS,
  SLOW_AFTER_MS,
  buildReport,
  countStatuses,
  parseTarget,
  scoreOf,
  scoredCount,
  serverErrorText,
  statusLabel,
  targetErrorText,
  verdictOf,
  type Counts,
  type ReportItem,
  type ReportSection,
  type ServerError,
  type Status,
  type TargetError,
  type TrustFacts,
} from '@/lib/website-trust-check'
import ui from './toolUi.module.css'
import styles from './AiReadinessChecker.module.css'
import own from './WebsiteTrustCheck.module.css'

type Result = { facts: TrustFacts; sections: ReportSection[]; counts: Counts; score: number; scored: number }

type Phase =
  | { kind: 'idle' }
  | { kind: 'loading'; slow: boolean }
  | { kind: 'failed'; message: string }
  | { kind: 'done'; result: Result }

type ApiReply =
  | { ok: true; facts: TrustFacts }
  | { ok: false; error: ServerError | TargetError; retryAfter?: number }

const TIMEOUT_REASON = 'timeout'
const FIELD_ERRORS = new Set<string>(['dns', 'private-address'])

const statusIcon: Record<Status, typeof CircleCheck> = {
  pass: CircleCheck,
  warn: TriangleAlert,
  fail: CircleX,
  info: Info,
}

const toneClass: Record<Status, string> = {
  pass: styles.pass,
  warn: styles.warn,
  fail: styles.fail,
  info: styles.info,
}

const timeOf = (iso: string) =>
  new Intl.DateTimeFormat('he-IL', { hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Jerusalem' }).format(new Date(iso))

const replyMessage = (reply: Exclude<ApiReply, { ok: true }>) => {
  if (reply.error === 'rate-limited') {
    const minutes = Math.max(1, Math.ceil((reply.retryAfter ?? 60) / 60))
    return `${serverErrorText['rate-limited']} נסו שוב בעוד ${minutes === 1 ? 'דקה' : `${minutes} דקות`}.`
  }
  if (reply.error in targetErrorText) return targetErrorText[reply.error as TargetError]
  return serverErrorText[reply.error as ServerError] ?? serverErrorText.internal
}

function StatusBadge({ status }: { status: Status }) {
  const Icon = statusIcon[status]
  return (
    <span className={`${styles.badge} ${toneClass[status]}`}>
      <Icon aria-hidden="true" />
      {statusLabel[status]}
    </span>
  )
}

function Item({ item }: { item: ReportItem }) {
  return (
    <li className={`${styles.item} ${toneClass[item.status]}`}>
      <div className={styles.itemHead}>
        <StatusBadge status={item.status} />
        <h4 className={styles.itemTitle}>{item.title}</h4>
      </div>
      <p className={styles.itemText}>{item.text}</p>
      {item.fix ? (
        <p className={styles.fix}>
          <strong>מה לעשות: </strong>
          {item.fix}
        </p>
      ) : null}
    </li>
  )
}

export default function WebsiteTrustCheck() {
  const [value, setValue] = useState('')
  const [fieldError, setFieldError] = useState('')
  const [phase, setPhase] = useState<Phase>({ kind: 'idle' })
  const [announcement, setAnnouncement] = useState('')
  const controllerRef = useRef<AbortController | null>(null)
  const timersRef = useRef<number[]>([])
  const lastInputRef = useRef('')
  const inputRef = useRef<HTMLInputElement>(null)
  const outputRef = useRef<HTMLDivElement>(null)
  const baseId = useId()
  const fieldId = `${baseId}-url`
  const hintId = `${baseId}-hint`
  const errorId = `${baseId}-error`

  const clearTimers = () => {
    timersRef.current.forEach((timer) => window.clearTimeout(timer))
    timersRef.current = []
  }

  useEffect(
    () => () => {
      controllerRef.current?.abort('unmount')
      timersRef.current.forEach((timer) => window.clearTimeout(timer))
    },
    [],
  )

  const reveal = () => {
    if (!window.matchMedia('(max-width: 1023px)').matches) return
    const smooth = !window.matchMedia('(prefers-reduced-motion: reduce)').matches
    outputRef.current?.scrollIntoView({ block: 'start', behavior: smooth ? 'smooth' : 'auto' })
  }

  const showFailure = (message: string) => {
    setPhase({ kind: 'failed', message })
    setAnnouncement(message)
  }

  const run = async (input: string) => {
    controllerRef.current?.abort('superseded')
    clearTimers()
    const controller = new AbortController()
    controllerRef.current = controller
    lastInputRef.current = input
    setPhase({ kind: 'loading', slow: false })
    setAnnouncement('בודקים את האתר')
    timersRef.current = [
      window.setTimeout(() => {
        setPhase((current) => (current.kind === 'loading' ? { kind: 'loading', slow: true } : current))
      }, SLOW_AFTER_MS),
      window.setTimeout(() => controller.abort(TIMEOUT_REASON), CLIENT_TIMEOUT_MS),
    ]
    let reply: ApiReply
    try {
      const response = await fetch(API_PATH, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: input }),
        signal: controller.signal,
      })
      reply = (await response.json()) as ApiReply
    } catch {
      if (controllerRef.current !== controller) return
      controllerRef.current = null
      clearTimers()
      showFailure(
        controller.signal.reason === TIMEOUT_REASON
          ? 'הבדיקה לקחה יותר מדי זמן. נסו שוב בעוד רגע.'
          : 'לא הצלחנו להתחבר לשרת שלנו. בדקו את החיבור לאינטרנט ונסו שוב.',
      )
      return
    }
    if (controllerRef.current !== controller) return
    controllerRef.current = null
    clearTimers()
    if (!reply.ok) {
      const message = replyMessage(reply)
      if (FIELD_ERRORS.has(reply.error) || reply.error in targetErrorText) {
        setPhase({ kind: 'idle' })
        setFieldError(message)
        setAnnouncement(message)
        inputRef.current?.focus()
        return
      }
      showFailure(message)
      return
    }
    const sections = buildReport(reply.facts)
    const counts = countStatuses(sections)
    const score = scoreOf(sections)
    setPhase({ kind: 'done', result: { facts: reply.facts, sections, counts, score, scored: scoredCount(sections) } })
    setAnnouncement(`הבדיקה של ${reply.facts.host} הסתיימה. ציון ${score} מתוך 100.`)
    window.gtag?.('event', 'website_trust_check', { score, fail: counts.fail })
    window.requestAnimationFrame(reveal)
  }

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const target = parseTarget(value)
    if (!target.ok) {
      setFieldError(targetErrorText[target.error])
      inputRef.current?.focus()
      return
    }
    setFieldError('')
    run(value.trim())
  }

  const retry = () => {
    if (lastInputRef.current) run(lastInputRef.current)
  }

  let body: ReactNode
  if (phase.kind === 'idle') {
    body = (
      <p className={styles.prompt}>
        הקלידו כתובת ולחצו על בדיקה. נבדוק מתי נרשם הדומיין, אם הוא מתחזה למותג מוכר, את תעודת ה-SSL, כותרות אבטחה,
        ואם באתר יש פרטי קשר, תקנון, מדיניות פרטיות והצהרת נגישות.
      </p>
    )
  } else if (phase.kind === 'loading') {
    body = (
      <div className={styles.loading}>
        <span className={styles.spinner} aria-hidden="true" />
        <div>
          <p className={styles.loadingTitle}>בודקים את הדומיין, את התעודה ואת דף הבית</p>
          {phase.slow ? <p className={styles.loadingNote}>האתר עונה לאט. ממתינים עד 20 שניות.</p> : null}
        </div>
      </div>
    )
  } else if (phase.kind === 'failed') {
    body = (
      <div className={styles.problem}>
        <p>{phase.message}</p>
        <button type="button" className={ui.secondary} onClick={retry}>
          <RotateCcw aria-hidden="true" />
          ניסיון נוסף
        </button>
      </div>
    )
  } else {
    const { facts, sections, counts, score, scored } = phase.result
    const verdict = verdictOf(score)
    const redirectedHost = facts.home.finalUrl ? new URL(facts.home.finalUrl).host : facts.host
    body = (
      <>
        <div className={styles.summary}>
          <p className={styles.host}>
            <span dir="ltr" lang="en">
              {facts.host}
            </span>
          </p>
          {redirectedHost !== facts.host ? (
            <p className={styles.redirect}>
              האתר מפנה ל-
              <span dir="ltr" lang="en">
                {redirectedHost}
              </span>
              , ולכן את דף הבית בדקנו שם.
            </p>
          ) : null}
          <p className={`${own.score} ${toneClass[verdict.status]}`}>
            <strong>{score}</strong>
            <span>מתוך 100</span>
          </p>
          <p className={styles.headline}>{verdict.text}</p>
          <ul className={styles.counts}>
            <li className={styles.pass}>
              <strong>{counts.pass}</strong> תקין
            </li>
            <li className={styles.warn}>
              <strong>{counts.warn}</strong> לבדוק
            </li>
            <li className={styles.fail}>
              <strong>{counts.fail}</strong> {counts.fail === 1 ? 'בעיה' : 'בעיות'}
            </li>
          </ul>
          <p className={styles.checked}>
            נבדק היום ב-{timeOf(facts.checkedAt)}. הציון מבוסס על {scored} בדיקות אוטומטיות, והוא הערכה ולא קביעה
            שהאתר אמין או מזויף.
          </p>
        </div>

        {sections.map((section) => (
          <section key={section.id} className={styles.section} aria-labelledby={`${baseId}-${section.id}`}>
            <h3 id={`${baseId}-${section.id}`} className={styles.sectionTitle}>
              {section.title}
            </h3>
            <ul className={styles.items}>
              {section.items.map((item) => (
                <Item key={item.id} item={item} />
              ))}
            </ul>
          </section>
        ))}

        <div className={ui.actions}>
          <button type="button" className={ui.secondary} onClick={retry}>
            <RotateCcw aria-hidden="true" />
            בדיקה חוזרת
          </button>
        </div>
      </>
    )
  }

  return (
    <section className={`${ui.tool} ${styles.checker}`} aria-label="הכלי: בדיקת אתר אמין או מזויף">
      <div className={`${ui.inner} ${styles.layout}`}>
        <form className={`${ui.form} ${styles.form}`} onSubmit={onSubmit} noValidate>
          <div className={ui.field}>
            <label htmlFor={fieldId} className={styles.label}>
              כתובת האתר
            </label>
            <p id={hintId} className={ui.hint}>
              דומיין או כתובת מלאה, למשל example.co.il. בודקים רק את דף הבית ואת הדומיין.
            </p>
            <div className={styles.searchRow}>
              <input
                ref={inputRef}
                id={fieldId}
                className={`${ui.input} ${styles.input}`}
                type="text"
                inputMode="url"
                autoComplete="url"
                autoCapitalize="none"
                autoCorrect="off"
                spellCheck={false}
                enterKeyHint="go"
                maxLength={2048}
                dir="ltr"
                data-lpignore="true"
                data-1p-ignore=""
                value={value}
                aria-invalid={fieldError ? true : undefined}
                aria-describedby={fieldError ? `${hintId} ${errorId}` : hintId}
                onChange={(event) => {
                  setValue(event.target.value)
                  setFieldError('')
                }}
              />
              <button type="submit" className={`${ui.primary} ${styles.submit}`}>
                <Search aria-hidden="true" />
                בדיקה
              </button>
            </div>
            {fieldError ? (
              <p id={errorId} className={styles.error}>
                {fieldError}
              </p>
            ) : null}
          </div>
        </form>

        <div className={`${ui.output} ${styles.output}`} ref={outputRef}>
          <h2 className={ui.outputTitle}>התוצאה</h2>
          <div aria-busy={phase.kind === 'loading'}>{body}</div>
          <p className={styles.srOnly} role="status" aria-live="polite">
            {announcement}
          </p>
          <p className={ui.note}>
            הבדיקה רצה מהשרת שלנו ופונה רק לאתר שהקלדתם ולמאגר הדומיינים. אנחנו לא שומרים את הכתובת ואת התוצאות. מותר
            להריץ עד 10 בדיקות ב-10 דקות.
          </p>
        </div>
      </div>
    </section>
  )
}
