# 03 — Existing content: fix what is there before adding anything (Phase 4a)

**Written 2026-09-07.** Scope: the 40 published blog posts, the 5 live + 2 restored service pages,
the 12 project pages, and the internal-link graph that connects them. Nothing here is new content.

---

## 0. Read this before you schedule anything

**None of the content work in this document pays off until the link and crawl fixes land.**

That is not a rhetorical framing, it is what Google's own URL Inspection API says. `/services/brochure`
— the `בניית אתרים` page, the most commercially important URL on the site — is **"URL is unknown to
Google", never crawled, zero referring URLs**, while sitting in the sitemap (`00-audit.md` §2 P0-1).
`/projects/olie-6` is *Discovered – currently not indexed* with zero referrers. A sitemap gets a URL
discovered. Internal links get it crawled and ranked. Aiterra has the first and not the second.

So the order is fixed:

| | Work | Why it must come first |
|---|---|---|
| **1** | Deploy the service-slug restore, rewrite all 51 blog→service links, fix `/blog` (9→40) and `/projects` (0→12) | Until a page has an inbound link, expanding it changes nothing Google can see |
| **2** | Refresh the 6 posts that already rank (§4) | Now the refreshed page has a crawl path and a commercial destination |
| **3** | Re-measure at day 90, then prune (§2.2) | The prune decision is currently unmeasurable — see below |

Expanding a post before step 1 is spending editorial hours on a page whose only inbound link is a
sitemap entry. Do not reorder this.

### Method and what the numbers mean

- **GSC page-level figures** come from a live pull of `sc-domain:aiterra.co.il`, dimension `page`,
  2025-09-07 → 2026-09-05, 105 rows, on 2026-09-07. Saved at
  `scratchpad/p4a/gsc-page-12mo.tsv`. Table built by `scratchpad/p4a/table.py` — nothing hand-counted.
- **The 12-month pull returns row-for-row identical figures to the 89-day pull** in `00-audit.md`
  (home 23 cl / 407 im; maintenance 1 cl / 1,537 im). The property has no data before ~2026-06-09.
  Treat "12 months" and "89 days" as the same window throughout this document.
- **Best position** = the best position among queries with ≥3 impressions on the *clean* URL, after
  removing (a) the competitor rank-tracker bot rows (`weblinks.co.il`, `ביטויים ללא נפחי חיפוש`),
  (b) LLM-agent scaffolding rows (`make web search…`, `site:reddit…`), and (c) **branded** rows
  containing `aiterra`. Where every query row was sub-threshold, the page-level average is shown
  with a `—`. Note that the page-level averages for `how-to-choose-digital-agency` (9.2) and
  `freelancer-vs-web-agency` (6.0) are inflated by the branded query `ביקורות על aiterra agency`;
  neither page ranks at 6–9 for anything commercial.
- **Word counts** are the published figures from `audit/content-inventory.md` (markdown-stripped
  tokens including FAQ), parsed from that file rather than recomputed, so this document and
  `00-audit.md` cannot disagree.
- **Inbound-link counts** in this document mean **distinct linking posts**, not link instances.
  `audit/content-inventory.md` counts instances, so its column reads higher in three places:
  `website-building-services` 14 links from **12** posts, `wordpress-vs-custom-code` 9 from **6**,
  `seo-services` 8 from **7**. Distinct sources are the number that matters for a link graph.
- **No search volumes appear anywhere in this document, because none exist for this project.**
  Every figure carries its source. Terms needing Keyword Planner are listed in §7.

---

## 1. The destination map — decide this once, then everything else follows

Every link decision below depends on knowing what each service URL is *for*. Verified from
`src/app/(he)/v2/content.ts` `servicePages` (working tree) and live curl, 2026-09-07:

| URL | Live status today | `crumb` | What it must own | Retired slug that feeds it |
|---|---|---|---|---|
| `/services/web-development` | **308 → brochure** | בניית אתרים | `בניית אתרים` head, custom-code build | — (this IS the restore) |
| `/services/brochure` | 200 | אתרי תדמית | `אתר תדמית` | ← was the web-development target |
| `/services/ecommerce` | 200 | אתרי E-Commerce | `חנות אינטרנטית`, סליקה, platforms | — |
| `/services/development` | 200 | פיתוח | custom systems, integrations, אוטומציה | `/services/automation` |
| `/services/seo` | **308 → marketing** | קידום אתרים | organic search | — (this IS the restore) |
| `/services/marketing` | 200 | שיווק דיגיטלי | paid Meta + Google | `/services/adv` |
| `/services/branding` | 200 | מיתוג ועיצוב | מיתוג, UX/UI, landing-page design | — |
| **`/services/maintenance`** | **404** | *(new)* | תחזוקת אתר / אחזקת אתר / retainer | — (owner-approved new page) |

**Two things this map settles. Both are load-bearing.**

1. **The `web-development` / `brochure` boundary is already drawn in the working tree — the job is
   not to draw it, it is not to lose it.** Checked in `content.ts` on 2026-09-07:
   `brochure` (`:1812-1821`) has `crumb`/`eyebrow` `אתרי תדמית`, heading `אתר תדמית שמייצר…`,
   `metaTitle` `בניית אתר תדמית לעסק - עיצוב ופיתוח בקוד`, and **zero occurrences of the string
   `בניית אתרים` in its whole 144-line block**; `web-development` (`:1157-1166`) carries
   `בניית אתרים` 7 times. So there is no live head-term collision to fix. What the restore must
   not do is drift: `web-development` = the **method** page (custom-code build, the platform
   argument, the `בניית אתרים` head); `brochure` = the **product** page (אתר תדמית, a 5-page site,
   its price and its scope). Keep `בניית אתרים לעסקים` on `web-development`'s `metaTitle` only.
   *Do not target `בקוד` as a keyword* — `01-competitors.md` §4.2 found the term reads as
   "WordPress" in Israeli Hebrew usage. It is fine as page copy; it is not a term to chase.
2. **The restore is a deploy, not a build — and the danger is the tracked/untracked split, not a
   missing page.** The working tree already contains **7 `servicePages` entries**, `seo` among them
   (`content.ts:1663`, `metaTitle` `קידום אתרים בגוגל (SEO) - קידום אורגני לעסקים`), and a 3-slug
   (not 5-slug) retirement list in `next.config.ts:17-21`. `00-audit.md` §0.1 says shipping this
   turns `/services/seo` into a hard 404; **that is now stale — the `seo` key exists.** The live
   hazard is that `next.config.ts` is *tracked and already modified* (the `seo` and
   `web-development` redirects deleted at working-tree HEAD+1) while `content.ts` is *untracked*.
   Commit or deploy the config without the content file and `/services/seo` — 502 impressions —
   loses its redirect and finds no `servicePages` entry: `(he)/v2/services/[slug]/page.tsx:52`
   calls `notFound()`. **Deploy both together, verify `servicePages.seo` resolves in the built app,**
   and add `export const dynamicParams = false` to the HE service route so an unknown slug fails at
   build instead of 404ing in production.

---

## 2. All 40 posts — merge / expand / keep / prune

### 2.1 The ground rules I am working under

Four constraints from Phase 1, all of which I re-verified rather than inherited:

- **No post is thin.** Floor 509 words, median 693, ceiling 1,050. Nothing gets pruned for length.
- **The cost cluster and the automation cluster do not cannibalise.** Zero queries in either cluster
  are served by two different posts, because those posts do not rank well enough to collide.
  I am not inventing a merge programme to look decisive.
- **Exactly one genuine collision exists** — resolved in §2.3.
- **The corpus is template-uniform**: 40 of 40 posts have a TL;DR opener, exactly one table, 4–5 FAQ
  items, 2 images, 5–9 `##` and **zero `###`**, all carrying `rev: 4` and `dateModified: 2026-06-13`.
  The defect is sameness, not thinness — and sameness is fixed by expanding the few posts that rank,
  not by rewriting forty.

### 2.2 The crux: the "zero-impression" posts, and why nothing gets pruned yet

**The premise is wrong.** The engagement brief says 14 of 40 posts have zero impressions in 12 months.
The GSC **page** dimension says otherwise:

```
posts with 0 impressions on their canonical URL ......  2   (cheap-website-hidden-costs,
                                                            website-accessibility-israel)
posts with 0 impressions on BOTH the clean and /v2 URL   0
posts with no surviving row in the query x page export  16
```

The "14" (I count 16) is an artefact of the **query × page** dimension, which GSC truncates by
anonymising rare queries. Those posts have impressions; their queries were individually too rare to
survive the anonymisation threshold. And the two posts at zero on the canonical URL are *both*
earning impressions on their `/v2/` twin — so **not one of the 40 posts has zero impressions.**

Even if the premise had held, the measurement would still be unusable, because low impressions here
are confounded with crawl depth. Verified live today:

```
GET /blog     -> 9 distinct href="/blog/<slug>"   of 40   (BlogIndex.tsx:26 FIRST_PAGE = 9)
GET /projects -> 0 distinct href="/projects/<slug>" of 12  (useSearchParams inside Suspense fallback={null})
```

Plus, simulating the `RelatedPosts` algorithm against the real data (`(he)/v2/blog/[slug]/page.tsx:100-108`
— a coarse 4-bucket category sort, then `datePublished` desc inside each bucket, sliced to 9; see
§3.5): **19 of 40 posts never appear in any RelatedPosts block on any article.** Combined with the
9-of-40 hub, that is 19 posts whose only template-level inbound link is the sitemap.

> **You cannot read quality off the traffic of a page nobody links to.** Pruning here would delete
> pages for failing a test they were never entered into.

**Decision: PRUNE = 0 posts in Phase 4a.** Instead, a dated, falsifiable prune criterion:

> **Day-90 prune review.** Re-run the same `page`-dimension pull 90 days after the link + crawl fixes
> are *deployed*. Retire (301 into the nearest surviving post) any post that, by then, has all of
> (a) ≥3 contextual inbound internal links, (b) a link from `/blog`, and (c) an `INDEXING_ALLOWED` /
> indexed verdict in URL Inspection — and still draws **<10 impressions with no query above position
> 60**. Everything else stays.

That review will have real candidates. `email-marketing-guide`, `marketing-analytics-roi`,
`ux-ui-design-conversions` and `content-marketing-blog` each drew 1–2 impressions and hold no
assigned keyword in `02-keywords-he.csv`. I expect two to four retirements in December. I am not
making that call today on evidence that does not exist yet.

### 2.3 The one real collision — `חנות אינטרנטית`

```
178 im  pos 38.0   /blog/business-site-vs-online-store
 16 im  pos 84.5   /blog/ecommerce-store-that-sells      (194 im total)
```

**Survivor for the informational term: `/blog/business-site-vs-online-store`.** Ten times the
impressions, 46 positions better, owns 12 further store-intent queries (329 im total), and it is the
page Google has already chosen. Nothing is gained by arguing with that.

**Survivor for the commercial term: `/services/ecommerce`.** Every one of the 9 queries
`ecommerce-store-that-sells` holds is commercial (`הקמת חנות אינטרנט`, `שירותי הקמת חנות אינטרנט`,
`עלות הקמת חנות אינטרנט`) and **8 of the 9 sit at position 77–98**; the ninth
(`עלות הקמת חנות אינטרנט`, 1 impression) sits at 47.0. A blog post is the wrong page type
for that intent — `01-competitors.md` §2 shows 13 of 14 results on the head SERP are *homepages of
companies whose product is the keyword*. Move the build-a-store material onto the service page,
which draws 1 impression at **position 16** today with zero inbound blog links.

**Mechanics, in this order — the order matters:**

1. Move the build/scope/price material out of `ecommerce-store-that-sells` and into
   `/services/ecommerce`, and strip the head term from that post's title, H1 and first 100 words.
2. Only *then* `301 /blog/ecommerce-store-that-sells → /services/ecommerce`.
3. Re-anchor `business-site-vs-online-store`'s title and H1 onto the definitional/comparison intent
   it actually holds (`מה זה חנות אינטרנטית`, pos 33.0; `סוגי חנויות אינטרנטיות`, pos 32.8) and stop
   optimising it for the bare head term.

**If step 1 does not happen in the same sprint, do not do step 2.** A 301 from a post into a service
page that never absorbed the content is read as a soft 404 and wastes the 34 impressions. The
fallback in that case: keep the post, retitle it onto the Israeli platform/סליקה long tail
(`שופיפיי`, `ווקומרס` — transliterations that `01-competitors.md` §3.3 found appear **nowhere** on
the site), and re-review at day 90.

### 2.4 The decision table — all 40 posts

`impr` = 12-month GSC impressions, `page` dimension, clean URL, with the `/v2/` twin shown separately.
`best position` excludes bot, LLM-agent and branded query rows (§0).

| slug | words | impr (12 mo) | best position | current service link | ACTION | rationale |
|---|---:|---:|---|---|---|---|
| `website-maintenance-cost-yearly` | 667 | 1537 (+35 /v2) | **18.4** (170 im, תחזוקת אתר) | web-development ×1 | **EXPAND-1** | 37% of all blog impressions and the best commercial positions the domain holds anywhere. Becomes the pillar under the new `/services/maintenance`. |
| `google-ads-campaigns` | 712 | 710 | 8.7 (3 im, ניהול קמפיין ממומן) | adv ×2 | **EXPAND-1** | #2 page by impressions; `ניהול קמפיין ממומן בגוגל` 288 im @ **23.7**. The pillar verdict is CONTESTED but this *position* is real — value the position, not the pillar. |
| `keyword-research-guide` | 714 | 690 | 19.5 (21 im, חקר מילות מפתח) | seo ×2 | **EXPAND-1** | 589 non-bot impressions (99 of the 690 are the `weblinks.co.il` rank-tracker rows), of which **399 sit at positions 16–24 with zero clicks**. That is a title/snippet problem, not a ranking problem — the cheapest CTR experiment on the site. |
| `business-site-vs-online-store` | 673 | 329 (+4 /v2) | 32.8 (4 im, סוגי חנויות אינטרנטיות) | web-development ×1 | **EXPAND-1** | Survivor of the one real collision (§2.3). Re-anchor onto definitional intent: 32.8 on `סוגי חנויות אינטרנטיות` and 33.0 on `מה זה חנות אינטרנטית` are the best positions anything store-related holds on the domain. |
| `seo-cost-monthly-israel` | 796 | 101 (+14 /v2) | 39.7 (3 im, כמה עולה קידום אתרים בגוגל?) | seo ×1 | **EXPAND-1** | Format gap, not authority gap: every ranking page surfaces a ₪ table in the snippet; this post has 10 `₪` mentions and **zero tables**. Also the worst `/v2` split on the site (§5). |
| `digital-branding-guide` | 509 | 78 | **16.8** (58 im, מיתוג דיגיטלי) | adv ×1 | **EXPAND-1** | Shortest post in the corpus ranking 16.8 against 13 interchangeable "המדריך המלא" pages. Cheapest single position gain available. Also the only inbound candidate for `/services/branding`. |
| `google-business-profile-guide` | 675 | 67 (+4 /v2) | 15.0 (3 im, כרטיס עסק) | seo ×1 | **EXPAND-2** | The only near-page-1 organic position in the local pillar and the top of the local funnel; 13 assigned keywords in `02-keywords-he.csv`, more than any other post. |
| `ppc-minimum-budget-israel` | 642 | 68 (+1 /v2) | 15.8 (17 im, פרסום בגוגל ובפייסבוק) | adv ×1 | **EXPAND-2** | Already covers both platforms at pos 15.8. Fold the Meta budget material in here rather than writing a second page. |
| `crm-israeli-invoicing-integration` | 762 | 45 (+10 /v2) | **9.5** (6 im, חשבונית ירוקה icount) | automation ×1 | **EXPAND-2** | Best position in the automation pillar, and it sits in the one slice international competitors structurally cannot enter (Israeli invoicing integrations). 1 of the site's ~34 clicks. |
| `web-development-bat-yam` | 673 | 36 (+2 /v2) | **15.6** (28 im, בניית אתרים בת ים) | web-development ×1 | **EXPAND-2** | The only GSC-proven top-20 rank in the web-dev pillar, achieved from a blog URL with no `LocalBusiness` schema. Small but nearly free. |
| `whatsapp-business-api-crm-integration` | 734 | 26 (+2 /v2) | 14.6 (8 im, חיבור וואטסאפ api) | automation ×1 | **EXPAND-2** | Best position-to-effort ratio in the automation pillar; a SERP with real agency slots and no vendor moat. |
| `website-cost-israel-2026` | 715 | 14 | — (page avg 9.6) | web-development ×1 | **EXPAND-2** | The bridge page: 12 assigned keywords, holds `כמה עולה בניית אתר תדמיתי` @ 1.0, and it is the only asset that connects the build-cost cluster (unreachable) to the maintenance cluster (already held). Absorbs `cheap-website-hidden-costs`. |
| `local-seo-small-business` | 757 | 12 (+2 /v2) | — (page avg 21.6) | seo ×2 | **EXPAND-2** | One-line win: Israelis type `לוקאלי`, not `מקומי`, and this post's title uses neither. Retitle, add Bat Yam/Holon mechanics. |
| `website-accessibility-cost-5568` | 668 | 9 (+6 /v2) | — (page avg 22.6) | web-development ×1 | **EXPAND-2** | **GATED.** Buyer-side entry to accessibility, and nobody ranking explains how to build a site that passes natively. But 2,019 of 2,186 images sitewide ship `alt=""` while `/accessibility-statement` claims conformance. **Fix the alt text before publishing more accessibility authority.** |
| `ecommerce-store-that-sells` | 648 | 34 | 84.5 (16 im, חנות אינטרנטית) | web-development ×1 | **MERGE** | → `/services/ecommerce`, per §2.3. All 9 of its queries are commercial and 8 of the 9 sit at 77–98. Precondition: the service page must absorb the material first. |
| `cheap-website-hidden-costs` | 681 | 0 (+3 /v2) | — | web-development ×1 | **MERGE** | → `website-cost-israel-2026`. Same buyer question, and the merge moves **7 inbound internal links, from 4 distinct posts**, onto the bridge page. Expected traffic gain on its own: near zero. Do it for the link consolidation. |
| `geo-ai-search-optimization` | 1050 | 123 (+59 /v2) | 43.0 (4 im, seo בעידן הצ'אט) | seo ×2 | **KEEP** | Worst `/v2` split on the site (59 of 182 impressions on the redirecting URL). De-duplicate first, then re-measure. `01-competitors.md` §4.3: keep as differentiation, not a traffic bet. |
| `business-automation-crm-whatsapp` | 687 | 69 | 77.9 (11 im, אוטומציה לידים) | automation ×2 | **KEEP** | Real impressions at a position that converts nothing. The automation pillar is 187 impressions after stripping the industrial/DIY audience — no refresh budget. |
| `custom-web-systems` | 604 | 40 | 93.0 (37 im, שירותי פיתוח ווב) | web-development ×1 | **KEEP** | Retarget its link to `/services/development`, which is the page that should own `שירותי פיתוח ווב`. |
| `business-automation-12-processes` | 701 | 35 (+1 /v2) | 68.7 (3 im, אוטומציה למתחילים) | automation ×1 | **KEEP** | `אוטומציה לעסקים קטנים` 31 im @ 80.9, graded Low. Relink and leave. |
| `website-security-guide` | 719 | 29 | 73.0 (3 im, אבטחת אתרים) | web-development ×1 | **KEEP** | Becomes a feeder into `/services/maintenance` — security patching is a maintenance line item, and that is its only real commercial route. |
| `short-video-marketing` | 695 | 19 | — (page avg 9.9) | adv ×1 | **KEEP** | Holds 1 of the site's ~34 clicks. No assigned keyword. Relink to `/services/marketing`. |
| `how-to-choose-digital-agency` | 667 | 18 (+2 /v2) | — (page avg 9.2, brand-inflated) | **none** | **KEEP** | **The only post with zero service links.** Its 9.2 average is the branded `ביקורות על aiterra agency` row — an 18-impression trust query at pos 2.4 with zero clicks, which is a reviews/GBP problem, not a ranking one. |
| `website-performance-2026` | 789 | 16 (+1 /v2) | — (page avg 9.3) | web-development ×2 | **KEEP** | Add a `/services/maintenance` link. Note CWV is **not** a ranking factor here (no CrUX data at page or origin) — do not build a performance content push off this post. |
| `best-crm-small-business-israel` | 721 | 10 | — (page avg 6.8) | automation ×1 | **KEEP** | Comparison intent, graded Low. All queries sub-threshold. Relink and re-measure at day 90. |
| `website-accessibility-israel` | 814 | **0** (+9 /v2) | — | web-development ×2 | **KEEP** | One of two posts whose *only* ranking URL is the `/v2/` twin (§5). Fear intent converts above its volume. Same alt-text precondition as `…cost-5568`. |
| `seo-services` | 781 | 8 | — (page avg 11.5) | seo ×2 | **KEEP** | 7 inbound blog links — a hub node in the graph. Keep for link flow, not for traffic. |
| `ga4-pixel-conversion-tracking-guide` | 729 | 7 | — (page avg 29.7) | adv ×1 | **KEEP** | Its one assigned keyword (`תיקון 13 פרסום ממומן`) is graded **Low**, and the other three `תיקון 13` queries in `02-keywords-he.csv` are routed to a Phase 4b new page. Relink and leave. |
| `wordpress-vs-custom-code` | 798 | 7 | — (page avg 14.0) | web-development ×1 | **KEEP** | 6 inbound blog links. Add `/services/maintenance` + `/services/ecommerce` links — the WP-vs-code argument lands hardest on maintenance cost. |
| `business-automation-cost-roi` | 550 | 6 | — (page avg 69.8) | automation ×1 | **KEEP** | Weakest post in the corpus: fewest Hebrew tokens (405 of 550 words), worst page average, one Low-graded keyword (`אוטומציה עסקית מחיר`, 1 im @ 92.0). The honest merge candidate — but merging inside a 187-impression pillar buys nothing. Explicit day-90 prune candidate. |
| `website-migration-wix-redesign` | 706 | 4 (+1 /v2) | — (page avg 22.2) | web-development ×1 | **KEEP** | Zero inbound blog links today (orphan). Gains links in §3.3 and a `/services/maintenance` link. |
| `freelancer-vs-web-agency` | 610 | 4 (+1 /v2) | — (page avg 6.0, brand-inflated) | web-development ×1 | **KEEP** | The 6.0 is the branded reviews query, not a commercial rank. Good comparison asset; add the "who maintains it after launch" link. |
| `facebook-instagram-ads` | 641 | 5 | — (page avg 20.6) | adv ×2 | **KEEP** | 3 assigned keywords, all sub-threshold. Relink to `/services/marketing`. |
| `website-building-services` | 739 | 4 | — (page avg 19.8) | web-development ×2 | **KEEP** | **12 inbound blog links — the most-linked post on the site**, and it draws 4 impressions. It is a link hub, so it keeps its equity role; it is not a traffic asset. |
| `web-development-gush-dan` | 834 | 1 (+1 /v2) | — (page avg 71.0) | web-development ×1 | **KEEP** | Appears in 38 of 39 RelatedPosts blocks (bucket-then-date-sort artefact, §3.5) and still draws 1 impression — the clearest proof that template links alone do not rank a page. |
| `landing-pages-that-convert` | 728 | 2 | — (page avg 30.5) | web-development ×1 | **KEEP** | Assigned `מה ההבדל בין דף נחיתה לאתר תדמית` (High shot). Retarget its link to `/services/branding` + `/services/brochure` — the two pages it compares. |
| `content-marketing-blog` | 623 | 2 | — (page avg 31.5) | seo ×1 | **KEEP** | No assigned keyword. Day-90 prune candidate. |
| `ux-ui-design-conversions` | 693 | 1 | — (page avg 9.0) | web-development ×1 | **KEEP** | One inbound link on the whole site. No assigned keyword. Retarget to `/services/branding`. Day-90 prune candidate. |
| `marketing-analytics-roi` | 641 | 1 | — (page avg 37.0) | adv ×2 | **KEEP** | No assigned keyword. Fix the over-broad `קמפיין` anchor while relinking. Day-90 prune candidate. |
| `email-marketing-guide` | 658 | 1 | — (page avg 33.0) | automation ×2 | **KEEP** | No assigned keyword, weakest of the automation set. Day-90 prune candidate. |

**Totals: 6 EXPAND-1 · 8 EXPAND-2 · 2 MERGE · 24 KEEP · 0 PRUNE.**

**"KEEP" is not "do nothing."** Every KEEP post still gets, in the Phase 4a sprint: its service links
rewritten to a live 200 URL (§3), an author byline (the E-E-A-T layer is built and unreachable —
`00-audit.md` §2 P0-4), a **real `dateModified`** replacing the shared `2026-06-13`, and at least one
outbound link to a project case study (§3.3). That is roughly 15 minutes per post and it is the work
that makes the day-90 measurement meaningful.

---

## 3. The internal-link plan

This is the highest-leverage section in the entire strategy, and it is mostly find-and-replace.

**Where things stand, verified live 2026-09-07:**

```
/services/web-development -> 308 -> /services/brochure     21 blog links
/services/seo             -> 308 -> /services/marketing    11 blog links
/services/adv             -> 308 -> /services/marketing    10 blog links
/services/automation      -> 308 -> /services/development    9 blog links
                                             51 of 51 = 100% redirect hops
inbound blog links to each LIVE 200 service page:           0
```

Anchor text is **already good** — 0 of 51 are filler (`כאן` / `לחץ כאן` / bare URLs), all are
descriptive Hebrew noun phrases. **Do not rewrite anchors wholesale.** The table below changes an
anchor only where the destination itself changes topic (7 cases) or where the existing anchor is
over-broad (2 cases: `קמפיין` ×2, `אתר אינטרנט` ×2).

Both `data/blog-posts.json` **and** `src/data/blog-seed.json` must be edited — they are byte-identical
today (MD5 `53fb4347…`) and must stay so. Serialize with `JSON.stringify(x, null, 2)` or you get the
3,400-line phantom diff recorded in project memory.

### 3.1 Per-post link rewrite — all 40 posts

`→` = retarget an existing link. `+` = add a new link that does not exist today.

| post | current (all 308) | new destination(s) | Hebrew anchor |
|---|---|---|---|
| `website-maintenance-cost-yearly` | web-development ×1 | **→ `/services/maintenance`** · **+ `/services/web-development`** | `שירות תחזוקת האתרים` (new) · keep `בניית האתרים` |
| `website-security-guide` | web-development ×1 | **→ `/services/maintenance`** · **+ `/services/web-development`** | `תחזוקה ואבטחה שוטפת` (new) · keep `בניית האתרים` |
| `website-performance-2026` | web-development ×2 | `/services/web-development` ×1 · **+ `/services/maintenance`** | replace over-broad `אתר אינטרנט` with `בניית אתרים בהתאמה אישית` · `תחזוקה שוטפת` (new) |
| `website-accessibility-cost-5568` | web-development ×1 | `/services/web-development` · **+ `/services/maintenance`** | keep `בניית והנגשת האתרים` · `תחזוקת נגישות שוטפת` (new) |
| `website-accessibility-israel` | web-development ×2 | `/services/web-development` ×1 · **+ `/services/maintenance`** | replace over-broad `אתר אינטרנט` with `בניית אתרים נגישים` · `תחזוקת נגישות` (new) |
| `wordpress-vs-custom-code` | web-development ×1 | `/services/web-development` · **+ `/services/maintenance`** · **+ `/services/ecommerce`** | keep `בניית האתרים` · `עלות תחזוקה של אתר בקוד` · `חנות אינטרנטית בקוד` |
| `website-migration-wix-redesign` | web-development ×1 | `/services/web-development` · **+ `/services/maintenance`** | keep `בניית האתרים` · `תחזוקת האתר אחרי המעבר` |
| `freelancer-vs-web-agency` | web-development ×1 | `/services/web-development` · **+ `/services/maintenance`** | keep `בניית האתרים` · `מי מתחזק את האתר אחרי ההשקה` |
| `website-cost-israel-2026` | web-development ×1 | `/services/web-development` · **+ `/services/brochure`** · **+ `/services/maintenance`** · **+ `/services/ecommerce`** | keep `בניית האתרים` · `אתר תדמית` · `עלות התחזוקה השוטפת` · `הקמת חנות אינטרנטית` |
| `web-development-bat-yam` | web-development ×1 | `/services/web-development` · **+ `/services/brochure`** | keep `בניית האתרים` · `אתר תדמית לעסק` |
| `web-development-gush-dan` | web-development ×1 | `/services/web-development` · **+ `/services/brochure`** | keep `בניית האתרים` · `אתר תדמית לעסק` |
| `website-building-services` | web-development ×2 | `/services/web-development` ×1 · **→ `/services/brochure`** ×1 | keep `בניית אתרים` · `בניית אתר תדמית` |
| `business-site-vs-online-store` | web-development ×1 | **→ `/services/ecommerce`** · **+ `/services/brochure`** | `הקמת חנות אינטרנטית` (new) · `אתר תדמית` (new) |
| `custom-web-systems` | web-development ×1 | **→ `/services/development`** | `פיתוח מערכות בהתאמה אישית` (new) |
| `ux-ui-design-conversions` | web-development ×1 | **→ `/services/branding`** | `עיצוב UX/UI` (new) |
| `landing-pages-that-convert` | web-development ×1 | **→ `/services/branding`** · **+ `/services/brochure`** | `עיצוב דפי נחיתה` (new) · `אתר תדמית` (new) |
| `digital-branding-guide` | adv ×1 | **→ `/services/branding`** | `מיתוג ועיצוב` (new — a branding post must not point at the paid-media page) |
| `ecommerce-store-that-sells` | web-development ×1 | *n/a — post 301s to `/services/ecommerce`* | — |
| `cheap-website-hidden-costs` | web-development ×1 | *n/a — post 301s to `website-cost-israel-2026`* | — |
| `keyword-research-guide` | seo ×2 | `/services/seo` ×2 | keep `קידום אתרים`, `קידום האתרים האורגני` |
| `geo-ai-search-optimization` | seo ×2 | `/services/seo` ×2 | keep both |
| `seo-cost-monthly-israel` | seo ×1 | `/services/seo` | keep `קידום האתרים` |
| `google-business-profile-guide` | seo ×1 | `/services/seo` | keep `קידום האתרים האורגני` |
| `local-seo-small-business` | seo ×2 | `/services/seo` ×2 | keep both |
| `seo-services` | seo ×2 | `/services/seo` ×2 | keep both |
| `content-marketing-blog` | seo ×1 | `/services/seo` | keep `קידום האתרים האורגני` |
| `google-ads-campaigns` | adv ×2 | **→ `/services/marketing`** ×2 | keep `פרסום ממומן`, `הפרסום הממומן` |
| `ppc-minimum-budget-israel` | adv ×1 | **→ `/services/marketing`** | keep `הפרסום הממומן` |
| `facebook-instagram-ads` | adv ×2 | **→ `/services/marketing`** ×2 | replace over-broad `קמפיין` with `ניהול קמפיינים בפייסבוק` · keep `הפרסום הממומן` |
| `marketing-analytics-roi` | adv ×2 | **→ `/services/marketing`** ×2 | replace over-broad `קמפיין` with `ניהול הקמפיינים הממומנים` · keep `הפרסום הממומן` |
| `ga4-pixel-conversion-tracking-guide` | adv ×1 | **→ `/services/marketing`** | keep `הפרסום והאנליטיקס` |
| `short-video-marketing` | adv ×1 | **→ `/services/marketing`** | keep `הפרסום הממומן` |
| `business-automation-crm-whatsapp` | automation ×2 | **→ `/services/development`** ×2 | keep `אוטומציה עסקית`, `האוטומציה העסקית` |
| `business-automation-12-processes` | automation ×1 | **→ `/services/development`** | keep `האוטומציה העסקית` |
| `business-automation-cost-roi` | automation ×1 | **→ `/services/development`** | keep `האוטומציה העסקית` |
| `crm-israeli-invoicing-integration` | automation ×1 | **→ `/services/development`** | keep `האוטומציה העסקית` |
| `whatsapp-business-api-crm-integration` | automation ×1 | **→ `/services/development`** | keep `האוטומציה העסקית` |
| `best-crm-small-business-israel` | automation ×1 | **→ `/services/development`** | keep `האוטומציה והחיבורים` |
| `email-marketing-guide` | automation ×2 | **→ `/services/development`** ×2 | keep `אוטומציה`, `האוטומציה העסקית` |
| `how-to-choose-digital-agency` | **none** | **+ `/services`** · **+ `/services/web-development`** · **+ `/services/marketing`** | `שירותי הסוכנות` · `בניית אתרים לעסקים` · `ניהול קמפיינים ממומנים` |

The `automation → development` retargets keep their existing `אוטומציה` anchors deliberately: the
destination page's own `metaTitle` is `פיתוח מערכות ואוטומציה בהתאמה אישית`, so the anchor and the
page still agree. No churn needed.

**No anchor in this table targets the head phrase `בניית אתרים בקוד`.** `01-competitors.md` §4.2
found `בקוד` reads as "WordPress" in Israeli Hebrew search usage, so it is fine as on-page copy and
wrong as a term to chase. The two `בקוד` anchors that remain (`wordpress-vs-custom-code`) are
deliberate: that post's entire subject is the WordPress-versus-custom-code comparison, and neither
anchor is the head phrase.

### 3.2 What the graph looks like after the rewrite

| live service page | inbound posts **today** | inbound posts **after** |
|---|---:|---:|
| `/services/web-development` (restored) | 0 (21 links, all 308) | **13** |
| `/services/seo` (restored) | 0 (11 links, all 308) | **7** |
| `/services/marketing` | **0** | **7** |
| `/services/development` | **0** | **8** |
| `/services/maintenance` (new) | n/a | **9** |
| `/services/brochure` | **0** | **6** |
| `/services/ecommerce` | **0** | **3** + the merged post's material |
| `/services/branding` | **0** | **3** |

Counted off the §3.1 table, **51 links become 66** — 65 to service sub-pages plus one to the
`/services` hub — all landing on a 200, and two links disappear with the two merged posts. Every
live service page goes from zero contextual inbound links to at least three.

### 3.3 Posts that must link to the new `/services/maintenance`

Nine posts, chosen because maintenance is a genuine line item in each argument — not to inflate a
count:

`website-maintenance-cost-yearly` (the pillar) · `website-security-guide` · `website-performance-2026`
· `website-accessibility-cost-5568` · `website-accessibility-israel` · `website-cost-israel-2026` ·
`wordpress-vs-custom-code` · `website-migration-wix-redesign` · `freelancer-vs-web-agency`.

`website-maintenance-cost-yearly` is the one that matters. It carries **1,537 impressions, 37% of all
blog impressions**, ranks 18.4 / 19.4 / 22.1 / 22.3 on four money queries, and today its single CTA
308s into `/services/brochure` — a page that does not contain the word `תחזוקה` even once
(0 occurrences of `תחזוקה / תחזוקת / אחזקה / אחזקת / ריטיינר` across all `servicePages`). It is also
one of four **orphan** posts receiving no link from any other post. Fix both directions: it links
down to the service page, and `website-cost-israel-2026`, `website-security-guide`,
`wordpress-vs-custom-code` and `cheap-website-hidden-costs`'s absorbed section link *into* it.

### 3.4 The 12 orphan project pages

`/projects` renders **0** of 12 case-study links (verified live today), and **0 of the 281 internal
links in the 40 post bodies** point at any `/projects/*` or `/portfolio/*` URL (counted over
`data/blog-posts.json`, 2026-09-07). Google confirms `/projects/olie-6` as *Discovered – currently
not indexed* with zero referring URLs. Three inbound routes, in order of value:

1. **Fix the hub (§3.5).** Server-rendering the 12 cards gives every project its first real inbound
   link. This alone resolves the orphan status.
2. **Service page → case study.** Each service page gets a 2–3 item "עבודות שנבנו אצלנו" block.
   Today no service page links to an individual project or post — only to the `/projects` and
   `/blog` hubs, and those links come from the shared footer, not the page body (curl-verified on
   `/services`, `/services/brochure`, `/services/marketing`, `/services/ecommerce`).
3. **Blog post → case study.** One contextual link per post where a real case exists, mapped by the
   project's own `category`/`tags` in `data/portfolio-projects.json`:

| project | linked from |
|---|---|
| `neot-sade` (Next.js store, סליקה, מועדון לקוחות) | `business-site-vs-online-store`, `wordpress-vs-custom-code`, `website-performance-2026` |
| `alova` (Shopify) | `business-site-vs-online-store`, `website-migration-wix-redesign` |
| `olie-6` (Shopify, eCommerce) | `website-migration-wix-redesign`, `website-cost-israel-2026` |
| `ecommerce-store` (React/Node/Stripe) | `custom-web-systems` |
| `karin-cohen` (דף נחיתה, WhatsApp, לידים) | `landing-pages-that-convert`, `whatsapp-business-api-crm-integration` |
| `hofit-cosmetics` (דף נחיתה, WhatsApp) | `landing-pages-that-convert`, `website-cost-israel-2026` |
| `maayan-cosmetics` (tags include **נגישות**) | `website-accessibility-israel`, `website-accessibility-cost-5568` |
| `eli-ben-yitzhak` (WhatsApp, גלריית עבודות) | `web-development-gush-dan`, `business-automation-crm-whatsapp` |
| `alexandra-patsina` (UI/UX, מיתוג) | `ux-ui-design-conversions`, `digital-branding-guide` |
| `sous-chef` (SaaS product site, English) | `custom-web-systems`, `wordpress-vs-custom-code` |
| `brand-identity` (SEO, ניהול מוניטין) | `digital-branding-guide`, `local-seo-small-business`, `google-business-profile-guide` |
| `marketing-platform` (מיתוג, Meta, Funnel) | `google-ads-campaigns`, `facebook-instagram-ads`, `short-video-marketing`, `marketing-analytics-roi` |

All 12 get at least one contextual inbound link. **Honest gap:** 10 of the 12 projects are websites
or landing pages. **There is no automation or systems case study**, so the six automation/CRM posts
have no matching proof asset and should link to the `/projects` hub rather than to a mismatched case.
Writing one systems case study is a Phase 4b item; do not fake it by pointing `best-crm-small-business-israel`
at a cosmetics landing page.

`/projects/alexandra-patsina` deserves a note: its **legacy** `/portfolio/` URL holds **3 of the
site's ~34 clicks at position 6.8** — the second-best click source on the whole property after the
homepage — and the clean URL draws 1 impression at position 27. See §5.

### 3.5 The two crawl dead-ends — described, not implemented

**`/blog` exposes 9 of 40.** `BlogIndex.tsx:26` `FIRST_PAGE = 9`, `:27` `PAGE = 8`, `:52`
`visible.slice(0, limit)`, `:130` the "load more" `<button>`. Verified live today: exactly 9 distinct
`/blog/<slug>` hrefs.

> **Fix:** server-render all 40 `<a>` elements and let the "load more" button toggle `hidden` on nodes
> that are already in the DOM, rather than slicing the array before render. Forty cards is not a
> pagination problem — it is 40 anchors. If the design requires progressive reveal, keep the button
> but stop it from gating the markup. A `/blog/page/[n]` route set is the fallback if the team
> prefers it; it is more moving parts for the same outcome.

**`/projects` exposes 0 of 12.** `ProjectsGrid` is a `useSearchParams` client component inside
`<Suspense fallback={null}>`, so a crawler receives the fallback — an empty grid. Verified live today:
zero `/projects/<slug>` hrefs; the only project-ish links are `?filter=` parameter URLs.

> **Fix:** render the 12 cards in the server component and demote the client component to the filter
> interaction only, reading `searchParams` server-side. Make the filter chips real
> `<a href="/projects?filter=…">` links. If the client component must stay, give `<Suspense>` a
> fallback that *contains the 12 links* rather than `null` — a fallback is what the crawler indexes.

**Two more template defects in the same class, both cheap:**

- **`/services/brochure` has no template link anywhere on the site.** It is not in the header
  dropdown, not on the `/services` hub, and the footer offers only the fragment
  `/services#v2-service-brochure` — **an anchor id that does not exist on the live hub page.** Add
  `brochure` to `servicesStack.items` and convert the footer's `#v2-service-*` fragments to real
  `/services/<slug>` hrefs. This is why Google has never crawled it.
- **`RelatedServicesSection.tsx` already exists and is imported by nothing** (dead code, re-exported
  only from `src/components/sections/index.ts:34`). Wiring it into
  `(he)/v2/blog/[slug]/page.tsx` after the article body gives all 40 posts a topic-aware service
  block instead of the identical 4-link boilerplate every post emits today.
- **`RelatedPosts` is a 4-bucket category sort, then `datePublished` desc inside each bucket**
  (`(he)/v2/blog/[slug]/page.tsx:100-108`, buckets from `content.ts:883-893`). Two things break it:
  the buckets are coarse (`SEO` / `WEBSITES` / `TIPS`, matched on substrings like `אתר` and `עסק`),
  and a post whose category resolves to the default `BLOG` tag hits the `all` filter, whose `match`
  is `[]`, so it gets **no** category weighting and falls through to a pure date sort. Simulated over
  the real data: `web-development-gush-dan` and `seo-cost-monthly-israel` each appear in **38 of 39**
  articles while **19 posts appear in none**. Weight by real tag overlap instead of a 4-way bucket.

---

## 4. The refresh list — posts already ranking 8–30

Refreshing beats writing new here, because the site does not have a content-volume problem: it has
40 posts, one flat `dateModified`, and no link graph. These six are the Phase 4a editorial budget.
Each entry says what to add and what evidence says to add it.

### 4.1 `website-maintenance-cost-yearly` — 1,537 im · pos 18.4 on `תחזוקת אתר`

The largest verified demand pocket on the property, and it beats automation **7.6× on impressions at
page-2-to-3 positions instead of page-6-to-10** (`01-competitors.md` §1).

**Split the job across two pages, do not try to make the post do both.** The maintenance SERP has
already resolved the intent: `תחזוקת אתרים מחיר` ranks a **price list that is a sales page** at #1
(`web-site.care/website-maintenance-price-list/` — ₪190 / ₪290 / ₪490 / ₪690 per month, ~800 words,
FAQ, CTA, WebFetch 2026-09-07). Aiterra has the article and no service page — the exact inverse.

- **New `/services/maintenance`** takes the head + price terms: a published מחירון with named tiers,
  an **SLA table** (`digitalsecrets.co.il/תחזוקת-אתרים/` ranks #5 publishing ₪250/hr min ₪499/mo,
  response ≤24 h, fix ≤8 h — that table *is* why it ranks), a "what is NOT included" section, and FAQ.
- **The post keeps the `כמה עולה` / `עלות` long tail**, where Aiterra already sits at 19.4–28.3, and
  becomes the link source into the service page.

**What to add to the post specifically:**
1. A **cost-separation H2 and table**: "עלות בנייה מול עלות אחזקה" — 4 of the top 18 on
   `עלות תחזוקת אתר אינטרנט` are `בניית אתרים` price pages, i.e. Google has not cleanly separated the
   two intents. A page that separates them explicitly answers a question the SERP currently answers
   badly.
2. **Named Israeli infrastructure with current prices.** The #1 result (`maimonweb.com`) ranks a
   **1,200-word page with no FAQ, last updated 2024-07-08**, purely because it names uPress, Vangus,
   SPD, JetServer, LiveDNS, Domain The Net with shekel figures. Aiterra can publish current numbers
   against a two-year-old incumbent.
3. A **non-WordPress maintenance section** — what it costs to keep a custom/Next.js site running.
   Nobody in this SERP writes it, and it is Aiterra's actual product.

### 4.2 `keyword-research-guide` — 690 im · pos 19.5–24.0 · **zero clicks**

Strip the 99 impressions of `weblinks.co.il` rank-tracker noise and 589 real impressions remain, of
which **399 sit at positions 16–24** (`מחקר מילות מפתח` 203 @ 24.0, `מחקר מילות חיפוש` 112 @ 23.5,
`מחקר מילות מפתח בגוגל` 40 @ 23.2, `מחקר מילות המפתח` 22 @ 21.9, `חקר מילות מפתח` 21 @ 19.5)
producing nothing. The remaining ~190 sit at 57–90 and are not the opportunity. **Page-2 positions
with zero clicks are a title and snippet problem, not a ranking problem, and this is the fastest CTR
experiment on the site.**

Add: a **step-by-step numbered H2 sequence** (the corpus has zero `###` headings anywhere — this post
is the natural place to break that template), and a section on **Hebrew-specific keyword mechanics**
(כתיב מלא/חסר, ניקוד, plural forms, transliteration) where no international publisher can compete.
Then rewrite the `<title>` **to ≤60 characters** — it currently exceeds that, like all 40 posts,
because blog posts have no `metaTitle` field separate from the H1. Adding that field is the
prerequisite; without it there is no CTR experiment to run.

### 4.3 `google-ads-campaigns` — 710 im · `ניהול קמפיין ממומן בגוגל` 288 im @ 23.7

Do **not** convert this post into a service page — it ranks precisely because the `ממומן` variant is
guide-leaning, and the service page does not rank at all (`/services/adv` 30 im @ 56.8).

Add: **per-industry cost figures**, the **three agency pricing models** (percentage of spend / fixed
retainer / hybrid) as a table, and structure aimed at the domains Google's AI answer already cites.
Note the pillar verdict is CONTESTED with poor click economics — this is a position to defend, not a
pillar to invest in.

### 4.4 `seo-cost-monthly-israel` — 101 im · `כמה עולה קידום אתרים בגוגל` 69 im @ 42.2

**Pure format gap.** Every ranking page surfaces a ₪ table in the snippet; this post has ten `₪`
mentions in prose and **zero tables**. The PAA on that SERP hands you the H2 structure for free:
`לפי מה נקבע מחיר קידום אתרים?` · `האם קיים מחירון קידום אתרים?` · `כמה עולה קידום אתר בישראל?`.

Add: a price table with named tiers, those three H2s, and an `Offer` block — a competitor
(`avinu`) is live proof that `Offer` + `AggregateRating` render in this exact SERP. **`AggregateRating`
requires real reviews; `Organization.sameAs` is `[]` today, so ship `Offer` only until reviews exist.**
Also the site's worst `/v2` split: the twin ranks **16.9** against the clean URL's 41.9 (§5).

### 4.5 `business-site-vs-online-store` — 329 im · pos 32.8

Survivor of the collision. Re-anchor title and H1 onto `מה זה חנות אינטרנטית` / `סוגי חנויות
אינטרנטיות` (pos 33), absorb the definitional material from `ecommerce-store-that-sells`, and add a
**comparison table** (אתר תדמית vs חנות: setup cost, monthly cost, סליקה, invoicing, who it suits).
Link out to `/services/brochure` and `/services/ecommerce` — the two things it compares.

### 4.6 `digital-branding-guide` — 78 im · pos 16.8 on `מיתוג דיגיטלי`

509 words and 5 H2s ranking 16.8 against 13 interchangeable "המדריך המלא" posts with no first-party
data. The cheapest single position gain available. (`01-competitors.md` §4.1 calls it a 539-word post
with 4 H2s; `audit/content-inventory.md` row 7 is authoritative — 509 words, 5 H2s.)

Add: a **first-party case section** pointing at `/projects/brand-identity` and
`/projects/alexandra-patsina`, and 2–3 `###` sub-sections. **Value the click, not the lead** — Israeli
`מיתוג` overwhelmingly means party and event decor (Google autocomplete for the bare word returns
`מיתוג ליום הולדת`, `מיתוג לבר מצווה`, `מיתוג לחלאקה`…), so the qualified phrase is the whole market
here and it is small. Do not expand this into a branding content programme.

**EXPAND-2 (next sprint, same treatment, smaller stakes):** `google-business-profile-guide` (add a
Bat Yam/Holon local CTA and answer the four PAA questions) · `ppc-minimum-budget-israel` (fold in the
Meta budget figures) · `crm-israeli-invoicing-integration` (add the חשבונית ירוקה / iCount / מורנינג
pair-matrix; note `מורנינג` in Hebrew appears **nowhere** on the site) · `web-development-bat-yam`
(add `LocalBusiness` schema and move the win toward a real service page) ·
`whatsapp-business-api-crm-integration` (official-vs-grey-tool compliance + per-conversation pricing
in shekels) · `website-cost-israel-2026` (build the total-first-year-cost table; absorb
`cheap-website-hidden-costs`) · `local-seo-small-business` (retitle onto `לוקאלי`) ·
`website-accessibility-cost-5568` (**gated on the alt-text fix**).

---

## 5. The `/v2/` duplicate cleanup

**Nothing is misconfigured. Do not "fix" the redirects.** Re-verified today:
`GET /v2/blog/website-accessibility-israel → 308 → /blog/website-accessibility-israel`, and the clean
page emits a self-referencing absolute canonical. The 12-month page pull shows:

```
/v2/blog/*   19 URLs   158 impressions   0 clicks
/v2/* other  10 URLs    17 impressions   0 clicks
/portfolio/* 13 URLs   222 impressions   5 clicks   <- the same defect, larger
```

Three cases where the redirecting URL is the *only* or the *better* one:

| post | clean URL | `/v2/` twin | |
|---|---|---|---|
| `website-accessibility-israel` | **0 im** | 9 im @ 71.6 | only the twin ranks |
| `cheap-website-hidden-costs` | **0 im** | 3 im @ 63.3 | only the twin ranks |
| `seo-cost-monthly-israel` | 101 im @ 41.9 | 14 im @ **16.9** | the twin ranks **25 positions better** |

And the largest split by volume is `geo-ai-search-optimization`: 123 im on the clean URL, **59 on the
twin** — a third of the page's total impressions sitting on a URL that 308s.

**The `/portfolio/` case is bigger and is the same defect.** `/portfolio/eli-ben-yitzhak` draws 48 im
@ 7.0 while `/projects/*` URLs draw 1 im each, and `/portfolio/alexandra-patsina` holds **3 clicks at
position 6.8** — one of the best-converting URLs on the property — while its clean twin sits at
position 27 with 1 impression.

### What to do

1. **Change nothing about the redirects, canonicals or sitemap.** Adding `/v2/` URLs to the sitemap,
   or canonicalising them, would make this worse. The setup is already correct; what is missing is a
   reason for Google to recrawl.
2. **Cut the remaining internal links into the legacy tree.** Verified live today, every author page
   (`/blog/author/{eric,michael,sean,vadim}`) still runs pre-v2 chrome and links to `/portfolio` ×3,
   `/services/web-development`, `/services/seo`, `/services/adv` and `/services/automation` — **7
   redirect hops × 4 pages = 28**, which is exactly the 28 author-page hops `00-audit.md` §3 counts
   inside the site's 79 internal links to 308s (the other 51 are the post bodies in §3). Outside
   those 40 post bodies, the author pages are the only pages still linking to the retired slugs.
   Migrate them to the v2 chrome in the same sprint as §3.
3. **Give Google a recrawl trigger.** The sitemap carries one flat, three-month-stale `lastmod` on 67
   of 70 URLs. The §3 link rewrite touches every post, so per-URL `lastmod` becomes *truthful* at the
   same moment — emit it. That is the cheapest way to signal 40 changed pages at once.
4. **Request indexing on the clean URL** for the four priority cases above
   (`website-accessibility-israel`, `cheap-website-hidden-costs` — before it 301s —
   `seo-cost-monthly-israel`, `geo-ai-search-optimization`) plus `/services/brochure`, which Google
   has never fetched.
5. **Clean up GSC's sitemap registration:** remove `https://aiterra.co.il/sitemap.xml` (the
   redirecting apex host, 70 URLs, last downloaded 2026-09-03) and resubmit
   `https://www.aiterra.co.il/sitemap.xml` (stale since 2026-08-27).
6. **Do not use the URL Removals tool.** It suppresses rather than consolidates, and for two posts it
   would remove the only URL currently earning impressions before the clean one ranks.

**Expected timeline, stated as a shape rather than a number:** consolidation follows recrawl, and
recrawl follows links. A `page`-dimension pull restricted to 2026-08-09 → 2026-09-05 returns the same
19 URLs and the same 158 impressions as the full-window pull, so **every `/v2/blog` impression falls
inside the last 28 days** — this is a live condition, not residue. There is still no lever that
forces it faster than steps 2–4. Re-measure the same page pull at day 30, 60 and 90.

**One thing that is not a duplicate and is a live defect:** `/landings/ecomerce` returns **404**
today, while GSC shows it holding 18 impressions and **1 click at position 26.1**. The second,
unrelated Next.js app at `/landing` (HTTP 200) is swallowing that path. That is a URL with proven
traffic now returning 404 — either restore it or 301 it to `/services/ecommerce`. It is a defect, not
a design.

---

## 6. Sequenced 90 days

| Week | Work | Gate |
|---|---|---|
| **0** | Commit the 180 untracked files to a branch (`00-audit.md` §0). Not SEO work; it is the largest operational risk on the project | Nothing else starts until this is done |
| **1** | Deploy `next.config.ts` and `content.ts` **in the same commit** (§1 hazard 2); verify `servicePages.seo` resolves in the built app; add `dynamicParams = false`; hold the `web-development` / `brochure` metaTitle boundary that already exists | `/services/seo` and `/services/web-development` return **200**, not 404 |
| **1** | Claim / create and verify the Google Business Profile (P0; no profile surfaced in 21+ probes, `01-competitors.md` §7 — assume it needs claiming, confirm before creating a duplicate) | — |
| **2** | Rewrite all 51 links in both blog JSON files (§3.1); add author pages to the v2 chrome; add `brochure` to the nav; fix the footer `#v2-service-*` fragments | 0 blog links resolve to a 308 |
| **2** | Fix `/blog` (9→40) and `/projects` (0→12); wire `RelatedServicesSection`; re-weight `RelatedPosts` | `curl /blog` returns 40 hrefs, `curl /projects` returns 12 |
| **3** | Real per-URL `lastmod`; GSC sitemap cleanup; request indexing for the 5 priority URLs | — |
| **3–4** | Build `/services/maintenance` (מחירון + SLA table + exclusions + FAQ) and relink the 9 feeder posts | — |
| **4–8** | EXPAND-1: the six posts in §4. Fix alt text before touching either accessibility post | — |
| **6** | Resolve the collision (§2.3) — service page absorbs first, then the 301 | — |
| **8–12** | EXPAND-2: the eight posts. Author bylines + real `dateModified` across all 40 | — |
| **Day 90** | Re-run the `page`-dimension pull. Apply the prune criterion in §2.2 | The first honest prune decision |

**Do not measure success on clicks before day 60.** The site is at position ~48 with a 0.54% CTR
(`00-audit.md` §1, `date` dimension; the `page` dimension used elsewhere here gives 34/6,583 = 0.52%);
the first observable signal will be *position* movement on the maintenance and cost clusters and
`/services/brochure` changing from "unknown to Google" to crawled — not traffic.

---

## 7. What this document needs from Keyword Planner

Everything above is built on GSC impressions and observed SERPs. No absolute volume exists. Pull
these before anyone writes a forecast — they are the terms whose *absolute* size changes a decision
in this document, not a general wish-list:

| Term | Decision it gates |
|---|---|
| `תחזוקת אתר` · `תחזוקת אתרים` · `אחזקת אתר` · `תחזוקת אתר אינטרנט` | The whole maintenance bet. Google Trends returns **0 in 155 of 157 weekly buckets** (geo IL) against `בניית אתרים` at 100 — the pool is below Trends' rounding floor. The case for maintenance rests on *position*, not size; a Planner pull tells the owner whether the ceiling justifies the service page |
| `תחזוקת אתרים מחיר` · `עלות תחזוקת אתר אינטרנט` · `כמה עולה תחזוקת אתר` | Whether the מחירון belongs on the service page or the post |
| `חנות אינטרנטית` · `הקמת חנות אינטרנט` | Whether the §2.3 merge is worth the URL |
| `מחקר מילות מפתח` · `מחקר מילות חיפוש` | Whether the CTR fix on 690 impressions is worth an editorial slot |
| `ניהול קמפיין ממומן בגוגל` vs `ניהול קמפיינים בגוגל` | Which variant `google-ads-campaigns` should own |
| `מיתוג דיגיטלי` | Whether branding gets any budget beyond one refresh |
| `בניית אתרים בת ים` · `קידום אתרים בבת ים` | Whether the local play earns a service page or stays a blog post. Google autocomplete returns **zero suggestions** for the first — real per GSC (28 im), and small |
| `שופיפיי` · `ווקומרס` · `מורנינג` | Whether the Hebrew transliterations justify their own pages in Phase 4b |

---

## 8. Contradictions found in the source material

| Claim | Source | What I found |
|---|---|---|
| "14 of 40 posts have ZERO impressions in 12 months" | engagement brief | **False as stated.** GSC `page` dimension, 12 months: **2** posts have zero impressions on their canonical URL, and **both** have a ranking `/v2/` twin — so **zero** posts have zero impressions. The figure comes from the `query × page` dimension (16 posts have no surviving row there), which GSC truncates by anonymising rare queries. This is the crux of §2 and it removes the premise for pruning |
| `/services/web-development` and `/services/seo` are "LIVE 200" | `audit/internal-links.md` §c | **False for production.** Curl 2026-09-07: both **308**. That table describes the uncommitted working tree / dev server. The same file's own "LIVE-PRODUCTION recomputation" section corrects it — the two halves of that document disagree with each other |
| Baseline is "32 clicks / 5,967 impressions" (`date` dimension) | `00-audit.md` §1 | The `page` dimension over the same window returns **34 clicks / 6,583 impressions**. Both are real; they differ because GSC aggregates differently per dimension. Pick one and state it — I use the `page` dimension throughout because it is the only one that attributes to URLs |
| "19 `/v2/blog/*` URLs still appear in Google results" | `CONTEXT.md` | Confirmed: 19 URLs, **158** impressions, 0 clicks. But the **`/portfolio/*` legacy tree is the larger instance of the same defect** — 13 URLs, **222 impressions and 5 of the site's ~34 clicks** — and no source document treats it as part of the same problem |
| "A second app is live at `/landing`, swallowing `/landings/*`" | `00-audit.md` §3 | `/landing` is still 200, but **`/landings/ecomerce` now returns 404** (curl 2026-09-07) — and GSC credits that URL with 18 impressions and **1 click at pos 26.1**. It is not merely swallowed, it is broken |
| Restoring `/services/web-development` and `/services/seo` is page construction | implied by the brief | It is a **deploy plus a find-and-replace**. The working tree already has 7 `servicePages` entries and a 3-slug retirement list |
| "Shipping the working tree turns `/services/seo` into a hard 404 — no `seo` key exists" | `00-audit.md` §0.1 | **Stale.** `content.ts:1663` in the working tree *does* define `servicePages.seo` (`metaTitle` `קידום אתרים בגוגל (SEO) - קידום אורגני לעסקים`). The file is WIP and changed after that audit ran. The real hazard is narrower and still real: `next.config.ts` is **tracked** with the `seo` + `web-development` redirects already deleted, while `content.ts` is **untracked** — commit or deploy one without the other and the 404 happens (§1) |
| `web-site.care` "ranks with no price table and no FAQ" | `01-competitors.md` §3.1 | **True of the wrong URL.** That describes `web-site.care/the-cost-of-maintaining-a-website/`. The domain's *other* ranking URL, `/website-maintenance-price-list/`, is #1 on `תחזוקת אתרים מחיר` with four published tiers (₪190/₪290/₪490/₪690 per month), ~800 words, an FAQ and a CTA (WebFetch 2026-09-07, `research/serp-maintenance.md` §evidence-1). §4.1 is built on the price-list page, and the "structurally weaker incumbent" framing does **not** apply to it |
| "PAA and related-searches could not be captured" | `01-competitors.md` §0 | True for five pillars, **not for SEO/organic**: `research/keywords-seo-organic.md` §2 harvested **58 Hebrew PAA questions across 18 saved google.co.il DOMs**. The three questions §4.4 hands to `seo-cost-monthly-israel` come from that harvest, on the `כמה עולה קידום אתרים בגוגל` SERP |
