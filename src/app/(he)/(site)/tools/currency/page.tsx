import Link from 'next/link'
import ToolLayout, { toolMetadata, type ToolFaqEntry } from '../../components/tools/ToolLayout'
import CurrencyConverter from '../../components/tools/CurrencyConverter'
import { CURRENCY_HUB_PATH, currencyPages, currencyPath, fetchIlsRates, formatMoney, shekelsPer } from '@/lib/currency-pages'

export const revalidate = 3600

const TITLE = 'המרת מטבע לשקלים: 24 מטבעות'
const META_TITLE = 'המרת מטבע לשקלים היום: דולר, יורו, זלוטי, באט, וון ועוד'
const DESCRIPTION =
  'כמה זה בשקלים: שערי 24 מטבעות מול השקל, מתעדכנים כל שעה, עם מחשבון המרה לכל מטבע — דולר, יורו, זלוטי, וון, באט, גריבנה, דירהם, רופי ועוד.'

const faq: ToolFaqEntry[] = [
  {
    id: 'currency-hub-rate',
    question: 'איזה שער מוצג כאן?',
    answer:
      'שער אמצע שוק ממקור שערים בינלאומי, שמתעדכן בעמוד פעם בשעה. בבנק ובצ׳יינג׳ מקבלים שער פחות טוב בגלל מרווח ועמלות. לחשבוניות משתמשים בשער היציג של בנק ישראל.',
  },
]

export const metadata = toolMetadata({ path: CURRENCY_HUB_PATH, metaTitle: META_TITLE, description: DESCRIPTION })

export default async function CurrencyHubPage() {
  const rates = await fetchIlsRates()
  const usd = rates ? shekelsPer(rates, 'USD') : null
  return (
    <ToolLayout
      path={CURRENCY_HUB_PATH}
      title={TITLE}
      metaTitle={META_TITLE}
      description={DESCRIPTION}
      lede="בוחרים מטבע ורואים כמה הוא שווה בשקלים היום, עם מחשבון וטבלת המרה. השערים מתעדכנים כל שעה."
      chips={['24 מטבעות', 'מתעדכן כל שעה', 'בשני הכיוונים']}
      tool={<CurrencyConverter code="USD" name="דולר אמריקאי" shekels={usd} />}
      faq={faq}
      cta={{
        text: 'מוכרים ללקוחות בחו״ל? אנחנו בונים חנויות ואתרים רב-מטבעיים עם סליקה ומחירים בכל מטבע.',
        label: 'בניית חנות אונליין',
        href: '/services/ecommerce',
      }}
    >
      <h2>כמה זה בשקלים היום</h2>
      <table>
        <thead>
          <tr>
            <th scope="col">מטבע</th>
            <th scope="col">1 יחידה בשקלים</th>
          </tr>
        </thead>
        <tbody>
          {currencyPages.map((page) => {
            const shekels = rates ? shekelsPer(rates, page.code) : null
            return (
              <tr key={page.slug}>
                <td>
                  <Link href={currencyPath(page.slug)}>
                    {page.name} ({page.code})
                  </Link>
                </td>
                <td>{shekels === null ? '—' : `${formatMoney(shekels)} ₪`}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </ToolLayout>
  )
}
