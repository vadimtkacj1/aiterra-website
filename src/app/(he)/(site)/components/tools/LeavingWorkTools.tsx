'use client'

import { useId, useState } from 'react'
import { lengthLabel, noticeLength } from '@/lib/notice-period'
import { Field, TileGroup } from './FunTiles'
import ui from './toolUi.module.css'
import fun from './FunTool.module.css'

const REASONS = [
  { id: 'dismissed', label: 'פוטרתי' },
  { id: 'resigned', label: 'התפטרתי', hint: 'בלי סיבה מיוחדת' },
  { id: 'justified', label: 'התפטרתי מסיבה מוצדקת', hint: 'למשל בריאות או הרעת תנאים' },
] as const
type Reason = (typeof REASONS)[number]['id']

const TENURES = [
  { id: 'short', label: 'פחות משנה' },
  { id: 'long', label: 'שנה ומעלה' },
] as const
type Tenure = (typeof TENURES)[number]['id']

const YES_NO = [
  { id: 'yes', label: 'כן' },
  { id: 'no', label: 'לא' },
] as const
type YesNo = (typeof YES_NO)[number]['id']

function entitlements(reason: Reason, tenure: Tenure, insured: YesNo): [string, string][] {
  const long = tenure === 'long'
  const dismissed = reason === 'dismissed'
  const unemployment =
    insured === 'no'
      ? 'כנראה לא: בדרך כלל נדרשים 12 חודשי ביטוח ב-18 החודשים האחרונים.'
      : reason === 'resigned'
        ? 'ייתכן, בדרך כלל אחרי המתנה של 90 יום.'
        : 'כנראה כן, אם נרשמתם לשירות התעסוקה ועמדתם בתנאים.'
  return [
    ['פיצויי פיטורים', !long ? 'בדרך כלל לא, נדרשת שנת עבודה.' : reason === 'resigned' ? 'בדרך כלל לא, למעט מקרים שהחוק מכיר בהם.' : dismissed ? 'כן, אם לא חל סעיף 14 מלא.' : 'ייתכן, צריך לבדוק את הסיבה ואת הודעתכם למעסיק.'],
    ['דמי אבטלה', unemployment],
    ['פדיון חופשה', 'כן, על ימים שנצברו ולא נוצלו.'],
    ['דמי הבראה', long ? 'כן, אחרי שנת עבודה.' : 'בדרך כלל לא, נדרשת שנת עבודה.'],
    ['הודעה מוקדמת', dismissed ? 'המעסיק צריך לתת אותה או לשלם חלף הודעה.' : 'אתם צריכים לתת אותה למעסיק.'],
  ]
}

export function LeavingWorkWizard() {
  const prefix = useId()
  const [reason, setReason] = useState<Reason>('dismissed')
  const [tenure, setTenure] = useState<Tenure>('long')
  const [insured, setInsured] = useState<YesNo>('yes')

  return (
    <section className={ui.tool} aria-label="מה מגיע לי בסיום עבודה">
      <div className={ui.inner}>
        <form className={ui.form} onSubmit={(event) => event.preventDefault()}>
          <TileGroup legend="איך הסתיימה העבודה?" name={`${prefix}r`} options={[...REASONS]} value={reason} onChange={setReason} />
          <TileGroup legend="כמה זמן עבדתם?" name={`${prefix}t`} options={[...TENURES]} value={tenure} onChange={setTenure} columns="two" />
          <TileGroup legend="עבדתם 12 חודשים מתוך 18 האחרונים?" name={`${prefix}i`} options={[...YES_NO]} value={insured} onChange={setInsured} columns="two" />
        </form>
        <div className={ui.output} aria-live="polite">
          <h2 className={ui.outputTitle}>מה כנראה מגיע לכם</h2>
          <dl>
            {entitlements(reason, tenure, insured).map(([title, text]) => (
              <div key={title} className={fun.panel}>
                <dt>
                  <strong>{title}</strong>
                </dt>
                <dd>{text}</dd>
              </div>
            ))}
          </dl>
          <p className={ui.note}>בדיקה ראשונית בלבד, לא ייעוץ משפטי. בדקו את המקרה שלכם בביטוח הלאומי או מול עורך דין.</p>
        </div>
      </div>
    </section>
  )
}

export function ResignationLetterGenerator() {
  const prefix = useId()
  const [name, setName] = useState('')
  const [employer, setEmployer] = useState('')
  const [lastDay, setLastDay] = useState('')
  const [months, setMonths] = useState('')
  const [copied, setCopied] = useState(false)

  const monthsWorked = Number(months)
  const notice = monthsWorked > 0 ? lengthLabel(noticeLength('salaried', monthsWorked)) : null
  const day = lastDay ? lastDay.split('-').reverse().join('.') : '____'
  const letter = `לכבוד ${employer || '____'}\n\nהנדון: הודעה על סיום עבודה\n\nהריני להודיעכם על התפטרותי מעבודתי. יום העבודה האחרון שלי יהיה ${day}.\n\nאבקש לקבל במועד סיום העבודה גמר חשבון, אישור על תקופת העסקה וטופס 161 אם הוא נדרש.\n\nתודה על ההזדמנות ובברכה,\n${name || '____'}`

  async function copy() {
    await navigator.clipboard.writeText(letter)
    setCopied(true)
  }

  return (
    <section className={ui.tool} aria-label="מחולל מכתב התפטרות">
      <div className={ui.inner}>
        <form className={ui.form} onSubmit={(event) => event.preventDefault()}>
          <Field id={`${prefix}n`} label="השם שלכם">
            <input id={`${prefix}n`} className={ui.input} value={name} onChange={(event) => setName(event.target.value)} />
          </Field>
          <Field id={`${prefix}e`} label="שם המעסיק">
            <input id={`${prefix}e`} className={ui.input} value={employer} onChange={(event) => setEmployer(event.target.value)} />
          </Field>
          <Field id={`${prefix}m`} label="חודשי עבודה (למשכורת חודשית)">
            <input id={`${prefix}m`} inputMode="numeric" className={`${ui.input} ${ui.ltr}`} value={months} onChange={(event) => setMonths(event.target.value)} />
          </Field>
          <Field id={`${prefix}d`} label="יום עבודה אחרון">
            <input id={`${prefix}d`} type="date" className={ui.input} value={lastDay} onChange={(event) => setLastDay(event.target.value)} />
          </Field>
        </form>
        <div className={ui.output}>
          <h2 className={ui.outputTitle}>המכתב</h2>
          {notice ? <p className={fun.panel}>הודעה מוקדמת נדרשת: {notice}.</p> : null}
          <p className={fun.card} style={{ whiteSpace: 'pre-line' }}>
            {letter}
          </p>
          <button type="button" className={ui.primary} onClick={copy}>
            {copied ? 'הועתק' : 'העתקת המכתב'}
          </button>
        </div>
      </div>
    </section>
  )
}
