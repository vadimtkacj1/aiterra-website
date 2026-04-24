import Link from 'next/link'
import HeaderAlt from '@/components/layout/HeaderAlt'
import Footer from '@/components/layout/Footer'
import DocumentEndSentinel from '@/components/layout/DocumentEndSentinel'

const gradientStyle: React.CSSProperties = {
  background: 'linear-gradient(92.63deg, #1B1BB3 14.57%, #530FAD 99.27%)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  backgroundClip: 'text',
}

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <HeaderAlt />
      <main
        dir="rtl"
        className="flex min-h-[70vh] flex-1 flex-col items-center justify-center px-6 py-20 text-center"
      >
        {/* Big 404 */}
        <p
          className="font-bold select-none leading-none"
          style={{
            ...gradientStyle,
            fontSize: 'clamp(120px, 20vw, 240px)',
            fontFamily: 'var(--font-brutalist)',
          }}
        >
          404
        </p>

        {/* Divider line */}
        <div
          className="mt-2 mb-8 h-px w-24"
          style={{ background: 'linear-gradient(92.63deg, #1B1BB3 14.57%, #530FAD 99.27%)' }}
        />

        <h1
          className="text-gray-900 font-bold mb-4 text-[20px] md:text-[32px]"
          style={{ fontFamily: 'var(--font-brutalist)' }}
        >
          הדף לא נמצא
        </h1>

        <p className="text-[14px] text-[#666] max-w-md mb-10 leading-relaxed">
          נראה שהדף שחיפשת לא קיים או הועבר למקום אחר. בואו נחזיר אתכם לנתיב הנכון.
        </p>

        <div className="flex flex-row gap-4 justify-center flex-wrap">
          <Link
            href="/contact"
            className="inline-flex items-center justify-center px-8 py-3 rounded-md font-bold text-sm transition-colors duration-200 border hover:bg-purple-50"
            style={{ borderColor: '#530FAD', color: '#530FAD' }}
          >
            צור קשר
          </Link>
          
          <Link
            href="/"
            className="inline-flex items-center justify-center px-8 py-3 rounded-md font-bold text-sm text-white transition-opacity duration-200 hover:opacity-85"
            style={{ background: 'linear-gradient(92.63deg, #1B1BB3 14.57%, #530FAD 99.27%)' }}
          >
            חזרה לעמוד הראשי
          </Link>

        </div>
      </main>
      <Footer />
      <DocumentEndSentinel />
    </div>
  )
}
