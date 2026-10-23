import { Fragment } from 'react'
import Link from 'next/link'
import ToolLayout, { toolMetadata, type ToolFaqEntry } from '../../components/tools/ToolLayout'
import AiGlossary from '../../components/tools/AiGlossary'
import JsonLd from '@/components/seo/JsonLd'
import {
  GLOSSARY_CHECKED,
  GLOSSARY_CHECKED_ISO,
  HEBREW_TOKEN_STUDY,
  glossaryIndex,
  glossarySources,
  glossaryTerms,
  glossaryTopics,
  relatedTerms,
  splitLatinRuns,
  termsInTopic,
  type GlossaryTerm,
} from '@/lib/ai-glossary'
import { promptLibrary } from '@/lib/prompt-generator'
import { ORG_ID } from '@/lib/schema'
import { SITE_URL } from '@/lib/seo'
import styles from './page.module.css'

const PATH = '/tools/ai-glossary'
const PAGE_URL = `${SITE_URL}${PATH}`
const SET_ID = `${PAGE_URL}#glossary`
const TITLE = 'מילון מונחי בינה מלאכותית בעברית'
const TOTAL = glossaryTerms.length
const META_TITLE = 'מילון מונחי בינה מלאכותית בעברית: טוקן, LLM, MCP'
const DESCRIPTION = `מילון מונחי בינה מלאכותית בעברית: ${TOTAL} מונחים בהסבר פשוט ועם דוגמה מהעסק. מה זה טוקן, פרומפט, LLM, RAG, MCP, סוכן AI ו-GEO.`
const ACADEMY_URL = 'https://terms.hebrew-academy.org.il/munnah'
const RLM = /‏/g

const academyTerms: { code: string; label: string }[] = [
  { code: '69080_2', label: 'בינה מלאכותית' },
  { code: '69249_2', label: 'למידת מכונה' },
  { code: '69267_2', label: 'רשת עצבית' },
  { code: '73641_2', label: 'prompt (מַנְחֶה)' },
]

const sources = [
  glossarySources.openaiPrompting,
  glossarySources.reasoning,
  glossarySources.anthropicPrompting,
  glossarySources.contextEngineering,
  glossarySources.agents,
  glossarySources.mcp,
  glossarySources.tiktoken,
  glossarySources.transformer,
  glossarySources.rag,
  glossarySources.hallucinate,
  glossarySources.geo,
  glossarySources.googleAi,
  {
    href: 'https://developers.google.com/search/docs/crawling-indexing/google-common-crawlers',
    label: 'Google: הזחלנים של Google, כולל Google-Extended',
  },
  glossarySources.openaiBots,
  glossarySources.llmsTxt,
  glossarySources.owasp,
  glossarySources.privacyGuide,
  {
    href: 'https://www.shibolet.com/?p=20425',
    label: 'שיבולת: סיכום טיוטת ההנחיה של הרשות להגנת הפרטיות על מערכות בינה מלאכותית, אפריל 2025',
  },
  glossarySources.euAiAct,
  glossarySources.caching,
  glossarySources.batch,
  glossarySources.chatgpt,
]

const faq: ToolFaqEntry[] = [
  {
    id: 'ai-glossary-faq-token',
    question: 'מה זה טוקן בבינה מלאכותית?',
    answer:
      'טוקן הוא יחידת הטקסט שמודל שפה קורא וכותב: מילה, חלק ממילה או סימן פיסוק. המודל מוגבל במספר הטוקנים שהוא יכול לקבל בבת אחת, ושירותי API גובים תשלום לפי טוקנים של קלט ושל פלט. בעברית אותו תוכן דורש יותר טוקנים: בבדיקה שלנו, בערך פי 1.3 מאשר באנגלית בטוקנייזר של GPT-4o ו-GPT-5, ופי 3.2 בטוקנייזר הישן של GPT-4.',
  },
  {
    id: 'ai-glossary-faq-llm',
    question: 'מה זה LLM?',
    answer:
      'LLM, מודל שפה גדול, הוא מודל שאומן על כמויות עצומות של טקסט כדי לחזות את הטוקן הבא, כלומר את המשך הטקסט, ובזכות זה הוא יודע לכתוב, לסכם, לתרגם, לענות על שאלות ולכתוב קוד. המודלים שמאחורי ChatGPT, ‏Claude ו-Gemini הם מודלי שפה גדולים. הם לא שולפים תשובה ממאגר אלא מנסחים אותה, ולכן הם יכולים גם לטעות בביטחון, מה שנקרא הזיה.',
  },
  {
    id: 'ai-glossary-faq-mcp',
    question: 'מה זה MCP?',
    answer:
      'MCP, ‏Model Context Protocol, הוא תקן פתוח שמחבר אפליקציות AI למקורות מידע ולכלים: קבצים, מסדי נתונים, יומן, CRM ועוד. ‏Anthropic פרסמה אותו בנובמבר 2024, והיום הוא נתמך גם ב-ChatGPT, ב-Claude ובכלי פיתוח רבים. לעסק המשמעות היא שאפשר לחבר צ׳אט או סוכן למערכות שלכם דרך שרת MCP, במקום לבנות חיבור נפרד לכל כלי.',
  },
  {
    id: 'ai-glossary-faq-rag',
    question: 'מה זה RAG ולמה הוא חשוב לבוט של עסק?',
    answer:
      'RAG היא שיטה שבה המערכת מחפשת במסמכים של העסק את הקטעים שקשורים לשאלה ומצרפת אותם לפרומפט לפני שהמודל עונה. כך בוט יכול לענות לפי המחירון, מדיניות ההחזרות או הפוליסה העדכניים שלכם, ולא לפי מה שהמודל למד באימון. זה גם מקטין את הסיכוי להזיות, כי אפשר להגדיר לבוט לענות רק ממה שנמצא, ולהעביר לנציג כשלא נמצא כלום.',
  },
  {
    id: 'ai-glossary-faq-agent',
    question: 'מה ההבדל בין צ׳אטבוט לסוכן AI?',
    answer:
      'צ׳אטבוט מנהל שיחה: הוא עונה, לפעמים מתוך תפריט קבוע ולפעמים בעזרת מודל שפה. סוכן AI גם פועל: הוא מחליט בעצמו אילו צעדים לבצע ומשתמש בכלים, למשל בודק ביומן, קובע תור, פותח ליד ב-CRM ושולח אישור. בגלל זה סוכן צריך גבולות ברורים: מה מותר לו לעשות לבד, ומתי הוא מעביר את השיחה לאדם.',
  },
  {
    id: 'ai-glossary-faq-geo',
    question: 'מה זה GEO ובמה הוא שונה מ-SEO?',
    answer:
      'SEO עוסק במקום של האתר ברשימת התוצאות של גוגל. GEO עוסק בשאלה אם מנועים שמנסחים תשובות, כמו ChatGPT, ‏Gemini ו-AI Overviews, מזכירים את העסק ומקשרים אליו בתוך התשובה. הבסיס משותף: הדף צריך להיות סרוק ובאינדקס, ו-Google כותבת שאין דרישות מיוחדות כדי להופיע בתכונות ה-AI שלה. ההבדל הוא במה שמודדים: אזכורים וציטוטים, ולא רק מיקום.',
  },
]

const plain = (text: string) => text.replace(RLM, '')

const definedTermSet = {
  '@context': 'https://schema.org',
  '@type': 'DefinedTermSet',
  '@id': SET_ID,
  name: TITLE,
  description: DESCRIPTION,
  url: PAGE_URL,
  inLanguage: 'he',
  dateModified: GLOSSARY_CHECKED_ISO,
  publisher: { '@id': ORG_ID },
  hasDefinedTerm: glossaryTerms.map((term) => ({
    '@type': 'DefinedTerm',
    '@id': `${PAGE_URL}#${term.id}`,
    name: term.title,
    alternateName: [...new Set([term.name, term.en, term.abbr ?? ''])].filter(
      (name) => name && name !== term.title,
    ),
    description: plain(term.definition),
    url: `${PAGE_URL}#${term.id}`,
    inDefinedTermSet: { '@id': SET_ID },
  })),
}

function Mixed({ text }: { text: string }) {
  return (
    <>
      {splitLatinRuns(text).map((run, index) => (
        <Fragment key={index}>
          {run.latin ? (
            <span dir="ltr" lang="en">
              {run.text}
            </span>
          ) : (
            run.text
          )}
        </Fragment>
      ))}
    </>
  )
}

function TermCard({ term }: { term: GlossaryTerm }) {
  const related = relatedTerms(term)
  const showEnglish = !term.title.includes(term.en)
  return (
    <article id={term.id} data-term={term.id} className={styles.term} aria-labelledby={`${term.id}-title`}>
      <h3 id={`${term.id}-title`} className={styles.termTitle}>
        <Mixed text={term.title} />
      </h3>
      {showEnglish ? (
        <p className={styles.termEn} lang="en" dir="ltr">
          {term.en}
        </p>
      ) : null}
      <p className={styles.definition}>
        <Mixed text={term.definition} />
      </p>
      <p className={styles.example}>
        <strong>דוגמה מהעסק: </strong>
        <Mixed text={term.example} />
      </p>
      {term.link ? (
        <p className={styles.more}>
          להרחבה:{' '}
          {term.link.href.startsWith('#') ? (
            <a href={term.link.href}>
              <Mixed text={term.link.label} />
            </a>
          ) : (
            <Link href={term.link.href}>
              <Mixed text={term.link.label} />
            </Link>
          )}
        </p>
      ) : null}
      <p className={styles.related}>
        <span className={styles.relatedLabel}>מונחים קשורים: </span>
        {related.map((item, index) => (
          <Fragment key={item.id}>
            {index > 0 ? ', ' : ''}
            <a href={`#${item.id}`}>
              <Mixed text={item.title} />
            </a>
          </Fragment>
        ))}
      </p>
      {term.source ? (
        <p className={styles.source}>
          מקור:{' '}
          <a href={term.source.href} rel="noopener" target="_blank">
            <Mixed text={term.source.label} />
          </a>
        </p>
      ) : null}
    </article>
  )
}

function GlossaryList() {
  return (
    <div className={styles.topics}>
      {glossaryTopics.map((topic) => (
        <section
          key={topic.id}
          id={`topic-${topic.id}`}
          data-topic={topic.id}
          className={styles.topic}
          aria-labelledby={`topic-${topic.id}-title`}
        >
          <div className={styles.topicHead}>
            <h2 id={`topic-${topic.id}-title`} className={styles.topicTitle}>
              <Mixed text={topic.label} />
            </h2>
            <p className={styles.topicText}>
              <Mixed text={topic.description} />
            </p>
          </div>
          <div className={styles.terms}>
            {termsInTopic(topic.id).map((term) => (
              <TermCard key={term.id} term={term} />
            ))}
          </div>
        </section>
      ))}
    </div>
  )
}

export const metadata = toolMetadata({ path: PATH, metaTitle: META_TITLE, description: DESCRIPTION })

export default function AiGlossaryPage() {
  const [modern, legacy] = HEBREW_TOKEN_STUDY.results
  return (
    <>
      <JsonLd data={definedTermSet} />
      <ToolLayout
        path={PATH}
        title={TITLE}
        metaTitle={META_TITLE}
        description={DESCRIPTION}
        lede={`מילון מונחי בינה מלאכותית בעברית מסביר בשפה פשוטה ${TOTAL} מונחים שעולים בעבודה עם AI בעסק, כמו GEO, MCP, RAG, טוקן ופרומפט. לכל מונח יש הגדרה של משפט או שניים, דוגמה מעסק ישראלי וקישורים למונחים קשורים.`}
        chips={[`${TOTAL} מונחים`, `${glossaryTopics.length} נושאים`, 'חיפוש בעברית ובאנגלית', 'קישור ישיר לכל מונח']}
        tool={
          <AiGlossary entries={glossaryIndex} topics={glossaryTopics}>
            <GlossaryList />
          </AiGlossary>
        }
        faq={faq}
        cta={{
          text: 'רוצים ש-ChatGPT, ‏Gemini ו-AI Overviews יזכירו את העסק שלכם כשלקוחות שואלים על התחום?',
          label: 'לשירות קידום ב-AI',
          href: '/services/ai-search',
        }}
      >
        <h2>איך משתמשים במילון</h2>
        <p>
          מחפשים מונח בעברית או באנגלית, או לוחצים על אות כדי לראות את כל המונחים שמתחילים בה. המונחים מסודרים ב
          {glossaryTopics.length} נושאים, ולכל מונח יש קישור קבוע שאפשר לשלוח, למשל{' '}
          <Link href={`${PATH}#rag`}>
            <span dir="ltr">{`${PATH}#rag`}</span>
          </Link>
          .
        </p>
        <p>
          כל הגדרה כתובה כך שאפשר להבין אותה בלי לקרוא את שאר המילון. כשהגדרה נשענת על מונח אחר, הוא מופיע ברשימת
          המונחים הקשורים שמתחתיה.
        </p>

        <h2 id="hebrew-tokens" className={styles.anchorTarget}>
          עברית וטוקנים: המדידה שלנו
        </h2>
        <p>
          כתבנו עשרה משפטים קצרים שעסק כותב ביום רגיל, בעברית ובאנגלית באותה משמעות, וספרנו את הטוקנים בספריית{' '}
          <span dir="ltr" lang="en">
            tiktoken
          </span>{' '}
          של OpenAI, גרסה {HEBREW_TOKEN_STUDY.tiktokenVersion}, בשני טוקנייזרים:
        </p>
        <div className={styles.tableWrap} role="region" aria-label="טוקנים בעברית מול אנגלית" tabIndex={0}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th scope="col">טוקנייזר</th>
                <th scope="col">משמש את</th>
                <th scope="col">עברית</th>
                <th scope="col">אנגלית</th>
                <th scope="col">פי כמה (הטווח בין המשפטים)</th>
              </tr>
            </thead>
            <tbody>
              {HEBREW_TOKEN_STUDY.results.map((row) => (
                <tr key={row.encoding}>
                  <th scope="row">
                    <span dir="ltr" lang="en">
                      {row.encoding}
                    </span>
                  </th>
                  <td>
                    <Mixed text={row.models} />
                  </td>
                  <td>{row.he}</td>
                  <td>{row.en}</td>
                  <td>
                    {row.ratio}
                    <span className={styles.range}> ({row.range})</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p>
          בטוקנייזר של GPT-4o ו-GPT-5, אותו תוכן בעברית צרך בערך פי {Number(modern.ratio).toFixed(1)} טוקנים. בטוקנייזר
          הישן של GPT-4 הפער היה פי {Number(legacy.ratio).toFixed(1)}. המשפטים בעברית קצרים יותר במילים (
          {HEBREW_TOKEN_STUDY.words.he} מילים מול {HEBREW_TOKEN_STUDY.words.en}), כי בעברית מילות יחס ותחיליות מתחברות
          למילה, אבל כל מילה עברית נחתכת ליותר טוקנים: בממוצע{' '}
          {(modern.he / HEBREW_TOKEN_STUDY.words.he).toFixed(1)} טוקנים למילה, מול{' '}
          {(modern.en / HEBREW_TOKEN_STUDY.words.en).toFixed(1)} באנגלית.
        </p>
        <p>
          מה זה אומר בפועל: במנוי חודשי לצ׳אט זה לא משנה. בבוט או בכלי שמשלם לפי טוקנים דרך API, אותה שיחה בעברית
          עולה בערך 30% יותר מאשר באנגלית במודלים של OpenAI. המדגם קטן, ולכן זה סדר גודל ולא מספר מדויק. את
          הטוקנייזרים של Claude ושל Gemini לא מדדנו, ולכן אין כאן מספר עבורם.
        </p>
        <details className={styles.details}>
          <summary>עשרת המשפטים שמדדנו</summary>
          <ol className={styles.pairs}>
            {HEBREW_TOKEN_STUDY.pairs.map((pair) => (
              <li key={pair.en}>
                <span className={styles.pairHe}>{pair.he}</span>
                <span className={styles.pairEn} lang="en" dir="ltr">
                  {pair.en}
                </span>
              </li>
            ))}
          </ol>
        </details>

        <h2>שמות המונחים בעברית</h2>
        <p>
          לחלק מהמונחים יש שם עברי שקבעה האקדמיה ללשון העברית, ובו השתמשנו: בינה מלאכותית, למידת מכונה ורשת עצבית
          מופיעים במילונים של האקדמיה לטכנולוגיית המידע. לרוב המונחים של בינה מלאכותית יוצרת עוד אין מונח של האקדמיה,
          ולכן כתבנו את השם שבו משתמשים בפועל, כמו פרומפט, טוקן וצ׳אטבוט, ולידו את השם באנגלית.
        </p>
        <p>
          דוגמה מעניינת: ל-prompt במובן של מחשבים קבעה האקדמיה כבר ב-2002 את המילה &quot;מַנְחֶה&quot;, במילון מושגים
          בסיסיים בטכנולוגיית המידע. בשיחה על צ׳אטים כמעט כולם אומרים היום פרומפט, או הנחיה.
        </p>

        <h2>מה משתנה מהר</h2>
        <p>
          המונחים עצמם יציבים, אבל העובדות סביבם משתנות: אילו מודלים קיימים, מחירים, תכונות ורגולציה. בהגדרות שתלויות
          בחברה מסוימת כתבנו תאריך או מקור, והעובדות בדף נבדקו מול המקורות ב-{GLOSSARY_CHECKED}.
        </p>
        <p>
          רוצים לנסח בעצמכם הוראה טובה לצ׳אט? ב<Link href="/tools/prompt-generator">מחולל הפרומפטים בעברית</Link>{' '}
          בוחרים משימה ומקבלים פרומפט מוכן בשלוש גרסאות, ויש שם גם ספרייה של {promptLibrary.length} פרומפטים מוכנים
          לעסקים.
        </p>

        <h2>מקורות</h2>
        <ul>
          {sources.map((source) => (
            <li key={source.href}>
              <a href={source.href} rel="noopener" target="_blank">
                <Mixed text={source.label} />
              </a>
            </li>
          ))}
          <li>
            מאגר המונחים של האקדמיה ללשון העברית:{' '}
            {academyTerms.map((item, index) => (
              <Fragment key={item.code}>
                {index > 0 ? ', ' : ''}
                <a href={`${ACADEMY_URL}/${item.code}`} rel="noopener" target="_blank">
                  <Mixed text={item.label} />
                </a>
              </Fragment>
            ))}
          </li>
        </ul>
        <p className={styles.reviewed}>
          המקורות נבדקו ב-{GLOSSARY_CHECKED}. זה מידע כללי, ובנושאי פרטיות ורגולציה הוא לא ייעוץ משפטי.
        </p>
      </ToolLayout>
    </>
  )
}
