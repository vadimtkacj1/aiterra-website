'use client'

import { useEffect, useState, type MouseEvent } from 'react'
import { ChevronDownIcon } from './icons'
import { article as articleDefaults } from '../content'
import { useV2 } from '../V2ContentProvider'
import styles from './Article.module.css'

export type TocEntry = { id: string; label: string }

const HEADER_OFFSET = 140

export default function ArticleToc({ entries, collapsible = false }: { entries: TocEntry[]; collapsible?: boolean }) {
  const article = useV2('article', articleDefaults)
  const [activeId, setActiveId] = useState(entries[0]?.id ?? '')
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (entries.length === 0) return
    const headings = entries
      .map((entry) => document.getElementById(entry.id))
      .filter((node): node is HTMLElement => Boolean(node))
    if (headings.length === 0) return

    let frame = 0
    const update = () => {
      frame = 0
      const atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2
      if (atBottom) {
        setActiveId(headings[headings.length - 1].id)
        return
      }
      let current = headings[0].id
      for (const heading of headings) {
        if (heading.getBoundingClientRect().top <= HEADER_OFFSET) current = heading.id
        else break
      }
      setActiveId(current)
    }
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }

    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (frame) cancelAnimationFrame(frame)
    }
  }, [entries])

  const jump = (event: MouseEvent<HTMLAnchorElement>, id: string) => {
    const target = document.getElementById(id)
    if (!target) return
    event.preventDefault()
    const calm = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    target.scrollIntoView({ behavior: calm ? 'auto' : 'smooth', block: 'start' })
    window.history.replaceState(null, '', `#${id}`)
    setActiveId(id)
    setOpen(false)
  }

  if (entries.length === 0) return null

  const list = (className: string) => (
    <ul className={className}>
      {entries.map((entry) => (
        <li key={entry.id}>
          <a
            href={`#${entry.id}`}
            className={styles.tocLink}
            aria-current={entry.id === activeId ? 'location' : undefined}
            onClick={(event) => jump(event, entry.id)}
          >
            {entry.label}
          </a>
        </li>
      ))}
    </ul>
  )

  if (collapsible) {
    return (
      <nav className={styles.tocDrop} aria-label={article.tocTitle} data-open={open || undefined}>
        <button type="button" className={styles.tocDropButton} aria-expanded={open} onClick={() => setOpen((current) => !current)}>
          <span>{article.tocTitle}</span>
          <ChevronDownIcon className={styles.tocDropChevron} />
        </button>
        {open ? list(styles.tocDropList) : null}
      </nav>
    )
  }

  return (
    <nav className={styles.toc} aria-label={article.tocTitle}>
      <p className={styles.tocTitle}>{article.tocTitle}</p>
      {list(styles.tocList)}
    </nav>
  )
}
