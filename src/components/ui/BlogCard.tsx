'use client'

import type { BlogPost } from '@/types'
import Image from 'next/image'
import Link from 'next/link'

interface Props {
  post: BlogPost
  /** Eager-load the image for above-the-fold cards */
  eager?: boolean
}

export default function BlogCard({ post, eager = false }: Props) {
  return (
    <Link href={`/blog/${post.slug}`} className="group block relative overflow-hidden" style={{ height: '480px' }}>
      {/* Branded gradient paints instantly; the photo covers it once loaded */}
      <div
        className="absolute inset-0"
        style={{ background: 'linear-gradient(135deg, #2447D6 0%, #3E96F9 100%)' }}
      />
      {post.image && (
        <Image
          src={post.image}
          alt={post.title}
          fill
          loading={eager ? 'eager' : 'lazy'}
          sizes="(max-width: 768px) 100vw, (max-width: 1328px) 50vw, 616px"
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />
      )}

      {/* Dark gradient overlay */}
      <div className="absolute inset-0 bg-linear-to-b from-black/10 via-black/20 to-black/75" />

      {/* Aiterra logo — top right */}
      <div className="absolute top-6 right-6 z-10">
        <Image
          src="/icons/aiterra-blog.svg"
          alt="Aiterra"
          width={80}
          height={48}
          className="object-contain"
        />
      </div>

      {/* Title — bottom */}
      <div className="absolute bottom-0 left-0 right-0 p-7 z-10" dir="rtl">
        <p className="text-white/70 text-[12px] font-medium mb-2 tracking-wide">
          {post.tags[0]}
        </p>
        <h2
          className="text-white font-black leading-tight"
          style={{ fontSize: 'clamp(20px, 3vw, 30px)' }}
        >
          {post.title}
        </h2>
      </div>
    </Link>
  )
}
