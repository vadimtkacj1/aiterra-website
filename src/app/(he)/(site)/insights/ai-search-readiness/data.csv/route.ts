import { readinessCsv } from '@/lib/insights/ai-search-readiness'

export const dynamic = 'force-static'

export function GET() {
  return new Response(`﻿${readinessCsv()}\n`, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': 'inline; filename="aiterra-ai-search-readiness-2026.csv"',
    },
  })
}
