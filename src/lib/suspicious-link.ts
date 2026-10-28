export const SUSPICIOUS_LINK_PATH = '/tools/suspicious-link-checker'
export const SUSPICIOUS_LINK_CHECKED = '28.10.2026'

export type Verdict = 'ok' | 'suspicious' | 'dangerous'
export type FindingWeight = 0 | 1 | 2 | 3
export type Finding = { weight: FindingWeight; text: string }

export type LinkReport = {
  input: string
  host: string
  verdict: Verdict
  findings: Finding[]
}

export type Analysis = {
  links: LinkReport[]
  messageSignals: string[]
  truncated: boolean
}

type Brand = {
  name: string
  officialDomains: string[]
  core: string
  tokens: string[]
}

export const brands: Brand[] = [
  { name: 'רשות המסים', officialDomains: ['taxes.gov.il'], core: 'taxes', tokens: ['taxes', 'misim'] },
  { name: 'ביטוח לאומי', officialDomains: ['btl.gov.il'], core: 'btl', tokens: ['btl', 'bituachleumi'] },
  { name: 'אתרי הממשלה', officialDomains: ['gov.il'], core: 'gov', tokens: ['gov', 'govil', 'mygov'] },
  { name: 'דואר ישראל', officialDomains: ['israelpost.co.il'], core: 'israelpost', tokens: ['israelpost', 'doar'] },
  {
    name: 'בנק הפועלים',
    officialDomains: ['bankhapoalim.co.il'],
    core: 'bankhapoalim',
    tokens: ['hapoalim', 'poalim'],
  },
  { name: 'בנק לאומי', officialDomains: ['leumi.co.il'], core: 'leumi', tokens: ['leumi'] },
  {
    name: 'בנק דיסקונט',
    officialDomains: ['discountbank.co.il'],
    core: 'discountbank',
    tokens: ['discountbank'],
  },
  {
    name: 'מזרחי טפחות',
    officialDomains: ['mizrahi-tefahot.co.il'],
    core: 'mizrahitefahot',
    tokens: ['mizrahi', 'tefahot'],
  },
  { name: 'מקס', officialDomains: ['max.co.il'], core: 'max', tokens: ['max'] },
  { name: 'ישראכרט', officialDomains: ['isracard.co.il'], core: 'isracard', tokens: ['isracard'] },
  { name: 'כאל', officialDomains: ['cal-online.co.il'], core: 'calonline', tokens: ['calonline'] },
  { name: 'bit', officialDomains: ['bitpay.co.il'], core: 'bitpay', tokens: ['bit', 'bitpay'] },
  { name: 'PayBox', officialDomains: ['payboxapp.com'], core: 'payboxapp', tokens: ['paybox'] },
]

const shorteners = new Set([
  'bit.ly',
  'tinyurl.com',
  'cutt.ly',
  'rb.gy',
  't.ly',
  'is.gd',
  'ow.ly',
  'shorturl.at',
  's.id',
  'tiny.cc',
  'rebrand.ly',
  't.co',
  'goo.su',
  'u.to',
  'v.gd',
  'qrco.de',
  'linktr.ee',
  'did.li',
])

const riskyTlds = new Set([
  'top',
  'xyz',
  'icu',
  'cyou',
  'buzz',
  'sbs',
  'cfd',
  'click',
  'link',
  'live',
  'shop',
  'online',
  'site',
  'store',
  'vip',
  'rest',
  'monster',
  'tk',
  'ml',
  'ga',
  'cf',
  'gq',
  'win',
  'bond',
  'lol',
  'mom',
  'qpon',
  'support',
  'help',
  'info',
])

const freeHosts = [
  'web.app',
  'firebaseapp.com',
  'github.io',
  'vercel.app',
  'netlify.app',
  'pages.dev',
  'workers.dev',
  'wixsite.com',
  'weebly.com',
  'blogspot.com',
  '000webhostapp.com',
  'glitch.me',
  'ngrok.io',
  'ngrok-free.app',
  'r2.dev',
  'square.site',
]

const lureWords = [
  'login',
  'signin',
  'verify',
  'secure',
  'update',
  'account',
  'refund',
  'payment',
  'parcel',
  'delivery',
  'track',
  'package',
  'customs',
  'invoice',
]

const israeliSecondLevel = new Set(['co', 'org', 'gov', 'ac', 'net', 'muni', 'k12', 'idf'])

const messagePatterns: { pattern: RegExp; text: string }[] = [
  { pattern: /חבילה|משלוח|דמי (?:משלוח|מכס)|מכס|עיכוב/, text: 'ההודעה מדברת על חבילה, משלוח או מכס' },
  { pattern: /החזר (?:מס|כספי)|זכאי|זכאות|מענק/, text: 'ההודעה מבטיחה החזר כספי או מענק' },
  { pattern: /חוב|קנס|עיקול|הוצאה לפועל|תשלום שלא שולם/, text: 'ההודעה מאיימת בחוב, קנס או עיקול' },
  { pattern: /נחסם|חסימה|הושעה|יוקפא|הקפאה/, text: 'ההודעה מאיימת בחסימת חשבון או כרטיס' },
  { pattern: /דחוף|מיידי|תוך \d+ (?:שעות|ימים)|היום בלבד|אחרון/, text: 'ההודעה לוחצת לפעול מהר' },
  { pattern: /קוד אימות|סיסמ|פרטי (?:כרטיס|אשראי)|מספר כרטיס/, text: 'ההודעה מבקשת קוד, סיסמה או פרטי כרטיס' },
]

const URL_PATTERN =
  /(?:https?:\/\/|www\.)[^\s<>"'`״”]+|(?<![@\w.])(?:[a-z0-9À-ɏͰ-ϿЀ-ӿ][a-z0-9À-ɏͰ-ϿЀ-ӿ-]*\.)+(?:[a-z]{2,}|xn--[a-z0-9-]+)(?::\d+)?(?:\/[^\s<>"'`״”]*)?/giu

const TRAILING_PUNCTUATION = /[.,;:!?)\]}'"״׳»]+$/

export const MAX_LINKS = 20

export function extractUrls(text: string) {
  const found = (text.match(URL_PATTERN) ?? []).map((match) => match.replace(TRAILING_PUNCTUATION, ''))
  return [...new Set(found.filter((item) => item.includes('.')))]
}

function rawAuthority(input: string) {
  const withoutScheme = input.replace(/^[a-z][a-z0-9+.-]*:\/\//i, '')
  return withoutScheme.split(/[/?#]/)[0]
}

function hostFromAuthority(authority: string) {
  const afterUser = authority.slice(authority.lastIndexOf('@') + 1)
  if (afterUser.startsWith('[')) return afterUser.slice(0, afterUser.indexOf(']') + 1)
  return afterUser.replace(/:\d*$/, '').toLowerCase()
}

export function registrableDomain(host: string) {
  const labels = host.split('.').filter(Boolean)
  const takeThree = labels.length >= 3 && labels.at(-1) === 'il' && israeliSecondLevel.has(labels.at(-2) ?? '')
  return labels.slice(takeThree ? -3 : -2).join('.')
}

const isOfficial = (host: string, domain: string) => host === domain || host.endsWith(`.${domain}`)

export function editDistance(a: string, b: string) {
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

const homoglyphs: [RegExp, string][] = [
  [/rn/g, 'm'],
  [/vv/g, 'w'],
  [/0/g, 'o'],
  [/1/g, 'l'],
  [/3/g, 'e'],
  [/5/g, 's'],
  [/\$/g, 's'],
]

const normalizeLookalike = (value: string) =>
  homoglyphs.reduce((current, [pattern, replacement]) => current.replace(pattern, replacement), value)

function scriptsOf(label: string) {
  const scripts = new Set<string>()
  for (const char of label) {
    if (/[a-z]/i.test(char)) scripts.add('latin')
    else if (/[Ѐ-ӿ]/.test(char)) scripts.add('cyrillic')
    else if (/[Ͱ-Ͽ]/.test(char)) scripts.add('greek')
    else if (/[֐-׿]/.test(char)) scripts.add('hebrew')
    else if (/[À-ɏ]/.test(char)) scripts.add('latin')
  }
  return scripts
}

function brandFindings(host: string, rawHost: string): { findings: Finding[]; official: Brand | null } {
  const official = brands.find((brand) => brand.officialDomains.some((domain) => isOfficial(host, domain)))
  if (official) return { findings: [], official }

  const findings: Finding[] = []
  const tokens = host.split(/[.-]/).filter(Boolean)
  const compact = host.replace(/-/g, '')
  const registrable = registrableDomain(host)
  const name = registrable.split('.')[0].replace(/-/g, '')
  const lookalike = normalizeLookalike(name)
  const nonLatin = [...scriptsOf(rawHost)].some((script) => script !== 'latin')

  for (const brand of brands) {
    const officialList = brand.officialDomains.join(', ')
    const tokenHit = brand.tokens.some((token) =>
      token.length >= 5 ? compact.includes(token) : tokens.includes(token),
    )
    if (brand.core === 'gov') {
      if (tokenHit) {
        findings.push({
          weight: 3,
          text: 'הכתובת משתמשת במילה gov, אבל היא לא מסתיימת ב-gov.il. כל אתרי הממשלה בישראל נמצאים תחת gov.il.',
        })
      }
      continue
    }
    if (tokenHit) {
      findings.push({
        weight: name === brand.core ? 3 : 2,
        text: `השם של ${brand.name} מופיע בכתובת, אבל זה לא האתר הרשמי (${officialList}).`,
      })
      continue
    }
    if (brand.core.length < 5 || name === brand.core) continue
    const distance = editDistance(name, brand.core)
    const glyphMatch = lookalike === brand.core && lookalike !== name
    const close = distance === 1 || (distance === 2 && brand.core.length >= 7)
    if (glyphMatch || close || (nonLatin && distance <= 2)) {
      findings.push({
        weight: 3,
        text: `שם האתר ${name} דומה מאוד ל-${brand.core}, הדומיין של ${brand.name} (${officialList}). זה טריק נפוץ של אתרי התחזות.`,
      })
    }
  }
  return { findings, official: null }
}

export function analyzeLink(input: string): LinkReport {
  const authority = rawAuthority(input)
  const rawHost = hostFromAuthority(authority)
  const withScheme = /^[a-z][a-z0-9+.-]*:\/\//i.test(input) ? input : `http://${input}`
  let host = rawHost
  try {
    host = new URL(withScheme).hostname.toLowerCase()
  } catch {
    return {
      input,
      host: rawHost,
      verdict: 'suspicious',
      findings: [{ weight: 2, text: 'לא הצלחנו לפענח את הכתובת. כתובת שבורה או מוסווית היא סימן אזהרה בפני עצמה.' }],
    }
  }

  const findings: Finding[] = []
  const add = (weight: FindingWeight, text: string) => findings.push({ weight, text })
  const labels = host.split('.').filter(Boolean)
  const tld = labels.at(-1) ?? ''
  const registrable = registrableDomain(host)
  const isIp = /^\d{1,3}(?:\.\d{1,3}){3}$/.test(host) || host.startsWith('[') || /^\d+$/.test(host)

  if (authority.includes('@')) {
    add(3, `יש בכתובת את התו @. הדפדפן מתעלם מכל מה שלפניו ונכנס בפועל ל-${host}.`)
  }
  if (isIp) add(3, 'הכתובת היא מספר IP ולא שם של אתר. גופים אמיתיים לא שולחים קישורים כאלה.')

  const mixedLabel = rawHost.split('.').find((label) => scriptsOf(label).size > 1)
  if (mixedLabel) {
    add(3, `החלק ${mixedLabel} מערבב אותיות מכמה שפות (למשל לטינית וקירילית) כדי להיראות כמו שם מוכר.`)
  }
  if (labels.some((label) => label.startsWith('xn--'))) {
    add(mixedLabel ? 1 : 2, `הכתובת מקודדת (${host}). כך נראות כתובות עם אותיות שאינן באנגלית, טריק שמשמש להסוואת שם מוכר.`)
  }

  const isShortener = shorteners.has(host) || shorteners.has(registrable)
  if (isShortener) {
    add(2, `${host} הוא שירות קיצור קישורים. היעד האמיתי מוסתר, ובנקים ומשרדי ממשלה כמעט לא משתמשים בו.`)
  }

  const { findings: brandHits, official } = isIp || isShortener ? { findings: [], official: null } : brandFindings(host, rawHost)
  findings.push(...brandHits)

  if (!official && !isIp) {
    if (riskyTlds.has(tld)) add(2, `הסיומת .${tld} זולה ונפוצה מאוד באתרי הונאה. אתרים ישראליים רשמיים משתמשים בדרך כלל ב-.co.il או ב-.gov.il.`)
    const freeHost = freeHosts.find((domain) => isOfficial(host, domain))
    if (freeHost) add(2, `האתר מאוחסן בשירות חינמי (${freeHost}) שכל אחד יכול לפתוח בו דף תוך דקות.`)
    const subdomains = labels.length - registrable.split('.').length
    if (subdomains >= 3) add(subdomains >= 5 ? 2 : 1, `יש בכתובת ${subdomains} תת-דומיינים. שרשרת ארוכה מסתירה את שם האתר האמיתי, שנמצא בסוף: ${registrable}.`)
    if (host.length > 45) add(1, 'שם האתר ארוך במיוחד, מה שמקשה לראות לאן הקישור מוביל.')
    if ((registrable.replace(/xn--/g, '').match(/-/g) ?? []).length >= 2) add(1, 'בשם האתר יש כמה מקפים, דפוס נפוץ בדומיינים שנרשמו בשביל הונאה.')
    const lure = lureWords.find((word) => host.includes(word))
    if (lure) add(1, `בשם האתר מופיעה המילה ${lure}, מילה שאתרי התחזות מוסיפים כדי להיראות רשמיים.`)
  }

  if (/^http:\/\//i.test(input)) add(1, 'הקישור מתחיל ב-http בלי s, כלומר החיבור לא מוצפן.')
  if (/^[a-z][a-z0-9+.-]*:\/\//i.test(input) && !/^https?:\/\//i.test(input)) add(3, 'הקישור לא מוביל לאתר רגיל אלא לפרוטוקול אחר.')

  const score = findings.reduce((sum, finding) => sum + finding.weight, 0)
  const top = findings.reduce((max, finding) => Math.max(max, finding.weight), 0)
  let verdict: Verdict = top >= 3 || score >= 4 ? 'dangerous' : score >= 2 ? 'suspicious' : 'ok'

  if (official) {
    findings.unshift({ weight: 0, text: `הדומיין ${registrable} הוא האתר הרשמי של ${official.name}.` })
    if (verdict !== 'dangerous') verdict = 'ok'
  } else if (!findings.length) {
    findings.push({ weight: 0, text: `לא נמצאו סימני אזהרה מוכרים. שם האתר האמיתי הוא ${registrable}, ודאו שאתם מכירים אותו.` })
  }

  return { input, host, verdict, findings }
}

export function analyzeText(text: string): Analysis {
  const urls = extractUrls(text)
  const messageSignals = messagePatterns.filter(({ pattern }) => pattern.test(text)).map(({ text: line }) => line)
  return {
    links: urls.slice(0, MAX_LINKS).map(analyzeLink),
    messageSignals: urls.length ? messageSignals : [],
    truncated: urls.length > MAX_LINKS,
  }
}

export const verdictLabels: Record<Verdict, string> = { ok: 'סביר', suspicious: 'חשוד', dangerous: 'מסוכן' }

export const verdictSummaries: Record<Verdict, string> = {
  ok: 'לא נמצאו סימני הונאה מוכרים. זה לא אומר שהקישור בטוח, רק שהבדיקה לא מצאה בו בעיה.',
  suspicious: 'יש בקישור סימנים שכיחים בהונאות. אל תיכנסו ממנו, וגשו לאתר או לאפליקציה הרשמיים בעצמכם.',
  dangerous: 'הקישור נראה כמו התחזות. אל תלחצו עליו, אל תמסרו פרטים, ודווחו עליו.',
}

export const SAMPLE_MESSAGE =
  'דואר ישראל: החבילה שלך מעוכבת בשל דמי משלוח של 4.90 ש״ח. יש להסדיר תוך 24 שעות: https://israelpost-delivery.top/il'

export const officialReport = {
  label: 'דיווח על אירוע סייבר, מערך הסייבר הלאומי (gov.il)',
  href: 'https://www.gov.il/he/service/cyber-event-report',
  email: '119@cyber.gov.il',
}
