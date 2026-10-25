import Link from 'next/link'
import ToolLayout, { toolMetadata, type ToolFaqEntry } from '../../components/tools/ToolLayout'
import LlmsTxtGenerator from '../../components/tools/LlmsTxtGenerator'
import styles from './page.module.css'

const PATH = '/tools/llms-txt-generator'
const TITLE = 'מחולל llms.txt ו-robots.txt לבוטים של AI'
const META_TITLE = 'מחולל llms.txt ו-robots.txt לבוטים של AI | חינם'
const DESCRIPTION =
  'יוצרים קובץ llms.txt לפי המפרט ובלוק robots.txt עם כללים ל-GPTBot, OAI-SearchBot, ClaudeBot, PerplexityBot, Google-Extended ועוד. מבדילים בין בוטים של חיפוש לבוטים של אימון.'

const faq: ToolFaqEntry[] = [
  {
    id: 'llms-faq-what',
    question: 'מה זה llms.txt?',
    answer:
      'הצעה לקובץ טקסט בפורמט Markdown בכתובת /llms.txt, שמציג למודלי שפה ולסוכנים תקציר של האתר ורשימת קישורים חשובים. לפי המפרט בכתובת llmstxt.org, הכותרת הראשית עם שם האתר היא החלק היחיד שחובה בו. אחריה בא ציטוט עם תקציר, אפשר להוסיף פסקאות בלי כותרות, ואחר כך סעיפים עם רשימות קישורים. הסעיף Optional מיועד, לפי המוסכמה, למידע משני שאפשר לדלג עליו.',
  },
  {
    id: 'llms-faq-google',
    question: 'גוגל משתמשת ב-llms.txt?',
    answer:
      'לא. במדריך של גוגל לאופטימיזציה לתכונות AI בחיפוש כתוב שאין צורך ליצור קבצים לקריאת מכונה, קבצי טקסט ל-AI או Markdown כדי להופיע בחיפוש של גוגל, כולל התכונות הגנרטיביות שלו, כי חיפוש גוגל עצמו לא משתמש בהם, ושאפשר להתעלם מקבצי AI מיותרים כמו llms.txt. לכן הקובץ לא ישפיע על הדירוג בגוגל או על הופעה ב-AI Overviews.',
  },
  {
    id: 'llms-faq-others',
    question: 'אז למה ליצור אותו?',
    answer:
      'הקובץ הוא הצעה של הקהילה ולא תקן שמחייב מערכת כלשהי. אין לנו אישור רשמי שסורקי החיפוש של ספקי ה-AI הגדולים קוראים אותו. הוא זול ליצירה, ויכול לשמש כלי עבודה וסוכנים שמבקשים אותו במפורש, למשל כשמשתמש מצביע עליו, אבל אל תצפו שהוא יעלה את הנראות או את מספר הציטוטים שלכם.',
  },
  {
    id: 'llms-faq-search-training',
    question: 'מה ההבדל בין בוט חיפוש לבוט אימון?',
    answer:
      'בוט חיפוש, כמו OAI-SearchBot, Claude-SearchBot ו-PerplexityBot, בונה אינדקס כדי להציג ולצטט אתרים בתשובות. בוט אימון, כמו GPTBot ו-ClaudeBot, אוסף תוכן שעשוי לשמש לאימון מודלים. אפשר לחסום אימון ולהישאר בחיפוש: OpenAI, למשל, מפרידה בין OAI-SearchBot ל-GPTBot ומציינת ש-GPTBot אחראי רק על אימון.',
  },
  {
    id: 'llms-faq-google-extended',
    question: 'חסימת Google-Extended מורידה אותי מחיפוש גוגל?',
    answer:
      'לא. לפי הדף של גוגל על הסורקים שלה, Google-Extended לא משפיע על הכללת האתר בחיפוש גוגל ואינו אות דירוג. הוא קובע אם התוכן ישמש לאימון מודלי Gemini ולביסוס תשובות באפליקציית Gemini וב-Vertex AI.',
  },
  {
    id: 'llms-faq-user',
    question: 'robots.txt חוסם גם בקשות של משתמשים לעוזר AI?',
    answer:
      'לא תמיד. OpenAI מציינת ש-ChatGPT-User פועל לפי בקשת משתמש ולכן כללי robots.txt אולי לא יחולו עליו, ו-Perplexity מציינת ש-Perplexity-User בדרך כלל מתעלם מ-robots.txt מאותה סיבה. חסימה אמינה של בקשות כאלה דורשת חסימה בשרת או בחומת אש, לפי כתובות ה-IP שהחברות מפרסמות.',
  },
  {
    id: 'llms-faq-merge',
    question: 'אפשר להחליף את ה-robots.txt הקיים בקובץ שנוצר?',
    answer:
      'עדיף לא. הבלוק שנוצר מכיל רק כללים לבוטים של AI. אם יש בקובץ שלכם כללים אחרים, כמו נתיבי ניהול או מפת אתר, הוסיפו את הבלוק אליו. סורק שיש לו קבוצה משלו בקובץ לא קורא את הכללים של User-agent: *, ולכן נתיבים שאסור לסרוק צריך לחזור בכל קבוצה, וזה מה שהכלי עושה בעבורכם.',
  },
]

export const metadata = toolMetadata({ path: PATH, metaTitle: META_TITLE, description: DESCRIPTION })

export default function LlmsTxtGeneratorPage() {
  return (
    <ToolLayout
      path={PATH}
      title={TITLE}
      metaTitle={META_TITLE}
      description={DESCRIPTION}
      lede="ממלאים שם, תיאור וכמה קישורים ומקבלים קובץ llms.txt לפי המפרט. בוחרים אילו בוטים של AI להכניס ואילו לחסום ומקבלים בלוק robots.txt מוכן. הכל בדפדפן, ובלי הרשמה."
      chips={['llms.txt לפי llmstxt.org', 'robots.txt ל-12 בוטים', 'חיפוש מול אימון', 'שקוף לגבי מה זה לא עושה']}
      tool={<LlmsTxtGenerator />}
      faq={faq}
      cta={{
        text: 'רוצים שהאתר יצוטט בתשובות של ChatGPT, Gemini ו-Perplexity? הקבצים האלה הם החלק הקטן. אנחנו בונים גם את התוכן והמבנה שהמנועים מצטטים.',
        label: 'לשירות קידום בחיפוש AI',
        href: '/services/ai-search',
      }}
    >
      <h2>מה הקבצים האלה עושים ומה לא</h2>
      <p>
        <strong>robots.txt</strong> הוא הכלי שבאמת קיים כדי לשלוט בסורקים: סורק מכבד אותו או לא, אבל הוא הערוץ שחברות
        ה-AI עצמן מתעדות. <strong>llms.txt</strong> הוא הצעה לתקציר קריא למודלים. הוא לא מחליף את robots.txt, אינו מגביל
        גישה, וגוגל מצהירה במפורש שהיא לא משתמשת בו. מי שמצפה שהקובץ יגדיל ציטוטים בתשובות AI יתאכזב, ומי שרוצה סדר
        ושליטה צריך להתחיל מ-robots.txt.
      </p>

      <h2>בוט חיפוש, בוט משתמש ובוט אימון</h2>
      <p>הכלי מחלק את הבוטים לשלוש קבוצות, כי ההחלטה לגביהן שונה:</p>
      <ul>
        <li>
          <strong>חיפוש:</strong> OAI-SearchBot של OpenAI, Claude-SearchBot של Anthropic, PerplexityBot ו-Bingbot. חסימה
          מוציאה אתכם מהתשובות של אותו שירות. OpenAI ו-Perplexity ממליצות לאפשר אותם אם רוצים להופיע.
        </li>
        <li>
          <strong>בקשת משתמש:</strong> ChatGPT-User, Claude-User ו-Perplexity-User. הם פועלים כשמשתמש מבקש מהעוזר
          לקרוא עמוד. חלק מהספקים לא מחייבים אותם ב-robots.txt.
        </li>
        <li>
          <strong>אימון:</strong> GPTBot, ClaudeBot, CCBot, ואותות הבקרה Google-Extended ו-Applebot-Extended. חסימה
          אומרת שהתוכן לא ישמש לאימון, בלי השפעה על הופעה בחיפוש של אותה חברה.
        </li>
      </ul>
      <p>
        ברירת המחדל בכלי היא להישאר בחיפוש ולחסום אימון. זו החלטה עסקית: מי שמעדיף שהתוכן שלו לא ישמש לאימון חוסם,
        ומי שרוצה את הנראות המרבית מאפשר הכל. שום חסימה ב-robots.txt אינה אכיפה, והיא מבוססת על מחויבות הסורק.
      </p>

      <h2>איך משתמשים בקבצים</h2>
      <ol>
        <li>
          מורידים את <span dir="ltr">llms.txt</span> ומעלים לשורש האתר, כך שהוא נגיש בכתובת /llms.txt.
        </li>
        <li>מוסיפים את הבלוק של robots.txt לקובץ הקיים. לא מוחקים כללים שכבר יש שם.</li>
        <li>
          בודקים בדפדפן ששני הקבצים נטענים, ושה-robots.txt לא חוסם את Googlebot בטעות. אפשר לבדוק את מוכנות האתר ל-AI
          ב<Link href="/tools/ai-readiness-checker">בודק המוכנות לחיפוש AI</Link>.
        </li>
      </ol>

      <h2>מקורות</h2>
      <ul>
        <li>
          <a href="https://llmstxt.org/" rel="noopener" target="_blank">
            llmstxt.org: מפרט הקובץ
          </a>
        </li>
        <li>
          <a href="https://developers.google.com/search/docs/fundamentals/ai-optimization-guide" rel="noopener" target="_blank">
            Google Search Central: אופטימיזציה לתכונות AI בחיפוש
          </a>
        </li>
        <li>
          <a href="https://developers.google.com/crawling/docs/crawlers-fetchers/google-common-crawlers" rel="noopener" target="_blank">
            Google: הסורקים הנפוצים (Google-Extended)
          </a>
        </li>
        <li>
          <a href="https://platform.openai.com/docs/bots" rel="noopener" target="_blank">
            OpenAI: סקירת הסורקים
          </a>
        </li>
        <li>
          <a
            href="https://support.claude.com/en/articles/8896518-does-anthropic-crawl-data-from-the-web-and-how-can-site-owners-block-the-crawler"
            rel="noopener"
            target="_blank"
          >
            Anthropic: האם Claude סורק את הרשת
          </a>
        </li>
        <li>
          <a href="https://docs.perplexity.ai/guides/bots" rel="noopener" target="_blank">
            Perplexity: הסורקים
          </a>
        </li>
        <li>
          <a href="https://support.apple.com/en-us/119829" rel="noopener" target="_blank">
            Apple: Applebot ו-Applebot-Extended
          </a>
        </li>
        <li>
          <a href="https://commoncrawl.org/ccbot" rel="noopener" target="_blank">
            Common Crawl: CCBot
          </a>
        </li>
      </ul>
      <p className={styles.reviewed}>
        שמות הבוטים והתיאורים נבדקו מול התיעוד הרשמי של כל חברה באוקטובר 2026. חברות מוסיפות ומשנות סורקים, ולכן כדאי
        לבדוק את התיעוד לפני שמסתמכים על רשימה.
      </p>
    </ToolLayout>
  )
}
