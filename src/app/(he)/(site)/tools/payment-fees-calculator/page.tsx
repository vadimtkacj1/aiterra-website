import Link from 'next/link'
import ToolLayout, { toolMetadata, type ToolFaqEntry } from '../../components/tools/ToolLayout'
import PaymentFeesCalculator from '../../components/tools/PaymentFeesCalculator'
import { EBAY, GROW, PAYPAL, SOURCES } from '@/lib/payment-fees'
import styles from './page.module.css'

const PATH = '/tools/payment-fees-calculator'
const TITLE = 'מחשבון עמלות'
const META_TITLE = 'מחשבון עמלות פייפאל וסליקה: כמה נשאר לכם נטו'
const DESCRIPTION =
  'מחשבון עמלות PayPal, Grow ו-eBay: כמה עמלה תשלמו, כמה יישאר נטו אחרי מע״מ והמרת מטבע, וכמה לגבות כדי לקבל סכום מסוים. לפי מחירוני החברות, בחינם.'

const compareRows: { platform: string; fee: string; extra: string }[] = [
  {
    platform: 'PayPal, עסקה מישראל',
    fee: `${PAYPAL.domesticPercent}% + ${PAYPAL.fixedFee.ILS} ₪`,
    extra: '18% מע״מ על העמלה. משיכה לבנק מתחת ל-1,000 ₪ עולה 8 ₪.',
  },
  {
    platform: 'PayPal, לקוח מארה״ב, קנדה או אירופה',
    fee: `${PAYPAL.domesticPercent + PAYPAL.regionExtraPercent.near}% + עמלה קבועה`,
    extra: `עמלה קבועה של $${PAYPAL.fixedFee.USD} או €${PAYPAL.fixedFee.EUR}, ומרווח המרה של ${PAYPAL.conversionPercent}%.`,
  },
  {
    platform: 'PayPal, לקוח משאר העולם',
    fee: `${PAYPAL.domesticPercent + PAYPAL.regionExtraPercent.other}% + עמלה קבועה`,
    extra: 'כמו בשורה הקודמת, ועוד מע״מ.',
  },
  {
    platform: 'Grow (משולם)',
    fee: `${GROW.percent}% לעסקה`,
    extra: `${GROW.monthlyIls} ₪ לחודש בתשלום שנתי, ${GROW.includedTransactions} עסקאות כלולות, ביט באותה עמלה. לפני מע״מ.`,
  },
  {
    platform: 'Grow Light',
    fee: `${GROW.lightPercent}% לעסקה`,
    extra: `${GROW.lightMonthlyIls} ₪ לחודש בתשלום שנתי, עד ${GROW.lightIncludedTransactions} עסקאות. לפני מע״מ.`,
  },
  {
    platform: 'eBay, מוכר מחוץ לארה״ב',
    fee: `${EBAY.finalValuePercent}% + $${EBAY.perOrderLargeUsd} להזמנה`,
    extra: `ועוד ${EBAY.internationalPercent}% עמלה בינלאומית. $${EBAY.perOrderSmallUsd} בהזמנה עד $10.`,
  },
  {
    platform: 'טרנזילה, קארדקום, PayPlus, ביט',
    fee: 'לפי הצעת מחיר',
    extra: 'החברות לא מפרסמות עמלה קבועה. מקלידים במחשבון את האחוז מההצעה שקיבלתם.',
  },
]

const sources = [
  { ...SOURCES.paypal, note: 'עמלה מקומית, תוספת בינלאומית, עמלה קבועה לפי מטבע, המרת מטבע ומשיכות' },
  { ...SOURCES.grow, note: 'עמלה לעסקה, דמי מנוי, מסלול Light, ביט ופייבוקס באותה עמלה, מחירים לפני מע״מ' },
  { ...SOURCES.ebay, note: 'עמלת final value לרוב הקטגוריות, עמלה להזמנה ועמלה בינלאומית' },
  { ...SOURCES.stripe, note: 'ישראל לא מופיעה ברשימת המדינות הנתמכות' },
]

const faq: ToolFaqEntry[] = [
  {
    id: 'fees-faq-paypal',
    question: 'כמה עמלה PayPal גובה מעסק בישראל?',
    answer:
      'לפי מחירון PayPal לישראל, עסקה מסחרית מקומית עולה 3.4% מהסכום ועוד עמלה קבועה של 1.20 ₪, ועל העמלה מתווסף 18% מע״מ. כשהלקוח משלם מחו״ל מתווספים עוד 1% אם הוא בארה״ב, בקנדה או באירופה, ו-2% אם הוא בשאר העולם. בתשלום של 500 ₪ מלקוח ישראלי העמלה היא 18.20 ₪, המע״מ 3.28 ₪, ונשארים לכם 478.52 ₪. על המרת מטבע PayPal מוסיפה 2.5% על השער הבסיסי, ומשיכה לבנק של פחות מ-1,000 ₪ עולה 8 ₪. משיכה של 1,000 ₪ ומעלה היא בלי עמלה.',
  },
  {
    id: 'fees-faq-reverse',
    question: 'איך מחשבים כמה לגבות כדי לקבל סכום מסוים נטו?',
    answer:
      'בוחרים במחשבון ״רוצה לקבל סכום״ ומקלידים כמה אתם רוצים שיישאר לכם. המחשבון מחפש את הסכום הקטן ביותר שאחרי העמלה, המע״מ והמרת המטבע משאיר לכם לפחות את מה שביקשתם. אי אפשר פשוט להוסיף 3.4% לסכום, כי העמלה מחושבת מהסכום שהלקוח משלם ולא מהסכום שאתם מקבלים, ויש גם עמלה קבועה. לכן התוספת האמיתית תמיד קצת גבוהה מאחוז העמלה. כדאי לבדוק את זה לפני ששולחים ללקוח דרישת תשלום, מגישים הצעת מחיר או קובעים מחיר באתר, כדי שהעמלה לא תאכל לכם את הרווח בלי שתשימו לב.',
  },
  {
    id: 'fees-faq-clearing',
    question: 'כמה עולה סליקת אשראי לעסק קטן בישראל?',
    answer:
      'זה תלוי בחברה ובמסלול, ורוב החברות לא מפרסמות מחיר קבוע אלא נותנות הצעה לפי המחזור והתחום. Grow, לשעבר משולם, מפרסמת 0.75% לעסקה ועוד 59 ₪ לחודש בתשלום שנתי, לפני מע״מ, עם 100 עסקאות כלולות. מסלול Grow Light עולה 1% לעסקה ו-29 ₪ לחודש. בטרנזילה, בקארדקום וב-PayPlus אין אחוז מפורסם, ולכן במחשבון יש שדה שבו מקלידים את האחוז והעמלה הקבועה מההצעה שקיבלתם. תמיד כדאי לבדוק גם דמי מסוף, עמלת מינימום ועמלה על כרטיסי חו״ל, כי הם משנים את העלות הכוללת.',
  },
  {
    id: 'fees-faq-bit',
    question: 'כמה עולה לקבל תשלום בביט לעסקים?',
    answer:
      'ביט לעסקים לא מפרסמת מחירון משלה. העסק מתחבר לביט דרך חברת סליקה, והעמלה נקבעת בהסכם איתה. Grow כותבת במחירון שלה שאין אצלה עמלה נוספת על ביט ופייבוקס, כך שתשלום בביט עולה כמו תשלום באשראי, 0.75% במסלול הרגיל. בחברות אחרות עמלת ביט יכולה להיות גבוהה מעמלת האשראי, ולכן כדאי לבקש אותה בנפרד בהצעת המחיר. כדי לחשב, בוחרים במחשבון ״חברת סליקה אחרת״ ומקלידים את האחוז שקיבלתם. העברה בביט בין אנשים פרטיים היא שירות אחר, שלא מיועד לקבלת תשלום מלקוחות.',
  },
  {
    id: 'fees-faq-vat',
    question: 'האם משלמים מע״מ על עמלות סליקה ו-PayPal?',
    answer:
      'כן. שיעור המע״מ בישראל הוא 18%, והוא חל על העמלה ולא על כל הסכום שהלקוח שילם. PayPal מציגה במחירון שלה לישראל כל עמלה גם בתוספת 18% מע״מ, כך ש-3.4% הופכים בפועל ל-4.01%. Grow כותבת שהמחירים שלה לא כוללים מע״מ. עוסק מורשה יכול בדרך כלל לקזז את המע״מ על העמלה כמס תשומות, ולכן העלות האמיתית שלו נמוכה יותר ממה שיורד מהחשבון. עוסק פטור לא מקזז, והמע״מ הוא עלות לכל דבר. המחשבון מציג את המע״מ בשורה נפרדת כדי שתראו את שני המספרים.',
  },
  {
    id: 'fees-faq-stripe',
    question: 'אפשר להשתמש ב-Stripe בישראל במקום PayPal?',
    answer:
      'לא ישירות. ישראל לא מופיעה ברשימת המדינות שבהן Stripe מאפשרת לפתוח חשבון עסקי, כך שעסק ישראלי לא יכול לסלוק דרכה בלי חברה רשומה במדינה נתמכת, למשל חברה אמריקאית. לכן אין במחשבון עמלות Stripe. מי שמוכר ללקוחות בחו״ל משתמש בדרך כלל ב-PayPal, בפלטפורמת מכירה כמו eBay, או בחברת סליקה ישראלית שתומכת בכרטיסים בינלאומיים ובכמה מטבעות. כדאי להשוות את העמלה הכוללת, כולל המרת מטבע, ולא רק את האחוז הבסיסי, כי ההפרש בהמרה יכול להיות גדול מהעמלה עצמה.',
  },
]

export const metadata = toolMetadata({ path: PATH, metaTitle: META_TITLE, description: DESCRIPTION })

export default function PaymentFeesCalculatorPage() {
  return (
    <ToolLayout
      path={PATH}
      title={TITLE}
      metaTitle={META_TITLE}
      description={DESCRIPTION}
      lede="בוחרים איך גובים, PayPal, Grow, eBay או חברת סליקה אחרת, ומקלידים סכום. המחשבון מראה כמה עמלה יורדת, כמה מע״מ עליה וכמה יישאר לכם נטו, וגם הפוך: כמה לגבות מהלקוח כדי לקבל סכום מסוים. כל המספרים מהמחירונים הרשמיים של החברות."
      chips={['PayPal מקומי ובינלאומי', 'Grow וביט לעסקים', 'כמה לגבות כדי לקבל נטו', 'כולל מע״מ והמרת מטבע']}
      tool={<PaymentFeesCalculator />}
      faq={faq}
      cta={{
        text: 'משלמים יותר מדי על כל הזמנה? אנחנו בונים חנות אונליין עם סליקה ישראלית זולה, ביט ותשלומים, במקום קופה יקרה דרך PayPal.',
        label: 'הקמת חנות אונליין',
        href: '/services/ecommerce',
      }}
    >
      <h2 id="compare" className={styles.anchor}>
        השוואת עמלות
      </h2>
      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <caption>עמלות לפי המחירונים הרשמיים, נכון ל-28 באוקטובר 2026</caption>
          <thead>
            <tr>
              <th scope="col">איך גובים</th>
              <th scope="col">עמלה לעסקה</th>
              <th scope="col">מה עוד לדעת</th>
            </tr>
          </thead>
          <tbody>
            {compareRows.map((row) => (
              <tr key={row.platform}>
                <th scope="row">{row.platform}</th>
                <td>{row.fee}</td>
                <td>{row.extra}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p>
        באותו תשלום של 500 ₪ מלקוח ישראלי, PayPal לוקחת 21.48 ₪ כולל מע״מ ו-Grow לוקחת 4.43 ₪ כולל מע״מ, לפני דמי
        המנוי. ההפרש גדל עם כל הזמנה, ולכן בחנות שמוכרת בעיקר בישראל עדיף לחבר סליקה ישראלית ולהשאיר את PayPal כאפשרות
        נוספת ללקוחות מחו״ל.
      </p>

      <h2 id="how" className={styles.anchor}>
        איך המחשבון מחשב
      </h2>
      <ul>
        <li>
          <strong>עמלה:</strong> אחוז מהסכום שהלקוח משלם, ועוד עמלה קבועה אם יש.
        </li>
        <li>
          <strong>מע״מ:</strong> 18% על העמלה ב-PayPal וב-Grow. ב-eBay המחשבון לא מוסיף מע״מ, כי המחירון בדולרים לא
          מציין אותו.
        </li>
        <li>
          <strong>המרת מטבע:</strong> ב-PayPal, כשמקבלים דולרים או אירו וממירים לשקלים, מורידים 2.5% מהסכום שנשאר. זו
          הערכה, כי השער הבסיסי משתנה כל יום.
        </li>
        <li>
          <strong>החישוב ההפוך:</strong> מחפשים את הסכום הקטן ביותר שמשאיר לכם לפחות את הנטו שביקשתם, באגורה.
        </li>
      </ul>
      <p>
        לא נכללים דמי מנוי ומסוף חודשיים, עמלות מחלוקת והחזר, ומסלולים מיוחדים שחברות נותנות לעסקים גדולים. לפני
        חישוב מחיר מכירה כדאי גם לבדוק את <Link href="/tools/vat-calculator">המע״מ על המחיר עצמו</Link>.
      </p>

      <h2>מקורות</h2>
      <ul>
        {sources.map((source) => (
          <li key={source.url}>
            <a href={source.url} rel="noopener" target="_blank">
              {source.label}
            </a>
            : {source.note}
          </li>
        ))}
      </ul>
      <p className={styles.reviewed}>
        המחירונים נבדקו ב-28 באוקטובר 2026. העמלות משתנות, וההסכם שלכם עם החברה יכול להיות שונה מהמחירון. החישוב הוא
        הערכה ואינו ייעוץ פיננסי או חשבונאי.
      </p>
    </ToolLayout>
  )
}
