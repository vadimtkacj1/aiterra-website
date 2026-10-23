import Link from 'next/link'
import ToolLayout, { toolMetadata, type ToolFaqEntry } from '../../components/tools/ToolLayout'
import MinimumWageCalculator from '../../components/tools/MinimumWageCalculator'
import {
  NEXT_UPDATE_TEXT,
  adultTable,
  calculateMinimumWage,
  defaultInput,
  formatMoney,
  scopeTable,
  youthTable,
} from '@/lib/minimum-wage'
import styles from './page.module.css'

const PATH = '/tools/minimum-wage-2026'
const TITLE = 'שכר מינימום 2026'
const META_TITLE = 'שכר מינימום 2026: לחודש, לשעה ולנוער, עם מחשבון'
const DESCRIPTION =
  'שכר מינימום 2026 מ-1 באפריל: 6,443.85 ₪ לחודש ו-35.40 ₪ לשעה. מחשבון לפי גיל, היקף משרה ושעות, ובדיקה אם השכר ששולם עומד במינימום.'

const adultRows = adultTable()
const youthCurrent = youthTable('2026')
const youthPrevious = youthTable('2025')
const scopeRows = scopeTable()

const example = calculateMinimumWage({ ...defaultInput, basis: 'hourly', hours: '120', paid: '34' })
const backPay = calculateMinimumWage({ ...defaultInput, period: '2025', basis: 'hourly', hours: '120', paid: '34' })
const exampleMinimum = example.kind === 'result' ? example.minimum : 0
const exampleTotal = example.kind === 'result' && example.quantity ? example.quantity.total : 0
const exampleGap = example.kind === 'result' && example.check?.totalGap ? example.check.totalGap : 0
const backPayMinimum = backPay.kind === 'result' ? backPay.minimum : 0
const backPayTotal = backPay.kind === 'result' && backPay.quantity ? backPay.quantity.total : 0
const backPayGap = backPay.kind === 'result' && backPay.check?.totalGap ? backPay.check.totalGap : 0

const sources = [
  {
    href: 'https://he.wikisource.org/wiki/%D7%97%D7%95%D7%A7_%D7%A9%D7%9B%D7%A8_%D7%9E%D7%99%D7%A0%D7%99%D7%9E%D7%95%D7%9D',
    label: 'חוק שכר מינימום, התשמ״ז-1987: סעיפים 1, 2, 3, 6, 7, 8, 12 ו-14 (ויקיטקסט)',
  },
  {
    href: 'https://he.wikisource.org/wiki/%D7%AA%D7%A7%D7%A0%D7%95%D7%AA_%D7%A9%D7%9B%D7%A8_%D7%9E%D7%99%D7%A0%D7%99%D7%9E%D7%95%D7%9D_(%D7%A0%D7%95%D7%A2%D7%A8_%D7%A2%D7%95%D7%91%D7%93_%D7%95%D7%97%D7%A0%D7%99%D7%9B%D7%99%D7%9D)',
    label: 'תקנות שכר מינימום (נוער עובד וחניכים), התשמ״ח-1987: תקנות 1, 4 עד 7 (ויקיטקסט)',
  },
  {
    href: 'https://he.wikisource.org/wiki/%D7%AA%D7%A7%D7%A0%D7%95%D7%AA_%D7%A9%D7%9B%D7%A8_%D7%9E%D7%99%D7%A0%D7%99%D7%9E%D7%95%D7%9D_(%D7%94%D7%95%D7%A8%D7%90%D7%95%D7%AA_%D7%9E%D7%A9%D7%9C%D7%99%D7%9E%D7%95%D7%AA_%D7%9C%D7%A2%D7%A0%D7%99%D7%9F_%D7%97%D7%99%D7%A9%D7%95%D7%91_%D7%A9%D7%9B%D7%A8_%D7%9E%D7%99%D7%A0%D7%99%D7%9E%D7%95%D7%9D_%D7%99%D7%95%D7%9E%D7%99)',
    label: 'תקנות שכר מינימום (הוראות משלימות לענין חישוב שכר מינימום יומי), התשנ״ט-1998 (ויקיטקסט)',
  },
  {
    href: 'https://www.btl.gov.il/Mediniyut/GeneralData/Pages/%D7%A9%D7%9B%D7%A8%20%D7%9E%D7%99%D7%A0%D7%99%D7%9E%D7%95%D7%9D.aspx',
    label: 'הביטוח הלאומי: שכר מינימום, הסכומים מ-1.4.2026 ומ-1.4.2025',
  },
  {
    href: 'https://www.gov.il/he/pages/minimum-wage?chapterIndex=2',
    label: 'משרד העבודה: שכר מינימום לעובדים בוגרים, כולל החישוב לפי 182 שעות',
  },
  {
    href: 'https://www.gov.il/he/pages/minimum-wage?chapterIndex=3',
    label: 'משרד העבודה: שכר מינימום לבני נוער',
  },
  {
    href: 'https://www.gov.il/he/pages/minimum-wage?chapterIndex=4',
    label: 'משרד העבודה: שכר מינימום לעובדים עם מוגבלות, בעלי יכולת עבודה מופחתת',
  },
]

const faq: ToolFaqEntry[] = [
  {
    id: 'mw-faq-2026',
    question: 'כמה זה שכר מינימום 2026?',
    answer:
      'מ-1 באפריל 2026 שכר המינימום לעובד מגיל 18 הוא 6,443.85 ₪ לחודש במשרה מלאה, 35.40 ₪ לשעה, 297.40 ₪ ליום בשבוע עבודה של 5 ימים ו-257.75 ₪ ליום בשבוע של 6 ימים. עד 31 במרץ 2026 הסכום החודשי היה 6,247.67 ₪. אלה הסכומים שמפרסמים הביטוח הלאומי ומשרד העבודה. בהסכם קיבוצי, בצו הרחבה בענף או בחוזה אישי השכר יכול להיות גבוה יותר.',
  },
  {
    id: 'mw-faq-hourly',
    question: 'מה שכר המינימום לשעה ב-2026?',
    answer:
      '35.40 ₪ לשעה לעובד מגיל 18, מ-1 באפריל 2026. החוק מחלק את השכר החודשי ב-186 שעות, וכך יוצא 34.64 ₪, אבל צו ההרחבה לקיצור שבוע העבודה, שבתוקף מ-1 באפריל 2018, קובע חישוב לפי 182 שעות בחודש. משרד העבודה מציג לכן 35.40 ₪ כשכר השעתי. לבני נוער השכר לשעה נמוך יותר, והוא החלק ה-173 של השכר החודשי שלהם.',
  },
  {
    id: 'mw-faq-youth',
    question: 'מה שכר המינימום לנוער בגיל 16 ו-17?',
    answer:
      'לפי תקנות שכר מינימום לנוער, עובד בן 17 מקבל לפחות 83% משכר המינימום, בן 16 לפחות 75%, ומתחת לגיל 16 לפחות 70%. מ-1 באפריל 2026 זה 5,348.39 ₪ לחודש ו-30.91 ₪ לשעה בגיל 17, ו-4,832.88 ₪ לחודש ו-27.93 ₪ לשעה בגיל 16. משרה מלאה לנוער היא 40 שעות בשבוע, ובמשרה חלקית השכר יחסי.',
  },
  {
    id: 'mw-faq-next',
    question: 'מתי שכר המינימום יעלה שוב?',
    answer:
      'לפי החוק, שכר המינימום הוא 47.5% מהשכר הממוצע כפי שהוא ב-1 באפריל של כל שנה, ושר העבודה מפרסם ברשומות את הסכום המעודכן לאותו יום. לכן העדכון הבא צפוי ב-1 באפריל 2027. החוק גם קובע שהסכום לא יפחת בשום מקרה בגלל העדכון. כשהסכום החדש יפורסם, המחשבון והטבלאות בעמוד יעודכנו.',
  },
  {
    id: 'mw-faq-part-time',
    question: 'איך מחשבים שכר מינימום במשרה חלקית?',
    answer:
      'לפי סעיף 2(ב) לחוק, עובד במשרה חלקית זכאי לשכר מינימום יחסי להיקף המשרה. בחצי משרה שכר המינימום החודשי הוא 3,221.92 ₪, וב-75% משרה 4,832.88 ₪. עובד שמקבל שכר לשעה בודק פשוט את התעריף: כל שעה צריכה להיות משולמת ב-35.40 ₪ לפחות. במחשבון בוחרים שכר חודשי ומקלידים את היקף המשרה, או שכר לשעה ומקלידים את מספר השעות.',
  },
  {
    id: 'mw-faq-underpaid',
    question: 'מה עושים כשהשכר נמוך משכר המינימום?',
    answer:
      'הזכות לשכר מינימום לא ניתנת לוויתור, גם לא בהסכמה בכתב. אפשר לפנות למעסיק עם החישוב ולבקש הפרשים. אם הוא לא משלם, אפשר להגיש תביעה לבית הדין לעבודה, בעצמכם או דרך ארגון העובדים, ובית הדין רשאי לפסוק פיצויי הלנת שכר מוגדלים. מעסיק שלא שילם שכר מינימום עובר עבירה פלילית, ומשרד העבודה יכול גם להטיל עליו עיצום כספי.',
  },
]

export const metadata = toolMetadata({ path: PATH, metaTitle: META_TITLE, description: DESCRIPTION })

export default function MinimumWagePage() {
  return (
    <ToolLayout
      path={PATH}
      title={TITLE}
      metaTitle={META_TITLE}
      description={DESCRIPTION}
      lede="מ-1 באפריל 2026 שכר המינימום בישראל הוא 6,443.85 ₪ לחודש במשרה מלאה ו-35.40 ₪ לשעה. לבני נוער ולחניכים הוא 60% עד 83% מהסכום הזה, ובמחשבון בודקים לפי גיל, היקף משרה ושעות אם השכר עומד במינימום."
      chips={['הסכומים מ-1 באפריל 2026', 'מבוגרים, נוער וחניכים', 'בדיקת שכר ששולם']}
      tool={<MinimumWageCalculator />}
      faq={faq}
      cta={{
        text: 'חישובי שכר, חופשות ושעות עבודה יכולים לרוץ אוטומטית ב-CRM של העסק, בלי טבלאות ידניות.',
        label: 'אוטומציה לעסקים',
        href: '/services/automation',
      }}
    >
      <h2>שכר מינימום 2026: כל הסכומים</h2>
      <p>
        שכר המינימום נקבע בחוק שכר מינימום, התשמ״ז-1987: 47.5% מהשכר הממוצע כפי שהוא ב-1 באפריל של כל שנה. שר
        העבודה מפרסם ברשומות את הסכום המעודכן, והביטוח הלאומי ומשרד העבודה מפרסמים ממנו את הסכומים לשעה וליום. הסכומים
        שבטבלה חלים על עובדים מגיל 18. העדכון הבא צפוי ב-{NEXT_UPDATE_TEXT}.
      </p>
      <div className={styles.tableWrap} role="region" aria-label="שכר מינימום לעובדים מגיל 18" tabIndex={0}>
        <table className={styles.table}>
          <caption>שכר מינימום לעובדים מגיל 18</caption>
          <thead>
            <tr>
              <th scope="col">סוג השכר</th>
              <th scope="col">מ-1.4.2026</th>
              <th scope="col">1.4.2025 עד 31.3.2026</th>
            </tr>
          </thead>
          <tbody>
            {adultRows.map((row) => (
              <tr key={row.label}>
                <th scope="row">{row.label}</th>
                <td>{formatMoney(row.current)}</td>
                <td>{formatMoney(row.previous)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p>
        העמודה האחרונה משמשת לבדיקת שכר שכבר שולם: על עבודה עד 31 במרץ 2026 חל הסכום הקודם, ועל עבודה מ-1 באפריל
        2026 הסכום החדש. במחשבון בוחרים את התקופה בשדה הראשון.
      </p>

      <h2>שכר מינימום לשעה: 35.40 ₪ או 34.64 ₪?</h2>
      <p>
        שני המספרים מופיעים באתר הביטוח הלאומי. החוק מגדיר שכר מינימום לשעה כחלק ה-186 של השכר החודשי, ומכאן 34.64
        ₪. צו ההרחבה בדבר קיצור שבוע העבודה במשק, שנכנס לתוקף ב-1 באפריל 2018, קובע שהשכר לשעה יחושב לפי 182 שעות
        בחודש, ולכן משרד העבודה מציג 35.40 ₪ כשכר השעתי הנוכחי. זה גם הסכום שהמחשבון בודק מולו.
      </p>
      <p>
        כדי לדעת כמה שעות עבדתם בחודש, אפשר לסכם את המשמרות ב<Link href="/tools/work-hours-calculator">מחשבון שעות
        העבודה</Link>, ואז להקליד את הסך במחשבון שלמעלה.
      </p>

      <h2>שכר מינימום לנוער ולחניכים לפי גיל</h2>
      <p>
        עובד שעוד לא מלאו לו 18 זכאי לאחוז משכר המינימום לפי תקנות שכר מינימום (נוער עובד וחניכים): 83% מגיל 17,
        75% בגיל 16 ו-70% מתחת לגיל 16. חניך לפי חוק החניכות, שלומד לפחות יומיים בשבוע, זכאי ל-60%. משרה מלאה לנער
        היא 40 שעות בשבוע, ושכר המינימום לשעה הוא החלק ה-173 של השכר החודשי שלו.
      </p>
      <div className={styles.tableWrap} role="region" aria-label="שכר מינימום לנוער ולחניכים" tabIndex={0}>
        <table className={styles.table}>
          <caption>שכר מינימום לנוער ולחניכים, משרה מלאה</caption>
          <thead>
            <tr>
              <th scope="col">גיל</th>
              <th scope="col">אחוז</th>
              <th scope="col">לחודש מ-1.4.2026</th>
              <th scope="col">לשעה מ-1.4.2026</th>
              <th scope="col">לחודש עד 31.3.2026</th>
            </tr>
          </thead>
          <tbody>
            {youthCurrent.map((row, index) => (
              <tr key={row.id}>
                <th scope="row">{row.label}</th>
                <td>{row.percent}%</td>
                <td>{formatMoney(row.monthly)}</td>
                <td>{formatMoney(row.hourly)}</td>
                <td>{formatMoney(youthPrevious[index].monthly)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p>
        באתר משרד העבודה מופיע לגיל 17 הסכום 5,349.39 ₪. 83% מ-6,443.85 ₪ הם 5,348.3955 ₪, ומשרד העבודה חותך את שאר
        הסכומים בטבלה שלו לאגורות (למשל 4,832.88 ₪ במקום 4,832.8875 ₪), ולכן כאן מופיע 5,348.39 ₪. גם השכר לשעה שמשרד
        העבודה מפרסם לגיל 17, 30.91 ₪, מתאים לסכום הזה. הסכומים לתקופה שעד 31 במרץ 2026 חושבו באותה שיטה מהסכום
        שהיה אז, 6,247.67 ₪.
      </p>
      <p>
        אצל נוער וחניכים תוספת קבועה לא נספרת בבדיקת שכר המינימום (תקנה 7). שכר מינימום יומי לנוער לא פורסם, ולכן
        המחשבון מציג לנוער שכר חודשי ושכר לשעה בלבד.
      </p>

      <h2>משרה חלקית ושכר יומי</h2>
      <p>
        עובד במשרה חלקית זכאי לשכר מינימום יחסי להיקף המשרה (סעיף 2(ב)). כך זה נראה לעובד מגיל 18:
      </p>
      <div className={styles.tableWrap} role="region" aria-label="שכר מינימום לפי היקף משרה" tabIndex={0}>
        <table className={styles.table}>
          <caption>שכר מינימום חודשי לפי היקף משרה, מגיל 18</caption>
          <thead>
            <tr>
              <th scope="col">היקף משרה</th>
              <th scope="col">מ-1.4.2026</th>
              <th scope="col">עד 31.3.2026</th>
            </tr>
          </thead>
          <tbody>
            {scopeRows.map((row) => (
              <tr key={row.scope}>
                <th scope="row">{row.scope}%</th>
                <td>{formatMoney(row.current)}</td>
                <td>{formatMoney(row.previous)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p>
        שכר מינימום יומי הוא החלק ה-25 של השכר החודשי למי שעובד 6 ימים בשבוע, והחלק ה-21⅔ למי שעובד 5 ימים
        (סעיף 1). לפי תקנות משנת 1998, השכר היומי לא יפחת ממה שהעובד היה מקבל לפי שכר המינימום לשעה. עובד שנעדר
        בלי תשלום זכאי לשכר מינימום יחסי לזמן שעבד, אבל אם מגיע לו תשלום על ההיעדרות, למשל ימי חופשה או מחלה,
        התשלום הוא לפי ההסדר שחל עליו (סעיף 2(ג)). את ימי העבודה בחודש אפשר לספור ב
        <Link href="/tools/work-days-calculator">מחשבון ימי העבודה</Link>.
      </p>

      <h2>אילו רכיבי שכר נספרים</h2>
      <p>
        בודקים את השכר בעד יום עבודה רגיל (סעיף 3). לכן תשלום על שעות נוספות לא משלים את שכר המינימום. לפי סעיף 3(ב):
      </p>
      <ul>
        <li>
          <strong>נספרים:</strong> שכר יסוד או שכר משולב, תוספת יוקר אם היא לא כלולה בשכר, ותוספת קבועה שמשולמת בגלל
          העבודה.
        </li>
        <li>
          <strong>לא נספרים:</strong> תוספת משפחה, תוספת ותק, תוספת משמרות, פרמיות, משכורת 13, מענקים שנתיים והחזר
          הוצאות, כולל כלכלה, אש״ל ונסיעות.
        </li>
      </ul>

      <h2>דוגמה: בדיקת שכר של עובד שעתי</h2>
      <p>
        עובדת בת 19 עבדה במאי 2026 120 שעות וקיבלה 34 ₪ לשעה. שכר המינימום לשעה הוא {formatMoney(exampleMinimum)},
        ולכן על 120 שעות מגיעים לה לפחות {formatMoney(exampleTotal)}. היא קיבלה 4,080.00 ₪, וחסרים{' '}
        {formatMoney(exampleGap)}.
      </p>
      <p>
        אם אותן 120 שעות היו במרץ 2026, חל הסכום הקודם, {formatMoney(backPayMinimum)} לשעה. אז מגיעים לפחות{' '}
        {formatMoney(backPayTotal)}, וההפרש הוא {formatMoney(backPayGap)}. כך בודקים הפרשים על חודשים שכבר שולמו: כל
        חודש לפי הסכום שהיה בתוקף בו.
      </p>

      <h2>מה המחשבון לא מחשב</h2>
      <ul>
        <li>
          <strong>עובדים עם מוגבלות בעלי יכולת עבודה מופחתת.</strong> להם יש שכר מינימום מותאם לפי אחוז יכולת
          העבודה, בתקנות נפרדות.
        </li>
        <li>
          <strong>שכר מינימום ענפי.</strong> בענפי הבנייה, השיפוצים, הניקיון, השמירה והאבטחה יש הסכמים קיבוציים וצווי
          הרחבה עם תעריפים משלהם, לרוב גבוהים יותר.
        </li>
        <li>
          <strong>זכויות נוספות.</strong> שכר המינימום הוא רק הרצפה. חופשה, מחלה, הבראה ופנסיה משולמות בנוסף. מספר ימי
          החופשה לפי ותק מחשבים ב<Link href="/tools/vacation-days-calculator">מחשבון ימי החופשה</Link>, ואת תאריכי
          חופשת הלידה ב<Link href="/tools/maternity-leave-calculator">מחשבון חופשת הלידה</Link>.
        </li>
      </ul>
      <p className={styles.caveat}>
        הסכומים לפי חוק שכר מינימום, התשמ״ז-1987, ופרסומי הביטוח הלאומי ומשרד העבודה לתקופה שמיום 1.4.2026. שכר לשעה
        מחושב לפי 182 שעות בחודש, כפי שקובע צו ההרחבה לקיצור שבוע העבודה. הסכם קיבוצי, צו הרחבה ענפי או חוזה אישי
        יכולים לקבוע שכר גבוה יותר. שכר מינימום לבני נוער ולחניכים לפי תקנות שכר מינימום (נוער עובד וחניכים). זה מידע
        כללי ולא ייעוץ משפטי.
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
      <p className={styles.reviewed}>
        הסכומים והנוסח נבדקו מול החוק, התקנות, אתר הביטוח הלאומי ואתר משרד העבודה ב-23 באוקטובר 2026.
      </p>
    </ToolLayout>
  )
}
