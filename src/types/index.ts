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

/**
 * Projects have no on-site page: the grid card opens the live client site in a
 * new tab. The fields below the `liveSiteUrl` block are leftovers from the old
 * `/portfolio/[slug]` case pages — nothing renders them, they are kept so the
 * copy survives in the data files (and so reviving those pages stays cheap).
 */
export interface PortfolioProject {
  slug: string
  title: string
  category: string
  image: string
  /**
   * Tall full-page capture of the live client site (900×1800 webp) shown in the
   * portfolio grid's browser frame — it scrolls through the window on hover.
   * Falls back to `image` (static, no scroll) when absent.
   */
  screenshot?: string
  tags: string[]
  /** Alt text for the main image; defaults to `title` on the site. */
  imageAlt?: string
  /** Live client site the card links to. */
  liveSiteUrl?: string
  /** Same role as `liveSiteUrl`; used when `liveSiteUrl` is empty. */
  externalUrl?: string
  /** Sort order in the grid (lower first) — the admin drag-and-drop writes it. */
  sortOrder?: number
  // ── legacy case-page copy (not rendered) ──
  heroTitle?: string
  heroDescription?: string
  caseStudy?: string[]
  metaTitle?: string
  metaDescription?: string
  heroCtaPrimaryLabel?: string
  heroCtaPrimaryHref?: string
  heroCtaSecondaryLabel?: string
  heroCtaSecondaryHref?: string
  galleryImages?: string[]
  launchedAt?: string
  projectType?: string
  technology?: string
  challenge?: ProjectStoryBlock
  solution?: ProjectStoryBlock
  /**
   * Bump when editing a project in the repo so the reseeded version overrides
   * the stale copy in production's persistent data volume.
   */
  rev?: number
}

export interface ProjectStoryBlock {
  text: string
  image?: string
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
