import type { ReactNode } from 'react'
import ScrollReveal from './components/ScrollReveal'
import VideoAutopause from './components/VideoAutopause'
import './styles/v2.css'

export default function V2Layout({ children }: { children: ReactNode }) {
  return (
    <div className="v2Root">
      {children}
      <ScrollReveal />
      <VideoAutopause />
    </div>
  )
}
