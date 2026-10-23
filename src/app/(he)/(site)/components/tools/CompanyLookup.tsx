'use client'

import { useEffect, useId, useRef, useState, type FormEvent, type ReactNode } from 'react'
import { Copy, ExternalLink, RotateCcw, Search } from 'lucide-react'
import {
  EXTRACT_FEE,
  ICA_SEARCH_URL,
  NAME_DEBOUNCE_MS,
  NAME_RESULTS_LIMIT,
  REQUEST_TIMEOUT_MS,
  SLOW_AFTER_MS,
  TIMEOUT_REASON,
  VAT_DEALER_URL,
  announcementFor,
  buildNameQuery,
  checkCompanyNumber,
  companyToText,
  failureText,
  fetchDataDate,
  fetchRecords,
  isPublicType,
  nameSearchUrl,
  numberSearchUrl,
  rankByName,
  statusInfo,
  subStatusText,
  toCompany,
  toneOf,
  typeInfo,
  violationText,
  type Company,
  type LookupFailure,
  type LookupMode,
  type Tone,
} from '@/lib/company-lookup'
import ui from './toolUi.module.css'
import styles from './CompanyLookup.module.css'

type SearchRequest = { by: LookupMode; url: string; searched: string }

type Phase =
  | { kind: 'idle' }
  | { kind: 'loading'; by: LookupMode; slow: boolean }
  | { kind: 'failed'; by: LookupMode; failure: Exclude<LookupFailure, 'aborted'> }
  | { kind: 'done'; by: LookupMode; searched: string; companies: Company[]; more: boolean }

type FieldError = { message: string; hint: 'vat' | null }

const modes: { id: LookupMode; label: string; hint: string }[] = [
  { id: 'number', label: 'לפי מספר ח.פ.', hint: '9 ספרות, מתחיל ב-5' },
  { id: 'name', label: 'לפי שם החברה', hint: 'בעברית או באנגלית' },
]

const fields: Record<LookupMode, { label: string; hint: string; button: string }> = {
  number: {
    label: 'מספר החברה (ח.פ.)',
    hint: 'אפשר להקליד עם מקפים או רווחים. נבדוק קודם את ספרת הביקורת.',
    button: 'חיפוש',
  },
  name: {
    label: 'שם החברה',
    hint: 'מספיקה מילה אחת מהשם. אין צורך להקליד בע״מ.',
    button: 'חיפוש',
  },
}

const prompts: Record<LookupMode, string> = {
  number: 'הקלידו מספר ח.פ. ולחצו על חיפוש. נראה אם החברה פעילה, מחוקה, בפירוק או מפרת חוק, ואת הפרטים שלה.',
  name: 'הקלידו לפחות 2 אותיות משם החברה. רשימת החברות שנמצאו תופיע מתחת לשדה.',
}

const toneClass: Record<Tone, string> = {
  active: styles.toneActive,
  caution: styles.toneCaution,
  ended: styles.toneEnded,
  unknown: styles.toneUnknown,
}

export function CompanyDetails({
  company,
  dataDate,
  headingLevel = 3,
}: {
  company: Company
  dataDate: string
  headingLevel?: 3 | 4
}) {
  const status = statusInfo(company.status)
  const type = typeInfo(company.type)
  const Heading = headingLevel === 4 ? 'h4' : 'h3'
  const violation = company.violation === 'none' ? null : violationText[company.violation]

  return (
    <article className={`${styles.card} ${toneClass[toneOf(company)]}`}>
      <p className={`${styles.badge} ${toneClass[status.tone]}`}>{company.status}</p>
      <Heading className={styles.name}>{company.name}</Heading>
      {company.englishName ? (
        <p className={styles.english} dir="ltr" lang="en">
          {company.englishName}
        </p>
      ) : null}
      {violation ? (
        <div className={styles.violation}>
          <p className={styles.violationTitle}>{violation.title}</p>
          <p className={styles.violationText}>{violation.text}</p>
        </div>
      ) : null}
      <p className={styles.statusText}>{status.text}</p>
      {company.subStatuses.map((subStatus) => (
        <p key={subStatus} className={styles.subStatus}>
          <strong>{subStatus}.</strong> {subStatusText(subStatus)}
        </p>
      ))}
      <dl className={styles.facts}>
        <div className={styles.fact}>
          <dt>מספר חברה</dt>
          <dd>
            <span dir="ltr" className={styles.digits}>
              {company.number}
            </span>
          </dd>
        </div>
        <div className={styles.fact}>
          <dt>סוג</dt>
          <dd>
            {type.label}
            {type.text ? <span className={styles.factNote}>{type.text}</span> : null}
          </dd>
        </div>
        {company.founded ? (
          <div className={styles.fact}>
            <dt>תאריך התאגדות</dt>
            <dd>{company.founded}</dd>
          </div>
        ) : null}
        {company.address || company.careOf || company.poBox ? (
          <div className={styles.fact}>
            <dt>כתובת רשומה</dt>
            <dd>
              {company.address}
              {company.poBox ? <span className={styles.factNote}>ת.ד. {company.poBox}</span> : null}
              {company.careOf ? <span className={styles.factNote}>אצל: {company.careOf}</span> : null}
            </dd>
          </div>
        ) : null}
        {company.lastReportYear ? (
          <div className={styles.fact}>
            <dt>דוח שנתי אחרון שהוגש</dt>
            <dd>
              {company.lastReportYear}
              {isPublicType(company.type) ? (
                <span className={styles.factNote}>
                  חברה שהיא תאגיד מדווח בבורסה לא חייבת להגיש לרשם דוח שנתי, ולכן השנה כאן לא מעידה על מצבה.
                </span>
              ) : null}
            </dd>
          </div>
        ) : null}
        {company.liability ? (
          <div className={styles.fact}>
            <dt>אחריות בעלי המניות</dt>
            <dd>{company.liability}</dd>
          </div>
        ) : null}
        {company.government ? (
          <div className={styles.fact}>
            <dt>חברה ממשלתית</dt>
            <dd>כן</dd>
          </div>
        ) : null}
        {company.purpose ? (
          <div className={styles.fact}>
            <dt>מטרה</dt>
            <dd>{company.purpose}</dd>
          </div>
        ) : null}
        {company.description ? (
          <div className={styles.fact}>
            <dt>תיאור</dt>
            <dd>{company.description}</dd>
          </div>
        ) : null}
      </dl>
      <p className={styles.source}>
        מקור: מאגר החברות של רשם החברות ב-data.gov.il{dataDate ? `, נתונים מעודכנים ל-${dataDate}` : ''}.
      </p>
    </article>
  )
}

function NotFound({ by, searched }: { by: LookupMode; searched: string }) {
  if (by === 'name') {
    return (
      <div className={styles.message}>
        <p className={styles.messageTitle}>לא נמצאו חברות בשם הזה</p>
        <ul className={styles.tips}>
          <li>נסו מילה אחת מהשם, הייחודית שבהן.</li>
          <li>נסו כתיב אחר, למשל עם יו״ד או בלי, או את השם באנגלית.</li>
          <li>שותפויות ועמותות לא נמצאות במאגר החברות.</li>
        </ul>
      </div>
    )
  }
  return (
    <div className={styles.message}>
      <p className={styles.messageTitle}>
        לא נמצאה חברה עם המספר{' '}
        <span dir="ltr" className={styles.digits}>
          {searched}
        </span>
      </p>
      <p>
        המספר תקין, אבל הוא לא מופיע במאגר החברות. ייתכן שהחברה נרשמה בימים האחרונים, כי המאגר מתעדכן פעם ביום, או
        שהמספר שייך לתאגיד אחר. אפשר לבדוק גם ב
        <a href={ICA_SEARCH_URL} target="_blank" rel="noopener">
          אתר רשם החברות
        </a>
        .
      </p>
    </div>
  )
}

export default function CompanyLookup() {
  const [mode, setMode] = useState<LookupMode>('number')
  const [values, setValues] = useState<Record<LookupMode, string>>({ number: '', name: '' })
  const [fieldError, setFieldError] = useState<FieldError | null>(null)
  const [phase, setPhase] = useState<Phase>({ kind: 'idle' })
  const [selected, setSelected] = useState<string | null>(null)
  const [dataDate, setDataDate] = useState('')
  const [announcement, setAnnouncement] = useState('')
  const [copyStatus, setCopyStatus] = useState('')
  const controllerRef = useRef<AbortController | null>(null)
  const debounceRef = useRef<number | undefined>(undefined)
  const timersRef = useRef<number[]>([])
  const lastRequestRef = useRef<SearchRequest | null>(null)
  const dataDateRequested = useRef(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const cardRef = useRef<HTMLDivElement>(null)
  const radioName = useId()
  const fieldId = useId()
  const hintId = `${fieldId}-hint`
  const errorId = `${fieldId}-error`
  const listLabelId = `${fieldId}-list`
  const field = fields[mode]
  const value = values[mode]

  const clearTimers = () => {
    timersRef.current.forEach((timer) => window.clearTimeout(timer))
    timersRef.current = []
  }

  useEffect(
    () => () => {
      controllerRef.current?.abort('unmount')
      window.clearTimeout(debounceRef.current)
      timersRef.current.forEach((timer) => window.clearTimeout(timer))
    },
    [],
  )

  const requestDataDate = () => {
    if (dataDateRequested.current) return
    dataDateRequested.current = true
    fetchDataDate(new AbortController().signal).then((date) => {
      if (date) setDataDate(date)
      else dataDateRequested.current = false
    })
  }

  const stop = () => {
    controllerRef.current?.abort('superseded')
    controllerRef.current = null
    clearTimers()
  }

  const run = (request: SearchRequest) => {
    stop()
    const controller = new AbortController()
    controllerRef.current = controller
    lastRequestRef.current = request
    setPhase({ kind: 'loading', by: request.by, slow: false })
    setSelected(null)
    setCopyStatus('')
    setAnnouncement('מחפש במאגר של רשם החברות')
    timersRef.current = [
      window.setTimeout(() => {
        setPhase((current) => (current.kind === 'loading' ? { ...current, slow: true } : current))
      }, SLOW_AFTER_MS),
      window.setTimeout(() => controller.abort(TIMEOUT_REASON), REQUEST_TIMEOUT_MS),
    ]
    requestDataDate()

    fetchRecords(request.url, controller.signal).then((result) => {
      if (controllerRef.current !== controller) return
      controllerRef.current = null
      clearTimers()
      if (!result.ok) {
        if (result.failure === 'aborted') return
        setPhase({ kind: 'failed', by: request.by, failure: result.failure })
        setAnnouncement(failureText[result.failure])
        return
      }
      const found = result.records.map(toCompany)
      const companies = request.by === 'name' ? rankByName(found, request.searched) : found
      const shown = companies.slice(0, NAME_RESULTS_LIMIT)
      const more = companies.length > NAME_RESULTS_LIMIT
      setPhase({ kind: 'done', by: request.by, searched: request.searched, companies: shown, more })
      if (request.by === 'number' || shown.length === 1) setSelected(shown[0]?.number ?? null)
      setAnnouncement(announcementFor(request.by, shown, more))
      window.gtag?.('event', 'company_lookup_search', { by: request.by, found: shown.length > 0 })
    })
  }

  const runName = (raw: string) => {
    const query = buildNameQuery(raw)
    if (!query) return false
    run({ by: 'name', url: nameSearchUrl(query), searched: raw.trim() })
    return true
  }

  const selectMode = (next: LookupMode) => {
    if (next === mode) return
    window.clearTimeout(debounceRef.current)
    stop()
    setMode(next)
    setPhase({ kind: 'idle' })
    setSelected(null)
    setFieldError(null)
    setCopyStatus('')
  }

  const onChange = (next: string) => {
    setValues((current) => ({ ...current, [mode]: next }))
    setFieldError(null)
    if (mode !== 'name') return
    window.clearTimeout(debounceRef.current)
    if (!buildNameQuery(next)) {
      stop()
      setPhase({ kind: 'idle' })
      setSelected(null)
      return
    }
    debounceRef.current = window.setTimeout(() => runName(next), NAME_DEBOUNCE_MS)
  }

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (mode === 'name') {
      window.clearTimeout(debounceRef.current)
      if (!runName(value)) {
        setFieldError({ message: 'הקלידו לפחות 2 אותיות משם החברה.', hint: null })
        inputRef.current?.focus()
      }
      return
    }
    const check = checkCompanyNumber(value)
    if (check.kind !== 'valid') {
      setFieldError(
        check.kind === 'empty' ? { message: 'הקלידו את מספר החברה, 9 ספרות.', hint: null } : check,
      )
      inputRef.current?.focus()
      return
    }
    setFieldError(null)
    run({ by: 'number', url: numberSearchUrl(check.number), searched: check.number })
  }

  const retry = () => {
    if (lastRequestRef.current) run(lastRequestRef.current)
  }

  const choose = (company: Company) => {
    setSelected(company.number)
    setCopyStatus('')
    setAnnouncement(`מוצגים הפרטים של ${company.name}`)
    if (window.matchMedia('(max-width: 1023px)').matches) {
      const smooth = !window.matchMedia('(prefers-reduced-motion: reduce)').matches
      cardRef.current?.scrollIntoView({ block: 'start', behavior: smooth ? 'smooth' : 'auto' })
    }
  }

  const companies = phase.kind === 'done' ? phase.companies : []
  const current = companies.find((company) => company.number === selected) ?? null

  const copy = async () => {
    if (!current) return
    try {
      await navigator.clipboard.writeText(companyToText(current, dataDate))
      setCopyStatus('הפרטים הועתקו')
    } catch {
      setCopyStatus('ההעתקה נכשלה. סמנו את הפרטים והעתיקו ידנית.')
    }
  }

  const showList = mode === 'name' && phase.kind === 'done' && phase.by === 'name' && companies.length > 0
  const listLabel =
    phase.kind === 'done' && phase.more
      ? `יש יותר מ-${NAME_RESULTS_LIMIT} חברות כאלה, ומוצגות ${NAME_RESULTS_LIMIT} מהן. הוסיפו מילה מהשם כדי לצמצם.`
      : `נמצאו ${companies.length === 1 ? 'חברה אחת' : `${companies.length} חברות`}`

  let body: ReactNode
  if (phase.kind === 'idle') {
    body = <p className={styles.prompt}>{prompts[mode]}</p>
  } else if (phase.kind === 'loading') {
    body = (
      <div className={styles.loading}>
        <span className={styles.spinner} aria-hidden="true" />
        <div>
          <p className={styles.loadingTitle}>מחפש במאגר של רשם החברות</p>
          {phase.slow ? <p className={styles.loadingNote}>המאגר הממשלתי עונה לאט כרגע. ממתינים עד 15 שניות.</p> : null}
        </div>
      </div>
    )
  } else if (phase.kind === 'failed') {
    body = (
      <div className={`${styles.message} ${styles.problem}`}>
        <p>{failureText[phase.failure]}</p>
        <button type="button" className={ui.secondary} onClick={retry}>
          <RotateCcw aria-hidden="true" />
          ניסיון נוסף
        </button>
      </div>
    )
  } else if (!companies.length) {
    body = <NotFound by={phase.by} searched={phase.searched} />
  } else if (current) {
    body = (
      <>
        <CompanyDetails company={current} dataDate={dataDate} />
        <div className={ui.actions}>
          <button type="button" className={`${ui.primary} ${styles.grow}`} onClick={copy}>
            <Copy aria-hidden="true" />
            העתקת הפרטים
          </button>
          <a className={`${ui.secondary} ${styles.linkButton}`} href={ICA_SEARCH_URL} target="_blank" rel="noopener">
            <ExternalLink aria-hidden="true" />
            נסח רשמי, {EXTRACT_FEE} ₪
          </a>
        </div>
        <p className={ui.status} role="status" aria-live="polite">
          {copyStatus}
        </p>
        <p className={ui.note}>
          נסח חברה מזמינים באתר רשם החברות: מחפשים את החברה ולוחצים על ״הפקת נסח חברה״. לפי האתר, העלות היא{' '}
          {EXTRACT_FEE} ₪.
        </p>
      </>
    )
  } else {
    body = <p className={styles.prompt}>בחרו חברה מהרשימה כדי לראות את הפרטים שלה.</p>
  }

  return (
    <section className={`${ui.tool} ${styles.lookup}`} aria-label="בדיקת חברה לפי ח.פ. או לפי שם">
      <div className={`${ui.inner} ${styles.layout}`}>
        <form className={ui.form} onSubmit={onSubmit} noValidate>
          <fieldset className={ui.group}>
            <legend className={ui.legend}>איך מחפשים</legend>
            <div className={styles.modes}>
              {modes.map((item) => (
                <label key={item.id} className={styles.mode}>
                  <input
                    type="radio"
                    name={radioName}
                    value={item.id}
                    checked={mode === item.id}
                    onChange={() => selectMode(item.id)}
                  />
                  <span className={styles.modeLabel}>{item.label}</span>
                  <span className={styles.modeHint}>{item.hint}</span>
                </label>
              ))}
            </div>
          </fieldset>

          <fieldset className={ui.group}>
            <legend className={ui.legend}>החברה</legend>
            <div className={ui.field}>
              <label htmlFor={fieldId} className={ui.label}>
                {field.label}
              </label>
              <p id={hintId} className={ui.hint}>
                {field.hint}
              </p>
              <div className={styles.searchRow}>
                <input
                  ref={inputRef}
                  key={mode}
                  id={fieldId}
                  className={`${ui.input} ${mode === 'number' ? `${ui.ltr} ${styles.digitsInput}` : ''}`}
                  type={mode === 'name' ? 'search' : 'text'}
                  inputMode={mode === 'number' ? 'numeric' : 'search'}
                  autoComplete="off"
                  autoCorrect="off"
                  spellCheck={false}
                  enterKeyHint="search"
                  maxLength={mode === 'number' ? 24 : 80}
                  data-lpignore="true"
                  data-1p-ignore=""
                  value={value}
                  aria-invalid={fieldError ? true : undefined}
                  aria-describedby={fieldError ? `${hintId} ${errorId}` : hintId}
                  onChange={(event) => onChange(event.target.value)}
                />
                <button type="submit" className={`${ui.primary} ${styles.submit}`}>
                  <Search aria-hidden="true" />
                  {field.button}
                </button>
              </div>
              {fieldError ? (
                <div id={errorId} className={styles.error}>
                  <p>{fieldError.message}</p>
                  {fieldError.hint === 'vat' ? (
                    <a href={VAT_DEALER_URL} target="_blank" rel="noopener" className={styles.errorLink}>
                      בדיקת עוסק ברשות המסים
                    </a>
                  ) : null}
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
                {companies.map((company) => (
                  <li key={company.number}>
                    <button
                      type="button"
                      className={styles.result}
                      aria-pressed={selected === company.number}
                      onClick={() => choose(company)}
                    >
                      <span className={styles.resultName}>{company.name}</span>
                      <span className={styles.resultMeta}>
                        <span dir="ltr" className={styles.digits}>
                          {company.number}
                        </span>
                        <span className={`${styles.resultStatus} ${toneClass[toneOf(company)]}`}>
                          {company.status}
                          {company.violation === 'violator' ? ', מפרת חוק' : ''}
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
              החיפוש עובר ישירות מהדפדפן שלכם למאגר הפתוח של רשם החברות ב-data.gov.il, שמתעדכן פעם ביום. אנחנו לא
              שומרים את מה שחיפשתם.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
