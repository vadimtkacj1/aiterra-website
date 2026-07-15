// Public token echoed back with every lead submission so the API can attribute
// the source site. Not a secret — it only tags the lead; validation happens on
// required fields server-side.
export const SITE_LEADS_TOKEN = 'aiterra-ecommerce-landing'

/**
 * The real Aiterra line, kept identical to the main site's `src/lib/contact.ts`
 * (`CONTACT_PHONE` / `CONTACT_PHONE_HREF`). If the number ever changes it has to
 * change in both places — this landing page is a separate deployment and cannot
 * import from that project.
 */
export const CONTACT = {
  phone: '052-678-0739',
  phoneHref: 'tel:+972526780739',
  whatsapp: 'https://wa.me/972526780739',
  email: 'info@aiterra.co.il',
} as const
