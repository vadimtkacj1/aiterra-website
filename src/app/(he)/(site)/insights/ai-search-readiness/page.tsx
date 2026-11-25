import Link from 'next/link'
import Header from '../../components/Header'
import Faq from '../../components/Faq'
import ContactForm from '../../components/ContactForm'
import Footer from '../../components/Footer'
import ArticleToc, { type TocEntry } from '../../components/ArticleToc'
import { ChevronPrevIcon } from '../../components/icons'
import { pageMetadata } from '@/lib/metadata'
import JsonLd from '@/components/seo/JsonLd'
import { breadcrumbList, faqPage, ORG_ID, personId } from '@/lib/schema'
import { SITE_URL } from '@/lib/seo'
import {
  AGENT_ROWS,
  PLATFORM_ORDER,
  READINESS_PUBLISHED,
  count,
  percent,
  readiness,
} from '@/lib/insights/ai-search-readiness'
import styles from '../../components/Article.module.css'
import insight from '../../components/Insights.module.css'

const PATH = '/insights/ai-search-readiness'
const CSV_PATH = `${PATH}/data.csv`
const PUBLISHED = READINESS_PUBLISHED
const all = readiness.business
const sites = count(all.total)
const CRUMB = 'מחקר: אתרים וחיפוש ב-AI'
const TITLE = `אתרי עסקים בישראל מול חיפוש ב-AI: מחקר על ${sites} אתרים`
const SEO_TITLE = `מי חוסם את ChatGPT? מחקר על ${sites} אתרי עסקים בישראל`
const DESCRIPTION = `בדקנו ${sites} אתרי ‎.co.il בעברית: כמה חוסמים רובוטים של AI, למי יש llms.txt ומי מסמן את העסק בנתונים מובנים. כל הנתונים פתוחים להורדה.`
const cloudflareShare = percent(all.cloudflareManagedBlock, all.blocksAny)
const wix = readiness.byPlatform['Wix']
const shopify = readiness.byPlatform['Shopify']
const wordpress = readiness.byPlatform['WordPress']
const llmsFromBuilders = percent(wix.llms + shopify.llms, all.llms)

const toc: TocEntry[] = [
  { id: 'blocking', label: 'מי חוסם רובוטים של AI' },
  { id: 'cloudflare', label: 'רוב החסימות באות מ-Cloudflare' },
  { id: 'llms', label: 'llms.txt: הפלטפורמה מחליטה' },
  { id: 'schema', label: 'נתונים מובנים' },
  { id: 'basics', label: 'תיאור וכותרת ראשית' },
  { id: 'check', label: 'מה לבדוק באתר שלכם' },
  { id: 'method', label: 'איך נאסף המידע' },
]

const faq = [
  {
    id: 'insight-faq-gptbot',
    question: 'אם האתר חוסם את GPTBot, הוא לא יופיע ב-ChatGPT?',
    answer:
      'לא בהכרח. OpenAI מפעילה כמה רובוטים: GPTBot אוסף תוכן לאימון מודלים, OAI-SearchBot מביא אתרים לתוצאות החיפוש של ChatGPT, ו-ChatGPT-User נכנס לעמוד כשמשתמש מבקש אותו בשיחה. לפי התיעוד של OpenAI, אתר שחוסם רק את GPTBot עדיין יכול להופיע בתשובות החיפוש. כדי לצאת מהחיפוש צריך לחסום את OAI-SearchBot.',
  },
  {
    id: 'insight-faq-llms',
    question: 'צריך llms.txt כדי להופיע בתשובות של AI?',
    answer:
      'אין לכך עדות. llms.txt הוא קובץ טקסט שמציע למודלים רשימה של העמודים החשובים באתר, ולא קובץ הרשאות כמו robots.txt. גוגל אמרה שהיא לא משתמשת בו, ורוב האתרים במחקר שיש להם llms.txt קיבלו אותו אוטומטית מ-Wix או מ-Shopify. הוא לא מזיק, אבל הוא לא סיבה לכך שאתר מצוטט.',
  },
  {
    id: 'insight-faq-check',
    question: 'איך בודקים אם האתר שלי חוסם רובוטים של AI?',
    answer:
      'פותחים בדפדפן את הכתובת של האתר עם ‎/robots.txt בסוף ומחפשים שורות User-agent עם GPTBot, OAI-SearchBot, ClaudeBot או PerplexityBot, ואחריהן Disallow: /. שורה שמתחילה ב-Content-Signal מסמנת קובץ שמנהלת Cloudflare. חסימה ברמת חומת האש של Cloudflare לא מופיעה בקובץ, ואותה רואים רק בלוח הבקרה של Cloudflare.',
  },
  {
    id: 'insight-faq-reuse',
    question: 'אפשר להשתמש בנתונים?',
    answer:
      'כן. הטבלה המלאה לפי פלטפורמה זמינה להורדה כקובץ CSV בעמוד הזה. אפשר לצטט ולפרסם את המספרים עם קישור לעמוד כמקור.',
  },
]

export const metadata = pageMetadata({
  title: SEO_TITLE,
  description: DESCRIPTION,
  path: PATH,
  type: 'article',
  publishedTime: PUBLISHED,
  modifiedTime: PUBLISHED,
})

function Bars({ rows }: { rows: { label: string; part: number; total: number }[] }) {
  return (
    <div className={insight.bars}>
      {rows.map((row) => (
        <div key={row.label} className={insight.bar}>
          <span>{row.label}</span>
          <span className={insight.barTrack} aria-hidden="true">
            <span className={insight.barFill} style={{ width: `${row.total ? (100 * row.part) / row.total : 0}%` }} />
          </span>
          <span className={insight.barValue}>{percent(row.part, row.total)}</span>
        </div>
      ))}
    </div>
  )
}

export default function AiSearchReadinessPage() {
  const url = `${SITE_URL}${PATH}`
  const platforms = PLATFORM_ORDER.map((name) => ({ name, data: readiness.byPlatform[name] })).filter((entry) => entry.data.total >= 50)

  return (
    <>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'Article',
          '@id': `${url}#article`,
          headline: TITLE,
          description: DESCRIPTION,
          inLanguage: 'he',
          url,
          datePublished: PUBLISHED,
          dateModified: PUBLISHED,
          author: { '@id': personId('vadim') },
          publisher: { '@id': ORG_ID },
          about: { '@id': `${url}#dataset` },
        }}
      />
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'Dataset',
          '@id': `${url}#dataset`,
          name: 'מוכנות אתרי עסקים בישראל לחיפוש ב-AI, 2026',
          alternateName: 'Israeli business websites and AI search readiness, 2026',
          description: `עמוד הבית, robots.txt ו-llms.txt של ${sites} אתרי ‎.co.il בעברית: חסימת רובוטים של AI, llms.txt, נתונים מובנים, תיאור ו-H1, לפי פלטפורמה.`,
          url,
          creator: { '@id': ORG_ID },
          license: 'https://creativecommons.org/licenses/by/4.0/',
          isAccessibleForFree: true,
          inLanguage: 'he',
          spatialCoverage: { '@type': 'Place', name: 'Israel' },
          temporalCoverage: `${readiness.seenFrom}/${readiness.seenTo}`,
          variableMeasured: ['robots.txt AI bot blocks', 'llms.txt', 'JSON-LD types', 'meta description', 'H1'],
          distribution: [{ '@type': 'DataDownload', encodingFormat: 'text/csv', contentUrl: `${SITE_URL}${CSV_PATH}` }],
        }}
      />
      <JsonLd
        data={breadcrumbList([
          { name: 'דף הבית', path: '/' },
          { name: CRUMB, path: PATH },
        ])}
      />
      <JsonLd data={faqPage({ path: PATH, entries: faq })!} />
      <Header />
      <main id="main-content">
        <article className={styles.article}>
          <div className={styles.inner}>
            <nav className={styles.crumbs} aria-label="פירורי לחם">
              <Link href="/" className={styles.crumbLink}>
                דף הבית
              </Link>
              <ChevronPrevIcon className={styles.crumbChevron} />
              <span className={styles.crumbCurrent} aria-current="page">
                {CRUMB}
              </span>
            </nav>

            <header className={styles.head}>
              <p className={styles.meta}>
                <span className={styles.category}>מחקר</span>
                <span className={styles.metaDot} aria-hidden="true" />
                <span>נובמבר 2026</span>
              </p>
              <h1 className={styles.title}>{TITLE}</h1>
              <p className={styles.lede}>
                {percent(all.blocksGptbot, all.total)} מאתרי העסקים בישראל חוסמים ב-robots.txt את GPTBot, הרובוט שבו OpenAI
                אוספת תוכן לאימון מודלים. את OAI-SearchBot, שמביא אתרים לתשובות החיפוש של ChatGPT, חוסמים רק{' '}
                {percent(all.blocksOaiSearch, all.total)}. {cloudflareShare} מהחסימות באות מקובץ robots.txt שמנהלת Cloudflare,
                ולא משורות שבעל האתר כתב. llms.txt נמצא ב-{percent(all.llms, all.total)} מהאתרים, ו-{llmsFromBuilders} מהם
                בנויים על Wix או Shopify, שמייצרות את הקובץ לבד.
              </p>
              <div className={insight.figures}>
                <p className={insight.figure}>
                  <span className={insight.figureValue}>{percent(all.blocksGptbot, all.total)}</span>
                  <span className={insight.figureLabel}>חוסמים את GPTBot</span>
                </p>
                <p className={insight.figure}>
                  <span className={insight.figureValue}>{percent(all.blocksOaiSearch, all.total)}</span>
                  <span className={insight.figureLabel}>חוסמים את החיפוש של ChatGPT</span>
                </p>
                <p className={insight.figure}>
                  <span className={insight.figureValue}>{percent(all.faqPage, all.total)}</span>
                  <span className={insight.figureLabel}>מסמנים שאלות ותשובות (FAQPage)</span>
                </p>
                <p className={insight.figure}>
                  <span className={insight.figureValue}>{percent(all.noDescription, all.total)}</span>
                  <span className={insight.figureLabel}>בלי תיאור מטא בעמוד הבית</span>
                </p>
              </div>
            </header>

            <div className={styles.layout}>
              <aside className={[styles.aside, styles.asideStart].join(' ')}>
                <ArticleToc entries={toc} />
              </aside>

              <div className={styles.main}>
                <div className={styles.tocMobile}>
                  <ArticleToc entries={toc} collapsible />
                </div>

                <div className={styles.prose}>
                  <h2 id="blocking">מי חוסם רובוטים של AI</h2>
                  <p>
                    בדקנו את robots.txt של {sites} אתרים. ל-{percent(all.robots, all.total)} מהם יש קובץ כזה, ו-
                    {count(all.blocksAny)} ({percent(all.blocksAny, all.total)}) חוסמים לפחות רובוט AI אחד מכל האתר. כמעט כל
                    החסימות מכוונות לרובוטי אימון. רובוטים שמביאים אתרים לתשובות בזמן אמת כמעט לא נחסמים:
                  </p>
                  <div className={insight.tableWrap}>
                    <table>
                      <thead>
                        <tr>
                          <th>רובוט</th>
                          <th>תפקיד</th>
                          <th>חוסמים</th>
                        </tr>
                      </thead>
                      <tbody>
                        {AGENT_ROWS.map((agent) => (
                          <tr key={agent.id}>
                            <td>
                              <span dir="ltr">{agent.name}</span> ({agent.owner})
                            </td>
                            <td>{agent.purpose}</td>
                            <td>
                              {count(readiness.agents[agent.id])} ({percent(readiness.agents[agent.id], all.total)})
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <p>
                    המשמעות לעסק: מי שחוסם את GPTBot מונע מ-OpenAI ללמוד מהתוכן שלו, אבל לא יוצא בזה מהחיפוש של ChatGPT. מי
                    שחוסם את OAI-SearchBot או את PerplexityBot כן מוריד את עצמו מהתשובות של הכלים האלה, ומעט מאוד אתרים
                    עושים את זה.
                  </p>

                  <h2 id="cloudflare">רוב החסימות באות מ-Cloudflare</h2>
                  <p>
                    {percent(all.cloudflare, all.total)} מהאתרים עוברים דרך Cloudflare. ל-Cloudflare יש הגדרה שמנהלת את
                    robots.txt בשביל בעל האתר: היא מוסיפה שורת Content-Signal וחוסמת רשימה קבועה של רובוטי אימון. מתוך{' '}
                    {count(all.blocksAny)} האתרים שחוסמים רובוט AI, {count(all.cloudflareManagedBlock)} ({cloudflareShare})
                    משתמשים בקובץ הזה. כלומר, ברוב המקרים החסימה היא מתג בלוח הבקרה של Cloudflare, ולא החלטה שמישהו כתב
                    בקובץ.
                  </p>
                  <p>
                    זה לא בהכרח רע. אבל כדאי לדעת שהמתג קיים, ומי הפעיל אותו: לפעמים זה בעל העסק, ולפעמים זה מי שבנה את
                    האתר או מנהל את הדומיין.
                  </p>

                  <h2 id="llms">llms.txt: הפלטפורמה מחליטה, לא בעל האתר</h2>
                  <p>
                    llms.txt נמצא ב-{count(all.llms)} אתרים ({percent(all.llms, all.total)}). ההבדל בין הפלטפורמות גדול:
                  </p>
                  <Bars rows={platforms.map(({ name, data }) => ({ label: name, part: data.llms, total: data.total }))} />
                  <p>
                    ב-Wix ({percent(wix.llms, wix.total)}) וב-Shopify ({percent(shopify.llms, shopify.total)}) כמעט לכל אתר יש
                    llms.txt, כי הפלטפורמה יוצרת אותו לבד. ב-WordPress ({percent(wordpress.llms, wordpress.total)}) הקובץ מופיע
                    בעיקר כשתוסף SEO מייצר אותו. לכן קיום llms.txt באתר אומר מעט מאוד על מה שבעל האתר עשה, ועוד פחות על
                    הסיכוי שלו להופיע בתשובות של AI.
                  </p>

                  <h2 id="schema">נתונים מובנים: מי מסמן את העסק</h2>
                  <p>
                    נתונים מובנים (JSON-LD) עוזרים למנועי חיפוש ולמודלים להבין מי העסק, איפה הוא ומה הוא מוכר. בעמוד הבית של{' '}
                    {percent(all.jsonld, all.total)} מהאתרים יש JSON-LD כלשהו, אבל רק ב-{percent(all.organization, all.total)}{' '}
                    יש סימון של הארגון או העסק עצמו (Organization או LocalBusiness), ורק ב-{percent(all.faqPage, all.total)} יש
                    סימון של שאלות ותשובות.
                  </p>
                  <Bars rows={platforms.map(({ name, data }) => ({ label: name, part: data.organization, total: data.total }))} />
                  <p>הגרף מראה כמה מהאתרים בכל פלטפורמה מסמנים את העסק בעמוד הבית.</p>

                  <h2 id="basics">תיאור וכותרת ראשית</h2>
                  <p>
                    לפני AI יש בסיס שעוד חסר: ל-{percent(all.noDescription, all.total)} מהאתרים אין תיאור מטא בעמוד הבית, ול-
                    {percent(all.noH1, all.total)} אין כותרת H1. התיאור הוא הטקסט שגוגל מציג לרוב מתחת לקישור, וה-H1 אומר
                    לקורא ולמנוע על מה העמוד. בלי שניהם המנוע מנחש.
                  </p>

                  <h2 id="check">מה לבדוק באתר שלכם</h2>
                  <ol>
                    <li>
                      פתחו את <span dir="ltr">/robots.txt</span> וחפשו GPTBot, OAI-SearchBot ו-Content-Signal. אם אתם על
                      Cloudflare, בדקו בלוח הבקרה אם ניהול robots.txt פעיל ומה הוא חוסם.
                    </li>
                    <li>החליטו בנפרד על אימון ועל חיפוש. חסימת רובוט אימון לא מוציאה אתכם מהתשובות. חסימת רובוט חיפוש כן.</li>
                    <li>
                      ודאו שבעמוד הבית יש JSON-LD מסוג Organization או LocalBusiness עם שם, טלפון, כתובת וקישורים לפרופילים.
                    </li>
                    <li>כתבו תיאור מטא ו-H1 שאומרים מה העסק עושה ובאיזה אזור.</li>
                  </ol>
                  <p>
                    את כל זה בודק בחינם <Link href="/tools/ai-readiness-checker">בודק הנראות שלנו בבינה מלאכותית</Link>. אם
                    אתם רוצים שמישהו יסדר את זה בשבילכם, זה חלק מ<Link href="/services/seo">קידום האתר</Link> שאנחנו עושים.
                  </p>

                  <h2 id="method">איך נאסף המידע</h2>
                  <ul>
                    <li>
                      רשימת האתרים: {count(readiness.answered)} דומיינים ב-‎.il עם עמוד בית בעברית שענה, מתוך סריקת הקישורים
                      שלנו בין אתרים ישראליים. במחקר נספרו {sites} דומיינים ב-‎.co.il. עוד {count(readiness.orgIl.total)}{' '}
                      ב-‎.org.il לא נכללו במספרים שלמעלה.
                    </li>
                    <li>
                      תאריכי הבדיקה: {readiness.seenFrom} עד {readiness.seenTo}. לכל אתר נקראו עמוד הבית (עד 2MB של HTML),{' '}
                      <span dir="ltr">/robots.txt</span> ו-<span dir="ltr">/llms.txt</span>, עם הזיהוי{' '}
                      <span dir="ltr">AiterraSiteCensus/1.0</span>.
                    </li>
                    <li>
                      &quot;חוסם&quot; פירושו <span dir="ltr">Disallow: /</span> לרובוט בשמו, או לכל הרובוטים כשאין לו קבוצה
                      משלו, בלי <span dir="ltr">Allow: /</span>. חסימה ברמת חומת האש של Cloudflare לא נראית בקובץ, ולכן
                      השיעור האמיתי של חסימות גבוה יותר.
                    </li>
                    <li>
                      llms.txt נספר רק כשהכתובת החזירה טקסט (לא HTML) באורך של יותר מ-50 תווים. הפלטפורמה זוהתה לפי סימנים
                      בקוד של עמוד הבית. JSON-LD נספר רק כשהוא נמצא ב-HTML שהשרת שלח, ולא כשהוא נוסף בדפדפן.
                    </li>
                    <li>
                      בדקנו רק את מה שגלוי באתר. אין במחקר הערכה משפטית של אף אתר, ואין בו שמות של אתרים.
                    </li>
                  </ul>
                  <p>
                    <a href={CSV_PATH} className={insight.download} download>
                      הורדת הנתונים לפי פלטפורמה (CSV)
                    </a>
                  </p>
                  <blockquote>
                    לציטוט: Aiterra, &quot;{TITLE}&quot;, נובמבר 2026, <span dir="ltr">aiterra.co.il{PATH}</span>
                  </blockquote>
                </div>
              </div>
            </div>
          </div>
        </article>

        <Faq heading={['שאלות על המחקר']} entries={faq} />
      </main>
      <Footer>
        <ContactForm variant="footer" source="v2-insights-ai-search-readiness" />
      </Footer>
    </>
  )
}
