import Link from 'next/link'
import ToolLayout, { toolMetadata, type ToolFaqEntry } from '../../components/tools/ToolLayout'
import OvertimePayCalculator from '../../components/tools/OvertimePayCalculator'
import {
  MONTHLY_HOURS,
  WEEKLY_NORM,
  calculateOvertime,
  defaultInput,
  emptyHours,
  hoursText,
  hourlyFromMonthly,
  money,
  type OvertimeInput,
} from '@/lib/overtime-pay'
import styles from './page.module.css'

const PATH = '/tools/overtime-pay-calculator'
const TITLE = 'מחשבון שעות נוספות'
const META_TITLE = 'מחשבון שעות נוספות 2026: 125%, 150% ושכר שעתי לפי 182'
const DESCRIPTION =
  'מחשבון שעות נוספות: כמה מגיע על שעות מעל התקן היומי והשבועי, 125% לשעתיים הראשונות ו-150% אחרי כן, עבודה בשבת ושכר שעתי מחושב משכר חודשי לפי 182 שעות.'

const kolzchut = (title: string) => `https://www.kolzchut.org.il/he/${encodeURIComponent(title.replace(/ /g, '_'))}`

const run = (patch: Partial<OvertimeInput>) => {
  const outcome = calculateOvertime({ ...defaultInput(), ...patch })
  return outcome.kind === 'result' ? outcome : null
}

const exampleWeek = run({
  wageKind: 'monthly',
  wage: '12000',
  week: '5',
  norm: '8.6',
  hours: { ...emptyHours(), sun: '10', mon: '9', tue: '8.6', wed: '11.6', thu: '8.6', fri: '0', sat: '4' },
})
const weeklyOnly = run({
  wageKind: 'hourly',
  wage: '50',
  week: '5',
  norm: '8.6',
  hours: { ...emptyHours(), sun: '8.6', mon: '8.6', tue: '8.6', wed: '8.6', thu: '8.6', fri: '4' },
})

const sources = [
  { href: kolzchut('גמול עבור שעות נוספות (זכות)'), label: 'כל זכות: גמול עבור שעות נוספות' },
  { href: kolzchut('גמול עבור העסקה במנוחה השבועית (זכות)'), label: 'כל זכות: גמול עבור העסקה במנוחה השבועית' },
  { href: kolzchut('יום עבודה ושבוע עבודה (מושג)'), label: 'כל זכות: יום עבודה ושבוע עבודה' },
  {
    href: kolzchut('שווי שכר לשעה לעובד במשכורת חודשית (מושג)'),
    label: 'כל זכות: שווי שכר לשעה לעובד במשכורת חודשית',
  },
  { href: kolzchut('מגבלות על העסקה בשעות נוספות (זכות)'), label: 'כל זכות: מגבלות על העסקה בשעות נוספות' },
  {
    href: kolzchut('צו הרחבה בדבר קיצור שבוע העבודה במשק ל-42 שעות שבועיות (חוק)'),
    label: 'כל זכות: צו ההרחבה לקיצור שבוע העבודה במשק ל-42 שעות שבועיות',
  },
  {
    href: 'https://he.wikisource.org/wiki/%D7%97%D7%95%D7%A7_%D7%A9%D7%A2%D7%95%D7%AA_%D7%A2%D7%91%D7%95%D7%93%D7%94_%D7%95%D7%9E%D7%A0%D7%95%D7%97%D7%94',
    label: 'חוק שעות עבודה ומנוחה, התשי״א-1951: סעיפים 2, 7, 16, 17 ו-18 (ויקיטקסט)',
  },
]

const faq: ToolFaqEntry[] = [
  {
    id: 'ot-faq-rates',
    question: 'כמה משלמים על שעות נוספות?',
    answer:
      'לפי סעיף 16 לחוק שעות עבודה ומנוחה, על כל אחת מהשעתיים הנוספות הראשונות ביום משלמים לפחות 125% משכר השעה הרגיל, ועל כל שעה נוספת אחריהן לפחות 150%. אותם שיעורים חלים גם על שעות מעל התקן השבועי.',
  },
  {
    id: 'ot-faq-divisor',
    question: 'איך מחשבים שכר שעתי מהשכר החודשי?',
    answer: `מחלקים את השכר החודשי ב-${MONTHLY_HOURS}. מאפריל 2018 משרה מלאה היא ${WEEKLY_NORM} שעות בשבוע, שהן ${MONTHLY_HOURS} שעות בחודש, לפי כל זכות. שכר של 12,000 ש״ח הוא ${money(hourlyFromMonthly(12000))} לשעה. כל התוספות הקבועות לשכר נכללות בחישוב, לפי סעיף 18 לחוק.`,
  },
  {
    id: 'ot-faq-shabbat',
    question: 'כמה מקבלים על עבודה בשבת?',
    answer:
      'עבודה בשבת, ובכלל זה במנוחה השבועית של עובד יהודי, מזכה בתשלום של לפחות 150% מהשכר הרגיל לשעה לפי סעיף 17 לחוק. במקום זה המעסיק יכול לתת שעות מנוחה לפי היתר. המחשבון מחשב שעות מנוחה שבועית ב-150% ללא תוספת אחרת, ולכן שעות רבות בשבת, במיוחד מעל התקן היומי, שווה לבדוק בנפרד.',
  },
  {
    id: 'ot-faq-daily-weekly',
    question: 'האם שעות נוספות נספרות ליום או לשבוע?',
    answer:
      'לפי כל זכות, מונים קודם בסיס יומי ואחר כך שבועי, ולא לפי חודש. שעות מעל התקן היומי נחשבות שעות נוספות גם אם לא הגעתם ל-42 שעות בשבוע. אחרי שספרתם את שעות היום, שעות שנותרו מעל 42 בשבוע הן שעות נוספות שבועיות. עובד במשרה חלקית יכול לקבל גמול גם אם עבד פחות מ-182 שעות בחודש.',
  },
  {
    id: 'ot-faq-five-days',
    question: 'מה התקן היומי בשבוע של חמישה ימים?',
    answer:
      'במגזר הפרטי, לפי כל זכות, 8.6 שעות (8 שעות ו-36 דקות) בארבעה ימים ו-7.6 שעות ביום אחד קצר. מעבר לתקן היומי מתחילות שעות נוספות. בשבוע של שישה ימים התקן הרגיל הוא 8 שעות. ענפים כמו מלונאות ובניין, וכן הסכמים קיבוציים, קובעים תקן אחר.',
  },
  {
    id: 'ot-faq-limit',
    question: 'האם יש הגבלה על מספר השעות הנוספות?',
    answer:
      'כן. לפי כל זכות יש מגבלות על העסקה בשעות נוספות, ובכללן תקרה לשעות הנוספות בשבוע ותקרה לשעות העבודה ביום. עבודה מעבר לתקרה דורשת היתר. על הסכום המדויק ולכל ענף בדקו את העמוד של כל זכות בנושא.',
  },
]

export const metadata = toolMetadata({ path: PATH, metaTitle: META_TITLE, description: DESCRIPTION })

export default function OvertimePayPage() {
  return (
    <ToolLayout
      path={PATH}
      title={TITLE}
      metaTitle={META_TITLE}
      description={DESCRIPTION}
      lede={`על כל אחת משתי השעות הנוספות הראשונות ביום מגיע לפחות 125% משכר השעה, ועל כל שעה אחריהן 150%. עבודה במנוחה השבועית בשבת מזכה ב-150%. שכר שעה לעובד חודשי הוא השכר חלקי ${MONTHLY_HOURS}. המחשבון סופר שעות יומיות ושבועיות ומסכם את התשלום.`}
      chips={['125% ו-150%', `שכר שעתי לפי ${MONTHLY_HOURS}`, 'שבת ומנוחה שבועית']}
      tool={<OvertimePayCalculator />}
      faq={faq}
      cta={{
        text: 'דוחות נוכחות, חישוב שכר ושעות נוספות אפשר להפיק אוטומטית מנתוני הנוכחות של העסק, בלי טבלאות ידניות בסוף החודש.',
        label: 'פיתוח מערכות לעסקים',
        href: '/services/development',
      }}
    >
      <h2>איך מחשבים שעות נוספות</h2>
      <p>
        חוק שעות עבודה ומנוחה, התשי״א-1951, קובע שעות נוספות כשעות מעל התקן היומי או מעל התקן השבועי, ומחייב תוספת
        על השכר הרגיל. בשלושה שלבים:
      </p>
      <ol>
        <li>
          <strong>שכר השעה הרגיל.</strong> בשכר חודשי: שכר חודשי ברוטו ÷ {MONTHLY_HOURS}. בשכר שעתי: התעריף עצמו.
          השכר הרגיל כולל, לפי סעיף 18, את כל התוספות שהמעסיק משלם.
        </li>
        <li>
          <strong>מספר השעות הנוספות.</strong> קודם סופרים בכל יום כמה שעות עברו את התקן היומי. אחר כך בודקים אם
          סך שעות התקן במהלך השבוע עבר {WEEKLY_NORM}. מה שמעל נוסף כשעות נוספות שבועיות.
        </li>
        <li>
          <strong>השיעור.</strong> השעתיים הראשונות ב-125%, כל שעה נוספת אחריהן ב-150%.
        </li>
      </ol>
      <div className={styles.tableWrap} role="region" aria-label="שיעורי גמול על שעות נוספות ועל מנוחה שבועית" tabIndex={0}>
        <table className={styles.table}>
          <caption>שיעורי התשלום מהשכר הרגיל לשעה</caption>
          <thead>
            <tr>
              <th scope="col">מקרה</th>
              <th scope="col">שיעור</th>
              <th scope="col">לפי</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row">שעה נוספת 1 ו-2 ביום</th>
              <td className={styles.best}>125%</td>
              <td>סעיף 16</td>
            </tr>
            <tr>
              <th scope="row">שעה נוספת 3 ואילך ביום</th>
              <td className={styles.best}>150%</td>
              <td>סעיף 16</td>
            </tr>
            <tr>
              <th scope="row">עבודה במנוחה השבועית (שבת)</th>
              <td className={styles.best}>150%</td>
              <td>סעיף 17</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p dir="ltr">שכר שעה = שכר חודשי ÷ {MONTHLY_HOURS} &nbsp;|&nbsp; תשלום = שעות × שכר שעה × שיעור</p>

      <h2>למה {MONTHLY_HOURS} שעות</h2>
      <p>
        מאפריל 2018 קוצר שבוע העבודה במשק ל-{WEEKLY_NORM} שעות, לפי צו הרחבה. {WEEKLY_NORM} שעות בשבוע הן{' '}
        {MONTHLY_HOURS} שעות בחודש בממוצע, ולכן שכר השעה של עובד בשכר חודשי במשרה מלאה הוא השכר חלקי{' '}
        {MONTHLY_HOURS}. עד אז המחלק היה 186. בשבוע של 5 ימים התקן היומי במגזר הפרטי הוא 8.6 שעות בארבעה ימים ו-7.6
        ביום אחד.
      </p>

      <h3>שתי דוגמאות</h3>
      {exampleWeek ? (
        <p>
          עובד בשכר חודשי של 12,000 ש״ח, בשבוע של 5 ימים: שכר שעה {money(exampleWeek.hourlyWage)}. בשבוע אחד הוא עבד
          ראשון 10 שעות, שני 9, שלישי 8.6, רביעי 11.6, חמישי 8.6 ובשבת 4. מעל התקן היומי של 8.6 יש לו{' '}
          {hoursText(exampleWeek.hours125)} שעות ב-125% ו-{hoursText(exampleWeek.hours150)} שעות ב-150%, ועוד{' '}
          {hoursText(exampleWeek.restHours)} שעות בשבת ב-150%. התשלום הנוסף: {money(exampleWeek.pay125)} +{' '}
          {money(exampleWeek.pay150)} + {money(exampleWeek.payRest)}, בסך הכל {money(exampleWeek.total)} ברוטו.
        </p>
      ) : null}
      {weeklyOnly ? (
        <p>
          עובד בשכר של 50 ש״ח לשעה, שעבד חמישה ימים של 8.6 שעות ועוד 4 שעות בשישי. אף יום מהחמישה לא עבר את התקן
          היומי, אבל ביחד הם {hoursText(weeklyOnly.regularHours)} שעות, והשעות שמעל {WEEKLY_NORM} הן שעות נוספות
          שבועיות: {hoursText(weeklyOnly.hours125)} שעות ב-125%, בסכום של {money(weeklyOnly.pay125)}, ו-{hoursText(weeklyOnly.hours150)} שעות ב-150%, בסכום של {money(weeklyOnly.pay150)}.
        </p>
      ) : null}

      <h2>מה כדאי לדעת</h2>
      <ul>
        <li>
          <strong>חישוב יומי ושבועי, לא חודשי.</strong> שעות נוספות לא מתאזנות בין ימים: יום ארוך אחד לא מתקזז עם
          יום קצר.
        </li>
        <li>
          <strong>זמן חופשי במקום תשלום.</strong> לפי סעיפים 16 ו-17, לעובד בשכר חודשי אפשר במקרים מסוימים לתת שעות
          מנוחה במקום תשלום, ביחס שנקבע בחוק.
        </li>
        <li>
          <strong>מגבלות.</strong> יש תקרה להעסקה בשעות נוספות, והעסקה מעבר לתקרה דורשת היתר. הפרטים בעמוד של כל
          זכות.
        </li>
        <li>
          <strong>ענפים והסכמים.</strong> בענפים כמו מלונאות ובניין התקן שונה, ויש הסכמים קיבוציים
          שנותנים יותר.
        </li>
      </ul>
      <p>
        את ימי העבודה בחודש בלי חגים אפשר לספור ב<Link href="/tools/work-days-calculator">מחשבון ימי העבודה</Link>, ואת
        שכר המינימום לשעה לבדוק ב<Link href="/tools/minimum-wage-2026">מחשבון שכר המינימום</Link>.
      </p>

      <p className={styles.caveat}>
        החישוב לפי חוק שעות עבודה ומנוחה, התשי״א-1951, וצו ההרחבה לקיצור שבוע העבודה, כפי שמפורסמים באתר כל זכות. עבודה
        בשבת מעל התקן היומי, לילה, משמרות ושכר גלובלי הם מקרים שהמחשבון לא מכסה במלואם. הסכם קיבוצי, צו ענפי או חוזה
        אישי יכולים לתת יותר. זה מידע כללי ולא ייעוץ משפטי.
      </p>

      <h2>מקורות</h2>
      <ul className={styles.sources}>
        {sources.map((source) => (
          <li key={source.href}>
            <a href={source.href} rel="noopener" target="_blank">
              {source.label}
            </a>
          </li>
        ))}
      </ul>
      <p className={styles.reviewed}>הנתונים מבוססים על המקורות שלמעלה, נכון ל-24 באוקטובר 2026. במקרה של מחלוקת קובעים החוק והסכם העבודה.</p>
    </ToolLayout>
  )
}
