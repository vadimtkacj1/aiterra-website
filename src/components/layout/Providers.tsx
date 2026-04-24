'use client'

import type { ReactNode } from 'react'
import { DocumentEndProvider } from '@/context/DocumentEndContext'

export default function Providers({ children }: { children: ReactNode }) {
  return <DocumentEndProvider>{children}</DocumentEndProvider>
}
