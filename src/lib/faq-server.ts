import fs from 'fs'
import path from 'path'

const FILE = path.join(process.cwd(), 'data', 'faq-contact.json')

export interface FaqItem { q: string; a: string }
export interface FaqData { title: string; items: FaqItem[] }

export function getFaqData(): FaqData {
  const raw = fs.readFileSync(FILE, 'utf-8')
  return JSON.parse(raw) as FaqData
}

export function saveFaqData(data: FaqData): void {
  fs.writeFileSync(FILE, JSON.stringify(data, null, 2), 'utf-8')
}
