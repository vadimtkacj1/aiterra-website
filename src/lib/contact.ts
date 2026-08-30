/** Office location — single source for footer, contact page, map embeds */
export const OFFICE_ADDRESS_EN = 'Ha-Rav Nisanbaum St 37, Bat Yam, 5962030'

export const OFFICE_ADDRESS_HE = 'רחוב הרב ניסנבאום 37, בת ים 5962030'

export const CONTACT_EMAIL = 'info@aiterra.co.il'

export const CONTACT_PHONE = '052-678-0739'
export const CONTACT_PHONE_HREF = 'tel:+972526780739'
/** International format for structured data (schema.org telephone) */
export const CONTACT_PHONE_INTL = '+972-52-678-0739'

/** Official social profiles — used in OrganizationSchema sameAs + footer links. Fill in real URLs. */
export const SOCIAL_PROFILES = {
  linkedin: '',
  instagram: '',
  facebook: '',
}

/**
 * Token sent with public lead-form submissions to /api/site-leads/submit so the
 * lead is attributable to this site. Overridable via env; the endpoint only
 * requires it to be present. NOTE: leads currently persist to data/site-leads.json
 * — wire delivery (email/CRM/admin view) before relying on this for sales.
 */
export const SITE_LEADS_TOKEN = process.env.NEXT_PUBLIC_SITE_LEADS_TOKEN || 'aiterra-website'

const mapsQuery = encodeURIComponent(`${OFFICE_ADDRESS_EN}, Israel`)

const mapsKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY

/**
 * Maps Embed API when the key is present, classic embed otherwise. The classic
 * endpoint renders an empty frame now, so a build without the key shows no map.
 * NEXT_PUBLIC_* is inlined at build time - the key has to reach `docker build`
 * as an arg, not only the runtime env_file.
 */
export const GOOGLE_MAPS_EMBED_URL = mapsKey
  ? `https://www.google.com/maps/embed/v1/place?key=${mapsKey}&q=${mapsQuery}&language=he&zoom=16`
  : `https://maps.google.com/maps?q=${mapsQuery}&hl=he&z=16&output=embed`

export const GOOGLE_MAPS_OPEN_URL = `https://www.google.com/maps/search/?api=1&query=${mapsQuery}`

export const WAZE_OPEN_URL = `https://waze.com/ul?q=${mapsQuery}&navigate=yes`
