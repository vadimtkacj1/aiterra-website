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
