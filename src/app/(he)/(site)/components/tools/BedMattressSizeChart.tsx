'use client'

import { useId, useState } from 'react'
import {
  DEFAULT_FRAME_CM,
  DEFAULT_MATTRESS_HEIGHT_CM,
  DEFAULT_WALKWAY_CM,
  MAX_ROOM_CM,
  bedSizes,
  checkRoom,
  cmError,
  findBed,
  parseCm,
  pocketDepthCm,
} from '@/lib/bed-mattress-size-chart'
import ui from './toolUi.module.css'
import styles from './BedMattressSizeChart.module.css'

export default function BedMattressSizeChart() {
  const [bedId, setBedId] = useState('double')
  const [height, setHeight] = useState(String(DEFAULT_MATTRESS_HEIGHT_CM))
  const [roomWidth, setRoomWidth] = useState('')
  const [roomLength, setRoomLength] = useState('')
  const [walkway, setWalkway] = useState(String(DEFAULT_WALKWAY_CM))
  const [frame, setFrame] = useState(String(DEFAULT_FRAME_CM))
  const [bothSides, setBothSides] = useState(true)
  const baseId = useId()

  const bed = findBed(bedId)
  const heightIssue = cmError(height, 5, 60)
  const heightValue = heightIssue ? null : parseCm(height)

  const widthIssue = cmError(roomWidth, 100, MAX_ROOM_CM)
  const lengthIssue = cmError(roomLength, 100, MAX_ROOM_CM)
  const walkwayIssue = cmError(walkway, 0, 200)
  const frameIssue = cmError(frame, 0, 30)
  const roomWidthValue = widthIssue ? null : parseCm(roomWidth)
  const roomLengthValue = lengthIssue ? null : parseCm(roomLength)
  const walkwayValue = walkwayIssue ? null : parseCm(walkway)
  const frameValue = frameIssue ? null : parseCm(frame)
  const roomReady =
    roomWidthValue !== null && roomLengthValue !== null && walkwayValue !== null && frameValue !== null

  const results = roomReady
    ? bedSizes.map((size) => ({
        size,
        check: checkRoom(
          {
            widthCm: roomWidthValue,
            lengthCm: roomLengthValue,
            walkwayCm: walkwayValue,
            frameCm: frameValue,
            bothSides,
          },
          size,
        ),
      }))
    : []

  const numberField = (
    id: string,
    label: string,
    value: string,
    setValue: (next: string) => void,
    issue: string,
    maxLength: number,
  ) => (
    <div className={ui.field}>
      <label htmlFor={`${baseId}-${id}`} className={ui.label}>
        {label}
      </label>
      <input
        id={`${baseId}-${id}`}
        className={`${ui.input} ${ui.ltr}`}
        inputMode="decimal"
        autoComplete="off"
        maxLength={maxLength}
        value={value}
        aria-invalid={issue ? true : undefined}
        aria-describedby={issue ? `${baseId}-${id}-error` : undefined}
        onChange={(event) => setValue(event.target.value)}
      />
      {issue ? (
        <p id={`${baseId}-${id}-error`} className={styles.error}>
          {issue}
        </p>
      ) : null}
    </div>
  )

  return (
    <section className={ui.tool} aria-labelledby={`${baseId}-title`}>
      <div className={`${ui.inner} ${styles.inner}`}>
        <div className={ui.form}>
          <fieldset className={ui.group}>
            <legend id={`${baseId}-title`} className={ui.legend}>
              סדין ומזרן לפי גודל המיטה
            </legend>
            <div className={styles.pair}>
              <div className={ui.field}>
                <label htmlFor={`${baseId}-bed`} className={ui.label}>
                  גודל מיטה
                </label>
                <select
                  id={`${baseId}-bed`}
                  className={`${ui.input} ${styles.select}`}
                  value={bedId}
                  onChange={(event) => setBedId(event.target.value)}
                >
                  {bedSizes.map((size) => (
                    <option key={size.id} value={size.id}>
                      {size.name}
                    </option>
                  ))}
                </select>
              </div>
              {numberField('height', 'גובה המזרן בסנטימטרים', height, setHeight, heightIssue, 4)}
            </div>
            <div className={styles.card} aria-live="polite" aria-atomic="true">
              <p className={styles.big} dir="ltr">
                {bed.options}
              </p>
              <p>מידות המזרן הנפוצות לגודל {bed.name}, ברוחב על אורך בסנטימטרים.</p>
              {heightValue !== null ? (
                <p>
                  סדין עם גומי: חפשו כיס בעומק של <strong>{pocketDepthCm(heightValue)} ס״מ</strong> לפחות, כלומר גובה
                  המזרן ועוד 5 ס״מ לנוחות. זה כלל אצבע שלנו, ולא מידה רשמית.
                </p>
              ) : null}
            </div>
          </fieldset>

          <fieldset className={ui.group}>
            <legend className={ui.legend}>איזו מיטה נכנסת לחדר</legend>
            <div className={styles.pair}>
              {numberField('room-width', 'רוחב החדר בסנטימטרים', roomWidth, setRoomWidth, widthIssue, 5)}
              {numberField('room-length', 'אורך החדר בסנטימטרים', roomLength, setRoomLength, lengthIssue, 5)}
              {numberField('walkway', 'רוחב מעבר בסנטימטרים', walkway, setWalkway, walkwayIssue, 3)}
              {numberField('frame', 'תוספת מסגרת לכל צד בסנטימטרים', frame, setFrame, frameIssue, 2)}
            </div>
            <label className={ui.option}>
              <input
                type="checkbox"
                className={ui.checkbox}
                checked={bothSides}
                onChange={(event) => setBothSides(event.target.checked)}
              />
              <span>מעבר משני צדי המיטה (אחרת רק מצד אחד)</span>
            </label>
            <div aria-live="polite" aria-atomic="true">
              {roomReady ? (
                <ul className={styles.list}>
                  {results.map(({ size, check }) => (
                    <li key={size.id} className={`${styles.item} ${check.fits ? styles.fit : styles.nofit}`}>
                      <span className={styles.verdict}>
                        {size.name}: {check.fits ? 'נכנסת' : 'לא נכנסת'}
                      </span>
                      <span className={styles.detail}>
                        דרושים חדר של <span dir="ltr">{check.neededWidthCm} × {check.neededLengthCm}</span> ס״מ לפחות
                        {check.rotated ? ', כשהמיטה מסובבת' : ''}.
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className={ui.note}>הקלידו רוחב ואורך של החדר כדי לראות אילו מיטות נכנסות.</p>
              )}
            </div>
            <p className={ui.note}>
              החישוב מניח מיטה עם הראש לקיר, מעבר בסוף המיטה, ומידות מזרן אופייניות לכל גודל. הוא לא מתחשב בדלת, בארון
              או בחלון.
            </p>
          </fieldset>
        </div>
      </div>
    </section>
  )
}
