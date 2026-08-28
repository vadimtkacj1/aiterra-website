import Link from 'next/link'
import { ChevronPrevIcon } from './icons'
import { blog } from '../content'
import styles from './PageCrumbs.module.css'

export default function PageCrumbs({ current }: { current: string }) {
  return (
    <div className={styles.head}>
      <div className={styles.rules} aria-hidden="true">
        <span />
        <span />
        <span />
      </div>
      <nav className={styles.crumbs} aria-label={blog.crumbsLabel}>
        <Link href="/v2" className={styles.crumbLink}>
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
