/* One-off: download Pexels photos (free license) and convert to WebP for the
 * 4 new P1 posts that were missing hero images + 5 brand-new articles.
 * Mirrors scripts/fetch-blog-images.js (1600px WebP q80, 3:2 cover crop). */
const sharp = require('sharp')
const fs = require('fs')
const path = require('path')

const items = [
  // --- 4 missing hero images for already-published P1 posts ---
  ['website-cost-israel-2026', 6693665], // budget planning, man+woman with laptop
  ['web-development-bat-yam', 7988742], // developers working on a computer
  ['business-automation-cost-roi', 8353818], // discussing ROI graphs on a laptop
  ['best-crm-small-business-israel', 7693716], // team looking at a dashboard on screen
  // --- hero images for the 5 new articles ---
  ['web-development-gush-dan', 18837985], // Tel Aviv / Gush Dan skyline + coast
  ['seo-cost-monthly-israel', 6016350], // sales/SEO growth graph
  ['freelancer-vs-web-agency', 3183128], // single person working on a laptop (freelancer)
  ['how-to-choose-digital-agency', 3182822], // top-view team meeting (choosing a partner)
  ['cheap-website-hidden-costs', 5466806], // hand on a calculator (hidden costs)
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
