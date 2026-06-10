import fs from 'fs'
import path from 'path'

const FILE = path.join(process.cwd(), 'data', 'faq.json')

export interface FaqItem { q: string; a: string }
export interface FaqData { title: string; items: FaqItem[] }
export type FaqAllData = Record<string, FaqData>

function ensureFile() {
  const dir = path.dirname(FILE)
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
  if (!fs.existsSync(FILE)) fs.writeFileSync(FILE, '{}', 'utf-8')
}

export function getAllFaqData(): FaqAllData {
  ensureFile()
  const raw = fs.readFileSync(FILE, 'utf-8')
  return JSON.parse(raw) as FaqAllData
}

export function getFaqData(pageKey: string): FaqData {
  const all = getAllFaqData()
  return all[pageKey] ?? { title: 'שאלות נפוצות', items: [] }
}

export function saveAllFaqData(data: FaqAllData): void {
  fs.writeFileSync(FILE, JSON.stringify(data, null, 2), 'utf-8')
}

export function saveFaqData(pageKey: string, data: FaqData): void {
  const all = getAllFaqData()
  all[pageKey] = data
  saveAllFaqData(all)
}
