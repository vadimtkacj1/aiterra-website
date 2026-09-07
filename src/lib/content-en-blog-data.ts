export type PostFaqEn = { title: string; items: { q: string; a: string }[] }

type PostOverride = {
  title: string
  excerpt: string
  content: string
  tags: string[]
  faq?: PostFaqEn
}

/**
 * English versions of the blog. A post appears on /en/blog only once it has an
 * entry here — an untranslated post is omitted rather than served in Hebrew.
 */
export const postsEn: Record<string, PostOverride> = {
  'best-crm-small-business-israel': {
    title: 'Best CRM for Small Business in Israel: 4 Compared',
    excerpt:
      'Monday, Fireberry, HubSpot and Zoho compared for Israeli small businesses: pricing, Hebrew support, invoicing links and who each one fits.',
    tags: ['CRM', 'Small business', 'Fireberry', 'Monday', 'Automation'],
    content: `**TL;DR:** There is no single best CRM, only the one that fits your business. Monday has a visual interface that is quick to learn; Fireberry, an Israeli platform, leads on Hebrew support and on built-in links to Green Invoice and Hashavshevet; HubSpot suits a business that wants to start free and grow into the paid tiers; Zoho offers the most features per shekel. The right choice depends on your budget, on whether you need Israeli integrations, and on how complex your processes are.

A CRM is the heart of customer management in a business: every lead, conversation and deal held in one place. With dozens of options on the market it is easy to get lost. This guide compares the four systems most Israeli small businesses shortlist, with the emphasis on what actually matters here — Hebrew support and integration with Israeli invoicing software.

![A business owner comparing CRM systems for a small business in Israel](/images/blog/best-crm-small-business-israel.webp)

## How do Monday, Fireberry, HubSpot and Zoho compare?

All four answer the same basic need — collecting leads, tracking deals and automating follow-up — but they differ on price, on the quality of their Hebrew, and on how deep the local integrations go. Here is the full picture at a glance:

| System | Entry price (per user, per month) | Hebrew support | Israeli invoicing link |
|---|---|---|---|
| Monday CRM | ~$12–15 | Partial | Via integration |
| Fireberry | ~₪50–150 | Full | Built in (Green Invoice / Hashavshevet) |
| HubSpot | Free – $15+ | Partial | Via integration |
| Zoho CRM | ~$14–40 | Partial | Via integration |

*Prices are correct for 2026 and vary by plan and by number of users.*

## Which system suits which business?

There is no one-size-fits-all answer. Here is the quick match by type of business, way of working and requirements:

- **Monday** — for a business that wants a visual, colourful interface that is easy to operate, and that already runs its tasks and projects in Monday. Rollout is fast and the learning curve is shallow.
- **Fireberry** — for an Israeli business that wants full Hebrew support and a clean link to Green Invoice, Hashavshevet or iCount. The local advantage is significant and saves a complicated integration job.
- **HubSpot** — for a business that wants to start free and grow, and that needs marketing, email and content tools inside the same system.
- **Zoho** — for a business that wants the most features for the lowest price, and does not mind a slightly crowded interface with English on some of the screens.

## What does a CRM cost a small business, and what does the real price include?

The list price is only part of the picture. Licences run from roughly ₪50 per user per month on Fireberry up to $12–40 per user per month on the global systems, and HubSpot has a free tier to start on. The real cost, though, also covers setup, defining the processes, connecting the systems you already use and training the team. A small business that plans this properly up front saves itself an expensive system migration later on.

## What matters most when an Israeli business chooses?

Beyond price, ask yourself three questions. Does the system connect easily to Green Invoice (Morning), to Hashavshevet or to iCount? Is there a simple WhatsApp connection? And is the Hebrew support good enough for your team? A solid Israeli integration saves hours of double data entry every month and removes manual errors.

WhatsApp is one of the most widely used communication channels in Israel, and [Meta for Business](https://www.facebook.com/business) offers WhatsApp Business, which millions of businesses worldwide use to talk to customers. A CRM that connects automatically to WhatsApp and to the form on your website makes sure every lead is logged the moment it arrives, instead of slipping through the cracks.

## How do you roll a CRM out properly in a small business?

A successful rollout starts by mapping the process you already run: where leads come from, who handles them, and when a deal closes. Only then do you pick a system, define a simple sales pipeline, connect the lead sources — the website form, WhatsApp and phone calls — and switch on basic automations such as follow-up reminders. Start small and expand gradually; that beats loading up features nobody on the team will actually use.

## How we approach CRM at Aiterra

We are not the ambassadors of any one platform. We look at your processes and recommend the CRM that fits the business and the budget, then connect it to WhatsApp, to the website and to your invoicing software so that everything talks automatically. The result is one system working for you and holding every lead, rather than another tool that needs maintenance and manual typing.

---

**Want a CRM that actually fits your business?** See the [automation and integrations service](/en/services/development) from AITERRA, or [leave your details](/en/contact) for a consultation.

## Further reading

- [Connecting a CRM to Green Invoice, Hashavshevet and iCount: accounting automation](/en/blog/crm-israeli-invoicing-integration)
- [What business automation and a WhatsApp bot cost, and the ROI](/en/blog/business-automation-cost-roi)
- [WhatsApp bots and CRM: smarter customer service](/en/blog/business-automation-crm-whatsapp)`,
    faq: {
      title: 'Common questions about choosing a CRM',
      items: [
        {
          q: 'Which CRM is best for a small business in Israel?',
          a: 'There is no single best system, only the one that fits your business. Fireberry leads on Hebrew support and on built-in links to Green Invoice and Hashavshevet; Monday is easy and visual; HubSpot is excellent for starting free and growing; Zoho gives the most value for the money. The choice depends on your budget, on whether you need Israeli integrations, and on how complex your processes are.',
        },
        {
          q: 'Which CRM connects to Green Invoice and Hashavshevet?',
          a: 'Fireberry and Israeli platforms such as Powerlink offer built-in connections to Green Invoice, Hashavshevet and iCount. On the global systems — Monday, HubSpot and Zoho — the connection is possible through a dedicated integration or a middleware tool, but it usually needs a custom setup before it runs smoothly.',
        },
        {
          q: 'What does a CRM cost a small business?',
          a: 'Prices run from about ₪50 per user per month on Fireberry to $12–40 per user per month on the global systems, and HubSpot also has a free tier to start on. Remember that the real cost includes setup, process configuration, integrations and training the team, not only the monthly subscription.',
        },
        {
          q: 'Is it worth connecting the CRM to WhatsApp and to the website?',
          a: 'Very much so. When the website form, WhatsApp and the CRM talk to each other automatically, every lead is recorded immediately, with no manual typing and nothing slipping through the cracks. It is one of the highest-return connections a small business can make, because it saves expensive time and prevents lost prospects.',
        },
        {
          q: 'What is the difference between Fireberry and Monday?',
          a: 'Fireberry is an Israeli system with full Hebrew support and built-in links to Green Invoice and Hashavshevet, which suits a business dealing with Israeli authorities and suppliers. Monday stands out for a visual, colourful interface that is easy to learn, and suits a business that already manages tasks and projects there and wants its CRM in the same environment.',
        },
      ],
    },
  },

  'business-automation-cost-roi': {
    title: 'Business Automation Cost and WhatsApp Bot ROI',
    excerpt:
      'What business automation and a WhatsApp bot cost an Israeli small business, how to work out the ROI, and which processes to automate first.',
    tags: ['Automation', 'WhatsApp bot', 'CRM', 'ROI', 'Small business'],
    content: `**TL;DR:** Business automation for a small business — a WhatsApp bot, a CRM connection, automatic replies and lead routing — usually costs ₪3,000–15,000 to set up, plus a monthly bill for the tools. When it saves tens of hours a month and stops leads going missing, the investment pays for itself within two to six months in most cases.

"Automation" sounds like a big, expensive word, but for a small business it usually means something simple: stop doing by hand what a computer can do on its own. The first reply on WhatsApp, logging a lead in the CRM, sending a quote, reminding someone about a meeting. The real question is not "what does it cost" but "what am I losing every month without it".

![A business owner reviewing the return on investment of business automation and a WhatsApp bot](/images/blog/business-automation-cost-roi.webp)

Most automation in an Israeli small business starts with WhatsApp — the channel where customers expect a quick reply by message rather than a wait on the phone, and which also offers dedicated business tooling through [WhatsApp Business](https://www.facebook.com/business/whatsapp). Now let us translate that into numbers: what it costs, and how long it takes to come back.

## What does business automation cost? A price table

| Level of automation | What it covers | Setup range (one-off) | Typical payback |
|---|---|---|---|
| Basic | WhatsApp bot + automatic replies 24/7 | ₪3,000–6,000 | 2–4 months |
| Mid | CRM connection + lead routing + quotes | ₪6,000–12,000 | 3–6 months |
| Advanced | Multiple integrations + accounting | ₪12,000–25,000 | 4–8 months |

Alongside the one-off setup there is a monthly bill for the tools themselves (the CRM, the WhatsApp messaging provider) that usually runs between ₪150 and ₪800 a month, depending on how heavily you use them and on the number of users.

## How do you work out the ROI in practice?

The calculation is simple: how many hours a month the automation saves, multiplied by the cost of an hour of work, plus the leads that no longer fall through the cracks. For example, if a WhatsApp bot saves 20 hours a month at ₪60 an hour, that is ₪1,200 a month — so a ₪6,000 setup pays for itself in roughly five months, before you have counted a single rescued lead.

To quantify the other side of the equation — how many leads actually arrive and close — it is worth setting up [basic analytics measurement](https://support.google.com/analytics). That shows in black and white which channels bring in deals, and it often reveals that one rescued lead a month already covers the monthly cost of the tools.

## Which processes should you automate first?

- The first reply to customers on WhatsApp outside working hours.
- Automatic logging of every enquiry in the CRM, with no manual typing.
- Sending quotes and meeting reminders.
- Connecting the website form to the CRM and to the accounting system.

The rule is simple: start with the process that repeats most often and hurts most. That is where the return comes fastest, and you expand gradually from there.

## How do we approach automation at Aiterra?

We do not sell "automation" as a product. We map the processes that eat the most of your time and automate the ones with the highest return first. That way the investment starts paying for itself in the first month, without spending budget on automations that look impressive but do not move the needle.

---

**Ready to stop working by hand?** See the [business automation service](/en/services/development) from AITERRA, or [leave your details](/en/contact) and we will work out the saving.

## Further reading

- [WhatsApp bots and CRM: how smart automation upgrades customer service](/en/blog/business-automation-crm-whatsapp)
- [Connecting the WhatsApp Business API to a CRM: a practical guide](/en/blog/whatsapp-business-api-crm-integration)
- [Which CRM suits a small business in Israel best?](/en/blog/best-crm-small-business-israel)`,
    faq: {
      title: 'Common questions about automation cost and ROI',
      items: [
        {
          q: 'What does business automation cost a small business?',
          a: 'Basic automation — a WhatsApp bot and automatic replies — runs ₪3,000–6,000 as a one-off setup. Mid-level automation, including a CRM connection and lead routing, costs ₪6,000–12,000, and advanced automation with multiple integrations ₪12,000–25,000. On top of all of those sits a monthly bill for the tools of roughly ₪150 to ₪800, depending on how heavily you use them.',
        },
        {
          q: 'How long does automation take to pay for itself?',
          a: 'In most cases two to six months. The calculation is simple: hours saved per month multiplied by the cost of an hour of work, plus the value of the leads that no longer go missing. Automation that saves about 20 hours a month at ₪60 an hour pays back a ₪6,000 setup in roughly five months, and usually faster, because rescued leads count towards it too.',
        },
        {
          q: 'Which process should be automated first?',
          a: 'Start with the first reply on WhatsApp and with automatic logging of leads in the CRM. Those are the processes that eat the most time and cause the most lost leads, so the return on them is the highest and the quickest. Only once that base is running smoothly is it worth extending to reminders, quotes and an integration with the accounting system.',
        },
        {
          q: 'Does a WhatsApp bot suit a very small business?',
          a: 'It does, and often that is exactly where it pays off most. In a small business where the owner answers every enquiry personally, a bot that handles the first reply and qualifies leads frees up the most expensive resource there is: the time of the owner. It also makes sure no enquiry outside working hours is missed, so you do not lose customers to whichever competitor answered first.',
        },
        {
          q: 'Do all the existing systems need replacing before you can automate?',
          a: 'In most cases no. Good automation connects to the tools you already have — WhatsApp, the form on your website, the accounting system — and links them together, rather than demanding a wholesale replacement. That keeps the setup cost low and the rollout fast. Replacing a core system such as the CRM is only worth considering if the current one genuinely limits growth.',
        },
      ],
    },
  },

  'business-automation-crm-whatsapp': {
    title: 'Business Automation: WhatsApp Bots and CRM',
    excerpt:
      'A lead that waits more than a few minutes goes to a competitor. How a WhatsApp bot, a proper CRM link and custom automation answer every enquiry 24/7.',
    tags: ['Automation', 'CRM', 'WhatsApp', 'Digital'],
    content: `**In short (TL;DR):** Business automation is a smart link between your website, WhatsApp, email and your CRM, so that every lead is captured, answered within seconds and logged automatically — 24/7, with no human hand involved. The result: fewer lost leads, and dozens of manual working hours handed back to you every month.

Let us do the painful arithmetic: how many leads reached you this month and never got an answer in time? Sales research shows again and again that a lead answered in the first few minutes closes at several times the rate of one that waited hours. The problem is that you are busy doing the work, not refreshing an inbox. That is exactly what [business automation](/en/services/development) exists for: a system that works for you 24/7, answers customers, records every enquiry and makes sure not a single shekel is lost.

![Business WhatsApp on a phone screen answering customers automatically](/images/blog/business-automation-crm-whatsapp.webp)

## What is business automation, exactly?

Business automation is a smart connection between the systems that already serve you — the website, WhatsApp, email, the calendar and the customer management system (CRM) — so that whole processes happen on their own, with no human hand involved. A visitor left their details on a landing page? Within seconds they receive a personal WhatsApp message, the enquiry is written into the CRM, and your salesperson gets an alert with the full details. Nothing depends on anyone remembering.

## Why now? The numbers worth knowing

- **WhatsApp is where the conversation happens:** WhatsApp is the most widely used messaging channel in Israel, and the place where customers expect immediate service — which is why an automatic reply in that channel raises the odds of closing.
- **Speed closes deals:** a lead answered in the first few minutes closes at a significantly higher rate than one left waiting hours, so an instant automatic reply changes the whole funnel.
- **Full availability:** a bot answers 24/7 — including nights and weekends, the hours when most enquiries go unanswered by a human.
- **Accurate measurement:** when every enquiry enters the system tagged by source, you can calculate real return on investment (ROI) with analytics tools such as Google Analytics — [the Google Analytics help centre](https://support.google.com/analytics).

## Off-the-shelf bot or custom automation — what is the difference?

| Capability | Off-the-shelf bot | Custom automation (Aiterra) |
| --- | --- | --- |
| WhatsApp replies | Fixed, generic answers | A script matched to your process |
| CRM connection | Partial or manual | Full and automatic |
| Payment and inventory integration | Usually none | Complete |
| Fit to your workflow | A fixed template | Tailored to you |
| Room to scale with the business | Limited | High |

## How does a WhatsApp bot answer a customer in seconds, even at two in the morning?

The Israeli customer lives in WhatsApp, and that is where they expect service too. A well-built WhatsApp bot answers the common questions immediately, collects the enquiry details in an orderly way, books a meeting in the calendar and can even send a first quote. When a human touch is needed, the bot hands the conversation over to you with the full history, so you enter the call already informed.

## How does a CRM connection keep leads from falling through the cracks?

A CRM is the heart of any business that sells, but it is worth exactly as much as the data that reaches it. When we build an automation, every enquiry — from the website, a paid campaign, WhatsApp or the phone — enters the system automatically, is tagged by source and gets a follow-up task. At any moment you can see how many leads came in, where they came from and the status of each one.

## Where else does automation save you hours and money?

**Booking meetings:** the customer picks a free slot in the calendar themselves and receives an automatic reminder, which cuts no-shows dramatically.

**Follow-ups:** an intelligent message sequence keeps in touch with leads that have not closed yet, and brings old enquiries back to life.

**Management reports:** instead of chasing spreadsheets, you get an orderly picture of the business on your phone every morning.

## Why Aiterra? We build, we do not just connect

There is a wide gap between wiring two off-the-shelf tools together in a generic template and designing an automation around the way you actually work. As an agency that comes from software engineering, we at Aiterra can build the complex integrations too — payment providers, inventory and internal systems — and tailor a solution that grows with the business.

Tired of losing leads and burning hours on manual work? Leave your details and we will map out an automation plan showing exactly how much time and money you can save.

---

**Want to save working hours every week?** See the AITERRA [business automation](/en/services/development) service, or [talk to us](/en/contact) for a free scoping call.

## Further reading

- [Custom web systems: client portals, member areas and tools that save a full-time role](/en/blog/custom-web-systems)
- [Email marketing in 2026: the old channel that still beats everything on return](/en/blog/email-marketing-guide)`,
    faq: {
      title: 'Common questions about business automation',
      items: [
        {
          q: 'Which business processes can be automated?',
          a: 'Almost any process that repeats: capturing leads, a first WhatsApp reply, booking meetings, reminders, producing documents and quotes, customer follow-ups and management reports. In a short scoping call we map the processes that take the most of your time, or where leads are being lost, and start automating exactly there — so the return is felt within the first few weeks.',
        },
        {
          q: 'Is automation worth it for a small business?',
          a: 'Especially for a small business. With no receptionist and no service desk, the automation is your first employee — it answers customers, records every enquiry in the CRM and chases follow-ups, 24/7, at a monthly cost far below hiring. A small business gains the most from every hour and every lead that is not lost.',
        },
        {
          q: 'What is the difference between an off-the-shelf bot and custom automation?',
          a: 'An off-the-shelf bot gives generic answers and stops there. Custom automation connects to your systems — CRM, calendar, payments and inventory — and carries out real actions end to end, exactly as your process runs. It also grows with the business instead of confining you to a fixed template and to answers that never really solve the problem.',
        },
        {
          q: 'How long does it take to set up automation for a business?',
          a: 'A basic automation — a WhatsApp bot connected to the CRM that captures leads — can go live within a few days to two weeks. More complex processes, such as integration with payment providers or internal systems, are built in stages. We always start with the process that returns the most, so you see results early.',
        },
      ],
    },
  },

  'business-site-vs-online-store': {
    title: 'Business website vs online store: which to build',
    excerpt:
      'Brochure site or online store? The real difference, what each costs in Israel in 2026, and when Shopify, WooCommerce or Wix is the right choice.',
    tags: ['Web development', 'E-commerce', 'Online store', 'WooCommerce', 'Shopify'],
    content: `**In short (TL;DR):** A brochure site exists to present, persuade and generate enquiries, and it suits service businesses; an online store exists to sell and take payment on the site itself, and it suits anyone selling products. In 2026 a brochure site costs around ₪4,000–25,000, and a store usually starts at ₪20,000 and up.

The rule is simple: if you sell products and take payment on the site, you need an online store. If you sell a service, expertise or trust, and the goal is to generate enquiries, a brochure site is enough and it costs less. In 2026 a brochure site runs roughly between ₪4,000 and ₪25,000; an e-commerce store usually starts at ₪20,000 and up, because it carries a catalogue, payments and logistics.

![Brochure site versus online store — a shopper paying in an online store on a laptop](/images/blog/business-site-vs-online-store.webp)

The real difference is not the number of pages but **the purpose**. A brochure site exists to present and persuade — it turns a visitor into a lead. An online store exists to sell — it manages stock, takes payment and produces an order. A business that builds a store when all it needs is a brochure site pays for complexity it will never use; a business that builds a brochure site when it needs to sell leaves revenue on the table.

## Brochure site or online store — what is the difference and who is each for?

In short: a brochure site turns visitors into leads, and an online store closes the sale and takes payment on the site itself. Here is the quick comparison:

| Criterion | Brochure site | Online store |
| --- | --- | --- |
| Purpose | Generating leads and enquiries | Selling and taking payment directly |
| Price range (2026) | ₪4,000–25,000 | ₪20,000+ |
| Ongoing maintenance | Low | Higher (stock, orders) |
| Suits | Service providers, brands, specialists | Retail, physical and digital products |

## Which store platform should you choose — Shopify, WooCommerce or Wix?

If you have settled on a store, the platform is the next decision. Each one has a different character:

| Platform | Main advantage | Who it suits |
| --- | --- | --- |
| Shopify | Fast to set up, everything in the subscription | Anyone who wants to launch quickly, without technical overhead |
| WooCommerce | Full flexibility and ownership of the code | Anyone who wants control and customisation, on WordPress |
| Wix | The cheapest and simplest way to start | A very small store with a limited catalogue |

The difference between an open platform such as WooCommerce and a closed subscription system is exactly the discussion we set out in the [WordPress versus custom code guide](/en/blog/wordpress-vs-custom-code) — the same considerations of flexibility, ownership and growth ceiling apply to stores as well.

## What both kinds of site need — visibility in Google and speed

Whichever you choose, the site has to be found and it has to load fast. Most buying journeys start with a search, and Google holds [around 90% of the global search market](https://gs.statcounter.com/search-engine-market-share), which makes proper SEO a baseline requirement for a brochure site and a store alike. In an online store the weight is doubled: load speed affects conversion rate directly, so meeting [Google's Core Web Vitals](https://web.dev/articles/vitals) stops being a nice-to-have and becomes a genuine business requirement.

## How do you know which is right for your business?

Ask yourself one decisive question: can the customer complete the purchase on their own on the site, or do they need to speak to you first? Here is how that translates into practical signs:

**Choose an online store if:**
- You have a product catalogue at fixed prices that can be bought without a sales conversation.
- You want to take payments on the site around the clock, without you being there.
- You sell a physical or digital product in volume, and the direct conversion rate matters to you.

**Choose a brochure site if:**
- You sell a service, consulting or a bespoke project priced on request.
- Your customer journey is an enquiry and a conversation, not a click on "add to basket".
- You are building authority and trust — clinics, consultants, professionals — and want a steady flow of leads.

Service businesses will almost always get more from a strong brochure site with landing pages, because buying from them is a conversation rather than a button click, while businesses selling a defined product at a known price do better with a store. There is also a middle route: a brochure site with a small store built into it, which suits anyone selling both a service and a handful of products.

Before deciding, it is worth understanding the full price ranges in the [2026 website cost guide](/en/blog/website-cost-israel-2026), and if you have settled on a store, go deeper with the [guide to building an online store that sells](/en/blog/ecommerce-store-that-sells).

---

**Not sure which suits you?** Tell us about the business through the [contact page](/en/contact) and we will give you an honest recommendation — brochure site, store, or a combination of the two. Take a look at AITERRA's [web development service](/en/services/web-development).

## Further reading

- [Building an online store that sells: the complete e-commerce guide](/en/blog/ecommerce-store-that-sells)
- [What does a website for a small business in Israel cost in 2026?](/en/blog/website-cost-israel-2026)
- [WordPress or custom code? A guide to choosing the platform](/en/blog/wordpress-vs-custom-code)`,
    faq: {
      title: 'Frequently asked questions about brochure sites and online stores',
      items: [
        {
          q: 'What is the difference between a brochure site and an online store?',
          a: 'A brochure site exists to present, persuade and generate enquiries, while an online store exists to sell and take payment directly — it manages a catalogue, stock, payments and orders. As a rule, service businesses such as consultants, clinics and professionals get more from a brochure site, while businesses selling a defined product at a known price get more from an online store.',
        },
        {
          q: 'What does an online store cost compared with a brochure site?',
          a: 'In 2026 a brochure site runs roughly between ₪4,000 and ₪25,000, and an e-commerce store usually starts at ₪20,000 and up, because it includes a product catalogue, a payment system, stock management and logistics. Ongoing maintenance of a store is higher as well, because of stock updates, orders and payment security.',
        },
        {
          q: 'WooCommerce, Shopify or Wix — which should you choose for a store?',
          a: 'Shopify is fast to set up and convenient for anyone who wants to launch without technical overhead; WooCommerce gives full flexibility and ownership of the code on WordPress; Wix is the cheapest and simplest option for a very small store. The choice depends on the level of control, the flexibility and the growth ceiling you need.',
        },
        {
          q: 'Can you start with a brochure site and add a store later?',
          a: 'Yes, and it is a common and sensible route. You can build a strong brochure site and add a small store to it later, or move to a full store once the business matures. The key is to build on a flexible platform from the start, WordPress with WooCommerce for example, so the expansion does not mean rebuilding the whole site.',
        },
      ],
    },
  },

  'cheap-website-hidden-costs': {
    title: 'Cheap Website: 7 Hidden Costs Nobody Mentions',
    excerpt:
      'A cheap website is tempting, but the price hides real costs: code ownership, hosting, SEO, accessibility, maintenance and an eventual rebuild.',
    tags: ['Web development', 'Pricing', 'Hidden costs', 'Cheap website', 'Small business'],
    content: `**In short (TL;DR):** A hidden cost is any payment a site genuinely needs in order to run that does not appear in the cheap build price. A website at ₪1,500 usually covers a ready-made template and nothing more; ownership of the code, hosting, search optimisation, accessibility and maintenance are all added separately — and sometimes force a rebuild, which means paying twice.

A website for ₪1,500 almost never ends up costing ₪1,500. That low price usually covers a ready-made template and nothing else, and everything that turns a site into a business tool — search optimisation, content, decent hosting, ownership of the code and maintenance — is added later as separate costs, or is missing altogether. In this article we break down what really hides behind a cheap website, so that you compare proposals on real value rather than on the number on the sign.

![A hand on a calculator beside documents — working out the hidden costs behind a cheap website](/images/blog/cheap-website-hidden-costs.webp)

A hidden cost is any payment the site genuinely needs in order to operate that does not appear in the cheap initial proposal. The problem is not that a cheap site is always bad — it is that cheap usually describes a starting point only, while the real cost of a business asset plays out across the first year and beyond. A business that prices the build and ignores what follows is planning to overrun its budget.

## What are the seven most common hidden costs?

| The hidden cost | What actually happens |
| --- | --- |
| Ownership of the code and the domain | The site is rented — it cannot be moved to another supplier |
| Hosting and annual maintenance | A recurring charge that was never mentioned in the original proposal |
| Search optimisation and content | An empty template with no SEO and no content that brings customers |
| Mobile compatibility and speed | A slow site that Google ranks low and visitors abandon |
| Accessibility required by law | Failing the standard exposes the business to claims and fines |
| Changes and updates | Every small fix turns into a separate charge |
| A rebuild | After a year you start from scratch — and pay twice |

The last two rows of the table are usually the most expensive. Accessibility is not a recommendation but a legal obligation: in Israel, [the Equal Rights for Persons with Disabilities Law and standard IS 5568](https://www.gov.il/he/pages/website_accessibility) require business websites to be accessible, and failing to comply exposes you to claims and fines. And a rebuild means paying twice, the most painful cost of all, which we come to next.

## Why is a ready-made template not really a website?

A cheap template looks good in a demo, but it is an empty shell. A site that brings in customers needs content that speaks to your audience, a structure Google likes, and fast loading. That matters all the more because Google holds roughly 90% of the search market ([StatCounter data](https://gs.statcounter.com/search-engine-market-share)) — and a template that is not built for search simply does not appear where your customers are looking for you. The gap between a template and a business website is precisely the work the cheap price skips, and that is the difference between a digital business card nobody finds and a site that generates enquiries.

## Which cost hurts most? Paying twice

This is the most common story of all: a business pays little for a cheap site, discovers a few months later that it is slow, impossible to update, not promoted and not even owned by them, and then pays again, from scratch, to a serious supplier. In total it has paid more than if it had built properly the first time, and lost months of digital presence along the way. Beyond the money, a new site starts accumulating Google rankings from zero, so a rebuild costs time and the organic positions already earned. Cheap that forces a rebuild ends up being the most expensive option there is.

## How do you compare proposals fairly?

- **Ask what is not included.** This is the single most important question to put to any cheap proposal.
- **Ask for the total annual cost**, not just the build price — including hosting, maintenance and changes.
- **Confirm full ownership** of the domain, the hosting and the code, in writing.
- **Check that basic search work and content are included**, or at least that the site is built ready for search.
- **Do not compare number with number** — compare value with value.

To know what the fair range genuinely is, work through the [guide to website costs for a small business in 2026](/en/blog/website-cost-israel-2026), with real price ranges for every type of site. And before you sign any proposal, test it against the [nine red flags in choosing an agency](/en/blog/how-to-choose-digital-agency).

## So when does a cheap website actually make sense?

When you are testing an idea on a minimal budget, understand the limitations precisely, and plan to upgrade once the business proves itself. Building it yourself or using a basic template is a legitimate start for a business that is days old, as long as you go in with your eyes open and know it is a stopgap rather than a destination. The only real problem is paying for cheap in the belief that you have received a complete business asset.

---

**Want a transparent proposal with no surprises?** At AITERRA we say up front what is included, what is not, and what you will pay across the year. Take a look at our [web development service](/en/services/web-development) or [leave your details](/en/contact) for an honest proposal.

## Further reading

- [How much does it cost to build a website for a small business in Israel in 2026?](/en/blog/website-cost-israel-2026)
- [A business website: how to choose a company, what the process is and what it costs](/en/blog/website-building-services)
- [How to choose a reliable digital agency: 9 red flags](/en/blog/how-to-choose-digital-agency)`,
    faq: {
      title: 'Frequently asked questions about cheap websites and hidden costs',
      items: [
        {
          q: 'Why does a ₪1,500 website end up costing more?',
          a: 'Because that price usually covers a ready-made template and nothing else. Everything that turns a site into a business tool — search optimisation, content, decent hosting, maintenance and ownership of the code — is added later as separate costs, or is missing entirely. Often the site also has to be rebuilt after a year, which means paying twice.',
        },
        {
          q: 'What are the common hidden costs in a cheap website?',
          a: 'No ownership of the code and the domain, so the site is effectively rented; hosting and annual maintenance that were never mentioned; no search optimisation and no content; a slow site that is not built for mobile; failure to meet the accessibility standard; a charge for every small change; and sometimes a full rebuild after a year. None of these appear in the cheap build price.',
        },
        {
          q: 'How do you compare website proposals fairly?',
          a: 'Do not compare number with number, compare value with value. Ask what is not included, ask for the total annual cost including hosting, maintenance and changes, confirm in writing that you own the domain, the hosting and the code, and check that basic search work and content are covered, or at least that the site is built ready for search.',
        },
        {
          q: 'When does a cheap website actually make sense?',
          a: 'When you are testing an idea on a minimal budget, understand the limitations and plan to upgrade once the business proves itself. A basic template is a legitimate start for a business that is only days old, as long as it is clear that this is a temporary stopgap and not a full business asset expected to bring in customers over time.',
        },
        {
          q: 'Does a cheap template site meet the accessibility rules in Israel?',
          a: 'Usually not. In Israel the Equal Rights for Persons with Disabilities Law and standard IS 5568 require business websites to be accessible, and cheap templates are almost never built to that standard. Non-compliance exposes the business to claims and fines, which is why accessibility work is a cost to include from the outset rather than defer.',
        },
      ],
    },
  },

  'content-marketing-blog': {
    title: 'Content Marketing: A Blog That Earns Leads',
    excerpt:
      'A paid campaign ends when the budget does. A good article keeps bringing customers for years. How to build a business blog that works.',
    tags: ['Content', 'SEO', 'Digital'],
    content: `**In short (TL;DR):** Content marketing means building a business blog that answers customer questions before the purchase, turning articles into an asset that produces organic leads for years ahead. Unlike paid advertising, which stops the moment the budget runs out, quality content keeps ranking in Google and gets cited in AI answers at no further cost.

Every shekel you put into paid advertising works exactly until the budget runs out. A good professional article, by contrast, keeps bringing visitors, leads and customers months and years after it was written, with no further payment. That is the fundamental difference between a marketing expense and a marketing asset, and it is why content marketing is the growth strategy of choice for businesses that think ahead.

![Writing professional content for a business blog on a laptop](/images/blog/content-marketing-blog.webp)

## What does good content do that an advert cannot?

An advert interrupts; content helps. When a potential customer looks for the answer to a professional question and finds it with you, something appears that no campaign can manufacture: trust. They received value before paying a shekel, and when the moment comes to choose a supplier they will choose whoever has already proved expertise. That is how content turns you from one more option in a tender into the authority people approach directly.

## Content versus paid advertising: what is the real difference?

The two channels complement each other, but they behave completely differently over time. The table below sums up the difference:

| Parameter | Paid advertising (PPC) | Content marketing |
|---|---|---|
| When it stops working | The moment the budget runs out | Keeps working for years |
| Cost over time | Recurs every month | One-off per article |
| Builds trust and authority | Little | Very high |
| Visibility in AI answers | Almost none | High |
| Time to first result | Immediate | Weeks to months |
| Type of asset | An expense | A compounding asset |

The conclusion: paid is excellent for driving immediate traffic and for launches, and content is excellent for building an organic lead base that only gets cheaper as time passes.

## The formula: answer the questions customers really ask

A good business blog does not write about what interests the business — it answers what customers ask. Every question you hear in a sales call is an article idea: how much does it cost, what is the difference between one option and another, how do you choose a supplier, what are the common mistakes. An article that answers a question like that honestly attracts exactly the visitors who are a moment away from a decision, which is the most valuable traffic there is.

![Planning a content strategy with a notebook and coffee beside the computer](/images/blog/content-marketing-blog-2.webp)

## Why now in particular? The numbers

There is a new and urgent reason to invest in content in 2026: the search engine is changing underneath us.

- Google still holds [around 90% of the global search market](https://gs.statcounter.com/search-engine-market-share) — the arena in which organic content is measured.
- The research firm Gartner has forecast that traditional search volume in engines is set to fall significantly by 2026 as users move to AI assistants, which transfers value to the sources the AI cites.
- One quality article a month compounds into 12 content assets a year, each of which keeps ranking and bringing in leads alongside the others.

When ChatGPT or Google AI Overviews answer a question in your field, they pull the answer from authoritative sources — and a business with a deep, professional content library is exactly such a source. Whoever builds a quality bank of answers today is buying presence in the answers of tomorrow.

## How do you make a blog last?

The great enemy of a business blog is enthusiasm that fades: three articles in the first month, then a year of silence. Results come from a steady rhythm — even one quality article a month, every month, built around orderly keyword research. At Aiterra every content plan is built a year ahead: topics, target phrases and structure, so that the blog works as a system rather than as a hobby.

And it is worth remembering that a good article does not stay in the blog alone. The same content is distributed again and again — a post on social media, a newsletter to existing customers, a ready answer for a customer who asks. That way one article works across several channels at once, and the one-off investment in writing keeps returning value long after it was published.

Want a blog that produces leads rather than just words? Leave your details and we will build you a full content strategy with a publishing plan for the year.

---

**Want us to do it for you?** See the AITERRA [organic SEO](/en/services/seo) service, or [leave your details](/en/contact) for a free consultation.

## Further reading

- [Keyword research: how to discover what your customers are really searching for on Google](/en/blog/keyword-research-guide)
- [How do you choose SEO services? The guide that will save you a year of wasted budget](/en/blog/seo-services)`,
    faq: {
      title: 'Common questions about content marketing',
      items: [
        {
          q: 'How long before a blog starts producing results?',
          a: 'Articles begin gathering rankings in Google within weeks to months, and the effect compounds: the more quality content there is, the more authoritative the site is judged to be, and the faster each new article ranks. In practice, a year of consistent publishing — one article a month — completely changes the volume of organic traffic and leads.',
        },
        {
          q: 'Can content be written with artificial intelligence?',
          a: 'AI tools such as ChatGPT are excellent for research and for drafts, but generic content generated automatically builds no authority and beats no competitor. The value sits in your real knowledge: experience, examples from the field and a professional position — exactly what a model cannot invent, and exactly what the search engines reward.',
        },
        {
          q: 'What should you write about first?',
          a: 'Start with the questions customers ask most often before buying: price questions, comparisons between options, and how the work is done. These are the articles with the highest purchase intent, they attract visitors who are a moment away from a decision, and they start producing leads faster than any other type of content.',
        },
        {
          q: 'What is the difference between content marketing and paid advertising?',
          a: 'Paid advertising (PPC) brings immediate traffic but stops the moment the budget runs out. Content marketing is a compounding asset: a good article keeps ranking, keeps building trust and keeps bringing leads for years ahead, and today it also gets cited in AI answers. The ideal combination uses paid for the short term and content for the long-term base.',
        },
      ],
    },
  },

  'crm-israeli-invoicing-integration': {
    title: 'CRM Invoicing Integration for Israeli Firms',
    excerpt:
      'Typing every deal twice wastes hours and creates errors. How to connect a CRM to Morning, Hashavshevet, iCount or Rivhit and automate your bookkeeping.',
    tags: ['CRM', 'Morning', 'Hashavshevet', 'iCount', 'Automation', 'Bookkeeping'],
    content: `**In short (TL;DR):** Connecting a CRM to Israeli accounting software — Morning (formerly Green Invoice), iCount, Rivhit or Hashavshevet — is an automatic bridge that issues a tax invoice or receipt and sends it to the customer the moment a deal closes in the CRM, with no double entry. The result: hours saved every month, fewer errors and faster collection.

One of the classic pain points for an Israeli business is double entry: you close a deal in the CRM, then type it in again by hand in the accounting software to issue the invoice. A connection between the CRM and Morning (formerly Green Invoice), Hashavshevet, iCount or Rivhit removes that duplication: the moment a deal closes, the invoice is issued and sent to the customer automatically. It saves hours every month and prevents the kind of errors that only come to light at the end of the tax year.

![Connecting a CRM to Israeli accounting software — bookkeeping automation with a calculator and documents](/images/blog/crm-israeli-invoicing-integration.webp)

A CRM-to-accounting connection is an automatic bridge that moves deal data — customer, amount, line items — from the system where you manage sales into the system where you issue accounting documents, with no re-typing. In Israel it matters even more, because issuing a tax invoice or receipt is a legal obligation with precise structural requirements.

## Which accounting systems connect to a CRM?

Most of the accounting packages commonly used in Israel offer an API for integration. These are the common ones:

| Software | Type | Suits |
| --- | --- | --- |
| Morning (formerly Green Invoice) | Cloud, simple and popular | Freelancers and small businesses |
| iCount | Cloud, feature-rich | Small and mid-sized businesses |
| Rivhit | Cloud and desktop | Small and mid-sized businesses |
| Hashavshevet | The long-standing accounting standard | Accountants and established businesses |

The choice depends on what you — or your accountant — already work with: the integration is built towards the existing system, not the other way round. Worth remembering: almost no business needs to change accounting software in order to automate. The same accountant, the same reports, the same software — just without the manual typing in the middle.

## Why now? The numbers behind the Israel Invoice model

Since 1 January 2024 the Israel Tax Authority has operated the **Israel Invoice** model, which requires an **allocation number** as a condition for deducting input VAT on invoices above a threshold that keeps falling:

- Above roughly ₪20,000 — during 2025.
- Above roughly ₪10,000 — from 1 January 2026.
- Above roughly ₪5,000 — from 1 June 2026.

In practice, almost every business invoice now needs an allocation number from the Tax Authority. When the CRM is connected to the accounting software, the data arrives clean in the system that requests the allocation number from the authority — without stopping every deal to type the details in and request a number by hand. The official details are published on the [Israel Invoice model page of the Tax Authority](https://www.gov.il/he/departments/topics/israel-invoice/govil-landing-page).

## What can actually be automated?

Once the bridge is standing, you can automate far more than issuing a single document — a whole chain runs by itself, from the closed deal through to the payment:

- **Automatic invoice or receipt issuing** the moment a deal is marked as closed in the CRM.
- **Sending the document to the customer** automatically, by email or WhatsApp.
- **Payment status sync** — when a customer pays, the CRM updates.
- **Automatic collection reminders** on invoices that have not been paid.
- **Consolidated reporting** — one picture of revenue without cross-checking two systems by hand.
- **Opening a customer record** in the accounting software automatically when a new customer is created in the CRM, with no entering the details twice.

In practice this means a salesperson who closes a deal never touches the accounting software at all: they mark it as closed, and the invoice, the delivery to the customer and the payment status all happen by themselves in the background. That is the difference between a business that loses a working day a month to data entry and one that frees that time up for selling.

## How do you connect them? The steps

Setting this up is not a huge project — usually a few hours of one-off configuration that pays for itself in the first month. The stages:

1. **Confirm both systems have an API.** Most CRMs and Israeli accounting packages support one.
2. **Define the trigger** — which event in the CRM issues the document, a paid or closed status for example.
3. **Map the fields** — customer, company or ID number, line items, VAT — so the invoice comes out valid.
4. **Test on one real deal** before switching it on for everything.
5. **Add follow-on automations** — sending to the customer, collection reminders, status updates.

This is one of the highest-return automations there is, and it slots straight into the [12 processes worth stopping doing by hand](/en/blog/business-automation-12-processes). The foundation for all of it is a CRM that fits — see the [guide to choosing a CRM for a small business in Israel](/en/blog/best-crm-small-business-israel) — and usually a [WhatsApp to CRM connection](/en/blog/whatsapp-business-api-crm-integration) as well, to close the loop with the customer. At Aiterra we recommend defining the process first — which documents are issued and when — and only then wiring it up technically, so the system behaves correctly from day one.

---

**Want to stop typing everything twice?** Take a look at AITERRA's [business automation service](/en/services/development), or [talk to us](/en/contact) and we will connect your CRM to your accounting software.

## Further reading

- [Which CRM suits a small business in Israel best?](/en/blog/best-crm-small-business-israel)
- [Business automation: 12 processes worth stopping doing by hand](/en/blog/business-automation-12-processes)
- [Connecting WhatsApp Business API to a CRM](/en/blog/whatsapp-business-api-crm-integration)`,
    faq: {
      title: 'Common questions about connecting a CRM to accounting software',
      items: [
        {
          q: 'Which accounting packages can be connected to a CRM?',
          a: 'Most of the accounting packages commonly used in Israel offer an API for integration, among them Morning (formerly Green Invoice), iCount, Rivhit and Hashavshevet. The integration is always built towards the system you or your accountant already work with, not the other way round — so there is no need to change software in order to automate the bookkeeping.',
        },
        {
          q: 'What is the main gain from connecting a CRM to invoicing?',
          a: 'The end of double entry. The moment a deal closes in the CRM, the invoice or receipt is issued and sent to the customer automatically. That saves hours of work every month, prevents typing errors that only surface at the end of the year, and removes the need to cross-check two systems by hand. Collection speeds up too, because the document reaches the customer as soon as the deal closes.',
        },
        {
          q: 'Will an automatically issued invoice be legally valid?',
          a: 'Yes, as long as the integration is configured correctly. Israeli accounting packages issue documents that meet the requirements of the law and the Tax Authority; the job of the integration is only to pass them the right data — customer, company or ID number, line items and VAT. That is exactly why it is important to test one real deal and confirm the document is valid before switching the automation on for everything.',
        },
        {
          q: 'Does the integration help with allocation numbers under the Israel Invoice model?',
          a: 'Yes, indirectly. The allocation number is obtained by the accounting software from the Tax Authority, not by the CRM. The job of the integration is to pass it accurate deal data — customer, company number, line items and amount — so that every invoice above the threshold receives a valid allocation number automatically, with no manual typing and without holding the customer up at the close.',
        },
        {
          q: 'What do you need in order to set the integration up?',
          a: 'Both systems need an API, which most of them have; you then define which event in the CRM issues the document, a closed or paid status for example, and map the fields correctly. It is worth testing on one real deal, and then adding follow-on automations such as sending the document to the customer, payment sync and collection reminders.',
        },
      ],
    },
  },

  'digital-branding-guide': {
    title: 'Digital Branding: Build a Brand People Remember',
    excerpt:
      'A logo is not a brand. A brand is why a client picks you over ten identical competitors in Google — and how you charge more than they do.',
    tags: ['Branding', 'Brand identity', 'Design', 'Digital marketing', 'Small business'],
    content: `**In short (TL;DR):** Digital branding is the promise a business makes and the way it keeps that promise consistently at every online touchpoint. A strong brand gives the customer a reason to choose you out of ten identical competitors in Google, and lets you price higher instead of competing on cost alone.

Run a small experiment: search Google for the service you offer. You get ten competitors saying exactly the same thing — professional, reliable, personal service. When everyone looks and sounds alike, the customer chooses on price. Good digital branding breaks that tie: it gives the customer a reason to choose you, and to pay more for it.

![Building a brand identity with a colour palette and design materials](/images/blog/digital-branding.webp)

## A brand is not a logo, so what is the difference?

A logo, colours and a typeface are only the shell. A real brand is the promise your business makes and the way it keeps that promise at every touchpoint: on the site, on the business profile, in the ads, in emails and even in the way the phone is answered. When that promise is clear and consistent, something interesting happens — customers begin to recognise you, to remember you and to recommend you.

The confusion between the two costs money. Here is the difference at the bottom line:

| Aspect | A logo alone | A complete brand |
| --- | --- | --- |
| What it is | A single graphic symbol | A system of promise, look and voice |
| What the customer remembers | A vague picture | A consistent experience and feeling |
| Effect on price | Competing on price | Pricing at a premium |
| Consistency across channels | Changes between the site and Instagram | Identical at every touchpoint |
| How long it lasts | Dates quickly | An asset that compounds over years |

## What are the three components of a strong digital identity?

**Genuine differentiation:** what do you do differently from everyone else? Not an empty slogan, but a specific promise competitors cannot easily copy. This is the strategy work that comes before any design.

**A consistent visual language:** a professional logo, a defined colour palette, uniform typography and a settled photographic style — in every channel and every format. A visitor moving from the ad to the site should feel they have arrived at precisely the same business.

**A brand voice:** how does the brand speak? Formal or friendly, technical or plain? The tone of the copy on the site, on social and in emails is as much a part of the identity as the colours are.

## Why now? The numbers

Branding begins exactly where the customer looks for you — and most of that searching still happens in one place:

- Google holds around 90% of the global search market, which makes a consistent identity in the search results and in the ads critical ([StatCounter](https://gs.statcounter.com/search-engine-market-share)).
- Paid ads carrying a familiar identity attract more clicks on the same budget — a direct improvement in ROI with no increase in spend.
- A differentiated brand can price higher, because it is not competing on price alone.
- Visitors stay longer on a site that projects professionalism and consistency, which raises the chances of conversion.

The meaning is simple: investing in branding is not an expense on good looks; it is a multiplier on every marketing shekel you spend afterwards.

## Where do you start?

At Aiterra the branding process begins with strategy: who the audience is, who the competitors are, and what story only you can tell. From there the visual and verbal identity is built, and it is then applied across every asset — site, profiles, ad templates and sales materials — so that everything the customer meets speaks the same language.

Does your business look like everyone else? Leave your details and we will build you an identity nobody could confuse with a competitor.

---

**Want campaigns that return the investment?** See the AITERRA [paid advertising](/en/services/marketing) service, or [leave your details](/en/contact) for a free consultation.

## Further reading

- [Short video for business: TikTok, Reels and Shorts, the reach machine of 2026](/en/blog/short-video-marketing)
- [Content marketing: why a business blog is an asset that produces leads for years](/en/blog/content-marketing-blog)`,
    faq: {
      title: 'Common questions about digital branding',
      items: [
        {
          q: 'What is the difference between branding and logo design?',
          a: 'A logo is one component inside a whole system. Branding covers the strategy (differentiation, audience, messaging), the visual identity (logo, colours, typography) and the brand voice — and, more importantly, their consistent application in every channel, from the website to the ads. The logo identifies you, but the complete brand is what makes a customer choose you and remember you.',
        },
        {
          q: 'When is the right time to rebrand?',
          a: 'When the business has moved on and the branding has stayed behind: a new audience, new services, or an awkward gap between the quality of the work and how the business looks online. A steady fall in conversions despite good traffic to the site is another clear signal that the existing identity no longer convinces the visitors who reach you.',
        },
        {
          q: 'Does a small business really need branding?',
          a: 'A small business especially. Without huge advertising budgets, differentiation and consistency are the way to stand out against larger competitors. Basic branding done properly — a clear promise, a uniform look and a consistent voice — costs relatively little and repays itself in every campaign, because it improves clicks, trust and conversions.',
        },
        {
          q: 'How long does it take to build a digital brand?',
          a: 'The strategy and visual identity stage usually takes several weeks, depending on the range of assets. But a brand is not a one-off project: it is an accumulating asset that strengthens with every consistent touchpoint over months and years. The foundation is built quickly, while recognition and trust build up with time and exposure.',
        },
        {
          q: 'Does a strong brand really let you charge more?',
          a: 'Yes. When a brand offers a specific promise and differentiation that is hard to copy, the customer no longer compares you on price alone but on the value and the trust you convey. A consistent, professional brand justifies premium pricing and takes the business out of a merciless race to the cheapest shekel.',
        },
      ],
    },
  },

  'email-marketing-guide': {
    title: 'Email Marketing in 2026: The Highest-ROI Channel',
    excerpt:
      'While everyone chases trends, your mailing list is the one marketing asset you own. How newsletters and automations become a quiet sales machine.',
    tags: ['Digital', 'Automation', 'Conversions'],
    content: `**In short (TL;DR):** Email marketing is direct marketing to a permission-based mailing list, and it remains one of the highest-return channels in digital marketing. The decisive advantage: the customer list is an asset you own outright — one that no external platform algorithm can take away from you.

Here is a fact that surprises most business owners: after all the trends, the networks and the shifting algorithms, email marketing remains one of the highest-return channels in digital marketing. The reason is simple — the mailing list is the only asset you own outright. Meta's algorithm can bury you tomorrow morning; nobody can take your customer list.

![Messaging and email apps on a smartphone screen](/images/blog/email-marketing.webp)

## Why email, and why now?

When a visitor gives you their email address, they are giving you permission to speak to them directly — without paying for every impression and without competing against an algorithm. In an era when paid advertising costs only climb, a channel that lets you return to existing customers and interested prospects at almost no cost is an enormous commercial advantage. And an existing customer, as everyone knows, buys far more easily than a new one.

It is worth understanding the scale of the dependency on platforms: Google alone holds roughly 90% of the global search market (according to [StatCounter](https://gs.statcounter.com/search-engine-market-share)), so a single algorithm update at Google or Meta can change overnight how much exposure you get. The mailing list, by contrast, is the one channel that does not depend on a third party.

## Email marketing versus paid advertising: which actually pays?

The common mistake is to assume you have to choose between the two. In practice each channel plays a different role:

| Criterion | Email marketing | Paid advertising (Meta / Google Ads) |
| --- | --- | --- |
| Ownership of the audience | Full — the list is yours | None — the audience belongs to the platform |
| Marginal cost of one more impression | Almost zero | Payment for every impression or click |
| Dependence on an algorithm | Low | Very high |
| Fit for existing customers | Excellent | Moderate |
| Effect of a change on the platform | Minimal | Critical |

The conclusion is not either/or: paid advertising is excellent at bringing in a new audience, and email turns that audience into repeat customers at low cost. It is the combination of the two that wins.

## How do you build a newsletter people actually open?

The difference between a newsletter that gets deleted and one people wait for is real value: professional tips, customer stories, a look behind the scenes — and only then, gently, a commercial offer. Our rule of thumb: for every sales email, three emails that give something away. The subject line decides whether the email is opened at all, so it deserves the effort — short, curious and honest, without the overblown promises that lead straight to the spam button. That is how you build a list that opens, reads and clicks.

## What are email automations, and why are they the quiet salesperson?

This is where email connects to the world of [automation](/en/services/development) we live in. A sequence built once keeps working for years — warming cold leads, waking dormant customers and producing sales without anyone on the team touching a keyboard. These are the sequences we at Aiterra set up for almost every client:

- **A welcome sequence:** an automated series of emails for every new subscriber, introducing the business and building trust from the first moment.
- **A follow-up email after a guide download:** for anyone who took a lead magnet — an email that continues the conversation and moves them to the next stage.
- **Abandoned basket recovery:** an automatic reminder for anyone who started a purchase and did not finish — one of the most profitable sequences in online retail.
- **A birthday greeting with an offer:** a personal touch that produces a sale and strengthens loyalty over time.

The effectiveness of each sequence is best measured with an analytics tool such as GA4 ([Google Analytics documentation](https://support.google.com/analytics)) — so you can see which emails actually lead to opens, clicks and sales, and improve accordingly.

## How do you start building the mailing list?

The right way starts with a lead magnet that is genuinely worth having — a guide, a calculator, a checklist or a joining discount — in exchange for signing up. Avoid buying lists (it is both unlawful and damaging to your sender reputation), and keep to Israeli anti-spam law: explicit opt-in and a clear unsubscribe option in every email. As the list grows, segment it into groups by interest or by stage in the funnel — that way every recipient gets relevant content, and open and conversion rates rise.

Want to turn your customer list into a revenue machine? Leave your details and we will build you a full email strategy — from the magnet through to the automation.

---

**Want to save hours of work every week?** Take a look at AITERRA's [business automation service](/en/services/development), or [talk to us](/en/contact) for a scoping call at no cost.

## Further reading

- [Business automation: how to stop losing leads and win back dozens of hours a month](/en/blog/business-automation-crm-whatsapp)
- [Content marketing: why a business blog is an asset that produces leads for years](/en/blog/content-marketing-blog)`,
    faq: {
      title: 'Common questions about email marketing',
      items: [
        {
          q: 'Is email marketing still effective in the age of social media and AI?',
          a: 'Yes, and more than ever. While organic reach on the networks keeps falling and paid advertising costs keep rising, email lets you speak directly to an audience that has already given consent — at low cost and with no dependence on a shifting algorithm. The mailing list is an asset you own, which makes it far more stable than any external platform that could change its rules tomorrow.',
        },
        {
          q: 'How often should a newsletter go out?',
          a: 'Consistency matters more than frequency. A quality newsletter once a week or once a fortnight beats a daily email that gets deleted on sight. Start at a pace you are confident you can keep up, and measure open and click rates to calibrate: if opens are falling, you may be sending too often, or the content simply is not relevant enough.',
        },
        {
          q: 'Am I allowed to email everyone who has contacted me?',
          a: 'Not always. Israeli communications law (the anti-spam law) requires explicit prior consent for marketing mail, with certain exceptions for existing customers who have already bought from you. Every email must include a clear and simple unsubscribe option. Beyond the law, a list built on genuine consent also delivers far higher open and conversion rates than one that was bought or harvested.',
        },
        {
          q: 'What is a lead magnet, and how do you choose the right one?',
          a: 'A lead magnet is a piece of valuable content you give away in exchange for contact details: a PDF guide, a calculator, a webinar, a checklist or a discount code. The more genuinely specific and urgent the problem it solves for your target audience, the higher the quality of the people who sign up and the readier they are to buy. A magnet that is too generic attracts subscribers who will never purchase.',
        },
        {
          q: 'How do you measure whether email marketing is working?',
          a: 'You track a few core metrics: open rate (how many recipients opened the email), click rate (how many clicked a link) and conversion rate (how many took an action such as buying or leaving their details). It is worth connecting the mailing to an analytics tool such as GA4 so you can see which emails actually led to sales, not just to opens.',
        },
      ],
    },
  },

  'facebook-instagram-ads': {
    title: 'Facebook and Instagram Ads in 2026: What Works',
    excerpt:
      'Meta\'s AI now runs the targeting, so the creative is what sells. How short video, remarketing and a fast funnel turn scrolling into customers.',
    tags: ['Paid advertising', 'Digital', 'Branding'],
    content: `**In short (TL;DR):** Advertising on Facebook and Instagram in 2026 means paid campaigns across Meta's platforms, where artificial intelligence runs the targeting and the creative is what sells. The keys to a real return: short, authentic video, remarketing to a warm audience, and a complete funnel that runs from the ad to a fast landing page and on to a lead in WhatsApp.

Your customers spend hours a day scrolling the feed — on Instagram, on Facebook, through a five-second clip. The only question is whether they meet you there or your competitors. Advertising on Facebook and Instagram remains one of the strongest tools in digital marketing for business, but the rules of the game in 2026 are nothing like what worked two years ago. Anyone still running campaigns the old way is simply burning budget.

![Facebook and Instagram apps on a smartphone screen](/images/blog/facebook-instagram-ads.webp)

## Why creative has become the real targeting

Meta's advertising system has been through a revolution. AI-driven campaigns such as Advantage+ now find the right audience better than any manual targeting can. According to [Meta for Business](https://www.facebook.com/business), the company's platforms reach several billion active users every month — so the challenge is no longer finding an audience, it is stopping one. The implication surprises most advertisers: the real targeting has moved into the creative. The ad itself — the video, the image, the message — is what decides who the system shows you to and at what price. Investing in professional creative is no longer a luxury; it is the heart of the [campaign](/en/services/marketing).

## What content stops the scroll in 2026?

People smell an advert a mile off and keep scrolling. What stops the scroll in 2026 is content that feels real: short videos shot at eye level, customers describing an actual experience, a look behind the scenes of the business. At Aiterra the work starts with the strategy and the script, runs through filming and production, and ends with versions cut for each placement — feed, Reels and Stories — because a good ad is a good story first and an advert second.

What defines an ad that works in 2026?

- **The first three seconds:** a strong hook that stops the thumb before the sales message even begins.
- **Subtitles, always:** most people watch with the sound off, and on-screen text raises watch-through dramatically.
- **Full-screen vertical format:** built for Reels and Stories, not a landscape clip squeezed into the feed.
- **One clear call to action:** exactly what you want the viewer to do after watching — enquire, sign up or buy.

## Why is remarketing the audience closest to buying?

Someone who visited the site, watched most of a video or added to the basket without buying is your warmest lead. A properly built remarketing campaign meets them again with the right message at the right moment, and its cost per conversion is dramatically lower than a cold campaign. That is the first step we build into every media plan — before increasing budgets on new audiences. Here is the difference in practice:

| Parameter | Cold audience | Remarketing |
| --- | --- | --- |
| Who is the audience? | People who do not know you yet | Anyone who already visited, watched or added to basket |
| Campaign goal | Reach and demand creation | Closing the conversion |
| Relative cost per conversion | High | Dramatically lower |
| When to use it | Expanding to a new audience | The first step, before scaling budget |

## How do you build a funnel that turns an ad into a paying customer?

An excellent campaign that leads to a slow page is money thrown away. Because we are a development agency as well, your ads lead to fast landing pages built for conversion, and every enquiry drops automatically into the CRM and gets an immediate reply on WhatsApp — before the lead has time to cool. When every link in the chain is connected, the same media budget produces several times more customers, without spending another shekel on media itself.

## How much budget do you need to start?

Less than you think. It is better to start with a measured budget, give the system a learning phase of several days, measure a real cost per lead — and only then scale up confidently on what works. Increasing the budget on an imprecise campaign only increases the loss. The simple rule: first make sure the maths works at the level of a single lead, then pour in the fuel. For a typical local business, a modest starting budget is enough to gather reliable data within two to three weeks and make an evidence-based decision about continuing the investment.

Want to know how many new customers the feed could bring you? Leave your details now and we will build you a full social strategy — from the creative through to the lead in WhatsApp.

---

**Want campaigns that return the investment?** Take a look at AITERRA's [paid advertising service](/en/services/marketing), or [leave your details](/en/contact) for a consultation at no cost.

## Further reading

- [Short video for business: TikTok, Reels and Shorts — the reach machine of 2026](/en/blog/short-video-marketing)
- [A landing page that converts: why most visitors leave without getting in touch](/en/blog/landing-pages-that-convert)`,
    faq: {
      title: 'Common questions about social media advertising',
      items: [
        {
          q: 'Which is better for my business — Google Ads or Facebook?',
          a: 'They are complementary tools: Google captures customers who are already searching for the service, while Facebook and Instagram create demand and awareness among new audiences. For most businesses the combination of the two, with remarketing connecting them, produces the best result — Google closes the people who are already ready to buy, and Meta keeps filling the funnel with new leads.',
        },
        {
          q: 'What does advertising on Facebook and Instagram cost?',
          a: 'The budget has two parts: the media cost paid to Meta, and the campaign management fee. You can start with relatively modest budgets, and the key is measurement — once you know what a lead costs and what it is worth to you, the decision to scale the budget becomes simple arithmetic rather than a gamble.',
        },
        {
          q: 'What is an Advantage+ campaign?',
          a: 'Advantage+ is a Meta campaign type in which artificial intelligence manages targeting, budget and placement automatically. It performs best when you feed it a wide range of high-quality creative — which is why investing in good material (video, images and messaging) matters more today than ever, and is what decides whether the campaign succeeds.',
        },
        {
          q: 'How long does it take before a campaign produces results?',
          a: 'Meta\'s advertising system needs a learning phase of several days before it identifies the precise audience and stabilises the cost per lead. In the first fortnight it is important not to make frequent changes that reset the learning; gather data instead, measure a real cost per conversion, and only then optimise and scale the budget in a considered way.',
        },
        {
          q: 'Do we have to invest in video, or will images do?',
          a: 'Short video is the format that stops the scroll and currently delivers the best performance, particularly in Reels and Stories. That said, quality images still work very well, mainly in remarketing and in offer-led ads. The winning approach is to combine both and let Meta pick the winner for each audience.',
        },
      ],
    },
  },

  'ga4-pixel-conversion-tracking-guide': {
    title: 'Conversion Tracking: GA4, GTM and Meta Pixel',
    excerpt:
      'Without measurement you are marketing blind. How to install GA4, Google Tag Manager and the Meta Pixel, and set up conversion tracking that works.',
    tags: ['GA4', 'Google Tag Manager', 'Meta Pixel', 'Conversion tracking', 'Analytics'],
    content: `**In short (TL;DR):** Conversion tracking means defining the actions that matter on your site — a lead, a phone call or a purchase — and following how many of them happen and where they came from. The three tools you need are Google Analytics 4 for behaviour analysis, Google Tag Manager to manage the tracking code, and the Meta Pixel to optimise campaigns. Without them you are marketing blind.

Without proper measurement, every shekel you put into marketing is a guess. The three tools every business needs are Google Analytics 4 (to see what happens on the site), Google Tag Manager (to manage all your tracking code in one place) and the Meta Pixel (to measure and optimise campaigns on Facebook and Instagram). A correct installation takes a few hours, and without it there is no way to know which channels actually bring customers.

![Installing GA4, Google Tag Manager and the Meta Pixel — a team reviewing conversion data and charts](/images/blog/ga4-pixel-conversion-tracking-guide.webp)

Conversion tracking is the process of defining the actions that matter on your site — submitting a form, calling, buying — and following how many of them happen and from which source. Without it you see traffic, but you have no idea how much of it turned into money.

## Why is measurement critical? The numbers

A few figures that show why measurement is a baseline condition rather than a luxury:

- Google holds [around 90% of the global search market](https://gs.statcounter.com/search-engine-market-share) — a large share of site traffic starts with a search, and without measurement there is no way to know which terms and channels actually bring customers.
- Universal Analytics was shut down officially in July 2023, and [GA4 became the standard measurement tool at Google](https://support.google.com/analytics) — a business that never implemented it simply is not measuring any more.
- Most small businesses miss at least one critical conversion, usually a phone tap or a WhatsApp tap on mobile, and so under-value precisely the channel that is working.

## The three tools — what does each one do?

| Tool | What it does | Why you need it |
| --- | --- | --- |
| Google Analytics 4 | Analyses visitor behaviour on the site | To understand where people arrive from and what they do |
| Google Tag Manager | Manages all your tracking code | To add and change tracking without touching the code |
| Meta Pixel | Measures actions for Meta campaigns | To enable optimisation and audience retargeting |

The trick is to install Google Tag Manager first and then manage GA4 and the Pixel through it — that way nothing in the site code has to change for every small adjustment, and every new tracking event is added from a single interface.

## How do you install them? The order of operations

1. **Open a Google Tag Manager account** and install the container code on the site once.
2. **Create a GA4 property** and connect it through Google Tag Manager (a Google Tag).
3. **Add the Meta Pixel** as another tag in Google Tag Manager.
4. **Define conversion events** — a phone tap, a form submission, a purchase — as events, and mark them as conversions in GA4.
5. **Check that everything fires** in Google Tag Manager preview mode and in the GA4 realtime report before you publish.

One important tip: make sure every tag fires exactly once. Duplicate tags inflate your conversion numbers, mislead the campaign algorithm and waste budget — which is why the preview check is not optional.

## What matters most to measure in a small business?

You do not need to drown in data. These are the conversions that genuinely matter for most businesses:

- **A form submission** — the classic lead.
- **A tap on a phone number or WhatsApp** on mobile — critical in Israel, and usually forgotten.
- **A purchase or a started checkout** — in an online store.
- **A view of a key page** — a pricing or contact page, for example.

Connecting that measurement to your campaigns is what turns advertising from expensive into profitable — exactly as we set out in the [campaign budget guide](/en/blog/ppc-minimum-budget-israel). And the full commercial picture of what to do with the data is covered in the [measurement and analytics guide: what every shekel returns](/en/blog/marketing-analytics-roi).

## A common mistake: why installing and forgetting is not enough

Installation is only the start. If nobody looks at the data and no decisions come out of it, you measured for nothing. Set aside half an hour a week to check which channel the conversions came from, and let the data move budget towards what works. That, rather than the installation itself, is where the real return on investment sits.

At AITERRA we see it again and again: the difference between a business that wastes its advertising budget and one that profits from it is not the tool that was installed, but the habit of reading the numbers and acting on them. When measurement is wired up properly, every marketing decision stops being a gamble and becomes an answer backed by numbers.

---

**Want measurement that shows you exactly what brings customers?** Take a look at AITERRA's [paid campaigns and analytics service](/en/services/marketing), or [talk to us](/en/contact) about setting it up properly.

## Further reading

- [Measurement and analytics: what every shekel in marketing really returns](/en/blog/marketing-analytics-roi)
- [Paid campaigns: the minimum budget and how long leads take](/en/blog/ppc-minimum-budget-israel)
- [Google Ads campaign management: how profitable paid advertising works](/en/blog/google-ads-campaigns)`,
    faq: {
      title: 'Common questions about GA4, the Pixel and conversion tracking',
      items: [
        {
          q: 'What is the difference between GA4 and Google Tag Manager?',
          a: 'Google Analytics 4 analyses visitor behaviour on the site — where people arrived from and what they did. Google Tag Manager is a tag manager that lets you add and change all your tracking code, GA4 and the Pixel included, in one place without touching the site code. The recommended order is to install Google Tag Manager first and manage everything else through it.',
        },
        {
          q: 'What is the Meta Pixel and why do you need it?',
          a: 'The Meta Pixel is a tracking code that measures the actions taken by visitors who arrived from campaigns on Facebook and Instagram. It lets the system optimise the campaign towards people who tend to convert, and show ads again — retargeting — to an audience that already visited the site without completing an action.',
        },
        {
          q: 'What matters most to measure in a small business?',
          a: 'The actions that generate money: a form submission, a tap on a phone number or WhatsApp on mobile (critical in Israel and usually forgotten), a purchase or a started checkout in a store, and views of key pages such as pricing. You do not need to measure everything — only the conversions that genuinely matter to the business.',
        },
        {
          q: 'How long does it take to install everything?',
          a: 'A correct installation of Google Tag Manager, GA4 and the Pixel, along with basic conversion events, usually takes a few hours. The more important part is checking that everything is measured correctly before you start advertising, and then setting aside regular time to work with the data and make decisions from it.',
        },
        {
          q: 'Do you have to use Google Tag Manager, or can you install the code directly?',
          a: 'You can paste the GA4 code and the Pixel straight into the site, but Google Tag Manager removes the dependency on a developer: every new tracking event is defined from one interface without touching the code. For a business that intends to run campaigns and measure conversions over time, Google Tag Manager is the right choice.',
        },
      ],
    },
  },

  'geo-ai-search-optimization': {
    title: 'GEO and AI search: how to get cited by ChatGPT',
    excerpt:
      'Your customers now ask ChatGPT and Gemini, not just Google. What GEO is, how generative engines pick their sources, and what to do about it now.',
    tags: ['GEO', 'SEO', 'AI', 'Organic search'],
    content: `**In short (TL;DR):** GEO (Generative Engine Optimization) is the practice of getting ChatGPT, Gemini and Perplexity to cite and recommend your business inside the answer itself. Where SEO competes for a position on the results page, GEO competes for a place inside the answer — and it is won with structured content, Schema data and demonstrable authority.

The way your customers search has changed fundamentally. Instead of typing a phrase into Google and working through ten blue links, more and more people simply ask ChatGPT, Gemini or Perplexity — and get a single summarised, reasoned answer. Inside Google itself, the AI Overviews panel answers the question before the visitor ever reaches the organic results. For businesses the implication is simple and brutal: if you do not appear in the answer the AI gives, you do not exist for that customer. This is exactly where GEO (Generative Engine Optimization) comes in, the next stage of [organic search](/en/services/seo), and one of the areas we at Aiterra live and breathe.

![Searching for information through an AI chat assistant on a smartphone](/images/blog/geo-ai-search-optimization.webp)

## SEO, AEO and GEO: what is the difference?

| Parameter | SEO | AEO | GEO |
|---|---|---|---|
| What it is | Ranking in the search results | Optimising for direct answers | Visibility in generative engine answers |
| Where it appears | The Google results page | Featured snippets, voice search | ChatGPT, Gemini, Perplexity, AI Overviews |
| What you compete for | Position (ranking) | The answer box | A place inside the written answer |
| Winning content format | Keywords, links | FAQs, definitions, lists | Structured content, Schema and authority |
| How it is measured | Rankings and organic traffic | Appearances in answer boxes | Mentions and citations in AI answers |

## Why now? The numbers

- Google still holds roughly 90% of the global search market (according to [StatCounter](https://gs.statcounter.com/search-engine-market-share)) — which means classic SEO remains critical and is not something to abandon.
- But the research firm Gartner forecasts that search volume on traditional engines will fall by around 25% by 2026, as users move across to chatbots and AI assistants.
- The conclusion: whoever starts building a presence in the generative engines today buys an advantage before the field fills up.

And as a piece of self-evidence: if ChatGPT cites this answer about GEO when someone asks it about the subject, that is the method proving itself in public.

## What is GEO, and how does it differ from traditional SEO?

GEO — optimisation for generative search engines — is the process of getting AI models to cite, mention and recommend your business every time a user asks a question relevant to your field. Where SEO on Google competes for positions on the results page, optimisation for AI competes for a place inside the answer itself.

That changes the rules of the game. AI engines do not rank pages; they assemble an answer from sources they trust. To get into that answer, your content has to be clear, authoritative and structured so that a machine can pull precise facts out of it.

## How do AI engines decide who to recommend?

**Authority and trustworthiness (E-E-A-T):** the models prefer sources with demonstrated expertise — professional, in-depth content, real authors with a name and a role, and consistency over time.

**Structured data (Schema markup):** technical markup in the site code that tells a machine exactly who you are, what you offer, what it costs and what customers think of you. Without that data layer, the AI is simply guessing.

**Content that answers real questions:** pages written as direct answers to the questions customers actually ask — including FAQ blocks, clear headings and focused paragraphs — are pulled into answers dramatically more often.

**Mentions across the web:** the AI cross-references its sources. A business mentioned on professional content sites, in guides and in reviews reads as an authority that is safe to recommend.

## The plan of work: how to do GEO properly

At Aiterra a GEO programme starts with a diagnosis: we check what the AI engines answer today when they are asked about your field, and where you stand relative to competitors. From there we build the foundations — implementing structured data, improving speed and cleaning up the code — and in parallel produce authoritative content written for readers and models alike. Our advantage as an agency that came out of software development is that we handle both the deep technical layer and the content strategy.

## So is organic search dead? Far from it

The opposite is true. AI Overviews and generative engines lean on the same signals classic Google rewards: quality content, a fast site, authority and links. Sound organic search is the foundation, and GEO is the floor built on top of it. Businesses investing in both today are buying an advantage that will be close to impossible to catch up with in a year or two.

## Practical steps you can apply today

- **Build content in a question-and-answer structure:** add FAQ blocks to your main pages, with direct and focused answers — this is the format models pull from most easily.
- **Implement structured data:** Schema markup for the business, the services, the articles and the frequently asked questions. The official guidance is in [Google's developer documentation](https://developers.google.com/search/docs).
- **Sign your content:** real author pages with a name, a role and experience. Models learn to recognise sources with human accountability behind them.
- **Make sure the AI crawlers are not blocked:** check your robots.txt file — plenty of sites in Israel block GPTBot and ClaudeBot without realising it, and simply do not exist as far as those engines are concerned.
- **Accumulate mentions:** guest articles, interviews, reviews and business directories. The models cross-reference sources, and every quality mention raises the odds of a recommendation.

## How do you measure AI visibility?

This is a new measurement discipline, but there is already plenty to track: ask the main engines (ChatGPT, Gemini, Perplexity) a fixed set of questions about your field once a month and record whether and how you are mentioned; watch your analytics for referral traffic from domains such as chatgpt.com and perplexity.ai; and check which of your pages are being cited in answers. The numbers are still small next to Google — but they are growing fast, and whoever gets in early sets the reference point.

Want to know what ChatGPT says when it is asked about your field? Leave your details and we will come back with a full AI visibility check for your business and a structured plan of action.

---

**Want us to do it for you?** Take a look at AITERRA's [organic search service](/en/services/seo), or [leave your details](/en/contact) for a consultation at no cost.

## Further reading

- [How to choose an SEO agency: the guide that saves you a year of wasted budget](/en/blog/seo-services)
- [Keyword research: how to find out what your customers really search for](/en/blog/keyword-research-guide)`,
    faq: {
      title: 'Common questions about GEO',
      items: [
        {
          q: 'What is the difference between SEO, AEO and GEO?',
          a: 'SEO is classic optimisation for the search results, AEO is optimisation for direct answers such as answer boxes and voice search, and GEO is visibility inside the answers of generative engines such as ChatGPT and Gemini. In practice all three rest on the same foundation of quality content and clean code.',
        },
        {
          q: 'Is classic organic search still relevant in 2026?',
          a: 'Absolutely. Google still holds roughly 90% of the search market (StatCounter), and the AI engines themselves lean on sources that rank well on Google. GEO does not replace SEO — it amplifies it.',
        },
        {
          q: 'Should you block or allow AI crawlers such as GPTBot?',
          a: 'Allow them. For your business to appear in answers from ChatGPT, Claude and Perplexity, their crawlers (GPTBot, ClaudeBot, PerplexityBot) need access to the site, both in robots.txt and at the firewall or CDN level. Blocking them means being completely absent from those answers.',
        },
        {
          q: 'How long does GEO take to show results?',
          a: 'Much like organic search, it is a gradual process. Technical changes such as structured data are picked up within weeks, engines like Perplexity refresh relatively quickly, while building authority and mentions is a matter of months. That is why it pays to start as early as possible.',
        },
      ],
    },
  },

  'google-ads-campaigns': {
    title: 'Google Ads Management: How to Make It Profitable',
    excerpt:
      'How the Google ad auction really works, what sets your cost per click, what budget to start on — and why campaigns burn money on the landing page.',
    tags: ['Google Ads', 'Paid advertising', 'PPC', 'Quality Score', 'Lead generation'],
    content: `**In short (TL;DR):** Google Ads management is the business of buying targeted traffic through an ad auction, in which the winner is decided by a combination of the bid and the Quality Score. A campaign becomes profitable not thanks to the ad alone, but when the landing page converts and every lead is routed straight into the CRM. We at Aiterra measure return, ROAS, rather than clicks.

![Google Ads campaign management: how paid advertising works and what makes a campaign profitable](/images/blog/google-ads-campaigns.webp)

You are spending the money, but are you actually seeing results? As a technology-led advertising agency, our approach at Aiterra is simple: every shekel that goes out on advertising has to come back with a profit. Organic search builds authority for the long term, while a professional [paid advertising](/en/services/marketing) process on Google or on the social networks is built to bring leads in here and now. We build a digital marketing strategy that stops the budget bleeding, lifts the conversion rate, and turns your marketing spend into an engine for growth.

## Google Ads or social networks: where are your customers?

To run a profitable paid campaign you have to understand your customer journey. Google holds [around 90% of the global search market](https://gs.statcounter.com/search-engine-market-share) according to StatCounter, which makes it the arena for capturing demand that already exists — while the social networks create new demand. This is how we match the platform to the business goal:

| Parameter | Google Ads | Facebook / Instagram |
| --- | --- | --- |
| User intent | Active search, purchase intent | Passive browsing, demand creation |
| When to choose it | The customer is already searching for your service | Building awareness and new audiences |
| Targeting method | Keywords and intent | Age, interests and location |
| Time to result | Immediate, from the moment the campaign goes live | Fast, depending on the funnel stage |

**Google Ads campaign management:** the ideal place to catch users carrying purchase intent. When the customer is already actively searching for your service, we make sure your ad is the first result they see.

**Facebook and Instagram advertising:** when the aim is to create the demand, to raise a need and to reach new audiences, the social networks let us target users precisely by age, interests and location.

## Why is paid advertising at Aiterra wired into the technology?

Getting the visitor to the site is only half the work; getting them to leave their details is the real craft. Most agencies stop at the click, but as a digital advertising agency that came out of software development, we provide the full wrapper: when a visitor clicks your ad, they land on a very fast landing page built specifically for that ad, with sharp messaging and conversion-focused design. Alongside it we install advanced marketing automation, so that every enquiry is routed immediately into your CRM and to the phone of the salesperson. No lead falls between the cracks.

## How is the cost per click actually decided?

Google Ads works as an auction, but the winner is not whoever pays the most. The Quality Score — made up of ad relevance, landing page quality and expected click-through rate — carries at least as much weight as the money on the table. An advertiser with a high Quality Score pays less per click and appears above a competitor who bids more with a poor ad (see the [official Google Ads help](https://support.google.com/google-ads)). That is why campaign management cannot be separated from landing page quality: they are one mechanism.

## What budget makes sense to start on? The numbers

In competitive sectors in Israel a click can cost anywhere from a few shekels to tens of shekels. For the campaign to gather enough data to learn from and be optimised:

- **A sensible starting media budget:** around ₪3,000–6,000 a month in most sectors — below that there simply will not be enough conversions to tell what is working.
- **Cost per click range:** from a few shekels to tens of shekels, depending on how competitive the sector is.
- **Learning period:** roughly 2–4 weeks before drawing conclusions and optimising aggressively.

## Which metrics actually matter?

Clicks and impressions are vanity metrics — they do not pay salaries. The metrics a professional campaign manager tracks are these: cost per lead (CPL), the conversion rate of the landing page, the quality of the leads that actually reach a sales call, and return on ad spend (ROAS). If your monthly report does not include them, you do not know whether the campaign is profitable.

It is time to move to campaign management that is smart, transparent and built on data. Want to know what it will cost to bring in your next customer? Leave your details and our specialists will come back to you for a free consultation.

---

**Want campaigns that return the investment?** See the AITERRA [paid advertising](/en/services/marketing) service, or [leave your details](/en/contact) for a free consultation.

## Further reading

- [Landing pages that convert: why most visitors leave without leaving their details, and how to change that](/en/blog/landing-pages-that-convert)
- [Measurement and analytics: how to know what every shekel you put into marketing really returns](/en/blog/marketing-analytics-roi)`,
    faq: {
      title: 'Common questions before you start',
      items: [
        {
          q: 'How much does it cost to advertise on Google?',
          a: 'The budget has two components: payment to the platform, Google or Meta, for the media itself, and payment for managing the campaign. In most sectors in Israel a sensible starting media budget is around ₪3,000–6,000 a month, and the cost per click runs from a few shekels to tens of shekels. We match the budget to the size of the business to secure a positive return on investment (ROI).',
        },
        {
          q: 'Do I actually need a digital advertising agency to run a campaign?',
          a: 'You can run it yourself, but the advertising systems at Google and Meta are highly complex, and running them without experience usually means thousands of shekels wasted on irrelevant clicks. A professional manager improves the Quality Score, brings the cost per click down, and connects the campaign to a converting landing page and to a CRM — which is where the real profit is made.',
        },
        {
          q: 'How long does it take to see results from a paid campaign?',
          a: 'Unlike organic search (SEO), which takes months, paid advertising delivers immediate results: the moment the campaign goes live, leads start coming in. Even so, give the campaign a learning period of roughly 2 to 4 weeks in which the algorithm gathers data, before drawing conclusions and running full optimisation towards the best results.',
        },
        {
          q: 'What is a Quality Score and why does it matter?',
          a: 'The Quality Score is the rating Google gives your ad on the basis of three factors: ad relevance, landing page quality and expected click-through rate. A high score lets you pay less for every click and appear higher in the auction — even against a competitor offering more money. That is why landing page quality is an inseparable part of campaign management.',
        },
        {
          q: 'Which metrics show whether the campaign is profitable?',
          a: 'Clicks and impressions are vanity metrics that do not reflect profit. The ones that genuinely matter are cost per lead (CPL), the conversion rate of the landing page, the quality of the leads that actually reach a sales call, and return on ad spend (ROAS). If your monthly report does not include these, there is no way to know whether every shekel invested came back with a profit.',
        },
      ],
    },
  },

  'google-business-profile-guide': {
    title: 'Google Business Profile: Rank Higher on Maps',
    excerpt:
      'The best-value asset a local business owns is free. How to maximise your Google Business Profile — categories, photos and reviews.',
    tags: ['SEO', 'Organic search', 'Digital'],
    content: `**In short (TL;DR):** A Google Business Profile is the free listing that presents your business on Maps and in the side panel of Google — phone number, opening hours, photos and reviews. For a local business it is the best-value marketing asset there is: a complete, active profile full of positive reviews ranks higher on Maps and generates phone calls directly.

Before your next customer ever reaches your website, they see something else: your listing on Google. The panel with the phone number, the opening hours, the photos and the reviews — that is where local customers really decide. And here is the good news: it is the best-value marketing asset a local business has, because it is completely free, and most of your competitors maintain it badly.

![A customer searching for a local business on Google Maps on a smartphone](/images/blog/google-business-profile.webp)

## Why is the Google listing the best-value asset? The numbers

Local search is not a niche — it is the mainstream way customers find businesses near home. Here is the picture in numbers:

- **Around 90% of the search market** sits with Google ([according to StatCounter data](https://gs.statcounter.com/search-engine-market-share)) — so almost every potential customer starts the search there.
- **Cost to set up and run: ₪0.** The profile is completely free; the only investment is the time to maintain it properly.
- **Only three businesses** appear in the Local Pack at the top of the page — anyone outside it is close to invisible.
- **Most local searches** happen on a smartphone, and usually with immediate buying intent: near me, in my town.

## How do you get the profile to rank? The basics

Google ranks complete, active profiles higher. That means an accurate business name (no keyword stuffing — Google penalises it), the right primary category plus relevant secondary categories, up-to-date opening hours including holidays, a defined service area, and a link to your website. Every empty field is points you hand to a competitor. Keeping valid structured data on the site itself ([per the Google Search Central documentation](https://developers.google.com/search/docs)) helps Google understand the business and present it correctly in results.

## Why do reviews decide both ranking and customers?

The number of reviews, the average score and how recent they are form a central ranking factor on Maps — and they are also what settles it for a hesitant customer. Two simple habits change everything: ask every satisfied customer for a review (easiest with a direct link or a QR code), and reply to every review, negative ones included, politely and professionally. A calm reply to an angry review persuades the next reader more than ten perfect reviews do.

Worth knowing: Google forbids offering payment or a benefit in exchange for a review, and also the collection of many reviews at once — an unnatural stream can be blocked. The winning pace is slow and steady: a few reviews a week, from real customers, over a long period.

## Which signals does everyone neglect? Photos, posts and questions

A profile with real, current photos — of the premises, the team and the work — gets significantly more clicks than a profile with a single logo. Upload new photos every month, and keep quality and lighting high: this is the first visual proof a customer sees. Weekly posts about offers, updates and tips signal to Google that the business is alive and active. And in the questions and answers area you can, and should, publish the common questions yourself and answer them — before somebody else answers inaccurately in your place.

## What do you fix first? A priority table for the profile

Not every improvement is worth the same. The table below shows where to start, by impact on ranking and by maintenance effort:

| Profile element | Impact on ranking and customers | Maintenance effort |
| --- | --- | --- |
| Verification | Critical — without it there is no presence on Maps | One-off |
| Accurate primary category | Very high | One-off |
| Reviews (volume, score, recency) | Very high | Ongoing |
| Real, up-to-date photos | High (clicks and trust) | Monthly |
| NAP consistency with the website | High | One-off |
| Weekly posts and updates | Medium (an activity signal) | Weekly |
| Questions and answers | Medium | Monthly |

## Why is the listing alone not enough? The link to the website

The listing catches the customer; the website closes them. Google cross-references the profile against your site — consistency of name, address and phone number (NAP) strengthens both, and area-focused service pages on the site lift local ranking. That is exactly the package we at Aiterra build: a maximised listing, a fast website that supports it, and tracking that shows how many calls came from each source.

Want to own the local results? Leave your details and we will run a full diagnosis of your local presence — listing, Maps and website.

---

**Want us to do it for you?** See the AITERRA [organic SEO](/en/services/seo) service, or [leave your details](/en/contact) for a free consultation.

## Further reading

- [Own your city: the complete guide to promoting a small business and winning warm leads](/en/blog/local-seo-small-business)
- [How do you choose SEO services? The guide that will save you a year of wasted budget](/en/blog/seo-services)`,
    faq: {
      title: 'Common questions about the Google Business Profile',
      items: [
        {
          q: 'How much does a Google Business Profile cost?',
          a: 'The Google Business Profile is completely free — setting it up, managing it and appearing on Maps cost nothing at all. The only cost is the time to maintain it properly, meaning photos, posts and replies to reviews, or the fee of professionals who run it for you on an ongoing basis.',
        },
        {
          q: 'Why does my business not appear on Maps even though I have a listing?',
          a: 'The common reasons: an unverified profile, an inaccurate primary category, few reviews compared with competitors, or inconsistency between the details on the listing (NAP) and the details shown on the website. A short diagnosis usually reveals exactly which blocker is keeping you out of the Local Pack.',
        },
        {
          q: 'How do you get more Google reviews?',
          a: 'You simply ask — at the end of every successful transaction, with a direct link to the review form or a QR code on the premises. Google policy forbids offering payment or a benefit in exchange for a review, and it is unnecessary anyway: satisfied customers asked at the right moment do write.',
        },
        {
          q: 'Do you have to reply to negative reviews?',
          a: 'Yes, and it is strongly recommended. A calm, professional reply to a negative review persuades the next reader more than ten perfect reviews do, and it signals to Google that the profile is managed and active. Ignoring reviews, by contrast, damages both trust and ranking. A polite reply with no argument is always the right choice.',
        },
        {
          q: 'How long before the listing starts producing calls?',
          a: 'A verified, properly completed listing can start appearing on Maps within days to weeks, and bring in first calls quickly. A significant improvement in ranking and enquiry volume usually arrives within a few months, and depends on the level of competition in your town, the pace at which reviews accumulate, and the link to a fast, sound website.',
        },
      ],
    },
  },

  'how-to-choose-digital-agency': {
    title: 'How to Choose a Digital Agency: 9 Red Flags',
    excerpt:
      'Before you sign with a web or SEO company, learn the nine red flags that expose an unreliable supplier — from guaranteed rankings to code ownership.',
    tags: ['Digital agency', 'Web development', 'Red flags', 'Choosing a supplier', 'Small business'],
    content: `**In short (TL;DR):** A reliable digital agency is chosen on process, not on promises. A good supplier shows a live portfolio, starts with a scoping stage before naming a price, hands you full ownership of the domain, the hosting and the code, and is transparent about exactly what is included. Avoid the nine red flags gathered in this article.

You choose a digital agency on process, not on promises. A reliable supplier will show you real work, explain in writing what is included, give you full ownership of the domain, the hosting and the code, and begin with a scoping stage rather than a number thrown out over the phone. In this article we have gathered nine red flags that come up again and again with clients who have been burned, so that you can spot them in advance.

![A team meeting to choose a digital agency — how to spot a reliable supplier and avoid the red flags](/images/blog/how-to-choose-digital-agency.webp)

A reliable digital agency is a supplier that is transparent about what it does, what it costs and what you get — and one that measures its own success by your business result rather than by the size of the invoice. Most of the bad stories in this field do not come from fraud but from unclear expectations that one right question at the start could have prevented.

## What are the nine red flags? A quick checklist

| # | Red flag | What to check instead |
| --- | --- | --- |
| 1 | A guaranteed first place on Google | Ask about the process, not about a ranking promise |
| 2 | The code, the domain or the hosting stays with them | Demand full ownership in writing |
| 3 | No scoping stage — straight to a price | Proper scoping before any proposal |
| 4 | A suspiciously low price | Work out what is not included (see the note below) |
| 5 | No real portfolio to inspect | Ask for live sites and client references |
| 6 | A vague contract with no detail of what is included | Every clause in writing: pages, warranty, changes |
| 7 | They do not show the site on mobile | Ask to see the work on a phone |
| 8 | Slow communication before you have even signed | Response times only get worse after payment |
| 9 | Everything included, without a single question about your business | A good supplier asks before it promises |

## Why is a guaranteed number one the most dangerous flag?

Because it is impossible. Google holds [roughly 90% of the global search market](https://gs.statcounter.com/search-engine-market-share), which makes a high organic ranking a valuable asset — and that is exactly why nobody controls it. Google sets rankings on hundreds of factors, and [in its official documentation](https://developers.google.com/search/docs) it makes clear that nobody can guarantee first place. A supplier promising a guaranteed ranking, or results within a week, is selling an illusion — or intends to rank worthless keywords nobody searches for, purely so it can show you a number one. Real search work takes months, as we explained in the [guide to monthly SEO costs](/en/blog/seo-cost-monthly-israel).

## Who owns the domain, the hosting and the code?

This is perhaps the most important clause, and also the most neglected. Ask explicitly: **who will own the domain, the hosting and the code?** The only correct answer is that you will. Plenty of businesses discover only on the day they want to change supplier that their site is effectively rented: they have no access, they do not hold the code, and the site cannot be moved. That ties you to one supplier indefinitely. Get the details in writing before the first payment.

## When is a low price a trap?

A suspiciously cheap price almost always means something is not included: no search work, no content, no mobile compatibility, or hidden costs that surface later. This does not mean expensive equals good — it means that too cheap is a signal to ask **what exactly am I getting**. We broke down all the hidden costs of a cheap website in a [separate guide on cheap sites](/en/blog/cheap-website-hidden-costs).

## What does a proper selection process look like?

- **Ask for a live portfolio.** Not screenshots — links to real sites that work, ideally in your own field.
- **Speak to an existing client.** A good supplier will be happy to put you in touch for a reference.
- **Insist on scoping before a quote.** A supplier that does not understand your business cannot price it correctly.
- **Read the small print.** What is included, what is not, what a change costs, and what happens if you part ways.
- **Test the communication.** If it takes them three days to reply before you have signed, it will only get worse afterwards.

If you are still weighing up a freelancer against a company, we have [an honest comparison of the two](/en/blog/freelancer-vs-web-agency) to help you decide even before you start looking for a supplier.

---

**Want a supplier that starts from understanding the business rather than from a number?** At AITERRA every project begins with a free scoping call. [Talk to us](/en/contact) and judge for yourself.

## Further reading

- [A business website: how to choose a company, what the process is and what it costs](/en/blog/website-building-services)
- [Freelancer or web agency — which is better for your business?](/en/blog/freelancer-vs-web-agency)
- [A website from ₪1,500? The hidden costs nobody mentions](/en/blog/cheap-website-hidden-costs)`,
    faq: {
      title: 'Frequently asked questions about choosing a digital agency',
      items: [
        {
          q: 'How do you know whether a digital agency is reliable?',
          a: 'A reliable supplier shows a live portfolio, meaning links to real working sites, explains in writing what is included and what is not, hands over full ownership of the domain, the hosting and the code, and starts with a scoping stage before naming a price. Fast, transparent communication before you have signed anything is another good sign of reliability.',
        },
        {
          q: 'Can first place on Google be guaranteed?',
          a: 'No. Google sets rankings on hundreds of shifting factors and states in its own documentation that no ranking can be guaranteed. A supplier promising a guaranteed first place, or results within a week, is selling an illusion — or is ranking worthless keywords nobody searches for, purely to show you a meaningless number one.',
        },
        {
          q: 'Who should own the domain, the hosting and the code?',
          a: 'You should, always. Many businesses find out too late that their site is rented from the supplier: no access to the code, no control over the domain and no way to move the site elsewhere. Demand full, itemised ownership in writing before the first payment; that is what stops you being tied to a single supplier indefinitely.',
        },
        {
          q: 'Does a cheap price always mean something is wrong?',
          a: 'Not necessarily, but a suspiciously low price is a signal to stop and ask what exactly is included. Usually something substantial is missing: search optimisation, content, mobile compatibility, or hidden costs that appear later on. Compare proposals by what each one actually includes, not by the number at the bottom of the page.',
        },
        {
          q: 'What is the first thing to ask a supplier before signing?',
          a: 'A live portfolio and a client you can speak to for a reference, a written breakdown of what the proposal includes, and confirmation that the domain, the hosting and the code will be yours. Above all, insist on a scoping stage before the quote; a supplier that will not take the time to understand your business before pricing it cannot price it properly.',
        },
      ],
    },
  },

  'keyword-research-guide': {
    title: 'Keyword research: what customers really search',
    excerpt:
      'SEO that starts with a guess ends in disappointment. How keyword research reveals what people type, the intent behind it, and where the gaps are.',
    tags: ['SEO', 'Organic search', 'Content'],
    content: `**In short (TL;DR):** Keyword research is the process that reveals which terms your customers actually type into Google, what intent sits behind them and how much competition there is for each one. It turns organic search from guesswork into a plan built on data, and points your content at the terms that bring paying customers rather than traffic for its own sake.

Want to know the biggest open secret in [search engine optimisation](/en/services/seo)? Most businesses optimise for terms nobody searches for — or for terms everybody searches for and nobody in their position could realistically rank on. Professional keyword research is the difference between firing in the dark and building a search plan grounded in real data: what people type, how many of them there are, and what they actually want to find.

![Keyword research in Google on a laptop screen](/images/blog/keyword-research.webp)

## Why keyword research matters right now: the numbers

- Google accounts for [roughly 90% of the global search market](https://gs.statcounter.com/search-engine-market-share) — meaning the overwhelming majority of your potential customers begin their journey on a single engine, and that is where it is decided who is found and who is not.
- Gartner forecasts that traditional search volume on engines will fall by around 25% over the coming years in favour of AI assistants — which makes precision in choosing your terms more critical than ever.
- Most searches are made through long, specific phrases, and it is precisely those that carry the highest purchase intent.

## What is search intent, and why does it decide what content to build?

Two people type similar phrases and want completely different things. Someone searching for "what is SEO" wants to learn; someone searching for "SEO agency pricing" wants to buy. That is search intent, and it determines what you need to build for each term: an in-depth article, a focused service page or a comparison page. Match the content to the intent and Google rewards it — and the conversions follow.

## Why do long-tail terms bring in more customers?

The short, competitive terms get all the attention, but the money is made on long-tail phrases: more specific searches, with less competition and far more purchase intent. "Divorce lawyer" is an expensive, crowded term; "divorce lawyer prenuptial agreement cost" is a customer who already knows what they need. A smart strategy builds a pyramid: strong service pages for the core terms, with supporting content that captures dozens of long-tail phrases around them.

![Analysing search results and Google suggestions for keyword research](/images/blog/keyword-research-2.webp)

## What types of terms are there, and what page do you build for each?

Not every term is born equal. The table below maps the four main types of term — and the page that makes the most sense for each:

| Type of term | Example | User intent | Competition and volume | The page you build |
|---|---|---|---|---|
| Head term | "SEO" | Broad and unclear | High competition, high volume | Pillar / category page |
| Long-tail | "SEO agency for a small business pricing" | Clear purchase intent | Low competition, low volume | Service / landing page |
| Informational | "what is SEO" | Learning and understanding | Medium competition | Article / in-depth guide |
| Commercial | "Ahrefs vs Semrush" | Checking before buying | Medium competition | Comparison page |

## How is keyword research actually done?

We combine several sources: professional research tools, Google autocomplete, the questions real customers ask in the field, and an analysis of the terms your competitors rank for and you do not. Out of all of that we build a keyword map with search volume, competition level and business potential — and from the map, an orderly content plan for the year ahead. No guesswork, and no months wasted on empty terms.

## Which tools work, and how many of them are free?

You do not need an expensive arsenal of tools to start: Google Keyword Planner gives you search volumes and click costs; [Google Trends](https://trends.google.com/trends/) shows trends and seasonality in the Israeli market; Google autocomplete and the "People also ask" box reveal the exact wording real users choose; and professional tools such as Ahrefs or Semrush add the competitive intelligence layer — which terms are bringing traffic to your competitors while you are nowhere to be seen on them.

## How do you turn a keyword map into a content plan?

Good research does not end with a list of terms; it ends with decisions. Every term gets an assignment: terms with purchase intent ("price", "company", "services") get a focused service page; informational questions ("what is", "how to", "how much does it cost") get an in-depth article; and comparison terms get an honest comparison page. The structure is built as a pyramid: a strong pillar page for the core term, supporting articles around it for the long-tail phrases, and internal links that connect the whole thing and channel authority back to the pillar page.

Want to know which terms your business should be fighting for? Leave your details and we will come back with an initial map of opportunities from our own research.

---

**Want us to do it for you?** Take a look at AITERRA's [organic search service](/en/services/seo), or [leave your details](/en/contact) for a consultation at no cost.

## Further reading

- [How to choose an SEO agency: the guide that saves you a year of wasted budget](/en/blog/seo-services)
- [Content marketing: why a business blog is an asset that generates leads for years](/en/blog/content-marketing-blog)`,
    faq: {
      title: 'Common questions about keyword research',
      items: [
        {
          q: 'How many keywords should you optimise for?',
          a: 'There is no magic number. A focused service page targets one core term with a few close variations, and around it you build supporting content that captures dozens of long-tail phrases. The final scope follows from the competition in your sector, the size of the site and the business goals — a large store will target hundreds of terms, while a local business focuses on a few dozen good ones.',
        },
        {
          q: 'Which is better, a high-volume term or a focused one?',
          a: 'In most cases a focused term with purchase intent beats a general term with big volume. A hundred visitors searching for exactly the service you sell are worth more than a thousand who are only gathering general information. Focused terms are also less competitive, so you reach them faster and at lower cost.',
        },
        {
          q: 'How often should keyword research be refreshed?',
          a: 'It is worth refreshing the keyword map once every six to twelve months. Search habits shift, new competitors arrive, and AI assistants are changing the way people phrase their questions. A periodic refresh surfaces emerging terms and new opportunities before competitors take them, and keeps your content plan relevant over time.',
        },
        {
          q: 'How long does it take to see results from keyword research?',
          a: 'The research itself usually takes anywhere from a few days to a fortnight, depending on the size of the site and the level of competition. Results on the ground — a rise in rankings and traffic — generally appear within three to six months of starting to implement the content plan, because organic search is a cumulative process.',
        },
        {
          q: 'Can you do keyword research yourself?',
          a: 'You can certainly make a start on your own with free tools such as Google Keyword Planner and autocomplete. The real challenge is not collecting the terms but interpreting them: knowing which terms are worth investing in, what intent sits behind them and how to turn them into a plan of work. That is where professional experience makes the difference.',
        },
      ],
    },
  },

  'local-seo-small-business': {
    title: 'Local SEO for Small Business: Own Your City',
    excerpt:
      'An estate agent in Holon or a dentist in the Krayot needs local customers. How local SEO and a strong Google listing produce hot leads daily.',
    tags: ['SEO', 'Organic SEO', 'Digital'],
    content: `**In short (TL;DR):** Local SEO is the work of placing a business at the top of Google's search results and maps for people in its own geographic area. For local service providers — an estate agent, a doctor or a lawyer — it is the warmest lead channel there is, because it catches customers searching for your service at the moment of need, close to home.

![Local SEO for a small business — dominating the search results in your own city](/images/blog/local-seo-small-business.webp)

As a service provider or clinic owner, you do not necessarily need traffic from across the country. An estate agent in Holon or a dentist in the Krayot wants one thing: customers in their own area who need the service now. The answer lies in combining a technically strong website build with a focused, area-based [organic SEO](/en/services/seo) process and properly built digital authority.

## Why now? The numbers

Local search is not a small niche — it is the mainstream way customers find businesses near home. Here is the picture in numbers:

- **Around 90% of the search market** sits with Google ([according to StatCounter data](https://gs.statcounter.com/search-engine-market-share)) — so almost every potential customer starts the search there.
- **The bulk of local searches** happen on a smartphone, and usually with immediate buying intent ("near me", "in my city").
- **Only three results** appear in the map pack (Local Pack) at the top of the page — anyone who is not there is close to invisible.
- **Local search means high intent.** Someone searching for "plumber in Haifa" wants to hire now, not to compare articles.

## How do you win local search exactly where it counts?

When a customer is looking for an emergency service or a professional consultation, they will almost always add their city name to the search. So any local SEO strategy has to include optimisation for location.

For example, if you have an office in the north, we at Aiterra will not focus only on generic phrases — we will produce focused landing pages for SEO in Haifa or SEO in northern Israel. When the site is built correctly on the technical side, the search engine recognises your location and pushes you to the top of the results every time someone nearby searches for your service.

## What is a Google Business Profile, and why is it your most important asset?

If there is one tool that is compulsory for every service provider, it is the Google Business Profile. Registering the business with Google properly is what lets you appear on Google Maps and in the side panel of the search results.

Managing that listing through Google Business Profile on an ongoing basis is critical. This is where customers see opening hours, photos of the business and, above all, reviews. Collecting positive reviews from past customers builds the first layer of trust and significantly raises the chance that a searcher calls you rather than a competitor. Keeping structured data correct ([according to the Google Search Central documentation](https://developers.google.com/search/docs)) helps Google understand the business and present it properly in the results.

## What is the difference between ordinary organic SEO and local SEO?

The two processes complement each other, but they answer different search queries. The table below shows when each one works for you:

| Parameter | Ordinary organic SEO | Local SEO |
| --- | --- | --- |
| Search intent | Information, comparison, research | Immediate purchase, "near me" |
| Where you appear | Standard organic results | Map pack (Local Pack) and Google Maps |
| Core asset | Content and links to the domain | The Google Business Profile and reviews |
| Best suited to | Content sites, brands, national sales | Local service providers, clinics, physical shops |
| Main ranking signal | Authority and links | Proximity, relevance and local prominence |

For most local service providers it makes sense to start with local SEO — it produces leads faster — and to build the broader organic foundation in parallel.

## How do you adapt SEO to demanding niches?

Digital services are not one size fits all. In some sectors the competition is fierce and the customer examines you under a magnifying glass:

**Law:** an extremely competitive field that demands the highest professional standard. SEO for lawyers rests on authoritative content and demonstrated legal results. The right site architecture, starting with an impressive brochure site build that signals authority and standing, is the key to a flow of high-quality legal leads.

**Medicine and clinics:** where SEO for doctors is concerned, Google demands compliance with strict standards (YMYL). A properly built organic SEO strategy for medical sites makes sure the site conveys credibility, presents credentials, and is exceptionally fast and secure.

## Why work with us?

At the end of the day you are looking for an SEO agency that talks in terms of the bottom line, not just rankings. At Aiterra we do not settle for getting you onto the first page. Through winning user experience design (UX) and a connection to automations, we make sure every visitor who lands on the site leaves their details, calls you, and turns from a lead into a paying customer.

Want to dominate the search results in your own area? Leave us your details now and our team will build you a work plan that brings in new business every month.

---

**Want us to handle it for you?** Discover AITERRA's [organic SEO service](/en/services/seo), or [leave your details](/en/contact) for a consultation at no cost.

## Further reading

- [Google Business Profile: the practical guide to a listing that generates phone calls](/en/blog/google-business-profile-guide)
- [How do you choose an SEO agency? The guide that saves you a year of wasted budget](/en/blog/seo-services)`,
    faq: {
      title: 'Common questions about local SEO',
      items: [
        {
          q: 'What is local SEO, and how does it differ from ordinary organic SEO?',
          a: 'Local SEO is optimisation aimed at placing the business at the top of Google search results and maps for people in a particular geographic area. Unlike ordinary organic SEO, which competes nationally and mostly serves research intent, local SEO catches customers with immediate buying intent — the ones searching "near me" or "in my city" who want to hire a service now.',
        },
        {
          q: 'How long does it take to see results from local SEO?',
          a: 'Local SEO usually produces leads faster than national organic SEO, because the geographic competition is narrower. A properly managed business listing can start appearing on the maps within weeks, and meaningful movement in the results generally arrives within three to six months. The pace depends on how competitive your city is, on the quality of the site, and on how quickly reviews accumulate.',
        },
        {
          q: 'Do I need a Google Business Profile to appear on the maps?',
          a: 'Yes. The Google Business Profile is a precondition for appearing in the map pack and in the side panel of the search results. Without it the business simply does not exist for people searching for a local service. A full, accurate listing — address, hours, photos and reviews — is the first and most important step in any local SEO strategy.',
        },
        {
          q: 'How important are Google reviews to ranking a business?',
          a: 'Reviews are one of the central ranking signals in local SEO, and also the single biggest influence on a searcher\'s trust. A steady flow of positive, recent reviews significantly raises the chance that a customer chooses you over a competitor, and improves your prominence in the map pack. Asking every satisfied customer for a review is worth building into the service as a routine.',
        },
        {
          q: 'Does local SEO work for competitive fields such as law and medicine?',
          a: 'It does, but they need particular care. Medical and legal subjects fall into the YMYL category, where Google demands stricter authority, credibility and technical soundness. Local SEO in those fields rests on professional content, displayed credentials and proven results, a fast and secure site, and a business listing rich in reviews — enough to establish the trust these audiences expect.',
        },
      ],
    },
  },

  'marketing-analytics-roi': {
    title: 'Marketing ROI: Which Channels Actually Pay Off',
    excerpt:
      'Half your marketing budget is wasted — the question is which half. Conversion tracking, CRM data and four metrics reveal which channels earn.',
    tags: ['Digital', 'Conversions', 'Analytics'],
    content: `**In short (TL;DR):** Measuring marketing ROI means tracking precisely how much revenue every shekel returns in each channel. Connecting conversion tracking, the advertising platforms and the CRM reveals which channels produce profitable customers and which only burn budget — and turns every marketing decision from a gamble into simple arithmetic.

There is a famous line in advertising: half my marketing budget is wasted, I just do not know which half. In 2026 there is no reason to work that way. With proper measurement you can know exactly what a lead costs in each channel, how many of those leads become customers, and what every shekel spent on Google, on Meta or on organic search is actually worth. Without those numbers, every marketing decision is a gamble.

![An analytics report with charts and marketing data on a computer screen](/images/blog/marketing-analytics-roi.webp)

## What must you measure? The four numbers that tell the whole story

Do not drown in dashboards carrying a hundred charts. Four metrics tell the whole story, and these are their definitions:

| Metric | What it measures | Why it matters |
| --- | --- | --- |
| Enquiries by channel | How many leads came in from each source | Shows where the demand really comes from |
| CPL, cost per lead | What each lead cost | Exposes channels that are too expensive |
| Lead-to-deal rate | How many enquiries became paying customers | Separates a cheap lead from a good one |
| CLV, customer lifetime value | What an average customer is worth over time | Sets how much a lead is worth paying for |

Once you have those four numbers, deciding where to raise budget and where to cut turns from an argument in a meeting into simple arithmetic. Note that the first two metrics describe volume and cheapness, and the last two describe quality and profitability — only the combination of all four prevents bad decisions.

## Why is measuring search so critical? The numbers

For a sense of scale: according to [StatCounter](https://gs.statcounter.com/search-engine-market-share), Google holds around 90% of the global search market. The practical meaning is direct:

- A large share of the marketing budget passes through search — paid and organic alike.
- Every shekel put into that giant channel needs close measurement, or you are gambling on your largest source of demand without knowing whether it pays for itself.
- Without orderly conversion tracking, there is no way to tell a click that cost money from a click that became a customer.

## Why is conversion tracking broken for almost everyone?

Most businesses that come to us are surprised to find that their conversion tracking does not work: forms that are never counted, phone calls that go unrecorded, and campaigns credited with leads that actually arrived from organic search. We at Aiterra put the foundations right — defining correct conversion events in [GA4](https://support.google.com/analytics), call tracking, and parameters that identify the source of every enquiry — so that each lead is attributed to the channel that truly brought it. Once the foundation is sound, the data stops lying and decisions rest on reality rather than on instinct.

## How does the CRM connection close the loop to the profit line?

This is where the real advantage sits: when every enquiry enters the CRM automatically, tagged with its source, you can see not only how many leads each channel brought, but how many of them became deals and at what value. Suddenly you find that the channel producing the most leads brings the smallest customers, and that the modest [campaign](/en/services/marketing) is generating the large deals. That level of clarity changes the whole budget split — and moves the discussion from how many leads we received to how much money we made from each channel.

## Where do you start? Four steps to a measurement setup you can trust

1. **Define conversion events** — mark every important action precisely: a form submission, a phone call, a WhatsApp message or a purchase.
2. **Tag traffic sources** — consistent parameters across every campaign, so that each enquiry knows which channel and which ad it came from.
3. **Connect the CRM** — feed leads in automatically with their source attached, and track what happened to them through to the closed deal.
4. **One simple report** — a dashboard holding the four metrics by channel, so you can decide in a second where to scale and where to stop.

Want to know which half of your budget is working? Leave your details and we will build you a full measurement setup, from the first click to the invoice.

---

**Want campaigns that return the investment?** See the AITERRA [paid advertising](/en/services/marketing) service, or [leave your details](/en/contact) for a free consultation.

## Further reading

- [Google Ads campaign management: how paid advertising works and what makes a campaign profitable](/en/blog/google-ads-campaigns)
- [Email marketing in 2026: the old channel that still beats everything on return](/en/blog/email-marketing-guide)`,
    faq: {
      title: 'Common questions about marketing measurement and ROI',
      items: [
        {
          q: 'What is marketing ROI and how is it calculated?',
          a: 'ROI is the metric showing how much revenue every shekel invested returned. The basic formula: the profit from the channel minus its cost, divided by the cost, times 100. Calculating it properly requires working conversion tracking and a link between enquiries and the deals that actually closed — otherwise you are measuring leads instead of real money.',
        },
        {
          q: 'Which tools are needed to measure marketing properly?',
          a: 'The basis has three parts: Google Analytics 4 for traffic and on-site conversions, conversion tracking inside the advertising platforms themselves (Google and Meta), and a CRM that records every enquiry with its source. The magic is not in any single tool but in connecting all three — that is what turns raw data into insight about the real profitability of each channel.',
        },
        {
          q: 'How long before the picture becomes reliable?',
          a: 'Once a sound measurement setup is in place, one to two months of data is usually enough to identify which channels are profitable and which only burn budget. The longer the sales cycle — large B2B deals, for example — the longer the measurement window needed to see the full picture through to the profit line.',
        },
        {
          q: 'Why is my conversion tracking probably inaccurate?',
          a: 'The usual reasons: forms that are never counted, phone calls that go unrecorded, and campaigns credited with leads that actually arrived from organic search. Without correctly defined conversion events and parameters that identify the source of every enquiry, the data misleads — and you may end up cutting your most profitable channel. Fixing the foundation is the first step to any measurement you can trust.',
        },
        {
          q: 'What is the difference between a cheap lead and a profitable one?',
          a: 'A cheap lead is one that cost little, meaning a low CPL, but it does not necessarily become a paying customer or a large deal. A profitable lead is measured at the end of the funnel: how much of it closed, and at what value. Often the channel with the most expensive leads produces the largest and most profitable deals — which is why you have to measure through to the profit line, not only the cost per enquiry.',
        },
      ],
    },
  },

  'ppc-minimum-budget-israel': {
    title: 'Minimum PPC budget in Israel: Google and Meta',
    excerpt:
      'How much do you need to start a paid campaign? The realistic minimum budget for a small business in 2026, what it is made of, and when leads appear.',
    tags: ['Paid advertising', 'Google Ads', 'Facebook', 'PPC', 'Advertising budget'],
    content: `**In short (TL;DR):** PPC is a model in which you pay Google or Meta to show ads to a targeted audience, mainly per click. For a small business in Israel in 2026 the realistic minimum is around ₪2,000–3,000 a month in media on top of management fees, and first leads can arrive within days.

For a paid campaign to produce real results, the realistic minimum budget for a small business in Israel in 2026 is usually around ₪2,000–3,000 a month in media, meaning the money paid to Google or Meta, on top of the cost of management. A budget that is too small does not give the platform enough data to learn the audience, and the money is wasted. The great advantage of paid advertising is immediacy: unlike organic search, leads can arrive in the first few days.

![A team reviewing paid campaign data on screen — Google and Meta advertising budgets](/images/blog/ppc-minimum-budget-israel.webp)

PPC, pay per click, is a model in which you pay Google or Meta to show ads to a targeted audience, and you mostly pay when somebody clicks. It is the fastest tool available for generating traffic and leads — but only if the budget, the audience and the ad are aimed correctly.

## What is the budget actually made of?

A common mistake is to assume the budget is only the money paid to the platform. In practice there are two components:

- **Media budget** — the money that goes directly to Google or Meta for impressions and clicks.
- **Management fees** — the cost of building the campaign, writing the ads, optimisation and ongoing reporting.

A business that puts everything into media and manages the account itself usually burns the budget; a business that pays for management without enough media never lets the campaign get off the ground. The simple rule: start with a media budget large enough for the platform to collect the conversion data it needs to leave the learning phase.

## What is the minimum budget by platform in 2026?

| Platform | Minimum monthly media budget | When to choose it |
| --- | --- | --- |
| Google Ads (search) | ₪2,500–4,000 | When demand already exists and people are searching for the service |
| Facebook / Instagram | ₪2,000–3,500 | To create demand and reach an audience that is not searching yet |

The substantive difference: on Google you capture people who are already looking for a solution, so intent is high, while on Meta you create interest among people selected by interests and demographics. Since Google holds around 90% of the global search market ([according to StatCounter](https://gs.statcounter.com/search-engine-market-share)), a Google search campaign is usually the most direct way to capture existing demand. We covered this in depth in the [Google campaigns guide](/en/blog/google-ads-campaigns) and the [Facebook and Instagram advertising guide](/en/blog/facebook-instagram-ads).

## What does it cost in practice? The numbers

To plan a realistic budget for a small business in Israel in 2026, add up all the components:

- **Media budget:** around ₪2,000–4,000 a month, depending on the platform and the level of competition in the sector.
- **Management fees:** usually around 15%–25% of the media budget, or a fixed monthly sum according to the scope of work.
- **Realistic total starting budget:** around ₪3,000–5,000 a month for a business that wants measurable results rather than a test.
- **Time to an informed decision:** about a month — a learning period plus a few more days for cost per lead to settle.

## How long before you see leads?

This is the great advantage: first leads can arrive within days. But there is a learning period of two weeks to a month in which the platform works out which audience converts, and during that time results are still unstable. The learning period is a built-in part of the advertising systems ([Google Ads documentation](https://support.google.com/google-ads)), so do not switch a campaign off after a week because it did not work; give it the learning period. After about a month you can see a real cost per lead and decide how to proceed.

## How do you avoid throwing the money away?

- **Measure conversions, not clicks.** A cheap click that does not become a lead is waste. Without proper measurement you are blind — see [the guide to installing GA4 and the pixel](/en/blog/ga4-pixel-conversion-tracking-guide).
- **Send traffic to a focused landing page**, not to the home page. We explained why in the [guide to landing pages that convert](/en/blog/landing-pages-that-convert).
- **Start focused.** One well-targeted campaign beats five scattered campaigns running on a small budget.
- **Connect it to the whole picture.** Paid advertising works best alongside proper measurement — see [measurement and analytics: what every shekel returns](/en/blog/marketing-analytics-roi).

---

**Want a campaign that brings leads instead of burning budget?** Take a look at AITERRA's [paid advertising service](/en/services/marketing), or [leave your details](/en/contact) for a tailored budget plan.

## Further reading

- [Managing Google campaigns: how profitable paid advertising works](/en/blog/google-ads-campaigns)
- [Facebook and Instagram advertising: from a scroll to paying customers](/en/blog/facebook-instagram-ads)
- [Measurement and analytics: what every shekel really returns](/en/blog/marketing-analytics-roi)`,
    faq: {
      title: 'Frequently asked questions about paid campaign budgets',
      items: [
        {
          q: 'What is the minimum budget for a paid campaign in Israel in 2026?',
          a: 'For a small business the realistic minimum is usually around ₪2,000–3,000 a month in media, meaning the money that goes to Google or Meta, on top of management fees. A budget that is too small does not give the platform enough conversion data to learn the audience, so the money is spent without producing stable results.',
        },
        {
          q: 'How quickly do leads appear from a paid campaign?',
          a: 'First leads can arrive within days, and that is the big advantage over organic search. But there is a learning period of two weeks to a month in which results are still unstable. Only after about a month can you see a real cost per lead and decide with confidence whether to continue, scale up or change direction.',
        },
        {
          q: 'Which is better for a small business — Google or Facebook?',
          a: 'It depends on the goal. On Google you capture people who are already searching for the service, so purchase intent is high, which makes it excellent where demand already exists. On Facebook and Instagram you create demand and reach an audience by interest. For many businesses a combination of the two is the most effective option.',
        },
        {
          q: 'Why should you not switch a paid campaign off after a week?',
          a: 'Because the platform is still in its learning period and has not yet worked out which audience converts. Switching off early resets that learning and wastes the initial investment. Give the campaign at least two to three weeks, and measure cost per lead rather than clicks, before drawing conclusions about whether it works.',
        },
        {
          q: 'What is the difference between media budget and management fees?',
          a: 'The media budget is the money paid directly to Google or Meta for impressions and clicks. Management fees cover building the campaign, writing the ads, optimisation and reporting. Both are necessary: media without management burns through, and management without enough media never lets the campaign get off the ground.',
        },
      ],
    },
  },

  'seo-cost-monthly-israel': {
    title: 'SEO Cost per Month in Israel: 2026 Prices',
    excerpt:
      'What SEO really costs per month in Israel in 2026: real price ranges by business type, what each tier includes, and how long results take.',
    tags: ['SEO', 'Search marketing', 'Pricing', 'Small business', 'Digital marketing'],
    content: `**In short (TL;DR):** Organic search marketing (SEO) for a small business in Israel typically costs between ₪1,500 and ₪8,000 a month in 2026 — depending on how competitive the field is and how much work is involved. It is an ongoing monthly investment rather than a one-off payment, and meaningful results usually arrive after three to six months.

SEO for a small business in Israel typically costs between ₪1,500 and ₪8,000 a month in 2026, depending on the level of competition in the field and the scope of the work. A local business in an uncompetitive niche is usually well served by a plan of ₪1,500–3,500 a month; a competitive field, or nationwide coverage, calls for ₪3,500–8,000 and up. SEO is an ongoing investment, not a one-off payment — and results generally arrive after three to six months.

![An organic traffic growth chart — how much monthly SEO costs for a small business in Israel](/images/blog/seo-cost-monthly-israel.webp)

SEO, or search engine optimisation, is the continuous work of improving a site and its authority so that it appears high in Google's natural results — the ones you do not pay for per click. And because [Google holds roughly 90% of the search market](https://gs.statcounter.com/search-engine-market-share), ranking well in its organic results is a primary lead channel for businesses in Israel. Unlike paid advertising, which stops the moment you stop paying, an organic asset built properly keeps producing traffic and enquiries for months and years afterwards.

## What determines the price of SEO?

There is no flat rate, and that is not a caprice — the work genuinely differs from business to business. These are the main factors:

- **How competitive the keywords are.** Ranking a plumber in a small town is not the same world as ranking a divorce lawyer in Tel Aviv. The more businesses fighting over the same term, the more work is required.
- **The current state of the site.** A site that is slow, not mobile-friendly or structurally broken needs technical repair before anything else begins — sometimes a one-off project in its own right.
- **The volume of content.** Modern SEO is built on quality content. Writing articles and service pages is a major share of the work.
- **Links and authority.** Building the domain's reputation, through links from credible sources, is one of the more expensive and slower parts of the job.

## How much does SEO cost per month in 2026? A price table

These are the accepted market ranges in Israel for 2026. Note that a price far below the bottom of the range is usually a warning sign rather than a bargain:

| Type of service | Monthly price range (2026) | Who it suits |
| --- | --- | --- |
| Basic local SEO | ₪1,500–3,500 | A local business, an uncompetitive niche, one city |
| Mid-level business SEO | ₪3,500–6,000 | Moderate competition, several areas or services |
| Competitive or nationwide SEO | ₪6,000–20,000+ | A very competitive field, nationwide reach, e-commerce |
| One-off technical project | ₪2,000–6,000 | Fixing the technical foundation, keyword research, initial scoping |

A monthly plan usually bundles technical optimisation, content writing, link building and reporting. The larger the budget, the more content can be produced and the more competitive the keywords that can be targeted.

## Why is this a monthly payment and not a one-off?

Because Google never finishes: your competitors keep publishing content, the algorithm updates, and what searchers are looking for shifts. SEO that stops does not vanish overnight, but it erodes — positions won with effort slide as competitors overtake you. The right way to think about it is not as an expense but as building an asset, much like [content marketing](/en/blog/content-marketing-blog), where every article keeps working a year after it was published.

## How long do results take?

This is the most important question, and the honest answer is: patience. First signs usually appear within three to four months, and meaningful results within six to twelve. Anyone promising page one of Google within a week — or guaranteeing a top position at all — is selling you an illusion. [Google states plainly in its official documentation](https://developers.google.com/search/docs/fundamentals/do-i-need-seo) that nobody can guarantee a ranking. If you need an immediate result, paid advertising is the right tool for the short term, while SEO builds the long-term foundation.

## How do you avoid wasting the budget?

- **Insist on transparent reporting.** A monthly report with positions, organic traffic and leads — not just a note that somebody worked on the site.
- **Check that real content is being produced.** SEO without new content is usually SEO that is not moving.
- **Start with keyword research.** Without knowing what customers are searching for, everything else is guesswork. We went into this in the [keyword research guide](/en/blog/keyword-research-guide).
- **Think about the next generation of search as well.** Today you are not optimising for Google alone, but also for answers produced by artificial intelligence. We covered that in the [GEO guide](/en/blog/geo-ai-search-optimization).

Before choosing an SEO supplier, it is worth reading [the guide to choosing SEO services](/en/blog/seo-services) — it will save you a year of wasted budget.

---

**Want to know what it would cost to promote your own business?** Take a look at the [SEO service](/en/services/seo) from AITERRA, or [leave your details](/en/contact) for a tailored quote.

## Further reading

- [How to choose SEO services: the guide that saves you a year of budget](/en/blog/seo-services)
- [Keyword research: how to find what customers are really searching for](/en/blog/keyword-research-guide)
- [GEO: search optimisation in the age of artificial intelligence](/en/blog/geo-ai-search-optimization)`,
    faq: {
      title: 'Frequently asked questions about the cost of SEO',
      items: [
        {
          q: 'How much does SEO cost per month for a small business in 2026?',
          a: 'The accepted range is ₪1,500–3,500 a month for a local business in an uncompetitive niche, and ₪3,500–8,000 and up for a competitive field or nationwide coverage. The price depends on the level of competition, the state of the site, and how much content and how many links are produced each month. A price well below the bottom of the range is usually a warning sign rather than a bargain.',
        },
        {
          q: 'Why is SEO a monthly payment rather than a one-off?',
          a: 'Because the work never ends: competitors keep publishing content, the algorithm updates and search intent shifts. SEO that stops erodes gradually — positions won with effort slide as competitors overtake you. The monthly payment holds the rankings you have and keeps building on them, which is why SEO is better understood as building an ongoing asset than as a one-off expense.',
        },
        {
          q: 'How long does it take to see results from SEO?',
          a: 'First signs usually appear within three to four months, and meaningful results within six to twelve. The pace depends on the competition in your field, the age of the domain, and the volume of content and links. Anyone promising first place on Google within a week, or guaranteeing a ranking at all, is selling an illusion — Google itself states that rankings cannot be guaranteed.',
        },
        {
          q: 'What is the difference between SEO and paid advertising?',
          a: 'Paid advertising, or PPC, delivers traffic immediately for as long as you keep paying, and stops the moment you do not. Organic SEO builds an asset that keeps producing traffic without paying per click, but takes months to mature. Running both together gives you a fast result and a long-term foundation at the same time.',
        },
        {
          q: 'What is included in a monthly SEO plan?',
          a: 'A typical monthly plan covers technical optimisation of the site, writing content and service pages, building links and authority, and transparent monthly reporting on positions and organic traffic. The larger the budget, the more content can be produced and the more competitive the keywords that can be targeted. The emphasis should be on business results — leads and sales — and not on rankings alone.',
        },
      ],
    },
  },

  'seo-services': {
    title: 'SEO Services: How to Choose the Right Agency',
    excerpt:
      'Every agency promises first place on Google. What a serious SEO service includes, what it costs in Israel, and the red flags to spot early.',
    tags: ['SEO', 'Organic search', 'Development'],
    content: `**In short (TL;DR):** SEO services are an ongoing process that improves the ranking of your website in the organic results of Google. A serious service covers four components: technical optimisation, content strategy, authority building and transparent measurement. In Israel the price runs between ₪2,500 and ₪15,000 a month, and meaningful results arrive within 8 to 12 months.

![Choosing SEO services: the guide that will save you a year of wasted budget](/images/blog/seo-services.webp)

Choosing an SEO company is one of the most important marketing decisions a business makes, and also one of the most confusing. Every agency promises first place on Google, prices range from a few hundred to tens of thousands of shekels a month, and results only arrive after months. This guide sorts it out: what professional SEO services really include, what they cost in the Israeli market, which questions to ask before signing — and how to spot empty promises before they cost you a year of budget.

## Why now in particular? The numbers

- Google holds [around 90% of the global search market](https://gs.statcounter.com/search-engine-market-share) — a business that does not appear there barely exists for new customers.
- According to a forecast by the research firm Gartner (February 2024), traditional search volume in engines is expected to fall by around 25% by 2026 in favour of AI assistants, which makes a strong organic foundation more critical still.
- First organic results usually arrive within 4 to 6 months; meaningful results within 8 to 12 months.
- Unlike paid advertising, organic traffic does not disappear the moment you stop paying — it is an asset built over time.

## What must an SEO service include?

A serious [organic SEO](/en/services/seo) service stands on four legs, and the absence of any one of them shows up in the results:

**Technical optimisation (technical SEO):** loading speed, a sound site structure, structured data (Schema) and the removal of crawl blockers. The Google of today examines the quality of the code and the infrastructure — the [Core Web Vitals](https://web.dev/articles/vitals) metrics, for example — no less than the content. A site that is slow or technically broken will not rank, however brilliant its content.

**Research and content strategy:** keyword research that identifies what your customers actually type and what their search intent is, and content built to answer it — focused service pages and articles that build authority.

**Authority building (off-page):** quality links from relevant sites and mentions across the web. Not hundreds of links a month from link farms, but a natural profile that Google rewards over time.

**Measurement and transparency:** full access for you to Google Search Console and to analytics (GA4), and a monthly report showing not only positions but traffic, leads and revenue.

## How much does SEO cost in Israel?

The price varies mainly with how competitive the sector is and with the scope of work. The table below sums up current market ranges:

| Service type | Price range | Who it suits |
| --- | --- | --- |
| SEO for a local business | ₪2,500–6,000 a month | Small businesses in local sectors |
| SEO in a competitive national sector | ₪7,000–15,000+ a month | Law, finance, property, medicine |
| Comprehensive SEO audit (one-off) | ₪3,000–10,000 | Anyone wanting to check the current position before committing |

It is worth understanding the economics of the cheap offers: real SEO takes professional hours, so anyone charging ₪800 a month simply cannot spend more than an hour or two on you, and that is exactly what you will get. A high price on its own, on the other hand, guarantees nothing — which is why the following questions matter more than the price.

## Which questions must you ask before signing?

- **Who will actually work on my site?** An agency with an in-house team, or an intermediary passing the work to freelancers?
- **What will you do in the first months?** A professional answer covers a technical audit, keyword research and a content plan — not "we will start promoting".
- **What does the monthly report look like?** Ask for a sample. A good report shows organic traffic, leads and progress against targets, not just a list of positions.
- **What happens if we part ways?** The content, the links and the access must remain your property. Avoid long commitments with no exit points.
- **What is the realistic timeline?** An honest answer talks about 4 to 6 months for first results and 8 to 12 months for meaningful ones, depending on the competition and on the starting point.

## Which red flags must you spot?

Be wary of a promise of "guaranteed first place" (nobody controls the Google algorithm), of a "secret method" that cannot be explained, of a refusal to give you access to your own data, and of reporting "number of links" as a measure of success. An agency that works properly will be glad to explain exactly what it does and why.

## Why does a supplier who also understands code have an advantage?

A large share of SEO problems on Israeli websites are technical: slow sites, bloated templates, code that Google struggles to crawl. An agency that comes from the development world can fix the technical core itself instead of recommending it to the client developer — and that is a difference of months in the pace of progress. This is how we work at Aiterra: one team holding both the code and the strategy.

Want a second opinion on a proposal you have received, or a check on where your site stands today? Leave your details and we will come back to you with an initial diagnosis — no commitment and no jargon.

---

**Want us to do it for you?** See the Aiterra [organic SEO](/en/services/seo) service, or [leave your details](/en/contact) for a free consultation.

## Further reading

- [Keyword research: how to discover what your customers are really searching for on Google](/en/blog/keyword-research-guide)
- [GEO: the guide to search optimisation in the age of artificial intelligence — how to appear in ChatGPT and Google AI](/en/blog/geo-ai-search-optimization)`,
    faq: {
      title: 'Common questions before you start',
      items: [
        {
          q: 'What is SEO?',
          a: 'Organic SEO is an ongoing process that adapts your website to the requirements of the Google algorithm, so that it appears high in the search results without paying per click. The process combines technical optimisation, content matched to search intent and authority building, and it creates a traffic asset that remains even when you stop investing in paid advertising.',
        },
        {
          q: 'How much does SEO cost in Israel?',
          a: 'In Israel, SEO for a local business usually runs between ₪2,500 and ₪6,000 a month, while competitive national sectors such as law, finance and property start at around ₪7,000 and can pass ₪15,000. A one-off SEO audit costs ₪3,000–10,000. The price is set by the level of competition in the niche and by the starting state of the site.',
        },
        {
          q: 'How long does it take to see results from SEO?',
          a: 'First organic results, such as a rise in positions for less competitive phrases, usually appear within 4 to 6 months. Meaningful results in traffic and leads arrive within 8 to 12 months, depending on how competitive the sector is and on the starting point of the site. Anyone promising you first place within a week is selling an illusion.',
        },
        {
          q: 'How do you choose a good SEO company?',
          a: 'Check that the service covers technical optimisation, content strategy, authority building and transparent measurement with full access to your own data. Ask who will actually work on the site, request a sample monthly report, and make sure the content and the links stay in your ownership. Prefer a team that holds both development and SEO, so it can fix technical problems itself.',
        },
        {
          q: 'What are the red flags to watch out for?',
          a: 'Be wary of a promise of guaranteed first place, since nobody controls the Google algorithm; of a secret method that cannot be explained; of a refusal to give you access to Search Console and analytics; and of reporting the number of links as a measure of success instead of traffic and leads. A professional agency will be glad to explain exactly what it does and why.',
        },
      ],
    },
  },

  'short-video-marketing': {
    title: 'Short-Form Video Marketing: TikTok, Reels, Shorts',
    excerpt:
      'Short video is the cheapest reach in digital marketing today. No big production and no dancing: how a serious business builds video that sells.',
    tags: ['Short-form video', 'TikTok', 'Instagram Reels', 'YouTube Shorts', 'Content marketing'],
    content: `**In short (TL;DR):** Short-form video marketing for business means vertical clips of 15 to 60 seconds on TikTok, Instagram Reels and YouTube Shorts. It is currently the cheapest organic reach available: the algorithm promotes content on quality rather than on follower count, so even a small business can reach tens of thousands of viewers with no media budget at all.

If you still think TikTok is teenagers dancing, here is an update: the short-form video platforms — TikTok, Reels on Instagram and Shorts on YouTube — are now the strongest organic reach engine available to a business. While a post in the ordinary feed reaches a small percentage of your followers, one good short video can reach tens of thousands of viewers without a shekel spent on media.

![A content creator filming a short business video with a ring light](/images/blog/short-video-tiktok.webp)

## Why does short video work so well?

The algorithms behind these platforms are not interested in how many followers you have — only in how interesting the video is. That changes the rules of the game in favour of small businesses: the first video from an unknown company can overtake a giant brand, provided it catches the viewer in the opening seconds and holds them to the end. Reach is handed out on quality, not on budget.

The only measures the algorithm cares about are watch-through rate, meaning how much of the video people actually saw, and the rate of saves and shares. That makes the first second critical: a strong hook that promises the viewer immediate value — something like do not buy a piece of furniture before you know this — breaks the scroll and keeps the viewer in. Any video that holds its audience to the end is automatically pushed to more people, and that is how the snowball effect of organic reach begins.

## Why now? The numbers

The shift to video-based search and discovery is already here, and it is worth getting in before the competition closes the gap:

- Around 90% of searches worldwide still run through Google ([according to StatCounter](https://gs.statcounter.com/search-engine-market-share)) — but younger audiences increasingly look for products and services directly inside the short-video apps.
- Whoever starts today builds a library of video assets ahead of the competition, and enjoys a head start with the algorithm.
- Effective length for a business video: roughly 15 to 60 seconds — enough to deliver value, short enough to hold to the end.

## Which video formats work for real businesses?

You do not need to dance and you do not need a studio. What works is value and honesty. The table below sets out the formats that produce results, by level of effort and by purpose:

| Content type | Production effort | Especially suited to |
|---|---|---|
| A one-minute professional tip (3 mistakes everyone makes with...) | Low | Building professional authority |
| Before and after of completed work | Medium | Visual services: design, renovation, aesthetics |
| Behind the scenes of a project | Low | Branding and trust |
| An answer to the question you are asked every day (FAQ) | Low | B2B and professional services |
| A client speaking about the result | Medium | Conversion and warm leads |

The formula stays the same in every format: an opening that stops the scroll within two seconds, content that keeps the promise, and an ending with a clear next step.

![Lighting and equipment being set up to film video content for social media](/images/blog/short-video-tiktok-2.webp)

## How do you turn a viral video into a paying lead?

Reach is pleasant, leads are the point. The connection is made in two places: in the profile, through a focused bio with a link to a fast landing page, and in the videos themselves, through a natural invitation to the next step. And if you want to accelerate: the organic videos that have proved themselves make the most effective paid ads there are, because they have already passed the test of a real audience. You can push them out as a paid campaign through platforms such as [Meta for Business](https://www.facebook.com/business) and measure every lead.

The big advantage: instead of guessing which ad will work, you already know which video the audience liked — and that is exactly the video that gets the budget. Cold audiences meet a proven winner, everyone who watched it becomes a warm audience, and the warm viewers are invited to the landing page or to WhatsApp. That is how one video builds an entire funnel: free organic reach at the top, paying and measurable leads at the bottom.

## How much content can one shoot day produce?

The secret to consistency without burnout is batch production: a single concentrated shoot day yields ten to fifteen videos, which are then published across the month on every platform in parallel. We at Aiterra run the whole process — strategy, scripts, filming, editing and scheduled publishing — so that all that is left for you is to appear in front of the camera (and even that can sometimes be skipped).

Want your business to show up in the feed of your next customers? Leave your details and we will build you a full monthly video plan.

---

**Want campaigns that return the investment?** See the AITERRA [paid advertising](/en/services/marketing) service, or [leave your details](/en/contact) for a free consultation.

## Further reading

- [Facebook and Instagram advertising in 2026: how to turn idle scrolling into paying customers](/en/blog/facebook-instagram-ads)
- [Digital branding for business: how to build a brand people remember, not another forgotten logo](/en/blog/digital-branding-guide)`,
    faq: {
      title: 'Common questions about short video for business',
      items: [
        {
          q: 'Is TikTok suitable for a serious business or for B2B?',
          a: 'Yes. The TikTok user base has grown up, and professional content pitched at eye level works very well in heavier fields such as consulting, property and B2B. On top of that, exactly the same videos work on Reels and on Shorts, so you are not dependent on a single platform and you increase reach for identical effort.',
        },
        {
          q: 'How many short videos should you publish a week?',
          a: 'Consistency matters more than volume. Two to three videos a week sustained over time beat ten videos in one week followed by silence, because the algorithm rewards regular activity. One concentrated shoot day a month, producing 10 to 15 videos, supplies that rhythm easily and without burnout.',
        },
        {
          q: 'What if I am uncomfortable appearing on camera?',
          a: 'Several approaches work without you appearing at all: process videos with no speaking, voiceover on top of screen recordings or finished work, a charismatic employee representing the business, or text-based editing. Proper preparation and a short script also make filming far less stressful for anyone who does choose to appear.',
        },
        {
          q: 'How much does it cost to produce short video content for a business?',
          a: 'The saving comes mainly from working in batches: one concentrated shoot day produces a stock of 10 to 15 videos for a whole month, so the cost of an individual video falls dramatically. We at Aiterra build a fixed monthly package covering strategy, scripts, filming, editing and scheduled publishing at a price known in advance.',
        },
        {
          q: 'What is the difference between TikTok, Reels and Shorts, and where should you publish?',
          a: 'In production terms there is no difference: one short vertical video suits all three. The difference is the audience — TikTok is strong on viral discovery, Instagram Reels connects to an existing audience and to the brand, and YouTube Shorts benefits from long-term search. Our recommendation: publish the same video on every platform in parallel and maximise reach.',
        },
      ],
    },
  },

  'web-development-bat-yam': {
    title: 'Website Development in Bat Yam: Cost and Process',
    excerpt:
      'Choosing a web development company in Bat Yam: why a local supplier helps, how the process runs, 2026 price ranges and what never to compromise on.',
    tags: ['Web development', 'Bat Yam', 'Local SEO', 'Small business'],
    content: `**TL;DR:** A web development company in Bat Yam means face-to-face discovery meetings, familiarity with the local market, and full ownership of the domain and the code. We at AITERRA are based in Bat Yam and build websites for businesses in the city and across Gush Dan. Price ranges for 2026 run from ₪3,000 for a landing page to ₪12,000+ for a full brochure site.

Looking for a web development company in Bat Yam? There is a real advantage to working with a local supplier, and not out of sentiment: a successful website project rests on good communication and an understanding of the business, and that works best when you can meet in person. We at AITERRA are based in Bat Yam, on Rabbi Nissenbaum Street, and work with local businesses from the neighbourhood and from across the centre of the country.

![A team building a website for a local business in Bat Yam](/images/blog/web-development-bat-yam.webp)

## Why choose a local company in Bat Yam?

- **A face-to-face discovery meeting.** Discovery is the stage that saves the most money later on, and it is far more effective when everyone sits in the same room and aligns expectations.
- **Knowing the local customer.** A business in Bat Yam competes for an audience from Bat Yam, Holon and Tel Aviv, and a local supplier knows how to build a message that speaks to it.
- **Availability and support.** Ongoing service and maintenance are easier to get from a supplier who is a short drive away.

## Why a fast, well-optimised site is critical: the numbers

Before talking about design, it is worth understanding why a technically sound site is an investment that pays for itself. A few figures that explain the picture:

- **Around 90% of searches go through Google.** Google holds roughly 90% of the global search market [according to StatCounter data](https://gs.statcounter.com/search-engine-market-share), so a customer looking for web development in Bat Yam, or for a tradesperson near home, almost always arrives from there.
- **Speed means more enquiries.** A site with good [Core Web Vitals](https://web.dev/articles/vitals) scores loads fast, ranks higher in search, and loses fewer visitors who give up mid-load.
- **Proximity builds trust.** Customers prefer to buy from a business they recognise as local, and a site that speaks the language of Bat Yam and the surrounding area converts better.

## What does a proper website project look like?

A professional process has four clear stages, and you should sign each one off before the next begins. That way there are no surprises and no hidden costs:

1. **Discovery** — understanding the requirements, the audience and the business goals, and mapping the pages and content the site will carry.
2. **Design** — UX/UI matched to the brand, responsive and clear, presented for your approval before a line of code is written.
3. **Development** — built in clean, fast code, with the emphasis on performance and full compatibility on mobile and desktop.
4. **Launch and promotion** — going live with SEO foundations in place, GA4 measurement and a connection to your marketing tools.

## What does a website cost in Bat Yam? A 2026 price table

| Type of site | Price range | Suits |
|---|---|---|
| Landing page | ₪3,000–5,000 | A paid campaign, launching a single service |
| Brochure site | ₪5,000–12,000 | A business with several services, a full presence |
| Shop / system | ₪12,000+ | Online sales, a custom management system |

The final price is set by the volume of content, the complexity of the design and the functionality required: the number of pages, animation, advanced forms, a client area or an integration with external systems. A serious quote spells out exactly what each stage includes, so that you can compare suppliers fairly.

## Does a business website in Bat Yam have to be accessible?

Yes. Under the Equal Rights for Persons with Disabilities Law, service websites in Israel are required to meet the Israeli accessibility standard (IS 5568), which is based on the international [WCAG 2.0 level AA](https://www.w3.org/TR/WCAG20/) guidelines from the W3C. We build accessibility into the site from the development stage onwards, so that you do not pay for it twice after the fact and are not exposed to needless claims.

## What should you never compromise on?

Make sure you get full ownership of the domain, the hosting and the code; a fast site with good Core Web Vitals scores; and SEO foundations that are ready to build on. Without those three, even a beautiful site will not bring in customers. For a local business it is also worth connecting the site to a Google Business Profile listing and to location data, so that you appear in near-me searches and on Google Maps across Bat Yam, Holon and Tel Aviv.

---

**Want a site that brings in customers from Bat Yam and the surrounding area?** See the [web development service](/en/services/web-development) from AITERRA, or [talk to us](/en/contact) about a discovery call.

## Further reading

- [Web development across Gush Dan: Holon, Rishon LeZion, Tel Aviv and Ramat Gan](/en/blog/web-development-gush-dan)
- [What does a brochure website cost a small business in Israel in 2026?](/en/blog/website-cost-israel-2026)
- [Local SEO for small businesses: how to win regional search](/en/blog/local-seo-small-business)`,
    faq: {
      title: 'Common questions about building a website in Bat Yam',
      items: [
        {
          q: 'Why choose a local company in Bat Yam rather than a distant supplier?',
          a: 'A local supplier in Bat Yam makes face-to-face discovery meetings possible, knows the market and the audience in the area, and is more available for ongoing service and maintenance. Discovery, the stage that saves the most money over the life of a project, is far more efficient when everyone sits in the same room and aligns expectations before a line of code is written.',
        },
        {
          q: 'What does building a website in Bat Yam cost in 2026?',
          a: 'In Bat Yam a landing page usually runs ₪3,000–5,000, a brochure site ₪5,000–12,000, and a shop or a custom system from ₪12,000 upwards. The final price is set by the volume of content, the complexity of the design and the functionality required, such as forms, a client area or external integrations.',
        },
        {
          q: 'How long does it take to build a website?',
          a: 'A landing page or a simple brochure site is usually built within two weeks to a month. A complex brochure site or an online shop takes one to two months. The timeline depends mostly on how quickly the client supplies the content, meaning text and images, and on the scope of functionality agreed at the discovery stage.',
        },
        {
          q: 'Will I own the website outright?',
          a: 'With us, yes: you get full ownership of the domain, the hosting and the code of the site. This matters. Without ownership you are tied to the supplier for good, you cannot move to another company freely and you cannot upgrade. Always confirm that ownership is registered in your name before the project starts.',
        },
        {
          q: 'Do you also promote the site on Google?',
          a: 'Yes. We build every site with organic search (SEO) foundations in place: sound structure, fast loading and structured data. We also offer an ongoing SEO service and paid campaigns, so that the site brings in real enquiries from customers in Bat Yam and the surrounding area rather than only looking good.',
        },
      ],
    },
  },

'web-development-gush-dan': {
  title: 'Web Development Agency in Tel Aviv & Gush Dan',
  excerpt:
    'Choosing a web development company in Gush Dan: why a local agency matters in Tel Aviv, Ramat Gan, Holon and Rishon LeZion, and what it costs in 2026.',
  tags: [
    'Web development',
    'Gush Dan',
    'Holon',
    'Rishon LeZion',
    'Tel Aviv',
    'Local SEO',
  ],
  content: `**In short (TL;DR):** Web development in Gush Dan means building a site end to end with a digital agency that knows the competitive market of the Tel Aviv metropolitan area. Choose a local supplier you can meet face to face, one that builds a site ready for search from day one and gives you full ownership. Prices in 2026 run from about ₪3,000 for a landing page to ₪25,000 and up for a brochure site.

Looking for a web development company in Gush Dan? Choose a local supplier you can meet in person, one that knows how competitive the centre of the country is, and one that gives you full ownership of the domain, the hosting and the code. We at AITERRA are based in Bat Yam — in the middle of Gush Dan — and work with businesses in Holon, Rishon LeZion, Tel Aviv, Ramat Gan and Givatayim. Prices in 2026 range from ₪3,000 for a landing page up to ₪25,000 and above for a full brochure site, depending on scope and search readiness.

![The Gush Dan skyline — a local digital agency building websites in Holon, Rishon LeZion, Tel Aviv and Ramat Gan](/images/blog/web-development-gush-dan.webp)

A digital agency in Gush Dan is a supplier that plans, designs and builds your site end to end — from specification and design through code, launch and maintenance — with first-hand knowledge of the crowded business market of the Tel Aviv metropolitan area. Gush Dan is the densest business region in Israel, and that means one thing: digital competition here is unusually fierce, and an average site simply disappears. To stand out you need a site that is fast, built for mobile and ready for search from the first day — particularly when Google holds around 90% of the search market ([according to StatCounter data](https://gs.statcounter.com/search-engine-market-share)), so nearly every potential customer starts their search there.

## Why does the location of the agency in Gush Dan matter at all?

A supplier who runs everything over email and Zoom can build a good-looking site — but a successful project rests on a deep understanding of the business, and that happens best face to face. Here are the practical advantages of a supplier from the area:

- **A scoping meeting in the same room.** The specification stage saves the most money later, and it works better sitting together. In Gush Dan that means a fifteen-minute drive, not a whole working day.
- **Knowledge of the local competition.** A business in Ramat Gan competes for customers from Ramat Gan, Givatayim and Tel Aviv — not against the whole country. A supplier who knows the regional market can build a site and landing pages that speak to exactly that audience.
- **Genuine availability.** When the site goes down in the middle of a campaign, a local supplier you can actually reach is a different kind of reassurance from anonymous chat support.
- **Stronger local search.** Every city is a separate search entity in Google. A supplier who understands that builds you a presence for each relevant city — which connects directly to [local SEO](/en/blog/local-seo-small-business).

## What suits each city in Gush Dan?

The mechanics of building a website are the same everywhere, but the business emphasis shifts from city to city. This is how we approach each one:

| City | Typical business character | The emphasis in the site and in search |
| --- | --- | --- |
| Tel Aviv | Startups, restaurants, premium service providers | Striking design, strong branding, high-end speed and UX |
| Ramat Gan and Givatayim | Offices, the diamond trade, clinics, finance | Credibility, a customer area, integrations |
| Holon | Industry, trade, garages, home services | Local leads, WhatsApp and phone links, simplicity |
| Rishon LeZion | Retail, education, community service providers | Local search by neighbourhood, online shop, accessibility |

The table is a starting point, not a rule. An excellent business in Holon may want premium design exactly as one in Tel Aviv would — it all gets settled in the scoping call.

## What does a website in Gush Dan cost in 2026?

The price is set by the scope of the site, the level of design and the number of pages and integrations — not by the city. These are the ranges we work to in 2026:

| Type of site | Price range (2026) | Mainly suited to | Estimated build time |
| --- | --- | --- | --- |
| Focused landing page | About ₪3,000–7,000 | A single campaign, service or product | One to two weeks |
| Business brochure site | About ₪8,000–25,000 | Service providers and local businesses | About 4–8 weeks |
| E-commerce store | From ₪20,000 and up | Retail and online sales | About 6–12 weeks |

One point worth making: a local agency is not necessarily more expensive than a supplier in a tower in central Tel Aviv, and is sometimes better value, because there are no layers of account management and middlemen inflating the bill. We set out in full what drives the price in the [2026 website cost guide](/en/blog/website-cost-israel-2026), and the end-to-end process in the [guide to choosing a company](/en/blog/website-building-services). If you are looking specifically for a supplier in the southern part of Gush Dan, we have a [separate guide to web development in Bat Yam](/en/blog/web-development-bat-yam).

## How do you choose well and avoid the traps?

These are the questions to put to any supplier in Gush Dan before you sign — and the right answers:

- **Who owns the domain, the hosting and the code?** The only correct answer: you do.
- **Is the site built ready for organic search?** Heading structure, loading speed ([Google's Core Web Vitals metrics](https://web.dev/articles/vitals)) and structured data — fixing this after the fact costs more than building it right.
- **How does the site look on a phone?** More than half of visitors in Israel arrive from a smartphone. Ask to see their work on mobile.
- **Who actually works on the project?** A designer and a developer working together, or a distant subcontractor?
- **What is included after launch?** Warranty, response times and the cost of changes — all in writing.

If a proposal has no proper specification stage, that is a red flag, local or not. We covered every red flag in the [guide to choosing a digital agency you can trust](/en/blog/how-to-choose-digital-agency).

Weighing up quotes, or want to know what the site you actually need would cost? [Leave your details](/en/contact) and we will come back with an honest estimate, including what is not worth paying for.

---

**Want a website that works for you?** Take a look at the [website build service](/en/services/web-development) from AITERRA, or [talk to us](/en/contact) for a free scoping call.

## Further reading

- [What does a small business website cost in Israel in 2026?](/en/blog/website-cost-israel-2026)
- [Web development in Bat Yam — choosing a supplier, the process and the prices](/en/blog/web-development-bat-yam)
- [Owning your city: the guide to local SEO for small businesses](/en/blog/local-seo-small-business)`,
  faq: {
    title: 'Frequently asked questions about web development in Gush Dan',
    items: [
      {
        q: 'What does a business website in Gush Dan cost?',
        a: 'In 2026 a focused landing page costs roughly ₪3,000–7,000, a business brochure site ₪8,000–25,000, and an e-commerce store from ₪20,000 and up. The price is set by the scope of the site and the level of design, not by the city. A local agency in Gush Dan is not necessarily more expensive than a supplier in central Tel Aviv.',
      },
      {
        q: 'Is it better to choose a supplier from my own city, or does it not matter?',
        a: 'Technically a website can be built from anywhere, but a supplier based in Gush Dan brings practical advantages: a face-to-face scoping meeting, knowledge of the local competition in each city, fast availability when something breaks during a campaign, and an understanding of the local search picture for your area. In a market as competitive as the centre of the country, those differences show up directly in the result.',
      },
      {
        q: 'Do you build websites outside Bat Yam as well?',
        a: 'Yes. We are based in Bat Yam, in the middle of Gush Dan, and work with businesses across the region — Holon, Rishon LeZion, Tel Aviv, Ramat Gan and Givatayim — including a face-to-face scoping meeting at your office or ours. Being close by means fast availability throughout the project and after launch too.',
      },
      {
        q: 'How long does it take to build a website?',
        a: 'A focused landing page can go live within one to two weeks. A full brochure site usually takes about 4 to 8 weeks, and an e-commerce store about 6 to 12 weeks. The build time depends on complexity, on the number of pages and integrations, and above all on how quickly you approve copy and images at your end — the stage that usually sets the schedule.',
      },
      {
        q: 'Will the site be built ready for Google?',
        a: 'Yes, and it matters. We build every site with a correct heading structure, high loading speed measured against Core Web Vitals, structured data (Schema) and full mobile compatibility, so the foundation for organic search in Google is there from day one. That saves you paying again later to repair a site that was not built properly.',
      },
    ],
  },
},

'website-accessibility-cost-5568': {
  title: 'Website Accessibility Cost in Israel: SI 5568',
  excerpt:
    'Website accessibility is a legal duty in Israel. What SI 5568 compliance costs in 2026, what the law requires, and why an overlay is not enough.',
  tags: ['Web accessibility', 'SI 5568', 'WCAG', 'Israeli law', 'Pricing'],
  content: `**In short (TL;DR):** Website accessibility means adapting a site for people with disabilities under the Israeli standard SI 5568 (based on WCAG 2.0 AA), and it is a legal requirement in Israel. The cost in 2026 runs from roughly ₪1,500 for a small site to ₪15,000+ for a large one — a trivial sum next to compensation of up to about ₪50,000 that a court can award in a claim without proof of damage.

Website accessibility is a legal requirement in Israel, and a site that is not accessible exposes the business to a claim — including compensation of up to about ₪50,000 per claimant, with no need to prove damage. The cost in 2026 usually runs from ₪1,500 for a small, simple site to ₪10,000 and up for a large, complex one, accessibility statement included. That is far less than the legal exposure — and it opens the business to a wider audience.

![How much website accessibility costs under standard SI 5568 — a woman in a wheelchair working on a laptop](/images/blog/website-accessibility-cost-5568.webp)

Website accessibility means adapting the site so that people with disabilities (sight, hearing, motor, cognitive) can use it — through a screen reader, keyboard navigation, sufficient contrast and alternative text for images. In Israel the requirement is anchored in the equal rights for people with disabilities regulations, and it rests on the Israeli standard SI 5568, which in turn follows the [WCAG 2.0 level AA guidelines](https://www.w3.org/WAI/standards-guidelines/wcag/) published by the W3C.

## What does the law actually require?

The law requires two main things: that **the site itself is accessible** under the standard, and that **an accessibility statement is published** — available to visitors, setting out the level of accessibility achieved and the contact person for the subject. Enforcement sits with the [Commission for Equal Rights of Persons with Disabilities](https://www.gov.il/he/departments/moj_disability_rights/govil-landing-page) at the Ministry of Justice, and on the Commission's own estimates a substantial share of the population in Israel lives with some form of disability — meaning this is a real customer base, not merely a bureaucratic box to tick.

Compliant accessibility work covers several core components in practice:

- **Screen reader support** — marking up content correctly so reading software can interpret it.
- **Keyboard navigation** — every part of the site operable without a mouse.
- **Colour contrast** — a sufficient contrast ratio between text and background.
- **Alternative text (alt)** — a written description for every meaningful image.
- **A correct heading structure** — a logical hierarchy from H1 to H3.
- **Accessible forms** — clear labels and error messages that make sense.

Worth remembering: accessibility is not a one-off task — new content added to the site has to stay accessible too.

## How much does website accessibility cost in 2026?

| Scope | What it includes | Indicative price range |
| --- | --- | --- |
| Small / brochure site | Standard fixes + accessibility statement | ₪1,500–4,000 |
| Mid-sized business site | Full accessibility work + testing | ₪4,000–8,000 |
| Large site / online shop | Complex work + ongoing maintenance | ₪8,000–15,000+ |

The range is wide because the price depends on the size of the site, the number of pages and components, and the current state of the code — a site built with accessibility in mind from the start is cheaper to bring up to standard than an old site that needs correcting. On top of that there is usually a small annual cost for keeping the statement current and repeating the tests.

## Is an accessibility overlay enough?

This is one of the common mistakes. A plugin or accessibility widget — the floating button that lets a visitor enlarge text and switch contrast — is a help, but **on its own it is usually not enough** to meet the standard, and both case law and professional opinion hold that relying on it alone is not a legal defence. Real accessibility requires changes in the code and structure of the site itself: a correct heading order, keyboard navigation, alternative text and proper mark-up. The overlay can complement that work, not replace it.

## Why it pays off beyond the law

Accessibility does more than lower legal risk — it widens the audience (a significant share of the population lives with some form of disability), and it usually improves both the user experience and organic search performance: clean structure, alternative text and clear navigation help search engines read the site too. We covered the wider legal picture in the [guide to website accessibility in Israel](/en/blog/website-accessibility-israel). If you are building a new site, it is better to include accessibility at the specification stage — see the [guide to choosing a company and the website build process](/en/blog/website-building-services) — and avoid a [hidden cost](/en/blog/cheap-website-hidden-costs) further down the line.

---

**Not sure whether your site meets the standard?** Take a look at the [website build and accessibility service](/en/services/web-development) from AITERRA, or [talk to us](/en/contact) for an accessibility check and a quote.

## Further reading

- [Website accessibility in Israel: what the law requires and how to avoid a claim](/en/blog/website-accessibility-israel)
- [Building a business website: choosing a company, the process and the cost](/en/blog/website-building-services)
- [A website from ₪1,500? The hidden costs nobody mentions](/en/blog/cheap-website-hidden-costs)`,
  faq: {
    title: 'Frequently asked questions about accessibility cost and SI 5568',
    items: [
      {
        q: 'How much does website accessibility cost in 2026?',
        a: 'The usual range is about ₪1,500–4,000 for a small or brochure site including an accessibility statement, ₪4,000–8,000 for a mid-sized business site, and ₪8,000–15,000 and up for a large site or online shop. The price depends on the size of the site, the number of pages and components, and the state the code is in now.',
      },
      {
        q: 'What is the Israeli standard SI 5568?',
        a: 'SI 5568 is the Israeli standard for web content accessibility, based on the WCAG 2.0 level AA guidelines from the W3C. The equal rights for people with disabilities regulations require business websites to meet it, including publishing an accessibility statement that visitors can reach.',
      },
      {
        q: 'What is the risk if the site is not accessible?',
        a: 'A site that is not accessible exposes the business to a claim under the equal rights law, including compensation of up to about ₪50,000 per claimant with no need to prove damage. Beyond the legal risk, an inaccessible site loses a large number of potential customers who simply cannot use it.',
      },
      {
        q: 'Is an accessibility overlay enough to comply with the law?',
        a: 'Usually not. An overlay or accessibility widget helps, but on its own it is generally not enough to meet the standard, and both professional opinion and case law hold that relying on it alone is not a legal defence. Real accessibility requires changes in the code and structure of the site, and the overlay can only complement them.',
      },
      {
        q: 'How long does it take to make a website accessible?',
        a: 'A small or brochure site can usually be made accessible within a few working days, while a large business site or online shop can take two weeks to a month, including testing and fixes. The time depends on the number of pages, the kind of components involved and the accessibility state of the site before the work starts.',
      },
    ],
  },
},

  'website-accessibility-israel': {
    title: 'Website Accessibility Law in Israel and IS 5568',
    excerpt:
      'Website accessibility is a legal duty in Israel: claims reach ₪50,000 with no proof of damage. What IS 5568 requires, and why an overlay is not enough.',
    tags: ['Accessibility', 'Development', 'SEO'],
    content: `**In short (TL;DR):** Website accessibility in Israel is a legal requirement under the equal rights for people with disabilities regulations and Israeli standard IS 5568, which is based on WCAG 2.0 level AA. A site that is not accessible is exposed to a claim of up to ₪50,000 — with no proof of damage required. Real accessibility starts in the code, not in a floating widget, and it also improves your ranking in Google.

Most business owners in Israel discover that website accessibility exists only when a warning letter arrives from a lawyer. That is a shame, because making a site accessible is not only a legal duty — it is one of the most worthwhile investments available: it opens your site to hundreds of thousands of users with disabilities, improves the experience for everyone, and even strengthens your organic ranking in Google.

![A woman in a wheelchair browsing an accessible website on a laptop in an office](/images/blog/website-accessibility-israel.webp)

## What does Israeli law actually require?

Under the [equal rights for people with disabilities regulations](https://www.gov.il/), a [website](/en/services/web-development) that provides a service to the public has to meet Israeli standard IS 5568 — a standard based on the international WCAG guidelines at level AA. In practice that means the site must be usable by visitors with visual, hearing, motor or cognitive impairments: full keyboard navigation, screen reader support, sufficient colour contrast, alternative text for images and more.

## What is the risk? A claim of up to ₪50,000 with no proof of damage

This is the part worth knowing: the law allows compensation of up to ₪50,000 to be claimed — without the claimant having to prove that any actual damage was caused. Thousands of warning letters and accessibility claims are sent in Israel every year, and small businesses are a favoured target, because most of them are simply unaware of the requirements. The cost of making a site accessible is almost always far below the cost of a single claim. (One caveat: this article is not legal advice — for specific questions, consult a lawyer who specialises in the field.)

## An accessibility overlay on its own, or accessibility built into the code?

The common solution on the market is to install a floating accessibility widget, that blue button at the side of the screen. Such a widget is a useful component, but it does not let you off: it does not fix code that was built badly, a broken heading hierarchy, forms without labels or images without alternative text. Real accessibility starts in the code itself — semantic, valid HTML, full keyboard navigation and correct contrast decided at the design stage. Much as you cannot make a building without a lift accessible by putting a sign at the entrance. Here is the difference in plain terms:

| Aspect | Floating overlay widget | Accessibility built into the code |
|---|---|---|
| Fixing broken code and heading hierarchy | Does not fix it | Fixed at the root |
| Forms without labels | Usually not detected | Proper labels built in |
| Screen reader compatibility | Partial | Full |
| Contribution to Google ranking (SEO) | None | Significant |
| Full compliance with IS 5568 | Not enough on its own | Yes, together with a statement |
| Cost over time | Low but limited | A worthwhile one-off investment |

## Does accessibility really help your ranking in Google?

Yes, and here is the secret from the SEO world: Google is itself a kind of blind visitor. The search engine reads your site exactly as a screen reader does — through the code, the headings and the alternative text. An accessible site is a site Google understands better, and therefore ranks higher. And since Google [holds around 90% of the search market](https://gs.statcounter.com/search-engine-market-share), every improvement of that kind is worth its weight in gold. Add longer time on page and lower abandonment rates, and you get a genuine lift in organic ranking, as a bonus on top of meeting the law.

## How do we make sites accessible at Aiterra?

When we at Aiterra build a new site, accessibility is embedded in the code from the first line, not bolted on afterwards. For existing sites we run a full accessibility audit, fix the technical core, put the required accessibility components in place and prepare a proper accessibility statement for you, as the regulations demand.

## How to check your site today: a quick checklist

- Try navigating the site with the keyboard alone (Tab, Enter, arrow keys) — can you reach every link and button, and can you see where the focus is?
- Does every meaningful image have alternative text (alt) that describes it?
- Is the contrast between text and background sufficient, including in small type and on buttons?
- Does every form field have a clear label, and are the error messages understandable?
- Is the heading structure logical, with one H1 followed by H2 and H3 in hierarchy?
- Do the videos have captions?
- And is there an accessibility statement page on the site, reachable from every page?

For anyone who wants to go deeper, the full text of the international guidelines is published by the W3C standards body: [the WCAG standards](https://www.w3.org/WAI/standards-guidelines/wcag/).

## What is an accessibility statement and why must it appear on the site?

Beyond the accessibility work itself, the regulations require an accessibility statement to be published on the site: a page setting out which adjustments were made, which known limitations remain, and who to contact if a problem is encountered, including the details of an accessibility coordinator. It is also the first document a lawyer checks before sending a warning letter, so its existence and its quality signal that the business takes the subject seriously. You can see a live example in [our own accessibility statement](/en/accessibility-statement).

Not sure whether your site meets the requirements? Leave your details and we will run an initial accessibility check for you — better to hear about the gaps from us than from a warning letter.

---

**Want a site that works for you?** See the AITERRA [website building](/en/services/web-development) service, or [talk to us](/en/contact) for a scoping call at no cost.

## Further reading

- [Building a business website: how to choose a company, what the process involves and what it really costs](/en/blog/website-building-services)
- [Why is your website slow? The complete 2026 guide to advanced web development](/en/blog/website-performance-2026)`,
    faq: {
      title: 'Common questions about website accessibility',
      items: [
        {
          q: 'Is an accessibility widget enough to comply with the law?',
          a: 'In most cases, no. A floating overlay closes some gaps, but IS 5568 requires the code itself, the forms, the images and the navigation to be accessible — things a widget does not fix. The safe route combines valid code, an accessibility component and a proper accessibility statement. That is how you meet the requirements and reduce your exposure to a claim.',
        },
        {
          q: 'What is an accessibility statement and why does it matter?',
          a: 'An accessibility statement is a dedicated page on the site setting out which adjustments were made, which known limitations remain and who to contact, including the details of an accessibility coordinator. Publishing it is an explicit requirement in the regulations, and it is also the first document a lawyer checks before a warning letter. A proper statement significantly reduces exposure to claims and signals that the business is serious.',
        },
        {
          q: 'Does every website have to be accessible?',
          a: 'As a rule, any site that provides a service to the public has to be made accessible under the equal rights regulations, with certain reliefs for small businesses with low turnover. Because the detail varies by type of business, it is worth checking your specific obligation — and remembering that even where a partial exemption applies, an accessible site is a clear commercial and marketing advantage.',
        },
        {
          q: 'What does it cost to make an existing site accessible?',
          a: 'The cost depends on the size of the site and the state of the existing code: a site that was built properly mainly needs adjustments and an accessibility statement, while an older site with problematic code needs far more work. Either way, the cost of accessibility is almost always far below the cost of a single claim of up to ₪50,000. We at Aiterra will run a diagnosis and give you an accurate estimate.',
        },
      ],
    },
  },

  'website-cost-israel-2026': {
    title: 'Website cost in Israel 2026: real price ranges',
    excerpt:
      'What a website really costs a small business in Israel in 2026: price ranges for a landing page, a brochure site and a store, plus running costs.',
    tags: ['Web development', 'Pricing', 'Small business', 'Brochure site'],
    content: `**In short (TL;DR):** Building a website for a small business in Israel in 2026 costs ₪1,500–3,500 for a landing page, ₪4,000–12,000 for a brochure site, and ₪12,000 and up for an online store or a bespoke system. The price is set by the number of pages, the level of design, how complex the functionality is, and whether the site is built for search and accessibility. On top of the build itself, budget for the ongoing cost of a domain, hosting and maintenance.

"How much does a website cost?" is the first question almost every business owner asks — and the honest answer is that it depends what you are building. A website is not a uniform off-the-shelf product; it is a service priced by scope. This guide breaks down the real price ranges in the Israeli market for 2026, explains what pushes the figure up and down, and how to avoid paying twice for the same site.

![A small business owner working out how much a website costs in Israel](/images/blog/website-cost-israel-2026.webp)

## How much does a website cost by type? A price table

| Type of site | Price range in 2026 | Suits |
|---|---|---|
| Landing page | ₪1,500–3,500 | A paid campaign, a product launch |
| Brochure site | ₪4,000–12,000 | Most small businesses |
| Online store | ₪12,000–30,000 | Selling directly online |
| Bespoke system | ₪20,000 and up | A portal, a customer area, automation |

These ranges are realistic market prices for a small business in Israel in 2026, not a "website in three minutes" offer. The final figure comes down to four main factors, and here they are.

## What actually moves the price?

- **The number of pages and the volume of content.** A five-page site is cheaper than a twenty-page site with a blog and separate service pages.
- **Custom design versus a template.** A unique design built from scratch costs more than adapting a ready-made template — but it stands out far more and signals credibility.
- **Functionality.** A contact form is basic; a customer area, a CRM connection, a booking system or a WhatsApp integration all push the price up.
- **Building for search (SEO).** Since Google holds roughly 90% of the search market in Israel and worldwide ([StatCounter](https://gs.statcounter.com/search-engine-market-share)), a site built properly for speed and clean code costs a little more to produce — and saves a fortune on marketing and advertising later.

## What should be included in the price of a brochure site?

Before you compare quotes, make sure every quote covers the same components — otherwise you are comparing apples with oranges. A fair quote for a brochure site usually includes:

1. **Custom design** for the brand and its audience, not just swapped colours in a template.
2. **Full mobile support** (a responsive layout), since most visitors in Israel arrive on a phone.
3. **Basic SEO foundations** — loading speed, correct headings and correct meta tags.
4. **Accessibility** to the Israeli standard (see below).
5. **Full ownership** of the domain, the content and the code.

If a material component is missing from the cheapest quote, you will almost certainly pay for it separately later.

## Does a business website in Israel have to be accessible?

Yes, and it is a cost component many people forget. Under the Equal Rights for Persons with Disabilities Law and the Israeli accessibility regulations, business websites are required to meet Israeli standard IS 5568, which is based on the international accessibility standard WCAG 2.0 AA ([Commission for Equal Rights of Persons with Disabilities — website accessibility](https://www.gov.il/he/pages/website_accessibility)). Building accessibly from the start adds a little to the build cost but is far cheaper than retrofitting it afterwards — and it both reduces exposure to claims and widens your potential customer base. At Aiterra we build accessibility in by default, not as an expensive add-on.

## Why is a website that is too cheap usually the expensive one?

A site for ₪900 sounds tempting, but what you generally get is a generic, slow template with no ownership of the code and no foundation for search. Within a year the whole thing has to be rebuilt, and then you pay twice: once for the first site and once for the site that replaces it. Investing properly from the start is the cheapest route over the long run. We covered this in a separate guide on [the hidden costs of a cheap website](/en/blog/cheap-website-hidden-costs).

## What ongoing costs should you plan for?

Beyond the one-off build, a site needs a domain (around ₪50–120 a year), hosting (₪300–1,200 a year depending on the type) and ongoing maintenance covering updates, backups and security. Plan an annual budget, not just a build budget — a neglected site degrades quickly in speed, in security and in its Google ranking.

## How do we price a website at Aiterra?

We price against what you actually need, not against a "package". In a scoping call we map what the business genuinely requires and produce a transparent quote, with no surprises halfway through. Want an exact figure for your business? [Leave your details](/en/contact) and we will come back with a tailored proposal.

---

**Want a website that pays for itself?** Take a look at AITERRA's [web development service](/en/services/web-development).

## Further reading

- [Building a business website: how to choose a company, what the process involves and what it costs](/en/blog/website-building-services)
- [WordPress or a coded site? How to choose the right foundation](/en/blog/wordpress-vs-custom-code)
- [Freelancer or web agency — which is right for your business?](/en/blog/freelancer-vs-web-agency)`,
    faq: {
      title: 'Common questions about the cost of building a website',
      items: [
        {
          q: 'How much does a brochure site for a small business cost in 2026?',
          a: 'The market range for a brochure site in Israel in 2026 is ₪4,000–12,000, depending on the number of pages, the level of design and whether the site is built for search and accessibility. A single landing page starts at around ₪1,500–3,500, and an online store starts at ₪12,000 and goes up from there.',
        },
        {
          q: 'Why is there such a wide gap in prices between suppliers?',
          a: 'The gap comes from the level of tailoring: a ready-made template versus a unique design, heavy code versus clean and fast code, and whether the site is built for search and accessibility. A cheap site usually economises on exactly the components that cost you money later — speed, ownership of the code and SEO foundations.',
        },
        {
          q: 'Is a landing page or a full brochure site the better choice?',
          a: 'A landing page suits a focused campaign or the launch of a single product, and it is cheap and quick to produce. A brochure site suits most businesses that want a full presence, credibility, several service pages and organic visibility over time. If you sell more than one service, a brochure site is almost always the better investment.',
        },
        {
          q: 'Does accessibility make a website more expensive to build?',
          a: 'Accessibility adds some cost to the build, but in Israel it is a legal requirement: business websites must meet standard IS 5568, which is based on WCAG 2.0 AA. Building accessibly from the start is far cheaper than retrofitting, reduces exposure to claims, and widens the pool of potential customers who can actually use the site.',
        },
        {
          q: 'What are the ongoing costs once the site is live?',
          a: 'Beyond the one-off build: a domain (around ₪50–120 a year), hosting (₪300–1,200 a year depending on the type) and ongoing maintenance covering updates, backups and security. Plan an annual budget rather than a one-off build cost, so the site stays fast, secure and up to date.',
        },
      ],
    },
  },

  'website-maintenance-cost-yearly': {
    title: 'Website Maintenance Cost Per Year in Israel',
    excerpt:
      'A website is not a one-off purchase. What maintenance costs a year in 2026, and what it covers: domain, hosting, updates, security and backups.',
    tags: ['Website maintenance', 'Hosting', 'Security', 'Pricing', 'Domain'],
    content: `**In short (TL;DR):** Website maintenance is the ongoing work that keeps a site secure, fast and up to date. In 2026 it runs from a few hundred shekels a year for a small site to ₪2,000–6,000 and up for a managed business site, and it covers the domain, hosting, security updates, backups and ongoing changes.

Website maintenance in 2026 typically costs between a few hundred shekels a year for a small business with a simple site, and ₪2,000–6,000 a year and up for a business site with managed maintenance. The cost is made up of fixed items — domain and hosting — and an ongoing service of updates, security, backups and changes. A site with no maintenance is not a site that saves you money; it is a time bomb that goes off exactly when you need the site most.

![How much website maintenance costs per year — an under-construction sign on a computer keyboard](/images/blog/website-maintenance-cost-yearly.webp)

Website maintenance is everything that keeps a site alive, secure, fast and current over time — much like servicing a car. A website is software running on servers against a moving world of browsers, security standards and operating systems; without maintenance it decays, becomes exposed to attacks and eventually breaks, usually at the least convenient moment. The more the site is built on a content management system such as WordPress with plugins and themes, the greater the need for regular updates, because every third-party component is a potential weak point.

## What makes up the cost of maintenance?

| Item | What it is | Estimated annual range (2026) |
| --- | --- | --- |
| Domain | The site address (the name) | ₪40–150 |
| Hosting | The server the site runs on | ₪300–1,500 |
| Security and software updates | Closing vulnerabilities, system updates | Part of a maintenance package |
| Backups | A copy to restore from when something breaks | Part of a maintenance package |
| Ongoing changes | Content updates, small fixes | By package or by the hour |

Domain and hosting are fixed costs that almost every site pays, whatever technology it was built in. The real difference between quotes is the maintenance service itself: is somebody actively looking after the site, or are you alone in front of the screen until something breaks — and then paying emergency rates to fix it.

## What does maintenance actually cost? The numbers by site type

Representative annual ranges, by type of site and level of service:

- **A small, simple brochure site:** roughly ₪300–900 a year, mostly domain and hosting with basic updates.
- **A business site with managed maintenance:** roughly ₪2,000–6,000 a year, including updates, security, backups and an allowance for changes.
- **An online store or a complex site:** usually ₪6,000 a year and up, because payments, stock management and integrations all need close monitoring.

The ranges are driven by the complexity of the site, the volume of content and the level of service — a site with heavy traffic or sensitive systems justifies more intensive maintenance.

## Why does a site with no maintenance cost more in the end?

- **Security.** An out-of-date site is an easy target. Recovering from a breach costs far more than preventing one — we went into that in the [website security guide](/en/blog/website-security-guide).
- **Faults.** An update that breaks, a form that stops working, a site that goes down — without backups and maintenance each of those becomes an expensive crisis and lost customers in real time.
- **Obsolescence.** Browsers, standards and performance benchmarks move on; speed and page experience, measured as Core Web Vitals, have become [central quality metrics for the user experience](https://web.dev/articles/vitals), and a neglected site slips against them.
- **Search visibility.** Google — which holds [around 90% of the global search market](https://gs.statcounter.com/search-engine-market-share) — favours sites that are fast, secure and current, so neglect hits your rankings and organic exposure directly.

## Managed maintenance, or doing it yourself?

You can maintain a site yourself — but it takes time, technical knowledge and consistency. Updating a plugin on the wrong day can take the site down, and a backup nobody has ever tested is sometimes worth nothing at all. Managed maintenance hands the responsibility to professionals who monitor, update and back up proactively, so you spend your time on the business rather than on faults. For a business whose site generates leads or sales, a single hour of downtime usually costs more than a whole month of maintenance.

## What should a good maintenance package include?

A maintenance package worth paying for includes quality hosting, ongoing security updates, automatic backups, uptime monitoring, and an allowance of hours for small changes. Always ask what is included and what counts as a paid extra — this is precisely one of the [hidden costs of a cheap website](/en/blog/cheap-website-hidden-costs) that surfaces after launch. And when you budget for a new site, build the annual maintenance in from the start — see the [2026 guide to website build costs](/en/blog/website-cost-israel-2026).

---

**Want somebody keeping your site quiet and secure?** Take a look at AITERRA's [website build and maintenance service](/en/services/web-development), or [talk to us](/en/contact) about a maintenance package that fits.

## Further reading

- [Website security: protecting your site and your customers](/en/blog/website-security-guide)
- [A website from ₪1,500? The hidden costs nobody tells you about](/en/blog/cheap-website-hidden-costs)
- [What does a small business website cost in Israel in 2026?](/en/blog/website-cost-israel-2026)`,
    faq: {
      title: 'Common questions about website maintenance costs',
      items: [
        {
          q: 'How much does website maintenance cost a year?',
          a: 'In 2026 maintenance runs from a few hundred shekels a year for a small, simple site to ₪2,000–6,000 a year and up for a business site with managed maintenance. The cost covers the domain and hosting as fixed items, plus an ongoing service of updates, security, backups and changes. The price rises as the site grows more complex and takes more traffic.',
        },
        {
          q: 'What is included in website maintenance?',
          a: 'A good maintenance package includes quality hosting, ongoing security and software updates, automatic backups, uptime monitoring, and an allowance of hours for content changes and small fixes. It is always worth asking up front exactly what is included and what counts as a paid extra, so you can compare quotes fairly and avoid surprises on the invoice.',
        },
        {
          q: 'Do you have to pay for maintenance?',
          a: 'The domain and hosting are unavoidable payments if the site is to stay online. A full maintenance service is not formally compulsory, but a site without security updates and backups is exposed to breaches and faults that cost far more to repair than routine maintenance costs to run — which makes it a sound investment rather than a wasted expense.',
        },
        {
          q: 'What is the difference between a domain and hosting?',
          a: 'The domain is the name of the site, the address people type into the browser, and hosting is the server on which the site files are stored and actually run. Both are required: the domain points visitors to the right place, and the hosting serves them the site. Both carry a fixed charge, annual or monthly.',
        },
        {
          q: 'How often does a site need maintaining?',
          a: 'The site should be monitored continuously and security updates installed as they appear — in practice a check and an update at least once a month, alongside an automatic weekly or daily backup. Sites built on popular systems such as WordPress need more frequent updates, because their plugins and themes change constantly and are a common target for attacks.',
        },
      ],
    },
  },

'website-migration-wix-redesign': {
  title: 'Website Migration and Redesign Without SEO Loss',
  excerpt:
    'Old, slow or stuck on Wix? How to migrate and rebuild a website without losing rankings: the safe process, the 301 step and 2026 prices in Israel.',
  tags: ['Website migration', 'Rebuild', 'Wix', 'WordPress', 'Redesign', 'Pricing'],
  content: `**In short (TL;DR):** A website migration is a controlled move of an existing site to a new platform, and a rebuild (redesign) puts an improved site in its place. Keep the domain, map the URLs and set 301 redirects, and you can move without losing the search rankings you have earned. Typical cost in 2026: about ₪5,000 to ₪25,000+.

If your site is slow, looks dated, or is locked into a platform you want to leave (Wix, for instance) — you can move it and rebuild it without losing the search visibility you have built up. The key is an orderly process: keep the domain, map every URL and set 301 redirects from the old pages to the new ones, then move the content across. The cost of a migration plus rebuild in 2026 usually runs from ₪5,000 for a small site to ₪25,000 and up for a full business site.

![Migrating a website off Wix and rebuilding it — a developer working on the code of the new site](/images/blog/website-migration-wix-redesign.webp)

A website migration is a controlled copy of an existing site from one platform or server to another, keeping the digital identity intact — the domain, the content and the search rankings. A rebuild goes a step further: rather than only moving the site, you build a new and better one in place of the old.

## Why migrate or rebuild at all?

- **A ceiling on growth.** Closed platforms limit what you can customise, how fast the site can be and what it can do. As the business grows, the site cannot grow with it.
- **Speed and search.** Old sites are usually slow, and that hurts both the experience and the Google ranking — a subject we set out in the [guide to advanced web development and performance](/en/blog/website-performance-2026).
- **Ownership.** You want to hold the code and the asset yourself, not rent them from a supplier.
- **A dated look.** A site that looks a decade old damages trust — sometimes a design refresh is enough, sometimes a rebuild is needed.

## Why now? The numbers

- **Google holds around 90% of the search market.** [According to StatCounter data](https://gs.statcounter.com/search-engine-market-share), losing organic rankings in a careless migration means losing most of the traffic the site could have.
- **Speed is part of the page experience Google measures.** The [Core Web Vitals](https://web.dev/articles/vitals) metrics affect ranking — and an old, slow site loses out in Google and in conversions alike.
- **Migration cost range in 2026:** about ₪5,000 for a small site up to ₪25,000+ for a full business site, depending on size and complexity.

## How do you avoid losing your rankings? This is the critical part

The big fear about migrating is justified: a careless move can wipe out years of search work. A proper process prevents that:

1. **Map every existing URL** and identify the pages that rank in Google.
2. **Keep the domain** — it stays exactly as it is; only what sits behind it changes.
3. **Set 301 redirects** from each old address to its new equivalent, so that Google and visitors both land in the right place.
4. **Move the content** and preserve the headings and copy that bring in traffic.
5. **Test after the switch** — broken links, speed, indexing in Google and Search Console.

Skipping the redirect step is the mistake most sites fail on — and then the organic traffic falls off a cliff.

## What does a migration or rebuild cost?

| Type of work | What it includes | Price range (2026) |
| --- | --- | --- |
| Design refresh | A better look on the same foundation | ₪3,000–8,000 |
| Migration + rebuild (small site) | New site + migration + redirects | ₪5,000–12,000 |
| Migration + rebuild (business site) | Full site + content + rankings preserved | ₪12,000–25,000+ |

The price depends on the number of pages, how much content has to move, and the complexity involved (a shop, a customer area, integrations). Before deciding, it is worth seeing the full picture in the [2026 website cost guide](/en/blog/website-cost-israel-2026) and choosing the new foundation carefully — see [WordPress versus a coded site](/en/blog/wordpress-vs-custom-code).

## How long does the process take?

A design refresh usually finishes within one to two weeks. Migrating and rebuilding a business site normally takes about 3 to 8 weeks — depending on the number of pages, content approvals and complexity (a shop, integrations, a customer area). The 301 redirects go live on the day of the switch itself, so that search performance and lead flow continue without a break.

## Refresh or rebuild — which should you choose?

If the foundation is sound and the site merely looks dated, a design refresh will do and will cost less. If the site is slow, cannot be extended, is not yours, or is built on a platform that limits you, a rebuild is the right investment. That decision is best made with a supplier who examines the existing site properly, as described in the [guide to choosing a company and the website build process](/en/blog/website-building-services).

---

**Want to move without losing what you have built?** Take a look at the [website build service](/en/services/web-development) from AITERRA, or [talk to us](/en/contact) for a review of your current site and a safe migration plan.

## Further reading

- [WordPress or a coded site? Choosing the right foundation](/en/blog/wordpress-vs-custom-code)
- [What does a small business website cost in Israel in 2026?](/en/blog/website-cost-israel-2026)
- [Building a business website: choosing a company, the process and the cost](/en/blog/website-building-services)`,
  faq: {
    title: 'Frequently asked questions about website migration and rebuilds',
    items: [
      {
        q: 'Will I lose my Google rankings if I migrate the site?',
        a: 'No, provided the migration is done properly. The key is mapping every existing URL and setting a 301 redirect from each old address to its new equivalent, keeping the domain and moving the content across. Skipping the redirect step is the mistake that makes organic traffic collapse, so choose a supplier who runs the process carefully and checks the result afterwards.',
      },
      {
        q: 'What does it cost to migrate and rebuild a website?',
        a: 'In 2026 a design refresh on the existing foundation costs about ₪3,000–8,000, a migration plus rebuild of a small site ₪5,000–12,000, and a full business site ₪12,000–25,000 and up. The price depends on the number of pages, how much content has to move, and complexity such as a shop or a customer area.',
      },
      {
        q: 'Can a site be migrated from Wix to WordPress or to custom code?',
        a: 'Yes. You can leave a closed platform such as Wix for a more flexible foundation that you own, whether WordPress or a coded site. The domain and the content stay with you, and 301 redirects are set from the old addresses to the new ones so that no search visibility is lost. This is one of the most common reasons businesses migrate.',
      },
      {
        q: 'What is the difference between a refresh and a rebuild?',
        a: 'A design refresh improves the look on the same foundation and costs less, which suits a site whose base is sound and that merely looks dated. A rebuild creates an entirely new site, and suits a site that is slow, cannot be extended, is not owned by you, or sits on a platform that limits your growth.',
      },
      {
        q: 'How long does a migration and rebuild take?',
        a: 'A design refresh normally finishes within one to two weeks. Migrating and rebuilding a business site usually takes about 3 to 8 weeks, depending on the number of pages, content approvals and complexity. The 301 redirects are put in place on the day of the switch itself, to keep search performance continuous.',
      },
    ],
  },
},

  'whatsapp-business-api-crm-integration': {
    title: 'WhatsApp Business API to CRM: a setup guide',
    excerpt:
      'Israeli customers send a WhatsApp message, they do not fill in forms. How to connect the WhatsApp Business API to a CRM, step by step, and what it costs.',
    tags: ['WhatsApp', 'CRM', 'Automation', 'WhatsApp API', 'Lead management'],
    content: `**In short (TL;DR):** Connecting the WhatsApp Business API to a CRM turns every incoming WhatsApp message into an automatic lead in the system — nothing falls through, the whole team sees the same conversation history, and replies go out immediately. Setup requires an authorised Meta API provider, a dedicated phone number and business verification, and it usually takes a few days.

In Israel the customer does not fill in a form — they send a WhatsApp message, and according to [Meta](https://www.facebook.com/business) millions of businesses worldwide already talk to their customers through the WhatsApp Business platform. That makes connecting the WhatsApp Business API to your CRM one of the highest-return upgrades a business can make: every conversation enters the system as a lead automatically, no enquiry is lost, and the whole team sees the same history. The connection itself requires an authorised Meta API provider, a dedicated phone number and business verification — and it usually takes a few days.

![A customer sending a WhatsApp message from a mobile phone into a CRM system](/images/blog/whatsapp-business-api-crm-integration.webp)

The WhatsApp Business API is Meta's official programmatic interface for connecting WhatsApp to other systems — a CRM, bots and automations — unlike the ordinary WhatsApp app, which is built for manual conversation from a single device. It is the difference between answering messages by hand and running a system that manages all of your communication automatically.

## Why WhatsApp rather than a form or an email?

The Israeli customer expects an immediate answer on the channel they already use all day. A contact form lands in an inbox that is not always checked in time, and a phone call does not always suit a customer in the middle of their working day. WhatsApp combines the immediacy of chat with a full written record — and once it is connected to a CRM, every message becomes a documented lead you can measure, prioritise and sell through, instead of a conversation that disappears into somebody's inbox.

## What is the difference between the three versions of WhatsApp?

Before connecting anything, it is worth knowing what you are using. There are three options:

| Version | Who it suits | CRM connection |
| --- | --- | --- |
| Ordinary WhatsApp | Personal use | No |
| WhatsApp Business (app) | A very small business answering manually | Very limited |
| WhatsApp Business API | A business that wants automation and a CRM | Yes, full |

The free app is fine to start with, but it runs on one device and does not genuinely connect to other systems. As soon as you have several people on the team, or you want automation, you need the API.

## How do you connect it in practice? The steps

The connection is made through an authorised Meta business solution provider (BSP), not directly. These are the steps:

1. **Choose an API provider and a CRM that connect to each other.** Most of the CRM systems common in Israel support a WhatsApp connection through a provider.
2. **Assign a dedicated phone number.** The number has to be clear of the ordinary WhatsApp app. It can be a new number, or an existing one that has been disconnected from the app.
3. **Verify the business with Meta.** Business Verification confirms that you are a real business — this is the stage that takes the longest.
4. **Connect to the CRM and build the automations.** A message arrives, a lead is opened automatically, it is assigned to a rep, and an immediate first reply goes out.
5. **Get message templates approved.** Business-initiated messages, such as an order confirmation, require a template approved in advance by Meta.

## What does it actually give the business?

Beyond convenience, the connection changes the way leads are handled. Here is what you gain in practice:

- **No lead falls through.** Every WhatsApp enquiry becomes a lead record with a full history — exactly the problem we set out in [the business automation guide](/en/blog/business-automation-crm-whatsapp).
- **An immediate reply, around the clock.** A bot that answers within a second, collects details and hands over to a person only when it needs to.
- **The whole team on the same page.** Instead of a conversation stuck on one employee's phone, the entire history sits in the system and is available to everyone.
- **Measurement.** How many leads came from WhatsApp, what the average response time is, and what share of them close.

## What does it cost, and how do you start properly?

The cost has two parts: a usage fee to the API provider, charged as a monthly subscription, and Meta's messaging rate, charged per conversation. For a small business this is usually a modest monthly expense set against the value — it is worth reading our [analysis of automation cost and ROI](/en/blog/business-automation-cost-roi) to understand the return. The first step is choosing the right CRM, and we have put together a comparison in the [guide to choosing a CRM for a small business in Israel](/en/blog/best-crm-small-business-israel). At Aiterra we recommend defining the process first — which automatic messages go out and at which stage — and only then making the technical connection, so the system works correctly from day one.

---

**Want every WhatsApp enquiry captured automatically?** Take a look at AITERRA's [business automation service](/en/services/development), or [talk to us](/en/contact) and we will build the connection for you.

## Further reading

- [Business automation: how to stop losing leads](/en/blog/business-automation-crm-whatsapp)
- [Which CRM system suits a small business in Israel?](/en/blog/best-crm-small-business-israel)
- [What a WhatsApp bot and business automation cost — and the ROI](/en/blog/business-automation-cost-roi)`,
    faq: {
      title: 'Frequently asked questions about connecting WhatsApp to a CRM',
      items: [
        {
          q: 'What is the difference between WhatsApp Business and the WhatsApp Business API?',
          a: 'The WhatsApp Business app is built for manual replies from a single device and suits a very small business. The WhatsApp Business API is a programmatic interface that connects WhatsApp to CRM systems, bots and automations, lets several agents work in parallel, and suits a business that wants to manage all of its communication and leads automatically and measurably.',
        },
        {
          q: 'Can I connect my existing WhatsApp number?',
          a: 'Yes, but the number has to be disconnected completely from the ordinary WhatsApp app before it is connected to the API, and it cannot be used in both places at once. It is usually more convenient to assign the business a new dedicated number, so personal use stays intact and private communication is kept separate from business communication.',
        },
        {
          q: 'How long does the connection take to set up?',
          a: 'Usually a few days. Most of the time goes on business verification with Meta and on getting the message templates approved, and both depend on how quickly Meta approves them. The technical configuration of the CRM connection itself is relatively fast, and at Aiterra it is a built-in part of the implementation process.',
        },
        {
          q: 'Do messages have to be approved in advance?',
          a: 'Business-initiated messages you send to a customer, such as an order confirmation, an appointment reminder or a delivery update, require a template approved in advance by Meta. Replies to an enquiry the customer started, within a window of 24 hours, need no template and can be sent as free text.',
        },
        {
          q: 'What does it cost to connect the WhatsApp Business API to a CRM?',
          a: 'The cost has two components: a monthly subscription to the authorised API provider, and Meta messaging rates charged per conversation. For a small business this is usually a modest monthly expense set against the value of leads that no longer fall through. It is worth working out the return through an ROI analysis before you start.',
        },
      ],
    },
  },

  'landing-pages-that-convert': {
    title: 'A landing page that converts: why most visitors leave without getting in touch — and how to change it',
    excerpt:
      'Sending expensive traffic to a page that does not do the job? The difference between an ordinary landing page and a conversion-focused one is the difference between a losing campaign and a profitable one.',
    tags: ['Conversions', 'Design', 'Digital'],
    content: `**In short (TL;DR):** A landing page that converts is a focused page with one purpose — turning a visitor who arrived from a campaign into a lead or a customer. It is built on one message, one audience and one action, loads fast and removes every distraction. That is how expensive paid traffic becomes real enquiries.

Every click in a paid campaign costs you real money. The visitor clicked, arrived at the page — and left after a few seconds without leaving their details. In most cases the problem is not the campaign, not the audience and not even your price: the problem is the landing page. The difference between a generic landing page and a conversion-focused one is often the difference between a losing campaign and a profitable one — on exactly the same budget.

![A conversion-focused landing page design on a laptop in a workspace](/images/blog/landing-pages-that-convert.webp)

## What makes a landing page convert

A landing page is not another page on the site. It is a page with one single purpose: to get the visitor to take an action — leave their details, call, or buy. The moment the page has more than one goal, distracting menus and links leading away, the conversion rate collapses. The principle that guides us at Aiterra on every landing page project is simple: one message, one audience, one action.

## How a landing page differs from an ordinary site page

| Characteristic | Conversion-focused landing page | Generic site page |
| --- | --- | --- |
| Purpose | One action: a lead, a call or a purchase | Presenting information and general browsing |
| Navigation | No menu and no distracting links | A full menu and links leading away |
| Message | One message for one audience | Multiple messages for every audience |
| Form | Short: name and phone | Long or general forms |
| Success metric | Conversion rate | Time on page and page views |

## The five components of a winning landing page

**A headline that lands in three seconds:** the visitor has no patience. The main headline has to answer immediately what is in it for them — not who you are, but what you will solve.

**A clear value proposition:** why you specifically? A time-limited offer, a free assessment or a service guarantee — a concrete offer beats general slogans.

**Social proof:** genuine reviews, client logos, numbers and results. The visitor does not believe you — they believe your customers.

**A short, intelligent form:** every additional field lowers the conversion rate. Name and phone — and get to work. Collect the rest in the call.

**Loading speed:** a slow landing page kills campaigns. According to Google's page experience metrics ([web.dev](https://web.dev/articles/vitals)), slow load times damage conversion directly. We build every page in clean code so it loads in milliseconds, including on mobile over a congested network — because that is where most of your visitors are.

## Matching the ad to the landing page

One of the most common reasons for abandonment is a disconnect between what the ad promised and what the visitor finds on the page. If the ad promises "a free consultation" and the page opens with "a little about us", trust breaks within a second. Message match means the headline, the image and the offer on the page continue directly from the promise that brought the visitor. The tighter the match, the higher the conversion rate — and the better the ad quality score in Google Ads, which lowers your cost per click.

## How design leads the eye to the action

Good landing page design is not a matter of beauty but of psychology: a clear hierarchy, a call-to-action button that stands out and repeats down the page, and correct text direction that feels natural. Since most paid traffic arrives on mobile, we design for the small screen first: a large tappable button, readable text without zooming, and a form that can be completed one-handed. Every element on the page has to justify its existence — if it does not advance the conversion, it obstructs it.

## What counts as a good conversion rate

- Below 2%: there is work to do — usually a problem with the message, the form or the page speed.
- Around 3–5%: a healthy range for most sectors and traffic sources.
- Above 7%: excellent performance, mainly with a focused audience and a sharp offer.
- Improving from 2% to 5% means 2.5 times more leads — on exactly the same media budget.

## Test rather than guess

The difference between an amateur agency and a professional one is measurement. We run A/B tests on headlines, offers and buttons, analyse session recordings and heat maps, and measure every action through GA4 ([Google Analytics](https://support.google.com/analytics)). That is how a 2% conversion rate becomes 5%, and your cost per lead is cut in half without adding a shekel to the media budget.

Are your campaigns bringing clicks but not customers? Leave your details and we will analyse your existing landing page — with an orderly list of improvements you can apply this week.

---

**Want a website that works for you?** Take a look at AITERRA's [web development service](/en/services/web-development), or [talk to us](/en/contact) for a scoping call at no cost.

## Further reading

- [UX/UI design that sells: why a beautiful site is not enough](/en/blog/ux-ui-design-conversions)
- [Why is your website slow? The complete 2026 guide to modern web development](/en/blog/website-performance-2026)`,
    faq: {
      title: 'Common questions about landing pages',
      items: [
        {
          q: 'What is the difference between a landing page and an ordinary site?',
          a: 'A site presents everything the business does and allows free browsing between pages, while a landing page focuses on one goal: converting focused traffic from a single source — an ad, a campaign or a post — into one action. So a landing page has no menu and no distracting links, one sharp message and a short form, and it is judged on conversion rate alone.',
        },
        {
          q: 'How many fields should a landing page form have?',
          a: 'As few as possible. In most cases a name and a phone number are enough to open a conversation, and every additional field lowers the conversion rate and drives enquiries away. If you need one more detail to qualify leads, add a single field — the rest is always better collected in the phone call, not in the form.',
        },
        {
          q: 'What is a good conversion rate for a landing page?',
          a: 'It depends on the sector and the traffic source, but as a rule of thumb: below 2% there is work to do, 3–5% is considered good, and above 7% is excellent. The number is affected by traffic quality, the message and page speed. With ongoing A/B testing it is almost always possible to improve the existing rate without increasing the media budget.',
        },
        {
          q: 'How long does a landing page take to build, and when do results appear?',
          a: 'A focused landing page usually goes live within a few working days, depending on the scope of the content and design. First conversion data starts accumulating with the first clicks from the campaign, but reliable optimisation needs enough visitors — usually a few hundred — before drawing conclusions and running an improvement round.',
        },
      ],
    },
  },

  'website-building-services': {
    title: 'Building a business website: how to choose a company, what the process involves and what it really costs',
    excerpt:
      'A new website is a significant investment — and most businesses have no real way to compare proposals. What a professional build includes, the price ranges in Israel, and the questions to ask before signing.',
    tags: ['Development', 'Design', 'SEO', 'WordPress'],
    content: `**In short (TL;DR):** Building a business website is a five-stage process — scoping, design, development, content and launch — priced by scope. In Israel a landing page runs around ₪3,000–7,000, a brochure site around ₪8,000–25,000, and an e-commerce store around ₪20,000–80,000 and up. A dramatically cheap proposal almost always hides a generic template or costs that appear later.

![Building a business website: how to choose a company, what the process involves and what it really costs](/images/blog/website-building-services.webp)

Your website is the only salesperson that works 24/7. When it is slow, dated or not built for mobile, you lose customers to competitors with every second that passes. At Aiterra, as a [web development](/en/services/web-development) company and technology agency, we do not simply design attractive pages — we build foundations for growth. Our build process combines modern server-side technology, a user experience designed to convert, and complete preparation for search engines.

## Which kind of site does your business need?

Every business has its own DNA, which is why scoping is our first and most critical stage. We offer solutions matched to the business model:

**A brochure site:** service providers, law firms, clinics? A business brochure site exists to convey credibility, quality and authority. We build sites for small and large businesses alike, with the emphasis on an interface that leads to a fast and direct enquiry.

**An online store (e-commerce):** a physical shop is excellent, but an online store exposes you to the whole country and beyond. Our experience covers flexible store builds, an intelligent catalogue, an e-commerce site that loads in milliseconds, and smooth, secure payment integration.

## Why a custom site beats a standard platform

Everyone knows WordPress builds, and we certainly offer premium WordPress work — but the real advantage of Aiterra is the ability to develop complex systems. When you have back-end engineers alongside a team of designers working in the same office, a web project becomes far more precise. From user research through to product launch, every line of code is written to serve your bottom line.

## What a website costs in Israel

Market ranges vary by scope and technology, but these are the realistic figures in Israel:

| Type of site | Price range | Suits |
|---|---|---|
| Professional landing page | ₪3,000–7,000 | A paid campaign, a product launch |
| Business brochure site | ₪8,000–25,000 | Most small and medium businesses |
| E-commerce store | ₪20,000–80,000+ | Selling online, depending on catalogue and integrations |
| Custom system | ₪50,000+ | A portal, an account area, automation |

A proposal dramatically below the range almost always hides a generic template, an absence of scoping, or follow-on costs that emerge later.

## Why build for search from the start

Since Google holds roughly 90% of the search market in Israel and worldwide ([StatCounter](https://gs.statcounter.com/search-engine-market-share)), a site built correctly for speed, heading structure and structured data starts with a genuine advantage. Building for search from the outset costs slightly more at the build stage, but saves thousands in code fixes and campaigns later. At Aiterra we build all of these components by default, not as an expensive add-on after launch.

## The questions to ask before signing

- **Who owns the domain, the hosting and the code?** The only right answer: you do. Many businesses discover at the point of separation that their site was rented.
- **Is the site built ready for organic search?** Heading structure, speed, structured data and meta tags — fixing this after the fact costs more than building it correctly.
- **What is included after launch?** A warranty period, response times for faults, and the cost of ongoing changes.
- **How will the site look on a phone?** More than half of visitors in Israel arrive on mobile — ask to see previous work on a smartphone, not in a slide deck.

## What a proper process looks like

An orderly project passes through five stages: scoping (goals, audiences, structure and content — the stage that saves the most money), design (visual language and a conversion-focused user experience), development (clean, fast code), content and search preparation (copy, images, meta and structured data), and launch with measurement (analytics, heat maps and an improvement plan). If the proposal you received has no scoping stage, that is the first warning sign.

Weighing up proposals, or want to know what the site you actually need would cost? Leave your details and we will come back with an honest estimate — including what is not worth paying for.

---

**Want a website that works for you?** Take a look at AITERRA's [web development service](/en/services/web-development), or [talk to us](/en/contact) for a scoping call at no cost.

## Further reading

- [WordPress or a coded site? How to choose the right foundation for your business](/en/blog/wordpress-vs-custom-code)
- [Freelancer or web agency — which is right for your business, and why](/en/blog/freelancer-vs-web-agency)`,
    faq: {
      title: 'Common questions about the website build process',
      items: [
        {
          q: 'What does it cost to build a business website in Israel?',
          a: 'The market range in Israel is roughly ₪3,000–7,000 for a landing page, ₪8,000–25,000 for a brochure site, and ₪20,000–80,000 and up for an e-commerce store. Custom systems start around ₪50,000. The price is set by the number of pages, the level of design, development complexity and whether the site is built for search.',
        },
        {
          q: 'What are the stages in a professional website build?',
          a: 'An orderly project passes through five stages: scoping (goals, audiences and structure), design (visual language and a conversion-focused experience), development (clean, fast code), content and search preparation (copy, meta and structured data), and launch with measurement (analytics and an improvement plan). The absence of a scoping stage in a proposal is the first warning sign.',
        },
        {
          q: 'Will the site be ready for organic search?',
          a: 'Unambiguously yes, and it is our central added value. Every project includes the foundations for search — speed, heading structure, structured data and meta tags — which saves you thousands in future code fixes and turns the site into an asset that produces work on an ongoing basis.',
        },
        {
          q: 'What should I ask a supplier before signing?',
          a: 'Confirm four things: that the domain, the hosting and the code will be entirely yours; that the site is built ready for organic search; exactly what is included after launch (warranty, response times and the cost of changes); and how the site looks on a real phone rather than in a slide deck. A proposal with no scoping stage, or without code ownership, is a red flag.',
        },
        {
          q: 'Do you provide hosting as well?',
          a: 'Yes. Every build has to sit on a strong server. We offer hosting on modern cloud infrastructure, to make sure the site stays available and fast even under campaign load, rather than buckling at the moments that matter most to the business.',
        },
      ],
    },
  },

  'business-automation-12-processes': {
    title: 'Business automation for a small business: 12 processes to stop doing by hand',
    excerpt:
      'Every small business wastes tens of hours a month on repetitive tasks that could be automated. Twelve concrete processes to stop doing manually — and free the time for what actually grows the business.',
    tags: ['Automation', 'Small business', 'Efficiency', 'Lead management', 'Time saving'],
    content: `**In short (TL;DR):** Business automation is defining rules of the form "when X happens, do Y automatically", so repetitive tasks run without anyone touching them. In a small business, automating lead capture, first response, follow-ups and reminders saves tens of hours a month, prevents lost leads — and frees time and attention for growth.

Every small business wastes tens of hours a month on repetitive, predictable tasks — typing in leads, chasing follow-ups, sending reminders, issuing invoices. The good news: most of them can be automated today with accessible tools. Here are twelve processes worth stopping by hand, to free time and attention for what actually grows the business.

![Business automation for a small business — a robotic arm performing a task carefully](/images/blog/business-automation-12-processes.webp)

Business automation means defining "when X happens, automatically do Y", so repetitive tasks run without human touch. The purpose is not to replace people, but to free them from mechanical work in favour of work that requires human judgement.

## The 12 processes worth stopping by hand

1. **Capturing leads into the system.** Every enquiry — from a form, from WhatsApp, from an ad — enters the CRM automatically, with no typing.
2. **An immediate first response.** An automatic "we have received your enquiry" message, even at two in the morning.
3. **Following up leads that did not close.** An automatic reminder or message to a client who never came back.
4. **Appointment reminders.** An automatic reminder that dramatically reduces no-shows.
5. **Issuing invoices and receipts.** A connection between the sales system and the accounting software.
6. **Requesting a review.** An automatic message after the service, asking for a Google review.
7. **Tagging and routing leads.** Automatic assignment of a lead to the right representative by type or region.
8. **Status updates to the client.** "Your order has shipped" / "the work is complete" — automatically.
9. **Collecting details before a call.** A bot that gathers the basics so the representative arrives prepared.
10. **Weekly reports.** A performance report that arrives by email automatically, without building it by hand.
11. **Calendar sync and scheduling.** A booking link that syncs with the calendar without the back and forth.
12. **Abandoned cart recovery.** In a store — an automatic reminder to anyone who did not complete the purchase.

## The difference between doing it by hand and automating it

Here are the five highest-return processes, before automation and after:

| Process | By hand | After automation | Typical tool |
|---|---|---|---|
| Lead capture | Manual typing from every channel, leads falling through the cracks | Every enquiry enters the system automatically | CRM |
| First response | The client waits hours for an answer | An immediate acknowledgement, 24/7 | WhatsApp + CRM |
| Appointment reminders | Manual phone calls, a high no-show rate | An automatic reminder before the appointment | SMS / WhatsApp |
| Issuing invoices | Double entry between systems | The invoice is created automatically when the deal closes | Accounting software |
| Weekly reports | Built by hand every week | A performance report arrives by email automatically | GA4 / CRM |

As an illustration only: if following up each lead manually takes around 10 minutes, and a business receives around 100 leads a month, that is roughly 16 hours of work — before counting reminders, invoicing and reports. Automation returns most of that time, and at the same time prevents the leads that get forgotten and never answered. The exact saving depends on the business, but the direction is almost always the same: less mechanical work, more deals closed.

## How to know what to automate first

The rule is simple: **automate first what repeats and hurts most.** Look for tasks meeting three conditions — they recur (daily or weekly), they are predictable (the same process every time), and they take time. That is where the return is fastest. It is also worth setting up basic measurement of your lead sources so you know which channel genuinely produces deals — and automate that one first.

## What you need to get started

The heart of most automations is a good CRM that the other tools connect to, so the first step is choosing it correctly. Much of the value happens through WhatsApp — the channel where most customers in Israel already are — so connecting WhatsApp to the CRM is usually the second step. There is no need to automate everything in one day: start with one painful process, and expand.

---

**Want to stop doing by hand what a machine could do?** Take a look at AITERRA's [development and automation service](/en/services/development), or [talk to us](/en/contact) and we will map together what is worth automating first.

## Further reading

- [Custom web systems: client portals, account areas and tools that save a full-time role](/en/blog/custom-web-systems)
- [Why is your website slow? The complete 2026 guide to modern web development](/en/blog/website-performance-2026)`,
    faq: {
      title: 'Common questions about automation for a small business',
      items: [
        {
          q: 'What should a small business automate first?',
          a: 'Automate first what repeats, is predictable and takes time. Usually the fastest return is in automatic lead capture into the system, an immediate first response, and following up leads that did not close — that is where the most money falls between the chairs and customers go to competitors.',
        },
        {
          q: 'Does business automation replace employees?',
          a: 'No. The purpose is to free employees from mechanical, repetitive tasks (data entry, reminders, follow-ups) in favour of work that requires human judgement, such as closing deals and personal service. Automation increases the output of the existing team — the same team handles more clients without burning out.',
        },
        {
          q: 'What do you need to start automating?',
          a: 'The foundation is a good CRM that the other tools connect to, and in most businesses in Israel a WhatsApp connection as well. You do not need to automate everything at once — start with one painful process that consumes a lot of time, measure the saving, and expand gradually to further processes.',
        },
        {
          q: 'How much time does business automation actually save?',
          a: 'It depends on the business, but recurring processes such as lead capture, reminders and issuing invoices easily consume tens of hours a month when done by hand. Automating them returns that time — and also prevents human error and leads that are forgotten and never answered in time.',
        },
      ],
    },
  },

  'ecommerce-store-that-sells': {
    title: 'Building an online store that sells: the complete guide to profitable e-commerce in 2026',
    excerpt:
      'Most online stores are a handsome window display with a quiet till. Cart abandonment, awkward checkout and poor-quality traffic — here is how to fix the three problems choking your sales.',
    tags: ['E-commerce', 'Development', 'Digital'],
    content: `**In short (TL;DR):** A store that sells is not a handsome window display but a selling system: a fast site, a short checkout with local payment methods, automation to recover abandoned carts, and quality traffic. Fixing the three points of friction — speed, payment and traffic — is what turns visitors into real revenue.

A physical shop is limited by opening hours, by location and by how many customers walk through the door. An online store sells 24/7, across the country, even while you sleep. But here is the truth that gets discussed less: most online stores in Israel do not really sell. They exist, they look good, but the till is quiet. After guiding dozens of digital projects, we at Aiterra know exactly what separates a store that produces real revenue from an expensive digital window display.

![A customer paying by credit card while shopping in an online store](/images/blog/ecommerce-store-that-sells.webp)

## Why most online stores do not sell

It is almost always one of three problems: the store is slow (every second of waiting costs conversion rate and damages Core Web Vitals scores), the checkout is awkward (too many steps, a forced registration, surprises in the shipping price), or there simply is no quality traffic. The good news: all three are fixable — and the fix pays back quickly.

## How much money is actually left on the floor?

Cart abandonment is the largest leak in e-commerce. According to the [Baymard Institute](https://baymard.com/lists/cart-abandonment-rate), the average cart abandonment rate worldwide stands at roughly 70%, and in Israel the numbers are similar or higher. In plain figures:

- For every 10 customers who add a product to the cart, around 7 leave moments before paying.
- Every unnecessary field in the checkout and every surprise in the shipping price increases the abandonment rate.
- Recovery automation — a reminder email and a WhatsApp message with a direct link back to the cart, sometimes with a small voucher — brings back a meaningful share of those who left. It is the automation with the fastest return in e-commerce.

## Fast payment: what the customer expects

Customers want to pay however suits them: credit card, Bit, Apple Pay or Google Pay — in one tap and without creating an account. Every point of friction in checkout costs you sales. When we build a store, the payment page receives the greatest attention: a minimum of fields, secure processing, and complete transparency about the shipping cost from the start — with no surprises at the final step.

## Which platform to choose

There is no single platform that suits everyone — the choice depends on catalogue size, the complexity of the business logic and the integrations you need. The table below summarises the three common routes:

| Parameter | Ready-made platform (Shopify) | WooCommerce | Custom development |
| --- | --- | --- | --- |
| Suits | A small to medium catalogue | A business with an existing WordPress site | A large catalogue / complex logic |
| Design flexibility | Medium | High | Complete |
| Initial cost | Low to medium | Medium | High |
| Inventory / CRM connection | Limited to plugins | Good | Full, no ceiling |
| Speed (Core Web Vitals) | Depends on the theme | Depends on the plugins | Optimal |

For a small store with a simple catalogue, a ready-made platform is enough. As the catalogue grows or promotion logic and deep system connections are required, custom development gives speed, flexibility and control a template will not reach.

## Traffic that sells: bringing visitors who buy

A store without traffic is a warehouse. Since [Google holds roughly 90% of the search market](https://gs.statcounter.com/search-engine-market-share), the growth strategy starts with organic search for category and product pages — including structured data that shows price and stock directly in Google's results. That is complemented by Google Shopping campaigns and social remarketing that brings interested visitors back to the store. That is how you build a selling machine that does not depend on a single traffic source.

## Behind the scenes: the automation that saves a full-time role

A successful store is also operations: stock updates, invoices, shipping labels and keeping the customer informed about order status. We connect all the systems — payments, inventory, shipping and CRM — into one automatic process, so you deal with products and customers rather than spreadsheets. The result: fewer human errors, faster dispatch and a customer informed at every stage, which reduces support enquiries and increases the share of returning customers.

Dreaming of a store that genuinely sells, or have a store that is not taking off? Leave your details and we will come back with an orderly plan of action — from scoping through to the first sale.

---

**Want a store that works for you?** Take a look at AITERRA's [e-commerce service](/en/services/ecommerce), or [talk to us](/en/contact) for a scoping call at no cost.

## Further reading

- [Why is your website slow? The complete 2026 guide to modern web development](/en/blog/website-performance-2026)
- [UX/UI design that sells: why a beautiful site is not enough](/en/blog/ux-ui-design-conversions)`,
    faq: {
      title: 'Common questions about building an online store',
      items: [
        {
          q: 'Which platform should I build an online store on?',
          a: 'It depends on scale and complexity. For a small store with a simple catalogue, a ready-made platform such as Shopify is enough. For a store with a large catalogue, complex promotion logic or a deep connection to inventory and CRM systems, custom development gives speed, flexibility and control that a template cannot reach. The simple rule: the more complex the business logic, the greater the advantage of purpose-built development.',
        },
        {
          q: 'How much does it cost to build an online store?',
          a: 'The range is wide and depends on the number of products, the design and the integrations required (payments, inventory, shipping). A short scoping call gives an accurate proposal — and more importantly, makes sure the budget is divided properly between the build and the marketing that will bring the customers. A beautiful store with no marketing budget stays a quiet window display.',
        },
        {
          q: 'How do you reduce cart abandonment?',
          a: 'A combination of a short checkout, fast payment methods such as Bit and Apple Pay, complete transparency about shipping costs from the start of the process, and recovery automations — an email and a WhatsApp message with a direct link back to the cart. Since the average abandonment rate is around 70%, each of these steps raises completion measurably.',
        },
        {
          q: 'Which payment methods are essential for a store in Israel?',
          a: 'The minimum is credit cards and Bit, and preferably Apple Pay and Google Pay for one-tap payment from a phone. The more local and fast methods you offer, the lower the friction at payment and the higher the conversion rate. It is important to make sure processing is secure and that the shipping cost is shown transparently before the payment step.',
        },
        {
          q: 'Does an online store need organic search (SEO)?',
          a: 'Absolutely. Google holds roughly 90% of the search market, and a large share of buying journeys start with a product search. Organic search for category and product pages, together with structured data showing price and stock in the results, brings quality traffic cheaply over time — unlike paid advertising, which stops the moment you stop paying.',
        },
      ],
    },
  },

  'website-security-guide': {
    title: 'Website security: protecting your site, your customers and your reputation',
    excerpt:
      'A hacked site is not only technical damage — it is lost trust, damaged rankings and sometimes legal exposure. SSL, backups, updates and form protection: the practical guide for business owners.',
    tags: ['Security', 'Development'],
    content: `**In short (TL;DR):** Website security is the set of measures protecting your business site from intrusion, data theft and defacement. The essential baseline is an SSL certificate (HTTPS), regular updates, automatic backups and form protection — and the strongest and cheapest defence of all is a clean architecture that reduces the attack surface in advance.

Most business owners think a site breach is something that happens to large companies. The reality is the opposite: small business sites are the preferred target, precisely because attackers know nobody is watching them. And a breach is not only a technical matter — a site distributing spam gets buried in Google, customers whose details leaked do not come back, and in some cases there is legal exposure under privacy law.

![A laptop screen showing cyber protection and information security](/images/blog/website-security.webp)

## The baseline you cannot skip: HTTPS, updates and backups

**An SSL certificate (HTTPS):** if your site still runs on HTTP, the browser shows visitors a "not secure" warning and Google marks you down. It is the first step, the cheapest, and an official ranking signal Google confirms.

**System and plugin updates:** most breaches exploit known security holes in old plugins. A WordPress site with twenty un-updated plugins is an open door with a welcome sign on it. Keeping the core and the plugins current closes most of those holes before anyone tries to use them.

**Automatic backups:** the question is not whether you will need a backup, but when. An automatic daily backup stored off the server turns a disaster of days into an inconvenience of an hour, and lets you get back online quickly after a breach or a server fault.

## The layers every business site needs

| Layer of protection | What it protects against | Urgency |
|---|---|---|
| SSL / HTTPS certificate | Traffic interception, "not secure" warnings, ranking damage | Critical — immediate |
| System and plugin updates | Exploitation of known holes in old code | High — ongoing |
| Automatic daily backup | Data loss and prolonged downtime after a fault or breach | High |
| Form validation and rate limiting | Code injection, spam floods and data theft | High |
| Clean architecture (few plugins) | Reducing the overall attack surface in advance | Strategic |

## Why forms are the attacker's front door

Every form on the site — contact, registration, payment — is a potential point of entry. Without proper input validation, an attacker can inject malicious code, steal data, or flood you with thousands of spam enquiries that drown the real leads. Proper protection means server-side input filtering, request rate limiting and anti-bot mechanisms that do not damage the experience for genuine visitors. Simple techniques such as a honeypot field or CAPTCHA verification block a significant share of automated bots without burdening the real customer.

## How much does a breach actually cost the business?

The greatest damage is usually commercial rather than technical. [Google holds roughly 90% of the search market](https://gs.statcounter.com/search-engine-market-share) in Israel and worldwide, so almost all of your organic traffic comes through it. According to [Google's official documentation](https://developers.google.com/search/docs), sites that have been hacked and distribute malicious content can receive a warning label in search results and even be removed from the index. In other words, a single breach can wipe out your main source of customers at a stroke — on top of the direct damage of data theft, downtime and reputational harm.

## What to do if the site has already been breached

1. **Isolate immediately:** put the site into maintenance mode to stop the damage to visitors and prevent malicious content spreading.
2. **Restore from a clean backup:** return to a backup point you are confident was not compromised.
3. **Change passwords and permissions:** reset every administrative, hosting and database password.
4. **Close the hole:** update the core and the plugins, and remove any suspicious code or files.
5. **Request a review:** ask Google to re-examine the site through Search Console so the security warning is lifted.

## The advantage of a site written in clean code

Here is a confession: a large part of our security work is architectural prevention. A site built in modern code, without dozens of third-party plugins, with a proper separation between interface and server, simply offers far less attack surface. In the systems we build in Next.js, most common attack vectors are blocked at the infrastructure level, and the site receives security updates routinely without breaking anything. Fewer dependencies means fewer emergency updates, fewer known vulnerabilities and fewer points of failure an attacker can use.

Not sure when anyone last checked your site's security? Leave your details and we will run a basic security scan — better to find the holes before somebody else does.

---

**Want a website that works for you?** Take a look at AITERRA's [web development service](/en/services/web-development), or [talk to us](/en/contact) for a scoping call at no cost.

## Further reading

- [Why is your website slow? The complete 2026 guide to modern web development](/en/blog/website-performance-2026)
- [Custom web systems: client portals, account areas and tools that save a full-time role](/en/blog/custom-web-systems)`,
    faq: {
      title: 'Common questions about website security',
      items: [
        {
          q: 'How do I know if my site has been hacked?',
          a: 'Common signs: the site suddenly slows down, redirects to unfamiliar sites appear, Google shows a security warning beside your result, or an alert arrives in Search Console. The safest approach is a periodic security scan, which finds malicious code and suspicious files before the damage is noticed by visitors or by Google.',
        },
        {
          q: 'Is an SSL certificate enough to make a site secure?',
          a: 'No. An SSL certificate encrypts communication between the visitor and the site and prevents interception, but it does not protect against a server breach, compromised plugins or forms without validation. It is a necessary baseline that also affects Google ranking, but full security also requires ongoing updates, backups and protection of the input points on the site.',
        },
        {
          q: 'How much does it cost to secure a site?',
          a: 'The baseline — SSL, automatic backups and regular updates — is very cheap and usually already included with quality hosting. More advanced protection depends on the complexity of the site and the sensitivity of the data it collects. Either way the cost is negligible against the damage of a single breach: downtime, lost customers, damaged Google rankings and sometimes legal exposure under privacy law.',
        },
        {
          q: 'Is a WordPress site less secure than a custom coded one?',
          a: 'WordPress itself is safe; the risk comes mainly from the volume of third-party plugins that are not always maintained — every old plugin is a potential security hole. A custom coded site, for example in Next.js, offers a far smaller attack surface. On any platform, it is ongoing updates, backups and form protection that determine the actual level of security.',
        },
      ],
    },
  },

  'ux-ui-design-conversions': {
    title: 'UX/UI design that sells: why a beautiful site is not enough, and what actually lifts conversions',
    excerpt:
      'A site can be stunning and sell nothing. The difference is in the user experience: clear hierarchy, an intelligent customer journey and design that leads to action — not just impresses the eye.',
    tags: ['Design', 'Conversions', 'UX'],
    content: `**In short (TL;DR):** UX/UI design that sells is the engineering of a customer journey, not decoration. A site converts when the logic (UX) and the visual design (UI) work together to lead the visitor without friction toward the intended action — rather than merely impressing the eye.

There are beautiful sites that sell nothing, and plain sites that produce leads without pause. The difference is not how impressive the site is — it is how clear it is. Professional UX/UI design is not decoration: it is the engineering of a customer journey, and it starts with one question — what does the visitor need to do on this page, and what is stopping them?

![A designer sketching user interface wireframes for an application](/images/blog/ux-ui-conversions.webp)

## UX versus UI: the difference, and why both are critical

User experience (UX) is the logic: how the journey is built from arriving on the site through to leaving contact details, which pages exist, the order of the information and where each button sits. User interface (UI) is the visual expression: colour, typography, spacing and animation. An impressive UI without intelligent UX is a beautiful site that confuses; intelligent UX with weak UI is a convenient site that does not convey credibility. Conversions arrive only when the two work together.

| Aspect | UX — user experience | UI — user interface |
|---|---|---|
| What it is | The logic and the journey | The visual expression |
| Covers | Structure, order of information, button placement | Colour, typography, spacing, animation |
| The central question | Is the action easy to complete? | Does it look credible and professional? |
| When it is missing | A convenient site that conveys no credibility | A beautiful site that confuses |

## The design principles that actually move the needle

Design that converts rests on a few principles that recur in every successful project. These are the four central ones:

**Visual hierarchy:** the eye scans, it does not read. A strong headline, a supporting subheading and a prominent button — in that order. If everything shouts, nothing is heard.

**Reducing friction:** every unnecessary click, long form or confusing menu burns conversion rate. The shortest route to the action wins.

**Consistency and trust:** uniform design, correct right-to-left rendering in Hebrew, and reviews in the right places — all of it conveys professionalism the visitor feels without noticing.

**Mobile first:** most of your visitors arrive on a phone. If the mobile experience is a squeezed version of the desktop rather than a design in its own right, you are losing most of them.

## How much does design really affect conversions? The numbers

Design is not measured by feel but by data, and three figures explain why it affects the bottom line directly:

- **Mobile first:** most browsing traffic worldwide now arrives from mobile devices, so a design that was not planned for the phone first misses the bulk of the audience.
- **Speed equals conversions:** according to [Google's web.dev](https://web.dev/articles/vitals), meeting the Core Web Vitals — load speed, visual stability and responsiveness — improves user experience and reduces abandonment.
- **Organic search:** Google holds roughly [90% of the search market](https://gs.statcounter.com/search-engine-market-share), so fast design that keeps visitors on the site supports organic ranking directly as well.

## The design mistakes worth avoiding

Most sites that fail to convert fall into the same recurring traps. Avoiding them alone improves results:

- **A weak or hidden call to action:** if the visitor has to hunt for where to leave their details, they will not leave them.
- **Forms that are too long:** every unnecessary field lowers the conversion rate. Ask only for what you genuinely need now.
- **Text that is a wall of words:** long paragraphs without subheadings or emphasis drive the eye away.
- **Ignoring mobile:** a design built for desktop and then compressed onto a phone damages exactly the largest audience.

## Designing by data rather than personal taste

The best decisions come from real visitor behaviour: heat maps showing where people click, session recordings revealing where they get stuck, and A/B tests that settle design arguments with numbers. Instead of arguing about what looks better, let the data decide. At Aiterra we put every design project through those lenses — because the goal is not a site that impresses designers, but a site that converts customers.

Feel like your site is beautiful but not working? Leave your details and we will run a professional UX analysis showing exactly where your visitors are getting lost.

---

**Want a website that works for you?** Take a look at AITERRA's [web development service](/en/services/web-development), or [talk to us](/en/contact) for a scoping call at no cost.

## Further reading

- [Why is your website slow? The complete 2026 guide to modern web development](/en/blog/website-performance-2026)
- [WordPress or a coded site? How to choose the right foundation for your business](/en/blog/wordpress-vs-custom-code)`,
    faq: {
      title: 'Common questions about UX/UI design',
      items: [
        {
          q: 'What is the difference between UX and UI?',
          a: 'UX is the design of the experience and the visitor journey — the structure, the logic and the order of actions from arrival through to conversion. UI is the visual design of that journey: colour, typography and components. UX determines whether it is easy to act, and UI determines whether it looks credible. Only when both work together does the visitor leave their details rather than leaving the site.',
        },
        {
          q: 'Is a redesign of an existing site worth it?',
          a: 'A rebuild is not always necessary. Sometimes targeted improvements — a more prominent button, a shorter form, a clearer hierarchy — lift conversions by tens of percent at low cost. The rule is to start with an analysis of visitor behaviour rather than with design: first understand where people are being lost, then decide between a full redesign and a targeted fix.',
        },
        {
          q: 'How does design affect organic ranking in Google?',
          a: 'Google measures behavioural signals: time on page, bounce rate and returns to the search results. Good, fast design keeps visitors on the site and signals that the content meets the expectation. Meeting the Core Web Vitals is also part of the page experience Google rewards, which is why design and organic search are two sides of the same coin.',
        },
        {
          q: 'How do you know a new design has actually succeeded?',
          a: 'You measure rather than guess. Before launch you set a clear target — conversion rate, number of leads or time on page — and compare it against historical data. Tools such as GA4, heat maps and A/B tests show whether the new version produces more actions. A successful design is one the numbers confirm, not one that merely looks good.',
        },
      ],
    },
  },

  'freelancer-vs-web-agency': {
    title: 'Freelancer or web agency — which is right for your business, and why',
    excerpt:
      'A freelancer costs less, an agency gives you more security — but when is each the right call? An honest comparison of freelancer versus web agency: price, availability, breadth, risk and continuity.',
    tags: ['Web development', 'Freelancer', 'Digital agency', 'Comparison', 'Small business'],
    content: `**In short (TL;DR):** A freelancer is a single supplier — cheaper and more flexible, and excellent for a focused task on a limited budget. A web agency provides a full team (design, development, content and search), project management and continuity. The larger, longer-term and more business-critical the project, the more the choice tilts toward an agency.

There is no single answer to "freelancer or agency" — there is what suits your project. A good freelancer is usually cheaper and more flexible and excellent for a focused task; an agency gives you professional breadth (design, development, content and search under one roof), continuity and cover when someone drops out. The simple rule: the larger, longer-term and more business-critical the project, the more the balance tilts toward an agency.

![A freelancer working on a laptop against the option of an agency — which is better for building a business website](/images/blog/freelancer-vs-web-agency.webp)

The essential difference is not "one person versus many people" but **where overall responsibility lands**. With a freelancer you, the client, are usually also the project manager — you are the one coordinating between the designer, the developer and the copywriter. At an agency, project management and responsibility for the overall result are part of the service. So the decision rests on five axes: price, professional breadth, availability, management and continuity — and the weight of each shifts with the size of the project and how critical it is to the business.

## Freelancer versus agency — where they genuinely differ

| Criterion | Freelancer | Agency |
| --- | --- | --- |
| Price | Usually lower | Higher, but includes management and breadth |
| Professional breadth | One specialism (design or code) | Design, development, content and SEO together |
| Availability | Depends on one person's workload | A team that covers, with defined response times |
| Project management | Usually on you | Part of the service |
| Continuity | A risk if the freelancer disappears | Continues without any specific person |
| Suits | A focused task, a limited budget | A full project, long-term growth |

## When a freelancer is the right choice

- **The budget is limited** and the project is small and well defined — a single landing page, a design fix, a specific update.
- **You know exactly what you want** and do not need strategic guidance, only execution.
- **You have the time and the ability to manage** — to coordinate, review and connect the parties yourself.
- **The task sits in one specialism** — design only, or copywriting only.

The main risk: availability and continuity. When a single freelancer is ill, overloaded or simply stops answering, the project stalls — and sometimes you are left without access to the code or the site.

## When an agency is the better choice

- **The project is full and complex** — a brochure site or a store that needs design, development, content and search working together.
- **The site is critical to the business** and you need guaranteed availability and response times, not "I will get back to you".
- **You want a long-term partner** who will still be there next year for maintenance, extensions and automation.
- **You have no time to manage it** — you want one party taking responsibility for the overall result.

The great advantage of an agency is that all the specialists talk to each other. When the designer, the developer and the SEO lead sit together, the site comes out fast, well designed and ready to rank — without the game of broken telephone that happens when you coordinate between several separate freelancers. And this is not only an aesthetic matter: since [Google holds roughly 90% of the search market](https://gs.statcounter.com/search-engine-market-share), a site built without search and performance designed in from the foundations starts life at a disadvantage against competitors. A professional team builds the site on [Google's official user experience metrics](https://web.dev/articles/vitals) — so it launches fast and ready to rank on day one.

## And what about do-it-yourself platforms?

There is a third option — building it yourself on Wix or similar. It is the cheapest in money, and the most expensive in time and in the ceiling it puts on growth. For a business testing an idea on a zero budget it is a legitimate start, but the moment the site becomes central to the business, moving to a professional supplier is close to inevitable — and sometimes costs more than building properly in the first place, because it has to be dismantled and rebuilt. We covered the difference between foundations in depth in the [WordPress versus coded site guide](/en/blog/wordpress-vs-custom-code).

Whoever you choose — freelancer or agency — the rules for spotting a reliable supplier are the same. It is worth reviewing the red flags before signing any proposal.

---

**Not sure which suits you?** Tell us about the project through the [contact page](/en/contact), and we will tell you honestly whether it is a case for a freelancer or an agency — whether that is us or not. Take a look at AITERRA's [web development service](/en/services/web-development).

## Further reading

- [WordPress or a coded site? How to choose the right foundation for your business](/en/blog/wordpress-vs-custom-code)
- [Custom web systems: client portals, account areas and tools that save a full-time role](/en/blog/custom-web-systems)`,
    faq: {
      title: 'Common questions about freelancers versus web agencies',
      items: [
        {
          q: 'Which is cheaper — a freelancer or a web agency?',
          a: 'A freelancer is cheaper in most cases, because there are no team and management costs behind them. But the low price does not always pay off: on a complex project, the absence of management and professional breadth can cost dearly in time, in fixes and in missed opportunities. Compare cost against value, not only the numbers.',
        },
        {
          q: 'What is the big risk in working with a freelancer?',
          a: 'Availability and continuity. When a single freelancer is ill, overloaded or stops answering, the project stalls — and sometimes you are left without access to the code or the site. An agency covers itself with a team and defined response times, so the work continues without any specific person, and still continues next year.',
        },
        {
          q: 'When is a freelancer actually the better choice?',
          a: 'When the budget is limited, the project is small and clear (a landing page, a specific fix), you know exactly what you want, and you have the time and ability to manage and coordinate yourself. For a focused task in a single specialism — design only, or copywriting only — a good freelancer is an excellent and cost-effective choice.',
        },
        {
          q: 'Why does an agency produce a better site on a complex project?',
          a: 'Because the designer, the developer and the search lead work together and talk to each other. The site comes out fast, well designed and ready to rank without the broken telephone that happens when coordinating between several separate freelancers, and responsibility for the overall result sits with one party you can hold to it.',
        },
        {
          q: 'Can we start with a freelancer and move to an agency later?',
          a: 'Yes, and it is a common path. Many businesses start with a freelancer for a first version and move to an agency once the site becomes central to the business. To make that transition smooth, confirm in advance that you own the code, the domain and access to every account — so you are not dependent on any single supplier.',
        },
      ],
    },
  },

  'website-performance-2026': {
    title: 'Why is your website slow? The complete 2026 guide to modern web development',
    excerpt:
      'A slow site burns your budget and drives customers away. The complete guide to modern web development — clean code, Next.js, Core Web Vitals, and when to upgrade versus rebuild.',
    tags: ['Performance', 'SEO', 'Development', 'Core Web Vitals'],
    content: `**In short (TL;DR):** Website performance is the loading speed and stability a visitor experiences, and it affects conversion rate and SEO ranking directly. In 2026 a fast site is built on clean code and modern technology such as Next.js and React; when an old template is dying, rebuilding beats papering over it with another plugin.

![Why is your website slow? The complete 2026 guide to modern web development](/images/blog/website-performance-2026.webp)

You invest heavily in paid campaigns and produce excellent content, but when visitors click the link — they wait. And wait. In an era where patience is measured in milliseconds, a slow site burns your budget and drives customers away. If you have reached the point of considering an upgrade to your [website](/en/services/web-development) or building an entirely new system, you are in the right place.

## Why old platforms and plugin sprawl hurt performance

Many business sites were originally built on heavy templates that load the server. When WordPress speed collapses under an excess of plugins or inefficient code, the conversion rate collapses with it.

Business owners look for sticking plasters. They try to improve their WordPress speed with one more cache plugin. But sometimes, when the core of the site is outdated, that effort simply is not enough. In those cases it becomes clear that the site needs upgrading from the foundations, or moving to modern technology built for 2026 standards.

## Why speed matters right now — the numbers

Google defines a "fast" site by three [Core Web Vitals](https://web.dev/articles/vitals) metrics. These are the thresholds worth remembering:

- **LCP (largest contentful paint):** under 2.5 seconds.
- **INP (interaction to next paint):** under 200 milliseconds.
- **CLS (cumulative layout shift):** a value below 0.1.
- **Market share:** Google holds [roughly 90% of the search market](https://gs.statcounter.com/search-engine-market-share), so every performance improvement affects your visibility to almost your entire audience.

## Clean code: how we approach development at Aiterra

To achieve extreme performance you have to separate what the visitor sees from the engine running behind the scenes. As an agency specialising in modern technology, our approach is built on the leading stack (Next.js, React, Node.js, Python):

**Front-end development:** we use advanced libraries such as React and Next.js rather than heavy ready-made templates. The result is an interface that loads in close to zero time and delivers an experience as smooth as a native app.

**Back-end development:** the brain of the system. Using Python and Node.js we handle fast data processing, secure communication with the databases, and intelligent automations that do not delay page load.

That combination lets us deliver complex web applications, fast e-commerce stores, and management systems built to the exact measurements of your business.

## How site speed affects organic search

Google has said it plainly: speed and page experience are a critical ranking factor, through the Core Web Vitals metrics. Every optimisation affects your position in search results directly.

When we upgrade a site we are not only improving how it looks — we are making it the best friend of the search engines. Improving speed lowers the bounce rate and signals to Google that visitors are enjoying the content. A fast site written in clean code saves you thousands in paid search, because your quality score rises and the cost per click falls.

## When to upgrade and when to rebuild

This is the million-shekel question. The table below summarises the difference:

| Parameter | Upgrading an existing site | Rebuilding (Next.js / React) |
|---|---|---|
| When it fits | The architecture is sound and only needs targeted optimisation | The core is outdated, the site buckles under load or is hard to maintain |
| Initial cost | Low to medium | Medium to high |
| Time to deliver | Days to weeks | Weeks to months |
| Performance ceiling | Limited by the existing foundation | High — green Core Web Vitals |
| Fit to 2026 standards | Partial | Full |

If the site works well and only needs a nudge, a targeted optimisation will do the job. But if the system buckles under visitor load, content is hard to update, or it simply does not connect to your marketing tools — it is time for a new technical foundation.

At Aiterra we start every project with a deep diagnostic. We examine your existing architecture, map the failures, and propose the most cost-effective and appropriate route for your business growth. Does your site feel slow or dated? Do not let competitors overtake you on the bend. Leave your details and the Aiterra team will run a comprehensive performance audit and build you a strategy that wins.

---

**Want a website that works for you?** Take a look at AITERRA's [web development service](/en/services/web-development), or [talk to us](/en/contact) for a scoping call at no cost.

## Further reading

- [WordPress or a coded site? How to choose the right foundation for your business](/en/blog/wordpress-vs-custom-code)
- [Freelancer or web agency — which is right for your business, and why](/en/blog/freelancer-vs-web-agency)`,
    faq: {
      title: 'Common questions about site performance and modern development',
      items: [
        {
          q: 'What counts as a good site speed by Google in 2026?',
          a: 'Google measures speed through the Core Web Vitals. A site is considered fast when the main content loads (LCP) in under 2.5 seconds, interaction responsiveness (INP) is below 200 milliseconds, and visual stability (CLS) is under 0.1. Meeting all three improves both user experience and organic ranking.',
        },
        {
          q: 'Why is my WordPress site slow and how do I fix it?',
          a: 'In most cases the slowness comes from plugin sprawl, a heavy theme and inefficient code loading the server. A cache plugin gives temporary relief, but when the core of the site is outdated the fix is limited. Real improvement means clearing unnecessary plugins, optimising images and the database, and sometimes moving to modern technology such as Next.js.',
        },
        {
          q: 'Is it better to upgrade an existing site or rebuild it?',
          a: 'If the architecture is sound and the site only needs a push, targeted optimisation is enough and cheaper. If the system buckles under load, is hard to update or does not connect to your marketing tools, rebuilding on a modern foundation pays off better over time. At Aiterra we recommend deciding only after a deep diagnostic of the site.',
        },
        {
          q: 'How long does improving site performance take?',
          a: 'Targeted optimisation of an existing site usually takes days to weeks. A full rebuild on React and Next.js takes weeks to months, depending on complexity. In either case we start with a diagnostic that maps the failures and lets us prioritise the improvements with the highest impact.',
        },
        {
          q: 'Does a fast site really save money on paid search?',
          a: 'Yes. A fast site with clean code lowers the bounce rate and improves the quality score on campaigns. A higher quality score reduces the cost per click and increases exposure on the same budget. At the same time, good performance strengthens organic ranking and reduces dependence on paid budget over time.',
        },
      ],
    },
  },

  'custom-web-systems': {
    title: 'Custom web systems: client portals, account areas and tools that save a full-time role',
    excerpt:
      'When spreadsheets, WhatsApp groups and email are running your business, it is time for one system that holds it together. Here is how a client portal or a custom management system turns chaos into a process.',
    tags: ['Development', 'Next.js', 'Automation'],
    content: `**In short (TL;DR):** A custom web system is software built around your specific workflow — a client portal, an account area, a dashboard or an order system — instead of forcing the business to bend around off-the-shelf software. It removes manual work in spreadsheets and WhatsApp, connects to the rest of your tools, and saves hours of operational time every month.

There is a moment every growing business knows: the point where the spreadsheets, the WhatsApp groups and the email threads stop holding the load. Orders go missing, clients call to ask what is happening with their project, and the team burns hours on manual updates. That is exactly where a custom web system comes in — a tool built around your workflow, rather than the other way round.

![Developing a custom web system on dual screens](/images/blog/custom-web-systems.webp)

## What a custom system actually is

Unlike off-the-shelf software that forces you to adapt the business to it, a custom system is built around the processes you already have. A few examples from the field: a client portal where each client sees the status of their project, their files and their invoices; an internal order system that keeps sales and the warehouse in sync; a quote calculator that produces a designed proposal in minutes; or a management dashboard that gathers every business metric onto one screen.

## Off-the-shelf or custom — which suits your business?

Off-the-shelf tools are a good starting point, until you reach the edges: they do not always talk to your other systems, they are limited in exactly the feature you need, and the price per seat climbs as you grow. A purpose-built system costs more up front, but it is yours — with no monthly licence fees that inflate, no compromise on the process, and the ability to grow and change alongside the business. Here is the comparison in short:

| Parameter | Off-the-shelf (SaaS) | Custom system |
| --- | --- | --- |
| Fit to your process | You adapt the business to the software | The software is built around your process |
| Initial cost | Low | Higher (a one-off investment) |
| Cost over time | Monthly licences that grow with the team | Full ownership, no inflating licences |
| Integrations | Limited to what the vendor allows | Free connection to CRM, WhatsApp and invoicing |
| Flexibility and features | What exists is what you get | Any feature you need, when you need it |
| Data ownership | With the vendor | Entirely yours |

In short: the more distinctive your process and the larger the headcount, the more a custom system pays for itself over time.

## Why now? The numbers

Moving to tailored digital processes has gone from an advantage to a competitive necessity. A few figures worth knowing:

- Google holds [roughly 90% of the global search market](https://gs.statcounter.com/search-engine-market-share) — which means the digital presence and the speed of your systems directly affect how many clients find you and stay.
- Speed and user experience are measured today by Google's [Core Web Vitals](https://web.dev/articles/vitals) — a slow system hurts both your ranking and the satisfaction of the people using it.
- At most of the businesses we meet, an entire team spends roughly a third of the week on manual updates that the right system performs on its own.

## The connection that makes end-to-end automation work

The real value appears when the system connects to everything else: a lead arriving from the site opens automatically as a project, the client receives status updates on WhatsApp, the invoice is generated and sent by itself, and the monthly report is waiting for the manager first thing on Monday. That is how one system replaces three operational roles — and frees the team for work that produces money.

## What a proper development process looks like

It starts with scoping: mapping the existing process, identifying the bottlenecks and defining what the system must do in its first version. Build lean, go live quickly, and expand according to real usage — not according to a wish list. At Aiterra we build these systems in Next.js and Node.js: technologies that are fast, secure, hold load and grow with you.

Feel like the business is being run by spreadsheets? Leave your details and we will map together which system would save you the most time and money.

---

**Want a website that works for you?** Take a look at AITERRA's [web development service](/en/services/web-development), or [talk to us](/en/contact) for a scoping call at no cost.

## Further reading

- [WordPress or a coded site? How to choose the right foundation for your business](/en/blog/wordpress-vs-custom-code)`,
    faq: {
      title: 'Common questions about custom systems',
      items: [
        {
          q: 'How much does it cost to develop a custom web system?',
          a: 'The cost depends on scope. A focused system that solves one process costs far less than most businesses imagine, and larger projects are built in stages so the value arrives with the first version. Unlike off-the-shelf software there are no inflating monthly licence fees. A short scoping session gives an accurate estimate for your particular need.',
        },
        {
          q: 'How long does a system like this take to build?',
          a: 'A first working version of a focused system usually takes between a few weeks and two months. Our approach is to go live quickly with the critical core, then expand features according to real usage rather than waiting on a vast project that slips for months.',
        },
        {
          q: 'What is the difference between off-the-shelf software and a custom system?',
          a: 'Off-the-shelf software (SaaS) forces you to adapt the business to it, charges monthly licences that grow with the team, and limits you to the features that exist. A custom system is built around your process, is entirely yours, connects freely to other tools, and grows with the business without compromise.',
        },
        {
          q: 'What happens if we need changes or new features later?',
          a: 'That is precisely the advantage of a custom system: it is yours, and the code is written so that it can be extended easily. When processes change you can add features and the system grows with the business, instead of blocking it or forcing a move to entirely different software.',
        },
      ],
    },
  },

  'wordpress-vs-custom-code': {
    title: 'WordPress or a coded site? How to choose the right foundation for your business',
    excerpt:
      'It comes up in every scoping call: WordPress, or custom development? The honest answer is that it depends on your business. Here is how to decide, without paying twice for the same website.',
    tags: ['Development', 'WordPress', 'Next.js'],
    content: `**In short (TL;DR):** WordPress suits brochure sites, blogs and content projects with a modest build budget and a fast route to market. A custom coded site (Next.js / React) wins where you need maximum speed, higher security or genuinely bespoke functionality. The simple rule: a site that presents information — WordPress is enough; a site that runs business processes — code.

This is probably the question we hear most in scoping calls: build the site on WordPress, or in custom code? The honest answer is that there is no single right answer — there is a right choice for each business, according to its needs, its budget and its plans. As an agency that builds both premium WordPress sites and complex systems in Next.js and React, we can give you the full picture without an interest in pushing you one way.

![A developer writing code for a custom website on two screens](/images/blog/wordpress-vs-custom-code.webp)

## WordPress versus code: the full comparison

| Parameter | WordPress | Coded site (Next.js / React) |
|---|---|---|
| Build cost | Low to medium | Medium to high |
| Speed and Core Web Vitals | Depends on theme and plugins | Excellent by default |
| Security | Depends on third-party plugins | Minimal attack surface |
| Ongoing maintenance | Frequent core and plugin updates | Low |
| Custom features | Limited to what a plugin offers | Effectively unlimited |
| Best suited to | Brochure sites, blogs, content | Systems, complex stores, high performance |

## What it costs, by type of site

Prices vary with complexity and how much is bespoke, but these are the ranges the Israeli market works to as of 2026:

| Type of site | WordPress | Coded site |
|---|---|---|
| Landing page | ₪1,500–3,500 | ₪3,500–7,000 |
| Brochure site | ₪4,000–12,000 | ₪9,000–20,000 |
| Store or custom system | ₪12,000+ | ₪20,000+ |

The build cost is only half the story — what matters is the total cost over time, which we come to below.

## When WordPress is an excellent choice

WordPress runs roughly 43% of all websites ([W3Techs](https://w3techs.com/technologies/overview/content_management)), and not by accident. For a standard brochure site, a blog or a content site it offers clear advantages: a relatively low build cost, a content management interface anyone can operate, and thousands of ready-made plugins for any requirement. For a small business that needs a credible digital presence quickly, it is an excellent way to start.

## Where WordPress starts to strain

The problems begin as the site grows. Every additional plugin slows the site down and opens a potential security hole. A heavy theme drags Core Web Vitals scores down, which hurts organic search. And when you need genuinely bespoke functionality — an intelligent price calculator, a customer account area, a connection to internal systems — you discover that stretching WordPress beyond what it was built for costs more than developing it properly in the first place.

## A custom coded site: speed and freedom without compromise

A site built in modern technology such as Next.js and React is written to your exact requirements — with no superfluous plugins and no dead code. The result: load times measured in milliseconds, security of a different order (there are no third-party plugins to break in through), and the ability to build any feature you can describe — from a booking system through to full integration with your CRM and automations. This is why technology companies and large organisations build their digital assets this way.

## The numbers behind speed, and why they are money

Speed is not a luxury — it is a line on the bottom of the page. Here is what the data says:

- According to Google research, when load time goes from one second to three, the probability that a visitor abandons the page rises by 32%.
- Google reports that 53% of mobile visitors abandon a site that takes more than three seconds to load.
- The "Milliseconds Make Millions" study by Google and Deloitte found that a 0.1-second improvement in load time increased retail conversions by 8.4%.
- Core Web Vitals are an [official Google ranking signal](https://developers.google.com/search/docs/appearance/core-web-vitals) in search results.

This is exactly where a coded site has the advantage: it is built fast from the foundations, without the dead weight of plugins — and precisely why the gap in total cost narrows over time, even when the build costs more.

## Three questions that will help you decide

**What does the site have to do?** Present information — WordPress is enough. Run business processes — code.

**How critical is speed?** If you are competing for organic search in a contested niche, or sending expensive paid traffic to the site, every tenth of a second is worth money.

**What is the plan in two years?** A website is an investment over years. If you are planning growth, a store, a customer area or an application, a coded foundation will save you a rebuild halfway through.

## How we approach it at Aiterra

We start from the business, not the technology. In a scoping call we map what you actually need, and only then recommend a foundation — and sometimes our recommendation is the cheaper option, because it is the right one for the stage you are at. And if you later decide to move from WordPress to code, we carry out the migration with your accumulated organic search fully preserved.

Not sure which foundation is right for your business? Leave your details and we will come back to you with a professional and honest recommendation, matched to the stage your business is actually at.`,
    faq: {
      title: 'Common questions about choosing a foundation for your site',
      items: [
        {
          q: 'Can a WordPress site be fast?',
          a: 'Yes, provided it is built correctly: a light theme, a minimum of plugins, quality hosting and image optimisation. But even a fast WordPress site will struggle to match a clean coded site built for speed from the first line.',
        },
        {
          q: 'How much does a coded site cost compared with WordPress?',
          a: 'The build cost of a coded site is higher: a landing page runs around ₪3,500–7,000 against ₪1,500–3,500, and a brochure site ₪9,000–20,000 against ₪4,000–12,000. The gap narrows over time, because a coded site needs far less ongoing maintenance and carries no plugin licences.',
        },
        {
          q: 'Can I move an existing WordPress site to code without losing rankings?',
          a: 'Yes. A migration includes a full URL map with permanent redirects, preserved page structure and metadata, and monitoring of coverage and rankings after launch. Most ranking loss in migrations comes from URLs quietly changing, which a redirect map prevents.',
        },
        {
          q: 'Who owns the site if you build it in code?',
          a: 'You do. You receive the repository, the deployment pipeline and every service credential at handover, along with documentation. There is no licence that stops working if you stop working with us.',
        },
      ],
    },
  },
}
