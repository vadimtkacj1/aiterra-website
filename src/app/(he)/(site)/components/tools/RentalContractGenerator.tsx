'use client'

import { useId, useState } from 'react'
import { guaranteeCap, rentalContract } from '@/lib/rental-contract'
import { Field, TileGroup } from './FunTiles'
import ui from './toolUi.module.css'
import fun from './FunTool.module.css'

const YES_NO = [
  { id: 'no', label: 'לא' },
  { id: 'yes', label: 'כן' },
] as const
type YesNo = (typeof YES_NO)[number]['id']

const TEXT_FIELDS = [
  { id: 'landlord', label: 'שם המשכיר' },
  { id: 'landlordId', label: 'ת״ז המשכיר' },
  { id: 'tenant', label: 'שם השוכר' },
  { id: 'tenantId', label: 'ת״ז השוכר' },
  { id: 'address', label: 'כתובת הדירה' },
  { id: 'months', label: 'תקופה בחודשים' },
  { id: 'rent', label: 'שכר דירה לחודש (₪)' },
  { id: 'deposit', label: 'גובה הערובה (₪)' },
] as const

export default function RentalContractGenerator() {
  const prefix = useId()
  const [values, setValues] = useState<Record<string, string>>({})
  const [start, setStart] = useState('')
  const [option, setOption] = useState<YesNo>('no')
  const [earlyExit, setEarlyExit] = useState<YesNo>('no')
  const [copied, setCopied] = useState(false)

  const rent = Number(values.rent) || 0
  const months = Number(values.months) || 0
  const deposit = Number(values.deposit) || 0
  const cap = guaranteeCap(rent, months)
  const contract = rentalContract({
    landlord: values.landlord ?? '',
    landlordId: values.landlordId ?? '',
    tenant: values.tenant ?? '',
    tenantId: values.tenantId ?? '',
    address: values.address ?? '',
    start,
    months,
    rent,
    deposit,
    option: option === 'yes',
    earlyExit: earlyExit === 'yes',
  })

  async function copy() {
    await navigator.clipboard.writeText(contract)
    setCopied(true)
  }

  return (
    <section className={ui.tool} aria-label="מחולל הסכם שכירות">
      <div className={ui.inner}>
        <form className={ui.form} onSubmit={(event) => event.preventDefault()}>
          {TEXT_FIELDS.map(({ id, label }) => (
            <Field key={id} id={`${prefix}${id}`} label={label}>
              <input
                id={`${prefix}${id}`}
                className={ui.input}
                value={values[id] ?? ''}
                onChange={(event) => setValues({ ...values, [id]: event.target.value })}
              />
            </Field>
          ))}
          <Field id={`${prefix}start`} label="תחילת השכירות">
            <input id={`${prefix}start`} type="date" className={ui.input} value={start} onChange={(event) => setStart(event.target.value)} />
          </Field>
          <TileGroup legend="אופציית הארכה" name={`${prefix}o`} options={[...YES_NO]} value={option} onChange={setOption} columns="two" />
          <TileGroup legend="זכות ליציאה מוקדמת" name={`${prefix}x`} options={[...YES_NO]} value={earlyExit} onChange={setEarlyExit} columns="two" />
        </form>
        <div className={ui.output}>
          <h2 className={ui.outputTitle}>ההסכם</h2>
          {cap > 0 && deposit > cap ? (
            <p className={fun.panel}>
              הערובה גבוהה מהתקרה בחוק לערובות שכרוכות בהוצאה כספית לשוכר: {Math.round(cap).toLocaleString('he-IL')} ₪.
            </p>
          ) : null}
          <p className={fun.card} style={{ whiteSpace: 'pre-line' }}>
            {contract}
          </p>
          <button type="button" className={ui.primary} onClick={copy}>
            {copied ? 'הועתק' : 'העתקת ההסכם'}
          </button>
          <button type="button" className={ui.primary} onClick={() => window.print()}>
            הדפסה או שמירה כ-PDF
          </button>
        </div>
      </div>
    </section>
  )
}
