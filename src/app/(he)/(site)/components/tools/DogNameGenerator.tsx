'use client'

import { useEffect, useId, useState } from 'react'
import { Heart, Shuffle, X } from 'lucide-react'
import {
  FAVORITES_KEY,
  filterNames,
  genderFilters,
  parseFavorites,
  pickRandom,
  sizeFilters,
  styleFilters,
  toggleFavorite,
  type DogGender,
  type DogSize,
  type DogStyle,
} from '@/lib/dog-name-generator'
import ui from './toolUi.module.css'
import styles from './DogNameGenerator.module.css'

const isLatin = (name: string) => /^[A-Za-z]+$/.test(name)

export default function DogNameGenerator() {
  const [gender, setGender] = useState<DogGender | 'all'>('all')
  const [size, setSize] = useState<DogSize | 'all'>('all')
  const [style, setStyle] = useState<DogStyle | 'all'>('all')
  const [chosen, setChosen] = useState('')
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

  const names = filterNames({ gender, size, style })
  const visibleChosen = names.some((item) => item.name === chosen) ? chosen : ''
  const isFavorite = favorites.includes(visibleChosen)

  const saveFavorites = (next: string[]) => {
    setFavorites(next)
    try {
      window.localStorage.setItem(FAVORITES_KEY, JSON.stringify(next))
    } catch {
      setAnnounce('לא הצלחנו לשמור בדפדפן. הרשימה תישמר עד סגירת העמוד.')
    }
  }

  const roll = () => {
    const next = pickRandom(names, visibleChosen, Math.random)
    if (next) {
      setChosen(next)
      setAnnounce(`השם שהוגרל: ${next}`)
    }
  }

  const toggle = (name: string) => {
    const next = toggleFavorite(favorites, name)
    if (next === favorites) {
      setAnnounce('אפשר לשמור עד 30 שמות. הסירו שם כדי להוסיף אחר.')
      return
    }
    saveFavorites(next)
    setAnnounce(next.includes(name) ? `${name} נוסף למועדפים.` : `${name} הוסר מהמועדפים.`)
  }

  const nameText = (name: string) => (isLatin(name) ? <span lang="en" dir="ltr">{name}</span> : name)

  const selectField = <T extends string>(
    id: string,
    label: string,
    value: T,
    options: { value: T; label: string }[],
    setValue: (next: T) => void,
  ) => (
    <div className={ui.field}>
      <label htmlFor={`${baseId}-${id}`} className={ui.label}>
        {label}
      </label>
      <select
        id={`${baseId}-${id}`}
        className={`${ui.input} ${styles.select}`}
        value={value}
        onChange={(event) => setValue(event.target.value as T)}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  )

  return (
    <section className={ui.tool} aria-labelledby={`${baseId}-title`}>
      <div className={`${ui.inner} ${styles.inner}`}>
        <div className={ui.form}>
          <fieldset className={ui.group}>
            <legend id={`${baseId}-title`} className={ui.legend}>
              איזה שם מחפשים
            </legend>
            <div className={ui.row}>
              {selectField('gender', 'מין', gender, genderFilters, setGender)}
              {selectField('size', 'גודל', size, sizeFilters, setSize)}
              {selectField('style', 'סגנון', style, styleFilters, setStyle)}
            </div>
          </fieldset>

          <div className={ui.group}>
            <h2 className={ui.legend}>הגרלה</h2>
            <div className={styles.stage}>
              <p className={styles.chosen} aria-hidden={visibleChosen ? undefined : true}>
                {visibleChosen ? nameText(visibleChosen) : 'לחצו כדי להגריל'}
              </p>
              <div className={ui.actions}>
                <button type="button" className={ui.primary} onClick={roll} disabled={names.length === 0}>
                  <Shuffle aria-hidden="true" />
                  הגרילו שם
                </button>
                <button
                  type="button"
                  className={ui.secondary}
                  aria-pressed={isFavorite}
                  disabled={!visibleChosen}
                  onClick={() => toggle(visibleChosen)}
                >
                  <Heart aria-hidden="true" fill={isFavorite ? 'currentColor' : 'none'} />
                  {isFavorite ? 'במועדפים' : 'שמירה במועדפים'}
                </button>
              </div>
            </div>
          </div>

          <div className={ui.group}>
            <h2 className={ui.legend}>המועדפים שלי</h2>
            {favorites.length > 0 ? (
              <ul className={styles.chips}>
                {favorites.map((name) => (
                  <li key={name}>
                    <button
                      type="button"
                      className={`${styles.chip} ${styles.saved}`}
                      aria-label={`הסרת ${name} מהמועדפים`}
                      onClick={() => toggle(name)}
                    >
                      {nameText(name)}
                      <X aria-hidden="true" />
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className={ui.note}>עדיין אין שמות. שמירה נעשית בדפדפן הזה בלבד.</p>
            )}
          </div>

          <div className={ui.group}>
            <h2 className={ui.legend}>כל השמות ({names.length})</h2>
            {names.length > 0 ? (
              <ul className={styles.chips}>
                {names.map((item) => (
                  <li key={item.name}>
                    <button
                      type="button"
                      className={styles.chip}
                      aria-pressed={visibleChosen === item.name}
                      onClick={() => setChosen(item.name)}
                    >
                      {nameText(item.name)}
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className={ui.note}>אין שמות שמתאימים למסננים. נסו לשנות אחד מהם.</p>
            )}
          </div>
          <p className={styles.srOnly} role="status">
            {announce}
          </p>
        </div>
      </div>
    </section>
  )
}
