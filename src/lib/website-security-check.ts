import type { ReportItem, ReportSection, Status } from '@/lib/website-trust-check'

export {
  countStatuses,
  parseTarget,
  registrableDomain,
  serverErrorText,
  statusLabel,
  targetErrorText,
  type Counts,
  type ReportItem,
  type ReportSection,
  type ServerError,
  type Status,
  type TargetError,
} from '@/lib/website-trust-check'

export const API_PATH = '/api/tools/website-security-check'
export const CERT_SOON_DAYS = 14
export const HSTS_MIN_SECONDS = 15552000

export type SecurityTls = {
  outcome: 'ok' | 'refused' | 'timeout' | 'error'
  authorized: boolean
  error: string | null
  issuer: string | null
  validTo: string | null
  hostMatch: boolean
  protocol: string | null
}

export type HttpRedirect = 'https' | 'other' | 'none' | 'unreachable'

export type CookieFacts = { name: string; secure: boolean; httpOnly: boolean; sameSite: string | null }

export type SecurityHome = {
  outcome: 'ok' | 'http-error' | 'unreachable'
  status: number | null
  finalUrl: string | null
  https: boolean
  hsts: string | null
  csp: string | null
  xFrameOptions: string | null
  contentTypeOptions: string | null
  referrerPolicy: string | null
  permissionsPolicy: string | null
  server: string | null
  poweredBy: string | null
  cookies: CookieFacts[]
  generator: string | null
}

export type ProbeFacts = { status: number | null; exposed: boolean }

export type EmailFacts = {
  domain: string
  lookup: 'ok' | 'error'
  spf: string | null
  dmarc: string | null
  mx: number
}

export type SecurityFacts = {
  host: string
  checkedAt: string
  tls: SecurityTls
  httpRedirect: HttpRedirect
  home: SecurityHome
  probes: { git: ProbeFacts; wpUsers: ProbeFacts; xmlrpc: ProbeFacts }
  email: EmailFacts
}

export type Grade = 'A' | 'B' | 'C' | 'D' | 'F'

const DAY = 24 * 60 * 60 * 1000

const item = (id: string, title: string, status: Status, text: string, weight: number, fix?: string): ReportItem => ({
  id,
  title,
  status,
  text,
  weight,
  ...(fix ? { fix } : {}),
})

export function parseCookie(raw: string): CookieFacts {
  const [pair, ...attributes] = raw.split(';').map((part) => part.trim())
  const names = attributes.map((part) => part.toLowerCase())
  const sameSite = names.find((part) => part.startsWith('samesite='))
  return {
    name: (pair.split('=')[0] ?? '').slice(0, 60),
    secure: names.includes('secure'),
    httpOnly: names.includes('httponly'),
    sameSite: sameSite ? sameSite.slice(9) : null,
  }
}

export function generatorOf(html: string) {
  const tag = /<meta[^>]+name=["']generator["'][^>]*>/i.exec(html)?.[0] ?? ''
  const content = /content=["']([^"']{1,80})["']/i.exec(tag)?.[1]
  return content ?? null
}

export function dmarcPolicy(record: string | null) {
  const policy = record ? /(?:^|;)\s*p\s*=\s*(none|quarantine|reject)/i.exec(record)?.[1]?.toLowerCase() : undefined
  return policy ?? null
}

export function hstsSeconds(value: string | null) {
  const match = value ? /max-age\s*=\s*"?(\d+)/i.exec(value) : null
  return match ? Number(match[1]) : 0
}

const versionPattern = /\d+\.\d+/

function tlsItems(tls: SecurityTls, now: number): ReportItem[] {
  const title = 'תעודת SSL'
  if (tls.outcome !== 'ok') {
    return [
      item('tls', title, 'fail', 'לא הצלחנו לפתוח חיבור HTTPS בפורט 443. האתר עובד בלי הצפנה, או שהשרת לא עונה.', 4,
        'מתקינים תעודה חינמית של Let’s Encrypt דרך לוח הבקרה של האחסון או מפעילים את הפרוקסי של Cloudflare.'),
    ]
  }
  const days = tls.validTo ? Math.floor((Date.parse(tls.validTo) - now) / DAY) : null
  const expiry = tls.validTo ? new Date(tls.validTo).toLocaleDateString('he-IL') : 'לא ידוע'
  const certItem =
    !tls.authorized || !tls.hostMatch || (days !== null && days < 0)
      ? item('tls', title, 'fail', `התעודה לא תקפה (${tls.error ?? 'שם לא תואם'}). דפדפנים מציגים לגולשים אזהרה מלאה.`, 4,
          'מנפיקים תעודה חדשה שכוללת את הדומיין עם www ובלי, ומתקינים את שרשרת התעודות המלאה.')
      : days !== null && days < CERT_SOON_DAYS
        ? item('tls', title, 'warn', `התעודה תקפה עד ${expiry}, עוד ${days} ימים בלבד.`, 4,
            'בודקים שהחידוש האוטומטי פועל. תעודות Let’s Encrypt תקפות 90 יום ואמורות להתחדש לבד.')
        : item('tls', title, 'pass', `תעודה תקפה של ${tls.issuer ?? 'רשות מוכרת'}, עד ${expiry}${days !== null ? ` (${days} ימים)` : ''}.`, 4)
  const modern = tls.protocol === 'TLSv1.3' || tls.protocol === 'TLSv1.2'
  const protocolItem = modern
    ? item('tls-protocol', 'גרסת TLS', 'pass', `החיבור נפתח ב-${tls.protocol}.`, 1)
    : item('tls-protocol', 'גרסת TLS', 'fail', `החיבור נפתח ב-${tls.protocol ?? 'גרסה לא ידועה'}, שדפדפנים כבר לא תומכים בה.`, 1,
        'מכבים בשרת את TLS 1.0 ו-1.1 ומשאירים רק 1.2 ו-1.3.')
  return [certItem, protocolItem]
}

function redirectItem(redirect: HttpRedirect): ReportItem {
  const title = 'הפניה מ-HTTP ל-HTTPS'
  if (redirect === 'https') return item('redirect', title, 'pass', 'מי שמקליד http:// מועבר אוטומטית לגרסה המוצפנת.', 2)
  if (redirect === 'unreachable') return item('redirect', title, 'info', 'פורט 80 לא עונה, ולכן אין גרסה לא מוצפנת לבדוק.', 0)
  return item('redirect', title, 'fail', 'הגרסה הלא מוצפנת של האתר נפתחת בלי הפניה ל-HTTPS.', 2,
    'מוסיפים הפניה קבועה (301) מכל כתובת http:// לאותה כתובת ב-https://, בשרת או בהגדרות Cloudflare.')
}

function headerItems(home: SecurityHome): ReportItem[] {
  const seconds = hstsSeconds(home.hsts)
  const hsts = !home.https || !home.hsts
    ? item('hsts', 'HSTS', 'fail', 'הכותרת Strict-Transport-Security חסרה, ולכן הדפדפן עלול לפנות לאתר בלי הצפנה.', 2,
        'מוסיפים Strict-Transport-Security: max-age=31536000; includeSubDomains אחרי שכל תתי-הדומיינים עובדים ב-HTTPS.')
    : seconds < HSTS_MIN_SECONDS
      ? item('hsts', 'HSTS', 'warn', `HSTS מוגדר, אבל ל-${Math.round(seconds / DAY)} ימים בלבד.`, 2, 'מעלים את max-age לשנה, 31536000 שניות.')
      : item('hsts', 'HSTS', 'pass', `HSTS מוגדר ל-${Math.round(seconds / DAY)} ימים.`, 2)
  const frameByCsp = /frame-ancestors/i.test(home.csp ?? '')
  const csp = home.csp
    ? item('csp', 'Content-Security-Policy', /unsafe-inline|\*/.test(home.csp) ? 'warn' : 'pass',
        /unsafe-inline|\*/.test(home.csp) ? 'יש CSP, אבל הוא מתיר unsafe-inline או כוכבית, כך שההגנה מפני XSS חלקית.' : 'יש מדיניות CSP.', 2,
        /unsafe-inline|\*/.test(home.csp) ? 'מצמצמים את המקורות המותרים ומחליפים unsafe-inline ב-nonce.' : undefined)
    : item('csp', 'Content-Security-Policy', 'warn', 'אין CSP. אם תוקף מצליח להזריק סקריפט, שום דבר לא יחסום אותו.', 2,
        'מתחילים ב-Content-Security-Policy-Report-Only כדי לראות מה נשבר, ואז מפעילים מדיניות אמיתית.')
  const frame = home.xFrameOptions || frameByCsp
    ? item('xfo', 'הגנה מהטמעה במסגרת', 'pass', 'האתר לא ייפתח בתוך iframe של אתר זר.', 1)
    : item('xfo', 'הגנה מהטמעה במסגרת', 'fail', 'אין X-Frame-Options ואין frame-ancestors, ולכן אפשר לעטוף את האתר בדף זר (clickjacking).', 1,
        'מוסיפים X-Frame-Options: SAMEORIGIN, או frame-ancestors \'self\' ב-CSP.')
  const nosniff = /nosniff/i.test(home.contentTypeOptions ?? '')
    ? item('xcto', 'X-Content-Type-Options', 'pass', 'מוגדר nosniff.', 1)
    : item('xcto', 'X-Content-Type-Options', 'warn', 'הכותרת חסרה, והדפדפן עלול לנחש סוג קובץ ולהריץ אותו.', 1,
        'מוסיפים X-Content-Type-Options: nosniff.')
  const referrer = home.referrerPolicy
    ? item('referrer', 'Referrer-Policy', 'pass', `מוגדר ${home.referrerPolicy}.`, 1)
    : item('referrer', 'Referrer-Policy', 'warn', 'אין מדיניות, וכתובות מלאות עם פרמטרים עלולות לדלוף לאתרים אחרים.', 1,
        'מוסיפים Referrer-Policy: strict-origin-when-cross-origin.')
  const permissions = home.permissionsPolicy
    ? item('permissions', 'Permissions-Policy', 'pass', 'מוגדרת מדיניות הרשאות לדפדפן.', 1)
    : item('permissions', 'Permissions-Policy', 'warn', 'אין הגבלה על מצלמה, מיקרופון ומיקום לסקריפטים בדף.', 1,
        'מוסיפים Permissions-Policy: camera=(), microphone=(), geolocation=() ופותחים רק מה שהאתר צריך.')
  return [hsts, csp, frame, nosniff, referrer, permissions]
}

function leakItems(home: SecurityHome): ReportItem[] {
  const leaks = [home.server, home.poweredBy].filter((value): value is string => Boolean(value && versionPattern.test(value)))
  const versions = leaks.length
    ? item('version-leak', 'חשיפת גרסאות תוכנה', 'warn', `השרת מפרסם גרסה: ${leaks.join(', ')}. תוקפים מחפשים בדיוק את זה.`, 1,
        'מכבים server_tokens ב-nginx, ServerTokens Prod ב-Apache ו-expose_php ב-PHP, ומסירים את X-Powered-By.')
    : item('version-leak', 'חשיפת גרסאות תוכנה', 'pass', 'הכותרות Server ו-X-Powered-By לא חושפות מספר גרסה.', 1)
  const result = [versions]
  if (home.generator) {
    const wpVersion = /wordpress\s+([\d.]+)/i.exec(home.generator)?.[1]
    result.push(
      wpVersion
        ? item('generator', 'גרסת וורדפרס גלויה', 'warn', `קוד הדף מציין WordPress ${wpVersion}.`, 1,
            'מסירים את תגית ה-generator בעזרת תוסף אבטחה, ובעיקר מעדכנים את וורדפרס לגרסה האחרונה.')
        : item('generator', 'תגית generator', 'info', `קוד הדף מציין: ${home.generator}.`, 0),
    )
  }
  return result
}

function cookieItem(cookies: CookieFacts[], https: boolean): ReportItem {
  const title = 'דגלי עוגיות'
  if (!cookies.length) return item('cookies', title, 'info', 'דף הבית לא שולח עוגיות, אז אין מה לבדוק.', 0)
  const weak = cookies.filter((cookie) => (https && !cookie.secure) || !cookie.httpOnly || !cookie.sameSite)
  if (!weak.length) return item('cookies', title, 'pass', `כל ${cookies.length} העוגיות מסומנות Secure, HttpOnly ו-SameSite.`, 1)
  const names = weak.slice(0, 4).map((cookie) => cookie.name).join(', ')
  return item('cookies', title, 'warn', `${weak.length} מתוך ${cookies.length} עוגיות בלי Secure, HttpOnly או SameSite: ${names}.`, 1,
    'עוגיות התחברות וסשן חייבות את שלושת הדגלים. עוגיות שסקריפטים צריכים לקרוא, כמו של אנליטיקס, יכולות להישאר בלי HttpOnly.')
}

function probeItems(probes: SecurityFacts['probes']): ReportItem[] {
  const statusText = (probe: ProbeFacts) => (probe.status === null ? 'לא ענה' : `קוד ${probe.status}`)
  const git = probes.git.exposed
    ? item('git', 'תיקיית .git חשופה', 'fail', 'הקובץ /.git/HEAD נגיש מבחוץ. אפשר להוריד ממנו את כל קוד האתר, כולל סיסמאות שנשמרו בו.', 5,
        'חוסמים גישה ל-/.git בשרת מיד, ומחליפים כל סיסמה ומפתח API שהיו בקוד.')
    : item('git', 'תיקיית .git', 'pass', `/.git/HEAD לא נגיש (${statusText(probes.git)}).`, 2)
  const users = probes.wpUsers.exposed
    ? item('wp-users', 'רשימת משתמשי וורדפרס', 'warn', '/wp-json/wp/v2/users מחזיר את שמות המשתמשים, וזה חצי מהעבודה לתוקף שמנחש סיסמאות.', 1,
        'חוסמים את נקודת הקצה למשתמשים לא מחוברים בתוסף אבטחה, ומפעילים אימות דו-שלבי למנהלים.')
    : item('wp-users', 'רשימת משתמשי וורדפרס', 'pass', `נקודת הקצה לא מחזירה רשימת משתמשים (${statusText(probes.wpUsers)}).`, 1)
  const xmlrpc = probes.xmlrpc.exposed
    ? item('xmlrpc', 'xmlrpc.php פתוח', 'warn', 'xmlrpc.php עונה. דרכו אפשר לנסות מאות סיסמאות בבקשה אחת.', 1,
        'אם לא משתמשים באפליקציית וורדפרס או ב-Jetpack, חוסמים את xmlrpc.php בשרת.')
    : item('xmlrpc', 'xmlrpc.php', 'pass', `xmlrpc.php לא פתוח (${statusText(probes.xmlrpc)}).`, 1)
  return [git, users, xmlrpc]
}

function emailItems(email: EmailFacts): ReportItem[] {
  if (email.lookup === 'error') {
    return [item('email', 'רשומות DNS של מייל', 'info', `לא הצלחנו לקרוא את רשומות ה-DNS של ${email.domain}.`, 0)]
  }
  const mx = email.mx
    ? item('mx', 'רשומת MX', 'pass', `לדומיין יש ${email.mx} שרתי דואר.`, 0)
    : item('mx', 'רשומת MX', 'info', 'לדומיין אין שרת דואר. אם לא שולחים ממנו מייל, כדאי להגדיר SPF עם -all ו-DMARC עם reject.', 0)
  const spf = !email.spf
    ? item('spf', 'SPF', 'fail', 'אין רשומת SPF, וכל אחד יכול לשלוח מייל בשם הדומיין שלכם.', 2,
        'מוסיפים רשומת TXT שמתחילה ב-v=spf1 ומפרטת את שירותי הדיוור שלכם, למשל include:_spf.google.com, ומסיימים ב-~all או -all.')
    : /\+all/.test(email.spf)
      ? item('spf', 'SPF', 'fail', 'רשומת SPF מסתיימת ב-+all, כלומר מאשרת לכל שרת בעולם לשלוח בשמכם.', 2, 'מחליפים את +all ב-~all או -all.')
      : item('spf', 'SPF', 'pass', 'יש רשומת SPF.', 2)
  const policy = dmarcPolicy(email.dmarc)
  const dmarc = !email.dmarc
    ? item('dmarc', 'DMARC', 'fail', 'אין רשומת DMARC. מיילים מזויפים בשמכם יגיעו לתיבה, וגוגל ויאהו דורשות אותה משולחים גדולים.', 2,
        'מוסיפים רשומת TXT בשם _dmarc עם v=DMARC1; p=none; rua=mailto:כתובת שלכם, ואחרי כמה שבועות של דוחות עוברים ל-quarantine.')
    : policy === 'none' || !policy
      ? item('dmarc', 'DMARC', 'warn', 'DMARC מוגדר עם p=none: מקבלים דוחות, אבל מיילים מזויפים עדיין עוברים.', 2,
          'אחרי שבדקתם בדוחות שכל המיילים הלגיטימיים עוברים SPF או DKIM, משנים ל-p=quarantine ואחר כך ל-p=reject.')
      : item('dmarc', 'DMARC', 'pass', `DMARC מוגדר עם p=${policy}, ומיילים מזויפים נחסמים או מסומנים כספאם.`, 2)
  return [mx, spf, dmarc]
}

export function buildReport(facts: SecurityFacts, now = Date.parse(facts.checkedAt)): ReportSection[] {
  const homeReached = facts.home.outcome !== 'unreachable'
  return [
    { id: 'transport', title: 'הצפנה ו-SSL', items: [...tlsItems(facts.tls, now), redirectItem(facts.httpRedirect)] },
    ...(homeReached
      ? [
          { id: 'headers', title: 'כותרות אבטחה', items: headerItems(facts.home) },
          { id: 'exposure', title: 'מידע חשוף', items: [...leakItems(facts.home), cookieItem(facts.home.cookies, facts.home.https), ...probeItems(facts.probes)] },
        ]
      : [{ id: 'headers', title: 'כותרות אבטחה', items: [item('home', 'דף הבית', 'info', 'דף הבית לא ענה, ולכן לא בדקנו כותרות וקבצים חשופים.', 0)] }]),
    { id: 'email', title: 'אבטחת מייל', items: emailItems(facts.email) },
  ]
}

const FACTOR: Record<Exclude<Status, 'info'>, number> = { pass: 1, warn: 0.5, fail: 0 }

export function scoreOf(sections: ReportSection[]) {
  const items = sections.flatMap((section) => section.items).filter((entry) => entry.status !== 'info' && entry.weight > 0)
  const total = items.reduce((sum, entry) => sum + entry.weight, 0)
  if (!total) return 0
  const earned = items.reduce((sum, entry) => sum + entry.weight * FACTOR[entry.status as Exclude<Status, 'info'>], 0)
  let score = Math.round((earned / total) * 100)
  const failed = (id: string) => items.some((entry) => entry.id === id && entry.status === 'fail')
  if (failed('git')) score = Math.min(score, 30)
  if (failed('tls')) score = Math.min(score, 45)
  return score
}

export function gradeOf(score: number): Grade {
  if (score >= 90) return 'A'
  if (score >= 80) return 'B'
  if (score >= 65) return 'C'
  if (score >= 50) return 'D'
  return 'F'
}

export const gradeTone: Record<Grade, Status> = { A: 'pass', B: 'pass', C: 'warn', D: 'fail', F: 'fail' }

export const gradeText: Record<Grade, string> = {
  A: 'האתר מוגן היטב. נשארו לכל היותר שיפורים קטנים.',
  B: 'בסיס טוב, עם כמה הגדרות חסרות שכדאי להשלים.',
  C: 'יש פערים שתוקפים מנצלים בפועל. כדאי לטפל בהם השבוע.',
  D: 'חסרות הגנות בסיסיות. האתר והמייל חשופים להתקפות נפוצות.',
  F: 'יש בעיה חמורה שדורשת טיפול מיידי.',
}
