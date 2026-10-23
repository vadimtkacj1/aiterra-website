import Link from 'next/link'
import ToolLayout, { toolMetadata, type ToolFaqEntry } from '../../components/tools/ToolLayout'
import AiReadinessChecker from '../../components/tools/AiReadinessChecker'
import { CHECKED_ON, CHECKED_ON_LONG, DOCS, buildRobotsSnippet, crawlers, kindInfo } from '@/lib/ai-readiness'
import styles from './page.module.css'

const PATH = '/tools/ai-readiness-checker'
const TITLE = 'בדיקת נראות האתר בבינה מלאכותית'
const META_TITLE = 'בדיקת נראות בבינה מלאכותית: ChatGPT רואה את האתר?'
const DESCRIPTION =
  'בדיקה חינמית אם ChatGPT, Gemini, Perplexity ו-Claude יכולים לקרוא את האתר: robots.txt לכל בוט, חסימה ב-Cloudflare, noindex ותוכן שנטען ב-JavaScript.'

const exampleRobots = [
  buildRobotsSnippet({ blockTraining: true, starRules: [{ allow: false, pattern: '/admin' }] }).text,
  '',
  'User-agent: *',
  'Disallow: /admin',
  '',
  'Sitemap: https://www.example.co.il/sitemap.xml',
].join('\n')

const sources: { href: string; label: string; note: string }[] = [
  {
    href: DOCS.openai,
    label: 'OpenAI: Overview of OpenAI Crawlers',
    note: 'OAI-SearchBot, ChatGPT-User ו-GPTBot, ההבדל בין חיפוש לאימון, וכ-24 שעות עד ששינוי ב-robots.txt משפיע',
  },
  {
    href: DOCS.googleCrawlers,
    label: 'Google: Google’s common crawlers',
    note: 'Googlebot ו-Google-Extended, כולל המשפט ש-Google-Extended לא משפיע על ההופעה בחיפוש גוגל ועל הדירוג',
  },
  {
    href: DOCS.googleAiFeatures,
    label: 'Google: AI features and your website',
    note: 'מה צריך כדי להופיע כקישור ב-AI Overviews וב-AI Mode, ו-nosnippet, max-snippet ו-noindex',
  },
  {
    href: DOCS.anthropic,
    label: 'Anthropic: Does Anthropic crawl data from the web, and how can site owners block the crawler?',
    note: 'ClaudeBot, Claude-SearchBot ו-Claude-User, ושהבוטים של Anthropic מכבדים את robots.txt',
  },
  {
    href: DOCS.perplexity,
    label: 'Perplexity: Perplexity Crawlers',
    note: 'PerplexityBot ו-Perplexity-User, ושהשני בדרך כלל מתעלם מ-robots.txt',
  },
  {
    href: DOCS.bing,
    label: 'Bing Webmaster: Which crawlers does Bing use?',
    note: 'Bingbot',
  },
  {
    href: DOCS.bingCopilot,
    label: 'Bing Webmaster Blog, ספטמבר 2023: אפשרויות לשלוט בשימוש בתוכן ב-Bing Chat',
    note: 'noarchive ו-nocache',
  },
  {
    href: DOCS.apple,
    label: 'Apple: About Applebot',
    note: 'Applebot-Extended, ושהוא לא משפיע על ההופעה בחיפוש של Apple',
  },
  {
    href: DOCS.commonCrawl,
    label: 'Common Crawl: CCBot',
    note: 'שם הבוט ואיך חוסמים אותו',
  },
  {
    href: DOCS.commonCrawlFaq,
    label: 'Common Crawl: FAQ',
    note: 'CCBot בודק את robots.txt ולא מריץ JavaScript',
  },
  {
    href: DOCS.meta,
    label: 'Meta: Web crawlers',
    note: 'meta-externalagent ו-meta-webindexer',
  },
  {
    href: DOCS.bytespider,
    label: 'Cloudflare Blog, יולי 2024: Declaring your AIndependence',
    note: 'Bytespider של ByteDance, שאין לו תיעוד רשמי',
  },
  {
    href: DOCS.cloudflareDefault,
    label: 'Cloudflare Blog, 1 ביולי 2025: Content Independence Day',
    note: 'השינוי בברירת המחדל לדומיינים חדשים',
  },
  {
    href: DOCS.cloudflareAiBots,
    label: 'Cloudflare Docs: Block AI bots',
    note: 'מה ההגדרה חוסמת, וההחלפה שלה ב-AI bot policies ב-15 בספטמבר 2026',
  },
  {
    href: DOCS.cloudflareManagedRobots,
    label: 'Cloudflare Docs: Managed robots.txt',
    note: 'הבלוק ש-Cloudflare מוסיף ל-robots.txt ושורת Content-Signal',
  },
  {
    href: DOCS.vercel,
    label: 'Vercel, דצמבר 2024: The rise of the AI crawler',
    note: 'בוטי ה-AI הגדולים לא מריצים JavaScript, חוץ מ-Gemini ו-Applebot',
  },
  {
    href: DOCS.llmstxt,
    label: 'llmstxt.org',
    note: 'ההצעה המקורית ל-llms.txt, ספטמבר 2024',
  },
  {
    href: DOCS.roundtable,
    label: 'Search Engine Roundtable, יוני 2025: Google on llms.txt',
    note: 'ג׳ון מולר: אף מערכת AI לא משתמשת היום ב-llms.txt',
  },
  {
    href: DOCS.searchEngineLand,
    label: 'Search Engine Land, יולי 2025: Google says normal SEO works for ranking in AI Overviews',
    note: 'גארי איליש: גוגל לא תומכת ב-llms.txt',
  },
  {
    href: DOCS.rfc9309,
    label: 'RFC 9309: Robots Exclusion Protocol',
    note: 'קבוצות לפי שם בוט, הכלל הארוך ביותר, ומה קורה כש-robots.txt מחזיר 4xx או 5xx',
  },
]

const faq: ToolFaqEntry[] = [
  {
    id: 'ai-readiness-faq-chatgpt',
    question: 'האם ChatGPT רואה את האתר שלי?',
    answer:
      'כדי להופיע בתשובות החיפוש של ChatGPT, האתר צריך להיות פתוח לבוט OAI-SearchBot. אם robots.txt חוסם אותו, לפי OpenAI האתר לא יוצג בתשובות החיפוש, לכל היותר כקישור ניווט. כשמשתמש מבקש מ-ChatGPT לפתוח דף, נכנס ChatGPT-User. הכלי בודק את שני הבוטים, ובודק גם אם Cloudflare או חומת אש חוסמים בוטים עוד לפני שהם מגיעים ל-robots.txt.',
  },
  {
    id: 'ai-readiness-faq-gptbot',
    question: 'מה ההבדל בין GPTBot ל-OAI-SearchBot?',
    answer:
      'GPTBot אוסף תוכן לאימון המודלים של OpenAI, ו-OAI-SearchBot מוצא דפים לתשובות החיפוש של ChatGPT. לפי OpenAI הם נפרדים: אפשר לחסום את GPTBot ולהשאיר את OAI-SearchBot פתוח, והאתר ימשיך להופיע בחיפוש של ChatGPT בלי שהתוכן ישמש לאימון. חסימה של OAI-SearchBot, לעומת זאת, מוציאה את האתר מהתשובות.',
  },
  {
    id: 'ai-readiness-faq-google-extended',
    question: 'האם חסימת Google-Extended מוציאה אותי מ-AI Overviews?',
    answer:
      'לא. לפי גוגל, Google-Extended לא משפיע על ההופעה בחיפוש גוגל ולא על הדירוג. AI Overviews ו-AI Mode הם חלק מהחיפוש, ולכן מה שקובע הוא Googlebot ותגיות כמו noindex, nosnippet ו-max-snippet. Google-Extended קובע אם התוכן ישמש לאימון Gemini ולביסוס תשובות באפליקציית Gemini וב-Vertex AI.',
  },
  {
    id: 'ai-readiness-faq-llms',
    question: 'צריך קובץ llms.txt?',
    answer:
      'לא חובה. llms.txt הוא הצעה מ-2024, לא תקן. ג׳ון מולר מגוגל כתב ביוני 2025 שאף מערכת AI לא משתמשת בו, וגארי איליש אמר שגוגל לא תומכת בו. אף מערכת חיפוש AI גדולה לא אישרה רשמית שהיא קוראת אותו. אין נזק ביצירה שלו, אבל לפני כן כדאי לוודא ש-robots.txt, השרת והטקסט ב-HTML פתוחים לבוטים.',
  },
  {
    id: 'ai-readiness-faq-cloudflare',
    question: 'למה הבוטים חסומים אם ב-robots.txt הכול פתוח?',
    answer:
      'כי חסימה יכולה לקרות לפני ש-robots.txt נקרא. Cloudflare, חומות אש ותוספי אבטחה מחזירים לבוטים 403 או דף אימות לפי השם שלהם או לפי כתובת ה-IP. ב-Cloudflare זו ההגדרה AI bot policies, או Block AI bots בגרסה הישנה. הכלי מזהה דפי אימות וחסימה לפי שם הבוט, אבל את מה שמקבל הבוט האמיתי רואים רק בדשבורד של Cloudflare.',
  },
  {
    id: 'ai-readiness-faq-training',
    question: 'כדאי לחסום בוטים שאוספים תוכן לאימון?',
    answer:
      'זו החלטה עסקית. לפי OpenAI ו-Apple, חסימה של GPTBot ושל Applebot-Extended לא מוציאה את האתר מהחיפוש שלהן, ול-Anthropic יש בוט נפרד לחיפוש, Claude-SearchBot. מה שמשתנה הוא שהתוכן לא ישמש לאימון מודלים עתידיים. עסק שרוצה שהמודלים יכירו אותו בדרך כלל משאיר אותם פתוחים, ואתר שמוכר תוכן נוטה לחסום.',
  },
]

export const metadata = toolMetadata({ path: PATH, metaTitle: META_TITLE, description: DESCRIPTION })

export default function AiReadinessCheckerPage() {
  return (
    <ToolLayout
      path={PATH}
      title={TITLE}
      metaTitle={META_TITLE}
      description={DESCRIPTION}
      lede="כדי להופיע בתשובות החיפוש של ChatGPT, האתר צריך להיות פתוח לבוט OAI-SearchBot, וחסימת GPTBot מונעת רק אימון. כאן מקלידים כתובת ובודקים מה robots.txt, השרת ו-Cloudflare מתירים לכל בוט, ואם הטקסט נמצא ב-HTML."
      chips={['robots.txt לכל בוט AI', 'חסימה ב-Cloudflare ו-noindex', 'טקסט בלי JavaScript וסכמה', 'בחינם ובלי הרשמה']}
      tool={<AiReadinessChecker />}
      faq={faq}
      cta={{
        text: 'אנחנו מתקנים את מה שחוסם את האתר בפני ChatGPT, Gemini ו-Perplexity, ובונים את התוכן והסכמה שמנועי AI מצטטים.',
        label: 'קידום ב-AI',
        href: '/services/ai-search',
      }}
    >
      <h2 id="can-chatgpt-read" className={styles.anchor}>
        האם ChatGPT יכול לקרוא את האתר שלכם
      </h2>
      <p>
        כדי ש-ChatGPT, Perplexity או AI Overviews של גוגל יצטטו את האתר, בוט צריך קודם להגיע לדף ולקרוא אותו. זה נשמע
        מובן מאליו, אבל יש ארבע נקודות שבהן זה נעצר, ובדרך כלל בלי שבעל האתר יודע:
      </p>
      <ol>
        <li>
          <strong>robots.txt.</strong> קובץ בשורש האתר שאומר לכל בוט, לפי השם שלו, לאן מותר לו להיכנס. שורה אחת של{' '}
          <code dir="ltr">Disallow: /</code> תחת <code dir="ltr">User-agent: *</code> חוסמת את כולם.
        </li>
        <li>
          <strong>השרת וה-CDN.</strong> חומת אש, תוסף אבטחה או Cloudflare יכולים להחזיר לבוט 403 או דף אימות, גם
          כש-robots.txt מתיר לו להיכנס.
        </li>
        <li>
          <strong>noindex ו-nosnippet.</strong> תגיות שאומרות למנוע חיפוש לא להכניס את הדף לאינדקס או לא להציג ממנו
          טקסט. לפי גוגל, דף צריך להיות באינדקס וזכאי להצגת קטע טקסט כדי להופיע כקישור ב-AI Overviews וב-AI Mode.
        </li>
        <li>
          <strong>תוכן שנבנה ב-JavaScript.</strong> אם הטקסט מגיע לדף רק אחרי שהדפדפן מריץ קוד, רוב הבוטים של AI רואים
          דף כמעט ריק.
        </li>
      </ol>
      <p>
        הכלי בודק את ארבעתן מול האתר עצמו. הוא לא שואל מודל אם הוא מכיר את העסק שלכם. בשביל זה יש את המדריך{' '}
        <Link href="/blog/chatgpt-about-your-business">מה ChatGPT אומר על העסק שלכם ואיך לבדוק</Link>. וגם כשהכול פתוח,
        זה רק התנאי הראשון לציטוט, לא הבטחה.
      </p>
      <h3>איך לקרוא את התוצאה</h3>
      <ul>
        <li>
          <strong>בעיה:</strong> משהו שמונע מבוט לקרוא את הדף או לצטט אותו, למשל חסימה של OAI-SearchBot או noindex.
        </li>
        <li>
          <strong>לבדוק:</strong> משהו שעלול לחסום, או שחסר ועוזר, כמו דף אימות של Cloudflare או מפת אתר.
        </li>
        <li>
          <strong>לידיעה:</strong> לא נספר בסיכום. למשל בוטים שאוספים תוכן לאימון, שחסימה שלהם היא החלטה עסקית,
          ו-llms.txt.
        </li>
      </ul>

      <h2 id="bots" className={styles.anchor}>
        הבוטים של OpenAI, Google, Anthropic ו-Perplexity ומה כל אחד עושה
      </h2>
      <p>לכל חברה יש כמה בוטים, ולכל אחד תפקיד אחר. ההבחנה החשובה היא בין שלושה סוגים:</p>
      <ul>
        <li>
          <strong>בוטים של חיפוש</strong>, כמו OAI-SearchBot, Claude-SearchBot ו-PerplexityBot. הם קובעים אם האתר יופיע
          כמקור בתשובות, וחסימה שלהם מוציאה אתכם מהתשובות.
        </li>
        <li>
          <strong>בוטים שנכנסים בשביל משתמש</strong>, כמו ChatGPT-User, Claude-User ו-Perplexity-User. הם פותחים דף כשמשתמש
          שואל עליו. לפי OpenAI ו-Perplexity, ייתכן שהבוטים שלהן מהסוג הזה לא מצייתים ל-robots.txt, כי הבקשה באה מאדם.
        </li>
        <li>
          <strong>בוטים של אימון</strong>, כמו GPTBot, ClaudeBot ו-CCBot. הם אוספים תוכן לאימון מודלים. לפי OpenAI,
          חסימה של GPTBot לא מוציאה את האתר מהחיפוש של ChatGPT.
        </li>
      </ul>
      <p>
        אצל גוגל המצב שונה: אין בוט נפרד ל-AI. AI Overviews ו-AI Mode הם חלק מחיפוש גוגל, ולכן Googlebot הוא שקובע.
        Google-Extended הוא הרשאה ולא בוט: הוא קובע אם התוכן ישמש לאימון Gemini ולתשובות באפליקציית Gemini, ולפי גוגל
        אין לו השפעה על חיפוש גוגל ועל הדירוג. איך עסק ישראלי נכנס לתשובות של גוגל, במדריך{' '}
        <Link href="/blog/ai-overviews-israel">AI Overviews בגוגל: מה זה אומר לעסק ישראלי</Link>.
      </p>
      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <caption>הבוטים שהכלי בודק, לפי התיעוד הרשמי של כל חברה. נבדק ב-{CHECKED_ON}</caption>
          <thead>
            <tr>
              <th scope="col">בוט</th>
              <th scope="col">מה הוא עושה</th>
              <th scope="col">אם חוסמים אותו</th>
            </tr>
          </thead>
          <tbody>
            {crawlers.map((crawler) => (
              <tr key={crawler.token}>
                <th scope="row">
                  <a href={crawler.doc} rel="noopener" target="_blank" lang="en" dir="ltr" className={styles.token}>
                    {crawler.token}
                  </a>
                  <span className={styles.vendor}>
                    {crawler.vendor}, {kindInfo[crawler.kind].label}
                  </span>
                </th>
                <td data-label="מה הוא עושה">{crawler.role}</td>
                <td data-label="אם חוסמים אותו">{crawler.ifBlocked}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2 id="robots-txt" className={styles.anchor}>
        robots.txt מומלץ לנראות בבינה מלאכותית
      </h2>
      <p>
        אם המטרה היא להופיע בתשובות של ChatGPT, Claude ו-Perplexity, אלה השורות שכדאי שיהיו ב-robots.txt. בדוגמה בוטי
        האימון חסומים, וזו בחירה. אחרי בדיקה, הכלי מייצר גרסה לאתר שלכם, עם האזורים שכבר חסמתם ועם אפשרות להשאיר את
        בוטי האימון פתוחים.
      </p>
      <pre className={styles.example} dir="ltr" tabIndex={0} aria-label="דוגמה ל-robots.txt">
        <code>{exampleRobots}</code>
      </pre>
      <ul>
        <li>
          <strong>בוט עם קבוצה משלו מתעלם מהקבוצה הכללית.</strong> לפי התקן RFC 9309, כשיש בקובץ קבוצה עם השם של בוט, הוא
          פועל רק לפיה ולא לפי <code dir="ltr">User-agent: *</code>. לכן בדוגמה השורה{' '}
          <code dir="ltr">Disallow: /admin</code> מופיעה פעמיים.
        </li>
        <li>
          <strong>הכלל הארוך ביותר קובע.</strong> כשגם Allow וגם Disallow מתאימים לאותה כתובת, הכלל עם יותר תווים גובר,
          ובתיקו Allow גובר.
        </li>
        <li>
          <strong>שגיאת שרת ב-robots.txt חוסמת הכול.</strong> אם הקובץ מחזיר שגיאה 5xx, בוטים צריכים להניח שכל האתר
          חסום. אם הוא מחזיר 404, הם רשאים להיכנס לכל מקום.
        </li>
        <li>
          <strong>השינוי לא מיידי.</strong> לפי OpenAI, לוקח כ-24 שעות עד ששינוי ב-robots.txt משפיע על החיפוש של ChatGPT.
        </li>
      </ul>
      <p>
        לחסום את בוטי האימון או לא, זו החלטה עסקית. עסק שרוצה שהמודלים יכירו אותו בדרך כלל משאיר אותם פתוחים, ואתר
        שמוכר את התוכן שלו נוטה לחסום. אם תחסמו את Google-Extended, התוכן לא ישמש גם לתשובות באפליקציית Gemini, אבל
        האתר ימשיך להופיע בחיפוש גוגל וב-AI Overviews.
      </p>

      <h2 id="llms-txt" className={styles.anchor}>
        מה llms.txt עושה ומה לא
      </h2>
      <p>
        llms.txt הוא קובץ Markdown בשורש האתר, עם סיכום של האתר וקישורים לדפים החשובים, שנועד לעזור למודלי שפה להבין
        אותו. זו{' '}
        <a href={DOCS.llmstxt} rel="noopener" target="_blank">
          הצעה של ג׳רמי הווארד
        </a>{' '}
        מספטמבר 2024, לא תקן.
      </p>
      <p>
        בפועל אין עדות שמנועי AI משתמשים בו. ביוני 2025 כתב ג׳ון מולר מגוגל שאף מערכת AI לא משתמשת היום ב-llms.txt, לפי{' '}
        <a href={DOCS.roundtable} rel="noopener" target="_blank">
          Search Engine Roundtable
        </a>
        . ביולי 2025 אמר גארי איליש מגוגל שגוגל לא תומכת בקובץ ולא מתכננת לתמוך בו, לפי{' '}
        <a href={DOCS.searchEngineLand} rel="noopener" target="_blank">
          Search Engine Land
        </a>
        . אף מערכת חיפוש AI גדולה לא אישרה רשמית שהיא קוראת אותו.
      </p>
      <p>
        לכן הכלי מציג את llms.txt כ״לידיעה״ ולא כבעיה. אין נזק ביצירת הקובץ, והיא לוקחת כמה דקות, אבל הוא לא תחליף
        ל-robots.txt פתוח, לשרת שלא חוסם בוטים ולטקסט שנמצא ב-HTML.
      </p>

      <h2 id="javascript" className={styles.anchor}>
        למה תוכן שנטען ב-JavaScript לא נראה לבוטים
      </h2>
      <p>
        דפדפן מוריד את ה-HTML, מריץ את ה-JavaScript ובונה את הדף. רוב הבוטים של AI עוצרים בשלב הראשון. Vercel בדקה את
        התנועה של בוטי AI ברשת שלה ומצאה ש
        <a href={DOCS.vercel} rel="noopener" target="_blank">
          אף אחד מבוטי ה-AI הגדולים לא מריץ JavaScript
        </a>
        : GPTBot ו-ClaudeBot מורידים קבצי JavaScript אבל לא מריצים אותם. גם Common Crawl כותבת ב
        <a href={DOCS.commonCrawlFaq} rel="noopener" target="_blank">
          שאלות הנפוצות שלה
        </a>{' '}
        שהבוט שלה לא מריץ JavaScript. היוצאים מן הכלל לפי Vercel הם Gemini, שמשתמש בתשתית של Googlebot, ו-Applebot.
      </p>
      <p>
        המשמעות: אתר שבנוי כאפליקציה שרצה בדפדפן, למשל React בלי רינדור בצד השרת, נראה לבוטים האלה כמעט ריק. גם באתר
        רגיל חלק מהתוכן יכול להיעלם כך, למשל מחירים, שאלות ותשובות או ביקורות שנטענים אחרי שהדף עולה.
      </p>
      <p>
        הכלי סופר כמה מילים יש ב-HTML שהשרת מחזיר, בלי להריץ JavaScript, כמו שבוט רואה אותו. בדיקה ידנית: פותחים את הדף,
        לוחצים Ctrl+U ומחפשים משפט מהדף בקוד המקור. אם הוא לא שם, הפתרון הוא רינדור בצד השרת (SSR), דפים סטטיים או
        prerendering. מה לכתוב כדי שמנועי AI יצטטו את הדף, במדריך{' '}
        <Link href="/blog/geo-ai-search-optimization">GEO: קידום אתרים בעידן הבינה המלאכותית</Link>.
      </p>

      <h2 id="cloudflare" className={styles.anchor}>
        Cloudflare וחסימת בוטים של AI
      </h2>
      <p>
        הרבה אתרים יושבים מאחורי Cloudflare, ושם אפשר לחסום בוטים של AI ברמת הרשת, עוד לפני ש-robots.txt נקרא. ב-1
        ביולי 2025 Cloudflare{' '}
        <a href={DOCS.cloudflareDefault} rel="noopener" target="_blank">
          שינתה את ברירת המחדל
        </a>
        : כל דומיין חדש נשאל בהרשמה אם לאפשר בוטים של AI, וברירת המחדל היא חסימה.
      </p>
      <p>
        ההגדרה הישנה נקראת Block AI bots. היא חוסמת בוטים מאומתים שמסווגים כאוספי תוכן לאימון AI, וגם בוטים לא מאומתים
        שמתנהגים כמותם. לפי{' '}
        <a href={DOCS.cloudflareAiBots} rel="noopener" target="_blank">
          התיעוד של Cloudflare
        </a>
        , היא מוחלפת ב-15 בספטמבר 2026 בהגדרה AI bot policies, שבה מחליטים בנפרד על שלוש קטגוריות, Search, Agent
        ו-Training, ולכל אחת בוחרים Allow, Block או חסימה רק בדפים עם פרסומות. דומיינים חדשים מקבלים מאז חסימה של
        Training ו-Agent בדפים עם פרסומות, ו-Search נשאר פתוח.
      </p>
      <p>
        כשאחת הקטגוריות מוגדרת לחסימה, Cloudflare יכול גם{' '}
        <a href={DOCS.cloudflareManagedRobots} rel="noopener" target="_blank">
          להוסיף ל-robots.txt בלוק משלו
        </a>
        , עם Disallow ל-GPTBot, ל-ClaudeBot, ל-Google-Extended ולבוטים נוספים, ושורת Content-Signal. כך יוצא שבקובץ
        שבשרת שלכם הכול פתוח, ומה שבוטים מקבלים שונה.
      </p>
      <p>
        כך קרה גם אצלנו. ביוני 2026 גילינו ש-Cloudflare מחזיר 403 ל-GPTBot, ל-ClaudeBot ול-PerplexityBot ומוסיף
        ל-robots.txt שורות שחוסמות אותם, בזמן ש-Googlebot קיבל את האתר כרגיל, וה-robots.txt שלנו התיר לכולם להיכנס.
      </p>
      <h3>מה הכלי יכול לזהות ומה לא</h3>
      <ul>
        <li>
          <strong>מזהה:</strong> דף אימות או חסימה של Cloudflare ושל חומות אש מוכרות, את הבלוק המנוהל ב-robots.txt, ושגיאה
          שמגיעה רק כשהמילה GPTBot מופיעה ב-User-Agent של הבקשה.
        </li>
        <li>
          <strong>לא מזהה:</strong> מה מקבל GPTBot האמיתי. Cloudflare מזהה בוטים אמיתיים לפי כתובות IP וחתימות, והבקשה
          שלנו לא באה מהכתובות של OpenAI. לכן ״לא מצאנו חסימה״ לא מבטיח שאין.
        </li>
      </ul>
      <p>
        הדרך לבדוק בוודאות היא בדשבורד של Cloudflare: Security Settings, ואז Configure AI bot policies, או Block AI bots
        בחשבונות שעוד לא עברו. שם רואים מה מוגדר, ובאירועי האבטחה רואים אם בקשות של בוטים נחסמו.
      </p>

      <h2>מקורות</h2>
      <ul className={styles.sources}>
        {sources.map((source) => (
          <li key={source.href}>
            <a href={source.href} rel="noopener" target="_blank">
              {source.label}
            </a>
            : {source.note}
          </li>
        ))}
      </ul>
      <p className={styles.reviewed}>
        הבוטים, השמות וההגדרות בדף נבדקו מול התיעוד הרשמי של כל חברה ב-{CHECKED_ON_LONG}. החברות משנות את הבוטים ואת
        ההגדרות מדי פעם, ולכן לפני שינוי גדול כדאי לבדוק שוב את התיעוד.
      </p>
    </ToolLayout>
  )
}
