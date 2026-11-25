'use client'

import { useEffect, useId, useRef, useState, type FormEvent, type ReactNode } from 'react'
import { ExternalLink, RotateCcw, Search } from 'lucide-react'
import { REQUEST_TIMEOUT_MS, SLOW_AFTER_MS, TIMEOUT_REASON, type LookupFailure } from '@/lib/company-lookup'
import {
  REGISTRAR_URL,
  RESULTS_LIMIT,
  checkContractorQuery,
  contractorFailureText,
  contractorsAnnouncement,
  fetchContractorsDataDate,
  gradeLabel,
  isBlocked,
  recordUrl,
  scopeLabel,
  searchContractors,
  type Contractor,
  type ContractorQuery,
} from '@/lib/contractor-registry'
import ui from './toolUi.module.css'
import styles from './CompanyLookup.module.css'
import extra from './ContractorLookup.module.css'

type ValidQuery = Exclude<ContractorQuery, { kind: 'empty' | 'invalid' }>

type Phase =
  | { kind: 'idle' }
  | { kind: 'loading'; slow: boolean }
  | { kind: 'failed'; failure: Exclude<LookupFailure, 'aborted'> }
  | { kind: 'done'; query: ValidQuery; contractors: Contractor[]; more: boolean }

const branchesLabel = (count: number) => (count === 1 ? 'רשום בענף אחד' : `רשום ב-${count} ענפים`)

function ContractorCard({ contractor, dataDate }: { contractor: Contractor; dataDate: string }) {
  const tone = isBlocked(contractor) ? styles.toneCaution : styles.toneActive
  return (
    <article className={`${styles.card} ${tone}`}>
      <p className={`${styles.badge} ${tone}`}>
        {isBlocked(contractor) ? 'רשום, עם הגבלה ברישיון' : 'רשום בפנקס הקבלנים'}
      </p>
      <h3 className={styles.name}>{contractor.name}</h3>
      <dl className={styles.facts}>
        <div className={styles.fact}>
          <dt>מספר קבלן</dt>
          <dd>
            <span dir="ltr" className={styles.digits}>
              {contractor.number}
            </span>
          </dd>
        </div>
        {contractor.entityNumber ? (
          <div className={styles.fact}>
            <dt>ח.פ.</dt>
            <dd>
              <span dir="ltr" className={styles.digits}>
                {contractor.entityNumber}
              </span>
            </dd>
          </div>
        ) : null}
        {contractor.city ? (
          <div className={styles.fact}>
            <dt>יישוב</dt>
            <dd>{contractor.city}</dd>
          </div>
        ) : null}
        {contractor.registered ? (
          <div className={styles.fact}>
            <dt>רשום בפנקס מאז</dt>
            <dd>{contractor.registered}</dd>
          </div>
        ) : null}
      </dl>
      <h4 className={extra.licensesTitle}>{branchesLabel(contractor.licenses.length)}</h4>
      <ul className={extra.licenses}>
        {contractor.licenses.map((license, index) => (
          <li key={`${license.code}-${index}`} className={extra.license}>
            <p className={extra.branch}>
              <span className={extra.code} dir="ltr">
                {license.code}
              </span>
              {license.branch}
            </p>
            <p className={extra.grade}>
              סיווג {gradeLabel(license)}
              {scopeLabel(license) ? `, ${scopeLabel(license)}` : ''}
            </p>
            {license.restriction ? (
              <p className={license.blocked ? extra.blocked : extra.limit}>{license.restriction}</p>
            ) : null}
            {license.recognized ? <p className={extra.recognized}>{license.recognized} לעבודות ממשלתיות</p> : null}
            {license.basis ? <p className={extra.meta}>{license.basis}</p> : null}
            {license.gradeDate ? <p className={extra.meta}>בסיווג הזה מאז {license.gradeDate}</p> : null}
          </li>
        ))}
      </ul>
      <p className={styles.source}>
        מקור: פנקס הקבלנים של משרד הבינוי והשיכון ב-data.gov.il
        {dataDate ? `, נתונים מעודכנים ל-${dataDate}` : ''}.
      </p>
    </article>
  )
}

function NotFound({ query }: { query: ValidQuery }) {
  if (query.kind === 'name') {
    return (
      <div className={styles.message}>
        <p className={styles.messageTitle}>לא נמצא קבלן רשום בשם הזה</p>
        <ul className={styles.tips}>
          <li>נסו רק את שם המשפחה, או מילה אחת משם החברה.</li>
          <li>רישיון של חברה רשום על השם המשפטי שלה, ולא תמיד על שם המותג שעל השלט.</li>
          <li>בקשו מהקבלן את מספר הקבלן שלו וחפשו לפיו.</li>
        </ul>
      </div>
    )
  }
  return (
    <div className={styles.message}>
      <p className={styles.messageTitle}>
        לא נמצא קבלן עם המספר{' '}
        <span dir="ltr" className={styles.digits}>
          {query.value}
        </span>
      </p>
      <ul className={styles.tips}>
        <li>בדקו את הספרות מול רישיון הקבלן.</li>
        {query.kind === 'entity' ? (
          <li>קבלן שהוא אדם פרטי רשום בפנקס בלי מספר ח.פ. חפשו אותו לפי שם או לפי מספר קבלן.</li>
        ) : null}
        <li>
          אפשר לבדוק גם ב
          <a href={REGISTRAR_URL} target="_blank" rel="noopener">
            אתר רשם הקבלנים
          </a>
          , שמתעדכן מדי יום.
        </li>
      </ul>
    </div>
  )
}

export default function ContractorLookup() {
  const [value, setValue] = useState('')
  const [fieldError, setFieldError] = useState('')
  const [phase, setPhase] = useState<Phase>({ kind: 'idle' })
  const [selected, setSelected] = useState<string | null>(null)
  const [dataDate, setDataDate] = useState('')
  const [announcement, setAnnouncement] = useState('')
  const controllerRef = useRef<AbortController | null>(null)
  const timersRef = useRef<number[]>([])
  const lastQueryRef = useRef<ValidQuery | null>(null)
  const dataDateRequested = useRef(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const cardRef = useRef<HTMLDivElement>(null)
  const fieldId = useId()
  const hintId = `${fieldId}-hint`
  const errorId = `${fieldId}-error`
  const listLabelId = `${fieldId}-list`

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

  const requestDataDate = () => {
    if (dataDateRequested.current) return
    dataDateRequested.current = true
    fetchContractorsDataDate(new AbortController().signal).then((date) => {
      if (date) setDataDate(date)
      else dataDateRequested.current = false
    })
  }

  const run = (query: ValidQuery) => {
    controllerRef.current?.abort('superseded')
    clearTimers()
    const controller = new AbortController()
    controllerRef.current = controller
    lastQueryRef.current = query
    setPhase({ kind: 'loading', slow: false })
    setSelected(null)
    setAnnouncement('מחפש בפנקס הקבלנים')
    timersRef.current = [
      window.setTimeout(() => {
        setPhase((current) => (current.kind === 'loading' ? { ...current, slow: true } : current))
      }, SLOW_AFTER_MS),
      window.setTimeout(() => controller.abort(TIMEOUT_REASON), REQUEST_TIMEOUT_MS),
    ]
    requestDataDate()

    searchContractors(query, controller.signal).then((result) => {
      if (controllerRef.current !== controller) return
      controllerRef.current = null
      clearTimers()
      if (!result.ok) {
        if (result.failure === 'aborted') return
        setPhase({ kind: 'failed', failure: result.failure })
        setAnnouncement(contractorFailureText[result.failure])
        return
      }
      setPhase({ kind: 'done', query, contractors: result.contractors, more: result.more })
      if (result.contractors.length === 1) setSelected(result.contractors[0].number)
      setAnnouncement(contractorsAnnouncement(result.contractors, result.more))
      window.gtag?.('event', 'contractor_registry_search', { by: query.kind, found: result.contractors.length > 0 })
    })
  }

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const query = checkContractorQuery(value)
    if (query.kind === 'empty' || query.kind === 'invalid') {
      setFieldError(query.kind === 'empty' ? 'הקלידו שם קבלן, מספר קבלן או ח.פ.' : query.message)
      inputRef.current?.focus()
      return
    }
    setFieldError('')
    run(query)
  }

  const choose = (contractor: Contractor) => {
    setSelected(contractor.number)
    setAnnouncement(`מוצגים הפרטים של ${contractor.name}`)
    if (window.matchMedia('(max-width: 1023px)').matches) {
      const smooth = !window.matchMedia('(prefers-reduced-motion: reduce)').matches
      cardRef.current?.scrollIntoView({ block: 'start', behavior: smooth ? 'smooth' : 'auto' })
    }
  }

  const contractors = phase.kind === 'done' ? phase.contractors : []
  const current = contractors.find((contractor) => contractor.number === selected) ?? null
  const showList = contractors.length > 1
  const listLabel =
    phase.kind === 'done' && phase.more
      ? `יש יותר מ-${RESULTS_LIMIT} קבלנים כאלה, ומוצגים ${RESULTS_LIMIT} מהם. הוסיפו מילה מהשם כדי לצמצם.`
      : `נמצאו ${contractors.length} קבלנים`

  let body: ReactNode
  if (phase.kind === 'idle') {
    body = (
      <p className={styles.prompt}>
        הקלידו שם, מספר קבלן או ח.פ. ולחצו על חיפוש. נראה אם הקבלן רשום, באילו ענפים, ומה הסיווג שלו בכל ענף.
      </p>
    )
  } else if (phase.kind === 'loading') {
    body = (
      <div className={styles.loading}>
        <span className={styles.spinner} aria-hidden="true" />
        <div>
          <p className={styles.loadingTitle}>מחפש בפנקס הקבלנים</p>
          {phase.slow ? <p className={styles.loadingNote}>המאגר הממשלתי עונה לאט כרגע. ממתינים עד 15 שניות.</p> : null}
        </div>
      </div>
    )
  } else if (phase.kind === 'failed') {
    body = (
      <div className={`${styles.message} ${styles.problem}`}>
        <p>{contractorFailureText[phase.failure]}</p>
        <button
          type="button"
          className={ui.secondary}
          onClick={() => lastQueryRef.current && run(lastQueryRef.current)}
        >
          <RotateCcw aria-hidden="true" />
          ניסיון נוסף
        </button>
      </div>
    )
  } else if (!contractors.length) {
    body = <NotFound query={phase.query} />
  } else if (current) {
    body = (
      <>
        <ContractorCard contractor={current} dataDate={dataDate} />
        <div className={ui.actions}>
          <a
            className={`${ui.secondary} ${styles.linkButton}`}
            href={recordUrl(current.number)}
            target="_blank"
            rel="noopener"
          >
            <ExternalLink aria-hidden="true" />
            הרישום הרשמי באתר רשם הקבלנים
          </a>
        </div>
      </>
    )
  } else {
    body = <p className={styles.prompt}>בחרו קבלן מהרשימה כדי לראות את הענפים והסיווג שלו.</p>
  }

  return (
    <section className={`${ui.tool} ${styles.lookup}`} aria-label="בדיקת קבלן רשום בפנקס הקבלנים">
      <div className={`${ui.inner} ${styles.layout}`}>
        <form className={ui.form} onSubmit={onSubmit} noValidate>
          <fieldset className={ui.group}>
            <legend className={ui.legend}>הקבלן</legend>
            <div className={ui.field}>
              <label htmlFor={fieldId} className={ui.label}>
                שם, מספר קבלן או ח.פ.
              </label>
              <p id={hintId} className={ui.hint}>
                מספיקה מילה אחת מהשם. קבלן פרטי רשום לפי שם משפחה ושם פרטי.
              </p>
              <div className={styles.searchRow}>
                <input
                  ref={inputRef}
                  id={fieldId}
                  className={ui.input}
                  type="search"
                  autoComplete="off"
                  autoCorrect="off"
                  spellCheck={false}
                  enterKeyHint="search"
                  maxLength={80}
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
                  חיפוש
                </button>
              </div>
              {fieldError ? (
                <div id={errorId} className={styles.error}>
                  <p>{fieldError}</p>
                </div>
              ) : null}
            </div>
          </fieldset>

          {showList ? (
            <div className={styles.results}>
              <p id={listLabelId} className={styles.resultsLabel}>
                {listLabel}
              </p>
              <ul className={styles.list} aria-labelledby={listLabelId}>
                {contractors.map((contractor) => (
                  <li key={contractor.number}>
                    <button
                      type="button"
                      className={styles.result}
                      aria-pressed={selected === contractor.number}
                      onClick={() => choose(contractor)}
                    >
                      <span className={styles.resultName}>{contractor.name}</span>
                      <span className={styles.resultMeta}>
                        <span dir="ltr" className={styles.digits}>
                          {contractor.number}
                        </span>
                        <span className={styles.resultStatus}>
                          {[contractor.city, contractor.licenses[0]?.branch].filter(Boolean).join(', ')}
                        </span>
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </form>

        <div className={ui.output}>
          <div className={`${ui.sticky} ${styles.scrollTarget}`} ref={cardRef}>
            <h2 className={ui.outputTitle}>התוצאה</h2>
            <div aria-busy={phase.kind === 'loading'}>{body}</div>
            <p className={styles.srOnly} role="status" aria-live="polite">
              {announcement}
            </p>
            <p className={ui.note}>
              החיפוש עובר ישירות מהדפדפן שלכם למאגר הפתוח של משרד הבינוי והשיכון ב-data.gov.il. אנחנו לא שומרים את מה
              שחיפשתם.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
