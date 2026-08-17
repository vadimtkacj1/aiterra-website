'use client'

import { useState } from 'react'
import type { BlogPost } from '@/types'
import BlogCard from '@/components/ui/BlogCard'

const ALL_TAGS = ['הכל', 'SEO', 'WEBSITES', 'NEED TO KNOW'] as const

const TAG_MAP: Record<string, string[]> = {
  'SEO': ['SEO', 'קידום אורגני'],
  'WEBSITES': ['פיתוח', 'עיצוב', 'ביצועים', 'Core Web Vitals', 'Next.js', 'WordPress'],
  'NEED TO KNOW': ['מיתוג', 'דיגיטל'],
}

export default function BlogPostsSection({ posts }: { posts: BlogPost[] }) {
  const [active, setActive] = useState('הכל')

  const filtered = active === 'הכל'
    ? posts
    : posts.filter((p) => {
        const mapped = TAG_MAP[active] ?? []
        return p.tags.some((t) => mapped.includes(t))
      })

  return (
    <section className="bg-white pb-16 pt-2 md:pt-4" dir="rtl">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {ALL_TAGS.map((tag) => (
            <button
              key={tag}
              onClick={() => setActive(tag)}
              aria-pressed={active === tag}
              style={{
                fontWeight: 700,
                fontSize: '14px',
                lineHeight: '100%',
                letterSpacing: '0%',
                textAlign: 'right',
                textTransform: 'uppercase',
                padding: '12px 24px',
                transition: 'all 0.3s ease',
                border: '1px solid #2447D6',
                color: active === tag ? '#FFFFFF' : '#2447D6',
                background: active === tag
                  ? 'linear-gradient(92.63deg, #2447D6 14.57%, #3E96F9 99.27%)'
                  : 'transparent',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                minWidth: '120px'
              }}
            >
              {tag}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filtered.map((post, i) => (
            <BlogCard key={post.slug} post={post} eager={i < 4} />
          ))}
        </div>
      </div>
    </section>
  )
}