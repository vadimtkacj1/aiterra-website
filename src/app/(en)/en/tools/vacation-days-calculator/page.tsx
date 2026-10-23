import EnToolLayout, { enToolMetadata, type EnToolFaqEntry } from '../_components/EnToolLayout'
import VacationDaysCalculatorEn from '../_components/VacationDaysCalculatorEn'
import {
  agencyBands,
  calculateVacation,
  defaultInput,
  seniorityTable,
  type VacationInput,
  type WorkWeek,
} from '@/lib/vacation-days'
import styles from '../../../../(he)/(site)/tools/vacation-days-calculator/page.module.css'

const SLUG = 'vacation-days-calculator'
const META_TITLE = 'Israel Vacation Days Calculator: Annual Leave by Seniority'
const DESCRIPTION =
  'How many vacation days you get in Israel under the Annual Leave Law and the extension order, for a 5-day or 6-day week, with proration for a partial year and full tables by seniority.'

const tables: { week: WorkWeek; caption: string }[] = [
  { week: '5', caption: 'Vacation days by seniority, 5-day work week (work days)' },
  { week: '6', caption: 'Vacation days by seniority, 6-day work week (work days)' },
]

const run = (patch: Partial<VacationInput>) => {
  const outcome = calculateVacation({ ...defaultInput(2026), ...patch })
  return outcome.kind === 'result' ? outcome : null
}

const veteran = run({ start: '2021-03-01', calendarYear: '2026', week: '5' })
const newcomer = run({ start: '2026-09-01', calendarYear: '2026', week: '5' })
const govExample = run({ mode: 'year', seniority: '5', coverage: 'full', week: '6', daysWorked: '150', orderApplies: false })

const daysText = (count: number) => (count === 1 ? '1 day' : `${count} days`)

const bandLabel = (from: number, to: number | null) => {
  if (to === null) return `${from} and over`
  return from === to ? String(from) : `${from}–${to}`
}

const faq: EnToolFaqEntry[] = [
  {
    id: 'en-vac-faq-law',
    question: 'How many vacation days do I get by law in Israel?',
    answer:
      'Under the Annual Leave Law, each of your first five years with the same employer gives 16 days including weekly rest: 12 work days in a 5-day week and 14 in a 6-day week. The number rises to 28 days from year 14. The extension order on the shorter work week gives more from year 6: 17 work days in a 5-day week, and 23 from year 9. You get whichever is higher.',
  },
  {
    id: 'en-vac-faq-first-year',
    question: 'How many vacation days do I get in my first year?',
    answer:
      '12 work days in a 5-day week and 14 in a 6-day week, under the law, which gives more than the extension order here. The first year is the calendar year in which you started. If you started mid-year and worked fewer than 240 days in it, you get a proportional share, for example half the days for 120 work days. A fraction of a day is not counted.',
  },
  {
    id: 'en-vac-faq-gross-net',
    question: 'What is the difference between gross and net vacation days?',
    answer:
      'The law counts vacation days gross: calendar days that include one weekly rest day for every seven days of vacation. So the 16 days in the law are 14 work days in a 6-day week and 12 work days in a 5-day week, according to the Ministry of Labor table. The extension order states the number of work days directly, net. The calculator shows work days, with the gross number under the law next to them.',
  },
  {
    id: 'en-vac-faq-carry',
    question: 'Can I carry vacation days over to the next year?',
    answer:
      'Partly. Under section 7 of the law vacation does not accumulate, but with the employer’s agreement you can take at least seven days a year and add the rest to the vacation of the next two years. A collective agreement, employment contract or workplace custom can give better rights.',
  },
  {
    id: 'en-vac-faq-redemption',
    question: 'Do I get paid for unused vacation days when I leave?',
    answer:
      'Yes. Under section 13 of the law, when employment ends the employer pays for unused vacation days an amount equal to the vacation pay you would have received had you taken the vacation on your last day of work. Vacation pay is your regular wage; for hourly or daily paid workers it is the average daily wage over the previous quarter. Claims under the law expire after three years.',
  },
]

export const metadata = enToolMetadata({ slug: SLUG, metaTitle: META_TITLE, description: DESCRIPTION })

export default function EnVacationDaysPage() {
  return (
    <EnToolLayout
      slug={SLUG}
      metaTitle={META_TITLE}
      description={DESCRIPTION}
      lede="In Israel you get 12 vacation days a year in a 5-day work week, or 14 in a 6-day week, for each of your first five years with an employer, rising to 23 or 26 days from year 9 under the extension order. The calculator compares the law with the extension order, gives you the higher number and prorates a partial year."
      tool={<VacationDaysCalculatorEn />}
      faq={faq}
      chips={['Law and extension order', '5-day or 6-day week', 'Partial year proration']}
      cta={{
        text: 'Vacation tracking, balances and payslips can update automatically in your business CRM, without manual spreadsheets.',
        label: 'Business automation',
        href: '/en/services/automation',
      }}
    >
      <h2>How many vacation days you get by seniority</h2>
      <p>
        Two sources set the number of days: the Annual Leave Law, 1951, and the extension order on introducing a
        shorter work week. The law counts gross days, which include one weekly rest day for every seven days of
        vacation. The order counts work days, net. Where they differ, the employee is entitled to the higher number.
        The tables show work days as published by the Ministry of Labor, including the amendment in force since 1
        January 2017.
      </p>
      {tables.map((table) => (
        <div key={table.week} className={styles.tableWrap} role="region" aria-label={table.caption} tabIndex={0}>
          <table className={styles.table}>
            <caption>{table.caption}</caption>
            <thead>
              <tr>
                <th scope="col">Year of seniority</th>
                <th scope="col">Under the law</th>
                <th scope="col">Under the extension order</th>
                <th scope="col">You get</th>
              </tr>
            </thead>
            <tbody>
              {seniorityTable(table.week).map((row) => (
                <tr key={row.year}>
                  <th scope="row">{row.year === 14 ? '14 and over' : row.year}</th>
                  <td>
                    {row.law}
                    <span className={styles.sub}>{row.lawGross} gross</span>
                  </td>
                  <td>{row.order}</td>
                  <td className={styles.best}>{row.best}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
      <p>
        In years 1 to 5 the law gives more. From year 6, wherever the order applies, the order gives more: 17 days in a
        5-day week and 19 in a 6-day week, and from year 9, 23 and 26. The law alone stops at 20 and 24 work days.
      </p>

      <h2>When the extension order does not apply</h2>
      <p>According to the Ministry of Labor, the order covers most employment in Israel, except:</p>
      <ul>
        <li>A workplace with fewer than four employees.</li>
        <li>Employees and employers whose move to a 5-day week was set in a collective agreement.</li>
        <li>A government company or a municipal company.</li>
        <li>An employer the supervisory committee decided the order does not apply to.</li>
      </ul>
      <p>
        In these cases only the law applies; untick the extension order box in the calculator. Workers employed through
        a staffing agency have a table in a separate extension order, from 2.8.2004:
      </p>
      <div className={styles.tableWrap} role="region" aria-label="Vacation days for staffing agency workers" tabIndex={0}>
        <table className={styles.table}>
          <caption>Vacation days for staffing agency workers (work days)</caption>
          <thead>
            <tr>
              <th scope="col">Year of seniority</th>
              <th scope="col">5-day week</th>
              <th scope="col">6-day week</th>
            </tr>
          </thead>
          <tbody>
            {agencyBands.map((band) => (
              <tr key={band.from}>
                <th scope="row">{bandLabel(band.from, band.to)}</th>
                <td>{band.five}</td>
                <td>{band.six}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2>Work year, partial year and proration</h2>
      <p>
        A work year under the law is a calendar year, 1 January to 31 December (section 1). The year you started is
        your first year of seniority, even if you started in November. Within each year, what counts is the number of
        days actually worked (section 3):
      </p>
      <ul>
        <li>
          <strong>You worked the whole year:</strong> from 200 work days you get all the days. Below 200, a proportional
          share: days worked divided by 200.
        </li>
        <li>
          <strong>You worked only part of the year:</strong> from 240 work days you get all the days. Below 240, days
          worked divided by 240.
        </li>
        <li>A fraction of a vacation day is not counted, so the result is rounded down.</li>
      </ul>
      <h3>Three worked examples</h3>
      {veteran ? (
        <p>
          An employee who started on 1 March 2021, in a 5-day week: 2026 is their year {veteran.seniorityYear} of
          seniority. The law gives {veteran.entitlement.law} days and the order {veteran.entitlement.order}, so they get{' '}
          {daysText(veteran.days)}.
        </p>
      ) : null}
      {newcomer && newcomer.daysWorked !== null ? (
        <p>
          An employee who started on 1 September 2026, in a 5-day week, has about {newcomer.daysWorked} work days until
          the end of the year, after holidays. That is fewer than 240, so she gets {newcomer.entitlement.best} ×{' '}
          {newcomer.daysWorked} ÷ 240, which is {daysText(newcomer.days)} for 2026. From 2027 she is in her second year.
        </p>
      ) : null}
      {govExample ? (
        <p>
          The Ministry of Labor’s own example: an employee in year 5, in a 6-day week, employed the whole year but
          actually working only 150 days. 14 × 150 ÷ 200 is 10.5, so he gets {daysText(govExample.days)}.
        </p>
      ) : null}

      <h2>Vacation pay and payment for unused days</h2>
      <p>
        Vacation days are paid at the regular wage (section 10). For a monthly salaried employee that is the salary they
        would have received had they kept working. For hourly or daily paid workers it is the average daily wage: the
        pay for the quarter before the vacation divided by 90, times the number of vacation days. An employee who leaves
        without using their vacation receives payment equal to the vacation pay (section 13). A paid worker who worked
        fewer than 75 consecutive days gets no vacation days but a payment of at least 4% of wages instead (sections 4
        and 15). Claims under the law expire after three years (section 31).
      </p>

      <h2>What the calculator does not cover</h2>
      <ul>
        <li>
          <strong>Employees under 18.</strong> Section 27 of the Youth Labour Law gives minors longer vacation, but it
          refers to the old wording of the Annual Leave Law, so the calculator does not cover them.
        </li>
        <li>
          <strong>Extended vacation.</strong> Some jobs, such as work with ionising radiation, glass manufacturing and
          certain hospital professions, have longer vacation under regulations. Industries such as agriculture, metal,
          electricity and electronics have their own agreements and extension orders.
        </li>
        <li>
          <strong>Money.</strong> The calculator counts days, not pay.
        </li>
      </ul>
      <p className={styles.caveat}>
        Days follow the Annual Leave Law, 1951, and the shorter work week extension order, as published by the Ministry
        of Labor; the employee is entitled to the more favourable of the two. This is general information, not legal
        advice.
      </p>

      <h2>Sources</h2>
      <ul>
        <li>
          <a href="https://www.gov.il/he/pages/annual-vacations?chapterIndex=2" rel="noopener" target="_blank">
            Ministry of Labor (gov.il)
          </a>
          : rules for calculating vacation days, including the proration examples
        </li>
        <li>
          <a href="https://www.gov.il/he/pages/annual-vacations?chapterIndex=3" rel="noopener" target="_blank">
            Ministry of Labor (gov.il)
          </a>
          : vacation days by seniority under the law, the extension order and for staffing agency workers
        </li>
        <li>
          <a href="https://www.gov.il/he/pages/annual-vacations?chapterIndex=5" rel="noopener" target="_blank">
            Ministry of Labor (gov.il)
          </a>
          : vacation pay and payment for unused vacation
        </li>
        <li>Annual Leave Law, 1951: sections 1, 3, 4, 5, 6, 7, 10, 13, 15 and 31</li>
      </ul>
    </EnToolLayout>
  )
}
