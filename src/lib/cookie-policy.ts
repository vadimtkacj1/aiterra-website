export type CookieCategory = 'analytics' | 'advertising' | 'behavior' | 'embedded'

export type CookieToolInfo = {
  id: string
  name: string
  vendor: string
  category: CookieCategory
  purpose: string
  href: string
}

export type ConsentMode = 'banner' | 'immediate'

export type CookiePolicyInput = {
  siteName: string
  contactEmail: string
  contactPhone: string
  privacyUrl: string
  toolIds: string[]
  otherTools: string
  consentMode: ConsentMode
  settingsLink: boolean
  date: string
  credit: boolean
}

export type CookieLink = { text: string; href: string }

export type CookieInline = string | CookieLink

export type CookieBlock =
  | { kind: 'title'; text: string }
  | { kind: 'meta'; text: string }
  | { kind: 'heading'; text: string }
  | { kind: 'paragraph'; parts: CookieInline[] }
  | { kind: 'list'; items: CookieInline[][] }
  | { kind: 'credit'; parts: CookieInline[] }

export const categoryLabels: Record<CookieCategory, { title: string; intro: string }> = {
  analytics: {
    title: 'מדידה וניתוח תנועה',
    intro: 'הכלים האלה עוזרים לנו להבין איך משתמשים באתר ואיך לשפר אותו.',
  },
  advertising: {
    title: 'פרסום ומדידת המרות',
    intro: 'הכלים האלה מודדים אם פרסומת שלנו הובילה לפעולה באתר, ומאפשרים להציג פרסומות בפלטפורמות הפרסום.',
  },
  behavior: {
    title: 'ניתוח התנהגות גולשים',
    intro: 'הכלים האלה מראים לנו איך גולשים מנווטים בעמודים, כדי לאתר קשיים בשימוש באתר.',
  },
  embedded: {
    title: 'תוכן מוטמע ושירותי צד שלישי',
    intro: 'שירותים שמופעלים מתוך העמודים שלנו, וגם הספקים שלהם עשויים לשמור עוגיות או מזהים דומים.',
  },
}

export const categoryOrder: CookieCategory[] = ['analytics', 'advertising', 'behavior', 'embedded']

export const cookieTools: CookieToolInfo[] = [
  {
    id: 'ga4',
    name: 'Google Analytics',
    vendor: 'Google',
    category: 'analytics',
    purpose: 'מדידת תנועה באתר: אילו עמודים נצפים, מאילו מקורות מגיעים הגולשים ואילו פעולות הם מבצעים.',
    href: 'https://policies.google.com/privacy',
  },
  {
    id: 'gtm',
    name: 'Google Tag Manager',
    vendor: 'Google',
    category: 'analytics',
    purpose: 'ניהול תגיות המדידה והפרסום באתר. הכלי עצמו אינו מנתח את הגלישה, אבל הוא טוען את התגיות שמוגדרות בו.',
    href: 'https://policies.google.com/privacy',
  },
  {
    id: 'clarity',
    name: 'Microsoft Clarity',
    vendor: 'Microsoft',
    category: 'behavior',
    purpose: 'מפות חום והקלטות של פעולות גולשים באתר, כמו גלילה ולחיצות, לצורך שיפור חוויית השימוש.',
    href: 'https://privacy.microsoft.com/privacystatement',
  },
  {
    id: 'hotjar',
    name: 'Hotjar',
    vendor: 'Hotjar',
    category: 'behavior',
    purpose: 'מפות חום, הקלטות של פעולות גולשים באתר ושאלוני משוב, לצורך שיפור חוויית השימוש.',
    href: 'https://www.hotjar.com/privacy/',
  },
  {
    id: 'google-ads',
    name: 'Google Ads',
    vendor: 'Google',
    category: 'advertising',
    purpose: 'מדידת המרות מקמפיינים בגוגל, ויצירת קהלים להצגת פרסומות.',
    href: 'https://policies.google.com/privacy',
  },
  {
    id: 'meta-pixel',
    name: 'Meta Pixel',
    vendor: 'Meta',
    category: 'advertising',
    purpose: 'מדידת המרות מקמפיינים בפייסבוק ובאינסטגרם, ויצירת קהלים להצגת פרסומות.',
    href: 'https://www.facebook.com/privacy/policy',
  },
  {
    id: 'tiktok-pixel',
    name: 'TikTok Pixel',
    vendor: 'TikTok',
    category: 'advertising',
    purpose: 'מדידת המרות מקמפיינים בטיקטוק, ויצירת קהלים להצגת פרסומות.',
    href: 'https://www.tiktok.com/legal/page/global/privacy-policy/en',
  },
  {
    id: 'linkedin',
    name: 'LinkedIn Insight Tag',
    vendor: 'LinkedIn',
    category: 'advertising',
    purpose: 'מדידת המרות מקמפיינים בלינקדאין, ויצירת קהלים להצגת פרסומות.',
    href: 'https://www.linkedin.com/legal/privacy-policy',
  },
  {
    id: 'hubspot',
    name: 'HubSpot',
    vendor: 'HubSpot',
    category: 'analytics',
    purpose: 'תיעוד של פניות שהתקבלו בטפסי האתר, וקישור שלהן לפעילות הגולש באתר לצורך ניהול קשרי לקוחות.',
    href: 'https://legal.hubspot.com/privacy-policy',
  },
  {
    id: 'youtube',
    name: 'YouTube',
    vendor: 'Google',
    category: 'embedded',
    purpose: 'הצגת סרטונים מוטמעים בעמודי האתר.',
    href: 'https://policies.google.com/privacy',
  },
  {
    id: 'google-maps',
    name: 'Google Maps',
    vendor: 'Google',
    category: 'embedded',
    purpose: 'הצגת מפה מוטמעת עם מיקום העסק.',
    href: 'https://policies.google.com/privacy',
  },
  {
    id: 'recaptcha',
    name: 'Google reCAPTCHA',
    vendor: 'Google',
    category: 'embedded',
    purpose: 'הגנה על טפסי האתר מפני שליחה אוטומטית וספאם.',
    href: 'https://policies.google.com/privacy',
  },
]

export const analyticsOptOut: CookieLink = {
  text: 'התוסף של גוגל לביטול מעקב ב-Google Analytics',
  href: 'https://tools.google.com/dlpage/gaoptout',
}

const SITE_PLACEHOLDER = '[שם האתר]'
const EMAIL_PLACEHOLDER = '[כתובת דוא״ל ליצירת קשר]'

export const defaultCookieInput = (date: string): CookiePolicyInput => ({
  siteName: '',
  contactEmail: '',
  contactPhone: '',
  privacyUrl: '',
  toolIds: [],
  otherTools: '',
  consentMode: 'banner',
  settingsLink: true,
  date,
  credit: true,
})

export const sampleCookieInput = (date: string): CookiePolicyInput => ({
  siteName: 'סטודיו נועם',
  contactEmail: 'hello@example.co.il',
  contactPhone: '',
  privacyUrl: 'https://example.co.il/privacy-policy',
  toolIds: ['ga4', 'meta-pixel', 'youtube'],
  otherTools: '',
  consentMode: 'banner',
  settingsLink: true,
  date,
  credit: false,
})

const clean = (value: string) => value.trim().replace(/\s+/g, ' ')

const hebrewDate = (iso: string) => {
  const parsed = new Date(`${iso}T12:00:00`)
  if (Number.isNaN(parsed.getTime())) return iso
  return new Intl.DateTimeFormat('he-IL', { day: 'numeric', month: 'long', year: 'numeric' }).format(parsed)
}

export const parseOtherTools = (value: string): { name: string; purpose: string }[] =>
  value
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [name, ...rest] = line.split(/\s+[-–—]\s+/)
      return { name: clean(name), purpose: clean(rest.join(' - ')) }
    })
    .filter((entry) => entry.name)

export function buildCookiePolicy(input: CookiePolicyInput): CookieBlock[] {
  const site = clean(input.siteName) || SITE_PLACEHOLDER
  const email = clean(input.contactEmail) || EMAIL_PLACEHOLDER
  const phone = clean(input.contactPhone)
  const selected = cookieTools.filter((tool) => input.toolIds.includes(tool.id))
  const others = parseOtherTools(input.otherTools)
  const hasTracking = selected.length > 0 || others.length > 0
  const blocks: CookieBlock[] = []

  blocks.push({ kind: 'title', text: `מדיניות עוגיות של ${site}` })
  blocks.push({ kind: 'meta', text: `עודכנה לאחרונה: ${hebrewDate(input.date)}` })

  blocks.push({ kind: 'heading', text: '1. מהן עוגיות' })
  blocks.push({
    kind: 'paragraph',
    parts: [
      'עוגיות (cookies) הן קבצי טקסט קטנים שנשמרים בדפדפן או במכשיר שלכם כשאתם גולשים באתר. אנו משתמשים גם בטכנולוגיות דומות, כמו אחסון מקומי בדפדפן ותגיות מעקב (פיקסלים), וכולן נקראות יחד בדף זה ״עוגיות״. עוגיות יכולות להיות שלנו או של ספקים שאנו עובדים איתם.',
    ],
  })

  blocks.push({ kind: 'heading', text: '2. עוגיות הכרחיות' })
  blocks.push({
    kind: 'paragraph',
    parts: [
      `עוגיות הכרחיות נדרשות לפעולה התקינה של האתר, כמו שמירת הבחירה שלכם לגבי עוגיות, אבטחת האתר ותפעול הטפסים. בלעדיהן חלקים מהאתר לא יעבדו כראוי.`,
    ],
  })

  let sectionNumber = 3

  if (!hasTracking) {
    blocks.push({ kind: 'heading', text: `${sectionNumber}. עוגיות נוספות` })
    blocks.push({
      kind: 'paragraph',
      parts: [
        `נכון למועד העדכון, ${site} אינו משתמש בכלי מדידה, פרסום או ניתוח התנהגות של צד שלישי. אם נוסיף כלים כאלה, נעדכן את הדף הזה.`,
      ],
    })
    sectionNumber += 1
  } else {
    blocks.push({ kind: 'heading', text: `${sectionNumber}. כלים שמשתמשים בעוגיות באתר` })
    blocks.push({
      kind: 'paragraph',
      parts: [
        'מלבד העוגיות ההכרחיות, האתר משתמש בכלים הבאים. חלק מהספקים עשויים לעבד מידע גם מחוץ לישראל, ולכל ספק יש מדיניות פרטיות משלו, שאליה מובילים הקישורים.',
      ],
    })
    sectionNumber += 1

    categoryOrder.forEach((category) => {
      const inCategory = selected.filter((tool) => tool.category === category)
      if (!inCategory.length) return
      const info = categoryLabels[category]
      blocks.push({ kind: 'heading', text: info.title })
      blocks.push({ kind: 'paragraph', parts: [info.intro] })
      const items: CookieInline[][] = inCategory.map((tool) => [
        `${tool.name} (${tool.vendor}): ${tool.purpose} `,
        { text: 'מדיניות הפרטיות של הספק', href: tool.href },
      ])
      blocks.push({ kind: 'list', items })
    })

    if (others.length) {
      blocks.push({ kind: 'heading', text: 'כלים נוספים' })
      blocks.push({
        kind: 'list',
        items: others.map((entry) => [entry.purpose ? `${entry.name}: ${entry.purpose}` : entry.name]),
      })
    }
  }

  if (hasTracking) {
    blocks.push({ kind: 'heading', text: `${sectionNumber}. הסכמה וניהול הבחירה` })
    if (input.consentMode === 'banner') {
      blocks.push({
        kind: 'paragraph',
        parts: [
          'בכניסה הראשונה לאתר מוצג באנר עוגיות. הכלים המפורטים בסעיף הקודם נטענים רק אחרי שאישרתם אותם. אפשר לסרב, והסירוב אינו מונע שימוש באתר.',
        ],
      })
      blocks.push({
        kind: 'paragraph',
        parts: [
          input.settingsLink
            ? 'אפשר לשנות את הבחירה בכל עת דרך הקישור ״הגדרות עוגיות״ שבתחתית האתר.'
            : 'אפשר לשנות את הבחירה בכל עת על ידי מחיקת נתוני האתר בדפדפן, ובכניסה הבאה יוצג הבאנר מחדש.',
        ],
      })
    } else {
      blocks.push({
        kind: 'paragraph',
        parts: [
          'הכלים המפורטים בסעיף הקודם פועלים מרגע הכניסה לאתר. אם אינכם מעוניינים בכך, אפשר לחסום עוגיות בהגדרות הדפדפן או להשתמש בכלי הביטול של הספקים, כמו שמפורט בסעיף הבא.',
        ],
      })
    }
    sectionNumber += 1
  }

  blocks.push({ kind: 'heading', text: `${sectionNumber}. איך חוסמים או מוחקים עוגיות בדפדפן` })
  const browserParts: CookieInline[] = [
    'בכל הדפדפנים הנפוצים, כמו Chrome, Safari, Firefox ו-Edge, אפשר למחוק עוגיות שנשמרו וגם לחסום שמירה של עוגיות חדשות, בהגדרות הפרטיות והאבטחה של הדפדפן. חסימה של עוגיות הכרחיות עלולה לפגוע בתפקוד האתר.',
  ]
  blocks.push({ kind: 'paragraph', parts: browserParts })
  if (input.toolIds.includes('ga4')) {
    blocks.push({ kind: 'paragraph', parts: ['אפשר גם להשתמש ב', analyticsOptOut, ' כדי למנוע את הדיווח ל-Google Analytics.'] })
  }
  sectionNumber += 1

  blocks.push({ kind: 'heading', text: `${sectionNumber}. קשר למדיניות הפרטיות` })
  const privacyUrl = input.privacyUrl.trim()
  blocks.push({
    kind: 'paragraph',
    parts: privacyUrl
      ? [
          'מידע אישי שנאסף דרך האתר, ובכלל זה הזכות לעיין במידע ולבקש לתקן אותו, מוסדר ב',
          { text: 'מדיניות הפרטיות', href: privacyUrl },
          ' שלנו. דף זה מתאר רק את השימוש בעוגיות.',
        ]
      : [
          'מידע אישי שנאסף דרך האתר, ובכלל זה הזכות לעיין במידע ולבקש לתקן אותו, מוסדר במדיניות הפרטיות של האתר. דף זה מתאר רק את השימוש בעוגיות.',
        ],
  })
  sectionNumber += 1

  blocks.push({ kind: 'heading', text: `${sectionNumber}. שינויים במדיניות` })
  blocks.push({
    kind: 'paragraph',
    parts: [
      'נעדכן את המדיניות כשיתווספו לאתר כלים חדשים או כשהשימוש בעוגיות ישתנה. התאריך בראש הדף מציין את העדכון האחרון.',
    ],
  })
  sectionNumber += 1

  blocks.push({ kind: 'heading', text: `${sectionNumber}. יצירת קשר` })
  const contact = phone ? `${email}, או בטלפון ${phone}` : email
  blocks.push({
    kind: 'paragraph',
    parts: [`שאלות על השימוש בעוגיות ב${site} אפשר לשלוח אל ${contact}.`],
  })

  if (input.credit) {
    blocks.push({
      kind: 'credit',
      parts: ['נוצר ב', { text: 'מחולל מדיניות העוגיות של Aiterra', href: 'https://www.aiterra.co.il/tools/cookie-policy-generator' }],
    })
  }

  return blocks
}

const inlineText = (parts: CookieInline[]) =>
  parts.map((part) => (typeof part === 'string' ? part : `${part.text} (${part.href})`)).join('')

const escapeHtml = (value: string) =>
  value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

const inlineHtml = (parts: CookieInline[]) =>
  parts
    .map((part) =>
      typeof part === 'string'
        ? escapeHtml(part)
        : `<a href="${escapeHtml(part.href)}" rel="noopener" target="_blank">${escapeHtml(part.text)}</a>`,
    )
    .join('')

export function cookiePolicyToText(blocks: CookieBlock[]): string {
  const lines: string[] = []
  blocks.forEach((block) => {
    if (block.kind === 'title') lines.push(block.text, '')
    else if (block.kind === 'meta') lines.push(block.text, '')
    else if (block.kind === 'heading') lines.push(block.text)
    else if (block.kind === 'paragraph') lines.push(inlineText(block.parts), '')
    else if (block.kind === 'list') lines.push(...block.items.map((item) => `- ${inlineText(item)}`), '')
    else lines.push(inlineText(block.parts))
  })
  return lines.join('\n').trim() + '\n'
}

export function cookiePolicyToHtml(blocks: CookieBlock[]): string {
  const html = blocks.map((block) => {
    if (block.kind === 'title') return `<h1>${escapeHtml(block.text)}</h1>`
    if (block.kind === 'meta') return `<p>${escapeHtml(block.text)}</p>`
    if (block.kind === 'heading') return `<h2>${escapeHtml(block.text)}</h2>`
    if (block.kind === 'paragraph') return `<p>${inlineHtml(block.parts)}</p>`
    if (block.kind === 'list') {
      return `<ul>\n${block.items.map((item) => `  <li>${inlineHtml(item)}</li>`).join('\n')}\n</ul>`
    }
    return `<p><small>${inlineHtml(block.parts)}</small></p>`
  })
  return html.join('\n') + '\n'
}

export function cookiePolicyDocument(blocks: CookieBlock[], title: string): string {
  return `<!doctype html>
<html lang="he" dir="rtl">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${escapeHtml(title)}</title>
</head>
<body>
${cookiePolicyToHtml(blocks)}</body>
</html>
`
}

export type CookieCheck = { ok: boolean; message: string }

export function cookiePolicyChecks(input: CookiePolicyInput): CookieCheck[] {
  const checks: CookieCheck[] = []
  if (!clean(input.siteName)) checks.push({ ok: false, message: 'כתבו את שם האתר או העסק.' })
  if (!clean(input.contactEmail)) checks.push({ ok: false, message: 'הוסיפו כתובת דוא״ל ליצירת קשר.' })
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.contactEmail.trim())) {
    checks.push({ ok: false, message: 'כתובת הדוא״ל לא נראית תקינה.' })
  }
  const privacyUrl = input.privacyUrl.trim()
  if (privacyUrl && !/^https?:\/\//i.test(privacyUrl)) {
    checks.push({ ok: false, message: 'כתובת מדיניות הפרטיות צריכה להתחיל ב-https://.' })
  }
  return checks
}
