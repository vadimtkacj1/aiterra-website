'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import TabList from './TabList'
import ActionButton from './ActionButton'
import GridRule from './GridRule'
import { ChevronPrevIcon } from './icons'
import { categoryTag, matchesKeywords } from '../blogCategory'
import { blog as blogDefaults } from '../content'
import { useV2 } from '../V2ContentProvider'
import styles from './BlogIndex.module.css'

export type BlogCard = {
  slug: string
  title: string
  excerpt: string
  date: string
  author: string
  authorImage: string
  image: string
  tags: string[]
  minutes: number
}

const FIRST_PAGE = 9
const PAGE = 8
const COLUMNS = 4
const LEAD_CELLS = 5

const columnOf = (index: number) => {
  if (index === 0) return 0
  if (index < LEAD_CELLS) return 2 + ((index - 1) % 2)
  return (index - LEAD_CELLS) % COLUMNS
}

export default function BlogIndex({ posts }: { posts: BlogCard[] }) {
  const blog = useV2('blog', blogDefaults)
  const [filterId, setFilterId] = useState(blog.filters[0].id)
  const [limit, setLimit] = useState(FIRST_PAGE)

  const visible = useMemo(() => {
    const filter = blog.filters.find((entry) => entry.id === filterId) ?? blog.filters[0]
    return posts.filter((post) => matchesKeywords(post, filter.match))
  }, [posts, filterId, blog.filters])

  const select = (id: string) => {
    setFilterId(id)
    setLimit(FIRST_PAGE)
  }

  const shown = visible.slice(0, limit)

  return (
    <section className={styles.index} aria-label={blog.title}>
      <div className={styles.inner}>
        <div className={styles.head}>
          <div className={styles.rules} aria-hidden="true">
            <span />
            <span />
            <span />
          </div>

          <nav className={styles.crumbs} aria-label={blog.crumbsLabel}>
            <Link href="/" className={styles.crumbLink}>
              {blog.crumbHome}
            </Link>
            <ChevronPrevIcon className={styles.crumbChevron} />
            <span className={styles.crumbCurrent} aria-current="page">
              {blog.title}
            </span>
          </nav>

          <TabList
            tabs={blog.filters}
            activeId={filterId}
            onSelect={select}
            variant="solid"
            align="center"
            className={styles.tabs}
          />
        </div>

        <GridRule columns={[1, 2, 1]} />

        {shown.length === 0 ? (
          <p className={styles.empty}>{blog.empty}</p>
        ) : (
          <ul className={styles.grid}>
            {shown.map((post, index) => (
              <li
                key={post.slug}
                className={[styles.cell, index === 0 ? styles.lead : ''].filter(Boolean).join(' ')}
                data-col={columnOf(index)}
              >
                <Link href={`/blog/${post.slug}`} className={styles.card}>
                  <span className={styles.cover}>
                    {post.image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={post.image} alt="" className={styles.coverImage} loading={index === 0 ? 'eager' : 'lazy'} />
                    ) : (
                      <span className={styles.coverBlank} />
                    )}
                  </span>

                  <span className={styles.meta}>
                    <span className={styles.metaText}>
                      <span className={styles.category}>{categoryTag(post, blog)}</span>
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
        )}

        <GridRule columns={[1, 2, 1]} />

        {visible.length > shown.length ? (
          <div className={styles.moreRow}>
            <button type="button" className={styles.loadMore} onClick={() => setLimit((current) => current + PAGE)}>
              <ActionButton href="#" label={blog.loadMore} className={styles.loadMoreFace} />
            </button>
          </div>
        ) : null}
      </div>
    </section>
  )
}
