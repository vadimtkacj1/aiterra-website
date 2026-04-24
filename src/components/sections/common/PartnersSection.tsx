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
      <div className="max-w-7xl mx-auto px-6">
        <div 
          className="flex flex-row items-center justify-between gap-8 flex-wrap" 
          dir="ltr"
        >
          {partners.map((partner, index) => (
            <div key={index} className="relative h-[55px] w-44 flex items-center justify-center">
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