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
      'Custom web development in Next.js, React and TypeScript: discovery, UX/UI, integrations and Core Web Vitals handled in code. Full repository ownership, no vendor lock-in.',
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
      heading: ['The AiTerra management console'],
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
        question: 'How much does a custom website cost to build?',
        answer:
          'Pricing follows scope rather than page count. A focused landing page, a full marketing site, and a custom platform with authentication and integrations sit in very different ranges. After a short discovery call you get a written quote stating exactly what is included and what is not, with no costs that surface halfway through.',
      },
      {
        question: 'How long does it take to build a custom website?',
        answer:
          'A landing page ships in a few weeks; a full marketing site typically runs one to two months; applications and platforms take longer. In practice the schedule is usually set by content and assets rather than engineering, which is why we lock those during discovery.',
      },
      {
        question: 'What is the difference between custom development and a website template?',
        answer:
          'A template forces your content and workflows into layouts designed for a generic business. Custom development inverts that: the structure follows how your business sells and operates. The difference shows up in page speed, in how cleanly the site connects to your back office, and in what happens when you need something the template author never anticipated.',
      },
      {
        question: 'Do we own the code after delivery?',
        answer:
          'Yes. You receive full ownership of the repository plus access to the domain, hosting and every connected service at handover. We do not retain clients through technical lock-in.',
      },
      {
        question: 'Will the site meet accessibility requirements?',
        answer:
          'We build to WCAG 2.1 AA: full keyboard navigation, sufficient colour contrast, screen reader support and a published accessibility statement. Accessibility is a legal requirement in a growing number of jurisdictions, and an overlay widget on its own generally does not satisfy it.',
      },
      {
        question: 'Can you improve our existing site instead of rebuilding it?',
        answer:
          'Often, yes. Discovery establishes what is worth preserving: content, URL structure and existing organic rankings. Where a rebuild is right, we plan the 301 redirect map before anything moves - an unplanned migration is one of the fastest ways to erase years of search equity.',
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
      'SEO services built by engineers: keyword research, technical SEO fixed in code, content, digital PR and transparent monthly reporting - plus visibility in AI Overviews and ChatGPT.',
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
        question: 'How long does SEO take to show results?',
        answer:
          'Early signals - improved indexation and movement on lower-competition terms - usually appear within two to four months. Meaningful gains on competitive commercial terms typically take six months or more. A brand new domain starts slower than an established site with existing authority.',
      },
      {
        question: 'How much do SEO services cost per month?',
        answer:
          'The retainer depends on competitiveness of the vertical, the technical condition of the site and how much content needs producing. After an initial review we present a clear range with a breakdown of what each month includes - research, technical work, content and authority building - so you know precisely what you are paying for.',
      },
      {
        question: 'What is the difference between SEO and paid ads?',
        answer:
          'Paid search delivers traffic on day one and stops when the budget does. Organic takes months to compound but keeps producing enquiries after the spend pauses. For most businesses the answer is both, weighted by stage: paid to validate demand quickly, organic as the asset that lowers acquisition cost over time.',
      },
      {
        question: 'Can you guarantee a number one ranking?',
        answer:
          'No, and nobody credibly can. Google does not sell organic positions and changes its systems continuously. What we do commit to is a defined plan of work, full transparency on what was done each month, and measurement against enquiries. A guaranteed number one is a red flag, not a selling point.',
      },
      {
        question: 'How do we get cited in ChatGPT and Google AI Overviews?',
        answer:
          'That discipline is generative engine optimisation, and we treat it as part of the engagement. In practice it requires content that answers questions directly and citably, valid structured data, authority and mentions across sources these systems already trust, and deliberate crawler access. It matters because a large share of searches now end without a click to any site.',
      },
      {
        question: 'We are a local business. Do you handle local SEO?',
        answer:
          'Yes. For a business serving a defined area, the Google Business Profile and the local pack often matter more than the website itself. We handle profile optimisation, review strategy, location-specific service pages and local citations so you surface for nearby searchers.',
      },
      {
        question: 'Our site was built by someone else. Can you still rank it?',
        answer:
          'Yes, and we do it regularly. We start with a technical review of what is blocking performance on the current build. Many fixes are possible on a site we did not write. If we find a structural blocker that cannot be worked around, we tell you upfront instead of billing months against work that cannot succeed.',
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
          'Off-the-shelf software is the right answer whenever your process is standard - accounting, email, payroll. A custom platform earns its cost when the process is genuinely specific to how you compete, or when you are paying several subscriptions plus manual work to bridge the gaps between them. We will tell you honestly which situation you are in.',
      },
      {
        question: 'What integrations can you build?',
        answer:
          'We integrate with CRM systems, ERP and accounting platforms, payment providers, shipping and logistics services, email and messaging tools, and internal databases. Where a vendor exposes an API we can generally connect to it; where one does not, we will say so during discovery rather than after contracting.',
      },
      {
        question: 'How long does a platform project take?',
        answer:
          'A focused internal tool can ship in weeks. A portal or a dashboard suite with multiple roles and integrations typically runs a few months. We deliver in working increments rather than one large handover, so you see and steer real software early instead of approving documents.',
      },
      {
        question: 'Do we own the platform and its code?',
        answer:
          'Yes. The repository, the infrastructure accounts and all credentials are yours. We also document the architecture and deployment process, so another team could pick it up without reverse-engineering it first.',
      },
      {
        question: 'What happens to our existing data?',
        answer:
          'Migration is planned as part of the project, not treated as an afterthought. We map the existing data, clean and transform it, run trial migrations against a staging environment, and keep the old system available in parallel until the new one is verified.',
      },
      {
        question: 'Who maintains it after launch?',
        answer:
          'We do, under an ongoing support arrangement: monitoring, security and dependency updates, bug fixes and new features as the process changes. If you would rather run it with an internal team, we hand over documentation and support the transition.',
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
      'Custom online store development: product catalogue, secure checkout, payment and invoicing integrations, inventory and order management, built in code and owned by you.',
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
          'Both. If your catalogue and workflows fit a platform, using one is the faster and cheaper answer and we will say so. We build custom when the platform fee, the plugin stack or the checkout constraints start costing more than they save - typically with large catalogues, unusual pricing rules or deep integration with internal systems.',
      },
      {
        question: 'Can you connect the store to our payment and invoicing providers?',
        answer:
          'Yes, and this is usually where template stores break down. We integrate the payment gateway and the invoicing system you already use, so an order produces a payment and a valid invoice automatically instead of someone re-keying it at the end of the day.',
      },
      {
        question: 'Who owns the store when the project ends?',
        answer:
          'You do. The repository, the deployment pipeline and the data are yours, and we hand over documentation with them. There is no licence that stops working if you stop working with us.',
      },
      {
        question: 'Can you migrate an existing store without losing search rankings?',
        answer:
          'Yes. Migration work includes a full URL map with permanent redirects, preserved page structure and metadata, and monitoring of coverage and rankings after launch. Most ranking loss in migrations comes from URLs quietly changing, which a redirect map prevents.',
      },
      {
        question: 'How long does a store take to build?',
        answer:
          'It depends far more on catalogue complexity and integrations than on design. A focused store with a clean catalogue and one payment provider is a matter of weeks; multi-market stores with ERP integration take longer. We give a schedule after the catalogue and requirements step, not before.',
      },
      {
        question: 'What happens after launch?',
        answer:
          'Stores need active maintenance more than brochure sites do: payment APIs change, dependencies need security patches and traffic patterns shift. Our plans cover monitoring, updates and support so problems are caught before a customer finds them.',
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
          'It depends on the number of pages, whether copy and photography are needed, and how much of the content you want to manage yourself. We quote after the positioning and structure step, when the scope is actually known - a number given before that is a guess dressed as an estimate.',
      },
      {
        question: 'Why build in code instead of using WordPress or Wix?',
        answer:
          'For a simple brochure site a platform is often fine, and we will tell you when that is the case. Coded sites win when performance matters, when the design cannot be forced into a template, when plugin licences and their security exposure start to add up, or when the site has to integrate with systems you already run.',
      },
      {
        question: 'Can I update the content myself?',
        answer:
          'Yes. The text and images that change regularly are editable through an admin, without touching code. Structural changes - new page types, new sections - come to us, which is deliberate: it is what keeps the site consistent.',
      },
      {
        question: 'Do you write the copy?',
        answer:
          'We can, and we recommend it. Copy written alongside the design almost always outperforms copy supplied afterwards to fit a finished layout. If you have a writer, we work with them from the structure step onward.',
      },
      {
        question: 'Will the site be accessible?',
        answer:
          'Yes, and built in rather than bolted on. Semantic structure, keyboard navigation, contrast and alternative text are part of the build. Accessibility overlays added after the fact tend to slow the site down without fixing the underlying markup.',
      },
      {
        question: 'What happens after launch?',
        answer:
          'The site needs hosting, security updates, dependency patching, backups and occasional content work. We offer an ongoing arrangement for that, or hand over documentation if you would rather run it internally.',
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
          'It depends on the competitiveness of your market far more than on the platform. Too small a budget cannot gather enough conversion data to optimise on, so it stays permanently in learning. We will tell you if a proposed budget is below the level where management fees make sense.',
      },
      {
        question: 'How soon will we see results?',
        answer:
          'Expect the first month to buy information rather than efficiency. Campaigns need conversion volume before optimisation has anything to work with. Anyone promising a specific cost per lead before launch is guessing.',
      },
      {
        question: 'Do you build the landing pages too?',
        answer:
          'Yes, and we think it is the main reason our campaigns perform. When the same team writes the ad, builds the page and implements the tracking, there is no gap between what the ad promises and what the page delivers - and no argument about whose fault a poor conversion rate is.',
      },
      {
        question: 'Who owns the ad accounts?',
        answer:
          'You do. We work inside your accounts, or set them up in your name if they do not exist yet. If we stop working together you keep the accounts, the history and the data, which is what makes future optimisation possible.',
      },
      {
        question: 'Google or Meta - which should we start with?',
        answer:
          'Google captures demand that already exists; Meta creates demand among people who were not searching. If people are actively searching for what you sell, start with Google. If the category needs explaining, Meta usually earns its place first. Most accounts end up running both, weighted differently.',
      },
      {
        question: 'How do you report?',
        answer:
          'Monthly, on cost per lead and cost per acquisition, with what changed and what we are testing next. Impressions and clicks appear as context, never as the headline - they do not pay for anything.',
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
          'Yes. Identity, visual language and guidelines are delivered as a standalone package your own team or another agency can apply. We do ask what it will be built in, because a system designed with no implementation in mind tends not to survive one.',
      },
      {
        question: 'What do we actually receive at the end?',
        answer:
          'Source files, exported assets in the formats you will need, and written guidelines covering colour, typography, spacing, logo usage and tone. For interface work you also get a component specification with states and breakpoints.',
      },
      {
        question: 'Can you redesign an existing brand without starting over?',
        answer:
          'Often, yes. If the equity in the current identity is worth keeping we evolve it - tightening the system, fixing accessibility and adding the rules that were never written down - rather than replacing something your customers already recognise.',
      },
      {
        question: 'How many concept directions do you present?',
        answer:
          'Usually two or three considered directions rather than a wall of options. Each comes with the reasoning behind it, so the conversation is about which argument fits the business, not which picture someone likes most.',
      },
      {
        question: 'Do you design mobile apps as well as websites?',
        answer:
          'Yes - app interfaces, web products and landing pages. The deliverable is the same shape: a component system with states and behaviour specified, not a set of static screens.',
      },
      {
        question: 'Will the design pass accessibility requirements?',
        answer:
          'We design to meet them: contrast ratios checked against the standard, visible focus states, and a hierarchy that works with a screen reader. Note that a logo is exempt from contrast requirements while the interface built around it is not - a distinction that catches a lot of brand work.',
      },
    ],
  },
}
