export type OutputChoice = 'webp' | 'jpeg' | 'png' | 'original'
export type EncodableType = 'image/webp' | 'image/jpeg' | 'image/png'

export type ParsedDimension = { ok: true; value: number | null } | { ok: false }

export type Saving = { kind: 'smaller'; percent: number } | { kind: 'larger'; percent: number } | { kind: 'same' }

export const DEFAULT_QUALITY = 80
export const MIN_QUALITY = 10
export const MAX_QUALITY = 100
export const QUALITY_STEP = 5
export const MAX_DIMENSION = 20000

export const ACCEPT =
  'image/jpeg,image/png,image/webp,image/avif,image/gif,image/bmp,image/heic,image/heif,.jpg,.jpeg,.png,.webp,.avif,.gif,.bmp,.heic,.heif'

const encodableTypes: EncodableType[] = ['image/webp', 'image/jpeg', 'image/png']

const extensionTypes: Record<string, string> = {
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  jfif: 'image/jpeg',
  png: 'image/png',
  webp: 'image/webp',
  avif: 'image/avif',
  gif: 'image/gif',
  bmp: 'image/bmp',
  heic: 'image/heic',
  heif: 'image/heif',
}

const typeExtensions: Record<EncodableType, string> = {
  'image/webp': 'webp',
  'image/jpeg': 'jpg',
  'image/png': 'png',
}

export const formatNames: Record<EncodableType, string> = {
  'image/webp': 'WebP',
  'image/jpeg': 'JPEG',
  'image/png': 'PNG',
}

export const isEncodableType = (type: string): type is EncodableType =>
  (encodableTypes as string[]).includes(type)

const extensionOf = (name: string) => {
  const match = /\.([a-z0-9]+)$/i.exec(name)
  return match ? match[1].toLowerCase() : ''
}

export function sourceTypeOf(file: { name: string; type: string }) {
  if (file.type) return file.type.toLowerCase()
  return extensionTypes[extensionOf(file.name)] ?? ''
}

export function isHeif(file: { name: string; type: string }) {
  const type = sourceTypeOf(file)
  return type === 'image/heic' || type === 'image/heif'
}

export function isImageFile(file: { name: string; type: string }) {
  return sourceTypeOf(file).startsWith('image/')
}

export function targetType(choice: OutputChoice, sourceType: string): EncodableType {
  if (choice === 'webp') return 'image/webp'
  if (choice === 'jpeg') return 'image/jpeg'
  if (choice === 'png') return 'image/png'
  return isEncodableType(sourceType) ? sourceType : 'image/webp'
}

export const usesQuality = (type: EncodableType) => type !== 'image/png'

export function fitWithin(width: number, height: number, maxWidth: number | null, maxHeight: number | null) {
  const scale = Math.min(1, maxWidth ? maxWidth / width : 1, maxHeight ? maxHeight / height : 1)
  return {
    width: Math.max(1, Math.round(width * scale)),
    height: Math.max(1, Math.round(height * scale)),
  }
}

export function parseDimension(value: string): ParsedDimension {
  const trimmed = value.trim()
  if (!trimmed) return { ok: true, value: null }
  if (!/^\d+$/.test(trimmed)) return { ok: false }
  const number = Number(trimmed)
  if (number < 1 || number > MAX_DIMENSION) return { ok: false }
  return { ok: true, value: number }
}

const numberFormat = (digits: number) => new Intl.NumberFormat('en-US', { maximumFractionDigits: digits })

export function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`
  const kilobytes = bytes / 1024
  if (kilobytes < 1024) return `${numberFormat(kilobytes < 10 ? 1 : 0).format(kilobytes)} KB`
  const megabytes = kilobytes / 1024
  return `${numberFormat(megabytes < 10 ? 2 : 1).format(megabytes)} MB`
}

export function saving(before: number, after: number): Saving {
  if (before <= 0 || after === before) return { kind: 'same' }
  if (after < before) {
    return { kind: 'smaller', percent: Math.min(99, Math.max(1, Math.round((1 - after / before) * 100))) }
  }
  return { kind: 'larger', percent: Math.max(1, Math.round((after / before - 1) * 100)) }
}

export function outputFileName(name: string, type: EncodableType) {
  const base = name.replace(/\.[^./\\]+$/, '') || 'image'
  return `${base}.${typeExtensions[type]}`
}
