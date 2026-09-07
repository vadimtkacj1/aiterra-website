# Aiterra SEO strategy — the five things that matter

Research and planning only. Nothing in `src/` was changed. Written 2026-09-07 against real
Google Search Console data, 35 fetched Israeli SERPs, and Google's own URL Inspection API.

---

## The one-paragraph version

Aiterra earns **~32 clicks per 89 days, essentially all branded, at average position ~48** — while impressions grew **4.3× between June and August**. Google is increasingly showing this site and nobody clicks. The cause is not thin content or weak authority: **51 of 51 links from the blog to the service pages point at slugs retired five days ago and now 308**, all five live service pages have **zero** inbound links from any of the 40 posts, and Google's URL Inspection API reports the main "בניית אתרים" page as **"URL is unknown to Google"** — in the sitemap, never crawled, zero referring URLs. The content that exists cannot reach the pages that sell. Fix that first; everything else is downstream.

---

## 1. Commit the working tree. Today. Before anything else.

The entire English site and the `(he)`/`(en)` refactor are **untracked** — `git ls-tree HEAD` contains **zero** files under either path, and 129 under the old `app/v2/`. There is one copy, in one working directory. `git clean -fd` destroys it.

Two traps inside that:
- **Exclude `public/videos/` first.** Two untracked files totalling **42.9 MB**, both 404 in production. A blind `git add -A` puts 43 MB into git history permanently.
- **A partial commit turns `/services/seo` into a hard 404.** `next.config.ts` is **tracked** and already has the `seo` and `web-development` redirects deleted. The pages that replace them live in `content.ts`, which is **untracked**. Commit or deploy the tracked half without the untracked half and a URL carrying **502 impressions** goes from a working 308 to a 404. Same class of failure as the `sitemap.ts` → `content-en.ts` import above: **commit atomically or not at all.**

  > *Correction (verified on a local dev server after this plan was first written).* An earlier draft of this document claimed `/services/seo` would 404 because `servicePages` had no `seo` key. **That is wrong** — `content.ts:1663` defines it, with a one-space indent that defeated my parser. Both restored pages are already written and live locally: `/services/seo` **738 words**, `/services/web-development` **703 words**, both returning 200 with correct canonicals and a working hreflang pair. The risk is the partial commit, not a missing page.

→ [07-roadmap.md](07-roadmap.md) Sprint 0

## 2. Repair the link graph — the highest-leverage work in the plan

```
51 of 51 blog→service links point at retired slugs and 308
  web-development 21 · seo 11 · adv 10 · automation 9
All 5 live service pages: ZERO inbound links from any of 40 posts
/projects renders 0 of 12 project links · /blog renders 9 of 40
```

Google's URL Inspection API, queried live: `/services/brochure` — **unknown to Google, never crawled, zero referrers**. `/projects/olie-6` — *Discovered, currently not indexed*, zero referrers. The service pages that *are* indexed have exactly **one** internal referrer each.

A sitemap gets a URL discovered. Internal links get it crawled and ranked.

→ [03-existing-content-actions.md](03-existing-content-actions.md)

## 3. Build the maintenance service — the demand is measured and unclaimed

`תחזוקת אתר` and its variants: **~1,430 impressions at positions 18–30** — the best commercial positions the domain holds anywhere. Zero occurrences of תחזוקה/אחזקה across every service page. `/services/maintenance` **404s**. All of it lands on one 692-word blog post whose CTA 308-redirects into a page that never says the word.

**This contradicts the engagement brief**, which said to weight toward automation. Head-to-head, both at zero clicks: maintenance **1,430 impressions / best position 18.4**; automation **187 / 12.7** after stripping the wrong audience — 63% of its impressions are industrial-automation and DIY-definition intent a web agency cannot serve.

Honest counter-caveat: Trends returns **0 for `תחזוקת אתרים` in 155 of 157 weekly buckets**. This pool is small in absolute terms. The case is *best positions + money intent + highest-LTV lead shape (a recurring contract) + page unclaimed* — not "big market."

→ [04-page-map.md](04-page-map.md) §1

## 4. Claim the free listings and create a Google Business Profile

**No GBP exists.** `d.co.il` and `b144.co.il` are both **free** (verified), their Bat Yam categories hold **14 and 11 businesses**, both rank slot 1–2, and Aiterra is in neither. `d.co.il` allows four sibling categories for the same effort as one.

`ביקורות על aiterra agency` — **18 impressions at position 2.4, zero clicks.** People search for reviews of Aiterra, Google ranks the site second, and there is nothing to find: `sameAs` is `[]` and the footer's social icons link to `facebook.com/` and `instagram.com/`, the platform homepages.

Zero engineering. Highest ROI per hour in the plan.

→ [06-technical.md](06-technical.md) §5

## 5. Fix accessibility, because the site sells accessibility

**92.4% of images ship `alt=""` — 2,019 of 2,186**, including the hero of all 40 blog posts — while the published `/accessibility-statement` explicitly claims alt text is provided. Descriptive Hebrew alt text **already exists, unused**, in `data/blog-posts.json`; the blog template strips it and re-renders with `alt=""`.

The statement also names no accessibility coordinator and renders its contact email as `[email protected]`. Aiterra's own ת"י 5568 blog post lists a seven-point checklist its own site fails on four points.

This is a legal exposure and a destroyed proof point in the same defect.

→ [06-technical.md](06-technical.md) §6

---

## Files

| File | Contents |
|---|---|
| [00-audit.md](00-audit.md) | Phase 1 audit, both locales, problems ranked by cost |
| [01-competitors.md](01-competitors.md) | SERP landscape per pillar, winnability verdicts, content gaps |
| [02-keywords-he.csv](02-keywords-he.csv) | 262 scored Hebrew keywords + **149 explicit exclusions** |
| [02-keywords-en.csv](02-keywords-en.csv) | English, thin-shell scope |
| [03-existing-content-actions.md](03-existing-content-actions.md) | Decisions for all 40 posts + the full internal-link plan |
| [04-page-map.md](04-page-map.md) | 17 Hebrew URLs + the 11-URL English shell, with full briefs |
| [05-bilingual-architecture.md](05-bilingual-architecture.md) | Routing, hreflang, `x-default`, sitemap |
| [06-technical.md](06-technical.md) | Technical, GBP, accessibility, `/en` launch checklist, Planner pull list |
| [07-roadmap.md](07-roadmap.md) | 90-day sprints, KPIs, **"what we will not do"** |

---

## Reading the numbers

**No absolute search volumes exist for this project.** Google Ads Keyword Planner was not available, and Hebrew volume data in third-party tools is thin and frequently wrong. Every figure in these documents carries its source inline:

- `GSC: N impr/89d @ pos P` — real, first-party
- `Trends: relative index N` — **relative only, never a volume**
- `SERP: <observed>` — seen on a SERP that was actually fetched
- `[unverified — needs Keyword Planner]` — used freely and without apology

**There are no traffic forecasts in this plan, and there must be none in anything derived from it.** [06-technical.md](06-technical.md) §9 lists the ~21 terms worth pulling and what decision each one would change.

Priorities rest on GSC impressions, which are real.

## Things the brief believed that turned out to be false

| Believed | Actually |
|---|---|
| 7 live Hebrew service pages | **5.** `web-development` and `seo` 308 away |
| `x-default` points to `/en` everywhere | **Not in production** — latent in uncommitted code |
| hreflang may be one-way or broken | **All 8 pairs reciprocal, 0 broken** |
| Thin (<400 word) posts exist | **None.** Floor is 509 words |
| Cost and automation clusters cannibalise | **They don't** — they don't rank enough to collide |
| Automation is the real opening | **Maintenance beats it 7.6×** on demand at better positions |
| 14 posts have zero impressions | **Zero posts do.** That figure was an artefact of GSC's truncated query×page dimension |
| Core Web Vitals need work | **No CrUX data exists** at page or origin level — CWV is not a ranking factor here |
| Internal linking is the biggest win | Right, but not for the stated reason — only 1 of 40 posts lacks a service link; **100% of the links are broken** |

Two more, found late and worth flagging: `מיתוג` in Israeli Hebrew mostly means **party and event decor**, not corporate identity — so branding is a different market, not a small one. And `בקוד` in Hebrew SEO usage means **WordPress**, so targeting "בניית אתר בקוד" buys WordPress shoppers.

## Method

10 parallel auditors over code, live HTML and GSC; 7 SERP researchers against the real Israeli SERP; every finding put through an adversarial verifier, and every document through an adversarial reviewer that edited it in place.

Two disclosures. **The audit's verifier was mis-calibrated** — instructed to default to refuting, it collapsed 73 findings to "0 P0, 0 P1" while confirming the underlying facts; the rankings in `00-audit.md` are re-derived from the evidence each verifier actually confirmed. **Firecrawl was out of credits (402) all session**, so SERP research fell back through nine sources; Brave (`country=il`), WebSearch/WebFetch and Google's autocomplete endpoint worked. People-Also-Ask could not be captured — Google's SERP is JS-gated — and the substitute was 48-probe alphabet expansion of autocomplete, which draws on the same query log.

Every headline number was re-derived by hand rather than taken from an agent.
