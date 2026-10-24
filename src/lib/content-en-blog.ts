import { getAllPosts, getPostBySlug, type AdminPost } from '@/lib/blog-server'
import { postsEn } from '@/lib/content-en-blog-data'
import { postsEnOnly } from '@/lib/content-en-blog-only'

export { postsEn }

const EN_ONLY_POSTS: AdminPost[] = Object.entries(postsEnOnly).map(([slug, post]) => ({
  slug,
  author: '',
  authorId: 'vadim',
  authorImage: '/images/Vadim.jpeg',
  images: [],
  ...post,
}))

export function isTranslated(slug: string): boolean {
  return Boolean(postsEn[slug])
}

export function applyPostEn(post: AdminPost): AdminPost {
  const override = postsEn[post.slug]
  return override ? { ...post, seoTitle: undefined, seoDescription: undefined, ...override } : post
}

export function getAllPostsEn(): AdminPost[] {
  const translated = getAllPosts()
    .filter((post) => isTranslated(post.slug))
    .map(applyPostEn)
  return [...translated, ...EN_ONLY_POSTS]
}

export function getPostEnBySlug(slug: string): AdminPost | null {
  const enOnly = EN_ONLY_POSTS.find((post) => post.slug === slug)
  if (enOnly) return enOnly
  if (!isTranslated(slug)) return null
  const post = getPostBySlug(slug)
  return post ? applyPostEn(post) : null
}
