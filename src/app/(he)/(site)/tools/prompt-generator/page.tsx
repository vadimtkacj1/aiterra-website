import { Fragment, type ReactNode } from 'react'
import Link from 'next/link'
import ToolLayout, { toolMetadata, type ToolFaqEntry } from '../../components/tools/ToolLayout'
import PromptGenerator, { PromptCopyButton } from '../../components/tools/PromptGenerator'
import { libraryByCategory, promptCategories, promptLibrary, type PromptCategoryId } from '@/lib/prompt-generator'
import { glossaryTerms, splitLatinRuns } from '@/lib/ai-glossary'
import styles from './page.module.css'

const PATH = '/tools/prompt-generator'
const TITLE = 'מחולל פרומפטים בעברית'
const LIBRARY_SIZE = promptLibrary.length
const META_TITLE = `מחולל פרומפטים בעברית: ${LIBRARY_SIZE} פרומפטים מוכנים לעסקים`
const DESCRIPTION = `מחולל פרומפטים בעברית: בוחרים משימה לעסק, ממלאים פרטים ומקבלים פרומפט מוכן ל-ChatGPT, ל-Claude ול-Gemini, ועוד ${LIBRARY_SIZE} פרומפטים מוכנים. חינם.`
const GLOSSARY_PATH = '/tools/ai-glossary'

const sources: { href: string; label: string; note: string }[] = [
  {
    href: 'https://developers.openai.com/api/docs/guides/prompt-engineering',
    label: 'OpenAI: המדריך להנדסת פרומפטים',
    note: 'תפקיד, הוראות, דוגמאות והקשר כחלקים של הפרומפט, הפרדה בכותרות ובתגיות, ומידע שמשתנה קרוב לסוף',
  },
  {
    href: 'https://developers.openai.com/api/docs/guides/reasoning-best-practices',
    label: 'OpenAI: המלצות לעבודה עם מודלי חשיבה',
    note: 'בקשה "לחשוב שלב אחר שלב" מיותרת במודלים האלה ולפעמים פוגעת, ודוגמאות צריכות להתאים בדיוק להוראות',
  },
  {
    href: 'https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices',
    label: 'Anthropic: המלצות לכתיבת פרומפטים',
    note: 'הוראות ברורות ומפורשות, הסבר למה, 3 עד 5 דוגמאות מגוונות, תפקיד, ולכתוב מה כן לעשות במקום מה לא',
  },
  {
    href: 'https://ai.google.dev/gemini-api/docs/prompting-strategies',
    label: 'Google: אסטרטגיות לכתיבת פרומפטים ל-Gemini',
    note: 'הוראות ברורות, מגבלות, פורמט התשובה, המלצה לצרף דוגמאות ופירוק של משימה מורכבת',
  },
  {
    href: 'https://support.google.com/google-ads/answer/7684791',
    label: 'העזרה של Google Ads: מודעות חיפוש רספונסיביות',
    note: 'כותרות של עד 30 תווים, תיאורים של עד 90 תווים, עד 15 כותרות ועד 4 תיאורים',
  },
  {
    href: 'https://github.com/openai/tiktoken',
    label: 'OpenAI: ספריית tiktoken',
    note: 'הטוקנייזר שבו מדדנו כמה טוקנים צורך טקסט בעברית לעומת אנגלית',
  },
]

const faq: ToolFaqEntry[] = [
  {
    id: 'prompt-gen-faq-what',
    question: 'מה זה מחולל פרומפטים?',
    answer:
      'מחולל פרומפטים הוא כלי שבונה בשבילכם את ההוראה לצ׳אט לפי מבנה קבוע: תפקיד, הקשר, משימה, מגבלות, פורמט ודוגמה. במחולל הזה בוחרים אחת מ-12 משימות של עסק קטן, ממלאים את מה שיודעים, ומקבלים פרומפט בעברית בשלוש גרסאות. הכלי לא שולח את הטקסט לשום מודל: הוא רק מרכיב אותו, ואתם מדביקים אותו ב-ChatGPT, ב-Claude או ב-Gemini.',
  },
  {
    id: 'prompt-gen-faq-how',
    question: 'איך כותבים פרומפט טוב לצ׳אט GPT?',
    answer:
      'כותבים כמו שמסבירים משימה לעובד חדש שלא מכיר את העסק: מה התפקיד שלו, מה הוא צריך לדעת על העסק ועל הקהל, מה בדיוק לעשות, מה אסור, ואיך התוצאה צריכה להיראות, כולל האורך. אם יש לכם טקסט קודם שאהבתם, צרפו אותו כדוגמה. אחרי התשובה הראשונה לא מתחילים מחדש: כותבים מה לשנות, למשל "קצר יותר ובלי אימוג׳ים".',
  },
  {
    id: 'prompt-gen-faq-hebrew',
    question: 'עדיף לכתוב פרומפט בעברית או באנגלית?',
    answer:
      'כשרוצים טקסט בעברית, כותבים את הפרומפט בעברית ומבקשים במפורש עברית תקנית ולשון פנייה. המודלים המובילים מבינים עברית היטב. ההבדל העיקרי הוא בעלות: בבדיקה שלנו, אותו תוכן בעברית צרך בערך פי 1.3 טוקנים מאשר באנגלית בטוקנייזר של GPT-4o ו-GPT-5. זה משנה כשמשלמים לפי שימוש ב-API, ולא במנוי חודשי לצ׳אט.',
  },
  {
    id: 'prompt-gen-faq-image',
    question: 'איך כותבים פרומפט לתמונה?',
    answer:
      'מתארים מה רואים בתמונה, ולא רק מה רוצים להשיג: מה במרכז, מה ברקע, מאיזו זווית, איזו תאורה, אילו צבעים ובאיזה סגנון, צילום או איור. מוסיפים את היחס בין הגובה לרוחב לפי המקום שבו התמונה תופיע. אם צריך בתמונה טקסט בעברית, בודקים כל אות לפני שמפרסמים, ולפעמים פשוט יותר להוסיף את הטקסט אחר כך בעורך.',
  },
  {
    id: 'prompt-gen-faq-models',
    question: 'הפרומפט יעבוד גם ב-Claude וב-Gemini?',
    answer:
      'כן. הפרומפט הוא טקסט רגיל, והמבנה שלו מבוסס על עקרונות שמופיעים במדריכים הרשמיים של OpenAI, של Anthropic ושל Google. יש הבדלים קטנים: Google ממליצה לצרף דוגמאות כמעט תמיד, Anthropic ממליצה על 3 עד 5 דוגמאות מגוונות, ו-OpenAI כותבת שבמודלי חשיבה לא צריך לבקש "לחשוב שלב אחר שלב". לכן במודל עם חשיבה מובנית כדאי לבחור בגרסה המפורטת.',
  },
  {
    id: 'prompt-gen-faq-agent',
    question: 'מה ההבדל בין פרומפט לסוכן AI?',
    answer:
      'פרומפט הוא הוראה שאתם כותבים ומדביקים בצ׳אט, ומישהו צריך לחזור על זה בכל פעם. סוכן AI מקבל את ההוראות פעם אחת, מחובר למידע של העסק ולמערכות שלו, כמו היומן, ה-CRM והוואטסאפ, ופועל בעצמו: עונה ללקוח, קובע תור או פותח ליד. כשאותו פרומפט חוזר כל יום, זה סימן שהמשימה מתאימה לסוכן.',
  },
]

const groupNotes: Partial<Record<PromptCategoryId, ReactNode>> = {
  product: (
    <>
      את הכותרת והתיאור שקיבלתם אפשר לבדוק באורך ובפיקסלים ב
      <Link href="/tools/google-snippet-preview">כלי לבדיקת כותרת ותיאור לגוגל</Link>.
    </>
  ),
  quote: (
    <>
      את ההצעה עצמה, עם הסעיפים, ההנחות והמע״מ, אפשר לסדר ב<Link href="/tools/price-quote-generator">מחולל הצעת מחיר</Link>.
    </>
  ),
  data: (
    <>
      מספרי טלפון ברשימה אפשר להעביר לפורמט אחיד גם בלי צ׳אט, ב
      <Link href="/tools/israeli-phone-format">כלי לקידומת ישראל ולניקוי רשימות</Link>.
    </>
  ),
  support: (
    <>
      להודעת פתיחה ולהודעת היעדרות בוואטסאפ עסקי יש נוסחים מוכנים ב
      <Link href="/tools/whatsapp-auto-reply-messages">מחולל ההודעות האוטומטיות</Link>.
    </>
  ),
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

export const metadata = toolMetadata({ path: PATH, metaTitle: META_TITLE, description: DESCRIPTION })

export default function PromptGeneratorPage() {
  return (
    <ToolLayout
      path={PATH}
      title={TITLE}
      metaTitle={META_TITLE}
      description={DESCRIPTION}
      lede={`מחולל פרומפטים בעברית בונה לכם הוראה מסודרת לצ׳אט, כמו ChatGPT, Claude או Gemini: בוחרים משימה, ממלאים כמה פרטים על העסק ומקבלים פרומפט מוכן בשלוש גרסאות. מתחת למחולל יש ספרייה של ${LIBRARY_SIZE} פרומפטים מוכנים לעסקים קטנים, עם הסבר מתי להשתמש בכל אחד.`}
      chips={[
        `${promptCategories.length} משימות של עסק`,
        '3 גרסאות לכל פרומפט',
        `${LIBRARY_SIZE} פרומפטים מוכנים`,
        'בלי הרשמה, הכול בדפדפן',
      ]}
      tool={<PromptGenerator />}
      faq={faq}
      cta={{
        text: 'סוכן AI שכבר מכיר את העסק, את המוצרים ואת הלקוחות שלכם עושה את המשימות האלה בלי שתצטרכו לכתוב פרומפט בכל פעם.',
        label: 'לשירות סוכני AI',
        href: '/services/ai-agents',
      }}
    >
      <h2>איך כותבים פרומפט: המבנה שהמחולל בונה</h2>
      <p>
        המדריכים הרשמיים של OpenAI, של Anthropic ושל Google לכתיבת פרומפטים חוזרים על אותם עקרונות: הוראות ברורות,
        הקשר, מגבלות, פורמט ודוגמאות. המחולל מסדר אותם בשישה חלקים, וזה גם מבנה טוב לפרומפט שכותבים לבד:
      </p>
      <ol>
        <li>
          <strong>תפקיד.</strong> מי המודל בשיחה הזאת, למשל &quot;קופירייטר של עסקים קטנים&quot;. לפי Anthropic, גם
          משפט אחד של תפקיד משנה את הטון ואת המיקוד של התשובה.
        </li>
        <li>
          <strong>הקשר.</strong> מה המודל צריך לדעת על העסק ועל הקהל. המודל לא מכיר את העסק שלכם, ואת מה שלא כתבתם
          הוא ינחש. Anthropic ממליצה גם להסביר למה הוראה מסוימת חשובה, כי המודל לומד מההסבר.
        </li>
        <li>
          <strong>משימה.</strong> מה בדיוק לעשות, עם פועל ברור: כתוב, סכם, השווה. המבחן ש-Anthropic מציעה: אם עמית
          שלא מכיר את המשימה היה מתבלבל מהפרומפט, גם המודל יתבלבל.
        </li>
        <li>
          <strong>מגבלות.</strong> מה חובה ומה אסור: מילים, הבטחות, פרטים שאסור להמציא. עדיף לכתוב מה כן לעשות, ולא
          רק מה לא לעשות.
        </li>
        <li>
          <strong>פורמט.</strong> איך התוצאה צריכה להיראות: רשימה, טבלה או פסקאות, וכמה מילים. Google ממליצה לציין את
          פורמט התשובה במפורש.
        </li>
        <li>
          <strong>דוגמאות.</strong> טקסט שאהבתם, שהמודל יחקה. Google ממליצה לצרף דוגמאות כמעט תמיד, ו-Anthropic
          ממליצה על 3 עד 5 דוגמאות מגוונות, מופרדות מההוראות.
        </li>
      </ol>
      <p>
        הסדר עצמו פחות חשוב מזה שכל חלק נמצא בפרומפט. OpenAI, למשל, ממליצה לשים מידע שמשתנה בין בקשות קרוב לסוף.
        מה שכן חשוב הוא להפריד בין החלקים בכותרות או בסימנים, כמו שהמחולל עושה עם הכותרות ועם המירכאות המשולשות
        סביב טקסט שמדביקים.
      </p>

      <h2>שלוש הגרסאות: מתי משתמשים בכל אחת</h2>
      <ul>
        <li>
          <strong>קצר:</strong> פסקה אחת עם העיקר. מתאים למשימה פשוטה, או כשממשיכים שיחה שכבר יש בה הקשר.
        </li>
        <li>
          <strong>מפורט:</strong> כל ששת החלקים עם כותרות. מתאים למשימה שחוזרת ושווה לשמור כתבנית: תשובות לביקורות,
          תיאורי מוצר, סיכומי פגישות.
        </li>
        <li>
          <strong>שלב אחר שלב:</strong> הגרסה המפורטת, ובסופה בקשה לעבוד לפי שלבים, לכתוב בקצרה מה נעשה בכל שלב ולשאול
          עד שלוש שאלות אם חסר מידע. מתאים לניתוח נתונים, להצעת מחיר ולקוד.
        </li>
      </ul>
      <p>
        במודלים עם חשיבה מובנית, OpenAI כותבת שבקשה כמו &quot;חשוב שלב אחר שלב&quot; מיותרת, ולפעמים אפילו פוגעת
        בתוצאה, כי המודל כבר חושב בפנים. אם בחרתם בצ׳אט במצב חשיבה, השתמשו בגרסה המפורטת.
      </p>

      <h2>פרומפטים בעברית: מה כדאי לבקש במפורש</h2>
      <p>
        מודל שלא קיבל הוראה אחרת כותב לפעמים עברית שנשמעת כמו תרגום מאנגלית. כמה דברים שהמחולל מוסיף בשבילכם, וכדאי
        להוסיף גם כשכותבים לבד:
      </p>
      <ul>
        <li>
          <strong>לשון פנייה.</strong> ברבים, ביחיד, ביחידה, או בלי לשון זכר ונקבה. ניסוח בלי מגדר נשען על שם פועל
          (&quot;אפשר להזמין&quot;) או על גוף ראשון רבים (&quot;נשמח לעזור&quot;).
        </li>
        <li>
          <strong>בלי תרגומית.</strong> מבקשים במפורש עברית שנשמעת כמו שדוברי עברית כותבים, ולא ביטויים שתורגמו
          מילה במילה מאנגלית, כמו &quot;לקחת החלטה&quot; במקום &quot;לקבל החלטה&quot;.
        </li>
        <li>
          <strong>מספרים, מחירים ותאריכים.</strong> ספרות, ₪ ותאריך בפורמט שמקובל בישראל.
        </li>
        <li>
          <strong>מילים באנגלית.</strong> מבקשים את המילה העברית המקובלת, ומשאירים באנגלית רק שמות של מוצרים ומותגים.
        </li>
      </ul>
      <p>
        עברית גם צורכת יותר טוקנים. בבדיקה שלנו על עשרה משפטים עסקיים, אותו תוכן בעברית צרך בערך פי 1.3 טוקנים
        מאשר באנגלית בטוקנייזר של GPT-4o ו-GPT-5. במנוי לצ׳אט זה לא משנה, אבל בבוט שמשלם לפי שימוש זה חלק מהעלות.
        את המדידה המלאה פרסמנו ב<Link href={`${GLOSSARY_PATH}#hebrew-tokens`}>מילון מונחי הבינה המלאכותית</Link>,
        שמסביר עוד {glossaryTerms.length} מונחים, מטוקן ו-LLM ועד RAG ו-MCP.
      </p>

      <h2>פרומפט לתמונה</h2>
      <p>
        במשימה &quot;תמונה&quot; המחולל בונה פרומפט לצ׳אט שיוצר תמונות, כמו ChatGPT או Gemini, או לכלי אחר ליצירת
        תמונות. מה שמשנה את התוצאה:
      </p>
      <ul>
        <li>
          <strong>מה רואים.</strong> הנושא במרכז, הרקע והזווית. &quot;כוס קפה על שולחן עץ ליד חלון, בבוקר&quot; עדיף
          על &quot;תמונה של קפה&quot;.
        </li>
        <li>
          <strong>סגנון ותאורה.</strong> צילום ריאליסטי, איור שטוח או הדמיה בתלת-ממד, אור טבעי או תאורת סטודיו.
        </li>
        <li>
          <strong>יחס גובה-רוחב.</strong> ריבוע לפיד, 9:16 לסטורי, 16:9 לבאנר באתר.
        </li>
        <li>
          <strong>טקסט בתמונה.</strong> אם צריך טקסט בעברית, בודקים כל אות לפני שמפרסמים. לפעמים פשוט יותר לבקש
          תמונה בלי טקסט ולהוסיף אותו אחר כך בעורך.
        </li>
      </ul>
      <p>
        טיפ: אם התמונה לא יוצאת כמו שרציתם, בקשו מהצ׳אט לכתוב את התיאור באנגלית וליצור את התמונה שוב, והשוו בין
        התוצאות.
      </p>

      <h2 id="library">ספריית פרומפטים מוכנים לעסקים</h2>
      <p>
        {LIBRARY_SIZE} פרומפטים שכתבנו למשימות שחוזרות בעסק קטן. החלקים בסוגריים מרובעים הם המקומות שבהם משלימים
        את הפרטים שלכם לפני שמדביקים בצ׳אט.
      </p>
      {libraryByCategory.map(({ category, prompts }) => (
        <section key={category.id} className={styles.libraryGroup} aria-labelledby={`library-${category.id}`}>
          <h3 id={`library-${category.id}`}>{category.label}</h3>
          <ul className={styles.libraryList}>
            {prompts.map((prompt) => (
              <li key={prompt.id} id={`prompt-${prompt.id}`} className={styles.libraryItem}>
                <h4 className={styles.libraryTitle}>
                  <Mixed text={prompt.title} />
                </h4>
                <p className={styles.when}>
                  <strong>מתי להשתמש: </strong>
                  <Mixed text={prompt.when} />
                </p>
                <div className={styles.libraryText}>
                  <Mixed text={prompt.text} />
                </div>
                <PromptCopyButton text={prompt.text} category={prompt.category} title={prompt.title} />
              </li>
            ))}
          </ul>
          {groupNotes[category.id] ? <p className={styles.groupNote}>{groupNotes[category.id]}</p> : null}
        </section>
      ))}

      <h2>מה לא כדאי להדביק בצ׳אט</h2>
      <p>פרומפט טוב כולל פרטים, אבל לא כל פרט. לפני שמדביקים מידע של לקוחות בצ׳אט:</p>
      <ul>
        <li>
          לא מדביקים מספרי תעודות זהות, פרטי אשראי, מידע רפואי או סיסמאות. במקום שם הלקוח אפשר לכתוב &quot;הלקוח&quot;.
        </li>
        <li>
          בודקים בהגדרות של השירות אם השיחות משמשות לאימון מודלים, ובתנאי השירות כמה זמן הן נשמרות. התשובה שונה בין
          מנוי פרטי, מנוי עסקי ו-API.
        </li>
        <li>בעסק עם עובדים קובעים נוהל: באילו כלים מותר להשתמש ומה אסור להזין להם.</li>
      </ul>
      <p>
        חוק הגנת הפרטיות חל גם על מידע אישי שמזינים לכלי AI. הסברנו על זה במילון, בערכים{' '}
        <Link href={`${GLOSSARY_PATH}#personal-data`}>מידע אישי בכלי AI</Link> ו
        <Link href={`${GLOSSARY_PATH}#ai-policy`}>נוהל שימוש בבינה מלאכותית</Link>. זה מידע כללי ולא ייעוץ משפטי.
      </p>

      <h2>כשאותו פרומפט חוזר כל יום</h2>
      <p>
        אם אתם מדביקים את אותו פרומפט כל בוקר, למשל כדי לענות לביקורות, לסכם פניות או לנסח תשובות בוואטסאפ, המשימה כבר
        לא צריכה צ׳אט. סוכן AI מקבל את ההוראות פעם אחת, מחובר למידע של העסק ולמערכות שלו, ועושה את העבודה בלי שמישהו
        יעתיק וידביק. הסברנו את ההבדל במדריך <Link href="/blog/ai-agents-for-business">מה סוכן AI עושה בעסק</Link>.
      </p>

      <h2>מקורות</h2>
      <ul>
        {sources.map((source) => (
          <li key={source.href}>
            <a href={source.href} rel="noopener" target="_blank">
              <Mixed text={source.label} />
            </a>
            : <Mixed text={source.note} />
          </li>
        ))}
      </ul>
      <p className={styles.reviewed}>
        המקורות נבדקו ב-23 באוקטובר 2026. הכלי לא שולח את מה שכתבתם לשום מודל ולא שומר אותו: הפרומפט נבנה בדפדפן
        שלכם.
      </p>
    </ToolLayout>
  )
}
