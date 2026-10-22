'use client'

import { useEffect, useId, useMemo, useRef, useState, type ReactNode } from 'react'
import {
  CREDIT_POINT_ANNUAL,
  DEFAULT_CREDIT_POINTS,
  MAX_CREDIT_POINTS,
  MONTHS_IN_YEAR,
  TAX_YEAR,
  WOMAN_EXTRA_POINTS,
  formatBasisPoints,
  formatNumber,
  formatPoints,
  formatShekels,
  parseAmount,
  parsePoints,
  type Gender,
  type Period,
} from '@/lib/self-employed-tax'
import {
  EARLY_RETIREMENT_AGE,
  HISHTALMUT_INCOME_CEILING,
  MANDATORY_MIN_AGE,
  PENSION_INCOME_CEILING,
  calculateDeposits,
  resultToText,
  savingPerHundred,
  type DepositsResult,
} from '@/lib/self-employed-deposits'
import type { ParsedNumber } from '@/lib/vat-calculator'
import ui from './toolUi.module.css'
import styles from './SelfEmployedDeposits.module.css'

const ANNOUNCE_DELAY_MS = 900

const periodOptions: { value: Period; label: string; hint: string }[] = [
  { value: 'year', label: 'לשנה', hint: `הכנסה לכל שנת ${TAX_YEAR}` },
  { value: 'month', label: 'לחודש', hint: 'ממוצע חודשי, נכפיל ב-12' },
]

const genderOptions: { value: Gender; label: string; hint: string }[] = [
  { value: 'man', label: 'גבר', hint: `${formatPoints(DEFAULT_CREDIT_POINTS.man)} נקודות` },
  { value: 'woman', label: 'אישה', hint: `${formatPoints(DEFAULT_CREDIT_POINTS.woman)} נקודות` },
]

const amountError = (parsed: ParsedNumber) => {
  if (parsed.ok || parsed.reason === 'empty') return ''
  if (parsed.reason === 'too-large') return 'הסכום גדול מדי.'
  return 'אפשר להקליד רק ספרות, ונקודה או פסיק לאגורות.'
}

const pointsError = (parsed: ParsedNumber) => {
  if (parsed.ok) return ''
  if (parsed.reason === 'empty') return 'הקלידו מספר נקודות, למשל 2.25.'
  return `הקלידו מספר בין 0 ל-${MAX_CREDIT_POINTS}.`
}

const pointsText = (hundredths: number) => formatPoints(hundredths).replace(/,/g, '')

const optionalAgorot = (parsed: ParsedNumber, raw: string) => {
  if (parsed.ok) return parsed.hundredths
  return raw.trim() ? null : 0
}

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
              <span className={styles.choiceHint}>{option.hint}</span>
            </span>
          </label>
        ))}
      </div>
    </fieldset>
  )
}

function NumberField({
  label,
  hint,
  value,
  error,
  suffix,
  onChange,
}: {
  label: string
  hint?: string
  value: string
  error: string
  suffix?: string
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
      <div className={styles.affix}>
        <input
          id={id}
          className={`${ui.input} ${ui.ltr} ${styles.number}${suffix ? ` ${styles.withSuffix}` : ''}`}
          inputMode="decimal"
          autoComplete="off"
          spellCheck={false}
          enterKeyHint="done"
          maxLength={24}
          value={value}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy || undefined}
          onChange={(event) => onChange(event.target.value)}
        />
        {suffix ? (
          <span className={styles.suffix} aria-hidden="true">
            {suffix}
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

type AmountRow = { key: string; term: ReactNode; value: string; total?: boolean }

function AmountTable({ label, rows }: { label: string; rows: AmountRow[] }) {
  return (
    <div className={styles.tableWrap} role="region" aria-label={label} tabIndex={0}>
      <table className={styles.table}>
        <tbody>
          {rows.map((row) => (
            <tr key={row.key} className={row.total ? styles.totalRow : undefined}>
              <th scope="row">{row.term}</th>
              <td>{row.value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function HishtalmutBlock({ result }: { result: DepositsResult }) {
  const { hishtalmut } = result
  const perHundred = savingPerHundred(hishtalmut.saving, hishtalmut.deductible)

  return (
    <div className={styles.block}>
      <h3 className={styles.blockTitle}>קרן השתלמות לעצמאים</h3>
      <p className={styles.blockText}>
        מותר בניכוי 4.5% מההכנסה, עד הכנסה של {formatShekels(HISHTALMUT_INCOME_CEILING)} בשנה. ההפקדה מורידה את
        ההכנסה החייבת, ולכן החיסכון הוא לפי מדרגת המס שלכם.
      </p>
      <AmountTable
        label="קרן השתלמות לעצמאים"
        rows={[
          { key: 'income', term: 'הכנסה קובעת', value: formatShekels(hishtalmut.qualifyingIncome) },
          { key: 'deductible', term: 'הפקדה שמוכרת בניכוי, 4.5%', value: formatShekels(hishtalmut.deductible) },
          { key: 'deposited', term: 'כבר הפקדתם', value: formatShekels(hishtalmut.deposited) },
          {
            key: 'remaining',
            term: 'נשאר להפקיד עד 31.12 לניכוי המלא',
            value: formatShekels(hishtalmut.remainingDeductible),
            total: true,
          },
          {
            key: 'beneficial',
            term: 'הפקדה מוטבת, פטורה ממס רווחי הון',
            value: `עד ${formatShekels(hishtalmut.beneficialDeposit)}`,
          },
          {
            key: 'remainingBeneficial',
            term: 'נשאר עד ההפקדה המוטבת',
            value: formatShekels(hishtalmut.remainingBeneficial),
          },
          { key: 'saving', term: 'חיסכון משוער במס הכנסה על הניכוי המלא', value: formatShekels(hishtalmut.saving) },
          { key: 'perHundred', term: 'חיסכון על כל 100 ₪ בניכוי', value: formatShekels(perHundred) },
        ]}
      />
      <p className={styles.blockNote}>
        בפקודה ההפקדה המוטבת היא סכום קבוע לשנה. חברות מנהלות מציגות אותה גם כ-7% מההכנסה ועד התקרה, ואצלכם זה{' '}
        {formatShekels(hishtalmut.fundShare)}. לפני הפקדה גדולה בדקו עם הקרן כמה היא מקבלת.
      </p>
      {hishtalmut.aboveBeneficial > 0 ? (
        <p className={styles.blockNote}>
          הפקדתם {formatShekels(hishtalmut.aboveBeneficial)} מעל ההפקדה המוטבת. הרווחים על החלק הזה חייבים במס
          כשמושכים אותם.
        </p>
      ) : null}
      <p className={styles.blockNote}>
        החיסכון הוא במס הכנסה בלבד. סעיף 345 לחוק הביטוח הלאומי לא מונה את ההפקדה לקרן השתלמות בין הסכומים
        שמופחתים מההכנסה לדמי ביטוח.
      </p>
    </div>
  )
}

function PensionBlock({ result }: { result: DepositsResult }) {
  const { pension, mandatory } = result
  const perHundred = savingPerHundred(pension.saving, pension.fullDeposit)

  return (
    <div className={styles.block}>
      <h3 className={styles.blockTitle}>פנסיה: חובה והטבת מס</h3>
      <p className={styles.blockText}>
        החוק מחייב עצמאי להפקיד לקופת גמל לקצבה. הטבת המס המלאה ניתנת על 16.5% מההכנסה, עד הכנסה של{' '}
        {formatShekels(PENSION_INCOME_CEILING)}: 11% בניכוי מההכנסה ו-5.5% בזיכוי של 35% מהמס.
      </p>
      <AmountTable
        label="פנסיה לעצמאי"
        rows={[
          {
            key: 'lower',
            term: `חובה: 4.45% על ${formatNumber(mandatory.lowerIncome)}`,
            value: formatShekels(mandatory.lowerDeposit),
          },
          {
            key: 'upper',
            term: `חובה: 12.55% על ${formatNumber(mandatory.upperIncome)}`,
            value: formatShekels(mandatory.upperDeposit),
          },
          { key: 'mandatory', term: 'הפקדת חובה לפי החוק', value: formatShekels(mandatory.total) },
          {
            key: 'full',
            term: `הפקדה להטבת מס מלאה, 16.5% מ-${formatNumber(pension.qualifyingIncome)}`,
            value: formatShekels(pension.fullDeposit),
          },
          { key: 'deduction', term: 'מתוכה בניכוי, 11%', value: formatShekels(pension.deduction) },
          {
            key: 'credit',
            term: `מתוכה בזיכוי, 5.5%: ${formatShekels(pension.creditBase)} × 35%`,
            value: formatShekels(pension.credit),
          },
          { key: 'deposited', term: 'כבר הפקדתם', value: formatShekels(pension.deposited) },
          {
            key: 'remainingMandatory',
            term: 'נשאר להפקיד עד 31.12 לחובה',
            value: formatShekels(mandatory.remaining),
          },
          {
            key: 'remaining',
            term: 'נשאר להפקיד עד 31.12 להטבה המלאה',
            value: formatShekels(pension.remaining),
            total: true,
          },
          { key: 'saving', term: 'חיסכון משוער במס הכנסה על ההפקדה המלאה', value: formatShekels(pension.saving) },
          { key: 'perHundred', term: 'חיסכון על כל 100 ₪ שמפקידים', value: formatShekels(perHundred) },
        ]}
      />
      <p className={styles.blockNote}>
        מי שמנכה ביטוח אובדן כושר עבודה כהוצאה מקבל זיכוי על 5% ולא על 5.5%, וההפקדה להטבה המלאה היא 16% מההכנסה.
      </p>
      <p className={styles.blockNote}>
        לפי סעיף 345 לחוק הביטוח הלאומי חלק מההפקדה לפנסיה מופחת גם מההכנסה לדמי ביטוח. המחשבון לא מחשב את זה,
        ולכן החיסכון בפועל יכול להיות מעט גבוה יותר.
      </p>
      <p className={styles.blockNote}>
        חובת ההפקדה לא חלה על מי שטרם מלאו לו {MANDATORY_MIN_AGE}, על מי שהגיע לגיל {EARLY_RETIREMENT_AGE}, ובחצי
        השנה הראשונה מהרישום כעוסק.
      </p>
    </div>
  )
}

function Checklist({ result }: { result: DepositsResult }) {
  const { hishtalmut, mandatory, pension } = result
  const items = [
    hishtalmut.remainingDeductible > 0
      ? `להעביר לקרן ההשתלמות לעצמאים עוד ${formatShekels(hishtalmut.remainingDeductible)}, כדי שכל ה-4.5% יותרו בניכוי.`
      : 'ההפקדה לקרן ההשתלמות כבר מגיעה לסכום שמוכר בניכוי.',
    mandatory.remaining > 0
      ? `להשלים את הפקדת החובה לקופת גמל לקצבה: עוד ${formatShekels(mandatory.remaining)}. החוק דורש להפקיד עד תום שנת המס.`
      : 'הפקדת החובה לפנסיה כבר הושלמה לפי ההכנסה שהקלדתם.',
    pension.remaining > mandatory.remaining
      ? `כדי לנצל את כל הטבת המס על פנסיה, להפקיד בסך הכול עוד ${formatShekels(pension.remaining)}.`
      : 'ההפקדה לפנסיה כבר מנצלת את מלוא הטבת המס.',
    'לבדוק עם הקרן עד איזה תאריך הפקדה נרשמת ל-2026, ולהעביר את הכסף כמה ימים לפני 31 בדצמבר. הטבות המס ניתנות לפי השנה שבה שולם הכסף.',
    'לשמור את אישור המס השנתי שהקרן שולחת על ההפקדות, ולהגיש אותו עם הדוח השנתי או להעביר לרואה החשבון.',
  ]

  return (
    <div className={`${styles.block} ${styles.wide}`}>
      <h3 className={styles.blockTitle}>מה לעשות עד 31 בדצמבר {TAX_YEAR}</h3>
      <ol className={styles.checklist}>
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ol>
    </div>
  )
}

export default function SelfEmployedDeposits() {
  const [period, setPeriod] = useState<Period>('year')
  const [income, setIncome] = useState('')
  const [hishtalmutDeposited, setHishtalmutDeposited] = useState('')
  const [pensionDeposited, setPensionDeposited] = useState('')
  const [gender, setGender] = useState<Gender>('man')
  const [points, setPoints] = useState(pointsText(DEFAULT_CREDIT_POINTS.man))
  const [status, setStatus] = useState('')
  const [announcement, setAnnouncement] = useState('')
  const lastSpoken = useRef('')

  const parsedIncome = parseAmount(income)
  const parsedHishtalmut = parseAmount(hishtalmutDeposited)
  const parsedPension = parseAmount(pensionDeposited)
  const parsedPoints = parsePoints(points)

  const incomeAgorot = parsedIncome.ok
    ? parsedIncome.hundredths * (period === 'month' ? MONTHS_IN_YEAR : 1)
    : null
  const hishtalmutAgorot = optionalAgorot(parsedHishtalmut, hishtalmutDeposited)
  const pensionAgorot = optionalAgorot(parsedPension, pensionDeposited)
  const pointsHundredths = parsedPoints.ok ? parsedPoints.hundredths : null

  const result = useMemo(() => {
    if (incomeAgorot === null || hishtalmutAgorot === null || pensionAgorot === null || pointsHundredths === null) {
      return null
    }
    return calculateDeposits({
      incomeAgorot,
      creditPointsHundredths: pointsHundredths,
      hishtalmutDepositedAgorot: hishtalmutAgorot,
      pensionDepositedAgorot: pensionAgorot,
    })
  }, [incomeAgorot, hishtalmutAgorot, pensionAgorot, pointsHundredths])

  const spoken = result
    ? `חיסכון משוער במס הכנסה ${formatShekels(result.totalSaving)}. לקרן השתלמות נשאר להפקיד ${formatShekels(
        result.hishtalmut.remainingDeductible,
      )}. לפנסיה נשאר להפקיד ${formatShekels(result.pension.remaining)}.`
    : ''

  useEffect(() => {
    if (spoken === lastSpoken.current) return
    const timer = window.setTimeout(() => {
      lastSpoken.current = spoken
      setAnnouncement(spoken)
    }, ANNOUNCE_DELAY_MS)
    return () => window.clearTimeout(timer)
  }, [spoken])

  const changeGender = (next: Gender) => {
    if (next === gender) return
    setGender(next)
    const parsed = parsePoints(points)
    if (!parsed.ok) {
      setPoints(pointsText(DEFAULT_CREDIT_POINTS[next]))
      return
    }
    const shift = next === 'woman' ? WOMAN_EXTRA_POINTS : -WOMAN_EXTRA_POINTS
    setPoints(pointsText(Math.max(0, parsed.hundredths + shift)))
  }

  const changePeriod = (next: Period) => {
    setPeriod(next)
    setStatus('')
  }

  const copy = async () => {
    if (!result) {
      setStatus('הקלידו הכנסה כדי להעתיק את התוצאה.')
      return
    }
    try {
      await navigator.clipboard.writeText(resultToText(result))
      setStatus('התוצאה הועתקה')
      window.gtag?.('event', 'deposits_calc_copy', { period, gender })
    } catch {
      setStatus('ההעתקה נכשלה. סמנו את התוצאה והעתיקו ידנית.')
    }
  }

  const summary = result
    ? [
        {
          key: 'hishtalmut',
          term: 'להפקיד לקרן השתלמות עד 31.12',
          value: result.hishtalmut.remainingDeductible,
          note: `מתוך ${formatShekels(result.hishtalmut.deductible)} שמוכרים בניכוי`,
        },
        {
          key: 'pension',
          term: 'להפקיד לפנסיה עד 31.12',
          value: result.pension.remaining,
          note: `מתוכם חובה לפי החוק: ${formatShekels(result.mandatory.remaining)}`,
        },
      ]
    : []

  return (
    <section className={ui.tool} aria-label="מחשבון קרן השתלמות ופנסיה לעצמאי">
      <div className={ui.inner}>
        <form className={ui.form} onSubmit={(event) => event.preventDefault()}>
          <ChoiceGroup
            legend="ההכנסה שאקליד היא"
            name="deposits-period"
            options={periodOptions}
            value={period}
            onChange={changePeriod}
          />

          <fieldset className={ui.group}>
            <legend className={ui.legend}>ההכנסה מהעסק ב-{TAX_YEAR}</legend>
            <NumberField
              label={period === 'year' ? 'הכנסה חייבת לשנה' : 'הכנסה חייבת לחודש'}
              hint="הכנסות פחות הוצאות מוכרות, לפני ההפקדות לפנסיה ולקרן השתלמות. עוסק מורשה: בלי מע״מ."
              value={income}
              error={amountError(parsedIncome)}
              suffix="₪"
              onChange={setIncome}
            />
          </fieldset>

          <fieldset className={ui.group}>
            <legend className={ui.legend}>מה כבר הפקדתם ב-{TAX_YEAR}</legend>
            <NumberField
              label="לקרן השתלמות"
              hint="סך ההפקדות מינואר. אם לא הפקדתם, השאירו ריק."
              value={hishtalmutDeposited}
              error={amountError(parsedHishtalmut)}
              suffix="₪"
              onChange={setHishtalmutDeposited}
            />
            <NumberField
              label="לפנסיה או לקופת גמל לקצבה"
              value={pensionDeposited}
              error={amountError(parsedPension)}
              suffix="₪"
              onChange={setPensionDeposited}
            />
          </fieldset>

          <fieldset className={ui.group}>
            <legend className={ui.legend}>נקודות זיכוי</legend>
            <ChoiceGroup
              legend="תושב או תושבת ישראל"
              name="deposits-gender"
              options={genderOptions}
              value={gender}
              onChange={changeGender}
            />
            <NumberField
              label="סך נקודות הזיכוי"
              hint={`נקודה שווה ${formatShekels(CREDIT_POINT_ANNUAL)} לשנה. הנקודות קובעות כמה מס נשאר לחסוך.`}
              value={points}
              error={pointsError(parsedPoints)}
              onChange={setPoints}
            />
          </fieldset>
        </form>

        <div className={ui.output}>
          <div className={ui.sticky}>
            <h2 className={ui.outputTitle}>התוצאה</h2>
            {result ? (
              <>
                <dl className={styles.results}>
                  <div className={`${styles.row} ${styles.main}`}>
                    <dt className={styles.term}>חיסכון משוער במס הכנסה ב-{TAX_YEAR}</dt>
                    <dd className={styles.value}>
                      {formatShekels(result.totalSaving)}
                      <span className={styles.share}>
                        בהפקדה מלאה לשתיהן, במדרגת מס שולית של {formatBasisPoints(result.marginalRateBasisPoints)}
                      </span>
                    </dd>
                  </div>
                  {summary.map((row) => (
                    <div key={row.key} className={styles.row}>
                      <dt className={styles.term}>{row.term}</dt>
                      <dd className={styles.value}>
                        {formatShekels(row.value)}
                        <span className={styles.share}>{row.note}</span>
                      </dd>
                    </div>
                  ))}
                </dl>
                {result.income > 0 && result.taxBefore === 0 ? (
                  <p className={styles.notice}>
                    נקודות הזיכוי מכסות את כל מס ההכנסה, ולכן ההפקדות לא יחסכו מס השנה. הפקדת החובה לפנסיה עדיין
                    נדרשת.
                  </p>
                ) : null}
              </>
            ) : (
              <p className={styles.empty}>
                הקלידו את ההכנסה החייבת מהעסק כדי לראות כמה להפקיד עד סוף השנה וכמה מס תחסכו.
              </p>
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
              הערכה לפי התקרות של {TAX_YEAR}, לעצמאי שהעסק הוא מקור ההכנסה היחיד שלו. לא ייעוץ מס או ייעוץ פנסיוני.
              החישוב נעשה בדפדפן, והסכומים לא נשלחים לשום מקום.
            </p>
          </div>
        </div>
      </div>

      {result && result.income > 0 ? (
        <div className={styles.details}>
          <h2 className={styles.detailsTitle}>פירוט החישוב</h2>
          <div className={styles.detailsGrid}>
            <HishtalmutBlock result={result} />
            <PensionBlock result={result} />
            <Checklist result={result} />
          </div>
        </div>
      ) : null}
    </section>
  )
}
