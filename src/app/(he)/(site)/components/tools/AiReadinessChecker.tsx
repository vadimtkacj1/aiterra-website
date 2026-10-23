'use client'

import { useEffect, useId, useRef, useState, type FormEvent, type ReactNode } from 'react'
import { CircleCheck, CircleX, Copy, Info, RotateCcw, Search, TriangleAlert } from 'lucide-react'
import {
  API_PATH,
  CLIENT_TIMEOUT_MS,
  SLOW_AFTER_MS,
  TRAINING_AGENTS,
  buildReport,
  buildRobotsSnippet,
  countStatuses,
  parseTarget,
  serverErrorText,
  statusLabel,
  targetErrorText,
  type Counts,
  type CrawlerGroup,
  type ReportItem,
  type ReportSection,
  type ServerError,
  type SiteFacts,
  type Status,
  type TargetError,
} from '@/lib/ai-readiness'
import ui from './toolUi.module.css'
import styles from './AiReadinessChecker.module.css'

type Result = { facts: SiteFacts; sections: ReportSection[]; counts: Counts }

type Phase =
  | { kind: 'idle' }
  | { kind: 'loading'; slow: boolean }
  | { kind: 'failed'; message: string }
  | { kind: 'done'; result: Result }

type ApiReply =
  | { ok: true; facts: SiteFacts }
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

const verdictText = (counts: Counts) => {
  if (counts.fail) return 'מצאנו דברים שמונעים מבוטים של חיפוש ו-AI לקרוא את האתר או לצטט אותו.'
  if (counts.warn) return 'לא מצאנו חסימה ודאית, אבל יש דברים שכדאי לבדוק.'
  return 'לא מצאנו שום דבר שחוסם בוטים של חיפוש ו-AI.'
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
      {item.code ? (
        <pre className={styles.code} dir="ltr">
          <code>{item.code}</code>
        </pre>
      ) : null}
      {item.fix ? (
        <p className={styles.fix}>
          <strong>מה לעשות: </strong>
          {item.fix}
        </p>
      ) : null}
    </li>
  )
}

function Crawlers({ group }: { group: CrawlerGroup }) {
  return (
    <div className={styles.group}>
      <h4 className={styles.groupTitle}>{group.label}</h4>
      <p className={styles.groupText}>{group.text}</p>
      <ul className={styles.crawlers}>
        {group.rows.map((row) => {
          const Icon = row.allowed ? CircleCheck : CircleX
          return (
            <li key={row.token} className={`${styles.crawler} ${toneClass[row.status]}`}>
              <div className={styles.crawlerHead}>
                <span className={styles.crawlerName}>
                  <a href={row.doc} target="_blank" rel="noopener" className={styles.token} lang="en" dir="ltr">
                    {row.token}
                  </a>
                  <span className={styles.vendor}>{row.vendor}</span>
                </span>
                <span className={`${styles.verdict} ${toneClass[row.status]}`}>
                  <Icon aria-hidden="true" />
                  {row.allowed ? 'מותר' : 'חסום'}
                  {row.status !== 'info' ? <span className={styles.srOnly}>, {statusLabel[row.status]}</span> : null}
                </span>
              </div>
              <p className={styles.crawlerText}>{row.text}</p>
              {row.rule.startsWith('User-agent') ? (
                <p className={styles.rule} dir="ltr">
                  {row.rule}
                </p>
              ) : (
                <p className={styles.ruleNote}>{row.rule}</p>
              )}
            </li>
          )
        })}
      </ul>
    </div>
  )
}

export default function AiReadinessChecker() {
  const [value, setValue] = useState('')
  const [fieldError, setFieldError] = useState('')
  const [phase, setPhase] = useState<Phase>({ kind: 'idle' })
  const [blockTraining, setBlockTraining] = useState(false)
  const [announcement, setAnnouncement] = useState('')
  const [copyStatus, setCopyStatus] = useState('')
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
    setCopyStatus('')
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
    setPhase({ kind: 'done', result: { facts: reply.facts, sections, counts } })
    setAnnouncement(
      `הבדיקה של ${reply.facts.host} הסתיימה: ${counts.pass} תקין, ${counts.warn} לבדוק, ${counts.fail} בעיות.`,
    )
    window.gtag?.('event', 'ai_readiness_check', { pass: counts.pass, warn: counts.warn, fail: counts.fail })
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

  const result = phase.kind === 'done' ? phase.result : null
  const facts = result?.facts ?? null
  const snippetSitemap = facts && facts.sitemap.found && !facts.robots.sitemaps.length ? facts.sitemap.url : ''
  const snippet = buildRobotsSnippet({
    blockTraining,
    starRules: facts?.robots.starRules ?? [],
    sitemap: snippetSitemap,
  })

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(snippet.text)
      setCopyStatus('השורות הועתקו')
    } catch {
      setCopyStatus('ההעתקה נכשלה. סמנו את השורות והעתיקו ידנית.')
    }
  }

  let body: ReactNode
  if (phase.kind === 'idle') {
    body = (
      <p className={styles.prompt}>
        הקלידו כתובת ולחצו על בדיקה. נבדוק מה robots.txt מתיר לכל בוט, אם השרת או Cloudflare חוסמים בוטים, noindex
        ו-nosnippet, כמה טקסט יש ב-HTML בלי JavaScript, נתונים מובנים, מפת אתר ו-llms.txt.
      </p>
    )
  } else if (phase.kind === 'loading') {
    body = (
      <div className={styles.loading}>
        <span className={styles.spinner} aria-hidden="true" />
        <div>
          <p className={styles.loadingTitle}>בודקים את דף הבית, robots.txt, llms.txt ומפת האתר</p>
          {phase.slow ? <p className={styles.loadingNote}>האתר עונה לאט. ממתינים עד 15 שניות.</p> : null}
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
  } else if (result && facts) {
    const redirected = facts.input !== facts.host
    body = (
      <>
        <div className={styles.summary}>
          <p className={styles.host}>
            <span dir="ltr" lang="en">
              {facts.host}
            </span>
          </p>
          {redirected ? (
            <p className={styles.redirect}>
              הכתובת{' '}
              <span dir="ltr" lang="en">
                {facts.input}
              </span>{' '}
              מפנה לכאן, ולכן בדקנו את הדומיין הזה.
            </p>
          ) : null}
          <p className={styles.headline}>{verdictText(result.counts)}</p>
          <ul className={styles.counts}>
            <li className={styles.pass}>
              <strong>{result.counts.pass}</strong> תקין
            </li>
            <li className={styles.warn}>
              <strong>{result.counts.warn}</strong> לבדוק
            </li>
            <li className={styles.fail}>
              <strong>{result.counts.fail}</strong> {result.counts.fail === 1 ? 'בעיה' : 'בעיות'}
            </li>
          </ul>
          <p className={styles.checked}>נבדק היום ב-{timeOf(facts.checkedAt)}</p>
        </div>

        {result.sections.map((section) => (
          <section key={section.id} className={styles.section} aria-labelledby={`${baseId}-${section.id}`}>
            <h3 id={`${baseId}-${section.id}`} className={styles.sectionTitle}>
              {section.title}
            </h3>
            <ul className={styles.items}>
              {section.items.map((item) => (
                <Item key={item.id} item={item} />
              ))}
            </ul>
            {section.crawlers?.map((group) => (
              <Crawlers key={group.kind} group={group} />
            ))}
          </section>
        ))}

        <section className={styles.section} aria-labelledby={`${baseId}-snippet`}>
          <h3 id={`${baseId}-snippet`} className={styles.sectionTitle}>
            robots.txt מומלץ לנראות בבינה מלאכותית
          </h3>
          <p className={styles.sectionText}>
            השורות מתירות לבוטים של חיפוש ותשובות AI להיכנס לאתר. Googlebot ו-Bingbot לא מופיעים בהן, כי הם ממשיכים
            לפעול לפי הקבוצה הכללית שלכם.
          </p>
          <label className={styles.toggle}>
            <input
              type="checkbox"
              className={ui.checkbox}
              checked={blockTraining}
              onChange={(event) => {
                setBlockTraining(event.target.checked)
                setCopyStatus('')
              }}
            />
            <span>
              <span className={styles.toggleLabel}>לחסום בוטים שאוספים תוכן לאימון מודלים</span>
              <span className={styles.toggleHint}>
                <span dir="ltr" lang="en">
                  {TRAINING_AGENTS.join(', ')}
                </span>
                . לפי החברות, זה לא מוציא את האתר מהחיפוש שלהן. חסימה של Google-Extended מוציאה את התוכן גם מתשובות
                באפליקציית Gemini, אבל לא מחיפוש גוגל ומ-AI Overviews.
              </span>
            </span>
          </label>
          <pre className={styles.snippet} dir="ltr" tabIndex={0} aria-label="robots.txt מומלץ">
            <code>{snippet.text}</code>
          </pre>
          <div className={ui.actions}>
            <button type="button" className={`${ui.primary} ${styles.grow}`} onClick={copy}>
              <Copy aria-hidden="true" />
              העתקת השורות
            </button>
            <button type="button" className={ui.secondary} onClick={retry}>
              <RotateCcw aria-hidden="true" />
              בדיקה חוזרת
            </button>
          </div>
          <p className={ui.status} role="status" aria-live="polite">
            {copyStatus}
          </p>
          <p className={ui.note}>
            מוסיפים את השורות בתחילת robots.txt. אם כבר יש בקובץ קבוצה לאחד הבוטים האלה, מעדכנים אותה במקום להוסיף
            עוד אחת, כי לפי התקן קבוצות של אותו בוט מתאחדות.
            {snippet.carried
              ? ` ${snippet.carried === 1 ? 'שורה אחת הועתקה' : `${snippet.carried} שורות הועתקו`} מהקבוצה של User-agent: *, כדי שהבוטים האלה ימשיכו לדלג על אותם אזורים.`
              : ''}{' '}
            לפי OpenAI, לוקח כ-24 שעות עד ששינוי ב-robots.txt משפיע על החיפוש של ChatGPT.
          </p>
        </section>
      </>
    )
  }

  return (
    <section className={`${ui.tool} ${styles.checker}`} aria-label="הכלי: בדיקת גישה של בוטי AI לאתר">
      <div className={`${ui.inner} ${styles.layout}`}>
        <form className={`${ui.form} ${styles.form}`} onSubmit={onSubmit} noValidate>
          <div className={ui.field}>
            <label htmlFor={fieldId} className={styles.label}>
              כתובת האתר
            </label>
            <p id={hintId} className={ui.hint}>
              דומיין או כתובת מלאה, למשל example.co.il. בודקים את דף הבית ואת הקבצים בשורש האתר.
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
            הבדיקה רצה מהשרת שלנו ופונה רק לאתר שהקלדתם. אנחנו לא שומרים את הכתובת ואת התוצאות. מותר להריץ עד 10
            בדיקות ב-10 דקות.
          </p>
        </div>
      </div>
    </section>
  )
}
