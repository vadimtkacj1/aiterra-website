export type SheetSection = { title: string; note?: string; items: string[]; newPage?: boolean }

const escapeHtml = (text: string) =>
  text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

const STYLE = `
  body { font-family: Arial, sans-serif; color: #111; margin: 16mm; line-height: 1.5; }
  h1 { font-size: 24px; margin: 0 0 16px; }
  h2 { font-size: 18px; margin: 20px 0 4px; break-after: avoid; }
  p { margin: 0 0 8px; color: #444; }
  li { margin-bottom: 6px; break-inside: avoid; }
  .new-page { break-before: page; }
`

function sectionHtml({ title, note, items, newPage }: SheetSection) {
  const list = items.map((item) => `<li>${escapeHtml(item)}</li>`).join('')
  const noteHtml = note ? `<p>${escapeHtml(note)}</p>` : ''
  return `<section${newPage ? ' class="new-page"' : ''}><h2>${escapeHtml(title)}</h2>${noteHtml}<ol>${list}</ol></section>`
}

export function printSheet(title: string, sections: SheetSection[]) {
  const frame = document.createElement('iframe')
  frame.title = title
  frame.style.cssText = 'position:fixed;width:0;height:0;border:0'
  document.body.appendChild(frame)
  const view = frame.contentWindow
  if (!view) return
  view.document.open()
  view.document.write(
    `<!doctype html><html lang="he" dir="rtl"><head><meta charset="utf-8"><title>${escapeHtml(title)}</title><style>${STYLE}</style></head><body><h1>${escapeHtml(title)}</h1>${sections.map(sectionHtml).join('')}</body></html>`,
  )
  view.document.close()
  view.focus()
  view.print()
  setTimeout(() => frame.remove(), 60_000)
}

export function shuffled<T>(items: T[], seed: number) {
  const result = [...items]
  let state = seed + 1
  for (let index = result.length - 1; index > 0; index -= 1) {
    state = (state * 1664525 + 1013904223) % 4294967296
    const other = state % (index + 1)
    ;[result[index], result[other]] = [result[other], result[index]]
  }
  return result
}
