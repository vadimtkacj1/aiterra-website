import Link from 'next/link'
import ToolLayout, { toolMetadata, type ToolFaqEntry } from '../../components/tools/ToolLayout'
import FlightTimes from '../../components/tools/FlightTimes'
import {
  CRUISE_KMH,
  FIXED_MINUTES,
  FLIGHT_TIMES_CHECKED,
  FLIGHT_TIMES_PATH,
  clockDuration,
  destinationById,
  destinations,
  durationText,
  flightSources,
} from '@/lib/flight-times'
import { TIME_DIFFERENCE_PATH } from '@/lib/time-difference'
import styles from '../../components/tools/FlightTimes.module.css'

const TITLE = 'כמה זמן טיסה מישראל? טבלת זמני טיסה'
const META_TITLE = 'כמה זמן טיסה מישראל? טבלת זמני טיסה ליעדים'
const DESCRIPTION =
  'כמה זמן טיסה מישראל ליותר מ-70 יעדים: משך טיסה ישירה, אילו יעדים בלי טיסה ישירה, הפרש שעות ומרחק, וחישוב משוער של זמן טיסה לפי מרחק.'

const direct = destinations.filter((item) => item.directMinutes).length

const minutesOf = (id: string) => {
  const found = destinationById(id)?.directMinutes
  if (!found) throw new Error(`Missing direct time for ${id}`)
  return found
}

const hoursOf = (id: string) => clockDuration(minutesOf(id))

const popular = [
  { id: 'bangkok', lead: 'לתאילנד (בנגקוק)' },
  { id: 'phuket', lead: 'לפוקט' },
  { id: 'tokyo', lead: 'ליפן (טוקיו)' },
  { id: 'dubai', lead: 'לדובאי' },
  { id: 'rhodes', lead: 'לרודוס' },
  { id: 'budapest', lead: 'לבודפשט' },
  { id: 'batumi', lead: 'לבטומי' },
  { id: 'podgorica', lead: 'למונטנגרו (פודגוריצה)' },
]

const faq: ToolFaqEntry[] = [
  {
    id: 'flight-faq-thailand',
    question: 'כמה זמן טיסה לתאילנד?',
    answer: `טיסה ישירה מישראל לבנגקוק נמשכת כ-${hoursOf('bangkok')} שעות, ולפוקט כ-${hoursOf('phuket')} שעות. טיסה עם עצירה, למשל דרך המפרץ או אירופה, נמשכת בדרך כלל 13 עד 18 שעות כולל ההמתנה. הזמן ארוך יותר כשהמסלול עוקף מרחב אווירי סגור. בנגקוק מקדימה את ישראל ב-5 שעות בחורף ובארבע בקיץ, כך שמגיעים אליה בבוקר המחרת.`,
  },
  {
    id: 'flight-faq-dubai',
    question: 'כמה זמן טיסה לדובאי?',
    answer: `טיסה ישירה מישראל לדובאי נמשכת כ-${hoursOf('dubai')} שעות, ולאבו דאבי בערך אותו דבר. זו אחת הטיסות הקצרות ליעד שאינו באירופה. דובאי מקדימה את ישראל בשעתיים בחורף ובשעה אחת בקיץ, ולכן ההגעה נראית על השעון כמעט כמו טיסה של שעה וחצי. ההפרש משתנה בגלל שהאמירויות לא מזיזות את השעון.`,
  },
  {
    id: 'flight-faq-greece',
    question: 'כמה זמן טיסה ליוון וקפריסין?',
    answer: `לקפריסין טסים כשעה (לרנקה ופאפוס כ-${hoursOf('larnaca')} שעות), לרודוס כ-${hoursOf('rhodes')}, לאתונה כ-${hoursOf('athens')} ולסלוניקי כ-${hoursOf('thessaloniki')} שעות. אלה הטיסות הקצרות ביותר מישראל, ולכן הן פופולריות לסוף שבוע. ביוון ובקפריסין השעה זהה לשעה בישראל כל השנה, כי הן עוברות לשעון קיץ ולשעון חורף באותם מועדים, בהפרש של יומיים בלבד באביב.`,
  },
  {
    id: 'flight-faq-usa',
    question: 'כמה זמן טיסה לניו יורק ולארצות הברית?',
    answer: `לניו יורק כ-${hoursOf('new-york')} שעות, לבוסטון כ-${hoursOf('boston')}, למיאמי כ-${hoursOf('miami')} ולוס אנג׳לס כ-${hoursOf('los-angeles')} שעות. בחזרה הטיסה בדרך כלל קצרה בשעה עד שעה וחצי, כי רוחות גבוהות מערביות דוחפות את המטוס מזרחה. הזמנים בטבלה הם מישראל ליעד, ולכן כדאי לחשב את כיוון החזרה בנפרד.`,
  },
  {
    id: 'flight-faq-vary',
    question: 'למה משך הטיסה משתנה ולא תמיד זהה לטבלה?',
    answer:
      'כמה גורמים משפיעים: מסלול שעוקף מרחב אווירי סגור, רוחות גבוהות שמשתנות לפי עונה וכיוון, סוג המטוס ופקקים בנחיתה. הפרש של 15 עד 30 דקות בין טיסה לטיסה הוא רגיל, ובמסלולים שעוקפים טורקיה, כמו לגאורגיה, ההפרש גדול יותר. הטבלה מציגה ערך טיפוסי ומעוגל, ולכן הזמן שמופיע בכרטיס הטיסה הוא הקובע.',
  },
  {
    id: 'flight-faq-calc',
    question: 'איך מחשבים זמן טיסה לפי מרחק?',
    answer: `מחשבים את המרחק בקו ישר על פני כדור הארץ בנוסחת הברסין, ואז מחלקים במהירות ממוצעת של ${CRUISE_KMH} קמ״ש ומוסיפים ${FIXED_MINUTES} דקות להמראה ולנחיתה. למשל, מרחק של 1,000 ק״מ הוא כשעה ו-${Math.round(FIXED_MINUTES + (1000 / CRUISE_KMH) * 60) - 60} דקות. המחשבון למעלה מבצע את זה לכל יעד, גם כזה שאינו ברשימה, ומאפשר להוסיף 10% או 20% לעיקוף.`,
  },
]

const externalLink = (href: string, label: string) => (
  <a href={href} rel="noopener" target="_blank">
    {label}
  </a>
)

export const metadata = toolMetadata({ path: FLIGHT_TIMES_PATH, metaTitle: META_TITLE, description: DESCRIPTION })

export default function FlightTimePage() {
  return (
    <ToolLayout
      path={FLIGHT_TIMES_PATH}
      title={TITLE}
      metaTitle={META_TITLE}
      description={DESCRIPTION}
      lede={`טיסה ישירה מישראל לקפריסין נמשכת כשעה, ליוון ולרוב יעדי אירופה בין שעתיים לשש שעות, לדובאי כ-${hoursOf('dubai')} שעות, לניו יורק כ-${hoursOf('new-york')} ולבנגקוק כ-${hoursOf('bangkok')}. בטבלה ${destinations.length} יעדים עם משך טיסה ישירה או עם עצירה, הפרש שעות ומרחק, וחיפוש לפי שם.`}
      chips={[`${destinations.length} יעדים`, 'משך משוער', `נבדק ב-${FLIGHT_TIMES_CHECKED}`]}
      tool={<FlightTimes />}
      faq={faq}
      cta={{
        text: 'צריכים כלי חישוב או מערכת הזמנות בהתאמה אישית לעסק?',
        label: 'פיתוח תוכנה לעסקים',
        href: '/services/development',
      }}
    >
      <h2>איך לקרוא את הטבלה</h2>
      <p>
        העמודה ״טיסה ישירה״ מראה את הזמן הטיפוסי מנתב״ג ליעד, מעוגל ל-5 דקות, ביעדים שיש אליהם טיסה ישירה בלוחות
        הזמנים. ביעדים בלי טיסה ישירה כתוב ״אין טיסה ישירה״, ובעמודה ״עם עצירה״ מופיע זמן כולל טיפוסי עם
        עצירה אחת, כולל ההמתנה בשדה. מתוך {destinations.length} היעדים, ל-{direct} יש כרגע טיסה ישירה. הזמנים
        הם מישראל ליעד: בחזרה הם לרוב קצרים יותר, במיוחד ממערב.
      </p>

      <h2>זמני טיסה ליעדים הפופולריים</h2>
      <ul>
        {popular.map((item) => (
          <li key={item.id}>
            <a href={`#${item.id}`}>{item.lead}</a>: טיסה ישירה כ-{durationText(minutesOf(item.id))}.
          </li>
        ))}
      </ul>

      <h2>למה משך הטיסה משתנה</h2>
      <p>
        הזמן שבכרטיס הטיסה תלוי במסלול ולא רק במרחק. מרחבים אוויריים סגורים מאריכים את הטיסה, כמו המסלול לגאורגיה
        שעוקף את טורקיה ולכן ארוך מהמרחק בקו ישר. רוחות גבוהות מקצרות טיסות מזרחה ומאריכות טיסות מערבה, וההבדל בין
        כיווני טיסה יכול להגיע לשעה. לכן הטבלה מציגה ערך טיפוסי ומסומנת כמשוערת.
      </p>

      <h2>חישוב זמן טיסה לפי מרחק</h2>
      <p>
        המחשבון מחשב את המרחק בין נתב״ג ליעד בנוסחת הברסין, ומעריך את הזמן כך:{' '}
        <strong>זמן = {FIXED_MINUTES} דקות + (מרחק × מקדם מסלול ÷ {CRUISE_KMH} קמ״ש)</strong>. הקבועים כויילו
        על היעדים בטבלה: ברוב הטיסות הישירות ההערכה קרובה לזמן בטבלה בטווח של כ-15%. בטיסות עם עיקוף, כמו לגאורגיה,
        בוחרים מקדם מסלול של 1.2.
      </p>

      <h2>הפרש שעות ביעד</h2>
      <p>
        העמודה האחרונה מציגה את הפרש השעות לפי החורף והקיץ. מי ששקל לטוס צריך לדעת מה השעה ביעד בהגעה, ובכלי{' '}
        <Link href={TIME_DIFFERENCE_PATH}>הפרש שעות מישראל</Link> אפשר לראות שעון חי של כל עיר ולתכנן שיחות.
      </p>
      <p className={styles.caveat}>
        משכי הטיסה משוערים וגם היעדים עם טיסה ישירה משתנים לפי עונה, חברת תעופה ומצב ביטחוני. לפני הזמנה בודקים את
        לוח הטיסות של החברה.
      </p>

      <h2>מקורות</h2>
      <ul>
        <li>{externalLink(flightSources.elal.href, flightSources.elal.label)}</li>
        <li>{externalLink(flightSources.israir.href, flightSources.israir.label)}</li>
        <li>{externalLink(flightSources.arkia.href, flightSources.arkia.label)}</li>
        <li>{externalLink(flightSources.wizz.href, flightSources.wizz.label)}</li>
        <li>{externalLink(flightSources.iaa.href, flightSources.iaa.label)}</li>
        <li>{externalLink(flightSources.haversine.href, flightSources.haversine.label)}: נוסחת המרחק</li>
      </ul>
      <p className={styles.reviewed}>
        הזמנים הם ערכים טיפוסיים מעוגלים, שנאספו לפי לוחות הזמנים של החברות ושל נתב״ג עד {FLIGHT_TIMES_CHECKED.split('-').reverse().join('.')} ואינם
        משקפים לוח של טיסה מסוימת. הטבלה אינה מהווה הצעה למכירת כרטיסים.
      </p>
    </ToolLayout>
  )
}
