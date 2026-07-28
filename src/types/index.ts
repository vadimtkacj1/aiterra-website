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
  /**
   * Tall full-page capture of the live client site (900×1800 webp) shown in the
   * portfolio grid's browser frame — it scrolls through the window on hover.
   * Falls back to `image` (static, no scroll) when absent.
   */
  screenshot?: string
  tags: string[]
  /** When false, no individual project page is created (grid-only item). */
  hasPage?: boolean
  /** If set, the project detail image links to this URL (e.g. live client site). */
  liveSiteUrl?: string
  /**
   * When set, the portfolio grid opens this URL (new tab) and `/portfolio/[slug]`
   * redirects there — no on-site case page.
   */
  externalUrl?: string
  /** Optional long-form case study shown on the project page (RTL paragraphs). */
  caseStudy?: string[]
  /** Alt text for the main image; defaults to `title` on the site. */
  imageAlt?: string
  /** `<title>` override for SEO; defaults to `title | תיק עבודות | Aiterra`. */
  metaTitle?: string
  /** Meta description override; defaults to `heroDescription`. */
  metaDescription?: string
  /** Primary hero CTA (defaults: label "התחילו פרויקט דומה", `/contact`). */
  heroCtaPrimaryLabel?: string
  heroCtaPrimaryHref?: string
  /** Secondary hero CTA (defaults: label "כל הפרויקטים", `/portfolio`). */
  heroCtaSecondaryLabel?: string
  heroCtaSecondaryHref?: string
  /** Extra images below the case study block on the project page. */
  galleryImages?: string[]
  /** Sort order in lists (lower first). Same value keeps JSON order. */
  sortOrder?: number
  /**
   * Bump when editing a project in the repo so the reseeded version overrides
   * the stale copy in production's persistent data volume.
   */
  rev?: number
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
