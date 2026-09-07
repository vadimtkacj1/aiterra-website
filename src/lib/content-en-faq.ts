export interface EnFaqItem {
  q: string
  a: string
}

export interface EnFaqBlock {
  title: string
  heading: string[]
  items: EnFaqItem[]
}

export const enPageFaq: Record<string, EnFaqBlock> = {
  '/en/services': {
    title: 'Frequently asked questions about our digital services',
    heading: ['Frequently asked questions', 'about our services'],
    items: [
      {
        q: 'Do we have to take every service, or can we choose only what we need?',
        a: 'You choose. Businesses come to Aiterra for a single piece of work — a website, an SEO programme, a Google Ads account, a CRM integration — and each of those is sold on its own with its own scope and price. The reason we mention the full stack at all is sequencing rather than upselling: a paid campaign pointed at a slow site wastes budget, and an SEO programme running on a platform that cannot produce clean URLs or fast pages will underperform whatever the content quality. In a discovery call we say plainly which parts matter for your situation and which can wait a quarter or a year. If the honest answer is that you need one service and not four, that is what the written quote will contain.',
      },
      {
        q: 'We already have a website. Is it better to upgrade it or rebuild from scratch?',
        a: 'It depends on what is actually holding the site back, and that is a technical question rather than a matter of taste. If the structure, URLs and page speed are sound and the problem is copy, design or conversion, an upgrade costs less and keeps the search history you have already earned. If the site runs on a template stack with heavy plugins, cannot pass Core Web Vitals, or has a URL structure that blocks any sensible SEO plan, rebuilding usually costs less over two years than patching it repeatedly. We audit the existing site before quoting: crawl, speed, indexing status in Google Search Console and current organic positions. If a rebuild is not justified we say so, and every rebuild we do carries a redirect map so existing rankings move across rather than being lost.',
      },
      {
        q: 'Which is better for my business — organic SEO or paid advertising?',
        a: 'They answer different questions, and most businesses eventually run both. Paid search buys traffic immediately and stops the moment the budget stops; it is the right first move when you need leads this month, when you are testing whether a market exists, or when a launch has a fixed deadline. Organic SEO compounds — in the Israeli market it typically takes three to six months to show real movement, but the traffic does not disappear when spending pauses, and it reaches people who are still researching rather than ready to buy. The usual sequence is paid first for immediate flow and market data, organic in parallel so cost per lead falls over the following year. What you should not do is judge either channel without conversion tracking in place, because then you are optimising on impressions instead of customers.',
      },
      {
        q: 'How do automation and WhatsApp bots fit together with paid campaigns?',
        a: 'A campaign produces enquiries; automation decides how many of them become customers. Response speed is the largest controllable factor in Israeli lead handling — an enquiry answered within minutes converts far better than the same enquiry answered the next morning, and most leads that go cold do so before anyone has spoken to them. We connect campaign forms directly into the CRM, trigger an immediate WhatsApp or email acknowledgement, route the lead to whoever should own it, and record the source so campaign reporting shows real customers rather than raw form submissions. The same plumbing feeds quotes and invoices into Morning, Greeninvoice, iCount or Priority, so a closed deal does not need re-keying. Without that layer, increasing ad spend mainly increases the number of leads that get lost.',
      },
      {
        q: 'How will we know your services are actually producing results?',
        a: 'Through numbers you can check yourself, in accounts you own. Every engagement begins by defining what a result is for your business — a qualified enquiry, a phone call, an order, a booked consultation — and installing the measurement for it: GA4 with real conversion events, Google Search Console, call and form tracking, and campaign-level cost per lead where paid media is involved. You receive access to all of these under your own credentials, not a screenshot in a monthly deck. Reporting states what moved, what did not, and what changes next month as a result. Where a number is bad we report it as a bad number; positions, traffic and cost per lead all fluctuate, and an agency report that never contains a decline is being edited rather than measured.',
      },
    ],
  },

  '/en/projects': {
    title: 'Frequently asked questions about our work and how projects run',
    heading: ['Before we start', 'a few things worth knowing.'],
    items: [
      {
        q: 'What exactly am I looking at in the Aiterra portfolio?',
        a: 'Twelve live projects built by the same in-house team: three online stores (Neot Sade, ALOVA and a digital retail store), seven marketing and lead-generation sites across cosmetics, skincare and personal branding (Hofit Cosmetics, Maayan Vaknin, Karin Cohen, Olie 6, Alexandra Patsina, Sous Chef, Eli Ben Yitzhak), one real-estate marketing project and one digital-promotion programme for a mortgage advisory practice. Each has its own page setting out the business objective, the systems it was connected to and what was actually built, rather than a screenshot of the design alone. All of them were written in code using React and Next.js instead of being assembled from a template and a stack of plugins, which is why the same team can also maintain them and rank them afterwards.',
      },
      {
        q: 'Are the projects in the portfolio still live?',
        a: 'Yes. All twelve are running in production and serving real customers today; none of them are concepts, demos or unbuilt pitches. Several are also under ongoing maintenance and organic search work with us, so the team that built the site is the team that keeps it updated and ranking. When a client takes a project offline or moves it to another supplier, we remove it from the portfolio rather than leaving it there to pad the list. During a discovery call you can ask to see whichever project is closest to your own situation live on screen, including its load speed, its behaviour on mobile and the analytics behind it, so you are judging measured performance rather than a static image.',
      },
      {
        q: 'You have no project in my exact industry. Does that mean you lack relevant experience?',
        a: 'Not necessarily, because what repeats across these projects is the shape of the problem rather than the sector. A catalogue that has to sell, a form that has to generate qualified enquiries, a system that has to talk to Greeninvoice or a CRM, and a site that has to rank in Hebrew are the same engineering problems whether the business sells skincare, mortgages or catering. The portfolio happens to concentrate in cosmetics and skincare, online retail, real estate, financial advice and personal brands. In discovery we show the structurally closest project — a store with live inventory management if you are in retail, a lead site with conversion tracking if you sell a professional service — and set out explicitly which parts would carry over to your build and which would be designed from scratch.',
      },
      {
        q: 'Who owns the code, the design and the domain when the project ends?',
        a: 'You do. At handover you receive the code repository, the deployment pipeline to the server, and the credentials for every connected service: hosting, domain, payment processing, invoicing and analytics. Nothing is retained in our name and no component stops working if you leave, so you can move the site to another developer at any point without rebuilding it. That is the practical difference from closed platforms such as Wix or Shopify, where the content and the design are yours but the system running them is not. Design source files and brand assets are handed over as well, which means any future supplier can continue from exactly where we stopped instead of reverse-engineering the site or starting again from a blank page.',
      },
      {
        q: 'How long does a project of this size take?',
        a: 'A marketing or lead-generation site on the scale of the ones shown here is normally delivered within two to six weeks from the moment the specification is approved. An online store with a catalogue, Israeli card clearing, an invoicing connection to Morning or Greeninvoice and inventory management runs from one to three months depending on catalogue size and the number of integrations. A custom platform with user permissions and real business logic takes longer than either. In practice the schedule is extended by content, photography and client approvals far more often than by engineering time, which is why those items are locked during the specification stage rather than chased once the build is already under way.',
      },
      {
        q: 'Can we get references or speak to existing clients before committing?',
        a: 'Yes. We introduce prospective clients to existing ones working on a comparable project, once the existing client has agreed to it. The useful questions in that conversation are the ones a portfolio cannot answer: how quickly someone responds after launch, how small change requests are handled in practice, and whether the figure in the original quote is the figure that was eventually paid. Alongside that, every quote we issue states in writing what is included and what is excluded, so you can compare it against competing proposals on the same terms instead of comparing bottom-line numbers that quietly cover different amounts of work. If a proposal you receive from anyone will not put that detail in writing, treat the omission as information.',
      },
    ],
  },

  '/en/about': {
    title: 'Frequently asked questions about Aiterra',
    heading: ['Frequently asked questions', 'why work with Aiterra?'],
    items: [
      {
        q: 'What separates Aiterra from an advertising agency or a web development shop?',
        a: 'Most suppliers sit on one side of the line: agencies buy media and produce creative but outsource the build, while development studios ship a site and hand the marketing problem back to you. Aiterra runs both under one roof — strategy, UX and UI design, engineering, organic search, paid media and business automation — which removes the failure mode where each supplier blames the other for flat results. In practice that means the person writing the code knows what the SEO plan requires, and the person running the campaign can have a landing page changed the same week rather than filing a ticket with a third party. We are based in Bat Yam and work with businesses across Israel in Hebrew, English and Russian.',
      },
      {
        q: 'What kinds of businesses usually work with you?',
        a: 'Small and medium Israeli businesses, with the solution sized to the business rather than the other way round. That ranges from local service providers who need one strong page and a reliable stream of enquiries — clinics, legal practices, consultants, tradespeople — through retail brands moving into online sales, to companies that need a custom platform with user accounts, permissions and integrations into their existing accounting or CRM stack. Our portfolio concentrates in cosmetics and skincare, online retail, real estate, financial advisory and personal brands. What our clients have in common is not sector but requirement: they want the digital asset to produce measurable business rather than merely to exist, and they want to own what they paid for at the end of it.',
      },
      {
        q: 'We do not understand terms like SEO or code. How will you communicate with us?',
        a: 'Plainly, and without requiring you to learn our vocabulary. One of our working rules is that anything we cannot explain in ordinary language we have not thought through properly. You get explanations of what is being done and why it matters to your revenue, not a list of technical tasks; when a decision carries a genuine trade-off — speed against features, cost against timeline, quick wins against durable ones — we set out both options and a recommendation rather than presenting one path as the only one. Reports use numbers you can verify in your own Google accounts. You are never asked to approve something you do not understand, and asking the same question twice is treated as a normal part of the process.',
      },
      {
        q: 'Can we hire you for the website only, or the marketing only?',
        a: 'Yes, and plenty of clients do exactly that. We recommend a joined-up approach because a site and its traffic strategy shape each other, but each service stands on its own with its own scope, timeline and price. You can commission a website and take the marketing elsewhere, or bring us in for SEO and paid campaigns on a site somebody else built — we run maintenance and organic search programmes on sites we did not build, provided the underlying platform can support what is being asked of it. If it cannot, we say so before taking the work rather than billing for months of effort against a technical ceiling that was always going to cap the result.',
      },
    ],
  },

  '/en/contact': {
    title: 'Frequently asked questions before you get in touch',
    heading: ['Frequently asked questions', 'before you get in touch'],
    items: [
      {
        q: 'How much does a website cost?',
        a: 'The range is wide because the work genuinely differs from project to project. Cost is driven by system complexity, the number of pages and templates, whether the build is custom or adapted, and above all by integrations — Israeli card clearing, invoicing through Morning, Greeninvoice or iCount, CRM connections and inventory management each add real engineering. A focused landing page, a full marketing site and a custom platform with user accounts sit in three separate brackets. Rather than quoting a headline number that means nothing, we run a short discovery call and then send a written quote stating exactly what is included, what is excluded and what would trigger additional cost. Nothing appears halfway through the build that was not on that document.',
      },
      {
        q: 'Do you provide hosting as well?',
        a: 'Yes. Every site we build needs a server that can actually serve it quickly, so hosting is offered as part of the engagement on infrastructure we manage, with SSL, automated backups and uptime monitoring included. Page speed is not a cosmetic concern here: Core Web Vitals feed directly into Google rankings, and a slow server undoes the work done in the code. If you would rather host elsewhere, that is fine too — you receive the repository and the deployment pipeline at handover, so the site can run on your own infrastructure or your existing provider without any part of it being locked to us. Ongoing maintenance, security updates and monitoring are available as a separate monthly retainer with published pricing and a written response time.',
      },
      {
        q: 'Will the site be ready for organic search from the start?',
        a: 'Yes, and this is the part most template builds get wrong. Every site we deliver ships with the technical foundations in place: clean semantic HTML, a sensible URL structure, correct heading hierarchy, meta titles and descriptions written per page, canonical tags, hreflang where the site is bilingual, structured data in JSON-LD, an XML sitemap, a configured robots file, and Core Web Vitals measured before launch rather than after complaints. It is also built to Israeli accessibility standard IS 5568 and WCAG 2.1 AA. That foundation does not by itself produce rankings — content and authority do that over months — but without it, any SEO programme you commission later begins by paying to fix the site instead of improving it.',
      },
    ],
  },
}

export function getEnFaq(path: string): EnFaqBlock | null {
  return enPageFaq[path] ?? null
}
