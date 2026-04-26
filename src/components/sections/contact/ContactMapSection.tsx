import {
  CONTACT_EMAIL,
  GOOGLE_MAPS_EMBED_URL,
  GOOGLE_MAPS_OPEN_URL,
  OFFICE_ADDRESS_EN,
  OFFICE_ADDRESS_HE,
} from '@/lib/contact'

export default function ContactMapSection() {
  return (
    <section className="bg-white" dir="rtl">
      <div className="flex flex-col md:flex-row">
        {/* Contact info — right */}
        <div className="w-full md:w-1/3 flex flex-col items-center justify-center gap-5 px-10 py-12 text-center">
          <h2
            className="font-bold"
            style={{
              fontSize: 'clamp(20px, 3vw, 40px)',
              background: 'linear-gradient(92.63deg, #1B1BB3 14.57%, #530FAD 99.27%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            Call us
          </h2>

          <div className="flex flex-col gap-3 text-[15px] text-[#444] font-medium max-w-sm">
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="hover:underline"
              style={{
                background: 'linear-gradient(92.63deg, #1B1BB3 14.57%, #530FAD 99.27%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
              dir="ltr"
            >
              {CONTACT_EMAIL}
            </a>
            <p className="leading-relaxed text-[#555]">
              <span className="block">{OFFICE_ADDRESS_HE}</span>
              <span className="block mt-1 text-[14px] text-[#666]" dir="ltr">
                {OFFICE_ADDRESS_EN}
              </span>
            </p>
            <a
              href={GOOGLE_MAPS_OPEN_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[14px] text-[#1B1BB3] hover:underline font-semibold"
            >
              פתיחה ב-Google Maps
            </a>
          </div>
        </div>

        {/* Map — left */}
        <div className="w-full md:w-2/3 min-h-[280px] md:min-h-[420px]">
          <iframe
            title="מיקום המשרד — AITERRA"
            src={GOOGLE_MAPS_EMBED_URL}
            width="100%"
            height="100%"
            className="min-h-[280px] md:min-h-[420px] h-full w-full"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>
    </section>
  )
}
