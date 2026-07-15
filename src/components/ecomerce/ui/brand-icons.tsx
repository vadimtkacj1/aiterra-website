import type { SVGProps } from 'react'

/**
 * Brand marks — the real logos, not stand-in glyphs.
 *
 * Path data is Simple Icons' (CC0), inlined rather than imported so the page
 * ships five paths instead of a three-thousand-icon dependency. Every mark is a
 * single `currentColor` path: on the strip they read as ink like everything else
 * on the band, and the brand colour is only spent on hover — the page's rule
 * that colour is a state, never decoration.
 *
 * Microsoft is drawn here by hand: it is deliberately absent from Simple Icons
 * (the brand disallows redistribution), and its four squares are plain geometry.
 */

const BASE: SVGProps<SVGSVGElement> = {
  xmlns: 'http://www.w3.org/2000/svg',
  fill: 'currentColor',
  'aria-hidden': true,
  focusable: false,
}

export const BRAND_HEX = {
  visa: '#1A1F71',
  mastercard: '#EB001B',
  meta: '#0467DF',
  googleAnalytics: '#E37400',
  /* Microsoft's own neutral. The mark itself is polychrome — its four squares
     take their colours in `MicrosoftIcon` — so the chip frame stays grey rather
     than picking one of them arbitrarily. */
  microsoft: '#737373',
} as const

export function VisaIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" {...BASE} {...props}>
      <path d="M9.112 8.262L5.97 15.758H3.92L2.374 9.775c-.094-.368-.175-.503-.461-.658C1.447 8.864.677 8.627 0 8.479l.046-.217h3.3a.904.904 0 01.894.764l.817 4.338 2.018-5.102zm8.033 5.049c.008-1.979-2.736-2.088-2.717-2.972.006-.269.262-.555.822-.628a3.66 3.66 0 011.913.336l.34-1.59a5.207 5.207 0 00-1.814-.333c-1.917 0-3.266 1.02-3.278 2.479-.012 1.079.963 1.68 1.698 2.04.756.367 1.01.603 1.006.931-.005.504-.602.725-1.16.734-.975.015-1.54-.263-1.992-.473l-.351 1.642c.453.208 1.289.39 2.156.398 2.037 0 3.37-1.006 3.377-2.564m5.061 2.447H24l-1.565-7.496h-1.656a.883.883 0 00-.826.55l-2.909 6.946h2.036l.405-1.12h2.488zm-2.163-2.656l1.02-2.815.588 2.815zm-8.16-4.84l-1.603 7.496H8.34l1.605-7.496z" />
    </svg>
  )
}

export function MastercardIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" {...BASE} {...props}>
      <path d="M11.343 18.031c.058.049.12.098.181.146-1.177.783-2.59 1.238-4.107 1.238C3.32 19.416 0 16.096 0 12c0-4.095 3.32-7.416 7.416-7.416 1.518 0 2.931.456 4.105 1.238-.06.051-.12.098-.165.15C9.6 7.489 8.595 9.688 8.595 12c0 2.311 1.001 4.51 2.748 6.031zm5.241-13.447c-1.52 0-2.931.456-4.105 1.238.06.051.12.098.165.15C14.4 7.489 15.405 9.688 15.405 12c0 2.31-1.001 4.507-2.748 6.031-.058.049-.12.098-.181.146 1.177.783 2.588 1.238 4.107 1.238C20.68 19.416 24 16.096 24 12c0-4.094-3.32-7.416-7.416-7.416zM12 6.174c-.096.075-.189.15-.28.231C10.156 7.764 9.169 9.765 9.169 12c0 2.236.987 4.236 2.551 5.595.09.08.185.158.28.232.096-.074.189-.152.28-.232 1.563-1.359 2.551-3.359 2.551-5.595 0-2.235-.987-4.236-2.551-5.595-.09-.08-.184-.156-.28-.231z" />
    </svg>
  )
}

export function MetaIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" {...BASE} {...props}>
      <path d="M6.915 4.03c-1.968 0-3.683 1.28-4.871 3.113C.704 9.208 0 11.883 0 14.449c0 .706.07 1.369.21 1.973a6.624 6.624 0 0 0 .265.86 5.297 5.297 0 0 0 .371.761c.696 1.159 1.818 1.927 3.593 1.927 1.497 0 2.633-.671 3.965-2.444.76-1.012 1.144-1.626 2.663-4.32l.756-1.339.186-.325c.061.1.121.196.183.3l2.152 3.595c.724 1.21 1.665 2.556 2.47 3.314 1.046.987 1.992 1.22 3.06 1.22 1.075 0 1.876-.355 2.455-.843a3.743 3.743 0 0 0 .81-.973c.542-.939.861-2.127.861-3.745 0-2.72-.681-5.357-2.084-7.45-1.282-1.912-2.957-2.93-4.716-2.93-1.047 0-2.088.467-3.053 1.308-.652.57-1.257 1.29-1.82 2.05-.69-.875-1.335-1.547-1.958-2.056-1.182-.966-2.315-1.303-3.454-1.303zm10.16 2.053c1.147 0 2.188.758 2.992 1.999 1.132 1.748 1.647 4.195 1.647 6.4 0 1.548-.368 2.9-1.839 2.9-.58 0-1.027-.23-1.664-1.004-.496-.601-1.343-1.878-2.832-4.358l-.617-1.028a44.908 44.908 0 0 0-1.255-1.98c.07-.109.141-.224.211-.327 1.12-1.667 2.118-2.602 3.358-2.602zm-10.201.553c1.265 0 2.058.791 2.675 1.446.307.327.737.871 1.234 1.579l-1.02 1.566c-.757 1.163-1.882 3.017-2.837 4.338-1.191 1.649-1.81 1.817-2.486 1.817-.524 0-1.038-.237-1.383-.794-.263-.426-.464-1.13-.464-2.046 0-2.221.63-4.535 1.66-6.088.454-.687.964-1.226 1.533-1.533a2.264 2.264 0 0 1 1.088-.285z" />
    </svg>
  )
}

export function GoogleAnalyticsIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" {...BASE} {...props}>
      <path d="M22.84 2.9982v17.9987c.0086 1.6473-1.3197 2.9897-2.967 2.9984a2.9808 2.9808 0 01-.3677-.0208c-1.528-.226-2.6477-1.5558-2.6105-3.1V3.1204c-.0369-1.5458 1.0856-2.8762 2.6157-3.1 1.6361-.1915 3.1178.9796 3.3093 2.6158.014.1201.0208.241.0202.3619zM4.1326 18.0548c-1.6417 0-2.9726 1.331-2.9726 2.9726C1.16 22.6691 2.4909 24 4.1326 24s2.9726-1.3309 2.9726-2.9726-1.331-2.9726-2.9726-2.9726zm7.8728-9.0098c-.0171 0-.0342 0-.0513.0003-1.6495.0904-2.9293 1.474-2.891 3.1256v7.9846c0 2.167.9535 3.4825 2.3505 3.763 1.6118.3266 3.1832-.7152 3.5098-2.327.04-.1974.06-.3983.0593-.5998v-8.9585c.003-1.6474-1.33-2.9852-2.9773-2.9882z" />
    </svg>
  )
}

/**
 * Microsoft's four squares. Each one carries its own hover colour rather than
 * riding the chip's single `--brand` variable — the mark is polychrome by
 * definition, so monochrome-on-hover would read as a broken logo.
 */
export function MicrosoftIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 23 23" {...BASE} {...props}>
      <rect
        x="0"
        y="0"
        width="10.931"
        height="10.931"
        className="transition-colors duration-200 group-hover/chip:[fill:#F25022]"
      />
      <rect
        x="12.069"
        y="0"
        width="10.931"
        height="10.931"
        className="transition-colors duration-200 group-hover/chip:[fill:#7FBA00]"
      />
      <rect
        x="0"
        y="12.069"
        width="10.931"
        height="10.931"
        className="transition-colors duration-200 group-hover/chip:[fill:#00A4EF]"
      />
      <rect
        x="12.069"
        y="12.069"
        width="10.931"
        height="10.931"
        className="transition-colors duration-200 group-hover/chip:[fill:#FFB900]"
      />
    </svg>
  )
}
