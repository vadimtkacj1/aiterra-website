export type EditorMode = 'edit' | 'browse'

export type DeviceId = 'desktop' | 'laptop' | 'tablet' | 'mobile'

export const DEVICES: { id: DeviceId; label: string; width: number | null }[] = [
  { id: 'desktop', label: 'מסך מלא', width: null },
  { id: 'laptop', label: 'לפטופ', width: 1280 },
  { id: 'tablet', label: 'טאבלט', width: 834 },
  { id: 'mobile', label: 'נייד', width: 390 },
]

export const PAGES: { path: string; label: string }[] = [
  { path: '/', label: 'דף הבית' },
  { path: '/about', label: 'אודות' },
  { path: '/services', label: 'שירותים' },
  { path: '/services/ecommerce', label: 'שירות — E-Commerce' },
  { path: '/projects', label: 'פרויקטים' },
  { path: '/projects/neot-sade', label: 'פרויקט — דוגמה' },
  { path: '/blog', label: 'בלוג' },
  { path: '/blog/whatsapp-business-api-crm-integration', label: 'מאמר — דוגמה' },
  { path: '/contact', label: 'יצירת קשר' },
  { path: '/terms-of-use', label: 'תנאי שימוש' },
  { path: '/privacy-policy', label: 'מדיניות פרטיות' },
  { path: '/accessibility-statement', label: 'הצהרת נגישות' },
]

export const EDITOR_STYLE_ID = 'v2-live-editor-style'

export const EDITOR_CSS = `
[data-v2edit], [data-v2edit-ph] { cursor: text; }
html[data-v2edit-mode="edit"] [data-v2edit]:hover,
html[data-v2edit-mode="edit"] [data-v2edit-ph]:hover {
  outline: 2px dashed rgba(62, 150, 249, 0.85);
  outline-offset: 3px;
  border-radius: 3px;
}
html[data-v2edit-mode="edit"] [data-v2edit-dirty] {
  outline: 2px solid #f59e0b;
  outline-offset: 3px;
  border-radius: 3px;
}
html[data-v2edit-mode="edit"] [data-v2edit-active] {
  outline: 2px solid #2447D6 !important;
  outline-offset: 3px;
  border-radius: 3px;
  background-color: rgba(36, 71, 214, 0.06);
}
html[data-v2edit-mode="edit"] [contenteditable] { caret-color: #2447D6; }
html[data-v2edit-mode="edit"] .v2Root[data-reveal-armed] [data-reveal-item] {
  opacity: 1 !important;
  transform: none !important;
}
`
