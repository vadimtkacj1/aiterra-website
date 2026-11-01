import Image from 'next/image'
import Reveal from '@/components/ecomerce/ui/Reveal'
import SectionHead from '@/components/ecomerce/ui/section-head'
import { getAllPortfolioProjects } from '@/lib/portfolio-server'

const SHOWCASE_STORES = [
  { slug: 'neot-sade', title: 'נאות שדה — חנות פירות וירקות אונליין', tag: 'חנות אונליין' },
  {
    slug: 'ecommerce-store',
    title: 'טבעי שזה מרענן — מיצים טבעיים ומשקאות פרימיום',
    tag: 'חנות אונליין',
  },
]

type Store = {
  slug: string
  title: string
  tag: string
  stack: string
  url: string
  domain: string
  screenshot: string
  alt: string
}

function loadShowcaseStores(): Store[] {
  const projects = getAllPortfolioProjects()

  return SHOWCASE_STORES.flatMap(({ slug, title, tag }) => {
    const project = projects.find((candidate) => candidate.slug === slug)
    const url = project?.liveSiteUrl || project?.externalUrl
    if (!project || !url) return []

    return [
      {
        slug,
        title,
        tag,
        stack: project.technology || project.tags.join(' · '),
        url,
        domain: new URL(url).hostname.replace(/^www\./, ''),
        screenshot: project.screenshot || project.image,
        alt: project.imageAlt || title,
      },
    ]
  })
}

function StorefrontWindow({ store }: { store: Store }) {
  return (
    <div className="window-frame rule-all border-(--fg)">
      <div className="band-ink flex items-center px-4 py-2.5">
        <span dir="ltr" className="mark t-muted text-[12px] md:text-[11px]">
          {store.domain}
        </span>
      </div>

      <div className="window-screen relative aspect-4/3 bg-paper-sunken">
        <Image
          src={store.screenshot}
          alt={store.alt}
          fill
          sizes="(max-width: 640px) 92vw, 600px"
          unoptimized
          className="object-cover object-top"
        />
      </div>
    </div>
  )
}

function StoreCard({ store, index }: { store: Store; index: number }) {
  return (
    <article className="group relative flex h-full flex-col">
      <StorefrontWindow store={store} />

      <div className="mt-5 flex items-center gap-4">
        <span className="mark t-accent text-[12px] font-bold">
          {String(index + 1).padStart(2, '0')}
        </span>
        <span className="label t-dim">{store.tag}</span>
      </div>

      <h3 className="sweep mt-3 text-[20px] leading-snug">
        <a
          href={store.url}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${store.title} — פתיחת האתר החי בחלון חדש`}
          className="after:absolute after:inset-0 after:content-['']"
        >
          {store.title}
        </a>
      </h3>

      <dl className="rule-t mt-auto max-sm:mt-6 flex items-baseline gap-3 pt-4">
        <dt className="label t-dim shrink-0">טכנולוגיה</dt>
        <dd className="ms-auto">
          <span className="mark t-fg text-[13px] font-bold">{store.stack}</span>
        </dd>
      </dl>
    </article>
  )
}

export default function PortfolioSection() {
  const stores = loadShowcaseStores()
  if (stores.length === 0) return null

  return (
    <section id="portfolio" dir="rtl" className="band-paper">
      <div className="col-rules mx-auto max-w-7xl px-5 py-24 md:px-8 md:py-32">
        <div className="relative z-10">
          <SectionHead
            index="04"
            label="Selected Work"
            title="חנויות שבנינו. באוויר עכשיו."
            lede="החנויות שמוצגות כאן נבנו בקוד מאפס, סביב המותג, הקהל והמטרות העסקיות — לא על תבנית מדף. אלה חנויות אמיתיות שפועלות היום, ואפשר להיכנס אליהן ולבדוק בעצמכם."
          />

          <div className="mt-16 grid grid-cols-1 gap-x-8 gap-y-14 sm:grid-cols-2">
            {stores.map((store, i) => (
              <Reveal key={store.slug} delay={i * 80} className="h-full">
                <StoreCard store={store} index={i} />
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
