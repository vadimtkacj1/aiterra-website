'use client'

import { useState } from 'react'
import Image from 'next/image'
import { SITE_LEADS_TOKEN } from '@/lib/contact'

export default function ContactFormSection() {
  const [form, setForm] = useState({ name: '', phone: '', email: '', message: '' })
  const [submitted, setSubmitted] = useState(false)
  const [sending, setSending] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (sending) return
    setSending(true)
    setError('')
    try {
      const res = await fetch('/api/site-leads/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ publicToken: SITE_LEADS_TOKEN, ...form, source: 'contact-page' }),
      })
      if (!res.ok) throw new Error('request failed')
      setSubmitted(true)
    } catch {
      setError('אירעה שגיאה בשליחה. אנא נסו שוב או התקשרו אלינו.')
    } finally {
      setSending(false)
    }
  }

  return (
    <section id="contact-form" className="bg-white py-24 px-6" dir="rtl">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-12">

        {/* Form — right (RTL start) */}
        <div className="w-full md:w-1/2">

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
                id="contact-name"
                name="name"
                placeholder="שם מלא"
                aria-label="שם מלא"
                value={form.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-[#D1D5DB] rounded-md focus:outline-none focus:ring-1 focus:ring-[#1B1BB3] text-right placeholder:text-[#9CA3AF] text-[15px]"
              />
              <input
                type="tel"
                id="contact-phone"
                name="phone"
                placeholder="טלפון"
                aria-label="טלפון"
                value={form.phone}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-[#D1D5DB] rounded-md focus:outline-none focus:ring-1 focus:ring-[#1B1BB3] text-right placeholder:text-[#9CA3AF] text-[15px]"
              />
            </div>

            <input
              type="email"
              id="contact-email"
              name="email"
              placeholder="אימייל"
              aria-label="אימייל"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-[#D1D5DB] rounded-md focus:outline-none focus:ring-1 focus:ring-[#1B1BB3] text-right placeholder:text-[#9CA3AF] text-[15px]"
            />

            <textarea
              id="contact-message"
              name="message"
              placeholder="ספרו לנו על הפרויקט שלכם..."
              aria-label="הודעה"
              value={form.message}
              onChange={handleChange}
              rows={5}
              className="w-full px-4 py-3 border border-[#D1D5DB] rounded-md focus:outline-none focus:ring-1 focus:ring-[#1B1BB3] text-right placeholder:text-[#9CA3AF] text-[15px] resize-none"
            />

            <label className="flex items-start gap-2 text-[13px] text-[#666] cursor-pointer">
              <input
                type="checkbox"
                name="consent"
                required
                className="mt-0.5 h-4 w-4 shrink-0 accent-[#1B1BB3] cursor-pointer"
              />
              <span>
                אני מאשר/ת שקראתי והבנתי את{' '}
                <a href="/terms-of-use" target="_blank" rel="noopener noreferrer" className="text-[#1B1BB3] underline hover:opacity-80">
                  התקנון
                </a>{' '}
                ואת{' '}
                <a href="/privacy-policy" target="_blank" rel="noopener noreferrer" className="text-[#1B1BB3] underline hover:opacity-80">
                  מדיניות הפרטיות
                </a>{' '}
                של האתר
              </span>
            </label>

            <button
              type="submit"
              disabled={sending}
              className="w-full py-3.5 rounded-md font-bold text-[16px] text-white transition-opacity hover:opacity-90 disabled:opacity-60"
              style={{
                background: 'linear-gradient(92.63deg, #1B1BB3 14.57%, #530FAD 99.27%)',
              }}
            >
              {sending ? 'שולח…' : 'שלחו הודעה'}
            </button>
            {error && <p className="text-red-600 text-[14px] text-center" role="alert">{error}</p>}
          </form>
        )}
        </div>

        {/* chips.png — left (RTL end = physical left) */}
        <div className="hidden md:flex w-full md:w-1/2 justify-center items-center">
          <Image
            src="/images/chips.webp"
            alt="AI chips"
            width={480}
            height={480}
            className="object-contain"
          />
        </div>

      </div>
    </section>
  )
}
