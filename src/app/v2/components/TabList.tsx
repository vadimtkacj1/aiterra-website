import styles from './TabList.module.css'

export type TabOption = {
  id: string
  label: string
}

type TabListProps = {
  tabs: TabOption[]
  activeId: string
  onSelect: (id: string) => void
  variant?: 'soft' | 'solid'
  align?: 'start' | 'center'
  className?: string
}

export default function TabList({
  tabs,
  activeId,
  onSelect,
  variant = 'soft',
  align = 'start',
  className,
}: TabListProps) {
  return (
    <div
      role="tablist"
      className={[styles.tabs, align === 'center' ? styles.center : '', className]
        .filter(Boolean)
        .join(' ')}
    >
      {tabs.map((tab) => (
        <button
          key={tab.id}
          type="button"
          role="tab"
          aria-selected={tab.id === activeId}
          className={[styles.tab, styles[variant]].join(' ')}
          onClick={() => onSelect(tab.id)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  )
}
