'use client'

import { useId, useState } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import {
  CUSTOM_ID,
  TARIFF_AGOROT_INCL_VAT,
  TARIFF_EFFECTIVE_LABEL,
  appliances,
  applianceById,
  costIls,
  formatIls,
  formatKwh,
  parseNumber,
  rowKwhPerMonth,
  type Row,
} from '@/lib/electricity-cost-calculator'
import ui from './toolUi.module.css'
import styles from './ElectricityCostCalculator.module.css'

const MAX_ROWS = 20

const initialRows: Row[] = [
  { key: 1, applianceId: 'ac-15', watts: '1200', quantity: '1', hoursPerDay: '6', daysPerMonth: '30' },
  { key: 2, applianceId: 'fridge', watts: '50', quantity: '1', hoursPerDay: '24', daysPerMonth: '30' },
]

export default function ElectricityCostCalculator() {
  const uid = useId()
  const [price, setPrice] = useState(String(TARIFF_AGOROT_INCL_VAT))
  const [rows, setRows] = useState<Row[]>(initialRows)
  const [nextKey, setNextKey] = useState(3)

  const priceValue = parseNumber(price)
  const monthlyKwh = rows.reduce((sum, row) => sum + rowKwhPerMonth(row), 0)
  const monthlyCost = costIls(monthlyKwh, priceValue)

  const update = (key: number, patch: Partial<Row>) => {
    setRows((current) => current.map((row) => (row.key === key ? { ...row, ...patch } : row)))
  }

  const chooseAppliance = (key: number, id: string) => {
    const found = applianceById(id)
    update(key, found ? { applianceId: id, watts: String(found.watts) } : { applianceId: CUSTOM_ID })
  }

  const addRow = () => {
    setRows((current) => [
      ...current,
      { key: nextKey, applianceId: 'tv', watts: '100', quantity: '1', hoursPerDay: '3', daysPerMonth: '30' },
    ])
    setNextKey((value) => value + 1)
  }

  const removeRow = (key: number) => setRows((current) => current.filter((row) => row.key !== key))

  return (
    <section className={ui.tool} aria-label="מחשבון צריכת חשמל">
      <div className={ui.inner}>
        <div className={ui.form}>
          <div className={ui.group}>
            <div className={ui.field}>
              <label htmlFor={`${uid}-price`} className={ui.label}>
                מחיר לקוט״ש באגורות, כולל מע״מ
              </label>
              <input
                id={`${uid}-price`}
                type="text"
                inputMode="decimal"
                className={`${ui.input} ${ui.ltr} ${styles.priceInput}`}
                value={price}
                onChange={(event) => setPrice(event.target.value)}
              />
              <p className={ui.hint}>ברירת המחדל היא תעריף משק הבית מ־{TARIFF_EFFECTIVE_LABEL}. אפשר לשנות לפי החשבון שלכם.</p>
            </div>
          </div>

          {rows.map((row, index) => {
            const kwh = rowKwhPerMonth(row)
            const id = `${uid}-${row.key}`
            return (
              <fieldset key={row.key} className={ui.group}>
                <legend className={ui.legend}>מכשיר {index + 1}</legend>
                <div className={ui.field}>
                  <label htmlFor={`${id}-appliance`} className={ui.label}>
                    סוג המכשיר
                  </label>
                  <select
                    id={`${id}-appliance`}
                    className={ui.input}
                    value={row.applianceId}
                    onChange={(event) => chooseAppliance(row.key, event.target.value)}
                  >
                    {appliances.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.name}
                      </option>
                    ))}
                    <option value={CUSTOM_ID}>מכשיר אחר (הקלדת הספק)</option>
                  </select>
                </div>
                <div className={styles.fields}>
                  <div className={ui.field}>
                    <label htmlFor={`${id}-watts`} className={ui.label}>
                      הספק בוואט
                    </label>
                    <input
                      id={`${id}-watts`}
                      type="text"
                      inputMode="decimal"
                      className={`${ui.input} ${ui.ltr}`}
                      value={row.watts}
                      onChange={(event) => update(row.key, { watts: event.target.value, applianceId: CUSTOM_ID })}
                    />
                  </div>
                  <div className={ui.field}>
                    <label htmlFor={`${id}-qty`} className={ui.label}>
                      כמות
                    </label>
                    <input
                      id={`${id}-qty`}
                      type="text"
                      inputMode="numeric"
                      className={`${ui.input} ${ui.ltr}`}
                      value={row.quantity}
                      onChange={(event) => update(row.key, { quantity: event.target.value })}
                    />
                  </div>
                  <div className={ui.field}>
                    <label htmlFor={`${id}-hours`} className={ui.label}>
                      שעות ביום
                    </label>
                    <input
                      id={`${id}-hours`}
                      type="text"
                      inputMode="decimal"
                      className={`${ui.input} ${ui.ltr}`}
                      value={row.hoursPerDay}
                      onChange={(event) => update(row.key, { hoursPerDay: event.target.value })}
                    />
                  </div>
                  <div className={ui.field}>
                    <label htmlFor={`${id}-days`} className={ui.label}>
                      ימים בחודש
                    </label>
                    <input
                      id={`${id}-days`}
                      type="text"
                      inputMode="numeric"
                      className={`${ui.input} ${ui.ltr}`}
                      value={row.daysPerMonth}
                      onChange={(event) => update(row.key, { daysPerMonth: event.target.value })}
                    />
                  </div>
                </div>
                <p className={styles.rowResult}>
                  {formatKwh(kwh)} קוט״ש בחודש, {formatIls(costIls(kwh, priceValue))}
                </p>
                {rows.length > 1 ? (
                  <button type="button" className={ui.secondary} onClick={() => removeRow(row.key)}>
                    <Trash2 aria-hidden="true" />
                    הסרת מכשיר {index + 1}
                  </button>
                ) : null}
              </fieldset>
            )
          })}

          <div className={ui.actions}>
            <button type="button" className={ui.secondary} onClick={addRow} disabled={rows.length >= MAX_ROWS}>
              <Plus aria-hidden="true" />
              הוספת מכשיר
            </button>
          </div>
          <p className={ui.note}>ההספקים ברשימה הם ערכים אופייניים בלבד. ההספק האמיתי כתוב על מדבקת המכשיר.</p>
        </div>

        <div className={ui.output}>
          <div className={ui.sticky}>
            <h2 className={ui.outputTitle}>הערכת עלות</h2>
            <div className={`${ui.paper} ${styles.summary}`} role="status" aria-live="polite">
              <dl className={styles.totals}>
                <div>
                  <dt>צריכה חודשית</dt>
                  <dd>{formatKwh(monthlyKwh)} קוט״ש</dd>
                </div>
                <div>
                  <dt>עלות חודשית</dt>
                  <dd className={styles.big}>{formatIls(monthlyCost)}</dd>
                </div>
                <div>
                  <dt>עלות דו־חודשית</dt>
                  <dd>{formatIls(monthlyCost * 2)}</dd>
                </div>
                <div>
                  <dt>עלות שנתית</dt>
                  <dd>{formatIls(monthlyCost * 12)}</dd>
                </div>
              </dl>
            </div>
            <p className={ui.note}>
              החשבון בפועל כולל גם תשלום קבוע על החיבור, ולכן הוא גבוה מהסכום כאן. החשבונות בישראל הם דו־חודשיים.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
