'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import Image from 'next/image'
import { LayoutList, LogOut, X } from 'lucide-react'

const SIDEBAR_BG = '#0f172a'
const BORDER_SUBTLE = 'rgba(255,255,255,0.06)'
const BORDER_MID = 'rgba(255,255,255,0.08)'

const links = [
  { href: '/admin/blog', label: 'פוסטים', icon: LayoutList, exact: false },
]

function SideMenu({ pathname }: { pathname: string }) {
  return (
    <nav style={{ padding: '8px 8px' }} className="flex flex-col gap-0.5">
      {links.map(({ href, label, icon: Icon, exact }) => {
        const active = exact
          ? pathname === href
          : pathname.startsWith(href) && pathname !== '/admin/blog/new'
        return (
          <Link
            key={href}
            href={href}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              padding: '9px 14px',
              borderRadius: 8,
              fontSize: 14,
              fontWeight: 500,
              transition: 'all 0.15s',
              background: active ? 'linear-gradient(92.63deg,#1B1BB3 14.57%,#530FAD 99.27%)' : 'transparent',
              color: active ? '#fff' : 'rgba(255,255,255,0.55)',
            }}
            onMouseEnter={(e) => { if (!active) (e.currentTarget as HTMLElement).style.color = '#fff'; if (!active) (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.06)' }}
            onMouseLeave={(e) => { if (!active) (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.55)'; if (!active) (e.currentTarget as HTMLElement).style.background = 'transparent' }}
          >
            <Icon size={16} strokeWidth={2} />
            {label}
          </Link>
        )
      })}
    </nav>
  )
}

function SidebarInner({ onClose, pathname, onLogout }: { onClose?: () => void; pathname: string; onLogout: () => void }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: SIDEBAR_BG }}>
      {/* Close button — mobile only */}
      {onClose && (
        <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '12px 12px 0' }}>
          <button
            onClick={onClose}
            style={{ color: 'rgba(255,255,255,0.5)', background: 'none', border: 'none', cursor: 'pointer', padding: 6, borderRadius: 6 }}
          >
            <X size={18} />
          </button>
        </div>
      )}

      {/* Logo */}
      <div style={{ display: 'flex', justifyContent: 'center', padding: onClose ? '8px 12px 20px' : '20px 12px 16px' }}>
        <Image src="/icons/white-logo.svg" alt="AITERRA" width={120} height={40} unoptimized style={{ objectFit: 'contain' }} />
      </div>

      {/* Menu */}
      <div style={{ flex: 1, minHeight: 0, overflow: 'auto' }}>
        <SideMenu pathname={pathname} />
      </div>

      {/* Footer: logout */}
      <div style={{ padding: '14px 8px 20px', borderTop: `1px solid ${BORDER_MID}` }}>
        <button
          onClick={onLogout}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            padding: '9px 14px',
            borderRadius: 8,
            fontSize: 14,
            color: 'rgba(255,255,255,0.45)',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            transition: 'all 0.15s',
          }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = '#fff'; (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.06)' }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.45)'; (e.currentTarget as HTMLElement).style.background = 'none' }}
        >
          <LogOut size={16} strokeWidth={2} />
          יציאה
        </button>
      </div>
    </div>
  )
}

export default function AdminSidebar({ mobileOpen, onMobileClose, desktopOpen = true }: { mobileOpen?: boolean; onMobileClose?: () => void; desktopOpen?: boolean }) {
  const pathname = usePathname()
  const router = useRouter()

  const logout = async () => {
    await fetch('/api/admin/auth', { method: 'DELETE' })
    router.push('/admin/login')
  }

  return (
    <>
      {/* Desktop fixed sidebar */}
      <aside style={{
        width: 248,
        flexShrink: 0,
        height: '100vh',
        background: SIDEBAR_BG,
        position: 'fixed',
        top: 0,
        right: 0,
        bottom: 0,
        zIndex: 20,
        borderLeft: `1px solid ${BORDER_SUBTLE}`,
        transform: desktopOpen ? 'translateX(0)' : 'translateX(100%)',
        transition: 'transform 0.25s ease',
      }} className="hidden md:block">
        <SidebarInner pathname={pathname} onLogout={logout} />
      </aside>

      {/* Mobile drawer overlay */}
      {mobileOpen && (
        <>
          <div
            onClick={onMobileClose}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 30 }}
          />
          <aside style={{
            position: 'fixed',
            top: 0,
            right: 0,
            bottom: 0,
            width: 288,
            zIndex: 40,
            background: SIDEBAR_BG,
          }}>
            <SidebarInner pathname={pathname} onClose={onMobileClose} onLogout={logout} />
          </aside>
        </>
      )}
    </>
  )
}
