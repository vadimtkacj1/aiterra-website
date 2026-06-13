/* One-off: download Pexels photos and convert to WebP for blog posts */
const sharp = require('sharp')
const fs = require('fs')
const path = require('path')

const items = [
  ['digital-branding', 37663437],
  ['google-business-profile', 14629408],
  ['content-marketing-blog', 1766604],
  ['content-marketing-blog-2', 5238140],
  ['website-security', 5483240],
  ['custom-web-systems', 16129724],
  ['email-marketing', 7568292],
  ['ux-ui-conversions', 3471423],
  ['short-video-tiktok', 7676401],
  ['short-video-tiktok-2', 12432850],
  ['marketing-analytics-roi', 34069],
  ['keyword-research', 40185],
  ['keyword-research-2', 16368540],
  ['geo-ai-search-optimization', 16094052],
  ['business-automation-crm-whatsapp', 4132538],
  ['website-accessibility-israel', 7162980],
  ['landing-pages-that-convert', 56759],
  ['wordpress-vs-custom-code', 16129703],
  ['ecommerce-store-that-sells', 6969932],
  ['facebook-instagram-ads', 33206676],
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
