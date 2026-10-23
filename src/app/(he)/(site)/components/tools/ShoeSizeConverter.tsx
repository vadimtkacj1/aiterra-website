'use client'

import { useId, useState } from 'react'
import {
  convertFootLength,
  parisPointEstimate,
  parseFootLength,
  shoeGroups,
  type ShoeGroupId,
} from '@/lib/shoe-sizes'
import ui from './toolUi.module.css'
import styles from './ShoeSizeConverter.module.css'

export default function ShoeSizeConverter() {
  const groupName = useId()
  const lengthId = useId()
  const hintId = useId()
  const errorId = useId()
  const [group, setGroup] = useState<ShoeGroupId>('men')
  const [length, setLength] = useState('')
  const [touched, setTouched] = useState(false)

  const parsed = parseFootLength(length)
  const error = parsed.status === 'invalid' && (touched || length.length > 5) ? parsed.error : ''
  const conversion = parsed.status === 'valid' ? convertFootLength(group, parsed.cm) : null
  const groupInfo = shoeGroups.find((item) => item.id === group) ?? shoeGroups[0]

  return (
    <section className={ui.tool} aria-label="מחשבון מידות נעליים לפי אורך כף הרגל">
      <div className={ui.inner}>
        <form className={ui.form} onSubmit={(event) => event.preventDefault()}>
          <fieldset className={ui.group}>
            <legend className={ui.legend}>לגברים, לנשים או לילדים</legend>
            <div className={styles.tiles}>
              {shoeGroups.map((item) => (
                <label key={item.id} className={styles.tile}>
                  <input
                    type="radio"
                    name={groupName}
                    value={item.id}
                    checked={group === item.id}
                    onChange={() => setGroup(item.id)}
                  />
                  <span className={styles.tileLabel}>{item.label}</span>
                </label>
              ))}
            </div>
          </fieldset>

          <fieldset className={ui.group}>
            <legend className={ui.legend}>אורך כף הרגל</legend>
            <div className={ui.field}>
              <label htmlFor={lengthId} className={ui.label}>
                אורך בסנטימטרים
              </label>
              <p id={hintId} className={ui.hint}>
                מודדים את הרגל הארוכה יותר, מהעקב ועד קצה הבוהן הארוכה. למשל 26.5.
              </p>
              <input
                id={lengthId}
                type="text"
                inputMode="decimal"
                autoComplete="off"
                className={`${ui.input} ${ui.ltr} ${error ? styles.invalid : ''}`}
                aria-invalid={error !== ''}
                aria-describedby={error ? `${hintId} ${errorId}` : hintId}
                value={length}
                onChange={(event) => setLength(event.target.value)}
                onBlur={() => setTouched(true)}
              />
              <p id={errorId} className={styles.error} aria-live="polite">
                {error}
              </p>
            </div>
          </fieldset>
        </form>

        <div className={ui.output}>
          <h2 className={ui.outputTitle}>המידה שלכם</h2>
          <div aria-live="polite">
            {conversion?.status === 'found' && parsed.status === 'valid' ? (
              <>
                <dl className={styles.result}>
                  <div>
                    <dt>ישראל ואירופה (EU)</dt>
                    <dd className={styles.big}>{conversion.size.eu}</dd>
                  </div>
                  <div>
                    <dt>{groupInfo.usLabel}</dt>
                    <dd className={styles.big}>{conversion.size.us}</dd>
                  </div>
                  {groupInfo.usAltLabel && conversion.size.usAlt ? (
                    <div>
                      <dt>{groupInfo.usAltLabel}</dt>
                      <dd className={styles.big}>{conversion.size.usAlt}</dd>
                    </div>
                  ) : null}
                  <div>
                    <dt>בריטניה (UK)</dt>
                    <dd className={styles.big}>{conversion.size.uk}</dd>
                  </div>
                </dl>
                <p className={ui.note}>
                  לפי טבלת Nike, למידה הזו אורך כף רגל של עד {conversion.size.foot} ס״מ. כשהאורך שלכם בין שתי מידות,
                  Nike ממליצה לעלות למידה הגדולה. נוסחת נקודת פריז הכללית נותנת בערך {parisPointEstimate(parsed.cm)}. בין
                  מותגים ההבדל יכול להגיע למידה שלמה.
                </p>
              </>
            ) : null}
            {conversion && conversion.status !== 'found' ? (
              <p className={ui.note}>
                {conversion.status === 'above'
                  ? `האורך שהוזן גדול מהמידה הגדולה בטבלה של Nike (${conversion.limit} ס״מ). בדקו בחנות או אצל המותג.`
                  : `האורך שהוזן קטן מהמידה הקטנה בטבלה של Nike (${conversion.limit} ס״מ). בדקו בחנות או אצל המותג.`}
              </p>
            ) : null}
            {parsed.status !== 'valid' ? (
              <p className={ui.note}>הזינו אורך כף רגל כדי לראות את המידה בישראל, באירופה, בארה״ב ובבריטניה.</p>
            ) : null}
          </div>
          <p className={ui.note}>החישוב נעשה בדפדפן, ושום דבר לא נשלח לשרת.</p>
        </div>
      </div>
    </section>
  )
}
