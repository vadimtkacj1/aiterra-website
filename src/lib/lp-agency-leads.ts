import { SITE_LEADS_TOKEN } from '@/lib/contact'
import type { LeadFormData, ShortLeadFormData } from '@/lib/lp-agency-types'

type LeadPayload = {
  name: string
  phone: string
  email?: string
  message?: string
  source: string
}

async function post(payload: LeadPayload) {
  const response = await fetch('/api/site-leads/submit', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ publicToken: SITE_LEADS_TOKEN, ...payload }),
  })
  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`)
  }
  return response.json().catch(() => ({ ok: true }))
}

export function submitLeadForm(data: LeadFormData) {
  return post({
    name: data.name,
    phone: data.phone,
    email: data.email,
    message: data.businessType,
    source: 'agency-landing',
  })
}

export function submitShortLeadForm(data: ShortLeadFormData) {
  return post({
    name: data.name,
    phone: data.phone,
    source: 'agency-landing-short',
  })
}
