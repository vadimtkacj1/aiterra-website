'use client'

import { useId, useMemo, useState } from 'react'
import {
  CATEGORIES,
  CATEGORY_INFO,
  DEFAULT_USD_ILS,
  MAX_MONTHLY_MESSAGES,
  MAX_PHONE_NUMBERS,
  MAX_PROVIDER_FEE_SHEKELS,
  META_RATES,
  RATES_AS_OF,
  SCENARIOS,
  SECOND_MARKETS,
  calculateCost,
  formatCount,
  formatFx,
  formatRate,
  formatShekels,
  formatShortDate,
  formatUsd,
  parseCount,
  parsePercentBp,
  parseShekelsToAgorot,
  parseUsdIls,
  resultToText,
  type CostInput,
  type MarketId,
  type MessageCategory,
  type Parsed,
} from '@/lib/whatsapp-api-cost'
import ui from './toolUi.module.css'
import styles from './WhatsAppApiCostCalculator.module.css'

type CountInputs = Record<MessageCategory, string>

type Checked = { value: number; error: string }

const RATE_CARD_URL = 'https://developers.facebook.com/docs/whatsapp/pricing#rate-cards'

const toInputs = (counts: Record<MessageCategory, number>): CountInputs => ({
  marketing: counts.marketing ? counts.marketing.toLocaleString('en-US') : '',
  utility: counts.utility ? counts.utility.toLocaleString('en-US') : '',
  authentication: counts.authentication ? counts.authentication.toLocaleString('en-US') : '',
  service: counts.service ? counts.service.toLocaleString('en-US') : '',
})

const checkCount = (input: string): Checked => {
  const parsed = parseCount(input)
  if (parsed.ok) return { value: parsed.value, error: '' }
  if (parsed.reason === 'empty') return { value: 0, error: '' }
  if (parsed.reason === 'too-large') return { value: 0, error: `אפשר עד ${formatCount(MAX_MONTHLY_MESSAGES)} הודעות.` }
  return { value: 0, error: 'הקלידו מספר שלם, למשל 1,500.' }
}

const checkPhones = (input: string): Checked => {
  const parsed = parseCount(input, MAX_PHONE_NUMBERS)
  if (parsed.ok && parsed.value > 0) return { value: parsed.value, error: '' }
  if (!parsed.ok && parsed.reason === 'too-large') return { value: 1, error: `אפשר עד ${formatCount(MAX_PHONE_NUMBERS)} מספרים.` }
  return { value: 1, error: 'הקלידו מספר שלם, 1 או יותר.' }
}

const checkPercent = (input: string, required: boolean): Checked => {
  const parsed: Parsed = parsePercentBp(input)
  if (parsed.ok) return { value: parsed.value, error: '' }
  if (parsed.reason === 'empty' && !required) return { value: 0, error: '' }
  return { value: 0, error: 'הקלידו אחוז בין 0 ל-100.' }
}

const checkFx = (input: string): Checked => {
  const parsed = parseUsdIls(input)
  if (parsed.ok) return { value: parsed.value, error: '' }
  if (parsed.reason === 'empty') return { value: DEFAULT_USD_ILS.rate, error: 'הקלידו את שער הדולר בשקלים.' }
  return { value: DEFAULT_USD_ILS.rate, error: `הקלידו שער כמו ${formatFx(DEFAULT_USD_ILS.rate)}.` }
}

const checkFee = (input: string): Checked => {
  const parsed = parseShekelsToAgorot(input)
  if (parsed.ok) return { value: parsed.value, error: '' }
  if (parsed.reason === 'empty') return { value: 0, error: '' }
  if (parsed.reason === 'too-large') {
    return { value: 0, error: `אפשר עד ${formatCount(MAX_PROVIDER_FEE_SHEKELS)} ₪.` }
  }
  return { value: 0, error: 'הקלידו סכום בשקלים, למשל 250.' }
}

function NumberField({
  label,
  hint,
  value,
  error,
  inputMode,
  onChange,
}: {
  label: string
  hint?: string
  value: string
  error: string
  inputMode: 'numeric' | 'decimal'
  onChange: (value: string) => void
}) {
  const id = useId()
  const hintId = `${id}-hint`
  const errorId = `${id}-error`
  const describedBy = [hint ? hintId : '', error ? errorId : ''].filter(Boolean).join(' ')

  return (
    <div className={ui.field}>
      <label htmlFor={id} className={ui.label}>
        {label}
      </label>
      {hint ? (
        <p id={hintId} className={ui.hint}>
          {hint}
        </p>
      ) : null}
      <input
        id={id}
        className={`${ui.input} ${ui.ltr} ${styles.number}`}
        inputMode={inputMode}
        autoComplete="off"
        spellCheck={false}
        value={value}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy || undefined}
        onChange={(event) => onChange(event.target.value)}
      />
      {error ? (
        <p id={errorId} className={styles.error}>
          {error}
        </p>
      ) : null}
    </div>
  )
}

export default function WhatsAppApiCostCalculator() {
  const [counts, setCounts] = useState<CountInputs>(() => toInputs(SCENARIOS[0].counts))
  const [secondMarket, setSecondMarket] = useState<MarketId | ''>('')
  const [secondShare, setSecondShare] = useState('20')
  const [phones, setPhones] = useState('1')
  const [freeEntry, setFreeEntry] = useState('0')
  const [fx, setFx] = useState(formatFx(DEFAULT_USD_ILS.rate))
  const [fee, setFee] = useState('')
  const [status, setStatus] = useState('')
  const marketId = useId()

  const checkedCounts = useMemo(
    () =>
      Object.fromEntries(CATEGORIES.map((category) => [category, checkCount(counts[category])])) as Record<
        MessageCategory,
        Checked
      >,
    [counts],
  )
  const phonesChecked = checkPhones(phones)
  const freeEntryChecked = checkPercent(freeEntry, false)
  const shareChecked = checkPercent(secondShare, true)
  const fxChecked = checkFx(fx)
  const feeChecked = checkFee(fee)

  const hasError =
    CATEGORIES.some((category) => checkedCounts[category].error) ||
    Boolean(phonesChecked.error || freeEntryChecked.error || fxChecked.error || feeChecked.error) ||
    Boolean(secondMarket && shareChecked.error)

  const input: CostInput = {
    counts: {
      marketing: checkedCounts.marketing.value,
      utility: checkedCounts.utility.value,
      authentication: checkedCounts.authentication.value,
      service: checkedCounts.service.value,
    },
    phoneNumbers: phonesChecked.value,
    freeEntryShareBp: freeEntryChecked.value,
    secondMarket: secondMarket || null,
    secondMarketShareBp: secondMarket ? shareChecked.value : 0,
    usdIls: fxChecked.value,
    providerFeeAgorot: feeChecked.value,
  }

  const result = hasError ? null : calculateCost(input)
  const visibleLines = result ? result.lines.filter((line) => line.sent > 0) : []
  const freeLines = visibleLines.filter((line) => line.free > 0)

  const activeScenario = SCENARIOS.find((scenario) =>
    CATEGORIES.every((category) => checkedCounts[category].value === scenario.counts[category]),
  )

  const applyScenario = (index: number) => {
    setCounts(toInputs(SCENARIOS[index].counts))
    setStatus('')
  }

  const copy = async () => {
    if (!result) {
      setStatus('תקנו את השדות המסומנים כדי להעתיק.')
      return
    }
    try {
      await navigator.clipboard.writeText(resultToText(result, input))
      setStatus('הפירוט הועתק')
      window.gtag?.('event', 'wa_api_cost_copy', {
        total_ils: result.totalAgorot / 100,
        messages: result.sent,
        second_market: input.secondMarket ?? 'none',
      })
    } catch {
      setStatus('ההעתקה נכשלה. סמנו את הטקסט והעתיקו ידנית.')
    }
  }

  const liveSummary = result
    ? `תשלום ל-Meta: ${formatShekels(result.metaAgorot)} בחודש${
        result.providerAgorot > 0 ? `, ועם דמי הספק ${formatShekels(result.totalAgorot)}` : ''
      }.`
    : ''

  return (
    <section className={ui.tool} aria-label="חישוב העלות החודשית">
      <div className={ui.inner}>
        <form className={ui.form} onSubmit={(event) => event.preventDefault()}>
          <fieldset className={ui.group}>
            <legend className={ui.legend}>כמה הודעות העסק שולח בחודש</legend>
            <div className={styles.presets} role="group" aria-label="מילוי לפי עסק לדוגמה">
              <span className={styles.presetsLabel} aria-hidden="true">
                לדוגמה:
              </span>
              {SCENARIOS.map((scenario, index) => (
                <button
                  key={scenario.id}
                  type="button"
                  className={styles.preset}
                  aria-pressed={activeScenario?.id === scenario.id}
                  onClick={() => applyScenario(index)}
                >
                  {scenario.label}
                </button>
              ))}
            </div>
            <div className={styles.pair}>
              {CATEGORIES.map((category) => (
                <NumberField
                  key={category}
                  label={`${CATEGORY_INFO[category].name} (${CATEGORY_INFO[category].english})`}
                  hint={CATEGORY_INFO[category].hint}
                  value={counts[category]}
                  error={checkedCounts[category].error}
                  inputMode="numeric"
                  onChange={(value) => setCounts((current) => ({ ...current, [category]: value }))}
                />
              ))}
            </div>
          </fieldset>

          <fieldset className={ui.group}>
            <legend className={ui.legend}>לאן נשלחות ההודעות</legend>
            <div className={ui.field}>
              <label htmlFor={marketId} className={ui.label}>
                נמענים מחוץ לישראל
              </label>
              <select
                id={marketId}
                className={`${ui.input} ${styles.select}`}
                value={secondMarket}
                onChange={(event) => setSecondMarket(event.target.value as MarketId | '')}
              >
                <option value="">אין, כל הנמענים בישראל</option>
                {SECOND_MARKETS.map((id) => (
                  <option key={id} value={id}>
                    {META_RATES.markets[id].label}
                  </option>
                ))}
              </select>
            </div>
            {secondMarket ? (
              <div className={styles.pair}>
                <NumberField
                  label="אחוז ההודעות שנשלחות לשם"
                  value={secondShare}
                  error={shareChecked.error}
                  inputMode="decimal"
                  onChange={setSecondShare}
                />
                <p className={styles.marketRates}>
                  תעריף שם: שיווק <bdi>{formatRate(META_RATES.markets[secondMarket].rates.marketing)}</bdi>, שאר
                  הסוגים <bdi>{formatRate(META_RATES.markets[secondMarket].rates.utility)}</bdi> להודעה.
                </p>
              </div>
            ) : null}
          </fieldset>

          <fieldset className={ui.group}>
            <legend className={ui.legend}>הודעות חינם, שער וספק</legend>
            <div className={styles.pair}>
              <NumberField
                label="מספרי טלפון עסקיים"
                hint={`לכל מספר ${formatCount(META_RATES.freeServicePerNumber)} הודעות שירות חינם בחודש.`}
                value={phones}
                error={phonesChecked.error}
                inputMode="numeric"
                onChange={setPhones}
              />
              <NumberField
                label="אחוז ההודעות לפונים ממודעה"
                hint={`מי שכתב לכם ממודעה שמובילה לוואטסאפ: ${META_RATES.freeEntryWindowDays} ימים בלי חיוב.`}
                value={freeEntry}
                error={freeEntryChecked.error}
                inputMode="decimal"
                onChange={setFreeEntry}
              />
              <NumberField
                label="שער הדולר בשקלים"
                hint={`שער יציג של בנק ישראל ל-${formatShortDate(DEFAULT_USD_ILS.date)}.`}
                value={fx}
                error={fxChecked.error}
                inputMode="decimal"
                onChange={setFx}
              />
              <NumberField
                label="דמי ספק בחודש, בשקלים"
                hint="אם אתם עובדים דרך ספק (BSP) שגובה מנוי. לפי ההצעה שלו."
                value={fee}
                error={feeChecked.error}
                inputMode="decimal"
                onChange={setFee}
              />
            </div>
          </fieldset>
        </form>

        <div className={ui.output}>
          <div className={ui.sticky}>
            <h2 className={ui.outputTitle}>העלות לחודש</h2>
            <p className={styles.srOnly} aria-live="polite" aria-atomic="true">
              {liveSummary}
            </p>
            {result ? (
              <>
                <dl className={styles.totals}>
                  <div className={styles.totalRow}>
                    <dt className={styles.term}>תשלום ל-Meta</dt>
                    <dd className={styles.cell}>
                      <span className={styles.big}>{formatShekels(result.metaAgorot)}</span>
                      <bdi className={styles.usd}>{formatUsd(result.metaUsdCents)}</bdi>
                    </dd>
                  </div>
                  {result.providerAgorot > 0 ? (
                    <>
                      <div className={styles.totalRow}>
                        <dt className={styles.term}>דמי ספק</dt>
                        <dd className={styles.cell}>
                          <span className={styles.value}>{formatShekels(result.providerAgorot)}</span>
                        </dd>
                      </div>
                      <div className={styles.totalRow}>
                        <dt className={styles.term}>סך הכול לחודש</dt>
                        <dd className={styles.cell}>
                          <span className={styles.big}>{formatShekels(result.totalAgorot)}</span>
                        </dd>
                      </div>
                    </>
                  ) : null}
                  {result.perThousand ? (
                    <div className={styles.totalRow}>
                      <dt className={styles.term}>לכל 1,000 הודעות</dt>
                      <dd className={styles.cell}>
                        <span className={styles.value}>{formatShekels(result.perThousand.agorot)}</span>
                        <bdi className={styles.usd}>{formatUsd(result.perThousand.usdCents)}</bdi>
                      </dd>
                    </div>
                  ) : null}
                </dl>

                {visibleLines.length ? (
                  <div className={styles.tableWrap} role="region" aria-label="פירוט לפי סוג הודעה" tabIndex={0}>
                    <table className={styles.table}>
                      <caption className={styles.caption}>פירוט לפי סוג הודעה</caption>
                      <thead>
                        <tr>
                          <th scope="col">סוג</th>
                          <th scope="col">בתשלום</th>
                          <th scope="col">דולר</th>
                          <th scope="col">שקלים</th>
                        </tr>
                      </thead>
                      <tbody>
                        {visibleLines.map((line) => (
                          <tr key={line.category}>
                            <th scope="row">{CATEGORY_INFO[line.category].name}</th>
                            <td>{formatCount(line.billable)}</td>
                            <td>{formatUsd(line.usdCents)}</td>
                            <td>{formatShekels(line.agorot)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className={styles.empty}>הקלידו כמה הודעות נשלחות בחודש.</p>
                )}

                {freeLines.length ? (
                  <p className={styles.line}>
                    לא חויבו:{' '}
                    {freeLines
                      .map((line) => `${formatCount(line.free)} הודעות ${CATEGORY_INFO[line.category].name}`)
                      .join(', ')}
                    .
                  </p>
                ) : null}

                {result.volumeTierCategories.length ? (
                  <p className={styles.warning}>
                    מעל {formatCount(META_RATES.israelVolumeTierAbove.utility)} הודעות עדכונים או{' '}
                    {formatCount(META_RATES.israelVolumeTierAbove.authentication)} הודעות אימות בחודש לישראל, Meta
                    מורידה את התעריף לפי מדרגות נפח. החישוב כאן לפי מחיר המחירון, ולכן החשבון בפועל יהיה נמוך יותר.
                  </p>
                ) : null}
              </>
            ) : (
              <p className={styles.empty}>תקנו את השדות המסומנים כדי לראות את העלות.</p>
            )}

            <div className={ui.actions}>
              <button type="button" className={ui.primary} onClick={copy}>
                העתקת הפירוט
              </button>
            </div>
            <p className={ui.status} role="status" aria-live="polite">
              {status}
            </p>
            <p className={ui.note}>
              תעריפים לנמען בישראל: שיווק <bdi>{formatRate(META_RATES.markets.IL.rates.marketing)}</bdi>, עדכונים,
              אימות ושירות <bdi>{formatRate(META_RATES.markets.IL.rates.utility)}</bdi> להודעה. נכון ל-
              {formatShortDate(RATES_AS_OF)}, לפי{' '}
              <a href={RATE_CARD_URL} target="_blank" rel="noopener" className={styles.link}>
                כרטיס התעריפים של Meta
              </a>
              . המחירים לפני מע״מ: לפי Meta, מס שחל מופיע בחשבונית, ולכן בדקו בחשבונית שלכם או של הספק.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
