import { Code2, TrendingUp, Palette, Users } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import Reveal from '@/components/ecomerce/ui/Reveal'
import SectionHead from '@/components/ecomerce/ui/section-head'

type TeamMember = {
  title: string
  desc: string
  icon: LucideIcon
}

const TEAM: TeamMember[] = [
  {
    title: '2 מפתחים',
    desc: 'שידאגו לקוד נקי, מערכת יציבה ומהירות טעינה פסיכית.',
    icon: Code2,
  },
  {
    title: 'איש שיווק',
    desc: 'שמוודא שהחנות בנויה להמרות ולחיבור מושלם לקמפיינים.',
    icon: TrendingUp,
  },
  {
    title: 'מעצב גרפי ועורך וידאו',
    desc: 'אישיים, שייצרו עבורכם שפה עיצובית עוצרת נשימה.',
    icon: Palette,
  },
  {
    title: 'מנהל פרויקט צמוד',
    desc: 'שילווה אתכם יד ביד בכל שלב בדרך.',
    icon: Users,
  },
]

/**
 * The team, set as a ruled register rather than four floating cards. Each role
 * is a cell in a hairline grid: seat number, icon, role, remit. The grid seams
 * ARE the container — nothing is boxed, nothing is elevated.
 */
export default function TeamSection() {
  return (
    <section id="team" dir="rtl" className="band-paper">
      <div className="col-rules mx-auto max-w-7xl px-5 py-24 md:px-8 md:py-32">
        <div className="relative z-10">
          <SectionHead
            index="02"
            label="הצוות שלכם"
            title={
              <>
                כדי לתת לכם את התוצאה הטובה ביותר, העמדנו לרשותכם נבחרת של מומחים.
              </>
            }
            meta={
              <span className="label t-dim">5 מומחים רב-תחומיים</span>
            }
          />

          <ul className="rule-t mt-12 grid grid-cols-1 sm:grid-cols-2 md:mt-16 lg:grid-cols-4">
            {TEAM.map((member, i) => {
              const Icon = member.icon
              return (
                <Reveal
                  key={member.title}
                  as="li"
                  delay={i * 70}
                  // Inline padding is tied to the divider, not applied blindly:
                  // a cell is only inset on the side where a rule actually
                  // separates it from a neighbour, so the grid's outer cells
                  // stay flush with the content well at every breakpoint.
                  className={[
                    'rule-b flex flex-col gap-5 py-7 sm:pe-7 md:gap-6 md:py-9 lg:py-11',
                    i % 2 === 1 && 'sm:rule-s sm:ps-7',
                    i > 0 && 'lg:rule-s lg:ps-7',
                  ]
                    .filter(Boolean)
                    .join(' ')}
                >
                  <div className="flex items-center gap-4">
                    <span className="mark t-accent text-[12px] font-bold">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <Icon className="t-fg h-5 w-5" strokeWidth={1.8} aria-hidden />
                  </div>

                  <div className="flex flex-col gap-3">
                    <h3 className="text-[21px] leading-tight md:text-[23px]">
                      {member.title}
                    </h3>
                    <p className="t-muted text-[15px] leading-relaxed md:text-[14.5px]">
                      {member.desc}
                    </p>
                  </div>
                </Reveal>
              )
            })}
          </ul>
        </div>
      </div>
    </section>
  )
}
