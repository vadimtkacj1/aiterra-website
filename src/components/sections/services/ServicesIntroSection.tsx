import type React from 'react'

export default function ServicesIntroSection() {
  const gradientText: React.CSSProperties = {
    background: 'linear-gradient(92.63deg, #1B1BB3 14.57%, #530FAD 99.27%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    color: 'transparent',
  }

  return (
    <section className="bg-white w-full px-6" style={{ paddingTop: '165px', paddingBottom: '165px' }} dir="rtl">
      <div className="max-w-4xl mx-auto flex flex-col items-center text-center gap-8">

        <h2
          style={{
            ...gradientText,
            fontWeight: 600,
            lineHeight: '100%',
            letterSpacing: '0%',
          }}
          className="text-[20px] md:text-[48px]"
        >
בAITERRA, אנחנו מבינים שנוכחות דיגיטלית צריכה לייצר אימפקט ממשי. כחברה לבניית אתרים וסוכנות דיגיטל, אנחנו לא מפרידים בין הטכנולוגיה לשיווק – אנחנו מחברים ביניהם        </h2>

        <p
          style={{
            color: '#1D1D1D',
            fontWeight: 700,
            fontSize: '14px',
            lineHeight: '100%',
            letterSpacing: '0%',
          }}
        >
 השילוב הייחודי שלנו מאפשר לנו להציע בניית אתרים מקצועיים לצד אסטרטגיה חדה של קידום אתרים, הכל תחת קורת גג אחת. המטרה שלנו היא לקחת את הטכנולוגיה המורכבת ביותר ולהפוך אותה למנוע צמיחה פשוט ויעיל עבור העסק שלך.        </p>

      </div>
    </section>
  )
}
