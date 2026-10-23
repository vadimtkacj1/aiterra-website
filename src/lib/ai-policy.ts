export type DisclosureMode = 'always' | 'external' | 'substantial'

export type PolicyOption = { id: string; label: string; text: string }

export type AiPolicyInput = {
  company: string
  effectiveDate: string
  owner: string
  contact: string
  tools: string[]
  otherTools: string
  orgAccountsOnly: boolean
  uses: string[]
  forbidden: string[]
  banned: string[]
  disclosure: DisclosureMode
  approvalDays: string
  reportHours: string
  reviewMonths: string
  acknowledgment: boolean
}

export type PolicyBlock =
  | { kind: 'title'; text: string }
  | { kind: 'meta'; text: string }
  | { kind: 'heading'; text: string }
  | { kind: 'clause'; number: string; text: string }
  | { kind: 'list'; items: string[] }
  | { kind: 'signature'; lines: string[] }

export const toolOptions: PolicyOption[] = [
  { id: 'chatgpt', label: 'ChatGPT', text: 'ChatGPT' },
  { id: 'claude', label: 'Claude', text: 'Claude' },
  { id: 'gemini', label: 'Gemini', text: 'Gemini' },
  { id: 'copilot', label: 'Microsoft Copilot', text: 'Microsoft Copilot' },
]

export const useOptions: PolicyOption[] = [
  { id: 'drafts', label: 'טיוטות של מיילים, מסמכים ותוכן', text: 'כתיבת טיוטות של מיילים, מסמכים, הצעות ותוכן שיווקי' },
  { id: 'summaries', label: 'סיכום ותרגום של חומר לא רגיש', text: 'סיכום, עריכה ותרגום של חומר שאינו כולל מידע אסור' },
  { id: 'ideas', label: 'רעיונות ותכנון', text: 'סיעור מוחות, תכנון משימות וחלוקת עבודה' },
  { id: 'code', label: 'עזרה בקוד', text: 'כתיבה ובדיקה של קוד, בלי להעלות קוד מקור של החברה או של לקוחות שלא אושר לכך' },
  { id: 'research', label: 'מחקר במידע פומבי', text: 'חיפוש וניתוח של מידע פומבי, תוך בדיקת המקורות' },
  { id: 'data', label: 'ניתוח נתונים בלי פרטים מזהים', text: 'ניתוח נתונים מצרפיים או נתונים שהוסרו מהם פרטים מזהים' },
]

export const forbiddenOptions: PolicyOption[] = [
  {
    id: 'personal',
    label: 'מידע אישי על לקוחות, עובדים או ספקים',
    text: 'מידע אישי על לקוחות, עובדים, מועמדים לעבודה או ספקים: שמות, מספרי זהות, טלפונים, כתובות, מיילים, ותמונות או הקלטות שאפשר לזהות בהן אדם',
  },
  {
    id: 'sensitive',
    label: 'מידע בעל רגישות מיוחדת',
    text: 'מידע בעל רגישות מיוחדת, ובכלל זה מידע על בריאות, נתוני שכר ופעילות פיננסית, מזהים ביומטריים, עבר פלילי, דעות ואמונות',
  },
  {
    id: 'clients',
    label: 'מידע סודי של לקוחות',
    text: 'מסמכים, נתונים ומידע של לקוחות שהחברה התחייבה לשמור בסוד, בחוזה, בהסכם סודיות או מכוח הדין',
  },
  {
    id: 'secrets',
    label: 'סודות מסחריים של החברה',
    text: 'סודות מסחריים של החברה: מחירונים פנימיים, נתונים כספיים שלא פורסמו, תוכניות עסקיות, רשימות לקוחות וקוד מקור',
  },
  {
    id: 'credentials',
    label: 'סיסמאות ומפתחות גישה',
    text: 'סיסמאות, מפתחות API, אסימוני גישה ופרטי התחברות לכל מערכת',
  },
]

export const bannedOptions: PolicyOption[] = [
  {
    id: 'decisions',
    label: 'החלטות על אנשים רק לפי AI',
    text: 'קבלת החלטה על אדם, כמו גיוס, פיטורים, קידום, מתן אשראי או דחיית לקוח, על סמך פלט של כלי בינה מלאכותית בלבד, בלי בדיקה ושיקול דעת של עובד מוסמך',
  },
  {
    id: 'bots',
    label: 'בוט מול לקוחות בלי אישור',
    text: 'הפעלת צ׳אטבוט, סוכן או מענה אוטומטי מול לקוחות או הציבור בלי אישור מראש לפי סעיף האישור במדיניות',
  },
  {
    id: 'impersonation',
    label: 'התחזות ותוכן מטעה',
    text: 'יצירת תוכן שמתחזה לאדם אמיתי, כולל קול או תמונה, או תוכן שנועד להטעות לקוחות',
  },
  {
    id: 'unapproved',
    label: 'כלים פרטיים ותוספים לא מאושרים',
    text: 'שימוש בכלים, בתוספים לדפדפן או באפליקציות בינה מלאכותית שלא אושרו, לצורכי עבודה',
  },
]

export const disclosureOptions: { id: DisclosureMode; label: string; text: string }[] = [
  {
    id: 'external',
    label: 'כשהתוכן יוצא ללקוח או לציבור',
    text: 'כשתוכן שנוצר ברובו בכלי בינה מלאכותית נמסר ללקוח או מתפרסם לציבור, העובד מציין זאת למנהל הישיר, והחברה מחליטה אם לציין זאת גם כלפי חוץ.',
  },
  {
    id: 'substantial',
    label: 'רק כשהתוכן נוצר ברובו בכלי',
    text: 'עובד שמגיש עבודה שנוצרה ברובה בכלי בינה מלאכותית מציין זאת למי שמקבל את העבודה בחברה.',
  },
  {
    id: 'always',
    label: 'תמיד, גם בתוך החברה',
    text: 'עובד מציין בכל מסמך או תוצר שנעזר בו בכלי בינה מלאכותית שהכלי שימש בהכנתו, גם בתוך החברה וגם מול לקוחות.',
  },
]

export const defaultAiPolicyInput = (today: string): AiPolicyInput => ({
  company: '',
  effectiveDate: today,
  owner: '',
  contact: '',
  tools: ['chatgpt'],
  otherTools: '',
  orgAccountsOnly: true,
  uses: ['drafts', 'summaries', 'ideas'],
  forbidden: forbiddenOptions.map((option) => option.id),
  banned: bannedOptions.map((option) => option.id),
  disclosure: 'external',
  approvalDays: '10',
  reportHours: '24',
  reviewMonths: '6',
  acknowledgment: true,
})

export const sampleAiPolicyInput = (today: string): AiPolicyInput => ({
  ...defaultAiPolicyInput(today),
  company: 'משרד לדוגמה בע״מ',
  owner: 'מנהלת התפעול',
  contact: 'ai@example.co.il',
  tools: ['chatgpt', 'claude'],
  uses: ['drafts', 'summaries', 'ideas', 'research'],
})

const ISO_DATE = /^(\d{4})-(\d{2})-(\d{2})$/

const hebrewMonths = [
  'ינואר',
  'פברואר',
  'מרץ',
  'אפריל',
  'מאי',
  'יוני',
  'יולי',
  'אוגוסט',
  'ספטמבר',
  'אוקטובר',
  'נובמבר',
  'דצמבר',
]

export function formatDate(iso: string): string {
  const match = ISO_DATE.exec(iso)
  if (!match) return ''
  const month = Number(match[2]) - 1
  const day = Number(match[3])
  if (month < 0 || month > 11 || day < 1 || day > 31) return ''
  return `${day} ב${hebrewMonths[month]} ${match[1]}`
}

export function readCount(text: string, max: number): number | null {
  const value = text.trim()
  if (!/^\d{1,3}$/.test(value)) return null
  const number = Number(value)
  return number >= 1 && number <= max ? number : null
}

export type PolicyErrors = Partial<Record<'approvalDays' | 'reportHours' | 'reviewMonths' | 'tools', string>>

export function policyErrors(input: AiPolicyInput): PolicyErrors {
  const errors: PolicyErrors = {}
  if (readCount(input.approvalDays, 90) === null) errors.approvalDays = 'הקלידו מספר ימים בין 1 ל-90.'
  if (readCount(input.reportHours, 168) === null) errors.reportHours = 'הקלידו מספר שעות בין 1 ל-168.'
  if (readCount(input.reviewMonths, 36) === null) errors.reviewMonths = 'הקלידו מספר חודשים בין 1 ל-36.'
  if (!input.tools.length && !input.otherTools.trim()) errors.tools = 'בחרו לפחות כלי אחד, או כתבו כלי אחר.'
  return errors
}

const pick = (options: PolicyOption[], ids: string[]) =>
  options.filter((option) => ids.includes(option.id)).map((option) => option.text)

export function approvedTools(input: AiPolicyInput): string[] {
  const extra = input.otherTools
    .split(/[,\n،]/)
    .map((item) => item.trim())
    .filter(Boolean)
  return [...pick(toolOptions, input.tools), ...extra]
}

export function policyTitle(input: AiPolicyInput) {
  const company = input.company.trim()
  return company ? `מדיניות שימוש בבינה מלאכותית - ${company}` : 'מדיניות שימוש בבינה מלאכותית'
}

export function buildPolicy(input: AiPolicyInput): PolicyBlock[] {
  const company = input.company.trim() || '[שם החברה]'
  const owner = input.owner.trim() || '[תפקיד האחראי]'
  const contact = input.contact.trim()
  const ownerWithContact = contact ? `${owner} (${contact})` : owner
  const date = formatDate(input.effectiveDate) || '[תאריך]'
  const tools = approvedTools(input)
  const uses = pick(useOptions, input.uses)
  const forbidden = pick(forbiddenOptions, input.forbidden)
  const banned = pick(bannedOptions, input.banned)
  const disclosure = disclosureOptions.find((option) => option.id === input.disclosure) ?? disclosureOptions[0]
  const approvalDays = readCount(input.approvalDays, 90) ?? '[ימים]'
  const reportHours = readCount(input.reportHours, 168) ?? '[שעות]'
  const reviewMonths = readCount(input.reviewMonths, 36) ?? '[חודשים]'

  const blocks: PolicyBlock[] = [
    { kind: 'title', text: 'מדיניות שימוש בבינה מלאכותית לעובדים' },
    { kind: 'meta', text: `${company} · בתוקף מיום ${date}` },
  ]
  let section = 0
  const heading = (text: string) => {
    section += 1
    blocks.push({ kind: 'heading', text: `${section}. ${text}` })
    let clause = 0
    return (text: string) => {
      clause += 1
      blocks.push({ kind: 'clause', number: `${section}.${clause}`, text })
    }
  }

  const purpose = heading('מטרה ותחולה')
  purpose(
    `מדיניות זו קובעת איך עובדי ${company}, וכל מי שעובד מטעמה, משתמשים בכלי בינה מלאכותית יוצרת (כמו צ׳אטבוטים ומחוללי טקסט, תמונה, קול וקוד) במסגרת העבודה.`,
  )
  purpose('המטרה היא ליהנות מהכלים ולשמור על מידע אישי, על סודות של החברה ושל לקוחותיה, ועל איכות העבודה.')
  purpose(`האחראי על המדיניות הוא ${ownerWithContact}. שאלות, בקשות ודיווחים מופנים אליו.`)

  const allowed = heading('כלים מאושרים')
  if (tools.length) {
    allowed('מותר להשתמש לצורכי עבודה רק בכלים הבאים:')
    blocks.push({ kind: 'list', items: tools })
  } else {
    allowed('מותר להשתמש לצורכי עבודה רק בכלים שאושרו בכתב לפי סעיף 8.')
  }
  if (input.orgAccountsOnly) {
    allowed(
      'השימוש נעשה רק בחשבון שהחברה פתחה או אישרה, ולא בחשבון פרטי של העובד. האחראי בודק לפני האישור את תנאי השימוש ואת הגדרות הפרטיות של הכלי, ובהן אם התוכן שמוזן משמש לאימון מודלים.',
    )
  }
  allowed('כלי שלא מופיע ברשימה אסור לשימוש עד שיאושר.')

  const usage = heading('שימושים מותרים')
  if (uses.length) {
    usage('בכפוף לאיסורים שבמדיניות זו, מותר להשתמש בכלים המאושרים לצרכים הבאים:')
    blocks.push({ kind: 'list', items: uses })
  } else {
    usage('מותר להשתמש בכלים המאושרים רק לשימושים שהאחראי אישר בכתב לפי סעיף 8.')
  }

  const data = heading('מידע שאסור להזין לכלי בינה מלאכותית')
  if (forbidden.length) {
    data('אסור להזין, להעלות או להדביק לכלי בינה מלאכותית, גם לא לכלי מאושר, אלא אם האחראי אישר זאת מראש ובכתב לשימוש מסוים:')
    blocks.push({ kind: 'list', items: forbidden })
  }
  data('בספק, מתייחסים למידע כאסור ושואלים את האחראי לפני שמזינים אותו.')
  data('כשצריך עזרה במסמך שיש בו מידע כזה, מוחקים או מחליפים קודם את הפרטים המזהים והסודיים.')

  const review = heading('בדיקת התוצרים')
  review(
    'כלי בינה מלאכותית טועים, ממציאים עובדות, מקורות ומספרים, ועלולים להעתיק תוכן של אחרים. העובד אחראי לכל תוצר שהוא מגיש או שולח, גם אם נוצר בעזרת כלי.',
  )
  review('לפני שתוצר יוצא ללקוח, מתפרסם או משמש להחלטה, העובד בודק את העובדות, המספרים, השמות והמקורות שבו.')
  review('ייעוץ משפטי, חשבונאי, רפואי או מקצועי אחר שנוצר בכלי לא נמסר הלאה בלי בדיקה של בעל מקצוע מוסמך.')

  const disclose = heading('גילוי')
  disclose(disclosure.text)

  const forbiddenUses = heading('שימושים אסורים')
  if (banned.length) {
    forbiddenUses('בנוסף לאיסורים בסעיף 4, אסור:')
    blocks.push({ kind: 'list', items: banned })
  } else {
    forbiddenUses('בנוסף לאיסורים בסעיף 4, אסור להשתמש בכלי בינה מלאכותית בדרך שמפרה דין, חוזה או הוראה של החברה.')
  }

  const approval = heading('אישור כלי או שימוש חדש')
  approval(`עובד שרוצה להשתמש בכלי חדש, בתוסף, או בשימוש חדש שלא מופיע במדיניות, פונה בכתב ל${owner} ומפרט: מה הכלי, לשם מה, ואיזה מידע יוזן אליו.`)
  approval('האחראי בודק את תנאי השימוש של הכלי, את הגדרות הפרטיות שלו ואת סוג המידע, ומחליט אם לאשר, לאשר בתנאים או לדחות.')
  approval(`תשובה ניתנת בכתב תוך ${approvalDays} ימי עבודה. עד אז אין להשתמש בכלי.`)

  const incidents = heading('דיווח על תקלה')
  incidents(
    `עובד שהזין לכלי בינה מלאכותית מידע אסור, או שגילה שתוצר שגוי יצא ללקוח, מדווח על כך ל${owner} תוך ${reportHours} שעות. מטרת הדיווח היא לצמצם נזק, ודיווח מהיר ייזקף לזכות העובד.`,
  )
  incidents('האחראי בודק אם מדובר באירוע שמחייב טיפול לפי דיני הגנת הפרטיות ואבטחת המידע, ומתעד את האירוע.')

  const update = heading('עדכון ואכיפה')
  update(`המדיניות נבדקת ומתעדכנת לפחות פעם ב-${reviewMonths} חודשים, וגם כשנכנס לשימוש כלי חדש או כשהדין משתנה.`)
  update('הפרה של המדיניות עלולה להוביל לצעדים לפי נהלי החברה ולפי הדין.')

  if (input.acknowledgment) {
    blocks.push({
      kind: 'signature',
      lines: [
        'הצהרת העובד: קראתי את מדיניות השימוש בבינה מלאכותית, הבנתי אותה ואפעל לפיה.',
        'שם העובד: ____________________',
        'תאריך: ____________________',
        'חתימה: ____________________',
      ],
    })
  }
  return blocks
}

export function policyToText(blocks: PolicyBlock[]): string {
  return blocks
    .map((block) => {
      if (block.kind === 'title' || block.kind === 'meta') return block.text
      if (block.kind === 'heading') return `\n${block.text}`
      if (block.kind === 'clause') return `${block.number} ${block.text}`
      if (block.kind === 'list') return block.items.map((item) => `• ${item}`).join('\n')
      return `\n${block.lines.join('\n')}`
    })
    .join('\n')
    .trim()
}

const escapeHtml = (value: string) =>
  value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

export function policyToHtml(blocks: PolicyBlock[]): string {
  return blocks
    .map((block) => {
      if (block.kind === 'title') return `<h1>${escapeHtml(block.text)}</h1>`
      if (block.kind === 'meta') return `<p class="meta">${escapeHtml(block.text)}</p>`
      if (block.kind === 'heading') return `<h2>${escapeHtml(block.text)}</h2>`
      if (block.kind === 'clause') return `<p>${escapeHtml(block.number)} ${escapeHtml(block.text)}</p>`
      if (block.kind === 'list') return `<ul>${block.items.map((item) => `<li>${escapeHtml(item)}</li>`).join('')}</ul>`
      return `<div class="sign">${block.lines.map((line) => `<p>${escapeHtml(line)}</p>`).join('')}</div>`
    })
    .join('\n')
}

export function policyDocument(blocks: PolicyBlock[], title: string): string {
  return `<!doctype html>
<html lang="he" dir="rtl">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${escapeHtml(title)}</title>
<style>@page{size:A4;margin:18mm 20mm}body{max-width:760px;margin:40px auto;padding:0 20px;font:15px/1.7 Arial,"Segoe UI",Helvetica,sans-serif;color:#1a1f33}h1{font-size:24px;text-align:center;margin:0 0 4px}.meta{text-align:center;color:#4a5068;margin:0 0 18px}h2{font-size:17px;margin:22px 0 6px;break-after:avoid}p{margin:0 0 6px}ul{margin:0 0 10px;padding-inline-start:22px}.sign{margin-top:32px;padding-top:14px;border-top:1px solid #1a1f33;break-inside:avoid}.sign p{margin:0 0 14px}@media print{body{margin:0 auto;padding:0}}</style>
</head>
<body>
${policyToHtml(blocks)}
</body>
</html>
`
}
