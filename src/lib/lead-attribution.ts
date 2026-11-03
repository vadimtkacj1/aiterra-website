const LANDING_KEY = 'aiterra-landing'

type Landing = { url?: string; referrer?: string }

export function rememberLanding() {
  try {
    if (sessionStorage.getItem(LANDING_KEY)) return
    const landing: Landing = { url: location.pathname + location.search, referrer: document.referrer }
    sessionStorage.setItem(LANDING_KEY, JSON.stringify(landing))
  } catch {
    return
  }
}

function readLanding(): Landing {
  try {
    return JSON.parse(sessionStorage.getItem(LANDING_KEY) || '{}') as Landing
  } catch {
    return {}
  }
}

export function leadAttribution(): string {
  if (typeof window === 'undefined') return ''
  const landing = readLanding()
  return [
    landing.url && `כניסה: ${landing.url}`,
    landing.referrer && `הגיע מ: ${landing.referrer}`,
    `שליחה: ${location.pathname}`,
  ]
    .filter(Boolean)
    .join(' | ')
    .slice(0, 600)
}
