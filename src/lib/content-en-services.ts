import type { ServicePage } from '@/app/(he)/v2/content'

export const servicePagesEn: Record<string, ServicePage> = {
  'web-development': {
    id: 'web-development',
    crumb: 'Web development',
    eyebrow: 'Custom web development',
    heading: ['Custom web development', 'for teams past templates'],
    subhead: 'Our custom web development practice',
    lede: 'Discovery, design and full-code engineering - a fast, accessible site structured for organic search from the first commit, delivered with full ownership of the repository.',
    image: '/images/service-dev.webp',
    action: { label: 'Book a scoping call', href: '/en/contact' },
    metaTitle: 'Custom Web Development Agency - Full-Stack Builds',
    metaDescription:
      'Custom web development in Next.js, React and TypeScript: discovery, UX/UI, integrations and Core Web Vitals handled in code. You own the repository.',
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
      art: '/images/management-console.webp',
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
    heading: ['SEO and website promotion', 'that produces enquiries'],
    subhead: 'Our organic search practice',
    lede: 'Keyword research, technical SEO, content and authority building - organic growth measured in qualified enquiries rather than positions, including visibility inside AI-generated answers.',
    image: '/images/service-marketing.webp',
    action: { label: 'Request a visibility review', href: '/en/contact' },
    metaTitle: 'SEO and Website Promotion Services - AI-Search Ready',
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
      art: '/images/management-console.webp',
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
    crumb: 'Web platforms',
    eyebrow: 'Custom platforms',
    heading: ['Custom web platforms', 'built around your workflow'],
    subhead: 'Our platform engineering practice',
    lede: 'Portals, dashboards, internal tools and the integrations between them - engineered for the operations that off-the-shelf software cannot cover, and designed to be extended rather than replaced.',
    image: '/images/service-dev-hero.webp',
    action: { label: 'Discuss your platform', href: '/en/contact' },
    metaTitle: 'Custom Web Platform and Application Development',
    metaDescription:
      'Custom web application development: customer portals, operational dashboards, workflow automation and API integrations, engineered in Next.js, Node and PostgreSQL.',
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
      art: '/images/management-console.webp',
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
      art: '/images/management-console.webp',
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
    metaTitle: 'Paid Campaign Management - Google and Meta Ads',
    metaDescription:
      'Paid campaign management on Google and Meta: audience and market research, creative production, landing pages and conversion tracking, reported on cost per lead.',
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
      art: '/images/services-view-bg.webp',
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
}
