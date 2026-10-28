'use client'

import { useEffect, useId, useRef, useState, type FormEvent } from 'react'
import { RotateCcw, Search } from 'lucide-react'
import {
  ISOC_REGISTRARS_URL,
  ISOC_WHOIS_URL,
  LOOKUP_TIMEOUT_MS,
  ageText,
  daysUntil,
  formatDate,
  normalizeDomain,
  statusLabel,
  type DomainLookupResponse,
  type DomainRecord,
} from '@/lib/domain-lookup'
import ui from './toolUi.module.css'
import styles from './DomainLookup.module.css'

type Failure = 'invalid' | 'upstream' | 'network'

type Phase =
  | { kind: 'idle' }
  | { kind: 'loading'; domain: string }
  | { kind: 'failed'; failure: Failure }
  | { kind: 'done'; response: DomainLookupResponse }

const failureText: Record<Failure, string> = {
  invalid: 'השרת לא קיבל את הכתובת. בדקו שהקלדתם שם דומיין תקין.',
  upstream: 'המרשם לא ענה בזמן. זה קורה לפעמים בעומס, נסו שוב בעוד דקה.',
  network: 'אין חיבור לשרת הבדיקה. בדקו את החיבור לאינטרנט ונסו שוב.',
}

const stateBadge: Record<DomainRecord['state'], { label: string; tone: string }> = {
  available: { label: 'פנוי לרישום', tone: styles.toneActive },
  registered: { label: 'תפוס', tone: styles.toneEnded },
  unknown: { label: 'לא ניתן לבדוק', tone: styles.toneUnknown },
}

const REQUEST_TIMEOUT_MS = LOOKUP_TIMEOUT_MS * 2 + 2000

async function requestLookup(domain: string, signal: AbortSignal): Promise<DomainLookupResponse | Failure> {
  try {
    const response = await fetch(`/api/tools/domain-lookup?domain=${encodeURIComponent(domain)}`, { signal })
    if (response.status === 400) return 'invalid'
    if (!response.ok) return 'upstream'
    return (await response.json()) as DomainLookupResponse
  } catch {
    return signal.aborted ? 'upstream' : 'network'
  }
}

function DomainName({ record }: { record: DomainRecord }) {
  return (
    <span dir="ltr" className={styles.domain}>
      {record.display}
    </span>
  )
}

function Statuses({ statuses }: { statuses: string[] }) {
  const labels = [...new Set(statuses.map((status) => statusLabel(status) ?? status))]
  return (
    <ul className={styles.statuses}>
      {labels.map((label) => (
        <li key={label} dir="auto">
          {label}
        </li>
      ))}
    </ul>
  )
}

function ExpiryNote({ expires }: { expires: string }) {
  const days = daysUntil(expires)
  if (days < 0) return <span className={`${styles.factNote} ${styles.warn}`}>פג לפני {-days} ימים</span>
  if (days <= 60) return <span className={`${styles.factNote} ${styles.warn}`}>בעוד {days} ימים</span>
  return <span className={styles.factNote}>בעוד {days} ימים</span>
}

function RegisteredCard({ record }: { record: DomainRecord }) {
  return (
    <article className={`${styles.card} ${styles.toneEnded}`}>
      <p className={`${styles.badge} ${styles.toneEnded}`}>{stateBadge.registered.label}</p>
      <h3 className={styles.name}>
        <DomainName record={record} />
      </h3>
      <p className={styles.lead}>הדומיין רשום. אפשר לראות מי הרשם, ממתי הוא רשום ועד מתי שולם.</p>
      <dl className={styles.facts}>
        {record.registrar ? (
          <div className={styles.fact}>
            <dt>רשם</dt>
            <dd dir="auto">{record.registrar}</dd>
          </div>
        ) : null}
        {record.created ? (
          <div className={styles.fact}>
            <dt>תאריך רישום</dt>
            <dd>
              {formatDate(record.created)}
              <span className={styles.factNote}>גיל הדומיין: {ageText(record.created)}</span>
            </dd>
          </div>
        ) : null}
        {record.expires ? (
          <div className={styles.fact}>
            <dt>תוקף עד</dt>
            <dd>
              {formatDate(record.expires)}
              <ExpiryNote expires={record.expires} />
            </dd>
          </div>
        ) : null}
        {record.nameservers.length ? (
          <div className={styles.fact}>
            <dt>שרתי שמות</dt>
            <dd>
              <ul className={styles.servers} dir="ltr">
                {record.nameservers.map((server) => (
                  <li key={server}>{server}</li>
                ))}
              </ul>
            </dd>
          </div>
        ) : null}
        {record.statuses.length ? (
          <div className={styles.fact}>
            <dt>סטטוס</dt>
            <dd>
              <Statuses statuses={record.statuses} />
            </dd>
          </div>
        ) : null}
      </dl>
      <p className={styles.source}>
        מקור: {record.source === 'isoc' ? 'שרת ה-WHOIS של איגוד האינטרנט הישראלי' : 'RDAP של מרשם הסיומת'}. שם
        המחזיק ופרטי הקשר לא מוצגים כאן.
      </p>
    </article>
  )
}

function AvailableCard({ record }: { record: DomainRecord }) {
  return (
    <article className={`${styles.card} ${styles.toneActive}`}>
      <p className={`${styles.badge} ${styles.toneActive}`}>{stateBadge.available.label}</p>
      <h3 className={styles.name}>
        <DomainName record={record} />
      </h3>
      <p className={styles.lead}>
        המרשם לא מצא רישום לשם הזה. רושמים אותו אצל{' '}
        {record.source === 'isoc' ? (
          <a href={ISOC_REGISTRARS_URL} target="_blank" rel="noopener">
            רשם מוסמך של איגוד האינטרנט
          </a>
        ) : (
          'כל רשם דומיינים שמוכר את הסיומת'
        )}
        , לפי כל הקודם זוכה.
      </p>
    </article>
  )
}

function UnknownCard({ record }: { record: DomainRecord }) {
  return (
    <div className={styles.message}>
      <p className={styles.messageTitle}>
        אי אפשר לבדוק את <DomainName record={record} /> מכאן
      </p>
      <p>
        {record.source === 'isoc'
          ? 'שרת ה-WHOIS של איגוד האינטרנט לא החזיר תשובה לשם הזה. סיומת il. לבדה פתוחה רק למי שעומד בתנאי סף, ולכן כדאי לבדוק מול רשם מוסמך.'
          : 'לסיומת הזאת אין שירות RDAP ציבורי. בדקו את הזמינות אצל רשם שמוכר אותה.'}
      </p>
    </div>
  )
}

function Alternatives({ records }: { records: DomainRecord[] }) {
  if (!records.length) return null
  return (
    <div className={styles.alternatives}>
      <h3 className={styles.altTitle}>אותו שם בסיומות אחרות</h3>
      <ul className={styles.altList}>
        {records.map((record) => (
          <li key={record.domain} className={styles.altRow}>
            <DomainName record={record} />
            <span className={`${styles.altState} ${stateBadge[record.state].tone}`}>
              {stateBadge[record.state].label}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default function DomainLookup() {
  const [value, setValue] = useState('')
  const [fieldError, setFieldError] = useState('')
  const [phase, setPhase] = useState<Phase>({ kind: 'idle' })
  const [announcement, setAnnouncement] = useState('')
  const controllerRef = useRef<AbortController | null>(null)
  const lastDomainRef = useRef('')
  const inputRef = useRef<HTMLInputElement>(null)
  const fieldId = useId()
  const hintId = `${fieldId}-hint`
  const errorId = `${fieldId}-error`

  useEffect(() => () => controllerRef.current?.abort('unmount'), [])

  const run = (domain: string) => {
    controllerRef.current?.abort('superseded')
    const controller = new AbortController()
    controllerRef.current = controller
    lastDomainRef.current = domain
    setPhase({ kind: 'loading', domain })
    setAnnouncement(`בודק את ${domain}`)
    const timer = window.setTimeout(() => controller.abort('timeout'), REQUEST_TIMEOUT_MS)

    requestLookup(domain, controller.signal).then((result) => {
      window.clearTimeout(timer)
      if (controllerRef.current !== controller) return
      controllerRef.current = null
      if (typeof result === 'string') {
        setPhase({ kind: 'failed', failure: result })
        setAnnouncement(failureText[result])
        return
      }
      setPhase({ kind: 'done', response: result })
      setAnnouncement(`${result.record.display}: ${stateBadge[result.record.state].label}`)
      window.gtag?.('event', 'domain_lookup_search', { state: result.record.state })
    })
  }

  useEffect(() => {
    const requested = new URLSearchParams(window.location.search).get('domain')
    const domain = requested ? normalizeDomain(requested) : null
    if (!requested || !domain) return
    setValue(requested)
    run(domain)
  }, [])

  const onSubmit =(event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const domain = normalizeDomain(value)
    if (!domain) {
      setFieldError(
        value.trim()
          ? 'זה לא נראה כמו שם דומיין. השתמשו באותיות לטיניות, ספרות ומקף, לפחות 3 תווים בדומיין ישראלי.'
          : 'הקלידו שם דומיין, למשל example.co.il.',
      )
      inputRef.current?.focus()
      return
    }
    setFieldError('')
    run(domain)
  }

  let body
  if (phase.kind === 'idle') {
    body = (
      <p className={styles.prompt}>
        הקלידו שם דומיין ולחצו על בדיקה. בלי סיומת נבדוק co.il. אם השם פנוי, נבדוק גם com, il ו-org.il.
      </p>
    )
  } else if (phase.kind === 'loading') {
    body = (
      <p className={styles.prompt}>
        בודק את{' '}
        <span dir="ltr" className={styles.domain}>
          {phase.domain}
        </span>{' '}
        מול המרשם…
      </p>
    )
  } else if (phase.kind === 'failed') {
    body = (
      <div className={styles.message}>
        <p className={styles.messageTitle}>הבדיקה לא הושלמה</p>
        <p>{failureText[phase.failure]}</p>
        {phase.failure !== 'invalid' ? (
          <button type="button" className={ui.secondary} onClick={() => run(lastDomainRef.current)}>
            <RotateCcw aria-hidden="true" />
            לנסות שוב
          </button>
        ) : null}
      </div>
    )
  } else {
    const { record, alternatives } = phase.response
    body = (
      <>
        {record.state === 'registered' ? <RegisteredCard record={record} /> : null}
        {record.state === 'available' ? <AvailableCard record={record} /> : null}
        {record.state === 'unknown' ? <UnknownCard record={record} /> : null}
        <Alternatives records={alternatives} />
      </>
    )
  }

  return (
    <section className={`${ui.tool} ${styles.lookup}`} aria-label="בדיקת דומיין פנוי ופרטי רישום">
      <div className={`${ui.inner} ${styles.layout}`}>
        <form className={ui.form} onSubmit={onSubmit} noValidate>
          <fieldset className={ui.group}>
            <legend className={ui.legend}>הדומיין</legend>
            <div className={ui.field}>
              <label htmlFor={fieldId} className={ui.label}>
                שם הדומיין
              </label>
              <p id={hintId} className={ui.hint}>
                אפשר להדביק כתובת מלאה. בלי סיומת נבדוק co.il.
              </p>
              <div className={styles.searchRow}>
                <input
                  ref={inputRef}
                  id={fieldId}
                  className={`${ui.input} ${ui.ltr}`}
                  type="text"
                  inputMode="url"
                  autoComplete="off"
                  autoCapitalize="none"
                  autoCorrect="off"
                  spellCheck={false}
                  enterKeyHint="search"
                  maxLength={300}
                  placeholder="example.co.il"
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
          </fieldset>
        </form>

        <div className={ui.output}>
          <div className={ui.sticky}>
            <h2 className={ui.outputTitle}>התוצאה</h2>
            <div aria-busy={phase.kind === 'loading'}>{body}</div>
            <p className={styles.srOnly} role="status" aria-live="polite">
              {announcement}
            </p>
            <p className={ui.note}>
              דומיינים ישראליים נבדקים מול{' '}
              <a href={ISOC_WHOIS_URL} target="_blank" rel="noopener">
                ה-WHOIS של איגוד האינטרנט
              </a>
              , ושאר הסיומות מול RDAP. אנחנו לא שומרים את מה שחיפשתם ולא מציגים פרטים אישיים של המחזיק.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
