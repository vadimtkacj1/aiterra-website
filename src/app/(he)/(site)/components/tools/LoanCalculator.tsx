'use client'

import { useEffect, useId, useMemo, useRef, useState } from 'react'
import { Copy, Download, Printer } from 'lucide-react'
import { formatShekels } from '@/lib/vat-calculator'
import {
  DISCLAIMER,
  SCHEDULE_HEADERS,
  compareLoans,
  convertTerm,
  defaultLoanInput,
  evaluateLoan,
  formatAmount,
  formatAnnualRate,
  formatEffectiveRate,
  formatTerm,
  formatTermShort,
  methodLabel,
  methodOptions,
  paymentFigures,
  roundingNote,
  scheduleCsv,
  scheduleDocument,
  summaryText,
  type LoanEvaluation,
  type LoanField,
  type LoanInput,
  type LoanResult,
  type TermUnit,
} from '@/lib/loan-calculator'
import ui from './toolUi.module.css'
import styles from './LoanCalculator.module.css'

type Scenario = 'a' | 'b'
type ExportTarget = 'summary' | 'csv' | 'print'

const ANNOUNCE_DELAY_MS = 900

const scenarioNames: Record<Scenario, string> = { a: 'הצעה א', b: 'הצעה ב' }

const unitOptions: { value: TermUnit; label: string }[] = [
  { value: 'years', label: 'שנים' },
  { value: 'months', label: 'חודשים' },
]

const track = (target: ExportTarget, result: LoanResult, compare: boolean) =>
  window.gtag?.('event', 'loan_calc_copy', {
    target,
    method: result.method,
    months: result.months,
    compare,
  })

function NumberField({
  label,
  spokenUnit,
  hint,
  symbol,
  value,
  error,
  numeric,
  onChange,
}: {
  label: string
  spokenUnit?: string
  hint?: string
  symbol?: string
  value: string
  error?: string
  numeric?: boolean
  onChange: (value: string) => void
}) {
  const id = useId()
  const hintId = `${id}-hint`
  const errorId = `${id}-error`
  const describedBy = [hint ? hintId : '', error ? errorId : ''].filter(Boolean).join(' ')

  return (
    <div className={ui.field}>
      <label htmlFor={id} className={ui.label}>
        {label}
        {spokenUnit ? <span className={styles.srOnly}> {spokenUnit}</span> : null}
      </label>
      {hint ? (
        <p id={hintId} className={ui.hint}>
          {hint}
        </p>
      ) : null}
      <div className={styles.affix}>
        <input
          id={id}
          className={`${ui.input} ${ui.ltr} ${styles.number}${symbol ? ` ${styles.withSymbol}` : ''}`}
          inputMode={numeric ? 'numeric' : 'decimal'}
          autoComplete="off"
          spellCheck={false}
          enterKeyHint="done"
          maxLength={20}
          value={value}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy || undefined}
          onChange={(event) => onChange(event.target.value)}
        />
        {symbol ? (
          <span className={styles.symbol} aria-hidden="true">
            {symbol}
          </span>
        ) : null}
      </div>
      {error ? (
        <p id={errorId} className={styles.error}>
          {error}
        </p>
      ) : null}
    </div>
  )
}

function TermField({
  term,
  unit,
  error,
  onTermChange,
  onUnitChange,
}: {
  term: string
  unit: TermUnit
  error?: string
  onTermChange: (value: string) => void
  onUnitChange: (value: TermUnit) => void
}) {
  const id = useId()
  const errorId = `${id}-error`
  const unitLabel = unit === 'years' ? 'בשנים' : 'בחודשים'

  return (
    <div className={`${ui.field} ${styles.full}`}>
      <label htmlFor={id} className={ui.label}>
        תקופת ההלוואה<span className={styles.srOnly}> {unitLabel}</span>
      </label>
      <div className={styles.termRow}>
        <input
          id={id}
          className={`${ui.input} ${ui.ltr} ${styles.number}`}
          inputMode="decimal"
          autoComplete="off"
          spellCheck={false}
          enterKeyHint="done"
          maxLength={8}
          value={term}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : undefined}
          onChange={(event) => onTermChange(event.target.value)}
        />
        <fieldset className={styles.units}>
          <legend className={styles.srOnly}>יחידת התקופה</legend>
          {unitOptions.map((option) => (
            <label key={option.value} className={styles.unit}>
              <input
                type="radio"
                name={`${id}-unit`}
                value={option.value}
                checked={unit === option.value}
                onChange={() => onUnitChange(option.value)}
              />
              <span>{option.label}</span>
            </label>
          ))}
        </fieldset>
      </div>
      {error ? (
        <p id={errorId} className={styles.error}>
          {error}
        </p>
      ) : null}
    </div>
  )
}

function LoanFields({
  input,
  errors,
  prefix,
  onChange,
}: {
  input: LoanInput
  errors: LoanEvaluation['errors']
  prefix: string
  onChange: (patch: Partial<LoanInput>) => void
}) {
  const name = useId()
  const set = (field: LoanField) => (value: string) => onChange({ [field]: value } as Partial<LoanInput>)

  return (
    <>
      <fieldset className={ui.group}>
        <legend className={ui.legend}>{prefix}פרטי ההלוואה</legend>
        <div className={styles.fields}>
          <NumberField
            label="סכום ההלוואה"
            spokenUnit="בשקלים"
            symbol="₪"
            value={input.amount}
            error={errors.amount}
            onChange={set('amount')}
          />
          <NumberField
            label="ריבית שנתית"
            spokenUnit="באחוזים"
            symbol="%"
            value={input.rate}
            error={errors.rate}
            onChange={set('rate')}
          />
          <TermField
            term={input.term}
            unit={input.termUnit}
            error={errors.term}
            onTermChange={set('term')}
            onUnitChange={(termUnit) =>
              onChange({ termUnit, term: convertTerm(input.term, input.termUnit, termUnit) })
            }
          />
        </div>
      </fieldset>

      <fieldset className={ui.group}>
        <legend className={ui.legend}>{prefix}שיטת ההחזר</legend>
        <div className={styles.methods}>
          {methodOptions.map((option) => (
            <label key={option.value} className={styles.method}>
              <input
                type="radio"
                name={name}
                value={option.value}
                checked={input.method === option.value}
                onChange={() => onChange({ method: option.value })}
              />
              <span className={styles.methodLabel}>{option.label}</span>
              <span className={styles.methodHint}>{option.hint}</span>
            </label>
          ))}
        </div>
        {input.method === 'grace' ? (
          <div className={styles.grace}>
            <NumberField
              label="חודשי גרייס"
              hint="החודשים הראשונים, שבהם משלמים ריבית בלבד."
              numeric
              value={input.graceMonths}
              error={errors.graceMonths}
              onChange={set('graceMonths')}
            />
          </div>
        ) : null}
      </fieldset>

      <fieldset className={ui.group}>
        <legend className={ui.legend}>
          {prefix}עמלות <span className={styles.optional}>(לא חובה)</span>
        </legend>
        <div className={styles.fields}>
          <NumberField
            label="עמלה חד-פעמית"
            spokenUnit="בשקלים"
            hint="למשל פתיחת תיק."
            symbol="₪"
            value={input.oneTimeFee}
            error={errors.oneTimeFee}
            onChange={set('oneTimeFee')}
          />
          <NumberField
            label="עמלה חודשית"
            spokenUnit="בשקלים"
            hint="למשל דמי ניהול."
            symbol="₪"
            value={input.monthlyFee}
            error={errors.monthlyFee}
            onChange={set('monthlyFee')}
          />
        </div>
      </fieldset>
    </>
  )
}

const effectiveExplanation = (result: LoanResult) => {
  const nominal = formatAnnualRate(result.rateBasisPoints)
  if (result.totalFees > 0 && result.rateBasisPoints > 0) {
    return `העלות השנתית האפקטיבית כוללת את העמלות ומביאה בחשבון שהריבית משולמת בכל חודש, ולכן היא גבוהה מהריבית הנקובה של ${nominal}.`
  }
  if (result.totalFees > 0) {
    return `העלות השנתית האפקטיבית כוללת את העמלות, ולכן היא גבוהה מהריבית הנקובה של ${nominal}.`
  }
  if (result.rateBasisPoints > 0) {
    return `העלות השנתית האפקטיבית גבוהה מהריבית הנקובה של ${nominal}, כי הריבית משולמת בכל חודש ולא פעם בשנה.`
  }
  return ''
}

function ResultCard({ result }: { result: LoanResult }) {
  const figures = paymentFigures(result)
  const note = roundingNote(result)
  const explanation = effectiveExplanation(result)

  return (
    <div className={styles.card}>
      <dl className={figures.length > 1 ? `${styles.headline} ${styles.headlinePair}` : styles.headline}>
        {figures.map((figure) => (
          <div key={figure.label} className={styles.headlineItem}>
            <dt className={styles.headlineLabel}>{figure.label}</dt>
            <dd className={styles.headlineValue}>{formatShekels(figure.value)}</dd>
          </div>
        ))}
      </dl>
      <dl className={styles.details}>
        <div className={styles.detail}>
          <dt>סכום ההלוואה</dt>
          <dd>{formatShekels(result.principal)}</dd>
        </div>
        <div className={styles.detail}>
          <dt>סך הריבית</dt>
          <dd>{formatShekels(result.totalInterest)}</dd>
        </div>
        {result.totalFees > 0 ? (
          <div className={styles.detail}>
            <dt>עמלות</dt>
            <dd>{formatShekels(result.totalFees)}</dd>
          </div>
        ) : null}
        <div className={styles.detail}>
          <dt>סך כל התשלומים</dt>
          <dd>{formatShekels(result.totalPaid)}</dd>
        </div>
        <div className={styles.detail}>
          <dt>עלות שנתית אפקטיבית (הערכה)</dt>
          <dd>{formatEffectiveRate(result.effectiveAnnualRate)}</dd>
        </div>
      </dl>
      {explanation || note ? (
        <p className={styles.explain}>{[explanation, note].filter(Boolean).join(' ')}</p>
      ) : null}
    </div>
  )
}

const comparisonRows = (a: LoanResult, b: LoanResult) => {
  const pick = (read: (result: LoanResult) => string) => ({ a: read(a), b: read(b) })
  return [
    { label: 'סכום', ...pick((result) => formatShekels(result.principal)) },
    { label: 'ריבית שנתית', ...pick((result) => formatAnnualRate(result.rateBasisPoints)) },
    { label: 'תקופה', ...pick((result) => formatTermShort(result.months)) },
    { label: 'שיטה', ...pick((result) => methodLabel(result.method)) },
    { label: 'תשלום ראשון', ...pick((result) => formatShekels(result.firstPayment)) },
    { label: 'תשלום אחרון', ...pick((result) => formatShekels(result.lastPayment)) },
    { label: 'סך הריבית', ...pick((result) => formatShekels(result.totalInterest)) },
    { label: 'עמלות', ...pick((result) => formatShekels(result.totalFees)) },
    { label: 'סך כל התשלומים', ...pick((result) => formatShekels(result.totalPaid)) },
    { label: 'עלות שנתית אפקטיבית (הערכה)', ...pick((result) => formatEffectiveRate(result.effectiveAnnualRate)) },
  ]
}

const verdictText = (a: LoanResult, b: LoanResult) => {
  const comparison = compareLoans(a, b)
  if (comparison.cheaper === null) {
    return comparison.basis === 'cost'
      ? 'שתי ההצעות עולות אותו דבר. שנו בהצעה ב את מה שונה בהצעה השנייה שקיבלתם, למשל ריבית, תקופה או עמלות.'
      : 'לשתי ההצעות אותה עלות שנתית אפקטיבית.'
  }
  const cheaper = scenarioNames[comparison.cheaper]
  const pricier = scenarioNames[comparison.cheaper === 'a' ? 'b' : 'a']
  if (comparison.basis === 'rate') {
    return `${cheaper} זולה יותר לפי העלות השנתית האפקטיבית. הסכומים בהצעות שונים, ולכן לא משווים את סך התשלומים.`
  }
  const base = `${cheaper} זולה ב-${formatShekels(comparison.difference)} בסך הריבית והעמלות.`
  const payment = a.method === 'spitzer' && b.method === 'spitzer' ? 'התשלום החודשי' : 'התשלום הראשון'
  return comparison.lowerPaymentIsPricier
    ? `${base} שימו לב: ${payment} ב${pricier} נמוך יותר, אבל בסך הכול היא יקרה יותר.`
    : base
}

function ComparisonCard({ a, b }: { a: LoanResult; b: LoanResult }) {
  return (
    <div className={`${styles.card} ${styles.compareCard}`}>
      <p className={styles.verdict}>{verdictText(a, b)}</p>
      <div className={styles.compareHead} aria-hidden="true">
        <span />
        <span>{scenarioNames.a}</span>
        <span>{scenarioNames.b}</span>
      </div>
      <dl className={styles.compareList}>
        {comparisonRows(a, b).map((row) => (
          <div key={row.label} className={styles.compareRow}>
            <dt>{row.label}</dt>
            <dd>
              <span className={styles.compareWho}>{scenarioNames.a}: </span>
              {row.a}
            </dd>
            <dd>
              <span className={styles.compareWho}>{scenarioNames.b}: </span>
              {row.b}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  )
}

function ScheduleTable({ result, labelledBy }: { result: LoanResult; labelledBy: string }) {
  return (
    <div className={styles.tableScroll} role="region" aria-labelledby={labelledBy} tabIndex={0}>
      <table className={styles.table}>
        <caption className={styles.srOnly}>לוח סילוקין חודשי. הסכומים בשקלים.</caption>
        <thead>
          <tr>
            {SCHEDULE_HEADERS.map((title, index) => (
              <th key={title} scope="col">
                {title}
                {index > 0 ? <span className={styles.currency}> (₪)</span> : null}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {result.rows.map((row) => (
            <tr key={row.month} className={row.principal === 0 ? styles.interestOnly : undefined}>
              <th scope="row">{row.month}</th>
              <td>{formatAmount(row.payment)}</td>
              <td>{formatAmount(row.interest)}</td>
              <td>{formatAmount(row.principal)}</td>
              <td>{formatAmount(row.balance)}</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <th scope="row">סך הכול</th>
            <td>{formatAmount(result.totalPayments)}</td>
            <td>{formatAmount(result.totalInterest)}</td>
            <td>{formatAmount(result.principal)}</td>
            <td />
          </tr>
        </tfoot>
      </table>
    </div>
  )
}

const scheduleMeta = (result: LoanResult) =>
  `${formatShekels(result.principal)}, ריבית ${formatAnnualRate(result.rateBasisPoints)}, ${formatTerm(result.months)}, ${methodLabel(result.method)}${result.method === 'grace' ? ` עם ${result.graceMonths} חודשי גרייס` : ''}`

const emptyMessage = (evaluation: LoanEvaluation) =>
  Object.keys(evaluation.errors).length
    ? 'כדי לראות את התוצאה, תקנו את השדה שמתחתיו הודעת שגיאה.'
    : 'הקלידו סכום, ריבית ותקופה כדי לראות את התוצאה.'

export default function LoanCalculator() {
  const [inputA, setInputA] = useState<LoanInput>(defaultLoanInput)
  const [overridesB, setOverridesB] = useState<Partial<LoanInput>>({})
  const [compare, setCompare] = useState(false)
  const [scheduleOf, setScheduleOf] = useState<Scenario>('a')
  const [status, setStatus] = useState('')
  const [announcement, setAnnouncement] = useState('')
  const scheduleTitleId = useId()
  const scheduleChoiceName = useId()

  const inputB = useMemo(() => ({ ...inputA, ...overridesB }), [inputA, overridesB])
  const evaluationA = useMemo(() => evaluateLoan(inputA), [inputA])
  const evaluationB = useMemo(() => evaluateLoan(inputB), [inputB])
  const resultA = evaluationA.result
  const resultB = compare ? evaluationB.result : null
  const comparing = Boolean(resultA && resultB)
  const scheduleScenario: Scenario = comparing ? scheduleOf : 'a'
  const scheduleResult = scheduleScenario === 'b' ? resultB : resultA

  const spoken = useMemo(() => {
    if (resultA && resultB) return verdictText(resultA, resultB)
    if (!resultA) return ''
    const figures = paymentFigures(resultA)
      .map((figure) => `${figure.label} ${formatShekels(figure.value)}`)
      .join(', ')
    return `${figures}. סך הריבית ${formatShekels(resultA.totalInterest)}.`
  }, [resultA, resultB])
  const lastSpoken = useRef(spoken)

  useEffect(() => {
    if (spoken === lastSpoken.current) return
    const timer = window.setTimeout(() => {
      lastSpoken.current = spoken
      setAnnouncement(spoken)
    }, ANNOUNCE_DELAY_MS)
    return () => window.clearTimeout(timer)
  }, [spoken])

  const updateA = (patch: Partial<LoanInput>) => setInputA((current) => ({ ...current, ...patch }))
  const updateB = (patch: Partial<LoanInput>) => setOverridesB((current) => ({ ...current, ...patch }))

  const copySummary = async () => {
    if (!resultA) {
      setStatus('הקלידו סכום, ריבית ותקופה כדי להעתיק את התוצאה.')
      return
    }
    try {
      await navigator.clipboard.writeText(summaryText(resultA, resultB))
      setStatus(resultB ? 'ההשוואה הועתקה' : 'הסיכום הועתק')
      track('summary', resultA, Boolean(resultB))
    } catch {
      setStatus('ההעתקה נכשלה. סמנו את התוצאה והעתיקו ידנית.')
    }
  }

  const scheduleHeading = (result: LoanResult) =>
    `לוח סילוקין${comparing ? `, ${scenarioNames[scheduleScenario]}` : ''}: הלוואה של ${formatShekels(result.principal)}`

  const downloadCsv = () => {
    if (!scheduleResult) return
    const blob = new Blob([scheduleCsv(scheduleResult)], { type: 'text/csv;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = comparing ? `לוח-סילוקין-${scenarioNames[scheduleScenario].replace(' ', '-')}.csv` : 'לוח-סילוקין.csv'
    link.click()
    window.setTimeout(() => URL.revokeObjectURL(url), 1000)
    setStatus('קובץ ה-CSV ירד. אפשר לפתוח אותו ב-Excel או ב-Google Sheets.')
    track('csv', scheduleResult, comparing)
  }

  const print = () => {
    if (!scheduleResult) return
    const frame = document.createElement('iframe')
    frame.setAttribute('aria-hidden', 'true')
    frame.tabIndex = -1
    Object.assign(frame.style, { position: 'fixed', bottom: '0', width: '0', height: '0', border: '0' })
    frame.onload = () => {
      const view = frame.contentWindow
      if (!view) return
      view.focus()
      view.print()
      window.setTimeout(() => frame.remove(), 1000)
    }
    frame.srcdoc = scheduleDocument(scheduleResult, scheduleHeading(scheduleResult))
    document.body.appendChild(frame)
    setStatus('נפתח חלון ההדפסה. כדי לקבל קובץ PDF, בחרו ביעד שמירה כ-PDF.')
    track('print', scheduleResult, comparing)
  }

  return (
    <section className={`${ui.tool} ${styles.calc}`} aria-label="מחשבון הלוואה">
      <div className={ui.inner}>
        <form className={ui.form} onSubmit={(event) => event.preventDefault()}>
          <LoanFields
            input={inputA}
            errors={evaluationA.errors}
            prefix={compare ? `${scenarioNames.a}: ` : ''}
            onChange={updateA}
          />

          <fieldset className={ui.group}>
            <legend className={ui.legend}>השוואה בין הצעות</legend>
            <label className={styles.toggle}>
              <input
                type="checkbox"
                className={ui.checkbox}
                checked={compare}
                onChange={(event) => {
                  setCompare(event.target.checked)
                  setStatus('')
                }}
              />
              <span>להוסיף הצעה שנייה ולהשוות ביניהן</span>
            </label>
          </fieldset>

          {compare ? (
            <div className={styles.second}>
              <p className={styles.secondNote}>
                הערכים מועתקים מהצעה א. שנו רק את מה ששונה בהצעה השנייה.
              </p>
              <LoanFields
                input={inputB}
                errors={evaluationB.errors}
                prefix={`${scenarioNames.b}: `}
                onChange={updateB}
              />
            </div>
          ) : null}
        </form>

        <div className={ui.output}>
          <div className={ui.sticky}>
            <h2 className={ui.outputTitle}>{comparing ? 'השוואת ההצעות' : 'התוצאה'}</h2>
            {resultA && resultB ? (
              <ComparisonCard a={resultA} b={resultB} />
            ) : resultA ? (
              <ResultCard result={resultA} />
            ) : (
              <div className={styles.card}>
                <p className={styles.message}>{emptyMessage(evaluationA)}</p>
              </div>
            )}
            {compare && resultA && !resultB ? (
              <p className={styles.explain}>כדי להשוות, השלימו או תקנו את השדות של הצעה ב.</p>
            ) : null}
            <div className={ui.actions}>
              <button type="button" className={`${ui.primary} ${styles.grow}`} onClick={copySummary}>
                <Copy aria-hidden="true" />
                {comparing ? 'העתקת ההשוואה' : 'העתקת הסיכום'}
              </button>
            </div>
            <p className={ui.status} role="status" aria-live="polite">
              {status}
            </p>
            <p className={styles.srOnly} role="status" aria-live="polite">
              {announcement}
            </p>
            <p className={ui.note}>
              החישוב נעשה בדפדפן שלכם, והנתונים לא נשלחים לשום מקום. {DISCLAIMER} התנאים בהצעה שתקבלו יכולים
              להיות שונים.
            </p>
          </div>
        </div>
      </div>

      {scheduleResult ? (
        <div className={styles.schedule} id="loan-schedule">
          <div className={styles.scheduleHead}>
            <div className={styles.scheduleIntro}>
              <h2 id={scheduleTitleId} className={styles.scheduleTitle}>
                לוח סילוקין{comparing ? `, ${scenarioNames[scheduleScenario]}` : ''}
              </h2>
              <p className={styles.scheduleMeta}>{scheduleMeta(scheduleResult)}</p>
            </div>
            <div className={`${ui.actions} ${styles.scheduleActions}`}>
              <button type="button" className={ui.secondary} onClick={downloadCsv}>
                <Download aria-hidden="true" />
                הורדה כ-CSV
              </button>
              <button type="button" className={ui.secondary} onClick={print}>
                <Printer aria-hidden="true" />
                הדפסה או PDF
              </button>
            </div>
          </div>
          {comparing ? (
            <fieldset className={styles.which}>
              <legend className={styles.whichLegend}>איזה לוח להציג</legend>
              <div className={styles.whichOptions}>
                {(['a', 'b'] as const).map((scenario) => (
                  <label key={scenario} className={styles.unit}>
                    <input
                      type="radio"
                      name={scheduleChoiceName}
                      value={scenario}
                      checked={scheduleScenario === scenario}
                      onChange={() => setScheduleOf(scenario)}
                    />
                    <span>{scenarioNames[scenario]}</span>
                  </label>
                ))}
              </div>
            </fieldset>
          ) : null}
          <ScheduleTable result={scheduleResult} labelledBy={scheduleTitleId} />
          <p className={ui.note}>
            הריבית של כל חודש מחושבת על היתרה שנשארה ומעוגלת לאגורה הקרובה. ההפרש שמצטבר מהעיגול נסגר בתשלום
            האחרון. העמלות לא מופיעות בלוח, והן נכללות בסך כל התשלומים ובעלות השנתית האפקטיבית.
          </p>
        </div>
      ) : null}
    </section>
  )
}
