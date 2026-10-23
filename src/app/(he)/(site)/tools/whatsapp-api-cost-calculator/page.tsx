import Link from 'next/link'
import ToolLayout, { toolMetadata, type ToolFaqEntry } from '../../components/tools/ToolLayout'
import WhatsAppApiCostCalculator from '../../components/tools/WhatsAppApiCostCalculator'
import {
  CATEGORIES,
  CATEGORY_INFO,
  DEFAULT_INPUT,
  DEFAULT_USD_ILS,
  EMPTY_COUNTS,
  META_RATES,
  RATES_AS_OF,
  SCENARIOS,
  calculateCost,
  formatAgorotPerMessage,
  formatCount,
  formatFx,
  formatLongDate,
  formatRate,
  formatShekels,
  formatShortDate,
  formatUsd,
  perThousandAgorot,
} from '@/lib/whatsapp-api-cost'
import styles from './page.module.css'

const PATH = '/tools/whatsapp-api-cost-calculator'
const TITLE = 'מחשבון עלות WhatsApp Business API'
const META_TITLE = 'מחיר WhatsApp Business API: מחשבון עלות בשקלים'
const DESCRIPTION =
  'כמה עולה WhatsApp Business API בישראל: תעריפי Meta מ-1.10.2026 לכל סוג הודעה, 1,000 הודעות שירות חינם, ועלות חודשית בדולרים ובשקלים.'

const IL = META_RATES.markets.IL.rates
const FX = DEFAULT_USD_ILS.rate
const AS_OF = formatShortDate(RATES_AS_OF)
const AS_OF_LONG = formatLongDate(RATES_AS_OF)
const FREE_SERVICE = formatCount(META_RATES.freeServicePerNumber)
const MARKETING_AGOROT = formatAgorotPerMessage(IL.marketing, FX)
const UTILITY_AGOROT = formatAgorotPerMessage(IL.utility, FX)
const MARKETING_TO_UTILITY = new Intl.NumberFormat('he-IL', { maximumFractionDigits: 1 }).format(
  IL.marketing / IL.utility,
)
const BROADCAST = SCENARIOS.find((scenario) => scenario.id === 'broadcast') ?? SCENARIOS[0]
const BROADCAST_AS_UTILITY = formatCount(
  Math.round((BROADCAST.counts.marketing * IL.marketing) / IL.utility / 100) * 100,
)
const SUPPORT_LOAD = 5000
const supportLoadCost = calculateCost({ ...DEFAULT_INPUT, counts: { ...EMPTY_COUNTS, service: SUPPORT_LOAD } })

const scenarioRows = SCENARIOS.map((scenario) => ({
  scenario,
  result: calculateCost({ ...DEFAULT_INPUT, counts: scenario.counts }),
}))

const RATE_CARD_URL = 'https://developers.facebook.com/docs/whatsapp/pricing#rate-cards'

const sources: { href: string; label: string; note: string }[] = [
  {
    href: 'https://developers.facebook.com/docs/whatsapp/pricing',
    label: 'Meta for Developers: Pricing on the WhatsApp Business Platform',
    note: 'חיוב לפי הודעה מ-1.7.2025, חמשת סוגי ההודעות, 1,000 הודעות שירות חינם לכל מספר והחיוב על עדכונים בחלון 24 השעות מ-1.10.2026, החלון החינמי ממודעות, Meta Business Agent, מועדי עדכון התעריפים והפטור לגופי ממשל ועמותות',
  },
  {
    href: RATE_CARD_URL,
    label: 'Meta: כרטיס התעריפים בדולרים, Cost per message in USD, effective October 1, 2026',
    note: 'התעריפים לישראל ולשאר המדינות שבמחשבון, ומדרגות הנפח לישראל בהודעות עדכונים ואימות',
  },
  {
    href: 'https://whatsappbusiness.com/products/platform-pricing/',
    label: 'WhatsApp Business: Platform pricing',
    note: 'מחשבון התעריפים הרשמי, עם אותם תעריפים לישראל',
  },
  {
    href: 'https://whatsappbusiness.com/faq/',
    label: 'WhatsApp Business: FAQ',
    note: 'האפליקציה להורדה ולשימוש בחינם, אין תשלום נוסף על גישה ישירה, ספקים יכולים לגבות דמי שימוש, Meta מחייבת את הספק, ומס שחל מופיע בחשבונית',
  },
  {
    href: 'https://developers.facebook.com/documentation/business-messaging/whatsapp/templates/template-categorization',
    label: 'Meta for Developers: Template categorization',
    note: 'מה נחשב שיווק, עדכונים ואימות, תבנית מעורבת שנחשבת לשיווק ושינוי סוג של תבנית אחרי אישור',
  },
  {
    href: 'https://developers.facebook.com/documentation/business-messaging/whatsapp/embedded-signup/onboarding-business-app-users',
    label: 'Meta for Developers: Onboard Business app users (Coexistence)',
    note: 'מספר שמחובר לאפליקציה ול-API יחד, והודעות מהאפליקציה שנשארות חינם',
  },
  {
    href: 'https://developers.facebook.com/documentation/business-messaging/whatsapp/pricing/ai-providers',
    label: 'Meta for Developers: Pricing policy for AI Providers',
    note: 'התנאים מ-15.1.2026 לספקי AI ולעוזרי AI כלליים, והמדינות שבהן Meta מחויבת בחוק לאפשר אותם',
  },
  {
    href: 'https://openai.com/index/chatgpt-whatsapp-transition/',
    label: 'OpenAI: Continuing your ChatGPT experience beyond WhatsApp',
    note: 'ההודעה מ-21.10.2025 ש-ChatGPT לא יהיה זמין בוואטסאפ אחרי 15.1.2026 בגלל שינוי בתנאים של WhatsApp',
  },
  {
    href: 'https://respond.io/blog/whatsapp-general-purpose-chatbots-ban',
    label: 'respond.io: Not All Chatbots Are Banned (מקור משני)',
    note: 'דוגמאות לבוטים שמותרים אחרי השינוי: שירות, תורים, מעקב הזמנות ומכירות',
  },
  {
    href: 'https://www.boi.org.il/roles/markets/exchangerates/',
    label: 'בנק ישראל: שערי חליפין יציגים',
    note: `שער הדולר שבמחשבון, ${formatFx(FX)} ₪ ל-${formatShortDate(DEFAULT_USD_ILS.date)}`,
  },
  {
    href: 'https://he.wikisource.org/wiki/%D7%97%D7%95%D7%A7_%D7%94%D7%AA%D7%A7%D7%A9%D7%95%D7%A8%D7%AA_(%D7%91%D7%96%D7%A7_%D7%95%D7%A9%D7%99%D7%93%D7%95%D7%A8%D7%99%D7%9D)',
    label: 'חוק התקשורת (בזק ושידורים), התשמ״ב–1982, בנוסח המעודכן בוויקיטקסט',
    note: 'סעיף 30א: הסכמה מפורשת מראש, החריג ללקוח קיים, המילה ״פרסומת״, הודעת סירוב ופיצוי של עד 1,000 ₪ בלי הוכחת נזק',
  },
]

const faq: ToolFaqEntry[] = [
  {
    id: 'wa-api-cost-faq-price',
    question: 'כמה עולה הודעה בוואטסאפ עסקי API?',
    answer: `Meta גובה על כל הודעה שנמסרה, והמחיר תלוי בסוג ההודעה ובמדינה של הנמען. לנמען בישראל, לפי כרטיס התעריפים מ-${AS_OF}: הודעת שיווק עולה ${formatRate(IL.marketing)}, כ-${MARKETING_AGOROT} אגורות, והודעת עדכונים, אימות או שירות עולה ${formatRate(IL.utility)}, כ-${UTILITY_AGOROT} אגורות. ${FREE_SERVICE} הודעות שירות בחודש לכל מספר עסקי הן בחינם, והודעות שלקוחות שולחים לעסק לא עולות כלום. ספק שדרכו אתם מחוברים יכול לגבות דמי שימוש נוספים.`,
  },
  {
    id: 'wa-api-cost-faq-service',
    question: 'הודעות שירות בוואטסאפ API עדיין בחינם?',
    answer: `רק ${FREE_SERVICE} בחודש. מ-1 באוקטובר 2026 Meta גובה על הודעות שירות, כלומר תשובות חופשיות שהעסק שולח בתוך 24 שעות מההודעה האחרונה של הלקוח. כל מספר טלפון עסקי מקבל ${FREE_SERVICE} הודעות שירות חינם בחודש, היתרה לא עוברת לחודש הבא, ומההודעה ה-1,001 משלמים לפי התעריף, בישראל ${formatRate(IL.service)}. מאותו תאריך גם הודעות עדכונים שנשלחות בתוך חלון 24 השעות בתשלום, אף שהיו חינם מיולי 2025.`,
  },
  {
    id: 'wa-api-cost-faq-categories',
    question: 'מה ההבדל בין הודעת שיווק להודעת עדכונים (Utility)?',
    answer: `הודעת עדכונים קשורה לפעולה או לבקשה של הלקוח: אישור הזמנה, עדכון משלוח, תזכורת לתור או התראה על החשבון שלו, בלי שום תוכן קידומי. הטבות, תזכורת לעגלה נטושה וברכה ליום הולדת הן שיווק. לפי Meta, תבנית שמערבת עדכון עם מבצע נחשבת להודעת שיווק. ההבדל במחיר גדול: לנמען בישראל הודעת שיווק עולה פי ${MARKETING_TO_UTILITY} מהודעת עדכונים.`,
  },
  {
    id: 'wa-api-cost-faq-app',
    question: 'וואטסאפ עסקי עולה כסף?',
    answer:
      'לפי Meta, האפליקציה WhatsApp Business להורדה ולשימוש בחינם, ושיחות שעונים בהן ידנית לא מחויבות לפי הודעה. התשלום לפי הודעה חל על WhatsApp Business Platform, ה-API, שדרכו מחברים בוט, CRM או כמה נציגים. גם כשמספר מחובר לאפליקציה ול-API יחד, הודעות שנשלחות מהאפליקציה נשארות חינם, ורק הודעות שנשלחות דרך ה-API מחויבות לפי התעריפים של Meta.',
  },
  {
    id: 'wa-api-cost-faq-bot',
    question: 'כמה עולה בוט וואטסאפ?',
    answer: `לעלות החודשית של בוט יש שלושה חלקים. הראשון הוא Meta: כל תשובה של הבוט היא הודעת שירות, ${FREE_SERVICE} הראשונות בחודש חינם ומעליהן ${formatRate(IL.service)} להודעה לנמען בישראל, ותזכורות ועדכונים שהבוט שולח מחויבים כהודעות עדכונים. השני הוא הספק, אם אתם עובדים דרך פלטפורמה שגובה מנוי. השלישי הוא מודל השפה, אם הבוט עונה בעזרת AI, ועלותו לפי השימוש. במחשבון אפשר להוסיף את דמי הספק לפי ההצעה שקיבלתם.`,
  },
  {
    id: 'wa-api-cost-faq-chatgpt',
    question: 'אפשר לחבר ChatGPT לוואטסאפ של העסק?',
    answer:
      'כן, כבוט שעונה ללקוחות של העסק. מ-15 בינואר 2026 התנאים של WhatsApp Business Platform אוסרים על ספקי בינה מלאכותית להציע בו עוזר AI כללי, כמו ChatGPT, חוץ ממדינות שבהן Meta מחויבת בחוק לאפשר את זה, ולכן ChatGPT כבר לא זמין בוואטסאפ. בוט של עסק שעונה על שאלות, קובע תורים ומטפל בהזמנות מותר, גם כשהוא מבוסס על מודל שפה: Meta כותבת שהודעות שירות יכולות להישלח מפתרון AI של צד שלישי.',
  },
]

export const metadata = toolMetadata({ path: PATH, metaTitle: META_TITLE, description: DESCRIPTION })

export default function WhatsAppApiCostCalculatorPage() {
  return (
    <ToolLayout
      path={PATH}
      title={TITLE}
      metaTitle={META_TITLE}
      description={DESCRIPTION}
      lede={`לפי כרטיס התעריפים של Meta מ-${AS_OF}, הודעת שיווק בוואטסאפ לנמען בישראל עולה ${formatRate(IL.marketing)}, כ-${MARKETING_AGOROT} אגורות, והודעת עדכונים, אימות או שירות עולה ${formatRate(IL.utility)}, כ-${UTILITY_AGOROT} אגורות. ${FREE_SERVICE} הודעות שירות בחודש לכל מספר עסקי הן בחינם, וכאן מחשבים כמה תשלמו בחודש לפי ההודעות שאתם שולחים.`}
      chips={[`תעריפי Meta מ-${AS_OF}`, 'בדולרים ובשקלים', 'גם נמענים בחו״ל', 'בלי הרשמה']}
      tool={<WhatsAppApiCostCalculator />}
      faq={faq}
      cta={{
        text: 'אנחנו בונים לוואטסאפ של העסק בוט וסוכן AI שעונים ללקוחות בעברית, קובעים תורים ומעבירים לנציג כשצריך.',
        label: 'לבוטים וסוכני AI לוואטסאפ',
        href: '/services/ai-agents',
      }}
    >
      <h2>כמה עולה WhatsApp Business API בישראל ב-2026</h2>
      <p>
        מאז 1 ביולי 2025 Meta גובה לפי הודעה שנמסרה. המחיר נקבע לפי סוג ההודעה ולפי הקידומת של הנמען, ולא לפי
        המדינה של העסק, והודעות שלקוחות שולחים לעסק לא עולות כלום. אלה התעריפים לנמען עם קידומת{' '}
        <bdi>+972</bdi>, בדולרים כמו בכרטיס התעריפים, ובשקלים לפי שער יציג של {formatFx(FX)} ₪ ל-
        {formatShortDate(DEFAULT_USD_ILS.date)}:
      </p>
      <div className={styles.tableWrap} role="region" aria-label="תעריפי Meta לנמען בישראל" tabIndex={0}>
        <table className={styles.table}>
          <caption>
            תעריפים לנמען בישראל, נכון ל-{AS_OF}, לפי{' '}
            <a href={RATE_CARD_URL} rel="noopener" target="_blank">
              כרטיס התעריפים של Meta
            </a>
          </caption>
          <thead>
            <tr>
              <th scope="col">סוג ההודעה</th>
              <th scope="col">להודעה</th>
              <th scope="col">בשקלים</th>
              <th scope="col">ל-1,000 הודעות</th>
            </tr>
          </thead>
          <tbody>
            {CATEGORIES.map((category) => (
              <tr key={category}>
                <th scope="row">
                  {CATEGORY_INFO[category].name} ({CATEGORY_INFO[category].english})
                </th>
                <td>{formatRate(IL[category])}</td>
                <td>כ-{formatAgorotPerMessage(IL[category], FX)} אגורות</td>
                <td>{formatShekels(perThousandAgorot(IL[category], FX))}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p>
        על הודעות שירות משלמים רק מעבר ל-{FREE_SERVICE} הראשונות בחודש לכל מספר עסקי. Meta מעדכנת תעריפים רק ב-1
        בינואר, ב-1 באפריל, ב-1 ביולי וב-1 באוקטובר, ומודיעה על שינוי בתעריף לפחות חודש מראש. בהודעות עדכונים ואימות
        יש הנחות נפח, אבל בישראל הן מתחילות רק מעל {formatCount(META_RATES.israelVolumeTierAbove.utility)} הודעות
        עדכונים או {formatCount(META_RATES.israelVolumeTierAbove.authentication)} הודעות אימות בחודש.
      </p>
      <h3>כמה זה יוצא: ארבע דוגמאות</h3>
      <p>
        החישוב נעשה במחשבון שלמעלה, עם מספר טלפון עסקי אחד, כל הנמענים בישראל ושער של {formatFx(FX)} ₪ לדולר, בלי
        דמי ספק ובלי מע״מ:
      </p>
      <div className={styles.tableWrap} role="region" aria-label="עלות חודשית לפי סוג עסק" tabIndex={0}>
        <table className={styles.table}>
          <caption>עלות חודשית ל-Meta לפי סוג עסק</caption>
          <thead>
            <tr>
              <th scope="col">עסק</th>
              <th scope="col">הודעות בחודש</th>
              <th scope="col">בדולרים</th>
              <th scope="col">בשקלים</th>
              <th scope="col">ל-1,000 הודעות</th>
            </tr>
          </thead>
          <tbody>
            {scenarioRows.map(({ scenario, result }) => (
              <tr key={scenario.id}>
                <th scope="row">{scenario.label}</th>
                <td className={styles.wrap}>{scenario.description}</td>
                <td>{formatUsd(result.metaUsdCents)}</td>
                <td>{formatShekels(result.metaAgorot)}</td>
                <td>{result.perThousand ? formatShekels(result.perThousand.agorot) : ''}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p>
        בקליניקה 300 התשובות למטופלים נכנסות במכסה החינמית, ומשלמים רק על התזכורות. ברוב העסקים ההודעות השיווקיות
        הן רוב החשבון: {formatCount(BROADCAST.counts.marketing)} הודעות שיווק עולות כמו כ-{BROADCAST_AS_UTILITY}{' '}
        תזכורות לתור.
      </p>

      <h2>מה השתנה באוקטובר 2026</h2>
      <p>ב-{AS_OF_LONG} Meta החזירה את החיוב על שני סוגי הודעות שהיו חינם:</p>
      <ul>
        <li>
          הודעות שירות, כלומר תשובות חופשיות בתוך 24 שעות מההודעה האחרונה של הלקוח. מ-1 בנובמבר 2024 הן היו חינם
          בלי הגבלה. עכשיו כל מספר טלפון עסקי מקבל {FREE_SERVICE} הודעות שירות חינם בחודש, היתרה לא עוברת לחודש
          הבא, ומההודעה ה-1,001 משלמים לפי התעריף.
        </li>
        <li>
          הודעות עדכונים שנשלחות בתוך חלון 24 השעות, למשל אישור הזמנה מיד אחרי שהלקוח כתב. הן היו חינם מ-1 ביולי
          2025, ועכשיו מחויבות כמו כל הודעת עדכונים.
        </li>
      </ul>
      <p>
        לעסק שאין לו אמצעי תשלום בחשבון, Meta ממשיכה למסור הודעות שירות עד שנגמרות {FREE_SERVICE} ההודעות
        החינמיות, ואז מפסיקה למסור אותן. גופי ממשל ועמותות קהילתיות ש-Meta מכירה כזכאים ממשיכים לשלוח הודעות שירות
        בחינם גם מעבר למכסה, עד 31 בדצמבר 2027.
      </p>
      <p>
        התעריפים לישראל עצמם לא השתנו: ישראל לא ברשימת השווקים שהתעריף שלהם עודכן באוקטובר. מה שהשתנה הוא שהתשובות
        ללקוחות נכנסו לחשבון. עסק שעונה על {formatCount(SUPPORT_LOAD)} הודעות בחודש ממספר אחד משלם עליהן עכשיו{' '}
        {formatShekels(supportLoadCost.metaAgorot)} בחודש (<bdi>{formatUsd(supportLoadCost.metaUsdCents)}</bdi>), ועד
        ספטמבר לא שילם עליהן כלום.
      </p>

      <h2>ההבדל בין וואטסאפ עסקי (האפליקציה) ל-API</h2>
      <p>
        לפי Meta, האפליקציה WhatsApp Business להורדה ולשימוש בחינם. היא נועדה לעסק קטן שעונה ללקוחות בעצמו: יש בה
        הודעת פתיחה, הודעת היעדרות ותשובות מהירות, ואפשרויות החיבור שלה למערכות אחרות מוגבלות.
      </p>
      <p>
        WhatsApp Business Platform, שרוב האנשים קוראים לו WhatsApp Business API, הוא הממשק שדרכו מחברים את המספר
        העסקי לתוכנה: בוט שעונה לבד, CRM שפותח ליד מכל פנייה, כמה נציגים על אותו מספר ותזכורות שנשלחות אוטומטית. ב-API
        משלמים ל-Meta לפי הודעה. מתחברים ישירות, כשיש מי שמפתח, או דרך ספק (Business Solution Provider). לפי Meta,
        אין תשלום נוסף על גישה ישירה, וספקים יכולים לגבות דמי שימוש על מה שהם מוסיפים. כשעובדים דרך ספק, Meta מחייבת
        את הספק והוא מחייב אתכם.
      </p>
      <p>
        אפשר גם לחבר ל-API מספר שכבר פעיל באפליקציה, דרך ספק שתומך בזה, ולהמשיך לענות ממנה ללקוחות אחד-אחד. לפי
        Meta, הודעות שנשלחות מהאפליקציה נשארות חינם, ורק הודעות שנשלחות דרך ה-API מחויבות. איך מחברים את ה-API
        למערכת ניהול לקוחות ומה לבדוק אצל הספק, פירטנו במדריך{' '}
        <Link href="/blog/whatsapp-business-api-crm-integration">חיבור WhatsApp Business API ל-CRM</Link>.
      </p>

      <h2>סוגי הודעות ומה כל אחת עולה</h2>
      <p>
        Meta מחלקת את ההודעות שעסק שולח לחמישה סוגים, וכל הודעה מחויבת פעם אחת לפי הסוג שלה. שלושה סוגים הם תבניות
        (templates) שמאשרים מראש ואפשר לשלוח בכל זמן. שניים הם הודעות חופשיות, שאפשר לשלוח רק בתוך 24 שעות מההודעה
        האחרונה של הלקוח.
      </p>
      <div className={styles.tableWrap} role="region" aria-label="סוגי ההודעות ב-WhatsApp Business API" tabIndex={0}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th scope="col">סוג</th>
              <th scope="col">מה זה</th>
              <th scope="col">דוגמה</th>
              <th scope="col">לנמען בישראל</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row">שיווק (Marketing)</th>
              <td className={styles.wrap}>תבנית לקידום מכירות, להיכרות עם העסק או להחזרת לקוחות</td>
              <td className={styles.wrap}>״20% הנחה על ההזמנה הבאה עם הקוד…״</td>
              <td>{formatRate(IL.marketing)}</td>
            </tr>
            <tr>
              <th scope="row">עדכונים (Utility)</th>
              <td className={styles.wrap}>תבנית שקשורה להזמנה, לתור או לחשבון של הלקוח, בלי תוכן קידומי</td>
              <td className={styles.wrap}>״ההזמנה 1234 יצאה למשלוח״</td>
              <td>{formatRate(IL.utility)}</td>
            </tr>
            <tr>
              <th scope="row">אימות (Authentication)</th>
              <td className={styles.wrap}>תבנית עם קוד חד-פעמי לכניסה או לאימות</td>
              <td className={styles.wrap}>״הקוד שלך: 482913״</td>
              <td>{formatRate(IL.authentication)}</td>
            </tr>
            <tr>
              <th scope="row">שירות (Service)</th>
              <td className={styles.wrap}>תשובה חופשית בתוך החלון, של נציג או של בוט AI של צד שלישי</td>
              <td className={styles.wrap}>״כן, יש מידה M במלאי״</td>
              <td className={styles.wrap}>
                {formatRate(IL.service)}, {FREE_SERVICE} בחודש חינם לכל מספר
              </td>
            </tr>
            <tr>
              <th scope="row">Meta Business Agent</th>
              <td className={styles.wrap}>תשובה של סוכן ה-AI של Meta בתוך החלון</td>
              <td className={styles.wrap}>״אנחנו פתוחים היום עד 19:00״</td>
              <td className={styles.wrap}>
                <bdi>${META_RATES.businessAgentUsdPerMillionTokens}</bdi> למיליון טוקנים, לפי Meta כ-4 עד 5 סנט להודעה
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <p>
        חלון 24 השעות נפתח כשלקוח כותב לעסק או מתקשר אליו, ומתחיל מחדש בכל הודעה חדשה שלו. כשהחלון סגור, אפשר לפנות
        ללקוח רק בתבנית. יש גם חלון חינמי ארוך יותר: לקוח שכותב לעסק ממודעה שמובילה לוואטסאפ (Click to WhatsApp),
        מהאפליקציה בטלפון, ומקבל תשובה בתוך 24 שעות, פותח חלון של עד {META_RATES.freeEntryWindowDays} ימים שבו
        הודעות שיווק, עדכונים, אימות ושירות אליו בחינם. הודעות של Meta Business Agent מחויבות גם בחלון הזה, והמחשבון
        לא כולל אותן, כי החיוב עליהן לפי טוקנים ולא לפי הודעה.
      </p>
      <p>
        את הסוג של תבנית בוחר העסק כשהוא יוצר אותה, ו-Meta בודקת אותה. תבנית שמערבת עדכון עם מבצע, או שהתוכן שלה לא
        ברור, נחשבת לשיווק, ו-Meta יכולה להעביר תבנית עדכונים לסוג שיווק גם אחרי שאישרה אותה.
      </p>

      <h2>בוט AI בוואטסאפ: מה מותר מאז ינואר 2026</h2>
      <p>
        ב-15 בינואר 2026 נכנס לתוקף שינוי בתנאים של WhatsApp Business Platform: ספקי בינה מלאכותית, כמו חברות שמפתחות
        מודלי שפה ועוזרי AI כלליים, רשאים להציע בפלטפורמה עוזר AI כללי רק במדינות שבהן Meta מחויבת בחוק לאפשר את זה.
        ישראל לא ברשימה. בעקבות השינוי OpenAI הודיעה ב-21 באוקטובר 2025 ש-ChatGPT לא יהיה זמין בוואטסאפ אחרי 15
        בינואר 2026.
      </p>
      <p>
        האיסור חל על מי שהמוצר שלו הוא העוזר עצמו, ולא על עסק שמשתמש ב-AI כדי לשרת את הלקוחות שלו. Meta כותבת
        שהודעות שירות יכולות להישלח מפתרון AI של צד שלישי, כך שבוט שעונה על שאלות על העסק, קובע תורים, בודק סטטוס של
        הזמנה ומעביר לנציג מותר, גם כשהוא מבוסס על מודל שפה. כל תשובה שלו היא הודעת שירות רגילה, ומחויבת כמו כל הודעת
        שירות. מה ההבדל בין בוט תפריטים לסוכן AI ומה צריך כדי להקים אחד, פירטנו במדריך{' '}
        <Link href="/blog/whatsapp-bot-for-business">בוט וואטסאפ לעסקים</Link>.
      </p>

      <h2>הודעות שיווקיות: מה החוק דורש</h2>
      <p>
        סעיף 30א לחוק התקשורת (בזק ושידורים) אוסר לשלוח ״דבר פרסומת״ בהודעה אלקטרונית או בהודעת מסר קצר בלי הסכמה
        מפורשת מראש של הנמען, בכתב, ואפשר לקבל אותה גם בהודעה אלקטרונית או בשיחה מוקלטת. יש חריג צר ללקוח שמסר את
        פרטיו בזמן רכישה או משא ומתן, קיבל הודעה שהם ישמשו לפרסומת והזדמנות לסרב ולא סירב, כשהפרסומת היא על מוצר
        או שירות דומה.
        הודעה כזאת צריכה להתחיל במילה ״פרסומת״, לכלול את שם העסק ודרכי יצירת הקשר ולהסביר איך מבקשים הסרה, ועל כל
        הודעה שנשלחה ביודעין בניגוד לסעיף בית משפט יכול לפסוק פיצוי של עד 1,000 ₪ בלי שהנמען יוכיח נזק. גם Meta
        מתירה לשלוח הודעות רק למי שהסכים לקבל הודעות מהעסק. הודעה אוטומטית שעונה למי שפנה אליכם היא מענה ולא דיוור,
        ואת ההבדל פירטנו ב
        <Link href="/tools/whatsapp-auto-reply-messages">מחולל ההודעות האוטומטיות לוואטסאפ עסקי</Link>. זה מידע כללי
        ולא ייעוץ משפטי.
      </p>

      <h2>איך מורידים את העלות</h2>
      <ul>
        <li>
          <strong>לנסח עדכונים כעדכונים.</strong> אישור הזמנה, עדכון משלוח ותזכורת לתור עולים בישראל{' '}
          {formatRate(IL.utility)}, פי {MARKETING_TO_UTILITY} פחות מהודעת שיווק. קופון בסוף הודעת משלוח הופך אותה
          לשיווק, ולכן את המבצע שולחים בהודעה נפרדת, ורק למי שהסכים לקבל אותו.
        </li>
        <li>
          <strong>לענות בתוך 24 השעות.</strong> תשובה חופשית בתוך החלון היא הודעת שירות: {FREE_SERVICE} הראשונות בחודש
          חינם, והשאר במחיר של הודעת עדכונים. אחרי שהחלון נסגר אפשר לפנות רק בתבנית, ותבנית שיווקית יקרה יותר.
        </li>
        <li>
          <strong>לרכז מידע בהודעה אחת.</strong> כל הודעה שנמסרת מחויבת בנפרד, ולכן הודעה אחת עם התאריך, השעה והכתובת
          זולה משלוש הודעות קצרות.
        </li>
        <li>
          <strong>לנצל את החלון של מודעות קליק לוואטסאפ.</strong> לקוח שהגיע ממודעה כזו ונענה בתוך 24 שעות פותח חלון
          של עד {META_RATES.freeEntryWindowDays} ימים שבו ההודעות אליו בחינם. זה הזמן לשלוח לו את ההצעה ואת העדכונים.
        </li>
        <li>
          <strong>לשלוח שיווק רק למי שרוצה.</strong> משלמים על כל הודעה שנמסרה, גם אם לא קראו אותה. רשימה של לקוחות
          שהסכימו קטנה וזולה יותר, ועומדת בחוק.
        </li>
        <li>
          <strong>לבדוק את החשבון של הספק.</strong> ספקים יכולים לגבות דמי שימוש משלהם, בנוסף לתעריפים של Meta.
          בקשו מהספק את המחיר לכל סוג הודעה והשוו אותו ל
          <a href={RATE_CARD_URL} rel="noopener" target="_blank">
            כרטיס התעריפים של Meta
          </a>
          . מע״מ ומסים אחרים לא כלולים בתעריפים: לפי Meta, מס שחל מופיע בחשבונית, ולכן בדקו בחשבונית שלכם.
        </li>
      </ul>

      <h2>מקורות</h2>
      <ul>
        {sources.map((source) => (
          <li key={source.label}>
            <a href={source.href} rel="noopener" target="_blank">
              {source.label}
            </a>
            : {source.note}
          </li>
        ))}
      </ul>
      <p className={styles.reviewed}>
        התעריפים והעובדות בדף נבדקו מול המקורות ב-23 באוקטובר 2026. Meta יכולה לעדכן תעריפים בתחילת כל רבעון, ולכן
        לפני החלטה כדאי לבדוק את כרטיס התעריפים העדכני. זה מידע כללי ולא ייעוץ משפטי או ייעוץ מס.
      </p>
    </ToolLayout>
  )
}
