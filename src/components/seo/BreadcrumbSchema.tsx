import { SITE_URL } from '@/lib/seo'

interface BreadcrumbItem {
  label: string
  href?: string
}

export default function BreadcrumbSchema({ items }: { items: BreadcrumbItem[] }) {
  const allItems = [{ label: 'בית', href: '/' }, ...items]

  const data = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: allItems.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.label,
      ...(item.href ? { item: item.href === '/' ? SITE_URL : `${SITE_URL}${item.href}` } : {}),
    })),
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}
