type AuthorOverride = {
  name: string
  role: string
  bio: string
}

/** English versions of the author profiles. Keyed by the author id in data/authors.json. */
export const authorsEn: Record<string, AuthorOverride> = {
  eric: {
    name: 'Erik',
    role: 'Head of strategy, creative and production',
    bio: 'Erik is the creative force that makes brands stand out online. He is responsible for building marketing strategies that win, writing sharp scripts that speak to the target audience, and directing the filming and professional production of the content. Erik makes sure your business message cuts through the digital noise, sparks curiosity, and looks as authentic and convincing as it possibly can.',
  },
  michael: {
    name: 'Michael',
    role: 'Head of sales and project management',
    bio: 'Michael is the face of AITERRA to our clients and the driving force behind every project. He runs the sales side and makes sure every stage of the work — from scoping the requirements through to a successful launch — moves smoothly. Michael makes sure we hold to the schedule and deliver exactly the solution your business needs in order to grow.',
  },
  vadim: {
    name: 'Vadim',
    role: 'Lead developer',
    bio: 'Vadim is the technical mind behind the scenes. As our lead developer, he is responsible for turning designs and specifications into clean, fast and secure code. Whether it is a complex website, a busy e-commerce store or building intelligent automations, Vadim delivers uncompromising technical performance that leaves competitors behind.',
  },
  sean: {
    name: 'Sean',
    role: 'Head of development and digital growth (SEO & Google Ads)',
    bio: 'Sean connects the world of code with the world of search engines. He leads our organic search strategy and is also responsible for managing paid campaigns on Google. Alongside driving traffic and warm leads, Sean is responsible for intelligent technical development, making sure that every site we build both works flawlessly and takes the first page across the search landscape.',
  },
}

export function applyAuthorEn<T extends { id: string; name: string; role?: string; bio?: string }>(
  author: T,
): T {
  const override = authorsEn[author.id]
  return override ? { ...author, ...override } : author
}
