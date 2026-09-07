# 01 — Competitive landscape (Phase 2)

Seven Hebrew pillars researched against the real Israeli SERP, 2026-09-07.

---

## 0. Tooling honesty — read before trusting a rank number

Every researcher was told to report what failed. They did:

| Source | Outcome |
|---|---|
| `firecrawl_search` / `firecrawl_scrape` | **HTTP 402 — account out of credits.** Unavailable all session |
| Exa MCP | Free-tier rate limit on first call |
| Google direct (curl, `gl=il&hl=he`) | 200 but a JS-only shell — 0 result links parsed. `&gbv=1` → 302 |
| DuckDuckGo / Mojeek / Startpage / Yandex / Ecosia / 8 SearxNG instances | 202 challenge, captcha, 403, or 429 |
| Bing `setlang=he` | Returned GitHub/Reddit/Zhihu, and in one case Arabic music. Unusable for Hebrew |
| `r.jina.ai` over Google | Cloudflare 403 |
| **Brave Search `country=il`** | **Worked** — real ranked Hebrew SERPs, then hard 429 |
| **WebSearch / WebFetch** | **Worked** — result sets + full competitor page reads |
| **Google autocomplete** (`suggestqueries.google.com`, `hl=iw&gl=il`) | **Worked — ~140 probes, all 200** |
| `google-trends` MCP | Partly worked; `proxy_status` reported "Working proxies: 0" for some calls |

**35 raw SERP captures are on disk** and contain genuine Israeli competitor domains. Where a rank is quoted it comes from Brave-IL or a fetched page, and is labelled — **Brave is not Google.** Every load-bearing claim is cross-checked against first-party GSC.

**Not captured, and it matters:** People Also Ask and the bottom-of-SERP related-searches block. Google's SERP is JS-gated. The substitute used was **full alphabet expansion of Google's own autocomplete endpoint** (seed + each of 22 Hebrew letters + 26 Latin letters + bare seed = 48 probes, deduped), which returns Google's complete suggestion set for a prefix and draws on the same query log. That is arguably better than PAA for this purpose, but it is a substitute and is labelled as one.

---

## 1. The headline: the brief's central steer is wrong

> The brief says: *"The automation / Israeli-integration space is the real opening… **Weight your recommendation toward this cluster** unless your own research contradicts it."*

**My research contradicts it.** Head-to-head on first-party GSC (89 days, both clusters at exactly **0 clicks**):

| | Impressions | Rows | Best position | Money page today |
|---|---|---|---|---|
| **Website maintenance** | **1,430** | 18 | **18.4** | **none — unclaimed** |
| Automation *(after stripping the wrong audience)* | **187** | 19 | 12.7 | `/services/automation` → **308** |

> **Correction, applied 2026-09-07.** An earlier draft of this table reported maintenance's best position as **3.5**. That row is `make web search for the following query: "מה כוללת תחזוקת אתר שוטפת…"` — an AI research agent's literal instruction, exactly the bot noise §6 tells you to exclude. The best **human**-query position is **18.4** on `תחזוקת אתר`. The conclusion is unchanged (18.4 is still the domain's best commercial position on a money term), but the number was contaminated and is corrected here.

**7.6× the demand, at page-2-to-3 positions instead of page-6-to-10.**

The strip-out is the substance. Of automation's 522 raw impressions, **330 (63%) leave the pillar**:
- **92 are explicitly industrial** — the SERP for `מערכת אוטומציה תעשייתית` is 5 of 5 factory-floor engineering firms. PLC and production-line buyers a web agency cannot serve.
- **238 sit on the ambiguous heads** `מערכת אוטומציה` / `מערכות אוטומציה`, whose fetched SERPs are Wikipedia, glossary entries, "free / no-code tools" listicles and industrial vendors — **zero agency service pages**. That is a DIY-and-definition audience; at position 1 the click would rarely become a lead.

Automation is **an** opening, not **the** opening. It keeps a real winnable core (below). But the budget belongs on maintenance.

**One honest caveat that cuts the other way:** Google Trends (geo IL, 12 mo) returns **0 for `תחזוקת אתרים` in 155 of 157 weekly buckets**, against `בניית אתרים` at 100. In *absolute* terms this pool is small — it sits below Trends' rounding floor. Absolute volume is **[unverified — needs Keyword Planner]** and must be pulled before anyone writes a traffic forecast. The case for maintenance is not "big market"; it is **"best positions the domain holds anywhere, on money intent, with the highest-LTV lead shape on the site (a recurring monthly contract), and nobody has claimed the page."**

---

## 2. Verdicts by pillar

| Pillar | Head terms | Winnable slice | Verdict |
|---|---|---|---|
| **Maintenance** | Contested | cost / long-tail / regulatory | **WINNABLE — first priority** |
| **Branding + Local** | Skip (see §4) | **directories + Bat Yam + GBP** | **WINNABLE this week, almost no content work** |
| **E-commerce** | **Lost** | Israeli integrations + real prices | **WINNABLE on the long tail** |
| **SEO (organic)** | **Lost** | price sub-cluster + local | **CONTESTED — price only** |
| **Automation** | Skip (wrong audience) | WhatsApp API, invoicing integrations | **CONTESTED — smaller than claimed** |
| **Web development** | **Lost** | local + regulatory + first-year cost | **CONTESTED** |
| **Paid ads** | **Lost** | מע"מ / תיקון 13 / offline conversions | **CONTESTED — poor click economics** |

### What "Lost" means, concretely

These are not close calls, and the plan should not pretend otherwise:

- **`קידום אתרים`** — every top-10 slot is an 11–25-year-old specialist domain whose entire business is ranking for this word (seoisrael "21 שנות ניסיון", simply-smart "מעל 25", danielzrihen "17+", webs "12", seo-up "18", avinu "18"). `danielzrihen.co.il` appears in **16 of 20** fetched SERPs, including as an AI-Mode citation. Sitemap scale, actually fetched: **rankey.co.il 318 URLs, avinu.co.il 410 URLs, against Aiterra's 70 across every pillar combined.** Aiterra sits at GSC pos 94.8. There is no weak article to displace — the page type is agency homepages.
- **`בניית אתרים`** — 15–25-year-old agency domains ranking homepages; Aiterra at pos 63–95. And the head term's intent is **majority Skip anyway**: Trends related queries (geo=IL) rank `בניית אתרים בחינם` at 100, `קורס בניית אתרים` 25 and `בניית אתרים לילדים` 15, above the commercial modifier `לעסקים` at **14**.
- **`חנות אינטרנטית`** — 13 of 14 results across two head SERPs are homepages of companies whose entire product *is* the keyword (Konimbo, e-shop, iStores, Wobily, Catom, WEB2, Webshuk) plus Wix and the acquirers. Aiterra at pos 40.0, from a domain with 32 clicks in 89 days.
- **`ניהול קמפיינים בגוגל`** — pure-play PPC shops with 15–19 years of history and Google Partner badges in their titles. boostit publishes a benchmark index built from **"150+ חשבונות ו-8.4 מיליון ש״ח"** of its own spend — data Aiterra cannot manufacture. Google's own properties take 2–3 slots. And Trends puts the term at **relative index 0 across the entire 12-month daily series** while `קידום אתרים` runs 8–100.

---

## 3. Where Aiterra can actually win

### 3.1 Maintenance — a build gap, not an authority gap

Google already ranks Aiterra **18.4** on `תחזוקת אתר`, **19.4** on `כמה עולה תחזוקת אתר`, **22.1** on `עלות תחזוקת אתר אינטרנט`, **22.3** on `אחזקת אתר` — off a **692-word blog post** with no service page, no inbound links from any live service page, and a CTA that 308-redirects into a brochure-building page.

The field is fragmented freelancers and 3–15-person studios. **No aggregator or vertical directory exists for this pillar** — across 60 ranked results in three fetched SERPs, the only non-first-party URL is a single YouTube video. Nothing to outrank, nothing to get listed in.

Several pages beating Aiterra are **structurally weaker**: `maimonweb` ranks #1 for `עלות תחזוקת אתר אינטרנט` on ~1,200 words dated 2024-07-08 with no FAQ; `seolinks` ranks on a 2021 page with no FAQ; `web-site.care` ranks with no price table and no FAQ. Aiterra already ships FAQPage and Article schema.

**What makes the head contested rather than open:** `digitalsecrets.co.il` advertises **100+ Google reviews at 5.0** on its #5-ranking page, against Aiterra's `sameAs: []`. And `wemanage.co.il` holds three of the top 17 on the price query — that takes more than one page to displace.

**Realistic shape, stated as a shape rather than an invented number:** top-10 on the `עלות` / `כמה עולה` / `אחזקת` cluster is achievable in 12 months. **Top-3 on `תחזוקת אתר` itself is not, without reviews and links.**

### 3.2 Directories and Bat Yam — winnable *this week*, and it is form-filling

Roughly **80% of retrievable 12-month value in the branding-local pillar is directories + GBP + Bat Yam, and almost none of it is content work.**

- **`d.co.il` (דפי זהב) and `b144.co.il` are both FREE** — verified by fetching `/LandingPage/AddBusiness/` and the Bat Yam category pages. Both Bat Yam website-building categories ranked at **slot 1–2**. Both categories are **thin: 14 and 11 businesses.** **Aiterra is in neither.** Being listed in an 11-entry category is genuinely visible.
- `d.co.il`'s Bat Yam tree carries **sibling categories** for משרדי פרסום, גרפיקאים וסטודיו לגרפיקה, and גרפיקה־עיצוב לוגו. **Claiming four free categories costs the same as claiming one.**
- **Midrag** is worth joining (pay-on-success, 5–10% commission on completed transactions only) but is **gated on client reviews above a 9 average** — blocked today by `sameAs: []`. Caveat: Midrag's *demand* side is home trades (autocomplete for מידרג returns אינסטלטור, חשמלאי, מזגנים — not one digital term). Rank it below d.co.il and b144.
- **Bat Yam:** GSC has Aiterra at **pos 15.6** on `בניית אתרים בת ים`, achieved from a `/blog/` URL with no LocalBusiness schema. Competing non-directory results are templated city pages with no local substance. `d.co.il` lists only **5** SEO providers for the whole city.

**Calibration, stated plainly because it is easy to oversell:** a full 48-probe autocomplete expansion of `בניית אתרים בת ים` returns **zero suggestions** — the query sits below Google's suggestion threshold. GSC proves 28 real searches in 89 days, so it is real, winnable and **small**. Promote it because it costs almost nothing, not because it will move revenue.

### 3.3 The Israeli-integration long tail — structurally closed to international competitors

This is the shape that actually works, and it recurs in every pillar. The evidence is on the SERPs: `codix.co`, `easypress.co.il`, `netw.co.il` rank on סליקה comparison; `junami.co.il`, `clicky.co.il` on ווקומרס; `convo-agency.co.il`, `sogo.co.il` on שופיפיי; `digi-transform.com`, `bizonmap.net` on חשבונית־ירוקה integration; `emstudio.co.il` on shipping. **Every one is an agency Aiterra's size or smaller.**

The head-term incumbents structurally cannot follow: a SaaS platform will never publish how a *competitor's* platform connects to Cardcom, and no international publisher can write about מסוף סליקה, חשבונית ירוקה, ישראכרט תשלום רשת, צ׳יטה שליחויות or ת"י 5568.

**A concrete miss:** the Hebrew transliterations **`שופיפיי`** and **`ווקומרס`** — how Israelis actually type these platform names — **appear nowhere on the site.** Also, **`מורנינג` in Hebrew is absent from the entire site**; Aiterra writes only the Latin "Morning".

---

## 4. Two findings that change what gets built

### 4.1 `מיתוג` does not mean what the plan assumes

Google autocomplete for the bare word returns: **מיתוג ליום הולדת · מיתוג לבר מצווה · מיתוג לבת מצווה · מיתוג לשבת חתן · מיתוג לחלאקה · מיתוג לאירועים · מיתוג למסיבת רווקות · מיתוג לרכב**.

In Israeli Hebrew **מיתוג overwhelmingly means personalised party and event decor.** One of twenty suggestions across two prefix seeds is corporate identity. This explains the Trends result (`מיתוג עסקי` at relative index 0–1) and hardens the branding verdict from "small pool" to **"mostly a different market."**

Corroborating: `b144`'s tree has **no מיתוג or עיצוב גרפי sub-category** at all. Branding is not a local acquisition channel.

`מיתוג דיגיטלי` (the qualified phrase) *is* worth keeping — GSC pos 16.8 off a 539-word post with only 4 H2s, against 13 interchangeable "המדריך המלא" posts with no first-party data. Cheapest single position gain in the pillar. **Value the click, not the lead.**

### 4.2 `בקוד` means WordPress — kill it as a keyword target

In Hebrew SEO usage the term is already occupied. **Targeting `בניית אתר בקוד` buys WordPress shoppers and a WordPress classification** — the opposite of the intent.

Related kill: **"you own your site" is not a differentiator.** Every WordPress shop in Israel already runs that exact line against Wix. It is table stakes, not a wedge. Aiterra's real advantages — no plugin tax, no template, performance, no CMS attack surface — need different words.

### 4.3 GEO / AI-search is already colonised

The brief hoped this was open ground. It is **contested — real, small, and already occupied.** Aiterra's `/blog/geo-ai-search-optimization` sits at pos 88.9. Keep it as differentiation and AI-answer material, not as a traffic bet.

---

## 5. Content gaps worth writing

Filtered to the pattern that actually works — **regulatory, local-integration, and real-price** — because international content structurally cannot compete there.

**Maintenance (five of seven are pages nobody in Israel has written):**
1. ת"י 5568 accessibility conformance as an **ongoing maintenance line item**, not a one-off audit
2. Israeli invoicing integrations (חשבונית ירוקה / מורנינג, iCount, ריווחית, Invoice4U) **breaking on WooCommerce and plugin updates**
3. Real named Israeli hosting and registrar economics, kept current
4. What must be in a maintenance agreement — **SLA in plain Hebrew**
5. **"The developer disappeared"** — how an owner takes ownership of their own site
6. What it costs to maintain a site that is **not** WordPress (custom / Next.js / headless)

**E-commerce:** the full Israeli recurring-cost stack (build price + מסוף סליקה setup and monthly fee + עמלת סליקה % + invoicing + shipping); a **payment-gateway × platform matrix from the builder's side** (Tranzila / Cardcom / PayPlus / PeleCard / iCredit / Hyp); ת"י 5568 applied to a **cart and checkout** specifically.

**Paid ads:** **מע"מ and the Google Ads invoice for an Israeli עוסק** (reverse charge / חיוב עצמי, עוסק פטור vs מורשה); **תיקון 13 לחוק הגנת הפרטיות applied to Meta Pixel and Customer Match**; importing offline conversions from an Israeli CRM (Fireberry / Powerlink / Priority / מורנינג).

**SEO:** what an accessibility overlay actually costs you in Google — **measured LCP/INP/TBT for EqualWeb, Nagish, Vee and Sienna**. (Aiterra runs Sienna; it has first-party data nobody else has.) Also: the Israeli SEO retainer contract written **for the buyer** — who owns the Search Console property and the backlinks at exit.

**Automation:** מספר הקצאה / חשבוניות ישראל **from the integration side**; a pair-page matrix ("connect X to Y") instead of one 727-word post covering four tools; **what happens after the automation is built** — token expiry, retries, the day the vendor changes its API.

---

## 6. Two things the SERP research found that are not keyword problems

**`ביקורות על aiterra agency` — 18 impressions in 89 days at position 2.4, zero clicks.** Eighteen people searched for reviews of Aiterra, Google put the site second, and nobody clicked — because there is no review content, `Organization.sameAs` is `[]`, and **no Google Business Profile surfaced in 21 separate probes.** This is a conversion and trust problem, not a ranking one, and it is the gate on Midrag entry.

**AI research agents are citing the site.** Queries like `make web search for the following query: …` and `"צריך אתר תדמית" -site:reddit.com -site:twitter.com …` appear in GSC at **positions 1.0–3.6** (~21 impressions). These are LLM agents' literal instructions and exclusion chains leaking into the query log. Excluded from keyword scoring — but worth knowing that **Aiterra is already being surfaced to AI research agents.** A small genuine AEO signal.

---

## 7. Directories — get listed, do not outrank

| Directory | Cost | Status | Priority |
|---|---|---|---|
| **Google Business Profile** | free | **unconfirmed after 21+ probes — assume it needs claiming** | **P0** |
| **d.co.il** (דפי זהב) | **free** (verified) | not listed; Bat Yam category has 14 businesses, ranks slot 1–2 | **P0 — claim 4 categories** |
| **b144.co.il** | **free** (verified) | not listed; Bat Yam category has 11 businesses | **P0** |
| easy.co.il | — | Bat Yam SEO listings carry 23 and 5 reviews | P1 |
| Midrag | pay-on-success 5–10% | gated on >9 review average | P1 — after reviews exist |
| webhosts.co.il, 2net.co.il, a.co.il, startpage.co.il | free | NAP/citation value only, rank for nothing | P2 |
| `wisy.co.il/directories/` | — | a curated list of ~450–600 free Israeli index sites. Use as a **source list for a one-off citation push**, not a strategy | P2 |
| youtube.com | free | the **one** non-owned platform ranking in the maintenance cluster (#10 for `עלות תחזוקת אתר אינטרנט`) | P2 — one short Hebrew explainer |

`08business.co.il` surfaced as a regional "עסקים מומלצים באזור" directory — **[unverified]**, needs a look.
