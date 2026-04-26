import Image from 'next/image'
import Link from 'next/link'
import { CONTACT_EMAIL, OFFICE_ADDRESS_EN } from '@/lib/contact'

const navLinks = [
  { label: 'ראשי', href: '/' },
  { label: 'שירותים', href: '/services' },
  { label: 'חבילות', href: '/packages' },
  { label: 'תיק עבודות', href: '/portfolio' },
  { label: 'אודותינו', href: '/about' },
  { label: 'תפריט', href: '#' },
]

export default function Footer() {
  return (
    <footer dir="rtl" className="relative z-60 overflow-hidden bg-[#0F0F2D]">
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/footer/footer-bg.png"
          alt=""
          fill
          className="object-cover"
          priority
        />
      </div>

      <div className="relative z-10 flex flex-col items-center pt-16">
        <p className="text-white text-center max-w-2xl px-6 text-[15px] md:text-[20px]">
          סוכנות שיווק דיגיטלי, בניית אתרים ופיתוח תוכנה. מגשרים על הפער בין טכנולוגיה מורכבת לצמיחה עסקית מדידה – AITERRA.
        </p>

        <div className="mt-6 flex flex-col md:flex-row items-center justify-center gap-2 md:gap-4 text-white text-[14px] md:text-[17px] px-6 text-center">
          <span className="max-w-xl leading-snug" dir="ltr">
            {OFFICE_ADDRESS_EN}
          </span>
          <span className="hidden md:inline opacity-40 select-none" aria-hidden>
            |
          </span>
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="hover:text-blue-400 transition-colors shrink-0"
            dir="ltr"
          >
            {CONTACT_EMAIL}
          </a>
        </div>

        <p className="mt-6 text-white opacity-70 text-[13px] md:text-[16px]">
          © כל הזכויות שמורות ל-AITERRA.
        </p>

        <nav className="mt-12 w-full px-6">
          {/* Row 1: 2|logo|2 on mobile, 3|logo|3 on desktop */}
          <div className="flex items-center justify-center gap-6 md:gap-10">
            {/* Desktop: 3 links right side */}
            <div className="hidden md:flex gap-10">
              {navLinks.slice(0, 3).map((link) => (
                <Link key={link.label} href={link.href} className="text-white text-[14px] font-bold hover:opacity-70 transition-opacity whitespace-nowrap">
                  {link.label}
                </Link>
              ))}
            </div>
            {/* Mobile: 2 links right side */}
            <div className="flex md:hidden gap-6">
              {navLinks.slice(0, 2).map((link) => (
                <Link key={link.label} href={link.href} className="text-white text-[14px] font-bold hover:opacity-70 transition-opacity whitespace-nowrap">
                  {link.label}
                </Link>
              ))}
            </div>

<Link href="/" className="md:mx-4 shrink-0">
  <Image 
    src="/icons/white-logo.svg" 
    alt="AITERRA" 
    width={80} 
    height={80} 
    className="object-contain w-12 h-12 md:w-20 md:h-20" 
    unoptimized 
  />
</Link>
            {/* Desktop: 3 links left side */}
            <div className="hidden md:flex gap-10">
              {navLinks.slice(3).map((link) => (
                <Link key={link.label} href={link.href} className="text-white text-[14px] font-bold hover:opacity-70 transition-opacity whitespace-nowrap">
                  {link.label}
                </Link>
              ))}
            </div>
            {/* Mobile: 2 links left side */}
            <div className="flex md:hidden gap-6">
              {navLinks.slice(2, 4).map((link) => (
                <Link key={link.label} href={link.href} className="text-white text-[14px] font-bold hover:opacity-70 transition-opacity whitespace-nowrap">
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Row 2: 2 remaining links, mobile only */}
          <div className="flex md:hidden justify-center gap-8 mt-5">
            {navLinks.slice(4).map((link) => (
              <Link key={link.label} href={link.href} className="text-white text-[14px] font-bold hover:opacity-70 transition-opacity whitespace-nowrap">
                {link.label}
              </Link>
            ))}
          </div>
        </nav>

        <div className="mt-10 w-full leading-[0]">
          <Image
            src="/images/footer/footer-aiterra.png"
            alt="AITERRA"
            width={1920}
            height={400}
            className="w-full h-auto object-contain translate-y-[1px]"
            style={{ mixBlendMode: 'lighten' }}
          />
        </div>
      </div>
    </footer>
  )
}