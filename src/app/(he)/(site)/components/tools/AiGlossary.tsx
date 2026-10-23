'use client'

import { useEffect, useId, useMemo, useRef, useState, type MouseEvent, type ReactNode } from 'react'
import { flushSync } from 'react-dom'
import { Search, X } from 'lucide-react'
import type { GlossaryIndexEntry, GlossaryTopic } from '@/lib/ai-glossary'
import ui from './toolUi.module.css'
import styles from './AiGlossary.module.css'

type Filter = { kind: 'none' } | { kind: 'query'; value: string } | { kind: 'letter'; value: string }

const HEBREW_ORDER = 'אבגדהוזחטיכלמנסעפצקרשת'
const LATIN_ORDER = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
const COUNT_DELAY_MS = 500
const SEARCH_EVENT_DELAY_MS = 1200
const QUESTION_PREFIX = /^(?:מה\s+(?:זה|זאת|זו|הם|הן|היא|הוא)|מהו|מהי|מהם|what\s+is|what\s+are)\s+/
const HEBREW_PREFIXES = /^[הבלומש]/

const normalize = (value: string) =>
  value
    .toLowerCase()
    .replace(/[֑-ׇ]/g, '')
    .replace(/[׳’`´]/g, "'")
    .replace(/[״“”]/g, '"')
    .replace(/[־–—-]/g, ' ')
    .replace(/[?!.,:;()"]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()

const queryWords = (query: string) =>
  normalize(query).replace(QUESTION_PREFIX, '').split(' ').filter(Boolean)

const wordMatches = (word: string, haystack: string) =>
  haystack.includes(word) || (word.length > 2 && HEBREW_PREFIXES.test(word) && haystack.includes(word.slice(1)))

const describeCount = (count: number, total: number, filtered: boolean) => {
  if (!filtered) return `כל ${total} המונחים`
  if (count === 0) return 'לא נמצאו מונחים'
  if (count === 1) return 'נמצא מונח אחד'
  return `נמצאו ${count} מונחים`
}

const orderedLetters = (letters: string[], order: string) =>
  order.split('').filter((letter) => letters.includes(letter))

export default function AiGlossary({
  entries,
  topics,
  children,
}: {
  entries: GlossaryIndexEntry[]
  topics: GlossaryTopic[]
  children: ReactNode
}) {
  const searchId = useId()
  const hebrewLabelId = useId()
  const latinLabelId = useId()
  const total = entries.length

  const [filter, setFilter] = useState<Filter>({ kind: 'none' })
  const [countText, setCountText] = useState(() => describeCount(total, total, false))
  const lastTracked = useRef('')

  const haystacks = useMemo(() => new Map(entries.map((entry) => [entry.id, normalize(entry.keys)])), [entries])

  const hebrewLetters = useMemo(
    () => orderedLetters([...new Set(entries.map((entry) => entry.hebrewLetter))], HEBREW_ORDER),
    [entries],
  )
  const latinLetters = useMemo(
    () => orderedLetters([...new Set(entries.map((entry) => entry.latinLetter))], LATIN_ORDER),
    [entries],
  )

  const visible = useMemo(() => {
    if (filter.kind === 'letter') {
      return entries.filter((entry) => entry.hebrewLetter === filter.value || entry.latinLetter === filter.value)
    }
    if (filter.kind === 'query') {
      const words = queryWords(filter.value)
      if (!words.length) return entries
      return entries.filter((entry) => {
        const haystack = haystacks.get(entry.id) ?? ''
        return words.every((word) => wordMatches(word, haystack))
      })
    }
    return entries
  }, [entries, filter, haystacks])

  const filtered = filter.kind === 'letter' || (filter.kind === 'query' && queryWords(filter.value).length > 0)
  const visibleIds = new Set(visible.map((entry) => entry.id))
  const visibleTopics = new Set(visible.map((entry) => entry.topic))
  const hiddenSelectors = [
    ...entries.filter((entry) => !visibleIds.has(entry.id)).map((entry) => `[data-term="${entry.id}"]`),
    ...topics.filter((topic) => !visibleTopics.has(topic.id)).map((topic) => `[data-topic="${topic.id}"]`),
  ]
  const hiddenCss = hiddenSelectors.length ? `${hiddenSelectors.join(',')}{display:none}` : ''

  useEffect(() => {
    const timeout = window.setTimeout(
      () => setCountText(describeCount(visible.length, total, filtered)),
      COUNT_DELAY_MS,
    )
    return () => window.clearTimeout(timeout)
  }, [visible.length, total, filtered])

  useEffect(() => {
    if (filter.kind !== 'query' || !queryWords(filter.value).length) return
    const key = normalize(filter.value)
    const timeout = window.setTimeout(() => {
      if (lastTracked.current === key) return
      lastTracked.current = key
      window.gtag?.('event', 'glossary_search', { method: 'text', results: visible.length })
    }, SEARCH_EVENT_DELAY_MS)
    return () => window.clearTimeout(timeout)
  }, [filter, visible.length])

  const reset = () => setFilter({ kind: 'none' })

  const chooseLetter = (letter: string) => {
    if (filter.kind === 'letter' && filter.value === letter) {
      reset()
      return
    }
    setFilter({ kind: 'letter', value: letter })
    const results = entries.filter((entry) => entry.hebrewLetter === letter || entry.latinLetter === letter).length
    window.gtag?.('event', 'glossary_search', { method: 'letter', results })
  }

  const revealLinkTarget = (event: MouseEvent<HTMLDivElement>) => {
    if (!filtered) return
    const anchor = (event.target as HTMLElement).closest('a')
    const href = anchor?.getAttribute('href') ?? ''
    if (!href.startsWith('#')) return
    flushSync(reset)
  }

  const letterButton = (letter: string) => {
    const active = filter.kind === 'letter' && filter.value === letter
    return (
      <button
        key={letter}
        type="button"
        className={`${styles.letter} ${active ? styles.letterActive : ''}`}
        aria-pressed={active}
        onClick={() => chooseLetter(letter)}
      >
        {letter}
      </button>
    )
  }

  return (
    <section className={ui.tool} aria-label="מילון מונחי בינה מלאכותית">
      <div className={styles.inner}>
        <div className={styles.controls} role="search">
          <div className={styles.searchRow}>
            <div className={`${ui.field} ${styles.searchField}`}>
              <label htmlFor={searchId} className={ui.label}>
                חיפוש מונח
              </label>
              <div className={styles.searchBox}>
                <Search className={styles.searchIcon} aria-hidden="true" />
                <input
                  id={searchId}
                  type="search"
                  autoComplete="off"
                  spellCheck={false}
                  enterKeyHint="search"
                  className={`${ui.input} ${styles.searchInput}`}
                  value={filter.kind === 'query' ? filter.value : ''}
                  onChange={(event) => setFilter({ kind: 'query', value: event.target.value })}
                />
              </div>
            </div>
            {filtered ? (
              <button type="button" className={`${ui.secondary} ${styles.clear}`} onClick={reset}>
                <X aria-hidden="true" />
                ניקוי
              </button>
            ) : null}
          </div>

          <div className={styles.letters}>
            <div className={styles.letterRow} role="group" aria-labelledby={hebrewLabelId}>
              <span id={hebrewLabelId} className={styles.letterLabel}>
                לפי אות
              </span>
              <div className={styles.letterList}>{hebrewLetters.map(letterButton)}</div>
            </div>
            <div className={styles.letterRow} role="group" aria-labelledby={latinLabelId}>
              <span id={latinLabelId} className={styles.letterLabel}>
                באנגלית
              </span>
              <div className={styles.letterList} dir="ltr">
                {latinLetters.map(letterButton)}
              </div>
            </div>
          </div>

          <div className={styles.metaRow}>
            <p className={styles.count} role="status" aria-live="polite">
              {countText}
            </p>
            <nav aria-label="נושאים במילון" className={styles.topicNav}>
              <ul className={styles.topicList}>
                {topics
                  .filter((topic) => visibleTopics.has(topic.id))
                  .map((topic) => (
                    <li key={topic.id}>
                      <a href={`#topic-${topic.id}`} className={styles.topicLink}>
                        {topic.label}
                      </a>
                    </li>
                  ))}
              </ul>
            </nav>
          </div>
        </div>

        {hiddenCss ? <style>{hiddenCss}</style> : null}
        <div className={styles.results} onClickCapture={revealLinkTarget}>
          {children}
          {visible.length === 0 ? (
            <div className={styles.empty}>
              <p>לא מצאנו מונח שמתאים לחיפוש. נסו מילה אחרת, באנגלית או בעברית.</p>
              <button type="button" className={ui.secondary} onClick={reset}>
                ניקוי החיפוש
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  )
}
