'use client'

import { useState } from 'react'
import { ShareIcon } from './icons'
import { article as articleDefaults } from '../content'
import { useV2 } from '../V2ContentProvider'
import styles from './Article.module.css'

export default function ShareButton({ title }: { title: string }) {
  const article = useV2('article', articleDefaults)
  const [copied, setCopied] = useState(false)

  const share = async () => {
    const url = window.location.href
    if (navigator.share) {
      try {
        await navigator.share({ title, url })
        return
      } catch {
        return
      }
    }
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1800)
    } catch {
      setCopied(false)
    }
  }

  return (
    <button type="button" className={styles.share} onClick={share}>
      <ShareIcon className={styles.shareIcon} />
      <span>{copied ? article.copied : article.share}</span>
    </button>
  )
}
