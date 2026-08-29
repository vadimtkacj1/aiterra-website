import type { V2ContentKey } from './content'

export type V2Overrides = Partial<Record<V2ContentKey, unknown>>

type PlainObject = Record<string, unknown>

const isPlainObject = (value: unknown): value is PlainObject =>
  typeof value === 'object' && value !== null && !Array.isArray(value)

export function mergeV2<T>(base: T, override: unknown): T {
  if (override === undefined || override === null) return base
  if (isPlainObject(base) && isPlainObject(override)) {
    const out: PlainObject = { ...base }
    for (const key of Object.keys(override)) {
      out[key] = mergeV2((base as PlainObject)[key], override[key])
    }
    return out as T
  }
  return override as T
}

export function deepEqual(a: unknown, b: unknown): boolean {
  if (a === b) return true
  if (Array.isArray(a) && Array.isArray(b)) {
    return a.length === b.length && a.every((item, i) => deepEqual(item, b[i]))
  }
  if (isPlainObject(a) && isPlainObject(b)) {
    const keys = new Set([...Object.keys(a), ...Object.keys(b)])
    for (const key of keys) {
      if (!deepEqual(a[key], b[key])) return false
    }
    return true
  }
  return false
}

export function diffV2(base: unknown, next: unknown): unknown {
  if (deepEqual(base, next)) return undefined
  if (isPlainObject(base) && isPlainObject(next)) {
    const out: PlainObject = {}
    for (const key of Object.keys(next)) {
      const patch = diffV2(base[key], next[key])
      if (patch !== undefined) out[key] = patch
    }
    return Object.keys(out).length > 0 ? out : undefined
  }
  return next
}
