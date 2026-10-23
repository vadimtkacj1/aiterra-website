import Link from 'next/link'
import EnToolLayout, { enToolMetadata, type EnToolFaqEntry } from '../_components/EnToolLayout'
import IdNumberCheckerEn, { CodeSnippetEn } from '../_components/IdNumberCheckerEn'
import {
  EXCEL_CHECK_DIGIT_FORMULA,
  EXCEL_PAD_FORMULA,
  EXCEL_VALIDATE_FORMULA,
  JS_SNIPPET,
  checkDigitFor,
  steps,
  stepsSum,
} from '@/lib/id-number'
import styles from '../../../../(he)/(site)/tools/id-number-check/page.module.css'

const SLUG = 'id-number-check'
const META_TITLE = 'Israeli ID Number Check: Teudat Zehut Check Digit'
const DESCRIPTION =
  'Check whether an Israeli ID number (teudat zehut) is valid by its check digit and see the calculation. Also calculate a check digit, check a company or VAT dealer number, and copy a ready Excel formula.'

const EXAMPLE_BASE = '12345678'
const exampleSteps = steps(EXAMPLE_BASE)
const exampleSum = stepsSum(exampleSteps)
const exampleCheckDigit = checkDigitFor(EXAMPLE_BASE)

const prefixRows = [
  { prefixes: '51, 52', label: 'Israeli company' },
  { prefixes: '53', label: 'Foreign partnership registered in Israel' },
  { prefixes: '54, 55', label: 'Israeli partnership' },
  { prefixes: '56', label: 'Foreign company registered in Israel' },
  { prefixes: '58', label: 'Non-profit (amuta)' },
]

const ICA_SEARCH = 'https://ica.justice.gov.il/GenericCorporarionInfo/SearchCorporation?unit=8'

const sources = [
  {
    href: 'https://en.wikipedia.org/wiki/Israeli_identity_card',
    label: 'Wikipedia: Israeli identity card',
    note: '9 digits, the last of which is a check digit, issued by the Population Registry',
  },
  {
    href: 'https://arthurdejong.org/python-stdnum/doc/stdnum.il.idnr',
    label: 'python-stdnum: Israeli identity number',
    note: 'open-source validation library with examples of a valid number and a wrong check digit; the same library covers company numbers (stdnum.il.hp)',
  },
  {
    href: 'https://data.gov.il/he/dataset/ica_companies',
    label: 'data.gov.il: Registrar of Companies database',
    note: 'our check: 732,514 of 732,515 company numbers pass the same check digit',
  },
  {
    href: 'https://data.gov.il/he/dataset/ica_partnerships',
    label: 'data.gov.il: partnerships database',
    note: 'our check: all 29,074 partnership numbers pass',
  },
  {
    href: 'https://data.gov.il/he/dataset/moj-amutot',
    label: 'data.gov.il: non-profits and public benefit companies database',
    note: 'our check: all 73,899 non-profit numbers starting with 58 pass',
  },
  {
    href: 'https://www.oecd.org/content/dam/oecd/en/topics/policy-issue-focus/aeoi/israel-tin.pdf',
    label: 'Israel Tax Authority via the OECD portal: Information on Tax Identification Numbers, Israel',
    note: 'an individual\'s tax ID is their ID number, and a company\'s is a 9-digit number',
  },
  {
    href: 'https://www.gov.il/he/pages/id_collecting',
    label: 'Privacy Protection Authority: collecting ID numbers and copying ID cards (Hebrew)',
    note: 'an ID number is protected information, collected only when there is a need',
  },
]

const faq: EnToolFaqEntry[] = [
  {
    id: 'en-id-faq-valid',
    question: 'How do I know if an Israeli ID number is valid?',
    answer:
      'Check the check digit, the ninth digit. Pad the number to 9 digits with zeros on the left, multiply the digits alternately by 1 and 2, and replace any product of 10 or more with the sum of its digits. If the total is divisible by 10, the number is valid. Type the number into the tool above to see the full calculation. A valid number is well formed, not necessarily one that exists.',
  },
  {
    id: 'en-id-faq-check-digit',
    question: 'How is the teudat zehut check digit calculated?',
    answer:
      'Take the first 8 digits and multiply them alternately by 1 and 2, starting with 1. Replace a two-digit product with the sum of its digits, and add everything up. The check digit is what is missing to reach the next multiple of 10. For 12345678 the sum is 38, 2 short of 40, so the full number is 123456782. When the sum is already divisible by 10, the check digit is 0.',
  },
  {
    id: 'en-id-faq-eight',
    question: 'Why does my ID number have only 8 digits?',
    answer:
      'Because it is missing a leading 0. Israeli ID numbers always have 9 digits, and older numbers were padded with zeros on the left. Excel, forms and some systems drop those zeros, leaving 8 digits or fewer. Add zeros on the left up to 9 digits and the check works as usual. The tool above does this for you and shows which number it checked.',
  },
  {
    id: 'en-id-faq-exists',
    question: 'Does a valid number mean the ID card exists and is current?',
    answer:
      'No. The check digit only confirms that the number is well formed. One in ten 9-digit numbers passes the check, even if it was never issued. It does not tell you who the number belongs to, whether the card is current, or whether it was reported lost. To identify a person you need to see the card itself, and a lost card is replaced through the Population and Immigration Authority.',
  },
  {
    id: 'en-id-faq-company',
    question: 'Can I check a company or VAT dealer number the same way?',
    answer:
      'Yes. Company, partnership and non-profit numbers have 9 digits with a check digit calculated the same way. We tested this on the Registrar of Companies\' open databases: of more than 835,000 numbers, only one company number failed. For a sole-trader osek murshe, the dealer number is usually their ID number; for a company, the company number. In the tool, choose Company or VAT dealer number.',
  },
]

export const metadata = enToolMetadata({ slug: SLUG, metaTitle: META_TITLE, description: DESCRIPTION })

export default function EnIdNumberCheckPage() {
  return (
    <EnToolLayout
      slug={SLUG}
      metaTitle={META_TITLE}
      description={DESCRIPTION}
      lede="An Israeli ID number (teudat zehut) is valid when its ninth digit, the check digit, matches the first eight: multiply the digits alternately by 1 and 2, add the digits of each product, and the total must be divisible by 10. Type a number below to get the answer with the full calculation, or check a company, partnership or non-profit number."
      chips={['Check and calculate the check digit', 'Company, VAT dealer and non-profit numbers', 'Excel formula and form code', 'The number is never sent anywhere']}
      tool={<IdNumberCheckerEn />}
      faq={faq}
      cta={{
        text: 'Need a form or CRM that validates ID, company and phone numbers as people type? We build that.',
        label: 'Custom software development',
        href: '/en/services/development',
      }}
    >
      <h2 id="how" className={styles.anchor}>
        How the teudat zehut check digit works
      </h2>
      <p>
        An Israeli ID number has 9 digits, and the last one is a check digit. It is calculated from the 8 digits before
        it so that a typing mistake shows up immediately. The method is a variant of the Luhn algorithm, the same one
        that checks credit card numbers:
      </p>
      <ol>
        <li>Pad the number to 9 digits with zeros on the left.</li>
        <li>
          Multiply each digit by a weight according to its position: the first by 1, the second by 2, the third by 1,
          and so on alternately. The check digit, the ninth, is multiplied by 1.
        </li>
        <li>Replace a product of 10 or more with the sum of its digits: 12 counts as 3 and 16 as 7. It is the same as subtracting 9.</li>
        <li>Add up all the results. The number is valid if the sum is divisible by 10.</li>
      </ol>

      <h3>Example: the check digit of {EXAMPLE_BASE}</h3>
      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <caption>Calculating the check digit of {EXAMPLE_BASE}</caption>
          <tbody>
            <tr>
              <th scope="row">Digit</th>
              {exampleSteps.map((step) => (
                <td key={step.position}>{step.digit}</td>
              ))}
            </tr>
            <tr>
              <th scope="row">Times</th>
              {exampleSteps.map((step) => (
                <td key={step.position}>{step.weight}</td>
              ))}
            </tr>
            <tr>
              <th scope="row">Added</th>
              {exampleSteps.map((step) => (
                <td key={step.position}>{step.added}</td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
      <p>
        The sum is {exampleSteps.map((step) => step.added).join(' + ')} = {exampleSum}. The 6 and the 8 were doubled
        to 12 and 16, so they count as 3 and 7. {exampleCheckDigit} is missing to reach 40, the next multiple of 10, so
        the check digit is {exampleCheckDigit} and the full number is {`${EXAMPLE_BASE}${exampleCheckDigit}`}. In the
        tool above you can choose <a href="#check-digit">Calculate the check digit</a> to see the same table for any
        number.
      </p>
      <p>
        {EXAMPLE_BASE}
        {exampleCheckDigit} is a demonstration sequence. We do not show real people&apos;s numbers on this page, and the
        tool does not generate random numbers, because a randomly generated valid number can belong to a real person.
      </p>

      <h3>Valid does not mean it exists</h3>
      <p>
        The check digit only confirms that the number is well formed. Exactly one in ten 9-digit numbers passes, even if
        it was never issued. It catches every single-digit mistake and every swap of two adjacent digits except 09
        becoming 90 or the reverse. It does not tell you who owns the number, whether the card is current, or whether it
        was reported lost or stolen.
      </p>
      <p>
        To know that a person is who they say they are, you need to see the card itself or use an official
        identification service. A company can be looked up by number in the{' '}
        <a href={ICA_SEARCH} rel="noopener" target="_blank">
          Registrar of Companies corporate search
        </a>
        , or with our <Link href="/en/tools/company-lookup">Israeli company lookup</Link>.
      </p>

      <h3 id="company-numbers" className={styles.anchor}>
        Company, VAT dealer and non-profit numbers: the same check digit
      </h3>
      <p>
        A company number (H.P., chet-pe), partnership number and non-profit (amuta) number also have 9 digits, the last
        of which is a check digit calculated the same way. The Registrar of Companies does not publish the formula, so
        we tested it ourselves on its open databases on data.gov.il in October 2026:
      </p>
      <ul>
        <li>Companies: 732,514 of 732,515 numbers pass the check. Only one number in the database fails.</li>
        <li>Partnerships: all 29,074 numbers pass.</li>
        <li>Non-profits: all 73,899 numbers starting with 58 pass.</li>
      </ul>
      <p>Corporate numbers start with 5, and the first two digits show the type of entity:</p>
      <div className={styles.tableWrap}>
        <table className={`${styles.table} ${styles.prefixTable}`}>
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
      <p>
        An osek murshe (licensed VAT dealer) is not a separate kind of number. According to the Israel Tax Authority, a
        private individual&apos;s tax ID is their ID number, so a sole trader is usually registered under their teudat
        zehut number and a company under its company number. Either way, the same check digit validates a dealer
        number. In the tool, choose <a href="#company">Company or VAT dealer number</a> and it also shows the type of
        entity by prefix.
      </p>

      <h2 id="excel" className={styles.anchor}>
        Checking ID numbers in Excel, Google Sheets and code
      </h2>
      <p>
        When you import a customer list into a CRM or check an employee file, it is handy to check a whole column at
        once. The formulas work in Excel 2010 and later and in Google Sheets, with no macro or add-in.
      </p>
      <h3>Excel formula to validate an ID number</h3>
      <p>
        The first number is in cell A2. Paste the formula into an empty cell in the same row and drag it down. The result
        is TRUE for a valid number and FALSE for an invalid one, and leading zeros that Excel removed are restored
        automatically.
      </p>
      <CodeSnippetEn
        code={EXCEL_VALIDATE_FORMULA}
        copyLabel="Copy the validation formula"
        copiedMessage="Validation formula copied"
        mode="excel-validate"
      />
      <p>
        A cell with a dash or space, such as 12345678-2, returns FALSE. Clean them first: select the column, press
        Ctrl+H and replace the dash with nothing.
      </p>
      <h3>Formula to calculate the check digit</h3>
      <p>
        With the 8 digits in cell A2, the formula returns the ninth digit. If the formula is in B2, the full number is{' '}
        <code>=TEXT(A2,&quot;00000000&quot;)&amp;B2</code>.
      </p>
      <CodeSnippetEn
        code={EXCEL_CHECK_DIGIT_FORMULA}
        copyLabel="Copy the check digit formula"
        copiedMessage="Check digit formula copied"
        mode="excel-check-digit"
      />
      <h3>JavaScript function for a website form</h3>
      <p>
        The function takes a string or number, removes spaces and dashes, pads with zeros and returns true or false. It
        suits validation as the user types. Repeat the same check on the server, because browser checks can be
        bypassed.
      </p>
      <CodeSnippetEn code={JS_SNIPPET} copyLabel="Copy the function" copiedMessage="Function copied" mode="javascript" />

      <h2>ID numbers in forms, CRMs and invoices</h2>
      <p>
        Israeli businesses ask for an ID or company number on sign-up forms, orders, contracts, payslips and tax
        invoices to business customers, which carry the customer&apos;s dealer number. Checking the check digit as the
        number is typed stops a mistake before it is saved in the CRM, and before an invoice goes out with a wrong
        dealer number.
      </p>
      <h3>Privacy: an ID number is personal data</h3>
      <p>
        Since Amendment 13 to the Privacy Protection Law took effect on 14 August 2025, section 3 of the law defines
        personal data as information about an identified or identifiable person, and lists the ID number among the
        identifying details. The Privacy Protection Authority has also said that an ID number is protected information,
        to be collected, or the card copied, only when there is a real need. In practice:
      </p>
      <ul>
        <li>Ask for an ID number only when you need it, and say on the form why it is required and what happens if it is not given (section 11).</li>
        <li>Do not send it by plain email, put it in the page URL, or pass it to analytics or advertising tools.</li>
        <li>Keep it only as long as needed, and give access only to those who work with it.</li>
        <li>Update your website privacy policy.</li>
      </ul>
      <p>The tool on this page checks the number in your browser only. It is not sent to a server, not stored and not added to the page address.</p>
      <h3>Common mistakes</h3>
      <ul>
        <li>
          <strong>Dropped zeros.</strong> Excel stores an ID number as a number, so 012345674 becomes 12345674. Restore
          the zeros with Format Cells, custom format 000000000, or with the formula <code>{EXCEL_PAD_FORMULA}</code>.
          When importing a CSV, set the column to text.
        </li>
        <li>
          <strong>Missing check digit.</strong> Older documents sometimes write the check digit after a dash, and people
          type only the 8 digits before it. Such a number looks invalid.
        </li>
        <li>
          <strong>Number input fields.</strong> A field of type number drops leading zeros and also accepts the letter e.
          Use a text field with a numeric keypad, inputmode=&quot;numeric&quot;, and a check digit validation.
        </li>
        <li>
          <strong>Checking length only.</strong> A form that only checks for 9 digits lets every typo through, and a form
          that demands exactly 9 digits blocks numbers whose leading zero was dropped.
        </li>
        <li>
          <strong>Assuming the number belongs to the customer.</strong> A valid number can belong to anyone, or to no
          one.
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
      </ul>
      <p className={styles.reviewed}>
        The algorithm, formulas and code were checked on 23 October 2026 against the sources and against every corporate
        number in the open databases. The Population Authority and the Registrar of Companies do not publish the formula
        themselves.
      </p>
    </EnToolLayout>
  )
}
