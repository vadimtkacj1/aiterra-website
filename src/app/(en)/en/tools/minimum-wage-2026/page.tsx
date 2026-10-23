import EnToolLayout, { enToolMetadata, type EnToolFaqEntry } from '../_components/EnToolLayout'
import MinimumWageCalculatorEn from '../_components/MinimumWageCalculatorEn'
import { calculateMinimumWage, defaultInput, scopeTable, wagePeriods, youthTable, type AgeGroup } from '@/lib/minimum-wage'
import styles from '../../../../(he)/(site)/tools/minimum-wage-2026/page.module.css'

const SLUG = 'minimum-wage-2026'
const META_TITLE = 'Israel Minimum Wage 2026: Monthly, Hourly and Youth Rates'
const DESCRIPTION =
  'Israel minimum wage from 1 April 2026: ₪6,443.85 a month and ₪35.40 an hour. Calculator by age, job scope and hours, with a check of whether your pay meets the minimum.'

const moneyFormat = new Intl.NumberFormat('en-IL', {
  style: 'currency',
  currency: 'ILS',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})
const money = (agorot: number) => moneyFormat.format(agorot / 100)

const youthLabels: Record<AgeGroup, string> = {
  adult: 'Age 18 and over',
  age17: 'Age 17',
  age16: 'Age 16',
  under16: 'Under 16',
  apprentice: 'Apprentice',
}

const [current, previous] = wagePeriods
const adultRows = [
  { label: 'Per month, full time', current: current.adult.monthly, previous: previous.adult.monthly },
  { label: 'Per hour, by 182 hours a month', current: current.adult.hourly182, previous: previous.adult.hourly182 },
  { label: 'Per hour, by the 186 hours in the law', current: current.adult.hourly186, previous: previous.adult.hourly186 },
  { label: 'Per day, 5-day week', current: current.adult.daily5, previous: previous.adult.daily5 },
  { label: 'Per day, 6-day week', current: current.adult.daily6, previous: previous.adult.daily6 },
]
const youthCurrent = youthTable('2026')
const youthPrevious = youthTable('2025')
const scopeRows = scopeTable()

const example = calculateMinimumWage({ ...defaultInput, basis: 'hourly', hours: '120', paid: '34' })
const backPay = calculateMinimumWage({ ...defaultInput, period: '2025', basis: 'hourly', hours: '120', paid: '34' })
const exampleMinimum = example.kind === 'result' ? example.minimum : 0
const exampleTotal = example.kind === 'result' && example.quantity ? example.quantity.total : 0
const exampleGap = example.kind === 'result' && example.check?.totalGap ? example.check.totalGap : 0
const backPayMinimum = backPay.kind === 'result' ? backPay.minimum : 0
const backPayTotal = backPay.kind === 'result' && backPay.quantity ? backPay.quantity.total : 0
const backPayGap = backPay.kind === 'result' && backPay.check?.totalGap ? backPay.check.totalGap : 0

const faq: EnToolFaqEntry[] = [
  {
    id: 'en-mw-faq-2026',
    question: 'What is the minimum wage in Israel in 2026?',
    answer:
      'From 1 April 2026 the minimum wage for an employee aged 18 or over is ₪6,443.85 a month for a full-time job, ₪35.40 an hour, ₪297.40 a day in a 5-day week and ₪257.75 a day in a 6-day week. Until 31 March 2026 the monthly amount was ₪6,247.67. These are the figures published by National Insurance (Bituach Leumi) and the Ministry of Labor. A collective agreement, an industry extension order or your own contract can set higher pay.',
  },
  {
    id: 'en-mw-faq-hourly',
    question: 'What is the hourly minimum wage in Israel?',
    answer:
      '₪35.40 an hour for an employee aged 18 or over, from 1 April 2026. The law divides the monthly wage by 186 hours, which gives ₪34.64, but the extension order shortening the work week, in force since 1 April 2018, sets the calculation at 182 hours a month. That is why the Ministry of Labor gives ₪35.40 as the hourly rate. For youth the hourly rate is lower: 1/173 of their monthly rate.',
  },
  {
    id: 'en-mw-faq-youth',
    question: 'What is the minimum wage for 16 and 17 year olds?',
    answer:
      'Under the youth minimum wage regulations, a 17-year-old gets at least 83% of the minimum wage, a 16-year-old at least 75%, and under 16 at least 70%. From 1 April 2026 that is ₪5,348.39 a month and ₪30.91 an hour at 17, and ₪4,832.88 a month and ₪27.93 an hour at 16. Full time for youth is 40 hours a week, and part-time pay is proportional.',
  },
  {
    id: 'en-mw-faq-part-time',
    question: 'How is the minimum wage calculated for a part-time job?',
    answer:
      'Under section 2(b) of the Minimum Wage Law, a part-time employee is entitled to a minimum wage proportional to the job scope. In a half-time job the monthly minimum is ₪3,221.92, and in a 75% job ₪4,832.88. If you are paid by the hour, simply check the rate: every hour must be paid at least ₪35.40.',
  },
  {
    id: 'en-mw-faq-underpaid',
    question: 'What can I do if I am paid below the minimum wage?',
    answer:
      'The right to the minimum wage cannot be waived, not even in writing. You can show your employer the calculation and ask for the difference. If they do not pay, you can file a claim at the Labour Court, yourself or through a workers’ organisation, and the court may award increased compensation for late payment. Not paying the minimum wage is a criminal offence, and the Ministry of Labor can also impose a financial sanction on the employer. This applies to foreign workers too.',
  },
]

export const metadata = enToolMetadata({ slug: SLUG, metaTitle: META_TITLE, description: DESCRIPTION })

export default function EnMinimumWagePage() {
  return (
    <EnToolLayout
      slug={SLUG}
      metaTitle={META_TITLE}
      description={DESCRIPTION}
      lede="From 1 April 2026 the minimum wage in Israel is ₪6,443.85 a month for a full-time job and ₪35.40 an hour. For youth and apprentices it is 60% to 83% of that amount. Use the calculator to check, by age, job scope and hours, whether your pay meets the minimum."
      tool={<MinimumWageCalculatorEn />}
      faq={faq}
      chips={['Rates from 1 April 2026', 'Adults, youth and apprentices', 'Check the pay you received']}
      cta={{
        text: 'Payroll, vacation and working-hours calculations can run automatically in your business CRM, without manual spreadsheets.',
        label: 'Business automation',
        href: '/en/services/automation',
      }}
    >
      <h2>Israel minimum wage 2026: all the amounts</h2>
      <p>
        The minimum wage is set by the Minimum Wage Law, 1987, at 47.5% of the average wage as it stands on 1 April
        each year. The Minister of Labor publishes the updated amount in the official gazette, and National Insurance
        and the Ministry of Labor publish the hourly and daily rates derived from it. The amounts below apply to
        employees aged 18 and over. The next update is expected on 1 April 2027.
      </p>
      <div className={styles.tableWrap} role="region" aria-label="Minimum wage for employees aged 18 and over" tabIndex={0}>
        <table className={styles.table}>
          <caption>Minimum wage for employees aged 18 and over</caption>
          <thead>
            <tr>
              <th scope="col">Type of pay</th>
              <th scope="col">From 1.4.2026</th>
              <th scope="col">1.4.2025 to 31.3.2026</th>
            </tr>
          </thead>
          <tbody>
            {adultRows.map((row) => (
              <tr key={row.label}>
                <th scope="row">{row.label}</th>
                <td>{money(row.current)}</td>
                <td>{money(row.previous)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p>
        The last column is for checking pay you already received: work up to 31 March 2026 is covered by the previous
        amount, and work from 1 April 2026 by the new one. Choose the period in the first field of the calculator.
      </p>

      <h2>Hourly minimum wage: ₪35.40 or ₪34.64?</h2>
      <p>
        Both numbers appear on the National Insurance website. The law defines the hourly minimum wage as 1/186 of the
        monthly wage, which gives ₪34.64. The extension order shortening the work week, in force since 1 April 2018,
        says the hourly wage is calculated by 182 hours a month, so the Ministry of Labor gives ₪35.40 as the current
        hourly rate. That is also the rate the calculator checks against.
      </p>

      <h2>Minimum wage for youth and apprentices by age</h2>
      <p>
        An employee under 18 is entitled to a percentage of the minimum wage under the youth and apprentices
        regulations: 83% from age 17, 75% at 16 and 70% under 16. An apprentice under the Apprenticeship Law who
        studies at least two days a week is entitled to 60%. Full time for a minor is 40 hours a week, and the hourly
        minimum is 1/173 of their monthly rate.
      </p>
      <div className={styles.tableWrap} role="region" aria-label="Minimum wage for youth and apprentices" tabIndex={0}>
        <table className={styles.table}>
          <caption>Minimum wage for youth and apprentices, full time</caption>
          <thead>
            <tr>
              <th scope="col">Age</th>
              <th scope="col">Percent</th>
              <th scope="col">Monthly from 1.4.2026</th>
              <th scope="col">Hourly from 1.4.2026</th>
              <th scope="col">Monthly until 31.3.2026</th>
            </tr>
          </thead>
          <tbody>
            {youthCurrent.map((row, index) => (
              <tr key={row.id}>
                <th scope="row">{youthLabels[row.id]}</th>
                <td>{row.percent}%</td>
                <td>{money(row.monthly)}</td>
                <td>{money(row.hourly)}</td>
                <td>{money(youthPrevious[index].monthly)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p>
        The amounts are truncated to the agora, the same way the Ministry of Labor rounds its own table. For youth and
        apprentices a fixed supplement is not counted towards the minimum wage, and no daily minimum wage is published
        for them, so the calculator shows monthly and hourly rates only.
      </p>

      <h2>Part-time jobs and daily pay</h2>
      <p>A part-time employee is entitled to a minimum wage proportional to the job scope (section 2(b)). For an employee aged 18 or over:</p>
      <div className={styles.tableWrap} role="region" aria-label="Minimum wage by job scope" tabIndex={0}>
        <table className={styles.table}>
          <caption>Monthly minimum wage by job scope, age 18 and over</caption>
          <thead>
            <tr>
              <th scope="col">Job scope</th>
              <th scope="col">From 1.4.2026</th>
              <th scope="col">Until 31.3.2026</th>
            </tr>
          </thead>
          <tbody>
            {scopeRows.map((row) => (
              <tr key={row.scope}>
                <th scope="row">{row.scope}%</th>
                <td>{money(row.current)}</td>
                <td>{money(row.previous)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p>
        The daily minimum wage is 1/25 of the monthly wage for a 6-day week and 1/21⅔ for a 5-day week (section 1). Under
        1998 regulations, the daily wage may not be lower than what the employee would get at the hourly minimum wage.
      </p>

      <h2>Which pay components count</h2>
      <p>The check is made on pay for a regular working day (section 3), so overtime pay does not top up the minimum wage. Under section 3(b):</p>
      <ul>
        <li>
          <strong>Counted:</strong> basic or combined salary, a cost-of-living supplement if not already included, and a
          fixed supplement paid because of the work.
        </li>
        <li>
          <strong>Not counted:</strong> family supplement, seniority supplement, shift supplement, bonuses, a 13th salary,
          annual grants and expense refunds, including meals, subsistence and travel.
        </li>
      </ul>

      <h2>Worked example: checking an hourly worker’s pay</h2>
      <p>
        A 19-year-old worked 120 hours in May 2026 at ₪34 an hour. The hourly minimum wage is {money(exampleMinimum)},
        so for 120 hours she is owed at least {money(exampleTotal)}. She received ₪4,080.00, which is{' '}
        {money(exampleGap)} short.
      </p>
      <p>
        If the same 120 hours had been worked in March 2026, the previous rate of {money(backPayMinimum)} an hour would
        apply. She would be owed at least {money(backPayTotal)}, and the shortfall would be {money(backPayGap)}. Check
        back pay month by month, using the rate in force in each month.
      </p>

      <h2>What the calculator does not cover</h2>
      <ul>
        <li>
          <strong>Employees with disabilities and reduced work capacity.</strong> They have an adjusted minimum wage by
          work capacity, under separate regulations.
        </li>
        <li>
          <strong>Industry minimum wages.</strong> Construction, renovation, cleaning, guarding and security have
          collective agreements and extension orders with their own, usually higher, rates.
        </li>
        <li>
          <strong>Other rights.</strong> The minimum wage is only the floor. Vacation, sick pay, recuperation pay and
          pension are paid on top of it.
        </li>
      </ul>
      <p className={styles.caveat}>
        Amounts follow the Minimum Wage Law, 1987, and National Insurance and Ministry of Labor publications for the
        period from 1.4.2026. This is general information, not legal advice.
      </p>

      <h2>Sources</h2>
      <ul>
        <li>
          <a
            href="https://www.btl.gov.il/Mediniyut/GeneralData/Pages/%D7%A9%D7%9B%D7%A8%20%D7%9E%D7%99%D7%A0%D7%99%D7%9E%D7%95%D7%9D.aspx"
            rel="noopener"
            target="_blank"
          >
            National Insurance Institute (Bituach Leumi)
          </a>
          : minimum wage amounts from 1.4.2026 and 1.4.2025
        </li>
        <li>
          <a href="https://www.gov.il/he/pages/minimum-wage?chapterIndex=2" rel="noopener" target="_blank">
            Ministry of Labor (gov.il)
          </a>
          : minimum wage for adults, including the 182-hour calculation
        </li>
        <li>
          <a href="https://www.gov.il/he/pages/minimum-wage?chapterIndex=3" rel="noopener" target="_blank">
            Ministry of Labor (gov.il)
          </a>
          : minimum wage for youth
        </li>
        <li>Minimum Wage Law, 1987, and the Minimum Wage (Working Youth and Apprentices) Regulations, 1988</li>
      </ul>
    </EnToolLayout>
  )
}
