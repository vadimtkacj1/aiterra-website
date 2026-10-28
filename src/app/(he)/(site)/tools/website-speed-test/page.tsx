import Link from 'next/link'
import ToolLayout, { toolMetadata, type ToolFaqEntry } from '../../components/tools/ToolLayout'
import WebsiteSpeedTest from '../../components/tools/WebsiteSpeedTest'
import styles from './page.module.css'

const PATH = '/tools/website-speed-test'
const TITLE = 'בדיקת מהירות אתר'
const META_TITLE = 'בדיקת מהירות אתר: כמה מהר האתר שלכם נטען, במובייל ובמחשב'
const DESCRIPTION =
  'בדיקת מהירות טעינת אתר בחינם: מקלידים כתובת ומקבלים ציון ביצועים של Google, LCP, CLS ו-INP, נתוני גולשים אמיתיים ו-5 הדברים שהכי מאטים את הדף, בעברית פשוטה.'

const thresholdRows: { metric: string; good: string; poor: string; meaning: string }[] = [
  {
    metric: 'LCP',
    good: 'עד 2.5 שניות',
    poor: 'מעל 4 שניות',
    meaning: 'מתי מופיע התוכן הגדול ביותר במסך הראשון',
  },
  {
    metric: 'INP',
    good: 'עד 200 מילישניות',
    poor: 'מעל 500 מילישניות',
    meaning: 'כמה מהר הדף מגיב ללחיצה, נמדד רק אצל גולשים אמיתיים',
  },
  {
    metric: 'CLS',
    good: 'עד 0.1',
    poor: 'מעל 0.25',
    meaning: 'כמה התוכן קופץ ממקומו בזמן הטעינה',
  },
  {
    metric: 'FCP',
    good: 'עד 1.8 שניות',
    poor: 'מעל 3 שניות',
    meaning: 'מתי מופיע משהו ראשון על המסך',
  },
  {
    metric: 'TBT',
    good: 'עד 200 מילישניות',
    poor: 'מעל 600 מילישניות',
    meaning: 'כמה זמן JavaScript תקע את הדף, במדידת המעבדה',
  },
]

const sources: { href: string; label: string; note: string }[] = [
  {
    href: 'https://developers.google.com/speed/docs/insights/v5/about',
    label: 'Google: About PageSpeed Insights',
    note: 'טווחי הציון 90 ומעלה, 50 עד 89 ומתחת ל-50, וחלון של 28 יום לנתוני השטח',
  },
  {
    href: 'https://developers.google.com/search/docs/appearance/core-web-vitals',
    label: 'Google Search Central: Understanding Core Web Vitals and Google search results',
    note: 'הספים של LCP, INP ו-CLS, והקשר שלהם למערכות הדירוג',
  },
  {
    href: 'https://developers.google.com/search/docs/appearance/page-experience',
    label: 'Google Search Central: Understanding page experience in Google Search results',
    note: 'חוויית דף היא חלק מהדירוג, אבל רלוונטיות התוכן קודמת לה',
  },
]

const faq: ToolFaqEntry[] = [
  {
    id: 'speed-faq-score',
    question: 'מה נחשב ציון מהירות טוב?',
    answer:
      'לפי Google, ציון ביצועים של 90 ומעלה הוא טוב, 50 עד 89 דורש שיפור, ומתחת ל-50 נחשב איטי. אבל הציון הוא סיכום של מדידת מעבדה אחת, והוא משתנה בכמה נקודות בין בדיקה לבדיקה. חשוב יותר להסתכל על המדדים עצמם: LCP עד 2.5 שניות, INP עד 200 מילישניות ו-CLS עד 0.1. אם יש לאתר נתוני גולשים אמיתיים והם בירוק, האתר מהיר בשבילם גם כשהציון במובייל נראה בינוני.',
  },
  {
    id: 'speed-faq-mobile',
    question: 'למה הציון במובייל נמוך יותר מבמחשב?',
    answer:
      'כי הבדיקה במובייל מדמה טלפון בינוני עם מעבד חלש ורשת סלולרית איטית, ובמחשב היא מדמה מחשב חזק עם חיבור מהיר. אותו דף, עם אותן תמונות ואותו JavaScript, נטען לאט בהרבה בתנאים של הטלפון. לכן פער של 20 עד 40 נקודות בין מובייל למחשב הוא דבר רגיל. בישראל רוב הגולשים מגיעים מהטלפון, ו-Google בודק בעיקר את גרסת המובייל של האתר, ולכן כדאי לשפר קודם את ציון המובייל.',
  },
  {
    id: 'speed-faq-ranking',
    question: 'האם מהירות האתר משפיעה על הדירוג בגוגל?',
    answer:
      'כן, אבל במידה מוגבלת. Google כותב שמדדי Core Web Vitals, כלומר LCP, INP ו-CLS, תואמים את מה שמערכות הדירוג שלו מתגמלות, ושחוויית דף טובה עוזרת. באותו מסמך הוא גם כותב שהוא תמיד מעדיף את התוכן הרלוונטי ביותר, גם אם חוויית הדף שלו פחות טובה. כלומר, אתר מהיר לא יעקוף תוכן טוב יותר רק בזכות המהירות, אבל כשיש כמה דפים טובים באותה רמה, המהירות יכולה להכריע. וגולשים עוזבים דף איטי עוד לפני שהוא נטען.',
  },
  {
    id: 'speed-faq-field',
    question: 'מה ההבדל בין נתוני גולשים אמיתיים למדידת המעבדה?',
    answer:
      'נתוני הגולשים מגיעים מדוח החוויה של Chrome, ומסכמים איך הדף נטען אצל משתמשי Chrome אמיתיים ב-28 הימים האחרונים. אלה הנתונים ש-Google מסתכל עליהם כשהוא מעריך חוויית דף. מדידת המעבדה היא טעינה אחת מדומה בשרת של Google, והיא טובה כדי למצוא מה מאט את הדף ולבדוק תיקון מיד. באתר קטן לרוב אין מספיק גולשים לנתוני שטח, ואז רואים רק את המעבדה. אחרי תיקון, נתוני השטח מתעדכנים בהדרגה במשך כארבעה שבועות.',
  },
  {
    id: 'speed-faq-wordpress',
    question: 'איך מאיצים אתר וורדפרס?',
    answer:
      'ברוב אתרי וורדפרס שאנחנו רואים, האטיות מגיעה מארבעה דברים: אחסון זול ועמוס, בונה עמודים כבד, יותר מדי תוספים, ותמונות שהועלו בגודל מקורי. מה שעוזר בדרך כלל: אחסון עם מטמון בצד השרת, תוסף מטמון אחד שמכווץ ודוחה סקריפטים, המרת תמונות ל-WebP, הסרה של תוספים וסקריפטים שלא בשימוש, ו-CDN. אם התבנית עצמה בנויה מאלפי אלמנטים, יש גבול למה שתוספים יכולים לתקן, ולפעמים בנייה מחדש זולה יותר משיפורים חוזרים.',
  },
  {
    id: 'speed-faq-wix',
    question: 'האתר שלי בוויקס. אפשר לשפר את המהירות?',
    answer:
      'בוויקס, בשופיפיי ובפלטפורמות דומות אין גישה לשרת ולקוד, ולכן חלק מהמלצות הבדיקה לא בידיים שלכם, למשל זמן תגובת השרת או ה-JavaScript של הפלטפורמה עצמה. מה שכן אפשר לעשות: להקטין ולדחוס תמונות לפני העלאה, לוותר על אנימציות ווידאו ברקע במסך הראשון, להסיר אפליקציות ווידג׳טים שלא משתמשים בהם, ולהקטין את מספר האלמנטים בדף. אם האתר נשאר איטי אחרי כל אלה, המגבלה היא כנראה הפלטפורמה.',
  },
]

export const metadata = toolMetadata({ path: PATH, metaTitle: META_TITLE, description: DESCRIPTION })

export default function WebsiteSpeedTestPage() {
  return (
    <ToolLayout
      path={PATH}
      title={TITLE}
      metaTitle={META_TITLE}
      description={DESCRIPTION}
      lede="בודקים כמה מהר האתר שלכם נטען לגולשים, במובייל ובמחשב. מקלידים כתובת ומקבלים את ציון הביצועים של Google, את מדדי Core Web Vitals, את מה שגולשים אמיתיים חווים, ואת חמשת הדברים שהכי מאטים את הדף, מוסברים בעברית. זו בדיקת מהירות טעינה של אתר, לא בדיקת מהירות של חיבור האינטרנט."
      chips={['מובייל ומחשב', 'LCP, CLS, INP ו-TBT', 'נתוני גולשים אמיתיים מ-Google', '5 תיקונים בעברית']}
      tool={<WebsiteSpeedTest />}
      faq={faq}
      cta={{
        text: 'האתר שלכם איטי? אנחנו בונים אתרים מהירים, עם ציון ירוק במובייל כבר מההשקה, בלי בוני עמודים כבדים ותוספים מיותרים.',
        label: 'בניית אתר תדמית',
        href: '/services/brochure',
      }}
    >
      <h2 id="how" className={styles.anchor}>
        איך עובדת בדיקת מהירות האתר
      </h2>
      <ol>
        <li>מקלידים כתובת של דף, דף הבית או כל דף אחר, ובוחרים מובייל או מחשב.</li>
        <li>
          הכלי שולח את הכתובת ל-PageSpeed Insights של Google. השרת של Google טוען את הדף מאפס, בלי מטמון, ומודד כל שלב
          בטעינה. זה לוקח בדרך כלל 15 עד 40 שניות.
        </li>
        <li>
          באותה בקשה Google מחזיר גם את נתוני דוח החוויה של Chrome, כלומר איך הדף נטען אצל גולשים אמיתיים, אם יש מספיק
          כאלה.
        </li>
        <li>מקבלים ציון, מדדים בצבעים וחמש המלצות מסודרות לפי כמה זמן כל תיקון יכול לחסוך.</li>
      </ol>
      <p>
        הבדיקה מודדת את האתר, לא את החיבור שלכם. היא נותנת את אותה תוצאה בין אם אתם בסיבים או בסלולר, כי הטעינה קורית
        בשרת של Google.
      </p>

      <h2 id="metrics" className={styles.anchor}>
        מה המדדים אומרים ומה נחשב טוב
      </h2>
      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <caption>הספים של Google לכל מדד, לפי האחוזון ה-75 של הגולשים</caption>
          <thead>
            <tr>
              <th scope="col">מדד</th>
              <th scope="col">טוב</th>
              <th scope="col">איטי</th>
              <th scope="col">מה הוא מודד</th>
            </tr>
          </thead>
          <tbody>
            {thresholdRows.map((row) => (
              <tr key={row.metric}>
                <th scope="row" lang="en" dir="ltr">
                  {row.metric}
                </th>
                <td>{row.good}</td>
                <td>{row.poor}</td>
                <td>{row.meaning}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p>
        LCP, INP ו-CLS הם שלושת מדדי Core Web Vitals ש-Google משתמש בהם כדי להעריך חוויית דף. INP נמדד רק כשאדם
        אמיתי לוחץ על משהו, ולכן במדידת המעבדה מופיע במקומו TBT, שמראה כמה JavaScript תוקע את הדף.
      </p>

      <h2 id="causes" className={styles.anchor}>
        מה בדרך כלל מאט אתר
      </h2>
      <ul>
        <li>
          <strong>תמונות כבדות.</strong> תמונה שהועלתה ישר מהמצלמה יכולה לשקול כמה מגה, כשבטלפון מספיקה גרסה של 100 עד
          200 קילובייט ב-WebP.
        </li>
        <li>
          <strong>יותר מדי JavaScript.</strong> צ׳אטים, פיקסלים, סליידרים ותוספים שכל אחד מהם נטען בכל דף, גם כשאין בו
          צורך.
        </li>
        <li>
          <strong>שרת איטי.</strong> אחסון משותף זול בלי מטמון עמודים מוסיף שנייה ויותר עוד לפני שהדפדפן מקבל משהו.
        </li>
        <li>
          <strong>בוני עמודים.</strong> בוני עמודים חזותיים עוטפים כל אלמנט בכמה שכבות, וזה מוסיף קוד ועבודה לדפדפן.
        </li>
        <li>
          <strong>וידאו ואנימציות במסך הראשון.</strong> וידאו רקע שנטען מיד מתחרה על רוחב הפס עם התוכן שהגולש בא לראות.
        </li>
      </ul>

      <h2 id="read" className={styles.anchor}>
        איך לקרוא את התוצאה נכון
      </h2>
      <ul>
        <li>
          אם יש נתוני גולשים אמיתיים, הם קובעים. ציון מעבדה של 60 עם נתוני שטח ירוקים עדיף על ציון 90 עם נתוני שטח
          אדומים.
        </li>
        <li>בודקים כמה דפים, לא רק את דף הבית. דף מוצר או דף נחיתה עם הרבה תמונות יכול להיות איטי בהרבה.</li>
        <li>הציון משתנה בכמה נקודות בין בדיקות. כדי להשוות לפני ואחרי תיקון, מריצים שתיים או שלוש בדיקות.</li>
        <li>
          מתחילים מההמלצה הראשונה ברשימה. היא מסודרת לפי החיסכון המשוער, ובדרך כלל שתיים או שלוש ההמלצות הראשונות הן
          רוב הרווח.
        </li>
      </ul>
      <p>
        רוצים לבדוק גם אם בוטים של חיפוש ובינה מלאכותית יכולים לקרוא את האתר? יש לנו{' '}
        <Link href="/tools/ai-readiness-checker">בדיקת גישה של בוטי AI</Link>.
      </p>

      <h2>מקורות</h2>
      <ul>
        {sources.map((source) => (
          <li key={source.href}>
            <a href={source.href} rel="noopener" target="_blank" lang="en" dir="ltr">
              {source.label}
            </a>
            : {source.note}
          </li>
        ))}
      </ul>
      <p className={styles.reviewed}>
        הספים, טווחי הציון והציטוטים מ-Google נבדקו ב-28 באוקטובר 2026 מול מסמכי Google for Developers ו-Google Search
        Central. המדידה עצמה מגיעה מ-PageSpeed Insights API.
      </p>
    </ToolLayout>
  )
}
