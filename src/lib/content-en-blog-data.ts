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
