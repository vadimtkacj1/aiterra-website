'use client'

import { useEffect, useRef, useState } from 'react'
import type { FaqData } from '@/lib/faq-server'

export default function FaqSection({ data }: { data: FaqData }) {
  if (!data.items.length) return null
  return <FaqSectionContent data={data} />
}

function FaqSectionContent({ data }: { data: FaqData }) {
  const [open, setOpen] = useState<number | null>(null)
  const [revealed, setRevealed] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)

  // Scroll-reveal without an animation library: one-shot IntersectionObserver
  // flips a class and CSS transitions handle the scale/opacity.
  useEffect(() => {
    const el = sectionRef.current
    if (!el || typeof IntersectionObserver === 'undefined') {
      setRevealed(true)
      return
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setRevealed(true)
          io.disconnect()
        }
      },
      { threshold: 0.15 }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: data.items.map(faq => ({
      '@type': 'Question',
      name: faq.q,
      acceptedAnswer: { '@type': 'Answer', text: faq.a },
    })),
  }

  return (
    <section
      ref={sectionRef}
      className={`w-full bg-white flex flex-col justify-center py-24 transition-[transform,opacity] duration-700 ease-out ${
        revealed ? 'scale-100 opacity-100' : 'scale-95 opacity-60'
      }`}
      dir="rtl"
      aria-labelledby="faq-section-heading"
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <div className="w-full px-4 md:px-10 lg:px-20">
        <div className="text-right mb-16">
          <h2
            id="faq-section-heading"
            className="text-[20px] md:text-[48px] font-bold mb-4 leading-tight bg-clip-text text-transparent inline-block"
            style={{
              backgroundImage: 'linear-gradient(92.63deg, #2447D6 14.57%, #3E96F9 99.27%)',
              WebkitBackgroundClip: 'text',
            }}
          >
            {data.title}
          </h2>
        </div>

        <div className="flex flex-col w-full border-t border-gray-200">
          {data.items.map((faq, i) => (
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
                      open === i ? 'text-[#2447D6]' : 'text-[#0E1A27]'
                    } group-hover:text-[#2447D6]`}
                  >
                    {faq.q}
                  </span>
                  <svg
                    aria-hidden
                    className={`w-6 h-6 shrink-0 transition-transform duration-300 ${
                      open === i ? 'rotate-180 text-[#2447D6]' : 'text-gray-400'
                    }`}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="m6 9 6 6 6-6" />
                  </svg>
                </button>
              </h3>

              {/* grid-rows 0fr→1fr animates height without measuring content */}
              <div
                id={`faq-a-${i}`}
                role="region"
                aria-labelledby={`faq-q-${i}`}
                className={`grid transition-[grid-template-rows,opacity] duration-300 ease-in-out ${
                  open === i ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                }`}
              >
                <div className="overflow-hidden">
                  <div className="text-[18px] text-[#4A4A4A] leading-relaxed pb-6 pr-0 pl-0">
                    {faq.a}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
