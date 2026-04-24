import Image from 'next/image'
import Link from 'next/link'
import DocumentEndSentinel from '@/components/layout/DocumentEndSentinel'

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
        <p className="text-white text-center max-w-2xl px-6 text-[20px]">
          סוכנות שיווק דיגיטלי, בניית אתרים ופיתוח תוכנה. מגשרים על הפער בין טכנולוגיה מורכבת לצמיחה עסקית מדידה – AITERRA.
        </p>

        <div className="mt-6 flex items-center gap-3 text-white text-[20px]">
          <span>[כתובת]</span>
          <span className="opacity-40">|</span>
          <a href="mailto:info@aiterra.co.il" className="hover:text-blue-400 transition-colors">
            info@aiterra.co.il
          </a>
          <span className="opacity-40">|</span>
          <span>[אימייל]</span>
        </div>

        <p className="mt-4 text-white opacity-70 text-[18px]">
          © כל הזכויות שמורות ל-AITERRA.
        </p>

        <nav className="mt-12 w-full flex items-center justify-center gap-6 md:gap-10 px-6 flex-wrap">
          {navLinks.slice(0, 3).map((link) => (
            <Link key={link.label} href={link.href} className="text-white text-[14px] font-bold hover:opacity-70 transition-opacity">
              {link.label}
            </Link>
          ))}

          <Link href="/" className="mx-4">
            <Image src="/icons/white-logo.svg" alt="AITERRA" width={56} height={56} className="object-contain" />
          </Link>

          {navLinks.slice(3).map((link) => (
            <Link key={link.label} href={link.href} className="text-white text-[14px] font-bold hover:opacity-70 transition-opacity">
              {link.label}
            </Link>
          ))}
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
      <DocumentEndSentinel />
    </footer>
  )
}