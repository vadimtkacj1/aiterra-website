'use client'

import { useState } from 'react'

export default function ContactForm() {
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log({ name, phone })
  }

  return (
    <section 
      dir="rtl" 
      className="flex py-20 px-4 md:px-20"
    >
      <div className="w-full max-w-[480px] flex flex-col items-start">
        <h2 className="text-[20px] md:text-[48px] font-bold leading-[1.1] mb-2 bg-clip-text text-transparent bg-[linear-gradient(92.63deg,#1B1BB3_14.57%,#530FAD_99.27%)]">
          מוכנים להתחיל את המסע הדיגיטלי שלכם?
        </h2>

        <p className="text-[14px] text-[#666] mb-8">
          בואו נדבר על הפרויקט הבא שלכם ונמצא את הפתרון המושלם לצמיחה עסקית
        </p>

        <form onSubmit={handleSubmit} className="w-full space-y-4">
          <div className="flex flex-col md:flex-row gap-3">
            <input
              type="text"
              placeholder="שם"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2.5 border border-[#D1D5DB] rounded-md focus:outline-none focus:ring-1 focus:ring-[#1B1BB3] text-right placeholder:text-[#9CA3AF]"
              required
            />
            <input
              type="tel"
              placeholder="טלפון"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-4 py-2.5 border border-[#D1D5DB] rounded-md focus:outline-none focus:ring-1 focus:ring-[#1B1BB3] text-right placeholder:text-[#9CA3AF]"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full border border-[#530FAD] text-[#530FAD] py-2.5 rounded-md font-bold text-[16px] hover:bg-purple-50 transition-colors duration-200"
          >
            למידע נוסף על שירותי בניית האתרים שלנו
          </button>
        </form>
      </div>
    </section>
  )
}