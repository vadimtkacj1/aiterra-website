import { SITE_NAME } from '@/lib/seo'

const META_TITLE_MAX = 60
const META_DESCRIPTION_MAX = 160
const META_DESCRIPTION_MIN = 70

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
    bio: 'Michael is the face of Aiterra to our clients and the driving force behind every project. He runs the sales side and makes sure every stage of the work — from scoping the requirements through to a successful launch — moves smoothly. Michael makes sure we hold to the schedule and deliver exactly the solution your business needs in order to grow.',
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

export const authorMetaDescriptionsEn: Record<string, string> = {
  eric: 'Erik heads strategy, creative and production at Aiterra: marketing strategies, sharp scripts for your audience, and professional filming and production.',
  michael: 'Michael heads sales and project management at Aiterra, guiding every project from scoping the requirements through to launch and keeping it on schedule.',
  vadim: 'Vadim is the lead developer at Aiterra, turning designs and specifications into clean, fast and secure code for websites, online stores and automations.',
  sean: 'Sean heads development and digital growth at Aiterra, leading organic search strategy and Google Ads campaigns alongside technical development.',
}

export const authorMetaDescriptionsHe: Record<string, string> = {
  eric: 'אריק מוביל אסטרטגיה, קריאייטיב והפקה ב-AITERRA: אסטרטגיות שיווק, תסריטים חדים שמדברים לקהל היעד וניהול הצילום וההפקה המקצועית של התוכן.',
  michael: 'מיכאל מנהל את המכירות והפרויקטים ב-AITERRA ומלווה כל פרויקט משלב אפיון הצרכים ועד להשקה, כדי שנעמוד בלוחות הזמנים ונספק את מה שהעסק צריך.',
  vadim: 'ואדים הוא המתכנת הראשי של AITERRA והופך עיצובים ואפיונים לקוד נקי, מהיר ומאובטח: אתרים, חנויות איקומרס, מערכות ניהול, אוטומציה וסוכני AI.',
  sean: 'שון מנהל את הפיתוח והקידום הדיגיטלי ב-AITERRA: מוביל את אסטרטגיית הקידום האורגני, מנהל קמפיינים ממומנים בגוגל ואחראי על פיתוח טכנולוגי חכם.',
}

export function authorMetaTitle(name: string, role: string): string {
  const titleFor = (text: string) => `${name} – ${text} | ${SITE_NAME}`
  const full = titleFor(role)
  return full.length <= META_TITLE_MAX ? full : titleFor(role.replace(/\s*\([^)]*\)/g, ''))
}

export function capMetaDescription(text: string): string {
  const clean = text.trim()
  if (clean.length <= META_DESCRIPTION_MAX) return clean
  let wholeSentences = ''
  for (const sentence of clean.match(/[^.!?]+[.!?]+/g) ?? []) {
    if ((wholeSentences + sentence).trim().length > META_DESCRIPTION_MAX) break
    wholeSentences += sentence
  }
  wholeSentences = wholeSentences.trim()
  if (wholeSentences.length >= META_DESCRIPTION_MIN) return wholeSentences
  const wordBoundary = clean.slice(0, META_DESCRIPTION_MAX - 1).replace(/\s+\S*$/, '')
  return `${wordBoundary.replace(/[\s,;:–-]+$/, '')}…`
}

export function applyAuthorEn<T extends { id: string; name: string; role?: string; bio?: string }>(
  author: T,
): T {
  const override = authorsEn[author.id]
  return override ? { ...author, ...override } : author
}
