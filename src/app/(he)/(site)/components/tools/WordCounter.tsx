'use client'

import { useEffect, useId, useMemo, useState, type ChangeEvent } from 'react'
import Link from 'next/link'
import { CircleCheck, Copy, Eraser, Scissors, TriangleAlert, Undo2 } from 'lucide-react'
import {
  ENGLISH_ALOUD_WPM,
  ENGLISH_SILENT_WPM,
  HEBREW_ALOUD_WPM,
  HEBREW_SILENT_WPM,
  countHashtags,
  countMentions,
  countNiqqud,
  displayToken,
  formatDuration,
  formatNumber,
  keywordDensity,
  measureLimit,
  removeNiqqud,
  textLimits,
  textStats,
  type LimitResult,
  type LimitStatus,
  type TextLimit,
} from '@/lib/word-counter'
import ui from './toolUi.module.css'
import styles from './WordCounter.module.css'

const ANNOUNCE_DELAY_MS = 1200

const statusLabel: Record<LimitStatus, string> = {
  empty: '',
  fits: 'נכנס',
  close: 'קרוב לגבול',
  over: 'חורג',
}

const kindLabel: Record<TextLimit['kind'], string> = {
  max: 'מגבלה',
  recommended: 'המלצה',
  estimate: 'הערכה',
}

const plural = (count: number, one: string, many: string) => (count === 1 ? one : `${formatNumber(count)} ${many}`)

const percentFormat = new Intl.NumberFormat('he-IL', { style: 'percent', maximumFractionDigits: 1 })

function limitText(limit: TextLimit, result: LimitResult) {
  if (limit.method === 'sms' && result.sms) {
    const { sms } = result
    const messages = plural(sms.segments, 'הודעה אחת', 'הודעות')
    return `${formatNumber(sms.units)} תווים, ${messages} (${sms.encoding})`
  }
  if (limit.kind === 'recommended') {
    const range = limit.min ? `${formatNumber(limit.min)} עד ${formatNumber(limit.limit)}` : `עד ${formatNumber(limit.limit)}`
    return `${plural(result.used, 'תו אחד', 'תווים')}, מומלץ ${range}`
  }
  return `${formatNumber(result.used)} מתוך ${formatNumber(limit.limit)}`
}

function statusIcon(status: LimitStatus, sms: boolean) {
  if (status === 'fits') return CircleCheck
  if (status === 'over' && sms) return Scissors
  return TriangleAlert
}

function LimitRow({ limit, text }: { limit: TextLimit; text: string }) {
  const result = measureLimit(text, limit)
  const capacity = limit.method === 'sms' && result.sms ? result.sms.perSegment * result.sms.segments : limit.limit
  const ratio = Math.min(1, result.used / capacity)
  const StatusIcon = statusIcon(result.status, limit.method === 'sms')
  const hashtags = limit.hashtags !== undefined ? countHashtags(text) : 0
  const mentions = limit.mentions !== undefined ? countMentions(text) : 0
  const label =
    limit.method === 'sms' && result.status === 'over'
      ? 'יותר מהודעה אחת'
      : limit.kind === 'recommended' && result.status === 'over'
        ? 'ארוך מההמלצה'
        : statusLabel[result.status]
  return (
    <li className={styles.limit} data-status={result.status}>
      <div className={styles.limitHead}>
        <span className={styles.limitName}>
          {limit.label}
          {limit.kind !== 'max' ? <span className={styles.kind}>{kindLabel[limit.kind]}</span> : null}
        </span>
        <span className={styles.limitCount}>{limitText(limit, result)}</span>
      </div>
      <span className={styles.bar} aria-hidden="true">
        <span className={styles.barFill} style={{ inlineSize: `${ratio * 100}%` }} />
      </span>
      {result.status !== 'empty' || limit.link ? (
        <div className={styles.limitFoot}>
          {result.status !== 'empty' ? (
            <span className={styles.limitStatus}>
              <StatusIcon aria-hidden="true" />
              {label}
            </span>
          ) : null}
          {limit.hashtags !== undefined && hashtags ? (
            <span className={styles.limitExtra}>
              האשטגים: {formatNumber(hashtags)} מתוך {limit.hashtags}
            </span>
          ) : null}
          {limit.mentions !== undefined && mentions ? (
            <span className={styles.limitExtra}>
              תיוגים: {formatNumber(mentions)} מתוך {limit.mentions}
            </span>
          ) : null}
          {limit.link ? (
            <Link href={limit.link.href} className={styles.limitLink}>
              {limit.link.label}
            </Link>
          ) : null}
        </div>
      ) : null}
    </li>
  )
}

export default function WordCounter() {
  const [text, setText] = useState('')
  const [previous, setPrevious] = useState<string | null>(null)
  const [status, setStatus] = useState('')
  const [announcement, setAnnouncement] = useState('')
  const textId = useId()
  const assumptionsId = useId()

  const stats = useMemo(() => textStats(text), [text])
  const keywords = useMemo(() => keywordDensity(text), [text])
  const niqqud = useMemo(() => countNiqqud(text), [text])

  const summary = text.trim()
    ? `${plural(stats.words, 'מילה אחת', 'מילים')}, ${plural(stats.characters, 'תו אחד', 'תווים')}`
    : ''

  useEffect(() => {
    if (!summary) return
    const timer = window.setTimeout(() => setAnnouncement(summary), ANNOUNCE_DELAY_MS)
    return () => window.clearTimeout(timer)
  }, [summary])

  const onText = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setText(event.target.value)
    setPrevious(null)
    setStatus('')
  }

  const stripNiqqud = () => {
    if (!niqqud) {
      setStatus('אין ניקוד בטקסט.')
      return
    }
    setPrevious(text)
    setText(removeNiqqud(text))
    setStatus(`הניקוד הוסר: ${plural(niqqud, 'סימן אחד', 'סימנים')}.`)
  }

  const undo = () => {
    if (previous === null) return
    setText(previous)
    setPrevious(null)
    setStatus('הטקסט חזר למצב שלפני הסרת הניקוד.')
  }

  const copy = async () => {
    if (!text.trim()) {
      setStatus('אין טקסט להעתקה.')
      return
    }
    try {
      await navigator.clipboard.writeText(text)
      setStatus('הטקסט הועתק.')
      window.gtag?.('event', 'word_counter_copy', { niqqud_removed: previous !== null })
    } catch {
      setStatus('ההעתקה נכשלה. סמנו את הטקסט בשדה והעתיקו ידנית.')
    }
  }

  const clear = () => {
    setText('')
    setPrevious(null)
    setStatus('הטקסט נמחק.')
  }

  const statRows: { term: string; value: string }[] = [
    { term: 'מילים', value: formatNumber(stats.words) },
    { term: 'תווים כולל רווחים', value: formatNumber(stats.characters) },
    { term: 'תווים בלי רווחים', value: formatNumber(stats.charactersNoSpaces) },
    { term: 'משפטים', value: formatNumber(stats.sentences) },
    { term: 'פסקאות', value: formatNumber(stats.paragraphs) },
    { term: 'זמן קריאה', value: formatDuration(stats.readingSeconds) },
    { term: 'זמן הקראה בקול', value: formatDuration(stats.speakingSeconds) },
  ]

  return (
    <section className={ui.tool} aria-label="ספירת מילים ותווים">
      <div className={`${ui.inner} ${styles.inner}`}>
        <form className={ui.form} onSubmit={(event) => event.preventDefault()}>
          <div className={`${ui.group} ${styles.textGroup}`}>
            <label htmlFor={textId} className={ui.legend}>
              הטקסט שלכם
            </label>
            <textarea
              id={textId}
              className={`${ui.input} ${ui.textarea} ${styles.text}`}
              dir="auto"
              spellCheck
              value={text}
              onChange={onText}
            />
            <div className={styles.actions}>
              <button type="button" className={ui.primary} onClick={copy}>
                <Copy aria-hidden="true" />
                העתקת הטקסט
              </button>
              <button type="button" className={ui.secondary} onClick={stripNiqqud}>
                <Eraser aria-hidden="true" />
                הסרת ניקוד
              </button>
              {previous !== null ? (
                <button type="button" className={ui.secondary} onClick={undo}>
                  <Undo2 aria-hidden="true" />
                  ביטול
                </button>
              ) : null}
              <button type="button" className={styles.clear} onClick={clear}>
                מחיקת הטקסט
              </button>
            </div>
            <p className={ui.status} role="status" aria-live="polite">
              {status}
            </p>
            <p className={ui.note}>הטקסט נספר בדפדפן שלכם. הוא לא נשמר ולא נשלח לשום מקום.</p>
          </div>
        </form>

        <div className={ui.output}>
          <h2 className={ui.outputTitle}>הספירה</h2>
          <dl className={styles.stats} aria-describedby={assumptionsId}>
            {statRows.map((row) => (
              <div key={row.term} className={styles.stat}>
                <dt className={styles.statTerm}>{row.term}</dt>
                <dd className={styles.statValue}>{row.value}</dd>
              </div>
            ))}
          </dl>
          <p id={assumptionsId} className={ui.note}>
            זמן הקריאה מחושב לפי {HEBREW_SILENT_WPM} מילים בדקה בעברית ו-{ENGLISH_SILENT_WPM} באנגלית, וזמן ההקראה
            בקול לפי {HEBREW_ALOUD_WPM} ו-{ENGLISH_ALOUD_WPM}. אלה ממוצעים ממחקרים על קוראים מבוגרים, והקצב שלכם יכול
            להיות אחר.
          </p>

          <h3 className={styles.subTitle}>אורך מול המגבלות של הרשתות</h3>
          <ul className={styles.limits}>
            {textLimits.map((limit) => (
              <LimitRow key={limit.id} limit={limit} text={text} />
            ))}
          </ul>

          {keywords.length ? (
            <>
              <h3 className={styles.subTitle}>המילים שחוזרות הכי הרבה</h3>
              <table className={styles.keywords}>
                <caption className={styles.srOnly}>המילים שחוזרות הכי הרבה, בלי מילות קישור</caption>
                <thead>
                  <tr>
                    <th scope="col">מילה</th>
                    <th scope="col">פעמים</th>
                    <th scope="col">מתוך כל המילים</th>
                  </tr>
                </thead>
                <tbody>
                  {keywords.map((row) => (
                    <tr key={row.word}>
                      <th scope="row">
                        <bdi>{displayToken(row.word)}</bdi>
                      </th>
                      <td>{formatNumber(row.count)}</td>
                      <td>{percentFormat.format(row.share)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p className={ui.note}>
                בלי מילות קישור כמו ״של״, ״את״ ו״גם״. מילה עם אות שימוש, כמו ״האתר״ ו״אתר״, נספרת בנפרד.
              </p>
            </>
          ) : null}

          <p className={styles.srOnly} role="status" aria-live="polite">
            {announcement}
          </p>
        </div>
      </div>
    </section>
  )
}
