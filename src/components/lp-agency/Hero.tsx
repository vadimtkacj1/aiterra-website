'use client'

import Image from 'next/image'
import { useState } from 'react'
import SuccessModal from './SuccessModal'

type HeroProps = {
  headline?: string[]
  subhead?: string
  cta?: string
  image?: string
}

export default function Hero({
  headline = ['יותר לידים.', 'פחות בזבוז תקציב.'],
  subhead = 'אותו צוות בונה את האתר, מקדם אותו ומריץ את הקמפיינים - ולכן תקציב הפרסום לא נוחת על עמוד שלא נבנה כדי להמיר. התוצאה נמדדת בפניות שנכנסות למערכת מסודרת, לא בחשיפות.',
  cta = 'לשיחת אסטרטגיה ללא עלות',
  image = '/images/lp/hero-section.png',
}: HeroProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <section
        className="pt-24 pb-12 md:pt-32 md:pb-20 min-h-screen flex items-center rounded-bl-[40px] rounded-br-[40px]"
        style={{
          background: 'linear-gradient(180deg, #F4F9FF 0%, #E3F0FF 50%, #CFE6FF 100%)',
        }}
      >
        <div className="container mx-auto px-4 max-w-7xl w-full">
          <div className="flex flex-col md:flex-row items-center justify-between gap-10 md:gap-12 lg:gap-16">

            <div className="w-full md:w-[48%] max-w-sm md:max-w-none mx-auto md:mx-0 flex-shrink-0">
              <Image
                src={image}
                alt="Aiterra"
                width={800}
                height={800}
                className="w-full h-auto"
                priority
                quality={95}
              />
            </div>

            <div className="w-full md:w-[48%] flex flex-col items-center md:items-end text-center md:text-right">
              <h1
                className="font-extrabold mb-6 md:mb-8"
                style={{
                  fontSize: 'clamp(32px, 5vw, 64px)',
                  fontWeight: 800,
                  lineHeight: '110%',
                  letterSpacing: '0%',
                }}
              >
                {headline.map((line, i) => (
                  <span key={line} className="block">
                    {i > 0 ? line : line}
                  </span>
                ))}
              </h1>

              <p className="text-base md:text-lg text-gray-700 mb-8 md:mb-10 leading-relaxed">
                {subhead}
              </p>

              <button
                onClick={() => setIsModalOpen(true)}
                className="text-white w-full md:w-auto md:px-12 py-4 md:py-5 text-base md:text-lg font-bold transition-all hover:opacity-90 hover:scale-105 bg-blue-600"
                style={{
                  boxShadow: '0 4px 14px 0 rgba(37, 99, 235, 0.39)',
                  borderRadius: '20px',
                }}
              >
                {cta}
              </button>
            </div>

          </div>
        </div>
      </section>

      <SuccessModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        variant="light"
      />
    </>
  );
}