import Link from 'next/link'
import EnToolLayout, { enToolMetadata, type EnToolFaqEntry } from '../_components/EnToolLayout'
import RentalIncomeTaxCalculatorEn from '../_components/RentalIncomeTaxCalculatorEn'
import { ils, rentalTrackName } from '../_components/en-format'
import { ceilingTable, computeRental } from '@/lib/rental-income-tax'
import styles from '../../../../(he)/(site)/tools/rental-income-tax-calculator/page.module.css'
import ToolSources from '../../../../(he)/(site)/components/tools/ToolSources'

const sources = [
  {
    href: 'https://he.wikisource.org/wiki/%D7%97%D7%95%D7%A7_%D7%9E%D7%A1_%D7%94%D7%9B%D7%A0%D7%A1%D7%94_(%D7%A4%D7%98%D7%95%D7%A8_%D7%9E%D7%9E%D7%A1_%D7%A2%D7%9C_%D7%94%D7%9B%D7%A0%D7%A1%D7%94_%D7%9E%D7%94%D7%A9%D7%9B%D7%A8%D7%AA_%D7%93%D7%99%D7%A8%D7%AA_%D7%9E%D7%92%D7%95%D7%A8%D7%99%D7%9D)',
    label: 'Income Tax Law (Exemption on Income from Renting a Residential Apartment), 1990, on Wikisource (Hebrew)',
  },
  {
    href: 'https://he.wikisource.org/wiki/%D7%A4%D7%A7%D7%95%D7%93%D7%AA_%D7%9E%D7%A1_%D7%94%D7%9B%D7%A0%D7%A1%D7%94',
    label: 'Income Tax Ordinance, on Wikisource (Hebrew)',
  },
  {
    href: 'https://www.gov.il/BlobFolder/generalpage/income-tax-monthly-deductions-booklet/he/generalInformation_income-tax-monthly-deductions-booklet_monthly-deductions-booklet-2026.pdf',
    label: 'Israel Tax Authority: income tax guide for salaries, January 2026 onwards (PDF, Hebrew)',
  },
  {
    href: 'https://he.wikisource.org/wiki/%D7%97%D7%95%D7%A7_%D7%9E%D7%A1_%D7%A2%D7%A8%D7%9A_%D7%9E%D7%95%D7%A1%D7%A3',
    label: 'Value Added Tax Law, on Wikisource (Hebrew)',
  },
]

const SLUG = 'rental-income-tax-calculator'
const META_TITLE = 'Israel Rental Income Tax Calculator 2026'
const DESCRIPTION =
  'Free Israel rental income tax calculator: the ₪5,654 monthly exemption, the shekel-for-shekel reduction above it, and the 10% and regular tracks compared.'

const faq: EnToolFaqEntry[] = [
  {
    id: 'en-rental-faq-ceiling',
    question: 'What is the rental income exemption in Israel in 2026?',
    answer:
      '₪5,654 a month. The amount is set in Section 2 of the exemption law and frozen for 2024 to 2027. It covers all residential units of you, your spouse and children under 18 together.',
  },
  {
    id: 'en-rental-faq-over',
    question: 'What happens if my rent is above ₪5,654?',
    answer:
      'The exemption shrinks shekel for shekel. At ₪6,500 a month you are ₪846 over, so the exempt part falls to ₪4,808 and ₪1,692 a month is taxable. From ₪11,308 a month, no exemption remains.',
  },
  {
    id: 'en-rental-faq-ten',
    question: 'How does the 10% track work?',
    answer:
      'Under Section 122 of the Income Tax Ordinance you pay 10% of all the rent from the first shekel, with no expenses, depreciation or credit points. The tax is due within 30 days of the end of the tax year unless you paid advances. It usually suits rent well above the ceiling with high other income.',
  },
  {
    id: 'en-rental-faq-regular',
    question: 'When is the regular track worthwhile?',
    answer:
      'Rent joins your income and is taxed by brackets, but you can deduct expenses and depreciation. Under age 60 the rate on this income is at least 31% under Section 121. From 60, the regular brackets from 10% apply. It mainly pays off with high expenses such as mortgage interest, or from age 60 with low other income.',
  },
  {
    id: 'en-rental-faq-condition',
    question: 'What do I need to get the exemption?',
    answer:
      'Under Section 3 of the exemption law, you need a document signed by the tenant confirming the unit is used only as a home. The exemption covers renting to an individual as a residence, not a unit recorded in business books. If you choose the exemption, you cannot deduct depreciation on the unit.',
  },
]

export const metadata = enToolMetadata({ slug: SLUG, metaTitle: META_TITLE, description: DESCRIPTION })

export default function EnRentalIncomeTaxPage() {
  const example = computeRental(6_500, 12, 20_000, 150_000, false)

  return (
    <EnToolLayout
      slug={SLUG}
      metaTitle={META_TITLE}
      description={DESCRIPTION}
      lede="Residential rent in Israel is tax-free up to ₪5,654 a month in 2026, a ceiling frozen for 2024 to 2027. Above it you can choose a reduced exemption, 10% on the whole amount, or bracket tax with expenses deducted. The calculator compares all three."
      tool={<RentalIncomeTaxCalculatorEn />}
      faq={faq}
      chips={['₪5,654 monthly ceiling', 'Exemption, 10% or regular', '2026 brackets']}
      cta={{
        text: 'Renting out several units? Collection, receipts, tenant reminders and expense tracking can run automatically.',
        label: 'Business automation',
        href: '/en/services/automation',
      }}
    >
      <h2>The three tracks</h2>
      <ul>
        <li>
          <strong>Exemption track:</strong> rent up to ₪5,654 a month is fully exempt. Above it the exemption falls shekel
          for shekel, and the taxable part is taxed by brackets with no expenses.
        </li>
        <li>
          <strong>10% track:</strong> 10% of all the rent, with no expenses, depreciation, credits or offsets.
        </li>
        <li>
          <strong>Regular track:</strong> rent less expenses and depreciation joins your income. Under 60 the rate is at
          least 31%; from 60 the regular brackets from 10% apply.
        </li>
      </ul>

      <h2>Exemption by monthly rent</h2>
      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <caption>Exemption track and 10% track, per month, 2026</caption>
          <thead>
            <tr>
              <th scope="col">Rent</th>
              <th scope="col">Exempt</th>
              <th scope="col">Taxable</th>
              <th scope="col">10% tax</th>
            </tr>
          </thead>
          <tbody>
            {ceilingTable().map((row) => (
              <tr key={row.rent}>
                <th scope="row">{ils(row.rent)}</th>
                <td>{ils(row.exempt)}</td>
                <td>{ils(row.taxable)}</td>
                <td>{ils(row.flat)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2>Example</h2>
      <p>
        An employee aged 45 with ₪150,000 of taxable income rents out a unit at ₪6,500 a month all year, with ₪20,000 of
        expenses and depreciation. Annual rent is {ils(example.gross)}.
      </p>
      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <caption>₪6,500 a month, other income ₪150,000, age 45</caption>
          <thead>
            <tr>
              <th scope="col">Track</th>
              <th scope="col">Taxable per year</th>
              <th scope="col">Tax per year</th>
            </tr>
          </thead>
          <tbody>
            {example.tracks.map((track) => (
              <tr key={track.id}>
                <th scope="row">{rentalTrackName[track.id]}</th>
                <td>{ils(track.taxable)}</td>
                <td>{ils(track.tax)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p>
        Here the {rentalTrackName[example.best].toLowerCase()} is cheapest. As rent approaches ₪11,308 a month, the
        exemption disappears and the 10% track pays off more.
      </p>

      <h2>What the calculator leaves out</h2>
      <ul>
        <li>Credit points, which reduce overall tax and can change the result.</li>
        <li>The 3% surtax on taxable income above ₪721,560 a year, and further tax on capital income.</li>
        <li>Non-residential rentals, rentals abroad and units recorded in business books.</li>
        <li>Rent that changes month to month: the ceiling is tested per month, and the calculator assumes a fixed amount.</li>
      </ul>
      <p>
        Residential rental is also VAT-exempt. If you are also an osek patur, check the{' '}
        <Link href="/en/tools/exempt-dealer-threshold">osek patur ceiling</Link>. This is general information, not tax
        advice. Before choosing a track, especially with several units, consult an accountant.
      </p>
      <ToolSources sources={sources} heading="Sources" />
    </EnToolLayout>
  )
}
