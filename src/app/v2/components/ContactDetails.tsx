import { MailIcon, PhoneIcon, PinIcon } from './icons'
import {
  CONTACT_EMAIL,
  CONTACT_PHONE,
  CONTACT_PHONE_HREF,
  GOOGLE_MAPS_EMBED_URL,
  GOOGLE_MAPS_OPEN_URL,
  OFFICE_ADDRESS_HE,
  WAZE_OPEN_URL,
} from '@/lib/contact'
import { getV2Content } from '@/lib/v2-content-server'
import styles from './ContactDetails.module.css'

export default function ContactDetails() {
  const { details } = getV2Content().contactPage

  return (
    <section className={styles.card} aria-labelledby="v2-contact-details-heading">
      <div className={styles.body}>
        <h3 id="v2-contact-details-heading" className={styles.heading}>
          {details.heading}
        </h3>

        <ul className={styles.rows}>
          <li className={styles.row}>
            <span className={styles.badge} aria-hidden="true">
              <MailIcon className={styles.badgeIcon} />
            </span>
            <span className={styles.text}>
              <span className={styles.label}>{details.emailLabel}</span>
              <a href={`mailto:${CONTACT_EMAIL}`} className={styles.value} dir="ltr">
                {CONTACT_EMAIL}
              </a>
            </span>
          </li>

          <li className={styles.row}>
            <span className={styles.badge} aria-hidden="true">
              <PhoneIcon className={styles.badgeIcon} />
            </span>
            <span className={styles.text}>
              <span className={styles.label}>{details.phoneLabel}</span>
              <a href={CONTACT_PHONE_HREF} className={styles.value} dir="ltr">
                {CONTACT_PHONE}
              </a>
            </span>
          </li>

          <li className={[styles.row, styles.rowAddress].join(' ')}>
            <span className={styles.badge} aria-hidden="true">
              <PinIcon className={styles.badgeIcon} />
            </span>
            <span className={styles.text}>
              <span className={styles.label}>{details.addressLabel}</span>
              <a
                href={GOOGLE_MAPS_OPEN_URL}
                className={styles.value}
                target="_blank"
                rel="noopener noreferrer"
              >
                {OFFICE_ADDRESS_HE}
              </a>
            </span>
            <span className={styles.apps}>
              <a
                href={WAZE_OPEN_URL}
                className={[styles.app, styles.appWaze].join(' ')}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={details.waze}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/images/deliver2.webp" alt="" className={styles.appFace} />
              </a>
              <a
                href={GOOGLE_MAPS_OPEN_URL}
                className={[styles.app, styles.appMaps].join(' ')}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={details.maps}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/images/deliver1.webp" alt="" className={styles.appIcon} />
              </a>
            </span>
          </li>
        </ul>
      </div>

      <div className={styles.map}>
        <iframe
          className={styles.mapFrame}
          title={details.mapTitle}
          src={GOOGLE_MAPS_EMBED_URL}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
        />
      </div>
    </section>
  )
}
