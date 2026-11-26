import Link from 'next/link'
import { notFound } from 'next/navigation'
import ToolLayout, { toolMetadata, type ToolFaqEntry } from '../../../components/tools/ToolLayout'
import CurrencyConverter from '../../../components/tools/CurrencyConverter'
import {
  CURRENCY_HUB_PATH,
  RATES_SOURCE_URL,
  currencyPage,
  currencyPages,
  currencyPath,
  fetchIlsRates,
  formatMoney,
  headlineAmount,
  roundedShekels,
  shekelsPer,
  shortName,
  type CurrencyPage,
} from '@/lib/currency-pages'

export const revalidate = 3600
export const dynamicParams = false

export const generateStaticParams = () => currencyPages.map((page) => ({ slug: page.slug }))

type Params = { params: Promise<{ slug: string }> }

const amountLabel = (page: CurrencyPage) => {
  const amount = headlineAmount(page)
  return amount === 1 ? shortName(page) : `${amount} ${shortName(page)}`
}

const metaTitleOf = (page: CurrencyPage, shekels: number | null) =>
  shekels === null
    ? `כמה זה ${page.name} בשקלים היום? מחשבון המרה`
    : `${amountLabel(page)} לשקל: כ-${roundedShekels(headlineAmount(page) * shekels)} ₪ היום`

const descriptionOf = (page: CurrencyPage, shekels: number | null) => {
  if (shekels === null) {
    return `כמה שווה ${page.name} (${page.code}) בשקלים: מחשבון המרה בשני הכיוונים וטבלה לסכומים נפוצים, לפי שער אמצע שוק.`
  }
  const amount = headlineAmount(page)
  const what = amount === 1 ? page.name : `${amount.toLocaleString('he-IL')} ${page.name}`
  return `היום מקבלים כ-${roundedShekels(amount * shekels)} ₪ תמורת ${what}, ושקל אחד קונה ${formatMoney(1 / shekels)} ${page.code}. זה שער אמצע שוק: בבנק או בצ׳יינג׳ תקבלו קצת פחות. מחשבון בשני הכיוונים וטבלת סכומים.`
}

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
  const path = currencyPath(page.slug)
  const one = shekels === null ? null : formatMoney(shekels)
  const perShekel = shekels === null ? null : formatMoney(1 / shekels)

  const faq: ToolFaqEntry[] = [
    {
      id: `currency-${page.slug}-one`,
      question: `כמה זה ${page.name} אחד בשקלים?`,
      answer: one
        ? `לפי שער אמצע השוק העדכני${rates?.updated ? ` (${rates.updated})` : ''}, ${page.name} אחד שווה כ-${one} ₪, ושקל אחד שווה כ-${perShekel} ${page.code}. השער משתנה במהלך היום, והמחשבון בעמוד מתעדכן פעם ביום.`
        : 'השער מוצג במחשבון בעמוד ומתעדכן פעם ביום. כרגע מקור השערים לא זמין, נסו שוב בעוד כמה דקות.',
    },
    {
      id: `currency-${page.slug}-bank`,
      question: 'למה בבנק או בצ׳יינג׳ מקבלים פחות?',
      answer: `השער בעמוד הוא שער אמצע שוק, בלי עמלות. בנקים, חברות כרטיסי אשראי וצ׳יינג׳ים מוסיפים מרווח בין שער הקנייה לשער המכירה ולפעמים עמלה קבועה, ולכן בפועל מקבלים פחות ${page.code} לכל שקל. כדאי להשוות את השער שמציעים לכם לשער בעמוד ולראות כמה אחוזים הפער.`,
    },
    {
      id: `currency-${page.slug}-official`,
      question: 'מה ההבדל בין השער כאן לשער היציג של בנק ישראל?',
      answer:
        'בנק ישראל מפרסם שער יציג פעם ביום ל-14 מטבעות, והוא השער שמשמש לחשבוניות ולדיווח למס. השער כאן מגיע ממקור שערים בינלאומי, מכסה עוד מטבעות ומתעדכן פעם ביום. לחשבונית במטבע חוץ השתמשו בשער היציג.',
    },
  ]

  return (
    <ToolLayout
      path={path}
      rateDate={rates?.updated}
      title={`כמה זה ${page.name} בשקלים`}
      metaTitle={metaTitleOf(page, shekels)}
      description={descriptionOf(page, shekels)}
      lede={
        one
          ? `${page.name} אחד (${page.code}) שווה היום כ-${one} ₪. מקלידים כל סכום במחשבון ומקבלים את ההמרה מיד, בשני הכיוונים.`
          : `מקלידים סכום ב${page.name} ומקבלים את ההמרה לשקלים, בשני הכיוונים.`
      }
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

      <h2>מאיפה השער</h2>
      <p>
        השערים מגיעים מ-
        <a href={RATES_SOURCE_URL} rel="noopener" target="_blank">
          ExchangeRate-API
        </a>
        {rates?.updated ? `, עדכון אחרון ${rates.updated}` : ''}, ומתעדכנים בעמוד פעם בשעה. לשער היציג הרשמי לחשבוניות
        יש את <Link href="/tools/exchange-rate-invoice">מחשבון השער היציג של בנק ישראל</Link>.
      </p>

      <h2>מטבעות נוספים</h2>
      <ul>
        <li>
          <Link href={CURRENCY_HUB_PATH}>כל המטבעות בשקלים</Link>
        </li>
        {currencyPages
          .filter((other) => other.slug !== page.slug)
          .map((other) => (
            <li key={other.slug}>
              <Link href={currencyPath(other.slug)}>כמה זה {other.name} בשקלים</Link>
            </li>
          ))}
      </ul>
    </ToolLayout>
  )
}
