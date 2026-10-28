export { parseTarget, validateUrl, isPublicAddress, targetErrorText, type TargetError } from '@/lib/ai-readiness'

export type Status = 'pass' | 'warn' | 'fail' | 'info'

export type ServerError = 'dns' | 'private-address' | 'rate-limited' | 'busy' | 'bad-request' | 'forbidden' | 'internal'

export type DomainFacts = {
  name: string
  created: string | null
  registrar: string | null
  lookup: 'found' | 'no-date' | 'unsupported' | 'error'
}

export type TlsFacts = {
  outcome: 'ok' | 'refused' | 'timeout' | 'error'
  authorized: boolean
  error: string | null
  issuer: string | null
  validTo: string | null
  hostMatch: boolean
}

export type Signals = {
  contactPage: boolean
  phone: boolean
  email: boolean
  address: boolean
  businessId: boolean
  privacy: boolean
  terms: boolean
  accessibility: boolean
}

export type HomeOutcome = 'ok' | 'http-error' | 'timeout' | 'network' | 'redirect-blocked' | 'too-many-redirects'

export type HomeFacts = {
  outcome: HomeOutcome
  status: number | null
  finalUrl: string | null
  truncated: boolean
  hsts: boolean
  csp: boolean
  frameProtection: boolean
  signals: Signals | null
}

export type SafeBrowsingFacts = { status: 'clean' | 'flagged' | 'error'; threats: string[] }

export type TrustFacts = {
  host: string
  checkedAt: string
  domain: DomainFacts
  tls: TlsFacts
  home: HomeFacts
  safeBrowsing: SafeBrowsingFacts | null
}

export type ReportItem = {
  id: string
  title: string
  status: Status
  text: string
  fix?: string
  weight: number
}

export type ReportSection = { id: string; title: string; items: ReportItem[] }

export type Counts = { pass: number; warn: number; fail: number }

export const API_PATH = '/api/tools/website-trust-check'
export const RATE_LIMIT = 10
export const RATE_WINDOW_MS = 10 * 60 * 1000
export const CLIENT_TIMEOUT_MS = 25000
export const SLOW_AFTER_MS = 5000
export const MAX_REDIRECTS = 4
export const YOUNG_DOMAIN_DAYS = 180
export const NEW_DOMAIN_DAYS = 30
export const CERT_SOON_DAYS = 14

export const statusLabel: Record<Status, string> = {
  pass: 'תקין',
  warn: 'לבדוק',
  fail: 'בעיה',
  info: 'לידיעה',
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

const SECOND_LEVEL = new Set(['co', 'org', 'net', 'ac', 'gov', 'muni', 'k12', 'idf', 'com', 'edu', 'ltd', 'plc'])

export function registrableDomain(host: string) {
  const labels = host.toLowerCase().replace(/\.$/, '').split('.')
  if (labels.length >= 3 && labels[labels.length - 1].length === 2 && SECOND_LEVEL.has(labels[labels.length - 2])) {
    return labels.slice(-3).join('.')
  }
  return labels.slice(-2).join('.')
}

const stripInvisible = (html: string) =>
  html
    .replace(/<script\b(?![^>]*application\/ld\+json)[^>]*>[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, ' ')

const decodeHref = (value: string) => {
  try {
    return decodeURIComponent(value)
  } catch {
    return value
  }
}

const PHONE_TEXT = /(?:^|[^\d])(?:\+972[-\s]?|0)(?:[23489]|5\d|7\d)[-\s]?\d{3}[-\s]?\d{4}(?!\d)|\*\d{4}(?!\d)/
const ADDRESS_TEXT = /(?:רחוב|רח['׳`]|שדרות|שד['׳`])\s*[֐-׿"'׳״ ]{2,30}\d{1,4}|streetAddress|PostalAddress/i
const BUSINESS_ID = /(?:ח\.?\s?פ\.?|ע\.?\s?מ\.?|עוסק\s+מורשה|מספר\s+חברה|ח["״]פ)\s*[:.]?\s*\d{8,9}/

export function analyzeSignals(html: string): Signals {
  const visible = stripInvisible(html)
  const anchors = [...visible.matchAll(/<a\b([^>]*)>([\s\S]{0,400}?)<\/a>/gi)].map((match) => {
    const href = decodeHref(/href\s*=\s*["']([^"']*)["']/i.exec(match[1])?.[1] ?? '').toLowerCase()
    const text = match[2].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim().toLowerCase()
    return { href, text }
  })
  const linkMatches = (hrefPattern: RegExp, textPattern: RegExp) =>
    anchors.some((anchor) => hrefPattern.test(anchor.href) || textPattern.test(anchor.text))
  const text = visible.replace(/<[^>]+>/g, ' ').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ')
  return {
    contactPage: linkMatches(/contact|צור-קשר|צרו-קשר|יצירת-קשר/, /צור קשר|צרו קשר|יצירת קשר|contact/),
    phone: anchors.some((anchor) => anchor.href.startsWith('tel:')) || PHONE_TEXT.test(text),
    email: anchors.some((anchor) => anchor.href.startsWith('mailto:')),
    address: ADDRESS_TEXT.test(text) || /streetAddress/i.test(visible),
    businessId: BUSINESS_ID.test(text),
    privacy: linkMatches(/privacy|פרטיות/, /פרטיות|privacy/),
    terms: linkMatches(/terms|תקנון|תנאי-שימוש|conditions/, /תקנון|תנאי שימוש|terms/),
    accessibility: linkMatches(/accessib|נגישות/, /נגישות|accessibility/),
  }
}

type Brand = { name: string; token: string; domains: string[] }

const BRANDS: Brand[] = [
  { name: 'PayPal', token: 'paypal', domains: ['paypal.com', 'paypal.me'] },
  { name: 'Apple', token: 'apple', domains: ['apple.com', 'icloud.com'] },
  { name: 'Microsoft', token: 'microsoft', domains: ['microsoft.com', 'live.com', 'office.com'] },
  { name: 'Google', token: 'google', domains: ['google.com', 'google.co.il', 'youtube.com'] },
  { name: 'Amazon', token: 'amazon', domains: ['amazon.com', 'amazon.co.uk', 'amazon.de'] },
  { name: 'Facebook', token: 'facebook', domains: ['facebook.com', 'fb.com'] },
  { name: 'Instagram', token: 'instagram', domains: ['instagram.com'] },
  { name: 'WhatsApp', token: 'whatsapp', domains: ['whatsapp.com'] },
  { name: 'Netflix', token: 'netflix', domains: ['netflix.com'] },
  { name: 'AliExpress', token: 'aliexpress', domains: ['aliexpress.com'] },
  { name: 'eBay', token: 'ebay', domains: ['ebay.com'] },
  { name: 'Shein', token: 'shein', domains: ['shein.com'] },
  { name: 'Temu', token: 'temu', domains: ['temu.com'] },
  { name: 'Zara', token: 'zara', domains: ['zara.com'] },
  { name: 'DHL', token: 'dhl', domains: ['dhl.com', 'dhl.co.il'] },
  { name: 'FedEx', token: 'fedex', domains: ['fedex.com'] },
  { name: 'בנק לאומי', token: 'leumi', domains: ['leumi.co.il'] },
  { name: 'בנק הפועלים', token: 'hapoalim', domains: ['bankhapoalim.co.il'] },
  { name: 'בנק דיסקונט', token: 'discountbank', domains: ['discountbank.co.il'] },
  { name: 'מזרחי טפחות', token: 'tefahot', domains: ['mizrahi-tefahot.co.il'] },
  { name: 'ישראכרט', token: 'isracard', domains: ['isracard.co.il'] },
  { name: 'כאל', token: 'calonline', domains: ['cal-online.co.il'] },
  { name: 'דואר ישראל', token: 'israelpost', domains: ['israelpost.co.il'] },
  { name: 'PayBox', token: 'paybox', domains: ['payboxapp.com'] },
  { name: 'שופרסל', token: 'shufersal', domains: ['shufersal.co.il'] },
  { name: 'KSP', token: 'ksp', domains: ['ksp.co.il'] },
  { name: 'Ivory', token: 'ivory', domains: ['ivory.co.il'] },
  { name: 'יד2', token: 'yad2', domains: ['yad2.co.il'] },
  { name: 'ביטוח לאומי', token: 'btl', domains: ['btl.gov.il'] },
  { name: 'רשות המסים', token: 'misim', domains: ['gov.il'] },
  { name: 'כביש 6', token: 'kvish6', domains: ['kvish6.co.il'] },
]

const LEET: Record<string, string> = { '0': 'o', '1': 'l', '3': 'e', '4': 'a', '5': 's', '7': 't', '8': 'b' }

const normalizeLabel = (label: string) => label.replace(/[0-9]/g, (digit) => LEET[digit] ?? digit)

function editDistance(a: string, b: string) {
  if (Math.abs(a.length - b.length) > 1) return 2
  const previous = Array.from({ length: b.length + 1 }, (_, index) => index)
  for (let i = 1; i <= a.length; i += 1) {
    let diagonal = previous[0]
    previous[0] = i
    for (let j = 1; j <= b.length; j += 1) {
      const above = previous[j]
      previous[j] = Math.min(previous[j] + 1, previous[j - 1] + 1, diagonal + (a[i - 1] === b[j - 1] ? 0 : 1))
      diagonal = above
    }
  }
  return previous[b.length]
}

const SUSPICIOUS_TLDS = new Set(['top', 'xyz', 'icu', 'cyou', 'buzz', 'sbs', 'click', 'rest', 'monster', 'cfd', 'bond'])

export type Lookalike = { brand: string | null; punycode: boolean; hyphens: number; suspiciousTld: string | null }

export function lookalikeFacts(host: string): Lookalike {
  const registrable = registrableDomain(host)
  const isOfficial = (brand: Brand) =>
    brand.domains.some((domain) => registrable === domain || host === domain || host.endsWith(`.${domain}`))
  const labels = host.split('.').slice(0, -1)
  const parts = labels.flatMap((label) => [label, ...label.split('-')]).map(normalizeLabel)
  const joined = normalizeLabel(labels.join('').replace(/-/g, ''))
  const hit = BRANDS.find((brand) => {
    if (isOfficial(brand)) return false
    if (brand.token.length < 5) return parts.includes(brand.token)
    if (joined.includes(brand.token)) return true
    return brand.token.length >= 6 && parts.some((part) => editDistance(part, brand.token) === 1)
  })
  const tld = host.split('.').pop() ?? ''
  return {
    brand: hit?.name ?? null,
    punycode: host.split('.').some((label) => label.startsWith('xn--')),
    hyphens: (registrable.match(/-/g) ?? []).length,
    suspiciousTld: SUSPICIOUS_TLDS.has(tld) ? tld : null,
  }
}

const DAY_MS = 24 * 60 * 60 * 1000

const daysSince = (iso: string, now: number) => Math.floor((now - Date.parse(iso)) / DAY_MS)

const hebrewDate = (iso: string) =>
  new Intl.DateTimeFormat('he-IL', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Asia/Jerusalem' }).format(
    new Date(iso),
  )

const ageText = (days: number) => {
  if (days < 60) return `${days} ימים`
  if (days < 730) return `כ-${Math.round(days / 30)} חודשים`
  return `כ-${Math.floor(days / 365)} שנים`
}

function domainItem(domain: DomainFacts, now: number): ReportItem {
  const base = { id: 'domain-age', title: 'גיל הדומיין', weight: 20 }
  if (domain.lookup !== 'found' || !domain.created || Number.isNaN(Date.parse(domain.created))) {
    const isIl = domain.name.endsWith('.il')
    return {
      ...base,
      status: 'info',
      text: isIl
        ? `לא הצלחנו לברר מתי נרשם ${domain.name}. מאגר הדומיינים הישראלי לא מחזיר את הנתון הזה בשאילתת RDAP, ולכן הוא לא נכלל בציון. אפשר לבדוק ידנית ב-WHOIS של איגוד האינטרנט הישראלי.`
        : `לא הצלחנו לברר מתי נרשם ${domain.name}, ולכן הנתון לא נכלל בציון.`,
    }
  }
  const days = daysSince(domain.created, now)
  const registered = `הדומיין ${domain.name} נרשם ב-${hebrewDate(domain.created)}, לפני ${ageText(Math.max(days, 0))}.`
  if (days < NEW_DOMAIN_DAYS) {
    return {
      ...base,
      status: 'fail',
      text: `${registered} רוב אתרי ההונאה חיים שבועות ספורים, ולכן דומיין חדש כזה הוא סימן אזהרה חזק כשמדובר בחנות או בדף תשלום.`,
      fix: 'לפני תשלום, חפשו את שם העסק בגוגל עם המילים ״עוקץ״ או ״ביקורות״, ובדקו שיש לו כתובת וטלפון אמיתיים.',
    }
  }
  if (days < YOUNG_DOMAIN_DAYS) {
    return {
      ...base,
      status: 'warn',
      text: `${registered} עסק חדש יכול להיות אמין לגמרי, אבל דומיין צעיר מחצי שנה דורש בדיקה נוספת לפני תשלום.`,
    }
  }
  return { ...base, status: 'pass', text: registered }
}

function tlsItem(tls: TlsFacts, now: number): ReportItem {
  const base = { id: 'tls', title: 'חיבור מאובטח (HTTPS) ותעודת SSL', weight: 20 }
  if (tls.outcome !== 'ok') {
    return {
      ...base,
      status: 'fail',
      text:
        tls.outcome === 'timeout'
          ? 'האתר לא ענה בזמן בפורט המאובטח 443, ולכן לא הצלחנו לבדוק את התעודה.'
          : 'האתר לא מקבל חיבור מאובטח. כל מה שמקלידים בו, כולל פרטי כרטיס אשראי, עובר ברשת בלי הצפנה.',
      fix: 'לא מזינים באתר כזה סיסמה או פרטי אשראי.',
    }
  }
  const issuer = tls.issuer ? ` את התעודה הנפיק ${tls.issuer}.` : ''
  if (!tls.authorized || !tls.hostMatch) {
    return {
      ...base,
      status: 'fail',
      text: `לתעודת ה-SSL יש בעיה: ${tls.hostMatch ? 'הדפדפן לא יסמוך עליה' : 'היא לא שייכת לדומיין הזה'}.${issuer} דפדפנים מציגים במצב כזה אזהרה אדומה.`,
      fix: 'אל תעקפו את האזהרה של הדפדפן ואל תמסרו באתר פרטים.',
    }
  }
  const days = tls.validTo ? Math.floor((Date.parse(tls.validTo) - now) / DAY_MS) : null
  const until = tls.validTo ? ` היא בתוקף עד ${hebrewDate(tls.validTo)}.` : ''
  if (days !== null && days < CERT_SOON_DAYS) {
    return {
      ...base,
      status: 'warn',
      text: `התעודה תקינה אבל פגה בעוד ${Math.max(days, 0)} ימים.${issuer}`,
      fix: 'לבעלי האתר: בדקו שחידוש אוטומטי של התעודה פועל.',
    }
  }
  return {
    ...base,
    status: 'pass',
    text: `החיבור מוצפן והתעודה תקפה לדומיין.${issuer}${until} שימו לב: גם אתרי הונאה מקבלים תעודה בחינם, ולכן המנעול בשורת הכתובת לא מעיד שהעסק אמין.`,
  }
}

function lookalikeItems(host: string): ReportItem[] {
  const facts = lookalikeFacts(host)
  const items: ReportItem[] = []
  if (facts.brand) {
    items.push({
      id: 'lookalike',
      title: 'דמיון לשם של מותג מוכר',
      status: 'fail',
      weight: 25,
      text: `שם הדומיין ${host} מזכיר את ${facts.brand}, אבל הוא לא אחד הדומיינים הרשמיים שלו. ככה בדיוק נראים רוב אתרי הפישינג.`,
      fix: `היכנסו ל-${facts.brand} רק דרך כתובת שאתם מקלידים בעצמכם או דרך האפליקציה הרשמית, לא מקישור בהודעה.`,
    })
  } else {
    items.push({
      id: 'lookalike',
      title: 'דמיון לשם של מותג מוכר',
      status: 'pass',
      weight: 10,
      text: 'שם הדומיין לא דומה לאף אחד מהבנקים, חברות האשראי, חברות השילוח והחנויות הגדולות שהכלי מכיר.',
    })
  }
  if (facts.punycode) {
    items.push({
      id: 'punycode',
      title: 'אותיות שנראות כמו לטיניות',
      status: 'warn',
      weight: 10,
      text: 'הדומיין כתוב באותיות שאינן לטיניות רגילות (Punycode, xn--). לפעמים זה לגיטימי, ולפעמים זה טריק שבו אות קירילית מתחזה לאות אנגלית.',
    })
  }
  if (facts.hyphens >= 2 || facts.suspiciousTld) {
    items.push({
      id: 'shape',
      title: 'מבנה הדומיין',
      status: 'warn',
      weight: 5,
      text: facts.suspiciousTld
        ? `הסיומת .${facts.suspiciousTld} זולה מאוד, ולפי דוחות של חברות אבטחה היא נפוצה באתרי הונאה. זה לא מוכיח כלום לבד, אבל כדאי לשים לב.`
        : 'בדומיין כמה מקפים, למשל מותג-מבצע-משלוח. מבנה כזה נפוץ באתרים שמתחזים לחנויות.',
    })
  }
  return items
}

function headerItems(home: HomeFacts): ReportItem[] {
  if (home.outcome !== 'ok') return []
  const rows: [string, string, boolean, string, string][] = [
    [
      'hsts',
      'HSTS',
      home.hsts,
      'השרת מחייב את הדפדפן להתחבר רק ב-HTTPS.',
      'אין כותרת Strict-Transport-Security, ולכן ביקור ראשון בכתובת http אפשר ליירט.',
    ],
    [
      'csp',
      'Content-Security-Policy',
      home.csp,
      'יש מדיניות שמגבילה מאיפה מותר לטעון סקריפטים.',
      'אין כותרת Content-Security-Policy, שמקטינה נזק של הזרקת קוד (XSS).',
    ],
    [
      'frame',
      'הגנה מהטמעה במסגרת (X-Frame-Options)',
      home.frameProtection,
      'אתר אחר לא יכול להטמיע את האתר בתוך מסגרת ולהלביש עליו כפתורים.',
      'אין X-Frame-Options או frame-ancestors, ולכן אתר זדוני יכול להטמיע את האתר בתוך מסגרת (clickjacking).',
    ],
  ]
  return rows.map(([id, title, present, good, bad]) => ({
    id: `header-${id}`,
    title,
    status: present ? 'pass' : 'warn',
    weight: 4,
    text: present ? good : bad,
    fix: present ? undefined : 'לבעלי האתר: מגדירים את הכותרת בשרת, ב-Cloudflare או בתוסף אבטחה.',
  }))
}

function signalItems(home: HomeFacts): ReportItem[] {
  if (!home.signals) {
    const reason =
      home.outcome === 'http-error'
        ? `השרת החזיר קוד ${home.status}. אתרים גדולים חוסמים לפעמים בדיקות אוטומטיות, וזה לא סימן להונאה.`
        : home.outcome === 'timeout'
          ? 'האתר לא ענה תוך 8 שניות.'
          : home.outcome === 'redirect-blocked'
            ? 'האתר הפנה לכתובת שהכלי לא בודק.'
            : 'לא הצלחנו להתחבר לאתר.'
    return [
      {
        id: 'home',
        title: 'דף הבית',
        status: 'info',
        weight: 0,
        text: `לא הצלחנו לקרוא את דף הבית: ${reason} לכן לא בדקנו פרטי קשר, תקנון והצהרת נגישות.`,
      },
    ]
  }
  const s = home.signals
  const contactCount = [s.contactPage, s.phone, s.email, s.address].filter(Boolean).length
  const found = [
    s.contactPage && 'דף צור קשר',
    s.phone && 'טלפון',
    s.email && 'כתובת מייל',
    s.address && 'כתובת פיזית',
  ].filter(Boolean)
  const items: ReportItem[] = [
    {
      id: 'contact',
      title: 'פרטי קשר',
      status: contactCount >= 3 ? 'pass' : contactCount >= 1 ? 'warn' : 'fail',
      weight: 15,
      text: found.length
        ? `מצאנו בדף הבית: ${found.join(', ')}.${contactCount < 3 ? ' עסק אמין מציג בדרך כלל כמה דרכים ליצור איתו קשר, כולל כתובת.' : ''}`
        : 'לא מצאנו בדף הבית טלפון, מייל, כתובת או קישור לדף צור קשר. חנות בלי פרטי קשר היא סימן אזהרה רציני.',
      fix: contactCount < 3 ? 'התקשרו למספר שמופיע באתר לפני תשלום ובדקו שעונים בשם העסק.' : undefined,
    },
    {
      id: 'business-id',
      title: 'מספר עוסק או ח.פ.',
      status: s.businessId ? 'pass' : 'warn',
      weight: 5,
      text: s.businessId
        ? 'בדף מופיע מספר חברה או עוסק. אפשר לחפש אותו ברשם החברות כדי לוודא שהוא שייך לעסק הזה.'
        : 'לא מצאנו בדף הבית מספר חברה או עוסק. לפעמים הוא מופיע רק בתקנון, אז כדאי לחפש שם.',
    },
    {
      id: 'privacy',
      title: 'מדיניות פרטיות',
      status: s.privacy ? 'pass' : 'warn',
      weight: 5,
      text: s.privacy
        ? 'יש קישור למדיניות פרטיות.'
        : 'לא מצאנו קישור למדיניות פרטיות. אתר שאוסף פרטים אישיים צריך להסביר מה הוא עושה בהם.',
    },
    {
      id: 'terms',
      title: 'תקנון ותנאי שימוש',
      status: s.terms ? 'pass' : 'warn',
      weight: 5,
      text: s.terms
        ? 'יש קישור לתקנון או לתנאי שימוש. כדאי לקרוא בו את מדיניות הביטולים והמשלוחים.'
        : 'לא מצאנו קישור לתקנון. בחנות אונליין התקנון הוא המקום שבו כתובים תנאי הביטול, ההחזרות והמשלוח.',
    },
    {
      id: 'accessibility',
      title: 'הצהרת נגישות',
      status: s.accessibility ? 'pass' : 'warn',
      weight: 5,
      text: s.accessibility
        ? 'יש קישור להצהרת נגישות, כפי שדורשות תקנות הנגישות בישראל מרוב האתרים של עסקים שנותנים שירות לציבור.'
        : 'לא מצאנו קישור להצהרת נגישות. רוב העסקים בישראל שנותנים שירות לציבור חייבים בה, ואתרי הונאה מתחזים כמעט אף פעם לא טורחים להוסיף אותה.',
    },
  ]
  return items
}

function safeBrowsingItem(facts: SafeBrowsingFacts | null): ReportItem[] {
  if (!facts) return []
  const base = { id: 'safe-browsing', title: 'Google Safe Browsing', weight: 25 }
  if (facts.status === 'error') {
    return [{ ...base, status: 'info', text: 'לא הצלחנו לבדוק מול Google Safe Browsing הפעם, ולכן הנתון לא נכלל בציון.' }]
  }
  if (facts.status === 'flagged') {
    return [
      {
        ...base,
        status: 'fail',
        text: `גוגל מסמנת את האתר כמסוכן (${facts.threats.join(', ')}). דפדפן Chrome מציג עליו מסך אזהרה אדום.`,
        fix: 'אל תיכנסו לאתר ואל תזינו בו שום פרט.',
      },
    ]
  }
  return [{ ...base, status: 'pass', text: 'האתר לא מופיע ברשימות האתרים המסוכנים של גוגל. אתר הונאה חדש עדיין לא תמיד מופיע בהן.' }]
}

export function buildReport(facts: TrustFacts, now = Date.parse(facts.checkedAt)): ReportSection[] {
  const sections: ReportSection[] = [
    {
      id: 'identity',
      title: 'הדומיין',
      items: [domainItem(facts.domain, now), ...lookalikeItems(facts.host), ...safeBrowsingItem(facts.safeBrowsing)],
    },
    { id: 'security', title: 'אבטחה', items: [tlsItem(facts.tls, now), ...headerItems(facts.home)] },
    { id: 'business', title: 'פרטי העסק ומסמכים', items: signalItems(facts.home) },
  ]
  return sections
}

const FACTOR: Record<Exclude<Status, 'info'>, number> = { pass: 1, warn: 0.5, fail: 0 }

export function scoreOf(sections: ReportSection[]) {
  const items = sections.flatMap((section) => section.items).filter((item) => item.status !== 'info' && item.weight > 0)
  const total = items.reduce((sum, item) => sum + item.weight, 0)
  if (!total) return 0
  const earned = items.reduce((sum, item) => sum + item.weight * FACTOR[item.status as Exclude<Status, 'info'>], 0)
  let score = Math.round((earned / total) * 100)
  const failed = (id: string) => items.some((item) => item.id === id && item.status === 'fail')
  if (failed('safe-browsing')) score = Math.min(score, 10)
  if (failed('lookalike')) score = Math.min(score, 30)
  if (failed('domain-age') || failed('tls')) score = Math.min(score, 55)
  if (items.length < 4) score = Math.min(score, 70)
  return score
}

export const scoredCount = (sections: ReportSection[]) =>
  sections.flatMap((section) => section.items).filter((item) => item.status !== 'info' && item.weight > 0).length

export function countStatuses(sections: ReportSection[]): Counts {
  const counts: Counts = { pass: 0, warn: 0, fail: 0 }
  for (const item of sections.flatMap((section) => section.items)) {
    if (item.status !== 'info') counts[item.status] += 1
  }
  return counts
}

export function verdictOf(score: number) {
  if (score >= 80) return { status: 'pass' as Status, text: 'לא מצאנו סימני אזהרה משמעותיים.' }
  if (score >= 55) return { status: 'warn' as Status, text: 'יש כמה סימנים שכדאי לבדוק לפני שמשלמים או מוסרים פרטים.' }
  return { status: 'fail' as Status, text: 'יש סימני אזהרה רציניים. אל תשלמו ואל תמסרו פרטים באתר לפני בדיקה נוספת.' }
}
