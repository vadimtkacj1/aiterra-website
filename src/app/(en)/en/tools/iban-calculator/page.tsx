import EnToolLayout, { enToolMetadata, type EnToolFaqEntry } from '../_components/EnToolLayout'
import IbanCalculatorEn from '../_components/IbanCalculatorEn'
import { IL_IBAN_LENGTH, banks, buildIban, formatIban, mod97 } from '@/lib/iban'
import { englishBankName } from '@/lib/iban-en'
import styles from '../../../../(he)/(site)/tools/iban-calculator/page.module.css'

const SLUG = 'iban-calculator'
const META_TITLE = 'Israeli IBAN Calculator: Calculate and Validate an IBAN'
const DESCRIPTION =
  'Free Israeli IBAN calculator: choose a bank, type the branch and account number and get a valid IBAN using the Bank of Israel formula, or validate an existing IBAN and split it into bank, branch and account.'

const EXAMPLE = { bank: '12', branch: '600', account: '123456' }
const example = buildIban(EXAMPLE.bank, EXAMPLE.branch, EXAMPLE.account)
const exampleIban = example.kind === 'result' ? example.iban : ''
const exampleBban = exampleIban.slice(4)
const exampleRemainder = mod97(`IL00${exampleBban}`)

const bankRows = [...banks].sort((first, second) => first.code - second.code)

const faq: EnToolFaqEntry[] = [
  {
    id: 'en-iban-faq-what',
    question: 'What is an Israeli IBAN?',
    answer:
      'An IBAN is a bank account number in the international format of the ISO 13616 standard. An Israeli IBAN is IL, two check digits, a 3-digit bank code, a 3-digit branch number and a 13-digit account number, 23 characters in total. You mainly need it to receive a transfer from abroad, and some Israeli bodies also ask for it on bank details forms.',
  },
  {
    id: 'en-iban-faq-find',
    question: 'Where do I find the IBAN of my Israeli account?',
    answer:
      'In your bank app or online banking, usually on the account details screen or in an account confirmation letter (ishur nihul heshbon). You can also calculate it here from the bank code, branch and account number. The Bank of Israel stresses that only the bank holding the account can confirm its exact IBAN, so before a large transfer compare the result with what your bank shows.',
  },
  {
    id: 'en-iban-faq-check',
    question: 'How do I check whether an IBAN is valid?',
    answer:
      'Move the first four characters to the end, replace each letter with a number (A=10 up to Z=35) and take the remainder of division by 97. In a valid IBAN the remainder is 1. The check catches almost every single-digit typo and every swap of two adjacent digits. It does not check that the account exists, only that the number is built correctly.',
  },
  {
    id: 'en-iban-faq-zeros',
    question: 'Why does an Israeli IBAN have so many zeros?',
    answer:
      'Because the account part of the IBAN is always 13 digits, and most Israeli account numbers are shorter. Following the Bank of Israel, the account number is padded with leading zeros to 13 digits. The bank code and branch are padded to three digits the same way: Bank Hapoalim, code 12, appears in the IBAN as 012.',
  },
  {
    id: 'en-iban-faq-swift',
    question: 'What is the difference between an IBAN and a SWIFT code?',
    answer:
      'An IBAN identifies a specific account, and a SWIFT code, also called BIC, identifies the bank itself. An international transfer usually needs both. You can calculate the IBAN here, but take your bank’s SWIFT code from its website or branch, because some banks have several codes depending on the type of transfer.',
  },
]

export const metadata = enToolMetadata({ slug: SLUG, metaTitle: META_TITLE, description: DESCRIPTION })

export default function EnIbanCalculatorPage() {
  return (
    <EnToolLayout
      slug={SLUG}
      metaTitle={META_TITLE}
      description={DESCRIPTION}
      lede="An Israeli IBAN is IL, two check digits, a 3-digit bank code, a 3-digit branch number and a 13-digit account number: 23 characters in total. Choose your bank, type the branch and account number, and get the IBAN using the Bank of Israel formula, or paste an existing IBAN to check that it is valid."
      tool={<IbanCalculatorEn />}
      faq={faq}
      chips={['All Israeli banks', 'Validity check', 'Nothing is sent anywhere']}
      cta={{
        text: 'Collecting bank details from suppliers or clients? We build forms and systems that validate IBANs and account numbers as they are typed.',
        label: 'Custom software development',
        href: '/en/services/development',
      }}
    >
      <h2>How an Israeli IBAN is built</h2>
      <p>
        An Israeli IBAN always has {IL_IBAN_LENGTH} characters. In print it is split into groups of four, but forms and
        payment systems expect it typed without spaces:
      </p>
      <ul>
        <li>Characters 1 to 2: the country code, IL</li>
        <li>Characters 3 to 4: two check digits calculated from everything else</li>
        <li>Characters 5 to 7: the bank code, padded with zeros to three digits</li>
        <li>Characters 8 to 10: the branch number, three digits</li>
        <li>Characters 11 to 23: the account number, padded with leading zeros to 13 digits</li>
      </ul>

      <h3>
        Worked example: bank {EXAMPLE.bank}, branch {EXAMPLE.branch}, account {EXAMPLE.account}
      </h3>
      <ol>
        <li>Pad the parts: bank 012, branch 600, account 0000000123456</li>
        <li>Join them after IL and two zeros in place of the check digits: IL00{exampleBban}</li>
        <li>
          Move IL00 to the end, replace I with 18 and L with 21, and take the remainder of division by 97: it is{' '}
          {exampleRemainder}
        </li>
        <li>
          The check digits are 98 minus the remainder:{' '}
          <span className={styles.math}>
            98 − {exampleRemainder} = {exampleIban.slice(2, 4)}
          </span>
        </li>
        <li>The result: {formatIban(exampleIban)}</li>
      </ol>
      <p>
        To validate, run the same calculation on the full IBAN, check digits included: if the remainder is 1, the
        number is valid. This is how both the Bank of Israel simulator and the calculator on this page work.
      </p>

      <h2>Israeli bank codes</h2>
      <p>
        The bank code is the number that also appears on cheques and on an account confirmation letter. The list
        follows the Bank of Israel IBAN simulator:
      </p>
      <div className={styles.tableWrap} role="region" aria-label="Bank codes" tabIndex={0}>
        <table className={styles.table}>
          <caption>Bank code and how it appears in the IBAN</caption>
          <thead>
            <tr>
              <th scope="col">Code</th>
              <th scope="col">In the IBAN</th>
              <th scope="col">Bank</th>
            </tr>
          </thead>
          <tbody>
            {bankRows.map((bank) => (
              <tr key={bank.code}>
                <th scope="row">{bank.code}</th>
                <td>{String(bank.code).padStart(3, '0')}</td>
                <td>{englishBankName(bank.code) ?? bank.name}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2>Common mistakes</h2>
      <h3>An account number with the branch inside it</h3>
      <p>
        Some bank apps show the account number together with the branch, for example 600-123456. In the calculator,
        type each one in its own field. If you put both in the account field, you get an IBAN with valid check digits,
        but for a different account.
      </p>
      <h3>A valid check does not mean the account exists</h3>
      <p>
        The check digits confirm that the number was typed correctly, not that the account is open or belongs to the
        person who gave it to you. Before a first transfer to a new supplier, verify the details against an account
        confirmation letter.
      </p>

      <h2>Sources</h2>
      <ul>
        <li>
          <a
            href="https://www.boi.org.il/information/%D7%9E%D7%97%D7%A9%D7%91%D7%95%D7%A0%D7%99%D7%9D-%D7%95%D7%9B%D7%9C%D7%99%D7%9D/iban/"
            rel="noopener"
            target="_blank"
          >
            Bank of Israel
          </a>
          : IBAN simulator, structure, 13-digit account padding and the list of bank codes
        </li>
        <li>
          <a href="https://www.boi.org.il/roles/supervisionregulation/bank-sup/banklist/" rel="noopener" target="_blank">
            Bank of Israel
          </a>
          : list of banking corporations in Israel
        </li>
        <li>
          <a href="https://www.iso.org/standard/81090.html" rel="noopener" target="_blank">
            ISO 13616-1:2020
          </a>
          : International bank account number (IBAN)
        </li>
      </ul>
    </EnToolLayout>
  )
}
