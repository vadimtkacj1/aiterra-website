# AI visibility tracker

Measures whether AI assistants and Google's AI Overviews mention or cite aiterra.co.il for the
questions our buyers actually ask. It is the cheap, self-run version of Semrush's AI Visibility
Toolkit (~$99/mo) and Ahrefs Brand Radar ($199–699/mo on top of a base plan).

Each run sends every prompt in [prompts.json](prompts.json) to ChatGPT, Perplexity, Gemini and
Claude with web search on (country IL), and each prompt's `keyword` to Google (Israel, Hebrew,
mobile, top 20, AI Overview loaded). All calls go through DataForSEO's pay-as-you-go API.

## Setup

1. Register at [dataforseo.com](https://dataforseo.com/) — no card, $1 of trial credit.
2. Copy the API login and password from <https://app.dataforseo.com/api-access> into `.env`:

   ```
   DATAFORSEO_LOGIN=...
   DATAFORSEO_PASSWORD=...
   ```

3. Check the model names — they change. This call is free:

   ```
   npm run ai-visibility -- --models
   ```

   Put the names you want into `models` in `prompts.json` (pick ones marked `[web search]`).

## Running

```
npm run ai-visibility -- --dry-run                          # show the calls, spend nothing
npm run ai-visibility -- --engines chat_gpt,google --limit 3 # first paid test
npm run ai-visibility                                       # full panel, monthly
npm run ai-visibility -- --runs 3                           # each chat prompt 3 times
```

The script prints the real cost of the run from DataForSEO's `cost` field. Start small, then
run the full panel once a month — ideally the same day each month.

`--runs 3` asks each chat engine the same prompt three times (Google is asked once). The same
prompt returns the same brand list less than once in 100 tries (SparkToro, January 2026), so a
single answer says little; the share of runs that name us is the number to track. It triples the
cost of the chat calls — check with `--dry-run --runs 3` first.

## Output

- `runs/<timestamp>.json` — every answer in full, the sources each engine cited, and the fan-out
  queries where the engine reports them. Read these: they show *why* we are or aren't cited.
- `history.csv` — one row per engine × prompt per run, for trend charts.

| Column | Meaning |
|---|---|
| `mentioned` | The answer text names Aiterra (`aiterra`, `אייטרה`, `איטרה`) |
| `cited` | A cited source is on aiterra.co.il — the one that sends traffic |
| `citationRank` | Our position among the cited sources |
| `organicRank` | Google only: our organic position within the top 20 |
| `aiOverview` | Google only: an AI Overview was shown for the keyword |
| `run` | Which repeat of the prompt this row is (1 without `--runs`) |
| `citedLinks` / `ourLinks` | All source links in the answer, and how many of them are ours |

The console summary also prints:

- **citation share** — our links ÷ all links cited by the chat engines. This is share of voice by
  sources; it does not need a competitor list.
- **per-prompt table** — mentioned and cited out of all answers, and a **gap** label where no
  answer names or cites us: `forums` when most of the top cited domains are Reddit, Quora, Tapuz,
  FXP or Facebook (answer there, honestly), `third-party` otherwise (directories, reviews, media,
  YouTube — get onto those pages). If we have no page on the topic at all, the fix is our own
  page; the script cannot tell that, check the site.
- **most common fan-out queries** — the sub-searches the engines ran. They show which
  sub-questions ("best", "reviews", the year) a page must also answer.

## Reading it honestly

- AI answers vary between runs. One run proves nothing; a trend over three or more months does.
  Before blaming an engine for a dip, check Search Console impressions for the same pages.
- Prompts in `prompts.json` stay fixed between runs. New prompts should come from real customer
  wording — the AI grounding queries in the Bing Webmaster query log, lead forms, WhatsApp — not
  from "prompt volume" tools. Add them as new ids; never edit an existing one.
- Most AI-influenced visits arrive as ordinary search. Track branded queries (`aiterra`,
  `אייטרה`) in Search Console next to this tracker.
- `mentioned` without `cited` usually means the engine knows the brand but found a better
  source for the answer — that points at the page, not at the brand.
- "Most cited other domains" in the console summary is the competitor list that matters for
  AI search. It is often not the same list as Google's top 10.

Referral traffic from chatgpt.com, perplexity.ai and gemini.google.com shows up in GA4 on its
own; it is the free companion to this tracker.
