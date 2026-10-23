import type { ReactNode } from 'react'
import ToolLayout, { toolMetadata, type ToolFaqEntry } from '../../components/tools/ToolLayout'
import ShoeSizeConverter from '../../components/tools/ShoeSizeConverter'
import {
  SHOES_CHECKED,
  SHOES_CHECKED_LABEL,
  shoeGroups,
  shoeSourceOrder,
  shoeSources,
  shoeTables,
} from '@/lib/shoe-sizes'
import styles from './page.module.css'

const PATH = '/tools/shoe-size-chart'
const TITLE = 'טבלת מידות נעליים: ישראל, אירופה, ארה״ב ובריטניה'
const META_TITLE = 'טבלת מידות נעליים: ישראל, אירופה, ארה״ב, בריטניה'
const DESCRIPTION =
  'טבלת מידות נעליים לגברים, נשים וילדים: ישראל (EU), ארה״ב ובריטניה. מזינים אורך כף רגל בסנטימטרים ומקבלים את המידה, לפי טבלאות Nike.'

const Num = ({ children }: { children: ReactNode }) => (
  <span dir="ltr" className={styles.ltr}>
    {children}
  </span>
)

const External = ({ id, children }: { id: keyof typeof shoeSources; children: ReactNode }) => (
  <a href={shoeSources[id].href} rel="noopener" target="_blank">
    {children}
  </a>
)

const faq: ToolFaqEntry[] = [
  {
    id: 'shoe-faq-israel',
    question: 'איזו שיטת מידות נעליים משתמשים בה בישראל?',
    answer:
      'בישראל נהוגות מידות אירופאיות, ולכן מידה 42 בחנות ישראלית היא מידה 42 באירופה. HUGO BOSS, למשל, מונה את ישראל ברשימת המדינות שמשתמשות במידות אירופאיות. לא מצאנו תקן ישראלי נפרד למידות נעליים. מותגי ספורט מוסיפים על התווית גם מידות ארה״ב ובריטניה.',
  },
  {
    id: 'shoe-faq-cm',
    question: 'איך ממירים אורך כף רגל בסנטימטרים למידת נעליים?',
    answer:
      'מודדים את כף הרגל הארוכה יותר, מהעקב ועד קצה הבוהן הארוכה, ומחפשים בטבלה את המידה הראשונה שאורך כף הרגל שלה גדול או שווה לאורך שלכם. לפי הנוסחה הכללית של השיטה האירופאית, מידה אירופאית היא בערך פעם וחצי האורך בסנטימטרים, ועוד שתיים. זו הערכה בלבד, וטבלת המותג מדויקת ממנה.',
  },
  {
    id: 'shoe-faq-between',
    question: 'מה עושים כשאורך כף הרגל נופל בין שתי מידות?',
    answer:
      'Nike ממליצה לבחור במידה הגדולה יותר. גם המחשבון כאן מעגל למעלה למידה הראשונה שמתאימה לאורך שהזנתם, ומראה מתחת לתוצאה את אורך כף הרגל שהמידה הזו מתאימה לו, כדי שתראו כמה מרווח נשאר לכם. אם הרגל רחבה, שווה לבדוק גם דגם ברוחב מורחב, שמותגים כמו Nike מציעים בנפרד.',
  },
  {
    id: 'shoe-faq-brand',
    question: 'למה אותה מידה יוצאת שונה בין מותגים?',
    answer:
      'מידה באירופה מתארת את אורך הקליבה, התבנית שעליה בונים את הנעל, ולא את כף הרגל, והיא ארוכה מכף הרגל בכ-1.3 עד 1.7 סנטימטר. כל מותג בוחר תבנית אחרת, ולכן המרות בין מערכות הן קירוב. Nike מציינת בעצמה שהמספר בסנטימטרים על קופסת הנעליים שונה מאורך כף הרגל. לכן כדאי להשתמש בטבלה של המותג שקונים ממנו.',
  },
  {
    id: 'shoe-faq-mondopoint',
    question: 'מה זו שיטת מונדופוינט?',
    answer:
      'מונדופוינט היא שיטה בינלאומית שמגדירה את מידת הנעל לפי מידות כף הרגל שהיא מיועדת לה, באורך וברוחב במילימטרים. התקן העדכני הוא ISO 9407:2019. השיטה נפוצה בנעלי ספורט, בנעלי סקי ובצבא. ביפן ובקוריאה המספר על הנעל הוא אורך כף הרגל בסנטימטרים, וזה שונה מהמספר האירופאי.',
  },
  {
    id: 'shoe-faq-measure',
    question: 'איך מודדים נכון את כף הרגל בבית?',
    answer:
      'מדביקים דף על משטח קשה, עומדים עליו עם הרגל במלוא משקלה, ומסמנים בעט ישר את קצה הבוהן הארוכה ואת הנקודה הכי אחורית בעקב. בודקים בסרגל את המרחק בין הסימנים, וחוזרים על המדידה בשתי הרגליים כי הן לא תמיד שוות. לוקחים את המספר הגדול. Nike מציינת את אותה שיטה בהנחיות שלה.',
  },
]

export const metadata = toolMetadata({ path: PATH, metaTitle: META_TITLE, description: DESCRIPTION })

export default function ShoeSizeChartPage() {
  return (
    <ToolLayout
      path={PATH}
      title={TITLE}
      metaTitle={META_TITLE}
      description={DESCRIPTION}
      lede="בישראל נהוגות מידות אירופאיות, ולכן מידה 42 בחנות ישראלית היא מידה 42 באירופה, שלפי טבלת Nike מתאימה לכף רגל באורך 25.9 ס״מ, מידה 8.5 לגברים בארה״ב ומידה 7.5 בבריטניה. כאן מזינים אורך כף רגל בסנטימטרים ומקבלים את המידה בכל השיטות, לגברים, לנשים ולילדים."
      chips={['לפי אורך כף הרגל', 'גברים, נשים וילדים', 'טבלאות Nike', 'בלי הרשמה']}
      tool={<ShoeSizeConverter />}
      faq={faq}
      cta={{
        text: 'מוכרים נעליים או בגדים אונליין? אנחנו בונים חנויות ומערכות מותאמות עם בחירת מידה שמצמצמת החזרות.',
        label: 'לפיתוח אתרים ומערכות',
        href: '/services/development',
      }}
    >
      <h2>איך עובדת המרת מידות נעליים</h2>
      <p>
        שלוש שיטות מקובלות בנעליים: אירופה, ארה״ב ובריטניה. השיטה האירופאית נמדדת ב״נקודות פריז״, כל אחת שני שלישים של
        סנטימטר, והשיטות האמריקאית והבריטית נמדדות ב״גרעיני שעורה״, כל אחד שליש אינץ׳. בנוסף יש שיטת מונדופוינט, שהיא
        פשוט אורך כף הרגל במילימטרים, ושהתקן{' '}
        <External id="iso9407">ISO 9407:2019</External> מגדיר.{' '}
        <External id="wikipedia">ההסבר המפורט על כל אחת מהשיטות</External> מופיע בוויקיפדיה.
      </p>
      <p>
        כדי להמיר בלי לטעות, התחילו ממדידה של כף הרגל, ולא ממספר שמצאתם על נעל ישנה. אחר כך חפשו את אורך כף הרגל
        בטבלה של המותג. הטבלאות כאן לקוחות מ-Nike, והמחשבון משתמש באותם נתונים.
      </p>

      {shoeGroups.map((group) => {
        const rows = shoeTables[group.id]
        return (
          <section key={group.id} aria-labelledby={`shoe-table-${group.id}`}>
            <h2 id={`shoe-table-${group.id}`}>
              {group.id === 'kids' ? 'מידות נעליים לילדים ולפעוטות' : `מידות נעליים ל${group.label}`}
            </h2>
            <div className={styles.tableWrap}>
              <table className={styles.table}>
                <caption>
                  <a href={shoeSources[group.source].href} rel="noopener" target="_blank" lang="en" dir="ltr">
                    {shoeSources[group.source].label}
                  </a>
                  . נבדק לאחרונה: <time dateTime={SHOES_CHECKED}>{SHOES_CHECKED_LABEL}</time>
                </caption>
                <thead>
                  <tr>
                    <th scope="col">ישראל ואירופה</th>
                    <th scope="col">{group.usLabel}</th>
                    {group.usAltLabel ? <th scope="col">{group.usAltLabel}</th> : null}
                    <th scope="col">בריטניה</th>
                    <th scope="col">אורך כף רגל (ס״מ)</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((size) => (
                    <tr key={`${group.id}-${size.us}-${size.eu}`}>
                      <th scope="row">
                        <Num>{size.eu}</Num>
                      </th>
                      <td>
                        <Num>{size.us}</Num>
                      </td>
                      {group.usAltLabel ? (
                        <td>
                          <Num>{size.usAlt}</Num>
                        </td>
                      ) : null}
                      <td>
                        <Num>{size.uk}</Num>
                      </td>
                      <td>
                        <Num>{size.foot}</Num>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )
      })}

      <h2>מידות בין מותגים משתנות</h2>
      <p>
        הטבלאות מראות את הגדלים של Nike בלבד. מותגים אחרים, כולל Adidas, מפרסמים טבלאות משלהם, ולא בדקנו אותן. לפי
        Nike עצמה, המספר בסנטימטרים שמודפס על קופסת הנעליים שונה מאורך כף הרגל, ולכן אל תחפשו את אורך הרגל לפי
        הקופסה. כשקונים אונליין, בדקו את טבלת המידות של המותג ואת מדיניות ההחלפה.
      </p>

      <h2>איך מודדים את כף הרגל</h2>
      <ol>
        <li>מדביקים דף נייר למשטח קשה ושטוח, כדי שלא יזוז.</li>
        <li>עומדים על הדף, ברגליים ברוחב הכתפיים ובמשקל שווה.</li>
        <li>מסמנים בעט שמוחזק ישר כלפי מטה את קצה הבוהן ואת החלק הכי אחורי של העקב.</li>
        <li>יורדים מהדף, ומודדים בסרגל את המרחק בין שני הסימנים.</li>
        <li>חוזרים על המדידה ברגל השנייה, ובוחרים באורך הגדול מבין השניים.</li>
      </ol>
      <p>זו השיטה ש-<External id="nikeMen">Nike</External> מציגה בעמוד המידות שלה.</p>

      <h2>מקורות</h2>
      <ul className={styles.sources}>
        {shoeSourceOrder.map((id) => (
          <li key={id}>
            <a href={shoeSources[id].href} rel="noopener" target="_blank" lang="en" dir="ltr">
              {shoeSources[id].label}
            </a>
            {shoeSources[id].official ? null : <span> (מקור משני, לא רשמי)</span>}
          </li>
        ))}
      </ul>
      <p className={styles.reviewed}>
        אורך כף הרגל בסנטימטרים מחושב מטבלת האינצ׳ים של Nike, ומעוגל לעשירית. נבדק מול המקורות ב-
        <time dateTime={SHOES_CHECKED}>{SHOES_CHECKED_LABEL}</time>.
      </p>
    </ToolLayout>
  )
}
