import type { Metadata } from 'next'
import Header from '../../../(he)/v2/components/Header'
import PageHero from '../../../(he)/v2/components/PageHero'
import BlogIndex, { type BlogCard } from '../../../(he)/v2/components/BlogIndex'
import ContactForm from '../../../(he)/v2/components/ContactForm'
import Footer from '../../../(he)/v2/components/Footer'
import { getAllPostsEn } from '@/lib/content-en-blog'
import { formatPostDate, readingMinutes } from '../../../(he)/v2/blogCategory'
import { getV2ContentEn } from '@/lib/v2-content-server'
import { pageMetadata } from '@/lib/metadata'
import JsonLd from '@/components/seo/JsonLd'
import { breadcrumbList, webPage } from '@/lib/schema'

export function generateMetadata(): Metadata {
  const { blog } = getV2ContentEn()
  return pageMetadata({
    title: blog.metaTitle,
    description: blog.metaDescription,
    path: '/en/blog',
    locale: 'en',
    altPath: '/blog',
  })
}

export const revalidate = 300

function loadCards(defaultAuthor: string): BlogCard[] {
  return getAllPostsEn()
    .sort((a, b) => (b.datePublished || '').localeCompare(a.datePublished || ''))
    .map((post) => ({
      slug: post.slug,
      title: post.title,
      excerpt: post.excerpt,
      date: formatPostDate(post.datePublished, 'en'),
      author: post.author || defaultAuthor,
      authorImage: post.authorImage || '',
      image: post.images?.[0] || '',
      tags: post.tags,
      minutes: readingMinutes(post.content),
    }))
}

export default function EnBlogPage() {
  const { blog } = getV2ContentEn()
  const posts = loadCards(blog.defaultAuthor)

  return (
    <>
      <JsonLd
        data={webPage({
          path: '/en/blog',
          name: blog.metaTitle,
          description: blog.metaDescription,
          type: 'CollectionPage',
          locale: 'en',
        })}
      />
      <JsonLd
        data={breadcrumbList([
          { name: blog.crumbHome, path: '/en' },
          { name: blog.title, path: '/en/blog' },
        ])}
      />
      <Header />
      <main id="main-content">
        <PageHero title={blog.title} lede={blog.lede} headingId="en-blog-heading" locale="en" />
        <BlogIndex posts={posts} locale="en" />
      </main>
      <Footer locale="en">
        <ContactForm variant="footer" source="en-blog" />
      </Footer>
    </>
  )
}
