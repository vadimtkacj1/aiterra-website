import type { ReactNode } from 'react'

const glyphs: Record<string, ReactNode> = {
  oil: (
    <>
      <path d="M3 12h11v6H3z" />
      <path d="M3 12l2-3h5l1 3" />
      <path d="M14 14l6-3" />
      <path d="M20 15c0 1-1 2-1 2s-1-1-1-2 1-2 1-2 1 1 1 2z" />
    </>
  ),
  temperature: (
    <>
      <path d="M8 5a2 2 0 0 1 4 0v8.2a4 4 0 1 1-4 0z" />
      <path d="M10 9v6" />
      <path d="M14 8h6M14 12h6" />
      <path d="M14 16c1 1 2-1 3 0s2 1 3 0" />
    </>
  ),
  battery: (
    <>
      <rect x="3" y="8" width="18" height="11" rx="1.5" />
      <path d="M7 8V6h3v2M14 8V6h3v2" />
      <path d="M7.5 13.5h4M9.5 11.5v4" />
      <path d="M14.5 13.5h3" />
    </>
  ),
  brake: (
    <>
      <circle cx="12" cy="12" r="5.5" />
      <path d="M12 9.5v3" />
      <path d="M12 14.6h.01" />
      <path d="M5.5 8a8 8 0 0 0 0 8M18.5 8a8 8 0 0 1 0 8" />
    </>
  ),
  airbag: (
    <>
      <circle cx="7" cy="5.5" r="2" />
      <path d="M7 9v5h5l1 5" />
      <circle cx="16.5" cy="11.5" r="3.5" />
    </>
  ),
  seatbelt: (
    <>
      <circle cx="12" cy="4.5" r="2" />
      <path d="M9 9h6l1.5 6.5h-9z" />
      <path d="M9 9l7.5 6.5" />
      <path d="M8 20h8" />
    </>
  ),
  engine: (
    <>
      <path d="M5 10h2.5l1-2h6l1.5 2H19v6h-2l-1.5 2h-6L8 16H5z" />
      <path d="M3 12v3" />
      <path d="M21 12v3" />
      <path d="M10 5h4" />
    </>
  ),
  abs: (
    <>
      <circle cx="12" cy="12" r="7.5" />
      <path d="M4 7a10 10 0 0 0 0 10M20 7a10 10 0 0 1 0 10" />
      <path d="M8.5 14.5l1.5-5 1.5 5M9 13h2M13 14.5v-5h1.5a1.2 1.2 0 0 1 0 2.5H13h1.8a1.3 1.3 0 0 1 0 2.5z" />
    </>
  ),
  tires: (
    <>
      <path d="M5 19v-8c0-3.5 3-6 7-6s7 2.500 7 6v8h-3v-6.500c0-1.700-1.700-3-4-3s-4 1.300-4 3V19z" />
      <path d="M12 11.5v3" />
      <path d="M12 17h.01" />
    </>
  ),
  stability: (
    <>
      <path d="M4 14h11l-1.500-4h-8z" />
      <circle cx="7" cy="15.500" r="1.200" />
      <circle cx="13" cy="15.500" r="1.200" />
      <path d="M16 18c2.500 0 3.500-1.500 4-3.500M4 20c3 0 6-1 9-2.500" />
    </>
  ),
  fuel: (
    <>
      <path d="M5 20V6a2 2 0 0 1 2-2h5a2 2 0 0 1 2 2v14" />
      <path d="M4 20h11" />
      <path d="M7 8h5" />
      <path d="M14 10h2a2 2 0 0 1 2 2v4a1.500 1.500 0 0 0 3 0V9l-3-3" />
    </>
  ),
  glow: (
    <>
      <path d="M4 7c2 0 2 2 4 2s2-2 4-2 2 2 4 2 2-2 4-2" />
      <path d="M4 12c2 0 2 2 4 2s2-2 4-2 2 2 4 2 2-2 4-2" />
      <path d="M4 17c2 0 2 2 4 2s2-2 4-2 2 2 4 2 2-2 4-2" />
    </>
  ),
  'high-beam': (
    <>
      <path d="M10 5c-3.500 0-5.500 3-5.500 7s2 7 5.500 7z" />
      <path d="M13.500 6.500h7M13.500 10h7M13.500 14h7M13.500 17.500h7" />
    </>
  ),
  'low-beam': (
    <>
      <path d="M10 5c-3.500 0-5.500 3-5.500 7s2 7 5.500 7z" />
      <path d="M13.500 7l7 2M13.500 11l7 2M13.500 15l7 2" />
    </>
  ),
  fog: (
    <>
      <path d="M9 5c-3.500 0-5.500 3-5.500 7s2 7 5.500 7z" />
      <path d="M12.500 6.500h8M12.500 10.500h3c1.500 0 1.500 2 3 2h2M12.500 17.500h8" />
    </>
  ),
  turn: (
    <>
      <path d="M2.500 12l6-5v3h3v4h-3v3z" />
      <path d="M21.500 12l-6-5v3h-3v4h3v3z" />
    </>
  ),
  cruise: (
    <>
      <path d="M4 17a8.500 8.500 0 1 1 16 0" />
      <path d="M12 17l4-5" />
      <circle cx="12" cy="17" r="1" />
    </>
  ),
}

export default function CarWarningLightIcon({ id }: { id: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="32"
      height="32"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {glyphs[id]}
    </svg>
  )
}
