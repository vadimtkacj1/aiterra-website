import { getAllPosts, getPostBySlug, type AdminPost } from '@/lib/blog-server'
import { postsEn } from '@/lib/content-en-blog-data'

export { postsEn }

export function isTranslated(slug: string): boolean {
  return Boolean(postsEn[slug])
}

export function applyPostEn(post: AdminPost): AdminPost {
  const override = postsEn[post.slug]
  return override ? { ...post, ...override } : post
}

export function getAllPostsEn(): AdminPost[] {
  return getAllPosts()
    .filter((post) => isTranslated(post.slug))
    .map(applyPostEn)
}

export function getPostEnBySlug(slug: string): AdminPost | null {
  if (!isTranslated(slug)) return null
  const post = getPostBySlug(slug)
  return post ? applyPostEn(post) : null
}
