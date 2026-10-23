import EnToolLayout, { enToolMetadata, type EnToolFaqEntry } from '../_components/EnToolLayout'
import GematriaCalculatorEn from '../_components/GematriaCalculatorEn'
import { enMethodNames } from '../_components/gematria-en'
import { calculate, famousPairs, methods, valueOf } from '@/lib/gematria'
import styles from '../../../../(he)/(site)/tools/gematria-calculator/page.module.css'

const SLUG = 'gematria-calculator'
const META_TITLE = 'Gematria Calculator: Hebrew Word and Name Values in 6 Methods'
const DESCRIPTION =
  'Free gematria calculator: type a Hebrew word, name or phrase and get its value in standard gematria, mispar gadol, katan and ordinal, Atbash and Albam, with a letter-by-letter breakdown.'

const SOURCES = {
  gematria: 'https://en.wikipedia.org/wiki/Gematria',
  atbash: 'https://en.wikipedia.org/wiki/Atbash',
  avot: `https://he.wikisource.org/wiki/${encodeURIComponent('משנה_אבות_ג_יח')}`,
  jeremiah: `https://he.wikisource.org/wiki/${encodeURIComponent('ירמיהו_כה_כו')}`,
}

const shalom = calculate('שלום').totals
const ahava = valueOf('אהבה')
const yayin = valueOf('יין')
const sheshach = calculate('ששך')

const He = ({ children }: { children: string }) => <span lang="he">{children}</span>

const faq: EnToolFaqEntry[] = [
  {
    id: 'en-gematria-faq-what',
    question: 'What is gematria?',
    answer:
      'Gematria is the numerical value of a Hebrew word, worked out from the values of its letters: Alef is 1, Yod is 10, Qof is 100 and Tav is 400. You add up the letters and get a number. In Jewish commentary, midrash and Kabbalah, words with the same value are compared, and the same system is used every day to write numbers in letters, as in the Hebrew date and in chapter numbers.',
  },
  {
    id: 'en-gematria-faq-calc',
    question: 'How do I calculate the gematria of a name?',
    answer: `Type the name in Hebrew letters and the calculator adds it up at once. By hand, add the letter values: שלום (shalom) is Shin 300, Lamed 30, Vav 6 and Mem 40, ${shalom.standard} in total. Vowel points and spaces do not change the result, so a first name and surname can be counted together or apart. Full and defective spelling give different results, because every extra Yod or Vav adds to the sum.`,
  },
  {
    id: 'en-gematria-faq-finals',
    question: 'What are the final letters worth?',
    answer: `In standard gematria (mispar hechrachi) the final letters are worth the same as the regular ones: final Mem is 40, like Mem. In mispar gadol they continue the count after Tav: final Kaf 500, final Mem 600, final Nun 700, final Pe 800 and final Tsadi 900. So shalom is ${shalom.standard} in the standard method and ${shalom.gadol} in mispar gadol. When someone says "in gematria" without naming a method, they almost always mean the standard one.`,
  },
  {
    id: 'en-gematria-faq-atbash',
    question: 'What is Atbash?',
    answer: `Atbash replaces each letter with the one opposite it when the alphabet is reversed: Alef with Tav, Bet with Shin, Gimel with Resh and so on. The best-known example is Jeremiah 25:26, where ששך (Sheshach) reads ${sheshach.atbashText} (Babylon) in Atbash. The calculator shows the word after the swap and its gematria value. Albam works the same way but swaps the two halves of the alphabet: Alef with Lamed, Bet with Mem.`,
  },
  {
    id: 'en-gematria-faq-same',
    question: 'Which words have the same value?',
    answer: `Well-known pairs: אהבה (love) and אחד (one) are both ${ahava}, and יין (wine) and סוד (secret) are both ${yayin}, hence the saying "wine goes in, a secret comes out". אלהים (God) and הטבע (nature) are both 86, and נחש (serpent) and משיח (messiah) are 358. The calculator shows matching words from a short list of about 80 well-known words we chose, not from the whole dictionary, so if no word appears, that does not mean none exists.`,
  },
]

export const metadata = enToolMetadata({ slug: SLUG, metaTitle: META_TITLE, description: DESCRIPTION })

export default function EnGematriaCalculatorPage() {
  return (
    <EnToolLayout
      slug={SLUG}
      metaTitle={META_TITLE}
      description={DESCRIPTION}
      lede={`Gematria is the sum of the letter values of a Hebrew word: shalom (שלום) is ${shalom.standard}, because Shin is 300, Lamed 30, Vav 6 and Mem 40. Type a Hebrew word, name or phrase below to get its value in six methods, with a letter-by-letter breakdown and well-known words of the same value.`}
      tool={<GematriaCalculatorEn />}
      faq={faq}
      chips={['6 methods', 'Letter-by-letter breakdown', 'Final letters and vowel points', 'Matching words']}
      cta={{
        text: 'We build tools and systems that handle Hebrew properly: letters, vowel points and right-to-left text.',
        label: 'Custom software development',
        href: '/en/services/development',
      }}
    >
      <h2 id="values" className={styles.anchor}>
        Hebrew letter values in gematria
      </h2>
      <p>
        The 22 letters fall into three groups: units, tens and hundreds. In standard gematria the five final letters
        are worth the same as their regular forms; in mispar gadol they continue from 500 to 900.
      </p>
      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <caption>Letter values in standard gematria</caption>
          <thead>
            <tr>
              <th scope="col">Group</th>
              <th scope="col">Letters and values</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row">Units</th>
              <td>
                <He>א</He> 1, <He>ב</He> 2, <He>ג</He> 3, <He>ד</He> 4, <He>ה</He> 5, <He>ו</He> 6, <He>ז</He> 7,{' '}
                <He>ח</He> 8, <He>ט</He> 9
              </td>
            </tr>
            <tr>
              <th scope="row">Tens</th>
              <td>
                <He>י</He> 10, <He>כ</He> 20, <He>ל</He> 30, <He>מ</He> 40, <He>נ</He> 50, <He>ס</He> 60, <He>ע</He>{' '}
                70, <He>פ</He> 80, <He>צ</He> 90
              </td>
            </tr>
            <tr>
              <th scope="row">Hundreds</th>
              <td>
                <He>ק</He> 100, <He>ר</He> 200, <He>ש</He> 300, <He>ת</He> 400
              </td>
            </tr>
            <tr>
              <th scope="row">Finals (mispar gadol)</th>
              <td>
                <He>ך</He> 500, <He>ם</He> 600, <He>ן</He> 700, <He>ף</He> 800, <He>ץ</He> 900
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2 id="methods" className={styles.anchor}>
        The methods in the calculator
      </h2>
      <p>
        <a href={SOURCES.gematria} rel="noopener" target="_blank">
          Gematria
        </a>{' '}
        has several methods, and Jewish tradition uses more than one. The calculator works them all out at once:
      </p>
      <ul>
        {methods.map((method) => (
          <li key={method.id}>
            <strong>{enMethodNames[method.id].name}:</strong> {enMethodNames[method.id].description}
          </li>
        ))}
      </ul>
      <p>
        Shalom, for example, is {shalom.standard} in standard gematria, {shalom.gadol} in mispar gadol, {shalom.katan}{' '}
        in mispar katan and {shalom.ordinal} in ordinal value.
      </p>

      <h2 id="how" className={styles.anchor}>
        How to calculate gematria by hand
      </h2>
      <p>
        Go through the word letter by letter, write the value next to each letter and add them up. אהבה (ahava, love) is
        1 + 5 + 2 + 5, which is {ahava}. A few things to watch:
      </p>
      <ul>
        <li>Vowel points, geresh and gershayim are not counted. שָׁלוֹם and שלום have the same value.</li>
        <li>Full spelling adds up: שולחן is 6 more than שלחן because of the Vav.</li>
        <li>Spaces make no difference, so a phrase is the sum of all its words.</li>
        <li>The calculator ignores digits and Latin letters and tells you which characters were not counted.</li>
      </ul>

      <h2 id="sources" className={styles.anchor}>
        Where gematria comes from
      </h2>
      <p>
        The word comes from Greek, and the use of letter values already appears in the literature of the Sages. The
        Mishnah, in{' '}
        <a href={SOURCES.avot} rel="noopener" target="_blank">
          Pirkei Avot 3:18
        </a>
        , calls calculations and gematria &quot;the condiments of wisdom&quot;, an addition to wisdom rather than its
        core. In{' '}
        <a href={SOURCES.jeremiah} rel="noopener" target="_blank">
          Jeremiah 25:26
        </a>{' '}
        Sheshach is Babylon (<He>{sheshach.atbashText}</He>) in{' '}
        <a href={SOURCES.atbash} rel="noopener" target="_blank">
          Atbash
        </a>
        . The values the calculator produces are arithmetic only; what is drawn from them is a matter of
        interpretation.
      </p>

      <h2 id="pairs" className={styles.anchor}>
        Well-known words with the same value
      </h2>
      <p>These pairs come from the short word list in the calculator, each valued in standard gematria:</p>
      <ul>
        {famousPairs.map((pair) => (
          <li key={pair.value}>
            <He>{pair.words.join(', ')}</He>: {pair.value}
          </li>
        ))}
      </ul>
    </EnToolLayout>
  )
}
