import Image from 'next/image'

const partners = [
  { src: '/images/partners/partner1.svg', alt: 'Partner 1' }, // OpenAI
  { src: '/images/partners/partner2.svg', alt: 'Partner 2' }, // WordPress
  { src: '/images/partners/partner3.svg', alt: 'Partner 3' }, // Google Ads
  { src: '/images/partners/partner4.svg', alt: 'Partner 4' }, // Meta
]

export default function PartnersSection() {
  return (
    <section className="py-12">
      <div className="mx-auto max-w-7xl px-6">
        <div
          className="flex flex-row flex-wrap items-center justify-center gap-x-10 gap-y-8 pb-1 md:justify-between md:gap-8"
          dir="ltr"
        >
          {partners.map((partner, index) => (
            <div
              key={index}
              className="relative flex h-[55px] w-36 items-center justify-center md:w-44"
            >
              <Image
                src={partner.src}
                alt={partner.alt}
                fill
                sizes="(max-width: 768px) 144px, 176px"
                className="object-contain"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}