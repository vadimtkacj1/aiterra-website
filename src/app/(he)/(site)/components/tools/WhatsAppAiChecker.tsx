'use client'

import { useId, useState } from 'react'
import Link from 'next/link'
import { goalById, goals, verdictLabels } from '@/lib/chatgpt-whatsapp'
import ui from './toolUi.module.css'
import styles from './WhatsAppAiChecker.module.css'

const groups = [
  { who: 'private' as const, legend: 'אני משתמש פרטי' },
  { who: 'business' as const, legend: 'אני עסק' },
]

export default function WhatsAppAiChecker() {
  const [selected, setSelected] = useState(goals[0].id)
  const name = useId()
  const goal = goalById(selected) ?? goals[0]

  return (
    <section className={ui.tool} aria-label="בדיקה: מה מותר עם AI בוואטסאפ">
      <div className={ui.inner}>
        <form className={ui.form} onSubmit={(event) => event.preventDefault()}>
          {groups.map((group) => (
            <fieldset key={group.who} className={ui.group}>
              <legend className={ui.legend}>{group.legend}</legend>
              <div className={styles.options}>
                {goals
                  .filter((item) => item.who === group.who)
                  .map((item) => (
                    <label key={item.id} className={ui.option}>
                      <input
                        type="radio"
                        name={name}
                        className={ui.checkbox}
                        checked={selected === item.id}
                        onChange={() => setSelected(item.id)}
                      />
                      <span>{item.label}</span>
                    </label>
                  ))}
              </div>
            </fieldset>
          ))}
        </form>
        <div className={ui.output}>
          <div className={ui.sticky} aria-live="polite" data-verdict={goal.verdict}>
            <h2 className={ui.outputTitle}>התשובה</h2>
            <p className={`${styles.verdict} ${styles[goal.verdict]}`}>{verdictLabels[goal.verdict]}</p>
            <p className={styles.headline}>{goal.headline}</p>
            <ul className={styles.how}>
              {goal.how.map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>
            {goal.link ? (
              <Link href={goal.link.href} className={ui.secondary}>
                {goal.link.label}
              </Link>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  )
}
