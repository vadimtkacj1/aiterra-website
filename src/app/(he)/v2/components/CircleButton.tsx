import { ChevronNextIcon, ChevronPrevIcon } from './icons'
import styles from './CircleButton.module.css'

type CircleButtonProps = {
  label: string
  tone?: 'onDark' | 'onAccent' | 'onSoft' | 'onPaper'
  glyph?: 'prev' | 'next'
  onClick?: () => void
  as?: 'button' | 'span'
}

export default function CircleButton({
  label,
  tone = 'onDark',
  glyph = 'prev',
  onClick,
  as = 'button',
}: CircleButtonProps) {
  const className = [styles.circle, styles[tone]].join(' ')
  const Glyph = glyph === 'next' ? ChevronNextIcon : ChevronPrevIcon

  if (as === 'span') {
    return (
      <span className={className} aria-hidden="true">
        <Glyph />
      </span>
    )
  }

  return (
    <button type="button" className={className} aria-label={label} onClick={onClick}>
      <Glyph />
    </button>
  )
}
