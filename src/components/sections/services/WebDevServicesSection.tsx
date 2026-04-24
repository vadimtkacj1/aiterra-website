import type React from 'react'

const gradientText: React.CSSProperties = {
  background: 'linear-gradient(92.63deg, #1B1BB3 14.57%, #530FAD 99.27%)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  backgroundClip: 'text',
  color: 'transparent',
}

const items = [
  {
    number: '01',
    title: 'אתר תדמית',
    description:
      'אתר ייצוגי שמדבר בשפה של המותג שלכם. עיצוב מקצועי, מהירות גבוהה וחוויית משתמש שמשאירה רושם.',
  },
  {
    number: '02',
    title: 'חנות וירטואלית (Ecommerce)',
    description:
      'פלטפורמת מכירות אונליין מלאה – ניהול קטלוג, עגלת קניות, תשלומים מאובטחים ואינטגרציה עם מערכות ERP.',
  },
  {
    number: '03',
    title: 'אתר וורדפרס',
    description:
      'בניית אתרי WordPress מהירים ומאובטחים עם תשתית קוד נקייה, CMS נוח לניהול עצמאי ותוספים מותאמים אישית.',
  },
  {
    number: '04',
    title: 'מערכות ואפליקציות',
    description:
      'פיתוח מערכות Full-Stack מורכבות, אפליקציות Web ו-Mobile, API-ים, אינטגרציות ופלטפורמות בהתאמה מלאה.',
  },
]

export default function WebDevServicesSection() {
  return (
    <section className="bg-white py-28 px-6" dir="rtl">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="mb-16 max-w-2xl">
          <p
            style={{ ...gradientText, fontWeight: 700, fontSize: '14px' }}
            className="mb-4"
          >
            מה אנחנו בונים
          </p>
          <h2
            className="text-gray-900 font-bold leading-tight"
            style={{ fontSize: 'clamp(32px, 5vw, 52px)', lineHeight: '1.1' }}
          >
            פתרונות בניית אתרים
            <br />
            לכל סוג עסק
          </h2>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-gray-200">
          {items.map((item) => (
            <div
              key={item.number}
              className="bg-white px-10 py-10 flex flex-col gap-4 group hover:bg-gray-50 transition-colors"
            >
              <span
                style={{ ...gradientText, fontWeight: 700, fontSize: '13px', letterSpacing: '0.1em' }}
              >
                {item.number}
              </span>
              <h3 className="text-gray-900 font-bold text-[22px] leading-snug">
                {item.title}
              </h3>
              <p className="text-gray-500 text-[14px] leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}
