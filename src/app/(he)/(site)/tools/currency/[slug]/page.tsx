import Link from 'next/link'
import { notFound } from 'next/navigation'
import ToolLayout, { toolMetadata, type ToolFaqEntry } from '../../../components/tools/ToolLayout'
import CurrencyConverter from '../../../components/tools/CurrencyConverter'
import {
  CURRENCY_HUB_PATH,
  LEV_PER_EURO,
  SNAPSHOT_SOURCE,
  currencyPage,
  currencyPages,
  currencyPath,
  fetchIlsHistory,
  fetchIlsRates,
  formatIsoDate,
  formatMoney,
  roundedShekels,
  shekelsPer,
  type CurrencyPage,
} from '@/lib/currency-pages'
import {
  ECB_LEV_URL,
  MIN_HISTORY_POINTS,
  NO_HISTORY,
  amountText,
  descriptionOf,
  extremes,
  historyAmount,
  historyRows,
  isFlat,
  levExchangeEntry,
  ledeOf,
  metaTitleOf,
  monthLabel,
  moreOrLess,
  percentText,
  relatedPages,
  representativeAnswer,
  yearAnswer,
  type HistoryRow,
} from '@/lib/currency-copy'

export const revalidate = 3600
export const dynamicParams = false

export const generateStaticParams = () => currencyPages.map((page) => ({ slug: page.slug }))

type Params = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Params) {
  const page = currencyPage((await params).slug)
  if (!page) return {}
  const rates = await fetchIlsRates()
  const shekels = rates ? shekelsPer(rates, page.code) : null
  return toolMetadata({
    path: currencyPath(page.slug),
    metaTitle: metaTitleOf(page, shekels),
    description: descriptionOf(page, shekels),
  })
}

export default async function CurrencyPageView({ params }: Params) {
  const page = currencyPage((await params).slug)
  if (!page) notFound()
  const rates = await fetchIlsRates()
  const shekels = rates ? shekelsPer(rates, page.code) : null
  const history = rates ? await fetchIlsHistory(rates.date) : NO_HISTORY
  const path = currencyPath(page.slug)
  const one = shekels === null ? null : formatMoney(shekels)
  const perShekel = shekels === null ? null : formatMoney(1 / shekels)
  const rows = shekels === null ? [] : historyRows(page, history)
  const amount = historyAmount(page)
  const year = yearAnswer(page, shekels, history)
  const source = rates?.source ?? SNAPSHOT_SOURCE

  const faq: ToolFaqEntry[] = [
    {
      id: `currency-${page.slug}-one`,
      question: `כמה זה ${page.name} אחד בשקלים?`,
      answer: one
        ? `לפי שער אמצע השוק${rates?.updated ? ` מ-${rates.updated}` : ''}, ${page.name} אחד שווה כ-${one} ₪, ושקל אחד שווה כ-${perShekel} ${page.code}. השער מתעדכן פעם ביום.`
        : 'השער מוצג במחשבון בעמוד ומתעדכן פעם ביום. כרגע מקור השערים לא זמין, נסו שוב בעוד כמה דקות.',
    },
    ...(year ? [{ id: `currency-${page.slug}-year`, question: `כמה עלו ${amountText(page, amount)} לפני שנה?`, answer: year }] : []),
    {
      id: `currency-${page.slug}-official`,
      question: `יש ל${page.name} שער יציג של בנק ישראל?`,
      answer: representativeAnswer(page),
    },
    ...(page.code === 'BGN' ? [levExchangeEntry] : []),
  ]

  return (
    <ToolLayout
      path={path}
      rateDate={rates?.updated}
      title={`כמה זה ${page.name} בשקלים`}
      metaTitle={metaTitleOf(page, shekels)}
      description={descriptionOf(page, shekels)}
      lede={ledeOf(page, shekels, history)}
      chips={[one ? `1 ${page.code} ≈ ${one} ₪` : page.code, 'מתעדכן פעם ביום', page.country]}
      tool={<CurrencyConverter code={page.code} name={page.name} shekels={shekels} />}
      faq={faq}
      cta={{
        text: 'מוכרים ללקוחות בחו״ל? אנחנו בונים חנויות ואתרים רב-מטבעיים עם סליקה ומחירים בכל מטבע.',
        label: 'בניית חנות אונליין',
        href: '/services/ecommerce',
      }}
    >
      {shekels !== null ? (
        <>
          <h2>טבלת המרה: {page.name} לשקלים</h2>
          <table>
            <thead>
              <tr>
                <th scope="col">{page.code}</th>
                <th scope="col">₪</th>
              </tr>
            </thead>
            <tbody>
              {page.samples.map((sample) => (
                <tr key={sample}>
                  <td>{formatMoney(sample)}</td>
                  <td>{formatMoney(sample * shekels)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <h2>טבלת המרה: שקלים ל{page.name}</h2>
          <table>
            <thead>
              <tr>
                <th scope="col">₪</th>
                <th scope="col">{page.code}</th>
              </tr>
            </thead>
            <tbody>
              {[1, 10, 50, 100, 500, 1000].map((sample) => (
                <tr key={sample}>
                  <td>{formatMoney(sample)}</td>
                  <td>{formatMoney(sample / shekels)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      ) : null}

      {shekels !== null && rows.length >= MIN_HISTORY_POINTS ? (
        <HistorySection page={page} shekels={shekels} rows={rows} amount={amount} />
      ) : null}

      {page.code === 'BGN' ? <LevSection /> : null}

      <h2>מאיפה השער</h2>
      <p>
        השערים מגיעים מ-
        <a href={source.href} rel="noopener" target="_blank">
          {source.label}
        </a>
        {rates?.updated ? `, עדכון אחרון ${rates.updated}` : ''}, ומתעדכנים פעם ביום. גם שערי העבר בעמוד מאותו מקור. לשער
        היציג הרשמי לחשבוניות יש את <Link href="/tools/exchange-rate-invoice">מחשבון השער היציג של בנק ישראל</Link>.
      </p>

      <h2>מטבעות קרובים</h2>
      <ul>
        {relatedPages(page).map((other) => (
          <li key={other.slug}>
            <Link href={currencyPath(other.slug)}>כמה זה {other.name} בשקלים</Link>
          </li>
        ))}
        <li>
          <Link href={CURRENCY_HUB_PATH}>כל 24 המטבעות בשקלים</Link>
        </li>
      </ul>
    </ToolLayout>
  )
}

function HistorySection({ page, shekels, rows, amount }: { page: CurrencyPage; shekels: number; rows: HistoryRow[]; amount: number }) {
  const { high, low } = extremes(rows)
  const now = amount * shekels
  const newestFirst = [...rows].reverse()
  return (
    <>
      <h2>{amountText(page, amount)} בשקלים בשנה האחרונה</h2>
      <p>
        השער בתחילת כל חודש, מהחדש לישן. הגבוה ביותר בטבלה: {roundedShekels(high.shekels)} ₪ בתחילת {monthLabel(high.date)}.
        הנמוך ביותר: {roundedShekels(low.shekels)} ₪ בתחילת {monthLabel(low.date)}. היום: {roundedShekels(now)} ₪. אלה שערי
        עבר, לא תחזית.
      </p>
      <table>
        <thead>
          <tr>
            <th scope="col">תאריך</th>
            <th scope="col">{amountText(page, amount)} בשקלים</th>
            <th scope="col">מול היום</th>
          </tr>
        </thead>
        <tbody>
          {newestFirst.map((row) => (
            <tr key={row.date}>
              <td>{formatIsoDate(row.date)}</td>
              <td>{formatMoney(row.shekels)} ₪</td>
              <td>{isFlat(now, row.shekels) ? 'כמעט זהה' : `היום ${percentText(now, row.shekels)}% ${moreOrLess(now, row.shekels)}`}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  )
}

function LevSection() {
  return (
    <>
      <h2>הלב הוחלף ביורו</h2>
      <p>
        בולגריה הצטרפה לגוש האירו ב-1 בינואר 2026. בינואר אפשר היה לשלם במזומן בשני המטבעות, ומ-1 בפברואר 2026 רק היורו הוא
        הילך חוקי. חשבונות בנק בלב הומרו ליורו לפי השער הקבוע, {LEV_PER_EURO} לב ליורו, ולכן השער של הלב מול השקל זז בדיוק
        כמו היורו. לטיסה לבולגריה צריך <Link href={currencyPath('eur')}>יורו</Link>, לא לב.
      </p>
      <p>
        הפרטים על החלפת שטרות ישנים:{' '}
        <a href={ECB_LEV_URL} rel="noopener" target="_blank">
          הבנק המרכזי האירופי, מעבר בולגריה ליורו
        </a>
        .
      </p>
    </>
  )
}
