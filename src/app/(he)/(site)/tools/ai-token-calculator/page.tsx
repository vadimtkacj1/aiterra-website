import Link from 'next/link'
import ToolLayout, { toolMetadata, type ToolFaqEntry } from '../../components/tools/ToolLayout'
import AiTokenCalculator from '../../components/tools/AiTokenCalculator'
import { FALLBACK_USD_ILS } from '@/lib/ai-prices'
import { HEBREW_TOKEN_STUDY } from '@/lib/ai-glossary'
import {
  API_PRICES_AS_OF,
  ESTIMATOR,
  HEBREW_TO_ENGLISH_RATIO,
  TOKENS_PER_HEBREW_WORD,
  apiModels,
  formatIlsAmount,
  formatPerMillion,
  formatTokens,
  modelOf,
  providers,
  requestCost,
} from '@/lib/ai-tokens'
import { formatCount, formatFx, formatLongDate, formatShortDate } from '@/lib/whatsapp-api-cost'
import styles from './page.module.css'

const PATH = '/tools/ai-token-calculator'
const TITLE = 'מחשבון טוקנים ועלות API'
const META_TITLE = 'מחשבון טוקנים ועלות API בעברית: GPT, Claude, Gemini'
const DESCRIPTION =
  'כמה טוקנים יש בטקסט בעברית וכמה זה עולה ב-API של OpenAI, Anthropic ו-Google: מחירים רשמיים למיליון טוקנים, ועלות חודשית בשקלים לפי מספר הבקשות.'

const FX = FALLBACK_USD_ILS.rate
const AS_OF = formatShortDate(API_PRICES_AS_OF)
const AS_OF_LONG = formatLongDate(API_PRICES_AS_OF)
const SAMPLE_INPUT = 600
const SAMPLE_OUTPUT = 150
const SAMPLE_REQUESTS = 3000
const sampleRows = apiModels.map((model) => requestCost(model, SAMPLE_INPUT, SAMPLE_OUTPUT, SAMPLE_REQUESTS, FX))
const cheapest = sampleRows.reduce((best, row) => (row.usdPerMonth < best.usdPerMonth ? row : best), sampleRows[0])
const priciest = sampleRows.reduce((best, row) => (row.usdPerMonth > best.usdPerMonth ? row : best), sampleRows[0])
const SONNET = modelOf('claude-sonnet-5.5')
const GPT54 = modelOf('gpt-5.4')
const RATIO = new Intl.NumberFormat('he-IL', { maximumFractionDigits: 2 }).format(HEBREW_TO_ENGLISH_RATIO)
const PER_WORD = new Intl.NumberFormat('he-IL', { maximumFractionDigits: 2 }).format(TOKENS_PER_HEBREW_WORD)
const O200K = HEBREW_TOKEN_STUDY.results[0]
const CL100K = HEBREW_TOKEN_STUDY.results[1]
const percent = (value: number) => `${Math.round(value * 100)}%`

const sources: { href: string; label: string; note: string }[] = [
  {
    href: providers.openai.href,
    label: providers.openai.label,
    note: `מחירי GPT-6 ו-GPT-5.4 למיליון טוקנים, קלט ופלט, בתעריף Standard. נבדק ב-${AS_OF}`,
  },
  {
    href: providers.anthropic.href,
    label: providers.anthropic.label,
    note: `מחירי Claude Fable, Opus, Sonnet ו-Haiku, והמחיר של Haiku לפרומפט מעל 100 אלף טוקנים. נבדק ב-${AS_OF}`,
  },
  {
    href: 'https://claude.com/pricing',
    label: 'Anthropic: Claude Pricing',
    note: `אותם מחירי API, וההנחה של 50% בעיבוד באצווה (Batch). נבדק ב-${AS_OF}`,
  },
  {
    href: providers.google.href,
    label: providers.google.label,
    note: `מחירי Gemini בתעריף בתשלום, המחיר מעל 200 אלף טוקנים ב-Gemini 3.1 Pro, ותאריכי שינוי המחיר של Gemini 4 Argon ו-Gemini 3.8 Flash. נבדק ב-${AS_OF}`,
  },
  {
    href: 'https://github.com/openai/tiktoken',
    label: 'OpenAI: tiktoken',
    note: `הטוקנייזר שבו מדדנו את הטקסטים, גרסה ${ESTIMATOR.tiktokenVersion}, קידודים o200k_base ו-cl100k_base`,
  },
  {
    href: 'https://www.boi.org.il/roles/markets/exchangerates/',
    label: 'בנק ישראל: שערי חליפין יציגים',
    note: `שער ברירת המחדל, ${formatFx(FX)} ₪ לדולר ל-${formatShortDate(FALLBACK_USD_ILS.date)}. המחשבון טוען את השער העדכני`,
  },
]

const faq: ToolFaqEntry[] = [
  {
    id: 'ai-tokens-faq-what',
    question: 'מה זה טוקן ב-ChatGPT?',
    answer: `טוקן הוא חתיכת טקסט שהמודל קורא או כותב: מילה קצרה, חלק ממילה, מספר או סימן פיסוק. ספקי ה-API מחייבים לפי מספר הטוקנים, בנפרד על הטקסט שנשלח למודל (קלט) ועל התשובה שלו (פלט), והמחיר מפורסם למיליון טוקנים. במדידה שלנו מילה בעברית יוצאת בממוצע כ-${PER_WORD} טוקנים בטוקנייזר של GPT-5.`,
  },
  {
    id: 'ai-tokens-faq-hebrew',
    question: 'עברית עולה יותר טוקנים מאנגלית?',
    answer: `כן. מדדנו עשרה משפטים עסקיים בעברית ואת התרגום שלהם לאנגלית: בטוקנייזר o200k_base, של GPT-4o ו-GPT-5, העברית יצאה פי ${O200K.ratio} טוקנים, בטווח של ${O200K.range} למשפט. בטוקנייזר הישן cl100k_base, של GPT-4, הפער היה פי ${CL100K.ratio}. משמע שאותו בוט בעברית עולה בערך שליש יותר מאותו בוט באנגלית.`,
  },
  {
    id: 'ai-tokens-faq-cost',
    question: 'כמה עולה בוט AI בחודש ב-API?',
    answer: `תלוי במודל ובכמות. בקשה עם ${formatCount(SAMPLE_INPUT)} טוקנים של הנחיות והודעה ותשובה של ${formatCount(SAMPLE_OUTPUT)} טוקנים, ${formatCount(SAMPLE_REQUESTS)} פעמים בחודש, עולה לפי המחירים מ-${AS_OF} מ-${formatIlsAmount(cheapest.ilsPerMonth)} ב-${cheapest.model.name} ועד ${formatIlsAmount(priciest.ilsPerMonth)} ב-${priciest.model.name}. לזה מצטרפים שרת, אחסון והערוץ עצמו, למשל התשלום ל-Meta על ההודעות בוואטסאפ. במחשבון אפשר להדביק את ההנחיות של הבוט שלכם ולקבל את המספר המדויק יותר.`,
  },
  {
    id: 'ai-tokens-faq-exact',
    question: 'כמה מדויקת ספירת הטוקנים במחשבון?',
    answer: `זו הערכה ולא ספירה. כדי לא להוריד לדפדפן טוקנייזר של כמה מגה-בייט, כיילנו נוסחה לפי אותיות עבריות, מילים באנגלית, ספרות וסימנים מול ${formatCount(ESTIMATOR.samples)} פסקאות שספרנו ב-tiktoken. הסטייה הממוצעת הייתה ${percent(ESTIMATOR.meanError)}, ובטקסט בעברית בלבד ${percent(ESTIMATOR.hebrewMeanError)}. ל-Claude ול-Gemini יש טוקנייזרים אחרים, וספירה מדויקת שם אפשרית רק דרך ה-API שלהם.`,
  },
  {
    id: 'ai-tokens-faq-output',
    question: 'למה טוקני פלט יקרים יותר מטוקני קלט?',
    answer: `כי כתיבת טקסט דורשת מהמודל יותר חישוב מקריאה, וכל הספקים מתמחרים אותה גבוה יותר. ב-${SONNET.name} טוקן פלט עולה פי ${SONNET.outputUsd / SONNET.inputUsd} מטוקן קלט, וב-${GPT54.name} פי ${GPT54.outputUsd / GPT54.inputUsd}. לכן תשובות קצרות חוסכות יותר מהנחיות קצרות, וכדאי לבקש מהמודל לענות בקצרה כשאין צורך בתשובה ארוכה.`,
  },
  {
    id: 'ai-tokens-faq-save',
    question: 'איך מורידים את עלות ה-API?',
    answer:
      'בוחרים את המודל הזול שעדיין עונה טוב, ומשאירים מודל יקר רק למשימות קשות. מקצרים את ההנחיות הקבועות ושולחים רק את חלק ההיסטוריה שנחוץ. מגבילים את אורך התשובה. ומשימות שלא צריכות תשובה מיידית, כמו סיכומי יום, שולחים בעיבוד באצווה: Anthropic מציינת הנחה של 50% על עיבוד כזה.',
  },
]

export const metadata = toolMetadata({ path: PATH, metaTitle: META_TITLE, description: DESCRIPTION })

export default function AiTokenCalculatorPage() {
  return (
    <ToolLayout
      path={PATH}
      title={TITLE}
      metaTitle={META_TITLE}
      description={DESCRIPTION}
      lede={`מילה בעברית היא בממוצע כ-${PER_WORD} טוקנים, ואותו טקסט בעברית יוצא בערך פי ${RATIO} טוקנים מאשר באנגלית. הדביקו את הטקסט שהבוט שולח למודל, ותראו כמה טוקנים יש בו וכמה יעלו ${formatCount(SAMPLE_REQUESTS)} או כל מספר בקשות בחודש ב-GPT, ב-Claude וב-Gemini, לפי המחירים הרשמיים מ-${AS_OF}.`}
      chips={[`מחירים מ-${AS_OF}`, 'עברית מול אנגלית', 'בדולרים ובשקלים', 'הטקסט לא נשלח']}
      tool={<AiTokenCalculator />}
      faq={faq}
      cta={{
        text: 'אנחנו בונים סוכני AI שעונים ללקוחות בעברית בוואטסאפ ובאתר, ובוחרים לכל משימה את המודל שעושה אותה במחיר הנמוך.',
        label: 'לסוכני AI לעסקים',
        href: '/services/ai-agents',
      }}
    >
      <h2>מחירי ה-API של GPT, Claude ו-Gemini</h2>
      <p>
        כל הספקים מחייבים לפי מיליון טוקנים, בנפרד על קלט ועל פלט. אלה המחירים בתעריף הרגיל, בדולרים, כפי שהם
        מופיעים בעמודי התמחור, ומה תעלה בחודש בקשה טיפוסית של בוט: {formatCount(SAMPLE_INPUT)} טוקנים של הנחיות והודעה
        ותשובה של {formatCount(SAMPLE_OUTPUT)} טוקנים, {formatCount(SAMPLE_REQUESTS)} פעמים בחודש, לפי שער של{' '}
        {formatFx(FX)} ₪:
      </p>
      <div className={styles.tableWrap} role="region" aria-label="מחירי API למיליון טוקנים" tabIndex={0}>
        <table className={styles.table}>
          <caption>מחירים למיליון טוקנים, נכון ל-{AS_OF}</caption>
          <thead>
            <tr>
              <th scope="col">מודל</th>
              <th scope="col">ספק</th>
              <th scope="col">קלט</th>
              <th scope="col">פלט</th>
              <th scope="col">{formatCount(SAMPLE_REQUESTS)} בקשות</th>
            </tr>
          </thead>
          <tbody>
            {sampleRows.map((row) => (
              <tr key={row.model.id}>
                <th scope="row">
                  {row.model.name}
                  {row.model.note ? <span className={styles.note}>{row.model.note}</span> : null}
                </th>
                <td>{providers[row.model.provider].name}</td>
                <td>
                  <bdi>{formatPerMillion(row.model.inputUsd)}</bdi>
                </td>
                <td>
                  <bdi>{formatPerMillion(row.model.outputUsd)}</bdi>
                </td>
                <td>{formatIlsAmount(row.ilsPerMonth)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p>
        יש מחירים שמשתנים לפי האורך: ב-Claude Haiku 5.5 פרומפט מעל 100 אלף טוקנים עולה <bdi>$0.50</bdi> לקלט ו-<bdi>$2.50</bdi> לפלט,
        וב-Gemini 3.1 Pro פרומפט מעל 200 אלף טוקנים עולה <bdi>$4</bdi> ו-<bdi>$18.</bdi> המחשבון מחליף מחיר אוטומטית כשהטקסט עובר את
        הסף. המחירים לפני מע״מ ובלי הנחות של מטמון (cache) או אצווה.
      </p>

      <h2>עברית מול אנגלית: כמה יותר טוקנים</h2>
      <p>
        טוקנייזר מפרק טקסט לחתיכות לפי מה שהיה נפוץ בטקסטים שעליהם אומן, ורוב הטקסטים היו באנגלית. לכן מילה
        באנגלית היא לרוב טוקן אחד, ומילה בעברית מתפרקת ליותר חתיכות. מדדנו עשרה משפטים עסקיים בעברית ואת התרגום
        שלהם לאנגלית ב-tiktoken {HEBREW_TOKEN_STUDY.tiktokenVersion}:
      </p>
      <div className={styles.tableWrap} role="region" aria-label="טוקנים בעברית ובאנגלית" tabIndex={0}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th scope="col">טוקנייזר</th>
              <th scope="col">מודלים</th>
              <th scope="col">עברית</th>
              <th scope="col">אנגלית</th>
              <th scope="col">יחס</th>
            </tr>
          </thead>
          <tbody>
            {HEBREW_TOKEN_STUDY.results.map((result) => (
              <tr key={result.encoding}>
                <th scope="row">{result.encoding}</th>
                <td>{result.models}</td>
                <td>{formatTokens(result.he)}</td>
                <td>{formatTokens(result.en)}</td>
                <td className={styles.wrap}>
                  פי {result.ratio}, בין {result.range} למשפט
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p>
        בטוקנייזר החדש הפער קטן מאוד לעומת הישן, אבל עדיין קיים: אותו בוט בעברית שולח ומקבל כ-{percent(HEBREW_TO_ENGLISH_RATIO - 1)}{' '}
        יותר טוקנים. כשכותבים את ההנחיות הקבועות של הבוט באנגלית ומבקשים ממנו לענות בעברית, משלמים פחות על הקלט,
        והלקוח עדיין מקבל תשובה בעברית. מה עוד כדאי לכתוב בהנחיות, אפשר לראות ב
        <Link href="/tools/prompt-generator">מחולל הפרומפטים בעברית</Link>.
      </p>

      <h2>איך המחשבון סופר טוקנים</h2>
      <p>
        אין טוקנייזר רשמי של Claude או של Gemini שרץ בדפדפן, והטוקנייזר של OpenAI שוקל כמה מגה-בייט. לכן המחשבון לא
        סופר אלא מעריך: הוא סופר מילים ואותיות בעברית, מילים באנגלית, קבוצות של ספרות וסימנים, וכופל כל אחד במשקל
        שכיילנו מול {formatCount(ESTIMATOR.samples)} פסקאות שספרנו ב-tiktoken בקידוד o200k_base. בבדיקה על פסקאות
        שלא שימשו לכיול, הסטייה הממוצעת הייתה {percent(ESTIMATOR.meanError)}: {percent(ESTIMATOR.hebrewMeanError)}{' '}
        בטקסט בעברית בלבד ו-{percent(ESTIMATOR.englishMeanError)} באנגלית בלבד.
      </p>
      <p>
        המספר מדויק ביותר ל-GPT-5 ול-GPT-6 של OpenAI. ל-Claude ול-Gemini יש טוקנייזרים אחרים, ואותו טקסט יכול לצאת
        אצלם במספר אחר של טוקנים. מה זה טוקן, חלון הקשר ו-API, הסברנו ב
        <Link href="/tools/ai-glossary">מילון מונחי הבינה המלאכותית</Link>.
      </p>

      <h2>מ-API לבוט: מה עוד נכנס לחשבון</h2>
      <ul>
        <li>
          <strong>ההיסטוריה של השיחה.</strong> בכל הודעה חדשה הבוט שולח למודל גם את ההודעות הקודמות, ולכן הקלט גדל
          ככל שהשיחה מתארכת.
        </li>
        <li>
          <strong>ההנחיות הקבועות.</strong> הן נשלחות בכל בקשה. הנחיות של 500 מילים בעברית הן כ-
          {formatCount(Math.round(500 * TOKENS_PER_HEBREW_WORD))} טוקנים בכל הודעה של לקוח.
        </li>
        <li>
          <strong>הערוץ.</strong> בוט בוואטסאפ משלם גם ל-Meta על ההודעות, ואת זה מחשבים ב
          <Link href="/tools/whatsapp-api-cost-calculator">מחשבון העלות של WhatsApp Business API</Link>.
        </li>
        <li>
          <strong>מנוי או API.</strong> מנוי כמו ChatGPT Plus מחויב לפי משתמש ולא מתחבר למערכות של העסק. מה עולה כל
          מנוי בשקלים, ב<Link href="/tools/ai-subscription-prices">השוואת מחירי ChatGPT, Claude ו-Gemini</Link>.
        </li>
      </ul>

      <h2>מקורות</h2>
      <ul>
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
        המחירים בדף נבדקו מול עמודי התמחור של OpenAI, Anthropic ו-Google ב-{AS_OF_LONG}. הספקים מוסיפים מודלים
        ומשנים מחירים לעתים קרובות, ולכן לפני שמחליטים כדאי לבדוק את עמוד התמחור העדכני.
      </p>
    </ToolLayout>
  )
}
