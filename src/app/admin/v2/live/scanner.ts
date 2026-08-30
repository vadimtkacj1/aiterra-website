import { normalizeText, type TextEntry } from './textIndex'

export type Hit = {
  id: number
  entry: TextEntry
  el: HTMLElement
  node: Text | null
  kind: 'text' | 'placeholder'
  inline: boolean
}

export type EditLike = { value: string }

const SKIP_TAGS = new Set(['SCRIPT', 'STYLE', 'NOSCRIPT', 'TITLE', 'TEXTAREA', 'OPTION'])

export const idsOf = (el: Element): number[] =>
  `${el.getAttribute('data-v2edit') ?? ''} ${el.getAttribute('data-v2edit-ph') ?? ''}`
    .split(/\s+/)
    .filter(Boolean)
    .map(Number)

export const markDirty = (el: HTMLElement, dirty: boolean): void => {
  if (dirty) el.setAttribute('data-v2edit-dirty', '')
  else el.removeAttribute('data-v2edit-dirty')
}

export function scanFrame(
  doc: Document,
  entries: TextEntry[],
  edits: Record<string, EditLike>,
): Map<number, Hit> | null {
  if (!entries.length || !doc.body) return null

  const lookup = new Map<string, TextEntry[]>()
  const push = (norm: string, entry: TextEntry) => {
    const bucket = lookup.get(norm)
    if (bucket) bucket.push(entry)
    else lookup.set(norm, [entry])
  }
  for (const entry of entries) {
    push(normalizeText(entry.value), entry)
    const edit = edits[entry.pathId]
    if (edit) push(normalizeText(edit.value), entry)
  }

  for (const el of Array.from(
    doc.querySelectorAll('[data-v2edit],[data-v2edit-ph],[data-v2edit-dirty]'),
  )) {
    el.removeAttribute('data-v2edit')
    el.removeAttribute('data-v2edit-ph')
    el.removeAttribute('data-v2edit-dirty')
  }

  const hits = new Map<number, Hit>()
  const textSeen = new Map<string, number>()
  const placeholderSeen = new Map<string, number>()
  let id = 0

  const take = (seen: Map<string, number>, norm: string): TextEntry | null => {
    const bucket = lookup.get(norm)
    if (!bucket) return null
    const index = seen.get(norm) ?? 0
    seen.set(norm, index + 1)
    return bucket[Math.min(index, bucket.length - 1)]
  }

  const register = (hit: Hit) => {
    hits.set(hit.id, hit)
    const attribute = hit.kind === 'placeholder' ? 'data-v2edit-ph' : 'data-v2edit'
    const previous = hit.el.getAttribute(attribute)
    hit.el.setAttribute(attribute, previous ? `${previous} ${hit.id}` : String(hit.id))
    if (edits[hit.entry.pathId]) hit.el.setAttribute('data-v2edit-dirty', '')
  }

  const walker = doc.createTreeWalker(doc.body, NodeFilter.SHOW_TEXT)
  const nodes: Text[] = []
  while (walker.nextNode()) nodes.push(walker.currentNode as Text)

  for (const node of nodes) {
    const norm = normalizeText(node.nodeValue ?? '')
    if (!norm) continue
    const el = node.parentElement
    if (!el || SKIP_TAGS.has(el.tagName)) continue
    const entry = take(textSeen, norm)
    if (!entry) continue
    const edit = edits[entry.pathId]
    if (edit && normalizeText(edit.value) !== norm) node.nodeValue = edit.value
    const inline = Array.from(el.childNodes).every(
      (child) => child === node || !normalizeText(child.textContent ?? ''),
    )
    register({ id: ++id, entry, el, node, kind: 'text', inline })
  }

  for (const el of Array.from(doc.querySelectorAll<HTMLElement>('[placeholder]'))) {
    const norm = normalizeText(el.getAttribute('placeholder') ?? '')
    if (!norm) continue
    const entry = take(placeholderSeen, norm)
    if (!entry) continue
    const edit = edits[entry.pathId]
    if (edit && normalizeText(edit.value) !== norm) el.setAttribute('placeholder', edit.value)
    register({ id: ++id, entry, el, node: null, kind: 'placeholder', inline: false })
  }

  return hits
}
