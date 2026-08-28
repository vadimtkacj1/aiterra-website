import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { marked, type Tokens } from 'marked'
import Header from '../../components/Header'
import ArticleToc, { type TocEntry } from '../../components/ArticleToc'
import ShareButton from '../../components/ShareButton'
import ActionButton from '../../components/ActionButton'
import RelatedPosts from '../../components/RelatedPosts'
import ContactForm from '../../components/ContactForm'
import Footer from '../../components/Footer'
import type { BlogCard } from '../../components/BlogIndex'
import { ChevronPrevIcon } from '../../components/icons'
import { getAllPosts, getPostBySlug } from '@/lib/blog-server'
import { getAuthorById } from '@/lib/authors-server'
import { categoryTag, formatPostDate, matchesKeywords, readingMinutes } from '../../blogCategory'
import { article, blog, contact } from '../../content'
import styles from '../../components/Article.module.css'

export const revalidate = 300

type Params = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params
  const post = getPostBySlug(slug)
  if (!post) return {}
  return {
    title: `${post.title} — AITERRA`,
    description: post.excerpt,
    }
}

const renderArticle = (markdown: string, cover: string) => {
  const toc: TocEntry[] = []
  const renderer = new marked.Renderer()
  const parser = new marked.Parser()
  renderer.parser = parser

  const heading = ({ tokens, depth }: Tokens.Heading) => {
    const level = depth === 1 ? 2 : depth
    const text = parser.parseInline(tokens)
    if (level === 2) {
      const id = `section-${toc.length + 1}`
      toc.push({ id, label: text.replace(/<[^>]+>/g, '') })
      return `<h2 id="${id}">${text}</h2>\n`
    }
    return `<h${level}>${text}</h${level}>\n`
  }

  const image = ({ href, text, title }: Tokens.Image) => {
    if (cover && href === cover) return ''
    const alt = text ? ` alt="${text}"` : ' alt=""'
    const caption = title ? ` title="${title}"` : ''
    return `<img src="${href}"${alt}${caption} loading="lazy" />`
  }

  const html = marked.parse(markdown, { breaks: true, gfm: true, async: false, renderer: Object.assign(renderer, { heading, image }) })
  return { html, toc }
}

const toCard = (post: ReturnType<typeof getAllPosts>[number]): BlogCard => ({
  slug: post.slug,
  title: post.title,
  excerpt: post.excerpt,
  date: formatPostDate(post.datePublished),
  author: post.author || blog.defaultAuthor,
  authorImage: post.authorImage || '',
  image: post.images?.[0] || '',
  tags: post.tags,
  minutes: readingMinutes(post.content),
})

export default async function V2ArticlePage({ params }: Params) {
  const { slug } = await params
  const post = getPostBySlug(slug)
  if (!post) notFound()

  const profile = post.authorId ? getAuthorById(post.authorId) : null
  const authorName = post.author.trim() || profile?.name || blog.defaultAuthor
  const authorImage = post.authorImage?.trim() || profile?.image || ''
  const authorBio = profile?.bio || (profile?.role ? `${authorName} — ${profile.role}` : authorName)
  const { html, toc } = renderArticle(post.content || '', post.images?.[0] || '')
  const category = categoryTag(post)
  const minutes = readingMinutes(post.content || '')

  const filter = blog.filters.find((entry) => entry.tag === category)
  const others = getAllPosts()
    .filter((entry) => entry.slug !== post.slug)
    .sort((a, b) => (b.datePublished || '').localeCompare(a.datePublished || ''))
  const related = [
    ...others.filter((entry) => filter && filter.match.length > 0 && matchesKeywords(entry, filter.match)),
    ...others.filter((entry) => !(filter && filter.match.length > 0 && matchesKeywords(entry, filter.match))),
  ]
    .slice(0, 9)
    .map(toCard)

  return (
    <>
      <Header />
      <main id="main-content">
        <article className={styles.article}>
          <div className={styles.inner}>
            <nav className={styles.crumbs} aria-label={blog.crumbsLabel}>
              <Link href="/v2" className={styles.crumbLink}>
                {blog.crumbHome}
              </Link>
              <ChevronPrevIcon className={styles.crumbChevron} />
              <Link href="/v2/blog" className={styles.crumbLink}>
                {blog.title}
              </Link>
              <ChevronPrevIcon className={styles.crumbChevron} />
              <span className={styles.crumbCurrent} aria-current="page">
                {post.title}
              </span>
            </nav>

            <header className={styles.head}>
              <p className={styles.meta}>
                <span className={styles.category}>{category}</span>
                <span className={styles.metaDot} aria-hidden="true" />
                <span>
                  {minutes} {blog.readTime}
                </span>
              </p>
              <h1 className={styles.title}>{post.title}</h1>
              <div className={styles.byline}>
                <ShareButton title={post.title} />
                <span>
                  {article.publishedPrefix} {formatPostDate(post.datePublished)}
                </span>
              </div>
              {post.excerpt ? <p className={styles.lede}>{post.excerpt}</p> : null}
            </header>

            {post.images?.[0] ? (
              <figure className={styles.cover}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={post.images[0]} alt="" className={styles.coverImage} />
              </figure>
            ) : null}

            <div className={styles.layout}>
              <aside className={[styles.aside, styles.asideStart].join(' ')}>
                <ArticleToc entries={toc} />
              </aside>

              <div className={styles.main}>
                <div className={styles.tocMobile}>
                  <ArticleToc entries={toc} collapsible />
                </div>

                <div className={styles.author}>
                  {authorImage ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={authorImage} alt="" className={styles.avatar} />
                  ) : (
                    <span className={styles.avatarBlank} aria-hidden="true">
                      {authorName.slice(0, 1)}
                    </span>
                  )}
                  <span className={styles.authorText}>
                    <span className={styles.authorLabel}>{article.authorLabel}</span>
                    <span className={styles.authorBio}>{authorBio}</span>
                  </span>
                </div>

                <div className={styles.prose} dangerouslySetInnerHTML={{ __html: html }} />
              </div>

              <aside className={[styles.aside, styles.asideEnd].join(' ')}>
                <div className={styles.promo}>
                  <div className={styles.promoArt}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={contact.art.src} alt="" className={styles.promoImage} loading="lazy" />
                    <p className={styles.promoCaption}>
                      {contact.art.caption.map((line) => (
                        <span key={line} className={styles.promoLine}>
                          {line}
                        </span>
                      ))}
                    </p>
                  </div>
                  <ActionButton href="#v2-contact" label={article.promoLabel} className={styles.promoAction} />
                </div>
              </aside>
            </div>
          </div>
        </article>

        <RelatedPosts posts={related} />
      </main>
      <Footer>
        <ContactForm variant="footer" />
      </Footer>
    </>
  )
}
