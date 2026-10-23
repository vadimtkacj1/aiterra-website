import ToolLayout, { toolMetadata, type ToolFaqEntry } from '../../components/tools/ToolLayout'
import ChineseZodiacFinder from '../../components/tools/ChineseZodiacFinder'
import {
  ZODIAC_REVIEWED,
  allYears,
  animalOf,
  animals,
  elementOf,
  formatDate,
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
    id: 'zodiac-faq-fun',
    question: 'האם יש משמעות אמיתית למזל הסיני?',
    answer:
      'המזל הסיני הוא מסורת תרבותית ומשחק שעשוע, ואין לו בסיס מדעי כשיטה לחיזוי אופי או גורל. אנשים רבים נהנים לשאול על החיה של חבריהם ובני משפחתם. הכלי כאן נועד לשעשוע ולידע כללי בלבד, ולא לקבלת החלטות אישיות, כמו בחירת בן זוג, מקום עבודה או תאריך לאירוע. את ההחלטות האלה כדאי לקבל על סמך נתונים ושיחה עם אנשים, ולא לפי החיה של שנת הלידה.',
  },
]

export const metadata = toolMetadata({ path: PATH, metaTitle: META_TITLE, description: DESCRIPTION })

const recent = years(2015, 2026).reverse()

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
