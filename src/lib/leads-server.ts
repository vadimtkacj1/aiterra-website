import { readFileSync } from 'fs'
import path from 'path'

export interface SiteLead {
  id: string
  publicToken: string
  name: string
  phone: string | null
  email: string | null
  message: string | null
  source: string | null
  createdAt: string
}

const LEADS_PATH = path.join(process.cwd(), 'data', 'site-leads.json')

// The file is created lazily by /api/site-leads/submit on the first lead, so a
// missing file is the normal empty state — not an error.
export function getAllLeads(): SiteLead[] {
  let parsed: unknown
  try {
    parsed = JSON.parse(readFileSync(LEADS_PATH, 'utf-8'))
  } catch {
    return []
  }
  if (!Array.isArray(parsed)) return []
  return (parsed as SiteLead[])
    .filter((lead) => lead && typeof lead === 'object' && lead.id)
    .sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''))
}

export function leadsToCsv(leads: SiteLead[]): string {
  const escape = (value: string | null) => `"${(value ?? '').replace(/"/g, '""')}"`
  const header = ['createdAt', 'name', 'phone', 'email', 'source', 'message']
  const rows = leads.map((lead) =>
    [lead.createdAt, lead.name, lead.phone, lead.email, lead.source, lead.message]
      .map(escape)
      .join(',')
  )
  // BOM so Excel opens Hebrew rows in UTF-8 instead of mojibake.
  return `﻿${[header.join(','), ...rows].join('\r\n')}`
}
