const testimonials = [
  {
    name: 'יוסי כהן',
    role: 'מנכ"ל, TechStart',
    text: 'AITERRA שינו לנו את הפנים הדיגיטליות. האתר החדש הגדיל את ההמרות ב-180% תוך שלושה חודשים.',
    avatar: 'י',
  },
  {
    name: 'מיכל לוי',
    role: 'מנהלת שיווק, FashionBrand',
    text: 'הקמפיינים שבנו עבורנו מדויקים, מדידים וכדאיים. הרגשנו שותפים אמיתיים לדרך.',
    avatar: 'מ',
  },
  {
    name: 'דניאל ברק',
    role: 'יזם, SaaSco',
    text: 'פיתוח ה-MVP שלנו הושלם בזמן, בתקציב ועם קוד שאנחנו גאים בו. ממליץ בחום!',
    avatar: 'ד',
  },
]

export default function TestimonialsSection() {
  return (
    <section className="py-24 bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-black mb-4">מה הלקוחות אומרים</h2>
          <p className="text-gray-400 max-w-md mx-auto">
            מעל 150 פרויקטים מאחורינו – הנה מה שאומרים אלו שכבר עבדו איתנו
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <div key={t.name} className="bg-gray-800 rounded-2xl p-8 flex flex-col gap-4">
              <p className="text-gray-300 leading-relaxed text-sm">
                <span className="text-gray-400">&ldquo;</span>
                {t.text}
                <span className="text-gray-400">&rdquo;</span>
              </p>
              <div className="flex items-center gap-3 mt-auto">
                <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center font-bold text-white shrink-0">
                  {t.avatar}
                </div>
                <div>
                  <p className="font-semibold text-white">{t.name}</p>
                  <p className="text-xs text-gray-400">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
