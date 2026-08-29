import type { V2ContentKey } from '@/app/v2/content'
import { ADVANCED_KEYS, FIELD_LABELS, IMAGE_KEYS, SECTION_INDEX } from '../sections'

export type TextEntry = {
  key: V2ContentKey
  path: string[]
  pathId: string
  field: string
  value: string
}

const NON_TEXT_FIELDS = new Set<string>([
  ...ADVANCED_KEYS,
  ...IMAGE_KEYS,
  'alt',
  'href',
  'link',
  'poster',
  'video',
])

const isPlainObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value)

export function normalizeText(value: string): string {
  return value.replace(/[\u00a0\u200e\u200f\u202a-\u202e]/g, ' ').replace(/\s+/g, ' ').trim()
}

function walk(value: unknown, path: string[], field: string, out: TextEntry[]): void {
  if (typeof value === 'string') {
    if (NON_TEXT_FIELDS.has(field)) return
    if (!normalizeText(value)) return
    out.push({ key: path[0] as V2ContentKey, path, pathId: path.join('.'), field, value })
    return
  }
  if (Array.isArray(value)) {
    value.forEach((item, index) => walk(item, [...path, String(index)], field, out))
    return
  }
  if (isPlainObject(value)) {
    for (const key of Object.keys(value)) walk(value[key], [...path, key], key, out)
  }
}

export function collectEntries(content: Record<string, unknown>): TextEntry[] {
  const out: TextEntry[] = []
  for (const key of Object.keys(content)) walk(content[key], [key], key, out)
  return out
}

export function getAtPath(root: unknown, path: string[]): unknown {
  let cursor = root
  for (const step of path) {
    if (Array.isArray(cursor)) cursor = cursor[Number(step)]
    else if (isPlainObject(cursor)) cursor = cursor[step]
    else return undefined
  }
  return cursor
}

export function setAtPath(root: unknown, path: string[], value: string): unknown {
  if (path.length === 0) return value
  const [head, ...rest] = path
  if (Array.isArray(root)) {
    const copy = root.slice()
    copy[Number(head)] = setAtPath(copy[Number(head)], rest, value)
    return copy
  }
  const base = isPlainObject(root) ? root : {}
  return { ...base, [head]: setAtPath(base[head], rest, value) }
}

export function sectionLabel(key: string): string {
  return SECTION_INDEX[key]?.label ?? key
}

export function fieldLabel(field: string): string {
  return FIELD_LABELS[field] ?? field
}

export function entryLabel(entry: TextEntry): string {
  return `${sectionLabel(entry.key)} · ${fieldLabel(entry.field)}`
}
