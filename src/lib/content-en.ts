import type { V2Content } from '@/app/(he)/v2/content'

export const EN_SERVICE_SLUGS = ['web-development', 'seo', 'development'] as const

export const contentEn: Partial<V2Content> = {
  header: {
    brand: 'AITERRA',
    navLabel: 'Main navigation',
    mobileNavLabel: 'Mobile navigation',
    menuOpen: 'Menu',
    menuClose: 'Close menu',
    expand: 'Expand',
    collapse: 'Collapse',
    cta: { label: 'Get a project quote', href: '/en/contact' },
    nav: [
      {
        id: 'services',
        label: 'Services',
        href: '/en/services',
        submenu: 'services',
        overviewLabel: 'All services',
      },
      {
        id: 'portfolio',
        label: 'Work',
        href: '/en/projects',
        submenu: 'portfolio',
        overviewLabel: 'All work',
      },
      { id: 'about', label: 'About the agency', href: '/en/about' },
      { id: 'lang', label: 'עברית', href: '/', flag: 'il' },
    ],
  },

  hero: {
    headline: ['Custom web development', 'and SEO agency'],
    tags: ['Engineering', 'SEO', 'Platforms', 'Growth'],
    lede: [
      'We design and build custom websites, web platforms and internal tools in code,',
      'then rank them - the same team writes the software and owns the organic growth.',
    ],
    primaryAction: { label: 'Start a project', href: '/en/contact' },
    secondaryAction: { label: 'See our services', href: '/en/services' },
  },

  heroProjects: [
    {
      id: 'olie',
      label: 'Olie 6',
      href: '/en/projects',
      surface: '#e6ecf8',
      shot: '/images/portfolio/tiles/olie-6.webp',
    },
    {
      id: 'neot-sade',
      label: 'Neot Sade',
      href: '/en/projects',
      surface: '#f4e8d2',
      shot: '/images/portfolio/tiles/neot-sade.webp',
    },
    {
      id: 'hofit',
      label: 'Hofit Cosmetics',
      href: '/en/projects',
      surface: '#e2ece0',
      shot: '/images/portfolio/tiles/hofit-cosmetics.webp',
    },
    {
      id: 'karin-cohen',
      label: 'Karin Cohen',
      href: '/en/projects',
      surface: '#ece2f3',
      shot: '/images/portfolio/tiles/karin-cohen.webp',
    },
    {
      id: 'brand-identity',
      label: 'Brand identity',
      href: '/en/projects',
      surface: '#f7ded6',
      shot: '/images/portfolio/tiles/brand-identity.webp',
    },
  ],

  heroRails: {
    projectsTitle: 'Selected work',
    projectsAdvance: 'Next project',
    topicsTitle: 'Technologies and disciplines we specialise in',
    topicsAdvance: 'More disciplines',
  },

  heroTopics: [
    'Custom development',
    'Organic search',
    'Web platforms',
    'Business automation',
    'API integrations',
    'Technical SEO',
    'Headless architecture',
    'Web applications',
    'eCommerce',
    'Core Web Vitals',
    'UI/UX design',
    'Generative engine optimisation',
  ],

  about: {
    eyebrow: 'ABOUT AITERRA',
    heading: ['Engineering, design and search', 'without juggling five vendors.'],
    lede: 'Most digital projects break in the handoffs: the agency that designs it cannot build it, the developer who builds it cannot rank it, and the SEO consultant files tickets nobody picks up. We keep all of it in one team.',
    outro: 'Our team is ready to take your digital presence forward. Are you?',
    action: { label: 'Scope your project', href: '/en/contact' },
  },

  aboutRoles: [
    {
      id: 'project-manager',
      title: 'Project lead',
      art: '/images/about-card4.webp',
      text: 'One person who owns the timeline, coordinates every specialist and keeps the project on schedule and on budget. You never chase status updates.',
    },
    {
      id: 'marketing',
      title: 'Growth and strategy',
      art: '/images/about-card3.webp',
      text: 'We connect positioning, audience and messaging so the site and the campaigns behind it pull in the same direction instead of competing.',
    },
    {
      id: 'build',
      title: 'Engineers and designers',
      art: '/images/about-card2.webp',
      text: 'UX and custom development built together, so the product looks right and loads fast on the devices your customers actually use.',
    },
    {
      id: 'seo',
      title: 'SEO engineers',
      art: '/images/about-card1.webp',
      text: 'Organic search handled at the code level. When a technical issue blocks rankings, the people who can fix it sit in the same room.',
    },
  ],

  stats: {
    heading: ['The engineering is the method.', 'The business result is the point.'],
    lede: 'We work in a modern stack - Next.js, React and TypeScript - and judge every project against numbers rather than impressions: load time, stability over time and the conversion rate you actually get.',
  },

  statItems: [
    {
      id: 'clients',
      value: '75+',
      label: 'Businesses served',
      text: 'Companies that moved their site, their search visibility or their internal systems forward with us.',
    },
    {
      id: 'campaigns',
      value: '50+',
      label: 'Campaigns under management',
      text: 'Paid and organic programmes we run and measure continuously, not set-and-forget launches.',
    },
    {
      id: 'ownership',
      value: '100%',
      label: 'Code ownership on handover',
      text: 'You receive the repository and every service credential at delivery. No vendor lock-in, no hostage situations.',
    },
    {
      id: 'disciplines',
      value: '5',
      label: 'Disciplines under one roof',
      text: 'Strategy, design, engineering, organic search and paid media - staffed in-house rather than subcontracted.',
    },
  ],

  services: {
    lead: {
      text: 'Let us turn these numbers into results for your business',
      action: { label: 'Scope your project', href: '/en/contact' },
    },
    eyebrow: 'OUR SERVICES',
    heading: ['Everything your business needs online.'],
    lede: 'Discovery, design, engineering, organic search and paid media - every stage of building your digital presence sits with one team and one project lead, from the first call through launch and beyond.',
  },

  serviceTabs: [
    {
      id: 'web-development',
      label: 'Web development',
      tags: [
        'Discovery and scoping',
        'UX/UI design',
        'Next.js and React',
        'Headless architecture',
        'Core Web Vitals',
        'Accessibility',
      ],
      question: 'What is different about how we build?',
      paragraphs: [
        'We build in code rather than fighting the limits of a theme and a stack of plugins. That means the information architecture, the integrations and the buyer journey follow your business logic instead of a template author’s assumptions.',
        'Performance is measured during development, not patched at the end. A slow site burns paid budget and loses visitors before they ever read the offer.',
      ],
      action: { label: 'Custom web development', href: '/en/services/web-development' },
    },
    {
      id: 'seo',
      label: 'SEO',
      tags: [
        'Keyword research',
        'Technical SEO',
        'Content strategy',
        'Digital PR',
        'Local search',
        'AI search visibility',
      ],
      question: 'What is different about how we rank sites?',
      paragraphs: [
        'The team that ranks your site also writes its code. A technical blocker - render-blocking scripts, broken schema, a bad URL structure - gets fixed in the repository this sprint instead of sitting in another vendor’s backlog for a quarter.',
        'We report on qualified enquiries, not just positions. Rankings that do not produce pipeline are a vanity metric.',
      ],
      action: { label: 'SEO and website promotion', href: '/en/services/seo' },
    },
    {
      id: 'development',
      label: 'Custom platforms',
      tags: [
        'Web applications',
        'Customer portals',
        'Dashboards',
        'Business automation',
        'API integrations',
        'Internal tools',
      ],
      question: 'What is different about our platform work?',
      paragraphs: [
        'We build the systems that off-the-shelf software cannot cover: portals with role-based access, operational dashboards, workflow automation and the integrations that move data between them reliably.',
        'Every platform is designed to be extended. Growth should mean adding a module, not commissioning a rewrite.',
      ],
      action: { label: 'Custom web platforms', href: '/en/services/development' },
    },
  ],

  allIn: {
    eyebrow: 'ALL-IN-ONE',
    heading: ['Engineering, the website and growth', 'have to work as one system'],
  },

  allInNodes: [
    {
      id: 'discovery',
      label: 'Discovery',
      side: 'left',
      x: '21.4%',
      y: '54.2%',
      edge: '9%',
      mobile: { x: '73.4%', y: '67.3%', place: 'bottom', len: '96px' },
    },
    {
      id: 'marketing',
      label: 'Growth',
      side: 'right',
      x: '70.5%',
      y: '54.2%',
      edge: '89.2%',
      mobile: { x: '72.5%', y: '37.5%', place: 'top', len: '96px' },
    },
    {
      id: 'creative',
      label: 'Content',
      side: 'left',
      x: '24.4%',
      y: '69.7%',
      edge: '8.7%',
      mobile: { x: '50%', y: '73.4%', place: 'bottom', len: '52px' },
    },
    {
      id: 'design',
      label: 'Design',
      side: 'right',
      x: '82.5%',
      y: '69.7%',
      edge: '92.8%',
      mobile: { x: '50%', y: '29.7%', place: 'top', len: '56px' },
    },
    {
      id: 'seo',
      label: 'SEO',
      side: 'left',
      x: '22.2%',
      y: '85.5%',
      edge: '8.7%',
      mobile: { x: '26.6%', y: '67.3%', place: 'bottom', len: '96px' },
    },
    {
      id: 'development',
      label: 'Engineering',
      side: 'right',
      x: '84%',
      y: '80.9%',
      edge: '93.8%',
      mobile: { x: '27.5%', y: '37.5%', place: 'top', len: '96px' },
    },
  ],

  faq: {
    heading: ['Before we start', 'a few things worth knowing.'],
  },

  faqEntries: [
    {
      id: 'cost',
      question: 'How much does a custom website cost to build?',
      answer:
        'Pricing follows scope rather than page count alone. A focused landing page, a full marketing site, and a custom platform with authentication and integrations sit in very different ranges. After a short discovery call you get a written quote that states exactly what is included and what is not, with no costs that surface halfway through the build.',
    },
    {
      id: 'timeline',
      question: 'How long does it take to build a custom website?',
      answer:
        'A landing page ships in a few weeks. A full marketing site typically runs one to two months. Web applications and custom platforms take longer, driven by the depth of the business logic and the integrations involved. In practice the schedule is set less by engineering than by content and assets, which is why we lock those during discovery.',
    },
    {
      id: 'template-vs-custom',
      question: 'What is the difference between custom web development and a website template?',
      answer:
        'A template forces your content, navigation and workflows into layouts someone else designed for a generic business. Custom development inverts that: the structure follows how your business actually sells and operates. The practical differences show up in page speed, in how cleanly the site connects to your CRM and back office, and in what happens when you need a feature the template author never anticipated.',
    },
    {
      id: 'ownership',
      question: 'Do we own the code after the project is delivered?',
      answer:
        'Yes. You receive full ownership of the repository plus access to the domain, hosting and every connected service at handover. We do not retain clients through technical lock-in. If you decide to continue with another partner, the transition is documented and straightforward.',
    },
    {
      id: 'seo-timeline',
      question: 'How long does SEO take to show results?',
      answer:
        'Early signals - improved indexation and movement on lower-competition terms - usually appear within two to four months. Meaningful gains on competitive commercial terms typically take six months or more. A brand new domain starts slower than an established site with existing authority. Anyone promising faster than that is describing an outcome they cannot control.',
    },
    {
      id: 'seo-vs-ads',
      question: 'Should we invest in SEO or paid ads?',
      answer:
        'Paid search delivers traffic on day one and stops the moment the budget does. Organic search takes months to compound but keeps producing enquiries after the spend pauses. For most businesses the answer is both, weighted differently by stage: paid to validate demand and messaging quickly, organic as the asset that lowers acquisition cost over time.',
    },
    {
      id: 'ai-search',
      question: 'Will our site show up in AI Overviews and ChatGPT answers?',
      answer:
        'That work is called generative engine optimisation, and we treat it as part of the SEO engagement rather than an upsell. In practice it means content that answers questions directly and citably, valid structured data, authority and mentions across sources these systems already trust, and crawler access configured deliberately. It matters because a growing share of searches now end without a click to any website.',
    },
    {
      id: 'integrations',
      question: 'Can you integrate with our CRM, ERP and payment systems?',
      answer:
        'Yes - it is usually the reason clients come to us. We build API integrations between the site and the tools you already run, so leads, orders, invoices and inventory move automatically instead of being retyped between systems. Where an integration is genuinely not feasible, we tell you during discovery rather than after the contract is signed.',
    },
    {
      id: 'existing-site',
      question: 'We already have a website. Can you improve it instead of rebuilding?',
      answer:
        'Often, yes. Discovery starts by establishing what is worth keeping: content, URL structure and existing organic rankings. Where a rebuild is the right call, we plan the 301 redirect map before anything moves. An unplanned migration off an established site is one of the fastest ways to erase years of accumulated search equity.',
    },
    {
      id: 'support',
      question: 'What happens after launch?',
      answer:
        'Launch is the start of the engagement, not the end of it. We monitor performance and errors, ship security and dependency updates, keep improving the pages that carry commercial weight, and stay available for changes. You get clear reporting and one named point of contact throughout.',
    },
  ],

  partners: {
    caption: 'Platforms and technologies we specialise in',
    logos: [
      { name: 'Next.js', src: '/icons/tech/nextjs.svg', scale: 0.9 },
      { name: 'React', src: '/icons/tech/react.svg', scale: 0.95 },
      { name: 'React Native', src: '/icons/tech/react-native.svg', scale: 0.9 },
      { name: 'TypeScript', src: '/icons/tech/typescript.svg', scale: 0.9 },
      { name: 'Tailwind CSS', src: '/icons/tech/tailwindcss.svg', scale: 0.95 },
      { name: 'Vite', src: '/icons/tech/vite.svg', scale: 0.9 },
      { name: 'Three.js', src: '/icons/tech/threejs.svg', scale: 0.85 },
      { name: 'Node.js', src: '/icons/tech/nodejs.svg', scale: 0.95 },
      { name: 'FastAPI', src: '/icons/tech/fastapi.svg', scale: 0.9 },
      { name: 'Python', src: '/icons/tech/python.svg', scale: 0.95 },
      { name: 'Prisma', src: '/icons/tech/prisma.svg', scale: 0.9 },
      { name: 'PostgreSQL', src: '/icons/tech/postgresql.svg', scale: 0.95 },
      { name: 'MongoDB', src: '/icons/tech/mongodb.svg', scale: 0.95 },
      { name: 'Docker', src: '/icons/tech/docker.svg', scale: 0.95 },
      { name: 'GitHub Actions', src: '/icons/tech/githubactions.svg', scale: 0.85 },
      { name: 'AWS', src: '/icons/tech/aws.svg', scale: 0.9 },
      { name: 'Cloudflare', src: '/icons/tech/cloudflare.svg', scale: 0.95 },
      { name: 'Figma', src: '/icons/tech/figma.svg', scale: 0.9 },
      { name: 'Google Analytics', src: '/icons/tech/googleanalytics.svg', scale: 0.9 },
      { name: 'Google Tag Manager', src: '/icons/tech/googletagmanager.svg', scale: 0.9 },
    ],
  },

  contact: {
    heading: ['Let us build', 'your next project.'],
    art: {
      src: '/images/form.webp',
      caption: ["Let's kick off", 'your project'],
    },
    title: 'Tell us about it',
    fields: {
      name: 'Full name',
      phone: 'Phone',
      email: 'Email',
      service: 'Service',
      servicePlaceholder: 'Select a service',
      message: 'What do you want to build, improve or solve?',
    },
    serviceOther: 'Other',
    consent: {
      before: 'I have read and agree to the ',
      terms: { label: 'terms of use', href: '/terms-of-use' },
      joiner: ' and the ',
      privacy: { label: 'privacy policy', href: '/privacy-policy' },
      after: '.',
    },
    submit: 'Request a free consultation',
    sending: 'Sending…',
    success: {
      title: 'Thank you - we have your enquiry.',
      text: 'We will get back to you shortly to arrange an introductory call.',
    },
    error: 'Something went wrong. Please try again, or email us at info@aiterra.co.il',
  },

  footer: {
    brand: 'AITERRA',
    columns: [
      {
        id: 'services',
        title: 'Services',
        links: [
          { label: 'Custom web development', href: '/en/services/web-development' },
          { label: 'SEO and website promotion', href: '/en/services/seo' },
          { label: 'Custom web platforms', href: '/en/services/development' },
          { label: 'All services', href: '/en/services' },
        ],
      },
      {
        id: 'general',
        title: 'Company',
        links: [
          { label: 'About the agency', href: '/en/about' },
          { label: 'Our work', href: '/en/projects' },
          { label: 'Contact', href: '/en/contact' },
          { label: 'Hebrew site', href: '/' },
        ],
      },
    ],
    contactTitle: 'Get in touch',
    socialLabels: { instagram: 'Instagram', facebook: 'Facebook' },
    legal: [
      { label: 'Accessibility statement', href: '/accessibility-statement' },
      { label: 'Terms of use', href: '/terms-of-use' },
      { label: 'Privacy policy', href: '/privacy-policy' },
    ],
    copyright: 'Copyright ©Aiterra. All rights reserved',
  },

  portfolio: {
    eyebrow: 'SELECTED WORK',
    heading: ['A look at some of the projects', 'we have shipped'],
    lede: 'Online stores, lead-generating sites, internal systems and brand work. Each project below had a defined commercial goal before a line of code was written, and each one is live today.',
    cardAction: 'Visit the site',
    prev: 'Previous project',
    next: 'Next project',
    outro: 'Like what you see? Take a look at the rest of the work.',
    action: { label: 'See all our work', href: '/en/projects' },
  },

  portfolioFilters: [
    { id: 'all', label: 'All' },
    { id: 'sales', label: 'Online stores' },
    { id: 'brand', label: 'Brand and leads' },
    { id: 'systems', label: 'Systems' },
  ],

  portfolioItems: [
    {
      id: 'neot-sade',
      title: 'Neot Sade — grocery delivery store',
      tags: ['Next.js', 'eCommerce', 'Payments', 'Loyalty club'],
      shot: '/images/portfolio/cards/neot-sade.webp',
      href: 'https://neotsade.co.il/',
      category: 'sales',
    },
    {
      id: 'alova',
      title: 'ALOVA — hair care store',
      tags: ['Shopify', 'Online store', 'UI/UX'],
      shot: '/images/portfolio/cards/alova.webp',
      href: 'https://alovacosmetics.com/',
      category: 'sales',
    },
    {
      id: 'olie-6',
      title: 'Olie 6 — olive oil store',
      tags: ['Shopify', 'eCommerce', 'UI/UX'],
      shot: '/images/portfolio/cards/olie-6.webp',
      href: 'https://olie6.com/',
      category: 'sales',
    },
    {
      id: 'hofit-cosmetics',
      title: 'Hofit Cosmetics — treatment booking',
      tags: ['Landing page', 'UI/UX', 'Lead capture', 'WhatsApp'],
      shot: '/images/portfolio/cards/hofit-cosmetics.webp',
      href: 'https://hofit-cosmetics.com/',
      category: 'sales',
    },
    {
      id: 'sous-chef',
      title: 'Sous Chef — SaaS product site',
      tags: ['SaaS', 'Product site', 'UI/UX'],
      shot: '/images/portfolio/cards/sous-chef.webp',
      href: 'https://onetablet.com/',
      category: 'systems',
    },
    {
      id: 'karin-cohen',
      title: 'Karin Cohen — lash academy',
      tags: ['Landing page', 'UI/UX', 'Lead capture', 'WhatsApp'],
      shot: '/images/portfolio/cards/karin-cohen.webp',
      href: 'https://karin-cohen.com/',
      category: 'brand',
    },
    {
      id: 'maayan-cosmetics',
      title: 'Maayan Vaknin — clinical cosmetics',
      tags: ['Landing page', 'UI/UX', 'Accessibility', 'Lead capture'],
      shot: '/images/portfolio/cards/maayan-cosmetics.webp',
      href: 'https://maayan-cosmetics.com/',
      category: 'brand',
    },
    {
      id: 'eli-ben-yitzhak',
      title: 'Eli Ben Yitzhak — hair design',
      tags: ['Landing page', 'UI/UX', 'Work gallery', 'WhatsApp'],
      shot: '/images/portfolio/cards/eli-ben-yitzhak.webp',
      href: 'https://elibenyizhak.com/',
      category: 'brand',
    },
    {
      id: 'brand-identity',
      title: 'Ram and Haim — real estate marketing',
      tags: ['SEO', 'Reputation', 'Digital assets'],
      shot: '/images/portfolio/cards/brand-identity.webp',
      href: 'https://ram-haim.co.il/',
      category: 'brand',
    },
    {
      id: 'marketing-platform',
      title: 'Avi — mortgage advisory',
      tags: ['Branding', 'Landing pages', 'Meta ads', 'Funnel'],
      shot: '/images/portfolio/cards/marketing-platform.webp',
      href: 'https://avi-mashkanta.com/',
      category: 'brand',
    },
  ],

  blog: {
    title: 'Blog',
    metaTitle: 'Blog - Guides on Web Development and SEO',
    metaDescription:
      'Practical guides and insights on custom web development, organic search, paid campaigns and business automation from the AiTerra team.',
    lede: 'Professional insight, practical guides and news from the world of digital. Our knowledge, for you.',
    crumbHome: 'Home',
    crumbsLabel: 'Breadcrumb',
    filters: [
      { id: 'all', label: 'All', tag: 'BLOG', match: [] as string[] },
      { id: 'seo', label: 'SEO', tag: 'SEO', match: ['SEO', 'search', 'Google'] },
      {
        id: 'sites',
        label: 'Websites',
        tag: 'WEBSITES',
        match: ['website', 'WordPress', 'Next.js', 'React', 'landing page'],
      },
      { id: 'tips', label: 'Guides', tag: 'TIPS', match: ['guide', 'automation', 'CRM', 'marketing'] },
    ],
    readTime: 'min read',
    readMore: 'Read the article',
    loadMore: 'Load more articles',
    defaultTag: 'BLOG',
    empty: 'No articles in this category yet.',
    defaultAuthor: 'The Aiterra team',
  },

  servicesStack: {
    eyebrow: 'OUR SERVICES',
    heading: ['Every capability under', 'one roof'],
    lede: 'We do not separate the engineering from the growth work. The team that ships your code is the team accountable for how it performs in search - which removes the handoff where most agency projects quietly stall.',
    items: [
      {
        id: 'web-development',
        title: 'Custom web development',
        image: '/images/service3.webp',
        tags: [
          'Discovery',
          'UX/UI design',
          'Next.js and React',
          'Core Web Vitals',
          'Accessibility',
          'Code ownership',
        ],
        text: 'Websites built in code around how your business actually sells - fast, accessible, and structured for organic search from day one. You own the repository.',
        action: { label: 'Learn more', href: '/en/services/web-development' },
      },
      {
        id: 'seo',
        title: 'SEO and website promotion',
        image: '/images/service-page2.webp',
        tags: [
          'Keyword research',
          'Technical SEO',
          'Content',
          'Digital PR',
          'Local search',
          'AI search visibility',
        ],
        text: 'Organic growth measured in qualified enquiries rather than positions. The same team writes the code, so technical blockers get fixed in the repository instead of a backlog.',
        action: { label: 'Learn more', href: '/en/services/seo' },
      },
      {
        id: 'development',
        title: 'Custom web platforms',
        image: '/images/service2.webp',
        tags: [
          'Web applications',
          'Customer portals',
          'Dashboards',
          'Automation',
          'API integrations',
          'Internal tools',
        ],
        text: 'Portals, dashboards, internal tools and the integrations between them - built for the workflows that off-the-shelf software cannot cover.',
        action: { label: 'Learn more', href: '/en/services/development' },
      },
    ],
  },

  servicesPage: {
    title: ['End-to-end digital', 'engineering and growth'],
    crumb: 'Services',
    metaTitle: 'Custom Web Development, SEO and Platform Services',
    metaDescription:
      'Custom web development, SEO and website promotion, and bespoke web platforms from one in-house team. Full code ownership, measurable organic growth, no vendor lock-in.',
    lede: 'From the technical foundations through to paying customers. We provide a complete service layer sized to your business, built to turn every digital asset into a growth engine.',
    action: { label: 'Start a project', href: '/en/contact' },
    faqHeading: ['Frequently asked questions', 'about our services'],
  },

  contactPage: {
    title: 'Let us talk',
    crumb: 'Contact',
    lede: 'From technical foundations through to paying customers - we would like to hear about your business. Leave your details and we will come back with a tailored plan of action.',
    metaTitle: 'Contact AiTerra - Free Initial Consultation',
    metaDescription:
      'Planning a custom website, a web platform or an SEO programme? Leave your details and we will respond with a tailored plan and transparent pricing.',
    details: {
      heading: 'Contact details',
      mapTitle: 'AITERRA office location',
      emailLabel: 'Email us',
      phoneLabel: 'Call us',
      addressLabel: 'Our address',
      maps: 'Open the address in Google Maps',
      waze: 'Navigate with Waze',
    },
  },

  aboutPage: {
    title: 'About us',
    metaTitle: 'About AiTerra - Engineering and Growth Under One Roof',
    metaDescription:
      'AiTerra is a custom web development and SEO agency. Meet the team, the working method and the experience behind hundreds of delivered projects.',
    lede: 'Digital moves fast. We make sure you stay a step ahead of it.',
    eyebrow: 'ABOUT AITERRA',
    heading: ['Technology that builds websites.', 'Strategy that builds businesses.'],
    paragraphs: [
      'AiTerra closes the gap between complex technology and results a business can actually measure.',
      'From strategy and UX through scalable platform engineering, organic search and paid campaigns, we turn your digital presence into a growth engine rather than a line item.',
    ],
    blocks: [
      {
        id: 'about',
        eyebrow: 'ABOUT AITERRA',
        heading: ['Moving businesses', 'two steps ahead'],
        text: 'With AiTerra there is no need to chase a different vendor for every stage. Discovery, design, engineering, organic search, paid campaigns and content sit with one team that owns the whole process. The result is a smoother project, direct communication, and a complete digital solution that actually moves the numbers.',
        image: '/images/about-page1.webp',
      },
      {
        id: 'strategy',
        eyebrow: 'OUR STRATEGY',
        heading: ['From strategy to results'],
        text: 'We do not just build websites - we support businesses at every stage of their digital presence. From user experience and engineering through organic search and campaign management, every decision is tied back to a commercial goal that was agreed before the work started.',
        image: '/images/about-page2.webp',
      },
    ],
    teamEyebrow: 'OUR PEOPLE',
    teamHeading: ['The people behind the technology', 'and behind your results'],
    teamLede: 'The best technology in the world is worth very little without the right people running it. We keep a small, senior team where the person who scopes your project is the person accountable for delivering it.',
    teamMore: 'More about',
    teamClose: 'Close',
    faqHeading: ['Frequently asked questions', 'why work with AiTerra?'],
  },

  aboutValues: {
    eyebrow: 'OUR VALUES',
    heading: ['Our values and vision'],
    lede: 'The principles that guide how we work with every client and every project we take on.',
    roles: [
      {
        id: 'people',
        title: 'People first',
        art: '/images/about-icon1.webp',
        text: 'Behind every project are people - your customers, your visitors and our team. We listen, clarify, and build solutions that genuinely serve them.',
      },
      {
        id: 'strategy',
        title: 'Strategy',
        art: '/images/about-icon2.webp',
        text: 'Before a line of code or a campaign there is a plan: defined goals, a defined audience and a way to measure. That is how each step actually moves the business.',
      },
      {
        id: 'excellence',
        title: 'Craft',
        art: '/images/about-icon3.webp',
        text: 'We do not compromise on quality in code, in design or in outcomes. Every project goes through rigorous review before it ships.',
      },
      {
        id: 'progress',
        title: 'Progress',
        art: '/images/about-icon4.webp',
        text: 'Digital does not stand still, and neither do we. We adopt new technology when it measurably improves the result, not because it is new.',
      },
    ],
  },
}

export const projectsPageEn = {
  title: ['Selected work'],
  crumb: 'Work',
  lede: 'Ten live projects — online stores, lead-generating sites and product platforms. Every one was built in code, shipped by the same team that handles its organic search, and is running in production today.',
  action: { label: 'Start a project', href: '/en/contact' },
  faqHeading: ['Before we start', 'a few things worth knowing.'],
  metaTitle: 'Our Work - Custom Websites, Online Stores and Platforms',
  metaDescription:
    'Ten live projects built in code by AITERRA: Shopify and Next.js stores, lead-generating sites and SaaS product platforms. See what we shipped and what each one was built to do.',
}
