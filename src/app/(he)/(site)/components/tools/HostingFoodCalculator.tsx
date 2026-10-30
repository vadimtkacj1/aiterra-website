'use client'

import { useId, useState } from 'react'
import { DEFAULT_DISHES, DISHES, MEAL_KINDS, portionsFor, shoppingList, type MealKind } from '@/lib/hosting-food'
import { NumberField, Rows, Shell, useNumber } from './BodyCalculators'
import { TileGroup } from './FunTiles'
import ShareResultButton from './ShareResultButton'
import ui from './toolUi.module.css'
import fun from './FunTool.module.css'

export default function HostingFoodCalculator() {
  const mealName = useId()
  const adults = useNumber(1, 300)
  const children = useNumber(0, 300)
  const [meal, setMeal] = useState<MealKind>('full')
  const [dishes, setDishes] = useState(DEFAULT_DISHES)
  const list = adults.value === null ? null : shoppingList(adults.value, children.value ?? 0, meal, dishes)
  const summary = list?.map(([label, amount]) => `${label}: ${amount}`).join('\n') ?? ''

  function toggle(id: string) {
    setDishes(dishes.includes(id) ? dishes.filter((dish) => dish !== id) : [...dishes, id])
  }

  return (
    <Shell
      name="מחשבון כמויות אוכל לאירוח"
      prompt="הקלידו כמה מבוגרים מגיעים."
      note="הערכה לפי מנות מקובלות, כולל מרווח של 10%. ילד נספר כחצי מנה."
      inputs={
        <>
          <NumberField label="מבוגרים" field={adults} />
          <NumberField label="ילדים עד גיל 12" field={children} />
          <TileGroup
            legend="סוג הארוחה"
            name={mealName}
            options={MEAL_KINDS.map(({ id, label, hint }) => ({ id, label, hint }))}
            value={meal}
            onChange={setMeal}
          />
          <fieldset className={ui.group}>
            <legend className={ui.legend}>מה מגישים</legend>
            {DISHES.map(({ id, label }) => (
              <label key={id} className={fun.tile}>
                <input type="checkbox" checked={dishes.includes(id)} onChange={() => toggle(id)} />
                <span className={fun.tileLabel}>{label}</span>
              </label>
            ))}
          </fieldset>
        </>
      }
    >
      {list ? (
        <>
          <p className={fun.panel}>רשימה ל-{portionsFor(adults.value ?? 0, children.value ?? 0)} מנות:</p>
          <Rows label="רשימת קניות" rows={list} />
          <ShareResultButton text={`רשימת קניות לאירוח:\n${summary}`} tool="hosting-food-calculator" className={ui.primary} />
        </>
      ) : null}
    </Shell>
  )
}
