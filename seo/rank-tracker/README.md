# Rank tracker (Search Console)

Our own position tracker: every run asks Google Search Console for the last 7 full days,
takes the keywords in [keywords.txt](keywords.txt), and appends one row per keyword to
`history.csv` (impressions, clicks, average position, the page Google showed most). It
costs nothing and has no rate limit worth mentioning, because it uses Google's own API
for our property instead of scraping result pages.

What it cannot do, and why DataForSEO still exists: it does not see competitors'
positions (Search Console only reports our site) and it knows nothing about backlinks
(that needs a web-scale link index). For those, use the serp-first-place and link-gap
skills on Vadim's machine, or `node ~/.claude/skills/link-gap/scripts/dataforseo.mjs`.

## One-time setup (owner)

1. Google Cloud Console → create a project (or reuse one) → enable the
   **Google Search Console API**.
2. IAM → Service accounts → create one → Keys → add a JSON key, download it.
3. Search Console → property `sc-domain:aiterra.co.il` → Settings → Users and
   permissions → add the service account's `client_email` as **Full** or **Restricted**
   user.
4. Put the JSON somewhere outside the repo and point the env var at it:

   ```
   GSC_SERVICE_ACCOUNT_FILE=C:\keys\aiterra-gsc.json
   GSC_PROPERTY=sc-domain:aiterra.co.il
   ```

## Running

```
npm run rank-tracker
```

Run it weekly on the same weekday (Search Console data lags about three days, so the
window ends three days before the run). The console prints the table with the change
against the previous run; `history.csv` is the long-term record.

## Reading the numbers

- Position is Google's average over all devices and all places the query was typed from,
  so it is lower than a live reading from one computer. Compare runs with each other,
  not with the incognito readings of the serp-first-place skill.
- `none` means Google showed no page of ours for that query in the window.
- Impressions on deep positions only count when someone scrolled that far; they do not
  measure demand.
