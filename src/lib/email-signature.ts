export type SignatureTemplate = 'photo' | 'logo' | 'minimal'
export type SignatureDirection = 'rtl' | 'ltr'
export type SocialKey = 'facebook' | 'instagram' | 'linkedin' | 'tiktok' | 'whatsapp'
export type LogoSize = 'small' | 'medium' | 'large'

export type SignatureInput = {
  template: SignatureTemplate
  direction: SignatureDirection
  fullName: string
  role: string
  company: string
  phone: string
  mobile: string
  email: string
  website: string
  address: string
  photoUrl: string
  logoUrl: string
  logoSize: LogoSize
  facebook: string
  instagram: string
  linkedin: string
  tiktok: string
  whatsapp: string
  accent: string
  credit: boolean
}

export type SignatureImage = { src: string; width: number; height: number }
export type SignatureImages = { photo?: SignatureImage; logo?: SignatureImage }
export type RenderOptions = { assetBase: string; preview: boolean }

const SITE = 'https://www.aiterra.co.il'
export const GENERATOR_URL = `${SITE}/tools/email-signature-generator`
export const ASSET_PATH = '/images/tools/email-signature-generator'
export const ASSET_URL = `${SITE}${ASSET_PATH}`
export const DEFAULT_ACCENT = '#2447d6'
export const PHOTO_SIZE = 80
export const MAX_IMAGE_HEIGHT = 80

const FONT = 'Arial, Helvetica, sans-serif'
const INK = '#1f2433'
const BODY = '#3b4157'
const MUTED = '#5c6072'

export const signatureTemplates: { id: SignatureTemplate; label: string; description: string }[] = [
  { id: 'photo', label: 'קלאסית עם תמונה', description: 'תמונה עגולה, קו צבעוני ופרטי קשר' },
  { id: 'logo', label: 'לוגו וקו מפריד', description: 'הפרטים למעלה, הלוגו והאייקונים מתחת לקו' },
  { id: 'minimal', label: 'מינימלית', description: 'טקסט בלבד, בלי תמונות' },
]

export const logoSizes: { id: LogoSize; label: string; width: number }[] = [
  { id: 'small', label: 'קטן', width: 100 },
  { id: 'medium', label: 'בינוני', width: 140 },
  { id: 'large', label: 'גדול', width: 180 },
]

export const socialKeys: SocialKey[] = ['facebook', 'instagram', 'linkedin', 'tiktok', 'whatsapp']

export const socialNames: Record<SocialKey, string> = {
  facebook: 'Facebook',
  instagram: 'Instagram',
  linkedin: 'LinkedIn',
  tiktok: 'TikTok',
  whatsapp: 'WhatsApp',
}

const labels = {
  rtl: {
    phone: 'טלפון',
    mobile: 'נייד',
    email: 'מייל',
    website: 'אתר',
    credit: 'נוצר עם המחולל של AITERRA',
    photoAlt: 'תמונת פרופיל',
    logoAlt: 'לוגו',
  },
  ltr: {
    phone: 'Phone',
    mobile: 'Mobile',
    email: 'Email',
    website: 'Web',
    credit: 'Made with the AITERRA signature generator',
    photoAlt: 'Profile photo',
    logoAlt: 'Logo',
  },
}

type Labels = (typeof labels)['rtl']

const sampleFields: Record<SignatureDirection, Partial<SignatureInput>> = {
  rtl: {
    fullName: 'נועה לוי',
    role: 'מנהלת לקוחות',
    company: 'סטודיו לוי',
    address: 'רחוב הדוגמה 1, תל אביב',
  },
  ltr: {
    fullName: 'Noa Levi',
    role: 'Account Manager',
    company: 'Levi Studio',
    address: '1 Example St., Tel Aviv',
  },
}

const sampleShared: Partial<SignatureInput> = {
  phone: '03-000-0000',
  mobile: '050-000-0000',
  email: 'noa@example.com',
  website: 'www.example.com',
  facebook: 'facebook.com/example',
  instagram: '@example',
  linkedin: 'linkedin.com/company/example',
  tiktok: '@example',
  whatsapp: '050-000-0000',
}

const textKeys = [
  'fullName',
  'role',
  'company',
  'phone',
  'mobile',
  'email',
  'website',
  'address',
  'photoUrl',
  'logoUrl',
  'facebook',
  'instagram',
  'linkedin',
  'tiktok',
  'whatsapp',
] as const

export const defaultSignatureInput = (): SignatureInput => ({
  template: 'photo',
  direction: 'rtl',
  fullName: '',
  role: '',
  company: '',
  phone: '',
  mobile: '',
  email: '',
  website: '',
  address: '',
  photoUrl: '',
  logoUrl: '',
  logoSize: 'medium',
  facebook: '',
  instagram: '',
  linkedin: '',
  tiktok: '',
  whatsapp: '',
  accent: DEFAULT_ACCENT,
  credit: true,
})

export const isSignatureEmpty = (input: SignatureInput) => textKeys.every((key) => !input[key].trim())

export const sampleSignature = (input: SignatureInput): { input: SignatureInput; images: SignatureImages } => {
  const logoWidth = logoWidthFor(input.logoSize)
  return {
    input: { ...input, ...sampleShared, ...sampleFields[input.direction] },
    images: {
      photo: { src: `${ASSET_PATH}/sample-photo.jpg`, width: PHOTO_SIZE, height: PHOTO_SIZE },
      logo: { src: `${ASSET_PATH}/sample-logo.png`, width: logoWidth, height: Math.round((logoWidth * 80) / 280) },
    },
  }
}

export const logoWidthFor = (size: LogoSize) => logoSizes.find((item) => item.id === size)?.width ?? 140

export function fitLogo(natural: { width: number; height: number }, size: LogoSize) {
  const width = logoWidthFor(size)
  if (!natural.width || !natural.height) return { width, height: Math.round(width / 3) }
  const height = Math.round((width * natural.height) / natural.width)
  if (height <= MAX_IMAGE_HEIGHT) return { width, height }
  return { width: Math.round((MAX_IMAGE_HEIGHT * natural.width) / natural.height), height: MAX_IMAGE_HEIGHT }
}

export const isImageUrl = (value: string) => /^https?:\/\/[^\s"'<>]+$/i.test(value.trim())

export const normalizeHex = (value: string) => (/^#[0-9a-f]{6}$/i.test(value) ? value.toLowerCase() : DEFAULT_ACCENT)

const channel = (value: number) => {
  const c = value / 255
  return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4
}

export function contrastWithWhite(hex: string) {
  const n = parseInt(normalizeHex(hex).slice(1), 16)
  const luminance = 0.2126 * channel((n >> 16) & 255) + 0.7152 * channel((n >> 8) & 255) + 0.0722 * channel(n & 255)
  return 1.05 / (luminance + 0.05)
}

export const isReadableOnWhite = (hex: string) => contrastWithWhite(hex) >= 4.5

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')

const withProtocol = (value: string) => {
  const trimmed = value.trim()
  if (!trimmed || /\s/.test(trimmed)) return ''
  if (/^https?:\/\//i.test(trimmed)) return trimmed
  if (/^[a-z][a-z0-9+.-]*:/i.test(trimmed)) return ''
  return `https://${trimmed.replace(/^\/+/, '')}`
}

const displayUrl = (value: string) =>
  value
    .trim()
    .replace(/^https?:\/\//i, '')
    .replace(/\/$/, '')

const isEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())

const phoneHref = (value: string) => {
  const dialable = value.replace(/[^\d+]/g, '')
  return dialable.replace(/\D/g, '').length >= 6 ? `tel:${dialable}` : ''
}

export function whatsappHref(value: string) {
  let digits = value.replace(/\D/g, '')
  if (digits.startsWith('00')) digits = digits.slice(2)
  if (digits.startsWith('0')) digits = `972${digits.slice(1)}`
  return digits.length >= 10 ? `https://wa.me/${digits}` : ''
}

export function socialHref(key: SocialKey, value: string) {
  const trimmed = value.trim()
  if (!trimmed) return ''
  if (key === 'whatsapp') return whatsappHref(trimmed)
  const handle = trimmed.startsWith('@') ? trimmed.slice(1) : ''
  if (handle && key === 'instagram') return `https://www.instagram.com/${encodeURIComponent(handle)}/`
  if (handle && key === 'tiktok') return `https://www.tiktok.com/@${encodeURIComponent(handle)}`
  return withProtocol(trimmed)
}

type Context = {
  dir: SignatureDirection
  align: 'right' | 'left'
  start: 'right' | 'left'
  end: 'right' | 'left'
  copy: Labels
  accent: string
  accentText: string
  options: RenderOptions
}

const tableOpen = (extra = '') =>
  `<table cellpadding="0" cellspacing="0" border="0" role="presentation"${extra} style="border-collapse:collapse;">`

const textStyle = (ctx: Context, size: number, lineHeight: number, color: string, extra = '') =>
  `font-family:${FONT};font-size:${size}px;line-height:${lineHeight}px;color:${color};text-align:${ctx.align};${extra}`

const textRow = (ctx: Context, content: string, size: number, lineHeight: number, color: string, extra = '') =>
  `<tr><td style="${textStyle(ctx, size, lineHeight, color, extra)}">${content}</td></tr>`

const link = (ctx: Context, href: string, content: string, color: string, underline = false) => {
  const target = ctx.options.preview ? ' target="_blank" rel="noopener noreferrer"' : ''
  const decoration = underline ? 'underline' : 'none'
  return `<a href="${escapeHtml(href)}"${target} style="color:${color};text-decoration:${decoration};">${content}</a>`
}

const isolated = (ctx: Context, value: string) =>
  ctx.dir === 'rtl' ? `<span dir="ltr">${escapeHtml(value)}</span>` : escapeHtml(value)

const separator = `<span style="color:${MUTED};">&nbsp;&nbsp;|&nbsp;</span> `

const labelled = (label: string, value: string) => `<span style="color:${MUTED};">${label}</span>&nbsp;&nbsp;${value}`

type ContactItem = { key: 'phone' | 'mobile' | 'email' | 'website'; html: string }

function contactItems(input: SignatureInput, ctx: Context): ContactItem[] {
  const items: ContactItem[] = []
  for (const key of ['phone', 'mobile'] as const) {
    const value = input[key].trim()
    if (!value) continue
    const href = phoneHref(value)
    const shown = isolated(ctx, value)
    items.push({ key, html: href ? link(ctx, href, shown, BODY) : shown })
  }
  const email = input.email.trim()
  if (email) {
    const shown = isolated(ctx, email)
    items.push({ key: 'email', html: isEmail(email) ? link(ctx, `mailto:${email}`, shown, BODY) : shown })
  }
  const website = withProtocol(input.website)
  if (website) items.push({ key: 'website', html: link(ctx, website, isolated(ctx, displayUrl(input.website)), BODY) })
  return items
}

const roleLine = (input: SignatureInput, ctx: Context) => {
  const role = input.role.trim()
  const company = input.company.trim()
  const parts = [
    role ? `<span style="color:${ctx.accentText};">${escapeHtml(role)}</span>` : '',
    company ? escapeHtml(company) : '',
  ].filter(Boolean)
  return parts.join(separator)
}

const joinItems = (items: ContactItem[], ctx: Context) =>
  items.map((item) => labelled(ctx.copy[item.key], item.html)).join(separator)

const isPhone = (item: ContactItem) => item.key === 'phone' || item.key === 'mobile'

function detailsTable(input: SignatureInput, ctx: Context) {
  const rows: string[] = []
  const name = input.fullName.trim()
  if (name) rows.push(textRow(ctx, escapeHtml(name), 18, 24, INK, 'font-weight:bold;'))
  const role = roleLine(input, ctx)
  if (role) rows.push(textRow(ctx, role, 14, 20, BODY))
  const items = contactItems(input, ctx)
  const lines = [
    joinItems(items.filter(isPhone), ctx),
    ...items.filter((item) => !isPhone(item)).map((item) => labelled(ctx.copy[item.key], item.html)),
    escapeHtml(input.address.trim()),
  ].filter(Boolean)
  lines.forEach((line, index) => {
    const spacing = index === 0 && rows.length ? 'padding-top:8px;' : ''
    rows.push(textRow(ctx, line, 13, 20, BODY, spacing))
  })
  return rows.length ? `${tableOpen()}${rows.join('')}</table>` : ''
}

function socialIcons(input: SignatureInput, ctx: Context) {
  const items = socialKeys
    .map((key) => ({ key, href: socialHref(key, input[key]) }))
    .filter((item) => item.href)
  if (!items.length) return ''
  const cells = items.map((item, index) => {
    const gap = index < items.length - 1 ? `padding-${ctx.end}:6px;` : ''
    const image = `<img src="${ctx.options.assetBase}/${item.key}.png" width="24" height="24" alt="${socialNames[item.key]}" style="display:block;width:24px;height:24px;border:0;">`
    return `<td style="padding:0;${gap}">${link(ctx, item.href, image, BODY)}</td>`
  })
  return `${tableOpen()}<tr>${cells.join('')}</tr></table>`
}

function socialText(input: SignatureInput, ctx: Context) {
  return socialKeys
    .map((key) => ({ key, href: socialHref(key, input[key]) }))
    .filter((item) => item.href)
    .map((item) => link(ctx, item.href, socialNames[item.key], ctx.accentText))
    .join(separator)
}

const imageTag = (image: SignatureImage, alt: string, round: boolean) => {
  const radius = round ? `border-radius:${Math.round(image.width / 2)}px;` : ''
  return `<img src="${escapeHtml(image.src)}" width="${image.width}" height="${image.height}" alt="${escapeHtml(alt)}" style="display:block;width:${image.width}px;height:${image.height}px;border:0;${radius}">`
}

const photoAlt = (input: SignatureInput, ctx: Context) => input.fullName.trim() || ctx.copy.photoAlt
const logoAlt = (input: SignatureInput, ctx: Context) => input.company.trim() || ctx.copy.logoAlt

function photoTemplate(input: SignatureInput, images: SignatureImages, ctx: Context) {
  const image = images.photo
    ? imageTag(images.photo, photoAlt(input, ctx), true)
    : images.logo
      ? imageTag(images.logo, logoAlt(input, ctx), false)
      : ''
  const icons = socialIcons(input, ctx)
  const imageCell = image ? `<td valign="top" style="padding:0;padding-${ctx.end}:14px;vertical-align:top;">${image}</td>` : ''
  const bar = `<td width="2" style="width:2px;padding:0;background-color:${ctx.accent};font-size:0;line-height:0;">&nbsp;</td>`
  const iconsRow = icons ? `<tr><td style="padding-top:10px;">${icons}</td></tr>` : ''
  const textCell = `<td valign="top" style="padding:0;padding-${ctx.start}:14px;vertical-align:top;">${tableOpen()}<tr><td>${detailsTable(input, ctx)}</td></tr>${iconsRow}</table></td>`
  return `<tr><td style="padding:0;">${tableOpen()}<tr>${imageCell}${bar}${textCell}</tr></table></td></tr>`
}

function logoTemplate(input: SignatureInput, images: SignatureImages, ctx: Context) {
  const rows = [`<tr><td style="padding:0;">${detailsTable(input, ctx)}</td></tr>`]
  const logo = images.logo ? imageTag(images.logo, logoAlt(input, ctx), false) : ''
  const icons = socialIcons(input, ctx)
  rows.push(
    `<tr><td style="padding:12px 0;">${tableOpen(' width="100%"')}<tr><td height="2" style="height:2px;padding:0;background-color:${ctx.accent};font-size:0;line-height:2px;">&nbsp;</td></tr></table></td></tr>`,
  )
  if (logo || icons) {
    const logoCell = logo ? `<td valign="middle" style="padding:0;vertical-align:middle;">${logo}</td>` : ''
    const gapCell = logo && icons ? '<td width="20" style="width:20px;padding:0;font-size:0;line-height:0;">&nbsp;</td>' : ''
    const iconCell = icons ? `<td valign="middle" style="padding:0;vertical-align:middle;">${icons}</td>` : ''
    rows.push(`<tr><td style="padding:0;">${tableOpen()}<tr>${logoCell}${gapCell}${iconCell}</tr></table></td></tr>`)
  }
  return rows.join('')
}

function minimalTemplate(input: SignatureInput, ctx: Context) {
  const rows: string[] = []
  const name = input.fullName.trim()
  if (name) rows.push(textRow(ctx, escapeHtml(name), 16, 22, ctx.accentText, 'font-weight:bold;'))
  const role = [input.role.trim(), input.company.trim()].filter(Boolean).map(escapeHtml).join(separator)
  if (role) rows.push(textRow(ctx, role, 13, 20, BODY))
  const items = contactItems(input, ctx)
  const contactLines = [
    joinItems(items.filter(isPhone), ctx),
    joinItems(items.filter((item) => !isPhone(item)), ctx),
  ].filter(Boolean)
  contactLines.forEach((line, index) => {
    rows.push(textRow(ctx, line, 13, 20, BODY, index === 0 && rows.length ? 'padding-top:4px;' : ''))
  })
  const address = input.address.trim()
  if (address) rows.push(textRow(ctx, escapeHtml(address), 13, 20, BODY))
  const social = socialText(input, ctx)
  if (social) rows.push(textRow(ctx, social, 13, 20, BODY))
  return rows.join('')
}

export function signatureToHtml(input: SignatureInput, images: SignatureImages, options: RenderOptions) {
  const rtl = input.direction === 'rtl'
  const accent = normalizeHex(input.accent)
  const ctx: Context = {
    dir: input.direction,
    align: rtl ? 'right' : 'left',
    start: rtl ? 'right' : 'left',
    end: rtl ? 'left' : 'right',
    copy: labels[input.direction],
    accent,
    accentText: isReadableOnWhite(accent) ? accent : INK,
    options,
  }
  const body =
    input.template === 'photo'
      ? photoTemplate(input, images, ctx)
      : input.template === 'logo'
        ? logoTemplate(input, images, ctx)
        : minimalTemplate(input, ctx)
  const credit = input.credit
    ? textRow(ctx, link(ctx, GENERATOR_URL, ctx.copy.credit, MUTED, true), 11, 16, MUTED, 'padding-top:12px;')
    : ''
  const lang = rtl ? 'he' : 'en'
  return `<table cellpadding="0" cellspacing="0" border="0" role="presentation" dir="${input.direction}" lang="${lang}" style="border-collapse:collapse;font-family:${FONT};color:${BODY};">${body}${credit}</table>`
}

export function signatureToText(input: SignatureInput) {
  const copy = labels[input.direction]
  const website = withProtocol(input.website) ? displayUrl(input.website) : ''
  const lines = [
    input.fullName.trim(),
    [input.role.trim(), input.company.trim()].filter(Boolean).join(' | '),
    input.phone.trim() && `${copy.phone}: ${input.phone.trim()}`,
    input.mobile.trim() && `${copy.mobile}: ${input.mobile.trim()}`,
    input.email.trim() && `${copy.email}: ${input.email.trim()}`,
    website && `${copy.website}: ${website}`,
    input.address.trim(),
    ...socialKeys.map((key) => {
      const href = socialHref(key, input[key])
      return href ? `${socialNames[key]}: ${href}` : ''
    }),
    input.credit ? `${copy.credit}: ${GENERATOR_URL}` : '',
  ]
  return lines.filter(Boolean).join('\n')
}
