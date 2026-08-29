type Tagged = { title: string; tags: string[] }

type BlogFilters = {
  filters: readonly { tag: string; match: readonly string[] }[]
  defaultTag: string
}

export const matchesKeywords = (post: Tagged, keywords: readonly string[]) => {
  if (keywords.length === 0) return true
  const haystack = [post.title, ...post.tags].join(' ').toLowerCase()
  return keywords.some((keyword) => haystack.includes(keyword.toLowerCase()))
}

export const categoryTag = (post: Tagged, blog: BlogFilters) => {
  const filter = blog.filters.find((entry) => entry.match.length > 0 && matchesKeywords(post, entry.match))
  return filter?.tag ?? blog.defaultTag
}

export const readingMinutes = (content: string) => {
  const words = content.replace(/<[^>]+>/g, ' ').split(/\s+/).filter(Boolean).length
  return Math.max(1, Math.round(words / 200))
}

const dateFormat = new Intl.DateTimeFormat('he-IL', { day: 'numeric', month: 'long', year: 'numeric' })

export const formatPostDate = (iso: string) => {
  const date = new Date(iso)
  return Number.isNaN(date.getTime()) ? iso : dateFormat.format(date)
}
