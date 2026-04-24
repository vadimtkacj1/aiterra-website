'use client'

import { useState } from 'react'
import { blogPosts } from '@/data/blog'
import BlogCard from '@/components/ui/BlogCard'

const ALL_TAGS = ['הכל', 'NEED TO KNOW', 'SEO', 'WEBSITES']

export default function BlogPostsSection() {
  const [active, setActive] = useState('הכל')

  const filtered = active === 'הכל'
    ? blogPosts
    : blogPosts.filter((p) => p.tags.some(t => t.toUpperCase() === active))

  return (
    <section id="blog-posts" className="bg-white py-16" dir="rtl">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {ALL_TAGS.map((tag) => (
            <button
              key={tag}
              onClick={() => setActive(tag)}
              style={{
                fontWeight: 700,
                fontSize: '14px',
                lineHeight: '100%',
                letterSpacing: '0%',
                textAlign: 'right',
                textTransform: 'uppercase',
                padding: '12px 24px',
                transition: 'all 0.3s ease',
                border: '1px solid #1B1BB3',
                color: active === tag ? '#FFFFFF' : '#1B1BB3',
                background: active === tag
                  ? 'linear-gradient(92.63deg, #1B1BB3 14.57%, #530FAD 99.27%)'
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
          {filtered.map((post) => (
            <BlogCard key={post.slug} post={post} />
          ))}
        </div>
      </div>
    </section>
  )
}