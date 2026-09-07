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
}
