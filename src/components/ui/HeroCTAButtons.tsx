import Link from 'next/link'
import ReactDOM from 'react-dom'

const gradientStyle = 'linear-gradient(92.63deg, #2447D6 14.57%, #3E96F9 99.27%)'

interface HeroCTAButtonsProps {
  className?: string
}

export default function HeroCTAButtons({ className = 'flex gap-4 justify-center' }: HeroCTAButtonsProps) {
  ReactDOM.preload('/fonts/GoogleSans/GoogleSans-VariableFont_wght.woff2', {
    as: 'font',
    type: 'font/woff2',
    crossOrigin: 'anonymous',
  })

  return (
    <div className={className}>
      <Link
        href="/contact"
        style={{ background: gradientStyle, fontFamily: "'Google Sans', sans-serif" }}
        className="w-[180px] h-[55px] px-[15px] text-white font-[700] text-[14px] leading-[1.1] flex items-center justify-center text-center break-words whitespace-normal"
      >
        התחילו פרויקט חדש
      </Link>

      <div style={{ background: gradientStyle }} className="p-[1px] w-[180px] h-[55px] inline-block">
        <Link
          href="/portfolio"
          style={{ fontFamily: "'Google Sans', sans-serif" }}
          className="w-full h-full bg-white text-[#2447D6] font-[700] text-[14px] leading-[1.1] flex items-center justify-center text-center whitespace-normal"
        >
          צפו בתיק העבודות
        </Link>
      </div>
    </div>
  )
}
