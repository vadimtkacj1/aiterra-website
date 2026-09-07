# 00 — Audit (Phase 1)

**Run:** 2026-09-07 · **Property:** `sc-domain:aiterra.co.il` · **Repo:** `3674f7c` (main) + a large uncommitted working tree
**Method:** 10 read-only auditors over code, live HTML and GSC; every P0/P1 claim put through an adversarial verifier; headline numbers re-derived by hand.

---

## 0. Read this first — three states, and they are not the same

Almost every wrong conclusion available here comes from conflating these. Every claim below is labelled.

| State | What it is | How it was read |
|---|---|---|
| **PROD** | what `https://www.aiterra.co.il` serves right now | `curl`, GSC API |
| **HEAD** | commit `3674f7c` | `git show HEAD:…` |
| **PENDING** | the uncommitted working tree | file reads + the dev server on `:3000` |

**The entire i18n refactor is unversioned.** `git status --porcelain` returns `?? src/app/(en)/` and `?? src/app/(he)/`; `git ls-tree -r HEAD` contains **zero** files under either path and **129** under `src/app/v2/`. `src/lib/content-en.ts` and `content-en-services.ts` are untracked too.

> The English site and the whole route-group migration exist only in this working directory, untracked. A `git clean -fd` deletes all of it. **This is the single largest operational risk in the audit and it is not an SEO problem.** Commit it to a branch before anything else in this plan happens.

`git status --porcelain -uall` shows **180 untracked files**, `git stash list` is empty, and there is no second copy. Worse, `src/app/sitemap.ts` — a *tracked* file — was modified to `import { EN_SERVICE_SLUGS } from '@/lib/content-en'`, and `content-en.ts` is untracked. **Committing the tracked changes alone produces a `main` that cannot build.** Commit atomically or not at all.

### 0.1 — A partial commit turns `/services/seo` into a hard 404

> **This section is a correction.** An earlier draft claimed the working tree would 404 `/services/seo` because `servicePages` had no `seo` key. **That was wrong** — see the correction box below. The risk below is the real, narrower one.

The tracked and untracked halves of this change are **out of step**:

| File | Git state | Contains |
|---|---|---|
| `next.config.ts` | **tracked, modified** | the `seo` and `web-development` redirects **already deleted** |
| `src/app/(he)/v2/content.ts` | **untracked** | the `seo` and `web-development` pages that replace them |

Commit or deploy the tracked half without the untracked half and `/services/seo` loses its redirect *and* finds no page — `(he)/v2/services/[slug]/page.tsx:52` calls `notFound()`. **A URL carrying 502 impressions goes from a working 308 to a 404.**

This is the same failure mode as `sitemap.ts` importing untracked `content-en.ts`, and it has the same fix: **commit atomically.** Also add `export const dynamicParams = false` to the HE service route so an unknown slug fails at build time rather than silently 404ing in production.

> **Correction, verified 2026-09-07 on a local dev server.**
> `servicePages` contains **7** keys, not 6 — `content.ts:1663` defines `seo`, written with a **one-space indent** (` seo: {`) that defeated the two-space regex used in the original audit. `web-development` is there too.
>
> Both restored pages are **already written**, and both return 200 locally with correct canonicals and a working `he-IL`/`en`/`x-default` hreflang pair:
> ```
> /services/seo               200   738 words   קידום אתרים בגוגל (SEO) - קידום אורגני לעסקים
> /services/web-development   200   703 words   בניית אתרים לעסקים - פיתוח אתרים בקוד מלא
> ```
> HEAD has 5 service keys and both redirects; the working tree has 7 keys and neither. **Both states are internally consistent** — the owner already did what was decided at the checkpoint. Only the *split* between them is dangerous.
>
> This error propagated: it was written into the shared context brief, so downstream agents inherited it as a verified fact and one "independently confirmed" it. `03-existing-content-actions.md` caught it first. Two consequences also corrected: `/services/seo` is **not** written from scratch (see [04-page-map.md](04-page-map.md) §2.3), and `/en/services/seo` is **not** orphaned from the language cluster (see [05-bilingual-architecture.md](05-bilingual-architecture.md) §1.2).

---

## 1. The headline

**32 clicks in 89 days. 5,967 impressions. CTR 0.54%. Average position ~48.**

Derived from the GSC **date** dimension, which is unfiltered. (The query dimension returns 23 / 5,250 because GSC truncates rare queries — a strategy built on the query total understates reality by ~9 clicks and ~700 impressions.)

Of the 23 attributable clicks, **all are branded**: `aiterra` 21 @ pos 3.0, `aiterra agency` 1, `olie 6` 1 (a client's brand). The ~9 anonymised clicks include at least 3 onto blog articles. **Non-branded commercial clicks are approximately zero, but not provably zero.**

### The trend is the important part

| Period | Clicks | Impressions | Impr/day |
|---|---|---|---|
| Jun 9–30 | 4 | 646 | 29 |
| Jul | 13 | 858 | 28 |
| Aug 1–Sep 5 | 15 | 4,463 | **124** |

Impressions grew **4.3×**; clicks did not move. This is not a site Google is ignoring — it is a site Google is increasingly showing, at **position 44–54, where the click-through rate is a rounding error.** The June 2026 SEO work is being noticed. Nothing converts it.

### Demand is 99% Israeli

`isr` DESKTOP 4,446 impr / 19 clicks / pos 52.0 · `isr` MOBILE 1,293 / 13 / pos 40.4. Everything else is single digits (gbr 12, deu 9). **Israel ≈ 5,739 of ~5,800 impressions.** This settles the `x-default` question empirically and independently confirms the thin-shell English decision.

---

## 2. The five problems, ranked by what they cost

### P0-1 · The service-slug migration severed every link between the blog and the commercial layer

Commit `ff0f498` (2026-09-02, five days before this audit) retired four service slugs. Every blog post still links to the old ones.

```
service links in the 40 post bodies:  51
  /services/web-development   21   -> 308
  /services/seo               11   -> 308
  /services/adv               10   -> 308
  /services/automation         9   -> 308
  redirected: 51/51 = 100%

inbound links from posts to each LIVE service page:
  /services/brochure     0      /services/marketing    0
  /services/development  0      /services/branding     0
  /services/ecommerce    0
```

**All five live service pages have zero inbound internal links from any of the 40 blog posts.**

Consequences, all measured:
- `/services/brochure` — the **בניית אתרים** page, the single most commercially important URL on the site — is unknown to Google. Zero internal links point at it. The sitewide footer's "Websites" link is a dead anchor.
- The five live service pages earned **8 impressions between them** in 89 days.
- **1,220–1,617 impressions** (21–31% of the site's total) sit on URLs that now 308 into pages Google has barely or never crawled.
- `/services/seo` (502 impr, pos 88.4) 308s into `/services/marketing`, a page whose 521 words are about paid campaigns and contain no organic-search content.
- `/services/development` inherited 456 automation impressions and says **אוטומציה twice in 741 words**.

Redirects preserve *some* equity, but they do not make a page relevant to a query, and Google will not rank `/services/marketing` for `קידום אתרים` because a redirect points at it.

**This is a self-inflicted wound, five days old, and it is the highest-leverage thing on this list.**

#### Google's own URL Inspection API confirms the mechanism

Queried live against `sc-domain:aiterra.co.il` on 2026-09-07:

| URL | Coverage state | Last crawled | Referring URLs Google knows |
|---|---|---|---|
| `/services/brochure` | **URL is unknown to Google** | never | **none** |
| `/services/marketing` | Submitted and indexed | 2026-09-06 | `/blog` only |
| `/services/ecommerce` | Submitted and indexed | 2026-09-05 | `/projects?filter=systems` only |
| `/projects` | Submitted and indexed | 2026-09-05 | 4 |
| `/projects/olie-6` | **Discovered – currently not indexed** | never | **none** |

This is the whole thesis in one table. `/services/brochure` is in the sitemap and Google has still never fetched it, because **nothing links to it**. `/projects/olie-6` is in the sitemap, has been *discovered*, and has sat uncrawled — same cause. The service pages that *are* indexed each have exactly **one** internal referrer.

A sitemap gets a URL discovered. Internal links get it crawled and ranked. That gap is precisely the damage.

*Correction to P0-2 below:* `/projects` **is** indexed and healthy. The orphans are its 12 children.

### P0-2 · The two content hubs are crawl dead-ends

Verified against served HTML on 2026-09-07:

```
/projects  -> 0 unique href="/projects/<slug>"   (of 12 case studies)
/blog      -> 9 unique href="/blog/<slug>"       (of 40 posts)
```

`/projects` renders an empty grid because `ProjectsGrid` is a `useSearchParams` client component inside `<Suspense fallback={null}>` — crawlers get the fallback. `/blog` slices to `FIRST_PAGE = 9`, so **31 of 40 posts have no link from their own hub**.

The two index pages themselves are indexed and healthy. Their **children** are the casualties: the site's hubs expose 9 of 52 child pages, and `/projects/olie-6` is confirmed by Google as *Discovered – currently not indexed* with **zero referring URLs**.

Also: two sitemaps are registered in GSC — `https://aiterra.co.il/sitemap.xml` (the **redirecting apex host**, 70 URLs, fetched 2026-09-03) and `https://www.aiterra.co.il/sitemap.xml` (correct host, 57 URLs, stale since 2026-08-27).

### P0-3 · Nothing on the site sells the largest verified demand cluster

`תחזוקת אתר` and variants: **~1,400 impressions at position 18–30** — the best positions the site holds on any commercial term.

```
תחזוקה / תחזוקת / אחזקה / אחזקת / ריטיינר / maintenance
  = 0 occurrences across all servicePages content
curl /services/maintenance -> 404
```

All of it lands on one blog post (`website-maintenance-cost-yearly`: 1,537 impr, pos 37.5, 1 click) whose only service link points at `/services/web-development` → 308 → `/services/brochure`, a page that never says the word.

**The site's highest-traffic page routes its money CTA through a redirect into a page about something else.** Owner has approved building this as a real service.

### P0-4 · The E-E-A-T layer is built and entirely unreachable

Four author pages exist with photos, job titles and 43–52 word bios. **No blog post renders an author byline or links to an author page.** `/about` names no humans at all — the team section was removed (`3674f7c`, "hide the team section on the about page for now"). The four author URLs are sitemap-only orphans with zero inbound links.

Also: `Organization.sameAs` ships as `[]` while every page's footer links social icons to `facebook.com/` and `instagram.com/` — the platform homepages. A "GOOGLE REVIEWS" block quotes six unanimous 5-star testimonials with no link to any Google profile. Sean's author page serves a **404 headshot** in both the rendered HTML and the `Person` schema.

*Not a defect:* the `@id`-only Article author reference resolves correctly in Google's own parser (checked against validator.schema.org). Do not "fix" it.

### P0-5 · Accessibility failures on a site that sells accessibility compliance

**92.4% of images sitewide ship `alt=""` — 2,019 of 2,186 instances**, including the hero of all 40 blog posts. Descriptive Hebrew alt text **already exists, unused**, in `data/blog-posts.json`; `src/app/(he)/v2/blog/[slug]/page.tsx:63` strips the cover node from the markdown and re-renders it at `:174` with `alt=""`.

The published `/accessibility-statement` **explicitly claims alt text is provided.** Aiterra sells ת"י 5568 compliance and publishes a blog post listing a 7-point 5568 checklist that its own site fails on four points.

Also verified: `aria-hidden="true"` wraps **39 of 137 keyboard tab stops** on the homepage (24 without `inert`); the sitewide focus ring computes to **2.84:1** against the dominant background (needs 3:1); the statement names no accessibility coordinator and renders its contact email as `[email protected]` via Cloudflare obfuscation.

This is legal exposure and a destroyed proof point in the same defect.

---

## 3. Everything else, by dimension

### Indexation, sitemap, robots
- **No stray `noindex` anywhere.** The classic launch bug is absent — verified across `(he)/layout.tsx:30-40`, `(en)/layout.tsx:31-41`, `metadata.ts:25/51/74`, all 188 lines of `site-seo-server.ts`, all of `data/site-seo.json`, and live `robots.txt`. Zero `noIndex` call sites.
- Canonicals are absolute, self-referencing and www-host on all 70 live URLs. Correct.
- **Live sitemap: 70 URLs, 0 `/en`, 0 `xhtml:link`.** PENDING emits 80 incl. `/en/*`, still with no hreflang annotations.
- `lastmod` is one flat date on 67 of 70 URLs, three months stale.
- Two sitemaps registered in GSC; the current one was submitted on the redirecting apex host.
- **A second, unrelated Next.js app is publicly live at `/landing`** (HTTP 200, title `דפי נחיתה שהופכים קליקים ממומנים לשיחות | Aiterra`). It swallows `/landings/*` and canonicalises to the homepage.
- **19 `/v2/blog/*` duplicate URLs are still being served in Google results**, and for 2 posts the redirecting URL is the *only* one ranking.
- 79 internal links point at 308s, 28 of them from author pages still running pre-v2 chrome.

### Rendering & metadata
- Rendering is otherwise healthy: articles, service pages, FAQ answers and JSON-LD are fully server-rendered. Zero duplicate or missing titles/descriptions across 70 URLs.
- **One live source of truth** (`src/lib/metadata.ts` `pageMetadata`) — plus a **second, entirely dead system** (`site-seo-config.ts` + `site-seo-server.ts`) still wired to the `/admin/seo` editor, which writes `data/site-seo.json` that **nothing reads**. Its stored titles bear no relation to what ships.
- **44 of 70 live pages exceed 60 characters in `<title>`.** The split is exact: every blog post and author page violates, every commercial page complies — blog posts have no `metaTitle` field separate from the H1.
- Every blog article is served **fully dynamic with `Cache-Control: no-store`** — the ISR config silently never applies.
- Author page meta descriptions run **260–294 characters** (`author/[id]/page.tsx:40-59` hand-rolls metadata and sets `description: author.bio` with no truncation).

### hreflang — the opposite of what the brief suspected
All **8 HE/EN pairs are reciprocal. Zero one-way, zero broken.** Unpaired pages emit no `languages` object at all rather than a broken pair — which is correct behaviour.

Two real defects: `x-default` points at the English path (`metadata.ts:64`), and pairing is guarded by two different predicates rather than one shared map, so it will drift. **Neither is live** — PROD currently emits `he-IL` + `x-default` both pointing at Hebrew, because `/en` isn't deployed and the change is uncommitted. Latent, not active.

### Content inventory
- **No post is under 400 words** (floor 509, `business-automation-cost-roi`). The corpus is not thin by word count — it is thin by **uniformity**: 37 of 40 posts sit between 509 and 798 words, each with 4–5 FAQ items, 2 images, 5–9 H2s and **zero H3s**. It reads as one template run 40 times.
- **The two clusters the brief flagged do not cannibalise** — zero queries in the cost cluster and zero in the automation cluster are served by two different posts, because those posts barely rank. One genuine collision: `business-site-vs-online-store` vs `ecommerce-store-that-sells` on **חנות אינטרנטית** (194 impressions).
- 11 posts (27.5%) drew ≤5 impressions in 89 days.
- All 40 posts share a single `dateModified` of 2026-06-13.
- `data/blog-posts.json` and `src/data/blog-seed.json` are **byte-identical** (MD5 `53fb4347…`) — in sync.
- The `.geo-opt/` AI content-generation pipeline is committed to the repo.

### Performance — de-escalated on evidence
**There is no CrUX field data at page *or* origin level.** All six URL×device combinations return an empty `loadingExperience`; `originLoadingExperience` is absent entirely. The origin is below the CrUX reporting threshold.

> **Core Web Vitals are not currently a ranking factor for this site, and no CWV work will move rankings directly.** This contradicts the usual playbook and should change the roadmap: performance is a P2 here, not a P0.

Lab numbers are fine where it matters — TTFB 10–40 ms, CLS 0–0.004. The one real defect is byte weight: production serves a **4.27 MB decorative video on every page** (84% of the 5.10 MB blog post carrying 1,537 impressions), and a **318 KB re-encode of that exact file is already sitting uncommitted in the working tree**. LCP is a text heading whose delay is 99.5% render-delay, so the existing hero-poster preload buys nothing. 165 images, 3 lazy, 0 responsive; `next/image` is used by zero components.

### RTL — genuinely strong, do not spend here
The v2 CSS modules use logical properties **~280 times against ~10 physical rules**, and every physical rule found is a deliberate, correct LTR island (code blocks, phone/email fields). Heading structure is clean — one H1 and zero level skips on 69/69 pages. The skip link works everywhere. Every contact-form control has a real label.

### Anchor text — already good, do not spend here
**0 of 51** service anchors are filler (`כאן` / `לחץ כאן` / bare URLs). The anchors are descriptive Hebrew. The problem is exclusively their *destination*, not their text.

---

## 4. Claims in the brief that this audit disproves

### Corrections applied to this document after review

Three errors found by the review pass, two of them mine:

1. **"14 of 40 posts have zero impressions in 12 months" — false, and it was the premise for pruning.** That count comes from the query×page dimension, which GSC truncates by anonymising rare queries. On the **page** dimension only **2** posts show zero on their canonical URL (`cheap-website-hidden-costs`, `website-accessibility-israel`) — and **both earn impressions on their `/v2` twin.** So **zero of 40 posts have zero impressions.** There is no evidence base for pruning; see [03-existing-content-actions.md](03-existing-content-actions.md).
2. **The maintenance cluster's "best position 3.5" was contaminated.** That row is an AI research agent's literal instruction (`make web search for the following query: …`). Best human-query position is **18.4** on `תחזוקת אתר`.
3. **The legacy `/portfolio/*` tree is the same defect as `/v2/*` but worse, and no document connected them.** Legacy `/portfolio` URLs still carry real clicks — `/portfolio/alexandra-patsina` took **3 clicks at position 6.8** while its clean twin `/projects/alexandra-patsina` drew 1 impression at position 27. `/landings/ecomerce` now **404s** while GSC credits it with **1 click and 17 impressions, some rows at position 2.0–2.2.**

Two GSC aggregations disagree and both are real: the **date** dimension gives 32 clicks / 5,967 impressions; the **page** dimension gives 34 / 6,583 over the identical window. The page dimension is used downstream because it is the only one that attributes to URLs.

| Brief said | Actually |
|---|---|
| 7 live Hebrew service pages | **5.** `/services/web-development` and `/services/seo` 308 away in PROD |
| `x-default` points to `/en` on every page | **Not in PROD.** Live pages emit `he-IL` + `x-default` both → Hebrew. Latent in PENDING |
| hreflang may be one-way / mismatched | **All 8 pairs reciprocal, 0 broken** |
| 4 Hebrew-only service pages have "no hreflang" — confirm deliberate | Confirmed correct by code path |
| Internal linking is the biggest untapped win | Directionally right, but the mechanism is **not** "posts don't link to services" (only 1 of 40 doesn't) — it is that **100% of the links are broken** |
| Verify production sitemap will include `/en` | It won't — PENDING sitemap emits `/en` but with **no hreflang annotations** |
| Thin (<400 word) posts | **None exist.** Floor is 509 words |
| Cost/pricing and automation clusters are cannibalising | **They are not** — they don't rank enough to collide |
| *(my own earlier hypothesis)* leaked AI prompt text in published copy | **Refuted.** Zero matches repo-wide. Those GSC rows are a competitor's rank-tracker spreadsheet (`keyword,url,,rank`) pasted into Google. ~130 impressions are bot noise, not demand |

---

## 5. Method note — and one correction to my own instrument

The adversarial verifier was told to "default to `refuted=true` if you cannot independently confirm." That produced a **73 findings → 0 P0, 0 P1, 26 P2** collapse: verifiers repeatedly confirmed the underlying facts and then downgraded on framing, severity or strategic relevance.

**That output is an artefact of a mis-calibrated instrument, not a finding that the site is healthy.** The rankings in §2 are my own, re-derived from the evidence each verifier actually confirmed, with their corrections applied. Where a verifier genuinely refuted a claim (the AI-prompt leak, the "one-way hreflang" theory, alt-text counts inflated ~10×, `@id` author refs), the refutation is reflected above.

Every headline number in §1 and §2 was re-derived by hand rather than taken from an agent:
`51/51` redirected service links, `0`/`9` crawlable hub links, `32 clicks / 5,967 impressions`,
`0 occurrences` of maintenance terminology, the untracked-tree state, and the `/landing` app.

**Known gap:** the English-tree audit is being re-run — its first agent returned a placeholder. Findings land in [05-bilingual-architecture.md](05-bilingual-architecture.md).
