'use client'

import { MessageCircle } from 'lucide-react'

export default function ShareResultButton({ text, tool, className }: { text: string; tool: string; className: string }) {
  const share = () => {
    const message = `${text}\n${window.location.href}`
    window.gtag?.('event', 'tool_result_share', { method: 'whatsapp', tool })
    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer')
  }

  return (
    <button type="button" className={className} onClick={share}>
      <MessageCircle aria-hidden="true" />
      שליחת התוצאה בוואטסאפ
    </button>
  )
}
