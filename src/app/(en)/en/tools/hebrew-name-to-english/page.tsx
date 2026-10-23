import EnToolLayout, { enToolMetadata, type EnToolFaqEntry } from '../_components/EnToolLayout'
import NameTransliteratorEn from '../_components/NameTransliteratorEn'
import {
  NAME_TRANSLITERATION_CHECKED,
  dictionarySize,
  firstNames,
  lastNames,
  lookup,
  nameSources,
  passportStyle,
  transliterateName,
  type NameEntry,
} from '@/lib/name-transliteration'
import styles from '../../../../(he)/(site)/components/tools/NameTransliterator.module.css'

const SLUG = 'hebrew-name-to-english'
const META_TITLE = 'Hebrew Name to English: How to Spell a Hebrew Name in English'
const DESCRIPTION =
  'How to write a Hebrew name in English letters: Moshe, Yonatan, Chaim and hundreds of first names and surnames in their common spellings, letter-by-letter transliteration rules and passport spelling.'

const letterRows = [
  ['א, ע', 'Usually silent or a vowel', 'A, E, or no letter'],
  ['ב', 'B, and in the middle of a name sometimes V', 'Avi, Dvir, Boaz'],
  ['ג, ג׳', 'G, and J for ג׳', 'Gal, Jackie'],
  ['ה', 'H, and at the end of a name usually A or E', 'Hila, Moshe'],
  ['ו', 'V, or the vowel O or U', 'Vered, Doron, Yuval'],
  ['ז, ז׳', 'Z, and ZH for ז׳', 'Ziv, Zhenya'],
  ['ח', 'CH, H or KH', 'Chaim, Haim, Khen'],
  ['י', 'Y at the start of a syllable, I as a vowel', 'Yael, Dani'],
  ['כ, ך', 'K at the start of a name, CH or KH in the middle and at the end', 'Kobi, Rachel, Barak'],
  ['צ, ץ', 'TZ, TS or Z', 'Tzvi, Zvi, Nitzan'],
  ['ק', 'K, and sometimes Q', 'Keren, Qadir'],
  ['ש', 'SH, and sometimes S', 'Shira, Sarit'],
  ['ת', 'T', 'Tamar, Tom'],
  ['פ, ף', 'P, and F at the end of a word', 'Pini, Yosef'],
] as const

const pickEntries = (words: string[]) =>
  words.map((word) => lookup(word)).filter((entry): entry is NameEntry => Boolean(entry))

const popularFirst = pickEntries(['גיא', 'איתי', 'יובל', 'יעל', 'יהונתן', 'נועה', 'שרה', 'רבקה'])
const popularLast = pickEntries(['כהן', 'לוי', 'מזרחי', 'פרץ', 'ביטון', 'דהן'])
const compound = transliterateName('מיכל בן דוד')
const passportSample = passportStyle('Yael Cohen-Levi')

const faq: EnToolFaqEntry[] = [
  {
    id: 'en-name-faq-moshe',
    question: 'How do you write Moshe Cohen in English?',
    answer:
      'משה כהן is written Moshe Cohen, or Moses Cohen if you want the English form of the first name. כהן is usually Cohen and sometimes Kohen. There is no single correct spelling, because Hebrew is written without vowels and transliteration varies. If you already have a passport, use the spelling in it, so your name matches on plane tickets, at banks and on forms.',
  },
  {
    id: 'en-name-faq-passport',
    question: 'How is a Hebrew name spelled in an Israeli passport?',
    answer:
      'The Latin spelling in an Israeli passport is set by the Population and Immigration Authority and printed in capital letters. The spelling in the passport is what counts for every travel document: a plane ticket, visa or hotel booking should match it exactly. If you do not have a passport yet, you can suggest your preferred spelling when you apply, but the official records the final version.',
  },
  {
    id: 'en-name-faq-chet',
    question: 'Which is right: Chaim, Haim or Hayim?',
    answer:
      'All three are common. Chaim is common among English and Yiddish speakers, Haim is the simple spelling that matches Israeli pronunciation, and Hayim is close to academic transliteration. None is more correct; what matters is what is already on your documents. The letter ח is usually written CH or H, sometimes KH, and the choice should be consistent across all your documents.',
  },
  {
    id: 'en-name-faq-tz',
    question: 'How do you write the letter צ (tsadi) in English: Tz, Ts or Z?',
    answer:
      'Tz is common, as in Tzvi, Nitzan and Tzipi. Ts appears in names like Yitzhak or Ben-Tsion, and Z is used in names that settled that way, like Zvi or Zur. All represent the same sound. If your name is already in a passport, do not change the spelling, because a mismatch between a plane ticket and a passport can stop you boarding.',
  },
  {
    id: 'en-name-faq-versions',
    question: 'Why does one name have several spellings, like Yonatan and Jonathan?',
    answer:
      'There are two approaches: transliteration, which reflects the Hebrew pronunciation (Yonatan, Moshe, Yaakov), and the English equivalent known from the Bible (Jonathan, Moses, Jacob). Many people choose the transliteration because it matches how the name is said; others choose the English form because it is easier for English speakers. Both are fine, as long as official documents use one of them consistently.',
  },
]

const externalLink = (href: string, label: string) => (
  <a href={href} rel="noopener" target="_blank">
    {label}
  </a>
)

const NameList = ({ entries }: { entries: NameEntry[] }) => (
  <ul className={styles.nameGrid}>
    {entries.map((entry) => (
      <li key={entry.hebrew}>
        <strong lang="he">{entry.hebrew}</strong> <bdi>{entry.spellings.join(', ')}</bdi>
      </li>
    ))}
  </ul>
)

const checkedLabel = new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }).format(
  new Date(`${NAME_TRANSLITERATION_CHECKED}T00:00:00Z`),
)

export const metadata = enToolMetadata({ slug: SLUG, metaTitle: META_TITLE, description: DESCRIPTION })

export default function EnHebrewNameToEnglishPage() {
  return (
    <EnToolLayout
      slug={SLUG}
      metaTitle={META_TITLE}
      description={DESCRIPTION}
      lede="The same Hebrew name can be written in English in several ways: משה is Moshe or Moses, and יהונתן is Yehonatan or Jonathan. Type a name in Hebrew to get its common spellings; on a passport and official documents, the spelling already registered there is the one that counts."
      tool={<NameTransliteratorEn />}
      faq={faq}
      chips={[`${dictionarySize} names on the list`, 'Several spellings per name', `Checked ${NAME_TRANSLITERATION_CHECKED}`]}
      cta={{
        text: 'Need a tool connected to your business data, like a converter, calculator or smart form on your website?',
        label: 'Custom software development',
        href: '/en/services/development',
      }}
    >
      <h2>How the tool works</h2>
      <p>
        If the name is on our list of {dictionarySize} common first names and surnames, the tool shows its common
        spellings, with the most common first. If it is not on the list, the tool guesses up to three suggestions from
        transliteration rules and labels them as a guess. Hebrew is usually written without vowel points, so it is not
        clear which vowels are pronounced, and a guess like that needs checking by someone who knows how the name is
        said.
      </p>

      <h2 id="rules" className={styles.anchor}>
        Transliteration rules, letter by letter
      </h2>
      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <caption>How each Hebrew letter is written in Latin letters</caption>
          <thead>
            <tr>
              <th scope="col">Letter</th>
              <th scope="col">Common spelling</th>
              <th scope="col">Examples</th>
            </tr>
          </thead>
          <tbody>
            {letterRows.map(([letter, rule, example]) => (
              <tr key={letter}>
                <th scope="row" lang="he">
                  {letter}
                </th>
                <td>{rule}</td>
                <td>{example}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2 id="passport" className={styles.anchor}>
        Name spelling in an Israeli passport
      </h2>
      <p>
        The Latin spelling of a name is recorded in Israeli identity documents, and the passport prints it in capital
        letters. When you book a flight, visa or hotel, write the name exactly as it is in the passport, letter for
        letter. The official at the Population and Immigration Authority sets the registered version, according to{' '}
        {externalLink(nameSources.calcalist.href, 'a report in Calcalist')} (Hebrew), so the suggestion in this tool is
        only a starting point. Changing the name itself is a separate procedure in the population registry, described
        on {externalLink(nameSources.kolzchut.href, 'Kol Zchut')} and{' '}
        {externalLink(nameSources.gov.href, 'gov.il')} (both in Hebrew).
      </p>

      <h2>Common Hebrew names in English</h2>
      <p>
        These names are from the list, and the first spelling is the most common. Guy, Yael and Yuval have one spelling
        only, while איתי can be Itay or Itai, and נועה Noa or Noah.
      </p>
      <NameList entries={popularFirst} />
      <p>
        Common surnames usually have two spellings. כהן is Cohen or Kohen, and לוי is Levi or Levy. פרץ can be Peretz or
        Perez, and מזרחי Mizrahi or Mizrachi.
      </p>
      <NameList entries={popularLast} />

      <h2>Full names and two-word surnames</h2>
      <p>
        When you type a full name, the tool transliterates each word separately. Typing{' '}
        <span lang="he">{compound.map((item) => item.word).join(' ')}</span> returns{' '}
        <bdi>{compound.map((item) => item.variants[0]).join(' ')}</bdi>, because בן דוד is on the list as one surname.
        In passport style the tool writes everything in capitals and removes hyphens and apostrophes: {passportSample}{' '}
        instead of Yael Cohen-Levi. The final spelling is set by your identity documents, not by the tool.
      </p>

      <h2 id="first-names" className={styles.anchor}>
        Hebrew first names in English ({firstNames.length} names)
      </h2>
      <NameList entries={firstNames} />

      <h2 id="last-names" className={styles.anchor}>
        Hebrew surnames in English ({lastNames.length} names)
      </h2>
      <NameList entries={lastNames} />

      <p className={styles.caveat}>
        The list was compiled from the common forms and is not official. There is no single legal spelling of a name,
        and the spelling on your passport, certificates and bank account counts even if it differs from the one here.
      </p>

      <h2>Sources</h2>
      <ul>
        <li>{externalLink(nameSources.kolzchut.href, 'Kol Zchut: changing a name in the population registry (Hebrew)')}</li>
        <li>{externalLink(nameSources.gov.href, 'gov.il: changing a surname in the population registry (Hebrew)')}</li>
        <li>
          {externalLink(
            nameSources.calcalist.href,
            'Calcalist: report on the official setting the Latin spelling (older article, Hebrew)',
          )}
        </li>
      </ul>
      <p className={styles.reviewed}>
        Sources checked on {checkedLabel}. None of them sets binding transliteration rules, so the list is an edited
        collection of the common forms.
      </p>
    </EnToolLayout>
  )
}
