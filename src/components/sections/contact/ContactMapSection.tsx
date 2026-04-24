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
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d108517.41099898844!2d34.72948365!3d32.0879502!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x151d4ca6173c4cdb%3A0x6b3c5511a9d32957!2sTel%20Aviv-Yafo!5e0!3m2!1siw!2sil!4v1716000000000"
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
