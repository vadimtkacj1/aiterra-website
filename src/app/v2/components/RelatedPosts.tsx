'use client'

import { useRef, useState } from 'react'
import Link from 'next/link'
import CircleButton from './CircleButton'
import { ChevronPrevIcon } from './icons'
import type { BlogCard } from './BlogIndex'
import { categoryTag } from '../blogCategory'
import { article, blog } from '../content'
import styles from './RelatedPosts.module.css'

const PAGE = 3

export default function RelatedPosts({ posts }: { posts: BlogCard[] }) {
  const trackRef = useRef<HTMLUListElement>(null)
  const [offset, setOffset] = useState(0)
  if (posts.length === 0) return null

  const pageOf = (index: number) => Math.floor(index / PAGE)
  const canPage = posts.length > PAGE

  const step = (direction: 1 | -1) => {
    const track = trackRef.current
    const stacked = window.matchMedia('(max-width: 640px)').matches
    if (stacked && track) {
      const card = track.firstElementChild as HTMLElement | null
      if (!card) return
      const sign = getComputedStyle(track).direction === 'rtl' ? -1 : 1
      const gap = Number.parseFloat(getComputedStyle(track).columnGap) || 0
      track.scrollBy({ left: sign * direction * (card.getBoundingClientRect().width + gap), behavior: 'smooth' })
      return
    }
    const pages = Math.ceil(posts.length / PAGE)
    setOffset((current) => (current + direction + pages) % pages)
  }

  return (
    <section className={styles.related} aria-labelledby="v2-related-heading">
      <div className={styles.inner}>
        <h2 id="v2-related-heading" className={styles.heading}>
          {article.relatedTitle}
        </h2>

        <ul ref={trackRef} className={styles.grid}>
          {posts.map((post, index) => (
            <li
              key={post.slug}
              className={[styles.cell, pageOf(index) === offset ? '' : styles.parked].filter(Boolean).join(' ')}
            >
              <Link href={`/v2/blog/${post.slug}`} className={styles.card}>
                <span className={styles.cover}>
                  {post.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={post.image} alt="" className={styles.coverImage} loading="lazy" />
                  ) : (
                    <span className={styles.coverBlank} />
                  )}
                </span>
                <span className={styles.meta}>
                  <span className={styles.metaText}>
                    <span className={styles.category}>{categoryTag(post)}</span>
                    <span className={styles.metaDot} aria-hidden="true" />
                    <span>
                      {post.minutes} {blog.readTime}
                    </span>
                  </span>
                  <span className={styles.open} aria-hidden="true">
                    <ChevronPrevIcon className={styles.openIcon} />
                  </span>
                </span>
                <span className={styles.title}>{post.title}</span>
              </Link>
            </li>
          ))}
        </ul>

        {canPage ? (
          <div className={styles.nav}>
            <CircleButton label={article.prev} tone="onPaper" glyph="next" onClick={() => step(-1)} />
            <CircleButton label={article.next} tone="onPaper" glyph="prev" onClick={() => step(1)} />
          </div>
        ) : null}
      </div>
    </section>
  )
}
