# 04 — Page map (Phase 4c / 4d / 4e)

**Written 2026-09-07.** Every page Aiterra should build, rebuild or retire, with a full brief.
Read [00-audit.md](00-audit.md) and [01-competitors.md](01-competitors.md) first — this document
assumes both and does not re-argue them.

## How to read the briefs

- **Rendered `<title>` vs the field you edit.** `src/lib/metadata.ts:29-30` appends `" | AITERRA"`
  to every title that does not already contain the site name. `SITE_NAME = 'AITERRA'`
  (`src/lib/seo.ts:1`), so the suffix costs **10 characters**. Every brief gives both: the
  `metaTitle` string to type (≤50) and the rendered `<title>` it produces (≤60). Both counted, by
  hand, in a script. This is the exact defect behind "44 of 70 live pages exceed 60 chars"
  (00-audit §3).
- **No search volumes exist for this project.** Every number carries its source inline:
  `GSC: N impr/89d @ pos P` · `Trends: relative index N` · `SERP: <observed>` ·
  `[unverified — needs Keyword Planner]`. There are **no traffic forecasts in this document** and
  there must be none in any document derived from it. §11 lists the exact terms to pull.
- **Word counts are derived from pages that actually rank**, with the competitor and its measured
  length cited. Where no competitor length was measured, the brief says so rather than guessing.
- Baseline word counts for the five live Hebrew service pages were measured by me on 2026-09-07
  (fetch `https://www.aiterra.co.il<path>`, strip `<script>/<style>/tags`, count tokens):
  `brochure 661` · `marketing 622` · `ecommerce 888` · `development 831` · `branding 681`.
  (00-audit quotes 521 for `marketing` and 741 for `development` — a different tokeniser, not a
  different page. Where the two disagree, the ranking is the same and the decision is unaffected.)

## The priority ledger

| # | Page | Action | Cluster | Priority |
|---|---|---|---|---|
| 1 | `/services/maintenance` | **NEW** | maintenance | **P0** |
| 2 | `/blog/website-maintenance-cost-yearly` | REVISE (keep slug) | maintenance | **P0** |
| 3 | `/services/web-development` | RESTORE + reposition | web build | **P0** |
| 4 | `/services/seo` | **REVISE** (already exists, 738 words — see §2.3) | organic SEO | **P0** |
| 5 | `/services/brochure` | REVISE (narrow) | web build | **P0** |
| 6 | `/services/marketing` | REVISE (title only) | paid | **P0** |
| 7 | `/blog/website-maintenance-agreement-sla` | NEW | maintenance | P1 |
| 8 | `/blog/israeli-hosting-registrar-costs` | NEW | maintenance | P1 |
| 9 | `/blog/developer-disappeared-site-handover` | NEW | maintenance | P1 |
| 10 | `/blog/web-development-bat-yam` | REVISE **in place** | local | P1 |
| 11 | `/blog/web-development-gush-dan` | **RETIRE → 301** | local | P1 |
| 12 | `/blog/privacy-amendment-13-website-forms` | NEW | web build | P1 |
| 13 | `/blog/shopify-israel-clearing` | NEW | e-commerce | P1 |
| 14 | The English set (8 + 3 legal) | REVISE titles/H1s | EN shell | P1 |
| 15 | `/services/web-development/holon` | **CONDITIONAL** | local | P2 |
| 16 | `/services/landing-pages` | NEW (replaces `/landing`) | web build | P2 |
| 17 | `/blog/allocation-number-api-integration` | NEW | integrations | P2 |
| 18 | `/blog/online-store-cost-israel` | NEW | e-commerce | P2 |

**17 Hebrew URLs — 11 new, five edits to pages that already exist, one retirement —
plus the 11-URL English shell. Not 40.** Everything deliberately *not* built is listed in §3.4,
§4.5, §5.4, §5.5 and §5.7 with the evidence for not building it.

---

## §0 — Nothing below works until these land

Not pages. Stated once, because every brief silently depends on them.

| Gate | Evidence | Why every page below fails without it |
|---|---|---|
| Commit the untracked tree | `git ls-tree -r HEAD` has 0 files under `app/(en)`/`app/(he)`, 129 under `app/v2/` (00-audit §0) | `git clean -fd` deletes the English site and the route-group migration |
| Do **not** split the commit | `next.config.ts` is **tracked** with the `seo` and `web-development` redirects deleted; the pages replacing them are in **untracked** `content.ts` (both already written — 738 and 703 words, verified locally 2026-09-07). Committing one without the other 404s a URL carrying **GSC: 502 impr/89d**. *(Corrects an earlier claim that no `seo` page existed — 00-audit §0.1)* | Commit atomically. Nothing to build. |
| Rewrite all 51 blog→service links | 51/51 point at retired slugs and 308; all 5 live service pages have **0** inbound links from 40 posts (00-audit §2 P0-1) | `/services/brochure` is *"URL is unknown to Google"*, never crawled, **0 referring URLs** (URL Inspection API, 2026-09-07). New pages inherit the same fate |
| Render `/projects` (0 of 12) and `/blog` (9 of 40) server-side | 00-audit §2 P0-2 | Every "links in" row in every brief below is a lie if the hubs render nothing |
| Fix the `/v2/*` duplicates | `/v2/blog/seo-cost-monthly-israel` outranks the canonical (GSC 21.5 vs 33.0 on `קידום אורגני מחיר`); 32 maintenance impressions split onto `/v2/` copies at pos 69.4 vs 26.5 (keywords-maintenance §6) | Splits the exact clusters §1 and §2 are built on |
| Claim + verify a Google Business Profile | No GBP surfaced in 21 (Phase 2) + further (Phase 3) probes; `Organization.sameAs = []` | Gates §4 entirely, and gates Midrag entry |

---

## §1 — The maintenance pillar (P0)

### 1.1 The split decision — the most important call in this document

The SERP for this cluster is **not** split between "hire" and "price". It is split between
*question-shaped* and *vendor-shaped* phrasing of the same money intent, and the evidence is
unambiguous (serp-maintenance §3):

- `תחזוקת אתרים מחיר` ranks a **price list that is a commercial service page** at #1 —
  `web-site.care/website-maintenance-price-list/`, ~800 words, four purchasable tiers
  **₪190 / ₪290 / ₪490 / ₪690 per month**, FAQ, CTA (Brave IL + WebFetch, 2026-09-07).
- `digitalsecrets.co.il/תחזוקת-אתרים/` ranks #5 on the same query with a ~3,000-word **service
  page** publishing hourly rates *and* an SLA: ₪250/hr min ₪499/mo, response ≤24 h, fix ≤8 h.
- Every informational page that ranks is written by somebody who sells the service
  (danielzrihen, maimonweb, nir-bachar). Across 60 ranked results there is **no neutral
  publisher, no comparison portal, and exactly one non-first-party URL — a YouTube video.**

So the buyer's job is *"tell me the number so I can judge the quote in my inbox, and if you're
credible I'll hire you."* One asset must be able to do both halves. **The service page is the
primary asset.**

**The allocation rule, and it is a rule, not a preference:**

> `מחיר` / `מחירון` / vendor nouns (`חברת…`, `שירותי…`, `חבילות`) → **the service page.**
> `כמה עולה` / `עלות` → **the cost post.**

Applied to the verified cluster:

| Query | GSC (89d) | Owner | Why |
|---|---|---|---|
| תחזוקת אתר | 170 impr @ **18.4** | `/services/maintenance` | Head. SERP is ~13/20 commercial service pages |
| תחזוקת אתר אינטרנט | 141 @ 26.5 | `/services/maintenance` | Head variant |
| אחזקת אתר | 82 @ 22.3 | `/services/maintenance` | Head variant. **Must carry `אתר אינטרנט` in the same phrase** — Google's own corpus attaches `אחזקת מבנים` to this stem (keywords-maintenance §1.3) |
| אחזקת אתר אינטרנט | 75 @ 31.8 | `/services/maintenance` | — |
| תחזוקת אתרים | 17 @ 37.5 | `/services/maintenance` | Plural head; the one query Trends returns as "עלייה חדה" |
| תחזוקת אתר אינטרנט מחיר | **271** @ 53.5 | `/services/maintenance` | Vendor-shaped; #1 for the sibling is a price *page* |
| תחזוקת אתרים מחיר | 197 @ 55.9 | `/services/maintenance` | — |
| תחזוקת אתר מחיר | 101 @ 42.3 | `/services/maintenance` | — |
| עלות תחזוקת אתר אינטרנט | 91 @ **22.1** | `/blog/…cost-yearly` | Question-shaped, and the post already holds pos 22 |
| כמה עולה תחזוקת אתר | 47 @ **19.4** | `/blog/…cost-yearly` | Post already holds pos 19 |
| כמה עולה להחזיק אתר | 41 @ 28.3 | `/blog/…cost-yearly` | — |
| עלות תחזוקת אתרים | 53 @ 47.0 | `/blog/…cost-yearly` | — |
| כמה עולה להחזיק אתר אינטרנט | 46 @ 49.9 | `/blog/…cost-yearly` | — |
| כמה עולה תמיכת אתרים · עלות תמיכת אתרים | **90** combined @ 47–57 (+3 more at 32–34 in the 12-month export) | `/blog/…cost-yearly` | The `תמיכה` stem, question-shaped. 90 of the cluster's 1,430 impressions that the allocation above left unassigned; they belong to the post by the same rule, and need one sentence naming `תמיכת אתרים` as a synonym |
| עלות אחזקת אתר אינטרנט | no GSC row | `/blog/…cost-yearly` | The *only* phrase Google's autocomplete knows that the site has no row for |

**The honest risk, stated because it is real:** `תחזוקת אתר` at **pos 18.4** currently lands on
the post. Handing it to a brand-new page asks Google to swap the ranking URL, and there will be a
transition dip. Three things make it the right call anyway: (a) the post cannot convert — its
only CTA 308s into a page about *building* brochure sites; (b) the post keeps six queries at its
three best positions, so it is not being demoted; (c) the swap is steered, not hoped for — the
post's title drops the bare head phrase, the service page takes it, and the post's in-body anchor
`תחזוקת אתרים` points at the service page. **Do not 301 the post.** Its URL carries
**GSC: 1,537 impr/89d** and it is the site's highest-impression page.

**Anti-cannibalisation contract (testable):**
1. The post's `<title>` must contain `כמה עולה` or `עלות`, and must **not** contain the bare
   string `תחזוקת אתרים` without one of them.
2. The service page's `<title>` must **not** contain `כמה עולה` or `עלות`.
3. The service page publishes **₪/month**; the post publishes both, **₪/month first**.
4. Their FAQ sets are disjoint. No question appears on both.
5. Exactly one anchor each way, with the anchors named in the briefs below.

---

### 1.2 · P0-1 · **NEW** `/services/maintenance`

| Field | Value |
|---|---|
| Slug | `/services/maintenance` — English-transliteration, matching `brochure`/`ecommerce`/`branding`. Currently **HTTP 404** (curl 2026-09-07) |
| Locale | `he` — `src/app/(he)/v2/services/[slug]`, add a `maintenance` key to `servicePages` (`src/app/(he)/v2/content.ts:1156`) |
| Primary keyword | **תחזוקת אתרים** · cluster: maintenance / vendor-shaped |
| Also owns | תחזוקת אתר · תחזוקת אתר אינטרנט · אחזקת אתר אינטרנט · אחזקת אתר · +the three `מחיר` variants · `חברת תחזוקת אתרים` (SERP: dedicated pages at digita, leos, wemanage, hadara-digital; no GSC row, no autocomplete — [unverified — needs Keyword Planner]) |
| Intent → next action | **Money** → "בקשת הצעה לחוזה תחזוקה" (a quote form, not a generic `/contact` link) |
| `metaTitle` (46) | `תחזוקת אתרים ואחזקת אתר אינטרנט — מחירון חודשי` |
| Rendered `<title>` (56) | `תחזוקת אתרים ואחזקת אתר אינטרנט — מחירון חודשי \| AITERRA` |
| Meta description (130) | `חבילות תחזוקת אתרים חודשיות עם מחירון גלוי, זמני תגובה ותיקון בהסכם (SLA), עדכוני אבטחה, גיבויים וניטור. גם לאתרים שלא נבנו אצלנו.` |
| H1 | `תחזוקת אתרים ואחזקת אתר אינטרנט — עם מחירון וזמני תגובה בכתב` |
| Word count | **1,300–1,600.** Derived: the page that ranks **#1** for `תחזוקת אתרים מחיר` is ~**800 words** (`web-site.care/website-maintenance-price-list/`); the deepest ranking service page is ~**3,000 words** (`digitalsecrets.co.il/תחזוקת-אתרים/`, #5 same query); the median ranker is ~**1,850 words** with a 6-item FAQ (`digitizer.co.il/website-maintenance/`). **Length is not the ranking variable in this SERP — published numbers are.** 1,300–1,600 buys tiers + SLA + exclusions + FAQ with no padding |
| Schema | `Service` + `FAQPage` + `BreadcrumbList` via the existing `ServiceJsonLd` (`src/app/(he)/v2/components/ServiceJsonLd.tsx:19`). **`ServiceJsonLd` emits no `offers` node — add one**, mapping the מחירון tiers to `Offer`/`PriceSpecification` in ILS. Without it the price table is invisible to machines |
| hreflang | **none.** `maintenance` is not in `EN_SERVICE_SLUGS`, so `metadata.ts:57-65` correctly emits `canonical` only (05-bilingual §1.2) |
| Priority | **P0** — the single highest-leverage new page on the site |

**H2 outline**

1. `מה נכלל בתחזוקת אתר — ומה לא` (the "not included" list is the trust device; nobody publishes one)
2. `מחירון תחזוקת אתרים — חבילות חודשיות` ← the מחירון block. Use the existing `pricing.plans`
   structure, proven on `/services/ecommerce` (`content.ts:1407`, type at `:1133-1139`)
3. `זמני תגובה וזמני תיקון (SLA)` ← a table. Only **one** competitor publishes response *and* fix
   times per tier (digitalsecrets); one publishes a single "up to 48 hours" (digitizer)
4. `תחזוקת אתר וורדפרס` ← a **section, not a page.** `תחזוקת אתר וורדפרס`: autocomplete confirms
   it (my probe, `hl=he&gl=il`, 2026-09-07), **GSC: 0 impr/89d**, **Trends: 0 in every weekly
   bucket over 5 years**. ≥8 of the top 20 carry `וורדפרס` in the title — competitor supply, no
   measurable demand. Cover it; do not build for it
5. `תחזוקת אתר שלא בנינו — איך מקבלים אתר יתום` (the handover intake; feeds post #9)
6. `נגישות ת"י 5568 כפריט תחזוקה שוטף` ← **the moat.** Across the 7 maintenance pages read in
   full (web-site.care, itayost, digita, digitizer, digitalsecrets, maimonweb, seolinks —
   serp-maintenance §7 gap 1), **0 mention ת"י 5568 or תקנות נגישות**; the 5568 SERP is owned by
   widget vendors (vee.co.il markets conformance at **₪500/year**, WebFetch 2026-09-07) who sell
   an audit, not maintenance.
   ⚠ **Blocked until Aiterra's own `alt=""` defect is fixed** (2,019 of 2,186 images, 00-audit §2 P0-5)
7. `אינטגרציות ישראליות שנשברות בעדכון` (Morning/חשבונית ירוקה, iCount, ריווחית) — **0 of 7**
   competitor pages mention any of them
8. `למי זה מתאים ולמי לא`
9. `שאלות נפוצות` — 6–8 items, disjoint from the cost post

**Links in** (all must be added; none exist today):
`/services` hub · `/blog/website-maintenance-cost-yearly` (primary, anchor `תחזוקת אתרים`) ·
`/blog/website-security-guide` · `/blog/cheap-website-hidden-costs` ·
`/blog/website-accessibility-cost-5568` · `/blog/crm-israeli-invoicing-integration` ·
`/services/brochure`, `/services/ecommerce`, `/services/web-development` (a "what happens after
launch" block on each) · the sitewide footer services list.
**Links out:** `/blog/website-maintenance-cost-yearly` (anchor `כמה עולה תחזוקת אתר`) ·
`/blog/website-maintenance-agreement-sla` · `/blog/israeli-hosting-registrar-costs` ·
`/blog/developer-disappeared-site-handover` · `/contact`.

**Do not ship without:** monthly prices in ₪, and an SLA table. Both are the whole point. A
maintenance page without published numbers is `/services/marketing` with a different noun.

---

### 1.3 · P0-2 · **REVISE** `/blog/website-maintenance-cost-yearly`

| Field | Value |
|---|---|
| Slug | **unchanged.** Do not rename. This URL carries **GSC: 1,537 impr/89d @ pos 37.5** and is the highest-impression page on the site. The slug says "yearly" and the content will lead monthly — that is an acceptable cosmetic mismatch; a URL change is not |
| Locale | `he` |
| Primary keyword | **כמה עולה תחזוקת אתר** · cluster: maintenance / question-shaped |
| Also owns | עלות תחזוקת אתר אינטרנט (91 @ 22.1) · כמה עולה להחזיק אתר (41 @ 28.3) · עלות תחזוקת אתרים (53 @ 47.0) · כמה עולה להחזיק אתר אינטרנט (46 @ 49.9) · the `תמיכה` stem (90 combined @ 47–57) · עלות אחזקת אתר אינטרנט (no GSC row) |
| Intent → next action | **Money (softer)** → read the number, then click through to `/services/maintenance` |
| `metaTitle` (44) | `כמה עולה תחזוקת אתר? עלות חודשית ושנתית 2026` |
| Rendered `<title>` (54) | `כמה עולה תחזוקת אתר? עלות חודשית ושנתית 2026 \| AITERRA` — down from the current **75 chars** |
| Meta description (129) | `כמה באמת עולה תחזוקת אתר בישראל: מחירים חודשיים ושנתיים לפי סוג אתר, עלויות אחסון ודומיין אמיתיות בשקלים, ומה נכלל בכל טווח מחיר.` |
| H1 | `כמה עולה תחזוקת אתר בישראל — לחודש ולשנה, לפי סוג האתר` |
| Word count | **1,400–1,800**, up from **692**. Derived: `maimonweb.com/עלות-אחזקת-אתרים/` ranks **#1** for `עלות תחזוקת אתר אינטרנט` on a **~1,200-word**, 2024-dated page with **no FAQ**, purely because it names uPress, Vangus, SPD, JetServer, LiveDNS, Domain The Net, BOX and My Names **with shekel prices**. The deepest artefact is `itayost.com/blog/website-maintenance-cost-per-month` at **~2,800 words** with a "נתונים ומקורות" section. Target beats maimonweb on freshness and vendor coverage without matching itayost's bulk |
| Schema | keep `BlogPosting` + `FAQPage` (both already live). Add `dateModified` that actually moves — all 40 posts currently share `2026-06-13` |
| hreflang | **none** — there is no `/en/blog` and there will not be (05-bilingual §1.3) |
| Priority | **P0** |

**H2 outline**

1. `תחזוקת אתר: כמה זה עולה לחודש` ← **the #1 fix.** Every competitor quotes per month
   (₪190 / ₪250 / ₪290 / ₪350 / ₪450 / ₪490 / ₪600 / ₪690 / ₪700 — every figure read off a live
   competitor page with WebFetch on 2026-09-07, serp-maintenance §4/§5); Aiterra quotes only per year,
   so its snippet reads "2,000–6,000 ₪ בשנה" against their "₪290 לחודש" and the reader cannot
   compare it to the quote in their inbox without doing arithmetic
2. `ולשנה — אותו מספר, בפריסה שנתית`
3. `מחירי אחסון ודומיין בישראל, לפי ספק` ← named vendors with prices. Replaces the current
   unfalsifiable `אחסון 300–1,500 ₪`. Links to post #8
4. `עלות בניה מול עלות אחזקה — למה זה מתבלבל` ← **exploitable.** 4 of the top 18 for
   `עלות תחזוקת אתר אינטרנט` are `בניית אתרים` price pages (morevision, adwrks, digitizer,
   growmore, webitnow). The engine has not separated the two questions; a page that separates them
   **in the H1** answers something the SERP answers badly
5. `אתר שלא על וורדפרס — כמה עולה לתחזק, ולמה פחות` ← the one line in the whole corpus is
   itayost's "Custom built (React/Next.js): ₪100–500 לחודש". ⚠ It must argue **"less maintenance,
   not none"** — `danielzrihen.co.il` already ranks for
   *"בעלי אתרים בקוד ללא מערכת אינם צריכים תחזוקה שוטפת – הקוד אינו משתנה"*, which talks the
   reader out of the retainer
6. `מה קורה אם לא מתחזקים` ← keep. It is the one dimension where this post already beats the
   price lists
7. `נתונים ומקורות` ← copy itayost's structural move. Current outbound citations: **two, both
   international** (`web.dev`, `gs.statcounter.com`)
8. `שאלות נפוצות` — keep 5 items, rewritten to be disjoint from the service page

**Links in:** `/services/maintenance` (anchor `כמה עולה תחזוקת אתר`) · `/blog` hub ·
`/blog/cheap-website-hidden-costs` · `/blog/website-cost-israel-2026`.
**Links out:** `/services/maintenance` (anchor `תחזוקת אתרים` — **this replaces the current
`/services/web-development` link, which 308s into a brochure-building page**) ·
`/blog/israeli-hosting-registrar-costs` · `/blog/website-maintenance-agreement-sla` ·
`/blog/website-security-guide`.

---

### 1.4 · P1-1 · **NEW** `/blog/website-maintenance-agreement-sla`

| Field | Value |
|---|---|
| Slug | `/blog/website-maintenance-agreement-sla` |
| Locale | `he` |
| Primary keyword | **הסכם תחזוקת אתר** · cluster: maintenance |
| Volume | **[unverified — needs Keyword Planner].** Autocomplete returns **zero** for this seed (my probe, 2026-09-07, confirming keywords-maintenance §1.2). Write it for the sales conversation, not for the traffic |
| Intent → next action | **Informational, highest-intent in the cluster** — the reader is holding somebody else's quote → "ראו את ה-SLA שלנו" into `/services/maintenance` |
| `metaTitle` (36) | `הסכם תחזוקת אתר: מה חייב להיות ב-SLA` |
| Rendered `<title>` (46) | `הסכם תחזוקת אתר: מה חייב להיות ב-SLA \| AITERRA` |
| Meta description (129) | `מה חייב להופיע בהסכם תחזוקת אתר: זמן תגובה, זמן תיקון, מה לא נכלל, בעלות על גיבויים ודומיין, ואיך יוצאים מההסכם בלי לאבד את האתר.` |
| H1 | `מה חייב להיות בהסכם תחזוקת אתר — צ׳קליסט לבעל העסק` |
| Word count | **900–1,200.** Derived: this is a checklist, and the incumbent is a *page*, not a monograph — `wemanage.co.il/sla/` ranks first for the Hebrew SLA query (WebSearch 2026-09-07) alongside ISOC, JetServer, servers24, MessageNet, thejunction. No word count was measured for `wemanage.co.il/sla/`: **[unverified — needs a competitor page fetch]** |
| Schema | `BlogPosting` + `FAQPage` |
| hreflang | none |
| Priority | **P1** |

**H2 outline:** 1 `זמן תגובה מול זמן תיקון — לא אותו דבר` · 2 `מה חייב להיכנס לרשימת "לא כלול"` ·
3 `מי מחזיק את הדומיין, הגיבויים וההרשאות` · 4 `יחידת חיוב, בנק שעות ותוקף שעות` ·
5 `איך יוצאים מההסכם` · 6 `שאלות נפוצות`.
**Correction to the source research:** 01-competitors §5 lists this as a page "nobody in Israel
has written". That is now false — `wemanage.co.il` holds **at least five URLs** in this cluster
including `/sla/` (keywords-maintenance §4). The gap is narrower than Phase 2 recorded, which is
exactly why this is P1 and not P0.

**Links in:** `/services/maintenance` · `/blog/website-maintenance-cost-yearly` ·
`/blog/how-to-choose-digital-agency`. **Links out:** `/services/maintenance` · `/contact`.

---

### 1.5 · P1-2 · **NEW** `/blog/israeli-hosting-registrar-costs`

| Field | Value |
|---|---|
| Slug | `/blog/israeli-hosting-registrar-costs` |
| Locale | `he` |
| Primary keyword | **מחיר אחסון אתרים בישראל** · cluster: maintenance (supporting) |
| Volume | `עלות אחסון אתר לשנה` **GSC: 8 impr/89d @ pos 32.2**; `כמה עולה אחסון אתר לשנה` 1 @ 34.0. Absolute **[unverified — needs Keyword Planner]** |
| Intent → next action | **Informational**, and deliberately so — the buyer of *hosting* wants uPress, not an agency. This page exists to be the citable data table the cost post links to, and to earn the "named local vendors" signal that put maimonweb at #1 |
| `metaTitle` (43) | `מחירי אחסון ודומיין בישראל 2026 — טבלה מלאה` |
| Rendered `<title>` (53) | `מחירי אחסון ודומיין בישראל 2026 — טבלה מלאה \| AITERRA` |
| Meta description (126) | `מחירי אחסון אתרים ודומיינים בישראל, לפי ספק ובשקלים: uPress, Vangus, SPD, JetServer, Domain The Net ו-LiveDNS — טבלה שמתעדכנת.` |
| H1 | `כמה עולים אחסון ודומיין בישראל — מחירון לפי ספק` |
| Word count | **700–1,000** and mostly table. Derived: `maimonweb.com/עלות-אחזקת-אתרים/` is **~1,200 words with no FAQ**, dated 2024-07-08, and ranks **#1** — the ranking factor is the named-vendor table, not the prose. Beat it on **freshness**, which is the only moat here |
| Schema | `BlogPosting` + `FAQPage`. `dateModified` must be maintained quarterly or this page is worse than nothing |
| hreflang | none |
| Priority | **P1** |

**H2 outline:** 1 `אחסון — מחירון לפי ספק ישראלי` · 2 `דומיין — מחיר רישום וחידוש, ומי מחזיק אותו` ·
3 `SSL, אימייל עסקי וגיבויים` · 4 `מה משתנה כשהאתר לא על וורדפרס` · 5 `איך קוראים את הטבלה` ·
6 `שאלות נפוצות`.
**Links in:** `/blog/website-maintenance-cost-yearly` · `/services/maintenance` ·
`/blog/cheap-website-hidden-costs`. **Links out:** `/services/maintenance` ·
`/blog/website-maintenance-cost-yearly`.

---

### 1.6 · P1-3 · **NEW** `/blog/developer-disappeared-site-handover`

| Field | Value |
|---|---|
| Slug | `/blog/developer-disappeared-site-handover` |
| Locale | `he` |
| Primary keyword | **העברת בעלות על אתר** / `המפתח נעלם` · cluster: maintenance |
| Volume | **[unverified — needs Keyword Planner].** The handover SERP is owned by **hosting knowledge bases** writing technical migration steps — support.upress.co.il, vangus.co.il, blog.spd.co.il, mws.co.il, pojo.co.il, dweb.co.il, internet-israel.com (WebSearch 2026-09-07). **Nobody writes the business-owner version** |
| Intent → next action | **Informational → Money.** Every reader of this page is a maintenance lead by definition → `/services/maintenance` "אימוץ אתר יתום" |
| `metaTitle` (35) | `המפתח נעלם? כך משתלטים על האתר שלכם` |
| Rendered `<title>` (45) | `המפתח נעלם? כך משתלטים על האתר שלכם \| AITERRA` |
| Meta description (119) | `המפתח נעלם או הפסיק לענות? המדריך של בעל העסק להשתלטות על הדומיין, האחסון, כרטיס העסק בגוגל וקוד האתר — ומה לדרוש בכתב.` |
| H1 | `המפתח נעלם — איך משתלטים בחזרה על האתר, הדומיין והחשבונות` |
| Word count | **1,000–1,300.** Derived: the incumbents are vendor KB articles, typically short and single-topic; the differentiator is *coverage across all six assets in one page*, not depth on any one. No competitor length measured: **[unverified — needs a competitor page fetch]** |
| Schema | `BlogPosting` + `FAQPage` |
| hreflang | none |
| Priority | **P1** |

**H2 outline:** 1 `שישה נכסים שצריך להחזיר` · 2 `דומיין: מי רשום כבעלים ואיך מעבירים`
(Domain The Net / LiveDNS / BOX — the registrars Israelis actually use) · 3 `אחסון וגישה לשרת` ·
4 `כרטיס העסק בגוגל וחשבון GA4` · 5 `קוד האתר וה-repository` · 6 `מה לדרוש בכתב לפני שמשלמים` ·
7 `כמה עולה לאמץ אתר יתום` · 8 `שאלות נפוצות`.
**Links in:** `/services/maintenance` · `/blog/how-to-choose-digital-agency` ·
`/blog/freelancer-vs-web-agency` · `/blog/google-business-profile-guide`.
**Links out:** `/services/maintenance` · `/blog/google-business-profile-guide` · `/contact`.

---

## §2 — The restored service pages (P0)

### 2.1 The two cannibalisation pairs — a real decision, taken

Restoring `web-development` next to `brochure`, and `seo` next to `marketing`, creates two
overlapping pairs. Both are real. One is currently a **live defect**, and the other is worse than
the researchers realised. Evidence from the working tree
(`src/app/(he)/v2/content.ts`, `servicePages`):

**Pair A — `web-development` × `brochure`.** These are near-duplicates *today*:

| | `web-development` | `brochure` |
|---|---|---|
| `heading` | `בניית אתרים בקוד` / `שמביאה לקוחות` | `אתר תדמית שמייצר` / `רושם ראשוני ופניות` |
| `metaTitle` | `בניית אתרים לעסקים - פיתוח אתרים בקוד מלא` | `בניית אתר תדמית לעסק - עיצוב ופיתוח בקוד` |
| `lede` | `אפיון, עיצוב ופיתוח בקוד מלא - אתר מהיר, נגיש ומותאם למובייל…` | `אפיון, עיצוב ופיתוח בקוד מלא - אתר מהיר, מותאם למובייל…` |

The ledes share their opening clause verbatim. Restoring the page as-is puts two near-identical
service pages on the same site.

**But the query evidence separates them cleanly, and it is the `עיצוב` stem that does it.**
Most of what GSC attributes to `/services/web-development` is **design-vendor** demand —
**181 of the URL's 220 impressions across 17 rows** (GSC query×page export, 2026-09-07):

```
חברה לעיצוב אתרים   36 impr @ 83.7      שירותי עיצוב אתרים   11 @ 86.5
עיצוב ובניית אתרים  35 @ 73.4           שירותי עיצוב אינטרנט  7 @ 88.9
תכנות ועיצוב אתרים  17 @ 63.3           חברת עיצוב אתרים      6 @ 91.7
בנייה ועיצוב אתרים  15 @ 69.1           מעצבת אתרים           5 @ 82.2
שירותי בניית אתרים  49 @ 73.7
```
**≈181 impressions/89d of Money intent, 0 clicks, all landing on a URL that 308s.**
`/services/brochure`, meanwhile, has **zero rows in either GSC export** — no position at all,
because Google has never fetched it.

**The differentiation contract (testable — if it cannot be met, do not restore the page):**

| | `/services/web-development` | `/services/brochure` |
|---|---|---|
| Page type | The **vendor** page: who we are, how we work, what it costs | The **product** page: the אתר תדמית deliverable |
| Head noun | `עיצוב ובניית אתרים` | `אתר תדמית` |
| Owns any query containing | `עיצוב` (without `תדמית`), `חברה ל…`, `שירותי…`, `תכנות` | `תדמית` — **every** query with this token, no exceptions |
| Price treatment | Price *bands* + a link to `/blog/website-cost-israel-2026` | A real `pricing.plans` block with tiers |
| FAQ | Vendor-selection questions | Deliverable/scope questions |
| Shared sentences | **zero.** The duplicated lede must be rewritten on both | |

**Pair B — `seo` × `marketing`. This one is already live and already costing.**
`/services/marketing`'s `metaTitle` is literally **`קידום אתרים אורגני וקמפיינים ממומנים`** —
it claims organic SEO in the title while its 622 served words are entirely about paid campaigns
(measured 2026-09-07). That is why `/services/seo` was retired *into* it, and it is why **256
impressions/89d across 19 place-qualified `קידום אתרים ב<מקום>` rows** land on `/services/seo` —
which 308s into the paid-media page — **236 of the 256 at positions 84–100** (GSC query×page
export, re-summed by hand 2026-09-07; the other 20 impressions sit at 19–83).

**Contract:** `/services/seo` = organic only. `/services/marketing` = paid only. The word
`אורגני` leaves the marketing page's title on day one (§2.5). keywords-seo-organic §5 states it
plainly: mixing the paid rows into the SEO pillar "is exactly what turned `/services/seo` into a
308 to `/services/marketing`."

**Should either page not be restored?** I considered recommending that `web-development` stay a
301 into `brochure`. Against that: 181 impressions of `עיצוב`-stem demand have nowhere else to
land (`brochure` cannot credibly own `חברה לעיצוב אתרים`), and `/en/services/web-development`
declares a hreflang alternate at `/services/web-development` — if the redirect stays while
`EN_SERVICE_SLUGS` keeps `web-development`, that is **a hreflang pair pointing at a 308**
(05-bilingual §1.2). Restore it. The condition is the contract above, not the URL.

---

### 2.2 · P0-3 · **RESTORE** `/services/web-development`

| Field | Value |
|---|---|
| Slug | `/services/web-development` — restore as a real page; delete the `→ /services/brochure` redirect from `next.config.ts` **in the same commit** that adds the `servicePages` entry |
| Locale | `he` |
| Primary keyword | **עיצוב ובניית אתרים** · cluster: web build / vendor |
| Also owns | חברה לעיצוב אתרים (36 @ 83.7) · תכנות ועיצוב אתרים (17 @ 63.3) · בנייה ועיצוב אתרים (15 @ 69.1) · שירותי בניית אתרים (49 @ 73.7) · שירותי/חברת עיצוב אתרים · מעצבת אתרים · שירותי פיתוח ווב (37 impr/12mo @ 93.0) |
| Explicitly does **not** own | `בניית אתרים` bare head (**Lost** — 15–25-year-old domains ranking homepages (01-competitors §2); Aiterra has **no GSC row for the bare head at all** in 89 days, and its nearest vendor-shaped variants sit at pos 73–93) · anything containing `תדמית` · anything containing `בקוד` as a *keyword target* (in Hebrew commercial search `בקוד` resolves to open-source → WordPress; `בהתאמה אישית` is colonised the same way, its #1 result titled `בניית אתרים בהתאמה אישית \| בניית אתרים בוורדפרס`) |
| Intent → next action | **Money** → "לשיחת אפיון" |
| `metaTitle` (43) | `עיצוב ובניית אתרים — חברה לבניית אתרים בקוד` |
| Rendered `<title>` (53) | `עיצוב ובניית אתרים — חברה לבניית אתרים בקוד \| AITERRA` |
| Meta description (133) | `חברה לעיצוב ובניית אתרים בקוד: אפיון, עיצוב UX/UI ופיתוח ב-Next.js. אתר מהיר, נגיש לפי ת"י 5568 ובנוי לקידום אורגני — הקוד נשאר שלכם.` |
| H1 | `חברה לעיצוב ובניית אתרים — אפיון, עיצוב ופיתוח בצוות אחד` |
| Word count | **900–1,200**, up from the current 711 content-object words. Derived by analogy, and I am labelling the weakness: **no Hebrew competitor length was measured for this SERP — [unverified — needs a competitor page fetch].** The only measured Hebrew agency service pages in the whole research are in the maintenance pillar, where a ~800-word page outranks a ~3,000-word one. Treat 900–1,200 as sufficient and spend the budget on numbers and proof, not length |
| Schema | `Service` + `FAQPage` + `BreadcrumbList` (`ServiceJsonLd`) |
| hreflang | **`/en/services/web-development`** — reciprocal, via the existing same-slug gate (`(he)/v2/services/[slug]/page.tsx:37-40`, `EN_SERVICE_SLUGS`). Restoring this page is what makes that pair valid instead of pointing at a 308 |
| Priority | **P0** |

**H2 outline**

1. `מה זה אומר "עיצוב ובניית אתרים בצוות אחד"` ← the positioning the English tree already carries
   and the Hebrew does not: *the agency that designs it cannot build it, the developer who builds
   it cannot rank it* (`content-en.ts`). This is the one message that is genuinely Aiterra's
2. `תהליך: אפיון → עיצוב → פיתוח → השקה` (use the existing `howItWorks` block)
3. `כמה זה עולה — טווחי מחיר וממה הם מורכבים` ← **not** a `pricing.plans` block (that belongs to
   `brochure`). Bands + a link to `/blog/website-cost-israel-2026`. The market spread is
   **~100×** — `webisrael.net 490 ₪` → guides quoting `25,000–50,000+ ₪`, both read off fetched
   SERP snippets (serp-web-dev §1c) — and no incumbent explains the spread
4. `נגישות ת"י 5568 מהיום הראשון, לא כתוסף` ← the differentiated framing; the 5568 SERP is
   overlay vendors. ⚠ gated on Aiterra's own alt-text fix
5. `תיקון 13 לחוק הגנת הפרטיות — מה זה אומר לטופס באתר` → links to post #12
6. `מה לא נכנס למחיר` ← bridges to `/services/maintenance`
7. `עבודות נבחרות` ← real projects, linked to `/projects/<slug>`
8. `שאלות נפוצות` — vendor-selection questions only

**Kill list for the copy (research-backed, do not ignore):**
"אתם הבעלים של הקוד" as *the* differentiator. Every WordPress shop in Israel already runs that
line against Wix — verbatim snippet from a ranking competitor:
*"וורדפרס היא קוד פתוח, והאתר שלכם שייך לכם בלבד."* It is table stakes. Aiterra's real
differences (no plugin tax, no template, performance, no CMS attack surface, native 5568) need
different words. Keep code ownership as a *conversion* device on the page; assign it **no ranking
expectation** (the English research reached the same verdict independently: `who owns my website
code` returns an empty Suggest array).

**Links in:** `/services` hub · `/` · footer · `/blog/website-cost-israel-2026` ·
`/blog/freelancer-vs-web-agency` · `/blog/how-to-choose-digital-agency` ·
`/blog/website-building-services` · `/blog/wordpress-vs-custom-code` ·
`/blog/web-development-bat-yam` · **the 21 links, in 18 posts, currently pointing at the retired slug** —
these become live links the moment the page is restored, which is the cheapest crawl-path fix on
the site. **Links out:** `/services/brochure` (anchor `אתר תדמית`) · `/services/ecommerce` ·
`/services/maintenance` · `/blog/website-cost-israel-2026` · `/projects` · `/contact`.

---

### 2.3 · P0-4 · **REVISE** `/services/seo` — it already exists, it is not written from scratch

> **Correction, verified 2026-09-07 on a local dev server.** This brief was written as "NEW (from scratch)" on the audit's claim that `servicePages` had no `seo` key. **That claim was wrong** — `content.ts:1663` defines it with a one-space indent that defeated the audit's regex (`00-audit.md` §0.1).
>
> The page is **already written and rendering**: `localhost:3000/services/seo` → **200, 738 words**, title `קידום אתרים בגוגל (SEO) - קידום אורגני לעסקים`, H1 `קידום אתרים בגוגל…`. It is genuine organic-search copy, **not** the paid-campaign copy of `/services/marketing`.
>
> **So the work is a revision, not a build.** Against the SERP evidence below the gap is narrow and specific: (a) add the **₪ מחירון table** with `Offer`/`priceSpecification` markup — the thing this SERP actually rewards; (b) fold in the `שירותי geo` section; (c) take it toward the target length. Everything else in this brief stands. Re-scope the effort from "write a service page" to "add a price table and extend" — that is hours, not days, and it moves this item earlier in Sprint 2.
>
> Same correction applies to `/services/web-development` (§2.2): already written, **703 words**, returning 200.

| Field | Value |
|---|---|
| Slug | `/services/seo` — same slug as the English page, which keeps the existing same-slug hreflang gate correct. **This supersedes 05-bilingual §1.2**, which recommended an explicit slug map: with the HE slug literally `seo`, no map is needed, and the pair is confirmed working locally (`he-IL` + `en` + `x-default` all emitted). Simpler is better; take the simpler path |
| Locale | `he` |
| Primary keyword | **מחירון קידום אתרים** · cluster: organic SEO / vendor-shaped |
| Also owns | קידום אתרים מחיר · קידום אתרים בגוגל מחיר (Trends: relative index 70, a top-3 related query for `קידום אתרים בגוגל`) · שירותי קידום אתרים (46 @ 94.8) · חברה לקידום אתרים בגוגל (6 @ 58.3) · חברת קידום אתרים אורגני (4 @ 94.2) · ייעוץ קידום אתרים (11 @ 85.8) · בדיקת seo לאתר · קידום אתרים לעסקים קטנים · `שירותי geo` (22 @ 99.1) **as a section, not a page** |
| Explicitly does **not** own | `קידום אתרים` bare head — **Lost.** Every top-10 slot is an 11–25-year-old specialist (seoisrael "21 שנות ניסיון", simply-smart "מעל 25", danielzrihen "17+"); `danielzrihen.co.il` appears in **16 of 20** fetched SERPs; sitemap scale rankey **318 URLs**, avinu **410 URLs** against Aiterra's **70 across every pillar combined**; Aiterra has **no GSC row for the bare head** in 89 days — the nearest, `שירותי קידום אתרים`, is 46 impr @ 94.8. Also does not own `כמה עולה קידום אורגני` / `עלות…` — those belong to `/blog/seo-cost-monthly-israel`, which holds **GSC pos 29.0–42.2** on them (the 21.5 quoted in the research is the `/v2/` duplicate, not the canonical) |
| Intent → next action | **Money** → "בקשת הצעת מחיר לקידום" |
| `metaTitle` (39) | `קידום אתרים אורגני — מחירון וחבילות SEO` |
| Rendered `<title>` (49) | `קידום אתרים אורגני — מחירון וחבילות SEO \| AITERRA` |
| Meta description (132) | `שירותי קידום אתרים אורגני בגוגל ובמנועי AI: מחירון וחבילות חודשיות, מה נכלל בכל חבילה, איך נמדדת התוצאה ומי מחזיק את החשבונות בסיום.` |
| H1 | `קידום אתרים אורגני — מחירון, חבילות ומה בדיוק נכלל` |
| Word count | **1,200–1,500.** Derived, with the weakness labelled: no Hebrew competitor length was measured on the `מחירון קידום אתרים` SERP — **[unverified — needs a competitor page fetch]**. The measured analogues are English Israel-qualified SEO pages: `masamedia.co.il/seo-company-israel/` **~2,000+ words** with full NAP and ~12 named testimonials, `inter-dev.co.il/seo/` **~1,200–1,500 words** with NAP, 20+ client logos and "since 2007". Aiterra has neither testimonials nor logos, so it must win on the **published מחירון** — which `avinu` already does (SERP title: `מחירון קידום אתרים 2026 - חבילות מ-₪2,000/חודש`, with review ratings rendered) |
| Schema | `Service` + `FAQPage` + `BreadcrumbList`, plus **`offers`** for the חבילות (same `ServiceJsonLd` gap as §1.2) |
| hreflang | **`/en/services/seo`** — this finally gives the strongest page in the English tree (936 words, 96% unique) a counterpart. It currently sits outside the language cluster entirely (05-bilingual §1.2) |
| Priority | **P0** |

⚠ **This page cannot be adapted from `/services/marketing`.** That page's 622 words are
paid-campaign copy containing **no organic-search content**. It is a from-scratch write. The
English `/en/services/seo` is the best available skeleton — but translate the *structure*, not
the sentences; the English tree was written, not translated, and has a different taxonomy.

**H2 outline**

1. `מה כולל קידום אורגני — ומה לא` (the PAA `מה כולל תהליך קידום אתרים?` appears on the head SERP)
2. `מחירון וחבילות קידום חודשיות` ← the commercial core. Vendor-shaped queries want a vendor page
   with an `Offer` table; `seoprice.co.il` is an entire domain built on this term
3. `קידום אתרים טכני` ← the PAA `מהו קידום אתרים טכני?` appears on **three separate fetched
   SERPs**. Google treats it as a core sub-topic. Links to a future technical checklist post
4. `קידום במנועי AI (GEO/AEO)` ← **a section, not a page.** `קידום אתרים במנועי ai` and
   `קידום אתרים ai` are autocomplete suggestions **6 and 7** on the pillar's biggest seed. But the
   space is already colonised: `/blog/geo-ai-search-optimization` sits at **GSC pos 88.9**, and
   danielzrihen is publishing weekly video on it. Differentiation material, not a traffic bet
5. `אזור השירות: בת ים, חולון וגוש דן` ← **the policy-clean replacement for city pages** (§4.6)
6. `איך נמדדת התוצאה — ומה מדווח כל חודש`
7. `מי מחזיק את ה-Search Console ואת הקישורים בסיום ההתקשרות` ← a genuine gap; the SEO retainer
   contract written *for the buyer*
8. `שאלות נפוצות` — seeded from the harvested PAA (`לפי מה נקבע מחיר קידום אתרים?`,
   `האם קיים מחירון קידום אתרים?`, `מה עושה חברת קידום אתרים?`, `מי הוא מקדם אתרים מומחה?`)

**Cannibalisation guard vs `/blog/seo-cost-monthly-israel`:** identical rule to §1.1 —
`מחירון`/`חבילות`/`מחיר` → this page; `כמה עולה`/`עלות` → the post. **Prerequisite:** the
`/v2/blog/seo-cost-monthly-israel` duplicate currently outranks the canonical (GSC 21.5 vs 33.0).
Fix that before writing a word.

**Links in:** `/services` hub · footer · `/blog/seo-cost-monthly-israel` · `/blog/seo-services`
(780 words, ranks for **nothing** in either export — rewrite it as the vendor-selection support
piece, do not create a new URL) · `/blog/keyword-research-guide` (690 impr/89d) ·
`/blog/geo-ai-search-optimization` · `/blog/local-seo-small-business` ·
`/blog/google-business-profile-guide` · **the 11 links, in 7 posts, currently pointing at the retired slug**.
**Links out:** `/blog/seo-cost-monthly-israel` (anchor `כמה עולה קידום אורגני`) ·
`/services/marketing` (anchor `קמפיינים ממומנים`) · `/services/maintenance` · `/contact`.

---

### 2.4 · P0-5 · **REVISE** `/services/brochure` (narrow it)

| Field | Value |
|---|---|
| Slug | unchanged. This is the site's most commercially important URL and Google has **never fetched it** |
| Locale | `he` |
| Primary keyword | **בניית אתר תדמית לעסק** · cluster: web build / product |
| Also owns | אתר תדמית לעסק · בניית אתר תדמיתי (**Trends: relative index 100** — the only related query Trends returns for `בניית אתר תדמית`, rising "עלייה חדה"; GSC has `כמה עולה בניית אתר תדמיתי` at pos 1.0 on **a single impression** — a spelling signal, not a volume signal) · עיצוב אתר תדמית · חברת בניית אתרים מומלצת |
| Explicitly does **not** own | anything on the `עיצוב` stem without `תדמית` (→ `/services/web-development`); the bare `אתר תדמית` head is a **worse** target than it looks — **3 of its top-10 autocomplete suggestions are translation lookups** (`אתר תדמית באנגלית`, `אתר תדמית תרגום`, `אתר תדמיתי תרגום לאנגלית`), i.e. zero buying intent |
| Intent → next action | **Money** → "לשיחת אפיון" + the pricing block |
| `metaTitle` (40) | `בניית אתר תדמית לעסק — מחירים וזמני הקמה` |
| Rendered `<title>` (50) | `בניית אתר תדמית לעסק — מחירים וזמני הקמה \| AITERRA` |
| Meta description (127) | `בניית אתר תדמית לעסק: כמה עמודים צריך, מה כולל התהליך, כמה זמן זה לוקח וטווחי מחיר אמיתיים — כולל נגישות ת"י 5568 מהיום הראשון.` |
| H1 | `בניית אתר תדמית לעסק — מה נכלל, כמה זמן וכמה זה עולה` |
| Word count | **900–1,100**, up from the measured **661**. Same derivation caveat as §2.2: **[unverified — needs a competitor page fetch]**. The added words are the pricing block, the timeline and the 5568 section, not padding |
| Schema | `Service` + `FAQPage` + `BreadcrumbList` + **`offers`** for the tiers |
| hreflang | **none** — `brochure` is not in `EN_SERVICE_SLUGS`, correctly (05-bilingual §1.2) |
| Priority | **P0** |

**Required changes, in order:** (1) rewrite the `lede` so it shares **no clause** with
`web-development`'s; (2) add a `pricing.plans` block (this is the page that gets one); (3) add
`כמה זמן לוקח לבנות אתר` as an H2 — autocomplete self-confirms it and returns no competing
expansions; (4) add `מה ההבדל בין אתר תדמית לדף נחיתה` as an H2 pointing at §8 —
**autocomplete returns the entire six-word string** as a suggestion; (5) get inbound links, which
is the only reason this page is invisible.

**Links in:** `/services/web-development` (anchor `אתר תדמית`) · `/services` hub · footer ·
`/blog/website-cost-israel-2026` · `/blog/business-site-vs-online-store` ·
`/blog/website-building-services` · `/blog/landing-pages-that-convert`.
**Links out:** `/services/maintenance` · `/services/ecommerce` · `/blog/website-cost-israel-2026` ·
`/projects` · `/contact`.

---

### 2.5 · P0-6 · **REVISE** `/services/marketing` (one line, today)

| Field | Value |
|---|---|
| Slug | unchanged |
| Primary keyword | **ניהול קמפיינים ממומנים בגוגל** · cluster: paid |
| Current defect | `metaTitle: 'קידום אתרים אורגני וקמפיינים ממומנים'` — the page claims organic SEO in its title and delivers **622 words of paid-campaign copy** (measured 2026-09-07). This is the live half of cannibalisation Pair B |
| `metaTitle` (34) | `ניהול קמפיינים ממומנים בגוגל ובמטא` |
| Rendered `<title>` (44) | `ניהול קמפיינים ממומנים בגוגל ובמטא \| AITERRA` |
| Meta description (131) | `ניהול קמפיינים ממומנים בגוגל וב-Meta: מחקר שוק, אפיון פלטפורמה, קריאייטיב ואופטימיזציה שוטפת עם דיווח על עלות לליד ועל החזר ההשקעה.` |
| H1 | `ניהול קמפיינים ממומנים בגוגל וב-Meta` |
| Word count | unchanged. **Do not invest here.** `ניהול קמפיינים בגוגל` is **Lost**: pure-play PPC shops with 15–19 years and Google Partner badges in their titles; boostit publishes a benchmark index built from its own **"150+ חשבונות ו-8.4 מיליון ש״ח"** of spend; Google's own properties take 2–3 slots; and **Trends puts the term at relative index 0 across the entire 12-month daily series** while `קידום אתרים` runs 8–100 |
| hreflang | none |
| Priority | **P0** — but it is a title edit, not a project |

Add one reciprocal link: `/services/seo` (anchor `קידום אורגני`), and accept the same link back.

---

## §3 — Service × vertical: the answer is almost none

The keyword research proposed five vertical service pages (lawyers, doctors/clinics, restaurants,
architects, interior designers). **I am proposing zero, and one conditional.** Two independent
tests have to pass — *demand* and *proof* — and they never pass together.

### 3.1 The demand side: Google names five verticals

`בניית אתרים ל` returns, in Google's order (my own probe, `suggestqueries.google.com`,
`hl=he&gl=il`, 2026-09-07):

```
לעסקים · לעסקים קטנים · לעורכי דין · למסעדות · לרופאים · למעצבי פנים ·
לימודים · לבד · לעסקים בחינם · לאדריכלים
```
`בניית אתרים לעורכי דין` and `בניית אתרים לרופאים` each self-confirm as their own suggestion.
So the demand is real for **lawyers, restaurants, doctors, interior designers, architects.**

### 3.2 The proof side: Aiterra's portfolio, all 12 projects

`data/portfolio-projects.json`, read in full:

| Sector | Projects | Live sites |
|---|---|---|
| **Beauty / cosmetics clinics** | קארין כהן (אקדמיה לריסים, **חולון**) · קוסמטיקס חופית (קליניקה, **חולון**) · מעיין ועקנין (קוסמטיקה קלינית, **חולון**) · אלי בן יצחק (עיצוב שיער, **בת ים**) | 4, all live |
| **E-commerce** | נאות שדה (Next.js, סליקה, **רעננה**) · ALOVA (Shopify) · Olie 6 (Shopify) · חנות דיגיטלית | 3 live + 1 without a URL |
| Real-estate marketing | רם וחיים | 1 |
| Mortgage consulting | אבי ייעוץ משכנתאות | 1 |
| SaaS product site | Sous Chef (an AI restaurant-management **platform** — not a restaurant's website) | 1 |
| Personal brand | Alexandra Patsina | 1 (no URL) |

**Lawyers: 0. Restaurants: 0. Doctors: 0. Architects: 0. Interior designers: 0.**

### 3.3 The collision — and it is decisive

The one vertical Aiterra can prove four times over is **beauty/cosmetics clinics**. It has no
Hebrew search identity. My own autocomplete probes, `hl=he&gl=il`, 2026-09-07:

```
בניית אתרים לקוסמטיקאיות   -> 0 suggestions
בניית אתר לקוסמטיקאית      -> 0
אתר לקוסמטיקאית            -> 0
בניית אתרים לקליניקות      -> 0
בניית אתר לקליניקה         -> 0
בניית אתרים למספרות        -> 0
אתר למכון יופי             -> 0
בניית אתרים לעסקי יופי     -> 0
אתר לקוסמטיקאיות           -> 2  (one of them a competitor's brand: "חוה זינגבוים אתר לקוסמטיקאיות")
```
This independently reproduces keywords-seo-organic §1.3, which found the same zero result for the
`קידום אתרים ל…` phrasing of the same three verticals.

> **The verticals Google suggests are exactly the ones Aiterra cannot prove. The vertical Aiterra
> can prove has no search identity.** A vertical page with no real project behind it is an
> unsupported claim on a domain with 32 clicks in 89 days, and the SERPs are not empty —
> `בניית אתרים לעורכי דין` already returns eight dedicated vertical pages including `lawgital`, a
> legal-vertical specialist, and `קידום אתרים לרואי חשבון` returns eight more.

**Build none of the five.** Revisit only when a named client in that sector exists and has agreed
to be a case study.

### 3.4 What to do with the beauty proof instead

It is **geographic**, not vertical: three of the four beauty clients are in **Holon**, one in
**Bat Yam**. `קוסמטיקאית בחולון` returns 7 autocomplete suggestions (my probe) — the *client's*
market has local search identity even though the *agency's* vertical phrasing does not. So the
correct home for this proof is §4's local assets and the `עבודות נבחרות` block on
`/services/brochure`, not a vertical page. **This is the single most useful reframe in this
document**: Aiterra's portfolio proof is a city, not an industry.

**One conditional exception, and it is not a vertical page:** if the owner ever commissions a
vertical page, the only defensible first one is **lawyers** — it has the strongest confirmed
demand and the softest commercial SERP in the pillar (mid-tier agencies with dedicated vertical
pages, no 25-year-old domain ranking a homepage). It is gated on a real, named, live legal client.
Until then it is not in this plan.

---

## §4 — Service × city: one revised asset, one conditional, zero new

The brief allows 4–6. **I am proposing one revised page and one conditional page.** The site's own
data will not support more, and the guardrail is not theoretical: near-duplicate pages differing
only by city name are doorway pages under Google's spam policy, and I can point at the exact
competitors running them (`avisrur.co.il`, `gothamsitestudio.com` and `webcompany.co.il` each
appear across Bat Yam, Holon, Tel Aviv and Rishon LeZion with the same URL pattern).

### 4.1 What Bat Yam vs Gush Dan actually teaches

Same template, same author, same month. Opposite outcomes:

| | `/blog/web-development-bat-yam` | `/blog/web-development-gush-dan` |
|---|---|---|
| Words | 655 | **883 — 35% longer** (both measured on the served page 2026-09-07; a second tokeniser gives 700 / 944 — the same 35% gap) |
| Title names | **one city** | **four cities** |
| Structure | why local · speed/ranking with numbers · process · **2026 price table** · **`האם אתר עסקי בבת ים חייב להיות נגיש?`** · what not to compromise on | why location matters · a four-city bucket list · cost · how to choose |
| GSC 89d | `בניית אתרים בת ים` **28 impr @ 15.6** · `קידום אתרים בבת ים` 4 @ 65.8 · `חברה להנגשת אתרים` 1 @ **21.0** | **absent from both exports. Zero rows in 12 months** |

**Three lessons, in order:**

1. **Length is not the variable.** The failing page is the longer one. Anyone proposing "write
   more city content" has read this backwards.
2. **One city per page, named in the title, or nothing.** `גוש דן` is a phrase Israelis use in
   traffic reports, not when hiring an agency — **zero `גוש דן` queries across 255 GSC rows.** The
   multi-city title matches no query precisely and dilutes four terms that each have some demand.
3. **Regulatory substance earns positions that generic city copy does not.** One accessibility H2
   is why the Bat Yam page ranks **21st for `חברה להנגשת אתרים`** — a completely different
   service — though on **1 impression/89d**, so read it as a relevance signal, not as traffic.
   That is the whole strategy in miniature, and it is the reason the *content pattern*
   is the asset, not the URL path.

### 4.2 · P1-4 · **REVISE in place** `/blog/web-development-bat-yam`

**This resolves the §6 conflict. Do not migrate this page to `/services/…`.** Full justification
in §6.

| Field | Value |
|---|---|
| Slug | **`/blog/web-development-bat-yam` — unchanged** |
| Locale | `he` |
| Primary keyword | **בניית אתרים בת ים** — `GSC: 28 impr/89d @ pos 15.6` · cluster: local |
| Also owns | קידום אתרים בבת ים (4 @ 65.8) · חברה לבניית אתרים בבת ים ([unverified]) · חברה להנגשת אתרים (1 @ 21.0 — keep the accessibility H2 that earned it) |
| Volume reality check | A full **48-probe** autocomplete expansion of `בניית אתרים בת ים` returns **zero suggestions**; my own probe today returns **zero**. The query sits below Google's suggestion threshold. GSC proves 28 real searches in 89 days, so it is **real, winnable and small.** Promote it because it costs almost nothing, **not** because it will move revenue |
| Intent → next action | **Money** → `/services/web-development` and `/contact` |
| `metaTitle` (42) | `בניית אתרים בבת ים — מחירים, תהליך ונגישות` |
| Rendered `<title>` (52) | `בניית אתרים בבת ים — מחירים, תהליך ונגישות \| AITERRA` (down from the current **74**, measured on the served page) |
| Meta description (110) | `חברה לבניית אתרים בבת ים: תהליך, טווחי מחיר 2026, חובת נגישות לעסק מקומי ותיק עבודות של לקוחות בבת ים ובחולון.` |
| H1 | `חברה לבניית אתרים בבת ים — תהליך, מחירים ונגישות` |
| Word count | **800–1,000**, up from 655. Derived: the competing non-directory results are `webcompany.co.il/service-areas/…` and `gothamsitestudio.com/he/services/web-design-bat-yam.html` — **boilerplate city pages with no local substance** (page lengths **[unverified — needs a competitor page fetch]**). The winning margin here is local specificity, not volume. Every added word must be Bat Yam-specific or it makes the page worse |
| Schema | `BlogPosting` + `FAQPage` **+ a `Service` node with `areaServed: {City: בת ים}`, referencing the existing `#organization` `@id`.** Do **not** emit a second `LocalBusiness` — `src/components/seo/OrganizationSchema.tsx:18` already types the org as `['LocalBusiness','ProfessionalService','Organization']` with the real Bat Yam address at `:36-40` (`addressLocality: 'בת ים'` at `:38`). A duplicate node splits the entity |
| hreflang | **none.** `seo bat yam` and `web development company bat yam` both return **empty Suggest arrays** in English — Bat Yam belongs in NAP and schema, never as an English keyword target |
| Priority | **P1** |

**Changes:** add a `עבודות מקומיות` H2 naming **אלי בן יצחק (בת ים)** and the three Holon clients
with live links — real local proof no competitor city page has; keep and strengthen the
accessibility H2; refresh the 2026 price table; add the `Service`+`areaServed` schema; link to
`/services/web-development`; absorb the Gush Dan content worth keeping (§4.3).
**Links in:** `/services/web-development` (a `אזור השירות` block) · `/blog` hub · `/about` ·
the 301 from `/blog/web-development-gush-dan`. **Links out:** `/services/web-development` ·
`/services/brochure` · `/blog/website-cost-israel-2026` · `/blog/website-accessibility-israel` ·
`/projects/eli-ben-yitzhak` · `/contact`.

### 4.3 · P1-5 · **RETIRE** `/blog/web-development-gush-dan` → **301** to `/blog/web-development-bat-yam`

Zero GSC rows in 12 months across both exports. Zero autocomplete. Zero Trends signal. Zero
`גוש דן` queries in 255 rows. It is structurally the closest thing on the site to a doorway page,
and removing it is a small quality signal in the right direction. Move the one genuinely reusable
section (the per-city price framing) into the Bat Yam page first. **Priority P1.**

### 4.4 · P2-1 · **CONDITIONAL** `/services/web-development/holon`

The one city page where the *proof* gate genuinely passes — and the *demand* gate does not.

| Field | Value |
|---|---|
| Slug | `/services/web-development/holon` (a child of the restored parent, not a sibling — this makes the hierarchy legible and prevents a flat city farm) |
| Locale | `he` |
| Primary keyword | **בניית אתרים בחולון** · cluster: local |
| Volume | `קידום אתרים בחולון` **GSC: 1 impr/89d @ pos 94.0**; `בניית אתרים בחולון` has **no GSC row**; autocomplete returns **zero** (my probe, 2026-09-07). **[unverified — needs Keyword Planner]** |
| Why it is allowed at all | The branding-local research set exactly one gate: *"Build it only if it can carry a named Holon client and Holon-specific substance."* Aiterra has **three** — קארין כהן, קוסמטיקס חופית, מעיין ועקנין — all in Holon, all with live sites. It also has a true adjacency claim: Bat Yam and Holon border each other. And `SERP:` Google renders a **local business pack** on `קידום אתרים חולון` that a real Bat Yam address can enter |
| Why it is P2 and conditional | Three directories plus five template city pages already hold that SERP; there is no traction to build on; and the honest cost/benefit is worse than every P0 and P1 item above it |
| Gate | Ship **only after** the Bat Yam page has been revised, schema'd, GBP-linked and directory-listed for **≥3 months**, and only if it moves. If Bat Yam — where Aiterra already ranks 15.6 — does not respond to that treatment, Holon will not either |
| Non-negotiable content rule | **≥60% of the body must be Holon-specific**: three named case studies with live links, local process detail, local accessibility obligations. If it can be produced by find-replacing "בת ים" with "חולון", it is a doorway page and must not ship |
| `metaTitle` (37) | `בניית אתרים בחולון — תיק עבודות מקומי` |
| Rendered `<title>` (47) | `בניית אתרים בחולון — תיק עבודות מקומי \| AITERRA` |
| Meta description (95) | `בניית אתרים בחולון: שלושה אתרים חיים שבנינו לעסקים בחולון, תהליך העבודה, טווחי מחיר וזמני הקמה.` |
| H1 | `בניית אתרים בחולון — שלושה עסקים מקומיים שכבר עובדים אצלנו` |
| H2 outline | 1 `שלושה אתרים שבנינו בחולון` (case-study blocks) · 2 `תהליך וזמנים` · 3 `טווחי מחיר` · 4 `נגישות לעסק בחולון` · 5 `שאלות נפוצות` |
| Word count | **700–900**, of which ≥60% Holon-specific. Competitor lengths **[unverified — needs a competitor page fetch]**; the incumbents are template pages and the differentiator is substance, not length |
| Schema | `Service` + `FAQPage` + `BreadcrumbList`, `areaServed: {City: חולון}`, `provider: {@id: …#organization}` |
| hreflang | none |
| Priority | **P2, conditional** |

### 4.5 Cities that must not get a page

| City | GSC 89d | Verdict |
|---|---|---|
| תל אביב | **0 impressions in 255 rows** | **No.** No Tel Aviv address, no Tel Aviv-specific truth. A page would be a doorway page by definition. Claim it through GBP service areas. Never invent a Tel Aviv address — that is a GBP suspension risk for zero upside |
| ראשון לציון | 0 | **No.** Three directories plus six agencies with real local depth |
| רמת גן | `קידום אתרים ברמת גן` 53 @ **92.1** | **No — the most-lost sub-cluster in the pillar.** Eight established SEO agencies each running a mature city-page tree, plus B144. Google is saying "you are the 92nd best answer", and Aiterra has not even entered the race (`/services/seo` 308s) |
| הרצליה / באר שבע / ירושלים / מודיעין / עכו / טבריה / רעננה / גליל / דרום / צפון / שרון / מרכז | **~200 impr combined** (re-summed by hand from the GSC query×page export), **0 clicks**, positions **53–100** — 81 of the 200 on `מרכז` alone | **No.** No address, no proof, no result. The one apparent exception — periphery towns at pos 19–54 (`עמק יזרעאל` 19.0, `גדרה` 21.0) — are 1–2 impression queries in places Aiterra has no presence. Positions there are a competition artefact, not an opportunity |

### 4.6 What replaces city pages

Cheaper, policy-clean, and it is form-filling rather than content work — roughly **80% of the
retrievable 12-month value in this pillar** (01-competitors §3.2; that 80% is the researcher's
judgement call, not a measurement — treat it as a ranking of effort, not a forecast):

| Action | Status | Cost | Priority |
|---|---|---|---|
| Claim + verify a **Google Business Profile**, primary category *Website designer*, service areas Bat Yam / Holon / Tel Aviv-Yafo / Rishon LeZion | Not confirmed to exist after 21+ probes | free | **P0 — week 1** |
| `d.co.il` (דפי זהב): claim **four** Bat Yam categories — website building, משרדי פרסום, גרפיקאים וסטודיו לגרפיקה, גרפיקה־עיצוב לוגו | Aiterra absent; the website-building category has **14 businesses** and ranks **slot 1** on `בניית אתרים בת ים` | **free** (verified by fetching `/LandingPage/AddBusiness/`) | **P0** |
| `b144.co.il` Bat Yam website-building category | Aiterra absent; **11 businesses** listed; the category ranks slots 7–8 | **free** (banner: `העסק שלך לא כאן? להצטרפות חינם`) | **P0** |
| A `אזור השירות` section on `/services/web-development` and `/services/seo` | — | one H2 each | P1 |
| Client review programme | Gates Midrag (average >9) and fixes `ביקורות על aiterra agency` — **18 impr @ pos 2.4, 0 clicks** | time | P1 |
| Midrag | Pay-on-success 5–10%; but its demand side is trades — autocomplete for `מידרג` returns אינסטלטור, מזגנים, חשמלאי, הובלות, הנדימן, **not one digital term** | commission | P2, after reviews |

**Do not buy `d.co.il`'s paid bundle.** It sells Google ads, content production, organic SEO and
*website building* — Aiterra would be paying דפי זהב to deliver its own product.

---

## §5 — Content clusters

Five clusters. Each has **one** pillar page and 4–8 supporting posts, every supporting post
links to the pillar with a named anchor, and every pillar links to a commercial destination.
Weighted toward maintenance and the Israeli-integration long tail, per 01-competitors §1 and §3.3.

### 5.1 Cluster A — Maintenance & ownership · **the priority cluster**

**Pillar:** `/services/maintenance` (new). **Destination:** monthly retainer — the highest-LTV
lead shape on the site.

| Supporting page | Status | Owns | Anchor into the pillar |
|---|---|---|---|
| `/blog/website-maintenance-cost-yearly` | revise | `כמה עולה תחזוקת אתר` 47 @ 19.4 · `עלות תחזוקת אתר אינטרנט` 91 @ 22.1 | `תחזוקת אתרים` |
| `/blog/website-maintenance-agreement-sla` | new | `הסכם תחזוקת אתר` [unverified] | `חוזה תחזוקה` |
| `/blog/israeli-hosting-registrar-costs` | new | `עלות אחסון אתר לשנה` 8 @ 32.2 | `תחזוקת אתרים` |
| `/blog/developer-disappeared-site-handover` | new | handover [unverified] | `אימוץ אתר קיים` |
| `/blog/website-security-guide` | link only | `אבטחת אתר` 23 @ 92.3 | `תחזוקה שוטפת` |
| `/blog/cheap-website-hidden-costs` | link only | hidden-cost long tail | `עלות תחזוקה` |
| `/blog/website-accessibility-cost-5568` | link only | `5568` 1 @ 55.0 · `הנגשת אתרים מחיר` 1 @ 63.0 | `נגישות כפריט תחזוקה` |
| `/blog/crm-israeli-invoicing-integration` | link only | `חשבונית ירוקה icount` 7 @ **12.7** — **the best non-branded position the domain holds anywhere** | `כשהאינטגרציה נשברת` |

**Cluster size: ~1,430 verified impressions/89d at positions 18–56, 0 clicks, no commercial page.**
That is 7.6× the demand of the automation cluster at page-2-to-3 positions instead of page-6-to-10.

### 5.2 Cluster B — Israeli integrations (this is where "automation" goes)

**Pillar:** `/services/development` (live, 831 words). **Destination:** integration/build project.

**The brief's steer on automation is wrong and the plan does not follow it.** Head-to-head, both
at 0 clicks over 89 days: maintenance **1,430 impressions / best position 18.4** vs automation
**187 impressions / best position 12.7** *after stripping the wrong audience*. (01-competitors §1
quotes maintenance's best position as 3.5. That row is
`make web search for the following query: "מה כוללת תחזוקת אתר שוטפת…"` — an AI research agent's
literal instruction, which 01-competitors §6 itself excludes from keyword scoring. The best
position a human query holds in the cluster is **18.4** on `תחזוקת אתר`.) And 330 of
automation's 522 raw impressions do leave the pillar (92 explicitly industrial; 238 on ambiguous
heads whose SERPs are Wikipedia, glossaries and "free no-code tools" listicles with **zero agency
service pages**). Trends is blunter: related queries for `אוטומציה` (IL) are
`אוטומציה ירוחם` **100** (a factory in Yeruham), `תיק עובד אוטומציה` 69 (payroll software),
`קורס אוטומציה` 45, `בדיקות אוטומציה` 25 (QA). **Nobody in Israel hires an agency by searching
"automation".** So this cluster targets **named Israeli tools and named regulations**, and the
word אוטומציה appears in the copy but never in a title.

| Supporting page | Status | Owns |
|---|---|---|
| `/blog/crm-israeli-invoicing-integration` | link + extend | `חשבונית ירוקה icount` 7 @ 12.7 |
| `/blog/allocation-number-api-integration` | new (§7 brief) | `מספר הקצאה api` · `חשבוניות ישראל api` — **Trends: `מספר הקצאה לחשבונית` relative index 100, flagged "עלייה חדה"** |
| `/blog/whatsapp-business-api-crm-integration` | link only | WhatsApp API long tail |
| `/blog/best-crm-small-business-israel` | link only | Monday / Fireberry / HubSpot comparison |
| `/blog/business-automation-crm-whatsapp` | link only | `אוטומציות לאתרים` 35 @ 80.1 (currently lands a 308) |
| `/blog/business-automation-12-processes` | link only | process long tail |

**Before any of them:** put `מורנינג`, iCount, ריווחית, חשבשבת, Make, Zapier, n8n and
`מספר הקצאה` onto `/services/development`, whose served HTML contains **none** of them, and
repoint the 9 links, in 7 posts, that point into the retired `/services/automation`.

### 5.3 Cluster C — What a website costs and who to buy it from

**Pillar:** `/services/web-development` (restored). **Destination:** build project.

| Supporting page | Status | Owns |
|---|---|---|
| `/blog/website-cost-israel-2026` | revise | `כמה עולה בניית אתר תדמיתי` — GSC pos 1.0 on **1 impression/89d**, so treat it as a spelling confirmation, not demand. Extend into **total first-year cost** (build + hosting + SSL + domain + accessibility + maintenance): nothing on the price SERPs computes it, and it is the natural bridge into Cluster A where the domain already ranks 18–30 |
| `/blog/privacy-amendment-13-website-forms` | new (§7 brief) | `תיקון 13 לחוק הגנת הפרטיות אתר אינטרנט` — **the only rising term in the pillar** |
| `/blog/freelancer-vs-web-agency` | link only | vendor-selection |
| `/blog/how-to-choose-digital-agency` | link only | `חברת בניית אתרים מומלצת` |
| `/blog/wordpress-vs-custom-code` | revise | must argue **"less maintenance, not none"** — see §1.3 H2-5 |
| `/blog/website-building-services` | link only | `שירותי בניית אתרים` 49 @ 73.7 |
| `/blog/web-development-bat-yam` | revise | `בניית אתרים בת ים` 28 @ 15.6 |
| `/blog/cheap-website-hidden-costs` | shared with A | — |

### 5.4 Cluster D — Organic SEO

**Pillar:** `/services/seo` (new). **Destination:** SEO retainer.

| Supporting page | Status | Owns |
|---|---|---|
| `/blog/seo-cost-monthly-israel` | revise | `כמה עולה קידום אורגני` · `קידום אורגני מחיר` — canonical at GSC pos 29.0–42.2 (the 21.5 row belongs to the `/v2/` duplicate). **Fix the `/v2/` duplicate first** |
| `/blog/seo-services` | rewrite in place | vendor-selection. 780 words and **ranks for nothing** in either export |
| `/blog/keyword-research-guide` | link only | `מחקר מילות מפתח` 203 @ 24.0; the page totals **688 impr**, of which **99 are the weblinks.co.il rank-tracker noise** the corrections tell us to strip → **≈589 real** — informational, low commercial value, but it is real traffic and must link somewhere commercial |
| `/blog/geo-ai-search-optimization` | link only | GEO — **contested, already colonised.** pos 88.9. Differentiation, not a traffic bet |
| `/blog/google-business-profile-guide` | link only | `כרטיס עסק בגוגל` 36 @ **21.5** — and it is on **page 1** of a fetched SERP. The second-best-positioned non-branded cluster on the site |
| `/blog/local-seo-small-business` | link only | `קידום אתרים לוקאלי` (note: `לוקאלי`, not `מקומי` — `קידום אתרים מקומי` returns nothing) |

**Not built:** a `/services/google-business-profile` page for `ניהול כרטיס עסק בגוגל`. It is the
one Money string in the GBP cluster, but four of the eight GBP suggestions are "how do I open
one" and Aiterra's existing post already ranks 21–23 for those. Add a "we manage it for you"
section to that post and to `/services/seo`; revisit if it earns impressions.

### 5.5 Cluster E — Israeli e-commerce

**Pillar:** `/services/ecommerce` (live, 888 words, **indexed and healthy** — Google's URL
Inspection returns *Submitted and indexed*, last crawled 2026-09-05, with exactly **one** known
referring URL: `/projects?filter=systems`). This is a relevance problem, not a technical one: the
page's live HTML contains `סליקה` **zero** times, `שופיפיי` **zero** times, `ווקומרס` **zero**
times.

| Supporting page | Status | Owns |
|---|---|---|
| `/blog/shopify-israel-clearing` | new (§7 brief) | the saturated 10-suggestion `שופיפיי סליקה` block |
| `/blog/online-store-cost-israel` | new (§7 brief) | `כמה עולה לפתוח חנות אינטרנטית` · `עלות הקמת חנות אינטרנט` 1 @ 47.0 |
| `/blog/business-site-vs-online-store` | revise | `חנות אינטרנטית` 186 @ 40.0. **The site's one genuine collision** — with `ecommerce-store-that-sells` on the same query |
| `/blog/ecommerce-store-that-sells` | **301 → `/services/ecommerce`** | 30 impressions across 9 queries, eight of nine past position 77, and it duplicates the service page's intent. Resolves the collision above |

**Head terms are Lost and are not targeted:** `חנות אינטרנטית` returns 13 of 14 homepages of
companies whose entire product *is* the keyword (Konimbo, e-shop, iStores, Wobily, Catom, WEB2,
Webshuk) plus Wix. Aiterra at 40.0.

**Owner decision required before any platform sub-page** (`/services/ecommerce/shopify`,
`/services/ecommerce/woocommerce`): *does Aiterra build and maintain Shopify and WooCommerce
stores for clients, yes or no?* Publishing platform service pages for tools the agency does not
deliver generates unqualified leads. The **guides** are unconditional either way — a neutral
builder writing about platforms it does not sell is content a SaaS vendor structurally cannot
publish. Note Aiterra does have two live Shopify projects (ALOVA, Olie 6), which argues yes.

### 5.6 The regulatory thread is not a cluster — it is the shape

ת"י 5568, תיקון 13, מספר הקצאה and Israeli invoicing recur in **every** cluster above, and that
is deliberate. It is the pattern that actually wins for this domain: the Bat Yam post ranks 21st
for `חברה להנגשת אתרים` off one regulatory H2; `crm-israeli-invoicing-integration` holds the
domain's best non-branded position at 12.7. International content structurally cannot write
מסוף סליקה, חשבונית ירוקה, מספר הקצאה or ת"י 5568. Spread it; do not silo it.

⚠ **One hard gate on all accessibility content:** 2,019 of 2,186 images sitewide ship `alt=""`
while `/accessibility-statement` claims otherwise, and Aiterra sells ת"י 5568 compliance. Fix that
before publishing a single accessibility-authority page. A competitor would find it in ten minutes.

### 5.7 Deliberately not commissioned

Real candidates, evidence-backed, but below the line in this plan. Listed so they are not
rediscovered as "gaps": `/blog/technical-seo-checklist-israel` · `/blog/seo-vs-ppc-israel` ·
`/blog/seo-retainer-contract-israel` · `/blog/accessibility-widget-seo-impact` (Aiterra runs
Sienna and has first-party LCP/INP data nobody else has — genuinely differentiated, and the
strongest of the six) · `/blog/website-maintenance-without-wordpress` ·
`/blog/brochure-site-vs-landing-page` · `/blog/monday-green-invoice-integration` ·
`/blog/icount-shopify-integration`. Promote from this list only when a P0/P1 item ships.

---

## §6 — Resolving the `בניית אתרים בת ים` conflict

Two pillar researchers assigned this query two different targets:

- **serp-branding-local §3.1:** *"this should stop being a `/blog/` URL… Promote it to a proper
  local service page."* The keyword CSV encodes this as `NEW: /services/web-development-bat-yam`.
- **keywords-branding-local §5.5:** *"Add local schema + a 'how to open one' H2 to two existing
  posts, **not new pages**: `web-development-bat-yam` (pos 15.6)."*

**Decision: keep `/blog/web-development-bat-yam`. No new page, no migration, no redirect.**

**Why:**

1. **The asset being risked is the best one in the pillar.** `GSC: 28 impr/89d @ pos 15.6` is the
   only proven top-20 commercial position in the entire web-dev pillar. A URL migration on a
   domain with 32 clicks in 89 days and a *five-day-old* self-inflicted slug migration
   (commit `ff0f498`, which severed 51 of 51 blog→service links) is exactly the kind of move that
   just moved **1,220–1,617 impressions — 21–31% of the site's total — onto URLs that now 308**
   into pages Google has barely or never crawled (00-audit §2 P0-1). Impressions have not fallen;
   they are landing on redirects that cannot convert. That is the risk being avoided here.
2. **`/blog/` is not a ranking factor.** Google ranks pages, not path segments. The stated reason
   for moving — "a guide about hiring an agency shouldn't sit on a blog path" — is a taxonomy
   preference, not a ranking mechanism. Nothing in the fetched SERP shows path-based
   discrimination: the #1 result is a directory *category* page and #5 is a content-farm magazine
   article.
3. **The upside is capped and measured.** A full 48-probe autocomplete expansion returns **zero
   suggestions** (reproduced by me today). The query is below Google's suggestion threshold.
   Whatever upside sits between pos 15.6 and the top 3 on 28 impressions/89d is worth buying
   cheaply — it is not worth risking the only position the pillar has. **No forecast is offered
   here; the absolute pool is [unverified — needs Keyword Planner].**
4. **What is actually missing is not a path.** It is: `Service`+`areaServed` schema, a GBP,
   listings in the two free directories on that SERP (`d.co.il` holds slot 1, above the page; `b144.co.il` holds 7–8), and an inbound link from a live
   service page. All four are available **without** touching the URL, and three of them are the
   things that would move it.
5. **The content pattern is the asset.** The page wins because it has a 2026 price table and a
   regulatory H2 — the same H2 that earned pos 21.0 on `חברה להנגשת אתרים` (on **1 impression**:
   a relevance signal, not traffic). Its longer sibling with neither earns nothing. Moving the URL
   changes none of that.

**Re-evaluation trigger, written down so this is a decision and not an avoidance:** if, six months
after the revision in §4.2 plus GBP verification plus the two directory listings, the page has not
moved into the top 8, then test a `/services/web-development/bat-yam` page — and even then only
with genuinely local substance, and with the post kept and 301'd into it, not deleted.

---

## §7 — Three more P1/P2 briefs

### 7.1 · P1-6 · **NEW** `/blog/privacy-amendment-13-website-forms`

| Field | Value |
|---|---|
| Slug | `/blog/privacy-amendment-13-website-forms` |
| Locale | `he` · Primary keyword **תיקון 13 לחוק הגנת הפרטיות אתר אינטרנט** · cluster: web build (C) |
| Volume | **Trends: relative index 68 / 52 / 30 in the three most recent weekly buckets (geo IL) — the only *rising* term in the pillar**, while `אתר תדמית`, `תחזוקת אתר`, `הנגשת אתרים` and `בניית אתרים לעסקים` sit at 0–13 in the same weeks. Autocomplete returns `תיקון 13 אתר אינטרנט`, `תיקון 13 אתרים`, `תיקון 13 לחוק הגנת הפרטיות אתר אינטרנט` and `…אתרי אינטרנט`. Note `תיקון 13 טופס` returns **nothing** — the form framing must live *inside* a site-level page, never as its own target |
| Intent → next action | **Informational → Money.** Every reader has a form on a site somebody built → `/services/web-development` |
| `metaTitle` (37) | `תיקון 13 והטפסים באתר — מה חובה לשנות` |
| Rendered `<title>` (47) | `תיקון 13 והטפסים באתר — מה חובה לשנות \| AITERRA` |
| Meta description (119) | `תיקון 13 לחוק הגנת הפרטיות באתר: מה חייב להשתנות בטופס יצירת הקשר, איך מתעדים הסכמה, ומה קורה כשהליד עובר ל-CRM חיצוני.` |
| H1 | `תיקון 13 לחוק הגנת הפרטיות — מה זה אומר לטופס באתר שלכם` |
| Word count | **1,200–1,500.** Derived: the SERP is **nine explainers, every one of them "what is the law"** (ziko, lin, digita, web-a, osnatew, rightwave, stgltd, webshuk, asael.digital) — **nobody ships the engineering artefact.** Lengths **[unverified — needs a competitor page fetch]**. The winning margin is the markup and the logging, not the legal recap |
| Schema | `BlogPosting` + `FAQPage` · hreflang **none** · Priority **P1** |

**H2 outline:** 1 `על מי זה חל — כולל עוסק פטור עם טופס אחד` · 2 `מה חייב להופיע ליד הטופס` ·
3 `הסכמה: מה זה checkbox תקין ואיך מתעדים אותה` · 4 `מה ה-POST של הטופס חייב לשמור` ·
5 `כשהליד עובר ל-CRM או ל-webhook חיצוני` · 6 `הצהרת פרטיות לאתר תדמית — מה חייב להיות בה` ·
7 `שאלות נפוצות`.
⚠ **Do not republish the "50 ₪ per user" fine figure**, or the "up to 50,000 ₪ without proof of
damage" accessibility figure. Both are competitor **SERP snippet claims**, not verified statute.
Check the source text first — it is precisely the kind of number a competitor would audit.
**Links in:** `/services/web-development` · `/services/brochure` ·
`/blog/website-accessibility-israel` · `/blog/ga4-pixel-conversion-tracking-guide`.
**Links out:** `/services/web-development` · `/services/maintenance` · `/contact`.

### 7.2 · P1-7 · **NEW** `/blog/shopify-israel-clearing`

| Field | Value |
|---|---|
| Slug | `/blog/shopify-israel-clearing` |
| Locale | `he` · Primary keyword **חיבור סליקה שופיפיי** · cluster: e-commerce (E) |
| Volume | The **densest demand signal found in any pillar**: seed `שופיפיי סליקה` returns a **full 10-suggestion block** (Google's maximum) — `חיבור סליקה שופיפיי`, `סליקה שופיפיי ישראל`, `חברת/חברות סליקה שופיפיי`, `מערכת סליקה שופיפיי`, `ישראכרט סליקה שופיפיי`, `icount סליקה שופיפיי`, `grow סליקה שופיפיי`, `shopify סליקה`. 40 of 42 candidates self-confirmed. `חנות אינטרנטית ישראכרט` is confirmed by **both Google and Bing** — the only two-engine term in the pillar. GSC: **0 rows**. Absolute **[unverified — needs Keyword Planner]** |
| Trends caveat | `מניית שופיפיי` sits at relative index **99** among `שופיפיי` related queries — nearly half of Hebrew interest in the word is people tracking the **stock**. Never size this cluster from the bare term |
| Intent → next action | **Money** → `/services/ecommerce` |
| `metaTitle` (45) | `סליקה בשופיפיי בישראל — חיבור, עמלות וחשבונית` |
| Rendered `<title>` (55) | `סליקה בשופיפיי בישראל — חיבור, עמלות וחשבונית \| AITERRA` |
| Meta description (123) | `חיבור סליקה לשופיפיי בישראל: אילו חברות סליקה עובדות, מה העמלות, ואיך מוציאים חשבונית ירוקה או iCount אוטומטית על כל הזמנה.` |
| H1 | `חיבור סליקה לשופיפיי בישראל — מי עובד, כמה זה עולה ומה נשבר` |
| Word count | **1,400–1,800.** Derived: the Israeli-integration SERPs are held by agencies Aiterra's size or smaller (codix.co, easypress.co.il, netw.co.il on סליקה; convo-agency.co.il, sogo.co.il on שופיפיי) — page lengths **[unverified — needs a competitor page fetch]**. The length is driven by the **matrix**: gateway × platform × invoicing, which is the artefact nobody has |
| Schema | `BlogPosting` + `FAQPage` · hreflang **none** · Priority **P1** |

**H2 outline:** 1 `אילו חברות סליקה ישראליות עובדות עם שופיפיי` (Tranzila / Cardcom / PayPlus /
PeleCard / iCredit / Hyp / ישראכרט / Grow) · 2 `עמלות ועלויות חודשיות — טבלה` ·
3 `חשבונית אוטומטית: חשבונית ירוקה (מורנינג) ו-iCount` · 4 `מה נשבר בעדכון ומה עולה לתקן` ·
5 `שופיפיי מול ווקומרס בישראל` · 6 `שאלות נפוצות`.
**Vocabulary note that is itself a finding:** the Hebrew transliterations **`שופיפיי`** and
**`ווקומרס`** — how Israelis actually type these names — **appear nowhere on the site**, and
**`מורנינג` in Hebrew is absent from the entire site** (only the Latin "Morning" is used). Fix
that in this post and on `/services/ecommerce`.
**Links in:** `/services/ecommerce` · `/blog/business-site-vs-online-store` ·
`/blog/crm-israeli-invoicing-integration` · `/projects/alova` · `/projects/olie-6`.
**Links out:** `/services/ecommerce` · `/blog/online-store-cost-israel` ·
`/blog/crm-israeli-invoicing-integration` · `/contact`.

### 7.3 · P2-2 · **NEW** `/blog/allocation-number-api-integration` and `/blog/online-store-cost-israel`

Both briefed compactly; both are cluster fillers, not headline pages.

| Field | `allocation-number-api-integration` | `online-store-cost-israel` |
|---|---|---|
| Locale | he | he |
| Primary keyword | **מספר הקצאה api** | **כמה עולה לפתוח חנות אינטרנטית** |
| Cluster | B — Israeli integrations | E — e-commerce |
| Volume | Autocomplete returns `מספר הקצאה api` and `רשות המיסים מספר הקצאה api`; **Trends: `מספר הקצאה לחשבונית` relative index 100, `חשבוניות ישראל מספר הקצאה` 70, both flagged "עלייה חדה"**. GSC: 0 rows | Autocomplete self-confirms; `עלות הקמת חנות אינטרנט` **GSC: 1 impr/89d @ pos 47.0** — the best-positioned build-intent query in the pillar. Every other build query sits at **77–98** |
| Intent → next action | Money → `/services/development` | Money → `/services/ecommerce` |
| `metaTitle` (39 / 41) | `מספר הקצאה ו-API חשבוניות ישראל — מדריך` | `כמה עולה להקים חנות אינטרנטית בישראל 2026` |
| Rendered `<title>` (49 / 51) | `מספר הקצאה ו-API חשבוניות ישראל — מדריך \| AITERRA` | `כמה עולה להקים חנות אינטרנטית בישראל 2026 \| AITERRA` |
| Meta description (122 / 126) | `מספר הקצאה וחשבוניות ישראל מצד המפתח: איך מחברים את ה-API, מה נשבר בחיבור ל-Morning, iCount וריווחית, ומאיזה סכום זה חובה.` | `כמה עולה להקים חנות אינטרנטית בישראל: מחיר הבנייה, מסוף סליקה ועמלות, חשבונית, משלוחים ותחזוקה חודשית — כל העלות בשנה הראשונה.` |
| H1 | `מספר הקצאה וחשבוניות ישראל — המדריך מצד המפתח` | `כמה עולה להקים חנות אינטרנטית בישראל — כל העלות בשנה הראשונה` |
| H2 outline | 1 `מה זה מספר הקצאה ומאיזה סכום` · 2 `חשבוניות ישראל: ה-API בפועל` · 3 `Morning / iCount / ריווחית — מה כל אחד דורש` · 4 `מה נשבר ואיך מנטרים` · 5 `שאלות נפוצות` | 1 `מחיר הבנייה — טווחים אמיתיים` · 2 `מסוף סליקה: הקמה, חודשי ועמלה` · 3 `חשבונית וחיבור להנהלת חשבונות` · 4 `משלוחים` · 5 `תחזוקה חודשית` · 6 `סה"כ שנה ראשונה` · 7 `שאלות נפוצות` |
| Word count | **1,000–1,300** — the incumbents are **vendor documentation only** (greeninvoice `/api-docs/`, icount `/features/api/`); no agency has written the integration guide. Lengths **[unverified]** | **1,300–1,600** — derived from the maintenance pillar's measured cost pages, the closest analogue: `itayost` ~2,800 w with a sources block, `maimonweb` ~1,200 w ranking #1 on named local vendors. Israeli-specific cost stacks beat depth |
| Schema | `BlogPosting` + `FAQPage` | `BlogPosting` + `FAQPage` |
| hreflang | none | none |
| Priority | **P2** | **P2** |

⚠ Every threshold figure in the allocation-number post must be checked against **רשות המסים**
directly. What the research observed was a vendor's claim on a SERP.

---

## §8 — The `/landing` defect

**What is live:** a second, unrelated Next.js app answers `https://www.aiterra.co.il/landing` with
**HTTP 200** and the title `דפי נחיתה שהופכים קליקים ממומנים לשיחות | Aiterra`. It canonicalises
to the homepage and swallows `/landings/*`. Meanwhile `/landings/ecomerce/` **308s into a 404**,
which killed the URL that held `חנות איקומרס` (5 impr @ 52.2) and `חנויות איקומרס` (3 @ 61.0).

**Correction:**

1. **P0 (hygiene):** remove the second app from the routing surface. A 200-status page that
   canonicalises to a different URL, on a domain where Google has never crawled the most important
   service page, is spending crawl budget on a contradiction.
2. **P0:** `301 /landings/ecomerce → /services/ecommerce`. Do not leave a redirect chain that ends
   in a 404.
3. **P2 (opportunity):** `301 /landing → /services/landing-pages`, a real page in the main app.

**Why the third item is worth doing, and why it is only P2.** The defect is sitting on top of a
genuine asset: **four of Aiterra's twelve projects are tagged `דף נחיתה`** (קארין כהן, קוסמטיקס
חופית, מעיין ועקנין, אלי בן יצחק), all with live sites — the strongest single-format proof in the
portfolio. And the sub-cluster is autocomplete-live (my probes, `hl=he&gl=il`, 2026-09-07):
`דף נחיתה מחיר` → 5 suggestions (`בניית דף נחיתה מחיר`, `עיצוב דף נחיתה מחיר`,
`דף נחיתה לעסק מחיר`); `דף נחיתה עם סליקה` → 3 (`דף נחיתה עם סליקה מחיר`,
`הקמת דף נחיתה עם סליקה`). The `דף נחיתה עם סליקה` SERP is owned by **payment processors**
(tranzila ×2, greeninvoice, creditguard, hyp) — not agencies. But GSC records **zero `דף נחיתה`
impressions for this domain in 89 days**, and the head term is DIY-polluted (5 of 10 suggestions
are `בחינם`, `בקנבה`, `ai`, `בחינם wix`, `לדוגמא`). Real, small, unproven for this domain: **P2.**

### P2-3 · **NEW** `/services/landing-pages`

| Field | Value |
|---|---|
| Slug | `/services/landing-pages` · Locale `he` · Primary keyword **בניית דף נחיתה** · cluster: web build (C) |
| Also owns | `דף נחיתה עם סליקה` · `דף נחיתה מחיר` · `דף נחיתה לעסק` — all autocomplete-verified, all **[unverified — needs Keyword Planner]** for volume |
| Intent → next action | **Money** → "לשיחת אפיון דף נחיתה" |
| `metaTitle` (39) | `בניית דף נחיתה עם סליקה — מחירים ותהליך` |
| Rendered `<title>` (49) | `בניית דף נחיתה עם סליקה — מחירים ותהליך \| AITERRA` |
| Meta description (107) | `בניית דף נחיתה שממיר, כולל סליקה וטופס לידים מחובר ל-CRM: מה נכנס לדף, כמה זמן זה לוקח וטווחי מחיר אמיתיים.` |
| H1 | `בניית דף נחיתה שממיר — כולל סליקה וחיבור ל-CRM` |
| H2 outline | 1 `מה נכנס לדף נחיתה שממיר` · 2 `דף נחיתה עם סליקה — איך זה עובד בישראל` · 3 `הטופס, ה-CRM ותיקון 13` · 4 `מחירים וזמני הקמה` · 5 `ארבעה דפים שבנינו` (the four real projects) · 6 `דף נחיתה מול אתר תדמית` · 7 `שאלות נפוצות` |
| Word count | **800–1,000.** Derived: the SERP is payment-processor and SaaS content, not agency service pages — there is no agency benchmark to match. Lengths **[unverified — needs a competitor page fetch]** |
| Schema | `Service` + `FAQPage` + `BreadcrumbList` + `offers` · hreflang **none** (`landing page israel` returns an **empty** English Suggest array) |
| Differentiation vs `/services/brochure` | Hebrew separates them cleanly: `אתר תדמית` = multi-page site; `דף נחיתה` = single-page campaign asset with סליקה and a form. Neither page may use the other's head noun in its title or H1 |
| Priority | **P2** |

---

## §9 — The English set (P1)

**Scope is binding: 8 pages + 3 legal. No `/en/blog`. No new English pages beyond these.**
Nothing here is a content programme; it is a set of title, H1 and copy edits.

**The one finding that drives all of it:** Google itself rewrites *"website development israel"*
into *"website design israel"*. The **design** SERP is **4 of 7 agency-owned**
(lemonstudio.co.il/eng, navoto, web-design.co.il, volle.co.il); the **development** SERP is
**0 of 8** — six directories, one offshore vendor, one listicle. `web development company israel`
returns an **empty Suggest array** and **Trends: relative index 0 in every one of ~250
datapoints**. That is what the current EN homepage title targets. **Change the noun.**

The second finding: `grep -niE "israel|tel aviv|bat yam"` across `content-en.ts`,
`content-en-services.ts` and all of `src/app/(en)/` returns **zero hits in user-facing copy**.
3,607 anonymous words competing globally will rank nowhere; the same words competing for
*Israel-qualified* phrases plausibly place, and it costs nothing.

| # | URL | Rendered `<title>` (chars) | H1 | Meta description (chars) | Priority |
|---|---|---|---|---|---|
| 1 | `/en` | `Web Design & SEO Agency in Israel \| AITERRA` (43) | `Custom web design, development and SEO — in Israel` | `An Israeli web design, development and SEO agency. Custom-coded sites, no templates, full code ownership on handover. Based in Bat Yam, Israel.` (143) | P1 |
| 2 | `/en/services/seo` | `SEO Services in Israel - Organic Growth \| AITERRA` (49) | `SEO services in Israel` | `Organic SEO for Israeli businesses: Hebrew and English search, technical fixes, content and reporting - run by the team that builds the site.` (141) | **P1 — highest EN priority** |
| 3 | `/en/services/web-development` | `Web Design & Development Company in Israel \| AITERRA` (52) | `Web design and development company in Israel` | `Web design and development company in Israel. Custom-coded Next.js sites: fast, accessible to IS 5568, RTL-native, and yours to keep.` (133) | P1 |
| 4 | `/en/services/development` | `Custom Software Development in Israel \| AITERRA` (47) | `Custom platforms and internal tools, built in Israel` | `Custom software, internal tools and integrations for Israeli teams: CRM, portals, invoicing and payment APIs, built and maintained in code.` (139) | P1 |
| 5 | `/en/about` | `About Aiterra - Web & SEO Agency, Israel \| AITERRA` (50) | `An engineering-led web and SEO agency in Bat Yam, Israel` | `Aiterra is an engineering-led web and SEO agency in Bat Yam, Israel. One team designs it, builds it and ranks it - then hands over the code.` (140) | P1 |
| 6 | `/en/contact` | `Contact Aiterra - Bat Yam, Israel \| AITERRA` (43) | `Contact us` | `Talk to Aiterra in Bat Yam, Israel: Ha-Rav Nisanbaum St 37, 052-678-0739, info@aiterra.co.il. We work in English and Hebrew.` (124) | P1 |
| 7 | `/en/services` | `Web, SEO and Platform Services in Israel \| AITERRA` (50) | `What we do, in Israel` | `Three services, one team in Israel: web design and development, organic SEO, and custom platforms. Which one you need, and what each includes.` (142) | **P1 — gated** |
| 8 | `/en/projects` | `Client Work - Israeli Brands We Build For \| AITERRA` (51) | `Selected work for Israeli brands` | `Selected work for Israeli brands - Olie 6, Neot Sade, ALOVA, Hofit Cosmetics, Karin Cohen. What we built, the stack, and the outcome.` (133) | **P1 — gated** |
| 9–11 | `/en/accessibility-statement`, `/en/privacy-policy`, `/en/terms-of-use` | `Accessibility Statement \| AITERRA` (33), `Privacy Policy \| AITERRA` (24), `Terms of Use \| AITERRA` (22) | as titled | reuse the Hebrew content, translated | P1 |

**Per-page notes**

- **#1 `/en`** — 1,505 words, only 442 unique. Its primary English job is **entity
  disambiguation**, not ranking: `aiterra` in English autocompletes to a tyre brand, "Aiterra
  Technologies Ltd" and "Aiterra GmbH". `AiTerra` + `Israel` + `agency` must co-occur in title,
  H1 and `Organization` schema or Google keeps serving the tyre company. Secondary target:
  `digital agency israel` — the agency-Israel family is alive where the web-development-Israel
  family is dead.
- **#2 `/en/services/seo`** — 936 words, **96% unique, the strongest page in the tree**, and it
  currently has **no hreflang counterpart at all**. Building HE `/services/seo` (§2.3) fixes that
  through the existing same-slug gate. `seo services israel` is the single most enterable
  Israel-qualified English SERP found: **4 of 5 results are single-vendor pages**. Benchmark is
  brutal though — masamedia is ~2,000+ words with full NAP and ~12 named testimonials; inter-dev
  is ~1,200–1,500 with NAP, 20+ client logos and "since 2007". Aiterra has 936 words, **zero
  geography, zero logos, zero testimonials, zero NAP.** Adding NAP and geography is the cheap 80%.
- **#3** — add one H2 on **`hebrew website design`** / RTL. It is the only genuinely uncontested
  Israel-adjacent English SERP (a Fiverr gig, Medium, ConveyThis, Weglot, a theme shop), and
  Aiterra's audited RTL engineering (~280 logical properties against ~10 physical, every physical
  one a deliberate LTR island) is a real, provable differentiator. **One H2, not a page** — the
  volume is correspondingly tiny.
- **#4** — keep for topical support and conversion; assign it **no ranking expectation**.
  `software development company in israel` is directory-locked and its vendor slots go to
  1,500-engineer offshore houses.
- **#7 gate:** 647 of its 907 words are **the same 10-question FAQ block already on `/en`**, and
  both emit a `FAQPage` with identical Q&A. Replace the FAQ with a "which of the three do you
  need" comparison block — that is the actual job of a services hub.
- **#8 gate:** 71 unique words, no `/en/projects/[slug]` route, all 10 cards link **out** to
  client domains, and it renders a **Hebrew footer** (`(en)/en/projects/page.tsx:57` passes no
  `locale`). Add ~40 words of English case context per project and point card CTAs on-site — **or
  cut the page** and remove "Work" from the EN nav. A nav-linked dead end that exports all its
  equity is worse than no page. The Israeli client names are also the tree's only latent
  geographic signal and are currently unexplained to an English reader.
- **Three one-line leaks to fix with the titles:** `<Footer locale="en">`, the logo `href="/"`
  hardcoded to the Hebrew homepage on all 8 EN pages, and the Hebrew `Organization` JSON-LD
  (parameterise by locale, **keep the same `@id`** so it stays one entity).
- **`x-default` → Hebrew** (`src/lib/metadata.ts:64`). Israel is ~5,739 of ~5,800 impressions.
  This is **not a live defect**: PROD emits `he-IL` + `x-default` both pointing at Hebrew, because
  `/en` is not deployed. The English-pointing `x-default` exists only in the uncommitted tree and
  fires the day English ships (00-audit §3, 05-bilingual §1.1). Fix it before that deploy, not after.

---

## §10 — What to pull from Keyword Planner (the exact list)

Ship with the `[unverified]` markers; this is the list that removes them. Israeli Hebrew,
geo Israel, 12-month average, exact-match where available. Grouped by decision it unblocks.

**Unblocks §1 (does the maintenance pillar deserve P0 budget?)** — the one that matters most,
because Trends returns 0 in 155 of 157 weekly buckets and impressions are a floor, not a volume:
`תחזוקת אתר` · `תחזוקת אתרים` · `תחזוקת אתר אינטרנט` · `אחזקת אתר אינטרנט` · `אחזקת אתר` ·
`תחזוקת אתר מחיר` · `תחזוקת אתרים מחיר` · `תחזוקת אתר אינטרנט מחיר` · `כמה עולה תחזוקת אתר` ·
`עלות תחזוקת אתר אינטרנט` · `עלות אחזקת אתר אינטרנט` · `כמה עולה להחזיק אתר` ·
`חברת תחזוקת אתרים` · `הסכם תחזוקת אתר` · `מחירון תחזוקת אתר` · `חבילת תחזוקה חודשית לאתר` ·
`תחזוקת אתר וורדפרס`

**Unblocks §2.2/§2.4 (restore or merge):** `עיצוב ובניית אתרים` · `חברה לעיצוב אתרים` ·
`שירותי בניית אתרים` · `תכנות ועיצוב אתרים` · `אתר תדמית לעסק` · `בניית אתר תדמית לעסק` ·
`בניית אתר תדמיתי` · `עיצוב אתר תדמית` · `חברת בניית אתרים מומלצת` · `כמה זמן לוקח לבנות אתר`

**Unblocks §2.3 (SEO page scope):** `מחירון קידום אתרים` · `קידום אתרים מחיר` ·
`קידום אתרים בגוגל מחיר` · `חבילות קידום אתרים` *(note: my probe returns **zero** autocomplete
for this one — verify before targeting)* · `שירותי קידום אתרים` · `בדיקת seo לאתר` ·
`קידום אתרים טכני` · `ייעוץ קידום אתרים` · `קידום אתרים לעסקים קטנים` · `קידום אתרים לוקאלי`

**Unblocks §4 (city ceiling):** `בניית אתרים בת ים` · `חברה לבניית אתרים בבת ים` ·
`קידום אתרים בבת ים` · `בניית אתרים בחולון` · `קידום אתרים בחולון`

**Unblocks §5.5 / §7.2 (e-commerce long tail):** `חיבור סליקה שופיפיי` · `סליקה שופיפיי ישראל` ·
`חברות סליקה שופיפיי` · `ישראכרט סליקה שופיפיי` · `חשבונית ירוקה שופיפיי` · `icount סליקה שופיפיי` ·
`בניית אתר שופיפיי` · `בניית אתר שופיפיי מחיר` · `סליקה ווקומרס` · `בניית אתר ווקומרס` ·
`מעבר וורדפרס לשופיפיי` · `כמה עולה לפתוח חנות אינטרנטית` · `הקמת חנות אינטרנטית מחיר` ·
`חנות אינטרנטית ישראכרט`

**Unblocks §5.2 / §7.3 (integrations):** `מספר הקצאה api` · `חשבוניות ישראל api` ·
`מספר הקצאה לחשבונית` · `מאנדיי חשבונית ירוקה` · `חיבור icount לשופיפיי` · `בוט וואטסאפ מחיר`

**Unblocks §8 (landing pages):** `בניית דף נחיתה` · `דף נחיתה מחיר` · `בניית דף נחיתה מחיר` ·
`עיצוב דף נחיתה מחיר` · `דף נחיתה עם סליקה` · `הקמת דף נחיתה עם סליקה` · `דף נחיתה לעסק מחיר`

**Unblocks §7.1 (the only rising term):** `תיקון 13 לחוק הגנת הפרטיות אתר אינטרנט` ·
`תיקון 13 אתרים` · `הנגשת אתרים מחיר` · `תביעות נגישות אתרים`

**English (8 terms only — the shell does not justify more):** `seo services israel` ·
`seo company israel` · `seo agencies israel` · `web design israel` · `website design israel` ·
`hebrew website design` · `digital agency israel` · `web design tel aviv`

---

## §11 — Open questions the owner must answer

1. **Does Aiterra build and maintain Shopify and WooCommerce stores for clients?** Blocks the two
   platform sub-pages in §5.5. The guides ship either way. (Two live Shopify projects argue yes.)
2. **Will Aiterra publish real monthly maintenance prices?** §1.2 does not work without them. The
   market publishes ₪190–₪700/month openly; a maintenance page with no number is `/services/marketing`
   with a different noun.
3. **Will Aiterra commit to written response and fix times?** Only one competitor
   (digitalsecrets) publishes both. It is the cheapest differentiator in the pillar — and it is a
   business commitment, not a copy decision.
4. **Is `/services/automation` being restored too?** The owner approved restoring `web-development`
   and `seo` only. If automation returns, the category-head rows in Cluster B move to it —
   a page named for the query outranks a page named for something else. My recommendation: **no**,
   for the reasons in §5.2.
5. **Who owns the accessibility fix, and when?** The `alt=""` defect blocks §1.2 H2-6, §2.2 H2-4
   and the whole 5568 angle — the strongest moat in the plan.
6. **Is there a named client in Holon willing to be a case study by name?** Three Holon projects
   exist; §4.4 needs written consent to name them locally.
7. **Does a Google Business Profile already exist under another email?** 21+ probes found none.
   Creating a duplicate is worse than claiming an existing one.
8. **Legal review on two figures** before publication: the "50 ₪ per user" תיקון 13 fine and the
   "up to 50,000 ₪ without proof of damage" accessibility exposure. Both are competitor SERP
   snippet claims, not verified statute.
