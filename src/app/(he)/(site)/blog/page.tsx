import type { Metadata } from 'next'
import Header from '../components/Header'
import PageHero from '../components/PageHero'
import PageCrumbs from '../components/PageCrumbs'
import BlogIndex, { type BlogCard } from '../components/BlogIndex'
import ContactForm from '../components/ContactForm'
import Footer from '../components/Footer'
import { getAllPosts } from '@/lib/blog-server'
import { formatPostDate, readingMinutes } from '../blogCategory'
import { getV2Content } from '@/lib/v2-content-server'
import { pageMetadata } from '@/lib/metadata'
import JsonLd from '@/components/seo/JsonLd'
import { breadcrumbList, webPage } from '@/lib/schema'

export function generateMetadata(): Metadata {
  const { blog } = getV2Content()
  return pageMetadata({
    title: blog.metaTitle,
    description: blog.metaDescription,
    path: '/blog',
  })
}

export const revalidate = 300

function loadCards(defaultAuthor: string): BlogCard[] {
  return getAllPosts()
    .sort((a, b) => (b.datePublished || '').localeCompare(a.datePublished || ''))
    .map((post) => ({
      slug: post.slug,
      title: post.title,
      excerpt: post.excerpt,
      date: formatPostDate(post.datePublished),
      author: post.author || defaultAuthor,
      authorImage: post.authorImage || '',
      image: post.images?.[0] || '',
      tags: post.tags,
      minutes: readingMinutes(post.content),
    }))
}

export default function V2BlogPage() {
  const { blog } = getV2Content()
  const posts = loadCards(blog.defaultAuthor)

  return (
    <>
      <JsonLd data={webPage({
        path: '/blog',
        name: blog.metaTitle,
        description: blog.metaDescription,
        type: 'CollectionPage',
      })} />
      <JsonLd data={breadcrumbList([
        { name: blog.crumbHome, path: '/' },
        { name: blog.title, path: '/blog' },
      ])} />
      <Header />
      <main id="main-content">
        <PageHero title={blog.title} lede={blog.lede} headingId="v2-blog-heading" />
        <BlogIndex posts={posts} />
      </main>
      <Footer>
        <ContactForm variant="footer" source="v2-blog" />
      </Footer>
    </>
  )
}
