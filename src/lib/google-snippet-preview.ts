export type Device = 'desktop' | 'mobile'
export type SnippetField = 'title' | 'description'
export type Band = 'fits' | 'close' | 'cut'
export type Measure = (text: string, font: string) => number

export type SnippetInput = {
  title: string
  description: string
  url: string
  siteName: string
  keyword: string
}

export type TextSpec = { size: number; lineHeight: number; budget: number }

export type DeviceSpec = {
  label: string
  width: number
  title: TextSpec
  description: TextSpec
}

export type FieldMeasure = {
  width: number
  budget: number
  band: Band
  display: string
  visible: string
  cut: boolean
}

export type Finding = { id: string; level: 'warn' | 'tip'; text: string }

export type TextStats = {
  characters: number
  charactersNoSpaces: number
  words: number
  sentences: number
  paragraphs: number
  readingMinutes: number
}

export const PREVIEW_FONT_FAMILY = 'Arial, sans-serif'
export const CLOSE_RATIO = 0.9
export const KEYWORD_START_WORDS = 3
export const DESCRIPTION_REPEAT_LIMIT = 3
export const CAPS_WORD_MIN_LETTERS = 5
export const READING_WORDS_PER_MINUTE = 200
export const ELLIPSIS = ' ...'

export const devices: Record<Device, DeviceSpec> = {
  desktop: {
    label: 'מחשב',
    width: 600,
    title: { size: 20, lineHeight: 26, budget: 600 },
    description: { size: 14, lineHeight: 22, budget: 920 },
  },
  mobile: {
    label: 'טלפון',
    width: 360,
    title: { size: 18, lineHeight: 24, budget: 600 },
    description: { size: 14, lineHeight: 22, budget: 680 },
  },
}

export const emptySnippetInput: SnippetInput = {
  title: '',
  description: '',
  url: '',
  siteName: '',
  keyword: '',
}

export const fontFor = (size: number) => `${size}px ${PREVIEW_FONT_FAMILY}`

export const collapseSpaces = (text: string) => text.replace(/\s+/g, ' ').trim()

const graphemes =
  typeof Intl !== 'undefined' && 'Segmenter' in Intl ? new Intl.Segmenter('he', { granularity: 'grapheme' }) : null

const splitGraphemes = (text: string) =>
  graphemes ? Array.from(graphemes.segment(text), (part) => part.segment) : Array.from(text)

export const countCharacters = (text: string) => splitGraphemes(text).length

const hasWordCharacter = (text: string) => /[\p{L}\p{N}]/u.test(text)

export const countWords = (text: string) => text.split(/\s+/).filter(hasWordCharacter).length

export function textStats(text: string): TextStats {
  const words = countWords(text)
  return {
    characters: countCharacters(text),
    charactersNoSpaces: countCharacters(text.replace(/\s+/g, '')),
    words,
    sentences: text.split(/[.!?…]+["'״׳”’)\]]*(?=\s|$)|\n+/u).filter(hasWordCharacter).length,
    paragraphs: text.split(/\n/).filter(hasWordCharacter).length,
    readingMinutes: words / READING_WORDS_PER_MINUTE,
  }
}

const trimTrailing = (text: string) => text.replace(/[\s\-–—|:;,·•/\\]+$/u, '')

export function truncateToWidth(text: string, font: string, budget: number, measure: Measure) {
  const clean = collapseSpaces(text)
  if (measure(clean, font) <= budget) return { visible: clean, display: clean, cut: false }
  const fits = (candidate: string) => measure(trimTrailing(candidate) + ELLIPSIS, font) <= budget
  const words = clean.split(' ')
  let kept = ''
  for (const word of words) {
    const candidate = kept ? `${kept} ${word}` : word
    if (!fits(candidate)) break
    kept = candidate
  }
  if (!kept) {
    for (const part of splitGraphemes(words[0])) {
      if (!fits(kept + part)) break
      kept += part
    }
  }
  const visible = trimTrailing(kept)
  return { visible, display: visible + ELLIPSIS, cut: true }
}

export function bandFor(width: number, budget: number): Band {
  if (width > budget) return 'cut'
  if (width >= budget * CLOSE_RATIO) return 'close'
  return 'fits'
}

export function measureField(
  text: string,
  field: SnippetField,
  device: Device,
  measure: Measure,
): FieldMeasure | null {
  const clean = collapseSpaces(text)
  if (!clean) return null
  const spec = devices[device][field]
  const font = fontFor(spec.size)
  const width = Math.round(measure(clean, font))
  const truncated = truncateToWidth(clean, font, spec.budget, measure)
  return { width, budget: spec.budget, band: bandFor(width, spec.budget), ...truncated }
}

const normalizeQuotes = (text: string) => text.replace(/[׳’`]/g, "'").replace(/[״”“]/g, '"')

export const tokenize = (text: string) =>
  (normalizeQuotes(text.normalize('NFC').replace(/\p{M}/gu, '').toLowerCase()).match(
    /[\p{L}\p{N}]+(?:['"][\p{L}\p{N}]+)*/gu,
  ) ?? []) as string[]

const HEBREW_PREFIX = /^[והבכלמש]{1,3}$/
const isHebrew = (token: string) => /\p{Script=Hebrew}/u.test(token)

const tokenMatches = (token: string, target: string) =>
  token === target ||
  (isHebrew(target) && token.endsWith(target) && HEBREW_PREFIX.test(token.slice(0, token.length - target.length)))

export function findKeyword(text: string, keyword: string): number | null {
  const tokens = tokenize(text)
  const target = tokenize(keyword)
  if (!target.length) return null
  for (let start = 0; start + target.length <= tokens.length; start += 1) {
    if (target.every((part, offset) => tokenMatches(tokens[start + offset], part))) return start
  }
  return null
}

const STOP_WORDS = new Set([
  'של',
  'את',
  'על',
  'עם',
  'או',
  'גם',
  'כל',
  'זה',
  'זו',
  'זאת',
  'הוא',
  'היא',
  'הם',
  'לא',
  'אם',
  'כי',
  'יש',
  'אין',
  'מה',
  'איך',
  'אתם',
  'לכם',
  'שלכם',
  'אנחנו',
  'שלנו',
  'בלי',
  'עד',
  'רק',
  'the',
  'and',
  'or',
  'of',
  'to',
  'for',
  'in',
  'on',
  'with',
  'a',
  'an',
])

function repeatedWords(text: string, minimum: number) {
  const counts = new Map<string, number>()
  for (const token of tokenize(text)) {
    if (countCharacters(token) < 2 || STOP_WORDS.has(token) || /^\p{N}+$/u.test(token)) continue
    counts.set(token, (counts.get(token) ?? 0) + 1)
  }
  return [...counts].filter(([, count]) => count >= minimum)
}

function capsWords(text: string) {
  const words = text.match(/[A-Za-z]+/g) ?? []
  return [...new Set(words.filter((word) => word.length >= CAPS_WORD_MIN_LETTERS && word === word.toUpperCase()))]
}

const quote = (text: string) => `״${text}״`
const quoteList = (items: string[]) => items.map(quote).join(', ')

function repeatsTitle(title: string, description: string) {
  const titleTokens = tokenize(title)
  const descriptionTokens = tokenize(description)
  if (titleTokens.length < 3 || descriptionTokens.length < 3) return false
  if (descriptionTokens.join(' ').includes(titleTokens.join(' '))) return true
  const titleSet = new Set(titleTokens)
  const shared = descriptionTokens.filter((token) => titleSet.has(token)).length
  return shared / descriptionTokens.length >= 0.7
}

export function snippetFindings(
  input: SnippetInput,
  title: FieldMeasure | null,
  description: FieldMeasure | null,
): Finding[] {
  const findings: Finding[] = []
  const add = (id: string, level: Finding['level'], text: string) => findings.push({ id, level, text })
  const titleText = collapseSpaces(input.title)
  const descriptionText = collapseSpaces(input.description)
  const keyword = collapseSpaces(input.keyword)
  const siteName = collapseSpaces(input.siteName)

  if (!titleText) {
    add('title-missing', 'warn', 'אין כותרת. בלי תגית title גוגל תבחר טקסט אחר מהעמוד, למשל את הכותרת הראשית שלו.')
  }

  if (title?.cut) {
    add(
      'title-cut',
      'warn',
      `לפי המדידה, הכותרת רחבה מהרוחב המשוער ועלולה להיחתך אחרי ${quote(title.visible)}. קצרו אותה או העבירו את העיקר להתחלה.`,
    )
  }

  if (!descriptionText && titleText) {
    add(
      'description-missing',
      'tip',
      'אין תיאור. גוגל תבנה את הקטע מהטקסט שבעמוד. תיאור טוב נותן לה עוד אפשרות, שלפעמים מתאימה יותר.',
    )
  }

  if (description?.cut) {
    add(
      'description-cut',
      'tip',
      `התיאור רחב מהרוחב המשוער. מה שאחרי ${quote(lastWords(description.visible))} כנראה לא יוצג, ולכן כדאי לשים את העיקר בהתחלה.`,
    )
  }

  if (keyword) {
    const inTitle = titleText ? findKeyword(titleText, keyword) : null
    if (titleText && inTitle === null) {
      add('keyword-title', 'warn', `הביטוי ${quote(keyword)} לא מופיע בכותרת.`)
    } else if (titleText && inTitle !== null) {
      const visibleIndex = title?.cut ? findKeyword(title.visible, keyword) : inTitle
      if (visibleIndex === null) {
        add('keyword-hidden', 'warn', `הביטוי ${quote(keyword)} נמצא בחלק של הכותרת שעלול להיחתך.`)
      } else if (inTitle >= KEYWORD_START_WORDS) {
        add(
          'keyword-late',
          'tip',
          `הביטוי ${quote(keyword)} מופיע בכותרת רק אחרי ${inTitle} מילים. כשהוא בהתחלה, מי שחיפש אותו רואה מיד שהעמוד עונה על החיפוש.`,
        )
      }
    }
    if (descriptionText && findKeyword(descriptionText, keyword) === null) {
      add('keyword-description', 'tip', `הביטוי ${quote(keyword)} לא מופיע בתיאור.`)
    }
  }

  const titleRepeats = repeatedWords(titleText, 2).map(([word]) => word)
  if (titleRepeats.length) {
    add(
      'title-repeats',
      'tip',
      titleRepeats.length === 1
        ? `המילה ${quote(titleRepeats[0])} חוזרת בכותרת יותר מפעם אחת. גוגל ממליצה לא לחזור על אותן מילים בכותרת.`
        : `המילים ${quoteList(titleRepeats)} חוזרות בכותרת יותר מפעם אחת. גוגל ממליצה לא לחזור על אותן מילים בכותרת.`,
    )
  }

  const descriptionRepeats = repeatedWords(descriptionText, DESCRIPTION_REPEAT_LIMIT)
  if (descriptionRepeats.length) {
    const [word, count] = descriptionRepeats[0]
    add(
      'description-repeats',
      'tip',
      descriptionRepeats.length === 1
        ? `המילה ${quote(word)} חוזרת בתיאור ${count} פעמים. תיאור שנראה כמו רשימת מילות מפתח לא מסביר מה יש בעמוד.`
        : `המילים ${quoteList(descriptionRepeats.map(([item]) => item))} חוזרות בתיאור שוב ושוב. תיאור שנראה כמו רשימת מילות מפתח לא מסביר מה יש בעמוד.`,
    )
  }

  const caps = capsWords(`${titleText} ${descriptionText}`)
  if (caps.length) {
    add(
      'caps',
      'tip',
      `${quoteList(caps)} ${caps.length === 1 ? 'כתוב' : 'כתובים'} באותיות גדולות בלבד. באנגלית אותיות גדולות רחבות יותר ותופסות יותר מקום בשורה. אם זה לא חלק משם המותג, כתבו באותיות רגילות.`,
    )
  }

  if (titleText && descriptionText && repeatsTitle(titleText, descriptionText)) {
    add(
      'description-echo',
      'warn',
      'התיאור חוזר על הכותרת. נצלו אותו כדי להוסיף מה שאין בכותרת: מה מקבלים, למי זה מתאים, מחיר או אזור שירות.',
    )
  }

  if (siteName && titleText && findKeyword(titleText, siteName) !== null) {
    add(
      'site-name-twice',
      'tip',
      'שם האתר מופיע גם בכותרת וגם בשורה שמעליה. לפי גוגל, כששם האתר בכותרת חוזר על שם האתר שכבר מוצג בתוצאה, היא עשויה להשמיט אותו מהכותרת.',
    )
  }

  if (titleText && descriptionText && !isHebrew(titleText) && isHebrew(descriptionText)) {
    add(
      'title-language',
      'tip',
      'הכותרת כתובה בלי עברית והתיאור בעברית. לפי גוגל, כשהשפה או הכתב של הכותרת לא תואמים את התוכן העיקרי בעמוד, היא עשויה להציג כותרת אחרת.',
    )
  }

  return findings.sort((a, b) => (a.level === b.level ? 0 : a.level === 'warn' ? -1 : 1))
}

function lastWords(text: string) {
  const words = text.split(' ')
  return words.length > 4 ? words.slice(-4).join(' ') : text
}

export type DisplayUrl = { host: string; line: string; dir: 'ltr' | 'rtl' }

export function displayUrl(raw: string): DisplayUrl | null {
  const trimmed = raw.trim()
  if (!trimmed) return null
  const withProtocol = /^[a-z][a-z\d+.-]*:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`
  let url: URL
  try {
    url = new URL(withProtocol)
  } catch {
    return null
  }
  if (!url.hostname.includes('.')) return null
  const crumbs = url.pathname
    .split('/')
    .filter(Boolean)
    .map((part) => {
      try {
        return decodeURIComponent(part)
      } catch {
        return part
      }
    })
  return {
    host: url.hostname,
    line: [`${url.protocol}//${url.hostname}`, ...crumbs].join(' › '),
    dir: crumbs.some(isHebrew) ? 'rtl' : 'ltr',
  }
}

export const defaultSiteName = (host: string) => host.replace(/^www\./, '')

const escapeHtml = (text: string) =>
  text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

export function snippetHtml(input: SnippetInput) {
  const title = collapseSpaces(input.title)
  const description = collapseSpaces(input.description)
  return [
    title ? `<title>${escapeHtml(title)}</title>` : '',
    description ? `<meta name="description" content="${escapeHtml(description)}">` : '',
  ]
    .filter(Boolean)
    .join('\n')
}

const numberFormat = new Intl.NumberFormat('he-IL')

export const formatNumber = (value: number) => numberFormat.format(value)

export function formatReadingTime(minutes: number) {
  if (minutes === 0) return '0 דקות'
  if (minutes < 1) return 'פחות מדקה'
  const rounded = Math.round(minutes)
  return rounded === 1 ? 'כדקה' : `כ-${formatNumber(rounded)} דקות`
}

export const bandLabel: Record<Band, string> = {
  fits: 'נכנס',
  close: 'קרוב לגבול',
  cut: 'כנראה ייחתך',
}

export const isDevice = (value: unknown): value is Device => value === 'desktop' || value === 'mobile'

export function restoreSnippetInput(value: unknown): SnippetInput {
  const source = (value && typeof value === 'object' ? value : {}) as Record<string, unknown>
  const text = (key: keyof SnippetInput) => (typeof source[key] === 'string' ? (source[key] as string) : '')
  return {
    title: text('title'),
    description: text('description'),
    url: text('url'),
    siteName: text('siteName'),
    keyword: text('keyword'),
  }
}
