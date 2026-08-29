type IconProps = {
  className?: string
}

export function PlusIcon({ className }: IconProps) {
  return (
    <svg className={className} width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <path d="M7 1.6v10.8M1.6 7h10.8" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  )
}

export function ChevronDownIcon({ className }: IconProps) {
  return (
    <svg className={className} width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
      <path d="M2.75 4.5 6 7.75 9.25 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function ChevronPrevIcon({ className }: IconProps) {
  return (
    <svg className={className} width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <path d="M8.5 2.5 4 7l4.5 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function ChevronNextIcon({ className }: IconProps) {
  return (
    <svg className={className} width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <path d="M5.5 2.5 10 7l-4.5 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function BurgerIcon({ className }: IconProps) {
  return (
    <span className={className} aria-hidden="true">
      <span />
      <span />
    </span>
  )
}

export function SparkIcon({ className }: IconProps) {
  return (
    <svg className={className} width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <path
        d="M9 1.5 10.6 6.2 15.3 7.8 10.6 9.4 9 14.1 7.4 9.4 2.7 7.8 7.4 6.2 9 1.5Z"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function PlayIcon({ className }: IconProps) {
  return (
    <svg className={className} width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path d="M7 4.5v11l9-5.5-9-5.5Z" fill="currentColor" />
    </svg>
  )
}

export function FacebookIcon({ className }: IconProps) {
  return (
    <svg className={className} width="22" height="22" viewBox="0 0 24 24" aria-hidden="true">
      <path
        fillRule="evenodd"
        d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm1.4 18.3v-6.4h2.1l.4-2.6h-2.5V9.7c0-.7.2-1.3 1.3-1.3h1.3V6.1c-.3 0-1-.1-1.9-.1-1.9 0-3.3 1.2-3.3 3.4v1.9H8.7v2.6h2.1v6.4h2.6Z"
        fill="currentColor"
      />
    </svg>
  )
}

export function InstagramIcon({ className }: IconProps) {
  return (
    <svg className={className} width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="5" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="17.2" cy="6.8" r="1.15" fill="currentColor" />
    </svg>
  )
}

export function CrossMark({ className }: IconProps) {
  return (
    <svg className={className} width="7" height="7" viewBox="0 0 7 7" aria-hidden="true">
      <path
        d="M0 3.5h7M3.5 0v7"
        stroke="var(--v2-cross)"
        strokeWidth="1"
        shapeRendering="crispEdges"
      />
    </svg>
  )
}

export function GoogleGlyph({ className }: IconProps) {
  return (
    <svg className={className} width="30" height="30" viewBox="0 0 48 48" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65Z"
      />
      <path
        fill="#34A853"
        d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48Z"
      />
      <path
        fill="#FBBC05"
        d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19Z"
      />
      <path
        fill="#EA4335"
        d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5Z"
      />
    </svg>
  )
}

export function StarIcon({ className }: IconProps) {
  return (
    <svg className={className} width="14" height="14" viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="currentColor"
        d="M12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21 12 17.27Z"
      />
    </svg>
  )
}

export function QuoteMark({ className }: IconProps) {
  const mark =
    'M0 3a3 3 0 0 1 3-3h7a3 3 0 0 1 3 3v5.4c0 5.6-3.4 9.5-8.8 11.6L2.5 16.7c3-1.4 4.7-3.2 5.1-5.7H3a3 3 0 0 1-3-3V3Z'

  return (
    <svg className={className} width="30" height="20" viewBox="0 0 30 20" aria-hidden="true">
      <path fill="currentColor" d={mark} />
      <path fill="currentColor" d={mark} transform="translate(17)" />
    </svg>
  )
}

export function ShareIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <circle cx="12" cy="3.5" r="2" stroke="currentColor" strokeWidth="1.4" />
      <circle cx="4" cy="8" r="2" stroke="currentColor" strokeWidth="1.4" />
      <circle cx="12" cy="12.5" r="2" stroke="currentColor" strokeWidth="1.4" />
      <path d="M5.8 7L10.2 4.5M5.8 9l4.4 2.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  )
}

export function MailIcon({ className }: IconProps) {
  return (
    <svg className={className} width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
      <rect x="2.4" y="4.6" width="17.2" height="12.8" rx="3" stroke="currentColor" strokeWidth="1.7" />
      <path d="m4.6 7.6 5.5 4.2a1.5 1.5 0 0 0 1.8 0l5.5-4.2" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function PhoneIcon({ className }: IconProps) {
  return (
    <svg className={className} width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
      <path
        d="M8.1 3.4c.5 0 .9.3 1.1.7l1.2 2.6c.2.5.1 1-.3 1.4l-1 1a11 11 0 0 0 4.1 4.1l1-1c.4-.4.9-.5 1.4-.3l2.6 1.2c.4.2.7.6.7 1.1v2.2c0 1-.8 1.8-1.8 1.7A15.5 15.5 0 0 1 3.3 5.2c0-1 .7-1.8 1.7-1.8h3.1Z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function PinIcon({ className }: IconProps) {
  return (
    <svg className={className} width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
      <path d="M11 19.5c3.6-3.5 6-6.6 6-9.7a6 6 0 1 0-12 0c0 3.1 2.4 6.2 6 9.7Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
      <circle cx="11" cy="9.6" r="2.4" stroke="currentColor" strokeWidth="1.7" />
    </svg>
  )
}

export function GoogleMapsMark({ className }: IconProps) {
  return (
    <svg className={className} width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path d="M10 19c4-4.7 6.2-8 6.2-11A6.2 6.2 0 0 0 3.8 8c0 3 2.2 6.3 6.2 11Z" fill="#EA4335" />
      <path d="M5.2 4.3 9 8.6l4.6-5.3A6.2 6.2 0 0 0 5.2 4.3Z" fill="#FBBC04" />
      <circle cx="10" cy="8" r="2.3" fill="#ffffff" />
    </svg>
  )
}

export function WazeMark({ className }: IconProps) {
  return (
    <svg className={className} width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
      <path
        d="M11 2.7c4.3 0 7.5 2.9 7.5 6.7 0 1-.2 1.7-.5 2.5-.4 1-.3 1.6.2 2.2.5.6.3 1.4-.5 1.6-1.6.4-3.4.6-5 .6H7.2a3.3 3.3 0 0 1-3.3-3.3V9.4c0-3.8 3-6.7 7.1-6.7Z"
        fill="currentColor"
      />
      <circle cx="8.6" cy="8.9" r="1.15" fill="#33CCFF" />
      <circle cx="13.4" cy="8.9" r="1.15" fill="#33CCFF" />
      <path d="M8.4 12.1a3.1 3.1 0 0 0 5.2 0" stroke="#33CCFF" strokeWidth="1.3" strokeLinecap="round" fill="none" />
      <circle cx="7.4" cy="17.7" r="1.7" fill="currentColor" />
      <circle cx="14.3" cy="17.7" r="1.7" fill="currentColor" />
    </svg>
  )
}

export function OrdersIcon({ className }: IconProps) {
  return (
    <svg className={className} width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path
        d="M6.4 3.6h7.2c.8 0 1.4.6 1.4 1.4v10.4c0 .8-.6 1.4-1.4 1.4H6.4c-.8 0-1.4-.6-1.4-1.4V5c0-.8.6-1.4 1.4-1.4Z"
        stroke="currentColor"
        strokeWidth="1.3"
      />
      <path d="M8 2.6h4v2.2H8z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
      <path d="m7.8 11 1.4 1.4 3-3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function ClubIcon({ className }: IconProps) {
  return (
    <svg className={className} width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <circle cx="10" cy="8" r="6.2" stroke="currentColor" strokeWidth="1.3" />
      <path
        d="M10 5.2l1 2.1 2.3.3-1.7 1.6.4 2.3-2-1.1-2 1.1.4-2.3-1.7-1.6 2.3-.3 1-2.1Z"
        stroke="currentColor"
        strokeWidth="1.1"
        strokeLinejoin="round"
      />
      <path d="M7.4 14.2 6.6 18l3.4-1.7L13.4 18l-.8-3.8" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
    </svg>
  )
}

export function SalesIcon({ className }: IconProps) {
  return (
    <svg className={className} width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <circle cx="10" cy="10" r="7.2" stroke="currentColor" strokeWidth="1.3" />
      <circle cx="10" cy="10" r="3.4" stroke="currentColor" strokeWidth="1.3" />
      <path d="M10 10 15.6 4.4M13.2 4.4h2.4v2.4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function CatalogIcon({ className }: IconProps) {
  return (
    <svg className={className} width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <rect x="2.8" y="2.8" width="6" height="6" rx="1.4" stroke="currentColor" strokeWidth="1.3" />
      <rect x="11.2" y="2.8" width="6" height="6" rx="1.4" stroke="currentColor" strokeWidth="1.3" />
      <rect x="2.8" y="11.2" width="6" height="6" rx="1.4" stroke="currentColor" strokeWidth="1.3" />
      <rect x="11.2" y="11.2" width="6" height="6" rx="1.4" stroke="currentColor" strokeWidth="1.3" />
    </svg>
  )
}

export function AnalyticsIcon({ className }: IconProps) {
  return (
    <svg className={className} width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path d="M3 16.6h14" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
      <path d="M5.6 13.4v-3M9.4 13.4V7.6M13.2 13.4V9.8M17 13.4V4.8" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  )
}

export function StorefrontIcon({ className }: IconProps) {
  return (
    <svg className={className} width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path d="M4.2 3.2h11.6l1.4 4.4H2.8l1.4-4.4Z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
      <path d="M3.8 7.6v8.2c0 .6.5 1 1 1h10.4c.6 0 1-.4 1-1V7.6" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
      <path d="M8.2 16.8v-4.4h3.6v4.4" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
    </svg>
  )
}

export function ProductsIcon({ className }: IconProps) {
  return (
    <svg className={className} width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path
        d="M5.4 6.6h9.2l.8 9.2c.06.7-.5 1.3-1.2 1.3H5.8c-.7 0-1.26-.6-1.2-1.3l.8-9.2Z"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinejoin="round"
      />
      <path d="M7.6 8.4V5.8a2.4 2.4 0 0 1 4.8 0v2.6" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  )
}

export function InventoryIcon({ className }: IconProps) {
  return (
    <svg className={className} width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path d="M10 2.8 16.8 6v8L10 17.2 3.2 14V6L10 2.8Z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
      <path d="m3.2 6 6.8 3.2L16.8 6M10 9.2v8" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
    </svg>
  )
}

export function AutomationIcon({ className }: IconProps) {
  return (
    <svg className={className} width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <circle cx="5.2" cy="5" r="2.2" stroke="currentColor" strokeWidth="1.3" />
      <circle cx="14.8" cy="5" r="2.2" stroke="currentColor" strokeWidth="1.3" />
      <circle cx="10" cy="15" r="2.2" stroke="currentColor" strokeWidth="1.3" />
      <path
        d="M7.4 5h5.2M5.2 7.2v3.2c0 1.3 1 2.4 2.4 2.4h.6M14.8 7.2v3.2c0 1.3-1 2.4-2.4 2.4h-.6"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
      />
    </svg>
  )
}

export function ReportIcon({ className }: IconProps) {
  return (
    <svg className={className} width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path d="M5 2.8h6.4L15.6 7v10.2H5V2.8Z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
      <path d="M11.2 2.8V7h4.4" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
      <path d="M7.8 14.4v-2.6M10.4 14.4v-4.2M13 14.4v-1.6" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  )
}

export function ShippingIcon({ className }: IconProps) {
  return (
    <svg className={className} width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path
        d="M2.6 3.4h1.9l1.7 8.4c.12.6.64 1 1.25 1h6.8c.6 0 1.13-.4 1.24-1l.91-4.9H5.3"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="8.4" cy="16" r="1.3" stroke="currentColor" strokeWidth="1.3" />
      <circle cx="13.8" cy="16" r="1.3" stroke="currentColor" strokeWidth="1.3" />
    </svg>
  )
}

export function AlertsIcon({ className }: IconProps) {
  return (
    <svg className={className} width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path
        d="M10 3a4.6 4.6 0 0 1 4.6 4.6v3.1l1.3 2.5H4.1l1.3-2.5V7.6A4.6 4.6 0 0 1 10 3Z"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinejoin="round"
      />
      <path d="M8.3 15.4a1.8 1.8 0 0 0 3.4 0" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  )
}

export function SupportIcon({ className }: IconProps) {
  return (
    <svg className={className} width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path d="M4.2 11.4V9.8a5.8 5.8 0 0 1 11.6 0v1.6" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
      <rect x="2.6" y="10.4" width="3.2" height="4.6" rx="1.4" stroke="currentColor" strokeWidth="1.3" />
      <rect x="14.2" y="10.4" width="3.2" height="4.6" rx="1.4" stroke="currentColor" strokeWidth="1.3" />
      <path d="M15.6 15v.6a2 2 0 0 1-2 2h-2.2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  )
}

export function StoresIcon({ className }: IconProps) {
  return (
    <svg className={className} width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <rect x="2.6" y="3.4" width="9.4" height="7.2" rx="1.4" stroke="currentColor" strokeWidth="1.3" />
      <path d="M8 13.4h9.4v3.2H8z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
      <path d="M14.4 10.6V6.4c0-.6-.4-1-1-1h-1.4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  )
}

export function TailorIcon({ className }: IconProps) {
  return (
    <svg className={className} width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path
        d="M3.2 5.4h2.4M9.8 5.4h7M3.2 10h5.6M13 10h3.8M3.2 14.6h1.6M9 14.6h7.8"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
      />
      <circle cx="7.7" cy="5.4" r="1.9" stroke="currentColor" strokeWidth="1.3" />
      <circle cx="10.9" cy="10" r="1.9" stroke="currentColor" strokeWidth="1.3" />
      <circle cx="6.9" cy="14.6" r="1.9" stroke="currentColor" strokeWidth="1.3" />
    </svg>
  )
}

export function ApiIcon({ className }: IconProps) {
  return (
    <svg className={className} width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path
        d="M7.6 3.6c-1.7 0-2.5.8-2.5 2.3v2c0 1.1-.6 1.7-1.7 1.7v.8c1.1 0 1.7.6 1.7 1.7v2c0 1.5.8 2.3 2.5 2.3"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12.4 3.6c1.7 0 2.5.8 2.5 2.3v2c0 1.1.6 1.7 1.7 1.7v.8c-1.1 0-1.7.6-1.7 1.7v2c0 1.5-.8 2.3-2.5 2.3"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function ManagerIcon({ className }: IconProps) {
  return (
    <svg className={className} width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <circle cx="7.8" cy="7" r="2.8" stroke="currentColor" strokeWidth="1.3" />
      <path d="M2.8 16.4c0-2.6 2.2-4.4 5-4.4s5 1.8 5 4.4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
      <path
        d="M13.6 4.6a2.7 2.7 0 0 1 0 5.2M14.6 12.4c1.7.5 2.6 1.9 2.6 4"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
      />
    </svg>
  )
}

export function TrainingIcon({ className }: IconProps) {
  return (
    <svg className={className} width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path
        d="M3.4 4h4c1.4 0 2.6 1 2.6 2.3v9.4c0-.9-1-1.5-2.2-1.5H3.4V4Z"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinejoin="round"
      />
      <path
        d="M16.6 4h-4C11.2 4 10 5 10 6.3v9.4c0-.9 1-1.5 2.2-1.5h4.4V4Z"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinejoin="round"
      />
    </svg>
  )
}
