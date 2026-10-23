export type Status = 'pass' | 'warn' | 'fail' | 'info'

export type CrawlerKind = 'search' | 'user' | 'gemini' | 'training'

export type Crawler = {
  token: string
  vendor: string
  kind: CrawlerKind
  role: string
  ifBlocked: string
  doc: string
}

export type RobotsRule = { allow: boolean; pattern: string }

export type RobotsGroup = { agents: string[]; rules: RobotsRule[] }

export type ParsedRobots = {
  groups: RobotsGroup[]
  sitemaps: string[]
  contentSignals: string[]
  managed: boolean
}

export type RobotsVerdict = {
  allowed: boolean
  via: 'agent' | 'star' | 'none'
  rule: RobotsRule | null
}

export type CrawlerVerdict = {
  token: string
  allowed: boolean
  via: RobotsVerdict['via']
  rule: string | null
}

export type FetchOutcome =
  | 'ok'
  | 'timeout'
  | 'network'
  | 'tls'
  | 'dns'
  | 'unsafe'
  | 'redirect-blocked'
  | 'too-many-redirects'
  | 'skipped'

export type Wall = { vendor: string; kind: 'challenge' | 'block' }

export type MetaRobots = { name: string; content: string }

export type HtmlFacts = {
  title: string
  description: string
  lang: string
  dir: string
  metaRobots: MetaRobots[]
  jsonLdTypes: string[]
  jsonLdBlocks: number
  jsonLdInvalid: number
  microdata: boolean
  words: number
  scripts: number
  shell: boolean
}

export type HomeFacts = {
  outcome: FetchOutcome
  status: number | null
  wall: Wall | null
  cdn: string | null
  truncated: boolean
  headerRobots: string[]
  html: HtmlFacts | null
}

export type ProbeFacts = {
  outcome: FetchOutcome
  status: number | null
  wall: Wall | null
}

export type RobotsKind = 'rules' | 'missing' | 'forbidden' | 'error' | 'html'

export type RobotsFacts = {
  outcome: FetchOutcome
  status: number | null
  kind: RobotsKind
  groups: number
  verdicts: CrawlerVerdict[]
  starRules: RobotsRule[]
  sitemaps: string[]
  managed: boolean
  contentSignals: string[]
}

export type LlmsFacts = {
  outcome: FetchOutcome
  status: number | null
  found: boolean
  html: boolean
}

export type SitemapFacts = {
  outcome: FetchOutcome
  status: number | null
  url: string
  source: 'robots' | 'default'
  found: boolean
  kind: 'urlset' | 'sitemapindex' | 'gzip' | 'other' | null
  offsite: string | null
}

export type SiteFacts = {
  input: string
  host: string
  finalUrl: string
  redirects: { status: number; url: string }[]
  checkedAt: string
  home: HomeFacts
  probe: ProbeFacts | null
  robots: RobotsFacts
  llms: LlmsFacts
  sitemap: SitemapFacts
}

export type TargetError = 'empty' | 'too-long' | 'scheme' | 'credentials' | 'port' | 'ip' | 'host' | 'invalid'

export type ServerError = 'dns' | 'private-address' | 'rate-limited' | 'busy' | 'bad-request' | 'forbidden' | 'internal'

export type Target = { ok: true; url: string; host: string } | { ok: false; error: TargetError }

export type ReportItem = {
  id: string
  status: Status
  title: string
  text: string
  fix?: string
  code?: string
}

export type CrawlerRow = {
  token: string
  vendor: string
  status: Status
  allowed: boolean
  text: string
  rule: string
  doc: string
}

export type CrawlerGroup = { kind: CrawlerKind; label: string; text: string; rows: CrawlerRow[] }

export type ReportSection = {
  id: string
  title: string
  items: ReportItem[]
  crawlers?: CrawlerGroup[]
}

export type Counts = { pass: number; warn: number; fail: number }

export const API_PATH = '/api/tools/ai-readiness'
export const CHECKED_ON = '23.10.2026'
export const CHECKED_ON_LONG = '23 באוקטובר 2026'
export const RATE_LIMIT = 10
export const RATE_WINDOW_MS = 10 * 60 * 1000
export const CLIENT_TIMEOUT_MS = 25000
export const SLOW_AFTER_MS = 5000
export const MAX_REDIRECTS = 3
export const MAX_INPUT_LENGTH = 2048
export const ROBOTS_PARSE_LIMIT = 512 * 1024
export const WORDS_PASS = 150
export const WORDS_WARN = 40

export const DOCS = {
  openai: 'https://developers.openai.com/api/docs/bots',
  googleCrawlers: 'https://developers.google.com/crawling/docs/crawlers-fetchers/google-common-crawlers',
  googleAiFeatures: 'https://developers.google.com/search/docs/appearance/ai-features',
  bing: 'https://www.bing.com/webmasters/help/which-crawlers-does-bing-use-8c184ec0',
  bingCopilot:
    'https://blogs.bing.com/webmaster/2023/9/Announcing-new-options-for-webmasters-to-control-usage-of-their-content-in-Bing-Chat/',
  anthropic:
    'https://support.claude.com/en/articles/8896518-does-anthropic-crawl-data-from-the-web-and-how-can-site-owners-block-the-crawler',
  perplexity: 'https://docs.perplexity.ai/docs/resources/perplexity-crawlers',
  commonCrawl: 'https://commoncrawl.org/ccbot',
  commonCrawlFaq: 'https://commoncrawl.org/faq',
  apple: 'https://support.apple.com/en-us/119829',
  meta: 'https://developers.facebook.com/documentation/sharing/webmasters/web-crawlers',
  bytespider: 'https://blog.cloudflare.com/declaring-your-aindependence-block-ai-bots-scrapers-and-crawlers-with-a-single-click/',
  cloudflareAiBots: 'https://developers.cloudflare.com/bots/additional-configurations/block-ai-bots/',
  cloudflareManagedRobots: 'https://developers.cloudflare.com/bots/additional-configurations/managed-robots-txt/',
  cloudflareDefault: 'https://blog.cloudflare.com/content-independence-day-no-ai-crawl-without-compensation/',
  rfc9309: 'https://www.rfc-editor.org/rfc/rfc9309.html',
  vercel: 'https://vercel.com/blog/the-rise-of-the-ai-crawler',
  llmstxt: 'https://llmstxt.org/',
  searchEngineLand:
    'https://searchengineland.com/google-says-normal-seo-works-for-ranking-in-ai-overviews-and-llms-txt-wont-be-used-459422',
  roundtable: 'https://www.seroundtable.com/google-ai-llms-txt-39607.html',
} as const

export const crawlers: Crawler[] = [
  {
    token: 'Googlebot',
    vendor: 'Google',
    kind: 'search',
    role: 'סורק לחיפוש בגוגל. לפי גוגל, הוא גם מה שקובע אם הדף יכול להופיע ב-AI Overviews וב-AI Mode.',
    ifBlocked: 'הדפים ייעלמו מחיפוש גוגל, וגם מ-AI Overviews ומ-AI Mode.',
    doc: DOCS.googleCrawlers,
  },
  {
    token: 'Bingbot',
    vendor: 'Microsoft',
    kind: 'search',
    role: 'סורק לחיפוש של Bing. לפי Microsoft, גם Copilot נשען על האינדקס של Bing.',
    ifBlocked: 'הדפים ייעלמו מ-Bing ומתשובות של Copilot שנשענות על האינדקס שלו.',
    doc: DOCS.bing,
  },
  {
    token: 'OAI-SearchBot',
    vendor: 'OpenAI',
    kind: 'search',
    role: 'מוצא דפים ומציג אותם בתשובות החיפוש של ChatGPT.',
    ifBlocked: 'לפי OpenAI, האתר לא יוצג בתשובות החיפוש של ChatGPT, לכל היותר כקישור ניווט.',
    doc: DOCS.openai,
  },
  {
    token: 'Claude-SearchBot',
    vendor: 'Anthropic',
    kind: 'search',
    role: 'סורק אתרים כדי לשפר את תוצאות החיפוש ש-Claude מציג.',
    ifBlocked: 'לפי Anthropic, האתר עלול להופיע פחות, ופחות מדויק, בתשובות החיפוש של Claude.',
    doc: DOCS.anthropic,
  },
  {
    token: 'PerplexityBot',
    vendor: 'Perplexity',
    kind: 'search',
    role: 'מוצא דפים ומקשר אליהם בתשובות של Perplexity. לפי Perplexity, הוא לא אוסף תוכן לאימון מודלים.',
    ifBlocked: 'האתר לא יופיע כמקור בתשובות של Perplexity.',
    doc: DOCS.perplexity,
  },
  {
    token: 'meta-webindexer',
    vendor: 'Meta',
    kind: 'search',
    role: 'סורק אתרים לחיפוש ולציטוטים של Meta AI.',
    ifBlocked: 'האתר יופיע פחות כמקור בתשובות של Meta AI.',
    doc: DOCS.meta,
  },
  {
    token: 'ChatGPT-User',
    vendor: 'OpenAI',
    kind: 'user',
    role: 'נכנס לדף כשמשתמש מבקש מ-ChatGPT לפתוח אותו או לחפש בו.',
    ifBlocked: 'ChatGPT לא ייכנס לדף בשביל משתמשים. לפי OpenAI, ייתכן שכללי robots.txt לא חלים עליו, כי הבקשה באה ממשתמש.',
    doc: DOCS.openai,
  },
  {
    token: 'Claude-User',
    vendor: 'Anthropic',
    kind: 'user',
    role: 'נכנס לדף כשמשתמש שואל את Claude שאלה שהדף עונה עליה.',
    ifBlocked: 'Claude לא ייכנס לדף בשביל משתמשים, ולפי Anthropic זה עלול להקטין את הנראות בחיפוש שמשתמשים מפעילים.',
    doc: DOCS.anthropic,
  },
  {
    token: 'Perplexity-User',
    vendor: 'Perplexity',
    kind: 'user',
    role: 'נכנס לדף כשמשתמש שואל את Perplexity שאלה.',
    ifBlocked: 'לפי Perplexity, הבוט הזה בדרך כלל מתעלם מ-robots.txt, כי הבקשה באה ממשתמש.',
    doc: DOCS.perplexity,
  },
  {
    token: 'Google-Extended',
    vendor: 'Google',
    kind: 'gemini',
    role: 'לא בוט נפרד אלא הרשאה: האם תוכן שגוגל סורקת ישמש לאימון Gemini ולביסוס תשובות באפליקציית Gemini וב-Vertex AI.',
    ifBlocked: 'לפי גוגל, אין לזה השפעה על חיפוש גוגל, על הדירוג ועל AI Overviews. התוכן לא ישמש לאימון Gemini ולתשובות באפליקציית Gemini.',
    doc: DOCS.googleCrawlers,
  },
  {
    token: 'GPTBot',
    vendor: 'OpenAI',
    kind: 'training',
    role: 'אוסף תוכן לאימון המודלים של OpenAI.',
    ifBlocked: 'התוכן לא ישמש לאימון. לפי OpenAI, זה לא משפיע על ההופעה בחיפוש של ChatGPT.',
    doc: DOCS.openai,
  },
  {
    token: 'ClaudeBot',
    vendor: 'Anthropic',
    kind: 'training',
    role: 'אוסף תוכן שעשוי לשמש לאימון המודלים של Anthropic.',
    ifBlocked: 'לפי Anthropic, תוכן עתידי של האתר לא ייכלל בנתוני האימון.',
    doc: DOCS.anthropic,
  },
  {
    token: 'anthropic-ai',
    vendor: 'Anthropic',
    kind: 'training',
    role: 'שם ישן שמופיע בהרבה קבצי robots.txt. הוא לא מופיע ברשימת הבוטים הנוכחית של Anthropic.',
    ifBlocked: 'כנראה בלי השפעה היום. החסימה שקובעת לאימון היא של ClaudeBot.',
    doc: DOCS.anthropic,
  },
  {
    token: 'CCBot',
    vendor: 'Common Crawl',
    kind: 'training',
    role: 'בונה את הארכיון הפתוח של Common Crawl, שחברות רבות מאמנות עליו מודלים.',
    ifBlocked: 'הדפים לא ייכנסו לארכיון. אין לזה השפעה על חיפוש.',
    doc: DOCS.commonCrawl,
  },
  {
    token: 'Applebot-Extended',
    vendor: 'Apple',
    kind: 'training',
    role: 'לא סורק דפים. קובע אם תוכן ש-Applebot אסף ישמש לאימון המודלים של Apple.',
    ifBlocked: 'לפי Apple, האתר עדיין יכול להופיע בחיפוש של Apple, וההגדרה לא משפיעה על הדירוג.',
    doc: DOCS.apple,
  },
  {
    token: 'meta-externalagent',
    vendor: 'Meta',
    kind: 'training',
    role: 'אוסף תוכן לאימון מודלי AI של Meta ולשיפור מוצרים.',
    ifBlocked: 'התוכן לא ישמש לאימון. לחיפוש של Meta AI יש בוט נפרד, meta-webindexer.',
    doc: DOCS.meta,
  },
  {
    token: 'Bytespider',
    vendor: 'ByteDance',
    kind: 'training',
    role: 'הבוט של ByteDance, החברה של TikTok. לפי Cloudflare הוא אוסף נתונים לאימון מודלי שפה. ByteDance לא מפרסמת עליו תיעוד רשמי.',
    ifBlocked: 'אין לזה השפעה על מנועי החיפוש שבדף הזה.',
    doc: DOCS.bytespider,
  },
]

export const kindInfo: Record<CrawlerKind, { label: string; text: string }> = {
  search: {
    label: 'חיפוש ותשובות',
    text: 'הבוטים שקובעים אם האתר יופיע כמקור בתשובות. חסימה שלהם מוציאה את האתר מהתשובות.',
  },
  user: {
    label: 'כניסה בשביל משתמש',
    text: 'נכנסים לדף כשמשתמש שואל שאלה או מבקש לפתוח קישור.',
  },
  gemini: {
    label: 'Gemini',
    text: 'הרשאה של גוגל לשימוש בתוכן לאימון Gemini ולתשובות באפליקציית Gemini.',
  },
  training: {
    label: 'אימון מודלים',
    text: 'אוספים תוכן לאימון מודלים. לחסום אותם או לא זו החלטה עסקית שלא משפיעה על החיפוש, ולכן הם לא נספרים בסיכום.',
  },
}

export const statusLabel: Record<Status, string> = {
  pass: 'תקין',
  warn: 'לבדוק',
  fail: 'בעיה',
  info: 'לידיעה',
}

export const targetErrorText: Record<TargetError, string> = {
  empty: 'הקלידו כתובת של אתר, למשל example.co.il.',
  'too-long': 'הכתובת ארוכה מדי.',
  scheme: 'אפשר לבדוק רק כתובת של אתר, שמתחילה ב-http או ב-https.',
  credentials: 'הסירו מהכתובת את שם המשתמש והסיסמה.',
  port: 'אפשר לבדוק רק אתר שעובד בפורט הרגיל, 80 או 443.',
  ip: 'הקלידו שם של אתר, לא כתובת IP.',
  host: 'זו לא נראית כתובת של אתר ציבורי. בדקו שיש בה סיומת כמו .co.il או .com.',
  invalid: 'זו לא כתובת תקינה. הקלידו למשל example.co.il.',
}

export const serverErrorText: Record<ServerError, string> = {
  dns: 'לא מצאנו את הדומיין הזה ב-DNS. בדקו שהכתובת נכונה.',
  'private-address': 'הדומיין מפנה לכתובת פנימית או שמורה ולא לאתר ציבורי, ולכן הכלי לא בודק אותו.',
  'rate-limited': `אפשר להריץ עד ${RATE_LIMIT} בדיקות ב-10 דקות.`,
  busy: 'יש כרגע הרבה בדיקות במקביל. נסו שוב בעוד דקה.',
  'bad-request': 'הבקשה לא הגיעה כמו שצריך. רעננו את הדף ונסו שוב.',
  forbidden: 'הבקשה נחסמה. רעננו את הדף ונסו שוב.',
  internal: 'משהו השתבש אצלנו בזמן הבדיקה. נסו שוב בעוד רגע.',
}

const IPV4_PATTERN = /^(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}$/
const LABEL_PATTERN = /^[a-z0-9_](?:[a-z0-9_-]{0,61}[a-z0-9_])?$/
const TLD_PATTERN = /^(?:[a-z]{2,63}|xn--[a-z0-9-]{1,59})$/
const BLOCKED_SUFFIXES = new Set([
  'localhost',
  'local',
  'localdomain',
  'internal',
  'intranet',
  'private',
  'lan',
  'home',
  'corp',
  'test',
  'invalid',
  'example',
  'onion',
  'arpa',
])

export function parseTarget(input: string): Target {
  const raw = input.trim()
  if (!raw) return { ok: false, error: 'empty' }
  if (raw.length > MAX_INPUT_LENGTH) return { ok: false, error: 'too-long' }
  const hasScheme = /^[a-z][a-z0-9+.-]*:\/\//i.test(raw)
  const authority = raw.slice(0, raw.search(/[/?#]|$/))
  if (!hasScheme && /^[a-z][a-z0-9+.-]*:(?!\d)/i.test(raw) && !authority.includes('@')) {
    return { ok: false, error: 'scheme' }
  }
  let url: URL
  try {
    url = new URL(hasScheme ? raw : `https://${raw}`)
  } catch {
    return { ok: false, error: 'invalid' }
  }
  return validateUrl(url)
}

export function validateUrl(url: URL): Target {
  if (url.protocol !== 'http:' && url.protocol !== 'https:') return { ok: false, error: 'scheme' }
  if (url.username || url.password) return { ok: false, error: 'credentials' }
  if (url.port && url.port !== '80' && url.port !== '443') return { ok: false, error: 'port' }
  const host = url.hostname.toLowerCase().replace(/\.$/, '')
  if (host.startsWith('[') || host.includes(':') || IPV4_PATTERN.test(host)) return { ok: false, error: 'ip' }
  if (!isPublicHostname(host)) return { ok: false, error: 'host' }
  const port = url.port ? `:${url.port}` : ''
  return { ok: true, url: `${url.protocol}//${host}${port}/`, host }
}

export function isPublicHostname(host: string) {
  if (!host || host.length > 253) return false
  const labels = host.split('.')
  if (labels.length < 2) return false
  if (!labels.every((label) => LABEL_PATTERN.test(label))) return false
  const tld = labels[labels.length - 1]
  if (!TLD_PATTERN.test(tld)) return false
  return !BLOCKED_SUFFIXES.has(tld)
}

export function parseIpv4(text: string): number[] | null {
  if (!IPV4_PATTERN.test(text)) return null
  return text.split('.').map(Number)
}

export function parseIpv6(text: string): number[] | null {
  if (!text || text.includes('%') || text.length > 45) return null
  let source = text.toLowerCase()
  const tail: number[] = []
  const lastColon = source.lastIndexOf(':')
  if (source.includes('.')) {
    if (lastColon < 0) return null
    const v4 = parseIpv4(source.slice(lastColon + 1))
    if (!v4) return null
    tail.push((v4[0] << 8) | v4[1], (v4[2] << 8) | v4[3])
    source = source.slice(0, lastColon + 1)
    if (!source.endsWith('::')) source = source.slice(0, -1)
  }
  const doubleColon = source.indexOf('::')
  if (doubleColon !== source.lastIndexOf('::')) return null
  const parseSide = (side: string) => {
    if (!side) return []
    const parts = side.split(':')
    const values: number[] = []
    for (const part of parts) {
      if (!/^[0-9a-f]{1,4}$/.test(part)) return null
      values.push(parseInt(part, 16))
    }
    return values
  }
  const room = 8 - tail.length
  if (doubleColon < 0) {
    const head = parseSide(source)
    if (!head || head.length !== room) return null
    return [...head, ...tail]
  }
  const head = parseSide(source.slice(0, doubleColon))
  const rest = parseSide(source.slice(doubleColon + 2))
  if (!head || !rest || head.length + rest.length > room - 1) return null
  const zeros = new Array(room - head.length - rest.length).fill(0)
  return [...head, ...zeros, ...rest, ...tail]
}

const BLOCKED_V4: [number, number, number, number, number][] = [
  [0, 0, 0, 0, 8],
  [10, 0, 0, 0, 8],
  [100, 64, 0, 0, 10],
  [127, 0, 0, 0, 8],
  [169, 254, 0, 0, 16],
  [172, 16, 0, 0, 12],
  [192, 0, 0, 0, 24],
  [192, 0, 2, 0, 24],
  [192, 88, 99, 0, 24],
  [192, 168, 0, 0, 16],
  [198, 18, 0, 0, 15],
  [198, 51, 100, 0, 24],
  [203, 0, 113, 0, 24],
  [224, 0, 0, 0, 4],
  [240, 0, 0, 0, 4],
]

const v4ToInt = (octets: number[]) => ((octets[0] << 24) | (octets[1] << 16) | (octets[2] << 8) | octets[3]) >>> 0

const inV4Range = (value: number, range: [number, number, number, number, number]) => {
  const bits = range[4]
  const mask = bits === 0 ? 0 : (0xffffffff << (32 - bits)) >>> 0
  return ((value & mask) >>> 0) === ((v4ToInt(range.slice(0, 4)) & mask) >>> 0)
}

export function isPublicIpv4(octets: number[]) {
  const value = v4ToInt(octets)
  return !BLOCKED_V4.some((range) => inV4Range(value, range))
}

export function isPublicIpv6(hextets: number[]) {
  const [h0, h1, h2, h3, h4, h5, h6, h7] = hextets
  const embedded = () => [h6 >> 8, h6 & 0xff, h7 >> 8, h7 & 0xff]
  if (h0 === 0 && h1 === 0 && h2 === 0 && h3 === 0 && h4 === 0 && h5 === 0xffff) return isPublicIpv4(embedded())
  if (h0 === 0x64 && h1 === 0xff9b && h2 === 0 && h3 === 0 && h4 === 0 && h5 === 0) return isPublicIpv4(embedded())
  if ((h0 & 0xe000) !== 0x2000) return false
  if (h0 === 0x2001 && h1 < 0x0200) return false
  if (h0 === 0x2001 && h1 === 0x0db8) return false
  if (h0 === 0x2002) return false
  if (h0 === 0x3fff && h1 < 0x1000) return false
  return true
}

export function isPublicAddress(address: string) {
  const v4 = parseIpv4(address)
  if (v4) return isPublicIpv4(v4)
  const v6 = parseIpv6(address.replace(/^\[|\]$/g, ''))
  if (v6) return isPublicIpv6(v6)
  return false
}

const asciiLower = (text: string) => text.replace(/[A-Z]+/g, (match) => match.toLowerCase())

const agentToken = (value: string) => {
  const trimmed = value.trim()
  if (trimmed.startsWith('*')) return '*'
  const match = /^[A-Za-z_-]+/.exec(trimmed)
  return (match ? match[0] : trimmed).toLowerCase()
}

const robotsKey = (raw: string) => {
  const key = raw.trim().toLowerCase().replace(/[\s_]+/g, '-')
  if (key === 'user-agent' || key === 'useragent') return 'user-agent'
  if (key === 'disallow' || key === 'dissallow' || key === 'dissalow' || key === 'disalow') return 'disallow'
  if (key === 'allow') return 'allow'
  if (key === 'sitemap' || key === 'site-map') return 'sitemap'
  if (key === 'content-signal') return 'content-signal'
  return 'other'
}

const normalizePattern = (value: string) => (value.startsWith('/') || value.startsWith('*') ? value : `/${value}`)

export function parseRobots(text: string): ParsedRobots {
  const groups: RobotsGroup[] = []
  const sitemaps: string[] = []
  const contentSignals: string[] = []
  let current: RobotsGroup | null = null
  let collectingAgents = false
  const source = text.slice(0, ROBOTS_PARSE_LIMIT).replace(/^﻿/, '')
  const managed = /BEGIN Cloudflare Managed content/i.test(source)
  for (const rawLine of source.split(/\r\n|\r|\n/)) {
    const hash = rawLine.indexOf('#')
    const line = (hash < 0 ? rawLine : rawLine.slice(0, hash)).trim()
    const colon = line.indexOf(':')
    if (colon < 1) continue
    const key = robotsKey(line.slice(0, colon))
    const value = line.slice(colon + 1).trim()
    if (key === 'user-agent') {
      if (!current || !collectingAgents) {
        current = { agents: [], rules: [] }
        groups.push(current)
        collectingAgents = true
      }
      current.agents.push(agentToken(value))
    } else if (key === 'allow' || key === 'disallow') {
      if (!current) continue
      collectingAgents = false
      if (value) current.rules.push({ allow: key === 'allow', pattern: normalizePattern(value) })
    } else if (key === 'sitemap') {
      if (value && sitemaps.length < 20) sitemaps.push(value)
    } else if (key === 'content-signal') {
      if (value && contentSignals.length < 10) contentSignals.push(value)
    }
  }
  return { groups, sitemaps, contentSignals, managed }
}

export function patternMatches(pattern: string, path: string) {
  const anchored = pattern.endsWith('$')
  const body = anchored ? pattern.slice(0, -1) : pattern
  const parts = body.split('*')
  if (!path.startsWith(parts[0])) return false
  let position = parts[0].length
  for (let index = 1; index < parts.length; index += 1) {
    const part = parts[index]
    if (anchored && index === parts.length - 1) {
      return path.length - part.length >= position && path.endsWith(part)
    }
    const found = path.indexOf(part, position)
    if (found < 0) return false
    position = found + part.length
  }
  return anchored ? position === path.length : true
}

const encoder = new TextEncoder()
const octets = (text: string) => encoder.encode(text).length

export function rulesFor(robots: ParsedRobots, token: string): { via: RobotsVerdict['via']; rules: RobotsRule[] } {
  const wanted = token.toLowerCase()
  const specific = robots.groups.filter((group) => group.agents.includes(wanted))
  if (specific.length) return { via: 'agent', rules: specific.flatMap((group) => group.rules) }
  const star = robots.groups.filter((group) => group.agents.includes('*'))
  if (star.length) return { via: 'star', rules: star.flatMap((group) => group.rules) }
  return { via: 'none', rules: [] }
}

export function evaluateRobots(robots: ParsedRobots, token: string, path = '/'): RobotsVerdict {
  const { via, rules } = rulesFor(robots, token)
  let best: RobotsRule | null = null
  let bestLength = -1
  for (const rule of rules) {
    if (!patternMatches(rule.pattern, path)) continue
    const length = octets(rule.pattern)
    if (length > bestLength || (length === bestLength && rule.allow && best && !best.allow)) {
      best = rule
      bestLength = length
    }
  }
  return { allowed: best ? best.allow : true, via, rule: best }
}

const ruleText = (rule: RobotsRule) => `${rule.allow ? 'Allow' : 'Disallow'}: ${rule.pattern}`

export function crawlerVerdicts(robots: ParsedRobots): CrawlerVerdict[] {
  return crawlers.map((crawler) => {
    const verdict = evaluateRobots(robots, crawler.token)
    return {
      token: crawler.token,
      allowed: verdict.allowed,
      via: verdict.via,
      rule: verdict.rule ? ruleText(verdict.rule) : null,
    }
  })
}

const looksLikeHtml = (text: string) => /^\s*<(?:!doctype|html|head|body|meta|script|div)/i.test(text.slice(0, 1024))

export function robotsFacts(outcome: FetchOutcome, status: number | null, text: string): RobotsFacts {
  const empty: RobotsFacts = {
    outcome,
    status,
    kind: 'error',
    groups: 0,
    verdicts: [],
    starRules: [],
    sitemaps: [],
    managed: false,
    contentSignals: [],
  }
  if (outcome !== 'ok' || status === null) return empty
  if (status === 429 || status >= 500) return empty
  if (status >= 400) {
    const verdicts = crawlerVerdicts({ groups: [], sitemaps: [], contentSignals: [], managed: false })
    return { ...empty, kind: status === 401 || status === 403 ? 'forbidden' : 'missing', verdicts }
  }
  if (status < 200 || status >= 300) return empty
  const parsed = parseRobots(looksLikeHtml(text) ? '' : text)
  return {
    outcome,
    status,
    kind: looksLikeHtml(text) ? 'html' : 'rules',
    groups: parsed.groups.length,
    verdicts: crawlerVerdicts(parsed),
    starRules: rulesFor(parsed, '*').rules.slice(0, 40),
    sitemaps: parsed.sitemaps.slice(0, 10),
    managed: parsed.managed,
    contentSignals: parsed.contentSignals.slice(0, 5),
  }
}

const NAMED_ENTITIES: Record<string, string> = {
  amp: '&',
  lt: '<',
  gt: '>',
  quot: '"',
  apos: "'",
  nbsp: ' ',
  ndash: '–',
  mdash: '—',
  hellip: '…',
}

export const decodeEntities = (text: string) =>
  text.replace(/&(#x[0-9a-f]{1,6}|#\d{1,7}|[a-z]{2,8});/gi, (whole, entity: string) => {
    if (entity[0] === '#') {
      const code = entity[1] === 'x' || entity[1] === 'X' ? parseInt(entity.slice(2), 16) : parseInt(entity.slice(1), 10)
      return code > 0 && code <= 0x10ffff ? String.fromCodePoint(code) : whole
    }
    return NAMED_ENTITIES[entity.toLowerCase()] ?? whole
  })

const clean = (text: string, max: number) => decodeEntities(text).replace(/\s+/g, ' ').trim().slice(0, max)

const ATTRIBUTE = /([^\s"'<>/=]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>`]+)))?/g
const MAX_TAG_ATTRIBUTES = 2048

export function attributesOf(source: string) {
  const attributes: Record<string, string> = {}
  const text = source.slice(0, MAX_TAG_ATTRIBUTES)
  ATTRIBUTE.lastIndex = 0
  let match = ATTRIBUTE.exec(text)
  while (match) {
    const name = match[1].toLowerCase()
    if (!(name in attributes)) attributes[name] = match[2] ?? match[3] ?? match[4] ?? ''
    match = ATTRIBUTE.exec(text)
  }
  return attributes
}

const SKIPPED_ELEMENTS = new Set(['style', 'noscript', 'template', 'svg', 'iframe', 'object', 'textarea', 'math'])
const TAG_NAME = /^<(\/?)([a-z][a-z0-9:-]*)/
const SHELL_MARKERS = [
  '<div id="root"></div>',
  '<div id="app"></div>',
  '<div id="__nuxt"></div>',
  '<app-root></app-root>',
  'you need to enable javascript to run this app',
]
const MAX_JSON_LD_BLOCKS = 20
const MAX_JSON_LD_LENGTH = 256 * 1024
const ROBOTS_META_NAMES = new Set(['robots', 'googlebot', 'bingbot', 'msnbot', ...crawlers.map((c) => c.token.toLowerCase())])

const typeName = (value: string) => {
  const trimmed = value.trim()
  const slash = Math.max(trimmed.lastIndexOf('/'), trimmed.lastIndexOf(':'), trimmed.lastIndexOf('#'))
  return slash >= 0 ? trimmed.slice(slash + 1) : trimmed
}

export function jsonLdTypes(data: unknown, found: Set<string>, budget = { nodes: 5000 }, depth = 0) {
  if (depth > 12 || budget.nodes <= 0 || data === null || typeof data !== 'object') return found
  budget.nodes -= 1
  if (Array.isArray(data)) {
    for (const item of data) jsonLdTypes(item, found, budget, depth + 1)
    return found
  }
  const record = data as Record<string, unknown>
  const type = record['@type']
  const types = Array.isArray(type) ? type : [type]
  for (const item of types) {
    if (typeof item === 'string' && item.trim() && found.size < 40) found.add(typeName(item).slice(0, 60))
  }
  for (const value of Object.values(record)) {
    if (value && typeof value === 'object') jsonLdTypes(value, found, budget, depth + 1)
  }
  return found
}

const countWords = (text: string) => {
  let words = 0
  for (const token of decodeEntities(text).split(/\s+/)) {
    if (/[\p{L}\p{N}]/u.test(token)) words += 1
  }
  return words
}

export function analyzeHtml(html: string): HtmlFacts {
  const lower = asciiLower(html)
  const text: string[] = []
  const metaRobots: MetaRobots[] = []
  const types = new Set<string>()
  let title = ''
  let description = ''
  let lang = ''
  let dir = ''
  let jsonLdBlocks = 0
  let jsonLdInvalid = 0
  let microdata = false
  let scripts = 0
  let inHead = false
  let index = 0
  while (index < html.length) {
    const open = html.indexOf('<', index)
    const stop = open < 0 ? html.length : open
    if (!inHead && stop > index) text.push(html.slice(index, stop))
    if (open < 0) break
    if (lower.startsWith('<!--', open)) {
      const close = lower.indexOf('-->', open + 4)
      index = close < 0 ? html.length : close + 3
      continue
    }
    const next = html[open + 1]
    if (next === '!' || next === '?') {
      const close = html.indexOf('>', open)
      index = close < 0 ? html.length : close + 1
      continue
    }
    const name = TAG_NAME.exec(lower.slice(open, open + 64))
    if (!name) {
      if (!inHead) text.push('<')
      index = open + 1
      continue
    }
    const end = html.indexOf('>', open)
    if (end < 0) break
    index = end + 1
    const tag = name[2]
    if (name[1] === '/') {
      if (tag === 'head') inHead = false
      continue
    }
    const rawAttributes = html.slice(open + name[0].length, end)
    if (!microdata && rawAttributes.length < 4096 && lower.slice(open, end).includes('itemtype')) microdata = true
    if (tag === 'head') inHead = true
    else if (tag === 'body') inHead = false
    else if (tag === 'html') {
      const attributes = attributesOf(rawAttributes)
      lang = lang || clean(attributes.lang ?? '', 40)
      dir = dir || clean(attributes.dir ?? '', 10)
    } else if (tag === 'meta') {
      const attributes = attributesOf(rawAttributes)
      const metaName = (attributes.name ?? '').toLowerCase().trim()
      if (metaName === 'description' && !description) description = clean(attributes.content ?? '', 400)
      if (ROBOTS_META_NAMES.has(metaName) && metaRobots.length < 10) {
        metaRobots.push({ name: metaName, content: clean(attributes.content ?? '', 200) })
      }
    } else if (tag === 'title') {
      const close = lower.indexOf('</title', index)
      if (!title) title = clean(html.slice(index, close < 0 ? Math.min(html.length, index + 400) : close), 300)
      if (close >= 0) index = close
    } else if (tag === 'script') {
      scripts += 1
      const close = lower.indexOf('</script', index)
      const content = html.slice(index, close < 0 ? html.length : close)
      const type = (attributesOf(rawAttributes).type ?? '').toLowerCase()
      if (type.includes('ld+json') && jsonLdBlocks < MAX_JSON_LD_BLOCKS) {
        jsonLdBlocks += 1
        try {
          if (content.length > MAX_JSON_LD_LENGTH) throw new Error('too long')
          jsonLdTypes(JSON.parse(content.trim()), types)
        } catch {
          jsonLdInvalid += 1
        }
      }
      index = close < 0 ? html.length : close
    } else if (SKIPPED_ELEMENTS.has(tag)) {
      const close = lower.indexOf(`</${tag}`, index)
      index = close < 0 ? html.length : close
    }
  }
  return {
    title,
    description,
    lang,
    dir,
    metaRobots,
    jsonLdTypes: [...types],
    jsonLdBlocks,
    jsonLdInvalid,
    microdata,
    words: countWords(text.join(' ')),
    scripts,
    shell: SHELL_MARKERS.some((marker) => lower.includes(marker)),
  }
}

const DIRECTIVES_WITH_VALUE = new Set(['max-snippet', 'max-image-preview', 'max-video-preview', 'unavailable_after'])

export type Directive = { scope: string; name: string; value: string }

export function parseDirectives(content: string, scope = '*'): Directive[] {
  const directives: Directive[] = []
  let current = scope
  for (const piece of content.split(',')) {
    const token = piece.trim()
    if (!token) continue
    const colon = token.indexOf(':')
    let name = token.toLowerCase()
    let value = ''
    if (colon > 0) {
      const head = token.slice(0, colon).trim().toLowerCase()
      const rest = token.slice(colon + 1).trim()
      if (DIRECTIVES_WITH_VALUE.has(head)) {
        name = head
        value = rest
      } else {
        current = head
        const inner = rest.split(':')
        name = inner[0].trim().toLowerCase()
        value = inner.slice(1).join(':').trim()
      }
    }
    if (name && directives.length < 40) directives.push({ scope: current, name, value })
  }
  return directives
}

export function collectDirectives(headerRobots: string[], metaRobots: MetaRobots[]) {
  const fromHeader = headerRobots.flatMap((value) => parseDirectives(value).map((d) => ({ ...d, source: 'header' as const })))
  const fromMeta = metaRobots.flatMap((meta) =>
    parseDirectives(meta.content, meta.name === 'robots' ? '*' : meta.name).map((d) => ({ ...d, source: 'meta' as const })),
  )
  return [...fromHeader, ...fromMeta].filter((d) => ROBOTS_META_NAMES.has(d.scope) || d.scope === '*')
}

const WALL_BODY = {
  cloudflareChallenge: ['/cdn-cgi/challenge-platform', 'cf-chl-', 'cf_chl_', '<title>just a moment...</title>'],
  cloudflareBlock: ['cf-error-details', 'sorry, you have been blocked', 'attention required! | cloudflare'],
  imperva: ['_incapsula_resource', 'incapsula incident'],
  perimeterx: ['px-captcha', '_pxappid'],
  akamai: ['access denied', 'reference #'],
}

const has = (text: string, needles: string[]) => needles.some((needle) => text.includes(needle))

export function detectCdn(headers: Record<string, string>) {
  const server = (headers.server ?? '').toLowerCase()
  if (server.includes('cloudflare') || headers['cf-ray']) return 'Cloudflare'
  if (headers['x-vercel-id'] || server === 'vercel') return 'Vercel'
  if (headers['x-amz-cf-id']) return 'Amazon CloudFront'
  if (server.includes('akamai')) return 'Akamai'
  if (headers['x-sucuri-id'] || server.includes('sucuri')) return 'Sucuri'
  if (headers['x-fastly-request-id']) return 'Fastly'
  return null
}

export function detectWall(status: number, headers: Record<string, string>, body: string): Wall | null {
  const server = (headers.server ?? '').toLowerCase()
  const text = asciiLower(body.slice(0, 64 * 1024))
  const mitigated = (headers['cf-mitigated'] ?? '').toLowerCase()
  if (mitigated === 'challenge') return { vendor: 'Cloudflare', kind: 'challenge' }
  const cloudflare = server.includes('cloudflare') || Boolean(headers['cf-ray'])
  if (cloudflare && status >= 400 && has(text, WALL_BODY.cloudflareChallenge)) return { vendor: 'Cloudflare', kind: 'challenge' }
  if (cloudflare && status >= 400 && has(text, WALL_BODY.cloudflareBlock)) return { vendor: 'Cloudflare', kind: 'block' }
  if ((headers['x-vercel-mitigated'] ?? '').toLowerCase() === 'challenge') return { vendor: 'Vercel', kind: 'challenge' }
  const waf = (headers['x-amzn-waf-action'] ?? '').toLowerCase()
  if (waf) return { vendor: 'AWS WAF', kind: waf === 'block' ? 'block' : 'challenge' }
  if (headers['x-datadome'] || server.includes('datadome')) {
    if (status >= 400) return { vendor: 'DataDome', kind: 'challenge' }
  }
  const interstitial = status >= 400 || body.length < 8000
  if (interstitial && has(text, WALL_BODY.imperva)) return { vendor: 'Imperva', kind: 'challenge' }
  if (interstitial && has(text, WALL_BODY.perimeterx)) return { vendor: 'HUMAN (PerimeterX)', kind: 'challenge' }
  if ((headers['x-sucuri-id'] || server.includes('sucuri')) && status === 403) return { vendor: 'Sucuri', kind: 'block' }
  if (server.includes('akamaighost') && status === 403 && has(text, WALL_BODY.akamai)) return { vendor: 'Akamai', kind: 'block' }
  return null
}

export function sitemapKind(contentType: string, text: string): SitemapFacts['kind'] {
  const start = asciiLower(text.slice(0, 4096))
  if (start.includes('<urlset')) return 'urlset'
  if (start.includes('<sitemapindex')) return 'sitemapindex'
  if (/gzip/i.test(contentType) || text.startsWith('\u001f\u008b')) return 'gzip'
  return 'other'
}

const isBlockingStatus = (status: number | null) => status === 401 || status === 403 || status === 406 || status === 429

const statusBlurb = (status: number | null) => (status === null ? 'בלי תשובה' : `קוד ${status}`)

const urlPart = (url: string, part: 'host' | 'pathname') => {
  try {
    return new URL(url)[part]
  } catch {
    return url
  }
}

function accessItems(facts: SiteFacts): ReportItem[] {
  const { home, probe } = facts
  const items: ReportItem[] = []
  const fetchFailures: Partial<Record<FetchOutcome, ReportItem>> = {
    timeout: {
      id: 'home',
      status: 'fail',
      title: 'דף הבית לא ענה',
      text: 'דף הבית לא ענה בתוך 6 שניות. בוט שלא מקבל תשובה בזמן מוותר על הדף.',
      fix: 'בדקו את זמן התגובה של השרת, ואם יש לכם CDN, שהוא שומר עותק של דף הבית.',
    },
    network: {
      id: 'home',
      status: 'fail',
      title: 'לא הצלחנו להתחבר לאתר',
      text: 'החיבור לשרת נכשל או נסגר באמצע. בוטים שנתקלים בזה לא יכולים לקרוא את האתר.',
      fix: 'בדקו שהאתר עולה מרשת אחרת ושהשרת לא חוסם בקשות לפי מדינה או לפי טווח כתובות.',
    },
    tls: {
      id: 'home',
      status: 'fail',
      title: 'תעודת ה-SSL לא תקינה',
      text: 'תעודת ה-HTTPS של האתר פגה, לא מתאימה לדומיין או לא מגיעה עם השרשרת המלאה. בוטים, כמו דפדפנים, לא סומכים על חיבור כזה.',
      fix: 'חדשו את התעודה או התקינו אותה מחדש עם השרשרת המלאה.',
    },
    'redirect-blocked': {
      id: 'home',
      status: 'fail',
      title: 'דף הבית מפנה לכתובת שהכלי לא בודק',
      text: 'אחת ההפניות מובילה לכתובת IP, לפורט לא רגיל, לכתובת שאינה http או https, או לדומיין שמפנה לרשת פנימית.',
      fix: 'הפנו את דף הבית ישר לכתובת הציבורית הסופית שלו.',
    },
    'too-many-redirects': {
      id: 'home',
      status: 'warn',
      title: 'יותר מ-3 הפניות ברצף',
      text: 'הכלי עוצר אחרי 3 הפניות. בוטים מוכנים לעבור יותר, אבל כל הפניה מאטה את הסריקה ומגדילה את הסיכוי לטעות.',
      fix: 'הפנו כל כתובת ישר לכתובת הסופית, בהפניה אחת מסוג 301.',
    },
  }
  if (home.outcome !== 'ok' || home.status === null) {
    items.push(fetchFailures[home.outcome] ?? (fetchFailures.network as ReportItem))
  } else if (home.wall) {
    const name = home.wall.vendor
    items.push({
      id: 'home',
      status: 'warn',
      title: home.wall.kind === 'challenge' ? `דף אימות של ${name} במקום דף הבית` : `${name} חסם את הבקשה`,
      text:
        home.wall.kind === 'challenge'
          ? `הבקשה שלנו קיבלה דף אימות שדורש להריץ JavaScript (${statusBlurb(home.status)}). בוטים של AI לא מריצים JavaScript, ולכן בוט ש-${name} לא מכיר כבוט מאומת ייתקע בדף הזה. Googlebot ו-Bingbot בדרך כלל עוברים.`
          : `${name} החזיר דף חסימה (${statusBlurb(home.status)}) לבקשה שמזדהה ככלי בדיקה. ייתכן שאותו חוק חוסם גם בוטים של AI.`,
      fix:
        name === 'Cloudflare'
          ? 'בדשבורד של Cloudflare בדקו את הגדרות הבוטים (Bot Fight Mode, AI bot policies) ואם מצב Under Attack פעיל לכל האתר.'
          : `בדקו בהגדרות של ${name} אילו בוטים מורשים להיכנס.`,
    })
  } else if (isBlockingStatus(home.status)) {
    items.push({
      id: 'home',
      status: 'warn',
      title: `השרת סירב לבקשה (${home.status})`,
      text: 'דף הבית מחזיר שגיאת הרשאה לבקשה שמזדהה ככלי בדיקה ולא כדפדפן. הרבה חומות אש עושות את זה, ואז גם בוטים של AI מקבלים את אותה שגיאה, אלא אם הם ברשימת ההיתרים.',
      fix: 'בדקו בחומת האש או בתוסף האבטחה של האתר אם יש חסימה לפי User-Agent, ושהבוטים מהרשימה למטה מורשים.',
    })
  } else if (home.status < 200 || home.status >= 300) {
    items.push({
      id: 'home',
      status: 'fail',
      title: `דף הבית מחזיר שגיאה ${home.status}`,
      text: 'בוטים לא יכולים לקרוא דף שמחזיר שגיאה, וגוגל מוציא מהאינדקס דפים שמחזירים שגיאה לאורך זמן.',
      fix: 'תקנו את השגיאה כך שדף הבית יחזיר 200.',
    })
  } else {
    items.push({
      id: 'home',
      status: 'pass',
      title: 'דף הבית נטען',
      text: `דף הבית החזיר ${home.status} לבקשה רגילה, בלי דף אימות ובלי חסימה.${home.truncated ? ' הדף גדול מ-1MB, ובדקנו רק את המגה הראשון שלו.' : ''}`,
    })
  }

  if (probe && home.outcome === 'ok' && !home.wall && home.status !== null && home.status < 300) {
    const blocked = Boolean(probe.wall) || isBlockingStatus(probe.status) || (probe.status ?? 0) >= 500
    if (probe.outcome === 'ok' && blocked) {
      items.push({
        id: 'probe',
        status: 'fail',
        title: 'בקשה שמזדהה כ-GPTBot נחסמה',
        text: `שלחנו לדף הבית בקשה נוספת שבה מופיעה המילה GPTBot ב-User-Agent, והיא קיבלה ${probe.wall ? `דף ${probe.wall.kind === 'challenge' ? 'אימות' : 'חסימה'} של ${probe.wall.vendor}` : statusBlurb(probe.status)}, בזמן שהבקשה הרגילה קיבלה 200. כנראה שחוק בחומת האש או ב-CDN חוסם בוטים של AI לפי השם שלהם, בלי קשר ל-robots.txt.`,
        fix: 'ב-Cloudflare זו בדרך כלל ההגדרה AI bot policies, או המתג הישן Block AI bots, תחת Security Settings. בחומות אש אחרות חפשו חוק שחוסם לפי User-Agent.',
      })
    } else if (probe.outcome === 'ok') {
      items.push({
        id: 'probe',
        status: 'pass',
        title: 'לא מצאנו חסימה לפי שם הבוט',
        text: 'בקשה נוספת שבה מופיעה המילה GPTBot ב-User-Agent קיבלה את אותו דף. זה לא מבטיח ש-GPTBot האמיתי עובר: Cloudflare ושירותים דומים מזהים בוטים אמיתיים לפי כתובת IP וחתימה, ואת זה אפשר לראות רק בדשבורד שלהם.',
      })
    }
  }

  if (home.cdn === 'Cloudflare') {
    items.push({
      id: 'cdn',
      status: 'info',
      title: 'האתר מאחורי Cloudflare',
      text: 'ב-Cloudflare אפשר לחסום בוטים של AI ברמת הרשת, גם כש-robots.txt מתיר להם להיכנס. מיולי 2025 Cloudflare שואלת כל דומיין חדש אם לאפשר בוטים של AI, וברירת המחדל היא חסימה. המתג הישן Block AI bots מוחלף בהגדרה AI bot policies, עם החלטה נפרדת לחיפוש, לסוכנים ולאימון.',
      fix: 'בדשבורד: Security Settings, ואז Configure AI bot policies (או Block AI bots אם עדיין מופיע). ודאו ש-Search מוגדר ל-Allow.',
    })
  }
  return items
}

function robotsItems(facts: SiteFacts): ReportItem[] {
  const { robots } = facts
  const items: ReportItem[] = []
  if (robots.outcome === 'too-many-redirects' || robots.outcome === 'redirect-blocked') {
    items.push({
      id: 'robots-file',
      status: 'warn',
      title: 'robots.txt מפנה לכתובת אחרת',
      text:
        robots.outcome === 'too-many-redirects'
          ? 'הכתובת /robots.txt עוברת יותר מ-3 הפניות, והכלי עוצר שם. לפי התקן בוטים עוקבים אחרי לפחות 5 הפניות, כך שכנראה הם מגיעים לקובץ, אבל לא יכולנו לבדוק את הכללים שלו.'
          : 'הכתובת /robots.txt מפנה לכתובת IP, לפורט לא רגיל או לרשת פנימית, ולכן הכלי לא פתח אותה ולא בדק את הכללים.',
      fix: 'הגישו את robots.txt ישירות בשורש הדומיין הסופי, בלי הפניות.',
    })
    return items
  }
  if (robots.outcome !== 'ok') {
    items.push({
      id: 'robots-file',
      status: 'fail',
      title: 'לא הצלחנו לקרוא את robots.txt',
      text: `${robots.outcome === 'timeout' ? 'הקובץ לא נטען בתוך 6 שניות.' : 'החיבור לקובץ נכשל.'} לפי התקן של robots.txt (RFC 9309), בוט שלא מצליח לקרוא את הקובץ בגלל תקלת רשת או שרת צריך להניח שכל האתר חסום.`,
      fix: 'ודאו ש-/robots.txt נטען מהר ומחזיר 200 עם קובץ טקסט, או 404 אם אין לכם קובץ.',
    })
    return items
  }
  if (robots.kind === 'error') {
    items.push({
      id: 'robots-file',
      status: 'fail',
      title: `robots.txt מחזיר שגיאה ${robots.status}`,
      text: 'לפי התקן של robots.txt (RFC 9309), כשהקובץ לא זמין בגלל שגיאת שרת, בוטים צריכים להניח שכל האתר חסום. גוגל עוצרת סריקה במצב כזה.',
      fix: 'תקנו את השגיאה כך ש-/robots.txt יחזיר 200 עם קובץ טקסט, או 404 אם אין לכם קובץ.',
    })
    return items
  }
  if (robots.kind === 'missing') {
    items.push({
      id: 'robots-file',
      status: 'pass',
      title: 'אין robots.txt',
      text: `השרת החזיר ${robots.status} לכתובת /robots.txt. לפי התקן, כשאין קובץ כל הבוטים רשאים להיכנס לכל האתר.`,
      fix: 'לא חובה, אבל קובץ עם שורת Sitemap עוזר לבוטים למצוא את כל הדפים.',
    })
  } else if (robots.kind === 'forbidden') {
    items.push({
      id: 'robots-file',
      status: 'warn',
      title: `robots.txt מחזיר ${robots.status}`,
      text: 'לפי התקן, בוטים מתייחסים לזה כאילו אין קובץ ורשאים להיכנס. אבל שגיאת הרשאה על קובץ ציבורי היא בדרך כלל סימן לחומת אש שחוסמת בקשות אוטומטיות, ואז היא חוסמת גם את הדפים עצמם.',
      fix: 'פתחו את /robots.txt לכל בקשה, ובדקו את חוקי חומת האש.',
    })
  } else if (robots.kind === 'html') {
    items.push({
      id: 'robots-file',
      status: 'warn',
      title: 'בכתובת robots.txt חוזר דף HTML',
      text: 'השרת מחזיר דף אינטרנט במקום קובץ טקסט, כנראה דף ברירת מחדל של האתר. בוטים לא ימצאו בו כללים ויתייחסו לאתר כפתוח, אבל גם שורת Sitemap לא תימצא.',
      fix: 'הגישו קובץ robots.txt אמיתי, או החזירו 404 לכתובת הזו.',
    })
  } else {
    items.push({
      id: 'robots-file',
      status: 'pass',
      title: 'robots.txt נקרא',
      text: `הקובץ החזיר 200 ומצאנו בו ${robots.groups === 1 ? 'קבוצת כללים אחת' : `${robots.groups} קבוצות כללים`}. הבדיקה למטה היא לפי התקן RFC 9309: קבוצה לפי שם הבוט, ואם אין כזו, הקבוצה של User-agent: *, והכלל הארוך ביותר שמתאים לדף הבית קובע.`,
    })
  }
  if (robots.managed || robots.contentSignals.length) {
    items.push({
      id: 'robots-managed',
      status: 'warn',
      title: 'Cloudflare מוסיף שורות ל-robots.txt',
      text: `ב-robots.txt יש ${robots.managed ? 'בלוק שמנוהל על ידי Cloudflare' : 'שורת Content-Signal'}. Cloudflare מוסיף אותו כשאחת הקטגוריות ב-AI bot policies מוגדרת לחסימה, ובדרך כלל יחד איתו יש גם חסימה ברמת הרשת, שלא רואים בקובץ.`,
      fix: 'אם אתם רוצים להופיע בתשובות AI, בדקו ב-Cloudflare את AI bot policies ואת ההגדרה של robots.txt המנוהל.',
      code: robots.contentSignals.length ? robots.contentSignals.map((signal) => `Content-Signal: ${signal}`).join('\n') : undefined,
    })
  }
  return items
}

const crawlerStatus = (crawler: Crawler, allowed: boolean): Status => {
  if (crawler.kind === 'training') return 'info'
  if (allowed) return 'pass'
  return crawler.kind === 'search' ? 'fail' : 'warn'
}

const verdictRule = (verdict: CrawlerVerdict, kind: RobotsKind) => {
  if (kind === 'html') return 'הקובץ הוא דף HTML, אין כללים'
  if (kind === 'forbidden') return 'הקובץ החזיר שגיאת הרשאה, אין כללים'
  if (kind !== 'rules') return 'אין קובץ, אין כללים'
  if (verdict.via === 'none') return 'אין בקובץ כללים שחלים עליו'
  const group = verdict.via === 'agent' ? `User-agent: ${verdict.token}` : 'User-agent: *'
  return verdict.rule ? `${group} → ${verdict.rule}` : `${group}, בלי כלל שחל על דף הבית`
}

function crawlerGroups(facts: SiteFacts): CrawlerGroup[] {
  const { robots } = facts
  if (!robots.verdicts.length) return []
  const kinds: CrawlerKind[] = ['search', 'user', 'gemini', 'training']
  return kinds.map((kind) => ({
    kind,
    label: kindInfo[kind].label,
    text: kindInfo[kind].text,
    rows: crawlers
      .filter((crawler) => crawler.kind === kind)
      .map((crawler) => {
        const verdict = robots.verdicts.find((item) => item.token === crawler.token)
        const allowed = verdict ? verdict.allowed : true
        return {
          token: crawler.token,
          vendor: crawler.vendor,
          status: crawlerStatus(crawler, allowed),
          allowed,
          text: allowed ? crawler.role : crawler.ifBlocked,
          rule: verdict ? verdictRule(verdict, robots.kind) : '',
          doc: crawler.doc,
        }
      }),
  }))
}

const scopeText = (scope: string) => {
  if (scope === '*') return 'לכל מנועי החיפוש'
  const crawler = crawlers.find((item) => item.token.toLowerCase() === scope)
  return `ל-${crawler ? crawler.token : scope}`
}

function indexingItems(facts: SiteFacts): ReportItem[] {
  const { home } = facts
  const directives = collectDirectives(home.headerRobots, home.html?.metaRobots ?? [])
  const items: ReportItem[] = []
  const describe = (list: typeof directives) =>
    [...new Set(list.map((d) => `${d.source === 'header' ? 'הכותרת X-Robots-Tag' : 'תגית meta robots'} ${scopeText(d.scope)}`))].join(', ')
  const noindex = directives.filter((d) => d.name === 'noindex' || d.name === 'none')
  if (noindex.length) {
    items.push({
      id: 'noindex',
      status: 'fail',
      title: 'דף הבית מסומן noindex',
      text: `${describe(noindex)} מבקשת לא להכניס את הדף לאינדקס. דף שלא נמצא באינדקס של גוגל לא יכול להופיע גם ב-AI Overviews וב-AI Mode, ו-Bing מתנהג אותו דבר לגבי Copilot.`,
      fix: 'אם זה לא מכוון, הסירו את noindex מתגית meta robots או מהכותרת X-Robots-Tag. זה קורה הרבה אחרי העלאה מאתר בדיקות.',
    })
  } else {
    items.push({
      id: 'noindex',
      status: 'pass',
      title: 'אין noindex',
      text: home.html
        ? 'לא מצאנו noindex בתגית meta robots או בכותרת X-Robots-Tag של דף הבית.'
        : 'לא מצאנו noindex בכותרת X-Robots-Tag. את תגיות ה-meta לא יכולנו לבדוק, כי דף הבית לא נטען.',
    })
  }
  const nosnippet = directives.filter(
    (d) => d.name === 'nosnippet' || (d.name === 'max-snippet' && Number(d.value) === 0 && d.value.trim() !== ''),
  )
  const shortSnippet = directives.filter((d) => {
    const value = Number(d.value)
    return d.name === 'max-snippet' && d.value.trim() !== '' && value > 0 && value < 100
  })
  const bing = directives.filter((d) => d.name === 'noarchive' || d.name === 'nocache')
  if (nosnippet.length) {
    items.push({
      id: 'snippet',
      status: 'fail',
      title: 'nosnippet חוסם ציטוט',
      text: `${describe(nosnippet)} אוסרת להציג טקסט מהדף. לפי גוגל, דף צריך להיות זכאי להצגת קטע טקסט (snippet) כדי להופיע כקישור ב-AI Overviews וב-AI Mode, ו-nosnippet או max-snippet:0 מבטלים את זה.`,
      fix: 'הסירו את nosnippet. כדי להסתיר רק חלק מהדף, עטפו אותו ב-data-nosnippet.',
    })
  } else if (shortSnippet.length) {
    items.push({
      id: 'snippet',
      status: 'warn',
      title: `max-snippet מוגבל ל-${shortSnippet[0].value} תווים`,
      text: 'לפי גוגל, max-snippet מגביל כמה טקסט מהדף אפשר להציג בתוצאות, כולל ב-AI Overviews וב-AI Mode. מגבלה קצרה משאירה מעט מה לצטט.',
      fix: 'הסירו את max-snippet או הגדילו אותו, למשל max-snippet:-1 לבלי הגבלה.',
    })
  } else if (bing.length) {
    items.push({
      id: 'snippet',
      status: 'warn',
      title: bing.some((d) => d.name === 'noarchive') ? 'noarchive מוציא מתשובות Copilot' : 'nocache מגביל את Copilot',
      text: 'לפי Bing, תוכן עם noarchive לא נכלל בתשובות הצ׳אט של Bing (היום Copilot), ועם nocache מוצגים בהן רק הכתובת, הכותרת וקטע קצר.',
      fix: 'אם אתם רוצים שהתוכן יופיע בתשובות של Copilot, הסירו את noarchive ו-nocache.',
    })
  } else {
    items.push({
      id: 'snippet',
      status: 'pass',
      title: 'אין הגבלה על ציטוט',
      text: 'לא מצאנו nosnippet, max-snippet קצר, noarchive או nocache. מנועי חיפוש רשאים להציג ולצטט טקסט מהדף.',
    })
  }
  return items
}

const ORG_TYPES = new Set([
  'Organization',
  'LocalBusiness',
  'Corporation',
  'NGO',
  'ProfessionalService',
  'LegalService',
  'FinancialService',
  'AccountingService',
  'Attorney',
  'Dentist',
  'Physician',
  'MedicalClinic',
  'Restaurant',
  'Hotel',
  'RealEstateAgent',
  'TravelAgency',
  'InsuranceAgency',
  'AutoDealer',
  'HealthAndBeautyBusiness',
  'HomeAndConstructionBusiness',
  'EmploymentAgency',
  'FoodEstablishment',
  'Store',
  'OnlineStore',
  'OnlineBusiness',
])

export const isOrganizationType = (type: string) => ORG_TYPES.has(type) || /(?:Organization|Business|Store)$/.test(type)

function contentItems(facts: SiteFacts): ReportItem[] {
  const html = facts.home.html
  if (!html) {
    return [
      {
        id: 'content',
        status: 'info',
        title: 'לא בדקנו את תוכן הדף',
        text: 'דף הבית לא נטען, ולכן לא יכולנו לבדוק את הטקסט, הכותרת והנתונים המובנים שלו.',
      },
    ]
  }
  const items: ReportItem[] = []
  const shellNote = html.shell ? ' הדף נראה כמו מעטפת של אפליקציית JavaScript שהתוכן שלה נבנה בדפדפן.' : ''
  if (html.words >= WORDS_PASS) {
    items.push({
      id: 'text',
      status: 'pass',
      title: 'הטקסט נמצא ב-HTML',
      text: `ב-HTML של דף הבית יש כ-${html.words.toLocaleString('he-IL')} מילים, עוד לפני שרץ JavaScript. זה מה שבוטים של AI רואים.`,
    })
  } else if (html.words >= WORDS_WARN) {
    items.push({
      id: 'text',
      status: 'warn',
      title: 'מעט טקסט ב-HTML',
      text: `ב-HTML של דף הבית יש רק כ-${html.words} מילים.${shellNote} אם בדפדפן רואים הרבה יותר, כנראה שחלק מהתוכן נטען ב-JavaScript, ורוב הבוטים של AI לא יראו אותו.`,
      fix: 'פתחו את הדף ולחצו Ctrl+U: אם הטקסט של הדף לא מופיע בקוד המקור, צריך רינדור בצד השרת (SSR) או דפים סטטיים.',
    })
  } else {
    items.push({
      id: 'text',
      status: 'fail',
      title: 'כמעט אין טקסט ב-HTML',
      text: `ב-HTML של דף הבית יש ${html.words} מילים בלבד.${shellNote} רוב הבוטים של AI לא מריצים JavaScript, ולכן הם רואים דף כמעט ריק.`,
      fix: 'צריך שהשרת יחזיר את התוכן כ-HTML מוכן: רינדור בצד השרת (SSR), דפים סטטיים או prerendering.',
    })
  }
  const types = html.jsonLdTypes
  const org = types.filter(isOrganizationType)
  const invalidNote = html.jsonLdInvalid
    ? ` ${html.jsonLdInvalid === 1 ? 'בלוק JSON-LD אחד לא תקין' : `${html.jsonLdInvalid} בלוקי JSON-LD לא תקינים`} ולא נקרא.`
    : ''
  if (org.length) {
    items.push({
      id: 'schema',
      status: html.jsonLdInvalid ? 'warn' : 'pass',
      title: `נתונים מובנים: ${org.slice(0, 3).join(', ')}`,
      text: `בדף הבית יש JSON-LD מהסוגים ${types.slice(0, 12).join(', ')}.${invalidNote}`,
      fix: html.jsonLdInvalid ? 'בדקו את הבלוקים ב-Rich Results Test של גוגל או ב-validator.schema.org.' : undefined,
    })
  } else if (types.length) {
    items.push({
      id: 'schema',
      status: 'warn',
      title: 'אין Organization או LocalBusiness',
      text: `יש נתונים מובנים (${types.slice(0, 12).join(', ')}), אבל אין בהם סוג שמתאר את העסק עצמו.${invalidNote}`,
      fix: 'הוסיפו JSON-LD מסוג Organization או LocalBusiness עם שם, לוגו, כתובת, טלפון ו-sameAs לפרופילים הרשמיים.',
    })
  } else {
    items.push({
      id: 'schema',
      status: 'warn',
      title: 'אין נתונים מובנים',
      text: `לא מצאנו JSON-LD בדף הבית${html.microdata ? ', רק microdata' : ''}.${invalidNote} נתונים מובנים לא מכניסים אתר לתשובות AI בעצמם, אבל הם מתארים את העסק בצורה שמכונה קוראת בלי לנחש.`,
      fix: 'הוסיפו JSON-LD מסוג Organization או LocalBusiness עם שם, לוגו, כתובת, טלפון ו-sameAs לפרופילים הרשמיים.',
    })
  }
  const missing = [html.title ? '' : 'כותרת (title)', html.description ? '' : 'תיאור (meta description)'].filter(Boolean)
  items.push(
    missing.length
      ? {
          id: 'title',
          status: 'warn',
          title: `חסר ${missing.join(' ו')}`,
          text: 'הכותרת והתיאור הם הדבר הראשון שמנועי חיפוש ומודלים קוראים כדי להבין במה עוסק הדף.',
          fix: 'הוסיפו לדף הבית title ייחודי ו-meta description של משפט או שניים.',
        }
      : {
          id: 'title',
          status: 'pass',
          title: 'יש כותרת ותיאור',
          text: `הכותרת: ״${html.title}״. התיאור: ${html.description.length} תווים.`,
        },
  )
  const hebrewWithoutRtl = html.lang.toLowerCase().startsWith('he') && html.dir.toLowerCase() !== 'rtl'
  items.push(
    html.lang
      ? {
          id: 'lang',
          status: 'pass',
          title: `שפת הדף מוגדרת: ${html.lang}`,
          text: `בתגית html מוגדר lang="${html.lang}"${html.dir ? ` ו-dir="${html.dir}"` : ''}. כך בוטים יודעים באיזו שפה הטקסט.${hebrewWithoutRtl ? ' אין dir="rtl" על תגית html, אבל ייתכן שהוא מוגדר על אלמנט אחר.' : ''}`,
        }
      : {
          id: 'lang',
          status: 'warn',
          title: 'שפת הדף לא מוגדרת',
          text: 'אין lang בתגית html, ולכן בוט צריך לנחש באיזו שפה הדף.',
          fix: 'לאתר בעברית: <html lang="he" dir="rtl">.',
        },
  )
  return items
}

function fileItems(facts: SiteFacts): ReportItem[] {
  const { sitemap, llms, robots } = facts
  const items: ReportItem[] = []
  const declared = robots.sitemaps.length > 0
  if (sitemap.found) {
    items.push({
      id: 'sitemap',
      status: 'pass',
      title: 'יש מפת אתר',
      text: `מפת האתר נטענה מ-${urlPart(sitemap.url, 'pathname')}${sitemap.source === 'robots' ? ', הכתובת שמופיעה ב-robots.txt' : ''}.${declared ? '' : ' היא לא מוצהרת ב-robots.txt.'}`,
      fix: declared ? undefined : `הוסיפו ל-robots.txt את השורה Sitemap: ${sitemap.url}`,
    })
  } else if (sitemap.offsite) {
    items.push({
      id: 'sitemap',
      status: 'info',
      title: 'מפת האתר בדומיין אחר',
      text: `ב-robots.txt מופיעה מפת אתר ב-${urlPart(sitemap.offsite, 'host')}. הכלי בודק רק את הדומיין שהקלדתם, ולכן לא פתח אותה.`,
    })
  } else {
    items.push({
      id: 'sitemap',
      status: 'warn',
      title: 'לא מצאנו מפת אתר',
      text: `בדקנו את /sitemap.xml${declared ? ' ואת הכתובת שמופיעה ב-robots.txt' : ''}${sitemap.status ? ` וקיבלנו ${sitemap.status}` : ''}. מפת אתר עוזרת לבוטים למצוא דפים חדשים מהר יותר.`,
      fix: 'צרו sitemap.xml והוסיפו ל-robots.txt שורה Sitemap: עם הכתובת המלאה שלה.',
    })
  }
  if (llms.found) {
    items.push({
      id: 'llms',
      status: 'info',
      title: 'נמצא llms.txt',
      text: 'הקובץ קיים. הוא לא מזיק, אבל גוגל אמרה שהיא לא משתמשת בו, ואף מערכת חיפוש AI גדולה לא אישרה שהיא קוראת אותו.',
    })
  } else {
    items.push({
      id: 'llms',
      status: 'info',
      title: llms.html ? 'בכתובת llms.txt חוזר דף HTML' : 'אין llms.txt',
      text: 'זה לא חובה. llms.txt הוא הצעה מ-2024, גוגל אמרה שהיא לא משתמשת בו, ואף מערכת חיפוש AI גדולה לא אישרה שהיא קוראת אותו. חשוב יותר ש-robots.txt, השרת והתוכן יהיו פתוחים לבוטים.',
    })
  }
  return items
}

export function buildReport(facts: SiteFacts): ReportSection[] {
  return [
    { id: 'access', title: 'גישה לאתר', items: accessItems(facts) },
    { id: 'robots', title: 'robots.txt: מי רשאי להיכנס', items: robotsItems(facts), crawlers: crawlerGroups(facts) },
    { id: 'indexing', title: 'אינדוקס וציטוט', items: indexingItems(facts) },
    { id: 'content', title: 'מה בוט רואה בדף הבית', items: contentItems(facts) },
    { id: 'files', title: 'מפת אתר ו-llms.txt', items: fileItems(facts) },
  ]
}

export function countStatuses(sections: ReportSection[]): Counts {
  const counts: Counts = { pass: 0, warn: 0, fail: 0 }
  const add = (status: Status) => {
    if (status !== 'info') counts[status] += 1
  }
  for (const section of sections) {
    section.items.forEach((item) => add(item.status))
    section.crawlers?.forEach((group) => group.rows.forEach((row) => add(row.status)))
  }
  return counts
}

export const AI_SEARCH_AGENTS = ['OAI-SearchBot', 'ChatGPT-User', 'Claude-SearchBot', 'Claude-User', 'PerplexityBot', 'Perplexity-User']

export const TRAINING_AGENTS = [
  'GPTBot',
  'ClaudeBot',
  'Google-Extended',
  'Applebot-Extended',
  'CCBot',
  'meta-externalagent',
  'Bytespider',
]

const isFullBlock = (rule: RobotsRule) => ['/', '/*', '*', '/$'].includes(rule.pattern)

export function buildRobotsSnippet({
  blockTraining,
  starRules = [],
  sitemap = '',
}: {
  blockTraining: boolean
  starRules?: RobotsRule[]
  sitemap?: string
}) {
  const carried = starRules.filter((rule) => !isFullBlock(rule)).slice(0, 30)
  const lines = [
    '# AI search and answer bots',
    ...AI_SEARCH_AGENTS.map((agent) => `User-agent: ${agent}`),
    'Allow: /',
    ...carried.map(ruleText),
  ]
  if (blockTraining) {
    lines.push('', '# AI training crawlers', ...TRAINING_AGENTS.map((agent) => `User-agent: ${agent}`), 'Disallow: /')
  }
  if (sitemap) lines.push('', `Sitemap: ${sitemap}`)
  return { text: lines.join('\n'), carried: carried.length }
}
