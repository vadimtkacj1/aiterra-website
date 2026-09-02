import fs from 'fs'
import path from 'path'
import { readJsonFile } from './read-json-file'
import { teamMembers } from '@/data/team-members'
import seedAuthorsJson from '@/data/authors-seed.json'

export interface AuthorSocials {
  linkedin?: string
  instagram?: string
  facebook?: string
}

export interface AuthorProfile {
  id: string
  name: string
  role: string
  bio?: string
  image: string
  socials: AuthorSocials
  /**
   * Bump when editing an author in the repo so the reseeded version overrides a
   * stale copy in production's persistent data volume (see getAllAuthors merge).
   */
  rev?: number
}

const DATA_FILE = path.join(process.cwd(), 'data', 'authors.json')

const DEFAULT_AUTHORS: AuthorProfile[] = teamMembers.map((member) => ({
  id: member.id,
  name: member.name,
  role: member.role,
  bio: member.bio,
  image: member.image,
  socials: {},
}))

// Snapshot of data/authors.json copied into src/ by scripts/sync-data-seeds.mjs
// (runs on every build via `prebuild`). Shipping it inside the server build means
// a stale/fresh persistent volume mounted over data/ can never hide author data
// committed to the repo — the same protection blog-server gives posts.
const SEED_AUTHORS: AuthorProfile[] = (seedAuthorsJson as AuthorProfile[]).map((a) =>
  normalizeAuthor(a),
)
const SEED_BY_ID = new Map(SEED_AUTHORS.map((a) => [a.id, a]))

function slugifyId(value: string): string {
  return value
    .toLowerCase()
    .replace(/\((.*?)\)/g, '$1')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
}

function ensureFile() {
  const dir = path.dirname(DATA_FILE)
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
  if (!fs.existsSync(DATA_FILE)) {
    // Seed a fresh/empty volume from the committed snapshot (rich bios + socials),
    // not from the bare team-members fallback.
    const initial = SEED_AUTHORS.length ? SEED_AUTHORS : DEFAULT_AUTHORS
    fs.writeFileSync(DATA_FILE, JSON.stringify(initial, null, 2), 'utf-8')
  }
}

function normalizeAuthor(author: AuthorProfile): AuthorProfile {
  const normalizedName = (author.name ?? '').trim()
  const nameBasedId = slugifyId(normalizedName)
  const rawId = (author.id ?? '').trim().toLowerCase()
  return {
    id: rawId || nameBasedId,
    name: normalizedName,
    role: (author.role ?? '').trim(),
    bio: (author.bio ?? '').trim(),
    image: (author.image ?? '').trim(),
    socials: {
      linkedin: (author.socials?.linkedin ?? '').trim().toLowerCase(),
      instagram: (author.socials?.instagram ?? '').trim().toLowerCase(),
      facebook: (author.socials?.facebook ?? '').trim().toLowerCase(),
    },
    ...(author.rev !== undefined ? { rev: author.rev } : {}),
  }
}

export function getAllAuthors(): AuthorProfile[] {
  ensureFile()
  const data = readJsonFile<AuthorProfile[]>(DATA_FILE, [])
  const normalized = data.map(normalizeAuthor)
  // Seed override: a committed seed with a higher `rev` beats the volume copy, so
  // repo edits survive a stale production data volume (mirrors getAllPosts).
  const withSeed = normalized.map((author) => {
    const seed = SEED_BY_ID.get(author.id)
    return seed && (seed.rev ?? 0) > (author.rev ?? 0) ? seed : author
  })
  // Authors present only in the committed seed (missing from a stale volume).
  for (const seed of SEED_BY_ID.values()) {
    if (!withSeed.some((author) => author.id === seed.id)) withSeed.push(seed)
  }
  const merged = withSeed.map((author) => {
    const fallback = DEFAULT_AUTHORS.find((item) => item.id === author.id)
    if (!fallback) return author

    const isNameSameAsId = author.name.trim().toLowerCase() === author.id
    return {
      ...author,
      name: !author.name || isNameSameAsId ? fallback.name : author.name,
      role: author.role || fallback.role,
      bio: author.bio || fallback.bio,
      image: author.image || fallback.image,
    }
  })

  for (const teamMember of DEFAULT_AUTHORS) {
    if (!merged.some((author) => author.id === teamMember.id)) {
      merged.push(teamMember)
    }
  }

  const order = DEFAULT_AUTHORS.map((member) => member.id)
  const orderIndex = new Map(order.map((id, idx) => [id, idx]))

  return [...merged].sort((a, b) => {
    const ai = orderIndex.get(a.id)
    const bi = orderIndex.get(b.id)
    if (ai === undefined && bi === undefined) return a.name.localeCompare(b.name)
    if (ai === undefined) return 1
    if (bi === undefined) return -1
    return ai - bi
  })
}

export function saveAllAuthors(authors: AuthorProfile[]): AuthorProfile[] {
  const normalized = authors.map(normalizeAuthor)
  fs.writeFileSync(DATA_FILE, JSON.stringify(normalized, null, 2), 'utf-8')
  return normalized
}

export function getAuthorById(id: string): AuthorProfile | null {
  return getAllAuthors().find((a) => a.id === id) ?? null
}

export function upsertAuthor(id: string, data: AuthorProfile): AuthorProfile {
  const authors = getAllAuthors()
  const normalized = normalizeAuthor({ ...data, id })
  const index = authors.findIndex((a) => a.id === id)
  if (index >= 0) authors[index] = normalized
  else authors.push(normalized)
  saveAllAuthors(authors)
  return normalized
}

export function deleteAuthor(id: string): void {
  const authors = getAllAuthors().filter((a) => a.id !== id)
  saveAllAuthors(authors)
}
