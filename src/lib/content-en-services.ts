import type { ServicePage } from '@/app/(he)/(site)/content'

export const servicePagesEn: Record<string, ServicePage> = {
  'web-development': {
    id: 'web-development',
    crumb: 'Web design & development',
    eyebrow: 'Web design company in Israel',
    heading: ['Web design and development company in Israel', 'custom-built, in Hebrew and English'],
    subhead: 'Our web design and development practice',
    lede: 'Aiterra is a web design and development company based in Bat Yam, Israel. We plan, design and build custom websites in Hebrew (RTL) and English - fast, accessible to IS 5568 and structured for Google and AI search from the first commit - and you own the code.',
    image: '/images/service-dev.webp',
    action: { label: 'Book a scoping call', href: '/en/contact' },
    metaTitle: 'Web Design & Development Company in Israel | Hebrew + English',
    metaDescription:
      'Web design and development company in Israel: custom Hebrew/English websites in Next.js, IS 5568 accessibility, SEO and GEO built in, and full code ownership.',
    advantages: {
      eyebrow: 'OUR ADVANTAGES',
      heading: ['What sets our engineering apart'],
      lede: 'Why businesses replace template builds with custom engineering.',
      outro: 'Our team is ready to scope, design and ship your build. Are you?',
      action: { label: 'Book a scoping call', href: '/en/contact' },
      roles: [
        {
          id: 'spec',
          title: 'Discovery before the first line of code',
          art: '/images/service-page-discovery.webp',
          text: 'We start with your business, your buyers and your competitors, then define page structure and messaging. Every page is built around one action we want the visitor to take.',
        },
        {
          id: 'code',
          title: 'Built in code, not in a theme',
          art: '/images/service-page1.webp',
          text: 'Next.js, React and TypeScript instead of fighting plugin limits. Feature growth stays clean and predictable as the business scales, rather than becoming a rewrite.',
        },
        {
          id: 'speed',
          title: 'Performance measured during the build',
          art: '/images/service-page3.webp',
          text: 'Core Web Vitals are checked continuously, not patched before launch. A slow site burns paid budget and loses visitors before they read the offer.',
        },
        {
          id: 'ownership',
          title: 'Your code, no lock-in',
          art: '/images/service-page4.webp',
          text: 'At handover you get the repository and every service credential. If you ever move to another partner, the transition is documented - which is exactly why we can win the work on merit.',
        },
      ],
    },
    system: {
      eyebrow: 'MANAGEMENT SYSTEM',
      heading: ['The Aiterra management console'],
      art: '/images/service-cms.webp',
      features: [
        {
          id: 'pages',
          icon: 'catalog',
          title: 'Pages and content',
          text: 'Edit copy, images and banners and add pages from one interface, without technical knowledge and without a ticket to us for every change.',
        },
        {
          id: 'leads',
          icon: 'orders',
          title: 'Enquiry management',
          text: 'Every form submission is stored with an email or WhatsApp alert and a handling status, so no enquiry is lost in an inbox.',
        },
        {
          id: 'seo',
          icon: 'analytics',
          title: 'Full SEO control',
          text: 'Titles, meta descriptions, clean URLs, structured data and the sitemap - managed natively, with no third-party plugin in the critical path.',
        },
        {
          id: 'landing',
          icon: 'sales',
          title: 'Campaign landing pages',
          text: 'Spin up a dedicated landing page per campaign with forms and conversion tracking, so the ads and the site behave as one system.',
        },
        {
          id: 'integrations',
          icon: 'club',
          title: 'Connections to your stack',
          text: 'API integrations to the CRM, invoicing, payments and email tooling you already run, so records move automatically instead of being retyped.',
        },
      ],
      action: { label: 'Let us scope your build', href: '/en/contact' },
    },
    howItWorks: {
      eyebrow: 'HOW IT WORKS',
      heading: ['How it works. Straightforwardly.'],
      lede: 'Three clear stages from the first call to launch, with one project lead accountable throughout.',
      steps: [
        {
          id: 'discovery',
          title: 'Discovery and goals',
          text: 'We learn the business, the audience and the competitive set, agree what success looks like in numbers, and map pages and messaging before any design work begins.',
          art: '/images/howitwork1.webp',
        },
        {
          id: 'build',
          title: 'Design and engineering',
          text: 'Interfaces designed to your brand and built in code: responsive by default, accessible to WCAG AA, with load performance measured as we go rather than audited at the end.',
          art: '/images/howitwork2.webp',
        },
        {
          id: 'launch',
          title: 'Launch, measure, support',
          text: 'We connect the domain, analytics and the management console, train your team on self-service updates, and keep monitoring performance and enquiries after go-live.',
          art: '/images/howitwork3.webp',
        },
      ],
    },
    banner: {
      heading: 'Not sure whether you need a rebuild or a refit?',
      action: { label: 'Talk to us and find out', href: '/en/contact' },
    },
    faqHeading: ['Before we start', 'a few things worth knowing.'],
    faqEntries: [
      {
        question: 'What drives the cost of a custom web development project?',
        answer:
          'Scope, not page count. A focused landing page, a full marketing site, and a custom platform with authentication and integrations sit in three separate brackets. Within any of them the number is moved mainly by integration work - Israeli card clearing, invoicing through Morning, Greeninvoice or iCount, a CRM connection, inventory management - and by the count of genuinely distinct templates, since twenty pages running on three layouts is far less work than five pages that each look different. After a short discovery call you get a written quote stating exactly what is included, what is excluded, and what would count as an addition. Nothing surfaces halfway through the build that was not on that document, which is also what makes a competing proposal comparable.',
      },
      {
        question: 'How long does a custom web development project take?',
        answer:
          'A landing page ships in a few weeks; a full marketing site typically runs one to two months from the moment the specification is approved; applications and platforms with user permissions and real business logic take longer. In practice the schedule is set by content, photography and client approvals rather than by engineering, which is why those are locked during discovery instead of chased mid-build - projects that arrive with content ready almost always finish on time. We deliver in working increments you can click through, so corrections land early rather than in the final week. Where a second language, a full brand identity or product photography is in scope, that is quoted into the timeline at the start rather than discovered later.',
      },
      {
        question: 'What is the difference between custom development and a website template?',
        answer:
          'A template forces your content and workflows into layouts designed for a generic business. Custom development inverts that: the structure follows how your business sells and operates. The difference shows up in three places. Page speed, because a template ships markup and scripts for features you will never use, and Core Web Vitals feed directly into rankings. Back-office integration, which is routine in code and a plugin problem otherwise. And the day you need something the template author never anticipated - that is where the cost actually lands, in workarounds that compound annually. Every plugin is also a security and update dependency: the larger the stack, the higher the odds that one update quietly breaks something else.',
      },
      {
        question: 'Do we own the code after delivery?',
        answer:
          'Yes. At handover you receive the code repository, the deployment pipeline to the server, and credentials for every connected service: hosting, domain, payment processing, invoicing and analytics. Design source files come with it. Nothing is retained in our name and no component stops working if you leave, so the site can move to another developer at any point without being rebuilt. That is the practical difference from closed platforms such as Wix or Shopify, where the content and design are yours but the system running them is not. It is worth confirming that this appears in writing in every proposal you are weighing, ours included - a supplier who will not put it in writing has told you something useful.',
      },
      {
        question: 'Will the site meet accessibility requirements?',
        answer:
          'Yes, and it is checked before launch rather than after a complaint. We build to Israeli standard IS 5568, which is based on WCAG 2.0 Level AA, and also implement WCAG 2.1 Level AA: full keyboard navigation, sufficient colour contrast, alternative text on images, a heading hierarchy a screen reader can traverse, properly labelled form fields and a published accessibility statement. In Israel this is a legal requirement and the exposure sits with the site owner rather than with whoever built the site. An overlay widget on its own generally does not satisfy the standard - it adds a control layer above the page but does not repair broken structure, low contrast or unreachable navigation underneath it.',
      },
      {
        question: 'Can you improve our existing site instead of rebuilding it?',
        answer:
          'Often, yes, and it is a technical question rather than a matter of taste. Discovery establishes what is worth preserving - content that ranks, URL structure, inbound links and current organic positions - alongside a crawl, a speed and Core Web Vitals check, and the indexing status in Google Search Console. If the structure is sound and the real problem is copy, design or conversion, an upgrade costs less and keeps the history you have earned. Where a rebuild is right, we plan the 301 redirect map before anything moves, preserve heading structure and metadata, and monitor coverage afterwards. An unplanned migration is one of the fastest ways to erase years of search equity, and the cause is nearly always URLs that changed without redirects.',
      },
    ],
  },

  seo: {
    id: 'seo',
    crumb: 'SEO',
    eyebrow: 'Organic growth',
    heading: ['SEO services in Israel', 'that produce enquiries'],
    subhead: 'Our organic search practice',
    lede: 'Keyword research, technical SEO, content and authority building - organic growth measured in qualified enquiries rather than positions, including visibility inside AI-generated answers.',
    image: '/images/service-marketing.webp',
    action: { label: 'Request a visibility review', href: '/en/contact' },
    metaTitle: 'SEO Services in Israel, Built by Engineers',
    metaDescription:
      'SEO built by engineers: keyword research, technical fixes made in code, content, digital PR and monthly reporting - plus visibility in AI Overviews and ChatGPT.',
    advantages: {
      eyebrow: 'OUR ADVANTAGES',
      heading: ['What sets our SEO apart'],
      lede: 'Why an engineering-led team ranks sites other agencies cannot.',
      outro: 'Our team is ready to find what is holding your rankings back. Are you?',
      action: { label: 'Request a visibility review', href: '/en/contact' },
      roles: [
        {
          id: 'intent',
          title: 'Keywords chosen by intent, not volume',
          art: '/images/service-page-discovery.webp',
          text: 'We separate people researching a topic from people looking for a supplier, and put the budget behind the second group. High-volume terms that never convert are a expensive distraction.',
        },
        {
          id: 'technical',
          title: 'Technical SEO fixed in the codebase',
          art: '/images/service-page1.webp',
          text: 'Our real advantage: the team that ranks your site also writes its code. Render-blocking scripts, broken schema, a bad URL structure - fixed this sprint, not queued in another vendor’s backlog for a quarter.',
        },
        {
          id: 'content',
          title: 'Content that answers real questions',
          art: '/images/service-page3.webp',
          text: 'We write from what your buyers actually type and ask - pricing, comparisons, objections - rather than from guesswork. That is also precisely what AI search engines choose to cite.',
        },
        {
          id: 'reporting',
          title: 'Monthly reporting without the fog',
          art: '/images/service-page4.webp',
          text: 'Every month you see what was done, which terms moved, how much organic traffic arrived and how many enquiries it produced. No attractive charts that say nothing about the business.',
        },
      ],
    },
    system: {
      eyebrow: 'REPORTING & TRACKING',
      heading: ['Your reporting and tracking layer'],
      art: '/images/service-seo.webp',
      features: [
        {
          id: 'rankings',
          icon: 'analytics',
          title: 'Continuous rank tracking',
          text: 'Tracking on the terms agreed at kickoff, with trend over time and a direct comparison against the competitors ranking above you.',
        },
        {
          id: 'leads',
          icon: 'orders',
          title: 'Traffic tied to enquiries',
          text: 'Conversion tracking wired into GA4 and your CRM, so you know which pages and which terms actually generate leads rather than sessions.',
        },
        {
          id: 'technical',
          icon: 'catalog',
          title: 'Technical health monitoring',
          text: 'Ongoing checks on indexation, crawl errors, load performance and Core Web Vitals - with remediation at the code level when required.',
        },
        {
          id: 'local',
          icon: 'club',
          title: 'Local search and business profile',
          text: 'Google Business Profile optimisation, review strategy and local citations for businesses whose customers come from a defined service area.',
        },
        {
          id: 'ai',
          icon: 'sales',
          title: 'AI search visibility',
          text: 'Monitoring of appearances in Google AI Overviews and ChatGPT, and tuning of content and structured data so those systems cite you rather than a competitor.',
        },
      ],
      action: { label: 'See where you stand today', href: '/en/contact' },
    },
    howItWorks: {
      eyebrow: 'HOW IT WORKS',
      heading: ['How it works. Straightforwardly.'],
      lede: 'Organic search compounds. Here is what the engagement looks like from the first audit to sustained growth.',
      steps: [
        {
          id: 'audit',
          title: 'Audit and research',
          text: 'We crawl the site, identify the technical blockers, build an intent-mapped keyword set and analyse what the competitors outranking you are actually doing differently.',
          art: '/images/howitwork1.webp',
        },
        {
          id: 'fix',
          title: 'Remediation and optimisation',
          text: 'We fix the technical blockers in code, restructure pages and heading hierarchy, add valid structured data, and write or rewrite the pages carrying commercial weight.',
          art: '/images/howitwork2.webp',
        },
        {
          id: 'grow',
          title: 'Growth and measurement',
          text: 'We expand content, build authority and quality links, and report monthly on positions, traffic and enquiries - adjusting the plan against what the data shows is working.',
          art: '/images/howitwork3.webp',
        },
      ],
    },
    banner: {
      heading: 'Want to know how much organic traffic your site is leaving on the table?',
      action: { label: 'Request a visibility review', href: '/en/contact' },
    },
    faqHeading: ['Before we start', 'a few things worth knowing.'],
    faqEntries: [
      {
        question: 'How long before an SEO campaign produces measurable traffic?',
        answer:
          'Early signals - improved indexation, rising impressions and movement on lower-competition terms - usually appear within two to four months. Meaningful gains on competitive commercial terms typically take six months or more, and longer in saturated categories. A brand new domain starts slower than an established site with existing authority, and the technical condition of the site shifts the answer again: a site that is not being crawled cleanly will not rank even excellent content. We measure in the Google Search Console and GA4 accounts you own, and in the early months we report impressions and indexation - the metrics that move first - rather than only enquiries, so progress is visible before it becomes revenue.',
      },
      {
        question: 'How much do SEO services cost per month?',
        answer:
          'The retainer depends on three things: how competitive the vertical is, the technical condition of the existing site, and how much content actually needs producing. A site that needs two months of technical repair before promotion can even begin is priced differently from a healthy one. After an initial review we present a clear range with a breakdown of what each month includes - keyword research, technical work, content writing, local SEO and authority building - and how many hours go to each, so you know what you are paying for. Treat any quote issued before the site has been examined with caution: without a technical review, nobody can know whether the fee covers promotion or repair.',
      },
      {
        question: 'What is the difference between SEO and paid ads?',
        answer:
          'Paid search delivers traffic on day one and stops when the budget does - it buys exposure rather than building an asset. Organic takes months to compound but keeps producing enquiries after the spend pauses, and reaches people still researching rather than only those ready to buy. The economics differ: with paid, cost per lead stays roughly flat over time; with organic, it falls as content accumulates authority. For most businesses the answer is both, weighted by stage - paid to validate demand and gather market data quickly, organic running in parallel as the asset that lowers acquisition cost over the following year. What you should not do is judge either channel without conversion tracking already in place.',
      },
      {
        question: 'Can you guarantee a number one ranking?',
        answer:
          'No, and nobody credibly can. Google does not sell organic positions, changes its systems dozens of times a year, and personalises results by location, device and search history - so "position one" is not even the same result for two different people. What we commit to instead is a written plan of work, full transparency on what was done each month, access to your own measurement accounts, and reporting against enquiries rather than rankings alone. A guaranteed number one is a red flag rather than a selling point, and in practice such guarantees usually attach to a phrase so specific that nobody searches it - which is exactly why ranking first for it is easy.',
      },
      {
        question: 'How do we get cited in ChatGPT and Google AI Overviews?',
        answer:
          'That discipline is generative engine optimisation, and we treat it as part of the engagement rather than an upsell. In practice it requires four things. Content that answers questions directly, self-containedly and with enough concrete detail that a whole passage can be quoted without surrounding context. Valid structured data in JSON-LD, including published prices, FAQ entries and organisation details. Authority and brand mentions across sources these systems already trust, since a model draws on what others write about you and not only on what you publish. And deliberate crawler access, configured in robots.txt and llms.txt rather than left to chance. It matters because a large and growing share of searches now end in an answer rather than a click to any site.',
      },
      {
        question: 'We are a local business. Do you handle local SEO?',
        answer:
          'Yes. For a business serving a defined area - a clinic, a legal practice, a trade - the Google Business Profile and the local pack often matter more than the website itself, because a large share of local searches end in a phone call placed directly from the profile without anyone visiting the site. We handle profile optimisation and category selection, review collection and response, location-specific service pages, and local citations. We also make sure the business name, address and phone number appear identically everywhere the business is listed: consistency across citations is one of the simplest local ranking signals available, and one of the most commonly neglected.',
      },
      {
        question: 'Our site was built by someone else. Can you still rank it?',
        answer:
          'Yes, and we do it regularly. We start with a technical review of what is blocking performance on the current build: a full crawl, speed and Core Web Vitals, URL structure, duplicate content, indexing status in Google Search Console and current positions. Many fixes are possible on a site we did not write, including WordPress and hosted platforms. If we find a structural blocker that cannot be worked around - a URL structure that cannot be changed, a platform that will not expose its tags, or performance that will not improve without a rebuild - we tell you upfront and in writing, instead of billing months against a technical ceiling that was knowable from the start.',
      },
    ],
  },

  development: {
    id: 'development',
    crumb: 'Custom software',
    eyebrow: 'Custom platforms',
    heading: ['Custom software and CRM development', 'built around your workflow'],
    subhead: 'Our platform engineering practice',
    lede: 'Portals, dashboards, internal tools and the integrations between them - engineered for the operations that off-the-shelf software cannot cover, and designed to be extended rather than replaced.',
    image: '/images/service-dev-hero.webp',
    action: { label: 'Discuss your platform', href: '/en/contact' },
    metaTitle: 'Custom Software and CRM Development in Israel',
    metaDescription:
      'Custom software and CRM development in Israel: client portals, dashboards, workflow automation and API integrations, built in Next.js, Node and PostgreSQL.',
    advantages: {
      eyebrow: 'OUR ADVANTAGES',
      heading: ['What sets our platform work apart'],
      lede: 'Why teams commission a platform instead of stitching together more SaaS.',
      outro: 'Our team is ready to map the process and build the system around it. Are you?',
      action: { label: 'Discuss your platform', href: '/en/contact' },
      roles: [
        {
          id: 'process',
          title: 'The software follows the process',
          art: '/images/service-page-discovery.webp',
          text: 'We map how the work actually happens before proposing architecture. Software that forces a team to change a working process to suit the tool gets abandoned within a year.',
        },
        {
          id: 'integration',
          title: 'Integrations that hold',
          art: '/images/service-page1.webp',
          text: 'Reliable API workflows between the platform, your CRM, ERP, payment providers and internal systems - with error handling and retries, so data does not silently stop moving.',
        },
        {
          id: 'scale',
          title: 'Architecture that grows with you',
          art: '/images/service-page3.webp',
          text: 'Role-based access, sensible data modelling and modular structure. Adding a department, a market or a feature should be an increment, not a rebuild.',
        },
        {
          id: 'support',
          title: 'Maintained, not abandoned',
          art: '/images/service-page4.webp',
          text: 'Monitoring, dependency and security updates, and a named contact who knows your system. A platform nobody maintains becomes a liability faster than a website does.',
        },
      ],
    },
    system: {
      eyebrow: 'WHAT WE BUILD',
      heading: ['Systems we build most often'],
      art: '/images/service-platform.webp',
      features: [
        {
          id: 'portals',
          icon: 'club',
          title: 'Customer and partner portals',
          text: 'Secure login areas with role-based permissions, so clients, partners or field teams see exactly the data they should and nothing else.',
        },
        {
          id: 'dashboards',
          icon: 'analytics',
          title: 'Operational dashboards',
          text: 'Real-time metrics pulled from the systems you already run, presented as decisions rather than raw tables, with per-role views.',
        },
        {
          id: 'automation',
          icon: 'orders',
          title: 'Workflow automation',
          text: 'The repetitive multi-step processes your team runs by hand - approvals, routing, notifications, document generation - moved into software.',
        },
        {
          id: 'catalog',
          icon: 'catalog',
          title: 'Internal tools and admin systems',
          text: 'Purpose-built back offices for inventory, scheduling, content or case management, replacing the spreadsheet that quietly became business-critical.',
        },
        {
          id: 'api',
          icon: 'sales',
          title: 'APIs and system integration',
          text: 'Bridging tools that were never designed to talk to each other, so records flow automatically instead of being rekeyed between systems.',
        },
      ],
      action: { label: 'Discuss your platform', href: '/en/contact' },
    },
    howItWorks: {
      eyebrow: 'HOW IT WORKS',
      heading: ['How it works. Straightforwardly.'],
      lede: 'Platform projects fail on unclear requirements far more often than on technology. Our process front-loads that risk.',
      steps: [
        {
          id: 'map',
          title: 'Process mapping',
          text: 'We document the current workflow, the systems involved and where time is actually lost, then agree which parts are worth automating and which should stay manual.',
          art: '/images/howitwork1.webp',
        },
        {
          id: 'build',
          title: 'Architecture and build',
          text: 'Data model, permissions and integrations designed first, then delivered in working increments you can review - so direction is corrected early rather than at handover.',
          art: '/images/howitwork2.webp',
        },
        {
          id: 'adopt',
          title: 'Rollout and support',
          text: 'Migration of existing data, training for the people who will use it daily, then ongoing monitoring, updates and iteration as the process evolves.',
          art: '/images/howitwork3.webp',
        },
      ],
    },
    banner: {
      heading: 'Still running a critical process on a spreadsheet?',
      action: { label: 'Let us map it together', href: '/en/contact' },
    },
    faqHeading: ['Before we start', 'a few things worth knowing.'],
    faqEntries: [
      {
        question: 'How is a custom platform different from off-the-shelf software?',
        answer:
          'Off-the-shelf software is the right answer whenever the process is standard - accounting, email, payroll - and we will say so rather than sell you a build. A custom platform earns its cost when the process is genuinely specific to how you compete, or when you are already paying several subscriptions plus manual labour to bridge the gaps between them. The clearest signal that the threshold has been crossed is somebody on the team retyping the same record into a second system, or nobody being able to state the status of anything without asking a particular person. Custom means the data model, screens, permissions and automations follow how you work, rather than your process being reshaped to fit a product roadmap you do not control.',
      },
      {
        question: 'What integrations can you build?',
        answer:
          'We integrate with CRM systems including Fireberry and Powerlink, ERP and accounting platforms such as Priority, Hashavshevet, Morning (Green Invoice), Greeninvoice, iCount and Rivhit, Israeli payment providers, shipping and logistics services, email and the WhatsApp Business API, and internal databases. Where a vendor exposes an API we can generally connect to it; where one does not, we work with scheduled file import and export, and we say so during discovery rather than after contracting. What we settle in the specification is which fields move, in which direction, how often and what happens on error - because the question that matters in an integration is not what happens when everything works, but what happens when a provider is unavailable or returns something unexpected.',
      },
      {
        question: 'How long does a platform project take?',
        answer:
          'A focused internal tool built around a single business process can ship in weeks. A portal or dashboard suite with multiple roles, permissions and integrations typically runs a few months. Three things set the range: the number of screens and states, the number of external systems to connect - each integration is a small project of its own, with error handling and edge cases - and how quickly decisions, data and approvals come back from your side. We deliver in working increments rather than one large handover, so you steer real software early instead of approving documents. The stage least worth compressing is the specification: changing the data model after a system is in production is the most expensive change there is.',
      },
      {
        question: 'Do we own the platform and its code?',
        answer:
          'Yes. The repository, the infrastructure accounts and every credential are yours, and the deployment pipeline is handed over with them. We also document the architecture, the data model and the deployment process, so another team could pick the system up without reverse-engineering it first - which is what makes the ownership meaningful rather than nominal. Nothing stops working if you stop working with us, and no licence key sits in our name. This matters more with an internal platform than with a website, because a system your operations depend on daily is the worst possible thing to be locked out of, and undocumented custom software is a well-known way for businesses to end up dependent on a single supplier.',
      },
      {
        question: 'What happens to our existing data?',
        answer:
          'Migration is planned as part of the project rather than treated as an afterthought, because it is where these projects most often go wrong. We map the existing data wherever it lives - a legacy system, a set of spreadsheets, or both - then clean and transform it, resolve duplicates and decide what is worth carrying across at all. Trial migrations run against a staging environment so the count and the content can be verified before anything is committed, and the old system stays available in parallel until the new one has been checked against it. Data that has accumulated for years in spreadsheets is rarely as consistent as anyone expects, and finding that out during a trial run is considerably cheaper than finding it out afterwards.',
      },
      {
        question: 'Who maintains it after launch?',
        answer:
          'We do, under an ongoing support arrangement covering monitoring, security and dependency updates, backups, integration upkeep and fixes, plus new features as the process changes. The first weeks after launch almost always surface refinements that only real use exposes - a missing field, an extra status, a permission that needs splitting, an alert that needs tuning - and those are handled within the arrangement rather than reopened as a new project. A whole new module goes through a short specification and is priced before development, so the boundary between support and new work is explicit in the agreement rather than argued about later. If you would rather run it with an internal team, we hand over documentation and support the transition.',
      },
    ],
  },
  ecommerce: {
    id: 'ecommerce',
    crumb: 'Online stores',
    eyebrow: 'E-commerce',
    heading: ['Online stores built in code,', 'not assembled from plugins'],
    subhead: 'Our e-commerce practice',
    lede: 'Catalogue, checkout, payments, inventory and order management - engineered as one system, integrated with the payment and invoicing providers your business actually uses, and fast enough to convert on mobile.',
    image: '/images/service1.webp',
    action: { label: 'Discuss your store', href: '/en/contact' },
    metaTitle: 'E-commerce Development - Custom Online Stores',
    metaDescription:
      'Custom online stores: product catalogue, secure checkout, Israeli payment and invoicing integrations, inventory and order management. Built in code, owned by you.',
    advantages: {
      eyebrow: 'OUR ADVANTAGES',
      heading: ['What sets our store builds apart'],
      lede: 'Why a coded storefront outlives a template once the catalogue and the order volume grow.',
      outro: 'Our team is ready to scope the catalogue, the checkout and the integrations. Are you?',
      action: { label: 'Discuss your store', href: '/en/contact' },
      roles: [
        {
          id: 'spec',
          title: 'The catalogue is designed first',
          art: '/images/service-page-discovery.webp',
          text: 'Product structure, variants, pricing rules and filters are modelled before any screen is designed. Retrofitting a catalogue model after launch is the single most expensive change in e-commerce.',
        },
        {
          id: 'code',
          title: 'Built in code, owned by you',
          art: '/images/service-page1.webp',
          text: 'No plugin tax, no template you cannot modify, no monthly licence for the parts that matter. You get the repository, the deployment pipeline and the ability to move providers without a rebuild.',
        },
        {
          id: 'scale',
          title: 'Speed that survives a full catalogue',
          art: '/images/service-page3.webp',
          text: 'Server-rendered pages, image pipelines and sensible caching, so a store with thousands of SKUs still loads on a mobile connection. Most abandoned carts start as an abandoned page load.',
        },
        {
          id: 'support',
          title: 'Maintained after launch',
          art: '/images/service-page4.webp',
          text: 'Payment providers change APIs, shipping partners change formats and dependencies need patching. Ongoing support means a broken checkout is found by monitoring rather than by a customer.',
        },
      ],
    },
    system: {
      eyebrow: 'WHAT YOU GET',
      heading: ['A store you can actually run'],
      art: '/images/management-console.webp',
      features: [
        {
          id: 'orders',
          icon: 'orders',
          title: 'Order management',
          text: 'Every order in one place with status, fulfilment and history, plus the automatic notifications the customer expects at each step.',
        },
        {
          id: 'club',
          icon: 'club',
          title: 'Customer accounts',
          text: 'Registered customers, saved addresses, order history and repeat purchase flows - the groundwork for retention rather than one-off sales.',
        },
        {
          id: 'sales',
          icon: 'sales',
          title: 'Checkout and payments',
          text: 'A short, mobile-first checkout wired to your payment provider, with automatic invoicing so finance is not reconciling orders by hand.',
        },
        {
          id: 'catalog',
          icon: 'catalog',
          title: 'Catalogue and inventory',
          text: 'Products, variants, collections and stock levels managed from one admin, with quantities that update as orders come in.',
        },
        {
          id: 'analytics',
          icon: 'analytics',
          title: 'Store analytics',
          text: 'Revenue, conversion and product performance in a dashboard built for decisions, not a raw export you have to interpret.',
        },
      ],
      action: { label: 'Discuss your store', href: '/en/contact' },
    },
    howItWorks: {
      eyebrow: 'HOW IT WORKS',
      heading: ['How it works. Straightforwardly.'],
      lede: 'Most store projects stall on catalogue and payment decisions, so we settle those first.',
      steps: [
        {
          id: 'discovery',
          title: 'Catalogue and requirements',
          text: 'We map products, variants, pricing and shipping rules, and confirm which payment and invoicing providers you use, before design starts.',
          art: '/images/howitwork1.webp',
        },
        {
          id: 'fit',
          title: 'Design and build',
          text: 'Storefront and checkout designed around the catalogue, then built in working increments you can click through - so changes land early instead of at handover.',
          art: '/images/howitwork2.webp',
        },
        {
          id: 'launch',
          title: 'Launch and support',
          text: 'Test transactions end to end, migrate products, go live, then monitor. Support continues after launch, because that is when real orders expose the edge cases.',
          art: '/images/howitwork3.webp',
        },
      ],
    },
    pricing: {
      eyebrow: 'PRICING',
      heading: ['Store management plans'],
      lede: 'Ongoing plans for running the store after it is built. Development is quoted per project.',
      plans: [
        {
          id: 'basic',
          name: 'Basic',
          audience: 'For small businesses',
          price: '500',
          priceNote: '₪ / month',
          term: 'on a 12-month term',
          action: { label: 'Start your store', href: '/en/contact' },
          featuresTitle: 'What you get',
          features: [
            { icon: 'storefront', label: 'One connected storefront' },
            { icon: 'products', label: 'Product, order and customer management' },
            { icon: 'inventory', label: 'Inventory and stock updates' },
            { icon: 'dashboard', label: 'Live store dashboard' },
          ],
        },
        {
          id: 'pro',
          name: 'Pro',
          audience: 'For growing stores',
          price: '800',
          priceNote: '₪ / month',
          term: 'on a 12-month term',
          badge: 'Most popular',
          featured: true,
          action: { label: 'Start your store', href: '/en/contact' },
          featuresTitle: 'Everything in Basic, plus',
          features: [
            { icon: 'automation', label: 'Automated order and customer flows' },
            { icon: 'shipping', label: 'Shipping provider integration' },
            { icon: 'report', label: 'Monthly performance reporting' },
            { icon: 'alerts', label: 'Stock and failure alerts' },
            { icon: 'support', label: 'Priority support' },
          ],
        },
        {
          id: 'enterprise',
          name: 'Enterprise',
          audience: 'For multi-store and custom operations',
          price: 'Custom',
          term: 'scoped to your operation',
          action: { label: 'Talk to us', href: '/en/contact' },
          featuresTitle: 'Everything in Pro, plus',
          features: [
            { icon: 'stores', label: 'Multiple storefronts and markets' },
            { icon: 'tailor', label: 'Custom features and workflows' },
            { icon: 'api', label: 'ERP and CRM integrations' },
            { icon: 'manager', label: 'A named account contact' },
            { icon: 'training', label: 'Team training and documentation' },
          ],
        },
      ],
      footnote: {
        text: 'Questions about which plan fits?',
        link: { label: 'Talk to us', href: '/en/contact' },
      },
    },
    banner: {
      heading: 'Want to see what your store could look like?',
      action: { label: 'Talk to us and we will scope it', href: '/en/contact' },
    },
    faqHeading: ['Questions we get', 'about online stores'],
    faqEntries: [
      {
        question: 'Do you build on Shopify and WooCommerce, or only custom?',
        answer:
          'Both, and the honest answer often is the platform. If your catalogue and workflows fit Shopify or WooCommerce, using one is faster and cheaper and we will say so rather than quote a build. We build custom when the platform fee, the plugin stack or the checkout constraints start costing more than they save - typically with large catalogues where speed and filtering become real problems, with pricing rules a template cannot express, or where the store has to integrate deeply with a warehouse or an ERP. The cost of a platform is rarely the monthly fee; it is the accumulation of plugins bought to work around limitations, each one a security and update dependency, and the checkout you are not allowed to change.',
      },
      {
        question: 'Can you connect the store to our payment and invoicing providers?',
        answer:
          'Yes, and this is usually where template stores break down. We integrate the Israeli card clearing provider and the invoicing system you already use - Morning (Green Invoice), Greeninvoice, iCount or Rivhit - so an order produces a payment and a legally valid invoice automatically instead of someone re-keying it at the end of the day. It is worth knowing the failure mode this prevents: when such a connection breaks, nothing on the store looks wrong. Orders keep arriving and no invoices are generated for them, which is typically discovered weeks later by an accountant rather than immediately by a customer. Our maintenance plans include integration upkeep and monitoring that flags a failed hand-off, because providers change their APIs without warning.',
      },
      {
        question: 'Who owns the store when the project ends?',
        answer:
          'You do. The repository, the deployment pipeline, the product and customer data and every service credential are yours, and documentation is handed over with them. There is no licence that stops working if you stop working with us, and no component held in our name, so the store can move to another developer without being rebuilt. This is the practical difference from a hosted platform, where your catalogue and design are yours but the system selling them is not, and where leaving means exporting what the export tool happens to support. Worth checking in writing in any proposal you are weighing: a supplier who will not commit to it on paper has answered a different question than the one you asked.',
      },
      {
        question: 'Can you migrate an existing store without losing search rankings?',
        answer:
          'Yes, and this is the single most important part of a store migration. The work includes a full URL map with permanent 301 redirects from every old address, preserved page structure, headings and metadata, product and customer data migration, end-to-end payment testing in a staging environment, and monitoring of index coverage and rankings after launch. We also switch over during a low-traffic window rather than mid-day. Most ranking loss in migrations comes from URLs quietly changing - a category path that gains a segment, a product slug that changes format - and a redirect map is what prevents it. A store that ranks today represents years of accumulated equity, and it is entirely possible to lose it in an afternoon.',
      },
      {
        question: 'How long does a store take to build?',
        answer:
          'It depends far more on catalogue complexity and integrations than on design. A focused store with a clean catalogue, one payment provider and one invoicing connection runs from about one to three months; multi-market stores with ERP integration, unusual pricing rules or thousands of SKUs take longer. The variables that actually move the date are the product model - variants, options, pricing rules, filters - and the number of external systems involved, since each integration carries its own error handling. We give a schedule after the catalogue and requirements step rather than before it, because a date quoted before anyone has seen the catalogue is a guess. Product photography and copy are, as usual, the most common source of delay.',
      },
      {
        question: 'How much maintenance does an online store need?',
        answer:
          'More than a marketing site does, and the difference is not marginal. Payment and invoicing providers change their APIs, dependencies need security patches, shipping partners change formats, and traffic patterns shift around campaigns and holidays. A store also fails silently in ways a brochure site cannot: a broken checkout or a failed invoice hand-off can run for days while orders keep arriving. Our plans cover uptime and transaction monitoring, updates, backups, integration upkeep and support, so problems surface through an alert rather than through a customer complaint. Pricing is published by plan and response times are written into the agreement, including for stores we did not build ourselves.',
      },
    ],
  },

  brochure: {
    id: 'brochure',
    crumb: 'Business websites',
    eyebrow: 'Business websites',
    heading: ['A business website that earns', 'the first impression and the enquiry'],
    subhead: 'Our website practice',
    lede: 'Positioning, structure, design and copy built into a fast coded site - the pages a prospect reads before deciding whether to contact you, and the enquiry flow that makes contacting you easy.',
    image: '/images/service3.webp',
    action: { label: 'Discuss your website', href: '/en/contact' },
    metaTitle: 'Business Website Design and Development',
    metaDescription:
      'Business website design and development: positioning and structure, UX and UI design, copywriting, mobile performance and lead capture - built in code, owned by you.',
    advantages: {
      eyebrow: 'OUR ADVANTAGES',
      heading: ['What sets our websites apart'],
      lede: 'Why a coded business site outperforms a template once it has to do real work.',
      outro: 'Our team is ready to plan the structure and build the site around it. Are you?',
      action: { label: 'Discuss your website', href: '/en/contact' },
      roles: [
        {
          id: 'spec',
          title: 'Structure before decoration',
          art: '/images/service-page-discovery.webp',
          text: 'We decide what each page has to prove and in what order, then design. A beautiful site with the wrong page order still loses the enquiry.',
        },
        {
          id: 'code',
          title: 'Built in code, owned by you',
          art: '/images/service-page1.webp',
          text: 'No template lock-in, no plugin stack quietly accumulating cost and attack surface. You own the repository and can move hosting or agency without rebuilding.',
        },
        {
          id: 'scale',
          title: 'Fast on a real phone',
          art: '/images/service-page3.webp',
          text: 'Server-rendered pages, optimised images and restrained scripts. Most business sites lose visitors to load time long before they lose them to content.',
        },
        {
          id: 'support',
          title: 'Accessible and maintained',
          art: '/images/service-page4.webp',
          text: 'Built to accessibility standards from the start rather than patched with an overlay afterwards, and kept updated so the site does not decay.',
        },
      ],
    },
    system: {
      eyebrow: 'WHAT YOU GET',
      heading: ['Everything the site needs to do'],
      art: '/images/service-brochure.webp',
      features: [
        {
          id: 'pages',
          icon: 'catalog',
          title: 'Pages that answer objections',
          text: 'Services, process, proof and pricing structured in the order a prospect actually asks about them, so the site does the qualifying for you.',
        },
        {
          id: 'leads',
          icon: 'orders',
          title: 'Enquiry capture that works',
          text: 'Forms that submit reliably, notify the right person immediately and land in your CRM instead of a shared inbox nobody watches.',
        },
        {
          id: 'audience',
          icon: 'club',
          title: 'Content you can edit',
          text: 'An admin for the text and images that change often, so routine updates do not require a developer or a support ticket.',
        },
        {
          id: 'landing',
          icon: 'sales',
          title: 'Landing pages for campaigns',
          text: 'Dedicated pages for paid traffic, built on the same system, so campaign spend lands somewhere designed to convert rather than on the homepage.',
        },
        {
          id: 'analytics',
          icon: 'analytics',
          title: 'Measurement from day one',
          text: 'Analytics and conversion tracking configured at launch, so you know which pages produce enquiries instead of guessing.',
        },
      ],
      action: { label: 'Discuss your website', href: '/en/contact' },
    },
    howItWorks: {
      eyebrow: 'HOW IT WORKS',
      heading: ['How it works. Straightforwardly.'],
      lede: 'Sites go wrong when design starts before anyone has agreed what the site must say.',
      steps: [
        {
          id: 'discovery',
          title: 'Positioning and structure',
          text: 'We agree the audience, the offer and the page structure, and what proof each page needs. This is where most of the value is decided.',
          art: '/images/howitwork1.webp',
        },
        {
          id: 'design',
          title: 'Design and copy',
          text: 'Interface and copy developed together rather than copy poured into a finished layout, so the words and the design support the same argument.',
          art: '/images/howitwork2.webp',
        },
        {
          id: 'launch',
          title: 'Build, launch, measure',
          text: 'Built in code, tested on real devices, launched with analytics and conversion tracking in place, then reviewed against actual enquiries.',
          art: '/images/howitwork3.webp',
        },
      ],
    },
    banner: {
      heading: 'Ready to see what your website could be?',
      action: { label: 'Talk to us and we will scope it', href: '/en/contact' },
    },
    faqHeading: ['Questions we get', 'about business websites'],
    faqEntries: [
      {
        question: 'How much does a business website cost?',
        answer:
          'It depends on the number of genuinely distinct templates rather than pages, on whether copy and photography are needed, and on how much of the content you want to manage yourself afterwards. Integrations move the figure too: a contact form is trivial, a booking flow wired into a CRM is not. We quote after the positioning and structure step, when the scope is actually known - a number given before that is a guess dressed as an estimate, and it is usually the reason budgets move during a build. The quote states what is included, what is excluded and what would count as an addition, which is also the only basis on which you can compare it against a competing proposal fairly.',
      },
      {
        question: 'Why build in code instead of using WordPress or Wix?',
        answer:
          'For a simple brochure site a platform is often fine, and we will tell you when that is the case rather than quote a build you do not need. Coded sites win in four situations: when performance matters, because Core Web Vitals feed directly into Google rankings and a template ships code for features you will never use; when the design cannot be forced into a template without fighting it; when plugin licences and their security exposure start to accumulate, since every plugin is an update dependency that can break something else; and when the site has to integrate with systems you already run, such as a CRM or Israeli invoicing. There is also ownership: with a coded site you receive the repository and can leave.',
      },
      {
        question: 'Can I update the content myself?',
        answer:
          'Yes. The text, images, prices and banners that change regularly are editable through an admin interface, without touching code and without opening a support ticket. Your team gets training at handover and written documentation to go with it. Structural changes - a new page type, a new integration, a change in behaviour - come to us, which is deliberate rather than restrictive: it is what stops a site drifting into six different layouts over a year, and it is equally true of WordPress. If you would rather not touch the site at all, routine content changes are included in our monthly maintenance plans within the hours the plan allows, so a banner update is not a separate conversation each time.',
      },
      {
        question: 'Do you write the copy?',
        answer:
          'We can, and we recommend it. Copy written alongside the design almost always outperforms copy supplied afterwards to fit a finished layout, because the structure and the argument are the same decision made twice. We write from the discovery call, the material you provide and keyword research, so the text does more than describe the business - it uses the phrases people actually search. If you have a writer we work with them from the structure step onward rather than at the end. Either way we review the copy together before launch, since you know your customers and the objections that recur in sales conversations better than any outside writer will. Content is also the most common cause of delay, so deciding who owns it early is worth doing.',
      },
      {
        question: 'Will the site be accessible?',
        answer:
          'Yes, and built in rather than bolted on. Semantic structure, a heading hierarchy a screen reader can traverse, full keyboard navigation, sufficient colour contrast, labelled form fields and alternative text are part of the build and are checked before launch rather than after a complaint. We build to Israeli standard IS 5568, which is based on WCAG 2.0 Level AA, and also implement WCAG 2.1 Level AA. In Israel this is a legal requirement and the exposure sits with the site owner rather than the builder. Accessibility overlays added after the fact tend to slow the site down without repairing the underlying markup: the widget sits above the page, while the broken structure, the low contrast and the unreachable navigation remain beneath it.',
      },
      {
        question: 'What does it cost to keep a business website running?',
        answer:
          'A live site needs hosting, an SSL certificate, a domain renewal, security and dependency patching, backups, uptime monitoring and occasional content work. Those are the recurring costs people forget when comparing build quotes, and they are the reason a cheap build sometimes turns out to be the expensive option. We offer this as a monthly plan with published pricing and a response time written into the agreement, starting at 290 shekels a month for a marketing site and 590 for one generating leads continuously. Alternatively we hand over the repository, the deployment pipeline and full documentation, and you run it internally or with another supplier - nothing in the build depends on us continuing.',
      },
    ],
  },

  marketing: {
    id: 'marketing',
    crumb: 'Paid campaigns',
    eyebrow: 'Paid media',
    heading: ['Paid campaigns judged on', 'cost per lead, not impressions'],
    subhead: 'Our paid media practice',
    lede: 'Google and Meta campaigns planned around your funnel stage, with creative, landing pages and conversion tracking built by the same team - so the ad, the page it lands on and the measurement agree with each other.',
    image: '/images/marketing-hero.webp',
    action: { label: 'Discuss your campaigns', href: '/en/contact' },
    metaTitle: 'PPC Management in Israel - Google and Meta Ads',
    metaDescription:
      'PPC management on Google and Meta: audience research, creative production, landing pages and conversion tracking, reported on cost per lead.',
    advantages: {
      eyebrow: 'OUR ADVANTAGES',
      heading: ['What sets our campaign work apart'],
      lede: 'Why campaigns run next to the engineering perform better than campaigns run beside it.',
      outro: 'Our team is ready to plan the campaigns and the pages behind them. Are you?',
      action: { label: 'Discuss your campaigns', href: '/en/contact' },
      roles: [
        {
          id: 'new',
          title: 'The landing page is part of the campaign',
          art: '/images/service-marketing-icon4.webp',
          text: 'We build the page the ad points at, not just the ad. Most wasted spend is not bad targeting - it is good traffic arriving somewhere that was never designed to convert it.',
        },
        {
          id: 'scale',
          title: 'Tracking that is actually correct',
          art: '/images/service-marketing-icon3.webp',
          text: 'Conversion tracking implemented in the code we wrote, verified end to end. Optimising toward a broken conversion event is worse than not optimising at all.',
        },
        {
          id: 'research',
          title: 'Research before spend',
          art: '/images/service-marketing-icon2.webp',
          text: 'Market, competitor and platform research first, so the budget starts against a considered angle instead of discovering the angle by burning through spend.',
        },
        {
          id: 'creative',
          title: 'Creative produced in-house',
          art: '/images/service-marketing-icon1.webp',
          text: 'Copy, static and video creative made by the same team, so new variants ship in days. Creative fatigue, not bidding, is what quietly kills most accounts.',
        },
      ],
    },
    system: {
      eyebrow: 'HOW WE RUN IT',
      heading: ['What campaign management includes'],
      art: '/images/service-marketing.webp',
      features: [
        {
          id: 'research',
          icon: 'catalog',
          title: 'Market and platform research',
          text: 'Who is already bidding, what they promise and where the gap is - then which platforms deserve budget for your funnel stage.',
        },
        {
          id: 'angles',
          icon: 'club',
          title: 'Positioning and angles',
          text: 'The specific claims each audience segment responds to, turned into a testable set of messages rather than one campaign with one promise.',
        },
        {
          id: 'campaigns',
          icon: 'sales',
          title: 'Campaign build and structure',
          text: 'Account structure, audiences, budgets and bidding set up so results are attributable and the account stays legible as it grows.',
        },
        {
          id: 'launch',
          icon: 'orders',
          title: 'Creative and landing pages',
          text: 'Ad creative and the pages behind it produced together, with variants prepared before performance starts to decay.',
        },
        {
          id: 'reports',
          icon: 'analytics',
          title: 'Optimisation and reporting',
          text: 'Ongoing optimisation with reporting on cost per lead and cost per acquisition - the numbers that decide budget, not impressions and clicks.',
        },
      ],
      action: { label: 'Discuss your campaigns', href: '/en/contact' },
    },
    howItWorks: {
      eyebrow: 'HOW IT WORKS',
      heading: ['How it works. Straightforwardly.'],
      lede: 'The first month buys information. We plan for that instead of promising results it cannot produce.',
      steps: [
        {
          id: 'manager',
          title: 'Research and setup',
          text: 'Market and competitor research, tracking implementation and account structure. We verify conversion tracking before spending, not after.',
          art: '/images/howitwork1.webp',
        },
        {
          id: 'variants',
          title: 'Test and learn',
          text: 'Several angles and creative variants run against each other on a controlled budget, until the data says which message and audience deserve scale.',
          art: '/images/howitwork2.webp',
        },
        {
          id: 'production',
          title: 'Scale and report',
          text: 'Budget moves to what works, creative is refreshed before fatigue sets in, and reporting stays on cost per lead so decisions are made on outcomes.',
          art: '/images/howitwork3.webp',
        },
      ],
    },
    banner: {
      heading: 'Want campaigns measured on leads, not clicks?',
      action: { label: 'Talk to us about your budget', href: '/en/contact' },
    },
    faqHeading: ['Questions we get', 'about paid campaigns'],
    faqEntries: [
      {
        question: 'What is a realistic minimum budget?',
        answer:
          'It depends on how competitive your market is far more than on which platform you use. The mechanism worth understanding is that a budget too small to gather conversion volume never leaves the learning phase, so the algorithm keeps optimising on guesswork rather than data - which is why splitting a modest budget across Google, Meta, Instagram and TikTok usually produces four underperforming campaigns instead of one working channel. With a limited budget we concentrate on high purchase-intent keywords, a defined geography and restricted hours, and expand only once the first channel proves itself. If a proposed budget sits below the level where management fees make sense, we say so in the first conversation and suggest local SEO or a Google Business Profile instead.',
      },
      {
        question: 'How soon will we see results?',
        answer:
          'First enquiries usually arrive within the opening weeks - that is the main advantage of paid over organic, which takes three to six months to show real movement. But a stable cost per lead only emerges after one to three months, once campaigns have accumulated enough conversions for the algorithm to optimise on data rather than assumption. The first month buys information: which audiences, which messages and which keywords actually produce enquiries. Anyone promising a specific cost per lead before launch is guessing, because the ad platforms themselves cannot supply that figure at that stage. We report what the first month found and what changes as a result, rather than presenting early volatility as either success or failure.',
      },
      {
        question: 'Do you build the landing pages too?',
        answer:
          'Yes, and we think it is the main reason our campaigns perform. When the same team writes the ad, builds the page and implements the tracking, there is no gap between what the ad promises and what the page delivers, and no argument about whose fault a poor conversion rate is - the failure mode where the agency blames the developer for a slow page and the developer blames the agency for irrelevant traffic simply does not arise. It also means a landing page can be changed the same week rather than queued with a third party. Pages ship with conversion tracking wired in from the start, so you can see the conversion rate rather than only the traffic that arrived.',
      },
      {
        question: 'Who owns the ad accounts?',
        answer:
          'You do. We work inside your accounts, or open them in your business name if they do not exist yet: Google Ads, Meta Ads Manager, GA4 and Google Search Console. We take management permission, not ownership. This sounds procedural but it is one of the sharper problems in the market - when campaigns run from an agency-owned account, moving to another supplier erases the algorithm learning history and forces a restart from zero. Here, ending the engagement means removing our access, not transferring an asset. It is worth asking this of any agency you are considering, before signing rather than afterwards, because the answer is difficult to change once the account already exists in someone else name.',
      },
      {
        question: 'Google or Meta - which should we start with?',
        answer:
          'Google captures demand that already exists; Meta creates demand among people who were not searching for anything. If people are actively searching for what you sell - a service with an obvious name and a clear moment of need - start with Google, where intent is already present and the click is closer to a purchase. If the category needs explaining, or the product is discovered rather than sought, Meta usually earns its place first. Most accounts end up running both, weighted differently by season and campaign. One practical difference worth planning for: on Meta the creative is the variable that moves cost per lead most, more than audience settings, so budget for producing and refreshing it rather than running one ad for months.',
      },
      {
        question: 'How do you report?',
        answer:
          'Monthly, on cost per lead and cost per acquisition, with what changed, what it produced and what we are testing next. Impressions and clicks appear as context, never as the headline, because they do not pay for anything. Reporting runs on full conversion tracking - GA4, the Meta pixel and Google Ads - from the click through to the form or the phone call, and where a CRM exists, through to the deal that closed. That is what lets you see which channel, campaign and individual ad produce paying customers rather than merely enquiries. When a number falls it appears as it is: volatility is part of the work, and a report that never contains a decline is being edited rather than measured.',
      },
    ],
  },

  branding: {
    id: 'branding',
    crumb: 'Brand and design',
    eyebrow: 'Brand and UX/UI',
    heading: ['Design that carries the business,', 'not just the aesthetic'],
    subhead: 'Our design practice',
    lede: 'Brand identity, visual language and interface design - from first concept to a specification developers can build from, made by a team that also has to build it.',
    image: '/images/service-branding-hero.webp',
    action: { label: 'Discuss your brand', href: '/en/contact' },
    metaTitle: 'Brand Identity and UX/UI Design Services',
    metaDescription:
      'Brand identity and UX/UI design: visual language, website and product interfaces, mobile app design and landing pages, delivered as a build-ready specification.',
    advantages: {
      eyebrow: 'OUR ADVANTAGES',
      heading: ['What sets our design work apart'],
      lede: 'Why design made next to engineering survives contact with implementation.',
      outro: 'Our team is ready to define the brand and design the interface. Are you?',
      action: { label: 'Discuss your brand', href: '/en/contact' },
      roles: [
        {
          id: 'brand',
          title: 'Identity with rules, not just a logo',
          art: '/images/service-branding-icon4.webp',
          text: 'Colour, type, spacing and tone documented as a system anyone can apply consistently - so the brand still looks like itself on the fifth page and the fiftieth ad.',
        },
        {
          id: 'web',
          title: 'Designed to be built',
          art: '/images/service-branding-icon3.webp',
          text: 'Components, states and breakpoints specified, not just three perfect screens. Handover includes the cases that break layouts: long text, empty states, error states.',
        },
        {
          id: 'mobile',
          title: 'Interfaces that behave on touch',
          art: '/images/service-branding-icon2.webp',
          text: 'Hover is not a thing on a phone. We design the touch behaviour explicitly rather than discovering at build time that half the interactions have no mobile equivalent.',
        },
        {
          id: 'landing',
          title: 'Accessible by construction',
          art: '/images/service-branding-icon1.webp',
          text: 'Contrast, focus states and hierarchy checked while designing. Accessibility problems fixed in design cost nothing; the same problems fixed after launch cost a rebuild.',
        },
      ],
    },
    system: {
      eyebrow: 'WHAT WE DELIVER',
      heading: ['From concept to build-ready'],
      art: '/images/service-branding.webp',
      features: [
        {
          id: 'discovery',
          icon: 'catalog',
          title: 'Discovery and positioning',
          text: 'Audience, competitors and the promise the brand has to carry, agreed before anything visual is proposed.',
        },
        {
          id: 'concept',
          icon: 'club',
          title: 'Visual identity',
          text: 'Logo, colour, typography and imagery direction, delivered with the rules that keep them coherent across every surface.',
        },
        {
          id: 'screens',
          icon: 'sales',
          title: 'Interface design',
          text: 'Website, product and mobile screens designed as a component system, with the states and breakpoints a build actually needs.',
        },
        {
          id: 'handoff',
          icon: 'orders',
          title: 'Developer handoff',
          text: 'Specifications, tokens and assets organised so engineering can build without guessing - or so we build it ourselves.',
        },
        {
          id: 'iterate',
          icon: 'analytics',
          title: 'Iteration after launch',
          text: 'Design revisited against real usage rather than treated as finished at handover, because the first version is a hypothesis.',
        },
      ],
      action: { label: 'Discuss your brand', href: '/en/contact' },
    },
    howItWorks: {
      eyebrow: 'HOW IT WORKS',
      heading: ['How it works. Straightforwardly.'],
      lede: 'Design decisions are cheapest at the start and most expensive after launch. We front-load them.',
      steps: [
        {
          id: 'research',
          title: 'Research and direction',
          text: 'Audience, competitors and the positioning the design has to express, agreed in writing before concepts - so feedback is about fit, not taste.',
          art: '/images/howitwork1.webp',
        },
        {
          id: 'concept',
          title: 'Concept and system',
          text: 'A direction developed into a working system: components, states, responsive behaviour and the rules that hold it together.',
          art: '/images/howitwork2.webp',
        },
        {
          id: 'handoff',
          title: 'Handoff and build',
          text: 'Specifications and assets handed to engineering - usually ours, sometimes yours - with the edge cases documented rather than discovered mid-build.',
          art: '/images/howitwork3.webp',
        },
      ],
    },
    banner: {
      heading: 'Ready to give the business a design that holds together?',
      action: { label: 'Talk to us about your brand', href: '/en/contact' },
    },
    faqHeading: ['Questions we get', 'about brand and design'],
    faqEntries: [
      {
        question: 'Do you do branding without building the website?',
        answer:
          'Yes. Identity, visual language and written guidelines are delivered as a standalone package that your own team or another agency can apply, with the source files included so nothing depends on us afterwards. We do ask what it will be built in, because a system designed with no implementation in mind tends not to survive one: colour choices that fail contrast requirements, type scales that collapse on mobile, and logo variants that do not exist at the sizes actually needed are all found at build time rather than in the presentation. Designing with the build in view costs nothing extra at this stage and avoids the round of quiet compromises that otherwise happens later, once the brand is already in use.',
      },
      {
        question: 'What do we actually receive at the end?',
        answer:
          'Source files, exported assets in every format you will actually need, and written guidelines covering colour, typography, spacing, logo usage and tone of voice - including the rules for what not to do, which is the half most guidelines omit and the half that gets broken first. For interface work you also receive a component specification with states and breakpoints: hover, focus, disabled, loading, error and empty, plus desktop and mobile. Everything is handed over and remains yours, whether or not you continue working with us. The guidelines are what keep the brand from fragmenting six months later, when a new supplier interprets the colours their own way and nobody has a document to point at.',
      },
      {
        question: 'Can you redesign an existing brand without starting over?',
        answer:
          'Often, yes, and it is usually the better answer. If there is real equity in the current identity - customers recognise it, it appears on signage, packaging and vehicles - we evolve it rather than replace it: tightening the system, correcting contrast ratios that fail accessibility requirements, producing the logo variants that were never made, and writing down the rules that only ever existed in one designer head. A full replacement is warranted when the identity actively works against the business, when it cannot be used in the places the business now needs it, or when the positioning itself has changed. We say which of these applies after looking at where the brand is currently used, not before.',
      },
      {
        question: 'How many concept directions do you present?',
        answer:
          'Usually two or three considered directions rather than a wall of options. Each arrives with the reasoning behind it - the positioning it expresses, the audience it addresses, and how it differs from what competitors in the category already look like - so the conversation is about which argument fits the business rather than which picture someone happens to like. Presenting twenty variations tends to produce decisions by committee taste, and the result is usually the least objectionable option rather than the most effective one. Each direction is shown applied to real surfaces the business actually uses, not on an abstract board, because a mark that works in isolation and fails on a mobile header has not been tested.',
      },
      {
        question: 'Do you design mobile apps as well as websites?',
        answer:
          'Yes - app interfaces, web products, admin panels and landing pages. The deliverable is the same shape in each case: a component system with states and behaviour specified, not a set of static screens. That distinction matters more than it sounds, because the screens that are missing from most design handovers are the ones that decide how the product feels in use - loading, error, empty state before any data exists, and what happens when a list has one item or two hundred. We specify those, along with breakpoints and interaction behaviour, so a developer is not left inventing them under time pressure. It is also why the same team can build what it designed without anything being reinterpreted at the handover.',
      },
      {
        question: 'Will the design pass accessibility requirements?',
        answer:
          'We design to meet them: contrast ratios checked against the standard rather than eyeballed, visible focus states on every interactive element, touch targets large enough to use, and a heading hierarchy that works with a screen reader. In Israel the applicable standard is IS 5568, based on WCAG 2.0 Level AA, and we also design to WCAG 2.1 Level AA. One distinction catches a great deal of brand work: a logo is exempt from contrast requirements, while the interface built around it is not - so a pale brand colour can be entirely legitimate on the mark and entirely unusable on a button or body text. Establishing an accessible palette at the identity stage avoids rebuilding it during the site build.',
      },
    ],
  },

  maintenance: {
    id: 'maintenance',
    crumb: 'Website maintenance',
    eyebrow: 'Website maintenance',
    heading: ['Website maintenance', 'with published prices and written response times'],
    subhead: 'Our maintenance service',
    lede: 'Monthly maintenance plans with visible pricing, response and fix times written into the agreement, security updates, backups and monitoring - including for sites we did not build.',
    image: '/images/service2.webp',
    action: { label: 'Request a maintenance quote', href: '/en/contact' },
    metaTitle: 'Website Maintenance Services - Monthly Plans',
    metaDescription:
      'Monthly website maintenance with published pricing and a written SLA: security updates, daily backups, uptime monitoring and IS 5568 accessibility checks.',
    advantages: {
      eyebrow: 'OUR ADVANTAGES',
      heading: ['What makes our maintenance different'],
      lede: 'Most maintenance providers will not publish what is included or how fast they respond. We do.',
      outro: 'Our team is ready to take responsibility for your site. Are you?',
      action: { label: 'Request a maintenance quote', href: '/en/contact' },
      roles: [
        {
          id: 'sla',
          title: 'Response times in writing, not promises',
          art: '/images/service-page-discovery.webp',
          text: 'Every plan states a response time and a fix time in the agreement. You know in advance what happens when the site goes down on a Friday, rather than discovering it at that moment.',
        },
        {
          id: 'security',
          title: 'Security as routine, not as incident response',
          art: '/images/service-page1.webp',
          text: 'Core, plugin and dependency updates, uptime monitoring and daily backups held off the server. Most breaches exploit known holes that a regular update cycle would already have closed.',
        },
        {
          id: 'accessibility',
          title: 'Accessibility treated as ongoing work',
          art: '/images/service-page3.webp',
          text: 'Israeli standard IS 5568 is not a one-off test. Any content change can break compliance, so accessibility is re-checked every maintenance cycle rather than once a year in an audit.',
        },
        {
          id: 'orphan',
          title: 'Including sites we did not build',
          art: '/images/service-page4.webp',
          text: 'Inherited a site whose developer has disappeared? We map what exists, recover access, document the current state and take responsibility from that point onwards.',
        },
      ],
    },
    system: {
      eyebrow: 'WHAT IS INCLUDED',
      heading: ['What maintenance covers - and what it does not'],
      art: '/images/service-maintenance.webp',
      features: [
        {
          id: 'updates',
          icon: 'orders',
          title: 'System and dependency updates',
          text: 'Core, plugin and code dependency updates, each verified against the live site so an update does not quietly break something else.',
        },
        {
          id: 'backup',
          icon: 'catalog',
          title: 'Backups and uptime monitoring',
          text: 'Automatic daily backups stored off the server, plus monitoring that alerts us when the site goes down - before a customer calls you about it.',
        },
        {
          id: 'content',
          icon: 'club',
          title: 'Routine content changes',
          text: 'Text, image, price and banner updates within the hours included in your plan, without opening a new project every time something needs changing.',
        },
        {
          id: 'integrations',
          icon: 'sales',
          title: 'Israeli integrations upkeep',
          text: 'Morning (Green Invoice), iCount, Rivhit and card clearing. Providers change their APIs and connections fail silently. We find and fix them.',
        },
        {
          id: 'report',
          icon: 'analytics',
          title: 'Monthly report',
          text: 'What was done this month, what monitoring caught and what we recommend fixing next - in plain language rather than a technical log.',
        },
      ],
      action: { label: 'Request a maintenance quote', href: '/en/contact' },
    },
    howItWorks: {
      eyebrow: 'HOW IT WORKS',
      heading: ['How it starts. Straightforwardly.'],
      lede: 'Maintenance begins with a survey, not a signature. First we establish what exists, then we commit.',
      steps: [
        {
          id: 'audit',
          title: 'Survey and condition check',
          text: 'We establish what the site is built on, which plugins and versions are running, the state of backups and security, and what is already broken.',
          art: '/images/howitwork1.webp',
        },
        {
          id: 'handover',
          title: 'Access transfer and documentation',
          text: 'We recover access to hosting, domain and connected systems, document the current state and settle ownership - which matters most when the previous developer has vanished.',
          art: '/images/howitwork2.webp',
        },
        {
          id: 'ongoing',
          title: 'Ongoing maintenance and reporting',
          text: 'A fixed cycle of updates, backups and monitoring, with a monthly report and a named contact who actually knows your site.',
          art: '/images/howitwork3.webp',
        },
      ],
    },
    pricing: {
      eyebrow: 'PRICING',
      heading: ['Website maintenance plans'],
      lede: 'Published monthly prices on an annual term. Every plan states a defined response time and fix time.',
      plans: [
        {
          id: 'basic',
          name: 'Basic',
          audience: 'For marketing sites and landing pages',
          price: '290',
          priceNote: '₪ / month',
          term: 'on a 12-month term',
          action: { label: 'Get a quote', href: '/en/contact' },
          featuresTitle: 'What you get',
          features: [
            { icon: 'automation', label: 'Core, plugin and dependency updates' },
            { icon: 'inventory', label: 'Daily off-server backups' },
            { icon: 'alerts', label: 'Uptime monitoring and alerts' },
            { icon: 'support', label: 'Response within 24 business hours' },
          ],
        },
        {
          id: 'pro',
          name: 'Business',
          audience: 'For sites generating leads continuously',
          price: '590',
          priceNote: '₪ / month',
          term: 'on a 12-month term',
          badge: 'Most popular',
          featured: true,
          action: { label: 'Get a quote', href: '/en/contact' },
          featuresTitle: 'Everything in Basic, plus',
          features: [
            { icon: 'products', label: 'Up to two hours of content changes monthly' },
            { icon: 'api', label: 'Integration upkeep (Green Invoice, CRM)' },
            { icon: 'dashboard', label: 'Quarterly IS 5568 accessibility check' },
            { icon: 'report', label: 'Structured monthly report' },
            { icon: 'support', label: 'Response within 4 business hours' },
          ],
        },
        {
          id: 'ecommerce',
          name: 'Stores and platforms',
          audience: 'For online stores and management systems',
          price: 'Custom',
          term: 'scoped to the system',
          action: { label: 'Talk to us', href: '/en/contact' },
          featuresTitle: 'Everything in Business, plus',
          features: [
            { icon: 'storefront', label: 'Catalogue, checkout and shipping upkeep' },
            { icon: 'tailor', label: 'Ongoing development and new features' },
            { icon: 'manager', label: 'A named contact who knows the system' },
            { icon: 'alerts', label: 'Transaction monitoring and failure alerts' },
            { icon: 'training', label: 'Team training and documentation' },
          ],
        },
      ],
      footnote: {
        text: 'Not sure which plan fits?',
        link: { label: 'Talk to us and we will check the site', href: '/en/contact' },
      },
    },
    banner: {
      heading: 'Want to know what condition your site is actually in?',
      action: { label: 'Request a site condition check', href: '/en/contact' },
    },
    faqHeading: ['Questions we get', 'about website maintenance'],
    faqEntries: [
      {
        question: 'How much does website maintenance cost per month?',
        answer:
          'It is easier to compare annually. Our guide to yearly website maintenance cost puts a small marketing site at roughly ₪300 to ₪900 a year when it is mostly domain and hosting, a business site under managed maintenance at ₪2,000 to ₪6,000 a year, and an online store at ₪6,000 and above. Our Basic plan is ₪290 per month and the Business plan is ₪590 per month, both on an annual term; stores and platforms are quoted against scope. Those figures buy a defined cycle of updates, daily off-server backups, uptime monitoring and a written response time rather than an open-ended promise of support. A full breakdown of what a site costs to keep running across a year, including hosting, domain, SSL and accumulated technical debt, is set out in our guide to yearly website maintenance cost.',
      },
      {
        question: 'What does a maintenance plan include, and what does it exclude?',
        answer:
          'Included: core, plugin and dependency updates, daily backups held off the server, uptime monitoring, fault fixing, and content changes within the hours your plan allows. Excluded: building new features, redesigning pages, writing marketing copy and running advertising campaigns. Those are quoted separately and deliberately so, because bundling them into a monthly fee means paying every month for work you consume once a year. The boundary is written into the agreement rather than left to interpretation, which is what makes it possible to compare our plan against another supplier on equal terms instead of comparing two different definitions of the word maintenance.',
      },
      {
        question: 'Do you maintain sites you did not build?',
        answer:
          'Yes, and it is a large part of the work. It starts with a survey: what the site is built on, which versions are running, what state the backups are in and what is already broken. Then we recover access to hosting, domain, DNS and connected systems, document the current state and settle ownership formally - which matters most in the common case where the previous developer has disappeared, nobody has the code, and the domain is registered to someone who no longer answers email. Once that is resolved the site enters the normal maintenance cycle. We will tell you honestly if a site is too far gone to maintain economically and a rebuild would cost less.',
      },
      {
        question: 'What is the difference between website maintenance and website support?',
        answer:
          'Maintenance is proactive and scheduled: updates, backups and monitoring that happen on a fixed cycle whether or not anything has gone wrong. Support is reactive - you get in touch when something breaks, and it is usually billed by the hour or by the call. A business buying support alone pays less in an ordinary month and more in the month something happens, and crucially nobody prevented the fault in the first place. In our plans the scheduled work is covered by the monthly price, alongside an allowance of hours for changes; work beyond that allowance is quoted separately and in advance rather than appearing on the invoice as a surprise. That is also why we publish what is included and what is not - so you can compare us with another supplier on the same terms.',
      },
      {
        question: 'What are the actual response times?',
        answer:
          'On the Basic plan, within 24 business hours. On the Business plan, within 4 business hours. A fault that takes the site down entirely is treated as top priority on every plan regardless of tier. Both the response time and the fix time are written into the agreement rather than left as a verbal assurance, which means you have something to point at when it matters. This is worth checking against any competing quote you receive: many maintenance contracts specify a monthly price and a list of tasks but never state how quickly anyone is obliged to answer when the site stops working.',
      },
      {
        question: 'Does maintenance cover accessibility under IS 5568?',
        answer:
          'On the Business plan and above, yes - a quarterly check. This matters because accessibility is not a fixed state that a site reaches once and keeps. Adding an image without alternative text, changing a button colour so contrast drops below the required ratio, or embedding a third-party widget that traps keyboard focus can each break compliance that was previously in place. A one-off audit describes the site on the day it was performed and nothing after that. Israeli businesses are legally required to meet IS 5568, and the exposure sits with the site owner rather than with whoever built it, so treating accessibility as a recurring maintenance item rather than a launch task is the safer position.',
      },
      {
        question: 'What happens to integrations when a provider changes its API?',
        answer:
          'This is one of the quietest and most expensive failures a site can have: the connection to Green Invoice, iCount or the card clearing provider stops working, orders keep arriving, and no invoice is generated for any of them. Nothing on the site looks broken, so it is often found weeks later by an accountant rather than immediately by a customer. On the Business plan integration upkeep is included, covering repairs when a provider changes its interface, along with monitoring that flags a failed hand-off rather than waiting for someone to notice the gap in the invoice sequence.',
      },
      {
        question: 'Can we cancel the contract?',
        answer:
          'The plans run on an annual term, because maintenance is measured over time rather than in a single month - the value of an update cycle and a backup regime only shows up when something eventually goes wrong. At the end of the term you are free not to renew, and you receive every access credential, all backups and the full documentation when you leave. The site is yours regardless of whether we continue working together, and nothing in the arrangement is designed to make leaving difficult or to leave you dependent on us for access to your own infrastructure.',
      },
    ],
  },
  automation: {
    id: 'automation',
    crumb: 'Business automation',
    eyebrow: 'Business automation',
    heading: ['Business automation', 'that connects your systems and ends the re-keying'],
    subhead: 'Our automation and AI workflow service',
    lede: 'Automation that joins your website, WhatsApp, CRM and invoicing into one flow: a lead arrives, gets answered, recorded and scheduled without anyone copying details by hand - with AI used only where a fixed rule is not enough.',
    image: '/images/service-platform.webp',
    action: { label: 'Book a process-mapping call', href: '/en/contact' },
    metaTitle: 'Business Automation Services in Israel - CRM, WhatsApp and AI Workflows',
    metaDescription:
      'Business automation for Israeli companies: leads routed into your CRM, WhatsApp bots, Green Invoice and iCount links, order sync and automated reports.',
    advantages: {
      eyebrow: 'Why us',
      heading: ['What business automation services include'],
      lede: 'Business automation services map the repeating processes in a company, connect the systems involved through their APIs, define the rules and the AI steps, and run the result with monitoring and upkeep. Ours also include what most providers leave to you: a run log, failure alerts and repairs when a system changes its API.',
      outro: 'Want to know which of your processes is worth automating first?',
      action: { label: 'Book a process-mapping call', href: '/en/contact' },
      roles: [
        {
          id: 'process',
          title: 'The process comes before the tool',
          art: '/images/service-page1.webp',
          text: 'Before choosing Make, n8n or code, we map how a lead, an order and an invoice actually travel between people and systems today, exceptions included. Automation built around a tool rather than the process breaks on the first exception and hands the manual work straight back.',
        },
        {
          id: 'israeli',
          title: 'Connected to the Israeli stack',
          art: '/images/service-page2.webp',
          text: 'Green Invoice (Morning), iCount, Rivhit, Hashavshevet and Priority on the accounting side; Fireberry, Powerlink, Monday and HubSpot on the CRM side; WhatsApp Business API, Israeli card clearing and couriers. Allocation numbers, VAT and Hebrew fields included - the details an international integration does not know about.',
        },
        {
          id: 'ai',
          title: 'AI where it genuinely helps',
          art: '/images/service-page3.webp',
          text: 'When the rule is clear - form submitted, so open a lead - plain automation is cheaper and more reliable. AI steps in where free text has to be understood: classifying an enquiry, summarising a call, drafting a first reply or pulling a figure out of a document. Every AI output passes a validation rule before it touches a system.',
        },
        {
          id: 'monitoring',
          title: 'You see it when something stalls',
          art: '/images/service-page4.webp',
          text: 'Every run is logged, a failure raises an alert instead of disappearing quietly, and a record that did not sync is retried rather than lost. After launch we keep monitoring and maintaining the connections, because an invoicing API changes without asking you first.',
        },
      ],
    },
    system: {
      eyebrow: 'What gets automated',
      heading: ['The processes businesses', 'automate with us'],
      art: '/images/service-cms.webp',
      features: [
        {
          id: 'leads',
          icon: 'orders',
          title: 'Leads from the site and WhatsApp straight into the CRM',
          text: 'A website form, a WhatsApp message or a campaign lead becomes a CRM record with its source, campaign and first answers attached - and gets a first reply within a minute, not the next morning.',
        },
        {
          id: 'whatsapp',
          icon: 'club',
          title: 'WhatsApp bot and first response',
          text: 'Questions about price, availability and opening hours are answered automatically, the enquiry is qualified against the questions you defined, and anything off-script moves to a person with the full history.',
        },
        {
          id: 'billing',
          icon: 'sales',
          title: 'Quotes, invoices and collections',
          text: 'A deal closed in the CRM produces the quote, the invoice in Green Invoice or iCount and the payment reminder - same details, no double entry and no invoice someone forgot to issue.',
        },
        {
          id: 'orders',
          icon: 'catalog',
          title: 'Orders, stock and shipping',
          text: 'A store order updates inventory, books the shipment with the courier and sends the customer a tracking number. When a product runs out, the site knows before the customer orders it.',
        },
        {
          id: 'reports',
          icon: 'analytics',
          title: 'Automated reports and alerts',
          text: 'A morning digest of yesterday’s leads, sales and collections, and a WhatsApp alert when a lead has gone two hours without a reply or a process has failed - instead of finding out at month end.',
        },
      ],
      action: { label: 'Book a process-mapping call', href: '/en/contact' },
    },
    howItWorks: {
      eyebrow: 'How it works',
      heading: ['From mapping to running. In stages.'],
      lede: 'Three stages, and you see a result at the end of each one before the next begins.',
      steps: [
        {
          id: 'map',
          title: 'Process mapping',
          text: 'We sit with the people doing the work today and draw the process as it really is: where data enters, who copies it, where it gets lost. Then we rank what to automate first by hours saved.',
          art: '/images/howitwork1.webp',
        },
        {
          id: 'build',
          title: 'Build and connect',
          text: 'We connect the systems through their APIs, map the fields, define the rules and what happens on failure. Every automation is tested on real data before it touches the CRM or issues an invoice.',
          art: '/images/howitwork2.webp',
        },
        {
          id: 'run',
          title: 'Run, monitor, improve',
          text: 'We go live gradually, follow the run log and fix what reality reveals. Once it is stable we move to ongoing upkeep of the connections and to the next automation on the list.',
          art: '/images/howitwork3.webp',
        },
      ],
    },
    banner: {
      heading: 'Want to see how many hours a month automation would save you?',
      action: { label: 'Book a process-mapping call', href: '/en/contact' },
    },
    faqHeading: ['Frequently asked questions', 'about business automation'],
    faqEntries: [
      {
        question: 'What is business automation, and which processes can be automated?',
        answer:
          'Business automation connects the systems you already run so that an event in one of them triggers the next step by itself: a lead from the website is opened in the CRM and gets a first reply, a closed deal produces an invoice, a store order creates a shipment. The processes worth automating first are the ones that repeat every day and involve copying data by hand: lead intake, first response on WhatsApp, quotes and invoices, payment reminders, inventory sync and reporting. During mapping we measure how many hours a month each process consumes and start with the one that saves the most. Nothing is automated on a hunch; the saving is counted before the build begins.',
      },
      {
        question: 'How much does automation cost for a small business?',
        answer:
          'Setup is priced by the number of systems connected and the number of scenarios, not by company size. A WhatsApp bot with automatic replies and a CRM connection is usually a project of a few thousand shekels; a full lead flow with quotes sits in the middle; automation that also links accounting, inventory and shipping costs more. Our cost guide in the blog sets out the structure, and the exact figure for your business follows the process mapping. Alongside the one-off build there is a monthly cost for the tools themselves - the CRM, the WhatsApp messaging provider and the automation platform - which depends on usage volume, plus ongoing upkeep of the connections.',
      },
      {
        question: 'What is the difference between plain automation and automation with AI?',
        answer:
          'Plain automation follows a fixed rule: if a form is submitted, open a lead; if a deal closes, issue an invoice. It is cheap, fast and predictable, which is why it is the foundation of most processes. AI comes in when the input is free text that a rule cannot interpret: classifying a WhatsApp enquiry, summarising a call into a CRM note, extracting an amount and date from a scanned invoice or drafting a first reply in Hebrew. In our builds every AI output passes a validation rule before it changes a record, and when confidence is low the item goes to a person. You get the flexibility without letting the model invent anything.',
      },
      {
        question: 'Which systems do you connect to?',
        answer:
          'The ones you already run, and in particular the Israeli ones an international integration does not know: Green Invoice (Morning), iCount, Rivhit, Hashavshevet and Priority on the accounting side, including allocation numbers and VAT; Fireberry, Powerlink, Monday, HubSpot and Zoho on the CRM side; WhatsApp Business API, Israeli card clearing, courier companies, Shopify and WooCommerce, Google Sheets and calendars. Where a system has no open API we work through scheduled file export and import. Every connection has a field mapping and a defined failure path, so a record is written once and lands in the right place.',
      },
      {
        question: 'Which tools do you use: Make, n8n, Zapier or code?',
        answer:
          'Whichever will hold up over time for the specific process. Make and n8n have the edge when the scenario is simple and you want to see and edit it yourself; n8n also runs on your own server, which matters when the data is sensitive. Zapier is convenient for American SaaS but lacks the Israeli systems. When the process is complex, the volume is high or real business logic is needed, we write the connection in code on top of the systems’ APIs, with tests and a log. The answer is often a mix of both, and the choice is explained in the specification document so you know why.',
      },
      {
        question: 'How long does it take to set up automation?',
        answer:
          'A single focused automation, such as routing website leads into the CRM with a first reply on WhatsApp, usually goes live within one to three weeks from mapping to running. A wider setup connecting several systems - CRM, invoicing, inventory and shipping - is measured in one to two months, because each connection is a small project with its own testing. We launch gradually: one process first, running alongside the manual work, compare the results, and only then switch the manual work off and move to the next process. That order keeps the business running while the automation proves itself.',
      },
      {
        question: 'What happens when an automation fails?',
        answer:
          'It does not fail quietly. Every run is logged with its input, output and result; a failure sends an alert by WhatsApp or email to the people you named, and the record that did not go through is queued and retried instead of vanishing. Invoicing and CRM APIs change from time to time without notice, so after launch we stay on ongoing upkeep: monitoring, updating the connections and responding when something stalls. You get access to the run log, so even without contacting us you can see what ran, what failed and why.',
      },
      {
        question: 'Is this suitable for a small business without an IT person?',
        answer:
          'Yes, and most of our automation clients are businesses of two to twenty people with no IT department. You do not need to know what an API is: during mapping we talk about leads, invoices and working hours, and we take the technical side. After launch the team gets a short walkthrough and a document explaining what runs and when, and the parts you can edit yourselves - a bot script or a message template - are left open for editing. Ongoing upkeep covers the rest.',
      },
    ],
  },
  'ai-agents': {
    id: 'ai-agents',
    crumb: 'AI agents',
    eyebrow: 'AI agents',
    heading: ['AI agents that answer customers', 'and act inside your systems'],
    subhead: 'Our AI agent service',
    lede: 'An AI agent that answers from your own content, carries out real actions in the systems you already run - opening a lead, booking a meeting, checking an order - and knows the moment to hand the conversation to a person.',
    image: '/images/service-agents-hero.webp',
    action: { label: 'Request an agent discovery call', href: '/en/contact' },
    metaTitle: 'AI Agent Development for Businesses in Israel',
    metaDescription:
      'AI agent development for Israeli businesses: replies in Hebrew and English around the clock, lead qualification, booking, and CRM and WhatsApp connections.',
    advantages: {
      eyebrow: 'Why us',
      heading: ['What is different about our AI agents'],
      lede: 'The distance between an impressive demo and an agent you can leave in front of customers is what happens when it does not know the answer.',
      outro: 'Want to find out which of your enquiries an agent could actually take?',
      action: { label: 'Request an agent discovery call', href: '/en/contact' },
      roles: [
        {
          id: 'grounding',
          title: 'Answers from your content, not the model',
          art: '/images/service-page1.webp',
          text: 'The agent answers out of your pricing, terms and catalogue rather than the general knowledge it was trained on. A question with no source behind it gets a defined "I do not know" and moves on, because a price it invents is a commitment made in your name.',
        },
        {
          id: 'actions',
          title: 'It acts, it does not only reply',
          art: '/images/service-page2.webp',
          text: 'An agent that only answers hands the work back to you. Ours connect to the systems you run: opening a lead, booking into the calendar, updating an order status. Every action is permission-scoped, written to a log and reversible.',
        },
        {
          id: 'bilingual',
          title: 'Hebrew and English, tested on real messages',
          art: '/images/service-page3.webp',
          text: 'Hebrew is where most off-the-shelf agents come apart: mixed spelling, abbreviations, product names in Latin script mid-sentence and RTL rendering. We test on real enquiries from your business rather than on sample questions.',
        },
        {
          id: 'handoff',
          title: 'Handover to a person at the right moment',
          art: '/images/service-page4.webp',
          text: 'The stopping rules are set in advance: a refund request, a complaint, anger in the wording, or three replies that did not resolve it. The conversation moves across with the full transcript, so the customer never starts the story again.',
        },
      ],
    },
    system: {
      eyebrow: 'What it does',
      heading: ['What an AI agent does in your business'],
      art: '/images/service-agents.webp',
      features: [
        {
          id: 'answer',
          icon: 'orders',
          title: 'First response around the clock',
          text: 'Questions about price, availability, opening hours and order status are answered the moment the enquiry arrives - at ten at night and on a Saturday, not the next morning.',
        },
        {
          id: 'qualify',
          icon: 'club',
          title: 'Lead qualification',
          text: 'The agent asks the qualifying questions you defined - type of business, scope, timeline - so what reaches you is a lead with answers attached rather than a name and a phone number.',
        },
        {
          id: 'book',
          icon: 'sales',
          title: 'Booking and CRM updates',
          text: 'Checking calendar availability, booking the slot, sending the reminder and opening the client record, without anyone re-keying details at the end of the day.',
        },
        {
          id: 'knowledge',
          icon: 'catalog',
          title: 'Your content as the only source',
          text: 'Pricing, service terms, catalogue and FAQs are loaded as the knowledge base. Update a document and the answers move with it instead of quietly going stale.',
        },
        {
          id: 'log',
          icon: 'analytics',
          title: 'Logging and measurement',
          text: 'Every conversation is kept: what was asked, what was answered, what went to a human and where the agent got stuck. That record is what lets us improve it on evidence rather than guesswork.',
        },
      ],
      action: { label: 'Request an agent discovery call', href: '/en/contact' },
    },
    howItWorks: {
      eyebrow: 'How it works',
      heading: ['How an agent gets built. Simply.'],
      lede: 'We start from the conversations your business already has, not from the model.',
      steps: [
        {
          id: 'scenarios',
          title: 'Scenario discovery',
          text: 'We read the real enquiries of recent months, mark what repeats, decide what the agent takes and what stays with a person. That boundary is agreed in writing before any code is written.',
          art: '/images/howitwork1.webp',
        },
        {
          id: 'build',
          title: 'Build and system connections',
          text: 'We load the knowledge sources, define which actions are permitted and connect the calendar, CRM, WhatsApp and invoicing - each action scoped to its own narrow permission.',
          art: '/images/howitwork2.webp',
        },
        {
          id: 'pilot',
          title: 'Pilot and refinement',
          text: 'We run it on part of the traffic, read actual transcripts and correct. Only once the answers hold to the standard agreed in discovery does the agent take every enquiry.',
          art: '/images/howitwork3.webp',
        },
      ],
    },
    banner: {
      heading: 'Want to know which of your enquiries an AI agent could take?',
      action: { label: 'Request an agent discovery call', href: '/en/contact' },
    },
    faqHeading: ['Frequently asked questions', 'about AI agents'],
    faqEntries: [
      {
        question: 'What is an AI agent, and how does it differ from a chatbot?',
        answer:
          'A classic chatbot runs on a decision tree - press 1 for pricing, 2 for support - and breaks the moment a customer phrases something nobody scripted. An AI agent understands an open question, retrieves the answer from your knowledge sources, and can carry out an action: opening a lead, booking a meeting or checking an order status instead of pointing at a form. The practical difference is that an agent finishes tasks while a bot only routes them. That difference is also what makes it more expensive to build, because an action that changes data needs permissions, an audit trail and a way to undo it.',
      },
      {
        question: 'How do you stop the agent making answers up?',
        answer:
          'A language model is built to produce an answer even when it has no source, and in a business deployment that is the real risk. We restrict the agent to your material only: pricing, service terms, catalogue and procedures. When a question has no source behind it, the defined behaviour is to say so and pass the conversation to a person. Before launch we run a set of deliberately awkward questions to find where it gives way. The reason this matters is simple: a price or a commitment the agent states to a customer is a statement made in your name, and the gap between a wrong answer and a missing one is the gap between a complaint and a follow-up call.',
      },
      {
        question: 'Does the agent work properly in Hebrew?',
        answer:
          'Yes, and Hebrew is precisely where many off-the-shelf agents fall down. Hebrew text arrives with mixed full and defective spelling, heavy use of abbreviations, product names in Latin script in the middle of a sentence, and RTL directionality that affects how replies render in WhatsApp and on the site. An agent built in English and translated afterwards answers correctly in a demo and breaks on how an Israeli customer actually writes. We therefore test on real enquiries from your business rather than on sample questions, and that is often the stage where it emerges that the price list itself is written in a way nobody can answer from.',
      },
      {
        question: 'What can the agent connect to?',
        answer:
          'To the systems you already run. On the enquiry side that is usually WhatsApp Business and the chat on your site; behind them a CRM, a calendar, an Israeli invoicing system such as Green Invoice, iCount or Rivhit, and your product or order data. Each connection is given a narrow permission: the agent can read an order status but not change a price, open a lead but not delete a customer. Every action is written to a log with its time, its conversation and its result, so afterwards you can check exactly what happened rather than relying on a model to recall it.',
      },
      {
        question: 'What happens when the agent does not know, or the customer gets angry?',
        answer:
          'The handover rule is written during discovery, not improvised at runtime. The agent passes to a person when the customer asks for one, when the subject is a refund, a complaint or a legal matter, when anger or distress is detected in the wording, and when three consecutive replies have failed to resolve the issue. The handover carries the full transcript, so the customer does not tell the story from the beginning - that is the point at which most deployments irritate people more than they serve them. Outside working hours the agent collects the details, states when someone will come back, and opens a task rather than leaving the enquiry hanging.',
      },
      {
        question: 'How long does it take to build an AI agent?',
        answer:
          'The timeline follows the number of actions the agent performs far more than the number of questions it answers. An agent that answers from a price list and service documents and hands off to a person is a comparatively short project. One that books meetings, opens CRM records and updates order statuses needs permission design, failure handling and testing, and takes longer. In either case we start with a pilot on part of the traffic: read real transcripts, correct, and only then widen. That stage looks like a delay, and it is the thing that stops the agent meeting every customer with the same mistake.',
      },
      {
        question: 'What does AI agent development cost?',
        answer:
          'Pricing follows the scope of discovery and the number of system connections, which is why we do not publish a single figure for this service - one number would not survive contact with two different projects. What is worth knowing in advance is the shape of the cost: a one-off build, alongside a monthly running cost covering model usage and maintenance. Model cost grows with conversation volume, so we present it as a range against an estimated volume rather than a fixed sum. In the discovery call we will also tell you the less comfortable version: whether your enquiry volume is too small to justify an agent at all.',
      },
    ],
  },
  'llm-integration': {
    id: 'llm-integration',
    crumb: 'LLM integration & RAG',
    eyebrow: 'LLM integration & RAG',
    heading: ['LLM integration & RAG', 'GPT, Claude and Gemini answering from your own documents'],
    subhead: 'Our language model integration service',
    lede: 'We connect a language model such as GPT, Claude or Gemini to your internal information: chat over company documents, a knowledge assistant for your team, search across Hebrew files, extraction and summaries for contracts and invoices, and a custom assistant that answers only from your sources. It suits businesses with a lot of written knowledge and too little time to search through it.',
    image: '/images/services-view.webp',
    action: { label: 'Request a feasibility check', href: '/en/contact' },
    metaTitle: 'LLM Integration & RAG for Business - Chat Over Documents and Knowledge Assistants',
    metaDescription:
      'Connect GPT, Claude and Gemini to your business data: chat over documents, an internal knowledge assistant, RAG over Hebrew files, extraction and summaries, and private deployment with data privacy in mind. We start with a feasibility check.',
    advantages: {
      eyebrow: 'Why us',
      heading: ['What is different about our LLM integrations'],
      lede: 'A language model on its own invents answers with complete confidence. We build the system around it that fetches the right source, shows you where each answer came from, and knows how to say "I could not find it".',
      outro: 'Want to find out whether your documents can answer questions?',
      action: { label: 'Request a feasibility check', href: '/en/contact' },
      roles: [
        {
          id: 'sources',
          title: 'Every answer with its source',
          art: '/images/service-page1.webp',
          text: 'Each answer arrives with the passages it was taken from, so you can click through and check the original document. When the information is not there, the assistant says so instead of filling the gap from imagination.',
        },
        {
          id: 'hebrew',
          title: 'Real business Hebrew',
          art: '/images/service-page2.webp',
          text: 'Retrieval is tested on Hebrew documents as they really are: scans, tables, acronyms, trade terms and a mix of Hebrew and English. Not only on a clean file picked for the demo.',
        },
        {
          id: 'model-choice',
          title: 'A model chosen for the task',
          art: '/images/service-page3.webp',
          text: 'We are not tied to one vendor. The same questions run against several models and we choose by quality, speed and running cost, so the model can be swapped later without rebuilding the system.',
        },
        {
          id: 'privacy',
          title: 'Privacy inside the specification',
          art: '/images/service-page4.webp',
          text: 'From the start we decide what data is sent to a model at all, who may see which document, and whether a private deployment makes sense. It is an early decision, not a last-minute add-on.',
        },
      ],
    },
    system: {
      eyebrow: 'What we build',
      heading: ['What a language model does with your data'],
      art: '/images/service-cms.webp',
      features: [
        {
          id: 'chat',
          icon: 'orders',
          title: 'Chat over company documents',
          text: 'Ask in plain language about procedures, quotes, contracts or product guides and get a short answer with a link to the original passage.',
        },
        {
          id: 'assistant',
          icon: 'club',
          title: 'An internal knowledge assistant',
          text: 'Support, sales or training teams answer customers and new hires from a single knowledge base, instead of digging through folders and asking whoever already knows.',
        },
        {
          id: 'rag',
          icon: 'catalog',
          title: 'RAG over Hebrew documents',
          text: 'Document preparation, splitting into passages, a semantic search index and testing on real questions, so the model receives the right passage before it answers.',
        },
        {
          id: 'extraction',
          icon: 'analytics',
          title: 'Extraction and summarisation',
          text: 'Pulling fields from invoices, contracts and forms into a table, and summarising long documents and email threads, with anything uncertain flagged for human review.',
        },
        {
          id: 'private',
          icon: 'sales',
          title: 'Custom assistants and private deployment',
          text: 'A GPT-style assistant tuned to your field and tone of voice, in your own cloud or on a self-hosted open model when the data cannot leave the organisation.',
        },
      ],
      action: { label: 'Request a feasibility check', href: '/en/contact' },
    },
    howItWorks: {
      eyebrow: 'How it works',
      heading: ['How a project runs. Simply.'],
      lede: 'We start small, with one set of documents and real questions, and widen the scope only once the answers are right.',
      steps: [
        {
          id: 'scope',
          title: 'Mapping sources and questions',
          text: 'Together we collect the documents and the questions your team really asks, check what is sensitive, and define what a good answer looks like. From that we build a fixed test set.',
          art: '/images/howitwork1.webp',
        },
        {
          id: 'prototype',
          title: 'Prototype and quality testing',
          text: 'We build an assistant over part of the material and run the test set against it. We measure how many answers are correct, how many lack a source and how many were invented, then improve until you accept the result.',
          art: '/images/howitwork2.webp',
        },
        {
          id: 'launch',
          title: 'Rollout, permissions and upkeep',
          text: 'We connect it to the channel your team already uses - your site, WhatsApp, Slack or an internal system - set permissions and automatic document updates, and review failed questions to keep improving.',
          art: '/images/howitwork3.webp',
        },
      ],
    },
    banner: {
      heading: 'Want your team to get answers straight from your business documents?',
      action: { label: 'Request a feasibility check', href: '/en/contact' },
    },
    faqHeading: ['Frequently asked questions', 'about LLM integration and RAG'],
    faqEntries: [
      {
        question: 'What is RAG, and why is plain ChatGPT not enough?',
        answer:
          'RAG combines search with a language model: before the model answers, the system finds the relevant passages in your documents and hands them over together with the question. Ordinary ChatGPT does not know your procedures, price lists or contracts, so it will guess or answer in generalities. With RAG the answer is grounded in a source, you can see where it came from, and knowledge is updated by replacing a document rather than retraining a model. It is the most common way to connect a language model to organisational information. The first build is relatively quick; the steady improvement afterwards is what separates a demo from a working tool.',
      },
      {
        question: 'Does it work on Hebrew documents?',
        answer:
          'Yes, but Hebrew has to be tested rather than assumed. The large language models understand Hebrew well, yet the search step that finds the right passage for them is sensitive to spelling, acronyms, poor scans and tables. So we choose the search method and the model only after running real questions against your documents, including questions phrased in different ways. If some files are scanned images we add a text recognition step, and we flag in advance any documents that cannot be read at acceptable quality. The feasibility check shows you how the system handles your most awkward files before you commit to anything larger, so surprises come early and cheaply.',
      },
      {
        question: 'How do you stop the model inventing answers?',
        answer:
          'Zero errors cannot be promised, but they can be reduced a great deal and made visible. The assistant is instructed to answer only from the passages it retrieved, shows the source with each answer, and says it found nothing when the information is missing. Before launch we run a fixed set of questions and review the results by hand, including questions whose answer is not in the documents at all. After launch, failed questions are saved and used to improve the system. For sensitive topics a human can approve the answer before it reaches a customer. The aim is an assistant you can rely on, one that is honest about the limits of what it knows and hands over to a person when it should.',
      },
      {
        question: 'Is our data sent to companies like OpenAI or Google?',
        answer:
          'That is decided in the specification. One option is a business-grade API from a major provider, where the terms of use state whether data is used for training, and where only the passages needed for a question are sent rather than the whole archive. When data cannot leave the organisation, an open model runs on a server you control. Each option is chosen by how sensitive the data is, and for personal data the provider\'s terms must be checked. We prepare a written description of the data flow that you can pass to your privacy adviser. That lets you decide from a clear document rather than from a vendor\'s general promises, and your adviser can review the same description.',
      },
      {
        question: 'What about privacy and Amendment 13 to the Privacy Protection Law?',
        answer:
          'Amendment 13 to Israel\'s Privacy Protection Law broadened the obligations of bodies that hold personal data, so privacy enters the specification from day one. In practice we work on data minimisation: we do not load documents into the assistant that it does not need, we limit access by role, we log usage, and a document can be removed from the index. We do not give legal advice. If your database is sensitive, we describe exactly what is collected, where it is stored and who can reach it, so your adviser can decide whether more steps are needed. The topic is worked through with you at the start of the project and is not left for the launch stage, when changing course is harder.',
      },
      {
        question: 'How long does a first assistant take, and what do we get at the end?',
        answer:
          'A prototype over one set of documents and real questions can usually be shown within a few weeks, depending on the quality of the documents and the number of systems it connects to. At the end you receive an assistant working in the channel your team already uses, the code for the connection and the index, a test set that shows the accuracy level, and a document explaining how to add and update documents. The code belongs to you. After launch you can leave monitoring and ongoing improvement with us, or take a handover session and run it yourselves. In the first conversation we will check together how likely it is that your documents suit this approach, and say plainly if they do not.',
      },
    ],
  },
  'data-analytics': {
    id: 'data-analytics',
    crumb: 'Data analytics & dashboards',
    eyebrow: 'Data analytics & dashboards',
    heading: ['Data analytics & BI dashboards', 'every number in one place, updated on its own'],
    subhead: 'Our data analytics service',
    lede: 'Connecting your CRM, store, Google and Meta campaigns, GA4 and accounting system into one dataset, defining the metrics everyone agrees on, building Looker Studio or Power BI dashboards and sending automated reports to WhatsApp and email - so owners and managers see what is happening without waiting for the month-end spreadsheet.',
    image: '/images/services-view.webp',
    action: { label: 'Request a data source review', href: '/en/contact' },
    metaTitle: 'Data Analytics & BI Dashboards for Business - Looker Studio, Power BI and Automated Reports',
    metaDescription:
      'Dashboards and reporting for Israeli businesses: connecting CRM, Shopify and WooCommerce, Google and Meta ads, GA4 and accounting software such as Priority and iCount, data warehouse, data cleaning and automated WhatsApp reports.',
    advantages: {
      eyebrow: 'Why us',
      heading: ['What is different about our data analytics work'],
      lede: 'A good dashboard is judged by one question: does anyone open it and make a decision. So we start from the questions your business asks, and only then from the tools.',
      outro: 'Want to see where your business numbers scatter today?',
      action: { label: 'Request a data source review', href: '/en/contact' },
      roles: [
        {
          id: 'kpi-first',
          title: 'Metrics first, charts second',
          art: '/images/service-page1.webp',
          text: 'Before connecting anything we sit down with you and define what counts as a lead, what counts as a sale and how profitability is calculated. The definitions are written in one document, so marketing, sales and management stop arguing about whose number is right.',
        },
        {
          id: 'israeli-stack',
          title: 'Systems used in Israel',
          art: '/images/service-page2.webp',
          text: 'We know what businesses here actually run: Priority, iCount, Green Invoice, Rivhit, plus local CRM systems and store platforms. When no ready-made connector exists, we build one through an API or a scheduled export.',
        },
        {
          id: 'clean-data',
          title: 'Data cleaning without hiding gaps',
          art: '/images/service-page3.webp',
          text: 'Duplicates, empty fields, lead sources typed three different ways - we fix what can be fixed and flag what cannot. Missing data is shown as missing instead of disappearing into an average.',
        },
        {
          id: 'ownership',
          title: 'The dashboard and the data are yours',
          art: '/images/service-page4.webp',
          text: 'Accounts, the data store and the dashboards are opened in the business\'s name, and you manage access. If you later want to continue alone or with another provider, you will not have to rebuild everything.',
        },
      ],
    },
    system: {
      eyebrow: 'What we build',
      heading: ['What data analytics gives your business'],
      art: '/images/service-cms.webp',
      features: [
        {
          id: 'connect',
          icon: 'analytics',
          title: 'Connecting data sources',
          text: 'CRM, Shopify and WooCommerce, Google Ads, Meta Ads, GA4, the accounting system and spreadsheets - pulled automatically and refreshed at a rhythm that suits the business.',
        },
        {
          id: 'warehouse',
          icon: 'catalog',
          title: 'Data warehouse and ETL',
          text: 'When data grows or comes from many systems, we set up a central store with collection and transformation jobs, so the dashboard does not depend on a manual export that breaks whenever a column changes.',
        },
        {
          id: 'dashboards',
          icon: 'sales',
          title: 'Looker Studio and Power BI dashboards',
          text: 'A management view, a marketing view and a sales view, filterable by period, source and team. The choice between the tools follows your budget, your team and the systems already in use.',
        },
        {
          id: 'reports',
          icon: 'orders',
          title: 'Automated reports to WhatsApp and email',
          text: 'A daily or weekly summary that reaches owners and managers on schedule, plus an instant alert when a metric moves out of range - for example a cost per lead that jumped or a store whose sales dropped.',
        },
        {
          id: 'attribution',
          icon: 'club',
          title: 'Marketing and profitability measurement',
          text: 'Tying campaign spend to the revenue that was actually closed, to see which channel brings paying customers and not just clicks, and to calculate acquisition cost and profitability by customer or product.',
        },
      ],
      action: { label: 'Request a data source review', href: '/en/contact' },
    },
    howItWorks: {
      eyebrow: 'How it works',
      heading: ['How a project runs. Simply.'],
      lede: 'We begin with one screen that answers one question, and expand only after the numbers prove correct and people actually use them.',
      steps: [
        {
          id: 'mapping',
          title: 'Mapping sources and metrics',
          text: 'We go through every system that holds data, define the metrics that matter and decide who needs to see what. The stage ends with a list of connections, metric definitions and an order of work.',
          art: '/images/howitwork1.webp',
        },
        {
          id: 'pipeline',
          title: 'Connecting and cleaning',
          text: 'We connect the sources, clean duplicates and inconsistent fields, and compare the totals in the dashboard with the original reports. A number that does not reconcile with the accounting system does not move forward.',
          art: '/images/howitwork2.webp',
        },
        {
          id: 'dashboard',
          title: 'Dashboard, reports and training',
          text: 'We build the screens, set up automated reports and alerts, and train the team to read and adjust them. After launch, sources and screens can be added as needed.',
          art: '/images/howitwork3.webp',
        },
      ],
    },
    banner: {
      heading: 'Want to see all your business numbers on one screen?',
      action: { label: 'Request a data source review', href: '/en/contact' },
    },
    faqHeading: ['Frequently asked questions', 'about data analytics and dashboards'],
    faqEntries: [
      {
        question: 'How is a BI dashboard different from machine learning?',
        answer:
          'A dashboard shows what happened and what is happening now: sales by month, cost per lead by channel, open invoices. Machine learning tries to predict what will happen or to classify records, and suits cases with many repeated decisions. For most businesses the first and most worthwhile step is the dashboard, because it reveals which data exists and in what quality. If a question later justifies a forecasting model, the pipeline already built feeds it, and there is no need to start again. That second part is handled under our machine learning service. The decision on what to build first follows the most urgent business question you have.',
      },
      {
        question: 'Which systems can a dashboard connect to?',
        answer:
          'Almost any system that lets you reach its data: an API, a scheduled export or access to the database. In practice we connect CRMs, Shopify and WooCommerce stores, Google Ads, Meta Ads, GA4, Google Sheets and accounting software such as Priority, iCount, Green Invoice and Rivhit. If an older system has no interface, we check for an automatic export to email or a folder. The mapping stage gives you a clear list of what connects directly, what needs a workaround and what may be worth replacing. If one system matters especially to you, mention it in the first enquiry and we will test it before committing to a work plan.',
      },
      {
        question: 'Which is better, Looker Studio or Power BI?',
        answer:
          'Looker Studio is free, runs in the browser and connects easily to Google tools, so it suits most small and mid-size businesses and marketing teams. Power BI is stronger for complex models, advanced calculations and integration with the Microsoft environment, and it makes sense for organisations already on Office 365 or with large data volumes. We are not tied to one tool, and during mapping we recommend based on your team, your budget and who needs access. You can also start with one and move to the other later if the data sits in a separate store. The recommendation is given in writing with the reasoning, and you decide whether to follow it or choose differently.',
      },
      {
        question: 'Can we receive reports on WhatsApp?',
        answer:
          'Yes. We can send owners or managers a regular summary at a set time, for example yesterday\'s sales, new leads and cost per lead, and add an instant alert when a metric leaves the range you defined. Sending goes through the official WhatsApp Business interface and follows its template policy, and alongside or instead of it we can send an email with a PDF or a link to the dashboard. What is sent, to whom and how often is agreed with you, so the messages stay useful and do not become noise that people ignore. In every case messages go only to recipients you approved, and you can stop or change them at any moment.',
      },
      {
        question: 'What if our data is messy?',
        answer:
          'It almost always is, and that does not stop a project from starting. During the connection stage we check for duplicates, empty fields, different names for the same channel and gaps between systems, and we fix whatever can be enforced by automatic rules. What cannot be repaired is flagged in the dashboard rather than hidden. We also suggest small changes at the point of entry, such as a required field in a form, so the problem does not return. Before launch we compare totals with the original reports, so you know which numbers you can rely on. Such fixes usually come down to small configuration changes, not to replacing systems or repeating manual work every month.',
      },
      {
        question: 'What do we get at the end of the project?',
        answer:
          'Dashboards that work and refresh on their own, the data connections and the data store if one was built, scheduled reports and alerts, and a document defining every metric: where it comes from, how it is calculated and what it leaves out. Accounts and access are registered in the business\'s name. You also get team training and a question session after launch. Afterwards you can continue with us for maintenance and new screens, or run everything yourselves, and the connections give you exactly the same ability in both cases. Training includes short written documentation, so a new employee can also understand how the dashboard is built.',
      },
    ],
  },
  'ai-consulting': {
    id: 'ai-consulting',
    crumb: 'AI consulting & implementation',
    eyebrow: 'AI consulting & implementation',
    heading: ['AI consulting & implementation', 'from readiness check to daily use across the team'],
    subhead: 'Our AI consulting service',
    lede: 'AI consulting and implementation is the process of mapping where artificial intelligence actually saves time in your business, choosing the right tool and model (ChatGPT, Claude, Gemini or Copilot), setting a usage policy and security rules, training the team in Hebrew, and running a measured pilot before rolling it out company-wide.',
    image: '/images/services-view.webp',
    action: { label: 'Request an AI readiness review', href: '/en/contact' },
    metaTitle: 'AI Consulting & Implementation for Business - Readiness, Policy and Team Training',
    metaDescription:
      'AI consulting for Israeli businesses: a readiness review, mapping the processes where AI pays off, choosing tools (ChatGPT, Claude, Gemini, Copilot), usage policy and data security, Hebrew team training and a pilot with ROI measurement.',
    advantages: {
      eyebrow: 'Why us',
      heading: ['What is different about our AI consulting'],
      lede: 'You get recommendations you can act on: a list of processes ranked by benefit, a tool chosen after a trial on your own work, and a team that knows how to use it.',
      outro: 'Want to know where AI would save you the most time?',
      action: { label: 'Request an AI readiness review', href: '/en/contact' },
      roles: [
        {
          id: 'process-first',
          title: 'The process first, the tool second',
          art: '/images/service-page1.webp',
          text: 'We do not start from a fashionable model but from what the team actually does in a week: who types the same data twice, who answers the same questions, where people wait for approval. Only after that mapping do we decide where AI fits.',
        },
        {
          id: 'no-vendor',
          title: 'Advice with no vendor loyalty',
          art: '/images/service-page2.webp',
          text: 'We do not represent a single vendor. ChatGPT, Claude, Gemini and Copilot are tested on real tasks from your business, Hebrew included, and the recommendation comes with reasoning - sometimes including a recommendation not to buy licences at all.',
        },
        {
          id: 'hebrew-training',
          title: 'Hebrew training on your own work',
          art: '/images/service-page3.webp',
          text: 'Workshops where employees write prompts on the documents, emails and data of their own role rather than generic examples. Every participant leaves with working templates they can use the next day.',
        },
        {
          id: 'safe-by-default',
          title: 'Security and privacy from day one',
          art: '/images/service-page4.webp',
          text: 'We define what may be uploaded to a tool and what may not, which business plans retain data and which do not, and who approves a new use. That way team adoption does not turn into exposure of customer information.',
        },
      ],
    },
    system: {
      eyebrow: 'What is included',
      heading: ['What you get with AI guidance'],
      art: '/images/service-cms.webp',
      features: [
        {
          id: 'readiness',
          icon: 'analytics',
          title: 'Readiness review and process mapping',
          text: 'A review of the processes, tools and data in the business, and a ranked list of where AI pays off: customer service, quotes, meeting summaries, reports, content writing and document checks.',
        },
        {
          id: 'tools',
          icon: 'catalog',
          title: 'Choosing tools and models',
          text: 'ChatGPT Team or Enterprise, Claude, Gemini and Copilot compared against your tasks - on Hebrew quality, integration with Google Workspace or Microsoft 365, user management and privacy terms.',
        },
        {
          id: 'policy',
          icon: 'orders',
          title: 'A company AI usage policy',
          text: 'A short, clear document for employees: which data must never be entered, when human review is required, how to label AI-generated content and who owns a new tool. You can start from the draft in /tools/ai-policy-generator.',
        },
        {
          id: 'training',
          icon: 'club',
          title: 'Team training and workshops',
          text: 'Hebrew workshops by role - sales, service, finance, marketing, management - with practice on real material, a short internal guide and a follow-up session a few weeks later.',
        },
        {
          id: 'pilot',
          icon: 'sales',
          title: 'Pilot, rollout and ROI',
          text: 'A pilot with a small group and one metric before expanding: hours saved, response time, error rate. The decision to expand or stop rests on numbers from your own business.',
        },
      ],
      action: { label: 'Request an AI readiness review', href: '/en/contact' },
    },
    howItWorks: {
      eyebrow: 'How it works',
      heading: ['How the engagement runs. Simply.'],
      lede: 'Every stage ends with your decision whether to continue, so you never pay for rollout before it is clear that it makes business sense.',
      steps: [
        {
          id: 'audit',
          title: 'Readiness review and mapping',
          text: 'Conversations with the people who own each role, a review of existing tools and data, and a short report: which three to five processes to start with, the risk in each and what must be settled first.',
          art: '/images/howitwork1.webp',
        },
        {
          id: 'pilot',
          title: 'Pilot and policy',
          text: 'We choose a tool, set the usage policy and run a pilot with a small group on one process, against a metric agreed in advance. If the result does not justify going further, we stop here.',
          art: '/images/howitwork2.webp',
        },
        {
          id: 'rollout',
          title: 'Team rollout and measurement',
          text: 'We extend to the rest of the team with training and working templates, and keep measuring. Where an off-the-shelf tool is not enough, the next step is automation or a custom AI agent, covered by our separate services.',
          art: '/images/howitwork3.webp',
        },
      ],
    },
    banner: {
      heading: 'Want to start using AI in your business without the risk and without guessing?',
      action: { label: 'Request an AI readiness review', href: '/en/contact' },
    },
    faqHeading: ['Frequently asked questions', 'about AI consulting and implementation'],
    faqEntries: [
      {
        question: 'How is AI consulting different from building an AI agent or system?',
        answer:
          'Consulting answers the question of what you should do: which processes AI pays off in, which tool fits, what rules are needed and how to train the team. Building an agent, a prediction model or an automation is the execution stage, and it is handled by our separate services. The split matters because much of the value comes from off-the-shelf tools that already exist, and sometimes the honest answer is that nothing needs to be developed. If the mapping shows that a custom solution is worth building, you receive an initial specification that you can take to another supplier as well.',
      },
      {
        question: 'How do we know whether our business is ready for AI?',
        answer:
          'Readiness comes down to four things: whether processes are repeatable and written down, whether data is accessible rather than scattered across WhatsApp messages, whether one person owns the subject, and whether management is willing to try something small first. You do not need an IT department or a huge dataset. In the readiness review we score each area and say what is missing, and sometimes the first recommendation is to tidy documents or name an owner for a process, and only then pick a tool. You can get a first picture at no cost with the /tools/ai-readiness-checker tool on our site.',
      },
      {
        question: 'Which tool should we choose: ChatGPT, Claude, Gemini or Copilot?',
        answer:
          'No single tool wins every task, and the choice depends on your working environment and the kind of work. An organisation living in Microsoft 365 gets value from Copilot, one on Google Workspace from Gemini, and teams that write and analyse a lot of Hebrew text should test ChatGPT and Claude closely. So we do not recommend from online rankings. We run the same five to ten of your real tasks through each tool and compare quality, speed, user management and privacy terms. The result is a reasoned recommendation, and quite often a combination of two tools rather than one.',
      },
      {
        question: 'Is a company AI usage policy really necessary?',
        answer:
          'Yes, even for a small business, because without one each employee decides alone what to paste into an external tool: a contract, a client list, payroll data. A good policy is short and practical, usually a page or two: which tools are approved, which types of information must never be entered, when human review is mandatory before something goes to a client, and who to ask when in doubt. It also helps when a business customer or a public body asks how you use AI. We draft it with you and fit it to the tools you chose; binding legal advice should come from a lawyer.',
      },
      {
        question: 'How do you measure the return on an AI rollout?',
        answer:
          'Before the pilot we pick a single metric and measure it as it stands today: how long a quote takes, how many enquiries are answered per day, how many errors are caught in review. After a few weeks we compare against the same metric. We do not rely on impressions such as "it feels easier", because those do not justify licences. The calculation also includes costs that are easy to forget: the time spent on human review, licences and training, so the saving is not one that exists only on paper. If the gap is too small, we will tell you to stop or try a different process.',
      },
      {
        question: 'Is it safe to enter business and customer information into AI tools?',
        answer:
          'It depends on the tool and the plan. On business plans such as ChatGPT Team or Enterprise, Claude for Work or Gemini inside Workspace, vendors generally commit not to train their models on your data, but that is not the case for free personal accounts. So the policy requires company accounts only, removal or coding of sensitive details, and a list of information types that must never be entered at all. On Amendment 13 to the Israeli Privacy Protection Law we document what is entered and where it goes, and in sensitive cases we refer you to a privacy adviser.',
      },
    ],
  },
  'voice-agents': {
    id: 'voice-agents',
    crumb: 'Voice AI agents & phone bots',
    eyebrow: 'Voice AI agents & phone bots',
    heading: ['Hebrew voice AI agents for business', 'phone answering wired into your systems'],
    subhead: 'Our voice agent service',
    lede: 'Answering incoming calls, an after-hours line, appointment booking by phone, outbound reminder calls and a summary of every call written straight into the CRM - a voice agent that speaks Hebrew, runs on top of your existing phone system and hands over to a person the moment it should.',
    image: '/images/services-view.webp',
    action: { label: 'Request a voice agent scoping', href: '/en/contact' },
    metaTitle: 'Hebrew Voice AI Agents for Business - Phone Answering, Booking and Reminder Calls',
    metaDescription:
      'Hebrew voice AI agents for Israeli businesses: answering incoming calls, an after-hours line, appointment booking by phone, reminder calls, call summaries into the CRM and handoff to a person. We start with scoping and a voice quality test.',
    advantages: {
      eyebrow: 'Why us',
      heading: ['What is different about our voice agents'],
      lede: 'A phone call is less forgiving than a chat: there is no scrolling back, no time to think, and the caller expects an answer immediately. So we test the agent on real calls before it is connected to your line.',
      outro: 'Want to hear how a voice agent would answer your customers?',
      action: { label: 'Request a voice agent scoping', href: '/en/contact' },
      roles: [
        {
          id: 'hebrew-quality',
          title: 'Hebrew quality tested before launch',
          art: '/images/service-page1.webp',
          text: 'Hebrew speech recognition and text-to-speech are good today but not perfect: names, addresses, numbers, accents and background noise all trip them up. Before launch we measure how often recognition fails on calls like yours and pick the right engine, rather than promising an accuracy we cannot keep.',
        },
        {
          id: 'handoff',
          title: 'Handoff to a person without losing the call',
          art: '/images/service-page2.webp',
          text: 'The agent knows what it does not know. When the caller is upset, asks for a person or raises something outside the defined scope, the call goes to a team member together with a short summary, so nobody has to explain everything again.',
        },
        {
          id: 'telephony',
          title: 'Works on the telephony you already have',
          art: '/images/service-page3.webp',
          text: 'There is no need to change your number or your exchange. The agent connects through your existing telephony provider or PBX - for example Voicenter, 019, a PBX or Twilio - and takes calls on the number customers already know.',
        },
        {
          id: 'records',
          title: 'Every call logged and summarised',
          art: '/images/service-page4.webp',
          text: 'Each call keeps a summary, the caller\'s details and the action taken, and these flow into the customer record in the CRM automatically. You can review calls and refine the script according to what actually happened.',
        },
      ],
    },
    system: {
      eyebrow: 'What we build',
      heading: ['What a voice agent does in your business'],
      art: '/images/service-cms.webp',
      features: [
        {
          id: 'inbound',
          icon: 'orders',
          title: 'Answering incoming calls',
          text: 'The agent picks up in the first second, finds out what the caller needs, answers common questions from your own content and routes anyone who needs it to the right person or team.',
        },
        {
          id: 'after-hours',
          icon: 'club',
          title: 'An after-hours line',
          text: 'In the evening, on Saturdays and on holidays calls no longer go unanswered: the agent collects details, sorts by urgency and leaves the team a tidy summary to start the day.',
        },
        {
          id: 'booking',
          icon: 'catalog',
          title: 'Appointment booking by phone',
          text: 'Checking the calendar, booking, changing and cancelling an appointment in one call, with a confirmation message to the customer. Suited to clinics, treatment centres, garages and any business that lives by its calendar.',
        },
        {
          id: 'outbound',
          icon: 'sales',
          title: 'Outbound reminder calls',
          text: 'An appointment reminder, a request to confirm attendance, a follow-up on an open invoice or a follow-up call to a lead. Every call ends with a clear outcome that is recorded in your system.',
        },
        {
          id: 'crm',
          icon: 'analytics',
          title: 'Call summaries straight into the CRM',
          text: 'A transcript, a short summary, the caller\'s intent and the next task are written to the right record, so the team sees exactly what was agreed without listening to recordings.',
        },
      ],
      action: { label: 'Request a voice agent scoping', href: '/en/contact' },
    },
    howItWorks: {
      eyebrow: 'How it works',
      heading: ['How a project runs. Simply.'],
      lede: 'Every stage ends with your decision whether to continue, and no real call reaches the agent before we have tested it.',
      steps: [
        {
          id: 'scoping',
          title: 'Call scoping and script',
          text: 'We go through real calls, map the reasons people phone and define what the agent does, what it hands to a person and what it never does. The stage ends with a written script and a list of integrations.',
          art: '/images/howitwork1.webp',
        },
        {
          id: 'pilot',
          title: 'Pilot and quality test',
          text: 'We connect the agent to a test line, run simulated calls and a limited number of real ones, and measure speech recognition, response time and the share of calls handed to a person. If quality is not enough, we fix it or stop.',
          art: '/images/howitwork2.webp',
        },
        {
          id: 'launch',
          title: 'Launch and monitoring',
          text: 'We switch the line, or only the after-hours calls, to the agent, monitor conversations and refine the script according to what happens, and every change is tested before it goes live.',
          art: '/images/howitwork3.webp',
        },
      ],
    },
    banner: {
      heading: 'Want every call answered, even when nobody is in the office?',
      action: { label: 'Request a voice agent scoping', href: '/en/contact' },
    },
    faqHeading: ['Frequently asked questions', 'about voice agents and phone bots'],
    faqEntries: [
      {
        question: 'How is a voice agent different from a WhatsApp or chat AI agent?',
        answer:
          'The principle is similar, but the channel changes everything. In chat the customer reads and types at their own pace; on the phone they expect an answer within a fraction of a second, interrupt the agent mid-sentence and speak over background noise. So a voice agent needs speech recognition, speech synthesis and turn-taking, and a shorter script. Our chat and WhatsApp agents are described on the AI agents page, and in many projects both channels share the same knowledge base and the same CRM connection. That also drives the architecture: a short response time matters more than a detailed phrasing. That difference shapes the script as well.',
      },
      {
        question: 'How good and accurate is the Hebrew on a call?',
        answer:
          'Hebrew speech recognition and synthesis have improved a great deal, but they are still less accurate than English. Common difficulties are personal and street names, phone and ID numbers, different accents, calls from a car or the street, and switching between Hebrew and English terms. So we test the engine on recordings from your business, ask the caller to confirm critical details, and hand over to a person when recognition is uncertain. We do not promise an accuracy figure before we have measured it. Every engine is tested on real recordings, and if it does not reach the bar agreed in advance, we swap it or narrow the range of topics the agent handles.',
      },
      {
        question: 'Are we allowed to record calls handled by a voice agent?',
        answer:
          'Recording and processing calls involves personal data, so the subject falls under Israeli privacy and wiretapping rules. In general it is standard practice to tell the caller at the start that the call is recorded and handled by an automated system, and to keep only what is needed for the stated purpose. This is not legal advice: the wording of the notice, the retention period and the legal basis should be confirmed with your own legal counsel, and we configure the system according to their decision. That way the caller knows what is happening with their call, and the business settles its consents and procedures before the agent answers the first call.',
      },
      {
        question: 'Do we need to replace our phone exchange or number?',
        answer:
          'Usually not. The agent connects to the telephony you already have. With providers such as Voicenter and 019, with a PBX, or with a service such as Twilio, calls can be routed to the agent by rules - for example only after hours, only when the line is busy, or only on a specific number. The number stays the same, and a call that needs a person returns to your queue or your usual team member. In the feasibility check we confirm which connection your provider supports before any commitment. If you run an older exchange, we plan the link through a SIP gateway or call forwarding instead of replacing your infrastructure.',
      },
      {
        question: 'What happens when the agent does not understand, or the caller wants a person?',
        answer:
          'That is part of the design, not an edge case. If the agent fails to understand twice in a row, if the caller asks for a person, or if the call touches a topic defined as sensitive, the call is transferred to a team member or logged as a callback request with a full summary. When nobody is available, the agent says so honestly and commits only to what the business can actually deliver. We review the handoff cases to improve the script over time. That way the caller is never stuck in a loop, and the team receives the calls that really need a person, already knowing what the caller asked for.',
      },
      {
        question: 'What do we get at the end of the project?',
        answer:
          'A voice agent running on your line, connected to your calendar and CRM, with a written script you can update and a call log that shows what was said and what was done. You also receive documentation of the telephony connections, the handoff rules and the recording and retention settings. After launch you can continue with monthly maintenance, or take over running the system with your own team. The documentation is written in plain language a non-technical reader can follow, so you do not depend on us to understand what the system does. We can also run a short session for your team on reading the summaries and editing the script themselves.',
      },
    ],
  },
  'generative-ai': {
    id: 'generative-ai',
    crumb: 'Generative AI for marketing content',
    eyebrow: 'Generative AI for marketing content',
    heading: ['Generative AI for marketing content', 'images, video and copy in your brand style'],
    subhead: 'Our generative AI service',
    lede: 'Product photos and lifestyle images, short videos and reels, ad creative variations, Hebrew copywriting at scale, avatar and voiceover videos and an automated content pipeline from your catalogue - all following a brand style guide, with a human editor approving before anything is published.',
    image: '/images/services-view.webp',
    action: { label: 'Request an AI content proposal', href: '/en/contact' },
    metaTitle: 'Generative AI for Marketing - Images, Video and Hebrew Copy',
    metaDescription:
      'Generative AI for marketing content for Israeli businesses: product photos, videos and reels, ad variations, Hebrew copywriting with human editing, avatars and voiceover, and an automated content pipeline from your catalogue.',
    advantages: {
      eyebrow: 'Why us',
      heading: ['What is different about our generative AI work'],
      lede: 'You get a lot of content quickly without giving up your brand style or your accountability: rules written in advance, a human check on every item and a record of the tools and licences we used.',
      outro: 'Want to see how your products would look in AI-generated content?',
      action: { label: 'Request an AI content proposal', href: '/en/contact' },
      roles: [
        {
          id: 'style-guide',
          title: 'A style guide a machine can read',
          art: '/images/service-page1.webp',
          text: 'Before producing content we write a guide the model can follow: colours, lighting, composition, tone of voice, words you use and words you avoid. That way two people on two different weeks get results that look as if they came from the same hand.',
        },
        {
          id: 'human-review',
          title: 'A human editor before every publication',
          art: '/images/service-page2.webp',
          text: 'AI makes mistakes: an extra finger on a hand, a product that changes shape, a Hebrew sentence that sounds translated. Every image and text is checked by a person against a fixed checklist, and only what is approved goes live.',
        },
        {
          id: 'hebrew',
          title: 'Natural Hebrew, not translation',
          art: '/images/service-page3.webp',
          text: 'Hebrew copy is written and edited to sound like an Israeli brand: the right register, consistent spelling, numbers and punctuation in the correct direction. Someone who knows the market reads everything before it reaches customers.',
        },
        {
          id: 'rights',
          title: 'Rights, disclosure and transparency',
          art: '/images/service-page4.webp',
          text: 'Each project records which tools we used and what their commercial terms are. We label AI-generated content where the law, the platform or good taste requires it, and we never create the likeness or voice of a real person without written consent.',
        },
      ],
    },
    system: {
      eyebrow: 'What we build',
      heading: ['What generative AI does in your marketing'],
      art: '/images/service-cms.webp',
      features: [
        {
          id: 'product-images',
          icon: 'catalog',
          title: 'Product photos and lifestyle images',
          text: 'A new background for a studio shot, the product placed in a scene, seasonal and holiday versions and images for the site and social - built from a real photo of the product so shape, colour and logo stay true to reality.',
        },
        {
          id: 'video',
          icon: 'sales',
          title: 'Short videos and reels',
          text: 'Animating product images and producing clips of four to fifteen seconds for reels, stories and ads, with Hebrew subtitles and versions in the format each platform expects.',
        },
        {
          id: 'ad-variants',
          icon: 'sales',
          title: 'Ad creative variations',
          text: 'Headlines, wording, images and video cuts across several message angles, ready for A/B testing in campaigns, so you find what works on your audience instead of guessing.',
        },
        {
          id: 'avatar',
          icon: 'club',
          title: 'Avatar and voiceover',
          text: 'Explainer videos with a digital presenter and Hebrew voiceover for training, product and FAQ videos, without booking a studio every time the script changes. Only with licensed voices and characters.',
        },
        {
          id: 'pipeline',
          icon: 'orders',
          title: 'An automated content pipeline from the catalogue',
          text: 'A new product enters the catalogue and the system generates images, a description, a title and tags. Everything waits in a queue for an editor, and only then is it published to the store, so thousands of items do not become endless manual work.',
        },
      ],
      action: { label: 'Request an AI content proposal', href: '/en/contact' },
    },
    howItWorks: {
      eyebrow: 'How it works',
      heading: ['How a project runs. Simply.'],
      lede: 'We start with a small sample on your own products and continue only if the result fits the brand.',
      steps: [
        {
          id: 'style',
          title: 'Style guide and pilot',
          text: 'We collect the brand materials, define the rules and create a few samples on your real products. At the end of the stage you see how it looks and decide whether the style is right, with no commitment to continue.',
          art: '/images/howitwork1.webp',
        },
        {
          id: 'production',
          title: 'Production at scale',
          text: 'We produce the content in batches, with a human check on every item. Rejected items go back for correction, and approved ones are stored in an organised asset library with a record of the tools and licences.',
          art: '/images/howitwork2.webp',
        },
        {
          id: 'pipeline',
          title: 'Connection and ongoing improvement',
          text: 'We connect the process to the catalogue, the store and the ad platforms, and review which creatives produced results. On that basis we update the style guide and the instructions given to the models.',
          art: '/images/howitwork3.webp',
        },
      ],
    },
    banner: {
      heading: 'Want marketing content at scale without losing your brand style?',
      action: { label: 'Request an AI content proposal', href: '/en/contact' },
    },
    faqHeading: ['Frequently asked questions', 'about generative AI for marketing'],
    faqEntries: [
      {
        question: 'Can we use AI-generated images commercially?',
        answer:
          'Usually yes, but it depends on the tool and its terms of use. Some tools allow commercial use only on a paid plan, and others restrict it. In addition, a work created entirely by a machine does not always carry full copyright, which can make it harder to protect against copying. We choose tools with clear commercial terms, keep a record for every project and do not use the likeness or voice of a real person without consent. This is not legal advice, and for sensitive cases it is worth checking with a lawyer before you publish anything. Before release we also check that an image is not too close to a recognisable work by someone else, which is a separate risk from the licence itself.',
      },
      {
        question: 'Do we have to label content as AI-generated?',
        answer:
          'There is no single rule for every case. Some platforms, such as social networks and ad networks, ask you to label realistic content created or altered with AI, and transparency duties are arriving in the European Union that may also reach Israeli businesses selling there. Beyond obligation there is trust: customers value honesty. We recommend labelling images of people, avatar videos and synthetic voices, and agreeing at the start of each project what is labelled and where, according to the platform and your audience. Whatever the rule, keep the prompts and original files, because they show who made the content and how, which matters if a claim is ever raised.',
      },
      {
        question: 'How do we stop the content from looking like every other AI output?',
        answer:
          'With real source material and with rules. We start from a real photo of the product rather than a written description, define a style guide covering lighting, colour, space and tone, and keep approved examples as a reference for every new item. In text we add brand language, real facts about the product and details only you know. Then a human editor rejects anything that looks generic, flat or strange. The result is not fully automatic, which is exactly why it does not look like the rest of the internet. That keeps the output consistent over months, even when new people or new tools join the process and nobody remembers the original brief.',
      },
      {
        question: 'Does the Hebrew copy sound natural?',
        answer:
          'Not always, if you leave it to the model alone. You sometimes get wording that sounds translated, the wrong grammatical gender, reversed punctuation in mixed-direction text or a word no Israeli would say. So Hebrew copy with us is written to a tone guide, checked and edited by a Hebrew speaker who knows the field, and only then released. At large volumes, such as thousands of product descriptions, the editor reviews a large sample against fixed rules and fixes the instructions instead of correcting every sentence one by one. That keeps both speed and quality. When there is doubt about a phrase, the tone guide decides, not the taste of whoever happens to be reviewing that day, which keeps decisions consistent.',
      },
      {
        question: 'What do we get at the end of the project?',
        answer:
          'The content itself in the formats suited to the site, the store and social networks, an organised asset library and a written style guide you can keep using. If we build an automated pipeline, you receive it connected to the catalogue and the publishing system, with an approval queue and a record of the tools and licence terms. You can leave ongoing production with us, or take training for your team and work on your own. The guide, the instructions and the assets belong to you, and the process does not depend on a single vendor. The training covers the tools, the checking rules and the labelling, so your team does not need us for every small change to the process.',
      },
    ],
  },
  'ai-product-development': {
    id: 'ai-product-development',
    crumb: 'AI product & SaaS development',
    eyebrow: 'AI product & SaaS development',
    heading: ['AI product & SaaS development', 'from idea to MVP to launch'],
    subhead: 'Our AI product development service',
    lede: 'A web or mobile app with AI at its core: choosing models and APIs, prompt infrastructure and quality evaluation, cost-per-request control, usage limits and billing, security and abuse prevention - from the first specification to launch, with the code and ownership fully yours.',
    image: '/images/services-view.webp',
    action: { label: 'Request a product scoping', href: '/en/contact' },
    metaTitle: 'AI Product & SaaS Development for Startups and Businesses - Idea to MVP',
    metaDescription:
      'AI product development for startups and businesses in Israel: an MVP as a web or mobile app, model selection, quality evaluation, cost control, billing and usage limits, security and full code and IP handover.',
    advantages: {
      eyebrow: 'Why us',
      heading: ['What is different about our AI product development'],
      lede: 'An AI product breaks where a demo does not: cost that climbs with every user, answers that change from run to run, and users who push the system. We build for that from day one.',
      outro: 'Have a product idea and want to know what it takes to ship it?',
      action: { label: 'Request a product scoping', href: '/en/contact' },
      roles: [
        {
          id: 'mvp',
          title: 'An MVP you can launch, not a demo',
          art: '/images/service-page1.webp',
          text: 'First we define the one thing the product must do well and build only that: a screen, a flow and a model. You reach the market after a few weeks of work and learn from real users before expanding.',
        },
        {
          id: 'evals',
          title: 'Quality checks before every change',
          art: '/images/service-page2.webp',
          text: 'For every AI capability we build a set of examples with the desired answer, including Hebrew edge cases. Every prompt change or model swap is tested against it, so you can upgrade without learning about the damage from your users.',
        },
        {
          id: 'unit-cost',
          title: 'Cost per request measured from the start',
          art: '/images/service-page3.webp',
          text: 'Every model call is logged with its token count and cost, per user and per feature. You see what an active customer costs and can choose a cheaper model, a cache or limits before the bill surprises you.',
        },
        {
          id: 'ownership',
          title: 'Code and IP are yours, with no lock-in',
          art: '/images/service-page4.webp',
          text: 'The repository, infrastructure and accounts are registered in your name from day one, and the keys stay with you. At the end you receive documentation and training, and can continue with an in-house team, another vendor or us.',
        },
      ],
    },
    system: {
      eyebrow: 'What we build',
      heading: ['What a market-ready AI product includes'],
      art: '/images/service-cms.webp',
      features: [
        {
          id: 'product',
          icon: 'catalog',
          title: 'Web or mobile app',
          text: 'An interface and a server built around the experience your user needs, including sign-in, accounts and administration. We choose whether to start with a website or an app based on where your customers are.',
        },
        {
          id: 'models',
          icon: 'orders',
          title: 'Model and API selection',
          text: 'We compare several model providers on your own examples, define a fallback model in case of an outage or a price change, and separate the code from the provider so it can be swapped.',
        },
        {
          id: 'prompts',
          icon: 'analytics',
          title: 'Prompts and quality evaluation',
          text: 'Prompts are versioned and covered by automated tests that run on every change, with a quality metric that shows whether answers got better or worse.',
        },
        {
          id: 'billing',
          icon: 'sales',
          title: 'Billing, plans and usage limits',
          text: 'Monthly or usage-based payment, quotas per user and plan, and consumption tracking that stops one user from spending everyone\'s budget.',
        },
        {
          id: 'security',
          icon: 'club',
          title: 'Security and abuse prevention',
          text: 'Protection against prompt injection, rate limiting, isolation of customer data from one another and content filtering, so the product stays stable and lawful even when users try to break it.',
        },
      ],
      action: { label: 'Request a product scoping', href: '/en/contact' },
    },
    howItWorks: {
      eyebrow: 'How it works',
      heading: ['How a project runs. Simply.'],
      lede: 'Every stage ends with your decision whether to continue, so nothing is built before you know the idea survives testing.',
      steps: [
        {
          id: 'scope',
          title: 'Scoping and feasibility proof',
          text: 'We define the user, the problem and one core AI capability, and build a prototype that tests on real examples whether the model reaches the required quality. If it does not, we stop before any build investment.',
          art: '/images/howitwork1.webp',
        },
        {
          id: 'mvp',
          title: 'MVP build and closed launch',
          text: 'We build the product with accounts, billing and cost measurement, and launch to a limited group of users. We track usage, quality and cost per request and fix issues before opening to everyone.',
          art: '/images/howitwork2.webp',
        },
        {
          id: 'scale',
          title: 'Scaling and ownership handover',
          text: 'We open to the public, add caching, queues and limits according to load, and hand over code, accounts and documentation. After that you can keep developing on your own or leave maintenance with us.',
          art: '/images/howitwork3.webp',
        },
      ],
    },
    banner: {
      heading: 'Have an AI product idea and want to check whether it can be launched?',
      action: { label: 'Request a product scoping', href: '/en/contact' },
    },
    faqHeading: ['Frequently asked questions', 'about AI product and SaaS development'],
    faqEntries: [
      {
        question: 'How is building an AI product different from ordinary software development?',
        answer:
          'In ordinary software the same action gives the same result. In an AI product the answer varies, and the cost of each request varies with it. So three layers are added: quality evaluation that measures the answers, cost tracking on every call, and a protection layer against abuse. The rest of the product, such as accounts, interface and payment, is built like any well-made system. If you only need a business system without a model at its core, our custom software development service is the better fit, and if you need an agent that performs tasks, we have a separate service for that. Teams that build these products also need both skills at once: understanding models and running a live service over time.',
      },
      {
        question: 'How long does it take to reach an MVP?',
        answer:
          'It depends on scope, but a focused MVP with one core AI capability, one main screen, accounts and basic billing is usually built in a few weeks of work rather than half a year. What mostly sets the difference is the number of capabilities. That is why we begin with a specification that narrows the product to the most important thing and leaves the other ideas for later versions. At the end of scoping you receive a detailed schedule for each stage, with a decision point after the feasibility proof. In practice every new capability goes through a short definition of what counts as a good answer, which prevents surprises after launch.',
      },
      {
        question: 'How do we keep model costs from eating the margin?',
        answer:
          'We measure every call per user and per feature, and work out what an active customer costs before pricing is set. Then cost is reduced in several ways: a small model for simple tasks, a cache for repeated questions, shorter context and quotas for each plan. An alert is also defined for unusual consumption, so you do not discover a problem in an invoice. Pricing then rests on real data rather than on a guess, and you can see how each change affects the cost of an average customer. Each of these decisions is recorded in a short document, so anyone who joins the team later understands why the product is built the way it is.',
      },
      {
        question: 'How do you handle security and abuse?',
        answer:
          'We limit what the model can see and do: it receives only the current user\'s data, and sensitive actions require confirmation. We add rate limiting, filtering of malicious input and output screening. Customer data is isolated between accounts, and keys stay on the server side only. Suspicious usage is logged as well. In line with Amendment 13 to the Privacy Protection Law, we define in advance which data is stored and for how long. This is not legal advice, and a privacy adviser can review the result if your case requires it. Before launch we also test the product against common bypass attempts, and we repeat the check after every significant change.',
      },
      {
        question: 'Who owns the code and the intellectual property?',
        answer:
          'You do. The code, design, prompts and evaluation sets belong to your company, and the repository and the cloud and model-provider accounts are opened in your name from the start. There is no lock-in with us: at the end of the project you receive documentation and training, and development can move to an in-house team. The agreement states this in writing. Open-source components keep their own licences, and we list them so it is clear exactly what the product uses and under which terms. If partners or investors ask for proof of ownership, we can prepare an organised document of the components and licences for them.',
      },
      {
        question: 'Can the product be built without tying it to a single model provider?',
        answer:
          'Yes, and we recommend it. An abstraction layer isolates your code from the provider, so changing a model is a configuration change rather than a rewrite. The evaluation set shows straight away whether a new model is better, cheaper or worse on your cases. This protects you from price increases, service interruptions or a newer model that is more cost-effective, and it lets you use several providers in parallel depending on the type of task, for example a strong model for analysis and a cheap one for simple classification. That way the product does not depend on the commercial decisions of one company, and contract and cost management stays in your hands.',
      },
    ],
  },
  'ai-search': {
    id: 'ai-search',
    crumb: 'AI search',
    eyebrow: 'AI search',
    heading: ['Visibility in the answers', 'ChatGPT, Gemini and Google write'],
    subhead: 'Our GEO service',
    lede: 'More searches now end in a written answer rather than a list of links. This service asks a different question from organic SEO: not where you sit in the list, but whether the engine mentions you at all.',
    image: '/images/service-ai-search-hero.webp',
    action: { label: 'Request an AI visibility check', href: '/en/contact' },
    metaTitle: 'GEO and AI Search Visibility — ChatGPT, Gemini, AI Overviews',
    metaDescription:
      'GEO and AEO services: making your business a defined entity that AI engines cite, with schema, quotable content, source presence and a visibility report.',
    advantages: {
      eyebrow: 'Why us',
      heading: ['What is different about our AI search work'],
      lede: 'An engine writing an answer does not choose a link, it chooses a source. The work is making you a source that is easy to quote.',
      outro: 'Want to know what ChatGPT says today when someone asks about your field?',
      action: { label: 'Request an AI visibility check', href: '/en/contact' },
      roles: [
        {
          id: 'entity',
          title: 'The entity first, the content after',
          art: '/images/service-page1.webp',
          text: 'An engine will not cite a business it is unsure exists. One consistent name, the same address and phone everywhere, a verified business profile and explicit links between your assets - without that base, the rest of the work does not register.',
        },
        {
          id: 'quotable',
          title: 'Content written to be quoted',
          art: '/images/service-page2.webp',
          text: 'A direct answer in the opening paragraph, figures with a source behind them, comparison tables and questions phrased the way a customer asks them. A general marketing paragraph cannot be quoted, so it simply is not chosen.',
        },
        {
          id: 'schema',
          title: 'Structured data written for machines',
          art: '/images/service-page3.webp',
          text: 'Organization, LocalBusiness, Service, FAQPage and Breadcrumb joined into one graph with stable identifiers. That is what lets an engine understand who is saying a thing and about what, rather than only reading text.',
        },
        {
          id: 'measure',
          title: 'Measurement without rankings',
          art: '/images/service-page4.webp',
          text: 'There is no first place in an AI answer, so we measure differently: a fixed bank of questions is run and checked for whether you are mentioned, in what context and next to whom, then compared month over month.',
        },
      ],
    },
    system: {
      eyebrow: 'What is included',
      heading: ['What AI search work consists of'],
      art: '/images/service-ai-search.webp',
      features: [
        {
          id: 'prompts',
          icon: 'orders',
          title: 'Mapping the real questions',
          text: 'We build a bank of the questions a customer actually types into an engine - full questions rather than short keywords - and record what comes back today.',
        },
        {
          id: 'facts',
          icon: 'catalog',
          title: 'A quotable base of facts',
          text: 'Prices, timeframes, standards and terms are written as discrete facts with a source, instead of being scattered through marketing paragraphs.',
        },
        {
          id: 'graph',
          icon: 'club',
          title: 'Entity and schema joined up',
          text: 'The organisation, its expertise and its services defined as one graph, including the links to external profiles that confirm the business is real.',
        },
        {
          id: 'sources',
          icon: 'sales',
          title: 'Presence in the sources engines read',
          text: 'An engine leans on external sources at least as heavily as on your own site: local directories, professional profiles and mentions elsewhere.',
        },
        {
          id: 'report',
          icon: 'analytics',
          title: 'Monthly visibility report',
          text: 'Which questions name you, where you disappeared, who is named in your place and what changed since last month - in plain language, not a technical log.',
        },
      ],
      action: { label: 'Request an AI visibility check', href: '/en/contact' },
    },
    howItWorks: {
      eyebrow: 'How it works',
      heading: ['How it starts. Simply.'],
      lede: 'We start from what the engines say about you today, because it is usually a surprise.',
      steps: [
        {
          id: 'baseline',
          title: 'Baseline check',
          text: 'We run the question bank against ChatGPT, Gemini and Google AI results and record what is said about you, what is said instead of you, and where the engine is simply wrong about you.',
          art: '/images/howitwork1.webp',
        },
        {
          id: 'foundation',
          title: 'Fixing the base',
          text: 'Entity and schema are put in order, business details are unified across assets, and the commercial pages are rewritten to carry answers that can be quoted.',
          art: '/images/howitwork2.webp',
        },
        {
          id: 'track',
          title: 'Tracking and extension',
          text: 'The same question bank is checked each month to see where you entered and where you were pushed out, then extended to the topics where being cited is realistic.',
          art: '/images/howitwork3.webp',
        },
      ],
    },
    banner: {
      heading: 'Want to see what AI says about you today?',
      action: { label: 'Request an AI visibility check', href: '/en/contact' },
    },
    faqHeading: ['Frequently asked questions', 'about AI search visibility'],
    faqEntries: [
      {
        question: 'What is GEO, and how does it differ from ordinary SEO?',
        answer:
          'Organic SEO competes for a position in a list of results. GEO, also called AEO, is about what happens when there is no list but a single written answer - in Google AI Overviews, in ChatGPT or in Gemini. There is no first or second place there; there is a source that was cited and a source that was not. A good deal of the technical groundwork is shared: a fast site, a clear structure and correct schema help both. The difference is emphasis - an engine composing an answer is looking for a discrete fact with a source behind it, not a page tuned to a keyword.',
      },
      {
        question: 'Can you actually influence what ChatGPT says?',
        answer:
          'You cannot control the answer, and anyone claiming otherwise is overstating it. You can influence what the engine finds about you, and that part is genuinely in your hands: how clearly you are identified, whether your business details match everywhere, whether a page answers the question directly, and whether external sources corroborate what you claim. An engine composing an answer avoids a source it is not confident in. The practical leverage is therefore on the engine confidence in you rather than on its phrasing - and that is exactly where the difference between being named and being left out sits.',
      },
      {
        question: 'How do you measure success when there are no rankings?',
        answer:
          'We build a fixed bank of real questions from your field and run it every month against the same engines. For each question we record whether you were mentioned, in what context, which competitors appeared alongside you, and whether you were linked. This is comparative rather than absolute measurement, because the same question can produce different phrasing on different runs - which is why the bank has to stay fixed and the run has to repeat. Alongside it we track what is measurable with certainty: traffic, enquiries, and what Google actually reports in Search Console.',
      },
      {
        question: 'Does this replace organic SEO?',
        answer:
          'No, and it is worth being wary of anyone selling it as a replacement. Most searches still end in a click on a result, and the AI engines themselves lean on the same underlying signals: a fast site, a sound structure, content someone is willing to quote, and genuine authority. GEO is not a separate channel but a layer on top of organic work that is already sound. For a business whose base is shaky - a slow site, thin content, business details that contradict each other - the right move is to repair the base rather than buy an additional service that assumes the base exists.',
      },
      {
        question: 'How long before anything changes?',
        answer:
          'The technical part moves relatively quickly: fixing the entity, the schema and inconsistent business details is picked up within weeks, and sometimes that alone is enough for an engine to stop confusing you with a similarly named company. The content part is slower, because an engine quotes a source it already trusts, and trust is not built in a month. We measure from the first month so there is a baseline to compare against, but we read the trend across several months rather than a single run - a single run can differ without anything having changed.',
      },
      {
        question: 'What if the AI says something about us that is wrong?',
        answer:
          'It happens, and more often than people expect - particularly for businesses whose name resembles another company, or whose details appear in different forms in different places. An engine fills gaps with what seems plausible, so an inconsistent detail easily becomes a confidently worded error. The remedy is not a request for correction but the removal of ambiguity: unify the name and details across every asset, link the profiles to each other explicitly, and publish a clear page that settles the facts. The more consistent the sources, the less room the engine has to invent.',
      },
      {
        question: 'What does it cost?',
        answer:
          'The work splits in two, and so does the pricing. There is a one-off opening stage - the baseline check, the entity and schema work, and rewriting the commercial pages - and then ongoing monthly work covering measurement, content and extension. The scope follows the number of commercial pages and the state of the base, which is why we do not publish a single figure for this service. The baseline check tells you where you stand today before you commit to anything ongoing, and if your organic foundations are still missing we will tell you to start there rather than here.',
      },
    ],
  },
  'machine-learning': {
    id: 'machine-learning',
    crumb: 'Machine learning & data science',
    eyebrow: 'Machine learning & data science',
    heading: ['Machine learning & data science', 'models built on your own data'],
    subhead: 'Our data science service',
    lede: 'Demand and sales forecasting, lead scoring and churn risk, product recommendations for online stores, Hebrew document and text classification, anomaly detection - a model built on your business data, tested against reality and connected to the systems you already run.',
    image: '/images/services-view.webp',
    action: { label: 'Request a data review', href: '/en/contact' },
    metaTitle: 'Machine Learning & Data Science for Business - Forecasting, Scoring and BI',
    metaDescription:
      'Machine learning for Israeli businesses: demand and sales forecasting, lead and churn scoring, store recommendations, Hebrew document classification, anomaly detection and dashboards. We start with a data review.',
    advantages: {
      eyebrow: 'Why us',
      heading: ['What is different about our data science work'],
      lede: 'You get a model you can check: a success metric agreed in advance, a comparison against the method you use today, and a connection to the system where the decision is actually made.',
      outro: 'Want to know whether your data is enough for a model?',
      action: { label: 'Request a data review', href: '/en/contact' },
      roles: [
        {
          id: 'baseline',
          title: 'A baseline before a model',
          art: '/images/service-page1.webp',
          text: 'Before building anything we measure how well the current method works - last year\'s average, the sales manager\'s rule of thumb, a spreadsheet. A model that does not beat that baseline does not go live, and you see the comparison in writing.',
        },
        {
          id: 'data-first',
          title: 'A data review before commitment',
          art: '/images/service-page2.webp',
          text: 'The first stage reviews the data you already hold: how much history, how many gaps, where fields are inconsistent. Sometimes the answer is that there is not enough data yet, and then we say so and suggest what to start collecting.',
        },
        {
          id: 'hebrew',
          title: 'Hebrew text and documents',
          art: '/images/service-page3.webp',
          text: 'Enquiry classification, field extraction and topic detection are tested on real Hebrew text from your business - spelling without vowels, acronyms, Latin-script terms - not on English samples translated at the end.',
        },
        {
          id: 'production',
          title: 'A model inside the system, not in a notebook',
          art: '/images/service-page4.webp',
          text: 'The prediction lands where decisions are made: a lead score in the CRM, a reorder suggestion in inventory, an alert on WhatsApp. After launch the model is monitored, and when its accuracy drops you get an alert and a retraining plan.',
        },
      ],
    },
    system: {
      eyebrow: 'What we build',
      heading: ['What machine learning does in your business'],
      art: '/images/service-cms.webp',
      features: [
        {
          id: 'forecast',
          icon: 'sales',
          title: 'Demand and sales forecasting',
          text: 'Forecasts by product, branch and week that account for seasonality, holidays and promotions, so stock and shifts follow expected demand rather than instinct.',
        },
        {
          id: 'scoring',
          icon: 'club',
          title: 'Lead scoring and churn risk',
          text: 'A score for every lead by its chance of closing, and for every existing customer by the risk of leaving - so the team calls first where it actually changes the outcome.',
        },
        {
          id: 'recommend',
          icon: 'catalog',
          title: 'Recommendations for online stores',
          text: 'Complementary products in the cart, "customers also bought" and catalogue ordering by purchase history, connected to the existing store and measured in a test against a version without them.',
        },
        {
          id: 'documents',
          icon: 'orders',
          title: 'Documents, text and anomalies',
          text: 'Classifying Hebrew enquiries and emails, extracting data from invoices and forms, and flagging anomalies in transactions, orders or sensor readings before they turn into damage.',
        },
        {
          id: 'bi',
          icon: 'analytics',
          title: 'Data pipelines and dashboards',
          text: 'Bringing data from the CRM, the store, accounting and campaigns into one place, with a BI dashboard that shows everyone who decides the same numbers.',
        },
      ],
      action: { label: 'Request a data review', href: '/en/contact' },
    },
    howItWorks: {
      eyebrow: 'How it works',
      heading: ['How a project runs. Simply.'],
      lede: 'Every stage ends with your decision whether to continue, so nothing is built before you know there is something to build on.',
      steps: [
        {
          id: 'audit',
          title: 'Data audit and goal',
          text: 'We map which data exists, at what quality and over what period, and define one business question and one success metric. The stage ends with a report: feasible, feasible with conditions, or not yet.',
          art: '/images/howitwork1.webp',
        },
        {
          id: 'poc',
          title: 'Proof of concept',
          text: 'We build a first model on historical data and test it on a period it has not seen, against your baseline. If it does not beat it by a margin that justifies the work, we stop here.',
          art: '/images/howitwork2.webp',
        },
        {
          id: 'production',
          title: 'Production and monitoring',
          text: 'We connect the model to the system where the decision is made, set up retraining and monitor accuracy over time, because customer behaviour and markets change and the model has to change with them.',
          art: '/images/howitwork3.webp',
        },
      ],
    },
    banner: {
      heading: 'Want to know what you could predict from the data you already have?',
      action: { label: 'Request a data review', href: '/en/contact' },
    },
    faqHeading: ['Frequently asked questions', 'about machine learning and data science'],
    faqEntries: [
      {
        question: 'How is machine learning different from an AI agent or ChatGPT?',
        answer:
          'A language model such as ChatGPT writes text and answers questions, and an AI agent is built on top of one to hold a conversation and take actions. Machine learning in the sense of this service answers a different question: predicting a number or classifying a record from the business\'s own historical data - how many units will sell next week, which lead will close, which transaction is unusual. These models are usually smaller, cheaper to run and easier to verify, because every prediction can be compared with what actually happened. Many projects combine both kinds.',
      },
      {
        question: 'What data do we need to start?',
        answer:
          'It depends on the question. Sales forecasting needs a history of orders or sales by date and product, ideally two years or more so seasonality and holidays show up. Lead scoring needs past leads with a known outcome - closed or not. Document classification needs examples that were already sorted by hand. The data does not have to be tidy: an export from the CRM, the store or a spreadsheet is enough for a first review. What really blocks a project is data that was never recorded, such as a cancellation reason nobody logs. In that case the review ends with a recommendation of what to start collecting.',
      },
      {
        question: 'Does a small or mid-size business even need machine learning?',
        answer:
          'Not always, and the data review is where we say so. With a hundred customers and one product, a good dashboard and a few simple rules will deliver almost all of the value. Machine learning starts paying off when there are many repeated decisions over many items - hundreds of products in stock, thousands of leads a year, a steady stream of documents - and no person can look at each one. Even then we start with one question and a clear metric rather than a platform. Often the first and most useful step is a data pipeline and a dashboard, with the model coming after it.',
      },
      {
        question: 'How do we know the model actually works?',
        answer:
          'We test it on data it has not seen. In the proof of concept we hold back the most recent period, for example the last three months, train on what came before and compare the predictions with what really happened. The same comparison is made for the method you use today, so you see a real gap rather than an accuracy percentage without context. After launch the check continues: every prediction is logged and compared with the outcome, and a periodic report shows whether accuracy is holding. When it drops, for example after a price change or a new audience, we retrain on current data.',
      },
      {
        question: 'What about privacy and Amendment 13 to the Privacy Protection Law?',
        answer:
          'Amendment 13 to Israel\'s Privacy Protection Law broadened the obligations of businesses that hold personal data, so privacy is part of the specification rather than an appendix. In practice we work on data minimisation: a sales forecasting model does not need names or phone numbers, and identifiers are replaced with codes before data leaves your systems. Data stays in an environment you control, access is logged, and working copies are deleted at the end of the project. We do not give legal advice; if your database needs a privacy adviser\'s review, we prepare an exact description of what is collected, where it is stored and why.',
      },
      {
        question: 'What do we get at the end of the project?',
        answer:
          'A model running inside your systems, not a file that stays with us. That usually includes the data pipeline that feeds it, the code for the model and for retraining, a connection to wherever the prediction is used - CRM, inventory, store or dashboard - and a document explaining which data goes in, what comes out and how to read the result. You also get the proof-of-concept report with the baseline comparison. The code and the model belong to you. After launch you can leave monitoring and retraining with us, or take a handover session and run it yourselves.',
      },
    ],
  },
  'computer-vision': {
    id: 'computer-vision',
    crumb: 'Computer vision',
    eyebrow: 'Computer vision',
    heading: ['Computer vision for business', 'image and video recognition wired into the workflow'],
    subhead: 'Our computer vision service',
    lede: 'Object detection in images and video, OCR for Hebrew documents and invoices, quality inspection on a production line, people and vehicle counting, face blurring for privacy and automatic tagging of product images for online stores - tested on your own images and connected to your existing systems.',
    image: '/images/service-platform.webp',
    action: { label: 'Request a feasibility check', href: '/en/contact' },
    metaTitle: 'Computer Vision for Business - Image Recognition, Hebrew OCR and Quality Inspection',
    metaDescription:
      'Computer vision for Israeli businesses: object detection, OCR for Hebrew invoices and documents, quality inspection, people and vehicle counting, face blurring and product image tagging.',
    advantages: {
      eyebrow: 'Why us',
      heading: ['What is different about the computer vision we build'],
      lede: 'A vision model is measured in your conditions: the lighting, the angle, the camera and the documents that really arrive - not on a sample image set.',
      outro: 'Want to check whether your cameras or scans are good enough?',
      action: { label: 'Request a feasibility check', href: '/en/contact' },
      roles: [
        {
          id: 'real-images',
          title: 'Tested on your images',
          art: '/images/service-page1.webp',
          text: 'Before building we collect a sample of images, scans or video from the field, including the hard cases: night, glare, a crumpled document, a product at an angle. That shows in advance where recognition will struggle, not after installation.',
        },
        {
          id: 'hebrew-ocr',
          title: 'OCR that understands Hebrew',
          art: '/images/service-page2.webp',
          text: 'Hebrew invoices, delivery notes and forms mix right-to-left text with left-to-right numbers and tables. Extraction is tested on your suppliers\' documents, and any field the system is unsure about is flagged for a person to review.',
        },
        {
          id: 'privacy',
          title: 'Privacy by design',
          art: '/images/service-page3.webp',
          text: 'Where possible, processing happens on the camera or a local server and only the count or the alert leaves it. Faces and licence plates are blurred before storage, and the retention period is set in the specification rather than left at a default.',
        },
        {
          id: 'integration',
          title: 'Results that land in a system',
          art: '/images/service-page4.webp',
          text: 'A detection nobody sees is worth nothing. The invoice goes into accounting, the defect opens an alert for the shift manager, and the tags are written straight into the store catalogue.',
        },
      ],
    },
    system: {
      eyebrow: 'What we build',
      heading: ['What computer vision does in your business'],
      art: '/images/service-dev-hero.webp',
      features: [
        {
          id: 'ocr',
          icon: 'orders',
          title: 'OCR for documents and invoices',
          text: 'Extracting supplier, date, totals and line items from Hebrew invoices, delivery notes and forms, straight into your accounting system or ERP.',
        },
        {
          id: 'quality',
          icon: 'analytics',
          title: 'Quality inspection and defect detection',
          text: 'A camera over the production or packing line that spots a defect, a missing item or a wrong label and alerts in real time, with an image recorded for every case.',
        },
        {
          id: 'counting',
          icon: 'club',
          title: 'People and vehicle counting',
          text: 'Visitor counts in a store, car park occupancy or traffic at an entrance, as aggregate figures without storing identities, comparable across hours, days and branches.',
        },
        {
          id: 'detection',
          icon: 'catalog',
          title: 'Object detection and inventory',
          text: 'Recognising products on a shelf, pallets in a warehouse or equipment on site, and checking that what the image shows matches what the system records.',
        },
        {
          id: 'tagging',
          icon: 'sales',
          title: 'Product image tagging and face blurring',
          text: 'Tagging colour, type and category on store product images, alongside automatic blurring of faces and licence plates in photos and video before they are published or stored.',
        },
      ],
      action: { label: 'Request a feasibility check', href: '/en/contact' },
    },
    howItWorks: {
      eyebrow: 'How it works',
      heading: ['How a project runs. Simply.'],
      lede: 'We start from the images you already have, because they decide how well recognition will work.',
      steps: [
        {
          id: 'sample',
          title: 'Sample and goal',
          text: 'We collect images, scans or video from the field, define exactly what needs to be recognised and which mistake costs more - a miss or a false alarm.',
          art: '/images/howitwork1.webp',
        },
        {
          id: 'poc',
          title: 'Proof of concept',
          text: 'We start from an existing model, adapt it to your images and test it on a sample it has not seen. The output is a report with examples of successes and failures, not just a number.',
          art: '/images/howitwork2.webp',
        },
        {
          id: 'deploy',
          title: 'Deployment and monitoring',
          text: 'We connect to the cameras, the scanner or the mailbox, feed the results into your system and monitor them. Cases the model was unsure about are collected and used for the next improvement.',
          art: '/images/howitwork3.webp',
        },
      ],
    },
    banner: {
      heading: 'Want to check what could be recognised in the images you already have?',
      action: { label: 'Request a feasibility check', href: '/en/contact' },
    },
    faqHeading: ['Frequently asked questions', 'about computer vision'],
    faqEntries: [
      {
        question: 'What is computer vision and how is it different from ordinary OCR?',
        answer:
          'Computer vision is the field in which a computer understands what appears in an image or video: which objects are there, where they are, how many and in what condition. OCR is one case of it - recognising text. Ordinary OCR returns all the text on a page as a single stream, whereas an invoice solution also has to understand the layout: which number is the amount due, which is VAT and which is the supplier number. So we combine text recognition with document layout understanding, and check the result against simple rules, such as the line items adding up to the total.',
      },
      {
        question: 'Does OCR work well on Hebrew invoices and documents?',
        answer:
          'On printed documents and reasonable scans, yes, but Hebrew raises challenges worth testing up front: right-to-left text beside left-to-right numbers and dates, tables with reversed columns, stamps, and handwriting on a printed form. That is why the proof of concept runs on real documents from your suppliers. Every extracted field gets a confidence level, and a field below the threshold goes to a person for review instead of going straight into accounting. People then check only the few uncertain cases rather than retyping everything by hand.',
      },
      {
        question: 'Do we need to buy new cameras or hardware?',
        answer:
          'Not necessarily. Existing security cameras are often enough for counting people or vehicles, and an office scanner or a phone is enough for documents. Quality inspection on a production line is the case that usually needs a dedicated camera and fixed lighting, because a small defect disappears in a blurred image or a shifting shadow. In the sample stage we test images from your current equipment, and if they are not sufficient we say exactly what is missing: resolution, angle, lighting or frame rate. Processing can run in the cloud, on a local server or on a small device next to the camera.',
      },
      {
        question: 'How do you protect privacy when filming people?',
        answer:
          'The principle is not to keep what is not needed. Counting visitors does not require knowing who came in, so processing can run close to the camera and only the number leaves it. When images or video are stored, faces and licence plates are blurred automatically before storage, and the retention period is set in advance. Amendment 13 to Israel\'s Privacy Protection Law broadened the obligations of anyone holding personal data, and footage of people may count as such. We do not give legal advice, but we will give your privacy adviser a full description of what is filmed, what is kept, where and why.',
      },
      {
        question: 'How many images does it take to train a model?',
        answer:
          'Fewer than people expect, because we rarely train from scratch. We start from a model that already recognises thousands of object types and adapt it to yours, so a first test can sometimes work with hundreds of labelled images rather than tens of thousands. Variety matters more than volume: images from every shift, lighting condition, angle and product type, plus enough examples of the rare case you want to catch, such as a defect. When defects really are rare, we collect them over time or add anomaly detection. Labelling is done together with you, because only you know what counts as a defect.',
      },
      {
        question: 'What happens when the model gets it wrong?',
        answer:
          'It will, so the design starts with which mistake costs more. In quality inspection a missed defect costs more than a false alarm, so the threshold is tuned accordingly; in product tagging it is the other way round. Every detection carries a confidence level, and borderline cases go to a person instead of triggering an action on their own. Every error that is found is kept with its image and goes into the next training round, so the model improves on exactly the cases that occur in your business. A periodic report shows how many detections there were, how many were corrected by hand and where the model struggles.',
      },
    ],
  },
}
