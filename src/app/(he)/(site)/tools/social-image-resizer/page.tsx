import type { ReactNode } from 'react'
import Link from 'next/link'
import ToolLayout, { toolMetadata, type ToolFaqEntry } from '../../components/tools/ToolLayout'
import SocialImageResizer from '../../components/tools/SocialImageResizer'
import {
  SIZES_CHECKED,
  SIZES_CHECKED_LABEL,
  dimensions,
  platforms,
  presetById,
  presetsFor,
  safeZonePixels,
  socialPresets,
  socialSources,
  usedSources,
  type SourceId,
} from '@/lib/social-image-sizes'
import styles from './page.module.css'

const PATH = '/tools/social-image-resizer'
const TITLE = 'גודל תמונה לאינסטגרם, לסטורי ולפייסבוק'
const META_TITLE = 'גודל תמונה לאינסטגרם, סטורי ופייסבוק: מידות וחיתוך'
const DESCRIPTION =
  'גודל תמונה לאינסטגרם, לסטורי, לפייסבוק, לוואטסאפ, לטיקטוק וללינקדאין, עם מקור לכל מידה. חותכים ומורידים בגודל המדויק, בלי להעלות את התמונה לשרת.'

const otherCount = socialPresets.length - presetsFor('instagram').length
const story = presetById('ig-story')
const storySafe = story ? safeZonePixels(story) : null

const rowSources = (ids: SourceId[]) =>
  ids.filter((id, index) => ids.findIndex((other) => socialSources[other].short === socialSources[id].short) === index)

const Px = ({ children }: { children: ReactNode }) => (
  <span dir="ltr" className={styles.ltr}>
    {children}
  </span>
)

const External = ({ id, children }: { id: SourceId; children: ReactNode }) => (
  <a href={socialSources[id].href} rel="noopener" target="_blank">
    {children}
  </a>
)

const faq: ToolFaqEntry[] = [
  {
    id: 'social-faq-instagram-post',
    question: 'מה הגודל הכי טוב לפוסט באינסטגרם?',
    answer:
      'לרוב הפוסטים 1080 על 1350 פיקסלים, ביחס 4:5. זו תמונה לאורך שתופסת יותר מקום במסך מתמונה ריבועית, והיא בתוך הטווח שאינסטגרם שומרת בלי חיתוך. מי שרוצה את הגובה המרבי יכול לבחור 1080 על 1440, ביחס 3:4, היחס הגבוה ביותר שאינסטגרם מקבלת בפוסט בלי לחתוך. לפוסט ריבועי, 1080 על 1080.',
  },
  {
    id: 'social-faq-story',
    question: 'מה גודל תמונה לסטורי?',
    answer:
      '1080 על 1920 פיקסלים, ביחס 9:16, שממלא מסך של טלפון. אינסטגרם לא מפרסמת מספר בפיקסלים לסטורי רגיל, אבל Meta מציינת את היחס 9:16, ו-1080 הוא הרוחב המרבי שאינסטגרם שומרת בתמונות. למודעות Meta ממליצה על 1440 על 2560. השאירו בערך 14% למעלה ו-35% למטה בלי טקסט, כי שם יושבים הכפתורים והכיתוב.',
  },
  {
    id: 'social-faq-crop',
    question: 'למה אינסטגרם חותכת לי את התמונה?',
    answer:
      'כי היחס שלה מחוץ לטווח שאינסטגרם מקבלת בפוסט: בין 1.91:1 לרוחב ל-3:4 לאורך. תמונה שצולמה בטלפון לאורך היא בדרך כלל 3:4 ונכנסת, אבל צילום מסך או תמונה ביחס 9:16 ייחתכו. בחרו כאן פוסט לאורך, הזיזו את התמונה כך שהחלק החשוב נמצא בתוך המסגרת, והורידו קובץ שכבר ביחס הנכון.',
  },
  {
    id: 'social-faq-facebook-cover',
    question: 'מה גודל תמונת קאבר לפייסבוק?',
    answer:
      'לעמוד עסקי פייסבוק ממליצה על 851 על 315 פיקסלים, כקובץ JPG קטן מ-100KB שנטען הכי מהר, ולא פחות מ-400 על 150. בטלפון הקאבר מוצג ביחס אחר, ותמונת הפרופיל מכסה חלק ממנו. לכן כדאי לשים את הטקסט והלוגו במרכז ולהשאיר שוליים בצדדים. כשיש בתמונה לוגו או טקסט, פייסבוק ממליצה לשמור אותה כ-PNG.',
  },
  {
    id: 'social-faq-whatsapp',
    question: 'מה גודל תמונה לסטטוס בוואטסאפ?',
    answer:
      'וואטסאפ מציינת יחס 9:16 לתמונות ולסרטונים בסטטוס, כלומר תמונה לאורך שממלאת את המסך, ורזולוציה מינימלית מומלצת של 500 על 320. גודל מומלץ בפיקסלים היא לא מפרסמת, ו-1080 על 1920 הוא הגודל המקובל באותו יחס. כדי להכניס תמונה רחבה בלי לחתוך אותה, בחרו בכלי ״כל התמונה״ וצבע רקע.',
  },
  {
    id: 'social-faq-privacy',
    question: 'התמונה שלי עולה לשרת?',
    answer:
      'לא. החיתוך, שינוי הגודל והשמירה נעשים בתוך הדפדפן שלכם, והתמונה לא נשלחת לשום מקום. אפשר לבדוק את זה: אחרי שהעמוד נטען, נתקו את האינטרנט ונסו לחתוך תמונה. הקובץ שתורידו נבנה מהפיקסלים בלבד, ולכן מידע שנשמר בתמונה, כמו מיקום GPS ופרטי המצלמה, לא עובר אליו.',
  },
]

export const metadata = toolMetadata({ path: PATH, metaTitle: META_TITLE, description: DESCRIPTION })

export default function SocialImageResizerPage() {
  return (
    <ToolLayout
      path={PATH}
      title={TITLE}
      metaTitle={META_TITLE}
      description={DESCRIPTION}
      lede={`פוסט באינסטגרם נשמר ברוחב 1080 פיקסלים: 1080 על 1350 לאורך, 1080 על 1080 לריבוע, ו-1080 על 1920 לסטורי ולרילס. כאן חותכים תמונה לגדלים האלה ולעוד ${otherCount} גדלים של פייסבוק, וואטסאפ, טיקטוק, לינקדאין, יוטיוב, גוגל ו-X, בתוך הדפדפן ובלי להעלות אותה לשום מקום.`}
      chips={[
        'התמונה לא עוזבת את המחשב',
        `${socialPresets.length} גדלים עם מקור לכל מידה`,
        'אזור בטוח לסטורי',
        'כמה גדלים בהורדה אחת',
      ]}
      tool={<SocialImageResizer />}
      faq={faq}
      cta={{
        text: 'צריכים פוסטים ומודעות שמגיעים מוכנים בכל הגדלים של כל רשת? זה חלק משירותי השיווק שלנו.',
        label: 'לשיווק ופרסום ממומן',
        href: '/services/marketing',
      }}
    >
      <h2>גודל תמונה לאינסטגרם: פוסט, סטורי ורילס</h2>
      <p>
        לפי <External id="igResolution">מרכז העזרה של אינסטגרם</External>, תמונה עולה ברזולוציה הטובה ביותר עד רוחב של
        1080 פיקסלים. תמונה ברוחב שבין 320 ל-1080 נשמרת כמו שהיא, כל עוד היחס שלה בין 1.91:1 ל-3:4, כלומר ברוחב 1080
        הגובה יכול להיות בין 566 ל-1440. תמונה ביחס אחר נחתכת ליחס נתמך, תמונה צרה מ-320 מוגדלת, ותמונה רחבה מ-1080
        מוקטנת.
      </p>
      <ul>
        <li>
          <strong>פוסט לאורך:</strong> <Px>1080×1350</Px> ביחס 4:5. זה גם היחס ש-
          <External id="metaIgFeed">Meta ממליצה עליו למודעות בפיד</External>, שם הגודל המומלץ הוא <Px>1440×1800</Px>.
        </li>
        <li>
          <strong>פוסט לאורך מקסימלי:</strong> <Px>1080×1440</Px> ביחס 3:4, היחס הגבוה ביותר שנשמר בלי חיתוך.
        </li>
        <li>
          <strong>פוסט ריבועי:</strong> <Px>1080×1080</Px>. <strong>פוסט לרוחב:</strong> <Px>1080×566</Px> ביחס 1.91:1.
        </li>
        <li>
          <strong>סטורי ורילס:</strong> <Px>1080×1920</Px> ביחס 9:16. אינסטגרם לא מפרסמת גודל בפיקסלים לסטורי רגיל.
          לרילס, לפי <External id="igReels">אינסטגרם</External>, אפשר להעלות ביחס שבין 1.91:1 ל-9:16 ובמינימום של 720
          פיקסלים, ולתמונת הכיסוי של רילס מומלץ <Px>420×654</Px>. למודעות בסטורי וברילס{' '}
          <External id="metaIgStory">Meta ממליצה</External> על <Px>1440×2560</Px>.
        </li>
      </ul>

      <h2>טבלת גודל תמונה לכל הרשתות</h2>
      <p>
        כל מידה בטבלה לקוחה ממרכז העזרה או ממפרט המודעות של הרשת עצמה, והקישור למקור מופיע בשורה. כשרשת לא מפרסמת
        מספר, סימנו את השורה ב״מקובל״ ולקחנו את הגודל שמופיע במדריכים הנפוצים.
      </p>
      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <caption>
            גודל תמונה לכל רשת. נבדק לאחרונה: <time dateTime={SIZES_CHECKED}>{SIZES_CHECKED_LABEL}</time>
          </caption>
          <thead>
            <tr>
              <th scope="col">מקום</th>
              <th scope="col">גודל בפיקסלים</th>
              <th scope="col">יחס</th>
              <th scope="col">מקור</th>
            </tr>
          </thead>
          {platforms.map((platform) => (
            <tbody key={platform.id}>
              <tr>
                <th scope="rowgroup" colSpan={4} className={styles.groupHead}>
                  {platform.label}
                </th>
              </tr>
              {presetsFor(platform.id).map((preset) => (
                <tr key={preset.id}>
                  <th scope="row">
                    {preset.label}
                    {preset.basis === 'common' ? <span className={styles.tag}>מקובל</span> : null}
                  </th>
                  <td>
                    <Px>{dimensions(preset)}</Px>
                  </td>
                  <td>
                    <Px>{preset.ratio}</Px>
                  </td>
                  <td className={styles.sourceCell}>
                    {rowSources(preset.sources).map((id) => (
                      <a key={id} href={socialSources[id].href} rel="noopener" target="_blank" lang="en" dir="ltr">
                        {socialSources[id].short}
                      </a>
                    ))}
                  </td>
                </tr>
              ))}
            </tbody>
          ))}
        </table>
      </div>
      <p className={styles.reviewed}>
        רשתות משנות מידות בלי הודעה מוקדמת. בדקנו את כל המקורות ב-{SIZES_CHECKED_LABEL}. יוטיוב, למשל, ממליצה היום על
        תמונה ממוזערת של <Px>3840×2160</Px>, והרבה מדריכים עדיין כותבים <Px>1280×720</Px>.
      </p>

      <h2>כמה מקום להשאיר בסטורי: האזור הבטוח</h2>
      <p>
        בסטורי וברילס חלק מהמסך מכוסה: למעלה שם החשבון ותמונת הפרופיל, למטה שדה התגובה, הכיתוב והכפתורים. במפרטי
        המודעות לסטורי ולרילס <External id="metaIgReels">Meta ממליצה</External> להשאיר בערך 14% מהגובה למעלה, 35% למטה
        ו-6% מהרוחב בכל צד בלי טקסט, לוגו או פרטים חשובים.
      </p>
      {storySafe ? (
        <p>
          בתמונה של <Px>1080×1920</Px> זה בערך {storySafe.top} פיקסלים למעלה, {storySafe.bottom} למטה ו-{storySafe.side}{' '}
          בכל צד. בכלי אפשר להדליק את האזור הבטוח ולראות אותו על התמונה בזמן החיתוך. הוא לא נשמר בקובץ.
        </p>
      ) : null}
      <p>
        ההמלצה נכתבה למודעות, אבל אותם רכיבים מופיעים גם בסטורי רגיל, ולכן כדאי לעבוד לפיה גם שם. גם ב-X יש אזור כזה:
        לפי <External id="xProfilePhoto">X</External>, בתמונת הכותרת של הפרופיל עד 60 פיקסלים למעלה ולמטה עלולים
        להיחתך בחלק מהמסכים.
      </p>

      <h2>גודל תמונה לפייסבוק: פוסט, קאבר, אירוע ופרופיל</h2>
      <ul>
        <li>
          <strong>פוסט:</strong> <External id="metaFbFeed">Meta ממליצה</External> על יחס 4:5 בגודל <Px>1440×1800</Px>{' '}
          לתמונה בפיד, ברוחב של 600 פיקסלים לפחות. ההמלצה הזו מופיעה במדריך המודעות, ולפוסט רגיל פייסבוק לא מפרסמת
          גודל נפרד.
        </li>
        <li>
          <strong>תמונת קאבר לעמוד:</strong> לפי <External id="fbPageImages">מרכז העזרה של פייסבוק</External>, הקובץ
          שנטען הכי מהר הוא JPG בגודל <Px>851×315</Px> וקטן מ-100KB, והמינימום הוא <Px>400×150</Px>. בטלפון הקאבר מוצג
          ביחס 2.4:1, ותמונת הפרופיל חופפת אותו בערך ב-40 פיקסלים, אז שימו את העיקר במרכז.
        </li>
        <li>
          <strong>תמונת פרופיל לעמוד:</strong> <Px>320×320</Px>. היא נחתכת לעיגול ומוצגת ב-176 פיקסלים במחשב וב-196
          בטלפון. לתמונה עם לוגו או טקסט פייסבוק ממליצה על PNG.
        </li>
        <li>
          <strong>תמונת אירוע:</strong> פייסבוק לא מפרסמת גודל, ורק{' '}
          <External id="fbEventCover">מציינת</External> שאי אפשר לשנות את הגודל אחרי שהתמונה נוספה לאירוע. הגודל
          המקובל הוא <Px>1920×1005</Px>, למשל ב<External id="sproutEvent">מדריך של Sprout Social</External>.
        </li>
      </ul>

      <h2>גודל תמונה לוואטסאפ: סטטוס ותמונת פרופיל</h2>
      <p>
        לסטטוס, <External id="waStatus">וואטסאפ מציינת</External> יחס 9:16 לתמונות ולסרטונים, ורזולוציה מינימלית מומלצת
        של <Px>500×320</Px>. גודל מומלץ בפיקסלים היא לא מפרסמת, ולכן בכלי בחרנו <Px>1080×1920</Px>, הגודל המקובל באותו
        יחס. תמונה רחבה אפשר להכניס בלי לחתוך: לוחצים ״כל התמונה״ ובוחרים צבע רקע.
      </p>
      <p>
        לתמונת פרופיל של עסק, לפי <External id="waProfile">התיעוד של WhatsApp Business API</External>, התמונה נחתכת
        לריבוע של עד 640 פיקסלים ועד 5MB, ותמונה שאחת הצלעות שלה קצרה מ-192 פיקסלים עלולה לצאת לא טוב. Meta הוציאה את
        הגרסה הזו של ה-API משימוש, ולכן הקישור הוא לעותק בארכיון מינואר 2025. לאפליקציה הרגילה אין מספר רשמי, וריבוע של
        640 הוא בחירה בטוחה. התמונה מוצגת בעיגול, אז השאירו את הלוגו במרכז.
      </p>

      <h2>גודל תמונה לטיקטוק, ללינקדאין, ליוטיוב ול-X</h2>
      <h3>טיקטוק</h3>
      <p>
        לתמונות במודעות קרוסלה <External id="tiktokCarousel">טיקטוק מפרסמת</External> <Px>720×1280</Px> לאורך,{' '}
        <Px>1200×628</Px> לרוחב ו-<Px>640×640</Px> לריבוע. לפוסט תמונה רגיל אין מספר רשמי. בכלי בחרנו{' '}
        <Px>1080×1920</Px>, באותו יחס 9:16, כי הוא נותן תמונה חדה יותר.
      </p>
      <h3>לינקדאין</h3>
      <ul>
        <li>
          <strong>פוסט:</strong> במפרט המודעות <External id="liSingleImage">לינקדאין ממליצה</External> על ריבוע של{' '}
          <Px>1200×1200</Px>, שמוצג טוב גם במחשב וגם בטלפון. לתמונה בפוסט עם קישור,{' '}
          <External id="liPageImages">מרכז העזרה</External> ממליץ על <Px>1200×627</Px>.
        </li>
        <li>
          <strong>באנר לפרופיל אישי:</strong> <Px>1584×396</Px>, JPG או PNG עד 8MB, לפי{' '}
          <External id="liProfileCover">לינקדאין</External>.
        </li>
        <li>
          <strong>עמוד חברה:</strong> קאבר <Px>1512×256</Px> ולוגו <Px>400×400</Px>, PNG או JPEG עד 3MB. לינקדאין ממליצה
          להרחיק פרטים חשובים מהשוליים של הקאבר, בעיקר מהפינה הימנית התחתונה.
        </li>
      </ul>
      <h3>יוטיוב</h3>
      <p>
        לפי <External id="ytThumbnail">מרכז העזרה של יוטיוב</External>, התמונה הממוזערת צריכה להיות גדולה ככל האפשר:{' '}
        <Px>3840×2160</Px> ביחס 16:9 לסרטונים, ו-<Px>2160×3840</Px> ביחס 9:16 ל-Shorts, ברוחב מינימלי של 640. מהטלפון
        אפשר להעלות קובץ עד 2MB, ומהמחשב עד 50MB. אם הקובץ יוצא גדול מדי, הכלי יראה את זה ליד כפתור ההורדה.
      </p>
      <h3>X (טוויטר)</h3>
      <p>
        <External id="xAdSpecs">מפרט המודעות של X</External> מונה את היחסים 1:1 (<Px>1080×1080</Px>), 16:9 (
        <Px>1920×1080</Px>), 1.91:1 (<Px>2064×1080</Px>), 9:16 (<Px>1080×1920</Px>), 4:5 (<Px>1440×1800</Px>) ו-2:3 (
        <Px>1080×1620</Px>), בקובץ של עד 5MB. לפרופיל <External id="xProfilePhoto">X ממליצה</External> על תמונה של{' '}
        <Px>400×400</Px> עד 2MB ועל תמונת כותרת של <Px>1500×500</Px>.
      </p>

      <h2>גודל תמונה לכרטיס העסק בגוגל</h2>
      <p>
        לתמונות בפרופיל העסק <External id="gbpPhotos">גוגל ממליצה</External> על JPG או PNG בגודל שבין 10KB ל-5MB,
        ברזולוציה של <Px>720×720</Px> ולא פחות מ-<Px>250×250</Px>. זה המספר היחיד שגוגל מפרסמת, ולכן הוא הגודל שבחרנו
        ללוגו.
      </p>
      <p>
        לתמונת השער ולתמונות בעדכונים גוגל לא מפרסמת גודל. במדריכים, למשל{' '}
        <External id="semrushGbp">של Semrush</External>, מקובל <Px>1024×576</Px> ביחס 16:9 לשער ו-<Px>1200×900</Px>{' '}
        ביחס 4:3 לעדכונים. גוגל גם כותבת שתמונת השער שבחרתם לא תמיד תוצג ראשונה בפרופיל.
      </p>

      <h2>למה התמונה יוצאת מטושטשת אחרי ההעלאה</h2>
      <ul>
        <li>
          <strong>הרשת שינתה את הגודל.</strong> תמונה שלא בגודל או ביחס שהרשת מצפה להם עוברת הקטנה, הגדלה או חיתוך. קובץ
          שכבר בגודל המדויק עובר פחות שינויים.
        </li>
        <li>
          <strong>התמונה קטנה מדי.</strong> חלק קטן מתמונה שמוגדל למסך שלם יוצא רך. הכלי מתריע כשהחלק שבחרתם קטן מהגודל
          שתורידו, ואז כדאי לבחור פחות זום או תמונה גדולה יותר.
        </li>
        <li>
          <strong>טקסט ולוגו ב-JPEG.</strong> בדחיסה של JPEG נוצרים כתמים סביב קווים חדים. לגרפיקה עם טקסט נסו PNG, או
          JPEG באיכות 90 ומעלה.
        </li>
      </ul>
      <p>
        התמונות האלה מיועדות לרשתות. לתמונות באתר עצמו, שבהן משקל הקובץ משפיע על מהירות הטעינה, יש לנו כלי{' '}
        <Link href="/tools/image-compressor">להקטנת תמונות ולהמרה ל-WebP</Link>.
      </p>

      <h2>מקורות</h2>
      <ul className={styles.sources}>
        {usedSources().map((id) => (
          <li key={id}>
            <a href={socialSources[id].href} rel="noopener" target="_blank" lang="en" dir="ltr">
              {socialSources[id].label}
            </a>
            {socialSources[id].official ? null : <span className={styles.tag}>מדריך, לא מקור רשמי</span>}
          </li>
        ))}
      </ul>
      <p className={styles.reviewed}>
        כל המידות נבדקו מול המקורות ב-<time dateTime={SIZES_CHECKED}>{SIZES_CHECKED_LABEL}</time>.
      </p>
    </ToolLayout>
  )
}
