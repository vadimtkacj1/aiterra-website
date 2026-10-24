import Link from 'next/link'
import ToolLayout, { toolMetadata, type ToolFaqEntry } from '../../components/tools/ToolLayout'
import UnitPriceCalculator from '../../components/tools/UnitPriceCalculator'
import { compareProducts, formatOver, formatShekels, productLabel, type CompareResult } from '@/lib/unit-price'
import styles from './page.module.css'

const PATH = '/tools/unit-price-calculator'
const TITLE = 'מחשבון מחיר ליחידה והשוואת מבצעים'
const META_TITLE = 'מחשבון מחיר ליחידה: מחיר ל-100 גרם, לק״ג ולליטר'
const DESCRIPTION =
  'מחשבון מחיר ליחידה חינמי: משווים עד 5 מוצרים לפי מחיר וכמות, ורואים מחיר ל-100 גרם, לק״ג ולליטר, מי הזול ביותר ואם מבצע כמו קנה 2 קבל 1 באמת משתלם.'

const base = { count: '1', dealA: '', dealB: '' } as const

const example = compareProducts([
  { ...base, price: '12.90', quantity: '750', unit: 'g', deal: 'none' },
  { ...base, price: '9.90', quantity: '500', unit: 'g', deal: 'none' },
  { ...base, price: '17.50', quantity: '1', unit: 'kg', deal: 'free', dealA: '2', dealB: '1' },
]) as CompareResult

const dealRows = [
  { deal: 'קנה 2 וקבל 1 חינם', formula: 'משלמים על 2, מקבלים 3', discount: '33.33%' },
  { deal: 'קנה 1 וקבל 1 חינם', formula: 'משלמים על 1, מקבלים 2', discount: '50%' },
  { deal: 'הפריט השני ב-50% הנחה', formula: 'משלמים 1.5 במקום 2', discount: '25%' },
  { deal: '3 ב-20 ₪ במקום 8 ₪ ליחידה', formula: '20 ÷ 3 = 6.67 ₪ ליחידה', discount: '16.67%' },
]

const sources = [
  {
    href: 'https://www.ynet.co.il/articles/mobile/0,7340,L-3651227,00.html',
    label: 'ynet: חובת סימון מחיר ליחידת מידה בסופרמרקטים, 100 גרם או ק״ג, 100 מ״ל או ליטר',
  },
  {
    href: 'https://www.calcalist.co.il/shopping/article/h16ytsu36',
    label: 'כלכליסט (פברואר 2024): אכיפת הרשות להגנת הצרכן על הצגת מחירים, כולל מחיר ליחידת מידה',
  },
]

const faq: ToolFaqEntry[] = [
  {
    id: 'unit-faq-how',
    question: 'איך מחשבים מחיר ליחידת מידה?',
    answer:
      'מחלקים את המחיר בכמות ומכפילים בכמות הייחוס. מוצר של 500 גרם ב-9.90 ₪: 9.90 חלקי 500 הם 0.0198 ₪ לגרם, ובכפל ב-100 מקבלים 1.98 ₪ ל-100 גרם, או 19.80 ₪ לק״ג. כדי להשוות בין מוצרים חייבים להשתמש באותה כמות ייחוס, ולכן המחשבון מחשב את כולם יחד.',
  },
  {
    id: 'unit-faq-which-better',
    question: 'האריזה הגדולה תמיד זולה יותר?',
    answer:
      'לא תמיד. בדוגמה שלמעלה אריזה של 750 גרם ב-12.90 ₪ יוצאת 1.72 ₪ ל-100 גרם, יקרה יותר מאריזה גדולה אחרת במבצע. לפעמים אריזה קטנה במבצע זולה מהגדולה במחיר מלא. הדרך היחידה לדעת היא להשוות מחיר ליחידת מידה.',
  },
  {
    id: 'unit-faq-buy2-get1',
    question: 'האם קנה 2 וקבל 1 חינם הוא באמת מבצע טוב?',
    answer:
      'הוא שווה 33.33% הנחה, כי משלמים על שתי יחידות ומקבלים שלוש. אבל זה משתלם רק אם צריך שלוש יחידות ואם המחיר הרגיל של המוצר לא גבוה מהמתחרים. כדאי להקליד את המבצע במחשבון ולהשוות למוצר דומה ללא מבצע: לפעמים אחרי המבצע המחיר ליחידה עדיין גבוה מהחלופה.',
  },
  {
    id: 'unit-faq-law',
    question: 'האם חנויות חייבות להציג מחיר ליחידת מידה?',
    answer:
      'בישראל קיימת חובה להציג מחיר ליחידת מידה, בדרך כלל ל-100 גרם או לק״ג למשקל ול-100 מ״ל או לליטר לנפח, לצד מחיר המוצר. לפי הדיווחים היא חלה על סופרמרקטים ומרכולים גדולים, ועל מוצרים מסוימים בלבד. פרטי ההחלה, כולל גודל החנות וסוגי המוצרים, מוגדרים בתקנות ומתעדכנים, ולכן לבדיקה מדויקת פנו לרשות להגנת הצרכן ולסחר הוגן. אם לא הוצג מחיר ליחידה במוצר שחייב בכך, אפשר להגיש לה תלונה.',
  },
  {
    id: 'unit-faq-units',
    question: 'אפשר להשוות ק״ג לגרם וליטר למ״ל?',
    answer:
      'כן, המחשבון ממיר לבד: ק״ג לגרם וליטר למ״ל. אי אפשר להשוות משקל לנפח או ליחידות, למשל חבילת קפה בגרמים מול בקבוק בליטרים, כי אין המרה ישירה. במקרה כזה בחרו אותו סוג מידה בכל המוצרים.',
  },
  {
    id: 'unit-faq-multipack',
    question: 'איך מזינים מארז של כמה אריזות?',
    answer:
      'בשדה ״כמות באריזה״ מקלידים את הכמות של אריזה אחת, ובשדה ״מספר אריזות במארז״ את מספר האריזות. שישייה של בקבוקים של 330 מ״ל ב-18 ₪: כמות 330, יחידה מ״ל, מספר אריזות 6. המחשבון יחשב 1.98 ליטר ויוציא 0.91 ₪ ל-100 מ״ל.',
  },
]

export const metadata = toolMetadata({ path: PATH, metaTitle: META_TITLE, description: DESCRIPTION })

export default function UnitPriceCalculatorPage() {
  return (
    <ToolLayout
      path={PATH}
      title={TITLE}
      metaTitle={META_TITLE}
      description={DESCRIPTION}
      lede="כדי לדעת איזו אריזה זולה יותר מחלקים את המחיר בכמות ומשווים מחיר ל-100 גרם, לק״ג או לליטר. מוצר של 500 גרם ב-9.90 ₪ עולה 1.98 ₪ ל-100 גרם. כאן מקלידים עד חמישה מוצרים, כולל מבצעים כמו קנה 2 וקבל 1, ורואים מי הזול ביותר."
      chips={['עד 5 מוצרים', 'כולל מבצעים', 'בלי הרשמה']}
      tool={<UnitPriceCalculator />}
      faq={faq}
      cta={{
        text: 'מוכרים אונליין? אנחנו בונים חנויות עם מבצעים, מחיר ליחידה בדף המוצר וקופונים אוטומטיים.',
        label: 'בניית חנות אינטרנטית',
        href: '/services/ecommerce',
      }}
    >
      <h2>איך משווים מחירים לפי יחידת מידה</h2>
      <p>
        מחיר על האריזה לא אומר הרבה כשהכמויות שונות. כדי להשוות, מביאים את כל המוצרים לאותה כמות ייחוס: מחיר חלקי
        כמות, כפול 100 או כפול 1,000. במחשבון מחיר מוצג ל-100 גרם ולק״ג למשקל, ל-100 מ״ל ולליטר לנפח, ולכל יחידה
        כשסופרים יחידות, כמו ביצים, חיתולים או קפסולות.
      </p>

      <h3>דוגמה: שלושה מוצרים</h3>
      <ul>
        {example.rows.map((row) => (
          <li key={row.index}>
            {productLabel(row.index)}:{' '}
            {['12.90 ₪ ל-750 גרם', '9.90 ₪ ל-500 גרם', '17.50 ₪ לק״ג במבצע קנה 2 וקבל 1'][row.index]}
            {' → '}
            <strong>{formatShekels(row.per100 ?? 0)} ל-100 גרם</strong>
            {row.best ? ', הזול ביותר' : `, יקר ב-${formatOver(row.overBestPercent)}`}
          </li>
        ))}
      </ul>
      <p>
        המבצע הופך את הק״ג היקר ביותר במחיר הרגיל לזול ביותר: משלמים {formatShekels(example.rows[2].paid)} על{' '}
        {example.rows[2].baseQuantity / 1000} ק״ג, כלומר {formatShekels(example.rows[2].perThousand ?? 0)} לק״ג.
      </p>

      <h2>מבצעים: כמה הם באמת שווים</h2>
      <p>
        כל מבצע אפשר להפוך לאחוז הנחה, ואז קל להשוות. אבל ההנחה מחושבת ממחיר הבסיס של אותו מוצר, ולכן מבצע גדול על
        מוצר יקר יכול להיות פחות משתלם ממחיר רגיל של מוצר דומה.
      </p>
      <div className={styles.tableWrap} role="region" aria-label="טבלת מבצעים" tabIndex={0}>
        <table className={styles.table}>
          <caption>מה ההנחה האמיתית במבצעים נפוצים</caption>
          <thead>
            <tr>
              <th scope="col">מבצע</th>
              <th scope="col">מה משלמים</th>
              <th scope="col">הנחה</th>
            </tr>
          </thead>
          <tbody>
            {dealRows.map((row) => (
              <tr key={row.deal}>
                <th scope="row">{row.deal}</th>
                <td>{row.formula}</td>
                <td>{row.discount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p>
        במחשבון בחרו בכל מוצר את סוג המבצע והקלידו את המספרים. ״X פריטים ב-Y ₪״ מחשב לפי מחיר החבילה, ולכן אין צורך
        להקליד מחיר רגיל. לחישוב אחוזי הנחה כלליים יש <Link href="/tools/percentage-calculator">מחשבון אחוזים</Link>.
      </p>

      <h2>חובת הצגת מחיר ליחידת מידה בישראל</h2>
      <p>
        בישראל סופרמרקטים ומרכולים נדרשים להציג, לצד מחיר המוצר, גם מחיר ליחידת מידה: ל-100 גרם או לק״ג למשקל, ול-100
        מ״ל או לליטר לנפח. החובה נכנסה לתוקף בינואר 2009 ונאכפת על ידי הרשות להגנת הצרכן ולסחר הוגן, שבפברואר 2024
        דיווחה על קנסות לקמעונאים שלא הציגו מחירים כנדרש. הפרטים המדויקים, כולל גודל החנות והמוצרים שהחובה חלה
        עליהם, מוגדרים בתקנות ומתעדכנים, ולכן כשצריך לדעת אם חנות מסוימת מחויבת, בדקו מול הרשות.
      </p>
      <p>
        התג שעל המדף הוא נקודת פתיחה, אבל הוא לא תמיד כולל מבצעים, מארזים או מוצרים בחנות שאינה מחויבת. כאן אפשר
        להשלים את ההשוואה בעצמכם.
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
