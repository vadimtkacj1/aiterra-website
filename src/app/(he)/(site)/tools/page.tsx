import Link from 'next/link'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { ChevronPrevIcon } from '../components/icons'
import { HUB_TITLE } from '../components/tools/ToolLayout'
import JsonLd from '@/components/seo/JsonLd'
import { pageMetadata } from '@/lib/metadata'
import { breadcrumbList, webPage } from '@/lib/schema'
import { SITE_URL } from '@/lib/seo'
import { TOOLS_HUB_PATH, tools } from '@/lib/tools'
import styles from '../components/tools/ToolLayout.module.css'

const DESCRIPTION =
  'כלים חינמיים לבעלי עסקים ולמנהלי אתרים: מחוללים, בדיקות ומחשבונים בעברית, בלי הרשמה. הפרטים שתמלאו נשארים בדפדפן שלכם.'

export const metadata = pageMetadata({ title: HUB_TITLE, description: DESCRIPTION, path: TOOLS_HUB_PATH })

export default function ToolsHubPage() {
  return (
    <>
      <JsonLd data={webPage({ path: TOOLS_HUB_PATH, name: HUB_TITLE, description: DESCRIPTION, type: 'CollectionPage' })} />
      <JsonLd
        data={breadcrumbList([
          { name: 'בית', path: '/' },
          { name: HUB_TITLE, path: TOOLS_HUB_PATH },
        ])}
      />
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'ItemList',
          itemListElement: tools.map((tool, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            url: `${SITE_URL}${tool.path}`,
            name: tool.title,
          })),
        }}
      />
      <Header />
      <main id="main-content" className={styles.page}>
        <div className={`${styles.hero} ${styles.heroHub}`}>
          <div className={styles.head}>
            <nav className={styles.crumbs} aria-label="פירורי לחם">
              <Link href="/" className={styles.crumbLink}>
                בית
              </Link>
              <ChevronPrevIcon className={styles.crumbChevron} />
              <span aria-current="page">{HUB_TITLE}</span>
            </nav>
            <p className={styles.eyebrow}>AITERRA</p>
            <h1 className={styles.title}>{HUB_TITLE}</h1>
            <p className={styles.lede}>{DESCRIPTION}</p>
          </div>
        </div>
        <section className={`${styles.related} ${styles.hubList}`} aria-label={HUB_TITLE}>
          <ul className={styles.relatedList}>
            {tools.map((tool) => (
              <li key={tool.path}>
                <Link href={tool.path} className={styles.relatedCard}>
                  <span className={styles.relatedName}>{tool.title}</span>
                  <span className={styles.relatedText}>{tool.description}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </main>
      <Footer />
    </>
  )
}
