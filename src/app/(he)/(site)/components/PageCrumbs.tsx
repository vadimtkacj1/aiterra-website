import Link from 'next/link'
import { ChevronPrevIcon } from './icons'
import { getContent, type Locale } from '@/lib/v2-content-server'
import styles from './PageCrumbs.module.css'

export default function PageCrumbs({
  current,
  locale,
  homeHref = '/',
}: {
  current: string
  locale?: Locale
  homeHref?: string
}) {
  const { blog } = getContent(locale)

  return (
    <div className={styles.head}>
      <div className={styles.rules} aria-hidden="true">
        <span />
        <span />
        <span />
      </div>
      <nav className={styles.crumbs} aria-label={blog.crumbsLabel}>
        <Link href={homeHref} className={styles.crumbLink}>
          {blog.crumbHome}
        </Link>
        <ChevronPrevIcon className={styles.crumbChevron} />
        <span className={styles.crumbCurrent} aria-current="page">
          {current}
        </span>
      </nav>
    </div>
  )
}
