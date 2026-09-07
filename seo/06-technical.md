# 06 — Technical, local, accessibility and AI visibility (Phase 5)

**Written 2026-09-07.** Repo `3674f7c` (main) + an uncommitted working tree. Production = `https://www.aiterra.co.il`.
Every number below carries its source inline. Where no number exists, it says so.

**Read [00-audit.md](00-audit.md) and [05-bilingual-architecture.md](05-bilingual-architecture.md) first.** This document does not repeat them; it turns them into checkable actions and adds the four areas they did not cover: local, accessibility, AI surfaces, and the `/landing` app.

**The one framing that governs this whole phase:** almost nothing here is a ranking programme. Section 1 is release engineering that prevents a loss. Section 4 is a de-escalation. Section 5 is form-filling that costs nothing and is plausibly the highest-ROI item in the entire plan. Section 6 is legal exposure. Only sections 3 and 5 move rankings, and section 5 moves them on a surface the site does not currently appear on at all.

---

## 1. The `/en` pre-launch checklist

Architecture decisions live in [05-bilingual-architecture.md](05-bilingual-architecture.md) §1–§3. This is the operational sequence. **Do not reorder.** Each line is a check you can pass or fail.

### State of the tree, measured today

```
git status --porcelain -uall     193 untracked   164 deleted   13 modified
git stash list                   empty
git ls-tree -r HEAD | grep '(en)\|(he)'   0 files
```

(00-audit.md recorded 180/164/10 on the same day; the untracked count keeps climbing as `seo/*.md` planning docs land, so **do not treat it as a fixed number** — re-run the command on commit day. The shape is unchanged and the risk is unchanged: **one `git clean -fd` destroys the English site and the entire route-group migration.**)

### 1.0 — Commit, before anything else

| # | Action | Pass condition |
|---|---|---|
| 1.0.1 | Create a branch and commit **every untracked + deleted + modified file in one commit** (193/164/13 as of 2026-09-07). The `seo/*.md` planning docs are safe to include — they touch no build path. | `git status --porcelain -uall` returns empty except the exclusions in 1.0.2 |
| 1.0.2 | **Do not `git add -A` blindly.** `public/videos/` holds two untracked files totalling **42,943,688 bytes**: `footer.mp4` (4,373,912 B) and `תנפיש_את_התמונה_הזאת_שיהיה_גל 2 (2).mp4` (38,569,776 B). Both return **404 in production** (`curl -I`, 2026-09-07) — nothing references them. Add them to `.gitignore` or delete them. Git history is permanent. | `git ls-files public/videos/` lists 10 files, not 12 |
| 1.0.3 | `public/videos/v2-hero.mp4` **is** wanted in that commit — 325,683 B replacing HEAD's 4,373,912 B. See §4.2. | `git cat-file -s HEAD:public/videos/v2-hero.mp4` returns `325683` after the commit |
| 1.0.4 | Verify the commit builds. `src/app/sitemap.ts` is **tracked** and line 7 imports `EN_SERVICE_SLUGS` from **untracked** `src/lib/content-en.ts`. A partial commit produces a `main` that cannot build. | `npx next build` exits 0 on a clean checkout of the branch |
| 1.0.5 | **Second asset trap, same shape as 1.0.3.** `content.ts:138-156` and `content-en.ts:118-136` already point at `/images/about-card{1..4}.webp`; only the `.png` files are tracked and all four `.webp` are untracked (`git status --porcelain public/images/` → `?? about-card1..4.webp`). Commit the code without the images and **four images 404 on `/` and `/about`.** The four WebPs total **23,810 B** against **397,723 B** of PNG — this is §4.3's cheapest win, already done, waiting on a commit. | `git ls-files public/images/ \| grep about-card` lists 8 files; `curl -I /images/about-card1.webp` → 200 after deploy |

### 1.1 — Commit `next.config.ts` and `content.ts` together. Never split them.

> The analysis in this subsection was **partly wrong** and is corrected in the box below it.
> Read the correction before acting on the code block.

Deploying the working tree as it stands turns a working 308 into a **hard 404 on a URL carrying 502 impressions** (GSC: 502 impr/89d @ pos 88.4). Both halves verified today:

```
git show HEAD:next.config.ts        retiredServiceSlugs =
    /services/web-development -> /services/brochure
    /services/seo             -> /services/marketing      <-- present
    /services/adv, /services/automation, /services/custom

working tree next.config.ts:16-20   retiredServiceSlugs =
    /services/adv, /services/automation, /services/custom  <-- BOTH web-development AND seo deleted

HEAD          content.ts servicePages keys: ecommerce, development, brochure, marketing, branding
working tree  content.ts servicePages keys: web-development, ecommerce, development, brochure, marketing, branding
                                            ^^^^^^^^^^^^^^^ added        'seo' IS a key too -- see correction below

(he)/v2/services/[slug]/page.tsx:52   if (!service) notFound()
```

> ### ⚠ Correction — the block above is wrong, verified 2026-09-07 on a local dev server
>
> **`seo` IS a key in `servicePages`.** `content.ts:1663` defines it with a **one-space indent** (` seo: {`), which the original audit's two-space regex missed. That error went into the shared context brief, so every downstream document inherited it — including this one.
>
> Re-parsed allowing 1–2 spaces, the working tree has **7** service keys: `web-development, ecommerce, development, seo, brochure, marketing, branding`. Confirmed against the running dev server:
> ```
> localhost:3000/services/seo              200   738 words
> localhost:3000/services/web-development  200   703 words
> ```
> Both emit correct canonicals and a working `he-IL`/`en`/`x-default` hreflang pair.
>
> **HEAD is consistent** (5 keys, both redirects). **The working tree is consistent** (7 keys, neither redirect). There is no asymmetry between `seo` and `web-development` — both were deleted from the redirects *and* added as pages.
>
> **The real risk is narrower and still real:** `next.config.ts` is **tracked** and `content.ts` is **untracked**. Commit or deploy the tracked half alone and `/services/seo` has neither redirect nor page → 404 on a URL carrying 502 impressions. Same failure mode as §1.0's `sitemap.ts` → `content-en.ts`. **The fix is the atomic commit, not a content edit.**

| # | Action | Pass condition |
|---|---|---|
| 1.1.1 | **Commit `next.config.ts` and `src/app/(he)/v2/content.ts` in the same commit, always.** Nothing to build — both pages already exist. Only if you deliberately ship the config without the content, restore `{ from: '/services/seo', to: '/services/marketing' }` first. | `curl -I /services/seo` returns 200 or 308, never 404 |
| 1.1.2 | Add `export const dynamicParams = false` to `src/app/(he)/v2/services/[slug]/page.tsx`. Unknown slugs then fail at **build** time instead of silently 404ing in production. | An invented slug added to a sitemap breaks the build, not the site |

### 1.2 — Reconcile the two slug lists

`src/lib/content-en.ts:3` — `EN_SERVICE_SLUGS = ['web-development', 'seo', 'development']`.
`/en/services/web-development` currently reciprocates only by coincidence: the working tree simultaneously re-added `web-development` to `servicePages` **and** deleted its redirect. Ship one half without the other and a hreflang pair points at a 308.

| # | Action | Pass condition |
|---|---|---|
| 1.2.1 | `EN_SERVICE_SLUGS` ∩ `retiredServiceSlugs` must be **empty**. Assert it in a test or a build script, not in a comment. **Note the interaction with 1.1.1's fallback branch:** restoring the `/services/seo` redirect puts `seo` in *both* lists and the assertion fails. That is the assertion working — under the fallback, also drop `seo` from `EN_SERVICE_SLUGS` (EN tree → 7 URLs) or the English SEO page stands with a Hebrew counterpart that 308s. It emits no hreflang either way (`(en)/en/services/[slug]/page.tsx:32` gates on `servicePages[slug]`), so nothing breaks in the SERP — but ship it deliberately, not by accident. | The assertion runs in CI |
| 1.2.2 | Every slug in `EN_SERVICE_SLUGS` resolves to a Hebrew `servicePages` key. After 1.1.1 this holds for all three. | `curl -I` on all 3 HE counterparts returns 200 |
| 1.2.3 | Replace the same-slug hreflang assumption with an **explicit slug map** (05 §1.2). The HE/EN slugs will diverge the first time a Hebrew page needs a different word. | One exported map, two consumers |

### 1.3 — Root 404

There is no `src/app/not-found.tsx` (verified: the file is deleted in the working tree; only `src/app/(he)/not-found.tsx` exists, and `(en)` has none). With two root layouts each rendering their own `<html>`, a globally-unmatched URL such as `/en/blog` may have no root not-found to render.

| # | Action | Pass condition |
|---|---|---|
| 1.3.1 | Build, then request `/en/blog` and `/en/garbage`. | Both return a styled 404 with `lang="en"`, status 404, no unhandled error |
| 1.3.2 | If they do not, add `src/app/not-found.tsx` (or an `(en)/not-found.tsx`). | as above |

### 1.4 — Close the Hebrew leaks (05 §2.3, §2.4)

| # | Action | Pass condition |
|---|---|---|
| 1.4.1 | `(en)/en/projects/page.tsx:57` — pass `locale="en"` to `<Footer>`. `v2-content-server.ts:65` defaults to `'he'`. | `/en/projects` HTML contains zero Hebrew links |
| 1.4.2 | `(he)/v2/components/Header.tsx:101` — make the logo `href` locale-aware. Today the most prominent link on all 8 EN pages dumps the reader into Hebrew. | Logo on `/en/*` points at `/en` |
| 1.4.3 | Parameterise `OrganizationSchema.tsx` by locale (description, address, `areaServed`, `knowsAbout`) but **keep `@id` = `${SITE_URL}#organization`** so it stays one entity. | `/en` JSON-LD has an English description and the same `@id` |
| 1.4.4 | Add `/en/accessibility-statement`, `/en/terms-of-use`, `/en/privacy-policy` via the existing `LegalPage` component (11 URLs total). A statement the reader cannot read is not a statement. | The 3 consent/footer links on `/en/*` stay in English |
| 1.4.5 | Make `getV2ContentEn()` (`v2-content-server.ts:73-80`) log or throw on an unoverridden key, or type `contentEn` as `V2Content` rather than `Partial<V2Content>`. 10 keys still fall back to Hebrew silently. | Adding `<Reviews />` to an EN page fails loudly, not silently |

### 1.5 — Fix or cut the two weak EN pages (05 §2.1, §2.2)

| # | Action | Pass condition |
|---|---|---|
| 1.5.1 | `/en/services` — remove the 10-question FAQ that duplicates `/en` (647 of its 907 words) and replace it with a "which of the three do you need" comparison block. This also removes a **second `FAQPage` node with identical `mainEntity`** from the site. | `/en/services` unique-word share above ~60%; one FAQPage node per Q&A set sitewide |
| 1.5.2 | `/en/projects` — add ~40 words of English case context per project and point card CTAs at an on-site anchor, **or cut the page**, remove "Work" from `content-en.ts:23-29` and drop it from `sitemap.ts:69`. Do not ship it unchanged. | 252 → 500+ words, or an EN tree of 7 URLs instead of 8 (10 instead of 11 once 1.4.4 lands) |

### 1.6 — hreflang and sitemap

| # | Action | Pass condition |
|---|---|---|
| 1.6.1 | `src/lib/metadata.ts:64` — `'x-default': hePath`. Evidence: Israel is ~5,739 of ~5,800 impressions in the GSC country dimension, ~99% (00-audit §1, same 89-day window as every other GSC figure here). **This is a regression guard, not a live fix** — PROD today already emits `x-default` → Hebrew, because `/en` is not deployed; the English-pointing `x-default` fires the moment the working tree ships. | `curl /` shows `x-default` → the Hebrew URL |
| 1.6.2 | Make the granularity consistent — `he-IL` next to bare `en` today. Pick `he-IL`/`en-US` or `he`/`en`. | Both annotations same shape |
| 1.6.3 | `src/app/sitemap.ts` — add `alternates: { languages: … }` to **paired entries only, both halves of each pair**. Today Next declares no xhtml namespace and emits zero annotations. **Count the pairs, do not assume 6:** 5 static (`/`↔`/en`, `/services`, `/projects`, `/about`, `/contact`) **+ every slug in `EN_SERVICE_SLUGS` that is also a `servicePages` key** — `web-development` and `development` today, `seo` as well once 1.1.1 lands **+ the 3 legal pages once 1.4.4 lands** (they are true translations of the same document; pair them). That is **7 pairs today, 8 after 1.1.1, 11 after 1.4.4** — minus one if `/en/projects` is cut per 1.5.2. Derive the list from the 1.2.3 slug map so the sitemap and the `<link>` tags cannot disagree. | `xhtml:link` appears on `2 × pairs` URL blocks — **22** on the full path — and on no others |
| 1.6.4 | Emit real per-URL `lastmod`. Today 67 of 70 URLs carry one flat date, three months stale. | No two unrelated URLs share a `lastmod` |
| 1.6.5 | Do **not** add `alternates` to unpaired URLs. Unpaired = `/blog`, the 40 blog posts, 12 project pages, 4 author pages, and the 4 Hebrew-only service slugs (`ecommerce`, `brochure`, `marketing`, `branding`). | Those **61** URLs carry no `xhtml:link` — 22 + 61 = 83 |

### 1.7 — Verify before deploy

Run this matrix against the built app, not the dev server (`/projects` renders differently under prerender — 00-audit §P0-2):

```
/services/seo                    -> 200 or 308, NOT 404
/services/web-development        -> 200
/en                              -> 200, lang="en", canonical /en, x-default -> /
/en/projects                     -> 200, English footer, 0 Hebrew links
/en/blog                         -> styled 404
/en/garbage                      -> styled 404
/sitemap.xml                     -> 83 URLs, 22 with xhtml:link
```

**Derive the sitemap count, do not copy it.** Live today is 70 = 6 commercial + 3 HE legal + 5 services + 12 projects + 40 posts + 4 authors. The working tree adds `web-development` to `servicePages` (+1) and 8 EN URLs (+8) = **79**. 1.1.1 adds `seo` (+1) = **80**. 1.4.4 adds 3 EN legal URLs to `enEntries` in `sitemap.ts:65-77` (+3) = **83**. Cutting `/en/projects` per 1.5.2 = **82**. (05 §1.4 says "70 → 78"; it predates the `web-development` and `seo` entries. Recount on the day, from `sitemap.ts`, and treat any other number as a bug.)

### 1.8 — After deploy

| # | Action | Pass condition |
|---|---|---|
| 1.8.1 | Remove `https://aiterra.co.il/sitemap.xml` from GSC — it is submitted on the **redirecting apex host** (70 URLs, fetched 2026-09-03). | One sitemap listed |
| 1.8.2 | Resubmit `https://www.aiterra.co.il/sitemap.xml` (stale since 2026-08-27, 57 URLs). | Last-downloaded date is today, count matches the 1.7 arithmetic (83 on the full path) |
| 1.8.3 | Request indexing for `/en` and for `/services/seo`. | Both submitted |

---

## 2. Hebrew / RTL

**The RTL engineering is already strong. Do not spend budget here.** Verified against the 4 production CSS bundles (291,336 bytes, downloaded from `/_next/static/chunks/*.css`) and 69 of 70 live pages:

| Check | Result |
|---|---|
| Logical vs physical CSS | **~280 logical-property declarations vs ~10 physical** (`inset-inline-start` ×60, `margin-inline` ×43, `padding-inline` ×39, `border-inline-start` ×31, `text-align:start` ×22) |
| Every physical rule | A deliberate, correct **LTR island** — code blocks (`Article.module.css:428-429`), phone/email fields (`ContactForm.module.css:134-137`), captions. Textbook. |
| Heading structure | Exactly one `<h1>`, **zero level skips, on 69/69 live pages** |
| Skip link | Present and functional on 69/69, `href="#main-content"` with a real target |
| Form labels | Every contact-form control has a real `<label>` |
| Bidi discipline in body copy | Blog markdown already wraps Latin runs in `<span dir="ltr">` |

There are exactly three real issues.

### 2.1 Untagged inline English (WCAG 3.1.2 AA)

**The only `lang` attribute on any served page is the one on `<html>`.** Latin runs that are not proper nouns or tech terms (those are exempt) and carry no `lang="en"`:

| Where | String |
|---|---|
| Every page, footer | `Let's kick off` / `your project`; `Copyright ©Aiterra. All rights reserved` |
| `/about` | `ABOUT AITERRA`, `OUR STRATEGY`, `OUR VALUES` |
| Every blog post | `WEBSITES` / `SEO` / `TIPS` category chips (×7 per page) |

A Hebrew-voice screen reader pronounces these with Hebrew phonemes. **Fix:** wrap in `<span lang="en">`. Trivial, and it is a line on every 5568 audit form — which matters because Aiterra sells 5568 audits (§6).

### 2.2 Title direction — 2 pages, and the fix is editorial not technical

First-strong-character analysis over all 69 served `<title>` values (script run against `live-titles.tsv`): **5 titles start with a Latin character.** Three are pure Latin brand names and are fine — `Olie 6`, `Sous Chef`, `Alexandra Patsina` — no mixed direction, nothing to fix. **Two are genuinely mixed and render LTR-base:**

| URL | Title |
|---|---|
| `/blog/geo-ai-search-optimization` | `GEO: המדריך לקידום אתרים בעידן הבינה המלאכותית – כך תופיעו ב-ChatGPT ובגוגל AI \| AITERRA` |
| `/projects/alova` | `ALOVA — טיפוח שיער \| AITERRA` |

Plus one meta description: `/about` — `AITERRA היא סוכנות פיתוח…`.

In a `dir="auto"` context (the browser tab, and any SERP that uses it) the whole string takes LTR base direction and the Hebrew clause lands in the middle. **Fix by leading with the Hebrew clause** — not by inserting invisible bidi marks (RLM/LRM survive nothing: they get stripped by CMS round-trips, break `slice(0,110)` in `schema.ts:107`, and are invisible to whoever edits the title next).

**The character budget is 50, not 60.** `pageMetadata` appends ` | AITERRA` unconditionally (`metadata.ts:29-30`, `SITE_NAME = 'AITERRA'`), so a stored `metaTitle` of 50 characters ships as 60. Both replacements below are counted, suffix included:

| URL | Replacement | Stored / shipped |
|---|---|---|
| `/blog/geo-ai-search-optimization` | `המדריך לקידום אתרים בעידן ה-AI (GEO)` | 36 / **46** |
| `/projects/alova` | `טיפוח שיער — ALOVA` | 18 / **28** |

Both now start with a Hebrew strong character and both clear 60. (The `/about` meta description has the same first-strong problem — `AITERRA היא סוכנות פיתוח…` — and the same fix: lead with the Hebrew.)

**Note this collides with a separate finding:** 44 of 70 live pages have a `<title>` over 60 characters, and the split is exact — every blog post and author page violates, every commercial page complies, because blog posts have no `metaTitle` field separate from the H1 (00-audit §3). Both fixes want the same edit. Do them in one pass: add `metaTitle` to the post record, hold it to **≤50 characters**, and use it to fix length **and** first-strong direction together. While that pass is open, truncate the four author descriptions too — `author/[id]/page.tsx:40-59` sets `description: author.bio` raw and ships 260–294 characters against a 155 ceiling (00-audit §3).

### 2.3 Mixed HE-EN strings in structured content

Three places where Hebrew and Latin are concatenated inside a single string, and the rendering is at the mercy of the consumer's bidi algorithm rather than under Aiterra's control:

| Source | String | Risk |
|---|---|---|
| `data/authors.json:4,16,28,40` | `אריק (ERIK)`, `שון (SEAN)`, `ואדים (Vadim)` | Emitted verbatim into `Person.name`. Google, LinkedIn and AI answer engines all get a name with parentheses and a case-inconsistent transliteration |
| `data/authors.json` job titles | `מנהל פיתוח וקידום דיגיטלי (SEO & GOOGLE ADS)`, `מתכנת ראשי (LEAD DEVELOPER)` | `jobTitle` with a bracketed English gloss is not a job title an entity resolver can match |
| `src/data/team-members.ts:9-37` | The same four people, **different casing**, and a different bio for vadim | §3.6 — two sources of truth for one `@id` |

**Fix:** pick one canonical Hebrew name per person for `Person.name` and put the Latin transliteration in `alternateName`. That is what the property is for, it is machine-readable, and it removes the bidi question entirely. Do this at the same time as §3.6.

### 2.4 One thing to check before the English shell ships

`src/app/(en)/en/*` imports the HE v2 components wholesale. The v2 tree contains only **three** `[dir='ltr']` overrides (`v2.css:9`, `v2.css:172`, `About.module.css:94`), so the LTR islands from §2's opening table point the **wrong way** in an LTR document — most visibly `.ltrValue { text-align: right }` (`ContactForm.module.css:134-137`), which right-aligns the phone and email fields in the English contact form. One pass over the ~10 physical rules, **before** launch, not after. (The EN skip link is already correct: `focus:left-4` in `(en)/layout.tsx:85` vs `focus:right-4` in `(he)/layout.tsx:90`.)

---

## 3. Structured data

**Extend what exists. One thing here is already healthy and must not be rebuilt.**

### 3.0 BreadcrumbList — healthy. Do not touch it except cosmetically.

`BreadcrumbList` is present on every non-home page and absent on `/` (correct). It is **the only rich result Google confirms for this site**, on every URL inspected via the URL Inspection API:

| URL | Detected rich-result types |
|---|---|
| `/` | none (correct — no breadcrumb on home) |
| `/blog/website-maintenance-cost-yearly` | `Breadcrumbs` |
| `/blog/keyword-research-guide` | `Breadcrumbs` |
| `/services/seo` | `Breadcrumbs` |
| `/about`, `/contact` | `Breadcrumbs` |
| `/blog/author/sean` | `Breadcrumbs`, `""` (unnamed) |

Zero rich-result issues reported. **Two cosmetic inconsistencies only:** `ServiceJsonLd.tsx:31` labels home `דף הבית` while all eight other page types say `בית`; `BreadcrumbSchema.tsx` emits the home `item` without a trailing slash while `schema.ts:28` (`abs()`) emits it with one — two `@id`-adjacent URLs for the same node. Align both. That is the entire breadcrumb work item.

### 3.1 The defect list, with file and line

| # | Defect | Evidence | Fix |
|---|---|---|---|
| D1 | `Organization.sameAs` ships as `[]` | Verified in served homepage JSON-LD. Cause: `src/lib/contact.ts:14-18` — `linkedin: ''`, `instagram: ''`, `facebook: ''`; `OrganizationSchema.tsx:80` filters blanks | Fill with real profile URLs **plus the GBP place URL** (§5). This is the property Google uses to tie a site to an entity it already knows; with `[]` there is no Knowledge Panel path and nothing for AI answer engines to cross-reference |
| D2 | Footer social icons link to the **platform homepages** | Live on every v2 page: `<a href="https://www.instagram.com/" aria-label="אינסטגרם">`, `<a href="https://www.facebook.com/" aria-label="פייסבוק">` | Point at real profiles, or **delete the icons**. Two dead-end outbound links on 70 pages is worse than no icons |
| D3 | Sean's headshot 404s in the HTML **and** in `Person.image` | `/blog/author/sean` renders `<img src="/images/Sean.jpeg">` and emits `"image":"…/images/Sean.jpeg"`; `GET /images/Sean.jpeg` → **404**. `/images/Sean.webp` → 200. The repo's `authors.json:43` says `.webp`; the production `data/` volume is stale | Redeploy so the volume picks up the repo file, then re-verify all four `Person.image` URLs return 200. Validate author image paths at build time. Sean is the SEO/Ads lead — the author most topically bound to the commercial queries |
| D4 | "GOOGLE REVIEWS" block quotes 6 unanimous 5-star testimonials with **no link to any Google profile** | `(he)/v2/content.ts:744-751` (eyebrow `GOOGLE REVIEWS`, rail `ביקורות לקוחות מגוגל`); 6 `reviewItems`, all rating 5. The only external Google links in the served HTML of `/`, `/about`, `/contact` are `maps.google.com` **address searches**, not a place URL | Link the section header to the real GBP reviews URL and add that URL to `sameAs`. Six unanimous 5-stars with no source is a **negative** trust signal. See D8 before considering markup |
| D5 | The same `Person` `@id` carries two different names | `.../blog/author/eric#person` is `"אריק (Erik)"` in `Organization.employee` (`src/data/team-members.ts:12`) and `"אריק (ERIK)"` on the ProfilePage (`data/authors.json:4`). Same for all four; `team-members.ts:28` also carries a *different, shorter* bio for vadim | Have `OrganizationSchema` read `getAllAuthors()` and **delete `team-members.ts`**. One entity, one source |
| D6 | `Organization.availableLanguage` is an invalid property | `validator.schema.org` returns `UNKNOWN_FIELD availableLanguage` ×3 (LocalBusiness, Organization, ProfessionalService). Emitted at `OrganizationSchema.tsx:70` | Add a `contactPoint` node (`@type: ContactPoint`, `contactType: "customer service"`, `telephone`, `email`, `availableLanguage: ['he','en','ru']`) and drop it from the Org root. Closes the missing-`contactPoint` gap at the same time |
| D7 | Dead schema code | `src/components/seo/ServiceSchema.tsx` has **zero importers** (grep over `src/`) | Delete |

**D8 — do NOT "fix" the `@id`-only Article author reference.** `schema.ts:123-125` emits `author: { '@id': '…/blog/author/vadim#person' }` with no `@type`/`name`. It looks broken. It is not. Google's own parser (`validator.schema.org`) resolves it across script tags into the `Organization.employee` node and returns `author -> types ['Person'] props [('name','ואדים (Vadim)'), ('jobTitle','מתכנת ראשי (Lead Developer)'), ('url', …)]`. `author.name` — Article's one hard requirement — **is** satisfied. Leave it alone. The work is on the Person node it resolves *to* (§3.3), not on the reference.

### 3.2 Service schema on each service page

`ServiceJsonLd.tsx:17-28` currently emits `@id`, `name`, `description`, `serviceType`, `url`, `inLanguage`, `provider`→`@id`, `areaServed: { Country: Israel }`. That is thin, and it misses the one thing already sitting on the page.

**The finding that matters: `/services/ecommerce` renders real ₪ prices on the page and emits zero `offers`.**

```
content.ts:1407   pricing.plans[0]  price '500'  priceNote '₪ לחודש'  term 'בהתחייבות ל-12 חודשים'
                  pricing.plans[1]  price '800'  priceNote '₪ לחודש'  term 'בהתחייבות ל-12 חודשים'

curl /services/ecommerce | grep -c offers      ->  0
curl /services/ecommerce | grep '>500<'        ->  present, twice, visible to the reader
```

The data exists, it is real, it is already public, and the machine-readable layer throws it away.

Add to `ServiceJsonLd`:

```
offers: [{
  '@type': 'Offer',
  name: 'Basic',
  priceSpecification: {
    '@type': 'UnitPriceSpecification',
    price: '500', priceCurrency: 'ILS',
    unitCode: 'MON',                       // per month
    referenceQuantity: { '@type': 'QuantitativeValue', value: 12, unitCode: 'MON' }
  },
  availability: 'https://schema.org/InStock',
  url: 'https://www.aiterra.co.il/services/ecommerce#pricing'
}, … ]
```

Also on `Service`: `image`, `audience`, and `areaServed` at **city granularity** (Bat Yam, Holon, Tel Aviv-Yafo, Rishon LeZion are in the Org node but not the Service node), plus `hasOfferCatalog` on the Organization listing all service pages — today no service is offered from the Org node at all.

And: **service subpages emit no `WebPage` node at all.** `ServiceJsonLd` emits only `Service` + `BreadcrumbList` + `FAQPage`, so the highest-commercial-intent pages on the site have no page node linking back to the Organization. Add `webPage()` (already exists at `schema.ts:33-61`) to that component.

### 3.3 Article + a real Person author on posts

Present on all 40 posts and structurally sound: `@id`, `mainEntityOfPage`, `headline`, `description`, `inLanguage`, `url`, `datePublished`, `dateModified`, `image[]`, `author`→`@id`, `publisher`→`@id`, `isPartOf`, `keywords`, `wordCount`.

What is missing is not markup — it is the **entity behind the reference**. `Organization.employee` nodes (`OrganizationSchema.tsx:9-15`) carry only `@type`, `@id`, `name`, `jobTitle`, `url`. No `image`, no `description`, no `sameAs`, no `knowsAbout`. And on the live ProfilePages, `sameAs` is absent on all four.

| Add to the Person node | Why |
|---|---|
| `image` (a URL that returns 200 — see D3) | The one property that makes a Person node renderable |
| `description` | Currently 43–52 words of adjectives with zero verifiable facts. Rewrite to 120–180 words with years, certifications-with-issuer, project counts, named verticals |
| `sameAs` — at minimum a LinkedIn URL each | Populates `Person.sameAs` **and** feeds `Organization.sameAs` (D1) from the same input |
| `knowsAbout` | Sean: SEO, Google Ads, GEO. Vadim: Next.js, automation, integrations |
| `hasCredential` | Only where a real certificate exists. Do not invent one |
| `alternateName` | The Latin transliteration, moved out of `name` — see §2.3 |

**And the markup is worthless until the pages are reachable.** `href="/blog/author/…"` occurrences in the visible HTML of `/`, `/about`, `/blog`, and four sampled posts: **zero, on every one.** `(he)/v2/blog/[slug]/page.tsx:92` computes `authorName` and never renders it. All four author URLs are sitemap-only orphans. Render the byline as a link before touching the schema — otherwise you are enriching a node no crawler has a path to.

Missing on `BlogPosting` itself, in rough order of value: `articleSection`, `about`, `speakable`, `timeRequired`, `isAccessibleForFree`. Also: all 40 posts share a single `dateModified` of `2026-06-13`, and 18 of 40 have `dateModified == datePublished`. A content refresh that does not update `dateModified` is invisible.

### 3.4 FAQPage — keep it, expect nothing from the SERP

Present on `/`, `/services`, `/services/{slug}` and **all 40 posts** (`data/blog-posts.json` — 40/40 carry `faq.items`). Structurally fine (`schema.ts:63-84`).

Google restricted FAQ rich results to government and health sites in August 2023. **This markup buys AI-answer surfaces, not SERP real estate.** Keep it — §7 explains why it is worth more than it looks — but do not budget against a CTR lift, and do not add FAQ blocks to pages that do not genuinely need one just to carry the schema.

One cleanup: after 1.5.1, `/en` and `/en/services` stop emitting two `FAQPage` nodes with identical `mainEntity`.

### 3.5 LocalBusiness — Hebrew side only

The Org node claims `LocalBusiness` + `ProfessionalService` and omits every property that typing implies. All acknowledged as TODOs at `OrganizationSchema.tsx:76-79`:

| Property | Status | Priority |
|---|---|---|
| `geo` (lat/long) | absent | **The one LocalBusiness property Google actually consumes.** Add it |
| `openingHoursSpecification` | absent | Add. Consumed for local surfaces |
| `hasMap` | absent | Add — there is already a maps embed on `/contact` |
| `founder`, `foundingDate` | absent | Add. Factual, free, and feeds entity resolution |
| `legalName`, `vatID` / ח.פ. | absent | Strong Israeli trust signal |
| `priceRange` | present, `"₪₪"` | Fine |

**Keep all of this Hebrew-side.** On `/en` it means nothing: the English shell has no geographic proposition, no local pack to win, and a LocalBusiness node on an 8-page English shell is noise. Per 1.4.3, `/en` gets the same `@id` with English text — not a second local entity.

### 3.6 Offer and AggregateRating — the price SERP play, with an honest split

The SERP research found the exact pattern that wins the price queries, and it found live proof. `avinu.co.il` renders **both** a price-range rich result (₪2,000–₪5,000) **and** a 5.0 · 47 review rich result in the `קידום אורגני מחיר` SERP; `orimintzmedia.co.il` renders 5.0 · 19 in the same family of SERPs. (Source: `research/serp-seo-organic.md:123-127, 329, 416-419`.) Aiterra renders neither.

These two halves have **different** answers, and conflating them is how sites earn a manual action.

| | Verdict | Reasoning |
|---|---|---|
| **`Offer` / `priceSpecification`** | **Do it.** | The prices already render on `/services/ecommerce` (§3.2). Marking up a price you already publish is exactly what the property is for. Extend to every service page that gains a ₪ table — the price table is a content deliverable in 03/04, and the markup should ship with it |
| **`AggregateRating` on the Organization** | **Do not self-mark.** | Google's review-snippet policy excludes reviews *about the business itself* served *on the business's own site*. Marking up the six unsourced testimonials in D4 produces no rich result and reads as self-serving. **The policy-clean route to stars is §5: a real GBP with real reviews.** Those stars appear in the local pack and in the knowledge panel for free |

**This is a genuine contradiction between the SERP research and the schema audit, and it is not resolved by evidence I have.** `avinu` demonstrably renders stars in that SERP. Either it sources them from a third-party collector, or it is running policy-risky markup that has not been actioned yet. I could not determine which. **[unverified — needs a look at avinu's actual JSON-LD and whether the reviews carry a third-party `publisher`]**. The recommendation stands regardless: get real reviews first (§5), then revisit. Reviews you can point at are worth more than markup you cannot defend.

---

## 4. Core Web Vitals

### 4.1 Read this before budgeting anything here

**There is zero CrUX field data for this site, at page level and at origin level.**

All six URL × device combinations return an empty `loadingExperience`, and `originLoadingExperience` is **absent entirely** — which is precisely what the API does when an origin sits below the CrUX reporting threshold:

```
raw loadingExperience:      {"initial_url": "https://www.aiterra.co.il/"}
originLoadingExperience:    ABSENT
```

| URL | mobile | desktop |
|---|---|---|
| `/` | NO DATA | NO DATA |
| `/services/web-development` (→ `/services/brochure`) | NO DATA | NO DATA |
| `/blog/website-maintenance-cost-yearly` | NO DATA | NO DATA |

Origin CrUX: **absent for all six.** (Source: PSI REST API, HTTP 200, raw JSON in the audit scratchpad at `psi/*.json` — `home-mobile.json`, `home-desktop.json`, `svc-*.json`, `blog-*.json`.)

**Therefore Core Web Vitals are not a ranking factor for this site today, and no CWV work will move rankings directly.** Page experience is a tie-breaker Google applies *from field data*. With no field data there is no signal to apply. Real p75 LCP / INP / CLS values are `[unverified — no CrUX field data; origin below reporting threshold]` — nobody has them, including Google's own Page Experience systems and the CWV report in Search Console.

This is consistent with 32 clicks / 5,967 impressions in 89 days. CrUX needs a few hundred real opted-in Chrome visits per URL group per month; the site is nowhere near that even at origin level.

**Performance is P2 here. Do not write a CWV-led plan. Anyone selling a CWV programme on a "it will improve rankings" basis is selling something that cannot be measured on this domain.** Re-check CrUX in ~6 months, once the content programme might have pushed the origin over the threshold.

### 4.2 The one real defect — and the fix is already written

Production serves a **4.27 MB decorative video on every single page.**

```
curl -sI /videos/v2-hero.mp4?v=2
  Content-Length: 4373912          (4.27 MB)
  Cache-Control:  public, max-age=31536000, immutable
  Age:            634546           (7.3 days at the Cloudflare edge)

Lighthouse network-requests — full transfer confirmed, not just a probe:
  home  MEDIA 4272.1 KB v2-hero.mp4?v=2 · MEDIA 479.8 KB v2-stats.mp4
  svc   MEDIA 4272.1 KB v2-hero.mp4?v=2 · MEDIA 479.8 KB v2-stats.mp4
  blog  MEDIA 4272.1 KB v2-hero.mp4?v=2
```

**The blog post carrying 1,537 impressions — the site's single most-seen URL — is 5.10 MB, and 4.29 MB of that (84%) is a decorative video the reader never sees.**

The hero *is* correctly deferred (`Hero.tsx:19-25` and `PageHero.tsx:26-32` use `data-autoplay` + `preload="none"`). The footer defeats it: `Footer.tsx:43-52` eagerly `autoPlay`s **the identical URL**, and a muted autoplay video is downloaded by Chrome regardless of `preload="metadata"`.

**A 318 KB re-encode of that exact file is already sitting uncommitted in the working tree, dated 2026-09-04:**

```
git cat-file -s HEAD:public/videos/v2-hero.mp4   ->  4373912
ls -l public/videos/v2-hero.mp4                  ->   325683
git status                                       ->  ' M public/videos/v2-hero.mp4'
```

Shipping that one file removes **4,048,229 bytes (3.86 MB) from every page load sitewide**:

| Page | now | after | cut |
|---|---|---|---|
| `/` mobile | 6.66 MB | 2.80 MB | −58% |
| `/services/brochure` mobile | 5.78 MB | 1.92 MB | −67% |
| `/blog/website-maintenance-cost-yearly` mobile | 5.10 MB | **1.24 MB** | **−76%** |

**Deployment trap — this will silently fail without it.** The URL is `?v=2` and is served `immutable` with a 7.3-day edge Age. Committing the smaller file **without bumping the query string to `?v=3`** leaves the Cloudflare edge and every returning visitor on the 4.27 MB blob indefinitely. The cache-buster must change in `Hero.tsx:19`, `PageHero.tsx:26` **and** `Footer.tsx:45`.

**Ship this because it is free and already written, not as the first step of a performance programme.** It is item 1.0.3 in the release checklist for exactly that reason. Sell and measure it as conversion work on a mobile-heavy Israeli audience — 5.10 MB → 1.24 MB is a real user-experience change — not as SEO.

Second, ten-minute item: give the footer video its own deferral (`Footer.tsx:46-51` → the `data-autoplay` / `preload="none"` pattern from `Hero.tsx:19-25`), and the same for `Stats.tsx:31-38` (479 KB, homepage only). Without it the hero's careful deferral stays pointless.

### 4.3 Images — a real number, but a refactor

```
total <img> tags on the homepage:  165
with loading="lazy":                 3     (162 load eagerly)
with srcset:                         0
routed through /_next/image:         0
<link rel="preload" as="image">:    52
```

Root cause: **`next/image` is used by zero of the 22 v2 components** — all 22 use raw `<img>`. `next.config.ts:26` configures `formats: ['image/avif','image/webp']`, and that config is **dead code** because nothing routes through the optimizer.

Lighthouse `image-delivery-insight` scores the waste at **985 KiB**. The cheapest slice — four `about-card*.png` files totalling **397,723 B**, painted into **60 × 78 px** boxes (`AboutRoles.tsx:50`) and preloaded at high priority — **is already converted and sitting untracked**, exactly like the video: `about-card{1..4}.webp`, **23,810 B for all four**, and `content.ts:138-156` / `content-en.ts:118-136` already reference the `.webp` paths. **There is nothing to build here. It ships when 1.0.5 commits the four files.**

The 52 `rel="preload" as="image"` hints are the second half of the same problem, and **there is no preload list to edit** — grep the repo and only one image preload is hand-written (`Hero.tsx:14` / `PageHero.tsx:22`, the hero poster). The other 51 are emitted automatically by React's resource hoisting for every server-rendered `<img>` that is not lazy: the served homepage has **165 `<img>` tags across 54 unique `src` values, 3 of them `loading="lazy"` — and exactly 52 preload links.** Preloading 52 images is equivalent to preloading none; it flattens the priority queue the browser would otherwise build, and several of the preloaded carousel images sit at `boundingRect.left: -6742`.

**So the lever is `loading="lazy"`, applied at the `<img>`, not a `<link>` to delete.** Add it to every below-the-fold image in the v2 components — `ProjectsCarousel.tsx`, `Marquee.tsx`, `AboutRoles.tsx`, `RelatedPosts.tsx`, `BlogIndex.tsx` — and React stops emitting the hint. Target: the hero poster plus at most one above-the-fold image keep a preload.

Routing the 22 components through `next/image` is the correct long-term fix and would make the dead config live. **It is a refactor. It is P2. Do items 4.2 first — they deliver 4× the bytes for a fraction of the effort.**

### 4.4 Do not touch these

Checked, measured, healthy. Listing them so nobody spends money here.

| | Measured | Verdict |
|---|---|---|
| **TTFB** | **10–40 ms**, `document-latency-insight` score 1, Cloudflare + Next ISR `x-nextjs-cache: HIT` | Excellent. There is no server-side problem. Do not "optimise" it |
| **CLS** | **0 – 0.004** across all six runs | Excellent. Do not invent a layout-shift problem |
| Static caching | `public, max-age=31536000, immutable`, `cf-cache-status: HIT` on video, images and JS | Correct |
| Fonts | `font-display: swap` set, 4 fonts preloaded (122 KB), `font-display-insight` returned no items | Fine |
| Preconnect | Lighthouse: "No additional origins are good candidates" | Nothing to do |
| Compression | HTML brotli 341,922 B → 28,710 B (12:1) | Fine |
| Duplicated JS | score 1, none | Fine |

One item that is *not* a performance decision: the **Sienna accessibility widget** costs 1,484 ms bootup + 592 ms CPU + 354 ms forced reflow — the single largest script on the page, larger than GTM (647 ms) — while 3 of its 20 features are already dead and CSS-hidden. That is a §6 decision about compliance mechanism, not a §4 decision about speed. It is listed here only so the number is on record.

---

## 5. Google Business Profile and free directories

**No GBP exists. The owner has confirmed it. This is a Week-1 P0, it costs nothing, and it is plausibly the highest-ROI item in this entire plan.**

### 5.1 Why this is first

Three independent lines of evidence, none of them speculative:

1. **`ביקורות על aiterra agency` — 18 impressions / 89 days at position 2.4, with ZERO clicks** (GSC query export). Eighteen people searched for *reviews of Aiterra*, Google ranked the site **second**, and nobody clicked — because there is nothing to click on. No review content, `Organization.sameAs: []`, and **no GBP surfaced in 21 separate SERP probes**. This is not a ranking problem. Google is already doing its part.
2. **Reviews are the gate on Midrag entry.** Midrag is pay-on-success (5–10% commission on completed transactions only, no commitment) but requires initial vetting where **the average rating from recent clients must exceed 9**. Blocked today.
3. **Reviews are what the incumbent advertises.** `digitalsecrets.co.il` puts **100+ Google reviews at 5.0** on its rank-5 maintenance page — the pillar Aiterra is trying to win (`research/serp-maintenance.md`).

Aiterra currently has: `sameAs: []`, six unsourced 5-star testimonials on its own homepage with no link to any profile, and no place on the map.

### 5.2 Create and verify the profile

Hebrew only. English GBP would fragment the entity for a business whose demand is 99% Israeli.

| Field | Value |
|---|---|
| Business name | **AITERRA** — exactly as it appears in `Organization.name`. No keyword stuffing ("Aiterra בניית אתרים" is a guideline violation and a suspension risk) |
| Address | **רחוב הרב ניסנבאום 37, בת ים 5962030** — byte-identical to the string on all v2 pages and in `contact.ts:2-11` |
| Phone | **052-678-0739** — matches `tel:+972526780739` sitewide |
| Website | `https://www.aiterra.co.il` — the **www** host. The apex 301s; a GBP pointing at a redirect is a wasted signal |
| Email | info@aiterra.co.il |
| Verification | Postcard or video, whichever Google offers. **Budget 1–2 weeks of calendar time and start it on day one** — nothing else in this section can proceed until it clears |

### 5.3 Categories

The primary category is the strongest relevance lever the profile gives you (industry consensus, not a measured figure — `[unverified — no first-party local-pack data exists for this business, because there is no profile yet]`). GBP allows **1 primary + up to 9 secondary** (`support.google.com/business/answer/7249669`).

**Primary: `Website designer` — deliberately against the conventional advice, on Aiterra's own data.**

Standard guidance says a full-service agency picks `Internet marketing service` or `Marketing agency`. Aiterra's GSC says otherwise:

| Side of the business | What Google already thinks |
|---|---|
| Web build | `בניית אתרים בת ים` — **28 impr @ pos 15.6** |
| Marketing / SEO | `קידום אתרים בבת ים` — **4 impr @ pos 65.8**, in the same city, off the same post. Sitewide, **10 of the 17 `קידום אתרים ב<place>` rows sit between pos 90.6 and 100.0** (`gsc-queries-89d.tsv`), and there is no live organic-SEO page to support the claim anyway |

Picking a marketing primary points the local pack at the half of the business that has no landing page and no relevance signal.

**Secondaries:** `Internet marketing service` · `Marketing agency` · `Advertising agency` · `Graphic designer` · `Software company` · `E-commerce service`. Add `Web hosting company` **only if Aiterra actually hosts** — do not claim a service you do not sell.

> The **exact Hebrew labels** Google shows in the picker are `[unverified — needs the GBP category picker]`. The English names above are real GBP categories. **Confirm the Hebrew strings in the dashboard; do not translate them.** A hand-translated category that does not exist in the picker cannot be selected, and a near-miss selection is worse than a correct broad one.

### 5.4 Service area

Physical address **Bat Yam**, with **Holon · Tel Aviv-Yafo · Rishon LeZion** added as service areas.

This is how Aiterra claims those cities **without writing a single doorway page.** The competitive research reached the same place from the SERP side: `research/serp-branding-local.md` marks Tel Aviv, Rishon LeZion and Ramat Gan **DO NOT BUILD** ("a Tel Aviv page would be a pure doorway page by definition — same content, city name swapped"; Ramat Gan is *"eight established SEO agencies, each running a mature city-page tree"* against Aiterra at pos 92.1), and its honest count (§3.2) is **"two city pages, optionally three"** — Bat Yam promoted, Holon only if a named Holon client exists.

**Hard cap, and it is a policy line, not a preference: at most ONE city page — Bat Yam, which already has GSC proof (28 impr @ pos 15.6) and real local substance.** A second is permitted only when a named client in that city can carry it. A set of pages that differ only by the city name is a Google spam-policy violation that costs the whole domain, not just the pages; the existing `/blog/web-development-gush-dan` (883 words, four cities in the title, **zero** GSC impressions) is the site's own worked example and should be 301'd into the Bat Yam post. Every other city is claimed through GBP service areas and the directory city pages in §5.7 — which already occupy slot 1–2 in those SERPs anyway.

### 5.5 Services, photos, posts

| Item | Spec |
|---|---|
| **Services list** | One entry per live service page, using the **page's own Hebrew H1 wording**, each with a 2–3 sentence description and a link to that URL. This is the only place in this plan where a service page gets a free inbound link from a Google-owned surface — and remember every one of the 5 live service pages currently has **zero** inbound links from any of the 40 blog posts (00-audit §P0-1) |
| | Add **תחזוקת אתרים** as a service entry the day `/services/maintenance` exists. It is the largest verified demand cluster on the property — **~1,430 impressions across 18 rows, best human-query position 18.4** (`תחזוקת אתר`). *(01-competitors §1 quotes "best position 3.5" for this cluster; that row is `make web search for the following query: …`, an agent-issued query §7 excludes from scoring. Quote 18.4, never 3.5.)* |
| **Photos** | Minimum viable set: 1 logo, 1 cover, 3–5 exterior/interior of the Bat Yam office, 4–6 team headshots (**the same four people whose `Person` nodes §3.3 fixes** — one photo set, two uses), 6–10 project screenshots. Geo-tagged EXIF is not a ranking factor; do not bother |
| **Posts** | One post per fortnight, Hebrew, ~100–200 words, each linking to a live URL. Rotate: new blog post → service page → project → offer. Posts expire from the profile after 6 months; treat the cadence as maintenance, not campaigns |
| **Q&A** | Seed 5–8 questions yourself and answer them. Use the **same questions already in `faq.items`** on the service pages — they are written, they are Hebrew, and they are the exact phrasing §7 wants quotable |
| **Attributes** | Fill everything Google offers. `Online appointments`, `Onsite services`, languages spoken |

### 5.6 Review request process — the concrete version

The reviews are the point of this whole section. A vague "ask for reviews" instruction produces zero reviews.

1. **Trigger.** At project handover, not at invoice. The moment the client is happiest is when the site goes live.
2. **Channel.** WhatsApp, from the project manager's own number, not a mass mail. Israeli B2B clients answer WhatsApp and ignore review-request email.
3. **Link.** Use the GBP short review link (`g.page/r/…/review`) — it opens the review box directly. A link to the profile loses roughly half the people to navigation.
4. **Ask.** Name the specific thing you want mentioned: *"אם תוכל לציין מה בנינו ותוך כמה זמן — זה עוזר לנו הכי הרבה."* Reviews that name the service and the timeline are the ones that carry keyword and trust weight.
5. **Volume target before anything downstream unlocks:** **10 reviews** makes the profile credible and unblocks Midrag's >9 average gate. **25+** is where you are competitive against a page advertising 100+.
6. **Backfill.** The six testimonials in `content.ts:744-751` are attributed to named people. If those are real clients, ask those six first — they have already said yes once. If they are not real, **remove the block** (see D4; unsourced 5-star testimonials are a negative signal either way).
7. **Then, and only then:** add the GBP place URL to `Organization.sameAs` (D1), link the "GOOGLE REVIEWS" header to the real reviews URL (D4), and open the Midrag application.

### 5.7 The free directories — this week, and it is form-filling

Directories occupied **slot 1 or 2 in every city SERP probed** (Bat Yam, Holon, Tel Aviv, Rishon LeZion, Ramat Gan). The correct move is occupation, not competition.

| Directory | Cost | Verified state | Action |
|---|---|---|---|
| **d.co.il** (zap דפי זהב) | **FREE** — verified by fetching `/LandingPage/AddBusiness/`, headline *"פרסום עסק חינם באינדקס העסקים המוביל בישראל"* | `/h-c2530-e0-p0-l0-city6200/` (Internet → Website Building → Bat Yam) lists **14 businesses. Aiterra is not one.** Ranks slot 1–2 | **P0.** Claim, and claim **four sibling categories** — the Bat Yam tree also carries משרדי פרסום, גרפיקאים וסטודיו לגרפיקה, and גרפיקה־עיצוב לוגו. **Four categories cost the same effort as one.** Do **not** buy the paid "סל מוצרי דיגיטל מנצחים" bundle — it sells Google Ads, content, SEO and *website building*: paying דפי זהב to do what Aiterra sells |
| **b144.co.il** (Bezeq B144) | **FREE** — banner *"העסק שלך לא כאן? להצטרפות חינם"* | `/בניית-אתרים/בת-ים/` lists **11 businesses. Aiterra is not among them.** A category with 11 entries means being listed is genuinely visible | **P0.** Claim Bat Yam; B144 runs equivalent city pages for Holon, Tel Aviv-Yafo, Rishon LeZion and Ramat Gan |
| **midrag.co.il** | Pay-on-success, 5–10% on completed transactions only | Returned slot 1 for `עיצוב דף נחיתה מחיר`. Entry gated on **>9 average from recent clients** | **P1 — after §5.6 produces reviews.** Downside is capped. Caveat: Midrag's *demand* side is home trades (its autocomplete returns אינסטלטור, חשמלאי, מזגנים — not one digital term). Rank below d.co.il and b144 |
| easy.co.il | — | Bat Yam SEO listings carry 23 and 5 reviews | P1 |
| webhosts.co.il, 2net.co.il, a.co.il, startpage.co.il | free | NAP/citation value only; rank for nothing | P2 — one batch, one afternoon |
| youtube.com | free | The **one** non-owned platform ranking anywhere in the maintenance cluster (#10 for `עלות תחזוקת אתר אינטרנט`) | P2 — one short Hebrew explainer |

**Two traps recorded so nobody wastes a week:**
- **`zap.co.il` is not `d.co.il`.** In the *directory* sense "זאפ" means d.co.il. `zap.co.il` is the price-comparison marketplace; its `joinzap.aspx` onboards **e-commerce stores with credit-card checkout to list SKUs**. Aiterra sells services, not SKUs. **Skip.**
- **`index.co.il` is not a directory.** It is an agency (est. 1977, HaMasger 5 Tel Aviv) that operates vertical portals. Listing there is not a thing.

`t.co.il`, `rotter.net/pro`, `bil.co.il`, `expert.co.il`, `08business.co.il` all returned 403 to automated fetching — `[unverified — needs a manual browser visit]`. Treat "top 10, updated monthly" pages with suspicion: in Israel those are commonly paid placement. Verify before paying anything.

**NAP consistency is the whole point of the directory push.** Every listing must carry the byte-identical string `רחוב הרב ניסנבאום 37, בת ים 5962030` and `052-678-0739`. The good news: the address and phone are already byte-identical across every v2 page and match the schema (`contact.ts:2-11`). There is **no NAP contradiction to clean up first** — one fewer thing to fix.

One gap that undercuts it: **`info@aiterra.co.il` renders nowhere on the site.** Every occurrence on every page is inside a `<script>` (JSON-LD or the RSC flight payload). `Footer.tsx:4-8` imports `CONTACT_PHONE`, `CONTACT_PHONE_HREF` and `OFFICE_ADDRESS_*` but **not** `CONTACT_EMAIL`. Render it as a real `mailto:` in the v2 footer — see also §6.2, where the same absence has a legal dimension.

---

## 6. Accessibility

**Aiterra sells ת"י 5568 compliance.** That makes every finding here simultaneously a legal exposure and a destroyed proof point. Aiterra's own blog post (`/blog/website-accessibility-cost-5568`) publishes a 7-point 5568 checklist **that its own site fails on four points.**

Israeli law adopts WCAG 2.0 level AA via ת"י 5568, and §19נא(ב) of חוק שוויון זכויות לאנשים עם מוגבלות permits a court to award damages **without proof of damage** — commonly cited as up to ₪50,000 per claim, and claims may be brought by a person with a disability, by the Commission, or by an advocacy organisation ([kolzchut.org.il](https://www.kolzchut.org.il/he/%D7%94%D7%A0%D7%92%D7%A9%D7%AA_%D7%90%D7%AA%D7%A8%D7%99_%D7%90%D7%99%D7%A0%D7%98%D7%A8%D7%A0%D7%98_%D7%95%D7%90%D7%A4%D7%9C%D7%99%D7%A7%D7%A6%D7%99%D7%95%D7%AA_%D7%9C%D7%90%D7%A0%D7%A9%D7%99%D7%9D_%D7%A2%D7%9D_%D7%9E%D7%95%D7%92%D7%91%D7%9C%D7%95%D7%AA)). **[unverified — the exact statutory ceiling and its application to a B2B services site needs a lawyer, not an SEO. Do not quote the figure to a client.]**

**Ordered by legal risk, not by effort.** Effort is in the last column and it is mostly small.

### L1 — A published, dated statement that is provably false

**92.4% of images sitewide ship `alt=""` — 2,019 of 2,186 instances across 69 live pages.** 49 of 69 pages have **zero** images with any alt text, including `/blog`, `/about`, `/projects`, `/contact`, `/accessibility-statement`, all 5 live service pages, and 37 of 40 blog articles.

Meanwhile `src/components/legal/AccessibilityBody.tsx:25`, live at `/accessibility-statement` (HTTP 200), states:

> `טקסט חלופי (Alt) לתמונות מהותיות`

**And the alt text already exists, written, in Hebrew, unused.** All 40 posts carry descriptive alt in `data/blog-posts.json` — 43 markdown images, 43 with alt, 0 without:

```
website-maintenance-cost-yearly  ->  כמה עולה תחזוקת אתר בשנה — שלט "אתר בבנייה" על מקלדת מחשב
website-accessibility-cost-5568  ->  כמה עולה הנגשת אתר לפי תקן 5568 — אישה בכיסא גלגלים עובדת על מחשב נייד
```

The renderer throws it away:
- `src/app/(he)/v2/blog/[slug]/page.tsx:63` — `if (cover && href === cover) return ''` deletes the cover node **and its alt** from the article body
- `:174` — re-renders that same cover as `<img src={post.images[0]} alt="" />`

So the hero image of every one of the 40 blog articles ships `alt=""` while a written Hebrew description sits unused two fields away in the same JSON record. This is a v2-redesign regression: the pre-v2 components set alt (`BlogCard.tsx:24` `alt={post.title}`), the v2 replacements hardcode `""` (`BlogIndex.tsx:100`, `RelatedPosts.tsx:57`, `ProjectsCarousel.tsx:235`, `ServiceHero.tsx:65`, `AboutIntro.tsx:33`). The only pages with real alt coverage — `/blog/author/eric|michael|vadim` — are the only ones still on the old components.

Why this is L1 rather than L3: it is not merely a WCAG 1.1.1 (Level A) failure. It is **a published, dated legal document asserting something demonstrably untrue, by a vendor that sells the audit.** In a dispute, "we didn't know" is unavailable and "we hadn't got to it" is contradicted by the statement.

**Fix (one afternoon):** pass the markdown alt through at `:174` (capture it in the `image()` renderer at `:62-67` before the cover is stripped, or add an `imageAlt` field); set real alt on the five v2 components. Also gives 40 hero images back to Google Images — on a site whose top page carries 1,537 impressions.

### L2 — The statutory complaint channel is broken and unattributed

`AccessibilityBody.tsx:37-46` has the heading **"פנייה לרכז הנגישות"** and then no person, no name, no role holder, no postal address — only a generic email and phone. Aiterra's own blog post says a statement must include *"פרטי רכז נגישות"* (`src/data/blog-seed.json:1188`).

And the email does not render. Cloudflare Scrape Shield rewrites the `mailto:` on this page:

```html
<a href="/cdn-cgi/l/email-protection#eb82858d84ab8a829f8e99998ac58884c58287" dir="ltr">
  <span class="__cf_email__" data-cfemail="8be2e5ede4cbeae2ffeef9f9eaa5e8e4a5e2e7">[email&#160;protected]</span></a>
```

Without JavaScript — and to **every crawler, including the AI crawlers `robots.ts` explicitly allows** — the statutory accessibility-complaint channel reads literally **"[email protected]"**. Also present once on `/contact`.

Third defect, same document: the exceptions section (`:32-34`) says only "third-party embeds or complex graphic components" and **does not disclose three widget features verified dead on 2026-07-06** whose buttons are CSS-hidden at `src/styles/globals.css:61-67` (`hide-images`, `page-structure`, `image-tooltips`). Hiding dead controls is the right call; failing to list known limitations is not.

Fourth, and worse than it looks: **hiding those buttons does not disable the Accessibility Profiles that depend on them.** Read from `sienna.min.js`:

```js
{key:"blind",         settings:{"screen-reader":true,"image-tooltips":true,"highlight-links":true}}
{key:"adhd-friendly", settings:{"readable-guide":true,"stop-animations":true,"hide-images":true}}
```

Profile buttons use `.asw-profile-btn`, **not** `.asw-btn[data-key=…]`, so the CSS rule does not touch them. **A blind or ADHD visitor selecting the profile named for their disability silently gets a partly non-functional one.**

**Fix:** name a real coordinator with a direct address; turn off Cloudflare Email Obfuscation for `/accessibility-statement` and `/contact` (or render the address as plain text beside the `mailto:`); list the three dead features under "חריגות ומגבלות"; fix or suppress the two broken profiles.

### L3 — 39 keyboard tab stops hidden from the accessibility tree

Focusable `<a href>` / `<button>` elements sitting **inside** an `aria-hidden="true"` container with no `tabindex="-1"` and no `inert`:

```
39 of 137 tab stops (28%)   /                      Marquee ×15, ProjectsCarousel ×24
22 of  81 tab stops (27%)   /projects/olie-6       identical on ALL 12 /projects/* pages
                            13 of 69 live pages affected
```

Source: `Marquee.tsx:136` (`aria-hidden={copy > 0 || undefined}` — copies 1–3 still contain live `<a href="/#v2-portfolio">`) and `ProjectsCarousel.tsx:228` (`aria-hidden={looped && copy !== 1}` — each clone contains a real project card link). Verified in served HTML.

WCAG 2.1 **4.1.2 (Level A)**, axe-core rule `aria-hidden-focus`, severity *serious*. A keyboard user Tabs into an element the accessibility tree says does not exist: focus visibly moves, the screen reader announces nothing. It directly contradicts `AccessibilityBody.tsx:24` — *"תמיכה בניווט מלא באמצעות מקלדת"*.

Why L3: **this is the single most-reported automated-scanner violation type.** Any prospect — or plaintiff's lawyer — who runs axe or WAVE on aiterra.co.il's own homepage sees **39 serious violations before reading a word of the sales copy.** The commercial cost may exceed the legal one.

**Fix:** replace `aria-hidden` on the clones with the `inert` attribute — hides from AT **and** removes from the tab order in one attribute. Two lines.

### L4 — The focus ring fails 3:1 on the light two-thirds of the site

`(he)/v2/styles/v2.css:128-132`, confirmed verbatim in the served bundle: `outline: 2px solid var(--v2-sky)` with `outline-offset: 3px`, so the page background is the adjacent colour. `--v2-sky` = `#3e96f9`.

| Ring vs adjacent | Ratio | vs 3.0 required |
|---|---|---|
| `#3e96f9` vs `--v2-page #faf7f3` (dominant background) | **2.84** | **FAIL** |
| `#3e96f9` vs `--v2-paper #f5f2ec` | **2.71** | **FAIL** |
| `#3e96f9` vs `#ffffff` (cards) | 3.03 | marginal pass |
| `#3e96f9` vs `--v2-ink-deep #060b22` (dark sections) | 6.43 | pass |

`AccessibilityBody.tsx:24` claims *"סימון מוקד (Focus) נראה"*. On the light two-thirds of the site it is below threshold. **Second, worse:** the contact form removes the outline entirely (`ContactForm.module.css:111-115` — `outline: none` plus a glow that computes to **1.27:1** over the panel's `#000000`), and the resting input border `#454545` on `#000000` is **2.19:1**. On the site's primary conversion form, a low-vision user cannot see where the fields are.

**Fix:** `--v2-sky` → `--v2-blue #2447d6` in the focus rule (**6.67:1** on the page background, computed). One line, and it also clears six rows of L7.

### L5 — Three autoplaying looping videos with no pause control

```html
<video src="/videos/v2-hero.mp4?v=2"  data-autoplay muted loop playsInline aria-hidden="true">
<video src="/videos/v2-stats.mp4"     autoPlay      muted loop playsInline aria-hidden="true">
<video src="/videos/v2-hero.mp4?v=2"  autoPlay      muted loop playsInline aria-hidden="true">
```

No `controls`, no pause affordance anywhere on the page. WCAG 2.1 **2.2.2 Pause, Stop, Hide (Level A)**.

`VideoAutopause.tsx:16` selects `video[autoplay], video[data-autoplay]` and calls `play()` on intersection (`:33`) **with no `prefers-reduced-motion` check** — unlike every sibling in the same folder (`useAutoplay.ts:29`, `Reels.tsx:123`, `Reviews.tsx:75`, `StatValue.tsx:51`, `ScrollReveal.tsx:32`, `ProjectsCarousel.tsx:58` all guard on it).

**The widget cannot cover this.** Sienna's `stop-animations` only injects `{transition:none!important; animation:none!important}` — CSS animations only. It cannot pause a `<video>`.

**Fix:** add the `prefers-reduced-motion` guard to `VideoAutopause.tsx` and convert the two bare `autoPlay` attributes to `data-autoplay` so the component is the single gate. Ship it in the same commit as §4.2 — same three files.

### L6 — A tab widget that declares an ARIA contract it does not implement

`TabList.tsx:26-43` renders `role="tablist"` + `role="tab"` + `aria-selected`, used by the four main content filters (`Services.tsx:76`, `BlogIndex.tsx:74`, `Portfolio.tsx:51`, `ProjectsGrid.tsx:38`). Measured on the served homepage:

```
role=tablist  2     role=tab  9 (aria-selected present)     role=tabpanel  0
aria-controls on tabs: none   id on tabs: none   tabindex on tabs: none
aria-live regions on the page: 0
```

No panels to point at, no roving tabindex (all 9 tabs are separate tab stops), no arrow/Home/End handling (`TabList.tsx` has no `onKeyDown` at all), and nothing announces that the result list changed. WCAG **4.1.2 (A)** and **4.1.3 (AA)**.

**Fix — and it is a simplification, not an addition.** These are filters, not tabs. Drop `role="tablist"`/`role="tab"` entirely, use plain `<button aria-pressed>` inside `<div role="group" aria-label="…">`, and add one `aria-live="polite"` result count. If they stay tabs they need panels, ids, `aria-controls`, roving tabindex **and RTL-aware arrow keys** (in `dir="rtl"`, Left = *next*) — five times the work for the same outcome.

### L7 — Text contrast, all traceable to one stray colour

Nearly every failure below is caused by **`#3070de`** — a fourth blue that is not one of the three declared brand tokens, used as a text colour in 13 places.

| Ratio | Needs | Where |
|---|---|---|
| **4.37** | 4.5 | `.prose a` — **the in-article link colour on every blog post and legal page** (`Article.module.css:337`, 15px; `LegalPage.module.css:102`) |
| **4.37** | 4.5 | `.category` chip, 12px (`Article.module.css:53,62`; `BlogIndex.module.css:183`; `RelatedPosts.module.css:144`) |
| **4.37** | 4.5 | `.role` under team names, 14px (`AboutTeam.module.css:115`) |
| **4.07** | 4.5 | selected tab, 16px (`TabList.module.css:32,34`) |
| **3.97** | 4.5 | selected tab, mobile (`Services.module.css:375,377`) |
| 1.28 / 1.89 | 3.0 | tab borders (`TabList.module.css:17,28`) |

`AccessibilityBody.tsx:26` claims *"ניגודיות צבעים העומדת בדרישות התקן בתכנים המרכזיים"* — article body links are as central as content gets.

**Fix:** `#3070de` → `--v2-blue #2447d6` sitewide. One find-and-replace clears rows 1–5 and removes a stray non-brand colour. Scope it before running it: the literal appears **61 times** across the v2 CSS modules — **13 as `color:`** (the failures above), 28 as `background`, 7 as `border-color`, 2 inside local custom properties. The 48 non-text uses are safe to convert in the same pass (white on `#2447d6` = **7.13**, better than it is today), but they are a visual change, not a contrast fix. **For the record, the core palette is fine** and does not need touching: `--v2-paper-ink` on page = 16.61, muted = 5.83, `--v2-blue` on page = 6.67, white on blue = 7.13, article body `#3d4257` = 9.30.

### L8 — Untagged inline English

WCAG 3.1.2 (AA). See §2.1. Trivial, and it is a checkbox on any 5568 audit form.

### L9 — Two smaller items worth one line each

- `ProjectsCarousel.tsx:297-304` — the full-screen lightbox is `role="dialog" aria-modal="true"` with **no accessible name and no focusable child**, containing `<img alt="">`. A screen-reader user lands in an unnamed dialog containing nothing.
- `src/styles/globals.css:77-81` drops the Sienna launcher to `z-index: 9998` while the cookie banner is open — the accessibility control is deliberately placed **behind** another overlay.

### The widget question

Sienna is loaded from an **unpinned third-party origin with no SRI** (`(he)/layout.tsx:99`, `(en)/layout.tsx:90`). The bundle contains an "Authentication Failed / Please log in to your dashboard" panel and links to `sienna.app/verify` — upstream can change licensing behaviour at any time, and three features have already died between deployments. **The site's headline accessibility feature can go dark silently.** It also has **zero RTL support** (`rtl` appears 0 times in the 292 KB bundle; `.asw-mr-15 { margin-right }`, `.asw-footer { text-align: left }`) — the one accessibility control on a Hebrew accessibility vendor's site renders with LTR spacing.

**None of L1–L9 is fixed by the widget, and every one of them is in Aiterra's own code.** That is the argument to make internally: an overlay is not the compliance mechanism, it is a convenience layer on top of one. Whether to keep, pin, self-host or replace it is a business decision — but do not let it defer L1–L5.

*(There is a content angle here too, and it is genuinely first-party: nobody in Israel has published measured LCP/INP/TBT for EqualWeb vs Nagish vs Vee vs Sienna. Aiterra runs Sienna and has the numbers in §4.4. That is 03/04 scope, noted here so the measurement is not thrown away.)*

---

## 7. AI / LLM visibility

**Short by design. This is not a separate channel and it does not get its own budget.** It changes exactly two decisions, and everything actionable is already covered elsewhere.

**What is already correct:** `src/app/robots.ts` explicitly allows GPTBot, ClaudeBot, PerplexityBot, Applebot-Extended, CCBot, Amazonbot, OAI-SearchBot, ChatGPT-User, Perplexity-User, Claude-User, Claude-SearchBot and Google-Extended, each with `allow: '/'` and only `/admin` + `/api/admin` disallowed. Nothing to do.

**What is genuinely interesting:** AI research agents are already surfacing this site, and the GSC query log proves it. Agent instructions and exclusion chains leak into the log verbatim:

| Query (verbatim from the GSC export) | Impr | Position |
|---|---|---|
| `make web search for the following query: "כמה עולה שירות תחזוקת אתרים וניהול שרתים בחודש?"` | 5 | **3.6** |
| `make web search for the following query: "מה כוללת תחזוקת אתר שוטפת ולמה היא חשובה?"` | 2 | **3.5** |
| `"צריך אתר תדמית" -site:reddit.com -site:twitter.com -site:x.com …` | 1 | 3.0 |
| `"בונה אתרים לעסק קטן" -site:reddit.com …` | 1 | **1.0** |
| `"מכירים בונה אתרים" -site:reddit.com …` | 1 | **1.0** |

~21 impressions at positions 1.0–3.6. Excluded from keyword scoring — they are not human demand — but **the signal is real and it points somewhere specific: both agent-issued research queries are maintenance questions, and Aiterra ranks 3.5–3.6 on them** while ranking 18–55 for the same topic in human search.

That is one more independent line of evidence for the maintenance pillar (01-competitors §1), from a source the competitors are not looking at.

**The three things that actually improve AI-surface visibility, and where they already live:**

| Lever | Already specified in | Why it is the AI lever too |
|---|---|---|
| Clear entity definition | **§3.1 D1, §3.5, §5.2** — `sameAs`, `geo`, `founder`, `contactPoint`, a real GBP | An answer engine needs to resolve "Aiterra" to something. `sameAs: []` gives it nothing to corroborate against |
| Directly quotable answers | **§3.4** — the FAQ markup that buys no SERP real estate buys this instead. **§5.5** — the same questions seeded into GBP Q&A | Assistants lift a self-contained 40–60 word answer. Aiterra already has 40 posts × 4–5 FAQ items in `data/blog-posts.json`. The asset exists; the value is on a different surface than the one it was built for |
| Consistent NAP | **§5.7** | Already byte-identical sitewide. Keep it that way across the directory push |

**Two things not to do.** Do not build an `llms.txt` — no major assistant consumes it. And do not treat GEO as a traffic bet: `/blog/geo-ai-search-optimization` sits at **pos 88.9**, the space is already occupied, and 01-competitors §4.3 downgraded it from "open ground" to "contested — real, small, already colonised". Keep the post as differentiation material and AI-answer fodder, not as a channel.

One thing that *is* worth doing and costs nothing: **fix the Cloudflare email obfuscation (L2).** Every AI crawler `robots.ts` allows currently reads Aiterra's contact address as the literal string `[email protected]`.

---

## 8. The `/landing` defect

A second, unrelated Next.js application is publicly live on the production domain. **The owner has confirmed this is not intentional.**

### 8.1 What it actually is — fetched, not inferred

```
https://www.aiterra.co.il/landing          200, 88,527 bytes
https://www.aiterra.co.il/landing/en       200
https://www.aiterra.co.il/landing/         308 -> /landing
https://www.aiterra.co.il/landings         404
https://www.aiterra.co.il/landings/ecomerce 404
```

It is a **complete, well-built, 1,030-word Hebrew sales page for landing-page services** — a service Aiterra has no service page for. Its own build (`/landing/_next/`, turbopack), its own fonts (Heebo + Tel Aviv Brutalist + Tel Aviv Modernist), its own legal pages (`/landing/accessibility`, `/landing/privacy`, `/landing/terms`), its own English version, and its own `FAQPage` JSON-LD.

```
<title>דפי נחיתה שהופכים קליקים ממומנים לשיחות | Aiterra</title>
H1  משלמים על קליקים?
H2  דפים שבנינו, חיים עכשיו. / שלוש סיבות שקליקים לא הופכים לשיחות. /
    דף שעובד, לא דף שיפה. / מה בקופסה. ומה לא. / חדר הבקרה שמגיע עם כל דף. /
    יום ראשון, שיחה. יום ארבעה־עשר, באוויר. / אין כאן מחירים… / השאלות שבאמת שואלים
```

It showcases six real client sites (karin-cohen.com, maayan-cosmetics.com, hofit-cosmetics.com, neotsade.co.il, elibenyizhak.com, onetablet.com). **This is not junk. Somebody wrote it properly.**

### 8.2 What is wrong with it — six defects, all verified today

| # | Defect | Evidence |
|---|---|---|
| 1 | **Every CTA on the page points at a placeholder phone number** | `curl /landing \| grep -o 'wa\.me/[0-9]+'` → **`wa.me/972000000000`**, the only value. No `tel:` and no `mailto:` anywhere on the page. Every conversion path on a live, indexable sales page is dead |
| 2 | Canonical points at a **redirecting** host | `<link rel="canonical" href="https://aiterra.co.il">` — the apex, which 301s to www. A canonical that is itself a redirect is invalid, **and** it is a duplicate-homepage claim: this page declares itself a copy of the site's homepage |
| 3 | `index, follow` | It invites indexing while making that duplicate-homepage claim |
| 4 | `hreflang="en"` → a 404 | `<link rel="alternate" hrefLang="en" href="https://aiterra.co.il/en">` — `/en` is 404 in production today |
| 5 | `lang="en"` on a Hebrew page | `<html lang="en">` with an entirely Hebrew title, H1 and body |
| 6 | **It swallows `/landings/*` and killed a page that was earning clicks** | The 404 body for `/landings/ecomerce` is served by the *second* app — its assets are under `/landing/_next/static/…` and it carries the second app's own `<title>`. A reverse-proxy rule matching the **prefix** `/landing` intercepts `/landings/*`. The main app's `src/app/(he)/landings/ecomerce/page.tsx` (committed as `afda28c`) serves 200 on the dev server and is unreachable in production. GSC: `/landings/ecomerce` earned **18 impressions / 1 click / avg pos 26.1** over 89 days and now inspects as **"Not found (404)", last crawled 2026-09-05** |

Also: `/landing/robots.txt` and `/landing/sitemap.xml` both 404, the app is absent from the main sitemap, and the `/landings/ecomerce` 404 body serves **two conflicting `<meta name="robots">` tags** (`noindex`, then `index, follow`).

**One piece of good news:** GSC inspection of `https://www.aiterra.co.il/landing` returns **"URL is unknown to Google"**. No damage has landed yet. This is a defect to fix, not an incident to clean up — but only until Google finds it.

### 8.3 The fix

**Immediately, today — stop the bleeding, in this order:**

1. **Change the proxy rule from a prefix match to an exact-path match** (`= /landing` and `^/landing/`, not `/landing`). This alone restores `/landings/ecomerce` — a URL with 18 impressions and 1 real click — and it is the only item here that recovers something already lost.
2. **`noindex` the second app** until its fate is decided. It is a live, indexable, duplicate-homepage claim with dead CTAs.
3. **Fix or remove `wa.me/972000000000`.** If the page stays up for one more hour it should at least be reachable.

**Then, the actual decision — and it is a content decision, not an infrastructure one.** The page is good and the service is real. Three options, in order of preference:

| Option | What it means | When it is right |
|---|---|---|
| **A — Port it in** *(recommended)* | Move the copy into the main app as `/services/landing-pages`, a normal `servicePages` entry. It inherits the correct canonical, hreflang, `lang="he"`, breadcrumbs, `Service` schema, the real contact form, the footer NAP, sitemap inclusion and internal links — every one of the six defects disappears as a side effect. Then **delete the second deployment entirely.** | Almost certainly. This is 1,030 words of finished Hebrew sales copy for a service with real client proof, and the main app already has the machinery it is missing |
| **B — Keep it separate, fix it properly** | Own canonical, own robots + sitemap, `lang="he"`, real phone, path moved off the `/landing` prefix collision | Only if there is a deployment reason this cannot live in the main app. Note the ongoing cost: a second app is a second set of everything in sections 1–6, forever |
| **C — Delete it** | 301 `/landing` → `/services` | If the landing-page service is not actually being sold. But then also delete `/blog/landing-pages-that-convert` and the landing-page keyword targets in `02-keywords-he.csv` — do not keep the keywords and throw away the only asset |

**Before choosing, pull `דף נחיתה מחיר` and `כמה עולה דף נחיתה` from Keyword Planner** — both are `[unverified]` targets in `02-keywords-he.csv` (pillar `paid-ads`, `realistic_shot_12mo: Medium`). If they carry real volume, option A is clearly right and the page becomes a money page. If they do not, option A is still right, because it costs an afternoon and removes six defects.

**Whichever option: do not leave it as it is.** The current state is a publicly indexable page that claims to be a duplicate of the homepage, has no working call to action, and is breaking a different URL that was earning clicks.

---

## Keyword Planner pull list

**No absolute search volumes exist for this project.** Every figure in this plan is GSC impressions, a Trends *relative* index, an observed SERP, or explicitly `[unverified]`. The owner has accepted shipping this way. These are the ~20 Hebrew terms whose absolute volume would actually change a decision — pull them together, in one Keyword Planner session, geo=Israel, language=Hebrew, and record the numbers back into `02-keywords-he.csv`.

**Everything else can stay unverified.** These are the ones where the number changes what gets built.

| # | Term | Currently | The decision it changes |
|---|---|---|---|
| 1 | תחזוקת אתר | GSC: 170 impr/89d @ pos 18.4 | **The single most load-bearing number in the plan.** Trends returns **0 for `תחזוקת אתרים` in 155 of 157 weekly buckets** (geo IL, 12mo) against `בניית אתרים` at 100 — the pool is below Trends' rounding floor. Build `/services/maintenance` either way (best positions on the domain, recurring-revenue lead shape, nobody has claimed it). But if absolute volume is under ~100/mo, **cap the maintenance content programme at 2–3 posts instead of the six proposed in 01-competitors §5** |
| 2 | תחזוקת אתר אינטרנט | GSC: 141 @ 26.5 | Which phrasing becomes the H1 of `/services/maintenance`. Google's own autocomplete prefers the `אינטרנט` disambiguator; if volume agrees, it leads |
| 3 | תחזוקת אתרים מחיר | GSC: 197 @ 55.9 | Whether the price table is the service page's primary section or a secondary block. 271+197 impressions say the money intent is on `מחיר` variants |
| 4 | אחזקת אתר | GSC: 82 @ 22.3 | Whether the `אחזקה` spelling gets its own H2 and FAQ entry, or is folded into the `תחזוקה` copy as a synonym |
| 5 | כמה עולה תחזוקת אתר | GSC: 47 @ 19.4 | Whether the existing post stays a `כמה עולה` article or is rewritten around the service page. Pos 19.4 is the best position anywhere in the `מחיר` / `כמה עולה` money cluster — five commercial rows on the property rank better (`חיבור וואטסאפ api` 14.6, `כרטיס עסק` 15.0, `בניית אתרים בת ים` 15.6, `מיתוג דיגיטלי` 16.8, `תחזוקת אתר` 18.4), so do not sell it as "the best position on the site" |
| 6 | בניית אתרים בת ים | GSC: 28 @ 15.6 | **The GBP-vs-page decision.** A full 48-probe autocomplete expansion returns **zero suggestions** — below Google's suggestion threshold. If Planner also says ~0, cap the local play at GBP + d.co.il + b144 (§5) and do **not** build `/services/web-development-bat-yam` |
| 7 | קידום אתרים בת ים | GSC: 4 @ 65.8 | Same, for the SEO side. Almost certainly too small; the number closes the argument |
| 8 | אתר תדמית מחיר | `[unverified]` | Whether `/services/brochure` — the single most commercially important URL, and **unknown to Google today** — gets a real ₪ price table (with `Offer` markup per §3.6) or stays a brochure |
| 9 | כמה עולה אתר תדמית | `[unverified]` | Same cluster; decides whether `/blog/website-cost-israel-2026` is refreshed or rebuilt |
| 10 | בניית אתר תדמית לעסק | `[unverified]` | Whether the commercial modifier `לעסק` is worth targeting. In Trends' related-queries list for the head term `בניית אתרים` (geo IL), the commercial modifier `בניית אתרים לעסקים` sits at relative index **14** against `בניית אתרים בחינם` at **100** (01-competitors §2) — the head term's intent is majority Skip. That index is for the head-term modifier, **not** for this phrase; this phrase has no measurement at all |
| 11 | ניהול קמפיין ממומן בגוגל | GSC: 288 @ 23.7 | The best usable position in the paid-ads pillar. Volume decides whether `/blog/google-ads-campaigns` gets a serious upgrade or is left alone. **Trends puts `ניהול קמפיינים בגוגל` at relative index 0 across the entire 12-month daily series** — that contradiction needs resolving before any budget lands here |
| 12 | כמה עולה קידום אתרים בגוגל | GSC: 69 @ 42.2 | Whether the restored `/services/seo` leads with a price table. The `מחיר` sub-cluster is the **only** winnable slice of a pillar 01-competitors marks "Lost" |
| 13 | קידום אורגני מחיר | GSC: 2 @ 21.5 | Same decision, and the term where `avinu` renders the price-range rich result §3.6 wants to copy |
| 14 | דף נחיתה מחיר | `[unverified]` | **Directly gates §8.** Real volume → `/landing` becomes `/services/landing-pages` and a money page. No volume → option A is still right, but it is a cleanup, not an investment |
| 15 | כמה עולה דף נחיתה | `[unverified]` | Same |
| 16 | בניית אתר שופיפיי | Trends only | Whether the Hebrew transliterations get their own pages. **`שופיפיי` and `ווקומרס` appear nowhere on the site today** — this is the entire Israeli-integration long tail 01-competitors §3.3 identifies as structurally closed to international competitors |
| 17 | סליקה ווקומרס | `[unverified]` | Whether `/services/ecommerce/woocommerce` is built, or the integration content stays on the blog |
| 18 | חיבור סליקה שופיפיי | `[unverified]` | Same, for the Shopify side. These three together decide roughly 6 pages of the e-commerce plan |
| 19 | וואטסאפ עסקי api | SERP only | The whole automation pillar's size. 01-competitors already stripped **63% of automation's raw impressions** as wrong-audience (industrial + DIY). If this is also small, automation drops below branding in priority |
| 20 | הנגשת אתרים מחיר | GSC: 1 @ 63.0 | Whether the ת"י 5568 regulatory angle is a content pillar or a section. **Note the CSV disagrees with itself** — `הנגשת אתרים מחיר` is a `Target` in the `web-dev` pillar and `EXCLUDED` in `maintenance` and `branding-local`. Resolve with the number. Relevant beyond keywords: it is the service §6 says the site currently fails to demonstrate |
| 21 | תקן 5568 | GSC: pos 55.0 | Same cluster. `חברה להנגשת אתרים` already sits at **pos 21.0** off a Bat Yam blog post — the regulatory angle is the one thing already working locally |

**Two things to pull at the same time, since the session is open:**
- Planner's own suggestion list for `תחזוקת אתר` and `בניית אתרים בת ים`. Both sit below Google's autocomplete threshold, so Planner's suggestions are the only remaining view of their long tail.
- The **`ביקורות` / `המלצות` + `<competitor brand>` family**. Nobody has measured how much review-intent search exists in this market, and §5 is the largest single bet in this plan.

**Do not pull, and do not let anyone add them back:** the 149 `EXCLUDED` rows in `02-keywords-he.csv`, and any query containing `weblinks.co.il` or `ביטויים ללא נפחי חיפוש` — those ~130 impressions are a competitor's rank-tracker spreadsheet pasted into Google, not demand.

**When the numbers come back:** update the `volume` and `volume_source` columns in `02-keywords-he.csv` (verified counts today: 411 rows — 262 `Target`, 149 `EXCLUDED`; 122 `GSC`, 73 `unverified`, 51 `SERP`, 16 `Trends`). Then revisit these six decisions and no others:

1. **Rows 1–5** → the size of the maintenance content programme: six posts (01-competitors §5) or two-to-three.
2. **Rows 6–7** → build one Bat Yam page, or stop at GBP + d.co.il + b144 (§5.4's one-page cap holds either way).
3. **Rows 8–10** → whether `/services/brochure` gets a real ₪ price table with `Offer` markup (§3.6).
4. **Rows 11–13** → whether `/blog/google-ads-campaigns` gets a serious upgrade, and whether the restored `/services/seo` leads with a price table.
5. **Rows 14–15** → §8 option A as an investment (a money page) or as a cleanup.
6. **Rows 16–18** → whether `/services/ecommerce/woocommerce` and the Shopify counterpart get built, or the integration content stays on the blog.

Rows 19–21 resolve pillar *priority* (automation vs branding; ת"י 5568 as pillar or section) rather than a build decision. Nothing else in this plan is waiting on any of them.
