import Link from 'next/link'
import EnToolLayout, { enToolMetadata, type EnToolFaqEntry } from '../_components/EnToolLayout'
import NoticePeriodCalculatorEn from '../_components/NoticePeriodCalculatorEn'

const SLUG = 'notice-period-calculator'
const META_TITLE = 'Israel Notice Period Calculator: Hoda\'a Mukdemet'
const DESCRIPTION =
  'Free calculator for the legal notice period in Israel: days owed on dismissal or resignation, for salaried and hourly employees, with the end date.'

const faq: EnToolFaqEntry[] = [
  {
    id: 'en-notice-faq-hourly',
    question: 'How much notice does an hourly employee get in Israel?',
    answer:
      'In the first year, one day for each month of work. In the second year, 14 days plus a day for every two months of work that year. In the third year, 21 days plus a day for every two months. After three years, the notice is a month. For example, an hourly employee who completed 18 months is entitled to 17 days.',
  },
  {
    id: 'en-notice-faq-resignation',
    question: 'How much notice do I give when I resign?',
    answer:
      'The same number of days as on dismissal, under Section 5 of the law. A salaried employee with more than a year gives a month, and an hourly employee reaches a month after three years. Someone who stops working without notice owes the employer the regular pay for the missing days, and the employer may offset it.',
  },
  {
    id: 'en-notice-faq-shabbat',
    question: 'Do Shabbat and holidays count as notice days?',
    answer:
      'Yes. The Interpretation Law applies: under Section 10(c), rest days and holidays count, except when they are the last days of the period. Under Section 10(a), the day notice is given does not count. So 14 days of notice given on a Sunday end on the Sunday two weeks later.',
  },
  {
    id: 'en-notice-faq-month',
    question: 'What does a month of notice mean?',
    answer:
      'A calendar month, not 30 days. Notice given on 15 March ends on 15 April. If the next month has no such date, as with notice given on 31 January, the period ends on the last day of February.',
  },
  {
    id: 'en-notice-faq-no-notice',
    question: 'What am I owed if my employer gave no notice?',
    answer:
      'Compensation equal to the regular pay for the notice period, under Section 7(a). An employer can also waive your work during the notice, fully or partly, as long as the regular pay for that period is paid (Section 6). Per the Ministry of Labor, an employee with unused vacation is also entitled to its redemption.',
  },
]

export const metadata = enToolMetadata({ slug: SLUG, metaTitle: META_TITLE, description: DESCRIPTION })

export default function EnNoticePeriodPage() {
  return (
    <EnToolLayout
      slug={SLUG}
      metaTitle={META_TITLE}
      description={DESCRIPTION}
      lede="Under Israel's Prior Notice Law, a salaried employee gets a month of notice after one year of work, and an hourly or daily employee after three years. Before that, notice is counted in days by seniority, and the same days apply when the employee resigns."
      tool={<NoticePeriodCalculatorEn />}
      faq={faq}
      chips={['Dismissal and resignation', 'Salaried and hourly', 'Notice end date']}
      cta={{
        text: 'Employee entitlements such as notice, sick days and recuperation pay can be calculated automatically in your CRM.',
        label: 'Business automation',
        href: '/en/services/automation',
      }}
    >
      <h2>Notice periods under the law</h2>
      <h3>Salaried employee (Section 3)</h3>
      <ul>
        <li>First six months: one day for each month of work.</li>
        <li>Seventh month to the end of the first year: 6 days plus 2.5 days for each month in that period.</li>
        <li>After the first year: one month.</li>
      </ul>
      <h3>Hourly or daily employee (Section 4)</h3>
      <ul>
        <li>First year: one day for each month of work.</li>
        <li>Second year: 14 days plus a day for every two months of work that year.</li>
        <li>Third year: 21 days plus a day for every two months of work that year.</li>
        <li>After the third year: one month.</li>
      </ul>
      <p>
        Seniority counts up to the notice day. Per the Ministry of Labor it includes absence for pregnancy and birth, and
        excludes unpaid leave unless a law says otherwise. The month of work follows the ministry&apos;s table: it is the
        month in which notice is given. The law does not say how to count a month that has begun, and in that gap the
        calculator follows the ministry.
      </p>

      <h2>Resigning</h2>
      <p>
        Section 5 applies the same rules to resignation. Per the Ministry of Labor, a contract can set longer notice than
        the law on dismissal, but not shorter, and on resignation a contract cannot set longer notice than the law.
      </p>

      <h2>Giving notice and counting days</h2>
      <p>
        Notice is given in writing and states the day it is given and the day the dismissal or resignation takes effect
        (Section 2(c)). For salaried employees, months 7 to 12 can produce half days such as 8.5 or 13.5. The law does not
        say how to round them, so write the end date explicitly. The rest of the rules are in the FAQ below.
      </p>

      <h2>Vacation and sick leave during notice</h2>
      <ul>
        <li>
          An employer cannot force you to use accrued vacation during notice. It can offset only vacation days beyond 14,
          for genuine reasons and in good faith.
        </li>
        <li>You may take vacation during notice if at least 14 days of it do not overlap the vacation.</li>
        <li>
          An employer cannot dismiss an employee absent through illness with accrued sick days, unless notice was given
          before the illness (Section 4A of the Sick Pay Law). Check your balance with the{' '}
          <Link href="/en/tools/sick-days-calculator">sick days calculator</Link>.
        </li>
        <li>
          Someone who completed a year also receives a proportional part of{' '}
          <Link href="/en/tools/recuperation-pay-calculator">recuperation pay</Link> for the last year.
        </li>
      </ul>

      <h2>When the law does not apply</h2>
      <p>
        It does not apply to an employee in special circumstances who cannot be required to work during notice, or to a
        dismissal with no severance entitlement under Sections 16 or 17 of the Severance Pay Law or a disciplinary tribunal
        decision. The law is a minimum: a collective agreement or contract can give more. Foreign workers, especially in
        caregiving, have special provisions. This is not legal advice.
      </p>
    </EnToolLayout>
  )
}
