import type { CrmDelivery, SiteLead } from './leads-server'

const CRM_TIMEOUT_MS = 8000

export function crmEndpoint(): string | null {
  const base = process.env.CRM_API_URL?.trim().replace(/\/+$/, '')
  if (!base) return null
  return `${base}/api/site-leads/submit`
}

export async function forwardLeadToCrm(lead: SiteLead): Promise<CrmDelivery> {
  const endpoint = crmEndpoint()
  const publicToken = process.env.CRM_SITE_TOKEN?.trim()

  if (!endpoint || !publicToken) {
    console.warn('lead saved but NOT sent to the CRM — CRM_API_URL / CRM_SITE_TOKEN missing in .env')
    return 'skipped'
  }

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      cache: 'no-store',
      signal: AbortSignal.timeout(CRM_TIMEOUT_MS),
      body: JSON.stringify({
        publicToken,
        name: lead.name,
        phone: lead.phone,
        email: lead.email,
        message: lead.message,
        treatment: lead.treatment,
        source: lead.source,
      }),
    })

    if (!response.ok) {
      const detail = await response.text().catch(() => '')
      console.error(`CRM rejected lead ${lead.id}: ${response.status} ${detail}`.trim())
      return 'failed'
    }

    return 'sent'
  } catch (error) {
    console.error(`CRM delivery failed for lead ${lead.id}:`, error)
    return 'failed'
  }
}
