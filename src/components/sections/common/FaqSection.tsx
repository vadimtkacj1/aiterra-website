'use client'

import { useState, useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import type { FaqData } from '@/lib/faq-server'

export default function FaqSection({ data }: { data: FaqData }) {
  const [open, setOpen] = useState<number | null>(null)
  const sectionRef = useRef<HTMLElement>(null)

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  })

  const scale = useTransform(scrollYProgress, [0, 0.2], [0.95, 1])
  const opacity = useTransform(scrollYProgress, [0, 0.2], [0.6, 1])

  if (!data.items.length) return null

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
    <motion.section
      ref={sectionRef}
      className="w-full bg-white flex flex-col justify-center py-24"
      dir="rtl"
      style={{ scale, opacity }}
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
              backgroundImage: 'linear-gradient(92.63deg, #1B1BB3 14.57%, #530FAD 99.27%)',
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
