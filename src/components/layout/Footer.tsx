import Image from 'next/image'
import Link from 'next/link'
import { CONTACT_EMAIL } from '@/lib/contact'
import { services } from '@/data/services'

const navLinks = [
  { label: 'ראשי', href: '/' },
  { label: 'שירותים', href: '/services' },
  { label: 'בלוג', href: '/blog' },
  { label: 'תיק עבודות', href: '/portfolio' },
  { label: 'אודותינו', href: '/about' },
  { label: 'צור קשר', href: '/contact' },
]

const legalLinks = [
  { label: 'מדיניות פרטיות', href: '/privacy-policy' },
  { label: 'תקנון ותנאי שימוש', href: '/terms-of-use' },
  { label: 'הצהרת נגישות', href: '/accessibility-statement' },
]

export default function Footer() {
  return (
    <footer dir="rtl" className="relative z-60 overflow-hidden bg-[#0F0F2D]">
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/footer/footer-bg-v2.webp"
          alt=""
          fill
          loading="lazy"
          className="object-cover"
        />
      </div>

      <div className="relative z-10 flex flex-col items-center pt-16">
        <p className="text-white text-center max-w-2xl px-6 text-[15px] md:text-[20px]">
          סוכנות שיווק דיגיטלי, בניית אתרים ופיתוח תוכנה. מגשרים על הפער בין טכנולוגיה מורכבת לצמיחה עסקית מדידה – AITERRA.
        </p>

        <div className="mt-6 flex items-center justify-center text-white text-[14px] md:text-[17px] px-6 text-center">
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
                <Link key={link.label} href={link.href} prefetch={false} className="text-white text-[14px] font-bold hover:opacity-70 transition-opacity whitespace-nowrap">
                  {link.label}
                </Link>
              ))}
            </div>
            {/* Mobile: 2 links right side */}
            <div className="flex md:hidden gap-6">
              {navLinks.slice(0, 2).map((link) => (
                <Link key={link.label} href={link.href} prefetch={false} className="text-white text-[14px] font-bold hover:opacity-70 transition-opacity whitespace-nowrap">
                  {link.label}
                </Link>
              ))}
            </div>

<Link href="/" className="md:mx-4 shrink-0">
  <Image 
    src="/icons/white-logo-v2.svg" 
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
                <Link key={link.label} href={link.href} prefetch={false} className="text-white text-[14px] font-bold hover:opacity-70 transition-opacity whitespace-nowrap">
                  {link.label}
                </Link>
              ))}
            </div>
            {/* Mobile: 2 links left side */}
            <div className="flex md:hidden gap-6">
              {navLinks.slice(2, 4).map((link) => (
                <Link key={link.label} href={link.href} prefetch={false} className="text-white text-[14px] font-bold hover:opacity-70 transition-opacity whitespace-nowrap">
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

        {/* Service sub-pages — sitewide crawlable links so each /services/* page
            earns internal equity beyond the single homepage link (they had no
            sitewide link before, which kept them "Discovered – not indexed"). */}
        <nav className="mt-8 flex flex-wrap justify-center gap-x-6 gap-y-3 px-6" aria-label="שירותים" dir="rtl">
          {services.map((s) => (
            <Link
              key={s.slug}
              href={`/services/${s.slug}`}
              prefetch={false}
              className="text-white/70 text-[13px] md:text-[14px] font-medium hover:text-white transition-colors whitespace-nowrap"
            >
              {s.title}
            </Link>
          ))}
        </nav>

        <div className="mt-8 flex justify-center gap-8">
          {legalLinks.map((link) => (
            <Link key={link.href} href={link.href} prefetch={false} className="text-white/70 text-[13px] hover:text-white transition-colors">
              {link.label}
            </Link>
          ))}
        </div>

        <div className="mt-10 w-full leading-[0]">
          <Image
            src="/images/footer/footer-aiterra.webp"
            alt="AITERRA"
            width={2724}
            height={604}
            className="w-full h-auto object-contain translate-y-[1px]"
            style={{ mixBlendMode: 'lighten' }}
            unoptimized
          />
        </div>
      </div>
    </footer>
  )
}