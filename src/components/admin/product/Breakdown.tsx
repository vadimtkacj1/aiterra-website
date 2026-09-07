import type { Slice } from './types'

export default function Breakdown({
  title,
  slices,
  labels,
  empty,
}: {
  title: string
  slices: Slice[]
  labels?: Record<string, string>
  empty: string
}) {
  const total = slices.reduce((sum, slice) => sum + slice.count, 0)

  return (
    <section
      style={{
        background: '#fff',
        border: '1px solid #e5e7eb',
        borderRadius: 12,
        padding: '14px 16px',
      }}
    >
      <h2 style={{ fontSize: 14, fontWeight: 700, color: '#0f172a', marginBottom: 10 }}>{title}</h2>

      {slices.length === 0 ? (
        <p style={{ fontSize: 13, color: '#94a3b8' }}>{empty}</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {slices.map((slice) => {
            const share = total === 0 ? 0 : slice.count / total
            return (
              <div key={slice.key}>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontSize: 13,
                    color: '#334155',
                    marginBottom: 3,
                  }}
                >
                  <span>{labels?.[slice.key] ?? slice.key}</span>
                  <span style={{ color: '#64748b', fontVariantNumeric: 'tabular-nums' }}>
                    {slice.count}
                  </span>
                </div>
                <div style={{ height: 6, background: '#eef2f7', borderRadius: 999 }}>
                  <div
                    style={{
                      height: 6,
                      width: `${Math.max(2, Math.round(share * 100))}%`,
                      borderRadius: 999,
                      background: 'linear-gradient(92.63deg,#2447D6 14.57%,#3E96F9 99.27%)',
                    }}
                  />
                </div>
              </div>
            )
          })}
        </div>
      )}
    </section>
  )
}
