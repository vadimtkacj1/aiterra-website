import { readFileSync } from 'fs'
import { mkdir, readFile, writeFile } from 'fs/promises'
import path from 'path'

export type CrmDelivery = 'sent' | 'skipped' | 'failed'

export interface SiteLead {
  id: string
  publicToken: string
  name: string
  phone: string | null
  email: string | null
  message: string | null
  treatment: string | null
  source: string | null
  createdAt: string
  crm?: CrmDelivery
}

const LEADS_PATH = path.join(process.cwd(), 'data', 'site-leads.json')

function normalize(parsed: unknown): SiteLead[] {
  if (!Array.isArray(parsed)) return []
  return (parsed as SiteLead[])
    .filter((lead) => lead && typeof lead === 'object' && lead.id)
    .sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''))
}

// The file is created lazily by /api/site-leads/submit on the first lead, so a
// missing file is the normal empty state — not an error.
export function getAllLeads(): SiteLead[] {
  try {
    return normalize(JSON.parse(readFileSync(LEADS_PATH, 'utf-8')))
  } catch {
    return []
  }
}

async function readLeads(): Promise<SiteLead[]> {
  try {
    return normalize(JSON.parse(await readFile(LEADS_PATH, 'utf-8')))
  } catch {
    return []
  }
}

async function writeLeads(leads: SiteLead[]): Promise<void> {
  await mkdir(path.dirname(LEADS_PATH), { recursive: true })
  await writeFile(LEADS_PATH, JSON.stringify(leads, null, 2))
}

export async function appendLead(lead: SiteLead): Promise<void> {
  const leads = await readLeads()
  leads.unshift(lead)
  await writeLeads(leads)
}

export async function setLeadDelivery(id: string, crm: CrmDelivery): Promise<void> {
  const leads = await readLeads()
  const index = leads.findIndex((lead) => lead.id === id)
  if (index === -1) return
  leads[index] = { ...leads[index], crm }
  await writeLeads(leads)
}

export function leadsToCsv(leads: SiteLead[]): string {
  const escape = (value: string | null | undefined) => `"${(value ?? '').replace(/"/g, '""')}"`
  const header = ['createdAt', 'name', 'phone', 'email', 'treatment', 'source', 'crm', 'message']
  const rows = leads.map((lead) =>
    [lead.createdAt, lead.name, lead.phone, lead.email, lead.treatment, lead.source, lead.crm, lead.message]
      .map(escape)
      .join(',')
  )
  // BOM so Excel opens Hebrew rows in UTF-8 instead of mojibake.
  return `﻿${[header.join(','), ...rows].join('\r\n')}`
}
