'use client'

import { useEffect } from 'react'

const STAGGER_STEP = 70
const CLEANUP_AFTER = 1400

export default function ScrollReveal() {
  useEffect(() => {
    const root = document.querySelector('.v2Root')
    if (!root) return

    const items = Array.from(root.querySelectorAll<HTMLElement>('[data-reveal-item]'))
    if (items.length === 0) return

    const settle = (element: HTMLElement, delay: number) => {
      element.setAttribute('data-revealed', '')
      window.setTimeout(() => {
        element.removeAttribute('data-reveal-item')
        element.removeAttribute('data-revealed')
        element.style.removeProperty('--reveal-delay')
      }, CLEANUP_AFTER + delay)
    }

    const motionless = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (motionless || !('IntersectionObserver' in window)) {
      items.forEach((element) => settle(element, 0))
      return
    }

    for (const group of Array.from(root.querySelectorAll<HTMLElement>('[data-reveal-stagger]'))) {
      const members = Array.from(group.querySelectorAll<HTMLElement>('[data-reveal-item]'))
      members.forEach((element, index) => {
        element.style.setProperty('--reveal-delay', `${index * STAGGER_STEP}ms`)
      })
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue
          const element = entry.target as HTMLElement
          observer.unobserve(element)
          settle(element, Number.parseFloat(element.style.getPropertyValue('--reveal-delay')) || 0)
        }
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.08 },
    )

    items.forEach((element) => observer.observe(element))

    return () => observer.disconnect()
  }, [])

  return null
}
