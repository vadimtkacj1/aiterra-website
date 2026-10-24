import type { AdminPost } from '@/lib/blog-server'

export type EnOnlyPost = Pick<
  AdminPost,
  'title' | 'excerpt' | 'content' | 'tags' | 'datePublished' | 'faq' | 'seoTitle' | 'seoDescription'
>

export const postsEnOnly: Record<string, EnOnlyPost> = {
  'affordable-web-development-startup-israel': {
    title: 'How to Choose an Affordable Web Development Company in Israel for a Startup',
    seoTitle: 'Affordable Web Development for Startups in Israel: How to Choose',
    excerpt:
      'A practical guide for founders: which type of web development partner fits each startup stage, what drives the quote, the red flags in cheap offers, and a checklist for comparing Israeli suppliers.',
    tags: ['Web development', 'Startups', 'Israel', 'Choosing a supplier', 'MVP'],
    datePublished: '2026-10-24',
    content: `**TL;DR:** The affordable choice for an Israeli startup is not the lowest quote, it is the supplier whose process matches your stage. Before product-market fit, pay for a small, fast build on a standard stack you fully own, with a fixed scope and a short timeline. Compare suppliers on ownership of code and accounts, who actually writes the code, how changes are priced, and whether the site is ready for search, analytics and Hebrew from day one. A low price that leaves you locked into one freelancer or one proprietary platform usually becomes the most expensive option within a year.

Founders in Israel tend to face the same dilemma: the local market has excellent developers, but senior Israeli rates are high, and offshore teams look cheaper until the coordination cost shows up. This guide is about making that decision with a clear head, whatever supplier you end up with.

## What "affordable" actually means for a startup

For a startup, cost is not only the invoice. It is the invoice plus the time to launch, plus the cost of changing direction, plus the cost of leaving the supplier if it does not work out. A ten-thousand-shekel site that takes four months and cannot be edited without the original developer is more expensive than a slightly pricier one live in four weeks on a stack any developer can pick up.

Three things move the price more than anything else:

1. **Scope.** A marketing site, a web app with user accounts, and a two-sided marketplace are different products. Most early startups need the first and are sold the third.
2. **Custom design versus a design system.** A bespoke visual identity is valuable later. Early on, a clean layout built from a proven component library is usually enough.
3. **Integrations.** Payments, CRM, email, Israeli invoicing software and authentication each add work, testing and risk.

## Which type of supplier fits which stage?

| Supplier type | Best fit | Typical strengths | Typical risks |
|---|---|---|---|
| Freelancer | Landing page, pre-seed validation | Lowest cost, direct contact | Single point of failure, limited QA |
| Small local studio | Marketing site, MVP web app | One team for design, code and SEO, Hebrew and English | Capacity limits during busy periods |
| Large Israeli agency | Funded company, complex brand work | Process, project management, wide skill set | Higher rates, junior staff on your project |
| Offshore team | Well-specified build with an in-house tech lead | Lower hourly rates | Time zones, specification overhead, Hebrew and RTL often weak |
| No-code builder (Wix, Webflow, Framer) | Founders who want to edit everything themselves | Speed, low upfront cost | Platform lock-in, limits on custom logic and performance |

There is no universally right row. A pre-seed founder testing messaging needs a landing page this week; a seed-stage company onboarding paying users needs a maintainable codebase. Our comparison of [freelancers versus web agencies](/en/blog/freelancer-vs-web-agency) goes deeper on the first two rows.

## Red flags in a cheap quote

A low number is fine. A low number that hides these is not:

- **The supplier registers the domain, hosting or analytics in their own name.** You should own every account from the first day, with the supplier invited as a user.
- **No mention of source code ownership.** The contract should state that the code and design files are yours on payment.
- **A proprietary CMS or page builder only they use.** It makes every future change depend on them.
- **"SEO included" with no detail.** Ask what exactly: titles and meta descriptions, a sitemap, structured data, page speed, redirects from an old site.
- **No staging environment.** Changes go straight to the live site, which is how launches break.
- **Unlimited revisions.** It sounds generous and usually means the scope was never defined, so the project drifts.

## Questions to ask before you sign

Good suppliers answer these without hesitation:

- Who will actually write the code, and can I speak to them?
- Which stack do you use, and why for this project?
- How are changes after launch priced, by the hour or by a retainer?
- What does handover include: repository access, credentials, documentation?
- How do you handle Hebrew and English, RTL layout and accessibility?
- Can you show a live site you built for a company at a similar stage, and is that client happy for me to contact them?

If you are working with an Israeli company for the first time, you can confirm that it is a registered business with our [Israeli company lookup tool](/en/tools/company-lookup) before you transfer a deposit.

## Hebrew, English and accessibility: costs founders forget

Many Israeli startups sell abroad from day one and launch in English only. That is often the right call. But if you also sell to Israeli customers or apply for local grants and tenders, a Hebrew version is a different layout, not a translation: right-to-left text, mirrored navigation, mixed-direction strings such as product names and prices, and fonts that render Hebrew properly. Adding it later to a site that was not built for RTL costs more than planning for it.

Accessibility is the other forgotten line. Israeli websites that serve the public are expected to meet the Israeli standard SI 5568, which is based on WCAG. It is far cheaper to build an accessible site than to retrofit one. Our guide to [website accessibility in Israel](/en/blog/website-accessibility-israel) explains what the requirement covers.

## Checklist: comparing web development suppliers in Israel

1. Write a one-page brief: goal of the site, audience, languages, must-have pages and integrations.
2. Ask at least three suppliers of different types to quote on the same brief.
3. Compare quotes line by line, not by the total. Look for what is missing.
4. Confirm in writing that you own the domain, hosting, analytics and code.
5. Check that the stack is mainstream and documented, so another developer can take over.
6. Ask how page speed, mobile layout and SEO basics will be verified before launch.
7. Agree on a fixed scope for version one and a clear price for changes.
8. Ask for a staging environment and a launch checklist.
9. Speak to at least one previous client.
10. Plan the first three months after launch: who fixes bugs, who updates content, at what cost.

## When to build custom and when to stay simple

If your product is the web application, invest in proper engineering: version control, automated deploys, tests on critical flows and a codebase your future hires will not want to rewrite. If the website is a marketing layer for a product that lives elsewhere, keep it lean and editable by the marketing team.

A practical middle path for many startups is a fast marketing site now and a [custom web application](/en/services/development) once the product is validated. Aiterra is one of the Israeli studios that builds both, in Hebrew and English, but the questions above apply to any supplier you consider. You can see how we approach a standard company site on our [web development service page](/en/services/web-development).

## How to keep costs down without cutting corners

Most of the money wasted on startup websites is spent on rework, not on the first build. A few habits keep that waste low regardless of who your supplier is.

**Prepare the content before development starts.** Developers waiting for copy, logos and screenshots is one of the most common reasons projects run late and over budget. Even rough text is better than placeholder text, because layout decisions depend on how long headlines and paragraphs really are.

**Launch a smaller version first.** A homepage, a product page, a pricing or contact page and a blog is enough for most early startups. Case studies, careers pages and integration directories can follow once you know which pages visitors actually use.

**Use what already exists.** A proven component library, a standard form provider and a mainstream hosting platform all reduce custom code, and less custom code means fewer bugs and cheaper maintenance.

**Keep one decision-maker.** Feedback from five co-founders and two advisors, delivered in separate messages, is a reliable way to double a quote. Collect comments internally and send one consolidated round per milestone.

**Measure from day one.** If analytics and conversion tracking are not installed at launch, you lose the data that tells you what to fix next. Our guide to [website analytics tools for Israeli businesses](/en/blog/website-analytics-tools-israel) explains a free setup that is enough for most startups.

## The bottom line

An affordable web development company for a startup is the one that gets you live quickly, keeps you in control of your assets, and does not make the next change expensive. Shortlist on fit for your stage, compare on ownership and process, and only then on price.`,
    faq: {
      title: 'Frequently asked questions about web development for startups in Israel',
      items: [
        {
          q: 'Should an Israeli startup hire a freelancer or an agency for its first website?',
          a: 'For a landing page that validates messaging, a capable freelancer is often enough and is the cheapest route. Once the site needs to support sales, integrations and frequent changes, a small studio becomes better value because design, code, SEO and QA sit in one team and the project does not stop if one person is unavailable. Whichever you choose, insist that the domain, hosting and code are registered to your company from the first day.',
        },
        {
          q: 'Is an offshore development team cheaper than an Israeli one?',
          a: 'The hourly rate is usually lower, but the total is not always. Offshore teams work best when you have a technical lead in-house who can write precise specifications and review code. Without one, the time spent on coordination, rework and time zone gaps eats much of the saving. Offshore teams are also often weaker on Hebrew, RTL layout and Israeli accessibility requirements, which matters if you sell locally.',
        },
        {
          q: 'Is Wix or Webflow good enough for a startup website?',
          a: 'For many early-stage startups, yes. They are fast to launch and the marketing team can edit pages without a developer. The trade-offs appear later: limits on custom logic, performance constraints, and difficulty moving away from the platform. If your website is purely a marketing layer, a no-code builder can be a sensible first step. If the website is the product, start on a standard code stack.',
        },
        {
          q: 'What should a web development contract in Israel include?',
          a: 'At minimum: a defined scope for version one, a delivery timeline, payment milestones tied to deliverables, ownership of code and design on payment, the accounts you will own, how changes after launch are priced, and what support is included after launch. It should also say who is responsible for accessibility compliance and for content such as text and images.',
        },
        {
          q: 'Does a startup website need a Hebrew version?',
          a: 'Only if you sell to Israeli customers, recruit locally in Hebrew, or apply for local programmes that expect it. Many B2B startups launch in English only. If you are likely to add Hebrew later, ask the supplier to build the layout with logical CSS properties so that right-to-left support can be added without rebuilding every page.',
        },
      ],
    },
  },
  'website-analytics-tools-israel': {
    title: 'Website Analytics Tools for Israeli Businesses: GA4, Looker Studio and Cheaper Alternatives',
    seoTitle: 'Website Analytics Tools in Israel: GA4, Looker Studio and Alternatives',
    excerpt:
      'GA4, Looker Studio, Microsoft Clarity, Matomo, Plausible and enterprise suites compared for Israeli businesses: cost model, privacy, Hebrew reporting and which setup fits which company size.',
    tags: ['Analytics', 'GA4', 'Looker Studio', 'Data', 'Privacy'],
    datePublished: '2026-10-24',
    content: `**TL;DR:** Most Israeli businesses, from small companies to many enterprises, can run website analytics on free tools: Google Analytics 4 for traffic and conversions, Google Tag Manager to manage tracking, Looker Studio for dashboards, and Microsoft Clarity for session recordings and heatmaps. Paid or self-hosted alternatives such as Matomo, Plausible or Piwik PRO make sense when you need full data ownership, simpler privacy compliance or unsampled enterprise reporting. The tool matters less than the setup: defined conversions, clean events and a dashboard someone actually reads.

Analytics is the area where Israeli companies most often overspend and underuse at the same time. A business pays for an enterprise suite and looks at one number, or runs free GA4 with no conversions configured and concludes that "analytics does not work for us". This guide compares the realistic options and explains how to choose.

## The main website analytics tools compared

| Tool | Cost model | Best for | Data ownership | Main limitation |
|---|---|---|---|---|
| Google Analytics 4 | Free standard version, paid GA4 360 for enterprise | Traffic, acquisition, conversions, Google Ads link | Stored by Google | Learning curve, data retention limits on the free tier |
| Looker Studio | Free, with a paid Pro tier | Dashboards combining GA4, Search Console, Ads, Sheets | Reads from your sources | Slow with large data, connectors to non-Google sources often paid |
| Microsoft Clarity | Free | Heatmaps, session recordings, rage clicks | Stored by Microsoft | Behaviour only, not a full attribution tool |
| Matomo | Free self-hosted or paid cloud | Full data ownership, privacy-sensitive sectors | Yours if self-hosted | Needs a server and maintenance |
| Plausible / Fathom | Paid subscription | Simple, cookie-light traffic reporting | Stored by the vendor in the EU or US | Limited funnels and segmentation |
| Adobe Analytics, Piwik PRO, GA4 360 | Enterprise contracts | Large organisations with analysts and governance needs | Varies by contract | Cost and implementation effort |

The free standard GA4 property keeps event-level data for either two or fourteen months, depending on the retention setting, as documented in [Google's data retention help page](https://support.google.com/analytics/answer/7667196). Aggregated reports are not affected, but if you want to analyse raw events over longer periods, export to BigQuery or set the retention to fourteen months on day one.

## Google Analytics 4: the default for good reasons

GA4 is free, integrates directly with Google Ads and Search Console, and every marketer in Israel has used it. Its weakness is not capability but configuration. Out of the box it collects page views and a handful of automatic events. It does not know what a lead is for your business.

The setup that matters:

- **Conversions (key events).** Form submissions, WhatsApp clicks, phone clicks, purchases. Without them, every report about channels is meaningless.
- **Consent mode.** If your site shows a cookie banner, GA4 should be configured with Google Consent Mode so that measurement degrades gracefully instead of disappearing.
- **Internal traffic filter.** Exclude your office and your developers.
- **Cross-domain tracking** if checkout or booking happens on another domain.

Our [GA4 and pixel conversion tracking guide](/en/blog/ga4-pixel-conversion-tracking-guide) walks through the event setup step by step.

## Looker Studio: dashboards without a BI budget

Looker Studio turns GA4, Search Console, Google Ads and Google Sheets into a single report that management can open without logging in to five tools. For a small or mid-sized Israeli company, a well-built Looker Studio dashboard often replaces the need for a BI platform entirely.

Two practical notes. First, Looker Studio connects to Google sources for free, but connectors for Meta Ads, LinkedIn or a CRM usually come from third-party vendors with a monthly fee. Second, dashboards built on live GA4 data slow down as the date range grows; extracting data to BigQuery or Sheets solves that.

## Cheaper or more private alternatives

**Microsoft Clarity** is the easiest win for most sites. It is free, takes minutes to install, and shows where visitors click, how far they scroll, and where they get stuck. It complements GA4 rather than replacing it.

**Matomo** is the leading open-source alternative. Self-hosted, the data never leaves your server, which suits healthcare, finance and public-sector organisations that are wary of sending visitor data to third parties. The cost is a server and someone who maintains it.

**Plausible and similar tools** offer a simple dashboard and a lightweight script. They are attractive for content sites and SaaS marketing sites that only need traffic sources and top pages, but they are not a replacement for funnel analysis.

## Privacy considerations in Israel

Israel's Privacy Protection Law was significantly updated by Amendment 13, which came into force in August 2025 and expanded the regulator's enforcement powers. Analytics data that can identify a person, such as user IDs, form contents or precise location, falls under it. In practice: do not send personal details such as email addresses or ID numbers into analytics events, publish a clear privacy policy, and use a consent banner if you serve visitors from the EU. If your legal team is cautious, a self-hosted tool like Matomo reduces the number of third parties involved. This is general information, not legal advice.

## Which setup fits which business?

- **Small business or local service:** GA4 with three to five conversions, Search Console, Microsoft Clarity, and one Looker Studio page.
- **E-commerce store:** GA4 with enhanced e-commerce events, server-side tagging if ad spend is significant, and a Looker Studio report that joins sales with ad spend.
- **Mid-sized B2B company:** GA4 plus CRM data, so marketing can see which channels produce closed deals, not only form fills.
- **Enterprise or regulated sector:** a governance plan first, then a choice between GA4 360, Adobe, Piwik PRO or self-hosted Matomo depending on data residency and analyst capacity.

## Checklist: setting up website analytics properly

1. Write down the three to five actions that represent business value on your site.
2. Install Google Tag Manager and keep all tags in it, not hard-coded.
3. Configure GA4 with those actions as key events and test each one in DebugView.
4. Set GA4 data retention to fourteen months.
5. Connect GA4 to Google Ads and Search Console.
6. Add Microsoft Clarity for behaviour analysis.
7. Implement consent mode if you show a cookie banner.
8. Build one Looker Studio dashboard with the numbers management actually asks about.
9. Document the setup: which tag fires where and why.
10. Review the data monthly and remove events nobody uses.

## Common mistakes that make analytics useless

Even with the right tools, the same handful of problems appear in most Israeli accounts we review:

- **Counting the wrong conversion.** A visit to the thank-you page that can be reloaded, or a click on a form button that fires even when validation fails, inflates numbers and misleads ad platforms that optimise on them.
- **Duplicate tags.** GA4 installed both directly in the theme and through Tag Manager doubles every page view and halves the apparent conversion rate.
- **No link between leads and revenue.** A form fill is not a customer. If your sales team works in a CRM, pass a lead identifier through so you can see which campaigns produced deals rather than just enquiries.
- **Ignoring Search Console.** GA4 shows what visitors did after they arrived; Search Console shows which queries brought them and which pages Google struggles to index. Both are free and they answer different questions.
- **Dashboards nobody owns.** A report without an owner and a review date is usually abandoned within a quarter. Assign one person to look at it each month and to ask why a number moved.
- **Hebrew and English traffic mixed together.** If you run a bilingual site, segment reports by language or by path, otherwise trends in one audience hide trends in the other.

Fixing these rarely needs new software. It needs a written tracking plan that lists each event, where it fires, what it means and who uses it.

## Getting help

Most analytics problems are setup problems, not tool problems, and a few hours of correct configuration usually beats any new subscription. If you want an outside team to audit your tracking or build a reporting layer that joins website, ads and CRM data, our [data analytics and BI service](/en/services/data-analytics) covers that, and our [digital marketing team](/en/services/marketing) uses the same setup to run campaigns. Whoever does it, insist that the accounts remain in your company's name.`,
    faq: {
      title: 'Frequently asked questions about website analytics tools in Israel',
      items: [
        {
          q: 'Is Google Analytics 4 free for businesses in Israel?',
          a: 'Yes. The standard version of GA4 is free for any business, with no traffic tier that forces an upgrade for typical small and mid-sized sites. Large organisations that need higher limits, service-level agreements or unsampled reporting can buy GA4 360 through Google or a reseller. For most Israeli businesses the free version is sufficient, provided it is configured with proper conversions and consent mode.',
        },
        {
          q: 'What is the difference between GA4 and Looker Studio?',
          a: 'GA4 collects and stores data about visitors and their actions on your website. Looker Studio does not collect anything; it is a reporting tool that reads from GA4 and other sources such as Search Console, Google Ads or Google Sheets and displays them in custom dashboards. Most businesses use both: GA4 as the data source and Looker Studio as the report management reads.',
        },
        {
          q: 'What is a good free alternative to Google Analytics?',
          a: 'Matomo, self-hosted, is the most complete free alternative and keeps the data on your own server. Microsoft Clarity is free and excellent for heatmaps and session recordings, but it complements rather than replaces a traffic analytics tool. Simple paid tools such as Plausible are a middle ground for sites that only need basic traffic reporting.',
        },
        {
          q: 'Do I need a cookie banner for analytics in Israel?',
          a: 'Israeli law focuses on how personal data is collected, used and secured rather than requiring a specific cookie banner format. If you serve visitors from the European Union, GDPR and the ePrivacy rules apply and consent is generally required for analytics cookies. Many Israeli sites therefore show a banner and use Google Consent Mode. Consult a lawyer for your specific case.',
        },
        {
          q: 'How much does it cost to set up website analytics properly?',
          a: 'The tools themselves can cost nothing. The cost is the configuration work: defining conversions, setting up Tag Manager, testing events, connecting ad platforms and building a dashboard. For a small site this is a short project; for an e-commerce store or a company that wants CRM data joined with marketing data it is larger. Ask any supplier for a written tracking plan before the work starts.',
        },
      ],
    },
  },
  'ecommerce-ad-creative-testing-israel': {
    title: 'Testing and Scaling Ad Creatives for E-commerce in Israel: Meta and Google',
    seoTitle: 'Creative Testing and Scaling for E-commerce Ads in Israel',
    excerpt:
      'How Israeli online stores test ad creatives on Meta and Google, how to structure tests with a small local audience, what to watch in Hebrew creatives, and when a winner is ready to scale.',
    tags: ['E-commerce', 'Meta Ads', 'Google Ads', 'Creative testing', 'Marketing'],
    datePublished: '2026-10-24',
    content: `**TL;DR:** The most common way Israeli e-commerce brands test creatives today is to let the platform do the distribution: several distinct concepts in one Meta ad set or Advantage+ shopping campaign, and several asset groups in Google Performance Max, with a fixed budget and a fixed evaluation window. Because the Israeli audience is small, test fewer, more different concepts rather than many small variations, judge them on cost per purchase rather than click-through rate, and scale winners gradually by budget and by duplicating them into new formats. Hebrew creatives need native copy, right-to-left text in the frame and products shown in a local context.

Creative is now the main lever in paid social and much of paid search. Platform targeting has become automated, so what you show decides who sees it. For an Israeli store with a limited budget and a market of under ten million people, the question is not whether to test but how to test without burning the budget on noise.

## Why creative testing in Israel is different

Three local factors change the playbook you read in American guides:

- **A smaller audience.** Frequency rises faster, so a winning ad fatigues sooner and you need a steady supply of new creatives.
- **Hebrew and RTL.** Text overlays, captions and subtitles have to be written and laid out right to left. Templates designed for English often break: punctuation jumps to the wrong side and mixed Hebrew-English strings reorder.
- **A bilingual and multicultural market.** Depending on your product, you may need separate creatives for Hebrew, Arabic, Russian and English speakers, each with their own testing cycle.

## Testing methods compared

| Method | Platform | When to use | Strengths | Weaknesses |
|---|---|---|---|---|
| Multiple ads in one ad set | Meta | Day-to-day concept testing | Simple, fast, cheap | The algorithm picks a favourite early; not a clean experiment |
| Meta A/B test (Experiments) | Meta | High-stakes decisions such as a new angle or offer | Split audiences, statistical readout | Needs more budget and time |
| Advantage+ shopping campaign | Meta | Stores with conversion history | Automated delivery across placements | Limited control over which creative gets spend |
| Asset groups in Performance Max | Google | Comparing themes or audiences on Google | Reaches Search, Shopping, YouTube, Display | Reporting by asset is limited |
| Video experiments | Google / YouTube | Comparing video ads | Measures lift, not only clicks | Requires enough video spend |
| Organic or creator pre-test | TikTok, Instagram | Cheap filter before paid testing | Real audience reaction at low cost | Organic success does not always transfer to paid |

Meta documents its testing tools in the [Meta Business Help Center on A/B testing](https://www.facebook.com/business/help/1738164643098669), and Google explains how assets and asset groups work in [Performance Max campaigns](https://support.google.com/google-ads/answer/10724817) in its own help center. Both platforms change features often, so check the current options before you build a testing plan.

## What to test first

Test big differences before small ones. A new headline colour will not tell you anything with an Israeli-sized budget; a different reason to buy will.

1. **Angle or message.** Price, quality, speed of delivery, social proof, problem and solution.
2. **Format.** Static image, short vertical video, carousel, user-generated style video, product demo.
3. **Hook.** The first two to three seconds of a video, or the main line on a static ad.
4. **Offer.** Free shipping, a bundle, a time-limited discount.
5. **Details.** Only once you have a winning concept: thumbnails, text length, call-to-action wording.

## Hebrew creatives that work

The most frequent issue in Israeli ad accounts is creatives that look translated. Copy should be written in natural, spoken Hebrew, not a literal version of an English brief. Keep text overlays short, check that numbers, prices and English brand names display in the correct order, and test on an actual phone in the feed, not only in the design tool.

Product context matters too. A product photographed in an Israeli kitchen, balcony or office, with shekel prices and local delivery promises, reads as relevant. Generic stock footage from abroad reads as dropshipping, even when it is not. AI-generated imagery and video can speed up production, but review it for Hebrew text errors, which image models still frequently produce.

## How to read the results

Decide in advance how long a test runs and what counts as a winner. Common rules of thumb include waiting until each creative has had enough spend to produce several purchases, and not judging during the first days while the algorithm is still learning. Choose one primary metric, usually cost per purchase or return on ad spend, and use click-through rate and thumb-stop rate only to diagnose why something failed.

Remember that attribution is imperfect. Meta and Google each claim credit for the same sale, and iOS privacy changes reduced what pixels can see. Compare platform numbers with the orders in your store and in GA4. Our [GA4 and pixel tracking guide](/en/blog/ga4-pixel-conversion-tracking-guide) explains how to make those numbers line up as closely as possible.

## How to scale a winning creative

- **Increase budget gradually** on the ad set or campaign where the creative won, rather than doubling overnight.
- **Duplicate the concept into new formats:** turn a winning static into a short video, or a video into a carousel.
- **Make iterations** with new hooks, new presenters or new products while keeping the winning angle.
- **Move it into evergreen campaigns** such as Advantage+ or Performance Max once it has proved itself.
- **Watch frequency.** In a small market, rising frequency and falling click-through rate are the first signs of fatigue.

## Checklist: a creative testing routine for an Israeli store

1. Make sure purchase tracking works on Meta, Google and GA4 before testing anything.
2. Set a monthly testing budget separate from your scaling budget.
3. Produce three to five genuinely different concepts per round.
4. Write Hebrew copy natively and check RTL layout on a phone.
5. Launch each round with a fixed budget and evaluation window.
6. Judge on cost per purchase or return on ad spend, not clicks.
7. Record every test, its hypothesis and its result in one shared sheet.
8. Scale winners gradually and create iterations of them.
9. Retire creatives when frequency climbs and performance drops.
10. Repeat on a fixed cadence, typically every one to two weeks.

## Building a creative pipeline you can sustain

The stores that win at creative testing are rarely the ones with the best single idea. They are the ones that ship new concepts every week without the process collapsing. A sustainable pipeline usually has four parts.

**A source of ideas.** Customer reviews, support questions, return reasons and comments on your own ads are the best raw material. The words customers use to describe a problem often make better hooks than anything written in a meeting.

**A production rhythm.** Decide how many new concepts you need each cycle and who makes them. A mix of polished brand assets, quick phone-shot videos and creator content keeps costs manageable and gives the algorithm variety.

**A naming convention.** Name every ad with its concept, format, hook and date. Without it, nobody can tell three months later which angle actually worked, and the same failed idea gets tested again.

**A feedback loop to the site.** A creative that wins on clicks but loses on purchases often points to a mismatch with the landing page. Make sure the promise in the ad, the product page and the checkout are consistent, including shipping times and prices in shekels. Our guide to [landing pages that convert](/en/blog/landing-pages-that-convert) covers that side of the funnel.

## Doing it in-house or with a partner

A store with a designer or video editor in-house can run this routine alone; the hard part is consistency rather than skill. If you prefer an outside team, look for one that shows you the testing log, not only the results. Aiterra runs [e-commerce marketing and paid campaigns](/en/services/marketing) and builds [online stores](/en/services/ecommerce) for Israeli brands, and the same principles apply whoever runs your account. If you are deciding on budget levels, our article on the [minimum PPC budget in Israel](/en/blog/ppc-minimum-budget-israel) is a useful starting point.`,
    faq: {
      title: 'Frequently asked questions about creative testing for e-commerce in Israel',
      items: [
        {
          q: 'How many ad creatives should an Israeli e-commerce store test at once?',
          a: 'With a typical Israeli budget, three to five genuinely different concepts per testing round is a practical range. Testing many small variations spreads the budget too thin to reach a clear result. Start with different angles or formats, find a winner, and only then test smaller details such as hooks, thumbnails or call-to-action text.',
        },
        {
          q: 'Should I use Meta A/B tests or just put several ads in one ad set?',
          a: 'For everyday creative testing, several ads in one ad set is faster and cheaper, although the algorithm may favour one ad early. For decisions with a big impact, such as a new offer, a new brand message or a new landing page, a formal A/B test with split audiences gives a more reliable answer. Many stores use both: ad-set testing for volume and formal tests for strategic questions.',
        },
        {
          q: 'Do ads in Hebrew perform better than ads in English in Israel?',
          a: 'For most consumer products sold to Israelis, native Hebrew creatives are the default and usually feel more relevant. English can work for tech products, premium international brands or an audience of English speakers. The only reliable answer for your product is a test with the same concept in both languages, judged on cost per purchase.',
        },
        {
          q: 'How long should a creative test run before I decide?',
          a: 'Long enough for the platform to exit its initial learning phase and for each creative to generate several purchases, so that the result is not driven by one or two orders. For many Israeli stores that means at least several days, often a week. Decide the evaluation window before launching and avoid switching ads off after one bad day.',
        },
        {
          q: 'Can AI-generated creatives work for Israeli e-commerce ads?',
          a: 'Yes, as a way to produce more variations faster, especially backgrounds, product scenes and first drafts of video. Review every asset carefully: image models still often render Hebrew text incorrectly, and obviously generic AI visuals can reduce trust. Treat AI creatives like any other concept and let the test decide.',
        },
      ],
    },
  },
  'conversational-ai-consultancy-israel': {
    title: 'Conversational AI Consultancy in Israel: What to Expect and How to Evaluate a Partner',
    seoTitle: 'Conversational AI Consultancy in Israel: How to Choose a Partner',
    excerpt:
      'What a conversational AI consultancy actually delivers, how engagements are structured, how Hebrew changes the work, and the questions that separate a real partner from a demo shop.',
    tags: ['Conversational AI', 'AI consulting', 'Chatbots', 'AI agents', 'Israel'],
    datePublished: '2026-10-24',
    content: `**TL;DR:** A conversational AI consultancy helps a business decide where chatbots, voice agents or AI assistants make sense, designs them around real customer conversations, connects them to company systems and data, and sets up the guardrails and measurement that keep them reliable. In Israel, a good partner must also handle Hebrew properly, including mixed Hebrew and English, spelling variations and right-to-left display, and must be comfortable with Israeli privacy rules. Evaluate partners on discovery work, live references, how they prevent wrong answers, who owns the data and prompts, and how they measure success after launch.

Since large language models became widely available, almost every software house and marketing agency in Israel offers "AI chatbots". The range of quality behind that phrase is enormous. This guide explains what a serious engagement looks like and how to tell the difference before you commit budget.

## What a conversational AI consultancy actually does

A consultancy is not just a vendor that installs a chatbot widget. A complete engagement usually covers five areas:

1. **Use-case selection.** Reviewing your customer service, sales and internal support conversations to find where automation will pay back and where it will annoy people.
2. **Conversation design.** Defining what the assistant handles, what it refuses, how it hands over to a human, and how it sounds in your brand voice.
3. **Knowledge and integrations.** Connecting the assistant to your documents, product catalogue, CRM, booking system or order data, often through retrieval-augmented generation (RAG).
4. **Guardrails and testing.** Preventing invented answers, protecting personal data, testing against real and adversarial questions before launch.
5. **Measurement and iteration.** Tracking resolution rate, escalations, satisfaction and errors, and improving the system after launch.

If a proposal covers only the third point, you are buying a technical integration, not a consultancy.

## Types of partners compared

| Partner type | What they offer | Good fit | Watch out for |
|---|---|---|---|
| Chatbot SaaS platform with onboarding | A product plus setup help | Standard FAQ and lead capture | Limited customisation, data on their platform |
| Strategy consultancy | Roadmaps, business cases, vendor selection | Large organisations planning AI programmes | May not build anything themselves |
| AI development studio | Design, build and integration of custom assistants | Businesses with specific processes and systems | Quality varies widely; check live work |
| Large systems integrator | Enterprise-wide deployments, governance | Banks, insurers, government | Cost and speed |
| Freelance AI developer | Prototypes and small bots | Proofs of concept | Support, security and continuity |

Aiterra sits in the third row: we design and build conversational agents and [AI integrations](/en/services/llm-integration) for Israeli businesses. The criteria below apply to every row, including us.

## Hebrew is where many projects fail

Large language models handle Hebrew far better than they did a few years ago, but real customer messages are messier than a demo. Israelis write with and without vowel letters, mix English product names and slang into Hebrew sentences, use heavy abbreviations, and often write in WhatsApp style with no punctuation. Voice adds accents, background noise and switching between languages mid-sentence.

A capable partner tests on your real historical conversations, not on clean sample questions, and checks how answers render in right-to-left interfaces such as your website widget and WhatsApp. Ask to see test results on Hebrew data before you sign off on a build.

## How a typical engagement is structured

**Discovery.** Interviews, a review of conversation logs, and a short list of use cases ranked by value and risk. The output is a written recommendation, which may include "do not automate this".

**Pilot.** One use case, one channel, limited traffic. The goal is to measure real performance with real customers, with a human able to step in.

**Production.** Wider rollout, integrations with more systems, monitoring dashboards, and an agreed process for updating knowledge and handling errors.

**Ongoing optimisation.** Reading transcripts, fixing gaps in the knowledge base, adjusting prompts and handover rules as the business changes.

## Questions to ask a conversational AI partner

- Can you show a live assistant you built, and let us try to break it?
- How do you stop the assistant from inventing prices, policies or promises?
- What happens when it does not know the answer?
- Where are conversation logs stored, and who can access them?
- Which models do you use, and can we switch provider later without a rebuild?
- Who owns the prompts, the knowledge base and the integration code?
- How will we measure success, and what results do you consider a failure?
- What does ongoing support cost and include?

A partner that cannot answer the second and third questions concretely is selling a demo.

## Privacy and data in Israel

Conversations often contain names, phone numbers, ID numbers and order details. Israel's Privacy Protection Law, strengthened by Amendment 13 in 2025, applies to that data. Ask your partner where data is processed, whether conversation content is used to train third-party models, how long logs are retained, and how access is controlled. For regulated sectors, it is worth involving your legal and security teams from discovery, not at launch. This is general information, not legal advice.

## Checklist: evaluating a conversational AI consultancy

1. Define the business goal in one sentence before talking to vendors.
2. Gather a sample of real customer conversations to share under NDA.
3. Ask each partner for a discovery phase with a written recommendation.
4. Request live references and test their assistants yourself.
5. Check Hebrew performance on your own messages, including messy ones.
6. Confirm how hallucinations are prevented and how handover to humans works.
7. Clarify data storage, retention and model training policies in writing.
8. Ensure you own the prompts, knowledge base and integration code.
9. Agree on success metrics and a pilot scope before the full build.
10. Budget for ongoing optimisation, not only for the initial build.

## What success looks like after launch

Agree on how you will judge the project before it starts, because "the bot works" means different things to different people. Useful measures include:

- **Containment or resolution rate:** the share of conversations the assistant completes without a human, counted honestly, excluding customers who simply gave up.
- **Escalation quality:** whether conversations reach the right person with the full context, so the customer does not repeat the story.
- **Error rate:** answers that were wrong, made up or off-policy, found by reading a sample of transcripts every week.
- **Customer satisfaction:** a short rating at the end of the conversation, compared with your human channels.
- **Business outcomes:** booked meetings, qualified leads, orders handled or support hours saved, depending on the use case.

Expect the first weeks to reveal gaps in your own documentation more than flaws in the model. Questions customers ask that nobody wrote an answer for are normal and valuable; they are the backlog for the next iteration. A partner who reviews transcripts with you regularly will improve the system much faster than one who hands it over and disappears.

Also plan for change. Model providers release new versions and retire old ones, and prices change. An architecture that keeps your knowledge base, prompts and integrations separate from a specific model makes those transitions routine rather than a rebuild.

## When conversational AI is not the answer

If you receive a handful of enquiries a week, if every question is unique and high-stakes, or if your underlying information such as prices and policies is not written down clearly, a conversational assistant will struggle to pay back. Sometimes the right first step is fixing the knowledge base or the process itself. A good consultancy will tell you that. Our [AI consulting](/en/services/ai-consulting) engagements start with exactly that assessment, and our article on [AI agents for business](/en/blog/ai-agents-for-business) explains when an agent goes beyond a chatbot. For phone-based use cases, see our [voice AI agents](/en/services/voice-agents) page.`,
    faq: {
      title: 'Frequently asked questions about conversational AI consultancy in Israel',
      items: [
        {
          q: 'What is the difference between a chatbot vendor and a conversational AI consultancy?',
          a: 'A chatbot vendor sells a product and helps you configure it. A conversational AI consultancy starts with your business problem and your real conversations, decides whether and where automation makes sense, designs the conversation, builds or integrates the solution, and keeps improving it after launch. The consultancy may use a vendor platform or build custom, but the responsibility for the outcome is broader.',
        },
        {
          q: 'Do AI chatbots work well in Hebrew?',
          a: 'Modern language models understand Hebrew well, but real customer messages include spelling variations, abbreviations, slang and English words in Hebrew sentences. Results depend on how the assistant is designed, what knowledge it is connected to, and how thoroughly it was tested on real Israeli conversations. Always test on your own historical messages before launch.',
        },
        {
          q: 'How long does a conversational AI project take?',
          a: 'A discovery phase usually takes a few weeks. A focused pilot on one use case and one channel can often go live within one to two months after that, depending on integrations and approvals. Broader production rollouts take longer. Be wary of promises to automate all customer service within days.',
        },
        {
          q: 'How do you prevent an AI assistant from giving wrong answers?',
          a: 'By restricting it to approved knowledge sources, defining clear refusal and handover rules, testing it against difficult and adversarial questions, and monitoring transcripts after launch. The assistant should say it does not know and transfer to a person rather than guess, especially on prices, legal terms and medical or financial topics.',
        },
        {
          q: 'Who should own the data and prompts in a conversational AI project?',
          a: 'Your company. Conversation logs, the knowledge base, prompts, configuration and integration code should all be owned by you or transferable to you, so that you can change partner or model provider without starting over. Put this in the contract before the build starts.',
        },
      ],
    },
  },
  'custom-web-development-israel': {
    title: 'Custom Web Development in Israel: Cost Drivers, Process, Hebrew/RTL and Accessibility',
    seoTitle: 'Custom Web Development in Israel: Costs, Process, RTL and IS 5568',
    excerpt:
      'What drives the cost of custom web development in Israel, how a well-run project is structured, and the Hebrew, right-to-left and SI 5568 accessibility requirements that foreign teams often miss.',
    tags: ['Custom development', 'Web development', 'RTL', 'Accessibility', 'SI 5568'],
    datePublished: '2026-10-24',
    content: `**TL;DR:** Custom web development in Israel means building a website or web application from code around your specific processes rather than adapting a template. The cost is driven mainly by scope and business logic, the number of integrations, design depth, languages, and the quality requirements for performance, security and accessibility. A well-run project moves through discovery, design, iterative development, testing and launch, with ownership of code and accounts staying with you. Two local requirements shape every Israeli project: proper Hebrew right-to-left support, and compliance with the Israeli accessibility standard SI 5568 (IS 5568), which is based on WCAG.

Whether you are an Israeli company or a foreign business entering the Israeli market, the decision to go custom is usually triggered by the same moment: an off-the-shelf platform cannot do what the business needs, or the workarounds have become more expensive than building properly.

## When custom development makes sense

Custom is not automatically better. It is the right choice when at least one of these is true:

- Your process is your advantage, and a generic tool would force you to change it.
- You need deep integrations, for example with an ERP, Israeli invoicing software, a CRM or payment providers.
- You run user accounts, dashboards, portals or workflows rather than just pages.
- Performance, security or data residency requirements rule out a shared platform.
- Licence fees for a SaaS product grow with every user and already exceed the cost of owning a system.

If none of these apply, a well-built site on a standard CMS is often the better investment. Our comparison of [WordPress versus custom code](/en/blog/wordpress-vs-custom-code) covers that decision.

## What drives the cost

We do not publish fixed prices for custom work because two projects with the same name can differ by an order of magnitude. These are the factors that actually move a quote:

| Cost driver | Lower effort | Higher effort |
|---|---|---|
| Scope and business logic | Content pages, simple forms | User roles, workflows, calculations, approvals |
| Integrations | None or one standard API | ERP, CRM, payments, invoicing, legacy systems |
| Design | Component library with brand styling | Fully bespoke design system and motion |
| Languages | One language | Hebrew and English or more, with RTL and LTR layouts |
| Content | Supplied by the client | Copywriting, translation, photography |
| Accessibility | Built in from the start | Retrofitted to an existing site |
| Performance and security | Standard hosting and practices | High traffic, sensitive data, audits, penetration tests |
| Support after launch | Ad hoc fixes | Retainer with monitoring and response times |

For a sense of general market price ranges for websites in Israel, see our [website cost guide for 2026](/en/blog/website-cost-israel-2026). For custom applications, the honest answer is a short paid discovery that produces a specification and an estimate.

## How a well-run custom project works

1. **Discovery.** Workshops, user flows, data model, integration list and a prioritised feature list. The result is a written scope.
2. **UX and design.** Wireframes for key flows, then visual design in both Hebrew and English if needed.
3. **Architecture.** Choice of stack, hosting, authentication, and how data moves between systems.
4. **Iterative development.** Work delivered in short cycles to a staging environment you can test.
5. **Testing.** Functional, cross-browser, mobile, performance, security and accessibility testing.
6. **Launch.** Redirects from any old site, analytics, monitoring and backups in place on day one.
7. **Support and evolution.** Bug fixes, updates and a backlog for the next version.

## Hebrew and right-to-left: more than translation

A Hebrew interface is a mirrored layout, not English text swapped for Hebrew. Navigation, icons that point in a direction, progress steps, carousels and form layouts all flip. Mixed-direction content such as phone numbers, prices, English brand names and code snippets inside Hebrew sentences needs careful handling so it does not reorder. Fonts must support Hebrew properly, and line height and weight often need adjusting.

The reliable technical approach is to build with CSS logical properties such as margin-inline-start instead of margin-left, so that one codebase serves both directions. Teams outside Israel who have never shipped RTL often discover these issues only at QA, which is the most expensive time to find them.

## Accessibility: the SI 5568 requirement

Israeli regulations under the Equal Rights for Persons with Disabilities Law require websites that provide a service to the public to be accessible according to the Israeli standard SI 5568, which adopts the Web Content Accessibility Guidelines at level AA. The underlying guidelines are published by the W3C in its [WCAG 2 overview](https://www.w3.org/WAI/standards-guidelines/wcag/). In practice this means keyboard navigation, sufficient colour contrast, text alternatives for images, accessible forms, captions for video and a published accessibility statement.

Accessibility overlays and widgets do not make an inaccessible site compliant by themselves. The code and content need to be accessible. Our guide to [website accessibility in Israel](/en/blog/website-accessibility-israel) covers the legal background. This is general information, not legal advice.

## Technology choices and ownership

There is no single correct stack, but there are safe defaults. Mainstream frameworks such as Next.js, React, Laravel or Django have large talent pools in Israel and abroad, mature security practices and long-term support. A custom system built on an obscure framework, or on a supplier's private toolkit, ties you to that supplier for every future change.

Hosting deserves the same attention. Decide whether you need data stored in a particular region, who receives alerts when the site goes down, how backups are taken and how often restores are tested. These questions are cheap to answer during discovery and expensive to answer after an incident.

Finally, ownership. Your company should own the source code repository, the domain, the hosting account, analytics, email sending services and any third-party API keys. The supplier works inside your accounts with access you can revoke. This is standard practice among professional teams, and a supplier who resists it is telling you something about how the relationship will end.

## Performance and SEO from the first release

A custom build gives you full control over speed and search readiness, but only if someone takes responsibility for them. Agree that the launch version will include clean URLs, unique titles and descriptions, a sitemap, structured data where relevant, and 301 redirects from every old URL if you are replacing an existing site. Set a performance target for mobile, test it on real devices, and keep images and video optimised. Our [website migration guide](/en/blog/website-migration-wix-redesign) explains how to replace a site without losing the rankings it already has.

If you serve both Hebrew and English audiences, plan the URL structure and hreflang tags from the start, so that search engines show each visitor the right language version. Retrofitting a bilingual structure onto a site that launched in one language means redirects, duplicated content risks and a temporary dip in visibility that a little planning avoids.

## Checklist: before you start a custom web project in Israel

1. Write down the business problem and how you will measure success.
2. List every system the new platform must connect to.
3. Decide which languages you need at launch and later.
4. Require RTL support and SI 5568 accessibility in the scope, not as extras.
5. Ask for a paid discovery phase with a written specification.
6. Confirm the stack is mainstream and documented.
7. Ensure code, domain, hosting and analytics are owned by your company.
8. Agree on a staging environment and an acceptance testing process.
9. Plan hosting, backups, monitoring and security updates.
10. Define support after launch: response times, scope and cost model.

## Choosing a development partner

Look for a team that asks about your business before it talks about technology, can show live custom systems rather than only marketing sites, and treats Hebrew, RTL and accessibility as standard practice. Aiterra builds [custom software and web applications](/en/services/development) and [company websites](/en/services/web-development) for Israeli and international businesses, and the checklist above is the same one we would expect any client to use when comparing us with others.`,
    faq: {
      title: 'Frequently asked questions about custom web development in Israel',
      items: [
        {
          q: 'How much does custom web development cost in Israel?',
          a: 'It depends almost entirely on scope: the business logic, number of integrations, design depth, languages and quality requirements such as accessibility and security. A simple custom site and a portal with user roles and ERP integration can differ by an order of magnitude. The reliable way to get a real number is a short discovery phase that produces a written specification and an estimate based on it.',
        },
        {
          q: 'Is website accessibility mandatory in Israel?',
          a: 'Yes, for websites that provide a service to the public. Regulations under the Equal Rights for Persons with Disabilities Law require compliance with the Israeli standard SI 5568, which is based on WCAG at level AA, and a published accessibility statement. Courts can award compensation in accessibility claims, so it is far cheaper to build accessibility in from the start than to retrofit it.',
        },
        {
          q: 'What is the difference between RTL support and translation?',
          a: 'Translation changes the words. RTL support changes the layout so it reads from right to left: navigation, icons, forms and components are mirrored, and mixed Hebrew and English content is handled so numbers and names do not reorder. A site can be fully translated into Hebrew and still be broken for Hebrew readers if the layout was not built for RTL.',
        },
        {
          q: 'How long does a custom web development project take?',
          a: 'A focused custom website typically takes a few weeks to a couple of months. A web application with user accounts, workflows and integrations usually takes several months, often delivered in phases so that a first working version is live early. Discovery, content readiness and client feedback cycles affect the timeline as much as development itself.',
        },
        {
          q: 'Can a foreign development team build a site for the Israeli market?',
          a: 'Yes, if they have real experience with Hebrew right-to-left layouts and with the SI 5568 accessibility standard. Ask to see live Hebrew sites they built and test them on a phone. Many foreign teams underestimate RTL and accessibility, which leads to expensive fixes late in the project. Some companies combine a foreign team with a local partner for design, QA and compliance.',
        },
      ],
    },
  },
}
