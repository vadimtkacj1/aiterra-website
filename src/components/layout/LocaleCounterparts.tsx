'use client'

import { createContext, useContext, useMemo, type ReactNode } from 'react'
import type { Counterparts } from '@/lib/locale-path'

const NONE: Counterparts = { posts: new Set(), services: new Set() }

const CounterpartsContext = createContext<Counterparts>(NONE)

export default function LocaleCounterpartsProvider({
  posts,
  services,
  children,
}: {
  posts: string[]
  services: string[]
  children: ReactNode
}) {
  const value = useMemo(() => ({ posts: new Set(posts), services: new Set(services) }), [posts, services])
  return <CounterpartsContext.Provider value={value}>{children}</CounterpartsContext.Provider>
}

export function useLocaleCounterparts() {
  return useContext(CounterpartsContext)
}
