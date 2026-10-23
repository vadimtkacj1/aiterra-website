'use client'

import { useEffect, useId, useRef, useState } from 'react'
import {
  FALLBACK_USD_ILS,
  MAX_SEATS,
  PRICES_AS_OF,
  WORKDAYS_PER_MONTH,
  formatIls,
  formatIlsExact,
  formatPlanUsd,
  loadUsdIlsWithTimeout,
  localPriceFor,
  planCost,
  plansOf,
  vendors,
  type Billing,
  type UsdIlsRate,
  type VendorId,
} from '@/lib/ai-prices'
import { formatCount, formatFx, formatShortDate, parseCount, parseUsdIls } from '@/lib/whatsapp-api-cost'
import ui from './toolUi.module.css'
import styles from './AiSubscriptionPrices.module.css'

type VendorFilter = VendorId | 'all'

const billingOptions: { value: Billing; label: string }[] = [
  { value: 'monthly', label: 'חיוב חודשי' },
  { value: 'annual', label: 'חיוב שנתי' },
]

export default function AiSubscriptionPrices() {
  const [vendor, setVendor] = useState<VendorFilter>('all')
  const [billing, setBilling] = useState<Billing>('monthly')
  const [seats, setSeats] = useState('1')
  const [fx, setFx] = useState(formatFx(FALLBACK_USD_ILS.rate))
  const [rateInfo, setRateInfo] = useState<UsdIlsRate>(FALLBACK_USD_ILS)
  const fxEdited = useRef(false)
  const seatsId = useId()
  const fxId = useId()
  const billingName = useId()

  useEffect(
    () =>
      loadUsdIlsWithTimeout((rate) => {
        setRateInfo(rate)
        if (!fxEdited.current) setFx(formatFx(rate.rate))
      }),
    [],
  )

  const seatsParsed = parseCount(seats, MAX_SEATS)
  const seatsError =
    seatsParsed.ok && seatsParsed.value > 0
      ? ''
      : !seatsParsed.ok && seatsParsed.reason === 'too-large'
        ? `אפשר עד ${formatCount(MAX_SEATS)} משתמשים.`
        : 'הקלידו מספר שלם, 1 או יותר.'
  const seatCount = seatsParsed.ok && seatsParsed.value > 0 ? seatsParsed.value : 1

  const fxParsed = parseUsdIls(fx)
  const fxError = fxParsed.ok ? '' : `הקלידו שער כמו ${formatFx(rateInfo.rate)}.`
  const usdIls = fxParsed.ok ? fxParsed.value : rateInfo.rate

  const rows = plansOf(vendor).map((plan) => planCost(plan, billing, usdIls, seatCount))
  const hasError = Boolean(seatsError || fxError)
  const anyFallback = billing === 'annual' && rows.some((row) => row.annualFallback)
  const cheapest = rows.reduce((best, row) => (row.ilsPerSeatMonth < best.ilsPerSeatMonth ? row : best), rows[0])

  const liveSummary = hasError
    ? ''
    : `${rows.length} מסלולים, ${billing === 'annual' ? 'חיוב שנתי' : 'חיוב חודשי'}, ${formatCount(seatCount)} ${
        seatCount === 1 ? 'משתמש' : 'משתמשים'
      }. הזול ביותר: ${cheapest.plan.name}, ${formatIls(cheapest.ilsTeamMonth)} בחודש.`

  return (
    <section className={ui.tool} aria-label="השוואת מחירי מנויי AI בשקלים">
      <div className={ui.inner}>
        <form className={ui.form} onSubmit={(event) => event.preventDefault()}>
          <fieldset className={ui.group}>
            <legend className={ui.legend}>איזה כלי</legend>
            <div className={styles.chips} role="group" aria-label="סינון לפי כלי">
              <button
                type="button"
                className={styles.chip}
                aria-pressed={vendor === 'all'}
                onClick={() => setVendor('all')}
              >
                הכול
              </button>
              {vendors.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  className={styles.chip}
                  aria-pressed={vendor === item.id}
                  onClick={() => setVendor(item.id)}
                >
                  {item.name}
                </button>
              ))}
            </div>
          </fieldset>

          <fieldset className={ui.group}>
            <legend className={ui.legend}>איך משלמים</legend>
            <div className={ui.options}>
              {billingOptions.map((option) => (
                <label key={option.value} className={ui.option}>
                  <input
                    type="radio"
                    className={ui.checkbox}
                    name={billingName}
                    value={option.value}
                    checked={billing === option.value}
                    onChange={() => setBilling(option.value)}
                  />
                  {option.label}
                </label>
              ))}
            </div>
          </fieldset>

          <fieldset className={ui.group}>
            <legend className={ui.legend}>כמה משתמשים ובאיזה שער</legend>
            <div className={styles.pair}>
              <div className={ui.field}>
                <label htmlFor={seatsId} className={ui.label}>
                  מספר משתמשים
                </label>
                <input
                  id={seatsId}
                  className={`${ui.input} ${ui.ltr} ${styles.number}`}
                  inputMode="numeric"
                  autoComplete="off"
                  value={seats}
                  aria-invalid={seatsError ? true : undefined}
                  aria-describedby={seatsError ? `${seatsId}-error` : undefined}
                  onChange={(event) => setSeats(event.target.value)}
                />
                {seatsError ? (
                  <p id={`${seatsId}-error`} className={styles.error}>
                    {seatsError}
                  </p>
                ) : null}
              </div>
              <div className={ui.field}>
                <label htmlFor={fxId} className={ui.label}>
                  שער הדולר בשקלים
                </label>
                <input
                  id={fxId}
                  className={`${ui.input} ${ui.ltr} ${styles.number}`}
                  inputMode="decimal"
                  autoComplete="off"
                  value={fx}
                  aria-invalid={fxError ? true : undefined}
                  aria-describedby={`${fxId}-hint${fxError ? ` ${fxId}-error` : ''}`}
                  onChange={(event) => {
                    fxEdited.current = true
                    setFx(event.target.value)
                  }}
                />
                <p id={`${fxId}-hint`} className={ui.hint}>
                  שער יציג של בנק ישראל ל-{formatShortDate(rateInfo.date)}.
                </p>
                {fxError ? (
                  <p id={`${fxId}-error`} className={styles.error}>
                    {fxError}
                  </p>
                ) : null}
              </div>
            </div>
          </fieldset>
        </form>

        <div className={ui.output}>
          <div className={ui.sticky}>
            <h2 className={ui.outputTitle}>
              {seatCount === 1 ? 'המחיר בשקלים' : `המחיר ל-${formatCount(seatCount)} משתמשים`}
            </h2>
            <p className={styles.srOnly} aria-live="polite" aria-atomic="true">
              {liveSummary}
            </p>
            {hasError ? (
              <p className={styles.empty}>תקנו את השדות המסומנים כדי לראות את המחירים.</p>
            ) : (
              <div className={styles.tableWrap} role="region" aria-label="מחירי המסלולים" tabIndex={0}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th scope="col">מסלול</th>
                      <th scope="col">לחודש</th>
                      <th scope="col">{seatCount === 1 ? 'לשנה' : 'לצוות בחודש'}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((row) => {
                      const local = localPriceFor(row.plan, billing)
                      return (
                        <tr key={row.plan.id}>
                          <th scope="row">
                            <span className={styles.planName}>{row.plan.name}</span>
                            <span className={styles.planNote}>
                              {row.plan.perSeat ? 'למשתמש' : 'מנוי אישי'}
                              {row.annualFallback ? ', חודשי בלבד' : ''}
                            </span>
                          </th>
                          <td>
                            <span className={styles.ils}>{formatIls(row.ilsPerSeatMonth)}</span>
                            <bdi className={styles.usd}>{formatPlanUsd(row.usdPerSeatMonth)}</bdi>
                            {local !== null ? (
                              <span className={styles.local}>בישראל: {formatIlsExact(local)}</span>
                            ) : null}
                          </td>
                          <td>
                            <span className={styles.ils}>
                              {formatIls(seatCount === 1 ? row.ilsPerSeatYear : row.ilsTeamMonth)}
                            </span>
                            {seatCount > 1 ? (
                              <span className={styles.local}>לשנה: {formatIls(row.ilsTeamYear)}</span>
                            ) : null}
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            )}
            {!hasError ? (
              <p className={styles.line}>
                הזול ביותר בבחירה: {cheapest.plan.name}, כ-{formatIlsExact(cheapest.ilsPerWorkday)} לעובד ליום עבודה
                (לפי {WORKDAYS_PER_MONTH} ימי עבודה בחודש).
              </p>
            ) : null}
            {anyFallback ? (
              <p className={styles.line}>במסלולים שמסומנים ״חודשי בלבד״ היצרן לא מפרסם מחיר שנתי, ומוצג המחיר החודשי.</p>
            ) : null}
            <p className={ui.note}>
              המחירים בדולרים לפי עמודי התמחור של היצרנים, נכון ל-{formatShortDate(PRICES_AS_OF)}, והשקלים לפי השער
              שבשדה. ״בישראל״ הוא המחיר בשקלים ש-OpenAI מציגה לחשבון ישראלי.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
