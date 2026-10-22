export type LetterPurpose = 'general' | 'bank' | 'rental' | 'school' | 'government' | 'abroad'
export type LetterLanguage = 'he' | 'en'
export type EmployerIdType = 'company' | 'dealer'
export type PersonIdType = 'id' | 'passport'
export type EmploymentStatus = 'current' | 'ended'
export type EmploymentScope = 'full' | 'partial'
export type EmploymentType = 'permanent' | 'temporary' | 'fixedTerm'
export type SalaryBasis = 'monthly' | 'hourly'

export type LetterInput = {
  purpose: LetterPurpose
  language: LetterLanguage
  employerName: string
  employerIdType: EmployerIdType
  employerId: string
  employerAddress: string
  employerPhone: string
  signerName: string
  signerRole: string
  employeeName: string
  employeeIdType: PersonIdType
  employeeId: string
  role: string
  startDate: string
  status: EmploymentStatus
  endDate: string
  scope: EmploymentScope
  scopePercent: string
  employmentType: EmploymentType
  includeSalary: boolean
  salaryBasis: SalaryBasis
  salary: string
  issueDate: string
  addressee: string
}

export type Piece = { text: string; missing: boolean }
export type LetterRow = { key: string; label: string; value: Piece }

export type LetterModel = {
  language: LetterLanguage
  dir: 'rtl' | 'ltr'
  employer: Piece
  letterhead: string
  date: Piece
  addressee: string[]
  subject: string
  intro: Piece[]
  rows: LetterRow[]
  purpose: Piece[]
  validity: string
  verify: string
  closing: string
  signer: Piece
  signerTitle: string
  signature: string
  fileTitle: string
}

export type LetterErrors = Partial<
  Record<'employeeId' | 'startDate' | 'endDate' | 'scopePercent' | 'salary', string>
>

export type IdCheck = 'empty' | 'format' | 'checksum' | 'ok'

export const purposes: { id: LetterPurpose; label: string; he: string; en: string }[] = [
  { id: 'general', label: 'כללי', he: '', en: '' },
  { id: 'bank', label: 'לבנק או למשכנתא', he: 'לצורך הצגה בבנק', en: 'for submission to a bank' },
  { id: 'rental', label: 'לשכירות דירה', he: 'לצורך שכירת דירה', en: 'for a rental application' },
  {
    id: 'school',
    label: 'לגן או למוסד לימודים',
    he: 'לצורך הגשה לגן או למוסד לימודים',
    en: 'for submission to a kindergarten or an educational institution',
  },
  {
    id: 'government',
    label: 'למוסד ממשלתי',
    he: 'לצורך הגשה למוסד ממשלתי',
    en: 'for submission to a government office',
  },
  {
    id: 'abroad',
    label: 'באנגלית, לשגרירות או למעסיק בחו״ל',
    he: 'לצורך הגשה לשגרירות או למעסיק בחו״ל',
    en: 'for submission to an embassy or an employer abroad',
  },
]

export const employerIdTypes: { id: EmployerIdType; label: string; he: string; en: string }[] = [
  { id: 'company', label: 'ח.פ. (חברה)', he: 'ח.פ.', en: 'Company No.' },
  { id: 'dealer', label: 'ע.מ. (עוסק מורשה)', he: 'ע.מ.', en: 'Licensed Dealer No.' },
]

export const personIdTypes: { id: PersonIdType; label: string; he: string; en: string }[] = [
  { id: 'id', label: 'תעודת זהות', he: 'ת.ז.', en: 'Israeli ID No.' },
  { id: 'passport', label: 'דרכון', he: 'דרכון', en: 'Passport No.' },
]

export const employmentTypes: { id: EmploymentType; label: string; he: string; en: string }[] = [
  { id: 'permanent', label: 'קבועה', he: 'העסקה קבועה', en: 'Permanent' },
  { id: 'temporary', label: 'זמנית', he: 'העסקה זמנית', en: 'Temporary' },
  { id: 'fixedTerm', label: 'חוזה לתקופה קצובה', he: 'חוזה לתקופה קצובה', en: 'Fixed-term contract' },
]

export const defaultLetterInput = (today: string): LetterInput => ({
  purpose: 'general',
  language: 'he',
  employerName: '',
  employerIdType: 'company',
  employerId: '',
  employerAddress: '',
  employerPhone: '',
  signerName: '',
  signerRole: '',
  employeeName: '',
  employeeIdType: 'id',
  employeeId: '',
  role: '',
  startDate: '',
  status: 'current',
  endDate: '',
  scope: 'full',
  scopePercent: '',
  employmentType: 'permanent',
  includeSalary: false,
  salaryBasis: 'monthly',
  salary: '',
  issueDate: today,
  addressee: '',
})

export const sampleLetterInput = (today: string): LetterInput => ({
  ...defaultLetterInput(today),
  purpose: 'rental',
  employerName: 'מאפייה לדוגמה בע״מ',
  employerId: '000000000',
  employerAddress: 'רחוב הדוגמה 1, חיפה',
  employerPhone: '04-0000000',
  signerName: 'רות כהן',
  signerRole: 'מנהלת משאבי אנוש',
  employeeName: 'דנה לוי',
  employeeId: '000000018',
  role: 'אחראית משמרת',
  startDate: '2022-03-01',
  scope: 'partial',
  scopePercent: '80',
})

export const sampleEnglishInput = (today: string): LetterInput => ({
  ...defaultLetterInput(today),
  purpose: 'abroad',
  language: 'en',
  employerName: 'Example Software Ltd.',
  employerId: '000000000',
  employerAddress: '1 Example Street, Tel Aviv-Yafo, Israel',
  employerPhone: '+972-3-0000000',
  signerName: 'Ruth Cohen',
  signerRole: 'HR Manager',
  employeeName: 'Dana Levi',
  employeeId: '000000018',
  role: 'Senior Software Developer',
  startDate: '2021-09-15',
})

export function checkIsraeliId(value: string): IdCheck {
  const digits = value.replace(/[\s-]/g, '')
  if (!digits) return 'empty'
  if (!/^\d{1,9}$/.test(digits) || /^0+$/.test(digits)) return 'format'
  const sum = digits
    .padStart(9, '0')
    .split('')
    .reduce((total, char, index) => {
      const product = Number(char) * ((index % 2) + 1)
      return total + (product > 9 ? product - 9 : product)
    }, 0)
  return sum % 10 === 0 ? 'ok' : 'checksum'
}

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

const englishMonths = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
]

export function formatLetterDate(iso: string, language: LetterLanguage): string {
  const match = ISO_DATE.exec(iso)
  if (!match) return ''
  const day = Number(match[3])
  const month = Number(match[2]) - 1
  if (month < 0 || month > 11 || day < 1 || day > 31) return ''
  return language === 'he'
    ? `${day} ב${hebrewMonths[month]} ${match[1]}`
    : `${day} ${englishMonths[month]} ${match[1]}`
}

export function readPercent(text: string): { value: number; error: string } {
  const value = text.trim().replace(/%$/, '')
  if (!value) return { value: 0, error: '' }
  const number = Number(value)
  if (!/^\d{1,2}(\.\d{1,2})?$/.test(value) || number <= 0 || number >= 100) {
    return { value: 0, error: 'הקלידו אחוז משרה בין 1 ל-99.' }
  }
  return { value: number, error: '' }
}

export function readSalary(text: string): { value: string; error: string } {
  const value = text.replace(/[\s,₪]/g, '')
  if (!value) return { value: '', error: '' }
  if (!/^\d{1,8}(\.\d{1,2})?$/.test(value) || Number(value) <= 0) {
    return { value: '', error: 'הקלידו סכום בספרות, למשל 12000.' }
  }
  const [whole, fraction] = value.split('.')
  const grouped = whole.replace(/^0+(?=\d)/, '').replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  return { value: fraction ? `${grouped}.${fraction.padEnd(2, '0')}` : grouped, error: '' }
}

export function letterErrors(input: LetterInput): LetterErrors {
  const errors: LetterErrors = {}
  if (input.employeeIdType === 'id') {
    const check = checkIsraeliId(input.employeeId)
    if (check === 'format') errors.employeeId = 'מספר זהות כולל עד 9 ספרות, בלי אותיות.'
    if (check === 'checksum') {
      errors.employeeId = 'מספר הזהות לא תקין: ספרת הביקורת לא מתאימה. בדקו שהקלדתם את כל הספרות נכון.'
    }
  }
  if (input.startDate && input.issueDate && input.startDate > input.issueDate) {
    errors.startDate = 'תאריך תחילת העבודה מאוחר מתאריך המכתב.'
  }
  if (input.status === 'ended' && input.endDate) {
    if (input.startDate && input.endDate < input.startDate) {
      errors.endDate = 'תאריך הסיום מוקדם מתאריך תחילת העבודה.'
    } else if (input.issueDate && input.endDate > input.issueDate) {
      errors.endDate = 'תאריך הסיום מאוחר מתאריך המכתב. לעובד שעדיין עובד בחרו ״עדיין עובד״.'
    }
  }
  if (input.scope === 'partial') {
    const percent = readPercent(input.scopePercent)
    if (percent.error) errors.scopePercent = percent.error
  }
  if (input.includeSalary) {
    const salary = readSalary(input.salary)
    if (salary.error) errors.salary = salary.error
  }
  return errors
}

const piece = (text: string, fallback: string): Piece => {
  const value = text.trim()
  return value ? { text: value, missing: false } : { text: fallback, missing: true }
}

const plain = (text: string): Piece => ({ text, missing: false })

const labels = {
  he: {
    employer: '[שם המעסיק]',
    employee: '[שם העובד]',
    id: '[מספר]',
    role: '[תפקיד]',
    start: '[תאריך תחילת העבודה]',
    end: '[תאריך סיום העבודה]',
    date: '[תאריך]',
    signer: '[שם החותם]',
    salary: '[סכום]',
    percent: '[אחוז]',
  },
  en: {
    employer: '[Employer name]',
    employee: '[Employee name]',
    id: '[number]',
    role: '[Position]',
    start: '[start date]',
    end: '[end date]',
    date: '[Date]',
    signer: '[Signer name]',
    salary: '[amount]',
    percent: '[percent]',
  },
}

const joinParts = (parts: string[]) =>
  parts
    .map((part) => part.trim())
    .filter(Boolean)
    .join(' · ')

const joinPieces = (pieces: Piece[]): Piece => ({
  text: pieces.map((part) => part.text).join(''),
  missing: pieces.some((part) => part.missing),
})

function periodValue(input: LetterInput): Piece {
  const { language } = input
  const text = labels[language]
  const start = piece(formatLetterDate(input.startDate, language), text.start)
  if (input.status === 'current') {
    return language === 'he'
      ? joinPieces([plain('מ-'), start, plain(' ועד היום')])
      : joinPieces([plain('Since '), start, plain(' (currently employed)')])
  }
  const end = piece(formatLetterDate(input.endDate, language), text.end)
  return language === 'he'
    ? joinPieces([plain('מ-'), start, plain(' עד '), end])
    : joinPieces([plain('From '), start, plain(' to '), end])
}

function scopeValue(input: LetterInput): Piece {
  const { language } = input
  if (input.scope === 'full') return plain(language === 'he' ? 'משרה מלאה' : 'Full-time')
  const percent = readPercent(input.scopePercent)
  const amount = piece(percent.value ? `${percent.value}%` : '', labels[language].percent)
  return language === 'he'
    ? joinPieces([plain('משרה חלקית, '), amount, plain(' ממשרה מלאה')])
    : joinPieces([plain('Part-time, '), amount, plain(' of a full-time position')])
}

function salaryRow(input: LetterInput): LetterRow | null {
  if (!input.includeSalary) return null
  const { language } = input
  const amount = readSalary(input.salary).value
  const monthly = input.salaryBasis === 'monthly'
  const label =
    language === 'he'
      ? monthly
        ? 'שכר חודשי ברוטו'
        : 'שכר לשעה ברוטו'
      : monthly
        ? 'Gross monthly salary'
        : 'Gross hourly wage'
  const value = amount
    ? plain(language === 'he' ? `${amount} ₪` : `ILS ${amount}`)
    : { text: labels[language].salary, missing: true }
  return { key: 'salary', label, value }
}

export function buildLetter(input: LetterInput): LetterModel {
  const { language } = input
  const he = language === 'he'
  const text = labels[language]
  const employerType = employerIdTypes.find((type) => type.id === input.employerIdType) ?? employerIdTypes[0]
  const personType = personIdTypes.find((type) => type.id === input.employeeIdType) ?? personIdTypes[0]
  const typeInfo = employmentTypes.find((type) => type.id === input.employmentType) ?? employmentTypes[0]
  const purposeInfo = purposes.find((item) => item.id === input.purpose) ?? purposes[0]
  const employer = piece(input.employerName, text.employer)
  const employee = piece(input.employeeName, text.employee)
  const employerId = input.employerId.trim()
  const employerIdLabel = he ? employerType.he : employerType.en
  const letterhead = joinParts([
    employerId ? `${employerIdLabel} ${employerId}` : '',
    input.employerAddress,
    input.employerPhone,
  ])
  const addressee = input.addressee.trim()
  const ended = input.status === 'ended'
  const idPiece = piece(input.employeeId, text.id)
  const idLabel = he ? personType.he : personType.en

  const intro: Piece[] = he
    ? [plain('אנו מאשרים בזה את פרטי ההעסקה של '), employee, plain(`, ${idLabel} `), idPiece, plain(', אצלנו:')]
    : [
        plain('We hereby confirm the employment details of '),
        employee,
        plain(`, ${idLabel} `),
        idPiece,
        plain(', with '),
        employer,
        plain(':'),
      ]

  const rows: LetterRow[] = [
    { key: 'role', label: he ? 'תפקיד' : 'Position', value: piece(input.role, text.role) },
    { key: 'period', label: he ? 'תקופת העסקה' : 'Employment period', value: periodValue(input) },
    { key: 'scope', label: he ? 'היקף משרה' : 'Scope', value: scopeValue(input) },
    { key: 'type', label: he ? 'סוג ההעסקה' : 'Employment type', value: plain(he ? typeInfo.he : typeInfo.en) },
  ]
  const salary = salaryRow(input)
  if (salary) rows.push(salary)

  const reason = he ? purposeInfo.he : purposeInfo.en
  const purpose: Piece[] = he
    ? [plain('האישור ניתן לבקשת '), employee, plain(reason ? `, ${reason}.` : '.')]
    : [plain('This letter is issued at the request of '), employee, plain(reason ? ` ${reason}.` : '.')]

  const phone = input.employerPhone.trim()
  const titleParts = [input.signerRole.trim(), input.employerName.trim()].filter(Boolean)

  return {
    language,
    dir: he ? 'rtl' : 'ltr',
    employer,
    letterhead,
    date: piece(formatLetterDate(input.issueDate, language), text.date),
    addressee: addressee
      ? he
        ? ['לכבוד', addressee]
        : [addressee]
      : [he ? 'לכל המעוניין' : 'To Whom It May Concern'],
    subject: he
      ? ended
        ? 'הנדון: אישור על תקופת העסקה'
        : 'הנדון: אישור העסקה'
      : ended
        ? 'Re: Confirmation of Employment Period'
        : 'Re: Employment Confirmation',
    intro,
    rows,
    purpose,
    validity: he ? 'האישור נכון לתאריך הוצאתו.' : 'This confirmation is accurate as of its date of issue.',
    verify: phone
      ? he
        ? `לאימות הפרטים אפשר לפנות אלינו בטלפון ${phone}.`
        : `For verification, please contact us at ${phone}.`
      : '',
    closing: he ? 'בכבוד רב,' : 'Sincerely,',
    signer: piece(input.signerName, text.signer),
    signerTitle: titleParts.join(', '),
    signature: he ? 'חתימה וחותמת' : 'Signature and stamp',
    fileTitle: [he ? 'אישור העסקה' : 'Employment confirmation', input.employeeName.trim()]
      .filter(Boolean)
      .join(' - '),
  }
}

const pieceText = (pieces: Piece[]) => pieces.map((part) => part.text).join('')

export function letterToText(model: LetterModel): string {
  const out: string[] = [model.employer.text]
  if (model.letterhead) out.push(model.letterhead)
  out.push('', model.date.text, '', ...model.addressee, '', model.subject, '', pieceText(model.intro))
  model.rows.forEach((row) => out.push(`${row.label}: ${row.value.text}`))
  out.push('', pieceText(model.purpose), model.validity)
  if (model.verify) out.push(model.verify)
  out.push('', model.closing, model.signer.text)
  if (model.signerTitle) out.push(model.signerTitle)
  out.push('', `${model.signature}: ____________________`)
  return out.join('\n')
}

const escapeHtml = (value: string) =>
  value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

const pieceHtml = (part: Piece) =>
  part.missing ? `<span class="missing">${escapeHtml(part.text)}</span>` : escapeHtml(part.text)

const documentCss = `@page{size:A4;margin:18mm 20mm}
*{box-sizing:border-box}
html{-webkit-print-color-adjust:exact;print-color-adjust:exact}
body{margin:0;background:#ece8e2;color:#1a1f33;font:15px/1.65 Arial,"Segoe UI",Helvetica,sans-serif}
.sheet{width:210mm;min-height:297mm;margin:24px auto;padding:20mm 22mm;background:#fff;box-shadow:0 10px 30px rgba(0,0,0,.12)}
.head{padding-bottom:14px;border-bottom:2px solid #1a1f33}
.biz{margin:0;font-size:21px;font-weight:700;line-height:1.3}
.muted{margin:4px 0 0;color:#5c6072;font-size:12.5px}
.date{margin:26px 0 0;text-align:end}
.to{margin:18px 0 0}
.to p{margin:0}
h1{margin:26px 0 0;font-size:17px;font-weight:700;text-decoration:underline;text-underline-offset:4px}
.intro{margin:18px 0 0}
dl{display:grid;grid-template-columns:max-content 1fr;gap:6px 20px;margin:12px 0 0;padding:12px 16px;border:1px solid #e2ddd6;border-radius:6px}
dt{color:#5c6072}
dd{margin:0;font-weight:600}
.body{margin:18px 0 0}
.body p{margin:0 0 4px}
.close{margin:30px 0 0;break-inside:avoid}
.close p{margin:0}
.signer{font-weight:700}
.close .sign{width:min(100%,260px);margin:46px 0 0;padding-top:6px;border-top:1px solid #1a1f33;color:#5c6072;font-size:12.5px}
.missing{color:#8a8580;font-weight:400}
@media print{body{background:#fff}.sheet{width:auto;min-height:0;margin:0;padding:0;box-shadow:none}}
@media screen and (max-width:820px){.sheet{width:auto;min-height:0;margin:0;padding:24px 16px;box-shadow:none}}
@media screen and (max-width:480px){dl{grid-template-columns:1fr;gap:0 0}dd{margin-bottom:8px}}`

export function letterDocument(model: LetterModel): string {
  const rows = model.rows
    .map((row) => `<dt>${escapeHtml(row.label)}</dt><dd>${pieceHtml(row.value)}</dd>`)
    .join('')
  return `<!doctype html>
<html lang="${model.language}" dir="${model.dir}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${escapeHtml(model.fileTitle)}</title>
<style>${documentCss}</style>
</head>
<body>
<article class="sheet">
<header class="head">
<p class="biz">${pieceHtml(model.employer)}</p>
${model.letterhead ? `<p class="muted">${escapeHtml(model.letterhead)}</p>` : ''}
</header>
<p class="date">${pieceHtml(model.date)}</p>
<div class="to">${model.addressee.map((line) => `<p>${escapeHtml(line)}</p>`).join('')}</div>
<h1>${escapeHtml(model.subject)}</h1>
<p class="intro">${model.intro.map(pieceHtml).join('')}</p>
<dl>${rows}</dl>
<div class="body">
<p>${model.purpose.map(pieceHtml).join('')}</p>
<p>${escapeHtml(model.validity)}</p>
${model.verify ? `<p>${escapeHtml(model.verify)}</p>` : ''}
</div>
<div class="close">
<p>${escapeHtml(model.closing)}</p>
<p class="signer">${pieceHtml(model.signer)}</p>
${model.signerTitle ? `<p>${escapeHtml(model.signerTitle)}</p>` : ''}
<p class="sign">${escapeHtml(model.signature)}</p>
</div>
</article>
</body>
</html>
`
}

export const hebrewFields = (input: LetterInput) => {
  const fields: [keyof LetterInput, string][] = [
    ['employerName', 'שם המעסיק'],
    ['employerAddress', 'כתובת'],
    ['signerName', 'שם החותם'],
    ['signerRole', 'תפקיד החותם'],
    ['employeeName', 'שם העובד'],
    ['role', 'תפקיד'],
    ['addressee', 'נמען'],
  ]
  return fields.filter(([key]) => /[֐-׿]/.test(String(input[key]))).map(([, label]) => label)
}
