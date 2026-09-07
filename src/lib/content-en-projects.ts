import type { PortfolioProject } from '@/types'

type ProjectOverride = Partial<
  Pick<
    PortfolioProject,
    | 'title'
    | 'category'
    | 'heroTitle'
    | 'heroDescription'
    | 'metaDescription'
    | 'imageAlt'
    | 'projectType'
    | 'technology'
    | 'tags'
    | 'challenge'
    | 'solution'
  >
>

export const projectsEn: Record<string, ProjectOverride> = {
  'neot-sade': {
    title: 'Neot Sade',
    category: 'Online stores',
    heroTitle: 'Neot Sade — fresh produce delivered online',
    projectType: 'Online store',
    technology: 'Next.js · custom admin system',
    tags: ['Next.js', 'eCommerce', 'Payments', 'Loyalty club'],
    heroDescription:
      'We built Neot Sade a full online store for home delivery of fruit, vegetables and pantry goods across Raanana and the Sharon region. It includes a catalogue managed through a custom admin, a shopping cart with secure card payments on site, a loyalty club with points and cashback, and delivery fees calculated from the customer address at checkout.',
    metaDescription:
      'An online grocery store for Neot Sade: fresh fruit and vegetable delivery in Raanana, a self-managed catalogue, secure payments and a customer loyalty club. See the full project.',
    imageAlt: 'Screenshot of the Neot Sade homepage — an online fruit and vegetable store',
    challenge: {
      text: 'Selling fresh produce online is not an ordinary store: prices move, some items are sold by weight rather than by unit, and delivery fees depend on the customer address. On top of that, the Neot Sade team needed to run the catalogue themselves — adding products, updating prices and closing out items that had sold out — without going back to a developer for every change.',
    },
    solution: {
      text: 'We built the store fully in code on Next.js over a purpose-built admin system: a catalogue the team updates on their own, support for selling by weight, a cart with secure on-site card payments, delivery fees calculated from the customer address at checkout, and a loyalty club with points and cashback. Everything runs from one interface, and we continue to maintain and develop the system after launch.',
    },
  },

  alova: {
    title: 'ALOVA — hair care',
    category: 'Online stores',
    heroTitle: 'ALOVA',
    projectType: 'Online store',
    technology: 'Shopify · custom design and development',
    tags: ['Shopify', 'Online store', 'UI/UX'],
    heroDescription:
      'ALOVA is a botanically based hair and scalp care line, sold direct to consumer and through salons. We built the brand a fully Hebrew Shopify store that explains the range and sells it in the same breath: a quiet, premium design that puts the product at the centre, alongside a short and unambiguous path to purchase.',
    metaDescription:
      'A Shopify store for the ALOVA hair care brand: minimalist Hebrew design, content pages explaining the pre-wash range, and a short purchase path built to convert. See the full project.',
    imageAlt: 'Screenshot of the ALOVA homepage',
    challenge: {
      text: 'Pre-wash scalp treatment is a category most of the Israeli audience does not yet know, and the purchase only comes once the value is understood. The challenge was a site doing two jobs at once — explaining what a formula focused on scalp health actually does and why it is used before washing, while closing a sale on the same screen. Rather than separating the two, we built dedicated content pages for each of the two flagship products and folded them into the customer journey, so every question is answered exactly where it arises.',
    },
    solution: {
      text: 'We built a fully right-to-left Hebrew Shopify store with a calm, minimalist design that lets the product photography and brand language lead: short navigation between the two products and their content pages, a before-and-after comparison that makes the result tangible, newsletter capture in exchange for a discount, and a shortened checkout with secure payments. The result is a premium brand experience that does not come at the cost of conversion rate.',
    },
  },

  'karin-cohen': {
    title: 'Karin Cohen — lash academy',
    category: 'Web development',
    heroTitle: 'Karin Cohen — lash and permanent makeup academy',
    tags: ['Landing page', 'UI/UX', 'Leads', 'WhatsApp'],
    heroDescription:
      'A brand and sales site for the Karin Cohen academy in Holon. We built one long page that carries the visitor from the personal story through to enrolment: two course tracks with pricing and an offer, a cosmetics and permanent makeup treatment menu, a before-and-after gallery, client testimonials, an FAQ, an appointment form and a direct WhatsApp connection.',
    metaDescription:
      'A site for the Karin Cohen academy in Holon: course tracks, cosmetics and permanent makeup treatments, a before-and-after gallery and an appointment form. See the full project.',
    imageAlt: 'Screenshot of the Karin Cohen academy homepage',
  },

  'hofit-cosmetics': {
    title: 'Hofit Cosmetics',
    category: 'Web development',
    heroTitle: 'Hofit Cosmetics — a beauty clinic in Holon',
    tags: ['Landing page', 'UI/UX', 'WhatsApp', 'Leads'],
    heroDescription:
      'A site for the Hofit Cosmetics clinic in Holon. It presents cold laser hair removal, RF skin tightening and microblading, and includes a comparison table against other clinics, before-and-after galleries, client reviews and an enquiry form — with every call to action leading straight to WhatsApp to book an appointment.',
    metaDescription:
      'A site for the Hofit Cosmetics clinic in Holon: cold laser hair removal, RF skin tightening and microblading, before-and-after galleries and WhatsApp booking.',
    imageAlt: 'Screenshot of the Hofit Cosmetics homepage',
  },

  'maayan-cosmetics': {
    title: 'Maayan Vaknin — clinical cosmetics',
    category: 'Web development',
    heroTitle: 'Maayan Vaknin — clinical cosmetician',
    tags: ['Landing page', 'UI/UX', 'Accessibility', 'Leads'],
    heroDescription:
      'A site for clinical cosmetician Maayan Vaknin in Holon. We built a clean, typographic site with a full treatment menu and separate price list, a work gallery split between makeup and cosmetics, a catalogue of the clinic products, an appointment form and a WhatsApp connection — alongside terms, privacy policy and accessibility statement pages.',
    metaDescription:
      'A site for clinical cosmetician Maayan Vaknin in Holon: treatment menu and price list, work gallery, product catalogue and appointment booking. See the full project.',
    imageAlt: 'Screenshot of the Maayan Vaknin clinical cosmetics homepage',
  },

  'eli-ben-yitzhak': {
    title: 'Eli Ben Yitzhak',
    category: 'Web development',
    heroTitle: 'Eli Ben Yitzhak — a hair design studio in Bat Yam',
    tags: ['Landing page', 'UI/UX', 'Work gallery', 'WhatsApp'],
    heroDescription:
      'A brand site for Eli Ben Yitzhak, a boutique hair design studio in Bat Yam specialising in organic straightening, ombré and balayage. The site presents services for men, women and children, a gallery of work from the studio, client testimonials and an enquiry form — with every call to action leading to booking by phone or WhatsApp.',
    metaDescription:
      'A brand site for the Eli Ben Yitzhak studio in Bat Yam: organic hair straightening, ombré and balayage, a work gallery, testimonials and WhatsApp booking.',
    imageAlt: 'Screenshot of the Eli Ben Yitzhak hair design studio homepage',
  },

  'olie-6': {
    title: 'Olie 6',
    category: 'Web development',
    heroTitle: 'Olie 6',
    tags: ['Shopify', 'eCommerce', 'UI/UX'],
    heroDescription:
      'For Olie 6, a cosmetics brand specialising in facial serums, we developed an advanced Shopify-based e-commerce foundation. The site was designed along a minimalist, premium line and engineered from the outset with one clear aim: to maximise sales conversion and create a frictionless user experience.',
    metaDescription:
      'A Shopify store for the Olie 6 cosmetics brand: minimalist premium design, a frictionless buying experience and an e-commerce foundation built to maximise conversion. See the full project.',
    imageAlt: 'Screenshot of the Olie 6 homepage',
    challenge: {
      text: 'The central challenge was translating the quality and premium feel of the products into a digital space, so we built a complete Shopify foundation using open-source development. That approach gave us maximum flexibility to customise every element and create a clean, minimalist and elegant interface that puts the serums at the centre. Beyond the considered appearance, every button, menu and checkout step on the site was designed and engineered to form an intelligent funnel that carries the visitor intuitively toward conversion.',
    },
    solution: {
      text: 'Our work with Olie 6 goes well beyond building a store — it is a complete digital growth arrangement working in sync. We currently run the brand campaigns in parallel to drive targeted traffic from a qualified audience, and continue to maintain the site with ongoing daily development. That combination of media management alongside constant technical optimisation of the site lets us improve conversion rate consistently and hold the standard a premium cosmetics brand requires.',
    },
  },

  'ecommerce-store': {
    title: 'Digital store',
    category: 'Online stores',
    heroTitle: 'An advanced digital store',
    tags: ['React', 'Node.js', 'Stripe'],
    heroDescription:
      'Development of a complete online store with a shopping cart, secure payment processing and an advanced product management system.',
    metaDescription:
      'Development of a complete online store: shopping cart, secure payments and an advanced product management system. How we built a fast e-commerce site that turns visitors into buyers.',
    imageAlt: 'Screenshot of the store homepage',
  },

  'brand-identity': {
    title: 'Ram and Haim — real estate marketing',
    category: 'Digital marketing',
    heroTitle: 'Ram and Haim — real estate marketing',
    tags: ['SEO', 'Reputation management', 'Digital assets'],
    heroDescription:
      'We built and managed a set of digital assets for Ram and Haim Real Estate Marketing, focusing on establishing a strong and authoritative online presence. The project covered setting up a stable digital foundation as a base for growth, and considered reputation management designed to build trust and generate quality enquiries in a competitive real estate market.',
    metaDescription:
      'Digital asset and reputation management for Ram and Haim real estate marketing: an authoritative online presence, a stable digital foundation and a system that produces warm enquiries.',
    imageAlt: 'Screenshot of the Ram and Haim real estate marketing homepage',
    challenge: {
      text: 'In real estate, trust and professional authority are the key to every successful deal. The central goal with Ram and Haim was to translate their professionalism in the field into the digital space, and to establish a presence that signals leadership. The process began with organising and refining the digital assets, including a strategic domain choice and correct technical foundations from the ground up. Our focus was on giving them a strong digital starting point, correctly built, that would let the brand stand out and serve as a solid base for every future marketing move.',
    },
    solution: {
      text: 'A critical part of the strategy focused on managing the team reputation online. We created an orderly process for collecting, managing and surfacing reviews and testimonials from past clients, producing strong social proof that converts interested visitors into prospects. The established digital foundation we built for Ram and Haim, together with careful reputation management, created a genuine asset that gives them a clear competitive advantage.',
    },
  },

  'marketing-platform': {
    title: 'Avi Mortgage Advisory',
    category: 'Digital growth',
    heroTitle: 'Avi Mortgage Advisory',
    tags: ['Branding', 'Landing pages', 'Meta', 'Funnel'],
    heroDescription:
      'We created a complete digital and brand package for Avi Mortgage Advisory, from a visual language and business cards through to converting landing pages. Alongside it we built and ran an advanced Meta campaign system based on an intelligent funnel that brings in qualified leads and warms them through to a closed deal.',
    metaDescription:
      'Branding, landing pages and Meta campaigns for Avi Mortgage Advisory: an intelligent funnel producing qualified leads every day. See the process and the results.',
    imageAlt: 'Screenshot of the Avi Mortgage Advisory homepage',
    challenge: {
      text: 'Mortgage advisory demands trust and authority from the very first click. For Avi, the goal was a tightly built digital presence signalling professionalism, quality and confidence to prospects standing before one of the largest financial decisions of their lives. We started by consolidating a consistent brand language and designing the graphic assets, then moved on to dedicated landing pages. Those pages were carefully planned at the level of user experience and copy, to present Avi added value clearly and move visitors to leave their details or make quick contact, including a direct WhatsApp connection.',
    },
    solution: {
      text: 'Beyond the look and the foundations, our focus was building an active growth engine. We created a comprehensive Meta advertising strategy, scaling from a simple lead campaign into a deep 360-degree funnel. Through constant optimisation and varied creative — including long-form video that delivers real value — we surrounded the target audience from every direction. That let us fill the funnel, filter out irrelevant enquiries and deliver Avi far more mature and qualified leads, which raised the conversion rate of the business substantially.',
    },
  },

  'alexandra-patsina': {
    title: 'Alexandra Patsina',
    category: 'Web development',
    heroTitle: 'Alexandra Patsina',
    tags: ['UI/UX', 'Branding', 'Website'],
    heroDescription: 'A brand site, identity and digital presence.',
    metaDescription:
      'A brand site for Alexandra Patsina: personal branding, clean design and a digital presence that signals professionalism. What a brand site that works for its owner looks like.',
    imageAlt: 'Screenshot of the Alexandra Patsina homepage',
  },

  'sous-chef': {
    title: 'Sous Chef',
    category: 'Web development',
    heroTitle: 'Sous Chef — a product site for a restaurant management platform',
    tags: ['SaaS', 'Product site', 'UI/UX', 'English'],
    heroDescription:
      'An English-language product site for Sous Chef, an AI-based restaurant management platform. The site presents what the system does — managing menus across every delivery app from one place, weekly insights and recommended actions to grow revenue — in a dark, modern design with a clear conversion path to booking a demo.',
    metaDescription:
      'A product site for Sous Chef, an AI platform for restaurant management and menu control across delivery apps. Dark design, clear messaging and a conversion path to a demo.',
    imageAlt: 'Screenshot of the Sous Chef homepage — a restaurant management platform',
  },
}

export function applyProjectEn<T extends PortfolioProject>(project: T): T {
  const override = projectsEn[project.slug]
  return override ? { ...project, ...override } : project
}
