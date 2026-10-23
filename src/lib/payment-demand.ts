export type DemandTone = 'reminder' | 'demand' | 'final'
export type InterestMode = 'none' | 'agreed' | 'court'

export type DemandInvoice = { id: string; number: string; date: string; amount: string }

export type DemandInput = {
  tone: DemandTone
  creditorName: string
  creditorId: string
  creditorAddress: string
  creditorPhone: string
  creditorEmail: string
  signerName: string
  debtorName: string
  debtorAddress: string
  subject: string
  invoices: DemandInvoice[]
  paid: string
  issueDate: string
  payDays: string
  bankName: string
  bankBranch: string
  bankAccount: string
  accountHolder: string
  appPhone: string
  interest: InterestMode
  interestSource: string
  note: string
}

export type Piece = { text: string; missing: boolean }

export type DemandRow = { key: string; number: Piece; date: string; amount: string }

export type DemandModel = {
  tone: DemandTone
  creditor: Piece
  letterhead: string
  date: Piece
  addressee: Piece[]
  subject: string
  greeting: Piece[]
  opening: string
  rows: DemandRow[]
  totals: { label: string; value: string; strong: boolean }[]
  request: Piece[]
  payment: string[]
  interest: string
  closing: string[]
  sign: string
  signer: Piece
  signerBusiness: string
  fileTitle: string
}

export type DemandErrors = Partial<Record<'paid' | 'payDays' | 'invoices', string>> & {
  rows?: Record<string, string>
}

export const toneOptions: { id: DemandTone; label: string; hint: string; days: string }[] = [
  { id: 'reminder', label: 'תזכורת ידידותית', hint: 'כשהמועד עבר לפני זמן קצר', days: '7' },
  { id: 'demand', label: 'דרישה רשמית לתשלום', hint: 'אחרי תזכורת שלא נענתה', days: '14' },
  { id: 'final', label: 'התראה לפני תביעה', hint: 'מכתב אחרון לפני פנייה לבית המשפט', days: '14' },
]

export const interestOptions: { id: InterestMode; label: string }[] = [
  { id: 'none', label: 'בלי ריבית' },
  { id: 'agreed', label: 'ריבית שסוכמה בהסכם או בהצעת המחיר' },
  { id: 'court', label: 'ריבית והצמדה כפי שבית המשפט יפסוק' },
]

export const SMALL_CLAIMS_LIMIT = 39900
export const SMALL_CLAIMS_YEAR = 2026

const risky: { pattern: RegExp; label: string }[] = [
  { pattern: /משטר/, label: 'תלונה במשטרה' },
  { pattern: /פייסבוק|אינסטגרם|טיקטוק|רשתות|ברשת|אפרסם|נפרסם|לפרסם|פרסום|ביקור(ו)?ת/, label: 'פרסום ברשת או ביקורת' },
  { pattern: /משפחה|אשתך|בעלך|ילדים|ההורים/, label: 'פנייה למשפחה' },
  { pattern: /מעסיק|לעבודה שלך|הבוס/, label: 'פנייה למקום העבודה' },
  { pattern: /תצטער|נשבור|אשבור|נגיע אליך|נבוא אליך|אבוא אליך|כדאי לך/, label: 'איום אישי' },
  { pattern: /שחור|רשימה שחורה|BDI/i, label: 'רשימה שחורה או דירוג אשראי' },
]

export function riskyPhrases(text: string): string[] {
  return risky.filter((item) => item.pattern.test(text)).map((item) => item.label)
}

let counter = 0
export const newInvoice = (): DemandInvoice => {
  counter += 1
  return { id: `inv-${Date.now().toString(36)}-${counter}`, number: '', date: '', amount: '' }
}

export const defaultDemandInput = (today: string): DemandInput => ({
  tone: 'reminder',
  creditorName: '',
  creditorId: '',
  creditorAddress: '',
  creditorPhone: '',
  creditorEmail: '',
  signerName: '',
  debtorName: '',
  debtorAddress: '',
  subject: '',
  invoices: [{ id: 'inv-1', number: '', date: '', amount: '' }],
  paid: '',
  issueDate: today,
  payDays: '7',
  bankName: '',
  bankBranch: '',
  bankAccount: '',
  accountHolder: '',
  appPhone: '',
  interest: 'none',
  interestSource: '',
  note: '',
})

export const sampleDemandInput = (today: string): DemandInput => ({
  ...defaultDemandInput(today),
  tone: 'demand',
  creditorName: 'סטודיו לדוגמה',
  creditorId: '000000000',
  creditorAddress: 'רחוב הדוגמה 1, חיפה',
  creditorPhone: '04-0000000',
  creditorEmail: 'office@example.co.il',
  signerName: 'נועה לוי',
  debtorName: 'חברה לדוגמה בע״מ',
  debtorAddress: 'שדרות הדוגמה 5, תל אביב-יפו',
  subject: 'עיצוב ובניית אתר לפי הצעת מחיר מיום 3 ביוני 2026',
  invoices: [
    { id: 'sample-1', number: '1042', date: '2026-07-01', amount: '6000' },
    { id: 'sample-2', number: '1057', date: '2026-08-01', amount: '4500' },
  ],
  paid: '1500',
  payDays: '14',
  bankName: 'בנק לדוגמה',
  bankBranch: '000',
  bankAccount: '000000',
  accountHolder: 'נועה לוי',
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

const parseIso = (iso: string) => {
  const match = ISO_DATE.exec(iso)
  if (!match) return null
  const date = new Date(Date.UTC(Number(match[1]), Number(match[2]) - 1, Number(match[3])))
  return Number.isNaN(date.getTime()) || date.getUTCDate() !== Number(match[3]) ? null : date
}

export function formatDate(iso: string): string {
  const date = parseIso(iso)
  if (!date) return ''
  return `${date.getUTCDate()} ב${hebrewMonths[date.getUTCMonth()]} ${date.getUTCFullYear()}`
}

export function shortDate(iso: string): string {
  const date = parseIso(iso)
  if (!date) return ''
  const pad = (value: number) => String(value).padStart(2, '0')
  return `${pad(date.getUTCDate())}.${pad(date.getUTCMonth() + 1)}.${date.getUTCFullYear()}`
}

export function addDays(iso: string, days: number): string {
  const date = parseIso(iso)
  if (!date) return ''
  date.setUTCDate(date.getUTCDate() + days)
  return date.toISOString().slice(0, 10)
}

export function readAgorot(text: string): { value: number; error: boolean; empty: boolean } {
  const value = text.replace(/[\s,₪]/g, '')
  if (!value) return { value: 0, error: false, empty: true }
  if (!/^\d{1,9}(\.\d{1,2})?$/.test(value)) return { value: 0, error: true, empty: false }
  const [whole, fraction = ''] = value.split('.')
  return { value: Number(whole) * 100 + Number(fraction.padEnd(2, '0')), error: false, empty: false }
}

export function formatShekels(agorot: number): string {
  const sign = agorot < 0 ? '-' : ''
  const abs = Math.abs(agorot)
  const whole = Math.floor(abs / 100)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  const cents = abs % 100
  return `${sign}${whole}${cents ? `.${String(cents).padStart(2, '0')}` : ''} ₪`
}

export function readDays(text: string): number | null {
  const value = text.trim()
  if (!/^\d{1,3}$/.test(value)) return null
  const days = Number(value)
  return days >= 1 && days <= 90 ? days : null
}

export function demandTotals(input: DemandInput) {
  const invoiced = input.invoices.reduce((sum, invoice) => {
    const amount = readAgorot(invoice.amount)
    return amount.error ? sum : sum + amount.value
  }, 0)
  const paid = readAgorot(input.paid)
  const paidValue = paid.error ? 0 : paid.value
  return { invoiced, paid: paidValue, due: Math.max(invoiced - paidValue, 0) }
}

export function demandErrors(input: DemandInput): DemandErrors {
  const errors: DemandErrors = {}
  const rows: Record<string, string> = {}
  input.invoices.forEach((invoice) => {
    if (readAgorot(invoice.amount).error) rows[invoice.id] = 'הקלידו סכום בספרות, למשל 4500 או 4500.50.'
    else if (invoice.date && input.issueDate && invoice.date > input.issueDate) {
      rows[invoice.id] = 'תאריך החשבונית מאוחר מתאריך המכתב.'
    }
  })
  if (Object.keys(rows).length) errors.rows = rows
  if (readAgorot(input.paid).error) errors.paid = 'הקלידו סכום בספרות, או השאירו ריק.'
  const totals = demandTotals(input)
  if (!readAgorot(input.paid).error && totals.paid > 0 && totals.paid >= totals.invoiced && totals.invoiced > 0) {
    errors.paid = 'הסכום ששולם מכסה את כל החשבוניות, כך שאין יתרה לדרוש.'
  }
  if (readDays(input.payDays) === null) errors.payDays = 'הקלידו מספר ימים בין 1 ל-90.'
  return errors
}

const piece = (text: string, fallback: string): Piece => {
  const value = text.trim()
  return value ? { text: value, missing: false } : { text: fallback, missing: true }
}

const plain = (text: string): Piece => ({ text, missing: false })

const subjects: Record<DemandTone, string> = {
  reminder: 'הנדון: תזכורת לתשלום חשבון פתוח',
  demand: 'הנדון: דרישה לתשלום חוב',
  final: 'הנדון: התראה לפני נקיטת הליכים משפטיים',
}

const openings: Record<DemandTone, string> = {
  reminder: 'רציתי להזכיר בנימוס שהחשבונות שלהלן עדיין לא שולמו, ומועד התשלום שלהם כבר עבר. ייתכן שמדובר בטעות או בעיכוב טכני.',
  demand:
    'למרות פניות קודמות, החשבונות שלהלן עדיין לא שולמו, ומועד התשלום שלהם עבר. השירותים או המוצרים שבגינם הוצאו החשבונות סופקו כמוסכם.',
  final:
    'זו פנייה אחרונה לפני נקיטת הליכים משפטיים. למרות פניות קודמות, החשבונות שלהלן עדיין לא שולמו, ומועד התשלום שלהם עבר.',
}

const closings: Record<DemandTone, string[]> = {
  reminder: ['אם התשלום כבר בוצע, אפשר להתעלם מהמכתב, ואשמח לקבל אסמכתה. בכל שאלה אפשר לפנות אליי.', 'תודה מראש,'],
  demand: [
    'אם יש מחלוקת על החשבון או שהתשלום כבר בוצע, אבקש לפנות אליי עד המועד האמור, ואבחן את הדברים בתום לב.',
    'בכבוד רב,',
  ],
  final: [
    'אם לא ישולם הסכום עד המועד האמור, אשקול לפנות לבית המשפט בתביעה לגביית החוב, בלי הודעה נוספת, ולבקש לחייב בהוצאות המשפט. אם יש מחלוקת על החשבון, אבקש לפנות אליי עד המועד האמור, ואשמח להגיע להסדר.',
    'מכתב זה אינו בא למצות את טענותיי וזכויותיי.',
    'בכבוד רב,',
  ],
}

export function paymentLines(input: DemandInput): string[] {
  const lines: string[] = []
  const bank = [
    input.bankName.trim(),
    input.bankBranch.trim() ? `סניף ${input.bankBranch.trim()}` : '',
    input.bankAccount.trim() ? `חשבון ${input.bankAccount.trim()}` : '',
  ].filter(Boolean)
  if (bank.length) {
    const holder = input.accountHolder.trim()
    lines.push(`העברה בנקאית: ${bank.join(', ')}${holder ? `, על שם ${holder}` : ''}.`)
  }
  const app = input.appPhone.trim()
  if (app) lines.push(`העברה באפליקציית תשלומים למספר ${app}.`)
  return lines
}

export function interestLine(input: DemandInput): string {
  if (input.interest === 'agreed') {
    const source = input.interestSource.trim() || '[ההסכם או הצעת המחיר שבהם סוכמה הריבית]'
    return `לסכום יתווספו ריבית פיגורים והפרשי הצמדה כפי שסוכם ב${source}, מיום שבו חל מועד התשלום ועד התשלום בפועל.`
  }
  if (input.interest === 'court') {
    return 'אם אפנה לבית המשפט, אבקש לפסוק על הסכום גם ריבית והפרשי הצמדה לפי חוק פסיקת ריבית והצמדה, התשכ״א-1961.'
  }
  return ''
}

export function buildDemand(input: DemandInput): DemandModel {
  const totals = demandTotals(input)
  const days = readDays(input.payDays)
  const deadline = days !== null ? formatDate(addDays(input.issueDate, days)) : ''
  const creditor = piece(input.creditorName, '[שם העסק]')
  const debtor = piece(input.debtorName, '[שם הלקוח]')
  const letterhead = [
    input.creditorId.trim() ? `ע.מ./ח.פ. ${input.creditorId.trim()}` : '',
    input.creditorAddress.trim(),
    input.creditorPhone.trim(),
    input.creditorEmail.trim(),
  ]
    .filter(Boolean)
    .join(' · ')

  const rows: DemandRow[] = input.invoices.map((invoice, index) => {
    const amount = readAgorot(invoice.amount)
    return {
      key: invoice.id,
      number: piece(invoice.number, `[חשבונית ${index + 1}]`),
      date: shortDate(invoice.date),
      amount: amount.empty || amount.error ? '' : formatShekels(amount.value),
    }
  })

  const totalRows: DemandModel['totals'] = []
  if (totals.paid > 0) {
    totalRows.push({ label: 'סך החשבונות', value: formatShekels(totals.invoiced), strong: false })
    totalRows.push({ label: 'שולם עד היום', value: formatShekels(totals.paid), strong: false })
  }
  totalRows.push({ label: 'יתרה לתשלום', value: formatShekels(totals.due), strong: true })

  const deadlinePiece = piece(deadline, '[מועד התשלום]')
  const amountPiece = plain(formatShekels(totals.due))
  const request: Piece[] =
    input.tone === 'reminder'
      ? [plain('אודה אם תסדירו את התשלום, '), amountPiece, plain(', עד '), deadlinePiece, plain('.')]
      : input.tone === 'demand'
        ? [plain('יש לשלם את היתרה, '), amountPiece, plain(', לא יאוחר מ-'), deadlinePiece, plain('.')]
        : [plain('יש לשלם את מלוא היתרה, '), amountPiece, plain(', לא יאוחר מ-'), deadlinePiece, plain('.')]

  const subjectLine = input.subject.trim()
  const opening = subjectLine ? `${openings[input.tone]} החשבונות הוצאו בגין: ${subjectLine}.` : openings[input.tone]

  return {
    tone: input.tone,
    creditor,
    letterhead,
    date: piece(formatDate(input.issueDate), '[תאריך]'),
    addressee: [debtor, ...(input.debtorAddress.trim() ? [plain(input.debtorAddress.trim())] : [])],
    subject: subjects[input.tone],
    greeting: input.tone === 'reminder' ? [plain('שלום רב,')] : [plain('א.ג.נ.,')],
    opening,
    rows,
    totals: totalRows,
    request,
    payment: paymentLines(input),
    interest: input.tone === 'reminder' ? '' : interestLine(input),
    closing: closings[input.tone],
    sign: 'חתימה',
    signer: piece(input.signerName, '[שם החותם]'),
    signerBusiness: input.creditorName.trim(),
    fileTitle: [subjects[input.tone].replace('הנדון: ', ''), input.debtorName.trim()].filter(Boolean).join(' - '),
  }
}

const text = (pieces: Piece[]) => pieces.map((part) => part.text).join('')

export function demandToText(model: DemandModel): string {
  const out: string[] = [model.creditor.text]
  if (model.letterhead) out.push(model.letterhead)
  out.push('', model.date.text, '', 'לכבוד', ...model.addressee.map((part) => part.text), '', model.subject, '')
  out.push(text(model.greeting), '', model.opening, '')
  model.rows.forEach((row) => {
    out.push(`חשבונית ${row.number.text}${row.date ? ` מיום ${row.date}` : ''}: ${row.amount || '[סכום]'}`)
  })
  model.totals.forEach((row) => out.push(`${row.label}: ${row.value}`))
  out.push('', text(model.request))
  if (model.payment.length) out.push('', 'אפשרויות תשלום:', ...model.payment)
  if (model.interest) out.push('', model.interest)
  out.push('', ...model.closing, model.signer.text)
  if (model.signerBusiness) out.push(model.signerBusiness)
  return out.join('\n')
}

export function whatsappText(input: DemandInput): string {
  const model = buildDemand(input)
  const totals = demandTotals(input)
  const days = readDays(input.payDays)
  const deadline = days !== null ? shortDate(addDays(input.issueDate, days)) : '[מועד]'
  const name = input.debtorName.trim() || '[שם הלקוח]'
  const business = input.creditorName.trim() || '[שם העסק]'
  const numbers = model.rows.map((row) => row.number.text).join(', ')
  const amount = formatShekels(totals.due)
  const pay = model.payment.length ? `\n\n${model.payment.join('\n')}` : ''
  if (input.tone === 'reminder') {
    return `שלום ${name}, כאן ${business}. רק תזכורת קטנה: חשבונית ${numbers} על סך ${amount} עדיין פתוחה. אשמח אם תסדירו עד ${deadline}. אם כבר שילמתם, תודה ותתעלמו מההודעה.${pay}`
  }
  if (input.tone === 'demand') {
    return `שלום ${name}, כאן ${business}. חשבונית ${numbers} על סך ${amount} עדיין לא שולמה, למרות פניות קודמות. אבקש לשלם עד ${deadline}. אם יש בעיה בחשבון, אשמח שתעדכנו אותי עד אז. מכתב דרישה מפורט נשלח אליכם במקביל.${pay}`
  }
  return `שלום ${name}, כאן ${business}. זו פנייה אחרונה בעניין חשבונית ${numbers} על סך ${amount}. אם הסכום לא ישולם עד ${deadline}, אשקול לפנות לבית המשפט לגביית החוב. מכתב התראה מפורט נשלח אליכם במקביל. אם יש מחלוקת, אשמח לשמוע עד אז ולהגיע להסדר.${pay}`
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
.date{margin:24px 0 0;text-align:end}
.to{margin:16px 0 0}
.to p,.close p,.body p{margin:0}
h1{margin:22px 0 0;font-size:17px;font-weight:700;text-decoration:underline;text-underline-offset:4px}
.body{margin:16px 0 0}
.body p+p{margin-top:10px}
table{width:100%;margin:14px 0 0;border-collapse:collapse;font-size:14px}
th,td{padding:7px 10px;border-bottom:1px solid #e2ddd6;text-align:start}
thead th{background:#f6f4f0;color:#5c6072;font-weight:600}
td.num{text-align:end;white-space:nowrap}
tfoot td{font-weight:600}
tfoot tr.strong td{font-weight:700;border-top:2px solid #1a1f33}
.pay{margin:14px 0 0;padding:10px 14px;border:1px solid #e2ddd6;border-radius:6px}
.pay p{margin:0}
.close{margin:26px 0 0;break-inside:avoid}
.signer{font-weight:700}
.sign{width:min(100%,240px);margin:40px 0 0 !important;padding-top:6px;border-top:1px solid #1a1f33;color:#5c6072;font-size:12.5px}
.missing{color:#8a8580;font-weight:400}
@media print{body{background:#fff}.sheet{width:auto;min-height:0;margin:0;padding:0;box-shadow:none}}
@media screen and (max-width:820px){.sheet{width:auto;min-height:0;margin:0;padding:24px 16px;box-shadow:none}}`

export function demandDocument(model: DemandModel): string {
  const rows = model.rows
    .map(
      (row) =>
        `<tr><td>${pieceHtml(row.number)}</td><td>${escapeHtml(row.date)}</td><td class="num">${
          row.amount ? escapeHtml(row.amount) : '<span class="missing">[סכום]</span>'
        }</td></tr>`,
    )
    .join('')
  const totals = model.totals
    .map(
      (row) =>
        `<tr${row.strong ? ' class="strong"' : ''}><td colspan="2">${escapeHtml(row.label)}</td><td class="num">${escapeHtml(row.value)}</td></tr>`,
    )
    .join('')
  const payment = model.payment.length
    ? `<div class="pay"><p><strong>אפשרויות תשלום</strong></p>${model.payment.map((line) => `<p>${escapeHtml(line)}</p>`).join('')}</div>`
    : ''
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
<header class="head">
<p class="biz">${pieceHtml(model.creditor)}</p>
${model.letterhead ? `<p class="muted">${escapeHtml(model.letterhead)}</p>` : ''}
</header>
<p class="date">${pieceHtml(model.date)}</p>
<div class="to"><p>לכבוד</p>${model.addressee.map((part) => `<p>${pieceHtml(part)}</p>`).join('')}</div>
<h1>${escapeHtml(model.subject)}</h1>
<div class="body">
<p>${model.greeting.map(pieceHtml).join('')}</p>
<p>${escapeHtml(model.opening)}</p>
</div>
<table><thead><tr><th>חשבונית</th><th>תאריך</th><th class="num">סכום</th></tr></thead><tbody>${rows}</tbody><tfoot>${totals}</tfoot></table>
<div class="body">
<p><strong>${model.request.map(pieceHtml).join('')}</strong></p>
${model.interest ? `<p>${escapeHtml(model.interest)}</p>` : ''}
</div>
${payment}
<div class="close">
${model.closing.map((line) => `<p>${escapeHtml(line)}</p>`).join('')}
<p class="signer">${pieceHtml(model.signer)}</p>
${model.signerBusiness ? `<p>${escapeHtml(model.signerBusiness)}</p>` : ''}
<p class="sign">${escapeHtml(model.sign)}</p>
</div>
</article>
</body>
</html>
`
}
