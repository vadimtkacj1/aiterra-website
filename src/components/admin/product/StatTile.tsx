export default function StatTile({
  label,
  value,
  hint,
}: {
  label: string
  value: string | number
  hint?: string
}) {
  return (
    <div
      style={{
        background: '#fff',
        border: '1px solid #e5e7eb',
        borderRadius: 12,
        padding: '14px 16px',
        minWidth: 0,
      }}
    >
      <div style={{ fontSize: 12, color: '#64748b', fontWeight: 500 }}>{label}</div>
      <div style={{ fontSize: 26, fontWeight: 700, color: '#0f172a', lineHeight: 1.2 }}>{value}</div>
      {hint ? <div style={{ fontSize: 11.5, color: '#94a3b8', marginTop: 2 }}>{hint}</div> : null}
    </div>
  )
}
