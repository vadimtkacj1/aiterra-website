export const ADMIN_COOKIE = 'admin_session'

const encoder = new TextEncoder()

export async function adminSessionToken(): Promise<string | null> {
  const password = process.env.ADMIN_PASSWORD
  if (!password) return null
  const digest = await crypto.subtle.digest('SHA-256', encoder.encode(`aiterra-admin-session:${password}`))
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, '0')).join('')
}

export async function isAdminSession(value: string | undefined): Promise<boolean> {
  if (!value) return false
  const expected = await adminSessionToken()
  return expected !== null && value === expected
}
