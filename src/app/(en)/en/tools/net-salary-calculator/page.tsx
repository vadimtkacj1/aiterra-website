import Link from 'next/link'
import EnToolLayout, { enToolMetadata, type EnToolFaqEntry } from '../_components/EnToolLayout'
import NetSalaryCalculatorEn from '../_components/NetSalaryCalculatorEn'
import { ils } from '../_components/en-format'
import {
  BTL_MAX_INCOME_MONTHLY,
  BTL_REDUCED_LIMIT_MONTHLY,
  HISHTALMUT_SALARY_CEILING_MONTHLY,
  PENSION_CREDIT_SALARY_CEILING_MONTHLY,
  calculateSalary,
} from '@/lib/net-salary'
import styles from '../../../../(he)/(site)/tools/net-salary-calculator/page.module.css'

const SLUG = 'net-salary-calculator'
const META_TITLE = 'Israel Net Salary Calculator 2026: Gross to Net and Employer Cost'
const DESCRIPTION =
  'Free Israel gross to net salary calculator at 2026 rates: income tax, credit points, Bituach Leumi, health, pension and keren hishtalmut, plus net to gross and employer cost.'

const examples = [8_000, 12_000, 20_000, 30_000].map((gross) =>
  calculateSalary({ gross, creditPointsHundredths: 225, hishtalmut: false, severance: 'partial' }),
)

const faq: EnToolFaqEntry[] = [
  {
    id: 'en-net-faq-how',
    question: 'How is net salary calculated in Israel?',
    answer:
      'Four things come off the gross: income tax, National Insurance (Bituach Leumi), health insurance and the employee pension contribution of 6%. Income tax runs in brackets from 10% to 50%, less credit points worth ₪242 each per month and a 35% credit on the pension deposit. National Insurance and health are 4.27% on pay up to ₪7,703 and 12.17% above it. A keren hishtalmut takes another 2.5%.',
  },
  {
    id: 'en-net-faq-12k',
    question: 'What is the net from ₪12,000 gross?',
    answer:
      'For a man with 2.25 credit points and no keren hishtalmut, about ₪9,695 a month in 2026. A woman with 2.75 points gets about ₪121 more, since half a point is worth ₪121 a month. Children, a degree and military discharge add points and raise the net.',
  },
  {
    id: 'en-net-faq-employer',
    question: 'How much does an employee cost above gross?',
    answer:
      'Usually 17% to 20% above gross, and more with a keren hishtalmut. The employer pays National Insurance of 4.51% up to ₪7,703 and 7.6% above it, 6.5% to pension and 6% or 8.33% to severance. A keren hishtalmut adds 7.5%. An employee on ₪12,000 gross costs about ₪14,174 a month without one. Recuperation pay, travel and vacation come on top.',
  },
  {
    id: 'en-net-faq-reverse',
    question: 'How do I find the gross for a given net?',
    answer:
      'There is no simple reverse formula, because tax rises in brackets. Choose Net to gross, and the calculator tries gross amounts until it finds the smallest one that gives at least your net. If you negotiate on net, agree the gross in the contract, since a tax change would change the net.',
  },
  {
    id: 'en-net-faq-diff',
    question: 'Why does my payslip differ from the calculator?',
    answer:
      'The calculator assumes one job, a fixed salary for the year and pension on the full gross. A payslip can include a car or phone benefit, travel, overtime, disability insurance, union deductions, tax coordination and credit points not reported on Form 101. Check Form 101 and your payslip with payroll if the gap is large.',
  },
]

export const metadata = enToolMetadata({ slug: SLUG, metaTitle: META_TITLE, description: DESCRIPTION })

export default function EnNetSalaryPage() {
  return (
    <EnToolLayout
      slug={SLUG}
      metaTitle={META_TITLE}
      description={DESCRIPTION}
      lede="Enter a gross salary to get the net at 2026 Israeli rates, with income tax, National Insurance, health and pension shown line by line, and what the employee costs the employer. It also works in reverse, from a desired net to the gross."
      tool={<NetSalaryCalculatorEn />}
      faq={faq}
      chips={['2026 tax brackets', 'Gross to net and back', 'Employer cost']}
      cta={{
        text: 'Preparing payslips, Forms 101 and hours reports by hand? We connect payroll and HR systems so employee paperwork runs itself.',
        label: 'Business automation',
        href: '/en/services/automation',
      }}
    >
      <h2>How net salary works in 2026</h2>
      <h3>Income tax</h3>
      <p>
        Monthly brackets: 10% to ₪7,010, 14% to ₪10,060, 20% to ₪19,000, 31% to ₪25,100, 35% to ₪46,690 and 47% above,
        plus a 3% surtax above ₪60,130. Credit points are worth ₪242 each per month: 2.25 for a man and 2.75 for a woman,
        with more for children, a degree and military discharge. The employee pension deposit earns a 35% credit, on up to
        7% of pay up to {ils(PENSION_CREDIT_SALARY_CEILING_MONTHLY)} a month.
      </p>
      <h3>National Insurance and health</h3>
      <ul>
        <li>
          Up to {ils(BTL_REDUCED_LIMIT_MONTHLY)}: the employee pays 1.04% National Insurance and 3.23% health, 4.27% in
          total. The employer pays 4.51%.
        </li>
        <li>
          Above that, up to {ils(BTL_MAX_INCOME_MONTHLY)}: the employee pays 7% and 5.17%, 12.17% in total. The employer
          pays 7.6%.
        </li>
        <li>No contributions are due on pay above {ils(BTL_MAX_INCOME_MONTHLY)} a month.</li>
      </ul>
      <h3>Pension, severance and keren hishtalmut</h3>
      <p>
        Under the mandatory pension order, the employee contributes 6%, the employer 6.5% to pension and 6% to severance.
        Many employers contribute 8.33% to severance. In a keren hishtalmut the employee pays 2.5% and the employer 7.5%,
        and the employer deposit is tax-free on pay up to {ils(HISHTALMUT_SALARY_CEILING_MONTHLY)} a month.
      </p>

      <h2>Examples</h2>
      <div className={styles.tableWrap} role="region" aria-label="Net salary examples" tabIndex={0}>
        <table className={styles.table}>
          <caption>Monthly, man with 2.25 credit points, severance 6%, no keren hishtalmut</caption>
          <thead>
            <tr>
              <th scope="col">Gross</th>
              <th scope="col">Income tax</th>
              <th scope="col">National Insurance and health</th>
              <th scope="col">Pension</th>
              <th scope="col">Net</th>
              <th scope="col">Employer cost</th>
            </tr>
          </thead>
          <tbody>
            {examples.map((row) => (
              <tr key={row.gross}>
                <th scope="row">{ils(row.gross)}</th>
                <td>{ils(row.tax)}</td>
                <td>{ils(row.btl.total)}</td>
                <td>{ils(row.pension)}</td>
                <td>{ils(row.net)}</td>
                <td>{ils(row.employer.cost)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2>What the calculator leaves out</h2>
      <ul>
        <li>Car, phone and meal benefits, overtime, travel, recuperation pay and bonuses.</li>
        <li>Disability insurance, union deductions and supplementary insurance.</li>
        <li>Two jobs and tax coordination, and residents of towns with a tax benefit.</li>
        <li>Employees above retirement age or under 18, and controlling shareholders.</li>
      </ul>
      <p>
        See also the <Link href="/en/tools/severance-pay-calculator">severance pay calculator</Link> and, for freelancers,
        the <Link href="/en/tools/self-employed-tax-calculator">self-employed tax calculator</Link>. This is an estimate,
        not tax or payroll advice.
      </p>
    </EnToolLayout>
  )
}
