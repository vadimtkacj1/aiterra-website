import Link from 'next/link'
import Header from '../components/Header'
import Footer from '../components/Footer'
import Faq from '../components/Faq'
import { ToolCrumbs, ToolHero } from '../components/tools/ToolLayout'
import JsonLd from '@/components/seo/JsonLd'
import { pageMetadata } from '@/lib/metadata'
import { breadcrumbList, faqPage, webPage } from '@/lib/schema'
import { SITE_URL } from '@/lib/seo'
import {
  CARS_HUB_PATH,
  CARS_HUB_TITLE,
  CAR_DATASETS,
  CAR_DATA_DATE,
  NATIONAL_FLEET,
  carName,
  carPagePath,
  carPages,
  formatNumber,
  formatShare,
  isoToHebrewDate,
} from '@/lib/car-models'
import layout from '../components/tools/ToolLayout.module.css'
import tables from '../tools/word-counter/page.module.css'
import styles from './cars.module.css'

const META_TITLE = 'רכבים יד שנייה לפי דגם ושנה: קילומטראז׳ וליסינג'
const DESCRIPTION = `קילומטראז׳ בטסט, שיעור הרכבים שהגיעו מליסינג וריקולים פתוחים ל-${carPages.length} הדגמים והשנים הנפוצים בישראל, מחושבים מנתוני משרד התחבורה.`

export const metadata = pageMetadata({ title: META_TITLE, description: DESCRIPTION, path: CARS_HUB_PATH })

const byLeasing = [...carPages].sort((a, b) => (b.origins.leasing ?? 0) - (a.origins.leasing ?? 0))
const mostLeased = byLeasing[0]
const leastLeased = byLeasing[byLeasing.length - 1]

const faq = [
  {
    id: 'cars-hub-which',
    question: 'אילו דגמים יש כאן?',
    answer: `${carPages.length} השילובים הנפוצים ביותר של דגם ושנת ייצור בין הרכבים הפעילים בישראל, שלרובם כבר נרשם קילומטראז׳ בטסט. לכל אחד יש לפחות ${formatNumber(Math.min(...carPages.map((page) => page.activeCars)))} רכבים על הכביש.`,
  },
  {
    id: 'cars-hub-leasing',
    question: 'באיזה דגם הכי הרבה רכבים מליסינג?',
    answer: mostLeased && leastLeased
      ? `מבין הדגמים ברשימה, ${carName(mostLeased)} מוביל עם ${formatShare(mostLeased.origins.leasing)} רכבים שהתחילו בליסינג. בצד השני, רק ${formatShare(leastLeased.origins.leasing)} מה-${carName(leastLeased)} הגיעו מליסינג.`
      : '',
  },
  {
    id: 'cars-hub-source',
    question: 'מאיפה הנתונים?',
    answer: `מהמאגרים הפתוחים של משרד התחבורה ב-data.gov.il, כפי שהורדו ב-${isoToHebrewDate(CAR_DATA_DATE)}: רישום הרכבים הפעילים, היסטוריית הרכב עם הקילומטראז׳ בטסט האחרון, והריקולים הפתוחים.`,
  },
]

export default function CarsHubPage() {
  const faqJsonLd = faqPage({ path: CARS_HUB_PATH, entries: faq })
  return (
    <>
      <JsonLd
        data={webPage({
          path: CARS_HUB_PATH,
          name: META_TITLE,
          description: DESCRIPTION,
          type: 'CollectionPage',
          dateModified: CAR_DATA_DATE,
        })}
      />
      <JsonLd
        data={breadcrumbList([
          { name: 'בית', path: '/' },
          { name: CARS_HUB_TITLE, path: CARS_HUB_PATH },
        ])}
      />
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'ItemList',
          '@id': `${SITE_URL}${CARS_HUB_PATH}#list`,
          itemListElement: carPages.map((page, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            name: carName(page),
            url: `${SITE_URL}${carPagePath(page.slug)}`,
          })),
        }}
      />
      {faqJsonLd ? <JsonLd data={faqJsonLd} /> : null}
      <Header />
      <main id="main-content" className={layout.page}>
        <ToolHero
          eyebrow="נתוני רכב"
          title={CARS_HUB_TITLE}
          lede={DESCRIPTION}
          compact
          reviewed={CAR_DATA_DATE}
          reviewedLabel="נתוני משרד התחבורה"
        />
        <ToolCrumbs trail={[{ label: 'בית', href: '/' }, { label: CARS_HUB_TITLE }]} />

        <article className={layout.guide}>
          <p className={layout.guideLede}>
            כמה קילומטר סביר לרכב בן כמה שנים, כמה מהשנתון עבר בליסינג והאם יש לו ריקולים פתוחים. כל דף מחושב מכל הרכבים
            הפעילים מאותו דגם ושנה, מתוך {formatNumber(NATIONAL_FLEET.activeCars)} רכבים פרטיים ומסחריים שרשומים היום
            בישראל.
          </p>
          <div className={tables.tableWrap}>
            <table className={tables.table}>
              <caption>הדגמים והשנים הנפוצים ביותר</caption>
              <thead>
                <tr>
                  <th scope="col">דגם ושנה</th>
                  <th scope="col">רכבים פעילים</th>
                  <th scope="col">חציון ק״מ</th>
                  <th scope="col">מליסינג</th>
                </tr>
              </thead>
              <tbody>
                {carPages.map((page) => (
                  <tr key={page.slug}>
                    <th scope="row">
                      <Link href={carPagePath(page.slug)}>{carName(page)}</Link>
                    </th>
                    <td className={tables.value}>{formatNumber(page.activeCars)}</td>
                    <td className={tables.value}>{formatNumber(page.mileage.median)}</td>
                    <td className={tables.value}>{formatShare(page.origins.leasing)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h2>איך לקרוא את הנתונים</h2>
          <p>
            הקילומטראז׳ הוא מה שנרשם בטסט האחרון של כל רכב, והחציון הוא הנקודה שחצי מהרכבים מתחתיה וחצי מעליה. ״מליסינג״
            הוא שיעור הרכבים שהבעלות הראשונה שלהם הייתה חברת ליסינג. רכבים משנות ייצור שבהן רוב הרכבים עוד לא עברו טסט, או
            שלא נרשם להם קילומטראז׳ במאגר, לא נכללו.
          </p>
          <p>
            לרכב מסוים, עם הקילומטראז׳ שלו, תוקף הטסט והריקולים שלו, יש{' '}
            <Link href="/tools/vehicle-lookup">בדיקת רכב לפי מספר רישוי</Link>.
          </p>
          <ul className={styles.sources}>
            {CAR_DATASETS.map((dataset) => (
              <li key={dataset.resource}>
                <a href={dataset.url} target="_blank" rel="noopener">
                  {dataset.name}
                </a>
              </li>
            ))}
          </ul>
        </article>

        <Faq heading={['שאלות נפוצות', 'על נתוני הרכבים']} entries={faq} />
      </main>
      <Footer />
    </>
  )
}
