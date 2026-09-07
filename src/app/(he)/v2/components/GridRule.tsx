import { CrossMark } from './icons'
import styles from './GridRule.module.css'

export default function GridRule({ columns = [1, 1, 1, 1] }: { columns?: number[] }) {
  return (
    <div className={styles.rule} aria-hidden="true">
      <div
        className={styles.columns}
        style={{ gridTemplateColumns: columns.map((weight) => `${weight}fr`).join(' ') }}
      >
        {columns.map((weight, index) => (
          <span key={`${weight}-${index}`} className={styles.column}>
            <CrossMark className={styles.cross} />
          </span>
        ))}
      </div>
    </div>
  )
}
