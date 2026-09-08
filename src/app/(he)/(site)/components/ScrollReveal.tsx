'use client'

import { useEffect } from 'react'

const STAGGER_STEP = 70
const CLEANUP_AFTER = 1400

export default function ScrollReveal() {
  useEffect(() => {
    const root = document.querySelector<HTMLElement>('.v2Root')
    if (!root) return

    root.setAttribute('data-reveal-armed', '')

    const timers = new Set<number>()
    const handled = new WeakSet<HTMLElement>()

    const settle = (element: HTMLElement, delay: number) => {
      element.setAttribute('data-revealed', '')
      const timer = window.setTimeout(() => {
        timers.delete(timer)
        element.removeAttribute('data-reveal-item')
        element.removeAttribute('data-revealed')
        element.style.removeProperty('--reveal-delay')
      }, CLEANUP_AFTER + delay)
      timers.add(timer)
    }

    const delayOf = (element: HTMLElement) =>
      Number.parseFloat(element.style.getPropertyValue('--reveal-delay')) || 0

    const motionless = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const observer =
      motionless || !('IntersectionObserver' in window)
        ? null
        : new IntersectionObserver(
            (entries, self) => {
              for (const entry of entries) {
                if (!entry.isIntersecting) continue
                const element = entry.target as HTMLElement
                self.unobserve(element)
                settle(element, delayOf(element))
              }
            },
            { rootMargin: '0px 0px -8% 0px', threshold: 0 },
          )

    const scan = () => {
      const fresh = new Set(
        Array.from(root.querySelectorAll<HTMLElement>('[data-reveal-item]')).filter(
          (element) => !handled.has(element),
        ),
      )
      if (fresh.size === 0) return
      fresh.forEach((element) => handled.add(element))

      if (!observer) {
        fresh.forEach((element) => settle(element, 0))
        return
      }

      for (const group of root.querySelectorAll<HTMLElement>('[data-reveal-stagger]')) {
        const members = Array.from(group.querySelectorAll<HTMLElement>('[data-reveal-item]'))
        members.forEach((element, index) => {
          if (fresh.has(element)) {
            element.style.setProperty('--reveal-delay', `${index * STAGGER_STEP}ms`)
          }
        })
      }

      const viewport = window.innerHeight || document.documentElement.clientHeight
      for (const element of fresh) {
        const rect = element.getBoundingClientRect()
        if (rect.top < viewport && rect.bottom > 0) {
          settle(element, delayOf(element))
        } else {
          observer.observe(element)
        }
      }
    }

    scan()

    let queued = 0
    const carriesItems = (records: MutationRecord[]) =>
      records.some((record) =>
        Array.from(record.addedNodes).some(
          (node) =>
            node instanceof HTMLElement &&
            (node.hasAttribute('data-reveal-item') || node.querySelector('[data-reveal-item]')),
        ),
      )

    const mutations = new MutationObserver((records) => {
      if (queued || !carriesItems(records)) return
      queued = window.requestAnimationFrame(() => {
        queued = 0
        scan()
      })
    })
    mutations.observe(root, { childList: true, subtree: true })

    return () => {
      mutations.disconnect()
      observer?.disconnect()
      if (queued) window.cancelAnimationFrame(queued)
      timers.forEach((timer) => window.clearTimeout(timer))
      root.removeAttribute('data-reveal-armed')
    }
  }, [])

  return null
}
