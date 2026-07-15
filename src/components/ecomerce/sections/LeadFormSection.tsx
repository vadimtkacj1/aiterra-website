'use client'

import Link from 'next/link'
import { useState, type FormEvent } from 'react'
import { Check } from 'lucide-react'
import Reveal from '@/components/ecomerce/ui/Reveal'
import { SITE_LEADS_TOKEN } from '@/lib/ecomerce/contact'

type SubmitStatus = 'idle' | 'sending' | 'success' | 'error'

const ABOUT_MAX = 500

const TRUST_POINTS = [
  'תשתית איקומרס יוקרתית בבעלות מלאה שלכם',
  'ליווי צמוד לשנה שלמה — לא זורקים אתכם באוויר',
  'עבודה עם עסקים שמתייחסים לדיגיטל כמנוע צמיחה',
]

/**
 * The destination, on ink. Fields are hairline-ruled and transparent rather
 * than filled: on a black band a boxed input would read as another card, and
 * the form should read as a page you write on. The only filled element in the
 * section is the submit button — which is the only place the accent belongs.
 *
 * Three fields only — name, phone, and an optional line about the business.
 * Everything else (email, current site, budget) is a question for the call, not
 * a toll gate in front of it.
 */
export default function LeadFormSection() {
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [about, setAbout] = useState('')
  const [consent, setConsent] = useState(false)
  const [status, setStatus] = useState<SubmitStatus>('idle')

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (status === 'sending') return

    setStatus('sending')
    try {
      const res = await fetch('/api/site-leads/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          publicToken: SITE_LEADS_TOKEN,
          name,
          phone,
          // The main-site lead endpoint stores the free-text note as `message`;
          // send it under that key so the business description isn't dropped.
          message: about,
          source: 'ecommerce-landing',
        }),
      })
      if (!res.ok) throw new Error(`Request failed with status ${res.status}`)
      setStatus('success')
    } catch {
      setStatus('error')
    }
  }

  const isSending = status === 'sending'

  // `min-w-0` is load-bearing, not defensive. A form control carries an intrinsic
  // default width (a textarea's `cols`), and as a flex item its automatic minimum
  // size is that width, not zero — so `w-full` never gets to shrink it. Below a
  // ~300px viewport the field then pushes the column wider than the page, and the
  // whole document picks up a horizontal scroll of exactly that overhang.
  const inputClass =
    'w-full min-w-0 rounded-none border-0 border-b border-(--rule) bg-transparent px-0 py-3 text-[16px] ' +
    'text-(--fg) placeholder:text-(--dim) outline-none transition-colors ' +
    'focus:border-accent focus:ring-0 disabled:cursor-not-allowed disabled:opacity-50'

  const labelClass = 'label t-dim mb-3 block'

  return (
    <section id="lead-form" dir="rtl" className="band-ink">
      <div className="col-rules mx-auto max-w-7xl px-5 py-24 md:px-8 md:py-32">
        <div className="relative z-10">
          <Reveal>
            <div className="rule-draw-b flex items-center gap-4 pb-4">
              <span className="mark t-accent text-[13px] font-bold">07</span>
              <span className="label t-dim">שיחת אפיון · ללא התחייבות</span>
            </div>
          </Reveal>

          <div className="grid gap-14 pt-14 lg:grid-cols-12 lg:gap-x-16">
            {/* ---- copy column ---- */}
            <Reveal className="lg:col-span-5">
              <h2 className="display" style={{ fontSize: 'clamp(min(32px, 8.9vw), 4.6vw, 60px)' }}>
                מוכנים לעבור לליגה של הגדולים?
              </h2>

              <p className="t-muted mt-8 text-[15px] leading-relaxed md:text-[16px]">
                אנחנו עובדים עם עסקים שרוצים לגדול, להשקיע בנוכחות הדיגיטלית שלהם
                ולא מוכנים להתפשר על בינוניות. אם אתם מחפשים פתרון קסם ב-500 שקל –
                אנחנו לא הכתובת. אם אתם מחפשים תשתית איקומרס יוקרתית שתהווה מנוע
                צמיחה לעסק שלכם, השאירו פרטים ונתאם שיחת אפיון.
              </p>

              <ul className="rule-t mt-10 flex flex-col">
                {TRUST_POINTS.map((text) => (
                  <li key={text} className="rule-b flex gap-4 py-4">
                    <Check
                      aria-hidden
                      className="t-accent mt-0.5 h-4 w-4 shrink-0"
                      strokeWidth={2.6}
                    />
                    <span className="text-[14.5px] leading-relaxed max-md:text-[15px]">{text}</span>
                  </li>
                ))}
              </ul>
            </Reveal>

            {/* ---- form column ---- */}
            <Reveal delay={120} className="lg:col-span-6 lg:col-start-7">
              {status === 'success' ? (
                <div
                  role="status"
                  aria-live="polite"
                  className="rule-all flex flex-col items-start p-10"
                >
                  <span className="flex h-14 w-14 items-center justify-center bg-accent">
                    <Check className="h-7 w-7 text-white" strokeWidth={2.6} />
                  </span>
                  <h3 className="mt-8 text-[28px]">תודה!</h3>
                  <p className="t-muted mt-4 max-w-sm text-[15px] leading-relaxed">
                    הבקשה נקלטה — מומחה מטעם Aiterra יחזור אליכם לתיאום שיחת אפיון.
                  </p>
                </div>
              ) : (
                <form
                  onSubmit={handleSubmit}
                  noValidate
                  aria-busy={isSending}
                  className="flex flex-col gap-8"
                >
                  <div>
                    <label htmlFor="lf-name" className={labelClass}>
                      שם מלא
                    </label>
                    <input
                      id="lf-name"
                      name="name"
                      type="text"
                      required
                      autoComplete="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      disabled={isSending}
                      placeholder="ישראל ישראלי"
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <label htmlFor="lf-phone" className={labelClass}>
                      טלפון
                    </label>
                    <input
                      id="lf-phone"
                      name="phone"
                      type="tel"
                      required
                      autoComplete="tel"
                      inputMode="tel"
                      dir="ltr"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      disabled={isSending}
                      placeholder="050-000-0000"
                      className={`${inputClass} text-right`}
                    />
                  </div>

                  <div>
                    <label htmlFor="lf-about" className={labelClass}>
                      <span>במה העסק שלכם עוסק?</span>
                      <span className="t-dim ms-2 font-normal normal-case">
                        — אופציונלי
                      </span>
                    </label>
                    <textarea
                      id="lf-about"
                      name="about"
                      rows={3}
                      maxLength={ABOUT_MAX}
                      value={about}
                      onChange={(e) => setAbout(e.target.value)}
                      disabled={isSending}
                      placeholder="כמה מילים על העסק, מה אתם מוכרים ומה אתם רוצים להשיג מהחנות החדשה."
                      className={`${inputClass} resize-none leading-relaxed`}
                    />
                    <p className="t-dim mt-2 text-[12px]" aria-hidden>
                      {about.length}/{ABOUT_MAX}
                    </p>
                  </div>

                  {/* The gate on the whole form, so on a phone it has to be hittable with a
                      thumb. A native checkbox blown up to 44px would read as a button, so the
                      box stays 24 and the <label> carries the target instead: it wraps the
                      input, so the full 44px row toggles consent. The privacy link is exempt
                      from label activation per the HTML spec, so it still navigates. */}
                  <label className="flex cursor-pointer items-start gap-3 max-md:min-h-11 max-md:items-center">
                    <input
                      type="checkbox"
                      name="consent"
                      required
                      checked={consent}
                      onChange={(e) => setConsent(e.target.checked)}
                      disabled={isSending}
                      className="mt-0.5 h-4 w-4 shrink-0 rounded-none accent-accent max-md:mt-0 max-md:h-6 max-md:w-6"
                    />
                    <span className="t-muted text-[13px] leading-relaxed max-md:text-[15px]">
                      אני מאשר/ת שאיצרו איתי קשר בהתאם ל
                      <Link
                        href="/privacy-policy"
                        className="t-accent underline underline-offset-4 max-md:whitespace-nowrap"
                      >
                        מדיניות הפרטיות
                      </Link>
                      .
                    </span>
                  </label>

                  {status === 'error' && (
                    <p
                      id="lf-error"
                      role="alert"
                      className="border border-[#ff6b6b]/40 px-4 py-3 text-[13.5px] text-[#ff8f8f] max-md:text-[15px]"
                    >
                      אירעה שגיאה בשליחה. נסו שוב או התקשרו אלינו.
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={isSending}
                    aria-describedby={status === 'error' ? 'lf-error' : undefined}
                    className="btn btn-primary w-full disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {isSending ? 'שולח…' : 'שלחו בקשה לשיחת אפיון'}
                  </button>
                </form>
              )}
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  )
}
