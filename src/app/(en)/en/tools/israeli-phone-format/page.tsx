import EnToolLayout, { enToolMetadata, type EnToolFaqEntry } from '../_components/EnToolLayout'
import IsraeliPhoneFormatterEn from '../_components/IsraeliPhoneFormatterEn'
import { MOBILE_PREFIXES, NATIONAL_PREFIXES } from '@/lib/israeli-phone'
import styles from '../../../../(he)/(site)/tools/israeli-phone-format/page.module.css'

const SLUG = 'israeli-phone-format'
const META_TITLE = 'Israel Country Code +972: Phone Number Formatter'
const DESCRIPTION =
  'Israel\'s country code is 972. Convert an Israeli number to international format for WhatsApp, dialling from abroad and your CRM, or clean a whole list of duplicates into a CSV file. Free, no sign-up.'

const withZero = (prefixes: string[]) => prefixes.map((prefix) => `0${prefix}`).join(', ')

const numberTypes: { prefix: string; kind: string; digits: string; abroad: string }[] = [
  {
    prefix: '02, 03, 04, 08, 09',
    kind: 'Landline, by area code: 02 Jerusalem, 03 Tel Aviv, 04 Haifa and the north, 08 the Shfela and the south, 09 the Sharon',
    digits: '9',
    abroad: '+972 3 612 3456',
  },
  {
    prefix: withZero(MOBILE_PREFIXES),
    kind: 'Mobile. 056 and 059 are allocated to operators in the Palestinian Authority',
    digits: '10',
    abroad: '+972 52 345 6789',
  },
  {
    prefix: withZero(NATIONAL_PREFIXES),
    kind: 'National: a line from a telephony provider not tied to an area, such as an internet (VoIP) line',
    digits: '10',
    abroad: '+972 72 212 3456',
  },
  { prefix: '1-800', kind: 'Toll-free number', digits: '10', abroad: '' },
  { prefix: '1-700', kind: 'National service number, as are other service numbers starting with 1', digits: '10', abroad: '' },
  { prefix: '*2345', kind: 'Business star number: an asterisk and four digits', digits: '4 and an asterisk', abroad: '' },
]

const sources: { href: string; label: string; note: string }[] = [
  {
    href: 'https://www.gov.il/BlobFolder/policy/number_policy/en/The_numbering_plan-02-2023.pdf',
    label: 'Ministry of Communications: Numbering Plan for telephony, ancillary and value-added services in Israel, edition 4 of 2 February 2023',
    note: 'section 2.1.1 (dialling prefixes, including the reserved 06 and a note on portability), 2.1.2 (number formats, including M2M and 10-digit service numbers), 2.2.7 (dialling Israel from abroad without the 0), 3 (number portability) and 4 (business star numbers)',
  },
  {
    href: 'https://data.gov.il/he/datasets/tikshoret/israel-numbering-plan',
    label: 'Ministry of Communications: numbering ranges allocated to providers (Israel Numbering Plan), government open data, updated 14 September 2026',
    note: 'prefixes in use, M2M ranges and prefixes allocated to operators in the Palestinian Authority',
  },
  {
    href: 'https://faq.whatsapp.com/1294841057948784/',
    label: 'WhatsApp Help Center: about international phone number format',
    note: 'plus sign, country code and local number, removing leading zeros, and landlines only in the WhatsApp Business app',
  },
  {
    href: 'https://business.whatsapp.com/policy',
    label: 'WhatsApp Business Messaging Policy',
    note: 'contact only people who gave the business their number and opted in to receive messages',
  },
  {
    href: 'https://he.wikisource.org/wiki/%D7%97%D7%95%D7%A7_%D7%94%D7%AA%D7%A7%D7%A9%D7%95%D7%A8%D7%AA_(%D7%91%D7%96%D7%A7_%D7%95%D7%A9%D7%99%D7%93%D7%95%D7%A8%D7%99%D7%9D)',
    label: 'Communications (Telecommunications and Broadcasting) Law, 1982, updated text on Wikisource (Hebrew)',
    note: 'section 30A: prior consent to advertising, the existing-customer exception, refusal notices and statutory damages of up to ₪1,000 per message',
  },
]

const faq: EnToolFaqEntry[] = [
  {
    id: 'en-il-phone-faq-code',
    question: 'What is the country code for Israel?',
    answer:
      'Israel\'s country code is 972. In international format you write + followed by 972, then the number without its leading 0. So 052-3456789 becomes +972523456789. On a mobile phone, type + with a long press on 0. From a landline abroad, dial that country\'s exit code instead of +, for example 00 in most of Europe or 011 in the United States and Canada.',
  },
  {
    id: 'en-il-phone-faq-whatsapp',
    question: 'How do I write an Israeli mobile number for WhatsApp?',
    answer:
      'Save the number in your contacts in full international format: +, then 972, then the number without the 0. According to the WhatsApp Help Center, an international number includes a plus sign, the country code and the local number, and leading zeros should be removed. In a wa.me link use digits only, with no + or dashes, for example wa.me/972523456789.',
  },
  {
    id: 'en-il-phone-faq-zero',
    question: 'Why do you drop the 0 after 972?',
    answer:
      'The 0 belongs to dialling inside Israel, not to the number itself. In the Ministry of Communications numbering plan, a leading 0 signals a call outside your area code. Someone calling Israel from abroad has already chosen the country by dialling 972, so under the plan they dial the number without its first digit. 972 followed by 0 is a common mistake, and the WhatsApp Help Center warns that leading zeros can cause errors.',
  },
  {
    id: 'en-il-phone-faq-1800',
    question: 'Can I call an Israeli 1-800 number from abroad?',
    answer:
      'Under the numbering plan, only a landline, mobile or 07 number can be dialled from abroad after 972. Service numbers starting with 1, such as 1-800 and 1-700, and business star numbers are not on that list, so they have no international form. If you have customers or suppliers abroad, publish a regular number in international format next to the short number, such as an 07 line or a mobile.',
  },
  {
    id: 'en-il-phone-faq-carrier',
    question: 'Can I tell the carrier from an Israeli prefix?',
    answer:
      'No. Since 2 December 2007 Israel has had number portability: you can switch to another carrier and keep the same number. The Ministry of Communications numbering plan itself says the prefix allocation has no practical meaning, because the number may have moved to another provider. So a number starting with 052 is not necessarily Cellcom. The prefix does tell you the type of number: mobile, landline by area code, 07 or service number.',
  },
]

export const metadata = enToolMetadata({ slug: SLUG, metaTitle: META_TITLE, description: DESCRIPTION })

export default function EnIsraeliPhoneFormatPage() {
  return (
    <EnToolLayout
      slug={SLUG}
      metaTitle={META_TITLE}
      description={DESCRIPTION}
      lede="Israel's country code is +972. To write an Israeli number internationally, put +972 in front and drop the leading 0: 052-345-6789 becomes +972 52 345 6789. Type a number in any format below to get it ready for WhatsApp, dialling from abroad and your CRM, or paste a whole list to get it back clean, without duplicates, as a CSV file."
      chips={['One number or a whole list', 'CSV file for your CRM', 'Based on the Ministry of Communications numbering plan', 'Numbers are never sent anywhere']}
      tool={<IsraeliPhoneFormatterEn />}
      faq={faq}
      cta={{
        text: 'Messy customer list? We clean it up and connect your contacts to a CRM and WhatsApp Business, so every new enquiry is saved in one place and one format.',
        label: 'Business automation',
        href: '/en/services/automation',
      }}
    >
      <h2>How to write an Israeli number in international format</h2>
      <p>
        In international format you write + followed by the country code. Israel&apos;s code is 972, followed by the
        number without its leading 0. This format is called E.164, and it is the same everywhere: in WhatsApp, in a CRM
        and in mailing systems.
      </p>
      <ul>
        <li>
          Mobile: 052-3456789 becomes <code>+972523456789</code>
        </li>
        <li>
          Tel Aviv landline: 03-6123456 becomes <code>+97236123456</code>
        </li>
        <li>
          07 number: 072-2123456 becomes <code>+972722123456</code>
        </li>
      </ul>

      <h3>Why the 0 is dropped</h3>
      <p>
        The 0 at the start of an Israeli number is not part of the number itself. Under the Ministry of Communications
        numbering plan, a leading 0 signals a call outside your area code, for example from Jerusalem to Tel Aviv or to
        a mobile. Someone calling Israel from abroad has already chosen the country by dialling 972, so under section
        2.2.7 of the plan they dial the number &quot;omitting the first digit&quot;. That is why 972 followed by 0 is a
        mistake, and the WhatsApp Help Center warns that leading zeros can cause errors.
      </p>

      <h3>For WhatsApp</h3>
      <p>
        In your phone contacts, save the number in full international format, for example <code>+972 52 345 6789</code>.
        According to the WhatsApp Help Center, an international number includes a plus sign, the country code and the
        local number, with any leading zeros removed.
      </p>
      <p>
        In a chat link use digits only, with no + or dashes: <code>https://wa.me/972523456789</code>. A landline can be
        registered only in the WhatsApp Business app, with a verification code delivered by phone call.
      </p>

      <h3>For customers abroad and business cards</h3>
      <p>
        On your website, email signature and English business card, write the number with spaces so it is easy to read:{' '}
        <code>+972 52 345 6789</code>. On a mobile, type + with a long press on 0. From a landline abroad, dial that
        country&apos;s exit code instead of +, for example 00 in most of Europe or 011 in the United States and Canada. A
        call button on a website uses a link like <code>tel:+972523456789</code>, and thanks to the country code it works
        from abroad too.
      </p>

      <h3>For a CRM</h3>
      <p>
        In a CRM, store every number in one field and in the same format, preferably E.164: <code>+972523456789</code>.
        When all numbers are written the same way, the system spots duplicates and attaches a new enquiry to the right
        customer record. When the same number is saved once as 052-3456789 and once as 972523456789, the system sees two
        different customers.
      </p>

      <h2>Israeli number types under the numbering plan</h2>
      <p>
        The Ministry of Communications numbering plan sets what each prefix means and how many digits each type of
        number has. The tool checks every number against the formats in the plan and the ministry&apos;s allocation
        list, as updated on 14 September 2026.
      </p>
      <div className={styles.tableWrap} role="region" aria-label="Israeli number types" tabIndex={0}>
        <table className={styles.table}>
          <caption>Israeli number types</caption>
          <thead>
            <tr>
              <th scope="col">Prefix</th>
              <th scope="col">Type of number</th>
              <th scope="col">Digits including the 0</th>
              <th scope="col">International format</th>
            </tr>
          </thead>
          <tbody>
            {numberTypes.map((row) => (
              <tr key={row.prefix}>
                <th scope="row">{row.prefix}</th>
                <td>{row.kind}</td>
                <td>{row.digits}</td>
                <td>
                  {row.abroad ? <span className={styles.nowrap}>{row.abroad}</span> : 'None, cannot be dialled from abroad'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p>A few more rules from the plan and the allocation list that the tool checks:</p>
      <ul>
        <li>In a landline or 07 number, the digit after the prefix is 2 to 9. A number like 03-1234567 does not exist.</li>
        <li>
          In a mobile number, when the digit after the prefix is 0 or 1, for example 050-1234567, the number belongs to
          the M2M range, that is SIM cards in devices.
        </li>
        <li>The 06 prefix is reserved for future use, and 057, 070, 071, 075 and 078 are not currently allocated to any company.</li>
        <li>Short numbers such as 100 or 144 are short service codes and have no international form.</li>
      </ul>

      <h3>You cannot tell the carrier from the prefix</h3>
      <p>
        In the Ministry of Communications allocation list you can see, for example, that 052 was allocated to Cellcom
        and 054 to Partner. But since 2 December 2007 Israel has had number portability: you can switch carriers and keep
        your number. The numbering plan itself says the prefixes have &quot;no meaning for the actual allocation, since
        the number may have been ported to another licensed provider&quot;. So the tool identifies the type of number,
        not the carrier.
      </p>

      <h3>Numbers you cannot dial from abroad</h3>
      <p>
        Under section 2.2.7 of the plan, only a geographic (landline), mobile or 07 national number can be dialled from
        abroad after 972. Service numbers starting with 1, such as 1-800 and 1-700, and business star numbers are not
        included, so they have no international form and no WhatsApp link. If you have customers or suppliers abroad,
        publish a regular number in international format next to the short number.
      </p>

      <h2>Common mistakes and cleaning lists for marketing</h2>
      <h3>Common mistakes</h3>
      <ul>
        <li>
          <strong>972 and a 0.</strong> <code>+9720523456789</code> is wrong: no 0 comes after 972.
        </li>
        <li>
          <strong>0 without 972.</strong> <code>wa.me/0523456789</code> is not in international format, and the link
          needs the full international number. Correct: <code>wa.me/972523456789</code>.
        </li>
        <li>
          <strong>Excel dropped the 0.</strong> When an Excel column is formatted as a number, 0523456789 is saved as
          523456789. The tool spots this and restores the 0, but it is better to format the phone column as text in
          advance.
        </li>
        <li>
          <strong>Scientific notation.</strong> A long number like 972523456789 sometimes shows in Excel as{' '}
          <code>9.72523E+11</code>, and copying the cell gives the shortened text. Format the column as a number with no
          decimal places and copy again.
        </li>
        <li>
          <strong>1-800 or star numbers for customers abroad.</strong> These numbers have no international form, and
          callers abroad cannot reach them.
        </li>
        <li>
          <strong>Two numbers in one cell.</strong> A cell like <code>052-3456789 / 054-7654321</code> should be split into
          two rows, or two CRM fields.
        </li>
      </ul>

      <h3>Cleaning a phone list before importing it into a CRM</h3>
      <ol>
        <li>
          Copy the column, or the whole table, from Excel or Google Sheets and paste it into the tool in A list of
          numbers mode. If there are several columns, choose the phone column.
        </li>
        <li>
          The tool converts every number to E.164 and removes duplicates, even when the same number is written in
          different ways, such as 052-3456789 and <code>+972 52-345-6789</code>.
        </li>
        <li>
          Go through the rows that were left out. Each one says why: a missing digit, a prefix that does not exist, a
          1-800 number or a row with no number.
        </li>
        <li>
          Download the CSV file and import it into your CRM. The file is UTF-8 with a BOM, so Hebrew text is preserved.
          If you open it in Excel before importing, Excel may show the numbers without the + or in scientific notation,
          and if you save the file the change sticks. So it is better to import the file as it is.
        </li>
      </ol>
      <p>
        Technical clean-up does not replace consent. Under section 30A of the Communications Law, advertising may not be
        sent by SMS, electronic message or automatic dialler without the recipient&apos;s explicit prior consent. There
        is a narrow exception for customers who gave their details during a purchase and were given the chance to
        refuse, and anyone who asks to be removed must come off the list. For advertising knowingly sent in breach of the
        section, a court can award statutory damages of up to ₪1,000 per message, without proof of harm.
      </p>
      <p>
        WhatsApp Business policy also allows contacting only people who gave you their number and agreed to receive
        messages from you. So it is worth recording in your CRM, next to each number, when and how consent was given, and
        flagging who asked to be removed.
      </p>

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
        The prefixes, rules and sections on this page and in the tool were checked against the sources on 23 October
        2026. This is general information, not legal advice.
      </p>
    </EnToolLayout>
  )
}
