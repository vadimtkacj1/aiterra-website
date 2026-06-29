import Link from 'next/link'
import { services } from '@/data/services'

/**
 * Contextual internal links from blog posts to the commercial service pages.
 *
 * Why this exists: the blog is the only deeply-crawled, ranking section of the
 * site, while /services/* and /packages were "Discovered – not indexed" because
 * their only inbound links were sitewide nav/footer boilerplate (which Google
 * discounts when prioritizing crawl). Rendering real, topically-matched <a href>
 * anchors in the body of every indexed post funnels internal PageRank to the
 * money pages and gives Google a strong reason to crawl them. Server-rendered,
 * so the links are present in the initial HTML.
 */

// Map a post's tags/slug keywords to the most relevant service. Order within
// each list doesn't matter — we score by how many keywords match.
const SERVICE_KEYWORDS: Record<string, string[]> = {
  'web-development': ['אתר', 'אתרים', 'חנות', 'איקומרס', 'עיצוב', 'נגישות', 'תחזוק', 'אחסון', 'wordpress', 'wix', 'website', 'ecommerce', 'landing', 'דף נחיתה', 'ux', 'ui'],
  seo: ['seo', 'קידום', 'אורגני', 'מילות מפתח', 'מילים', 'תוכן', 'geo', 'aeo', 'מחקר מילות', 'בלוג', 'דירוג'],
  automation: ['אוטומציה', 'crm', 'וואטסאפ', 'whatsapp', 'אינטגרצי', 'מערכת', 'בוט', 'חשבונית', 'תהליכ', 'לידים', 'ניהול'],
  adv: ['ממומן', 'ppc', 'קמפיין', 'קמפיינ', 'פרסום', 'google ads', 'גוגל אדס', 'פייסבוק', 'facebook', 'instagram', 'אינסטגרם', 'אדס'],
}

function pickServices(tags: string[]): typeof services {
  const haystack = tags.join(' ').toLowerCase()
  const scored = services
    .map((s) => {
      const kws = SERVICE_KEYWORDS[s.slug] ?? []
      const score = kws.reduce((n, kw) => (haystack.includes(kw.toLowerCase()) ? n + 1 : n), 0)
      return { s, score }
    })
    .sort((a, b) => b.score - a.score)

  const matched = scored.filter((x) => x.score > 0).map((x) => x.s)
  // Always show 3 cards: fill from default order if fewer than 3 matched.
  const result = [...matched]
  for (const x of scored) {
    if (result.length >= 3) break
    if (!result.includes(x.s)) result.push(x.s)
  }
  return result.slice(0, 3)
}

export default function RelatedServicesSection({ tags = [] }: { tags?: string[] }) {
  const picks = pickServices(tags)

  return (
    <section className="max-w-4xl mx-auto px-6 pb-12 pt-4 border-t border-gray-100" dir="rtl" aria-label="שירותים קשורים">
      <h2 className="text-[20px] md:text-[26px] font-bold text-[#1B1BB3] mb-6">שירותים שיכולים לעזור</h2>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {picks.map((s) => (
          <Link
            key={s.slug}
            href={`/services/${s.slug}`}
            className="group block rounded-xl border border-gray-100 p-5 transition-colors hover:border-[#530FAD] hover:bg-purple-50/40"
          >
            <span className="block text-[16px] font-bold text-[#111827] group-hover:text-[#530FAD]">{s.title}</span>
            <span className="mt-1 block text-[13px] text-[#6b7280] line-clamp-2">{s.upperTitle}</span>
          </Link>
        ))}
      </div>

      <p className="mt-6 text-[14px] text-[#4b5563]">
        לא בטוחים מה מתאים לעסק שלכם?{' '}
        <Link href="/services" className="font-bold text-[#530FAD] hover:underline">ראו את כל השירותים</Link>
        {' '}או{' '}
        <Link href="/contact" className="font-bold text-[#530FAD] hover:underline">קבלו ייעוץ חינם</Link>.
      </p>
    </section>
  )
}
