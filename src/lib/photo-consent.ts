export type SubjectType = 'adult' | 'minor'
export type ChannelId = 'site' | 'instagram' | 'facebook' | 'ads' | 'print'
export type DurationId = '1y' | '2y' | '3y' | 'unlimited'
export type FaceMode = 'visible' | 'blurred'
export type NameMode = 'none' | 'first' | 'full'

export type ConsentInput = {
  businessName: string
  businessId: string
  businessContact: string
  subjectType: SubjectType
  personName: string
  guardianName: string
  guardianRelation: string
  shootDate: string
  shootDescription: string
  channels: ChannelId[]
  otherChannel: string
  duration: DurationId
  face: FaceMode
  nameMode: NameMode
  beforeAfter: boolean
  removalDays: string
  signDate: string
}

export type ConsentSection = { heading: string; items: string[] }

export type ConsentModel = {
  title: string
  business: string
  businessLine: string
  intro: string
  sections: ConsentSection[]
  signatures: { label: string; name: string }[]
  signDate: string
  fileTitle: string
}

export const channels: { id: ChannelId; label: string; clause: string }[] = [
  { id: 'site', label: 'אתר העסק', clause: 'אתר האינטרנט של העסק' },
  { id: 'instagram', label: 'אינסטגרם', clause: 'חשבון האינסטגרם של העסק' },
  { id: 'facebook', label: 'פייסבוק', clause: 'עמוד הפייסבוק של העסק' },
  { id: 'ads', label: 'מודעות ממומנות', clause: 'מודעות ממומנות ברשתות החברתיות ובמנועי חיפוש' },
  { id: 'print', label: 'דפוס', clause: 'חומרים מודפסים, כמו עלונים, שלטים וקטלוגים' },
]

export const durations: { id: DurationId; label: string }[] = [
  { id: '1y', label: 'שנה' },
  { id: '2y', label: 'שנתיים' },
  { id: '3y', label: '3 שנים' },
  { id: 'unlimited', label: 'עד שאבטל' },
]

export const nameModes: { id: NameMode; label: string }[] = [
  { id: 'none', label: 'בלי שם' },
  { id: 'first', label: 'שם פרטי בלבד' },
  { id: 'full', label: 'שם מלא' },
]

const BLANK = '____________'

const or = (value: string, fallback = BLANK) => value.trim() || fallback

export const defaultConsentInput = (today: string): ConsentInput => ({
  businessName: '',
  businessId: '',
  businessContact: '',
  subjectType: 'adult',
  personName: '',
  guardianName: '',
  guardianRelation: 'הורה',
  shootDate: today,
  shootDescription: '',
  channels: ['site', 'instagram', 'facebook'],
  otherChannel: '',
  duration: '2y',
  face: 'visible',
  nameMode: 'none',
  beforeAfter: false,
  removalDays: '14',
  signDate: today,
})

export const sampleConsentInput = (today: string): ConsentInput => ({
  ...defaultConsentInput(today),
  businessName: 'סטודיו לדוגמה בע״מ',
  businessId: '515000000',
  businessContact: 'studio@example.co.il',
  subjectType: 'minor',
  personName: 'נועה לוי',
  guardianName: 'דנה לוי',
  guardianRelation: 'הורה',
  shootDescription: 'צילומי חוג ריקוד בסטודיו',
  channels: ['site', 'instagram'],
  duration: '1y',
  face: 'visible',
  nameMode: 'none',
})

export function formatHebrewDate(iso: string): string {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso)
  if (!match) return BLANK
  return `${Number(match[3])}.${Number(match[2])}.${match[1]}`
}

export function removalDaysValue(input: ConsentInput): number {
  const days = Number(input.removalDays)
  return Number.isInteger(days) && days >= 1 && days <= 60 ? days : 14
}

const durationText = (input: ConsentInput) => {
  const from = `מיום ${formatHebrewDate(input.signDate)}`
  if (input.duration === 'unlimited') return `ההסכמה בתוקף ${from} ועד שאבטל אותה כמפורט בסעיף ״ביטול ההסכמה״.`
  const label = durations.find((item) => item.id === input.duration)?.label ?? ''
  return `ההסכמה בתוקף ${label} ${from}. בתום התקופה העסק לא יפרסם את התמונות מחדש ולא ישתמש בהן בפרסומים חדשים בלי הסכמה חדשה.`
}

export function selectedChannelClauses(input: ConsentInput): string[] {
  const list = channels.filter((item) => input.channels.includes(item.id)).map((item) => item.clause)
  if (input.otherChannel.trim()) list.push(input.otherChannel.trim())
  return list
}

export function buildConsent(input: ConsentInput): ConsentModel {
  const minor = input.subjectType === 'minor'
  const business = or(input.businessName, 'שם העסק')
  const person = or(input.personName)
  const signer = minor ? or(input.guardianName) : person
  const who = minor ? `הקטין/ה ${person}` : 'אותי'
  const whose = minor ? `של הקטין/ה ${person}` : 'שלי'
  const days = removalDaysValue(input)
  const channelList = selectedChannelClauses(input)
  const contact = or(input.businessContact)

  const intro = minor
    ? `אני, ${signer}, ${or(input.guardianRelation, 'אפוטרופוס')} של ${person}, מסכים/ה שהעסק ${business} יצלם את ${who} ויפרסם את התמונות כמפורט בטופס זה. קראתי את הטופס והבנתי אותו לפני שחתמתי.`
    : `אני, ${person}, מסכים/ה שהעסק ${business} יצלם אותי ויפרסם את התמונות כמפורט בטופס זה. קראתי את הטופס והבנתי אותו לפני שחתמתי.`

  const what = [
    `הצילום: ${or(input.shootDescription, 'תיאור הצילום')}, ביום ${formatHebrewDate(input.shootDate)}.`,
    '״תמונות״ בטופס זה הן תצלומים וסרטונים מהצילום הזה בלבד.',
  ]

  const where = channelList.length
    ? channelList.map((item) => `${item}.`)
    : ['לא סומן אף ערוץ, ולכן ההסכמה היא לצילום בלבד, בלי פרסום.']

  const how = [
    input.face === 'blurred'
      ? `הפנים ${whose} יטושטשו או ייחתכו בכל תמונה שתפורסם, כך שלא יהיה אפשר לזהות אותן.`
      : `התמונות יפורסמו כך שרואים את הפנים ${whose}.`,
    input.nameMode === 'none'
      ? `השם ${whose} לא יופיע ליד התמונות ולא יתויג.`
      : input.nameMode === 'first'
        ? `ליד התמונות יכול להופיע השם הפרטי ${whose} בלבד.`
        : `ליד התמונות יכול להופיע השם המלא ${whose}.`,
    'העסק לא ימכור את התמונות ולא ימסור אותן לאחרים, למעט ספקים שמפרסמים בשמו, כמו מעצב או מנהל קמפיינים.',
    'העסק לא יערוך את התמונות באופן שמשנה את המראה או את המשמעות שלהן, מעבר לחיתוך, תאורה וצבע.',
  ]
  if (input.beforeAfter) {
    how.push(
      'התמונות כוללות צילומי ״לפני ואחרי״ של טיפול. אני יודע/ת שתמונות כאלה עלולות לחשוף מידע על מצב בריאותי, ומסכים/ה במפורש לפרסם אותן בערוצים שסומנו.',
      'לצד התמונות לא יפורסמו פרטים רפואיים נוספים, כמו אבחנה, תרופות או היסטוריה רפואית.',
    )
  }

  const withdraw = [
    `אפשר לבטל את ההסכמה בכל עת, בהודעה ל-${contact}.`,
    `תוך ${days} ימים מקבלת ההודעה העסק יסיר את התמונות מהאתר, מהרשתות שלו ומהמודעות הפעילות, ולא ישתמש בהן בפרסומים חדשים.`,
    'ביטול ההסכמה לא מחייב לאסוף חומר מודפס שכבר חולק, ולא חל על שיתופים ועותקים שאנשים אחרים יצרו לפני ההסרה, שהעסק לא שולט בהם.',
  ]
  if (minor) withdraw.push('הקטין/ה רשאי/ת לבקש את ההסרה גם בעצמו/ה, והעסק יפעל לפי הבקשה.')

  const consideration = ['ההסכמה ניתנת בלי תמורה, אלא אם נכתב אחרת בהסכם נפרד בין הצדדים.']

  const sections: ConsentSection[] = [
    { heading: 'מה מצולם', items: what },
    { heading: 'איפה מותר לפרסם', items: where },
    { heading: 'איך מפרסמים', items: how },
    { heading: 'כמה זמן', items: [durationText(input)] },
    { heading: 'ביטול ההסכמה', items: withdraw },
    { heading: 'תמורה', items: consideration },
  ]

  const signatures = minor
    ? [
        { label: `חתימת ${or(input.guardianRelation, 'האפוטרופוס')}`, name: signer },
        { label: 'חתימת האפוטרופוס השני (אם יש)', name: BLANK },
        { label: 'חתימה בשם העסק', name: business },
      ]
    : [
        { label: 'חתימת המצולם/ת', name: person },
        { label: 'חתימה בשם העסק', name: business },
      ]

  return {
    title: 'טופס הסכמה לצילום ולפרסום תמונות',
    business,
    businessLine: input.businessId.trim() ? `ח.פ./ע.מ. ${input.businessId.trim()}` : '',
    intro,
    sections,
    signatures,
    signDate: formatHebrewDate(input.signDate),
    fileTitle: `הסכמה לצילום - ${input.personName.trim() || 'טופס'}`,
  }
}

export function consentToText(model: ConsentModel): string {
  const lines = [model.business, model.businessLine, '', model.title, '', model.intro, '']
  model.sections.forEach((section, index) => {
    lines.push(`${index + 1}. ${section.heading}`)
    section.items.forEach((item) => lines.push(`- ${item}`))
    lines.push('')
  })
  lines.push(`תאריך: ${model.signDate}`, '')
  model.signatures.forEach((item) => lines.push(`${item.label}: ${item.name}`, 'חתימה: ____________', ''))
  return lines.filter((line, index, all) => !(line === '' && all[index - 1] === '')).join('\n').trim()
}

export const escapeHtml = (value: string) =>
  value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

const documentCss = `@page{size:A4;margin:16mm 18mm}
*{box-sizing:border-box}
body{margin:0;background:#ece8e2;color:#1a1f33;font:14px/1.6 Arial,"Segoe UI",Helvetica,sans-serif}
.sheet{width:210mm;min-height:297mm;margin:24px auto;padding:18mm 20mm;background:#fff}
.head{padding-bottom:10px;border-bottom:2px solid #1a1f33}
.biz{margin:0;font-size:19px;font-weight:700}
.muted{margin:2px 0 0;color:#5c6072;font-size:12px}
h1{margin:18px 0 10px;font-size:18px}
h2{margin:14px 0 4px;font-size:14.5px}
p{margin:0 0 6px}
ul{margin:0 0 6px;padding-inline-start:20px}
li{margin-bottom:3px}
.date{margin-top:18px}
.signs{display:grid;grid-template-columns:repeat(2,1fr);gap:28px 32px;margin-top:22px;break-inside:avoid}
.sign{padding-top:34px}
.line{border-top:1px solid #1a1f33;padding-top:4px;font-size:12px;color:#5c6072}
@media print{body{background:#fff}.sheet{width:auto;min-height:0;margin:0;padding:0}}
@media screen and (max-width:820px){.sheet{width:auto;min-height:0;margin:0;padding:24px 16px}.signs{grid-template-columns:1fr}}`

export function consentDocument(model: ConsentModel): string {
  const sections = model.sections
    .map(
      (section, index) =>
        `<h2>${index + 1}. ${escapeHtml(section.heading)}</h2><ul>${section.items
          .map((item) => `<li>${escapeHtml(item)}</li>`)
          .join('')}</ul>`,
    )
    .join('')
  const signs = model.signatures
    .map(
      (item) =>
        `<div class="sign"><p>${escapeHtml(item.name)}</p><p class="line">${escapeHtml(item.label)}</p></div>`,
    )
    .join('')
  return `<!doctype html>
<html lang="he" dir="rtl">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${escapeHtml(model.fileTitle)}</title>
<style>${documentCss}</style>
</head>
<body>
<article class="sheet">
<header class="head"><p class="biz">${escapeHtml(model.business)}</p>${
    model.businessLine ? `<p class="muted">${escapeHtml(model.businessLine)}</p>` : ''
  }</header>
<h1>${escapeHtml(model.title)}</h1>
<p>${escapeHtml(model.intro)}</p>
${sections}
<p class="date">תאריך: ${escapeHtml(model.signDate)}</p>
<div class="signs">${signs}</div>
</article>
</body>
</html>
`
}
