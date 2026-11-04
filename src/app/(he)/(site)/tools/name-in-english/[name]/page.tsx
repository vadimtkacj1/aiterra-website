import Link from 'next/link'
import { notFound } from 'next/navigation'
import ToolLayout, { toolMetadata, type ToolFaqEntry } from '../../../components/tools/ToolLayout'
import { namePageBySlug, namePagePath, namePages, type NamePage } from '@/lib/name-pages'
import { NAME_TRANSLITERATION_PATH, passportStyle, ruleVariants } from '@/lib/name-transliteration'
import styles from '../../word-counter/page.module.css'

export const dynamicParams = false

export const generateStaticParams = () => namePages.map(({ slug }) => ({ name: slug }))

type Params = { params: Promise<{ name: string }> }

const kindLabel: Record<NamePage['gender'], string> = {
  male: 'שם פרטי לבן',
  female: 'שם פרטי לבת',
  both: 'שם פרטי לבן ולבת',
  surname: 'שם משפחה',
}

const titleOf = ({ entry }: NamePage) => `איך כותבים ${entry.hebrew} באנגלית? ${entry.spellings[0]}`

const descriptionOf = ({ entry, gender }: NamePage) => {
  const others = entry.spellings.slice(1)
  return `${entry.hebrew} (${kindLabel[gender]}) נכתב באנגלית בדרך כלל ${entry.spellings[0]}${others.length ? `, ולעיתים ${others.join(' או ')}` : ''}. בדרכון באותיות גדולות: ${passportStyle(entry.spellings[0])}.`
}

export async function generateMetadata({ params }: Params) {
  const page = namePageBySlug((await params).name)
  if (!page) return {}
  return toolMetadata({ path: namePagePath(page.slug), metaTitle: titleOf(page), description: descriptionOf(page) })
}

export default async function NameInEnglishPage({ params }: Params) {
  const page = namePageBySlug((await params).name)
  if (!page) notFound()
  const { entry, gender } = page
  const common = entry.spellings
  const byRules = ruleVariants(entry.hebrew).filter((spelling) => !common.includes(spelling))

  const faq: ToolFaqEntry[] = [
    {
      id: `name-${page.slug}-spelling`,
      question: `איך כותבים ${entry.hebrew} באנגלית?`,
      answer: `האיות הנפוץ הוא ${common[0]}.${common.length > 1 ? ` גם ${common.slice(1).join(' ו-')} נפוצים.` : ''} אין איות אחד נכון: חשוב לבחור אחד ולהשתמש בו בעקביות בדרכון, בכרטיסי טיסה ובחשבונות.`,
    },
    {
      id: `name-${page.slug}-passport`,
      question: `איך ${entry.hebrew} נכתב בדרכון?`,
      answer: `בדרכון השם מודפס באותיות גדולות, למשל ${passportStyle(common[0])}. האיות שרשום בדרכון שלכם הוא הקובע לכל מסמך נסיעה, ואותו כותבים בכרטיס הטיסה ובוויזה גם אם הוא שונה מהאיות הנפוץ.`,
    },
  ]

  const rows: [string, React.ReactNode][] = [
    ['סוג השם', kindLabel[gender]],
    ['האיות הנפוץ', <bdi key="main">{common[0]}</bdi>],
    ['איותים נפוצים נוספים', common.length > 1 ? <bdi key="more">{common.slice(1).join(', ')}</bdi> : 'אין'],
    ['באותיות גדולות, כמו בדרכון', <bdi key="pass">{passportStyle(common[0])}</bdi>],
    ['איותים אפשריים לפי כללי התעתיק', byRules.length ? <bdi key="rules">{byRules.join(', ')}</bdi> : 'זהים לאיותים הנפוצים'],
  ]

  return (
    <ToolLayout
      path={namePagePath(page.slug)}
      title={`איך כותבים ${entry.hebrew} באנגלית`}
      metaTitle={titleOf(page)}
      description={descriptionOf(page)}
      lede={descriptionOf(page)}
      tool={
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <caption>{entry.hebrew} באנגלית</caption>
            <tbody>
              {rows.map(([label, value]) => (
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
        text: 'צריכים טפסים שבודקים ומתעתקים שמות כבר בהקלדה? אנחנו בונים כלים כאלה לעסקים.',
        label: 'לפיתוח תוכנה לעסקים',
        href: '/services/development',
      }}
    >
      <h2>שם מלא או שם אחר</h2>
      <p>
        כדי לתעתק שם מלא, שם משפחה או שם שלא מופיע כאן, השתמשו ב<Link href={NAME_TRANSLITERATION_PATH}>ממיר השמות מעברית
        לאנגלית</Link>. שם מוצגים גם כללי התעתיק לכל אות והסבר על האיות בדרכון.
      </p>
      <h2>שמות נוספים באנגלית</h2>
      <ul>
        {namePages
          .filter((item) => item.slug !== page.slug)
          .map((item) => (
            <li key={item.slug}>
              <Link href={namePagePath(item.slug)}>{item.entry.hebrew} באנגלית</Link>
            </li>
          ))}
      </ul>
    </ToolLayout>
  )
}
