import Link from 'next/link'
import { notFound } from 'next/navigation'
import ToolLayout, { toolMetadata, type ToolFaqEntry } from '../../../components/tools/ToolLayout'
import { groupLabels, groupNotes, idfRankById, idfRankPath, idfRanks, rankLevel, type IdfRank } from '@/lib/idf-ranks'
import { policeRanks } from '@/lib/police-ranks'
import styles from '../../word-counter/page.module.css'

export const dynamicParams = false

export const generateStaticParams = () => idfRanks.map(({ id }) => ({ rank: id }))

type Params = { params: Promise<{ rank: string }> }

const CHART_PATH = '/tools/idf-ranks-chart'
const POLICE_PATH = '/tools/police-ranks-chart'
const MAX_META_TITLE_LENGTH = 52

const plain = (name: string) => name.replace(/־/g, ' ')

const groupWord: Record<IdfRank['group'], string> = {
  enlisted: 'חוגר',
  nco: 'נגד',
  officer: 'קצונה',
}

const metaTitleOf = (rank: IdfRank) => {
  const full = `דרגת ${plain(rank.name)} בצה״ל: ${rank.abbreviation}, סימן הדרגה ובאנגלית`
  return full.length <= MAX_META_TITLE_LENGTH ? full : `דרגת ${plain(rank.name)} בצה״ל: סימן הדרגה ובאנגלית`
}

const descriptionOf = (rank: IdfRank, level: number) =>
  `${rank.name} (${rank.abbreviation}) היא דרגת ${groupWord[rank.group]} בצה״ל, ה-${level + 1} מתוך ${idfRanks.length} מהנמוכה לגבוהה. באנגלית ${rank.english}. סימן הדרגה: ${rank.insignia}${rank.worn ? `, ${rank.worn}` : ''}.`

export async function generateMetadata({ params }: Params) {
  const rank = idfRankById((await params).rank)
  if (!rank) return {}
  return toolMetadata({
    path: idfRankPath(rank.id),
    metaTitle: metaTitleOf(rank),
    description: descriptionOf(rank, rankLevel(rank.id)),
  })
}

export default async function IdfRankPage({ params }: Params) {
  const rank = idfRankById((await params).rank)
  if (!rank) notFound()
  const level = rankLevel(rank.id)
  const below = idfRanks[level - 1]
  const above = idfRanks[level + 1]
  const police = policeRanks.find((item) => item.idfId === rank.id)

  const facts: [string, React.ReactNode][] = [
    ['ראשי תיבות', rank.abbreviation],
    ['קבוצה', groupLabels[rank.group]],
    ['מקום בסדר הדרגות', `${level + 1} מתוך ${idfRanks.length}, מהנמוכה לגבוהה`],
    ['באנגלית', <span key="en" dir="ltr">{rank.english}</span>],
    ['קוד נאט״ו', rank.nato ? <span key="nato" dir="ltr">{rank.nato}</span> : 'מוצג לקצינים בלבד'],
    ['סימן הדרגה', `${rank.insignia}${rank.worn ? `, ${rank.worn}` : ''}`],
    ['הדרגה שמתחת', below ? <Link key="below" href={idfRankPath(below.id)}>{below.name}</Link> : 'אין, זו הדרגה הנמוכה ביותר'],
    ['הדרגה שמעל', above ? <Link key="above" href={idfRankPath(above.id)}>{above.name}</Link> : 'אין, זו הדרגה הגבוהה ביותר'],
    ['המקבילה במשטרה', police ? <Link key="police" href={POLICE_PATH}>{police.name} ({police.abbreviation})</Link> : 'אין מקבילה ישירה'],
  ]

  const faq: ToolFaqEntry[] = [
    {
      id: `rank-${rank.id}-english`,
      question: `איך אומרים ${plain(rank.name)} באנגלית?`,
      answer: `${rank.name} באנגלית הוא ${rank.english}.${rank.nato ? ` בסולם של נאט״ו הדרגה מקבילה ל-${rank.nato}.` : ''} התרגום הוא ההתאמה המקובלת, ובכל צבא הסמכויות של הדרגה מעט שונות.`,
    },
    {
      id: `rank-${rank.id}-order`,
      question: `מה הדרגה מעל ${plain(rank.name)}?`,
      answer: above
        ? `מעל ${rank.name} נמצאת הדרגה ${above.name} (${above.abbreviation}). מתחתיה ${below ? `נמצאת ${below.name} (${below.abbreviation})` : 'אין דרגה, זו הדרגה הנמוכה בצה״ל'}.`
        : `${rank.name} היא הדרגה הגבוהה ביותר בצה״ל, ובה מחזיק הרמטכ״ל. מתחתיה נמצאת ${below?.name ?? ''}.`,
    },
    {
      id: `rank-${rank.id}-insignia`,
      question: `איך נראה סימן הדרגה של ${plain(rank.name)}?`,
      answer: `${rank.insignia}${rank.worn ? `, ${rank.worn}` : ''}. ${groupNotes[rank.group]}`,
    },
  ]

  return (
    <ToolLayout
      path={idfRankPath(rank.id)}
      title={`דרגת ${rank.name} (${rank.abbreviation}) בצה״ל`}
      metaTitle={metaTitleOf(rank)}
      description={descriptionOf(rank, level)}
      lede={descriptionOf(rank, level)}
      tool={
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <caption>דרגת {rank.name} בקצרה</caption>
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
        text: 'צריכים טבלה או מאגר נתונים עם חיפוש באתר שלכם? אנחנו בונים כלים כאלה לעסקים.',
        label: 'לפיתוח תוכנה לעסקים',
        href: '/services/development',
      }}
    >
      <h2>{groupLabels[rank.group]} בצה״ל</h2>
      <p>{groupNotes[rank.group]}</p>
      <p>
        הסדר המלא, עם חיפוש והשוואה בין שתי דרגות, נמצא ב<Link href={CHART_PATH}>טבלת הדרגות בצה״ל לפי הסדר</Link>. שם
        מפורטים גם המקורות. האתר אינו רשמי ואין לנו קשר לצה״ל.
      </p>
      <h2>כל הדרגות בצה״ל</h2>
      <ol>
        {idfRanks.map((item) => (
          <li key={item.id}>
            {item.id === rank.id ? (
              <strong>
                {item.name} ({item.abbreviation})
              </strong>
            ) : (
              <Link href={idfRankPath(item.id)}>
                {item.name} ({item.abbreviation})
              </Link>
            )}
          </li>
        ))}
      </ol>
    </ToolLayout>
  )
}
