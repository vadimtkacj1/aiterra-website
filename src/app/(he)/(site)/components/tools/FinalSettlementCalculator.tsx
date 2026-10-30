'use client'

import { useId, useState } from 'react'
import { calculateSettlement } from '@/lib/final-settlement'
import { Field, TileGroup } from './FunTiles'
import { Metric, Rows, Shell } from './BodyCalculators'
import ui from './toolUi.module.css'

const YES_NO = [
  { id: 'no', label: 'לא' },
  { id: 'yes', label: 'כן' },
] as const
type YesNo = (typeof YES_NO)[number]['id']

const shekels = (value: number) => `${Math.round(value).toLocaleString('he-IL')} ₪`

export default function FinalSettlementCalculator() {
  const prefix = useId()
  const [start, setStart] = useState('')
  const [end, setEnd] = useState('')
  const [salary, setSalary] = useState('')
  const [vacation, setVacation] = useState('')
  const [dismissed, setDismissed] = useState<YesNo>('yes')
  const [section14, setSection14] = useState<YesNo>('no')
  const [noticeUnworked, setNoticeUnworked] = useState<YesNo>('no')

  const result = calculateSettlement({
    start,
    end,
    salary,
    dismissed: dismissed === 'yes',
    section14: section14 === 'yes',
    noticeUnworked: noticeUnworked === 'yes',
    vacationDays: Number(vacation) || 0,
  })

  return (
    <Shell
      name="מחשבון גמר חשבון"
      prompt="מלאו תאריכים ושכר כדי לחשב."
      note="הערכה לעובד במשכורת חודשית, ברוטו לפני מס. הסכם אישי, צו הרחבה או שכר משתנה משנים את הסכום. לא כולל שכר אחרון, עמלות ושעות נוספות."
      inputs={
        <>
          <Field id={`${prefix}s`} label="תחילת עבודה">
            <input id={`${prefix}s`} type="date" className={ui.input} value={start} onChange={(event) => setStart(event.target.value)} />
          </Field>
          <Field id={`${prefix}e`} label="סיום עבודה">
            <input id={`${prefix}e`} type="date" className={ui.input} value={end} onChange={(event) => setEnd(event.target.value)} />
          </Field>
          <Field id={`${prefix}m`} label="שכר חודשי אחרון (₪)">
            <input id={`${prefix}m`} inputMode="decimal" className={`${ui.input} ${ui.ltr}`} value={salary} onChange={(event) => setSalary(event.target.value)} />
          </Field>
          <Field id={`${prefix}v`} label="ימי חופשה שלא נוצלו">
            <input id={`${prefix}v`} inputMode="numeric" className={`${ui.input} ${ui.ltr}`} value={vacation} onChange={(event) => setVacation(event.target.value)} />
          </Field>
          <TileGroup legend="פוטרתם?" name={`${prefix}d`} options={[...YES_NO]} value={dismissed} onChange={setDismissed} columns="two" />
          <TileGroup legend="חל סעיף 14 מלא?" name={`${prefix}f`} options={[...YES_NO]} value={section14} onChange={setSection14} columns="two" />
          <TileGroup legend="לא עבדתם בתקופת ההודעה המוקדמת?" name={`${prefix}n`} options={[...YES_NO]} value={noticeUnworked} onChange={setNoticeUnworked} columns="two" />
        </>
      }
    >
      {result ? (
        <>
          <Metric label="סך הכל משוער" value={shekels(result.total)} unit="ברוטו" />
          <Rows label="פירוט גמר חשבון" rows={result.rows.map(({ label, amount }) => [label, shekels(amount)])} />
        </>
      ) : null}
    </Shell>
  )
}
