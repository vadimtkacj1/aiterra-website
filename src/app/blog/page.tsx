import type { Metadata } from 'next'
import type { BlogPost } from '@/types'
import { metadataForRoute } from '@/lib/site-seo-server'
import RouteJsonLd from '@/components/seo/RouteJsonLd'
import BreadcrumbSchema from '@/components/seo/BreadcrumbSchema'
import HeaderAlt from '@/components/layout/HeaderAlt'
import Footer from '@/components/layout/Footer'
import StickyPageFooter from '@/components/layout/StickyPageFooter'
import { BlogHeroSection, BlogPostsSection, CtaSection } from '@/components/sections'
import Breadcrumb from '@/components/ui/Breadcrumb'
import { getAllPosts } from '@/lib/blog-server'

export async function generateMetadata(): Promise<Metadata> {
  return metadataForRoute('/blog')
}

// ISR: cached HTML, refreshed in the background; admin saves revalidate
// /blog explicitly (see api/admin/blog routes)
export const revalidate = 300

// getAllPosts() merges admin-created posts (data/blog-posts.json) with the
// bundled seed — the runtime file wins on slug conflicts
function getMergedPosts(): BlogPost[] {
  return getAllPosts()
    .map((p) => ({
      slug: p.slug,
      title: p.title,
      excerpt: p.excerpt,
      datePublished: p.datePublished,
      author: p.author || 'צוות Aiterra',
      tags: p.tags,
      image: p.images?.[0],
    }))
    .sort((a, b) => (b.datePublished || '').localeCompare(a.datePublished || ''))
}

export default function BlogPage() {
  const posts = getMergedPosts()
  return (
    <div className="relative flex flex-col min-h-screen bg-white">
      <RouteJsonLd path="/blog" />
      <BreadcrumbSchema items={[{ label: 'בלוג', href: '/blog' }]} />
      <HeaderAlt transparent />
      <div className="relative z-15 -mt-28 md:-mt-48" style={{ background: '#080112' }}>
        <BlogHeroSection />
      </div>
      <div className="flex min-h-0 w-full flex-1 flex-col">
        <main id="main-content" className="relative z-20 flex-1 bg-white shadow-[0_20px_50px_rgba(0,0,0,0.1)]">
          <div id="blog-posts" className="max-w-7xl mx-auto px-6 pt-8 pb-1" dir="rtl">
            <Breadcrumb items={[{ label: 'בלוג' }]} />
          </div>
          <BlogPostsSection posts={posts} />
          <CtaSection />
        </main>
        <StickyPageFooter className="z-10">
          <Footer />
        </StickyPageFooter>
      </div>
    </div>
  )
}
