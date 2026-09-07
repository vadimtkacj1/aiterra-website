'use client'

import type { ReactNode } from 'react'
import { useState } from 'react'
import { usePathname } from 'next/navigation'
import AdminSidebar from '@/components/admin/AdminSidebar'
import { AdminMenuContext } from '@/components/admin/AdminMenuContext'

export default function AdminLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const isLogin = pathname === '/admin/login'
  const [mobileOpen, setMobileOpen] = useState(false)
  const [desktopOpen, setDesktopOpen] = useState(true)

  if (isLogin) {
    return (
      <div className="min-h-screen bg-[#0f172a] flex items-center justify-center">
        {children}
      </div>
    )
  }

  return (
    <AdminMenuContext.Provider value={{
      onBurger: () => {
        if (window.innerWidth >= 768) setDesktopOpen((v) => !v)
        else setMobileOpen(true)
      },
    }}>
      <div dir="rtl" style={{ display: 'flex', minHeight: '100vh', background: '#f5f5f5' }}>
        <AdminSidebar
          mobileOpen={mobileOpen}
          onMobileClose={() => setMobileOpen(false)}
          desktopOpen={desktopOpen}
        />
        <div
          style={{
            flex: 1,
            minWidth: 0,
            marginRight: desktopOpen ? undefined : 0,
            transition: 'margin-right 0.25s ease',
          }}
          className={desktopOpen ? 'md:mr-62' : ''}
        >
          <main style={{ minHeight: '100vh' }}>
            {children}
          </main>
        </div>
      </div>
    </AdminMenuContext.Provider>
  )
}
