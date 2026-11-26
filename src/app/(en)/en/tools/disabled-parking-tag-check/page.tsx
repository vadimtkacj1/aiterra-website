import Link from 'next/link'
import EnToolLayout, { enToolMetadata, type EnToolFaqEntry } from '../_components/EnToolLayout'
import DisabledTagLookupEn from '../_components/DisabledTagLookupEn'
import { TAG_DATASET_URL } from '@/lib/disabled-parking-tag'
import styles from '../../../../(he)/(site)/tools/bingo-card-generator/page.module.css'

const SLUG = 'disabled-parking-tag-check'
const META_TITLE = 'Israel Disabled Parking Permit Check by Vehicle Number'
const DATA_DATE = '25 November 2026'
const REVIEWED_DATE = '26 November 2026'
const TAG_RECORDS = 632391
const TYPE_ONE_RECORDS = 598313
const TYPE_TWO_RECORDS = 34078

const count = (value: number) => value.toLocaleString('en-IL')

const DESCRIPTION = `Check whether an Israeli vehicle number is in the Ministry of Transport database of disabled parking permits (tav nacheh), with the permit issue date and the vehicle details. ${count(TAG_RECORDS)} vehicles, free.`

const faq: EnToolFaqEntry[] = [
  {
    id: 'en-tag-faq-how',
    question: 'How do I check whether a car in Israel has a disabled parking permit?',
    answer: `Enter the vehicle number, 7 or 8 digits, and press Check. The tool looks the number up in the Ministry of Transport open database "Vehicles with a disabled parking permit" on data.gov.il, which held ${count(TAG_RECORDS)} vehicles in the file updated on ${DATA_DATE}. If the vehicle is there, you see the date the permit was issued, with the make, model, year and colour from the vehicle database, so you can confirm it is the right car.`,
  },
  {
    id: 'en-tag-faq-valid',
    question: 'Does the check tell me the permit is still valid?',
    answer:
      'The database holds the numbers of vehicles authorised to carry a disabled parking permit, and the date each permit was issued. It has no expiry date. So a vehicle that appears is registered as authorised in the current file, but the exact validity is shown only on the permit itself and in Ministry of Transport records. If the vehicle does not appear, the permit may have been cancelled, may be too new, or may be one that is not managed in this database.',
  },
  {
    id: 'en-tag-faq-owner',
    question: 'Can I find out whose permit it is?',
    answer:
      'No. The public database holds only the vehicle number, the issue date and a permit type code, with no name, ID number or address of the permit holder. The tool does not store the number you searched for either: the request goes from your browser straight to data.gov.il.',
  },
  {
    id: 'en-tag-faq-type',
    question: 'What does the permit type code in the result mean?',
    answer: `The database has a permit type field with the values 1 and 2. In our count on ${REVIEWED_DATE}, ${count(TYPE_ONE_RECORDS)} vehicles were registered with code 1 and ${count(TYPE_TWO_RECORDS)} with code 2. The Ministry of Transport does not publish an explanation of the codes on the dataset page, so we show the code as it is and do not guess its meaning.`,
  },
  {
    id: 'en-tag-faq-fresh',
    question: 'How current is the database?',
    answer: `The tool fetches the data on every check straight from data.gov.il and shows the date the file was last updated. On ${REVIEWED_DATE} the file had been updated the day before. A permit issued today will usually appear only after the next update.`,
  },
]

export const metadata = enToolMetadata({ slug: SLUG, metaTitle: META_TITLE, description: DESCRIPTION })

export default function EnDisabledParkingTagCheckPage() {
  return (
    <EnToolLayout
      slug={SLUG}
      metaTitle={META_TITLE}
      description={DESCRIPTION}
      lede="Enter an Israeli vehicle number to see whether it is in the Ministry of Transport database of disabled parking permits, when the permit was issued, and the make, model and colour of the vehicle. No owner name and no sign-up."
      chips={['Ministry of Transport database', 'Permit issue date', 'Vehicle details to confirm', 'No owner name']}
      tool={<DisabledTagLookupEn />}
      faq={faq}
      cta={{
        text: 'We connect open government databases to business systems: automatic checks for vehicle fleets, car parks and access systems.',
        label: 'Custom software development',
        href: '/en/services/development',
      }}
    >
      <h2>What this check covers</h2>
      <p>
        In Israel a disabled parking permit is called tav nacheh or tag nacheh, and it is registered to a vehicle
        number. The Ministry of Transport publishes on data.gov.il the database{' '}
        <a href={TAG_DATASET_URL} rel="noopener" target="_blank">
          Vehicles with a disabled parking permit
        </a>
        , which according to its description holds the numbers of vehicles authorised to carry a Ministry of Transport
        disabled parking permit. Each vehicle has a permit issue date and a permit type code. The tool looks up the
        number you entered in this database and, at the same time, in the vehicle database, to show the make, model,
        year and colour.
      </p>

      <h2>When it is useful</h2>
      <ul>
        <li>A car park owner, a building committee or a facilities manager who wants to confirm that a car in a disabled bay is registered as authorised.</li>
        <li>Someone buying a used car that was registered with a permit, who wants to know whether the permit is still linked to the number.</li>
        <li>A permit holder who wants to confirm that their new car already appears in the database.</li>
      </ul>
      <p>
        The tool does not replace the physical permit or Ministry of Transport records, and it is not meant for tracing
        people. For more about the vehicle itself, such as the annual test expiry, use the{' '}
        <Link href="/en/tools/vehicle-lookup">Israel car check by number plate</Link>.
      </p>

      <h2>Sources</h2>
      <ul>
        <li>
          <a href={TAG_DATASET_URL} rel="noopener" target="_blank">
            data.gov.il: Vehicles with a disabled parking permit, Ministry of Transport and Road Safety (Hebrew)
          </a>
          : vehicle number, permit issue date and permit type code. Checked through the API on {REVIEWED_DATE}:{' '}
          {count(TAG_RECORDS)} records, file updated on {DATA_DATE}.
        </li>
      </ul>
      <p className={styles.reviewed}>
        The data and the source were checked on {REVIEWED_DATE}. The explanations on this page are general information.
      </p>
    </EnToolLayout>
  )
}
