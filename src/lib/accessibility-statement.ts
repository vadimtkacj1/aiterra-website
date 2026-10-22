export type StatementLevel = 'full' | 'partial'
export type StatementLanguage = 'he' | 'en'
export type AssessmentMethod = 'none' | 'self' | 'external'

export type StatementInput = {
  language: StatementLanguage
  orgName: string
  siteUrl: string
  level: StatementLevel
  measures: string[]
  assessment: AssessmentMethod
  assessedBy: string
  assessedOn: string
  browsers: string[]
  assistive: string[]
  gaps: string
  alternative: string
  thirdParty: boolean
  hasExemption: boolean
  exemption: string
  exemptionAlternative: string
  hasPremises: boolean
  premisesAddress: string
  premisesMeasures: string[]
  premisesServices: string
  premisesNotes: string
  hasCoordinator: boolean
  coordinatorName: string
  coordinatorPhone: string
  coordinatorEmail: string
  contactName: string
  contactPhone: string
  contactEmail: string
  responseDays: string
  updated: string
  credit: boolean
}

export type StatementOption = { id: string; label: string; he: string; en: string }

export type StatementBlock =
  | { kind: 'heading'; text: string }
  | { kind: 'paragraph'; text: string }
  | { kind: 'list'; items: string[] }
  | { kind: 'credit'; text: string; linkText: string; href: string }

export type CheckState = 'ok' | 'missing' | 'optional'
export type StatementCheck = { id: string; label: string; state: CheckState; note: string }

export const GENERATOR_URL = 'https://www.aiterra.co.il/tools/accessibility-statement-generator'

export const siteMeasures: StatementOption[] = [
  {
    id: 'keyboard',
    label: 'ניווט מלא במקלדת',
    he: 'אפשר לתפעל את האתר במלואו באמצעות מקלדת, והרכיב שבפוקוס מסומן בבירור.',
    en: 'The website can be fully operated with a keyboard, and the focused element is clearly marked.',
  },
  {
    id: 'alt',
    label: 'טקסט חלופי לתמונות',
    he: 'לתמונות בעלות משמעות יש טקסט חלופי שקוראי מסך מקריאים.',
    en: 'Meaningful images have alternative text that screen readers announce.',
  },
  {
    id: 'headings',
    label: 'כותרות וניווט עקבי',
    he: 'העמודים בנויים בכותרות מדורגות, והתפריט והניווט זהים בכל האתר.',
    en: 'Pages use a clear heading hierarchy, and menus and navigation are consistent across the site.',
  },
  {
    id: 'contrast',
    label: 'ניגודיות צבעים',
    he: 'הניגודיות בין הטקסט לרקע עומדת בדרישות התקן.',
    en: 'The contrast between text and background meets the requirements of the standard.',
  },
  {
    id: 'responsive',
    label: 'התאמה לנייד והגדלת טקסט',
    he: 'האתר מותאם לנייד ולמחשב, ואפשר להגדיל בו טקסט עד 200% בלי לאבד תוכן.',
    en: 'The website adapts to mobile and desktop, and text can be enlarged up to 200% without loss of content.',
  },
  {
    id: 'forms',
    label: 'טפסים נגישים',
    he: 'לכל שדה בטפסים יש תווית, והודעות שגיאה מוסברות בטקסט.',
    en: 'Every form field has a label, and error messages are explained in text.',
  },
  {
    id: 'language',
    label: 'הגדרת שפה בקוד',
    he: 'שפת העמודים מוגדרת בקוד, כך שקוראי מסך מקריאים את התוכן בשפה הנכונה.',
    en: 'The page language is set in the code, so screen readers read the content in the right language.',
  },
  {
    id: 'motion',
    label: 'עצירת תוכן נע',
    he: 'אפשר לעצור תוכן נע או מתחלף, ואין באתר תוכן מהבהב.',
    en: 'Moving or rotating content can be paused, and there is no flashing content on the site.',
  },
  {
    id: 'captions',
    label: 'כתוביות לסרטונים',
    he: 'לסרטונים באתר יש כתוביות.',
    en: 'Videos on the website have captions.',
  },
  {
    id: 'documents',
    label: 'מסמכים נגישים',
    he: 'מסמכים להורדה, כמו קובצי PDF, הונגשו.',
    en: 'Downloadable documents, such as PDF files, have been made accessible.',
  },
  {
    id: 'widget',
    label: 'תפריט נגישות',
    he: 'באתר יש תפריט נגישות להגדלת טקסט, שינוי ניגודיות והדגשת קישורים.',
    en: 'The website has an accessibility menu for enlarging text, changing contrast and highlighting links.',
  },
]

export const premisesMeasures: StatementOption[] = [
  { id: 'parking', label: 'חניית נכים', he: 'חניית נכים בסמוך לכניסה.', en: 'Accessible parking near the entrance.' },
  {
    id: 'entrance',
    label: 'כניסה נגישה',
    he: 'כניסה ללא מדרגות או עם רמפה.',
    en: 'Step-free entrance or a ramp.',
  },
  { id: 'toilet', label: 'שירותי נכים', he: 'שירותים נגישים.', en: 'Accessible restrooms.' },
  {
    id: 'seating',
    label: 'ישיבה נגישה',
    he: 'מקומות ישיבה נגישים באזור ההמתנה ובעמדת השירות.',
    en: 'Accessible seating in the waiting area and at the service desk.',
  },
  {
    id: 'hearing',
    label: 'עזר לשמיעה',
    he: 'מערכת עזר לשמיעה בעמדת השירות.',
    en: 'An assistive listening system at the service desk.',
  },
  {
    id: 'guideDog',
    label: 'כלב נחייה',
    he: 'הכניסה עם כלב נחייה מותרת.',
    en: 'Guide dogs are welcome.',
  },
]

export const browserOptions: StatementOption[] = [
  { id: 'chrome', label: 'Chrome', he: 'Chrome', en: 'Chrome' },
  { id: 'safari', label: 'Safari', he: 'Safari', en: 'Safari' },
  { id: 'firefox', label: 'Firefox', he: 'Firefox', en: 'Firefox' },
  { id: 'edge', label: 'Edge', he: 'Edge', en: 'Edge' },
]

export const assistiveOptions: StatementOption[] = [
  { id: 'nvda', label: 'NVDA', he: 'NVDA', en: 'NVDA' },
  { id: 'jaws', label: 'JAWS', he: 'JAWS', en: 'JAWS' },
  { id: 'voiceover', label: 'VoiceOver', he: 'VoiceOver', en: 'VoiceOver' },
  { id: 'talkback', label: 'TalkBack', he: 'TalkBack', en: 'TalkBack' },
]

export const defaultStatementInput = (today: string): StatementInput => ({
  language: 'he',
  orgName: '',
  siteUrl: '',
  level: 'full',
  measures: ['keyboard', 'alt', 'headings', 'contrast', 'responsive', 'forms', 'language'],
  assessment: 'none',
  assessedBy: '',
  assessedOn: '',
  browsers: [],
  assistive: [],
  gaps: '',
  alternative: '',
  thirdParty: true,
  hasExemption: false,
  exemption: '',
  exemptionAlternative: '',
  hasPremises: false,
  premisesAddress: '',
  premisesMeasures: [],
  premisesServices: '',
  premisesNotes: '',
  hasCoordinator: false,
  coordinatorName: '',
  coordinatorPhone: '',
  coordinatorEmail: '',
  contactName: '',
  contactPhone: '',
  contactEmail: '',
  responseDays: '',
  updated: today,
  credit: true,
})

export const sampleStatementInput = (today: string): StatementInput => ({
  ...defaultStatementInput(today),
  orgName: 'סטודיו לדוגמה',
  siteUrl: 'www.example.co.il',
  assessment: 'self',
  assessedOn: today,
  browsers: ['chrome', 'safari'],
  assistive: ['nvda', 'voiceover'],
  hasPremises: true,
  premisesAddress: 'רחוב הדוגמה 1, תל אביב',
  premisesMeasures: ['entrance', 'toilet', 'guideDog'],
  contactName: 'ישראל ישראלי',
  contactPhone: '03-0000000',
  contactEmail: 'access@example.co.il',
  responseDays: '5',
})

const copy = {
  he: {
    title: 'הצהרת נגישות',
    intro: (org: string, site: string) =>
      `אנחנו רואים חשיבות במתן שירות שוויוני לכל הלקוחות, כולל אנשים עם מוגבלות, ופעלנו להנגשת האתר של ${org} (${site}) בהתאם לתקנות שוויון זכויות לאנשים עם מוגבלות (התאמות נגישות לשירות), התשע״ג-2013.`,
    levelTitle: 'רמת הנגישות באתר',
    levelFull: 'האתר עומד בדרישות התקן הישראלי ת״י 5568 ברמת AA.',
    levelPartial:
      'אנחנו פועלים להתאמת האתר לתקן הישראלי ת״י 5568 ברמת AA. חלק מהאתר עדיין אינו עומד בכל הדרישות, והפירוט מופיע בהמשך.',
    measuresTitle: 'התאמות הנגישות באתר',
    assessmentTitle: 'בדיקת הנגישות',
    assessedSelf: (date: string) => `הנגישות באתר נבדקה על ידי הצוות שלנו${date ? ` בתאריך ${date}` : ''}.`,
    assessedExternal: (by: string, date: string) =>
      `הנגישות באתר נבדקה על ידי ${by || 'גורם חיצוני'}${date ? ` בתאריך ${date}` : ''}.`,
    compatibilityTitle: 'תאימות',
    browsers: (list: string) => `האתר נבדק בדפדפנים ${list}.`,
    assistive: (list: string) => `האתר נבדק עם הטכנולוגיות המסייעות ${list}.`,
    gapsTitle: 'חלקים שאינם נגישים במלואם',
    gapsDefault: 'ייתכן שחלקים מסוימים באתר עדיין אינם נגישים במלואם.',
    thirdParty:
      'תכנים מצדדים שלישיים, כמו סרטונים מוטמעים, מפות או טפסים חיצוניים, עשויים שלא להיות נגישים במלואם, ואין לנו שליטה עליהם.',
    alternativeDefault: 'אם נתקלתם בתוכן שאינו נגיש, פנו אלינו בפרטים שבהמשך ונמסור לכם את המידע בדרך חלופית.',
    exemptionTitle: 'פטור והתאמות חלופיות',
    exemption: (text: string) => `קיבלנו פטור מהתאמת נגישות לפי תקנה 35ו: ${text}`,
    exemptionAlternative: (text: string) => `ההתאמה החלופית שאנחנו מספקים: ${text}`,
    premisesTitle: 'הסדרי נגישות במקום',
    address: (text: string) => `כתובת: ${text}`,
    services: (text: string) => `שירותי עזר שאפשר לקבל לפי בקשה: ${text}`,
    coordinatorTitle: 'רכז הנגישות',
    name: 'שם',
    phone: 'טלפון',
    email: 'דוא״ל',
    contactTitle: 'פנייה בנושא נגישות',
    contactIntro: 'נתקלתם בבעיית נגישות באתר או בשירות, או שאתם צריכים התאמה? נשמח לשמוע ולטפל.',
    contactMissing: '[פרטי יצירת קשר]',
    contactTip: 'כדי שנוכל לטפל בפנייה, כדאי לציין את כתובת העמוד, תיאור הבעיה והטכנולוגיה המסייעת שבה השתמשתם.',
    response: (days: string) => `נשתדל לחזור אליכם בתוך ${days} ימי עבודה.`,
    updated: (date: string) => `ההצהרה עודכנה בתאריך ${date}.`,
    creditText: 'ההצהרה נוצרה באמצעות',
    creditLink: 'מחולל הצהרת הנגישות של AITERRA',
    orgMissing: '[שם העסק]',
    siteMissing: '[כתובת האתר]',
    and: ' ו-',
  },
  en: {
    title: 'Accessibility statement',
    intro: (org: string, site: string) =>
      `We are committed to providing equal service to all customers, including people with disabilities, and have worked to make the website of ${org} (${site}) accessible in accordance with the Equal Rights for Persons with Disabilities (Service Accessibility Adjustments) Regulations, 2013.`,
    levelTitle: 'Accessibility level',
    levelFull: 'The website conforms to Israeli Standard IS 5568 at level AA.',
    levelPartial:
      'We are working to bring the website into conformance with Israeli Standard IS 5568 at level AA. Some parts do not yet meet every requirement, and the details are listed below.',
    measuresTitle: 'Accessibility features of the website',
    assessmentTitle: 'Accessibility testing',
    assessedSelf: (date: string) => `The website was tested for accessibility by our team${date ? ` on ${date}` : ''}.`,
    assessedExternal: (by: string, date: string) =>
      `The website was tested for accessibility by ${by || 'an external reviewer'}${date ? ` on ${date}` : ''}.`,
    compatibilityTitle: 'Compatibility',
    browsers: (list: string) => `The website was tested in ${list}.`,
    assistive: (list: string) => `The website was tested with the assistive technologies ${list}.`,
    gapsTitle: 'Parts that are not fully accessible',
    gapsDefault: 'Some parts of the website may not yet be fully accessible.',
    thirdParty:
      'Content provided by third parties, such as embedded videos, maps or external forms, may not be fully accessible, and we do not control it.',
    alternativeDefault:
      'If you come across content that is not accessible, contact us using the details below and we will provide the information in an alternative way.',
    exemptionTitle: 'Exemption and alternative accommodations',
    exemption: (text: string) => `We received an exemption from an accessibility adjustment under Regulation 35F: ${text}`,
    exemptionAlternative: (text: string) => `The alternative accommodation we provide: ${text}`,
    premisesTitle: 'Accessibility at our premises',
    address: (text: string) => `Address: ${text}`,
    services: (text: string) => `Auxiliary services available on request: ${text}`,
    coordinatorTitle: 'Accessibility coordinator',
    name: 'Name',
    phone: 'Phone',
    email: 'Email',
    contactTitle: 'Accessibility feedback',
    contactIntro:
      'If you encountered an accessibility problem on the website or in our service, or need an accommodation, we would like to hear from you.',
    contactMissing: '[Contact details]',
    contactTip:
      'To help us handle your request, please include the page address, a description of the problem and the assistive technology you used.',
    response: (days: string) => `We aim to respond within ${days} business days.`,
    updated: (date: string) => `This statement was last updated on ${date}.`,
    creditText: 'This statement was created with the',
    creditLink: 'AITERRA accessibility statement generator',
    orgMissing: '[Business name]',
    siteMissing: '[Website address]',
    and: ' and ',
  },
}

const pick = (options: StatementOption[], ids: string[], language: StatementLanguage) =>
  options.filter((option) => ids.includes(option.id)).map((option) => option[language])

const joinList = (items: string[], and: string) =>
  items.length < 2 ? items.join('') : `${items.slice(0, -1).join(', ')}${and}${items[items.length - 1]}`

export const formatDate = (iso: string) => {
  const [year, month, day] = iso.split('-')
  return year && month && day ? `${day}.${month}.${year}` : iso
}

const clean = (value: string) => value.trim().replace(/[.\s]+$/, '')

const sentence = (value: string) => {
  const text = value.trim()
  return /[.!?]$/.test(text) ? text : `${text}.`
}

export function buildStatement(input: StatementInput): StatementBlock[] {
  const t = copy[input.language]
  const org = input.orgName.trim() || t.orgMissing
  const site = input.siteUrl.trim().replace(/^https?:\/\//, '').replace(/\/$/, '') || t.siteMissing
  const blocks: StatementBlock[] = [
    { kind: 'heading', text: t.title },
    { kind: 'paragraph', text: t.intro(org, site) },
    { kind: 'heading', text: t.levelTitle },
    { kind: 'paragraph', text: input.level === 'full' ? t.levelFull : t.levelPartial },
  ]

  const measures = pick(siteMeasures, input.measures, input.language)
  if (measures.length) blocks.push({ kind: 'heading', text: t.measuresTitle }, { kind: 'list', items: measures })

  if (input.assessment !== 'none') {
    const date = input.assessedOn ? formatDate(input.assessedOn) : ''
    blocks.push(
      { kind: 'heading', text: t.assessmentTitle },
      {
        kind: 'paragraph',
        text: input.assessment === 'self' ? t.assessedSelf(date) : t.assessedExternal(input.assessedBy.trim(), date),
      },
    )
  }

  const browsers = pick(browserOptions, input.browsers, input.language)
  const assistive = pick(assistiveOptions, input.assistive, input.language)
  if (browsers.length || assistive.length) {
    blocks.push({ kind: 'heading', text: t.compatibilityTitle })
    if (browsers.length) blocks.push({ kind: 'paragraph', text: t.browsers(joinList(browsers, t.and)) })
    if (assistive.length) blocks.push({ kind: 'paragraph', text: t.assistive(joinList(assistive, t.and)) })
  }

  const hasGaps = input.level === 'partial' || Boolean(input.gaps.trim())
  if (hasGaps || input.thirdParty) {
    blocks.push({ kind: 'heading', text: t.gapsTitle })
    if (hasGaps) blocks.push({ kind: 'paragraph', text: input.gaps.trim() ? sentence(input.gaps) : t.gapsDefault })
    if (input.thirdParty) blocks.push({ kind: 'paragraph', text: t.thirdParty })
    blocks.push({
      kind: 'paragraph',
      text: input.alternative.trim() ? sentence(input.alternative) : t.alternativeDefault,
    })
  }

  if (input.hasExemption && input.exemption.trim()) {
    blocks.push(
      { kind: 'heading', text: t.exemptionTitle },
      { kind: 'paragraph', text: t.exemption(sentence(input.exemption)) },
    )
    if (input.exemptionAlternative.trim()) {
      blocks.push({ kind: 'paragraph', text: t.exemptionAlternative(sentence(input.exemptionAlternative)) })
    }
  }

  if (input.hasPremises) {
    const premises = pick(premisesMeasures, input.premisesMeasures, input.language)
    blocks.push({ kind: 'heading', text: t.premisesTitle })
    if (input.premisesAddress.trim()) {
      blocks.push({ kind: 'paragraph', text: sentence(t.address(clean(input.premisesAddress))) })
    }
    if (premises.length) blocks.push({ kind: 'list', items: premises })
    if (input.premisesServices.trim()) {
      blocks.push({ kind: 'paragraph', text: sentence(t.services(clean(input.premisesServices))) })
    }
    if (input.premisesNotes.trim()) blocks.push({ kind: 'paragraph', text: sentence(input.premisesNotes) })
  }

  const lines = (name: string, phone: string, email: string) =>
    [
      name.trim() && `${t.name}: ${name.trim()}`,
      phone.trim() && `${t.phone}: ${phone.trim()}`,
      email.trim() && `${t.email}: ${email.trim()}`,
    ].filter((line): line is string => Boolean(line))

  const coordinator = lines(input.coordinatorName, input.coordinatorPhone, input.coordinatorEmail)
  if (input.hasCoordinator && coordinator.length) {
    blocks.push({ kind: 'heading', text: t.coordinatorTitle }, { kind: 'list', items: coordinator })
  }

  const contact = lines(input.contactName, input.contactPhone, input.contactEmail)
  blocks.push(
    { kind: 'heading', text: t.contactTitle },
    { kind: 'paragraph', text: t.contactIntro },
    { kind: 'list', items: contact.length ? contact : [t.contactMissing] },
    { kind: 'paragraph', text: t.contactTip },
  )
  const days = input.responseDays.trim()
  if (/^\d{1,2}$/.test(days) && Number(days) > 0) blocks.push({ kind: 'paragraph', text: t.response(days) })
  blocks.push({ kind: 'paragraph', text: t.updated(formatDate(input.updated)) })

  if (input.credit) {
    blocks.push({ kind: 'credit', text: t.creditText, linkText: t.creditLink, href: GENERATOR_URL })
  }

  return blocks
}

export function statementChecks(input: StatementInput): StatementCheck[] {
  const filled = (...values: string[]) => values.some((value) => value.trim())
  return [
    {
      id: 'business',
      label: 'שם העסק וכתובת האתר',
      state: filled(input.orgName) && filled(input.siteUrl) ? 'ok' : 'missing',
      note: 'כדי שיהיה ברור לאיזה אתר ההצהרה שייכת',
    },
    {
      id: 'measures',
      label: 'התאמות שבוצעו באתר',
      state: input.measures.length ? 'ok' : 'missing',
      note: 'נדרש בתקנה 35ה',
    },
    {
      id: 'contact',
      label: 'דרכי פנייה בנושא נגישות',
      state: filled(input.contactPhone, input.contactEmail) ? 'ok' : 'missing',
      note: 'נדרש בתקנה 35ה: טלפון או דוא״ל לפחות',
    },
    {
      id: 'coordinator',
      label: 'רכז נגישות',
      state: input.hasCoordinator
        ? filled(input.coordinatorName) && filled(input.coordinatorPhone, input.coordinatorEmail)
          ? 'ok'
          : 'missing'
        : 'optional',
      note: input.hasCoordinator ? 'שם ודרך פנייה, לפי תקנה 91(ה)' : 'חובה רק לעסק עם 25 עובדים ומעלה',
    },
    {
      id: 'premises',
      label: 'הסדרי נגישות במקום',
      state: input.hasPremises
        ? filled(input.premisesAddress, input.premisesNotes) || input.premisesMeasures.length
          ? 'ok'
          : 'missing'
        : 'optional',
      note: input.hasPremises ? 'לפי תקנה 34' : 'רלוונטי רק אם לקוחות מגיעים אליכם',
    },
    {
      id: 'exemption',
      label: 'פטור והתאמה חלופית',
      state: input.hasExemption
        ? filled(input.exemption) && filled(input.exemptionAlternative)
          ? 'ok'
          : 'missing'
        : 'optional',
      note: input.hasExemption ? 'לפי תקנה 35ו(ג)' : 'רק אם קיבלתם פטור מהתאמה',
    },
    {
      id: 'updated',
      label: 'תאריך עדכון',
      state: filled(input.updated) ? 'ok' : 'missing',
      note: 'כדי שיהיה ברור עד כמה ההצהרה עדכנית',
    },
  ]
}

const escapeHtml = (value: string) =>
  value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

export function statementToHtml(blocks: StatementBlock[], language: StatementLanguage): string {
  const body = blocks
    .map((block, index) => {
      if (block.kind === 'heading') {
        return index === 0 ? `<h1>${escapeHtml(block.text)}</h1>` : `<h2>${escapeHtml(block.text)}</h2>`
      }
      if (block.kind === 'paragraph') return `<p>${escapeHtml(block.text)}</p>`
      if (block.kind === 'list') {
        return `<ul>\n${block.items.map((item) => `  <li>${escapeHtml(item)}</li>`).join('\n')}\n</ul>`
      }
      return `<p>${escapeHtml(block.text)} <a href="${block.href}">${escapeHtml(block.linkText)}</a></p>`
    })
    .join('\n')
  const dir = language === 'he' ? 'rtl' : 'ltr'
  return `<section dir="${dir}" lang="${language}">\n${body}\n</section>`
}

export function statementToText(blocks: StatementBlock[]): string {
  return blocks
    .map((block) => {
      if (block.kind === 'heading') return `\n${block.text}`
      if (block.kind === 'paragraph') return block.text
      if (block.kind === 'list') return block.items.map((item) => `• ${item}`).join('\n')
      return `${block.text} ${block.linkText}: ${block.href}`
    })
    .join('\n')
    .trim()
}

export function statementDocument(blocks: StatementBlock[], language: StatementLanguage): string {
  const title = blocks[0]?.kind === 'heading' ? blocks[0].text : copy[language].title
  return `<!doctype html>
<html lang="${language}" dir="${language === 'he' ? 'rtl' : 'ltr'}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${escapeHtml(title)}</title>
<style>body{max-width:720px;margin:40px auto;padding:0 20px;font:16px/1.7 Arial,Helvetica,sans-serif;color:#1a1f33}h1{font-size:28px}h2{font-size:19px;margin-top:28px}a{color:#2447d6}</style>
</head>
<body>
${statementToHtml(blocks, language)}
</body>
</html>
`
}
