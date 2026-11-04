import Link from 'next/link'
import { notFound } from 'next/navigation'
import ToolLayout, { toolMetadata, type ToolFaqEntry } from '../../../components/tools/ToolLayout'
import { findRhymes } from '@/lib/hebrew-rhymes'
import { RHYME_PAGE_WORDS, isRhymePageWord, rhymePagePath } from '@/lib/rhyme-pages'

export const generateStaticParams = () => RHYME_PAGE_WORDS.map((word) => ({ word }))

type Params = { params: Promise<{ word: string }> }

const FINDER_PATH = '/tools/hebrew-rhyme-finder'
const PERFECT_LIMIT = 40
const GOOD_LIMIT = 30
const NEAR_LIMIT = 20

const wordOf = async (params: Params['params']) => {
  const raw = (await params).word
  try {
    return decodeURIComponent(raw)
  } catch {
    return raw
  }
}

const titleOf = (word: string) => `חרוז למילה ${word}: מילים שמתחרזות עם ${word}`

const descriptionOf = (word: string, sample: string[]) =>
  `חרוזים למילה ${word} בעברית: ${sample.join(', ')} ועוד, מסודרים מחרוז מלא לחרוז קרוב. לשיר, לברכה ולשורות מחורזות.`

export async function generateMetadata({ params }: Params) {
  const word = await wordOf(params)
  if (!isRhymePageWord(word)) return {}
  const rhymes = findRhymes(word)
  const sample = [...rhymes.perfect, ...rhymes.good].slice(0, 4)
  return toolMetadata({ path: rhymePagePath(word), metaTitle: titleOf(word), description: descriptionOf(word, sample) })
}

const WordList = ({ words }: { words: string[] }) => (
  <ul>
    {words.map((item) => (
      <li key={item}>{isRhymePageWord(item) ? <Link href={rhymePagePath(item)}>{item}</Link> : item}</li>
    ))}
  </ul>
)

export default async function RhymePage({ params }: Params) {
  const word = await wordOf(params)
  if (!isRhymePageWord(word)) notFound()
  const rhymes = findRhymes(word)
  const perfect = rhymes.perfect.slice(0, PERFECT_LIMIT)
  const good = rhymes.good.slice(0, GOOD_LIMIT)
  const near = rhymes.near.slice(0, NEAR_LIMIT)
  const sample = [...perfect, ...good].slice(0, 4)

  const faq: ToolFaqEntry[] = [
    {
      id: `rhyme-${word}-best`,
      question: `מה מתחרז עם ${word}?`,
      answer: `חרוזים מלאים למילה ${word} הם, למשל, ${perfect.slice(0, 6).join(', ') || sample.join(', ')}. בחרוז מלא שתי האותיות האחרונות או יותר זהות, ולכן הוא נשמע הכי טוב בסוף שורה.`,
    },
    {
      id: `rhyme-${word}-more`,
      question: `איך מוצאים עוד חרוזים למילה ${word}?`,
      answer: `במחפש החרוזים אפשר להקליד ${word} או כל מילה אחרת, לסנן מילים קצרות או ארוכות ולראות גם חרוזים קרובים, שבהם הצליל דומה גם כשהאותיות שונות.`,
    },
  ]

  return (
    <ToolLayout
      path={rhymePagePath(word)}
      title={`חרוז למילה ${word}`}
      metaTitle={titleOf(word)}
      description={descriptionOf(word, sample)}
      lede={descriptionOf(word, sample)}
      tool={
        <div>
          {perfect.length ? (
            <>
              <h2>חרוזים מלאים למילה {word}</h2>
              <WordList words={perfect} />
            </>
          ) : null}
          {good.length ? (
            <>
              <h2>חרוזים טובים</h2>
              <WordList words={good} />
            </>
          ) : null}
          {near.length ? (
            <>
              <h2>חרוזים קרובים</h2>
              <WordList words={near} />
            </>
          ) : null}
        </div>
      }
      faq={faq}
      cta={{
        text: 'צריכים כלי טקסט או מילון עם חיפוש באתר שלכם? אנחנו בונים כלים כאלה לעסקים.',
        label: 'לפיתוח תוכנה לעסקים',
        href: '/services/development',
      }}
    >
      <h2>עוד חרוזים</h2>
      <p>
        לחרוזים לכל מילה, כולל סינון לפי אורך, השתמשו ב<Link href={FINDER_PATH}>מחפש החרוזים בעברית</Link>. אלה
        מילים נוספות שיש להן דף חרוזים:
      </p>
      <ul>
        {RHYME_PAGE_WORDS.filter((item) => item !== word).map((item) => (
          <li key={item}>
            <Link href={rhymePagePath(item)}>חרוז למילה {item}</Link>
          </li>
        ))}
      </ul>
    </ToolLayout>
  )
}
