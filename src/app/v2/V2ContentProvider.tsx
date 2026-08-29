'use client'

import { createContext, useContext, useMemo, type ReactNode } from 'react'
import type { V2Content, V2ContentKey } from './content'
import { mergeV2, type V2Overrides } from './contentMerge'

const EMPTY: V2Overrides = {}

const V2OverridesContext = createContext<V2Overrides>(EMPTY)

export default function V2ContentProvider({
  overrides,
  children,
}: {
  overrides: V2Overrides
  children: ReactNode
}) {
  return <V2OverridesContext.Provider value={overrides}>{children}</V2OverridesContext.Provider>
}

export function useV2<K extends V2ContentKey>(key: K, fallback: V2Content[K]): V2Content[K] {
  const overrides = useContext(V2OverridesContext)
  return useMemo(() => mergeV2(fallback, overrides[key]), [fallback, overrides, key])
}
