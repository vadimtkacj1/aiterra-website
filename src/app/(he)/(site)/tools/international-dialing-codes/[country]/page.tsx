import Link from 'next/link'
import { notFound } from 'next/navigation'
import ToolLayout, { toolMetadata, type ToolFaqEntry } from '../../../components/tools/ToolLayout'
import {
  DIALING_HUB_PATH,
  countryNoteOf,
  dialingCountryBySlug,
  dialingCountryPages,
  dialingCountryPath,
  droppedPart,
  nanpMembers,
  sharedWith,
  trunkLabel,
  trunkRuleText,
  withPreposition,
  type DialingCountryPage,
} from '@/lib/dialing-country-pages'
import { ISRAELI_INTERNATIONAL_PREFIXES } from '@/lib/international-dialing-codes'
import { timeInPath } from '@/lib/time-in-cities'
import styles from '../../word-counter/page.module.css'

export const dynamicParams = false

export const generateStaticParams = () => dialingCountryPages.map(({ slug }) => ({ country: slug }))

type Params = { params: Promise<{ country: string }> }

const PHONE_FORMAT_PATH = '/tools/israeli-phone-format'

const sources = [
  { label: 'Wikipedia: Trunk prefix, לפי ITU-T E.164', href: 'https://en.wikipedia.org/wiki/Trunk_prefix' },
  { label: 'ITU: תקן E.164 וקודי המדינות שהוקצו', href: 'https://www.itu.int/pub/T-SP-E.164D' },
  { label: 'ויקיפדיה בעברית: קידומת טלפון בינלאומית', href: 'https://he.wikipedia.org/wiki/קידומת_טלפון_בינלאומית' },
]

const metaTitleOf = (page: DialingCountryPage) =>
  `קידומת ${page.country.name}: +${page.country.digits} ואיך מחייגים ${withPreposition('ל', page.country.name)}`

const answerOf = (page: DialingCountryPage) =>
  `הקידומת של ${page.country.name} היא +${page.country.digits}. מישראל מחייגים 00-${page.country.digits} ואחריו ${droppedPart[page.trunk]}.`

const descriptionOf = (page: DialingCountryPage) =>
  `${answerOf(page)} מנייד מקלידים +${page.country.digits}. איך שומרים מספר בוואטסאפ ומה עושים עם הקידומת הארצית.`

const sharedText = (page: DialingCountryPage) => {
  if (page.trunk === 'nanp') {
    return `הקידומת 1 משותפת לארצות הברית, לקנדה ול-${nanpMembers().length} מדינות וטריטוריות נוספות, בעיקר באיים הקריביים. כל אחת מהן מזוהה לפי קידומת האזור בת 3 הספרות שאחרי ה-1.`
  }
  const others = sharedWith(page)
  if (others.length === 0) return ''
  return `הקידומת +${page.country.digits} משותפת ל${page.country.name} ול${others.map((item) => item.name).join(', ')}. את המדינה מזהים לפי הספרות שאחרי הקידומת.`
}

export async function generateMetadata({ params }: Params) {
  const page = dialingCountryBySlug((await params).country)
  if (!page) return {}
  return toolMetadata({
    path: dialingCountryPath(page.slug),
    metaTitle: metaTitleOf(page),
    description: descriptionOf(page),
  })
}

export default async function DialingCountryRoute({ params }: Params) {
  const page = dialingCountryBySlug((await params).country)
  if (!page) notFound()
  const { name, digits, english } = page.country
  const toCountry = withPreposition('ל', name)
  const shared = sharedText(page)
  const note = countryNoteOf(page)
  const others = dialingCountryPages.filter((item) => item.slug !== page.slug)
  const carriers = ISRAELI_INTERNATIONAL_PREFIXES.filter((row) => row.prefix !== '00')

  const facts: [string, React.ReactNode][] = [
    ['קידומת המדינה', <bdi key="code" dir="ltr">+{digits}</bdi>],
    ['מקו קווי בישראל', <bdi key="landline" dir="ltr">00-{digits}-…</bdi>],
    ['מנייד ובוואטסאפ', <bdi key="mobile" dir="ltr">+{digits} …</bdi>],
    ['מה מקלידים אחרי הקידומת', droppedPart[page.trunk]],
    ['קידומת ארצית בתוך המדינה', trunkLabel[page.trunk]],
    ['שם המדינה באנגלית', <span key="en" dir="ltr">{english}</span>],
    [
      'הפרש שעות מישראל',
      page.timeIn ? (
        <Link key="time" href={timeInPath(page.timeIn.slug)}>
          מה השעה {page.timeIn.inPlace}
        </Link>
      ) : (
        <Link key="time" href="/tools/time-difference-israel">
          מחשבון הפרש שעות
        </Link>
      ),
    ],
  ]

  const faq: ToolFaqEntry[] = [
    {
      id: `dial-${page.slug}-code`,
      question: `מה הקידומת של ${name}?`,
      answer: `${answerOf(page)} ${trunkRuleText(page)}`,
    },
    {
      id: `dial-${page.slug}-reverse`,
      question: `קידומת +${digits} של איזו מדינה?`,
      answer: shared || `+${digits} היא הקידומת הבינלאומית של ${name} (${english}). אם קיבלתם שיחה ממספר שמתחיל ב-+${digits}, היא הגיעה מ${name} או ממספר שרשום שם.`,
    },
    {
      id: `dial-${page.slug}-whatsapp`,
      question: `איך שומרים מספר מ${name} בוואטסאפ?`,
      answer: `באנשי הקשר שומרים את המספר עם +${digits} ואחריו ${droppedPart[page.trunk]}. וואטסאפ מזהה את המדינה לפי הקידומת, ומספר שנשמר בלי + לא יופיע באפליקציה.`,
    },
  ]

  return (
    <ToolLayout
      path={dialingCountryPath(page.slug)}
      title={`קידומת ${name}: +${digits}`}
      metaTitle={metaTitleOf(page)}
      description={descriptionOf(page)}
      answer={answerOf(page)}
      lede={trunkRuleText(page)}
      tool={
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <caption>חיוג {toCountry} מישראל</caption>
            <tbody>
              {facts.map(([label, value]) => (
                <tr key={label}>
                  <th scope="row">{label}</th>
                  <td>{value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      }
      faq={faq}
      cta={{
        text: 'שולחים הודעות וואטסאפ או SMS ללקוחות בכמה מדינות? אנחנו מחברים מערכות כאלה לעסקים, עם מספרים בפורמט הנכון.',
        label: 'אוטומציה לעסקים',
        href: '/services/automation',
      }}
    >
      <h2>איך מחייגים {toCountry} מישראל</h2>
      <p>
        החיוג בנוי משלושה חלקים: קוד יציאה מישראל, הקידומת <bdi dir="ltr">{digits}</bdi> ו{droppedPart[page.trunk]}.
        {note && ` ${note}`}
      </p>
      <ul>
        <li>
          מקו קווי: <bdi dir="ltr">00-{digits}</bdi> ואחריו {droppedPart[page.trunk]}.
        </li>
        <li>
          מנייד: <bdi dir="ltr">+{digits}</bdi>, בלחיצה ארוכה על 0 מקבלים את ה-+.
        </li>
        <li>
          דרך חברה בינלאומית: הקידומת שלה במקום 00, למשל{' '}
          {carriers.slice(0, 3).map((row, index) => (
            <span key={row.prefix}>
              {index > 0 && ', '}
              <bdi dir="ltr">
                {row.prefix}-{digits}
              </bdi>
            </span>
          ))}
          .
        </li>
      </ul>
      {shared && (
        <>
          <h2>מדינות שחולקות את הקידומת +{digits}</h2>
          <p>{shared}</p>
        </>
      )}

      <h2>מספר מ{name} בוואטסאפ ובאנשי הקשר</h2>
      <p>
        שומרים את המספר בפורמט בינלאומי, עם +{digits} בהתחלה, וכך הוא עובד גם בשיחה מישראל וגם בחו״ל. כדי להמיר מספר
        ישראלי לאותו פורמט, יש <Link href={PHONE_FORMAT_PATH}>המרת מספר ישראלי ל-+972</Link>.
      </p>

      <h2>קידומות של מדינות נוספות</h2>
      <p>
        כל הקידומות, עם חיפוש לפי מספר כמו +{digits}, נמצאות ב<Link href={DIALING_HUB_PATH}>טבלת הקידומות הבינלאומיות</Link>.
      </p>
      <ul>
        {others.map((item) => (
          <li key={item.slug}>
            <Link href={dialingCountryPath(item.slug)}>
              קידומת {item.country.name} +{item.country.digits}
            </Link>
          </li>
        ))}
      </ul>

      <h2>מקורות</h2>
      <ul>
        {sources.map((source) => (
          <li key={source.href}>
            <a href={source.href} target="_blank" rel="noopener noreferrer">
              {source.label}
            </a>
          </li>
        ))}
      </ul>
    </ToolLayout>
  )
}
