import { resolveRouteSeo } from '@/lib/site-seo-server'

/**
 * Renders optional JSON-LD from admin SEO (`jsonLd` field) for this path.
 */
export default function RouteJsonLd({ path }: { path: string }) {
  const resolved = resolveRouteSeo(path)
  const raw = resolved?.jsonLd?.trim()
  if (!raw) return null

  let parsed: unknown
  try {
    parsed = JSON.parse(raw) as unknown
  } catch {
    return null
  }

  const blocks = Array.isArray(parsed) ? parsed : [parsed]
  return (
    <>
      {blocks.map((obj, i) => {
        if (!obj || typeof obj !== 'object') return null
        return (
          <script
            // eslint-disable-next-line react/no-array-index-key -- stable order from JSON array
            key={i}
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(obj) }}
          />
        )
      })}
    </>
  )
}
