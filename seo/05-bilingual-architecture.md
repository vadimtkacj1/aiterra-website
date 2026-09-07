# 05 — Bilingual architecture

**Scope set at Checkpoint 0: (A) thin English shell.** 5–8 pages, no `/en/blog`, no English content programme. Everything here serves that decision.

Method note: the English tree was audited by *executing* `pageMetadata()` through a resolve hook and by loading the real content modules with `node --experimental-strip-types` and re-implementing `mergeV2`, not by reading code and inferring. Word counts are measured, not eyeballed. `npx tsc --noEmit` exits 0.

---

## 1. The five routing decisions

### 1.1 `x-default` → **Hebrew**. Change it.

`src/lib/metadata.ts:64` currently emits `{ 'he-IL': hePath, en: enPath, 'x-default': enPath }`.

**This is not live** — production emits `he-IL` + `x-default` both pointing at the Hebrew URL, because `/en` isn't deployed and the change is uncommitted. It fires the moment English ships.

The argument for leaving it as English is conventional: `x-default` is meant for the version aimed at no particular locale, and bare `en` is more locale-agnostic than `he-IL`. The argument for Hebrew is the data:

```
GSC country split, 12 months
  isr   5,739 impressions   (~99%)
  gbr      12
  deu       9
  everything else: single digits
```

A `.co.il` domain, 99% Israeli demand, and an English side that is a deliberate 8-page shell. `x-default` is served to searchers matching neither annotation; sending them to a 3,607-word shell instead of a 70-URL Hebrew site is the wrong default.

**Decision: `'x-default': hePath`.** One line. Low confidence that it matters much — it governs only the 6–8 paired URLs, and only for a residual unmatched segment — but it is free and it points the right way.

*Also worth fixing:* the granularity is inconsistent — `he-IL` (language+region) sits next to bare `en`. Make them consistent.

### 1.2 Hebrew-only service pages emit **no** hreflang — verified correct, leave alone

The brief asked whether the 4 Hebrew-only service pages emit a broken one-way pair. They do not. `metadata.ts:57-65`:

```ts
const alt = altPath ? normalizePath(altPath) : undefined
const hePath = locale === 'he' ? canonical : alt
const enPath = locale === 'en' ? canonical : alt
const languages = hePath && enPath ? { … } : undefined
```

With no `altPath`, `enPath` is `undefined`, so `languages` is `undefined` and only `canonical` survives. Confirmed by execution:

```
HE /services/ecommerce (no alt)  -> {"canonical":"/services/ecommerce"}
HE /services/brochure  (no alt)  -> {"canonical":"/services/brochure"}
HE /  (altPath /en)              -> {"canonical":"/","languages":{"he-IL":"/","en":"/en","x-default":"/en"}}
```

The gate is `(he)/v2/services/[slug]/page.tsx:37-40` against `EN_SERVICE_SLUGS = ['web-development','seo','development']`, with a mirror gate on the EN side. **This is correct behaviour. Do not touch it.**

**Reciprocal pairs today:** `/en`↔`/`, `/en/services`↔`/services`, `/en/projects`↔`/projects`, `/en/about`↔`/about`, `/en/contact`↔`/contact`, `/en/services/development`↔`/services/development`. Six clean pairs, zero one-way, zero broken.

**Two edge cases that need a decision:**

- ~~**`/en/services/seo` has no counterpart and emits no hreflang at all.**~~ **Corrected 2026-09-07 — this pair works.** `'seo'` *is* a key in Hebrew `servicePages` (`content.ts:1663`, one-space indent; the original audit's regex missed it). Verified on a local dev server: `/services/seo` returns 200 and emits `he-IL` → `/services/seo`, `en` → `/en/services/seo`, plus `x-default`. So the strongest page in the English tree **is** paired, and `/services/seo` is a real 738-word Hebrew page, not a gap. Nothing to fix here. *(True only in the working tree — HEAD still 308s `/services/seo` away, which is why the atomic commit in §4 matters.)*
- **`/en/services/web-development` is reciprocal only by coincidence.** It works because the working tree simultaneously re-added a `web-development` entry to `servicePages` *and* deleted the `/services/web-development → /services/brochure` redirect. **If either half ships without the other, this becomes a hreflang pair pointing at a 308.**

### 1.3 `/en/blog` — **no.** Confirmed.

Per Checkpoint 0. No English blog, no English versions of ecommerce/brochure/marketing/branding, no `/en/projects/[slug]`. The ceiling is the floor: **8 URLs** (11 if English legal pages are added — see §2.4).

### 1.4 Sitemap — **one sitemap, with `xhtml:link` annotations**

The site is small (70 → 78 URLs). A sitemap index buys nothing at this scale and adds a moving part.

Required changes to `src/app/sitemap.ts`:
1. Add `alternates: { languages: { 'he-IL': …, en: … } }` to the **6 paired entries**. It currently emits `url`/`lastModified`/`changeFrequency`/`priority` only, so Next declares no xhtml namespace and emits zero hreflang annotations. This is a free second signal independent of the HTML `<link>` tags.
2. Emit real per-URL `lastmod`. Today 67 of 70 URLs carry one flat date, three months stale.
3. Do **not** add `alternates` to unpaired URLs — an annotation without a reciprocal counterpart is worse than none.

**Also clean up GSC.** Two sitemaps are registered:

| Path | Host | URLs | Last downloaded |
|---|---|---|---|
| `https://aiterra.co.il/sitemap.xml` | **redirecting apex** | 70 | 2026-09-03 |
| `https://www.aiterra.co.il/sitemap.xml` | correct www | 57 | 2026-08-27 (stale) |

Remove the apex entry, resubmit the www one.

### 1.5 Auto-redirect by browser language — **no.** Confirmed, and not currently implemented.

The switcher is the correct mechanism and it is already built and crawlable. `(he)/v2/components/Header.tsx:47-51` routes every nav item through a real `next/link`; both directions are declared as content (`content-en.ts:31` → `/`, `content.ts:36` → `/en`). The visible affordance is a flag SVG with the label in an `sr-only` span — still in the DOM, still crawlable. **This is a real `<a href>` in both directions, not a JS-only switcher.**

One gap: the HE→EN link exists only in the header nav; the Hebrew footer (`content.ts:710-742`) has no English link.

---

## 2. What should actually ship

Measured body word counts (chrome excluded; header/footer/form = 142 words on every page):

| # | Route | Title (chars) | Body words | Unique | Verdict |
|---|---|---|---|---|---|
| 1 | `/en` | 47 | 1,505 | 442 (29%) | **Ship as-is** |
| 2 | `/en/services/seo` | 62 | 936 | 903 (96%) | **Ship as-is** — strongest page in the tree |
| 3 | `/en/services/web-development` | 59 | 833 | 789 (95%) | **Ship as-is** |
| 4 | `/en/services/development` | 57 | 777 | 753 (97%) | **Ship as-is** |
| 5 | `/en/about` | 63 | 529 | 379 (72%) | **Ship as-is** |
| 6 | `/en/contact` | 53 | 83 | 83 (100%) | **Ship as-is** — thin *and correct* |
| 7 | `/en/services` | 59 | 907 | **187 (21%)** | **Gate on fix** |
| 8 | `/en/projects` | 65 | 252 | **71 (28%)** | **Gate on fix, or cut** |

**Total unique English body copy: 3,607 words.**

The metadata is the best thing in the tree — all 8 titles 47–65 chars, all 8 descriptions 143–180, none templated, none duplicated. Nothing to fix there.

### 2.1 `/en/services` — 71% recycled

647 of its 907 words are the **same 10-question FAQ block already on `/en`**, and both pages emit a `FAQPage` JSON-LD with identical Q&A. Strip it and the hub is 3 service teasers (162 words) plus a page hero. The Hebrew site avoids exactly this: `(he)/v2/services/page.tsx:32` pulls a separate admin-managed set via `getFaqData('/services')`.

**Fix:** give the hub its own 4–5 questions, or drop the FAQ and add a "which of the three do you need" comparison block. The comparison is better — it serves the actual job of a services hub.

### 2.2 `/en/projects` — 71 unique words, and it exports its equity

All 10 project cards link **out** to client domains (`content-en.ts:485…557`). There is no `/en/projects/[slug]` route. 181 of its 252 words duplicate the portfolio block on `/en`. It also renders a **Hebrew footer** (§2.3).

**Fix:** add ~40 words of English case context per project (goal, stack, outcome) and point card CTAs at an on-site anchor — **or cut the page**, remove "Work" from the EN nav (`content-en.ts:23-29`) and drop it from `sitemap.ts:69`. Do not ship it unchanged; a nav-linked dead end that passes all its equity offsite is worse than no page.

### 2.3 Hebrew leaking into English

| Defect | Location | Effect |
|---|---|---|
| Hebrew footer on `/en/projects` | `(en)/en/projects/page.tsx:57` — `<Footer>` with no `locale` prop; `v2-content-server.ts:65` defaults to `'he'` | 8 Hebrew links + Hebrew address on a `lang="en"` page |
| Logo links to Hebrew homepage | `(he)/v2/components/Header.tsx:101` — `<Link href="/">` hardcoded | The most prominent link on all 8 EN pages dumps the user into Hebrew |
| Hebrew `Organization` JSON-LD | `(en)/layout.tsx:122` → `OrganizationSchema.tsx:25,37-46,50-60` | Hebrew `description`, address, `areaServed`, `knowsAbout` on every English page |

The first two are one-line fixes. The third matters more than it looks: the machine-readable identity of the business on the English pages is entirely Hebrew — wasted on exactly the surfaces (AI answers, knowledge panels) a thin shell most needs. Parameterise by locale but **keep the same `@id`** (`${SITE_URL}#organization`) so it stays one entity.

Only **one** literal Hebrew string exists in the entire `(en)` tree: the switcher's `'עברית'` label (`content-en.ts:31`). That one is correct.

### 2.4 No English legal pages

`content-en.ts:454-456` (footer) and `:413,415` (consent checkbox) link to `/accessibility-statement`, `/terms-of-use`, `/privacy-policy` — all Hebrew-only. That is **3–5 links into Hebrew from every English page**, and the consent copy renders on all 8.

For the accessibility statement specifically: a statement the reader cannot read is arguably not a statement.

**Recommendation:** add `/en/accessibility-statement`, `/en/terms-of-use`, `/en/privacy-policy` using the existing `LegalPage` component. This pushes the tree to **11 URLs**. That is the right call — legal pages are not content-programme scope creep, and they do not need to rank.

### 2.5 Latent Hebrew fallback

`getV2ContentEn()` (`v2-content-server.ts:73-80`) deep-merges EN over Hebrew defaults, so **10 content keys with no EN override remain Hebrew**: `projectPage, projectBanner, reels, reelItems, clientStories, clientStoryItems, reviews, reviewItems, article, legal` — plus 277 Hebrew strings under `servicePages` for the 4 HE-only slugs.

None are reachable from the current 8 routes. But **the first person to add `<Reviews />` to an English page ships Hebrew with no error.** Make `getV2ContentEn()` log or throw on an unoverridden key, or type `contentEn` as `V2Content` instead of `Partial<V2Content>` so TypeScript enforces completeness.

---

## 3. Positioning — English is the better proposition, and it has no geography

| | English | Hebrew |
|---|---|---|
| H1 | "Custom web development and SEO agency" | "סוכנות בניית אתרים ושיווק דיגיטלי" |
| Tags | Engineering · SEO · Platforms · Growth | שיווק · פרסום · קריאייטיב · קידום |
| Service tabs | **3**: web dev · SEO · custom platforms | **5**: שיווק · פיתוח · מיתוג · אתרי תדמית · אתרי מסחר |
| Signature claim | "100% code ownership" — "the agency that designs it cannot build it, the developer who builds it cannot rank it… We keep all of it in one team" | full-service digital agency framing |

**This was written, not translated.** Different taxonomy, different stats, different objection-handling. The code-ownership / no-lock-in promise appears nowhere in the Hebrew copy.

**The one real failure: the English tree has no geographic signal at all.** `grep -niE "israel|tel aviv|bat yam"` across `content-en.ts`, `content-en-services.ts` and all of `src/app/(en)/` returns **zero hits in user-facing copy**. The only geographic signal anywhere is `OFFICE_ADDRESS_EN` in the footer.

3,607 words competing globally for "custom web development agency" will rank nowhere — that was accepted at Checkpoint 0. But the same words competing for **"web development agency Israel"** plausibly place, and it costs nothing: work Israel / Tel Aviv into the `/en` H1 area, the `/en/about` intro, and 2–3 meta descriptions. **This is the only English-side change with real ranking upside, and it is why `02-keywords-en.csv` is scoped the way it is.**

---

## 4. Launch sequence — in order, no reordering

1. **Commit the whole tree to a branch today.** 180 untracked files, 164 deletions, 10 modified, in one atomic commit. Before any SEO work. Five minutes. *(See `00-audit.md` §0 — `sitemap.ts` is tracked and imports untracked `content-en.ts`, so a partial commit produces an unbuildable `main`.)*
2. **Commit `next.config.ts` and `content.ts` together, never separately** (`00-audit.md` §0.1). The redirects are deleted in the tracked config; the replacement pages are in the untracked content file. Add `export const dynamicParams = false` to the HE service route.
3. **Reconcile `EN_SERVICE_SLUGS` with the redirect list.** They must agree, or `/en/services/web-development` claims a hreflang alternate that 308s.
4. Fix the three cheap leaks: `<Footer locale="en">`, locale-aware logo href, English legal pages (or absolute Hebrew legal links).
5. Fix or cut `/en/services` FAQ and `/en/projects` case copy.
6. `x-default` → `hePath`; add `alternates` to the 6 paired sitemap entries.
7. **Build and verify before deploy:** `/services/seo` still resolves; `/en/projects` renders an English footer; `/en/blog` and `/en/garbage` return a styled 404.
8. Deploy. Then remove the apex sitemap from GSC, resubmit `https://www.aiterra.co.il/sitemap.xml` (70 → 78 URLs), and request indexing for `/en`.

### One unverified item

There is no `src/app/not-found.tsx` — only `src/app/(he)/not-found.tsx`. With two root layouts each rendering their own `<html>`, a globally-unmatched URL such as `/en/blog` may have no root not-found to render. **[unverified — needs `next build` plus a request to `/en/blog`]** Resolve at step 7.
