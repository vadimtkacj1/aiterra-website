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
    title: 'SEO אונ-פייג\'',
    description:
      'אופטימיזציה מלאה של דפי האתר – כותרות, מטא-תגים, מבנה URL, קישורים פנימיים ותוכן שמדבר בשפה של גוגל ושל הגולשים שלכם.',
  },
  {
    number: '02',
    title: 'SEO טכני',
    description:
      'בדיקה ותיקון של כל הבסיס הטכני: מהירות טעינה (Core Web Vitals), Crawlability, Sitemap, Schema Markup ונגישות מלאה לבוטים של גוגל.',
  },
  {
    number: '03',
    title: 'בניית קישורים (Link Building)',
    description:
      'רכישת קישורים איכותיים מאתרים סמכותיים בתחום שלכם. אסטרטגיית Off-Page שמגדילה את ה-Domain Authority ומשפרת את הדירוגים.',
  },
  {
    number: '04',
    title: 'אסטרטגיית תוכן SEO',
    description:
      'יצירת תוכן מבוסס מחקר מילות מפתח שמושך תנועה רלוונטית ומסייע למנוע מהמתחרים לעלות עליכם. תוכן שמוכר וגם מקדם.',
  },
]

export default function SeoServicesSection() {
  return (
    <section className="bg-white py-28 px-6" dir="rtl">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="mb-16 max-w-2xl">
          <p
            style={{ ...gradientText, fontWeight: 700, fontSize: '14px' }}
            className="mb-4"
          >
            מה אנחנו מבצעים
          </p>
          <h2
            className="text-gray-900 font-bold leading-tight"
            style={{ fontSize: 'clamp(20px, 5vw, 52px)', lineHeight: '1.1' }}
          >
            שירותי קידום אורגני
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
