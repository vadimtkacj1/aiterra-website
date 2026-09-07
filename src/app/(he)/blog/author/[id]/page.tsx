import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import type { BlogPost } from '@/types'
import HeaderAlt from '@/components/layout/HeaderAlt'
import Footer from '@/components/layout/Footer'
import StickyPageFooter from '@/components/layout/StickyPageFooter'
import { CtaSection } from '@/components/sections'
import HeroVideoBackdrop from '@/components/ui/HeroVideoBackdrop'
import Breadcrumb from '@/components/ui/Breadcrumb'
import BlogCard from '@/components/ui/BlogCard'
import JsonLd from '@/components/seo/JsonLd'
import BreadcrumbSchema from '@/components/seo/BreadcrumbSchema'
import { getAllAuthors, getAuthorById } from '@/lib/authors-server'
import { getAllPosts } from '@/lib/blog-server'
import { SITE_NAME, SITE_URL } from '@/lib/seo'

// ISR: cached HTML, refreshed in the background; author/blog edits in admin
// revalidate the relevant paths.
export const revalidate = 300

export function generateStaticParams() {
  return getAllAuthors().map((a) => ({ id: a.id }))
}

function postsByAuthor(id: string, name: string): BlogPost[] {
  return getAllPosts()
    .filter((p) => p.authorId === id || (p.author?.trim() && p.author.trim() === name))
    .map((p) => ({
      slug: p.slug,
      title: p.title,
      excerpt: p.excerpt,
      datePublished: p.datePublished,
      author: p.author || name,
      tags: p.tags,
      image: p.images?.[0],
    }))
    .sort((a, b) => (b.datePublished || '').localeCompare(a.datePublished || ''))
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params
  const author = getAuthorById(id)
  if (!author) return {}
  const canonical = `/blog/author/${author.id}`
  const title = `${author.name} – ${author.role} | ${SITE_NAME}`
  return {
    title,
    description: author.bio || `${author.name}, ${author.role} ב-${SITE_NAME}.`,
    alternates: { canonical },
    openGraph: {
      type: 'profile',
      title,
      description: author.bio || undefined,
      url: `${SITE_URL}${canonical}`,
      siteName: SITE_NAME,
      locale: 'he_IL',
      images: author.image ? [{ url: author.image, alt: author.name }] : undefined,
    },
  }
}

export default async function AuthorPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const author = getAuthorById(id)
  if (!author) notFound()

  const posts = postsByAuthor(author.id, author.name)
  const absolute = (u?: string) => (u ? (u.startsWith('http') ? u : `${SITE_URL}${u}`) : undefined)
  const sameAs = [author.socials?.linkedin, author.socials?.instagram, author.socials?.facebook].filter(
    (u): u is string => Boolean(u),
  )
  const authorUrl = `${SITE_URL}/blog/author/${author.id}`

  const personData = {
    '@context': 'https://schema.org',
    '@type': 'ProfilePage',
    mainEntity: {
      '@type': 'Person',
      '@id': `${authorUrl}#person`,
      name: author.name,
      jobTitle: author.role || undefined,
      description: author.bio || undefined,
      ...(absolute(author.image) ? { image: absolute(author.image) } : {}),
      url: authorUrl,
      ...(sameAs.length ? { sameAs } : {}),
      worksFor: { '@type': 'Organization', '@id': `${SITE_URL}#organization`, name: SITE_NAME },
    },
  }

  return (
    <div className="relative flex flex-col min-h-screen bg-white">
      <JsonLd data={personData} />
      <BreadcrumbSchema
        items={[
          { label: 'בלוג', href: '/blog' },
          { label: author.name, href: `/blog/author/${author.id}` },
        ]}
      />
      <HeaderAlt transparent />

      {/* Hero */}
      <div className="relative z-15 -mt-28 md:-mt-48" style={{ background: '#060B22' }}>
        <section
          className="relative overflow-hidden min-h-[60vh] flex flex-col items-center justify-center font-sans"
          dir="rtl"
          style={{ backgroundColor: '#060B22' }}
        >
          <HeroVideoBackdrop />
          <div className="absolute inset-0 bg-black/40" />
          <div className="relative z-10 mx-auto flex w-full max-w-4xl flex-col items-center px-6 pt-36 pb-16 text-center md:pt-52">
            {author.image && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={author.image}
                alt={author.name}
                className="w-24 h-24 md:w-28 md:h-28 rounded-full object-cover border-2 border-white/30 mb-5"
              />
            )}
            <h1 className="text-white font-bold mb-3" style={{ fontSize: 'clamp(26px, 4vw, 52px)', lineHeight: 1.1 }}>
              {author.name}
            </h1>
            {author.role && <p className="text-white/80 text-base md:text-lg font-medium">{author.role}</p>}
          </div>
        </section>
      </div>

      {/* Content */}
      <div className="flex min-h-0 w-full flex-1 flex-col">
        <main id="main-content" className="relative z-20 flex-1 bg-white shadow-[0_20px_50px_rgba(0,0,0,0.1)]">
          <div className="max-w-4xl mx-auto px-6 pt-8 pb-2" dir="rtl">
            <Breadcrumb items={[{ label: 'בלוג', href: '/blog' }, { label: author.name }]} />
          </div>

          {author.bio && (
            <div className="max-w-3xl mx-auto px-6 pt-4 pb-8" dir="rtl">
              <p className="text-[#374151] text-base md:text-lg leading-relaxed">{author.bio}</p>
              {sameAs.length > 0 && (
                <div className="flex items-center gap-4 mt-5">
                  {author.socials?.linkedin && (
                    <a href={author.socials.linkedin} target="_blank" rel="noopener noreferrer" className="text-[#6b7280] hover:text-[#2447D6] text-[14px] font-semibold">
                      LinkedIn
                    </a>
                  )}
                  {author.socials?.instagram && (
                    <a href={author.socials.instagram} target="_blank" rel="noopener noreferrer" className="text-[#6b7280] hover:text-[#2447D6] text-[14px] font-semibold">
                      Instagram
                    </a>
                  )}
                  {author.socials?.facebook && (
                    <a href={author.socials.facebook} target="_blank" rel="noopener noreferrer" className="text-[#6b7280] hover:text-[#2447D6] text-[14px] font-semibold">
                      Facebook
                    </a>
                  )}
                </div>
              )}
            </div>
          )}

          <div className="max-w-7xl mx-auto px-6 pt-2 pb-16" dir="rtl">
            <h2 className="text-[#111827] font-bold text-xl md:text-2xl mb-6">מאמרים מאת {author.name}</h2>
            {posts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {posts.map((post) => (
                  <BlogCard key={post.slug} post={post} />
                ))}
              </div>
            ) : (
              <p className="text-[#9ca3af]">אין עדיין מאמרים מאת כותב זה.</p>
            )}
          </div>

          <CtaSection />
        </main>
        <StickyPageFooter className="z-10">
          <Footer />
        </StickyPageFooter>
      </div>
    </div>
  )
}
