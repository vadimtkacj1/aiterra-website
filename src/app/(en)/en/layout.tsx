import type { ReactNode } from 'react'
import { enOverrides } from '@/lib/v2-content-server'
import ScrollReveal from '../../(he)/v2/components/ScrollReveal'
import VideoAutopause from '../../(he)/v2/components/VideoAutopause'
import V2ContentProvider from '../../(he)/v2/V2ContentProvider'
import '../../(he)/v2/styles/v2.css'

export default function EnLayout({ children }: { children: ReactNode }) {
  return (
    <V2ContentProvider overrides={enOverrides()}>
      <div className="v2Root">
        {children}
        <ScrollReveal />
        <VideoAutopause />
      </div>
    </V2ContentProvider>
  )
}
