import Link from 'next/link'
import { notFound } from 'next/navigation'
import Header from '../../../components/Header'
import Footer from '../../../components/Footer'
import { HUB_TITLE, ToolCrumbs, ToolHero } from '../../../components/tools/ToolLayout'
import JsonLd from '@/components/seo/JsonLd'
import { pageMetadata } from '@/lib/metadata'
import { breadcrumbList, webPage } from '@/lib/schema'
import { SITE_URL } from '@/lib/seo'
import { TOOLS_HUB_PATH, toolCategories, toolsIn, topicPath, type ToolCategory } from '@/lib/tools'
import layout from '../../../components/tools/ToolLayout.module.css'

export const dynamicParams = false

export const generateStaticParams = () => toolCategories.map((category) => ({ topic: category.id }))

type Params = { params: Promise<{ topic: string }> }

const categoryOf = (id: string) => toolCategories.find((category) => category.id === id)

export async function generateMetadata({ params }: Params) {
  const category = categoryOf((await params).topic)
  if (!category) return {}
  return pageMetadata({ title: category.heading, description: category.intro[0], path: topicPath(category.id) })
}

export default async function TopicPage({ params }: Params) {
  const category = categoryOf((await params).topic)
  if (!category) notFound()
  const path = topicPath(category.id)
  const items = toolsIn(category.id as ToolCategory)
  const others = toolCategories.filter((other) => other.id !== category.id)

  return (
    <>
      <JsonLd data={webPage({ path, name: category.heading, description: category.intro[0], type: 'CollectionPage' })} />
      <JsonLd
        data={breadcrumbList([
          { name: 'בית', path: '/' },
          { name: HUB_TITLE, path: TOOLS_HUB_PATH },
          { name: category.title, path },
        ])}
      />
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'ItemList',
          numberOfItems: items.length,
          itemListElement: items.map((tool, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            url: `${SITE_URL}${tool.path}`,
            name: tool.title,
          })),
        }}
      />
      <Header />
      <main id="main-content" className={layout.page}>
        <ToolHero
          eyebrow={`${items.length} כלים חינמיים`}
          title={category.heading}
          lede={category.intro[0]}
          chips={['בלי הרשמה', 'בעברית מלאה']}
        />
        <ToolCrumbs
          trail={[
            { label: 'בית', href: '/' },
            { label: HUB_TITLE, href: TOOLS_HUB_PATH },
            { label: category.title },
          ]}
        />
        <article className={layout.guide}>
          {category.intro.slice(1).map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}

          <h2>כל הכלים בנושא {category.title}</h2>
          <ul>
            {items.map((tool) => (
              <li key={tool.path}>
                <Link href={tool.path}>{tool.title}</Link>: {tool.description}
              </li>
            ))}
          </ul>

          <h2>נושאים נוספים</h2>
          <ul>
            {others.map((other) => (
              <li key={other.id}>
                <Link href={topicPath(other.id)}>{other.heading}</Link>
              </li>
            ))}
          </ul>

          <div className={layout.cta}>
            <p>{category.service.text}</p>
            <Link href={category.service.href} className={layout.ctaLink}>
              {category.service.label}
            </Link>
          </div>
        </article>
      </main>
      <Footer />
    </>
  )
}
