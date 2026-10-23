import { dayNumberOf, hebrewDateLetters, parseIso, supportsHebrewCalendar, toHebrew, weekdayOf } from '@/lib/hebrew-date'

export type EventId = 'wedding' | 'bar' | 'bat'
export type ToneId = 'traditional' | 'religious' | 'haredi' | 'chabad' | 'secular' | 'modern'
export type PrintSize = 'A4' | 'A5'

export type InvitationInput = {
  event: EventId
  tone: ToneId
  variant: number
  groom: string
  bride: string
  groomParents: string
  brideParents: string
  date: string
  hebrewDate: boolean
  reception: string
  ceremony: string
  venue: string
  address: string
  rsvp: string
  note: string
  signature: string
}

export const emptyInput: InvitationInput = {
  event: 'wedding',
  tone: 'traditional',
  variant: 0,
  groom: '',
  bride: '',
  groomParents: '',
  brideParents: '',
  date: '',
  hebrewDate: true,
  reception: '',
  ceremony: '',
  venue: '',
  address: '',
  rsvp: '',
  note: '',
  signature: '',
}

export const events: { id: EventId; label: string }[] = [
  { id: 'wedding', label: 'חתונה' },
  { id: 'bar', label: 'בר מצווה' },
  { id: 'bat', label: 'בת מצווה' },
]

export const tones: { id: ToneId; label: string; hint: string }[] = [
  { id: 'traditional', label: 'מסורתי', hint: 'רשמי ומכובד, בלי כותרת דתית' },
  { id: 'religious', label: 'דתי', hint: 'פותח ב״בס״ד״' },
  { id: 'haredi', label: 'חרדי', hint: 'פותח ב״בס״ד״, לשון נתכבד' },
  { id: 'chabad', label: 'חב״ד', hint: 'פותח ב״ב״ה״' },
  { id: 'secular', label: 'חילוני', hint: 'חם ופשוט, בלי ביטויים דתיים' },
  { id: 'modern', label: 'מודרני', hint: 'קליל וקצר, מתאים לוואטסאפ' },
]

export const VARIANT_COUNT = 4

export const printSizes: { id: PrintSize; label: string }[] = [
  { id: 'A4', label: 'A4' },
  { id: 'A5', label: 'A5' },
]

export const labelsFor = (event: EventId) =>
  event === 'wedding'
    ? {
        first: 'שם החתן',
        second: 'שם הכלה',
        firstParents: 'הורי החתן',
        secondParents: 'הורי הכלה',
        ceremony: 'שעת החופה',
        ceremonyName: 'חופה וקידושין',
      }
    : {
        first: event === 'bar' ? 'שם בר המצווה' : 'שם בת המצווה',
        second: '',
        firstParents: 'ההורים',
        secondParents: '',
        ceremony: 'שעת הטקס',
        ceremonyName: 'טקס',
      }

const clean = (value: string) => value.replace(/\s+/g, ' ').trim()

const andName = (name: string) => (/^[A-Za-z0-9]/.test(name) ? `ו-${name}` : `ו${name}`)

type Phrases = {
  ours: string
  oursDear: string
  eventOf: string
  theirEvent: string
  invite: string
  withThem: string
  headline: string
  party: string
  blessing: string
  childOf: string
}

const phrasesFor = (event: EventId, first: string, second: string): Phrases => {
  if (event === 'wedding') {
    const names = `${first} ${andName(second)}`
    return {
      ours: 'שמחת נישואי ילדינו',
      oursDear: 'שמחת נישואי ילדינו היקרים',
      eventOf: `חתונת ${names}`,
      theirEvent: 'חתונתם',
      invite: 'מתכבדים',
      withThem: 'איתם',
      headline: `${names} מתחתנים!`,
      party: 'אהבה, אוכל ומוזיקה',
      blessing: 'קול ששון וקול שמחה, קול חתן וקול כלה',
      childOf: 'בנם של',
    }
  }
  if (event === 'bar') {
    return {
      ours: 'שמחת בר המצווה של בננו',
      oursDear: 'שמחת בר המצווה של בננו היקר',
      eventOf: `בר המצווה של ${first}`,
      theirEvent: 'בר המצווה שלו',
      invite: 'מתכבד',
      withThem: 'איתו',
      headline: `${first} הופך לבר מצווה!`,
      party: 'אוכל, מוזיקה וחברים',
      blessing: 'שהחיינו וקיימנו והגיענו לזמן הזה',
      childOf: 'בנם של',
    }
  }
  return {
    ours: 'שמחת בת המצווה של בתנו',
    oursDear: 'שמחת בת המצווה של בתנו היקרה',
    eventOf: `בת המצווה של ${first}`,
    theirEvent: 'בת המצווה שלה',
    invite: 'מתכבדת',
    withThem: 'איתה',
    headline: `${first} הופכת לבת מצווה!`,
    party: 'אוכל, מוזיקה וחברים',
    blessing: 'שהחיינו וקיימנו והגיענו לזמן הזה',
    childOf: 'בתם של',
  }
}

type Context = {
  p: Phrases
  names: string
  celebrants: string[]
  parentLines: string[]
}

type Variant = { inline: boolean; open: (c: Context) => string[] }

const celebrantLines = (input: InvitationInput, first: string, second: string, p: Phrases) => {
  const lines = [first]
  const firstParents = clean(input.groomParents)
  if (firstParents) lines.push(`${p.childOf} ${firstParents}`)
  if (input.event === 'wedding') {
    lines.push(andName(second))
    const secondParents = clean(input.brideParents)
    if (secondParents) lines.push(`בתם של ${secondParents}`)
  }
  return lines
}

const parentLabelLines = (input: InvitationInput) => {
  const lines: string[] = []
  const firstParents = clean(input.groomParents)
  const secondParents = clean(input.brideParents)
  if (input.event === 'wedding') {
    if (firstParents) lines.push(`הורי החתן: ${firstParents}`)
    if (secondParents) lines.push(`הורי הכלה: ${secondParents}`)
  } else if (firstParents) {
    lines.push(`ההורים: ${firstParents}`)
  }
  return lines
}

const variants: Record<ToneId, Variant[]> = {
  traditional: [
    {
      inline: false,
      open: (c) => [`בשמחה רבה מתכבדים להזמינכם להשתתף ב${c.p.ours}`, ...c.celebrants],
    },
    {
      inline: true,
      open: (c) => [`${c.names} ${c.p.invite} להזמינכם ל${c.p.theirEvent}`],
    },
    {
      inline: true,
      open: (c) => [`אנו שמחים להזמינכם ל${c.p.eventOf}`],
    },
    {
      inline: true,
      open: (c) => [c.p.blessing, `בשמחה מזמינים אתכם ל${c.p.eventOf}`],
    },
  ],
  religious: [
    {
      inline: false,
      open: (c) => ['בס״ד', `בשעה טובה ומוצלחת מתכבדים להזמינכם ל${c.p.ours}`, ...c.celebrants],
    },
    {
      inline: true,
      open: (c) => ['בס״ד', `בעזרת השם, ${c.names} ${c.p.invite} להזמינכם ל${c.p.theirEvent}`],
    },
    {
      inline: true,
      open: (c) => ['בס״ד', c.p.blessing, `אנו שמחים להזמינכם ל${c.p.eventOf}`],
    },
    {
      inline: true,
      open: (c) => ['בס״ד', `מודים לה׳ ומתכבדים להזמינכם ל${c.p.eventOf}`],
    },
  ],
  haredi: [
    {
      inline: false,
      open: (c) => ['בס״ד', `בשעה טובה ומוצלחת נתכבד להזמינכם להשתתף ב${c.p.oursDear}`, ...c.celebrants],
    },
    {
      inline: false,
      open: (c) => ['בס״ד', `בסייעתא דשמיא, נתכבד להזמינכם ל${c.p.oursDear}`, ...c.celebrants],
    },
    {
      inline: true,
      open: (c) => ['בס״ד', `בשמחה ובהודיה לבורא עולם נתכבד להזמינכם ל${c.p.eventOf}`],
    },
    {
      inline: true,
      open: (c) => ['בס״ד', `נתכבד להזמינכם ל${c.p.eventOf} ולבקש שתשמחו עמנו`],
    },
  ],
  chabad: [
    {
      inline: false,
      open: (c) => ['ב״ה', `בשעה טובה ומוצלחת נתכבד להזמינכם להשתתף ב${c.p.oursDear}`, ...c.celebrants],
    },
    {
      inline: true,
      open: (c) => ['ב״ה', `בעזרת השם יתברך, ${c.names} ${c.p.invite} להזמינכם ל${c.p.theirEvent}`],
    },
    {
      inline: true,
      open: (c) => ['ב״ה', `בשמחה ובהודיה לה׳ נשמח לראותכם ב${c.p.eventOf}`],
    },
    {
      inline: true,
      open: (c) => ['ב״ה', `נתכבד להזמינכם לשמוח עמנו ב${c.p.eventOf}`],
    },
  ],
  secular: [
    {
      inline: true,
      open: (c) => [`אנחנו שמחים להזמין אתכם ל${c.p.eventOf}`],
    },
    {
      inline: true,
      open: (c) => [`${c.names} מזמינים אתכם ל${c.p.theirEvent}`],
    },
    {
      inline: true,
      open: (c) => ['בואו לחגוג איתנו!', c.p.eventOf],
    },
    {
      inline: true,
      open: (c) => [`הגיע הזמן לרקוד. נשמח שתהיו איתנו ב${c.p.eventOf}`],
    },
  ],
  modern: [
    {
      inline: true,
      open: (c) => [c.p.headline, `ואתם מוזמנים לחגוג ${c.p.withThem}`],
    },
    {
      inline: true,
      open: (c) => ['שמרו את התאריך', c.p.eventOf],
    },
    {
      inline: true,
      open: (c) => [`${c.names} מזמינים אתכם לערב של ${c.p.party}`],
    },
    {
      inline: true,
      open: (c) => [`בואו כמו שאתם, ונחגוג ${c.p.withThem}`, c.p.eventOf],
    },
  ],
}

const closings: Record<ToneId, string> = {
  traditional: 'נשמח לראותכם ולשמוח יחד',
  religious: 'נשמח לראותכם ולשמוח יחד',
  haredi: 'נשמח לראותכם ולקבל את ברכתכם',
  chabad: 'נשמח לראותכם',
  secular: 'מחכים לכם',
  modern: 'נתראה על הרחבה',
}

const hebrewDateByDefault: Record<ToneId, boolean> = {
  traditional: true,
  religious: true,
  haredi: true,
  chabad: true,
  secular: false,
  modern: false,
}

export const defaultHebrewDate = (tone: ToneId) => hebrewDateByDefault[tone]

export const dateIsValid = (iso: string) => iso === '' || parseIso(iso) !== null

export const dateLabel = (iso: string, withHebrew: boolean) => {
  const dayNumber = parseIso(iso)
  if (dayNumber === null) return ''
  const [year, month, day] = iso.split('-').map(Number)
  const civil = `${day}.${month}.${year}`
  const weekday = weekdayOf(dayNumber)
  try {
    if (!withHebrew || !supportsHebrewCalendar()) return `${weekday}, ${civil}`
    const hebrew = hebrewDateLetters(toHebrew(dayNumberOf(year, month, day))).replace(/ ה׳/, ' ')
    return `${weekday}, ${hebrew} (${civil})`
  } catch {
    return `${weekday}, ${civil}`
  }
}

export const hasNames = (input: InvitationInput) => {
  if (clean(input.groom) === '') return false
  return input.event !== 'wedding' || clean(input.bride) !== ''
}

const detailLines = (input: InvitationInput) => {
  const plainTone = input.tone === 'secular' || input.tone === 'modern'
  const ceremonyName = input.event === 'wedding' && plainTone ? 'חופה' : labelsFor(input.event).ceremonyName
  const lines: string[] = []
  const when = dateLabel(input.date, input.hebrewDate)
  if (when) lines.push(when)
  const reception = clean(input.reception)
  const ceremony = clean(input.ceremony)
  if (reception) lines.push(`קבלת פנים: ${reception}`)
  if (ceremony) lines.push(`${ceremonyName}: ${ceremony}`)
  const venue = clean(input.venue)
  const address = clean(input.address)
  if (venue) lines.push(venue)
  if (address) lines.push(address)
  const rsvp = clean(input.rsvp)
  if (rsvp) lines.push(`אישורי הגעה: ${rsvp}`)
  const note = clean(input.note)
  if (note) lines.push(note)
  return lines
}

export const buildLines = (input: InvitationInput) => {
  if (!hasNames(input)) return []
  const first = clean(input.groom)
  const second = clean(input.bride)
  const p = phrasesFor(input.event, first, second)
  const variant = variants[input.tone][input.variant % VARIANT_COUNT]
  const context: Context = {
    p,
    names: input.event === 'wedding' ? `${first} ${andName(second)}` : first,
    celebrants: celebrantLines(input, first, second, p),
    parentLines: parentLabelLines(input),
  }
  const lines = [...variant.open(context)]
  if (variant.inline) lines.push(...context.parentLines)
  const details = detailLines(input)
  if (details.length) lines.push('', ...details)
  lines.push('', closings[input.tone])
  const signature = clean(input.signature)
  if (signature) lines.push(signature)
  return lines
}

export const buildPlain = (input: InvitationInput) => buildLines(input).join('\n')

export const buildWhatsApp = (input: InvitationInput) => {
  const when = dateLabel(input.date, input.hebrewDate)
  return buildLines(input)
    .map((line) => (when && line === when ? `*${line}*` : line))
    .join('\n')
}

const escapeHtml = (value: string) =>
  value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

export const buildPrintHtml = (input: InvitationInput, size: PrintSize) => {
  const lines = buildLines(input)
  const scale = size === 'A4' ? 1 : 0.72
  const body = lines
    .map((line) => (line === '' ? '<div class="gap"></div>' : `<p>${escapeHtml(line)}</p>`))
    .join('')
  const title = escapeHtml(`הזמנה ${clean(input.groom)}`)
  const css = `@page{size:${size};margin:12mm}html,body{margin:0;padding:0}body{font-family:'David Libre','Frank Ruhl Libre',Georgia,'Times New Roman',serif;color:#1a1a1a}.frame{box-sizing:border-box;border:2px solid #8a6d3b;outline:1px solid #8a6d3b;outline-offset:-8px;padding:${Math.round(22 * scale)}mm ${Math.round(14 * scale)}mm;text-align:center;font-size:${Math.round(20 * scale)}pt;line-height:1.7;min-height:${size === 'A4' ? '255mm' : '174mm'};display:flex;flex-direction:column;justify-content:center}p{margin:0 0 ${Math.round(3 * scale)}mm}.gap{height:${Math.round(8 * scale)}mm}`
  return `<!doctype html><html lang="he" dir="rtl"><head><meta charset="utf-8"><title>${title}</title><style>${css}</style></head><body><div class="frame">${body}</div></body></html>`
}
