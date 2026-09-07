'use client'

import { useEffect } from 'react'
import type { TabOption } from './TabList'
import styles from './TabAnchors.module.css'

type TabAnchorsProps = {
  prefix: string
  tabs: TabOption[]
  onSelect: (id: string) => void
}

export default function TabAnchors({ prefix, tabs, onSelect }: TabAnchorsProps) {
  useEffect(() => {
    const apply = () => {
      const hash = decodeURIComponent(window.location.hash.slice(1))
      if (!hash.startsWith(`${prefix}-`)) return
      const id = hash.slice(prefix.length + 1)
      if (tabs.some((tab) => tab.id === id)) onSelect(id)
    }

    apply()
    window.addEventListener('hashchange', apply)
    return () => window.removeEventListener('hashchange', apply)
  }, [prefix, tabs, onSelect])

  return (
    <div className={styles.anchors} aria-hidden="true">
      {tabs.map((tab) => (
        <span key={tab.id} id={`${prefix}-${tab.id}`} className={styles.anchor} />
      ))}
    </div>
  )
}
