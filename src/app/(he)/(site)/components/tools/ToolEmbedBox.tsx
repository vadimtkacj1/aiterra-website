'use client'

import { useState } from 'react'
import { Check, Copy } from 'lucide-react'
import { SITE_URL } from '@/lib/seo'
import styles from './ToolEmbedBox.module.css'

export default function ToolEmbedBox({
  slug,
  title,
  height,
}: {
  slug: string
  title: string
  height: number
}) {
  const [copied, setCopied] = useState(false)
  const snippet = `<iframe src="${SITE_URL}/embed/${slug}" width="100%" height="${height}" loading="lazy" title="${title}" style="border:0"></iframe><p><a href="${SITE_URL}/tools/${slug}">${title} מאת Aiterra</a></p>`

  const copySnippet = async () => {
    try {
      await navigator.clipboard.writeText(snippet)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2000)
      window.gtag?.('event', 'tool_embed_copy', { path: `/tools/${slug}` })
    } catch {
      setCopied(false)
    }
  }

  return (
    <section className={styles.box} aria-labelledby="tool-embed-heading">
      <h2 id="tool-embed-heading" className={styles.title}>
        הטמיעו את המחשבון באתר שלכם
      </h2>
      <p className={styles.text}>מעתיקים את הקוד ומדביקים אותו בעמוד באתר. המחשבון חינמי ומתעדכן אצלנו.</p>
      <label htmlFor="tool-embed-code" className={styles.srOnly}>
        קוד ההטמעה
      </label>
      <textarea
        id="tool-embed-code"
        className={styles.code}
        value={snippet}
        readOnly
        dir="ltr"
        rows={4}
        onFocus={(event) => event.currentTarget.select()}
      />
      <button type="button" className={styles.copy} onClick={copySnippet}>
        {copied ? <Check className={styles.icon} aria-hidden="true" /> : <Copy className={styles.icon} aria-hidden="true" />}
        {copied ? 'הקוד הועתק' : 'העתקת הקוד'}
      </button>
      <p className={styles.srOnly} role="status">
        {copied ? 'הקוד הועתק' : ''}
      </p>
    </section>
  )
}
