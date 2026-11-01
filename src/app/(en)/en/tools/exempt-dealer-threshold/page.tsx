import Link from 'next/link'
import EnToolLayout, { enToolMetadata, type EnToolFaqEntry } from '../_components/EnToolLayout'
import ExemptDealerCheckerEn from '../_components/ExemptDealerCheckerEn'

const SLUG = 'exempt-dealer-threshold'
const META_TITLE = 'Osek Patur Ceiling 2026: ₪122,833 Check and Forecast'
const DESCRIPTION =
  'The 2026 osek patur ceiling in Israel is ₪122,833 a year. Check how much you have left, which month you will cross it, and what changes when you become an osek murshe.'

const faq: EnToolFaqEntry[] = [
  {
    id: 'en-exempt-faq-threshold',
    question: 'What is the osek patur ceiling in 2026?',
    answer:
      '₪122,833 of annual turnover from 1 January 2026, per the Israel Tax Authority. In 2024 and 2025 it was ₪120,000. Turnover is all income from all your businesses before expenses, not profit. Anyone at or under the ceiling and outside the professions that must register as osek murshe can be an osek patur.',
  },
  {
    id: 'en-exempt-faq-crossing',
    question: 'What happens if I go over the ceiling?',
    answer:
      'Under Section 1 of the VAT Law, an osek patur is someone whose turnover does not exceed the ceiling. If you pass it, you must move to osek murshe, charge VAT and report it. Regulation 8 of the registration regulations requires notifying the VAT office within 15 days of an event that changes your registration. Ask the VAT office or an accountant exactly when VAT applies.',
  },
  {
    id: 'en-exempt-faq-professions',
    question: 'Which professions cannot be an osek patur?',
    answer:
      'Regulation 13 of the VAT registration regulations requires osek murshe registration regardless of turnover. These include lawyers, accountants, tax advisers, bookkeepers, engineers, architects, technicians, economists, management consultants, translators, appraisers, insurance agents, doctors, psychologists, physiotherapists, vets, driving schools, real estate and car dealers or brokers, and registered companies.',
  },
  {
    id: 'en-exempt-faq-declaration',
    question: 'What is the annual osek patur declaration?',
    answer:
      'Under Regulation 15, an osek patur declares the previous year\'s turnover by 31 January each year. It is filed online on the Tax Authority site, by you or your representative, at no cost.',
  },
  {
    id: 'en-exempt-faq-back',
    question: 'Can I go back from osek murshe to osek patur?',
    answer:
      'Yes. Under Section 59 of the VAT Law, an osek murshe whose turnover stays under the required amount for two consecutive years is registered as osek patur, at the director\'s initiative or on request. This does not apply to the professions in Regulation 13.',
  },
]

export const metadata = enToolMetadata({ slug: SLUG, metaTitle: META_TITLE, description: DESCRIPTION })

export default function EnExemptDealerPage() {
  return (
    <EnToolLayout
      slug={SLUG}
      metaTitle={META_TITLE}
      description={DESCRIPTION}
      lede="The osek patur (exempt dealer) ceiling for 2026 is ₪122,833 of annual turnover, up from ₪120,000 in 2024 and 2025. Enter your turnover since January to see what is left and which month you will cross it at your current pace."
      tool={<ExemptDealerCheckerEn />}
      faq={faq}
      chips={['₪122,833 from 1 January 2026', 'Crossing month forecast', 'Professions that must be murshe']}
      cta={{
        text: 'A business that outgrows the ceiling needs invoices, reports and income tracking. Most of it can run automatically.',
        label: 'Business automation',
        href: '/en/services/automation',
      }}
    >
      <h2>What the ceiling means</h2>
      <p>
        Section 1 of the VAT Law defines an osek patur as a dealer whose turnover across all businesses does not exceed
        this amount in a year. The amount is updated each year by the consumer price index, on 1 January. The 2027 ceiling
        will be published in January 2027.
      </p>

      <h2>Staying under the ceiling</h2>
      <p>
        To end 2026 under the ceiling, your monthly average across the year must be at most about ₪10,236. For example, a
        freelance designer with ₪90,000 from January to August averages ₪11,250 a month and has ₪32,833 left. In the four
        remaining months the average can be at most about ₪8,208. At the current pace, turnover crosses the ceiling in
        November, so that is the time to prepare, not the annual declaration.
      </p>

      <h2>What changes when you cross it</h2>
      <ul>
        <li>You register as an osek murshe, charge clients VAT, issue tax invoices and file VAT reports.</li>
        <li>Notify the VAT director in writing within 15 days of an event that changes your registration.</li>
        <li>Ask the VAT office or an accountant from when VAT applies and to which transactions.</li>
      </ul>
      <p>
        Use the <Link href="/en/tools/vat-calculator">VAT calculator</Link> for any amount, and the{' '}
        <Link href="/en/tools/self-employed-tax-calculator">self-employed tax calculator</Link> for income tax. This is
        general information, not tax advice. The calculator does not check special transactions, such as selling property
        or equipment, and does not set the date VAT begins.
      </p>
    </EnToolLayout>
  )
}
