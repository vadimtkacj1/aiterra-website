import Link from 'next/link'
import Header from '../../../(he)/(site)/components/Header'
import Footer from '../../../(he)/(site)/components/Footer'
import { EnToolCrumbs, EnToolHero, EnToolList } from './_components/EnToolLayout'
import JsonLd from '@/components/seo/JsonLd'
import { pageMetadata } from '@/lib/metadata'
import { breadcrumbList, webPage } from '@/lib/schema'
import { SITE_URL } from '@/lib/seo'
import { EN_TOOLS_HUB_PATH, EN_TOOLS_HUB_TITLE, enToolPath, enTools } from '@/lib/tools-en'
import layout from '../../../(he)/(site)/components/tools/ToolLayout.module.css'
import styles from '../../../(he)/(site)/tools/page.module.css'

const DESCRIPTION =
  'Free calculators and generators in English for freelancers, olim and foreign companies doing business in Israel. No sign-up, and what you enter stays in your browser.'

export const metadata = pageMetadata({
  title: EN_TOOLS_HUB_TITLE,
  description: DESCRIPTION,
  path: EN_TOOLS_HUB_PATH,
  locale: 'en',
  altPath: '/tools',
})

export default function EnToolsHubPage() {
  return (
    <>
      <JsonLd
        data={webPage({
          path: EN_TOOLS_HUB_PATH,
          name: EN_TOOLS_HUB_TITLE,
          description: DESCRIPTION,
          type: 'CollectionPage',
        })}
      />
      <JsonLd
        data={breadcrumbList([
          { name: 'Home', path: '/en' },
          { name: EN_TOOLS_HUB_TITLE, path: EN_TOOLS_HUB_PATH },
        ])}
      />
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'ItemList',
          itemListElement: enTools.map((tool, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            url: `${SITE_URL}${enToolPath(tool.slug)}`,
            name: tool.title,
          })),
        }}
      />
      <Header />
      <main id="main-content" className={layout.page}>
        <EnToolHero
          large
          eyebrow="Free tools"
          title={EN_TOOLS_HUB_TITLE}
          lede="Calculators for the questions that come up when you work in or with Israel: VAT, invoices and more. Free, no sign-up, and your data stays on your device."
          chips={['No sign-up', 'Nothing is sent anywhere', 'Built for Israeli rules']}
        />
        <EnToolCrumbs trail={[{ label: 'Home', href: '/en' }, { label: 'Free tools' }]} />

        <section className={layout.related} aria-label="Tools">
          <EnToolList items={enTools} />
        </section>

        <section className={styles.band} aria-labelledby="tools-cta-heading">
          <div className={styles.bandInner}>
            <h2 id="tools-cta-heading" className={styles.bandTitle}>
              Need something these tools don&apos;t do?
            </h2>
            <p className={styles.bandText}>
              We build websites, online stores, automations and AI agents for businesses in Israel. Tell us what you
              need and we will get back to you.
            </p>
            <Link href="/en/contact" className={styles.bandLink}>
              Talk to us
            </Link>
          </div>
        </section>
      </main>
      <Footer locale="en" />
    </>
  )
}
