import Link from 'next/link'
import ToolLayout, { toolMetadata, type ToolFaqEntry } from '../../components/tools/ToolLayout'
import BedMattressSizeChart from '../../components/tools/BedMattressSizeChart'
import {
  BED_REVIEWED,
  DEFAULT_FRAME_CM,
  DEFAULT_MATTRESS_HEIGHT_CM,
  DEFAULT_WALKWAY_CM,
  bedSizes,
  checkRoom,
  findBed,
  pocketDepthCm,
} from '@/lib/bed-mattress-size-chart'
import styles from './page.module.css'

const PATH = '/tools/bed-mattress-size-chart'
const TITLE = 'מידות מיטה ומזרן'
const META_TITLE = 'מידות מיטה ומזרן: יחיד, וחצי, זוגית וקינג בס״מ'
const DESCRIPTION =
  'מידות מיטה ומזרן בישראל בסנטימטרים: יחיד, מיטה וחצי, זוגית וקינג, מול המידות בארה״ב, באירופה ובבריטניה, וחישוב איזו מיטה נכנסת לחדר.'

const faq: ToolFaqEntry[] = [
  {
    id: 'bed-faq-single',
    question: 'מה המידות של מיטה יחיד ושל מיטה וחצי?',
    answer:
      'מזרן יחיד נמכר בישראל בדרך כלל ב-80 על 190 או 90 על 190 סנטימטרים, ובחלק מהחנויות גם 90 על 200. מיטה וחצי היא 120 על 190, ובחלק מהמקרים 120 על 200. אלה מידות מסחריות נפוצות ולא תקן, ולכן בדקו באתר היצרן או בחנות את המידה המדויקת של המזרן שאתם קונים.',
  },
  {
    id: 'bed-faq-double',
    question: 'מה המידות של מיטה זוגית?',
    answer:
      'המידה הנפוצה למזרן זוגי בישראל היא 140 על 190 סנטימטרים, ויש גם 140 על 200. מיטות זוגיות רחבות יותר, 160 על 200 ו-180 על 200, נמכרות תחת השמות זוגית רחבה, קווין וקינג, ולא כל חנות קוראת להן באותו שם. בשם המידה לא כדאי להסתמך, אלא במספרים בסנטימטרים.',
  },
  {
    id: 'bed-faq-king',
    question: 'מה גודל מיטת קינג סייז?',
    answer:
      'אין הגדרה אחת. בחנויות רבות קינג הוא 180 על 200 סנטימטרים, והוא זהה לאחת המידות האירופיות של מיטה זוגית. יש מקורות שמגדירים קינג סייז ברוחב 150 עד 160 ובאורך 200 עד 220 סנטימטרים. לפני הזמנה בדקו שהמזרן והמסגרת נמכרים באותה מידה בסנטימטרים, ולא רק באותו שם.',
  },
  {
    id: 'bed-faq-us',
    question: 'במה שונות המידות בארה״ב ובבריטניה?',
    answer:
      'בארה״ב Twin הוא 98 על 189 סנטימטרים, Full הוא 136 על 189, Queen הוא 152 על 202 ו-King הוא 193 על 202. בבריטניה Double הוא 137 על 191, King הוא 152 על 198 ו-Super king הוא 183 על 198. לכן Queen אמריקאי קטן מזוגית של 160 על 200 בכ-8 סנטימטרים לרוחב, וקינג אמריקאי רחב מ-180 על 200.',
  },
  {
    id: 'bed-faq-sheet',
    question: 'איזה סדין עם גומי לקנות למזרן?',
    answer:
      'לקנות סדין באותו רוחב ואורך של המזרן, ולבדוק את עומק הכיס. הכיס צריך להיות גבוה מהמזרן, ככלל אצבע בכמה סנטימטרים. מזרן בגובה 25 סנטימטרים דורש סדין עם כיס של 30 לפחות, ומזרן עם כרית עליונה דורש יותר. הכלי כאן מחשב את העומק הזה לפי הגובה שתקלידו.',
  },
  {
    id: 'bed-faq-room',
    question: 'כמה מקום צריך מסביב למיטה?',
    answer:
      'ככלל אצבע, רצוי מעבר של כ-70 סנטימטרים בצד המיטה שבו עולים עליה ובסוף המיטה. זה מספר שאנחנו משתמשים בו בכלי, ואפשר לשנות אותו. קחו בחשבון גם את הדלת, ארון עם דלתות נפתחות וחלון, כי הכלי מחשב רק את שטח הרצפה.',
  },
  {
    id: 'bed-faq-one-and-half',
    question: 'האם מיטה וחצי מתאימה לשני אנשים?',
    answer:
      'מיטה וחצי ברוחב 120 סנטימטרים משאירה 60 סנטימטרים לכל אחד מהשניים, פחות ממיטת יחיד ברוחב 90. היא מתאימה בעיקר לאדם אחד שרוצה מקום, או לחדר קטן. לשני מבוגרים שישנים יחד לאורך זמן, המידות הנפוצות הן זוגית ברוחב 140 לפחות, ובדרך כלל 160 או 180.',
  },
  {
    id: 'bed-faq-fit',
    question: 'איך יודעים אם מיטה נכנסת לחדר?',
    answer: `מוסיפים למידות המזרן את המסגרת, ${DEFAULT_FRAME_CM} סנטימטרים בכל צד בחישוב שלנו, ומשאירים מעבר של ${DEFAULT_WALKWAY_CM} סנטימטרים בצד שעולים ממנו ובסוף המיטה. אחר כך בודקים אם החדר מספיק, כשהמיטה עומדת ישר וגם כשהיא מסובבת. הכלי למעלה עושה את שתי הבדיקות, ובפסקת הדוגמה למטה מפורט חישוב מלא.`,
  },
]

export const metadata = toolMetadata({ path: PATH, metaTitle: META_TITLE, description: DESCRIPTION })

export default function BedMattressSizeChartPage() {
  return (
    <ToolLayout
      path={PATH}
      title={TITLE}
      metaTitle={META_TITLE}
      description={DESCRIPTION}
      lede="בישראל נמכרים בדרך כלל מזרן יחיד 90 על 190, מיטה וחצי 120 על 190, זוגית 140 על 190 וקינג 180 על 200 סנטימטרים, אבל המידות משתנות בין יצרנים. בוחרים כאן גודל מיטה ורואים סדין מתאים, ומקלידים מידות חדר ורואים אילו מיטות נכנסות."
      chips={['מידות נפוצות בישראל', 'מול ארה״ב, אירופה ובריטניה', 'סדין לפי גובה מזרן', 'מה נכנס לחדר']}
      tool={<BedMattressSizeChart />}
      faq={faq}
      cta={{
        text: 'צריכים כלי חישוב או המרה מותאם לעסק שלכם? אנחנו מפתחים כלים כאלה.',
        label: 'לפיתוח תוכנה לעסקים',
        href: '/services/development',
      }}
    >
      <h2>טבלת מידות מיטה ומזרן</h2>
      <p>
        אלה מידות שוק נפוצות ולא תקן: יצרנים וחנויות שונים סוטים בכמה סנטימטרים, ובחלק מהחנויות אפשר להזמין מזרן
        מוגדל בתוספת מחיר. בעמודות של אירופה, ארה״ב ובריטניה מופיעה המידה הקרובה ביותר, שאינה זהה.
      </p>
      <div className={styles.tableWrap}>
        <div className={styles.scroll} tabIndex={0} role="region" aria-label="טבלת מידות מיטה ומזרן">
          <table className={styles.table}>
            <caption>מידות מיטה ומזרן בסנטימטרים, רוחב על אורך</caption>
            <thead>
              <tr>
                <th scope="col">שם בישראל</th>
                <th scope="col">מידות מזרן נפוצות</th>
                <th scope="col">אירופה</th>
                <th scope="col">ארה״ב</th>
                <th scope="col">בריטניה</th>
              </tr>
            </thead>
            <tbody>
              {bedSizes.map((size) => (
                <tr key={size.id}>
                  <th scope="row">{size.name}</th>
                  <td dir="ltr" className={styles.num}>
                    {size.options}
                  </td>
                  <td>{size.eu}</td>
                  <td dir="ltr" className={styles.num}>
                    {size.us}
                  </td>
                  <td dir="ltr" className={styles.num}>
                    {size.uk}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <h2>איך בוחרים בין המידות</h2>
      <ul>
        <li>
          <strong>מזרן ומסגרת:</strong> המזרן צריך להיות בגודל הפנים של המסגרת. מסגרת חיצונית רחבה מהמזרן בכמה
          סנטימטרים בכל צד, וזה משפיע על החישוב של החדר.
        </li>
        <li>
          <strong>אורך:</strong> מידות המזרן הנפוצות הן 190 ו-200 סנטימטרים. אם אתם גבוהים, בדקו אורך 200.
        </li>
        <li>
          <strong>זוג:</strong> 140 סנטימטרים לשני אנשים הם 70 לכל אחד, פחות מרוחב של מיטה יחיד. מי שמתכננים לישון
          יחד לאורך זמן בוחרים בדרך כלל 160 או 180.
        </li>
        <li>
          <strong>מידה אחרת:</strong> מחירון מזרנים שעיינו בו מציין תוספת של 8% עד 13% בקירוב לכל 10 סנטימטרים של
          הגדלה.
        </li>
      </ul>

      <h2>מידות מיטה וחצי</h2>
      <p>
        מיטה וחצי נמכרת בדרך כלל ב-{findBed('one-and-half').options}. ברוחב 120 סנטימטרים היא רחבה ב-30 סנטימטרים
        ממזרן יחיד של 90, אבל צרה ב-20 סנטימטרים מזוגית של 140. באירופה המידה הקרובה אליה נקראת {findBed('one-and-half').eu},
        בבריטניה {findBed('one-and-half').uk}, ובארה״ב אין מידה קרובה. לכן מזרן שמזמינים מחו״ל לא יתאים למיטה וחצי
        ישראלית בלי בדיקה.
      </p>

      <h2>מידות מיטה זוגית סטנדרטית</h2>
      <p>
        זוגית סטנדרטית היא {findBed('double').options}. המידה האמריקאית הקרובה היא {findBed('double').us} והבריטית
        היא {findBed('double').uk}, כלומר הפרש של 3 עד 4 סנטימטרים ברוחב ושל סנטימטר באורך. ברוחב 140, כל אחד מהשניים מקבל 70
        סנטימטרים, פחות מרוחב של יחיד. מיטה זוגית רחבה ברוחב 160 מוסיפה 10 סנטימטרים לכל אחד, וקינג ברוחב 180
        מוסיף 20.
      </p>

      <h2>מידות מיטה יחיד סטנדרטית</h2>
      <p>
        מזרן יחיד נמכר ב-{findBed('single').options}. ההבדל בין 80 ל-90 הוא 10 סנטימטרים של רוחב, וההבדל בין 190 ל-200
        הוא 10 סנטימטרים של אורך. מי שרוצה יותר אורך יכול לבחור 200, בתנאי שהמסגרת נמכרת באותה מידה.
      </p>

      <h2>כמה מקום צריך בחדר לכל מידה</h2>
      <p>
        הטבלה מחשבת את הרוחב והאורך המינימליים של חדר, לפי הנחות הכלי: מסגרת של {DEFAULT_FRAME_CM} סנטימטרים בכל צד
        ומעבר של {DEFAULT_WALKWAY_CM} סנטימטרים. בעמודה הראשונה יש מעבר בצד אחד בלבד, למשל כשהמיטה צמודה לקיר, ובשנייה
        בשני הצדדים.
      </p>
      <div className={styles.tableWrap}>
        <div className={styles.scroll} tabIndex={0} role="region" aria-label="טבלת שטח נדרש בחדר לכל מידת מיטה">
          <table className={styles.table}>
            <caption>רוחב ואורך חדר מינימליים בסנטימטרים</caption>
            <thead>
              <tr>
                <th scope="col">מידה</th>
                <th scope="col">מזרן</th>
                <th scope="col">רוחב לאדם</th>
                <th scope="col">חדר, מעבר בצד אחד</th>
                <th scope="col">חדר, מעבר בשני צדדים</th>
              </tr>
            </thead>
            <tbody>
              {bedSizes.map((size) => {
                const room = { widthCm: 0, lengthCm: 0, walkwayCm: DEFAULT_WALKWAY_CM, frameCm: DEFAULT_FRAME_CM }
                const one = checkRoom({ ...room, bothSides: false }, size)
                const both = checkRoom({ ...room, bothSides: true }, size)
                return (
                  <tr key={size.id}>
                    <th scope="row">{size.name}</th>
                    <td dir="ltr" className={styles.num}>
                      {size.widthCm}×{size.lengthCm}
                    </td>
                    <td className={styles.num}>{size.widthCm / 2}</td>
                    <td dir="ltr" className={styles.num}>
                      {one.neededWidthCm}×{one.neededLengthCm}
                    </td>
                    <td dir="ltr" className={styles.num}>
                      {both.neededWidthCm}×{both.neededLengthCm}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      <h2>דוגמה: קינג בחדר של 3 על 3.5 מטר</h2>
      <p>
        מזרן קינג הוא 180×200. עם מסגרת של 5 סנטימטרים בכל צד המיטה היא 190×210, ועם מעבר של 70 סנטימטרים משני הצדדים
        צריך רוחב של 330 סנטימטרים ואורך של 280. חדר של 300 על 350 לא מספיק כשהמיטה עומדת לאורך החדר, כי חסרים 30
        סנטימטרים של רוחב. אם מסובבים אותה, כך שהאורך שלה לאורך הצלע של 350, הכול נכנס: 330 מתוך 350, ו-280 מתוך 300.
        אם מוותרים על מעבר באחד הצדדים, צריך רק 260 סנטימטרים של רוחב והמיטה נכנסת גם בלי לסובב. הקלידו את מידות
        החדר שלכם בכלי כדי לבדוק את המקרה שלכם. הבדיקה לא כוללת דלתות, ארונות וחלונות, ולכן מדדו אותם בנפרד.
      </p>
      <p>
        אם אתם משפצים או צובעים את החדר לפני שמכניסים את המיטה, אפשר לחשב כמה צבע צריך ב<Link href="/tools/paint-quantity-calculator">מחשבון
        כמות הצבע</Link>.
      </p>

      <h2>איזה סדין עם גומי מתאים למזרן</h2>
      <p>
        עומק הכיס של הסדין צריך להיות גבוה מהמזרן בכמה סנטימטרים. בחישוב שלנו התוספת היא 5 סנטימטרים: מזרן בגובה{' '}
        {DEFAULT_MATTRESS_HEIGHT_CM} סנטימטרים דורש כיס של {pocketDepthCm(DEFAULT_MATTRESS_HEIGHT_CM)}, ומזרן בגובה 32
        דורש כיס של {pocketDepthCm(32)}. כשיש גם מגן מזרן או כרית עליונה, מוסיפים את הגובה שלהם.
      </p>

      <h2>אחרי שבחרתם מיטה: שעות שינה</h2>
      <p>
        המידה היא רק חלק מהבחירה. אחרי שבחרתם מזרן, תכננו גם את שעות השינה עצמן. מחשבון{' '}
        <Link href="/tools/sleep-cycle-calculator">מחזורי שינה</Link> מציע שעות שינה והשכמה לפי מחזורים של כ-90 דקות.
      </p>

      <h2>מקורות</h2>
      <ul className={styles.sources}>
        <li>
          <a href="https://en.wikipedia.org/wiki/Bed_size" rel="noopener" target="_blank" lang="en" dir="ltr">
            Wikipedia: Bed size (European, UK and US sizes)
          </a>
        </li>
        <li>
          <a href="https://www.d.co.il/priceList-25170/" rel="noopener" target="_blank" dir="ltr">
            דפי זהב: מחירון מזרנים (80×190, 90×190, 120×190, 140×190 ותוספת להגדלה)
          </a>
        </li>
        <li>
          <a href="https://www.hon.co.il/?p=26231" rel="noopener" target="_blank" dir="ltr">
            hon.co.il: מיטה זוגית וקינג סייז
          </a>
        </li>
      </ul>
      <p className={styles.reviewed}>
        המידות נבדקו מול המקורות ב-<time dateTime={BED_REVIEWED}>23.10.2026</time>. מידות מסחריות משתנות בין יצרנים.
      </p>
    </ToolLayout>
  )
}
