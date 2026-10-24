'use client'

import { useEffect, useId, useMemo, useRef, useState, type ReactNode } from 'react'
import {
  CHILD_BANDS,
  CHILD_POINTS_TWELFTHS,
  MAX_CHILDREN_PER_BAND,
  OLEH_FIRST_ALIYAH_YEAR,
  POINT_VALUE_ANNUAL,
  TAX_YEAR,
  calculateCredits,
  childBandLabel,
  formatPoints,
  formatShekels,
  parseCount,
  resultToText,
  type ChildBand,
  type DegreeKind,
  type Gender,
} from '@/lib/tax-credit-points'
import ui from './toolUi.module.css'
import styles from './TaxCreditPointsCalculator.module.css'

const ANNOUNCE_DELAY_MS = 900

const MONTH_NAMES = ['ינואר', 'פברואר', 'מרץ', 'אפריל', 'מאי', 'יוני', 'יולי', 'אוגוסט', 'ספטמבר', 'אוקטובר', 'נובמבר', 'דצמבר']

const genderOptions: { value: Gender; label: string; hint: string }[] = [
  { value: 'man', label: 'גבר', hint: '2.25 נקודות' },
  { value: 'woman', label: 'אישה', hint: '2.75 נקודות' },
]

const degreeOptions: { value: DegreeKind; label: string; hint: string }[] = [
  { value: 'none', label: 'אין', hint: 'בלי נקודות לתואר' },
  { value: 'first', label: 'תואר ראשון', hint: 'נקודה אחת' },
  { value: 'second', label: 'תואר שני', hint: 'חצי נקודה' },
]

const serviceOptions: { value: 'full' | 'short'; label: string; hint: string }[] = [
  { value: 'full', label: 'שירות מלא', hint: 'לפחות 23 חודשים (22 לחיילת)' },
  { value: 'short', label: 'שירות קצר', hint: 'פחות מזה' },
]

const years = (from: number, to: number) => Array.from({ length: to - from + 1 }, (_, index) => to - index)

function ChoiceGroup<T extends string>({
  legend,
  name,
  options,
  value,
  onChange,
}: {
  legend: string
  name: string
  options: { value: T; label: string; hint: string }[]
  value: T
  onChange: (value: T) => void
}) {
  return (
    <fieldset className={ui.group}>
      <legend className={ui.legend}>{legend}</legend>
      <div className={options.length === 3 ? `${styles.choices} ${styles.choicesThree}` : styles.choices}>
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
              <span className={styles.choiceHint}>{option.hint}</span>
            </span>
          </label>
        ))}
      </div>
    </fieldset>
  )
}

function CountField({
  label,
  hint,
  value,
  error,
  onChange,
}: {
  label: string
  hint: string
  value: string
  error: string
  onChange: (value: string) => void
}) {
  const id = useId()
  const hintId = `${id}-hint`
  const errorId = `${id}-error`

  return (
    <div className={ui.field}>
      <label htmlFor={id} className={ui.label}>
        {label}
      </label>
      <p id={hintId} className={ui.hint}>
        {hint}
      </p>
      <input
        id={id}
        className={`${ui.input} ${ui.ltr} ${styles.number}`}
        inputMode="numeric"
        autoComplete="off"
        spellCheck={false}
        enterKeyHint="done"
        maxLength={2}
        value={value}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${hintId} ${errorId}` : hintId}
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

function MonthYearSelect({
  legend,
  month,
  year,
  yearOptions,
  onMonth,
  onYear,
}: {
  legend: string
  month: number
  year: number
  yearOptions: number[]
  onMonth: (month: number) => void
  onYear: (year: number) => void
}) {
  const id = useId()

  return (
    <div className={styles.dateRow} role="group" aria-label={legend}>
      <div className={ui.field}>
        <label htmlFor={`${id}-month`} className={ui.label}>
          חודש
        </label>
        <select
          id={`${id}-month`}
          className={`${ui.input} ${styles.select}`}
          value={month}
          onChange={(event) => onMonth(Number(event.target.value))}
        >
          {MONTH_NAMES.map((name, index) => (
            <option key={name} value={index + 1}>
              {name}
            </option>
          ))}
        </select>
      </div>
      <div className={ui.field}>
        <label htmlFor={`${id}-year`} className={ui.label}>
          שנה
        </label>
        <select
          id={`${id}-year`}
          className={`${ui.input} ${styles.select}`}
          value={year}
          onChange={(event) => onYear(Number(event.target.value))}
        >
          {yearOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>
    </div>
  )
}

function Toggle({
  checked,
  onChange,
  children,
}: {
  checked: boolean
  onChange: (checked: boolean) => void
  children: ReactNode
}) {
  return (
    <label className={styles.toggle}>
      <input type="checkbox" className={ui.checkbox} checked={checked} onChange={(event) => onChange(event.target.checked)} />
      <span className={styles.choiceLabel}>{children}</span>
    </label>
  )
}

const emptyCounts = Object.fromEntries(CHILD_BANDS.map((band) => [band, ''])) as Record<ChildBand, string>

export default function TaxCreditPointsCalculator() {
  const [gender, setGender] = useState<Gender>('man')
  const [counts, setCounts] = useState<Record<ChildBand, string>>(emptyCounts)
  const [degree, setDegree] = useState<DegreeKind>('none')
  const [olehOn, setOlehOn] = useState(false)
  const [olehMonth, setOlehMonth] = useState(1)
  const [olehYear, setOlehYear] = useState(TAX_YEAR)
  const [soldierOn, setSoldierOn] = useState(false)
  const [soldierMonth, setSoldierMonth] = useState(1)
  const [soldierYear, setSoldierYear] = useState(TAX_YEAR - 1)
  const [service, setService] = useState<'full' | 'short'>('full')
  const [status, setStatus] = useState('')
  const [announcement, setAnnouncement] = useState('')
  const lastSpoken = useRef('')

  const parsedCounts = CHILD_BANDS.map((band) => ({ band, parsed: parseCount(counts[band]) }))
  const countErrors = Object.fromEntries(
    parsedCounts.map(({ band, parsed }) => [
      band,
      parsed.ok ? '' : `הקלידו מספר בין 0 ל-${MAX_CHILDREN_PER_BAND}.`,
    ]),
  ) as Record<ChildBand, string>
  const hasCountError = parsedCounts.some(({ parsed }) => !parsed.ok)

  const result = useMemo(() => {
    if (hasCountError) return null
    const children = Object.fromEntries(
      CHILD_BANDS.map((band) => {
        const parsed = parseCount(counts[band])
        return [band, parsed.ok ? parsed.hundredths / 100 : 0]
      }),
    ) as Record<ChildBand, number>
    return calculateCredits({
      gender,
      children,
      degree,
      oleh: olehOn ? { month: olehMonth, year: olehYear } : null,
      soldier: soldierOn
        ? { discharge: { month: soldierMonth, year: soldierYear }, fullService: service === 'full' }
        : null,
    })
  }, [gender, counts, hasCountError, degree, olehOn, olehMonth, olehYear, soldierOn, soldierMonth, soldierYear, service])

  const spoken = result
    ? `${formatPoints(result.twelfths)} נקודות זיכוי, ${formatShekels(result.monthly)} לחודש.`
    : ''

  useEffect(() => {
    if (spoken === lastSpoken.current) return
    const timer = window.setTimeout(() => {
      lastSpoken.current = spoken
      setAnnouncement(spoken)
    }, ANNOUNCE_DELAY_MS)
    return () => window.clearTimeout(timer)
  }, [spoken])

  const setCount = (band: ChildBand, next: string) => {
    setCounts((current) => ({ ...current, [band]: next }))
    setStatus('')
  }

  const copy = async () => {
    if (!result) {
      setStatus('תקנו את מספר הילדים כדי להעתיק את התוצאה.')
      return
    }
    try {
      await navigator.clipboard.writeText(resultToText(result))
      setStatus('התוצאה הועתקה')
      window.gtag?.('event', 'tax_credit_points_copy', { gender })
    } catch {
      setStatus('ההעתקה נכשלה. סמנו את התוצאה והעתיקו ידנית.')
    }
  }

  return (
    <section className={ui.tool} aria-label="מחשבון נקודות זיכוי במס הכנסה">
      <div className={ui.inner}>
        <form className={ui.form} onSubmit={(event) => event.preventDefault()}>
          <ChoiceGroup legend="תושב או תושבת ישראל" name="credit-gender" options={genderOptions} value={gender} onChange={setGender} />

          <fieldset className={ui.group}>
            <legend className={ui.legend}>ילדים לפי שנת לידה</legend>
            {CHILD_BANDS.map((band) => (
              <CountField
                key={band}
                label={childBandLabel(band)}
                hint={
                  CHILD_POINTS_TWELFTHS[gender][band] > 0
                    ? `${formatPoints(CHILD_POINTS_TWELFTHS[gender][band])} נקודות לכל ילד`
                    : 'אין נקודות לאב בגיל הזה'
                }
                value={counts[band]}
                error={countErrors[band]}
                onChange={(next) => setCount(band, next)}
              />
            ))}
          </fieldset>

          <ChoiceGroup legend="תואר אקדמי" name="credit-degree" options={degreeOptions} value={degree} onChange={setDegree} />

          <fieldset className={ui.group}>
            <legend className={ui.legend}>עולה חדש</legend>
            <Toggle checked={olehOn} onChange={setOlehOn}>
              עליתי לישראל בשנים {OLEH_FIRST_ALIYAH_YEAR} עד {TAX_YEAR}
            </Toggle>
            {olehOn ? (
              <MonthYearSelect
                legend="מועד העלייה"
                month={olehMonth}
                year={olehYear}
                yearOptions={years(OLEH_FIRST_ALIYAH_YEAR, TAX_YEAR)}
                onMonth={setOlehMonth}
                onYear={setOlehYear}
              />
            ) : null}
          </fieldset>

          <fieldset className={ui.group}>
            <legend className={ui.legend}>חייל משוחרר</legend>
            <Toggle checked={soldierOn} onChange={setSoldierOn}>
              השתחררתי משירות סדיר בשלוש השנים האחרונות
            </Toggle>
            {soldierOn ? (
              <>
                <MonthYearSelect
                  legend="מועד השחרור"
                  month={soldierMonth}
                  year={soldierYear}
                  yearOptions={years(TAX_YEAR - 3, TAX_YEAR)}
                  onMonth={setSoldierMonth}
                  onYear={setSoldierYear}
                />
                <ChoiceGroup legend="אורך השירות" name="credit-service" options={serviceOptions} value={service} onChange={setService} />
              </>
            ) : null}
          </fieldset>
        </form>

        <div className={ui.output}>
          <div className={ui.sticky}>
            <h2 className={ui.outputTitle}>התוצאה</h2>
            {result ? (
              <>
                <dl className={styles.results}>
                  <div className={`${styles.row} ${styles.main}`}>
                    <dt className={styles.term}>סך נקודות הזיכוי ב-{TAX_YEAR}</dt>
                    <dd className={styles.value}>{formatPoints(result.twelfths)}</dd>
                  </div>
                  <div className={styles.row}>
                    <dt className={styles.term}>שווי לשנה</dt>
                    <dd className={styles.value}>{formatShekels(result.yearly)}</dd>
                  </div>
                  <div className={styles.row}>
                    <dt className={styles.term}>שווי לחודש</dt>
                    <dd className={styles.value}>{formatShekels(result.monthly)}</dd>
                  </div>
                </dl>

                <div className={styles.advance}>
                  <h3 className={styles.advanceTitle}>מאיפה הנקודות</h3>
                  <dl className={styles.advanceList}>
                    {result.lines.map((line) => (
                      <div key={line.key} className={styles.advanceRow}>
                        <dt>{line.label}</dt>
                        <dd>{formatPoints(line.twelfths)}</dd>
                      </div>
                    ))}
                  </dl>
                  <p className={styles.advanceNote}>
                    נקודה שווה {formatShekels(POINT_VALUE_ANNUAL)} לשנה. הנקודות מקטינות את המס עצמו, ונקודות שלא
                    נוצלו לא מוחזרות.
                  </p>
                </div>
              </>
            ) : (
              <p className={styles.empty}>תקנו את מספר הילדים כדי לראות את הסכום.</p>
            )}

            <div className={ui.actions}>
              <button type="button" className={ui.primary} onClick={copy}>
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
              הערכה לשנת המס {TAX_YEAR} לתושב ישראל שהכנסתו מיגיעה אישית. לא כוללת הורה יחיד, הורים גרושים, ילד עם
              מוגבלות, בן זוג, תעודת מקצוע ועוד. לא ייעוץ מס. החישוב נעשה בדפדפן, בלי לשלוח נתונים.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
