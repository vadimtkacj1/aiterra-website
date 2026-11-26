'use client'

import { useEffect, useId, useRef, useState, type FormEvent, type ReactNode } from 'react'
import { ExternalLink, RotateCcw, Search } from 'lucide-react'
import { REQUEST_TIMEOUT_MS, SLOW_AFTER_MS, TIMEOUT_REASON, type LookupFailure } from '@/lib/company-lookup'
import {
  BROKERS_REGISTER_URL,
  checkBrokerQuery,
  fetchBrokersDataDate,
  searchBrokers,
  type Broker,
  type BrokerQueryProblem,
  type ValidBrokerQuery,
} from '@/lib/broker-registry'
import ui from './toolUi.module.css'
import styles from './CompanyLookup.module.css'

type Failure = Exclude<LookupFailure, 'aborted'>

export type BrokerCopy = {
  sectionLabel: string
  legend: string
  fieldLabel: string
  fieldHint: string
  submit: string
  emptyError: string
  invalidError: (problem: BrokerQueryProblem, digits: number) => string
  resultTitle: string
  idle: string
  searching: string
  slow: string
  retry: string
  failure: Record<Failure, string>
  badge: string
  licenseLabel: string
  source: (dataDate: string) => string
  compare: string
  registerLink: string
  choose: string
  listLabel: (count: number, more: boolean) => string
  showing: (name: string) => string
  announce: (brokers: Broker[], more: boolean) => string
  notFoundName: { title: string; tips: string[] }
  notFoundLicense: {
    title: string
    tips: string[]
    registerTip: { before: string; link: string; after: string }
  }
  privacy: string
}

type Phase =
  | { kind: 'idle' }
  | { kind: 'loading'; slow: boolean }
  | { kind: 'failed'; failure: Failure }
  | { kind: 'done'; query: ValidBrokerQuery; brokers: Broker[]; more: boolean }

function BrokerCard({ broker, dataDate, copy }: { broker: Broker; dataDate: string; copy: BrokerCopy }) {
  return (
    <article className={`${styles.card} ${styles.toneActive}`}>
      <p className={`${styles.badge} ${styles.toneActive}`}>{copy.badge}</p>
      <h3 className={styles.name} dir="auto">
        {broker.name}
      </h3>
      <dl className={styles.facts}>
        <div className={styles.fact}>
          <dt>{copy.licenseLabel}</dt>
          <dd>
            <span dir="ltr" className={styles.digits}>
              {broker.license}
            </span>
          </dd>
        </div>
      </dl>
      <p className={styles.source}>{copy.source(dataDate)}</p>
    </article>
  )
}

function NotFound({ query, copy }: { query: ValidBrokerQuery; copy: BrokerCopy }) {
  if (query.kind === 'name') {
    return (
      <div className={styles.message}>
        <p className={styles.messageTitle}>{copy.notFoundName.title}</p>
        <ul className={styles.tips}>
          {copy.notFoundName.tips.map((tip) => (
            <li key={tip}>{tip}</li>
          ))}
        </ul>
      </div>
    )
  }
  const { title, tips, registerTip } = copy.notFoundLicense
  return (
    <div className={styles.message}>
      <p className={styles.messageTitle}>
        {title}{' '}
        <span dir="ltr" className={styles.digits}>
          {query.value}
        </span>
      </p>
      <ul className={styles.tips}>
        {tips.map((tip) => (
          <li key={tip}>{tip}</li>
        ))}
        <li>
          {registerTip.before}
          <a href={BROKERS_REGISTER_URL} target="_blank" rel="noopener">
            {registerTip.link}
          </a>
          {registerTip.after}
        </li>
      </ul>
    </div>
  )
}

export default function BrokerLookupView({ copy }: { copy: BrokerCopy }) {
  const [value, setValue] = useState('')
  const [fieldError, setFieldError] = useState('')
  const [phase, setPhase] = useState<Phase>({ kind: 'idle' })
  const [selected, setSelected] = useState<string | null>(null)
  const [dataDate, setDataDate] = useState('')
  const [announcement, setAnnouncement] = useState('')
  const controllerRef = useRef<AbortController | null>(null)
  const timersRef = useRef<number[]>([])
  const lastQueryRef = useRef<ValidBrokerQuery | null>(null)
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
    fetchBrokersDataDate(new AbortController().signal).then((date) => {
      if (date) setDataDate(date)
      else dataDateRequested.current = false
    })
  }

  const run = (query: ValidBrokerQuery) => {
    controllerRef.current?.abort('superseded')
    clearTimers()
    const controller = new AbortController()
    controllerRef.current = controller
    lastQueryRef.current = query
    setPhase({ kind: 'loading', slow: false })
    setSelected(null)
    setAnnouncement(copy.searching)
    timersRef.current = [
      window.setTimeout(() => {
        setPhase((current) => (current.kind === 'loading' ? { ...current, slow: true } : current))
      }, SLOW_AFTER_MS),
      window.setTimeout(() => controller.abort(TIMEOUT_REASON), REQUEST_TIMEOUT_MS),
    ]
    requestDataDate()

    searchBrokers(query, controller.signal).then((result) => {
      if (controllerRef.current !== controller) return
      controllerRef.current = null
      clearTimers()
      if (!result.ok) {
        if (result.failure === 'aborted') return
        setPhase({ kind: 'failed', failure: result.failure })
        setAnnouncement(copy.failure[result.failure])
        return
      }
      setPhase({ kind: 'done', query, brokers: result.brokers, more: result.more })
      if (result.brokers.length === 1) setSelected(result.brokers[0].license)
      setAnnouncement(copy.announce(result.brokers, result.more))
      window.gtag?.('event', 'broker_license_search', { by: query.kind, found: result.brokers.length > 0 })
    })
  }

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const query = checkBrokerQuery(value)
    if (query.kind === 'empty' || query.kind === 'invalid') {
      setFieldError(query.kind === 'empty' ? copy.emptyError : copy.invalidError(query.problem, query.digits))
      inputRef.current?.focus()
      return
    }
    setFieldError('')
    run(query)
  }

  const choose = (broker: Broker) => {
    setSelected(broker.license)
    setAnnouncement(copy.showing(broker.name))
    if (window.matchMedia('(max-width: 1023px)').matches) {
      const smooth = !window.matchMedia('(prefers-reduced-motion: reduce)').matches
      cardRef.current?.scrollIntoView({ block: 'start', behavior: smooth ? 'smooth' : 'auto' })
    }
  }

  const brokers = phase.kind === 'done' ? phase.brokers : []
  const current = brokers.find((broker) => broker.license === selected) ?? null
  const showList = brokers.length > 1

  let body: ReactNode
  if (phase.kind === 'idle') {
    body = <p className={styles.prompt}>{copy.idle}</p>
  } else if (phase.kind === 'loading') {
    body = (
      <div className={styles.loading}>
        <span className={styles.spinner} aria-hidden="true" />
        <div>
          <p className={styles.loadingTitle}>{copy.searching}</p>
          {phase.slow ? <p className={styles.loadingNote}>{copy.slow}</p> : null}
        </div>
      </div>
    )
  } else if (phase.kind === 'failed') {
    body = (
      <div className={`${styles.message} ${styles.problem}`}>
        <p>{copy.failure[phase.failure]}</p>
        <button type="button" className={ui.secondary} onClick={() => lastQueryRef.current && run(lastQueryRef.current)}>
          <RotateCcw aria-hidden="true" />
          {copy.retry}
        </button>
      </div>
    )
  } else if (!brokers.length) {
    body = <NotFound query={phase.query} copy={copy} />
  } else if (current) {
    body = (
      <>
        <BrokerCard broker={current} dataDate={dataDate} copy={copy} />
        <p className={ui.note}>{copy.compare}</p>
        <div className={ui.actions}>
          <a className={`${ui.secondary} ${styles.linkButton}`} href={BROKERS_REGISTER_URL} target="_blank" rel="noopener">
            <ExternalLink aria-hidden="true" />
            {copy.registerLink}
          </a>
        </div>
      </>
    )
  } else {
    body = <p className={styles.prompt}>{copy.choose}</p>
  }

  return (
    <section className={`${ui.tool} ${styles.lookup}`} aria-label={copy.sectionLabel}>
      <div className={`${ui.inner} ${styles.layout}`}>
        <form className={ui.form} onSubmit={onSubmit} noValidate>
          <fieldset className={ui.group}>
            <legend className={ui.legend}>{copy.legend}</legend>
            <div className={ui.field}>
              <label htmlFor={fieldId} className={ui.label}>
                {copy.fieldLabel}
              </label>
              <p id={hintId} className={ui.hint}>
                {copy.fieldHint}
              </p>
              <div className={styles.searchRow}>
                <input
                  ref={inputRef}
                  id={fieldId}
                  className={ui.input}
                  type="search"
                  dir="auto"
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
                  {copy.submit}
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
                {copy.listLabel(brokers.length, phase.kind === 'done' && phase.more)}
              </p>
              <ul className={styles.list} aria-labelledby={listLabelId}>
                {brokers.map((broker) => (
                  <li key={broker.license}>
                    <button
                      type="button"
                      className={styles.result}
                      aria-pressed={selected === broker.license}
                      onClick={() => choose(broker)}
                    >
                      <span className={styles.resultName} dir="auto">
                        {broker.name}
                      </span>
                      <span className={styles.resultMeta}>
                        <span dir="ltr" className={styles.digits}>
                          {broker.license}
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
            <h2 className={ui.outputTitle}>{copy.resultTitle}</h2>
            <div aria-busy={phase.kind === 'loading'}>{body}</div>
            <p className={styles.srOnly} role="status" aria-live="polite">
              {announcement}
            </p>
            <p className={ui.note}>{copy.privacy}</p>
          </div>
        </div>
      </div>
    </section>
  )
}
