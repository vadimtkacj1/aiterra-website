export type CountMethod = 'codePoints' | 'twitter' | 'sms' | 'utf16'
export type LimitKind = 'max' | 'recommended' | 'estimate'
export type LimitStatus = 'empty' | 'fits' | 'close' | 'over'

export type WordSourceId =
  | 'brysbaert'
  | 'xCounting'
  | 'twitterText'
  | 'twilioSms'
  | 'igGraphMedia'
  | 'metaIgFeed'
  | 'metaFbFeed'
  | 'linkedinPosts'
  | 'tiktokDirectPost'
  | 'youtubeSettings'
  | 'googleAdsRsa'
  | 'googleTitle'
  | 'googleSnippet'
  | 'gbpEdit'
  | 'waBusinessProfile'
  | 'googleSpam'

export type WordSource = { href: string; label: string; short: string }

export type TextLimit = {
  id: string
  label: string
  limit: number
  min?: number
  kind: LimitKind
  method: CountMethod
  note: string
  sources: WordSourceId[]
  link?: { href: string; label: string }
  hashtags?: number
  mentions?: number
}

export type TextStats = {
  characters: number
  charactersNoSpaces: number
  words: number
  hebrewWords: number
  sentences: number
  paragraphs: number
  readingSeconds: number
  speakingSeconds: number
}

export type SmsInfo = { encoding: 'GSM-7' | 'UCS-2'; units: number; segments: number; perSegment: number }

export type LimitResult = { used: number; status: LimitStatus; sms?: SmsInfo }

export type KeywordRow = { word: string; count: number; share: number }

export const WORDS_CHECKED = '2026-10-23'
export const WORDS_CHECKED_LABEL = '23 באוקטובר 2026'

export const HEBREW_SILENT_WPM = 224
export const HEBREW_ALOUD_WPM = 147
export const ENGLISH_SILENT_WPM = 238
export const ENGLISH_ALOUD_WPM = 183
export const CLOSE_RATIO = 0.9
export const KEYWORD_ROWS = 10
export const MIN_REPEATS = 2

export const wordSources: Record<WordSourceId, WordSource> = {
  brysbaert: {
    href: 'https://doi.org/10.1016/j.jml.2019.104047',
    label: 'Brysbaert (2019), How many words do we read per minute? Journal of Memory and Language 109',
    short: 'Brysbaert 2019',
  },
  xCounting: {
    href: 'https://docs.x.com/fundamentals/counting-characters',
    label: 'X Developer Platform: Counting characters',
    short: 'X',
  },
  twitterText: {
    href: 'https://github.com/twitter/twitter-text/blob/master/config/v3.json',
    label: 'twitter-text: config v3.json (character weights)',
    short: 'twitter-text',
  },
  twilioSms: {
    href: 'https://www.twilio.com/docs/glossary/what-sms-character-limit',
    label: 'Twilio: How long can a message be? (GSM-7 and UCS-2)',
    short: 'Twilio',
  },
  igGraphMedia: {
    href: 'https://developers.facebook.com/docs/instagram-platform/instagram-graph-api/reference/ig-user/media',
    label: 'Meta for Developers: Instagram Graph API, IG User Media (caption)',
    short: 'Meta',
  },
  metaIgFeed: {
    href: 'https://www.facebook.com/business/ads-guide/update/image/instagram-feed',
    label: 'Meta Ads Guide: Image ads in Instagram Feed',
    short: 'Meta Ads',
  },
  metaFbFeed: {
    href: 'https://www.facebook.com/business/ads-guide/update/image/facebook-feed',
    label: 'Meta Ads Guide: Image ads in Facebook Feed',
    short: 'Meta Ads',
  },
  linkedinPosts: {
    href: 'https://www.linkedin.com/help/linkedin/answer/a528176',
    label: 'LinkedIn Help: Post and share updates',
    short: 'LinkedIn',
  },
  tiktokDirectPost: {
    href: 'https://developers.tiktok.com/doc/content-posting-api-reference-direct-post',
    label: 'TikTok for Developers: Content Posting API, Direct Post (title)',
    short: 'TikTok',
  },
  youtubeSettings: {
    href: 'https://support.google.com/youtube/answer/57404',
    label: 'YouTube Help: Edit video settings',
    short: 'YouTube',
  },
  googleAdsRsa: {
    href: 'https://support.google.com/google-ads/answer/7684791',
    label: 'Google Ads Help: About responsive search ads',
    short: 'Google Ads',
  },
  googleTitle: {
    href: 'https://developers.google.com/search/docs/appearance/title-link',
    label: 'Google Search Central: Influencing your title links in search results',
    short: 'Google',
  },
  googleSnippet: {
    href: 'https://developers.google.com/search/docs/appearance/snippet',
    label: 'Google Search Central: Control your snippets in search results',
    short: 'Google',
  },
  gbpEdit: {
    href: 'https://support.google.com/business/answer/3039617',
    label: 'Google Business Profile Help: Edit your Business Profile',
    short: 'Google',
  },
  waBusinessProfile: {
    href: 'https://developers.facebook.com/docs/whatsapp/cloud-api/reference/business-profiles',
    label: 'Meta for Developers: WhatsApp Cloud API, Business profiles',
    short: 'Meta',
  },
  googleSpam: {
    href: 'https://developers.google.com/search/docs/essentials/spam-policies',
    label: 'Google Search Central: Spam policies for Google web search (keyword stuffing)',
    short: 'Google',
  },
}

const snippetTool = { href: '/tools/google-snippet-preview', label: 'מדידה בפיקסלים' }

export const textLimits: TextLimit[] = [
  {
    id: 'x-post',
    label: 'פוסט ב-X (טוויטר)',
    limit: 280,
    kind: 'max',
    method: 'twitter',
    note: 'אות בעברית או באנגלית נספרת כ-1, אימוג׳י כ-2, וכל קישור כ-23. גם כל סימן ניקוד נספר כתו.',
    sources: ['xCounting', 'twitterText'],
  },
  {
    id: 'sms',
    label: 'SMS',
    limit: 70,
    kind: 'max',
    method: 'sms',
    note: 'עם עברית או אימוג׳י: 70 תווים בהודעה אחת, ומעבר לזה הודעות של 67 תווים. בלי עברית: 160, ואחר כך 153.',
    sources: ['twilioSms'],
  },
  {
    id: 'instagram-caption',
    label: 'כיתוב לפוסט באינסטגרם',
    limit: 2200,
    kind: 'max',
    method: 'codePoints',
    note: 'עד 30 האשטגים ו-20 תיוגים, לפי התיעוד של Meta למפתחים.',
    sources: ['igGraphMedia'],
    hashtags: 30,
    mentions: 20,
  },
  {
    id: 'instagram-ad',
    label: 'טקסט ראשי למודעה באינסטגרם',
    limit: 125,
    kind: 'recommended',
    method: 'codePoints',
    note: 'המלצה של Meta, לא מגבלה. טקסט ארוך יותר נחתך ומוצג אחרי ״עוד״.',
    sources: ['metaIgFeed'],
  },
  {
    id: 'facebook-ad',
    label: 'טקסט ראשי למודעה בפייסבוק',
    limit: 150,
    min: 50,
    kind: 'recommended',
    method: 'codePoints',
    note: 'Meta ממליצה על 50 עד 150 תווים. לפוסט רגיל פייסבוק לא מפרסמת מגבלה.',
    sources: ['metaFbFeed'],
  },
  {
    id: 'linkedin-post',
    label: 'פוסט בלינקדאין',
    limit: 3000,
    kind: 'max',
    method: 'codePoints',
    note: 'טקסט ארוך יותר אפשר לפרסם כמאמר.',
    sources: ['linkedinPosts'],
  },
  {
    id: 'tiktok-caption',
    label: 'כיתוב לסרטון בטיקטוק',
    limit: 2200,
    kind: 'max',
    method: 'utf16',
    note: 'נספר ביחידות UTF-16, כך שאימוג׳י נספר בדרך כלל כ-2. באפליקציה מדווחים לפעמים על מגבלה גבוהה יותר.',
    sources: ['tiktokDirectPost'],
  },
  {
    id: 'youtube-title',
    label: 'כותרת לסרטון ביוטיוב',
    limit: 100,
    kind: 'max',
    method: 'codePoints',
    note: 'כולל רווחים.',
    sources: ['youtubeSettings'],
  },
  {
    id: 'google-ads-headline',
    label: 'כותרת במודעת חיפוש בגוגל',
    limit: 30,
    kind: 'max',
    method: 'codePoints',
    note: 'עד 15 כותרות במודעה. אות בעברית נספרת כ-1; רק סינית, יפנית וקוריאנית נספרות כ-2.',
    sources: ['googleAdsRsa'],
  },
  {
    id: 'google-ads-description',
    label: 'תיאור במודעת חיפוש בגוגל',
    limit: 90,
    kind: 'max',
    method: 'codePoints',
    note: 'עד 4 תיאורים במודעה.',
    sources: ['googleAdsRsa'],
  },
  {
    id: 'google-title',
    label: 'כותרת עמוד לגוגל (title)',
    limit: 67,
    kind: 'estimate',
    method: 'codePoints',
    note: 'לגוגל אין מגבלת תווים: הכותרת נחתכת לפי רוחב המסך. 67 הוא הערכה שלנו לעברית במחשב.',
    sources: ['googleTitle'],
    link: snippetTool,
  },
  {
    id: 'google-description',
    label: 'תיאור לגוגל (meta description)',
    limit: 145,
    kind: 'estimate',
    method: 'codePoints',
    note: 'גם כאן אין מגבלה רשמית. 145 הוא הערכה שלנו לעברית במחשב, ובטלפון נכנס פחות.',
    sources: ['googleSnippet'],
    link: snippetTool,
  },
  {
    id: 'gbp-description',
    label: 'תיאור העסק בפרופיל העסק בגוגל',
    limit: 750,
    kind: 'max',
    method: 'codePoints',
    note: 'גוגל כותבת לא לעבור 750 תווים.',
    sources: ['gbpEdit'],
  },
  {
    id: 'whatsapp-about',
    label: 'שורת ״אודות״ בוואטסאפ עסקי',
    limit: 139,
    kind: 'max',
    method: 'codePoints',
    note: 'מתוך התיעוד של WhatsApp Business לפרופיל העסק.',
    sources: ['waBusinessProfile'],
  },
  {
    id: 'whatsapp-description',
    label: 'תיאור העסק בוואטסאפ עסקי',
    limit: 512,
    kind: 'max',
    method: 'codePoints',
    note: 'מתוך התיעוד של WhatsApp Business לפרופיל העסק.',
    sources: ['waBusinessProfile'],
  },
]

const graphemer =
  typeof Intl !== 'undefined' && 'Segmenter' in Intl ? new Intl.Segmenter('he', { granularity: 'grapheme' }) : null

export const graphemes = (text: string) =>
  graphemer ? Array.from(graphemer.segment(text), (part) => part.segment) : Array.from(text)

export const countCharacters = (text: string) => graphemes(text).length

const SPACE = /[\s\u200B\u2060\uFEFF]+/u
const DASH = /[-\u2010\u2011\u2012\u2013\u2014\u05BE]/u
const WORD_CHARACTER = /[\p{L}\p{N}]/u
const HEBREW_LETTER = /\p{Script=Hebrew}/u
const HEBREW_PREFIX = /^[והבכלמש]{1,3}$/u
const LINK = /^[("'״«[]*(?:https?:\/\/|www\.)\S+$|^[^\s@]+@[^\s@]+\.[^\s@]+$/iu
const NIQQUD = /[\u0591-\u05BD\u05BF\u05C1\u05C2\u05C4\u05C5\u05C7]/gu

export const hasWordCharacter = (text: string) => WORD_CHARACTER.test(text)

const isHebrewPart = (part: string) => HEBREW_LETTER.test(part) && !/[A-Za-z0-9]/.test(part)

export function splitToken(token: string): string[] {
  if (!hasWordCharacter(token)) return []
  if (LINK.test(token)) return [token]
  const parts = token.split(DASH)
  const merged: string[] = []
  let carry = ''
  for (const part of parts) {
    const current = carry + part
    carry = ''
    if (!hasWordCharacter(current)) continue
    if (HEBREW_PREFIX.test(current)) {
      carry = `${current}-`
      continue
    }
    const previous = merged[merged.length - 1]
    if (previous !== undefined && !(isHebrewPart(previous) && isHebrewPart(current))) {
      merged[merged.length - 1] = `${previous}-${current}`
    } else {
      merged.push(current)
    }
  }
  if (carry) merged.push(carry.slice(0, -1))
  return merged
}

export function tokenizeWords(text: string): string[] {
  return text.split(SPACE).flatMap(splitToken)
}

export const countWords = (text: string) => tokenizeWords(text).length

export function countSentences(text: string) {
  return text.split(/[.!?…]+["'״׳”’)\]]*(?=\s|$)|\n+/u).filter(hasWordCharacter).length
}

export const countParagraphs = (text: string) => text.split(/\n/).filter(hasWordCharacter).length

export function textStats(text: string): TextStats {
  const words = tokenizeWords(text)
  const hebrewWords = words.filter((word) => HEBREW_LETTER.test(word)).length
  const otherWords = words.length - hebrewWords
  return {
    characters: countCharacters(text),
    charactersNoSpaces: countCharacters(text.replace(/[\s\u200B\u2060\uFEFF]+/gu, '')),
    words: words.length,
    hebrewWords,
    sentences: countSentences(text),
    paragraphs: countParagraphs(text),
    readingSeconds: (hebrewWords / HEBREW_SILENT_WPM + otherWords / ENGLISH_SILENT_WPM) * 60,
    speakingSeconds: (hebrewWords / HEBREW_ALOUD_WPM + otherWords / ENGLISH_ALOUD_WPM) * 60,
  }
}

export function removeNiqqud(text: string) {
  return text.normalize('NFD').replace(NIQQUD, '').normalize('NFC')
}

export const countNiqqud = (text: string) => (text.normalize('NFD').match(NIQQUD) ?? []).length

const GSM_BASIC = new Set(
  Array.from(
    '@£$¥èéùìòÇ\nØø\rÅåΔ_ΦΓΛΩΠΨΣΘΞÆæßÉ !"#¤%&\'()*+,-./0123456789:;<=>?¡ABCDEFGHIJKLMNOPQRSTUVWXYZÄÖÑÜ§¿abcdefghijklmnopqrstuvwxyzäöñüà',
  ),
)
const GSM_EXTENDED = new Set(Array.from('^{}\\[~]|€\f'))

export function smsInfo(text: string): SmsInfo {
  const characters = Array.from(text)
  const gsm = characters.every((character) => GSM_BASIC.has(character) || GSM_EXTENDED.has(character))
  if (gsm) {
    const units = characters.reduce((sum, character) => sum + (GSM_EXTENDED.has(character) ? 2 : 1), 0)
    return { encoding: 'GSM-7', units, segments: units <= 160 ? 1 : Math.ceil(units / 153), perSegment: units <= 160 ? 160 : 153 }
  }
  const units = text.length
  return { encoding: 'UCS-2', units, segments: units <= 70 ? 1 : Math.ceil(units / 67), perSegment: units <= 70 ? 70 : 67 }
}

const TWITTER_RANGES: [number, number][] = [
  [0, 4351],
  [8192, 8205],
  [8208, 8223],
  [8242, 8247],
]
const URL_WITH_PROTOCOL = /^(?:https?:\/\/|www\.)\S+$/iu
const URL_WITH_DOMAIN =
  /^(?:[\p{L}\p{N}-]+\.)+(?:com|net|org|il|io|ai|co|app|dev|info|biz|me|ly|tv|uk|de|fr|us|eu|ru|es|it|nl|gov|edu|shop|store|online|site|xyz)(?:[/?#]\S*)?$/iu
const LEADING_PUNCTUATION = /^[(\[{"'״«]+/u
const TRAILING_PUNCTUATION = /[.,;:!?)\]}"'״׳»]+$/u
const EMOJI = /\p{Extended_Pictographic}|\p{Regional_Indicator}|\u20E3/u

const twitterWeight = (codePoint: number) =>
  TWITTER_RANGES.some(([start, end]) => codePoint >= start && codePoint <= end) ? 1 : 2

function weightedCharacters(text: string) {
  let total = 0
  for (const part of graphemes(text)) {
    if (EMOJI.test(part)) {
      total += 2
      continue
    }
    for (const character of part) total += twitterWeight(character.codePointAt(0) ?? 0)
  }
  return total
}

function twitterChunkLength(chunk: string) {
  const leading = LEADING_PUNCTUATION.exec(chunk)?.[0] ?? ''
  const trailing = TRAILING_PUNCTUATION.exec(chunk.slice(leading.length))?.[0] ?? ''
  const core = chunk.slice(leading.length, chunk.length - trailing.length)
  if (core && (URL_WITH_PROTOCOL.test(core) || URL_WITH_DOMAIN.test(core))) {
    return weightedCharacters(leading) + 23 + weightedCharacters(trailing)
  }
  return weightedCharacters(chunk)
}

export function twitterLength(text: string) {
  return text
    .normalize('NFC')
    .split(/(\s+)/u)
    .reduce((sum, chunk) => sum + (/^\s+$/u.test(chunk) ? Array.from(chunk).length : twitterChunkLength(chunk)), 0)
}

export const codePointLength = (text: string) => Array.from(text.normalize('NFC')).length

export const countHashtags = (text: string) => (text.match(/(?:^|\s)#[\p{L}\p{N}_]+/gu) ?? []).length

export const countMentions = (text: string) => (text.match(/(?:^|\s)@[\p{L}\p{N}_.]+/gu) ?? []).length

export function measureLimit(text: string, limit: TextLimit): LimitResult {
  if (!text.trim()) return { used: 0, status: 'empty' }
  if (limit.method === 'sms') {
    const sms = smsInfo(text)
    return { used: sms.units, status: sms.segments > 1 ? 'over' : sms.units >= sms.perSegment * CLOSE_RATIO ? 'close' : 'fits', sms }
  }
  const used =
    limit.method === 'twitter' ? twitterLength(text) : limit.method === 'utf16' ? text.length : codePointLength(text)
  const extraOver =
    (limit.hashtags !== undefined && countHashtags(text) > limit.hashtags) ||
    (limit.mentions !== undefined && countMentions(text) > limit.mentions)
  if (used > limit.limit || extraOver) return { used, status: 'over' }
  if (used >= limit.limit * CLOSE_RATIO) return { used, status: 'close' }
  return { used, status: 'fits' }
}

const HEBREW_STOP_WORDS = [
  'של', 'את', 'על', 'עם', 'או', 'גם', 'כל', 'זה', 'זו', 'זאת', 'הזה', 'הזאת', 'האלה', 'אלה', 'אלו', 'הוא',
  'היא', 'הם', 'הן', 'אני', 'אתה', 'אנחנו', 'אתם', 'אתן', 'לא', 'כן', 'אם', 'כי', 'יש', 'אין', 'מה', 'מי', 'איך',
  'למה', 'מתי', 'איפה', 'כמה', 'כאשר', 'אבל', 'אך', 'אלא', 'רק', 'עוד', 'כבר', 'מאוד', 'היה', 'הייתה', 'היו',
  'יהיה', 'תהיה', 'יהיו', 'להיות', 'בין', 'לפני', 'אחרי', 'עד', 'אל', 'כמו', 'בלי', 'ללא', 'תוך', 'דרך', 'לכן',
  'אז', 'כך', 'כדי', 'זהו', 'שלי', 'שלך', 'שלו', 'שלה', 'שלנו', 'שלכם', 'שלכן', 'שלהם', 'שלהן', 'לי', 'לך',
  'לו', 'לה', 'לנו', 'לכם', 'להם', 'להן', 'אותו', 'אותה', 'אותם', 'אותן', 'אותי', 'אותך', 'אותנו', 'בו', 'בה',
  'בהם', 'בהן', 'בי', 'בך', 'בנו', 'בכם', 'ממנו', 'ממנה', 'מהם', 'יותר', 'פחות', 'כלומר', 'פה', 'כאן', 'שם',
  'עכשיו', 'אחד', 'אחת', 'שאר', 'כלל', 'הרבה', 'מעט', 'אף', 'בכל', 'לכל', 'שכל', 'וגם', 'שזה', 'שהוא', 'שהיא',
  'הנה', 'אצל', 'מול', 'ליד', 'בגלל', 'מפני', 'לגבי', 'בעוד', 'אשר', 'שבו', 'שבה', 'שבהם', 'כפי', 'יכול',
  'יכולה', 'יכולים', 'צריך', 'צריכה', 'צריכים',
]

const ENGLISH_STOP_WORDS = [
  'the', 'a', 'an', 'and', 'or', 'but', 'of', 'to', 'in', 'on', 'at', 'for', 'with', 'by', 'from', 'is', 'are',
  'was', 'were', 'be', 'been', 'it', 'its', 'this', 'that', 'these', 'those', 'as', 'not', 'no', 'you', 'your',
  'we', 'our', 'they', 'their', 'he', 'she', 'his', 'her', 'i', 'my', 'me', 'so', 'if', 'than', 'then', 'there',
  'what', 'which', 'who', 'how', 'can', 'will', 'do', 'does', 'have', 'has', 'had', 'more', 'about', 'into',
]

export const stopWords = new Set([...HEBREW_STOP_WORDS, ...ENGLISH_STOP_WORDS])

export const hebrewStopWordCount = new Set(HEBREW_STOP_WORDS).size

const normalizeQuotes = (text: string) => text.replace(/[׳’`]/g, "'").replace(/[״”“]/g, '"')

const HEBREW_PREFIX_DASH = /^[והבכלמש]{1,3}-/u
const LINK_INSIDE = /https?:\/\/|www\.|\S@\S/iu

export function keywordToken(word: string) {
  const plain = normalizeQuotes(removeNiqqud(word)).toLowerCase()
  return plain.replace(/^[^\p{L}\p{N}]+|[^\p{L}\p{N}]+$/gu, '').replace(HEBREW_PREFIX_DASH, '')
}

export const displayToken = (token: string) =>
  token.replace(/(\p{Script=Hebrew})"(?=\p{Script=Hebrew})/gu, '$1״').replace(/(\p{Script=Hebrew})'/gu, '$1׳')

export function keywordDensity(text: string, rows = KEYWORD_ROWS): KeywordRow[] {
  const words = tokenizeWords(text)
  if (!words.length) return []
  const counts = new Map<string, number>()
  for (const word of words) {
    if (LINK_INSIDE.test(word)) continue
    const token = keywordToken(word)
    if (!token || countCharacters(token) < 2 || stopWords.has(token) || !/\p{L}/u.test(token)) continue
    counts.set(token, (counts.get(token) ?? 0) + 1)
  }
  return [...counts]
    .filter(([, count]) => count >= MIN_REPEATS)
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0], 'he'))
    .slice(0, rows)
    .map(([word, count]) => ({ word, count, share: count / words.length }))
}

const numberFormat = new Intl.NumberFormat('he-IL')

export const formatNumber = (value: number) => numberFormat.format(value)

export function formatDuration(seconds: number) {
  if (seconds <= 0) return '0 שניות'
  if (seconds < 60) {
    const rounded = Math.max(5, Math.round(seconds / 5) * 5)
    return rounded >= 60 ? 'דקה' : `${rounded} שניות`
  }
  const totalSeconds = Math.round(seconds / 5) * 5
  const minutes = Math.floor(totalSeconds / 60)
  const rest = totalSeconds % 60
  const minutesText = minutes === 1 ? 'דקה' : minutes === 2 ? 'שתי דקות' : `${formatNumber(minutes)} דקות`
  return rest ? `${minutesText} ו-${rest} שניות` : minutesText
}

export const limitById = (id: string) => textLimits.find((limit) => limit.id === id)

export const usedWordSources = (): WordSourceId[] => [
  'brysbaert',
  ...new Set(textLimits.flatMap((limit) => limit.sources)),
  'googleSpam',
]
