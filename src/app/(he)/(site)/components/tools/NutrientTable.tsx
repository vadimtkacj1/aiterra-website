'use client'

import { useMemo, useState } from 'react'
import type { NutrientFood } from '@/lib/nutrients'
import ui from './toolUi.module.css'
import styles from './NutrientTable.module.css'

export default function NutrientTable({ foods, name, unit }: { foods: NutrientFood[]; name: string; unit: string }) {
  const [query, setQuery] = useState('')
  const visible = useMemo(() => foods.filter((food) => food.name.includes(query.trim())), [foods, query])

  return (
    <section className={ui.tool} aria-labelledby="nutrient-search-label">
      <div className={styles.wrap}>
        <label id="nutrient-search-label" htmlFor="nutrient-search" className={ui.legend}>
          חיפוש מזון
        </label>
        <input
          id="nutrient-search"
          className={ui.input}
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
        <table className={styles.table}>
          <caption className={ui.hint}>{name} ב-100 גרם מזון, מהגבוה לנמוך</caption>
          <thead>
            <tr>
              <th scope="col">מזון</th>
              <th scope="col">{unit}</th>
            </tr>
          </thead>
          <tbody>
            {visible.map((food) => (
              <tr key={food.name}>
                <td>{food.name}</td>
                <td>{food.amount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}
