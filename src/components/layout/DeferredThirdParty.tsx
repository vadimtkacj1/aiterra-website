'use client'

import { useEffect } from 'react'
import { CONSENT_ACCEPTED, COOKIE_CONSENT_KEY } from '@/lib/cookie-consent'

const SIENNA_SRC = 'https://website-widgets.pages.dev/dist/sienna.min.js'
const CLARITY_SNIPPET = `(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);})(window, document, "clarity", "script", "wjb2tel6du");`
const INTENT_EVENTS = ['pointerdown', 'keydown', 'touchstart', 'scroll', 'mousemove'] as const
const FALLBACK_DELAY = 5000

let siennaStarted = false
let clarityStarted = false

function startSienna() {
  if (siennaStarted) return
  siennaStarted = true

  const sienna = document.createElement('script')
  sienna.src = SIENNA_SRC
  sienna.async = true
  document.body.appendChild(sienna)
}

function cookiesAccepted() {
  try {
    return localStorage.getItem(COOKIE_CONSENT_KEY) === CONSENT_ACCEPTED
  } catch {
    return false
  }
}

function startClarityIfAccepted() {
  if (clarityStarted || !cookiesAccepted()) return
  clarityStarted = true

  const clarity = document.createElement('script')
  clarity.textContent = CLARITY_SNIPPET
  document.body.appendChild(clarity)
}

export default function DeferredThirdParty() {
  useEffect(() => {
    window.addEventListener('click', startClarityIfAccepted)
    return () => window.removeEventListener('click', startClarityIfAccepted)
  }, [])

  useEffect(() => {
    if (siennaStarted) return

    const timer = window.setTimeout(trigger, FALLBACK_DELAY)

    function trigger() {
      window.clearTimeout(timer)
      INTENT_EVENTS.forEach((type) => window.removeEventListener(type, trigger))
      startSienna()
      startClarityIfAccepted()
    }

    INTENT_EVENTS.forEach((type) => window.addEventListener(type, trigger, { passive: true }))

    return () => {
      window.clearTimeout(timer)
      INTENT_EVENTS.forEach((type) => window.removeEventListener(type, trigger))
    }
  }, [])

  return null
}
