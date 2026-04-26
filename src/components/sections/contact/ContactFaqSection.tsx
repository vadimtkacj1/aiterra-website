'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import type { FaqData } from '@/lib/faq-server'

export default function ContactFaqSection({ data }: { data: FaqData }) {
  const [open, setOpen] = useState<number | null>(null)

  return (
    <section className="w-full bg-white flex flex-col justify-center py-20" dir="rtl">
      <div className="w-full px-4 md:px-10 lg:px-20 max-w-5xl mx-auto">
        <div className="text-right mb-12">
          <h2
            className="text-[20px] md:text-[40px] font-bold mb-3 leading-tight bg-clip-text text-transparent inline-block"
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
              <button
                className="w-full text-right py-6 flex justify-between items-center group cursor-pointer"
                onClick={() => setOpen(open === i ? null : i)}
              >
                <span
                  className={`text-[18px] font-medium transition-colors duration-300 ${
                    open === i ? 'text-[#1B1BB3]' : 'text-[#0E1A27]'
                  } group-hover:text-[#1B1BB3]`}
                >
                  {faq.q}
                </span>
                <motion.svg
                  animate={{ rotate: open === i ? 180 : 0 }}
                  className={`w-6 h-6 shrink-0 ml-4 ${open === i ? 'text-[#1B1BB3]' : 'text-gray-400'}`}
                  viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                >
                  <path d="m6 9 6 6 6-6" />
                </motion.svg>
              </button>

              <motion.div
                initial={false}
                animate={{ height: open === i ? 'auto' : 0, opacity: open === i ? 1 : 0 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                className="overflow-hidden"
              >
                <div className="text-[16px] text-[#4A4A4A] leading-relaxed pb-6">
                  {faq.a}
                </div>
              </motion.div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
