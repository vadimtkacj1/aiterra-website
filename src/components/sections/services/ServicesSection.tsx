'use client'

import Image from 'next/image'
import Link from 'next/link'

const services = [
  {
    upperTitle: 'בניית אתר לעסק, חנויות וירטואליות ופיתוח אפליקציות',
    title: 'בניית אתרים ופיתוח מערכות בהתאמה אישית',
    description:
      'האתר הוא כלי המכירות המרכזי שלכם. אנחנו מתמחים בשירותי בניית אתרים איכותיים – החל מהקמת אתר תדמית מרהיב, דרך בניית אתר מכירות (איקומרס), ועד בניית אתר וורדפרס ופיתוח מערכות מורכבות. אנו שמים דגש על ארכיטקטורת קוד נקייה, מהירות טעינה קיצונית (Core Web Vitals) ועיצוב שמניע לפעולה.',
    image: '/images/services/service1.png',
    href: '/services/web-development',
    cta: 'כפתור קישור פנימי',
  },
  {
    upperTitle: 'ניהול קמפיינים, פרסום ממומן ואוטומציה עסקית',
    title: 'קידום ממומן בגוגל וברשתות החברתיות',
    description:
      'כדי להשיג לידים כאן ועכשיו, אתם זקוקים לאסטרטגיית פרסום ממומן מנצחת. אנו מנהלים תקציבי שיווק ממומן בפלטפורמות המובילות (גוגל אדס, פייסבוק, אינסטגרם וטיקטוק) עם דגש קפדני על החזר השקעה (ROI). כל קמפיין מחובר במערכת אוטומציה ישירות ל-CRM שלכם לעבודה חלקה וללא מאמץ ידני.',
    image: '/images/services/service2.png',
    href: '/services/automation',
    cta: 'כפתור קישור פנימי',
  },
  {
    upperTitle: 'קידום seo מבוסס מחקר מילות מפתח עמוק',
    title: 'קידום אתרים אורגני בגוגל',
    description:
      'מה שווה אתר מדהים אם לא מוצאים אותו? שירות קידום אורגני נועד למקם אתכם בראש תוצאות החיפוש של גוגל. התהליך שלנו כולל אופטימיזציה טכנית, בניית קישורים ואסטרטגיית תוכן חכמה שמביאה תנועה אורגנית יציבה שמייצרת לכם הכנסה לטווח הארוך.',
    image: '/images/services/service3.png',
    href: '/services/seo',
    cta: 'כפתור קישור פנימי',
  },
  {
    upperTitle: 'ניהול קמפיין ממומן ב-Google Ads, Facebook, Instagram ו-TikTok',
    title: 'קידום אתרים אורגני בגוגל',
    description:
      'כדי להשיג תוצאות כאן ועכשיו, אתם צריכים אסטרטגיית קידום ממומן חכמה. כחלק מהיותנו חברת שיווק מובילה, אנו מנהלים תקציבי פרסום גדולים תוך דגש על החזר השקעה (ROI) חיובי.',
    image: '/images/services/service4.png',
    href: '/services/adv',
    cta: 'למידע נוסף על ניהול קמפיינים ו-PPC',
  },
]
export default function ServicesSection() {
  return (
    <section className="md:pb-32" dir="rtl">
      <div className="max-w-full mx-auto relative">
        <div className="flex flex-col">
          {services.map((service, index) => (
            <div
              key={index}
              // ה-sticky חוזר כאן עם חישוב ה-top
              className="sticky flex flex-col md:flex-row-reverse w-full bg-white overflow-hidden "
              style={{ top: `${index * 40}px` }} 
            >
              {/* Image side - גובה מוקטן במובייל כדי שהטקסט לא ייחתך */}
              <div className="relative w-full md:w-[710px] h-[230px] md:h-[765px] shrink-0">
                <Image
                  src={service.image}
                  alt={service.title}
                  fill
                  className="object-cover"
                />
              </div>

              {/* Text side */}
              <div className="relative flex flex-col flex-1 bg-white px-6 py-8 md:px-24 md:py-16 text-right">
                
                {/* Upper Text */}
                <div className="w-full mb-4 md:mb-20">
                  <span className="text-[14px] font-medium text-gray-500 block">
                    {service.upperTitle}
                  </span>
                </div>

                <div className="my-auto">
                  {/* Title: 20px Mobile / 48px Desktop */}
                  <h3 className="text-[20px] md:text-[48px] leading-[1.2] font-black text-[#3b28cc] mb-4 md:mb-8 max-w-[500px]">
                    {service.title}
                  </h3>

                  {/* Description: 14px */}
                  <p className="text-gray-600 text-[14px] leading-relaxed mb-8 md:mb-12 max-w-[480px]">
                    {service.description}
                  </p>

                  {/* Button: 14px */}
                  <Link
                    href={service.href}
                    className="inline-block border border-[#3b28cc] text-[#3b28cc] text-[14px] px-10 py-3 hover:bg-[#3b28cc] hover:text-white transition-all duration-300 font-bold"
                  >
                    {service.cta}
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}