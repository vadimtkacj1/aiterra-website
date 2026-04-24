import AiterraWordmark from '@/components/ui/AiterraWordmark'
import HeroCTAButtons from '@/components/ui/HeroCTAButtons'

export default function AboutHeroSection() {
  return (
    <section className="relative overflow-hidden bg-white min-h-[90vh] flex flex-col" dir="rtl">
      <div className="max-w-7xl mx-auto px-6 w-full flex-1 flex items-center justify-center">
        <div className="flex flex-col items-center text-center gap-6 py-16 max-w-4xl w-full">

          {/* Label */}
          <p
            style={{
              background: 'linear-gradient(92.63deg, #1B1BB3 14.57%, #530FAD 99.27%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              fontFamily: "'Heebo', sans-serif",
            }}
            className="text-[16px] font-[700]"
          >
            המוטו שלנו:
          </p>

          {/* Main Title */}
          <h1
            style={{ fontWeight: 700, fontSize: '64px', lineHeight: '1.1', letterSpacing: '-0.02em' }}
            className="text-gray-900 font-sans"
          >
            {'"'}AITERRA: טכנולוגיה שבונה אתרים.
            <br />
            אסטרטגיה שבונה עסקים.{'"'}
          </h1>

          {/* Subtext */}
          <p className="text-[18px] text-gray-900 font-[500] leading-relaxed max-w-3xl">
מערכת 360° לצמיחה עסקית בדיגיטל. אנו ב-AITERRA מגשרים על הפער בין טכנולוגיה מורכבת לתוצאות עסקיות בשטח. משלב האסטרטגיה וה-UX ועד פיתוח מערכות סקילביליות, קידום אורגני (SEO) וניהול קמפיינים ממומנים – אנחנו הופכים את הנכס הדיגיטלי שלך למנוע צמיחה עוצמתי          </p>

          {/* Buttons */}
          <HeroCTAButtons className="flex gap-4 mt-6 justify-center" />
        </div>
      </div>

      {/* Large AITERRA wordmark */}
      <AiterraWordmark height={400} priority className="flex justify-center mt-auto" />
    </section>
  )
}