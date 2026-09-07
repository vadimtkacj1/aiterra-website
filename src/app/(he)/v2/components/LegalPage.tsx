import type { ReactNode } from 'react'
import Link from 'next/link'
import Header from './Header'
import Footer from './Footer'
import { ChevronPrevIcon } from './icons'
import { getV2Content, getV2ContentEn } from '@/lib/v2-content-server'
import styles from './LegalPage.module.css'

type LegalPageProps = {
  title: string
  lastUpdated: string
  locale?: 'he' | 'en'
  children: ReactNode
}

export default function LegalPage({ title, lastUpdated, locale = 'he', children }: LegalPageProps) {
  const { blog, legal } = locale === 'en' ? getV2ContentEn() : getV2Content()
  const homeHref = locale === 'en' ? '/en' : '/'

  return (
    <>
      <Header />
      <main id="main-content" className={styles.page}>
        <div className={styles.inner}>
          <nav className={styles.crumbs} aria-label={blog.crumbsLabel}>
            <Link href={homeHref} className={styles.crumbLink}>
              {blog.crumbHome}
            </Link>
            <ChevronPrevIcon className={styles.crumbChevron} />
            <span className={styles.crumbCurrent} aria-current="page">
              {title}
            </span>
          </nav>

          <header className={styles.head}>
            <h1 className={styles.title}>{title}</h1>
            <p className={styles.updated}>
              {legal.updatedPrefix} {lastUpdated}
            </p>
          </header>

          <article className={styles.prose} dir={locale === 'en' ? 'ltr' : 'rtl'}>
            {children}
          </article>
        </div>
      </main>
      <Footer locale={locale} />
    </>
  )
}
