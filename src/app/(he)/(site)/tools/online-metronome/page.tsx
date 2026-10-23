import ToolLayout, { toolMetadata, type ToolFaqEntry } from '../../components/tools/ToolLayout'
import Metronome from '../../components/tools/Metronome'
import { MAX_BPM, tempoBands } from '@/lib/metronome'
import styles from '../../components/tools/FunTable.module.css'

const PATH = '/tools/online-metronome'
const TITLE = 'מטרונום אונליין'
const META_TITLE = 'מטרונום אונליין: קצב 30 עד 300 BPM, משקלים והקשת קצב'
const DESCRIPTION =
  'מטרונום אונליין חינמי: קצב מ-30 עד 300 פעימות בדקה, הקשת קצב, משקלים מ-2/4 עד 7/8, הדגשת פעמה ראשונה ופעמה חזותית. עובד בדפדפן, בלי הורדה.'

const TEMPO_URL = 'https://en.wikipedia.org/wiki/Tempo'
const METRONOME_URL = 'https://en.wikipedia.org/wiki/Metronome'
const SCHEDULING_URL = 'https://web.dev/articles/audio-scheduling'
const REVIEWED = '23.10.2026'

const bands = tempoBands.map((band, index) => ({
  ...band,
  to: index < tempoBands.length - 1 ? tempoBands[index + 1].from - 1 : MAX_BPM,
}))

const faq: ToolFaqEntry[] = [
  {
    id: 'metronome-faq-use',
    question: 'איך משתמשים במטרונום אונליין?',
    answer:
      'בוחרים קצב בפעימות בדקה, בעזרת המחוון, כפתורי הפלוס והמינוס או הקלדה, ולוחצים על התחלה. הצליל מתחיל רק אחרי לחיצה, כי דפדפנים לא מנגנים בלי פעולה של המשתמש. אפשר לשנות קצב, משקל ועוצמה גם בזמן שהמטרונום פועל, ולעצור בלחיצה נוספת או ברווח כשהמסך בפוקוס.',
  },
  {
    id: 'metronome-faq-tempo',
    question: 'באיזה קצב כדאי להתחיל לתרגל?',
    answer:
      'מתחילים בקצב שבו אפשר לנגן את הקטע נקי, בלי טעויות, גם אם הוא איטי בהרבה מהקצב היעד. מעלים בהדרגה, בדרך כלל חמש עד עשר פעימות בדקה בכל פעם, רק אחרי כמה חזרות נקיות. מי שמתרגל קטע קשה יכול לרדת לחצי מקצב היעד. זו המלצה כללית של מורים למוזיקה ולא כלל מדעי.',
  },
  {
    id: 'metronome-faq-tap',
    question: 'איך עובדת הקשת קצב?',
    answer:
      'לוחצים על הכפתור כמה פעמים בקצב השיר, והמטרונום מחשב את הממוצע בין ההקשות ומציג פעימות בדקה. צריך לפחות שתי הקשות, והחישוב משתמש בשמונה האחרונות. אם עוברות יותר משתי שניות בין הקשות, הספירה מתחילה מחדש. ככל שמקישים יותר פעמים, התוצאה יציבה יותר, וקיצור המקלדת הוא המקש T.',
  },
  {
    id: 'metronome-faq-signature',
    question: 'מה ההבדל בין המשקלים 4/4, 3/4 ו-6/8?',
    answer:
      'המשקל קובע כמה פעמות יש בתיבה ואיפה ההדגשות. ב-4/4 יש ארבע פעמות והראשונה מודגשת, ב-3/4 שלוש, כמו בוואלס. ב-6/8 יש שש פעימות בשתי קבוצות של שלוש, ולכן יש הדגשה חזקה בראשונה וקלה יותר ברביעית. ב-5/4 וב-7/8 הפעמות מקובצות בשלוש ושתיים או בשתיים, שתיים ושלוש.',
  },
  {
    id: 'metronome-faq-precision',
    question: 'עד כמה המטרונום מדויק?',
    answer:
      'המטרונום מתזמן את הצלילים לפי שעון השמע של הדפדפן, מראש וקצת לפני הנקישה, ולא לפי טיימר רגיל של JavaScript. לפי מאמר של צוות Chrome ב-web.dev, שעון ה-JavaScript אינו מדויק, ולכן הצלילים נקבעים מראש בשעון השמע. התוצאה יציבה גם כשהדף עסוק, אבל מכשירים ישנים או בלוטות׳ עם השהיה עלולים להשמיע את הצליל באיחור קבוע.',
  },
  {
    id: 'metronome-faq-offline',
    question: 'האם צריך להוריד אפליקציה, והאם זה עובד בטלפון?',
    answer:
      'לא צריך להוריד כלום. המטרונום עובד בדפדפן של הטלפון, הטאבלט והמחשב, והצליל נוצר במכשיר עצמו ולא נשלח משרת. אחרי שהדף נטען, הנגינה לא תלויה באינטרנט. אם אין צליל, בדקו שעוצמת המכשיר גבוהה, ושלחצתם על התחלה אחרי שהדף נטען. בטלפון כדאי להשאיר את המסך דלוק, כי כשהמסך נכבה הדפדפן עשוי להשהות את הצליל.',
  },
]

export const metadata = toolMetadata({ path: PATH, metaTitle: META_TITLE, description: DESCRIPTION })

export default function OnlineMetronomePage() {
  return (
    <ToolLayout
      path={PATH}
      title={TITLE}
      metaTitle={META_TITLE}
      description={DESCRIPTION}
      lede="מטרונום משמיע נקישה בקצב קבוע שנמדד בפעימות בדקה, ומי שמתרגל נגינה, ריקוד או ריצה משתמש בו כדי לשמור על קצב יציב. כאן בוחרים קצב בין 30 ל-300, משקל והדגשה, או מקישים את הקצב של שיר ומקבלים אותו מחושב."
      chips={['30 עד 300 BPM', 'הקשת קצב', 'משקלים 2/4 עד 7/8', 'פעמה חזותית וקיצורי מקלדת']}
      tool={<Metronome />}
      faq={faq}
      cta={{
        text: 'אנחנו מפתחים לעסקים כלי אינטרנט עם שמע, תזמון ואינטראקציה מדויקת שעובדים בכל מכשיר.',
        label: 'פיתוח תוכנה לעסקים',
        href: '/services/development',
      }}
    >
      <h2>איך משתמשים במטרונום</h2>
      <p>
        לפי{' '}
        <a href={METRONOME_URL} rel="noopener" target="_blank">
          הערך על מטרונום בוויקיפדיה
        </a>
        , מטרונום מפיק צליל במרווחים קבועים שהמשתמש קובע, בדרך כלל בפעימות בדקה, ולעיתים גם תנועה חזותית. מטרונום
        מכני רגיל מכוון בין 40 ל-208 פעימות בדקה, והגרסה שכאן רחבה יותר.
      </p>
      <ul>
        <li>
          <strong>בוחרים קצב.</strong> מחוון, כפתורי פלוס ומינוס, הקלדה או קצבים מוכנים כמו בלדה (70) ומצעד (120).
        </li>
        <li>
          <strong>בוחרים משקל.</strong> המשקל קובע כמה פעמות יש בתיבה ואיפה ההדגשה. הנקודות הגדולות במסך הן פעמות
          מודגשות.
        </li>
        <li>
          <strong>מחלקים את הפעמה.</strong> שמיניות, שלישיות או שש עשריות מוסיפות נקישות שקטות בין הפעמות, כדי
          לתרגל חלוקה פנימית.
        </li>
        <li>
          <strong>מקישים קצב.</strong> לא יודעים כמה פעימות בדקה יש בשיר? מקישים עליו ומקבלים מספר.
        </li>
      </ul>

      <h2>איזה קצב מתאים לכל מושג</h2>
      <p>
        המושגים האיטלקיים שמופיעים בתווים מתארים טווחי קצב. הטווחים נבדלים מעט בין מקורות, ולכן הטבלה היא קירוב
        על פי{' '}
        <a href={TEMPO_URL} rel="noopener" target="_blank">
          הערך על טמפו בוויקיפדיה
        </a>
        .
      </p>
      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <caption>מושגי קצב וטווחי פעימות בדקה</caption>
          <thead>
            <tr>
              <th scope="col">מושג</th>
              <th scope="col">פירוש</th>
              <th scope="col">פעימות בדקה</th>
            </tr>
          </thead>
          <tbody>
            {bands.map((band) => (
              <tr key={band.name}>
                <th scope="row">{band.name}</th>
                <td>{band.meaning}</td>
                <td>
                  {band.from}–{band.to}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2>איך לתרגל עם מטרונום</h2>
      <ul>
        <li>
          <strong>מתחילים איטי.</strong> קצב שבו הקטע נקי, ואז מעלים חמש עד עשר פעימות בדקה בכל פעם.
        </li>
        <li>
          <strong>מדגישים את הפעמה הראשונה.</strong> כך קל לשמוע איפה מתחילה כל תיבה ולהישאר בה.
        </li>
        <li>
          <strong>נגינה בין הנקישות.</strong> מי שרוצה לתרגל קצב פנימי יכול להשתמש רק בפעמה ראשונה, או להנמיך את
          העוצמה.
        </li>
        <li>
          <strong>לריצה ולריקוד.</strong> אותו כלי מתאים לתרגול קצב צעדים: הקשת קצב של שיר מראה כמה פעימות בדקה
          הוא, ומשם אפשר להתאים צעדים.
        </li>
      </ul>

      <h2>איך המטרונום הזה מדייק</h2>
      <p>
        טיימר רגיל של JavaScript סוטה כשהדף עסוק, ולכן המטרונום משתמש בשיטה שמתוארת במאמר{' '}
        <a href={SCHEDULING_URL} rel="noopener" target="_blank">
          A tale of two clocks
        </a>{' '}
        ב-web.dev: טיימר קצר בודק כל כמה אלפיות שנייה אילו נקישות קרובות, וקובע אותן מראש בשעון השמע של
        הדפדפן. המחוון והמשקל משתנים בזמן הנגינה בלי להפסיק את הקצב.
      </p>

      <h2>מקורות</h2>
      <ul>
        <li>
          <a href={METRONOME_URL} rel="noopener" target="_blank">
            Wikipedia: Metronome
          </a>
          : הגדרה וטווח מטרונום מכני (נבדק ב-{REVIEWED})
        </li>
        <li>
          <a href={TEMPO_URL} rel="noopener" target="_blank">
            Wikipedia: Tempo
          </a>
          : מושגי קצב וטווחי פעימות בדקה (נבדק ב-{REVIEWED})
        </li>
        <li>
          <a href={SCHEDULING_URL} rel="noopener" target="_blank">
            web.dev: A tale of two clocks
          </a>
          : תזמון שמע מדויק בדפדפן (נבדק ב-{REVIEWED})
        </li>
      </ul>
    </ToolLayout>
  )
}
