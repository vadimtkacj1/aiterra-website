export const NAME_TRANSLITERATION_PATH = '/tools/hebrew-name-to-english'
export const NAME_TRANSLITERATION_CHECKED = '2026-10-23'

export type NameKind = 'first' | 'last'

export type NameEntry = { hebrew: string; spellings: string[]; kind: NameKind }

const maleFirst = `
אבי|Avi
אביב|Aviv
אביעד|Aviad
אבינועם|Avinoam
אברהם|Avraham,Abraham
אברמי|Avrami
אדם|Adam
אהרון|Aharon,Aaron
אהוד|Ehud
אוהד|Ohad
אופיר|Ofir,Ophir
אור|Or
אורי|Uri
אוריאל|Uriel
אורן|Oren
איתי|Itay,Itai
איתן|Eitan,Ethan
איתמר|Itamar
אלעד|Elad
אלי|Eli
אליהו|Eliyahu,Elijah
אליעזר|Eliezer
אלירן|Eliran
אלישע|Elisha
אלון|Alon
אלעזר|Elazar
אלכס|Alex
אמיר|Amir
אמנון|Amnon
אסף|Asaf,Assaf
אסי|Asi
אפרים|Efraim,Ephraim
ארז|Erez
אריאל|Ariel
אריה|Arye,Aryeh,Arie
ארנון|Arnon
אשר|Asher
בועז|Boaz
בנימין|Binyamin,Benjamin
בן|Ben
בר|Bar
ברק|Barak,Barack
גבריאל|Gavriel,Gabriel
גד|Gad
גיא|Guy
גידי|Gidi
גדעון|Gideon
גל|Gal
גלעד|Gilad
גיל|Gil
דביר|Dvir
דוד|David
דור|Dor
דורון|Doron
דן|Dan
דני|Danny,Dani
דניאל|Daniel
דקל|Dekel
הדר|Hadar
הראל|Harel
זיו|Ziv
זאב|Zeev,Ze'ev
חגי|Hagai
חיים|Chaim,Haim,Hayim
חן|Chen,Hen
טל|Tal
יאיר|Yair
יובל|Yuval
יואב|Yoav
יואל|Yoel,Joel
יוסי|Yossi,Yosi
יוסף|Yosef,Joseph
יונתן|Yonatan,Jonathan
יהונתן|Yehonatan,Jonathan
יהודה|Yehuda,Yehudah,Judah
יהושע|Yehoshua,Joshua
יוני|Yoni
יותם|Yotam
יניב|Yaniv
יעקב|Yaakov,Jacob
ירון|Yaron
ישראל|Israel,Yisrael
יצחק|Yitzhak,Isaac,Yitzchak
יגאל|Yigal
ירדן|Yarden,Jordan
ליאור|Lior
ליאם|Liam
מאור|Maor
מאיר|Meir,Meyer
מור|Mor
מוטי|Moti
מתן|Matan
מתי|Matti,Mati
מיכאל|Michael
מיכה|Micha,Micah
מנחם|Menachem
משה|Moshe,Moses
מרדכי|Mordechai
נדב|Nadav
נועם|Noam
נוי|Noy
נחום|Nachum
נתן|Natan,Nathan
נתנאל|Netanel,Nathaniel
ניר|Nir
ניצן|Nitzan
נמרוד|Nimrod
סער|Saar,Sa'ar
עדי|Adi
עדן|Eden
עומר|Omer
עוז|Oz
עמית|Amit
עמוס|Amos
עמיחי|Amichai
עמרי|Omri
עידו|Ido
עידן|Idan
עקיבא|Akiva
פיני|Pini
פלג|Peleg
צבי|Tzvi,Zvi
צחי|Tzachi
צור|Tzur,Zur
קובי|Kobi
רועי|Roi,Roee
רון|Ron
רונן|Ronen
רז|Raz
רפאל|Raphael,Rafael
רן|Ran
שגיא|Sagi
שחר|Shachar,Shahar
שי|Shay,Shai
שלום|Shalom
שלמה|Shlomo,Solomon
שמעון|Shimon,Simon
שמואל|Shmuel,Samuel
שרון|Sharon
תומר|Tomer
תמיר|Tamir
תום|Tom
`

const femaleFirst = `
אביגיל|Avigail,Abigail
אביה|Avia
אדווה|Adva
אורית|Orit
אורנה|Orna
אילנה|Ilana
אילת|Eilat
אירית|Irit
אלה|Ella
אלינור|Elinor
אלונה|Alona
אסתר|Esther
אפרת|Efrat,Ephrat
ארבל|Arbel
בת שבע|Batsheva,Bathsheba
ברכה|Bracha,Beracha
בתיה|Batya
גאיה|Gaia
גאולה|Geula
גליה|Galia
גלית|Galit
גילה|Gila
גלי|Gali
גפן|Gefen
דבורה|Dvora,Devorah,Deborah
דורית|Dorit
דינה|Dina
דנה|Dana
דניאלה|Daniela,Daniella
דליה|Dalia
דפנה|Dafna,Daphna
דקלה|Dikla
הגר|Hagar
הדס|Hadas
הילה|Hila
הילי|Hili
ורד|Vered
זהבה|Zehava
חנה|Hanna,Chana,Hannah
חגית|Hagit
חוה|Chava,Eva,Hava
חיה|Chaya,Haya
טובה|Tova
טלי|Tali
טליה|Talia
יעל|Yael
יפה|Yafa,Yaffa
יפעת|Yifat
יהודית|Yehudit,Judith
יוכבד|Yocheved
יסמין|Yasmin,Jasmine
ים|Yam
כרמל|Carmel
כרמית|Carmit
כנרת|Kinneret
לאה|Leah
לילך|Lilach
לימור|Limor
ליאת|Liat
ליאורה|Liora
לינוי|Linoy
לירז|Liraz
לירון|Liron
לילי|Lily
מאיה|Maya
מיכל|Michal
מיטל|Meital
מירב|Merav
מירי|Miri
מרים|Miriam
מורן|Moran
מוריה|Moriah
מיה|Mia
מלכה|Malka
מעיין|Maayan
מרגלית|Margalit
נועה|Noa,Noah
נעמי|Naomi
נעמה|Naama
נורית|Nurit
נילי|Nili
נטע|Neta
נטלי|Natalie
נטליה|Natalia
ניצה|Nitza
נירית|Nirit
נגה|Noga
סיגל|Sigal
סיוון|Sivan
סמדר|Smadar
ספיר|Sapir
סתו|Stav
עופרה|Ofra
עינת|Einat
ענת|Anat
ענבל|Inbal
ענבר|Inbar
עטרה|Atara
פנינה|Pnina
צליל|Tzlil
צופיה|Tzofia
קרן|Keren
קורל|Coral
רבקה|Rivka,Rebecca
רחל|Rachel
רחלי|Racheli
רות|Ruth
רונית|Ronit
רוני|Roni
רותם|Rotem
רינת|Rinat
רויטל|Revital
רעות|Reut
שרה|Sarah,Sara
שירה|Shira
שירן|Shiran
שירלי|Shirley
שני|Shani
שיר|Shir
שלי|Shelly,Shelli
שלומית|Shlomit
שושנה|Shoshana
שקד|Shaked
שרית|Sarit
שולמית|Shulamit
תמר|Tamar
תהילה|Tehila
תכלת|Tchelet
תמי|Tami
תהל|Tahel
תקווה|Tikva
אמילי|Emily
אנה|Anna
אלכסנדרה|Alexandra
אוסנת|Osnat
אורטל|Ortal
אורלי|Orly
אילונה|Ilona
`

const surnames = `
כהן|Cohen,Kohen
לוי|Levi,Levy
מזרחי|Mizrahi,Mizrachi
פרץ|Peretz,Perez
ביטון|Biton,Bitton
דהן|Dahan
אברהם|Avraham,Abraham
פרידמן|Friedman
מלכה|Malka
אזולאי|Azoulay
דיין|Dayan
חדד|Haddad,Hadad
גבאי|Gabay,Gabai
יוסף|Yosef,Joseph
מימון|Maimon
עמר|Amar
אוחיון|Ohayon
אשכנזי|Ashkenazi
שפירא|Shapira,Shapiro
כץ|Katz
גולן|Golan
רוזן|Rosen
שמעוני|Shimoni
נחום|Nachum,Nahum
בן דוד|Ben David
בן חיים|Ben Haim,Ben Chaim
בן שמעון|Ben Shimon
גולדשטיין|Goldstein
גרין|Green
וינברג|Weinberg
שטרן|Stern
קליין|Klein
ברגר|Berger
הורוביץ|Horowitz
שוורץ|Schwartz
רוזנברג|Rosenberg
גולדברג|Goldberg
סבן|Saban
סעד|Saad
חזן|Hazan,Chazan
אדרי|Edri,Adri
בוזגלו|Buzaglo
ממן|Maman
אלמוג|Almog
ברוך|Baruch
גרוס|Gross
זוהר|Zohar
טולדנו|Toledano
לביא|Lavi
לוין|Levin
נגר|Nagar
סויסה|Suissa
סגל|Segal
פינטו|Pinto
פרנקל|Frenkel
צדוק|Tzadok,Zadok
קדוש|Kadosh
קפלן|Kaplan
רביבו|Revivo
שרעבי|Sharabi
שטרית|Shitrit
שמש|Shemesh
תורגמן|Turgeman
בלום|Blum
גינזבורג|Ginzburg
דנינו|Danino
הלוי|Halevi,Halevy
ויצמן|Weizmann
חביב|Habib
כרמי|Carmi
לנדאו|Landau
מזוז|Mazuz
עזרא|Ezra
פלד|Peled
קורן|Koren
רוטמן|Rotman
אוחנה|Ohana
אסרף|Asaraf
אבוטבול|Abutbul
אלבז|Elbaz
בן ארי|Ben Ari
ברדה|Barda
אביטל|Avital
דנון|Danon
מרציאנו|Marciano
סבג|Sabag
וייס|Weiss
פישר|Fischer,Fisher
מילר|Miller
אברמוב|Abramov
איבגי|Ibgi
ביטן|Bitan
גבריאל|Gabriel
דאהר|Daher
זכאי|Zakai
חיון|Hayoun
טייב|Tayeb
ישראלי|Israeli
כרמלי|Carmeli
מוסקוביץ|Moskovitz
נבון|Navon
סלומון|Solomon
עטיה|Attias
פרידמן|Friedman
צרפתי|Tzarfati
קמינר|Kaminer
רגב|Regev
שלם|Shalem
`

const parse = (block: string, kind: NameKind): NameEntry[] =>
  block
    .trim()
    .split('\n')
    .map((line) => {
      const [hebrew, spellings] = line.split('|')
      return { hebrew, spellings: spellings.split(','), kind }
    })

export const maleNames = parse(maleFirst, 'first')
export const femaleNames = parse(femaleFirst, 'first')
export const surnameEntries = Array.from(
  new Map(parse(surnames, 'last').map((entry) => [entry.hebrew, entry])).values(),
)

export const firstNames = [...maleNames, ...femaleNames].sort((a, b) => a.hebrew.localeCompare(b.hebrew, 'he'))
export const lastNames = [...surnameEntries].sort((a, b) => a.hebrew.localeCompare(b.hebrew, 'he'))

const normalize = (word: string) =>
  word
    .replace(/[֑-ׇ]/g, '')
    .replace(/[׳'’"״]/g, '')
    .trim()

const dictionary = new Map<string, NameEntry>()
for (const entry of [...firstNames, ...lastNames]) {
  if (!dictionary.has(normalize(entry.hebrew))) dictionary.set(normalize(entry.hebrew), entry)
}

export const dictionarySize = dictionary.size

export const lookup = (word: string) => dictionary.get(normalize(word))

type Style = {
  fill: string
  vav: string
  chet: string
  kaf: string
  tsadi: string
  finalHe: string
  shin: string
  bet: string
}

const styles: Style[] = [
  { fill: 'a', vav: 'o', chet: 'h', kaf: 'k', tsadi: 'tz', finalHe: 'a', shin: 'sh', bet: 'b' },
  { fill: 'e', vav: 'u', chet: 'ch', kaf: 'ch', tsadi: 'ts', finalHe: 'ah', shin: 'sh', bet: 'v' },
  { fill: 'a', vav: 'v', chet: 'kh', kaf: 'kh', tsadi: 'z', finalHe: 'e', shin: 'sh', bet: 'v' },
]

type Token = { kind: 'consonant' | 'vowel'; text: string }

const apostropheMarks = new Set(['׳', "'", '’'])

function tokenize(word: string, style: Style): Token[] {
  const letters = Array.from(normalizeKeepMarks(word))
  const tokens: Token[] = []
  const consonant = (text: string) => tokens.push({ kind: 'consonant', text })
  const vowel = (text: string) => tokens.push({ kind: 'vowel', text })
  const previousIsConsonant = () => tokens.length > 0 && tokens[tokens.length - 1].kind === 'consonant'

  for (let index = 0; index < letters.length; index += 1) {
    const letter = letters[index]
    const marked = apostropheMarks.has(letters[index + 1])
    const first = index === 0
    const last = index === letters.length - 1 || (marked && index === letters.length - 2)
    if (apostropheMarks.has(letter)) continue
    if (letter === 'ג') consonant(marked ? 'j' : 'g')
    else if (letter === 'ז') consonant(marked ? 'zh' : 'z')
    else if (letter === 'צ' || letter === 'ץ') consonant(marked ? 'ch' : style.tsadi)
    else if (letter === 'ת') consonant(marked ? 'th' : 't')
    else if (letter === 'ב') consonant(first ? 'b' : style.bet)
    else if (letter === 'ד') consonant('d')
    else if (letter === 'ה') {
      if (last && !first) vowel(style.finalHe)
      else consonant('h')
    } else if (letter === 'ו') {
      const afterGuttural = letters[index - 1] === 'א' || letters[index - 1] === 'ע'
      if (afterGuttural) vowel(style.vav === 'v' ? 'o' : style.vav)
      else if (first || !previousIsConsonant()) consonant('v')
      else if (style.vav === 'v') consonant('v')
      else vowel(style.vav)
    } else if (letter === 'ח') consonant(style.chet)
    else if (letter === 'ט') consonant('t')
    else if (letter === 'י') {
      if (first || !previousIsConsonant()) consonant('y')
      else vowel('i')
    } else if (letter === 'כ' || letter === 'ך') consonant(first && letter === 'כ' ? 'k' : style.kaf)
    else if (letter === 'ל') consonant('l')
    else if (letter === 'מ' || letter === 'ם') consonant('m')
    else if (letter === 'נ' || letter === 'ן') consonant('n')
    else if (letter === 'ס') consonant('s')
    else if (letter === 'פ') consonant('p')
    else if (letter === 'ף') consonant('f')
    else if (letter === 'ק') consonant('k')
    else if (letter === 'ר') consonant('r')
    else if (letter === 'ש') consonant(style.shin)
    else if (letter === 'א' || letter === 'ע') {
      const nextIsVowelLetter = letters[index + 1] === 'ו' || letters[index + 1] === 'י'
      if (!last && !nextIsVowelLetter) vowel(style.fill)
    }
  }
  return tokens
}

function normalizeKeepMarks(word: string) {
  return word.replace(/[֑-ׇ]/g, '').replace(/["״]/g, '')
}

function render(tokens: Token[], style: Style) {
  let output = ''
  let previousConsonantHasVowelBefore = false
  tokens.forEach((token, index) => {
    const previous = tokens[index - 1]
    if (token.kind === 'vowel') {
      output += token.text
      return
    }
    let vowelBefore = previous?.kind === 'vowel'
    if (previous?.kind === 'consonant' && !previousConsonantHasVowelBefore) {
      output += style.fill
      vowelBefore = true
    }
    output += token.text
    previousConsonantHasVowelBefore = vowelBefore
  })
  return output
}

const capitalize = (value: string) => (value ? value[0].toUpperCase() + value.slice(1) : value)

export const isHebrewWord = (word: string) => /[א-ת]/.test(word)

export function ruleVariants(word: string) {
  const seen = new Set<string>()
  for (const style of styles) {
    const spelled = capitalize(render(tokenize(word, style), style))
    if (spelled) seen.add(spelled)
  }
  return Array.from(seen)
}

export type WordResult = {
  word: string
  source: 'list' | 'rule'
  variants: string[]
  kind: NameKind | null
}

export function transliterateName(input: string): WordResult[] {
  const words = input.split(/\s+/).filter((word) => isHebrewWord(word))
  const results: WordResult[] = []
  for (let index = 0; index < words.length; index += 1) {
    const pair = index + 1 < words.length ? `${words[index]} ${words[index + 1]}` : ''
    const pairEntry = pair ? lookup(pair) : undefined
    if (pairEntry) {
      results.push({ word: pair, source: 'list', variants: pairEntry.spellings, kind: pairEntry.kind })
      index += 1
      continue
    }
    const entry = lookup(words[index])
    if (entry) results.push({ word: words[index], source: 'list', variants: entry.spellings, kind: entry.kind })
    else results.push({ word: words[index], source: 'rule', variants: ruleVariants(words[index]), kind: null })
  }
  return results
}

export const passportStyle = (value: string) => value.replace(/[^A-Za-z ]/g, '').toUpperCase()

export const nameSources = {
  kolzchut: {
    label: 'כל זכות: שינוי השם במרשם האוכלוסין',
    href: 'https://www.kolzchut.org.il/he/%D7%A9%D7%99%D7%A0%D7%95%D7%99_%D7%94%D7%A9%D7%9D_%D7%91%D7%9E%D7%A8%D7%A9%D7%9D_%D7%94%D7%90%D7%95%D7%9B%D7%9C%D7%95%D7%A1%D7%99%D7%9F',
  },
  gov: {
    label: 'gov.il: שינוי שם משפחה במרשם האוכלוסין',
    href: 'https://www.gov.il/he/service/changing_last_name',
  },
  calcalist: {
    label: 'כלכליסט: דיווח על קביעת האיות הלטיני בידי הפקיד (כתבה ישנה)',
    href: 'https://www.calcalist.co.il/articles/0,7340,L-3706482,00.html',
  },
}
