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
  /** If set, the project detail image links to this URL (e.g. live client site). */
  liveSiteUrl?: string
  /**
   * When set, the portfolio grid opens this URL (new tab) and `/portfolio/[slug]`
   * redirects there — no on-site case page.
   */
  externalUrl?: string
  /** Optional long-form case study shown on the project page (RTL paragraphs). */
  caseStudy?: string[]
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
