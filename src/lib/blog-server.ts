import fs from 'fs'
import path from 'path'

export interface FaqItem { q: string; a: string }
export interface PostFaq { title: string; items: FaqItem[] }

export interface AdminPost {
  slug: string
  title: string
  excerpt: string
  content: string
  /** YYYY-MM-DD; empty in API payload → saved as today */
  datePublished: string
  /** Optional; empty string if anonymous */
  author: string
  tags: string[]
  images: string[]
  faq?: PostFaq
}

function todayIsoDate(): string {
  return new Date().toISOString().split('T')[0]
}

export function normalizePostFields(p: Pick<AdminPost, 'author' | 'datePublished'>): Pick<AdminPost, 'author' | 'datePublished'> {
  return {
    author: (p.author ?? '').trim(),
    datePublished: (p.datePublished && p.datePublished.trim()) || todayIsoDate(),
  }
}

const DATA_FILE = path.join(process.cwd(), 'data', 'blog-posts.json')

function ensureFile() {
  const dir = path.dirname(DATA_FILE)
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
  if (!fs.existsSync(DATA_FILE)) fs.writeFileSync(DATA_FILE, '[]', 'utf-8')
}

export function getAllPosts(): AdminPost[] {
  ensureFile()
  return JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8')) as AdminPost[]
}

export function getPostBySlug(slug: string): AdminPost | null {
  return getAllPosts().find((p) => p.slug === slug) ?? null
}

export function createPost(post: AdminPost): AdminPost {
  const posts = getAllPosts()
  if (posts.find((p) => p.slug === post.slug)) {
    throw new Error('slug already exists')
  }
  const normalized = { ...post, ...normalizePostFields(post) }
  posts.unshift(normalized)
  fs.writeFileSync(DATA_FILE, JSON.stringify(posts, null, 2), 'utf-8')
  return normalized
}

export function updatePost(slug: string, data: Partial<AdminPost>): AdminPost {
  const posts = getAllPosts()
  const idx = posts.findIndex((p) => p.slug === slug)
  if (idx === -1) throw new Error('not found')
  const merged = { ...posts[idx], ...data }
  posts[idx] = { ...merged, ...normalizePostFields(merged) }
  fs.writeFileSync(DATA_FILE, JSON.stringify(posts, null, 2), 'utf-8')
  return posts[idx]
}

export function deletePost(slug: string): void {
  const posts = getAllPosts().filter((p) => p.slug !== slug)
  fs.writeFileSync(DATA_FILE, JSON.stringify(posts, null, 2), 'utf-8')
}
