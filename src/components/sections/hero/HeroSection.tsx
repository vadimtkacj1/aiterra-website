import AiterraWordmark from '@/components/ui/AiterraWordmark'
import HeroCTAButtons from '@/components/ui/HeroCTAButtons'
import Hero3DWrapper from '@/components/ui/Hero3DWrapper'

export default function HeroSection() {
  return (
    <section 
      className="relative bg-white min-h-screen flex flex-col overflow-x-hidden z-10" 
      dir="rtl"
    >
      <div className="relative lg:absolute lg:inset-y-0 lg:left-0 w-full lg:w-[55%] h-[75vh] md:h-[60vh] lg:h-full z-10 pointer-events-none flex justify-center lg:block lg:-translate-y-40 -my-16 lg:my-0 max-lg:mt-0">
        <div className="w-full h-full flex justify-center items-center lg:translate-x-0 max-lg:translate-y-8">
          <Hero3DWrapper />
        </div>
      </div>

      <div className="relative mx-auto px-6 w-full flex-1 flex items-center justify-start z-20 pb-10 lg:pb-0">
        <div className="w-full lg:w-1/2 flex flex-col gap-8 text-right lg:mr-0 lg:ml-auto lg:pt-40 max-lg:mt-6">
          <h1
            style={{ fontWeight: 700, lineHeight: '110%' }}
            className="text-[17px] md:text-[48px] text-gray-900"
          >
            AITERRA: סוכנות שיווק ופיתוח
          </h1>

          <p className="text-[12px] md:text-[16px] text-gray-600 leading-relaxed max-w-xl md:pr-[40px]">
            מערכת 360° לצמיחה עסקית. ב-AITERRA אנחנו מחברים טכנולוגיית קצה לתוצאות בשטח. משלב האסטרטגיה ועד עיצוב אתרים (UI/UX), פיתוח מערכות, קיдום אורגני (SEO) וניהול קיдום ממומן – אנחנו הופכים את הנכס הדיגיטлі שלכם למנוע רווח עוצמתי.
          </p>

          <HeroCTAButtons className="flex flex-row flex-wrap gap-4 mt-4 justify-start md:pr-[40px]" />
        </div>
      </div>

      <div className="sticky bottom-0 left-0 w-full z-30 pointer-events-none select-none pb-4">
         <div className="w-full flex justify-center transform lg:translate-y-0 translate-y-2">
            <AiterraWordmark />
         </div>
      </div>
    </section>
  )
}