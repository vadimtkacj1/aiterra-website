'use client'

import { useState, useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'

const faqs = [
  { q: 'כמה זמן לוקח לבנות אתר לעסק?', a: 'זמן הפיתוח משתנה בהתאם למורכבות...' },
  { q: 'מה כולל שירות ה-SEO שלכם?', a: 'השירות שלנו הוא מקיף (End-to-End)...' },
  { q: 'האם האתרים שאתם בונים רספונסיביים?', a: 'חד משמעית כן. Mobile-First.' },
  { q: 'קמפיין ממומן לעסקים קטנים?', a: 'אנו בונים אסטרטגיה מותאמת אישית.' },
  { q: 'מה קורה אחרי השקת האתר?', a: 'AITERRA מספקת שירותי תחזוקה ואבטחה.' },
]

export default function FaqSection() {
  const [open, setOpen] = useState<number | null>(null)
  const sectionRef = useRef<HTMLElement>(null)

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  })

  const scale = useTransform(scrollYProgress, [0, 0.2], [0.95, 1])
  const opacity = useTransform(scrollYProgress, [0, 0.2], [0.6, 1])

  return (
    <motion.section
      ref={sectionRef}
      className="w-full bg-white flex flex-col justify-center py-24"
      dir="rtl"
      style={{ scale, opacity }}
    >
      <div className="w-full px-4 md:px-10 lg:px-20">
        <div className="text-right mb-16">
          <h2
            className="text-[32px] md:text-[48px] font-bold mb-4 leading-tight bg-clip-text text-transparent inline-block"
            style={{
              backgroundImage: 'linear-gradient(92.63deg, #1B1BB3 14.57%, #530FAD 99.27%)',
              WebkitBackgroundClip: 'text'
            }}
          >
            שאלות נפוצות עלינו
          </h2>
          <p className="text-[#626262] font-medium text-base">
            שאלות נפוצות על בניית אתרים, שיווק דיגיטלי וקידום אתרים
          </p>
        </div>

        <div className="flex flex-col w-full border-t border-gray-200">
          {faqs.map((faq, i) => (
            <div key={i} className="border-b border-gray-200 w-full">
              <button
                className="w-full text-right py-6 flex justify-between items-center group cursor-pointer"
                onClick={() => setOpen(open === i ? null : i)}
              >
                <span 
                  className={`text-[20px] font-medium transition-colors duration-300 ${
                    open === i ? 'text-[#1B1BB3]' : 'text-[#0E1A27]'
                  } group-hover:text-[#1B1BB3]`}
                >
                  {faq.q}
                </span>
                <motion.svg 
                  animate={{ rotate: open === i ? 180 : 0 }}
                  className={`w-6 h-6 ${open === i ? 'text-[#1B1BB3]' : 'text-gray-400'}`}
                  viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                >
                  <path d="m6 9 6 6 6-6"/>
                </motion.svg>
              </button>

              <motion.div 
                initial={false}
                animate={{ height: open === i ? 'auto' : 0, opacity: open === i ? 1 : 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="overflow-hidden"
              >
                <div className="text-[18px] text-[#4A4A4A] leading-relaxed pb-6">
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