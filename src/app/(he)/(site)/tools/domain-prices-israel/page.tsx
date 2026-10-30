import ToolLayout, { toolMetadata, type ToolFaqEntry } from '../../components/tools/ToolLayout'
import styles from '../../components/tools/FunTable.module.css'

const PATH = '/tools/domain-prices-israel'
const TITLE = 'כמה עולה דומיין בישראל'
const META_TITLE = 'כמה עולה דומיין co.il: השוואת מחירים לשנה ב-2026'
const DESCRIPTION =
  'כמה עולה דומיין co.il לשנה? טבלת מחירים מפורסמים של רשמים ישראליים, עם ההבדל בין רישום, חידוש ומבצע.'

const PRICES = [
  { name: 'Box', price: 'החל מ-68 ₪', note: 'מחיר פתיחה מפורסם בכל הסיומות', href: 'https://www.box.co.il/' },
  { name: 'גלקום', price: '72 ₪', note: 'מבצע חידוש בהעברה, עד 31.12.2026', href: 'https://www.galcomm.co.il/domain/domain-renewal/' },
  { name: 'MyNames', price: '74 ₪', note: 'מחיר שפורסם ממרץ 2025', href: 'https://mynames.co.il/' },
  { name: 'LiveDNS', price: '92 ₪', note: 'רישום וחידוש לשנה', href: 'https://domains.livedns.co.il/PriceList.aspx' },
]

const faq: ToolFaqEntry[] = [
  {
    id: 'domain-price-renewal',
    question: 'מה ההבדל בין מחיר רישום למחיר חידוש?',
    answer: 'רישום הוא התשלום הראשון וחידוש הוא התשלום בכל שנה אחריו. בבחירת רשם כדאי לבדוק את מחיר החידוש ולא רק את מבצע הפתיחה.',
  },
  {
    id: 'domain-price-move',
    question: 'אפשר להעביר דומיין לרשם זול יותר?',
    answer: 'כן, ודאו מראש מה עלות ההעברה ואם היא כוללת שנת חידוש.',
  },
]

export const metadata = toolMetadata({ path: PATH, metaTitle: META_TITLE, description: DESCRIPTION })

export default function Page() {
  return (
    <ToolLayout
      path={PATH}
      title={TITLE}
      metaTitle={META_TITLE}
      description={DESCRIPTION}
      lede="דומיין co.il עולה בדרך כלל כ-70 עד 90 ₪ לשנה כולל מע״מ אצל הרשמים שבדקנו. המחירים נבדקו ב-30.10.2026 וכדאי לאמת אותם אצל הרשם."
      tool={
        <table className={styles.table}>
          <thead>
            <tr>
              <th scope="col">רשם</th>
              <th scope="col">co.il לשנה</th>
              <th scope="col">הערה</th>
            </tr>
          </thead>
          <tbody>
            {PRICES.map(({ name, price, note, href }) => (
              <tr key={name}>
                <td>
                  <a href={href} rel="noopener nofollow" target="_blank">
                    {name}
                  </a>
                </td>
                <td>{price}</td>
                <td>{note}</td>
              </tr>
            ))}
          </tbody>
        </table>
      }
      faq={faq}
      cta={{
        text: 'יש לכם דומיין ואין אתר? אנחנו בונים אתרים לעסקים בישראל.',
        label: 'בניית אתר לעסק',
        href: '/services/development',
      }}
    >
      <h2>איך לבחור</h2>
      <p>השוו מחיר חידוש, בדקו אם ניהול ה-DNS כלול, והשתמשו בבדיקת דומיין לפני הרכישה.</p>
    </ToolLayout>
  )
}
