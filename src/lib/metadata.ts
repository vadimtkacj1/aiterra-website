import type { Metadata } from 'next'
import { SITE_URL } from '@/lib/seo'

export function buildMetadata(overrides: Partial<Metadata>): Metadata {
  return {
    metadataBase: new URL(SITE_URL),
    ...overrides,
  }
}
