'use client'

import { useDeferredValue, useId, useMemo, useState } from 'react'
import Link from 'next/link'
import {
  MAX_BULK_ROWS,
  PORTABILITY_START,
  cleanList,
  listCsv,
  listText,
  parsePhone,
  typedDigitCount,
  type BulkResult,
  type FormattedPhone,
  type ListFormat,
} from '@/lib/israeli-phone'
import ui from './toolUi.module.css'
import styles from './IsraeliPhoneFormatter.module.css'

type Mode = 'single' | 'bulk'
type Status = { area: Mode; text: string } | null
type Choice<T extends string> = { value: T; label: string; hint: string; ltr?: boolean }
type FormatRow = { id: string; label: string; value: string; hint?: string }

const COPY_FAILED = 'ההעתקה נכשלה. סמנו את הטקסט והעתיקו ידנית.'
const PRIVACY_NOTE = 'המספרים נשארים בדפדפן שלכם ולא נשלחים לשום מקום.'
const PORTABILITY_NOTE = `אי אפשר לדעת לפי הקידומת באיזו חברה המספר: מאז ${PORTABILITY_START} אפשר לעבור חברה ולשמור על המספר.`
const CSV_FILE_NAME = 'phone-list-972.csv'
const MAX_SHOWN_ROWS = 200
const SHOW_ERROR_AT_DIGITS = 10

const modeOptions: Choice<Mode>[] = [
  { value: 'single', label: 'מספר אחד', hint: 'כל הפורמטים וסוג המספר' },
  { value: 'bulk', label: 'רשימת מספרים', hint: 'ניקוי, כפילויות וקובץ CSV' },
]

const formatOptions: Choice<ListFormat>[] = [
  { value: 'e164', label: '+972523456789', hint: 'ל-CRM ולאנשי קשר', ltr: true },
  { value: 'digits', label: '972523456789', hint: 'לקישורי wa.me ולכלי דיוור', ltr: true },
  { value: 'local', label: '052-3456789', hint: 'לשימוש בתוך ישראל', ltr: true },
]

const track = (format: string, count: number) => window.gtag?.('event', 'phone_format_copy', { format, count })

const countLabel = (count: number, one: string, many: string) => (count === 1 ? one : `${count} ${many}`)

const textDir = (text: string) => (/[֐-׿؀-ۿ]/.test(text) ? 'rtl' : 'ltr')

function formatRows(phone: FormattedPhone): FormatRow[] {
  const rows = [
    { id: 'e164', label: 'פורמט בינלאומי (E.164)', value: phone.e164, hint: 'ל-CRM, לטפסים ולשמירה באנשי הקשר' },
    {
      id: 'international',
      label: 'לחיוג מחו״ל ולכרטיס ביקור',
      value: phone.international,
      hint: 'מטלפון קווי בחו״ל מחייגים 00 או 011 במקום ה-+',
    },
    { id: 'local', label: phone.e164 ? 'בתוך ישראל' : 'המספר', value: phone.local },
    { id: 'whatsapp', label: 'קישור לוואטסאפ', value: phone.whatsapp },
    { id: 'tel', label: 'קישור לחיוג מהאתר', value: phone.tel },
  ]
  const seen = new Set<string>()
  return rows.flatMap((row) => {
    if (!row.value || seen.has(row.value)) return []
    seen.add(row.value)
    return [{ ...row, value: row.value }]
  })
}

function saveFile(href: string, fileName: string) {
  const anchor = document.createElement('a')
  anchor.href = href
  anchor.download = fileName
  anchor.click()
}

function StatusLine({ area, status }: { area: Mode; status: Status }) {
  return (
    <p className={`${ui.status} ${styles.statusLine}`} role="status" aria-live="polite">
      {status?.area === area ? status.text : ''}
    </p>
  )
}

function ChoiceGroup<T extends string>({
  legend,
  options,
  value,
  onChange,
  layout,
}: {
  legend: string
  options: Choice<T>[]
  value: T
  onChange: (value: T) => void
  layout: string
}) {
  const name = useId()
  return (
    <fieldset className={ui.group}>
      <legend className={ui.legend}>{legend}</legend>
      <div className={`${styles.choices} ${layout}`}>
        {options.map((option) => (
          <label key={option.value} className={styles.choice}>
            <input
              type="radio"
              name={name}
              value={option.value}
              className={ui.checkbox}
              checked={value === option.value}
              onChange={() => onChange(option.value)}
            />
            <span className={styles.choiceText}>
              <span className={`${styles.choiceLabel} ${option.ltr ? styles.mono : ''}`}>
                {option.ltr ? <bdi dir="ltr">{option.label}</bdi> : option.label}
              </span>
              <span className={styles.choiceHint}>{option.hint}</span>
            </span>
          </label>
        ))}
      </div>
    </fieldset>
  )
}

function SingleResult({
  phone,
  status,
  onCopy,
}: {
  phone: FormattedPhone
  status: Status
  onCopy: (row: FormatRow) => void
}) {
  const kindId = useId()
  const israeli = phone.kind === 'mobile' || phone.kind === 'landline' || phone.kind === 'national'
  return (
    <div className={styles.stack}>
      <section className={`${styles.card} ${phone.e164 ? '' : styles.cardWarning}`} aria-labelledby={kindId}>
        <p className={styles.eyebrow}>סוג המספר</p>
        <h3 id={kindId} className={styles.kind}>
          {phone.label}
        </h3>
        {phone.notes.length ? (
          <ul className={styles.notes}>
            {phone.notes.map((note) => (
              <li key={note}>{note}</li>
            ))}
          </ul>
        ) : null}
      </section>

      <div className={styles.card}>
        <ul className={styles.formats}>
          {formatRows(phone).map((row) => (
            <li key={row.id} className={styles.format}>
              <span className={styles.formatLabel}>{row.label}</span>
              <code className={styles.value}>
                <bdi dir="ltr">{row.value}</bdi>
              </code>
              {row.hint ? <span className={styles.formatHint}>{row.hint}</span> : null}
              <button type="button" className={`${ui.secondary} ${styles.copy}`} onClick={() => onCopy(row)}>
                העתקה<span className={styles.srOnly}> של {row.label}</span>
              </button>
            </li>
          ))}
        </ul>
        <StatusLine area="single" status={status} />
      </div>

      {phone.whatsapp ? (
        <p className={`${ui.note} ${styles.flush}`}>
          לקישור עם הודעה מוכנה וקוד QR:{' '}
          <Link href="/tools/whatsapp-link-generator" className={styles.inlineLink}>
            מחולל קישור לוואטסאפ
          </Link>
        </p>
      ) : null}
      {israeli ? <p className={`${ui.note} ${styles.flush}`}>{PORTABILITY_NOTE}</p> : null}
      <p className={`${ui.note} ${styles.flush}`}>{PRIVACY_NOTE}</p>
    </div>
  )
}

function BulkSummary({ bulk }: { bulk: BulkResult }) {
  const items = [
    countLabel(bulk.entries.length, 'מספר אחד ברשימה', 'מספרים ברשימה'),
    bulk.duplicates.length ? countLabel(bulk.duplicates.length, 'כפילות אחת הוסרה', 'כפילויות הוסרו') : '',
    bulk.issues.length ? countLabel(bulk.issues.length, 'שורה אחת לא נכנסה', 'שורות לא נכנסו') : '',
  ].filter(Boolean)
  return (
    <ul className={styles.stats}>
      {items.map((item) => (
        <li key={item} className={styles.stat}>
          {item}
        </li>
      ))}
    </ul>
  )
}

function BulkIssues({ bulk }: { bulk: BulkResult }) {
  const headingId = useId()
  if (!bulk.issues.length) return null
  const shown = bulk.issues.slice(0, MAX_SHOWN_ROWS)
  const more = bulk.issues.length - shown.length
  return (
    <section className={styles.card} aria-labelledby={headingId}>
      <h3 id={headingId} className={styles.cardTitle}>
        שורות שלא נכנסו לרשימה
      </h3>
      <ol className={styles.issues}>
        {shown.map((issue, index) => (
          <li key={`${issue.line}-${index}`} className={styles.issue}>
            <span className={styles.issueHead}>
              שורה {issue.line}
              {issue.text ? (
                <>
                  :{' '}
                  <bdi dir={textDir(issue.text)} className={styles.issueText}>
                    {issue.text}
                  </bdi>
                </>
              ) : null}
            </span>
            <span>{issue.reason}</span>
          </li>
        ))}
      </ol>
      {more > 0 ? <p className={`${ui.hint} ${styles.flush}`}>ועוד {more} שורות שלא מוצגות כאן.</p> : null}
    </section>
  )
}

function BulkDuplicates({ bulk }: { bulk: BulkResult }) {
  if (!bulk.duplicates.length) return null
  const shown = bulk.duplicates.slice(0, MAX_SHOWN_ROWS)
  return (
    <details className={styles.details}>
      <summary className={styles.summary}>הכפילויות שהוסרו ({bulk.duplicates.length})</summary>
      <ol className={styles.issues}>
        {shown.map((duplicate, index) => (
          <li key={`${duplicate.line}-${index}`} className={styles.issue}>
            <span>
              שורה {duplicate.line}:{' '}
              <bdi dir={textDir(duplicate.text)} className={styles.issueText}>
                {duplicate.text}
              </bdi>
              , אותו מספר כמו בשורה{' '}
              {duplicate.firstLine}
            </span>
          </li>
        ))}
      </ol>
    </details>
  )
}

export default function IsraeliPhoneFormatter() {
  const phoneId = useId()
  const phoneHintId = useId()
  const phoneErrorId = useId()
  const listId = useId()
  const listHintId = useId()
  const columnId = useId()

  const [mode, setMode] = useState<Mode>('single')
  const [phone, setPhone] = useState('')
  const [touched, setTouched] = useState(false)
  const [list, setList] = useState('')
  const [column, setColumn] = useState<number | null>(null)
  const [format, setFormat] = useState<ListFormat>('e164')
  const [status, setStatus] = useState<Status>(null)

  const deferredList = useDeferredValue(list)
  const bulk = useMemo(() => cleanList(deferredList, column), [deferredList, column])
  const single = parsePhone(phone)
  const showError = single.status === 'invalid' && (touched || typedDigitCount(phone) >= SHOW_ERROR_AT_DIGITS)
  const table = bulk.columns.length > 0

  const copy = async (area: Mode, value: string, label: string, count: number, done: string) => {
    try {
      await navigator.clipboard.writeText(value)
      setStatus({ area, text: done })
      track(label, count)
    } catch {
      setStatus({ area, text: COPY_FAILED })
    }
  }

  const copyRow = (row: FormatRow) => copy('single', row.value, row.id, 1, `הועתק: ${row.label}`)

  const copyList = () => {
    const count = bulk.entries.length
    copy('bulk', listText(bulk.entries, format), `list_${format}`, count, countLabel(count, 'המספר הועתק', 'מספרים הועתקו'))
  }

  const downloadCsv = () => {
    const url = URL.createObjectURL(new Blob([listCsv(bulk)], { type: 'text/csv;charset=utf-8' }))
    saveFile(url, CSV_FILE_NAME)
    window.setTimeout(() => URL.revokeObjectURL(url), 1000)
    setStatus({ area: 'bulk', text: 'קובץ ה-CSV ירד.' })
    track('csv', bulk.entries.length)
  }

  const chooseMode = (next: Mode) => {
    setMode(next)
    setStatus(null)
  }

  return (
    <section className={ui.tool} aria-label="המרת מספר טלפון ישראלי לפורמט בינלאומי">
      <div className={ui.inner}>
        <form className={ui.form} onSubmit={(event) => event.preventDefault()}>
          <ChoiceGroup
            legend="מה ממירים"
            options={modeOptions}
            value={mode}
            onChange={chooseMode}
            layout={styles.modeChoices}
          />

          {mode === 'single' ? (
            <fieldset className={ui.group}>
              <legend className={ui.legend}>המספר</legend>
              <div className={ui.field}>
                <label htmlFor={phoneId} className={ui.label}>
                  מספר טלפון
                </label>
                <p id={phoneHintId} className={ui.hint}>
                  בכל צורה: 052-3456789, 0523456789, 972523456789, עם +972 או עם שם לידו.
                </p>
                <input
                  id={phoneId}
                  type="tel"
                  inputMode="tel"
                  autoComplete="off"
                  spellCheck={false}
                  className={`${ui.input} ${ui.ltr} ${showError ? styles.invalid : ''}`}
                  aria-invalid={showError}
                  aria-describedby={showError ? `${phoneHintId} ${phoneErrorId}` : phoneHintId}
                  value={phone}
                  onChange={(event) => {
                    setPhone(event.target.value)
                    setStatus(null)
                  }}
                  onBlur={() => setTouched(true)}
                />
                <p id={phoneErrorId} className={styles.error} aria-live="polite">
                  {showError && single.status === 'invalid' ? single.reason : ''}
                </p>
              </div>
            </fieldset>
          ) : (
            <>
              <fieldset className={ui.group}>
                <legend className={ui.legend}>הרשימה</legend>
                <div className={ui.field}>
                  <label htmlFor={listId} className={ui.label}>
                    מספרי טלפון
                  </label>
                  <p id={listHintId} className={ui.hint}>
                    מספר בכל שורה, או טבלה שהעתקתם מ-Excel, מ-Google Sheets או מקובץ CSV. גם שורה עם שם ומספר
                    תעבוד.
                  </p>
                  <textarea
                    id={listId}
                    className={`${ui.input} ${ui.textarea} ${styles.listInput}`}
                    aria-describedby={listHintId}
                    autoComplete="off"
                    spellCheck={false}
                    value={list}
                    onChange={(event) => {
                      setList(event.target.value)
                      setStatus(null)
                    }}
                  />
                </div>
                {table ? (
                  <div className={ui.field}>
                    <label htmlFor={columnId} className={ui.label}>
                      עמודת הטלפון
                    </label>
                    <select
                      id={columnId}
                      className={`${ui.input} ${styles.select}`}
                      value={bulk.column}
                      onChange={(event) => {
                        setColumn(Number(event.target.value))
                        setStatus(null)
                      }}
                    >
                      {bulk.columns.map((label, index) => (
                        <option key={label} value={index}>
                          {label}
                        </option>
                      ))}
                    </select>
                  </div>
                ) : null}
              </fieldset>
              <ChoiceGroup
                legend="איך לכתוב את המספרים ברשימה"
                options={formatOptions}
                value={format}
                onChange={(next) => {
                  setFormat(next)
                  setStatus(null)
                }}
                layout={styles.formatChoices}
              />
            </>
          )}
        </form>

        <div className={ui.output}>
          {mode === 'single' ? (
            <>
              <h2 className={ui.outputTitle}>המספר בכל הפורמטים</h2>
              {single.status === 'valid' ? (
                <SingleResult phone={single.phone} status={status} onCopy={copyRow} />
              ) : (
                <div className={`${styles.card} ${styles.empty}`}>
                  <p>הקלידו מספר טלפון, והוא יופיע כאן בכל הפורמטים, יחד עם סוג המספר.</p>
                  <p className={`${ui.note} ${styles.flush}`}>{PRIVACY_NOTE}</p>
                </div>
              )}
            </>
          ) : (
            <>
              <h2 className={ui.outputTitle}>הרשימה הנקייה</h2>
              {bulk.rows ? (
                <div className={styles.stack}>
                  <BulkSummary bulk={bulk} />
                  {bulk.truncated ? (
                    <p className={styles.warning}>
                      עיבדנו את {MAX_BULK_ROWS.toLocaleString('he-IL')} השורות הראשונות. רשימה ארוכה יותר חלקו לכמה
                      חלקים.
                    </p>
                  ) : null}
                  {bulk.entries.length ? (
                    <div className={styles.card}>
                      <div className={styles.listBox} role="region" aria-label="הרשימה הנקייה" tabIndex={0}>
                        <pre className={styles.list} dir="ltr">
                          {listText(bulk.entries, format)}
                        </pre>
                      </div>
                      <div className={`${ui.actions} ${styles.flush}`}>
                        <button type="button" className={ui.primary} onClick={copyList}>
                          העתקת הרשימה
                        </button>
                        <button type="button" className={ui.secondary} onClick={downloadCsv}>
                          הורדת קובץ CSV
                        </button>
                      </div>
                      <p className={`${ui.hint} ${styles.flush}`}>
                        {table
                          ? 'בקובץ כל העמודות של הטבלה, ובסופן ארבע עמודות חדשות: בינלאומי, לוואטסאפ, מקומי וסוג המספר.'
                          : 'בקובץ ארבע עמודות: בינלאומי, לוואטסאפ, מקומי וסוג המספר.'}
                      </p>
                      <StatusLine area="bulk" status={status} />
                    </div>
                  ) : null}
                  <BulkIssues bulk={bulk} />
                  <BulkDuplicates bulk={bulk} />
                  <p className={`${ui.note} ${styles.flush}`}>{PRIVACY_NOTE}</p>
                </div>
              ) : (
                <div className={`${styles.card} ${styles.empty}`}>
                  <p>הדביקו רשימת מספרים, והרשימה הנקייה תופיע כאן, בלי כפילויות ועם קובץ CSV.</p>
                  <p className={`${ui.note} ${styles.flush}`}>{PRIVACY_NOTE}</p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </section>
  )
}
