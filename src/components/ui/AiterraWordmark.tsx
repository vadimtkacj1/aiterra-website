'use client'
import Image from 'next/image'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'

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
  const containerRef = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({
    target: containerRef,
    // "start center" означает, что анимация начнется, 
    // когда верх контейнера достигнет середины экрана.
    offset: ["start center", "end start"]
  })

  // Логотип будет уходить вниз на 400px при скролле от середины до верха.
  const y = useTransform(scrollYProgress, [0, 1], [0, 400])

  return (
    <div 
      ref={containerRef} 
      className={`relative overflow-hidden w-full ${className}`.trim()}
    >
      <motion.div
        className="relative select-none pointer-events-none"
        style={{ y }}
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
    </div>
  )
}