'use client'

import { useId, useState, type FormEvent } from 'react'
import { calculateSalary, DEFAULT_CREDIT_POINTS, formatShekels } from '@/lib/net-salary'
import { calculateTax } from '@/lib/self-employed-tax'
import { THRESHOLD } from '@/lib/exempt-dealer'
import { TileGroup } from './FunTiles'
import { Metric, NumberField, Rows, Shell, useNumber } from './BodyCalculators'
import ui from './toolUi.module.css'
import fun from './FunTool.module.css'

const MICRO_EXPENSE_SHARE = 0.3
const REGULAR_CAPITAL_RATE = 25
const SUBSTANTIAL_CAPITAL_RATE = 30
const YES_NO = [
  { id: 'no', label: 'לא' },
  { id: 'yes', label: 'כן' },
] as const
type YesNo = (typeof YES_NO)[number]['id']

const yearlyTax = (revenue: number, expenses: number) =>
  calculateTax({
    revenueAgorot: revenue * 100,
    expensesAgorot: expenses * 100,
    creditPointsHundredths: DEFAULT_CREDIT_POINTS.man,
    months: 12,
  })

export function MicroBusinessCalculator() {
  const turnover = useNumber(1, 5000000)
  const expenses = useNumber(0, 5000000)
  const micro = turnover.value === null ? null : yearlyTax(turnover.value, turnover.value * MICRO_EXPENSE_SHARE)
  const regular = turnover.value === null ? null : yearlyTax(turnover.value, expenses.value ?? 0)
  const eligible = turnover.value !== null && turnover.value <= THRESHOLD
  const saving = micro && regular ? regular.total - micro.total : 0

  return (
    <Shell
      name="מחשבון עוסק זעיר"
      prompt="הקלידו מחזור שנתי כדי לחשב."
      note="הערכה ל-2026 עם 2.25 נקודות זיכוי, בלי הפקדות לפנסיה. לפני שינוי מסלול התייעצו עם רואה חשבון."
      inputs={
        <>
          <NumberField label="מחזור שנתי (₪)" field={turnover} />
          <NumberField label="הוצאות מוכרות בפועל (₪)" field={expenses} />
        </>
      }
    >
      {micro && regular ? (
        <>
          <Metric
            label={saving >= 0 ? 'חיסכון במסלול זעיר' : 'יתרון לדיווח רגיל'}
            value={formatShekels(Math.abs(saving))}
            unit="בשנה"
          />
          <Rows
            label="השוואת מסלולים"
            rows={[
              ['מס וביטוח לאומי, עסק זעיר (30% הוצאות)', formatShekels(micro.total)],
              ['מס וביטוח לאומי, דיווח רגיל', formatShekels(regular.total)],
              ['נשאר ביד, עסק זעיר', formatShekels(micro.net)],
            ]}
          />
          {eligible ? null : (
            <p className={fun.panel}>המחזור מעל התקרה של {formatShekels(THRESHOLD)}, ולכן מסלול עסק זעיר לא זמין.</p>
          )}
        </>
      ) : null}
    </Shell>
  )
}

export function EmployerCostCalculator() {
  const hishtalmutName = useId()
  const [hishtalmut, setHishtalmut] = useState<YesNo>('no')
  const gross = useNumber(1000, 200000)
  const result =
    gross.value === null
      ? null
      : calculateSalary({
          gross: gross.value,
          creditPointsHundredths: DEFAULT_CREDIT_POINTS.man,
          hishtalmut: hishtalmut === 'yes',
          severance: 'partial',
        })

  return (
    <Shell
      name="מחשבון עלות מעסיק"
      prompt="הקלידו שכר ברוטו כדי לחשב."
      note="הערכה ל-2026 לפי הפרשות חובה מקובלות. לא כולל נסיעות, הבראה, ביגוד או הטבות, ולכן העלות בפועל גבוהה יותר."
      inputs={
        <>
          <NumberField label="שכר ברוטו לחודש (₪)" field={gross} />
          <TileGroup
            legend="קרן השתלמות"
            name={hishtalmutName}
            options={[...YES_NO]}
            value={hishtalmut}
            onChange={setHishtalmut}
            columns="two"
          />
        </>
      }
    >
      {result ? (
        <>
          <Metric
            label="עלות חודשית למעסיק"
            value={formatShekels(result.employer.cost)}
            unit="בחודש"
            meta={`בשנה: ${formatShekels(result.employer.cost * 12)}. העובד מקבל נטו כ-${formatShekels(result.net)}.`}
          />
          <Rows
            label="פירוט עלות"
            rows={[
              ['ביטוח לאומי', formatShekels(result.employer.btl)],
              ['פנסיה', formatShekels(result.employer.pension)],
              ['פיצויים', formatShekels(result.employer.severance)],
              ['קרן השתלמות', formatShekels(result.employer.hishtalmut)],
            ]}
          />
        </>
      ) : null}
    </Shell>
  )
}

export function CapitalGainsCalculator() {
  const substantialName = useId()
  const [substantial, setSubstantial] = useState<YesNo>('no')
  const bought = useNumber(1, 100000000)
  const sold = useNumber(0, 100000000)
  const inflation = useNumber(0, 200)
  const ready = bought.value !== null && sold.value !== null
  const buy = bought.value ?? 0
  const sale = sold.value ?? 0
  const realGain = sale - buy * (1 + (inflation.value ?? 0) / 100)
  const rate = substantial === 'yes' ? SUBSTANTIAL_CAPITAL_RATE : REGULAR_CAPITAL_RATE
  const tax = Math.max(0, realGain) * (rate / 100)

  return (
    <Shell
      name="מחשבון מס רווח הון על מניות"
      prompt="הקלידו מחיר קנייה ומכירה כדי לחשב."
      note="הערכה בלבד. לא כולל עמלות, קיזוז הפסדים או מס יסף. החבות בפועל נקבעת מול הבנק או רואה החשבון."
      inputs={
        <>
          <NumberField label="סכום קנייה (₪)" field={bought} />
          <NumberField label="סכום מכירה (₪)" field={sold} />
          <NumberField label="עליית המדד בתקופה (%)" field={inflation} />
          <TileGroup
            legend="בעל מניות מהותי (10% ומעלה)"
            name={substantialName}
            options={[...YES_NO]}
            value={substantial}
            onChange={setSubstantial}
            columns="two"
          />
        </>
      }
    >
      {ready ? (
        <>
          <Metric label={`מס משוער (${rate}%)`} value={formatShekels(tax)} unit="" />
          <Rows
            label="פירוט"
            rows={[
              ['רווח ריאלי', formatShekels(realGain)],
              ['נשאר אחרי מס', formatShekels(sale - tax)],
            ]}
          />
        </>
      ) : null}
    </Shell>
  )
}

const validDealerNumber = (digits: string) =>
  [...digits.padStart(9, '0')].reduce((sum, digit, index) => {
    const doubled = Number(digit) * (index % 2 ? 2 : 1)
    return sum + (doubled > 9 ? doubled - 9 : doubled)
  }, 0) %
    10 ===
  0

export function DealerNumberCheck() {
  const id = useId()
  const [text, setText] = useState('')
  const digits = text.replace(/\D/g, '')
  const complete = digits.length >= 8 && digits.length <= 9

  return (
    <section className={ui.tool} aria-label="בדיקת מספר עוסק">
      <div className={ui.inner}>
        <form className={ui.form} onSubmit={(event) => event.preventDefault()}>
          <label htmlFor={id} className={ui.legend}>
            מספר עוסק
          </label>
          <input
            id={id}
            inputMode="numeric"
            className={`${ui.input} ${ui.ltr}`}
            value={text}
            onChange={(event) => setText(event.target.value)}
          />
        </form>
        <div className={ui.output}>
          <h2 className={ui.outputTitle}>התוצאה</h2>
          <p className={fun.panel}>
            {!complete
              ? 'הקלידו 8 או 9 ספרות.'
              : validDealerNumber(digits)
                ? 'ספרת הביקורת תקינה. כדי לוודא שהעוסק פעיל, בדקו באתר רשות המסים.'
                : 'המספר לא תקין לפי ספרת הביקורת. בדקו אם נפלה טעות הקלדה.'}
          </p>
          <a href="https://taxinfo.taxes.gov.il/emosek/wHzanatTik.aspx" rel="noopener" target="_blank">
            בדיקה באתר רשות המסים
          </a>
        </div>
      </div>
    </section>
  )
}

type EmailReport = { spf: string | null; dmarc: string | null; dkimSelectors: string[]; mx: boolean }

const dmarcPolicy = (record: string) => /;\s*p=(\w+)/i.exec(record)?.[1]?.toLowerCase() ?? ''

function reportRows(report: EmailReport): [string, string][] {
  const policy = report.dmarc ? dmarcPolicy(report.dmarc) : ''
  return [
    ['שרת דואר (MX)', report.mx ? 'קיים' : 'לא נמצא'],
    ['SPF', !report.spf ? 'חסר' : /\+all/.test(report.spf) ? 'מסוכן: +all' : 'קיים'],
    ['DMARC', !report.dmarc ? 'חסר' : policy === 'none' ? 'ניטור בלבד' : `מוגן: ${policy}`],
    ['DKIM', report.dkimSelectors.length ? report.dkimSelectors.join(', ') : 'לא זוהה בסלקטורים נפוצים'],
  ]
}

export function EmailDomainCheck() {
  const id = useId()
  const [domain, setDomain] = useState('')
  const [report, setReport] = useState<EmailReport | null>(null)
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  async function submit(event: FormEvent) {
    event.preventDefault()
    setBusy(true)
    setError('')
    setReport(null)
    try {
      const response = await fetch('/api/tools/email-domain-check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ domain }),
      })
      const data = await response.json()
      if (data.ok) setReport(data.report)
      else setError(response.status === 429 ? 'יותר מדי בדיקות. נסו שוב בעוד דקה.' : 'הקלידו דומיין תקין, למשל example.co.il.')
    } catch {
      setError('הבדיקה נכשלה. נסו שוב.')
    }
    setBusy(false)
  }

  return (
    <section className={ui.tool} aria-label="בדיקת הגנת מייל לדומיין">
      <div className={ui.inner}>
        <form className={ui.form} onSubmit={submit}>
          <label htmlFor={id} className={ui.legend}>
            דומיין
          </label>
          <input
            id={id}
            dir="ltr"
            className={`${ui.input} ${ui.ltr}`}
            value={domain}
            onChange={(event) => setDomain(event.target.value)}
          />
          <button type="submit" className={ui.primary} disabled={busy}>
            {busy ? 'בודק' : 'בדיקה'}
          </button>
        </form>
        <div className={ui.output}>
          <h2 className={ui.outputTitle}>התוצאה</h2>
          {error ? <p className={fun.panel}>{error}</p> : null}
          {report ? <Rows label="תוצאות הבדיקה" rows={reportRows(report)} /> : null}
          {!report && !error ? <p className={fun.panel}>הקלידו דומיין ולחצו על בדיקה.</p> : null}
        </div>
      </div>
    </section>
  )
}
