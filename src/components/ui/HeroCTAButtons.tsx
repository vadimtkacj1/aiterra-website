import Link from 'next/link'

const gradientStyle = 'linear-gradient(92.63deg, #1B1BB3 14.57%, #530FAD 99.27%)'

interface HeroCTAButtonsProps {
  className?: string
}

export default function HeroCTAButtons({ className = 'flex gap-4 justify-center' }: HeroCTAButtonsProps) {
  return (
    <div className={className}>
      <Link href="/contact">
        <button
          style={{ background: gradientStyle, fontFamily: "'Heebo', sans-serif" }}
          className="w-[180px] h-[55px] px-[15px] text-white font-[700] text-[14px] leading-[1.1] cursor-pointer border-none flex items-center justify-center text-center break-words whitespace-normal"
        >
          התחילו פרויקט חדש
        </button>
      </Link>

      <Link href="/portfolio">
        <div style={{ background: gradientStyle }} className="p-[1px] w-[180px] h-[55px] inline-block">
          <button
            style={{ fontFamily: "'Heebo', sans-serif" }}
            className="w-full h-full bg-white text-[#1B1BB3] font-[700] text-[14px] leading-[1.1] cursor-pointer border-none flex items-center justify-center text-center whitespace-normal"
          >
            צפו בתיק העבודות
          </button>
        </div>
      </Link>
    </div>
  )
}
