import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const OUT = path.join(ROOT, '.geo-opt', 'out');
const DATA_FILES = [
  path.join(ROOT, 'data', 'blog-posts.json'),
  path.join(ROOT, 'src', 'data', 'blog-seed.json'),
];
const TARGETS = JSON.parse(fs.readFileSync(path.join(ROOT, '.geo-opt', 'targets.json'), 'utf8'));
const BEFORE = JSON.parse(fs.readFileSync(path.join(ROOT, '.geo-opt', 'before.json'), 'utf8'));
const DRY = process.argv.includes('--dry');
const TODAY = '2026-06-13';

function score(c, faq) {
  const faqN = faq && faq.items ? faq.items.length : 0;
  const tldr = /בקצרה|TL;DR/i.test(c);
  const tbl = (c.match(/\n\s*\|/g) || []).length;
  const ext = (c.match(/\]\(https?:\/\//g) || []).length;
  let s = 0;
  if (faqN > 0) s += 2;
  if (tldr) s += 2;
  if (tbl > 0) s += 2;
  if (ext > 0) s += 2;
  return { faqN, tldr, tbl, ext, s };
}

// 1. Load + validate every out file. Build a patch map slug -> {content, faq}.
const patches = {};
const failures = [];
for (const slug of TARGETS) {
  const f = path.join(OUT, slug + '.json');
  if (!fs.existsSync(f)) { failures.push([slug, 'missing out file']); continue; }
  let j;
  try { j = JSON.parse(fs.readFileSync(f, 'utf8')); }
  catch (e) { failures.push([slug, 'invalid JSON: ' + e.message]); continue; }
  if (!j || typeof j.content !== 'string' || j.content.trim().length < 200) {
    failures.push([slug, 'empty/short content']); continue;
  }
  // faq: prefer optimized; if malformed, will fall back to original at patch time.
  let faq = null;
  if (j.faq && Array.isArray(j.faq.items) && j.faq.items.length > 0 &&
      j.faq.items.every((it) => it && typeof it.q === 'string' && typeof it.a === 'string')) {
    faq = { title: typeof j.faq.title === 'string' && j.faq.title.trim() ? j.faq.title : 'שאלות נפוצות', items: j.faq.items };
  }
  patches[slug] = { content: j.content, faq };
}

// 2. Apply to both data files identically.
const report = {};
for (const file of DATA_FILES) {
  const arr = JSON.parse(fs.readFileSync(file, 'utf8'));
  const len0 = arr.length;
  let patched = 0;
  for (const post of arr) {
    const p = patches[post.slug];
    if (!p) continue;
    post.content = p.content;
    if (p.faq) post.faq = p.faq; // else keep original faq
    post.rev = (typeof post.rev === 'number' ? post.rev : 0) + 1;
    post.dateModified = TODAY;
    patched++;
    if (file.endsWith('blog-posts.json')) {
      const sc = score(post.content, post.faq);
      report[post.slug] = {
        before: BEFORE[post.slug] ? BEFORE[post.slug].geo : null,
        after: sc.s,
        faqN: sc.faqN, tldr: sc.tldr, tableRows: sc.tbl, extLinks: sc.ext,
        rev: post.rev,
        words: post.content.replace(/<[^>]+>/g, '').split(/\s+/).filter(Boolean).length,
      };
    }
  }
  if (arr.length !== len0) throw new Error('post count changed for ' + file + ' (' + len0 + ' -> ' + arr.length + ')');
  if (!DRY) fs.writeFileSync(file, JSON.stringify(arr, null, 2) + '\n', 'utf8');
  console.log((DRY ? '[DRY] ' : '') + path.basename(file) + ': patched ' + patched + '/' + len0 + ' posts');
}

fs.writeFileSync(path.join(ROOT, '.geo-opt', 'report.json'), JSON.stringify({ report, failures }, null, 2), 'utf8');

// 3. Console summary.
const slugs = Object.keys(report).sort((a, b) => report[a].after - report[b].after);
console.log('\nslug'.padEnd(38), 'before'.padStart(7), 'after'.padStart(6), 'faq'.padStart(4), 'tl'.padStart(3), 'tbl'.padStart(4), 'ext'.padStart(4));
for (const s of slugs) {
  const r = report[s];
  console.log(s.padEnd(38), String(r.before).padStart(7), String(r.after).padStart(6), String(r.faqN).padStart(4),
    (r.tldr ? 'Y' : '-').padStart(3), String(r.tableRows).padStart(4), String(r.extLinks).padStart(4));
}
const at8 = slugs.filter((s) => report[s].after === 8).length;
console.log('\nposts now at 8/8:', at8 + '/' + slugs.length);
if (failures.length) {
  console.log('\nFAILURES (left untouched):');
  failures.forEach(([s, why]) => console.log('  - ' + s + ': ' + why));
} else {
  console.log('\nno failures — all target out files valid');
}
