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
          className="-mx-6 flex snap-x flex-row items-center gap-10 overflow-x-auto scroll-smooth px-6 pb-1 [scrollbar-width:none] [-ms-overflow-style:none] md:snap-none md:mx-0 md:flex-wrap md:justify-between md:gap-8 md:overflow-visible md:px-0 [&::-webkit-scrollbar]:hidden"
          dir="ltr"
        >
          {partners.map((partner, index) => (
            <div
              key={index}
              className="relative flex h-[55px] w-36 shrink-0 snap-start items-center justify-center md:w-44"
            >
              <Image
                src={partner.src}
                alt={partner.alt}
                fill
                className="object-contain"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}