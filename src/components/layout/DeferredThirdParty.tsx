'use client'

import { useEffect } from 'react'

const SIENNA_SRC = 'https://website-widgets.pages.dev/dist/sienna.min.js'
const CLARITY_SNIPPET = `(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);})(window, document, "clarity", "script", "wjb2tel6du");`
const INTENT_EVENTS = ['pointerdown', 'keydown', 'touchstart', 'scroll', 'mousemove'] as const
const ANALYTICS_DELAY = 3000
const WIDGETS_DELAY = 5000

type GtagWindow = Window & { gtag?: (...args: unknown[]) => void }

let analyticsStarted = false
let widgetsStarted = false

function appendScript(src: string) {
  const script = document.createElement('script')
  script.src = src
  script.async = true
  document.body.appendChild(script)
}

function startAnalytics(gaId: string | undefined) {
  if (analyticsStarted || !gaId) return
  analyticsStarted = true
  appendScript(`https://www.googletagmanager.com/gtag/js?id=${gaId}`)
  const { gtag } = window as GtagWindow
  gtag?.('js', new Date())
  gtag?.('config', gaId, { anonymize_ip: true })
}

function startWidgets() {
  if (widgetsStarted) return
  widgetsStarted = true
  appendScript(SIENNA_SRC)
  const clarity = document.createElement('script')
  clarity.textContent = CLARITY_SNIPPET
  document.body.appendChild(clarity)
}

export default function DeferredThirdParty({ gaId }: { gaId?: string }) {
  useEffect(() => {
    if (analyticsStarted && widgetsStarted) return

    const analyticsTimer = window.setTimeout(() => startAnalytics(gaId), ANALYTICS_DELAY)
    const widgetsTimer = window.setTimeout(trigger, WIDGETS_DELAY)

    function trigger() {
      window.clearTimeout(analyticsTimer)
      window.clearTimeout(widgetsTimer)
      INTENT_EVENTS.forEach((type) => window.removeEventListener(type, trigger))
      startAnalytics(gaId)
      startWidgets()
    }

    INTENT_EVENTS.forEach((type) => window.addEventListener(type, trigger, { passive: true }))

    return () => {
      window.clearTimeout(analyticsTimer)
      window.clearTimeout(widgetsTimer)
      INTENT_EVENTS.forEach((type) => window.removeEventListener(type, trigger))
    }
  }, [gaId])

  return null
}
