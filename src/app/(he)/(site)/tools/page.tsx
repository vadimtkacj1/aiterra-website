import Link from 'next/link'
import Header from '../components/Header'
import Footer from '../components/Footer'
import Eyebrow from '../components/Eyebrow'
import { HUB_TITLE, ToolCard, ToolCrumbs, ToolHero } from '../components/tools/ToolLayout'
import JsonLd from '@/components/seo/JsonLd'
import { pageMetadata } from '@/lib/metadata'
import { breadcrumbList, webPage } from '@/lib/schema'
import { SITE_URL } from '@/lib/seo'
import { TOOLS_HUB_PATH, toolCategories, tools, toolsIn } from '@/lib/tools'
import layout from '../components/tools/ToolLayout.module.css'
import styles from './page.module.css'

const DESCRIPTION =
  'כלים חינמיים לבעלי עסקים ולמנהלי אתרים: מחוללים, מחשבונים ובדיקות בעברית, בלי הרשמה. הפרטים שתמלאו נשארים בדפדפן שלכם.'

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
      <main id="main-content" className={layout.page}>
        <ToolHero
          large
          eyebrow={`${tools.length} כלים בעברית`}
          title={HUB_TITLE}
          lede="מחוללים, מחשבונים ובדיקות שחוסכים לעסק זמן: מסמכים משפטיים לאתר, מע״מ והצעות מחיר, QR, וואטסאפ ועיצוב. חינם, בלי הרשמה, והפרטים נשארים אצלכם."
          chips={['בלי הרשמה', 'הפרטים לא נשלחים לשום מקום', 'בעברית מלאה']}
        />
        <ToolCrumbs trail={[{ label: 'בית', href: '/' }, { label: HUB_TITLE }]} />

        <nav className={styles.jump} aria-label="קטגוריות">
          {toolCategories
            .filter((category) => toolsIn(category.id).length)
            .map((category) => (
              <a key={category.id} href={`#${category.id}`} className={styles.jumpLink}>
                {category.label}
                <span className={styles.jumpCount}>{toolsIn(category.id).length}</span>
              </a>
            ))}
        </nav>

        {toolCategories.map((category) => {
          const items = toolsIn(category.id)
          if (!items.length) return null
          return (
            <section key={category.id} id={category.id} className={`${layout.related} ${styles.section}`} aria-labelledby={`${category.id}-heading`}>
              <div className={layout.sectionHead}>
                <Eyebrow label={category.label} dot="rtl" />
                <h2 id={`${category.id}-heading`} className={layout.sectionTitle}>
                  {category.title}
                </h2>
              </div>
              <ul className={layout.cardList}>
                {items.map((tool) => (
                  <li key={tool.path}>
                    <ToolCard tool={tool} />
                  </li>
                ))}
              </ul>
            </section>
          )
        })}

        <section className={styles.band} aria-labelledby="tools-cta-heading">
          <div className={styles.bandInner}>
            <h2 id="tools-cta-heading" className={styles.bandTitle}>
              צריכים משהו שהכלים לא עושים?
            </h2>
            <p className={styles.bandText}>
              אנחנו בונים אתרים, חנויות, אוטומציות וסוכני AI לעסקים בישראל. ספרו לנו מה אתם צריכים ונחזור אליכם.
            </p>
            <Link href="/contact" className={styles.bandLink}>
              דברו איתנו
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
