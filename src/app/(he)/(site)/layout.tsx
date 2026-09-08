import type { ReactNode } from 'react'
import { readV2Overrides } from '@/lib/v2-content-server'
import ScrollReveal from './components/ScrollReveal'
import VideoAutopause from './components/VideoAutopause'
import V2ContentProvider from './V2ContentProvider'
import './styles/v2.css'

export default function V2Layout({ children }: { children: ReactNode }) {
  return (
    <V2ContentProvider overrides={readV2Overrides()}>
      <div className="v2Root">
        {children}
        <ScrollReveal />
        <VideoAutopause />
      </div>
    </V2ContentProvider>
  )
}
