// Copies the canonical blog data into src/ so it ships inside the server build.
// Production mounts a persistent volume over data/ — a stale volume must never
// be able to hide posts committed to the repo. Runs automatically via `prebuild`.
import { copyFileSync } from 'node:fs'

const src = new URL('../data/blog-posts.json', import.meta.url)
const dest = new URL('../src/data/blog-seed.json', import.meta.url)
copyFileSync(src, dest)
console.log('synced data/blog-posts.json -> src/data/blog-seed.json')
