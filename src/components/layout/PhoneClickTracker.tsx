'use client'

import { useEffect } from 'react'
import { CONTACT_PHONE_HREF } from '@/lib/contact'
import { trackPhoneClick } from '@/lib/ga'

const digitsOf = (value: string) => value.replace(/\D/g, '')
const OWN_NUMBER_TAIL = digitsOf(CONTACT_PHONE_HREF).slice(-9)

function isOwnNumberLink(target: EventTarget | null) {
  if (!(target instanceof Element)) return false
  const link = target.closest('a[href^="tel:"]')
  return link !== null && digitsOf(link.getAttribute('href') ?? '').endsWith(OWN_NUMBER_TAIL)
}

export default function PhoneClickTracker() {
  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (isOwnNumberLink(event.target)) trackPhoneClick()
    }
    document.addEventListener('click', onClick, true)
    return () => document.removeEventListener('click', onClick, true)
  }, [])

  return null
}
