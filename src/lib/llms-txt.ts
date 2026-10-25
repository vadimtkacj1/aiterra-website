export type BotKind = 'search' | 'user' | 'training'

export type BotRule = 'allow' | 'block'

export type AiBot = {
  token: string
  vendor: string
  kind: BotKind
  summary: string
  sourceUrl: string
}

export type SiteInfo = {
  name: string
  summary: string
  details: string
  siteUrl: string
  mainPages: string
  optionalPages: string
}

export type PageIssue = { line: number; text: string; reason: string }

export type LlmsResult = { text: string; issues: PageIssue[]; pageCount: number }

export type RobotsOptions = {
  rules: Record<string, BotRule>
  disallowPaths: string
  sitemapUrl: string
}

export type Preset = { id: string; label: string; rules: (bots: AiBot[]) => Record<string, BotRule> }

export const kindLabels: Record<BotKind, { title: string; intro: string }> = {
  search: {
    title: 'חיפוש ואינדוקס',
    intro: 'סורקים שבונים אינדקס כדי להציג ולצטט אתרים בתשובות של מנועי חיפוש ועוזרי AI. חסימה מוציאה אתכם מהתשובות האלה.',
  },
  user: {
    title: 'בקשה של משתמש',
    intro: 'ניגשים לעמוד כשמשתמש מבקש מהעוזר לקרוא אותו. לא סורקים את האתר בצורה אוטומטית.',
  },
  training: {
    title: 'אימון מודלים',
    intro: 'אוספים תוכן כדי לאמן מודלים. חסימה אומרת שהתוכן לא ישמש לאימון, ואינה משפיעה על הופעה בתוצאות חיפוש.',
  },
}

export const bots: AiBot[] = [
  {
    token: 'OAI-SearchBot',
    vendor: 'OpenAI',
    kind: 'search',
    summary: 'מציג אתרים בתוצאות החיפוש של ChatGPT. OpenAI ממליצה לאפשר אותו כדי להופיע בחיפוש של ChatGPT.',
    sourceUrl: 'https://platform.openai.com/docs/bots',
  },
  {
    token: 'GPTBot',
    vendor: 'OpenAI',
    kind: 'training',
    summary: 'אוסף תוכן שעשוי לשמש לאימון מודלי הבסיס של OpenAI. חסימה מסמנת שהתוכן לא ישמש לאימון.',
    sourceUrl: 'https://platform.openai.com/docs/bots',
  },
  {
    token: 'ChatGPT-User',
    vendor: 'OpenAI',
    kind: 'user',
    summary:
      'נכנס לעמוד כשמשתמש ב-ChatGPT או ב-GPT מותאם מבקש זאת. OpenAI מציינת שכללי robots.txt אולי לא יחולו עליו, ושהוא לא קובע הופעה בחיפוש.',
    sourceUrl: 'https://platform.openai.com/docs/bots',
  },
  {
    token: 'ClaudeBot',
    vendor: 'Anthropic',
    kind: 'training',
    summary: 'אוסף תוכן שעשוי לתרום לאימון מודלי Claude. חסימה מסמנת שתוכן עתידי יוחרג ממאגרי האימון.',
    sourceUrl: 'https://support.claude.com/en/articles/8896518-does-anthropic-crawl-data-from-the-web-and-how-can-site-owners-block-the-crawler',
  },
  {
    token: 'Claude-SearchBot',
    vendor: 'Anthropic',
    kind: 'search',
    summary: 'משפר את איכות תוצאות החיפוש של Claude. חסימה מונעת אינדוקס של התוכן ועלולה לפגוע בנראות בתשובות.',
    sourceUrl: 'https://support.claude.com/en/articles/8896518-does-anthropic-crawl-data-from-the-web-and-how-can-site-owners-block-the-crawler',
  },
  {
    token: 'Claude-User',
    vendor: 'Anthropic',
    kind: 'user',
    summary: 'נכנס לאתרים כשמשתמש ב-Claude שואל שאלה. חסימה מונעת שליפה של התוכן בתשובה לשאלה כזו.',
    sourceUrl: 'https://support.claude.com/en/articles/8896518-does-anthropic-crawl-data-from-the-web-and-how-can-site-owners-block-the-crawler',
  },
  {
    token: 'PerplexityBot',
    vendor: 'Perplexity',
    kind: 'search',
    summary: 'מציג ומקשר אתרים בתוצאות החיפוש של Perplexity. לדברי Perplexity הוא לא משמש לאימון מודלי בסיס.',
    sourceUrl: 'https://docs.perplexity.ai/guides/bots',
  },
  {
    token: 'Perplexity-User',
    vendor: 'Perplexity',
    kind: 'user',
    summary: 'נכנס לעמוד כשמשתמש שואל את Perplexity. Perplexity מציינת שהוא בדרך כלל מתעלם מ-robots.txt, כי המשתמש ביקש את הגישה.',
    sourceUrl: 'https://docs.perplexity.ai/guides/bots',
  },
  {
    token: 'Google-Extended',
    vendor: 'Google',
    kind: 'training',
    summary:
      'אות בקרה ב-robots.txt, בלי סורק נפרד. קובע אם תוכן ששאב Googlebot ישמש לאימון מודלי Gemini ולביסוס תשובות באפליקציית Gemini וב-Vertex AI. לפי גוגל הוא לא משפיע על הכללה או דירוג בחיפוש גוגל.',
    sourceUrl: 'https://developers.google.com/crawling/docs/crawlers-fetchers/google-common-crawlers',
  },
  {
    token: 'Applebot-Extended',
    vendor: 'Apple',
    kind: 'training',
    summary:
      'לא סורק עמודים בעצמו. קובע אם התוכן ש-Applebot אסף ישמש לאימון מודלי הבסיס של Apple. עמוד שחוסם אותו יכול להופיע בחיפוש, ב-Siri וב-Spotlight.',
    sourceUrl: 'https://support.apple.com/en-us/119829',
  },
  {
    token: 'CCBot',
    vendor: 'Common Crawl',
    kind: 'training',
    summary:
      'הסורק של Common Crawl, ארגון ללא כוונת רווח שמפרסם ארכיון ציבורי של דפי אינטרנט. הארכיון משמש גם חוקרים וגם מפתחי מודלי שפה.',
    sourceUrl: 'https://commoncrawl.org/ccbot',
  },
  {
    token: 'Bingbot',
    vendor: 'Microsoft',
    kind: 'search',
    summary: 'הסורק של מנוע החיפוש Bing. חסימה מוציאה את האתר מהאינדקס של Bing.',
    sourceUrl: 'https://www.bing.com/webmasters/help/which-crawlers-does-bing-use-8c184ec0',
  },
]

export const presets: Preset[] = [
  {
    id: 'visible',
    label: 'להופיע בחיפוש, לחסום אימון',
    rules: (list) => Object.fromEntries(list.map((bot) => [bot.token, bot.kind === 'training' ? 'block' : 'allow'])),
  },
  {
    id: 'all',
    label: 'לאפשר הכל',
    rules: (list) => Object.fromEntries(list.map((bot) => [bot.token, 'allow'])),
  },
  {
    id: 'none',
    label: 'לחסום הכל',
    rules: (list) => Object.fromEntries(list.map((bot) => [bot.token, 'block'])),
  },
]

export const defaultRules = (): Record<string, BotRule> => presets[0].rules(bots)

export const defaultSite = (): SiteInfo => ({
  name: '',
  summary: '',
  details: '',
  siteUrl: '',
  mainPages: '',
  optionalPages: '',
})

function normalizeBase(raw: string) {
  const text = raw.trim()
  if (!text) return null
  try {
    const url = new URL(/^https?:\/\//i.test(text) ? text : `https://${text}`)
    return url.hostname.includes('.') ? url : null
  } catch {
    return null
  }
}

export const siteOrigin = (raw: string) => normalizeBase(raw)?.origin ?? ''

function resolveUrl(raw: string, base: URL | null) {
  const text = raw.trim()
  if (!text) return null
  try {
    if (/^https?:\/\//i.test(text)) return new URL(text).toString()
    if (base && text.startsWith('/')) return new URL(text, base).toString()
    return null
  } catch {
    return null
  }
}

const titleFromUrl = (url: string) => {
  const parsed = new URL(url)
  const path = parsed.pathname.replace(/\/$/, '')
  return path ? decodeURIComponent(path.split('/').pop() ?? parsed.hostname) : parsed.hostname
}

const cleanInline = (text: string) => text.replace(/\s+/g, ' ').trim()

function parsePages(text: string, base: URL | null, issues: PageIssue[], offset: number) {
  const entries: string[] = []
  text.split('\n').forEach((line, index) => {
    const trimmed = line.trim()
    if (!trimmed) return
    const parts = trimmed.split('|').map(cleanInline)
    const leadingUrl = resolveUrl(parts[0], base)
    const url = leadingUrl ?? resolveUrl(parts[1] ?? '', base)
    if (!url) {
      issues.push({
        line: offset + index + 1,
        text: trimmed,
        reason: 'לא זוהתה כתובת תקינה. כתבו כתובת מלאה שמתחילה ב-https://, או נתיב שמתחיל ב-/ אחרי שהזנתם את כתובת האתר.',
      })
      return
    }
    const title = leadingUrl ? titleFromUrl(url) : parts[0] || titleFromUrl(url)
    const note = parts.slice(leadingUrl ? 1 : 2).filter(Boolean).join(' | ')
    entries.push(note ? `- [${title}](${url}): ${note}` : `- [${title}](${url})`)
  })
  return entries
}

export function buildLlmsTxt(site: SiteInfo): LlmsResult {
  const issues: PageIssue[] = []
  const base = normalizeBase(site.siteUrl)
  const mainLines = site.mainPages.split('\n').length
  const main = parsePages(site.mainPages, base, issues, 0)
  const optional = parsePages(site.optionalPages, base, issues, mainLines)
  const name = cleanInline(site.name)
  const summary = cleanInline(site.summary)
  const details = site.details
    .split('\n')
    .map((line) => line.trim().replace(/^#+\s*/, ''))
    .join('\n')
    .trim()
  const blocks: string[] = [`# ${name || 'שם האתר'}`]
  if (summary) blocks.push(`> ${summary}`)
  if (details) blocks.push(details)
  if (main.length) blocks.push(['## דפים עיקריים', '', ...main].join('\n'))
  if (optional.length) blocks.push(['## Optional', '', ...optional].join('\n'))
  return { text: `${blocks.join('\n\n')}\n`, issues, pageCount: main.length + optional.length }
}

function pathLines(raw: string) {
  return raw
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => (line.startsWith('/') ? line : `/${line}`))
}

export function buildRobotsTxt({ rules, disallowPaths, sitemapUrl }: RobotsOptions): string {
  const paths = pathLines(disallowPaths)
  const groups = bots.map((bot) => {
    const header = `User-agent: ${bot.token}`
    if (rules[bot.token] === 'block') return `${header}\nDisallow: /`
    if (!paths.length) return `${header}\nAllow: /`
    return [header, ...paths.map((path) => `Disallow: ${path}`)].join('\n')
  })
  const sitemap = sitemapUrl.trim()
  const tail = /^https?:\/\//i.test(sitemap) ? [`Sitemap: ${sitemap}`] : []
  return `${[...groups, ...tail].join('\n\n')}\n`
}

export const llmsFileName = 'llms.txt'

export const robotsFileName = 'robots.txt'
