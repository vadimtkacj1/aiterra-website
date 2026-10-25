export type ReviewInput =
  | { status: 'empty' }
  | { status: 'invalid'; error: string }
  | { status: 'ready'; placeId: string; link: string; note: string }

export type MessageTemplate = { id: string; label: string; build: (business: string, link: string) => string }

export const REVIEW_LINK_BASE = 'https://search.google.com/local/writereview'
export const PLACE_ID_FINDER_URL = 'https://developers.google.com/maps/documentation/places/web-service/place-id'
export const REVIEW_HELP_URL = 'https://support.google.com/business/answer/3474122'
export const REVIEW_POLICY_URL = 'https://support.google.com/contributionpolicy/answer/7400114'

const PLACE_ID_PATTERN = /^[A-Za-z0-9_-]{20,}$/
const PLAIN_PLACE_ID_PATTERN = /^ChIJ[A-Za-z0-9_-]{16,}$/
const PLACE_ID_PARAMS = ['placeid', 'place_id', 'query_place_id']
const SHORT_HOSTS = ['maps.app.goo.gl', 'goo.gl']

export const ERRORS = {
  short:
    'זה קישור מקוצר, ואי אפשר לקרוא ממנו את מזהה המקום מתוך הדפדפן. חפשו את העסק בכלי של גוגל לאיתור Place ID, והדביקו כאן את המזהה שהוא מציג.',
  maps:
    'בקישור הזה אין Place ID. בקישורים רגילים של גוגל מפות מופיע מזהה אחר, שלא מתאים לקישור ביקורת. חפשו את העסק בכלי של גוגל לאיתור Place ID, והדביקו כאן את המזהה.',
  other:
    'לא זיהינו Place ID. מזהה של עסק מורכב מאותיות לטיניות, ספרות, מקף וקו תחתון, ולרוב מתחיל ב-ChIJ. אפשר גם להדביק קישור שמכיל את המזהה בפרמטר placeid.',
} as const

export const buildReviewLink = (placeId: string) => `${REVIEW_LINK_BASE}?placeid=${encodeURIComponent(placeId)}`

function tryUrl(raw: string): URL | null {
  const withScheme = /^[a-z][a-z0-9+.-]*:\/\//i.test(raw) ? raw : `https://${raw}`
  try {
    const url = new URL(withScheme)
    return url.hostname.includes('.') ? url : null
  } catch {
    return null
  }
}

function placeIdFromUrl(url: URL) {
  for (const name of PLACE_ID_PARAMS) {
    const value = url.searchParams.get(name)?.trim()
    if (value && PLACE_ID_PATTERN.test(value)) return value
  }
  return ''
}

const ready = (placeId: string, note = ''): ReviewInput => ({
  status: 'ready',
  placeId,
  link: buildReviewLink(placeId),
  note,
})

export function parseReviewInput(raw: string): ReviewInput {
  const text = raw.trim()
  if (!text) return { status: 'empty' }
  if (PLAIN_PLACE_ID_PATTERN.test(text)) return ready(text)
  const url = tryUrl(text)
  if (!url) return { status: 'invalid', error: ERRORS.other }
  const fromUrl = placeIdFromUrl(url)
  if (fromUrl) return ready(fromUrl, 'מזהה המקום נלקח מהקישור שהדבקתם.')
  if (SHORT_HOSTS.includes(url.hostname)) return { status: 'invalid', error: ERRORS.short }
  if (url.hostname.includes('google.') || url.hostname === 'g.page') return { status: 'invalid', error: ERRORS.maps }
  return { status: 'invalid', error: ERRORS.other }
}

const nameOrDefault = (business: string) => business.trim() || 'העסק שלנו'

export const messageTemplates: MessageTemplate[] = [
  {
    id: 'short',
    label: 'קצרה',
    build: (business, link) =>
      `שלום, תודה שפנית ל${nameOrDefault(business)}. נשמח לשמוע מה דעתך על החוויה שלך, בביקורת קצרה בגוגל: ${link}`,
  },
  {
    id: 'warm',
    label: 'אישית',
    build: (business, link) =>
      `היי, תודה שבחרת ב${nameOrDefault(business)}. ביקורת כנה בגוגל עוזרת ללקוחות אחרים להחליט, ולנו להשתפר. אפשר לכתוב אותה כאן, זה לוקח דקה: ${link}`,
  },
  {
    id: 'after',
    label: 'אחרי שירות',
    build: (business, link) =>
      `שלום, זה ${nameOrDefault(business)}. אם יש לך זמן, נשמח שתכתוב בגוגל איך היה השירות, מה שהיה טוב ומה שפחות: ${link}`,
  },
]

export const whatsappShareUrl = (message: string) => `https://wa.me/?text=${encodeURIComponent(message)}`

export const smsUrl = (message: string) => `sms:?&body=${encodeURIComponent(message)}`
