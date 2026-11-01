import EnToolLayout, { enToolMetadata, type EnToolFaqEntry } from '../_components/EnToolLayout'
import RecuperationPayCalculatorEn from '../_components/RecuperationPayCalculatorEn'
import { ilsFromAgorot } from '../_components/en-format'
import { DAY_RATE_AGOROT, computeYear, seniorityTable } from '@/lib/recuperation-pay'
import styles from '../../../../(he)/(site)/tools/recuperation-pay-calculator/page.module.css'

const SLUG = 'recuperation-pay-calculator'
const META_TITLE = 'Israel Recuperation Pay Calculator 2026 (Dmei Havraa)'
const DESCRIPTION =
  'Free calculator for dmei havraa in Israel: ₪451.50 a day in the private sector under the August 2026 extension order, 5 to 10 days by seniority, part-time and top-up from ₪418.'

const faq: EnToolFaqEntry[] = [
  {
    id: 'en-recuperation-faq-rate',
    question: 'What is the recuperation pay rate in Israel in 2026?',
    answer:
      '₪451.50 a day in the private sector, under the extension order signed on 16 August 2026 and published on 18 August. The rate had been ₪418 since 2023. According to the Ministry of Labor the order is retroactive, so anyone already paid for 2026 at the old rate is owed a top-up. Public service employees have a different rate.',
  },
  {
    id: 'en-recuperation-faq-days',
    question: 'How many recuperation days do I get?',
    answer:
      'Under the general extension order: 5 days in the first year, 6 in the second and third, 7 from the fourth to the tenth, 8 from the 11th to the 15th, 9 from the 16th to the 19th, and 10 from the 20th. Days follow seniority with the same employer. Sectors such as security, cleaning and event halls have their own orders.',
  },
  {
    id: 'en-recuperation-faq-eligibility',
    question: 'Who is entitled to dmei havraa?',
    answer:
      'An employee who completed a first year with the employer. Five days are paid for that year when it ends, and from then on also a proportional part for any part of a year. Part-time employees receive pay by job percentage. You do not need to prove you took a holiday. Someone who leaves before completing a year is not entitled under the general order.',
  },
  {
    id: 'en-recuperation-faq-part-time',
    question: 'How is recuperation pay calculated for part-time work?',
    answer:
      'Multiply the days by seniority by the job percentage and the daily rate. In the fourth year at half time: 7 days × 50% is 3.5 days, and × ₪451.50 is ₪1,580.25. After unpaid leave, also multiply by the share of months worked. The order sets no job percentage formula for hourly employees.',
  },
  {
    id: 'en-recuperation-faq-when',
    question: 'When is recuperation pay paid?',
    answer:
      'In one of the summer months, June to September, unless another date is agreed or customary. It can be paid in parts with the monthly salary if the employment agreement says so, and it must appear on the payslip. When a job ends, someone who completed a year also gets a proportional part for the last year, and claims follow the general seven-year limitation period.',
  },
]

export const metadata = enToolMetadata({ slug: SLUG, metaTitle: META_TITLE, description: DESCRIPTION })

const seniorityName = (from: number, to: number | null) => {
  if (to === null) return `Year ${from} and later`
  return from === to ? `Year ${from}` : `Years ${from}–${to}`
}

export default function EnRecuperationPayPage() {
  return (
    <EnToolLayout
      slug={SLUG}
      metaTitle={META_TITLE}
      description={DESCRIPTION}
      lede="Recuperation pay, or dmei havraa, in Israel's private sector is ₪451.50 a day in 2026, under the extension order published on 18 August 2026. An employee who completed a year of work receives 5 to 10 days a year by seniority, adjusted for part-time work."
      tool={<RecuperationPayCalculatorEn />}
      faq={faq}
      chips={['2026 extension order', 'Seniority and part-time', 'Top-up from ₪418']}
      cta={{
        text: 'Employee entitlements such as recuperation pay, sick days and notice can be calculated automatically in your CRM.',
        label: 'Business automation',
        href: '/en/services/automation',
      }}
    >
      <h2>Recuperation pay table 2026</h2>
      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <caption>Private sector, ₪451.50 a day, for a full year of work</caption>
          <thead>
            <tr>
              <th scope="col">Year of work</th>
              <th scope="col">Days</th>
              <th scope="col">Full time</th>
              <th scope="col">Half time</th>
            </tr>
          </thead>
          <tbody>
            {seniorityTable.map((row) => (
              <tr key={row.from}>
                <th scope="row">{seniorityName(row.from, row.to)}</th>
                <td>{row.days}</td>
                <td>{ilsFromAgorot(computeYear(row.from, 12, 10_000, DAY_RATE_AGOROT).amount)}</td>
                <td>{ilsFromAgorot(computeYear(row.from, 12, 5_000, DAY_RATE_AGOROT).amount)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2>How the calculation works</h2>
      <p>
        Days by seniority × job percentage × the share of the year worked × the daily rate. Maternity leave under the law
        counts; unpaid leave and other absence with no employment relationship do not. The rate rose from ₪418, so the
        top-up for anyone already paid at the old rate is ₪33.50 per recuperation day, and the calculator shows it.
      </p>

      <h2>Who the order covers</h2>
      <p>
        All employees and employers in Israel, except three groups: employees paid under public service collective
        agreements, employees linked to public service wage agreements, and employees in sheltered workplaces. It also does
        not apply where a collective agreement sets better terms, or in sectors with their own extension order, such as
        security, cleaning and event halls. Sector rates on the ministry&apos;s site can be years old, so check the
        current order for your sector.
      </p>
      <p>
        The rate comes from the extension order in Yalkut HaPirsumim 14863 of 18 August 2026. The result is an estimate and
        does not replace checking the agreement that applies to you.
      </p>
    </EnToolLayout>
  )
}
