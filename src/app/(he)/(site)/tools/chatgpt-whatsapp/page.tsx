import Link from 'next/link'
import ToolLayout, { toolMetadata, type ToolFaqEntry } from '../../components/tools/ToolLayout'
import WhatsAppAiChecker from '../../components/tools/WhatsAppAiChecker'
import { WHATSAPP_AI_CHECKED, decisionRows, verdictLabels, whatsappAiSources } from '@/lib/chatgpt-whatsapp'
import styles from './page.module.css'

const PATH = '/tools/chatgpt-whatsapp'
const TITLE = 'צ׳אט GPT בוואטסאפ: מה השתנה ב-2026'
const META_TITLE = 'צ׳אט GPT בוואטסאפ: מה השתנה ב-2026 ומה עובד'
const DESCRIPTION =
  'צ׳אט GPT בוואטסאפ הפסיק לעבוד בישראל ב-15 בינואר 2026. מה קרה, מה עדיין עובד (Meta AI ובוטים של עסקים), ובדיקה קצרה: מה מותר לכם לעשות.'

const sources = [
  { ...whatsappAiSources.openaiTransition, note: 'סיום השירות ב-15 בינואר 2026' },
  { ...whatsappAiSources.openaiHelp, note: 'החזרה לאזור הכלכלי האירופי, המספר 1-800-242-8478' },
  { ...whatsappAiSources.solutionTerms, note: 'סעיף 4.7: AI Providers, ומה מותר לספק AI שמשרת עסק' },
  { ...whatsappAiSources.aiProviders, note: 'עודכן ב-15 באוקטובר 2026, רשימת המדינות' },
  { ...whatsappAiSources.metaAi, note: 'זמינות לפי מדינה ושימוש בפרומפטים' },
  { ...whatsappAiSources.terms, note: 'איסור auto-messaging ושימוש לא אישי בלי אישור' },
]

const faq: ToolFaqEntry[] = [
  {
    id: 'chatgpt-whatsapp-faq-not-working',
    question: 'למה צ׳אט GPT בוואטסאפ לא עובד?',
    answer:
      'כי השירות הופסק. OpenAI הודיעה ש-ChatGPT לא יהיה זמין בוואטסאפ אחרי 15 בינואר 2026, בגלל שינוי במדיניות ובתנאים של WhatsApp, שאוסרים על ספקי AI להציע עוזר AI כללי בפלטפורמה העסקית. השיחות הישנות לא עברו אוטומטית, אלא רק אצל מי שקישר לפני כן את המספר לחשבון ChatGPT. זו לא תקלה בטלפון שלכם, ואין הגדרה שמחזירה את השירות.',
  },
  {
    id: 'chatgpt-whatsapp-faq-number',
    question: 'מה המספר של צ׳אט GPT בוואטסאפ?',
    answer:
      'המספר הרשמי הוא 1-800-242-8478, איש הקשר המאומת 1-800-ChatGPT. לפי מרכז העזרה של OpenAI, השירות בוואטסאפ חזר רק לאזור הכלכלי האירופי, והזמינות נקבעת לפי הקידומת של המספר שלכם. ממספר ישראלי הוא לא יענה. היזהרו ממספרים אחרים שמציגים את עצמם כ״ChatGPT בוואטסאפ״: הם לא של OpenAI.',
  },
  {
    id: 'chatgpt-whatsapp-faq-install',
    question: 'איך מתקינים צ׳אט GPT בוואטסאפ?',
    answer:
      'אין מה להתקין. גם כשהשירות עבד, הוא היה איש קשר שכותבים אליו, לא תוסף. היום, בישראל, הדרך להשתמש ב-ChatGPT היא האפליקציה לאנדרואיד או ל-iPhone, או chatgpt.com בדפדפן. אם רוצים AI בתוך וואטסאפ עצמו, בודקים אם Meta AI זמין אצלכם: הוא מופיע כעיגול צבעוני בלשונית הצ׳אטים.',
  },
  {
    id: 'chatgpt-whatsapp-faq-meta-ai',
    question: 'מה ההבדל בין Meta AI לבין ChatGPT בוואטסאפ?',
    answer:
      'Meta AI הוא העוזר של Meta עצמה, מובנה בוואטסאפ, ולכן התנאים שחסמו את ChatGPT לא חלים עליו. לפי WhatsApp אפשר לכתוב לו בכל שפה, אבל הוא זמין רק בחלק מהמדינות, ולא תמיד לכל המשתמשים בהן. Meta כותבת שהיא עשויה להשתמש בפרומפטים ובהודעות שמשתפים איתו כדי לשפר את ה-AI, כך שלא כדאי לשתף בו מידע רגיש.',
  },
  {
    id: 'chatgpt-whatsapp-faq-business',
    question: 'האם עסק עדיין יכול להפעיל בוט AI בוואטסאפ?',
    answer:
      'כן. האיסור חל על ספקי AI שה-AI הוא השירות העיקרי שהם מציעים. בוט שעונה ללקוחות על העסק שלכם, כמו שעות, מחירים, הזמנות ותורים, הוא שימוש נלווה ומותר. עושים את זה דרך WhatsApp Business Platform הרשמי, ומותר להיעזר בחברת AI כספק, בתנאי שהנתונים מהשיחות לא משמשים לאימון מודלים של אחרים.',
  },
  {
    id: 'chatgpt-whatsapp-faq-europe',
    question: 'למה באירופה ChatGPT בוואטסאפ חזר ובישראל לא?',
    answer:
      'לפי Meta, ספקי AI רשאים להציע עוזר AI כללי בפלטפורמה רק במקומות שבהם Meta מחויבת לכך בחוק. בעדכון מ-15 באוקטובר 2026 הרשימה כוללת את מדינות האזור הכלכלי האירופי, ברזיל וטורקיה. ישראל לא ברשימה, ולכן משתמשים עם מספר ישראלי לא יכולים לדבר עם 1-800-ChatGPT בוואטסאפ.',
  },
]

const externalLink = (href: string, label: string) => (
  <a href={href} rel="noopener" target="_blank">
    {label}
  </a>
)

export const metadata = toolMetadata({ path: PATH, metaTitle: META_TITLE, description: DESCRIPTION })

export default function ChatGptWhatsAppPage() {
  return (
    <ToolLayout
      path={PATH}
      title={TITLE}
      metaTitle={META_TITLE}
      description={DESCRIPTION}
      lede="מ-15 בינואר 2026 ChatGPT לא זמין בוואטסאפ למספרים ישראליים, כי WhatsApp שינתה את התנאים לספקי AI. בחרו מה אתם רוצים לעשות, ותראו אם זה עדיין אפשרי ואיך."
      chips={['פרטיים ועסקים', 'לפי התנאים של WhatsApp', `נבדק ב-${WHATSAPP_AI_CHECKED}`]}
      tool={<WhatsAppAiChecker />}
      faq={faq}
      cta={{
        text: 'רוצים בוט AI בוואטסאפ שעונה ללקוחות שלכם, קובע תורים ומעביר לנציג, במסגרת התנאים של Meta?',
        label: 'סוכני AI לעסקים',
        href: '/services/ai-agents',
      }}
    >
      <h2>מה קרה ל-ChatGPT בוואטסאפ</h2>
      <p>
        OpenAI הפעילה את 1-800-ChatGPT, איש קשר בוואטסאפ שאפשר היה לכתוב לו בלי חשבון. לפי{' '}
        {externalLink(whatsappAiSources.openaiTransition.href, 'ההודעה של OpenAI')}, יותר מ-50 מיליון אנשים השתמשו
        בו, אבל ״בגלל שינוי במדיניות ובתנאים של WhatsApp״ השירות לא זמין בוואטסאפ אחרי 15 בינואר 2026. מי שקישר
        את המספר לחשבון ChatGPT לפני כן קיבל את השיחות הישנות בהיסטוריה של החשבון. מי שלא, איבד אותן, כי WhatsApp לא
        מאפשרת לייצא שיחות.
      </p>
      <p>
        השינוי בא מסעיף 4.7 ב{externalLink(whatsappAiSources.solutionTerms.href, 'תנאים של WhatsApp Business')}:
        ספקים ומפתחים של טכנולוגיות AI, ובהם ״עוזרי AI כלליים״, אסורים בשימוש ב-WhatsApp Business Platform כשה-AI
        הוא הפונקציה העיקרית ולא נלווית. לפי{' '}
        {externalLink(whatsappAiSources.aiProviders.href, 'דף המדיניות של Meta')}, החסימה בתוקף מ-15 בינואר 2026,
        למעט מקומות שבהם Meta מחויבת בחוק לאפשר את זה. בעדכון מ-15 באוקטובר 2026 אלה מדינות האזור הכלכלי האירופי,
        ברזיל וטורקיה, ולכן לפי{' '}
        {externalLink(whatsappAiSources.openaiHelp.href, 'מרכז העזרה של OpenAI')} השירות חזר שם. ישראל לא ברשימה.
      </p>

      <h2>מה עדיין עובד</h2>
      <ul>
        <li>
          <strong>אפליקציית ChatGPT:</strong> לאנדרואיד, ל-iPhone ובדפדפן ב-chatgpt.com. אותו ChatGPT, רק לא בתוך
          וואטסאפ.
        </li>
        <li>
          <strong>Meta AI בתוך וואטסאפ:</strong> העוזר של Meta עצמה. לפי{' '}
          {externalLink(whatsappAiSources.metaAi.href, 'WhatsApp')} הוא זמין רק בחלק מהמדינות, ואפשר לכתוב לו בכל
          שפה.
        </li>
        <li>
          <strong>בוטים של עסקים:</strong> בוט שעונה ללקוחות של עסק על העסק עצמו לא נחשב ״עוזר AI כללי״, ונשאר
          מותר.
        </li>
      </ul>

      <h2>טבלת החלטה לעסקים ולפרטיים</h2>
      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <caption className={styles.caption}>מה צריך ומה האפשרות, נכון ל-{WHATSAPP_AI_CHECKED}</caption>
          <thead>
            <tr>
              <th scope="col">מה צריך</th>
              <th scope="col">האפשרות</th>
              <th scope="col">מצב</th>
            </tr>
          </thead>
          <tbody>
            {decisionRows.map((row) => (
              <tr key={row.need}>
                <th scope="row">{row.need}</th>
                <td>{row.option}</td>
                <td>{verdictLabels[row.status]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2>בוט AI לעסק בוואטסאפ: מה מותר</h2>
      <p>
        ההבחנה בתנאים היא בין AI כ״פונקציה עיקרית״ לבין AI ״נלווה״. עסק שמפעיל בוט שעונה על שאלות על המוצרים, על
        ההזמנות או על התורים שלו משתמש ב-AI ככלי לשירות שלו. ספק שמציע ״צ׳אט AI על כל נושא״ דרך וואטסאפ הוא ספק AI,
        וזה מה שנחסם.
      </p>
      <ul>
        <li>
          עובדים דרך WhatsApp Business Platform הרשמי. כמה זה עולה לפי כמות ההודעות, אפשר לחשב ב
          <Link href="/tools/whatsapp-api-cost-calculator">מחשבון עלות WhatsApp Business API</Link>.
        </li>
        <li>
          מותר להיעזר בחברת AI כספק, אבל לפי סעיף 4.7 אסור שהנתונים מהשיחות ישמשו לאימון מודלים של אחרים. מותר לכוונן
          מודל שמשמש רק אתכם.
        </li>
        <li>
          בוט על המספר הרגיל דרך כלים לא רשמיים מסכן את המספר:{' '}
          {externalLink(whatsappAiSources.terms.href, 'תנאי השימוש של WhatsApp')} אוסרים auto-messaging ושימוש לא אישי
          בלי אישור.
        </li>
        <li>
          לא צריכים AI? הודעת פתיחה והודעת היעדרות באפליקציית WhatsApp Business עונות מיד. נוסחים מוכנים יש ב
          <Link href="/tools/whatsapp-auto-reply-messages">הודעות אוטומטיות לוואטסאפ עסקי</Link>.
        </li>
      </ul>
      <p>
        מדריך מלא לבניית בוט, משלב התכנון ועד ההעברה לנציג, יש ב
        <Link href="/blog/whatsapp-bot-for-business">מדריך בוט וואטסאפ לעסק</Link>.
      </p>
      <p className={styles.caveat}>
        המדיניות של Meta והשירותים של OpenAI משתנים. הדף מתאר את המצב לפי המקורות ביום הבדיקה, ואינו ייעוץ משפטי.
      </p>

      <h2>מקורות</h2>
      <ul>
        {sources.map((source) => (
          <li key={source.href}>
            {externalLink(source.href, source.label)}: {source.note}
          </li>
        ))}
      </ul>
      <p className={styles.reviewed}>המקורות נבדקו ב-{WHATSAPP_AI_CHECKED}.</p>
    </ToolLayout>
  )
}
