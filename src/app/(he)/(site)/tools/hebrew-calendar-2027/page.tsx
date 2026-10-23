import Link from 'next/link'
import ToolLayout, { toolMetadata, type ToolFaqEntry } from '../../components/tools/ToolLayout'
import HebrewCalendar from '../../components/tools/HebrewCalendar'
import { calendarYear, hebrewDateText, holidayTable, kindLabels, shortDate, weekdayText } from '@/lib/hebrew-calendar'
import { formatDate } from '@/lib/work-days'
import styles from './page.module.css'

const PATH = '/tools/hebrew-calendar-2027'
const TITLE = 'לוח שנה עברי-לועזי 2026–2027 להדפסה'
const META_TITLE = 'לוח שנה עברי לועזי 2027 להדפסה: כל החגים בתשפ״ז'
const DESCRIPTION =
  'לוח שנה עברי-לועזי לתשפ״ז, 2026 ו-2027: כל יום עם התאריך העברי, חגים, צומות וראשי חודשים. הדפסה ב-A4, חודש בעמוד או שנה בעמוד, וייצוא החגים ליומן.'

const wiki = (title: string) => `https://he.wikipedia.org/wiki/${encodeURIComponent(title.replace(/ /g, '_'))}`
const wikisource = (title: string) => `https://he.wikisource.org/wiki/${encodeURIComponent(title.replace(/ /g, '_'))}`

const SOURCES = {
  calendar: wiki('הלוח העברי'),
  fasts: wiki('תענית ציבור'),
  shoah: wiki('יום הזיכרון לשואה ולגבורה'),
  roshChodesh: wiki('ראש חודש'),
  restDays: `${wikisource('פקודת סדרי השלטון והמשפט')}#${encodeURIComponent('סעיף_18א')}`,
}

function loadData() {
  const year = calendarYear('5787')
  if (!year) throw new Error('Hebrew calendar data is unavailable')
  const table = holidayTable(year.events)
  const find = (name: string) => {
    const event = table.find((item) => item.name === name)
    if (!event) throw new Error(`Missing ${name}`)
    return event
  }
  const today = Math.floor(Date.now() / 86_400_000)
  const current = year.months.findIndex((month) => {
    const first = month.cells[0].day
    return today >= first && today <= month.cells[month.cells.length - 1].day
  })
  return {
    year,
    table,
    roshHashanah: find('ראש השנה'),
    kippur: find('יום כיפור'),
    pesach: find('פסח'),
    purim: find('פורים'),
    independence: find('יום העצמאות'),
    shavuot: find('שבועות'),
    chanukah: find('חנוכה (נר ראשון)'),
    nextYear: year.to + 1,
    initialMonth: current < 0 ? 0 : current,
  }
}

const data = loadData()

const faq: ToolFaqEntry[] = [
  {
    id: 'calendar-faq-print',
    question: 'איך מדפיסים את לוח השנה העברי-לועזי?',
    answer:
      'בוחרים שנה ולוחצים על ״הדפסה: חודש בעמוד״ כדי לקבל עמוד A4 לכל חודש, עם התאריך העברי ושמות החגים בתוך המשבצות. ״הדפסה: שנה בעמוד אחד״ מכניס את כל החודשים לעמוד A4 יחיד, עם רשימת החגים בתחתית. בחלון ההדפסה אפשר לבחור ״שמירה כ-PDF״ ולשלוח את הקובץ. כדי שהצבעים יודפסו, משאירים מסומן את ״גרפיקת רקע״.',
  },
  {
    id: 'calendar-faq-rosh-hashana',
    question: 'מתי ראש השנה תשפ״ז ומתי פסח 2027?',
    answer: `ראש השנה תשפ״ז חל ב${formatDate(data.roshHashanah.day)} וב${formatDate(
      data.roshHashanah.day + 1,
    )}, ויום כיפור ב${formatDate(data.kippur.day)}. פסח תשפ״ז חל ב${formatDate(
      data.pesach.day,
    )}, ושבועות ב${formatDate(data.shavuot.day)}. כל חג מתחיל בערב שלפני, בשקיעה, ולכן ערב החג מסומן בלוח ביום שקודם לו. ראש השנה תשפ״ח, שפותח את השנה הבאה, יחול ב${formatDate(data.nextYear)}.`,
  },
  {
    id: 'calendar-faq-leap',
    question: 'האם תשפ״ז היא שנה מעוברת?',
    answer: `כן. בתשפ״ז יש 13 חודשים, כי נוסף לה אדר א׳, ולכן בלוח מופיעים גם אדר א׳ וגם אדר ב׳. פורים נחגג באדר ב׳, ובתשפ״ז הוא חל ב${formatDate(
      data.purim.day,
    )}. בשנה מעוברת החגים של האביב מאחרים בכחודש לעומת השנה הקודמת.`,
  },
  {
    id: 'calendar-faq-fasts',
    question: 'מה קורה כשצום חל בשבת?',
    answer:
      'צום שחל בשבת נדחה, חוץ מיום כיפור. צום גדליה, י״ז בתמוז ותשעה באב עוברים ליום ראשון שאחרי השבת. תענית אסתר מוקדמת ליום חמישי, כי אי אפשר לדחות אותה אל פורים. עשרה בטבת לא יכול לחול בשבת לפי סדר הלוח. הלוח כאן כבר מציג כל צום בתאריך שבו צמים בפועל, ולא בתאריך העברי המקורי שלו.',
  },
  {
    id: 'calendar-faq-ics',
    question: 'איך מוסיפים את החגים ליומן גוגל או לאאוטלוק?',
    answer:
      'לוחצים על ״הורדת החגים ליומן״ ומקבלים קובץ ics עם כל המועדים של השנה שנבחרה, כאירועים של יום שלם שלא חוסמים זמן ביומן. ביומן Google נכנסים להגדרות, בוחרים ״ייבוא וייצוא״ ומעלים את הקובץ. באאוטלוק ובאייפון מספיק לפתוח את הקובץ. כדאי לייבא ליומן נפרד, כדי שאפשר יהיה להסתיר או למחוק את כל החגים בבת אחת.',
  },
  {
    id: 'calendar-faq-school',
    question: 'האם הלוח כולל את החופשות של בתי הספר?',
    answer:
      'לא. הלוח מסמן חגים, ימי שבתון לפי החוק, צומות, ימי זיכרון וראשי חודשים, אבל לא את חופשות משרד החינוך, שנקבעות בכל שנה בחוזר נפרד ומשתנות בין זרמים ורשויות. את החופשות בודקים בלוח החופשות של משרד החינוך ושל בית הספר. ימי חג ושבתון כמו פסח, סוכות ויום העצמאות כבר מסומנים בלוח באדום.',
  },
]

export const metadata = toolMetadata({ path: PATH, metaTitle: META_TITLE, description: DESCRIPTION })

export default function HebrewCalendarPage() {
  return (
    <ToolLayout
      path={PATH}
      title={TITLE}
      metaTitle={META_TITLE}
      description={DESCRIPTION}
      lede={`תשפ״ז מתחילה בראש השנה, ${formatDate(data.roshHashanah.day)}, ונמשכת עד ${formatDate(
        data.year.to,
      )}, ופסח שלה חל ב${formatDate(data.pesach.day)}. כאן רואים כל יום ב-2026 וב-2027 עם התאריך העברי, החגים, הצומות וראשי החודשים, ומדפיסים ב-A4 חודש בעמוד או שנה שלמה בעמוד אחד.`}
      chips={['תשפ״ז, 2026 ו-2027', 'הדפסה ב-A4', 'חגים, צומות וראשי חודשים', 'ייצוא ליומן (ics)']}
      tool={<HebrewCalendar initialMonth={data.initialMonth} />}
      faq={faq}
      cta={{
        text: 'אנחנו בונים לעסקים מערכות הזמנות ותזכורות שמכירות את החגים ואת הלוח העברי.',
        label: 'פיתוח תוכנה לעסקים',
        href: '/services/development',
      }}
    >
      <h2 id="holidays" className={styles.anchor}>
        חגים ומועדים בתשפ״ז (2026–2027)
      </h2>
      <p>
        הטבלה מציגה את החגים, הצומות וימי הזיכרון של תשפ״ז לפי התאריך הלועזי. חג מתחיל בערב שלפני התאריך שבטבלה, בשקיעה.
        חול המועד וראשי חודשים מסומנים בלוח שלמעלה.
      </p>
      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <caption>חגים ומועדים בשנת תשפ״ז</caption>
          <thead>
            <tr>
              <th scope="col">מועד</th>
              <th scope="col">תאריך</th>
              <th scope="col">תאריך עברי</th>
              <th scope="col">סוג</th>
            </tr>
          </thead>
          <tbody>
            {data.table.map((event) => (
              <tr key={`${event.day}-${event.name}`}>
                <th scope="row">{event.name}</th>
                <td>
                  <span className={styles.date}>{shortDate(event.day)}</span>
                  <span className={styles.weekday}>{weekdayText(event.day)}</span>
                </td>
                <td>{hebrewDateText(event.day)}</td>
                <td>{kindLabels[event.kind]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2 id="how-to-read" className={styles.anchor}>
        איך קוראים את הלוח העברי-לועזי
      </h2>
      <p>
        בכל משבצת המספר הגדול הוא היום הלועזי, ומתחתיו התאריך העברי באותיות. ביום הראשון של כל חודש עברי מופיע גם שם
        החודש. התאריך העברי מתחלף בשקיעה, ולכן אירוע שמתחיל בערב שייך כבר לתאריך העברי של היום שאחריו. הצבעים מסמנים:
      </p>
      <ul>
        <li>אדום: חגים וימי שבתון לפי החוק, כמו ראש השנה, פסח ויום העצמאות.</li>
        <li>כתום: ערב חג. ורוד בהיר: חול המועד.</li>
        <li>סגול: צומות. אפור: יום הזיכרון לשואה ולגבורה ויום הזיכרון לחללי מערכות ישראל.</li>
        <li>כחול: חגים בלי שבתון, כמו חנוכה, פורים, ט״ו בשבט ול״ג בעומר. ירוק: ראש חודש.</li>
      </ul>
      <p>
        ראש חודש נמשך יום אחד כשהחודש הקודם חסר (29 ימים), ויומיים כשהוא מלא (30 ימים), ואז היום ה-30 של החודש הקודם הוא
        היום הראשון של ראש החודש. כך כותבים ב
        <a href={SOURCES.roshChodesh} rel="noopener" target="_blank">
          ערך ״ראש חודש״ בוויקיפדיה
        </a>
        .
      </p>

      <h2 id="year" className={styles.anchor}>
        תשפ״ז: שנה מעוברת של 13 חודשים
      </h2>
      <p>
        השנה העברית מתחילה בתשרי ולא בינואר, ולכן תשפ״ז מתפרסת על שתי שנים לועזיות: מ{formatDate(data.year.from)} עד{' '}
        {formatDate(data.year.to)}. היא שנה מעוברת, עם אדר א׳ ואדר ב׳. ב
        <a href={SOURCES.calendar} rel="noopener" target="_blank">
          לוח העברי
        </a>{' '}
        מוסיפים חודש שבע פעמים בכל מחזור של 19 שנים, כדי שפסח ימשיך לחול באביב. לכן בלוח של תשפ״ז יש 14 חודשים לועזיים,
        מספטמבר 2026 עד אוקטובר 2027, ובבחירת ״2026״ או ״2027״ מקבלים שנה לועזית רגילה מינואר עד דצמבר.
      </p>
      <p>
        חנוכה מתחיל ב{formatDate(data.chanukah.day)}, ויום העצמאות ה-79 יחול ב{formatDate(data.independence.day)}. יום
        העצמאות ויום הזיכרון מוקדמים או נדחים כדי לא לגעת בשבת, וגם{' '}
        <a href={SOURCES.shoah} rel="noopener" target="_blank">
          יום הזיכרון לשואה ולגבורה
        </a>{' '}
        זז ליום חמישי כשכ״ז בניסן חל ביום שישי, וליום שני כשהוא חל ביום ראשון.
      </p>

      <h2 id="fasts" className={styles.anchor}>
        צומות שנדחים ומוקדמים
      </h2>
      <p>
        צום גדליה, עשרה בטבת, תענית אסתר, י״ז בתמוז ותשעה באב קבועים בתאריך עברי, אבל לא תמיד צמים בו.{' '}
        <a href={SOURCES.fasts} rel="noopener" target="_blank">
          לפי כללי תעניות הציבור
        </a>
        , צום שחל בשבת נדחה ליום ראשון, ותענית אסתר מוקדמת ליום חמישי. הלוח כאן מציג את היום שבו צמים בפועל. בתשפ״ז צום
        גדליה חל ב{formatDate(data.year.events.find((event) => event.name === 'צום גדליה')?.day ?? data.year.from)}.
      </p>

      <h2 id="rest-days" className={styles.anchor}>
        ימי שבתון וימי עבודה
      </h2>
      <p>
        ימי המנוחה במדינת ישראל נקבעו ב
        <a href={SOURCES.restDays} rel="noopener" target="_blank">
          סעיף 18א לפקודת סדרי השלטון והמשפט
        </a>
        : שבת, שני ימי ראש השנה, יום כיפור, היום הראשון של סוכות, שמיני עצרת, היום הראשון והשביעי של פסח, יום העצמאות
        ושבועות. הם מסומנים באדום. בחנוכה, בפורים ובל״ג בעומר עובדים כרגיל, גם אם בתי הספר בחופשה. כדי לספור ימי עבודה
        בין תאריכים, יש <Link href="/tools/work-days-calculator">מחשבון ימי עבודה</Link>, ולהמרה של תאריך בודד יש{' '}
        <Link href="/tools/hebrew-date-converter">המרת תאריך עברי ללועזי</Link>.
      </p>
    </ToolLayout>
  )
}
