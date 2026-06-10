import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'AITERRA – שיווק דיגיטלי, בניית אתרים ופיתוח מתקדם'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #080112 0%, #1B1BB3 60%, #530FAD 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'sans-serif',
        }}
      >
        <div
          style={{
            color: 'white',
            fontSize: 100,
            fontWeight: 900,
            letterSpacing: '-4px',
            lineHeight: 1,
          }}
        >
          AITERRA
        </div>

        <div
          style={{
            width: 80,
            height: 3,
            background: 'rgba(255,255,255,0.5)',
            marginTop: 28,
            marginBottom: 28,
            borderRadius: 2,
          }}
        />

        <div
          style={{
            color: 'rgba(255,255,255,0.85)',
            fontSize: 30,
            textAlign: 'center',
            maxWidth: 860,
            lineHeight: 1.4,
          }}
        >
          {'שיווק דיגיטלי | בניית אתרים | SEO | פרסום ממומן'}
        </div>

        <div
          style={{
            marginTop: 48,
            padding: '10px 28px',
            background: 'rgba(255,255,255,0.12)',
            border: '1px solid rgba(255,255,255,0.3)',
            borderRadius: 24,
            color: 'rgba(255,255,255,0.9)',
            fontSize: 22,
            letterSpacing: '0.5px',
          }}
        >
          aiterra.co.il
        </div>
      </div>
    ),
    { ...size },
  )
}
