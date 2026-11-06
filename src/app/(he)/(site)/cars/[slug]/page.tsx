import Link from 'next/link'
import { notFound } from 'next/navigation'
import Header from '../../components/Header'
import Footer from '../../components/Footer'
import Faq from '../../components/Faq'
import { ToolCrumbs, ToolHero } from '../../components/tools/ToolLayout'
import JsonLd from '@/components/seo/JsonLd'
import { pageMetadata } from '@/lib/metadata'
import { ORG_ID, breadcrumbList, faqPage, webPage } from '@/lib/schema'
import { SITE_URL } from '@/lib/seo'
import {
  CARS_HUB_PATH,
  CARS_HUB_TITLE,
  CAR_DATASETS,
  attach,
  CAR_DATA_DATE,
  carDescription,
  carFaq,
  carHeading,
  carName,
  carPageBySlug,
  carPagePath,
  carPages,
  carShortName,
  carTitle,
  formatKm,
  formatNumber,
  formatShare,
  formatShekels,
  formatThousands,
  fuelSentence,
  isElectric,
  isoToHebrewDate,
  licenceSentence,
  mileageSentences,
  modelName,
  neighboursSentence,
  originMeaning,
  originSentence,
  priceSentence,
  recallSentence,
  standoutsOf,
  summaryOf,
  type CarModelPage,
  type CarTrim,
  type MileageBin,
} from '@/lib/car-models'
import layout from '../../components/tools/ToolLayout.module.css'
import tables from '../../tools/word-counter/page.module.css'
import styles from '../cars.module.css'

export const dynamicParams = false

export const generateStaticParams = () => carPages.map(({ slug }) => ({ slug }))

type Params = { params: Promise<{ slug: string }> }

const LOOKUP_PATH = '/tools/vehicle-lookup'

export async function generateMetadata({ params }: Params) {
  const page = carPageBySlug((await params).slug)
  if (!page) return {}
  return pageMetadata({
    title: carTitle(page),
    description: carDescription(page),
    path: carPagePath(page.slug),
    type: 'article',
    modifiedTime: CAR_DATA_DATE,
  })
}

const binLabel = (bin: MileageBin) =>
  bin.to === null ? `${formatThousands(bin.from)} ומעלה` : `${bin.from / 1000} עד ${formatThousands(bin.to)}`

function MileageChart({ page }: { page: CarModelPage }) {
  const { bins, median, cars } = page.mileage
  const peak = Math.max(...bins.map((bin) => bin.cars))
  return (
    <figure className={styles.chart}>
      <figcaption>
        {carName(page)} לפי קילומטראז׳ בטסט האחרון, {formatNumber(cars)} רכבים
      </figcaption>
      <ol className={styles.chartRows}>
        {bins.map((bin) => {
          const holdsMedian = median >= bin.from && (bin.to === null || median < bin.to)
          return (
            <li key={bin.from} className={`${styles.chartRow} ${holdsMedian ? styles.chartRowMedian : ''}`}>
              <span className={styles.chartLabel}>{binLabel(bin)} ק״מ</span>
              <span className={styles.chartTrack} aria-hidden="true">
                <span className={styles.chartBar} style={{ inlineSize: `${(bin.cars / peak) * 100}%` }} />
              </span>
              <span className={styles.chartValue}>
                {formatShare(Math.round((bin.cars / cars) * 1000) / 10)} · {formatNumber(bin.cars)}
              </span>
            </li>
          )
        })}
      </ol>
      <p className={styles.chartNote}>הפס הכהה הוא הטווח שבו נמצא החציון, {formatKm(median)}.</p>
    </figure>
  )
}

function RecallList({ page }: { page: CarModelPage }) {
  return (
    <div className={styles.recalls}>
      {page.recalls.items.map((recall) => (
        <section key={recall.id} className={styles.recall} aria-labelledby={`recall-${recall.id}`}>
          <h3 id={`recall-${recall.id}`}>{recall.description || recall.category}</h3>
          <dl className={styles.recallMeta}>
            <dt>רכבים פתוחים</dt>
            <dd>{formatNumber(recall.cars)}</dd>
            <dt>סוג</dt>
            <dd>
              {recall.type}, {recall.category}
            </dd>
            {recall.fix ? (
              <>
                <dt>התיקון</dt>
                <dd>{recall.fix}</dd>
              </>
            ) : null}
            {recall.opened ? (
              <>
                <dt>נפתח</dt>
                <dd>{isoToHebrewDate(recall.opened)}</dd>
              </>
            ) : null}
            {recall.importer ? (
              <>
                <dt>היבואן</dt>
                <dd>
                  {recall.importer}
                  {recall.phone ? (
                    <>
                      , <span dir="ltr">{recall.phone}</span>
                    </>
                  ) : null}
                </dd>
              </>
            ) : null}
            <dt>מספר קריאה</dt>
            <dd>{recall.id}</dd>
          </dl>
        </section>
      ))}
    </div>
  )
}

const thousandsRange = (min: number, max: number) =>
  max - min >= 1000 ? `${Math.round(min / 1000)} עד ${Math.round(max / 1000)} אלף ש״ח` : `${Math.round(min / 1000)} אלף ש״ח`

type KeyFact = { value: string; label: string }

function keyFacts(page: CarModelPage): KeyFact[] {
  const { mileage, specs } = page
  const facts: KeyFact[] = [
    { value: formatNumber(page.activeCars), label: 'רכבים פעילים על הכביש' },
    { value: formatKm(mileage.median), label: 'חציון הקילומטראז׳ בטסט' },
    mileage.annualMedian
      ? { value: `כ-${formatKm(Math.round(mileage.annualMedian / 1000) * 1000)}`, label: 'נסיעה בשנה, בחציון' }
      : { value: formatShare(mileage.over150k), label: 'עברו 150 אלף ק״מ' },
    { value: formatShare(page.origins.leasing), label: 'התחילו בליסינג' },
  ]
  if (isElectric(page)) {
    facts.push({ value: 'חשמלי', label: 'בלי צריכת דלק' })
  } else if (specs.kmPerLitre) {
    facts.push({
      value: `${specs.kmPerLitre.typical.toLocaleString('he-IL')} ק״מ לליטר`,
      label: specs.nedcOnly ? 'צריכת דלק, תקן NEDC' : 'צריכת דלק, תקן WLTP',
    })
  }
  facts.push({ value: page.recalls.cars ? formatNumber(page.recalls.cars) : 'אין', label: 'ריקולים פתוחים' })
  if (specs.priceNew) {
    facts.push({ value: thousandsRange(specs.priceNew.min, specs.priceNew.max), label: 'מחיר מחירון כחדשה' })
  }
  return facts
}

const trimFuel = (trim: CarTrim) => {
  if (trim.electric) return 'חשמלי'
  if (trim.plugIn) return 'פלאג-אין'
  if (!trim.kmPerLitre) return 'אין נתון'
  return `${trim.kmPerLitre.toLocaleString('he-IL')}${trim.co2Standard === 'NEDC' ? ' (NEDC)' : ''}`
}

const DRIVE_LABELS: Record<string, string> = { 'היברידי רגיל': 'היברידי', 'רכב חשמלי': 'חשמלי' }

const trimMeta = (trim: CarTrim) =>
  [trim.body, DRIVE_LABELS[trim.drive] ?? (trim.drive === 'הנעה רגילה' ? '' : trim.drive)].filter(Boolean).join(' · ')

function mergedTrims(page: CarModelPage) {
  const merged = new Map<string, CarTrim>()
  for (const trim of page.specs.trims) {
    const key = [trim.finish, trim.body, trim.drive, trim.hp, trim.kmPerLitre, trim.priceMin].join('|')
    const known = merged.get(key)
    if (known) {
      known.cars += trim.cars
      known.share = Math.round(((known.share ?? 0) + (trim.share ?? 0)) * 10) / 10
    } else {
      merged.set(key, { ...trim })
    }
  }
  return [...merged.values()].sort((a, b) => b.cars - a.cars)
}

function TrimsTable({ page }: { page: CarModelPage }) {
  return (
    <div className={tables.tableWrap}>
      <table className={tables.table}>
        <caption>הגרסאות הנפוצות של {carShortName(page)}</caption>
        <thead>
          <tr>
            <th scope="col">גרסה</th>
            <th scope="col">כ״ס</th>
            <th scope="col">ק״מ לליטר</th>
            <th scope="col">מחיר כחדשה</th>
            <th scope="col">מהרכבים</th>
          </tr>
        </thead>
        <tbody>
          {mergedTrims(page).map((trim) => (
            <tr key={[trim.finish, trim.body, trim.drive, trim.hp, trim.kmPerLitre, trim.priceMin].join('|')}>
              <th scope="row">
                <span dir="ltr">{trim.finish || trim.name}</span>
                <span className={styles.trimMeta}>{trimMeta(trim)}</span>
              </th>
              <td className={tables.value}>{trim.hp ?? ''}</td>
              <td className={tables.value}>{trimFuel(trim)}</td>
              <td className={tables.value}>{trim.priceMin ? formatShekels(trim.priceMin) : 'אין נתון'}</td>
              <td className={tables.value}>{formatShare(trim.share)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function NeighboursTable({ page }: { page: CarModelPage }) {
  const rows = [
    ...page.neighbours,
    {
      year: page.year,
      activeCars: page.activeCars,
      medianKm: page.mileage.median,
      leasing: page.origins.leasing,
      recallShare: page.recalls.share,
      slug: page.slug,
    },
  ].sort((a, b) => a.year - b.year)
  return (
    <div className={tables.tableWrap}>
      <table className={tables.table}>
        <caption>{modelName(page)} לפי שנת ייצור</caption>
        <thead>
          <tr>
            <th scope="col">שנה</th>
            <th scope="col">רכבים פעילים</th>
            <th scope="col">חציון ק״מ</th>
            <th scope="col">מליסינג</th>
            <th scope="col">ריקול פתוח</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.year} className={row.year === page.year ? styles.current : undefined}>
              <th scope="row">
                {row.slug && row.year !== page.year ? (
                  <Link href={carPagePath(row.slug)}>{row.year}</Link>
                ) : (
                  row.year
                )}
              </th>
              <td className={tables.value}>{formatNumber(row.activeCars)}</td>
              <td className={tables.value}>{row.medianKm ? formatNumber(row.medianKm) : row.year > page.year ? 'לפני טסט' : 'אין נתון'}</td>
              <td className={tables.value}>{row.leasing === null ? 'אין נתון' : formatShare(row.leasing)}</td>
              <td className={tables.value}>{row.recallShare === null ? '' : formatShare(row.recallShare)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default async function CarModelPage({ params }: Params) {
  const page = carPageBySlug((await params).slug)
  if (!page) notFound()
  const path = carPagePath(page.slug)
  const name = carName(page)
  const short = carShortName(page)
  const title = carTitle(page)
  const heading = carHeading(page)
  const description = carDescription(page)
  const faq = carFaq(page)
  const standouts = standoutsOf(page)
  const faqJsonLd = faqPage({ path, entries: faq })
  const siblings = page.neighbours.filter((item) => item.slug)
  const others = carPages.filter((item) => item.slug !== page.slug && !siblings.some((sibling) => sibling.slug === item.slug))
  const [topFuel, secondFuel] = page.fuels
  const [topColour, secondColour] = page.colours

  return (
    <>
      <JsonLd data={webPage({ path, name: title, description, dateModified: CAR_DATA_DATE })} />
      <JsonLd
        data={breadcrumbList([
          { name: 'בית', path: '/' },
          { name: CARS_HUB_TITLE, path: CARS_HUB_PATH },
          { name, path },
        ])}
      />
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'Dataset',
          '@id': `${SITE_URL}${path}#dataset`,
          name: `${name}: נתוני קילומטראז׳, מקוריות, ריקולים ורישיון`,
          description: `${description} הנתונים מחושבים מהמאגרים הפתוחים של משרד התחבורה ב-data.gov.il לכל הרכבים הפעילים מדגם ${modelName(page)} עם שנת ייצור ${page.year}.`,
          url: `${SITE_URL}${path}`,
          inLanguage: 'he',
          dateModified: CAR_DATA_DATE,
          temporalCoverage: CAR_DATA_DATE,
          spatialCoverage: { '@type': 'Place', name: 'ישראל' },
          isAccessibleForFree: true,
          creator: { '@id': ORG_ID },
          publisher: { '@id': ORG_ID },
          isBasedOn: CAR_DATASETS.map((dataset) => dataset.url),
          variableMeasured: ['קילומטראז׳ בטסט האחרון', 'מקוריות: ליסינג, השכרה או פרטי', 'ריקולים פתוחים', 'תוקף רישיון', 'צריכת דלק לפי פליטת CO2', 'מחיר מחירון כחדש'],
          about: { '@type': 'Car', name: `${page.makeEn} ${page.modelEn}`, vehicleModelDate: String(page.year) },
        }}
      />
      {faqJsonLd ? <JsonLd data={faqJsonLd} /> : null}
      <Header />
      <main id="main-content" className={layout.page}>
        <ToolHero
          eyebrow="נתוני רכב"
          title={heading}
          lede={description}
          compact
          reviewed={CAR_DATA_DATE}
          reviewedLabel="נתוני משרד התחבורה"
        />
        <ToolCrumbs
          trail={[
            { label: 'בית', href: '/' },
            { label: CARS_HUB_TITLE, href: CARS_HUB_PATH },
            { label: name },
          ]}
        />

        <article className={layout.guide}>
          <p className={layout.guideLede}>
            <strong>בקצרה:</strong> {summaryOf(page)}
          </p>

          <h2>בדקו את הרכב הספציפי</h2>
          <p>
            הנתונים כאן מתארים את כל {formatNumber(page.activeCars)} {attach('ה', short)} הפעילות. לפני שקונים רכב מסוים, הכניסו את
            מספר הרישוי שלו ותראו את הקילומטראז׳ שנרשם בטסט, אם היה בליסינג או בהשכרה, ריקולים פתוחים, תוקף הטסט ומספר
            רישומי הבעלות.
          </p>
          <div className={`${layout.cta} ${styles.ctaBlock}`}>
            <p>בדיקה לפי מספר רישוי, בחינם וישירות ממאגרי משרד התחבורה.</p>
            <Link href={LOOKUP_PATH} className={layout.ctaLink}>
              בדיקת רכב לפי מספר רישוי
            </Link>
          </div>

          <h2>{short} במספרים</h2>
          <ul className={styles.keyFacts}>
            {keyFacts(page).map((fact) => (
              <li key={fact.label} className={styles.keyFact}>
                <span className={styles.keyFactValue}>{fact.value}</span>
                <span className={styles.keyFactLabel}>{fact.label}</span>
              </li>
            ))}
          </ul>

          {standouts.length > 1 ? (
            <>
              <h2>מה בולט {attach('ב', short)}</h2>
              <ul className={styles.standouts}>
                {standouts.map((item) => (
                  <li key={item} className={styles.standout}>
                    {item}
                  </li>
                ))}
              </ul>
            </>
          ) : null}

          <h2>כמה קילומטר יש {attach('ל', name)}</h2>
          <p>{mileageSentences(page)}</p>
          <MileageChart page={page} />
          <p>
            לשם השוואה, חצי מכל הרכבים הפעילים משנת {page.year} נמצאים בין {formatKm(page.fleet.p25Km)} ל-
            {formatKm(page.fleet.p75Km)}.
          </p>

          <h2>ליסינג, השכרה או פרטי: מאיפה הגיעו {attach('ה', short)}</h2>
          <p>{originSentence(page)}</p>
          <div className={tables.tableWrap}>
            <table className={tables.table}>
              <caption>מקוריות {attach('ה', short)}</caption>
              <thead>
                <tr>
                  <th scope="col">מקור</th>
                  <th scope="col">{short}</th>
                  <th scope="col">כל רכבי {page.year}</th>
                  <th scope="col">חציון ק״מ</th>
                </tr>
              </thead>
              <tbody>
                {(
                  [
                    ['ליסינג', 'leasing'],
                    ['השכרה', 'rental'],
                    ['פרטי מההתחלה', 'private'],
                  ] as const
                ).map(([label, key]) => (
                  <tr key={key}>
                    <th scope="row">{label}</th>
                    <td className={tables.value}>{formatShare(page.origins[key])}</td>
                    <td className={tables.value}>{formatShare(page.fleet.origins[key])}</td>
                    <td className={tables.value}>
                      {page.mileage.byOrigin[key] ? formatNumber(page.mileage.byOrigin[key].median) : 'מעט רכבים'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <h3>מה זה אומר למי שקונה יד שנייה</h3>
          <p>{originMeaning(page)}</p>

          <h2>{isElectric(page) ? `${name}: הנעה חשמלית וכוח מנוע` : `צריכת דלק של ${name}`}</h2>
          <p>{fuelSentence(page)}</p>
          {page.specs.trims.length ? <TrimsTable page={page} /> : null}
          <p>
            {isElectric(page)
              ? ''
              : 'החישוב: גרם CO2 לקילומטר שרשום לכל גרסה במאגר הדגמים של משרד התחבורה, כפול 100 וחלקי 2,392 גרם CO2 שנפלטים מליטר בנזין (2,640 לליטר דיזל). '}
            {page.specs.pollution
              ? `קבוצת הזיהום של הגרסאות היא ${
                  page.specs.pollution.min === page.specs.pollution.max
                    ? page.specs.pollution.min
                    : `${page.specs.pollution.min} עד ${page.specs.pollution.max}`
                }, בסולם 1 עד 15 שבו 1 הנקייה ביותר. `
              : ''}
            הטבלה מכסה {formatShare(page.specs.coveredShare)} {attach('מה', short)}. הגרסאות הנדירות לא מוצגות.
          </p>

          <h2>כמה עלתה {short} חדשה</h2>
          <p>{priceSentence(page)}</p>

          <h2>ריקולים פתוחים {attach('ל', name)}</h2>
          <p>{recallSentence(page)}</p>
          {page.recalls.items.length ? <RecallList page={page} /> : null}
          {page.recalls.cars ? (
            <p>
              הריקול פתוח אצל {formatShare(page.recalls.share)} בלבד {attach('מה', short)}, כי הוא נרשם לכל רכב בנפרד ונסגר
              אחרי התיקון אצל היבואן. בדקו את מספר הרישוי של הרכב שמוצע לכם כדי לדעת אם הוא ביניהם.
            </p>
          ) : null}

          <h2>טסט ורישיון בתוקף</h2>
          <p>{licenceSentence(page)}</p>
          <p>
            רכב עם רישיון שפג אסור לנהוג בו עד שיעבור טסט.
          </p>

          {page.neighbours.length ? (
            <>
              <h2>
                {modelName(page)} {page.year} מול השנים הסמוכות
              </h2>
              <p>{neighboursSentence(page)}</p>
              <NeighboursTable page={page} />
            </>
          ) : null}

          <h2>דלק, צבע ומדינת ייצור</h2>
          <p>
            {topFuel ? `${formatShare(topFuel.share)} ${attach('מה', short)} רשומות עם דלק מסוג ${topFuel.name}` : ''}
            {secondFuel ? ` ו-${formatShare(secondFuel.share)} עם ${secondFuel.name}` : ''}.{' '}
            {topColour ? `הצבע הנפוץ הוא ${topColour.name} (${formatShare(topColour.share)})` : ''}
            {secondColour ? `, אחריו ${secondColour.name} (${formatShare(secondColour.share)})` : ''}.{' '}
            {page.countries.length > 1
              ? `הרכבים יוצרו ב${page.countries.map((item) => `${item.name} (${formatShare(item.share)})`).join(', ב')}.`
              : page.countries[0]
                ? `כל הרכבים בשנתון יוצרו ב${page.countries[0].name}.`
                : ''}
          </p>

          <h2>איך חישבנו</h2>
          <p>
            הנתונים נלקחו ב-{isoToHebrewDate(CAR_DATA_DATE)} מהמאגרים הפתוחים של משרד התחבורה. בחרנו את כל הרכבים הפעילים
            שהיצרן שלהם {page.makeHe}, הכינוי המסחרי מתחיל ב-<span dir="ltr">{page.family}</span> ושנת הייצור {page.year}, בלי
            קשר למדינת הייצור או לרמת הגימור. הקילומטראז׳ הוא מה שנרשם בטסט האחרון של כל רכב, ונמצא ל-
            {formatNumber(page.mileage.cars)} מתוך {formatNumber(page.activeCars)} הרכבים. רכבים שעברו את הטסט לפני כמה חודשים
            נסעו מאז עוד. לכן המספרים היום מעט גבוהים יותר. המקוריות (ליסינג, השכרה או פרטי) היא הבעלות הראשונה שנרשמה
            ברכב, ונמצאה ל-{formatNumber(page.origins.cars)} רכבים. מאגר ההיסטוריה כולל רק רכבים שעלו לכביש מ-2017, ולכן
            שנים מוקדמות יותר מופיעות כאן בלי קילומטראז׳.
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
          <p>
            עוד דגמים: <Link href={CARS_HUB_PATH}>{CARS_HUB_TITLE}</Link>
            {siblings.length
              ? `. השנים הסמוכות של ${modelName(page)} מקושרות בטבלה למעלה`
              : ''}
            .
          </p>
          {others.length ? (
            <ul>
              {others.slice(0, 4).map((item) => (
                <li key={item.slug}>
                  <Link href={carPagePath(item.slug)}>{carName(item)}</Link>
                </li>
              ))}
            </ul>
          ) : null}
        </article>

        <Faq heading={['שאלות נפוצות', `על ${name}`]} entries={faq} />
      </main>
      <Footer />
    </>
  )
}
