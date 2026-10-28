'use client'

import { useEffect, useId, useRef, useState, type FormEvent } from 'react'
import { Copy, Download, RotateCcw, Search } from 'lucide-react'
import {
  GROUP_LABELS,
  SEED_MAX_LENGTH,
  normalizeSeed,
  toCsv,
  type KeywordIdeasResponse,
} from '@/lib/keyword-ideas'
import ui from './toolUi.module.css'
import styles from './KeywordIdeas.module.css'

type Failure = 'invalid' | 'rate' | 'upstream' | 'network'

type Phase =
  | { kind: 'idle' }
  | { kind: 'loading'; seed: string }
  | { kind: 'failed'; failure: Failure }
  | { kind: 'done'; response: KeywordIdeasResponse }

const failureText: Record<Failure, string> = {
  invalid: 'השרת לא קיבל את הביטוי. הקלידו בין 2 ל-60 תווים.',
  rate: 'הגעתם למגבלת החיפושים לעשר דקות. נסו שוב בעוד כמה דקות.',
  upstream: 'גוגל לא ענה בזמן. נסו שוב בעוד דקה.',
  network: 'אין חיבור לשרת. בדקו את החיבור לאינטרנט ונסו שוב.',
}

const REQUEST_TIMEOUT_MS = 30000

async function requestIdeas(seed: string, signal: AbortSignal): Promise<KeywordIdeasResponse | Failure> {
  try {
    const response = await fetch('/api/tools/keyword-ideas', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ seed }),
      signal,
    })
    if (response.status === 400) return 'invalid'
    if (response.status === 429) return 'rate'
    if (!response.ok) return 'upstream'
    return (await response.json()) as KeywordIdeasResponse
  } catch {
    return signal.aborted ? 'upstream' : 'network'
  }
}

function downloadCsv(response: KeywordIdeasResponse) {
  const url = URL.createObjectURL(new Blob([toCsv(response)], { type: 'text/csv;charset=utf-8' }))
  const link = document.createElement('a')
  link.href = url
  link.download = `keywords-${response.seed.replace(/\s+/g, '-')}.csv`
  link.click()
  URL.revokeObjectURL(url)
}

function Results({ response, onCopied }: { response: KeywordIdeasResponse; onCopied: (text: string) => void }) {
  if (!response.total) {
    return (
      <div className={styles.message}>
        <p className={styles.messageTitle}>גוגל לא הציע השלמות לביטוי הזה</p>
        <p>נסו ביטוי קצר וכללי יותר, למשל שתי מילים במקום ארבע.</p>
      </div>
    )
  }

  const copyAll = async () => {
    const text = response.groups.flatMap((group) => group.keywords).join('\n')
    try {
      await navigator.clipboard.writeText(text)
      onCopied(`הועתקו ${response.total} ביטויים`)
    } catch {
      onCopied('ההעתקה נחסמה בדפדפן. אפשר להוריד CSV במקום.')
    }
  }

  return (
    <>
      <p className={styles.summary}>
        {response.total} ביטויים שאנשים מחפשים סביב <bdi className={styles.seed}>{response.seed}</bdi>
      </p>
      <div className={ui.actions}>
        <button type="button" className={ui.primary} onClick={copyAll}>
          <Copy aria-hidden="true" />
          העתקת הכל
        </button>
        <button
          type="button"
          className={ui.secondary}
          onClick={() => {
            downloadCsv(response)
            window.gtag?.('event', 'keyword_ideas_csv')
          }}
        >
          <Download aria-hidden="true" />
          הורדת CSV
        </button>
      </div>
      {response.groups.map((group) => (
        <section key={group.id} className={styles.group}>
          <h3 className={styles.groupTitle}>
            {GROUP_LABELS[group.id]} <span className={styles.count}>{group.keywords.length}</span>
          </h3>
          <ul className={styles.list}>
            {group.keywords.map((keyword) => (
              <li key={keyword} dir="auto">
                {keyword}
              </li>
            ))}
          </ul>
        </section>
      ))}
    </>
  )
}

export default function KeywordIdeas() {
  const [value, setValue] = useState('')
  const [fieldError, setFieldError] = useState('')
  const [phase, setPhase] = useState<Phase>({ kind: 'idle' })
  const [announcement, setAnnouncement] = useState('')
  const controllerRef = useRef<AbortController | null>(null)
  const lastSeedRef = useRef('')
  const inputRef = useRef<HTMLInputElement>(null)
  const fieldId = useId()
  const hintId = `${fieldId}-hint`
  const errorId = `${fieldId}-error`

  useEffect(() => () => controllerRef.current?.abort('unmount'), [])

  const run = (seed: string) => {
    controllerRef.current?.abort('superseded')
    const controller = new AbortController()
    controllerRef.current = controller
    lastSeedRef.current = seed
    setPhase({ kind: 'loading', seed })
    setAnnouncement(`מחפש רעיונות ל${seed}`)
    const timer = window.setTimeout(() => controller.abort('timeout'), REQUEST_TIMEOUT_MS)

    requestIdeas(seed, controller.signal).then((result) => {
      window.clearTimeout(timer)
      if (controllerRef.current !== controller) return
      controllerRef.current = null
      if (typeof result === 'string') {
        setPhase({ kind: 'failed', failure: result })
        setAnnouncement(failureText[result])
        return
      }
      setPhase({ kind: 'done', response: result })
      setAnnouncement(`נמצאו ${result.total} ביטויים`)
      window.gtag?.('event', 'keyword_ideas_search', { total: result.total })
    })
  }

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const seed = normalizeSeed(value)
    if (!seed) {
      setFieldError('הקלידו מילה או ביטוי של 2 עד 60 תווים, למשל ״עיצוב מטבחים״.')
      inputRef.current?.focus()
      return
    }
    setFieldError('')
    run(seed)
  }

  let body
  if (phase.kind === 'idle') {
    body = <p className={styles.prompt}>הקלידו נושא, שירות או מוצר, ונקבל מגוגל את מה שאנשים בישראל מחפשים סביבו.</p>
  } else if (phase.kind === 'loading') {
    body = (
      <p className={styles.prompt}>
        שולח לגוגל 56 וריאציות של <bdi className={styles.seed}>{phase.seed}</bdi>. זה לוקח כמה שניות…
      </p>
    )
  } else if (phase.kind === 'failed') {
    body = (
      <div className={styles.message}>
        <p className={styles.messageTitle}>החיפוש לא הושלם</p>
        <p>{failureText[phase.failure]}</p>
        {phase.failure === 'upstream' || phase.failure === 'network' ? (
          <button type="button" className={ui.secondary} onClick={() => run(lastSeedRef.current)}>
            <RotateCcw aria-hidden="true" />
            לנסות שוב
          </button>
        ) : null}
      </div>
    )
  } else {
    body = <Results response={phase.response} onCopied={setAnnouncement} />
  }

  return (
    <section className={`${ui.tool} ${styles.ideas}`} aria-label="מחולל מילות מפתח">
      <div className={`${ui.inner} ${styles.layout}`}>
        <form className={ui.form} onSubmit={onSubmit} noValidate>
          <fieldset className={ui.group}>
            <legend className={ui.legend}>מילת המפתח</legend>
            <div className={ui.field}>
              <label htmlFor={fieldId} className={ui.label}>
                נושא, שירות או מוצר
              </label>
              <p id={hintId} className={ui.hint}>
                בעברית או באנגלית. ביטוי של מילה עד שלוש מילים נותן הכי הרבה רעיונות.
              </p>
              <div className={styles.searchRow}>
                <input
                  ref={inputRef}
                  id={fieldId}
                  className={ui.input}
                  type="text"
                  dir="auto"
                  autoComplete="off"
                  enterKeyHint="search"
                  maxLength={SEED_MAX_LENGTH}
                  placeholder="קידום אתרים"
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
                <p id={errorId} className={styles.error}>
                  {fieldError}
                </p>
              ) : null}
            </div>
          </fieldset>
        </form>

        <div className={ui.output}>
          <div className={ui.sticky}>
            <h2 className={ui.outputTitle}>רעיונות למילות מפתח</h2>
            <div aria-busy={phase.kind === 'loading'}>{body}</div>
            <p className={styles.srOnly} role="status" aria-live="polite">
              {announcement}
            </p>
            <p className={ui.note}>
              הרשימה מגיעה מההשלמה האוטומטית של גוגל בישראל. אין כאן נפח חיפוש: כל ביטוי ברשימה מחפשים בפועל, אבל לא
              ידוע כמה פעמים בחודש.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
