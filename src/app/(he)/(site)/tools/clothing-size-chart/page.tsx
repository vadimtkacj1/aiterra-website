import Link from 'next/link'
import type { ReactNode } from 'react'
import ToolLayout, { toolMetadata, type ToolFaqEntry } from '../../components/tools/ToolLayout'
import ClothingSizeChart from '../../components/tools/ClothingSizeChart'
import {
  CLOTHING_CHECKED,
  CLOTHING_CHECKED_LABEL,
  CLOTHING_PATH,
  braBands,
  braCups,
  clothingGroups,
  clothingSourceOrder,
  clothingSources,
  clothingTables,
  columnTitle,
  jeansRows,
} from '@/lib/clothing-sizes'
import styles from './page.module.css'

const TITLE = 'טבלת מידות בגדים: נשים, גברים וילדים'
const META_TITLE = 'טבלת מידות בגדים: נשים, גברים, ילדים, חזיות וג׳ינס'
const DESCRIPTION =
  'טבלת מידות בגדים לנשים, לגברים ולילדים: המרה בין מידות אירופה, איטליה, צרפת, בריטניה וארה״ב ואותיות XS עד XXL, מידות גוף בסנטימטרים, מידות ג׳ינס וחזיות.'

const Num = ({ children }: { children: ReactNode }) => (
  <span dir="ltr" className={styles.ltr}>
    {children}
  </span>
)

const groupHeading: Record<string, string> = {
  women: 'מידות בגדים לנשים',
  men: 'מידות בגדים לגברים',
  kids: 'מידות בגדים לילדים ולתינוקות',
}

const faq: ToolFaqEntry[] = [
  {
    id: 'clothing-faq-israel',
    question: 'איזו שיטת מידות בגדים נהוגה בישראל?',
    answer:
      'בחנויות ובאתרים בישראל נפוצות אותיות בינלאומיות, S, M, L, לצד מספרים אירופאיים, למשל 36 או 38 בבגדי נשים. בבגדים שמיובאים מחו״ל מופיעות גם מידות ארה״ב ובריטניה. לא מצאנו תקן ישראלי מחייב למידות בגדים, ולכן הטבלה כאן מבוססת על ההמרות המקובלות בין השיטות, ומותג שמפרסם טבלה משלו מדויק ממנה.',
  },
  {
    id: 'clothing-faq-brands',
    question: 'האם מידה M ב-Shein, ב-Zara וב-AliExpress זהה?',
    answer:
      'לא בהכרח. כל מותג חותך לפי תבנית משלו, ובמקרים רבים הגזרות בחנויות אונליין שמוכרות מאסיה צרות יותר מהגזרה האירופאית. הטבלה כאן כללית ואינה של מותג מסוים, ולא בדקנו מותגים אחד אחד. הדרך הבטוחה היא לקחת את מידות הגוף שלכם בסנטימטרים ולהשוות אותן לטבלת המידות שמופיעה בעמוד המוצר, ולא לסמוך על האות.',
  },
  {
    id: 'clothing-faq-between',
    question: 'מה עושים כשהמידות שלי בין שתי מידות?',
    answer:
      'ככלל בוחרים את המידה הגדולה, במיוחד בבדים שאינם נמתחים. אם החזה והמותן שלכם נופלים במידות שונות, מתאימים את החלק העליון לפי החזה והתחתון לפי המותן והירכיים. בבדים גמישים אפשר לרדת למידה הקטנה יותר לגזרה צמודה. המחשבון כאן מעגל כלפי מעלה למידה הראשונה שכל המידות שהזנתם נכנסות בה.',
  },
  {
    id: 'clothing-faq-measure',
    question: 'איך מודדים את הגוף בבית?',
    answer:
      'לוקחים סרט מדידה גמיש ומודדים על בגדים דקים או ישירות על הגוף. את החזה מודדים סביב החלק המלא ביותר, את המותן באזור הצר ביותר של הגו, בדרך כלל מעל הטבור, ואת הירכיים סביב החלק הרחב ביותר של הישבן. הסרט צמוד אך לא מהודק, והקרקע מקבילה לרצפה. מומלץ לבקש מאדם נוסף לעזור, ולחזור על המדידה פעמיים.',
  },
  {
    id: 'clothing-faq-jeans',
    question: 'איך ממירים מידת ג׳ינס כמו W30 למידה רגילה?',
    answer:
      'מידת W היא היקף המותן באינצ׳ים, ולכן W30 הוא כ-76 ס״מ. בבגדי נשים זה מקביל בערך למידה אירופאית 40 עד 42, ובבגדי גברים למידה 46. מידת L שמופיעה לצדה, למשל W30 L32, היא אורך הרגל הפנימית באינצ׳ים. חלק מהמותגים מייצרים בגדים רחבים מהמידה שכתובה עליהם, ולכן כדאי להשוות את המותן בס״מ לטבלה של המותג.',
  },
  {
    id: 'clothing-faq-bra',
    question: 'מה ההבדל בין מידות חזייה בישראל, בארה״ב ובבריטניה?',
    answer:
      'בישראל ובאירופה היקף הגב נמדד בסנטימטרים בקפיצות של 5, למשל 75, ואחריו אות הכוס, למשל 75C. בארה״ב ובבריטניה היקף הגב באינצ׳ים, למשל 34C. עד כוס D האותיות זהות, ואחריה הן נבדלות: כוס E אירופאית היא DD בבריטניה, וכוס F אירופאית היא E בבריטניה. בצרפת היקף הגב גבוה ב-15 מהמידה האירופאית.',
  },
]

const External = ({ id, children }: { id: keyof typeof clothingSources; children: ReactNode }) => (
  <a href={clothingSources[id].href} rel="noopener" target="_blank">
    {children}
  </a>
)

export const metadata = toolMetadata({ path: CLOTHING_PATH, metaTitle: META_TITLE, description: DESCRIPTION })

export default function ClothingSizeChartPage() {
  return (
    <ToolLayout
      path={CLOTHING_PATH}
      title={TITLE}
      metaTitle={META_TITLE}
      description={DESCRIPTION}
      lede="מידה 38 בחנות ישראלית היא בדרך כלל M, שווה למידה 10 בבריטניה, 6 בארה״ב, 40 בצרפת ו-42 באיטליה, ומתאימה להיקף חזה של כ-88 ס״מ, מותן 70 וירכיים 96. כאן בוחרים נשים, גברים או ילדים, מזינים מידה אחת או מידות גוף בסנטימטרים, ומקבלים את המידה בכל השיטות, כולל חזיות."
      chips={['נשים, גברים וילדים', 'אירופה, בריטניה, ארה״ב', 'חזיות וג׳ינס', 'בלי הרשמה']}
      tool={<ClothingSizeChart />}
      faq={faq}
      cta={{
        text: 'מוכרים בגדים אונליין? אנחנו בונים חנויות עם בחירת מידה ברורה ומחשבון מידות בעמוד המוצר, שמצמצמים החזרות.',
        label: 'לבניית חנות אינטרנטית',
        href: '/services/ecommerce',
      }}
    >
      <h2>איך קוראים את טבלאות המידות</h2>
      <p>
        אין שיטה אחת למידות בגדים. אירופה משתמשת במספרים זוגיים שמבוססים על היקף החזה, בריטניה וארה״ב במספרים
        אחרים לאותה גזרה, ובמותגים רבים יש גם אותיות, XS עד XXL. איטליה וצרפת משתמשות במספרים משלהן, שמוזזים מהמידה האירופאית: בצרפת ב-2 מעל, באיטליה ב-4 מעל (
        <External id="wikiClothing">הסבר על שיטות המידות</External>). התקן האירופי{' '}
        <External id="wikiEn13402">EN 13402</External> מגדיר מידות לפי מידות גוף בסנטימטרים ולא לפי מספרים, וגם הוא
        אינו חובה על מותגים.
      </p>
      <p>
        לכן הטבלאות מראות שתי שכבות: ההמרה בין השיטות, והיקפי הגוף שמתאימים למידה. אם מותג מפרסם טבלה משלו, היא קובעת.
      </p>

      {clothingGroups.map((group) => {
        const rows = clothingTables[group.id]
        return (
          <section key={group.id} aria-labelledby={`clothing-table-${group.id}`}>
            <h2 id={`clothing-table-${group.id}`}>{groupHeading[group.id]}</h2>
            <div className={styles.tableWrap}>
              <table className={styles.table}>
                <caption>
                  המרת מידות והיקפי גוף בסנטימטרים. נבדק לאחרונה:{' '}
                  <time dateTime={CLOTHING_CHECKED}>{CLOTHING_CHECKED_LABEL}</time>
                </caption>
                <thead>
                  <tr>
                    {group.systems.map((system) => (
                      <th key={system} scope="col">
                        {columnTitle(group.id, system)}
                      </th>
                    ))}
                    <th scope="col">חזה</th>
                    <th scope="col">מותן</th>
                    <th scope="col">ירכיים</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row) => (
                    <tr key={`${group.id}-${row.labels.eu}`}>
                      {group.systems.map((system, index) =>
                        index === 0 ? (
                          <th key={system} scope="row">
                            <Num>{row.labels[system]}</Num>
                          </th>
                        ) : (
                          <td key={system}>
                            <Num>{row.labels[system]}</Num>
                          </td>
                        ),
                      )}
                      <td>
                        <Num>{row.chest}</Num>
                      </td>
                      <td>
                        <Num>{row.waist}</Num>
                      </td>
                      <td>
                        <Num>{row.hips}</Num>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )
      })}
      <p>
        בטבלת הילדים המידה היא הגובה בסנטימטרים, וגיל הוא הערכה בלבד: ילדים בני אותו גיל שונים מאוד בגובה, ולכן בוחרים
        לפי הגובה ולא לפי הגיל שכתוב על התווית.
      </p>

      <h2>מידות ג׳ינס: מ-W באינצ׳ים לסנטימטרים</h2>
      <p>
        מידת W בג׳ינס היא היקף המותן באינצ׳ים, כל אינץ׳ הוא 2.54 ס״מ. בג׳ינס נשים ייתכן שהמידה שכתובה קטנה
        מהמותן בפועל, ולכן כדאי למדוד גם את הבגד עצמו.
      </p>
      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <caption>מידת ג׳ינס W והמידה האירופאית הקרובה</caption>
          <thead>
            <tr>
              <th scope="col">W (אינצ׳ים)</th>
              <th scope="col">מותן (ס״מ)</th>
              <th scope="col">נשים (EU)</th>
              <th scope="col">גברים (EU)</th>
            </tr>
          </thead>
          <tbody>
            {jeansRows.map((row) => (
              <tr key={row.inch}>
                <th scope="row">
                  <Num>W{row.inch}</Num>
                </th>
                <td>
                  <Num>{row.cm}</Num>
                </td>
                <td>
                  <Num>{row.women}</Num>
                </td>
                <td>
                  <Num>{row.men}</Num>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2>מידות חזיות: ישראל, אירופה, ארה״ב ובריטניה</h2>
      <p>
        מידת חזייה בנויה משני חלקים: היקף הגב והכוס. הכוס נקבעת לפי ההפרש בין היקף החזה בנקודה המלאה להיקף שמתחת
        לחזה, ו-<External id="wikiBra">כל שני סנטימטרים הפרש הם כוס אחת</External>. בישראל ובאירופה הגב בסנטימטרים,
        בארה״ב ובבריטניה באינצ׳ים, ובצרפת הוא גבוה ב-15 מהאירופאי.
      </p>
      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <caption>היקף הגב</caption>
          <thead>
            <tr>
              <th scope="col">ישראל ואירופה</th>
              <th scope="col">ארה״ב ובריטניה</th>
              <th scope="col">צרפת</th>
              <th scope="col">היקף מתחת לחזה (ס״מ)</th>
            </tr>
          </thead>
          <tbody>
            {braBands.map((band) => (
              <tr key={band.eu}>
                <th scope="row">
                  <Num>{band.eu}</Num>
                </th>
                <td>
                  <Num>{band.us}</Num>
                </td>
                <td>
                  <Num>{band.fr}</Num>
                </td>
                <td>
                  <Num>
                    {band.underbust[0]}-{band.underbust[1]}
                  </Num>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <caption>כוס החזייה</caption>
          <thead>
            <tr>
              <th scope="col">ישראל ואירופה</th>
              <th scope="col">בריטניה</th>
              <th scope="col">ארה״ב</th>
              <th scope="col">הפרש היקפים (ס״מ)</th>
            </tr>
          </thead>
          <tbody>
            {braCups.map((cup) => (
              <tr key={cup.eu}>
                <th scope="row">
                  <Num>{cup.eu}</Num>
                </th>
                <td>
                  <Num>{cup.uk}</Num>
                </td>
                <td>
                  <Num>{cup.us}</Num>
                </td>
                <td>
                  <Num>{cup.diff}</Num>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p>
        הטבלה מראה שיטת חישוב אחת בלבד. מותגים רבים חותכים אחרת, ובחזיות שמות הכוס שונים בין מותגים, ולכן במדידה
        ראשונה כדאי להתייעץ במעצבת בחנות.
      </p>

      <h2>איך מודדים</h2>
      <ol>
        <li>עומדים זקוף ורגליים צמודות, עם סרט מדידה גמיש. מודדים על בגדים דקים.</li>
        <li>חזה: סביב החלק המלא ביותר, בגובה החזה, בלי למתוח את הסרט.</li>
        <li>מותן: באזור הצר ביותר של הגו, בדרך כלל מעל הטבור.</li>
        <li>ירכיים: סביב החלק הרחב ביותר של הישבן.</li>
        <li>לחזייה מודדים גם את ההיקף ישירות מתחת לחזה, בנשימה רגילה.</li>
        <li>רושמים את המספרים בסנטימטרים ומשווים לטבלה של המותג.</li>
      </ol>

      <h2>Shein, Zara, AliExpress ומותגים אחרים</h2>
      <p>
        שאלה נפוצה היא איזו מידה להזמין מאתרים כמו Shein, Zara ו-AliExpress. התשובה הכנה: אין המרה שמתאימה לכל
        המותגים, ולא בדקנו מותגים אחד אחד. אתרי מכירה שמוכרים בגדים מאסיה מפרסמים בדרך כלל טבלת מידות בסנטימטרים בכל עמוד
        מוצר, והיא צרה לא פעם מהטבלה האירופאית. הכלל המעשי: משווים את היקף החזה והמותן לטבלה בעמוד המוצר, בוחרים לפי
        הסנטימטרים ולא לפי האות, וכשהמידות בין שתי מידות הולכים על הגדולה. ביקורות קונים עם תמונות מועילות לבדיקה
        נוספת, וכדאי לבדוק את מדיניות ההחזרה לפני הקנייה.
      </p>

      <h2>עוד כלים למידות</h2>
      <p>
        מחפשים מידות נעליים? <Link href="/tools/shoe-size-chart">טבלת מידות נעליים</Link> ממירה אורך כף רגל לישראל,
        אירופה, ארה״ב ובריטניה. למתנה בצורת תכשיט תעזור{' '}
        <Link href="/tools/ring-size-converter">טבלת מידות טבעת</Link>.
      </p>

      <h2>מקורות</h2>
      <ul className={styles.sources}>
        {clothingSourceOrder.map((id) => (
          <li key={id}>
            <a href={clothingSources[id].href} rel="noopener" target="_blank" lang="en" dir="ltr">
              {clothingSources[id].label}
            </a>
            <span> (מקור משני, לא רשמי)</span>
          </li>
        ))}
      </ul>
      <p className={styles.reviewed}>
        הטבלאות הן המרות מקובלות ולא טבלה של מותג, ואין להן תוקף מחייב. היקפי הגוף מעוגלים. נבדק מול המקורות ב-
        <time dateTime={CLOTHING_CHECKED}>{CLOTHING_CHECKED_LABEL}</time>.
      </p>
    </ToolLayout>
  )
}
