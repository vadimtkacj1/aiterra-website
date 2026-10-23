'use client'

import { useEffect, useId, useRef, useState, useSyncExternalStore, type ReactNode } from 'react'
import { Copy } from 'lucide-react'
import {
  announcementFor,
  categoriesFor,
  channelOptions,
  checkCancellation,
  daysLeftText,
  fieldErrors,
  fieldsFor,
  kindOptions,
  resultToText,
  statusOptions,
  type CancelInput,
  type CancelOutcome,
  type Channel,
  type DocState,
  type Kind,
  type Reason,
  type Status,
} from '@/lib/cancel-transaction'
import { dayFromIso, todayIso } from '@/lib/work-days'
import ui from './toolUi.module.css'
import styles from './CancelTransactionChecker.module.css'

const ANNOUNCE_DELAY_MS = 900

const firstCategory = (channel: Channel, kind: Kind) =>
  categoriesFor(channel, kind).find((category) => !category.excluded)?.id ?? ''

const initialInput: CancelInput = {
  channel: 'remote',
  kind: 'goods',
  category: firstCategory('remote', 'goods'),
  dealDate: '',
  receivedDate: '',
  docState: 'on-time',
  docDate: '',
  serviceDate: '',
  status: 'none',
  conversation: false,
  reason: 'change',
  price: '',
  vouchers: false,
}

const reasonOptions: { value: Reason; label: string; hint: string }[] = [
  { value: 'change', label: 'שיניתי את דעתי', hint: 'בלי סיבה מיוחדת' },
  { value: 'defect', label: 'פגם, אי התאמה או איחור', hint: 'או הפרה אחרת של העוסק' },
]

const subscribeNever = () => () => {}

function useToday() {
  const iso = useSyncExternalStore(subscribeNever, todayIso, () => '')
  return iso ? dayFromIso(iso) : null
}

function ChoiceGroup<T extends string>({
  legend,
  name,
  value,
  options,
  columns,
  onChange,
}: {
  legend: string
  name: string
  value: T
  options: { value: T; label: string; hint?: string }[]
  columns: 2 | 3
  onChange: (value: T) => void
}) {
  return (
    <fieldset className={ui.group}>
      <legend className={ui.legend}>{legend}</legend>
      <div className={`${styles.choices} ${columns === 3 ? styles.choicesThree : ''}`}>
        {options.map((option) => (
          <label key={option.value} className={styles.choice}>
            <input
              type="radio"
              name={name}
              value={option.value}
              checked={value === option.value}
              onChange={() => onChange(option.value)}
            />
            <span className={styles.choiceLabel}>{option.label}</span>
            {option.hint ? <span className={styles.choiceHint}>{option.hint}</span> : null}
          </label>
        ))}
      </div>
    </fieldset>
  )
}

function Field({
  id,
  label,
  hint,
  error,
  children,
}: {
  id: string
  label: string
  hint?: string
  error?: string
  children: (props: { describedBy: string | undefined; invalid: true | undefined }) => ReactNode
}) {
  const hintId = `${id}-hint`
  const errorId = `${id}-error`
  const describedBy = [hint ? hintId : '', error ? errorId : ''].filter(Boolean).join(' ') || undefined
  return (
    <div className={ui.field}>
      <label htmlFor={id} className={ui.label}>
        {label}
      </label>
      {hint ? (
        <p id={hintId} className={ui.hint}>
          {hint}
        </p>
      ) : null}
      {children({ describedBy, invalid: error ? true : undefined })}
      {error ? (
        <p id={errorId} className={styles.error}>
          {error}
        </p>
      ) : null}
    </div>
  )
}

function DateInput({
  id,
  label,
  hint,
  value,
  error,
  onChange,
}: {
  id: string
  label: string
  hint?: string
  value: string
  error?: string
  onChange: (value: string) => void
}) {
  return (
    <Field id={id} label={label} hint={hint} error={error}>
      {({ describedBy, invalid }) => (
        <input
          id={id}
          type="date"
          className={`${ui.input} ${styles.date}`}
          min="2020-01-01"
          max="2099-12-31"
          value={value}
          aria-invalid={invalid}
          aria-describedby={describedBy}
          onChange={(event) => onChange(event.target.value)}
        />
      )}
    </Field>
  )
}

const toneOf = (outcome: CancelOutcome) => {
  if (outcome.kind === 'no-right') return styles.toneStop
  if (outcome.kind !== 'result') return ''
  if (outcome.verdict === 'passed') return styles.toneStop
  if (outcome.verdict === 'last-day') return styles.toneWarn
  return styles.toneGo
}

function ResultCard({ outcome }: { outcome: CancelOutcome }) {
  if (outcome.kind === 'incomplete' || outcome.kind === 'invalid') {
    return (
      <div className={styles.card}>
        <p className={styles.message}>{outcome.message}</p>
      </div>
    )
  }
  if (outcome.kind === 'no-right') {
    return (
      <div className={`${styles.card} ${toneOf(outcome)}`}>
        <p className={styles.headline}>{outcome.headline}</p>
        <p className={styles.text}>{outcome.text}</p>
        <p className={styles.basis}>לפי {outcome.basis}</p>
        {outcome.notes.map((note) => (
          <p key={note} className={styles.insight}>
            {note}
          </p>
        ))}
      </div>
    )
  }
  return (
    <div className={`${styles.card} ${toneOf(outcome)}`}>
      <p className={styles.headline}>{outcome.headline}</p>
      {outcome.daysLeft !== null && outcome.daysLeft > 0 ? (
        <p className={styles.daysLeft}>{daysLeftText(outcome.daysLeft)}</p>
      ) : null}
      <dl className={styles.facts}>
        {outcome.facts.map((fact) => (
          <div key={fact.label} className={styles.fact}>
            <dt>{fact.label}</dt>
            <dd>
              <span className={styles.factValue}>{fact.value}</span>
              <span className={styles.factDetail}>{fact.detail}</span>
            </dd>
          </div>
        ))}
      </dl>
      {outcome.notes.length ? (
        <ul className={styles.notes}>
          {outcome.notes.map((note) => (
            <li key={note}>{note}</li>
          ))}
        </ul>
      ) : null}
    </div>
  )
}

const docLabels = (input: CancelInput) => {
  if (input.channel === 'door') {
    return { label: 'הפרטים בכתב מהרוכל', onTime: input.kind === 'goods' ? 'קיבלתי עד קבלת המוצר' : 'קיבלתי ביום העסקה' }
  }
  if (input.channel === 'store') return { label: 'חוזה או מסמך בכתב על העסקה', onTime: 'קיבלתי ביום העסקה' }
  return {
    label: 'מסמך בכתב עם פרטי העסקה ודרך הביטול',
    onTime: input.kind === 'goods' ? 'קיבלתי עד קבלת המוצר, למשל במייל' : 'קיבלתי ביום העסקה, למשל במייל',
  }
}

export default function CancelTransactionChecker() {
  const [input, setInput] = useState<CancelInput>(initialInput)
  const [status, setStatus] = useState('')
  const [announcement, setAnnouncement] = useState('')
  const today = useToday()
  const id = useId()
  const errors = fieldErrors(input, today)
  const fields = fieldsFor(input)
  const outcome = checkCancellation(input, today)
  const spoken = announcementFor(outcome)
  const lastSpoken = useRef(spoken)
  const options = categoriesFor(input.channel, input.kind)
  const allowed = options.filter((category) => !category.excluded)
  const exceptions = options.filter((category) => category.excluded)
  const doc = docLabels(input)

  useEffect(() => {
    if (spoken === lastSpoken.current) return
    const timer = window.setTimeout(() => {
      lastSpoken.current = spoken
      setAnnouncement(spoken)
    }, ANNOUNCE_DELAY_MS)
    return () => window.clearTimeout(timer)
  }, [spoken])

  const update = (patch: Partial<CancelInput>) => {
    setInput((current) => {
      const next = { ...current, ...patch }
      if (patch.channel !== undefined || patch.kind !== undefined) next.category = firstCategory(next.channel, next.kind)
      return next
    })
    setStatus('')
  }

  const copy = async (text: string, what: 'notice' | 'summary') => {
    try {
      await navigator.clipboard.writeText(text)
      setStatus(what === 'notice' ? 'ההודעה הועתקה' : 'הסיכום הועתק')
      window.gtag?.('event', 'cancel_transaction_copy', { what, channel: input.channel, kind: input.kind })
    } catch {
      setStatus('ההעתקה נכשלה. סמנו את הטקסט והעתיקו ידנית.')
    }
  }

  const result = outcome.kind === 'result' ? outcome : null
  const goods = input.kind === 'goods'

  return (
    <section className={`${ui.tool} ${styles.checker}`} aria-label="בדיקת זכות הביטול">
      <div className={`${ui.inner} ${styles.layout}`}>
        <form className={ui.form} onSubmit={(event) => event.preventDefault()} noValidate>
          <ChoiceGroup
            legend="איך קניתם"
            name={`${id}-channel`}
            value={input.channel}
            options={channelOptions}
            columns={3}
            onChange={(channel) => update({ channel })}
          />
          <ChoiceGroup
            legend="מה קניתם"
            name={`${id}-kind`}
            value={input.kind}
            options={kindOptions}
            columns={2}
            onChange={(kind) => update({ kind })}
          />

          <fieldset className={ui.group}>
            <legend className={ui.legend}>{goods ? 'סוג המוצר' : 'סוג השירות'}</legend>
            <Field id={`${id}-category`} label={goods ? 'מה המוצר' : 'מה השירות'} hint="בחרו את האפשרות הקרובה ביותר.">
              {({ describedBy }) => (
                <select
                  id={`${id}-category`}
                  className={`${ui.input} ${styles.select}`}
                  value={input.category}
                  aria-describedby={describedBy}
                  onChange={(event) => update({ category: event.target.value })}
                >
                  {allowed.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.label}
                    </option>
                  ))}
                  {exceptions.length ? (
                    <optgroup label="חריגים: אין זכות ביטול לפי החוק">
                      {exceptions.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.label}
                        </option>
                      ))}
                    </optgroup>
                  ) : null}
                </select>
              )}
            </Field>
          </fieldset>

          <fieldset className={ui.group}>
            <legend className={ui.legend}>תאריכים</legend>
            <div className={styles.dateGrid}>
              <DateInput
                id={`${id}-deal`}
                label={input.channel === 'store' ? 'יום הקנייה' : 'יום העסקה'}
                hint={input.channel === 'remote' ? 'היום שבו הזמנתם.' : undefined}
                value={input.dealDate}
                error={errors.dealDate}
                onChange={(dealDate) => update({ dealDate })}
              />
              {fields.received ? (
                <DateInput
                  id={`${id}-received`}
                  label="יום קבלת המוצר"
                  hint={
                    input.channel === 'store'
                      ? 'אם קיבלתם אותו ביום הקנייה, אפשר להשאיר ריק.'
                      : 'אם המוצר עוד לא הגיע, השאירו ריק.'
                  }
                  value={input.receivedDate}
                  error={errors.receivedDate}
                  onChange={(receivedDate) => update({ receivedDate })}
                />
              ) : null}
              {fields.serviceDate ? (
                <DateInput
                  id={`${id}-service`}
                  label={input.channel === 'store' ? 'יום תחילת השירות' : 'מועד השירות'}
                  value={input.serviceDate}
                  error={errors.serviceDate}
                  onChange={(serviceDate) => update({ serviceDate })}
                />
              ) : null}
            </div>
            {fields.document ? (
              <div className={styles.docRow}>
                <Field id={`${id}-doc`} label={doc.label} hint="החוק סופר את הימים גם מהיום שבו קיבלתם אותו.">
                  {({ describedBy }) => (
                    <select
                      id={`${id}-doc`}
                      className={`${ui.input} ${styles.select}`}
                      value={input.docState}
                      aria-describedby={describedBy}
                      onChange={(event) => update({ docState: event.target.value as DocState })}
                    >
                      <option value="on-time">{doc.onTime}</option>
                      <option value="later">קיבלתי מאוחר יותר</option>
                      <option value="none">לא קיבלתי</option>
                    </select>
                  )}
                </Field>
                {input.docState === 'later' ? (
                  <DateInput
                    id={`${id}-doc-date`}
                    label="יום קבלת המסמך"
                    value={input.docDate}
                    error={errors.docDate}
                    onChange={(docDate) => update({ docDate })}
                  />
                ) : null}
              </div>
            ) : null}
          </fieldset>

          {fields.status ? (
            <fieldset className={ui.group}>
              <legend className={ui.legend}>זכות ל-4 חודשים</legend>
              <Field
                id={`${id}-status`}
                label="האם אחד מאלה נכון לגביכם?"
                hint="לאזרח ותיק, לאדם עם מוגבלות ולעולה חדש יש תקופת ביטול ארוכה יותר."
              >
                {({ describedBy }) => (
                  <select
                    id={`${id}-status`}
                    className={`${ui.input} ${styles.select}`}
                    value={input.status}
                    aria-describedby={describedBy}
                    onChange={(event) => update({ status: event.target.value as Status })}
                  >
                    {statusOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                )}
              </Field>
              {fields.conversation ? (
                <label className={ui.option}>
                  <input
                    type="checkbox"
                    className={ui.checkbox}
                    checked={input.conversation}
                    onChange={(event) => update({ conversation: event.target.checked })}
                  />
                  <span>בעסקה הייתה שיחה ביני לבין העוסק או נציג שלו, גם בטלפון או בתקשורת אלקטרונית</span>
                </label>
              ) : null}
            </fieldset>
          ) : null}

          {fields.reason ? (
            <ChoiceGroup
              legend="למה מבטלים"
              name={`${id}-reason`}
              value={input.reason}
              options={reasonOptions}
              columns={2}
              onChange={(reason) => update({ reason })}
            />
          ) : null}

          <fieldset className={ui.group}>
            <legend className={ui.legend}>המחיר</legend>
            <Field
              id={`${id}-price`}
              label={input.channel === 'remote' ? 'המחיר הכולל ששילמתם, כולל משלוח, בשקלים' : 'המחיר ששילמתם, בשקלים'}
              hint={fields.priceRequired ? 'צריך אותו כדי לבדוק את הזכות ואת דמי הביטול.' : 'לא חובה. משמש לחישוב דמי הביטול.'}
              error={errors.price}
            >
              {({ describedBy, invalid }) => (
                <input
                  id={`${id}-price`}
                  className={`${ui.input} ${ui.ltr} ${styles.price}`}
                  inputMode="decimal"
                  autoComplete="off"
                  spellCheck={false}
                  maxLength={16}
                  value={input.price}
                  aria-invalid={invalid}
                  aria-describedby={describedBy}
                  onChange={(event) => update({ price: event.target.value })}
                />
              )}
            </Field>
            {fields.vouchers ? (
              <label className={ui.option}>
                <input
                  type="checkbox"
                  className={ui.checkbox}
                  checked={input.vouchers}
                  onChange={(event) => update({ vouchers: event.target.checked })}
                />
                <span>שילמתי בתווי קנייה, בשובר מתנה או בכרטיס נטען</span>
              </label>
            ) : null}
          </fieldset>
        </form>

        <div className={ui.output}>
          <div className={ui.sticky}>
            <h2 className={ui.outputTitle}>התוצאה</h2>
            <ResultCard outcome={outcome} />

            {result ? (
              <div className={styles.notice}>
                <h3 className={styles.noticeTitle}>
                  {input.channel === 'store' ? 'נוסח לבקשת ביטול בחנות' : 'הודעת ביטול לשליחה במייל או בוואטסאפ'}
                </h3>
                <p className={styles.noticeHint}>מחליפים את מה שבסוגריים המרובעים בפרטים שלכם.</p>
                <p className={styles.noticeText}>{result.template}</p>
              </div>
            ) : null}

            {result ? (
              <div className={ui.actions}>
                <button
                  type="button"
                  className={`${ui.primary} ${styles.grow}`}
                  onClick={() => copy(result.template, 'notice')}
                >
                  <Copy aria-hidden="true" />
                  העתקת ההודעה
                </button>
                <button
                  type="button"
                  className={`${ui.secondary} ${styles.grow}`}
                  onClick={() => copy(resultToText(result), 'summary')}
                >
                  <Copy aria-hidden="true" />
                  העתקת הסיכום
                </button>
              </div>
            ) : null}
            <p className={ui.status} role="status" aria-live="polite">
              {status}
            </p>
            <p className={styles.srOnly} role="status" aria-live="polite">
              {announcement}
            </p>
            <p className={ui.note}>
              בדיקה לפי חוק הגנת הצרכן ותקנות הביטול, מידע כללי ולא ייעוץ משפטי. הבדיקה נעשית בדפדפן, והפרטים לא
              נשלחים לשום מקום.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
