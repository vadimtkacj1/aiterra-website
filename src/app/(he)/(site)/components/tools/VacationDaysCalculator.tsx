'use client'

import { useEffect, useId, useMemo, useRef, useState, useSyncExternalStore } from 'react'
import { Copy } from 'lucide-react'
import {
  FULL_YEAR_THRESHOLD,
  MAX_SENIORITY,
  PARTIAL_YEAR_THRESHOLD,
  SHORT_WORKER_DAYS,
  calculateVacation,
  daysText,
  defaultInput,
  fieldErrors,
  formatDecimal,
  perMonthText,
  resultToText,
  sourceLabels,
  vacationDaysText,
  weekText,
  type SeniorityMode,
  type VacationInput,
  type VacationOutcome,
  type VacationResult,
  type WorkWeek,
  type YearCoverage,
} from '@/lib/vacation-days'
import { formatDate } from '@/lib/work-days'
import ui from './toolUi.module.css'
import styles from './VacationDaysCalculator.module.css'

const ANNOUNCE_DELAY_MS = 900
const FALLBACK_YEAR = 2026

type Option<T extends string> = { value: T; label: string; hint?: string }

const modeOptions: Option<SeniorityMode>[] = [
  { value: 'dates', label: 'לפי תאריך תחילת העבודה', hint: 'המחשבון סופר את שנות הוותק' },
  { value: 'year', label: 'אני יודע את שנת הוותק', hint: 'בוחרים מספר מרשימה' },
]

const weekOptions: Option<WorkWeek>[] = [
  { value: '5', label: '5 ימים בשבוע', hint: 'ראשון עד חמישי' },
  { value: '6', label: '6 ימים בשבוע', hint: 'ראשון עד שישי' },
]

const coverageOptions: Option<YearCoverage>[] = [
  { value: 'full', label: 'כל השנה', hint: `סף של ${FULL_YEAR_THRESHOLD} ימי עבודה` },
  { value: 'partial', label: 'רק חלק מהשנה', hint: `סף של ${PARTIAL_YEAR_THRESHOLD} ימי עבודה` },
]

const subscribeNever = () => () => {}

const useCurrentYear = () => useSyncExternalStore(subscribeNever, () => new Date().getFullYear(), () => FALLBACK_YEAR)

function ChoiceGroup<T extends string>({
  legend,
  name,
  options,
  value,
  onChange,
}: {
  legend: string
  name: string
  options: Option<T>[]
  value: T
  onChange: (value: T) => void
}) {
  return (
    <fieldset className={ui.group}>
      <legend className={ui.legend}>{legend}</legend>
      <div className={styles.choices}>
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
              <span className={styles.choiceLabel}>{option.label}</span>
              {option.hint ? <span className={styles.choiceHint}>{option.hint}</span> : null}
            </span>
          </label>
        ))}
      </div>
    </fieldset>
  )
}

function TextField({
  label,
  hint,
  value,
  error,
  type = 'text',
  onChange,
}: {
  label: string
  hint?: string
  value: string
  error?: string
  type?: 'text' | 'date'
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
      </label>
      {hint ? (
        <p id={hintId} className={ui.hint}>
          {hint}
        </p>
      ) : null}
      <input
        id={id}
        type={type}
        className={`${ui.input} ${type === 'date' ? `${ui.date} ${styles.date}` : `${ui.ltr} ${styles.number}`}`}
        inputMode={type === 'text' ? 'numeric' : undefined}
        autoComplete="off"
        spellCheck={false}
        enterKeyHint="done"
        maxLength={type === 'text' ? 4 : undefined}
        min={type === 'date' ? '1950-01-01' : undefined}
        max={type === 'date' ? '2099-12-31' : undefined}
        value={value}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy || undefined}
        onChange={(event) => onChange(event.target.value)}
      />
      {error ? (
        <p id={errorId} className={styles.error}>
          {error}
        </p>
      ) : null}
    </div>
  )
}

const seniorityText = (year: number) => (year === 1 ? 'שנת הוותק הראשונה' : `שנת הוותק ה-${year}`)

const sourceText = (result: VacationResult) => {
  const names = result.entitlement.sources.map((id) => sourceLabels[id])
  if (names.length === 1) return `לפי ${names[0]}`
  return `לפי ${names.slice(0, -1).join(', ')} ו${names[names.length - 1]}, שנותנים אותו מספר`
}

const announcementFor = (outcome: VacationOutcome) => {
  if (outcome.kind !== 'result') return ''
  return `${vacationDaysText(outcome.days)} ב${seniorityText(outcome.seniorityYear)}. ${sourceText(outcome)}.`
}

function ResultCard({ outcome }: { outcome: VacationOutcome }) {
  if (outcome.kind !== 'result') {
    return (
      <div className={styles.card}>
        <p className={styles.message}>{outcome.message}</p>
      </div>
    )
  }
  const { entitlement } = outcome
  const estimated = outcome.daysSource === 'estimated'

  return (
    <div className={styles.card}>
      <p className={styles.kicker}>
        {outcome.calendarYear
          ? `ימי חופשה בשנת ${outcome.calendarYear}, ${seniorityText(outcome.seniorityYear)}`
          : `ימי חופשה ב${seniorityText(outcome.seniorityYear)}`}
      </p>
      <p className={styles.answer}>{daysText(outcome.days)}</p>
      <p className={styles.basis}>
        ימי עבודה, ב{weekText(outcome.week)}. {sourceText(outcome)}.
      </p>
      <dl className={styles.facts}>
        {outcome.prorated ? (
          <div className={styles.fact}>
            <dt>לשנה מלאה</dt>
            <dd>{daysText(entitlement.best)}</dd>
          </div>
        ) : null}
        {outcome.daysWorked !== null ? (
          <div className={styles.fact}>
            <dt>{estimated ? 'ימי עבודה בפועל, הערכה' : 'ימי עבודה בפועל'}</dt>
            <dd>
              {estimated ? 'כ-' : ''}
              {outcome.daysWorked} מתוך {outcome.threshold}
            </dd>
          </div>
        ) : null}
        <div className={styles.fact}>
          <dt>בממוצע לחודש</dt>
          <dd>{perMonthText(outcome.perMonth)}</dd>
        </div>
      </dl>

      <h3 className={styles.subTitle}>ההשוואה</h3>
      <dl className={styles.compare}>
        <div className={styles.compareRow}>
          <dt>{sourceLabels.law}</dt>
          <dd>
            {daysText(entitlement.law)}
            <span className={styles.compareHint}>{entitlement.lawGross} ימים כולל מנוחה שבועית</span>
          </dd>
        </div>
        {entitlement.order !== null ? (
          <div className={styles.compareRow}>
            <dt>{sourceLabels.order}</dt>
            <dd>{daysText(entitlement.order)}</dd>
          </div>
        ) : null}
        {entitlement.agency !== null ? (
          <div className={styles.compareRow}>
            <dt>{sourceLabels.agency}</dt>
            <dd>{daysText(entitlement.agency)}</dd>
          </div>
        ) : null}
      </dl>

      {outcome.period && outcome.daysSource === 'none' ? (
        <p className={styles.insight}>
          {outcome.fullYear
            ? `העבודה נמשכה כל שנת ${outcome.calendarYear}. אם עבדתם בפועל פחות מ-${FULL_YEAR_THRESHOLD} ימים, הקלידו כמה, והמספר יקטן באופן יחסי.`
            : `העבודה בשנת ${outcome.calendarYear} נמשכה מ-${formatDate(outcome.period.from)} עד ${formatDate(outcome.period.to)}, ולכן הזכאות יחסית למספר ימי העבודה מתוך ${PARTIAL_YEAR_THRESHOLD}.`}
        </p>
      ) : null}
      {estimated ? (
        <p className={styles.insight}>
          מספר ימי העבודה הוא הערכה: ימי עבודה בתקופה פחות חגים, בלי מחלה, מילואים או היעדרויות אחרות. לחישוב מדויק
          הקלידו את ימי העבודה בפועל.
        </p>
      ) : null}
      {outcome.prorated ? (
        <p className={styles.insight}>
          <span dir="ltr">
            {entitlement.best} × {outcome.daysWorked} ÷ {outcome.threshold} = {formatDecimal(outcome.exact)}
          </span>
          . לפי סעיף 3 לחוק, חלק של יום חופשה לא נספר, ולכן {daysText(outcome.days)}.
        </p>
      ) : null}
      {outcome.shortWorker ? (
        <p className={styles.insight}>
          עובד בשכר שעתי או יומי שעבד פחות מ-{SHORT_WORKER_DAYS} ימים רצופים לא מקבל ימי חופשה אלא תמורת חופשה: 4%
          לפחות מהשכר (סעיפים 4 ו-15 לחוק).
        </p>
      ) : null}
    </div>
  )
}

export default function VacationDaysCalculator() {
  const currentYear = useCurrentYear()
  const [input, setInput] = useState<VacationInput>(() => defaultInput(FALLBACK_YEAR))
  const [yearTouched, setYearTouched] = useState(false)
  const [status, setStatus] = useState('')
  const [announcement, setAnnouncement] = useState('')
  const effectiveInput = useMemo(
    () => (yearTouched ? input : { ...input, calendarYear: String(currentYear) }),
    [input, yearTouched, currentYear],
  )
  const errors = fieldErrors(effectiveInput)
  const outcome = useMemo(() => calculateVacation(effectiveInput), [effectiveInput])
  const spoken = announcementFor(outcome)
  const lastSpoken = useRef(spoken)
  const id = useId()

  useEffect(() => {
    if (spoken === lastSpoken.current) return
    const timer = window.setTimeout(() => {
      lastSpoken.current = spoken
      setAnnouncement(spoken)
    }, ANNOUNCE_DELAY_MS)
    return () => window.clearTimeout(timer)
  }, [spoken])

  const update = (patch: Partial<VacationInput>) => {
    setInput((current) => ({ ...current, ...patch }))
    if (patch.calendarYear !== undefined) setYearTouched(true)
    setStatus('')
  }

  const copy = async () => {
    if (outcome.kind !== 'result') {
      setStatus('מלאו את הפרטים כדי להעתיק את התוצאה.')
      return
    }
    try {
      await navigator.clipboard.writeText(resultToText(outcome))
      setStatus('התוצאה הועתקה')
      window.gtag?.('event', 'vacation_days_copy', { week: outcome.week, seniority_year: outcome.seniorityYear })
    } catch {
      setStatus('ההעתקה נכשלה. סמנו את התוצאה והעתיקו ידנית.')
    }
  }

  const seniorityId = `${id}-seniority`
  const orderId = `${id}-order`
  const orderHintId = `${id}-order-hint`
  const agencyId = `${id}-agency`
  const threshold = outcome.kind === 'result' ? outcome.threshold : null

  return (
    <section className={`${ui.tool} ${styles.calc}`} aria-label="מחשבון ימי חופשה לפי ותק">
      <div className={`${ui.inner} ${styles.layout}`}>
        <form className={ui.form} onSubmit={(event) => event.preventDefault()}>
          <ChoiceGroup
            legend="איך לחשב את הוותק"
            name="vac-mode"
            options={modeOptions}
            value={effectiveInput.mode}
            onChange={(mode) => update({ mode })}
          />

          <fieldset className={ui.group}>
            <legend className={ui.legend}>{effectiveInput.mode === 'dates' ? 'תקופת העבודה' : 'שנת הוותק'}</legend>
            {effectiveInput.mode === 'dates' ? (
              <>
                <div className={styles.row}>
                  <TextField
                    label="תאריך תחילת העבודה"
                    type="date"
                    value={effectiveInput.start}
                    error={errors.start}
                    onChange={(start) => update({ start })}
                  />
                  <TextField
                    label="שנת החופשה"
                    hint="שנה קלנדרית, ינואר עד דצמבר"
                    value={effectiveInput.calendarYear}
                    error={errors.calendarYear}
                    onChange={(calendarYear) => update({ calendarYear: calendarYear.replace(/\D/g, '') })}
                  />
                </div>
                <TextField
                  label="תאריך סיום העבודה"
                  hint="רק אם העבודה הסתיימה או תסתיים בשנה הזאת."
                  type="date"
                  value={effectiveInput.end}
                  error={errors.end}
                  onChange={(end) => update({ end })}
                />
              </>
            ) : (
              <>
                <div className={ui.field}>
                  <label htmlFor={seniorityId} className={ui.label}>
                    שנת הוותק אצל המעסיק
                  </label>
                  <select
                    id={seniorityId}
                    className={`${ui.input} ${styles.select}`}
                    value={effectiveInput.seniority}
                    onChange={(event) => update({ seniority: event.target.value })}
                  >
                    {Array.from({ length: MAX_SENIORITY }, (_, index) => index + 1).map((year) => (
                      <option key={year} value={String(year)}>
                        {year === 1 ? 'השנה הראשונה' : `השנה ה-${year}`}
                      </option>
                    ))}
                  </select>
                </div>
                <ChoiceGroup
                  legend="העבודה בשנה הזאת נמשכה"
                  name="vac-coverage"
                  options={coverageOptions}
                  value={effectiveInput.coverage}
                  onChange={(coverage) => update({ coverage })}
                />
              </>
            )}
          </fieldset>

          <ChoiceGroup
            legend="שבוע העבודה"
            name="vac-week"
            options={weekOptions}
            value={effectiveInput.week}
            onChange={(week) => update({ week })}
          />

          <fieldset className={ui.group}>
            <legend className={ui.legend}>ימי עבודה בפועל</legend>
            <TextField
              label="כמה ימים עבדתם בשנה הזאת"
              hint={
                threshold
                  ? `לא חובה. מתחת ל-${threshold} ימי עבודה הזכאות יחסית.`
                  : `לא חובה. בשנה מלאה הזכאות יחסית מתחת ל-${FULL_YEAR_THRESHOLD} ימי עבודה, ובחלק משנה מתחת ל-${PARTIAL_YEAR_THRESHOLD}.`
              }
              value={effectiveInput.daysWorked}
              error={errors.daysWorked}
              onChange={(daysWorked) => update({ daysWorked: daysWorked.replace(/\D/g, '') })}
            />
          </fieldset>

          <fieldset className={ui.group}>
            <legend className={ui.legend}>מה חל במקום העבודה</legend>
            <label htmlFor={orderId} className={styles.check}>
              <input
                id={orderId}
                type="checkbox"
                className={ui.checkbox}
                checked={effectiveInput.orderApplies}
                aria-describedby={orderHintId}
                onChange={(event) => update({ orderApplies: event.target.checked })}
              />
              <span>צו ההרחבה לקיצור שבוע העבודה</span>
            </label>
            <p id={orderHintId} className={ui.hint}>
              חל על רוב המעסיקים. לא חל במקום עבודה עם פחות מ-4 עובדים, בחברה ממשלתית או עירונית, או כשהסכם קיבוצי
              הסדיר את המעבר לשבוע של 5 ימים.
            </p>
            <label htmlFor={agencyId} className={styles.check}>
              <input
                id={agencyId}
                type="checkbox"
                className={ui.checkbox}
                checked={effectiveInput.agency}
                onChange={(event) => update({ agency: event.target.checked })}
              />
              <span>העובד מועסק דרך קבלן כוח אדם</span>
            </label>
          </fieldset>
        </form>

        <div className={ui.output}>
          <div className={ui.sticky}>
            <h2 className={ui.outputTitle}>התוצאה</h2>
            <ResultCard outcome={outcome} />
            <div className={ui.actions}>
              <button type="button" className={`${ui.primary} ${styles.copyMain}`} onClick={copy}>
                <Copy aria-hidden="true" />
                העתקת התוצאה
              </button>
            </div>
            <p className={ui.status} role="status" aria-live="polite">
              {status}
            </p>
            <p className={styles.srOnly} role="status" aria-live="polite">
              {announcement}
            </p>
            <p className={ui.note}>
              חישוב עזר לפי חוק חופשה שנתית, התשי״א-1951, וצו ההרחבה, כפי שפורסמו באתר משרד העבודה. הסכם קיבוצי, צו
              הרחבה ענפי או חוזה אישי יכולים לתת יותר ימים. החישוב נעשה בדפדפן, והפרטים לא נשלחים לשום מקום.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
