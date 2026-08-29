import type { ReactElement } from 'react'

const stats = [
  {
    value: '99.9%',
    label: 'זמינות ותקינות מערכות',
    description:
      'הבטחת רציפות דיגיטלית מלאה וביצועי שרת אופטימליים (Uptime). כדי שהעסק שלך יעבוד עבורך מסביב לשעון ללא תקלות טכניות.',
  },
  {
    value: '100%',
    label: 'לקוחות מרוצים',
    description:
      'מחויבות טוטאלית להצלחת הפרויקט. אנחנו פועלים כשותף צמיחה דיגיטלי מלא, תוך ליווי אישי ושקיפות מוחלטת לאורך כל הדרך.',
  },
  {
    value: '95+',
    label: 'מהירות טעינה וביצועים',
    description:
      'ציון Performance ממוצע בכלי המדידה של Google. אנחנו בונים תשתיות קוד רזות וחכמות שמעניקות יתרון משמעותי בדירוג ה-SEO ובחוויית המשתמש',
  },
  {
    value: '16',
    label: 'קמפיינים ממומנים פעילים',
    description:
      'ניהול ואופטימיזציה בזמן אמת של זירות פרסום מורכבות, תוך שימוש באסטרטגיות מבוססות דאטה להשגת החזר השקעה מקסימלי (ROAS)',
  },
]

const gradientNumberStyle: React.CSSProperties = {
  fontFamily: "'Google Sans', sans-serif",
  fontWeight: 400,
  // scales with the viewport so '99.9%' never wraps inside a narrow column
  fontSize: 'clamp(48px, 5.5vw, 84px)',
  lineHeight: '1',
  whiteSpace: 'nowrap',
  // keep '95+' / '99.9%' in LTR digit order inside the RTL section
  direction: 'ltr',
  background: 'linear-gradient(92.63deg, #2447D6 14.57%, #3E96F9 99.27%)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  backgroundClip: 'text',
}

export default function StatsSection(): ReactElement {
  return (
    <section className="bg-white py-16 md:py-24" dir="rtl">

      <div className="px-0 md:px-6">
        
        <div className="mb-12 md:mb-16 text-right px-6 md:px-0">
          <h2 className="text-[20px] md:text-5xl font-bold leading-tight mb-6 text-[#0A0A0A]">
            אודות AITERRA – חברת בניית
            <br />
            אתרים וסוכנות שיווק מובילה
          </h2>
<p className="text-[#626262] text-sm md:text-base leading-relaxed max-w-3xl md:mr-[40px]">            בעולם התחרותי של היום, {'"'}רק אתר{'"'} זה לא מספיק. AITERRA הוקמה במטרה לספק מעטפת הוליסטית:
            מביסוס תשתית טכנולוגית חזקה ועד להבאת תנועת לקוחות משלמים. הצוות שלנו מורכב ממפתחי קוד
            מוכשרים, מעצבי אתרים ומקדמי SEO ו-PPC שפועלים כיחידה אחת. אנחנו עובדים בשקיפות מלאה
            ומבוססת-נתונים, ומוודאים שכל פרויקט – בין אם זה דף נחיתה לעסק או מערכת איקומרס מורכבת –
            ימקסם את יחסי ההמרה שלכם.
          </p>
        </div>

        {/* Stats Row - тепер йде від краю до краю на мобільних */}
        {/* 4-up columns only from lg: on tablet widths 25% columns are too
            narrow for the big numbers, so md keeps the swipeable mobile row */}
        <div className="flex flex-row  overflow-x-auto pb-8 lg:pb-0 scroll-smooth hide-scrollbar lg:overflow-visible">
          {stats.map((stat, index) => (
            <div
              key={stat.label}
              className={`
                flex-none w-[350px] lg:w-[25%] px-8 lg:px-6 xl:px-8 py-4 text-right border-gray-400
                border-r
                ${index === stats.length - 1 ? 'border-l' : ''}
              `}
            >
              {/* Value */}
              <div style={gradientNumberStyle} className="mb-4">
                {stat.value}
              </div>
              
              {/* Label */}
              <p className="text-[#2447D6] font-bold text-sm mb-4">
                {stat.label}
              </p>
              
              {/* Description */}
              <p className="text-[#717171] text-xs md:text-sm leading-relaxed">
                {stat.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}