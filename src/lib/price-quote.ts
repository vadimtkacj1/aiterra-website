import { STANDARD_VAT_RATE, formatShekels, parseHundredths } from '@/lib/vat-calculator'

export type EntityType = 'licensed' | 'exempt' | 'company'
export type VatMode = 'before' | 'included'
export type DiscountType = 'percent' | 'amount'

export type QuoteItem = {
  id: number
  description: string
  quantity: string
  unitPrice: string
  discount: string
}

export type QuoteInput = {
  businessName: string
  entityType: EntityType
  businessId: string
  phone: string
  email: string
  address: string
  logo: string
  clientName: string
  clientId: string
  clientPhone: string
  clientEmail: string
  clientAddress: string
  quoteNumber: string
  date: string
  validDays: string
  subject: string
  items: QuoteItem[]
  vatMode: VatMode
  vatRate: string
  discount: string
  discountType: DiscountType
  paymentTerms: string
  notes: string
  signer: string
  credit: boolean
}

export type QuoteLine = {
  id: number
  description: string
  quantity: number
  unitPrice: number
  discountRate: number
  discountAmount: number
  total: number
}

export type QuoteTotals = {
  subtotal: number
  discount: number
  net: number
  vat: number
  total: number
}

export type QuoteModel = {
  input: QuoteInput
  exempt: boolean
  rate: number
  lines: QuoteLine[]
  hasLineDiscount: boolean
  totals: QuoteTotals
  validUntil: string
}

export type NumberCheck = { value: number; error: string }

export const GENERATOR_URL = 'https://www.aiterra.co.il/tools/price-quote-generator'
export const NOT_AN_INVOICE = 'הצעת מחיר אינה חשבונית מס ואינה מסמך חשבונאי.'
export const MAX_ITEMS = 50

const FULL_PERCENT = 10_000
const MAX_QUANTITY = 100_000
const MAX_PRICE = 10_000_000
const STANDARD_RATE = STANDARD_VAT_RATE * 100

export const entityTypes: { id: EntityType; label: string; prefix: string }[] = [
  { id: 'licensed', label: 'עוסק מורשה', prefix: 'עוסק מורשה' },
  { id: 'exempt', label: 'עוסק פטור', prefix: 'עוסק פטור' },
  { id: 'company', label: 'חברה בע״מ', prefix: 'ח.פ.' },
]

export const emptyItem = (id: number): QuoteItem => ({
  id,
  description: '',
  quantity: '1',
  unitPrice: '',
  discount: '',
})

export const defaultQuoteInput = (today: string): QuoteInput => ({
  businessName: '',
  entityType: 'licensed',
  businessId: '',
  phone: '',
  email: '',
  address: '',
  logo: '',
  clientName: '',
  clientId: '',
  clientPhone: '',
  clientEmail: '',
  clientAddress: '',
  quoteNumber: today ? `${today.slice(0, 4)}-001` : '',
  date: today,
  validDays: '30',
  subject: '',
  items: [emptyItem(1)],
  vatMode: 'before',
  vatRate: String(STANDARD_VAT_RATE),
  discount: '',
  discountType: 'percent',
  paymentTerms: '',
  notes: '',
  signer: '',
  credit: true,
})

export const sampleQuoteInput = (today: string): QuoteInput => ({
  ...defaultQuoteInput(today),
  businessName: 'סטודיו לצילום לדוגמה',
  phone: '050-0000000',
  email: 'studio@example.co.il',
  address: 'רחוב הדוגמה 1, חיפה',
  clientName: 'חנות לדוגמה בע״מ',
  clientEmail: 'office@example.co.il',
  quoteNumber: `${today.slice(0, 4)}-014`,
  subject: 'צילום מוצרים לחנות האינטרנטית',
  items: [
    { id: 1, description: 'יום צילום בסטודיו, כולל תאורה ורקעים', quantity: '1', unitPrice: '2400', discount: '' },
    { id: 2, description: 'עריכת תמונות וייצוא לאתר', quantity: '40', unitPrice: '35', discount: '' },
    { id: 3, description: 'צילומי אווירה בבית הלקוח', quantity: '1', unitPrice: '900', discount: '10' },
  ],
  paymentTerms: '50% מקדמה באישור ההצעה, והיתרה במסירת התמונות. העברה בנקאית או ביט.',
  notes: 'המחיר כולל סבב תיקונים אחד. סבב נוסף בתיאום מראש.',
  credit: false,
})

const mulDiv = (a: number, b: number, c: number) => {
  const two = BigInt(2)
  const divisor = BigInt(c)
  return Number((BigInt(a) * BigInt(b) * two + divisor) / (divisor * two))
}

function readNumber(text: string, max: number, tooLarge: string): NumberCheck {
  const parsed = parseHundredths(text)
  if (parsed.ok) {
    return parsed.hundredths > max * 100 ? { value: 0, error: tooLarge } : { value: parsed.hundredths, error: '' }
  }
  if (parsed.reason === 'empty') return { value: 0, error: '' }
  if (parsed.reason === 'too-large') return { value: 0, error: tooLarge }
  return { value: 0, error: 'אפשר להקליד רק ספרות, ונקודה לשבר עשרוני.' }
}

const thousands = (value: number) => value.toLocaleString('he-IL')

export const readQuantity = (text: string) =>
  readNumber(text, MAX_QUANTITY, `הכמות גדולה מדי. אפשר עד ${thousands(MAX_QUANTITY)}.`)

export const readPrice = (text: string) =>
  readNumber(text, MAX_PRICE, `הסכום גדול מדי. אפשר עד ${thousands(MAX_PRICE)} ₪.`)

export const readPercent = (text: string) => readNumber(text, 100, 'הקלידו אחוז בין 0 ל-100.')

export function readVatRate(text: string): NumberCheck {
  const fallback = `עד אז החישוב לפי ${STANDARD_VAT_RATE}%.`
  if (!text.trim()) return { value: STANDARD_RATE, error: `הקלידו שיעור באחוזים. ${fallback}` }
  const check = readPercent(text)
  return check.error ? { value: STANDARD_RATE, error: `${check.error} ${fallback}` } : check
}

export function readValidDays(text: string): { days: number; error: string } {
  const value = text.trim()
  if (!value) return { days: 0, error: '' }
  if (!/^\d{1,3}$/.test(value) || Number(value) < 1) return { days: 0, error: 'הקלידו מספר ימים בין 1 ל-999.' }
  return { days: Number(value), error: '' }
}

export function addDays(iso: string, days: number): string {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso)
  if (!match || !days) return ''
  const date = new Date(Date.UTC(Number(match[1]), Number(match[2]) - 1, Number(match[3]) + days))
  return date.toISOString().slice(0, 10)
}

export const formatDate = (iso: string) => {
  const [year, month, day] = iso.split('-')
  return year && month && day ? `${day}.${month}.${year}` : iso
}

const quantityFormat = new Intl.NumberFormat('he-IL', { maximumFractionDigits: 2 })

export const formatQuantity = (hundredths: number) => quantityFormat.format(hundredths / 100)
export const formatPercent = (basisPoints: number) => `${quantityFormat.format(basisPoints / 100)}%`
export { formatShekels }

export function computeLine(item: QuoteItem): QuoteLine {
  const quantity = readQuantity(item.quantity).value
  const unitPrice = readPrice(item.unitPrice).value
  const discountRate = readPercent(item.discount).value
  const gross = mulDiv(quantity, unitPrice, 100)
  const discountAmount = mulDiv(gross, discountRate, FULL_PERCENT)
  return {
    id: item.id,
    description: item.description.trim(),
    quantity,
    unitPrice,
    discountRate,
    discountAmount,
    total: gross - discountAmount,
  }
}

export function buildQuote(input: QuoteInput): QuoteModel {
  const exempt = input.entityType === 'exempt'
  const rate = exempt ? 0 : readVatRate(input.vatRate).value
  const lines = input.items.map(computeLine).filter((line) => line.description || line.unitPrice > 0)
  const subtotal = lines.reduce((sum, line) => sum + line.total, 0)
  const discount =
    input.discountType === 'percent'
      ? mulDiv(subtotal, readPercent(input.discount).value, FULL_PERCENT)
      : Math.min(readPrice(input.discount).value, subtotal)
  const afterDiscount = subtotal - discount
  let net = afterDiscount
  let total = afterDiscount
  if (!exempt && input.vatMode === 'before') total = net + mulDiv(net, rate, FULL_PERCENT)
  if (!exempt && input.vatMode === 'included') net = mulDiv(total, FULL_PERCENT, FULL_PERCENT + rate)
  return {
    input,
    exempt,
    rate,
    lines,
    hasLineDiscount: lines.some((line) => line.discountRate > 0),
    totals: { subtotal, discount, net, vat: total - net, total },
    validUntil: addDays(input.date, readValidDays(input.validDays).days),
  }
}

export const businessLine = (input: QuoteInput) => {
  const prefix = entityTypes.find((type) => type.id === input.entityType)?.prefix ?? ''
  return input.businessId.trim() ? `${prefix} ${input.businessId.trim()}` : prefix
}

export const clientIdLine = (input: QuoteInput) =>
  input.clientId.trim() ? `ח.פ. או ע.מ. ${input.clientId.trim()}` : ''

export const priceBasis = (model: QuoteModel) => {
  if (model.exempt) return 'המחירים בש״ח. העסק עוסק פטור ואינו גובה מע״מ.'
  return model.input.vatMode === 'before' ? 'המחירים בש״ח, לפני מע״מ.' : 'המחירים בש״ח, כולל מע״מ.'
}

export const discountLabel = (model: QuoteModel) => {
  const { input } = model
  return input.discountType === 'percent' ? `הנחה ${formatPercent(readPercent(input.discount).value)}` : 'הנחה'
}

export type TotalRow = { key: string; label: string; value: number; grand?: boolean }

export function totalRows(model: QuoteModel): TotalRow[] {
  const { totals, exempt, rate } = model
  const rows: TotalRow[] = []
  if (totals.discount > 0) {
    rows.push(
      { key: 'subtotal', label: 'סכום ביניים', value: totals.subtotal },
      { key: 'discount', label: discountLabel(model), value: -totals.discount },
    )
  }
  if (exempt) return [...rows, { key: 'total', label: 'סה״כ לתשלום', value: totals.total, grand: true }]
  return [
    ...rows,
    { key: 'net', label: 'סה״כ לפני מע״מ', value: totals.net },
    { key: 'vat', label: `מע״מ ${formatPercent(rate)}`, value: totals.vat },
    { key: 'total', label: 'סה״כ לתשלום כולל מע״מ', value: totals.total, grand: true },
  ]
}

const shekelNumber = new Intl.NumberFormat('he-IL', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

export const formatSigned = (value: number) =>
  value < 0 ? `⁦-${shekelNumber.format(-value / 100)}⁩ ₪` : formatShekels(value)

export const quoteFileTitle = (input: QuoteInput) =>
  ['הצעת מחיר', input.quoteNumber.trim(), input.clientName.trim()].filter(Boolean).join(' ')

const placeholder = (value: string, fallback: string) => value.trim() || fallback

const joinParts = (parts: string[]) => parts.map((part) => part.trim()).filter(Boolean).join(' · ')

export function quoteToText(model: QuoteModel): string {
  const { input } = model
  const out: string[] = [`הצעת מחיר${input.quoteNumber.trim() ? ` מס׳ ${input.quoteNumber.trim()}` : ''}`]
  if (input.date) out.push(`תאריך: ${formatDate(input.date)}`)
  if (model.validUntil) out.push(`בתוקף עד: ${formatDate(model.validUntil)}`)
  out.push('', `מאת: ${placeholder(input.businessName, '[שם העסק]')}`, businessLine(input))
  const contact = joinParts([input.phone, input.email, input.address])
  if (contact) out.push(contact)
  out.push('', `לכבוד: ${placeholder(input.clientName, '[שם הלקוח]')}`)
  const client = joinParts([clientIdLine(input), input.clientPhone, input.clientEmail, input.clientAddress])
  if (client) out.push(client)
  if (input.subject.trim()) out.push('', `נושא: ${input.subject.trim()}`)
  out.push('', priceBasis(model))
  model.lines.forEach((line, index) => {
    const discount = line.discountRate ? `, הנחה ${formatPercent(line.discountRate)}` : ''
    out.push(
      `${index + 1}. ${line.description || '[תיאור]'}: ${formatQuantity(line.quantity)} × ${formatShekels(line.unitPrice)}${discount} = ${formatShekels(line.total)}`,
    )
  })
  if (!model.lines.length) out.push('[הפריטים בהצעה]')
  out.push('', ...totalRows(model).map((row) => `${row.label}: ${formatSigned(row.value)}`))
  if (input.paymentTerms.trim()) out.push('', 'תנאי תשלום:', input.paymentTerms.trim())
  if (input.notes.trim()) out.push('', 'הערות:', input.notes.trim())
  out.push('', NOT_AN_INVOICE)
  return out.join('\n')
}

const escapeHtml = (value: string) =>
  value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

const LOGO_DATA_URL = /^data:image\/(png|jpeg|webp|svg\+xml);base64,[\w+/=]+$/

export const safeLogo = (logo: string) => (LOGO_DATA_URL.test(logo) ? logo : '')

const documentCss = `@page{size:A4;margin:14mm 14mm 16mm}
*{box-sizing:border-box}
html{-webkit-print-color-adjust:exact;print-color-adjust:exact}
body{margin:0;background:#ece8e2;color:#1a1f33;font:14px/1.55 Arial,"Segoe UI",Helvetica,sans-serif}
.sheet{width:210mm;min-height:297mm;margin:24px auto;padding:16mm 15mm;background:#fff;box-shadow:0 10px 30px rgba(0,0,0,.12)}
.head{display:flex;justify-content:space-between;align-items:flex-start;gap:24px;padding-bottom:16px;border-bottom:2px solid #1a1f33}
.logo{display:block;max-width:180px;max-height:72px;margin-bottom:10px;object-fit:contain}
.biz{margin:0;font-size:18px;font-weight:700}
.muted{margin:2px 0 0;color:#5c6072;font-size:12.5px}
.doc{text-align:end}
h1{margin:0;font-size:28px;line-height:1.2}
.meta{display:grid;grid-template-columns:auto auto;justify-content:end;gap:2px 12px;margin:8px 0 0;font-size:13px}
.meta dt{color:#5c6072}
.meta dd{margin:0;font-weight:600}
.to{margin-top:18px}
h2{margin:0 0 4px;color:#5c6072;font-size:12px;font-weight:700}
.client{margin:0;font-size:16px;font-weight:700}
.subject{margin:14px 0 0}
table{width:100%;border-collapse:collapse;margin-top:18px;font-size:13px}
caption{caption-side:top;padding-bottom:6px;color:#5c6072;font-size:12px;text-align:start}
th{padding:8px 10px;border-bottom:1px solid #d9d3ca;background:#f1eee9;font-weight:700;text-align:start}
td{padding:8px 10px;border-bottom:1px solid #ece7e0;vertical-align:top}
tr{break-inside:avoid}
.n{text-align:end;white-space:nowrap;font-variant-numeric:tabular-nums}
.desc{white-space:pre-line}
.lineMeta{display:none;color:#5c6072;font-size:12px}
.totals{width:min(100%,310px);margin:14px 0 0;margin-inline-start:auto;font-size:13.5px}
.totals div{display:flex;justify-content:space-between;gap:16px;padding:4px 0}
.totals dd{margin:0;font-variant-numeric:tabular-nums;white-space:nowrap}
.totals .grand{margin-top:4px;padding-top:8px;border-top:2px solid #1a1f33;font-size:16px;font-weight:700}
.block{margin-top:20px;break-inside:avoid}
.block p{margin:0;white-space:pre-line}
.sign{display:grid;grid-template-columns:1fr 1fr;gap:40px;margin-top:44px;break-inside:avoid}
.sign p{margin:0;padding-top:6px;border-top:1px solid #1a1f33;color:#5c6072;font-size:12px}
.foot{margin-top:28px;padding-top:10px;border-top:1px solid #ece7e0;color:#5c6072;font-size:11.5px}
.foot p{margin:0}
.foot a{color:#2447d6}
@media print{body{background:#fff}.sheet{width:auto;min-height:0;margin:0;padding:0;box-shadow:none}}
@media screen and (max-width:820px){.sheet{width:auto;min-height:0;margin:0;padding:24px 16px;box-shadow:none}}
@media screen and (max-width:560px){.head{flex-direction:column}.doc{text-align:start}.meta{justify-content:start}.hideNarrow{display:none}.lineMeta{display:block}.sign{grid-template-columns:1fr;gap:28px}}`

export function quoteDocument(model: QuoteModel): string {
  const { input } = model
  const text = (value: string) => escapeHtml(value.trim())
  const logo = safeLogo(input.logo)
  const contact = joinParts([input.phone, input.email, input.address])
  const client = joinParts([input.clientPhone, input.clientEmail, input.clientAddress])
  const meta = [
    input.quoteNumber.trim() ? ['מספר', text(input.quoteNumber)] : null,
    input.date ? ['תאריך', formatDate(input.date)] : null,
    model.validUntil ? ['בתוקף עד', formatDate(model.validUntil)] : null,
  ].filter((pair): pair is string[] => Boolean(pair))
  const discountHead = model.hasLineDiscount ? '<th scope="col" class="n hideNarrow">הנחה</th>' : ''
  const rows = model.lines.length
    ? model.lines
        .map((line, index) => {
          const quantity = formatQuantity(line.quantity)
          const unit = formatShekels(line.unitPrice)
          const lineDiscount = line.discountRate ? ` · הנחה ${formatPercent(line.discountRate)}` : ''
          const discountCell = model.hasLineDiscount
            ? `<td class="n hideNarrow">${line.discountRate ? formatPercent(line.discountRate) : ''}</td>`
            : ''
          return `<tr><td class="n">${index + 1}</td><td><span class="desc">${text(line.description) || '[תיאור]'}</span><span class="lineMeta">${quantity} × ${unit}${lineDiscount}</span></td><td class="n hideNarrow">${quantity}</td><td class="n hideNarrow">${unit}</td>${discountCell}<td class="n">${formatShekels(line.total)}</td></tr>`
        })
        .join('\n')
    : `<tr><td class="n">1</td><td>[הפריטים בהצעה]</td><td class="n hideNarrow"></td><td class="n hideNarrow"></td>${model.hasLineDiscount ? '<td class="hideNarrow"></td>' : ''}<td class="n">${formatShekels(0)}</td></tr>`
  const totals = totalRows(model)
    .map(
      (row) =>
        `<div${row.grand ? ' class="grand"' : ''}><dt>${escapeHtml(row.label)}</dt><dd>${formatSigned(row.value)}</dd></div>`,
    )
    .join('')
  const block = (title: string, value: string) =>
    value.trim() ? `<section class="block"><h2>${title}</h2><p>${text(value)}</p></section>` : ''
  const credit = input.credit
    ? `<p>נוצר במחולל הצעות המחיר של <a href="${GENERATOR_URL}">AITERRA</a></p>`
    : ''
  return `<!doctype html>
<html lang="he" dir="rtl">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${escapeHtml(quoteFileTitle(input))}</title>
<style>${documentCss}</style>
</head>
<body>
<article class="sheet">
<header class="head">
<div>
${logo ? `<img class="logo" src="${logo}" alt="">` : ''}
<p class="biz">${text(input.businessName) || '[שם העסק]'}</p>
<p class="muted">${escapeHtml(businessLine(input))}</p>
${contact ? `<p class="muted">${escapeHtml(contact)}</p>` : ''}
</div>
<div class="doc">
<h1>הצעת מחיר</h1>
${meta.length ? `<dl class="meta">${meta.map(([term, value]) => `<dt>${term}</dt><dd>${value}</dd>`).join('')}</dl>` : ''}
</div>
</header>
<section class="to">
<h2>לכבוד</h2>
<p class="client">${text(input.clientName) || '[שם הלקוח]'}</p>
${clientIdLine(input) ? `<p class="muted">${escapeHtml(clientIdLine(input))}</p>` : ''}
${client ? `<p class="muted">${escapeHtml(client)}</p>` : ''}
</section>
${input.subject.trim() ? `<p class="subject"><strong>נושא:</strong> ${text(input.subject)}</p>` : ''}
<table>
<caption>${priceBasis(model)}</caption>
<thead><tr><th scope="col" class="n">#</th><th scope="col">תיאור</th><th scope="col" class="n hideNarrow">כמות</th><th scope="col" class="n hideNarrow">מחיר ליחידה</th>${discountHead}<th scope="col" class="n">סה״כ</th></tr></thead>
<tbody>
${rows}
</tbody>
</table>
<dl class="totals">${totals}</dl>
${block('תנאי תשלום', input.paymentTerms)}
${block('הערות', input.notes)}
<section class="sign">
<p>חתימת העסק${input.signer.trim() ? `: ${text(input.signer)}` : ''}</p>
<p>אישור הלקוח: שם, חתימה ותאריך</p>
</section>
<footer class="foot">
<p>${NOT_AN_INVOICE}</p>
${credit}
</footer>
</article>
</body>
</html>
`
}
