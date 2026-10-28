export const API_PATH = '/api/tools/website-speed-test'
export const SERVER_TIMEOUT_MS = 55000
export const CLIENT_TIMEOUT_MS = 62000
export const SLOW_AFTER_MS = 20000
export const RATE_LIMIT = 6
export const RATE_WINDOW_MS = 10 * 60 * 1000
export const MAX_INPUT_LENGTH = 2048
export const MAX_OPPORTUNITIES = 5

export type Strategy = 'mobile' | 'desktop'
export type Rating = 'good' | 'average' | 'poor'
export type TargetError = 'empty' | 'too-long' | 'invalid' | 'scheme' | 'host'
export type ServerError =
  | 'bad-request'
  | 'forbidden'
  | 'rate-limited'
  | 'busy'
  | 'quota'
  | 'unreachable'
  | 'lighthouse'
  | 'timeout'
  | 'internal'

export type Target = { ok: true; url: string } | { ok: false; error: TargetError }

export type MetricId = 'lcp' | 'cls' | 'inp' | 'tbt' | 'fcp' | 'si' | 'ttfb'

export type Metric = { id: MetricId; value: number; display: string; rating: Rating }

export type Opportunity = { id: string; title: string; text: string; savingsMs: number }

export type FieldData = { scope: 'page' | 'origin'; overall: Rating | null; metrics: Metric[] }

export type SpeedReport = {
  requestedUrl: string
  finalUrl: string
  strategy: Strategy
  score: number | null
  lab: Metric[]
  field: FieldData | null
  opportunities: Opportunity[]
  fetchedAt: string
  lighthouseVersion: string
}

export const strategyLabel: Record<Strategy, string> = { mobile: 'מובייל', desktop: 'מחשב' }

export const ratingLabel: Record<Rating, string> = { good: 'טוב', average: 'דורש שיפור', poor: 'איטי' }

export const metricInfo: Record<MetricId, { name: string; short: string; about: string }> = {
  lcp: {
    name: 'Largest Contentful Paint',
    short: 'LCP',
    about: 'כמה זמן עד שהתוכן הגדול ביותר במסך, בדרך כלל תמונה או כותרת, מופיע. טוב: עד 2.5 שניות.',
  },
  cls: {
    name: 'Cumulative Layout Shift',
    short: 'CLS',
    about: 'כמה הדף קופץ בזמן הטעינה, למשל כשתמונה או באנר דוחפים את הטקסט. טוב: עד 0.1.',
  },
  inp: {
    name: 'Interaction to Next Paint',
    short: 'INP',
    about: 'כמה מהר הדף מגיב ללחיצה או להקלדה של גולשים אמיתיים. טוב: עד 200 מילישניות.',
  },
  tbt: {
    name: 'Total Blocking Time',
    short: 'TBT',
    about: 'כמה זמן JavaScript תקע את הדפדפן בזמן הטעינה. במדידת מעבדה הוא מחליף את INP. טוב: עד 200 מילישניות.',
  },
  fcp: {
    name: 'First Contentful Paint',
    short: 'FCP',
    about: 'מתי מופיע משהו ראשון על המסך, טקסט או תמונה. טוב: עד 1.8 שניות.',
  },
  si: {
    name: 'Speed Index',
    short: 'Speed Index',
    about: 'כמה מהר החלק הנראה של הדף מתמלא בתוכן. טוב: עד 3.4 שניות במובייל.',
  },
  ttfb: {
    name: 'Time to First Byte',
    short: 'TTFB',
    about: 'כמה זמן השרת לוקח להתחיל לענות. טוב: עד 0.8 שניות.',
  },
}

export const opportunityText: Record<string, { title: string; text: string }> = {
  'render-blocking-resources': {
    title: 'קבצים שחוסמים את הציור הראשון',
    text: 'קובצי CSS ו-JavaScript בראש הדף נטענים לפני שהדפדפן מצייר משהו. מעבירים סקריפטים ל-defer ומשאירים בראש רק את ה-CSS הנחוץ למסך הראשון.',
  },
  'render-blocking-insight': {
    title: 'קבצים שחוסמים את הציור הראשון',
    text: 'קובצי CSS ו-JavaScript בראש הדף נטענים לפני שהדפדפן מצייר משהו. מעבירים סקריפטים ל-defer ומשאירים בראש רק את ה-CSS הנחוץ למסך הראשון.',
  },
  'unused-javascript': {
    title: 'JavaScript שלא בשימוש',
    text: 'הדף מוריד קוד שלא רץ בו, לרוב מתוספים, ספריות ופיקסלים. מסירים תוספים מיותרים וטוענים סקריפטים רק בעמודים שצריכים אותם.',
  },
  'unused-css-rules': {
    title: 'CSS שלא בשימוש',
    text: 'רוב כללי העיצוב שנטענים לא משמשים בדף הזה, בדרך כלל בגלל תבנית או בונה עמודים כבד. מסירים CSS מיותר או טוענים אותו לפי עמוד.',
  },
  'legacy-javascript': {
    title: 'קוד JavaScript ישן לדפדפנים ישנים',
    text: 'הקוד כולל תאימות לדפדפנים שכמעט אין בהם שימוש, וזה מנפח את הקבצים. בונים את הקוד לדפדפנים מודרניים.',
  },
  'legacy-javascript-insight': {
    title: 'קוד JavaScript ישן לדפדפנים ישנים',
    text: 'הקוד כולל תאימות לדפדפנים שכמעט אין בהם שימוש, וזה מנפח את הקבצים. בונים את הקוד לדפדפנים מודרניים.',
  },
  'modern-image-formats': {
    title: 'תמונות בפורמט ישן',
    text: 'תמונות JPG ו-PNG כבדות בהרבה מ-WebP או AVIF באותה איכות. ממירים את התמונות, ורוב מערכות האתרים עושות את זה עם תוסף או הגדרה.',
  },
  'uses-optimized-images': {
    title: 'תמונות לא דחוסות',
    text: 'יש תמונות שאפשר לדחוס בלי הבדל שרואים בעין. דוחסים לפני העלאה או מפעילים דחיסה אוטומטית.',
  },
  'uses-responsive-images': {
    title: 'תמונות גדולות מהמסך',
    text: 'הדף מוריד תמונות ברוחב גדול בהרבה ממה שמוצג, במיוחד בטלפון. מגישים כמה גדלים של כל תמונה והדפדפן בוחר את המתאים.',
  },
  'image-delivery-insight': {
    title: 'תמונות כבדות מדי',
    text: 'יש תמונות בפורמט ישן, לא דחוסות או גדולות מהגודל שבו הן מוצגות. ממירים ל-WebP או AVIF ומגישים גודל שמתאים למסך.',
  },
  'offscreen-images': {
    title: 'תמונות מחוץ למסך נטענות מיד',
    text: 'תמונות שנמצאות למטה בדף נטענות יחד עם המסך הראשון. מוסיפים להן loading="lazy" כדי שייטענו רק כשגוללים אליהן.',
  },
  'efficient-animated-content': {
    title: 'GIF כבד במקום וידאו',
    text: 'קובצי GIF מונפשים כבדים פי כמה מווידאו קצר. מחליפים אותם בקובץ MP4 או WebM.',
  },
  'unminified-javascript': {
    title: 'JavaScript לא מכווץ',
    text: 'קובצי JavaScript נשלחים עם רווחים והערות. כיווץ חוסך משקל, ובדרך כלל מפעילים אותו בהגדרה אחת בתוסף מטמון.',
  },
  'unminified-css': {
    title: 'CSS לא מכווץ',
    text: 'קובצי CSS נשלחים עם רווחים והערות. כיווץ חוסך משקל, ובדרך כלל מפעילים אותו בהגדרה אחת בתוסף מטמון.',
  },
  'uses-text-compression': {
    title: 'השרת לא דוחס טקסט',
    text: 'HTML, CSS ו-JavaScript נשלחים בלי דחיסת gzip או brotli. מפעילים דחיסה בשרת או ב-CDN, וזה חוסך לרוב יותר ממחצית המשקל.',
  },
  'server-response-time': {
    title: 'השרת עונה לאט',
    text: 'השרת לוקח זמן רב להתחיל לשלוח את הדף. הסיבות הנפוצות: אחסון זול ועמוס, אין מטמון עמודים, או שאילתות כבדות למסד הנתונים.',
  },
  'document-latency-insight': {
    title: 'השרת עונה לאט',
    text: 'הדף עצמו מגיע באיטיות, בגלל זמן תגובה של השרת, הפניות או חוסר בדחיסה. מוסיפים מטמון עמודים, CDN ומבטלים הפניות מיותרות.',
  },
  redirects: {
    title: 'הפניות לפני הדף',
    text: 'הכתובת עוברת הפניה אחת או יותר לפני שהדף נטען, וכל הפניה מוסיפה זמן. מקשרים ישר לכתובת הסופית.',
  },
  'uses-rel-preconnect': {
    title: 'חיבור מאוחר לשרתים חיצוניים',
    text: 'הדף טוען משאבים חשובים משרתים אחרים בלי להתחבר אליהם מראש. מוסיפים preconnect לשרתים של הגופנים או התמונות.',
  },
  'prioritize-lcp-image': {
    title: 'התמונה הראשית מתגלה מאוחר',
    text: 'התמונה הגדולה במסך הראשון מתחילה לרדת רק אחרי קבצים אחרים. מסמנים אותה ב-fetchpriority="high" ולא טוענים אותה ב-lazy.',
  },
  'lcp-discovery-insight': {
    title: 'התמונה הראשית מתגלה מאוחר',
    text: 'התמונה הגדולה במסך הראשון מתחילה לרדת רק אחרי קבצים אחרים. מסמנים אותה ב-fetchpriority="high" ולא טוענים אותה ב-lazy.',
  },
  'lcp-phases-insight': {
    title: 'מה מעכב את התוכן הראשי',
    text: 'הפירוק מראה איפה הולך הזמן עד שהתוכן הגדול מופיע: תגובת השרת, גילוי התמונה, ההורדה או הציור. מטפלים קודם בשלב הארוך.',
  },
  'uses-long-cache-ttl': {
    title: 'מטמון קצר לקבצים קבועים',
    text: 'תמונות, גופנים וסקריפטים נשמרים בדפדפן לזמן קצר, ולכן גולש שחוזר מוריד אותם שוב. מגדירים תוקף מטמון ארוך.',
  },
  'cache-insight': {
    title: 'מטמון קצר לקבצים קבועים',
    text: 'תמונות, גופנים וסקריפטים נשמרים בדפדפן לזמן קצר, ולכן גולש שחוזר מוריד אותם שוב. מגדירים תוקף מטמון ארוך.',
  },
  'font-display': {
    title: 'טקסט נעלם עד שהגופן נטען',
    text: 'הטקסט לא מוצג עד שקובץ הגופן יורד. מוסיפים font-display: swap כדי שיופיע מיד בגופן זמני.',
  },
  'font-display-insight': {
    title: 'טקסט נעלם עד שהגופן נטען',
    text: 'הטקסט לא מוצג עד שקובץ הגופן יורד. מוסיפים font-display: swap כדי שיופיע מיד בגופן זמני.',
  },
  'third-party-summary': {
    title: 'סקריפטים של צד שלישי',
    text: 'צ׳אטים, פיקסלים, מפות ווידג׳טים משרתים אחרים תופסים את הדפדפן. מוותרים על מה שלא בשימוש וטוענים את השאר אחרי הדף.',
  },
  'third-parties-insight': {
    title: 'סקריפטים של צד שלישי',
    text: 'צ׳אטים, פיקסלים, מפות ווידג׳טים משרתים אחרים תופסים את הדפדפן. מוותרים על מה שלא בשימוש וטוענים את השאר אחרי הדף.',
  },
  'bootup-time': {
    title: 'יותר מדי זמן בהרצת JavaScript',
    text: 'הדפדפן מבזבז שניות על פענוח והרצה של קוד. מצמצמים תוספים וסקריפטים, וזה מורגש בעיקר בטלפונים פשוטים.',
  },
  'mainthread-work-breakdown': {
    title: 'הדפדפן עמוס בזמן הטעינה',
    text: 'יש הרבה עבודה על התהליך הראשי של הדפדפן: סקריפטים, עיצוב וציור. פחות קוד ופחות אלמנטים בדף מקצרים אותה.',
  },
  'dom-size': {
    title: 'דף עם יותר מדי אלמנטים',
    text: 'הדף בנוי מאלפי אלמנטים, בדרך כלל בגלל בוני עמודים שעוטפים כל דבר בכמה שכבות. מבנה רזה יותר מאיץ ציור ותגובה.',
  },
  'dom-size-insight': {
    title: 'דף עם יותר מדי אלמנטים',
    text: 'הדף בנוי מאלפי אלמנטים, בדרך כלל בגלל בוני עמודים שעוטפים כל דבר בכמה שכבות. מבנה רזה יותר מאיץ ציור ותגובה.',
  },
  'total-byte-weight': {
    title: 'הדף כבד מדי',
    text: 'סך הקבצים שהדף מוריד גבוה. בדרך כלל אלה תמונות ווידאו גדולים או ספריות JavaScript כבדות.',
  },
  'critical-request-chains': {
    title: 'שרשרת בקשות ארוכה',
    text: 'קבצים חשובים נטענים אחד אחרי השני במקום במקביל. מקצרים את השרשרת ומסמנים preload למשאבים הקריטיים.',
  },
  'network-dependency-tree-insight': {
    title: 'שרשרת בקשות ארוכה',
    text: 'קבצים חשובים נטענים אחד אחרי השני במקום במקביל. מקצרים את השרשרת ומסמנים preload למשאבים הקריטיים.',
  },
  'layout-shifts': {
    title: 'אלמנטים שגורמים לדף לקפוץ',
    text: 'תמונות, באנרים או גופנים בלי גודל קבוע מזיזים את התוכן בזמן הטעינה. מגדירים רוחב וגובה לכל תמונה ושומרים מקום לבאנרים.',
  },
  'cls-culprits-insight': {
    title: 'אלמנטים שגורמים לדף לקפוץ',
    text: 'תמונות, באנרים או גופנים בלי גודל קבוע מזיזים את התוכן בזמן הטעינה. מגדירים רוחב וגובה לכל תמונה ושומרים מקום לבאנרים.',
  },
  'unsized-images': {
    title: 'תמונות בלי רוחב וגובה',
    text: 'בלי מידות, הדפדפן לא יודע כמה מקום לשמור והדף קופץ כשהתמונה מגיעה. מוסיפים width ו-height לתמונות.',
  },
  'long-tasks': {
    title: 'משימות ארוכות שתוקעות את הדף',
    text: 'יש קטעי JavaScript שרצים יותר מ-50 מילישניות ברצף, ובזמן הזה הדף לא מגיב ללחיצות. מפצלים או דוחים אותם.',
  },
  'forced-reflow-insight': {
    title: 'חישובי פריסה כפויים',
    text: 'סקריפטים קוראים מידות של אלמנטים מיד אחרי שינוי, וזה מכריח את הדפדפן לחשב את הדף מחדש שוב ושוב.',
  },
  'duplicated-javascript': {
    title: 'אותו קוד נטען פעמיים',
    text: 'אותה ספרייה נכללת ביותר מקובץ אחד. מאחדים את הגרסאות כדי לא להוריד את אותו קוד פעמיים.',
  },
  'duplicated-javascript-insight': {
    title: 'אותו קוד נטען פעמיים',
    text: 'אותה ספרייה נכללת ביותר מקובץ אחד. מאחדים את הגרסאות כדי לא להוריד את אותו קוד פעמיים.',
  },
  'modern-http-insight': {
    title: 'פרוטוקול HTTP ישן',
    text: 'השרת מגיש קבצים ב-HTTP/1.1. מעבר ל-HTTP/2 או HTTP/3, למשל דרך CDN, מאפשר להוריד הרבה קבצים במקביל.',
  },
  'viewport-insight': {
    title: 'הדף לא מוגדר לטלפון',
    text: 'חסרה הגדרת viewport למובייל, ולכן לחיצות בטלפון עלולות להתעכב. מוסיפים תגית meta viewport.',
  },
}

export const targetErrorText: Record<TargetError, string> = {
  empty: 'הקלידו כתובת של אתר, למשל example.co.il.',
  'too-long': 'הכתובת ארוכה מדי.',
  invalid: 'זו לא נראית כמו כתובת של אתר. בדקו את האיות.',
  scheme: 'אפשר לבדוק רק כתובות שמתחילות ב-http או https.',
  host: 'אפשר לבדוק רק אתר ציבורי שזמין באינטרנט, לא כתובת פנימית.',
}

export const serverErrorText: Record<ServerError, string> = {
  'bad-request': 'הבקשה לא תקינה. רעננו את הדף ונסו שוב.',
  forbidden: 'הבקשה נחסמה. רעננו את הדף ונסו שוב.',
  'rate-limited': `אפשר להריץ עד ${RATE_LIMIT} בדיקות ב-10 דקות.`,
  busy: 'יש כרגע הרבה בדיקות במקביל. נסו שוב בעוד חצי דקה.',
  quota: 'הגענו למכסת הבדיקות היומית מול Google. נסו שוב מאוחר יותר.',
  unreachable:
    'Google לא הצליח לטעון את הכתובת. בדקו שהאתר עולה בדפדפן, שהכתובת נכונה ושהאתר לא חוסם בוטים או מבקש סיסמה.',
  lighthouse: 'Google טען את הדף אבל לא הצליח למדוד אותו. זה קורה לפעמים בדפים כבדים מאוד. נסו שוב.',
  timeout: 'הבדיקה לקחה יותר מדי זמן. האתר כנראה איטי מאוד או לא עונה. נסו שוב בעוד רגע.',
  internal: 'משהו השתבש אצלנו. נסו שוב בעוד רגע.',
}

const PRIVATE_HOST =
  /^(localhost|.*\.local|.*\.internal|.*\.lan|0\.0\.0\.0|127\.\d+\.\d+\.\d+|10\.\d+\.\d+\.\d+|192\.168\.\d+\.\d+|172\.(1[6-9]|2\d|3[01])\.\d+\.\d+|169\.254\.\d+\.\d+|\[.*\])$/i

export function parseTarget(input: string): Target {
  const raw = input.trim()
  if (!raw) return { ok: false, error: 'empty' }
  if (raw.length > MAX_INPUT_LENGTH) return { ok: false, error: 'too-long' }
  const scheme = raw.match(/^([a-z][a-z0-9+.-]*):\/\//i)
  if (scheme && !/^https?$/i.test(scheme[1])) return { ok: false, error: 'scheme' }
  if (!scheme && /^[a-z][a-z0-9+.-]*:(?!\d)/i.test(raw)) return { ok: false, error: 'scheme' }
  let url: URL
  try {
    url = new URL(scheme ? raw : `https://${raw}`)
  } catch {
    return { ok: false, error: 'invalid' }
  }
  if (url.protocol !== 'http:' && url.protocol !== 'https:') return { ok: false, error: 'scheme' }
  if (url.username || url.password) return { ok: false, error: 'invalid' }
  const host = url.hostname.toLowerCase()
  if (PRIVATE_HOST.test(host)) return { ok: false, error: 'host' }
  if (!host.includes('.') || host.endsWith('.')) return { ok: false, error: 'invalid' }
  url.hash = ''
  return { ok: true, url: url.toString() }
}

export const scoreRating = (score: number): Rating => (score >= 90 ? 'good' : score >= 50 ? 'average' : 'poor')

const LAB_AUDITS: { id: MetricId; audit: string; good: number; poor: number }[] = [
  { id: 'lcp', audit: 'largest-contentful-paint', good: 2500, poor: 4000 },
  { id: 'fcp', audit: 'first-contentful-paint', good: 1800, poor: 3000 },
  { id: 'tbt', audit: 'total-blocking-time', good: 200, poor: 600 },
  { id: 'cls', audit: 'cumulative-layout-shift', good: 0.1, poor: 0.25 },
  { id: 'si', audit: 'speed-index', good: 3400, poor: 5800 },
]

const FIELD_METRICS: { id: MetricId; key: string }[] = [
  { id: 'lcp', key: 'LARGEST_CONTENTFUL_PAINT_MS' },
  { id: 'inp', key: 'INTERACTION_TO_NEXT_PAINT' },
  { id: 'cls', key: 'CUMULATIVE_LAYOUT_SHIFT_SCORE' },
  { id: 'fcp', key: 'FIRST_CONTENTFUL_PAINT_MS' },
  { id: 'ttfb', key: 'EXPERIMENTAL_TIME_TO_FIRST_BYTE' },
]

const CATEGORY_RATING: Record<string, Rating> = { FAST: 'good', AVERAGE: 'average', SLOW: 'poor' }

const SKIPPED_GROUPS = new Set(['metrics', 'hidden', 'budgets'])
const COUNTED_MODES = new Set(['numeric', 'binary', 'metricSavings'])

export function formatMetric(id: MetricId, value: number) {
  if (id === 'cls') return value.toFixed(2)
  if (id === 'tbt' || id === 'inp' || value < 1000) return `${Math.round(value)} מ״ש`
  return `${(value / 1000).toFixed(1)} שנ׳`
}

const rate = (value: number, good: number, poor: number): Rating =>
  value <= good ? 'good' : value <= poor ? 'average' : 'poor'

const stripMarkdown = (text: string) =>
  text
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/\s*(למידע נוסף|מידע נוסף|Learn more)[^.]*\.?\s*$/i, '')
    .trim()

type Audit = {
  id?: string
  title?: string
  description?: string
  score?: number | null
  scoreDisplayMode?: string
  numericValue?: number
  metricSavings?: Record<string, number>
  details?: { overallSavingsMs?: number }
}

type FieldMetric = { percentile?: number; category?: string }

type Experience = {
  id?: string
  overall_category?: string
  origin_fallback?: boolean
  metrics?: Record<string, FieldMetric>
}

export type PsiResponse = {
  id?: string
  loadingExperience?: Experience
  originLoadingExperience?: Experience
  analysisUTCTimestamp?: string
  lighthouseResult?: {
    requestedUrl?: string
    finalUrl?: string
    finalDisplayedUrl?: string
    lighthouseVersion?: string
    runtimeError?: { code?: string }
    categories?: {
      performance?: { score?: number | null; auditRefs?: { id: string; group?: string }[] }
    }
    audits?: Record<string, Audit>
  }
}

function readField(experience: Experience | undefined): Metric[] {
  if (!experience?.metrics) return []
  const metrics: Metric[] = []
  for (const { id, key } of FIELD_METRICS) {
    const entry = experience.metrics[key]
    if (typeof entry?.percentile !== 'number' || !entry.category) continue
    const value = id === 'cls' ? entry.percentile / 100 : entry.percentile
    metrics.push({ id, value, display: formatMetric(id, value), rating: CATEGORY_RATING[entry.category] ?? 'average' })
  }
  return metrics
}

function pickField(data: PsiResponse): FieldData | null {
  const page = data.loadingExperience
  const pageMetrics = page && !page.origin_fallback ? readField(page) : []
  if (pageMetrics.length) {
    return { scope: 'page', overall: CATEGORY_RATING[page?.overall_category ?? ''] ?? null, metrics: pageMetrics }
  }
  const origin = data.originLoadingExperience
  const originMetrics = readField(origin)
  if (!originMetrics.length) return null
  return { scope: 'origin', overall: CATEGORY_RATING[origin?.overall_category ?? ''] ?? null, metrics: originMetrics }
}

const savingsOf = (audit: Audit) => {
  const fromDetails = audit.details?.overallSavingsMs ?? 0
  const fromMetrics = Math.max(audit.metricSavings?.LCP ?? 0, audit.metricSavings?.FCP ?? 0, audit.metricSavings?.TBT ?? 0)
  return Math.round(Math.max(fromDetails, fromMetrics))
}

function pickOpportunities(data: PsiResponse): Opportunity[] {
  const audits = data.lighthouseResult?.audits ?? {}
  const refs = data.lighthouseResult?.categories?.performance?.auditRefs ?? []
  const seenTitles = new Set<string>()
  return refs
    .filter((ref) => !SKIPPED_GROUPS.has(ref.group ?? ''))
    .map((ref) => audits[ref.id])
    .filter((audit): audit is Audit & { id: string } =>
      Boolean(
        audit?.id &&
          typeof audit.score === 'number' &&
          audit.score < 0.9 &&
          COUNTED_MODES.has(audit.scoreDisplayMode ?? ''),
      ),
    )
    .map((audit) => {
      const known = opportunityText[audit.id]
      return {
        id: audit.id,
        title: known?.title ?? stripMarkdown(audit.title ?? audit.id),
        text: known?.text ?? stripMarkdown(audit.description ?? ''),
        savingsMs: savingsOf(audit),
        score: audit.score ?? 1,
      }
    })
    .sort((a, b) => b.savingsMs - a.savingsMs || a.score - b.score)
    .filter((item) => {
      if (seenTitles.has(item.title)) return false
      seenTitles.add(item.title)
      return true
    })
    .slice(0, MAX_OPPORTUNITIES)
    .map(({ id, title, text, savingsMs }) => ({ id, title, text, savingsMs }))
}

function readLab(data: PsiResponse): Metric[] {
  const audits = data.lighthouseResult?.audits ?? {}
  const metrics: Metric[] = []
  for (const { id, audit, good, poor } of LAB_AUDITS) {
    const value = audits[audit]?.numericValue
    if (typeof value !== 'number') continue
    metrics.push({ id, value, display: formatMetric(id, value), rating: rate(value, good, poor) })
  }
  return metrics
}

export function buildReport(data: PsiResponse, requestedUrl: string, strategy: Strategy): SpeedReport {
  const lighthouse = data.lighthouseResult
  const raw = lighthouse?.categories?.performance?.score
  return {
    requestedUrl,
    finalUrl: lighthouse?.finalDisplayedUrl ?? lighthouse?.finalUrl ?? data.id ?? requestedUrl,
    strategy,
    score: typeof raw === 'number' ? Math.round(raw * 100) : null,
    lab: readLab(data),
    field: pickField(data),
    opportunities: pickOpportunities(data),
    fetchedAt: data.analysisUTCTimestamp ?? new Date().toISOString(),
    lighthouseVersion: lighthouse?.lighthouseVersion ?? '',
  }
}
