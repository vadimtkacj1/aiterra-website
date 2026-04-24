'use client'

import { useState } from 'react'

export default function ContactFormSection() {
  const [form, setForm] = useState({ name: '', phone: '', email: '', message: '' })
  const [submitted, setSubmitted] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log(form)
    setSubmitted(true)
  }

  return (
    <section id="contact-form" className="bg-white py-24 px-6" dir="rtl">
      <div className="max-w-3xl mx-auto">

        <h2
          className="font-bold mb-4"
          style={{
            fontSize: 'clamp(20px, 4vw, 48px)',
            lineHeight: '1.1',
            background: 'linear-gradient(92.63deg, #1B1BB3 14.57%, #530FAD 99.27%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          מוכנים להתחיל את המסע הדיגיטלי שלכם?
        </h2>

        <p className="text-[#666] text-[15px] mb-10">
          בואו נדבר על הפרויקט הבא שלכם ונמצא את הפתרון המושלם לצמיחה עסקית
        </p>

        {submitted ? (
          <div
            className="rounded-lg p-8 text-center"
            style={{ background: 'linear-gradient(135deg, #f0f0ff 0%, #f5eeff 100%)' }}
          >
            <p
              className="text-[20px] font-bold"
              style={{
                background: 'linear-gradient(92.63deg, #1B1BB3 14.57%, #530FAD 99.27%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              תודה! נחזור אליכם בהקדם.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <input
                type="text"
                name="name"
                placeholder="שם מלא"
                value={form.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-[#D1D5DB] rounded-md focus:outline-none focus:ring-1 focus:ring-[#1B1BB3] text-right placeholder:text-[#9CA3AF] text-[15px]"
              />
              <input
                type="tel"
                name="phone"
                placeholder="טלפון"
                value={form.phone}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-[#D1D5DB] rounded-md focus:outline-none focus:ring-1 focus:ring-[#1B1BB3] text-right placeholder:text-[#9CA3AF] text-[15px]"
              />
            </div>

            <input
              type="email"
              name="email"
              placeholder="אימייל"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-[#D1D5DB] rounded-md focus:outline-none focus:ring-1 focus:ring-[#1B1BB3] text-right placeholder:text-[#9CA3AF] text-[15px]"
            />

            <textarea
              name="message"
              placeholder="ספרו לנו על הפרויקט שלכם..."
              value={form.message}
              onChange={handleChange}
              rows={5}
              className="w-full px-4 py-3 border border-[#D1D5DB] rounded-md focus:outline-none focus:ring-1 focus:ring-[#1B1BB3] text-right placeholder:text-[#9CA3AF] text-[15px] resize-none"
            />

            <button
              type="submit"
              className="w-full py-3.5 rounded-md font-bold text-[16px] text-white transition-opacity hover:opacity-90"
              style={{
                background: 'linear-gradient(92.63deg, #1B1BB3 14.57%, #530FAD 99.27%)',
              }}
            >
              שלחו הודעה
            </button>
          </form>
        )}
      </div>
    </section>
  )
}
