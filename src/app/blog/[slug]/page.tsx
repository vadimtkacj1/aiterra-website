import { notFound } from 'next/navigation'
import { marked } from 'marked'
import type { Metadata } from 'next'
import { Calendar, User } from 'lucide-react'
import HeaderAlt from '@/components/layout/HeaderAlt'
import Footer from '@/components/layout/Footer'
import StickyPageFooter from '@/components/layout/StickyPageFooter'
import { CtaSection } from '@/components/sections'
import { getPostBySlug, getAllPosts } from '@/lib/blog-server'
import HeroVideoBackdrop from '@/components/ui/HeroVideoBackdrop'
import Breadcrumb from '@/components/ui/Breadcrumb'
import ContactFaqSection from '@/components/sections/contact/ContactFaqSection'
import ArticleSchema from '@/components/seo/ArticleSchema'
import { SITE_NAME, SITE_URL } from '@/lib/seo'
import type { Tokens } from 'marked'

export async function generateStaticParams() {
  return getAllPosts().map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const post = getPostBySlug(slug)
  if (!post) return {}

  const canonical = `/blog/${post.slug}`
  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical },
    openGraph: {
      type: 'article',
      title: post.title,
      description: post.excerpt,
      url: `${SITE_URL}${canonical}`,
      siteName: SITE_NAME,
      locale: 'he_IL',
      publishedTime: post.datePublished,
      authors: post.author ? [post.author] : undefined,
      tags: post.tags,
      images: post.images?.[0]
        ? [{ url: post.images[0], alt: post.title }]
        : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
      images: post.images?.[0] ? [post.images[0]] : undefined,
    },
  }
}

export const dynamic = 'force-dynamic'

marked.setOptions({ breaks: true, gfm: true })
marked.use({
  renderer: {
    heading(this: { parser: { parseInline: (tokens: Tokens.Heading['tokens']) => string } }, { tokens, depth }: Tokens.Heading) {
      const level = depth === 1 ? 2 : depth
      return `<h${level}>${this.parser.parseInline(tokens)}</h${level}>\n`
    },
  },
})

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = getPostBySlug(slug)
  if (!post) notFound()

  const htmlContent = await marked(post.content || '')

  return (
    <div className="relative flex flex-col min-h-screen bg-white">
      <ArticleSchema title={post.title} datePublished={post.datePublished} urlPath={`/blog/${post.slug}`} />
      <HeaderAlt transparent />

      {/* Hero — identical structure to BlogHeroSection */}
      <div className="relative z-15 -mt-28 md:-mt-48" style={{ background: '#080112' }}>
        <section
          className="relative overflow-hidden min-h-screen flex flex-col items-center justify-center font-sans"
          dir="rtl"
          style={{ backgroundColor: '#080112' }}
        >
          <HeroVideoBackdrop />
          <div className="absolute inset-0 bg-black/40" />

          <div className="relative z-10 mx-auto flex w-full max-w-4xl flex-col items-center px-6 pt-36 pb-20 text-center md:pt-52">

            {/* Title */}
            <h1
              className="text-white font-bold mb-6"
              style={{ fontSize: 'clamp(26px, 5vw, 72px)', lineHeight: 1.1 }}
            >
              {post.title}
            </h1>

            {/* Excerpt */}
            {post.excerpt && (
              <p className="text-white/80 max-w-2xl text-base md:text-lg font-medium leading-relaxed">
                {post.excerpt}
              </p>
            )}
          </div>
        </section>
      </div>

      {/* Article content */}
      <div className="flex min-h-0 w-full flex-1 flex-col">
        <main className="relative z-20 flex-1 bg-white shadow-[0_20px_50px_rgba(0,0,0,0.1)]">
          <div className="max-w-4xl mx-auto px-6 pt-8 pb-2" dir="rtl">
            <Breadcrumb
              items={[
                { label: 'בלוג', href: '/blog' },
                { label: post.title },
              ]}
            />
          </div>
          <div className="max-w-4xl mx-auto px-6 pt-4 pb-16" dir="rtl">
            {post.content ? (
              <div className="prose-blog" dangerouslySetInnerHTML={{ __html: htmlContent }} />
            ) : (
              <p className="text-[#9ca3af] text-center py-16">אין תוכן לפוסט זה עדיין.</p>
            )}
          </div>

          {(post.tags.length > 0 || post.author.trim() || post.datePublished) && (
            <div
              className="max-w-4xl mx-auto px-6 pb-12 pt-4 border-t border-gray-100"
              dir="rtl"
            >
              {post.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 justify-center mb-8">
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 rounded-full text-[12px] font-medium text-[#1B1BB3]"
                      style={{
                        background: 'rgba(27,27,179,0.08)',
                        border: '1px solid rgba(27,27,179,0.25)',
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
              {(post.author.trim() || post.datePublished) && (
                <div className="flex flex-wrap items-center justify-center gap-6 text-[14px] text-[#6b7280]">
                  {post.author.trim() ? (
                    <span className="flex items-center gap-1.5">
                      <User size={15} aria-hidden />
                      {post.author.trim()}
                    </span>
                  ) : null}
                  {post.datePublished ? (
                    <span className="flex items-center gap-1.5">
                      <Calendar size={15} aria-hidden />
                      <time dateTime={post.datePublished}>{post.datePublished}</time>
                    </span>
                  ) : null}
                </div>
              )}
            </div>
          )}

          <CtaSection />
          {post.faq && post.faq.items.length > 0 && (
            <ContactFaqSection data={post.faq} />
          )}
        </main>
        <StickyPageFooter className="z-10">
          <Footer />
        </StickyPageFooter>
      </div>
    </div>
  )
}
