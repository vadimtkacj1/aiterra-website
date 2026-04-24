'use client'
import Image from 'next/image'
import { motion } from 'framer-motion'

interface AiterraWordmarkProps {
  height?: number
  priority?: boolean
  className?: string
  src?: string
}

export default function AiterraWordmark({
  height = 300,
  priority,
  className = '',
  src = '/images/hero/hero-aiterra.png',
}: AiterraWordmarkProps) {
  return (
    <motion.div
      className={`relative overflow-hidden select-none pointer-events-none w-full ${className}`.trim()}
      initial={{ y: 80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
    >
      <Image
        src={src}
        alt="AITERRA"
        width={1920}
        height={height}
        className="w-full h-auto object-contain px-4"
        priority={priority}
      />
    </motion.div>
  )
}
