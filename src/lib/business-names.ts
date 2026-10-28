export type NameStyle = 'he' | 'en' | 'mix'

export type FieldId =
  | 'restaurant'
  | 'beauty'
  | 'realestate'
  | 'tech'
  | 'law'
  | 'accounting'
  | 'ecommerce'
  | 'fitness'
  | 'photo'
  | 'consulting'
  | 'renovation'
  | 'kids'
  | 'bakery'
  | 'general'

type WordBank = { he: string[]; en: string[]; hePrefix: string[]; enSuffix: string[] }

export type BusinessName = { name: string; slug: string; latin: boolean }

export const NAME_COUNT = 36
export const MAX_KEYWORDS = 3
export const FAVORITES_KEY = 'aiterra-business-name-favorites'
export const MAX_FAVORITES = 40

export const styleOptions: { value: NameStyle; label: string }[] = [
  { value: 'he', label: 'עברית' },
  { value: 'en', label: 'English' },
  { value: 'mix', label: 'משולב' },
]

const banks: Record<FieldId, { label: string } & WordBank> = {
  restaurant: {
    label: 'מסעדה ובית קפה',
    he: ['טעם', 'שולחן', 'מטבח', 'תבלין', 'גחלים', 'פינה', 'סיר', 'מאפה', 'ביס', 'שוק'],
    en: ['Table', 'Kitchen', 'Spoon', 'Grill', 'Bistro', 'Spice', 'Fork', 'Harvest', 'Plate', 'Ember'],
    hePrefix: ['מטבח', 'בית', 'פינת', 'שולחן'],
    enSuffix: ['Kitchen', 'Bistro', 'Eatery', 'Bar'],
  },
  beauty: {
    label: 'קוסמטיקה וטיפוח',
    he: ['זוהר', 'יופי', 'עור', 'פנינה', 'ורד', 'קטיפה', 'נוגה', 'מגע', 'רוך', 'הילה'],
    en: ['Glow', 'Bloom', 'Silk', 'Velvet', 'Pearl', 'Rose', 'Pure', 'Luxe', 'Grace', 'Aura'],
    hePrefix: ['סטודיו', 'קליניקת', 'בית', 'עולם'],
    enSuffix: ['Studio', 'Beauty', 'Skin', 'Lab'],
  },
  realestate: {
    label: 'נדל״ן',
    he: ['בית', 'נכס', 'מפתח', 'קורת גג', 'יסוד', 'שער', 'מגדל', 'שכונה', 'קרקע', 'כתובת'],
    en: ['Key', 'Home', 'Nest', 'Gate', 'Estate', 'Haven', 'Urban', 'Prime', 'Keystone', 'Address'],
    hePrefix: ['נכסי', 'בית', 'שער', 'מפתח'],
    enSuffix: ['Realty', 'Estates', 'Homes', 'Properties'],
  },
  tech: {
    label: 'הייטק ותוכנה',
    he: ['ענן', 'קוד', 'חיבור', 'אות', 'רשת', 'ניצוץ', 'זרם', 'מסלול', 'ביט', 'תדר'],
    en: ['Byte', 'Logic', 'Pixel', 'Signal', 'Cloud', 'Spark', 'Node', 'Vector', 'Flux', 'Stack'],
    hePrefix: ['מעבדת', 'פתרונות', 'מערכות', 'סטודיו'],
    enSuffix: ['Labs', 'Tech', 'Soft', 'AI', 'Systems'],
  },
  law: {
    label: 'משרד עורכי דין',
    he: ['צדק', 'משפט', 'יושר', 'מגן', 'חוקה', 'סעיף', 'עדות', 'אמון', 'זכות', 'בית דין'],
    en: ['Lex', 'Justice', 'Shield', 'Counsel', 'Verdict', 'Charter', 'Trust', 'Pillar', 'Accord', 'Advocate'],
    hePrefix: ['משרד', 'קבוצת', 'בית', 'שותפות'],
    enSuffix: ['Law', 'Legal', 'Partners', 'Advocates'],
  },
  accounting: {
    label: 'רואה חשבון והנהלת חשבונות',
    he: ['מאזן', 'חשבון', 'סכום', 'יתרה', 'דוח', 'מספר', 'שקל', 'רווח', 'סדר', 'דיוק'],
    en: ['Balance', 'Ledger', 'Ratio', 'Sum', 'Audit', 'Figure', 'Margin', 'Account', 'Count', 'Fiscal'],
    hePrefix: ['משרד', 'פתרונות', 'בית', 'קבוצת'],
    enSuffix: ['CPA', 'Accounting', 'Finance', 'Partners'],
  },
  ecommerce: {
    label: 'חנות אונליין',
    he: ['סל', 'מדף', 'אוצר', 'מציאה', 'חבילה', 'דוכן', 'שוק', 'מתנה', 'בוטיק', 'קופסה'],
    en: ['Cart', 'Shelf', 'Box', 'Market', 'Bazaar', 'Basket', 'Find', 'Deal', 'Parcel', 'Store'],
    hePrefix: ['חנות', 'בוטיק', 'שוק', 'עולם'],
    enSuffix: ['Shop', 'Store', 'Market', 'Co'],
  },
  fitness: {
    label: 'כושר וספורט',
    he: ['כוח', 'תנועה', 'דופק', 'אנרגיה', 'זינוק', 'שיא', 'נשימה', 'גוף', 'מרץ', 'איזון'],
    en: ['Pulse', 'Core', 'Move', 'Power', 'Flex', 'Peak', 'Iron', 'Motion', 'Stride', 'Boost'],
    hePrefix: ['סטודיו', 'מועדון', 'בית', 'מרכז'],
    enSuffix: ['Fit', 'Gym', 'Studio', 'Club'],
  },
  photo: {
    label: 'צילום ווידאו',
    he: ['עדשה', 'פריים', 'אור', 'רגע', 'צל', 'מבט', 'זיכרון', 'תמונה', 'צבע', 'פוקוס'],
    en: ['Lens', 'Frame', 'Light', 'Moment', 'Focus', 'Shutter', 'Pixel', 'Glimpse', 'Story', 'Shot'],
    hePrefix: ['סטודיו', 'צילומי', 'עדשת', 'רגעי'],
    enSuffix: ['Studio', 'Photo', 'Films', 'Pictures'],
  },
  consulting: {
    label: 'ייעוץ ואימון',
    he: ['מצפן', 'כיוון', 'צמיחה', 'דרך', 'תובנה', 'מפה', 'גשר', 'צעד', 'מסלול', 'יעד'],
    en: ['Compass', 'Insight', 'Bridge', 'Path', 'Summit', 'Growth', 'Clarity', 'Anchor', 'North', 'Vista'],
    hePrefix: ['ייעוץ', 'קבוצת', 'מרכז', 'בית'],
    enSuffix: ['Consulting', 'Advisors', 'Group', 'Partners'],
  },
  renovation: {
    label: 'שיפוצים ובנייה',
    he: ['פטיש', 'יסוד', 'קיר', 'בונה', 'מלט', 'אבן', 'מפלס', 'בנאי', 'גמר', 'קורה'],
    en: ['Build', 'Hammer', 'Brick', 'Craft', 'Stone', 'Level', 'Solid', 'Frame', 'Beam', 'Fix'],
    hePrefix: ['שיפוצי', 'בית', 'בוני', 'עבודות'],
    enSuffix: ['Build', 'Works', 'Renovations', 'Pro'],
  },
  kids: {
    label: 'ילדים ומשפחה',
    he: ['גוזל', 'קשת', 'בועה', 'פרפר', 'כוכב', 'דובי', 'מגדל', 'חלום', 'שמש', 'צחוק'],
    en: ['Bubble', 'Sprout', 'Star', 'Teddy', 'Rainbow', 'Giggle', 'Kite', 'Dream', 'Sunny', 'Little'],
    hePrefix: ['עולם', 'בית', 'גן', 'ממלכת'],
    enSuffix: ['Kids', 'Play', 'Land', 'World'],
  },
  bakery: {
    label: 'עוגות וקונדיטוריה',
    he: ['קצפת', 'שמרים', 'קינמון', 'וניל', 'סוכר', 'תנור', 'מאפה', 'דבש', 'שוקולד', 'פירור'],
    en: ['Sugar', 'Crumb', 'Butter', 'Honey', 'Cocoa', 'Vanilla', 'Oven', 'Sweet', 'Frosting', 'Dough'],
    hePrefix: ['קונדיטוריית', 'מאפיית', 'בית', 'סדנת'],
    enSuffix: ['Bakery', 'Bakes', 'Sweets', 'Cakes'],
  },
  general: {
    label: 'אחר / כללי',
    he: ['אופק', 'יסוד', 'ניצוץ', 'גשר', 'שורש', 'מעיין', 'צמח', 'אמון', 'נתיב', 'לב'],
    en: ['Nova', 'Apex', 'Bright', 'Bold', 'True', 'Prime', 'Vivid', 'Element', 'Origin', 'Clear'],
    hePrefix: ['קבוצת', 'בית', 'מרכז', 'סטודיו'],
    enSuffix: ['Co', 'Group', 'Studio', 'Works'],
  },
}

export const fieldOptions = (Object.keys(banks) as FieldId[]).map((value) => ({ value, label: banks[value].label }))

const heAdjectives = ['הקטן', 'הירוק', 'הזהב', 'הכחול', 'הטוב', 'החדש', 'של העיר', 'הים תיכוני']
const enAdjectives = [
  'Blue', 'Bright', 'Bold', 'Golden', 'Little', 'Urban', 'Good', 'Happy', 'Smart', 'True', 'Fresh', 'Simple',
  'Clever', 'Modern', 'Noble', 'Silver', 'Wild', 'Lucky', 'Prime', 'Royal',
]
const enEndings = ['ly', 'io', 'ify', 'ora', 'ix', 'eo', 'hub', 'go']

const translitMap: Record<string, string> = {
  א: 'a', ב: 'b', ג: 'g', ד: 'd', ה: 'h', ו: 'o', ז: 'z', ח: 'ch', ט: 't', י: 'i', כ: 'k', ך: 'ch', ל: 'l',
  מ: 'm', ם: 'm', נ: 'n', ן: 'n', ס: 's', ע: 'a', פ: 'p', ף: 'f', צ: 'tz', ץ: 'tz', ק: 'k', ר: 'r', ש: 'sh',
  ת: 't',
}

const knownWords: Record<string, string> = {
  טעם: 'taam', שולחן: 'shulchan', מטבח: 'mitbach', תבלין: 'tavlin', גחלים: 'gechalim', פינה: 'pina',
  סיר: 'sir', מאפה: 'maafe', ביס: 'bis', שוק: 'shuk', בית: 'beit', פינת: 'pinat', זוהר: 'zohar',
  יופי: 'yofi', עור: 'or', פנינה: 'pnina', ורד: 'vered', קטיפה: 'ktifa', נוגה: 'noga', מגע: 'maga',
  רוך: 'roch', הילה: 'hila', סטודיו: 'studio', קליניקת: 'clinicat', עולם: 'olam', נכס: 'neches',
  מפתח: 'mafteach', קורת: 'korat', גג: 'gag', יסוד: 'yesod', שער: 'shaar', מגדל: 'migdal', שכונה: 'shchuna',
  קרקע: 'karka', כתובת: 'ktovet', נכסי: 'nichsei', ענן: 'anan', קוד: 'kod', חיבור: 'chibur', אות: 'ot',
  רשת: 'reshet', ניצוץ: 'nitzotz', זרם: 'zerem', מסלול: 'maslul', ביט: 'bit', תדר: 'teder',
  מעבדת: 'maabadat', פתרונות: 'pitronot', מערכות: 'maarachot', צדק: 'tzedek', משפט: 'mishpat',
  יושר: 'yosher', מגן: 'magen', חוקה: 'chuka', סעיף: 'seif', עדות: 'edut', אמון: 'emun', זכות: 'zchut',
  דין: 'din', משרד: 'misrad', קבוצת: 'kvutzat', שותפות: 'shutafut', מאזן: 'maazan', חשבון: 'cheshbon',
  סכום: 'skum', יתרה: 'yitra', דוח: 'doch', מספר: 'mispar', שקל: 'shekel', רווח: 'revach', סדר: 'seder',
  דיוק: 'diyuk', סל: 'sal', מדף: 'madaf', אוצר: 'otzar', מציאה: 'metzia', חבילה: 'chavila', דוכן: 'duchan',
  מתנה: 'matana', בוטיק: 'boutique', קופסה: 'kufsa', חנות: 'chanut', כוח: 'koach', תנועה: 'tnua',
  דופק: 'dofek', אנרגיה: 'energia', זינוק: 'zinuk', שיא: 'si', נשימה: 'neshima', גוף: 'guf', מרץ: 'meretz',
  איזון: 'izun', מועדון: 'moadon', מרכז: 'merkaz', עדשה: 'adasha', פריים: 'frame', אור: 'or', רגע: 'rega',
  צל: 'tzel', מבט: 'mabat', זיכרון: 'zikaron', תמונה: 'tmuna', צבע: 'tzeva', פוקוס: 'focus',
  צילומי: 'tzilumei', עדשת: 'adashat', רגעי: 'rigei', מצפן: 'matzpen', כיוון: 'kivun', צמיחה: 'tzmicha',
  דרך: 'derech', תובנה: 'tovana', מפה: 'mapa', גשר: 'gesher', צעד: 'tzaad', יעד: 'yaad', ייעוץ: 'yeutz',
  פטיש: 'patish', קיר: 'kir', בונה: 'bone', מלט: 'melet', אבן: 'even', מפלס: 'mifles', בנאי: 'banai',
  גמר: 'gmar', קורה: 'kora', שיפוצי: 'shiputzei', בוני: 'bonei', עבודות: 'avodot', גוזל: 'gozal',
  קשת: 'keshet', בועה: 'bua', פרפר: 'parpar', כוכב: 'kochav', דובי: 'dubi', חלום: 'chalom', שמש: 'shemesh',
  צחוק: 'tzchok', גן: 'gan', ממלכת: 'mamlechet', קצפת: 'katzefet', שמרים: 'shmarim', קינמון: 'kinamon',
  וניל: 'vanil', סוכר: 'sukar', תנור: 'tanur', דבש: 'dvash', שוקולד: 'shokolad', פירור: 'pirur',
  קונדיטוריית: 'konditoriat', מאפיית: 'maafiyat', סדנת: 'sadnat', אופק: 'ofek', שורש: 'shoresh',
  מעיין: 'maayan', צמח: 'tzemach', נתיב: 'nativ', לב: 'lev', הקטן: 'hakatan', הירוק: 'hayarok',
  הזהב: 'hazahav', הכחול: 'hakachol', הטוב: 'hatov', החדש: 'hechadash', של: 'shel', העיר: 'hair',
  הים: 'hayam', תיכוני: 'tichoni', ים: 'yam',
}

const isHebrew = (text: string) => /[֐-׿]/.test(text)

function transliterateWord(word: string): string {
  const bare = word.replace(/[״׳"']/g, '')
  if (knownWords[bare]) return knownWords[bare]
  if (bare.startsWith('ה') && knownWords[bare.slice(1)]) return `ha${knownWords[bare.slice(1)]}`
  if (bare.startsWith('ו') && knownWords[bare.slice(1)]) return `ve${knownWords[bare.slice(1)]}`
  return bare
    .split('')
    .map((char, index, chars) => {
      if (char === 'ב' && index > 0 && chars[index - 1] !== ' ') return 'v'
      if (char === 'ו' && (index === 0 || chars[index - 1] === ' ')) return 'v'
      if (char === 'ו' && chars[index + 1] === 'ו') return 'v'
      if (char === 'פ' && index > 0 && chars[index - 1] !== ' ') return 'f'
      if (char === 'ה' && (index === chars.length - 1 || chars[index + 1] === ' ')) return 'a'
      return translitMap[char] ?? char
    })
    .join('')
    .replace(/vv/g, 'v')
    .replace(/^i/, 'y')
}

export function transliterate(text: string): string {
  return text
    .split(' ')
    .map((word) => transliterateWord(word))
    .join(' ')
}

export function toSlug(name: string): string {
  const latin = isHebrew(name) ? transliterate(name) : name
  return latin
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '')
    .slice(0, 30)
}

export function parseKeywords(raw: string): string[] {
  return [
    ...new Set(
      raw
        .split(/[,،\n]+/)
        .map((word) => word.trim().replace(/\s+/g, ' '))
        .filter((word) => word.length > 1 && word.length <= 24),
    ),
  ].slice(0, MAX_KEYWORDS)
}

function seededRandom(seed: number) {
  let state = seed >>> 0
  return () => {
    state = (state + 0x6d2b79f5) >>> 0
    let t = state
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const capitalize = (word: string) => (word ? word[0].toUpperCase() + word.slice(1) : word)

function blend(first: string, second: string): string {
  const head = first.slice(0, Math.max(2, Math.ceil(first.length * 0.6)))
  const tail = second.slice(Math.floor(second.length * 0.4))
  return capitalize(head.toLowerCase() + tail.toLowerCase())
}

function alliterate(word: string, pick: <T>(list: T[]) => T): string | null {
  const letter = word[0]?.toLowerCase()
  const matches = enAdjectives.filter((adj) => adj[0].toLowerCase() === letter && adj !== word)
  return matches.length ? `${pick(matches)} ${word}` : null
}

function hebrewCandidates(bank: WordBank, keywords: string[], pick: <T>(list: T[]) => T): string[] {
  const heKeywords = keywords.filter(isHebrew)
  const roots = heKeywords.length ? heKeywords : bank.he
  const list: string[] = []
  for (const root of roots) {
    for (const prefix of bank.hePrefix) list.push(`${prefix} ${root}`)
    list.push(`${root} ${pick(heAdjectives)}`, `ה${root.replace(/^ה/, '')}`, `${root} ו${pick(bank.he)}`)
  }
  for (const word of bank.he) {
    list.push(`${word} ${pick(heAdjectives)}`, `${pick(bank.hePrefix)} ${word}`)
    if (heKeywords.length) list.push(`${word} ${pick(heKeywords)}`)
  }
  return list
}

function englishCandidates(bank: WordBank, keywords: string[], pick: <T>(list: T[]) => T): string[] {
  const enKeywords = keywords.map((word) => capitalize(isHebrew(word) ? transliterate(word) : word))
  const roots = enKeywords.length ? enKeywords : bank.en
  const list: string[] = []
  for (const root of roots) {
    for (const suffix of bank.enSuffix) list.push(`${root} ${suffix}`)
    list.push(`${pick(enAdjectives)} ${root}`, `${root}${pick(enEndings)}`, blend(root, pick(bank.en)))
    const alliterated = alliterate(root, pick)
    if (alliterated) list.push(alliterated)
  }
  for (const word of bank.en) {
    list.push(`${pick(enAdjectives)} ${word}`, `${word} ${pick(bank.enSuffix)}`, `${word}${pick(enEndings)}`)
    list.push(blend(word, pick(bank.en)), `${word} & ${pick(bank.en)}`)
    const alliterated = alliterate(word, pick)
    if (alliterated) list.push(alliterated)
  }
  return list
}

function mixedCandidates(bank: WordBank, keywords: string[], pick: <T>(list: T[]) => T): string[] {
  const heRoots = keywords.filter(isHebrew)
  const enRoots = keywords.filter((word) => !isHebrew(word)).map(capitalize)
  const list: string[] = []
  for (const word of [...heRoots, ...bank.he]) {
    list.push(`${word} ${pick(bank.enSuffix)}`, `${capitalize(transliterate(word))} ${pick(bank.enSuffix)}`)
  }
  for (const word of [...enRoots, ...bank.en]) list.push(`${pick(bank.hePrefix)} ${word}`)
  return list
}

export function generateNames(field: FieldId, keywords: string[], style: NameStyle, seed: number): BusinessName[] {
  const random = seededRandom(seed)
  const pick = <T,>(list: T[]): T => list[Math.floor(random() * list.length)]
  const bank = banks[field]
  const raw =
    style === 'he'
      ? hebrewCandidates(bank, keywords, pick)
      : style === 'en'
        ? englishCandidates(bank, keywords, pick)
        : [
            ...mixedCandidates(bank, keywords, pick),
            ...hebrewCandidates(bank, keywords, pick).slice(0, 20),
            ...englishCandidates(bank, keywords, pick).slice(0, 30),
          ]

  const seen = new Set<string>()
  const unique: BusinessName[] = []
  for (const name of raw) {
    const clean = name.replace(/\s+/g, ' ').trim()
    const slug = toSlug(clean)
    if (!clean || slug.length < 3 || seen.has(clean)) continue
    seen.add(clean)
    unique.push({ name: clean, slug, latin: !isHebrew(clean) })
  }

  for (let index = unique.length - 1; index > 0; index -= 1) {
    const swap = Math.floor(random() * (index + 1))
    ;[unique[index], unique[swap]] = [unique[swap], unique[index]]
  }
  return unique.slice(0, NAME_COUNT)
}

export function parseFavorites(raw: string | null): string[] {
  if (!raw) return []
  try {
    const parsed: unknown = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed.filter((item): item is string => typeof item === 'string') : []
  } catch {
    return []
  }
}

export function toggleFavorite(favorites: string[], name: string): string[] {
  if (favorites.includes(name)) return favorites.filter((item) => item !== name)
  if (favorites.length >= MAX_FAVORITES) return favorites
  return [...favorites, name]
}
