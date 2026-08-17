'use client'

import { useState } from 'react'
import Image from 'next/image'
import { SITE_LEADS_TOKEN } from '@/lib/contact'

export default function ContactForm() {
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [sending, setSending] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (sending) return
    setSending(true)
    setError('')
    try {
      const res = await fetch('/api/site-leads/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ publicToken: SITE_LEADS_TOKEN, name, phone, source: 'cta-section' }),
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
    <section
      dir="rtl"
      className="flex items-center py-20 px-4 md:px-20 gap-12"
    >
      <div className="w-full max-w-[480px] flex flex-col items-start">
        <h2 className="text-[20px] md:text-[48px] font-bold leading-[1.1] mb-2 bg-clip-text text-transparent bg-[linear-gradient(92.63deg,#2447D6_14.57%,#3E96F9_99.27%)]">
          מוכנים להתחיל את המסע הדיגיטלי שלכם?
        </h2>

        <p className="text-[14px] text-[#666] mb-8">
          בואו נדבר על הפרויקט הבא שלכם ונמצא את הפתרון המושלם לצמיחה עסקית
        </p>

        {submitted ? (
          <div
            className="w-full rounded-md p-6 text-center"
            style={{ background: 'linear-gradient(135deg, #eef3ff 0%, #e9f4ff 100%)' }}
          >
            <p className="text-[18px] font-bold text-[#3E96F9]">תודה! נחזור אליכם בהקדם.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="w-full space-y-4">
            <div className="flex flex-col md:flex-row gap-3">
              <input
                type="text"
                placeholder="שם"
                aria-label="שם"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2.5 border border-[#D1D5DB] rounded-md focus:outline-none focus:ring-1 focus:ring-[#2447D6] text-right placeholder:text-[#9CA3AF]"
                required
              />
              <input
                type="tel"
                placeholder="טלפון"
                aria-label="טלפון"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-4 py-2.5 border border-[#D1D5DB] rounded-md focus:outline-none focus:ring-1 focus:ring-[#2447D6] text-right placeholder:text-[#9CA3AF]"
                required
              />
            </div>

            <label className="flex items-start gap-2 text-[13px] text-[#666] cursor-pointer">
              <input
                type="checkbox"
                name="consent"
                required
                className="mt-0.5 h-4 w-4 shrink-0 accent-[#2447D6] cursor-pointer"
              />
              <span>
                אני מאשר/ת שקראתי והבנתי את{' '}
                <a href="/terms-of-use" target="_blank" rel="noopener noreferrer" className="text-[#2447D6] underline hover:opacity-80">
                  התקנון
                </a>{' '}
                ואת{' '}
                <a href="/privacy-policy" target="_blank" rel="noopener noreferrer" className="text-[#2447D6] underline hover:opacity-80">
                  מדיניות הפרטיות
                </a>{' '}
                של האתר
              </span>
            </label>

            <button
              type="submit"
              disabled={sending}
              className="w-full border border-[#3E96F9] text-[#3E96F9] py-2.5 rounded-md font-bold text-[16px] hover:bg-blue-50 transition-colors duration-200 disabled:opacity-60"
            >
              {sending ? 'שולח…' : 'לקבלת הצעת מחיר מהירה'}
            </button>
            {error && <p className="text-red-600 text-[14px] text-center" role="alert">{error}</p>}
          </form>
        )}
      </div>

      <div className="hidden md:flex flex-1 justify-center items-center">
        <Image
          src="/images/chips-v2.webp"
          alt="AI chips"
          width={500}
          height={500}
          className="object-contain"
        />
      </div>
    </section>
  )
}