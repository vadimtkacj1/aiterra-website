import fs from 'fs'

export function readJsonFile<T>(file: string, fallback: T): T {
  let raw: string
  try {
    raw = fs.readFileSync(file, 'utf-8')
  } catch {
    return fallback
  }

  let parsed: unknown
  try {
    parsed = JSON.parse(raw)
  } catch {
    console.error(`${file} holds invalid JSON — falling back to the committed seed`)
    return fallback
  }

  if (parsed === null || typeof parsed !== 'object') return fallback
  if (Array.isArray(parsed) !== Array.isArray(fallback)) return fallback
  return parsed as T
}
