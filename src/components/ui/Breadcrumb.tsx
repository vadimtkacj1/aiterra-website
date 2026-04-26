import Link from 'next/link'
import Script from 'next/script'

interface BreadcrumbItem {
  label: string
  href?: string
}

interface Props {
  items: BreadcrumbItem[]
  variant?: 'light' | 'dark'
}

const BASE_URL = 'https://www.aiterra.co.il'

export default function Breadcrumb({ items, variant = 'light' }: Props) {
  const all = [{ label: 'ראשי', href: '/' }, ...items]

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: all.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.label,
      item: item.href ? `${BASE_URL}${item.href}` : undefined,
    })),
  }

  const isLight = variant === 'light'
  const textColor = isLight ? '#6b7280' : 'rgba(255,255,255,0.55)'
  const activeColor = isLight ? '#1B1BB3' : '#fff'
  const sepColor = isLight ? '#d1d5db' : 'rgba(255,255,255,0.3)'

  return (
    <>
      <Script
        id={`breadcrumb-jsonld-${all.map(i => i.label).join('-')}`}
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <nav aria-label="breadcrumb" dir="rtl">
        <ol className="flex items-center flex-wrap gap-1 text-[13px]" style={{ listStyle: 'none', margin: 0, padding: 0 }}>
          {all.map((item, i) => {
            const isLast = i === all.length - 1
            return (
              <li key={i} className="flex items-center gap-1">
                {i > 0 && (
                  <span style={{ color: sepColor, fontSize: 11, userSelect: 'none' }}>›</span>
                )}
                {!isLast && item.href ? (
                  <Link
                    href={item.href}
                    style={{ color: textColor, textDecoration: 'none', fontWeight: 400 }}
                    className="hover:opacity-80 transition-opacity"
                  >
                    {item.label}
                  </Link>
                ) : (
                  <span style={{ color: isLast ? activeColor : textColor, fontWeight: isLast ? 600 : 400 }}>
                    {item.label}
                  </span>
                )}
              </li>
            )
          })}
        </ol>
      </nav>
    </>
  )
}
