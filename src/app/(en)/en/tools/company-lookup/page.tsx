import Link from 'next/link'
import EnToolLayout, { enToolMetadata, type EnToolFaqEntry } from '../_components/EnToolLayout'
import CompanyLookupEn, { CompanyDetailsEn } from '../_components/CompanyLookupEn'
import { statusNamesEn } from '../_components/companyStatusesEn'
import { DATASET_URL, EXTRACT_FEE, ICA_SEARCH_URL, VAT_DEALER_URL, statusCatalog, toCompany } from '@/lib/company-lookup'
import styles from '../../../../(he)/(site)/tools/company-lookup/page.module.css'

const SLUG = 'company-lookup'
const META_TITLE = 'Israeli Company Lookup by Number: Active or Struck Off'
const DESCRIPTION =
  'Look up an Israeli company by its number (H.P.) or name in the Registrar of Companies database: active, struck off, in liquidation or a violating company, with address, incorporation date and last annual report.'

const DATA_DATE = '22.10.2026'
const TOTAL_COMPANIES = 732515

const statusCounts: Record<string, number> = {
  'פעילה': 407135,
  'פעילה זמנית': 672,
  'פעילה/בפירוק - הליך פשרה או הסדר/פירוק זמני': 102,
  'פעילה/בפירוק - בכינוס נכסים': 15,
  'בפרוק מרצון': 10756,
  'בפרוק ע״י בימ״ש': 6233,
  'מחוקה': 144504,
  'מחוסלת מרצון': 149226,
  'חיסול ע״י בימ״ש': 10330,
  'מחוסלת עקב מיזוג': 2968,
  'נגרעה מהמרשם': 574,
}

const example = toCompany({
  'מספר חברה': 520031931,
  'שם חברה': 'בזק החברה הישראלית לתקשורת   בע~מ',
  'שם באנגלית': 'BEZEQ THE ISRAELI TELECOMMUNICATIONS CORP. LTD',
  'סוג תאגיד': 'ישראלית חברה ציבורית',
  'סטטוס חברה': 'פעילה',
  'תאור חברה': '',
  'מטרת החברה': 'לעסוק בסוגי עיסוק שפורטו בתקנון',
  'תאריך התאגדות': '21/08/1980',
  'חברה ממשלתית': 'לא',
  'מגבלות': 'מוגבלת',
  'מפרה': '',
  'שנה אחרונה של דוח שנתי (שהוגש)': 2002,
  'שם עיר': 'חולון',
  'שם רחוב': 'המנור',
  'מספר בית': '7',
  'מיקוד': 5886105,
  'ת.ד.': '',
  'מדינה': 'ישראל',
  'אצל': 'בנין עזריאלי 2  7 קומות מעל קומת הכניסה כניסה בזק',
  'תת סטטוס': '',
})

const prefixRows = [
  { prefixes: '51, 52', label: 'Israeli company' },
  { prefixes: '53', label: 'Foreign partnership registered in Israel' },
  { prefixes: '54, 55', label: 'Israeli partnership' },
  { prefixes: '56', label: 'Foreign company registered in Israel' },
  { prefixes: '58', label: 'Non-profit (amuta)' },
]

const count = (value: number) => value.toLocaleString('en-IL')

const sources: { href: string; label: string; note: string }[] = [
  {
    href: DATASET_URL,
    label: 'data.gov.il: Companies database, Registrar of Companies',
    note: `the database the tool searches. It updates automatically every day, and the ${DATA_DATE} update held ${count(TOTAL_COMPANIES)} companies. The counts on this page are our own, across all records`,
  },
  {
    href: ICA_SEARCH_URL,
    label: 'Registrar of Companies: corporate search and company extracts',
    note: `free search by number or name, and company extracts. According to the page, an extract costs ₪${EXTRACT_FEE} and ordering the company file ₪39`,
  },
  {
    href: VAT_DEALER_URL,
    label: 'Israel Tax Authority: online request for VAT dealer details (Hebrew)',
    note: 'enter a dealer number to get its name and address',
  },
  {
    href: 'https://www.oecd.org/content/dam/oecd/en/topics/policy-issue-focus/aeoi/israel-tin.pdf',
    label: 'Israel Tax Authority via the OECD portal: Information on Tax Identification Numbers, Israel',
    note: 'an individual\'s tax ID is their ID number, and a company\'s is a 9-digit number',
  },
]

const faq: EnToolFaqEntry[] = [
  {
    id: 'en-company-faq-active',
    question: 'How do I check whether an Israeli company is active?',
    answer:
      'Enter the company number (H.P.) in the tool at the top of the page and press Search. If the status is Active, the company has not been struck off, dissolved or put into liquidation. That does not mean it actually does business, so also check whether it is registered as a violating company and when it filed its last annual report. The data comes from the Registrar of Companies open database, updated daily.',
  },
  {
    id: 'en-company-faq-violator',
    question: 'What is a violating company (chevra mafra chok)?',
    answer:
      'A company the Registrar of Companies has recorded as not paying its annual fee or not filing an annual report, under section 362A of the Companies Law. First the Registrar records a warning, and if the breach is not fixed within 30 days, the company is registered as a violator. This is separate from the status, so a company can be active and a violator at the same time. Once it pays and files what is missing, the Registrar removes the record.',
  },
  {
    id: 'en-company-faq-violator-work',
    question: 'Can I do business with a violating company?',
    answer:
      'Section 362A does not forbid the company from operating or you from working with it. Its restrictions are on the Registrar\'s side: it may refuse to register charges, a change of name or a merger for the company, and refuse to register a new company in which the violator\'s controlling shareholder holds shares. After a year on the record, and under further conditions, the Registrar can also strike it off. Before a large deal, ask the company why it is registered this way.',
  },
  {
    id: 'en-company-faq-extract',
    question: 'What is the difference between this lookup and a company extract?',
    answer: `Here you see the open data the Registrar of Companies publishes on data.gov.il: name, type, status, address, incorporation date and last annual report. It has no shareholders, directors or charges. A company extract (nesach chevra) is the Registrar's official document, ordered on the Registrar of Companies website. According to the site, an extract costs ₪${EXTRACT_FEE}. When you need to rely on the data with a bank, a court or in a contract, order an extract.`,
  },
  {
    id: 'en-company-faq-missing',
    question: 'Why was the company I searched for not found?',
    answer:
      'There are a few common reasons. The number belongs to a partnership or non-profit, which are in other Corporations Authority databases. The number belongs to a sole trader, meaning it is an ID number, which you check with the Israel Tax Authority. The company registered in the last few days, and the database updates once a day. Or the number has a typo, in which case the tool says the check digit does not match. When searching by name, try another word from the name or another spelling.',
  },
]

export const metadata = enToolMetadata({ slug: SLUG, metaTitle: META_TITLE, description: DESCRIPTION })

export default function EnCompanyLookupPage() {
  return (
    <EnToolLayout
      slug={SLUG}
      metaTitle={META_TITLE}
      description={DESCRIPTION}
      lede="To check an Israeli company, enter its 9-digit company number (H.P., chet-pe) or its name: you see at once whether it is active, struck off, in liquidation or registered as a violating company, with its registered address, incorporation date and the year of its last annual report. The data comes straight from the Registrar of Companies open database, updated daily."
      chips={['By company number or name', 'Status and violations explained in plain English', 'Registrar of Companies data, updated daily', 'Free, no sign-up']}
      tool={<CompanyLookupEn />}
      faq={faq}
      cta={{
        text: 'We build automations that check every new supplier or customer against the Registrar of Companies and add their name, status and address to your CRM.',
        label: 'Business automation',
        href: '/en/services/automation',
      }}
    >
      <h2 id="how" className={styles.anchor}>
        How to check an Israeli company by number
      </h2>
      <p>
        The H.P. (chet-pe) is the company&apos;s number at the Registrar of Companies: 9 digits, and for an Israeli
        company it starts with 51 or 52. It appears on invoices, quotes and contracts, and usually in the footer of the
        company&apos;s website. If you are a foreign company or a newcomer vetting an Israeli supplier or client, this is
        how to check it:
      </p>
      <ol>
        <li>Choose By company number in the tool and enter the number. Dashes and spaces do not matter.</li>
        <li>The tool first checks the check digit, the last digit. If it does not match, the number has a mistake and there is no point searching for it.</li>
        <li>
          Press Search to see the company name, status, type, incorporation date, registered address and the year of
          its last annual report.
        </li>
        <li>Compare the name in the result with the name on the invoice or contract. A different name points to a wrong number or a different company.</li>
        <li>
          When you need an official document, for example for a bank or a court, order a company extract on the{' '}
          <a href={ICA_SEARCH_URL} rel="noopener" target="_blank">
            Registrar of Companies website
          </a>
          . According to the site, an extract costs ₪{EXTRACT_FEE}.
        </li>
      </ol>
      <p>
        No number? Choose By company name and type a word from the name, in Hebrew or English. As you type, a list of up
        to 20 companies appears, each with its number and status.
      </p>

      <h3>Example: looking up company number 520031931</h3>
      <p>This is the result for 520031931, Bezeq, as it appeared in the database on 23 October 2026:</p>
      <div className={styles.example}>
        <CompanyDetailsEn company={example} dataDate={DATA_DATE} headingLevel={4} />
      </div>
      <p>
        The status Active means the company has not been struck off or put into liquidation, and it has no violation
        record. The type Public company fits a company whose shares trade on the stock exchange. The year 2002 in the
        annual report field looks odd, but it is not a warning sign: the duty to file an annual report with the
        Registrar under section 141 of the Companies Law applies only to a company that is not a reporting corporation,
        and a listed company reports under the Securities Law. For a private company, on the other hand, an old last
        annual report is worth noticing.
      </p>
      <p>
        The open database does not include shareholders, directors or charges. Its data is the Registrar&apos;s data as
        published, and to rely on it legally you order an official company extract.
      </p>

      <h2 id="statuses" className={styles.anchor}>
        What each company status means
      </h2>
      <p>
        The Registrar of Companies database has 11 statuses. We counted the companies in each, from the database as
        updated on {DATA_DATE}, out of {count(TOTAL_COMPANIES)} companies:
      </p>
      <dl className={styles.statuses}>
        {statusCatalog.map((entry) => (
          <div key={entry.status} className={styles.status}>
            <dt>
              <span className={styles.statusName}>{statusNamesEn[entry.status]?.name ?? entry.status}</span>
              <span className={styles.statusCount}>{count(statusCounts[entry.status] ?? 0)} companies</span>
            </dt>
            <dd>{statusNamesEn[entry.status]?.text ?? entry.text}</dd>
          </div>
        ))}
      </dl>
      <p>
        Active is a legal status, not evidence of business activity. A company that has done nothing for years stays
        Active until it is struck off or wound up. Some companies also have a sub-status showing which stage they are at,
        for example being struck off (more than 9,000 companies the Registrar has announced it intends to strike off),
        insolvency proceedings opened, or fast-track voluntary liquidation for a company with no assets and no debts. The
        tool shows and explains that too.
      </p>

      <h2 id="violator" className={styles.anchor}>
        What a violating company is and what it means
      </h2>
      <p>
        A violating company (chevra mafra chok) is one the Registrar of Companies has recorded as not paying its annual
        fee, or, for a private company, not filing an annual report. This is set by section 362A of the Companies Law,
        1999. Every company pays an annual fee under section 9, and a company that is not a reporting corporation files
        an annual report with the Registrar under section 141.
      </p>
      <p>
        Registration happens in two steps. First the Registrar records a warning of its intention to register the
        company as a violator, and if the company does not fix the breach within 30 days, it is registered as a violator.
        In the database this is a separate field from the status, so a company can be Active and a violator at the same
        time. In the {DATA_DATE} update, {count(191784)} companies were registered as violators, {count(171598)} of them
        with Active status.
      </p>
      <h3>What happens to a violating company</h3>
      <ul>
        <li>The Registrar may refuse to register actions whose validity depends on registration, such as a change of name or objects.</li>
        <li>
          The Registrar may refuse to register a charge on its assets or in its favour, or to change or cancel a charge.
          The Registrar of Pledges may refuse to register a pledge in its favour.
        </li>
        <li>
          The Registrar may refuse to register a new company whose shareholders include the violating company, anyone
          holding 50% or more of its shares, or a director of it who did not pay a financial sanction imposed for the
          violation.
        </li>
        <li>The Registrar may refuse to carry out a merger in which one of the companies is a violator.</li>
        <li>
          A company registered as a violator for a year, which has not paid the fee or filed a report for three years,
          has no activity, assets or debts, and whose tax file is closed, can be struck off by the Registrar under
          section 351C.
        </li>
      </ul>
      <p>
        Once the company pays the debt and files the missing reports, the Registrar removes the record. If it had further
        violations the Registrar notified before the fix, the record is removed only after all of them are fixed. For a
        supplier or customer, a violation record mainly means the company is not handling its basic obligations to the
        Registrar, and it is worth asking why.
      </p>

      <h2 id="osek" className={styles.anchor}>
        How to check an osek murshe or osek patur
      </h2>
      <p>
        An osek murshe (licensed VAT dealer) or osek patur (exempt dealer) is a VAT registration, not a company, so they
        are not in the Registrar of Companies database. For a private person, the tax number is their teudat zehut (ID)
        number, so a private dealer&apos;s number does not start with 5. A company registered for VAT usually appears
        under its company number, which you can check here.
      </p>
      <p>
        Dealer details are checked with the{' '}
        <a href={VAT_DEALER_URL} rel="noopener" target="_blank">
          Israel Tax Authority online service
        </a>
        : enter the dealer number to get its name and address. Before that, you can make sure the number is well formed
        with our <Link href="/en/tools/id-number-check">Israeli ID number check</Link>, since a private dealer&apos;s
        number is an ID number.
      </p>

      <h2 id="prefixes" className={styles.anchor}>
        Company number vs dealer number vs non-profit number
      </h2>
      <p>All these numbers have 9 digits with a check digit calculated the same way; the difference is which register they are in:</p>
      <ul>
        <li>
          <strong>H.P. (chet-pe)</strong> is the company number at the Registrar of Companies. In the database,{' '}
          {count(724468)} company numbers start with 51, {count(3911)} with 52, and {count(4136)} foreign company numbers
          start with 56.
        </li>
        <li>
          <strong>Osek number (ayin-mem)</strong> is the VAT dealer number. For a dealer who is a private person, it is
          their ID number.
        </li>
        <li>
          <strong>Non-profit (amuta) numbers</strong> start with 58, and partnership numbers with 54 or 55. They are in
          other Corporations Authority databases, not the companies database the tool searches.
        </li>
      </ul>
      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <caption>Corporate number prefixes, from the Registrar of Companies databases</caption>
          <thead>
            <tr>
              <th scope="col">Prefix</th>
              <th scope="col">Type</th>
            </tr>
          </thead>
          <tbody>
            {prefixRows.map((row) => (
              <tr key={row.label}>
                <th scope="row">{row.prefixes}</th>
                <td>{row.label}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2 id="why" className={styles.anchor}>
        Why check a supplier or customer before working with them
      </h2>
      <ul>
        <li>
          <strong>Make sure the company exists and is active.</strong> A company in liquidation no longer carries on
          normal business, and anyone it owes money files a proof of debt with the trustee and waits for a distribution.
          A struck-off or dissolved company no longer exists.
        </li>
        <li>
          <strong>Make sure the name and number match.</strong> An invoice with another company&apos;s number points to a
          mistake or attempted fraud. Copy the full registered name into contracts and invoices.
        </li>
        <li>
          <strong>Watch for a violation record.</strong> It does not stop the company operating, but it means it has not
          paid its fee or filed an annual report, sometimes for years.
        </li>
        <li>
          <strong>Keep correct details in your CRM.</strong> A correct company number, registered name and address save
          mistakes on invoices.
        </li>
        <li>
          <strong>Check again before a large deal.</strong> Status changes, and a company active today can go into
          liquidation next month. Before paying in advance or signing a long agreement, check again and order an official
          extract if needed.
        </li>
      </ul>
      <h2>Sources</h2>
      <ul>
        {sources.map((source) => (
          <li key={source.href}>
            <a href={source.href} rel="noopener" target="_blank">
              {source.label}
            </a>
            : {source.note}
          </li>
        ))}
        <li>Companies Law, 1999: sections 1, 9, 141, 323, 351C to 351H and 362A, and the voluntary and court liquidation provisions</li>
        <li>Insolvency and Economic Rehabilitation Law, 2018: sections 2 and 3</li>
      </ul>
      <p className={styles.reviewed}>
        The sections, statuses and counts were checked on 23 October 2026 against the database on data.gov.il, updated
        on {DATA_DATE}, and against the text of the laws. The explanations on this page are general information, not legal advice.
      </p>
    </EnToolLayout>
  )
}
