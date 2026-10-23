'use client'

import { useEffect, useId, useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import { FALLBACK_USD_ILS, loadUsdIlsWithTimeout, type UsdIlsRate } from '@/lib/ai-prices'
import {
  API_PRICES_AS_OF,
  MAX_ANSWER_WORDS,
  MAX_MONTHLY_REQUESTS,
  MAX_TEXT_CHARS,
  answerTokens,
  apiModels,
  englishEquivalent,
  estimateTokens,
  formatIlsAmount,
  formatSmallUsd,
  formatTokens,
  providers,
  requestCost,
} from '@/lib/ai-tokens'
import { formatCount, formatFx, formatShortDate, parseCount, parseUsdIls } from '@/lib/whatsapp-api-cost'
import ui from './toolUi.module.css'
import styles from './AiTokenCalculator.module.css'

type Preset = { id: string; label: string; text: string; answerWords: string; requests: string }

const presets: Preset[] = [
  {
    id: 'whatsapp-bot',
    label: 'בוט שירות בוואטסאפ',
    text: 'אתה נציג שירות של מספרה בתל אביב. ענה בעברית, בקצרה ובנימוס. שעות הפתיחה: ראשון עד חמישי 9:00 עד 19:00, שישי עד 14:00. תספורת גברים 90 ₪, תספורת נשים 180 ₪. אם הלקוח רוצה לקבוע תור, בקש שם ותאריך מועדף. אם אינך יודע את התשובה, אמור שנציג יחזור אליו.\n\nלקוח: היי, יש לכם תור פנוי ביום שלישי אחרי הצהריים?',
    answerWords: '40',
    requests: '3,000',
  },
  {
    id: 'summary',
    label: 'סיכום פגישה',
    text: 'סכם את הפגישה בחמש נקודות: מה הוחלט, מי אחראי על כל משימה ועד מתי. כתוב בעברית, בלי הקדמה.\n\nבפגישה השתתפו דנה, יוסי ומיכל. הוחלט להעביר את האתר לשרת חדש עד סוף החודש, יוסי אחראי על ההעברה. מיכל תכין הצעת מחיר ללקוח החדש עד יום חמישי. דנה תבדוק את הקמפיין בגוגל ותציג תוצאות בפגישה הבאה. הוחלט גם לעבור לדיווח שבועי במקום חודשי.',
    answerWords: '120',
    requests: '200',
  },
]

const checkCount = (input: string, max: number, allowZero: boolean) => {
  const parsed = parseCount(input, max)
  if (parsed.ok && (allowZero || parsed.value > 0)) return { value: parsed.value, error: '' }
  if (!parsed.ok && parsed.reason === 'too-large') return { value: 0, error: `אפשר עד ${formatCount(max)}.` }
  return { value: 0, error: allowZero ? 'הקלידו מספר שלם, למשל 150.' : 'הקלידו מספר שלם, 1 או יותר.' }
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
  const describedBy = [hint ? `${id}-hint` : '', error ? `${id}-error` : ''].filter(Boolean).join(' ')
  return (
    <div className={ui.field}>
      <label htmlFor={id} className={ui.label}>
        {label}
      </label>
      <input
        id={id}
        className={`${ui.input} ${ui.ltr} ${styles.number}`}
        inputMode={inputMode}
        autoComplete="off"
        value={value}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy || undefined}
        onChange={(event) => onChange(event.target.value)}
      />
      {hint ? (
        <p id={`${id}-hint`} className={ui.hint}>
          {hint}
        </p>
      ) : null}
      {error ? (
        <p id={`${id}-error`} className={styles.error}>
          {error}
        </p>
      ) : null}
    </div>
  )
}

export default function AiTokenCalculator() {
  const [text, setText] = useState(presets[0].text)
  const [answerWords, setAnswerWords] = useState(presets[0].answerWords)
  const [requests, setRequests] = useState(presets[0].requests)
  const [fx, setFx] = useState(formatFx(FALLBACK_USD_ILS.rate))
  const [rateInfo, setRateInfo] = useState<UsdIlsRate>(FALLBACK_USD_ILS)
  const fxEdited = useRef(false)
  const textId = useId()

  useEffect(
    () =>
      loadUsdIlsWithTimeout((rate) => {
        setRateInfo(rate)
        if (!fxEdited.current) setFx(formatFx(rate.rate))
      }),
    [],
  )

  const estimate = useMemo(() => estimateTokens(text), [text])
  const english = useMemo(() => englishEquivalent(estimate, text), [estimate, text])
  const answer = checkCount(answerWords, MAX_ANSWER_WORDS, true)
  const monthly = checkCount(requests, MAX_MONTHLY_REQUESTS, false)
  const fxParsed = parseUsdIls(fx)
  const fxError = fxParsed.ok ? '' : `הקלידו שער כמו ${formatFx(rateInfo.rate)}.`
  const usdIls = fxParsed.ok ? fxParsed.value : rateInfo.rate
  const hasError = Boolean(answer.error || monthly.error || fxError)
  const outputTokens = answerTokens(answer.value)

  const rows = apiModels.map((model) => requestCost(model, estimate.tokens, outputTokens, monthly.value, usdIls))
  const cheapest = rows.reduce((best, row) => (row.usdPerMonth < best.usdPerMonth ? row : best), rows[0])
  const priciest = rows.reduce((best, row) => (row.usdPerMonth > best.usdPerMonth ? row : best), rows[0])
  const activePreset = presets.find((preset) => preset.text === text)
  const savedPercent = estimate.tokens > 0 ? Math.round((1 - english / estimate.tokens) * 100) : 0

  const applyPreset = (preset: Preset) => {
    setText(preset.text)
    setAnswerWords(preset.answerWords)
    setRequests(preset.requests)
  }

  const liveSummary =
    hasError || !estimate.tokens
      ? ''
      : `כ-${formatTokens(estimate.tokens)} טוקנים בטקסט. בחודש: מ-${formatIlsAmount(cheapest.ilsPerMonth)} ב-${
          cheapest.model.name
        } עד ${formatIlsAmount(priciest.ilsPerMonth)} ב-${priciest.model.name}.`

  return (
    <section className={ui.tool} aria-label="מחשבון טוקנים ועלות API">
      <div className={ui.inner}>
        <form className={ui.form} onSubmit={(event) => event.preventDefault()}>
          <fieldset className={ui.group}>
            <legend className={ui.legend}>מה שולחים למודל</legend>
            <div className={styles.presets} role="group" aria-label="מילוי לפי דוגמה">
              {presets.map((preset) => (
                <button
                  key={preset.id}
                  type="button"
                  className={styles.preset}
                  aria-pressed={activePreset?.id === preset.id}
                  onClick={() => applyPreset(preset)}
                >
                  {preset.label}
                </button>
              ))}
            </div>
            <div className={ui.field}>
              <label htmlFor={textId} className={ui.label}>
                הטקסט שנשלח למודל
              </label>
              <p id={`${textId}-hint`} className={ui.hint}>
                ההנחיות לבוט יחד עם ההודעה של הלקוח. הטקסט לא נשלח לשום מקום ונספר בדפדפן.
              </p>
              <textarea
                id={textId}
                className={`${ui.input} ${ui.textarea} ${styles.text}`}
                value={text}
                maxLength={MAX_TEXT_CHARS}
                aria-describedby={`${textId}-hint`}
                onChange={(event) => setText(event.target.value)}
              />
              <p className={styles.counts}>
                {formatCount(estimate.characters)} תווים, {formatCount(estimate.hebrewWords)} מילים בעברית,{' '}
                {formatCount(estimate.latinWords)} באנגלית
              </p>
            </div>
          </fieldset>

          <fieldset className={ui.group}>
            <legend className={ui.legend}>תשובה, כמות ושער</legend>
            <div className={styles.pair}>
              <NumberField
                label="אורך התשובה, במילים"
                hint="כמה מילים המודל כותב בתשובה אחת."
                value={answerWords}
                error={answer.error}
                inputMode="numeric"
                onChange={setAnswerWords}
              />
              <NumberField
                label="בקשות בחודש"
                hint="כמה פעמים שולחים את הטקסט למודל."
                value={requests}
                error={monthly.error}
                inputMode="numeric"
                onChange={setRequests}
              />
              <NumberField
                label="שער הדולר בשקלים"
                hint={`שער יציג של בנק ישראל ל-${formatShortDate(rateInfo.date)}.`}
                value={fx}
                error={fxError}
                inputMode="decimal"
                onChange={(value) => {
                  fxEdited.current = true
                  setFx(value)
                }}
              />
            </div>
          </fieldset>
        </form>

        <div className={ui.output}>
          <div className={ui.sticky}>
            <h2 className={ui.outputTitle}>טוקנים ועלות</h2>
            <p className={styles.srOnly} aria-live="polite" aria-atomic="true">
              {liveSummary}
            </p>
            <dl className={styles.totals}>
              <div className={styles.totalRow}>
                <dt className={styles.term}>טוקנים בטקסט, הערכה</dt>
                <dd className={styles.cell}>
                  <span className={styles.big}>{formatTokens(estimate.tokens)}</span>
                </dd>
              </div>
              {estimate.hebrewWords > 0 && english < estimate.tokens ? (
                <div className={styles.totalRow}>
                  <dt className={styles.term}>אותו תוכן באנגלית</dt>
                  <dd className={styles.cell}>
                    <span className={styles.value}>כ-{formatTokens(english)}</span>
                    <span className={styles.muted}>{savedPercent}% פחות טוקנים</span>
                  </dd>
                </div>
              ) : null}
              <div className={styles.totalRow}>
                <dt className={styles.term}>טוקנים בתשובה</dt>
                <dd className={styles.cell}>
                  <span className={styles.value}>{formatTokens(outputTokens)}</span>
                </dd>
              </div>
            </dl>

            {hasError ? (
              <p className={styles.empty}>תקנו את השדות המסומנים כדי לראות את העלות.</p>
            ) : (
              <div className={styles.tableWrap} role="region" aria-label="עלות לפי מודל" tabIndex={0}>
                <table className={styles.table}>
                  <caption className={styles.caption}>
                    עלות ל-{formatCount(monthly.value)} בקשות בחודש
                  </caption>
                  <thead>
                    <tr>
                      <th scope="col">מודל</th>
                      <th scope="col">לבקשה</th>
                      <th scope="col">לחודש</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((row) => (
                      <tr key={row.model.id}>
                        <th scope="row">
                          <span className={styles.modelName}>{row.model.name}</span>
                          <span className={styles.muted}>{providers[row.model.provider].name}</span>
                        </th>
                        <td>
                          <bdi>{formatSmallUsd(row.usdPerRequest)}</bdi>
                        </td>
                        <td>
                          <span className={styles.ils}>{formatIlsAmount(row.ilsPerMonth)}</span>
                          <bdi className={styles.muted}>{formatSmallUsd(row.usdPerMonth)}</bdi>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            <p className={ui.note}>
              המספר הוא הערכה לפי הטוקנייזר של OpenAI (o200k_base). ל-Claude ול-Gemini יש טוקנייזרים אחרים, והספירה
              אצלם יכולה להיות שונה. מחירים לפי עמודי התמחור הרשמיים מ-{formatShortDate(API_PRICES_AS_OF)}, לפני מע״מ.
              לבוט בוואטסאפ צריך להוסיף את התשלום ל-Meta, ב
              <Link href="/tools/whatsapp-api-cost-calculator" className={styles.link}>
                מחשבון העלות של WhatsApp API
              </Link>
              .
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
