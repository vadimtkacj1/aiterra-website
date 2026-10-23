'use client'

import { useId, useState } from 'react'
import {
  DEFAULT_CHILD_SHARE,
  DEFAULT_COST_HIGH,
  DEFAULT_COST_LOW,
  MAX_COST,
  MAX_PEOPLE,
  closenessOptions,
  defaultCoverage,
  formatRange,
  giftRange,
  inputIsValid,
  perPerson,
  roundingSteps,
  type ClosenessId,
  type GiftInput,
} from '@/lib/wedding-gift-amount'
import { NumberField, RadioTiles, parseNumber } from './ToolFields'
import ui from './toolUi.module.css'
import styles from './ToolFields.module.css'

const clampCount = (value: string, min: number) => {
  const parsed = parseNumber(value)
  if (parsed === null) return min
  return Math.min(MAX_PEOPLE, Math.max(min, Math.floor(parsed)))
}

export default function WeddingGiftCalculator() {
  const names = { closeness: useId(), step: useId() }
  const ids = {
    low: useId(),
    high: useId(),
    adults: useId(),
    children: useId(),
    childShare: useId(),
    adjust: useId(),
    family: useId(),
    close: useId(),
    friend: useId(),
    acquaintance: useId(),
  }

  const [closeness, setCloseness] = useState<ClosenessId>('friend')
  const [low, setLow] = useState(String(DEFAULT_COST_LOW))
  const [high, setHigh] = useState(String(DEFAULT_COST_HIGH))
  const [adults, setAdults] = useState('1')
  const [children, setChildren] = useState('0')
  const [childShare, setChildShare] = useState(String(DEFAULT_CHILD_SHARE))
  const [adjust, setAdjust] = useState('0')
  const [step, setStep] = useState('50')
  const [coverage, setCoverage] = useState<Record<ClosenessId, string>>({
    family: String(defaultCoverage().family),
    close: String(defaultCoverage().close),
    friend: String(defaultCoverage().friend),
    acquaintance: String(defaultCoverage().acquaintance),
  })

  const numeric = (value: string, fallback: number) => parseNumber(value) ?? fallback

  const input: GiftInput = {
    costLow: numeric(low, 0),
    costHigh: numeric(high, 0),
    adults: clampCount(adults, 0),
    children: clampCount(children, 0),
    childShare: Math.min(100, Math.max(0, numeric(childShare, DEFAULT_CHILD_SHARE))),
    adjustPercent: Math.min(50, Math.max(-50, numeric(adjust, 0))),
    step: (Number(step) as GiftInput['step']) || 50,
    coverage: {
      family: Math.max(0, numeric(coverage.family, 0)),
      close: Math.max(0, numeric(coverage.close, 0)),
      friend: Math.max(0, numeric(coverage.friend, 0)),
      acquaintance: Math.max(0, numeric(coverage.acquaintance, 0)),
    },
  }

  const valid = inputIsValid(input)
  const total = valid ? giftRange(input, closeness) : null
  const each = valid ? perPerson(input, closeness) : null
  const selected = closenessOptions.find((option) => option.id === closeness)

  return (
    <section className={ui.tool} aria-label="מחשבון סכום למעטפה בחתונה">
      <div className={ui.inner}>
        <form className={ui.form} onSubmit={(event) => event.preventDefault()}>
          <RadioTiles<ClosenessId>
            legend="הקרבה לזוג"
            name={names.closeness}
            options={closenessOptions}
            value={closeness}
            onChange={setCloseness}
          />

          <fieldset className={ui.group}>
            <legend className={ui.legend}>עלות המנה באולם</legend>
            <p className={ui.hint}>
              העלות מופיעה בדרך כלל בהזמנה או אצל הזוג. ערכי ההתחלה כאן להדגמה בלבד, ויש להחליף אותם.
            </p>
            <div className={styles.pair}>
              <NumberField
                id={ids.low}
                label="מחיר מנה מינימלי (ש״ח)"
                value={low}
                min={1}
                max={MAX_COST}
                onChange={setLow}
              />
              <NumberField
                id={ids.high}
                label="מחיר מנה מקסימלי (ש״ח)"
                value={high}
                min={1}
                max={MAX_COST}
                onChange={setHigh}
              />
            </div>
          </fieldset>

          <fieldset className={ui.group}>
            <legend className={ui.legend}>מי מגיע</legend>
            <div className={styles.pair}>
              <NumberField id={ids.adults} label="מבוגרים" value={adults} min={1} max={MAX_PEOPLE} step={1} onChange={setAdults} />
              <NumberField id={ids.children} label="ילדים" value={children} min={0} max={MAX_PEOPLE} step={1} onChange={setChildren} />
            </div>
          </fieldset>

          <details className={styles.details}>
            <summary>הנחות החישוב (אפשר לשנות)</summary>
            <div className={ui.group}>
              <p className={ui.hint}>
                האחוזים הם כלל אצבע שלנו, לא נתון מסקר. הם אומרים כמה מעלות המנה המעטפה מכסה לכל מבוגר.
              </p>
              <div className={styles.pair}>
                <NumberField
                  id={ids.family}
                  label="משפחה קרובה (%)"
                  value={coverage.family}
                  min={0}
                  onChange={(next) => setCoverage((current) => ({ ...current, family: next }))}
                />
                <NumberField
                  id={ids.close}
                  label="חברים קרובים (%)"
                  value={coverage.close}
                  min={0}
                  onChange={(next) => setCoverage((current) => ({ ...current, close: next }))}
                />
                <NumberField
                  id={ids.friend}
                  label="חברים וקולגות (%)"
                  value={coverage.friend}
                  min={0}
                  onChange={(next) => setCoverage((current) => ({ ...current, friend: next }))}
                />
                <NumberField
                  id={ids.acquaintance}
                  label="מכרים (%)"
                  value={coverage.acquaintance}
                  min={0}
                  onChange={(next) => setCoverage((current) => ({ ...current, acquaintance: next }))}
                />
                <NumberField
                  id={ids.childShare}
                  label="ילד נחשב כ- (% ממבוגר)"
                  value={childShare}
                  min={0}
                  max={100}
                  onChange={setChildShare}
                />
                <NumberField
                  id={ids.adjust}
                  label="התאמה אישית (% מינוס או פלוס)"
                  hint="למשל מינוס 10 אם הנסיעה ארוכה."
                  value={adjust}
                  min={-50}
                  max={50}
                  onChange={setAdjust}
                />
              </div>
              <RadioTiles
                legend="עיגול הסכום"
                name={names.step}
                options={roundingSteps}
                value={step}
                onChange={setStep}
              />
            </div>
          </details>
        </form>

        <div className={ui.output}>
          <h2 className={ui.outputTitle}>הסכום למעטפה</h2>
          {!valid || !total || !each ? (
            <p className={ui.note}>הזינו מחיר מנה חיובי ולפחות מבוגר אחד כדי לקבל סכום.</p>
          ) : (
            <div aria-live="polite">
              <p className={styles.resultLabel}>{selected?.label}</p>
              <p className={styles.result}>{formatRange(total)}</p>
              <p className={styles.resultLabel}>
                בממוצע לאדם: {formatRange(each)}
              </p>
              <div className={styles.tableWrap}>
                <table className={styles.table}>
                  <caption className={styles.srOnly}>סכום למעטפה לפי קרבה</caption>
                  <thead>
                    <tr>
                      <th scope="col">קרבה</th>
                      <th scope="col">סכום למעטפה</th>
                    </tr>
                  </thead>
                  <tbody>
                    {closenessOptions.map((option) => (
                      <tr key={option.id}>
                        <th scope="row">{option.label}</th>
                        <td>{formatRange(giftRange(input, option.id))}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
          <p className={ui.note}>
            זה כלל אצבע ולא חובה. הסכום תלוי בקשר, ביכולת שלכם ובמנהג במשפחה ובחברה שלכם. החישוב נעשה בדפדפן, ושום דבר
            לא נשלח.
          </p>
        </div>
      </div>
    </section>
  )
}
