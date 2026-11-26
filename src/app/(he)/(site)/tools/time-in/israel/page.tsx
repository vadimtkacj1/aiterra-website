import Link from 'next/link'
import ToolLayout, { toolMetadata, type ToolFaqEntry } from '../../../components/tools/ToolLayout'
import IsraelTime, { type WorldPlace } from '../../../components/tools/IsraelTime'
import styles from '../../../components/tools/TimeDifference.module.css'
import { TIME_DIFFERENCE_PATH, timeDifferenceSources } from '@/lib/time-difference'
import { timeInCity, timeInPages, timeInPath } from '@/lib/time-in-cities'
import { ISRAEL_TIME_PATH, israelCopy } from '@/lib/time-in-copy'

export const revalidate = 60

const places: WorldPlace[] = timeInPages.map((page) => ({
  place: page.place,
  zone: timeInCity(page).zone,
  href: timeInPath(page.slug),
}))

export async function generateMetadata() {
  const copy = israelCopy(new Date(), places.length)
  return toolMetadata({ path: ISRAEL_TIME_PATH, metaTitle: copy.metaTitle, description: copy.description })
}

const externalLink = (href: string, label: string) => (
  <a href={href} rel="noopener" target="_blank">
    {label}
  </a>
)

export default function IsraelTimePage() {
  const now = new Date()
  const copy = israelCopy(now, places.length)

  const faq: ToolFaqEntry[] = [
    {
      id: 'israel-time-faq-now',
      question: 'האם ישראל עכשיו בשעון קיץ או בשעון חורף?',
      answer: copy.nowAnswer,
    },
    ...(copy.nextSpring
      ? [
          {
            id: 'israel-time-faq-spring',
            question: `מתי עוברים לשעון קיץ ב-${new Date(copy.nextSpring.at).getUTCFullYear()}?`,
            answer: copy.springAnswer,
          },
        ]
      : []),
    ...(copy.nextAutumn
      ? [
          {
            id: 'israel-time-faq-autumn',
            question: `מתי עוברים לשעון חורף ב-${new Date(copy.nextAutumn.at).getUTCFullYear()}?`,
            answer: copy.autumnAnswer,
          },
        ]
      : []),
    {
      id: 'israel-time-faq-gmt',
      question: 'מה ההפרש בין שעון ישראל ל-GMT?',
      answer:
        'בחורף ישראל מקדימה את GMT בשעתיים, ובקיץ בשלוש. מול לונדון עצמה ההפרש הוא שעתיים כמעט כל השנה, כי גם בריטניה עוברת לשעון קיץ, ורק בכמה ימים במרץ, כשישראל עוברת לפניה, הוא מגיע לשלוש.',
    },
  ]

  return (
    <ToolLayout
      path={ISRAEL_TIME_PATH}
      title={copy.title}
      metaTitle={copy.metaTitle}
      description={copy.description}
      lede={copy.lede}
      chips={[`שעון ${copy.season}`, copy.utc]}
      tool={<IsraelTime places={places} renderedAt={now.getTime()} />}
      faq={faq}
      cta={{
        text: 'עסק שעובד עם לקוחות בחו״ל? מענה אוטומטי בוואטסאפ עונה להם גם כשבישראל לילה.',
        label: 'אוטומציה לעסקים',
        href: '/services/automation',
      }}
    >
      <h2>
        שעון קיץ ושעון חורף בישראל, {copy.year} עד {copy.year + 2}
      </h2>
      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <caption>מועדי המעבר בין שעון חורף לשעון קיץ בישראל</caption>
          <thead>
            <tr>
              <th scope="col">שנה</th>
              <th scope="col">שעון קיץ מתחיל</th>
              <th scope="col">שעון חורף מתחיל</th>
            </tr>
          </thead>
          <tbody>
            {copy.rows.map((row) => (
              <tr key={row.year}>
                <th scope="row">{row.year}</th>
                <td>{row.spring}</td>
                <td>{row.autumn}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p>{copy.ruleText}</p>
      <p>
        המעבר נעשה ב-02:00 בלילה. באביב השעון קופץ ל-03:00. בסתיו הוא חוזר ל-01:00, ולכן השעה שבין 01:00 ל-02:00
        עוברת באותו לילה פעמיים.
      </p>

      <h2>אזור הזמן של ישראל</h2>
      <p>
        בכל ישראל, מאילת ועד מטולה, יש אזור זמן אחד. בחורף הוא UTC+2 ונקרא IST (Israel Standard Time), ובקיץ UTC+3,
        IDT (Israel Daylight Time). בהגדרות של טלפון או מחשב הוא מופיע בשם Asia/Jerusalem.
      </p>
      <p>
        להפרש בתאריך מסוים, לטבלה של 62 ערים ולמציאת שעה לפגישה עם חו״ל:{' '}
        <Link href={TIME_DIFFERENCE_PATH}>הפרש השעות מישראל</Link>.
      </p>

      <h2>מקורות</h2>
      <ul>
        <li>{externalLink(timeDifferenceSources.kan.href, timeDifferenceSources.kan.label)}</li>
        <li>{externalLink(timeDifferenceSources.protocol.href, timeDifferenceSources.protocol.label)}</li>
        <li>
          {externalLink(timeDifferenceSources.iana.href, timeDifferenceSources.iana.label)}: התאריכים בטבלה מחושבים
          מכללי אזור הזמן Asia/Jerusalem
        </li>
      </ul>
    </ToolLayout>
  )
}
