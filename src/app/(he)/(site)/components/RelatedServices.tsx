import Link from 'next/link'
import styles from './RelatedServices.module.css'

const SERVICE_KEYWORDS: Record<string, string[]> = {
  'web-development': ['בניית אתר', 'בניית אתרים', 'אתר לעסק', 'next.js', 'react', 'מהירות', 'core web vitals', 'נגישות', 'wordpress', 'wix', 'קוד'],
  seo: ['seo', 'קידום', 'אורגני', 'מילות מפתח', 'מחקר מילות', 'דירוג', 'תוכן', 'בלוג', 'קישורים'],
  ecommerce: ['חנות', 'איקומרס', 'ecommerce', 'סליקה', 'עגלה', 'מוצרים', 'קטלוג', 'משלוח'],
  development: ['מערכת', 'מערכות', 'crm', 'erp', 'אינטגרצי', 'api', 'פורטל', 'אפליקצי', 'אוטומציה', 'חשבונית', 'תהליכ'],
  brochure: ['תדמית', 'דף נחיתה', 'landing', 'לידים'],
  marketing: ['קמפיין', 'קמפיינ', 'ממומן', 'ppc', 'פרסום', 'google ads', 'גוגל אדס', 'פייסבוק', 'facebook', 'אינסטגרם', 'instagram', 'רימרקטינג'],
  branding: ['מיתוג', 'מותג', 'לוגו', 'זהות', 'עיצוב', 'ux', 'ui', 'חוויית משתמש'],
  maintenance: ['תחזוק', 'אחזק', 'אבטח', 'גיבוי', 'עדכונ', 'אחסון', 'דומיין', 'תמיכה', 'ssl', 'תקלה'],
  'ai-agents': ['בוט', 'סוכן', 'סוכני', 'וואטסאפ', 'whatsapp', 'צ׳אט', "צ'אט", 'chatbot', 'agent'],
  'ai-search': ['geo', 'aeo', 'chatgpt', 'gemini', 'perplexity', 'בינה מלאכותית', 'ai overview', 'תשובות ai'],
}

export type RelatedServiceItem = { slug: string; label: string; blurb: string }

type Props = {
  tags?: string[]
  title?: string
  seed?: string
  heading: string
  basePath: string
  items: RelatedServiceItem[]
}

function offsetFrom(seed: string, span: number): number {
  if (!span) return 0
  let hash = 0
  for (let i = 0; i < seed.length; i += 1) {
    hash = (hash * 31 + seed.charCodeAt(i)) % 100000
  }
  return hash % span
}

function pick(items: RelatedServiceItem[], haystack: string, seed: string): RelatedServiceItem[] {
  const scored = items.map((item) => {
    const keywords = SERVICE_KEYWORDS[item.slug] ?? []
    const score = keywords.reduce((n, kw) => (haystack.includes(kw.toLowerCase()) ? n + 1 : n), 0)
    return { item, score }
  })

  const matched = scored
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((entry) => entry.item)
    .slice(0, 3)

  const rest = items.filter((item) => !matched.includes(item))
  const start = offsetFrom(seed, rest.length)
  const filled = [...matched]
  for (let i = 0; filled.length < 3 && i < rest.length; i += 1) {
    filled.push(rest[(start + i) % rest.length])
  }
  return filled
}

export default function RelatedServices({
  tags = [],
  title = '',
  seed = '',
  heading,
  basePath,
  items,
}: Props) {
  const picks = pick(items, `${tags.join(' ')} ${title}`.toLowerCase(), seed || title)
  if (!picks.length) return null

  return (
    <section className={styles.related} aria-label={heading}>
      <h2 className={styles.heading}>{heading}</h2>
      <ul className={styles.list}>
        {picks.map((item) => (
          <li key={item.slug}>
            <Link href={`${basePath}/${item.slug}`} className={styles.card}>
              <span className={styles.label}>{item.label}</span>
              <span className={styles.blurb}>{item.blurb}</span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  )
}
