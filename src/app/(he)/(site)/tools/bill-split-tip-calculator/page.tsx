import Link from 'next/link'
import ToolLayout, { toolMetadata, type ToolFaqEntry } from '../../components/tools/ToolLayout'
import BillSplitCalculator from '../../components/tools/BillSplitCalculator'
import { calculateSplit, formatShekels, formatTipPercent, type SplitResult } from '@/lib/bill-split'
import styles from './page.module.css'

const PATH = '/tools/bill-split-tip-calculator'
const TITLE = 'מחשבון טיפ וחלוקת חשבון'
const META_TITLE = 'מחשבון טיפ וחלוקת חשבון במסעדה: שווה בשווה או לפי מנות'
const DESCRIPTION =
  'מחשבון טיפ וחלוקת חשבון חינמי: מקלידים סכום, אחוז טיפ ומספר סועדים ורואים כמה כל אחד משלם. כולל חלוקה לפי מה שכל אחד הזמין ועיגול לשקל.'

const equalExample = calculateSplit({
  mode: 'equal',
  total: '480',
  tip: '12',
  people: '4',
  rounding: 'shekel',
  orders: [],
  shared: '',
}) as SplitResult

const itemsExample = calculateSplit({
  mode: 'items',
  total: '',
  tip: '12',
  people: '4',
  rounding: 'shekel',
  orders: ['120', '80', '150', '60'],
  shared: '70',
}) as SplitResult

const tipRows = [100, 250, 480, 800].map((bill) => ({
  bill,
  ten: Math.round(bill * 0.1 * 100),
  twelve: Math.round(bill * 0.12 * 100),
  fifteen: Math.round(bill * 0.15 * 100),
}))

const sources = [
  {
    href: 'https://www.ice.co.il/consumerism/news/article/1051190',
    label: 'ice: חיוב ״שירות״ אוטומטי בחשבון, וההבהרה שטיפ אינו חובה',
  },
  {
    href: 'https://www.mako.co.il/finances-consumer/Article-d1347ed7a9f4471027.htm',
    label: 'mako: חיוב שירות שלא סוכם מראש ורישום טיפ בקופה',
  },
  {
    href: 'https://finance.walla.co.il/item/3726386',
    label: 'וואלה כסף: חיוב של 10% שירות בחשבון בלי בקשה של הלקוח',
  },
]

const faq: ToolFaqEntry[] = [
  {
    id: 'tip-faq-how-much',
    question: 'כמה טיפ משאירים במסעדה בישראל?',
    answer:
      'המקובל הוא 10% עד 15% מהחשבון, ובשירות מעולה או בקבוצה גדולה לפעמים יותר. אין סכום קבוע ואין חובה בחוק, ולכן זה נשאר לשיקול דעתכם. על חשבון של 480 ₪ טיפ של 12% הוא 57.60 ₪. במחשבון אפשר לבחור 10%, 12% או 15% בלחיצה או להקליד אחוז אחר.',
  },
  {
    id: 'tip-faq-service-charge',
    question: 'האם מסעדה יכולה לחייב אותי בדמי שירות?',
    answer:
      'טיפ בישראל אינו חובה, וההחלטה אם ובכמה לשלם היא של הסועד. בפועל חלק מהמסעדות מוסיפות שורת ״שירות״ לחשבון, בעיקר לקבוצות גדולות. אם מופיעה שורה כזאת שלא ידעתם עליה מראש, שאלו עליה לפני התשלום ובקשו לראות היכן היא מופיעה בתפריט. אם החיוב לא ברור, אפשר לפנות לרשות להגנת הצרכן ולסחר הוגן.',
  },
  {
    id: 'tip-faq-before-vat',
    question: 'הטיפ מחושב על החשבון לפני מע״מ או אחריו?',
    answer:
      'במסעדות בישראל מחירי התפריט והחשבון כבר כוללים מע״מ, ולכן הטיפ מחושב בדרך כלל מהסכום שמופיע בחשבון. במחשבון מקלידים את הסכום הסופי מהחשבון ולא צריך לפרק אותו למע״מ.',
  },
  {
    id: 'tip-faq-uneven',
    question: 'איך מחלקים חשבון כשכל אחד הזמין סכום אחר?',
    answer:
      'מקלידים לכל סועד את הסכום של מה שהוא הזמין, ומנות משותפות כמו מנות פתיחה או בקבוק יין מקלידים בנפרד, והן מתחלקות שווה בשווה. הטיפ מחושב על הסכום של כל אחד, כך שמי שהזמין פחות משלם פחות. בבחירה ״לפי מה שהזמינו״ המחשבון עושה את זה בשבילכם.',
  },
  {
    id: 'tip-faq-rounding',
    question: 'מה עושים עם האגורות בחלוקה?',
    answer:
      'אפשר לעגל את הסכום לכל סועד כלפי מעלה לשקל שלם או ל-5 ₪. העיגול תמיד כלפי מעלה, כדי שהחשבון יכוסה במלואו, וההפרש שנצבר הולך לטיפ. בדוגמה של 480 ₪ ו-4 סועדים עם טיפ של 12%, כל אחד משלם 134.40 ₪ במדויק או 135 ₪ בעיגול, וסך הכול נאסף 540 ₪ במקום 537.60 ₪.',
  },
  {
    id: 'tip-faq-card-cash',
    question: 'איך נותנים טיפ כשמשלמים בכרטיס אשראי?',
    answer:
      'אפשר להוסיף את הטיפ לחיוב בכרטיס, אם המסעדה מאפשרת, או להשאיר אותו במזומן. בשני המקרים כדאי לוודא שהסכום שאישרתם בקופה הוא הסכום שסיכמתם עם חבריכם. כשמחלקים בין כמה כרטיסים, ספרו מראש כמה כל אחד משלם כולל טיפ, כדי שהסכומים בקופה יסתכמו לסכום הנכון.',
  },
]

export const metadata = toolMetadata({ path: PATH, metaTitle: META_TITLE, description: DESCRIPTION })

export default function BillSplitTipCalculatorPage() {
  return (
    <ToolLayout
      path={PATH}
      title={TITLE}
      metaTitle={META_TITLE}
      description={DESCRIPTION}
      lede="כדי לחלק חשבון עם טיפ מוסיפים לסכום את אחוז הטיפ ומחלקים במספר הסועדים. חשבון של 480 ₪ עם טיפ של 12% בין 4 סועדים הוא 134.40 ₪ לאדם. כאן מקלידים את הנתונים, אפשר גם לחלק לפי מה שכל אחד הזמין, ומקבלים את הסכום לכל סועד, עם עיגול לשקל."
      chips={['חלוקה שווה או לפי מנות', 'עיגול לשקל', 'בלי הרשמה']}
      tool={<BillSplitCalculator />}
      faq={faq}
      cta={{
        text: 'מנהלים מסעדה או עסק שירות? אנחנו בונים חנויות והזמנות אונליין עם תשלום ופיצול חשבון.',
        label: 'בניית חנות אינטרנטית',
        href: '/services/ecommerce',
      }}
    >
      <h2>איך מחשבים טיפ וחלוקת חשבון</h2>
      <p>
        החישוב פשוט: טיפ = חשבון × אחוז טיפ ÷ 100, וסכום לסועד = (חשבון + טיפ) ÷ מספר הסועדים. אפשר גם להכפיל
        ישר: חשבון × 1.12 הוא החשבון עם טיפ של 12%.
      </p>

      <h3>דוגמה: חלוקה שווה בשווה</h3>
      <ul>
        <li>חשבון: {formatShekels(equalExample.bill)}</li>
        <li>
          טיפ {formatTipPercent(equalExample.tipBasisPoints)}: {formatShekels(equalExample.tip)}
        </li>
        <li>סה״כ: {formatShekels(equalExample.grand)}</li>
        <li>
          לכל אחד מ-{equalExample.shares.length} הסועדים, עם עיגול כלפי מעלה לשקל:{' '}
          {formatShekels(equalExample.shares[0].pay)}
        </li>
        <li>
          נאסף {formatShekels(equalExample.collected)}, וההפרש של {formatShekels(equalExample.roundingExtra)} נוסף
          לטיפ
        </li>
      </ul>

      <h3>דוגמה: חלוקה לפי מה שכל אחד הזמין</h3>
      <p>
        ארבעה סועדים הזמינו ב-120, 80, 150 ו-60 ₪, ועוד מנות משותפות ב-70 ₪ שמתחלקות שווה. טיפ של 12% מחושב על
        הסכום של כל אחד:
      </p>
      <ul>
        {itemsExample.shares.map((share) => (
          <li key={share.index}>
            סועד {share.index + 1}: {formatShekels(share.food)} + טיפ {formatShekels(share.tip)} ={' '}
            {formatShekels(share.pay)}
          </li>
        ))}
      </ul>
      <p>
        החשבון הכולל {formatShekels(itemsExample.bill)}, ועם טיפ {formatShekels(itemsExample.grand)}. אחרי העיגול
        נאסף {formatShekels(itemsExample.collected)}.
      </p>

      <h2>טבלת טיפ לפי סכום החשבון</h2>
      <div className={styles.tableWrap} role="region" aria-label="טבלת טיפ" tabIndex={0}>
        <table className={styles.table}>
          <caption>סכום הטיפ באחוזים המקובלים</caption>
          <thead>
            <tr>
              <th scope="col">חשבון</th>
              <th scope="col">10%</th>
              <th scope="col">12%</th>
              <th scope="col">15%</th>
            </tr>
          </thead>
          <tbody>
            {tipRows.map((row) => (
              <tr key={row.bill}>
                <th scope="row">{formatShekels(row.bill * 100)}</th>
                <td>{formatShekels(row.ten)}</td>
                <td>{formatShekels(row.twelve)}</td>
                <td>{formatShekels(row.fifteen)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2>טיפ בישראל: מה חשוב לדעת</h2>
      <p>
        בישראל מקובל להשאיר 10% עד 15% מהחשבון במסעדות עם שירות שולחן. זה מנהג ולא חובה: לפי הסברים של כלי תקשורת
        צרכניים, טיפ אינו מוגדר בחוק כחובה, והלקוח מחליט אם וכמה לשלם.
      </p>
      <p>
        שימו לב לשורת ״שירות״ שנוספת לחשבון. כשהיא מופיעה בלי שידעתם עליה מראש, שאלו עליה לפני התשלום, ואל תשלמו
        טיפ פעמיים: פעם בשורה בחשבון ופעם במזומן. הכללים המדויקים בנושא הצגת חיוב כזה משתנים ומתעדכנים, ולכן
        לשאלה משפטית ספציפית כדאי לפנות לרשות להגנת הצרכן ולסחר הוגן. הטיפ עצמו שייך לעובדים, ובחשבון בכרטיס אשראי
        כדאי לוודא שהוא מתועד בקופה.
      </p>
      <p>
        לחישובי הנחה ואחוזים אחרים יש <Link href="/tools/percentage-calculator">מחשבון אחוזים</Link>, ולחישוב מע״מ{' '}
        <Link href="/tools/vat-calculator">מחשבון מע״מ</Link>.
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
      <p className={styles.reviewed}>הנוסחאות והמקורות נבדקו ב-24 באוקטובר 2026.</p>
    </ToolLayout>
  )
}
