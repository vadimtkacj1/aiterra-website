'use client'

import Image from 'next/image'
import Link from 'next/link'
import { services } from '@/data/services'

export default function ServicesSection() {
  return (
    <section className="md:pb-32" dir="rtl">
      <div className="max-w-full mx-auto relative">
        <div className="flex flex-col">
          {services.map((service, index) => (
            <div
              key={index}
              // ה-sticky חוזר כאן עם חישוב ה-top
              className="sticky flex flex-col md:flex-row-reverse w-full bg-white overflow-hidden "
              style={{ top: `${index * 40}px` }} 
            >
              {/* Image side - גובה מוקטן במובייל כדי שהטקסט לא ייחתך */}
              <div className="relative w-full md:w-[710px] h-[230px] md:h-[765px] shrink-0">
                <Image
                  src={service.image}
                  alt={service.title}
                  fill
                  className="object-cover"
                />
              </div>

              {/* Text side */}
              <div className="relative flex flex-col flex-1 bg-white px-6 py-8 md:px-24 md:py-16 text-right">
                
                {/* Upper Text */}
                <div className="w-full mb-4 md:mb-20">
                  <span className="text-[14px] font-medium text-gray-500 block">
                    {service.upperTitle}
                  </span>
                </div>

                <div className="my-auto">
                  {/* Title: 20px Mobile / 48px Desktop */}
                  <h3 className="text-[20px] md:text-[48px] leading-[1.2] font-black text-[#3b28cc] mb-4 md:mb-8 max-w-[500px]">
                    {service.title}
                  </h3>

                  {/* Description: 14px */}
                  <p className="text-gray-600 text-[14px] leading-relaxed mb-8 md:mb-12 max-w-[480px]">
                    {service.description}
                  </p>

                  {/* Button: 14px */}
                  <Link
                    href={`/services/${service.slug}`}
                    className="inline-block border border-[#3b28cc] text-[#3b28cc] text-[14px] px-10 py-3 hover:bg-[#3b28cc] hover:text-white transition-all duration-300 font-bold"
                  >
                    {service.cta}
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}