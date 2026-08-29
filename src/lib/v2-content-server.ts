import fs from 'fs'
import path from 'path'
import { v2ContentDefaults, type V2Content, type V2ContentKey } from '@/app/v2/content'
import { diffV2, mergeV2, type V2Overrides } from '@/app/v2/contentMerge'

const FILE = path.join(process.cwd(), 'data', 'v2-content.json')

export type V2ContentFile = {
  updatedAt: string | null
  overrides: V2Overrides
}

let cache: { mtimeMs: number; data: V2ContentFile } | null = null

function emptyFile(): V2ContentFile {
  return { updatedAt: null, overrides: {} }
}

function readFile(): V2ContentFile {
  let stat: fs.Stats
  try {
    stat = fs.statSync(FILE)
  } catch {
    cache = null
    return emptyFile()
  }
  if (cache && cache.mtimeMs === stat.mtimeMs) return cache.data
  try {
    const parsed = JSON.parse(fs.readFileSync(FILE, 'utf-8')) as Partial<V2ContentFile>
    const data: V2ContentFile = {
      updatedAt: typeof parsed.updatedAt === 'string' ? parsed.updatedAt : null,
      overrides:
        parsed.overrides && typeof parsed.overrides === 'object' && !Array.isArray(parsed.overrides)
          ? (parsed.overrides as V2Overrides)
          : {},
    }
    cache = { mtimeMs: stat.mtimeMs, data }
    return data
  } catch {
    return emptyFile()
  }
}

export function readV2Overrides(): V2Overrides {
  return readFile().overrides
}

export function readV2ContentFile(): V2ContentFile {
  return readFile()
}

export function getV2Content(): V2Content {
  const overrides = readV2Overrides()
  const out = {} as Record<string, unknown>
  for (const key of Object.keys(v2ContentDefaults) as V2ContentKey[]) {
    out[key] = mergeV2(v2ContentDefaults[key], overrides[key])
  }
  return out as V2Content
}

export function getV2Section<K extends V2ContentKey>(key: K): V2Content[K] {
  return mergeV2(v2ContentDefaults[key], readV2Overrides()[key])
}

function writeFile(data: V2ContentFile): void {
  const dir = path.dirname(FILE)
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
  fs.writeFileSync(FILE, JSON.stringify(data, null, 2), 'utf-8')
  cache = null
}

export function saveV2Section(key: V2ContentKey, value: unknown): V2ContentFile {
  const current = readFile()
  const overrides: V2Overrides = { ...current.overrides }
  const patch = diffV2(v2ContentDefaults[key], value)
  if (patch === undefined) delete overrides[key]
  else overrides[key] = patch
  const next: V2ContentFile = { updatedAt: new Date().toISOString(), overrides }
  writeFile(next)
  return next
}

export function resetV2Section(key: V2ContentKey): V2ContentFile {
  const current = readFile()
  const overrides: V2Overrides = { ...current.overrides }
  delete overrides[key]
  const next: V2ContentFile = { updatedAt: new Date().toISOString(), overrides }
  writeFile(next)
  return next
}

export function resetV2Content(): V2ContentFile {
  const next: V2ContentFile = { updatedAt: new Date().toISOString(), overrides: {} }
  writeFile(next)
  return next
}
