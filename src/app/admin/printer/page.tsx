'use client'

import { useCallback, useEffect, useState } from 'react'
import { Activity, RefreshCw, Smartphone, Store } from 'lucide-react'
import AdminHeader from '@/components/admin/AdminHeader'

interface ShopRow {
  id: string
  name: string | null
  backend: string | null
  room: string
  socketsNow: number
  activeDevices: number
  allDevices: number
  lastSeenAt: string | null
  suspendedAt: string | null
}

interface DeviceRow {
  id: string
  shopId: string
  shopName: string | null
  name: string | null
  platform: string | null
  role: string | null
  lastSeenAt: string | null
  disabledAt: string | null
}

interface AuditRow {
  id: number | string
  shopId: string | null
  action: string
  productId: string | null
  before: Record<string, unknown> | null
  after: Record<string, unknown> | null
  at: string
}

const ACTION_LABELS: Record<string, string> = {
  'stock.adjust': 'שינוי מלאי',
  'stock.adjust.unknown': 'שינוי מלאי — תוצאה לא ידועה',
  'invite.issue': 'הנפקת קוד',
  'invite.redeem': 'הצטרפות מכשיר',
  'shop.connection.set': 'חיבור חנות',
  'shop.suspend': 'השעיית חנות',
  'shop.resume': 'חידוש חנות',
  'product.create': 'יצירת מוצר',
  'product.delete': 'מחיקת מוצר',
}

const PLATFORM_LABELS: Record<string, string> = {
  ios: 'iPhone',
  android: 'Android',
  linux: 'Linux',
  diagnostic: 'בדיקה',
}

const ROLE_LABELS: Record<string, string> = {
  manager: 'מנהל',
  seller: 'מוכר',
}

function formatTime(iso: string | null): string {
  if (!iso) return '—'
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return iso
  return new Intl.DateTimeFormat('he-IL', {
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Asia/Jerusalem',
  }).format(date)
}

function sinceLabel(iso: string | null): string {
  if (!iso) return 'מעולם'
  const ms = Date.now() - new Date(iso).getTime()
  if (!Number.isFinite(ms) || ms < 0) return formatTime(iso)
  const minutes = Math.floor(ms / 60000)
  if (minutes < 1) return 'עכשיו'
  if (minutes < 60) return 'לפני ' + minutes + ' דקות'
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return 'לפני ' + hours + ' שעות'
  return 'לפני ' + Math.floor(hours / 24) + ' ימים'
}

function stockDelta(row: AuditRow): string {
  const was = row.before?.stock_quantity
  const now = row.after?.stock_quantity
  if (was == null && now == null) return '—'
  return String(was ?? '?') + ' → ' + String(now ?? '?')
}

function Card({
  icon: Icon,
  label,
  value,
  hint,
}: {
  icon: typeof Smartphone
  label: string
  value: string | number
  hint?: string
}) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 flex items-start gap-3">
      <div className="rounded-md bg-gray-100 p-2 text-gray-600">
        <Icon size={18} />
      </div>
      <div className="min-w-0">
        <div className="text-[11px] font-semibold tracking-wide text-gray-500">{label}</div>
        <div className="text-2xl font-bold text-gray-900 tabular-nums leading-tight">{value}</div>
        {hint ? <div className="text-[11px] text-gray-400 mt-0.5">{hint}</div> : null}
      </div>
    </div>
  )
}

export default function AdminPrinterPage() {
  const [shops, setShops] = useState<ShopRow[]>([])
  const [devices, setDevices] = useState<DeviceRow[]>([])
  const [events, setEvents] = useState<AuditRow[]>([])
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [refreshedAt, setRefreshedAt] = useState<string | null>(null)

  const load = useCallback(async () => {
    try {
      const [devicesRes, auditRes] = await Promise.all([
        fetch('/api/admin/printer?view=devices', { cache: 'no-store' }),
        fetch('/api/admin/printer?view=audit&limit=60', { cache: 'no-store' }),
      ])

      if (devicesRes.status === 501) {
        const body = await devicesRes.json()
        setError('השרת לא מוגדר: ' + (body.detail ?? ''))
        return
      }
      if (!devicesRes.ok) {
        setError('השרת החזיר ' + devicesRes.status)
        return
      }

      const devicesBody = await devicesRes.json()
      setShops(devicesBody.shops ?? [])
      setDevices(devicesBody.devices ?? [])
      if (auditRes.ok) {
        const auditBody = await auditRes.json()
        setEvents(auditBody.events ?? [])
      }
      setError(null)
      setRefreshedAt(new Date().toISOString())
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void load()
    const timer = setInterval(() => void load(), 5000)
    return () => clearInterval(timer)
  }, [load])

  const online = shops.reduce((sum, shop) => sum + shop.socketsNow, 0)
  const shopsOnline = shops.filter((shop) => shop.socketsNow > 0).length

  return (
    <>
      <AdminHeader title="מכשירים מחוברים" />

      <div className="p-4 md:p-6 space-y-6">
        {error ? (
          <div className="rounded-lg border border-[#b91c1c]/30 bg-[#b91c1c]/5 text-[#b91c1c] px-4 py-3 text-sm">
            {error}
          </div>
        ) : null}

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <Card icon={Smartphone} label="מחוברים עכשיו" value={online} hint="אפליקציה פתוחה" />
          <Card icon={Store} label="חנויות פעילות" value={shopsOnline} hint={'מתוך ' + shops.length} />
          <Card icon={Smartphone} label="מכשירים רשומים" value={devices.length} />
          <Card
            icon={Activity}
            label="עודכן"
            value={refreshedAt ? formatTime(refreshedAt) : '—'}
            hint="רענון כל 5 שניות"
          />
        </div>

        <section className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <header className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-bold text-gray-900">חנויות</h2>
            <button
              type="button"
              onClick={() => void load()}
              className="text-gray-400 hover:text-gray-700 transition-colors"
              aria-label="רענון"
            >
              <RefreshCw size={16} className={loading ? 'animate-spin' : undefined} />
            </button>
          </header>
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[640px]">
              <thead className="bg-gray-50 text-[11px] text-gray-500">
                <tr>
                  <th className="text-right font-semibold px-4 py-2">חנות</th>
                  <th className="text-right font-semibold px-4 py-2">מחובר עכשיו</th>
                  <th className="text-right font-semibold px-4 py-2">מכשירים</th>
                  <th className="text-right font-semibold px-4 py-2">נראה לאחרונה</th>
                  <th className="text-right font-semibold px-4 py-2">חדר</th>
                </tr>
              </thead>
              <tbody>
                {shops.map((shop) => (
                  <tr key={shop.id} className="border-t border-gray-100">
                    <td className="px-4 py-2.5">
                      <div className="font-semibold text-gray-900">{shop.name || 'ללא שם'}</div>
                      <div className="text-[11px] text-gray-400">{shop.backend || '—'}</div>
                    </td>
                    <td className="px-4 py-2.5 tabular-nums">
                      {shop.socketsNow > 0 ? (
                        <span className="px-1.5 py-0.5 rounded text-[11px] font-semibold text-[#047857] bg-[#047857]/10">
                          {shop.socketsNow}
                        </span>
                      ) : (
                        <span className="text-gray-300">0</span>
                      )}
                    </td>
                    <td className="px-4 py-2.5 tabular-nums text-gray-600">{shop.activeDevices}</td>
                    <td className="px-4 py-2.5 text-gray-600">{sinceLabel(shop.lastSeenAt)}</td>
                    <td className="px-4 py-2.5 font-mono text-[10px] text-gray-400" dir="ltr">
                      {shop.room.slice(0, 12)}
                    </td>
                  </tr>
                ))}
                {shops.length === 0 && !loading ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-8 text-center text-gray-400">
                      אין חנויות
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>
        </section>

        <section className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <header className="px-4 py-3 border-b border-gray-100">
            <h2 className="font-bold text-gray-900">מכשירים</h2>
          </header>
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[640px]">
              <thead className="bg-gray-50 text-[11px] text-gray-500">
                <tr>
                  <th className="text-right font-semibold px-4 py-2">מכשיר</th>
                  <th className="text-right font-semibold px-4 py-2">פלטפורמה</th>
                  <th className="text-right font-semibold px-4 py-2">תפקיד</th>
                  <th className="text-right font-semibold px-4 py-2">חנות</th>
                  <th className="text-right font-semibold px-4 py-2">נראה לאחרונה</th>
                </tr>
              </thead>
              <tbody>
                {devices.map((device) => (
                  <tr
                    key={device.id}
                    className={
                      device.disabledAt
                        ? 'border-t border-gray-100 opacity-50'
                        : 'border-t border-gray-100'
                    }
                  >
                    <td className="px-4 py-2.5 text-gray-900">{device.name || 'ללא שם'}</td>
                    <td className="px-4 py-2.5 text-gray-600">
                      {PLATFORM_LABELS[device.platform ?? ''] || device.platform || '—'}
                    </td>
                    <td className="px-4 py-2.5 text-gray-600">
                      {ROLE_LABELS[device.role ?? ''] || '—'}
                    </td>
                    <td className="px-4 py-2.5 text-gray-600">{device.shopName || 'ללא שם'}</td>
                    <td className="px-4 py-2.5 text-gray-600">{sinceLabel(device.lastSeenAt)}</td>
                  </tr>
                ))}
                {devices.length === 0 && !loading ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-8 text-center text-gray-400">
                      אין מכשירים
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>
        </section>

        <section className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <header className="px-4 py-3 border-b border-gray-100">
            <h2 className="font-bold text-gray-900">פעולות אחרונות</h2>
          </header>
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[640px]">
              <thead className="bg-gray-50 text-[11px] text-gray-500">
                <tr>
                  <th className="text-right font-semibold px-4 py-2">זמן</th>
                  <th className="text-right font-semibold px-4 py-2">פעולה</th>
                  <th className="text-right font-semibold px-4 py-2">מוצר</th>
                  <th className="text-right font-semibold px-4 py-2">מלאי</th>
                </tr>
              </thead>
              <tbody>
                {events.map((row) => (
                  <tr key={String(row.id)} className="border-t border-gray-100">
                    <td className="px-4 py-2 text-gray-500 whitespace-nowrap">{formatTime(row.at)}</td>
                    <td className="px-4 py-2 text-gray-900">{ACTION_LABELS[row.action] || row.action}</td>
                    <td className="px-4 py-2 font-mono text-[11px] text-gray-500" dir="ltr">
                      {row.productId || '—'}
                    </td>
                    <td className="px-4 py-2 tabular-nums text-gray-700" dir="ltr">
                      {row.action.startsWith('stock.adjust') ? stockDelta(row) : '—'}
                    </td>
                  </tr>
                ))}
                {events.length === 0 && !loading ? (
                  <tr>
                    <td colSpan={4} className="px-4 py-8 text-center text-gray-400">
                      אין פעולות
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </>
  )
}
