export default function ContactMapSection() {
  return (
    <section className="bg-white" dir="rtl">
      <div className="flex flex-col md:flex-row">
        {/* Contact info — right */}
        <div className="w-full md:w-1/3 flex flex-col items-center justify-center gap-4 px-10 py-12 text-center">
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

          <div className="flex flex-col gap-1 text-[15px] text-[#444] font-medium">
            <a
              href="mailto:info@aiterra.co.il"
              className="hover:underline"
              style={{
                background: 'linear-gradient(92.63deg, #1B1BB3 14.57%, #530FAD 99.27%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
              dir="ltr"
            >
              info@aiterra.co.il
            </a>
            <span className="text-[#888]">|</span>
            <span>[אימייל]</span>
            <span className="text-[#888]">|</span>
            <span>[כתובת]</span>
          </div>
        </div>

        {/* Map — left */}
        <div className="w-full md:w-2/3 h-105">
          <iframe
            src={`https://www.google.com/maps/embed/v1/place?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&q=Tel+Aviv,Israel&language=iw`}
            width="100%"
            height="100%"
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
