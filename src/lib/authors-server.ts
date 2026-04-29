import fs from 'fs'
import path from 'path'
import { teamMembers } from '@/data/team-members'

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
    fs.writeFileSync(DATA_FILE, JSON.stringify(DEFAULT_AUTHORS, null, 2), 'utf-8')
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
  }
}

export function getAllAuthors(): AuthorProfile[] {
  ensureFile()
  const data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8')) as AuthorProfile[]
  const normalized = data.map(normalizeAuthor)
  const merged = normalized.map((author) => {
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
