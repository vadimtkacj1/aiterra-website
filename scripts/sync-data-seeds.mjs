// Copies the canonical content data into src/ so it ships inside the server build.
// Production mounts a persistent volume over data/ — a stale volume must never
// be able to hide content committed to the repo. Runs automatically via `prebuild`.
import { copyFileSync } from 'node:fs'

const seeds = [
  ['../data/blog-posts.json', '../src/data/blog-seed.json'],
  ['../data/portfolio-projects.json', '../src/data/portfolio-seed.json'],
]

for (const [src, dest] of seeds) {
  copyFileSync(new URL(src, import.meta.url), new URL(dest, import.meta.url))
  console.log(`synced ${src.slice(3)} -> ${dest.slice(3)}`)
}
