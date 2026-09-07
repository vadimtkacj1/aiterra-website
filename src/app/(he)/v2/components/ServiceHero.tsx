import Link from 'next/link'
import ActionButton from './ActionButton'
import Eyebrow from './Eyebrow'
import SectionHeading from './SectionHeading'
import { ChevronPrevIcon } from './icons'
import { getContent, type Locale } from '@/lib/v2-content-server'
import { type ServicePage } from '../content'
import styles from './ServiceHero.module.css'

export default function ServiceHero({
  service,
  headingId,
  locale,
  servicesHref = '/services',
}: {
  service: ServicePage
  headingId: string
  locale?: Locale
  servicesHref?: string
}) {
  const { blog, servicesPage } = getContent(locale)

  return (
    <section className={styles.hero} aria-labelledby={headingId}>
      <div className={styles.inner}>
        <div className={styles.copy}>
          <nav className={styles.crumbs} aria-label={blog.crumbsLabel}>
            <Link href={locale === 'en' ? '/en' : '/'} className={styles.crumbLink}>
              {blog.crumbHome}
            </Link>
            <ChevronPrevIcon className={styles.crumbChevron} />
            <Link href={servicesHref} className={styles.crumbLink}>
              {servicesPage.crumb}
            </Link>
            <ChevronPrevIcon className={styles.crumbChevron} />
            <span className={styles.crumbCurrent} aria-current="page">
              {service.crumb}
            </span>
          </nav>

          <div className={styles.body}>
            <Eyebrow label={service.eyebrow} dot="rtl" className={styles.eyebrow} />

            <SectionHeading
              as="h1"
              id={headingId}
              lines={service.heading}
              align="start"
              className={styles.heading}
            />

            <p className={styles.subhead}>{service.subhead}</p>
            <p className={styles.lede}>{service.lede}</p>

            <ActionButton
              href={service.action.href}
              label={service.action.label}
              className={styles.action}
            />
          </div>
        </div>

        <figure className={styles.art}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={service.image} alt="" className={styles.artImage} />
        </figure>
      </div>
    </section>
  )
}
