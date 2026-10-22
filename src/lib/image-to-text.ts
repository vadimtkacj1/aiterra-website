export type OcrLanguage = 'heb+eng' | 'heb' | 'eng'

export type FileKind = 'image' | 'pdf' | 'heif' | 'other'

export type OcrStage = 'prepare' | 'engine' | 'model' | 'recognize'

export type ConfidenceLevel = 'high' | 'medium' | 'low' | 'empty'

export type TextDirection = 'rtl' | 'ltr'

export const DEFAULT_LANGUAGE: OcrLanguage = 'heb+eng'

export const ACCEPT = 'image/jpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp'

export const MAX_SIDE = 3500
export const UPSCALE_BELOW = 1200
export const UPSCALE_FACTOR = 2

export const HIGH_CONFIDENCE = 85
export const MEDIUM_CONFIDENCE = 65

export const languageOptions: { value: OcrLanguage; label: string; hint: string; lang: string }[] = [
  { value: 'heb+eng', label: 'עברית ואנגלית', hint: 'מתאים לרוב המסמכים בישראל', lang: 'he' },
  { value: 'heb', label: 'עברית בלבד', hint: 'קצת יותר מהיר, בלי מילים באנגלית', lang: 'he' },
  { value: 'eng', label: 'English only', hint: 'לטקסט באנגלית בלבד', lang: 'en' },
]

export const isOcrLanguage = (value: string): value is OcrLanguage =>
  languageOptions.some((option) => option.value === value)

const extensionOf = (name: string) => {
  const match = /\.([a-z0-9]+)$/i.exec(name)
  return match ? match[1].toLowerCase() : ''
}

export function fileKind(file: { name: string; type: string }): FileKind {
  const type = file.type.toLowerCase()
  const extension = extensionOf(file.name)
  if (type === 'application/pdf' || extension === 'pdf') return 'pdf'
  if (type === 'image/heic' || type === 'image/heif' || extension === 'heic' || extension === 'heif') return 'heif'
  if (type.startsWith('image/')) return 'image'
  if (['jpg', 'jpeg', 'jfif', 'png', 'webp', 'gif', 'bmp', 'avif'].includes(extension)) return 'image'
  return 'other'
}

export function ocrSize(width: number, height: number) {
  const longSide = Math.max(width, height)
  const scale = longSide > MAX_SIDE ? MAX_SIDE / longSide : longSide < UPSCALE_BELOW ? UPSCALE_FACTOR : 1
  return {
    width: Math.max(1, Math.round(width * scale)),
    height: Math.max(1, Math.round(height * scale)),
  }
}

const stageRanges: Record<string, { stage: OcrStage; from: number; span: number }> = {
  'loading tesseract core': { stage: 'engine', from: 0.05, span: 0.25 },
  'initializing tesseract': { stage: 'engine', from: 0.3, span: 0.05 },
  'loading language traineddata': { stage: 'model', from: 0.35, span: 0.2 },
  'initializing api': { stage: 'model', from: 0.55, span: 0.05 },
  'recognizing text': { stage: 'recognize', from: 0.6, span: 0.4 },
}

export function overallProgress(status: string, progress: number): { stage: OcrStage; percent: number } | null {
  const range = stageRanges[status]
  if (!range) return null
  const part = Number.isFinite(progress) ? Math.min(1, Math.max(0, progress)) : 0
  return { stage: range.stage, percent: Math.round((range.from + range.span * part) * 100) }
}

export function cleanText(text: string) {
  return text
    .replace(/\r\n?/g, '\n')
    .replace(/[\u200e\u200f\u202a-\u202e\u2066-\u2069]/g, '')
    .split('\n')
    .map((line) => line.replace(/[ \t\u00a0]+$/g, ''))
    .join('\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
}

const hebrewLetters = /[א-ת]/g
const latinLetters = /[A-Za-z]/g
const letterPattern = /[א-תA-Za-z0-9]/

export function dominantDirection(text: string): TextDirection {
  const hebrew = text.match(hebrewLetters)?.length ?? 0
  const latin = text.match(latinLetters)?.length ?? 0
  return latin > hebrew ? 'ltr' : 'rtl'
}

export function textStats(text: string) {
  const trimmed = text.trim()
  if (!trimmed) return { characters: 0, words: 0, lines: 0 }
  return {
    characters: trimmed.length,
    words: trimmed.split(/\s+/).length,
    lines: trimmed.split('\n').filter((line) => line.trim()).length,
  }
}

export function confidenceLevel(confidence: number, text: string): ConfidenceLevel {
  if (!letterPattern.test(text)) return 'empty'
  if (confidence >= HIGH_CONFIDENCE) return 'high'
  if (confidence >= MEDIUM_CONFIDENCE) return 'medium'
  return 'low'
}

export function baseName(fileName: string) {
  const withoutExtension = fileName.replace(/\.[^.]+$/, '').trim()
  const safe = withoutExtension.replace(/[\\/:*?"<>|]+/g, '-').slice(0, 80)
  return safe || 'image'
}

export const textFileName = (fileName: string) => `${baseName(fileName)}-text.txt`
export const wordFileName = (fileName: string) => `${baseName(fileName)}-text.doc`

const escapeHtml = (value: string) =>
  value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

const paragraphStyle: Record<TextDirection, string> = {
  rtl: 'direction:rtl;text-align:right;unicode-bidi:embed',
  ltr: 'direction:ltr;text-align:left;unicode-bidi:embed',
}

export function wordDocument(text: string, title: string) {
  const cleaned = cleanText(text)
  const documentDirection = dominantDirection(cleaned)
  const paragraphs = cleaned
    .split('\n')
    .map((line) => {
      if (!line.trim()) return '<p>&nbsp;</p>'
      const direction = /[א-תA-Za-z]/.test(line) ? dominantDirection(line) : documentDirection
      return `<p dir="${direction}" style="${paragraphStyle[direction]}">${escapeHtml(line)}</p>`
    })
    .join('\n')
  const lang = documentDirection === 'rtl' ? 'he' : 'en'
  return [
    '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word"',
    ` xmlns="http://www.w3.org/TR/REC-html40" dir="${documentDirection}" lang="${lang}">`,
    '<head>',
    '<meta charset="utf-8">',
    `<title>${escapeHtml(title)}</title>`,
    '<!--[if gte mso 9]><xml><w:WordDocument><w:View>Print</w:View><w:Zoom>100</w:Zoom></w:WordDocument></xml><![endif]-->',
    '<style>',
    'body { font-family: Arial, sans-serif; font-size: 12pt; line-height: 1.5; }',
    'p { margin: 0; font-family: Arial, sans-serif; font-size: 12pt; }',
    '</style>',
    '</head>',
    `<body dir="${documentDirection}" lang="${lang}">`,
    paragraphs,
    '</body>',
    '</html>',
  ].join('\n')
}
