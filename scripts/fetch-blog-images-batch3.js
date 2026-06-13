/* One-off: download Pexels photos (free license) -> WebP for the 9 P3/P4
 * articles. Mirrors scripts/fetch-blog-images.js (1600px WebP q80, 3:2 cover). */
const sharp = require('sharp')
const fs = require('fs')
const path = require('path')

const items = [
  ['whatsapp-business-api-crm-integration', 4921407], // person sending a text message
  ['business-site-vs-online-store', 7620626], // person shopping online (ecommerce)
  ['ppc-minimum-budget-israel', 6016348], // team reviewing a chart on a laptop
  ['ga4-pixel-conversion-tracking-guide', 7653571], // people working with graphs (analytics)
  ['website-maintenance-cost-yearly', 211122], // "under construction" on laptop keyboard
  ['business-automation-12-processes', 8438967], // a friendly robot device (automation)
  ['crm-israeli-invoicing-integration', 6694535], // accounting + calculator (invoicing)
  ['website-accessibility-cost-5568', 7446646], // woman in a wheelchair working (accessibility)
  ['website-migration-wix-redesign', 36497969], // close-up of programmer typing code (rebuild)
]

const outDir = path.join(process.cwd(), 'public', 'images', 'blog')
fs.mkdirSync(outDir, { recursive: true })

;(async () => {
  let fails = 0
  for (const [name, id] of items) {
    const urls = [
      `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=1920`,
      `https://images.pexels.com/photos/${id}/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=1920`,
    ]
    let buf = null
    for (const u of urls) {
      try {
        const r = await fetch(u)
        if (r.ok) {
          buf = Buffer.from(await r.arrayBuffer())
          break
        }
      } catch {}
    }
    if (!buf) {
      console.log('FAIL', name, id)
      fails++
      continue
    }
    const out = path.join(outDir, `${name}.webp`)
    await sharp(buf)
      .resize(1600, 1067, { fit: 'cover', withoutEnlargement: true })
      .webp({ quality: 80 })
      .toFile(out)
    console.log('OK', name, Math.round(fs.statSync(out).size / 1024) + 'KB')
  }
  process.exit(fails ? 1 : 0)
})()
