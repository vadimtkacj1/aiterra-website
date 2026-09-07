# 07 — Roadmap, KPIs and what we will not do

Read [00-audit.md](00-audit.md) first. This document sequences the work in
[03-existing-content-actions.md](03-existing-content-actions.md),
[04-page-map.md](04-page-map.md), [05-bilingual-architecture.md](05-bilingual-architecture.md)
and [06-technical.md](06-technical.md). It does not re-argue them.

---

## 0. The sequencing argument, in one paragraph

The site earns **~32 clicks per 89 days, essentially all branded, at average position ~48**, while impressions grew **4.3× between June and August**. Google is increasingly showing this site and nobody clicks, because everything lands on page 4–5. Meanwhile **51 of 51 blog→service links point at retired slugs**, all five live service pages have **zero** inbound links from any post, `/services/brochure` is **unknown to Google**, and `/blog` exposes 9 of 40 posts. **So the constraint is not content volume — it is that the content which exists cannot reach the pages that sell.** Everything in the first four weeks is plumbing and free listings. New content starts in week 5, and it starts with the one cluster where the domain already ranks 18–30 on money intent.

**Do not reorder this.** A better maintenance page shipped into the current link graph will rank slightly higher and convert nothing.

---

## Sprint 0 · Days 1–3 — stop the bleeding

Not a sprint so much as a safety catch. None of this is SEO; all of it is a precondition.

| # | Action | Why now | Owner |
|---|---|---|---|
| 0.1 | **Commit the whole working tree to a branch and push.** ~193 untracked + 164 deleted + 13 modified, atomically. | The entire English site and the `(he)`/`(en)` refactor exist **only in one working directory, untracked**. `git clean -fd` destroys them. `sitemap.ts` is tracked and imports untracked `content-en.ts`, so a partial commit yields an unbuildable `main`. | Dev |
| 0.2 | **Before committing, exclude `public/videos/`.** Two untracked files totalling **42.9 MB**, both 404 in production. | A blind `git add -A` puts 43 MB into git history **permanently**. | Dev |
| 0.3 | **Never commit `next.config.ts` without `content.ts`.** The redirects for `seo` and `web-development` are deleted in the **tracked** config; the pages replacing them live in **untracked** `content.ts`. Add `export const dynamicParams = false` to the HE service route. | Splitting them 404s a URL carrying **502 impressions**. *(Corrected: both pages already exist and render — `/services/seo` 738 words, `/services/web-development` 703 words, verified locally. The risk is the partial commit, not a missing page. See `00-audit.md` §0.1.)* | Dev |
| 0.4 | **Do not deploy anything until 0.3 is verified.** | — | Dev |

**Exit gate:** `git log` shows one commit containing `src/app/(en)/`; `curl /services/seo` still resolves; the repo builds.

---

## Sprint 1 · Week 1 — free listings and the entity

Zero engineering. Highest ROI per hour in the entire plan, and it runs in parallel with Sprint 2.

| # | Action | Evidence |
|---|---|---|
| 1.1 | **Create and verify a Google Business Profile.** Ha-Rav Nisanbaum St 37, Bat Yam · 052-678-0739 · info@aiterra.co.il. Categories, service area, services, photos. | **No GBP exists** (owner-confirmed). `ביקורות על aiterra agency` gets **18 impressions at position 2.4 with zero clicks** — people search for reviews of Aiterra and find nothing. Verification wait is on the critical path for everything downstream. |
| 1.2 | **Claim `d.co.il` — all four Bat Yam sibling categories.** | **Free** (verified). Bat Yam website-building category holds **14 businesses** and ranks slot 1–2. Aiterra is in none. Four categories cost the same effort as one. |
| 1.3 | **Claim `b144.co.il`.** | **Free** (verified). Bat Yam category holds **11 businesses**. |
| 1.4 | **Start the review programme.** First requests to the six people already named in the homepage "GOOGLE REVIEWS" block — *if they are real clients*. | Gates AggregateRating, Midrag entry, and closes the 18-impression reviews gap. `digitalsecrets.co.il` advertises 100+ reviews at 5.0 on its rank-5 maintenance page. |
| 1.5 | **GSC hygiene:** remove the apex sitemap, resubmit `https://www.aiterra.co.il/sitemap.xml`. | Two sitemaps registered; the current one is on the **redirecting apex host**. |
| 1.6 | **Populate `Organization.sameAs`** — or delete the footer social icons. | `sameAs: []` while every page links icons to `facebook.com/` and `instagram.com/`, the platform homepages. |

**Blocking question:** are those six testimonial authors real clients? If not, that block must come down — six unanimous unsourced 5-stars is a negative trust signal.

---

## Sprint 2 · Weeks 1–2 — repair the link graph

**This is the single highest-leverage engineering work in the plan.**

| # | Action | Evidence |
|---|---|---|
| 2.1 | **Rewrite all 51 blog→service links** to live targets, per the mapping table in `03`. | 51/51 currently 308. All five live service pages have **zero** inbound links from any post. |
| 2.2 | **Deploy the restored `/services/web-development`** (already in the working tree) and settle the boundary against `/services/brochure`: web-development = **method** page, brochure = **product** page. | Restoring one without differentiating the other re-creates in the service layer exactly the cannibalisation being cleaned out of the blog. |
| 2.3 | **Fix `/projects`** — render all 12 project links server-side. | `useSearchParams` client component inside `<Suspense fallback={null}>` serves crawlers the fallback. `/projects/olie-6` is *Discovered – currently not indexed*, **zero referring URLs**. |
| 2.4 | **Fix `/blog`** — server-render all 40 anchors with a display-only "load more". | 31 of 40 posts have no link from their own hub. 40 anchors is not a pagination problem. |
| 2.5 | **Give every post an author byline linking to the author page.** | All four author pages are orphans; `/about` names no humans. Cheapest E-E-A-T available. |
| 2.6 | **Audit the legacy `/portfolio/*` tree.** | Same defect as `/v2/*` but **worse** — legacy `/portfolio` URLs still carry real clicks (`/portfolio/alexandra-patsina`: **3 clicks at position 6.8**, while its clean twin drew 1 impression at position 27). |
| 2.7 | **Restore or 301 `/landings/ecomerce`.** | It **404s today** while GSC credits it with **1 click and 17 impressions**, some rows at **position 2.0–2.2**. |
| 2.8 | **Ship the 318 KB video re-encode** (already written, uncommitted). | Production serves a **4.27 MB decorative video on every page** — 84% of the 5.10 MB blog post carrying 1,537 impressions. Free; already done. |

**Exit gate:** zero internal links resolve to a 308. `curl /projects | grep -c 'href="/projects/'` returns 12. `/blog` returns 40. Request indexing on `/services/brochure`.

---

## Sprint 3 · Weeks 3–4 — accessibility, because it is a legal exposure

Placed here, ahead of content, for one reason: Aiterra **sells** ת"י 5568 compliance, and the published `/accessibility-statement` asserts things that are provably untrue today. That is a dated legal document, and the exposure is reputational as well as legal.

| # | Action | Evidence |
|---|---|---|
| 3.1 | **Fix the alt-text pipeline.** Descriptive Hebrew alt **already exists, unused**, in `data/blog-posts.json`; `(he)/v2/blog/[slug]/page.tsx:63` strips the cover node, `:174` re-renders it with `alt=""`. | **92.4% of images sitewide ship `alt=""` — 2,019 of 2,186** — including the hero of all 40 posts, while the statement claims alt text is provided. |
| 3.2 | **Name an accessibility coordinator** in the statement and fix the obfuscated contact email. | The statement has the heading `פנייה לרכז נגישות` with **no person behind it** — a per-se regulatory gap. Its email renders as `[email protected]` via Cloudflare. |
| 3.3 | **Fix `aria-hidden` over focusable content** — 39 of 137 homepage tab stops, 24 without `inert`. | 39 serious axe violations on the homepage of a company selling accessibility audits. Visible to any prospect in ten minutes. |
| 3.4 | **Raise the focus ring to ≥3:1** (currently **2.84:1**) and add pause controls to the three autoplaying videos. | Statement claims visible focus. |

**Hard gate:** do **not** expand the two accessibility blog posts until 3.1–3.2 ship. Publishing more accessibility authority on this base is a credibility bomb.

---

## Sprint 4 · Weeks 5–6 — the maintenance pillar

The first new content, and the reason the plan exists.

| # | Action |
|---|---|
| 4.1 | **Build `/services/maintenance`** with a published **monthly ₪ מחירון** and an **SLA table**. The #1 result for the price query *is* a price list on a sales page; `web-site.care` ranks #1 at ₪190/290/490/690 per month. A page without numbers competes at a structural disadvantage. |
| 4.2 | **Revise `/blog/website-maintenance-cost-yearly`** — keep the slug, re-cut prices to ₪/month with ₪/year secondary, name real Israeli hosts and registrars with prices, **repoint the CTA** off the 308. |
| 4.3 | **Link every relevant post into the new service page** with descriptive Hebrew anchors. |

The split, per `04` §1.1: vendor-shaped phrasing (`מחיר`/`מחירון`/`חברת`/`שירותי`) → the **service** page; `כמה עולה`/`עלות` cost-research phrasing → the **post**, where Aiterra already sits at 19.4–28.3.

**Owner decision required before 4.1: will Aiterra publish real maintenance prices?** If not, say so now and the page gets built differently — but it will compete at a disadvantage, and that trade should be made deliberately.

---

## Sprint 5 · Weeks 7–8 — the English shell

Runs only after Sprints 0–2. Full checklist in [06-technical.md](06-technical.md) §1.

| # | Action |
|---|---|
| 5.1 | Apply the per-page title/H1 changes from `04` §7 — every page gets **Israel** in the title. |
| 5.2 | **Swap the noun on `/en/services/web-development`: development → design.** Google canonicalises `website development israel` **into** `website design israel`; the design SERP is 4-of-7 agency-owned, the development SERP is **0-of-8**. |
| 5.3 | Fix the three leaks: `<Footer locale="en">`, locale-aware logo href, English legal pages. |
| 5.4 | Fix or cut `/en/services` (71% recycled FAQ) and `/en/projects` (71 unique words, all links external). |
| 5.5 | `x-default` → Hebrew; add `alternates` to the paired sitemap entries. |
| 5.6 | Build, verify `/en/blog` returns a styled 404, deploy, resubmit sitemap, request indexing. |

**Expectation, set honestly:** the realistic 12-month ceiling for the whole English shell is **a handful of clicks a month** on branded and `seo … israel` queries. Ship it for entity consolidation and sales credibility — English "aiterra" autocomplete currently belongs to a tyre brand and two unrelated GmbH/Ltd companies — **not for traffic.**

---

## Sprint 6 · Weeks 9–12 — the Israeli-integration long tail

The moat: regulatory, local-integration and real-price content that international competitors structurally cannot write.

| # | Action |
|---|---|
| 6.1 | `/blog/website-maintenance-agreement-sla` — what must be in a maintenance contract, in plain Hebrew |
| 6.2 | `/blog/israeli-hosting-registrar-costs` — real named hosts and registrars with prices |
| 6.3 | `/blog/developer-disappeared-site-handover` |
| 6.4 | Add **₪ price tables + `Offer`/`priceSpecification` markup** to the cost posts. `/services/ecommerce` already renders real ₪500/₪800 monthly prices on the page while its `Service` JSON-LD carries **zero `offers`** — that is a concrete edit against data that is already public. |
| 6.5 | Revise `/blog/web-development-bat-yam` **in place** (add LocalBusiness schema, GBP linkage, real local proof). **Do not move it** — it sits at position 15.6, the pillar's only proven commercial position. |
| 6.6 | Retire `/blog/web-development-gush-dan` → 301 to the Bat Yam page. 883 words, four cities in the title, **zero impressions**. |

**Cadence from here: 2–4 posts per month.** The constraint is editorial review, not fear of a volume spike. Forty posts already exist and none of them converted; the corpus does not need to be bigger, it needs to be reachable and better.

---

## KPIs

Ordered by what actually matters. **These are targets, not forecasts** — no absolute search volumes exist for this project, so any number presented as a prediction would be fabricated.

### Tier 1 — business outcomes (the only ones that count)

| Metric | Baseline | 90-day target | 12-month target |
|---|---|---|---|
| Contact-form submissions from organic | *unmeasured — instrument first* | Instrumented + attributed by landing page | Sustained month-on-month |
| Phone calls from GBP | **0 — no profile exists** | Profile live, calls tracked | Primary local lead source |
| Maintenance-retainer enquiries | 0 | **First one** | The highest-LTV recurring line |

**Instrumentation is itself a deliverable.** Lead attribution by landing page must exist before Sprint 4, or none of this is measurable.

### Tier 2 — search visibility, split by locale

| Metric | Baseline (89d) | 90-day target | 12-month target |
|---|---|---|---|
| **Non-branded organic clicks (HE)** | **≈0** | **>0, and attributable to a money query** | The primary growth metric |
| Total clicks | 32 | Growth driven by non-branded | — |
| Average position | ~48 | Top-30 on the maintenance cluster | Top-10 on `עלות`/`כמה עולה`/`אחזקת` |
| `/services/brochure` coverage | **unknown to Google** | **Indexed** | Ranking for `אתר תדמית` |
| Indexed project pages | 0 of 12 | 12 of 12 | — |
| English clicks | n/a (404) | Shell indexed | A handful/month, branded + `seo…israel` |

**The single clearest 90-day signal: the first non-branded click on a maintenance query.** Today that number is zero and the mechanism preventing it is fully understood.

### Tier 3 — rankings

Tracked, reported last, never used to justify a decision on their own.

**Honest ceiling, stated once:** top-10 on the maintenance cost cluster is achievable in 12 months. **Top-3 on `תחזוקת אתר` itself is not**, without reviews and links. And Trends returns **0 for `תחזוקת אתרים` in 155 of 157 weekly buckets** against `בניית אתרים` at 100 — in absolute terms this pool is small. The case for it is *best positions we hold + money intent + highest-LTV lead shape + page unclaimed*, **not** "big market."

---

## What we will not do, and why

Written out deliberately. This section is what stops a future version of this plan from going wrong.

1. **No bought links, no PBNs, no link exchanges.** The domain has 32 clicks; a manual action would end the project outright.
2. **No doorway city pages.** The plan permits 4–6; it proposes **one revised page and one conditional**. Near-duplicate pages differing only by city name are a spam-policy violation that damages the **whole domain**. The site's own data settles it: `/blog/web-development-bat-yam` = 28 impressions at position 15.6; `/blog/web-development-gush-dan`, same template, four cities in the title = **1 impression at position 71**.
3. **No unedited AI content.** The corpus is already template-uniform — 37 of 40 posts at 509–798 words, 4–5 FAQ items, 2 images, 5–9 H2s, **zero H3s**, all sharing one `dateModified`. More of the same is the problem, not the solution.
4. **No symmetrical translation.** English stays 8 pages (11 with legal). Hebrew content stays Hebrew. Translating 40 posts would produce 40 pages competing globally where Aiterra has no authority and no local advantage. Specifically: **all English pricing terms return empty autocomplete arrays** — the exact inverse of Hebrew. Do not port the cost strategy.
5. **No vertical pages without a named client.** The verticals Google suggests are the ones Aiterra cannot prove; the vertical Aiterra can prove (beauty/cosmetics, four clients) **has no Hebrew search identity** — nine autocomplete probes returned zero. That proof is **geographic, not vertical**: three of four beauty clients are in Holon. It belongs in the local assets.
6. **No head-term campaigns.** `קידום אתרים`, `בניית אתרים`, `חנות אינטרנטית`, `ניהול קמפיינים בגוגל` are **lost for 12 months** against 15–25-year-old domains with 318–410-URL sitemaps. Budget spent there is budget not spent on positions 18–30.
7. **No Core Web Vitals programme.** There is **zero CrUX data at page and origin level** — CWV is not a ranking factor for this site. Ship the video fix because it is free and already written. Do not touch TTFB (10–40 ms) or CLS (0–0.004); both are already excellent.
8. **No anchor-text rewriting.** 0 of 51 anchors are filler. Only the destinations are broken.
9. **No self-marked `AggregateRating`.** Google's review-snippet policy excludes reviews about the business served on its own site. Route stars through GBP.
10. **No fabricated numbers, ever.** Every figure carries its source. Where volume is unknown it says `[unverified — needs Keyword Planner]`, and it stays that way until somebody pulls it.
11. **No Tel Aviv address.** Aiterra is in Bat Yam. "Tel Aviv area" is fine; a fake address is a GBP suspension risk for zero upside.

---

## Review loop

**Monthly** — GSC clicks/impressions/position split by locale and by landing page; non-branded click count; coverage status of `/services/brochure` and the 12 project pages; GBP views, calls and review count; lead-form submissions by landing page.

**Day 90 — the prune decision, deferred deliberately.** No posts are pruned in Phase 4a, because the evidence for pruning does not exist yet: the "14 zero-impression posts" figure was an artefact of GSC's truncated query×page dimension — on the page dimension **zero of 40 posts have zero impressions**. Quality is unmeasurable while `/blog` exposes 9 of 40 posts and RelatedPosts never shows 19 of 40. Re-measure 90 days after Sprint 2 ships, then prune on real data.

### What would make us change course

| Signal | Reading | Response |
|---|---|---|
| Sprint 2 lands and maintenance positions do **not** improve within 8 weeks | The problem was never the link graph | Stop; re-diagnose before writing anything else |
| Non-branded clicks still ≈0 at day 90 **with** positions improved to top-20 | A SERP-appearance problem, not a ranking one | Titles, descriptions, structured data, price tables |
| GBP delivers calls faster than organic delivers clicks | Local is the real channel here | Reweight toward local and directories; slow the content programme |
| Keyword Planner shows the maintenance cluster is genuinely tiny | The pillar's ceiling is lower than hoped | Keep the service page, stop expanding the cluster, move budget to e-commerce integrations |
| A manual action or ranking collapse | Something in this plan was executed wrongly | Stop everything; audit before continuing |

**The pull list in [06-technical.md](06-technical.md) §9 names the ~21 terms whose absolute volume would firm up this plan, and what decision each one changes.** Until then, priorities rest on GSC impressions — which are real, first-party, and the strongest signal available.
