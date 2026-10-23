'use client'

import { useEffect, useId, useRef, useState, type FormEvent, type ReactNode } from 'react'
import { Copy, ExternalLink, RotateCcw, Search } from 'lucide-react'
import {
  COMPANY_PREFIXES,
  EXTRACT_FEE,
  ICA_SEARCH_URL,
  NAME_DEBOUNCE_MS,
  NAME_RESULTS_LIMIT,
  REQUEST_TIMEOUT_MS,
  SLOW_AFTER_MS,
  TIMEOUT_REASON,
  VAT_DEALER_URL,
  buildNameQuery,
  fetchDataDate,
  fetchRecords,
  isPublicType,
  nameSearchUrl,
  numberSearchUrl,
  rankByName,
  statusInfo,
  toCompany,
  toneOf,
  type Company,
  type LookupFailure,
  type LookupMode,
  type Tone,
} from '@/lib/company-lookup'
import { isValidId } from '@/lib/id-number'
import { statusNamesEn } from './companyStatusesEn'
import ui from '../../../../(he)/(site)/components/tools/toolUi.module.css'
import styles from '../../../../(he)/(site)/components/tools/CompanyLookup.module.css'

type SearchRequest = { by: LookupMode; url: string; searched: string }

type Phase =
  | { kind: 'idle' }
  | { kind: 'loading'; by: LookupMode; slow: boolean }
  | { kind: 'failed'; by: LookupMode; failure: Exclude<LookupFailure, 'aborted'> }
  | { kind: 'done'; by: LookupMode; searched: string; companies: Company[]; more: boolean }

type FieldError = { message: string; hint: 'vat' | null }

const SEPARATORS = /[\s\-‐-―־./‎‏‪-‮]/g

const subStatusesEn: Record<string, { name: string; text: string }> = {
  'בהליכי מחיקה': {
    name: 'Being struck off',
    text: 'The Registrar published an intention to strike the company off. Anyone who may be harmed can object within 90 days of publication.',
  },
  'מחוסלת עקב מיזוג': { name: 'Dissolved by merger', text: '' },
  'מחוסלת עקב מחיקה': { name: 'Dissolved by strike-off', text: 'The company was struck off the register, so it counts as dissolved.' },
  'בפרוק מרצון בהליך מזורז': {
    name: 'Fast-track voluntary liquidation',
    text: 'A shortened voluntary liquidation for a company with no assets, no debts and no legal proceedings.',
  },
  'צו לפתיחת הליכים': {
    name: 'Insolvency proceedings opened',
    text: 'A court declared the company insolvent and opened insolvency proceedings.',
  },
  'צו לפתיחת הליכים - תאגיד בשיקום': {
    name: 'Insolvency proceedings: rehabilitation',
    text: 'Insolvency proceedings were opened, on a rehabilitation track rather than liquidation.',
  },
  'בקשת נושים בהחייאה': { name: 'Creditors applied for restoration', text: 'Creditors applied to restore the company to the register.' },
  'בקשת חברה בהחייאה': { name: 'Company applied for restoration', text: 'An application was filed on the company\'s behalf to restore it to the register.' },
  'הוגשה בקשה להחייאה': { name: 'Restoration applied for', text: 'An application was filed to restore the company to the register.' },
  'הוגשה בקשת מיזוג - מיועדת להתמזג': {
    name: 'Merger filed: to be absorbed',
    text: 'A merger proposal was filed under which the company will merge into another and be dissolved.',
  },
  'הוגשה בקשת מיזוג - מיועדת לקלוט': {
    name: 'Merger filed: absorbing company',
    text: 'A merger proposal was filed under which the company will absorb another company.',
  },
  'תצהיר כושר פירעון': {
    name: 'Solvency declaration',
    text: 'The directors declared the company can pay all its debts. This is the step before a decision on voluntary liquidation.',
  },
}

const typesEn: Record<string, { label: string; text: string }> = {
  'ישראלית חברה פרטית': { label: 'Private company', text: 'Its shares are not traded on the stock exchange and were not offered to the public.' },
  'ישראלית חברה ציבורית': { label: 'Public company', text: 'Its shares are traded on the stock exchange or were offered to the public in a prospectus.' },
  'ישראלית חברה אגח': { label: 'Bond company', text: 'A company whose bonds are traded on the stock exchange or were offered to the public.' },
  'חוץ חברה פרטית': {
    label: 'Foreign company',
    text: 'A body incorporated outside Israel and registered here because it has a place of business in Israel.',
  },
  'חוץ חברה ציבורית': {
    label: 'Foreign public company',
    text: 'A body incorporated outside Israel and registered here because it has a place of business in Israel.',
  },
}

const liabilityEn: Record<string, string> = { 'מוגבלת': 'Limited', 'לא מוגבלת': 'Unlimited' }

const violationEn = {
  violator: {
    title: 'Registered as a violating company (mafra chok)',
    text: 'The Registrar recorded that the company did not pay its annual fee or did not file an annual report, under section 362A of the Companies Law. While the record stands, the Registrar may refuse to register charges and changes such as a change of name, and after a year on the record, under further conditions, may also strike it off.',
  },
  warning: {
    title: 'Warning before registration as a violating company',
    text: 'The Registrar recorded a warning that it intends to register the company as a violator, because of the annual fee or annual report. If the company does not fix this within 30 days of the warning, it will be registered as a violator.',
  },
}

const failureTextEn: Record<Exclude<LookupFailure, 'aborted'>, string> = {
  network: 'We could not connect to the data.gov.il database. Check your internet connection and try again.',
  timeout: 'The government database did not respond within 15 seconds. This happens when it is busy. Try again in a moment.',
  blocked: 'The data.gov.il database temporarily blocked the search, probably because of many searches in a row. Wait a minute and try again.',
  server: 'The data.gov.il database is not available right now. Try again in a few minutes.',
  format: 'The database returned a response we could not read. Try again, and if it keeps happening, search on the Registrar of Companies website.',
}

const corporateLabelsEn: Record<string, string> = {
  '53': 'a foreign partnership registered in Israel',
  '54': 'an Israeli partnership',
  '55': 'an Israeli partnership',
  '58': 'a non-profit (amuta)',
}

const statusName = (status: string) => statusNamesEn[status]?.name ?? status
const typeEn = (type: string) => typesEn[type] ?? { label: type, text: '' }
const addressEn = (address: string) => address.replace(/מיקוד /g, 'Postcode ')

const statusLine = (company: Company) =>
  `${statusName(company.status)}${company.violation === 'violator' ? ', violating company' : ''}`

const checkNumberEn = (raw: string): { kind: 'empty' } | ({ kind: 'invalid' } & FieldError) | { kind: 'valid'; number: string } => {
  const digits = raw.replace(SEPARATORS, '')
  if (!digits) return { kind: 'empty' }
  if (!/^\d+$/.test(digits)) {
    return { kind: 'invalid', message: 'A company number has digits only. To search by name, choose By company name.', hint: null }
  }
  if (digits.length !== 9) {
    return { kind: 'invalid', message: `A company number has 9 digits, and you typed ${digits.length}.`, hint: null }
  }
  if (!isValidId(digits)) {
    return {
      kind: 'invalid',
      message:
        'The check digit, the last digit, does not match the number, so it probably has a typo. Check it against an invoice or a document from the company.',
      hint: null,
    }
  }
  const prefix = digits.slice(0, 2)
  if (COMPANY_PREFIXES.includes(prefix)) return { kind: 'valid', number: digits }
  if (corporateLabelsEn[prefix]) {
    return {
      kind: 'invalid',
      message: `By the prefix ${prefix}, this is the number of ${corporateLabelsEn[prefix]}. The tool searches the companies database, where numbers start with 51, 52 or 56. Partnerships and non-profits are in other Corporations Authority databases.`,
      hint: null,
    }
  }
  if (digits.startsWith('5')) {
    return {
      kind: 'invalid',
      message: 'The number starts with 5 like corporate numbers, but the companies database only has numbers starting with 51, 52 or 56.',
      hint: null,
    }
  }
  return {
    kind: 'invalid',
    message:
      'A number that does not start with 5 is not a company number. An osek murshe or osek patur who is a private person is registered under their ID number, which you check with the Israel Tax Authority.',
    hint: 'vat',
  }
}

const companyToTextEn = (company: Company, dataDate: string) =>
  [
    company.englishName,
    company.name,
    `Company number: ${company.number}`,
    `Type: ${typeEn(company.type).label}`,
    `Status: ${statusLine(company)}`,
    company.founded ? `Incorporated: ${company.founded}` : '',
    company.address ? `Address: ${addressEn(company.address)}` : '',
    company.lastReportYear ? `Last annual report: ${company.lastReportYear}` : '',
    `Source: Registrar of Companies database on data.gov.il${dataDate ? `, data as of ${dataDate}` : ''}`,
  ]
    .filter(Boolean)
    .join('\n')

const announcementEn = (by: LookupMode, companies: Company[], more: boolean) => {
  if (!companies.length) return by === 'number' ? 'No company found with this number' : 'No companies found with this name'
  if (by === 'number' || companies.length === 1) {
    const company = companies[0]
    return `Company found: ${company.englishName || company.name}, status ${statusLine(company)}`
  }
  return more ? `More than ${NAME_RESULTS_LIMIT} companies found` : `${companies.length} companies found`
}

const modes: { id: LookupMode; label: string; hint: string }[] = [
  { id: 'number', label: 'By company number', hint: '9 digits, starts with 5' },
  { id: 'name', label: 'By company name', hint: 'In Hebrew or English' },
]

const fields: Record<LookupMode, { label: string; hint: string }> = {
  number: {
    label: 'Company number (H.P.)',
    hint: 'Dashes and spaces are fine. We check the check digit first.',
  },
  name: {
    label: 'Company name',
    hint: 'One word from the name is enough. No need to type Ltd.',
  },
}

const prompts: Record<LookupMode, string> = {
  number: 'Enter a company number and press Search. You will see whether the company is active, struck off, in liquidation or a violator, and its details.',
  name: 'Type at least 2 letters of the company name. Matching companies appear under the field.',
}

const toneClass: Record<Tone, string> = {
  active: styles.toneActive,
  caution: styles.toneCaution,
  ended: styles.toneEnded,
  unknown: styles.toneUnknown,
}

export function CompanyDetailsEn({
  company,
  dataDate,
  headingLevel = 3,
}: {
  company: Company
  dataDate: string
  headingLevel?: 3 | 4
}) {
  const status = statusInfo(company.status)
  const statusEn = statusNamesEn[company.status]
  const type = typeEn(company.type)
  const Heading = headingLevel === 4 ? 'h4' : 'h3'
  const violation = company.violation === 'none' ? null : violationEn[company.violation]

  return (
    <article className={`${styles.card} ${toneClass[toneOf(company)]}`}>
      <p className={`${styles.badge} ${toneClass[status.tone]}`}>{statusName(company.status)}</p>
      <Heading className={styles.name}>{company.englishName || company.name}</Heading>
      {company.englishName ? (
        <p className={styles.english} dir="rtl" lang="he">
          {company.name}
        </p>
      ) : null}
      {violation ? (
        <div className={styles.violation}>
          <p className={styles.violationTitle}>{violation.title}</p>
          <p className={styles.violationText}>{violation.text}</p>
        </div>
      ) : null}
      <p className={styles.statusText}>
        {statusEn?.text ??
          'This status did not appear in the database when we built the tool. To understand it, order a company extract or contact the Registrar of Companies.'}
      </p>
      {company.subStatuses.map((subStatus) => (
        <p key={subStatus} className={styles.subStatus}>
          <strong>{subStatusesEn[subStatus]?.name ?? subStatus}.</strong> {subStatusesEn[subStatus]?.text ?? ''}
        </p>
      ))}
      <dl className={styles.facts}>
        <div className={styles.fact}>
          <dt>Company number</dt>
          <dd>
            <span className={styles.digits}>{company.number}</span>
          </dd>
        </div>
        <div className={styles.fact}>
          <dt>Type</dt>
          <dd>
            {type.label}
            {type.text ? <span className={styles.factNote}>{type.text}</span> : null}
          </dd>
        </div>
        {company.founded ? (
          <div className={styles.fact}>
            <dt>Incorporated</dt>
            <dd>{company.founded}</dd>
          </div>
        ) : null}
        {company.address || company.careOf || company.poBox ? (
          <div className={styles.fact}>
            <dt>Registered address</dt>
            <dd>
              <span dir="auto">{addressEn(company.address)}</span>
              {company.poBox ? <span className={styles.factNote}>PO Box {company.poBox}</span> : null}
              {company.careOf ? (
                <span className={styles.factNote}>
                  c/o: <span dir="auto">{company.careOf}</span>
                </span>
              ) : null}
            </dd>
          </div>
        ) : null}
        {company.lastReportYear ? (
          <div className={styles.fact}>
            <dt>Last annual report filed</dt>
            <dd>
              {company.lastReportYear}
              {isPublicType(company.type) ? (
                <span className={styles.factNote}>
                  A company that is a reporting corporation on the stock exchange does not file an annual report with
                  the Registrar, so this year says nothing about its condition.
                </span>
              ) : null}
            </dd>
          </div>
        ) : null}
        {company.liability ? (
          <div className={styles.fact}>
            <dt>Shareholder liability</dt>
            <dd>{liabilityEn[company.liability] ?? company.liability}</dd>
          </div>
        ) : null}
        {company.government ? (
          <div className={styles.fact}>
            <dt>Government company</dt>
            <dd>Yes</dd>
          </div>
        ) : null}
        {company.purpose ? (
          <div className={styles.fact}>
            <dt>Purpose (in Hebrew)</dt>
            <dd dir="auto">{company.purpose}</dd>
          </div>
        ) : null}
        {company.description ? (
          <div className={styles.fact}>
            <dt>Description</dt>
            <dd dir="auto">{company.description}</dd>
          </div>
        ) : null}
      </dl>
      <p className={styles.source}>
        Source: Registrar of Companies database on data.gov.il{dataDate ? `, data as of ${dataDate}` : ''}.
      </p>
    </article>
  )
}

function NotFound({ by, searched }: { by: LookupMode; searched: string }) {
  if (by === 'name') {
    return (
      <div className={styles.message}>
        <p className={styles.messageTitle}>No companies found with this name</p>
        <ul className={styles.tips}>
          <li>Try one word from the name, the most distinctive one.</li>
          <li>Try another spelling, or the name in Hebrew.</li>
          <li>Partnerships and non-profits are not in the companies database.</li>
        </ul>
      </div>
    )
  }
  return (
    <div className={styles.message}>
      <p className={styles.messageTitle}>
        No company found with the number <span className={styles.digits}>{searched}</span>
      </p>
      <p>
        The number is valid, but it is not in the companies database. The company may have registered in the last few
        days, since the database updates once a day, or the number belongs to another kind of entity. You can also check
        on the{' '}
        <a href={ICA_SEARCH_URL} target="_blank" rel="noopener">
          Registrar of Companies website
        </a>
        .
      </p>
    </div>
  )
}

export default function CompanyLookupEn() {
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
    setAnnouncement('Searching the Registrar of Companies database')
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
        setAnnouncement(failureTextEn[result.failure])
        return
      }
      const found = result.records.map(toCompany)
      const companies = request.by === 'name' ? rankByName(found, request.searched) : found
      const shown = companies.slice(0, NAME_RESULTS_LIMIT)
      const more = companies.length > NAME_RESULTS_LIMIT
      setPhase({ kind: 'done', by: request.by, searched: request.searched, companies: shown, more })
      if (request.by === 'number' || shown.length === 1) setSelected(shown[0]?.number ?? null)
      setAnnouncement(announcementEn(request.by, shown, more))
      window.gtag?.('event', 'company_lookup_search', { by: request.by, found: shown.length > 0, locale: 'en' })
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
        setFieldError({ message: 'Type at least 2 letters of the company name.', hint: null })
        inputRef.current?.focus()
      }
      return
    }
    const check = checkNumberEn(value)
    if (check.kind !== 'valid') {
      setFieldError(
        check.kind === 'empty'
          ? { message: 'Enter the company number, 9 digits.', hint: null }
          : { message: check.message, hint: check.hint },
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
    setAnnouncement(`Showing details for ${company.englishName || company.name}`)
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
      await navigator.clipboard.writeText(companyToTextEn(current, dataDate))
      setCopyStatus('Details copied')
    } catch {
      setCopyStatus('Copying failed. Select the details and copy them manually.')
    }
  }

  const showList = mode === 'name' && phase.kind === 'done' && phase.by === 'name' && companies.length > 0
  const listLabel =
    phase.kind === 'done' && phase.more
      ? `More than ${NAME_RESULTS_LIMIT} companies match; showing ${NAME_RESULTS_LIMIT}. Add another word from the name to narrow it down.`
      : `${companies.length === 1 ? '1 company' : `${companies.length} companies`} found`

  let body: ReactNode
  if (phase.kind === 'idle') {
    body = <p className={styles.prompt}>{prompts[mode]}</p>
  } else if (phase.kind === 'loading') {
    body = (
      <div className={styles.loading}>
        <span className={styles.spinner} aria-hidden="true" />
        <div>
          <p className={styles.loadingTitle}>Searching the Registrar of Companies database</p>
          {phase.slow ? (
            <p className={styles.loadingNote}>The government database is slow right now. Waiting up to 15 seconds.</p>
          ) : null}
        </div>
      </div>
    )
  } else if (phase.kind === 'failed') {
    body = (
      <div className={`${styles.message} ${styles.problem}`}>
        <p>{failureTextEn[phase.failure]}</p>
        <button type="button" className={ui.secondary} onClick={retry}>
          <RotateCcw aria-hidden="true" />
          Try again
        </button>
      </div>
    )
  } else if (!companies.length) {
    body = <NotFound by={phase.by} searched={phase.searched} />
  } else if (current) {
    body = (
      <>
        <CompanyDetailsEn company={current} dataDate={dataDate} />
        <div className={ui.actions}>
          <button type="button" className={`${ui.primary} ${styles.grow}`} onClick={copy}>
            <Copy aria-hidden="true" />
            Copy the details
          </button>
          <a className={`${ui.secondary} ${styles.linkButton}`} href={ICA_SEARCH_URL} target="_blank" rel="noopener">
            <ExternalLink aria-hidden="true" />
            Official extract, ₪{EXTRACT_FEE}
          </a>
        </div>
        <p className={ui.status} role="status" aria-live="polite">
          {copyStatus}
        </p>
        <p className={ui.note}>
          A company extract (nesach chevra) is ordered on the Registrar of Companies website: find the company and choose
          to produce an extract. According to the site, it costs ₪{EXTRACT_FEE}.
        </p>
      </>
    )
  } else {
    body = <p className={styles.prompt}>Choose a company from the list to see its details.</p>
  }

  return (
    <section className={`${ui.tool} ${styles.lookup}`} aria-label="Israeli company lookup by number or name">
      <div className={`${ui.inner} ${styles.layout}`}>
        <form className={ui.form} onSubmit={onSubmit} noValidate>
          <fieldset className={ui.group}>
            <legend className={ui.legend}>How to search</legend>
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
            <legend className={ui.legend}>The company</legend>
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
                  dir="auto"
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
                  Search
                </button>
              </div>
              {fieldError ? (
                <div id={errorId} className={styles.error}>
                  <p>{fieldError.message}</p>
                  {fieldError.hint === 'vat' ? (
                    <a href={VAT_DEALER_URL} target="_blank" rel="noopener" className={styles.errorLink}>
                      Check a dealer with the Israel Tax Authority
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
                      <span className={styles.resultName} dir="auto">
                        {company.englishName || company.name}
                      </span>
                      <span className={styles.resultMeta}>
                        <span className={styles.digits}>{company.number}</span>
                        <span className={`${styles.resultStatus} ${toneClass[toneOf(company)]}`}>
                          {statusLine(company)}
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
            <h2 className={ui.outputTitle}>Result</h2>
            <div aria-busy={phase.kind === 'loading'}>{body}</div>
            <p className={styles.srOnly} role="status" aria-live="polite">
              {announcement}
            </p>
            <p className={ui.note}>
              The search goes straight from your browser to the Registrar of Companies open database on data.gov.il,
              which updates once a day. We do not store what you search for.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
