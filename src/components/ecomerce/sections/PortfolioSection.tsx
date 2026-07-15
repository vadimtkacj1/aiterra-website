import Reveal from '@/components/ecomerce/ui/Reveal'
import SectionHead from '@/components/ecomerce/ui/section-head'

/**
 * Case studies, framed as product windows.
 *
 * There are no real storefront screenshots in the repo, so each one is built
 * from flat geometric primitives — the honest option, and the one the frame
 * style calls for. The rule that makes it work: **colour lives inside the
 * screen and nowhere else.** The window chrome, the title, the tag and the
 * metric row are all monochrome; each project's brand colour appears only
 * within the glass of its own storefront, the way a photograph carries colour
 * that the page around it does not.
 *
 * Swap these blocks for real screenshots before launch — keep the frame,
 * keep the 4:3 screen, keep the metric ledger.
 */

type Project = {
  /** faux domain, set in the marker face inside the window chrome */
  domain: string
  tag: string
  title: string
  /** the headline data point */
  metric: string
  /** the storefront's own brand colour — used ONLY inside the screen */
  brand: string
  /** a second tone of the same family, for the product tiles */
  brandDeep: string
}

const PROJECTS: Project[] = [
  {
    domain: 'brand-x.co.il',
    tag: 'אופנה',
    title: 'בניית פלטפורמת איקומרס למותג X',
    metric: '+187% בהמרות · 0.9s טעינה',
    brand: '#3f78ff',
    brandDeep: '#1a2c9c',
  },
  {
    domain: 'brand-y.store',
    tag: 'לייף־סטייל',
    title: 'עיצוב ופיתוח מותאם אישית למותג Y',
    metric: 'ROAS ×3.2',
    brand: '#9060f5',
    brandDeep: '#45178f',
  },
  {
    domain: 'lior-cosmetics.co.il',
    tag: 'קוסמטיקה',
    title: 'ליאור — קוסמטיקה טבעית',
    metric: '4.6% המרה · +41% בסל ממוצע',
    brand: '#f2618f',
    brandDeep: '#8a1e50',
  },
  {
    domain: 'peak-supps.fit',
    tag: 'תוספי תזונה',
    title: 'PEAK — תוספי תזונה לספורטאים',
    metric: 'ROAS ×2.8 · 63% חוזרים',
    brand: '#19b98a',
    brandDeep: '#0a5c45',
  },
  {
    domain: 'nofar-home.co.il',
    tag: 'עיצוב הבית',
    title: 'נופר — טקסטיל ועיצוב הבית',
    metric: '0.7s טעינה · +54% שהייה',
    brand: '#eda03a',
    brandDeep: '#8a4a12',
  },
]

/** Flat storefront primitive inside an ink window frame. Decorative. */
function StorefrontWindow({ project }: { project: Project }) {
  const { brand, brandDeep } = project
  // `window-frame` clips: on hover the screen pushes toward the reader, and the
  // zoom must not leak past the hairline. The frame itself never moves — the
  // frame is the drawing, the screen is the thing being drawn.
  return (
    <div className="window-frame rule-all border-(--fg)">
      {/* window chrome — an ink strip: the frame inverts against the paper band */}
      {/* The chrome sits OUTSIDE the aria-hidden screen below, so the domain is
          real exposed text and does not get the decorative drawing's exemption
          from the 12px floor. It only has to clear that floor where the type is
          read at arm's length; the desktop drawing keeps the 11px it is cut for. */}
      <div className="band-ink flex items-center px-4 py-2.5">
        <span dir="ltr" className="mark t-muted text-[12px] md:text-[11px]">
          {project.domain}
        </span>
      </div>

      {/* the screen — a fixed 4:3 slot so every card lines up whether it holds
          this primitive or a real screenshot later */}
      <div
        aria-hidden
        className="window-screen flex aspect-4/3 flex-col gap-2.5 bg-paper-sunken p-3"
      >
        {/* storefront hero banner */}
        <div
          className="flex h-[38%] shrink-0 items-end justify-between p-3"
          style={{ background: brand }}
        >
          <span className="flex flex-col gap-1.5">
            <span className="block h-2 w-20 bg-white/90" />
            <span className="block h-1.5 w-12 bg-white/55" />
          </span>
          <span className="bg-white px-2 py-1 text-[9px] font-bold text-ink">
            קנו עכשיו
          </span>
        </div>

        {/* product grid */}
        <div className="grid flex-1 grid-cols-3 gap-2.5">
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex flex-col gap-1.5">
              <span
                className="block flex-1"
                style={{ background: i % 2 === 0 ? brand : brandDeep }}
              />
              <span className="block h-1 w-3/4 bg-ink/20" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function ProjectCard({ project, index }: { project: Project; index: number }) {
  return (
    <article className="group flex h-full flex-col">
      <StorefrontWindow project={project} />

      <div className="mt-5 flex items-center gap-4">
        <span className="mark t-accent text-[12px] font-bold">
          {String(index + 1).padStart(2, '0')}
        </span>
        <span className="label t-dim">{project.tag}</span>
      </div>

      {/* the title answers the hover with a rule of its own */}
      <h3 className="sweep mt-3 text-[20px] leading-snug">{project.title}</h3>

      {/* metric ledger — mt-auto keeps the rows aligned across a whole row of
          cards no matter how long the titles run. Below sm the grid is one
          column, so a card is only as tall as its content and there is no free
          space for mt-auto to claim: it resolves to 0 and the ledger's rule
          lands on the title's descenders, reading as an underline welded to the
          heading. The single column is the only case with no row to align to,
          so that is also the only place a fixed margin can stand in for it. */}
      {/* `dir` sits on an inner span: on the auto-margin element itself it
          would flip the inline axis and push the metric the wrong way. */}
      <dl className="rule-t mt-auto max-sm:mt-6 flex items-baseline gap-3 pt-4">
        <dt className="label t-dim shrink-0">מדד</dt>
        <dd className="ms-auto">
          <span dir="ltr" className="mark t-fg text-[13px] font-bold">
            {project.metric}
          </span>
        </dd>
      </dl>
    </article>
  )
}

export default function PortfolioSection() {
  return (
    <section id="portfolio" dir="rtl" className="band-paper">
      <div className="col-rules mx-auto max-w-7xl px-5 py-24 md:px-8 md:py-32">
        <div className="relative z-10">
          <SectionHead
            index="04"
            label="Selected Work"
            title="העבודות שלנו. התוצאות שלכם."
            lede="כל חנות נבנית מאפס סביב המותג, הקהל והמטרות העסקיות — לא על תבנית מדף. אלה כמה מהפרויקטים שאנחנו הכי גאים בהם."
            meta={<span className="mark t-dim text-[12px]">05 / 05</span>}
          />

          <div className="mt-16 grid grid-cols-1 gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
            {PROJECTS.map((project, i) => (
              <Reveal key={project.domain} delay={(i % 3) * 80} className="h-full">
                <ProjectCard project={project} index={i} />
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
