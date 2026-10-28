'use client'

import { useEffect, useId, useState, type FormEvent } from 'react'
import Link from 'next/link'
import { Copy, Heart, Shuffle, X } from 'lucide-react'
import {
  FAVORITES_KEY,
  fieldOptions,
  generateNames,
  parseFavorites,
  parseKeywords,
  styleOptions,
  toggleFavorite,
  type BusinessName,
  type FieldId,
  type NameStyle,
} from '@/lib/business-names'
import ui from './toolUi.module.css'
import styles from './BusinessNameGenerator.module.css'

const newSeed = () => Math.floor(Math.random() * 2 ** 31)

export default function BusinessNameGenerator() {
  const [field, setField] = useState<FieldId>('restaurant')
  const [keywordText, setKeywordText] = useState('')
  const [style, setStyle] = useState<NameStyle>('mix')
  const [names, setNames] = useState<BusinessName[]>([])
  const [favorites, setFavorites] = useState<string[]>([])
  const [announce, setAnnounce] = useState('')
  const baseId = useId()

  useEffect(() => {
    try {
      setFavorites(parseFavorites(window.localStorage.getItem(FAVORITES_KEY)))
    } catch {
      setFavorites([])
    }
  }, [])

  const generate = () => {
    const next = generateNames(field, parseKeywords(keywordText), style, newSeed())
    setNames(next)
    setAnnounce(`נוצרו ${next.length} רעיונות לשם.`)
    window.gtag?.('event', 'business_name_generate', { field, style })
  }

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    generate()
  }

  const saveFavorites = (next: string[]) => {
    setFavorites(next)
    try {
      window.localStorage.setItem(FAVORITES_KEY, JSON.stringify(next))
    } catch {
      setAnnounce('לא הצלחנו לשמור בדפדפן. הרשימה תישמר עד סגירת העמוד.')
    }
  }

  const toggle = (name: string) => {
    const next = toggleFavorite(favorites, name)
    if (next === favorites) {
      setAnnounce('אפשר לשמור עד 40 שמות. הסירו שם כדי להוסיף אחר.')
      return
    }
    saveFavorites(next)
    setAnnounce(next.includes(name) ? `${name} נוסף למועדפים.` : `${name} הוסר מהמועדפים.`)
  }

  const copy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setAnnounce(`הועתק: ${text}`)
    } catch {
      setAnnounce('ההעתקה לא הצליחה. סמנו את הטקסט והעתיקו ידנית.')
    }
  }

  const nameText = (name: string, latin: boolean) =>
    latin ? (
      <span lang="en" dir="ltr">
        {name}
      </span>
    ) : (
      name
    )

  return (
    <section className={ui.tool} aria-labelledby={`${baseId}-title`}>
      <div className={`${ui.inner} ${styles.inner}`}>
        <div className={ui.form}>
          <form className={ui.group} onSubmit={onSubmit}>
            <h2 id={`${baseId}-title`} className={ui.legend}>
              על העסק
            </h2>
            <div className={ui.row}>
              <div className={ui.field}>
                <label htmlFor={`${baseId}-field`} className={ui.label}>
                  תחום
                </label>
                <select
                  id={`${baseId}-field`}
                  className={`${ui.input} ${styles.select}`}
                  value={field}
                  onChange={(event) => setField(event.target.value as FieldId)}
                >
                  {fieldOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className={ui.field}>
                <label htmlFor={`${baseId}-keywords`} className={ui.label}>
                  מילות מפתח
                </label>
                <input
                  id={`${baseId}-keywords`}
                  className={ui.input}
                  value={keywordText}
                  maxLength={80}
                  placeholder="למשל: ים, שמש"
                  aria-describedby={`${baseId}-keywords-hint`}
                  onChange={(event) => setKeywordText(event.target.value)}
                />
                <p id={`${baseId}-keywords-hint`} className={ui.hint}>
                  עד 3 מילים, מופרדות בפסיק. אפשר גם בלי.
                </p>
              </div>
            </div>
            <fieldset className={ui.group}>
              <legend className={ui.legend}>שפת השם</legend>
              <div className={ui.options}>
                {styleOptions.map((option) => (
                  <label key={option.value} className={ui.option}>
                    <input
                      type="radio"
                      name={`${baseId}-style`}
                      value={option.value}
                      checked={style === option.value}
                      onChange={() => setStyle(option.value)}
                    />
                    {option.value === 'en' ? <span lang="en">{option.label}</span> : option.label}
                  </label>
                ))}
              </div>
            </fieldset>
            <div className={ui.actions}>
              <button type="submit" className={ui.primary}>
                <Shuffle aria-hidden="true" />
                {names.length ? 'עוד רעיונות' : 'צרו שמות'}
              </button>
            </div>
          </form>

          {favorites.length > 0 ? (
            <div className={ui.group}>
              <h2 className={ui.legend}>המועדפים שלי</h2>
              <ul className={styles.chips}>
                {favorites.map((name) => (
                  <li key={name}>
                    <button
                      type="button"
                      className={styles.chip}
                      aria-label={`הסרת ${name} מהמועדפים`}
                      onClick={() => toggle(name)}
                    >
                      {nameText(name, !/[֐-׿]/.test(name))}
                      <X aria-hidden="true" />
                    </button>
                  </li>
                ))}
              </ul>
              <div className={ui.actions}>
                <button type="button" className={ui.secondary} onClick={() => copy(favorites.join('\n'))}>
                  <Copy aria-hidden="true" />
                  העתקת המועדפים
                </button>
              </div>
            </div>
          ) : null}

          {names.length > 0 ? (
            <div className={ui.group}>
              <h2 className={ui.legend}>רעיונות לשם ({names.length})</h2>
              <ul className={styles.list}>
                {names.map((item) => {
                  const saved = favorites.includes(item.name)
                  const domain = `${item.slug}.co.il`
                  return (
                    <li key={item.name} className={styles.card}>
                      <p className={styles.name}>{nameText(item.name, item.latin)}</p>
                      <Link
                        className={styles.domain}
                        href={`/tools/domain-lookup?domain=${encodeURIComponent(domain)}`}
                        dir="ltr"
                      >
                        {domain}
                      </Link>
                      <div className={styles.cardActions}>
                        <button
                          type="button"
                          className={styles.icon}
                          aria-pressed={saved}
                          aria-label={saved ? `הסרת ${item.name} מהמועדפים` : `שמירת ${item.name} במועדפים`}
                          onClick={() => toggle(item.name)}
                        >
                          <Heart aria-hidden="true" fill={saved ? 'currentColor' : 'none'} />
                        </button>
                        <button
                          type="button"
                          className={styles.icon}
                          aria-label={`העתקת ${item.name}`}
                          onClick={() => copy(item.name)}
                        >
                          <Copy aria-hidden="true" />
                        </button>
                      </div>
                    </li>
                  )
                })}
              </ul>
              <p className={ui.note}>
                הדומיין מוצע לפי תעתיק אוטומטי. לחיצה עליו בודקת אם הוא פנוי לרישום.
              </p>
            </div>
          ) : null}

          <p className={styles.srOnly} role="status">
            {announce}
          </p>
        </div>
      </div>
    </section>
  )
}
