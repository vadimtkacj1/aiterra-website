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
              className="sticky flex flex-col md:flex-row-reverse w-full bg-white overflow-hidden"
              style={{ top: `4rem` }}
            >
              {/* Image */}
              <div className="relative w-full md:w-[710px] h-[40vh] md:h-191.25 shrink-0">
                <Image
                  src={service.image}
                  alt={service.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 710px"
                  className="object-cover"
                />
              </div>

              {/* Text */}
              <div className="relative flex flex-col flex-1 bg-white px-6 py-6 md:px-24 md:py-16 text-right">

                <div className="w-full mb-3 md:mb-20">
                  <span className="text-[13px] font-medium text-gray-500 block">
                    {service.upperTitle}
                  </span>
                </div>

                <div className="my-auto">
                  <h3 className="text-[22px] md:text-[48px] leading-[1.2] font-black text-[#3b28cc] mb-3 md:mb-8 max-w-125">
                    {service.title}
                  </h3>

                  <p className="text-gray-600 text-[13px] md:text-[14px] leading-relaxed mb-5 md:mb-12 max-w-120">
                    {service.description}
                  </p>

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
