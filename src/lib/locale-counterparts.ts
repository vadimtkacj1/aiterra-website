import { EN_SERVICE_SLUGS } from '@/lib/content-en'
import { postsEn } from '@/lib/content-en-blog-data'
import type { Counterparts } from '@/lib/locale-path'

export const EN_POST_SLUGS: string[] = Object.keys(postsEn)
export const EN_SERVICE_SLUG_LIST: string[] = [...EN_SERVICE_SLUGS]

export const EN_COUNTERPARTS: Counterparts = {
  posts: new Set(EN_POST_SLUGS),
  services: new Set(EN_SERVICE_SLUG_LIST),
}
