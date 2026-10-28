'use client'

import { useEffect, useId, useRef, useState, type FormEvent, type ReactNode } from 'react'
import { Gauge, Monitor, RotateCcw, Smartphone } from 'lucide-react'
import {
  API_PATH,
  CLIENT_TIMEOUT_MS,
  SLOW_AFTER_MS,
  metricInfo,
  parseTarget,
  ratingLabel,
  scoreRating,
  serverErrorText,
  strategyLabel,
  targetErrorText,
  type Metric,
  type Rating,
  type ServerError,
  type SpeedReport,
  type Strategy,
  type TargetError,
} from '@/lib/website-speed'
import ui from './toolUi.module.css'
import styles from './WebsiteSpeedTest.module.css'

type Phase =
  | { kind: 'idle' }
  | { kind: 'loading'; slow: boolean }
  | { kind: 'failed'; message: string }
  | { kind: 'done'; report: SpeedReport }

type ApiReply =
  | { ok: true; report: SpeedReport }
  | { ok: false; error: ServerError | TargetError; retryAfter?: number }

const TIMEOUT_REASON = 'timeout'

const toneClass: Record<Rating, string> = { good: styles.good, average: styles.average, poor: styles.poor }

const scoreHeadline: Record<Rating, string> = {
  good: 'הדף נטען מהר. נשאר לשמור על זה.',
  average: 'הדף נטען בסדר, אבל יש מה לשפר.',
  poor: 'הדף נטען לאט. רוב הגולשים ירגישו את זה.',
}

const fieldScopeText = {
  page: 'נתונים אמיתיים של גולשי Chrome בדף הזה ב-28 הימים האחרונים.',
  origin: 'לדף הזה אין מספיק גולשים, ולכן אלה נתוני האתר כולו ב-28 הימים האחרונים.',
}

function replyMessage(reply: Extract<ApiReply, { ok: false }>) {
  if (reply.error in targetErrorText) return targetErrorText[reply.error as TargetError]
  const base = serverErrorText[reply.error as ServerError] ?? serverErrorText.internal
  if (reply.error === 'rate-limited' && reply.retryAfter) {
    return `${base} אפשר לנסות שוב בעוד ${Math.ceil(reply.retryAfter / 60)} דקות.`
  }
  return base
}

function MetricList({ metrics }: { metrics: Metric[] }) {
  return (
    <ul className={styles.metrics}>
      {metrics.map((metric) => (
        <li key={metric.id} className={`${styles.metric} ${toneClass[metric.rating]}`}>
          <div className={styles.metricHead}>
            <span className={styles.metricName} lang="en" dir="ltr">
              {metricInfo[metric.id].short}
            </span>
            <span className={styles.metricValue} dir="ltr">
              {metric.display}
            </span>
          </div>
          <p className={styles.metricRating}>{ratingLabel[metric.rating]}</p>
          <p className={styles.metricAbout}>{metricInfo[metric.id].about}</p>
        </li>
      ))}
    </ul>
  )
}

export default function WebsiteSpeedTest() {
  const [value, setValue] = useState('')
  const [strategy, setStrategy] = useState<Strategy>('mobile')
  const [fieldError, setFieldError] = useState('')
  const [phase, setPhase] = useState<Phase>({ kind: 'idle' })
  const [announcement, setAnnouncement] = useState('')
  const controllerRef = useRef<AbortController | null>(null)
  const timersRef = useRef<number[]>([])
  const lastRef = useRef<{ url: string; strategy: Strategy } | null>(null)
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

  const run = async (url: string, mode: Strategy) => {
    controllerRef.current?.abort('superseded')
    clearTimers()
    const controller = new AbortController()
    controllerRef.current = controller
    lastRef.current = { url, strategy: mode }
    setPhase({ kind: 'loading', slow: false })
    setAnnouncement('בודקים את מהירות הטעינה של האתר')
    window.requestAnimationFrame(reveal)
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
        body: JSON.stringify({ url, strategy: mode }),
        signal: controller.signal,
      })
      reply = (await response.json()) as ApiReply
    } catch {
      if (controllerRef.current !== controller) return
      controllerRef.current = null
      clearTimers()
      showFailure(
        controller.signal.reason === TIMEOUT_REASON
          ? serverErrorText.timeout
          : 'לא הצלחנו להתחבר לשרת שלנו. בדקו את החיבור לאינטרנט ונסו שוב.',
      )
      return
    }
    if (controllerRef.current !== controller) return
    controllerRef.current = null
    clearTimers()
    if (!reply.ok) {
      const message = replyMessage(reply)
      if (reply.error in targetErrorText) {
        setPhase({ kind: 'idle' })
        setFieldError(message)
        setAnnouncement(message)
        inputRef.current?.focus()
        return
      }
      showFailure(message)
      return
    }
    const { report } = reply
    setPhase({ kind: 'done', report })
    setAnnouncement(`הבדיקה הסתיימה. ציון ביצועים ב${strategyLabel[report.strategy]}: ${report.score} מתוך 100.`)
    window.gtag?.('event', 'website_speed_test', { strategy: report.strategy, score: report.score })
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
    run(value.trim(), strategy)
  }

  const retry = () => {
    if (lastRef.current) run(lastRef.current.url, lastRef.current.strategy)
  }

  const switchAndRun = (mode: Strategy) => {
    setStrategy(mode)
    if (lastRef.current) run(lastRef.current.url, mode)
  }

  let body: ReactNode
  if (phase.kind === 'idle') {
    body = (
      <p className={styles.prompt}>
        הקלידו כתובת של דף ולחצו על בדיקה. Google טוען את הדף בשרת שלו, מודד כמה זמן לוקח עד שהתוכן מופיע ומגיב,
        ומציג גם את מה שגולשים אמיתיים חוו, אם יש מספיק נתונים.
      </p>
    )
  } else if (phase.kind === 'loading') {
    body = (
      <div className={styles.loading}>
        <span className={styles.spinner} aria-hidden="true" />
        <div>
          <p className={styles.loadingTitle}>Google טוען את הדף ומודד אותו</p>
          <p className={styles.loadingNote}>
            {phase.slow
              ? 'עוד רגע. בדיקה של אתר כבד יכולה לקחת עד דקה.'
              : 'זה לוקח בדרך כלל 15 עד 40 שניות, כי הדף נטען ממש מאפס.'}
          </p>
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
    const { report } = phase
    const rating = report.score === null ? 'poor' : scoreRating(report.score)
    const other: Strategy = report.strategy === 'mobile' ? 'desktop' : 'mobile'
    body = (
      <>
        <div className={`${styles.summary} ${toneClass[rating]}`}>
          <div className={styles.score} aria-hidden="true">
            {report.score}
          </div>
          <div className={styles.summaryText}>
            <p className={styles.scoreLabel}>
              ציון ביצועים ב{strategyLabel[report.strategy]}: <strong>{report.score}</strong> מתוך 100,{' '}
              {ratingLabel[rating]}
            </p>
            <p className={styles.headline}>{scoreHeadline[rating]}</p>
            <p className={styles.url} dir="ltr" lang="en">
              {report.finalUrl}
            </p>
          </div>
        </div>

        <section className={styles.section} aria-labelledby={`${baseId}-field`}>
          <h3 id={`${baseId}-field`} className={styles.sectionTitle}>
            מה גולשים אמיתיים חווים
          </h3>
          {report.field ? (
            <>
              <p className={styles.sectionText}>
                {fieldScopeText[report.field.scope]}
                {report.field.overall
                  ? ` לפי Google, מדדי חוויית המשתמש של ${report.field.scope === 'page' ? 'הדף' : 'האתר'}: ${ratingLabel[report.field.overall]}.`
                  : ''}
              </p>
              <MetricList metrics={report.field.metrics} />
            </>
          ) : (
            <p className={styles.sectionText}>
              אין ל-Google מספיק נתונים מגולשי Chrome על הדף או על האתר, וזה נפוץ באתרים קטנים. לכן מוצגת רק מדידת
              המעבדה למטה.
            </p>
          )}
        </section>

        <section className={styles.section} aria-labelledby={`${baseId}-lab`}>
          <h3 id={`${baseId}-lab`} className={styles.sectionTitle}>
            מדידת מעבדה
          </h3>
          <p className={styles.sectionText}>
            {report.strategy === 'mobile'
              ? 'טעינה אחת מדומה בטלפון בינוני עם רשת סלולרית איטית. הציון מחושב מהמדדים האלה.'
              : 'טעינה אחת מדומה במחשב עם חיבור מהיר. הציון מחושב מהמדדים האלה.'}
          </p>
          <MetricList metrics={report.lab} />
        </section>

        {report.opportunities.length ? (
          <section className={styles.section} aria-labelledby={`${baseId}-fix`}>
            <h3 id={`${baseId}-fix`} className={styles.sectionTitle}>
              מה הכי מאט את הדף
            </h3>
            <ol className={styles.fixes}>
              {report.opportunities.map((item) => (
                <li key={item.id} className={styles.fix}>
                  <div className={styles.fixHead}>
                    <h4 className={styles.fixTitle}>{item.title}</h4>
                    {item.savingsMs >= 100 ? (
                      <span className={styles.saving}>
                        חיסכון משוער: <span dir="ltr">{(item.savingsMs / 1000).toFixed(1)}</span> שנ׳
                      </span>
                    ) : null}
                  </div>
                  <p className={styles.fixText}>{item.text}</p>
                </li>
              ))}
            </ol>
          </section>
        ) : null}

        <div className={ui.actions}>
          <button type="button" className={ui.primary} onClick={() => switchAndRun(other)}>
            {other === 'mobile' ? <Smartphone aria-hidden="true" /> : <Monitor aria-hidden="true" />}
            בדיקה ב{strategyLabel[other]}
          </button>
          <button type="button" className={ui.secondary} onClick={retry}>
            <RotateCcw aria-hidden="true" />
            בדיקה חוזרת
          </button>
        </div>
        <p className={ui.note}>
          המדידה של Google PageSpeed Insights{report.lighthouseVersion ? `, Lighthouse ${report.lighthouseVersion}` : ''}.
          ציון המעבדה משתנה בכמה נקודות בין בדיקה לבדיקה, וזה תקין.
        </p>
      </>
    )
  }

  return (
    <section className={`${ui.tool} ${styles.checker}`} aria-label="הכלי: בדיקת מהירות טעינה של אתר">
      <div className={`${ui.inner} ${styles.layout}`}>
        <form className={`${ui.form} ${styles.form}`} onSubmit={onSubmit} noValidate>
          <div className={ui.field}>
            <label htmlFor={fieldId} className={styles.label}>
              כתובת הדף לבדיקה
            </label>
            <p id={hintId} className={ui.hint}>
              דף הבית או כל דף אחר באתר, למשל example.co.il. נבדקת מהירות הטעינה של האתר, לא מהירות האינטרנט שלכם.
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
              <button
                type="submit"
                className={`${ui.primary} ${styles.submit}`}
                disabled={phase.kind === 'loading'}
              >
                <Gauge aria-hidden="true" />
                בדיקה
              </button>
            </div>
            {fieldError ? (
              <p id={errorId} className={styles.error}>
                {fieldError}
              </p>
            ) : null}
          </div>
          <fieldset className={styles.modes}>
            <legend className={styles.modesLegend}>מכשיר</legend>
            {(['mobile', 'desktop'] as const).map((mode) => (
              <label key={mode} className={styles.mode}>
                <input
                  type="radio"
                  name={`${baseId}-strategy`}
                  value={mode}
                  checked={strategy === mode}
                  onChange={() => setStrategy(mode)}
                />
                {mode === 'mobile' ? <Smartphone aria-hidden="true" /> : <Monitor aria-hidden="true" />}
                {strategyLabel[mode]}
              </label>
            ))}
          </fieldset>
        </form>

        <div className={`${ui.output} ${styles.output}`} ref={outputRef}>
          <h2 className={ui.outputTitle}>התוצאה</h2>
          <div aria-busy={phase.kind === 'loading'}>{body}</div>
          <p className={styles.srOnly} role="status" aria-live="polite">
            {announcement}
          </p>
        </div>
      </div>
    </section>
  )
}
