'use client'

import { useCallback, useEffect, useState } from 'react'
import { RefreshCw } from 'lucide-react'
import AdminHeader from '@/components/admin/AdminHeader'
import Breakdown from '@/components/admin/product/Breakdown'
import StatTile from '@/components/admin/product/StatTile'
import {
  errors,
  friction,
  percent,
  printing,
  searching,
  sectionsOpened,
  stockWrites,
  tally,
} from '@/components/admin/product/summarize'
import type { ProductPayload } from '@/components/admin/product/types'

const RANGES = [7, 30, 90] as const

const SECTION_LABELS: Record<string, string> = {
  scan: 'סריקה',
  generate: 'קטלוג',
  alerts: 'התראות מלאי',
  history: 'היסטוריה',
  store: 'חנות',
  settings: 'הגדרות',
  feedback: 'משוב',
  diagnostics: 'אבחון',
  addProduct: 'הוספת מוצר',
  receiving: 'קליטת סחורה',
}

const SOURCE_LABELS: Record<string, string> = {
  scan: 'מסריקה',
  receiving: 'מקליטת סחורה',
  catalog: 'מהקטלוג',
  editor: 'מעריכת מוצר',
}

const AREA_LABELS: Record<string, string> = {
  scan: 'סריקה',
  catalog: 'קטלוג',
  print: 'הדפסה',
  sync: 'סנכרון',
  store: 'חנות',
  setup: 'התקנה',
  unknown: 'לא ידוע',
}

const PLATFORM_LABELS: Record<string, string> = {
  ios: 'iPhone',
  android: 'Android',
  unknown: 'לא ידוע',
}

export default function AdminProductPage() {
  const [days, setDays] = useState<number>(30)
  const [data, setData] = useState<ProductPayload | null>(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  const load = useCallback(async (range: number) => {
    setLoading(true)
    setError('')
    try {
      const res = await fetch(`/api/admin/product?days=${range}`, { cache: 'no-store' })
      const body = await res.json()
      if (!res.ok) {
        setData(null)
        setError(
          body?.error === 'notConfigured'
            ? 'השרת של האפליקציה לא מוגדר כאן (PRINTER_API_URL / PRINTER_ADMIN_TOKEN).'
            : body?.error === 'upstreamUnreachable'
              ? 'לא הצלחנו להגיע לשרת האפליקציה.'
              : 'הבקשה נדחתה.'
        )
        return
      }
      setData(body as ProductPayload)
    } catch {
      setData(null)
      setError('לא הצלחנו לטעון את הנתונים.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    load(days)
  }, [days, load])

  const events = data?.events ?? []
  const print = printing(events)
  const stock = stockWrites(events)
  const search = searching(events)
  const rub = friction(data?.audit)
  const devices = data?.devices ?? null

  return (
    <div style={{ padding: '20px 20px 60px' }}>
      <AdminHeader title="שימוש במוצר" subtitle="איך משתמשים באפליקציה בפועל" />

      <div style={{ display: 'flex', gap: 8, alignItems: 'center', margin: '14px 0 18px' }}>
        {RANGES.map((range) => (
          <button
            key={range}
            onClick={() => setDays(range)}
            style={{
              padding: '7px 14px',
              borderRadius: 999,
              fontSize: 13,
              fontWeight: 600,
              border: '1px solid ' + (days === range ? 'transparent' : '#e5e7eb'),
              background:
                days === range ? 'linear-gradient(92.63deg,#2447D6 14.57%,#3E96F9 99.27%)' : '#fff',
              color: days === range ? '#fff' : '#334155',
              cursor: 'pointer',
            }}
          >
            {range} ימים
          </button>
        ))}
        <button
          onClick={() => load(days)}
          disabled={loading}
          style={{
            marginRight: 'auto',
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            padding: '7px 12px',
            borderRadius: 8,
            border: '1px solid #e5e7eb',
            background: '#fff',
            fontSize: 13,
            color: '#334155',
            cursor: loading ? 'default' : 'pointer',
          }}
        >
          <RefreshCw size={14} /> רענון
        </button>
      </div>

      {error ? <p style={{ fontSize: 14, color: '#b91c1c', marginBottom: 16 }}>{error}</p> : null}

      {data ? (
        <>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))',
              gap: 12,
              marginBottom: 18,
            }}
          >
            <StatTile
              label="חנויות פעילות (7 ימים)"
              value={devices?.activeShops7 ?? 0}
              hint={`מתוך ${devices?.shops ?? 0} רשומות`}
            />
            <StatTile
              label="מכשירים פעילים"
              value={devices?.active7 ?? 0}
              hint={`היום ${devices?.active1 ?? 0} · 30 יום ${devices?.active30 ?? 0}`}
            />
            <StatTile
              label="מדבקות שהודפסו"
              value={print.labels}
              hint={`${print.printed} הדפסות · ${percent(print.failureRate)} כשלונות`}
            />
            <StatTile
              label="עדכוני מלאי"
              value={stock.total}
              hint={`${stock.failed} נכשלו במכשיר`}
            />
            <StatTile
              label="חיכוך בכתיבה"
              value={percent(rub.frictionRate)}
              hint={`${rub.refused} נדחו · ${rub.unknown} ללא אישור`}
            />
            <StatTile
              label="חיפושים שמצאו"
              value={percent(search.hitRate)}
              hint={`${search.searches} חיפושים`}
            />
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: 12,
            }}
          >
            <Breakdown
              title="באילו מסכים משתמשים"
              slices={sectionsOpened(events)}
              labels={SECTION_LABELS}
              empty="עדיין אין נתונים לטווח הזה."
            />
            <Breakdown
              title="מאיפה מגיעים עדכוני המלאי"
              slices={stock.bySource}
              labels={SOURCE_LABELS}
              empty="עדיין לא נרשם עדכון מלאי."
            />
            <Breakdown title="גרסאות בשטח" slices={tally(devices?.byVersion)} empty="אין מכשירים." />
            <Breakdown
              title="מערכות הפעלה"
              slices={tally(devices?.byPlatform)}
              labels={PLATFORM_LABELS}
              empty="אין מכשירים."
            />
            <Breakdown
              title="איפה נופלת האפליקציה"
              slices={errors(events)}
              labels={AREA_LABELS}
              empty="לא דווחו שגיאות."
            />
            <Breakdown
              title="פעולות בשרת"
              slices={tally(data.audit)}
              empty="אין פעולות בטווח הזה."
            />
          </div>

          <p style={{ fontSize: 12, color: '#94a3b8', marginTop: 16 }}>
            נמדד רק בחנויות שמחוברות דרך שרת החנויות, ורק אם לא כיבו את השיתוף. מונים בלבד — בלי
            שמות מוצרים, מחירים או ברקודים.
          </p>
        </>
      ) : null}

      {loading && !data ? <p style={{ fontSize: 14, color: '#64748b' }}>טוען…</p> : null}
    </div>
  )
}
