import Link from 'next/link'
import ToolLayout, { toolMetadata, type ToolFaqEntry } from '../../components/tools/ToolLayout'
import ChineseZodiacFinder from '../../components/tools/ChineseZodiacFinder'
import {
  ZODIAC_REVIEWED,
  allYears,
  animalOf,
  animals,
  elementOf,
  findZodiac,
  formatDate,
  polarityOf,
  newYearIso,
  recentYearsOf,
  years,
} from '@/lib/chinese-zodiac-finder'
import styles from './page.module.css'

const PATH = '/tools/chinese-zodiac-finder'
const TITLE = 'מזל סיני לפי תאריך לידה'
const META_TITLE = 'מזל סיני לפי תאריך לידה: מחשבון ותאריכי ראש השנה'
const DESCRIPTION =
  'מזל סיני לפי תאריך לידה: מקלידים תאריך ומקבלים את החיה, היסוד ויין או יאנג, כולל תאריכי ראש השנה הסיני מ-1924 עד 2043, ללא הרשמה.'

const faq: ToolFaqEntry[] = [
  {
    id: 'zodiac-faq-how',
    question: 'איך יודעים מה המזל הסיני שלי?',
    answer:
      'המזל הסיני נקבע לפי שנת הלידה הסינית, שמתחילה בראש השנה הסיני ולא ב-1 בינואר. יש שתים עשרה חיות החוזרות במחזור של שתים עשרה שנים. מקלידים בכלי את תאריך הלידה המלא ומקבלים את החיה, היסוד ויין או יאנג. הטבלה למטה מראה את תאריכי ראש השנה הסיני של כל שנה.',
  },
  {
    id: 'zodiac-faq-january',
    question: 'נולדתי בינואר או בפברואר, איזו חיה אני?',
    answer:
      'ראש השנה הסיני נופל בין 21 בינואר ל-20 בפברואר, לפי השנה. מי שנולד לפני התאריך הזה שייך לחיה של השנה הקודמת. למשל, ראש השנה של 2026 הוא ב-17 בפברואר, ולכן מי שנולד ב-1 בפברואר 2026 הוא נחש של 2025 ולא סוס. הכלי בודק את התאריך המדויק ואומר לכם אם נולדתם לפני ראש השנה.',
  },
  {
    id: 'zodiac-faq-element',
    question: 'מה זה יסוד, ואיך הוא נקבע?',
    answer:
      'לכל שנה סינית יש גם יסוד, אחד מחמישה: עץ, אש, אדמה, מתכת ומים. כל יסוד חל על שתי שנים רצופות, הראשונה יאנג והשנייה יין, ולכן מחזור היסודות אורך עשר שנים. חיה ויסוד יחד יוצרים מחזור של שישים שנה. 2026, שנת הסוס, היא סוס אש, ו-2024 היא דרקון עץ.',
  },
  {
    id: 'zodiac-faq-lichun',
    question: 'מדוע יש אתרים שנותנים תשובה אחרת לאותו תאריך?',
    answer:
      'בעיקר בגלל שתי שיטות לקביעת תחילת השנה. הכלי משתמש בתאריך ראש השנה הסיני, שנקבע לפי הלוח הירחי. אסטרולוגים מסוימים מתחילים את השנה ב-4 בפברואר בערך, בתחילת האביב הסיני, ולכן מי שנולד בין 4 בפברואר לראש השנה הסיני יקבל שם חיה אחרת. כדאי לבדוק איזו שיטה משמשת את המקור שאתם מסתמכים עליו.',
  },
  {
    id: 'zodiac-faq-years',
    question: 'עד אילו שנים הכלי עובד?',
    answer:
      'הכלי מכסה תאריכי לידה מ-5 בפברואר 1924 עד 29 בינואר 2044, כלומר 120 שנים סיניות, וכולן מופיעות בטבלה למטה. תאריכי ראש השנה הסיני נלקחו מטבלה של ויקיפדיה, ונבדקו בה ב-23 באוקטובר 2026. לגבי שנים מחוץ לטווח, אפשר להוסיף או להחסיר 12 לשנה ולמצוא את אותה חיה.',
  },
  {
    id: 'zodiac-faq-2000',
    question: 'נולדתי בשנת 2000. האם אני דרקון?',
    answer:
      'תלוי בתאריך. ראש השנה הסיני של 2000 היה ב-5 בפברואר, ומי שנולד מיום זה ואילך הוא דרקון מתכת. מי שנולד ב-1 בינואר 2000, או בכל יום עד 4 בפברואר, שייך לשנה הסינית הקודמת והוא ארנב אדמה. הכלי בודק את התאריך המלא, ולכן שנת הלידה לבדה אינה מספיקה.',
  },
  {
    id: 'zodiac-faq-2026-2027',
    question: 'מה המזל הסיני של 2026 ושל 2027?',
    answer:
      'שנת 2026 היא שנת הסוס, יסוד אש ויאנג, והיא מתחילה ב-17 בפברואר 2026. שנת 2027 היא שנת העז, גם היא יסוד אש אבל יין, והיא מתחילה ב-6 בפברואר 2027. מי שנולד ב-2026 לפני 17 בפברואר הוא נחש עץ, ומי שנולד ב-2027 לפני 6 בפברואר הוא סוס אש.',
  },
  {
    id: 'zodiac-faq-fun',
    question: 'האם יש משמעות אמיתית למזל הסיני?',
    answer:
      'המזל הסיני הוא מסורת תרבותית ומשחק שעשוע, ואין לו בסיס מדעי כשיטה לחיזוי אופי או גורל. אנשים רבים נהנים לשאול על החיה של חבריהם ובני משפחתם. הכלי כאן נועד לשעשוע ולידע כללי בלבד, ולא לקבלת החלטות אישיות, כמו בחירת בן זוג, מקום עבודה או תאריך לאירוע. את ההחלטות האלה כדאי לקבל על סמך נתונים ושיחה עם אנשים, ולא לפי החיה של שנת הלידה.',
  },
]

export const metadata = toolMetadata({ path: PATH, metaTitle: META_TITLE, description: DESCRIPTION })

const recent = years(2015, 2026).reverse()
const popularYears = years(1990, 2005)
const borderDates = ['2000-02-04', '2000-02-05', '2026-01-15', '2026-02-17', '2027-02-05', '2027-02-06']
  .map((date) => ({ date, result: findZodiac(date) }))
  .flatMap(({ date, result }) =>
    result.kind === 'ok'
      ? [
          {
            date,
            animal: result.animal.he,
            element: result.element,
            zodiacYear: result.zodiacYear,
            beforeNewYear: result.beforeNewYear,
          },
        ]
      : [],
  )

export default function ChineseZodiacFinderPage() {
  return (
    <ToolLayout
      path={PATH}
      title={TITLE}
      metaTitle={META_TITLE}
      description={DESCRIPTION}
      lede="המזל הסיני נקבע לפי ראש השנה הסיני ולא לפי 1 בינואר, ולכן מי שנולד בינואר או בפברואר עלול להשתייך לחיה של השנה הקודמת. מקלידים כאן תאריך לידה ומקבלים את החיה, היסוד ויין או יאנג."
      chips={['12 חיות וחמישה יסודות', 'תאריכי ראש השנה 1924 עד 2043', 'לשעשוע בלבד', 'בלי הרשמה']}
      tool={<ChineseZodiacFinder />}
      faq={faq}
      cta={{
        text: 'צריכים כלי חישוב או משחק אינטראקטיבי מותאם לעסק שלכם? אנחנו מפתחים כלים כאלה.',
        label: 'לפיתוח תוכנה לעסקים',
        href: '/services/development',
      }}
    >
      <h2>איך המזל הסיני עובד</h2>
      <p>
        בלוח הסיני יש מחזור של שתים עשרה שנים, ולכל שנה חיה: חולדה, שור, נמר, ארנב, דרקון, נחש, סוס, עז, קוף, תרנגול,
        כלב וחזיר. השנה מתחילה בראש השנה הסיני, שחל בין סוף ינואר לאמצע פברואר. בנוסף יש חמישה יסודות, עץ, אש,
        אדמה, מתכת ומים, וכל אחד מהם נמשך שתי שנים, ראשונה יאנג ושנייה יין. יחד הם יוצרים מחזור של שישים שנה.
      </p>

      <h2>12 החיות והשנים האחרונות שלהן</h2>
      <div className={styles.tableWrap}>
        <div className={styles.scroll} tabIndex={0} role="region" aria-label="טבלת החיות והשנים האחרונות שלהן">
          <table className={styles.table}>
            <caption>החיות ושש השנים האחרונות של כל אחת עד 2027</caption>
            <thead>
              <tr>
                <th scope="col">חיה</th>
                <th scope="col">שנות לידה סיניות</th>
              </tr>
            </thead>
            <tbody>
              {animals.map((animal) => (
                <tr key={animal.id}>
                  <th scope="row">
                    {animal.he} <span lang="en" dir="ltr">({animal.en})</span>
                  </th>
                  <td dir="ltr" className={styles.num}>
                    {recentYearsOf(animal.id, 2027, 6).join(', ')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <h2>תאריכי ראש השנה הסיני בעשור האחרון</h2>
      <div className={styles.tableWrap}>
        <div className={styles.scroll} tabIndex={0} role="region" aria-label="תאריכי ראש השנה הסיני 2015 עד 2026">
          <table className={styles.table}>
            <caption>ראש השנה הסיני, החיה והיסוד, 2015 עד 2026</caption>
            <thead>
              <tr>
                <th scope="col">שנה</th>
                <th scope="col">ראש השנה הסיני</th>
                <th scope="col">חיה</th>
                <th scope="col">יסוד</th>
              </tr>
            </thead>
            <tbody>
              {recent.map((year) => (
                <tr key={year}>
                  <th scope="row">{year}</th>
                  <td dir="ltr" className={styles.num}>
                    {formatDate(newYearIso(year))}
                  </td>
                  <td>{animalOf(year).he}</td>
                  <td>{elementOf(year)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <details className={styles.details}>
        <summary>כל התאריכים מ-1924 עד 2043</summary>
        <div className={styles.tableWrap}>
          <div className={styles.scroll} tabIndex={0} role="region" aria-label="כל תאריכי ראש השנה הסיני">
            <table className={styles.table}>
              <caption>ראש השנה הסיני, החיה והיסוד, 1924 עד 2043</caption>
              <thead>
                <tr>
                  <th scope="col">שנה</th>
                  <th scope="col">ראש השנה הסיני</th>
                  <th scope="col">חיה</th>
                  <th scope="col">יסוד</th>
                </tr>
              </thead>
              <tbody>
                {allYears.map((year) => (
                  <tr key={year}>
                    <th scope="row">{year}</th>
                    <td dir="ltr" className={styles.num}>
                      {formatDate(newYearIso(year))}
                    </td>
                    <td>{animalOf(year).he}</td>
                    <td>{elementOf(year)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </details>

      <h2>מזל סיני לפי שנת לידה: 1990 עד 2005</h2>
      <p>
        רוב מי שמחפש מזל סיני מחפש לפי שנה. הטבלה מראה לכל שנה את החיה, היסוד ואת תאריך ראש השנה הסיני. מי שנולד
        לפני התאריך שבשורה שייך לחיה של השורה שלמעלה, ולכן בשנים שבהן ראש השנה מאוחר, כמו 1996 ו-2007, נולדים הרבה
        אנשים מינואר ועד אמצע פברואר שהם עדיין בשנה הקודמת.
      </p>
      <div className={styles.tableWrap}>
        <div className={styles.scroll} tabIndex={0} role="region" aria-label="מזל סיני לפי שנת לידה 1990 עד 2005">
          <table className={styles.table}>
            <caption>החיה והיסוד לפי שנה, 1990 עד 2005</caption>
            <thead>
              <tr>
                <th scope="col">שנה</th>
                <th scope="col">ראש השנה הסיני</th>
                <th scope="col">חיה</th>
                <th scope="col">יסוד</th>
                <th scope="col">יין או יאנג</th>
              </tr>
            </thead>
            <tbody>
              {popularYears.map((year) => (
                <tr key={year}>
                  <th scope="row">{year}</th>
                  <td dir="ltr" className={styles.num}>
                    {formatDate(newYearIso(year))}
                  </td>
                  <td>{animalOf(year).he}</td>
                  <td>{elementOf(year)}</td>
                  <td>{polarityOf(year)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <h2>מזל סיני 2026, 2027 ו-2028</h2>
      <p>
        שנת הסוס, 2026, מתחילה ב-{formatDate(newYearIso(2026))} והיא סוס אש יאנג. שנת העז, 2027, מתחילה ב-
        {formatDate(newYearIso(2027))} והיא עז אש יין. שנת הקוף, 2028, מתחילה ב-{formatDate(newYearIso(2028))} והיא קוף
        אדמה יאנג. לכן ילד שנולד בינואר 2027 הוא סוס ולא עז, וילד שנולד ב-1 בפברואר 2026 הוא נחש. תאריכי
        הלידה בכלי הם תאריכים לועזיים. לתאריך העברי המקביל יש{' '}
        <Link href="/tools/hebrew-date-converter">ממיר תאריך עברי ללועזי</Link>, ולמי שמתכנן אירוע לפי שני הלוחות יש גם{' '}
        <Link href="/tools/hebrew-calendar-2027">לוח שנה עברי-לועזי 2026 עד 2027</Link>.
      </p>

      <h2>תאריכים על הגבול: ימים שבהם השנה מתחלפת</h2>
      <p>המקרים הבעייתיים הם תאריכים סמוך לראש השנה הסיני. כך הכלי מחשב כמה דוגמאות:</p>
      <ul>
        {borderDates.map((item) => (
          <li key={item.date}>
            <strong dir="ltr">{formatDate(item.date)}</strong>: {item.animal} {item.element}, שנה סינית {item.zodiacYear}
            {item.beforeNewYear ? ' (לפני ראש השנה הסיני של שנת הלידה הלועזית)' : ''}
          </li>
        ))}
      </ul>

      <h2>איך מחשבים מזל סיני בלי הכלי</h2>
      <p>
        אחרי שקובעים לפי ראש השנה הסיני איזו שנה סינית חלה, החישוב פשוט. מחסירים 4 מהשנה ומחלקים ב-12: השארית
        קובעת את החיה לפי הסדר חולדה, שור, נמר, ארנב, דרקון, נחש, סוס, עז, קוף, תרנגול, כלב וחזיר, כשהחולדה היא 0.
        לשנת 1992, 1988 חלקי 12 נותן שארית 8, והחיה השמינית אחרי החולדה היא קוף. את היסוד מחשבים באופן דומה:
        מחסירים 4, לוקחים את השארית בחלוקה ב-10 ומחלקים ב-2 בלי שארית, והתוצאה היא מקום ברשימה עץ, אש, אדמה, מתכת
        ומים. ב-1992 השארית היא 8, חצי הוא 4, ולכן היסוד הוא מים. שנה זוגית היא יאנג ושנה אי זוגית היא יין.
      </p>
      <p>
        מחזור של 12 חיות וחמישה יסודות חוזר אחרי 60 שנה, כך שלכל שילוב של חיה ויסוד יש שנה אחת בכל מחזור. הכלי
        מכסה 120 שנים, כלומר שני מחזורים שלמים. כדי לחשב כמה זמן עבר מתאריך לידה ועד היום, אפשר להשתמש ב
        <Link href="/tools/days-between-dates">מחשבון הימים בין תאריכים</Link>.
      </p>

      <h2>מקורות</h2>
      <ul className={styles.sources}>
        <li>
          <a href="https://en.wikipedia.org/wiki/Chinese_zodiac" rel="noopener" target="_blank" lang="en" dir="ltr">
            Wikipedia: Chinese zodiac (animal order, elements, yin and yang, start dates 1924 to 2043)
          </a>
        </li>
      </ul>
      <p className={styles.reviewed}>
        התאריכים נבדקו מול המקור ב-<time dateTime={ZODIAC_REVIEWED}>23.10.2026</time>. המזל הסיני הוא שעשוע ומסורת, לא
        חיזוי.
      </p>
    </ToolLayout>
  )
}
