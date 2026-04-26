'use client'

import { useState, useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'

const faqs = [
  {
    q: 'כמה זמן לוקח לבנות אתר לעסק?',
    a: 'זמן הפיתוח משתנה בהתאם למורכבות. אתר תדמיתי יכול לקחת בין 3-5 שבועות, בעוד פיתוח מערכות תוכנה מורכבות או חנויות איקומרס גדולות עשוי לארוך חודשיים ומעלה. אנחנו מקפידים על עמידה בלוחות זמנים קשיחים.',
  },
  {
    q: 'מה כולל שירות ה-SEO (קידום אתרים) שלכם?',
    a: 'השירות שלנו הוא מקיף (End-to-End). הוא כולל אופטימיזציה של קוד האתר, מחקר מתחרים, בניית פרופיל קישורים, כתיבת תוכן שיווקי וטכני, ומעקב חודשי אחר מיקומים ותנועה.',
  },
  {
    q: 'האם האתרים שאתם בונים רספונסיביים?',
    a: 'חד משמעית כן. כל אתר שאנו מפתחים עובר התאמה מלאה לכל סוגי המסכים – סמארטפונים, טאבלטים ומחשבים נייחים, עם דגש על Mobile-First.',
  },
  {
    q: 'האם אתם מנהלים קמפיין ממומן ופרסום ברשתות חברתיות גם לעסקים קטנים?',
    a: 'אנו בונים אסטרטגיית פרסום מותאמת אישית לכל לקוח. בין אם מדובר בשיווק לעסקים מקומיים ובין אם בפריסה ארצית או בינלאומית, אנחנו נדע להתאים את התקציב למטרות העסקיות.',
  },
  {
    q: 'מה קורה אחרי השקת האתר?',
    a: 'אנחנו לא נעלמים. AITERRA מספקת שירותי תחזוקה, אבטחת מידע, אחסון ועדכוני תוכנה שוטפים, לצד ליווי שיווקי צמוד בקידום אורגני וממומן.',
  },
]

const FAQ_SECTION_TITLE = 'שאלות נפוצות על בניית אתרים, שיווק דיגיטלי וקידום אתרים'

export default function FaqSection() {
  const [open, setOpen] = useState<number | null>(null)
  const sectionRef = useRef<HTMLElement>(null)

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  })

  const scale = useTransform(scrollYProgress, [0, 0.2], [0.95, 1])
  const opacity = useTransform(scrollYProgress, [0, 0.2], [0.6, 1])

  return (
    <motion.section
      ref={sectionRef}
      className="w-full bg-white flex flex-col justify-center py-24"
      dir="rtl"
      style={{ scale, opacity }}
      aria-labelledby="faq-section-heading"
    >
      <div className="w-full px-4 md:px-10 lg:px-20">
        <div className="text-right mb-16">
          <h2
            id="faq-section-heading"
            className="text-[20px] md:text-[48px] font-bold mb-4 leading-tight bg-clip-text text-transparent inline-block"
            style={{
              backgroundImage: 'linear-gradient(92.63deg, #1B1BB3 14.57%, #530FAD 99.27%)',
              WebkitBackgroundClip: 'text',
            }}
          >
            {FAQ_SECTION_TITLE}
          </h2>
        </div>

        <div className="flex flex-col w-full border-t border-gray-200">
          {faqs.map((faq, i) => (
            <div key={i} className="border-b border-gray-200 w-full">
              <h3 className="m-0">
                <button
                  type="button"
                  className="w-full text-right py-6 flex justify-between items-center group cursor-pointer gap-4"
                  onClick={() => setOpen(open === i ? null : i)}
                  aria-expanded={open === i}
                  id={`faq-q-${i}`}
                  aria-controls={`faq-a-${i}`}
                >
                  <span
                    className={`text-[20px] font-medium transition-colors duration-300 text-right ${
                      open === i ? 'text-[#1B1BB3]' : 'text-[#0E1A27]'
                    } group-hover:text-[#1B1BB3]`}
                  >
                    {faq.q}
                  </span>
                  <motion.svg
                    aria-hidden
                    animate={{ rotate: open === i ? 180 : 0 }}
                    className={`w-6 h-6 shrink-0 ${open === i ? 'text-[#1B1BB3]' : 'text-gray-400'}`}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="m6 9 6 6 6-6" />
                  </motion.svg>
                </button>
              </h3>

              <motion.div
                id={`faq-a-${i}`}
                role="region"
                aria-labelledby={`faq-q-${i}`}
                initial={false}
                animate={{ height: open === i ? 'auto' : 0, opacity: open === i ? 1 : 0 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                className="overflow-hidden"
              >
                <div className="text-[18px] text-[#4A4A4A] leading-relaxed pb-6 pr-0 pl-0">
                  {faq.a}
                </div>
              </motion.div>
            </div>
          ))}
        </div>
      </div>
    </motion.section>
  )
}
