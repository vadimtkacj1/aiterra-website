'use client'

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'

type DocumentEndContextValue = {
  atDocumentEnd: boolean
  setDocumentEnd: (value: boolean) => void
}

const DocumentEndContext = createContext<DocumentEndContextValue | null>(null)

export function DocumentEndProvider({ children }: { children: ReactNode }) {
  const [atDocumentEnd, setAtDocumentEnd] = useState(false)
  const setDocumentEnd = useCallback((value: boolean) => {
    setAtDocumentEnd(value)
  }, [])

  const value = useMemo(
    () => ({ atDocumentEnd, setDocumentEnd }),
    [atDocumentEnd, setDocumentEnd],
  )

  return (
    <DocumentEndContext.Provider value={value}>{children}</DocumentEndContext.Provider>
  )
}

export function useDocumentEnd(): DocumentEndContextValue {
  const ctx = useContext(DocumentEndContext)
  if (!ctx) {
    return {
      atDocumentEnd: false,
      setDocumentEnd: () => {},
    }
  }
  return ctx
}
