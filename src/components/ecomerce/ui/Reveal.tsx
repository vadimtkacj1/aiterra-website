'use client'

import {
  createElement,
  useEffect,
  useRef,
  useState,
  type ReactNode,
  type ElementType,
} from 'react'

type RevealProps = {
  children: ReactNode
  /** delay in ms before the element animates in */
  delay?: number
  className?: string
  as?: ElementType
}

/**
 * Fade + rise on first scroll into view. Uses IntersectionObserver and toggles
 * the `.reveal.is-visible` classes defined in the landing stylesheet. Respects
 * prefers-reduced-motion (the CSS neutralises the transform there).
 *
 * Rendered with `createElement` rather than a `<Tag/>` JSX element: a dynamic
 * `ElementType` carrying a `ref` makes React 19's JSX types infer the children
 * prop as `never`. `createElement` takes the same tag and props without that
 * inference, so the polymorphic `as` (e.g. `as="li"`) still type-checks.
 */
export default function Reveal({
  children,
  delay = 0,
  className = '',
  as = 'div',
}: RevealProps) {
  const ref = useRef<HTMLElement | null>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true)
            io.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.14, rootMargin: '0px 0px -8% 0px' }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return createElement(
    as,
    {
      ref,
      className: `reveal ${visible ? 'is-visible' : ''} ${className}`,
      style: delay ? { transitionDelay: `${delay}ms` } : undefined,
    },
    children
  )
}
