'use client'

import { useId, useMemo, useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Search } from 'lucide-react'
import ToolIcon from './ToolIcon'
import type { ToolCategory, ToolCategoryInfo, ToolEntry } from '@/lib/tools'
import styles from './ToolsIndex.module.css'

const normalize = (value: string) =>
  value
    .toLowerCase()
    .replace(/[״"׳'`]/g, '')
    .replace(/[-_]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()

const toolWord = (count: number) => (count === 1 ? 'כלי אחד' : `${count} כלים`)

export default function ToolsIndex({ categories, tools }: { categories: ToolCategoryInfo[]; tools: ToolEntry[] }) {
  const [query, setQuery] = useState('')
  const [active, setActive] = useState<ToolCategory | 'all'>('all')
  const searchId = useId()

  const visible = useMemo(() => {
    const words = normalize(query).split(' ').filter(Boolean)
    return tools.filter((tool) => {
      if (active !== 'all' && tool.category !== active) return false
      if (!words.length) return true
      const haystack = normalize(`${tool.title} ${tool.description}`)
      return words.every((word) => haystack.includes(word))
    })
  }, [tools, query, active])

  const groups = categories
    .map((category) => ({ category, items: visible.filter((tool) => tool.category === category.id) }))
    .filter((group) => group.items.length)

  return (
    <div className={styles.index}>
      <div className={styles.controls}>
        <div className={styles.searchBox}>
          <label htmlFor={searchId} className={styles.visuallyHidden}>
            חיפוש כלי
          </label>
          <Search className={styles.searchIcon} aria-hidden="true" />
          <input
            id={searchId}
            type="search"
            className={styles.search}
            placeholder="מה צריך? מע״מ, QR, הצעת מחיר, נגישות..."
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </div>
        <fieldset className={styles.filters}>
          <legend className={styles.visuallyHidden}>סינון לפי תחום</legend>
          {[{ id: 'all' as const, label: 'הכול', count: tools.length }, ...categories.map((category) => ({
            id: category.id,
            label: category.label,
            count: tools.filter((tool) => tool.category === category.id).length,
          }))]
            .filter((option) => option.count)
            .map((option) => (
              <label key={option.id} className={styles.filter}>
                <input
                  type="radio"
                  name="tools-filter"
                  checked={active === option.id}
                  onChange={() => setActive(option.id)}
                />
                <span>
                  {option.label}
                  <span className={styles.filterCount}>{option.count}</span>
                </span>
              </label>
            ))}
        </fieldset>
        <p className={styles.resultCount} role="status" aria-live="polite">
          {query || active !== 'all' ? `${toolWord(visible.length)} מתאימים` : `${toolWord(tools.length)} בעברית, חינם`}
        </p>
      </div>

      {groups.map(({ category, items }) => {
        const position = categories.findIndex((item) => item.id === category.id) + 1
        return (
          <section
            key={category.id}
            id={category.id}
            className={styles.row}
            aria-labelledby={`${category.id}-title`}
          >
            <div className={styles.rules} aria-hidden="true">
              <span />
              <span />
              <span />
            </div>
            <div className={styles.rowInner}>
              <header className={styles.head}>
                <span className={styles.number} aria-hidden="true">
                  {String(position).padStart(2, '0')}
                </span>
                <h2 id={`${category.id}-title`} className={styles.title}>
                  {category.title}
                </h2>
                <p className={styles.description}>{category.description}</p>
                <p className={styles.count}>{toolWord(items.length)}</p>
              </header>

              <ul className={styles.list}>
                {items.map((tool) => (
                  <li key={tool.path}>
                    <Link href={tool.path} className={styles.item}>
                      <span className={styles.itemIcon}>
                        <ToolIcon name={tool.icon} className={styles.itemIconSvg} />
                      </span>
                      <span className={styles.itemBody}>
                        <h3 className={styles.itemTitle}>{tool.title}</h3>
                        <span className={styles.itemText}>{tool.description}</span>
                      </span>
                      <ArrowLeft className={styles.itemArrow} aria-hidden="true" />
                    </Link>
                  </li>
                ))}
              </ul>

              <aside className={styles.service} aria-label={`השירות שלנו: ${category.service.label}`}>
                <p className={styles.serviceEyebrow}>השירות שמאחורי הכלים</p>
                <p className={styles.serviceTitle}>{category.service.label}</p>
                <p className={styles.serviceText}>{category.service.text}</p>
                <Link href={category.service.href} className={styles.serviceLink}>
                  לשירות
                  <ArrowLeft className={styles.serviceArrow} aria-hidden="true" />
                </Link>
              </aside>
            </div>
          </section>
        )
      })}

      {!groups.length ? (
        <div className={styles.empty}>
          <p className={styles.emptyTitle}>לא מצאנו כלי כזה, עדיין.</p>
          <p className={styles.emptyText}>ספרו לנו מה חיפשתם. אם זה עוזר לעסקים, נבנה אותו.</p>
          <Link href="/contact" className={styles.serviceLink}>
            הציעו כלי
            <ArrowLeft className={styles.serviceArrow} aria-hidden="true" />
          </Link>
        </div>
      ) : null}
    </div>
  )
}
