'use client'

import ActionButton from './ActionButton'

type Props = {
  href: string
  label: string
  className?: string
}

export default function OnModelPromoButton({ href, label, className }: Props) {
  const track = () => {
    window.gtag?.('event', 'onmodel_promo_click', { page_path: window.location.pathname })
  }

  return <ActionButton href={href} label={label} glyph="prev" className={className} onClick={track} />
}
