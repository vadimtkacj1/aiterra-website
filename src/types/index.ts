export interface Service {
  slug: string
  upperTitle: string
  title: string
  heroTitle: string
  heroDescription: string
  description: string
  icon: string
  image: string
  cta?: string
}

export interface PortfolioProject {
  slug: string
  title: string
  category: string
  heroTitle: string
  heroDescription: string
  image: string
  tags: string[]
  link?: string
}

export interface BlogPost {
  slug: string
  title: string
  excerpt: string
  datePublished: string
  author: string
  tags: string[]
  image?: string
}
