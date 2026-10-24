'use client'

import { useEffect, useId, useRef, useState, type FormEvent, type ReactNode } from 'react'
import Link from 'next/link'
import { Copy, ExternalLink, MapPin, RotateCcw, Search } from 'lucide-react'
import {
  RESULTS_LIMIT,
  REQUEST_TIMEOUT_MS,
  SLOW_AFTER_MS,
  STATIC_BANKS,
  TIMEOUT_REASON,
  announcementFor,
  bankLabel,
  branchToText,
  checkQuery,
  failureText,
  isClosed,
  loadBranches,
  mapUrl,
  phoneHref,
  searchBranches,
  statusLabel,
  toneOf,
  transferDetails,
  type Bank,
  type Branch,
  type LoadFailure,
  type LookupMode,
  type Tone,
} from '@/lib/bank-branch-lookup'
import ui from './toolUi.module.css'
import styles from './CompanyLookup.module.css'

type Loaded = { branches: Branch[]; banks: Bank[]; dataDate: string }

type Phase =
  | { kind: 'idle' }
  | { kind: 'loading'; slow: boolean }
  | { kind: 'failed'; failure: LoadFailure }
  | { kind: 'done'; branches: Branch[]; more: boolean }

const modes: { id: LookupMode; label: string; hint: string }[] = [
  { id: 'number', label: 'לפי בנק ומספר סניף', hint: 'למשל בנק 12, סניף 539' },
  { id: 'place', label: 'לפי עיר, שם או רחוב', hint: 'למשל חולון או הרצל' },
]

const prompts: Record<LookupMode, string> = {
  number: 'בחרו בנק, הקלידו מספר סניף ולחצו על חיפוש. נראה את הכתובת, הטלפון ופרטי הסניף.',
  place: 'הקלידו עיר, שם סניף או רחוב, ובחרו בנק אם רוצים לצמצם. רשימת הסניפים תופיע מתחת לשדה.',
}

const toneClass: Record<Tone, string> = {
  active: styles.toneActive,
  caution: styles.toneCaution,
  ended: styles.toneEnded,
  unknown: styles.toneUnknown,
}

export function BranchDetails({
  branch,
  bank,
  dataDate,
  headingLevel = 3,
}: {
  branch: Branch
  bank?: Bank
  dataDate: string
  headingLevel?: 3 | 4
}) {
  const Heading = headingLevel === 4 ? 'h4' : 'h3'
  const tone = toneOf(branch)
  const phone = phoneHref(branch.phone)
  const map = mapUrl(branch)
  const merged =
    branch.mergedBranch !== null
      ? `הפעילות הועברה לסניף ${branch.mergedBranch}${branch.mergedBank && branch.mergedBank < 100 ? ` בבנק ${branch.mergedBank}` : ''}.`
      : ''

  return (
    <article className={`${styles.card} ${toneClass[tone]}`}>
      <p className={`${styles.badge} ${toneClass[tone]}`}>{statusLabel(branch)}</p>
      <Heading className={styles.name}>
        {branch.bankShort}, סניף {branch.name}
      </Heading>
      {isClosed(branch) ? (
        <p className={styles.statusText}>
          הסניף הזה נסגר. {merged} כדי לברר לאן עבר החשבון שלכם, פנו לבנק.
        </p>
      ) : null}
      <dl className={styles.facts}>
        <div className={styles.fact}>
          <dt>קוד בנק</dt>
          <dd>
            <span dir="ltr" className={styles.digits}>
              {branch.bankCode}
            </span>
          </dd>
        </div>
        <div className={styles.fact}>
          <dt>מספר סניף</dt>
          <dd>
            <span dir="ltr" className={styles.digits}>
              {branch.code}
            </span>
            <span className={styles.factNote}>בהעברה בנקאית: {transferDetails(branch)}.</span>
          </dd>
        </div>
        {branch.address || branch.city ? (
          <div className={styles.fact}>
            <dt>כתובת</dt>
            <dd>
              {[branch.address, branch.city].filter(Boolean).join(', ')}
              {branch.zip ? <span className={styles.factNote}>מיקוד {branch.zip}</span> : null}
              {branch.poBox ? <span className={styles.factNote}>ת.ד. {branch.poBox}</span> : null}
            </dd>
          </div>
        ) : null}
        {branch.phone ? (
          <div className={styles.fact}>
            <dt>טלפון</dt>
            <dd>
              {phone ? (
                <a href={phone} dir="ltr" className={styles.digits}>
                  {branch.phone}
                </a>
              ) : (
                branch.phone
              )}
              <span className={styles.factNote}>בחלק מהסניפים זה מספר המוקד של הבנק ולא קו ישיר לסניף.</span>
            </dd>
          </div>
        ) : null}
        {branch.type ? (
          <div className={styles.fact}>
            <dt>סוג סניף</dt>
            <dd>{branch.type}</dd>
          </div>
        ) : null}
        {branch.closedDay ? (
          <div className={styles.fact}>
            <dt>יום סגור</dt>
            <dd>
              {branch.closedDay}
              <span className={styles.factNote}>שעות הפעילות לא מופיעות במאגר. אותן בודקים באתר הבנק.</span>
            </dd>
          </div>
        ) : null}
        {branch.accessible !== null ? (
          <div className={styles.fact}>
            <dt>נגישות לנכים</dt>
            <dd>{branch.accessible ? 'כן' : 'לא'}</dd>
          </div>
        ) : null}
        {branch.openedOn ? (
          <div className={styles.fact}>
            <dt>תאריך פתיחה</dt>
            <dd>{branch.openedOn}</dd>
          </div>
        ) : null}
        {bank?.swift ? (
          <div className={styles.fact}>
            <dt>קוד SWIFT של הבנק</dt>
            <dd>
              <span dir="ltr" className={styles.digits}>
                {bank.swift}
              </span>
            </dd>
          </div>
        ) : null}
        {bank?.website ? (
          <div className={styles.fact}>
            <dt>אתר הבנק</dt>
            <dd>
              <a href={bank.website} target="_blank" rel="noopener">
                {new URL(bank.website).hostname.replace(/^www\./, '')}
              </a>
            </dd>
          </div>
        ) : null}
      </dl>
      {map ? (
        <p className={styles.source}>
          <a href={map} target="_blank" rel="noopener">
            <MapPin aria-hidden="true" size={14} /> פתיחה במפה
          </a>
        </p>
      ) : null}
      <p className={styles.source}>
        מקור: מאגר סניפי הבנקים הפיזיים של בנק ישראל ב-data.gov.il{dataDate ? `, נתונים מעודכנים ל-${dataDate}` : ''}.
      </p>
    </article>
  )
}

export default function BankBranchLookup() {
  const [mode, setMode] = useState<LookupMode>('number')
  const [bankCode, setBankCode] = useState('')
  const [numberValue, setNumberValue] = useState('')
  const [textValue, setTextValue] = useState('')
  const [fieldError, setFieldError] = useState('')
  const [loaded, setLoaded] = useState<Loaded | null>(null)
  const [phase, setPhase] = useState<Phase>({ kind: 'idle' })
  const [selected, setSelected] = useState<string | null>(null)
  const [announcement, setAnnouncement] = useState('')
  const [copyStatus, setCopyStatus] = useState('')
  const controllerRef = useRef<AbortController | null>(null)
  const loadingRef = useRef<Promise<Loaded | null> | null>(null)
  const timersRef = useRef<number[]>([])
  const debounceRef = useRef<number | undefined>(undefined)
  const searchRef = useRef<(isSubmit: boolean) => Promise<void>>(async () => {})
  const inputRef = useRef<HTMLInputElement>(null)
  const cardRef = useRef<HTMLDivElement>(null)
  const radioName = useId()
  const fieldId = useId()
  const bankId = `${fieldId}-bank`
  const hintId = `${fieldId}-hint`
  const errorId = `${fieldId}-error`
  const listLabelId = `${fieldId}-list`
  const banks = loaded?.banks ?? STATIC_BANKS

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

  const ensureLoaded = (): Promise<Loaded | null> => {
    if (loaded) return Promise.resolve(loaded)
    if (loadingRef.current) return loadingRef.current
    const controller = new AbortController()
    controllerRef.current = controller
    setPhase({ kind: 'loading', slow: false })
    setAnnouncement('טוען את רשימת הסניפים של בנק ישראל')
    timersRef.current = [
      window.setTimeout(() => {
        setPhase((current) => (current.kind === 'loading' ? { ...current, slow: true } : current))
      }, SLOW_AFTER_MS),
      window.setTimeout(() => controller.abort(TIMEOUT_REASON), REQUEST_TIMEOUT_MS),
    ]
    const request = loadBranches(controller.signal).then((result) => {
      clearTimers()
      loadingRef.current = null
      if (controllerRef.current === controller) controllerRef.current = null
      if (!result.ok) {
        if (result.failure !== 'aborted') {
          setPhase({ kind: 'failed', failure: result.failure })
          setAnnouncement(failureText[result.failure])
        }
        return null
      }
      const data = { branches: result.branches, banks: result.banks, dataDate: result.dataDate }
      setLoaded(data)
      setPhase((current) => (current.kind === 'loading' ? { kind: 'idle' } : current))
      return data
    })
    loadingRef.current = request
    return request
  }

  const search = async (isSubmit: boolean) => {
    const query = {
      mode,
      bankCode: bankCode ? Number(bankCode) : null,
      number: numberValue,
      text: textValue,
    }
    const check = checkQuery(query)
    if (check.kind !== 'valid') {
      if (isSubmit) {
        setFieldError(check.message)
        inputRef.current?.focus()
      } else {
        setPhase((current) => (current.kind === 'done' ? { kind: 'idle' } : current))
      }
      return
    }
    setFieldError('')
    const data = await ensureLoaded()
    if (!data) return
    const found = searchBranches(data.branches, query, data.banks)
    const shown = found.slice(0, RESULTS_LIMIT)
    const more = found.length > RESULTS_LIMIT
    setPhase({ kind: 'done', branches: shown, more })
    setSelected(shown.length === 1 || mode === 'number' ? (shown[0]?.key ?? null) : null)
    setCopyStatus('')
    setAnnouncement(announcementFor(shown.length, more))
    window.gtag?.('event', 'bank_branch_search', { by: mode, found: shown.length > 0 })
  }

  searchRef.current = search

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    window.clearTimeout(debounceRef.current)
    void search(true)
  }

  const selectMode = (next: LookupMode) => {
    if (next === mode) return
    window.clearTimeout(debounceRef.current)
    setMode(next)
    setPhase((current) => (current.kind === 'loading' ? current : { kind: 'idle' }))
    setSelected(null)
    setFieldError('')
    setCopyStatus('')
  }

  const onTextChange = (next: string) => {
    setTextValue(next)
    setFieldError('')
  }

  const queueSearch = () => {
    window.clearTimeout(debounceRef.current)
    debounceRef.current = window.setTimeout(() => void searchRef.current(false), 450)
  }

  const retry = () => {
    void search(true)
  }

  const branches = phase.kind === 'done' ? phase.branches : []
  const current = branches.find((branch) => branch.key === selected) ?? null
  const currentBank = current ? banks.find((bank) => bank.code === current.bankCode) : undefined

  const choose = (branch: Branch) => {
    setSelected(branch.key)
    setCopyStatus('')
    setAnnouncement(`מוצגים הפרטים של סניף ${branch.name}`)
    if (window.matchMedia('(max-width: 1023px)').matches) {
      const smooth = !window.matchMedia('(prefers-reduced-motion: reduce)').matches
      cardRef.current?.scrollIntoView({ block: 'start', behavior: smooth ? 'smooth' : 'auto' })
    }
  }

  const copy = async () => {
    if (!current || !loaded) return
    try {
      await navigator.clipboard.writeText(branchToText(current, currentBank, loaded.dataDate))
      setCopyStatus('הפרטים הועתקו')
    } catch {
      setCopyStatus('ההעתקה נכשלה. סמנו את הפרטים והעתיקו ידנית.')
    }
  }

  const showList = phase.kind === 'done' && branches.length > 1
  const listLabel =
    phase.kind === 'done' && phase.more
      ? `יש יותר מ-${RESULTS_LIMIT} סניפים כאלה, ומוצגים ${RESULTS_LIMIT} מהם. צמצמו לפי בנק או הוסיפו מילה.`
      : `נמצאו ${branches.length} סניפים`

  let body: ReactNode
  if (phase.kind === 'idle') {
    body = <p className={styles.prompt}>{prompts[mode]}</p>
  } else if (phase.kind === 'loading') {
    body = (
      <div className={styles.loading}>
        <span className={styles.spinner} aria-hidden="true" />
        <div>
          <p className={styles.loadingTitle}>טוען את רשימת הסניפים של בנק ישראל</p>
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
  } else if (!branches.length) {
    body = (
      <div className={styles.message}>
        <p className={styles.messageTitle}>לא נמצאו סניפים</p>
        <ul className={styles.tips}>
          <li>
            {mode === 'number'
              ? 'בדקו שהבנק ומספר הסניף מתאימים. אפשר לנסות בלי לבחור בנק, ולראות איפה המספר הזה קיים.'
              : 'נסו מילה אחת, למשל רק שם העיר, או כתיב אחר. אפשר גם לחפש לפי רחוב.'}
          </li>
          <li>המאגר כולל רק סניפים פיזיים של תאגידים בנקאיים, לא סניפי דואר ולא כספומטים.</li>
          <li>בנק שפועל רק באינטרנט מופיע בדרך כלל כסניף דיגיטלי אחד.</li>
        </ul>
      </div>
    )
  } else if (current && loaded) {
    body = (
      <>
        <BranchDetails branch={current} bank={currentBank} dataDate={loaded.dataDate} />
        <div className={ui.actions}>
          <button type="button" className={`${ui.primary} ${styles.grow}`} onClick={copy}>
            <Copy aria-hidden="true" />
            העתקת הפרטים
          </button>
          {currentBank?.website ? (
            <a className={`${ui.secondary} ${styles.linkButton}`} href={currentBank.website} target="_blank" rel="noopener">
              <ExternalLink aria-hidden="true" />
              אתר הבנק
            </a>
          ) : null}
        </div>
        <p className={ui.status} role="status" aria-live="polite">
          {copyStatus}
        </p>
        <p className={ui.note}>
          צריכים לבנות מספר חשבון בינלאומי מקוד הבנק, מספר הסניף ומספר החשבון? אפשר בכלי{' '}
          <Link href="/tools/iban-calculator">מחשבון IBAN</Link>.
        </p>
      </>
    )
  } else {
    body = <p className={styles.prompt}>בחרו סניף מהרשימה כדי לראות את הפרטים שלו.</p>
  }

  return (
    <section className={`${ui.tool} ${styles.lookup}`} aria-label="חיפוש סניף בנק">
      <div className={`${ui.inner} ${styles.layout}`}>
        <form
          className={ui.form}
          onSubmit={onSubmit}
          noValidate
          onFocus={() => {
            void ensureLoaded()
          }}
        >
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
            <legend className={ui.legend}>הסניף</legend>
            <div className={ui.field}>
              <label htmlFor={bankId} className={ui.label}>
                בנק
              </label>
              <select
                id={bankId}
                className={ui.input}
                value={bankCode}
                onChange={(event) => {
                  setBankCode(event.target.value)
                  setFieldError('')
                  if (mode === 'place' && textValue) queueSearch()
                }}
              >
                <option value="">כל הבנקים</option>
                {banks.map((bank) => (
                  <option key={bank.code} value={bank.code}>
                    {bankLabel(bank)}
                  </option>
                ))}
              </select>
            </div>
            <div className={ui.field}>
              <label htmlFor={fieldId} className={ui.label}>
                {mode === 'number' ? 'מספר סניף' : 'עיר, שם סניף או רחוב'}
              </label>
              <p id={hintId} className={ui.hint}>
                {mode === 'number'
                  ? 'עד 4 ספרות. מספר הסניף מופיע בפרטי החשבון, בצ׳ק וב-IBAN.'
                  : 'מספיקה מילה אחת. בחירת בנק מצמצמת את הרשימה.'}
              </p>
              <div className={styles.searchRow}>
                {mode === 'number' ? (
                  <input
                    ref={inputRef}
                    key="number"
                    id={fieldId}
                    className={`${ui.input} ${ui.ltr} ${styles.digitsInput}`}
                    type="text"
                    inputMode="numeric"
                    autoComplete="off"
                    spellCheck={false}
                    enterKeyHint="search"
                    maxLength={8}
                    data-lpignore="true"
                    data-1p-ignore=""
                    placeholder="539"
                    value={numberValue}
                    aria-invalid={fieldError ? true : undefined}
                    aria-describedby={fieldError ? `${hintId} ${errorId}` : hintId}
                    onChange={(event) => {
                      setNumberValue(event.target.value)
                      setFieldError('')
                    }}
                  />
                ) : (
                  <input
                    ref={inputRef}
                    key="place"
                    id={fieldId}
                    className={ui.input}
                    type="search"
                    inputMode="search"
                    autoComplete="off"
                    spellCheck={false}
                    enterKeyHint="search"
                    maxLength={60}
                    data-lpignore="true"
                    data-1p-ignore=""
                    value={textValue}
                    aria-invalid={fieldError ? true : undefined}
                    aria-describedby={fieldError ? `${hintId} ${errorId}` : hintId}
                    onChange={(event) => {
                      onTextChange(event.target.value)
                      queueSearch()
                    }}
                  />
                )}
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
                {branches.map((branch) => (
                  <li key={branch.key}>
                    <button
                      type="button"
                      className={styles.result}
                      aria-pressed={selected === branch.key}
                      onClick={() => choose(branch)}
                    >
                      <span className={styles.resultName}>
                        {branch.bankShort}, {branch.name}
                      </span>
                      <span className={styles.resultMeta}>
                        <span>
                          {branch.city ? `${branch.city}, ` : ''}סניף{' '}
                          <span dir="ltr" className={styles.digits}>
                            {branch.code}
                          </span>
                        </span>
                        <span className={`${styles.resultStatus} ${toneClass[toneOf(branch)]}`}>
                          {statusLabel(branch)}
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
              הרשימה נטענת בפעם הראשונה שמתחילים לחפש, ישירות מהדפדפן שלכם מהמאגר הפתוח של בנק ישראל ב-data.gov.il.
              החיפוש עצמו מתבצע במכשיר שלכם, ואנחנו לא שומרים מה חיפשתם.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
