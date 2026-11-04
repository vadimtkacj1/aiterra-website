export type PageMode = 'a4' | 'a4-full' | 'image'

export type JpegPage = { bytes: Uint8Array; width: number; height: number }

export const A4_WIDTH = 595.28
export const A4_HEIGHT = 841.89
const MARGIN = 28
const PX_TO_PT = 0.75

export const PAGE_MODES: { value: PageMode; label: string; hint: string }[] = [
  { value: 'a4', label: 'A4 עם שוליים', hint: 'מתאים להדפסה ולשליחה' },
  { value: 'a4-full', label: 'A4 בלי שוליים', hint: 'התמונה ממלאת את הדף ככל האפשר' },
  { value: 'image', label: 'בגודל התמונה', hint: 'כל עמוד בגודל התמונה עצמה' },
]

type Placement = { pageWidth: number; pageHeight: number; x: number; y: number; width: number; height: number }

export function placeImage(width: number, height: number, mode: PageMode): Placement {
  if (mode === 'image') {
    const pageWidth = width * PX_TO_PT
    const pageHeight = height * PX_TO_PT
    return { pageWidth, pageHeight, x: 0, y: 0, width: pageWidth, height: pageHeight }
  }
  const landscape = width > height
  const pageWidth = landscape ? A4_HEIGHT : A4_WIDTH
  const pageHeight = landscape ? A4_WIDTH : A4_HEIGHT
  const margin = mode === 'a4' ? MARGIN : 0
  const scale = Math.min((pageWidth - margin * 2) / width, (pageHeight - margin * 2) / height)
  const drawWidth = width * scale
  const drawHeight = height * scale
  return {
    pageWidth,
    pageHeight,
    x: (pageWidth - drawWidth) / 2,
    y: (pageHeight - drawHeight) / 2,
    width: drawWidth,
    height: drawHeight,
  }
}

const encoder = new TextEncoder()
const num = (value: number) => (Math.round(value * 100) / 100).toString()

export function buildPdf(pages: JpegPage[], mode: PageMode): Uint8Array<ArrayBuffer> {
  const chunks: Uint8Array[] = []
  const offsets: number[] = []
  let length = 0

  const push = (part: string | Uint8Array) => {
    const bytes = typeof part === 'string' ? encoder.encode(part) : part
    chunks.push(bytes)
    length += bytes.length
  }
  const startObject = (id: number) => {
    offsets[id] = length
    push(`${id} 0 obj\n`)
  }

  const pageIds = pages.map((_, index) => 3 + index * 3)
  push('%PDF-1.4\n%\xE2\xE3\xCF\xD3\n')

  startObject(1)
  push('<< /Type /Catalog /Pages 2 0 R >>\nendobj\n')
  startObject(2)
  push(`<< /Type /Pages /Kids [${pageIds.map((id) => `${id} 0 R`).join(' ')}] /Count ${pages.length} >>\nendobj\n`)

  pages.forEach((page, index) => {
    const pageId = pageIds[index]
    const imageId = pageId + 1
    const contentId = pageId + 2
    const place = placeImage(page.width, page.height, mode)
    const content = `q ${num(place.width)} 0 0 ${num(place.height)} ${num(place.x)} ${num(place.y)} cm /Im0 Do Q`

    startObject(pageId)
    push(
      `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${num(place.pageWidth)} ${num(place.pageHeight)}] ` +
        `/Resources << /XObject << /Im0 ${imageId} 0 R >> >> /Contents ${contentId} 0 R >>\nendobj\n`,
    )
    startObject(imageId)
    push(
      `<< /Type /XObject /Subtype /Image /Width ${page.width} /Height ${page.height} /ColorSpace /DeviceRGB ` +
        `/BitsPerComponent 8 /Filter /DCTDecode /Length ${page.bytes.length} >>\nstream\n`,
    )
    push(page.bytes)
    push('\nendstream\nendobj\n')
    startObject(contentId)
    push(`<< /Length ${content.length} >>\nstream\n${content}\nendstream\nendobj\n`)
  })

  const objectCount = 3 + pages.length * 3
  const xrefStart = length
  let xref = `xref\n0 ${objectCount}\n0000000000 65535 f \n`
  for (let id = 1; id < objectCount; id += 1) xref += `${String(offsets[id]).padStart(10, '0')} 00000 n \n`
  push(xref)
  push(`trailer\n<< /Size ${objectCount} /Root 1 0 R >>\nstartxref\n${xrefStart}\n%%EOF\n`)

  const out = new Uint8Array(length)
  let position = 0
  for (const chunk of chunks) {
    out.set(chunk, position)
    position += chunk.length
  }
  return out
}
