import Link from 'next/link'
import ToolLayout, { toolMetadata, type ToolFaqEntry } from '../../components/tools/ToolLayout'
import AiToolsHebrew from '../../components/tools/AiToolsHebrew'
import { AI_TOOLS_CHECKED, aiTools, countHebrewUi } from '@/lib/ai-tools-hebrew'
import styles from './page.module.css'

const PATH = '/tools/ai-tools-hebrew'
const TITLE = 'כלי AI בעברית: מה באמת עובד בעברית'
const META_TITLE = 'כלי AI בעברית: מה באמת עובד בעברית (2026)'
const DESCRIPTION =
  'כלי AI בעברית: 25 כלים לצ׳אט, תרגום, תמונות, וידאו, תמלול, מצגות ואוטומציה, ומה כל יצרן באמת מתעד על עברית. עם תוכנית חינם, מחירים ותאריך בדיקה.'

const faq: ToolFaqEntry[] = [
  {
    id: 'ai-tools-hebrew-faq-best-chat',
    question: 'איזה צ׳אט AI הכי טוב בעברית?',
    answer:
      'אין ליצרנים מדד רשמי לאיכות בעברית, ולכן אנחנו לא מדרגים. מה שכן מתועד: ChatGPT ו-Gemini מציעים ממשק בעברית, ו-Microsoft מונה עברית בין השפות של Copilot. הממשק של Claude לא בעברית, אבל Anthropic כותבת שאפשר לכתוב לו בכל שפה. הדרך הטובה לבחור היא לתת לשניים או שלושה כלים את אותה משימה אמיתית מהעסק ולהשוות.',
  },
  {
    id: 'ai-tools-hebrew-faq-transcription',
    question: 'איזה כלי מתמלל עברית?',
    answer:
      'ivrit.ai הוא מיזם ללא מטרות רווח שמתמחה בעברית, עם כלי תמלול חינמי ומודלים פתוחים שאומנו על יותר מ-22,000 שעות דיבור. Whisper של OpenAI תומך בעברית, ו-ElevenLabs מסווג את הדיוק שלו בעברית בשיעור שגיאות של 10% עד 20%. Otter.ai, לעומת זאת, לא מתמלל עברית בכלל. לפני שמשלמים, נסו קובץ קצר מהעסק.',
  },
  {
    id: 'ai-tools-hebrew-faq-image-text',
    question: 'אפשר ליצור תמונה עם טקסט בעברית ב-AI?',
    answer:
      'לא מצאנו יצרן של מחולל תמונות שמתעד כתיבה בעברית בתוך התמונה. Midjourney כותבת שטקסט בתמונה עובד הכי טוב באותיות לטיניות. הדרך האמינה היא ליצור תמונה בלי טקסט, ולהוסיף את הכותרת בעברית בעורך גרפי כמו Canva, שבו בוחרים גופן עברי ושולטים בכיוון הטקסט.',
  },
  {
    id: 'ai-tools-hebrew-faq-free',
    question: 'אילו כלי AI בעברית חינמיים?',
    answer:
      'לרוב הכלים בטבלה יש תוכנית חינם מוגבלת: ChatGPT, ‏Claude, ‏Gemini, ‏DeepL, ‏Canva, ‏Gamma, ‏ElevenLabs ו-Make, ביניהם. ל-ivrit.ai יש כלי תמלול חינמי, ו-Whisper הוא קוד פתוח. ל-Midjourney אין תוכנית חינם. המגבלות משתנות לעתים קרובות, ולכן בכל שורה יש קישור לדף המחירים של היצרן.',
  },
  {
    id: 'ai-tools-hebrew-faq-method',
    question: 'איך בדקתם את הכלים?',
    answer:
      'פתחנו את דפי התמיכה, התיעוד והמחירים של כל יצרן וכתבנו רק מה שכתוב שם, עם קישור למקור. ״ממשק בעברית: כן״ פירושו שעברית מופיעה ברשימת השפות של היצרן. כשלא מצאנו רשימה כתבנו זאת, גם אם ייתכן שהכלי עובד בעברית. לא נתנו ציונים, כי לא הרצנו מבחן איכות אחיד על כל הכלים.',
  },
  {
    id: 'ai-tools-hebrew-faq-business',
    question: 'מאיפה עסק קטן מתחיל עם AI?',
    answer:
      'ממשימה אחת שחוזרת כל שבוע: מענה ללידים, סיכום שיחות או כתיבת פוסטים. בוחרים כלי אחד מהטבלה, עובדים איתו שבועיים ומודדים כמה זמן נחסך. כשהמשימה מחייבת חיבור למערכות של העסק, כמו יומן, CRM או וואטסאפ, צ׳אט כללי כבר לא מספיק, ושם נכנסים כלי אוטומציה או סוכן AI שבנוי לעסק.',
  },
]

const uniqueSources = [...new Map(aiTools.map((tool) => [tool.source, tool])).values()]

export const metadata = toolMetadata({ path: PATH, metaTitle: META_TITLE, description: DESCRIPTION })

export default function AiToolsHebrewPage() {
  return (
    <ToolLayout
      path={PATH}
      title={TITLE}
      metaTitle={META_TITLE}
      description={DESCRIPTION}
      lede={`טבלה של ${aiTools.length} כלי AI לעסקים, ולכל אחד מה היצרן עצמו מתעד על עברית: ממשק, תרגום, תמלול או קול. בלי ציונים ממוצאים ובלי קישורי שותפים, עם מקור ותאריך בדיקה לכל שורה.`}
      chips={[`${aiTools.length} כלים`, '8 קטגוריות', `נבדק ב-${AI_TOOLS_CHECKED}`, 'בלי קישורי שותפים']}
      tool={<AiToolsHebrew checked={AI_TOOLS_CHECKED} />}
      faq={faq}
      cta={{
        text: 'צריכים יותר מצ׳אט? אנחנו בונים סוכני AI שעונים ללקוחות בעברית, קובעים תורים ומעדכנים את ה-CRM.',
        label: 'סוכני AI לעסקים',
        href: '/services/ai-agents',
      }}
    >
      <h2>איך לקרוא את הטבלה</h2>
      <p>
        <strong>ממשק בעברית</strong> אומר אם התפריטים והכפתורים זמינים בעברית. סימנו ״כן״ רק כשעברית מופיעה ברשימת
        השפות של היצרן, ו״לא״ רק כשיש רשימה ועברית לא בה. ״לא מצאנו רשימה״ לא אומר שהכלי לא עובד בעברית, אלא שהיצרן
        לא כתב את זה במקום שמצאנו. נכון לבדיקה, {countHebrewUi()} מתוך {aiTools.length} הכלים עומדים ברף הזה.
      </p>
      <p>
        <strong>עברית לפי היצרן</strong> היא מה שהיצרן מתעד על עבודה עם תוכן בעברית: תרגום, תמלול, קולות או כתיבה
        מימין לשמאל. ממשק באנגלית לא מונע לכתוב בעברית: אפשר לכתוב ל-Claude בעברית, למשל, גם כשהממשק שלו באנגלית.
      </p>
      <p>
        <strong>חינם</strong> מציין אם יש תוכנית חינם או ניסיון. ״לא בדקנו״ פירושו שלא הצלחנו לאמת את זה בדף המחירים.
        מחירים לא כתבנו, כי הם משתנים ולפעמים מוצגים לפי מדינה. השוואה של מחירי מנויים בשקלים יש ב
        <Link href="/tools/ai-subscription-prices">מחשבון מחירי מנויי AI</Link>.
      </p>

      <h2>מה עובד בעברית, לפי משימה</h2>
      <h3>צ׳אט וכתיבה</h3>
      <p>
        ChatGPT ו-Gemini מציעים ממשק בעברית. Microsoft מונה עברית בין השפות ש-Copilot מקבל ועונה בהן. לתרגום,
        DeepL הוסיפה עברית ביוני 2025, כולל מסמכים מימין לשמאל.
      </p>
      <h3>תמלול</h3>
      <p>
        זה התחום שבו ההבדלים בעברית הכי גדולים. ivrit.ai בנה מודלים לעברית בלבד, Whisper תומך בעברית וכותב בעצמו
        שהביצועים משתנים בין שפות, ו-Otter.ai לא תומך בעברית בכלל.
      </p>
      <h3>תמונות ווידאו</h3>
      <p>
        מחוללי תמונות לא מתעדים כתיבה בעברית בתוך התמונה. לווידאו, HeyGen מציעה דיבוב לעברית ו-Synthesia קולות
        בעברית. בדקו הגייה של שמות ומונחים מקומיים לפני פרסום.
      </p>
      <h3>מצגות ואוטומציה</h3>
      <p>
        Gamma מתעדת יצירה ועריכה בשפות מימין לשמאל, כולל עברית. בכלי אוטומציה כמו Zapier, ‏Make ו-n8n השפה פחות
        חשובה: הם מעבירים נתונים בין מערכות, והטקסט בעברית עובר כמו שהוא.
      </p>

      <h2>איך לבדוק כלי בעברית בעצמכם</h2>
      <ol>
        <li>קחו משימה אמיתית: מייל ללקוח, הקלטה של פגישה או פוסט, לא משפט לדוגמה.</li>
        <li>תנו את אותה משימה לשניים או שלושה כלים מאותה קטגוריה.</li>
        <li>בדקו שמות, מספרים ומונחים מקצועיים, שם רוב הטעויות בעברית.</li>
        <li>בצ׳אט שמשלם לפי שימוש, זכרו שעברית צורכת יותר טוקנים. יש על זה מדידה ב<Link href="/tools/ai-glossary#hebrew-tokens">מילון מונחי AI</Link>.</li>
      </ol>
      <p>
        לניסוח הוראה טובה לצ׳אט יש <Link href="/tools/prompt-generator">מחולל פרומפטים בעברית</Link>.
      </p>
      <p className={styles.caveat}>
        אין בדף קישורי שותפים, ואנחנו לא מקבלים תשלום מאף יצרן. הדף מתעדכן אחת לחודש.
      </p>

      <h2>מקורות</h2>
      <ul className={styles.sources}>
        {uniqueSources.map((tool) => (
          <li key={tool.source}>
            <a href={tool.source} rel="noopener" target="_blank" lang="en" dir="ltr">
              {tool.name}
            </a>
            : {tool.source.replace(/^https:\/\//, '').split('/')[0]}
          </li>
        ))}
      </ul>
      <p className={styles.reviewed}>כל המקורות נפתחו ונבדקו ב-{AI_TOOLS_CHECKED}.</p>
    </ToolLayout>
  )
}
