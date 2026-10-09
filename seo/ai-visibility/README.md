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
```

The script prints the real cost of the run from DataForSEO's `cost` field. Start small, then
run the full panel once a month — ideally the same day each month.

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

## Reading it honestly

- AI answers vary between runs. One run proves nothing; a trend over three or more months does.
- `mentioned` without `cited` usually means the engine knows the brand but found a better
  source for the answer — that points at the page, not at the brand.
- "Most cited other domains" in the console summary is the competitor list that matters for
  AI search. It is often not the same list as Google's top 10.

Referral traffic from chatgpt.com, perplexity.ai and gemini.google.com shows up in GA4 on its
own; it is the free companion to this tracker.
