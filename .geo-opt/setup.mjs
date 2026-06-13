import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const SRC = path.join(ROOT, 'data', 'blog-posts.json');
const IN = path.join(ROOT, '.geo-opt', 'in');
const OUT = path.join(ROOT, '.geo-opt', 'out');
fs.mkdirSync(IN, { recursive: true });
fs.mkdirSync(OUT, { recursive: true });

const EXEMPLARS = new Set(['geo-ai-search-optimization', 'wordpress-vs-custom-code']);

const posts = JSON.parse(fs.readFileSync(SRC, 'utf8'));

function score(x) {
  const c = x.content || '';
  const faqN = x.faq && x.faq.items ? x.faq.items.length : 0;
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

const before = {};
const targets = [];
for (const p of posts) {
  const sc = score(p);
  before[p.slug] = {
    geo: sc.s, faqN: sc.faqN, tldr: sc.tldr, tableRows: sc.tbl, extLinks: sc.ext,
    words: (p.content || '').replace(/<[^>]+>/g, '').split(/\s+/).filter(Boolean).length,
  };
  if (EXEMPLARS.has(p.slug)) continue;
  // gaps the agent should focus on
  const gaps = [];
  if (!sc.tldr) gaps.push('NO TL;DR block');
  if (sc.tbl === 0) gaps.push('NO comparison table / structured numeric block');
  if (sc.ext === 0) gaps.push('NO external sourced statistic with a link');
  if (sc.faqN === 0) gaps.push('NO FAQ block at all (emits zero FAQPage schema) — must CREATE one');
  else if (sc.faqN < 3) gaps.push('FAQ has fewer than 3 items');
  fs.writeFileSync(
    path.join(IN, p.slug + '.json'),
    JSON.stringify({
      slug: p.slug,
      title: p.title,
      excerpt: p.excerpt,
      tags: p.tags,
      author: p.author,
      currentGeoScore: sc.s,
      gaps,
      content: p.content,
      faq: p.faq || null,
    }, null, 2),
    'utf8'
  );
  targets.push(p.slug);
}

fs.writeFileSync(path.join(ROOT, '.geo-opt', 'before.json'), JSON.stringify(before, null, 2), 'utf8');
fs.writeFileSync(path.join(ROOT, '.geo-opt', 'targets.json'), JSON.stringify(targets, null, 2), 'utf8');
console.log('targets written:', targets.length);
console.log('input dir:', IN);
console.log(targets.join(' '));
