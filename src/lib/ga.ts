export const GA_MEASUREMENT_IDS = ['G-P8X46Q41J9']

export function trackLead(source: string) {
  if (typeof window === 'undefined') return
  window.gtag?.('event', 'generate_lead', { method: source })
  window.clarity?.('event', 'generate_lead')
  window.clarity?.('set', 'lead_source', source)
}
