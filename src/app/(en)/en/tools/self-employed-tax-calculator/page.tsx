import EnToolLayout, { enToolMetadata, type EnToolFaqEntry } from '../_components/EnToolLayout'
import SelfEmployedTaxCalculatorEn from '../_components/SelfEmployedTaxCalculatorEn'
import {
  ANNUAL_SURTAX_THRESHOLD,
  BTL_MAX_INCOME_MONTHLY,
  BTL_MIN_INCOME_MONTHLY,
  BTL_REDUCED_LIMIT_MONTHLY,
  CREDIT_POINT_ANNUAL,
  calculateIncomeTax,
  type BracketRow,
} from '@/lib/self-employed-tax'
import styles from '../../../../(he)/(site)/tools/self-employed-tax-calculator/page.module.css'

const SLUG = 'self-employed-tax-calculator'
const META_TITLE = 'Israel Self-Employed Tax Calculator 2026: Income Tax and Bituach Leumi'
const DESCRIPTION =
  'Estimate income tax, National Insurance (Bituach Leumi) and health insurance for a self-employed person in Israel at 2026 rates: tax by bracket and credit points, net per month and year, and estimated advances.'

const numberFormat = new Intl.NumberFormat('en-IL', { maximumFractionDigits: 0 })
const num = (amount: number) => numberFormat.format(amount)
const rate = (basisPoints: number) => `${basisPoints / 100}%`

const bracketText = (row: BracketRow) => {
  if (row.to === null) return `Over ${num(row.from - 1)}`
  if (row.from === 0) return `Up to ${num(row.to)}`
  return `${num(row.from)} to ${num(row.to)}`
}

const annualRows = calculateIncomeTax(0, 0, 12).rows
const monthlyRows = calculateIncomeTax(0, 0, 1).rows

const faq: EnToolFaqEntry[] = [
  {
    id: 'en-set-faq-how-much',
    question: 'How much tax does a self-employed person pay in Israel in 2026?',
    answer:
      'It depends on profit. Income tax is charged in brackets of 10%, 14%, 20%, 31%, 35% and 47% on profit after expenses, minus credit points: 2.25 for a man and 2.75 for a woman, worth ₪2,904 each a year. On top come National Insurance and health contributions: 7.7% on income up to ₪7,703 a month and 18% on the part above. A self-employed person with a profit of ₪150,000 a year pays about ₪28,200 in total, roughly 18.8% of profit.',
  },
  {
    id: 'en-set-faq-exempt',
    question: 'Is income tax different for an osek patur and an osek murshe?',
    answer:
      'No. For income tax and National Insurance both pay by the same brackets and rates on profit after deductible expenses. The difference is VAT: an osek patur (exempt dealer) does not charge VAT, and an osek murshe (licensed dealer) charges VAT and passes it to the Israel Tax Authority. So an osek murshe enters revenue without VAT, and an osek patur enters everything received from clients.',
  },
  {
    id: 'en-set-faq-btl',
    question: 'How much National Insurance does a self-employed person pay?',
    answer:
      'In 2026 a self-employed person pays 7.7% on the part of monthly income up to ₪7,703: 4.47% National Insurance and 3.23% health insurance. On the part above that, up to ₪51,910 a month, the rate is 18%: 12.83% and 5.17%. Nothing is paid on income above the ceiling. Anyone earning less than ₪3,442 a month pays on that minimum income. The income for the calculation is profit minus 52% of the National Insurance contributions themselves.',
  },
  {
    id: 'en-set-faq-credit-point',
    question: 'How much is a tax credit point worth in 2026?',
    answer:
      'A credit point is worth ₪242 a month, ₪2,904 a year, the same as in 2024 and 2025, because indexation was frozen by law for 2025 to 2027. Points reduce the tax itself, not the income. An Israeli resident gets 2.25 points and a woman 2.75, with extra points for children, a degree, army discharge, aliyah and more. Unused points in a year are not refunded.',
  },
  {
    id: 'en-set-faq-advances',
    question: 'How are tax advances (mikdamot) calculated for the self-employed?',
    answer:
      'The Israel Tax Authority can set advances as a percentage of turnover, based on the ratio of tax to turnover in the reference year (section 175 of the Income Tax Ordinance). The calculator gives an approximation: annual income tax divided by 12, with the percentage of turnover beside it. If this year’s tax will be lower, you can ask the assessing officer to reduce the advances. National Insurance advances can be corrected when income changes by at least 10%.',
  },
]

export const metadata = enToolMetadata({ slug: SLUG, metaTitle: META_TITLE, description: DESCRIPTION })

export default function EnSelfEmployedTaxPage() {
  return (
    <EnToolLayout
      slug={SLUG}
      metaTitle={META_TITLE}
      description={DESCRIPTION}
      lede="A self-employed person in Israel pays income tax in brackets from 10% to 47% on profit, minus credit points, plus National Insurance and health contributions of 7.7% up to ₪7,703 a month and 18% above it. Enter your revenue and expenses to estimate all three at 2026 rates, with net income per month and year and estimated advances."
      tool={<SelfEmployedTaxCalculatorEn />}
      faq={faq}
      chips={['2026 tax brackets', 'Bituach Leumi and health', 'Osek patur and osek murshe']}
      cta={{
        text: 'Issuing invoices and updating income by hand? We connect invoicing, bank and CRM so you know your profit in real time.',
        label: 'Business automation',
        href: '/en/services/automation',
      }}
    >
      <h2>How tax is calculated for the self-employed in Israel in 2026</h2>
      <p>
        A self-employed person (atzmai) pays three things on profit: income tax, National Insurance (Bituach Leumi)
        contributions and health insurance contributions. Profit is business revenue minus deductible expenses. An
        osek patur and an osek murshe follow the same rules; the only difference between them is VAT.
      </p>

      <h3>Income tax brackets for 2026</h3>
      <p>
        Income tax is charged in brackets: each rate applies only to the part of income inside that bracket. Section
        121 of the Income Tax Ordinance was amended on 31 March 2026, widening the 20% and 31% brackets from 1 January
        2026. These are the brackets for income from personal exertion, which includes business income where the owner
        works in the business:
      </p>
      <div className={styles.tableWrap} role="region" aria-label="Income tax brackets 2026" tabIndex={0}>
        <table className={styles.table}>
          <caption>Israel income tax brackets 2026, in shekels</caption>
          <thead>
            <tr>
              <th scope="col">Taxable income per year</th>
              <th scope="col">Per month</th>
              <th scope="col">Rate</th>
            </tr>
          </thead>
          <tbody>
            {annualRows.map((row, index) => (
              <tr key={row.rateBasisPoints}>
                <th scope="row">{bracketText(row)}</th>
                <td>{bracketText(monthlyRows[index])}</td>
                <td>{rate(row.rateBasisPoints)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p>
        Taxable income above ₪{num(ANNUAL_SURTAX_THRESHOLD)} a year (₪{num(ANNUAL_SURTAX_THRESHOLD / 12)} a month) also
        pays a 3% surtax, so the top shekel is taxed at 50%.
      </p>

      <h3>Credit points</h3>
      <p>
        Credit points are subtracted from the tax worked out by the brackets. In 2026 a point is worth ₪
        {num(CREDIT_POINT_ANNUAL)} a year, ₪242 a month. Every Israeli resident gets 2.25 points; a woman gets another
        half point, so 2.75. Children, an academic degree, army discharge, aliyah and combat reserve duty add points.
        When the points are worth more than the tax, the tax is 0 and the remainder is not refunded.
      </p>

      <h3>National Insurance and health insurance</h3>
      <p>National Insurance calculates a self-employed person’s contributions in two tiers of monthly income:</p>
      <ul>
        <li>Up to ₪{num(BTL_REDUCED_LIMIT_MONTHLY)} a month: 4.47% National Insurance and 3.23% health insurance, 7.7% in total.</li>
        <li>
          From ₪{num(BTL_REDUCED_LIMIT_MONTHLY)} up to ₪{num(BTL_MAX_INCOME_MONTHLY)} a month: 12.83% National Insurance
          and 5.17% health, 18% in total.
        </li>
        <li>No contributions are paid on income above ₪{num(BTL_MAX_INCOME_MONTHLY)} a month.</li>
        <li>
          Anyone whose income is below ₪{num(BTL_MIN_INCOME_MONTHLY)} a month pays on a minimum income of ₪
          {num(BTL_MIN_INCOME_MONTHLY)}.
        </li>
      </ul>
      <p>
        The income on which contributions are calculated is profit minus 52% of the National Insurance contributions
        themselves, not including health. The same 52% is also deductible for income tax under section 47A of the
        Ordinance, and the calculator subtracts it from taxable income.
      </p>

      <h2>Worked example: ₪150,000 profit a year</h2>
      <p>A self-employed man with ₪180,000 revenue and ₪30,000 deductible expenses in 2026, with no extra credit points:</p>
      <ol>
        <li>Profit: 180,000 minus 30,000 = ₪150,000.</li>
        <li>National Insurance base, after deducting 52% of National Insurance contributions: ₪144,386.</li>
        <li>National Insurance: 92,436 × 4.47% = ₪4,132, plus 51,950 × 12.83% = ₪6,665. Total ₪10,797.</li>
        <li>Health insurance: 92,436 × 3.23% = ₪2,986, plus 51,950 × 5.17% = ₪2,686. Total ₪5,672.</li>
        <li>Taxable income: 150,000 minus ₪5,614 (52% of ₪10,797) = ₪144,386.</li>
        <li>Tax by brackets: 84,120 × 10% = ₪8,412, plus 36,600 × 14% = ₪5,124, plus 23,666 × 20% = ₪4,733. Total ₪18,269.</li>
        <li>Minus 2.25 credit points, ₪6,534: income tax of ₪11,735.</li>
      </ol>
      <p>
        That is ₪28,204 in total, 18.8% of profit. He keeps ₪121,796 a year, about ₪10,150 a month. Estimated advances:
        about ₪978 a month for income tax, roughly 6.5% of turnover, and about ₪1,372 a month for National Insurance and
        health.
      </p>

      <h2>What the calculator leaves out</h2>
      <p>
        The estimate is for an Israeli tax resident aged 18 up to retirement age whose business is their only income.
        It does not include:
      </p>
      <ul>
        <li>Pension and study fund (keren hishtalmut) deposits, which reduce tax. If you make them, your real tax will be lower.</li>
        <li>Special credits, such as for children, a degree, aliyah, reserve duty and donations. You can add points by hand.</li>
        <li>Tax benefits for residents of qualifying localities (section 11 of the Ordinance).</li>
        <li>A salary in the same year: salaried and self-employed income are taxed together by the brackets.</li>
        <li>Non-exertion income such as rent, interest and capital gains, which have other rates.</li>
        <li>People past retirement age, who pay National Insurance at different rates.</li>
      </ul>
      <p>
        New immigrants (olim) and returning residents may have additional credit points and, in some cases, exemptions
        on foreign income; check these with an accountant. The calculator is not a tax return and not tax advice.
      </p>

      <h2>Sources</h2>
      <ul>
        <li>
          <a
            href="https://www.btl.gov.il/Insurance/National%20Insurance/type_list/Self_Employed/Pages/rates.aspx"
            rel="noopener"
            target="_blank"
          >
            National Insurance Institute (Bituach Leumi)
          </a>
          : contribution rates for the self-employed, reduced-rate threshold, ceiling and minimum income from 1 January
          2026
        </li>
        <li>
          <a
            href="https://www.btl.gov.il/Insurance/National%20Insurance/type_list/Self_Employed/Pages/hishov.dmey.bituach.aspx"
            rel="noopener"
            target="_blank"
          >
            National Insurance Institute (Bituach Leumi)
          </a>
          : worked example of self-employed contributions, including the 52% deduction
        </li>
        <li>
          <a href="https://www.capitax.co.il/Attachments/15042026.pdf" rel="noopener" target="_blank">
            Israel Tax Authority
          </a>
          : income tax tables for January 2026 onwards, updated April 2026 (copy of the Tax Authority booklet)
        </li>
        <li>Income Tax Ordinance: sections 121 and 121B (2026 brackets and surtax), 34 and 36 (credit points), 47A, 175 and 180</li>
      </ul>
    </EnToolLayout>
  )
}
