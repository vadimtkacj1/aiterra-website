'use client'

import type { MouseEvent } from 'react'
import ActionButton from './ActionButton'

type PlanCtaProps = {
  href: string
  label: string
  service: string
  className?: string
}

export default function PlanCta({ href, label, service, className }: PlanCtaProps) {
  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    const target = document.getElementById('v2-contact')
    if (!target || event.metaKey || event.ctrlKey || event.shiftKey || event.button !== 0) return

    event.preventDefault()
    window.dispatchEvent(new CustomEvent('v2:contact-service', { detail: service }))
    target.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <ActionButton
      href={href}
      label={label}
      glyph="swap"
      className={className}
      onClick={handleClick}
    />
  )
}
