export const escapeHtml = (text: string) =>
  text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

export const printCredit = (toolName: string) => `<p class="credit">נוצר ב${escapeHtml(toolName)} של aiterra.co.il</p>`

export const printPage = (title: string, css: string, body: string) =>
  `<!doctype html><html lang="he" dir="rtl"><head><meta charset="utf-8"><title>${escapeHtml(title)}</title><style>${css}</style></head><body>${body}</body></html>`

export function openPrint(html: string) {
  const frame = document.createElement('iframe')
  frame.setAttribute('aria-hidden', 'true')
  frame.tabIndex = -1
  Object.assign(frame.style, { position: 'fixed', bottom: '0', width: '0', height: '0', border: '0' })
  frame.onload = () => {
    const view = frame.contentWindow
    if (!view) return
    view.focus()
    view.print()
    window.setTimeout(() => frame.remove(), 1000)
  }
  frame.srcdoc = html
  document.body.appendChild(frame)
}

export function freshSeed() {
  const buffer = new Uint32Array(1)
  globalThis.crypto.getRandomValues(buffer)
  return (buffer[0] % 900000) + 100000
}
