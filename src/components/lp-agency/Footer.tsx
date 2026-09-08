import { FOOTER_LINKS, CONTACT_INFO } from '@/lib/lp-agency-content'

export default function Footer() {
  return (
    <footer className="bg-black py-12">
      <div className="container mx-auto px-4 max-w-lg">
        <div className="text-center mb-8 pb-8 border-b border-gray-800">
          <h3 className="text-2xl font-bold mb-3 text-white">AITERRA</h3>
          <p className="text-white text-sm" dir="rtl">
            בונים מערכות דיגיטל שמייצרות צמיחה אמיתית לעסקים.
          </p>
        </div>

        <div className="flex justify-between mb-8 pb-8 border-b border-gray-800">
          <div className="text-right" dir="rtl">
            <h4 className="text-lg font-bold mb-4 text-white">ניווט</h4>
            <nav className="flex flex-col gap-2">
              {FOOTER_LINKS.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="text-white hover:text-blue-400 transition"
                >
                  {link.label}
                </a>
              ))}
            </nav>
          </div>

          <div className="text-right" dir="rtl">
            <h4 className="text-lg font-bold mb-4 text-white">צור קשר</h4>
            <div className="space-y-2 text-white">
              <a href={CONTACT_INFO.phoneHref} className="block hover:text-blue-400 transition">
                {CONTACT_INFO.phone}
              </a>
              <a href={`mailto:${CONTACT_INFO.email}`} className="block hover:text-blue-400 transition">
                {CONTACT_INFO.email}
              </a>
              <p>{CONTACT_INFO.address}</p>
            </div>
          </div>
        </div>

        <div className="text-center">
          <p className="text-white text-sm" dir="rtl">
            © {new Date().getFullYear()} AITERRA. כל הזכויות שמורות.
          </p>
        </div>
      </div>
    </footer>
  );
}
