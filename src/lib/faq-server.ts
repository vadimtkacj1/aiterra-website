import fs from 'fs'
import path from 'path'
import seedFaqJson from '@/data/faq-seed.json'

const FILE = path.join(process.cwd(), 'data', 'faq.json')

export interface FaqItem { q: string; a: string }
export interface FaqData { title: string; items: FaqItem[] }
export type FaqAllData = Record<string, FaqData>

// Snapshot of data/faq.json copied into src/ by scripts/sync-data-seeds.mjs (runs
// on every build via `prebuild`). Used as the base so a stale/fresh persistent
// volume mounted over data/ can never hide FAQ blocks committed to the repo.
const SEED_FAQ = seedFaqJson as FaqAllData

function ensureFile() {
  const dir = path.dirname(FILE)
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
  if (!fs.existsSync(FILE)) fs.writeFileSync(FILE, JSON.stringify(SEED_FAQ, null, 2), 'utf-8')
}

export function getAllFaqData(): FaqAllData {
  ensureFile()
  const raw = fs.readFileSync(FILE, 'utf-8')
  const fileData = JSON.parse(raw) as FaqAllData
  // Seed is the base; the volume (admin edits) overrides per page key, and any
  // key missing from a stale volume falls back to the committed seed.
  return { ...SEED_FAQ, ...fileData }
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
