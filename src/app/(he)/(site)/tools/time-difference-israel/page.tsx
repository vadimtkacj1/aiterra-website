import Link from 'next/link'
import ToolLayout, { toolMetadata, type ToolFaqEntry } from '../../components/tools/ToolLayout'
import TimeDifference from '../../components/tools/TimeDifference'
import {
  TIME_DIFFERENCE_CHECKED,
  TIME_DIFFERENCE_PATH,
  cityDifferences,
  formatDifference,
  gapRuns,
  gapZones,
  timeDifferenceSources,
} from '@/lib/time-difference'
import { timeInPages, timeInPath } from '@/lib/time-in-cities'
import styles from '../../components/tools/TimeDifference.module.css'

const TITLE = 'מה השעה בישראל עכשיו, והפרש השעות לכל העולם'
const META_TITLE = 'מה השעה בישראל עכשיו? שעון חי + הפרש מ-62 ערים'
const DESCRIPTION =
  'מה השעה בישראל עכשיו: שעון חי לפי שעון ישראל (UTC+2 בחורף, UTC+3 בקיץ), והפרש השעות מול 62 ערים בעולם, בקיץ ובחורף, עם תכנון פגישה.'

const cityRows = cityDifferences()

const shortDate = (date: Date) =>
  date.toLocaleDateString('he-IL', { timeZone: 'UTC', day: 'numeric', month: 'long', year: 'numeric' })

const shiftRows = gapZones.flatMap((item) =>
  gapRuns(item.zone, 2026, 2027)
    .filter((run) => run.days <= 30)
    .map((run) => ({
      key: `${item.zone}-${run.from.getTime()}`,
      label: item.label,
      range: run.days === 1 ? shortDate(run.from) : `${shortDate(run.from)} עד ${shortDate(run.to)}`,
      days: run.days,
      minutes: run.minutes,
    })),
)

const faq: ToolFaqEntry[] = [
  {
    id: 'time-difference-faq-usa',
    question: 'מה הפרש השעות בין ישראל לניו יורק?',
    answer:
      'רוב השנה ניו יורק מאחרת ב-7 שעות: כשבישראל 15:00, בניו יורק 08:00. כמה שבועות בשנה ההפרש קטן ל-6 שעות, כי ארצות הברית עוברת לשעון קיץ בחודש מרץ, שבועות לפני ישראל, וחוזרת לשעון חורף בנובמבר, שבוע אחרי ישראל. בלוס אנג׳לס ההפרש גדול ב-3 שעות, ובשיקגו ב-1.',
  },
  {
    id: 'time-difference-faq-europe',
    question: 'מה ההפרש בין ישראל לאירופה?',
    answer:
      'בלונדון ישראל מקדימה ב-2 שעות, ובפריז, ברלין, רומא ומדריד ב-1. ההפרש כמעט לא משתנה לאורך השנה, כי גם אירופה עוברת לשעון קיץ ולשעון חורף, ובישראל השינוי נעשה באותו סוף שבוע באוקטובר. יוצא מן הכלל הוא סוף השבוע של מרץ, שבו ישראל עוברת יומיים לפני אירופה וההפרש גדל בשעה לשני לילות בלבד.',
  },
  {
    id: 'time-difference-faq-summer',
    question: 'מתי שעון הקיץ בישראל מתחיל ומסתיים?',
    answer:
      'לפי החוק, שעון הקיץ מתחיל ביום שישי האחרון של מרץ ומסתיים ביום ראשון האחרון של אוקטובר. ב-2026 הוא התחיל ב-27 במרץ ויסתיים ב-25 באוקטובר, וב-2027 יתחיל ב-26 במרץ ויסתיים ב-31 באוקטובר. אז השעון זז שעה קדימה בלילה לקראת שישי, ושעה אחורה בלילה שבין שבת לראשון.',
  },
  {
    id: 'time-difference-faq-asia',
    question: 'למה ההפרש מול תאילנד או יפן משתנה?',
    answer:
      'כי תאילנד, יפן, סין והודו לא מזיזות את השעון, ואילו ישראל כן. בחורף בנגקוק מקדימה ב-5 שעות וטוקיו ב-7, ובקיץ, כשישראל מקדימה את השעון, ההפרש קטן בשעה: 4 ו-6. בהודו ההפרש הוא 3:30 בחורף ו-2:30 בקיץ. אותו דבר קורה מול דובאי, שמקדימה ב-2 שעות בחורף ובשעה אחת בקיץ.',
  },
  {
    id: 'time-difference-faq-australia',
    question: 'איך עובד ההפרש מול אוסטרליה וניו זילנד?',
    answer:
      'הם בחצי הכדור הדרומי, ולכן שעון הקיץ שלהם פועל בנובמבר עד מרץ, ההפך מישראל. בסידני ההפרש גדול בחורף שלנו (9 שעות) וקטן בקיץ שלנו (7 שעות). בפרת׳ אין שעון קיץ, וההפרש הוא 6 שעות בחורף ו-5 בקיץ. לכן לפגישה עם סידני כדאי לבדוק את ההפרש של התאריך ולא להסתמך על הפרש שזכרתם.',
  },
  {
    id: 'time-difference-faq-meeting',
    question: 'איך מוצאים שעה לפגישה עם יעד רחוק?',
    answer:
      'בוחרים את היעד, מגדירים שעות עבודה לכל צד, והציר מראה את החפיפה בשעון ישראל. מול ניו יורק בשעות 9 עד 18 בשני הצדדים החפיפה היא שעתיים, מ-16:00 עד 18:00 בישראל. מול סידני או טוקיו אין כמעט חפיפה, ולכן מקובל להקדים את הפגישה בבוקר בישראל או להאריך אותה בערב. הכלי מחשב לפי ההפרש של עכשיו.',
  },
]

const externalLink = (href: string, label: string) => (
  <a href={href} rel="noopener" target="_blank">
    {label}
  </a>
)

export const revalidate = 60

export const metadata = toolMetadata({ path: TIME_DIFFERENCE_PATH, metaTitle: META_TITLE, description: DESCRIPTION })

export default function TimeDifferencePage() {
  return (
    <ToolLayout
      path={TIME_DIFFERENCE_PATH}
      title={TITLE}
      metaTitle={META_TITLE}
      description={DESCRIPTION}
      lede="השעון שלמטה מראה מה השעה בישראל עכשיו. בחורף שעון ישראל הוא UTC+2 ובקיץ UTC+3. ההפרש בין ישראל לניו יורק הוא 7 שעות רוב השנה, ובין ישראל ללונדון 2 שעות, אבל הוא משתנה כשאחד הצדדים עובר לשעון קיץ. בחרו עיר וראו שעון חי של הצד השני, ההפרש היום וההפרש בעוד חצי שנה, ומצאו שעה שנוחה לשני הצדדים."
      chips={['62 ערים', 'מתעדכן לבד לפי שעון קיץ', `נבדק ב-${TIME_DIFFERENCE_CHECKED}`]}
      tool={<TimeDifference renderedAt={Date.now()} />}
      faq={faq}
      cta={{
        text: 'צריכים כלי חישוב או מערכת פנימית בהתאמה אישית לעסק?',
        label: 'פיתוח תוכנה לעסקים',
        href: '/services/development',
      }}
    >
      <h2>איך המחשבון מחשב את ההפרש</h2>
      <p>
        הכלי משתמש באזורי הזמן של מסד הנתונים הבינלאומי IANA, שהדפדפן שלכם כבר מכיר, ולכן ההפרש נכון לתאריך שבו
        אתם פותחים אותו וכולל כללי שעון קיץ של כל מדינה. לא נשלח שום מידע לשרת, והשעה נלקחת משעון המכשיר. אם שעון
        המכשיר לא מדויק, גם התוצאה לא תהיה.
      </p>

      <h2>שעון קיץ בישראל</h2>
      <p>
        שעון הקיץ בישראל מתחיל ביום שישי האחרון של מרץ ומסתיים ביום ראשון האחרון של אוקטובר. ב-2026 הוא התחיל ב-27
        במרץ ומסתיים ב-25 באוקטובר, וב-2027 הוא יתחיל ב-26 במרץ ויסתיים ב-31 באוקטובר. בקיץ ישראל היא UTC+3,
        ובחורף UTC+2. מי שמתכנן לפי הפרש קבוע עלול לטעות בשבועות שבהם המדינות לא עוברות באותו יום.
      </p>

      <h2 id="shifts" className={styles.anchor}>
        שבועות שבהם ההפרש משתנה
      </h2>
      <p>
        ההפרש מול ארצות הברית ואירופה אינו קבוע כי מועדי המעבר שונים. הטבלה מציגה את התקופות הקצרות ב-2026 ו-2027
        שבהן ההפרש שונה מהרגיל, כפי שהן מחושבות מאזורי הזמן.
      </p>
      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <caption>תקופות חריגות בהפרש מול ישראל, 2026 ו-2027</caption>
          <thead>
            <tr>
              <th scope="col">יעד</th>
              <th scope="col">תקופה</th>
              <th scope="col">ימים</th>
              <th scope="col">ההפרש</th>
            </tr>
          </thead>
          <tbody>
            {shiftRows.map((row) => (
              <tr key={row.key}>
                <th scope="row">{row.label}</th>
                <td>{row.range}</td>
                <td>{row.days}</td>
                <td className={styles.value} dir="ltr">
                  {formatDifference(row.minutes)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2 id="table" className={styles.anchor}>
        טבלת הפרשי שעות מישראל ל-62 ערים
      </h2>
      <p>
        המספר חיובי כשהיעד מקדים את ישראל, ושלילי כשהוא מאחר אחריה. העמודות מראות את ההפרש בחורף (ינואר) ובקיץ
        (יולי) לפי כללי שעון הקיץ הנוכחיים של כל מדינה, והשעה הנוכחית בכל עיר מופיעה במחשבון למעלה.
      </p>
      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <caption>הפרש שעות מישראל, חורף וקיץ 2027</caption>
          <thead>
            <tr>
              <th scope="col">עיר</th>
              <th scope="col">מדינה</th>
              <th scope="col">בחורף</th>
              <th scope="col">בקיץ</th>
            </tr>
          </thead>
          <tbody>
            {cityRows.map((row) => (
              <tr key={row.city.id}>
                <th scope="row">{row.city.name}</th>
                <td>{row.city.country}</td>
                <td className={styles.value} dir="ltr">
                  {formatDifference(row.winter)}
                </td>
                <td className={styles.value} dir="ltr">
                  {formatDifference(row.summer)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className={styles.caveat}>
        כללי שעון הקיץ משתנים בחוק של כל מדינה. מרוקו, למשל, מחזירה את השעון לשעה אחת אחורה בחודש הצום, ואיראן
        ומצרים שינו את הכללים בשנים האחרונות. לפגישה חשובה בודקים את התאריך המדויק במחשבון.
      </p>

      <h2>תכנון פגישה בין אזורי זמן</h2>
      <p>
        בוחרים שעות עבודה לישראל וליעד, והציר הכחול מראה אילו שעות ביממה בשעון ישראל מתאימות לשני הצדדים. מול אירופה
        כמעט כל יום העבודה חופף, מול ארצות הברית נשארות 2 עד 4 שעות בצהריים ובאחר הצהריים, ומול מזרח אסיה ואוסטרליה
        החפיפה קטנה, ולכן מקדימים בישראל לבוקר. בהזמנה לפגישה כדאי לכתוב את השעה בשני
        הצדדים.
      </p>
      <p>
        לטיסות לאותם יעדים יש <Link href="/tools/flight-time-from-israel">טבלת זמני טיסה מישראל</Link>, שמציגה גם
        את הפרש השעות לכל יעד.
      </p>

      <h2>מה השעה עכשיו ביעדים מבוקשים</h2>
      <ul>
        {timeInPages.map((page) => (
          <li key={page.slug}>
            <Link href={timeInPath(page.slug)}>מה השעה {page.inPlace}</Link>
          </li>
        ))}
      </ul>

      <h2>מקורות</h2>
      <ul>
        <li>{externalLink(timeDifferenceSources.kan.href, timeDifferenceSources.kan.label)}: מועדי שעון הקיץ ב-2026</li>
        <li>
          {externalLink(timeDifferenceSources.protocol.href, timeDifferenceSources.protocol.label)}: כלל ״יום שישי
          האחרון של מרץ ויום ראשון האחרון של אוקטובר״
        </li>
        <li>{externalLink(timeDifferenceSources.iana.href, timeDifferenceSources.iana.label)}: אזורי הזמן והכללים</li>
        <li>{externalLink(timeDifferenceSources.mdn.href, timeDifferenceSources.mdn.label)}: ממשק הדפדפן לחישוב</li>
      </ul>
      <p className={styles.reviewed}>
        המקורות נבדקו ב-{TIME_DIFFERENCE_CHECKED}. נוסח החוק (חוק קביעת הזמן) מומלץ לאמת באתר הממשלה gov.il לפני
        שמסתמכים עליו משפטית.
      </p>
    </ToolLayout>
  )
}
