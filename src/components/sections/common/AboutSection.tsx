const stats = [
  { value: '150+', label: 'פרויקטים שהושלמו' },
  { value: '98%', label: 'שביעות רצון לקוחות' },
  { value: '5+', label: 'שנות ניסיון' },
  { value: '40+', label: 'לקוחות פעילים' },
]

export default function AboutSection() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Text */}
          <div className="flex flex-col gap-6">
            <span className="text-blue-600 font-semibold text-sm uppercase tracking-widest">
              אודותינו
            </span>
            <h2 className="text-[20px] md:text-[48px] font-black text-gray-900 leading-tight">
              טכנולוגיה שמתחברת
              <br />
              לתוצאות אמיתיות
            </h2>
            <p className="text-gray-600 leading-relaxed">
              ב-AITERRA אנחנו לא רק כותבים קוד – אנחנו בונים מנועי צמיחה דיגיטליים. הצוות שלנו
              משלב מפתחים, מעצבים, אנשי שיווק ואסטרטגים בתחום הדיגיטל תחת קורת גג אחת.
            </p>
            <p className="text-gray-600 leading-relaxed">
              אנחנו עובדים עם עסקים מכל הגדלים – ממיזמים בתחילת הדרך ועד חברות ותיקות שרוצות להגדיל
              את הנוכחות הדיגיטלית שלהן. כל פרויקט מקבל יחס אישי, מדידה קפדנית ותוצאות שאפשר לראות.
            </p>
          </div>

          {/* Stats grid */}
          <div className="grid grid-cols-2 gap-6">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="bg-gray-50 rounded-2xl p-8 flex flex-col items-center justify-center text-center"
              >
                <span className="text-5xl font-black text-gray-900">{stat.value}</span>
                <span className="text-sm text-gray-500 mt-2">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
