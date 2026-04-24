export interface ProcessStep {
  step: string
  title: string
  description: string
}

interface Props {
  steps: ProcessStep[]
}

export default function ProcessSection({ steps }: Props) {
  return (
    <section className="bg-white font-sans">
      <div className="max-w-7xl mx-auto">
        {steps.map((s) => (
          <div
            key={s.step}
            className="flex flex-col md:flex-row items-center justify-center md:justify-between w-full px-5 md:px-[40px] py-12 md:py-16 gap-8 md:gap-0"
            dir="ltr"
          >
            <div className="shrink-0 select-none">
              <span
                className="block font-semibold leading-none text-[160px] md:text-[240.89px]"
                style={{
                  fontFamily: '"Arimo", sans-serif',
                  background: 'linear-gradient(92.63deg, #1B1BB3 14.57%, #530FAD 99.27%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                {s.step}
              </span>
            </div>

            <div className="flex flex-col gap-3 md:gap-4 text-center md:text-right max-w-[650px]" dir="rtl">
              <h3
                className="font-bold text-[20px] md:text-[48px] leading-tight md:leading-none text-[#1B1BB3] md:text-[#1D1D1D]"
              >
                {s.title}
              </h3>
              <p
                className="font-normal text-[15px] md:text-[14px] leading-relaxed text-[#1D1D1D]"
              >
                {s.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}