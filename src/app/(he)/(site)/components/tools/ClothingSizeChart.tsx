'use client'

import { useId, useState } from 'react'
import {
  braFromMeasurements,
  clothingGroups,
  clothingTables,
  columnTitle,
  findByMeasurements,
  findBySize,
  parseCentimeters,
  type ClothingGroupId,
  type SizeRow,
  type SystemId,
} from '@/lib/clothing-sizes'
import ui from './toolUi.module.css'
import styles from './ClothingSizeChart.module.css'

type Mode = 'size' | 'body'

function ResultRow({ group, row }: { group: ClothingGroupId; row: SizeRow }) {
  const systems = clothingGroups.find((item) => item.id === group)?.systems ?? []
  return (
    <>
      <dl className={styles.result}>
        {systems.map((system) => (
          <div key={system}>
            <dt>{columnTitle(group, system)}</dt>
            <dd className={styles.big}>{row.labels[system]}</dd>
          </div>
        ))}
      </dl>
      <p className={ui.note}>
        מידות גוף למידה הזו, בסנטימטרים: חזה <span dir="ltr">{row.chest}</span>, מותן <span dir="ltr">{row.waist}</span>
        , ירכיים <span dir="ltr">{row.hips}</span>.
      </p>
    </>
  )
}

export default function ClothingSizeChart() {
  const groupName = useId()
  const modeName = useId()
  const baseId = useId()
  const [group, setGroup] = useState<ClothingGroupId>('women')
  const [mode, setMode] = useState<Mode>('size')
  const [system, setSystem] = useState<SystemId>('eu')
  const [sizeValue, setSizeValue] = useState('38')
  const [chest, setChest] = useState('')
  const [waist, setWaist] = useState('')
  const [hips, setHips] = useState('')
  const [underbust, setUnderbust] = useState('')
  const [bust, setBust] = useState('')

  const groupInfo = clothingGroups.find((item) => item.id === group) ?? clothingGroups[0]
  const rows = clothingTables[group]
  const activeSystem: SystemId = groupInfo.systems.includes(system) ? system : 'eu'
  const options = rows.map((row) => row.labels[activeSystem] ?? '')
  const selected = findBySize(group, activeSystem, sizeValue) ?? rows[0]

  const chestValue = parseCentimeters(chest)
  const waistValue = parseCentimeters(waist)
  const hipsValue = parseCentimeters(hips)
  const invalid = [chestValue, waistValue, hipsValue].includes('invalid')
  const measurement = invalid
    ? null
    : findByMeasurements(group, {
        chest: chestValue as number | null,
        waist: waistValue as number | null,
        hips: hipsValue as number | null,
      })

  const underbustValue = parseCentimeters(underbust)
  const bustValue = parseCentimeters(bust)
  const bra =
    typeof underbustValue === 'number' && typeof bustValue === 'number'
      ? braFromMeasurements(underbustValue, bustValue)
      : null

  const changeGroup = (next: ClothingGroupId) => {
    setGroup(next)
    setSystem('eu')
    setSizeValue(clothingTables[next][Math.floor(clothingTables[next].length / 3)].labels.eu ?? '')
  }

  const changeSystem = (next: SystemId) => {
    const current = findBySize(group, activeSystem, sizeValue) ?? rows[0]
    setSystem(next)
    setSizeValue(current.labels[next] ?? '')
  }

  return (
    <section className={ui.tool} aria-label="מחשבון מידות בגדים">
      <div className={ui.inner}>
        <form className={ui.form} onSubmit={(event) => event.preventDefault()}>
          <fieldset className={ui.group}>
            <legend className={ui.legend}>לנשים, לגברים או לילדים</legend>
            <div className={styles.tiles}>
              {clothingGroups.map((item) => (
                <label key={item.id} className={styles.tile}>
                  <input
                    type="radio"
                    name={groupName}
                    value={item.id}
                    checked={group === item.id}
                    onChange={() => changeGroup(item.id)}
                  />
                  <span className={styles.tileLabel}>{item.label}</span>
                </label>
              ))}
            </div>
          </fieldset>

          <fieldset className={ui.group}>
            <legend className={ui.legend}>מה אתם יודעים</legend>
            <div className={styles.tiles2}>
              <label className={styles.tile}>
                <input type="radio" name={modeName} checked={mode === 'size'} onChange={() => setMode('size')} />
                <span className={styles.tileLabel}>מידה במערכת אחת</span>
              </label>
              <label className={styles.tile}>
                <input type="radio" name={modeName} checked={mode === 'body'} onChange={() => setMode('body')} />
                <span className={styles.tileLabel}>מידות גוף בסנטימטרים</span>
              </label>
            </div>
          </fieldset>

          {mode === 'size' ? (
            <fieldset className={ui.group}>
              <legend className={ui.legend}>המידה שיש לכם</legend>
              <div className={ui.row}>
                <div className={ui.field}>
                  <label htmlFor={`${baseId}-system`} className={ui.label}>
                    שיטת מידות
                  </label>
                  <select
                    id={`${baseId}-system`}
                    className={`${ui.input} ${styles.select}`}
                    value={activeSystem}
                    onChange={(event) => changeSystem(event.target.value as SystemId)}
                  >
                    {groupInfo.systems.map((item) => (
                      <option key={item} value={item}>
                        {columnTitle(group, item)}
                      </option>
                    ))}
                  </select>
                </div>
                <div className={ui.field}>
                  <label htmlFor={`${baseId}-size`} className={ui.label}>
                    מידה
                  </label>
                  <select
                    id={`${baseId}-size`}
                    className={`${ui.input} ${styles.select} ${ui.ltr}`}
                    value={selected.labels[activeSystem] ?? ''}
                    onChange={(event) => setSizeValue(event.target.value)}
                  >
                    {options.map((item) => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </fieldset>
          ) : (
            <fieldset className={ui.group}>
              <legend className={ui.legend}>מידות הגוף שלכם</legend>
              <div className={styles.three}>
                {(
                  [
                    ['chest', 'היקף חזה', chest, setChest],
                    ['waist', 'היקף מותן', waist, setWaist],
                    ['hips', 'היקף ירכיים', hips, setHips],
                  ] as const
                ).map(([key, label, value, setValue]) => (
                  <div className={ui.field} key={key}>
                    <label htmlFor={`${baseId}-${key}`} className={ui.label}>
                      {label}
                    </label>
                    <input
                      id={`${baseId}-${key}`}
                      type="text"
                      inputMode="decimal"
                      autoComplete="off"
                      className={`${ui.input} ${ui.ltr}`}
                      value={value}
                      onChange={(event) => setValue(event.target.value)}
                    />
                  </div>
                ))}
              </div>
              <p className={ui.hint}>
                בסנטימטרים, למשל 92. אפשר למלא רק שדה אחד או שניים. אם המידות בין שתי מידות, בוחרים את הגדולה.
              </p>
              {invalid ? <p className={styles.error}>הזינו מספר בין 30 ל-200, למשל 92.</p> : null}
            </fieldset>
          )}

          {group === 'women' ? (
            <fieldset className={ui.group}>
              <legend className={ui.legend}>מידת חזייה</legend>
              <div className={ui.row}>
                <div className={ui.field}>
                  <label htmlFor={`${baseId}-underbust`} className={ui.label}>
                    היקף מתחת לחזה
                  </label>
                  <input
                    id={`${baseId}-underbust`}
                    type="text"
                    inputMode="decimal"
                    autoComplete="off"
                    className={`${ui.input} ${ui.ltr}`}
                    value={underbust}
                    onChange={(event) => setUnderbust(event.target.value)}
                  />
                </div>
                <div className={ui.field}>
                  <label htmlFor={`${baseId}-bust`} className={ui.label}>
                    היקף בנקודה המלאה של החזה
                  </label>
                  <input
                    id={`${baseId}-bust`}
                    type="text"
                    inputMode="decimal"
                    autoComplete="off"
                    className={`${ui.input} ${ui.ltr}`}
                    value={bust}
                    onChange={(event) => setBust(event.target.value)}
                  />
                </div>
              </div>
            </fieldset>
          ) : null}
        </form>

        <div className={ui.output}>
          <h2 className={ui.outputTitle}>המידה שלכם</h2>
          <div aria-live="polite">
            {mode === 'size' ? <ResultRow group={group} row={selected} /> : null}
            {mode === 'body' && measurement?.status === 'found' ? (
              <ResultRow group={group} row={measurement.row} />
            ) : null}
            {mode === 'body' && measurement?.status === 'above' ? (
              <p className={ui.note}>
                המידות שהוזנו גדולות מהמידה הגדולה בטבלה. בדקו טבלת מידות גדולות אצל המותג.
              </p>
            ) : null}
            {mode === 'body' && (!measurement || measurement.status === 'empty') && !invalid ? (
              <p className={ui.note}>הזינו לפחות מידת גוף אחת כדי לראות את המידה בכל השיטות.</p>
            ) : null}
            {bra?.status === 'found' ? (
              <p className={ui.note}>
                חזייה: ישראל ואירופה <span dir="ltr">{bra.band.eu}{bra.cup.eu}</span>, ארה״ב ובריטניה{' '}
                <span dir="ltr">{bra.band.us}{bra.cup.uk}</span>, צרפת <span dir="ltr">{bra.band.fr}{bra.cup.eu}</span>.
              </p>
            ) : null}
            {bra?.status === 'out' ? (
              <p className={ui.note}>
                ההפרש בין שני ההיקפים מחוץ לטווח הטבלה. בדקו שוב את המדידה, או פנו לחנות עם ייעוץ למידת חזייה.
              </p>
            ) : null}
          </div>
          <p className={ui.note}>
            הטבלה כללית ואינה של מותג מסוים. החישוב נעשה בדפדפן, ושום דבר לא נשלח לשרת.
          </p>
        </div>
      </div>
    </section>
  )
}
