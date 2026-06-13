import fs from 'fs'
import path from 'path'
import seedPostsJson from '@/data/blog-seed.json'

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
  /** Optional relation to managed author entity */
  authorId?: string
  /** Optional author avatar url shown at post bottom */
  authorImage?: string
  tags: string[]
  images: string[]
  faq?: PostFaq
  /**
   * Bump when editing a post in the repo so the reseeded version overrides the
   * stale copy in production's persistent data volume (see getAllPosts merge).
   */
  rev?: number
}

function todayIsoDate(): string {
  return new Date().toISOString().split('T')[0]
}

export function normalizePostFields(
  p: Pick<AdminPost, 'author' | 'authorId' | 'authorImage' | 'datePublished'>,
): Pick<AdminPost, 'author' | 'authorId' | 'authorImage' | 'datePublished'> {
  return {
    author: (p.author ?? '').trim(),
    authorId: (p.authorId ?? '').trim(),
    authorImage: (p.authorImage ?? '').trim(),
    datePublished: (p.datePublished && p.datePublished.trim()) || todayIsoDate(),
  }
}

const DATA_FILE = path.join(process.cwd(), 'data', 'blog-posts.json')
const DELETED_FILE = path.join(process.cwd(), 'data', 'blog-deleted-slugs.json')

// Snapshot of data/blog-posts.json copied into src/ by scripts/sync-blog-seed.mjs
// (runs on every build via `prebuild`). It ships inside the server build, so a
// stale persistent volume mounted over data/ can never hide posts committed to
// the repo — every committed post resolves after a deploy.
const SEED_POSTS = seedPostsJson as AdminPost[]

function ensureFile() {
  const dir = path.dirname(DATA_FILE)
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
  if (!fs.existsSync(DATA_FILE)) fs.writeFileSync(DATA_FILE, '[]', 'utf-8')
}

function readPostsFile(): AdminPost[] {
  ensureFile()
  return JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8')) as AdminPost[]
}

function writePostsFile(posts: AdminPost[]) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(posts, null, 2), 'utf-8')
}

// Tombstones let the admin delete a seed post — otherwise the seed would
// resurrect it on the next read.
function readDeletedSlugs(): Set<string> {
  if (!fs.existsSync(DELETED_FILE)) return new Set()
  try {
    return new Set(JSON.parse(fs.readFileSync(DELETED_FILE, 'utf-8')) as string[])
  } catch {
    return new Set()
  }
}

function writeDeletedSlugs(slugs: Set<string>) {
  fs.writeFileSync(DELETED_FILE, JSON.stringify([...slugs], null, 2), 'utf-8')
}

function clearTombstone(slug: string) {
  const deleted = readDeletedSlugs()
  if (deleted.delete(slug)) writeDeletedSlugs(deleted)
}

const SEED_BY_SLUG = new Map(SEED_POSTS.map((p) => [p.slug, p]))

/**
 * Runtime store merged with the build-time seed. The file wins on slug
 * conflicts, unless the seed carries a higher `rev` — that means the post was
 * edited in the repo after the runtime copy was written, so the seed wins.
 */
export function getAllPosts(): AdminPost[] {
  const filePosts = readPostsFile()
  const fileSlugs = new Set(filePosts.map((p) => p.slug))
  const deleted = readDeletedSlugs()
  const merged = filePosts.map((p) => {
    const seed = SEED_BY_SLUG.get(p.slug)
    return seed && (seed.rev ?? 0) > (p.rev ?? 0) ? seed : p
  })
  const seedOnly = SEED_POSTS.filter((p) => !fileSlugs.has(p.slug) && !deleted.has(p.slug))
  return [...merged, ...seedOnly]
}

export function getPostBySlug(slug: string): AdminPost | null {
  return getAllPosts().find((p) => p.slug === slug) ?? null
}

export function createPost(post: AdminPost): AdminPost {
  if (getAllPosts().find((p) => p.slug === post.slug)) {
    throw new Error('slug already exists')
  }
  const posts = readPostsFile()
  const normalized = { ...post, ...normalizePostFields(post) }
  posts.unshift(normalized)
  writePostsFile(posts)
  clearTombstone(post.slug)
  return normalized
}

export function updatePost(slug: string, data: Partial<AdminPost>): AdminPost {
  const posts = readPostsFile()
  const idx = posts.findIndex((p) => p.slug === slug)
  if (idx === -1) {
    // Seed-only post — materialize it into the runtime store with the update applied
    const seed = SEED_POSTS.find((p) => p.slug === slug)
    if (!seed) throw new Error('not found')
    const merged = { ...seed, ...data }
    const normalized = { ...merged, ...normalizePostFields(merged) }
    posts.unshift(normalized)
    writePostsFile(posts)
    clearTombstone(slug)
    return normalized
  }
  const merged = { ...posts[idx], ...data }
  posts[idx] = { ...merged, ...normalizePostFields(merged) }
  writePostsFile(posts)
  return posts[idx]
}

export function deletePost(slug: string): void {
  writePostsFile(readPostsFile().filter((p) => p.slug !== slug))
  if (SEED_POSTS.some((p) => p.slug === slug)) {
    const deleted = readDeletedSlugs()
    deleted.add(slug)
    writeDeletedSlugs(deleted)
  }
}
