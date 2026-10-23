import ToolLayout, { toolMetadata, type ToolFaqEntry } from '../../components/tools/ToolLayout'
import NameTransliterator from '../../components/tools/NameTransliterator'
import {
  NAME_TRANSLITERATION_CHECKED,
  NAME_TRANSLITERATION_PATH,
  dictionarySize,
  firstNames,
  lastNames,
  nameSources,
  type NameEntry,
} from '@/lib/name-transliteration'
import styles from '../../components/tools/NameTransliterator.module.css'

const TITLE = 'איך כותבים שם באנגלית'
const META_TITLE = 'איך כותבים שם באנגלית? ממיר שם עברי לאנגלית'
const DESCRIPTION =
  'איך כותבים שם באנגלית: משה, דניאל, יהונתן וכל שם עברי בכמה איותים נפוצים. רשימה של מאות שמות, כללי תעתיק לפי אות והסבר על האיות בדרכון.'

const letterRows = [
  ['א, ע', 'לרוב אות שקטה או תנועה', 'A, E, או בלי אות'],
  ['ב', 'B, ובאמצע שם לעיתים V', 'Avi, Dvir, Boaz'],
  ['ג, ג׳', 'G, ו-J בג׳', 'Gal, Jackie'],
  ['ה', 'H, ובסוף שם לרוב A או E', 'Hila, Moshe'],
  ['ו', 'V, או תנועה O או U', 'Vered, Doron, Yuval'],
  ['ז, ז׳', 'Z, ו-ZH בז׳', 'Ziv, Zhenya'],
  ['ח', 'CH, H או KH', 'Chaim, Haim, Khen'],
  ['י', 'Y בתחילת הברה, I כתנועה', 'Yael, Dani'],
  ['כ, ך', 'K בתחילת שם, CH או KH באמצע ובסוף', 'Kobi, Rachel, Barak'],
  ['צ, ץ', 'TZ, TS או Z', 'Tzvi, Zvi, Nitzan'],
  ['ק', 'K, ולעיתים Q', 'Keren, Qadir'],
  ['ש', 'SH, ולעיתים S', 'Shira, Sarit'],
  ['ת', 'T', 'Tamar, Tom'],
  ['פ, ף', 'P, ובסוף מילה F', 'Pini, Yosef'],
] as const

const faq: ToolFaqEntry[] = [
  {
    id: 'name-faq-moshe',
    question: 'איך כותבים משה כהן באנגלית?',
    answer:
      'משה כהן נכתב Moshe Cohen, ואפשר גם Moses Cohen אם רוצים את הצורה האנגלית של השם. כהן נכתב בדרך כלל Cohen, ולעיתים Kohen. אין איות אחד נכון, כי העברית נכתבת בלי תנועות והתעתיק משתנה בין מקומות. מי שכבר יש לו דרכון משתמש באיות שרשום בו, כדי שהשם יתאים בכרטיסי טיסה, בבנקים ובטפסים.',
  },
  {
    id: 'name-faq-passport',
    question: 'איך כותבים שם באנגלית בדרכון?',
    answer:
      'בדרכון נרשם האיות הלטיני כפי שנקבע ברשות האוכלוסין וההגירה, והוא מודפס באותיות גדולות. האיות שרשום בדרכון הוא הקובע לכל מסמך נסיעה: כרטיס טיסה, ויזה והזמנת מלון צריכים להיכתב בדיוק כמוהו. אם אין לכם עדיין דרכון, הציעו את האיות המועדף בעת ההגשה, אבל פקיד הרשות הוא שרושם את הנוסח הסופי.',
  },
  {
    id: 'name-faq-change',
    question: 'אפשר לשנות את האיות באנגלית בדרכון?',
    answer:
      'אפשר לפנות לרשות האוכלוסין וההגירה בבקשה לתקן או לשנות את האיות הלטיני, והתהליך כרוך בדרישות ובהוכחות. כדאי לבדוק את הנוהל העדכני באתר gov.il לפני שמגישים. עד שהאיות משתנה, משתמשים בנוסח הרשום בדרכון הנוכחי בכל מסמך, כי אי התאמה בין כרטיס הטיסה לדרכון עלולה למנוע עלייה למטוס.',
  },
  {
    id: 'name-faq-chet',
    question: 'מה הכי נכון: Chaim, Haim או Hayim?',
    answer:
      'כל שלושת האיותים נפוצים. Chaim נפוץ בקרב דוברי אנגלית ויידיש, Haim הוא האיות הפשוט שתואם את ההגייה הישראלית, ו-Hayim קרוב לתעתיק האקדמי. אין הכרעה, והשיקול הוא מה כבר רשום אצלכם. אות ח נכתבת בדרך כלל CH או H, ולעיתים KH, והבחירה צריכה להיות עקבית בכל המסמכים שלכם.',
  },
  {
    id: 'name-faq-tz',
    question: 'איך כותבים צ באנגלית: Tz, Ts או Z?',
    answer:
      'באנגלית נפוץ Tz, למשל Tzvi, Nitzan ו-Tzipi. Ts קיים בשמות כמו Yitzhak או Ben-Tsion, ו-Z משמש בשמות שהתקבעו כך, כמו Zvi או Zur. כולם מייצגים את אותו צליל. אם השם שלכם כבר מופיע בדרכון, לא משנים איות, כי אי התאמה בין כרטיס הטיסה לדרכון עלולה למנוע עלייה למטוס.',
  },
  {
    id: 'name-faq-versions',
    question: 'למה יש כמה איותים לאותו שם, כמו Yonatan ו-Jonathan?',
    answer:
      'יש שתי דרכים: תעתיק, שמשקף את ההגייה העברית (Yonatan, Moshe, Yaakov), ושם מקביל באנגלית, שמוכר מהמקרא (Jonathan, Moses, Jacob). רבים בוחרים בתעתיק כי הוא תואם את ההגייה, ואחרים בשם המקביל כי קל יותר לדוברי אנגלית. שניהם תקינים, ובמסמכים רשמיים משתמשים באחד מהם באופן עקבי.',
  },
]

const externalLink = (href: string, label: string) => (
  <a href={href} rel="noopener" target="_blank">
    {label}
  </a>
)

const NameList = ({ entries }: { entries: NameEntry[] }) => (
  <ul className={styles.nameGrid}>
    {entries.map((entry) => (
      <li key={entry.hebrew}>
        <strong lang="he">{entry.hebrew}</strong> <bdi>{entry.spellings.join(', ')}</bdi>
      </li>
    ))}
  </ul>
)

export const metadata = toolMetadata({
  path: NAME_TRANSLITERATION_PATH,
  metaTitle: META_TITLE,
  description: DESCRIPTION,
})

export default function HebrewNameToEnglishPage() {
  return (
    <ToolLayout
      path={NAME_TRANSLITERATION_PATH}
      title={TITLE}
      metaTitle={META_TITLE}
      description={DESCRIPTION}
      lede="אותו שם עברי נכתב באנגלית בכמה צורות: משה הוא Moshe או Moses, ויהונתן הוא Yehonatan או Jonathan. הקלידו שם וקבלו את האיותים הנפוצים, אבל בדרכון ובמסמכים קובע האיות שכבר רשום שם."
      chips={[`${dictionarySize} שמות ברשימה`, 'כמה איותים לכל שם', `נבדק ב-${NAME_TRANSLITERATION_CHECKED}`]}
      tool={<NameTransliterator />}
      faq={faq}
      cta={{
        text: 'צריכים כלי שמתחבר לנתונים של העסק, כמו ממיר, מחשבון או טופס חכם באתר?',
        label: 'פיתוח תוכנה לעסקים',
        href: '/services/development',
      }}
    >
      <h2>איך הכלי עובד</h2>
      <p>
        אם השם ברשימה של {dictionarySize} שמות ושמות משפחה נפוצים, הכלי מציג את האיותים הנפוצים שלו, הראשון הוא
        הנפוץ ביותר. אם השם לא ברשימה, הכלי מעריך ומציג עד שלוש הצעות לפי כללי תעתיק, וכותב אותן כהערכה. בעברית
        בלי ניקוד לא ידוע אילו תנועות נאמרות, ולכן הערכה כזו צריכה בדיקה של מי שמכיר את ההגייה.
      </p>

      <h2 id="rules" className={styles.anchor}>
        כללי תעתיק לפי אות
      </h2>
      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <caption>איך כל אות נכתבת באותיות לטיניות</caption>
          <thead>
            <tr>
              <th scope="col">אות</th>
              <th scope="col">איות נפוץ</th>
              <th scope="col">דוגמאות</th>
            </tr>
          </thead>
          <tbody>
            {letterRows.map(([letter, rule, example]) => (
              <tr key={letter}>
                <th scope="row">{letter}</th>
                <td>{rule}</td>
                <td dir="ltr">{example}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2 id="passport" className={styles.anchor}>
        איות השם בדרכון
      </h2>
      <p>
        האיות הלטיני של השם נרשם במסמכי הזיהוי, והדרכון מדפיס אותו באותיות גדולות. כשמזמינים טיסה, ויזה או מלון,
        כותבים את השם בדיוק כפי שהוא בדרכון, אות באות. הפקיד ברשות האוכלוסין וההגירה הוא שקובע את הנוסח הרשום,
        לפי {externalLink(nameSources.calcalist.href, 'דיווח בכלכליסט')}, ולכן ההצעה בכלי היא נקודת התחלה בלבד. לשינוי
        בשם עצמו יש הליך נפרד במרשם האוכלוסין, כפי שמופיע ב
        {externalLink(nameSources.kolzchut.href, 'כל זכות')} וב{externalLink(nameSources.gov.href, 'gov.il')}.
      </p>

      <h2 id="first-names" className={styles.anchor}>
        איך כותבים שמות פרטיים באנגלית ({firstNames.length} שמות)
      </h2>
      <NameList entries={firstNames} />

      <h2 id="last-names" className={styles.anchor}>
        איך כותבים שמות משפחה באנגלית ({lastNames.length} שמות)
      </h2>
      <NameList entries={lastNames} />

      <p className={styles.caveat}>
        הרשימה נערכה לפי הצורות הנפוצות ואינה רשמית. אין איות חוקי אחד לשם, והאיות בדרכון, בתעודות ובחשבון הבנק
        קובע גם אם הוא שונה מהמופיע כאן.
      </p>

      <h2>מקורות</h2>
      <ul>
        <li>{externalLink(nameSources.kolzchut.href, nameSources.kolzchut.label)}</li>
        <li>{externalLink(nameSources.gov.href, nameSources.gov.label)}</li>
        <li>{externalLink(nameSources.calcalist.href, nameSources.calcalist.label)}</li>
      </ul>
      <p className={styles.reviewed}>
        המקורות נבדקו ב-{NAME_TRANSLITERATION_CHECKED.split('-').reverse().join('.')}. אף אחד מהם אינו קובע כללי
        תעתיק מחייבים, ולכן הרשימה היא עריכה של הצורות הנפוצות.
      </p>
    </ToolLayout>
  )
}
