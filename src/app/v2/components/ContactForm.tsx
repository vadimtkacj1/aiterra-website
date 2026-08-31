'use client'

import { useId, useState } from 'react'
import type { FormEvent, ReactNode } from 'react'
import Link from 'next/link'
import SectionHeading from './SectionHeading'
import { ChevronDownIcon, ChevronPrevIcon } from './icons'
import { contact as contactDefaults, serviceTabs as serviceTabsDefaults } from '../content'
import { useV2 } from '../V2ContentProvider'
import { SITE_LEADS_TOKEN } from '@/lib/contact'
import styles from './ContactForm.module.css'

type Status = 'idle' | 'sending' | 'sent' | 'error'

type ContactFormProps = {
  children?: ReactNode
  source?: string
  variant?: 'page' | 'footer'
}

export default function ContactForm({ children, source = 'v2-home', variant = 'page' }: ContactFormProps) {
  const contact = useV2('contact', contactDefaults)
  const serviceTabs = useV2('serviceTabs', serviceTabsDefaults)
  const serviceOptions = [...serviceTabs.map((tab) => tab.label), contact.serviceOther]
  const headingId = useId()
  const fieldId = useId()
  const [status, setStatus] = useState<Status>('idle')

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (status === 'sending') return

    const data = new FormData(event.currentTarget)
    const read = (key: string) => String(data.get(key) ?? '')

    setStatus('sending')
    try {
      const response = await fetch('/api/site-leads/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          publicToken: SITE_LEADS_TOKEN,
          name: read('name'),
          phone: read('phone'),
          email: read('email'),
          message: read('message'),
          treatment: read('service'),
          source,
        }),
      })
      if (!response.ok) throw new Error('request failed')
      setStatus('sent')
    } catch {
      setStatus('error')
    }
  }

  return (
    <section
      id="v2-contact"
      className={[styles.contact, variant === 'footer' ? styles.onVideo : ''].join(' ').trim()}
      aria-labelledby={headingId}
    >
      <div className={styles.inner}>
        <div className={styles.headBleed}>
          <div className={styles.head}>
            <SectionHeading id={headingId} lines={contact.heading} className={styles.heading} />
          </div>
        </div>

        <div className={styles.grid}>
          <div className={styles.panel}>
            {status === 'sent' ? (
              <div className={styles.success} role="status">
                <h3 className={styles.title}>{contact.success.title}</h3>
                <p className={styles.successText}>{contact.success.text}</p>
              </div>
            ) : (
              <form className={styles.form} onSubmit={handleSubmit}>
                <h3 className={styles.title}>{contact.title}</h3>

                <div className={styles.fields}>
                  <div className={styles.field}>
                    <input
                      id={`${fieldId}-name`}
                      className={[styles.input, styles.text].join(' ')}
                      type="text"
                      name="name"
                      placeholder=" "
                      autoComplete="name"
                      required
                    />
                    <label htmlFor={`${fieldId}-name`} className={styles.label}>
                      {contact.fields.name}
                    </label>
                  </div>

                  <div className={styles.field}>
                    <input
                      id={`${fieldId}-phone`}
                      className={[styles.input, styles.text, styles.ltrValue].join(' ')}
                      type="tel"
                      name="phone"
                      placeholder=" "
                      autoComplete="tel"
                      inputMode="tel"
                      dir="ltr"
                      required
                    />
                    <label htmlFor={`${fieldId}-phone`} className={styles.label}>
                      {contact.fields.phone}
                    </label>
                  </div>

                  <div className={styles.field}>
                    <input
                      id={`${fieldId}-email`}
                      className={[styles.input, styles.text, styles.ltrValue].join(' ')}
                      type="email"
                      name="email"
                      placeholder=" "
                      autoComplete="email"
                      inputMode="email"
                      dir="ltr"
                      required
                    />
                    <label htmlFor={`${fieldId}-email`} className={styles.label}>
                      {contact.fields.email}
                    </label>
                  </div>

                  <div className={[styles.field, styles.selectField].join(' ')}>
                    <select
                      id={`${fieldId}-service`}
                      className={[styles.input, styles.select].join(' ')}
                      name="service"
                      defaultValue=""
                      aria-label={contact.fields.service}
                      required
                    >
                      <option value="" disabled>
                        {contact.fields.servicePlaceholder}
                      </option>
                      {serviceOptions.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                    <label htmlFor={`${fieldId}-service`} className={styles.label}>
                      {contact.fields.service}
                    </label>
                    <ChevronDownIcon className={styles.selectChevron} />
                  </div>

                  <div className={[styles.field, styles.fieldWide].join(' ')}>
                    <textarea
                      id={`${fieldId}-message`}
                      className={[styles.input, styles.text, styles.textarea].join(' ')}
                      name="message"
                      placeholder=" "
                      rows={1}
                    />
                    <label htmlFor={`${fieldId}-message`} className={styles.label}>
                      {contact.fields.message}
                    </label>
                  </div>
                </div>

                <label className={styles.consent}>
                  <input type="checkbox" name="consent" className={styles.checkbox} required />
                  <span className={styles.consentText}>
                    {contact.consent.before}
                    <Link href={contact.consent.terms.href} className={styles.consentLink}>
                      {contact.consent.terms.label}
                    </Link>
                    {contact.consent.joiner}
                    <Link href={contact.consent.privacy.href} className={styles.consentLink}>
                      {contact.consent.privacy.label}
                    </Link>
                    {contact.consent.after}
                  </span>
                </label>

                <button type="submit" className={styles.submit} disabled={status === 'sending'}>
                  <span>{status === 'sending' ? contact.sending : contact.submit}</span>
                  <span className={styles.submitIcon} aria-hidden="true">
                    <ChevronPrevIcon className={styles.submitChevron} />
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src="/images/plus.svg" alt="" width={14} height={14} className={styles.submitPlus} />
                  </span>
                </button>

                {status === 'error' ? (
                  <p className={styles.error} role="alert">
                    {contact.error}
                  </p>
                ) : null}
              </form>
            )}
          </div>

          <figure className={styles.art}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={contact.art.src} alt="" className={styles.artImage} loading="lazy" />
            <figcaption className={styles.artCaption}>
              {contact.art.caption.map((line) => (
                <span key={line} className={styles.artLine}>
                  {line}
                </span>
              ))}
            </figcaption>
          </figure>

          {children ? <div className={styles.extra}>{children}</div> : null}
        </div>
      </div>
    </section>
  )
}
