import Link from 'next/link'
import ToolLayout, { toolMetadata, type ToolFaqEntry } from '../../components/tools/ToolLayout'
import AiSubscriptionPrices from '../../components/tools/AiSubscriptionPrices'
import {
  FALLBACK_USD_ILS,
  PRICES_AS_OF,
  annualSavingPercent,
  formatIls,
  formatIlsExact,
  formatPlanUsd,
  planCost,
  plans,
  vendors,
  type AiPlan,
} from '@/lib/ai-prices'
import { formatFx, formatLongDate, formatShortDate } from '@/lib/whatsapp-api-cost'
import styles from './page.module.css'

const PATH = '/tools/ai-subscription-prices'
const TITLE = 'כמה עולה ChatGPT בשקלים'
const META_TITLE = 'כמה עולה ChatGPT בשקלים: מחירי מנויי AI 2026'
const DESCRIPTION =
  'מחיר ChatGPT בשקלים בישראל: Go ב-25 ₪, Plus ב-70 ₪ ו-Business ב-78 ₪ למשתמש, מול Claude, Gemini, Copilot ו-Perplexity, עם מחשבון לצוות.'

const FX = FALLBACK_USD_ILS.rate
const AS_OF = formatShortDate(PRICES_AS_OF)
const AS_OF_LONG = formatLongDate(PRICES_AS_OF)

const planById = (id: string) => plans.find((plan) => plan.id === id) as AiPlan
const GO = planById('chatgpt-go')
const PLUS = planById('chatgpt-plus')
const BUSINESS = planById('chatgpt-business')
const CLAUDE_PRO = planById('claude-pro')
const GEMINI_PRO = planById('gemini-pro')
const ils = (plan: AiPlan) => formatIls(planCost(plan, 'monthly', FX, 1).ilsPerSeatMonth)
const localMonthly = (plan: AiPlan) => (plan.local ? formatIlsExact(plan.local.monthly) : '')

const chatgptPlans = plans.filter((plan) => plan.vendor === 'chatgpt')
const TEAM = 10
const teamPlans = plans.filter((plan) => plan.perSeat)

const sources: { href: string; label: string; note: string }[] = [
  {
    href: 'https://chatgpt.com/pricing',
    label: 'OpenAI: ChatGPT Pricing, בחשבון מישראל',
    note: `המחירים בדולרים ובשקלים של Go, Plus, Pro ו-Business, וסימון המס על כל מחיר בשקלים. נבדק ב-${AS_OF}`,
  },
  {
    href: 'https://help.openai.com/en/articles/9793128-what-is-chatgpt-pro',
    label: 'OpenAI Help Center: What is ChatGPT Pro',
    note: `שלוש הדרגות של Pro: ‏100, 200 ו-500 דולר בחודש. נבדק ב-${AS_OF}`,
  },
  {
    href: 'https://claude.com/pricing',
    label: 'Anthropic: Claude Pricing',
    note: `Pro, Max ו-Team, בחיוב חודשי ושנתי. נבדק ב-${AS_OF}`,
  },
  {
    href: 'https://support.claude.com/en/articles/11049741-what-is-the-max-plan',
    label: 'Claude Help Center: What is the Max plan',
    note: `Max 5x ב-100 דולר ו-Max 20x ב-200 דולר בחודש. נבדק ב-${AS_OF}`,
  },
  {
    href: 'https://gemini.google/subscriptions/',
    label: 'Google: Gemini subscriptions',
    note: `Google AI Plus, Pro ו-Ultra, ו-Gemini Enterprise לעסקים. נבדק ב-${AS_OF}`,
  },
  {
    href: 'https://www.microsoft.com/en-us/microsoft-365/copilot/pricing',
    label: 'Microsoft: Microsoft 365 Copilot pricing',
    note: `Copilot Business למשתמש, בהתחייבות שנתית ובחיוב חודשי. נבדק ב-${AS_OF}`,
  },
  {
    href: 'https://www.microsoft.com/en-us/microsoft-365/buy/compare-all-microsoft-365-products',
    label: 'Microsoft: Compare Microsoft 365 plans',
    note: `Microsoft 365 Premium למשתמש פרטי, חודשי ושנתי. נבדק ב-${AS_OF}`,
  },
  {
    href: 'https://www.perplexity.ai/hub/pricing',
    label: 'Perplexity: Pricing',
    note: `Pro ו-Max בחיוב שנתי. נבדק ב-${AS_OF}`,
  },
  {
    href: 'https://www.perplexity.ai/hub',
    label: 'Perplexity Hub',
    note: `Pro ב-20 דולר בחודש בחיוב חודשי. נבדק ב-${AS_OF}`,
  },
  {
    href: 'https://www.perplexity.ai/hub/blog/introducing-perplexity-max',
    label: 'Perplexity: Introducing Perplexity Max',
    note: `Max ב-200 דולר בחודש. נבדק ב-${AS_OF}`,
  },
  {
    href: 'https://www.perplexity.ai/help-center/en/articles/10352986-enterprise-pricing-and-billing-frequently-asked-questions',
    label: 'Perplexity Help Center: Enterprise Pricing and Billing',
    note: `Enterprise Pro ב-40 דולר למשתמש בחודש או 400 דולר בשנה. נבדק ב-${AS_OF}`,
  },
  {
    href: 'https://www.boi.org.il/roles/markets/exchangerates/',
    label: 'בנק ישראל: שערי חליפין יציגים',
    note: `שער ברירת המחדל, ${formatFx(FX)} ₪ לדולר ל-${formatShortDate(FALLBACK_USD_ILS.date)}. המחשבון טוען את השער העדכני`,
  },
]

const faq: ToolFaqEntry[] = [
  {
    id: 'ai-prices-faq-chatgpt',
    question: 'כמה עולה ChatGPT בשקלים?',
    answer: `בחשבון מישראל OpenAI מציגה מחירים בשקלים: ChatGPT Go עולה ${localMonthly(GO)} בחודש, Plus עולה ${localMonthly(PLUS)} בחודש, ו-Pro עולה ${localMonthly(planById('chatgpt-pro-100'))}, ${localMonthly(planById('chatgpt-pro-200'))} או ${localMonthly(planById('chatgpt-pro-500'))} לפי הדרגה. Business לצוותים עולה ${localMonthly(BUSINESS)} למשתמש בחודש. הגרסה החינמית נשארת חינם, עם מגבלות שימוש. המחירים נבדקו ב-${AS_OF}.`,
  },
  {
    id: 'ai-prices-faq-vat',
    question: 'המחיר של ChatGPT כולל מע״מ?',
    answer: `בנתוני התמחור ש-OpenAI מציגה לחשבון ישראלי, המחירים החודשיים של Go, Plus ו-Pro בשקלים מסומנים ככוללים מס, והמחירים של Business מסומנים כלא כוללים מס. במסלולים של Claude, Gemini, Copilot ו-Perplexity בדקנו רק מחירים בדולרים, והעמודים לא מפרטים מס לישראל. החיוב הסופי מופיע בקבלה, ולכן כדאי לבדוק אותה.`,
  },
  {
    id: 'ai-prices-faq-annual',
    question: 'כדאי לשלם על ChatGPT או Claude שנתי?',
    answer: `רק אם אתם בטוחים שתשתמשו כל השנה. ב-Claude Pro חיוב שנתי עולה ${formatPlanUsd(CLAUDE_PRO.annualPerMonthUsd ?? 0)} לחודש במקום ${formatPlanUsd(CLAUDE_PRO.monthlyUsd)}, חיסכון של ${annualSavingPercent(CLAUDE_PRO)}%. ב-ChatGPT Plus החיסכון ${annualSavingPercent(PLUS)}%, וב-Business ${annualSavingPercent(BUSINESS)}%. משלמים את כל השנה מראש, ולמסלולים Go ו-Pro של ChatGPT ולמנויים של Gemini לא פורסם מחיר שנתי.`,
  },
  {
    id: 'ai-prices-faq-cheapest',
    question: 'מה מנוי ה-AI הזול ביותר בתשלום?',
    answer: `לפי המחירים בדולרים, Google AI Plus ב-${formatPlanUsd(planById('gemini-plus').monthlyUsd)} בחודש הוא הזול ביותר, כ-${ils(planById('gemini-plus'))}, ואחריו ChatGPT Go ב-${formatPlanUsd(GO.monthlyUsd)}, שבחשבון ישראלי עולה ${localMonthly(GO)}. רוב המסלולים המלאים, ChatGPT Plus, Claude Pro, Google AI Pro ו-Perplexity Pro, עולים כ-20 דולר בחודש. ההבדל ביניהם הוא בכלים, במגבלות השימוש ובמה שמגיע יחד עם המנוי, ולא במחיר.`,
  },
  {
    id: 'ai-prices-faq-team',
    question: 'כמה עולה ChatGPT לעסק עם כמה עובדים?',
    answer: `ChatGPT Business מחויב לפי משתמש: ${formatPlanUsd(BUSINESS.monthlyUsd)} למשתמש בחודש בחיוב חודשי ו-${formatPlanUsd(BUSINESS.annualPerMonthUsd ?? 0)} בחיוב שנתי. בחשבון ישראלי זה ${localMonthly(BUSINESS)} או ${formatIlsExact(BUSINESS.local?.annualPerMonth ?? 0)} למשתמש בחודש, לפני מס. לצוות של ${TEAM} עובדים בחיוב שנתי זה כ-${formatIls((BUSINESS.local?.annualPerMonth ?? 0) * TEAM * 12)} בשנה. במחשבון אפשר להקליד את מספר העובדים ולהשוות ל-Claude Team, ל-Copilot ול-Perplexity.`,
  },
  {
    id: 'ai-prices-faq-agent',
    question: 'מנוי ChatGPT מספיק כדי לענות ללקוחות?',
    answer:
      'לא. מנוי הוא כלי לעובד: כותבים בו, מסכמים ומתרגמים. הוא לא מחובר לוואטסאפ, לאתר או ל-CRM של העסק, ולא עונה ללקוחות לבד. בשביל בוט או סוכן שעונה ללקוחות משתמשים ב-API של המודל, ומשלמים לפי טוקנים ולא לפי משתמש. כמה זה עולה לפי כמות הפניות, אפשר לחשב במחשבון הטוקנים שלנו.',
  },
]

export const metadata = toolMetadata({ path: PATH, metaTitle: META_TITLE, description: DESCRIPTION })

export default function AiSubscriptionPricesPage() {
  return (
    <ToolLayout
      path={PATH}
      title={TITLE}
      metaTitle={META_TITLE}
      description={DESCRIPTION}
      lede={`בחשבון מישראל ChatGPT Go עולה ${localMonthly(GO)} בחודש, Plus עולה ${localMonthly(PLUS)} ו-Business עולה ${localMonthly(BUSINESS)} למשתמש, לפי עמוד המחירים של OpenAI מ-${AS_OF}. כאן משווים אותם למחירי Claude, Gemini, Copilot ו-Perplexity בשקלים, בחיוב חודשי או שנתי ולפי מספר העובדים.`}
      chips={[`מחירים מ-${AS_OF}`, 'שער בנק ישראל', 'לאדם ולצוות', 'בלי הרשמה']}
      tool={<AiSubscriptionPrices />}
      faq={faq}
      cta={{
        text: 'מנוי עוזר לעובד. כשרוצים שה-AI יענה ללקוחות בוואטסאפ ובאתר, יקבע תורים ויעדכן את ה-CRM, בונים סוכן AI שמחובר למערכות של העסק.',
        label: 'לסוכני AI לעסקים',
        href: '/services/ai-agents',
      }}
    >
      <h2>מחירי ChatGPT בישראל ב-2026</h2>
      <p>
        OpenAI מציגה לחשבון מישראל מחירים בשקלים, והם לא בדיוק המחיר בדולרים כפול השער. זה מה שמופיע בעמוד
        המחירים, מול המחיר בדולרים ומול ההמרה לפי שער יציג של {formatFx(FX)} ₪ ל-
        {formatShortDate(FALLBACK_USD_ILS.date)}:
      </p>
      <div className={styles.tableWrap} role="region" aria-label="מחירי ChatGPT בישראל" tabIndex={0}>
        <table className={styles.table}>
          <caption>
            מחירי ChatGPT לחודש, נכון ל-{AS_OF}, לפי{' '}
            <a href="https://chatgpt.com/pricing" rel="noopener" target="_blank">
              עמוד המחירים של OpenAI
            </a>
          </caption>
          <thead>
            <tr>
              <th scope="col">מסלול</th>
              <th scope="col">בדולרים</th>
              <th scope="col">בשקלים בישראל</th>
              <th scope="col">הדולר לפי השער</th>
              <th scope="col">מס</th>
            </tr>
          </thead>
          <tbody>
            {chatgptPlans.map((plan) => (
              <tr key={plan.id}>
                <th scope="row">{plan.name}</th>
                <td>
                  <bdi>{formatPlanUsd(plan.monthlyUsd)}</bdi>
                </td>
                <td>{localMonthly(plan)}</td>
                <td>{ils(plan)}</td>
                <td>{plan.local?.tax === 'inclusive' ? 'כולל' : 'לא כולל'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p>
        Plus בחיוב שנתי עולה בחשבון ישראלי {formatIlsExact(PLUS.local?.annualPerMonth ?? 0)} לחודש, ו-Business בחיוב
        שנתי {formatIlsExact(BUSINESS.local?.annualPerMonth ?? 0)} למשתמש בחודש. המחירים של Business בשקלים לא כוללים
        מס, כך שהחשבון בפועל יכול להיות גבוה יותר.
      </p>

      <h2>כל המנויים בטבלה אחת</h2>
      <p>
        המחירים בדולרים כפי שהם מופיעים בעמודי התמחור של היצרנים, בחיוב חודשי, ובשקלים לפי שער של {formatFx(FX)} ₪.
        Claude, Gemini, Copilot ו-Perplexity לא מציגים מחיר בשקלים, ולכן חיוב בכרטיס ישראלי יהיה בדולרים או לפי השער של
        חברת האשראי.
      </p>
      <div className={styles.tableWrap} role="region" aria-label="מחירי מנויי AI בדולרים ובשקלים" tabIndex={0}>
        <table className={styles.table}>
          <caption>מחירי מנויים לחודש, נכון ל-{AS_OF}</caption>
          <thead>
            <tr>
              <th scope="col">מסלול</th>
              <th scope="col">למי</th>
              <th scope="col">חודשי</th>
              <th scope="col">בשקלים</th>
              <th scope="col">שנתי, לחודש</th>
            </tr>
          </thead>
          <tbody>
            {plans.map((plan) => (
              <tr key={plan.id}>
                <th scope="row">{plan.name}</th>
                <td className={styles.wrap}>{plan.audience}</td>
                <td>
                  <bdi>{formatPlanUsd(plan.monthlyUsd)}</bdi>
                </td>
                <td>{ils(plan)}</td>
                <td>{plan.annualPerMonthUsd === null ? 'לא פורסם' : <bdi>{formatPlanUsd(plan.annualPerMonthUsd)}</bdi>}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2>מנוי אישי או מנוי לצוות</h2>
      <p>
        מנוי אישי, כמו ChatGPT Plus או Claude Pro, שייך לאדם אחד. מנוי לצוות, כמו ChatGPT Business, Claude Team או
        Copilot Business, מחויב לפי משתמש ומוסיף ניהול מרוכז של המשתמשים והחיוב. לצוות של {TEAM} עובדים בחיוב שנתי,
        לפי שער של {formatFx(FX)} ₪:
      </p>
      <ul>
        {teamPlans.map((plan) => {
          const cost = planCost(plan, 'annual', FX, TEAM)
          return (
            <li key={plan.id}>
              <strong>{plan.name}:</strong> {formatIls(cost.ilsTeamYear)} בשנה, כ-{formatIls(cost.ilsTeamMonth)} בחודש
              {cost.annualFallback ? ', לפי המחיר החודשי' : ''}.
            </li>
          )
        })}
      </ul>
      <p>
        ב-Copilot Business המחיר הוא תוספת למנוי Microsoft 365 לעסקים, ו-Microsoft מציעה עד {formatLongDate('2026-12-31')}{' '}
        מחיר מבצע של 18 דולר למשתמש בחודש בשנה הראשונה ללקוחות קיימים. ב-Gemini Enterprise Business, Google מפרסמת מחיר של{' '}
        {formatPlanUsd(planById('gemini-enterprise-business').monthlyUsd)} למשתמש בחודש, לצוותים של עד 300 משתמשים.
      </p>

      <h2>מה מקבלים בכל מנוי</h2>
      <p>
        המסלולים של כ-20 דולר דומים במחיר: ChatGPT Plus עולה {ils(PLUS)} לפי השער, Claude Pro {ils(CLAUDE_PRO)} ו-Google
        AI Pro {ils(GEMINI_PRO)}. ההבדל ביניהם במודלים, במגבלות השימוש ובמה שמגיע יחד עם המנוי: ב-Google AI Plus ו-Pro
        יש גם אחסון בגוגל, ב-Microsoft 365 Premium יש גם את תוכנות אופיס, וב-Perplexity המנוי בנוי סביב חיפוש עם
        מקורות. מסלולי Pro, Max ו-Ultra נועדו למי שמגיע למגבלת השימוש במסלול הבסיסי.
      </p>
      <p>
        כדי להוציא יותר מכל מנוי, אפשר להתחיל מ<Link href="/tools/prompt-generator">מחולל הפרומפטים בעברית</Link>, ואם
        המונחים לא מוכרים, <Link href="/tools/ai-glossary">מילון מונחי הבינה המלאכותית</Link> מסביר מה זה טוקן, מודל
        ו-API.
      </p>

      <h2>מנוי Business או סוכן AI משלכם</h2>
      <p>
        מנוי לצוות נותן לכל עובד צ׳אט. הוא לא עונה ללקוחות בוואטסאפ, לא קובע תורים ולא מעדכן את ה-CRM. בשביל זה
        מחברים מודל דרך API למערכות של העסק, ומשלמים לספק המודל לפי כמות הטקסט, בטוקנים, ולא לפי משתמש. כמה זה עולה
        לפי מספר הפניות בחודש, אפשר לחשב ב<Link href="/tools/ai-token-calculator">מחשבון הטוקנים ועלות ה-API</Link>.
      </p>

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
        המחירים בדף נבדקו מול עמודי התמחור של {vendors.map((vendor) => vendor.company).join(', ')} ב-
        {AS_OF_LONG}. היצרנים משנים מחירים ומסלולים בלי הודעה מראש, ולכן לפני רכישה כדאי לבדוק את עמוד המחירים.
      </p>
    </ToolLayout>
  )
}
