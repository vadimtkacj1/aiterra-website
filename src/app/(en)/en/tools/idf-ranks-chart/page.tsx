import EnToolLayout, { enToolMetadata, type EnToolFaqEntry } from '../_components/EnToolLayout'
import { IDF_RANKS_REVIEWED, idfRanks, type RankGroup } from '@/lib/idf-ranks'
import styles from '../../../../(he)/(site)/tools/maternity-leave-calculator/page.module.css'

const SLUG = 'idf-ranks-chart'
const META_TITLE = 'IDF Ranks in Order: Hebrew Names, Abbreviations, English'
const DESCRIPTION =
  'All 18 general IDF ranks in order, from Turai (Private) to Rav Aluf (Lieutenant General): Hebrew name, transliteration, Hebrew abbreviation, English rank and NATO code.'

const transliteration: Record<string, string> = {
  turai: 'Turai',
  'rav-turai': 'Rav Turai',
  samal: 'Samal',
  samar: 'Samal Rishon',
  rasal: 'Rav Samal',
  rasar: 'Rav Samal Rishon',
  rasam: 'Rav Samal Mitkadem',
  rasab: 'Rav Samal Bakhir',
  ranag: 'Rav Nagad',
  'segen-mishne': 'Segen Mishne',
  segen: 'Segen',
  seren: 'Seren',
  'rav-seren': 'Rav Seren',
  'sgan-aluf': 'Sgan Aluf',
  'aluf-mishne': 'Aluf Mishne',
  'tat-aluf': 'Tat Aluf',
  aluf: 'Aluf',
  'rav-aluf': 'Rav Aluf',
}

const groupNames: Record<RankGroup, string> = {
  enlisted: 'Enlisted (chogrim)',
  nco: 'Non-commissioned officers (nagadim)',
  officer: 'Officers (ktzinim)',
}

const groupOrder: RankGroup[] = ['enlisted', 'nco', 'officer']
const countOf = (group: RankGroup) => idfRanks.filter((rank) => rank.group === group).length
const reviewed = new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }).format(
  new Date(`${IDF_RANKS_REVIEWED}T12:00:00Z`),
)

const faq: EnToolFaqEntry[] = [
  {
    id: 'en-idf-faq-order',
    question: 'What are the IDF ranks in order, from lowest to highest?',
    answer:
      'Enlisted: Turai, Rav Turai, Samal and Samal Rishon. Non-commissioned officers: Rav Samal, Rav Samal Rishon, Rav Samal Mitkadem, Rav Samal Bakhir and Rav Nagad. Officers: Segen Mishne, Segen, Seren, Rav Seren, Sgan Aluf, Aluf Mishne, Tat Aluf, Aluf and Rav Aluf. The table above lists them in exactly this order, with the Hebrew abbreviation of each.',
  },
  {
    id: 'en-idf-faq-highest',
    question: 'What is the highest rank in the IDF?',
    answer:
      'Rav Aluf, usually translated as Lieutenant General. By IDF practice it is held by the Chief of the General Staff (the Ramatkal). The commander of the Navy may hold Rav Aluf as a representational rank towards foreign navies, which is not an additional rank.',
  },
  {
    id: 'en-idf-faq-english',
    question: 'Are the English rank names official?',
    answer:
      'For officers the English equivalents are fixed and widely used: Seren is Captain, Rav Seren is Major and Aluf Mishne is Colonel. Enlisted and NCO ranks have no exact match in other armies, and the table uses the translations common on English Wikipedia. The IDF is not a NATO member, so NATO codes are shown for officers only, as a conventional comparison.',
  },
  {
    id: 'en-idf-faq-groups',
    question: 'What is the difference between chogrim, nagadim and ktzinim?',
    answer:
      'Chogrim are soldiers from Turai to Samal Rishon, usually in compulsory service. Nagadim are career soldiers who did not complete an officers course, from Rav Samal to Rav Nagad. Ktzinim are officers who completed an officers course or an equivalent, such as the pilots course.',
  },
  {
    id: 'en-idf-faq-official',
    question: 'Is this an official IDF page?',
    answer:
      'No. It is an independent reference by Aiterra, with no connection to the IDF or the IDF Spokesperson. The data was checked against Hebrew and English Wikipedia and the IDF website on the date shown below. For official questions, contact the IDF.',
  },
]

export const metadata = enToolMetadata({ slug: SLUG, metaTitle: META_TITLE, description: DESCRIPTION })

function RanksTable() {
  return (
    <div className={styles.tableWrap} role="region" aria-label="IDF ranks in order" tabIndex={0}>
      <table className={styles.table}>
        <caption>IDF ranks from lowest to highest</caption>
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">Rank</th>
            <th scope="col">Hebrew</th>
            <th scope="col">Abbreviation</th>
            <th scope="col">English</th>
            <th scope="col">NATO</th>
          </tr>
        </thead>
        <tbody>
          {idfRanks.map((rank, index) => (
            <tr key={rank.id}>
              <td>{index + 1}</td>
              <th scope="row">{transliteration[rank.id]}</th>
              <td lang="he" dir="rtl">
                {rank.name}
              </td>
              <td lang="he" dir="rtl">
                {rank.abbreviation}
              </td>
              <td>{rank.english}</td>
              <td>{rank.nato || '–'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default function EnIdfRanksPage() {
  return (
    <EnToolLayout
      slug={SLUG}
      metaTitle={META_TITLE}
      description={DESCRIPTION}
      lede={`The IDF has ${idfRanks.length} general ranks, from Turai (Private) to Rav Aluf (Lieutenant General), in three groups: ${countOf('enlisted')} enlisted ranks, ${countOf('nco')} non-commissioned officer ranks and ${countOf('officer')} officer ranks. The table gives each rank in order with its Hebrew name, abbreviation and English equivalent.`}
      chips={['Unofficial reference', `${idfRanks.length} ranks in order`, 'NATO codes for officers']}
      tool={<RanksTable />}
      faq={faq}
      cta={{
        text: 'Need a bilingual site or a reference tool like this for your organisation? We build them in Hebrew and English.',
        label: 'Web development',
        href: '/en/services/development',
      }}
    >
      <h2>The three groups of IDF ranks</h2>
      <ul>
        {groupOrder.map((group) => (
          <li key={group}>
            <strong>{groupNames[group]}</strong>: {countOf(group)} ranks, from{' '}
            {transliteration[idfRanks.filter((rank) => rank.group === group)[0].id]} to{' '}
            {transliteration[idfRanks.filter((rank) => rank.group === group).at(-1)!.id]}.
          </li>
        ))}
      </ul>
      <p>
        Enlisted ranks are worn on the sleeve. NCO and officer ranks are worn on the shoulder straps. The exact
        insignia are shown in the pictures on the IDF website.
      </p>

      <h2>Special ranks not in the table</h2>
      <p>
        Katzin Miktzo&apos;i Akademai (Kama) is a rank for graduates of the academic reserve who did not complete an
        officers course, roughly parallel to Segen, with senior grades of its own. Rav Nagad Mishne was approved in
        2011 between Rav Samal Bakhir and Rav Nagad, but according to Wikipedia it is not in use, so the table leaves
        it out.
      </p>

      <h2>Sources</h2>
      <ul className={styles.sources}>
        <li>
          <a href="https://en.wikipedia.org/wiki/Israel_Defense_Forces_ranks" rel="noopener" target="_blank">
            Wikipedia: Israel Defense Forces ranks
          </a>
        </li>
        <li>
          <a href="https://he.wikipedia.org/wiki/%D7%93%D7%A8%D7%92%D7%95%D7%AA_%D7%A6%D7%94%22%D7%9C" rel="noopener" target="_blank">
            Hebrew Wikipedia: IDF ranks (Hebrew)
          </a>
        </li>
        <li>
          <a
            href="https://www.idf.il/%D7%90%D7%AA%D7%A8%D7%99%D7%9D/%D7%94%D7%9E%D7%A4%D7%A7%D7%93-%D7%99%D7%A9-%D7%9C%D7%99-%D7%A9%D7%90%D7%9C%D7%94/%D7%9E%D7%AA%D7%92%D7%99%D7%99%D7%A1%D7%99%D7%9D/%D7%94%D7%93%D7%A8%D7%92%D7%95%D7%AA-%D7%91%D7%A6%D7%94%D7%9C/"
            rel="noopener"
            target="_blank"
          >
            IDF website: ranks in the IDF (Hebrew)
          </a>
        </li>
      </ul>
      <p className={styles.caveat}>
        An independent reference by Aiterra, not an official IDF publication. Checked against the sources on {reviewed}.
      </p>
    </EnToolLayout>
  )
}
