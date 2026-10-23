'use client'

import { useDeferredValue, useId, useMemo, useState } from 'react'
import {
  AREA_NAMES,
  MAX_BULK_ROWS,
  PHONE_CSV_COLUMNS,
  PHONE_REASONS,
  cleanList,
  listText,
  parsePhone,
  typedDigitCount,
  type BulkResult,
  type FormattedPhone,
  type ListFormat,
} from '@/lib/israeli-phone'
import { PHONE_ERRORS } from '@/lib/whatsapp-link'
import ui from '../../../../(he)/(site)/components/tools/toolUi.module.css'
import styles from '../../../../(he)/(site)/components/tools/IsraeliPhoneFormatter.module.css'

type Mode = 'single' | 'bulk'
type Status = { area: Mode; text: string } | null
type Choice<T extends string> = { value: T; label: string; hint: string; ltr?: boolean }
type FormatRow = { id: string; label: string; value: string; hint?: string }

const COPY_FAILED = 'Copying failed. Select the text and copy it manually.'
const PRIVACY_NOTE = 'The numbers stay in your browser and are not sent anywhere.'
const PORTABILITY_NOTE =
  'You cannot tell the carrier from the prefix: since 2 December 2007 people can switch carriers and keep their number.'
const CSV_FILE_NAME = 'phone-list-972.csv'
const MAX_SHOWN_ROWS = 200
const SHOW_ERROR_AT_DIGITS = 10
const UTF8_BOM = String.fromCharCode(0xfeff)

const AREA_NAMES_EN: Record<string, string> = {
  '2': 'Jerusalem',
  '3': 'Tel Aviv',
  '4': 'Haifa and the north',
  '8': 'the Shfela and the south',
  '9': 'the Sharon',
}

const REASONS_EN: Record<string, string> = {
  [PHONE_REASONS.noNumber]: 'We did not find a phone number here.',
  [PHONE_REASONS.emptyCell]: 'There is no phone number in this row.',
  [PHONE_REASONS.multiple]: 'This looks like more than one number. Put each number on its own line.',
  [PHONE_REASONS.tooLong]: 'Too many digits. Maybe two numbers were joined, or a digit was added.',
  [PHONE_REASONS.scientific]:
    'Excel showed the number in scientific notation, such as 9.72523E+11, and the last digits were not copied. Format the Excel column as a number with no decimal places and copy again.',
  [PHONE_REASONS.unrecognized]:
    'We did not recognise an Israeli number here. Israeli numbers start with 0, 972 or +972. For a number from abroad, write it with + and the country code.',
  [PHONE_REASONS.localStart]:
    'After the prefix the number starts with a digit from 2 to 9. A number starting with 0 or 1 there does not exist in the numbering plan.',
  [PHONE_REASONS.reserved]: 'The 06 prefix is reserved in the numbering plan for future use and has no numbers.',
  [PHONE_REASONS.carrier]:
    'A number starting with 01 is an international call through a carrier code such as 013 or 014. Write it with + and the country code, without the carrier code.',
  [PHONE_REASONS.shortCode]: 'This is a short service code, like 100 or 144. It has no international form.',
  [PHONE_REASONS.service]: 'A service number starting with 1, such as 1-800 or 1-700, has 10 digits.',
  [PHONE_REASONS.star]:
    'A business star number is an asterisk and four digits, such as *2345. Other star codes are phone company service codes.',
  [PHONE_REASONS.serviceFromAbroad]:
    'Service numbers starting with 1 and star numbers have no form with 972, because they cannot be dialled from abroad.',
  [PHONE_REASONS.prefix057]:
    'The 057 prefix is not currently allocated to any phone company in the Ministry of Communications allocation list. It may be an old number; check with the customer.',
  [PHONE_ERRORS.characters]: 'Use only digits, spaces, dashes and brackets, with + at the start.',
  [PHONE_ERRORS.zeroAfterPlus]: 'After + or 00 comes the country code, with no extra 0. Israel\'s code is 972.',
  [PHONE_ERRORS.israeli]: 'This does not look like a valid Israeli number. Check that you typed every digit, for example 050-1234567.',
  [PHONE_ERRORS.israeliMobile]: 'An Israeli mobile number has 10 digits including the leading 0, for example 050-1234567.',
  [PHONE_ERRORS.international]:
    'The number is too short or too long. A number from abroad starts with the country code, followed by the full number.',
}

const LENGTH_KINDS: [string, string, string][] = [
  ['נייד', 'A mobile number', '10'],
  ['בקידומת 07', 'A number with an 07 prefix', '10'],
  ['קווי', 'A landline number', '9'],
]

const translateReason = (reason: string) => {
  if (REASONS_EN[reason]) return REASONS_EN[reason]
  const count = /וכאן יש (\d+)/.exec(reason)
  if (count) {
    const kind = LENGTH_KINDS.find(([he]) => reason.includes(he))
    if (kind) return `${kind[1]} has ${kind[2]} digits including the leading 0; this one has ${count[1]}.`
  }
  const unallocated = /הקידומת (0\d+) לא מוקצית/.exec(reason)
  if (unallocated) {
    return `The ${unallocated[1]} prefix is not currently allocated to any phone company, according to the Ministry of Communications allocation list.`
  }
  if (reason.includes('אין לו צורה בינלאומית')) return 'This number has no international form, so it was left out of the list.'
  return reason
}

const translateNote = (note: string) => {
  if (note.includes('הוספנו את ה-0')) return 'We added the missing leading 0. This happens when a number goes through Excel.'
  if (note.includes('הורדנו את ה-0')) return 'We removed the 0 after 972. No 0 is written after the country code.'
  if (note.includes('M2M')) return 'This range is allocated to M2M services, that is SIM cards in devices, not people\'s phones.'
  if (note.includes('ברשות הפלסטינית')) return 'This prefix is allocated to operators in the Palestinian Authority.'
  if (note.includes('WhatsApp Business')) {
    return 'A line that is not a mobile can be registered only in the WhatsApp Business app, so the WhatsApp link works only if the number was registered there.'
  }
  if (note.includes('מחו״ל. בדקנו')) return 'This is a number from abroad. We only checked that its length is plausible, not that country\'s numbering plan.'
  if (note.includes('תוכנית המספור')) {
    return 'Under the numbering plan, only landline, mobile and 07 numbers can be dialled from abroad after 972. This number has no international form, and so no WhatsApp link.'
  }
  return note
}

const labelEn = (phone: FormattedPhone) => {
  if (phone.kind === 'mobile') return 'Mobile'
  if (phone.kind === 'landline') {
    const area = phone.e164?.charAt(4) ?? ''
    return `Landline, ${AREA_NAMES_EN[area] ?? AREA_NAMES[area] ?? ''} area code`
  }
  if (phone.kind === 'national') return `National number, prefix ${phone.local.slice(0, 3)}`
  if (phone.kind === 'foreign') return 'Number from abroad'
  if (phone.kind === 'tollFree') return `Toll-free number ${phone.local.slice(0, 5)}`
  if (phone.kind === 'service') return `Service number ${phone.local.slice(0, 5)}`
  return 'Business star number'
}

const columnLabelEn = (label: string) => label.replace(/עמודה (\d+)/g, 'column $1').replace(/^column/, 'Column')

const csvCell = (value: string) => (/[",\r\n]/.test(value) ? `"${value.replace(/"/g, '""')}"` : value)

const listCsvEn = (result: BulkResult) => {
  const width = result.columns.length
  const sourceHeader = Array.from({ length: width }, (_, index) => result.header?.[index] || `column_${index + 1}`)
  const rows = result.entries.map(({ phone, cells }) => [
    ...Array.from({ length: width }, (_, index) => cells[index] ?? ''),
    phone.e164 ?? '',
    phone.digits ?? '',
    phone.local,
    labelEn(phone),
  ])
  const lines = [[...sourceHeader, ...PHONE_CSV_COLUMNS], ...rows].map((row) => row.map(csvCell).join(','))
  return `${UTF8_BOM}${lines.join('\r\n')}\r\n`
}

const modeOptions: Choice<Mode>[] = [
  { value: 'single', label: 'One number', hint: 'Every format and the number type' },
  { value: 'bulk', label: 'A list of numbers', hint: 'Clean-up, duplicates and CSV' },
]

const formatOptions: Choice<ListFormat>[] = [
  { value: 'e164', label: '+972523456789', hint: 'For CRMs and contacts', ltr: true },
  { value: 'digits', label: '972523456789', hint: 'For wa.me links and mailing tools', ltr: true },
  { value: 'local', label: '052-3456789', hint: 'For use inside Israel', ltr: true },
]

const track = (format: string, count: number) =>
  window.gtag?.('event', 'phone_format_copy', { format, count, locale: 'en' })

const countLabel = (count: number, one: string, many: string) => (count === 1 ? one : `${count} ${many}`)

const textDir = (text: string) => (/[֐-׿؀-ۿ]/.test(text) ? 'rtl' : 'ltr')

function formatRows(phone: FormattedPhone): FormatRow[] {
  const rows = [
    { id: 'e164', label: 'International format (E.164)', value: phone.e164, hint: 'For CRMs, forms and saving to contacts' },
    {
      id: 'international',
      label: 'For dialling from abroad and business cards',
      value: phone.international,
      hint: 'From a landline abroad, dial 00 or 011 instead of +',
    },
    { id: 'local', label: phone.e164 ? 'Inside Israel' : 'The number', value: phone.local },
    { id: 'whatsapp', label: 'WhatsApp link', value: phone.whatsapp },
    { id: 'tel', label: 'Click-to-call link', value: phone.tel },
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
              <span className={`${styles.choiceLabel} ${option.ltr ? styles.mono : ''}`}>{option.label}</span>
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
        <p className={styles.eyebrow}>Number type</p>
        <h3 id={kindId} className={styles.kind}>
          {labelEn(phone)}
        </h3>
        {phone.notes.length ? (
          <ul className={styles.notes}>
            {phone.notes.map((note) => (
              <li key={note}>{translateNote(note)}</li>
            ))}
          </ul>
        ) : null}
      </section>

      <div className={styles.card}>
        <ul className={styles.formats}>
          {formatRows(phone).map((row) => (
            <li key={row.id} className={styles.format}>
              <span className={styles.formatLabel}>{row.label}</span>
              <code className={styles.value}>{row.value}</code>
              {row.hint ? <span className={styles.formatHint}>{row.hint}</span> : null}
              <button type="button" className={`${ui.secondary} ${styles.copy}`} onClick={() => onCopy(row)}>
                Copy<span className={styles.srOnly}> {row.label}</span>
              </button>
            </li>
          ))}
        </ul>
        <StatusLine area="single" status={status} />
      </div>

      {israeli ? <p className={`${ui.note} ${styles.flush}`}>{PORTABILITY_NOTE}</p> : null}
      <p className={`${ui.note} ${styles.flush}`}>{PRIVACY_NOTE}</p>
    </div>
  )
}

function BulkSummary({ bulk }: { bulk: BulkResult }) {
  const items = [
    countLabel(bulk.entries.length, '1 number in the list', 'numbers in the list'),
    bulk.duplicates.length ? countLabel(bulk.duplicates.length, '1 duplicate removed', 'duplicates removed') : '',
    bulk.issues.length ? countLabel(bulk.issues.length, '1 row left out', 'rows left out') : '',
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
        Rows left out of the list
      </h3>
      <ol className={styles.issues}>
        {shown.map((issue, index) => (
          <li key={`${issue.line}-${index}`} className={styles.issue}>
            <span className={styles.issueHead}>
              Row {issue.line}
              {issue.text ? (
                <>
                  :{' '}
                  <bdi dir={textDir(issue.text)} className={styles.issueText}>
                    {issue.text}
                  </bdi>
                </>
              ) : null}
            </span>
            <span>{translateReason(issue.reason)}</span>
          </li>
        ))}
      </ol>
      {more > 0 ? <p className={`${ui.hint} ${styles.flush}`}>And {more} more rows not shown here.</p> : null}
    </section>
  )
}

function BulkDuplicates({ bulk }: { bulk: BulkResult }) {
  if (!bulk.duplicates.length) return null
  const shown = bulk.duplicates.slice(0, MAX_SHOWN_ROWS)
  return (
    <details className={styles.details}>
      <summary className={styles.summary}>Duplicates removed ({bulk.duplicates.length})</summary>
      <ol className={styles.issues}>
        {shown.map((duplicate, index) => (
          <li key={`${duplicate.line}-${index}`} className={styles.issue}>
            <span>
              Row {duplicate.line}:{' '}
              <bdi dir={textDir(duplicate.text)} className={styles.issueText}>
                {duplicate.text}
              </bdi>
              , the same number as row {duplicate.firstLine}
            </span>
          </li>
        ))}
      </ol>
    </details>
  )
}

export default function IsraeliPhoneFormatterEn() {
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

  const copyRow = (row: FormatRow) => copy('single', row.value, row.id, 1, `Copied: ${row.label}`)

  const copyList = () => {
    const count = bulk.entries.length
    copy('bulk', listText(bulk.entries, format), `list_${format}`, count, countLabel(count, 'Number copied', 'numbers copied'))
  }

  const downloadCsv = () => {
    const url = URL.createObjectURL(new Blob([listCsvEn(bulk)], { type: 'text/csv;charset=utf-8' }))
    saveFile(url, CSV_FILE_NAME)
    window.setTimeout(() => URL.revokeObjectURL(url), 1000)
    setStatus({ area: 'bulk', text: 'CSV file downloaded.' })
    track('csv', bulk.entries.length)
  }

  const chooseMode = (next: Mode) => {
    setMode(next)
    setStatus(null)
  }

  return (
    <section className={ui.tool} aria-label="Convert an Israeli phone number to international format">
      <div className={ui.inner}>
        <form className={ui.form} onSubmit={(event) => event.preventDefault()}>
          <ChoiceGroup
            legend="What are you converting?"
            options={modeOptions}
            value={mode}
            onChange={chooseMode}
            layout={styles.modeChoices}
          />

          {mode === 'single' ? (
            <fieldset className={ui.group}>
              <legend className={ui.legend}>The number</legend>
              <div className={ui.field}>
                <label htmlFor={phoneId} className={ui.label}>
                  Phone number
                </label>
                <p id={phoneHintId} className={ui.hint}>
                  Any format: 052-3456789, 0523456789, 972523456789, with +972 or with a name next to it.
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
                  {showError && single.status === 'invalid' ? translateReason(single.reason) : ''}
                </p>
              </div>
            </fieldset>
          ) : (
            <>
              <fieldset className={ui.group}>
                <legend className={ui.legend}>The list</legend>
                <div className={ui.field}>
                  <label htmlFor={listId} className={ui.label}>
                    Phone numbers
                  </label>
                  <p id={listHintId} className={ui.hint}>
                    One number per line, or a table copied from Excel, Google Sheets or a CSV file. A line with a name
                    and a number works too.
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
                      Phone column
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
                          {columnLabelEn(label)}
                        </option>
                      ))}
                    </select>
                  </div>
                ) : null}
              </fieldset>
              <ChoiceGroup
                legend="How to write the numbers in the list"
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
              <h2 className={ui.outputTitle}>The number in every format</h2>
              {single.status === 'valid' ? (
                <SingleResult phone={single.phone} status={status} onCopy={copyRow} />
              ) : (
                <div className={`${styles.card} ${styles.empty}`}>
                  <p>Type a phone number and it appears here in every format, with the number type.</p>
                  <p className={`${ui.note} ${styles.flush}`}>{PRIVACY_NOTE}</p>
                </div>
              )}
            </>
          ) : (
            <>
              <h2 className={ui.outputTitle}>The clean list</h2>
              {bulk.rows ? (
                <div className={styles.stack}>
                  <BulkSummary bulk={bulk} />
                  {bulk.truncated ? (
                    <p className={styles.warning}>
                      We processed the first {MAX_BULK_ROWS.toLocaleString('en-IL')} rows. Split a longer list into
                      several parts.
                    </p>
                  ) : null}
                  {bulk.entries.length ? (
                    <div className={styles.card}>
                      <div className={styles.listBox} role="region" aria-label="The clean list" tabIndex={0}>
                        <pre className={styles.list}>{listText(bulk.entries, format)}</pre>
                      </div>
                      <div className={`${ui.actions} ${styles.flush}`}>
                        <button type="button" className={ui.primary} onClick={copyList}>
                          Copy the list
                        </button>
                        <button type="button" className={ui.secondary} onClick={downloadCsv}>
                          Download CSV
                        </button>
                      </div>
                      <p className={`${ui.hint} ${styles.flush}`}>
                        {table
                          ? 'The file has every column of your table, plus four new columns at the end: international, WhatsApp, local and number type.'
                          : 'The file has four columns: international, WhatsApp, local and number type.'}
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
                  <p>Paste a list of numbers and the clean list appears here, without duplicates and with a CSV file.</p>
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

