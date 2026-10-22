'use client'

import { useEffect, useId, useMemo, useRef, useState, type ChangeEvent, type ReactNode } from 'react'
import { Code, Copy, Download, Printer } from 'lucide-react'
import {
  MAX_REASONABLE_YEARS,
  buildNda,
  categoryOptions,
  contextOptions,
  defaultNdaInput,
  isEmployee,
  ndaChecks,
  ndaDocument,
  ndaTitle,
  ndaToHtml,
  ndaToText,
  partyKinds,
  partyLabels,
  returnOptions,
  scopeOptions,
  toNumber,
  typeOptions,
  type CheckState,
  type NdaBlock,
  type NdaContext,
  type NdaInput,
  type NdaParty,
  type NdaType,
  type PartyKey,
  type PartyKind,
  type ReturnMode,
  type ScopeMode,
} from '@/lib/nda'
import ui from './toolUi.module.css'
import styles from './NdaGenerator.module.css'

type TextKey = 'purpose' | 'city' | 'date'
type NumberKey = 'termMonths' | 'years' | 'returnDays' | 'amount'
type ToggleKey = 'noAi' | 'noReverse' | 'tradeSecrets' | 'liquidated' | 'credit'
type PartyTextKey = Exclude<keyof NdaParty, 'kind'>
type OutputAction = 'text' | 'html' | 'file' | 'print'

const STORAGE_KEY = 'aiterra-nda-v1'
const PLACEHOLDER = /(\[[^\]]+\])/
const NUMBER_LIMITS: Record<NumberKey, number> = { termMonths: 3, years: 2, returnDays: 3, amount: 9 }
const todayIso = () => new Date().toISOString().slice(0, 10)
const countPlaceholders = (text: string) => text.match(/\[[^\]]+\]/g)?.length ?? 0
const stateLabel: Record<CheckState, string> = { ok: 'קיים', missing: 'חסר', optional: 'לא נדרש' }

function readDraft(): Partial<NdaInput> | null {
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY)
    return saved ? (JSON.parse(saved) as Partial<NdaInput>) : null
  } catch {
    return null
  }
}

function writeDraft(input: NdaInput) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(input))
    return true
  } catch {
    return false
  }
}

function mergeDraft(saved: Partial<NdaInput>): NdaInput {
  const base = defaultNdaInput(todayIso())
  return {
    ...base,
    ...saved,
    partyA: { ...base.partyA, ...saved.partyA },
    partyB: { ...base.partyB, ...saved.partyB },
    categories: Array.isArray(saved.categories) ? saved.categories : base.categories,
  }
}

function Field({
  label,
  hint,
  children,
}: {
  label: string
  hint?: ReactNode
  children: (id: string, hintId?: string) => ReactNode
}) {
  const id = useId()
  const hintId = hint ? `${id}-hint` : undefined
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
      {children(id, hintId)}
    </div>
  )
}

function Toggle({
  label,
  checked,
  onChange,
  describedBy,
}: {
  label: string
  checked: boolean
  onChange: () => void
  describedBy?: string
}) {
  return (
    <label className={ui.option}>
      <input
        type="checkbox"
        className={ui.checkbox}
        checked={checked}
        onChange={onChange}
        aria-describedby={describedBy}
      />
      <span>{label}</span>
    </label>
  )
}

function Tiles<T extends string>({
  name,
  options,
  value,
  onChange,
  columns,
}: {
  name: string
  options: { id: T; label: string; hint: string }[]
  value: T
  onChange: (value: T) => void
  columns?: boolean
}) {
  return (
    <div className={columns ? `${styles.tiles} ${styles.tilesTwo}` : styles.tiles}>
      {options.map((option) => (
        <label key={option.id} className={styles.tile}>
          <input
            type="radio"
            name={name}
            className={ui.checkbox}
            checked={value === option.id}
            onChange={() => onChange(option.id)}
          />
          <span className={styles.tileText}>
            <span className={styles.tileName}>{option.label}</span>
            <span className={styles.tileHint}>{option.hint}</span>
          </span>
        </label>
      ))}
    </div>
  )
}

function Marked({ text }: { text: string }) {
  return (
    <>
      {text.split(PLACEHOLDER).map((piece, index) =>
        PLACEHOLDER.test(piece) ? (
          <mark key={index} className={styles.placeholder}>
            {piece}
          </mark>
        ) : (
          piece
        ),
      )}
    </>
  )
}

function Preview({ blocks }: { blocks: NdaBlock[] }) {
  return (
    <div className={`${ui.document} ${styles.doc}`} dir="rtl" lang="he">
      {blocks.map((block, index) => {
        if (block.kind === 'title') {
          return (
            <h3 key={index} className={`${ui.docTitle} ${styles.docTitle}`}>
              {block.text}
            </h3>
          )
        }
        if (block.kind === 'meta') {
          return (
            <p key={index} className={styles.meta}>
              <Marked text={block.text} />
            </p>
          )
        }
        if (block.kind === 'party') {
          return (
            <p key={index} className={styles.party}>
              <span className={styles.partyLabel}>{block.label}</span> <Marked text={block.text} />{' '}
              <span className={styles.alias}>(להלן: &quot;{block.alias}&quot;)</span>
            </p>
          )
        }
        if (block.kind === 'recital') {
          return (
            <p key={index} className={styles.recital}>
              <Marked text={block.text} />
            </p>
          )
        }
        if (block.kind === 'lead') {
          return (
            <p key={index} className={styles.lead}>
              {block.text}
            </p>
          )
        }
        if (block.kind === 'heading') {
          return (
            <h4 key={index} className={ui.docHeading}>
              {block.text}
            </h4>
          )
        }
        if (block.kind === 'clause') {
          return (
            <p key={index}>
              <span className={styles.clauseNo}>{block.number}</span> <Marked text={block.text} />
            </p>
          )
        }
        if (block.kind === 'list') {
          return (
            <ul key={index}>
              {block.items.map((item, itemIndex) => (
                <li key={itemIndex}>
                  <Marked text={item} />
                </li>
              ))}
            </ul>
          )
        }
        if (block.kind === 'signatures') {
          return (
            <div key={index} className={styles.signatures}>
              <p className={styles.lead}>{block.lead}</p>
              <div className={styles.sigGrid}>
                {block.parties.map((party) => (
                  <div key={party.alias} className={styles.sigCol}>
                    <p className={styles.sigName}>
                      <span className={styles.sigAlias}>{party.alias}:</span> <Marked text={party.name} />
                    </p>
                    {party.signatory ? (
                      <p className={styles.sigBy}>
                        באמצעות: <Marked text={party.signatory} />
                      </p>
                    ) : null}
                    <p className={styles.sigLine}>
                      <span>{party.stamp ? 'חתימה וחותמת' : 'חתימה'}</span>
                      <span className={styles.line} aria-hidden="true" />
                    </p>
                    <p className={styles.sigLine}>
                      <span>תאריך</span>
                      <span className={styles.line} aria-hidden="true" />
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )
        }
        return (
          <p key={index} className={ui.docCredit}>
            {block.text} <a href={block.href}>{block.linkText}</a>
          </p>
        )
      })}
    </div>
  )
}

function PartyFields({
  legend,
  party,
  fixedPerson,
  onText,
  onKind,
}: {
  legend: string
  party: NdaParty
  fixedPerson: boolean
  onText: (key: PartyTextKey) => (event: ChangeEvent<HTMLInputElement>) => void
  onKind: (kind: PartyKind) => void
}) {
  const kind = fixedPerson ? 'person' : party.kind
  const numberLabel = kind === 'company' ? 'מספר ח.פ.' : kind === 'dealer' ? 'מספר עוסק' : 'מספר תעודת זהות'
  return (
    <fieldset className={ui.group}>
      <legend className={ui.legend}>{legend}</legend>
      <div className={styles.pair}>
        <Field label={kind === 'person' ? 'שם מלא' : 'שם העסק או החברה'}>
          {(id) => (
            <input
              id={id}
              className={ui.input}
              autoComplete="off"
              value={party.name}
              onChange={onText('name')}
            />
          )}
        </Field>
        {fixedPerson ? null : (
          <Field label="סוג">
            {(id) => (
              <select
                id={id}
                className={ui.input}
                value={party.kind}
                onChange={(event) => onKind(event.target.value as PartyKind)}
              >
                {partyKinds.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.label}
                  </option>
                ))}
              </select>
            )}
          </Field>
        )}
        <Field label={numberLabel}>
          {(id) => (
            <input
              id={id}
              inputMode="numeric"
              autoComplete="off"
              className={`${ui.input} ${ui.ltr}`}
              value={party.idNumber}
              onChange={onText('idNumber')}
            />
          )}
        </Field>
        <Field label="מען">
          {(id) => (
            <input id={id} className={ui.input} autoComplete="off" value={party.address} onChange={onText('address')} />
          )}
        </Field>
        {kind === 'company' ? (
          <>
            <Field label="מורשה החתימה">
              {(id) => (
                <input
                  id={id}
                  className={ui.input}
                  autoComplete="off"
                  value={party.signatory}
                  onChange={onText('signatory')}
                />
              )}
            </Field>
            <Field label="תפקיד (לא חובה)">
              {(id) => (
                <input
                  id={id}
                  className={ui.input}
                  autoComplete="off"
                  value={party.role}
                  onChange={onText('role')}
                />
              )}
            </Field>
          </>
        ) : null}
      </div>
    </fieldset>
  )
}

export default function NdaGenerator() {
  const [input, setInput] = useState<NdaInput>(() => defaultNdaInput(todayIso()))
  const [status, setStatus] = useState('')
  const [restored, setRestored] = useState(false)
  const previewRef = useRef<HTMLDivElement>(null)
  const contextName = useId()
  const typeName = useId()
  const scopeName = useId()
  const yearsWarnId = useId()
  const liquidatedHintId = useId()
  const blocks = useMemo(() => buildNda(input), [input])
  const checks = useMemo(() => ndaChecks(input), [input])
  const employee = isEmployee(input)
  const [labelA, labelB] = partyLabels(input)
  const required = checks.filter((check) => check.state !== 'optional')
  const done = required.filter((check) => check.state === 'ok').length
  const missing = required.length - done
  const longYears = (toNumber(input.years) ?? 0) > MAX_REASONABLE_YEARS

  useEffect(() => {
    const saved = readDraft()
    if (saved) setInput(mergeDraft(saved))
    setRestored(true)
  }, [])

  useEffect(() => {
    if (restored) writeDraft(input)
  }, [input, restored])

  const setText = (key: TextKey) => (event: ChangeEvent<HTMLInputElement>) =>
    setInput((current) => ({ ...current, [key]: event.target.value }))

  const setNumber = (key: NumberKey) => (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value.replace(/[^\d]/g, '').slice(0, NUMBER_LIMITS[key])
    setInput((current) => ({ ...current, [key]: value }))
  }

  const toggle = (key: ToggleKey) => () => setInput((current) => ({ ...current, [key]: !current[key] }))

  const setPartyText = (party: PartyKey) => (key: PartyTextKey) => (event: ChangeEvent<HTMLInputElement>) =>
    setInput((current) => ({ ...current, [party]: { ...current[party], [key]: event.target.value } }))

  const setPartyKind = (party: PartyKey) => (kind: PartyKind) =>
    setInput((current) => ({ ...current, [party]: { ...current[party], kind } }))

  const setContext = (context: NdaContext) =>
    setInput((current) => ({
      ...current,
      context,
      partyB: context === 'employee' ? { ...current.partyB, kind: 'person' } : current.partyB,
    }))

  const setType = (type: NdaType) => setInput((current) => ({ ...current, type }))

  const setScope = (scope: ScopeMode) => setInput((current) => ({ ...current, scope }))

  const toggleCategory = (id: string) =>
    setInput((current) => ({
      ...current,
      categories: current.categories.includes(id)
        ? current.categories.filter((item) => item !== id)
        : [...current.categories, id],
    }))

  const track = (action: OutputAction) =>
    window.gtag?.('event', 'nda_copy', { format: action, nda_type: input.type, nda_context: input.context })

  const withPlaceholderNote = (message: string, text: string) => {
    const left = countPlaceholders(text)
    if (!left) return message
    return `${message}. שימו לב: ${left === 1 ? 'נשאר פרט אחד' : `נשארו ${left} פרטים`} בסוגריים מרובעים להשלמה.`
  }

  const copy = async (format: 'text' | 'html') => {
    const value = format === 'html' ? ndaToHtml(blocks) : ndaToText(blocks)
    try {
      await navigator.clipboard.writeText(value)
      setStatus(withPlaceholderNote(format === 'html' ? 'קוד ה-HTML הועתק' : 'ההסכם הועתק', value))
      track(format)
    } catch {
      setStatus('ההעתקה נכשלה. סמנו את הטקסט בתצוגה המקדימה והעתיקו ידנית.')
    }
  }

  const download = () => {
    const html = ndaDocument(blocks, ndaTitle(input))
    const url = URL.createObjectURL(new Blob([html], { type: 'text/html;charset=utf-8' }))
    const link = document.createElement('a')
    link.href = url
    link.download = 'nda.html'
    link.click()
    URL.revokeObjectURL(url)
    setStatus(withPlaceholderNote('הקובץ ירד. אפשר לפתוח אותו גם ב-Word', ndaToText(blocks)))
    track('file')
  }

  const print = () => {
    const frame = document.createElement('iframe')
    frame.setAttribute('aria-hidden', 'true')
    frame.setAttribute('tabindex', '-1')
    frame.style.position = 'fixed'
    frame.style.width = '0'
    frame.style.height = '0'
    frame.style.border = '0'
    document.body.appendChild(frame)
    const view = frame.contentWindow
    if (!view) {
      frame.remove()
      return
    }
    view.document.open()
    view.document.write(ndaDocument(blocks, ndaTitle(input)))
    view.document.close()
    view.focus()
    view.print()
    window.setTimeout(() => frame.remove(), 1000)
    setStatus(withPlaceholderNote('נפתח חלון ההדפסה. לשמירה כ-PDF בחרו "שמירה כ-PDF"', ndaToText(blocks)))
    track('print')
  }

  const reset = () => {
    setInput(defaultNdaInput(todayIso()))
    setStatus('הטופס אופס')
  }

  const showPreview = () => {
    previewRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    previewRef.current?.focus({ preventScroll: true })
  }

  return (
    <section className={ui.tool} aria-label="מחולל הסכם סודיות">
      <div className={ui.inner}>
        <form className={ui.form} onSubmit={(event) => event.preventDefault()}>
          <div className={styles.toolbar}>
            <button type="button" className={styles.jump} onClick={showPreview}>
              לתצוגה המקדימה
            </button>
          </div>

          <fieldset className={`${ui.group} ${styles.first}`}>
            <legend className={ui.legend}>מי חותם מול מי</legend>
            <Tiles name={contextName} options={contextOptions} value={input.context} onChange={setContext} />
            {employee ? (
              <p className={styles.notice}>
                בתי המשפט בישראל אוכפים הגבלת עיסוק של עובד אחרי שהוא עוזב רק במקרים מצומצמים, כשיש למעסיק
                אינטרס לגיטימי כמו הגנה על סוד מסחרי, כי חופש העיסוק מעוגן בחוק יסוד. לכן ההסכם עוסק בסודיות
                בלבד, בלי סעיף אי תחרות.
              </p>
            ) : null}
          </fieldset>

          {employee ? null : (
            <fieldset className={ui.group}>
              <legend className={ui.legend}>סוג ההסכם</legend>
              <Tiles name={typeName} options={typeOptions} value={input.type} onChange={setType} columns />
            </fieldset>
          )}

          <PartyFields
            legend={labelA}
            party={input.partyA}
            fixedPerson={false}
            onText={setPartyText('partyA')}
            onKind={setPartyKind('partyA')}
          />
          <PartyFields
            legend={labelB}
            party={input.partyB}
            fixedPerson={employee}
            onText={setPartyText('partyB')}
            onKind={setPartyKind('partyB')}
          />

          <fieldset className={ui.group}>
            <legend className={ui.legend}>המידע הסודי</legend>
            <Field
              label={
                employee ? 'תפקיד העובד' : input.context === 'freelancer' ? 'השירות או הפרויקט' : 'מטרת שיתוף המידע'
              }
              hint={
                employee
                  ? 'למשל: מפתח תוכנה'
                  : input.context === 'freelancer'
                    ? 'למשל: פיתוח אתר וחיבורו למערכת ה-CRM'
                    : 'למשל: בחינת שיתוף פעולה בפיתוח אפליקציה'
              }
            >
              {(id, hintId) => (
                <input
                  id={id}
                  aria-describedby={hintId}
                  className={ui.input}
                  value={input.purpose}
                  onChange={setText('purpose')}
                />
              )}
            </Field>
            {employee ? null : (
              <fieldset className={ui.group}>
                <legend className={ui.legend}>מה נחשב מידע סודי</legend>
                <Tiles name={scopeName} options={scopeOptions} value={input.scope} onChange={setScope} />
              </fieldset>
            )}
            <fieldset className={ui.group}>
              <legend className={ui.legend}>דוגמאות שיופיעו בהגדרה</legend>
              <div className={ui.options}>
                {categoryOptions.map((option) => (
                  <label key={option.id} className={ui.option}>
                    <input
                      type="checkbox"
                      className={ui.checkbox}
                      checked={input.categories.includes(option.id)}
                      onChange={() => toggleCategory(option.id)}
                    />
                    <span>{option.label}</span>
                  </label>
                ))}
              </div>
            </fieldset>
            <Toggle
              label="איסור להזין את המידע לכלי בינה מלאכותית בלי אישור"
              checked={input.noAi}
              onChange={toggle('noAi')}
            />
            <Toggle
              label="איסור הנדסה חוזרת, כשמוסרים קוד, תוכנה או אב טיפוס"
              checked={input.noReverse}
              onChange={toggle('noReverse')}
            />
          </fieldset>

          <fieldset className={ui.group}>
            <legend className={ui.legend}>משך הסודיות והחזרת המידע</legend>
            <div className={styles.pair}>
              {employee ? null : (
                <Field label="תקופת ההסכם, בחודשים" hint="כמה זמן ממשיכים למסור מידע">
                  {(id, hintId) => (
                    <input
                      id={id}
                      inputMode="numeric"
                      aria-describedby={hintId}
                      className={`${ui.input} ${ui.ltr}`}
                      value={input.termMonths}
                      onChange={setNumber('termMonths')}
                    />
                  )}
                </Field>
              )}
              <Field
                label="משך הסודיות, בשנים"
                hint={employee ? 'אחרי סיום העבודה' : 'אחרי תום תקופת ההסכם'}
              >
                {(id, hintId) => (
                  <input
                    id={id}
                    inputMode="numeric"
                    aria-describedby={longYears ? `${hintId} ${yearsWarnId}` : hintId}
                    className={`${ui.input} ${ui.ltr}`}
                    value={input.years}
                    onChange={setNumber('years')}
                  />
                )}
              </Field>
            </div>
            {longYears ? (
              <p id={yearsWarnId} className={styles.warn}>
                תקופה ארוכה מאוד מכבידה על הצד המקבל ועלולה לעורר מחלוקת. סודות מסחריים מוגנים ממילא בסעיף נפרד,
                כל עוד הם נשארים סודיים.
              </p>
            ) : null}
            <Toggle
              label="סודות מסחריים נשארים מוגנים כל עוד הם סודיים"
              checked={input.tradeSecrets}
              onChange={toggle('tradeSecrets')}
            />
            <div className={styles.pair}>
              {employee ? null : (
                <Field label="בסיום ההסכם, מה עושים במידע">
                  {(id) => (
                    <select
                      id={id}
                      className={ui.input}
                      value={input.returnMode}
                      onChange={(event) =>
                        setInput((current) => ({ ...current, returnMode: event.target.value as ReturnMode }))
                      }
                    >
                      {returnOptions.map((option) => (
                        <option key={option.id} value={option.id}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  )}
                </Field>
              )}
              <Field label="תוך כמה ימים">
                {(id) => (
                  <input
                    id={id}
                    inputMode="numeric"
                    className={`${ui.input} ${ui.ltr}`}
                    value={input.returnDays}
                    onChange={setNumber('returnDays')}
                  />
                )}
              </Field>
            </div>
          </fieldset>

          {employee ? null : (
            <fieldset className={ui.group}>
              <legend className={ui.legend}>פיצוי מוסכם</legend>
              <Toggle
                label="להוסיף סעיף פיצוי מוסכם על הפרה"
                checked={input.liquidated}
                onChange={toggle('liquidated')}
                describedBy={liquidatedHintId}
              />
              <p id={liquidatedHintId} className={ui.hint}>
                סכום שנקבע מראש ומשולם בלי הוכחת נזק. לפי סעיף 15(א) לחוק החוזים (תרופות בשל הפרת חוזה), בית
                המשפט רשאי להפחית אותו אם נקבע בלי כל יחס סביר לנזק שאפשר היה לצפות מראש.
              </p>
              {input.liquidated ? (
                <Field label="סכום הפיצוי בש״ח">
                  {(id) => (
                    <input
                      id={id}
                      inputMode="numeric"
                      className={`${ui.input} ${ui.ltr} ${styles.amount}`}
                      value={input.amount}
                      onChange={setNumber('amount')}
                    />
                  )}
                </Field>
              ) : null}
            </fieldset>
          )}

          <fieldset className={ui.group}>
            <legend className={ui.legend}>סמכות שיפוט ותאריך</legend>
            <div className={styles.pair}>
              <Field
                label="עיר לסמכות השיפוט"
                hint={employee ? 'בית הדין האזורי לעבודה של האזור' : 'עיר שיש בה בית משפט, למשל תל אביב-יפו'}
              >
                {(id, hintId) => (
                  <input
                    id={id}
                    aria-describedby={hintId}
                    className={ui.input}
                    value={input.city}
                    onChange={setText('city')}
                  />
                )}
              </Field>
              <Field label="תאריך החתימה">
                {(id) => (
                  <input
                    id={id}
                    type="date"
                    className={`${ui.input} ${ui.date}`}
                    value={input.date}
                    onChange={setText('date')}
                  />
                )}
              </Field>
            </div>
          </fieldset>

          <div className={styles.footerRow}>
            <Toggle label="להוסיף בסוף שורת קרדיט עם קישור למחולל" checked={input.credit} onChange={toggle('credit')} />
            <button type="button" className={styles.reset} onClick={reset}>
              איפוס הטופס
            </button>
          </div>
        </form>

        <div className={ui.output}>
          <div className={ui.sticky}>
            <h2 className={ui.outputTitle}>ההסכם שלכם</h2>
            <p className={styles.disclaimer}>
              זו תבנית כללית ולא ייעוץ משפטי. בהסכם עם השלכות משמעותיות, כדאי שעורך דין יעבור עליו לפני
              החתימה.
            </p>
            <details className={styles.checks}>
              <summary className={styles.checksSummary}>
                <span className={styles.checksTitle} data-missing={missing > 0}>
                  {missing
                    ? `חסרים ${missing === 1 ? 'פרט אחד' : `${missing} פרטים`} להסכם מלא`
                    : 'כל הפרטים הנדרשים מולאו'}
                </span>
                <span className={styles.meterText}>
                  {done} מתוך {required.length}
                </span>
                <span className={styles.meter} aria-hidden="true">
                  <span className={styles.meterFill} style={{ inlineSize: `${(done / required.length) * 100}%` }} />
                </span>
              </summary>
              <ul className={styles.checkList}>
                {checks.map((check) => (
                  <li key={check.id} className={styles.checkItem} data-state={check.state}>
                    <span className={styles.checkMark} aria-hidden="true">
                      {check.state === 'ok' ? '✓' : check.state === 'missing' ? '!' : '·'}
                    </span>
                    <span>
                      <span className={styles.checkLabel}>{check.label}</span>
                      <span className={styles.visuallyHidden}>: {stateLabel[check.state]}. </span>
                      <span className={styles.checkNote}>{check.note}</span>
                    </span>
                  </li>
                ))}
              </ul>
            </details>
            <div
              ref={previewRef}
              className={`${ui.paper} ${styles.paper}`}
              role="region"
              aria-label="תצוגה מקדימה של הסכם הסודיות"
              tabIndex={0}
            >
              <Preview blocks={blocks} />
            </div>
            <div className={ui.actions}>
              <button type="button" className={`${ui.primary} ${styles.wide}`} onClick={() => copy('text')}>
                <Copy aria-hidden="true" />
                העתקת ההסכם
              </button>
              <button type="button" className={ui.secondary} onClick={() => copy('html')}>
                <Code aria-hidden="true" />
                קוד HTML
              </button>
              <button type="button" className={ui.secondary} onClick={download}>
                <Download aria-hidden="true" />
                קובץ
              </button>
              <button type="button" className={ui.secondary} onClick={print}>
                <Printer aria-hidden="true" />
                הדפסה או PDF
              </button>
            </div>
            <p className={ui.status} role="status" aria-live="polite">
              {status}
            </p>
            <p className={ui.note}>
              הפרטים נשמרים רק בדפדפן שלכם ולא נשלחים לשום מקום. פרטים בסוגריים מרובעים, המסומנים גם בצהוב, עוד
              צריך להשלים.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
