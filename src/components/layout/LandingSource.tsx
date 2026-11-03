'use client'

import { useEffect } from 'react'
import { rememberLanding } from '@/lib/lead-attribution'

export default function LandingSource() {
  useEffect(() => {
    rememberLanding()
  }, [])
  return null
}
